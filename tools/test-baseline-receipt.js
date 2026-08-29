#!/usr/bin/env node
'use strict';

const path = require('path');
const { expectedReceiptId, loadBaselineReceipt, validateBaselineReceipt } = require('./baseline-receipt');
const ROOT = path.join(__dirname, '..');
const receipt = loadBaselineReceipt(ROOT);
let failures = 0;
const ok = (condition, label) => condition ? console.log(`ok      ${label}`) : (failures++, console.log(`FAIL    ${label}`));

ok(validateBaselineReceipt(receipt, { root: ROOT, verifyGit: true }).length === 0,
  'frozen baseline identity and every Git-object hash validate');
const altered = JSON.parse(JSON.stringify(receipt));
altered.corpus.releaseCount++;
ok(validateBaselineReceipt(altered).some(error => error.includes('content-derived')),
  'negative control rejects altered baseline content under the old identity');
altered.receiptId = expectedReceiptId(altered);
altered.fileHashes[0].sha256 = `sha256:${'0'.repeat(64)}`;
ok(validateBaselineReceipt(altered, { root: ROOT, verifyGit: true }).some(error => error.includes('Git hash mismatch')),
  'negative control rejects a false baseline Git-object hash');

console.log(failures ? `\n${failures} BASELINE RECEIPT TEST(S) FAILED` : '\nALL BASELINE RECEIPT TESTS PASSED');
process.exitCode = failures ? 1 : 0;
