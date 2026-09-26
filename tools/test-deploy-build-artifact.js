#!/usr/bin/env node
'use strict';
// No provider calls: execute the actual shell wrapper against command fixtures.
const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');
const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'ep-deploy-artifact-'));
const write = (file, value) => { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, value); };
let checks = 0;
function run(name, env = {}, args = []) {
  const root = path.join(temporary, name), log = path.join(root, 'calls.log');
  write(path.join(root, 'tools/deploy.sh'), fs.readFileSync(path.join(__dirname, 'deploy.sh')));
  const fixture = `#!${process.execPath}
    const fs = require('fs'), path = require('path');
    const args = process.argv.slice(2), kind = path.basename(process.argv[1]);
    fs.appendFileSync(process.env.EP_TEST_LOG, JSON.stringify({kind,args})+'\\n');
    if (kind === 'node') {
      if (args[0] === 'tools/build-artifact.js') {
        if (args[1] === 'prepare') console.log('/fixture/receipt.json');
        if (args[1] === 'verify') {
          if (process.env.EP_TEST_VERIFY_FAIL === '1') process.exit(2);
          if (args.includes('--print-artifact')) console.log('/fixture/sha256-reviewed');
        }
        if (args[1] === 'deployment-result') console.log('/fixture/deployment.json');
      } else {
        if (process.env.EP_TEST_LOCAL_FAIL === '1' && args[0] === 'tools/test-metadata.js') process.exit(2);
        if (process.env.EP_TEST_READBACK_FAIL === '1' && args[0] === 'protocols/tools/check-release-integrity.js' && args.includes('--live')) process.exit(2);
        if (process.env.EP_TEST_DISCOVERY_FAIL === '1' && args[0] === 'tools/indexnow-submit.js') process.exit(2);
      }
    }
    if (kind === 'npx' && args.includes('whoami') && process.env.EP_TEST_AUTH_FAIL === '1') process.exit(2);
    if (kind === 'npx' && args.includes('deploy') && process.env.EP_TEST_UPLOAD_FAIL === '1') process.exit(2);
  `;
  for (const name of ['node', 'npx']) { const file = path.join(root, 'bin', name); write(file, fixture); fs.chmodSync(file, 0o755); }
  const result = spawnSync('/bin/bash', ['tools/deploy.sh', ...args], {
    cwd: root, encoding: 'utf8', env: { ...process.env, ...env, PATH: `${path.join(root, 'bin')}:/usr/bin:/bin`, EP_TEST_LOG: log,
      EP_POST_DEPLOY_READBACK_ATTEMPTS: '1', EP_POST_DEPLOY_READBACK_DELAY_SECONDS: '0' }
  });
  return { ...result, calls: fs.existsSync(log) ? fs.readFileSync(log, 'utf8').trim().split('\n').map(JSON.parse) : [] };
}
const has = (r, command) => r.calls.some(c => c.args.includes(command));
function test(name, fn) { fn(); checks++; console.log(`PASS ${name}`); }
try {
  test('default path prepares and uploads only frozen content address', () => {
    const r = run('default', {}, ['--branch', 'main']);
    assert.equal(r.status, 0, r.stderr);
    assert(has(r, 'prepare')); assert(has(r, 'verify'));
    const upload = r.calls.find(c => c.kind === 'npx' && c.args.includes('deploy'));
    assert.deepEqual(upload.args, ['wrangler', 'pages', 'deploy', '/fixture/sha256-reviewed', '--project-name', 'evidence-press', '--branch', 'main']);
    const verify = r.calls.findIndex(c => c.args.includes('--print-artifact'));
    const uploadIndex = r.calls.indexOf(upload);
    assert.equal(uploadIndex, verify + 1);
    assert(has(r, '--post-deploy')); assert(has(r, 'deployment-result'));
  });
  test('explicit reviewed receipt never runs builder', () => {
    const r = run('explicit', {}, ['--build-receipt', '/reviewed/receipt.json', '--branch', 'main']);
    assert.equal(r.status, 0, r.stderr);
    assert(!has(r, 'prepare'));
    assert.equal(r.calls.filter(c => c.args.includes('verify')).length, 2);
    assert(r.calls.filter(c => c.args.includes('verify')).every(c => c.args.includes('/reviewed/receipt.json')));
  });
  for (const [name, variable] of [['artifact mutation', 'EP_TEST_VERIFY_FAIL'], ['site gate', 'EP_TEST_LOCAL_FAIL'], ['authentication', 'EP_TEST_AUTH_FAIL']]) {
    test(`${name} failure refuses upload`, () => {
      const r = run(variable, { [variable]: '1' });
      assert.notEqual(r.status, 0); assert(!has(r, 'deploy')); assert(!has(r, 'deployment-result'));
    });
  }
  test('upload failure cannot claim readback or discovery', () => {
    const r = run('upload-failure', { EP_TEST_UPLOAD_FAIL: '1' });
    assert.notEqual(r.status, 0); assert(has(r, 'deploy')); assert(!has(r, '--post-deploy')); assert(!has(r, 'tools/indexnow-submit.js'));
  });
  test('canonical readback failure remains publication-blocking', () => {
    const r = run('readback-failure', { EP_TEST_READBACK_FAIL: '1' });
    assert.notEqual(r.status, 0); assert(has(r, 'deploy')); assert(!has(r, 'tools/indexnow-submit.js')); assert(!has(r, 'deployment-result'));
  });
  test('IndexNow failure records discovery separately after successful readback', () => {
    const r = run('discovery-failure', { EP_TEST_DISCOVERY_FAIL: '1' });
    assert.equal(r.status, 0, r.stderr);
    assert(r.stderr.includes('Publication and canonical readback passed'));
    const record = r.calls.find(c => c.args.includes('deployment-result'));
    assert(record.args.includes('failed'));
    assert(r.calls.findIndex(c => c.args.includes('--post-deploy')) < r.calls.indexOf(record));
  });
  test('malformed duplicate receipt flags are rejected', () => {
    const r = run('bad-args', {}, ['--build-receipt', '/x', '--build-receipt', '/y']);
    assert.notEqual(r.status, 0); assert.equal(r.calls.length, 0);
  });
  console.log(`deploy artifact wrapper tests: PASS (${checks} checks)`);
} finally { fs.rmSync(temporary, { recursive: true, force: true }); }
