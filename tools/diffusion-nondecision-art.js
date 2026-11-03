'use strict';
const { bannerSvg } = require('./svg-xml');
// Identification of decision and nondecision time in the fixed-parameter diffusion model: banner, OG card and thumbnail.
// "This image helps the reader understand" that, with an unbiased start, two different splits of response time into
// decision and nondecision time give exactly the same data: story 1 (distance to each boundary h = 0.6, mean decision
// time 0.333 s, fixed 0.25 s delay) and story 2 (h = 0.3, mean decision time 0.083 s, mean delay 0.500 s) both give
// mean response time 0.583 s and the same full response-time distribution.
// Source (paper 0.1.0-candidate, 3 Nov 2026): Section 1, Table 1 and Figure 1 (c = v h = 0.5, unit diffusion coefficient,
// time in seconds); Lemma 3 (story 2 = story 1 decision time split as T_0.3 + independent Z); Theorem 1 (unique split iff the
// conditional response-time laws are not all identical); design rules of Section 8.1. The plotted density is the exact
// first-exit density of story 1 shifted by 0.25 s (eigenfunction series), which by Lemma 3 is also story 2's density.
// Usage: node tools/diffusion-nondecision-art.js [--render OUTDIR_FOR_INSPECTION] [--no-mirror]
const SLUG = 'diffusion-nondecision-identification';
const ink = '#f4f1ea', muted = '#e3d9c9', dim = '#c4b7a2';
const decC = '#9fd2ff', delC = '#ffcf7a', rtC = '#9be3c0', okC = '#f2a7c3';
const SANS = 'Arial,Helvetica,sans-serif', SERIF = 'Georgia,serif';
const text = (x, y, s, size = 18, color = ink, anchor = 'start', weight = 'normal', family = SANS) =>
  `<text class="og-hide" x="${x}" y="${y}" fill="${color}" font-family="${family}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}">${s}</text>`;
const f = v => (+v).toFixed(1);

// Table 1 values (exact).
const C = 0.5, H1 = 0.6, H2 = 0.3, D1 = 0.25;
const meanDT = h => h * h * Math.tanh(C) / C; // E T = h^2 tanh(c)/c for a centred start, unit diffusion
const MDT1 = meanDT(H1), MDT2 = meanDT(H2), MRT = MDT1 + D1, MD2 = MRT - MDT2;
// Exact first-exit density from the centre of (-h, h) with drift v = c/h (both boundaries combined).
function exitDensity(t, h) {
  const a = 2 * h, v = C / h, z = h; let s = 0;
  for (let k = 1; k < 400; k += 2) s += k * Math.exp(-k * k * Math.PI * Math.PI * t / (2 * a * a)) * Math.sin(k * Math.PI * z / a);
  return Math.PI / (a * a) * Math.exp(-v * v * t / 2) * (Math.exp(-v * z) + Math.exp(v * z)) * s;
}
const rtDensity = t => (t <= D1 ? 0 : exitDensity(t - D1, H1));

