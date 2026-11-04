'use strict';
const { bannerSvg } = require('./svg-xml');
// Isolated Kalman filter covariance divergence: banner, OG card and thumbnail.
// "This image helps the reader understand" that on three nodes observed through pair sums (x1+x2, x2+x3, x3+x1) with
// A = 3I, the isolated Kalman filter's reported variance is proved to grow at least like (5/4)(9/5)^k - 1/4, while the
// ordinary centralised Kalman filter on the same system keeps every variance at most 3/4.
// Source (paper 0.1.0-candidate): Theorem 4.1 (4.1)-(4.2); exact values m_k = 2.38, 14.97, 114.2, 982.0 for k = 1..4 (Section 4);
// Figure 2 (same system). Usage: node tools/isokf-divergence-art.js [--render OUTDIR_FOR_INSPECTION] [--no-mirror]
const SLUG = 'isolated-kalman-covariance-divergence';
const ink = '#f4f1ea', muted = '#e3d9c9', dim = '#c4b7a2';
const isoC = '#ff9f80', bndC = '#ffd77a', kfC = '#9be3c0', nodeC = '#8cc8ff';
const SANS = 'Arial,Helvetica,sans-serif', SERIF = 'Georgia,serif';
const text = (x, y, s, size = 18, color = ink, anchor = 'start', weight = 'normal', family = SANS) =>
  `<text class="og-hide" x="${x}" y="${y}" fill="${color}" font-family="${family}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}">${s}</text>`;
const f = v => (+v).toFixed(1);
const bound = k => 1.25 * Math.pow(1.8, k) - 0.25;
const EXACT = [[0, 1], [1, 2.38], [2, 14.97], [3, 114.2], [4, 982.0]];
// Left: the three nodes and their pair-sum measurements.
function trianglePanel() {
  let s = text(60, 128, 'Three nodes, pair-sum measurements', 16, ink, 'start', 'bold', SERIF);
  s += text(60, 150, 'observable and controllable · every local update valid · A = 3I', 13, dim);
  const P = [[150, 330], [330, 330], [240, 190]], lab = ['x₁', 'x₂', 'x₃'];
  const E = [[0, 1, 'x₁ + x₂'], [1, 2, 'x₂ + x₃'], [2, 0, 'x₃ + x₁']];
  for (const [i, j, l] of E) {
    const [a, b] = [P[i], P[j]];
    s += `<path d="M${f(a[0])} ${f(a[1])} L${f(b[0])} ${f(b[1])}" stroke="${muted}" stroke-opacity=".7" stroke-width="2.2"/>`;
    const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2, cx = 240, cy = 283;
    const dx = mx - cx, dy = my - cy, n = Math.hypot(dx, dy);
    s += text(f(mx + 34 * dx / n), f(my + 34 * dy / n + 5), l, 14, muted, 'middle', 'normal', SERIF);
  }
  P.forEach(([x, y], i) => { s += `<circle cx="${x}" cy="${y}" r="20" fill="${nodeC}"/>` + text(x, y + 6, lab[i], 17, '#15202b', 'middle', 'bold', SERIF); });
  s += text(240, 392, 'each update touches only two nodes', 13, dim, 'middle');
  return s;
}
// Right: reported variance (log scale) against epochs.
const PX0 = 640, PX1 = 1140, PY0 = 345, PY1 = 172, KMAX = 12, LMIN = -1, LMAX = 3.5;
const PX = k => PX0 + (PX1 - PX0) * k / KMAX, PY = v => PY0 - (PY0 - PY1) * (Math.log10(v) - LMIN) / (LMAX - LMIN);
function plotPanel() {
  let s = text(PX0 - 40, 128, 'Reported variance after k rounds', 16, ink, 'start', 'bold', SERIF);
  s += text(PX0 - 40, 150, 'same system, same measurements · logarithmic scale', 13, dim);
  s += `<path d="M${PX0} ${PY1 - 6} V${PY0} H${PX1}" stroke="${muted}" stroke-opacity=".6" stroke-width="1.3" fill="none"/>`;
  for (const [v, l] of [[0.1, '0.1'], [1, '1'], [10, '10'], [100, '100'], [1000, '1000']]) s += text(PX0 - 8, f(PY(v) + 4), l, 12, dim, 'end');
  for (const k of [0, 4, 8, 12]) s += text(f(PX(k)), PY0 + 20, String(k), 12, dim, 'middle');
  s += text(PX1, PY0 + 38, 'round k', 12, dim, 'end');
  let d = '';
  for (let k = 0; k <= KMAX + 1e-9; k += 0.1) d += (d ? ' L' : 'M') + f(PX(k)) + ' ' + f(PY(bound(k)));
  s += `<path d="${d}" stroke="${bndC}" stroke-width="3" stroke-dasharray="9 6" fill="none"/>`;
  s += `<path d="${EXACT.map(([k, v], i) => (i ? 'L' : 'M') + f(PX(k)) + ' ' + f(PY(v))).join(' ')}" stroke="${isoC}" stroke-width="3.5" fill="none"/>`;
  for (const [k, v] of EXACT) s += `<circle cx="${f(PX(k))}" cy="${f(PY(v))}" r="5" fill="${isoC}"/>`;
  s += text(f(PX(4) + 14), f(PY(982) + 2), 'isolated KF (exact): 982 at k = 4', 15, isoC, 'start', 'bold', SERIF);
  s += text(f(PX(7.2)), f(PY(bound(7.2)) + 34), 'proved: ≥ (5/4)(9/5)ᵏ − 1/4', 15, bndC, 'start', 'bold', SERIF);
  s += `<path d="M${f(PX(0))} ${f(PY(0.75))} H${f(PX1)}" stroke="${kfC}" stroke-width="3.5"/>`;
  s += text(PX1, f(PY(0.75) + 22), 'centralised Kalman filter: ≤ 3/4', 15, kfC, 'end', 'bold', SERIF);
  return s;
}
const draw = () =>
  text(40, 52, 'Observable systems with divergent isolated Kalman covariances', 26, ink, 'start', 'normal', SERIF) +
  text(40, 80, 'Counterexample to the convergence conjecture: the shortcut filter’s reported uncertainty explodes while the full filter stays bounded', 15, muted) +
  trianglePanel() + `<path d="M545 108 L 545 380" stroke="${muted}" stroke-opacity=".22" stroke-width="1.2"/>` + plotPanel();
