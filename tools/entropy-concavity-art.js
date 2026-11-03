'use strict';
const { bannerSvg } = require('./svg-xml');
// The critical signal fraction for local entropy concavity: banner, OG card and thumbnail.
// "This image helps the reader understand" where, along the signal fraction q = Var X / (Var X + noise variance),
// near-Gaussian symmetric inputs are guaranteed a concave entropy curve and where a local entropy dip at equal
// weighting is possible: concave below 1/2 (Schubr 2026) and on [1/2, 4/7) (Theorem A, new), open at q = 4/7,
// strict midpoint local minima for every q in (4/7, 1] (Luo 2026 for q > 2 - sqrt 2; Theorem B, whose sign on
// (4/7, 2 - sqrt 2] was also proposed in a public GitHub issue). The second scale converts q to the noise-to-signal
// variance ratio (1 - q)/q, which is 3/4 at q = 4/7 (signal-to-noise ratio 4/3).
// Source (paper 0.1.0-candidate, 3 Nov 2026): Section 2.3 (Theorem A, Corollary, Theorem B), Section 2.4 regimes table.
// The two small entropy curves are schematics (shape only, the dip enormously magnified), not data.
// Usage: node tools/entropy-concavity-art.js [--render OUTDIR_FOR_INSPECTION] [--no-mirror]
const SLUG = 'entropy-concavity-four-sevenths';
const ink = '#f4f1ea', muted = '#e3d9c9', dim = '#c4b7a2';
const oldC = '#8fd3b0', newC = '#c6f28a', openC = '#ffd76a', dipC = '#ffab7a';
const SANS = 'Arial,Helvetica,sans-serif', SERIF = 'Georgia,serif';
const text = (x, y, s, size = 18, color = ink, anchor = 'start', weight = 'normal', family = SANS) =>
  `<text class="og-hide" x="${x}" y="${y}" fill="${color}" font-family="${family}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}">${s}</text>`;
const f = v => (+v).toFixed(1);
const R2 = 2 - Math.SQRT2;
// Piecewise-linear q axis, stretched between 0.5 and 0.6 so the new interval is visible (marked on the axis).
const SEG = [[0, 200], [0.5, 440], [0.6, 920], [1, 1150]];
function X(q) {
  for (let i = 1; i < SEG.length; i++) {
    const [q0, x0] = SEG[i - 1], [q1, x1] = SEG[i];
    if (q <= q1 + 1e-12) return x0 + (q - q0) / (q1 - q0) * (x1 - x0);
  }
  throw new Error('q out of range');
}
const BY = 196, BH = 50, AY = BY + BH;
function band(q0, q1, color, opacity, label, size = 16) {
  const x0 = X(q0), x1 = X(q1);
  let s = `<rect x="${f(x0)}" y="${BY}" width="${f(x1 - x0)}" height="${BH}" fill="${color}" fill-opacity="${opacity}"/>`;
  if (label) s += text((x0 + x1) / 2, BY + BH / 2 + size * 0.36, label, size, '#141414', 'middle', 'bold');
  return s;
}
// Schematic entropy curve t -> F(t) on [0,1]: concave arch, optionally with a small dip at t = 1/2.
function curve(x0, y0, w, h, dip, color) {
  const pts = [];
  for (let k = 0; k <= 120; k++) {
    const t = k / 120, arch = 4 * t * (1 - t);
    const d = dip ? 0.32 * Math.exp(-Math.pow((t - 0.5) / 0.075, 2)) : 0;
    pts.push(`${f(x0 + t * w)} ${f(y0 + h - (arch - d) * h)}`);
  }
  return `<path d="M${x0} ${y0 + h} H${x0 + w}" stroke="${dim}" stroke-opacity=".6" stroke-width="1.2"/>` +
    `<path d="M${pts.join(' L')}" stroke="${color}" stroke-width="3" fill="none" stroke-linejoin="round"/>` +
    text(x0, y0 + h + 16, 't = 0', 11, dim) + text(x0 + w / 2, y0 + h + 16, '½', 12, dim, 'middle') + text(x0 + w, y0 + h + 16, '1', 11, dim, 'end');
}
function axis() {
  let s = '';
  s += band(0, 0.5, oldC, 0.62, 'concave') + band(0.5, 4 / 7, newC, 0.95, 'concave: NEW') +
    band(4 / 7, R2, dipC, 0.72, '') + band(R2, 1, dipC, 0.95, 'local entropy dip possible');
  s += `<path d="M${f(X(4 / 7))} ${BY - 28} V${AY + 8}" stroke="${openC}" stroke-width="3.4"/>`;
  s += `<circle cx="${f(X(4 / 7))}" cy="${BY - 30}" r="6" fill="${openC}"/>`;
  s += text(X(4 / 7), BY - 44, '4/7: boundary itself open', 15, openC, 'middle', 'bold');
  s += `<path d="M200 ${AY} H1150" stroke="${muted}" stroke-width="1.6"/>`;
  // Axis-break marks where the scale changes.
  for (const q of [0.5, 0.6]) s += `<path d="M${f(X(q) - 4)} ${AY + 6} l8 -12 M${f(X(q) + 2)} ${AY + 6} l8 -12" stroke="${dim}" stroke-width="1.4"/>`;
  const ticks = [[0, '0', '∞'], [0.5, '1/2', '1'], [4 / 7, '4/7', '3/4'], [R2, '2−√2', '0.71'], [1, '1', '0']];
  for (const [q, lab, ns] of ticks) {
    const x = X(q), c = Math.abs(q - 4 / 7) < 1e-9 ? openC : ink;
    s += `<path d="M${f(x)} ${AY} v7" stroke="${muted}" stroke-width="1.4"/>`;
    s += text(x, AY + 25, lab, 16, c, 'middle', 'bold');
    s += text(x, AY + 50, ns, 15, Math.abs(q - 4 / 7) < 1e-9 ? openC : muted, 'middle', Math.abs(q - 4 / 7) < 1e-9 ? 'bold' : 'normal');
  }
  s += text(185, AY + 25, 'signal fraction q', 14, dim, 'end', 'normal', SERIF);
  s += text(185, AY + 50, 'noise ÷ signal variance', 14, dim, 'end', 'normal', SERIF);
  s += text(675, AY + 74, 'scale stretched between ½ and 0.6', 11.5, dim, 'middle', 'italic', SERIF);
  // Sources under the bands.
  const src = 352;
  s += text(X(0.25), src, 'Schubr 2026', 14, oldC, 'middle');
  s += text(X(0.535) - 6, src, 'Theorem A, this paper', 14, newC, 'middle', 'bold');
  s += text(X(0.8), src - 4, 'Luo 2026 counterexamples;', 14, dipC, 'middle');
  s += text(X(0.8), src + 14, 'Theorem B: exact curvature γ(q)', 14, dipC, 'middle');
  return s;
}
const draw = () =>
  text(40, 50, 'How much Gaussian noise restores entropy concavity? Noise variance above ¾ of the signal', 25, ink, 'start', 'normal', SERIF) +
  text(40, 78, 'Symmetric inputs close to the Gaussian: two noisy copies mixed with weights √t and √(1−t); is entropy concave in t?', 15, muted) +
  curve(240, 104, 160, 52, false, oldC) + text(320, 99, 'entropy vs mixing weight t', 12, dim, 'middle', 'normal', SERIF) +
  curve(960, 104, 160, 52, true, dipC) + text(1040, 99, 'schematic; real dip ~10⁻¹³ nats', 12, dim, 'middle', 'normal', SERIF) +
  axis();
