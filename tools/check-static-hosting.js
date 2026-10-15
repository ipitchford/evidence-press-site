#!/usr/bin/env node
'use strict';
// A local deployment boundary, not an audit of the account's other services.
const fs = require('fs');
const path = require('path');
function check(root, artifact) {
  const errors = [];
  for (const name of ['functions', '_worker.js', '_worker.js.map', 'wrangler.toml', 'wrangler.json', 'wrangler.jsonc']) {
    if (fs.existsSync(path.join(root, name))) errors.push(`Static-only policy rejects ${name}; no Functions, Workers or service bindings are authorised.`);
  }
  let files = 0, bytes = 0;
  function walk(dir) {
    for (const name of fs.readdirSync(dir).sort()) {
      const file = path.join(dir, name), stat = fs.lstatSync(file);
      if (stat.isSymbolicLink()) { errors.push(`Artifact symlink rejected: ${path.relative(artifact, file)}`); continue; }
      if (name === '_worker.js' || name === 'functions') errors.push(`Dynamic artifact rejected: ${path.relative(artifact, file)}`);
      if (stat.isDirectory()) walk(file);
      else if (stat.isFile()) { files++; bytes += stat.size; if (stat.size > 25 * 1024 * 1024) errors.push(`Pages free-plan file limit exceeded: ${name}`); }
      else errors.push(`Non-file artifact entry: ${name}`);
    }
  }
  if (artifact) {
    if (!fs.existsSync(artifact) || !fs.statSync(artifact).isDirectory()) errors.push('Artifact must be an existing directory');
    else { walk(artifact); if (files > 20000) errors.push('Pages free-plan 20,000-file ceiling exceeded'); }
  }
  return { status: errors.length ? 'failed' : 'passed', mode: 'static-pages-only', files, bytes, errors,
    inferenceLimit: 'No new dynamic deployment permitted. This does not audit unrelated account charges or authorise a plan upgrade.' };
}
module.exports = { check };
if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.length > 1) throw new Error('Usage: node tools/check-static-hosting.js [artifact-directory]');
  const result = check(path.resolve(__dirname, '..'), args[0] && path.resolve(args[0]));
  console.log(JSON.stringify(result, null, 2));
  if (result.errors.length) process.exitCode = 1;
}
