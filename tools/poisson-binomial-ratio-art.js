'use strict';
const { bannerSvg } = require('./svg-xml');
// Poisson-binomial density ratio: banner, OG card and thumbnail.
// "This image helps the reader understand" that for a count of independent yes/no events with unequal chances,
// no single outcome is more likely than under the Poisson law with the same mean by more than the factor
// mean/variance: the exact Poisson-binomial bars stay under the Poisson probabilities scaled up by lambda/v.
// Source (paper 0.1.0-candidate, 3 Nov 2026): Theorem 1.1, v P(X = k) <= lambda pi_lambda(k); the earlier bound
// 1/(1 - max p_i) of Duembgen and Wellner (2020); the Section 8 numerical illustration (one parameter 0.99 and 9,999
// parameters 0.01: old bound 100, new bound lambda/v = 1.02, actual maximal ratio about 1.0099).
// The plotted law is exact: p = (0.9, 0.6, 0.5, 0.3, 0.2), lambda = 2.5, v = 0.95, lambda/v = 50/19, computed below.
// Usage: node tools/poisson-binomial-ratio-art.js [--render OUTDIR_FOR_INSPECTION] [--no-mirror]
const SLUG = 'poisson-binomial-density-ratio';
const ink = '#f4f1ea', muted = '#e3d9c9', dim = '#c4b7a2';
const barC = '#ffcf7a', poiC = '#9fd2ff', envC = '#f2a7c3', okC = '#9be3c0';
const SANS = 'Arial,Helvetica,sans-serif', SERIF = 'Georgia,serif';
const text = (x, y, s, size = 18, color = ink, anchor = 'start', weight = 'normal', family = SANS) =>
  `<text class="og-hide" x="${x}" y="${y}" fill="${color}" font-family="${family}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}">${s}</text>`;
const f = v => (+v).toFixed(1);
const P = [0.9, 0.6, 0.5, 0.3, 0.2];
function pb(p) { let b = [1]; for (const q of p) { const n = new Array(b.length + 1).fill(0); b.forEach((x, k) => { n[k] += x * (1 - q); n[k + 1] += x * q; }); b = n; } return b; }
const B = pb(P);
const LAM = P.reduce((a, q) => a + q, 0), V = P.reduce((a, q) => a + q * (1 - q), 0), RATIO = LAM / V;
const fact = k => (k ? k * fact(k - 1) : 1);
const poi = k => Math.exp(-LAM) * LAM ** k / fact(k);
const KMAX = 7;
const RHO = Math.max(...B.map((b, k) => b / poi(k)));
// Chart geometry.
const X0 = 70, X1 = 650, Y0 = 336, Y1 = 118, PMAX = 0.72;
const DX = (X1 - X0) / (KMAX + 1);
const X = k => X0 + (k + 0.5) * DX;
const Y = p => Y0 - p / PMAX * (Y0 - Y1);
function chart() {
  let s = '';
  for (let k = 0; k <= 3; k++) { const p = k * 0.2; s += `<path d="M${X0} ${f(Y(p))} H${X1}" stroke="${muted}" stroke-opacity="${k ? 0.12 : 0.4}" stroke-width="1"/>` + text(X0 - 8, Y(p) + 4, p.toFixed(1), 12, dim, 'end'); }
  for (let k = 0; k <= KMAX; k++) {
    const b = B[k] || 0, w = DX * 0.46;
    if (b > 0) s += `<rect x="${f(X(k) - w / 2)}" y="${f(Y(b))}" width="${f(w)}" height="${f(Y0 - Y(b))}" rx="3" fill="${barC}" fill-opacity="0.92"/>`;
    s += text(X(k), Y0 + 20, String(k), 13, dim, 'middle');
  }
  const pts = (scale) => { const a = []; for (let k = 0; k <= KMAX; k++) a.push(`${f(X(k))} ${f(Y(scale * poi(k)))}`); return a; };
  s += `<path d="M${pts(RATIO).join(' L')}" stroke="${envC}" stroke-width="2.6" stroke-dasharray="8 6" fill="none" stroke-linejoin="round"/>`;
  s += `<path d="M${pts(1).join(' L')}" stroke="${poiC}" stroke-width="2.4" fill="none" stroke-linejoin="round"/>`;
  for (let k = 0; k <= KMAX; k++) s += `<circle cx="${f(X(k))}" cy="${f(Y(poi(k)))}" r="4.2" fill="${poiC}"/>`;
  s += text(X0, Y0 + 40, 'number of events k', 13, dim, 'start', 'normal', SERIF);
  s += text(X0 - 8, Y1 - 12, 'probability of exactly k events', 13, dim, 'start', 'normal', SERIF);
  s += text(X(4) + 20, Y(RATIO * poi(4)) - 14, 'Poisson × mean/variance', 14, envC, 'start', 'bold');
  s += `<circle cx="${X0 + 12}" cy="${f(Y(0.66) - 4)}" r="4.2" fill="${poiC}"/>` + text(X0 + 24, Y(0.66), 'Poisson, same mean', 13, poiC, 'start', 'bold');
  s += text(X(5) - 14, Y(0.64), 'gold bars: the exact law', 13, barC, 'start', 'bold') + text(X(5) - 14, Y(0.64) + 17, 'for chances 0.9, 0.6, 0.5,', 13, barC) + text(X(5) - 14, Y(0.64) + 34, '0.3 and 0.2', 13, barC);
  return s;
}
function panel() {
  const x = 700; let s = text(x, 134, 'The guarantee (Theorem 1.1)', 19, ink, 'start', 'normal', SERIF);
  s += text(x, 164, 'No outcome is more likely than under Poisson', 14, ink) + text(x, 183, 'by more than mean ÷ variance.', 14, ink);
  s += text(x, 211, `Here mean 2.5, variance 0.95: factor ${RATIO.toFixed(2)};`, 13, envC, 'start', 'bold') + text(x, 229, `the bars reach at most ${RHO.toFixed(2)} × Poisson.`, 13, dim);
  s += text(x, 268, 'Worked example: one chance 0.99, 9,999 at 0.01', 14, okC, 'start', 'bold');
  s += text(x, 300, 'old bound 100', 22, dim, 'start', 'bold') + text(x + 160, 300, '→', 22, ink, 'start', 'bold') + text(x + 196, 300, 'new bound 1.02', 22, okC, 'start', 'bold');
  s += text(x, 324, 'actual worst factor ≈ 1.0099', 14, ink);
  s += text(x, 360, 'Single outcomes and events; one-sided tails and total variation are compared differently.', 11.5, dim, 'start', 'normal', SERIF);
  return s;
}
const draw = () =>
  text(40, 52, 'How far can a count of independent chances beat its Poisson approximation?', 26, ink, 'start', 'normal', SERIF) +
  text(40, 80, 'Never by more than the factor mean ÷ variance: the Dümbgen–Wellner conjecture, proved for every Poisson-binomial count', 15, muted) +
  chart() + `<path d="M680 112 L 680 372" stroke="${muted}" stroke-opacity=".22" stroke-width="1.2"/>` + panel();
