#!/usr/bin/env node

/**
 * Runtime Application Logs Archiving Template
 *
 * This script archives application runtime logs, error logs, and performance
 * metrics for debugging and monitoring purposes.
 *
 * Usage:
 *   node archive-runtime-logs.mjs [--days DAYS] [--compress] [--rotate]
 *
 * Environment Variables:
 *   LOG_LEVEL - Minimum log level to archive (debug, info, warn, error)
 *   LOG_MAX_SIZE - Maximum log file size in MB before rotation
 */

import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync, unlinkSync } from 'fs';
import { execSync } from 'child_process';
import path from 'path';

const args = process.argv.slice(2);
const options = {
  days: 7,
  compress: true,
  rotate: false,
  maxSize: parseInt(process.env.LOG_MAX_SIZE) || 100, // MB
  logLevel: process.env.LOG_LEVEL || 'info',
  outputDir: 'archives/runtime-logs'
};

// Parse command line arguments
for (let i = 0; i < args.length; i++) {
  switch (args[i]) {
    case '--days':
      options.days = parseInt(args[++i]);
      break;
    case '--compress':
      options.compress = args[++i] !== 'false';
      break;
    case '--rotate':
      options.rotate = true;
      break;
    case '--max-size':
      options.maxSize = parseInt(args[++i]);
      break;
    case '--output-dir':
      options.outputDir = args[++i];
      break;
  }
}

const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const archiveDir = `${options.outputDir}/${timestamp}`;

console.log(`📦 Archiving runtime application logs`);
console.log(`📅 Period: Last ${options.days} days`);
console.log(`📂 Output directory: ${archiveDir}`);

