#!/usr/bin/env node
import { execSync } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';

// Usage: INFRA_GIT_URL=git@github.com:org/infra.git node scripts/move-logs-to-infra.mjs [destFolder]
const destFolder = process.argv[2] || 'logs';
const infraUrl = process.env.INFRA_GIT_URL;
const infraBranch = process.env.INFRA_GIT_BRANCH || 'main';

if (!infraUrl) {
  console.error('Set INFRA_GIT_URL environment variable to use this helper script.');
  process.exit(1);
}

const tmp = path.join(process.cwd(), '.infra_tmp');
try {
  console.log('Cloning infra repo...');
  execSync(`git clone --single-branch --branch ${infraBranch} ${infraUrl} ${tmp}`, { stdio: 'inherit' });

  // We archive tag backups under archives/tag-backups. Fall back to scripts/ for
  // backward compatibility.
  const candidates = [path.join(process.cwd(), 'archives', 'tag-backups'), path.join(process.cwd(), 'scripts')];
  let logsDir = null;
  for (const c of candidates) {
    try {
      const stats = await fs.stat(c);
      if (stats.isDirectory()) {
        logsDir = c;
        break;
      }
    } catch (e) {
      // not present
    }
  }
  if (!logsDir) {
    console.log('No logs directory found (archives/tag-backups or scripts).');
    process.exit(0);
  }
  const files = await fs.readdir(logsDir);
  const copies = [];
  for (const f of files) {
  if (f.startsWith('tag-backup-') || f.endsWith('-sha.txt')) {
      const src = path.join(logsDir, f);
      const destDir = path.join(tmp, destFolder);
      await fs.mkdir(destDir, { recursive: true });
      const dest = path.join(destDir, f);
      await fs.copyFile(src, dest);
      copies.push(dest);
    }
  }

  if (copies.length === 0) {
    console.log('No logs found to copy.');
  } else {
    // commit and push
    execSync('git add .', { cwd: tmp, stdio: 'inherit' });
    execSync(`git commit -m "chore(logs): add tag backups"`, { cwd: tmp, stdio: 'inherit' });
    execSync('git push origin ' + infraBranch, { cwd: tmp, stdio: 'inherit' });
    console.log('Logs pushed to infra repo under', destFolder);
  }
} catch (err) {
  console.error('Failed to move logs to infra repo:', err.message);
  process.exit(1);
} finally {
  try { execSync(`rm -rf ${tmp}`, { stdio: 'inherit' }); } catch(e) {}
}
