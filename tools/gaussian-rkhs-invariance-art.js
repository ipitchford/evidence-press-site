'use strict';
const { bannerSvg } = require('./svg-xml');
// Gaussian RKHS invariance under stochastic dynamics: banner, OG card and thumbnail.
// "This image helps the reader understand" that the exact Ornstein-Uhlenbeck condition AP + PA^T <= 4BB^T admits twice the Gaussian
// kernel widths certified by the earlier sufficient condition with factor 2, shown for the shear family A = [[-1, s], [0, -1]], B = I, P = sigma^2 I.
// Source: paper 0.1.0-candidate (4 Nov 2026), Theorem 6 and Proposition 17: sigma^2 <= 4 / lambda_max(A + A^T), lambda_max = s - 2 for s > 2.
// Usage: node tools/gaussian-rkhs-invariance-art.js [--render OUTDIR_FOR_INSPECTION] [--no-mirror]
const SLUG = 'gaussian-rkhs-stochastic-invariance';
const ink = '#f4f1ea', muted = '#e3d9c9', dim = '#c4b7a2';
const oldC = '#ffd77a', newC = '#9be3c0', ptC = '#ff9a8a';
const SANS = 'Arial,Helvetica,sans-serif', SERIF = 'Georgia,serif';
const text = (x, y, s, size = 18, color = ink, anchor = 'start', weight = 'normal', family = SANS) =>
  `<text class="og-hide" x="${x}" y="${y}" fill="${color}" font-family="${family}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}">${s}</text>`;
const f = v => (+v).toFixed(1);
const sigNew = s => 4 / (s - 2), sigOld = s => 2 / (s - 2);
const PX0 = 90, PX1 = 690, PY0 = 112, PY1 = 352, S0 = 2, S1 = 10, YMAX = 2.5;
const X = s => PX0 + (PX1 - PX0) * (s - S0) / (S1 - S0);
const Y = v => PY1 - (PY1 - PY0) * Math.min(v, YMAX) / YMAX;
const curve = g => { const p = []; for (let s = 2 + 4 / YMAX * 0.5; s <= S1 + 1e-9; s += 0.05) p.push([s, g(s)]); return p; };
const area = (g, fill, op) => { const c = curve(g); return `<path d="M${f(X(S0))} ${f(Y(0))} L${f(X(S0))} ${f(Y(YMAX))} ${c.map(p => 'L' + f(X(p[0])) + ' ' + f(Y(p[1]))).join(' ')} L${f(X(S1))} ${f(Y(0))} Z" fill="${fill}" fill-opacity="${op}"/>`; };
const line = (g, col) => { const c = curve(g); return `<path d="${c.map((p, i) => (i ? 'L' : 'M') + f(X(p[0])) + ' ' + f(Y(p[1]))).join(' ')}" fill="none" stroke="${col}" stroke-width="3"/>`; };
function plot() {
  let s = text(PX0, PY0 - 12, 'largest kernel width σ² keeping the Gaussian RKHS invariant, shear A = [[−1, s], [0, −1]], B = I', 13, dim);
  s += area(sigNew, newC, 0.26) + area(sigOld, oldC, 0.40) + line(sigNew, newC) + line(sigOld, oldC);
  s += `<path d="M${X(5)} ${PY1} V${Y(4 / 3)}" stroke="${ptC}" stroke-dasharray="4 4" stroke-width="1.5"/>`;
  s += `<circle cx="${X(5)}" cy="${Y(4 / 3)}" r="6" fill="${ptC}"/><circle cx="${X(5)}" cy="${Y(2 / 3)}" r="5" fill="none" stroke="${ptC}" stroke-width="2"/>`;
  s += text(X(5) + 12, Y(4 / 3) - 6, 's = 5: σ² ≤ 4/3', 14, ptC, 'start', 'bold') + text(X(5) + 12, Y(2 / 3) + 18, 'old: 2/3', 13, ptC);
  s += text(X(7.4), Y(0.95), 'exact rule (factor 4)', 14, newC, 'start', 'bold');
  s += text(X(7.4), Y(0.14), 'earlier rule (factor 2)', 14, oldC, 'start', 'bold');
  s += `<path d="M${PX0} ${PY1} H${PX1} M${PX0} ${PY1} V${PY0}" stroke="${dim}" stroke-width="1.2"/>`;
  for (const a of [2, 4, 6, 8, 10]) s += text(X(a), PY1 + 20, String(a), 12, dim, 'middle');
  for (const b of [0, 1, 2]) s += text(PX0 - 10, Y(b) + 4, String(b), 12, dim, 'end');
  s += text((PX0 + PX1) / 2, PY1 + 38, 'shear strength s', 13, dim, 'middle') + text(PX0 - 42, Y(1.25), 'σ²', 15, dim, 'middle');
  return s;
}
function panel() {
  const RX = 735;
  let s = text(RX, 140, 'The factor is 4, not 2', 28, newC, 'start', 'bold', SERIF);
  s += `<rect x="${RX}" y="162" width="22" height="14" fill="${oldC}" fill-opacity=".6"/>` + text(RX + 32, 175, 'old: AP + PAᵀ ⪯ 2BBᵀ (sufficient)', 16, oldC, 'start', 'bold');
  s += `<rect x="${RX}" y="192" width="22" height="14" fill="${newC}" fill-opacity=".6"/>` + text(RX + 32, 205, 'exact: AP + PAᵀ ⪯ 4BBᵀ', 16, newC, 'start', 'bold');
  s += text(RX, 245, 'twice the admissible kernel widths', 15, ink, 'start', 'normal', SERIF);
  s += text(RX, 267, 'nonlinear drift or state-dependent noise:', 15, ink, 'start', 'normal', SERIF);
  s += text(RX, 289, 'never invariant (Euler steps included)', 15, ink, 'start', 'normal', SERIF);
  s += text(RX, 331, 'global RKHS norm; linear-Gaussian', 13, dim);
  s += text(RX, 349, 'and additive Lévy noise', 13, dim);
  return s;
}
const draw = () =>
  text(40, 52, 'When does a Gaussian kernel space survive random dynamics?', 26, ink, 'start', 'normal', SERIF) +
  text(40, 80, 'Ornstein–Uhlenbeck processes: exact condition versus the 2025 sufficient condition', 15, muted) +
  plot() + `<path d="M712 108 L 712 372" stroke="${muted}" stroke-opacity=".22" stroke-width="1.2"/>` + panel();
