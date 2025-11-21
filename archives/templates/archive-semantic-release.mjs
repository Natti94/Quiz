#!/usr/bin/env node

/**
 * Semantic Release & CI/CD Artifacts Archiving Template
 *
 * This script archives semantic-release dry run logs, CI/CD artifacts,
 * and release-related data for debugging and compliance purposes.
 *
 * Usage:
 *   node archive-semantic-release.mjs [--days DAYS] [--compress] [--include-artifacts]
 *
 * Environment Variables:
 *   GITHUB_TOKEN - GitHub API token for artifact access
 *   GITHUB_REPOSITORY - Repository in format owner/repo
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { execSync } from 'child_process';
import path from 'path';

const args = process.argv.slice(2);
const options = {
  days: 30,
  compress: false,
  includeArtifacts: false,
  outputDir: 'archives/semantic-release'
};

// Parse command line arguments
for (let i = 0; i < args.length; i++) {
  switch (args[i]) {
    case '--days':
      options.days = parseInt(args[++i]);
      break;
    case '--compress':
      options.compress = true;
      break;
    case '--include-artifacts':
      options.includeArtifacts = true;
      break;
    case '--output-dir':
      options.outputDir = args[++i];
      break;
  }
}

const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const archiveDir = `${options.outputDir}/${timestamp}`;

console.log(`📦 Archiving semantic-release and CI/CD data`);
console.log(`📅 Period: Last ${options.days} days`);
console.log(`📂 Output directory: ${archiveDir}`);

try {
  // Create archive directory
  mkdirSync(archiveDir, { recursive: true });

  // Archive semantic-release configuration
  console.log('🔧 Archiving semantic-release configuration...');
  const configFiles = [
    '.releaserc.json',
    '.releaserc.js',
    'package.json',
    '.github/workflows/release.yml'
  ];

  for (const configFile of configFiles) {
    try {
      const content = readFileSync(configFile, 'utf8');
      const filename = path.basename(configFile);
      writeFileSync(path.join(archiveDir, filename), content);
      console.log(`✅ Archived config: ${filename}`);
    } catch (error) {
      console.log(`⚠️  Skipped config: ${configFile} (not found)`);
    }
  }

  // Archive recent semantic-release dry run logs
  console.log('📋 Archiving semantic-release logs...');
  const logFiles = [
    'semantic-release-dryrun.log',
    'logs/semantic-release.log',
    'logfs/semantic-release-debug.log'
  ];

  for (const logFile of logFiles) {
    try {
      const content = readFileSync(logFile, 'utf8');
      const filename = path.basename(logFile);
      writeFileSync(path.join(archiveDir, filename), content);
      console.log(`✅ Archived log: ${filename}`);
    } catch (error) {
      console.log(`⚠️  Skipped log: ${logFile} (not found)`);
    }
  }

  // Archive release-related git data
  console.log('🏷️  Archiving release tags and commits...');
  try {
    // Get recent tags
    const tags = execSync('git tag --sort=-version:refname | head -20', { encoding: 'utf8' });
    writeFileSync(path.join(archiveDir, 'recent-tags.txt'), tags);

    // Get commits since last release
    const lastTag = execSync('git describe --tags --abbrev=0 2>/dev/null || echo "no-tags"', { encoding: 'utf8' }).trim();
    let commitsSinceLastRelease = '';
    if (lastTag !== 'no-tags') {
      commitsSinceLastRelease = execSync(`git log --oneline ${lastTag}..HEAD`, { encoding: 'utf8' });
    } else {
      commitsSinceLastRelease = execSync('git log --oneline -20', { encoding: 'utf8' });
    }
    writeFileSync(path.join(archiveDir, 'commits-since-last-release.txt'), commitsSinceLastRelease);

    // Get conventional commit analysis
    const conventionalCommits = execSync(
      `git log --oneline --since="${options.days} days ago" | head -50`,
      { encoding: 'utf8' }
    );
    writeFileSync(path.join(archiveDir, 'conventional-commits-analysis.txt'), conventionalCommits);

  } catch (error) {
    console.log('⚠️  Could not fetch git release data');
  }

  // Archive CI/CD artifacts if requested
  if (options.includeArtifacts) {
    console.log('📦 Archiving CI/CD artifacts...');
    const artifactFiles = [
      'tags-list.txt',
      'commits-list.txt',
      'tags-commits-lists/tags-list.txt',
      'tags-commits-lists/commits-list.txt'
    ];

    for (const artifactFile of artifactFiles) {
      try {
        const content = readFileSync(artifactFile, 'utf8');
        const relativePath = path.dirname(artifactFile);
        const filename = path.basename(artifactFile);

        if (relativePath !== '.') {
          mkdirSync(path.join(archiveDir, relativePath), { recursive: true });
        }

        writeFileSync(path.join(archiveDir, artifactFile), content);
        console.log(`✅ Archived artifact: ${artifactFile}`);
      } catch (error) {
        console.log(`⚠️  Skipped artifact: ${artifactFile} (not found)`);
      }
    }
  }

  // Archive npm version history
  console.log('📦 Archiving version history...');
  try {
    const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));
    const versionHistory = {
      currentVersion: packageJson.version,
      lastModified: new Date().toISOString(),
      dependencies: packageJson.dependencies || {},
      devDependencies: packageJson.devDependencies || {}
    };

    // Try to get version history from git tags
    try {
      const versionTags = execSync('git tag --list "v*" --sort=-version:refname | head -10', { encoding: 'utf8' });
      versionHistory.versionTags = versionTags.split('\n').filter(Boolean);
    } catch (e) {
      versionHistory.versionTags = [];
    }

    writeFileSync(
      path.join(archiveDir, 'version-history.json'),
      JSON.stringify(versionHistory, null, 2)
    );
  } catch (error) {
    console.log('⚠️  Could not create version history');
  }

  // Create archive manifest
  const manifest = {
    archivedAt: new Date().toISOString(),
    period: `${options.days} days`,
    type: 'semantic-release-ci-artifacts',
    includedArtifacts: options.includeArtifacts,
    files: [],
    metadata: {
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
      gitBranch: execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim(),
      gitCommit: execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim()
    }
  };

  // List archived files recursively
  function listFiles(dir, prefix = '') {
    const { readdirSync, statSync } = require('fs');
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
            modified: stat.mtime.toISOString()
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
    const archiveName = `semantic-release-archive-${timestamp}.tgz`;
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

  console.log('✅ Semantic-release archiving completed successfully!');
  console.log(`📂 Archive location: ${options.compress ? options.outputDir : archiveDir}`);

} catch (error) {
  console.error('❌ Archiving failed:', error.message);
  process.exit(1);
}