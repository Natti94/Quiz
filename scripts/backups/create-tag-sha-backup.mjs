// Moved from scripts/app-version/create-tag-sha-backup.mjs -> scripts/backups
import fs from "fs";
import { execSync } from "child_process";
import path from "path";

const dir = process.cwd();
const searchDirs = [
  path.join(dir, "archives", "tag-backups"),
  path.join(dir, "scripts"),
];

let files = [];
for (const d of searchDirs) {
  try {
    const fsFiles = fs
      .readdirSync(d)
      .filter((f) => f.startsWith("tag-backup-") && f.endsWith(".txt"));
    files = files.concat(fsFiles.map((f) => path.join(d, f)));
  } catch (e) {}
}
if (files.length === 0) {
  console.error(
    "No tag backup file found under archives/tag-backups/ or scripts/"
  );
  process.exit(1);
}
files.sort();
const latest = files[files.length - 1];
const tags = fs
  .readFileSync(latest, "utf8")
  .split("\n")
  .map((s) => s.trim())
  .filter(Boolean);

const chosenDir = path.dirname(latest);
const outFile = path.join(
  chosenDir,
  `${path.basename(latest, ".txt")}-sha.txt`
);
console.log(`Reading tags from ${latest} -> writing mapping to ${outFile}`);

const lines = [];

for (const tag of tags) {
  let sha = null;
  try {
    sha = execSync(`git show-ref --tags -s -- "refs/tags/${tag}"`, {
      encoding: "utf8",
    }).trim();
  } catch (e) {}

  if (!sha) {
    try {
      const remoteOut = execSync(`git ls-remote --tags origin ${tag}`, {
        encoding: "utf8",
      }).trim();
      if (remoteOut) {
        const firstLine = remoteOut.split(/\r?\n/)[0];
        sha = firstLine.split("\t")[0];
      }
    } catch (e) {}
  }

  if (!sha) {
    lines.push(
      `${tag} -> not found (deleted locally and/or not present on remote)`
    );
  } else {
    lines.push(`${tag} -> ${sha}`);
  }
}

fs.writeFileSync(outFile, lines.join("\n") + "\n");
console.log(`Wrote ${lines.length} entries to ${outFile}`);
process.exit(0);
