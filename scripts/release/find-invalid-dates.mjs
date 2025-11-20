#!/usr/bin/env node
import { execFileSync } from 'child_process';

function isValidDateString(d) {
  if (!d) return false;
  const dt = new Date(d);
  return !Number.isNaN(dt.getTime());
}

function checkCommits() {
  const out = execFileSync('git', ['log', '--all', "--pretty=format:%H|%an|%ae|%ai|%cn|%ce|%ci"], { encoding: 'utf8' });
  const lines = out.split(/\r?\n/).filter(Boolean);
  const invalid = [];
  for (const line of lines) {
    // fields: hash|authorName|authorEmail|authorDate|committerName|committerEmail|committerDate
    const parts = line.split('|');
    if (parts.length < 7) continue;
    const [hash, aName, aEmail, aDate, cName, cEmail, cDate] = parts;
    if (!isValidDateString(aDate)) invalid.push({ type: 'commit', role: 'author', hash, name: aName, email: aEmail, date: aDate });
    if (!isValidDateString(cDate)) invalid.push({ type: 'commit', role: 'committer', hash, name: cName, email: cEmail, date: cDate });
  }
  return invalid;
}

function checkTags() {
  // for annotated tags, taggerdate will be filled; lightweight tags will have empty taggerdate
  const out = execFileSync('git', ['for-each-ref', "--format=%(refname:short)|%(objecttype)|%(taggername)|%(taggeremail)|%(taggerdate)", 'refs/tags'], { encoding: 'utf8' });
  const lines = out.split(/\r?\n/).filter(Boolean);
  const invalid = [];
  for (const line of lines) {
    const parts = line.split('|');
    // fields: tagName|objectType|taggerName|taggerEmail|taggerDate
    const [tagName, objectType, taggerName, taggerEmail, taggerDate] = parts;
    if (taggerDate && !isValidDateString(taggerDate)) invalid.push({ type: 'tag', tagName, objectType, taggerName, taggerEmail, taggerDate });
  }
  return invalid;
}

function main() {
  try {
    console.log('Checking commit author/committer dates...');
    const commitsInvalid = checkCommits();
    console.log(`Scanned commits. Invalid commit dates found: ${commitsInvalid.length}`);
    if (commitsInvalid.length) console.dir(commitsInvalid, { depth: null });

    console.log('\nChecking tagger dates for annotated tags...');
    const tagsInvalid = checkTags();
    console.log(`Scanned tags. Invalid tagger dates found: ${tagsInvalid.length}`);
    if (tagsInvalid.length) console.dir(tagsInvalid, { depth: null });

    if (commitsInvalid.length || tagsInvalid.length) {
      console.error('\nOne or more invalid dates found. See objects printed above.');
      process.exitCode = 2;
    } else {
      console.log('\nNo unparsable dates found in commits or annotated tags.');
    }
  } catch (err) {
    console.error('Error while running checks:', err.message);
    console.error(err.stack);
    process.exitCode = 3;
  }
}

main();
