#!/usr/bin/env node
/* Candidate-vs-live publication integrity gate. */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const CONFIG = JSON.parse(fs.readFileSync(path.join(ROOT, 'site.config.json'), 'utf8'));
const BASE = CONFIG.baseUrl.replace(/\/$/, '');
const red = s => `\x1b[31m${s}\x1b[0m`;
const green = s => `\x1b[32m${s}\x1b[0m`;
const fail = [];
const read = f => JSON.parse(fs.readFileSync(f, 'utf8'));
const candidatePaper = slug => read(path.join(DIST, 'releases', slug, 'paper.json'));
const candidateHtml = slug => fs.readFileSync(path.join(DIST, 'releases', slug, 'index.html'), 'utf8');
const urls = xs => (xs || []).map(x => String(x.url || x.contentUrl || '')).filter(Boolean);
const assetPath = url => { try { return path.join(DIST, new URL(url, BASE).pathname.replace(/^\//, '')); } catch { return null; } };
async function fetchJson(url) {
  const r = await fetch(`${url}${url.includes('?') ? '&' : '?'}publication_check=${Date.now()}`, { headers: { 'cache-control': 'no-cache', pragma: 'no-cache' } });
  if (!r.ok) throw new Error(`${r.status} ${r.statusText} for ${url}`);
  return r.json();
}
async function fetchText(url) {
  const r = await fetch(`${url}${url.includes('?') ? '&' : '?'}publication_check=${Date.now()}`, { headers: { 'cache-control': 'no-cache', pragma: 'no-cache' } });
  if (!r.ok) throw new Error(`${r.status} ${r.statusText} for ${url}`);
  return r.text();
}
function preserve(label, liveItems, candidateItems) {
  const c = urls(candidateItems);
  for (const url of urls(liveItems)) if (!c.includes(url)) fail.push(`${label}: dropped published media ${url}`);
}
function markers(label, liveHtml, candidateHtml) {
  for (const marker of ['briefings', 'media-section', 'video-embed', 'release-grid', 'standalone-factbox', 'standalone-audio', 'page-resources']) {
    if (liveHtml.includes(marker) && !candidateHtml.includes(marker)) fail.push(`${label}: dropped live layout marker ${marker}`);
  }
}
function requireAssets(label, items) {
  for (const item of items || []) {
    const url = item.url || item.contentUrl;
    if (url && url.startsWith('/') && (!assetPath(url) || !fs.existsSync(assetPath(url)))) fail.push(`${label}: missing candidate asset ${url}`);
  }
}
(async () => {
  if (!process.argv.includes('--live')) throw new Error('Pass --live; offline URL checks cannot establish publication integrity.');
  if (!fs.existsSync(path.join(DIST, 'api', 'papers.json'))) throw new Error('Run `node build.js` first.');
  const liveApi = await fetchJson(`${BASE}/api/papers.json`);
  const livePapers = Array.isArray(liveApi) ? liveApi : (liveApi.papers || []);
  const cApi = read(path.join(DIST, 'api', 'papers.json'));
  const cPapers = Array.isArray(cApi) ? cApi : (cApi.papers || []);
  const bySlug = new Map(cPapers.map(p => [p.slug, p]));
  console.log(`Checking ${livePapers.length} live releases against candidate dist/…`);
  for (const live of livePapers) {
    const c = bySlug.get(live.slug);
    if (!c) { fail.push(`release ${live.slug}: missing candidate record`); continue; }
    preserve(`release ${live.slug}`, live.media, c.media);
    if (live.audioUrl && live.audioUrl !== c.audioUrl) fail.push(`release ${live.slug}: changed or dropped published audio ${live.audioUrl}`);
    requireAssets(`release ${live.slug}`, c.media);
    requireAssets(`release ${live.slug}`, c.audioUrl ? [{ url: c.audioUrl }] : []);
    const html = candidateHtml(live.slug);
    const liveHtml = await fetchText(`${BASE}/releases/${live.slug}/`);
    markers(`release ${live.slug}`, liveHtml, html);
    for (const item of live.media || []) if (item.url && !html.includes(item.url)) fail.push(`release ${live.slug}: HTML dropped ${item.url}`);
  }
  const liveObs = await fetchJson(`${BASE}/observatory/index.json`);
  const cObs = read(path.join(DIST, 'observatory', 'index.json'));
  if (liveObs.video && !cObs.video) fail.push(`observatory: dropped published video ${liveObs.video.url}`);
  if (liveObs.video && cObs.video && liveObs.video.url !== cObs.video.url) fail.push(`observatory: changed published video ${liveObs.video.url}`);
  if (liveObs.audio && liveObs.audio.url !== cObs.audio.url) fail.push(`observatory: changed or dropped published audio ${liveObs.audio.url}`);
  requireAssets('observatory', [{ url: cObs.audio && cObs.audio.url }]);
  const liveObsHtml = await fetchText(`${BASE}/observatory/`);
  const cObsHtml = fs.readFileSync(path.join(DIST, 'observatory', 'index.html'), 'utf8');
  markers('observatory', liveObsHtml, cObsHtml);
  if (liveObs.video && liveObs.video.url && !cObsHtml.includes(liveObs.video.url)) fail.push(`observatory: HTML dropped ${liveObs.video.url}`);
  if (fail.length) {
    console.error(red(`\nREFUSING: ${fail.length} publication-integrity check${fail.length === 1 ? '' : 's'} failed.`));
    fail.forEach(x => console.error(red(`  ${x}`)));
    console.error('\nReconcile the source worktree before deploying.');
    process.exit(1);
  }
  console.log(green('Publication-integrity check passed: candidate preserves live media, audio, records, and layout markers.'));
})().catch(e => { console.error(red(e.stack || e.message)); process.exit(1); });
