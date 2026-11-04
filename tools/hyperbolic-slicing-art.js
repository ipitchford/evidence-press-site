'use strict';
const { bannerSvg } = require('./svg-xml');
// Hyperbolic geodesic sliced Wasserstein completion: banner, OG card and thumbnail.
// "This image helps the reader understand" that geodesic sliced Wasserstein distance (d = 2, quadratic loss) barely sees depth:
// on one ray, its distance from the centre levels off at pi/2 while the hyperbolic distance grows like r, so points at depth 4
// and 8 are only 0.21 apart; and on the boundary circle the squared distance between two ideal points at angle a is exactly pi*a.
// Source (paper 0.1.0-candidate): Proposition 4.3, formulas (4.8)-(4.9) (Dirac formula, beta_2(a) = pi a), Theorem 2.3
// (diameter, C_{2,2} = pi^2/4), Theorem 4.1 and (4.7) (E_{2,2}(r) ~ 4 log 2 e^{-r}), Corollary 4.2; Figure 1A of the paper.
// Usage: node tools/hyperbolic-slicing-art.js [--render OUTDIR_FOR_INSPECTION] [--no-mirror]
const SLUG = 'hyperbolic-sliced-wasserstein-completion';
const ink = '#f4f1ea', muted = '#e3d9c9', dim = '#c4b7a2';
const ghswC = '#ffcf6e', hypC = '#ff9f8a', ptC = '#8fd3ff', arcC = '#b8f0c8';
const SANS = 'Arial,Helvetica,sans-serif', SERIF = 'Georgia,serif';
const text = (x, y, s, size = 18, color = ink, anchor = 'start', weight = 'normal', family = SANS) =>
  `<text class="og-hide" x="${x}" y="${y}" fill="${color}" font-family="${family}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}">${s}</text>`;
