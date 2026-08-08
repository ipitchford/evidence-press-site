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
    const stat = fs.statSync(full);
    if (stat.isDirectory()) out.push(...walk(full, base));
    else out.push(path.relative(base, full));
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

// The current git commit + date, used for reproducible build/receipt identity.
// Falls back to null outside a checkout so output is still well-formed.
function gitIdentity() {
  const run = cmd => {
    try {
      return require('child_process').execSync(cmd, { cwd: ROOT, stdio: ['ignore', 'pipe', 'ignore'] })
        .toString().trim() || null;
    } catch { return null; }
  };
  return {
    sourceCommit: run('git rev-parse --short HEAD'),
    sourceCommitFull: run('git rev-parse HEAD'),
    sourceDate: run('git log -1 --format=%cI')
  };
}

// Parse the YAML frontmatter block of a SKILL.md (between the first two '---').
function frontmatter(text) {
  const m = text.match(/^---\n([\s\S]*?)\n---/);
  return m ? m[1] : null;
}

module.exports = {
  ROOT, PACKS_DIR, sha256File, sha256String, walk, listPacks, packDir, readJSON, gitIdentity, frontmatter
};
