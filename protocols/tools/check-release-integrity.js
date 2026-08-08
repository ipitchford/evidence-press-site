#!/usr/bin/env node
'use strict';

/*
 * check-release-integrity.js
 *
 * Dependency-free release boundary for the Productivity Protocols static site.
 * It compares dist/ with the reviewed PUBLISHED.json ledger, checks that the
 * registry, pages, machine records, archives, and sitemap agree, and optionally
 * performs exact post-deploy byte readback from an explicit URL base.
 *
 * This program is intentionally read-only. There is no record/update/seal mode.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const childProcess = require('child_process');
const http = require('http');
const https = require('https');

const DEFAULT_ROOT = path.resolve(__dirname, '..');
const SHA256 = /^[0-9a-f]{64}$/;
const FULL_COMMIT = /^[0-9a-f]{40}$/;
const SHORT_COMMIT = /^[0-9a-f]{7,40}$/;
const PROTOCOL_ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const SEMVER = /^[0-9]+\.[0-9]+\.[0-9]+$/;
const SEMVER_WITH_PRERELEASE = /^[0-9]+\.[0-9]+\.[0-9]+(?:-[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?(?:\+[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/;

const ASSURANCE = new Set([
  'DRAFT',
  'STRUCTURE_VALIDATED',
  'EXAMPLE_CONFORMANCE_VALIDATED',
  'TASKSET_PASSED',
  'CROSS_MODEL_REPRODUCED',
  'SECURITY_REVIEWED',
  'FIELD_READY',
  'DEPRECATED'
]);

const EVIDENCE = new Set([
  'NO_IMPACT_EVIDENCE',
  'BENCHMARK_SIGNAL',
  'CONTROLLED_USER_SIGNAL',
  'FIELD_SIGNAL',
  'CAUSAL_EFFECT_SUPPORTED',
  'NO_CLEAR_GAIN',
  'HARM_OR_REGRESSION_FOUND'
]);

// A release ledger necessarily follows the substantive build commit because it
// contains hashes of output that embeds that commit. A later clean commit may
// contain ONLY these controls; any other change makes the build source stale.
const CONTROL_ONLY_PATHS = new Set([
  'PUBLISHED.json',
  'schema/publication-ledger.schema.json',
  'tools/check-release-integrity.js',
  'docs/RELEASE-INTEGRITY.md'
]);

function isControlOnlyPath(rel) {
  return CONTROL_ONLY_PATHS.has(rel) || rel.startsWith('tests/release-integrity/');
}

function usage() {
  return [
    'Usage:',
    '  node tools/check-release-integrity.js [--candidate] [--live URL_BASE]',
    '  node tools/check-release-integrity.js --root PATH [--candidate] [--live URL_BASE]',
    '',
    'Default mode is the production gate: the Git worktree must be clean and the',
    'ledger must identify an exact build commit. --candidate explicitly permits a',
    'dirty or non-Git development source, but does not establish deployable source',
    'provenance. --live performs read-only exact byte readback after offline checks.',
    '',
    'URL_BASE is the mounted section URL, for example:',
    '  https://productivity-protocols.example/'
  ].join('\n');
}

function parseArgs(argv) {
  const out = { root: DEFAULT_ROOT, candidate: false, live: null, help: false };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--candidate') out.candidate = true;
    else if (arg === '--help' || arg === '-h') out.help = true;
    else if (arg === '--root') {
      if (!argv[i + 1]) throw new Error('--root requires a path');
      out.root = path.resolve(argv[++i]);
    } else if (arg.startsWith('--root=')) {
      out.root = path.resolve(arg.slice('--root='.length));
    } else if (arg === '--live') {
      if (!argv[i + 1]) throw new Error('--live requires a URL base');
      out.live = argv[++i];
    } else if (arg.startsWith('--live=')) {
      out.live = arg.slice('--live='.length);
      if (!out.live) throw new Error('--live requires a URL base');
    } else {
      throw new Error(`unknown option ${arg}; this checker has no record or update mode`);
    }
  }
  return out;
}

class Report {
  constructor() {
    this.errors = [];
    this.warnings = [];
  }
  error(message) { this.errors.push(message); }
  warn(message) { this.warnings.push(message); }
  require(condition, message) {
    if (!condition) this.error(message);
    return Boolean(condition);
  }
}

function isObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function exactKeys(value, required, allowed, label, report) {
  if (!isObject(value)) {
    report.error(`${label}: expected object`);
    return false;
  }
  for (const key of required) if (!Object.prototype.hasOwnProperty.call(value, key)) report.error(`${label}: missing ${key}`);
  for (const key of Object.keys(value)) if (!allowed.includes(key)) report.error(`${label}: unknown property ${key}`);
  return true;
}

function canonicalTags(values) {
  return [...new Set((Array.isArray(values) ? values : []).map(String))].sort();
}

function validateCanonicalTags(value, label, report, requireNonEmpty) {
  if (!report.require(Array.isArray(value), `${label}: expected array`)) return;
  report.require(value.every(tag => typeof tag === 'string' && tag.length > 0), `${label}: expected non-empty string tags`);
  if (requireNonEmpty) report.require(value.length > 0, `${label}: expected at least one tag`);
  report.require(stable(value) === stable(canonicalTags(value)), `${label}: tags must be unique and canonically sorted`);
}

function isDateTime(value) {
  return typeof value === 'string' && value.includes('T') && Number.isFinite(Date.parse(value));
}

function isSafeRelativeFile(value) {
  if (typeof value !== 'string' || !value || /[\u0000-\u001f\u007f]/.test(value) || value.includes('\\')) return false;
  if (path.posix.isAbsolute(value) || value.startsWith('./')) return false;
  if (path.posix.normalize(value) !== value) return false;
  return !value.split('/').includes('..') && !value.endsWith('/');
}

function isCanonicalBasePath(value) {
  if (value === '' || value === '/') return true;
  if (typeof value !== 'string' || !value.startsWith('/') || !value.endsWith('/') || value.includes('\\') || value.includes('//') || /[?#]/.test(value)) return false;
  return value.slice(1, -1).split('/').every(segment => segment && segment !== '.' && segment !== '..');
}

function publicPath(basePath, relative) {
  const prefix = basePath ? basePath.replace(/\/$/, '') : '';
  const suffix = String(relative || '').replace(/^\/+/, '');
  return `${prefix}/${suffix}`;
}

function validateFileRef(ref, label, report) {
  if (!exactKeys(ref, ['path', 'sha256', 'bytes'], ['path', 'sha256', 'bytes'], label, report)) return false;
  report.require(isSafeRelativeFile(ref.path), `${label}.path: must be a canonical safe relative file path`);
  report.require(typeof ref.sha256 === 'string' && SHA256.test(ref.sha256), `${label}.sha256: expected 64 lower-case hex characters`);
  report.require(Number.isInteger(ref.bytes) && ref.bytes >= 0, `${label}.bytes: expected a non-negative integer`);
  return true;
}

function validateLedger(ledger, report) {
  const topKeys = [
    '$schema', 'schema_version', 'ledger_id', 'ledger_revision', 'release_status',
    'published_at', 'site', 'source', 'surfaces', 'starter', 'protocols', 'note'
  ];
  if (!exactKeys(ledger, topKeys, topKeys, 'ledger', report)) return;
  report.require(typeof ledger.$schema === 'string' && ledger.$schema.length > 0, 'ledger.$schema: expected a schema reference');
  report.require(ledger.schema_version === '2.0', 'ledger.schema_version: expected 2.0');
  report.require(ledger.ledger_id === 'productivity-protocols', 'ledger.ledger_id: expected productivity-protocols');
  report.require(Number.isInteger(ledger.ledger_revision) && ledger.ledger_revision >= 1, 'ledger.ledger_revision: expected integer >= 1');
  report.require(ledger.release_status === 'candidate' || ledger.release_status === 'published', 'ledger.release_status: expected candidate or published');
  if (ledger.release_status === 'published') report.require(isDateTime(ledger.published_at), 'ledger.published_at: a published ledger requires a date-time');
  if (ledger.release_status === 'candidate') report.require(ledger.published_at === null, 'ledger.published_at: a candidate ledger must use null');
  report.require(typeof ledger.note === 'string' && ledger.note.length >= 20, 'ledger.note: expected an assurance-boundary note of at least 20 characters');

  if (exactKeys(ledger.site, ['base_url', 'base_path'], ['base_url', 'base_path'], 'ledger.site', report)) {
    try {
      const u = new URL(ledger.site.base_url);
      report.require((u.protocol === 'https:' || u.protocol === 'http:') && !u.username && !u.password && !u.search && !u.hash,
        'ledger.site.base_url: expected a plain HTTP(S) origin/base without credentials, query, or fragment');
    } catch {
      report.error('ledger.site.base_url: invalid URL');
    }
    report.require(isCanonicalBasePath(ledger.site.base_path),
      'ledger.site.base_path: expected empty for a root mount, or an absolute path ending in /');
  }

  if (exactKeys(ledger.source, ['commit', 'tree', 'date', 'dirty', 'builder'], ['commit', 'tree', 'date', 'dirty', 'builder'], 'ledger.source', report)) {
    report.require(ledger.source.commit === null || (typeof ledger.source.commit === 'string' && FULL_COMMIT.test(ledger.source.commit)),
      'ledger.source.commit: expected a full lower-case Git commit or null');
    report.require(ledger.source.tree === null || (typeof ledger.source.tree === 'string' && FULL_COMMIT.test(ledger.source.tree)),
      'ledger.source.tree: expected a full lower-case Git tree or null');
    report.require(ledger.source.date === null || isDateTime(ledger.source.date), 'ledger.source.date: expected a date-time or null');
    report.require(ledger.source.dirty === null || typeof ledger.source.dirty === 'boolean', 'ledger.source.dirty: expected boolean or null');
    const nullIdentity = ledger.source.commit === null && ledger.source.tree === null && ledger.source.date === null && ledger.source.dirty === null;
    const gitIdentity = typeof ledger.source.commit === 'string' && typeof ledger.source.tree === 'string' && isDateTime(ledger.source.date) && typeof ledger.source.dirty === 'boolean';
    report.require(nullIdentity || gitIdentity,
      'ledger.source: commit, tree, date, and dirty must describe one complete Git identity or all be null');
    const builderVersion = typeof ledger.source.builder === 'string' && ledger.source.builder.startsWith('build-protocols@')
      ? ledger.source.builder.slice('build-protocols@'.length) : '';
    report.require(SEMVER_WITH_PRERELEASE.test(builderVersion), 'ledger.source.builder: expected build-protocols@<semver>, including an optional prerelease');
  }

  if (exactKeys(ledger.surfaces, ['index', 'registry', 'sitemap'], ['index', 'registry', 'sitemap'], 'ledger.surfaces', report)) {
    validateFileRef(ledger.surfaces.index, 'ledger.surfaces.index', report);
    validateFileRef(ledger.surfaces.registry, 'ledger.surfaces.registry', report);
    validateFileRef(ledger.surfaces.sitemap, 'ledger.surfaces.sitemap', report);
    if (isObject(ledger.surfaces.index)) report.require(ledger.surfaces.index.path === 'index.html', 'ledger.surfaces.index.path: expected index.html');
    if (isObject(ledger.surfaces.registry)) report.require(ledger.surfaces.registry.path === 'api/protocols.json', 'ledger.surfaces.registry.path: expected api/protocols.json');
    if (isObject(ledger.surfaces.sitemap)) report.require(ledger.surfaces.sitemap.path === 'sitemap.xml', 'ledger.surfaces.sitemap.path: expected sitemap.xml');
  }

  if (exactKeys(ledger.starter, ['software_version', 'page', 'archive'], ['software_version', 'page', 'archive'], 'ledger.starter', report)) {
    report.require(typeof ledger.starter.software_version === 'string' && SEMVER_WITH_PRERELEASE.test(ledger.starter.software_version),
      'ledger.starter.software_version: expected semantic version, including optional prerelease');
    validateFileRef(ledger.starter.page, 'ledger.starter.page', report);
    validateFileRef(ledger.starter.archive, 'ledger.starter.archive', report);
    if (isObject(ledger.starter.page)) report.require(ledger.starter.page.path === 'start/index.html', 'ledger.starter.page.path: expected start/index.html');
    if (isObject(ledger.starter.archive) && typeof ledger.starter.software_version === 'string') {
      report.require(ledger.starter.archive.path === `downloads/company-pilot-starter-${ledger.starter.software_version}.tar`,
        'ledger.starter.archive.path: does not match starter software_version');
    }
    const builderVersion = isObject(ledger.source) && typeof ledger.source.builder === 'string' && ledger.source.builder.startsWith('build-protocols@')
      ? ledger.source.builder.slice('build-protocols@'.length) : null;
    if (builderVersion) report.require(ledger.starter.software_version === builderVersion,
      'ledger.starter.software_version: does not equal source builder version');
  }

  if (!Array.isArray(ledger.protocols) || ledger.protocols.length === 0) {
    report.error('ledger.protocols: expected a non-empty array');
    return;
  }
  const ids = new Set();
  const paths = new Set();
  const ordered = [];
  for (let i = 0; i < ledger.protocols.length; i++) {
    const p = ledger.protocols[i];
    const label = `ledger.protocols[${i}]`;
    const keys = ['id', 'version', 'assurance_status', 'productivity_evidence', 'page', 'record', 'archive'];
    if (!exactKeys(p, keys, keys, label, report)) continue;
    report.require(typeof p.id === 'string' && PROTOCOL_ID.test(p.id), `${label}.id: invalid protocol id`);
    report.require(typeof p.version === 'string' && SEMVER.test(p.version), `${label}.version: invalid semantic version`);
    report.require(ASSURANCE.has(p.assurance_status), `${label}.assurance_status: unknown status`);
    report.require(EVIDENCE.has(p.productivity_evidence), `${label}.productivity_evidence: unknown status`);
    if (typeof p.id === 'string') {
      if (ids.has(p.id)) report.error(`${label}.id: duplicate protocol id ${p.id}`);
      ids.add(p.id);
      ordered.push(p.id);
    }
    for (const role of ['page', 'record', 'archive']) {
      validateFileRef(p[role], `${label}.${role}`, report);
      if (isObject(p[role]) && typeof p[role].path === 'string') {
        if (paths.has(p[role].path)) report.error(`${label}.${role}.path: duplicate ledger path ${p[role].path}`);
        paths.add(p[role].path);
      }
    }
    if (typeof p.id === 'string' && typeof p.version === 'string') {
      if (isObject(p.page)) report.require(p.page.path === `p/${p.id}/index.html`, `${label}.page.path: does not match id`);
      if (isObject(p.record)) report.require(p.record.path === `api/${p.id}.json`,
        `${label}.record.path: expected canonical builder route api/${p.id}.json`);
      if (isObject(p.archive)) report.require(p.archive.path === `downloads/${p.id}-${p.version}.tar`, `${label}.archive.path: does not match id/version`);
    }
  }
  const sorted = ordered.slice().sort();
  report.require(ordered.every((id, i) => id === sorted[i]), 'ledger.protocols: entries must be sorted by id');

  if (isObject(ledger.surfaces)) {
    for (const role of ['index', 'registry', 'sitemap']) {
      const ref = ledger.surfaces[role];
      if (isObject(ref) && typeof ref.path === 'string') {
        if (paths.has(ref.path)) report.error(`ledger.surfaces.${role}.path: duplicate ledger path ${ref.path}`);
        paths.add(ref.path);
      }
    }
  }
  if (isObject(ledger.starter)) {
    for (const role of ['page', 'archive']) {
      const ref = ledger.starter[role];
      if (isObject(ref) && typeof ref.path === 'string') {
        if (paths.has(ref.path)) report.error(`ledger.starter.${role}.path: duplicate ledger path ${ref.path}`);
        paths.add(ref.path);
      }
    }
  }
}

function readJson(file, label, report) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (error) {
    report.error(`${label}: cannot read valid JSON (${error.message})`);
    return null;
  }
}

function sha256(buffer) {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

function stable(value) {
  if (Array.isArray(value)) return `[${value.map(stable).join(',')}]`;
  if (isObject(value)) return `{${Object.keys(value).sort().map(k => `${JSON.stringify(k)}:${stable(value[k])}`).join(',')}}`;
  return JSON.stringify(value);
}

function candidateFile(dist, ref, label, report, files) {
  if (!isObject(ref) || !isSafeRelativeFile(ref.path)) return null;
  const distResolved = path.resolve(dist);
  const full = path.resolve(distResolved, ...ref.path.split('/'));
  if (!(full.startsWith(distResolved + path.sep))) {
    report.error(`${label}: path escapes dist/`);
    return null;
  }
  let stat;
  try { stat = fs.lstatSync(full); } catch {
    report.error(`${label}: missing candidate file ${ref.path}`);
    return null;
  }
  if (!stat.isFile() || stat.isSymbolicLink()) {
    report.error(`${label}: ${ref.path} must be a regular non-symlink file`);
    return null;
  }
  try {
    const realDist = fs.realpathSync(distResolved);
    const realFile = fs.realpathSync(full);
    if (!realFile.startsWith(realDist + path.sep)) {
      report.error(`${label}: ${ref.path} resolves outside dist/`);
      return null;
    }
  } catch (error) {
    report.error(`${label}: cannot resolve ${ref.path} (${error.message})`);
    return null;
  }
  const body = fs.readFileSync(full);
  const digest = sha256(body);
  if (body.length !== ref.bytes) report.error(`${label}: byte length mismatch for ${ref.path}; ledger ${ref.bytes}, candidate ${body.length}`);
  if (digest !== ref.sha256) report.error(`${label}: sha256 mismatch for ${ref.path}; ledger ${ref.sha256}, candidate ${digest}`);
  files.set(ref.path, { ref, body, digest });
  return body;
}

function apiV2MirrorPath(canonicalPath) {
  if (canonicalPath === 'api/protocols.json') return 'api/v2/protocols.json';
  if (/^api\/[^/]+\.json$/.test(canonicalPath) && !canonicalPath.endsWith('.schema.json')) {
    return `api/v2/${path.posix.basename(canonicalPath)}`;
  }
  return null;
}

function validateApiV2Mirror(dist, canonicalRef, canonicalBody, label, report, files) {
  if (!canonicalBody || !isObject(canonicalRef)) return;
  const mirrorPath = apiV2MirrorPath(canonicalRef.path);
  if (!mirrorPath) return;
  const mirrorRef = { path: mirrorPath, sha256: canonicalRef.sha256, bytes: canonicalRef.bytes };
  const mirrorBody = candidateFile(dist, mirrorRef, `${label} generated api/v2 mirror`, report, files);
  if (mirrorBody && !mirrorBody.equals(canonicalBody)) report.error(`${label}: generated api/v2 mirror bytes differ from ledgered canonical artifact`);
}

function validateAllApiV2Mirrors(dist, report) {
  const api = path.join(dist, 'api');
  const v2 = path.join(api, 'v2');
  let canonicalNames = [];
  let mirrorNames = [];
  try {
    canonicalNames = fs.readdirSync(api, { withFileTypes: true })
      .filter(entry => entry.isFile() && entry.name.endsWith('.json'))
      .map(entry => entry.name).sort();
    mirrorNames = fs.readdirSync(v2, { withFileTypes: true })
      .filter(entry => entry.isFile() && entry.name.endsWith('.json'))
      .map(entry => entry.name).sort();
  } catch (error) {
    report.error(`generated api/v2 mirrors: cannot enumerate API files (${error.message})`);
    return;
  }
  sameMembers(mirrorNames, canonicalNames, 'generated api/v2 mirror inventory', report);
  for (const name of canonicalNames.filter(value => mirrorNames.includes(value))) {
    const canonicalBody = fs.readFileSync(path.join(api, name));
    const mirrorBody = fs.readFileSync(path.join(v2, name));
    if (!canonicalBody.equals(mirrorBody)) report.error(`generated api/v2 mirror differs from api/${name}`);
  }
}

function git(root, args, options) {
  options = options || {};
  try {
    return childProcess.execFileSync('git', ['-C', root, ...args], {
      encoding: options.encoding === null ? null : 'utf8',
      stdio: ['ignore', 'pipe', 'pipe']
    });
  } catch (error) {
    return null;
  }
}

function validateSource(root, ledger, candidateMode, report) {
  const source = isObject(ledger.source) ? ledger.source : {};
  const topRaw = git(root, ['rev-parse', '--show-toplevel']);
  if (topRaw === null) {
    if (candidateMode) {
      report.warn('DIRTY CANDIDATE: source is not a Git worktree; deployable provenance is not established');
      report.require(source.commit === null && source.tree === null && source.date === null && source.dirty === null,
        'non-Git candidate source must record null commit, tree, date, and dirty provenance');
    }
    else report.error('production source is ambiguous: root is not a Git worktree (use --candidate only for development)');
    return;
  }
  const top = topRaw.trim();
  let rootReal = root;
  let topReal = top;
  try { rootReal = fs.realpathSync(root); topReal = fs.realpathSync(top); } catch { /* reported through equality */ }
  const rootPrefixNative = path.relative(topReal, rootReal);
  const rootInsideWorktree = rootPrefixNative === '' ||
    (!path.isAbsolute(rootPrefixNative) && rootPrefixNative !== '..' && !rootPrefixNative.startsWith('..' + path.sep));
  report.require(rootInsideWorktree, `production source is ambiguous: --root ${root} is outside the Git worktree root ${top}`);
  const rootPrefix = rootPrefixNative.split(path.sep).join('/');
  if (rootPrefix) {
    report.require(
      fs.existsSync(path.join(rootReal, 'site.config.json')) &&
      fs.existsSync(path.join(rootReal, 'schema', 'publication-ledger.schema.json')),
      `production source is ambiguous: nested --root ${root} is not a Productivity Protocols source root`
    );
  }

  const headRaw = git(root, ['rev-parse', '--verify', 'HEAD^{commit}']);
  const head = headRaw && headRaw.trim();
  if (!head || !FULL_COMMIT.test(head)) report.error('source: cannot resolve an exact Git HEAD commit');

  const status = git(root, ['status', '--porcelain=v1', '-z', '--untracked-files=all'], { encoding: null });
  if (status === null) report.error('source: cannot inspect Git worktree status');
  else if (status.length) {
    if (candidateMode) report.warn('DIRTY CANDIDATE: Git worktree has tracked or untracked changes; output is not production-authorised');
    else report.error('production source is dirty; commit or remove every tracked/untracked change, then rebuild (or use --candidate only for development)');
  }

  if (!candidateMode) report.require(source.dirty === false,
    'production source is not clean in the ledger: ledger.source.dirty must be false');
  else if (source.dirty === true) report.warn('DIRTY CANDIDATE: ledger and registry explicitly describe a build from a dirty source tree');
  if (!source.commit) {
    if (candidateMode) report.warn('DIRTY CANDIDATE: ledger has no exact source commit');
    else report.error('production source is ambiguous: ledger.source.commit is null');
    return;
  }

  const object = git(root, ['rev-parse', '--verify', `${source.commit}^{commit}`]);
  if (!object || object.trim() !== source.commit) {
    report.error(`source: ledger commit ${source.commit} is not an available exact commit`);
    return;
  }
  const dateRaw = git(root, ['show', '-s', '--format=%cI', source.commit]);
  if (!dateRaw || dateRaw.trim() !== source.date) {
      report.error(`source: ledger date ${source.date} does not equal commit ${source.commit} committer date ${dateRaw ? dateRaw.trim() : '(unavailable)'}`);
  }
  const treeRaw = git(root, ['rev-parse', '--verify', `${source.commit}^{tree}`]);
  if (!treeRaw || treeRaw.trim() !== source.tree) {
    report.error(`source: ledger tree ${source.tree} does not equal commit ${source.commit} tree ${treeRaw ? treeRaw.trim() : '(unavailable)'}`);
  }

  if (!candidateMode && head) {
    const ancestor = git(root, ['merge-base', '--is-ancestor', source.commit, head]);
    if (ancestor === null) {
      report.error(`production source is ambiguous: ledger commit ${source.commit} is not an ancestor of HEAD ${head}`);
    } else {
      const changedRaw = git(root, ['diff', '--name-only', '-z', '--diff-filter=ACDMRTUXB', `${source.commit}..${head}`], { encoding: null });
      if (changedRaw === null) report.error('source: cannot inspect changes after the build commit');
      else {
        const changed = changedRaw.toString('utf8').split('\0').filter(Boolean);
        const substantive = changed.filter(rel => {
          if (!rootPrefix) return !isControlOnlyPath(rel);
          if (!rel.startsWith(rootPrefix + '/')) return true;
          return !isControlOnlyPath(rel.slice(rootPrefix.length + 1));
        });
        if (substantive.length) {
          report.error(`production source is stale: substantive files changed after build commit ${source.commit}: ${substantive.join(', ')}`);
        }
      }
    }
  }
}