const f = v => (+v).toFixed(1);
// Phi(x) = sum_{j odd} x^j / j^2 for real 0 <= x <= 1 (Proposition 4.3); Phi(1) = pi^2/8.
function Phi(x) { if (x >= 1) return Math.PI * Math.PI / 8; let s = 0, p = x; const x2 = x * x; for (let j = 1; j < 400000 && p > 1e-17; j += 2) { s += p / (j * j); p *= x2; } return s; }
// D_2 between point masses on one ray at hyperbolic radii r and t (d = 2), formula (4.8) with alpha = 0.
function dRay(r, t) { const q = Math.tanh(r / 2), s = Math.tanh(t / 2); return Math.sqrt(Math.max(0, 2 * Phi(q * q) + 2 * Phi(s * s) - 4 * Phi(q * s))); }
const dOrigin = r => Math.sqrt(2 * Phi(Math.tanh(r / 2) ** 2));
// Left: the Klein disc, one ray of points at hyperbolic depth r, and two boundary points at angle alpha.
const CX = 205, CY = 278, RAD = 100;
function discPanel() {
  let s = text(48, 112, 'The Klein disc (d = 2)', 16, ink, 'start', 'bold', SERIF);
  s += text(48, 133, 'geodesics are straight chords · infinity is the boundary circle', 13, dim);
  s += `<circle cx="${CX}" cy="${CY}" r="${RAD}" fill="#ffffff" fill-opacity=".04" stroke="${muted}" stroke-opacity=".75" stroke-width="2"/>`;
  // ray to the right; points at depth r sit at Klein radius tanh r
  s += `<path d="M${CX} ${CY} H${CX + RAD}" stroke="${muted}" stroke-opacity=".5" stroke-width="1.4" stroke-dasharray="4 4"/>`;
  for (const r of [1, 2, 4, 8]) { const x = CX + RAD * Math.tanh(r); s += `<circle cx="${f(x)}" cy="${CY}" r="5.5" fill="${ptC}"/>`; }
  s += text(CX + RAD * Math.tanh(1), CY - 12, 'r = 1', 12, ptC, 'middle');
  s += text(CX + RAD + 8, CY + 24, 'r = 2, 4, 8', 12, ptC, 'start');
  s += `<circle cx="${CX}" cy="${CY}" r="4" fill="${ink}"/>` + text(CX - 10, CY + 18, 'o', 15, ink, 'end', 'normal', SERIF);
  // two ideal points at angle alpha = 70 degrees above the ray
  const a1 = -0.36, a2 = a1 - 1.22; const P = a => [CX + RAD * Math.cos(a), CY + RAD * Math.sin(a)];
  const [u, w] = [P(a1), P(a2)];
  s += `<path d="M${CX} ${CY} L${f(u[0])} ${f(u[1])} M${CX} ${CY} L${f(w[0])} ${f(w[1])}" stroke="${arcC}" stroke-opacity=".6" stroke-width="1.4"/>`;
  s += `<path d="M${f(CX + 40 * Math.cos(a1))} ${f(CY + 40 * Math.sin(a1))} A40 40 0 0 0 ${f(CX + 40 * Math.cos(a2))} ${f(CY + 40 * Math.sin(a2))}" stroke="${arcC}" stroke-width="2" fill="none"/>`;
  s += text(f(CX + 56 * Math.cos((a1 + a2) / 2)), f(CY + 56 * Math.sin((a1 + a2) / 2) + 5), 'α', 16, arcC, 'middle', 'bold', SERIF);
  s += `<circle cx="${f(u[0])}" cy="${f(u[1])}" r="6.5" fill="${arcC}"/><circle cx="${f(w[0])}" cy="${f(w[1])}" r="6.5" fill="${arcC}"/>`;
  s += text(f(u[0] + 12), f(u[1] - 4), 'u', 15, arcC, 'start', 'bold', SERIF) + text(f(w[0] - 12), f(w[1] + 2), 'w', 15, arcC, 'end', 'bold', SERIF);
  s += text(368, 200, 'two points at infinity,', 13.5, arcC, 'start') + text(368, 219, 'angle α apart:', 13.5, arcC, 'start');
  s += text(368, 247, 'distance² = π·α', 19, arcC, 'start', 'bold', SERIF);
  s += text(368, 267, 'exactly (Prop. 4.3)', 12.5, dim, 'start');
  s += text(368, 330, 'far-out points on one ray', 13.5, ptC, 'start') + text(368, 349, 'crowd against the edge', 13.5, ptC, 'start');
  return s;
}
// Right: distance from the centre against hyperbolic depth r.
const PX0 = 690, PX1 = 1150, PY0 = 352, PY1 = 168, RMAX = 8, YMAX = 8;
const PX = r => PX0 + (PX1 - PX0) * r / RMAX, PY = v => PY0 - (PY0 - PY1) * v / YMAX;
function plotPanel() {
  let s = text(PX0 - 50, 112, 'A point moving out along one ray', 16, ink, 'start', 'bold', SERIF);
  s += text(PX0 - 50, 133, 'distance from the centre o, against depth r (quadratic loss)', 13, dim);
  s += `<path d="M${PX0} ${PY1 - 4} V${PY0} H${PX1}" stroke="${muted}" stroke-opacity=".6" stroke-width="1.3" fill="none"/>`;
  for (const v of [0, 2, 4, 6, 8]) s += text(PX0 - 8, f(PY(v) + 4), String(v), 12, dim, 'end');
  for (const r of [0, 2, 4, 6, 8]) s += text(f(PX(r)), PY0 + 19, String(r), 12, dim, 'middle');
  s += text(PX1, PY0 + 37, 'depth r', 12, dim, 'end');
  s += `<path d="M${PX(0)} ${PY(0)} L${f(PX(RMAX))} ${f(PY(RMAX))}" stroke="${hypC}" stroke-width="3.2"/>`;
  s += text(f(PX(4.15)), f(PY(4.9)), 'hyperbolic distance: r', 15, hypC, 'end', 'bold', SERIF);
  let d = '';
  for (let r = 0; r <= RMAX + 1e-9; r += 0.1) d += (d ? ' L' : 'M') + f(PX(r)) + ' ' + f(PY(dOrigin(r)));
  s += `<path d="M${PX(0)} ${f(PY(Math.PI / 2))} H${PX1}" stroke="${ghswC}" stroke-opacity=".55" stroke-width="1.3" stroke-dasharray="5 5"/>`;
  s += `<path d="${d}" stroke="${ghswC}" stroke-width="3.5" fill="none"/>`;
  s += text(PX1, f(PY(Math.PI / 2) - 10), 'sliced distance levels off at π/2', 15, ghswC, 'end', 'bold', SERIF);
  s += text(PX1, f(PY(Math.PI / 2) + 20), `depths 4 and 8: only ${dRay(4, 8).toFixed(2)} apart`, 13.5, ghswC, 'end');
  return s;
}
const draw = () =>
  text(40, 50, 'What hyperbolic sliced Wasserstein distance can and cannot see', 26, ink, 'start', 'normal', SERIF) +
  text(40, 77, 'It converges weakly on the closed disc: mass escaping to infinity lands on the boundary circle, and depth far out is almost invisible', 15, muted) +
  discPanel() + `<path d="M612 100 L 612 380" stroke="${muted}" stroke-opacity=".22" stroke-width="1.2"/>` + plotPanel();
