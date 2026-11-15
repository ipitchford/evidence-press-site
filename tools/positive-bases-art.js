'use strict';
const { bannerSvg } = require('./svg-xml');
// Direct-sum positive bases (direct-sum-positive-bases): banner, OG, thumbnail.
// "This image helps the reader understand" Corollaries 3.2 and 7.2(c) in one concrete case: six unit directions in
// four dimensions. Two perpendicular regular triangles give cosine measure 1/sqrt(8), the optimum among direct sums;
// a regular tetrahedron with a perpendicular pair gives 1/sqrt(10), worse, yet it is also a strict local optimum.
// The general bound cm <= (r_1^2 + ... + r_k^2)^(-1/2) of Theorem 3.1 is stated beside it.
// checkHook recomputes both values independently of the paper's vertex formula: it builds the six unit vectors,
// solves every 4-subset of the constraints <x, d> = 1, keeps the feasible vertices of the polar polytope and takes
// the largest squared norm, which must be 8 (9 vertices) and 10 (8 vertices). It refuses to draw on mismatch.
// Reference: txgraffiti-order48-successor (exact object beside the comparison that matters).
// Usage: node tools/positive-bases-art.js [--render OUTDIR_FOR_INSPECTION] [--no-mirror]
const SLUG = 'direct-sum-positive-bases';
const ink = '#f6f2ea', muted = '#e2e7ea', dim = '#bcc8cf', hot = '#ffb36b', cool = '#8ecbff';
const SANS = 'Arial,Helvetica,sans-serif', SERIF = 'Georgia,serif';
const text = (x, y, s, size = 18, color = ink, anchor = 'start', weight = 'normal', family = SANS, style = 'normal') => {
  if (/[<&]/.test(s.replace(/<\/?tspan[^>]*>/g, ''))) throw new Error('unescaped < or & in SVG text: ' + s);
  return `<text class="og-hide" x="${x}" y="${y}" fill="${color}" font-family="${family}" font-size="${size}" font-weight="${weight}" font-style="${style}" text-anchor="${anchor}">${s}</text>`;
};

