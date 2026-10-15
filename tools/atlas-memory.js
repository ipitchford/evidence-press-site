'use strict';

// Retrieval evidence, never a proof checker or assurance ranking. No network or models.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const CEILING = 'Local lexical retrieval and explicit user-supplied condition comparison only; not theorem certification, priority clearance, independent review or evidence of research acceleration.';
const ID = /^[a-z0-9][a-z0-9:_-]*$/;
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const plain = x => x !== null && typeof x === 'object' && !Array.isArray(x);
const nonempty = x => typeof x === 'string' && x.trim().length > 0;
const validId = x => typeof x === 'string' && ID.test(x);
const validKey = x => typeof x === 'string' && /^[a-zA-Z][a-zA-Z0-9:_-]*$/.test(x);
const validSlug = x => typeof x === 'string' && SLUG.test(x);
const safeRelative = x => nonempty(x) && !path.isAbsolute(x) && !x.includes('\\') && !x.split('/').some(p => !p || p === '.' || p === '..');
const sha = x => crypto.createHash('sha256').update(x).digest('hex');
function canonical(x) {
  if (Array.isArray(x)) return '[' + x.map(canonical).join(',') + ']';
  if (plain(x)) return '{' + Object.keys(x).sort().map(k => JSON.stringify(k) + ':' + canonical(x[k])).join(',') + '}';
  return JSON.stringify(x);
}
const fingerprint = x => sha(canonical(x));
const order = (a, b) => a < b ? -1 : a > b ? 1 : 0;
function keys(x, allowed) { return plain(x) && Object.keys(x).every(k => allowed.includes(k)) && allowed.every(k => Object.hasOwn(x, k)); }

function localFile(root, relative) {
  if (!safeRelative(relative)) throw Error('unsafe source path');
  const base = fs.realpathSync(root);
  let file = base;
  for (const part of relative.split('/')) {
    file = path.join(file, part);
    if (fs.lstatSync(file).isSymbolicLink()) throw Error('symlink source refused');
  }
  if (!fs.statSync(file).isFile() || !fs.realpathSync(file).startsWith(base + path.sep)) throw Error('source must be a confined regular file');
  return fs.readFileSync(file);
}
function allowedSource(card) {
  return plain(card.source) && safeRelative(card.source.path) && (card.source.path === `papers/${card.releaseSlug}/body.md` ||
    /^data\/atlas-research\/.+/.test(card.source.path) || card.source.path === 'docs/ATLAS_RESEARCH_WORKBENCH.md');
}
function validateMemory(memory, root) {
  const errors = [];
  if (!keys(memory, ['schemaVersion', 'claimCeiling', 'cards']) || memory.schemaVersion !== '1.0' || !nonempty(memory.claimCeiling) || !Array.isArray(memory.cards)) return ['Invalid memory envelope'];
  const ids = new Set();
  for (const [i, c] of memory.cards.entries()) {
    const at = `cards[${i}]`;
    if (!keys(c, ['id', 'kind', 'title', 'summary', 'releaseSlug', 'source', 'conditions', 'actions', 'limitations', 'provenance', 'relatedCards'])) { errors.push(`${at}: invalid fields`); continue; }
    if (!validId(c.id) || ids.has(c.id)) errors.push(`${at}: invalid or duplicate id`);
    ids.add(c.id);
    if (!['lemma', 'transformation', 'obstruction', 'research-move'].includes(c.kind)) errors.push(`${at}: invalid kind`);
    if (!nonempty(c.title) || !nonempty(c.summary) || !validSlug(c.releaseSlug)) errors.push(`${at}: invalid title, summary or releaseSlug`);
    if (!keys(c.source, ['path', 'locator']) || !nonempty(c.source.path) || !nonempty(c.source.locator)) errors.push(`${at}: invalid source`);
    else {
      try {
        if (!allowedSource(c)) throw Error('source outside allowed locations');
        const source = localFile(root, c.source.path).toString('utf8');
        localFile(root, `papers/${c.releaseSlug}/meta.json`);
        if (!source.includes(c.source.locator)) throw Error('source locator absent');
      } catch (e) { errors.push(`${at}: ${e.message}`); }
    }
    const conditionKeys = new Set();
    if (!Array.isArray(c.conditions)) errors.push(`${at}: conditions must be an array`);
    else for (const v of c.conditions) {
      if (!keys(v, ['key', 'value']) || !validKey(v.key) || typeof v.value !== 'boolean' || conditionKeys.has(v.key)) errors.push(`${at}: malformed or duplicate condition`);
      if (plain(v)) conditionKeys.add(v.key);
    }
    if (!Array.isArray(c.actions) || !c.actions.length || c.actions.some(v => !keys(v, ['label', 'check', 'stopWhen']) || ![v.label, v.check, v.stopWhen].every(nonempty))) errors.push(`${at}: actionable checks and stop rules required`);
    if (!Array.isArray(c.limitations) || !c.limitations.length || !c.limitations.every(nonempty)) errors.push(`${at}: limitations required`);
    if (!keys(c.provenance, ['basis', 'reviewedAt']) || c.provenance.basis !== 'retrospective-source-extraction' || !/^\d{4}-\d\d-\d\dT.*(?:Z|[+-]\d\d:\d\d)$/.test(c.provenance.reviewedAt) || !Number.isFinite(Date.parse(c.provenance.reviewedAt))) errors.push(`${at}: dated retrospective provenance required`);
    if (!Array.isArray(c.relatedCards) || !c.relatedCards.every(validId) || new Set(c.relatedCards).size !== c.relatedCards.length) errors.push(`${at}: invalid relatedCards`);
  }
  for (const c of memory.cards) if (Array.isArray(c?.relatedCards)) for (const id of c.relatedCards) if (!ids.has(id) || id === c.id) errors.push(`card ${c.id}: unresolved or self relatedCard ${id}`);
  return errors;
}
const STOP = new Set('a an and are as at be by can does for from how i in is it of on or that the this to what when which with'.split(' '));
function terms(text) { return [...new Set((String(text).toLowerCase().match(/[\p{L}\p{N}]+/gu) || []).filter(t => t.length > 1 && !STOP.has(t)))].sort(order); }

