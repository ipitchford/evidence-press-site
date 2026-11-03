'use strict';
const { bannerSvg } = require('./svg-xml');
// Boundary limits of the matrix geometric mean and the failure of unrestricted GLT closure: banner, OG card and thumbnail.
// "This image helps the reader understand" that two inputs converging to the same singular matrix can have geometric means
// converging to different multiples of it, and that this makes GLT sequences with identical symbols have means with the
// wrong symbol. Source (paper 0.1.0-candidate, 3 Nov 2026): formula (5.1)-(5.3), A_e = diag(1, e^2),
// B_{e,t} = [[1, te], [te, (1+t^2)e^2]] -> diag(1,0) and A_e # B_{e,t} -> c(t) diag(1,0) with c(t) = 2/sqrt(4+t^2);
// (5.4) c(3/2) = 4/5; (6.5) {A_N}, {B_N} ~GLT a = 1_(0,1/2] while {A_N # B_N} ~GLT (4/5) a. Exact curve, not data.
// Usage: node tools/geometric-mean-art.js [--render OUTDIR_FOR_INSPECTION] [--no-mirror]
const SLUG = 'matrix-geometric-mean-glt-closure';
const ink = '#f4f1ea', muted = '#e3d9c9', dim = '#c4b7a2';
const curveC = '#9fd2ff', hitC = '#ffcf7a', predC = '#9be3c0', inC = '#f2a7c3';
const SANS = 'Arial,Helvetica,sans-serif', SERIF = 'Georgia,serif';
const text = (x, y, s, size = 18, color = ink, anchor = 'start', weight = 'normal', family = SANS) =>
  `<text class="og-hide" x="${x}" y="${y}" fill="${color}" font-family="${family}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}">${s}</text>`;
const f = v => (+v).toFixed(1);
const c = t => 2 / Math.sqrt(4 + t * t); // (5.3)
// Left chart: c(t) for t in [0, 8].
const X0 = 92, X1 = 600, Y0 = 342, Y1 = 128, TMAX = 8;
const X = t => X0 + t / TMAX * (X1 - X0);
const Y = r => Y0 - r * (Y0 - Y1);
function chart() {
  let s = '';
  for (let k = 0; k <= 4; k++) {
    const r = k / 4;
    s += `<path d="M${X0} ${f(Y(r))} H${X1}" stroke="${muted}" stroke-opacity="${k === 0 ? 0 : 0.13}" stroke-width="1"/>`;
    s += text(X0 - 10, Y(r) + 5, String(r), 13, dim, 'end');
  }
  s += `<path d="M${X0} ${Y0} H${X1}" stroke="${dim}" stroke-width="1.2"/>`;
  for (let t = 0; t <= TMAX; t += 2) s += `<path d="M${f(X(t))} ${Y0} v6" stroke="${dim}" stroke-width="1.2"/>` + text(X(t), Y0 + 22, String(t), 13, dim, 'middle');
  s += text(X1, Y0 + 40, 'coupling t between the surviving and the vanishing direction', 13, dim, 'end', 'normal', SERIF);
  s += text(X0 - 66, Y1 - 18, 'both inputs → diag(1, 0); their mean → c(t) · diag(1, 0)', 14, dim, 'start', 'normal', SERIF);
  const pts = []; for (let k = 0; k <= 400; k++) { const t = TMAX * k / 400; pts.push(`${f(X(t))} ${f(Y(c(t)))}`); }
  s += `<path d="M${X0} ${Y0} L${pts.join(' L')} L${X1} ${Y0} Z" fill="${curveC}" fill-opacity=".10"/>`;
  s += `<path d="M${pts.join(' L')}" stroke="${curveC}" stroke-width="3.2" fill="none" stroke-linejoin="round"/>`;
  s += text(X(4.3), Y(c(4.3)) - 16, 'c(t) = 2 / √(4 + t²)', 17, curveC, 'start', 'bold', SERIF);
  s += `<path d="M${f(X(1.5))} ${Y0} V${f(Y(0.8))} H${X0}" stroke="${hitC}" stroke-width="1.6" stroke-dasharray="4 4" fill="none"/>`;
  s += `<circle cx="${f(X(1.5))}" cy="${f(Y(0.8))}" r="7" fill="${hitC}" stroke="#1b1b1b" stroke-width="1.2"/>`;
  s += text(X(1.5) + 16, Y(0.8) - 14, 't = 3/2 gives exactly 4/5', 15, hitC, 'start', 'bold');
  return s;
}
// Right panel: GLT symbols on [0, 1]; inputs a = 1 on (0, 1/2]; means 4/5 there.
const PX0 = 760, PX1 = 1130, PY0 = 330, PY1 = 170;
const PX = x => PX0 + x * (PX1 - PX0), PY = v => PY0 - v * (PY0 - PY1);
function panel() {
  let s = text(PX0 - 20, 108, 'Same symbols in, symbol 4/5 out', 21, ink, 'start', 'normal', SERIF);
  s += text(PX0 - 20, 132, 'GLT symbols on [0, 1] of two input sequences and of their means', 13, dim);
  s += `<path d="M${PX0} ${PY0} H${PX1}" stroke="${dim}" stroke-width="1.2"/>`;
  for (const [x, l] of [[0, '0'], [0.5, '½'], [1, '1']]) s += `<path d="M${f(PX(x))} ${PY0} v6" stroke="${dim}" stroke-width="1.2"/>` + text(PX(x), PY0 + 22, l, 13, dim, 'middle');
  for (const [v, l] of [[0.8, '4/5'], [1, '1']]) s += text(PX0 - 8, PY(v) + 5, l, 13, dim, 'end');
  s += `<path d="M${PX0} ${f(PY(1))} H${f(PX(0.5))} V${PY0} H${PX1}" stroke="${inC}" stroke-width="3" fill="none"/>`;
  s += `<path d="M${PX0} ${f(PY(1) - 7)} H${f(PX(0.5))}" stroke="${predC}" stroke-width="2.4" stroke-dasharray="9 6"/>`;
  s += `<path d="M${PX0} ${f(PY(0.8))} H${f(PX(0.5))}" stroke="${hitC}" stroke-width="3.6"/>`;
  s += text(PX(0.54), PY(1) - 2, 'both inputs: 1 then 0', 14, inC, 'start', 'bold');
  s += text(PX(0.54), PY(1) + 20, 'claimed mean: 1 (√(1·1))', 14, predC, 'start', 'bold');
  s += text(PX(0.54), PY(0.8) + 18, 'actual mean: 4/5', 14, hitC, 'start', 'bold');
  s += text(PX0 - 20, 380, 'Safe when the symbols share no zero region or never overlap.', 13, dim, 'start', 'normal', SERIF);
  return s;
}
const draw = () =>
  text(40, 52, 'The geometric mean can jump at singular matrices, and GLT symbols cannot see it', 26, ink, 'start', 'normal', SERIF) +
  text(40, 80, 'Every possible jump obeys one rank test; the jump refutes a published symbol formula', 15, muted) +
  chart() + `<path d="M705 100 L 705 385" stroke="${muted}" stroke-opacity=".22" stroke-width="1.2"/>` + panel();
