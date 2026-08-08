#!/usr/bin/env node
'use strict';
/*
 * attest.js — emit ATTESTATION.json: a single canonical digest over the
 * repository receipt, every pack receipt, and the built registry. This digest is
 * the thing a CI signature (sigstore/cosign via OIDC) or a transparency-log entry
 * should cover. On its own the attestation is REPRODUCIBLE (anyone can recompute
 * it from a clean checkout) but not TRUSTED — signing it in CI, under an identity
 * distinct from any author, is what makes it trusted. See ci/README.md and
 * KNOWN-LIMITATIONS.md. Apache-2.0.
 */
const fs = require('fs');
const path = require('path');
const U = require('./lib/util');

function main() {
  const git = U.gitIdentity();
  const covers = [];
  const add = rel => { const abs = path.join(U.ROOT, rel); if (fs.existsSync(abs)) covers.push({ path: rel, sha256: U.sha256File(abs) }); };
  add('RECEIPT.json');
  for (const id of U.listPacks()) add(`protocols/${id}/RECEIPT.json`);
  add('dist/api/protocols.json');
  covers.sort((a, b) => (a.path < b.path ? -1 : 1));
  const digest = U.sha256String(covers.map(c => `${c.path}:${c.sha256}`).join('\n'));
  const attestation = {
    schema_version: '2.0',
    subject: 'productivity-protocols',
    version: U.readJSON(path.join(U.ROOT, 'site.config.json')).softwareVersion,
    source_commit: git.sourceCommit,
    source_commit_full: git.sourceCommitFull,
    source_tree: git.sourceTree,
    source_date: git.sourceDate,
    dirty: git.dirty,
    node: U.NODE_COMPATIBILITY,
    covers,
    digest,
    signed: false,
    note: 'Reproducible, not trusted. A CI signature (sigstore/cosign, OIDC identity) or a transparency-log entry over `digest`, produced by a verifier distinct from the author on a clean checkout, is what makes this attestation trusted. That signing step is a maintainer/CI action, not performed here.'
  };
  fs.writeFileSync(path.join(U.ROOT, 'ATTESTATION.json'), JSON.stringify(attestation, null, 2) + '\n');
  console.log(`attest: covered ${covers.length} file(s); digest ${digest.slice(0, 16)}… (signed: false)`);
}

if (require.main === module) main();
module.exports = { main };
