'use strict';
const { bannerSvg } = require('./svg-xml');
// Reciprocal Mittag-Leffler complete monotonicity: banner, OG card and thumbnail.
// "This image helps the reader understand" that the parameter band conjectured by Garrappa et al. (2025) is too narrow:
// complete monotonicity of 1/E_{alpha,beta} also holds below it for every 1<alpha<2 (Theorem A) and above it near alpha=2,
// up to the zero-collision boundary b(alpha) (Theorem B). Source: paper 0.1.0-candidate (4 Nov 2026), Theorems A and B and Section 12.
// Data: boundary curve b(alpha) from code/boundary_curve.json in the release archive (mpmath 1.4.1, 40 digits; numerical away from alpha=2).
// Usage: node tools/mittag-leffler-band-art.js [--render OUTDIR_FOR_INSPECTION] [--no-mirror]
const SLUG = 'reciprocal-mittag-leffler-complete-monotonicity';
const CURVE = [[1.5, 1.7937], [1.54, 1.875], [1.58, 1.959], [1.62, 2.0455], [1.66, 2.1348], [1.7, 2.2266], [1.74, 2.3211], [1.78, 2.4182], [1.82, 2.518], [1.86, 2.6205], [1.9, 2.7256], [1.94, 2.8333], [1.98, 2.9438], [1.99, 2.9718], [2, 3], [2.01, 3.0284], [2.03, 3.0856], [2.07, 3.202], [2.11, 3.3212], [2.15, 3.443], [2.19, 3.5675], [2.23, 3.6946], [2.27, 3.8245], [2.31, 3.9571], [2.35, 4.0923], [2.39, 4.2303], [2.43, 4.3709], [2.47, 4.5142]];
const ink = '#f4f1ea', muted = '#e3d9c9', dim = '#c4b7a2';
const bandC = '#ffd77a', newC = '#9be3c0', curveC = '#ff9a8a';
const SANS = 'Arial,Helvetica,sans-serif', SERIF = 'Georgia,serif';
const text = (x, y, s, size = 18, color = ink, anchor = 'start', weight = 'normal', family = SANS) =>
  `<text class="og-hide" x="${x}" y="${y}" fill="${color}" font-family="${family}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}">${s}</text>`;
const f = v => (+v).toFixed(1);
const PX0 = 90, PX1 = 690, PY0 = 112, PY1 = 352, A0 = 1, A1 = 2.5, B1 = 5;
const X = a => PX0 + (PX1 - PX0) * (a - A0) / (A1 - A0);
const Y = b => PY1 - (PY1 - PY0) * b / B1;
const poly = (pts, fill, op) => `<path d="${pts.map((p, i) => (i ? 'L' : 'M') + f(X(p[0])) + ' ' + f(Y(p[1]))).join(' ')} Z" fill="${fill}" fill-opacity="${op}"/>`;
function plot() {
  let s = text(PX0, PY0 - 12, 'parameters (α, β) where 1/E is completely monotone (E = Mittag–Leffler E with parameters α, β)', 13, dim);
  s += poly([[1, 0], [2, 1], [2, 0]], newC, 0.32);
  s += poly([[1, 0], [1, 1], [2, 2], [2, 1]], bandC, 0.34);
  const near = CURVE.filter(p => p[0] >= 1.9 && p[0] <= 2.1);
  s += poly([[1.9, 0], ...near, [2.1, 0]], newC, 0.22);
  const d = CURVE.map((p, i) => (i ? 'L' : 'M') + f(X(p[0])) + ' ' + f(Y(p[1]))).join(' ');
  s += `<path d="${d}" fill="none" stroke="${curveC}" stroke-width="2.4" stroke-dasharray="7 5"/>`;
  const dn = near.map((p, i) => (i ? 'L' : 'M') + f(X(p[0])) + ' ' + f(Y(p[1]))).join(' ');
  s += `<path d="${dn}" fill="none" stroke="${curveC}" stroke-width="4"/>`;
  s += `<path d="M${X(2)} ${PY0} V${PY1}" stroke="${muted}" stroke-opacity=".35" stroke-dasharray="3 4"/>`;
  s += `<circle cx="${X(2)}" cy="${Y(3)}" r="5" fill="${curveC}"/>` + text(X(2) + 10, Y(3) + 18, '(2, 3)', 13, curveC, 'start', 'bold');
  s += text(X(1.32), Y(1.05), 'conjectured band', 14, bandC, 'start', 'bold');
  s += text(X(1.55), Y(0.18), 'Theorem A', 14, newC, 'start', 'bold');
  s += text(X(2.12), Y(4.25), 'b(α), numerical', 13, curveC);
  s += `<path d="M${PX0} ${PY1} H${PX1} M${PX0} ${PY1} V${PY0}" stroke="${dim}" stroke-width="1.2"/>`;
  for (const a of [1, 1.5, 2, 2.5]) s += text(X(a), PY1 + 20, String(a), 12, dim, 'middle');
  for (const b of [0, 1, 2, 3, 4, 5]) s += text(PX0 - 10, Y(b) + 4, String(b), 12, dim, 'end');
  s += text((PX0 + PX1) / 2, PY1 + 38, 'order α', 13, dim, 'middle') + text(PX0 - 40, Y(2.5), 'β', 15, dim, 'middle');
  return s;
}
function panel() {
  const RX = 735;
  let s = text(RX, 140, 'The band is too narrow', 28, bandC, 'start', 'bold', SERIF);
  s += `<rect x="${RX}" y="162" width="22" height="14" fill="${bandC}" fill-opacity=".5"/>` + text(RX + 32, 175, 'conjectured: α − 1 ≤ β ≤ α', 16, bandC, 'start', 'bold');
  s += `<rect x="${RX}" y="192" width="22" height="14" fill="${newC}" fill-opacity=".6"/>` + text(RX + 32, 205, 'also true below, every 1 &lt; α &lt; 2', 16, newC, 'start', 'bold');
  s += `<path d="M${RX} 229 h22" stroke="${curveC}" stroke-width="4"/>` + text(RX + 32, 235, 'near α = 2: exactly up to b(α)', 16, curveC, 'start', 'bold');
  s += text(RX, 275, 'b(2) = 3, slope b′(2) ≈ 2.83 (exact formula)', 15, ink, 'start', 'normal', SERIF);
  s += text(RX, 297, 'where two zeros of E collide', 15, ink, 'start', 'normal', SERIF);
  s += text(RX, 331, 'dashed curve: computed, not proved', 13, dim);
  s += text(RX, 349, 'away from α = 2 (a conjecture)', 13, dim);
  return s;
}
const draw = () =>
  text(40, 52, 'When is 1/E completely monotone? More often than conjectured', 26, ink, 'start', 'normal', SERIF) +
  text(40, 80, 'Two-parameter Mittag–Leffler function; regions proved in this release versus the 2025 conjecture', 15, muted) +
  plot() + `<path d="M712 108 L 712 372" stroke="${muted}" stroke-opacity=".22" stroke-width="1.2"/>` + panel();
