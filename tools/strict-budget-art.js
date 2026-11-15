'use strict';
const { bannerSvg } = require('./svg-xml');
// Linear additive loss in bipartite matching with strict budgets: banner, OG, thumbnail.
// "This image helps the reader understand" how much value rounding can lose when no budget may be broken, and why some
// loss is forced. Left: the loss in units of W, the most valuable single pairing: order m² (Grandoni, Ravi, Singh and
// Zenklusen 2014), about 9m from the earlier release's method (Remark 6), at most (14m−5)/6 ≤ 7m/3 here (Theorem 1;
// W for one budget, previously 2W), and at least about m (knapsack, Section 1.1). Right: the Δ = 3 gadget of Section 7.1
// and Figure 1: three copies of K_{3,3} each missing one edge, joined by two bridges; 24 constrained edges with quota 8;
// every perfect matching avoids both bridges and uses 9 constrained edges, so the quota forces a loss of 2/3 > 1/2.
// Usage: node tools/strict-budget-art.js [--render OUTDIR_FOR_INSPECTION] [--no-mirror]
const SLUG = 'strict-budget-matching-linear-loss';
const ink = '#f4f1ea', muted = '#dfe6ec', dim = '#b9c8d4';
const teal = '#7fe0c8', purple = '#c9a7ff', ochre = '#f0b54a', ghost = '#93a3b0', node = '#e8eef2';
const SANS = 'Arial,Helvetica,sans-serif', SERIF = 'Georgia,serif';
const text = (x, y, s, size = 18, color = ink, anchor = 'start', weight = 'normal', family = SANS, style = 'normal') =>
  `<text class="og-hide" x="${x}" y="${y}" fill="${color}" font-family="${family}" font-size="${size}" font-weight="${weight}" font-style="${style}" text-anchor="${anchor}">${s}</text>`;
const dot = (x, y, c = node) => `<circle cx="${x}" cy="${y}" r="7" fill="${c}" stroke="#10202b" stroke-width="1.5"/>`;
// Gadget G_3 exactly as in checks/verify_lower_bounds.py: left vertex i*d+a, right vertex i*d+b; constrained edges
// (i*d+a, i*d+b) for (a,b) != (0,0); bridges (left (i+1)*d, right i*d).
const D = 3;
const G = { x0: 640, dx: 52, block: 190, yTop: 170, yBot: 282 };
const leftXY = n => [G.x0 + Math.floor(n / D) * G.block + (n % D) * G.dx, G.yTop];
const rightXY = n => [G.x0 + Math.floor(n / D) * G.block + (D - 1 - (n % D)) * G.dx, G.yBot]; // index 0 drawn rightmost, so bridges cross the gaps
function gadgetEdges() {
  const red = [], blue = [], missing = [];
  for (let i = 0; i < D; i++) for (let a = 0; a < D; a++) for (let b = 0; b < D; b++)
    ((a || b) ? red : missing).push([i * D + a, i * D + b]);
  for (let i = 0; i < D - 1; i++) blue.push([(i + 1) * D, i * D]);
  return { red, blue, missing };
}
function gadget() {
  const { red, blue, missing } = gadgetEdges();
  let s = '';
  for (const [l, r] of missing) { const [x1, y1] = leftXY(l), [x2, y2] = rightXY(r); s += `<path d="M${x1} ${y1} L${x2} ${y2}" stroke="${ghost}" stroke-width="1.6" stroke-dasharray="4 5"/>`; }
  for (const [l, r] of red) { const [x1, y1] = leftXY(l), [x2, y2] = rightXY(r); s += `<path d="M${x1} ${y1} L${x2} ${y2}" stroke="${purple}" stroke-width="1.8" stroke-opacity="0.9"/>`; }
  for (const [l, r] of blue) {
    const [x1, y1] = rightXY(r), [x2, y2] = leftXY(l);
    s += `<path d="M${x1} ${y1} C${x1 + 50} ${y1 - 20} ${x2 - 50} ${y2 + 20} ${x2} ${y2}" fill="none" stroke="${ochre}" stroke-width="4"/>`;
  }
  for (let n = 0; n < D * D; n++) { s += dot(...leftXY(n)) + dot(...rightXY(n)); }
  for (let i = 0; i < D; i++) s += text(G.x0 + i * G.block + G.dx, 318, `block ${i}`, 14, dim, 'middle');
  s += text(895, 120, 'Why some loss is forced: the Δ = 3 example (Figure 1)', 17, ink, 'middle', 'bold');
  s += text(895, 144, `<tspan fill="${purple}">24 constrained edges, quota 8</tspan>   ·   <tspan fill="${ochre}">2 bridges</tspan>   ·   <tspan fill="${ghost}">missing edge</tspan>`, 14, muted, 'middle');
  s += text(895, 350, 'Every perfect matching avoids both bridges, so it uses 9 constrained edges:', 14.5, muted, 'middle');
  s += text(895, 372, 'one over the quota. The best allowed matching has 8 edges, against 26/3: loss 2/3 &gt; 1/2.', 14.5, muted, 'middle');
  return s;
}
function ladder() {
  let s = text(40, 128, 'Value lost when rounding a fractional plan without breaking any of m budgets,', 15, dim, 'start', 'normal', SERIF, 'italic');
  s += text(40, 148, 'in units of W, the most valuable single pairing:', 15, dim, 'start', 'normal', SERIF, 'italic');
  const rows = [
    ['previous general bound (2014)', 'order m²', muted, 'normal'],
    ["earlier release's method", 'about 9m', muted, 'normal'],
    ['this release (Theorem 1)', '≤ 7m/3', teal, 'bold'],
    ['one budget', '1 (was 2)', teal, 'bold'],
    ['always unavoidable (knapsack)', 'about m', ochre, 'normal']];
  rows.forEach(([label, value, c, w], k) => {
    const y = 190 + k * 38;
    s += text(40, y, label, 17, c === muted ? muted : c, 'start', w);
    s += text(470, y, value, 21, c === muted ? ink : c, 'end', 'bold');
    s += `<path d="M40 ${y + 12} H470" stroke="${dim}" stroke-opacity="0.25" stroke-width="1"/>`;
  });
  return s;
}
function checkHook() {
  const { red, blue, missing } = gadgetEdges();
  const edges = red.concat(blue);
  if (D * D * 2 !== 18 || edges.length !== 26 || red.length !== 24 || blue.length !== 2 || missing.length !== 3) throw new Error('gadget counts');
  const quota = Math.ceil(red.length / D);
  if (quota !== 8) throw new Error('quota');
  // Enumerate all perfect matchings: each must avoid the bridges and use 9 constrained edges (64 in all).
  const redSet = new Set(red.map(e => e.join()));
  const adj = Array.from({ length: D * D }, () => []);
  for (const [l, r] of edges) adj[l].push(r);
  let perfect = 0;
  const go = (l, used, nred) => {
    if (l === D * D) { if (nred !== 9) throw new Error('perfect matching with ' + nred + ' constrained edges'); perfect++; return; }
    for (const r of adj[l]) if (!(used & (1 << r))) go(l + 1, used | (1 << r), nred + redSet.has(l + ',' + r));
  };
  go(0, 0, 0);
  if (perfect !== 64) throw new Error('perfect matchings ' + perfect);
  // Theorem 1 coefficients: (14m-5)/6 <= 7m/3 for m >= 2.
  for (let m = 2; m <= 50; m++) if (6 * (14 * m - 5) > 6 * 14 * m) throw new Error('coefficient');
}
const draw = () =>
  text(40, 50, 'Strict budgets: rounding loses at most 7m/3 top pairings', 26, ink, 'start', 'normal', SERIF) +
  text(40, 78, 'Bipartite matching with m hard budgets: loss ≤ (14m−5)/6 · W ≤ (7m/3) · W, down from order m² · W', 15, muted) +
  ladder() + gadget() +
  text(40, 392, 'Diagram drawn from the paper (Theorem 1, Section 7.1, Figure 1); not data.', 11.5, dim, 'start', 'normal', SERIF, 'italic');
