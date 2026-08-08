#!/usr/bin/env node
'use strict';

/* Run every dependency-free test suite without building or rewriting source. */
const path = require('path');
const childProcess = require('child_process');
const U = require('./lib/util');

function run(rel, args = []) {
  childProcess.execFileSync(process.execPath, [path.join(U.ROOT, rel), ...args], {
    cwd: U.ROOT,
    stdio: 'inherit'
  });
}

run('tools/test-core.js');
run('tools/test-build-integrity.js');
run('tools/eval-harness.js', ['--tests']);
run('tools/pilot-tests.js');
run('tests/release-integrity/run.js');
console.log('\ntest-all: every offline test suite passed');
