#!/usr/bin/env node
'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const assert = require('assert');
const { loadArticles, validateMeta, articleAttribution, BANNER_SRC_RE } = require('./articles');

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

const banner = {
  src: '/assets/articles/fixture-banner.webp',
  alt: 'Illustrative fluid motion.', caption: 'Illustration, not a simulation.'
};
const audio = {
  src: '/assets/audio/fixture.mp3', transcript: '/assets/audio/fixture.txt',
  provenance: '/assets/audio/fixture.provenance.json', durationSeconds: 125.5,
  voiceLabel: 'OpenAI API synthetic voice (fable)'
};
check('article audio requires safe matching assets, positive duration and synthetic disclosure', () => {
  assert.deepStrictEqual(validateMeta({ ...valid, audio }, 'fixture'), []);
  for (const value of [null, [], {}, { ...audio, src: 'https://example.com/track.mp3' },
    { ...audio, transcript: '/assets/audio/other.txt' }, { ...audio, durationSeconds: 0 },
    { ...audio, durationSeconds: '120' }, { ...audio, voiceLabel: 'human' },
    { ...audio, autoplay: true }]) {
    assert.ok(validateMeta({ ...valid, audio: value }, 'fixture').some(error => error.includes('audio')));
  }
});

check('banner is optional and valid local image formats are accepted', () => {
  assert.deepStrictEqual(validateMeta(valid, 'fixture'), []);
  for (const extension of ['png', 'jpg', 'jpeg', 'webp', 'svg']) {
    assert.deepStrictEqual(validateMeta({ ...valid, banner: {
      ...banner, src: `/assets/articles/fixture-banner.${extension}`
    } }, 'fixture'), []);
  }
  const schema = JSON.parse(fs.readFileSync(path.join(ROOT, 'schemas/article.schema.json'), 'utf8'));
  assert.strictEqual(schema.$defs.banner.properties.src.pattern, BANNER_SRC_RE.source.replace(/\\\//g, '/'));
  assert.strictEqual(schema.$defs.banner.additionalProperties, false);
});

check('hostile or nonlocal banner paths fail closed', () => {
  for (const src of [
    'https://example.com/image.png', '//example.com/image.png', 'javascript:alert(1)',
    'data:image/svg+xml,<svg/>', '/assets/articles/../secret.png', '/assets/articles/%2e%2e/secret.png',
    '/assets/articles/nested/banner.png', '/assets/articles/banner.png?tracking=1',
    '/assets/articles/banner.png#fragment', '/assets/articles/banner.PNG',
    '/assets/articles/banner.html', '/assets/articles/banner.png" onerror="alert(1)',
    '/assets/articles/banner\\image.png', '/assets/articles/.hidden.png',
    '/assets/articles/banner..png', '/assets/articles/banner.png\n'
  ]) {
    assert.ok(validateMeta({ ...valid, banner: { ...banner, src } }, 'fixture')
      .some(error => error.includes('banner.src')), `accepted unsafe banner path: ${JSON.stringify(src)}`);
  }
});

check('banner requires an object, plain text descriptions and no unknown fields', () => {
  for (const value of [null, [], 'image.png', {}, { ...banner, alt: '' },
    { ...banner, caption: '  ' }, { ...banner, alt: 123 }, { ...banner, width: 1200 }]) {
    assert.ok(validateMeta({ ...valid, banner: value }, 'fixture').some(error => error.includes('banner')));
  }
});

// Exercise the actual exported-record and Markdown functions without running
// the complete site build or touching its generated publication artefacts.
const buildSource = fs.readFileSync(path.join(ROOT, 'build.js'), 'utf8');
function buildFunction(name) {
  const start = buildSource.indexOf(`function ${name}(`);
  assert.ok(start >= 0, `missing build function ${name}`);
  const next = buildSource.indexOf('\nfunction ', start + 1);
  return buildSource.slice(start, next === -1 ? undefined : next);
}
const exportsHarness = new Function('articleAttribution', `
  const BASE = 'https://evidencepress.org';
  const ARTICLE_SCHEMA_VERSION = '1.0';
  const CONFIG = { publisher: 'Evidence Press', language: 'en-GB' };
  const articleUrl = article => BASE + '/articles/' + article.slug + '/';
  const githubPath = (kind, file) => 'https://github.com/example/site/' + kind + '/main/' + file;
  const paperBySlug = new Map();
  ${['articleRecord', 'articleJsonldNode', 'articleMarkdown'].map(buildFunction).join('\n')}
  return { articleRecord, articleJsonldNode, articleMarkdown };
`)(articleAttribution);
const exportFixture = { ...valid, body: 'Body.', readingMinutes: 1, wordCount: 1,
  sourcePath: 'articles/fixture/body.md', metaPath: 'articles/fixture/meta.json' };

check('full-text audio exports retain accessible links and do not appear without opt-in', () => {
  assert.deepStrictEqual(exportsHarness.articleRecord({ ...exportFixture, audio }).audio, audio);
  const media = exportsHarness.articleJsonldNode({ ...exportFixture, audio }).associatedMedia;
  assert.strictEqual(media['@type'], 'AudioObject');
  assert.strictEqual(media.contentUrl, 'https://evidencepress.org' + audio.src);
  assert.strictEqual(media.duration, 'PT126S');
  assert.ok(!Object.hasOwn(exportsHarness.articleRecord(exportFixture), 'audio'));
  assert.ok(!Object.hasOwn(exportsHarness.articleJsonldNode(exportFixture), 'associatedMedia'));
});

check('banner exports preserve metadata, absolute image URL and exact AI credit', () => {
  const fixture = { ...exportFixture, banner,
    byline: 'GPT-6 Astra Ultra and Anthropic Fable 5.1 High', bylineType: 'ai-systems' };
  assert.deepStrictEqual(exportsHarness.articleRecord(fixture).banner, banner);
  const node = exportsHarness.articleJsonldNode(fixture);
  assert.strictEqual(node.image, 'https://evidencepress.org' + banner.src);
  assert.strictEqual(node.creditText, fixture.byline);
  assert.ok(!Object.hasOwn(node, 'author'));
  const md = exportsHarness.articleMarkdown(fixture);
  assert.ok(md.includes('https://evidencepress.org' + banner.src));
  assert.ok(md.indexOf('![') < md.indexOf('# Fixture'));
  assert.ok(!Object.hasOwn(exportsHarness.articleRecord(exportFixture), 'banner'));
  assert.ok(!Object.hasOwn(exportsHarness.articleJsonldNode(exportFixture), 'image'));
  assert.ok(!exportsHarness.articleMarkdown(exportFixture).includes('!['));
});

check('banner Markdown descriptions cannot introduce links or raw HTML', () => {
  const md = exportsHarness.articleMarkdown({ ...exportFixture, banner: {
    ...banner, alt: 'Text](/unsafe)\n[more', caption: '<script>bad()</script>\n[link](javascript:bad)'
  } });
  assert.ok(md.includes('Text\\](/unsafe) \\[more'));
  assert.ok(!md.includes('<script>'));
  assert.ok(!md.includes('[link](javascript:bad)'));
});

check('hostile metadata cannot smuggle a non-https source into a page', () => {
  const bad = { ...valid, sources: [{ citation: 'Bad source', url: 'javascript:alert(1)' }] };
  assert.ok(validateMeta(bad, 'fixture').some(error => error.includes('https URL')));
});

check('explicit AI authorship remains a credit, not a fictitious Person', () => {
  const meta = { ...valid, byline: 'Model A and Model B', bylineType: 'ai-systems' };
  assert.deepStrictEqual(validateMeta(meta, 'fixture'), []);
  assert.deepStrictEqual(articleAttribution(meta, 'Evidence Press', 'https://evidencepress.org'),
    { creditText: 'Model A and Model B' });
  assert.ok(validateMeta({ ...meta, bylineType: 'guessed' }, 'fixture').some(error => error.includes('bylineType')));
  assert.strictEqual(articleAttribution(valid, 'Evidence Press', 'https://evidencepress.org').author['@type'], 'Organization');
  assert.strictEqual(articleAttribution({ ...valid, byline: 'Named Author' }, 'Evidence Press', 'https://evidencepress.org').author['@type'], 'Person');
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

// Keep the optional narration's offline provenance controls in the same CI
// entry point as the rest of the article contract; this never calls TTS.
require('./test-article-audio');
