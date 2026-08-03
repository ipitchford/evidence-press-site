#!/usr/bin/env node
/* One-command guarded production deployment. */
'use strict';
const { spawnSync } = require('child_process');
const path = require('path');
const ROOT = path.join(__dirname, '..');
function run(command, args) {
  console.log(`\n$ ${command} ${args.join(' ')}`);
  const result = spawnSync(command, args, { cwd: ROOT, stdio: 'inherit' });
  if (result.status !== 0) process.exit(result.status || 1);
}
run(process.execPath, ['build.js']);
run(process.execPath, ['tools/check-observatory-media.js']);
run(process.execPath, ['tools/check-published.js']);
run(process.execPath, ['tools/check-publication-integrity.js', '--live']);
run('npx', ['wrangler', 'whoami']);
run('npx', ['wrangler', 'pages', 'deploy', 'dist', '--project-name', 'evidence-press', '--branch', 'main']);
run(process.execPath, ['tools/check-publication-integrity.js', '--live']);
console.log('\nSafe production deployment completed and passed post-deploy readback.');
