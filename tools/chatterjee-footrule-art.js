'use strict';
const { bannerSvg } = require('./svg-xml');
// The lower boundary of the Chatterjee-footrule region (chatterjee-footrule-lower-boundary): banner, OG, thumbnail.
// "This image helps the reader understand" which pairs of Chatterjee's coefficient xi and Spearman's footrule psi can
// occur together: the region bounded above by Rockel's edge psi = sqrt(xi), on the right by xi = 1 and at the bottom by
// psi = -1/2 (Rockel), and the newly determined curved lower edge from independence (0, 0) to the checkerboard
// (1/2, -1/2) (Theorem 1), with the sharp supporting line xi + 2 psi = -0.6042071... touching it at k = 1.
// checkHook evaluates the boundary two independent ways, the closed form of Proposition 3 (k >= 1) and a midpoint
// Nystrom solve of (I + K_k) r = b_k (any k), compares both with the released constants (results/table.json) and the
// released Table 1 rows, and refuses to draw on mismatch. The plotted curve is the Nystrom/closed-form evaluation.
// Reference: finite-sample-affine-diversification (the region and the contrasting conclusion carry the explanation).
// Usage: node tools/chatterjee-footrule-art.js [--render OUTDIR_FOR_INSPECTION] [--no-mirror]
const SLUG = 'chatterjee-footrule-lower-boundary';
const ink = '#f6f2ea', muted = '#e6e1ea', dim = '#c9c2cf', hot = '#ffc36b', cool = '#9fd3ff', rose = '#f2a7b5';
const SANS = 'Arial,Helvetica,sans-serif', SERIF = 'Georgia,serif';
const text = (x, y, s, size = 18, color = ink, anchor = 'start', weight = 'normal', family = SANS, style = 'normal') => {
  if (/<|&(?!(lt|gt|amp|minus|#\d+);)/.test(s.replace(/<\/?tspan[^>]*>/g, ''))) throw new Error('unescaped < or & in SVG text: ' + s);
  return `<text class="og-hide" x="${x}" y="${y}" fill="${color}" font-family="${family}" font-size="${size}" font-weight="${weight}" font-style="${style}" text-anchor="${anchor}">${s}</text>`;
};
// Released values (results/table.json of the release).
const RELEASED = { k1_xi: 0.3088802919557755, k1_psi: -0.4565437066351824, k1_xi_plus_2psi: -0.6042071213145893, khalf_xi_plus_psi: -0.19322809940099947 };
const TABLE1 = [[-0.05, 0.052023, 0.002566], [-0.1, 0.108761, 0.010562], [-0.2, 0.241748, 0.045103], [-0.3, 0.416398, 0.109988],
  [-0.4, 0.680931, 0.217375], [-0.45, 0.931338, 0.296278], [-0.49, 2.300315, 0.403996]];
function closed(k) {
  const d = Math.sqrt(2 / k), D = Math.cosh(d / 2);
  return [0.5 - 3 / (8 * D * D) * (Math.cosh(d) - Math.sinh(d) / d), -0.5 + 3 * d * d / (32 * D * D) * (Math.sinh(d) / d - 1)];
}
function nystrom(k, n = 600) {
  const h = 1 / n, t = Array.from({ length: n }, (_, i) => (i + 0.5) * h);
  const M = t.map((ti, i) => t.map((tj, j) => (i === j ? 1 : 0) + h * Math.max(0, 1 - Math.abs(tj - ti) / k)));
  const intL = (a, b) => { const F = s => s <= 0 ? 0 : s <= 1 ? s * s / 2 : 0.5 + (s - 1); return F(b) - F(a); };
  const rhs = t.map(ti => intL(ti, ti + k) / k);
  for (let c = 0; c < n; c++) {              // Gaussian elimination (diagonally dominant, no pivoting needed)
    for (let r = c + 1; r < n; r++) { const f = M[r][c] / M[c][c]; if (!f) continue; for (let q = c; q < n; q++) M[r][q] -= f * M[c][q]; rhs[r] -= f * rhs[c]; }
  }
  const r = new Array(n);
  for (let i = n - 1; i >= 0; i--) { let s = rhs[i]; for (let q = i + 1; q < n; q++) s -= M[i][q] * r[q]; r[i] = s / M[i][i]; }
  const cum = [0]; for (let i = 0; i < n; i++) cum.push(cum[i] + h * r[i]);
  const R = z => { const zz = Math.min(1, Math.max(0, z)); const i = Math.min(n - 1, Math.floor(zz * n)); return cum[i] + (zz * n - i) * h * r[i]; };
  const L = s => Math.min(1, Math.max(0, s));
  const A = s => L(s) - (R(L(s)) - R(L(s - k)));
  let x = 0, y = 0;
  for (let i = 0; i < n; i++) {
    const ri = r[i], a = A(t[i]), b = A(t[i] + k);
    x += h * (2 * t[i] - 1) * ((1 - ri) * a + ri * b);
    y += h * (0.5 + ri * b - (1 - ri) * a - ri * ri);
  }
  return [1 - 6 * x, 1 - 3 * y];
}
function checkHook() {
  const c1 = closed(1);
  if (Math.abs(c1[0] - RELEASED.k1_xi) > 1e-12 || Math.abs(c1[1] - RELEASED.k1_psi) > 1e-12) throw new Error('closed form mismatch at k = 1');
  if (Math.abs(c1[0] + 2 * c1[1] - RELEASED.k1_xi_plus_2psi) > 1e-12) throw new Error('xi + 2 psi constant mismatch');
  const n1 = nystrom(1);
  if (Math.abs(n1[0] - c1[0]) > 1e-5 || Math.abs(n1[1] - c1[1]) > 1e-5) throw new Error('Nystrom vs closed form mismatch at k = 1');
  const nh = nystrom(0.5);
  if (Math.abs(nh[0] + nh[1] - RELEASED.khalf_xi_plus_psi) > 2e-5) throw new Error('xi + psi at k = 1/2 mismatch');
  for (const [psi, k, xi] of TABLE1) {
    const p = k >= 1 ? closed(k) : nystrom(k);
    if (Math.abs(p[1] - psi) > 2e-5 || Math.abs(p[0] - xi) > 2e-5) throw new Error('Table 1 mismatch at psi = ' + psi);
  }
  // supporting line: the whole curve lies on or above xi + 2 psi = constant (sharp at k = 1)
  const ks = []; for (let i = 0; i <= 40; i++) ks.push(Math.exp(Math.log(0.01) + i / 40 * (Math.log(1e4) - Math.log(0.01))));
  const pts = ks.map(k => k >= 1 ? closed(k) : nystrom(k, 400));
  for (const [x, y] of pts) if (x + 2 * y < RELEASED.k1_xi_plus_2psi - 1e-6) throw new Error('curve below the supporting line');
  return { pts: [[0, 0], ...pts, [0.5, -0.5]], c1, table: TABLE1.length };
}
function chart(x0, y0, w, h, c) {
  const sx = v => x0 + v * w, sy = p => y0 + (1 - p) / 1.5 * h;   // psi from 1 (top) to -1/2 (bottom)
  let s = `<line x1="${x0}" y1="${sy(-0.5)}" x2="${x0 + w}" y2="${sy(-0.5)}" stroke="${dim}" stroke-width="1" opacity="0.5"/><line x1="${x0}" y1="${y0}" x2="${x0}" y2="${y0 + h}" stroke="${dim}" stroke-width="1" opacity="0.5"/>`;
  s += `<line x1="${x0}" y1="${sy(0)}" x2="${x0 + w}" y2="${sy(0)}" stroke="${dim}" stroke-width="1" opacity="0.35" stroke-dasharray="2 5"/>`;
  const upper = []; for (let i = 0; i <= 80; i++) { const v = i / 80; upper.push([sx(v), sy(Math.sqrt(v))]); }
  const lower = c.pts.map(([x, y]) => [sx(x), sy(y)]);
  const P = a => a.map(([x, y], i) => (i ? 'L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1)).join('');
  const region = P(upper) + `L${sx(1)} ${sy(-0.5)}L${sx(0.5)} ${sy(-0.5)}` + [...lower].reverse().map(([x, y]) => 'L' + x.toFixed(1) + ' ' + y.toFixed(1)).join('') + 'Z';
  s += `<path d="${region}" fill="${ink}" opacity="0.10"/>`;
  s += `<path d="${P(upper)}L${sx(1)} ${sy(-0.5)}L${sx(0.5)} ${sy(-0.5)}" fill="none" stroke="${cool}" stroke-width="2.4" opacity="0.9"/>`;
  s += `<path d="${P(lower)}" fill="none" stroke="${hot}" stroke-width="4"/>`;
  const K = -0.6042071213145893, xa = 0, xb = 0.395;
  s += `<line x1="${sx(xa)}" y1="${sy((K - xa) / 2)}" x2="${sx(xb)}" y2="${sy((K - xb) / 2)}" stroke="${rose}" stroke-width="1.8" stroke-dasharray="7 5"/>`;
  s += `<circle cx="${sx(c.c1[0]).toFixed(1)}" cy="${sy(c.c1[1]).toFixed(1)}" r="5.5" fill="${rose}" stroke="#111" stroke-width="1"/>`;
  s += `<circle cx="${sx(0)}" cy="${sy(0)}" r="4.5" fill="${ink}"/><circle cx="${sx(0.5)}" cy="${sy(-0.5)}" r="4.5" fill="${ink}"/>`;
  s += text(sx(0.3), sy(0.8), 'ψ = √ξ (Rockel)', 13, cool, 'end');
  s += text(sx(0.42), sy(0.12), 'possible pairs', 14, muted, 'middle', 'normal', SANS, 'italic');
  s += text(sx(0.01), sy(-0.47), 'new edge', 14, hot, 'start', 'bold');
  s += text(sx(0.5) + 6, sy(-0.5) - 10, 'checkerboard', 12, dim, 'start');
  s += text(sx(0) + 16, sy(0) - 6, 'independence', 12, dim, 'start');
  s += text(sx(0.34), sy(-0.3), 'ξ + 2ψ = −0.604 touches here', 13, rose, 'start', 'bold');
  for (const [v, lab] of [[0, '0'], [0.5, '½'], [1, '1']]) s += text(sx(v), y0 + h + 17, lab, 12, dim, 'middle');
  for (const [p, lab] of [[1, '1'], [0, '0'], [-0.5, '−½']]) s += text(x0 - 8, sy(p) + 4, lab, 12, dim, 'end');
  s += text(x0 + w / 2, y0 + h + 34, 'Chatterjee’s ξ (how far Y is a function of X)', 13, muted, 'middle');
  s += `<text class="og-hide" transform="translate(${x0 - 30} ${y0 + h / 2}) rotate(-90)" fill="${muted}" font-family="${SANS}" font-size="13" text-anchor="middle">Spearman’s footrule ψ</text>`;
  return s;
}
const draw = () => {
  const c = checkHook();
  let s = text(40, 46, 'How little functional dependence when rankings disagree', 25, ink, 'start', 'normal', SERIF);
  s += text(40, 74, 'Which pairs of Chatterjee’s ξ and Spearman’s footrule ψ can occur together (Theorem 1)', 15, muted);
  s += chart(110, 96, 470, 236, c);
  const R = 690;
  s += text(R, 128, 'The curved lower edge was open.', 16, ink, 'start', 'bold');
  s += text(R, 150, 'Now: for every footrule between −½ and 0,', 15, ink);
  s += text(R, 171, 'the least ξ, its one extremal copula', 15, ink);
  s += text(R, 192, 'and a certificate valid for all copulas.', 15, ink);
  s += text(R, 228, 'Sharp for every copula:', 14, muted);
  s += text(R, 254, 'ξ + 2ψ ≥ −0.6042…', 22, rose, 'start', 'bold');
  s += text(R, 290, 'Closed form for ψ ≤ −0.4565…; elsewhere a', 13, dim);
  s += text(R, 308, 'finite calculation. Population coefficients only.', 13, dim);
  s += text(40, 384, 'Curve computed two ways (closed form; Nyström solve) and checked against the release’s table. Blue edges: Rockel. Unrefereed candidate.', 12, dim);
  return s;
};
const description = 'Banner for a paper on the lower boundary of the region of Chatterjee’s rank correlation and Spearman’s footrule. Title: How little functional dependence when rankings disagree. Subtitle: which pairs of Chatterjee’s xi and Spearman’s footrule psi can occur together (Theorem 1). Left: a plot with xi from 0 to 1 across and psi from minus one half to 1 up. A shaded region labelled possible pairs is bounded above by the blue curve psi = square root of xi (Rockel), on the right by xi = 1 and at the bottom by psi = minus one half. Its curved lower edge, from independence at (0, 0) to the checkerboard at (one half, minus one half), is drawn in bold orange and labelled new edge. A dashed pink line xi + 2 psi = minus 0.604 touches the new edge at one marked point. Right: the curved lower edge was open. Now, for every footrule between minus one half and 0, the least xi, its one extremal copula and a certificate valid for all copulas. Sharp for every copula: xi + 2 psi is at least minus 0.6042. Closed form for psi at most minus 0.4565; elsewhere a finite calculation. Population coefficients only. Footer: curve computed two ways (closed form; Nystrom solve) and checked against the release table; blue edges are Rockel’s; unrefereed candidate.';
function frame(inner, background) {
  return bannerSvg({ inner, description, background, glow: { color: '#ffc36b', cx: '0.3', cy: '0.6', r: '0.4', opacity: '0.06' } });
}
const thumbSpec = {
  kicker: ['RESEARCH RELEASE · NOVEMBER 2026', 'STATISTICS · DEPENDENCE MEASURES'],
  head: ['How little dependence', '<em>when rankings disagree</em>'], headSize: 52,
  sub: 'The missing edge of the Chatterjee–footrule region: exact, unique and certified.',
  tag: 'UNREFEREED CANDIDATE',
  hero: '<div class="eq-label">for every copula, sharp</div><div class="hero-title">ξ + 2ψ ≥ −0.604</div><div class="note">ξ: Chatterjee’s coefficient<br>ψ: Spearman’s footrule</div><div class="eq-foot">population coefficients</div>'
};
module.exports = { draw, description, thumbSpec, checkHook };
if (require.main === module) (async () => {
  const fs = require('fs'), pth = require('path'), os = require('os'), vm = require('vm');
  const ROOT = pth.join(__dirname, '..');
  const ck = checkHook();
  console.log('check: closed form and Nystrom agree with the released constants and Table 1 rows:', ck.table, '| k = 1 point', ck.c1.map(v => v.toFixed(10)).join(', '));
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