const description = 'Banner for a paper on geodesic hyperbolic sliced Wasserstein distance, drawn for the two-dimensional case with quadratic loss. Left: the Klein disc with centre o; points on one ray at hyperbolic depth r = 1, 2, 4 and 8 crowd against the boundary circle. Two points u and w on the boundary circle, at angle alpha, have squared sliced distance exactly pi times alpha. Right: a plot against depth r. The hyperbolic distance from the centre rises as the straight line r, while the sliced distance levels off at pi/2; points at depths 4 and 8 on the same ray are only 0.21 apart.';
function frame(inner, background) {
  return bannerSvg({ inner, description, background, glow: { color: ghswC, cx: '0.72', cy: '0.45', r: '0.42', opacity: '0.06' } });
}
const thumbSpec = {
  kicker: ['RESEARCH RELEASE · NOVEMBER 2026', 'OPTIMAL TRANSPORT · HYPERBOLIC GEOMETRY'],
  head: ['A distance that', '<em>barely sees depth</em>'], headSize: 64,
  sub: 'Hyperbolic sliced Wasserstein distance measures weak convergence on the closed ball: far-out points at depth 4 and 8 sit only 0.21 apart.',
  tag: 'UNREFEREED CANDIDATE',
  hero: '<div class="eq-label">two points at infinity, angle α apart</div><div class="hero-title">distance² = π · α</div><div class="note">hyperbolic distance: r → ∞<br>sliced distance: levels off at π/2<br>(two dimensions, quadratic loss)</div><div class="eq-foot">written proofs · numerical sanity checks</div>'
};
module.exports = { draw, description, thumbSpec, dRay, dOrigin, Phi };
if (require.main === module) (async () => {
  const fs = require('fs'), pth = require('path'), os = require('os'), vm = require('vm');
  const ROOT = pth.join(__dirname, '..');
  // Guards against the paper: diameter pi for d = 2, p = 2 (Table 2), so D(o, boundary) = pi/2; (4.7) E_{2,2}(r) ~ 4 log 2 e^{-r};
  // beta_2(pi) = pi^2 = 4 C_{2,2}; depth-4 versus depth-8 distance 0.2121 (mpmath polylog).
  if (Math.abs(dOrigin(60) - Math.PI / 2) > 1e-9) throw new Error('limit pi/2 mismatch');
  const e4 = 2 * Phi(Math.tanh(2) ** 2) + 2 * Phi(1) - 4 * Phi(Math.tanh(2));
  if (Math.abs(e4 - 0.0507792203) > 1e-7 || Math.abs(e4 / (4 * Math.log(2) * Math.exp(-4)) - 1) > 1e-3) throw new Error('E_{2,2}(4) mismatch');
  if (Math.abs(dRay(4, 8) - 0.212103412) > 1e-6) throw new Error('depth 4 vs 8 mismatch');
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
