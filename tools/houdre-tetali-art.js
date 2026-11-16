'use strict';
const { bannerSvg } = require('./svg-xml');
// The degree dependence of Houdré–Tetali isoperimetry (houdre-tetali-degree-law): banner, OG, thumbnail.
// "This image helps the reader understand" that the square-root Cheeger inequality fails on plain graphs only by a logarithm
// of the degree: the comparison function Psi_p(Delta) = int_1^Delta t^(-2p) dt against the boundary exponent p for three
// degrees (the paper's figure 1, panel A, eq. 1.1; at p = 1/2 it equals log Delta), the ring of cliques with about M/r^3
// wires at distance r (Section 5), and the proved bounds with the computed size of the effect (Theorems 1.2, 1.3; Section 7).
// checkHook recomputes Psi_p from its closed form against numerical integration, checks Psi_{1/2} = log Delta, Psi_0 = Delta - 1,
// Psi_1 = 1 - 1/Delta, the vertex counts n^4 + n, and compares the drawn witness ratios with the released
// logs/constants_checks.json critical_table values (copied below); it refuses to draw on mismatch.
// Reference: txgraffiti-order48-successor (one exact object balanced with immediately readable values).
// Usage: node tools/houdre-tetali-art.js [--render OUTDIR_FOR_INSPECTION] [--no-mirror]
const SLUG = 'houdre-tetali-degree-law';
const ink = '#f6f2ea', muted = '#e2e7ea', dim = '#c3ccd2', hot = '#ffc36b', cool = '#9fd3ff', rose = '#f2a7b5', mint = '#a8e6c1';
const SANS = 'Arial,Helvetica,sans-serif', SERIF = 'Georgia,serif';
const text = (x, y, s, size = 18, color = ink, anchor = 'start', weight = 'normal', family = SANS, style = 'normal') => {
  if (/<|&(?!(lt|gt|amp|minus|#\d+);)/.test(s.replace(/<\/?tspan[^>]*>/g, ''))) throw new Error('unescaped < or & in SVG text: ' + s);
  return `<text class="og-hide" x="${x}" y="${y}" fill="${color}" font-family="${family}" font-size="${size}" font-weight="${weight}" font-style="${style}" text-anchor="${anchor}">${s}</text>`;
};
// Psi_p(x) = int_1^x t^(-2p) dt (paper, eq. 1.1)
const Psi = (p, x) => Math.abs(1 - 2 * p) < 1e-12 ? Math.log(x) : (Math.pow(x, 1 - 2 * p) - 1) / (1 - 2 * p);
function checkHook() {
  // released logs/constants_checks.json critical_table (n, vertices, witness_ratio_upper)
  const rel = [[4, 260, 0.5], [64, 16777280, 0.999597746949086], [1024, 1099511628800, 1.5535287538673954]];
  for (const [n, v] of rel) if (BigInt(n) ** 4n + BigInt(n) !== BigInt(v)) throw new Error('vertex count mismatch at n = ' + n);
  if (rel[0][2].toFixed(2) !== '0.50' || rel[1][2].toFixed(2) !== '1.00' || rel[2][2].toFixed(2) !== '1.55') throw new Error('witness ratio rounding mismatch');
  for (const D of [16, 1024, 1048576]) {
    if (Math.abs(Psi(0.5, D) - Math.log(D)) > 1e-12 || Math.abs(Psi(0, D) - (D - 1)) > 1e-6 || Math.abs(Psi(1, D) - (1 - 1 / D)) > 1e-12) throw new Error('Psi special values mismatch');
    for (const p of [0.1, 0.3, 0.7, 0.9]) { // midpoint rule in log t
      let s = 0; const N = 20000, L = Math.log(D);
      for (let k = 0; k < N; k++) { const u = (k + 0.5) / N * L; s += Math.exp(u * (1 - 2 * p)); }
      if (Math.abs(s * L / N - Psi(p, D)) / Psi(p, D) > 1e-6) throw new Error('Psi closed form mismatch at p = ' + p);
    }
  }
  return rel;
}
// ---- left: panel A ----
function left() {
  const x0 = 70, x1 = 400, yTop = 118, yBot = 352, lmax = 6.2, lmin = -0.2;
  const X = p => x0 + (x1 - x0) * p, Y = v => yTop + (yBot - yTop) * (lmax - Math.log10(v)) / (lmax - lmin);
  let s = text(40, 104, 'How much the gap can lose, Ψₚ(Δ)', 15, muted, 'start', 'bold');
  s += `<line x1="${X(0.5)}" y1="${yTop}" x2="${X(0.5)}" y2="${yBot}" stroke="rgba(255,255,255,0.45)" stroke-width="1" stroke-dasharray="4 4"/>`;
  [[16, rose, 'Δ = 2⁴'], [1024, hot, 'Δ = 2¹⁰'], [1048576, cool, 'Δ = 2²⁰']].forEach(([D, c, lab], i) => {
    let d = ''; for (let k = 0; k <= 200; k++) { const p = k / 200; d += (k ? 'L' : 'M') + X(p).toFixed(1) + ' ' + Y(Psi(p, D)).toFixed(1); }
    s += `<path d="${d}" fill="none" stroke="${c}" stroke-width="2.8"/>`;
    s += `<circle cx="${X(0.5).toFixed(1)}" cy="${Y(Math.log(D)).toFixed(1)}" r="4" fill="${c}"/>`;
    s += text(x1 - 4, yTop + 10 + i * 18, lab, 12, c, 'end', 'bold');
  });
  s += text(X(0.5) + 8, Y(Math.log(16)) + 30, 'at p = ½: log Δ', 13, ink, 'start', 'bold');
  s += text(x0, yBot + 20, '0', 11, dim, 'middle'); s += text(X(0.5), yBot + 20, '½', 11, dim, 'middle'); s += text(x1, yBot + 20, '1', 11, dim, 'middle');
  s += text((x0 + x1) / 2, yBot + 38, 'boundary exponent p (vertex expansion → conductance)', 11, dim, 'middle');
  s += text(x0 - 8, Y(1) + 4, '1', 11, dim, 'end'); s += text(x0 - 8, Y(1e6) + 4, '10⁶', 11, dim, 'end');
  return s;
}
// ---- centre: the ring of cliques ----
function centre() {
  const cx = 600, cy = 250, R = 92, n = 12; let s = '';
  s += text(cx, 104, 'A ring of tight neighbourhoods', 15, muted, 'middle', 'bold');
  const pt = (i, r = R) => [cx + r * Math.cos(2 * Math.PI * i / n - Math.PI / 2), cy + r * Math.sin(2 * Math.PI * i / n - Math.PI / 2)];
  for (let i = 0; i < n; i++) for (let r = 1; r <= 3; r++) {
    const j = (i + r) % n, [a, b] = pt(i), [c, d] = pt(j), w = 6 / (r * r * r);
    s += `<line x1="${a.toFixed(1)}" y1="${b.toFixed(1)}" x2="${c.toFixed(1)}" y2="${d.toFixed(1)}" stroke="${cool}" stroke-width="${Math.max(w, 0.6).toFixed(2)}" opacity="${(0.95 - 0.2 * r).toFixed(2)}"/>`;
  }
  for (let i = 0; i < n; i++) {
    const [a, b] = pt(i);
    s += `<circle cx="${a.toFixed(1)}" cy="${b.toFixed(1)}" r="11" fill="#1d2b33" stroke="${hot}" stroke-width="1.6"/>`;
    for (let k = 0; k < 4; k++) s += `<circle cx="${(a + 5 * Math.cos(k * Math.PI / 2 + 0.6)).toFixed(1)}" cy="${(b + 5 * Math.sin(k * Math.PI / 2 + 0.6)).toFixed(1)}" r="1.7" fill="${hot}"/>`;
  }
  s += text(cx, cy - 4, 'about M/r³', 14, ink, 'middle', 'bold', SERIF);
  s += text(cx, cy + 14, 'wires at distance r', 12, dim, 'middle');
  s += text(cx, 374, 'cliques joined by plain edges: a circulant graph', 12, dim, 'middle');
  return s;
}
function right(rel) {
  const x0 = 800; let s = '';
  s += `<line x1="${x0 - 22}" y1="96" x2="${x0 - 22}" y2="378" stroke="rgba(255,255,255,0.16)" stroke-width="1"/>`;
  s += text(x0, 120, 'Square-root boundary, p = ½', 15, muted, 'start', 'bold');
  s += text(x0, 152, 'plain graphs break the conjecture by', 13, ink);
  s += text(x0, 176, 'a factor of order log(degree)', 18, hot, 'start', 'bold', SERIF);
  s += text(x0, 210, 'and that is the worst case: for every walk,', 13, ink);
  s += text(x0, 234, 'loss ≤ 4 + log(1/κ)', 18, cool, 'start', 'bold', SERIF);
  s += text(x0, 268, 'Every exponent: 10⁻⁸ Ψₚ(Δ) ≤ worst ≤ 12 Ψₚ(Δ)', 12, ink);
  s += text(x0, 298, 'A mild effect (upper estimate of the ratio):', 12, dim);
  rel.forEach(([n, v, w], i) => {
    const lab = ['260 vertices', '≈ 1.7 × 10⁷ vertices', '≈ 1.1 × 10¹² vertices'][i];
    s += text(x0, 320 + i * 18, lab, 12, dim); s += text(x0 + 330, 320 + i * 18, w.toFixed(2), 13, mint, 'end', 'bold');
  });
  return s;
}
const draw = rel =>
  text(40, 46, 'The degree dependence of Houdré–Tetali isoperimetry', 25, ink, 'start', 'normal', SERIF) +
  text(40, 74, 'Simple graphs break the square-root Cheeger conjecture by a logarithm of the degree, and that is the worst case', 15, muted) +
  left() + centre() + right(rel);
const description = 'Banner for a paper on the degree dependence of Houdré–Tetali isoperimetry. Title: The degree dependence of Houdré–Tetali isoperimetry. Subtitle: Simple graphs break the square-root Cheeger conjecture by a logarithm of the degree, and that is the worst case. Left: how much the spectral gap can lose, the comparison function Psi_p(Delta), the integral of t to the power minus 2p from 1 to Delta, plotted on a logarithmic scale against the boundary exponent p from 0 (vertex expansion) to 1 (conductance) for Delta = 2 to the 4, 2 to the 10 and 2 to the 20; a dashed line at p = one half marks where it equals log Delta. Centre: a ring of twelve tight neighbourhoods (cliques) joined by plain edges, with about M over r cubed wires at distance r, drawn as thicker lines between nearby neighbourhoods; a circulant graph. Right: for the square-root boundary, p = one half, plain graphs break the conjecture by a factor of order log(degree), and that is the worst case: for every walk the loss is at most 4 + log(1/kappa). For every exponent, 10 to the minus 8 times Psi_p(Delta) is at most the worst ratio, which is at most 12 times Psi_p(Delta). A mild effect: an upper estimate of the ratio is 0.50 at 260 vertices, 1.00 at about 1.7 times 10 to the 7 vertices and 1.55 at about 1.1 times 10 to the 12 vertices.';
function frame(inner, background) {
  return bannerSvg({ inner, description, background, glow: { color: '#9fd3ff', cx: '0.5', cy: '0.55', r: '0.4', opacity: '0.06' } });
}
const thumbSpec = {
  kicker: ['RESEARCH RELEASE · NOVEMBER 2026', 'SPECTRAL GRAPH THEORY'],
  head: ['Square-root Cheeger fails', 'on plain graphs, <em>but only by log(degree)</em>'], headSize: 44,
  sub: 'Explicit ring-of-cliques graphs break the Houdré–Tetali conjecture, and no network can do worse, up to fixed constants.',
  tag: 'UNREFEREED CANDIDATE',
  hero: '<div class="eq-label">for every reversible walk</div><div class="hero-title">loss ≤ 4 + log(1/κ)</div><div class="note">attained up to constants<br>by simple circulant graphs</div><div class="eq-foot">explicit, not sharp, constants</div>'
};
module.exports = { draw, description, thumbSpec, checkHook };
if (require.main === module) (async () => {
  const fs = require('fs'), pth = require('path'), os = require('os'), vm = require('vm');
  const ROOT = pth.join(__dirname, '..');
  const rel = checkHook();
  console.log('check: Psi_p closed form, special values, vertex counts and witness ratios match the released outputs');
  const { resolve: bannerResolve } = require('./banner-palettes');
  const bp = bannerResolve(SLUG); if (!bp) throw new Error('no banner palette');
  const tp = require('./thumbnail-palettes');
  const tname = tp.resolve(SLUG, true);
  const svg = frame(draw(rel), bp);
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
