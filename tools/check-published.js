#!/usr/bin/env node
/* Evidence Press — pre-deploy safety gate.
 *
 * Nothing that has been published should ever vanish because a build was made
 * from a branch that did not contain it. This script keeps a ledger of every
 * URL the site has published (PUBLISHED.json) and refuses a deploy whose dist/
 * would drop any of them.
 *
 *   node tools/check-published.js            verify dist/ covers the ledger
 *   node tools/check-published.js --live     also reconcile the ledger against
 *                                            the deployed site before checking
 *   node tools/check-published.js --record   after a successful deploy, add
 *                                            anything new in dist/ to the ledger
 *
 * Exit code 0 = safe to deploy. Exit code 1 = something would be lost.
 * Requires only Node >= 18 (uses the built-in fetch). No packages.
 */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const LEDGER = path.join(ROOT, 'PUBLISHED.json');
const CONFIG = JSON.parse(fs.readFileSync(path.join(ROOT, 'site.config.json'), 'utf8'));
const BASE = CONFIG.baseUrl.replace(/\/$/, '');

const args = new Set(process.argv.slice(2));
const LIVE = args.has('--live');
const RECORD = args.has('--record');

const red = s => `\x1b[31m${s}\x1b[0m`;
const green = s => `\x1b[32m${s}\x1b[0m`;
const amber = s => `\x1b[33m${s}\x1b[0m`;

/* ------------------------------------------------------------------ ledger */
function readLedger() {
  if (!fs.existsSync(LEDGER)) return { note: '', releases: [], pages: [] };
  return JSON.parse(fs.readFileSync(LEDGER, 'utf8'));
}
function writeLedger(l) {
  l.releases.sort((a, b) => a.slug < b.slug ? -1 : 1);
  l.pages.sort((a, b) => a.path < b.path ? -1 : 1);
  fs.writeFileSync(LEDGER, JSON.stringify(l, null, 2) + '\n');
}

/* -------------------------------------------------------------- what is in dist */
function distContents() {
  if (!fs.existsSync(DIST)) {
    console.error(red('dist/ does not exist. Run `node build.js` first.'));
    process.exit(1);
  }
  const releases = fs.existsSync(path.join(DIST, 'releases'))
    ? fs.readdirSync(path.join(DIST, 'releases'))
      .filter(d => fs.existsSync(path.join(DIST, 'releases', d, 'index.html')))
    : [];
  const pages = [];
  const walkPages = rel => {
    for (const e of fs.readdirSync(path.join(DIST, rel), { withFileTypes: true })) {
      if (!e.isDirectory()) continue;
      if (rel === '' && (e.name === 'releases' || e.name === 'assets' || e.name === 'api')) continue;
      const child = rel ? `${rel}/${e.name}` : e.name;
      if (fs.existsSync(path.join(DIST, child, 'index.html'))) pages.push(`/${child}/`);
      walkPages(child);
    }
  };
  walkPages('');
  return { releases, pages };
}

