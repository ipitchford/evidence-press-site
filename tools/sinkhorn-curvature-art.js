'use strict';
const { bannerSvg } = require('./svg-xml');
// Extrinsic curvature bias of Sinkhorn metrics: banner, OG card and thumbnail.
// "This image helps the reader understand" that with the straight-line (chord) cost, the Sinkhorn metric on a curved
// manifold reads slightly short at small eps: on a circle of radius R every mode is multiplied by 1 - eps/(4R^2) to first
// order, and two curves of the same length 2*pi (round circle, ellipse 1.3 x 0.6443) have the same limit g0 = 1/2 for
// phi = cos s but different first-order bias coefficients, -1/8 and -0.0426, because the bias depends on the embedding.
// Source (paper 0.1.0-candidate): Theorem 2.1 (first correction -(eps/4) int <Q grad phi, grad phi> dmu), Section 9.1
// (circle eigenvalues, (39)), Proposition 10.1 and its Example (i) (curves of equal length; -1/8 and -0.04262).
// Usage: node tools/sinkhorn-curvature-art.js [--render OUTDIR_FOR_INSPECTION] [--no-mirror]
const SLUG = 'sinkhorn-metric-curvature-bias';
const ink = '#f4f1ea', muted = '#e3d9c9', dim = '#c4b7a2';
const arcC = '#b8f0c8', chordC = '#ffcf6e', ellC = '#ff9f8a', circC = '#8fd3ff';
const SANS = 'Arial,Helvetica,sans-serif', SERIF = 'Georgia,serif';
const text = (x, y, s, size = 18, color = ink, anchor = 'start', weight = 'normal', family = SANS) =>
  `<text class="og-hide" x="${x}" y="${y}" fill="${color}" font-family="${family}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}">${s}</text>`;