function validateRegistry(registry, ledger, candidateMode, report) {
  if (!isObject(registry)) return [];
  const topRequired = ['schema_version', 'site', 'baseUrl', 'generated', 'count', 'protocols'];
  const topAllowed = [...topRequired, 'description', 'schema'];
  exactKeys(registry, topRequired, topAllowed, 'registry', report);
  report.require(registry.schema_version === ledger.schema_version,
    `registry.schema_version: expected ledger schema version ${ledger.schema_version}`);
  report.require(registry.site === 'Productivity Protocols', 'registry.site: expected Productivity Protocols');
  if (isObject(ledger.site)) {
    report.require(registry.baseUrl === ledger.site.base_url.replace(/\/$/, ''), 'registry.baseUrl: does not match ledger site base_url');
  }
  report.require(Number.isInteger(registry.count) && registry.count >= 0, 'registry.count: expected a non-negative integer');
  report.require(Array.isArray(registry.protocols), 'registry.protocols: expected array');
  if (!Array.isArray(registry.protocols)) return [];
  report.require(registry.count === registry.protocols.length, `registry.count: ${registry.count} does not equal protocols length ${registry.protocols.length}`);
  report.require(Array.isArray(ledger.protocols) && registry.protocols.length === ledger.protocols.length,
    `registry: protocol count ${registry.protocols.length} does not equal ledger count ${Array.isArray(ledger.protocols) ? ledger.protocols.length : 0}`);

  const generatedKeys = ['sourceCommit', 'sourceDate', 'builder', 'source_commit_full', 'source_tree', 'dirty'];
  if (exactKeys(registry.generated, generatedKeys, generatedKeys, 'registry.generated', report)) {
    const source = isObject(ledger.source) ? ledger.source : {};
    if (source.commit === null) {
      report.require(registry.generated.sourceCommit === null, 'registry.generated.sourceCommit: expected null for a non-Git ledger source');
    } else {
      report.require(typeof registry.generated.sourceCommit === 'string' && SHORT_COMMIT.test(registry.generated.sourceCommit) && source.commit.startsWith(registry.generated.sourceCommit),
        'registry.generated.sourceCommit: does not identify ledger.source.commit');
    }
    report.require(registry.generated.sourceDate === source.date, 'registry.generated.sourceDate: does not equal ledger.source.date');
    report.require(registry.generated.builder === source.builder, 'registry.generated.builder: does not equal ledger.source.builder');
    report.require(registry.generated.source_commit_full === source.commit,
      'registry.generated.source_commit_full: does not equal ledger.source.commit');
    report.require(registry.generated.source_tree === source.tree,
      'registry.generated.source_tree: does not equal ledger.source.tree');
    report.require(registry.generated.dirty === source.dirty,
      'registry.generated.dirty: does not equal ledger.source.dirty');
    report.require(registry.generated.source_commit_full === null || (typeof registry.generated.source_commit_full === 'string' && FULL_COMMIT.test(registry.generated.source_commit_full)),
      'registry.generated.source_commit_full: expected full lower-case commit or null');
    report.require(registry.generated.source_tree === null || (typeof registry.generated.source_tree === 'string' && FULL_COMMIT.test(registry.generated.source_tree)),
      'registry.generated.source_tree: expected full lower-case tree or null');
    report.require(registry.generated.dirty === null || typeof registry.generated.dirty === 'boolean',
      'registry.generated.dirty: expected boolean or null');
    if (!candidateMode) report.require(registry.generated.dirty === false,
      'registry.generated.dirty: production registry must report a clean build');
  }

  const ids = new Set();
  const ordered = [];
  const allowed = [
    'id', 'version', 'title', 'purpose', 'assurance_level', 'risk_class', 'privacy_class',
    'assurance_status', 'productivity_evidence', 'tested_models', 'last_verified',
    'task_tags', 'audience_tags', 'required_tool_tags', 'optional_tool_tags',
    'network_required', 'url', 'skill_download', 'skill_sha256', 'skill_bytes', 'download', 'sha256'
  ];
  const required = [
    'id', 'version', 'title', 'purpose', 'assurance_level', 'risk_class', 'privacy_class',
    'assurance_status', 'productivity_evidence', 'task_tags', 'audience_tags',
    'required_tool_tags', 'optional_tool_tags', 'network_required', 'url',
    'skill_download', 'skill_sha256', 'skill_bytes', 'download', 'sha256'
  ];
  for (let i = 0; i < registry.protocols.length; i++) {
    const p = registry.protocols[i];
    const label = `registry.protocols[${i}]`;
    if (!exactKeys(p, required, allowed, label, report)) continue;
    report.require(typeof p.id === 'string' && PROTOCOL_ID.test(p.id), `${label}.id: invalid protocol id`);
    report.require(typeof p.version === 'string' && SEMVER.test(p.version), `${label}.version: invalid semantic version`);
    report.require(ASSURANCE.has(p.assurance_status), `${label}.assurance_status: unknown status`);
    report.require(EVIDENCE.has(p.productivity_evidence), `${label}.productivity_evidence: unknown status`);
    validateCanonicalTags(p.task_tags, `${label}.task_tags`, report, true);
    validateCanonicalTags(p.audience_tags, `${label}.audience_tags`, report, true);
    validateCanonicalTags(p.required_tool_tags, `${label}.required_tool_tags`, report, false);
    validateCanonicalTags(p.optional_tool_tags, `${label}.optional_tool_tags`, report, false);
    report.require(typeof p.network_required === 'boolean', `${label}.network_required: expected boolean`);
    report.require(typeof p.skill_sha256 === 'string' && SHA256.test(p.skill_sha256), `${label}.skill_sha256: invalid skill archive hash`);
    report.require(Number.isInteger(p.skill_bytes) && p.skill_bytes > 0, `${label}.skill_bytes: expected positive integer`);
    report.require(typeof p.sha256 === 'string' && SHA256.test(p.sha256), `${label}.sha256: invalid archive hash`);
    if (typeof p.id === 'string') {
      if (ids.has(p.id)) report.error(`${label}.id: duplicate registry id ${p.id}`);
      ids.add(p.id);
      ordered.push(p.id);
    }
    const l = Array.isArray(ledger.protocols) ? ledger.protocols.find(x => isObject(x) && x.id === p.id) : null;
    if (!l) {
      report.error(`${label}: ${p.id} is not recorded in the ledger`);
      continue;
    }
    for (const field of ['version', 'assurance_status', 'productivity_evidence']) {
      report.require(p[field] === l[field], `${label}.${field}: registry ${p[field]} does not equal immutable ledger value ${l[field]}`);
    }
    const basePath = isObject(ledger.site) ? ledger.site.base_path : '';
    report.require(p.url === publicPath(basePath, `p/${p.id}/`), `${label}.url: expected ${publicPath(basePath, `p/${p.id}/`)}`);
    report.require(p.skill_download === publicPath(basePath, `downloads/${p.id}-${p.version}-skill.tar`), `${label}.skill_download: expected canonical skill archive URL`);
    report.require(p.download === publicPath(basePath, `downloads/${p.id}-${p.version}.tar`), `${label}.download: expected canonical archive URL`);
    if (isObject(l.archive)) report.require(p.sha256 === l.archive.sha256, `${label}.sha256: does not equal ledger archive hash`);
  }
  const sorted = ordered.slice().sort();
  report.require(ordered.every((id, i) => id === sorted[i]), 'registry.protocols: entries must be sorted by id');
  return registry.protocols;
}

