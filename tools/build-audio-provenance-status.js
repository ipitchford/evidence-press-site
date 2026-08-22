#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.resolve(__dirname, '..');
const AUDIO = path.join(ROOT, 'assets', 'audio');
const OUTPUT = path.join(ROOT, 'data', 'AUDIO_PROVENANCE_STATUS.json');
const CHECK = process.argv.includes('--check');
const sha256 = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');

const records = fs.readdirSync(path.join(ROOT, 'papers')).sort().flatMap(directory => {
  const metaPath = path.join(ROOT, 'papers', directory, 'meta.json');
  if (!fs.existsSync(metaPath)) return [];
  const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
  const slug = meta.slug || directory;
  const audio = path.join(AUDIO, `${slug}.mp3`);
  const transcript = path.join(AUDIO, `${slug}.txt`);
  const receiptPath = path.join(AUDIO, `${slug}.provenance.json`);
  if (!fs.existsSync(audio)) throw new Error(`${slug}: missing MP3`);
  const receipt = fs.existsSync(receiptPath) ? JSON.parse(fs.readFileSync(receiptPath, 'utf8')) : null;
  if (receipt && receipt.audioSha256 !== sha256(audio)) throw new Error(`${slug}: provenance audio hash mismatch`);
  if (receipt && fs.existsSync(transcript) && receipt.transcriptSha256 !== sha256(transcript))
    throw new Error(`${slug}: provenance transcript hash mismatch`);
  return [{
    slug,
    audioPath: `assets/audio/${slug}.mp3`,
    audioSha256: sha256(audio),
    transcriptStatus: fs.existsSync(transcript) ? 'source-transcript-recorded' : 'legacy-transcript-not-recorded',
    transcriptPath: fs.existsSync(transcript) ? `assets/audio/${slug}.txt` : null,
    transcriptSha256: fs.existsSync(transcript) ? sha256(transcript) : null,
    provenanceStatus: receipt ? 'recorded' : 'legacy-provenance-not-recorded',
    provenancePath: receipt ? `assets/audio/${slug}.provenance.json` : null,
    provider: receipt ? receipt.provider : null,
    model: receipt ? receipt.model : null,
    voice: receipt ? receipt.voice : null
  }];
});

const document = {
  schemaVersion: '1.0',
  assessedAt: '2026-08-22',
  title: 'Evidence Press release-audio provenance status',
  caveat: 'Null provider, model or voice values mean that original legacy provenance was not recorded. They must not be inferred from how an audio file sounds. Missing legacy transcripts may be added later only as explicitly derived transcripts.',
  records
};
const rendered = `${JSON.stringify(document, null, 2)}\n`;

if (CHECK) {
  if (!fs.existsSync(OUTPUT) || fs.readFileSync(OUTPUT, 'utf8') !== rendered) {
    console.error('data/AUDIO_PROVENANCE_STATUS.json is stale; run node tools/build-audio-provenance-status.js');
    process.exit(1);
  }
  console.log(`Audio provenance status passed for ${records.length} releases.`);
} else {
  fs.writeFileSync(OUTPUT, rendered);
  console.log(`Wrote ${path.relative(ROOT, OUTPUT)} for ${records.length} releases.`);
}