const description = 'Banner for a paper on the isolated Kalman filter. Left: three nodes x1, x2, x3 in a triangle; each edge is a measurement of the sum of two node states (x1 + x2, x2 + x3, x3 + x1), and each update touches only two nodes. Right: a logarithmic plot of the reported variance against round k. The isolated Kalman filter values (exact) rise to 982 by round 4, above a dashed proved lower bound (5/4)(9/5) to the power k minus 1/4, while a flat green line shows the centralised Kalman filter staying at or below 3/4.';
function frame(inner, background) {
  return bannerSvg({ inner, description, background, glow: { color: isoC, cx: '0.72', cy: '0.45', r: '0.42', opacity: '0.06' } });
}
const thumbSpec = {
  kicker: ['RESEARCH RELEASE · NOVEMBER 2026', 'ESTIMATION · DECENTRALISED KALMAN FILTERING'],
  head: ['A filter shortcut', '<em>whose doubt explodes</em>'], headSize: 64,
  sub: 'Three sensors, pair-sum measurements, fully observable: the isolated Kalman filter’s reported variance grows without limit while the ordinary filter stays at or below 3/4.',
  tag: 'UNREFEREED CANDIDATE',
  hero: '<div class="eq-label">reported variance after k rounds</div><div class="hero-title">≥ (5/4)(9/5)ᵏ vs ≤ 3/4</div><div class="note">isolated Kalman filter: unbounded<br>centralised Kalman filter: bounded<br>convergence conjecture fails</div><div class="eq-foot">analytic proof · actual error stays bounded</div>'
};
module.exports = { draw, description, thumbSpec, bound, EXACT };
if (require.main === module) (async () => {
  const fs = require('fs'), pth = require('path'), os = require('os'), vm = require('vm');
  const ROOT = pth.join(__dirname, '..');
  // Guards against Theorem 4.1: bound(0) = 1 = m_0; exact m_k exceed the bound; growth ratio 9/5.
  if (Math.abs(bound(0) - 1) > 1e-12 || Math.abs((bound(5) + 0.25) / (bound(4) + 0.25) - 1.8) > 1e-12) throw new Error('bound mismatch with (4.2)');
  for (const [k, v] of EXACT) if (v < bound(k) - 1e-9) throw new Error('exact value below proved bound at k=' + k);
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
