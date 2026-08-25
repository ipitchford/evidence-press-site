#!/usr/bin/env node
'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const assert = require('assert');
const { loadArticles, validateMeta } = require('./articles');

let passed = 0;
function check(name, fn) {
  try { fn(); passed++; console.log(`ok      ${name}`); }
  catch (error) { console.error(`FAIL    ${name}\n  ${error.message}`); process.exitCode = 1; }
}

const ROOT = path.join(__dirname, '..');
const releaseSlugs = fs.readdirSync(path.join(ROOT, 'papers')).filter(name => !name.startsWith('_'));

check('current article corpus satisfies the separate authoring contract', () => {
  const articles = loadArticles(ROOT, { releaseSlugs });
  assert.ok(articles.length >= 1);
  assert.ok(articles.some(article => article.slug === 'assurance-infrastructure'));
  assert.ok(articles.every(article => article.claimBoundary && article.license === 'CC0-1.0'));
});

const valid = {
  schemaVersion: '1.0', slug: 'fixture', title: 'Fixture', standfirst: 'Standfirst.',
  summary: 'Summary.', datePublished: '2026-08-25', dateModified: '2026-08-25',
  articleClass: 'essay', status: 'published', byline: 'Evidence Press',
  topics: ['testing'], newResearchClaims: false, claimBoundary: 'Exposition only.',
  sources: [], relatedReleases: [], relatedArticles: [], corrections: [],
  license: 'CC0-1.0', renderMode: 'generated'
};

check('hostile metadata cannot smuggle a non-https source into a page', () => {
  const bad = { ...valid, sources: [{ citation: 'Bad source', url: 'javascript:alert(1)' }] };
  assert.ok(validateMeta(bad, 'fixture').some(error => error.includes('https URL')));
});

check('misspelled or invented metadata fields fail closed', () => {
  const bad = { ...valid, assuranceLevel: 'peer-reviewed' };
  assert.ok(validateMeta(bad, 'fixture').some(error => error.includes('unknown field assuranceLevel')));
});

check('legacy pages require a safe canonical path and in-repository source', () => {
  const bad = { ...valid, renderMode: 'existing-page', canonicalPath: '/../escape/', sourcePath: '../../secret' };
  assert.ok(validateMeta(bad, 'fixture').some(error => error.includes('canonicalPath')));
});

check('unknown release relations fail the complete-corpus load', () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'ep-article-test-'));
  try {
    const dir = path.join(tmp, 'articles', 'fixture');
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'body.md'), 'Fixture body.');
    fs.writeFileSync(path.join(dir, 'meta.json'), JSON.stringify({
      ...valid, relatedReleases: [{ slug: 'missing-release', relation: 'comments on' }]
    }));
    assert.throws(() => loadArticles(tmp, { releaseSlugs: ['known-release'] }), /unknown release/);
  } finally { fs.rmSync(tmp, { recursive: true, force: true }); }
});

if (!process.exitCode) console.log(`\nALL ${passed} ARTICLE TESTS PASSED`);
