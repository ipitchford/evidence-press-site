'use strict';
const { bannerSvg } = require('./svg-xml');
// Extremal laws for coupon collection with group drawings (coupon-collection-extremal-laws): banner, OG, thumbnail.
// "This image helps the reader understand" how much slower than uniform sampling a fair group-sampling rule can be:
// Figure 1 / Theorem 4.1 of the paper, the limiting chance of being unfinished after k boxes as a function of lambda,
// min(1, lambda) for the slowest fair rule against 1 - exp(-lambda) for the full model, with the peak gap 1/e at
// lambda = 1 (Theorem 5.4: the excess is at most 1/e + (1 - gamma)/ln(n/r) for every n). Centre: the Fano plane,
// the slowest fair rule for seven coupons in boxes of three (Proposition 6.1: 163/30 among 2,505,121 fair rules).
// checkHook checks the drawn plane is a Fano plane (every pair of points on exactly one line), the curves and the
// peak against the formulas, and, when EP_CCEL_PACKAGE points at the release package, the quoted values against
// results/verification.json and results/fair_maxima.json; it refuses to draw on any mismatch.
// Reference: txgraffiti-order48-successor (one exact object balanced with immediately readable values).
// Usage: node tools/coupon-collection-art.js [--render OUTDIR_FOR_INSPECTION] [--no-mirror]
const SLUG = 'coupon-collection-extremal-laws';
const ink = '#f6f2ea', muted = '#e2e7ea', dim = '#c3ccd2', hot = '#ffc36b', rose = '#f2a7b5', mint = '#a8e6c1', sky = '#9fd3f2';
const SANS = 'Arial,Helvetica,sans-serif', SERIF = 'Georgia,serif';
const text = (x, y, s, size = 18, color = ink, anchor = 'start', weight = 'normal', family = SANS, style = 'normal') => {
  if (/<|&(?!(lt|gt|amp|minus|#\d+);)/.test(s.replace(/<\/?tspan[^>]*>/g, ''))) throw new Error('unescaped < or & in SVG text: ' + s);
  return `<text class="og-hide" x="${x}" y="${y}" fill="${color}" font-family="${family}" font-size="${size}" font-weight="${weight}" font-style="${style}" text-anchor="${anchor}">${s}</text>`;
};
const VALUES = { fanoMax: '163/30', fanoCount: 2505121, sevenFour: ['47/12', '257/68'], oneMinusGamma: 0.42278433509846713 };
// Fano plane: triangle vertices 0,1,2; edge midpoints 3 (0-1), 4 (1-2), 5 (0-2); centre 6.
const LINES = [[0, 3, 1], [1, 4, 2], [0, 5, 2], [0, 6, 4], [1, 6, 5], [2, 6, 3], [3, 4, 5]];
const upper = l => Math.min(1, l), lower = l => 1 - Math.exp(-l);
function checkHook() {
  const fs = require('fs'), pth = require('path');
  if (LINES.length !== 7) throw new Error('Fano plane has seven lines');
  for (let a = 0; a < 7; a++) for (let b = a + 1; b < 7; b++) {
    const k = LINES.filter(L => L.includes(a) && L.includes(b)).length;
    if (k !== 1) throw new Error(`pair ${a},${b} lies on ${k} lines`);
  }
  let best = [0, -1];
  for (let i = 1; i <= 3000; i++) { const l = i / 1000, g = upper(l) - lower(l); if (g > best[1]) best = [l, g]; }
  if (Math.abs(best[0] - 1) > 1e-9 || Math.abs(best[1] - Math.exp(-1)) > 1e-12) throw new Error('peak gap is not 1/e at lambda = 1');
  if (Math.abs(Math.exp(-1) + VALUES.oneMinusGamma / Math.log(2) - 0.9778283047835385) > 1e-12) throw new Error('bound at r = n/2');
  const pkg = process.env.EP_CCEL_PACKAGE;
  if (pkg) {
    const v = JSON.parse(fs.readFileSync(pth.join(pkg, 'results/verification.json'), 'utf8'));
    const f = JSON.parse(fs.readFileSync(pth.join(pkg, 'results/fair_maxima.json'), 'utf8'));
    if (v.status !== 'ALL CHECKS PASSED' || f.status !== 'ALL CHECKS PASSED') throw new Error('verification status');
    if (v.seven_point.design_mean !== VALUES.sevenFour[0] || v.seven_point.full_mean !== VALUES.sevenFour[1]) throw new Error('seven-point means');
    if (v.gap_bound.one_minus_gamma !== VALUES.oneMinusGamma || !(v.gap_bound.bound_at_r_eq_n_over_2 < 1)) throw new Error('gap bound');
    const s = f['(7,3)'];
    if (s.max_mean !== VALUES.fanoMax || s.fair_mechanisms !== VALUES.fanoCount || !/Fano/.test(s.structure)) throw new Error('(7,3) maximum');
  }
  return { checkedAgainstPackage: Boolean(pkg), peakLambda: best[0], peakGap: best[1] };
}
// Chart geometry: lambda in [0, 3] -> x; probability in [0, 1] -> y.
const X0 = 850, X1 = 1150, Y0 = 318, Y1 = 118;
const px = l => X0 + l / 3 * (X1 - X0), py = q => Y0 - q * (Y0 - Y1);
const curve = f => { const p = []; for (let i = 0; i <= 300; i++) { const l = 3 * i / 300; p.push(`${px(l).toFixed(1)},${py(f(l)).toFixed(1)}`); } return p.join(' '); };
const draw = () => {
  checkHook();
  let s = '';
  s += text(40, 52, 'How slow can fair group sampling be?', 25, hot, 'start', 'normal', SERIF);
  s += text(40, 92, 'Each box holds a group of coupons; fair means', 15, muted);
  s += text(40, 112, 'every coupon is equally common.', 15, muted);
  s += text(40, 152, 'Proved: a fair rule is never more than', 15, ink, 'start', 'bold');
  s += text(40, 175, '1/e + 0.42/ln(n/r) boxes slower on average', 15, hot, 'start', 'bold');
  s += text(40, 198, 'than uniform sampling, so under one box', 15, ink, 'start', 'bold');
  s += text(40, 221, 'when boxes hold at least half the coupons.', 15, ink, 'start', 'bold');
  s += text(40, 262, 'Slowest fair rules: Steiner designs.', 14, mint);
  s += text(40, 283, 'Fastest rules: equal disjoint groups', 14, sky);
  s += text(40, 302, '(when the box size divides n).', 14, sky);
  // centre: Fano plane
  const cx = 600, top = 104, side = 170, h = side * Math.sqrt(3) / 2;
  const P = [[cx, top], [cx - side / 2, top + h], [cx + side / 2, top + h]];
  P.push([(P[0][0] + P[1][0]) / 2, (P[0][1] + P[1][1]) / 2], [(P[1][0] + P[2][0]) / 2, (P[1][1] + P[2][1]) / 2], [(P[0][0] + P[2][0]) / 2, (P[0][1] + P[2][1]) / 2]);
  P.push([cx, top + 2 * h / 3]);
  const cols = [rose, mint, sky, hot, rose, mint];
  LINES.slice(0, 6).forEach((L, i) => { const a = P[L[0]], b = P[L[2]]; s += `<line x1="${a[0].toFixed(1)}" y1="${a[1].toFixed(1)}" x2="${b[0].toFixed(1)}" y2="${b[1].toFixed(1)}" stroke="${cols[i]}" stroke-width="2.6" stroke-opacity="0.85"/>`; });
  s += `<circle cx="${cx}" cy="${(top + 2 * h / 3).toFixed(1)}" r="${(h / 3).toFixed(1)}" fill="none" stroke="${sky}" stroke-width="2.6" stroke-opacity="0.85"/>`;
  for (const [x, y] of P) s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="7" fill="${ink}" stroke="#1b1b1b" stroke-width="1.5"/>`;
  s += text(cx, 66, 'The Fano plane: 7 coupons, 7 boxes of 3', 13.5, ink, 'middle', 'bold');
  s += text(cx, 84, '(each line is a box; any two lines meet)', 12.5, dim, 'middle');
  s += text(cx, top + h + 30, `slowest of ${VALUES.fanoCount.toLocaleString('en-GB')} fair rules:`, 13, hot, 'middle', 'bold');
  s += text(cx, top + h + 48, `${VALUES.fanoMax} boxes on average`, 13, hot, 'middle', 'bold');
  // right: limit curves with the 1/e gap
  s += text(X0 - 20, 52, 'Chance still unfinished after k boxes', 14, ink, 'start', 'bold');
  s += text(X0 - 20, 72, '(limit for large n; critical window)', 12.5, dim);
  s += `<line x1="${X0}" y1="${Y0}" x2="${X1}" y2="${Y0}" stroke="${dim}" stroke-width="1.2"/><line x1="${X0}" y1="${Y0}" x2="${X0}" y2="${Y1 - 6}" stroke="${dim}" stroke-width="1.2"/>`;
  s += text(X0 - 6, py(1) + 4, '1', 11.5, dim, 'end'); s += text(X0 - 6, py(0) + 4, '0', 11.5, dim, 'end');
  s += text(px(1), Y0 + 16, '1', 11.5, dim, 'middle');
  s += `<polyline points="${curve(upper)}" fill="none" stroke="${hot}" stroke-width="2.6"/>`;
  s += `<polyline points="${curve(lower)}" fill="none" stroke="${sky}" stroke-width="2.6"/>`;
  s += `<line x1="${px(1)}" y1="${py(1).toFixed(1)}" x2="${px(1)}" y2="${py(lower(1)).toFixed(1)}" stroke="${rose}" stroke-width="2" stroke-dasharray="4 3"/>`;
  s += text(px(1) + 8, py(0.86), 'gap 1/e ≈ 0.37', 13, rose, 'start', 'bold');
  s += text(px(2.2), py(1) - 8, 'slowest fair rule', 12.5, hot, 'middle', 'bold');
  s += text(px(2.45), py(lower(2.45)) + 36, 'uniform sampling', 12.5, sky, 'middle', 'bold');
  s += text((X0 + X1) / 2, Y0 + 34, 'λ = expected coupons missing after k boxes', 12.5, dim, 'middle');
  s += text(40, 388, 'Idealised independent draws. Curves are limits as n grows (Theorem 4.1); the 1/e gap is a limit, not a finite-n guarantee. Unrefereed candidate.', 12, dim);
  return s;
};
const description = 'Banner for a paper on the slowest and fastest ways to fill boxes of coupons in groups. Title: how slow can fair group sampling be? Left text: each box holds a group of coupons; fair means every coupon is equally common. Proved: a fair rule is never more than 1/e + 0.42/ln(n/r) boxes slower on average than uniform sampling, so under one box when boxes hold at least half the coupons. Slowest fair rules: Steiner designs. Fastest rules: equal disjoint groups when the box size divides n. Centre: the Fano plane, seven points and seven lines of three points, any two lines meeting; with the lines as boxes it is the slowest of 2,505,121 fair rules for seven coupons in boxes of three, at 163/30 boxes on average. Right: the limiting chance of still being unfinished after k boxes against lambda, the expected number of coupons missing; the slowest fair rule follows min(1, lambda) and uniform sampling follows 1 minus e to the minus lambda, with the gap of 1/e, about 0.37, marked at lambda = 1. Footer: idealised independent draws; the curves are limits as n grows; the 1/e gap is a limit, not a finite-n guarantee; unrefereed candidate.';
function frame(inner, background) {
  checkHook();
  if (!description.includes('163/30') || !description.includes('2,505,121')) throw new Error('stated values differ from the computation');
  return bannerSvg({ inner, description, background, glow: { color: '#ffc36b', cx: '0.5', cy: '0.45', r: '0.3', opacity: '0.07' } });
}
const thumbSpec = {
  kicker: ['RESEARCH RELEASE · NOVEMBER 2026', 'PROBABILITY · COMBINATORICS'],
  head: ['How slow can fair', '<em>group sampling be?</em>'], headSize: 58,
  sub: 'Collecting a full set when coupons come in groups: the slowest and fastest rules.',
  tag: 'UNREFEREED CANDIDATE',
  hero: '<div class="eq-label">extra boxes, at most</div><div class="hero-title">1/e + 0.42/ln(n/r)</div><div class="note">fair rule vs uniform sampling<br>limit 1/e ≈ 0.37 is reached</div><div class="eq-foot">proved for every n</div>'
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
