#!/usr/bin/env node
/* Build the corrected SFS briefing video, captions and upload description.
 *
 * Usage:
 *   node tools/make-sfs-video.js /absolute/output/directory
 *
 * The MP3 and release metadata are the single source of truth. Slides are
 * deliberately claim-bounded communication, not additional evidence.
 */
'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const SLUG = 'sfs-identifiability-audit';
const OUT = path.resolve(process.argv[2] || path.join(os.tmpdir(), `${SLUG}-v0.2.1`));
const AUDIO = path.join(ROOT, 'assets', 'audio', `${SLUG}.mp3`);
const META = JSON.parse(fs.readFileSync(path.join(ROOT, 'papers', SLUG, 'meta.json'), 'utf8'));

const slides = [
  {
    kicker: 'THE EXACT BOUNDARY',
    title: 'A finite histogram cannot identify an entire history',
    lines: [
      'The theorem identifies exactly which linear historical questions the expected finite SFS answers.',
      'Questions outside the kernel span require assumptions or set-valued bounds.'
    ]
  },
  {
    kicker: 'CERTIFIED MACHINERY',
    title: 'Checks within one workflow are not independent reproduction',
    lines: [
      'Certified endpoints and mutation controls pass.',
      'The alternative Tavare-formula route supplies same-producer implementation diversity only.'
    ]
  },
  {
    kicker: 'THE LINKED AUDIT',
    title: 'Stage one was frozen; stage two was data-informed',
    lines: [
      'Stage one: protocol frozen before real-data contact.',
      'Stage two: error-model ladder informed by stage-one diagnostics before interval endpoints were computed.'
    ]
  },
  {
    kicker: 'SETTING-CONDITIONAL RESULT',
    title: 'YRI intervals support depression and exclude claimed severity only at one declared setting',
    lines: [
      '[0.162, 0.934] and [0.132, 0.961]',
      'CEU and CHB exclude severity there but do not establish depression. The full ladder becomes uninformative.'
    ]
  }
];

const esc = value => String(value).replace(/[&<>]/g, character => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;'
}[character]));

function run(command, args, options = {}) {
  const result = spawnSync(command, args, { encoding: 'utf8', ...options });
  if (result.status !== 0) {
    throw new Error(`${command} failed (${result.status}):\n${result.stderr || result.stdout}`);
  }
  return result.stdout.trim();
}

function secondsToSrt(value) {
  const millis = Math.max(0, Math.round(value * 1000));
  const hours = Math.floor(millis / 3600000);
  const minutes = Math.floor((millis % 3600000) / 60000);
  const seconds = Math.floor((millis % 60000) / 1000);
  const remainder = millis % 1000;
  return [hours, minutes, seconds].map(number => String(number).padStart(2, '0')).join(':') +
    `,${String(remainder).padStart(3, '0')}`;
}

function captions(text, duration) {
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  const weights = sentences.map(sentence => sentence.trim().split(/\s+/).length);
  const total = weights.reduce((sum, weight) => sum + weight, 0);
  let cursor = 0;
  return sentences.map((sentence, index) => {
    const end = index === sentences.length - 1
      ? duration
      : cursor + duration * weights[index] / total;
    const block = `${index + 1}\n${secondsToSrt(cursor)} --> ${secondsToSrt(end)}\n${sentence.trim()}\n`;
    cursor = end;
    return block;
  }).join('\n');
}