const description = 'Banner for a paper on bipartite matching with strict budgets. Title: Strict budgets: rounding loses at most 7m/3 top pairings. On the left, a list of the value lost when a fractional plan is rounded without breaking any of m budgets, in units of W, the most valuable single pairing: previous general bound (2014), order m squared; the earlier release\'s method, about 9m; this release (Theorem 1), at most 7m/3; one budget, 1 (was 2); always unavoidable (knapsack), about m. On the right, the example with maximum degree 3 from Figure 1: three blocks of three top and three bottom dots, each joined by purple constrained edges except one missing edge shown dashed, and two thick ochre bridges joining consecutive blocks. Labels: 24 constrained edges, quota 8; 2 bridges. Caption: every perfect matching avoids both bridges, so it uses 9 constrained edges, one over the quota; the best allowed matching has 8 edges against 26/3, a loss of 2/3, more than 1/2.';
function frame(inner, background) {
  return bannerSvg({ inner, description, background, glow: { color: teal, cx: '0.25', cy: '0.55', r: '0.45', opacity: '0.06' } });
}
const thumbSpec = {
  kicker: ['RESEARCH RELEASE · NOVEMBER 2026', 'OPTIMISATION'],
  head: ['Strict budgets', 'lose at most <em>7m/3</em>'], headSize: 60,
  sub: 'Rounding a fractional worker–task plan without breaking any of m budgets costs at most about 7m/3 times the most valuable pairing, down from order m².',
  tag: 'UNREFEREED CANDIDATE',
  hero: '<div class="eq-label">m hard budgets</div><div class="hero-title">≤ 7m/3 · W</div><div class="note">was order m² · W (2014)<br>one budget: W (was 2W)<br>unavoidable: about m · W</div><div class="eq-foot">follow-up to the vector-matching release</div>'
};
module.exports = { draw, description, thumbSpec };
if (require.main === module) (async () => {
  const fs = require('fs'), pth = require('path'), os = require('os'), vm = require('vm');
  const ROOT = pth.join(__dirname, '..');
  // Guards: the drawn gadget matches the paper (Section 7.1: 18 vertices, 26 edges, quota 8, 64 perfect matchings).
  checkHook();
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
