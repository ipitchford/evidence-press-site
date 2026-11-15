'use strict';
const { bannerSvg } = require('./svg-xml');
// Quantile and threshold calibration separate even for Gaussian forecasts (quantile-threshold-calibration-separate):
// banner, OG, thumbnail.
// "This image helps the reader understand" Figure 1 of the paper: on the common line of forecasts with median 0 and
// P(Y <= 0) = 1/2 (location 0, spread s in [1, 2]) the quantile check weights the spreads evenly (density 1) and the
// threshold check in proportion to the spread (density 2s/3). The same conditional error, eps(2s - 3), averages to 0
// under the first weighting and to eps/9 under the second: the Borel-Kolmogorov phenomenon.
// The weights, the error line and both averages are computed here from the paper's formulas (Lemma 3.3, eq. (8) on the
// segment t = 0, alpha = 1/2: K = 2s - 3). checkHook integrates both averages, recomputes c0 = 1 - (4/3) log 2 and
// P_Q(Y <= 0) at eps = 1/10, and compares them with the released gaussian_verification.json values
// (P_Q(Y <= 0) = 0.5075803759253407, binomial sample size 34146); it refuses to draw on mismatch.
// Reference: finite-sample-affine-diversification (contrasting conclusions carried by two curves and a region).
// Usage: node tools/calibration-separation-art.js [--render OUTDIR_FOR_INSPECTION] [--no-mirror]
const SLUG = 'quantile-threshold-calibration-separate';
const ink = '#f6f2ea', muted = '#e2e7ea', dim = '#bcc8cf', hot = '#ffb36b', cool = '#8ecbff';
const SANS = 'Arial,Helvetica,sans-serif', SERIF = 'Georgia,serif';
const text = (x, y, s, size = 18, color = ink, anchor = 'start', weight = 'normal', family = SANS, style = 'normal') => {
  if (/[<&]/.test(s.replace(/<\/?tspan[^>]*>/g, ''))) throw new Error('unescaped < or & in SVG text: ' + s);
  return `<text class="og-hide" x="${x}" y="${y}" fill="${color}" font-family="${family}" font-size="${size}" font-weight="${weight}" font-style="${style}" text-anchor="${anchor}">${s}</text>`;
};

// ---- the paper's quantities on the segment t = 0, alpha = 1/2 ----
const wQ = () => 1;                 // quantile conditioning: S uniform on [1, 2]
const wT = s => 2 * s / 3;          // threshold conditioning: density proportional to s, normalised on [1, 2]
const K = s => 2 * s - 3;           // conditional CDF error divided by eps (eq. (8) with m = 0, x = 0)
function simpson(f, a, b, n = 2000) {
  const h = (b - a) / n; let acc = f(a) + f(b);
  for (let i = 1; i < n; i++) acc += (i % 2 ? 4 : 2) * f(a + i * h);
  return acc * h / 3;
}
function checkHook() {
  const nQ = simpson(wQ, 1, 2), nT = simpson(wT, 1, 2);
  const avgQ = simpson(s => K(s) * wQ(s), 1, 2), avgT = simpson(s => K(s) * wT(s), 1, 2);
  if (Math.abs(nQ - 1) > 1e-12 || Math.abs(nT - 1) > 1e-12) throw new Error('weights not normalised');
  if (Math.abs(avgQ) > 1e-12) throw new Error('quantile average ' + avgQ);
  if (Math.abs(avgT - 1 / 9) > 1e-12) throw new Error('threshold average ' + avgT);
  const c0 = 1 - 4 / 3 * Math.log(2), pQ = 0.5 + c0 / 10;
  if (Math.abs(pQ - 0.5075803759253407) > 1e-15) throw new Error('P_Q(Y<=0) = ' + pQ);
  // two-sided binomial test at 5%, power 80%, p0 = 1/2 against p1 = pQ (normal approximation, as in the release)
  const z1 = 1.959963984540054, z2 = 0.8416212335729143;
  const n = Math.ceil(((z1 * Math.sqrt(0.25) + z2 * Math.sqrt(pQ * (1 - pQ))) / (pQ - 0.5)) ** 2);
  if (n !== 34146) throw new Error('binomial sample size ' + n);
  return { avgQ, avgT, c0, pQ, n };
}