function tarString(block, offset, length) {
  const raw = block.subarray(offset, offset + length);
  const nul = raw.indexOf(0);
  return raw.subarray(0, nul === -1 ? raw.length : nul).toString('utf8');
}

function tarOctal(block, offset, length) {
  const value = tarString(block, offset, length).trim();
  if (!/^[0-7]+$/.test(value)) return null;
  return Number.parseInt(value, 8);
}

function isZeroBlock(block) {
  for (const byte of block) if (byte !== 0) return false;
  return true;
}

function parseTar(buffer, label, report) {
  const entries = [];
  if (buffer.length % 512 !== 0) {
    report.error(`${label}: archive length is not a multiple of 512 bytes`);
    return entries;
  }
  let offset = 0;
  let zeroBlocks = 0;
  let ended = false;
  while (offset + 512 <= buffer.length) {
    const header = buffer.subarray(offset, offset + 512);
    if (isZeroBlock(header)) {
      zeroBlocks++;
      offset += 512;
      if (zeroBlocks === 2) { ended = true; break; }
      continue;
    }
    if (zeroBlocks) {
      report.error(`${label}: non-zero tar header follows a zero terminator block`);
      return entries;
    }
    const baseName = tarString(header, 0, 100);
    const namePrefix = tarString(header, 345, 155);
    const name = namePrefix ? `${namePrefix}/${baseName}` : baseName;
    const size = tarOctal(header, 124, 12);
    const mtime = tarOctal(header, 136, 12);
    const storedChecksum = tarOctal(header, 148, 8);
    const type = header[156];
    const magic = header.subarray(257, 263).toString('binary');
    let computedChecksum = 0;
    for (let i = 0; i < 512; i++) computedChecksum += (i >= 148 && i < 156) ? 32 : header[i];
    if (!name || size === null || mtime === null || storedChecksum === null) {
      report.error(`${label}: malformed tar header at byte ${offset}`);
      return entries;
    }
    if (storedChecksum !== computedChecksum) report.error(`${label}: invalid tar header checksum for ${name}`);
    if (magic !== 'ustar\0') report.error(`${label}: ${name} is not in the expected POSIX ustar format`);
    if (type !== 0 && type !== 48) report.error(`${label}: ${name} is not a regular-file tar entry`);
    const start = offset + 512;
    const end = start + size;
    if (!Number.isSafeInteger(size) || end > buffer.length) {
      report.error(`${label}: truncated tar entry ${name}`);
      return entries;
    }
    const paddedEnd = start + Math.ceil(size / 512) * 512;
    if (paddedEnd > buffer.length) {
      report.error(`${label}: truncated padding for tar entry ${name}`);
      return entries;
    }
    for (let i = end; i < paddedEnd; i++) if (buffer[i] !== 0) {
      report.error(`${label}: non-zero padding for tar entry ${name}`);
      break;
    }
    entries.push({ name, size, mtime, body: buffer.subarray(start, end) });
    offset = paddedEnd;
  }
  if (!ended) report.error(`${label}: tar archive lacks two zero terminator blocks`);
  for (let i = offset; i < buffer.length; i++) if (buffer[i] !== 0) {
    report.error(`${label}: tar archive has non-zero trailing bytes`);
    break;
  }
  const names = entries.map(e => e.name);
  const sorted = names.slice().sort();
  report.require(names.every((name, i) => name === sorted[i]), `${label}: tar entries are not deterministically sorted`);
  report.require(new Set(names).size === names.length, `${label}: tar contains duplicate entry names`);
  return entries;
}

