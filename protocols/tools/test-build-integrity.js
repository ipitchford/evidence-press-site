#!/usr/bin/env node
'use strict';

const assert = require('assert');
const childProcess = require('child_process');
const crypto = require('crypto');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { validatePackReceipt } = require('../build-protocols');
const U = require('./lib/util');

const HASH_A = 'a'.repeat(64);
const HASH_B = 'b'.repeat(64);
const protocol = { id: 'alpha', version: '1.2.3', productivity_evidence: 'NO_IMPACT_EVIDENCE' };
const manifest = {
  pack_id: 'alpha', version: '1.2.3',
  files: [
    { path: 'protocol.yaml', sha256: HASH_A },
    { path: 'SKILL.md', sha256: HASH_B }
  ]
};
const receipt = {
  schema_version: '2.0', scope: 'protocol', subject_id: 'alpha', version: '1.2.3',
  source_commit: null, source_commit_full: null, source_tree: null,
  source_date: null, dirty: null,
  toolchain: { node: U.NODE_COMPATIBILITY, builder: 'verify-all@0.2.0-candidate.1' },
  checks: [
    { name: 'manifest', passed: true },
    { name: 'validate', passed: true }
  ],
  files_sha256: [
    { path: 'protocol.yaml', sha256: HASH_A },
    { path: 'SKILL.md', sha256: HASH_B }
  ],
  assurance_status: 'EXAMPLE_CONFORMANCE_VALIDATED',
  productivity_evidence: 'NO_IMPACT_EVIDENCE',
  replay: { command: 'node tools/verify-all.js', byte_identical_expected: false, condition: 'synthetic test' }
};

const clone = value => JSON.parse(JSON.stringify(value));
let checks = 0;
function test(name, mutate, expected) {
  const candidate = clone(receipt);
  mutate(candidate);
  if (expected === null) {
    assert.strictEqual(validatePackReceipt('alpha', protocol, manifest, candidate), 'EXAMPLE_CONFORMANCE_VALIDATED');
  } else {
    assert.throws(() => validatePackReceipt('alpha', protocol, manifest, candidate), expected);
  }
  checks++;
  console.log('  ✓ ' + name);
}

test('accept exact version and manifest binding', () => {}, null);
test('reject stale receipt version', value => { value.version = '1.2.2'; }, /version .* does not match/);
test('reject stale manifest hash', value => { value.files_sha256[0].sha256 = 'c'.repeat(64); }, /does not equal MANIFEST/);
test('reject incomplete file inventory', value => { value.files_sha256.pop(); }, /inventory does not equal/);
test('reject evidence drift', value => { value.productivity_evidence = 'NO_CLEAR_GAIN'; }, /productivity_evidence .* does not match/);
test('reject a failed gate', value => { value.checks[1].passed = false; }, /failed gates/);

function outputHashes(root) {
  const out = {};
  for (const rel of U.walk(root)) {
    out[rel.split(path.sep).join('/')] = crypto.createHash('sha256')
      .update(fs.readFileSync(path.join(root, rel))).digest('hex');
  }
  return out;
}

