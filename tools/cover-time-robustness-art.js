'use strict';
const { bannerSvg } = require('./svg-xml');
// Cover-time versus hitting-time robustness: banner, OG card and thumbnail.
// "This image helps the reader understand" that on the clique-with-private-leaves-plus-path graph, the perturbation an
// adversary may apply before cover time doubles stays at about 0.293, while the tolerance before hitting time doubles
// shrinks like 0.628/L as the path length L grows, refuting Zuckerman's Conjecture 1.17.
// Source (paper 0.1.0-candidate): Theorem 1.1 (1.5)-(1.8) with C = 2; Figure 1 (a_2 ~ 0.628216, 1 - 1/sqrt2 ~ 0.2929); Section 1 graph G_{N,L}.
// Usage: node tools/cover-time-robustness-art.js [--render OUTDIR_FOR_INSPECTION] [--no-mirror]
const SLUG = 'cover-time-robustness-separation';
const ink = '#f4f1ea', muted = '#e3d9c9', dim = '#c4b7a2';
const coverC = '#9be3c0', hitC = '#ff9f80', nodeC = '#ffd77a', leafC = '#8cc8ff';
const SANS = 'Arial,Helvetica,sans-serif', SERIF = 'Georgia,serif';
const text = (x, y, s, size = 18, color = ink, anchor = 'start', weight = 'normal', family = SANS) =>
  `<text class="og-hide" x="${x}" y="${y}" fill="${color}" font-family="${family}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}">${s}</text>`;
const f = v => (+v).toFixed(1);
const g = a => a === 0 ? 1 : (Math.exp(2 * a) - 1) / (2 * a);
function solveA(C) { let lo = 0, hi = 5; for (let i = 0; i < 200; i++) { const m = (lo + hi) / 2; if (g(m) < C) lo = m; else hi = m; } return (lo + hi) / 2; }
const A2 = solveA(2), COVER2 = Math.min(1 - Math.pow(2, -0.5), 1 / 3);
// Left: a small illustration of G_{N,L} (the theorem uses N = 2^(2^L)).
function graphPanel() {
  let s = text(60, 128, 'The graph', 16, ink, 'start', 'bold', SERIF);
  s += text(60, 150, 'huge clique · a private leaf on every vertex · one path of length L', 13, dim);
  const cx = 200, cy = 262, R = 62, N = 7, pts = [];
  for (let i = 0; i < N; i++) { const t = Math.PI + 2 * Math.PI * i / N; pts.push([cx + R * Math.cos(t), cy + R * Math.sin(t)]); }
  for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) s += `<path d="M${f(pts[i][0])} ${f(pts[i][1])} L${f(pts[j][0])} ${f(pts[j][1])}" stroke="${muted}" stroke-opacity=".28" stroke-width="1.1"/>`;
  for (let i = 0; i < N; i++) {
    const [x, y] = pts[i], ux = (x - cx) / R, uy = (y - cy) / R;
    const lx = x + 30 * ux, ly = y + 30 * uy;
    if (i !== 3) { s += `<path d="M${f(x)} ${f(y)} L${f(lx)} ${f(ly)}" stroke="${leafC}" stroke-width="1.6"/><circle cx="${f(lx)}" cy="${f(ly)}" r="4.5" fill="${leafC}"/>`; }
    else { s += `<path d="M${f(x)} ${f(y)} L${f(x - 22)} ${f(y + 24)}" stroke="${leafC}" stroke-width="1.6"/><circle cx="${f(x - 22)}" cy="${f(y + 24)}" r="4.5" fill="${leafC}"/>`; }
  }
  const v0 = pts.reduce((b, p) => p[0] > b[0] ? p : b);
  let x = v0[0], y = v0[1];
  for (let k = 1; k <= 6; k++) { const nx = v0[0] + 44 * k, ny = v0[1]; s += `<path d="M${f(x)} ${f(y)} L${f(nx)} ${f(ny)}" stroke="${hitC}" stroke-width="2.2"/><circle cx="${f(nx)}" cy="${f(ny)}" r="${k === 6 ? 7 : 4.5}" fill="${hitC}"/>`; x = nx; y = ny; }
  for (const p of pts) s += `<circle cx="${f(p[0])}" cy="${f(p[1])}" r="6" fill="${nodeC}"/>`;
  s += text(x, y - 18, 'hard endpoint', 13, hitC, 'end', 'bold');
  s += text(v0[0] + 132, y + 26, 'path of length L', 13, hitC, 'middle');
  s += text(60, 372, 'leaves: covering means collecting all of them', 13, leafC);
  return s;
}
// Right: tolerances before the expected time doubles (C = 2), as the path grows.
const PX0 = 640, PX1 = 1150, PY0 = 340, PY1 = 170, LMIN = 2, LMAX = 40, TMAX = 0.33;
const PX = L => PX0 + (PX1 - PX0) * (L - LMIN) / (LMAX - LMIN), PY = v => PY0 - (PY0 - PY1) * v / TMAX;
function plotPanel() {
  let s = text(PX0 - 20, 128, 'How much nudging before the time doubles?', 16, ink, 'start', 'bold', SERIF);
  s += text(PX0 - 20, 150, 'largest relative perturbation ε, budget C = 2, as the path length L grows', 13, dim);
  s += `<path d="M${PX0} ${PY1 - 6} V${PY0} H${PX1}" stroke="${muted}" stroke-opacity=".6" stroke-width="1.3" fill="none"/>`;
  for (const v of [0, 0.1, 0.2, 0.3]) s += text(PX0 - 8, PY(v) + 4, v.toFixed(1), 12, dim, 'end');
  for (const L of [2, 10, 20, 30, 40]) s += text(PX(L), PY0 + 20, String(L), 12, dim, 'middle');
  s += text(PX1, PY0 + 38, 'path length L (core has 2^(2^L) vertices)', 12, dim, 'end');
  s += `<path d="M${f(PX(LMIN))} ${f(PY(COVER2))} H${f(PX1)}" stroke="${coverC}" stroke-width="3.5"/>`;
  s += text(PX1, PY(COVER2) - 12, 'cover time: ε ≈ 0.293 stays', 15, coverC, 'end', 'bold', SERIF);
  let d = '';
  for (let L = 2.2; L <= LMAX + 1e-9; L += 0.2) d += (d ? ' L' : 'M') + f(PX(L)) + ' ' + f(PY(Math.min(A2 / L, TMAX)));
  s += `<path d="${d}" stroke="${hitC}" stroke-width="3.5" fill="none"/>`;
  s += text(PX(9), PY(A2 / 9) - 14, 'hitting time: ε ≈ 0.628/L → 0', 15, hitC, 'start', 'bold', SERIF);
  return s;
}
const draw = () =>
  text(40, 52, 'Cover-time robustness can stay positive while hitting-time robustness vanishes', 26, ink, 'start', 'normal', SERIF) +
  text(40, 80, 'Counterexample to Zuckerman’s Conjecture 1.17: the two tolerances differ by a factor growing like log log |V|', 15, muted) +
  graphPanel() + `<path d="M585 108 L 585 372" stroke="${muted}" stroke-opacity=".22" stroke-width="1.2"/>` + plotPanel();
