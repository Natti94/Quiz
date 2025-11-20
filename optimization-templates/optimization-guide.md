# Production Optimization Guide: Minification, Formatting & Performance

This comprehensive guide covers code optimization techniques for production deployments, including minification, formatting, comment removal, bundle optimization, and performance enhancements.

## Table of Contents
1. [Code Formatting & Linting](#code-formatting--linting)
2. [Comment Removal](#comment-removal)
3. [Minification & Compression](#minification--compression)
4. [Bundle Optimization](#bundle-optimization)
5. [Asset Optimization](#asset-optimization)
6. [Build Optimization](#build-optimization)
7. [Performance Monitoring](#performance-monitoring)
8. [CI/CD Integration](#cicd-integration)

---

## Code Formatting & Linting

Consistent code formatting improves readability, reduces errors, and ensures team collaboration standards.

### Prettier Configuration

```javascript
// .prettierrc.js - Prettier configuration
module.exports = {
  semi: true,
  trailingComma: 'es5',
  singleQuote: true,
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  bracketSpacing: true,
  arrowParens: 'avoid',
  endOfLine: 'lf',
  overrides: [
    {
      files: '*.md',
      options: {
        printWidth: 100,
        proseWrap: 'preserve'
      }
    },
    {
      files: '*.json',
      options: {
        printWidth: 200
      }
    }
  ]
};
```

### ESLint Configuration for Production

```javascript
// .eslintrc.js - ESLint configuration
module.exports = {
  env: {
    browser: true,
    node: true,
    es2021: true
  },
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 12,
    sourceType: 'module'
  },
  plugins: ['react', 'react-hooks', '@typescript-eslint', 'jsx-a11y'],
  rules: {
    // Production optimization rules
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',

    // Performance rules
    'react/jsx-no-bind': ['error', {
      ignoreRefs: true,
      allowArrowFunctions: true,
      allowFunctions: false,
      allowBind: false
    }],
    'react-hooks/exhaustive-deps': 'warn'
  },
  settings: {
    react: {
      version: 'detect'
    }
  }
};
```

### Automated Formatting Scripts

```javascript
// scripts/formatting/auto-format.mjs
import { promises as fs } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fg from 'fast-glob';
import prettier from 'prettier';
import { execSync } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const scriptDir = path.dirname(__filename);
const repoRoot = path.resolve(scriptDir, '..', '..');

const formatGlobs = [
  'quiz-frontend/**/*.{js,jsx,ts,tsx,css,html,json,md,mdx}',
  'quiz-backend-local/**/*.{js,jsx,ts,tsx,json,md}',
  '*.{md,json}',
  '.github/**/*.{yml,yaml,md}'
];

const ignorePatterns = [
  '**/node_modules/**',
  '**/dist/**',
  '**/.git/**',
  '**/build/**',
  '**/.next/**',
  '**/.vercel/**',
  '**/.cache/**',
  '**/coverage/**',
  '**/.netlify/**',
  '**/package-lock.json',
  '**/yarn.lock',
  '**/pnpm-lock.yaml'
];

async function formatWithPrettier(files) {
  console.log('🔧 Formatting with Prettier...');

  for (const file of files) {
    try {
      const content = await fs.readFile(file, 'utf8');
      const config = await prettier.resolveConfig(file);
      const formatted = await prettier.format(content, {
        ...config,
        filepath: file
      });

      if (formatted !== content) {
        await fs.writeFile(file, formatted, 'utf8');
        console.log(`  ✓ ${path.relative(repoRoot, file)}`);
      }
    } catch (error) {
      console.error(`  ✗ Failed to format ${file}:`, error.message);
    }
  }
}

async function lintWithESLint(files) {
  console.log('🔍 Linting with ESLint...');

  const jsFiles = files.filter(file =>
    /\.(js|jsx|ts|tsx)$/.test(file) &&
    !file.includes('node_modules')
  );

  if (jsFiles.length === 0) return;

  try {
    execSync(`npx eslint --fix ${jsFiles.join(' ')}`, {
      cwd: repoRoot,
      stdio: 'inherit'
    });
    console.log('  ✓ ESLint completed');
  } catch (error) {
    console.log('  ⚠ ESLint found issues (some may be auto-fixed)');
  }
}

async function main() {
  console.log('🚀 Starting automated code formatting...\n');

  const files = await fg(formatGlobs, {
    cwd: repoRoot,
    ignore: ignorePatterns,
    absolute: true,
    onlyFiles: true,
    dot: true
  });

  console.log(`📁 Found ${files.length} files to process\n`);

  await formatWithPrettier(files);
  await lintWithESLint(files);

  console.log('\n✅ Code formatting completed!');
  console.log('💡 Tip: Run this script before commits to maintain code quality');
}

main().catch(console.error);
```

---

## Comment Removal

Remove comments from production builds to reduce bundle size and improve performance.

### Enhanced Comment Removal Script

```javascript
// scripts/optimization/remove-comments-enhanced.mjs
import { promises as fs } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fg from 'fast-glob';
import strip from 'strip-comments';
import stripCss from 'strip-css-comments';

const __filename = fileURLToPath(import.meta.url);
const scriptDir = path.dirname(__filename);
const repoRoot = path.resolve(scriptDir, '..', '..');

const config = {
  globs: [
    'quiz-frontend/**/*.{js,jsx,ts,tsx,css,html}',
    'quiz-backend-local/**/*.{js,jsx,ts,tsx}',
    'dist/**/*.{js,css,html}',
    'build/**/*.{js,css,html}'
  ],
  ignore: [
    '**/node_modules/**',
    '**/.git/**',
    '**/coverage/**',
    '**/tests/**',
    '**/*.test.{js,jsx,ts,tsx}',
    '**/*.spec.{js,jsx,ts,tsx}'
  ],
  preservePatterns: [
    /^\/\/\s*@license/i,
    /^\/\/\s*@preserve/i,
    /^\/\*\s*@license[\s\S]*?\*\//i,
    /^\/\*\s*@preserve[\s\S]*?\*\//i
  ]
};

function shouldPreserveComment(comment) {
  return config.preservePatterns.some(pattern => pattern.test(comment));
}

function removeJsComments(content) {
  // Custom comment removal that preserves license/preserve comments
  return content.replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, (match) => {
    return shouldPreserveComment(match) ? match : '';
  });
}

function removeHtmlComments(content) {
  // Remove HTML comments but preserve conditional comments
  return content.replace(
    /<!--([\s\S]*?)-->/g,
    (match, content) => {
      if (content.includes('[if') || content.includes('<![endif]')) {
        return match; // Preserve IE conditional comments
      }
      return '';
    }
  );
}

async function processFile(file) {
  const ext = path.extname(file).toLowerCase();
  const content = await fs.readFile(file, 'utf8');
  let processed = content;

  try {
    switch (ext) {
      case '.css':
        processed = stripCss(content, { preserve: false });
        break;
      case '.html':
        processed = removeHtmlComments(content);
        break;
      case '.js':
      case '.jsx':
      case '.ts':
      case '.tsx':
        processed = removeJsComments(content);
        break;
    }
  } catch (error) {
    console.error(`Failed to process ${file}:`, error.message);
    return false;
  }

  if (processed !== content) {
    await fs.writeFile(file, processed, 'utf8');
    const savings = content.length - processed.length;
    console.log(`✓ ${path.relative(repoRoot, file)} (${savings} bytes saved)`);
    return true;
  }

  return false;
}

async function generateReport(files, processed, totalSavings) {
  const report = {
    timestamp: new Date().toISOString(),
    totalFiles: files.length,
    processedFiles: processed,
    totalSavings,
    averageSavings: processed > 0 ? Math.round(totalSavings / processed) : 0,
    breakdown: {}
  };

  // Generate breakdown by file type
  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (!report.breakdown[ext]) {
      report.breakdown[ext] = { count: 0, savings: 0 };
    }
    report.breakdown[ext].count++;
  }

  await fs.writeFile(
    path.join(repoRoot, 'comment-removal-report.json'),
    JSON.stringify(report, null, 2)
  );

  console.log('\n📊 Optimization Report:');
  console.log(`   Files processed: ${processed}/${files.length}`);
  console.log(`   Total bytes saved: ${totalSavings.toLocaleString()}`);
  console.log(`   Average savings: ${report.averageSavings} bytes per file`);
}

async function main() {
  console.log('🧹 Starting enhanced comment removal...\n');

  const files = await fg(config.globs, {
    cwd: repoRoot,
    ignore: config.ignore,
    absolute: true,
    onlyFiles: true,
    dot: true
  });

  console.log(`📁 Found ${files.length} files to process\n`);

  let processed = 0;
  let totalSavings = 0;

  for (const file of files) {
    const wasProcessed = await processFile(file);
    if (wasProcessed) {
      processed++;
      // Calculate savings (simplified)
      const content = await fs.readFile(file, 'utf8');
      totalSavings += content.length;
    }
  }

  await generateReport(files, processed, totalSavings);

  console.log('\n✅ Comment removal completed!');
  console.log('📄 Check comment-removal-report.json for detailed statistics');
}

main().catch(console.error);
```

---

## Minification & Compression

Reduce file sizes through minification and compression for faster loading times.

### JavaScript Minification with Terser

```javascript
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
```

### CSS Minification

```javascript
// scripts/optimization/minify-css.mjs
import { promises as fs } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fg from 'fast-glob';
import postcss from 'postcss';
import cssnano from 'cssnano';

const __filename = fileURLToPath(import.meta.url);
const scriptDir = path.dirname(__filename);
const repoRoot = path.resolve(scriptDir, '..', '..');

const config = {
  input: [
    'dist/**/*.css',
    'build/**/*.css',
    '!dist/**/*.min.css',
    '!build/**/*.min.css'
  ],
  output: 'dist-minified',
  postcssPlugins: [
    cssnano({
      preset: ['default', {
        discardComments: { removeAll: true },
        normalizeWhitespace: true,
        minifyFontValues: true,
        minifyGradients: true
      }]
    })
  ]
};

async function minifyCssFile(file) {
  const content = await fs.readFile(file, 'utf8');
  const relativePath = path.relative(repoRoot, file);
  const outputDir = path.join(repoRoot, config.output);
  const outputFile = path.join(
    outputDir,
    relativePath.replace(/^dist\//, '').replace(/^build\//, '').replace('.css', '.min.css')
  );

  console.log(`🎨 Minifying CSS: ${relativePath}`);

  try {
    const result = await postcss(config.postcssPlugins).process(content, {
      from: file,
      to: outputFile,
      map: { inline: false }
    });

    // Ensure output directory exists
    await fs.mkdir(path.dirname(outputFile), { recursive: true });

    // Write minified CSS
    await fs.writeFile(outputFile, result.css, 'utf8');

    // Write source map if generated
    if (result.map) {
      await fs.writeFile(outputFile + '.map', result.map.toString(), 'utf8');
    }

    const originalSize = Buffer.byteLength(content, 'utf8');
    const minifiedSize = Buffer.byteLength(result.css, 'utf8');
    const savings = ((originalSize - minifiedSize) / originalSize * 100).toFixed(2);

    console.log(`  ✓ Saved: ${savings}% (${originalSize} → ${minifiedSize} bytes)`);

    return { originalSize, minifiedSize, savings: parseFloat(savings) };
  } catch (error) {
    console.error(`  ✗ Failed to minify CSS ${file}:`, error.message);
    return null;
  }
}

async function main() {
  console.log('🎨 Starting CSS minification...\n');

  const files = await fg(config.input, {
    cwd: repoRoot,
    absolute: true,
    onlyFiles: true
  });

  if (files.length === 0) {
    console.log('⚠ No CSS files found to minify');
    return;
  }

  console.log(`📁 Found ${files.length} files to minify\n`);

  const results = [];
  for (const file of files) {
    const result = await minifyCssFile(file);
    results.push(result);
  }

  const successful = results.filter(r => r !== null);
  const totalOriginal = successful.reduce((sum, r) => sum + r.originalSize, 0);
  const totalMinified = successful.reduce((sum, r) => sum + r.minifiedSize, 0);
  const averageSavings = totalOriginal > 0
    ? ((totalOriginal - totalMinified) / totalOriginal * 100)
    : 0;

  console.log('\n📊 CSS Minification Summary:');
  console.log(`   Files processed: ${successful.length}/${results.length}`);
  console.log(`   Average size reduction: ${averageSavings.toFixed(2)}%`);

  console.log('\n✅ CSS minification completed!');
}

main().catch(console.error);
```

### HTML Minification

```javascript
// scripts/optimization/minify-html.mjs
import { promises as fs } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fg from 'fast-glob';
import { minify } from 'html-minifier-terser';

const __filename = fileURLToPath(import.meta.url);
const scriptDir = path.dirname(__filename);
const repoRoot = path.resolve(scriptDir, '..', '..');

const config = {
  input: [
    'dist/**/*.html',
    'build/**/*.html'
  ],
  output: 'dist-minified',
  minifierOptions: {
    collapseWhitespace: true,
    removeComments: true,
    removeRedundantAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    useShortDoctype: true,
    minifyCSS: true,
    minifyJS: true,
    minifyURLs: true
  }
};

async function minifyHtmlFile(file) {
  const content = await fs.readFile(file, 'utf8');
  const relativePath = path.relative(repoRoot, file);
  const outputDir = path.join(repoRoot, config.output);
  const outputFile = path.join(outputDir, relativePath.replace(/^dist\//, '').replace(/^build\//, ''));

  console.log(`📄 Minifying HTML: ${relativePath}`);

  try {
    const minified = await minify(content, config.minifierOptions);

    // Ensure output directory exists
    await fs.mkdir(path.dirname(outputFile), { recursive: true });

    // Write minified HTML
    await fs.writeFile(outputFile, minified, 'utf8');

    const originalSize = Buffer.byteLength(content, 'utf8');
    const minifiedSize = Buffer.byteLength(minified, 'utf8');
    const savings = ((originalSize - minifiedSize) / originalSize * 100).toFixed(2);

    console.log(`  ✓ Saved: ${savings}% (${originalSize} → ${minifiedSize} bytes)`);

    return { originalSize, minifiedSize, savings: parseFloat(savings) };
  } catch (error) {
    console.error(`  ✗ Failed to minify HTML ${file}:`, error.message);
    return null;
  }
}

async function main() {
  console.log('📄 Starting HTML minification...\n');

  const files = await fg(config.input, {
    cwd: repoRoot,
    absolute: true,
    onlyFiles: true
  });

  if (files.length === 0) {
    console.log('⚠ No HTML files found to minify');
    return;
  }

  console.log(`📁 Found ${files.length} files to minify\n`);

  const results = [];
  for (const file of files) {
    const result = await minifyHtmlFile(file);
    results.push(result);
  }

  const successful = results.filter(r => r !== null);
  const totalOriginal = successful.reduce((sum, r) => sum + r.originalSize, 0);
  const totalMinified = successful.reduce((sum, r) => sum + r.minifiedSize, 0);
  const averageSavings = totalOriginal > 0
    ? ((totalOriginal - totalMinified) / totalOriginal * 100)
    : 0;

  console.log('\n📊 HTML Minification Summary:');
  console.log(`   Files processed: ${successful.length}/${results.length}`);
  console.log(`   Average size reduction: ${averageSavings.toFixed(2)}%`);

  console.log('\n✅ HTML minification completed!');
}

main().catch(console.error);
```

---

## Bundle Optimization

Optimize JavaScript and CSS bundles for better performance.

### Webpack Bundle Analyzer Configuration

```javascript
// webpack.config.js - Bundle optimization
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
  mode: 'production',
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true,
            drop_debugger: true,
            pure_funcs: ['console.log', 'console.info', 'console.debug']
          },
          mangle: {
            safari10: true
          }
        }
      }),
      new CssMinimizerPlugin()
    ],
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        },
        common: {
          name: 'common',
          minChunks: 2,
          chunks: 'all'
        }
      }
    }
  },
  plugins: [
    new CompressionPlugin({
      algorithm: 'gzip',
      test: /\.(js|css|html|svg)$/,
      threshold: 10240,
      minRatio: 0.8
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false,
      reportFilename: 'bundle-report.html'
    })
  ]
};
```

### Vite Build Optimization

```javascript
// vite.config.js - Vite optimization
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { compression } from 'vite-plugin-compression';

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: 'dist/bundle-analysis.html',
      open: false,
      gzipSize: true,
      brotliSize: true
    }),
    compression({
      algorithm: 'gzip',
      ext: '.gz'
    })
  ],
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          utils: ['lodash', 'moment'],
          ui: ['antd', 'styled-components']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
});
```

---

## Asset Optimization

Optimize images, fonts, and other static assets.

### Image Optimization Script

```javascript
// scripts/optimization/optimize-images.mjs
import { promises as fs } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fg from 'fast-glob';
import sharp from 'sharp';
import { execSync } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const scriptDir = path.dirname(__filename);
const repoRoot = path.resolve(scriptDir, '..', '..');

const config = {
  input: [
    'quiz-frontend/public/**/*.{jpg,jpeg,png,gif,webp}',
    'quiz-frontend/src/assets/**/*.{jpg,jpeg,png,gif,webp}',
    'dist/assets/**/*.{jpg,jpeg,png,gif,webp}'
  ],
  output: 'optimized-assets',
  quality: {
    jpeg: 80,
    png: 80,
    webp: 85
  },
  sizes: [
    { width: 1920, suffix: '-xl' },
    { width: 1280, suffix: '-lg' },
    { width: 768, suffix: '-md' },
    { width: 480, suffix: '-sm' }
  ]
};

async function optimizeImage(file) {
  const ext = path.extname(file).toLowerCase();
  const basename = path.basename(file, ext);
  const outputDir = path.join(repoRoot, config.output, path.dirname(path.relative(repoRoot, file)));
  const outputFile = path.join(outputDir, `${basename}.webp`);

  console.log(`🖼️  Optimizing: ${path.relative(repoRoot, file)}`);

  try {
    await fs.mkdir(outputDir, { recursive: true });

    const pipeline = sharp(file);

    // Convert to WebP for better compression
    await pipeline
      .webp({ quality: config.quality.webp })
      .toFile(outputFile);

    // Generate responsive sizes
    for (const size of config.sizes) {
      const sizeOutput = path.join(outputDir, `${basename}${size.suffix}.webp`);
      await pipeline
        .resize(size.width, null, { withoutEnlargement: true })
        .webp({ quality: config.quality.webp })
        .toFile(sizeOutput);
    }

    const originalStats = await fs.stat(file);
    const optimizedStats = await fs.stat(outputFile);
    const savings = ((originalStats.size - optimizedStats.size) / originalStats.size * 100).toFixed(2);

    console.log(`  ✓ Saved: ${savings}% (${originalStats.size} → ${optimizedStats.size} bytes)`);

    return { originalSize: originalStats.size, optimizedSize: optimizedStats.size };
  } catch (error) {
    console.error(`  ✗ Failed to optimize ${file}:`, error.message);
    return null;
  }
}

async function generateResponsiveImages() {
  console.log('📱 Generating responsive image markup...');

  const images = await fg(`${config.output}/**/*.webp`, {
    cwd: repoRoot
  });

  const imageMap = {};

  for (const image of images) {
    const basename = path.basename(image, path.extname(image));
    const baseName = basename.replace(/-(xl|lg|md|sm)$/, '');

    if (!imageMap[baseName]) {
      imageMap[baseName] = {};
    }

    if (basename.includes('-xl')) imageMap[baseName].xl = image;
    else if (basename.includes('-lg')) imageMap[baseName].lg = image;
    else if (basename.includes('-md')) imageMap[baseName].md = image;
    else if (basename.includes('-sm')) imageMap[baseName].sm = image;
    else imageMap[baseName].original = image;
  }

  // Generate HTML for responsive images
  let html = '';
  for (const [name, sizes] of Object.entries(imageMap)) {
    html += `<!-- ${name} -->\n`;
    html += `<picture>\n`;
    if (sizes.xl) html += `  <source media="(min-width: 1280px)" srcset="${sizes.xl}">\n`;
    if (sizes.lg) html += `  <source media="(min-width: 768px)" srcset="${sizes.lg}">\n`;
    if (sizes.md) html += `  <source media="(min-width: 480px)" srcset="${sizes.md}">\n`;
    if (sizes.sm) html += `  <source media="(max-width: 479px)" srcset="${sizes.sm}">\n`;
    html += `  <img src="${sizes.original || sizes.lg || sizes.md}" alt="${name}" loading="lazy">\n`;
    html += `</picture>\n\n`;
  }

  await fs.writeFile(path.join(repoRoot, 'responsive-images.html'), html);
  console.log('  ✓ Generated responsive-images.html');
}

async function main() {
  console.log('🖼️  Starting image optimization...\n');

  const files = await fg(config.input, {
    cwd: repoRoot,
    absolute: true,
    onlyFiles: true
  });

  if (files.length === 0) {
    console.log('⚠ No images found to optimize');
    return;
  }

  console.log(`📁 Found ${files.length} images to optimize\n`);

  const results = [];
  for (const file of files) {
    const result = await optimizeImage(file);
    if (result) results.push(result);
  }

  const totalOriginal = results.reduce((sum, r) => sum + r.originalSize, 0);
  const totalOptimized = results.reduce((sum, r) => sum + r.optimizedSize, 0);
  const averageSavings = totalOriginal > 0
    ? ((totalOriginal - totalOptimized) / totalOriginal * 100)
    : 0;

  console.log('\n📊 Image Optimization Summary:');
  console.log(`   Images processed: ${results.length}`);
  console.log(`   Average size reduction: ${averageSavings.toFixed(2)}%`);
  console.log(`   Total space saved: ${(totalOriginal - totalOptimized).toLocaleString()} bytes`);

  await generateResponsiveImages();

  console.log('\n✅ Image optimization completed!');
}

main().catch(console.error);
```

### Font Optimization

```javascript
// scripts/optimization/optimize-fonts.mjs
import { promises as fs } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fg from 'fast-glob';
import { execSync } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const scriptDir = path.dirname(__filename);
const repoRoot = path.resolve(scriptDir, '..', '..');

const config = {
  input: [
    'quiz-frontend/public/fonts/**/*.{ttf,otf,woff,woff2}',
    'quiz-frontend/src/assets/fonts/**/*.{ttf,otf,woff,woff2}'
  ],
  output: 'optimized-fonts'
};

async function optimizeFont(file) {
  const ext = path.extname(file).toLowerCase();
  const basename = path.basename(file, ext);
  const outputDir = path.join(repoRoot, config.output);
  const woff2Output = path.join(outputDir, `${basename}.woff2`);

  console.log(`🔤 Optimizing font: ${path.relative(repoRoot, file)}`);

  try {
    await fs.mkdir(outputDir, { recursive: true });

    // Convert to WOFF2 for better compression
    if (ext === '.ttf' || ext === '.otf') {
      execSync(`woff2_compress "${file}"`, { cwd: outputDir });
      console.log(`  ✓ Converted to WOFF2: ${basename}.woff2`);
    } else if (ext === '.woff') {
      // Copy WOFF files (already compressed)
      await fs.copyFile(file, path.join(outputDir, path.basename(file)));
      console.log(`  ✓ Copied WOFF: ${path.basename(file)}`);
    }

    const originalStats = await fs.stat(file);
    const optimizedStats = await fs.stat(woff2Output);

    const savings = ((originalStats.size - optimizedStats.size) / originalStats.size * 100).toFixed(2);
    console.log(`  ✓ Saved: ${savings}% (${originalStats.size} → ${optimizedStats.size} bytes)`);

    return { originalSize: originalStats.size, optimizedSize: optimizedStats.size };
  } catch (error) {
    console.error(`  ✗ Failed to optimize font ${file}:`, error.message);
    return null;
  }
}

async function generateFontCSS() {
  console.log('📝 Generating font CSS...');

  const fonts = await fg(`${config.output}/**/*.{woff,woff2}`, {
    cwd: repoRoot
  });

  let css = `/* Optimized fonts CSS */\n\n`;

  for (const font of fonts) {
    const basename = path.basename(font, path.extname(font));
    const ext = path.extname(font).toLowerCase();
    const format = ext === '.woff2' ? 'woff2' : 'woff';

    css += `@font-face {\n`;
    css += `  font-family: '${basename}';\n`;
    css += `  src: url('./${font}') format('${format}');\n`;
    css += `  font-display: swap;\n`;
    css += `}\n\n`;
  }

  await fs.writeFile(path.join(repoRoot, config.output, 'fonts.css'), css);
  console.log('  ✓ Generated fonts.css');
}

async function main() {
  console.log('🔤 Starting font optimization...\n');

  const files = await fg(config.input, {
    cwd: repoRoot,
    absolute: true,
    onlyFiles: true
  });

  if (files.length === 0) {
    console.log('⚠ No fonts found to optimize');
    return;
  }

  console.log(`📁 Found ${files.length} fonts to optimize\n`);

  const results = [];
  for (const file of files) {
    const result = await optimizeFont(file);
    if (result) results.push(result);
  }

  const totalOriginal = results.reduce((sum, r) => sum + r.originalSize, 0);
  const totalOptimized = results.reduce((sum, r) => sum + r.optimizedSize, 0);
  const averageSavings = totalOriginal > 0
    ? ((totalOriginal - totalOptimized) / totalOriginal * 100)
    : 0;

  console.log('\n📊 Font Optimization Summary:');
  console.log(`   Fonts processed: ${results.length}`);
  console.log(`   Average size reduction: ${averageSavings.toFixed(2)}%`);

  await generateFontCSS();

  console.log('\n✅ Font optimization completed!');
}

main().catch(console.error);
```

---

## Build Optimization

Optimize the build process for better performance and smaller bundles.

### NPM Scripts for Optimization

```json
// package.json - Optimization scripts
{
  "scripts": {
    "format": "node scripts/formatting/format-repository.mjs",
    "format:auto": "node scripts/formatting/auto-format.mjs",
    "remove-comments": "node scripts/optimization/remove-comments-enhanced.mjs",
    "minify:js": "node scripts/optimization/minify-js.mjs",
    "minify:css": "node scripts/optimization/minify-css.mjs",
    "minify:html": "node scripts/optimization/minify-html.mjs",
    "minify": "npm run minify:js && npm run minify:css && npm run minify:html",
    "optimize:images": "node scripts/optimization/optimize-images.mjs",
    "optimize:fonts": "node scripts/optimization/optimize-fonts.mjs",
    "optimize:assets": "npm run optimize:images && npm run optimize:fonts",
    "build:optimized": "npm run format && npm run remove-comments && npm run build && npm run minify && npm run optimize:assets",
    "analyze:bundle": "npm run build && npx webpack-bundle-analyzer dist/static/js/*.js",
    "performance:audit": "npx lighthouse http://localhost:3000 --output=json --output-path=./lighthouse-report.json",
    "size:check": "npx bundlesize",
    "optimize": "npm run build:optimized && npm run analyze:bundle"
  }
}
```

### Bundle Size Monitoring

```javascript
// scripts/monitoring/bundle-size.mjs
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
    'dist/static/css/*.css'
  ],
  thresholds: {
    js: 500 * 1024,  // 500KB
    css: 100 * 1024, // 100KB
    total: 1024 * 1024 // 1MB
  }
};

async function analyzeBundle(file) {
  const stats = await fs.stat(file);
  const ext = path.extname(file).toLowerCase();
  const sizeKB = (stats.size / 1024).toFixed(2);

  return {
    file: path.relative(repoRoot, file),
    size: stats.size,
    sizeKB: parseFloat(sizeKB),
    type: ext.slice(1).toUpperCase()
  };
}

async function generateReport(bundles) {
  const report = {
    timestamp: new Date().toISOString(),
    bundles: [],
    summary: {
      totalSize: 0,
      totalSizeKB: 0,
      jsBundles: 0,
      cssBundles: 0,
      largestBundle: null,
      warnings: []
    }
  };

  for (const bundle of bundles) {
    report.bundles.push(bundle);
    report.summary.totalSize += bundle.size;
    report.summary.totalSizeKB += bundle.sizeKB;

    if (bundle.type === 'JS') {
      report.summary.jsBundles++;
      if (bundle.size > config.thresholds.js) {
        report.summary.warnings.push(`JS bundle ${bundle.file} exceeds ${config.thresholds.js / 1024}KB threshold`);
      }
    } else if (bundle.type === 'CSS') {
      report.summary.cssBundles++;
      if (bundle.size > config.thresholds.css) {
        report.summary.warnings.push(`CSS bundle ${bundle.file} exceeds ${config.thresholds.css / 1024}KB threshold`);
      }
    }

    if (!report.summary.largestBundle || bundle.size > report.summary.largestBundle.size) {
      report.summary.largestBundle = bundle;
    }
  }

  if (report.summary.totalSize > config.thresholds.total) {
    report.summary.warnings.push(`Total bundle size exceeds ${config.thresholds.total / (1024 * 1024)}MB threshold`);
  }

  await fs.writeFile(
    path.join(repoRoot, 'bundle-size-report.json'),
    JSON.stringify(report, null, 2)
  );

  return report;
}

async function main() {
  console.log('📊 Analyzing bundle sizes...\n');

  const files = await fg(config.bundles, {
    cwd: repoRoot,
    absolute: true,
    onlyFiles: true
  });

  if (files.length === 0) {
    console.log('⚠ No bundle files found. Run build first.');
    return;
  }

  const bundles = [];
  for (const file of files) {
    const bundle = await analyzeBundle(file);
    bundles.push(bundle);
    console.log(`📦 ${bundle.file}: ${bundle.sizeKB}KB`);
  }

  const report = await generateReport(bundles);

  console.log('\n📈 Bundle Size Summary:');
  console.log(`   Total size: ${report.summary.totalSizeKB.toFixed(2)}KB`);
  console.log(`   JS bundles: ${report.summary.jsBundles}`);
  console.log(`   CSS bundles: ${report.summary.cssBundles}`);
  console.log(`   Largest bundle: ${report.summary.largestBundle?.file} (${report.summary.largestBundle?.sizeKB}KB)`);

  if (report.summary.warnings.length > 0) {
    console.log('\n⚠️  Warnings:');
    report.summary.warnings.forEach(warning => console.log(`   - ${warning}`));
  }

  console.log('\n✅ Bundle analysis completed!');
  console.log('📄 Check bundle-size-report.json for detailed report');
}

main().catch(console.error);
```

---

## Performance Monitoring

Monitor and track performance metrics over time.

### Performance Budget Configuration

```javascript
// scripts/monitoring/performance-budget.mjs
const budgets = {
  // Bundle sizes
  bundles: {
    'dist/static/js/main.*.js': '500KB',
    'dist/static/js/vendor.*.js': '300KB',
    'dist/static/css/main.*.css': '100KB'
  },

  // Performance metrics
  lighthouse: {
    performance: 90,
    accessibility: 95,
    'best-practices': 95,
    seo: 90,
    pwa: 80
  },

  // Resource loading
  resources: {
    totalRequests: 50,
    totalSize: '2MB',
    imageSize: '1MB',
    fontSize: '200KB'
  }
};

module.exports = budgets;
```

### CI/CD Performance Testing

```yaml
# .github/workflows/performance.yml
name: Performance Testing

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  performance-test:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Build application
        run: npm run build

      - name: Start application
        run: |
          npm run start &
          sleep 10

      - name: Run Lighthouse
        uses: treosh/lighthouse-ci-action@v10
        with:
          urls: http://localhost:3000
          configPath: .lighthouserc.json
          uploadArtifacts: true
          temporaryPublicStorage: true

      - name: Bundle size check
        run: npm run size:check

      - name: Performance regression check
        run: |
          node scripts/monitoring/bundle-size.mjs
          # Add logic to compare with previous builds

      - name: Upload performance results
        uses: actions/upload-artifact@v3
        with:
          name: performance-results
          path: |
            .lighthouseci/
            bundle-size-report.json
            lighthouse-report.json
```

### Lighthouse Configuration

```json
// .lighthouserc.json
{
  "ci": {
    "collect": {
      "numberOfRuns": 3,
      "startServerCommand": "npm run start",
      "startServerReadyPattern": "ready on http://localhost:3000",
      "url": ["http://localhost:3000"]
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", {"minScore": 0.9}],
        "categories:accessibility": ["error", {"minScore": 0.95}],
        "categories:best-practices": ["error", {"minScore": 0.95}],
        "categories:seo": ["error", {"minScore": 0.9}],
        "categories:pwa": ["error", {"minScore": 0.8}]
      }
    },
    "upload": {
      "target": "temporary-public-storage"
    }
  }
}
```

---

## CI/CD Integration

Integrate optimization into your deployment pipeline.

### GitHub Actions Optimization Workflow

```yaml
# .github/workflows/optimize.yml
name: Optimize & Deploy

on:
  push:
    branches: [ main ]
  release:
    types: [ published ]

jobs:
  optimize:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Code formatting
        run: npm run format

      - name: Remove comments
        run: npm run remove-comments

      - name: Build application
        run: npm run build

      - name: Minify assets
        run: npm run minify

      - name: Optimize images
        run: npm run optimize:images

      - name: Optimize fonts
        run: npm run optimize:fonts

      - name: Bundle analysis
        run: npm run analyze:bundle

      - name: Performance audit
        run: npm run performance:audit

      - name: Upload optimized artifacts
        uses: actions/upload-artifact@v3
        with:
          name: optimized-build
          path: |
            dist/
            dist-minified/
            optimized-assets/
            optimized-fonts/
            *-report.json
            bundle-report.html

  deploy:
    needs: optimize
    runs-on: ubuntu-latest
    if: github.event_name == 'release'

    steps:
      - name: Download optimized build
        uses: actions/download-artifact@v3
        with:
          name: optimized-build

      - name: Deploy to production
        run: |
          # Add your deployment commands here
          echo "Deploying optimized build to production..."
```

This comprehensive optimization guide provides production-ready scripts and configurations for code formatting, comment removal, minification, bundle optimization, asset optimization, and performance monitoring. Implement these techniques to significantly improve your application's load times and user experience.