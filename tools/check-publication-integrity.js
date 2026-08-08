#!/usr/bin/env node
/* Candidate-vs-live publication-integrity gate.
 *
 * The URL ledger prevents a release from disappearing. This second gate
 * prevents a newer build from retaining the URL while silently dropping
 * published media, machine records, or page-layout features.
 */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const CONFIG = JSON.parse(fs.readFileSync(path.join(ROOT, 'site.config.json'), 'utf8'));
const BASE = CONFIG.baseUrl.replace(/\/$/, '');
const red = s => `\x1b[31m${s}\x1b[0m`;
const green = s => `\x1b[32m${s}\x1b[0m`;
const failures = [];
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const candidateHtml = slug => fs.readFileSync(path.join(DIST, 'releases', slug, 'index.html'), 'utf8');
const mediaUrls = items => (items || []).map(item => String(item.url || item.contentUrl || '')).filter(Boolean);

function candidateAsset(url) {
  try {
    return path.join(DIST, new URL(url, BASE).pathname.replace(/^\//, ''));
  } catch {
    return null;
  }
}

async function fetchFresh(url, asJson) {
  const separator = url.includes('?') ? '&' : '?';
  const response = await fetch(`${url}${separator}publication_check=${Date.now()}`, {
    headers: { 'cache-control': 'no-cache', pragma: 'no-cache' }
  });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText} for ${url}`);
  return asJson ? response.json() : response.text();
}

function preserveMedia(label, liveItems, candidateItems) {
  const candidate = mediaUrls(candidateItems);
  for (const url of mediaUrls(liveItems)) {
    if (!candidate.includes(url)) failures.push(`${label}: dropped published media ${url}`);
  }
}

function preserveLayout(label, liveHtml, nextHtml) {
  const markers = [
    'briefings', 'media-section', 'video-embed', 'release-grid',
    'standalone-factbox', 'standalone-audio', 'page-resources'
  ];
  for (const marker of markers) {
    if (liveHtml.includes(marker) && !nextHtml.includes(marker)) {
      failures.push(`${label}: dropped live layout marker ${marker}`);
    }
  }
}

function requireLocalAssets(label, items) {
  for (const item of items || []) {
    const url = item.url || item.contentUrl;
    if (!url || !url.startsWith('/')) continue;
    const file = candidateAsset(url);
    if (!file || !fs.existsSync(file)) failures.push(`${label}: missing candidate asset ${url}`);
  }
}

(async () => {
  if (!process.argv.includes('--live')) {
    throw new Error('Pass --live; offline URL checks cannot establish publication integrity.');
  }
  const candidateApiFile = path.join(DIST, 'api', 'papers.json');
  if (!fs.existsSync(candidateApiFile)) throw new Error('Run `node build.js` first.');

  const liveApi = await fetchFresh(`${BASE}/api/papers.json`, true);
  const candidateApi = read(candidateApiFile);
  const livePapers = Array.isArray(liveApi) ? liveApi : (liveApi.papers || []);
  const candidatePapers = Array.isArray(candidateApi) ? candidateApi : (candidateApi.papers || []);
  const bySlug = new Map(candidatePapers.map(paper => [paper.slug, paper]));

  console.log(`Checking ${livePapers.length} live releases against candidate dist/…`);
  for (const live of livePapers) {
    const candidate = bySlug.get(live.slug);
    if (!candidate) {
      failures.push(`release ${live.slug}: missing candidate record`);
      continue;
    }
    preserveMedia(`release ${live.slug}`, live.media, candidate.media);
    if (live.audioUrl && live.audioUrl !== candidate.audioUrl) {
      failures.push(`release ${live.slug}: changed or dropped published audio ${live.audioUrl}`);
    }
    requireLocalAssets(`release ${live.slug}`, candidate.media);
    requireLocalAssets(`release ${live.slug}`, candidate.audioUrl ? [{ url: candidate.audioUrl }] : []);

    const nextHtml = candidateHtml(live.slug);
    const liveHtml = await fetchFresh(`${BASE}/releases/${live.slug}/`, false);
    preserveLayout(`release ${live.slug}`, liveHtml, nextHtml);
    for (const item of live.media || []) {
      if (item.url && !nextHtml.includes(item.url)) failures.push(`release ${live.slug}: HTML dropped ${item.url}`);
    }
  }

  const liveObservatory = await fetchFresh(`${BASE}/observatory/index.json`, true);
  const candidateObservatory = read(path.join(DIST, 'observatory', 'index.json'));
  if (liveObservatory.video && !candidateObservatory.video) {
    failures.push(`observatory: dropped published video ${liveObservatory.video.url}`);
  }
  if (liveObservatory.video && candidateObservatory.video && liveObservatory.video.url !== candidateObservatory.video.url) {
    failures.push(`observatory: changed published video ${liveObservatory.video.url}`);
  }
  if (liveObservatory.audio && liveObservatory.audio.url !== candidateObservatory.audio.url) {
    failures.push(`observatory: changed or dropped published audio ${liveObservatory.audio.url}`);
  }
  requireLocalAssets('observatory', [{ url: candidateObservatory.audio && candidateObservatory.audio.url }]);

  const liveObservatoryHtml = await fetchFresh(`${BASE}/observatory/`, false);
  const candidateObservatoryHtml = fs.readFileSync(path.join(DIST, 'observatory', 'index.html'), 'utf8');
  preserveLayout('observatory', liveObservatoryHtml, candidateObservatoryHtml);
  if (liveObservatory.video && liveObservatory.video.url && !candidateObservatoryHtml.includes(liveObservatory.video.url)) {
    failures.push(`observatory: HTML dropped ${liveObservatory.video.url}`);
  }

  const liveProtocols = await fetchFresh(`${BASE}/protocols/api/protocols.json`, true);
  const candidateProtocolsFile = path.join(DIST, 'protocols', 'api', 'protocols.json');
  if (!fs.existsSync(candidateProtocolsFile)) {
    failures.push('protocols: candidate omitted the published protocol registry');
  } else {
    const candidateProtocols = read(candidateProtocolsFile);
    const liveById = new Map((liveProtocols.protocols || []).map(protocol => [protocol.id, protocol]));
    const candidateById = new Map((candidateProtocols.protocols || []).map(protocol => [protocol.id, protocol]));
    for (const [id, liveProtocol] of liveById) {
      const candidateProtocol = candidateById.get(id);
      if (!candidateProtocol) {
        failures.push(`protocols: dropped published protocol ${id}`);
        continue;
      }
      for (const field of ['url', 'skill_url', 'manifest_url', 'receipt_url']) {
        if (liveProtocol[field] && candidateProtocol[field] !== liveProtocol[field]) {
          failures.push(`protocols ${id}: changed or dropped ${field} ${liveProtocol[field]}`);
        }
      }
      const page = path.join(DIST, 'protocols', 'p', id, 'index.html');
      if (!fs.existsSync(page)) failures.push(`protocols ${id}: candidate page is missing`);
    }
    if ((candidateProtocols.protocols || []).length < (liveProtocols.protocols || []).length) {
      failures.push(`protocols: candidate count ${candidateProtocols.protocols.length} is below live count ${liveProtocols.protocols.length}`);
    }
    for (const rel of ['index.html', 'kernel/index.html', 'status/index.html']) {
      if (!fs.existsSync(path.join(DIST, 'protocols', rel))) failures.push(`protocols: missing candidate page ${rel}`);
    }
  }

  if (failures.length) {
    console.error(red(`\nREFUSING: ${failures.length} publication-integrity check${failures.length === 1 ? '' : 's'} failed.`));
    failures.forEach(failure => console.error(red(`  ${failure}`)));
    console.error('\nReconcile the source worktree before deploying.');
    process.exit(1);
  }
  console.log(green('Publication-integrity check passed: candidate preserves live releases, media, Observatory surfaces, and protocol records.'));
})().catch(error => {
  console.error(red(error.stack || error.message));
  process.exit(1);
});
