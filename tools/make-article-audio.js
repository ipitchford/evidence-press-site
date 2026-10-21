#!/usr/bin/env node
'use strict';
/* Article narration only. This helper never reads a credential itself.
 * --prepare SLUG: prepare resumable inputs for the bundled speech CLI.
 * --assemble SLUG: check every chunk's spoken ending with offline ASR, then encode
 *   the publication MP3 and receipt. A chunk whose final words are not heard is
 *   quarantined and re-queued by the next --prepare (at most 3 takes per chunk).
 * --generate SLUG: prepare, run the bundled speech CLI (it reads OPENAI_API_KEY
 *   from the inherited environment) and assemble, retrying failed endings.
 * --check SLUG: verify committed provenance offline (no ffmpeg or API key).
 * Generation and assembly need EP_ASR_PYTHON and EP_ASR_MODEL (local model only).
 * The transcript is editorially supplied; its equivalence to the article needs
 * human/agent review. Hashes and successful decoding do not prove spoken fidelity.
 */
const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');
const { spawnSync } = require('child_process');
const ROOT = path.join(__dirname, '..');
const MAX_CHARS = 3000;
const MAX_BYTES = 25 * 1024 * 1024;
const TTS = Object.freeze({
  provider: 'openai', endpoint: 'https://api.openai.com/v1/audio/speech',
  model: 'gpt-4o-mini-tts', voice: 'fable', responseFormat: 'mp3', speed: 1,
  instructions: 'Calm, clear, unhurried British science-briefing narration, in the style of a public-radio science presenter. Measured pace, warm but neutral tone. Pronounce mathematical names carefully.'
});
const LIMITATIONS = Object.freeze([
  'bundled CLI does not expose API request IDs',
  'The receipt binds prepared inputs, configured provider profile and observed output bytes; it is not an independent attestation of provider execution or spoken-word completeness.',
  'Offline checking verifies the final MP3 hash and recorded segment metadata, not deleted or unavailable private segment files.'
]);
const TRANSFORM = Object.freeze({
  tool: 'ffmpeg', method: 'concat-demuxer then re-encode', codec: 'libmp3lame',
  bitrate: '64k', channels: 1, sampleRate: 24000, maximumBytesExclusive: MAX_BYTES
});
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');
const readJson = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const writeJson = (file, value) => fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, { mode: 0o600 });
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const assert = (condition, message) => { if (!condition) throw new Error(message); };
const hashPattern = /^[a-f0-9]{64}$/;
const { endingCheck } = require('./audio-recipe');
// 1.0 receipts were chunked without heading awareness or ending checks and are
// verified with that recipe. New receipts end chunks only after a non-heading
// paragraph (the provider repeatedly dropped headings that ended a chunk) and
// record a passed offline spoken-ending check for every chunk and the whole file.
const LEGACY_SCHEMA = 'article-audio-1.0';
const SCHEMA = 'article-audio-1.1';
const CHUNKING = 'paragraph-not-heading, then sentence, then space';
const ENDING_ATTEMPTS = 3;
const ENDING_TAIL_SECONDS = 14;
const ENDING_LIMITATION = 'Spoken-ending checks are offline ASR of each chunk\'s and the final file\'s last seconds, not human listening.';
const SPEECH_CLI = '/Users/admin/.codex/skills/speech/scripts/text_to_speech.py';
// A heading is a short single-line paragraph without closing punctuation.
const isHeading = paragraph => { const t = paragraph.trim();
  return Boolean(t) && t.length <= 120 && !t.includes('\n') && !/[.!?:;"'”’)\]]$/.test(t); };

function chunkTranscript(text, maxChars = MAX_CHARS, { headingAware = true } = {}) {
  assert(typeof text === 'string' && text.trim(), 'Transcript must contain spoken text');
  assert(Number.isInteger(maxChars) && maxChars >= 4, 'Invalid chunk limit');
  const chunks = [];
  let start = 0;
  while (start < text.length) {
    if (!text.slice(start).trim() && chunks.length) {
      chunks[chunks.length - 1].end = text.length;
      break;
    }
    let end = Math.min(start + maxChars, text.length);
    if (end < text.length) {
      const sample = text.slice(start, end);
      let paragraph = sample.lastIndexOf('\n\n');
      // Never end a chunk on a heading: keep it with the paragraph that follows.
      while (headingAware && paragraph > 0 &&
        isHeading(sample.slice(sample.lastIndexOf('\n\n', paragraph - 1) + 2, paragraph)))
        paragraph = sample.lastIndexOf('\n\n', paragraph - 1);
      const whitespace = Math.max(sample.lastIndexOf(' '), sample.lastIndexOf('\n'));
      // A chunk ending mid-sentence can lose its final spoken words, so prefer a sentence end.
      const sentence = [...sample.matchAll(/[.!?]["'”’)\]]*\s+(?=["'“‘(\[]?[A-Z0-9])/g)].pop();
      if (paragraph > 0) end = start + paragraph + 2;
      else if (sentence) end = start + sentence.index + sentence[0].length;
      else if (whitespace > maxChars / 2) end = start + whitespace + 1;
      // A JS string uses UTF-16 offsets; do not cut between a surrogate pair.
      if (/[\uD800-\uDBFF]/.test(text[end - 1]) && /[\uDC00-\uDFFF]/.test(text[end])) end--;
    }
    assert(end > start && text.slice(start, end).trim(), 'Excessive whitespace prevents a bounded nonempty chunk');
    chunks.push({ index: chunks.length + 1, start, end });
    start = end;
  }
  return chunks.map(chunk => {
    const source = text.slice(chunk.start, chunk.end);
    const input = source.trim(); // Matches the bundled CLI's input normalization.
    assert(input.length <= maxChars, 'Chunk exceeds input limit');
    return { ...chunk, sourceTextSha256: sha256(source), inputSha256: sha256(input),
      inputCharacters: input.length, input };
  });
}

function sourceFor(slug, root = ROOT, tempRoot = os.tmpdir(), schemaVersion = SCHEMA) {
  assert([LEGACY_SCHEMA, SCHEMA].includes(schemaVersion), 'Unknown article audio schema');
  const legacy = schemaVersion === LEGACY_SCHEMA;
  assert(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug), 'Unsafe article slug');
  const sourceBodyPath = `articles/${slug}/body.md`;
  const transcriptPath = `assets/audio/${slug}.txt`;
  const body = fs.readFileSync(path.join(root, sourceBodyPath));
  const transcript = fs.readFileSync(path.join(root, transcriptPath));
  assert(body.toString('utf8').trim(), 'Article body is empty');
  const text = transcript.toString('utf8');
  assert(Buffer.from(text, 'utf8').equals(transcript), 'Transcript must be valid UTF-8');
  const chunks = chunkTranscript(text, MAX_CHARS, { headingAware: !legacy });
  const base = {
    schemaVersion, slug, sourceBodyPath, sourceBodySha256: sha256(body),
    transcriptPath, transcriptSha256: sha256(transcript), transcriptCharacters: text.length,
    inputSha256: sha256(chunks.map(chunk => chunk.input).join('\n\n')),
    inputNormalization: 'Trim leading and trailing whitespace per chunk; inputSha256 joins those inputs with two newlines.',
    inputRangeUnit: 'UTF-16 code units in the exact UTF-8 transcript decoded as a JavaScript string',
    maximumChunkCharacters: MAX_CHARS, ...(legacy ? {} : { chunking: CHUNKING }), ...TTS,
    audioPath: `assets/audio/${slug}.mp3`, limitations: legacy ? [...LIMITATIONS] : [...LIMITATIONS, ENDING_LIMITATION]
  };
  const cacheKey = sha256(JSON.stringify(base));
  return { root, slug, text, chunks, base, cacheKey,
    cache: path.join(tempRoot, 'evidence-press-article-audio', `${slug}-${cacheKey}`),
    receiptPath: path.join(root, 'assets/audio', `${slug}.provenance.json`) };
}

function chunkMeta(chunk) {
  const { input, ...metadata } = chunk;
  return metadata;
}
function chunkName(chunk) { return String(chunk.index).padStart(4, '0'); }
function run(command, args, options = {}) {
  const result = spawnSync(command, args, { encoding: 'utf8', timeout: 120000, maxBuffer: 1024 * 1024, ...options });
  assert(!result.error && result.status === 0,
    `${command} failed: ${result.error ? result.error.message : (result.stderr || '').slice(-1600)}`);
  return result.stdout;
}
function inspectAudio(file) {
  assert(fs.lstatSync(file).isFile() && !fs.lstatSync(file).isSymbolicLink(), 'Audio must be a regular file');
  const bytes = fs.readFileSync(file);
  assert(bytes.length > 0, 'Audio is empty');
  const info = JSON.parse(run('ffprobe', ['-v', 'error', '-show_entries', 'format=duration:stream=codec_name', '-of', 'json', file]));
  const durationSeconds = Number(info.format && info.format.duration);
  assert(Number.isFinite(durationSeconds) && durationSeconds > 0, 'Audio duration is invalid');
  assert(info.streams.length === 1 && info.streams[0].codec_name === 'mp3', 'Expected one MP3 stream');
  run('ffmpeg', ['-v', 'error', '-xerror', '-i', file, '-f', 'null', '-']);
  return { audioSha256: sha256(bytes), audioBytes: bytes.length, durationSeconds };
}
function spokenEnding(input, file) {
  const python = process.env.EP_ASR_PYTHON, model = process.env.EP_ASR_MODEL;
  assert(python && model, 'Set EP_ASR_PYTHON and EP_ASR_MODEL for the spoken-ending guard');
  const asr = JSON.parse(run(python, ['-B', path.join(__dirname, 'transcribe-audio.py'), model, file, String(ENDING_TAIL_SECONDS)],
    { timeout: 600000, maxBuffer: 16 * 1024 * 1024 }));
  return { ...endingCheck(input, asr.text), asrModelSha256: asr.model.sha256 };
}
const rejectedTakes = (source, chunk) => fs.readdirSync(path.join(source.cache, 'segments'))
  .filter(name => name.startsWith(`${chunkName(chunk)}.mp3.rejected-ending-`)).length;
function preparedManifest(source) {
  return { cacheKey: source.cacheKey, ...source.base, chunks: source.chunks.map(chunkMeta) };
}
function assertPrepared(source) {
  assert(same(readJson(path.join(source.cache, 'prepare.json')), preparedManifest(source)),
    'Prepared inputs/profile differ from current article; run --prepare again');
  assert(fs.readFileSync(path.join(source.cache, 'instructions.txt'), 'utf8') === TTS.instructions,
    'Prepared narration instructions changed');
  for (const chunk of source.chunks) {
    assert(fs.readFileSync(path.join(source.cache, `${chunkName(chunk)}.txt`), 'utf8') === chunk.input,
      `Prepared input changed for chunk ${chunk.index}`);
  }
}

function prepareArticleAudio(slug, root = ROOT, tempRoot = os.tmpdir()) {
  const source = sourceFor(slug, root, tempRoot);
  fs.mkdirSync(path.join(source.cache, 'segments'), { recursive: true, mode: 0o700 });
  const manifestPath = path.join(source.cache, 'prepare.json');
  const existing = fs.existsSync(manifestPath);
  if (existing) assertPrepared(source);
  else {
    writeJson(manifestPath, preparedManifest(source));
    fs.writeFileSync(path.join(source.cache, 'instructions.txt'), TTS.instructions, { mode: 0o600 });
    for (const chunk of source.chunks) fs.writeFileSync(path.join(source.cache, `${chunkName(chunk)}.txt`), chunk.input, { mode: 0o600 });
  }
  const jobs = [];
  for (const chunk of source.chunks) {
    const output = path.join(source.cache, 'segments', `${chunkName(chunk)}.mp3`);
    if (fs.existsSync(output)) {
      assert(existing, 'Unrecorded cached output; inspect it before continuing');
      try {
        const observed = inspectAudio(output);
        const completedPath = path.join(source.cache, 'segments', `${chunkName(chunk)}.receipt.json`);
        const completed = { ...chunkMeta(chunk), requestId: null, ...observed };
        if (fs.existsSync(completedPath)) {
          // An accepted take's receipt also carries its ending check; compare the rest.
          const { endingCheck: _accepted, ...stored } = readJson(completedPath);
          assert(same(stored, completed), 'Cached segment receipt changed');
        }
        else writeJson(completedPath, completed);
        continue;
      }
      catch (error) {
        // Preserve incomplete bytes for inspection, never feed them to assembly.
        const quarantine = `${output}.incomplete-${crypto.randomUUID()}`;
        fs.renameSync(output, quarantine);
        const staleReceipt = path.join(source.cache, 'segments', `${chunkName(chunk)}.receipt.json`);
        if (fs.existsSync(staleReceipt)) fs.renameSync(staleReceipt, `${quarantine}.receipt.json`);
        console.error(`Preserved invalid chunk ${chunk.index} in the private cache; queued regeneration.`);
      }
    }
    assert(rejectedTakes(source, chunk) < ENDING_ATTEMPTS,
      `Chunk ${chunk.index} lost its spoken ending in ${ENDING_ATTEMPTS} takes; revise the transcript rather than retrying`);
    jobs.push({ input: chunk.input, out: `${chunkName(chunk)}.mp3` });
  }
  const jobsPath = path.join(source.cache, 'jobs.jsonl');
  fs.writeFileSync(jobsPath, jobs.map(job => JSON.stringify(job)).join('\n') + (jobs.length ? '\n' : ''), { mode: 0o600 });
  return { cache: source.cache, jobsPath, outputDirectory: path.join(source.cache, 'segments'),
    instructionsPath: path.join(source.cache, 'instructions.txt'), pendingChunks: jobs.length, totalChunks: source.chunks.length };
}

function assembleArticleAudio(slug, root = ROOT, tempRoot = os.tmpdir()) {
  const source = sourceFor(slug, root, tempRoot);
  assertPrepared(source);
  const failed = [];
  const chunks = source.chunks.map(chunk => {
    const output = path.join(source.cache, 'segments', `${chunkName(chunk)}.mp3`);
    const observed = inspectAudio(output);
    const ending = { ...spokenEnding(chunk.input, output), attempt: rejectedTakes(source, chunk) + 1 };
    if (ending.status !== 'passed') {
      // Keep the rejected take privately for inspection; --prepare re-queues the chunk.
      fs.renameSync(output, `${output}.rejected-ending-${ending.attempt}`);
      failed.push(`chunk ${chunk.index} (take ${ending.attempt}): expected "…${ending.expectedEnding}", heard "…${ending.heardEnding}"`);
      return null;
    }
    const record = { ...chunkMeta(chunk), requestId: null, ...observed, endingCheck: ending };
    writeJson(path.join(source.cache, 'segments', `${chunkName(chunk)}.receipt.json`), record);
    return record;
  });
  if (failed.length) throw Object.assign(new Error(`Spoken ending missing; run --prepare and the speech CLI again: ${failed.join('; ')}`), { endingFailure: true });
  const concatPath = path.join(source.cache, 'concat.txt');
  fs.writeFileSync(concatPath, source.chunks.map(chunk => `file 'segments/${chunkName(chunk)}.mp3'`).join('\n') + '\n', { mode: 0o600 });
  const combined = path.join(source.cache, 'assembled.mp3');
  run('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-f', 'concat', '-safe', '1', '-i', concatPath,
    '-map', '0:a:0', '-map_metadata', '-1', '-ac', '1', '-ar', '24000', '-c:a', 'libmp3lame', '-b:a', '64k', combined]);
  const finalAudio = inspectAudio(combined);
  const finalEnding = spokenEnding(source.text, combined);
  assert(finalEnding.status === 'passed', `Assembled recording lost its spoken ending: heard "…${finalEnding.heardEnding}"`);
  assert(finalAudio.audioBytes < MAX_BYTES, 'MP3 exceeds the free publication per-file size limit');
  const segmentDuration = chunks.reduce((sum, chunk) => sum + chunk.durationSeconds, 0);
  assert(Math.abs(finalAudio.durationSeconds - segmentDuration) < Math.max(2, chunks.length * 0.25),
    'Assembled duration differs unexpectedly from the sum of the chunks');
  const receipt = { ...source.base, assembledAt: new Date().toISOString(),
    generator: 'bundled speech skill text_to_speech.py speak-batch',
    requestId: null, chunks, transform: { ...TRANSFORM }, ...finalAudio, endingCheck: finalEnding };
  const destination = path.join(root, source.base.audioPath);
  const stagedAudio = `${destination}.staged-${crypto.randomUUID()}`;
  fs.copyFileSync(combined, stagedAudio);
  fs.renameSync(stagedAudio, destination);
  writeJson(source.receiptPath, receipt);
  verifyArticleAudio(slug, root);
  // Inputs and segments remain privately resumable; transient API job lists do not.
  const jobsPath = path.join(source.cache, 'jobs.jsonl');
  if (fs.existsSync(jobsPath)) fs.unlinkSync(jobsPath);
  return receipt;
}

function verifyArticleAudio(slug, root = ROOT) {
  const receiptPath = path.join(root, 'assets/audio', `${slug}.provenance.json`);
  const receipt = readJson(receiptPath);
  const legacy = receipt.schemaVersion === LEGACY_SCHEMA;
  const source = sourceFor(slug, root, os.tmpdir(), legacy ? LEGACY_SCHEMA : SCHEMA);
  const ended = check => Boolean(check) && check.status === 'passed' && hashPattern.test(check.asrModelSha256 || '');
  for (const [key, value] of Object.entries(source.base)) {
    assert(same(receipt[key], value), `Article audio provenance mismatch: ${key}`);
  }
  assert(typeof receipt.assembledAt === 'string' && Number.isFinite(Date.parse(receipt.assembledAt)), 'Missing assembly timestamp');
  assert(receipt.generator === 'bundled speech skill text_to_speech.py speak-batch', 'Unexpected audio generator');
  assert(receipt.requestId === null, 'Bundled CLI does not provide a request ID');
  assert(same(receipt.transform, TRANSFORM), 'Audio transform/profile mismatch');
  assert(Array.isArray(receipt.chunks) && receipt.chunks.length === source.chunks.length, 'Chunk count mismatch');
  receipt.chunks.forEach((record, index) => {
    const expected = chunkMeta(source.chunks[index]);
    for (const [key, value] of Object.entries(expected)) assert(same(record[key], value), `Chunk ${index + 1} mismatch: ${key}`);
    assert(record.requestId === null, 'Chunk request IDs must disclose CLI limitation');
    assert(hashPattern.test(record.audioSha256), 'Missing chunk audio SHA-256');
    assert(Number.isInteger(record.audioBytes) && record.audioBytes > 0, 'Invalid chunk byte count');
    assert(Number.isFinite(record.durationSeconds) && record.durationSeconds > 0, 'Invalid chunk duration');
    assert(legacy || ended(record.endingCheck), `Chunk ${index + 1} lacks a passed spoken-ending check`);
    const expectedKeys = [...Object.keys(expected), 'requestId', 'audioSha256', 'audioBytes', 'durationSeconds',
      ...(legacy ? [] : ['endingCheck'])].sort();
    assert(same(Object.keys(record).sort(), expectedKeys), 'Unexpected private or unknown field in chunk receipt');
  });
  const audio = fs.readFileSync(path.join(root, source.base.audioPath));
  assert(audio.length > 0 && audio.length < MAX_BYTES && receipt.audioBytes === audio.length, 'Final audio byte count mismatch');
  assert(receipt.audioSha256 === sha256(audio), 'Final audio SHA-256 mismatch');
  assert(Number.isFinite(receipt.durationSeconds) && receipt.durationSeconds > 0, 'Invalid final audio duration');
  const segmentDuration = receipt.chunks.reduce((sum, chunk) => sum + chunk.durationSeconds, 0);
  assert(Math.abs(receipt.durationSeconds - segmentDuration) < Math.max(2, receipt.chunks.length * 0.25), 'Final duration inconsistent with chunks');
  assert(legacy || ended(receipt.endingCheck), 'Assembled recording lacks a passed spoken-ending check');
  const expectedKeys = [...Object.keys(source.base), 'assembledAt', 'generator', 'requestId', 'chunks', 'transform', 'audioSha256', 'audioBytes', 'durationSeconds',
    ...(legacy ? [] : ['endingCheck'])].sort();
  assert(same(Object.keys(receipt).sort(), expectedKeys), 'Unexpected private or unknown field in public receipt');
  const metaPath = path.join(root, 'articles', slug, 'meta.json');
  if (fs.existsSync(metaPath)) {
    const meta = readJson(metaPath);
    if (meta.audio) {
      assert(meta.audio.src === `/${receipt.audioPath}` && meta.audio.transcript === `/${receipt.transcriptPath}` &&
        meta.audio.provenance === `/assets/audio/${slug}.provenance.json`, 'Article audio metadata paths mismatch');
      assert(meta.audio.durationSeconds === receipt.durationSeconds, 'Article audio metadata duration mismatch');
      assert(meta.audio.voiceLabel === 'OpenAI API synthetic voice (fable)', 'Article audio synthetic disclosure mismatch');
    }
  }
  return receipt;
}

function speechCommand(prepared) {
  return ['/opt/homebrew/bin/python3', [SPEECH_CLI, 'speak-batch', '--input', prepared.jobsPath, '--out-dir', prepared.outputDirectory,
    '--model', TTS.model, '--voice', TTS.voice, '--response-format', 'mp3', '--speed', '1',
    '--instructions-file', prepared.instructionsPath, '--attempts', '1', '--rpm', '30']];
}

// Bounded retry loop: each round re-requests only chunks without an accepted take.
function generateArticleAudio(slug, root = ROOT) {
  for (let round = 1; ; round++) {
    const prepared = prepareArticleAudio(slug, root);
    if (prepared.pendingChunks) {
      const [command, args] = speechCommand(prepared);
      const result = spawnSync(command, args, { stdio: ['ignore', 'ignore', 'inherit'], timeout: 3600000 });
      assert(!result.error && result.status === 0, 'Bundled speech CLI failed; partial outputs stay in the private cache');
    }
    try { return assembleArticleAudio(slug, root); }
    catch (error) {
      if (!error.endingFailure || round >= ENDING_ATTEMPTS) throw error;
      console.error(`${error.message}; retrying`);
    }
  }
}

function main(args) {
  assert(args.length === 2 && ['--prepare', '--assemble', '--generate', '--check'].includes(args[0]),
    'Usage: node tools/make-article-audio.js --prepare|--assemble|--generate|--check SLUG');
  const [mode, slug] = args;
  if (mode === '--generate') {
    const receipt = generateArticleAudio(slug);
    console.log(`generated: ${slug}; ${receipt.durationSeconds.toFixed(2)} seconds; ${receipt.audioBytes} bytes; sha256 ${receipt.audioSha256}`);
  } else if (mode === '--prepare') {
    const prepared = prepareArticleAudio(slug);
    console.log(JSON.stringify(prepared, null, 2));
    if (prepared.pendingChunks) {
      const quote = value => `'${value.replace(/'/g, `'\\''`)}'`;
      console.log('\nRun the existing speech CLI with OPENAI_API_KEY already set; never put the key in the command:');
      const [command, commandArgs] = speechCommand(prepared);
      console.log([command, ...commandArgs].map(arg => arg.startsWith('/') ? quote(arg) : arg).join(' '));
    } else console.log('All chunks are available; ready for --assemble.');
  } else {
    const receipt = mode === '--check' ? verifyArticleAudio(slug) : assembleArticleAudio(slug);
    console.log(`${mode === '--check' ? 'verified' : 'assembled'}: ${slug}; ${receipt.durationSeconds.toFixed(2)} seconds; ${receipt.audioBytes} bytes; sha256 ${receipt.audioSha256}`);
  }
}

module.exports = { TTS, LIMITATIONS, TRANSFORM, MAX_CHARS, MAX_BYTES, LEGACY_SCHEMA, SCHEMA, ENDING_ATTEMPTS, sha256,
  chunkTranscript, isHeading, sourceFor, chunkMeta, prepareArticleAudio, assembleArticleAudio, generateArticleAudio, verifyArticleAudio };
if (require.main === module) {
  try { main(process.argv.slice(2)); }
  catch (error) { console.error(error.message); process.exitCode = 1; }
}
