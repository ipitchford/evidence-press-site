'use strict';
const { bannerSvg } = require('./svg-xml');
// The small-Hurst limit of the expected maximum of fractional Brownian motion: banner, OG card and thumbnail.
// "This image helps the reader understand" how much of a very rough path's maximum a uniform grid of n points can see:
// to first order the captured fraction depends only on c = H log n, through F(c)/sqrt(2), and is one half at c = 1/2.
// Source (paper 0.1.0-candidate, 3 Nov 2026): Theorem 1 (sqrt(H) E sup_[0,1] B_H -> sqrt(2)); Theorem 11 and (8.22),
// F(c) = sqrt(c) for c <= 1/2 and sqrt(2)(1 - e^{1/2-c}/2) for c >= 1/2; (8.23), c_eta = 1/2 - log(2(1 - eta)) for
// eta >= 1/2. The curve is the exact limit function, not simulation data; Table 2 shows that at H = 0.05-0.2 actual grid
// means lie 17-42% below the first-order values, so the worked example is labelled a first-order prediction.
// Usage: node tools/small-hurst-art.js [--render OUTDIR_FOR_INSPECTION] [--no-mirror]
const SLUG = 'small-hurst-fbm-maximum';
const ink = '#f4f1ea', muted = '#e3d9c9', dim = '#c4b7a2';
const curveC = '#9fd2ff', halfC = '#ffcf7a', fullC = '#9be3c0', branchC = '#f2a7c3';
const SANS = 'Arial,Helvetica,sans-serif', SERIF = 'Georgia,serif';
const text = (x, y, s, size = 18, color = ink, anchor = 'start', weight = 'normal', family = SANS) =>
  `<text class="og-hide" x="${x}" y="${y}" fill="${color}" font-family="${family}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}">${s}</text>`;
const f = v => (+v).toFixed(1);

const F = c => (c <= 0.5 ? Math.sqrt(c) : Math.SQRT2 * (1 - Math.exp(0.5 - c) / 2));
const R = c => F(c) / Math.SQRT2; // fraction of the continuum mean captured (8.22)
const cEta = eta => (eta <= 0.5 ? 2 * eta * eta : 0.5 - Math.log(2 * (1 - eta))); // (8.23)
const C90 = cEta(0.9), C99 = cEta(0.99);
// Chart geometry: c from 0 to 5, fraction from 0 to 100%.
const X0 = 92, X1 = 760, Y0 = 342, Y1 = 118, CMAX = 5;
const X = c => X0 + c / CMAX * (X1 - X0);
const Y = r => Y0 - r * (Y0 - Y1);
function chart() {
  let s = '';
  for (let k = 0; k <= 4; k++) {
    const r = k / 4;
    s += `<path d="M${X0} ${f(Y(r))} H${X1}" stroke="${muted}" stroke-opacity="${k === 4 ? 0 : 0.13}" stroke-width="1"/>`;
    s += text(X0 - 10, Y(r) + 5, `${k * 25}%`, 13, dim, 'end');
  }
  for (let c = 0; c <= CMAX; c++) s += `<path d="M${f(X(c))} ${Y0} v6" stroke="${dim}" stroke-width="1.2"/>` + text(X(c), Y0 + 22, String(c), 13, dim, 'middle');
  s += text(X1, Y0 + 40, 'c = H log n   (H = Hurst parameter, n = grid points)', 13, dim, 'end', 'normal', SERIF);
  s += text(X0 - 66, Y1 - 16, 'share of the true expected maximum seen by the grid', 13, dim, 'start', 'normal', SERIF);
  // Continuum level: sqrt(H) E sup -> sqrt(2) (Theorem 1).
  s += `<path d="M${X0} ${f(Y(1))} H${X1}" stroke="${fullC}" stroke-width="2.4" stroke-dasharray="9 6"/>`;
  s += text(X1, Y(1) - 9, 'whole path: √H · E max → √2 (Theorem 1)', 14, fullC, 'end', 'bold');
  // Capture curve F(c)/sqrt(2), shaded.
  const pts = []; for (let k = 0; k <= 500; k++) { const c = CMAX * k / 500; pts.push(`${f(X(c))} ${f(Y(R(c)))}`); }
  s += `<path d="M${X0} ${Y0} L${pts.join(' L')} L${X1} ${Y0} Z" fill="${curveC}" fill-opacity=".10"/>`;
  s += `<path d="M${pts.join(' L')}" stroke="${curveC}" stroke-width="3.2" fill="none" stroke-linejoin="round"/>`;
  // Branch labels.
  s += text(X(0.08), Y(R(0.36)) - 2, '√(c/2)', 14, branchC, 'start', 'bold');
  s += text(X(3.3), Y(R(3.3)) + 62, '1 − ½ e<tspan dy="-6" font-size="10">1/2 − c</tspan>', 14, branchC, 'start', 'bold');
  // Half point (1/2, 1/2) and 90% point.
  s += `<path d="M${f(X(0.5))} ${Y0} V${f(Y(0.5))} H${X0}" stroke="${halfC}" stroke-width="1.6" stroke-dasharray="4 4" fill="none"/>`;
  s += `<circle cx="${f(X(0.5))}" cy="${f(Y(0.5))}" r="7" fill="${halfC}" stroke="#1b1b1b" stroke-width="1.2"/>`;
  s += text(X(0.5) + 16, Y(0.5) + 26, 'half the maximum at H log n = ½', 15, halfC, 'start', 'bold');
  s += `<path d="M${f(X(C90))} ${Y0} V${f(Y(0.9))}" stroke="${muted}" stroke-opacity=".55" stroke-width="1.3" stroke-dasharray="4 4"/>`;
  s += `<circle cx="${f(X(C90))}" cy="${f(Y(0.9))}" r="5" fill="${ink}" stroke="#1b1b1b" stroke-width="1"/>`;
  s += text(X(C90) + 10, Y(0.9) + 22, '90% at H log n ≈ 2.11', 13, muted, 'start', 'bold');
  return s;
}
function panel() {
  const x = 830; let s = text(x, 132, 'What it means for a simulation', 19, ink, 'start', 'normal', SERIF);
  s += text(x, 156, 'A grid with n = e<tspan dy="-6" font-size="10">c/H</tspan><tspan dy="6"> points sees, to first order:</tspan>', 13, dim);
  const rows = [['50%', 'c = 0.5'], ['90%', 'c ≈ 2.11'], ['99%', 'c ≈ 4.41']];
  rows.forEach(([lvl, c], i) => { const y = 196 + i * 36; s += text(x, y, lvl, 21, halfC, 'start', 'bold') + text(x + 70, y, c, 21, ink, 'start', 'bold'); });
  s += text(x, 316, 'First-order prediction at H = 0.1 (rough', 13, dim) + text(x, 334, 'volatility): half ≈ 150 points, 90% ≈ 1.5 billion.', 13, dim);
  s += text(x, 360, 'Exact limit as H → 0; convergence is slow.', 12, dim, 'start', 'normal', SERIF);
  return s;
}
const draw = () =>
  text(40, 52, 'How much of a rough random path’s maximum does a grid of points see?', 26, ink, 'start', 'normal', SERIF) +
  text(40, 80, 'Fractional Brownian motion with small Hurst parameter H: the answer depends only on c = H log n', 15, muted) +
  chart() + `<path d="M805 112 L 805 372" stroke="${muted}" stroke-opacity=".22" stroke-width="1.2"/>` + panel();