function slideHtml(slide, index) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>
*{box-sizing:border-box}body{margin:0;width:1280px;height:720px;overflow:hidden;background:linear-gradient(125deg,#04231e,#0a5348 78%,#0f766e 130%);color:#ecfdf5;font-family:Georgia,serif}.grid{position:absolute;inset:0;opacity:.12;background-image:linear-gradient(#ecfdf5 1px,transparent 1px),linear-gradient(90deg,#ecfdf5 1px,transparent 1px);background-size:64px 64px}.wrap{position:absolute;inset:0;padding:54px 66px;display:flex;flex-direction:column}.top{display:flex;justify-content:space-between;align-items:center;font-family:system-ui,sans-serif}.brand{font-size:28px}.brand b{display:inline-flex;width:48px;height:48px;align-items:center;justify-content:center;border:1px solid #fbbf24;border-radius:12px;color:#fbbf24;margin-right:14px}.count{font:18px ui-monospace,monospace;color:#7fd8c4}.kicker{margin-top:54px;font:700 18px ui-monospace,monospace;letter-spacing:.14em;color:#fbbf24}.title{margin:20px 0 30px;max-width:1100px;font-size:${index === 3 ? 48 : 56}px;line-height:1.12}.lines{max-width:1060px;display:grid;gap:18px}.line{font:25px/1.45 system-ui,sans-serif;color:#c9f5e9;padding-left:23px;border-left:4px solid #2dd4bf}.foot{margin-top:auto;display:flex;justify-content:space-between;font:16px ui-monospace,monospace;color:#7fd8c4}.status{color:#fbbf24}
</style></head><body><div class="grid"></div><div class="wrap"><div class="top"><div class="brand"><b>E</b>Evidence Press</div><div class="count">${index + 1} / ${slides.length}</div></div><div class="kicker">${esc(slide.kicker)}</div><h1 class="title">${esc(slide.title)}</h1><div class="lines">${slide.lines.map(line => `<div class="line">${esc(line)}</div>`).join('')}</div><div class="foot"><span class="status">UNREFEREED CANDIDATE · NOT INDEPENDENTLY REPRODUCED</span><span>evidencepress.org</span></div></div></body></html>`;
}

(async () => {
  if (!fs.existsSync(AUDIO)) throw new Error(`missing audio: ${AUDIO}`);
  fs.mkdirSync(OUT, { recursive: true });
  const work = fs.mkdtempSync(path.join(os.tmpdir(), 'sfs-video-'));
  const duration = Number(run('ffprobe', [
    '-v', 'error', '-show_entries', 'format=duration', '-of', 'default=noprint_wrappers=1:nokey=1', AUDIO
  ]));
  if (!Number.isFinite(duration) || duration <= 0) throw new Error(`invalid audio duration: ${duration}`);

  const { chromium } = require('playwright');
  const browser = await chromium.launch(process.env.EVIDENCE_PRESS_CHROME
    ? { executablePath: process.env.EVIDENCE_PRESS_CHROME } : {});
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  const images = [];
  for (let index = 0; index < slides.length; index++) {
    await page.setContent(slideHtml(slides[index], index), { waitUntil: 'networkidle' });
    const file = path.join(work, `slide-${index + 1}.png`);
    await page.screenshot({ path: file });
    images.push(file);
  }
  await browser.close();

  const fractions = [0.20, 0.25, 0.29, 0.26];
  const concat = images.map((file, index) =>
    `file '${file.replace(/'/g, "'\\''")}'\nduration ${(duration * fractions[index]).toFixed(6)}`
  ).join('\n') + `\nfile '${images[images.length - 1].replace(/'/g, "'\\''")}'\n`;
  const concatFile = path.join(work, 'slides.txt');
  fs.writeFileSync(concatFile, concat, 'utf8');

  const video = path.join(OUT, `${SLUG}-v0.2.1.mp4`);
  run('ffmpeg', [
    '-y', '-f', 'concat', '-safe', '0', '-i', concatFile, '-i', AUDIO,
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-pix_fmt', 'yuv420p',
    '-vf', 'fps=30', '-c:a', 'aac', '-b:a', '192k', '-t', duration.toFixed(3),
    '-movflags', '+faststart', video
  ]);

  const transcript = META.narration.trim();
  fs.writeFileSync(path.join(OUT, `${SLUG}-v0.2.1.srt`), captions(transcript, duration), 'utf8');
  fs.writeFileSync(path.join(OUT, `${SLUG}-v0.2.1-transcript.txt`), `${transcript}\n`, 'utf8');
  fs.writeFileSync(path.join(OUT, `${SLUG}-v0.2.1-description.txt`), [
    META.oneLine,
    '',
    'Read the corrected release: https://evidencepress.org/releases/sfs-identifiability-audit/',
    `Candidate paper and evidence: https://doi.org/${META.doi}`,
    `Source repository: ${META.repoUrl}`,
    '',
    'Assurance boundary: unrefereed candidate; producer-side replay only; no unaffiliated rerun, independent reimplementation, specialist review, formal verification or peer review recorded.',
    'The empirical intervals are conditional on the declared error-model setting and deposited spectra. The full concession ladder becomes uninformative.',
    'AI-generated voice. This video is a communication asset, not additional scientific evidence.'
  ].join('\n'), 'utf8');
  console.log(`video: ${video}`);
  console.log(`duration: ${duration.toFixed(3)} seconds`);
})().catch(error => { console.error(error); process.exit(1); });