const description = 'Banner for a paper proving that a count of independent yes/no events with unequal chances is never more likely to take any value than the Poisson law with the same mean, by more than the factor mean divided by variance. Left: the exact distribution of the number of successes among five independent events with chances 0.9, 0.6, 0.5, 0.3 and 0.2 (gold bars, mean 2.5, variance 0.95), the Poisson probabilities with the same mean (blue dots and line), and the Poisson probabilities multiplied by mean over variance, about 2.63 (pink dashed line). Every bar lies below the dashed line; the largest bar-to-Poisson ratio is about 1.63, at three events. Right: the guarantee, and the paper’s worked example: one event with chance 0.99 and 9,999 events with chance 0.01, where the earlier bound gives a factor of 100, the new bound gives 1.02 and the actual worst factor is about 1.0099. The bound concerns single outcomes and events; one-sided tails and total variation distance are compared by other classical results.';
function frame(inner, background) {
  return bannerSvg({ inner, description, background, glow: { color: barC, cx: '0.3', cy: '0.6', r: '0.42', opacity: '0.06' } });
}
const thumbSpec = {
  kicker: ['RESEARCH RELEASE · NOVEMBER 2026', 'PROBABILITY · POISSON APPROXIMATION'],
  head: ['Poisson is never', '<em>off by more than mean ÷ variance</em>'], headSize: 62,
  sub: 'For any count of independent yes/no events, no outcome is more likely than its Poisson approximation by more than mean ÷ variance.',
  tag: 'UNREFEREED CANDIDATE',
  hero: '<div class="eq-label">worked example</div><div class="hero-title">100 → 1.02</div><div class="note">one chance 0.99, 9,999 at 0.01<br>old bound 100, new bound 1.02<br>actual worst factor ≈ 1.0099</div><div class="eq-foot">written proofs · exact checks</div>'
};
module.exports = { draw, description, thumbSpec };
if (require.main === module) (async () => {
  const fs = require('fs'), pth = require('path'), os = require('os'), vm = require('vm');
  const ROOT = pth.join(__dirname, '..');
  // Guards: the plotted law is the exact convolution and satisfies Theorem 1.1; constants match the paper.
  if (Math.abs(B.reduce((a, x) => a + x, 0) - 1) > 1e-14 || Math.abs(LAM - 2.5) > 1e-14 || Math.abs(V - 0.95) > 1e-14) throw new Error('law mismatch');
  if (!B.every((b, k) => V * b <= LAM * poi(k) * (1 + 1e-12))) throw new Error('Theorem 1.1 violated in plot');
  if (!(RHO > 1.6 && RHO < 1.65 && Math.abs(RATIO - 50 / 19) < 1e-12)) throw new Error('ratio mismatch');
  { const lam = 0.99 + 9999 * 0.01, v = 0.99 * 0.01 + 9999 * 0.01 * 0.99; if (Math.abs(lam / v - 1.02) > 1e-12 || Math.abs(1 / (1 - 0.99) - 100) > 1e-9) throw new Error('worked example mismatch'); }
  const reg = JSON.parse(fs.readFileSync(pth.join(ROOT, 'data/BANNER_PALETTES.json'), 'utf8'));
  const { palettes } = require('./banner-palettes');
  const bsaved = reg.assignments.find(r => r.slug === SLUG); if (!bsaved) throw new Error('no saved banner palette'); const bname = bsaved.palette;
  const tp = require('./thumbnail-palettes');
  const tsaved = tp.load().assignments.find(r => r.slug === SLUG); if (!tsaved) throw new Error('no saved thumbnail palette');
  const tname = tsaved.editorialPalette || tsaved.palette;
  const svg = frame(draw(), { name: bname, colors: palettes[bname] });
  fs.writeFileSync(pth.join(ROOT, 'assets/art', SLUG + '.svg'), svg);
  console.log('art:', SLUG, 'banner palette', bname, '| thumbnail palette', tname, '| lambda/v =', RATIO.toFixed(4), 'rho =', RHO.toFixed(4));
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
