// scripts/optimization/minify-js.mjs
import { promises as fs } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fg from 'fast-glob';
import { minify } from 'terser';

const __filename = fileURLToPath(import.meta.url);
const scriptDir = path.dirname(__filename);
const repoRoot = path.resolve(scriptDir, '..', '..');

const config = {
  input: [
    'dist/**/*.js',
    'build/**/*.js',
    '!dist/**/*.min.js',
    '!build/**/*.min.js'
  ],
  output: 'dist-minified',
  terserOptions: {
    compress: {
      drop_console: true,
      drop_debugger: true,
      pure_funcs: ['console.log', 'console.info', 'console.debug']
    },
    mangle: {
      safari10: true
    },
    output: {
      comments: false,
      beautify: false
    },
    sourceMap: {
      filename: (file) => file.replace('.js', '.min.js.map'),
      url: (file) => path.basename(file) + '.map'
    }
  }
};

async function minifyFile(file) {
  const content = await fs.readFile(file, 'utf8');
  const relativePath = path.relative(repoRoot, file);
  const outputDir = path.join(repoRoot, config.output);
  const outputFile = path.join(
    outputDir,
    relativePath.replace(/^dist\//, '').replace(/^build\//, '').replace('.js', '.min.js')
  );

  console.log(`🔧 Minifying: ${relativePath}`);

  try {
    const result = await minify(content, {
      ...config.terserOptions,
      sourceMap: {
        ...config.terserOptions.sourceMap,
        filename: path.basename(outputFile) + '.map'
      }
    });

    // Ensure output directory exists
    await fs.mkdir(path.dirname(outputFile), { recursive: true });

    // Write minified file
    await fs.writeFile(outputFile, result.code, 'utf8');

    // Write source map if generated
    if (result.map) {
      await fs.writeFile(outputFile + '.map', result.map, 'utf8');
    }

    const originalSize = Buffer.byteLength(content, 'utf8');
    const minifiedSize = Buffer.byteLength(result.code, 'utf8');
    const savings = ((originalSize - minifiedSize) / originalSize * 100).toFixed(2);

    console.log(`  ✓ Saved: ${savings}% (${originalSize} → ${minifiedSize} bytes)`);

    return { originalSize, minifiedSize, savings: parseFloat(savings) };
  } catch (error) {
    console.error(`  ✗ Failed to minify ${file}:`, error.message);
    return null;
  }
}

async function generateMinificationReport(results) {
  const report = {
    timestamp: new Date().toISOString(),
    totalFiles: results.length,
    successful: results.filter(r => r !== null).length,
    totalOriginalSize: results.reduce((sum, r) => sum + (r?.originalSize || 0), 0),
    totalMinifiedSize: results.reduce((sum, r) => sum + (r?.minifiedSize || 0), 0),
    averageSavings: 0
  };

  report.averageSavings = report.totalOriginalSize > 0
    ? ((report.totalOriginalSize - report.totalMinifiedSize) / report.totalOriginalSize * 100)
    : 0;

  await fs.writeFile(
    path.join(repoRoot, 'minification-report.json'),
    JSON.stringify(report, null, 2)
  );

  console.log('\n📊 Minification Report:');
  console.log(`   Files processed: ${report.successful}/${report.totalFiles}`);
  console.log(`   Total size reduction: ${report.averageSavings.toFixed(2)}%`);
  console.log(`   Space saved: ${(report.totalOriginalSize - report.totalMinifiedSize).toLocaleString()} bytes`);
}

async function main() {
  console.log('🔧 Starting JavaScript minification...\n');

  const files = await fg(config.input, {
    cwd: repoRoot,
    absolute: true,
    onlyFiles: true
  });

  if (files.length === 0) {
    console.log('⚠ No JavaScript files found to minify');
    return;
  }

  console.log(`📁 Found ${files.length} files to minify\n`);

  const results = [];
  for (const file of files) {
    const result = await minifyFile(file);
    results.push(result);
  }

  await generateMinificationReport(results);

  console.log('\n✅ JavaScript minification completed!');
  console.log('📄 Check minification-report.json for detailed statistics');
}

main().catch(console.error);