function buildIndex(root) {
  const memory = JSON.parse(localFile(root, 'data/ATLAS_MEMORY.json'));
  const errors = validateMemory(memory, root);
  if (errors.length) throw Error(errors.join('\n'));
  const releases = fs.readdirSync(path.join(root, 'papers')).sort(order).filter(slug => fs.existsSync(path.join(root, 'papers', slug, 'meta.json'))).map(slug => {
    if (!SLUG.test(slug)) throw Error('Invalid release directory');
    const metaBytes = localFile(root, `papers/${slug}/meta.json`), bodyBytes = localFile(root, `papers/${slug}/body.md`);
    const m = JSON.parse(metaBytes), body = bodyBytes.toString('utf8');
    const r = {slug, version: m.version || null, title: m.title || slug, summary: m.oneLine || m.abstract || '', status: m.status || null,
      doi: m.doi || null, sourceRefs: [`papers/${slug}/meta.json`, `papers/${slug}/body.md`], metaSha256: sha(metaBytes), bodySha256: sha(bodyBytes),
      terms: terms([m.title, m.oneLine, m.abstract, ...(m.keywords || []), body].join(' '))};
    return {...r, fingerprint: fingerprint(r)};
  });
  const bySlug = new Map(releases.map(r => [r.slug, r]));
  const cards = memory.cards.map(c => {
    const result = {...c, source: {...c.source, sha256: sha(localFile(root, c.source.path))}, releaseVersion: bySlug.get(c.releaseSlug).version};
    return {...result, fingerprint: fingerprint(result)};
  }).sort((a, b) => order(a.id, b.id));
  const index = {schemaVersion: '1.0', kind: 'atlas-memory-index', claimCeiling: CEILING, sourceClaimCeiling: memory.claimCeiling, memorySha256: fingerprint(memory), releases, cards};
  return {...index, indexSha256: fingerprint(index)};
}

