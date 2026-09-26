#!/usr/bin/env node
'use strict';
const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const cp = require('child_process');
const A = require('./build-artifact');
const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'ep-artifact-hostile-'));
let checks = 0;
const originalThumbDir = process.env.EVIDENCE_PRESS_THUMBNAIL_DIR;
const originalRequireThumbs = process.env.EVIDENCE_PRESS_REQUIRE_CENTRAL_THUMBS;
const write = (file, value) => { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, value); };
function git(root, ...args) {
  return cp.execFileSync('git', args, { cwd: root, env: { ...process.env, GIT_CONFIG_GLOBAL: '/dev/null', GIT_CONFIG_NOSYSTEM: '1' }, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
}
function commit(root) {
  git(root, 'add', '.');
  git(root, '-c', 'user.name=Fixture', '-c', 'user.email=fixture@example.invalid', 'commit', '-qm', 'fixture');
}
function fixture(name, control = {}) {
  const root = path.join(temporary, name);
  fs.mkdirSync(root);
  git(root, 'init', '-q');
  write(path.join(root, '.gitignore'), 'dist/\nprotocols/dist/\nprotocols/RECEIPT.json\nprotocols/protocols/*/RECEIPT.json\nignored-source.txt\nnode_modules/\n');
  write(path.join(root, 'source.txt'), 'reviewed source\n');
  write(path.join(root, 'control.json'), JSON.stringify(control));
  write(path.join(root, 'thumbs/test.jpg'), 'thumbnail');
  write(path.join(root, 'papers/test/meta.json'), JSON.stringify({ slug: 'test' }));
  write(path.join(root, 'protocols/PUBLISHED.json'), JSON.stringify({ source: { commit: 'a'.repeat(40), dirty: false } }));
  write(path.join(root, 'protocols/protocols/test/input.json'), '{}');
  write(path.join(root, 'tools/build-runtime-guard.js'), fs.readFileSync(path.join(__dirname, 'build-runtime-guard.js')));
  write(path.join(root, 'tools/build-runtime-loader.mjs'), fs.readFileSync(path.join(__dirname, 'build-runtime-loader.mjs')));
  write(path.join(root, 'protocols/deploy/integrate.sh'), '#!/bin/bash\nset -eu\nnode fixture-build.js\n');
  write(path.join(root, 'protocols/tools/check-release-integrity.js'), "if (require('../../control.json').gateFail) process.exit(2);\n");
  write(path.join(root, 'fixture-build.js'), `
    const fs = require('fs'), path = require('path');
    const control = require('./control.json');
    if (control.packageLoad) require('hostile-package');
    if (control.packageImport) import('hostile-package');
    if (control.fail) process.exit(2);
    const write = (p,s) => { fs.mkdirSync(path.dirname(p), {recursive:true}); fs.writeFileSync(p,s); };
    const count = '.git/build-count';
    write(count, String(Number(fs.existsSync(count) ? fs.readFileSync(count) : 0) + 1));
    for (const p of ['dist/index.html','dist/api/build.json','dist/sitemap.xml',
        'dist/protocols/index.html','dist/protocols/api/protocols.json',
        'protocols/dist/index.html','protocols/RECEIPT.json','protocols/protocols/test/RECEIPT.json']) write(p,'reviewed bytes');
    if (control.mutate) write('source.txt','changed during build');
  `);
  commit(root);
  write(path.join(root, 'protocols/PUBLISHED.json'), JSON.stringify({ source: { commit: git(root, 'rev-parse', 'HEAD'), dirty: false } }));
  commit(root);
  const central = path.join(temporary, `${name}-thumbs`);
  write(path.join(central, 'test.jpg'), 'thumbnail');
  process.env.EVIDENCE_PRESS_THUMBNAIL_DIR = central;
  process.env.EVIDENCE_PRESS_REQUIRE_CENTRAL_THUMBS = '1';
  return { root, file: path.join(temporary, `${name}-artifact`, 'receipt.json'), central };
}
function test(name, fn) {
  fn(); checks++; console.log(`PASS ${name}`);
}
function rejectsMutation(name, mutate, pattern) {
  test(name, () => {
    const f = fixture(name.replace(/\W/g, '-'));
    const prepared = A.prepare(f.root, f.file);
    mutate(f, prepared);
    assert.throws(() => A.verify(f.root, f.file), pattern);
  });
}

try {
  test('unchanged build reuses exactly once and preserves a composite artifact', () => {
    const f = fixture('reuse');
    const first = A.prepare(f.root, f.file);
    const second = A.prepare(f.root, f.file);
    assert.equal(first.reused, false); assert.equal(second.reused, true);
    assert.equal(fs.readFileSync(path.join(f.root, '.git/build-count'), 'utf8'), '1');
    assert.equal(path.basename(first.artifact), `sha256-${first.receipt.output.dist.sha256}`);
    assert(fs.existsSync(path.join(first.artifact, 'protocols/index.html')));
    assert.equal(first.receipt.input.tree, git(f.root, 'rev-parse', 'HEAD^{tree}'));
    assert(!stable(first.receipt).includes('OPENAI_API_KEY'));
    const result = JSON.parse(fs.readFileSync(A.deploymentResult(f.file, 'failed'), 'utf8'));
    assert.equal(result.publication.status, 'canonical-readback-passed');
    assert.equal(result.discovery.status, 'failed');
    assert.equal(result.discovery.retryCommand, 'node tools/indexnow-submit.js');
  });
  rejectsMutation('dirty tracked source', f => write(path.join(f.root, 'source.txt'), 'changed'), /clean/);
  rejectsMutation('untracked source', f => write(path.join(f.root, 'new.txt'), 'added'), /clean/);
  rejectsMutation('ignored source injection', f => write(path.join(f.root, 'ignored-source.txt'), 'added'), /inputs changed/);
  rejectsMutation('committed source change', f => { write(path.join(f.root, 'source.txt'), 'changed'); commit(f.root); }, /inputs changed/);
  rejectsMutation('ledger-only B seal changes invalidate A build', f => { write(path.join(f.root, 'protocols/PUBLISHED.json'), JSON.stringify({ source: { commit: git(f.root, 'rev-parse', 'HEAD'), dirty: false } })); commit(f.root); }, /inputs changed/);
  rejectsMutation('modified root output', f => write(path.join(f.root, 'dist/index.html'), 'wrong'), /output changed/);
  rejectsMutation('added root output', f => write(path.join(f.root, 'dist/extra.html'), 'wrong'), /output changed/);
  rejectsMutation('deleted root output', f => fs.unlinkSync(path.join(f.root, 'dist/sitemap.xml')), /missing/);
  rejectsMutation('protocol output mutation', f => write(path.join(f.root, 'protocols/dist/index.html'), 'wrong'), /output changed/);
  rejectsMutation('generated protocol receipt mutation', f => write(path.join(f.root, 'protocols/RECEIPT.json'), 'wrong'), /output changed/);
  rejectsMutation('frozen artifact mutation', (f, prepared) => { const file = path.join(prepared.artifact, 'index.html'); fs.chmodSync(file, 0o644); write(file, 'wrong'); }, /artifact changed/);
  rejectsMutation('receipt tampering', f => { const r = JSON.parse(fs.readFileSync(f.file)); r.input.head = 'f'.repeat(40); write(f.file, JSON.stringify(r)); }, /modified build receipt/);
  rejectsMutation('environment changes invalidate receipt', f => { process.env.EVIDENCE_PRESS_THUMBNAIL_DIR = path.join(temporary, 'changed-location'); write(path.join(process.env.EVIDENCE_PRESS_THUMBNAIL_DIR, 'test.jpg'), 'thumbnail'); }, /inputs changed/);
  rejectsMutation('external thumbnail changes invalidate receipt', f => write(path.join(f.central, 'test.jpg'), 'wrong'), /inputs changed/);
  rejectsMutation('Git assume-unchanged cannot hide changes', f => { git(f.root, 'update-index', '--assume-unchanged', 'source.txt'); write(path.join(f.root, 'source.txt'), 'hidden'); }, /assume-unchanged/);
  rejectsMutation('output symlink escape', f => { fs.unlinkSync(path.join(f.root, 'dist/index.html')); fs.symlinkSync(path.join(f.root, 'source.txt'), path.join(f.root, 'dist/index.html')); }, /symlink/);
  rejectsMutation('ignored input symlink escape', f => fs.symlinkSync(path.join(f.root, 'source.txt'), path.join(f.root, 'ignored-source.txt')), /symlink/);
  rejectsMutation('protocol receipt symlink escape', f => { fs.unlinkSync(path.join(f.root, 'protocols/RECEIPT.json')); fs.symlinkSync(path.join(f.root, 'source.txt'), path.join(f.root, 'protocols/RECEIPT.json')); }, /regular file/);
  for (const [name, control, pattern] of [
    ['failed builder never gets receipt', { fail: true }, /failed/],
    ['failed exact protocol gate never gets receipt', { gateFail: true }, /failed/],
    ['source mutation during build never gets receipt', { mutate: true }, /clean|changed during/],
    ['mutable package loading forbidden', { packageLoad: true }, /failed/],
    ['dynamic ESM package loading forbidden', { packageImport: true }, /failed/]
  ]) test(name, () => {
    const f = fixture(name.replace(/\W/g, '-'), control);
    if (control.packageLoad || control.packageImport) write(path.join(f.root, 'node_modules/hostile-package/index.js'), 'module.exports = true;');
    assert.throws(() => A.prepare(f.root, f.file), pattern);
    assert(!fs.existsSync(f.file));
  });
  test('receipt cannot pollute source tree', () => {
    const f = fixture('in-tree');
    assert.throws(() => A.prepare(f.root, path.join(f.root, 'receipt.json')), /outside/);
  });
  test('ambient secrets and runtime injection do not enter build environment', () => {
    const f = fixture('env-sanitization');
    const env = A.buildEnvironment(f.root);
    for (const key of ['OPENAI_API_KEY', 'ZENODO_ACCESS_TOKEN', 'NODE_PATH', 'GIT_DIR', 'LD_PRELOAD', 'DYLD_INSERT_LIBRARIES']) assert(!(key in env));
    assert(env.NODE_OPTIONS.includes('build-runtime-guard.js'));
    assert.equal(env.TZ, 'UTC');
  });
  console.log(`build-artifact hostile tests: PASS (${checks} checks)`);
} finally {
  if (originalThumbDir === undefined) delete process.env.EVIDENCE_PRESS_THUMBNAIL_DIR;
  else process.env.EVIDENCE_PRESS_THUMBNAIL_DIR = originalThumbDir;
  if (originalRequireThumbs === undefined) delete process.env.EVIDENCE_PRESS_REQUIRE_CENTRAL_THUMBS;
  else process.env.EVIDENCE_PRESS_REQUIRE_CENTRAL_THUMBS = originalRequireThumbs;
  fs.rmSync(temporary, { recursive: true, force: true });
}
function stable(value) { return JSON.stringify(value); }
