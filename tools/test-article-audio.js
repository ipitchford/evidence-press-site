#!/usr/bin/env node
'use strict';
// Offline contract tests: no API key, network, ffmpeg or billable requests.
const fs = require('fs');
const os = require('os');
const path = require('path');
const assert = require('assert');
const { TTS, TRANSFORM, sha256, chunkTranscript, sourceFor, chunkMeta,
  prepareArticleAudio, verifyArticleAudio } = require('./make-article-audio');
let passed = 0;
function check(name, fn) {
  try { fn(); passed++; console.log(`ok      ${name}`); }
  catch (error) { console.error(`FAIL    ${name}\n  ${error.stack}`); process.exitCode = 1; }
}
const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'ep-article-audio-test-'));
const root = path.join(temporary, 'site');
const slug = 'fixture';
fs.mkdirSync(path.join(root, 'articles', slug), { recursive: true });
fs.mkdirSync(path.join(root, 'assets/audio'), { recursive: true });
const bodyPath = path.join(root, 'articles', slug, 'body.md');
const transcriptPath = path.join(root, 'assets/audio', `${slug}.txt`);
const audioPath = path.join(root, 'assets/audio', `${slug}.mp3`);
const receiptPath = path.join(root, 'assets/audio', `${slug}.provenance.json`);
const metaPath = path.join(root, 'articles', slug, 'meta.json');
fs.writeFileSync(bodyPath, '# Exact body\n\nAn article, not a release.\n');
fs.writeFileSync(transcriptPath, 'An article narration.\n\nSecond paragraph.\n');

function fixtureReceipt() {
  const source = sourceFor(slug, root, temporary);
  // These opaque test bytes test hash binding only, not MP3 decoding/playback.
  const bytes = Buffer.from('offline final audio hash fixture');
  fs.writeFileSync(audioPath, bytes);
  return { ...source.base, assembledAt: '2026-09-09T12:00:00.000Z',
    generator: 'bundled speech skill text_to_speech.py speak-batch', requestId: null,
    chunks: source.chunks.map(chunk => ({ ...chunkMeta(chunk), requestId: null,
      audioSha256: sha256('offline segment fixture'), audioBytes: 123, durationSeconds: 2 })),
    transform: { ...TRANSFORM }, audioSha256: sha256(bytes), audioBytes: bytes.length,
    durationSeconds: source.chunks.length * 2 };
}
function saveReceipt(receipt) { fs.writeFileSync(receiptPath, JSON.stringify(receipt)); }

