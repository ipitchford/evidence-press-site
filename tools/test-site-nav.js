#!/usr/bin/env node
'use strict';
/*
 * Site navigation contract (tools/site-nav.js).
 *
 *   node tools/test-site-nav.js           unit tests of placement and markup
 *   node tools/test-site-nav.js --built   also check the generated dist/
 *
 * Origin: 2026-11-12. The header had grown to twelve ungrouped links, the
 * /protocols/ builder carried a hand-copied six-link variant, Minds Explored
 * had no way back to the rest of the site, and several sections were reachable
 * only three to five clicks deep. One definition now drives every header; these
 * tests stop the copies drifting apart again.
 */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const NAV = require('./site-nav');

const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const BUILT = process.argv.includes('--built');
let checks = 0;
const ok = (cond, msg) => { assert.ok(cond, msg); checks++; };
const eq = (a, b, msg) => { assert.equal(a, b, msg); checks++; };

/* ---------------------------------------------------------- definition */
const sections = NAV.GROUPS.flatMap(g => g.sections.map(s => ({ ...s, group: g.id })));
for (const g of NAV.GROUPS) {
  ok(/^\/[a-z-]+\/$/.test(g.href), `group ${g.id} href is a directory path`);
  ok(g.sections.length >= 2 && g.sections.length <= 6, `group ${g.id} has 2-6 sections`);
  if (g.hub) {
    ok(g.standfirst, `hub group ${g.id} has a standfirst`);
    for (const s of g.sections) ok(s.detail, `hub section ${s.href} has a detail line`);
  }
}
for (const s of sections) ok(/^\/([a-z0-9-]+\/)*$/.test(s.href), `section href ${s.href} is a directory path`);
eq(new Set(sections.map(s => s.href)).size, sections.length, 'no section appears twice');
eq(NAV.GROUPS.map(g => g.id).join(' '), 'research learn practice about shop', 'five top-level groups, Shop last beside Donate');

/* ----------------------------------------------------------- placement */
const at = p => { const h = NAV.locate(p); return [h.group && h.group.id, h.section && h.section.href]; };
assert.deepEqual(at('/'), ['research', '/']); checks++;
assert.deepEqual(at('/releases/some-slug/'), ['research', '/']); checks++;
assert.deepEqual(at('/articles/an-article/'), ['research', '/articles/']); checks++;
assert.deepEqual(at('/observatory/assurance/'), ['research', '/observatory/']); checks++;
assert.deepEqual(at('/why-minds-break/films/adhd/'), ['learn', '/why-minds-break/']); checks++;
assert.deepEqual(at('/origins-of-violence/'), ['learn', '/thesis/']); checks++;
assert.deepEqual(at('/interpsych/'), ['learn', '/interpsych/']); checks++;
assert.deepEqual(at('/protocols/start/'), ['practice', '/protocols/start/'], 'longest prefix wins'); checks++;
assert.deepEqual(at('/protocols/p/project-handoff/'), ['practice', '/protocols/']); checks++;
assert.deepEqual(at('/productivity/case-study/'), ['practice', '/productivity/case-study/']); checks++;
assert.deepEqual(at('/research-metrics/'), ['about', '/research-metrics/']); checks++;
assert.deepEqual(at('/research/'), ['research', null], 'a hub belongs to its group'); checks++;
assert.deepEqual(at('/shop/'), ['shop', '/shop/']); checks++;
assert.deepEqual(at('/minds-explored/shop/'), ['shop', '/minds-explored/shop/'], 'the bookshop belongs to Shop, not Learn'); checks++;
assert.deepEqual(at('/minds-explored/topics/'), ['learn', '/minds-explored/']); checks++;
for (const p of ['/support/', '/privacy/', '/terms/', '/404.html'])
  assert.deepEqual(at(p), [null, null], `${p} sits outside the groups`), checks++;
assert.deepEqual(at('/index.html'), at('/')); checks++;

/* --------------------------------------------------------------- header */
const count = (html, needle) => html.split(needle).length - 1;
const atlas = NAV.header('/atlas/');
ok(atlas.includes('<nav class="site-groups" aria-label="Main">'), 'labelled main navigation');
ok(atlas.includes('<a href="/research/" aria-current="true">Research</a>'), 'containing group marked');
ok(atlas.includes('aria-label="Research sections"'), 'second row names its group');
eq(count(atlas.match(/<nav class="site-sections"[\s\S]*?<\/nav>/)[0], 'aria-current="page"'), 1, 'one current section');
ok(atlas.includes('<details class="site-menu"><summary>Menu</summary>'), 'phone menu present without scripting');
ok(!NAV.header('/privacy/').includes('site-sections'), 'no second row outside the groups');
ok(NAV.header('/support/').includes('class="support-nav" href="/support/" aria-current="page"'), 'Donate marks its own page');
ok(atlas.includes('<a class="shop-nav" href="/shop/">Shop</a>'), 'Shop is a top-level link on every page');
ok(atlas.includes('<a class="shop-nav shop-nav-phone" href="/shop/">Shop</a>'), 'Shop stays in the phone bar, outside the Menu');
ok(NAV.header('/shop/').includes('aria-label="Shop sections"') && NAV.header('/shop/').includes('href="/minds-explored/shop/"'), 'the shop page links the bookshop');
for (const g of NAV.GROUPS) ok(atlas.includes(`href="${g.href}"`), `header links ${g.href}`);
for (const s of sections) ok(atlas.includes(`href="${s.href}"`), `menu links ${s.href}`);
ok(!/<script|\son[a-z]+=/i.test(atlas), 'no inline script or handler (CSP)');