// ---- exact check (independent polar-vertex enumeration) ----
const S3 = Math.sqrt(3);
const TRI = [[1, 0], [-0.5, S3 / 2], [-0.5, -S3 / 2]];
const TET = [[1, 1, 1], [1, -1, -1], [-1, 1, -1], [-1, -1, 1]].map(v => v.map(x => x / S3));
const embed = (v, off) => { const w = [0, 0, 0, 0]; v.forEach((x, i) => { w[off + i] = x; }); return w; };
const CONFIGS = {
  triangles: [...TRI.map(v => embed(v, 0)), ...TRI.map(v => embed(v, 2))],
  tetraPair: [...TET.map(v => embed(v, 0)), embed([1], 3), embed([-1], 3)]
};
function solve(A, b) { // Gaussian elimination with partial pivoting; null if singular
  const n = A.length, M = A.map((r, i) => [...r, b[i]]);
  for (let c = 0; c < n; c++) {
    let p = c; for (let r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r;
    if (Math.abs(M[p][c]) < 1e-12) return null; [M[c], M[p]] = [M[p], M[c]];
    for (let r = 0; r < n; r++) if (r !== c) { const f = M[r][c] / M[c][c]; for (let k = c; k <= n; k++) M[r][k] -= f * M[c][k]; }
  }
  return M.map((r, i) => r[n] / r[i]);
}
function polarVertices(D) {
  const out = [], idx = [...D.keys()], sub = [];
  const rec = s => {
    if (sub.length === 4) {
      const x = solve(sub.map(i => D[i]), [1, 1, 1, 1]); if (!x) return;
      if (D.every(d => d.reduce((t, di, k) => t + di * x[k], 0) <= 1 + 1e-9) && !out.some(y => y.every((v, k) => Math.abs(v - x[k]) < 1e-9))) out.push(x);
      return;
    }
    for (let i = s; i < idx.length; i++) { sub.push(i); rec(i + 1); sub.pop(); }
  };
  rec(0); return out;
}
function checkHook() {
  const res = {};
  for (const [name, D] of Object.entries(CONFIGS)) {
    if (D.length !== 6 || D.some(d => Math.abs(Math.hypot(...d) - 1) > 1e-12)) throw new Error('not six unit vectors: ' + name);
    const V = polarVertices(D); const R2 = Math.max(...V.map(x => x.reduce((t, v) => t + v * v, 0)));
    res[name] = { vertices: V.length, R2 };
  }
  if (res.triangles.vertices !== 9 || Math.abs(res.triangles.R2 - 8) > 1e-9) throw new Error('two triangles: ' + JSON.stringify(res.triangles));
  if (res.tetraPair.vertices !== 8 || Math.abs(res.tetraPair.R2 - 10) > 1e-9) throw new Error('tetrahedron + pair: ' + JSON.stringify(res.tetraPair));
  if (Math.abs(1 / Math.sqrt(8) - 0.3536) > 5e-5 || Math.abs(1 / Math.sqrt(10) - 0.3162) > 5e-5) throw new Error('decimals');
  return res;
}

// ---- drawing ----
const arrow = (cx, cy, dx, dy, color, w = 3) => {
  const x = cx + dx, y = cy + dy, L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L, h = 9;
  return `<line x1="${cx}" y1="${cy}" x2="${(x - ux * h * 0.6).toFixed(1)}" y2="${(y - uy * h * 0.6).toFixed(1)}" stroke="${color}" stroke-width="${w}" stroke-linecap="round"/>` +
    `<polygon points="${x.toFixed(1)},${y.toFixed(1)} ${(x - ux * h - uy * h * 0.55).toFixed(1)},${(y - uy * h + ux * h * 0.55).toFixed(1)} ${(x - ux * h + uy * h * 0.55).toFixed(1)},${(y - uy * h - ux * h * 0.55).toFixed(1)}" fill="${color}"/>`;
};
const disc = (cx, cy, r) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.28)" stroke-width="1.2" stroke-dasharray="3 4"/>`;
function triangle(cx, cy, r, color, rot = -90) {
  let s = disc(cx, cy, r + 6);
  for (let i = 0; i < 3; i++) { const a = (rot + 120 * i) * Math.PI / 180; s += arrow(cx, cy, r * Math.cos(a), r * Math.sin(a), color); }
  return s;
}
function tetra(cx, cy, r, color) { // tilted orthographic projection of the regular tetrahedron
  const A = 20 * Math.PI / 180, B = 28 * Math.PI / 180;
  const u = [Math.cos(A), Math.sin(A) * Math.cos(B), Math.sin(A) * Math.sin(B)], v = [-Math.sin(A), Math.cos(A) * Math.cos(B), Math.cos(A) * Math.sin(B)];
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const P = TET.map(t => [cx + 1.15 * r * dot(t, u), cy - 1.15 * r * dot(t, v)]);
  let s = disc(cx, cy, r + 8);
  for (let i = 0; i < 4; i++) for (let j = i + 1; j < 4; j++) s += `<line x1="${P[i][0].toFixed(1)}" y1="${P[i][1].toFixed(1)}" x2="${P[j][0].toFixed(1)}" y2="${P[j][1].toFixed(1)}" stroke="rgba(255,255,255,0.18)" stroke-width="1"/>`;
  for (const [x, y] of P) s += arrow(cx, cy, x - cx, y - cy, color);
  return s;
}
const pair = (cx, cy, r, color) => disc(cx, cy, r + 6) + arrow(cx, cy, 0, -r, color) + arrow(cx, cy, 0, r, color);
const perp = (x, y) => text(x, y, '⊥', 30, muted, 'middle', 'bold');
function left() {
  let s = text(40, 112, 'Six unit directions in four dimensions', 15, muted, 'start', 'bold');
  // row 1: two perpendicular triangles
  s += triangle(105, 190, 46, hot) + perp(178, 200) + triangle(250, 190, 46, hot);
  s += text(105, 258, 'triangle in x₁x₂', 12, dim, 'middle') + text(250, 258, 'triangle in x₃x₄', 12, dim, 'middle');
  s += text(320, 178, 'cos measure 1/√8 ≈ 0.354', 19, hot, 'start', 'bold');
  s += text(320, 202, 'best of all direct sums of this size', 14, ink);
  // row 2: tetrahedron and a perpendicular pair
  s += tetra(105, 318, 44, cool) + perp(178, 328) + pair(250, 318, 40, cool);
  s += text(105, 386, 'tetrahedron in x₁x₂x₃', 12, dim, 'middle') + text(250, 386, 'pair on x₄', 12, dim, 'middle');
  s += text(320, 306, 'cos measure 1/√10 ≈ 0.316', 19, cool, 'start', 'bold');
  s += text(320, 330, 'worse, yet also a local optimum:', 14, ink);
  s += text(320, 350, 'no small change improves it', 14, ink);
  return s;
}
function right() {
  const x0 = 700; let s = '';
  s += `<line x1="${x0 - 30}" y1="108" x2="${x0 - 30}" y2="372" stroke="rgba(255,255,255,0.16)" stroke-width="1"/>`;
  s += text(x0, 112, 'The general theorem', 15, muted, 'start', 'bold');
  s += text(x0, 156, 'cos measure ≤ 1 / √(r₁² + r₂² + … + rₖ²)', 22, ink, 'start', 'normal', SERIF);
  s += text(x0, 182, 'for simplices in complementary subspaces of dimensions r₁, …, rₖ,', 14, dim);
  s += text(x0, 202, 'equality only when they are regular and perpendicular', 14, dim);
  s += text(x0, 246, 'And no nearby configuration does better,', 17, ink, 'start', 'bold');
  s += text(x0, 270, 'inside the class or outside it, in every dimension:', 14, dim);
  s += text(x0, 290, 'the conjectured best sphere coverings by few caps', 14, dim);
  s += text(x0, 310, 'are at least locally best', 14, dim);
  s += text(x0, 352, 'the global question stays open for sizes n + 3 to 2n − 2', 13, dim, 'start', 'normal', SERIF, 'italic');
  return s;
}
const draw = () =>
  text(40, 50, 'Perpendicular simplices win: the best direction sets for derivative-free search', 25, ink, 'start', 'normal', SERIF) +
  text(40, 80, 'Cosine measure = cosine of the worst angle between any direction and its nearest trial direction (bigger is better)', 15, muted) +
  left() + right();
