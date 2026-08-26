#!/usr/bin/env node
'use strict';

/*
 * Additively synchronize one release's authored reference list and DOI Cites
 * relationships to its existing Zenodo record. The token is read only from
 * ZENODO_ACCESS_TOKEN, removed from process.env immediately, and never logged.
 *
 * Read-only plan:
 *   node build.js
 *   node tools/sync-zenodo-references.js --plan <slug>
 *
 * Authenticated mutation of one named record:
 *   node tools/sync-zenodo-references.js --apply <slug>
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const API = path.join(ROOT, 'dist', 'api');
const BASE = 'https://zenodo.org';

function read(name) {
  const file = path.join(API, name);
  if (!fs.existsSync(file)) throw new Error(`missing ${file}; run node build.js first`);
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function recordId(paper) {
  const candidates = [paper.zenodoUrl, paper.doiUrl, `https://doi.org/${paper.doi}`];
  for (const value of candidates) {
    const match = String(value || '').match(/(?:zenodo\.(\d+)|zenodo\.org\/(?:record|records)\/(\d+))/);
    if (match) return match[1] || match[2];
  }
  return null;
}

function normalizedDoi(value) {
  return String(value || '').replace(/^https:\/\/doi\.org\//i, '').trim().toLowerCase();
}

function stable(value) {
  if (Array.isArray(value)) return value.map(stable);
  if (!value || typeof value !== 'object') return value;
  return Object.fromEntries(Object.keys(value).sort().map(key => [key, stable(value[key])]));
}

function same(left, right) {
  return JSON.stringify(stable(left)) === JSON.stringify(stable(right));
}

async function request(url, token, { method = 'GET', body } = {}) {
  const headers = { accept: 'application/json', 'user-agent': 'Evidence-Press-Zenodo-reference-sync/1.0' };
  if (token) headers.authorization = `Bearer ${token}`;
  if (body !== undefined) headers['content-type'] = 'application/json';
  const response = await fetch(url, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body)
  });
  const text = await response.text();
  let payload = null;
  try { payload = text ? JSON.parse(text) : null; } catch { /* never print provider HTML */ }
  if (!response.ok) {
    const message = payload && payload.message ? String(payload.message).slice(0, 300) : 'provider returned no JSON message';
    const error = new Error(`${method} ${new URL(url).pathname}: HTTP ${response.status}; ${message}`);
    error.status = response.status;
    throw error;
  }
  return payload;
}

function desiredFor(slug) {
  const papers = read('papers.json').papers;
  const citationPlan = read('citations.json').citations;
  const paper = papers.find(item => item.slug === slug);
  if (!paper) throw new Error(`unknown release slug: ${slug}`);
  const id = recordId(paper);
  if (!id) throw new Error(`${slug}: could not determine Zenodo record ID`);
  const citations = citationPlan.filter(item => item.citingReleaseSlug === slug);
  const references = paper.relatedWorks.map(work => `${work.citation}${work.url ? ` ${work.url}` : ''}`);
  return { paper, id, citations, references };
}

function diff(providerMetadata, desired) {
  const existingRelations = providerMetadata.related_identifiers || [];
  const existingCites = new Set(existingRelations
    .filter(item => String(item.relation || '').toLowerCase() === 'cites' && String(item.scheme || '').toLowerCase() === 'doi')
    .map(item => normalizedDoi(item.identifier)));
  const missingCitations = desired.citations.filter(item => !existingCites.has(normalizedDoi(item.citedDoi)));
  const existingReferences = providerMetadata.references || [];
  const missingReferences = desired.references.filter(item => !existingReferences.includes(item));
  return { existingRelations, existingReferences, missingCitations, missingReferences };
}

async function publicPlan(desired) {
  const provider = await request(`${BASE}/api/records/${desired.id}`, null);
  const delta = diff(provider.metadata || {}, desired);
  return {
    slug: desired.paper.slug,
    doi: desired.paper.doi,
    recordId: Number(desired.id),
    providerStatus: provider.status,
    plannedReferenceCount: desired.references.length,
    plannedDoiCitationCount: desired.citations.length,
    missingReferenceCount: delta.missingReferences.length,
    missingDoiCitationCount: delta.missingCitations.length,
    mutationRequired: delta.missingReferences.length > 0 || delta.missingCitations.length > 0
  };
}

async function apply(desired) {
  let token = process.env.ZENODO_ACCESS_TOKEN;
  delete process.env.ZENODO_ACCESS_TOKEN;
  if (!token) throw new Error('ZENODO_ACCESS_TOKEN is unavailable');
  const depositionUrl = `${BASE}/api/deposit/depositions/${desired.id}`;
  let draftOpened = false;
  try {
    let current = await request(depositionUrl, token);
    let delta = diff(current.metadata || {}, desired);
    if (!delta.missingReferences.length && !delta.missingCitations.length) {
      return { ...(await publicPlan(desired)), result: 'no-op-already-synchronized' };
    }

    if (current.state === 'done' || current.submitted === true) {
      await request(`${depositionUrl}/actions/edit`, token, { method: 'POST', body: {} });
      draftOpened = true;
      current = await request(depositionUrl, token);
    } else if (current.state === 'inprogress') {
      draftOpened = true;
    } else {
      throw new Error(`${desired.paper.slug}: unsupported deposition state ${current.state}`);
    }

    delta = diff(current.metadata || {}, desired);
    const before = structuredClone(current.metadata || {});
    const metadata = structuredClone(before);
    metadata.related_identifiers = [
      ...delta.existingRelations,
      ...delta.missingCitations.map(item => ({ identifier: item.citedDoi, relation: 'cites', scheme: 'doi' }))
    ];
    metadata.references = [...delta.existingReferences, ...delta.missingReferences];

    const updated = await request(depositionUrl, token, { method: 'PUT', body: { metadata } });
    const after = updated.metadata || {};
    const beforeOther = structuredClone(before);
    const afterOther = structuredClone(after);
    delete beforeOther.related_identifiers;
    delete beforeOther.references;
    delete afterOther.related_identifiers;
    delete afterOther.references;
    if (!same(beforeOther, afterOther)) throw new Error(`${desired.paper.slug}: provider changed unrelated metadata during draft update`);
    const remaining = diff(after, desired);
    if (remaining.missingReferences.length || remaining.missingCitations.length)
      throw new Error(`${desired.paper.slug}: draft readback is missing planned references or DOI relations`);

    const published = await request(`${depositionUrl}/actions/publish`, token, { method: 'POST', body: {} });
    draftOpened = false;
    token = null;
    const publicState = await publicPlan(desired);
    if (publicState.mutationRequired) throw new Error(`${desired.paper.slug}: public readback does not contain the published reference update`);
    return {
      ...publicState,
      result: 'published-metadata-update',
      depositionState: published.state,
      submitted: published.submitted
    };
  } catch (error) {
    if (draftOpened && token) {
      try { await request(`${depositionUrl}/actions/discard`, token, { method: 'POST', body: {} }); }
      catch { error.message += '; automatic draft discard also failed'; }
    }
    throw error;
  } finally {
    token = null;
  }
}

async function main() {
  const mode = process.argv[2];
  const slug = process.argv[3];
  if (!['--plan', '--apply'].includes(mode) || !slug)
    throw new Error('usage: node tools/sync-zenodo-references.js <--plan|--apply> <release-slug>');
  const desired = desiredFor(slug);
  const result = mode === '--plan' ? await publicPlan(desired) : await apply(desired);
  process.stdout.write(JSON.stringify(result, null, 2) + '\n');
}

main().catch(error => {
  console.error(error.message);
  process.exit(1);
});