/* --------------------------------------------------- what the live site has */
async function liveSlugs() {
  const found = new Set();
  const tried = [];
  /* The JSON Feed and the sitemap are the two surfaces that enumerate releases.
     Read both: an index can go stale, and disagreement is itself worth seeing. */
  try {
    const r = await fetch(`${BASE}/feed.json`, { headers: { 'cache-control': 'no-cache' } });
    if (r.ok) {
      const j = await r.json();
      for (const it of j.items || []) {
        const m = String(it.url || it.id || '').match(/\/releases\/([^/]+)\//);
        if (m) found.add(m[1]);
      }
      tried.push(`feed.json: ${j.items ? j.items.length : 0} items`);
    }
  } catch (e) { tried.push(`feed.json: unreachable (${e.message})`); }
  try {
    const r = await fetch(`${BASE}/sitemap.xml`, { headers: { 'cache-control': 'no-cache' } });
    if (r.ok) {
      const x = await r.text();
      let n = 0;
      for (const m of x.matchAll(/\/releases\/([^/<]+)\//g)) { found.add(m[1]); n++; }
      tried.push(`sitemap.xml: ${n} release URLs`);
    }
  } catch (e) { tried.push(`sitemap.xml: unreachable (${e.message})`); }
  return { found: [...found], tried };
}

/* Confirm a slug really resolves on the live site rather than hitting the
   404 fallback — a release page always ships a paper.json beside it. */
async function isLive(slug) {
  try {
    const r = await fetch(`${BASE}/releases/${slug}/paper.json`, { headers: { 'cache-control': 'no-cache' } });
    if (!r.ok) return false;
    const j = await r.json();
    return j && j.slug === slug;
  } catch { return false; }
}

/* ------------------------------------------------------------------- main */
(async () => {
  const ledger = readLedger();
  const dist = distContents();
  const today = new Date().toISOString().slice(0, 10);

  if (LIVE) {
    console.log('Reconciling the ledger against the deployed site…');
    const { found, tried } = await liveSlugs();
    tried.forEach(t => console.log('  ' + t));
    /* Index surfaces can under-report. Probe every slug we know of from any
       source, so a release that is live but missing from the index is caught. */
    const candidates = new Set([...found, ...dist.releases, ...ledger.releases.map(r => r.slug)]);
    const confirmed = [];
    for (const slug of candidates) if (await isLive(slug)) confirmed.push(slug);
    console.log(`  probed ${candidates.size} candidate slugs — ${confirmed.length} confirmed live`);
    const unindexed = confirmed.filter(s => !found.includes(s));
    if (unindexed.length) {
      console.log(amber(`  note: live but absent from the site's own index: ${unindexed.join(', ')}`));
    }
    for (const slug of confirmed) {
      if (!ledger.releases.some(r => r.slug === slug)) {
        ledger.releases.push({ slug, firstSeen: today, source: 'confirmed live' });
        console.log(green(`  + added to ledger: ${slug}`));
      }
    }
    writeLedger(ledger);
  }

  const missingReleases = ledger.releases.map(r => r.slug).filter(s => !dist.releases.includes(s));
  const missingPages = ledger.pages.map(p => p.path).filter(p => !dist.pages.includes(p));
  const newReleases = dist.releases.filter(s => !ledger.releases.some(r => r.slug === s));
  const newPages = dist.pages.filter(p => !ledger.pages.some(l => l.path === p));

  console.log(`\ndist/ contains ${dist.releases.length} releases and ${dist.pages.length} standalone pages.`);
  console.log(`Ledger records ${ledger.releases.length} releases and ${ledger.pages.length} standalone pages.`);
  if (newReleases.length) console.log(green(`New in this build: ${newReleases.join(', ')}`));
  if (newPages.length) console.log(green(`New pages in this build: ${newPages.join(', ')}`));

  if (missingReleases.length || missingPages.length) {
    console.error(red('\nREFUSING: this build would remove material that has been published.'));
    for (const s of missingReleases) console.error(red(`  missing release: ${BASE}/releases/${s}/`));
    for (const p of missingPages) console.error(red(`  missing page:    ${BASE}${p}`));
    console.error('\nThe build was probably made from a branch that does not contain them.');
    console.error('Merge the missing work in and rebuild before deploying. Do not deploy this dist/.');
    process.exit(1);
  }

  if (RECORD) {
    for (const s of newReleases) ledger.releases.push({ slug: s, firstSeen: today, source: 'deployed from this repository' });
    for (const p of newPages) ledger.pages.push({ path: p, firstSeen: today, source: 'deployed from this repository' });
    writeLedger(ledger);
    console.log(green('\nLedger updated with everything in this build.'));
  }

  console.log(green('\nOK — every published URL is present in dist/. Safe to deploy.'));
})().catch(e => { console.error(red(e.stack || e.message)); process.exit(1); });
