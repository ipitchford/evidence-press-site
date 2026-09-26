#!/usr/bin/env node
'use strict';

/* A local, content-addressed handoff, NOT an independent assurance certificate.
 * prepare runs the existing composite builder and exact protocol gate once.
 * verify never builds and refuses stale inputs or modified output. Deployment
 * must still run preservation/site/live gates. A/B and C/D are not collapsed:
 * root build identity includes HEAD, so even a ledger-only commit invalidates it.
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');
const { pathToFileURL } = require('url');
const { spawnSync, execFileSync } = require('child_process');
const VERSION = 1;
const ROOT = path.resolve(__dirname, '..');
const sha = data => crypto.createHash('sha256').update(data).digest('hex');
const stable = value => JSON.stringify(value);
const digest = value => sha(stable(value));
const inside = (parent, child) => child === parent || child.startsWith(parent + path.sep);
const generated = rel => rel === 'dist' || rel.startsWith('dist/') ||
  rel === 'protocols/dist' || rel.startsWith('protocols/dist/') ||
  rel === 'protocols/RECEIPT.json' || /^protocols\/protocols\/[^/]+\/RECEIPT\.json$/.test(rel);

function inventory(root, skip = () => false) {
  const files = [];
  function walk(dir, relative) {
    const stat = fs.lstatSync(dir);
    if (!stat.isDirectory() || stat.isSymbolicLink()) throw new Error(`not a real directory: ${dir}`);
    for (const name of fs.readdirSync(dir).sort()) {
      const rel = relative ? `${relative}/${name}` : name;
      if (skip(rel)) continue;
      const file = path.join(dir, name), entry = fs.lstatSync(file);
      if (entry.isSymbolicLink()) throw new Error(`symlink is outside the build receipt boundary: ${rel}`);
      if (entry.isDirectory()) { files.push({ path: rel, type: 'directory' }); walk(file, rel); }
      else if (entry.isFile()) files.push({ path: rel, bytes: entry.size, executable: Boolean(entry.mode & 0o111), sha256: sha(fs.readFileSync(file)) });
      else throw new Error(`non-regular build input/output: ${rel}`);
    }
  }
  walk(root, '');
  return { sha256: digest(files), files };
}

function resolveCommand(command, env) {
  for (const dir of env.PATH.split(path.delimiter)) {
    const candidate = path.join(dir, command);
    try { fs.accessSync(candidate, fs.constants.X_OK); return fs.realpathSync(candidate); } catch (_) { /* next */ }
  }
  throw new Error(`missing build tool: ${command}`);
}

function buildEnvironment(root) {
  // No credentials, NODE_OPTIONS, NODE_PATH, Git overrides, proxy variables or
  // model-provider configuration reaches this offline, dependency-free build.
  const env = {
    PATH: `${path.dirname(process.execPath)}:/usr/bin:/bin:/usr/sbin:/sbin`,
    HOME: os.homedir(), LANG: 'C', LC_ALL: 'C', TZ: 'UTC',
    GIT_CONFIG_NOSYSTEM: '1', GIT_CONFIG_GLOBAL: '/dev/null', GIT_NO_REPLACE_OBJECTS: '1',
    REQUIRE_COMMITTED_MANIFESTS: '1',
    EVIDENCE_PRESS_THUMBNAIL_DIR: process.env.EVIDENCE_PRESS_THUMBNAIL_DIR || path.join(os.homedir(), 'thumbs'),
    EVIDENCE_PRESS_REQUIRE_CENTRAL_THUMBS: process.env.EVIDENCE_PRESS_REQUIRE_CENTRAL_THUMBS || ''
  };
  const ledger = JSON.parse(fs.readFileSync(path.join(root, 'protocols/PUBLISHED.json'), 'utf8'));
  if (!ledger.source || ledger.source.dirty !== false || !/^[0-9a-f]{40}$/.test(ledger.source.commit || '')) {
    throw new Error('protocol ledger must pin a full clean source commit; retain the A/B seal');
  }
  env.PRODUCTIVITY_PROTOCOLS_SOURCE_COMMIT = ledger.source.commit;
  // The build has no package dependencies. Enforce this for every CommonJS
  // process, including starter replay, instead of trusting mutable node_modules.
  env.NODE_OPTIONS = `--require=${JSON.stringify(path.join(root, 'tools/build-runtime-guard.js'))} --experimental-loader=${JSON.stringify(pathToFileURL(path.join(root, 'tools/build-runtime-loader.mjs')).href)}`;
  return env;
}

