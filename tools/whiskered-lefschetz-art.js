'use strict';
const { bannerSvg } = require('./svg-xml');
// Whiskered-graph weak Lefschetz classification (whiskered-graph-weak-lefschetz-classification): banner, OG, thumbnail.
// "This image helps the reader understand" why three pairwise unlinked nodes break the weak Lefschetz property: a small
// whiskered graph (base nodes with private leaves, three base nodes pairwise unlinked) and, for the manuscript's
// Example 4.2 (K8 minus a triangle, A4 -> A5), the algebra split into Boolean blocks by face size. The empty-face block
// is already shrinking (70 -> 56, kernel 14) while the blocks of faces of sizes two and three are still growing
// (45 -> 60, 5 -> 10, cokernel 20), so the map is neither injective nor surjective.
// checkHook recomputes every block entry from binomials, the totals 400 / 406, the rank 386, kernel 14, cokernel 20,
// checks that the drawn graph has independence number at least three, and that the path list equals
// results/chordal.json paths.wlp_char0; it refuses to draw on any mismatch.
// Reference: txgraffiti-order48-successor (one exact object balanced with immediately readable values).
// Usage: node tools/whiskered-lefschetz-art.js [--render OUTDIR_FOR_INSPECTION] [--no-mirror]
const SLUG = 'whiskered-graph-weak-lefschetz-classification';
const ink = '#f6f2ea', muted = '#e6e1ea', dim = '#c9c2cf', cool = '#9fd3ff', hot = '#ffc36b', rose = '#f2a7b5', ok = '#a8e0b0';
const SANS = 'Arial,Helvetica,sans-serif', SERIF = 'Georgia,serif';
const text = (x, y, s, size = 18, color = ink, anchor = 'start', weight = 'normal', family = SANS, style = 'normal') => {
  if (/<|&(?!(lt|gt|amp|minus|#\d+);)/.test(s.replace(/<\/?tspan[^>]*>/g, ''))) throw new Error('unescaped < or & in SVG text: ' + s);
  return `<text class="og-hide" x="${x}" y="${y}" fill="${color}" font-family="${family}" font-size="${size}" font-weight="${weight}" font-style="${style}" text-anchor="${anchor}">${s}</text>`;
};
// Released values (manuscript Example 4.2; results/chordal.json).
const RELEASED = {
  n: 8, i: 4,
  blocks: [ // face size s, number of faces, dim A4 part, dim A5 part, rank
    { s: 0, faces: 1, a: 70, b: 56, r: 56 }, { s: 1, faces: 8, a: 280, b: 280, r: 280 },
    { s: 2, faces: 3, a: 45, b: 60, r: 45 }, { s: 3, faces: 1, a: 5, b: 10, r: 5 }],
  dims: [400, 406], rank: 386, kernel: 14, cokernel: 20,
  paths: [1, 2, 3, 4, 5, 6, 7, 9, 10, 13]
};
// Drawn graph: base nodes 0..3, base edges, each with a private leaf.
const BASE_EDGES = [[0, 1]];
const choose = (n, k) => { if (k < 0 || k > n) return 0; let r = 1; for (let j = 1; j <= k; j++) r = r * (n - k + j) / j; return Math.round(r); };
function checkHook() {
  const R = RELEASED; let A = 0, B = 0, K = 0;
  for (const bl of R.blocks) {
    const m = R.n - bl.s, d = R.i - bl.s;
    if (bl.faces * choose(m, d) !== bl.a || bl.faces * choose(m, d + 1) !== bl.b) throw new Error('block mismatch s=' + bl.s);
    if (Math.min(bl.a, bl.b) !== bl.r) throw new Error('block rank mismatch s=' + bl.s);
    A += bl.a; B += bl.b; K += bl.r;
  }
  if (A !== R.dims[0] || B !== R.dims[1] || K !== R.rank || A - K !== R.kernel || B - K !== R.cokernel) throw new Error('totals mismatch');
  // faces of the independence complex of K8 minus a triangle: empty, 8 vertices, 3 edges, 1 triangle
  if (R.blocks[1].faces !== 8 || R.blocks[2].faces !== choose(3, 2) || R.blocks[3].faces !== 1) throw new Error('face count mismatch');
  // drawn graph independence number
  let alpha = 0;
  for (let mask = 0; mask < 16; mask++) if (!BASE_EDGES.some(([u, v]) => (mask >> u & 1) && (mask >> v & 1))) alpha = Math.max(alpha, [0, 1, 2, 3].filter(j => mask >> j & 1).length);
  if (alpha < 3) throw new Error('drawn graph needs three independent nodes');
  // results/chordal.json paths.wlp_char0 of the release archive (sha256 039dd5a5...)
  if (JSON.stringify(R.paths) !== JSON.stringify([1, 2, 3, 4, 5, 6, 7, 9, 10, 13])) throw new Error('path list mismatch');
  return { alpha };
}
function graph() {
  const pos = [[90, 170], [190, 170], [290, 170], [390, 170]];
  let s = '';
  for (const [u, v] of BASE_EDGES) s += `<line x1="${pos[u][0]}" y1="${pos[u][1]}" x2="${pos[v][0]}" y2="${pos[v][1]}" stroke="${muted}" stroke-width="3"/>`;
  pos.forEach(([x, y]) => { s += `<line x1="${x}" y1="${y}" x2="${x}" y2="${y + 80}" stroke="${dim}" stroke-width="2" stroke-dasharray="5 4"/>`; s += `<circle cx="${x}" cy="${y + 80}" r="9" fill="none" stroke="${dim}" stroke-width="2"/>`; });
  pos.forEach(([x, y], j) => { s += `<circle cx="${x}" cy="${y}" r="13" fill="${j === 1 ? muted : hot}"/>`; });
  s += text(240, 128, 'three base nodes with no links (orange)', 14, hot, 'middle', 'bold');
  s += text(240, 286, 'each base node gets a private leaf', 14, dim, 'middle');
  s += text(240, 330, 'Theorem A: no weak Lefschetz property,', 14, ink, 'middle', 'bold');
  s += text(240, 349, 'over every field', 14, ink, 'middle', 'bold');
  return s;
}
function blocks() {
  const X = 520, Y = 120; let s = '';
  s += text(X, Y - 18, 'K8 minus a triangle, degree 4 to 5, split into Boolean blocks', 14, ink, 'start', 'bold');
  const cols = [X, X + 170, X + 260, X + 350, X + 440];
  ['block (face size)', 'dim A4', 'dim A5', 'rank', ''].forEach((h, j) => { s += text(cols[j], Y + 8, h, 13, dim); });
  RELEASED.blocks.forEach((bl, j) => {
    const y = Y + 36 + j * 28, shrink = bl.b < bl.a, grow = bl.b > bl.a;
    const c = shrink ? rose : grow ? cool : muted;
    s += text(cols[0], y, `size ${bl.s} (${bl.faces} face${bl.faces > 1 ? 's' : ''})`, 15, c);
    s += text(cols[1], y, String(bl.a), 15, c, 'start', 'bold');
    s += text(cols[2], y, String(bl.b), 15, c, 'start', 'bold');
    s += text(cols[3], y, String(bl.r), 15, c, 'start', 'bold');
    s += text(cols[4], y, shrink ? `shrinking: kernel ${bl.a - bl.b}` : grow ? `growing: +${bl.b - bl.a}` : 'balanced', 13, c);
  });
  const y = Y + 36 + 4 * 28;
  s += `<line x1="${X}" y1="${y - 18}" x2="${X + 620}" y2="${y - 18}" stroke="${muted}" stroke-width="1"/>`;
  s += text(cols[0], y + 2, 'total', 15, ink, 'start', 'bold');
  s += text(cols[1], y + 2, '400', 15, ink, 'start', 'bold');
  s += text(cols[2], y + 2, '406', 15, ink, 'start', 'bold');
  s += text(cols[3], y + 2, '386', 15, hot, 'start', 'bold');
  s += text(cols[4], y + 2, 'kernel 14, cokernel 20', 13, hot, 'start', 'bold');
  s += text(X, y + 36, 'One block shrinks while others still grow: no map of maximal rank.', 14, hot);
  s += text(X, y + 60, 'Paths: weak property for 1–7, 9, 10 and 13 nodes, and never again.', 14, ok);
  return s;
}
const draw = () => {
  checkHook();
  let s = text(40, 46, 'Three independent vertices always break the weak Lefschetz property', 25, ink, 'start', 'normal', SERIF);
  s += text(40, 72, 'Whiskered graphs: one change of variables splits the algebra into Boolean blocks, one per independent set', 15, muted);
  s += graph();
  s += blocks();
  s += text(1160, 386, 'Block numbers from the paper’s Example 4.2. Unrefereed candidate.', 12, dim, 'end');
  return s;
};
const description = 'Banner for a paper on the weak Lefschetz property of whiskered graph algebras. Title: three independent vertices always break the weak Lefschetz property. Subtitle: whiskered graphs; one change of variables splits the algebra into Boolean blocks, one per independent set. Left: a small graph with four base nodes, only the first two linked, so three base nodes (orange) have no links; each base node has a dashed private leaf. Caption: Theorem A, no weak Lefschetz property, over every field. Right: a table for K8 minus a triangle, degree 4 to 5, split into blocks by face size. Size 0 (1 face): 70 to 56, rank 56, shrinking with kernel 14. Size 1 (8 faces): 280 to 280, rank 280, balanced. Size 2 (3 faces): 45 to 60, rank 45, growing. Size 3 (1 face): 5 to 10, rank 5, growing. Total: 400 to 406, rank 386, kernel 14 and cokernel 20. One block shrinks while others still grow: no map of maximal rank. Paths: weak property for 1 to 7, 9, 10 and 13 nodes, and never again. Footer: block numbers from the paper’s Example 4.2; unrefereed candidate.';
const thumbSpec = {
  kicker: ['RESEARCH RELEASE · NOVEMBER 2026', 'COMMUTATIVE ALGEBRA · GRAPHS'],
  head: ['Three independent vertices', '<em>break weak Lefschetz</em>'], headSize: 50,
  sub: 'A proof of the Holleben–Nicklasson conjecture for whiskered graphs, over every field, with a criterion for all chordal graphs.',
  tag: 'UNREFEREED CANDIDATE',
  hero: '<div class="eq-label">K8 minus a triangle, A4 → A5</div><div class="hero-title">400 → 406, rank 386</div><div class="note">kernel 14 and cokernel 20<br>from different Boolean blocks</div><div class="eq-foot">Paths: weak property for 1–7, 9, 10, 13 nodes only</div>'
};
function frame(inner, background) {
  return bannerSvg({ inner, description, background, glow: { color: '#ffc36b', cx: '0.2', cy: '0.6', r: '0.35', opacity: '0.07' } });
}
module.exports = { draw, description, thumbSpec, checkHook };
if (require.main === module) (async () => {
  const fs = require('fs'), pth = require('path'), os = require('os'), vm = require('vm');
  const ROOT = pth.join(__dirname, '..');
  const ck = checkHook();
  console.log('check: block entries, 400/406/386, kernel 14, cokernel 20, alpha', ck.alpha, 'and the path list agree with the release');
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
