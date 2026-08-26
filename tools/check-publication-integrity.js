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
const crypto = require('crypto');
const { isDeepStrictEqual } = require('util');

const ROOT = path.join(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const CONFIG = JSON.parse(fs.readFileSync(path.join(ROOT, 'site.config.json'), 'utf8'));
const BASE = CONFIG.baseUrl.replace(/\/$/, '');
const red = s => `\x1b[31m${s}\x1b[0m`;
const green = s => `\x1b[32m${s}\x1b[0m`;
const failures = [];
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const readOptional = file => fs.existsSync(file) ? read(file) : null;
const candidateHtml = slug => fs.readFileSync(path.join(DIST, 'releases', slug, 'index.html'), 'utf8');
const mediaUrls = items => (items || []).map(item => String(item.url || item.contentUrl || '')).filter(Boolean);

/* The unversioned governance URLs are stable aliases of /api/v1/. Keep this
   table in one place so a new institutional record cannot be added to one
   surface and silently omitted from the other. Work-ledger files are optional
   until the builder emits them; once either candidate or live surface exists,
   the same parity and preservation checks apply. */
const GOVERNANCE_ROUTES = [
  /* The live core aliases historically used different self-links. Candidate
     parity is mandatory now; exact post-deploy readback establishes the new
     common bytes without making the first migration undeployable. */
  ['papers index', '/api/papers.json', '/api/v1/papers.json', true, false],
  ['papers schema', '/api/schema.json', '/api/v1/schema.json', true, false],
  ['operating model', '/api/operating-model.json', '/api/v1/operating-model.json', true],
  ['method registry', '/api/method-registry.json', '/api/v1/method-registry.json', true],
  ['IBE ledger', '/api/ibe-ledger.json', '/api/v1/ibe-ledger.json', true],
  ['work ledger', '/api/work-ledger.json', '/api/v1/work-ledger.json', true],
  ['Atlas roadmap', '/api/atlas-roadmap.json', '/api/v1/atlas-roadmap.json', true],
  ['Atlas proposals', '/api/atlas-proposals.json', '/api/v1/atlas-proposals.json', true],
  ['page-structure policy', '/api/page-structure-policy.json', '/api/v1/page-structure-policy.json', true],
  ['presentation-event ledger', '/api/presentation-events.json', '/api/v1/presentation-events.json', true],
  ['audio-provenance status', '/api/audio-provenance-status.json', '/api/v1/audio-provenance-status.json', true],
  ['operating-model schema', '/api/schemas/operating-model.schema.json', '/api/v1/schemas/operating-model.schema.json', true],
  ['method-registry schema', '/api/schemas/method-registry.schema.json', '/api/v1/schemas/method-registry.schema.json', true],
  ['IBE-ledger schema', '/api/schemas/ibe-ledger.schema.json', '/api/v1/schemas/ibe-ledger.schema.json', true],
  ['release operating-model schema', '/api/schemas/release-operating-model.schema.json', '/api/v1/schemas/release-operating-model.schema.json', true],
  ['work-ledger schema', '/api/schemas/work-ledger.schema.json', '/api/v1/schemas/work-ledger.schema.json', true],
  ['Atlas-roadmap schema', '/api/schemas/atlas-roadmap.schema.json', '/api/v1/schemas/atlas-roadmap.schema.json', true],
  ['Atlas-proposal schema', '/api/schemas/atlas-proposal.schema.json', '/api/v1/schemas/atlas-proposal.schema.json', true],
  ['Atlas-proposal-register schema', '/api/schemas/atlas-proposal-register.schema.json', '/api/v1/schemas/atlas-proposal-register.schema.json', true]
];

const candidateJson = urlPath => readOptional(path.join(DIST, urlPath.replace(/^\//, '')));

function candidateAsset(url) {
  try {
    return path.join(DIST, new URL(url, BASE).pathname.replace(/^\//, ''));
  } catch {
    return null;
  }
}

/* Source-backed receipts must also be testable before dist/ exists. Resolve a
   same-site URL to its committed source file without permitting a pathname to
   escape the repository root. The later build and live gates still verify the
   generated and deployed copies independently. */
function sourceAsset(url) {
  try {
    const relative = decodeURIComponent(new URL(url, BASE).pathname).replace(/^\/+/, '');
    const file = path.resolve(ROOT, relative);
    return file.startsWith(`${ROOT}${path.sep}`) ? file : null;
  } catch {
    return null;
  }
}

/* A corrected static asset may retain its stable path while acquiring a
   content-derived cache key. Permit only that narrow successor relation: same
   origin and path, one hexadecimal v parameter, and a token that exactly
   matches the candidate file. */
function isContentVersionedAssetSuccessor(liveUrl, candidateUrl, candidateFile = null) {
  try {
    const live = new URL(liveUrl, BASE);
    const candidate = new URL(candidateUrl, BASE);
    const siteOrigin = new URL(BASE).origin;
    if (live.origin !== siteOrigin || candidate.origin !== siteOrigin ||
        live.pathname !== candidate.pathname || live.search || live.hash || candidate.hash) return false;
    const params = [...candidate.searchParams.entries()];
    if (params.length !== 1 || params[0][0] !== 'v' || !/^[a-f0-9]{10}$/.test(params[0][1])) return false;
    const file = candidateFile || candidateAsset(candidateUrl);
    if (!file || !fs.existsSync(file)) return false;
    const expected = crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex').slice(0, 10);
    return params[0][1] === expected;
  } catch {
    return false;
  }
}

/* A second replacement at an already content-versioned URL needs more than a
   fresh query token. Require an append-only presentation event whose receipt
   binds the new MP3 and transcript bytes. */
function isRecordedAudioSuccessor(liveUrl, candidateUrl, slug, liveEvents, candidateEvents) {
  try {
    const live = new URL(liveUrl, BASE);
    const candidate = new URL(candidateUrl, BASE);
    if (live.origin !== new URL(BASE).origin || candidate.origin !== live.origin ||
        live.pathname !== candidate.pathname || live.href === candidate.href) return false;
    const params = [...candidate.searchParams.entries()];
    if (params.length !== 1 || params[0][0] !== 'v' || !/^[a-f0-9]{10}$/.test(params[0][1])) return false;
    const audioFile = sourceAsset(candidateUrl);
    if (!audioFile || !fs.existsSync(audioFile)) return false;
    const audioHash = crypto.createHash('sha256').update(fs.readFileSync(audioFile)).digest('hex');
    if (params[0][1] !== audioHash.slice(0, 10)) return false;
    const oldIds = new Set((liveEvents && liveEvents.events || []).map(event => event.eventId));
    return (candidateEvents && candidateEvents.events || []).some(event => {
      const artifact = event.artifact || {};
      const transcriptFile = artifact.transcriptPath && path.join(ROOT, artifact.transcriptPath);
      return !oldIds.has(event.eventId) && event.slug === slug && event.eventType === 'audio' &&
        event.researchClaimChanged === false && event.researchArchiveChanged === false &&
        artifact.audioPath === candidate.pathname.replace(/^\//, '') && artifact.audioSha256 === audioHash &&
        transcriptFile && fs.existsSync(transcriptFile) &&
        artifact.transcriptSha256 === crypto.createHash('sha256').update(fs.readFileSync(transcriptFile)).digest('hex');
    });
  } catch {
    return false;
  }
}

/* A published video may leave the active release only through an append-only
   presentation event that names both the retired URL and its current
   replacement. The replacement must be present as an active candidate video;
   research claims and archives must remain explicitly unchanged. */
function isRecordedVideoReplacement(liveUrl, candidateItems, slug, liveEvents, candidateEvents) {
  const candidateVideos = new Set((candidateItems || [])
    .filter(item => item.type === 'video')
    .map(item => String(item.url || ''))
    .filter(Boolean));
  const oldIds = new Set((liveEvents && liveEvents.events || []).map(event => event.eventId));
  return (candidateEvents && candidateEvents.events || []).some(event => {
    const artifact = event.artifact || {};
    return !oldIds.has(event.eventId) && event.slug === slug && event.eventType === 'video' &&
      event.researchClaimChanged === false && event.researchArchiveChanged === false &&
      artifact.provider === 'youtube' && artifact.replacesUrl === liveUrl &&
      artifact.url !== liveUrl && candidateVideos.has(artifact.url);
  });
}

async function fetchFresh(url, asJson) {
  const separator = url.includes('?') ? '&' : '?';
  const response = await fetch(`${url}${separator}publication_check=${Date.now()}`, {
    headers: { 'cache-control': 'no-cache', pragma: 'no-cache' }
  });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText} for ${url}`);
  return asJson ? response.json() : response.text();
}

async function fetchOptionalJson(url) {
  const separator = url.includes('?') ? '&' : '?';
  const response = await fetch(`${url}${separator}publication_check=${Date.now()}`, {
    headers: { 'cache-control': 'no-cache', pragma: 'no-cache' }
  });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`${response.status} ${response.statusText} for ${url}`);
  return response.json();
}

function preserveIds(label, liveItems, candidateItems) {
  const next = new Map((candidateItems || []).map(item => [item.id, item]));
  for (const item of liveItems || []) {
    if (!next.has(item.id)) failures.push(`${label}: dropped published id ${item.id}`);
  }
  return next;
}

function preserveExactItems(label, liveItems, candidateItems) {
  const next = preserveIds(label, liveItems, candidateItems);
  for (const item of liveItems || []) {
    const candidate = next.get(item.id);
    if (candidate && !isDeepStrictEqual(item, candidate)) {
      failures.push(`${label} ${item.id}: changed a published identified record in place`);
    }
  }
  return next;
}

function preserveChangeLogPrefix(label, liveLog, candidateLog) {
  if (!Array.isArray(candidateLog)) {
    failures.push(`${label}: candidate has no changeLog`);
    return [];
  }
  for (let index = 0; index < (liveLog || []).length; index++) {
    if (!isDeepStrictEqual(liveLog[index], candidateLog[index])) {
      failures.push(`${label}: changed or removed published changeLog entry ${index + 1}`);
    }
  }
  return candidateLog.slice((liveLog || []).length);
}

function preserveArrayPrefix(label, liveItems, candidateItems, noun = 'entry') {
  if (!Array.isArray(candidateItems)) {
    failures.push(`${label}: candidate has no array`);
    return [];
  }
  for (let index = 0; index < (liveItems || []).length; index++) {
    if (!isDeepStrictEqual(liveItems[index], candidateItems[index])) {
      failures.push(`${label}: changed or removed published ${noun} ${index + 1}`);
    }
  }
  return candidateItems.slice((liveItems || []).length);
}

/* Public v1 schemas may grow additively, but a previously published keyword,
   enum member, required field or definition may not disappear or change. */
function preserveSchemaNode(label, liveNode, candidateNode, trail = '$') {
  if (Array.isArray(liveNode)) {
    if (!Array.isArray(candidateNode)) {
      failures.push(`${label} ${trail}: changed an array-valued schema keyword`);
      return;
    }
    for (const oldValue of liveNode) {
      if (!candidateNode.some(value => isDeepStrictEqual(value, oldValue))) {
        failures.push(`${label} ${trail}: dropped published schema value ${JSON.stringify(oldValue)}`);
      }
    }
    return;
  }
  if (liveNode && typeof liveNode === 'object') {
    if (!candidateNode || typeof candidateNode !== 'object' || Array.isArray(candidateNode)) {
      failures.push(`${label} ${trail}: changed a published schema object`);
      return;
    }
    for (const [key, value] of Object.entries(liveNode)) {
      if (!(key in candidateNode)) failures.push(`${label} ${trail}: dropped published schema keyword ${key}`);
      else preserveSchemaNode(label, value, candidateNode[key], `${trail}.${key}`);
    }
    return;
  }
  if (!isDeepStrictEqual(liveNode, candidateNode)) failures.push(`${label} ${trail}: changed ${JSON.stringify(liveNode)} to ${JSON.stringify(candidateNode)}`);
}

function preserveStrings(label, liveItems, candidateItems) {
  for (const item of liveItems || []) {
    if (!(candidateItems || []).includes(item)) failures.push(`${label}: dropped published value ${JSON.stringify(item)}`);
  }
}

/* A lineage is a growing dependency programme, unlike a frozen cluster.
   Its identity and evidential boundary stay immutable, while genuinely new
   releases may be appended to its published member sequence. */
function preserveLineages(liveItems, candidateItems) {
  const next = preserveIds('method registry lineage', liveItems, candidateItems);
  for (const lineage of liveItems || []) {
    const candidate = next.get(lineage.id);
    if (!candidate) continue;
    for (const field of ['id', 'name', 'rootReleaseSlug', 'basis', 'sharedBoundary']) {
      if (!isDeepStrictEqual(lineage[field], candidate[field])) {
        failures.push(`method registry lineage ${lineage.id}: changed immutable field ${field}`);
      }
    }
    preserveArrayPrefix(`method registry lineage ${lineage.id} members`, lineage.members, candidate.members, 'member');
  }
  return next;
}

function preserveWorkLedger(liveWork, candidateWork) {
  if (!candidateWork || typeof candidateWork !== 'object') {
    failures.push('work ledger: candidate record is missing');
    return;
  }
  const newChanges = preserveChangeLogPrefix('work ledger', liveWork.changeLog, candidateWork.changeLog);
  const immutableFields = [
    'schemaVersion', 'effectiveDate', 'baselineCommit', 'policy', 'status',
    'claimCeiling', 'requiredAtIntake', 'updatePolicy'
  ];
  for (const field of immutableFields) {
    if (!isDeepStrictEqual(liveWork[field], candidateWork[field])) {
      failures.push(`work ledger: changed published top-level field ${field}`);
    }
  }
  const extensibleVocabularies = ['workStatuses', 'measurementStatuses', 'cohorts', 'resultClasses'];
  for (const field of extensibleVocabularies) {
    preserveArrayPrefix(`work ledger ${field}`, liveWork[field], candidateWork[field], 'value');
  }
  const semanticFields = [...immutableFields, ...extensibleVocabularies];
  if (semanticFields.some(field => !isDeepStrictEqual(liveWork[field], candidateWork[field])) && !newChanges.length) {
    failures.push('work ledger: top-level semantic state changed without an appended changeLog entry');
  }

  const candidateAttempts = new Map((candidateWork.attempts || []).map(attempt => [attempt.attemptId, attempt]));
  for (const oldAttempt of liveWork.attempts || []) {
    const next = candidateAttempts.get(oldAttempt.attemptId);
    if (!next) {
      failures.push(`work ledger: dropped published attempt ${oldAttempt.attemptId}`);
      continue;
    }
    const stableFields = ['attemptId', 'workId', 'cohort', 'registeredAt', 'aims', 'question', 'selectionBasis',
      'taskClass', 'decisionObjectTarget', 'comparisonPlan'];
    for (const field of stableFields) if (!isDeepStrictEqual(oldAttempt[field], next[field])) {
      failures.push(`work ledger ${oldAttempt.attemptId}: changed immutable intake field ${field}`);
    }
    preserveArrayPrefix(`work ledger ${oldAttempt.attemptId} status history`, oldAttempt.statusHistory, next.statusHistory, 'event');
    const addedCorrections = preserveArrayPrefix(
      `work ledger ${oldAttempt.attemptId} corrections`, oldAttempt.corrections, next.corrections, 'correction'
    );
    const addedRevisions = preserveChangeLogPrefix(`work ledger ${oldAttempt.attemptId} revisions`, oldAttempt.revisions, next.revisions);
    if (!isDeepStrictEqual(oldAttempt, next) && !addedRevisions.length) failures.push(`work ledger ${oldAttempt.attemptId}: changed without an appended attempt revision`);

    const oldMeasurement = oldAttempt.measurement || {};
    const nextMeasurement = next.measurement || {};
    preserveArrayPrefix(`work ledger ${oldAttempt.attemptId} measurement milestones`, oldMeasurement.milestones, nextMeasurement.milestones, 'milestone');
    for (const field of ['activeHumanMinutes', 'computeMinutes', 'computeCost', 'agentRuns', 'reworkMinutes']) {
      const oldValue = oldMeasurement[field];
      const nextValue = nextMeasurement[field];
      if (oldValue !== null && !isDeepStrictEqual(oldValue, nextValue)) failures.push(`work ledger ${oldAttempt.attemptId}: rewrote recorded measurement ${field}`);
    }
    if (oldMeasurement.correctionCount !== null) {
      const expectedCorrectionCount = oldMeasurement.correctionCount + addedCorrections.length;
      if (nextMeasurement.correctionCount !== expectedCorrectionCount) {
        failures.push(`work ledger ${oldAttempt.attemptId}: correctionCount must increase only with appended correction receipts`);
      }
    }
    if (oldAttempt.releaseSlug !== null && oldAttempt.releaseSlug !== next.releaseSlug) failures.push(`work ledger ${oldAttempt.attemptId}: changed its published release link`);

    const oldAssurance = oldAttempt.assuranceEndpoint || {};
    const nextAssurance = next.assuranceEndpoint || {};
    const nextDimensions = new Map((nextAssurance.dimensions || []).map(dimension => [dimension.dimension, dimension]));
    for (const dimension of oldAssurance.dimensions || []) {
      if (!isDeepStrictEqual(dimension, nextDimensions.get(dimension.dimension))) failures.push(`work ledger ${oldAttempt.attemptId}: rewrote assurance dimension ${dimension.dimension}`);
    }
    preserveArrayPrefix(`work ledger ${oldAttempt.attemptId} assurance evidence`, oldAssurance.evidenceRefs, nextAssurance.evidenceRefs, 'reference');
    for (const field of ['assessedAt', 'claimCeiling']) {
      if (oldAssurance[field] !== null && !isDeepStrictEqual(oldAssurance[field], nextAssurance[field])) {
        failures.push(`work ledger ${oldAttempt.attemptId}: rewrote recorded assurance ${field}`);
      }
    }
    if (oldAssurance.status !== 'not-recorded' && oldAssurance.status !== nextAssurance.status) {
      failures.push(`work ledger ${oldAttempt.attemptId}: rewrote recorded assurance status`);
    }
    if (oldAssurance.status !== 'not-recorded' && !isDeepStrictEqual(oldAssurance.missingnessReason, nextAssurance.missingnessReason)) {
      failures.push(`work ledger ${oldAttempt.attemptId}: rewrote recorded assurance missingnessReason`);
    }
  }
}

function preserveMedia(label, slug, liveItems, candidateItems, liveEvents, candidateEvents) {
  const candidate = mediaUrls(candidateItems);
  for (const item of liveItems || []) {
    const url = String(item.url || item.contentUrl || '');
    if (!url || candidate.includes(url)) continue;
    if (item.type === 'video' &&
        isRecordedVideoReplacement(url, candidateItems, slug, liveEvents, candidateEvents)) continue;
    failures.push(`${label}: dropped published media ${url}`);
  }
}

/* Corrective successors may retire a bad active surface, but only when two
   append-only public histories independently bind the transition. The release
   must retain its correction prefix and add a scope-specific receipt for a new
   version/DOI. The work ledger must retain its correction/revision prefixes,
   append both records, and cite the new DOI, GitHub release and canonical page.
   This is deliberately stricter than accepting a free-text correction alone. */
function isCorrectionSuccessor(live, candidate, liveWork, candidateWork, requiredScope) {
  if (!live || !candidate || live.slug !== candidate.slug ||
      !live.version || !candidate.version || live.version === candidate.version ||
      !live.doiUrl || !candidate.doiUrl || live.doiUrl === candidate.doiUrl) return false;

  const liveCorrections = Array.isArray(live.corrections) ? live.corrections : [];
  const candidateCorrections = Array.isArray(candidate.corrections) ? candidate.corrections : [];
  if (candidateCorrections.length <= liveCorrections.length ||
      !liveCorrections.every((item, index) => isDeepStrictEqual(item, candidateCorrections[index]))) return false;
  const addedReleaseCorrections = candidateCorrections.slice(liveCorrections.length);
  if (!addedReleaseCorrections.some(item =>
    item && item.scope === requiredScope && item.fixedIn === candidate.version)) return false;

  const liveAttempt = (liveWork && liveWork.attempts || []).find(item => item.releaseSlug === live.slug);
  const candidateAttempt = (candidateWork && candidateWork.attempts || []).find(item => item.releaseSlug === candidate.slug);
  if (!liveAttempt || !candidateAttempt || liveAttempt.attemptId !== candidateAttempt.attemptId) return false;
  const liveAttemptCorrections = Array.isArray(liveAttempt.corrections) ? liveAttempt.corrections : [];
  const candidateAttemptCorrections = Array.isArray(candidateAttempt.corrections) ? candidateAttempt.corrections : [];
  const liveRevisions = Array.isArray(liveAttempt.revisions) ? liveAttempt.revisions : [];
  const candidateRevisions = Array.isArray(candidateAttempt.revisions) ? candidateAttempt.revisions : [];
  if (candidateAttemptCorrections.length <= liveAttemptCorrections.length ||
      !liveAttemptCorrections.every((item, index) => isDeepStrictEqual(item, candidateAttemptCorrections[index])) ||
      candidateRevisions.length <= liveRevisions.length ||
      !liveRevisions.every((item, index) => isDeepStrictEqual(item, candidateRevisions[index]))) return false;

  const requiredEvidence = [candidate.doiUrl, candidate.releaseUrl, candidate.url];
  return candidateAttemptCorrections.slice(liveAttemptCorrections.length).some(item => {
    const refs = new Set(item && Array.isArray(item.evidenceRefs) ? item.evidenceRefs : []);
    return requiredEvidence.every(reference => reference && refs.has(reference));
  });
}

function preserveLayout(label, liveHtml, nextHtml, allowedDrops = new Set()) {
  const markers = [
    'briefings', 'media-section', 'video-embed', 'release-grid',
    'standalone-factbox', 'standalone-audio', 'page-resources'
  ];
  for (const marker of markers) {
    if (liveHtml.includes(marker) && !nextHtml.includes(marker) && !allowedDrops.has(marker)) {
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

function preserveReleaseOperatingModels(livePapers, candidatePapers, legacySlugs, authorisedCorrections = new Set()) {
  const bySlug = new Map((candidatePapers || []).map(paper => [paper.slug, paper]));
  for (const live of livePapers || []) {
    const candidate = bySlug.get(live.slug);
    if (!candidate) continue;
    if (live.operatingModel) {
      if (!candidate.operatingModel) {
        failures.push(`release ${live.slug}: dropped its published prospective operatingModel record`);
      } else if (!isDeepStrictEqual(live.operatingModel, candidate.operatingModel) &&
                 !authorisedCorrections.has(live.slug)) {
        failures.push(`release ${live.slug}: changed its published prospective operatingModel record; publish a linked successor instead`);
      }
    } else if (legacySlugs.has(live.slug) && candidate.operatingModel) {
      failures.push(`release ${live.slug}: invented retrospective operatingModel metadata for a frozen legacy release`);
    }
  }
}

function resetFailures() { failures.length = 0; }
function listedFailures() { return [...failures]; }

async function main() {
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

  /* These contracts are additive public memory. Before their first deployment
     the live endpoints legitimately return 404; after they exist, IDs and
     load-bearing statements may not silently disappear or change in place. */
  const liveGovernance = new Map();
  for (const [label, unversionedPath, versionedPath, candidateRequired, requireLegacyLiveParity = true] of GOVERNANCE_ROUTES) {
    const candidateUnversioned = candidateJson(unversionedPath);
    const candidateVersioned = candidateJson(versionedPath);
    if (candidateRequired && !candidateUnversioned) failures.push(`${label}: candidate omitted ${unversionedPath}`);
    if (!!candidateUnversioned !== !!candidateVersioned) {
      failures.push(`${label}: candidate must publish unversioned and v1 aliases together`);
    } else if (candidateUnversioned && !isDeepStrictEqual(candidateUnversioned, candidateVersioned)) {
      failures.push(`${label}: candidate v1 alias differs from the unversioned artifact`);
    }

    const [liveUnversioned, liveVersioned] = await Promise.all([
      fetchOptionalJson(`${BASE}${unversionedPath}`),
      fetchOptionalJson(`${BASE}${versionedPath}`)
    ]);
    liveGovernance.set(unversionedPath, liveUnversioned);
    if (requireLegacyLiveParity && !!liveUnversioned !== !!liveVersioned) {
      failures.push(`${label}: live unversioned and v1 aliases do not have matching presence`);
    } else if (requireLegacyLiveParity && liveUnversioned && !isDeepStrictEqual(liveUnversioned, liveVersioned)) {
      failures.push(`${label}: live v1 alias differs from the live unversioned artifact`);
    }
    if (liveUnversioned && !candidateUnversioned) failures.push(`${label}: candidate dropped the published unversioned artifact`);
    if (liveVersioned && !candidateVersioned) failures.push(`${label}: candidate dropped the published v1 artifact`);
    if (label.includes('schema') && liveUnversioned && candidateUnversioned) {
      preserveSchemaNode(label, liveUnversioned, candidateUnversioned);
    }
    if (label.includes('schema') && liveVersioned && candidateVersioned) {
      const liveForPreservation = requireLegacyLiveParity ? liveVersioned : { ...liveVersioned, $id: candidateVersioned.$id };
      preserveSchemaNode(`${label} v1`, liveForPreservation, candidateVersioned);
    }
  }

  const candidateContract = candidateJson('/api/operating-model.json');
  const candidateRegistry = candidateJson('/api/method-registry.json');
  const candidateIbe = candidateJson('/api/ibe-ledger.json');
  const candidateWork = candidateJson('/api/work-ledger.json');
  const candidateAtlasRoadmap = candidateJson('/api/atlas-roadmap.json');
  const candidateAtlasProposals = candidateJson('/api/atlas-proposals.json');
  const candidatePresentationEvents = candidateJson('/api/presentation-events.json');
  const liveContract = liveGovernance.get('/api/operating-model.json');
  if (liveContract) {
    if (!isDeepStrictEqual(liveContract, candidateContract)) {
      failures.push('operating model: changed the published v1 institutional contract; publish a new major contract instead');
    }
  }

  const liveAtlasRoadmap = liveGovernance.get('/api/atlas-roadmap.json');
  if (liveAtlasRoadmap) {
    const newReviews = preserveChangeLogPrefix('Atlas roadmap review log', liveAtlasRoadmap.reviewLog, candidateAtlasRoadmap.reviewLog);
    const nextSteps = preserveIds('Atlas roadmap steps', liveAtlasRoadmap.nextSteps, candidateAtlasRoadmap.nextSteps);
    const stepChanged = (liveAtlasRoadmap.nextSteps || []).some(step => {
      const next = nextSteps.get(step.id);
      return next && !isDeepStrictEqual(step, next);
    });
    const policyChanged = !isDeepStrictEqual(liveAtlasRoadmap.reviewPolicy, candidateAtlasRoadmap.reviewPolicy) ||
      liveAtlasRoadmap.claimCeiling !== candidateAtlasRoadmap.claimCeiling;
    if ((stepChanged || policyChanged) && !newReviews.length) {
      failures.push('Atlas roadmap: steps, review policy or claim ceiling changed without an appended review-log entry');
    }
  }

  const liveAtlasProposals = liveGovernance.get('/api/atlas-proposals.json');
  if (liveAtlasProposals) {
    const newPolicyChanges = preserveChangeLogPrefix(
      'Atlas proposal policy change log', liveAtlasProposals.policy.changeLog, candidateAtlasProposals.policy.changeLog
    );
    const stablePolicyFields = [
      'schemaVersion', 'recordType', 'claimCeiling', 'idAlgorithm', 'proposalKinds',
      'reviewStates', 'assessmentStates', 'resourceClasses', 'acceptedGraphBoundary',
      'intakeRoutes', 'updatePolicy'
    ];
    const policyChanged = stablePolicyFields.some(field =>
      !isDeepStrictEqual(liveAtlasProposals.policy[field], candidateAtlasProposals.policy[field]));
    if (policyChanged && !newPolicyChanges.length) {
      failures.push('Atlas proposal policy changed without an appended policy change-log entry');
    }
    const candidateProposals = new Map((candidateAtlasProposals.proposals || []).map(proposal => [proposal.proposalId, proposal]));
    for (const oldProposal of liveAtlasProposals.proposals || []) {
      const next = candidateProposals.get(oldProposal.proposalId);
      if (!next) {
        failures.push(`Atlas proposals: dropped published proposal ${oldProposal.proposalId}`);
        continue;
      }
      const { currentState: oldState, decisionReceipts: oldReceipts, ...oldIdentity } = oldProposal;
      const { currentState: nextState, decisionReceipts: nextReceipts, ...nextIdentity } = next;
      if (!isDeepStrictEqual(oldIdentity, nextIdentity)) {
        failures.push(`Atlas proposal ${oldProposal.proposalId}: changed immutable intake content in place`);
      }
      const addedReceipts = preserveArrayPrefix(
        `Atlas proposal ${oldProposal.proposalId} decision receipts`, oldReceipts, nextReceipts, 'receipt'
      );
      if (oldState !== nextState && !addedReceipts.length) {
        failures.push(`Atlas proposal ${oldProposal.proposalId}: state changed without an appended decision receipt`);
      }
      if (addedReceipts.length && addedReceipts[addedReceipts.length - 1].toState !== nextState) {
        failures.push(`Atlas proposal ${oldProposal.proposalId}: appended receipt chain does not end at currentState`);
      }
    }
  }

  const livePresentationEvents = liveGovernance.get('/api/presentation-events.json');
  if (livePresentationEvents) {
    preserveArrayPrefix(
      'presentation-event ledger', livePresentationEvents.events,
      candidatePresentationEvents.events, 'event'
    );
  }

  const liveRegistry = liveGovernance.get('/api/method-registry.json');
  if (liveRegistry) {
    const newChanges = preserveChangeLogPrefix('method registry', liveRegistry.changeLog, candidateRegistry.changeLog);
    preserveExactItems('method registry method', liveRegistry.methods, candidateRegistry.methods);
    preserveExactItems('method registry cluster', liveRegistry.methodClusters, candidateRegistry.methodClusters);
    preserveLineages(liveRegistry.lineages, candidateRegistry.lineages);
    if (!isDeepStrictEqual(liveRegistry.updatePolicy, candidateRegistry.updatePolicy)) failures.push('method registry: changed the published update policy');
    for (const [slug, methods] of Object.entries(liveRegistry.releaseAssignments || {})) {
      if (!candidateRegistry.releaseAssignments || !candidateRegistry.releaseAssignments[slug]) {
        failures.push(`method registry: dropped published release assignment ${slug}`);
      } else if (!isDeepStrictEqual(methods, candidateRegistry.releaseAssignments[slug])) {
        failures.push(`method registry ${slug}: changed a published release assignment in place`);
      }
    }
    const { updated: liveUpdated, changeLog: liveRegistryLog, ...liveRegistrySemantic } = liveRegistry;
    const { updated: candidateUpdated, changeLog: candidateRegistryLog, ...candidateRegistrySemantic } = candidateRegistry;
    if ((!isDeepStrictEqual(liveRegistrySemantic, candidateRegistrySemantic) || liveUpdated !== candidateUpdated) && !newChanges.length) {
      failures.push('method registry: semantic state changed without an appended changeLog entry');
    }
  }

  const liveIbe = liveGovernance.get('/api/ibe-ledger.json');
  if (liveIbe) {
    const newChanges = preserveChangeLogPrefix('IBE ledger', liveIbe.changeLog, candidateIbe.changeLog);
    preserveExactItems('IBE status definition', liveIbe.statusVocabulary, candidateIbe.statusVocabulary);
    const nextObservations = preserveExactItems('IBE observation', liveIbe.observations, candidateIbe.observations);
    const nextHypotheses = preserveIds('IBE hypotheses', liveIbe.hypotheses, candidateIbe.hypotheses);
    void nextObservations;
    if (!isDeepStrictEqual(liveIbe.updatePolicy, candidateIbe.updatePolicy)) failures.push('IBE ledger: changed the published update policy');
    if ((liveIbe.focalExplanation !== candidateIbe.focalExplanation || liveIbe.claimCeiling !== candidateIbe.claimCeiling) &&
        !newChanges.some(change => change.scope === 'ledger' && ['claim-revised', 'correction'].includes(change.changeType))) {
      failures.push('IBE ledger: changed the focal explanation or ceiling without an appended ledger-level claim revision');
    }
    for (const hypothesis of liveIbe.hypotheses || []) {
      const next = nextHypotheses.get(hypothesis.id);
      if (!next) continue;
      if (!isDeepStrictEqual(hypothesis, next)) {
        const revisions = newChanges.filter(change => change.hypothesisId === hypothesis.id);
        if (!revisions.length) failures.push(`IBE hypothesis ${hypothesis.id}: changed without an appended hypothesis-specific revision`);
        if (hypothesis.epistemicStatus !== next.epistemicStatus && !revisions.some(change =>
          change.changeType === 'status-changed' && change.fromStatus === hypothesis.epistemicStatus && change.toStatus === next.epistemicStatus)) {
          failures.push(`IBE hypothesis ${hypothesis.id}: status changed without an exact from/to status revision`);
        }
        const nextPredictions = new Map((next.predictions || []).map(prediction => [prediction.id, prediction]));
        for (const prediction of hypothesis.predictions || []) {
          const candidatePrediction = nextPredictions.get(prediction.id);
          if (!candidatePrediction) failures.push(`IBE hypothesis ${hypothesis.id}: dropped prediction ${prediction.id}`);
          else if (!isDeepStrictEqual(candidatePrediction, prediction) && !newChanges.some(change =>
            change.predictionId === prediction.id && ['prediction-revised', 'correction'].includes(change.changeType))) {
            failures.push(`IBE hypothesis ${hypothesis.id}: changed prediction ${prediction.id} without a prediction-specific revision`);
          }
        }
      }
    }
  }

  const liveWork = liveGovernance.get('/api/work-ledger.json');
  if (liveWork) {
    preserveWorkLedger(liveWork, candidateWork);
  }

  console.log(`Checking ${livePapers.length} live releases against candidate dist/…`);
  const legacySlugs = new Set((candidateContract && candidateContract.releasePolicy &&
    candidateContract.releasePolicy.legacyReleaseSlugs) || []);
  const claimCorrections = new Set(livePapers.filter(live => {
    const candidate = bySlug.get(live.slug);
    return isCorrectionSuccessor(live, candidate, liveWork, candidateWork, 'claim');
  }).map(paper => paper.slug));
  preserveReleaseOperatingModels(livePapers, candidatePapers, legacySlugs, claimCorrections);
  for (const live of livePapers) {
    const candidate = bySlug.get(live.slug);
    if (!candidate) {
      failures.push(`release ${live.slug}: missing candidate record`);
      continue;
    }
    const presentationCorrection = isCorrectionSuccessor(
      live, candidate, liveWork, candidateWork, 'presentation'
    );
    preserveArrayPrefix(`release ${live.slug} corrections`, live.corrections || [], candidate.corrections || [], 'correction');
    if (!presentationCorrection) preserveMedia(
      `release ${live.slug}`, live.slug, live.media, candidate.media,
      livePresentationEvents, candidatePresentationEvents
    );
    if (live.audioUrl && live.audioUrl !== candidate.audioUrl &&
        !isContentVersionedAssetSuccessor(live.audioUrl, candidate.audioUrl) &&
        !isRecordedAudioSuccessor(live.audioUrl, candidate.audioUrl, live.slug,
          livePresentationEvents, candidatePresentationEvents) &&
        !presentationCorrection) {
      failures.push(`release ${live.slug}: changed or dropped published audio ${live.audioUrl}`);
    }
    requireLocalAssets(`release ${live.slug}`, candidate.media);
    requireLocalAssets(`release ${live.slug}`, candidate.audioUrl ? [{ url: candidate.audioUrl }] : []);

    const nextHtml = candidateHtml(live.slug);
    const liveHtml = await fetchFresh(`${BASE}/releases/${live.slug}/`, false);
    preserveLayout(`release ${live.slug}`, liveHtml, nextHtml,
      presentationCorrection ? new Set(['video-embed']) : new Set());
    for (const item of live.media || []) {
      const recordedVideoReplacement = item.type === 'video' && isRecordedVideoReplacement(
        item.url, candidate.media, live.slug, livePresentationEvents, candidatePresentationEvents
      );
      if (item.url && !nextHtml.includes(item.url) && !presentationCorrection && !recordedVideoReplacement) {
        failures.push(`release ${live.slug}: HTML dropped ${item.url}`);
      }
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
  console.log(green('Publication-integrity check passed: candidate preserves live releases, operating contracts, media, Observatory surfaces, and protocol records.'));
}

if (require.main === module) main().catch(error => {
  console.error(red(error.stack || error.message));
  process.exit(1);
});

module.exports = {
  isCorrectionSuccessor,
  isContentVersionedAssetSuccessor,
  isRecordedAudioSuccessor,
  isRecordedVideoReplacement,
  listedFailures,
  preserveArrayPrefix,
  preserveChangeLogPrefix,
  preserveExactItems,
  preserveLineages,
  preserveReleaseOperatingModels,
  preserveSchemaNode,
  preserveWorkLedger,
  resetFailures
};
