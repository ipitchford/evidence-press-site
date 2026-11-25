'use strict';
const { bannerSvg } = require('./svg-xml');
// The maximum Wiener index of trees with prescribed diameter (wiener-index-trees-diameter-second-order): banner, OG, thumbnail.
// "This image helps the reader understand" how the most spread-out trees of given diameter are shaped and what the new
// constant is: one branch of an optimal stem drawn against the remaining height tau, with line width proportional to the
// mass carried, splitting into equal halves at tau = x^2/2, x^2/8, x^2/32 (each split at a quarter of the previous height,
// Section 5), beside kappa = sqrt((175 - sqrt 7)/756) ~ 0.4775 and Cambie's bracket [0.4714, 0.4833].
// checkHook verifies, in exact rational arithmetic, the splitting identity (11) of the manuscript,
//   g(t,y) + g(t,z) - g(t,y+z) = 1/2 (t - 2yz)^2 + 4/7 yz (y - z)^2,  g(t,x) = t^2/2 + t x^2 - x^4/7,
// on a grid of rational points; that the equal split of the drawn masses 1, 1/2, 1/4 is free exactly at the drawn heights
// 1/2, 1/8, 1/32 (ratio 1/4); and that K = f(a) with a^2 = (7 - sqrt 7)/6 gives K/sqrt 8 = kappa strictly inside the
// bracket. It refuses to draw on any mismatch, and the printed constants come from this computation.
// Reference: txgraffiti-order48-successor (one exact object balanced with immediately readable values).
// Usage: node tools/wiener-index-diameter-art.js [--render OUTDIR_FOR_INSPECTION] [--no-mirror]
const SLUG = 'wiener-index-trees-diameter-second-order';
const ink = '#f6f2ea', muted = '#e2e7ea', dim = '#c3ccd2', hot = '#ffc36b', cool = '#9fd3ff', rose = '#f2a7b5', mint = '#a8e6c1';
const SANS = 'Arial,Helvetica,sans-serif', SERIF = 'Georgia,serif';
const text = (x, y, s, size = 18, color = ink, anchor = 'start', weight = 'normal', family = SANS, style = 'normal') => {
  if (/<|&(?!(lt|gt|amp|minus|#\d+);)/.test(s.replace(/<\/?tspan[^>]*>/g, ''))) throw new Error('unescaped < or & in SVG text: ' + s);
  return `<text class="og-hide" x="${x}" y="${y}" fill="${color}" font-family="${family}" font-size="${size}" font-weight="${weight}" font-style="${style}" text-anchor="${anchor}">${s}</text>`;
};
// Exact rationals with BigInt.
const gcd = (a, b) => { a = a < 0n ? -a : a; b = b < 0n ? -b : b; while (b) [a, b] = [b, a % b]; return a; };
const Q = (n, d = 1n) => { n = BigInt(n); d = BigInt(d); if (d < 0n) { n = -n; d = -d; } const g = gcd(n, d) || 1n; return [n / g, d / g]; };
const add = (a, b) => Q(a[0] * b[1] + b[0] * a[1], a[1] * b[1]);
const sub = (a, b) => Q(a[0] * b[1] - b[0] * a[1], a[1] * b[1]);
const mul = (a, b) => Q(a[0] * b[0], a[1] * b[1]);
const eq = (a, b) => a[0] === b[0] && a[1] === b[1];
const g = (t, x) => sub(add(mul(Q(1, 2), mul(t, t)), mul(t, mul(x, x))), mul(Q(1, 7), mul(mul(x, x), mul(x, x))));
const excess = (t, y, z) => sub(add(g(t, y), g(t, z)), g(t, add(y, z)));
const rhs = (t, y, z) => { const d = sub(t, mul(Q(2), mul(y, z))), e = sub(y, z); return add(mul(Q(1, 2), mul(d, d)), mul(Q(4, 7), mul(mul(y, z), mul(e, e)))); };
const MASSES = [Q(1), Q(1, 2), Q(1, 4)];
function checkHook() {
  let n = 0;
  for (let a = 0; a <= 6; a++) for (let b = 1; b <= 5; b++) for (let c = 1; c <= 5; c++) {
    const t = Q(a, 3), y = Q(b, 4), z = Q(c, 5);
    if (!eq(excess(t, y, z), rhs(t, y, z))) throw new Error('split identity (11) fails');
    n++;
  }
  const heights = MASSES.map(x => mul(Q(1, 2), mul(x, x)));
  heights.forEach((t, i) => {
    const h = mul(MASSES[i], Q(1, 2));
    if (!eq(excess(t, h, h), Q(0))) throw new Error('equal split not free at x^2/2');
    if (eq(excess(add(t, Q(1, 64)), h, h), Q(0))) throw new Error('equal split free off x^2/2');
    if (i && !eq(mul(heights[i - 1], Q(1, 4)), t)) throw new Error('heights do not shrink by 1/4');
  });
  const want = [Q(1, 2), Q(1, 8), Q(1, 32)];
  if (!heights.every((t, i) => eq(t, want[i]))) throw new Error('drawn heights');
  const a = Math.sqrt((7 - Math.sqrt(7)) / 6), f = s => 1 / (2 * s) + s - s ** 3 / 7;
  const K = f(a), kappa = Math.sqrt((175 - Math.sqrt(7)) / 756);
  if (Math.abs(K / Math.sqrt(8) - kappa) > 1e-12) throw new Error('K/sqrt8 != kappa');
  if (!(Math.sqrt(2) / 3 < kappa && kappa < 29 / 60)) throw new Error('kappa outside the bracket');
  return { identityPoints: n, heights: ['1/2', '1/8', '1/32'], K: +K.toFixed(5), kappa: kappa.toFixed(4), lo: (Math.sqrt(2) / 3).toFixed(4), hi: (29 / 60).toFixed(4) };
}
// One branch: tau from 1 (top) to 0 (tips); mass 1 splits at 1/2, 1/8, 1/32 into 2, 4, 8 parts.
function tree(cx) {
  const top = 112, bot = 352, Y = t => (top + (1 - t) * (bot - top)).toFixed(1);
  const levels = [[1, 0.5], [0.5, 0.125], [0.125, 1 / 32], [1 / 32, 0]], spread = [0, 104, 52, 26];
  let xs = [cx], s = '';
  const ax = 52;
  s += `<line x1="${ax}" y1="${Y(1)}" x2="${ax}" y2="${+Y(0) + 6}" stroke="${dim}" stroke-width="1.5"/>`;
  s += `<polygon points="${ax - 5},${+Y(0) + 2} ${ax + 5},${+Y(0) + 2} ${ax},${+Y(0) + 12}" fill="${dim}"/>`;
  s += text(ax + 8, +Y(1) + 4, 'remaining', 12, dim) + text(ax + 8, +Y(1) + 19, 'height τ', 12, dim);
  levels.forEach(([t0, t1], i) => {
    if (i) xs = xs.flatMap(x => [x - spread[i], x + spread[i]]);
    const w = (16 / 2 ** i).toFixed(2), col = i === 0 ? hot : i === 1 ? hot : i === 2 ? cool : mint;
    for (let j = 0; j < xs.length; j++) {
      const parent = i ? xs[j] + (j % 2 ? -spread[i] : spread[i]) : cx;
      if (i) s += `<line x1="${parent}" y1="${Y(t0)}" x2="${xs[j]}" y2="${(+Y(t0) + Math.min(14, (+Y(t1) - +Y(t0)) * 0.6)).toFixed(1)}" stroke="${col}" stroke-width="${w}" stroke-linecap="round"/>`;
      const y0 = i ? (+Y(t0) + Math.min(14, (+Y(t1) - +Y(t0)) * 0.6)).toFixed(1) : Y(t0);
      s += `<line x1="${xs[j]}" y1="${y0}" x2="${xs[j]}" y2="${Y(t1)}" stroke="${col}" stroke-width="${w}" stroke-linecap="round"/>`;
    }
  });
  const lab = [[0.5, 'equal split at τ = x²/2', hot], [0.125, 'next at x²/8', cool], [1 / 32, 'then x²/32', mint]];
  for (const [t, l, c] of lab) {
    s += `<line x1="${cx + 120}" y1="${Y(t)}" x2="${cx + 205}" y2="${Y(t)}" stroke="${c}" stroke-width="1" stroke-dasharray="3 3" opacity="0.8"/>`;
    s += text(cx + 210, +Y(t) + (t === 1 / 32 ? 9 : 4), l, 13, c, 'start', 'bold');
  }
  s += text(cx + 12, +Y(1) - 6, 'mass x', 13, hot, 'start', 'bold');
  return s;
}
const draw = () => {
  const c = checkHook();
  let s = text(40, 46, 'How spread out can a tree of given diameter be?', 27, ink, 'start', 'normal', SERIF);
  s += text(40, 74, 'Add up the distances between all pairs of points of a tree with n points and longest distance d. How far must the largest total fall short of its ceiling?', 14, muted);
  s += tree(300);
  const X = 690;
  s += text(X, 138, 'Shortfall of the most spread-out tree, for large d with d/n → 0:', 15, ink, 'start', 'bold');
  s += text(X, 178, `κ (dn)<tspan baseline-shift="super" font-size="15">3/2</tspan>,  κ ≈ ${c.kappa}`, 30, hot, 'start', 'bold', SERIF);
  s += text(X, 206, 'κ = √((175 − √7)/756), exact', 15, hot);
  s += text(X, 240, `Before: Cambie (2020) placed it between ${c.lo} and ${c.hi}.`, 14, dim);
  s += text(X, 276, 'Best branches split in half, again and again; each split', 14, mint, 'start', 'bold');
  s += text(X, 295, 'comes when a quarter as much height remains as at the last.', 14, mint);
  s += text(X, 330, 'Trees only; lower-order terms remain open.', 13, rose);
  s += text(40, 386, 'Left: one branch of an optimal tree against the remaining height; line width is proportional to the mass of leaves it carries. Unrefereed candidate.', 12, dim);
  return s;
};
const description = 'Banner for a paper on the maximum Wiener index of trees with prescribed diameter. Title: how spread out can a tree of given diameter be? Subtitle: add up the distances between all pairs of points of a tree with n points and longest distance d; how far must the largest total fall short of its ceiling? Left: one branch drawn downwards against an axis labelled remaining height tau; a thick gold trunk labelled mass x splits into two equal halves at the level marked equal split at tau = x squared over 2, each half splits again at the level marked next at x squared over 8, and again at the level marked then x squared over 32, the lines getting thinner as the mass halves. Right: shortfall of the most spread-out tree, for large d with d over n tending to 0: kappa times (dn) to the power 3/2, kappa about 0.4775; kappa equals the square root of (175 minus root 7) over 756, exact. Before: Cambie (2020) placed it between 0.4714 and 0.4833. Best branches split in half, again and again; each split comes when a quarter as much height remains as at the last. Trees only; lower-order terms remain open. Footer: left, one branch of an optimal tree against the remaining height; line width is proportional to the mass of leaves it carries; unrefereed candidate.';
function frame(inner, background) {
  const c = checkHook();
  for (const t of [description, thumbSpec.hero]) if (!t.includes(c.kappa)) throw new Error('stated constant differs from the computation');
  if (!description.includes(c.lo) || !description.includes(c.hi)) throw new Error('stated bracket differs from the computation');
  return bannerSvg({ inner, description, background, glow: { color: '#ffc36b', cx: '0.22', cy: '0.5', r: '0.35', opacity: '0.07' } });
}
const thumbSpec = {
  kicker: ['RESEARCH RELEASE · NOVEMBER 2026', 'GRAPH THEORY'],
  head: ['How spread out', 'can a <em>tree</em> be?'], headSize: 56,
  sub: 'The largest total distance for a tree of given diameter, settled to second order.',
  tag: 'UNREFEREED CANDIDATE',
  hero: '<div class="eq-label">shortfall below the ceiling</div><div class="hero-title">κ ≈ 0.4775</div><div class="note">Cambie: between 0.4714 and 0.4833</div><div class="eq-foot">equal halves, ¼ the height each time</div>'
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