const description = 'Banner for a paper on adversarial random walks. Left: a small drawing of the graph, a clique whose every vertex carries one private leaf, with one longer path of length L hanging off one vertex and ending at a hard endpoint; covering means collecting all the leaves. Right: a plot against path length L of the largest relative perturbation epsilon an adversary may apply before the expected time doubles. A flat green line at about 0.293 is labelled cover time stays; a falling orange curve 0.628 divided by L is labelled hitting time tends to zero. The core has 2 to the power 2 to the L vertices.';
function frame(inner, background) {
  return bannerSvg({ inner, description, background, glow: { color: coverC, cx: '0.70', cy: '0.55', r: '0.42', opacity: '0.06' } });
}
const thumbSpec = {
  kicker: ['RESEARCH RELEASE · NOVEMBER 2026', 'PROBABILITY · ADVERSARIAL RANDOM WALKS'],
  head: ['Robust to cover,', '<em>fragile to hit</em>'], headSize: 66,
  sub: 'On one family of graphs an adversary can nudge a random walk by 29% without doubling the cover time, while hitting one far vertex tolerates only 0.63/L.',
  tag: 'UNREFEREED CANDIDATE',
  hero: '<div class="eq-label">tolerance before the time doubles</div><div class="hero-title">0.293 vs 0.628/L</div><div class="note">cover time: stays positive<br>hitting time: → 0 as L grows<br>Zuckerman Conjecture 1.17 fails</div><div class="eq-foot">analytic proof · asymptotic, huge graphs</div>'
};
module.exports = { draw, description, thumbSpec, A2, COVER2 };
if (require.main === module) (async () => {
  const fs = require('fs'), pth = require('path'), os = require('os'), vm = require('vm');
  const ROOT = pth.join(__dirname, '..');
  // Guards against Theorem 1.1 and Figure 1: g(a_2) = 2 with a_2 ~ 0.628216; cover limit 1 - 2^(-1/2) ~ 0.2929 < 1/3.
  if (Math.abs(g(A2) - 2) > 1e-9 || Math.abs(A2 - 0.628216) > 5e-7) throw new Error('a_2 mismatch with (1.5)');
  if (Math.abs(COVER2 - 0.29289) > 1e-5 || COVER2 >= 1 / 3) throw new Error('cover limit mismatch with (1.7)');
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
