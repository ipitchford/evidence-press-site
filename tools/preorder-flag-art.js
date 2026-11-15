'use strict';
const { bannerSvg } = require('./svg-xml');
// Preorder polytopes: matching endpoint pairs, flag spheres and the Athanasiadis–Chapoton conjectures: banner, OG, thumbnail.
// "This image helps the reader understand" what the gamma-coefficients count and where the flag theorem stops. Left: the
// chain 1 < 2 < 3, whose preorder polytope has 1, 6, 6, 1 integer points by support size (paper, Section 1.1), so
// H = 1 + 6t + 6t² + t³ = (1+t)³ + 3t(1+t); the 3 counts the three pairs (a, b) with a below b, drawn as arcs
// (Theorem 3.4 with j = 1). Right: the six-element crown, s_i <= t_j exactly when j in {i-1, i} (indices mod 3): the
// smallest preorder not covered by the flag theorem (Theorem 5.6, Proposition 5.7, open problem 1).
// Usage: node tools/preorder-flag-art.js [--render OUTDIR_FOR_INSPECTION] [--no-mirror]
const SLUG = 'preorder-polytope-flag-spheres';
const ink = '#f4f1ea', muted = '#dfe6ec', dim = '#b9c8d4';
const teal = '#7fe0c8', amber = '#ffc27a', node = '#e8eef2';
const SANS = 'Arial,Helvetica,sans-serif', SERIF = 'Georgia,serif';
const text = (x, y, s, size = 18, color = ink, anchor = 'start', weight = 'normal', family = SANS, style = 'normal') =>
  `<text class="og-hide" x="${x}" y="${y}" fill="${color}" font-family="${family}" font-size="${size}" font-weight="${weight}" font-style="${style}" text-anchor="${anchor}">${s}</text>`;
const dot = (x, y, c = node) => `<circle cx="${x}" cy="${y}" r="9" fill="${c}" stroke="#10202b" stroke-width="1.5"/>`;
// Chain 1 < 2 < 3, drawn bottom to top.
const CH = { x: 92, y: [318, 238, 158] };
const PAIRS = [[0, 1], [1, 2], [0, 2]];
function chain() {
  let s = `<path d="M${CH.x} ${CH.y[0]} V${CH.y[2]}" stroke="${muted}" stroke-width="2.5"/>`;
  PAIRS.forEach(([a, b], k) => {
    const y0 = CH.y[a], y1 = CH.y[b], bulge = 34 + 26 * (b - a) + (k === 2 ? 10 : 0);
    s += `<path d="M${CH.x + 10} ${y0} C${CH.x + bulge} ${y0} ${CH.x + bulge} ${y1} ${CH.x + 10} ${y1}" fill="none" stroke="${teal}" stroke-width="2.6"/>`;
  });
  CH.y.forEach((y, i) => { s += dot(CH.x, y); s += text(CH.x - 18, y + 6, String(i + 1), 18, ink, 'end', 'bold'); });
  s += text(CH.x + 4, 372, 'chain 1 &lt; 2 &lt; 3', 15, muted, 'middle');
  s += text(218, 150, 'integer points by support size:', 15, dim, 'start', 'normal', SERIF, 'italic');
  s += text(218, 184, '1, 6, 6, 1', 26, ink, 'start', 'bold');
  s += text(218, 230, 'H = 1 + 6t + 6t² + t³', 21, ink);
  s += text(218, 266, `= (1+t)³ + <tspan fill="${teal}" font-weight="bold">3</tspan>t(1+t)`, 21, ink);
  s += text(218, 304, `<tspan fill="${teal}" font-weight="bold">3</tspan> = the three pairs matched upwards:`, 15, muted);
  s += text(218, 324, '1→2, 2→3, 1→3 (teal arcs)', 15, muted);
  return s;
}
// Six-element crown: bottoms s1..s3, tops t1..t3, s_i <= t_j iff j in {i-1, i} (mod 3).
const CR = { xs: [760, 880, 1000], yTop: 168, yBot: 300 };
const CROWN_EDGES = [[0, 0], [0, 2], [1, 1], [1, 0], [2, 2], [2, 1]]; // [i, j]: s_{i+1} <= t_{j+1}
function crown() {
  let s = '';
  for (const [i, j] of CROWN_EDGES) s += `<path d="M${CR.xs[i]} ${CR.yBot} L${CR.xs[j]} ${CR.yTop}" stroke="${amber}" stroke-width="2.6"/>`;
  const sub = ['₁', '₂', '₃'];
  CR.xs.forEach((x, k) => {
    s += dot(x, CR.yTop, amber) + text(x, CR.yTop - 18, 't' + sub[k], 17, amber, 'middle', 'bold');
    s += dot(x, CR.yBot, amber) + text(x, CR.yBot + 30, 's' + sub[k], 17, amber, 'middle', 'bold');
  });
  s += text(880, 362, 'the six-element crown: the first open case', 17, amber, 'middle', 'bold');
  return s;
}
function middle() {
  let s = `<rect x="470" y="150" width="226" height="140" rx="10" fill="#0c1820" fill-opacity="0.55" stroke="${teal}" stroke-opacity="0.7"/>`;
  s += text(583, 180, 'No crown?', 18, teal, 'middle', 'bold');
  s += text(583, 206, 'H comes from a', 16, ink, 'middle');
  s += text(583, 228, 'flag sphere', 16, ink, 'middle', 'bold');
  s += text(583, 254, '(Theorem 5.6)', 14, muted, 'middle');
  s += text(583, 278, 'a crown blocks the method', 13, amber, 'middle', 'normal', SERIF, 'italic');
  s += `<path d="M704 220 H${CR.xs[0] - 34}" stroke="${muted}" stroke-width="1.8" stroke-dasharray="5 5"/>`;
  return s;
}
function checkHook() {
  // Integer points of Q for the chain 1<2<3 (order ideals {1},{1,2},{1,2,3}): x1 <= 1, x1+x2 <= 2, x1+x2+x3 <= 3.
  const counts = [0, 0, 0, 0];
  for (let a = 0; a <= 3; a++) for (let b = 0; b <= 3; b++) for (let c = 0; c <= 3; c++)
    if (a <= 1 && a + b <= 2 && a + b + c <= 3) counts[(a > 0) + (b > 0) + (c > 0)]++;
  if (counts.join() !== '1,6,6,1') throw new Error('chain counts ' + counts);
  // (1+t)^3 + 3t(1+t) = 1 + 6t + 6t^2 + t^3
  if ([1, 3 + 3, 3 + 3, 1].join() !== counts.join()) throw new Error('gamma expansion');
  if (PAIRS.length !== 3) throw new Error('pairs');
  // Crown relation: s_i <= t_j exactly when j in {i-1, i} mod 3.
  const want = new Set(); for (let i = 0; i < 3; i++) { want.add(i + ',' + i); want.add(i + ',' + ((i + 2) % 3)); }
  if (CROWN_EDGES.length !== 6 || CROWN_EDGES.some(([i, j]) => !want.has(i + ',' + j))) throw new Error('crown edges');
}
const draw = () =>
  text(40, 48, 'Count the points, match the pairs, and look for crowns', 26, ink, 'start', 'normal', SERIF) +
  text(40, 76, 'Preorder polytopes: gamma-coefficients count pairs matched upwards; every crown-free preorder gives a flag sphere', 15, muted) +
  chain() + middle() + crown() +
  text(40, 392, 'Diagram drawn from the paper (Section 1.1, Theorem 3.4, Theorem 5.6); not data.', 11.5, dim, 'start', 'normal', SERIF, 'italic');
