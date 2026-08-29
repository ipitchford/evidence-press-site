#!/usr/bin/env node
'use strict';

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { canonical } = require('./claim-assurance');

const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');
function identityPayload(receipt) {
  const copy = JSON.parse(JSON.stringify(receipt));
  delete copy.receiptId;
  return copy;
}
const expectedReceiptId = receipt => `ep-baseline:sha256:${sha256(canonical(identityPayload(receipt)))}`;
function loadBaselineReceipt(root) {
  return JSON.parse(fs.readFileSync(path.join(root, 'data', 'baselines', 'evidence-press-stage0-2026-08-29.json'), 'utf8'));
}
function validateBaselineReceipt(receipt, { root = null, verifyGit = false } = {}) {
  const errors = [];
  if (receipt.schemaVersion !== '1.0' || receipt.recordType !== 'implementation-baseline-receipt') errors.push('wrong schema version or record type');
  if (receipt.receiptId !== expectedReceiptId(receipt)) errors.push('receiptId does not match the content-derived baseline identity');
  if (!/^[0-9a-f]{40}$/.test(String(receipt.source && receipt.source.commit))) errors.push('source commit must be a full Git commit');
  if (receipt.cashCost !== 'zero-required') errors.push('cashCost must be zero-required');
  if (!Array.isArray(receipt.tests) || receipt.tests.some(test => test.outcome !== 'passed')) errors.push('every frozen baseline test must be recorded as passed');
  const paths = new Set();
  for (const item of receipt.fileHashes || []) {
    if (paths.has(item.path)) errors.push(`duplicate file hash path ${item.path}`);
    paths.add(item.path);
    if (!/^sha256:[0-9a-f]{64}$/.test(String(item.sha256))) errors.push(`invalid SHA-256 for ${item.path}`);
    if (root && verifyGit) {
      try {
        const content = execFileSync('git', ['show', `${receipt.source.commit}:${item.path}`], { cwd: root });
        const actual = `sha256:${sha256(content)}`;
        if (actual !== item.sha256) errors.push(`baseline Git hash mismatch for ${item.path}`);
      } catch (error) { errors.push(`cannot read ${item.path} from baseline commit`); }
    }
  }
  return errors;
}

if (require.main === module) {
  const root = path.join(__dirname, '..');
  const receipt = loadBaselineReceipt(root);
  const errors = validateBaselineReceipt(receipt, { root, verifyGit: process.argv.includes('--verify-git') });
  if (errors.length) {
    console.error(`BASELINE RECEIPT INVALID (${errors.length})`);
    errors.forEach(error => console.error(`  - ${error}`));
    process.exitCode = 1;
  } else console.log(`BASELINE RECEIPT VALID: ${receipt.source.commit.slice(0, 12)}, ${receipt.fileHashes.length} frozen file hashes`);
}

module.exports = { expectedReceiptId, loadBaselineReceipt, validateBaselineReceipt };
