#!/usr/bin/env node
import { execSync } from 'child_process';

function run(cmd) {
  return execSync(cmd, { encoding: 'utf8' });
}

try {
  // format: commitHash|authorISO|committerISO
  const out = run('git log --all --pretty=format:"%H|%aI|%cI" --reverse');
  const lines = out.split(/\r?\n/).filter(Boolean);
  let count = 0;
  const bad = [];

  for (const line of lines) {
    count++;
    const [hash, authorI, committerI] = line.split('|');
    const authorTs = Date.parse(authorI || '');
    const committerTs = Date.parse(committerI || '');
    if (Number.isNaN(authorTs) || Number.isNaN(committerTs)) {
      bad.push({ hash, author: authorI, committer: committerI });
    }
  }

  console.log(`Scanned ${count} commits.`);
  if (bad.length === 0) {
    console.log('No unparsable author/committer dates found.');
    process.exit(0);
  }

  console.log(`Found ${bad.length} commits with unparsable dates:`);
  for (const b of bad) {
    console.log('\nCommit: ' + b.hash);
    console.log('  author:    ' + (b.author || '<empty>'));
    console.log('  committer: ' + (b.committer || '<empty>'));
    try {
      const show = run(`git show --quiet --pretty=fuller ${b.hash}`);
      console.log(show.split('\n').slice(0, 20).join('\n'));
    } catch (e) {
      console.log('  (failed to run git show)');
    }
  }
  process.exit(2);
} catch (err) {
  console.error('Error running git log:', err.message || err);
  process.exit(3);
}