const description = 'Banner for a paper on direct-sum positive bases. Title: Perpendicular simplices win: the best direction sets for derivative-free search. Subtitle: cosine measure is the cosine of the worst angle between any direction and its nearest trial direction; bigger is better. Left, six unit directions in four dimensions: top, two regular triangles of arrows in perpendicular planes x1x2 and x3x4, labelled cos measure 1/√8 ≈ 0.354, best of all direct sums of this size; bottom, a regular tetrahedron of arrows in x1x2x3 perpendicular to a pair of opposite arrows on x4, labelled cos measure 1/√10 ≈ 0.316, worse, yet also a local optimum: no small change improves it. Right, the general theorem: cos measure ≤ 1/√(r1² + … + rk²) for simplices in complementary subspaces of dimensions r1, …, rk, with equality only when they are regular and perpendicular; and no nearby configuration does better, inside the class or outside it, in every dimension, so the conjectured best sphere coverings by few caps are at least locally best. Note: the global question stays open for sizes n + 3 to 2n − 2.';
function frame(inner, background) {
  return bannerSvg({ inner, description, background, glow: { color: '#ffb36b', cx: '0.2', cy: '0.55', r: '0.4', opacity: '0.06' } });
}
const thumbSpec = {
  kicker: ['RESEARCH RELEASE · NOVEMBER 2026', 'OPTIMISATION · GEOMETRY'],
  head: ['Searching without derivatives?', 'Point your directions as <em>perpendicular simplices</em>.'], headSize: 50,
  sub: 'Proved optimal among direct sums in every dimension, and no small change of them does better, even outside that class.',
  tag: 'UNREFEREED CANDIDATE',
  hero: '<div class="eq-label">best cosine measure</div><div class="hero-title">1/√(Σ rⱼ²)</div><div class="note">four dimensions, six directions:<br>two perpendicular triangles, 1/√8<br>tetrahedron + pair, 1/√10</div><div class="eq-foot">written proofs</div>'
};
module.exports = { draw, description, thumbSpec, checkHook };
if (require.main === module) (async () => {
  const fs = require('fs'), pth = require('path'), os = require('os'), vm = require('vm');
  const ROOT = pth.join(__dirname, '..');
  const chk = checkHook();
  console.log(`check: two triangles ${chk.triangles.vertices} polar vertices, R^2 ${chk.triangles.R2.toFixed(12)}; tetrahedron + pair ${chk.tetraPair.vertices} vertices, R^2 ${chk.tetraPair.R2.toFixed(12)}`);
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
