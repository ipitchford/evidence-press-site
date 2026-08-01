#!/usr/bin/env node
/* Generates narrated audio briefings via OpenAI TTS → assets/audio/<slug>.mp3
 * Run at authoring time (needs OPENAI_API_KEY): node tools/make-audio.js [--force]
 * The site build does NOT require this; it simply picks up any mp3s present. */
'use strict';
const fs = require('fs');
const path = require('path');

const KEY = process.env.OPENAI_API_KEY;
if (!KEY) { console.error('Set OPENAI_API_KEY'); process.exit(1); }
const FORCE = process.argv.includes('--force');
const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'assets', 'audio');
fs.mkdirSync(OUT, { recursive: true });

const nice = d => new Date(d + 'T12:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

async function tts(text, file) {
  const res = await fetch('https://api.openai.com/v1/audio/speech', {
    method: 'POST',
    headers: { Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'gpt-4o-mini-tts',
      voice: 'fable',
      input: text,
      instructions: 'Calm, clear, unhurried British science-briefing narration, in the style of a public-radio science presenter. Measured pace, warm but neutral tone. Pronounce mathematical names carefully.',
      response_format: 'mp3'
    })
  });
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
  fs.writeFileSync(file, Buffer.from(await res.arrayBuffer()));
}

(async () => {
  const dirs = fs.readdirSync(path.join(ROOT, 'papers')).filter(d => !d.startsWith('_'));
  for (const d of dirs) {
    const metaPath = path.join(ROOT, 'papers', d, 'meta.json');
    if (!fs.existsSync(metaPath)) continue;
    const m = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
    const file = path.join(OUT, (m.slug || d) + '.mp3');
    if (fs.existsSync(file) && !FORCE) { console.log('skip (exists):', m.slug || d); continue; }
    const text = `${m.shortTitle}. An Evidence Press audio briefing, released ${nice(m.datePublished)}. ` +
      `${m.narration || m.abstract} ` +
      `This result has not yet been peer reviewed or independently reproduced. The full paper, the complete evidence package, and open follow-up problems are linked on this page.`;
    process.stdout.write(`tts: ${m.slug || d} (${text.length} chars) ... `);
    await tts(text, file);
    console.log(`${(fs.statSync(file).size / 1024).toFixed(0)} KB`);
  }
})().catch(e => { console.error(e); process.exit(1); });
