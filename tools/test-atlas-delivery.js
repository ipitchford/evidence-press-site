#!/usr/bin/env node
'use strict';
// Tests the actual downloadable bytes, not merely their source implementations.
const fs = require('fs'), path = require('path'), os = require('os'), assert = require('assert');
const {execFileSync} = require('child_process');
const {buildIndex} = require('./atlas-memory');
const root = path.resolve(__dirname, '..'), dist = path.join(root, 'dist');
const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'atlas-delivery-'));
try {
  const index = JSON.parse(fs.readFileSync(path.join(dist, 'api/atlas-memory.json')));
  assert.deepStrictEqual(index, buildIndex(root));
  assert.deepStrictEqual(index, JSON.parse(fs.readFileSync(path.join(dist, 'api/v1/atlas-memory.json'))));
  for (const name of ['atlas-agent.js', 'atlas-memory.js', 'atlas-campaign.js']) {
    const bytes = fs.readFileSync(path.join(dist, 'atlas/tools', name));
    assert.deepStrictEqual(bytes, fs.readFileSync(path.join(root, 'tools', name)));
    fs.writeFileSync(path.join(temporary, name), bytes);
  }
  for (const [out, source] of [['agents.md','ATLAS_AGENTS.md'],['evaluation.md','ATLAS_EVALUATION.md'],['cases.md','ATLAS_MEMORY_CASES.md']]) {
    assert.deepStrictEqual(fs.readFileSync(path.join(dist, 'atlas', out)), fs.readFileSync(path.join(root, 'docs', source)));
  }
  fs.copyFileSync(path.join(dist, 'api/atlas-memory.json'), path.join(temporary, 'index.json'));
  fs.writeFileSync(path.join(temporary, 'request.json'), JSON.stringify({question:'identification second condition environmental response', conditions:{}, limit:5}));
  const packet = JSON.parse(execFileSync(process.execPath, [path.join(temporary, 'atlas-agent.js'),'query','--index',path.join(temporary,'index.json'),'--request',path.join(temporary,'request.json')], {cwd:temporary,encoding:'utf8'}));
  assert(packet.matches.some(m => m.card.id === 'identification-second-condition'));
  assert(packet.matches.every(m => m.applicability === 'conditions-unknown'));
  const delta = JSON.parse(execFileSync(process.execPath, [path.join(temporary, 'atlas-agent.js'),'delta','--old',path.join(temporary,'index.json'),'--new',path.join(temporary,'index.json')], {cwd:temporary,encoding:'utf8'}));
  assert.deepStrictEqual(delta.impactedCards, []);
  const html = fs.readFileSync(path.join(dist,'atlas/index.html'),'utf8');
  const graph = html.indexOf('id="atlas-graph"');
  assert(graph > 0 && graph < html.indexOf('id="atlas-agents"'), 'main chart must precede agent tools in reading order');
  assert(graph < html.indexOf('Research route workbench'), 'main chart must precede research route workbench');
  for (const link of ['/atlas/agents.md','/api/atlas-memory.json','/atlas/evaluation.md']) assert(html.includes(link));
  console.log('Atlas delivered-index parity, portable query/delta, documentation and page links: PASS');
} finally { fs.rmSync(temporary, {recursive:true,force:true}); }
