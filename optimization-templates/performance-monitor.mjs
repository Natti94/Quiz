// scripts/monitoring/performance-monitor.mjs
import { promises as fs } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fg from 'fast-glob';

const __filename = fileURLToPath(import.meta.url);
const scriptDir = path.dirname(__filename);
const repoRoot = path.resolve(scriptDir, '..', '..');

const config = {
  reports: [
    'lighthouse-report.json',
    'bundle-size-report.json',
    'minification-report.json',
    'comment-removal-report.json'
  ],
  historyFile: 'performance-history.json',
  thresholds: {
    lighthouse: {
      performance: 90,
      accessibility: 95,
      'best-practices': 95,
      seo: 90
    },
    bundleSize: {
      maxSize: 1024 * 1024, // 1MB
      maxSavings: 30 // 30% size reduction
    }
  }
};

async function loadPreviousResults() {
  try {
    const data = await fs.readFile(path.join(repoRoot, config.historyFile), 'utf8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function loadCurrentReports() {
  const reports = {};

  for (const reportFile of config.reports) {
    try {
      const data = await fs.readFile(path.join(repoRoot, reportFile), 'utf8');
      reports[path.basename(reportFile, '.json')] = JSON.parse(data);
    } catch (error) {
      console.log(`⚠ Could not load ${reportFile}:`, error.message);
    }
  }

  return reports;
}

function analyzeLighthouseResults(lighthouse) {
  if (!lighthouse) return null;

  const categories = lighthouse.categories || {};
  const analysis = {
    timestamp: lighthouse.fetchTime || new Date().toISOString(),
    scores: {},
    passed: true,
    issues: []
  };

  for (const [category, data] of Object.entries(categories)) {
    const score = Math.round(data.score * 100);
    analysis.scores[category] = score;

    if (config.thresholds.lighthouse[category] && score < config.thresholds.lighthouse[category]) {
      analysis.passed = false;
      analysis.issues.push(`${category}: ${score}% (threshold: ${config.thresholds.lighthouse[category]}%)`);
    }
  }

  return analysis;
}

function analyzeBundleResults(bundle) {
  if (!bundle) return null;

  const analysis = {
    totalSize: bundle.totalSize || 0,
    totalSizeKB: bundle.totalSizeKB || 0,
    largestBundle: bundle.largestBundle || null,
    status: 'ok',
    issues: []
  };

  if (bundle.totalSize > config.thresholds.bundleSize.maxSize) {
    analysis.status = 'error';
    analysis.issues.push(`Total bundle size exceeds ${(config.thresholds.bundleSize.maxSize / 1024 / 1024).toFixed(1)}MB`);
  }

  return analysis;
}

function analyzeOptimizationResults(minification, comments) {
  const analysis = {
    minificationSavings: minification?.averageSavings || 0,
    commentRemovalSavings: 0,
    totalOptimizations: 0
  };

  if (comments?.totalSavings) {
    analysis.commentRemovalSavings = (comments.totalSavings / 1024).toFixed(2); // KB saved
  }

  analysis.totalOptimizations = analysis.minificationSavings + parseFloat(analysis.commentRemovalSavings);

  return analysis;
}

function compareWithPrevious(current, previous) {
  if (!previous || previous.length === 0) return null;

  const latest = previous[previous.length - 1];
  const comparison = {
    lighthouse: {},
    bundleSize: {},
    optimizations: {}
  };

  // Compare Lighthouse scores
  if (current.lighthouse && latest.lighthouse) {
    for (const [category, score] of Object.entries(current.lighthouse.scores)) {
      const prevScore = latest.lighthouse.scores[category];
      if (prevScore !== undefined) {
        comparison.lighthouse[category] = {
          current: score,
          previous: prevScore,
          change: score - prevScore
        };
      }
    }
  }

  // Compare bundle sizes
  if (current.bundle && latest.bundle) {
    comparison.bundleSize = {
      current: current.bundle.totalSizeKB,
      previous: latest.bundle.totalSizeKB,
      change: current.bundle.totalSizeKB - latest.bundle.totalSizeKB
    };
  }

  return comparison;
}

async function generateReport(current, comparison) {
  const report = {
    timestamp: new Date().toISOString(),
    lighthouse: current.lighthouse,
    bundle: current.bundle,
    optimizations: current.optimizations,
    comparison: comparison
  };

  // Save to history
  const history = await loadPreviousResults();
  history.push(report);

  // Keep only last 10 reports
  if (history.length > 10) {
    history.splice(0, history.length - 10);
  }

  await fs.writeFile(path.join(repoRoot, config.historyFile), JSON.stringify(history, null, 2));

  return report;
}

async function displayResults(current, comparison) {
  console.log('📊 Performance Monitoring Report\n');

  // Lighthouse Results
  if (current.lighthouse) {
    console.log('🏮 Lighthouse Scores:');
    for (const [category, score] of Object.entries(current.lighthouse.scores)) {
      const status = score >= (config.thresholds.lighthouse[category] || 0) ? '✅' : '❌';
      const change = comparison?.lighthouse[category]?.change;
      const changeStr = change !== undefined ? ` (${change > 0 ? '+' : ''}${change})` : '';
      console.log(`   ${status} ${category}: ${score}%${changeStr}`);
    }

    if (current.lighthouse.issues.length > 0) {
      console.log('   ⚠️  Issues:');
      current.lighthouse.issues.forEach(issue => console.log(`      - ${issue}`));
    }
    console.log('');
  }

  // Bundle Analysis
  if (current.bundle) {
    console.log('📦 Bundle Analysis:');
    console.log(`   Total size: ${current.bundle.totalSizeKB?.toFixed(2) || 0} KB`);
    if (current.bundle.largestBundle) {
      console.log(`   Largest bundle: ${current.bundle.largestBundle.file} (${current.bundle.largestBundle.sizeKB} KB)`);
    }

    if (comparison?.bundleSize) {
      const change = comparison.bundleSize.change;
      const changeStr = change > 0 ? `🔴 +${change.toFixed(2)}KB` : `🟢 ${change.toFixed(2)}KB`;
      console.log(`   Size change: ${changeStr}`);
    }
    console.log('');
  }

  // Optimization Results
  if (current.optimizations) {
    console.log('⚡ Optimizations:');
    console.log(`   Minification savings: ${current.optimizations.minificationSavings?.toFixed(2) || 0}%`);
    console.log(`   Comment removal savings: ${current.optimizations.commentRemovalSavings || 0} KB`);
    console.log(`   Total optimization impact: ${current.optimizations.totalOptimizations?.toFixed(2) || 0}%`);
    console.log('');
  }

  // Overall Status
  const hasIssues = (current.lighthouse?.issues.length > 0) ||
                   (current.bundle?.status === 'error');

  if (hasIssues) {
    console.log('❌ Performance issues detected!');
  } else {
    console.log('✅ All performance checks passed!');
  }

  if (comparison) {
    console.log('\n📈 Trend Analysis:');
    console.log('   (Positive numbers = improvement, negative = regression)');

    if (comparison.lighthouse) {
      console.log('   Lighthouse changes:');
      for (const [category, data] of Object.entries(comparison.lighthouse)) {
        const change = data.change;
        const trend = change > 0 ? '📈' : change < 0 ? '📉' : '➡️';
        console.log(`      ${trend} ${category}: ${change > 0 ? '+' : ''}${change}%`);
      }
    }

    if (comparison.bundleSize) {
      const change = comparison.bundleSize.change;
      const trend = change < 0 ? '📈' : change > 0 ? '📉' : '➡️';
      console.log(`   Bundle size change: ${trend} ${change > 0 ? '+' : ''}${change.toFixed(2)} KB`);
    }
  }
}

async function main() {
  console.log('🔍 Starting performance monitoring...\n');

  const [previousResults, currentReports] = await Promise.all([
    loadPreviousResults(),
    loadCurrentReports()
  ]);

  // Analyze current results
  const current = {
    lighthouse: analyzeLighthouseResults(currentReports['lighthouse-report']),
    bundle: analyzeBundleResults(currentReports['bundle-size-report']),
    optimizations: analyzeOptimizationResults(
      currentReports['minification-report'],
      currentReports['comment-removal-report']
    )
  };

  // Compare with previous
  const comparison = compareWithPrevious(current, previousResults);

  // Generate and display report
  await generateReport(current, comparison);
  await displayResults(current, comparison);

  console.log('\n✅ Performance monitoring completed!');
  console.log('📄 Check performance-history.json for historical data');
}

main().catch(console.error);