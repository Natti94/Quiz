import { execFileSync } from 'node:child_process';

// Compatibility wrapper - call the new release script
const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('Usage: node scripts/app-version/update-subpackage-versions.mjs <version>');
  process.exit(1);
}

execFileSync(process.execPath, ['scripts/release/update-subpackage-versions.mjs', ...args], { stdio: 'inherit' });