/* ---------------------------------------------------------- breadcrumbs */
eq(NAV.breadcrumbs('/atlas/', 'Evidence Atlas · Evidence Press'), '', 'no trail on a section landing page');
eq(NAV.breadcrumbs('/research/', 'Research · Evidence Press'), '', 'no trail on a hub');
eq(NAV.breadcrumbs('/privacy/', 'Privacy policy · Evidence Press'), '', 'no trail outside the groups');
const trail = NAV.breadcrumbs('/releases/x/', 'A <b>result</b> · Evidence Press');
ok(trail.includes('<a href="/research/">Research</a>') && trail.includes('<a href="/">Releases</a>'), 'trail links group and section');
ok(trail.includes('<li aria-current="page">A &lt;b&gt;result&lt;/b&gt;</li>'), 'trail escapes and trims the title');
const chapter = NAV.breadcrumbs('/why-minds-break/chapter-1/', 'Chapter 1. Kinds That Hold · Why Minds Break · Evidence Press');
ok(chapter.includes('<li aria-current="page">Chapter 1. Kinds That Hold</li>'), 'trail drops a repeated section suffix');

/* ------------------------------------------------------- footer and bar */
const map = NAV.footerMap();
for (const s of sections) ok(map.includes(`href="${s.href}"`), `footer map links ${s.href}`);
const bar = NAV.bar('/interpsych/', { origin: 'https://evidencepress.org' });
ok(bar.includes('<a href="https://evidencepress.org/learn/" aria-current="true">Learn</a>'), 'bar marks its group with absolute links');

/* ------------------------------------------------------------ built site */
if (BUILT) {
  ok(fs.existsSync(path.join(DIST, 'index.html')), 'dist/ has been built');
  const fileFor = href => path.join(DIST, href.replace(/^\//, ''), 'index.html');
  for (const href of [...NAV.GROUPS.map(g => g.href), ...sections.map(s => s.href), NAV.SUPPORT.href])
    ok(fs.existsSync(fileFor(href)), `navigation target ${href} is built`);

  const pages = [];
  (function walk(dir) {
    for (const name of fs.readdirSync(dir)) {
      const file = path.join(dir, name);
      const rel = path.relative(DIST, file);
      if (fs.statSync(file).isDirectory()) { if (!/^(assets|minds-explored)$/.test(rel)) walk(file); }
      else if (name.endsWith('.html')) pages.push(rel);
    }
  })(DIST);
  let headed = 0;
  for (const rel of pages) {
    const html = fs.readFileSync(path.join(DIST, rel), 'utf8');
    if (!html.includes('<header class="site-head">')) continue;
    headed++;
    ok(html.includes('<nav class="site-groups" aria-label="Main">'), `${rel} carries the shared header`);
    ok(html.includes('<nav class="foot-map" aria-label="Site map">') || rel.startsWith('why-minds-break/films/'), `${rel} carries the footer site map`);
  }
  ok(headed > 250, `shared header on every generated page (${headed})`);

  for (const g of NAV.GROUPS.filter(x => x.hub)) {
    const hub = fs.readFileSync(fileFor(g.href), 'utf8');
    for (const s of g.sections) ok(hub.includes(`class="programme-card hub-card" href="${s.href}"`), `${g.href} lists ${s.href}`);
  }

  const sitemap = fs.readFileSync(path.join(DIST, 'sitemap.xml'), 'utf8');
  for (const href of [...NAV.GROUPS.map(g => g.href), ...sections.map(s => s.href)])
    ok(sitemap.includes(`<loc>https://evidencepress.org${href}</loc>`), `sitemap lists ${href}`);

  const interpsych = fs.readFileSync(fileFor('/interpsych/'), 'utf8');
  ok(!/noindex/.test(interpsych), 'InterPsych is indexable');
  ok(interpsych.includes(NAV.bar('/interpsych/')), 'InterPsych carries the Evidence Press bar');

  // The atlas is built by its own application; its bar must be byte-identical
  // to bar() here, page by page (Learn everywhere, Shop on its bookshop).
  for (const href of ['/minds-explored/', '/minds-explored/topics/', '/minds-explored/shop/']) {
    const html = fs.readFileSync(fileFor(href), 'utf8');
    ok(html.includes(NAV.bar(href, { origin: 'https://evidencepress.org' })), `Minds Explored ${href} bar mirrors tools/site-nav.js`);
  }
}

console.log(`site navigation: ${checks} checks passed${BUILT ? ' (including dist/)' : ''}`);