function validateIndex(index, root) {
  const errors = [];
  if (!plain(index) || index.schemaVersion !== '1.0' || index.kind !== 'atlas-memory-index' || !Array.isArray(index.cards) || !Array.isArray(index.releases)) return ['Invalid index envelope'];
  const {indexSha256, ...payload} = index;
  if (fingerprint(payload) !== indexSha256) errors.push('Index digest mismatch');
  if (root) try {
    const memory = JSON.parse(localFile(root, 'data/ATLAS_MEMORY.json'));
    errors.push(...validateMemory(memory, root).map(error => `Current memory invalid: ${error}`));
    if (fingerprint(memory) !== index.memorySha256) errors.push('Stale memory: data/ATLAS_MEMORY.json fingerprint changed');
  } catch (e) { errors.push(`Current memory unreadable: ${e.message}`); }
  const ids = new Set(), slugs = new Set();
  for (const r of index.releases) {
    if (!plain(r)) { errors.push('Malformed release entry'); continue; }
    const {fingerprint: expected, ...entry} = r;
    if (!validSlug(r.slug) || slugs.has(r.slug) || fingerprint(entry) !== expected || !Array.isArray(r.terms) || !r.terms.every(nonempty)) errors.push('Invalid release fingerprint or identity');
    slugs.add(r.slug);
    if (root) try {
      if (sha(localFile(root, `papers/${r.slug}/meta.json`)) !== r.metaSha256 || sha(localFile(root, `papers/${r.slug}/body.md`)) !== r.bodySha256) errors.push(`Stale release source: ${r.slug}`);
    } catch (e) { errors.push(e.message); }
  }
  for (const c of index.cards) {
    if (!plain(c)) { errors.push('Malformed indexed card'); continue; }
    const {fingerprint: expected, ...entry} = c;
    if (!validId(c.id) || ids.has(c.id) || !slugs.has(c.releaseSlug) || fingerprint(entry) !== expected || !Array.isArray(c.conditions) || c.conditions.some(v => !keys(v, ['key', 'value']) || typeof v.value !== 'boolean' || !validKey(v.key)) || !plain(c.source) || !/^[0-9a-f]{64}$/.test(c.source.sha256) || !allowedSource(c) || !Array.isArray(c.relatedCards) || !c.relatedCards.every(validId) || !Array.isArray(c.actions) || !c.actions.length || c.actions.some(v => !keys(v, ['label', 'check', 'stopWhen']) || ![v.label, v.check, v.stopWhen].every(nonempty))) errors.push('Invalid indexed card or fingerprint');
    ids.add(c.id);
    if (root) try { if (sha(localFile(root, c.source.path)) !== c.source.sha256) errors.push(`Stale card source: ${c.id}`); } catch (e) { errors.push(e.message); }
  }
  for (const c of index.cards) if (Array.isArray(c?.relatedCards)) for (const id of c.relatedCards) if (!ids.has(id) || id === c.id) errors.push('Unresolved indexed relatedCard');
  return errors;
}
function requireIndex(index) { const e = validateIndex(index); if (e.length) throw Error(e.join('\n')); }
function makePacket(index, request) {
  requireIndex(index);
  if (!plain(request) || Object.keys(request).some(k => !['question', 'conditions', 'limit'].includes(k)) || !nonempty(request.question) || request.question.length > 10000 || !plain(request.conditions) || Object.entries(request.conditions).some(([k, v]) => !validKey(k) || typeof v !== 'boolean')) throw Error('Invalid request: question and boolean conditions required');
  const limit = request.limit === undefined ? 8 : request.limit;
  if (!Number.isInteger(limit) || limit < 1 || limit > 50) throw Error('limit must be an integer from 1 to 50');
  const query = terms(request.question);
  if (!query.length) throw Error('Query has no searchable terms');
  const hits = text => { const available = new Set(terms(text)); return query.filter(t => available.has(t)); };
  const matches = index.cards.map(card => {
    const matchedTerms = hits([card.title, card.summary, ...card.conditions.map(c => c.key), ...card.actions.map(a => `${a.label} ${a.check}`)].join(' '));
    const conditions = {matching: [], unmet: [], unknown: []};
    for (const c of card.conditions) {
      const state = !Object.hasOwn(request.conditions, c.key) ? 'unknown' : request.conditions[c.key] === c.value ? 'matching' : 'unmet';
      conditions[state].push({...c, observed: state === 'unknown' ? null : request.conditions[c.key]});
    }
    return {card, lexicalEvidence: {matchedTerms}, conditions, applicability: conditions.unmet.length ? 'conditions-unmet' : conditions.unknown.length ? 'conditions-unknown' : 'conditions-match'};
  }).filter(x => x.lexicalEvidence.matchedTerms.length).sort((a, b) => b.lexicalEvidence.matchedTerms.length - a.lexicalEvidence.matchedTerms.length || order(a.card.id, b.card.id));
  const releases = index.releases.map(r => ({slug: r.slug, title: r.title, summary: r.summary, version: r.version, fingerprint: r.fingerprint, sourceRefs: r.sourceRefs, metaSha256: r.metaSha256, bodySha256: r.bodySha256, matchedTerms: query.filter(t => r.terms.includes(t))})).filter(r => r.matchedTerms.length).sort((a, b) => b.matchedTerms.length - a.matchedTerms.length || order(a.slug, b.slug));
  const packet = {schemaVersion: '1.0', kind: 'atlas-agent-packet', claimCeiling: CEILING, indexSha256: index.indexSha256,
    request: {question: request.question, conditions: request.conditions, limit}, sourceFreshness: 'Snapshot hashes bound; current filesystem and external literature not checked by this pure query.',
    matches: matches.slice(0, limit), releases: releases.slice(0, limit), totalMatchingCards: matches.length, totalMatchingReleases: releases.length,
    conditionBoundary: 'These conditions are necessary scope cues supplied by the user, not sufficient theorem hypotheses or certified applicability. Unmet and unknown cards are retained as warnings, never approved recommendations.',
    priorArtTodo: ['Before substantive derivation, inspect the cited full primary sources and current external literature for equivalence and stronger results; this local tool performs no external search.']};
  return {...packet, packetSha256: fingerprint(packet)};
}
function compareIndexes(oldIndex, newIndex) {
  requireIndex(oldIndex); requireIndex(newIndex);
  function changes(a, b, key) {
    const old = new Map(a.map(x => [x[key], x])), next = new Map(b.map(x => [x[key], x]));
    return {added: [...next.keys()].filter(k => !old.has(k)).sort(order), removed: [...old.keys()].filter(k => !next.has(k)).sort(order), changed: [...next.keys()].filter(k => old.has(k) && next.get(k).fingerprint !== old.get(k).fingerprint).sort(order)};
  }
  const releases = changes(oldIndex.releases, newIndex.releases, 'slug'), cards = changes(oldIndex.cards, newIndex.cards, 'id');
  const impactedReleases = [...new Set(Object.values(releases).flat())].sort(order), changedCards = new Set(Object.values(cards).flat());
  const all = [...oldIndex.cards, ...newIndex.cards];
  const impactedCards = [...new Set([...changedCards, ...all.filter(c => impactedReleases.includes(c.releaseSlug) || c.relatedCards.some(id => changedCards.has(id))).map(c => c.id)])].sort(order);
  return {schemaVersion: '1.0', kind: 'atlas-index-delta', oldIndexSha256: oldIndex.indexSha256, newIndexSha256: newIndex.indexSha256, releases, cards, impactedReleases, impactedCards,
    indexMetadataChanged: oldIndex.memorySha256 !== newIndex.memorySha256 || oldIndex.sourceClaimCeiling !== newIndex.sourceClaimCeiling,
    invalidationBoundary: 'Only listed fingerprints and direct related-card dependencies need reconsideration. No theorem inference or blanket cache invalidation.'};
}
module.exports = {validateMemory, buildIndex, makePacket, compareIndexes, validateIndex};