// Left: stacked mean-time bars on a common seconds axis.
const BX0 = 210, BX1 = 640, TMAX = 0.7;
const BX = t => BX0 + t / TMAX * (BX1 - BX0);
function boundaryGlyph(x, yMid, h, color) {
  const half = h * 52; // 52 px per sqrt(s)
  return `<path d="M${x - 26} ${f(yMid - half)} H${x + 26} M${x - 26} ${f(yMid + half)} H${x + 26}" stroke="${muted}" stroke-width="2"/>` +
    `<path d="M${x - 26} ${f(yMid)} H${x + 26}" stroke="${muted}" stroke-opacity=".25" stroke-width="1" stroke-dasharray="3 3"/>` +
    `<circle cx="${x - 26}" cy="${f(yMid)}" r="4" fill="${color}"/>`;
}
function story(y, name, h, dt, delay, delayLabel) {
  let s = text(40, y - 18, name, 17, ink, 'start', 'bold', SERIF);
  s += text(40, y + 4, `h = ${h.toFixed(1)}`, 15, dim);
  s += boundaryGlyph(150, y - 3, h, decC);
  s += `<rect x="${BX0}" y="${y - 20}" width="${f(BX(dt) - BX0)}" height="30" rx="3" fill="${decC}" fill-opacity=".85"/>`;
  s += `<rect x="${f(BX(dt))}" y="${y - 20}" width="${f(BX(dt + delay) - BX(dt))}" height="30" rx="3" fill="${delC}" fill-opacity=".85"/>`;
  s += text(BX(dt / 2), y + 32, `${dt.toFixed(3)} s`, 14, decC, 'middle', 'bold');
  s += text(BX(dt + delay / 2), y + 32, delayLabel, 14, delC, 'middle', 'bold');
  s += text(BX(dt + delay) + 10, y + 1, `= ${(dt + delay).toFixed(3)} s`, 15, ink, 'start', 'bold');
  return s;
}
function bars() {
  let s = text(BX0, 116, 'mean decision time', 14, decC, 'start', 'bold') + text(BX0 + 160, 116, '+ mean nondecision time', 14, delC, 'start', 'bold');
  s += story(170, 'Story 1', H1, MDT1, D1, '0.250 s fixed');
  s += story(262, 'Story 2', H2, MDT2, MD2, `${MD2.toFixed(3)} s random`);
  for (let t = 0; t <= TMAX + 1e-9; t += 0.1) s += `<path d="M${f(BX(t))} 314 v5" stroke="${dim}" stroke-width="1.2"/>` + text(BX(t), 334, t.toFixed(1), 12, dim, 'middle');
  s += `<path d="M${BX0} 314 H${BX1}" stroke="${dim}" stroke-opacity=".5" stroke-width="1"/>`;
  s += text(BX1, 352, 'seconds', 12, dim, 'end');
  s += text(40, 352, 'h = distance from an unbiased start to', 12, dim) + text(40, 367, 'each boundary (units √s, drift × h = 0.5)', 12, dim);
  return s;
}
// Right: the single observed response-time density.
const PX0 = 735, PX1 = 1160, PY0 = 312, PY1 = 140, PTMAX = 1.6;
const PX = t => PX0 + t / PTMAX * (PX1 - PX0);
let PEAK = 0; for (let k = 1; k <= 1600; k++) PEAK = Math.max(PEAK, rtDensity(k / 1000));
const PY = d => PY0 - d / (PEAK * 1.08) * (PY0 - PY1);
function density() {
  let s = text(PX0 - 12, 116, 'Both stories predict this response-time', 14, rtC, 'start', 'bold') + text(PX0 - 12, 133, 'distribution exactly, for each response', 14, rtC, 'start', 'bold');
  const pts = []; for (let k = 0; k <= 400; k++) { const t = PTMAX * k / 400; pts.push(`${f(PX(t))} ${f(PY(rtDensity(t)))}`); }
  s += `<path d="M${PX0} ${PY0} L${pts.join(' L')} L${PX1} ${PY0} Z" fill="${rtC}" fill-opacity=".14"/>`;
  s += `<path d="M${pts.join(' L')}" stroke="${rtC}" stroke-width="3" fill="none" stroke-linejoin="round"/>`;
  s += `<path d="M${f(PX(MRT))} ${PY0} V${PY1 + 18}" stroke="${ink}" stroke-opacity=".6" stroke-width="1.4" stroke-dasharray="4 4"/>`;
  s += text(PX(MRT) + 8, PY1 + 30, `mean ${MRT.toFixed(3)} s`, 13, ink, 'start', 'bold');
  s += `<path d="M${PX0} ${PY0} H${PX1}" stroke="${dim}" stroke-opacity=".5" stroke-width="1"/>`;
  for (let t = 0; t <= PTMAX + 1e-9; t += 0.4) s += `<path d="M${f(PX(t))} ${PY0} v5" stroke="${dim}" stroke-width="1.2"/>` + text(PX(t), PY0 + 20, t.toFixed(1), 12, dim, 'middle');
  s += text(PX1, PY0 + 38, 'response time (s)', 12, dim, 'end');
  s += text(PX0 - 12, 368, 'Separable with a biased start, or two unbiased', 13, okC, 'start', 'bold');
  s += text(PX0 - 12, 384, 'conditions differing in caution or evidence strength', 13, okC, 'start', 'bold');
  return s;
}
const draw = () =>
  text(40, 52, 'Same data, two stories: how much of a response is deciding?', 26, ink, 'start', 'normal', SERIF) +
  text(40, 80, 'Diffusion model with an unbiased start and an unspecified nondecision time: the split is not determined', 15, muted) +
  bars() + `<path d="M700 104 L 700 384" stroke="${muted}" stroke-opacity=".22" stroke-width="1.2"/>` + density();
