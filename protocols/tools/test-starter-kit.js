#!/usr/bin/env node
'use strict';

/* Extract the exact generated company starter into a fresh temporary directory
 * and run its own controls from inside the archive. This proves that the
 * advertised offline feasibility kit contains its schemas, tools and runtime
 * dependencies; it does not establish usability or company impact. */

const fs = require('fs');
const os = require('os');
const path = require('path');
const childProcess = require('child_process');
const U = require('./lib/util');

function field(block, offset, length) {
  const raw = block.subarray(offset, offset + length);
  const nul = raw.indexOf(0);
  return raw.subarray(0, nul < 0 ? raw.length : nul).toString('utf8');
}

function octal(block, offset, length) {
  const value = field(block, offset, length).trim();
  return /^[0-7]+$/.test(value) ? Number.parseInt(value, 8) : null;
}

function zeroBlock(block) {
  for (const byte of block) if (byte !== 0) return false;
  return true;
}

function safeName(name) {
  return typeof name === 'string' && name.startsWith('productivity-protocols-starter/') &&
    !name.includes('\\') && !path.posix.isAbsolute(name) && path.posix.normalize(name) === name &&
    !name.split('/').some(part => !part || part === '.' || part === '..');
}

function extract(buffer, destination) {
  if (buffer.length % 512 !== 0) throw new Error('starter tar is not 512-byte aligned');
  let offset = 0, terminators = 0, count = 0;
  while (offset + 512 <= buffer.length) {
    const header = buffer.subarray(offset, offset + 512);
    if (zeroBlock(header)) {
      terminators++;
      offset += 512;
      if (terminators === 2) break;
      continue;
    }
    if (terminators) throw new Error('starter tar has data after a zero terminator');
    const base = field(header, 0, 100), prefix = field(header, 345, 155);
    const name = prefix ? `${prefix}/${base}` : base;
    const size = octal(header, 124, 12), stored = octal(header, 148, 8);
    let checksum = 0;
    for (let i = 0; i < 512; i++) checksum += (i >= 148 && i < 156) ? 32 : header[i];
    if (!safeName(name)) throw new Error(`unsafe starter tar path: ${name}`);
    if (size === null || stored !== checksum) throw new Error(`invalid starter tar header: ${name}`);
    if (header[156] !== 0 && header[156] !== 48) throw new Error(`non-regular starter tar entry: ${name}`);
    const start = offset + 512, end = start + size;
    if (end > buffer.length) throw new Error(`truncated starter tar entry: ${name}`);
    const output = path.resolve(destination, ...name.split('/'));
    if (!output.startsWith(path.resolve(destination) + path.sep)) throw new Error(`starter extraction escaped: ${name}`);
    fs.mkdirSync(path.dirname(output), { recursive: true });
    fs.writeFileSync(output, buffer.subarray(start, end));
    count++;
    offset = start + Math.ceil(size / 512) * 512;
  }
  if (terminators !== 2) throw new Error('starter tar lacks two zero terminators');
  return count;
}

function main() {
  const downloads = path.join(U.ROOT, 'dist', 'downloads');
  const candidates = fs.existsSync(downloads)
    ? fs.readdirSync(downloads).filter(name => /^company-pilot-starter-.*\.tar$/.test(name)).sort()
    : [];
  if (candidates.length !== 1) throw new Error(`expected exactly one generated company starter, found ${candidates.length}`);
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'productivity-protocols-starter-'));
  try {
    const count = extract(fs.readFileSync(path.join(downloads, candidates[0])), temporary);
    const extractedRoot = path.join(temporary, 'productivity-protocols-starter');
    for (const required of [
      'LICENSE', 'company-pilot/LICENSE', 'company-pilot/README.md',
      'schema/pilot-plan.schema.json', 'tools/pilot-validate.js', 'tools/pilot-tests.js',
      'protocols/document-to-action-plan/adapters/generic-chat/prompt.md'
    ]) {
      if (!fs.existsSync(path.join(extractedRoot, required))) throw new Error(`extracted starter is missing ${required}`);
    }
    const output = childProcess.execFileSync(process.execPath, ['tools/pilot-tests.js'], {
      cwd: extractedRoot,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe']
    });
    if (!output.includes('pilot tests: PASS (31 checks)')) throw new Error('extracted starter controls did not report 31 passing checks');
    console.log(`starter-kit: ${count} files extracted; pilot controls PASS (31 checks)`);
  } finally {
    fs.rmSync(temporary, { recursive: true, force: true });
  }
}

if (require.main === module) {
  try { main(); }
  catch (error) { console.error(`starter-kit: FAIL: ${error.message}`); process.exit(1); }
}

module.exports = { extract };
