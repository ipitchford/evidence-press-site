#!/usr/bin/env node
/* Authoring-time integrity and duration check for the Observatory briefing.
 * Requires ffprobe. The dependency-free site build separately checks bytes and
 * SHA-256 values before emitting dist/. */
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const meta = JSON.parse(fs.readFileSync(path.join(ROOT, 'pages', 'observatory.json'), 'utf8'));
const audio = path.join(ROOT, meta.audio.url.replace(/^\/+/, ''));
const transcript = path.join(ROOT, meta.audio.transcriptUrl.replace(/^\/+/, ''));
const sha256 = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const fail = message => { console.error(`FAIL: ${message}`); process.exit(1); };

if (!fs.existsSync(audio)) fail(`missing ${audio}`);
if (!fs.existsSync(transcript)) fail(`missing ${transcript}`);
if (fs.statSync(audio).size !== meta.audio.bytes) fail('audio byte count differs from pages/observatory.json');
if (sha256(audio) !== meta.audio.sha256) fail('audio SHA-256 differs from pages/observatory.json');
if (sha256(transcript) !== meta.audio.transcriptSha256) fail('transcript SHA-256 differs from pages/observatory.json');

let seconds;
try {
  seconds = Number(execFileSync('ffprobe', [
    '-v', 'error', '-show_entries', 'format=duration', '-of', 'default=nw=1:nk=1', audio
  ], { encoding: 'utf8' }).trim());
} catch (error) {
  fail(`ffprobe failed: ${error.message}`);
}
const match = String(meta.audio.duration).match(/^PT(?:(\d+)M)?([0-9.]+)S$/);
if (!match) fail('audio duration is not an ISO 8601 minute/second value');
const declaredSeconds = Number(match[1] || 0) * 60 + Number(match[2]);
if (Math.abs(seconds - declaredSeconds) > 0.05) fail(`duration ${seconds}s differs from declared ${declaredSeconds}s`);
if (seconds < 105 || seconds > 135) fail(`duration ${seconds}s is outside the 105–135 second briefing window`);

const words = fs.readFileSync(transcript, 'utf8').trim().split(/\s+/).length;
console.log(`OK: Observatory audio ${seconds.toFixed(3)}s, ${meta.audio.bytes} bytes, ${words} transcript words`);
console.log(`SHA-256: ${meta.audio.sha256}`);