const description = 'Banner for a paper on how much Gaussian noise restores entropy concavity near the Gaussian. A horizontal axis shows the signal fraction q, the share of variance that is signal, from 0 to 1, stretched between one half and 0.6 so the new interval is visible; a second row of labels converts q to the noise-to-signal variance ratio. Coloured bands mark the regimes for symmetric inputs close to the Gaussian: concave below one half (Schubr 2026); concave on the new interval from one half to 4/7 (Theorem A of this paper); at 4/7, where noise variance is three quarters of the signal variance, a yellow marker says the boundary itself is open; above 4/7 a local entropy dip at equal weighting is possible (Luo 2026 counterexamples, with Theorem B giving the exact curvature constant), with a tick at 2 minus root 2. Two small schematic curves of entropy against the mixing weight t show a smooth concave arch on the left and an arch with a dip at t = 1/2 on the right; the dip is enormously magnified, since the real dips are of order 10 to the minus 13 nats.';
function frame(inner, background) {
  return bannerSvg({ inner, description, background, glow: { color: newC, cx: '0.5', cy: '0.6', r: '0.45', opacity: '0.05' } });
}
const thumbSpec = {
  kicker: ['RESEARCH RELEASE · NOVEMBER 2026', 'INFORMATION THEORY'],
  head: ['How much noise', '<em>restores concavity?</em>'], headSize: 62,
  sub: 'Mix two noisy copies of a near-Gaussian signal: entropy is guaranteed concave in the mixing weight exactly when the noise variance exceeds three quarters of the signal variance. The boundary itself is open.',
  tag: 'UNREFEREED CANDIDATE',
  hero: '<div class="eq-label">critical signal fraction</div><div class="hero-title">q = 4/7</div><div class="note">noise &gt; ¾ × signal variance<br>signal-to-noise ratio 4/3<br>local, near-Gaussian result</div><div class="eq-foot">written proofs · fail-closed checks</div>'
};
module.exports = { draw, description, thumbSpec, X };
if (require.main === module) (async () => {
  const fs = require('fs'), pth = require('path'), os = require('os'), vm = require('vm');
  const ROOT = pth.join(__dirname, '..');
  // Guards: the drawn values match the paper (Section 2.1: q = 4/7 means noise variance 3/4 of signal, SNR 4/3).
  if (Math.abs((1 - 4 / 7) / (4 / 7) - 0.75) > 1e-12 || Math.abs((4 / 7) / (3 / 7) - 4 / 3) > 1e-12) throw new Error('constant mismatch');
  if (Math.abs((1 - R2) / R2 - 0.7071) > 1e-4) throw new Error('2 - sqrt 2 label mismatch');
  if (!(X(0.5) < X(4 / 7) && X(4 / 7) < X(R2) && X(R2) < X(1))) throw new Error('axis order');
  const reg = JSON.parse(fs.readFileSync(pth.join(ROOT, 'data/BANNER_PALETTES.json'), 'utf8'));
  const { palettes } = require('./banner-palettes');
  const bsaved = reg.assignments.find(r => r.slug === SLUG); if (!bsaved) throw new Error('no saved banner palette'); const bname = bsaved.palette;
  const tp = require('./thumbnail-palettes');
  const tsaved = tp.load().assignments.find(r => r.slug === SLUG); if (!tsaved) throw new Error('no saved thumbnail palette');
  const tname = tsaved.editorialPalette || tsaved.palette;
  const svg = frame(draw(), { name: bname, colors: palettes[bname] });
  fs.writeFileSync(pth.join(ROOT, 'assets/art', SLUG + '.svg'), svg);
  console.log('art:', SLUG, 'banner palette', bname, '| thumbnail palette', tname);
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
