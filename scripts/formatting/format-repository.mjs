// Format a set of files across the monorepo using Prettier. This ensures a
// consistent code style for frontend, backend, and root-level files.
//
// Call with root: `node scripts/formatting/format-repository.mjs`
// The script uses fast-glob to find files and applies Prettier where possible.

import { promises as fs } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fg from "fast-glob";
import prettier from "prettier";

const __filename = fileURLToPath(import.meta.url);
const scriptDir = path.dirname(__filename);
const repoRoot = path.resolve(scriptDir, "..", "..");

const globs = [
  "quiz-frontend/**/*.{js,jsx,ts,tsx,css,html,json,md,mdx}",
  "quiz-backend-local/**/*.{js,jsx,ts,tsx,json,md}",
  "*.{md,json}",
];

const ignore = [
  "**/node_modules/**",
  "**/dist/**",
  "**/.git/**",
  "**/build/**",
  "**/.next/**",
  "**/.vercel/**",
  "**/.cache/**",
  "**/coverage/**",
  "**/.netlify/**",
  "**/package-lock.json",
  "**/yarn.lock",
  "**/pnpm-lock.yaml",
];

async function formatFile(file) {
  const content = await fs.readFile(file, "utf8");
  const config = (await prettier.resolveConfig(file)) ?? {};
  const formatted = await prettier.format(content, {
    ...config,
    filepath: file,
  });
  if (formatted !== content) {
    await fs.writeFile(file, formatted, "utf8");
    return true;
  }
  return false;
}

async function main() {
  const entries = await fg(globs, {
    cwd: repoRoot,
    ignore,
    absolute: true,
    onlyFiles: true,
    dot: true,
    followSymbolicLinks: false,
  });

  const projectCounts = { frontend: 0, backend: 0, root: 0 };

  console.log("[format] Root:", repoRoot);
  console.log("[format] Files matched:", entries.length);

  let changed = 0;
  for (const file of entries) {
    try {
      const didChange = await formatFile(file);
      if (didChange) {
        console.log("Formatted:", path.relative(repoRoot, file));
        changed += 1;
      }

      const relPath = path.relative(repoRoot, file);
      if (relPath.startsWith("quiz-app")) projectCounts.frontend += 1;
      else if (relPath.startsWith("quiz-backend")) projectCounts.backend += 1;
      else projectCounts.root += 1;
    } catch (e) {
      console.error(
        "Failed to format",
        path.relative(repoRoot, file),
        e.message
      );
    }
  }

  console.log(`[format] Done. Changed: ${changed} / ${entries.length}`);
  console.log(
    `[format] Frontend: ${projectCounts.frontend}, Backend: ${projectCounts.backend}, Root: ${projectCounts.root}`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