const description = 'Banner for a paper on preorder polytopes. On the left, a vertical chain of three dots labelled 1, 2 and 3 from bottom to top, with three teal arcs joining 1 to 2, 2 to 3 and 1 to 3. Beside it: integer points by support size: 1, 6, 6, 1; H equals 1 plus 6t plus 6t squared plus t cubed, which equals (1 plus t) cubed plus 3t(1 plus t), with the 3 in teal; a caption says the 3 counts the three pairs matched upwards, 1 to 2, 2 to 3 and 1 to 3. In the middle, a box reads: No crown? H comes from a flag sphere (Theorem 5.6); a crown blocks the method. On the right, in amber, the six-element crown: three top dots t1, t2, t3 above three bottom dots s1, s2, s3, each bottom dot joined to two top dots in a closed zig-zag, labelled the six-element crown: the first open case. The title reads: Count the points, match the pairs, and look for crowns.';
function frame(inner, background) {
  return bannerSvg({ inner, description, background, glow: { color: teal, cx: '0.62', cy: '0.5', r: '0.5', opacity: '0.06' } });
}
const thumbSpec = {
  kicker: ['RESEARCH RELEASE · NOVEMBER 2026', 'ALGEBRAIC COMBINATORICS'],
  head: ['Flag spheres', 'for <em>crown-free</em> preorders'], headSize: 60,
  sub: 'Rankings with ties give polytopes. For every preorder without a crown, the counting polynomial comes from a flag sphere; its gamma-coefficients count pairs matched upwards.',
  tag: 'UNREFEREED CANDIDATE',
  hero: '<div class="eq-label">chain 1 &lt; 2 &lt; 3</div><div class="hero-title">1, 6, 6, 1</div><div class="note">= (1+t)³ + 3t(1+t)<br>3 = pairs matched upwards<br>six-element crown: open</div><div class="eq-foot">gamma formula: concurrent with Zhong</div>'
};
module.exports = { draw, description, thumbSpec };
if (require.main === module) (async () => {
  const fs = require('fs'), pth = require('path'), os = require('os'), vm = require('vm');
  const ROOT = pth.join(__dirname, '..');
  // Guards: the drawn formula and crown match the paper (Section 1.1, Theorem 3.4, the crown definition).
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