// ---- drawing: weights (top) and the error with its two averages (bottom), against the spread s ----
const X0 = 480, X1 = 880;
const px = s => X0 + (X1 - X0) * (s - 1);
const TOP0 = 236, TOP1 = 118, WMAX = 1.5;     // weights panel: 0 .. 1.5
const pyW = v => TOP0 - (TOP0 - TOP1) * v / WMAX;
const BOT0 = 350, BOT1 = 262;                 // error panel: -1 .. 1, zero in the middle
const pyE = v => (BOT0 + BOT1) / 2 - (BOT0 - BOT1) / 2 * v;
function chart() {
  let s = '';
  const axis = 'rgba(255,255,255,0.55)';
  // top panel axes
  s += `<line x1="${X0}" y1="${TOP0}" x2="${X1 + 8}" y2="${TOP0}" stroke="${axis}" stroke-width="1.3"/>`;
  s += `<line x1="${X0}" y1="${TOP0}" x2="${X0}" y2="${TOP1 - 6}" stroke="${axis}" stroke-width="1.3"/>`;
  for (const v of [0, 1]) s += `<line x1="${X0 - 5}" y1="${pyW(v)}" x2="${X0}" y2="${pyW(v)}" stroke="${axis}"/>` + text(X0 - 9, pyW(v) + 4, String(v), 12, dim, 'end');
  s += text(X0 - 40, (TOP0 + TOP1) / 2, 'weight', 13, muted, 'middle').replace('<text ', `<text transform="rotate(-90 ${X0 - 40} ${(TOP0 + TOP1) / 2})" `);
  const line = (f, y, n = 40) => Array.from({ length: n + 1 }, (_, i) => { const v = 1 + i / n; return `${px(v).toFixed(1)},${y(f(v)).toFixed(1)}`; }).join(' ');
  s += `<polyline points="${line(wQ, pyW)}" fill="none" stroke="${cool}" stroke-width="3.2" stroke-linecap="round"/>`;
  s += `<polyline points="${line(wT, pyW)}" fill="none" stroke="${hot}" stroke-width="3.2" stroke-linecap="round"/>`;
  s += text(px(1.02), pyW(1) - 9, 'quantile check: equal weights', 12.5, cool, 'start', 'bold');
  s += text(px(1.98), pyW(wT(2)) + 4, 'threshold check: weight grows with spread', 12.5, hot, 'end', 'bold').replace(/y="([\d.]+)"/, (m, y) => `y="${(+y - 12).toFixed(1)}"`);
  // bottom panel: the error eps(2s - 3), shaded
  s += `<line x1="${X0}" y1="${pyE(0)}" x2="${X1 + 8}" y2="${pyE(0)}" stroke="${axis}" stroke-width="1.3"/>`;
  s += `<line x1="${X0}" y1="${BOT0}" x2="${X0}" y2="${BOT1 - 6}" stroke="${axis}" stroke-width="1.3"/>`;
  for (const v of [-1, 1]) s += `<line x1="${X0 - 5}" y1="${pyE(v)}" x2="${X0}" y2="${pyE(v)}" stroke="${axis}"/>` + text(X0 - 9, pyE(v) + 4, v > 0 ? '+ε' : '−ε', 12, dim, 'end');
  s += text(X0 - 40, (BOT0 + BOT1) / 2, 'error', 13, muted, 'middle').replace('<text ', `<text transform="rotate(-90 ${X0 - 40} ${(BOT0 + BOT1) / 2})" `);
  s += `<polygon points="${px(1)},${pyE(0)} ${line(K, pyE)} ${px(2)},${pyE(0)}" fill="rgba(255,255,255,0.08)"/>`;
  s += `<polyline points="${line(K, pyE)}" fill="none" stroke="${ink}" stroke-width="3" stroke-linecap="round"/>`;
  for (const v of [1, 1.5, 2]) s += `<line x1="${px(v)}" y1="${BOT0}" x2="${px(v)}" y2="${BOT0 + 5}" stroke="${axis}"/>` + text(px(v), BOT0 + 18, v.toFixed(1), 12, dim, 'middle');
  s += text((X0 + X1) / 2, BOT0 + 36, 'spread s of the forecasts with median 0 (all have P(Y ≤ 0) = ½)', 13, muted, 'middle');
  s += text(px(1.56), pyE(-0.25), 'the same error ε(2s − 3) on both:', 12.5, ink, 'start', 'bold');
  s += text(px(1.56), pyE(-0.25) + 15, 'outcomes run below the forecast', 12, dim);
  s += text(px(1.56), pyE(-0.25) + 29, 'for small s, above it for large s', 12, dim);
  return s;
}
function left() {
  let s = text(40, 118, 'Average the same error two ways', 15, muted, 'start', 'bold');
  s += text(40, 150, 'evenly (quantile check)', 14, cool);
  s += text(40, 178, '0', 28, cool, 'start', 'bold', SERIF);
  s += text(70, 178, 'check passes', 14, cool);
  s += text(40, 214, 'by spread (threshold check)', 14, hot);
  s += text(40, 242, 'ε/9', 28, hot, 'start', 'bold', SERIF);
  s += text(100, 242, 'check fails', 14, hot);
  s += text(40, 284, 'At ε = 1/10 outcomes fall below 0', 13, ink);
  s += text(40, 302, 'in 50.76% of cases; forecasts say 50%.', 13, ink);
  s += text(40, 320, 'About 34,000 cases detect it.', 13, ink);
  s += text(40, 352, 'Borel–Kolmogorov: conditioning on a', 12.5, dim, 'start', 'normal', SERIF, 'italic');
  s += text(40, 368, 'probability-zero set depends on how it is described', 12.5, dim, 'start', 'normal', SERIF, 'italic');
  return s;
}
function right() {
  const x0 = 952; let s = '';
  s += `<line x1="${x0 - 22}" y1="108" x2="${x0 - 22}" y2="372" stroke="rgba(255,255,255,0.16)" stroke-width="1"/>`;
  s += text(x0, 118, 'When do the checks agree?', 15, muted, 'start', 'bold');
  s += text(x0, 144, 'Forecasts with countably', 13, dim);
  s += text(x0, 162, 'many shapes: yes', 13, ink);
  s += text(x0, 180, '(Gneiting and Resin)', 12, dim, 'start', 'normal', SERIF, 'italic');
  s += text(x0, 210, 'Smooth Gaussian family:', 13, dim);
  s += text(x0, 228, 'no, in both directions', 13, ink, 'start', 'bold');
  s += text(x0, 258, 'Ordered categories: quantile', 13, dim);
  s += text(x0, 276, 'implies threshold for up to', 13, dim);
  s += text(x0, 294, 'three, not from four', 13, ink);
  s += text(x0, 330, 'Run both kinds of check', 13, ink, 'start', 'bold');
  s += text(x0, 360, 'Constructed population examples', 12, dim, 'start', 'normal', SERIF, 'italic');
  return s;
}
const draw = () =>
  text(40, 50, 'Quantile and threshold calibration checks can disagree, even for Gaussian forecasts', 25, ink, 'start', 'normal', SERIF) +
  text(40, 80, 'The same forecasts, two weightings: one error averages to 0 for the quantile check and to ε/9 for the threshold check', 15, muted) +
  left() + chart() + right();