const description = 'Banner for a paper on Gaussian reproducing kernel Hilbert spaces under stochastic dynamics. Left: for the shear drift with strength s and identity noise, the largest isotropic Gaussian kernel width sigma squared that keeps the space invariant, plotted against s from 2 to 10. A gold region under the curve 2 over (s minus 2) shows the widths certified by the earlier sufficient condition with factor 2; a larger green region under 4 over (s minus 2) shows the exact range with factor 4. A red marker at s equals 5 shows sigma squared up to 4/3 instead of 2/3. Right: the factor is 4, not 2; the old rule AP + PA transpose at most 2BB transpose is sufficient, the exact rule has 4BB transpose; twice the admissible widths; nonlinear drift or state-dependent noise is never invariant.';
function frame(inner, background) {
  return bannerSvg({ inner, description, background, glow: { color: newC, cx: '0.30', cy: '0.55', r: '0.42', opacity: '0.06' } });
}
const thumbSpec = {
  kicker: ['RESEARCH RELEASE · NOVEMBER 2026', 'ANALYSIS · KERNEL METHODS'],
  head: ['The factor is', '<em>4, not 2</em>'], headSize: 76,
  sub: 'A Gaussian kernel space stays invariant under an Ornstein–Uhlenbeck process exactly when AP + PAᵀ ⪯ 4BBᵀ: twice the widths the earlier rule allowed.',
  tag: 'UNREFEREED CANDIDATE',
  hero: '<div class="eq-label">shear A = [[−1, 5], [0, −1]], B = I</div><div class="hero-title">σ² ≤ 4/3</div><div class="note">earlier rule: σ² ≤ 2/3<br>exact: AP + PAᵀ ⪯ 4BBᵀ<br>nonlinear drift: never invariant</div><div class="eq-foot">written proofs · exact rational checks</div>'
};
module.exports = { draw, description, thumbSpec };
if (require.main === module) (async () => {
  const fs = require('fs'), pth = require('path'), os = require('os'), vm = require('vm');
  const ROOT = pth.join(__dirname, '..');
  // Guards: shear s = 5 gives lambda_max(A + A^T) = 3, so the exact width bound is 4/3 and the earlier one 2/3 (paper Section 8; code/verify.py section A).
  if (Math.abs(sigNew(5) - 4 / 3) > 1e-12 || Math.abs(sigOld(5) - 2 / 3) > 1e-12) throw new Error('shear thresholds');
  const bp = require('./banner-palettes').resolve(SLUG); const bname = bp.name;
  const tname = require('./thumbnail-palettes').resolve(SLUG, true);
  const svg = frame(draw(), bp);
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