try {
  // Create archive directory
  mkdirSync(archiveDir, { recursive: true });

  // Define log sources to archive
  const logSources = [
    {
      name: 'application-logs',
      paths: [
        'logs/app.log',
        'logs/application.log',
        'logfs/runtime.log',
        'quiz-backend-local/logs/app.log'
      ],
      pattern: /\.log$/
    },
    {
      name: 'error-logs',
      paths: [
        'logs/error.log',
        'logs/errors.log',
        'logfs/errors.log',
        'quiz-backend-local/logs/error.log'
      ],
      pattern: /(error|err)/i
    },
    {
      name: 'performance-logs',
      paths: [
        'logs/performance.log',
        'logs/metrics.log',
        'logfs/performance.log'
      ],
      pattern: /(perf|metrics)/i
    },
    {
      name: 'netlify-functions',
      paths: [
        'logs/netlify-functions.log',
        'quiz-frontend/netlify/functions/logs/*.log'
      ],
      pattern: /\.log$/
    }
  ];

  let totalFilesArchived = 0;
  let totalSizeArchived = 0;

  // Archive each log source
  for (const source of logSources) {
    console.log(`📋 Archiving ${source.name}...`);

    for (const logPath of source.paths) {
      try {
        // Handle glob patterns
        if (logPath.includes('*')) {
          const glob = await import('fast-glob');
          const matches = await glob.default(logPath);

          for (const match of matches) {
            const result = await archiveLogFile(match, source.name);
            if (result) {
              totalFilesArchived++;
              totalSizeArchived += result.size;
            }
          }
        } else {
          const result = await archiveLogFile(logPath, source.name);
          if (result) {
            totalFilesArchived++;
            totalSizeArchived += result.size;
          }
        }
      } catch (error) {
        console.log(`⚠️  Skipped: ${logPath} (${error.message})`);
      }
    }
  }

  // Archive system logs if available
  console.log('🖥️  Archiving system logs...');
  try {
    const systemLogs = [
      'logs/system.log',
      'logfs/system.log'
    ];

    for (const sysLog of systemLogs) {
      const result = await archiveLogFile(sysLog, 'system');
      if (result) {
        totalFilesArchived++;
        totalSizeArchived += result.size;
      }
    }
  } catch (error) {
    console.log('⚠️  Could not archive system logs');
  }

  // Archive log rotation history
  console.log('🔄 Archiving log rotation metadata...');
  try {
    const rotationData = {
      rotatedAt: new Date().toISOString(),
      period: `${options.days} days`,
      maxSize: `${options.maxSize}MB`,
      logLevel: options.logLevel,
      sources: logSources.map(s => s.name)
    };

    writeFileSync(
      path.join(archiveDir, 'rotation-metadata.json'),
      JSON.stringify(rotationData, null, 2)
    );
  } catch (error) {
    console.log('⚠️  Could not create rotation metadata');
  }

  // Perform log rotation if requested
  if (options.rotate) {
    console.log('🔄 Performing log rotation...');
    await performLogRotation();
  }

  // Create archive manifest
  const manifest = {
    archivedAt: new Date().toISOString(),
    period: `${options.days} days`,
    type: 'runtime-application-logs',
    totalFiles: totalFilesArchived,
    totalSize: totalSizeArchived,
    compressionEnabled: options.compress,
    rotationPerformed: options.rotate,
    files: [],
    metadata: {
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
      logLevel: options.logLevel,
      maxSize: `${options.maxSize}MB`
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
            category: categorizeLogFile(prefix + item)
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
    const archiveName = `runtime-logs-archive-${timestamp}.tgz`;
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

  console.log('✅ Runtime logs archiving completed successfully!');
  console.log(`📂 Archive location: ${options.compress ? options.outputDir : archiveDir}`);
  console.log(`📊 Archived ${totalFilesArchived} files (${(totalSizeArchived / 1024 / 1024).toFixed(2)} MB)`);

} catch (error) {
  console.error('❌ Archiving failed:', error.message);
  process.exit(1);
}

// Helper function to archive a single log file
async function archiveLogFile(logPath, category) {
  try {
    const stat = statSync(logPath);

    // Skip if file is too old
    const daysOld = (Date.now() - stat.mtime.getTime()) / (1000 * 60 * 60 * 24);
    if (daysOld > options.days) {
      return null;
    }

    // Skip if file is too large
    const sizeMB = stat.size / (1024 * 1024);
    if (sizeMB > options.maxSize) {
      console.log(`⚠️  Skipping large file: ${logPath} (${sizeMB.toFixed(2)} MB)`);
      return null;
    }

    const content = readFileSync(logPath, 'utf8');
    const filename = path.basename(logPath);
    const categoryDir = path.join(archiveDir, category);

    mkdirSync(categoryDir, { recursive: true });
    writeFileSync(path.join(categoryDir, filename), content);

    console.log(`✅ Archived: ${category}/${filename} (${sizeMB.toFixed(2)} MB)`);

    return {
      name: `${category}/${filename}`,
      size: stat.size,
      modified: stat.mtime.toISOString()
    };

  } catch (error) {
    if (error.code !== 'ENOENT') {
      console.log(`⚠️  Error archiving ${logPath}: ${error.message}`);
    }
    return null;
  }
}

// Helper function to categorize log files
function categorizeLogFile(filename) {
  if (filename.includes('error') || filename.includes('err')) return 'errors';
  if (filename.includes('performance') || filename.includes('perf') || filename.includes('metrics')) return 'performance';
  if (filename.includes('netlify')) return 'netlify';
  if (filename.includes('system')) return 'system';
  return 'application';
}

// Helper function to perform log rotation
async function performLogRotation() {
  try {
    // Find log files older than retention period
    const { glob } = await import('fast-glob');
    const logFiles = await glob('logs/**/*.log');

    let rotatedCount = 0;
    for (const logFile of logFiles) {
      try {
        const stat = statSync(logFile);
        const daysOld = (Date.now() - stat.mtime.getTime()) / (1000 * 60 * 60 * 24);

        if (daysOld > options.days) {
          unlinkSync(logFile);
          rotatedCount++;
          console.log(`🗑️  Rotated old log: ${logFile}`);
        }
      } catch (error) {
        console.log(`⚠️  Could not rotate ${logFile}: ${error.message}`);
      }
    }

    console.log(`🔄 Rotated ${rotatedCount} old log files`);
  } catch (error) {
    console.log('⚠️  Log rotation failed:', error.message);
  }
}