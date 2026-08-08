#!/usr/bin/env node
/* Compatibility entrypoint for the canonical guarded deployment wrapper. */
'use strict';
const { spawnSync } = require('child_process');
const path = require('path');

const ROOT = path.join(__dirname, '..');

function run(command, args) {
  console.log(`\n$ ${command} ${args.join(' ')}`);
  const result = spawnSync(command, args, { cwd: ROOT, stdio: 'inherit' });
  if (result.status !== 0) process.exit(result.status || 1);
}

const forwarded = process.argv.slice(2);
run('./tools/deploy.sh', forwarded.length ? forwarded : ['--branch', 'main']);

console.log('\nSafe production deployment completed through tools/deploy.sh.');
