#!/usr/bin/env node
// Find logs in the git index and optionally remove them from being tracked.
// Usage:
//  node scripts/dev/scan-committed-logs.mjs [--remove] [--dry-run]

import { execSync } from 'child_process';
import process from 'process';

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const remove = args.includes('--remove');

function run(cmd) {
  return execSync(cmd, { encoding: 'utf8' }).trim();
}

try {
  // list tracked log-like files
  let tracked = run('git ls-files').split(/\r?\n/)
    .filter(f => /(^|\/)(netlify-dev.log|logfs\/|\.netlify\/)/.test(f));

  if (!tracked || tracked.length === 0) {
    console.log('No log-like files tracked in git index.');
    process.exit(0);
  }

  console.log('Tracked log-like files:');
  tracked.forEach(f => console.log('  ', f));

  if (!remove) {
    console.log('\nRun with --remove to untrack these files (git rm --cached).');
    process.exit(0);
  }

  if (dryRun) {
    console.log('\n[DRY RUN] Would run: git rm --cached <file> for each listed file.');
    process.exit(0);
  }

  for (const f of tracked) {
    try {
      console.log('Untracking:', f);
      run(`git rm --cached --ignore-unmatch ${JSON.stringify(f)}`);
    } catch (e) {
      console.error('Failed to untrack file:', f, e.message);
    }
  }

  console.log('\nDone. Commit the changes to finalize removal.');
} catch (e) {
  console.error('git command failed:', e.message);
  process.exit(1);
}