function validateArchive(buffer, ledgerProtocol, record, sourceDate, label, report) {
  if (!buffer) return;
  const entries = parseTar(buffer, label, report);
  const expectedMtime = sourceDate ? Math.floor(new Date(sourceDate).getTime() / 1000) : 0;
  for (const entry of entries) {
    if (entry.mtime !== expectedMtime) report.error(`${label}: ${entry.name} mtime ${entry.mtime} does not equal source epoch ${expectedMtime}`);
  }
  const manifestName = `${ledgerProtocol.id}/MANIFEST.json`;
  const receiptName = `${ledgerProtocol.id}/RECEIPT.json`;
  const manifestEntry = entries.find(e => e.name === manifestName);
  if (!manifestEntry) {
    report.error(`${label}: missing ${manifestName}`);
    return;
  }
  let manifest;
  try { manifest = JSON.parse(manifestEntry.body.toString('utf8')); }
  catch (error) {
    report.error(`${label}: archive MANIFEST.json is invalid JSON (${error.message})`);
    return;
  }
  if (!isObject(manifest)) {
    report.error(`${label}: archive MANIFEST.json must be an object`);
    return;
  }
  report.require(manifest.pack_id === ledgerProtocol.id, `${label}: manifest pack_id does not equal ledger id`);
  report.require(manifest.version === ledgerProtocol.version, `${label}: manifest version does not equal ledger version`);
  report.require(Array.isArray(manifest.files) && manifest.files.length > 0, `${label}: manifest files must be a non-empty array`);
  if (isObject(record) && isObject(record.manifest)) {
    report.require(stable(record.manifest) === stable(manifest), `${label}: archive manifest does not equal the public machine-record manifest`);
  }
  const receiptEntry = entries.find(e => e.name === receiptName);
  if (!receiptEntry) report.error(`${label}: missing ${receiptName}`);
  else {
    let receipt = null;
    try { receipt = JSON.parse(receiptEntry.body.toString('utf8')); }
    catch (error) { report.error(`${label}: archive RECEIPT.json is invalid JSON (${error.message})`); }
    if (isObject(receipt)) {
      report.require(receipt.scope === 'protocol', `${label}: receipt scope is not protocol`);
      report.require(receipt.subject_id === ledgerProtocol.id, `${label}: receipt subject_id does not equal ledger id`);
      report.require(receipt.version === ledgerProtocol.version, `${label}: receipt version does not equal ledger version`);
      report.require(receipt.assurance_status === ledgerProtocol.assurance_status, `${label}: receipt assurance_status does not equal ledger status`);
      report.require(receipt.productivity_evidence === ledgerProtocol.productivity_evidence, `${label}: receipt productivity_evidence does not equal ledger status`);
      if (isObject(record)) {
        report.require(receipt.assurance_status === record.achieved_assurance_status,
          `${label}: receipt assurance_status does not equal public record.achieved_assurance_status`);
      }
      if (!Array.isArray(receipt.files_sha256)) report.error(`${label}: receipt files_sha256 must be an array`);
      else {
        const receiptFiles = receipt.files_sha256.map(file => isObject(file) ? { path: file.path, sha256: file.sha256 } : file);
        const manifestFiles = Array.isArray(manifest.files)
          ? manifest.files.map(file => isObject(file) ? { path: file.path, sha256: file.sha256 } : file)
          : [];
        report.require(stable(receiptFiles) === stable(manifestFiles),
          `${label}: receipt files_sha256 does not equal the manifest path/hash inventory`);
      }
    }
  }
  if (!Array.isArray(manifest.files)) return;

  const listed = [];
  const seen = new Set();
  for (let i = 0; i < manifest.files.length; i++) {
    const f = manifest.files[i];
    const itemLabel = `${label}: manifest.files[${i}]`;
    if (!isObject(f)) { report.error(`${itemLabel} must be an object`); continue; }
    if (!isSafeRelativeFile(f.path)) { report.error(`${itemLabel}.path is unsafe`); continue; }
    if (seen.has(f.path)) report.error(`${itemLabel}.path duplicates ${f.path}`);
    seen.add(f.path);
    listed.push(f.path);
    const entryName = `${ledgerProtocol.id}/${f.path}`;
    const entry = entries.find(e => e.name === entryName);
    if (!entry) { report.error(`${label}: manifest-listed archive entry missing: ${entryName}`); continue; }
    if (!Number.isInteger(f.bytes) || f.bytes !== entry.body.length) report.error(`${label}: ${entryName} byte length does not match manifest`);
    if (typeof f.sha256 !== 'string' || f.sha256 !== sha256(entry.body)) report.error(`${label}: ${entryName} sha256 does not match manifest`);
  }
  const sorted = listed.slice().sort();
  report.require(listed.every((name, i) => name === sorted[i]), `${label}: manifest files are not sorted`);
  report.require(!seen.has('RECEIPT.json'), `${label}: RECEIPT.json must remain outside MANIFEST.json to avoid a circular receipt`);
  const expectedEntries = new Set([manifestName, receiptName, ...listed.map(p => `${ledgerProtocol.id}/${p}`)]);
  for (const entry of entries) if (!expectedEntries.has(entry.name)) report.error(`${label}: unmanifested archive entry ${entry.name}`);
  for (const name of expectedEntries) if (!entries.some(e => e.name === name)) report.error(`${label}: expected archive entry missing: ${name}`);
}

