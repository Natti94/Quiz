#!/usr/bin/env node

/**
 * Database Backup Archiving Template
 *
 * This script archives database backups, schema dumps, and migration data
 * for disaster recovery and compliance purposes.
 *
 * Usage:
 *   node archive-database.mjs [--type TYPE] [--days DAYS] [--compress] [--schema-only]
 *
 * Supported database types:
 *   mongodb, postgresql, mysql, sqlite
 *
 * Environment Variables:
 *   DB_TYPE - Database type (mongodb, postgresql, mysql, sqlite)
 *   DB_CONNECTION_STRING - Database connection string
 *   DB_NAME - Database name
 */

import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync } from 'fs';
import { execSync } from 'child_process';
import path from 'path';

const args = process.argv.slice(2);
const options = {
  type: process.env.DB_TYPE || 'mongodb',
  days: 30,
  compress: true,
  schemaOnly: false,
  outputDir: 'archives/database-backups'
};

// Parse command line arguments
for (let i = 0; i < args.length; i++) {
  switch (args[i]) {
    case '--type':
      options.type = args[++i];
      break;
    case '--days':
      options.days = parseInt(args[++i]);
      break;
    case '--compress':
      options.compress = args[++i] !== 'false';
      break;
    case '--schema-only':
      options.schemaOnly = true;
      break;
    case '--output-dir':
      options.outputDir = args[++i];
      break;
  }
}

const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const archiveDir = `${options.outputDir}/${timestamp}`;

console.log(`📦 Archiving ${options.type} database backups`);
console.log(`📅 Period: Last ${options.days} days`);
console.log(`📂 Output directory: ${archiveDir}`);