function snapshot(root) {
  root = fs.realpathSync(root);
  const env = buildEnvironment(root);
  const git = args => execFileSync(resolveCommand('git', env), args, { cwd: root, env, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  if (fs.realpathSync(git(['rev-parse', '--show-toplevel'])) !== root) throw new Error('build root must be the Git worktree root');
  if (git(['status', '--porcelain=v1', '--untracked-files=all'])) throw new Error('build receipt requires a clean tracked and untracked worktree');
  // Git status can be fooled by assume-unchanged/skip-worktree. Refuse those
  // flags and hash actual files as well as HEAD/tree and effective Git config.
  if (git(['ls-files', '-v']).split('\n').some(line => /^[a-zS] /.test(line))) throw new Error('Git assume-unchanged/skip-worktree flags are unsupported');
  const tracked = git(['ls-files', '--stage']);
  if (tracked.split('\n').some(line => /^160000 /.test(line))) throw new Error('submodules require a separate dependency closure');
  const source = inventory(root, rel => ['.git', 'node_modules', '.wrangler', 'test-results', 'playwright-report'].includes(rel) || rel.endsWith('/node_modules') || generated(rel));
  const tools = {};
  for (const name of ['node', 'git', 'bash', 'sh', 'cp', 'rm', 'dirname']) {
    const file = resolveCommand(name, env);
    tools[name] = { path: file, sha256: sha(fs.readFileSync(file)) };
  }
  if (tools.node.path !== fs.realpathSync(process.execPath)) throw new Error('node executable differs from the receipt runtime');
  const requireCentral = env.EVIDENCE_PRESS_REQUIRE_CENTRAL_THUMBS === '1' ||
    (process.platform === 'darwin' && os.homedir() === '/Users/admin');
  const external = [];
  if (requireCentral) {
    // Match make-thumb --check: extra authoring guides are not release thumbs.
    for (const file of source.files.filter(item => /^papers\/[^/]+\/meta\.json$/.test(item.path))) {
      const slug = file.path.split('/')[1];
      const central = path.join(env.EVIDENCE_PRESS_THUMBNAIL_DIR, `${slug}.jpg`);
      const stat = fs.lstatSync(central);
      if (!stat.isFile() || stat.isSymbolicLink()) throw new Error(`thumbnail is not a regular file: ${central}`);
      external.push({ path: central, bytes: stat.size, sha256: sha(fs.readFileSync(central)) });
    }
  }
  return {
    schemaVersion: VERSION, root, head: git(['rev-parse', 'HEAD']), tree: git(['rev-parse', 'HEAD^{tree}']),
    sourceDate: git(['show', '-s', '--format=%cI', 'HEAD']), shortHead: git(['rev-parse', '--short', 'HEAD']),
    protocolSource: {
      commit: env.PRODUCTIVITY_PROTOCOLS_SOURCE_COMMIT,
      short: git(['rev-parse', '--short', env.PRODUCTIVITY_PROTOCOLS_SOURCE_COMMIT]),
      tree: git(['rev-parse', `${env.PRODUCTIVITY_PROTOCOLS_SOURCE_COMMIT}^{tree}`]),
      date: git(['show', '-s', '--format=%cI', env.PRODUCTIVITY_PROTOCOLS_SOURCE_COMMIT])
    },
    gitConfigSha256: sha(git(['config', '--null', '--list'])), trackedIndexSha256: sha(tracked),
    sourceSha256: source.sha256, environment: env,
    toolchain: { platform: process.platform, arch: process.arch, osRelease: os.release(), versions: process.versions, tools },
    external
  };
}

function outputSnapshot(root) {
  const dist = inventory(path.join(root, 'dist'));
  const protocolDist = inventory(path.join(root, 'protocols/dist'));
  const receipts = [];
  for (const name of fs.readdirSync(path.join(root, 'protocols/protocols')).sort()) {
    const file = path.join(root, 'protocols/protocols', name, 'RECEIPT.json');
    if (fs.existsSync(file)) {
      if (!fs.lstatSync(file).isFile() || fs.lstatSync(file).isSymbolicLink()) throw new Error('generated receipt must be a regular file');
      receipts.push({ path: `protocols/protocols/${name}/RECEIPT.json`, sha256: sha(fs.readFileSync(file)) });
    }
  }
  const repoReceipt = path.join(root, 'protocols/RECEIPT.json');
  if (!fs.lstatSync(repoReceipt).isFile() || fs.lstatSync(repoReceipt).isSymbolicLink()) throw new Error('generated receipt must be a regular file');
  receipts.push({ path: 'protocols/RECEIPT.json', sha256: sha(fs.readFileSync(repoReceipt)) });
  for (const required of ['index.html', 'api/build.json', 'sitemap.xml', 'protocols/index.html', 'protocols/api/protocols.json']) {
    if (!dist.files.some(file => file.path === required && file.sha256)) throw new Error(`composite output missing ${required}`);
  }
  return { dist, protocolDist, receipts };
}

function externalPath(root, file) {
  const absolute = path.resolve(file);
  fs.mkdirSync(path.dirname(absolute), { recursive: true });
  const parent = fs.realpathSync(path.dirname(absolute));
  if (inside(root, parent)) throw new Error('receipts/artifacts must live outside the source worktree');
  if (fs.existsSync(absolute) && fs.lstatSync(absolute).isSymbolicLink()) throw new Error('receipt symlinks are unsupported');
  return path.join(parent, path.basename(absolute));
}

function defaultReceipt(root, input) {
  return path.join(os.tmpdir(), 'evidence-press-builds', sha(root).slice(0, 16), digest(input), 'receipt.json');
}

function readReceipt(file) {
  if (!fs.lstatSync(file).isFile()) throw new Error('receipt must be a regular file');
  const record = JSON.parse(fs.readFileSync(file, 'utf8'));
  const { receiptSha256, ...payload } = record;
  if (record.schemaVersion !== VERSION || receiptSha256 !== digest(payload)) throw new Error('invalid or modified build receipt');
  return record;
}

function verify(root, receiptFile) {
  root = fs.realpathSync(root);
  receiptFile = externalPath(root, receiptFile);
  const receipt = readReceipt(receiptFile);
  if (digest(snapshot(root)) !== receipt.inputSha256 || digest(receipt.input) !== receipt.inputSha256) {
    throw new Error('build inputs changed; prepare and review a new composite artifact');
  }
  const output = outputSnapshot(root);
  if (digest(output) !== digest(receipt.output)) throw new Error('generated output changed after build; reviewed artifact cannot be reused');
  const artifact = path.join(path.dirname(receiptFile), `sha256-${receipt.output.dist.sha256}`);
  if (fs.realpathSync(artifact) !== artifact || inventory(artifact).sha256 !== receipt.output.dist.sha256) {
    throw new Error('content-addressed artifact changed after build');
  }
  return { receipt, receiptFile, artifact };
}

function run(root, env, command, args) {
  const result = spawnSync(command, args, { cwd: root, env, stdio: ['ignore', 2, 2] });
  if (result.error || result.status !== 0) throw new Error(`${command} failed (${result.status}): ${result.error ? result.error.message : 'see gate output'}`);
}

function prepare(root, requestedReceipt) {
  root = fs.realpathSync(root);
  const input = snapshot(root);
  const receiptFile = externalPath(root, requestedReceipt || defaultReceipt(root, input));
  if (fs.existsSync(receiptFile)) return { ...verify(root, receiptFile), reused: true };
  const lock = receiptFile + '.lock';
  fs.mkdirSync(lock); // fail closed on concurrent preparation, never steal locks
  try {
    run(root, input.environment, resolveCommand('bash', input.environment), ['protocols/deploy/integrate.sh']);
    run(root, input.environment, process.execPath, ['protocols/tools/check-release-integrity.js']);
    if (digest(snapshot(root)) !== digest(input)) throw new Error('source/environment changed during the build');
    const output = outputSnapshot(root);
    const artifact = path.join(path.dirname(receiptFile), `sha256-${output.dist.sha256}`);
    if (fs.existsSync(artifact)) throw new Error('unreceipted artifact already exists; choose a fresh receipt path');
    fs.cpSync(path.join(root, 'dist'), artifact, { recursive: true, errorOnExist: true, force: false, dereference: false });
    if (inventory(artifact).sha256 !== output.dist.sha256 || digest(outputSnapshot(root)) !== digest(output)) {
      throw new Error('output changed while preserving artifact');
    }
    // Discourage accidental writes; verification, not permissions, is the gate.
    for (const entry of output.dist.files.filter(item => item.sha256)) fs.chmodSync(path.join(artifact, entry.path), entry.executable ? 0o555 : 0o444);
    const payload = { schemaVersion: VERSION, kind: 'local-composite-build', createdAt: new Date().toISOString(),
      inputSha256: digest(input), input, output,
      gates: ['REQUIRE_COMMITTED_MANIFESTS=1 protocols/deploy/integrate.sh', 'node protocols/tools/check-release-integrity.js'],
      assurance: 'Local build/replay identity only; not CI, browser QA, publication, independent review or scientific validation.' };
    fs.writeFileSync(receiptFile, JSON.stringify({ ...payload, receiptSha256: digest(payload) }, null, 2) + '\n', { flag: 'wx', mode: 0o600 });
    return { ...verify(root, receiptFile), reused: false };
  } finally { fs.rmdirSync(lock); }
}

function deploymentResult(receiptFile, discovery) {
  const receipt = readReceipt(receiptFile);
  if (!['accepted', 'failed'].includes(discovery)) throw new Error('discovery must be accepted or failed');
  // Called only by deploy.sh after every canonical readback succeeded. This
  // operational receipt is outside dist, avoiding a publication self-hash loop.
  const result = { schemaVersion: VERSION, completedAt: new Date().toISOString(), buildReceiptSha256: receipt.receiptSha256,
    artifactSha256: receipt.output.dist.sha256, sourceCommit: receipt.input.head,
    publication: { status: 'canonical-readback-passed', canonical: 'https://evidencepress.org/' },
    discovery: { provider: 'IndexNow', status: discovery, retryCommand: discovery === 'failed' ? 'node tools/indexnow-submit.js' : null } };
  const file = path.join(path.dirname(receiptFile), `deployment-${Date.now()}.json`);
  fs.writeFileSync(file, JSON.stringify(result, null, 2) + '\n', { flag: 'wx', mode: 0o600 });
  return file;
}

function main(argv) {
  const command = argv.shift();
  const options = {};
  while (argv.length) {
    const key = argv.shift();
    if (['--print-receipt', '--print-artifact'].includes(key)) options[key] = true;
    else if (['--receipt', '--discovery'].includes(key) && argv.length) options[key] = argv.shift();
    else throw new Error(`unknown or incomplete argument: ${key}`);
  }
  if (!['prepare', 'verify', 'deployment-result'].includes(command)) throw new Error('usage: build-artifact.js prepare|verify [--receipt /outside/path.json] [--print-receipt|--print-artifact]');
  if (command !== 'prepare' && !options['--receipt']) throw new Error('--receipt is required');
  if (command === 'deployment-result') { console.log(deploymentResult(options['--receipt'], options['--discovery'])); return; }
  const result = command === 'prepare' ? prepare(ROOT, options['--receipt']) : verify(ROOT, options['--receipt']);
  console.error(`build-artifact: ${command === 'verify' ? 'verified' : result.reused ? 'reused (no rebuild)' : 'built and preserved'} ${result.receipt.output.dist.sha256}`);
  console.log(options['--print-receipt'] ? result.receiptFile : options['--print-artifact'] ? result.artifact : JSON.stringify({ receipt: result.receiptFile, artifact: result.artifact, sha256: result.receipt.output.dist.sha256 }));
}

if (require.main === module) {
  try { main(process.argv.slice(2)); }
  catch (error) { console.error(`build-artifact: REFUSED: ${error.message}`); process.exitCode = 1; }
}
module.exports = { prepare, verify, snapshot, inventory, outputSnapshot, deploymentResult, digest, buildEnvironment };
