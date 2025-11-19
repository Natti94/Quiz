#!/usr/bin/env node
// Move local logs (archives/tag-backups and logfs) into a central infra repo under `logs/`.
// Usage:
//   INFRA_GIT_URL=git@github.com:org/infra.git node scripts/infra/move-logs-to-infra.mjs [--commit] [--force] [--dry-run]

import { execSync } from "child_process";
import { promises as fs } from "fs";
import path from "path";

const commit = process.argv.includes("--commit");
const force = process.argv.includes("--force");
const dryRun = process.argv.includes("--dry-run");
const infraUrl = process.env.INFRA_GIT_URL;
const infraBranch = process.env.INFRA_GIT_BRANCH || "main";

if (!infraUrl) {
  console.error("Set INFRA_GIT_URL environment variable to use this helper script.");
  process.exit(1);
}

const tmp = path.join(process.cwd(), ".infra_tmp");
try {
  console.log("Cloning infra repo...");
  execSync(
    `git clone --single-branch --branch ${infraBranch} ${infraUrl} ${tmp}`,
    { stdio: "inherit" }
  );

  const infraLogsDir = path.join(tmp, "logs");
  await fs.mkdir(infraLogsDir, { recursive: true });

  const localArchiveDir = path.join(process.cwd(), "archives", "tag-backups");
  const localLogfsDir = path.join(process.cwd(), "logfs");

  const filesToCopy = [];

  // copy tag backups
  try {
    const tagFiles = await fs.readdir(localArchiveDir);
    for (const f of tagFiles) {
      if (f.startsWith("tag-backup-") || f.endsWith("-sha.txt")) {
        filesToCopy.push({ src: path.join(localArchiveDir, f), dest: path.join(infraLogsDir, f) });
      }
    }
  } catch (e) {
    // no archives present
  }

  // copy ephemeral logs from logfs
  try {
    const logfsFiles = await fs.readdir(localLogfsDir);
    for (const f of logfsFiles) {
      // only copy relevant logs (we'll copy everything by default so infra has diagnostics)
      filesToCopy.push({ src: path.join(localLogfsDir, f), dest: path.join(infraLogsDir, f) });
    }
  } catch (e) {
    // no logfs present
  }

  if (filesToCopy.length === 0) {
    console.log("No files to move to infra logs.");
  } else {
    for (const entry of filesToCopy) {
      if (dryRun) {
        console.log("[DRY RUN] Would copy:", entry.src, "->", entry.dest);
        continue;
      }
      let shouldCopy = true;
      try {
        const [srcBuf, destBuf] = await Promise.all([
          fs.readFile(entry.src),
          fs.readFile(entry.dest).catch(() => null),
        ]);
        if (destBuf && Buffer.compare(srcBuf, destBuf) === 0 && !force) {
          shouldCopy = false;
        }
      } catch (e) {}
      if (!shouldCopy) {
        console.log("Skipping (already exists):", entry.dest);
        continue;
      }
      await fs.copyFile(entry.src, entry.dest);
      console.log("Copied:", entry.src, "->", entry.dest);
    }

    if (commit) {
      try {
        execSync(
          `git add ${filesToCopy
            .map((p) => JSON.stringify(path.relative(tmp, p.dest)))
            .join(" ")}`,
          { cwd: tmp, stdio: "inherit" }
        );
        execSync('git commit -m "chore(logs): import logs from repo"', { cwd: tmp, stdio: "inherit" });
        execSync(`git push origin ${infraBranch}`, { cwd: tmp, stdio: "inherit" });
        console.log("Committed and pushed logs to infra repo.");
      } catch (e) {
        console.error("Failed to commit or push infra logs:", e.message);
      }
    } else {
      console.log("Dry run or --commit not specified; not committing copied files.");
    }
  }
} catch (err) {
  console.error("Failed to move logs to infra repo:", err.message);
  process.exit(1);
} finally {
  try {
    execSync(`rm -rf ${tmp}`, { stdio: "inherit" });
  } catch (e) {}
  try {
    await fs.rm(tmp, { recursive: true, force: true });
  } catch (e) {}
}
