'use strict';
const { bannerSvg } = require('./svg-xml');
// Exact step-size guarantees for DCA and proximal gradient (dca-gradient-mapping-conjecture): banner, OG, thumbnail.
// "This image helps the reader understand" what the best constant stepsize buys for convex proximal gradient
// (Theorem 3.7 and Figure 1 of the paper): the exact worst-case guarantee, as a multiple of the guarantee at the textbook
// step 1/L, plotted against the normalised step t = gamma*L for N = 2, 5 and 20 iterations, with the optimal steps marked
// (about 1.6, 1.75 and 1.9 times 1/L) and the steep fall just past each optimum.
// checkHook recomputes sigma_N (the root of sigma^(-2N) = 1 + 2N(1 + sigma)) by bisection, checks the continuity of the
// three branches of Lambda_N(t) at t = 1 and t = 1 + sigma_N, checks t* and the gain Lambda_N(t*)/(2N+1) against
// figures/optimal_stepsizes.json and results/extensions.json of the release (to 1e-9), checks the rounded values printed
// in the art (1.6, 1.75, 1.9; gains 1.48, 1.68, 1.88; 2% overshoot at N = 20 loses about 5x), and refuses to draw on any mismatch.
// Reference: txgraffiti-order48-successor (one exact object balanced with immediately readable values).
// Usage: node tools/dca-stepsize-art.js [--render OUTDIR_FOR_INSPECTION] [--no-mirror]
const SLUG = 'dca-gradient-mapping-conjecture';
const ink = '#f6f2ea', muted = '#e2e7ea', dim = '#c3ccd2', hot = '#ffc36b', rose = '#f2a7b5', mint = '#a8e6c1', sky = '#9fd3f2';
const SANS = 'Arial,Helvetica,sans-serif', SERIF = 'Georgia,serif';
const text = (x, y, s, size = 18, color = ink, anchor = 'start', weight = 'normal', family = SANS, style = 'normal') => {
  if (/<|&(?!(lt|gt|amp|minus|#\d+);)/.test(s.replace(/<\/?tspan[^>]*>/g, ''))) throw new Error('unescaped < or & in SVG text: ' + s);
  return `<text class="og-hide" x="${x}" y="${y}" fill="${color}" font-family="${family}" font-size="${size}" font-weight="${weight}" font-style="${style}" text-anchor="${anchor}">${s}</text>`;
};
// Exact reciprocal bound of the paper, eq. (3.10): Lambda_N(t) for convex proximal gradient (kappa = 0).
function sigma(N) { // unique root in (0,1) of sigma^(-2N) - 1 - 2N(1+sigma) (decreasing)
  let lo = 1e-12, hi = 1 - 1e-15;
  const f = s => Math.pow(s, -2 * N) - 1 - 2 * N * (1 + s);
  for (let i = 0; i < 200; i++) { const m = (lo + hi) / 2; if (f(m) > 0) lo = m; else hi = m; }
  return (lo + hi) / 2;
}
const Lam = (N, t, s = sigma(N)) => t <= 1 ? t * (2 * N + 2 - t) : t <= 1 + s ? 1 + 2 * N * t : Math.pow(t - 1, -2 * N);
const gain = (N, t) => Lam(N, t) / (2 * N + 1);
const NS = [2, 5, 20];
const SHOWN = { 2: ['1.6', '1.48'], 5: ['1.75', '1.68'], 20: ['1.9', '1.88'] };
function checkHook() {
  const fs = require('fs'), pth = require('path');
  const pkg = process.env.EP_DCA_PACKAGE;
  const fig = pkg ? JSON.parse(fs.readFileSync(pth.join(pkg, 'figures/optimal_stepsizes.json'), 'utf8')) : null;
  const ext = pkg ? JSON.parse(fs.readFileSync(pth.join(pkg, 'results/extensions.json'), 'utf8')) : null;
  const out = {};
  for (const N of NS) {
    const s = sigma(N), t = 1 + s;
    if (Math.abs(Math.pow(s, -2 * N) - 1 - 2 * N * (1 + s)) > 1e-6 * Math.pow(s, -2 * N)) throw new Error('root');
    if (Math.abs(1 * (2 * N + 2 - 1) - (1 + 2 * N)) > 0) throw new Error('branch continuity at t = 1');
    if (Math.abs((1 + 2 * N * t) - Math.pow(s, -2 * N)) > 1e-9 * (1 + 2 * N * t)) throw new Error('branch continuity at 1 + sigma');
    for (let u = 0.02; u < 1.999; u += 0.01) if (gain(N, u) > gain(N, t) + 1e-12) throw new Error('t* is not the maximiser');
    if (fig) { const r = fig.find(x => x.N === N); if (Math.abs(r.optimal_gamma_L - t) > 1e-9 || Math.abs(r.inverse_bound_gain - gain(N, t)) > 1e-9) throw new Error('figure data mismatch N=' + N); }
    if (ext) { const r = ext.table.find(x => x.N === N); if (Math.abs(Number(r.t_star) - t) > 1e-8 || Math.abs(Number(r.ratio_to_step_1_over_L) - gain(N, t)) > 1e-8) throw new Error('extensions mismatch N=' + N); }
    const [ts, gs] = SHOWN[N];
    if (Math.abs(Number(ts) - t) > (ts.length > 3 ? 0.005 : 0.05) || Math.abs(Number(gs) - gain(N, t)) > 0.005) throw new Error('printed values differ N=' + N);
    out[N] = { tStar: t, gain: gain(N, t) };
  }
  const over = gain(20, out[20].tStar) / gain(20, 1.02 * out[20].tStar), under = gain(20, out[20].tStar) / gain(20, 0.98 * out[20].tStar);
  if (Math.abs(over - 5.243) > 0.01 || Math.abs(under - 1.02) > 0.003) throw new Error('sensitivity mismatch');
  if (ext && Math.abs(Number(ext.sensitivity.find(x => x.N === 20)['loss_factor_at_1.02_tstar']) - over) > 0.01) throw new Error('sensitivity differs from extensions.json');
  return { checkedAgainstPackage: Boolean(pkg), ...out, overshoot20: over, undershoot20: under };
}
const X0 = 96, X1 = 650, Y0 = 345, Y1 = 92, TMIN = 0.5, TMAX = 2.0, GMAX = 2.0;
const px = t => X0 + (t - TMIN) / (TMAX - TMIN) * (X1 - X0);
const py = g => Y0 - g / GMAX * (Y0 - Y1);
const draw = () => {
  const c = checkHook();
  let s = '';
  s += text(40, 46, 'The best constant step for proximal gradient is not 1/L', 27, ink, 'start', 'normal', SERIF);
  s += text(40, 72, 'Exact worst-case guarantee on the gradient mapping, relative to the step 1/L, for convex problems (higher is better)', 14, muted);
  // axes and gridlines
  for (const g of [0.5, 1, 1.5, 2]) {
    s += `<line x1="${X0}" y1="${py(g).toFixed(1)}" x2="${X1}" y2="${py(g).toFixed(1)}" stroke="${dim}" stroke-width="${g === 1 ? 1.2 : 0.6}" opacity="${g === 1 ? 0.7 : 0.3}"/>`;
    s += text(X0 - 8, py(g) + 5, g === 1 ? '1×' : (g === 2 ? '2×' : String(g) + '×'), 12.5, dim, 'end');
  }
  for (const t of [0.5, 1, 1.5, 2]) s += text(px(t), Y0 + 20, t === 1 ? '1/L' : (t === 2 ? '2/L' : `${t}/L`), 12.5, dim, 'middle');
  s += `<line x1="${px(1)}" y1="${Y1 - 6}" x2="${px(1)}" y2="${Y0}" stroke="${dim}" stroke-width="1" stroke-dasharray="4 4" opacity="0.6"/>`;
  s += text(px(1) + 6, Y0 - 8, 'textbook step', 12, dim);
  s += text(X0 - 30, Y0 + 20, 'γ:', 12.5, dim, 'end');
  const cols = { 2: sky, 5: mint, 20: hot };
  for (const N of NS) {
    const pts = [];
    for (let i = 0; i <= 600; i++) { const t = TMIN + (TMAX - 1e-3 - TMIN) * i / 600; const g = gain(N, t); if (g >= 0) pts.push(`${px(t).toFixed(1)},${py(Math.min(g, GMAX + 0.2)).toFixed(1)}`); }
    s += `<clipPath id="clip${N}"><rect x="${X0}" y="${Y1 - 10}" width="${X1 - X0}" height="${Y0 - Y1 + 10}"/></clipPath>`;
    s += `<polyline clip-path="url(#clip${N})" points="${pts.join(' ')}" fill="none" stroke="${cols[N]}" stroke-width="2.6"/>`;
    const t = c[N].tStar, g = c[N].gain;
    s += `<circle cx="${px(t).toFixed(1)}" cy="${py(g).toFixed(1)}" r="5.5" fill="${cols[N]}" stroke="#151a1e" stroke-width="1.5"/>`;
  }
  // legend (top left of the plot, which the curves never reach)
  [[2, 'N = 2 iterations'], [5, 'N = 5'], [20, 'N = 20']].forEach(([N, lab], i) => {
    const y = Y1 + 8 + i * 22;
    s += `<line x1="${X0 + 14}" y1="${y - 4}" x2="${X0 + 40}" y2="${y - 4}" stroke="${cols[N]}" stroke-width="3"/>`;
    s += text(X0 + 48, y + 1, lab, 13, cols[N], 'start', 'bold');
  });
  const X = 720;
  s += text(X, 120, 'Best constant step (convex problems):', 15, ink, 'start', 'bold');
  s += text(X, 156, `≈ ${SHOWN[2][0]}/L at N = 2    → ${SHOWN[2][1]}× better`, 17, sky, 'start', 'bold');
  s += text(X, 184, `≈ ${SHOWN[5][0]}/L at N = 5   → ${SHOWN[5][1]}× better`, 17, mint, 'start', 'bold');
  s += text(X, 212, `≈ ${SHOWN[20][0]}/L at N = 20   → ${SHOWN[20][1]}× better`, 17, hot, 'start', 'bold');
  s += text(X, 246, 'A convex proximal term does not change it:', 14, ink);
  s += text(X, 266, 'the gradient-descent optimum stays optimal.', 14, ink);
  s += text(X, 298, 'Past the optimum the guarantee falls steeply:', 13.5, rose);
  s += text(X, 318, '2% too long loses about 5× at N = 20.', 13.5, rose);
  s += text(X, 350, 'Exact worst-case curves from the paper, not experiments.', 12.5, dim);
  s += text(40, 388, 'DCA and proximal gradient: the conjectured exact bounds hold for every N and are attained. Unrefereed candidate.', 12, dim);
  return s;
};
const description = 'Banner for a paper proving exact worst-case bounds for the difference-of-convex algorithm and proximal gradient. Title: the best constant step for proximal gradient is not 1 over L. Subtitle: exact worst-case guarantee on the gradient mapping, relative to the step 1 over L, for convex problems; higher is better. A chart with the constant stepsize from 0.5 over L to 2 over L on the horizontal axis and the guarantee from 0 to 2 times on the vertical axis; a dashed vertical line marks the textbook step 1 over L, where every curve equals 1 times. Three curves, for N equals 2 (blue), 5 (green) and 20 (amber) iterations, rise to a marked peak and then fall steeply. Right: best constant step for convex problems: about 1.6 over L at N equals 2, 1.48 times better; about 1.75 over L at N equals 5, 1.68 times better; about 1.9 over L at N equals 20, 1.88 times better. A convex proximal term does not change it: the gradient-descent optimum stays optimal. Past the optimum the guarantee falls steeply: 2 percent too long loses about 5 times at N equals 20. Exact worst-case curves from the paper, not experiments. Footer: DCA and proximal gradient: the conjectured exact bounds hold for every N and are attained; unrefereed candidate.';
function frame(inner, background) {
  const c = checkHook();
  if (Math.abs(c[20].tStar - 1.8971) > 1e-4 || !description.includes('1.9 over L at N equals 20')) throw new Error('stated values differ from the computation');
  return bannerSvg({ inner, description, background, glow: { color: '#ffc36b', cx: '0.3', cy: '0.5', r: '0.35', opacity: '0.07' } });
}
const thumbSpec = {
  kicker: ['RESEARCH RELEASE · NOVEMBER 2026', 'OPTIMISATION'],
  head: ['The best step is', '<em>not</em> 1/L'], headSize: 58,
  sub: 'Exact worst-case guarantees for DCA and proximal gradient, proved for every number of iterations.',
  tag: 'UNREFEREED CANDIDATE',
  hero: '<div class="eq-label">best constant step, 20 iterations</div><div class="hero-title">γ ≈ 1.9/L</div><div class="note">guarantee 1.88× better than 1/L</div><div class="eq-foot">2% too long: about 5× worse</div>'
};
module.exports = { draw, description, thumbSpec, checkHook };
if (require.main === module) (async () => {
  const fs = require('fs'), pth = require('path'), os = require('os'), vm = require('vm');
  const ROOT = pth.join(__dirname, '..');
  console.log('check:', JSON.stringify(checkHook()));
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
