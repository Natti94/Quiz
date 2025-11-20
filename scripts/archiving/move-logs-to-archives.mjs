// This helper script imports logs/backups from an "infra" repository into
// the local archives/tag-backups folder. It's used to centralize large logs and
// keep the monorepo lean, while allowing manual restore of tag backups.
//
// Usage:
//   INFRA_GIT_URL=git@github.com:org/infra.git node scripts/archiving/move-logs-to-archives.mjs [srcFolder] [--commit] [--force] [--dry-run]
// Arguments and flags:
//   srcFolder (default: logs) — path inside the infra repo to copy files from
//   --commit  -> after copying, run `git add`/commit/push from this repo
//   --force   -> copy even when locals are identical; useful to overwrite
//   --dry-run -> don't copy; just show what would be done
// Environment variables:
//   INFRA_GIT_URL    — required; repository to clone
//   INFRA_GIT_BRANCH — optional (defaults to main)

import { execSync } from "child_process";
import { promises as fs } from "fs";
import path from "path";

const srcFolder = process.argv[2] || "logs";
const commit = process.argv.includes("--commit");
const force = process.argv.includes("--force");
const dryRun = process.argv.includes("--dry-run");
const infraUrl = process.env.INFRA_GIT_URL;
const infraBranch = process.env.INFRA_GIT_BRANCH || "main";

if (!infraUrl) {
  console.error(
    "Set INFRA_GIT_URL environment variable to use this helper script."
  );
  process.exit(1);
}

const tmp = path.join(process.cwd(), ".infra_tmp");
try {
  console.log("Cloning infra repo...");
  execSync(
    `git clone --single-branch --branch ${infraBranch} ${infraUrl} ${tmp}`,
    { stdio: "inherit" }
  );
  const infraLogsDir = path.join(tmp, srcFolder);
  try {
    const stats = await fs.stat(infraLogsDir);
    if (!stats.isDirectory()) {
      console.log("No logs directory found in infra repo at", infraLogsDir);
      process.exit(0);
    }
  } catch (e) {
    console.log("No logs directory found in infra repo at", infraLogsDir);
    process.exit(0);
  }

  const files = await fs.readdir(infraLogsDir);
  const copies = [];
  const localArchiveDir = path.join(process.cwd(), "archives", "tag-backups");
  const localLockArchiveDir = path.join(process.cwd(), "archives", "lock-backups");
  const localLogfsDir = path.join(process.cwd(), "logfs");
  await fs.mkdir(localArchiveDir, { recursive: true });
  await fs.mkdir(localLockArchiveDir, { recursive: true });
  await fs.mkdir(localLogfsDir, { recursive: true });
  for (const f of files) {
  if (f.startsWith("tag-backup-") || f.endsWith("-sha.txt")) {
      const src = path.join(infraLogsDir, f);
      const dest = path.join(localArchiveDir, f);

      if (dryRun) {
        console.log("[DRY RUN] Would copy:", src, "->", dest);
        continue;
      }

      let shouldCopy = true;
      try {
        const [srcBuf, destBuf] = await Promise.all([
          fs.readFile(src),
          fs.readFile(dest).catch(() => null),
        ]);
        if (destBuf && Buffer.compare(srcBuf, destBuf) === 0) {
          shouldCopy = false;
        }
      } catch (e) {}
      if (!shouldCopy && !force) {
        console.log("Skipping (already exists):", dest);
        continue;
      }
      await fs.copyFile(src, dest);
      console.log("Copied:", src, "->", dest);
      copies.push(dest);
    } else if (f.endsWith('.json.backup') || f.startsWith('quiz-package-lock-') || f.startsWith('package-lock-')) {
      // handle lock backups separately
      const src = path.join(infraLogsDir, f);
      const dest = path.join(localLockArchiveDir, f);

      if (dryRun) {
        console.log('[DRY RUN] Would copy (lock backup):', src, '->', dest);
        continue;
      }

      let shouldCopy = true;
      try {
        const [srcBuf, destBuf] = await Promise.all([
          fs.readFile(src),
          fs.readFile(dest).catch(() => null),
        ]);
        if (destBuf && Buffer.compare(srcBuf, destBuf) === 0) {
          shouldCopy = false;
        }
      } catch (e) {}
      if (!shouldCopy && !force) {
        console.log('Skipping (already exists):', dest);
        continue;
      }
      await fs.copyFile(src, dest);
      console.log('Copied (lock):', src, '->', dest);
      copies.push(dest);
    } else {
      // not a tag backup; copy ephemeral logs into logfs instead
      const src = path.join(infraLogsDir, f);
      const dest = path.join(localLogfsDir, f);

      if (dryRun) {
        console.log("[DRY RUN] Would copy (logfs):", src, "->", dest);
        continue;
      }

      let shouldCopy = true;
      try {
        const [srcBuf, destBuf] = await Promise.all([
          fs.readFile(src),
          fs.readFile(dest).catch(() => null),
        ]);
        if (destBuf && Buffer.compare(srcBuf, destBuf) === 0) {
          shouldCopy = false;
        }
      } catch (e) {}
      if (!shouldCopy && !force) {
        console.log("Skipping (already exists):", dest);
        continue;
      }
      await fs.copyFile(src, dest);
      console.log("Copied (logfs):", src, "->", dest);
    }
  }

  if (copies.length === 0) {
    console.log("No logs found to copy.");
  } else {
    console.log("Copied", copies.length, "backup files to", localArchiveDir);
    if (commit) {
      try {
        execSync(
          "git add " +
            copies
              .map((p) => JSON.stringify(path.relative(process.cwd(), p)))
              .join(" "),
          { stdio: "inherit" }
        );
        execSync('git commit -m "chore(logs): import tag backups from infra"', {
          stdio: "inherit",
        });
        execSync("git push origin main", { stdio: "inherit" });
        console.log("Committed and pushed archives/tag-backups/ to main.");
      } catch (e) {
        console.error("Failed to commit or push archives:", e.message);
      }
    } else {
      console.log(
        "Dry run or --commit was not specified; not committing copied files."
      );
    }
  }
} catch (err) {
  console.error("Failed to move logs to infra repo:", err.message);
  process.exit(1);
} finally {
  try {
    await fs.rm(tmp, { recursive: true, force: true });
  } catch (e) {}
}