function validateSkillArchive(buffer, ledgerProtocol, record, sourceDate, label, report) {
  if (!buffer) return;
  const entries = parseTar(buffer, label, report);
  const expectedMtime = sourceDate ? Math.floor(new Date(sourceDate).getTime() / 1000) : 0;
  const manifest = isObject(record) && isObject(record.manifest) && Array.isArray(record.manifest.files)
    ? record.manifest : null;
  if (!manifest) {
    report.error(`${label}: public record manifest is unavailable`);
    return;
  }
  const selected = manifest.files.filter(file => isObject(file) &&
    (['LICENSE', 'README.md', 'SKILL.md'].includes(file.path)
      || /^(assets|examples|references|scripts|tests)\//.test(file.path)));
  report.require(selected.some(file => file.path === 'LICENSE'), `${label}: manifest projection lacks LICENSE`);
  report.require(selected.some(file => file.path === 'README.md'), `${label}: manifest projection lacks README.md`);
  report.require(selected.some(file => file.path === 'SKILL.md'), `${label}: manifest projection lacks SKILL.md`);
  report.require(selected.some(file => file.path.startsWith('assets/')), `${label}: manifest projection lacks templates/assets`);
  report.require(selected.some(file => file.path.startsWith('examples/')), `${label}: manifest projection lacks examples`);
  report.require(selected.some(file => file.path.startsWith('tests/')), `${label}: manifest projection lacks tests`);
  const expected = new Set(selected.map(file => `${ledgerProtocol.id}/${file.path}`));
  for (const entry of entries) {
    report.require(entry.mtime === expectedMtime, `${label}: ${entry.name} mtime ${entry.mtime} does not equal source epoch ${expectedMtime}`);
    if (!expected.has(entry.name)) report.error(`${label}: unexpected skill-edition entry ${entry.name}`);
  }
  for (const file of selected) {
    const name = `${ledgerProtocol.id}/${file.path}`;
    const entry = entries.find(candidate => candidate.name === name);
    if (!entry) { report.error(`${label}: expected skill-edition entry missing: ${name}`); continue; }
    report.require(entry.body.length === file.bytes, `${label}: ${name} byte length does not match record manifest`);
    report.require(sha256(entry.body) === file.sha256, `${label}: ${name} sha256 does not match record manifest`);
  }
  report.require(entries.length === expected.size, `${label}: skill-edition inventory does not equal its record-manifest projection`);
}

function walkRegularFiles(dir, base, label, report) {
  const out = [];
  let entries;
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); }
  catch (error) { report.error(`${label}: cannot read generated file mirror (${error.message})`); return out; }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walkRegularFiles(full, base, label, report));
    else if (entry.isFile()) out.push(path.relative(base, full).split(path.sep).join('/'));
    else report.error(`${label}: generated file mirror contains a non-regular entry ${path.relative(base, full)}`);
  }
  return out.sort();
}

