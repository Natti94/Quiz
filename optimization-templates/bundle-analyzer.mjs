// scripts/monitoring/bundle-analyzer.mjs
import { promises as fs } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fg from 'fast-glob';

const __filename = fileURLToPath(import.meta.url);
const scriptDir = path.dirname(__filename);
const repoRoot = path.resolve(scriptDir, '..', '..');

const config = {
  bundles: [
    'dist/static/js/*.js',
    'dist/static/css/*.css',
    'build/static/js/*.js',
    'build/static/css/*.css'
  ],
  thresholds: {
    warning: 500 * 1024,  // 500KB
    error: 1024 * 1024    // 1MB
  }
};

async function analyzeBundle(file) {
  const stats = await fs.stat(file);
  const content = await fs.readFile(file, 'utf8');
  const ext = path.extname(file).toLowerCase();

  // Simple analysis of bundle contents
  const lines = content.split('\n').length;
  const functions = (content.match(/function\s+\w+\s*\(/g) || []).length;
  const classes = (content.match(/class\s+\w+/g) || []).length;
  const imports = (content.match(/import\s+.*from/g) || []).length;

  const analysis = {
    file: path.relative(repoRoot, file),
    size: stats.size,
    sizeKB: parseFloat((stats.size / 1024).toFixed(2)),
    type: ext.slice(1).toUpperCase(),
    lines,
    functions,
    classes,
    imports,
    gzippedSize: estimateGzipSize(content),
    status: stats.size > config.thresholds.error ? 'error' :
             stats.size > config.thresholds.warning ? 'warning' : 'ok'
  };

  return analysis;
}

function estimateGzipSize(content) {
  // Rough estimation: gzip typically compresses text by 60-80%
  const compressionRatio = 0.7;
  return Math.round(content.length * compressionRatio);
}

async function generateHTMLReport(analyses) {
  const totalSize = analyses.reduce((sum, a) => sum + a.size, 0);
  const totalGzipped = analyses.reduce((sum, a) => sum + a.gzippedSize, 0);

  let html = `
<!DOCTYPE html>
<html>
<head>
    <title>Bundle Analysis Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .summary { background: #f5f5f5; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background: #f2f2f2; }
        .error { color: #d32f2f; font-weight: bold; }
        .warning { color: #f57c00; font-weight: bold; }
        .ok { color: #388e3c; }
        .chart { margin: 20px 0; }
    </style>
</head>
<body>
    <h1>📊 Bundle Analysis Report</h1>
    <div class="summary">
        <h2>Summary</h2>
        <p><strong>Total Bundles:</strong> ${analyses.length}</p>
        <p><strong>Total Size:</strong> ${(totalSize / 1024 / 1024).toFixed(2)} MB</p>
        <p><strong>Estimated Gzipped:</strong> ${(totalGzipped / 1024 / 1024).toFixed(2)} MB</p>
        <p><strong>Compression Ratio:</strong> ${((totalSize - totalGzipped) / totalSize * 100).toFixed(1)}%</p>
    </div>

    <h2>Bundle Details</h2>
    <table>
        <thead>
            <tr>
                <th>File</th>
                <th>Size</th>
                <th>Gzipped</th>
                <th>Lines</th>
                <th>Functions</th>
                <th>Classes</th>
                <th>Imports</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody>
`;

  for (const analysis of analyses) {
    const statusClass = analysis.status;
    html += `
            <tr>
                <td>${analysis.file}</td>
                <td>${analysis.sizeKB} KB</td>
                <td>${(analysis.gzippedSize / 1024).toFixed(1)} KB</td>
                <td>${analysis.lines}</td>
                <td>${analysis.functions}</td>
                <td>${analysis.classes}</td>
                <td>${analysis.imports}</td>
                <td class="${statusClass}">${analysis.status.toUpperCase()}</td>
            </tr>
`;
  }

  html += `
        </tbody>
    </table>
    <p><em>Report generated on ${new Date().toISOString()}</em></p>
</body>
</html>
`;

  await fs.writeFile(path.join(repoRoot, 'bundle-analysis-report.html'), html);
  console.log('📄 Generated bundle-analysis-report.html');
}

async function main() {
  console.log('📊 Analyzing bundle composition...\n');

  const files = await fg(config.bundles, {
    cwd: repoRoot,
    absolute: true,
    onlyFiles: true
  });

  if (files.length === 0) {
    console.log('⚠ No bundle files found. Run build first.');
    return;
  }

  const analyses = [];
  for (const file of files) {
    const analysis = await analyzeBundle(file);
    analyses.push(analysis);

    const status = analysis.status === 'error' ? '🔴' :
                   analysis.status === 'warning' ? '🟡' : '🟢';
    console.log(`${status} ${analysis.file}: ${analysis.sizeKB}KB (${analysis.lines} lines, ${analysis.functions} functions)`);
  }

  // Generate warnings
  const warnings = analyses.filter(a => a.status === 'warning');
  const errors = analyses.filter(a => a.status === 'error');

  if (warnings.length > 0) {
    console.log('\n⚠️  Bundle Size Warnings:');
    warnings.forEach(w => console.log(`   - ${w.file}: ${w.sizeKB}KB (threshold: ${config.thresholds.warning / 1024}KB)`));
  }

  if (errors.length > 0) {
    console.log('\n🔴 Bundle Size Errors:');
    errors.forEach(e => console.log(`   - ${e.file}: ${e.sizeKB}KB (threshold: ${config.thresholds.error / 1024}KB)`));
  }

  await generateHTMLReport(analyses);

  const totalSize = analyses.reduce((sum, a) => sum + a.size, 0);
  console.log('\n📈 Analysis Summary:');
  console.log(`   Total bundles: ${analyses.length}`);
  console.log(`   Total size: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`   Warnings: ${warnings.length}`);
  console.log(`   Errors: ${errors.length}`);

  console.log('\n✅ Bundle analysis completed!');
  console.log('📄 Check bundle-analysis-report.html for detailed report');
}

main().catch(console.error);