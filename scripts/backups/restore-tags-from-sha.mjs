#!/usr/bin/env node
// moved from scripts/restore-tags-from-sha.mjs -> scripts/backups/
import { execSync } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const force = args.includes('--force');
const push = args.includes('--push');
const fileArgIndex = args.findIndex(a => a === '--file');
let filePath = null;
if (fileArgIndex >= 0) {
  filePath = args[fileArgIndex + 1];
}

const dir = process.cwd();
const candidates = [path.join(dir, 'archives', 'tag-backups'), path.join(dir, 'scripts')];

async function findLatestShaFile() {
  if (filePath) return path.resolve(filePath);
  const files = [];
  for (const c of candidates) {
    try {
      const names = await fs.readdir(c);
      for (const n of names) {
        if (n.startsWith('tag-backup-') && n.endsWith('-sha.txt')) {
          files.push(path.join(c, n));
        }
      }
    } catch (e) {
      // ignore
    }
  }
  files.sort();
  if (files.length === 0) return null;
  return files[files.length - 1];
}

async function main() {
  const file = await findLatestShaFile();
  if (!file) {
    console.error('No tag backup SHA file found in archives/tag-backups or scripts/ (use --file).');
    process.exit(1);
  }

  const raw = await fs.readFile(file, 'utf8');
  const lines = raw.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  if (lines.length === 0) {
    console.error('Mapping file empty:', file);
    process.exit(1);
  }

  console.log('Using mapping file:', file);
  const created = [];
  for (const line of lines) {
    const m = line.match(/^(.+?)\s*->\s*(.+)$/);
    if (!m) continue;
    const tag = m[1].trim();
    const sha = m[2].trim();
    if (!sha || sha.toLowerCase().includes('not found')) {
      console.log('Skipping (no SHA):', tag);
      continue;
    }

    const cmd = `git tag ${force ? '-f ' : ''}${tag} ${sha}`;
    if (dryRun) {
      console.log('[DRY RUN] Would run:', cmd);
      continue;
    }

    try {
      console.log('Creating:', tag, sha);
      execSync(cmd, { stdio: 'inherit' });
      created.push(tag);
    } catch (e) {
      console.warn('Failed to create tag:', tag, e.message);
    }
  }

  if (created.length > 0 && push) {
    try {
      const pushCmd = `git push origin ${created.map(t => `${force ? '--force ' : ''}${t}`).join(' ')}`;
      console.log('Pushing tags:', created.join(', '));
      execSync(pushCmd, { stdio: 'inherit' });
    } catch (e) {
      console.warn('Failed to push tags:', e.message);
    }
  }

  console.log('Done. (created tags: ' + created.join(', ') + ')');
}

main().catch(err => { console.error(err); process.exit(1); });