function validateStarterArchive(buffer, starter, pageBody, indexText, dist, sourceDate, basePath, report) {
  const label = 'company starter archive';
  if (!buffer) return;
  const entries = parseTar(buffer, label, report);
  const expectedMtime = sourceDate ? Math.floor(new Date(sourceDate).getTime() / 1000) : 0;
  const prefix = 'productivity-protocols-starter/';
  const relativeNames = [];
  report.require(entries.length >= 2, `${label}: expected a multi-file kit, found ${entries.length} file${entries.length === 1 ? '' : 's'}`);
  for (const entry of entries) {
    if (entry.mtime !== expectedMtime) report.error(`${label}: ${entry.name} mtime ${entry.mtime} does not equal source epoch ${expectedMtime}`);
    if (!isSafeRelativeFile(entry.name)) {
      report.error(`${label}: unsafe or non-canonical tar path ${entry.name}`);
      continue;
    }
    if (!entry.name.startsWith(prefix)) {
      report.error(`${label}: tar entry is outside the single starter root: ${entry.name}`);
      continue;
    }
    const relative = entry.name.slice(prefix.length);
    if (!isSafeRelativeFile(relative)) {
      report.error(`${label}: unsafe starter relative path ${relative}`);
      continue;
    }
    relativeNames.push(relative);
  }
  const requiredStarterFiles = [
    'LICENSE', 'company-pilot/LICENSE', 'company-pilot/README.md',
    'company-pilot/DESIGN-AND-ANALYSIS.md',
    'tools/pilot-randomize.js', 'tools/pilot-summary.js', 'tools/pilot-tests.js',
    'tools/pilot-validate.js', 'tools/lib/jsonschema.js', 'tools/lib/util.js',
    'schema/pilot-assignment.schema.json', 'schema/pilot-follow-up.schema.json',
    'schema/pilot-observations.schema.json', 'schema/pilot-plan.schema.json',
    'schema/pilot-task-bank.schema.json',
    'protocols/document-to-action-plan/adapters/generic-chat/prompt.md'
  ];
  for (const required of requiredStarterFiles) {
    report.require(relativeNames.includes(required), `${label}: missing ${required}`);
  }

  const mirrorRoot = path.join(dist, 'start', 'files');
  const mirrorNames = fs.existsSync(mirrorRoot) ? walkRegularFiles(mirrorRoot, mirrorRoot, label, report) : [];
  if (!fs.existsSync(mirrorRoot)) report.error(`${label}: generated start/files mirror is missing`);
  sameMembers(mirrorNames, relativeNames, `${label} generated file mirrors`, report);
  for (const entry of entries) {
    if (!entry.name.startsWith(prefix)) continue;
    const relative = entry.name.slice(prefix.length);
    if (!isSafeRelativeFile(relative)) continue;
    const mirror = path.join(mirrorRoot, ...relative.split('/'));
    if (!fs.existsSync(mirror) || !fs.statSync(mirror).isFile()) continue;
    const mirrorBody = fs.readFileSync(mirror);
    if (!mirrorBody.equals(entry.body)) report.error(`${label}: generated file mirror differs from archive entry ${relative}`);
  }

  const archiveUrl = publicPath(basePath, starter.archive.path);
  if (pageBody) {
    const page = pageBody.toString('utf8');
    report.require(page.includes(archiveUrl), `company starter page: missing archive URL ${archiveUrl}`);
    report.require(page.includes(starter.archive.sha256), 'company starter page: missing ledgered archive sha256');
    report.require(page.includes(String(starter.archive.bytes)), 'company starter page: missing ledgered archive byte length');
    report.require(page.includes(`${entries.length} local files`), 'company starter page: archive file count does not match tar inventory');
    for (const required of [
      'LICENSE', 'company-pilot/README.md', 'company-pilot/DESIGN-AND-ANALYSIS.md',
      'tools/pilot-validate.js', 'schema/pilot-plan.schema.json',
      'protocols/document-to-action-plan/adapters/generic-chat/prompt.md'
    ]) {
      const url = publicPath(basePath, `start/files/${required}`);
      report.require(page.includes(url), `company starter page: missing generated file link ${url}`);
    }
  }
  report.require(indexText.includes(publicPath(basePath, 'start/')), 'index page: missing company starter page URL');
}

function listProtocolInventory(dist, report) {
  function names(dir, select) {
    try { return fs.readdirSync(path.join(dist, dir), { withFileTypes: true }).filter(select).map(e => e.name).sort(); }
    catch (error) { report.error(`candidate inventory: cannot read dist/${dir}/ (${error.message})`); return []; }
  }
  const pageIds = names('p', e => e.isDirectory());
  const archives = names('downloads', e => e.isFile() && e.name.endsWith('.tar'));
  const records = [];
  function walkApi(dir, rel) {
    let entries;
    try { entries = fs.readdirSync(dir, { withFileTypes: true }); }
    catch (error) { report.error(`candidate inventory: cannot read ${path.relative(dist, dir)}/ (${error.message})`); return; }
    for (const entry of entries) {
      const childRel = rel ? `${rel}/${entry.name}` : entry.name;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walkApi(full, childRel);
      else if (entry.isFile() && entry.name.endsWith('.json') && !childRel.startsWith('v2/') && childRel !== 'protocols.json' && !entry.name.endsWith('.schema.json')) {
        records.push(`api/${childRel}`);
      }
    }
  }
  walkApi(path.join(dist, 'api'), '');
  records.sort();
  return { pageIds, archives, records };
}

function sameMembers(actual, expected, label, report) {
  const a = actual.slice().sort();
  const e = expected.slice().sort();
  const missing = e.filter(x => !a.includes(x));
  const extra = a.filter(x => !e.includes(x));
  if (missing.length) report.error(`${label}: missing ${missing.join(', ')}`);
  if (extra.length) report.error(`${label}: unledgered extra ${extra.join(', ')}`);
}

function rejectSymlinks(dir, base, report) {
  let entries;
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); }
  catch (error) { report.error(`candidate inventory: cannot read ${path.relative(base, dir) || 'dist'}/ (${error.message})`); return; }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    const rel = path.relative(base, full).split(path.sep).join('/');
    if (entry.isSymbolicLink()) report.error(`candidate inventory: symlink is not publishable: ${rel}`);
    else if (entry.isDirectory()) rejectSymlinks(full, base, report);
  }
}

function decodeXml(value) {
  return value.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
}

