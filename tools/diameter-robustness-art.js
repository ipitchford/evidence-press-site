'use strict';
// Small diameter does not control hitting-time robustness: banner, OG card and thumbnail.
// Source: Theorem 2.1 and Section 2 of the paper. G_m: cliques K_0..K_{n-1} (n = 2m+1, size m) in a ring,
// consecutive cliques completely joined; portal h_i joined to every vertex of K_i; the portals form a clique.
// 3m-regular, diameter exactly 3. The fixed perturbation multiplies an interclique transition by 1+eta when it
// moves to a higher level (ring distance from K_0) and by 1-eta when it moves lower; the two antipodal cliques
// (equal level) are unchanged, as are all portal edges. K_0 then has tiny stationary mass and Kac's formula
// gives a long hitting time. Drawn here collapsed at m = 3, n = 7 (as in the paper's Figure 1); the theorem
// uses m >= 54. Finite figure: G_54 (N = 5,995, epsilon = 0.2478, epsilon*Delta = 0.744), exact ratio 5.80
// (results/finite_size.json, Table 3 of the paper).
//
// Usage: node tools/diameter-robustness-art.js [--render OUTDIR_FOR_INSPECTION] [--no-mirror]
//   Writes assets/art/<slug>.svg; with --render also assets/og/<slug>.png, thumbs/<slug>.jpg,
//   the byte-identical central mirror ~/thumbs/<slug>.jpg and inspection PNGs (needs Playwright).
// Palette registries are NOT written here: record the rotated families in data/*_PALETTES.json.
const SLUG = 'diameter-hitting-time-robustness';
const ink = '#effcfa', muted = '#b9d8d4', dim = '#8fbcb6';
const teal = '#5eead4', cyan = '#67e8f9', portal = '#a5f3fc', target = '#ff9f7a';
const SANS = 'Arial,Helvetica,sans-serif', SERIF = 'Georgia,serif';
const text = (x, y, s, size = 18, color = ink, anchor = 'start', weight = 'normal', family = SANS) =>
  `<text class="og-hide" x="${x}" y="${y}" fill="${color}" font-family="${family}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}">${s}</text>`;
const sub = s => `<tspan baseline-shift="sub" font-size="72%">${s}</tspan>`;
const f = v => (+v).toFixed(1);

const n = 7, m = 3; // collapsed schematic, m = 3
const lev = i => Math.min(i, n - i);
if (lev(m) !== m || lev(m + 1) !== m) throw new Error('antipodal levels');
const CX = 250, CY = 196, R = 136, r = 60;
const at = (i, rad) => { const a = -Math.PI / 2 + 2 * Math.PI * i / n; return [CX + rad * Math.cos(a), CY + rad * Math.sin(a)]; };

