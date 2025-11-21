#!/usr/bin/env node

/**
 * Netlify Functions Log Archiving Template
 *
 * This script archives Netlify function logs and deployment data
 * for debugging and compliance purposes.
 *
 * Usage:
 *   node archive-netlify-logs.mjs [--site-id SITE_ID] [--days DAYS] [--compress]
 *
 * Environment Variables:
 *   NETLIFY_AUTH_TOKEN - Netlify API token
 *   NETLIFY_SITE_ID - Site ID (can also be passed as --site-id)
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { execSync } from 'child_process';
import path from 'path';

const args = process.argv.slice(2);
const options = {
  siteId: process.env.NETLIFY_SITE_ID,
  days: 7,
  compress: false,
  outputDir: 'archives/netlify-logs'
};

// Parse command line arguments
for (let i = 0; i < args.length; i++) {
  switch (args[i]) {
    case '--site-id':
      options.siteId = args[++i];
      break;
    case '--days':
      options.days = parseInt(args[++i]);
      break;
    case '--compress':
      options.compress = true;
      break;
    case '--output-dir':
      options.outputDir = args[++i];
      break;
  }
}

if (!options.siteId) {
  console.error('Error: NETLIFY_SITE_ID environment variable or --site-id parameter required');
  process.exit(1);
}

const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const archiveDir = `${options.outputDir}/${timestamp}`;

console.log(`📦 Archiving Netlify logs for site: ${options.siteId}`);
console.log(`📅 Period: Last ${options.days} days`);
console.log(`📂 Output directory: ${archiveDir}`);

try {
  // Create archive directory
  mkdirSync(archiveDir, { recursive: true });

  // Archive deployment information
  console.log('🔍 Fetching deployment data...');
  try {
    const deployments = execSync(
      `netlify api listSiteDeployments --data '{"site_id":"${options.siteId}"}'`,
      { encoding: 'utf8' }
    );

    writeFileSync(
      path.join(archiveDir, 'deployments.json'),
      JSON.stringify(JSON.parse(deployments), null, 2)
    );
  } catch (error) {
    console.warn('⚠️  Could not fetch deployments via API, skipping...');
  }

  // Archive function logs (if available locally)
  console.log('📋 Archiving function logs...');
  const functionsDir = 'quiz-frontend/netlify/functions';
  const logFiles = [
    'logs/netlify-functions.log',
    'logfs/netlify-dev.log',
    'quiz-frontend/netlify.toml'
  ];

  for (const logFile of logFiles) {
    try {
      const content = readFileSync(logFile, 'utf8');
      const filename = path.basename(logFile);
      writeFileSync(path.join(archiveDir, filename), content);
      console.log(`✅ Archived: ${filename}`);
    } catch (error) {
      console.log(`⚠️  Skipped: ${logFile} (not found)`);
    }
  }

  // Archive build logs from recent commits
  console.log('🏗️  Archiving build-related commits...');
  try {
    const buildCommits = execSync(
      `git log --oneline --since="${options.days} days ago" --grep="build\\|deploy\\|release"`,
      { encoding: 'utf8' }
    );

    writeFileSync(path.join(archiveDir, 'build-commits.log'), buildCommits);
  } catch (error) {
    console.log('⚠️  Could not fetch build commits');
  }

  // Create archive manifest
  const manifest = {
    siteId: options.siteId,
    archivedAt: new Date().toISOString(),
    period: `${options.days} days`,
    files: [],
    metadata: {
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch
    }
  };

  // List archived files
  const { readdirSync, statSync } = await import('fs');
  manifest.files = readdirSync(archiveDir).map(file => ({
    name: file,
    size: statSync(path.join(archiveDir, file)).size,
    modified: statSync(path.join(archiveDir, file)).mtime.toISOString()
  }));

  writeFileSync(
    path.join(archiveDir, 'manifest.json'),
    JSON.stringify(manifest, null, 2)
  );

  // Compress archive if requested
  if (options.compress) {
    console.log('🗜️  Compressing archive...');
    const archiveName = `netlify-archive-${timestamp}.tgz`;
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

  console.log('✅ Netlify log archiving completed successfully!');
  console.log(`📂 Archive location: ${options.compress ? options.outputDir : archiveDir}`);

} catch (error) {
  console.error('❌ Archiving failed:', error.message);
  process.exit(1);
}