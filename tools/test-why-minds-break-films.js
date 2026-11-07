#!/usr/bin/env node
'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, 'dist', file), 'utf8');
const series = JSON.parse(read('why-minds-break/films/series.json'));
const html = read('why-minds-break/films/index.html');
const sitemap = read('sitemap.xml');
const expectedIds = ['8aaroSAm6jk', '_6YVS2az220', 't0XmRGT8XLM', 'TySJ0zjEgFc', 'hH4AJ-1yKQU', '8Ji1svWWA0w', 'wd_jaNHYijs', 'Z3Zteqc_Y8c', 'XkgZCwF_MWQ', '7NlH8b6be7A', 'Zli0mwlxSdc'];
assert.equal(series.channelUrl, 'https://www.youtube.com/@EvidencePress');
assert.equal(series.playlistUrl, 'https://www.youtube.com/playlist?list=PLYwsqgk3zDVo');
assert.deepEqual(series.episodes.map(e => e.number), Array.from({ length: 11 }, (_, i) => i + 1));
assert.deepEqual(series.episodes.map(e => e.youtubeId), expectedIds);
assert.equal(new Set(series.episodes.map(e => e.essayUrl)).size, 11);
assert.match(html, /<h1>Why Minds Break<\/h1>/);
assert.equal((html.match(/data-episode="\d+"/g) || []).length, 11);
assert.doesNotMatch(html, /<iframe|<video/); // No third-party player or large MP4 loads before the reader asks.
assert.match(html, /Information, not medical advice/);
const forbidden = /source map|editable project|heart (?:american |— american |narration)|local review copy|nothing has been uploaded|all files remain local|file:\/\/\/|\/Users\/admin|SOURCE_MAP|YouTube notes/i;
for (const e of series.episodes) {
  const prefix = `why-minds-break/films/${e.slug}/`;
  const essay = read(prefix + 'index.html');
  const text = read(prefix + 'index.md');
  assert.match(essay, /Information, not medical advice/);
  assert.match(essay, /not had independent clinical review/);
  assert.ok(essay.includes(e.youtubeUrl));
  assert.ok(essay.includes(`href="https://evidencepress.org/${prefix}"`));
  assert.ok(sitemap.includes(`https://evidencepress.org/${prefix}`));
  assert.ok(text.split(/\s+/).length >= 1800, `${e.slug}: missing comprehensive essay`);
  assert.ok((essay.match(/<h2 id=/g) || []).length >= 4, `${e.slug}: missing reading structure`);
  assert.ok((text.match(/\]\(https:\/\//g) || []).length >= 8, `${e.slug}: missing source links`);
  for (const match of text.matchAll(/\]\((https?:\/\/[^\s)]+)\)/g)) {
    const target = match[1].replace(/&/g, '&amp;').replace(/"/g, '&quot;');
    assert.ok(!target.includes('('), `${e.slug}: encode parentheses inside citation URLs`);
    assert.ok(essay.includes(`href="${target}"`) || (target.startsWith('https://evidencepress.org/') && essay.includes(`href="${target.slice('https://evidencepress.org'.length)}"`)), `${e.slug}: citation URL was truncated by rendering: ${target}`);
  }

  assert.ok(fs.existsSync(path.join(root, 'dist', e.poster)));
  assert.ok(fs.existsSync(path.join(root, 'dist', e.captions)));
  assert.ok(e.chapters[0].start === 0 && e.chapters.every((c, i, a) => c.start >= 0 && c.start < e.duration && (!i || c.start > a[i - 1].start)));
  assert.doesNotMatch(essay, forbidden, e.slug);
}
assert.doesNotMatch(html, forbidden);
assert.ok(html.includes('Major depression') && html.includes('Persistent depression (dysthymia)'));
console.log('PASS: eleven distinct Evidence Press films, comprehensive cited essays, disclaimers, captions, chapter timing, public links and privacy-first player.');