function graph() {
  let s = '';
  // portal clique (shortcut routes)
  const H = [...Array(n).keys()].map(i => at(i, r));
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++)
    s += `<path d="M${f(H[i][0])} ${f(H[i][1])} L${f(H[j][0])} ${f(H[j][1])}" stroke="${portal}" stroke-opacity=".38" stroke-width="1.2"/>`;
  // attachments
  for (let i = 0; i < n; i++) { const [x, y] = at(i, R - 27), [u, v] = H[i];
    s += `<path d="M${f(x)} ${f(y)} L${f(u)} ${f(v)}" stroke="${cyan}" stroke-opacity=".55" stroke-width="1.6"/>`; }
  // ring edges with bias chevrons pointing away from K_0
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n, [x1, y1] = at(i, R), [x2, y2] = at(j, R);
    s += `<path d="M${f(x1)} ${f(y1)} L${f(x2)} ${f(y2)}" stroke="${teal}" stroke-width="5" stroke-opacity=".8" stroke-linecap="round"/>`;
    if (lev(i) === lev(j)) { // antipodal pair: unchanged
      const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
      s += `<circle cx="${f(mx)}" cy="${f(my)}" r="9" fill="#0d2a2e" stroke="${teal}" stroke-width="1.5"/>`;
      s += `<text x="${f(mx)}" y="${f(my + 5)}" fill="${ink}" font-family="${SANS}" font-size="14" font-weight="bold" text-anchor="middle">=</text>`;
      continue;
    }
    const [a, b] = lev(j) > lev(i) ? [[x1, y1], [x2, y2]] : [[x2, y2], [x1, y1]];
    const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2, dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy);
    const ux = dx / L, uy = dy / L, px = -uy, py = ux, k = 9;
    s += `<path d="M${f(mx - k * ux + k * px)} ${f(my - k * uy + k * py)} L${f(mx + k * ux)} ${f(my + k * uy)} L${f(mx - k * ux - k * px)} ${f(my - k * uy - k * py)}" fill="none" stroke="${ink}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`;
  }
  // cliques
  for (let i = 0; i < n; i++) { const [x, y] = at(i, R), t = i === 0;
    if (t) s += `<circle cx="${f(x)}" cy="${f(y)}" r="38" fill="${target}" fill-opacity=".16"/>`;
    s += `<circle cx="${f(x)}" cy="${f(y)}" r="26" fill="${t ? '#3a2620' : '#0c3236'}" stroke="${t ? target : teal}" stroke-width="2.6"/>`;
    s += `<text x="${f(x)}" y="${f(y + 6)}" fill="${ink}" font-family="${SERIF}" font-size="18" font-style="italic" text-anchor="middle">K${sub(i)}</text>`; }
  for (let i = 0; i < n; i++) { const [x, y] = H[i];
    s += `<circle cx="${f(x)}" cy="${f(y)}" r="10" fill="#0a2629" stroke="${portal}" stroke-width="1.8"/>`;
    s += `<text x="${f(x)}" y="${f(y + 4)}" fill="${ink}" font-family="${SERIF}" font-size="11" font-style="italic" text-anchor="middle">h${sub(i)}</text>`; }
  // labels
  s += text(CX + 50, 42, 'target K₀', 16, target, 'start', 'bold');
  s += text(CX + 50, 61, 'stationary mass collapses', 13, muted);
  s += text(28, 374, 'ring of cliques · bias pushes', 13, muted);
  s += text(28, 391, 'the walk away from K₀', 13, muted);
  s += text(CX + 70, 374, 'portal clique: short routes,', 13, portal, 'start');
  s += text(CX + 70, 391, 'rarely used', 13, portal, 'start');
  return s;
}

function story() {
  const X = 520;
  let s = '';
  s += text(X, 70, 'Close everywhere, hard to reach', 31, ink, 'start', 'bold', SERIF);
  s += text(X, 100, 'Every pair of vertices is within 3 steps through the portals h' + sub('i') + ' — yet the walk seldom takes them.', 15, muted);
  const steps = [
    ['1', 'bias', 'each step along the ring × (1 ± η), away from K₀'],
    ['2', 'depletion', 'K₀ gets tiny stationary mass π′'],
    ['3', 'Kac', 'hitting time of v in K₀ ≥ 1/π′(v) − 1']
  ];
  steps.forEach(([k, h, d], idx) => { const y = 150 + idx * 46;
    s += `<circle cx="${X + 14}" cy="${y - 6}" r="14" fill="none" stroke="${teal}" stroke-width="2"/>`;
    s += text(X + 14, y - 1, k, 15, teal, 'middle', 'bold');
    s += text(X + 40, y, h, 17, ink, 'start', 'bold');
    s += text(X + 140, y, d, 16, muted); });
  s += `<rect x="${X}" y="290" width="640" height="84" rx="10" fill="#081f22" fill-opacity=".7" stroke="${target}" stroke-opacity=".75"/>`;
  s += text(X + 20, 347, '5.80×', 42, target, 'start', 'bold', SANS);
  s += text(X + 160, 324, 'slower worst-case hitting on G₅₄', 17, ink, 'start', 'bold');
  s += text(X + 160, 350, '5,995 vertices · ε·Δ = 0.74 · exact computation', 15, muted);
  return s;
}

const draw = () => graph() + story();
const description = 'Banner for “Small diameter does not control hitting-time robustness”. Left: the diameter-three regular graph G_m drawn collapsed for m = 3, as in the paper’s Figure 1: seven cliques K0 to K6 in a ring, consecutive cliques completely joined; each clique K_i is attached to a portal vertex h_i, and the seven portals form a clique in the centre, so any two vertices are within three steps. The target clique K0 at the top is highlighted. Chevrons on the ring edges show the fixed perturbation: each transition along the ring is multiplied by 1 + η when it moves away from K0 and by 1 − η when it moves towards it; the edge between the two antipodal cliques, at equal distance from K0, is unchanged (marked =), as are the portal edges. Right: the mechanism in three steps: bias along the ring away from K0; depletion, K0 receives tiny stationary mass; Kac’s formula, the hitting time of a vertex v in K0 is at least 1/π′(v) − 1. A callout gives the exact computed figure from the paper’s Table 3: on G54, with 5,995 vertices and ε times the diameter equal to 0.74, the worst-case expected hitting time is 5.80 times larger. The graph is a schematic; the theorem uses m at least 54.';

