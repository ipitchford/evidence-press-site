#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const slug = process.argv[2];
const title = process.argv[3];
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

if (!slugPattern.test(String(slug || '')) || !title || !title.trim()) {
  console.error('Usage: node tools/new-article.js a-short-url-slug "The article title"');
  process.exit(1);
}

const dir = path.join(ROOT, 'articles', slug);
if (fs.existsSync(dir)) {
  console.error(`Refusing to overwrite existing article directory: articles/${slug}`);
  process.exit(1);
}

const today = new Date().toISOString().slice(0, 10);
const meta = {
  schemaVersion: '1.0',
  slug,
  title: title.trim(),
  standfirst: 'Replace this with a one-sentence reader-facing standfirst.',
  summary: 'Replace this with a concise catalogue and feed summary.',
  datePublished: today,
  dateModified: today,
  articleClass: 'essay',
  status: 'published',
  byline: 'Evidence Press',
  topics: ['replace this topic'],
  newResearchClaims: false,
  claimBoundary: 'Expository article. It is not a certificate-backed Evidence Press research release and does not imply formal verification, independent reproduction or peer review.',
  sources: [],
  relatedReleases: [],
  relatedArticles: [],
  corrections: [],
  license: 'CC0-1.0',
  renderMode: 'generated'
};

fs.mkdirSync(dir, { recursive: false });
fs.writeFileSync(path.join(dir, 'meta.json'), JSON.stringify(meta, null, 2) + '\n');
fs.writeFileSync(path.join(dir, 'body.md'), 'Write the article here.\n\n## First section\n\nContinue here.\n');
console.log(`Created articles/${slug}/body.md and meta.json`);
console.log('Next: edit both files, then run `node tools/test-articles.js && node build.js`.');