const description = 'Banner for a paper showing that quantile and threshold calibration checks can disagree even for Gaussian forecasts. Title: Quantile and threshold calibration checks can disagree, even for Gaussian forecasts. Subtitle: The same forecasts, two weightings: one error averages to 0 for the quantile check and to ε/9 for the threshold check. Centre, two stacked panels against the spread s from 1 to 2 of the forecasts with median 0, which all have P(Y ≤ 0) = ½. Top: the weights the two checks give these forecasts; a flat blue line at 1 for the quantile check (equal weights), and a rising orange line from 2/3 to 4/3 for the threshold check, where the weight grows with the spread. Bottom: the same error ε(2s − 3) on both, a straight line from −ε at s = 1 to +ε at s = 2: outcomes run below the forecast for small s and above it for large s. Left: averaging the same error two ways gives 0 evenly, so the quantile check passes, and ε/9 weighted by spread, so the threshold check fails. At ε = 1/10 outcomes fall below 0 in 50.76% of cases while forecasts say 50%; about 34,000 cases detect it. Borel–Kolmogorov: conditioning on a probability-zero set depends on how it is described. Right: when do the checks agree? Forecasts with countably many shapes: yes (Gneiting and Resin). Smooth Gaussian family: no, in both directions. Ordered categories: quantile implies threshold for up to three, not from four. Run both kinds of check. Constructed population examples.';
function frame(inner, background) {
  return bannerSvg({ inner, description, background, glow: { color: '#ffb36b', cx: '0.55', cy: '0.6', r: '0.4', opacity: '0.06' } });
}
const thumbSpec = {
  kicker: ['RESEARCH RELEASE · NOVEMBER 2026', 'STATISTICS · FORECAST CALIBRATION'],
  head: ['Passed every <em>quantile</em> check?', 'The threshold checks can still fail.'], headSize: 48,
  sub: 'Smooth Gaussian forecasts: one error averages to 0 when forecasts are weighted evenly and to ε/9 when weighted by spread. Run both kinds of check.',
  tag: 'UNREFEREED CANDIDATE',
  hero: '<div class="eq-label">same forecasts, two weightings</div><div class="hero-title">0 vs ε/9</div><div class="note">at ε = 1/10: 50.76% below 0<br>where forecasts say 50%<br>about 34,000 cases detect it</div><div class="eq-foot">written proofs</div>'
};
module.exports = { draw, description, thumbSpec, checkHook };
if (require.main === module) (async () => {
  const fs = require('fs'), pth = require('path'), os = require('os'), vm = require('vm');
  const ROOT = pth.join(__dirname, '..');
  const chk = checkHook();
  console.log(`check: quantile average ${chk.avgQ.toExponential(2)}; threshold average ${chk.avgT.toFixed(12)} (1/9); c0 ${chk.c0.toFixed(12)}; P_Q(Y<=0) ${chk.pQ}; n ${chk.n}`);
  const { resolve: bannerResolve } = require('./banner-palettes');
  const bp = bannerResolve(SLUG); if (!bp) throw new Error('no banner palette');
  const tp = require('./thumbnail-palettes');
  const tname = tp.resolve(SLUG, true);
  const svg = frame(draw(), bp);
  fs.writeFileSync(pth.join(ROOT, 'assets/art', SLUG + '.svg'), svg);
  console.log('art:', SLUG, 'banner palette', bp.name, '| thumbnail palette', tname);
  const i = process.argv.indexOf('--render');
  if (i < 0) return;
  const inspect = process.argv[i + 1];
  fs.mkdirSync(inspect, { recursive: true });
  const { chromium } = require('playwright');
  const br = await chromium.launch(process.env.EVIDENCE_PRESS_CHROME ? { executablePath: process.env.EVIDENCE_PRESS_CHROME } : {});
  const shot = async (w, h, html, file, opts = {}) => {
    const p = await br.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: opts.dpr || 1 });
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
  if (process.argv.includes('--no-mirror')) { await br.close(); console.log('rendered (central mirror skipped)'); return; }
  const central = pth.join(process.env.EVIDENCE_PRESS_THUMBNAIL_DIR || pth.join(os.homedir(), 'thumbs'), SLUG + '.jpg');
  if (fs.existsSync(central) && !fs.readFileSync(thumbFile).equals(fs.readFileSync(central))) throw new Error('central thumbnail exists; refusing to overwrite: ' + central);
  fs.copyFileSync(thumbFile, central);
  if (!fs.readFileSync(thumbFile).equals(fs.readFileSync(central))) throw new Error('central mirror mismatch');
  await br.close();
  console.log('rendered OG, thumbnail, mirror and inspection PNGs');
})().catch(e => { console.error(e); process.exit(1); });
