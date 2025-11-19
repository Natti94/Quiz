#!/usr/bin/env node
// Clean up `logfs/` by removing files older than N days.
// Usage:
//  node scripts/infra/clean-logfs.mjs [--days N] [--dry-run] [--prefix <glob-prefix>]
// Example:
//  node scripts/infra/clean-logfs.mjs --days 30

import { promises as fs } from 'fs';
import path from 'path';
import process from 'process';

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const daysArg = args.reduce((acc, a, i) => (a === '--days' ? args[i + 1] : acc), null);
const days = daysArg ? parseInt(daysArg, 10) : 30;
const prefixIndex = args.indexOf('--prefix');
const prefix = prefixIndex >= 0 ? args[prefixIndex + 1] : null;

async function main() {
  const root = process.cwd();
  const logfs = path.join(root, 'logfs');
  try {
    const stats = await fs.stat(logfs);
    if (!stats.isDirectory()) {
      console.log('No logfs directory present');
      return;
    }
  } catch (e) {
    console.log('No logfs directory present');
    return;
  }

  const files = await fs.readdir(logfs);
  if (files.length === 0) {
    console.log('No files in logfs/');
    return;
  }

  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  let removed = 0;
  for (const f of files) {
    if (prefix && !f.startsWith(prefix)) continue;
    const p = path.join(logfs, f);
    try {
      const { mtimeMs } = await fs.stat(p);
      if (mtimeMs < cutoff) {
        if (dryRun) {
          console.log('[DRY RUN] Would remove:', p);
        } else {
          await fs.rm(p, { force: true, recursive: true });
          console.log('Removed:', p);
        }
        removed++;
      }
    } catch (e) {
      console.warn('Skipping (stat error):', p, e.message);
    }
  }

  console.log(`Done. Removed ${removed} files older than ${days} day(s).`);
}

main().catch(e => { console.error(e); process.exit(1); });
