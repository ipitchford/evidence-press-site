'use strict';
const { bannerSvg } = require('./svg-xml');
// Sharp moments of nonnegative gamma sums: banner, OG card and thumbnail.
// "This image helps the reader understand" that for a weighted sum of independent exponential waiting times with the
// variance fixed, the weights that make the q-th moment smallest are m equal weights, and the best m climbs a staircase:
// m = 1 up to q = 5.32, then 2 up to 7.88, then 3 up to 10.41, ..., one step at a time and roughly like 0.40 q.
// Source (paper 0.1.0-candidate, 3 Nov 2026): Theorem 1, Section 6 and Figure 1; results/support_transitions.csv
// (alpha = 1 rows, copied to ten decimals). Guarded below: at each transition rho(m,q) = rho(m+1,q), where
// rho(m,q) = Gamma(m+q)/(Gamma(m) m^(q/2)) is the q-th moment of m equal weights (alpha = 1).
// Usage: node tools/gamma-moments-art.js [--render OUTDIR_FOR_INSPECTION] [--no-mirror]
const SLUG = 'gamma-sum-sharp-moments';
const ink = '#eef6f6', muted = '#d6e6e6', dim = '#a9c4c6';
const stepC = '#ffd27f', slopeC = '#9fd8ff', oneC = '#ffb38a';
const SANS = 'Arial,Helvetica,sans-serif', SERIF = 'Georgia,serif';
const text = (x, y, s, size = 18, color = ink, anchor = 'start', weight = 'normal', family = SANS) =>
  `<text class="og-hide" x="${x}" y="${y}" fill="${color}" font-family="${family}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}">${s}</text>`;