const description = 'Banner for a paper on when response times identify decision and nondecision time in the fixed-parameter diffusion model. Left: two stories for the same experimental condition with an unbiased start, drawn as stacked bars on a seconds axis. Story 1 has distance 0.6 from the start to each boundary, a mean decision time of 0.333 seconds and a fixed nondecision time of 0.250 seconds, total 0.583 seconds. Story 2 halves the boundary distance to 0.3, so its mean decision time is a quarter as long, 0.083 seconds, and adds a random nondecision time with mean 0.500 seconds, again totalling 0.583 seconds. Small glyphs show the two boundary pairs, the second half as far apart. Right: the single exact response-time density that both stories predict, a skewed curve starting at 0.25 seconds with mean 0.583 seconds; the two stories give exactly the same distribution for each response, so no amount of data from this condition can tell them apart. A note says the split becomes determined with a biased start, or with two unbiased conditions that differ in caution or evidence strength. Values are from the paper’s Table 1; boundary distances are in units of square-root seconds with the diffusion coefficient fixed at one.';
function frame(inner, background) {
  return bannerSvg({ inner, description, background, glow: { color: decC, cx: '0.3', cy: '0.55', r: '0.42', opacity: '0.06' } });
}
const thumbSpec = {
  kicker: ['RESEARCH RELEASE · NOVEMBER 2026', 'MATHEMATICAL PSYCHOLOGY · RESPONSE TIMES'],
  head: ['Same data,', '<em>two stories</em>'], headSize: 80,
  sub: 'When can response times separate deciding from everything else? Exactly when the responses’ time distributions differ.',
  tag: 'UNREFEREED CANDIDATE',
  hero: '<div class="eq-label">identical response times</div><div class="hero-title" style="font-size:52px">0.33 + 0.25 s</div><div class="note">decision + delay, boundary 0.6</div><div class="hero-title" style="font-size:52px">0.08 + 0.50 s</div><div class="note">decision + delay, boundary 0.3</div><div class="eq-foot">both: mean 0.583 s · same distribution</div>'
};
module.exports = { draw, description, thumbSpec, exitDensity, meanDT };
if (require.main === module) (async () => {
  const fs = require('fs'), pth = require('path'), os = require('os'), vm = require('vm');
  const ROOT = pth.join(__dirname, '..');
  // Guards: Table 1 values and the density.
  if (Math.abs(MDT1 - 0.332724) > 5e-7 || Math.abs(MDT2 - 0.083181) > 5e-7 || Math.abs(MD2 - 0.499543) > 5e-7 || Math.abs(MRT - 0.582724) > 5e-7) throw new Error('Table 1 mismatch');
  let mass = 0, mean = 0; const dt = 1e-4; for (let t = dt / 2; t < 8; t += dt) { const d = exitDensity(t, H1); mass += d * dt; mean += t * d * dt; }
  if (Math.abs(mass - 1) > 1e-4 || Math.abs(mean - MDT1) > 1e-4) throw new Error('density check failed: ' + mass + ' ' + mean);
  const reg = JSON.parse(fs.readFileSync(pth.join(ROOT, 'data/BANNER_PALETTES.json'), 'utf8'));
  const { palettes } = require('./banner-palettes');
  const bsaved = reg.assignments.find(r => r.slug === SLUG); if (!bsaved) throw new Error('no saved banner palette'); const bname = bsaved.palette;
  const tp = require('./thumbnail-palettes');
  const tsaved = tp.load().assignments.find(r => r.slug === SLUG); if (!tsaved) throw new Error('no saved thumbnail palette');
  const tname = tsaved.editorialPalette || tsaved.palette;
  const svg = frame(draw(), { name: bname, colors: palettes[bname] });
  fs.writeFileSync(pth.join(ROOT, 'assets/art', SLUG + '.svg'), svg);
  console.log('art:', SLUG, 'banner palette', bname, '| thumbnail palette', tname, '| density mass', mass.toFixed(6), 'mean', mean.toFixed(6));
  const i = process.argv.indexOf('--render');
  if (i < 0) return;
  const inspect = process.argv[i + 1];
  fs.mkdirSync(inspect, { recursive: true });
  const { chromium } = require('playwright');
  const b = await chromium.launch(process.env.EVIDENCE_PRESS_CHROME ? { executablePath: process.env.EVIDENCE_PRESS_CHROME } : {});
  const shot = async (w, h, html, file, opts = {}) => {
    const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: opts.dpr || 1 });
    await p.setContent(html, { waitUntil: 'networkidle' });
    await p.screenshot({ path: file, ...(opts.jpeg ? { type: 'jpeg', quality: 94 } : {}) });
    await p.close();
  };
  const body = (w, h, inner) => `<!DOCTYPE html><html><head><meta charset="utf-8"><style>*{margin:0}body{width:${w}px;height:${h}px;background:#222}svg{width:${w}px;height:${h}px;display:block}</style></head><body>${inner}</body></html>`;
  await shot(1200, 400, body(1200, 400, svg), pth.join(inspect, 'banner-full-2x.png'), { dpr: 2 });
  await shot(400, 133, body(400, 133, svg), pth.join(inspect, 'banner-card-400.png'), { dpr: 2 });
  await shot(358, 119, body(358, 119, svg), pth.join(inspect, 'banner-card-358-mobile.png'), { dpr: 2 });
  const og = fs.readFileSync(pth.join(__dirname, 'make-og.js'), 'utf8');
  const htmlSrc = og.slice(og.indexOf('const html = '), og.indexOf('\n(async () =>'));
  const ogHtml = vm.runInNewContext(htmlSrc + '; html', {});
  const m = JSON.parse(fs.readFileSync(pth.join(ROOT, 'papers', SLUG, 'meta.json'), 'utf8'));
  const ogFile = pth.join(ROOT, 'assets/og', SLUG + '.png');
  await shot(1200, 630, ogHtml(m, svg.replace(/<svg /, '<svg preserveAspectRatio="xMidYMid slice" ')), ogFile);
  fs.copyFileSync(ogFile, pth.join(inspect, 'og-card.png'));
  const th = fs.readFileSync(pth.join(__dirname, 'make-thumb.js'), 'utf8');
  const palSrc = th.slice(th.indexOf('const PALETTES = '), th.indexOf('const savedPalettes'));
  const pageSrc = th.slice(th.indexOf('const page = (spec) =>'), th.indexOf('\n(async () =>'));
  const thumbPage = vm.runInNewContext(`const W = 1280, H = 720; ${palSrc}; ${pageSrc}; page`, {});
  const thumbFile = pth.join(ROOT, 'thumbs', SLUG + '.jpg');
  await shot(1280, 720, thumbPage({ ...thumbSpec, palette: tname }), thumbFile, { dpr: 2, jpeg: true });
  fs.copyFileSync(thumbFile, pth.join(inspect, 'thumbnail.jpg'));
  if (process.argv.includes('--no-mirror')) { await b.close(); console.log('rendered (central mirror skipped)'); return; }
  const central = pth.join(process.env.EVIDENCE_PRESS_THUMBNAIL_DIR || pth.join(os.homedir(), 'thumbs'), SLUG + '.jpg');
  if (fs.existsSync(central) && !fs.readFileSync(thumbFile).equals(fs.readFileSync(central))) throw new Error('central thumbnail exists; refusing to overwrite: ' + central);
  fs.copyFileSync(thumbFile, central);
  if (!fs.readFileSync(thumbFile).equals(fs.readFileSync(central))) throw new Error('central mirror mismatch');
  await b.close();
  console.log('rendered OG, thumbnail, mirror and inspection PNGs');
})().catch(e => { console.error(e); process.exit(1); });