function testLedgerOnlyCommitReproducesBuildA() {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'pp-build-replay-'));
  const copiedRoot = path.join(temporary, 'protocols');
  const git = args => childProcess.execFileSync('git', args, {
    cwd: temporary, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe']
  }).trim();
  const runNode = (args, env = {}) => childProcess.execFileSync(process.execPath, args, {
    cwd: temporary,
    env: { ...process.env, ...env, PRODUCTIVITY_PROTOCOLS_SOURCE_COMMIT: env.PRODUCTIVITY_PROTOCOLS_SOURCE_COMMIT || '' },
    stdio: ['ignore', 'ignore', 'pipe']
  });
  try {
    fs.cpSync(U.ROOT, copiedRoot, {
      recursive: true,
      filter(source) {
        const rel = path.relative(U.ROOT, source).split(path.sep).join('/');
        return rel !== 'dist' && !rel.startsWith('dist/') &&
          rel !== 'PUBLISHED.json' && rel !== 'RECEIPT.json' && rel !== 'ATTESTATION.json' &&
          !/^protocols\/[^/]+\/RECEIPT\.json$/.test(rel);
      }
    });
    // The subsystem intentionally consumes a very small, read-only slice of the
    // host house style. Copy that slice so this exercises the same rendering
    // branches as the composite site rather than a reduced standalone build.
    fs.copyFileSync(path.join(U.ROOT, '..', 'site.config.json'), path.join(temporary, 'site.config.json'));
    fs.mkdirSync(path.join(temporary, 'assets', 'art'), { recursive: true });
    fs.mkdirSync(path.join(temporary, 'assets', 'og'), { recursive: true });
    fs.copyFileSync(path.join(U.ROOT, '..', 'assets', 'style.css'), path.join(temporary, 'assets', 'style.css'));
    for (const rel of ['art/productivity.svg', 'og/protocols.png',
      ...U.listPacks().map(id => `og/protocol-${id}.png`)]) {
      const source = path.join(U.ROOT, '..', 'assets', rel);
      if (fs.existsSync(source)) fs.copyFileSync(source, path.join(temporary, 'assets', rel));
    }
    // Commit A must already contain canonical manifests. This also makes the
    // regression robust when it is invoked immediately after a pack edit and
    // before the caller has regenerated the real worktree's derived manifests.
    runNode(['protocols/tools/make-manifest.js']);
    git(['init', '-q']);
    git(['config', 'user.name', 'Productivity Protocols test']);
    git(['config', 'user.email', 'test@invalid.example']);
    git(['add', 'protocols', 'site.config.json', 'assets']);
    git(['commit', '-q', '-m', 'build source A']);
    const sourceA = git(['rev-parse', 'HEAD']);

    const generate = sourceOverride => {
      runNode(['-e', 'const v=require("./protocols/tools/verify-all"); const r=v.runAll({build:false}); if(r.anyFail) process.exit(1);'],
        sourceOverride ? { PRODUCTIVITY_PROTOCOLS_SOURCE_COMMIT: sourceOverride } : {});
      runNode(['protocols/build-protocols.js'],
        sourceOverride ? { PRODUCTIVITY_PROTOCOLS_SOURCE_COMMIT: sourceOverride } : {});
      return outputHashes(path.join(copiedRoot, 'dist'));
    };
    const atA = generate(null);
    const renderedSkill = fs.readFileSync(path.join(
      copiedRoot, 'dist', 'p', 'decision-memo-under-uncertainty', 'index.html'
    ), 'utf8');
    assert.match(renderedSkill, /verified-agent-work&#64;0\.1\.0/,
      'displayed source must entity-encode @ so Cloudflare does not rewrite reviewed HTML');
    assert.doesNotMatch(renderedSkill, /verified-agent-work@0\.1\.0/,
      'displayed source must not expose a plaintext address-like version identifier');
    checks++;
    console.log('  ✓ displayed source is safe from Cloudflare email rewriting');

    fs.writeFileSync(path.join(copiedRoot, 'PUBLISHED.json'), '{}\n');
    git(['add', 'protocols/PUBLISHED.json']);
    git(['commit', '-q', '-m', 'ledger-only control B']);
    fs.rmSync(path.join(copiedRoot, 'dist'), { recursive: true, force: true });
    const atB = generate(sourceA);
    assert.deepStrictEqual(atB, atA, 'clean commit B must reproduce every protocol byte emitted at A');
    checks++;
    console.log('  ✓ ledger-only commit B reproduces build A byte for byte');
  } finally {
    fs.rmSync(temporary, { recursive: true, force: true });
  }
}

testLedgerOnlyCommitReproducesBuildA();

console.log(`test-build-integrity: ${checks}/${checks} checks passed`);
