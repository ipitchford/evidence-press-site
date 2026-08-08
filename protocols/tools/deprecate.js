#!/usr/bin/env node
'use strict';
/*
 * deprecate.js <pack-id> "reason" — move a pack to DEPRECATED: set its source
 * assurance_status, remove its RECEIPT.json (so the site shows DEPRECATED via the
 * source fallback), and write a dated record under foundry/deprecations/. The pack
 * is KEPT (deprecation is a marking, not a deletion) and withdrawn from active
 * recommendation. verify-all honours a DEPRECATED source status and will not
 * recompute a positive rung over it. Apache-2.0.
 */
const fs = require('fs');
const path = require('path');
const U = require('./lib/util');

const id = process.argv[2];
const reason = process.argv[3] || 'No reason given.';
if (!id) { console.error('usage: node tools/deprecate.js <pack-id> "reason"'); process.exit(2); }
const dir = U.packDir(id);
if (!fs.existsSync(dir)) { console.error(`no such pack: ${id}`); process.exit(1); }

const yPath = path.join(dir, 'protocol.yaml');
let y = fs.readFileSync(yPath, 'utf8');
if (/^assurance_status:/m.test(y)) y = y.replace(/^assurance_status:.*$/m, 'assurance_status: DEPRECATED');
else y += '\nassurance_status: DEPRECATED\n';
fs.writeFileSync(yPath, y);

const rp = path.join(dir, 'RECEIPT.json');
if (fs.existsSync(rp)) fs.unlinkSync(rp);

const recDir = path.join(U.ROOT, 'foundry', 'deprecations');
fs.mkdirSync(recDir, { recursive: true });
const git = U.gitIdentity();
fs.writeFileSync(path.join(recDir, `${id}.md`),
  `# Deprecated: ${id}\n\n**Reason:** ${reason}\n\n` +
  `Source \`assurance_status\` set to \`DEPRECATED\`; \`RECEIPT.json\` removed so the site shows the terminal state. ` +
  `The pack is kept for the record and withdrawn from active recommendation. ` +
  `Recorded at commit ${git.sourceCommit || 'local'} (${git.sourceDate || 'uncommitted'}).\n`);

console.log(`deprecated ${id}: ${reason}`);
