#!/usr/bin/env node
'use strict';
/*
 * make-receipt.js — run every gate and write the per-pack and repository
 * receipts WITHOUT rebuilding the site. Thin delegate to verify-all's runAll.
 * Use `node tools/verify-all.js` for the full pipeline including the build.
 * Apache-2.0.
 */
const { runAll } = require('./verify-all');
const { anyFail } = runAll({ build: false });
process.exit(anyFail ? 1 : 0);
