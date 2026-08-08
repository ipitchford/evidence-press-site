'use strict';
/* Shared helpers for the Productivity Protocols tools. Dependency-free. Apache-2.0. */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.resolve(__dirname, '..', '..');          // protocols/
const PACKS_DIR = path.join(ROOT, 'protocols');            // protocols/protocols/

function sha256File(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}
function sha256String(s) {
  return crypto.createHash('sha256').update(s).digest('hex');
}

function walk(dir, base) {
  base = base || dir;
  const out = [];
  for (const name of fs.readdirSync(dir).sort()) {
    const full = path.join(dir, name);
    const stat = fs.lstatSync(full);
    if (stat.isSymbolicLink()) throw new Error(`refusing symbolic link while walking ${path.relative(ROOT, full)}`);
    if (stat.isDirectory()) out.push(...walk(full, base));
    else if (stat.isFile()) {
      const relative = path.relative(base, full);
      if (path.isAbsolute(relative) || relative === '..' || relative.startsWith('..' + path.sep)) {
        throw new Error(`walked file escapes requested root: ${relative}`);
      }
      out.push(relative);
    } else throw new Error(`refusing non-regular file while walking ${path.relative(ROOT, full)}`);
  }
  return out;
}

function listPacks() {
  if (!fs.existsSync(PACKS_DIR)) return [];
  return fs.readdirSync(PACKS_DIR).sort().filter(name => {
    const p = path.join(PACKS_DIR, name);
    return fs.statSync(p).isDirectory() && fs.existsSync(path.join(p, 'protocol.yaml'));
  });
}

function packDir(id) { return path.join(PACKS_DIR, id); }

function readJSON(file) { return JSON.parse(fs.readFileSync(file, 'utf8')); }

// Receipts are content-addressed release artifacts. Recording process.version
// would make otherwise identical builds differ across every supported Node
// runtime, so bind the artifact to the reviewed compatibility boundary instead;
// CI logs retain the exact runner version for each replay.
const NODE_COMPATIBILITY = '>=18';

const RELEASE_CONTROL_PATHS = new Set([
  // Commit B is deliberately ledger-only. Schemas, checkers, documentation and
  // tests can affect either the emitted bytes or the meaning of the gate, so
  // they belong in the reviewed substantive build commit A.
  'PUBLISHED.json'
]);

function releaseControlPath(relative) {
  return RELEASE_CONTROL_PATHS.has(relative);
}

// Git identity used for reproducible build/receipt output. Ordinarily this is
// HEAD. A clean release-control commit may explicitly request the substantive
// build commit recorded by the ledger; the override is accepted only when every
// later change is inside the small release-control allowlist.
function gitIdentity(root, requestedCommit) {
  root = root || ROOT;
  const run = args => {
    try {
      return require('child_process').execFileSync('git', args, { cwd: root, stdio: ['ignore', 'pipe', 'ignore'] })
        .toString().trim() || null;
    } catch { return null; }
  };
  const succeeds = args => {
    try {
      require('child_process').execFileSync('git', args, { cwd: root, stdio: 'ignore' });
      return true;
    } catch { return false; }
  };
  requestedCommit = requestedCommit || process.env.PRODUCTIVITY_PROTOCOLS_SOURCE_COMMIT || null;
  const head = run(['rev-parse', 'HEAD']);
  let sourceCommitFull = head;
  if (requestedCommit) {
    if (!/^[0-9a-f]{40}$/.test(requestedCommit)) throw new Error('PRODUCTIVITY_PROTOCOLS_SOURCE_COMMIT must be a full lower-case Git commit');
    const resolved = run(['rev-parse', '--verify', `${requestedCommit}^{commit}`]);
    if (resolved !== requestedCommit) throw new Error('requested protocol build source commit is unavailable');
    if (!head || !succeeds(['merge-base', '--is-ancestor', requestedCommit, head])) {
      throw new Error('requested protocol build source commit is not an ancestor of HEAD');
    }
    const status = run(['status', '--porcelain=v1', '--untracked-files=all']);
    if (status) throw new Error('source-commit override requires a clean Git worktree');
    const top = run(['rev-parse', '--show-toplevel']);
    const rootReal = fs.realpathSync(root), topReal = fs.realpathSync(top);
    const prefix = path.relative(topReal, rootReal).split(path.sep).join('/');
    if (prefix === '..' || prefix.startsWith('../') || path.isAbsolute(prefix)) {
      throw new Error('protocol source root is outside the enclosing Git worktree');
    }
    const changedRaw = run(['diff', '--name-only', '--diff-filter=ACDMRTUXB', `${requestedCommit}..${head}`]) || '';
    const substantive = changedRaw.split('\n').filter(Boolean).filter(relative => {
      if (!prefix) return !releaseControlPath(relative);
      if (!relative.startsWith(prefix + '/')) return true;
      return !releaseControlPath(relative.slice(prefix.length + 1));
    });
    if (substantive.length) {
      throw new Error(`source-commit override is stale; substantive files changed after the build commit: ${substantive.join(', ')}`);
    }
    sourceCommitFull = requestedCommit;
  }
  const porcelain = sourceCommitFull ? run(['status', '--porcelain', '--untracked-files=normal']) : null;
  return {
    sourceCommit: sourceCommitFull ? run(['rev-parse', '--short', sourceCommitFull]) : null,
    sourceCommitFull,
    sourceTree: sourceCommitFull ? run(['rev-parse', `${sourceCommitFull}^{tree}`]) : null,
    sourceDate: sourceCommitFull ? run(['show', '-s', '--format=%cI', sourceCommitFull]) : null,
    // `run` returns null for an empty clean status and a non-empty string for a
    // dirty tree. Outside Git, dirty is null rather than a reassuring false.
    dirty: sourceCommitFull ? Boolean(porcelain) : null
  };
}

// Parse the YAML frontmatter block of a SKILL.md (between the first two '---').
function frontmatter(text) {
  const m = text.match(/^---\n([\s\S]*?)\n---/);
  return m ? m[1] : null;
}

module.exports = {
  ROOT, PACKS_DIR, sha256File, sha256String, walk, listPacks, packDir, readJSON,
  NODE_COMPATIBILITY, gitIdentity, releaseControlPath, frontmatter
};