const description = 'Banner for a paper on boundary limits of the matrix geometric mean. Left: a chart of the exact curve c(t) = 2 divided by the square root of 4 plus t squared, for a coupling t from 0 to 8. Two positive definite 2 by 2 matrices both converge to the projection diag(1, 0), but their geometric mean converges to c(t) times that projection, so every value between 0 and 1 can occur. A gold point marks t = 3/2, where c is exactly 4/5. Right: same symbols in, symbol 4/5 out. Two GLT input sequences built from these blocks both have symbol 1 on the first half of [0, 1] and 0 on the second half (pink step); the published formula predicts that their geometric means have symbol 1 there (green dashed line), but the actual symbol is 4/5 (gold line). A note says the formula is safe when the symbols share no zero region or never overlap.';
function frame(inner, background) {
  return bannerSvg({ inner, description, background, glow: { color: curveC, cx: '0.30', cy: '0.55', r: '0.42', opacity: '0.06' } });
}
const thumbSpec = {
  kicker: ['RESEARCH RELEASE · NOVEMBER 2026', 'MATRIX ANALYSIS · GLT SEQUENCES'],
  head: ['Same symbols in,', '<em>symbol 4/5 out</em>'], headSize: 70,
  sub: 'The geometric mean of two matrix sequences with identical GLT symbols can have the wrong symbol. A published theorem fails; the safe cases are now exact.',
  tag: 'UNREFEREED CANDIDATE',
  hero: '<div class="eq-label">limit of the mean = c(t) · diag(1,0)</div><div class="hero-title">c(t) = 2/√(4+t²)</div><div class="note">t = 3/2 gives 4/5, not 1<br>every limit: one rank test<br>safe: no shared zero region</div><div class="eq-foot">written proofs · 1,030 exact checks</div>'
};
module.exports = { draw, description, thumbSpec, c };
if (require.main === module) (async () => {
  const fs = require('fs'), pth = require('path'), os = require('os'), vm = require('vm');
  const ROOT = pth.join(__dirname, '..');
  // Guards: the plotted constants match the paper.
  if (Math.abs(c(1.5) - 0.8) > 1e-12 || Math.abs(c(0) - 1) > 1e-12) throw new Error('c(t) mismatch with (5.3)-(5.4)');
  // (5.2) at e -> 0: mean of A_e = diag(1, e^2) and B_{e,t} has (1,1) entry 2/sqrt(4+t^2); check (A+B) A^{-1} (A+B) = (4+t^2) B at e = 1/3, t = 3/2.
  { const e = 1 / 3, t = 1.5, A = [[1, 0], [0, e * e]], B = [[1, t * e], [t * e, (1 + t * t) * e * e]];
    const S = [[A[0][0] + B[0][0], A[0][1] + B[0][1]], [A[1][0] + B[1][0], A[1][1] + B[1][1]]], Ai = [[1, 0], [0, 1 / (e * e)]];
    const mul = (P, Q) => [[P[0][0] * Q[0][0] + P[0][1] * Q[1][0], P[0][0] * Q[0][1] + P[0][1] * Q[1][1]], [P[1][0] * Q[0][0] + P[1][1] * Q[1][0], P[1][0] * Q[0][1] + P[1][1] * Q[1][1]]];
    const L = mul(mul(S, Ai), S); for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) if (Math.abs(L[i][j] - (4 + t * t) * B[i][j]) > 1e-12) throw new Error('Riccati identity mismatch'); }
  const reg = JSON.parse(fs.readFileSync(pth.join(ROOT, 'data/BANNER_PALETTES.json'), 'utf8'));
  const { palettes } = require('./banner-palettes');
  const bsaved = reg.assignments.find(r => r.slug === SLUG); if (!bsaved) throw new Error('no saved banner palette'); const bname = bsaved.palette;
  const tp = require('./thumbnail-palettes');
  const tsaved = tp.load().assignments.find(r => r.slug === SLUG); if (!tsaved) throw new Error('no saved thumbnail palette');
  const tname = tsaved.editorialPalette || tsaved.palette;
  const svg = frame(draw(), { name: bname, colors: palettes[bname] });
  fs.writeFileSync(pth.join(ROOT, 'assets/art', SLUG + '.svg'), svg);
  console.log('art:', SLUG, 'banner palette', bname, '| thumbnail palette', tname, '| c(3/2) =', c(1.5));
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