function validateSitemap(buffer, ledger, report) {
  if (!buffer || !isObject(ledger.site) || !Array.isArray(ledger.protocols)) return;
  const xml = buffer.toString('utf8');
  report.require(/<urlset\b/.test(xml) && /<\/urlset>/.test(xml), 'sitemap: expected a complete urlset document');
  const actual = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => decodeXml(m[1].trim()));
  const base = ledger.site.base_url.replace(/\/$/, '');
  const mount = ledger.site.base_path;
  const expected = [
    `${base}${publicPath(mount, '')}`,
    `${base}${publicPath(mount, 'start/')}`,
    `${base}${publicPath(mount, 'kernel/')}`,
    `${base}${publicPath(mount, 'status/')}`,
    ...ledger.protocols.map(p => `${base}${publicPath(mount, `p/${p.id}/`)}`)
  ];
  report.require(new Set(actual).size === actual.length, 'sitemap: duplicate <loc> values');
  sameMembers(actual, expected, 'sitemap URLs', report);
}

function validateCandidate(root, ledger, candidateMode, report) {
  const dist = path.join(root, 'dist');
  if (!fs.existsSync(dist) || !fs.statSync(dist).isDirectory()) {
    report.error('candidate dist/ does not exist; run `node build-protocols.js` after the substantive source commit');
    return { files: new Map(), registry: null };
  }
  rejectSymlinks(dist, dist, report);
  validateAllApiV2Mirrors(dist, report);
  const files = new Map();
  const surfaceBodies = {};
  if (isObject(ledger.surfaces)) {
    for (const role of ['index', 'registry', 'sitemap']) {
      if (isObject(ledger.surfaces[role])) surfaceBodies[role] = candidateFile(dist, ledger.surfaces[role], `surface ${role}`, report, files);
    }
  }
  let registry = null;
  if (surfaceBodies.registry) {
    try { registry = JSON.parse(surfaceBodies.registry.toString('utf8')); }
    catch (error) { report.error(`registry: invalid JSON (${error.message})`); }
    if (isObject(ledger.surfaces) && isObject(ledger.surfaces.registry)) {
      validateApiV2Mirror(dist, ledger.surfaces.registry, surfaceBodies.registry, 'registry', report, files);
    }
  }
  const registryEntries = validateRegistry(registry, ledger, candidateMode, report);
  const registryById = new Map(registryEntries.filter(isObject).map(p => [p.id, p]));

  const indexText = surfaceBodies.index ? surfaceBodies.index.toString('utf8') : '';
  const sourceDate = isObject(ledger.source) && ledger.source.date
    ? ledger.source.date
    : (candidateMode && isObject(registry) && isObject(registry.generated) ? registry.generated.sourceDate : null);
  if (isObject(ledger.starter)) {
    const starterPage = candidateFile(dist, ledger.starter.page, 'company starter page', report, files);
    const starterArchive = candidateFile(dist, ledger.starter.archive, 'company starter archive', report, files);
    validateStarterArchive(
      starterArchive,
      ledger.starter,
      starterPage,
      indexText,
      dist,
      sourceDate,
      isObject(ledger.site) ? ledger.site.base_path : '',
      report
    );
  }
  if (Array.isArray(ledger.protocols)) {
    for (const p of ledger.protocols) {
      if (!isObject(p) || typeof p.id !== 'string') continue;
      const page = candidateFile(dist, p.page, `protocol ${p.id} page`, report, files);
      const recordBody = candidateFile(dist, p.record, `protocol ${p.id} record`, report, files);
      validateApiV2Mirror(dist, p.record, recordBody, `protocol ${p.id} record`, report, files);
      const archive = candidateFile(dist, p.archive, `protocol ${p.id} archive`, report, files);
      let record = null;
      if (recordBody) {
        try { record = JSON.parse(recordBody.toString('utf8')); }
        catch (error) { report.error(`protocol ${p.id} record: invalid JSON (${error.message})`); }
      }
      if (isObject(record)) {
        exactKeys(record, ['contract', 'achieved_assurance_status', 'manifest'], ['contract', 'achieved_assurance_status', 'manifest'], `protocol ${p.id} record`, report);
        if (!isObject(record.contract)) report.error(`protocol ${p.id} record.contract: expected object`);
        else {
          report.require(record.contract.id === p.id, `protocol ${p.id} record.contract.id: mismatch`);
          report.require(record.contract.version === p.version, `protocol ${p.id} record.contract.version: mismatch`);
          report.require(record.contract.productivity_evidence === p.productivity_evidence,
            `protocol ${p.id} record.contract.productivity_evidence: does not equal ledger`);
        }
        report.require(record.achieved_assurance_status === p.assurance_status,
          `protocol ${p.id} record.achieved_assurance_status: does not equal ledger`);
        if (!isObject(record.manifest)) report.error(`protocol ${p.id} record.manifest: expected object`);
        else {
          report.require(record.manifest.pack_id === p.id, `protocol ${p.id} record.manifest.pack_id: mismatch`);
          report.require(record.manifest.version === p.version, `protocol ${p.id} record.manifest.version: mismatch`);
          const r = registryById.get(p.id);
          if (r) report.require(record.manifest.network_required === r.network_required,
            `protocol ${p.id}: registry network_required does not equal record manifest`);
        }
      }
      validateArchive(archive, p, record, sourceDate, `protocol ${p.id} archive`, report);

      const r = registryById.get(p.id);
      if (r) {
        const skillPath = `downloads/${p.id}-${p.version}-skill.tar`;
        const skillArchive = candidateFile(dist, {
          path: skillPath,
          sha256: r.skill_sha256,
          bytes: r.skill_bytes
        }, `protocol ${p.id} skill archive`, report, files);
        validateSkillArchive(skillArchive, p, record, sourceDate, `protocol ${p.id} skill archive`, report);
      }
      if (r && isObject(record) && isObject(record.contract)) {
        const expectedTags = {
          task_tags: canonicalTags([record.contract.title]),
          audience_tags: canonicalTags(record.contract.target_users),
          required_tool_tags: canonicalTags(record.contract.required_capabilities),
          optional_tool_tags: canonicalTags((record.contract.optional_tools || []).map(tool => isObject(tool) ? tool.name : ''))
        };
        for (const [field, expected] of Object.entries(expectedTags)) {
          report.require(stable(r[field]) === stable(expected),
            `protocol ${p.id}: registry ${field} does not equal its exact record.contract projection`);
        }
        report.require(r.assurance_status === record.achieved_assurance_status,
          `protocol ${p.id}: registry assurance_status does not equal record.achieved_assurance_status`);
        report.require(r.productivity_evidence === record.contract.productivity_evidence,
          `protocol ${p.id}: registry productivity_evidence does not equal record.contract.productivity_evidence`);
      }
      if (page && r) {
        const html = page.toString('utf8');
        for (const [label, marker] of [
          ['id', p.id], ['version', p.version], ['assurance status', p.assurance_status],
          ['productivity evidence', p.productivity_evidence], ['archive URL', r.download],
          ['skill archive URL', r.skill_download], ['skill archive hash', r.skill_sha256],
          ['machine-record URL', publicPath(ledger.site.base_path, p.record.path)]
        ]) report.require(html.includes(marker), `protocol ${p.id} page: missing ${label} marker ${marker}`);
        report.require(indexText.includes(r.url), `index page: missing protocol URL ${r.url}`);
        report.require(indexText.includes(r.download), `index page: missing archive URL ${r.download}`);
        for (const anchor of ['copy-prompt', 'download-skill', 'download-pack']) {
          report.require(indexText.includes(`${r.url}#${anchor}`), `index page: missing novice action ${r.url}#${anchor}`);
          report.require(html.includes(`id="${anchor}"`), `protocol ${p.id} page: missing novice action anchor ${anchor}`);
        }
      }
    }
  }

  if (surfaceBodies.sitemap) validateSitemap(surfaceBodies.sitemap, ledger, report);
  if (Array.isArray(ledger.protocols)) {
    const inventory = listProtocolInventory(dist, report);
    sameMembers(inventory.pageIds, ledger.protocols.map(p => p.id), 'candidate protocol pages', report);
    const expectedArchives = ledger.protocols.map(p => path.posix.basename(p.archive.path));
    for (const entry of registryEntries) if (isObject(entry) && typeof entry.skill_download === 'string') {
      expectedArchives.push(path.posix.basename(entry.skill_download));
    }
    if (isObject(ledger.starter) && isObject(ledger.starter.archive)) expectedArchives.push(path.posix.basename(ledger.starter.archive.path));
    sameMembers(inventory.archives, expectedArchives, 'candidate release archives', report);
    sameMembers(inventory.records, ledger.protocols.map(p => p.record.path), 'candidate protocol records', report);
  }
  return { files, registry };
}