function frame(inner, background) {
  const [c0, c1] = background.colors, W = 1200, H = 400, accent = teal;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" data-banner-palette="${background.name}" role="img" aria-labelledby="art-description">
<desc id="art-description">${description}</desc><defs>
<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
<stop offset="0" stop-color="${c0}"/><stop offset="1" stop-color="${c1}"/>
</linearGradient>
<radialGradient id="glow" cx="0.22" cy="0.5" r="0.8">
<stop offset="0" stop-color="${accent}" stop-opacity="0.07"/><stop offset="1" stop-color="${accent}" stop-opacity="0"/>
</radialGradient>
</defs>
<rect width="${W}" height="${H}" fill="url(#bg)"/>
<rect width="${W}" height="${H}" fill="url(#glow)"/>
${inner}
</svg>`;
}

const thumbSpec = {
  kicker: ['RESEARCH RELEASE · 22 OCTOBER 2026', 'RANDOM WALKS · MARKOV CHAINS'],
  head: ['Short diameter,', '<em>slow walk.</em>'], headSize: 72,
  sub: 'Zuckerman’s Conjecture 1.16 is false: tiny relative transition errors with ε·diameter&nbsp;→&nbsp;0 can still slow hitting times without bound.',
  tag: 'UNREFEREED CANDIDATE',
  hero: '<div class="eq-label">diameter-three graph G₅₄</div><div class="hero-title">5.80× slower</div><div class="note">5,995 vertices<br>ε·Δ = 0.74<br>cubic family: resistance ≤ 684</div><div class="eq-foot">written proofs · exact computation</div>'
};

module.exports = { draw, description, thumbSpec };

if (require.main === module) (async () => {
  const fs = require('fs'), pth = require('path'), os = require('os'), vm = require('vm');
  const ROOT = pth.join(__dirname, '..');
  const { palettes, assign } = require('./banner-palettes');
  const reg = JSON.parse(fs.readFileSync(pth.join(ROOT, 'data/BANNER_PALETTES.json'), 'utf8'));
  const bname = assign(reg, SLUG); // in-memory only
  const tp = require('./thumbnail-palettes');
  const treg = tp.load();
  const tsaved = treg.assignments.find(r => r.slug === SLUG);
  const tname = tsaved ? (tsaved.editorialPalette || tsaved.palette) : tp.rotation[(tp.rotation.indexOf(treg.assignments.at(-1).palette) + 1) % tp.rotation.length];
  const svg = frame(draw(), { name: bname, colors: palettes[bname] });
  fs.writeFileSync(pth.join(ROOT, 'assets/art', SLUG + '.svg'), svg);
  console.log('art:', SLUG, 'banner palette', bname, '| thumbnail palette', tname);
  const i = process.argv.indexOf('--render');
  if (i < 0) return;
  const inspect = process.argv[i + 1];
  fs.mkdirSync(inspect, { recursive: true });
  const { chromium } = require('playwright');
  const b = await chromium.launch(process.env.EVIDENCE_PRESS_CHROME ? { executablePath: process.env.EVIDENCE_PRESS_CHROME } : {});
  const shot = async (w, h, html, file, opts = {}) => {
    const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: opts.dpr || 1 });
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
  const metaPath = pth.join(ROOT, 'papers', SLUG, 'meta.json');
  const m = fs.existsSync(metaPath) ? JSON.parse(fs.readFileSync(metaPath, 'utf8'))
    : { title: 'Small diameter does not control hitting-time robustness', status: 'unrefereed-candidate', datePublished: '2026-10-22' };
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
  if (process.argv.includes('--no-mirror')) { await b.close(); console.log('rendered (central mirror skipped)'); return; }
  const central = pth.join(process.env.EVIDENCE_PRESS_THUMBNAIL_DIR || pth.join(os.homedir(), 'thumbs'), SLUG + '.jpg');
  if (fs.existsSync(central) && !fs.readFileSync(thumbFile).equals(fs.readFileSync(central))) throw new Error('central thumbnail exists; refusing to overwrite: ' + central);
  fs.copyFileSync(thumbFile, central);
  if (!fs.readFileSync(thumbFile).equals(fs.readFileSync(central))) throw new Error('central mirror mismatch');
  await b.close();
  console.log('rendered OG, thumbnail, mirror and inspection PNGs');
})().catch(e => { console.error(e); process.exit(1); });
