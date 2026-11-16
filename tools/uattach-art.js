'use strict';
const { bannerSvg } = require('./svg-xml');
// Uniform attachment tree and multicyclic counts (uniform-attachment-tree-and-multicyclic-counts): banner, OG, thumbnail.
// "This image helps the reader understand" the paper's contrast: counts of tree patterns fluctuate like averages, with
// variance of exact order n and explicit constants (at m = 2: two-edge path 12, three-edge path 1688, three-leaf star 888;
// Theorems 1.3-1.4, Section 8.1), while a pattern with two or more cycles is driven by its cyclic core: for the diamond
// (K4 minus an edge) with one pendant leaf at a degree-3 vertex, W_H(n)/log n -> 4 W_D(infinity), a random limit fixed by
// the earliest nodes, with E W_D(infinity) ~ 9.3675 at m = 2, hence about 37.5 log n on average (Theorem 1.5, Example 8.2).
// checkHook recomputes the three variance constants from the paper's polynomials at m = 2 and compares them with the
// released results/verification.json diagonal; recomputes c_{H,2} = (a_D/a_H) m^t / prod h_v = (4/2) 2 / 1 = 4 and
// 4 x 9.3675475 (released results/core_mean.json) against 37.5; it refuses to draw on mismatch.
// Reference: txgraffiti-order48-successor (one exact object balanced with immediately readable values).
// Usage: node tools/uattach-art.js [--render OUTDIR_FOR_INSPECTION] [--no-mirror]
const SLUG = 'uniform-attachment-tree-and-multicyclic-counts';
const ink = '#f6f2ea', muted = '#e2e7ea', dim = '#c3ccd2', hot = '#ffc36b', cool = '#9fd3ff', rose = '#f2a7b5', mint = '#a8e6c1';
const SANS = 'Arial,Helvetica,sans-serif', SERIF = 'Georgia,serif';
const text = (x, y, s, size = 18, color = ink, anchor = 'start', weight = 'normal', family = SANS, style = 'normal') => {
  if (/<|&(?!(lt|gt|amp|minus|#\d+);)/.test(s.replace(/<\/?tspan[^>]*>/g, ''))) throw new Error('unescaped < or & in SVG text: ' + s);
  return `<text class="og-hide" x="${x}" y="${y}" fill="${color}" font-family="${family}" font-size="${size}" font-weight="${weight}" font-style="${style}" text-anchor="${anchor}">${s}</text>`;
};
// Released values (results/verification.json covariance_at_m2 diagonal; results/core_mean.json diamond extrapolation).
const RELEASED = { diag: [12, 1688, 888], diamondMean: 9.3675475 };
const poly = { P3: m => m * m * (m + 1), P4: m => m * m * (54 * m ** 3 + 3 * m * m - 13 * m + 4), S3: m => m ** 3 * (m + 1) * (18 * m + 1) };
function checkHook() {
  const v = [poly.P3(2), poly.P4(2), poly.S3(2)];
  v.forEach((x, i) => { if (x !== RELEASED.diag[i]) throw new Error('variance constant mismatch at ' + i); });
  const aD = 4, aH = 2, m = 2, t = 1, hooks = [1];
  const c = (aD / aH) * m ** t / hooks.reduce((a, b) => a * b, 1);
  if (c !== 4) throw new Error('hook-length constant mismatch');
  const mean = c * RELEASED.diamondMean;
  if (Math.abs(mean - 37.5) > 0.05) throw new Error('mean log-n coefficient mismatch');
  return { v, c, mean };
}
const node = (x, y, col, r = 6) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${col}" stroke="#10161c" stroke-width="1.5"/>`;
const edge = (a, b, col, w = 2.4) => `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="${col}" stroke-width="${w}"/>`;
function graph(pts, edges, col, ncol) { return edges.map(([i, j]) => edge(pts[i], pts[j], col)).join('') + pts.map(p => node(p[0], p[1], ncol || col)).join(''); }
// ---- left: tree patterns ----
function left(v) {
  let s = text(40, 104, 'Tree patterns: variance grows like n', 16, mint, 'start', 'bold');
  s += text(40, 126, 'counts vary by about √n and forget the early network', 13, dim);
  const cols = [70, 230, 390], yG = 190;
  const trees = [
    { name: 'two-edge path', pts: [[0, 0], [36, 0], [72, 0]], e: [[0, 1], [1, 2]] },
    { name: 'three-edge path', pts: [[0, 0], [30, 0], [60, 0], [90, 0]], e: [[0, 1], [1, 2], [2, 3]] },
    { name: 'three-leaf star', pts: [[40, 0], [0, -26], [0, 26], [86, 0]], e: [[0, 1], [0, 2], [0, 3]] }];
  trees.forEach((T, i) => {
    const pts = T.pts.map(([x, y]) => [cols[i] + x, yG + y]);
    s += graph(pts, T.e, mint, ink);
    s += text(cols[i] + 40, yG + 62, T.name, 12, dim, 'middle');
    s += text(cols[i] + 40, yG + 100, String(v.v[i]), 30, ink, 'middle', 'bold', SERIF);
  });
  s += text(40, yG + 132, 'variance ÷ n at m = 2 (exact); every mixture of tree counts', 13, muted);
  s += text(40, yG + 150, 'also varies on the √n scale, so the counts are jointly normal', 13, muted);
  return s;
}
// ---- right: a multicyclic pattern ----
function right(v) {
  const x0 = 590;
  let s = text(x0, 104, 'Two or more cycles: fixed by the first nodes', 16, hot, 'start', 'bold');
  s += text(x0, 126, 'the count follows its cyclic core, which stops changing early', 13, dim);
  const a = [x0 + 40, 200], b = [x0 + 140, 200], c = [x0 + 90, 150], d = [x0 + 90, 250], leaf = [x0 + 200, 168];
  s += `<path d="M${a[0]} ${a[1]}L${c[0]} ${c[1]}L${b[0]} ${b[1]}L${d[0]} ${d[1]}Z" fill="${hot}" opacity="0.14"/>`;
  s += graph([a, b, c, d], [[0, 1], [0, 2], [0, 3], [1, 2], [1, 3]], hot, ink);
  s += `<line x1="${b[0]}" y1="${b[1]}" x2="${leaf[0]}" y2="${leaf[1]}" stroke="${cool}" stroke-width="2.4" stroke-dasharray="5 4"/>` + node(leaf[0], leaf[1], cool);
  s += text(x0 + 90, 286, 'diamond core', 12, hot, 'middle', 'bold');
  s += text(leaf[0] + 12, leaf[1] - 10, 'pendant leaf', 12, cool, 'start', 'bold');
  const tx = x0 + 268;
  s += text(tx, 182, 'count ÷ log n → 4 × (copies of the core)', 15, ink, 'start', 'bold');
  s += text(tx, 206, 'a random limit set by the earliest nodes;', 13, muted);
  s += text(tx, 226, 'the core may never appear at all', 13, muted);
  s += text(tx, 256, 'at m = 2: about 9.37 core copies on average,', 13, dim);
  s += text(tx, 276, 'so about 37.5 log n copies of the pattern', 13, dim);
  return s;
}
const draw = v =>
  text(40, 46, 'Counting patterns in a randomly growing network', 25, ink, 'start', 'normal', SERIF) +
  text(40, 74, 'Each new node links to m earlier nodes chosen at random; two conjectures of Björklund, Holmgren, Janson and Lo, proved', 15, muted) +
  left(v) + right(v) +
  text(40, 372, 'Uniform attachment graph, fixed patterns and fixed m; unrefereed candidate.', 12, dim);
const description = 'Banner for a paper on counts of small patterns in uniform attachment graphs. Title: Counting patterns in a randomly growing network. Subtitle: each new node links to m earlier nodes chosen at random; two conjectures of Björklund, Holmgren, Janson and Lo, proved. Left, in green: tree patterns, variance grows like n; counts vary by about the square root of n and forget the early network. Three small trees with their exact variance constants divided by n at m = 2: two-edge path 12, three-edge path 1688, three-leaf star 888. Every mixture of tree counts also varies on the square-root-of-n scale, so the counts are jointly normal. Right, in amber: two or more cycles, fixed by the first nodes; the count follows its cyclic core, which stops changing early. A diamond (four nodes, five edges, shaded) with one pendant leaf attached by a dashed edge. Count divided by log n tends to 4 times the number of copies of the core: a random limit set by the earliest nodes, and the core may never appear at all. At m = 2 there are about 9.37 core copies on average, so about 37.5 log n copies of the pattern. Footer: uniform attachment graph, fixed patterns and fixed m; unrefereed candidate.';
function frame(inner, background) {
  return bannerSvg({ inner, description, background, glow: { color: '#ffc36b', cx: '0.6', cy: '0.55', r: '0.4', opacity: '0.06' } });
}
const thumbSpec = {
  kicker: ['RESEARCH RELEASE · NOVEMBER 2026', 'PROBABILITY'],
  head: ['Counting patterns in growing networks:', '<em>trees average out, cycles remember</em>'], headSize: 42,
  sub: 'Two conjectures of Björklund, Holmgren, Janson and Lo on uniform attachment graphs, proved.',
  tag: 'UNREFEREED CANDIDATE',
  hero: '<div class="eq-label">tree counts at m = 2, variance ÷ n</div><div class="hero-title">12 · 1688 · 888</div><div class="note">two or more cycles:<br>fixed by the first nodes</div><div class="eq-foot">uniform attachment graph</div>'
};
module.exports = { draw, description, thumbSpec, checkHook };
if (require.main === module) (async () => {
  const fs = require('fs'), pth = require('path'), os = require('os'), vm = require('vm');
  const ROOT = pth.join(__dirname, '..');
  const v = checkHook();
  console.log('check: variance constants 12, 1688, 888, hook-length constant 4 and 37.5 log n match the released outputs');
  const { resolve: bannerResolve } = require('./banner-palettes');
  const bp = bannerResolve(SLUG); if (!bp) throw new Error('no banner palette');
  const tp = require('./thumbnail-palettes');
  const tname = tp.resolve(SLUG, true);
  const svg = frame(draw(v), bp);
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
