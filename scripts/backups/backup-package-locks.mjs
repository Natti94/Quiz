#!/usr/bin/env node
import { promises as fs } from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const args = process.argv.slice(2);
const commit = args.includes('--commit');
const repoRoot = process.cwd();
const projects = [repoRoot, path.join(repoRoot, 'quiz-frontend'), path.join(repoRoot, 'quiz-backend-local')];
const outDir = path.join(repoRoot, 'archives', 'lock-backups');

async function main() {
  await fs.mkdir(outDir, { recursive: true });
  const copied = [];
  for (const p of projects) {
    const filename = path.join(p, 'package-lock.json');
    try {
      await fs.access(filename);
    } catch (e) { continue; }
    const stats = await fs.stat(filename);
    if (!stats.isFile()) continue;
    const ts = new Date().toISOString().replace(/[:.]/g, '-');
    const projectName = path.basename(p) || 'root';
    const destName = `${projectName}-package-lock-${ts}.json.backup`;
    const dest = path.join(outDir, destName);
    await fs.copyFile(filename, dest);
    console.log(`Copied ${filename} -> ${dest}`);
    copied.push(dest);
  }
  if (copied.length === 0) {
    console.log('No package-lock.json found to backup.');
    return;
  }
  if (commit) {
    try {
      execSync('git add ' + copied.map(p => JSON.stringify(path.relative(repoRoot, p))).join(' '), { stdio: 'inherit' });
      execSync('git commit -m "chore(backups): package-lock backups"', { stdio: 'inherit' });
      execSync('git push origin main', { stdio: 'inherit' });
      console.log('Committed package-lock backups to archives/lock-backups/');
    } catch (e) {
      console.error('Failed to commit backups:', e.message);
    }
  } else {
    console.log('Backups written. Add --commit to commit them.');
  }
}

main().catch(e => { console.error(e); process.exit(1); });