try {
  check('paragraph chunks cover the exact transcript and preserve all words', () => {
    const text = `  Opening.\n\n${'Long paragraph with words and equations. '.repeat(210)}\n\nFinal paragraph.\n`;
    const chunks = chunkTranscript(text);
    assert.ok(chunks.length > 2);
    assert.strictEqual(chunks.map(chunk => text.slice(chunk.start, chunk.end)).join(''), text);
    let end = 0;
    for (const chunk of chunks) {
      assert.strictEqual(chunk.start, end);
      assert.ok(chunk.input.length > 0 && chunk.input.length <= 3000);
      assert.strictEqual(chunk.input, text.slice(chunk.start, chunk.end).trim());
      assert.strictEqual(chunk.inputSha256, sha256(chunk.input));
      assert.strictEqual(chunk.sourceTextSha256, sha256(text.slice(chunk.start, chunk.end)));
      end = chunk.end;
    }
    assert.strictEqual(end, text.length);
  });

  check('bounded chunks do not split Unicode surrogate pairs', () => {
    const text = 'a'.repeat(2999) + '🌊' + 'b'.repeat(4000) + '\n';
    const chunks = chunkTranscript(text);
    for (const chunk of chunks) {
      assert.ok(!/^[\uDC00-\uDFFF]/.test(chunk.input));
      assert.ok(!/[\uD800-\uDBFF]$/.test(chunk.input));
    }
    assert.strictEqual(chunks.map(chunk => text.slice(chunk.start, chunk.end)).join(''), text);
    assert.throws(() => chunkTranscript(' \n\t'), /spoken text/);
  });

  check('preparation is local, profile-pinned and deterministic with a private resume cache', () => {
    const first = prepareArticleAudio(slug, root, temporary);
    const second = prepareArticleAudio(slug, root, temporary);
    assert.deepStrictEqual(second, first);
    assert.ok(!first.cache.startsWith(root));
    const jobs = fs.readFileSync(first.jobsPath, 'utf8').trim().split('\n').map(JSON.parse);
    const source = sourceFor(slug, root, temporary);
    assert.strictEqual(jobs.length, source.chunks.length);
    assert.strictEqual(jobs[0].input, source.chunks[0].input);
    assert.strictEqual(jobs[0].out, '0001.mp3');
    assert.strictEqual(fs.readFileSync(first.instructionsPath, 'utf8'), TTS.instructions);
    assert.ok(fs.readFileSync(path.join(first.cache, 'prepare.json'), 'utf8').includes('gpt-4o-mini-tts'));
    assert.throws(() => sourceFor('../secrets', root), /Unsafe article slug/);
  });

  check('source or transcript changes select a new cache; edited prepared input is rejected', () => {
    const before = sourceFor(slug, root, temporary);
    const original = fs.readFileSync(bodyPath);
    fs.appendFileSync(bodyPath, '\nA correction.\n');
    assert.notStrictEqual(sourceFor(slug, root, temporary).cache, before.cache);
    fs.writeFileSync(bodyPath, original);
    const preparedInput = path.join(before.cache, '0001.txt');
    const input = fs.readFileSync(preparedInput);
    fs.writeFileSync(preparedInput, 'Wrong input');
    assert.throws(() => prepareArticleAudio(slug, root, temporary), /Prepared input changed/);
    fs.writeFileSync(preparedInput, input);
  });

  check('offline receipt validation needs no API credential or media executable', () => {
    const receipt = fixtureReceipt();
    saveReceipt(receipt);
    assert.deepStrictEqual(verifyArticleAudio(slug, root), receipt);
    assert.ok(receipt.limitations.includes('bundled CLI does not expose API request IDs'));
    assert.ok(!JSON.stringify(receipt).includes(temporary));
    assert.strictEqual(receipt.transform.bitrate, '64k');
    assert.strictEqual(receipt.transform.channels, 1);
  });

  check('receipt rejects stale sources, changed final bytes and invented provider IDs', () => {
    const receipt = fixtureReceipt();
    saveReceipt(receipt);
    const original = fs.readFileSync(bodyPath);
    fs.appendFileSync(bodyPath, '\nChanged.\n');
    assert.throws(() => verifyArticleAudio(slug, root), /sourceBodySha256/);
    fs.writeFileSync(bodyPath, original);
    fs.appendFileSync(audioPath, 'changed bytes');
    assert.throws(() => verifyArticleAudio(slug, root), /byte count mismatch/);
    fixtureReceipt();
    saveReceipt({ ...receipt, requestId: 'fabricated' });
    assert.throws(() => verifyArticleAudio(slug, root), /does not provide a request ID/);
  });

  check('receipt rejects malformed chunk boundaries, missing fields and private-path leaks', () => {
    const original = fixtureReceipt();
    const mutations = [
      r => { r.chunks[0].start = 1; },
      r => { delete r.chunks[0].audioSha256; },
      r => { r.chunks[0].inputSha256 = sha256('wrong text'); },
      r => { r.chunks[0].privateCache = temporary; },
      r => { r.cache = temporary; },
      r => { r.voice = 'some-other-voice'; },
      r => { r.transform.bitrate = '128k'; },
      r => { r.limitations = []; }
    ];
    for (const mutate of mutations) {
      const receipt = JSON.parse(JSON.stringify(original));
      mutate(receipt);
      saveReceipt(receipt);
      assert.throws(() => verifyArticleAudio(slug, root));
    }
  });

  check('optional article metadata is checked without a circular metadata hash', () => {
    const receipt = fixtureReceipt();
    saveReceipt(receipt);
    const audio = { src: `/${receipt.audioPath}`, transcript: `/${receipt.transcriptPath}`,
      provenance: `/assets/audio/${slug}.provenance.json`, durationSeconds: receipt.durationSeconds,
      voiceLabel: 'OpenAI API synthetic voice (fable)' };
    fs.writeFileSync(metaPath, JSON.stringify({ byline: 'GPT-6 Astra Ultra and Anthropic Fable 5.1 High', audio }));
    assert.strictEqual(verifyArticleAudio(slug, root).durationSeconds, receipt.durationSeconds);
    fs.writeFileSync(metaPath, JSON.stringify({ audio: { ...audio, durationSeconds: 999 } }));
    assert.throws(() => verifyArticleAudio(slug, root), /metadata duration mismatch/);
  });
} finally {
  // Only this test's validated mkdtemp directory is disposable.
  fs.rmSync(temporary, { recursive: true, force: true });
}
console.log(`${passed} article audio tests passed`);
