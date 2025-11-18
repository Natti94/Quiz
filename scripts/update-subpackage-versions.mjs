import fs from "fs";
import path from "path";

if (process.argv.length < 3) {
  console.error("Usage: node update-subpackage-versions.mjs <version>");
  process.exit(1);
}

const version = process.argv[2];
const repoRoot = process.cwd();
const winRepoRoot = repoRoot;

const packages = ["quiz-frontend", "quiz-backend-local"];

function updatePackageJson(pkgDir) {
  const filePath = path.join(winRepoRoot, pkgDir, "package.json");
  if (!fs.existsSync(filePath)) {
    console.warn(`Skipping ${pkgDir}: package.json not found`);
    return;
  }

  const content = JSON.parse(fs.readFileSync(filePath, "utf8"));
  content.version = version;
  fs.writeFileSync(filePath, JSON.stringify(content, null, 2) + "\n");
  console.log(`Updated ${pkgDir}/package.json -> ${version}`);
}

for (const pkg of packages) {
  updatePackageJson(pkg);
}

for (const pkg of packages) {
  const lockPath = path.join(winRepoRoot, pkg, "package-lock.json");
  if (fs.existsSync(lockPath)) {
    const lockContent = JSON.parse(fs.readFileSync(lockPath, "utf8"));
    lockContent.version = version;
    fs.writeFileSync(lockPath, JSON.stringify(lockContent, null, 2) + "\n");
    console.log(`Updated ${pkg}/package-lock.json -> ${version}`);
  }
}