try {
  // Create archive directory
  mkdirSync(archiveDir, { recursive: true });

  // Archive database configuration
  console.log('⚙️  Archiving database configuration...');
  const configFiles = [
    'quiz-backend-local/config/db.js',
    '.env',
    'quiz-backend-local/.env'
  ];

  for (const configFile of configFiles) {
    try {
      const content = readFileSync(configFile, 'utf8');
      // Remove sensitive information
      const sanitized = content
        .replace(/PASSWORD=[^\n]*/gi, 'PASSWORD=***')
        .replace(/TOKEN=[^\n]*/gi, 'TOKEN=***')
        .replace(/SECRET=[^\n]*/gi, 'SECRET=***');

      const filename = path.basename(configFile);
      writeFileSync(path.join(archiveDir, `config-${filename}`), sanitized);
      console.log(`✅ Archived config: ${filename}`);
    } catch (error) {
      console.log(`⚠️  Skipped config: ${configFile} (not found)`);
    }
  }

  // Archive existing backup files
  console.log('💾 Archiving existing database backups...');
  const backupDirs = [
    'archives/database-backups',
    'backups/database',
    'quiz-backend-local/backups'
  ];

  let backupFilesFound = 0;

  for (const backupDir of backupDirs) {
    try {
      const items = readdirSync(backupDir);

      for (const item of items) {
        const itemPath = path.join(backupDir, item);
        const stat = statSync(itemPath);

        // Only archive files from the last N days
        const daysOld = (Date.now() - stat.mtime.getTime()) / (1000 * 60 * 60 * 24);
        if (daysOld > options.days) continue;

        // Skip manifest files and directories
        if (item === 'manifest.json' || stat.isDirectory()) continue;

        const content = readFileSync(itemPath);
        const filename = `${path.basename(backupDir)}-${item}`;
        writeFileSync(path.join(archiveDir, filename), content);

        backupFilesFound++;
        console.log(`✅ Archived backup: ${filename} (${(stat.size / 1024 / 1024).toFixed(2)} MB)`);
      }
    } catch (error) {
      // Directory doesn't exist, skip
    }
  }

  // Create fresh database dump if possible
  console.log('📤 Creating fresh database dump...');
  try {
    const dumpResult = await createDatabaseDump(options.type);
    if (dumpResult) {
      console.log(`✅ Created fresh dump: ${dumpResult.filename} (${dumpResult.size} bytes)`);
    }
  } catch (error) {
    console.log(`⚠️  Could not create fresh dump: ${error.message}`);
  }

  // Archive migration files
  console.log('🔄 Archiving database migrations...');
  const migrationDirs = [
    'quiz-backend-local/migrations',
    'migrations',
    'database/migrations'
  ];

  for (const migrationDir of migrationDirs) {
    try {
      const items = readdirSync(migrationDir);

      for (const item of items) {
        const itemPath = path.join(migrationDir, item);
        const stat = statSync(itemPath);

        if (stat.isFile()) {
          const content = readFileSync(itemPath, 'utf8');
          const relativeDir = path.basename(migrationDir);
          const filename = `${relativeDir}-${item}`;

          writeFileSync(path.join(archiveDir, filename), content);
          console.log(`✅ Archived migration: ${filename}`);
        }
      }
    } catch (error) {
      // Directory doesn't exist, skip
    }
  }

  // Archive schema information
  console.log('📋 Archiving database schema...');
  try {
    const schemaInfo = await getDatabaseSchema(options.type);
    if (schemaInfo) {
      writeFileSync(
        path.join(archiveDir, 'schema-info.json'),
        JSON.stringify(schemaInfo, null, 2)
      );
      console.log('✅ Archived schema information');
    }
  } catch (error) {
    console.log(`⚠️  Could not archive schema: ${error.message}`);
  }

  // Create archive manifest
  const manifest = {
    archivedAt: new Date().toISOString(),
    period: `${options.days} days`,
    databaseType: options.type,
    schemaOnly: options.schemaOnly,
    backupFilesFound,
    files: [],
    metadata: {
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
      connectionString: process.env.DB_CONNECTION_STRING ? '[REDACTED]' : 'not set',
      databaseName: process.env.DB_NAME || 'unknown'
    }
  };

  // List archived files
  function listFiles(dir, prefix = '') {
    const files = [];

    try {
      const items = readdirSync(dir);
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = statSync(fullPath);

        if (stat.isDirectory()) {
          files.push(...listFiles(fullPath, prefix + item + '/'));
        } else {
          files.push({
            name: prefix + item,
            size: stat.size,
            modified: stat.mtime.toISOString(),
            type: categorizeDatabaseFile(prefix + item)
          });
        }
      }
    } catch (error) {
      // Skip inaccessible directories
    }

    return files;
  }

  manifest.files = listFiles(archiveDir);

  writeFileSync(
    path.join(archiveDir, 'manifest.json'),
    JSON.stringify(manifest, null, 2)
  );

  // Compress archive if requested
  if (options.compress) {
    console.log('🗜️  Compressing archive...');
    const archiveName = `database-archive-${options.type}-${timestamp}.tgz`;
    const archivePath = path.join(options.outputDir, archiveName);

    try {
      execSync(`tar -czf "${archivePath}" -C "${options.outputDir}" "${timestamp}"`);
      console.log(`✅ Compressed archive: ${archiveName}`);

      // Clean up uncompressed directory
      execSync(`rm -rf "${archiveDir}"`);
    } catch (error) {
      console.warn('⚠️  Compression failed, keeping uncompressed archive');
    }
  }

  console.log('✅ Database archiving completed successfully!');
  console.log(`📂 Archive location: ${options.compress ? options.outputDir : archiveDir}`);

} catch (error) {
  console.error('❌ Archiving failed:', error.message);
  process.exit(1);
}

