#!/usr/bin/env node
'use strict';
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { releaseStatusText } = require('./release-status');

assert.strictEqual(releaseStatusText('passed', 'html'),
  'Unrefereed · internally replayed; awaiting independent verification');
assert.strictEqual(releaseStatusText('passed'),
  'unrefereed (internally replayed; not peer reviewed, not independently reproduced, not formally verified)');
assert.strictEqual(releaseStatusText('passed', 'bibtex'),
  'Unrefereed; internally replayed evidence package.');
assert.strictEqual(releaseStatusText('passed', 'jsonld'),
  'Unrefereed — internally replayed evidence; not peer reviewed, not independently reproduced, not formally verified');
for (const state of ['not-assessed', 'partial', 'failed', undefined]) {
  for (const surface of ['html', 'markdown', 'bibtex', 'jsonld']) {
    const text = releaseStatusText(state, surface);
    assert(text.includes('internal replay not claimed'), `${state}/${surface}`);
    assert(!text.includes('internally replayed'), `${state}/${surface} overclaim`);
    assert(!text.includes('internally reviewed'), `${state}/${surface} invented review`);
  }
}
// Guard all five actual renderer call sites, not merely the helper's output.
const builder = fs.readFileSync(path.join(__dirname, '..', 'build.js'), 'utf8');
assert.strictEqual((builder.match(/releaseStatusText\(assuranceState\(assuranceOf\(p\), 'internalReplay'\)/g) || []).length, 5);
assert(!builder.includes('internally replayed'), 'no hard-coded positive replay claim may remain in the builder');
assert(!builder.includes('status: unrefereed (internally replayed;'));
assert(!builder.includes('`- Status: unrefereed (internally replayed;'));
assert(!builder.includes('<dt>Status</dt><dd>Unrefereed · internally replayed;'));
console.log('Release status assurance wording tests passed.');
