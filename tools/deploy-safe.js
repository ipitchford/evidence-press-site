#!/usr/bin/env node
/* One-command guarded production deployment with post-deploy readback. */
'use strict';
const { spawnSync } = require('child_process');
const path = require('path');

const ROOT = path.join(__dirname, '..');

function run(command, args) {
  console.log(`\n$ ${command} ${args.join(' ')}`);
  const result = spawnSync(command, args, { cwd: ROOT, stdio: 'inherit' });
  if (result.status !== 0) process.exit(result.status || 1);
}

run(process.execPath, ['tools/test-render.js']);
run('./protocols/deploy/integrate.sh', []);
run(process.execPath, ['tools/test-metadata.js']);
run(process.execPath, ['tools/check-links.js']);
run(process.execPath, ['tools/check-published.js', '--live']);
run(process.execPath, ['tools/check-publication-integrity.js', '--live']);
run('npx', ['wrangler', 'whoami']);
run('npx', ['wrangler', 'pages', 'deploy', 'dist', '--project-name', 'evidence-press', '--branch', 'main']);
run(process.execPath, ['tools/check-publication-integrity.js', '--live']);
run(process.execPath, ['tools/check-published.js', '--record']);
run(process.execPath, ['tools/indexnow-submit.js']);

console.log('\nSafe production deployment completed, passed post-deploy readback, and updated the local publication ledger.');
