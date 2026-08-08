#!/usr/bin/env node
'use strict';
/*
 * make-manifest.js — generate MANIFEST.json for each pack: every shipped file
 * with its SHA-256 and role, plus the pack's declared permission summary and
 * network requirement. Deterministic (files sorted), so a clean checkout yields
 * an identical manifest. Apache-2.0.
 *
 * Usage: node tools/make-manifest.js [pack-id]
 */
const fs = require('fs');
const path = require('path');
const { load } = require('./lib/yaml');
const U = require('./lib/util');

function roleOf(rel) {
  if (rel === 'protocol.yaml') return 'contract';
  if (rel === 'SKILL.md') return 'skill';
  if (rel === 'LICENSE') return 'license';
  if (rel.startsWith('references/')) return 'reference';
  if (rel.startsWith('assets/')) return 'asset';
  if (rel.startsWith('scripts/')) return 'script';
  if (rel.startsWith('examples/')) return 'example';
  if (rel.startsWith('tests/')) return 'test';
  if (rel.startsWith('evals/')) return 'eval';
  if (rel.startsWith('adapters/')) return 'adapter';
  return 'doc';
}

function makeManifest(id) {
  const dir = U.packDir(id);
  const p = load(fs.readFileSync(path.join(dir, 'protocol.yaml'), 'utf8'));
  const files = U.walk(dir)
    .filter(f => f !== 'MANIFEST.json' && f !== 'RECEIPT.json')
    .sort()
    .map(rel => ({
      path: rel,
      sha256: U.sha256File(path.join(dir, rel)),
      bytes: fs.statSync(path.join(dir, rel)).size,
      role: roleOf(rel)
    }));
  const perms = Array.from(new Set((p.permissions || []).map(x => x.action))).sort();
  const networkRequired = perms.includes('network');
  const manifest = {
    schema_version: '1.0',
    pack_id: id,
    version: p.version,
    network_required: networkRequired,
    declared_permissions: perms,
    files
  };
  fs.writeFileSync(path.join(dir, 'MANIFEST.json'), JSON.stringify(manifest, null, 2) + '\n');
  return files.length;
}

function main() {
  const only = process.argv[2];
  const packs = only ? [only] : U.listPacks();
  for (const id of packs) {
    const n = makeManifest(id);
    console.log(`manifest: ${id} (${n} files)`);
  }
}

if (require.main === module) main();
module.exports = { makeManifest };