function mountedLiveBase(input, ledger) {
  let base;
  try { base = new URL(input); }
  catch { throw new Error(`--live is not a valid URL: ${input}`); }
  if ((base.protocol !== 'http:' && base.protocol !== 'https:') || base.username || base.password || base.search || base.hash) {
    throw new Error('--live must be a plain HTTP(S) URL without credentials, query, or fragment');
  }
  // An origin-only input is convenient; a path-bearing input is treated as the
  // exact mounted section base. Both forms end in / for URL-relative resolution.
  if (base.pathname === '/' && isObject(ledger.site)) base.pathname = ledger.site.base_path;
  if (!base.pathname.endsWith('/')) base.pathname += '/';
  return base;
}

function requestBuffer(url, expectedBytes, redirects, originalOrigin) {
  redirects = redirects || 0;
  originalOrigin = originalOrigin || url.origin;
  return new Promise((resolve, reject) => {
    const transport = url.protocol === 'https:' ? https : http;
    const req = transport.get(url, {
      headers: {
        'accept-encoding': 'identity',
        'cache-control': 'no-cache, no-store, max-age=0',
        pragma: 'no-cache',
        'user-agent': 'productivity-protocols-release-integrity/1.0'
      }
    }, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        res.resume();
        if (redirects >= 3) return reject(new Error('too many redirects'));
        const next = new URL(res.headers.location, url);
        if (next.origin !== originalOrigin) return reject(new Error(`cross-origin redirect refused: ${next.origin}`));
        return requestBuffer(next, expectedBytes, redirects + 1, originalOrigin).then(resolve, reject);
      }
      if (res.statusCode !== 200) {
        res.resume();
        return reject(new Error(`HTTP ${res.statusCode}`));
      }
      const encoding = String(res.headers['content-encoding'] || 'identity').toLowerCase();
      if (encoding !== 'identity') {
        res.resume();
        return reject(new Error(`server ignored identity encoding request (${encoding})`));
      }
      const advertised = Number(res.headers['content-length']);
      if (Number.isFinite(advertised) && advertised > expectedBytes) {
        res.resume();
        return reject(new Error(`response exceeds ledger byte length (${advertised} > ${expectedBytes})`));
      }
      const chunks = [];
      let length = 0;
      res.on('data', chunk => {
        length += chunk.length;
        if (length > expectedBytes) {
          req.destroy(new Error(`response exceeds ledger byte length (${length} > ${expectedBytes})`));
          return;
        }
        chunks.push(chunk);
      });
      res.on('end', () => resolve(Buffer.concat(chunks)));
    });
    req.setTimeout(10000, () => req.destroy(new Error('request timed out after 10 seconds')));
    req.on('error', reject);
  });
}

async function mapLimit(items, limit, fn) {
  const out = new Array(items.length);
  let next = 0;
  async function worker() {
    while (true) {
      const i = next++;
      if (i >= items.length) return;
      out[i] = await fn(items[i], i);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return out;
}

function allLedgerRefs(ledger) {
  const refs = [];
  if (isObject(ledger.surfaces)) for (const role of ['index', 'registry', 'sitemap']) {
    if (isObject(ledger.surfaces[role])) refs.push({ label: `surface ${role}`, ref: ledger.surfaces[role] });
  }
  if (Array.isArray(ledger.protocols)) for (const p of ledger.protocols) if (isObject(p)) {
    for (const role of ['page', 'record', 'archive']) if (isObject(p[role])) refs.push({ label: `protocol ${p.id} ${role}`, ref: p[role] });
  }
  if (isObject(ledger.starter)) for (const role of ['page', 'archive']) {
    if (isObject(ledger.starter[role])) refs.push({ label: `company starter ${role}`, ref: ledger.starter[role] });
  }
  // api/v2 records are generated byte mirrors of ledgered canonical API files.
  // They are checked as mirrors, not described as canonical ledger entries.
  const canonicalApiRefs = [];
  if (isObject(ledger.surfaces) && isObject(ledger.surfaces.registry)) canonicalApiRefs.push({ label: 'registry', ref: ledger.surfaces.registry });
  if (Array.isArray(ledger.protocols)) for (const p of ledger.protocols) {
    if (isObject(p) && isObject(p.record)) canonicalApiRefs.push({ label: `protocol ${p.id} record`, ref: p.record });
  }
  for (const item of canonicalApiRefs) {
    const mirrorPath = apiV2MirrorPath(item.ref.path);
    if (mirrorPath) refs.push({
      label: `${item.label} generated api/v2 mirror`,
      ref: { path: mirrorPath, sha256: item.ref.sha256, bytes: item.ref.bytes }
    });
  }
  return refs;
}

async function validateLive(input, ledger, candidateFiles, report) {
  let base;
  try { base = mountedLiveBase(input, ledger); }
  catch (error) { report.error(error.message); return; }
  const refs = allLedgerRefs(ledger);
  // Registry-bound skill editions are transitively ledgered: the ledger binds
  // the registry bytes, and the registry binds each skill archive hash/length.
  // Include them (and any future checker-validated transitive files) in exact
  // post-deploy readback without duplicating canonical ledger references.
  const seenPaths = new Set(refs.map(item => item.ref.path));
  for (const [relative, item] of candidateFiles.entries()) if (!seenPaths.has(relative)) {
    refs.push({ label: `registry-bound candidate ${relative}`, ref: item.ref });
    seenPaths.add(relative);
  }
  await mapLimit(refs, 6, async item => {
    const url = new URL(item.ref.path, base);
    url.searchParams.set('release_integrity', String(ledger.ledger_revision));
    let body;
    try { body = await requestBuffer(url, item.ref.bytes); }
    catch (error) {
      report.error(`${item.label}: live readback failed for ${url.origin}${url.pathname} (${error.message})`);
      return;
    }
    const digest = sha256(body);
    if (body.length !== item.ref.bytes) report.error(`${item.label}: live byte length ${body.length} does not equal ledger ${item.ref.bytes}`);
    if (digest !== item.ref.sha256) report.error(`${item.label}: live sha256 ${digest} does not equal ledger ${item.ref.sha256}`);
    const candidate = candidateFiles.get(item.ref.path);
    if (candidate && !body.equals(candidate.body)) report.error(`${item.label}: live bytes do not exactly equal candidate bytes`);
  });
}

async function run(options) {
  const report = new Report();
  const ledgerPath = path.join(options.root, 'PUBLISHED.json');
  const ledger = readJson(ledgerPath, 'PUBLISHED.json', report);
  if (!ledger) return report;
  validateLedger(ledger, report);
  validateSource(options.root, ledger, options.candidate, report);
  const candidate = validateCandidate(options.root, ledger, options.candidate, report);
  // Do not contact any host when the local candidate already failed. A live
  // readback can never repair a bad local release and should not leak requests.
  if (options.live && report.errors.length === 0) await validateLive(options.live, ledger, candidate.files, report);
  return report;
}

async function main(argv) {
  let options;
  try { options = parseArgs(argv || process.argv.slice(2)); }
  catch (error) {
    console.error(`release-integrity: ${error.message}\n\n${usage()}`);
    return 2;
  }
  if (options.help) {
    console.log(usage());
    return 0;
  }
  const report = await run(options);
  for (const warning of report.warnings) console.warn(`WARNING: ${warning}`);
  if (report.errors.length) {
    console.error(`REFUSING RELEASE: ${report.errors.length} integrity check${report.errors.length === 1 ? '' : 's'} failed`);
    for (const error of report.errors) console.error(`  - ${error}`);
    console.error('PUBLISHED.json was not changed. Reconcile the source, rebuild, and obtain review before changing the ledger.');
    return 1;
  }
  const mode = options.candidate ? 'development candidate' : 'clean production candidate';
  console.log(`release-integrity: offline ${mode} exactly matches the reviewed ledger`);
  if (options.live) console.log(`release-integrity: exact live readback passed at ${mountedLiveBase(options.live, readJson(path.join(options.root, 'PUBLISHED.json'), 'PUBLISHED.json', new Report()))}`);
  if (options.candidate) console.log('release-integrity: --candidate does not establish clean-source provenance and is not deploy authorisation');
  console.log('release-integrity: ledger left unchanged');
  return 0;
}

if (require.main === module) {
  main().then(code => { process.exitCode = code; }).catch(error => {
    console.error(`release-integrity: unexpected failure: ${error.stack || error.message}`);
    process.exitCode = 2;
  });
}

module.exports = {
  main,
  run,
  parseArgs,
  validateLedger,
  validateCandidate,
  parseTar,
  mountedLiveBase
};