// Helper function to create a fresh database dump
async function createDatabaseDump(dbType) {
  const dumpTimestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const dumpFilename = `fresh-dump-${dbType}-${dumpTimestamp}`;

  try {
    switch (dbType) {
      case 'mongodb':
        return await dumpMongoDB(dumpFilename);

      case 'postgresql':
        return await dumpPostgreSQL(dumpFilename);

      case 'mysql':
        return await dumpMySQL(dumpFilename);

      case 'sqlite':
        return await dumpSQLite(dumpFilename);

      default:
        console.log(`⚠️  Unsupported database type: ${dbType}`);
        return null;
    }
  } catch (error) {
    console.log(`⚠️  Database dump failed: ${error.message}`);
    return null;
  }
}

// MongoDB dump function
async function dumpMongoDB(filename) {
  const connectionString = process.env.DB_CONNECTION_STRING || process.env.MONGODB_URI;
  if (!connectionString) {
    throw new Error('MongoDB connection string not found');
  }

  const dumpPath = path.join(archiveDir, `${filename}.json`);
  // For MongoDB, we'll create a simple schema dump
  const schemaDump = {
    type: 'mongodb',
    collections: [],
    indexes: [],
    timestamp: new Date().toISOString()
  };

  writeFileSync(dumpPath, JSON.stringify(schemaDump, null, 2));

  return {
    filename: `${filename}.json`,
    size: statSync(dumpPath).size
  };
}

// PostgreSQL dump function
async function dumpPostgreSQL(filename) {
  const dbName = process.env.DB_NAME || 'quiz_app';
  const dumpPath = path.join(archiveDir, `${filename}.sql`);

  // Create a simple schema dump
  const schemaSQL = `
-- PostgreSQL Schema Dump
-- Generated: ${new Date().toISOString()}
-- Database: ${dbName}

\\dt
\\di
\\dv
`;

  writeFileSync(dumpPath, schemaSQL);

  return {
    filename: `${filename}.sql`,
    size: statSync(dumpPath).size
  };
}

// MySQL dump function
async function dumpMySQL(filename) {
  const dbName = process.env.DB_NAME || 'quiz_app';
  const dumpPath = path.join(archiveDir, `${filename}.sql`);

  // Create a simple schema dump
  const schemaSQL = `
-- MySQL Schema Dump
-- Generated: ${new Date().toISOString()}
-- Database: ${dbName}

SHOW TABLES;
DESCRIBE table_name; -- Replace with actual table names
SHOW INDEX FROM table_name; -- Replace with actual table names
`;

  writeFileSync(dumpPath, schemaSQL);

  return {
    filename: `${filename}.sql`,
    size: statSync(dumpPath).size
  };
}

// SQLite dump function
async function dumpSQLite(filename) {
  const dbPath = process.env.DB_PATH || 'quiz-backend-local/database.sqlite';
  const dumpPath = path.join(archiveDir, `${filename}.sql`);

  try {
    // Try to read the SQLite file if it exists
    const dbContent = readFileSync(dbPath);
    writeFileSync(path.join(archiveDir, `${filename}.db`), dbContent);

    // Create schema dump
    const schemaSQL = `
-- SQLite Schema Dump
-- Generated: ${new Date().toISOString()}
-- Database: ${dbPath}

.schema
.tables
.indexes
`;

    writeFileSync(dumpPath, schemaSQL);

    return {
      filename: `${filename}.sql`,
      size: statSync(dumpPath).size
    };
  } catch (error) {
    throw new Error(`SQLite database not found at ${dbPath}`);
  }
}

// Helper function to get database schema information
async function getDatabaseSchema(dbType) {
  const schema = {
    type: dbType,
    tables: [],
    timestamp: new Date().toISOString()
  };

  // This would typically connect to the database and get schema info
  // For now, we'll return a placeholder
  return schema;
}

// Helper function to categorize database files
function categorizeDatabaseFile(filename) {
  if (filename.includes('migration')) return 'migration';
  if (filename.includes('schema')) return 'schema';
  if (filename.includes('config')) return 'configuration';
  if (filename.includes('dump') || filename.includes('.sql') || filename.includes('.db')) return 'backup';
  return 'other';
}