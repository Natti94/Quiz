import { promises as fs } from 'fs';
import path from 'path';

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const clean = args.includes('--clean');
const prefix = args.includes('--no-prefix') ? '' : 'test_';
const force = args.includes('--force');

const repoRoot = process.cwd();
const testsDir = path.join(repoRoot, 'tests', 'netlify', 'functions');
const functionsDir = path.join(repoRoot, 'quiz-frontend', 'netlify', 'functions');

async function copyTests() {
  try {
    const files = await fs.readdir(testsDir);
    const jsFiles = files.filter(f => f.endsWith('.js'));
    if (jsFiles.length === 0) {
      console.log('No JS test files found in', testsDir);
      return;
    }

    for (const f of jsFiles) {
      const src = path.join(testsDir, f);
      const destName = prefix + f;
      const dest = path.join(functionsDir, destName);

      const shouldCopy = async () => {
        try {
          const [srcBuf, destBuf] = await Promise.all([
            fs.readFile(src),
            fs.readFile(dest).catch(() => null),
          ]);
          if (!destBuf) return true; // dest missing -> copy
          if (Buffer.compare(srcBuf, destBuf) === 0) return force; // identical -> only copy if force set
          return true; // different -> copy
        } catch (e) {
          return true;
        }
      };

      const should = await shouldCopy();
      if (!should) {
        console.log(`Skipping (identical): ${dest}`);
        continue;
      }

      console.log(dryRun ? `[DRY RUN] copy ${src} -> ${dest}` : `Copying ${src} -> ${dest}`);
      if (!dryRun) {
        await fs.copyFile(src, dest);
      }
    }

    console.log('Done.');
  } catch (e) {
    console.error('Error copying tests:', e.message);
    process.exit(1);
  }
}

async function cleanTests() {
  try {
    const files = await fs.readdir(functionsDir);
    const target = files.filter(f => f.startsWith(prefix) && f.endsWith('.js'));
    for (const f of target) {
      const p = path.join(functionsDir, f);
      console.log(dryRun ? `[DRY RUN] remove ${p}` : `Removing ${p}`);
      if (!dryRun) await fs.unlink(p);
    }
    console.log('Clean done.');
  } catch (e) {
    console.error('Cleanup error:', e.message);
    process.exit(1);
  }
}

async function main() {
  if (clean) await cleanTests(); else await copyTests();
}

main().catch(e => { console.error(e); process.exit(1); });