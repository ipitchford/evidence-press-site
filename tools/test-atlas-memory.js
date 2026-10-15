#!/usr/bin/env node
'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const cp = require('node:child_process');
const {validateMemory, buildIndex, makePacket, compareIndexes, validateIndex} = require('./atlas-memory');
const root = fs.mkdtempSync(path.join(os.tmpdir(), 'atlas-memory-test-'));
const cli = path.join(__dirname, 'atlas-agent.js');
let passed = 0;
const clone = x => JSON.parse(JSON.stringify(x));
function test(label, fn) { fn(); passed++; console.log('ok      ' + label); }
function write(file, text) { const p = path.join(root, file); fs.mkdirSync(path.dirname(p), {recursive: true}); fs.writeFileSync(p, typeof text === 'string' ? text : JSON.stringify(text)); }
const card = {id: 'scalar-completion', kind: 'lemma', title: 'Scalar completion certificate', summary: 'Quadratic minimax completion for sparse signals.', releaseSlug: 'sample-one', source: {path: 'papers/sample-one/body.md', locator: '## Completion'}, conditions: [{key: 'scalar', value: true}, {key: 'full-support', value: false}], actions: [{label: 'Inspect completion', check: 'Verify source hypotheses before reuse.', stopWhen: 'A required hypothesis fails.'}], limitations: ['Not a vector theorem or external priority clearance.'], provenance: {basis: 'retrospective-source-extraction', reviewedAt: '2026-10-15T18:00:00Z'}, relatedCards: []};
const memory = {schemaVersion: '1.0', claimCeiling: 'Retrospective scope cues, not certification.', cards: [card]};
function run(args) { return cp.spawnSync(process.execPath, [cli, ...args], {encoding: 'utf8', maxBuffer: 8 << 20}); }
try {
  write('papers/sample-one/meta.json', {slug: 'sample-one', title: 'Quadratic signals', version: '0.1', oneLine: 'Sparse completion', keywords: ['minimax']});
  write('papers/sample-one/body.md', '## Completion\nScalar quadratic minimax certificate.');
  write('papers/sample-two/meta.json', {slug: 'sample-two', title: 'Graph colouring', version: '0.2', oneLine: 'Independent witness'});
  write('papers/sample-two/body.md', '## Graph\nColouring witness.');
  write('data/ATLAS_MEMORY.json', memory);
  test('valid retrospective card and verbatim source locator accepted', () => assert.deepEqual(validateMemory(memory, root), []));
  for (const [name, mutate] of [
    ['traversal', c => { c.source.path = 'data/atlas-research/../../secret'; }],
    ['absolute source', c => { c.source.path = '/etc/passwd'; }],
    ['other release source', c => { c.source.path = 'papers/sample-two/body.md'; }],
    ['missing locator', c => { c.source.locator = 'not present'; }],
    ['string condition', c => { c.conditions[0].value = 'true'; }],
    ['null condition key', c => { c.conditions[0].key = null; }],
    ['null identity', c => { c.id = null; }],
    ['duplicate condition', c => { c.conditions.push(c.conditions[0]); }],
    ['condition array missing', c => { c.conditions = null; }],
    ['empty action', c => { c.actions = []; }],
    ['missing stop rule', c => { delete c.actions[0].stopWhen; }],
    ['missing limitation', c => { c.limitations = []; }],
    ['invented provenance', c => { c.provenance.basis = 'prospective'; }],
    ['invalid review date', c => { c.provenance.reviewedAt = 'yesterday'; }],
    ['dangling related card', c => { c.relatedCards = ['absent']; }],
    ['self related card', c => { c.relatedCards = [c.id]; }]
  ]) test('reject ' + name, () => { const m = clone(memory); mutate(m.cards[0]); assert.ok(validateMemory(m, root).length); });
  test('duplicate card IDs rejected', () => { const m = clone(memory); m.cards.push(clone(card)); assert.ok(validateMemory(m, root).length); });
  test('symlink sources rejected even when target is inside root', () => {
    fs.mkdirSync(path.join(root, 'data/atlas-research'), {recursive: true});
    fs.symlinkSync(path.join(root, card.source.path), path.join(root, 'data/atlas-research/link.md'));
    const m = clone(memory); m.cards[0].source.path = 'data/atlas-research/link.md'; assert.ok(validateMemory(m, root).length);
  });
  test('symlink ancestor refused', () => {
    fs.symlinkSync(path.join(root, 'papers'), path.join(root, 'data/atlas-research/linked-dir'));
    const m = clone(memory); m.cards[0].source.path = 'data/atlas-research/linked-dir/sample-one/body.md'; assert.ok(validateMemory(m, root).length);
  });
  const index = buildIndex(root);
  test('index is deterministic and contains every release fingerprint', () => { assert.deepEqual(buildIndex(root), index); assert.equal(index.releases.length, 2); assert.match(index.cards[0].source.sha256, /^[a-f0-9]{64}$/); assert.deepEqual(validateIndex(index, root), []); });
  test('root validation rejects a changed boolean condition with unchanged sources', () => {
    const changed = clone(memory); changed.cards[0].conditions[0].value = false;
    write('data/ATLAS_MEMORY.json', changed);
    assert.deepEqual(validateMemory(changed, root), []);
    assert.ok(validateIndex(index, root).some(e => e.includes('Stale memory')));
    write('condition-index.json', index); write('condition-request.json', {question: 'completion', conditions: {scalar: true}});
    const r = run(['query', '--root', root, '--index', path.join(root, 'condition-index.json'), '--request', path.join(root, 'condition-request.json')]);
    assert.equal(r.status, 1); assert.match(r.stderr, /Stale memory/);
    write('data/ATLAS_MEMORY.json', memory);
    assert.deepEqual(validateIndex(index, root), []);
  });
  test('root validation rechecks current memory schema and source locator', () => {
    const changed = clone(memory); changed.cards[0].source.locator = 'missing heading';
    write('data/ATLAS_MEMORY.json', changed);
    assert.ok(validateIndex(index, root).some(e => e.includes('source locator absent')));
    changed.cards[0].conditions[0].value = 'false'; write('data/ATLAS_MEMORY.json', changed);
    assert.ok(validateIndex(index, root).some(e => e.includes('malformed or duplicate condition')));
    write('data/ATLAS_MEMORY.json', memory);
  });
  const request = {question: 'scalar completion', conditions: {scalar: true}, limit: 3};
  const packet = makePacket(index, request);
  test('packet deterministic, actionable and source/version bound', () => { assert.deepEqual(makePacket(index, request), packet); assert.equal(packet.matches[0].card.releaseVersion, '0.1'); assert.ok(packet.matches[0].card.actions[0].stopWhen); assert.ok(packet.priorArtTodo.length); assert.equal(packet.indexSha256, index.indexSha256); });
  test('unknown is distinct from false', () => { assert.equal(packet.matches[0].conditions.unknown[0].key, 'full-support'); const p = makePacket(index, {...request, conditions: {scalar: true, 'full-support': false}}); assert.equal(p.matches[0].conditions.unknown.length, 0); assert.equal(p.matches[0].conditions.matching.length, 2); assert.equal(p.matches[0].applicability, 'conditions-match'); });
  test('unmet conditions retained as explicit warnings', () => { const p = makePacket(index, {...request, conditions: {scalar: false}}); assert.equal(p.matches[0].applicability, 'conditions-unmet'); assert.equal(p.matches[0].conditions.unmet[0].observed, false); });
  test('unrelated query returns no fabricated matches', () => { const p = makePacket(index, {question: 'xylophonic', conditions: {}}); assert.deepEqual(p.matches, []); assert.deepEqual(p.releases, []); });
  for (const question of ['', '   ', 'the and of']) test('reject empty lexical query ' + JSON.stringify(question), () => assert.throws(() => makePacket(index, {question, conditions: {}})));
  for (const limit of [0, -1, 51, 1.5, '2', null]) test('reject invalid limit ' + JSON.stringify(limit), () => assert.throws(() => makePacket(index, {...request, limit})));
  test('request nonboolean conditions rejected', () => assert.throws(() => makePacket(index, {...request, conditions: {scalar: 'false'}})));
  test('camelCase condition keys remain exact, not guessed aliases', () => { const m = clone(memory); m.cards[0].conditions = [{key: 'scalarTarget', value: true}]; write('data/ATLAS_MEMORY.json', m); const i = buildIndex(root); assert.equal(makePacket(i, {...request, conditions: {scalarTarget: true}}).matches[0].applicability, 'conditions-match'); assert.equal(makePacket(i, {...request, conditions: {scalartarget: true}}).matches[0].applicability, 'conditions-unknown'); write('data/ATLAS_MEMORY.json', memory); });
  test('tampered static source digest rejected', () => { const x = clone(index); x.cards[0].source.sha256 = '0'.repeat(64); assert.ok(validateIndex(x).length); assert.throws(() => makePacket(x, request)); });
  test('unchanged index delta empty', () => { const d = compareIndexes(index, clone(index)); assert.deepEqual(d.impactedCards, []); assert.deepEqual(d.impactedReleases, []); });
  write('papers/sample-one/body.md', '## Completion\nScalar quadratic minimax certificate. Revised boundary.');
  const next = buildIndex(root);
  test('stale filesystem source hashes rejected', () => assert.ok(validateIndex(index, root).some(e => e.includes('Stale'))));
  test('delta scopes invalidation to changed release/card', () => { const d = compareIndexes(index, next); assert.deepEqual(d.releases.changed, ['sample-one']); assert.deepEqual(d.cards.changed, ['scalar-completion']); assert.deepEqual(d.impactedCards, ['scalar-completion']); assert.deepEqual(d.impactedReleases, ['sample-one']); });
  test('limits truncate results with totals retained and ties ordered by ID', () => {
    const m = clone(memory); const second = clone(card); second.id = 'another-completion'; m.cards.push(second); write('data/ATLAS_MEMORY.json', m);
    const i = buildIndex(root), p = makePacket(i, {...request, limit: 1}); assert.equal(p.matches.length, 1); assert.equal(p.totalMatchingCards, 2); assert.equal(p.matches[0].card.id, 'another-completion');
    const d = compareIndexes(next, i); assert.deepEqual(d.cards.added, ['another-completion']); assert.deepEqual(compareIndexes(i, next).cards.removed, ['another-completion']); write('data/ATLAS_MEMORY.json', memory);
  });
  test('related card changes invalidate only direct dependants', () => {
    const m = clone(memory), second = clone(card); second.id = 'dependent'; second.releaseSlug = 'sample-two'; second.source = {path: 'papers/sample-two/body.md', locator: '## Graph'}; second.relatedCards = [card.id]; m.cards.push(second); write('data/ATLAS_MEMORY.json', m); const before = buildIndex(root); m.cards[0].summary += ' Explicit revision.'; write('data/ATLAS_MEMORY.json', m); const d = compareIndexes(before, buildIndex(root)); assert.deepEqual(d.cards.changed, ['scalar-completion']); assert.deepEqual(d.impactedCards, ['dependent', 'scalar-completion']); assert.deepEqual(d.impactedReleases, []); write('data/ATLAS_MEMORY.json', memory);
  });
  write('index.json', next); write('old.json', index); write('request.json', request);
  test('CLI query consumes static index without model or network', () => { const r = run(['query', '--index', path.join(root, 'index.json'), '--request', path.join(root, 'request.json')]); assert.equal(r.status, 0, r.stderr); assert.equal(JSON.parse(r.stdout).kind, 'atlas-agent-packet'); });
  test('CLI optional root rejects stale source snapshot', () => { const r = run(['query', '--root', root, '--index', path.join(root, 'old.json'), '--request', path.join(root, 'request.json')]); assert.equal(r.status, 1); assert.match(r.stderr, /Stale/); });
  test('CLI output is exclusive-create and never overwrites', () => { const out = path.join(root, 'result.json'); const args = ['index', '--root', root, '--out', out]; assert.equal(run(args).status, 0); const before = fs.readFileSync(out); assert.equal(run(args).status, 1); assert.deepEqual(fs.readFileSync(out), before); });
  test('CLI delta accepts explicit snapshots', () => { const r = run(['delta', '--old', path.join(root, 'old.json'), '--new', path.join(root, 'index.json')]); assert.equal(r.status, 0, r.stderr); assert.deepEqual(JSON.parse(r.stdout).impactedReleases, ['sample-one']); });
  console.log(`\nALL ${passed} ATLAS MEMORY TESTS PASSED (retrieval conformance only)`);
} finally { fs.rmSync(root, {recursive: true, force: true}); }
