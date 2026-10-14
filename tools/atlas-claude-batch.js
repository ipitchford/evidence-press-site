'use strict';

// Minimal Message Batches client for the Evidence Atlas discovery pilot.
// Raw HTTP on Node's global fetch, matching the repository's dependency-free
// tooling (the embedding route uses the same approach). Every request body is
// hashed so a result can be tied to the exact prompt that produced it.
//
// Endpoints (no beta header):
//   POST /v1/messages/batches            {requests:[{custom_id, params}]}
//   GET  /v1/messages/batches/{id}       processing_status, results_url
//   GET  {results_url}                   JSONL: {custom_id, result:{type, message}}

const crypto = require('crypto');

const API_BASE = 'https://api.anthropic.com';
const API_VERSION = '2023-06-01';
const DEFAULT_MODEL = 'claude-opus-5-5';

function canonical(value) {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === 'object') return Object.fromEntries(Object.keys(value).sort().map(k => [k, canonical(value[k])]));
  return value;
}
function sha256(value) { return crypto.createHash('sha256').update(typeof value === 'string' ? value : JSON.stringify(canonical(value))).digest('hex'); }

function headers(apiKey) {
  return { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': API_VERSION };
}

async function createBatch(requests, { apiKey, fetchImpl = globalThis.fetch } = {}) {
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY is not set; the batch is never silently skipped');
  const response = await fetchImpl(`${API_BASE}/v1/messages/batches`, { method: 'POST', headers: headers(apiKey), body: JSON.stringify({ requests }) });
  if (!response.ok) throw new Error(`batch create failed with HTTP ${response.status}: ${(await response.text()).slice(0, 300)}`);
  return response.json();
}

async function retrieveBatch(id, { apiKey, fetchImpl = globalThis.fetch } = {}) {
  const response = await fetchImpl(`${API_BASE}/v1/messages/batches/${id}`, { headers: headers(apiKey) });
  if (!response.ok) throw new Error(`batch retrieve failed with HTTP ${response.status}`);
  return response.json();
}

async function waitForBatch(id, { apiKey, fetchImpl = globalThis.fetch, pollMs = 60000, timeoutMs = 3 * 3600 * 1000, sleep = ms => new Promise(r => setTimeout(r, ms)), onPoll = null } = {}) {
  const started = Date.now();
  for (;;) {
    const batch = await retrieveBatch(id, { apiKey, fetchImpl });
    if (onPoll) onPoll(batch);
    if (batch.processing_status === 'ended') return batch;
    if (Date.now() - started > timeoutMs) throw new Error(`batch ${id} did not end within ${timeoutMs} ms (status ${batch.processing_status})`);
    await sleep(pollMs);
  }
}

async function fetchResults(resultsUrl, { apiKey, fetchImpl = globalThis.fetch } = {}) {
  const response = await fetchImpl(resultsUrl, { headers: headers(apiKey) });
  if (!response.ok) throw new Error(`batch results fetch failed with HTTP ${response.status}`);
  const body = await response.text();
  return body.split('\n').filter(line => line.trim()).map(line => JSON.parse(line));
}

// Extract the JSON object from a structured-output result; null on any
// failure with the reason recorded by the caller.
function parseStructuredResult(entry) {
  if (!entry || !entry.result) return { ok: false, reason: 'no result' };
  if (entry.result.type !== 'succeeded') return { ok: false, reason: `result type ${entry.result.type}` };
  const message = entry.result.message || {};
  if (message.stop_reason === 'refusal') return { ok: false, reason: 'refusal' };
  const block = (message.content || []).find(b => b.type === 'text');
  if (!block) return { ok: false, reason: 'no text block' };
  try { return { ok: true, value: JSON.parse(block.text), usage: message.usage || null, model: message.model || null }; } catch { return { ok: false, reason: 'invalid JSON' }; }
}

// Build a structured-output request. Thinking is adaptive by default on the
// model; effort is explicit because the model's default is medium.
function structuredRequest(customId, { model = DEFAULT_MODEL, system, user, schema, effort = 'high', maxTokens = 6000 }) {
  const params = {
    model,
    max_tokens: maxTokens,
    output_config: { effort, format: { type: 'json_schema', schema } },
    messages: [{ role: 'user', content: user }]
  };
  if (system) params.system = system;
  return { custom_id: customId, params };
}

async function runBatch(requests, { apiKey, fetchImpl, pollMs, timeoutMs, sleep, onPoll } = {}) {
  const created = await createBatch(requests, { apiKey, fetchImpl });
  const ended = await waitForBatch(created.id, { apiKey, fetchImpl, pollMs, timeoutMs, sleep, onPoll });
  if (!ended.results_url) throw new Error(`batch ${created.id} ended without results_url`);
  const entries = await fetchResults(ended.results_url, { apiKey, fetchImpl });
  const byId = new Map(entries.map(e => [e.custom_id, e]));
  return {
    batchId: created.id,
    createdAt: created.created_at || null,
    endedAt: ended.ended_at || null,
    requestCounts: ended.request_counts || null,
    requestSha256ById: new Map(requests.map(r => [r.custom_id, sha256(r.params)])),
    byId
  };
}

// Resume: attach to an existing batch created from the same deterministic
// request set (hashes are recomputed locally, so provenance is unchanged).
async function resumeBatch(batchId, requests, { apiKey, fetchImpl, pollMs, timeoutMs, sleep, onPoll } = {}) {
  const ended = await waitForBatch(batchId, { apiKey, fetchImpl, pollMs, timeoutMs, sleep, onPoll });
  if (!ended.results_url) throw new Error(`batch ${batchId} ended without results_url`);
  const entries = await fetchResults(ended.results_url, { apiKey, fetchImpl });
  return {
    batchId,
    createdAt: ended.created_at || null,
    endedAt: ended.ended_at || null,
    requestCounts: ended.request_counts || null,
    requestSha256ById: new Map(requests.map(r => [r.custom_id, sha256(r.params)])),
    byId: new Map(entries.map(e => [e.custom_id, e]))
  };
}

module.exports = { resumeBatch, API_BASE, API_VERSION, DEFAULT_MODEL, sha256, canonical, createBatch, retrieveBatch, waitForBatch, fetchResults, parseStructuredResult, structuredRequest, runBatch };