const f = v => (+v).toFixed(1);
// Exponential case (alpha = 1): q at which the optimal support size moves from m to m + 1 (support_transitions.csv).
const T = [5.3197223558, 7.8783529160, 10.4100465067, 12.9332331673, 15.4526250094, 17.9699921081, 20.4861507530, 23.0015300884, 25.5163774429, 28.0308454443];
const C = 2.5128624173; // log(1 + c) = c / 2; optimal support ~ q / c (Proposition 4)
// Lanczos log-gamma (g = 7, n = 9), accurate to about 1e-14 for x > 0.5.
const LC = [0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059,
  12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
function lgamma(x) { x -= 1; let a = LC[0]; const t = x + 7.5; for (let i = 1; i < 9; i++) a += LC[i] / (x + i); return 0.5 * Math.log(2 * Math.PI) + (x + 0.5) * Math.log(t) - t + Math.log(a); }
const logRho = (m, q) => lgamma(m + q) - lgamma(m) - q / 2 * Math.log(m);
// Chart geometry: q from 0 to 30 on x, support size 0..11 on y.
const CX0 = 92, CX1 = 640, CY0 = 330, CY1 = 118, QMAX = 30, MMAX = 11;
const X = q => CX0 + q / QMAX * (CX1 - CX0), Y = m => CY0 - m / MMAX * (CY0 - CY1);
function chart() {
  let s = text(32, 104, 'best number of equal weights', 13, dim, 'start', 'bold');
  for (const m of [1, 2, 3, 5, 7, 9, 11]) s += `<path d="M${CX0} ${f(Y(m))} H${CX1}" stroke="${dim}" stroke-opacity=".13" stroke-width="1"/>` + text(CX0 - 10, Y(m) + 4, String(m), 12, dim, 'end');
  s += `<path d="M${CX0} ${CY0} H${CX1} M${CX0} ${CY0} V${CY1 - 6}" stroke="${dim}" stroke-opacity=".5" stroke-width="1"/>`;
  for (const q of [0, 5, 10, 15, 20, 25, 30]) s += `<path d="M${f(X(q))} ${CY0} v5" stroke="${dim}" stroke-width="1.2"/>` + text(X(q), CY0 + 21, String(q), 12, dim, 'middle');
  s += text(CX1, CY0 + 40, 'moment order q', 12, dim, 'end');
  // Asymptotic slope q / c (Proposition 4), dashed.
  s += `<path d="M${f(X(0))} ${f(Y(0))} L${f(X(QMAX))} ${f(Y(QMAX / C))}" stroke="${slopeC}" stroke-width="1.6" stroke-dasharray="5 4" fill="none"/>`;
  s += text(X(24.5), Y(24.5 / C) - 12, 'slope ≈ 0.40 q', 12, slopeC, 'end', 'bold');
  // Staircase.
  let d = `M${f(X(0))} ${f(Y(1))}`, m = 1;
  for (const t of T) { d += ` H${f(X(t))} V${f(Y(m + 1))}`; m++; }
  d += ` H${f(X(QMAX))}`;
  s += `<path d="${d}" stroke="${stepC}" stroke-width="3.4" fill="none" stroke-linejoin="round"/>`;
  s += `<circle cx="${f(X(T[0]))}" cy="${f(Y(1))}" r="5" fill="${oneC}"/>`;
  s += text(X(T[0]) + 10, Y(1) + 20, 'q = 5.32', 13, oneC, 'start', 'bold');
  s += text(X(0.3), Y(1) - 9, 'one weight', 12, oneC, 'start', 'bold');
  return s;
}
function hook() {
  const X0 = 700;
  let s = text(X0, 120, 'Exponential waiting times, variance fixed', 15, muted, 'start', 'bold');
  s += text(X0, 150, 'Weights giving the smallest q-th moment:', 14, dim);
  const rows = [['q ≤ 5.32', '1 weight'], ['5.32 – 7.88', '2 equal weights'], ['7.88 – 10.41', '3 equal weights'], ['…', 'one more at each step']];
  rows.forEach(([a, b], i) => { s += text(X0, 186 + i * 30, a, 22, stepC, 'start', 'bold', SERIF) + text(X0 + 160, 186 + i * 30, b, 16, ink, 'start', 'bold'); });
  s += text(X0, 330, 'Now proved for every real q and every gamma shape;', 13, ink, 'start', 'bold');
  s += text(X0, 348, 'the sharp maximum is found too.', 13, ink, 'start', 'bold');
  s += text(X0, 378, 'Exponentials (α = 1); n large enough not to cap the support.', 12, dim);
  return s;
}
const draw = () =>
  text(32, 52, 'Spread or concentrate? The answer is a staircase', 26, ink, 'start', 'normal', SERIF) +
  text(32, 80, 'Minimum of E(a₁X₁ + … + aₙXₙ)^q over nonnegative weights with a₁² + … + aₙ² = 1', 15, muted) +
  chart() + `<path d="M672 104 L 672 384" stroke="${muted}" stroke-opacity=".22" stroke-width="1.2"/>` + hook();
const description = 'Banner for a paper on sharp moments of weighted sums of independent exponential (more generally gamma) random variables when the sum of squared weights is fixed at one. Left: a staircase chart of the best number of equal weights, the support size that minimises the q-th moment, against the moment order q from 0 to 30. It stays at one weight up to q = 5.32, then steps up by one at q = 7.88, 10.41, 12.93 and so on, reaching 11 near q = 28; a dashed line of slope about 0.40 shows its long-run growth. Right: the same result as a table: for q up to 5.32 one weight is best, between 5.32 and 7.88 two equal weights, between 7.88 and 10.41 three, one more at each step. A note says this is now proved for every real q and every gamma shape, and the sharp maximum is found too. Values are from the paper’s Section 6 and its table of support transitions for exponentials.';
function frame(inner, background) {
  return bannerSvg({ inner, description, background, glow: { color: stepC, cx: '0.3', cy: '0.55', r: '0.42', opacity: '0.06' } });
}
const thumbSpec = {
  kicker: ['RESEARCH RELEASE · NOVEMBER 2026', 'PROBABILITY · SHARP MOMENT INEQUALITIES'],
  head: ['Spread or', '<em>concentrate?</em>'], headSize: 78,
  sub: 'Fix the variance of a weighted sum of exponential waiting times. The weights that minimise its q-th moment climb a staircase.',
  tag: 'UNREFEREED CANDIDATE',
  hero: '<div class="eq-label">best number of equal weights</div><div class="hero-title" style="font-size:56px">1</div><div class="note">up to q = 5.32</div><div class="hero-title" style="font-size:56px">2, 3, 4 …</div><div class="note">one more at each step, about 0.40 q</div><div class="eq-foot">Brazitikos–Pandis conjecture, proved</div>'
};
module.exports = { draw, description, thumbSpec, T, C };
if (require.main === module) (async () => {
  const fs = require('fs'), pth = require('path'), os = require('os'), vm = require('vm');
  const ROOT = pth.join(__dirname, '..');
  // Guards: each transition equalises rho(m,q) and rho(m+1,q); the steps increase; slope constant solves log(1+c) = c/2.
  T.forEach((t, i) => {
    const gap = logRho(i + 1, t) - logRho(i + 2, t);
    if (Math.abs(gap) > 1e-7) throw new Error('transition mismatch at m=' + (i + 1) + ': ' + gap);
    if (i && !(t > T[i - 1])) throw new Error('transitions not increasing');
    if (!(t > (i + 2) + 2)) throw new Error('transition below (m+1)alpha+2');
  });
  if (Math.abs(Math.log(1 + C) - C / 2) > 1e-9) throw new Error('constant c wrong');
  const reg = JSON.parse(fs.readFileSync(pth.join(ROOT, 'data/BANNER_PALETTES.json'), 'utf8'));
  const { palettes } = require('./banner-palettes');
  const bsaved = reg.assignments.find(r => r.slug === SLUG); if (!bsaved) throw new Error('no saved banner palette'); const bname = bsaved.palette;
  const tp = require('./thumbnail-palettes');
  const tsaved = tp.load().assignments.find(r => r.slug === SLUG); if (!tsaved) throw new Error('no saved thumbnail palette');
  const tname = tsaved.editorialPalette || tsaved.palette;
  const svg = frame(draw(), { name: bname, colors: palettes[bname] });
  fs.writeFileSync(pth.join(ROOT, 'assets/art', SLUG + '.svg'), svg);
  console.log('art:', SLUG, 'banner palette', bname, '| thumbnail palette', tname, '| transitions verified', T.length);
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
