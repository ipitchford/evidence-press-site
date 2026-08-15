#!/usr/bin/env node
/* Generates narrated audio briefings via OpenAI TTS → assets/audio/<slug>.mp3
 * Run at authoring time (needs OPENAI_API_KEY):
 *   node tools/make-audio.js [--force] [slug ...]
 * Verify committed provenance without an API key:
 *   node tools/make-audio.js --check [slug ...]
 * The site build does NOT call TTS; it publishes committed media bytes. */
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const FORCE = process.argv.includes('--force');
const CHECK = process.argv.includes('--check');
const REQUESTED = new Set(process.argv.slice(2)
  .filter(arg => !['--force', '--check'].includes(arg)));
if (FORCE && CHECK) { console.error('--force and --check are mutually exclusive'); process.exit(1); }
const KEY = process.env.OPENAI_API_KEY;
if (!CHECK && !KEY) { console.error('Set OPENAI_API_KEY'); process.exit(1); }
const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'assets', 'audio');
fs.mkdirSync(OUT, { recursive: true });

const TTS = Object.freeze({
  provider: 'openai',
  endpoint: 'https://api.openai.com/v1/audio/speech',
  model: 'gpt-4o-mini-tts',
  voice: 'fable',
  responseFormat: 'mp3',
  instructions: 'Calm, clear, unhurried British science-briefing narration, in the style of a public-radio science presenter. Measured pace, warm but neutral tone. Pronounce mathematical names carefully.'
});
const voiceLabel = `OpenAI API synthetic voice (${TTS.voice})`;
const sha256 = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const pathsFor = slug => ({
  audio: path.join(OUT, `${slug}.mp3`),
  transcript: path.join(OUT, `${slug}.txt`),
  receipt: path.join(OUT, `${slug}.provenance.json`)
});

const nice = d => new Date(d + 'T12:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
const narrationFor = meta => meta.narration ||
  `${meta.shortTitle}. An Evidence Press audio briefing, released ${nice(meta.datePublished)}. ` +
  `${meta.abstract} ` +
  `This result has not yet been peer reviewed or independently reproduced. The full paper, the complete evidence package, and open follow-up problems are linked on this page.`;

async function tts(text) {
  const res = await fetch(TTS.endpoint, {
    method: 'POST',
    headers: { Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: TTS.model,
      voice: TTS.voice,
      input: text,
      instructions: TTS.instructions,
      response_format: TTS.responseFormat
    })
  });
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
  const contentType = res.headers.get('content-type') || '';
  if (!contentType.toLowerCase().includes('audio')) {
    throw new Error(`OpenAI TTS returned unexpected content-type ${JSON.stringify(contentType)}`);
  }
  return {
    bytes: Buffer.from(await res.arrayBuffer()),
    contentType,
    requestId: res.headers.get('x-request-id') || null
  };
}

function verify(slug, meta, files) {
  const problems = [];
  for (const [kind, file] of Object.entries(files)) {
    if (!fs.existsSync(file)) problems.push(`missing ${kind}: ${path.relative(ROOT, file)}`);
  }
  if (problems.length) throw new Error(`${slug}: ${problems.join('; ')}`);

  const transcript = fs.readFileSync(files.transcript, 'utf8');
  const receipt = JSON.parse(fs.readFileSync(files.receipt, 'utf8'));
  const audio = fs.readFileSync(files.audio);
  const text = narrationFor(meta).trim();
  if (transcript !== `${text}\n`) problems.push('transcript differs from the generated narration source');
  if (meta.audioVoiceLabel !== voiceLabel) problems.push(`audioVoiceLabel must be ${JSON.stringify(voiceLabel)}`);
  if (receipt.provider !== TTS.provider || receipt.model !== TTS.model || receipt.voice !== TTS.voice)
    problems.push('receipt provider/model/voice differs from the house TTS profile');
  if (receipt.instructions !== TTS.instructions || receipt.responseFormat !== TTS.responseFormat)
    problems.push('receipt instructions/format differs from the house TTS profile');
  if (receipt.inputSha256 !== sha256(Buffer.from(text, 'utf8')))
    problems.push('receipt input hash differs from the generated narration source');
  if (receipt.transcriptSha256 !== sha256(Buffer.from(transcript, 'utf8')))
    problems.push('receipt transcript hash differs from the transcript file');
  if (receipt.audioSha256 !== sha256(audio) || receipt.audioBytes !== audio.length)
    problems.push('receipt audio hash or byte count differs from the MP3');
  if (problems.length) throw new Error(`${slug}: ${problems.join('; ')}`);
  console.log(`verified: ${slug} (${receipt.audioBytes} bytes, sha256 ${receipt.audioSha256})`);
}

(async () => {
  const dirs = fs.readdirSync(path.join(ROOT, 'papers'))
    .filter(d => !d.startsWith('_'))
    .filter(d => !REQUESTED.size || REQUESTED.has(d));
  if (REQUESTED.size && dirs.length !== REQUESTED.size) {
    const missing = [...REQUESTED].filter(d => !dirs.includes(d));
    throw new Error(`unknown release slug(s): ${missing.join(', ')}`);
  }
  for (const d of dirs) {
    const metaPath = path.join(ROOT, 'papers', d, 'meta.json');
    if (!fs.existsSync(metaPath)) continue;
    const m = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
    const slug = m.slug || d;
    const files = pathsFor(slug);
    if (CHECK) { verify(slug, m, files); continue; }
    if (fs.existsSync(files.audio) && !FORCE) { console.log('skip (exists):', slug); continue; }
    const text = narrationFor(m);
    process.stdout.write(`tts: ${slug} (${text.length} chars; ${TTS.model}/${TTS.voice}) ... `);
    const response = await tts(text);
    fs.writeFileSync(files.audio, response.bytes);
    fs.writeFileSync(files.transcript, `${text.trim()}\n`);
    const transcript = fs.readFileSync(files.transcript);
    const receipt = {
      schemaVersion: '1.0',
      slug,
      generatedAt: new Date().toISOString(),
      sourceMetadata: `papers/${d}/meta.json`,
      provider: TTS.provider,
      endpoint: TTS.endpoint,
      model: TTS.model,
      voice: TTS.voice,
      responseFormat: TTS.responseFormat,
      instructions: TTS.instructions,
      inputSha256: sha256(Buffer.from(text.trim(), 'utf8')),
      transcriptPath: `assets/audio/${slug}.txt`,
      transcriptSha256: sha256(transcript),
      audioPath: `assets/audio/${slug}.mp3`,
      audioSha256: sha256(response.bytes),
      audioBytes: response.bytes.length,
      responseContentType: response.contentType,
      requestId: response.requestId
    };
    fs.writeFileSync(files.receipt, `${JSON.stringify(receipt, null, 2)}\n`);
    verify(slug, m, files);
  }
})().catch(e => { console.error(e); process.exit(1); });
