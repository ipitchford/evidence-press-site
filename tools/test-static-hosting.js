#!/usr/bin/env node
'use strict';
const fs = require('fs'), os = require('os'), path = require('path'), assert = require('assert');
const { check } = require('./check-static-hosting');
const root = fs.mkdtempSync(path.join(os.tmpdir(), 'atlas-static-'));
try {
  const artifact = path.join(root, 'dist'); fs.mkdirSync(artifact);
  fs.writeFileSync(path.join(artifact, 'index.html'), 'static');
  assert.equal(check(root, artifact).status, 'passed');
  for (const name of ['functions', '_worker.js', 'wrangler.toml', 'wrangler.json', 'wrangler.jsonc']) {
    fs.writeFileSync(path.join(root, name), ''); assert.equal(check(root, artifact).status, 'failed'); fs.unlinkSync(path.join(root, name));
  }
  fs.writeFileSync(path.join(artifact, '_worker.js'), ''); assert.equal(check(root, artifact).status, 'failed'); fs.unlinkSync(path.join(artifact, '_worker.js'));
  fs.symlinkSync('/etc/hosts', path.join(artifact, 'link')); assert.equal(check(root, artifact).status, 'failed'); fs.unlinkSync(path.join(artifact, 'link'));
  const large = path.join(artifact, 'large'); fs.closeSync(fs.openSync(large, 'w')); fs.truncateSync(large, 25 * 1024 * 1024 + 1);
  assert.equal(check(root, artifact).status, 'failed'); fs.unlinkSync(large);
  assert.equal(check(root, path.join(root, 'missing')).status, 'failed');
  console.log('Static-hosting safety and mutation tests passed');
} finally { fs.rmSync(root, { recursive: true, force: true }); }