const description = 'Banner for a paper on the expected maximum of very rough fractional Brownian motion on the unit interval. A chart plots the exact first-order share of the true expected maximum that a uniform grid of n points captures, against c = H log n from 0 to 5, where H is the Hurst parameter. The blue curve is F(c) divided by the square root of 2: it equals the square root of c/2 up to c = 1/2 and then 1 minus one half of e to the power 1/2 minus c, rising towards 100 per cent. A dashed green line at 100 per cent marks the whole path, whose expected maximum times the square root of H tends to the square root of 2 (Theorem 1). A gold point marks half the maximum at H log n = 1/2 and a white point marks 90 per cent at H log n of about 2.11. A side panel says what this means for a simulation: a grid with n = e to the c over H points sees half at c = 0.5, 90 per cent at c of about 2.11 and 99 per cent at c of about 4.41; the first-order prediction at H = 0.1 is about 150 points for half and about 1.5 billion for 90 per cent. These are limits as H tends to zero; convergence is slow.';
function frame(inner, background) {
  return bannerSvg({ inner, description, background, glow: { color: curveC, cx: '0.32', cy: '0.55', r: '0.42', opacity: '0.06' } });
}
const thumbSpec = {
  kicker: ['RESEARCH RELEASE · NOVEMBER 2026', 'PROBABILITY · FRACTIONAL BROWNIAN MOTION'],
  head: ['How high does', '<em>a rough path climb?</em>'], headSize: 70,
  sub: 'As fractional Brownian motion gets rougher, its expected maximum on [0, 1] grows like √(2/H). A conjecture from 2022, now settled.',
  tag: 'UNREFEREED CANDIDATE',
  hero: '<div class="eq-label">as the Hurst parameter H → 0</div><div class="hero-title">√H · E max → √2</div><div class="note">earlier bounds: between 1.128 and 1.695<br>a grid of n points sees half of it<br>when H log n = ½</div><div class="eq-foot">written proofs · numerical checks</div>'
};
module.exports = { draw, description, thumbSpec, F, R, cEta };
if (require.main === module) (async () => {
  const fs = require('fs'), pth = require('path'), os = require('os'), vm = require('vm');
  const ROOT = pth.join(__dirname, '..');
  // Guards: the plotted constants match the paper.
  if (Math.abs(R(0.5) - 0.5) > 1e-12 || Math.abs(F(0.5) - Math.sqrt(0.5)) > 1e-12) throw new Error('half point mismatch');
  if (Math.abs(C90 - (0.5 + Math.log(5))) > 1e-12 || Math.abs(C90 - 2.109) > 0.001 || Math.abs(C99 - 4.412) > 0.001) throw new Error('capture exponents mismatch');
  if (Math.abs(R(C90) - 0.9) > 1e-12 || Math.abs(R(C99) - 0.99) > 1e-12) throw new Error('inverse mismatch');
  if (Math.abs(Math.exp(0.5 / 0.1) - 148.4) > 0.1 || Math.abs(Math.exp(C90 / 0.1) / 1.45e9 - 1) > 0.01) throw new Error('worked example mismatch');
  const reg = JSON.parse(fs.readFileSync(pth.join(ROOT, 'data/BANNER_PALETTES.json'), 'utf8'));
  const { palettes } = require('./banner-palettes');
  const bsaved = reg.assignments.find(r => r.slug === SLUG); if (!bsaved) throw new Error('no saved banner palette'); const bname = bsaved.palette;
  const tp = require('./thumbnail-palettes');
  const tsaved = tp.load().assignments.find(r => r.slug === SLUG); if (!tsaved) throw new Error('no saved thumbnail palette');
  const tname = tsaved.editorialPalette || tsaved.palette;
  const svg = frame(draw(), { name: bname, colors: palettes[bname] });
  fs.writeFileSync(pth.join(ROOT, 'assets/art', SLUG + '.svg'), svg);
  console.log('art:', SLUG, 'banner palette', bname, '| thumbnail palette', tname, '| c90 =', C90.toFixed(4), 'c99 =', C99.toFixed(4));
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
