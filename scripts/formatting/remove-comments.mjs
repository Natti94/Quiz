// Remove comments from code and CSS across the monorepo. This is intended
// for generating reduced test or deployment artifacts; it is not reversible.
// Use this carefully and keep a git checkpoint prior to running on a large set.
//
// Call with root: `node scripts/formatting/remove-comments.mjs`

import { promises as fs } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fg from "fast-glob";
import strip from "strip-comments";
import stripCss from "strip-css-comments";

const __filename = fileURLToPath(import.meta.url);
const scriptDir = path.dirname(__filename);
const repoRoot = path.resolve(scriptDir, "..", "..");

const globs = [
  "quiz-frontend/**/*.{js,jsx,css,html}",
  "quiz-backend-local/**/*.{js,jsx,css}",
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
];

function removeHtmlComments(content) {
  return content.replace(/<!--([\s\S]*?)-->/g, "");
}

async function processFile(file) {
  const ext = path.extname(file).toLowerCase();
  const content = await fs.readFile(file, "utf8");
  let out = content;
  try {
    if (ext === ".css") {
      out = stripCss(content, { preserve: false });
    } else if (ext === ".html") {
      out = removeHtmlComments(content);
    } else if (ext === ".js" || ext === ".jsx") {
      out = strip(content);
    }
  } catch (e) {
    console.error("Failed to strip comments for", file, e.message);
    return;
  }
  if (out !== content) {
    await fs.writeFile(file, out, "utf8");
    console.log("Stripped:", path.relative(repoRoot, file));
  }
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
  let changed = 0;
  let total = 0;
  const extCounts = new Map();
  const projectCounts = { frontend: 0, backend: 0 };
  const stillHasComment = [];

  console.log("[strip] Root:", repoRoot);
  console.log("[strip] Files matched:", entries.length);

  for (const file of entries) {
    total += 1;
    const before = await fs.readFile(file, "utf8");
    await processFile(file);
    const after = await fs.readFile(file, "utf8");
    if (after !== before) changed += 1;

    // Track which project
    const relPath = path.relative(repoRoot, file);
    if (relPath.startsWith("quiz-app")) projectCounts.frontend += 1;
    if (relPath.startsWith("quiz-backend")) projectCounts.backend += 1;

    const ext = path.extname(file).toLowerCase();
    extCounts.set(ext, (extCounts.get(ext) || 0) + 1);

    // Simple residual comment heuristic
    if (/\/\//.test(after) || /\/\*/.test(after) || /<!--/.test(after)) {
      stillHasComment.push(relPath);
    }
  }

  console.log(`[strip] Done. Processed: ${total}, Changed: ${changed}`);
  console.log(`[strip] Frontend: ${projectCounts.frontend}, Backend: ${projectCounts.backend}`);
  console.log(
    "[strip] File counts by extension:",
    Object.fromEntries(extCounts.entries())
  );

  if (stillHasComment.length) {
    console.log(
      "[strip] Files that may still contain comment markers (heuristic):"
    );
    for (const f of stillHasComment.slice(0, 40)) console.log("  -", f);
    if (stillHasComment.length > 40)
      console.log(`  ... and ${stillHasComment.length - 40} more`);
  } else {
    console.log("[strip] Heuristic: No remaining comment markers detected.");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
