'use strict';
const { bannerSvg } = require('./svg-xml');
// Random-graph domination ultra-log-concavity (random-graph-domination-ultra-log-concavity): banner, OG, thumbnail.
// "This image helps the reader understand" that in almost every network the counts of dominating sets of each size rise
// to one peak with no second hump, and that the only place this can fail is the very start of the sequence, as in
// Cameron's nine-node example where 7 x 7 < 1 x 50 (Theorem 2.1; Section 1; results/finite-n.stdout).
// checkHook checks 7*7 = 49 < 50 = 1*50, 2^15 = 32768, the released n = 6 row (graphs= 32768, ULC-fail=636), that the
// drawn guard set dominates the drawn network, and that the schematic profile is single-peaked and log-concave;
// it refuses to draw on any mismatch.
// Reference: txgraffiti-order48-successor (one exact object balanced with immediately readable values).
// Usage: node tools/random-domination-art.js [--render OUTDIR_FOR_INSPECTION] [--no-mirror]
const SLUG = 'random-graph-domination-ultra-log-concavity';
const ink = '#f6f2ea', muted = '#e6e1ea', dim = '#c9c2cf', cool = '#9fd3ff', hot = '#ffc36b', rose = '#f2a7b5', ok = '#a8e0b0';
const SANS = 'Arial,Helvetica,sans-serif', SERIF = 'Georgia,serif';
const text = (x, y, s, size = 18, color = ink, anchor = 'start', weight = 'normal', family = SANS, style = 'normal') => {
  if (/<|&(?!(lt|gt|amp|minus|#\d+);)/.test(s.replace(/<\/?tspan[^>]*>/g, ''))) throw new Error('unescaped < or & in SVG text: ' + s);
  return `<text class="og-hide" x="${x}" y="${y}" fill="${color}" font-family="${family}" font-size="${size}" font-weight="${weight}" font-style="${style}" text-anchor="${anchor}">${s}</text>`;
};
// Released values: manuscript Section 1 (Cameron counts) and results/finite-n.stdout row n = 6 of archive sha256 5983a4d9...
const RELEASED = { cameron: [1, 7, 50], row6: 'n= 6 exhaustive graphs= 32768 LC-fail=0 ULC-fail=636' };
// Drawn network: 10 nodes, guards 0, 4, 7.
const POS = [[150, 170], [90, 120], [215, 115], [95, 230], [300, 200], [255, 275], [370, 140], [395, 270], [330, 330], [450, 215]];
const EDGES = [[0, 1], [0, 2], [0, 3], [4, 2], [4, 5], [4, 6], [7, 8], [7, 9], [7, 5], [6, 9], [1, 2], [3, 5], [8, 5]];
const GUARDS = [0, 4, 7];
const PROFILE = [1, 6, 16, 30, 42, 46, 41, 30, 17, 7, 2]; // schematic heights
function checkHook() {
  const [a, b, c] = RELEASED.cameron;
  if (!(b * b === 49 && a * c === 50 && b * b < a * c)) throw new Error('Cameron inequality mismatch');
  if (2 ** 15 !== 32768) throw new Error('graph count mismatch');
  if (!/graphs= 32768 /.test(RELEASED.row6) || !/ULC-fail=636 /.test(RELEASED.row6 + ' ')) throw new Error('n=6 row mismatch');
  for (let v = 0; v < POS.length; v++) if (!GUARDS.includes(v) && !EDGES.some(([x, y]) => (x === v && GUARDS.includes(y)) || (y === v && GUARDS.includes(x)))) throw new Error('not dominating at ' + v);
  for (let i = 1; i + 1 < PROFILE.length; i++) if (PROFILE[i] ** 2 < PROFILE[i - 1] * PROFILE[i + 1]) throw new Error('profile not log-concave at ' + i);
  return { nodes: POS.length };
}
function network() {
  let s = '';
  for (const [u, v] of EDGES) s += `<line x1="${POS[u][0]}" y1="${POS[u][1]}" x2="${POS[v][0]}" y2="${POS[v][1]}" stroke="${dim}" stroke-width="2"/>`;
  POS.forEach(([x, y], j) => { s += GUARDS.includes(j) ? `<circle cx="${x}" cy="${y}" r="14" fill="${hot}"/>` : `<circle cx="${x}" cy="${y}" r="10" fill="none" stroke="${muted}" stroke-width="2.5"/>`; });
  s += text(270, 372, 'a dominating set: every node is a guard (orange) or next to one', 14, hot, 'middle');
  return s;
}
function profile() {
  const X0 = 600, base = 330, w = 38; let s = '';
  s += text(X0, 108, 'counts of dominating sets by size k (schematic)', 14, ink, 'start', 'bold');
  PROFILE.forEach((h, i) => { const H = h * 3.0; s += `<rect x="${X0 + i * (w + 6)}" y="${base - H}" width="${w}" height="${H}" fill="${i === 1 ? rose : cool}" opacity="0.85"/>`; });
  s += `<line x1="${X0 - 6}" y1="${base}" x2="${X0 + PROFILE.length * (w + 6)}" y2="${base}" stroke="${muted}" stroke-width="1.5"/>`;
  s += text(X0 + 260, 356, 'one peak, no second hump: log-concave', 14, ok, 'middle', 'bold');
  // inset: Cameron's start
  s += text(X0 + 0, 140, 'Cameron’s nine-node exception starts 1, 7, 50:', 13, rose);
  s += text(X0 + 0, 160, '7 × 7 &lt; 1 × 50 at the second nonzero count,', 13, rose);
  s += text(X0 + 0, 180, 'the only place it can fail', 13, rose);
  return s;
}
const draw = () => {
  checkHook();
  let s = text(40, 46, 'Almost every network: dominating-set counts rise to one peak, no second hump', 25, ink, 'start', 'normal', SERIF);
  s += text(40, 72, 'Random graphs with p(log n)² large: ultra-log-concave with high probability · at the boundary scale a Poisson count decides', 15, muted);
  s += network();
  s += profile();
  s += text(1160, 390, 'Profile schematic; 636 of 32,768 six-node graphs fail ULC at p = 1/2. Unrefereed candidate.', 12, dim, 'end');
  return s;
};
const description = 'Banner for a paper on the domination polynomial of random graphs. Title: almost every network has dominating-set counts that rise to one peak, with no second hump. Subtitle: random graphs with p times (log n) squared large are ultra-log-concave with high probability; at the boundary scale a Poisson count decides. Left: a ten-node network with three orange guard nodes; every other node is next to a guard; caption: a dominating set. Right: a schematic single-peaked bar profile of counts of dominating sets by size, captioned one peak, no second hump: log-concave; the second bar is highlighted, with the note that Cameron’s nine-node exception starts 1, 7, 50 and 7 times 7 is less than 1 times 50 at the second nonzero count, the only place it can fail. Footer: profile schematic; 636 of 32,768 six-node graphs fail ultra-log-concavity at p = 1/2; unrefereed candidate.';
const thumbSpec = {
  kicker: ['RESEARCH RELEASE · NOVEMBER 2026', 'GRAPH THEORY · RANDOM GRAPHS'],
  head: ['Almost every network:', '<em>one peak, no second hump</em>'], headSize: 50,
  sub: 'Domination polynomials of random graphs are ultra-log-concave with high probability, answering Cameron’s question.',
  tag: 'UNREFEREED CANDIDATE',
  hero: '<div class="eq-label">Cameron’s nine-node exception</div><div class="hero-title">7 × 7 &lt; 1 × 50</div><div class="note">failures sit at the start<br>of the sequence</div><div class="eq-foot">6 nodes, p = 1/2: 636 of 32,768 fail ULC</div>'
};
function frame(inner, background) {
  return bannerSvg({ inner, description, background, glow: { color: '#9fd3ff', cx: '0.7', cy: '0.6', r: '0.35', opacity: '0.07' } });
}
module.exports = { draw, description, thumbSpec, checkHook };
if (require.main === module) (async () => {
  const fs = require('fs'), pth = require('path'), os = require('os'), vm = require('vm');
  const ROOT = pth.join(__dirname, '..');
  const ck = checkHook();
  console.log('check: Cameron inequality, n=6 row, domination of the drawn network and log-concave profile agree (nodes', ck.nodes + ')');
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
