import { promises as fs } from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const untrack = args.includes('--untrack');
const commit = args.includes('--commit');
const recursive = args.includes('--recursive');
const rulesArgIndex = args.indexOf('--rules');
const rulesPath = rulesArgIndex >= 0 ? args[rulesArgIndex + 1] : null;

const repoRoot = process.cwd();

// Default mapping rules: regex -> destination relative to repo root
const defaultRules = [
  { regex: /^netlify-dev\.log$/, dest: 'logfs' },
  { regex: /\.log$/, dest: 'logfs' },
  { regex: /^package-lock\.json\.backup$/, dest: 'archives/lock-backups' },
  { regex: /.json\.backup$/, dest: 'archives/lock-backups' },
  { regex: /^deno\.lock$/, dest: 'archives/lock-backups' },
  { regex: /^.*-sha\.txt$/, dest: 'archives/tag-backups' },
  { regex: /^tag-backup-.*\.txt$/, dest: 'archives/tag-backups' },
];

async function loadRules() {
  if (!rulesPath) return defaultRules;
  try {
    const full = path.resolve(repoRoot, rulesPath);
    const raw = await fs.readFile(full, 'utf8');
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) throw new Error('rules file must be an array of {regex,dest}');
    // compile regex strings
    return parsed.map(r => ({ regex: new RegExp(r.regex), dest: r.dest }));
  } catch (e) {
    console.error('Failed to load rules file:', e.message);
    process.exit(1);
  }
}

async function findFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isFile()) files.push(full);
    else if (e.isDirectory() && recursive) files.push(...await findFiles(full));
  }
  return files;
}

async function main() {
  const rules = await loadRules();
  const files = await findFiles(repoRoot);

  const moves = [];
  for (const f of files) {
    // skip .git dir and node_modules
    const rel = path.relative(repoRoot, f);
    if (rel.startsWith('.git' + path.sep) || rel.startsWith('node_modules' + path.sep)) continue;
    // only root-level (unless recursive)
    if (!recursive && rel.includes(path.sep)) continue;
    const base = path.basename(f);
    for (const r of rules) {
      if (r.regex.test(base)) {
        const destDir = path.join(repoRoot, r.dest);
        moves.push({ src: f, dest: path.join(destDir, base), destDir, rel });
        break;
      }
    }
  }

  if (moves.length === 0) {
    console.log('No generated files found in root (or according to current rules).');
    return;
  }

  for (const m of moves) {
    console.log((dryRun ? '[DRY RUN] ' : '') + `Move ${m.rel} -> ${path.relative(repoRoot, m.dest)}`);
    if (dryRun) continue;
    await fs.mkdir(m.destDir, { recursive: true });
    await fs.rename(m.src, m.dest);
    if (untrack) {
      try {
        execSync(`git rm --cached --ignore-unmatch ${JSON.stringify(m.rel)}`, { stdio: 'inherit' });
      } catch (e) {
        console.warn('git rm failed (ignored):', e.message);
      }
    }
  }

  if (commit && !dryRun) {
    try {
      execSync('git add ' + moves.map(m => JSON.stringify(path.relative(repoRoot, m.dest))).join(' '), { stdio: 'inherit' });
      execSync('git commit -m "chore(backups): move generated root files to archives/logfs"', { stdio: 'inherit' });
      execSync('git push origin main', { stdio: 'inherit' });
      console.log('Committed moves.');
    } catch (e) {
      console.error('Failed to commit moves:', e.message);
    }
  }
}

main().catch(e => { console.error(e); process.exit(1); });