const description = 'Banner for a paper on the two-parameter Mittag-Leffler function. Left: the (alpha, beta) parameter plane for alpha from 1 to 2.5 and beta from 0 to 5. A gold strip marks the band alpha minus 1 to alpha conjectured in 2025 to be exactly where one over E is completely monotone. A green triangle below it marks the region proved here for every alpha between 1 and 2 (Theorem A). A red curve rising through the point (2, 3) marks the boundary b(alpha): solid near alpha equals 2, where it is proved to be the exact boundary (Theorem B), and dashed elsewhere, where it is computed numerically. Right, in gold: The band is too narrow. Also true below the band for every order between 1 and 2; near order 2, true exactly up to b(alpha), with b(2) = 3 and slope about 2.83, where two zeros collide.';
function frame(inner, background) {
  return bannerSvg({ inner, description, background, glow: { color: newC, cx: '0.30', cy: '0.55', r: '0.42', opacity: '0.06' } });
}
const thumbSpec = {
  kicker: ['RESEARCH RELEASE · NOVEMBER 2026', 'ANALYSIS · SPECIAL FUNCTIONS'],
  head: ['The band is', '<em>too narrow</em>'], headSize: 76,
  sub: 'One over the Mittag–Leffler function is completely monotone below the conjectured band for every order between 1 and 2, and up to an exact boundary near order 2.',
  tag: 'UNREFEREED CANDIDATE',
  hero: '<div class="eq-label">near order α = 2</div><div class="hero-title">b(2) = 3</div><div class="note">conjectured: α − 1 ≤ β ≤ α<br>proved: 0 &lt; β ≤ α, all 1 &lt; α &lt; 2<br>slope b′(2) ≈ 2.83</div><div class="eq-foot">written proofs · exact and 90-digit checks</div>'
};
module.exports = { draw, description, thumbSpec };
if (require.main === module) (async () => {
  const fs = require('fs'), pth = require('path'), os = require('os'), vm = require('vm');
  const ROOT = pth.join(__dirname, '..');
  // Guards: the drawn curve passes through (2, 3) and lies above beta = alpha for the computed alpha < 2 (Section 12 table).
  const at2 = CURVE.find(p => p[0] === 2); if (!at2 || at2[1] !== 3) throw new Error('curve does not pass through (2,3)');
  for (const p of CURVE) if (p[0] < 2 && !(p[1] > p[0])) throw new Error('curve below beta = alpha at ' + p[0]);
  const reg = JSON.parse(fs.readFileSync(pth.join(ROOT, 'data/BANNER_PALETTES.json'), 'utf8'));
  const { palettes } = require('./banner-palettes');
  const bsaved = reg.assignments.find(r => r.slug === SLUG); if (!bsaved) throw new Error('no saved banner palette'); const bname = bsaved.palette;
  const tp = require('./thumbnail-palettes');
  const tsaved = tp.load().assignments.find(r => r.slug === SLUG); if (!tsaved) throw new Error('no saved thumbnail palette');
  const tname = tsaved.editorialPalette || tsaved.palette;
  const svg = frame(draw(), { name: bname, colors: palettes[bname] });
  fs.writeFileSync(pth.join(ROOT, 'assets/art', SLUG + '.svg'), svg);
  console.log('art:', SLUG, 'banner palette', bname, '| thumbnail palette', tname, '| curve points', CURVE.length);
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
