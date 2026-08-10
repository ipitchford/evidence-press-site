#!/usr/bin/env node
/* Evidence Press — publication safety and live-readback gate.
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
 *   node tools/check-published.js --live --post-deploy
 *                                            require and record candidate URLs
 *                                            only after exact live readback
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
const POST_DEPLOY = args.has('--post-deploy');
if (POST_DEPLOY && !LIVE) {
  console.error('--post-deploy requires --live');
  process.exit(1);
}
const INSTITUTIONAL_ARTIFACTS = [
  '/api/papers.json',
  '/api/schema.json',
  '/api/operating-model.json',
  '/api/method-registry.json',
  '/api/ibe-ledger.json',
  '/api/work-ledger.json',
  '/api/schemas/operating-model.schema.json',
  '/api/schemas/method-registry.schema.json',
  '/api/schemas/ibe-ledger.schema.json',
  '/api/schemas/release-operating-model.schema.json',
  '/api/schemas/work-ledger.schema.json',
  '/api/v1/operating-model.json',
  '/api/v1/papers.json',
  '/api/v1/schema.json',
  '/api/v1/method-registry.json',
  '/api/v1/ibe-ledger.json',
  '/api/v1/work-ledger.json',
  '/api/v1/schemas/operating-model.schema.json',
  '/api/v1/schemas/method-registry.schema.json',
  '/api/v1/schemas/ibe-ledger.schema.json',
  '/api/v1/schemas/release-operating-model.schema.json',
  '/api/v1/schemas/work-ledger.schema.json'
];
const INSTITUTIONAL_PAGES = ['/operating-model/'];

const red = s => `\x1b[31m${s}\x1b[0m`;
const green = s => `\x1b[32m${s}\x1b[0m`;
const amber = s => `\x1b[33m${s}\x1b[0m`;

function cacheBusted(url) {
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}publication_check=${Date.now()}`;
}

async function confirmCandidateBytes(urlPath, candidateRel, expectedContentType) {
  const candidateFile = path.join(DIST, candidateRel);
  if (!fs.existsSync(candidateFile)) return { ok: false, reason: `candidate omitted dist/${candidateRel}` };
  try {
    const response = await fetch(cacheBusted(`${BASE}${urlPath}`), {
      redirect: 'manual',
      headers: { 'cache-control': 'no-cache', pragma: 'no-cache' }
    });
    if (response.status !== 200) return { ok: false, reason: `returned ${response.status}` };
    if (expectedContentType && !String(response.headers.get('content-type') || '').toLowerCase().includes(expectedContentType.toLowerCase())) {
      return { ok: false, reason: `content-type is not ${expectedContentType}` };
    }
    const live = Buffer.from(await response.arrayBuffer());
    const candidate = fs.readFileSync(candidateFile);
    if (!live.equals(candidate)) return { ok: false, reason: `live bytes differ from dist/${candidateRel}` };
    return { ok: true };
  } catch (error) {
    return { ok: false, reason: error.message };
  }
}

async function confirmLiveJson(urlPath) {
  try {
    const response = await fetch(cacheBusted(`${BASE}${urlPath}`), {
      redirect: 'manual',
      headers: { 'cache-control': 'no-cache', pragma: 'no-cache' }
    });
    if (response.status !== 200) return { ok: false, reason: `returned ${response.status}` };
    if (!String(response.headers.get('content-type') || '').toLowerCase().includes('json')) {
      return { ok: false, reason: 'content-type is not JSON' };
    }
    await response.json();
    return { ok: true };
  } catch (error) {
    return { ok: false, reason: error.message };
  }
}

/* ------------------------------------------------------------------ ledger */
function readLedger() {
  if (!fs.existsSync(LEDGER)) return { note: '', releases: [], pages: [], artifacts: [] };
  const ledger = JSON.parse(fs.readFileSync(LEDGER, 'utf8'));
  if (!Array.isArray(ledger.artifacts)) ledger.artifacts = [];
  return ledger;
}
function writeLedger(l) {
  l.releases.sort((a, b) => a.slug < b.slug ? -1 : 1);
  l.pages.sort((a, b) => a.path < b.path ? -1 : 1);
  l.artifacts.sort((a, b) => a.path < b.path ? -1 : 1);
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
  const artifacts = INSTITUTIONAL_ARTIFACTS.filter(urlPath =>
    fs.existsSync(path.join(DIST, urlPath.replace(/^\//, ''))));
  return { releases, pages, artifacts };
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
    const r = await fetch(cacheBusted(`${BASE}/releases/${slug}/paper.json`), {
      redirect: 'manual',
      headers: { 'cache-control': 'no-cache', pragma: 'no-cache' }
    });
    if (!r.ok) return false;
    const j = await r.json();
    return j && j.slug === slug;
  } catch { return false; }
}

/* A generic 200 is not enough: an old Pages fallback could serve unrelated
   HTML at this URL. Confirm both the canonical human page and its distinctive
   machine record before adding the URL to the permanent publication ledger. */
async function confirmInstitutionalPage(pagePath, requireCandidateEquality = false) {
  const pageUrl = `${BASE}${pagePath}`;
  if (requireCandidateEquality) {
    const rel = pagePath.replace(/^\//, '');
    const html = await confirmCandidateBytes(pagePath, `${rel}index.html`, 'text/html');
    if (!html.ok) return { ok: false, reason: `HTML ${html.reason}` };
    const record = await confirmCandidateBytes(`${pagePath}index.json`, `${rel}index.json`, 'json');
    if (!record.ok) return { ok: false, reason: `index.json ${record.reason}` };
    return { ok: true };
  }
  try {
    const response = await fetch(cacheBusted(pageUrl), {
      redirect: 'manual',
      headers: { 'cache-control': 'no-cache', pragma: 'no-cache' }
    });
    if (response.status !== 200) return { ok: false, reason: `HTML returned ${response.status}` };
    if (!String(response.headers.get('content-type') || '').toLowerCase().includes('text/html')) {
      return { ok: false, reason: 'HTML route did not return text/html' };
    }
    const html = await response.text();
    if (!html.includes(`<link rel="canonical" href="${pageUrl}">`) ||
        !html.includes('<h1>Evidence Press operating model</h1>')) {
      return { ok: false, reason: 'HTML lacks the canonical operating-model identity markers' };
    }

    const recordResponse = await fetch(cacheBusted(`${pageUrl}index.json`), {
      redirect: 'manual',
      headers: { 'cache-control': 'no-cache', pragma: 'no-cache' }
    });
    if (recordResponse.status !== 200) return { ok: false, reason: `index.json returned ${recordResponse.status}` };
    if (!String(recordResponse.headers.get('content-type') || '').toLowerCase().includes('json')) {
      return { ok: false, reason: 'index.json did not return JSON' };
    }
    const record = await recordResponse.json();
    if (record.status !== 'prospective-institutional-contract' ||
        !/^[0-9a-f]{40}$/.test(String(record.releasePolicy && record.releasePolicy.baselineCommit || ''))) {
      return { ok: false, reason: 'index.json is not the Evidence Press operating-model contract' };
    }
    return { ok: true };
  } catch (error) {
    return { ok: false, reason: error.message };
  }
}

/* ------------------------------------------------------------------- main */
(async () => {
  const ledger = readLedger();
  const dist = distContents();
  const today = new Date().toISOString().slice(0, 10);
  const liveFailures = [];

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
      /* Candidate releases are ledgered in post-deploy mode only after exact
         paper.json equality below. A merely slug-shaped stale response is not
         evidence that this candidate was published. */
      const deferCandidate = POST_DEPLOY && dist.releases.includes(slug);
      if (!deferCandidate && !ledger.releases.some(r => r.slug === slug)) {
        ledger.releases.push({ slug, firstSeen: today, source: 'confirmed live' });
        console.log(green(`  + added to ledger: ${slug}`));
      }
    }
    if (POST_DEPLOY) {
      let exactReleases = 0;
      for (const slug of dist.releases) {
        const result = await confirmCandidateBytes(
          `/releases/${slug}/paper.json`, `releases/${slug}/paper.json`, 'json'
        );
        if (!result.ok) {
          liveFailures.push(`post-deploy release does not equal candidate: ${BASE}/releases/${slug}/paper.json (${result.reason})`);
          continue;
        }
        exactReleases++;
        if (!ledger.releases.some(release => release.slug === slug)) {
          ledger.releases.push({ slug, firstSeen: today, source: 'confirmed live candidate' });
          console.log(green(`  + added exact live candidate to ledger: ${slug}`));
        }
      }
      console.log(`  exact candidate readback — ${exactReleases}/${dist.releases.length} release records matched`);
    }
    for (const pagePath of INSTITUTIONAL_PAGES) {
      const result = await confirmInstitutionalPage(pagePath, POST_DEPLOY);
      if (result.ok) {
        if (!ledger.pages.some(page => page.path === pagePath)) {
          ledger.pages.push({ path: pagePath, firstSeen: today, source: POST_DEPLOY ? 'confirmed live candidate' : 'confirmed live' });
          console.log(green(`  + added institutional page to ledger: ${pagePath}`));
        }
      } else {
        console.log(amber(`  institutional page not confirmed: ${pagePath} (${result.reason})`));
        if (POST_DEPLOY) {
          liveFailures.push(`post-deploy page not confirmed live: ${BASE}${pagePath} (${result.reason})`);
        }
      }
    }
    let confirmedArtifacts = 0;
    for (const artifactPath of INSTITUTIONAL_ARTIFACTS) {
      const result = POST_DEPLOY
        ? await confirmCandidateBytes(artifactPath, artifactPath.replace(/^\//, ''), 'json')
        : await confirmLiveJson(artifactPath);
      if (result.ok) {
        confirmedArtifacts++;
        if (!ledger.artifacts.some(artifact => artifact.path === artifactPath)) {
          ledger.artifacts.push({ path: artifactPath, firstSeen: today, source: POST_DEPLOY ? 'confirmed live candidate' : 'confirmed live' });
          console.log(green(`  + added institutional artifact to ledger: ${artifactPath}`));
        }
      } else if (POST_DEPLOY) {
        liveFailures.push(`post-deploy artifact does not equal candidate: ${BASE}${artifactPath} (${result.reason})`);
      }
    }
    console.log(`  probed ${INSTITUTIONAL_ARTIFACTS.length} institutional artifact URLs — ${confirmedArtifacts} confirmed live`);
    writeLedger(ledger);
  }

  const missingReleases = ledger.releases.map(r => r.slug).filter(s => !dist.releases.includes(s));
  const missingPages = ledger.pages.map(p => p.path).filter(p => !dist.pages.includes(p));
  const missingArtifacts = ledger.artifacts.map(a => a.path).filter(p => !dist.artifacts.includes(p));
  const newReleases = dist.releases.filter(s => !ledger.releases.some(r => r.slug === s));
  const newPages = dist.pages.filter(p => !ledger.pages.some(l => l.path === p));
  const newArtifacts = dist.artifacts.filter(p => !ledger.artifacts.some(l => l.path === p));

  console.log(`\ndist/ contains ${dist.releases.length} releases, ${dist.pages.length} standalone pages and ${dist.artifacts.length} institutional artifacts.`);
  console.log(`Ledger records ${ledger.releases.length} releases, ${ledger.pages.length} standalone pages and ${ledger.artifacts.length} institutional artifacts.`);
  if (newReleases.length) console.log(green(`New in this build: ${newReleases.join(', ')}`));
  if (newPages.length) console.log(green(`New pages in this build: ${newPages.join(', ')}`));
  if (newArtifacts.length) console.log(green(`New institutional artifacts in this build: ${newArtifacts.join(', ')}`));

  if (liveFailures.length || missingReleases.length || missingPages.length || missingArtifacts.length) {
    console.error(red('\nREFUSING: publication preservation or live candidate readback failed.'));
    for (const failure of liveFailures) console.error(red(`  ${failure}`));
    for (const s of missingReleases) console.error(red(`  missing release: ${BASE}/releases/${s}/`));
    for (const p of missingPages) console.error(red(`  missing page:    ${BASE}${p}`));
    for (const p of missingArtifacts) console.error(red(`  missing artifact: ${BASE}${p}`));
    if (liveFailures.length) {
      console.error('\nThe canonical site may still be serving stale or mixed deployment objects.');
      console.error('Wait for exact convergence and rerun the guarded readback; never weaken the ledger to match stale output.');
    }
    if (missingReleases.length || missingPages.length || missingArtifacts.length) {
      console.error('\nThe build was probably made from a branch that does not contain published material.');
      console.error('Merge the missing work in and rebuild before deploying. Do not deploy this dist/.');
    }
    process.exit(1);
  }

  if (RECORD) {
    for (const s of newReleases) ledger.releases.push({ slug: s, firstSeen: today, source: 'deployed from this repository' });
    for (const p of newPages) ledger.pages.push({ path: p, firstSeen: today, source: 'deployed from this repository' });
    for (const p of newArtifacts) ledger.artifacts.push({ path: p, firstSeen: today, source: 'deployed from this repository' });
    writeLedger(ledger);
    console.log(green('\nLedger updated with everything in this build.'));
  }

  console.log(green('\nOK — every published URL is present in dist/. Safe to deploy.'));
})().catch(e => { console.error(red(e.stack || e.message)); process.exit(1); });
