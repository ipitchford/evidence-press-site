#!/usr/bin/env node
'use strict';
/* Page-text correction mode: offline contract tests.
 *   node tools/test-page-fix.js           guard, note wording, edge-rewrite undo
 *   node tools/test-page-fix.js --built   also: the scoped build reproduces the
 *                                         full build's bytes for those outputs
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const assert = require('assert');
const { spawnSync } = require('child_process');
const pf = require('./page-fix');

const ROOT = path.resolve(__dirname, '..');
let n = 0;
const t = (name, fn) => { fn(); n++; console.log(`  ok ${name}`); };

const base = { slug: 'x', doi: '10.1/a', version: '1.0.0', pdfUrl: 'https://z/a.pdf', title: 'T', corrections: [{ date: '2026-01-01', scope: 'claim', summary: 's' }], relatedWorks: [{ doi: '10.2/b', citation: 'c' }] };
const clone = v => JSON.parse(JSON.stringify(v));

t('text edits pass the meta guard', () => {
  const after = clone(base); after.title = 'T2';
  after.corrections.push({ date: '2026-11-11', scope: 'presentation', summary: 'n' });
  assert.deepStrictEqual(pf.guardMeta(base, after), []);
});
for (const [key, mutate] of [
  ['doi', m => { m.doi = '10.1/b'; }], ['version', m => { m.version = '1.0.1'; }],
  ['pdfUrl', m => { m.pdfUrl = 'https://z/b.pdf'; }], ['relatedWorks.0.doi', m => { m.relatedWorks[0].doi = '10.2/c'; }],
  ['zenodoUrl', m => { m.zenodoUrl = 'https://zenodo.org/1'; }]
]) t(`refuses ${key} change`, () => {
  const after = clone(base); mutate(after);
  assert.ok(pf.guardMeta(base, after).some(e => e.includes(key)), key);
});
t('refuses edited or removed corrections', () => {
  const a = clone(base); a.corrections[0].summary = 'rewritten';
  assert.ok(pf.guardMeta(base, a).length);
  const b = clone(base); b.corrections = [];
  assert.ok(pf.guardMeta(base, b).length);
});
t('refuses result-changing correction scopes', () => {
  const a = clone(base); a.corrections.push({ date: '2026-11-11', scope: 'claim', summary: 'x' });
  assert.ok(pf.guardMeta(base, a).some(e => e.includes('full route')));
});
t('only body.md and meta.json of the slug are editable', () => {
  const re = pf.ALLOWED_SOURCE('abc');
  assert.ok(re.test('papers/abc/body.md') && re.test('papers/abc/meta.json'));
  for (const f of ['papers/abc/paper.pdf', 'papers/abcd/body.md', 'build.js', 'papers/abc/art.svg']) assert.ok(!re.test(f), f);
});
t('--pdf-slip wording names the PDF slip and says no new version or DOI', () => {
  const s = pf.correctionSummary("The archived PDF gives 0.31 for 0.13 in Table 2", true);
  assert.strictEqual(s, "The archived PDF gives 0.31 for 0.13 in Table 2. " + pf.PDF_SLIP_SENTENCE);
  assert.ok(/no new version or DOI was issued/.test(s));
  assert.throws(() => pf.correctionSummary('Typo fixed', true));
});
t('note is added once, dated, presentation scope, publicly indexed', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'pf-'));
  const f = path.join(dir, 'meta.json');
  fs.writeFileSync(f, JSON.stringify({ corrections: [{ date: '2026-01-01', scope: 'claim', summary: 'a' }], publicCorrectionIndexes: [0] }));
  assert.ok(pf.addCorrection(f, '2026-11-11', 'b'));
  assert.ok(!pf.addCorrection(f, '2026-11-11', 'b'));
  const m = JSON.parse(fs.readFileSync(f, 'utf8'));
  assert.deepStrictEqual(m.corrections[1], { date: '2026-11-11', scope: 'presentation', summary: 'b' });
  assert.deepStrictEqual(m.publicCorrectionIndexes, [0, 1]);
  fs.rmSync(dir, { recursive: true });
});
t('Cloudflare email obfuscation is undone exactly', () => {
  const email = 'ian@example.org?subject=A%20B', key = 0x39;
  const hex = key.toString(16) + Buffer.from(email).map(b => b ^ key).toString('hex');
  const live = `<a href="/cdn-cgi/l/email-protection#${hex}">x</a> <a href="/cdn-cgi/l/email-protection" class="__cf_email__" data-cfemail="${hex}">[email&#160;protected]</a>\n<script data-cfasync="false" src="/cdn-cgi/scripts/5c5dd728/cloudflare-static/email-decode.min.js"></script></body>`;
  assert.strictEqual(pf.undoEdgeRewrites('a/index.html', Buffer.from(live)).toString(), `<a href="mailto:${email}">x</a> ${email}\n</body>`);
  assert.strictEqual(pf.undoEdgeRewrites('a.json', Buffer.from(live)).toString(), live);
});
t('build stamps are ignored, content is not', () => {
  const a = Buffer.from('<p class="build-identity">source aaa</p>{"sourceCommit": "aaa"}');
  const b = Buffer.from('<p class="build-identity">source bbb</p>{"sourceCommit": "bbb"}');
  assert.ok(pf.normalize('x.html', a).equals(pf.normalize('x.html', b)));
  assert.ok(!pf.normalize('x.html', a).equals(pf.normalize('x.html', Buffer.from('<p>other</p>'))));
});
t('dependency set covers the release page and shared outputs only', () => {
  const d = pf.dependencyPattern('abc');
  for (const f of ['releases/abc/index.html', 'index.html', 'api/papers.json', 'sitemap.xml', 'feed.xml', 'llms-full.txt', 'atlas/index.html']) assert.ok(d.test(f), f);
  for (const f of ['releases/abd/index.html', 'about/index.html', 'assets/style.css', '_headers', 'protocols/index.html']) assert.ok(!d.test(f), f);
});
t('live URL mapping follows Pages pretty URLs', () => {
  assert.ok(pf.liveUrl('index.html').endsWith('/'));
  assert.ok(pf.liveUrl('releases/a/index.html').endsWith('/releases/a/'));
  assert.ok(pf.liveUrl('404.html').endsWith('/404'));
});

if (process.argv.includes('--built')) {
  const dist = path.join(ROOT, 'dist');
  const slugs = fs.readdirSync(path.join(ROOT, 'papers')).filter(s => fs.existsSync(path.join(ROOT, 'papers', s, 'meta.json'))).sort();
  for (const slug of [slugs[0], slugs[slugs.length - 1]]) t(`scoped build reproduces full-build bytes (${slug})`, () => {
    const out = fs.mkdtempSync(path.join(os.tmpdir(), 'pf-scoped-'));
    fs.rmdirSync(out);
    const r = spawnSync(process.execPath, ['build.js'], { cwd: ROOT, env: { ...process.env, EP_PAGE_FIX_SLUG: slug, EP_PAGE_FIX_OUT: out }, encoding: 'utf8' });
    assert.strictEqual(r.status, 0, r.stderr);
    const files = [];
    (function walk(d, rel) { for (const x of fs.readdirSync(d)) { const f = path.join(d, x), q = rel ? `${rel}/${x}` : x; if (fs.statSync(f).isDirectory()) walk(f, q); else files.push(q); } })(out, '');
    assert.ok(files.includes(`releases/${slug}/index.html`) && files.includes('api/papers.json'));
    const d = pf.dependencyPattern(slug);
    for (const f of files) {
      assert.ok(d.test(f), `scoped output outside dependency set: ${f}`);
      if (f === 'sitemap.xml') continue; // integrate.sh appends /protocols/ entries
      // Build stamps aside (dist may predate a ledger-only reseal commit), bytes must match.
      assert.ok(pf.normalize(f, fs.readFileSync(path.join(out, f))).equals(pf.normalize(f, fs.readFileSync(path.join(dist, f)))), `scoped bytes differ: ${f}`);
    }
    fs.rmSync(out, { recursive: true });
  });
}
console.log(`page-fix: ${n} checks passed`);