const f = v => (+v).toFixed(1);
const EA = 1.3, EB = 0.6443;
// Ellipse x = a cos t, y = b sin t: speed and curvature.
const speed = t => Math.hypot(EA * Math.sin(t), EB * Math.cos(t));
const kappa = t => EA * EB / speed(t) ** 3;
// Length, and the first-order coefficient -(1/4) (1/2pi) int kappa^2 sin^2 s ds (phi = cos s, s from the major-axis end),
// plus the direction-averaged coefficient -(1/8) (1/2pi) int kappa^2 ds (Proposition 10.1, Example (i)).
function ellipseNumbers(n = 200000) {
  let L = 0, s = 0, c = 0, avg = 0; const h = 2 * Math.PI / n;
  for (let i = 0; i < n; i++) { const t = (i + 0.5) * h, ds = speed(t) * h; L += ds; }
  for (let i = 0; i < n; i++) { const t = (i + 0.5) * h, ds = speed(t) * h, sm = s + ds / 2, k2 = kappa(t) ** 2;
    c += k2 * Math.sin(sm) ** 2 * ds; avg += k2 * ds; s += ds; }
  return { L, coef: -c / (4 * 2 * Math.PI), avg: -avg / (8 * 2 * Math.PI) };
}
// Left: a circle of radius R; the cost uses the chord, the geometry the arc.
const CX = 150, CY = 262, RAD = 96;
function chordPanel() {
  let s = text(40, 116, 'Cost measured through space', 16, ink, 'start', 'bold', SERIF);
  s += text(40, 137, 'Sinkhorn uses |x − y|², the chord; the surface geometry uses the arc', 13, dim);
  s += `<circle cx="${CX}" cy="${CY}" r="${RAD}" fill="#ffffff" fill-opacity=".04" stroke="${muted}" stroke-opacity=".55" stroke-width="1.6"/>`;
  const a1 = -2.55, a2 = -0.59; const P = a => [CX + RAD * Math.cos(a), CY + RAD * Math.sin(a)];
  const [u, w] = [P(a1), P(a2)];
  s += `<path d="M${f(u[0])} ${f(u[1])} A${RAD} ${RAD} 0 0 1 ${f(w[0])} ${f(w[1])}" stroke="${arcC}" stroke-width="4" fill="none"/>`;
  s += `<path d="M${f(u[0])} ${f(u[1])} L${f(w[0])} ${f(w[1])}" stroke="${chordC}" stroke-width="3" stroke-dasharray="7 5"/>`;
  s += `<circle cx="${f(u[0])}" cy="${f(u[1])}" r="6" fill="${ink}"/><circle cx="${f(w[0])}" cy="${f(w[1])}" r="6" fill="${ink}"/>`;
  s += text(CX, CY - RAD - 12, 'arc (on the curve)', 13.5, arcC, 'middle', 'bold');
  s += text(CX, f((u[1] + w[1]) / 2 + 22), 'chord (the cost)', 13.5, chordC, 'middle', 'bold');
  s += `<path d="M${CX} ${CY} L${f(CX + RAD * Math.cos(1.9))} ${f(CY + RAD * Math.sin(1.9))}" stroke="${muted}" stroke-opacity=".6" stroke-width="1.3"/>`;
  s += text(f(CX + 0.55 * RAD * Math.cos(1.9) - 10), f(CY + 0.55 * RAD * Math.sin(1.9)), 'R', 15, muted, 'end', 'bold', SERIF);
  s += text(272, 222, 'chord shorter than arc, so', 13.5, chordC, 'start');
  s += text(272, 241, 'at small ε each mode reads', 13.5, chordC, 'start');
  s += text(272, 272, 'metric × (1 − ε/4R²)', 21, chordC, 'start', 'bold', SERIF);
  s += text(272, 294, 'circle of radius R, first order', 12.5, dim, 'start');
  s += text(272, 335, 'general surface: bias', 13.5, muted, 'start');
  s += text(272, 354, '(ε/4)·∫⟨Q∇φ, ∇φ⟩ dμ', 15, muted, 'start', 'bold', SERIF);
  s += text(272, 373, 'Q = squared bending in space', 12.5, dim, 'start');
  return s;
}
// Right: two curves of the same length 2*pi; stroke width shows squared curvature (where the chord cuts most).
function ellipsePath(cx, cy, sc) {
  let d = ''; const n = 240;
  for (let i = 0; i <= n; i++) { const t = 2 * Math.PI * i / n; d += (i ? ' L' : 'M') + f(cx + sc * EA * Math.cos(t)) + ' ' + f(cy - sc * EB * Math.sin(t)); }
  return d + ' Z';
}
function curvatureDots(cx, cy, sc, xf, yf, kf, color) {
  let s = ''; const n = 64;
  for (let i = 0; i < n; i++) { const t = 2 * Math.PI * (i + 0.5) / n, k = kf(t);
    s += `<circle cx="${f(cx + sc * xf(t))}" cy="${f(cy - sc * yf(t))}" r="${(1.2 + 2.6 * Math.min(k * k, 4) / 4 * 2).toFixed(2)}" fill="${color}" fill-opacity=".9"/>`; }
  return s;
}
function equalLengthPanel(nums) {
  const X0 = 630;
  let s = text(X0, 116, 'Same length, different bias', 16, ink, 'start', 'bold', SERIF);
  s += text(X0, 137, 'two closed curves of length 2π, uniform density, direction φ = cos s', 13, dim);
  const sc = 72, c1 = [X0 + 95, 262], c2 = [X0 + 375, 262];
  s += `<circle cx="${c1[0]}" cy="${c1[1]}" r="${sc}" stroke="${circC}" stroke-width="2.4" fill="none"/>`;
  s += curvatureDots(c1[0], c1[1], sc, Math.cos, Math.sin, () => 1, circC);
  s += `<path d="${ellipsePath(c2[0], c2[1], sc)}" stroke="${ellC}" stroke-width="2.4" fill="none"/>`;
  s += curvatureDots(c2[0], c2[1], sc, t => EA * Math.cos(t), t => EB * Math.sin(t), kappa, ellC);
  s += text(c1[0], 362, 'round circle', 14, circC, 'middle', 'bold');
  s += text(c2[0], 362, 'ellipse 1.3 × 0.644', 14, ellC, 'middle', 'bold');
  s += text(c1[0], 384, 'bias coefficient −0.125', 13.5, circC, 'middle');
  s += text(c2[0], 384, `bias coefficient ${nums.coef.toFixed(3).replace('-', '−')}`, 13.5, ellC, 'middle');
  s += text(X0 + 235, 210, 'same limit', 13, muted, 'middle') + text(X0 + 235, 228, 'g₀ = 1/2', 15, muted, 'middle', 'bold', SERIF);
  s += text(X0 + 235, 290, 'dot size:', 12, dim, 'middle') + text(X0 + 235, 306, 'curvature²', 12, dim, 'middle');
  return s;
}
const draw = () => {
  const nums = ellipseNumbers();
  return text(40, 50, 'On curved data, Sinkhorn metrics read slightly short', 26, ink, 'start', 'normal', SERIF) +
    text(40, 77, 'The ε → 0 limit is the right Wasserstein metric, but the first error depends on how the surface bends in space', 15, muted) +
    chordPanel() + `<path d="M598 100 L 598 385" stroke="${muted}" stroke-opacity=".22" stroke-width="1.2"/>` + equalLengthPanel(nums);
};
const description = 'Banner for a paper on the small-regularisation limit of Sinkhorn metrics on curved manifolds. Left: a circle of radius R with two points joined by the arc along the circle and by the shorter straight chord, which is what the transport cost measures; because the chord is shorter than the arc, at small epsilon each mode of the metric is multiplied by 1 minus epsilon over 4 R squared, and on a general surface the bias is epsilon over 4 times the integral of Q grad phi dot grad phi, with Q the squared bending of the surface in space. Right: a round circle and an ellipse with semi-axes 1.3 and 0.644, both of length 2 pi, with dots sized by squared curvature. For the direction phi = cos s both have the same limiting value g0 = 1/2, but the first-order bias coefficient is -0.125 for the circle and -0.043 for the ellipse: the bias depends on the embedding, not only on the intrinsic shape.';
function frame(inner, background) {
  return bannerSvg({ inner, description, background, glow: { color: chordC, cx: '0.3', cy: '0.6', r: '0.4', opacity: '0.06' } });
}
const thumbSpec = {
  kicker: ['RESEARCH RELEASE · NOVEMBER 2026', 'OPTIMAL TRANSPORT · GEOMETRY'],
  head: ['Same curve length,', '<em>different bias</em>'], headSize: 64,
  sub: 'On curved data, Sinkhorn metrics read slightly short because the cost uses the chord, not the arc.',
  tag: 'UNREFEREED CANDIDATE',
  hero: '<div class="eq-label">circle of radius R, small ε</div><div class="hero-title">metric × (1 − ε/4R²)</div><div class="note">round circle: −0.125 · ellipse of equal length: −0.043<br>(first-order bias coefficient, φ = cos s)</div><div class="eq-foot">written proofs · floating-point checks</div>'
};
module.exports = { draw, description, thumbSpec, ellipseNumbers };
if (require.main === module) (async () => {
  const fs = require('fs'), pth = require('path'), os = require('os'), vm = require('vm');
  const ROOT = pth.join(__dirname, '..');
  // Guards against the paper (Proposition 10.1, Example (i)): ellipse length 2*pi, coefficient -0.04262, averaged -0.2059.
  const nums = ellipseNumbers();
  if (Math.abs(nums.L - 2 * Math.PI) > 2e-3) throw new Error('ellipse length mismatch ' + nums.L);
  if (Math.abs(nums.coef + 0.04262) > 5e-5) throw new Error('ellipse coefficient mismatch ' + nums.coef);
  if (Math.abs(nums.avg + 0.2059) > 5e-4) throw new Error('averaged coefficient mismatch ' + nums.avg);
  const bp = require('./banner-palettes');
  const bpal = bp.resolve(SLUG); if (!bpal) throw new Error('no banner palette');
  const tp = require('./thumbnail-palettes');
  const tname = tp.resolve(SLUG, true);
  const svg = frame(draw(), bpal);
  fs.writeFileSync(pth.join(ROOT, 'assets/art', SLUG + '.svg'), svg);
  console.log('art:', SLUG, 'banner palette', bpal.name, '| thumbnail palette', tname, '| ellipse', JSON.stringify(nums));
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
