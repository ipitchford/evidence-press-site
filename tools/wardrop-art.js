'use strict';
// Wardrop route regimes: banner, OG card and thumbnail.
// Five-link quartic example of the paper (Section 5.2): commodity A s->v and B u->v, each with demand 4t.
// Bank F (direct, s->v): F0 = 2 + z^4, F2 = 8/3 + z^4/243.  Bank G (shared, u->v): G1 = 3/2 + z^4/162,
// G3 = 7/4 + z^4/4.  Connector h (s->u): 1 + z^4.  At bank load T = 4 (t = 1) the delay curves F and G + 1
// agree in value, slope and curvature; the route gap is (336/625)(t-1)^3 and the connector flow (84/125)(t-1)^3.
// Every plotted point is computed here by solving the Wardrop conditions directly (bisection); the values agree
// with evidence/smooth_transition_flow.csv of the research package (numerical illustration, not a proof).
//
// Usage: node tools/wardrop-art.js [--render OUTDIR_FOR_INSPECTION] [--no-mirror]
//   Writes assets/art/<slug>.svg; with --render also assets/og/<slug>.png, thumbs/<slug>.jpg,
//   the byte-identical central mirror ~/thumbs/<slug>.jpg and inspection PNGs (needs Playwright).
// Palette registries are NOT written here: record the rotated families in data/*_PALETTES.json.
const SLUG = 'wardrop-smooth-route-regimes';
const ink = '#f4f1ec', muted = '#d9cfc2', dim = '#bfb2a2';
const fc = '#e6b8ff', gc = '#8fe3d0', hc = '#ffd36e', ec = '#f4f1ec';
const text = (x, y, s, size = 18, color = ink, anchor = 'start', weight = 'normal') =>
  `<text class="og-hide" x="${x}" y="${y}" fill="${color}" font-family="Arial,Helvetica,sans-serif" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}">${s}</text>`;
const f = v => (+v).toFixed(1);
const path = pts => pts.map((p, i) => `${i ? 'L' : 'M'}${f(p[0])} ${f(p[1])}`).join(' ');

// Parallel bank of links a + b z^4: common delay at total load T (Wardrop split).
function bank(links, T) {
  let lo = Math.min(...links.map(l => l[0])), hi = lo + 1;
  const load = c => links.reduce((s, [a, b]) => s + (c > a ? ((c - a) / b) ** 0.25 : 0), 0);
  while (load(hi) < T) hi *= 2;
  for (let k = 0; k < 200; k++) { const m = (lo + hi) / 2; if (load(m) < T) lo = m; else hi = m; }
  return (lo + hi) / 2;
}
const BF = [[2, 1], [8 / 3, 1 / 243]], BG = [[3 / 2, 1 / 162], [7 / 4, 1 / 4]];
const F = T => bank(BF, T), G = T => bank(BG, T);
// Equilibrium at demand scale t: connector flow x solves F(4t - x) = G(4t + x) + 1 + x^4 when the gap is positive.
function equilibrium(t) {
  const D = 4 * t, gap = x => F(D - x) - G(D + x) - 1 - x ** 4;
  let x = 0;
  if (gap(0) > 0) { let lo = 0, hi = 1; for (let k = 0; k < 200; k++) { const m = (lo + hi) / 2; if (gap(m) > 0) lo = m; else hi = m; } x = (lo + hi) / 2; }
  return { x, E: D * F(D - x) + D * G(D + x), A: F(D - x), B: G(D + x) };
}
// Total cost E = (A demand)(A's route cost) + (B demand)(B's route cost).
const totalCost = t => { const q = equilibrium(t); return 4 * t * q.A + 4 * t * q.B; };

function network() {
  let s = '';
  const S = [92, 132], U = [92, 312], V = [330, 222], r = 22;
  s += `<defs><marker id="wa" viewBox="0 0 10 10" refX="9" refY="5" markerUnits="userSpaceOnUse" markerWidth="13" markerHeight="13" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="${muted}"/></marker></defs>`;
  s += text(30, 52, 'Five links, quartic BPR costs', 19, ink, 'start', 'bold');
  s += text(30, 76, 'two parallel banks and one connector', 14, dim);
  const arc = (P, Q, bend, col, w) => {
    const mx = (P[0] + Q[0]) / 2, my = (P[1] + Q[1]) / 2, dx = Q[0] - P[0], dy = Q[1] - P[1], L = Math.hypot(dx, dy);
    const cx = mx - dy / L * bend, cy = my + dx / L * bend;
    const ux = (cx - P[0]), uy = (cy - P[1]), ul = Math.hypot(ux, uy), vx = (cx - Q[0]), vy = (cy - Q[1]), vl = Math.hypot(vx, vy);
    const P1 = [P[0] + ux / ul * (r + 2), P[1] + uy / ul * (r + 2)], Q1 = [Q[0] + vx / vl * (r + 6), Q[1] + vy / vl * (r + 6)];
    return { d: `<path d="M${f(P1[0])} ${f(P1[1])} Q${f(cx)} ${f(cy)} ${f(Q1[0])} ${f(Q1[1])}" fill="none" stroke="${col}" stroke-width="${w}" marker-end="url(#wa)"/>`, c: [(P[0] + 2 * cx + Q[0]) / 4, (P[1] + 2 * cy + Q[1]) / 4] };
  };
  const f0 = arc(S, V, -46, fc, 3), f2 = arc(S, V, 6, fc, 3), g1 = arc(U, V, -6, gc, 3), g3 = arc(U, V, 46, gc, 3);
  s += f0.d + f2.d + g1.d + g3.d;
  s += `<path d="M${S[0]} ${S[1] + r + 2} V${U[1] - r - 6}" stroke="${hc}" stroke-width="4" marker-end="url(#wa)"/>`;
  const node = (P, l) => `<circle cx="${P[0]}" cy="${P[1]}" r="${r}" fill="#1a1208" fill-opacity=".55" stroke="${ink}" stroke-width="2.2"/>` +
    `<text class="og-hide" x="${P[0]}" y="${P[1] + 7}" fill="${ink}" font-family="Georgia,serif" font-size="21" font-style="italic" text-anchor="middle">${l}</text>`;
  s += node(S, 's') + node(U, 'u') + node(V, 'v');
  s += text(f(f0.c[0] + 4), f(f0.c[1] - 22), 'bank F (direct)', 14, fc, 'middle', 'bold');
  s += text(f(g3.c[0] + 4), f(g3.c[1] + 34), 'bank G (shared)', 14, gc, 'middle', 'bold');
  s += text(S[0] + 12, (S[1] + U[1]) / 2 - 6, 'connector h', 14, hc, 'start', 'bold');
  s += text(S[0] + 12, (S[1] + U[1]) / 2 + 12, 'the new route', 12, hc, 'start');
  s += text(S[0] - 30, S[1] + 5, 'A', 17, ink, 'end', 'bold') + text(S[0] - 30, S[1] + 22, '4t', 13, dim, 'end');
  s += text(U[0] - 30, U[1] + 5, 'B', 17, ink, 'end', 'bold') + text(U[0] - 30, U[1] + 22, '4t', 13, dim, 'end');
  return s;
}

function delays() {
  let s = '';
  const X0 = 452, X1 = 700, Y0 = 318, Y1 = 112, T0 = 2.8, T1 = 5.2, D0 = 2.55, D1 = 3.75;
  const tx = T => X0 + (X1 - X0) * (T - T0) / (T1 - T0), dy = d => Y0 - (Y0 - Y1) * (d - D0) / (D1 - D0);
  s += text(418, 52, 'The banks’ delay curves touch', 19, ink, 'start', 'bold');
  s += text(418, 76, 'equal value, slope and curvature at T = 4', 14, dim);
  s += `<path d="M${X0} ${Y1 - 8} V${Y0} H${X1 + 6}" stroke="${muted}" stroke-width="1.3" fill="none"/>`;
  for (const T of [3, 4, 5]) s += `<path d="M${f(tx(T))} ${Y0} v6" stroke="${muted}"/>` + text(f(tx(T)), Y0 + 22, T, 13, dim, 'middle');
  s += text(X1 + 6, Y0 + 42, 'bank load T', 13, dim, 'end');
  s += text(X0 - 8, Y1 - 16, 'delay', 13, dim, 'start');
  const N = 120, pf = [], pg = [];
  for (let i = 0; i <= N; i++) { const T = T0 + (T1 - T0) * i / N; pf.push([tx(T), dy(F(T))]); pg.push([tx(T), dy(G(T) + 1)]); }
  s += `<path d="${path(pg)}" stroke="${gc}" stroke-width="5" fill="none" stroke-linecap="round" stroke-opacity=".9"/>`;
  s += `<path d="${path(pf)}" stroke="${fc}" stroke-width="2.4" fill="none" stroke-dasharray="7 5"/>`;
  s += `<circle cx="${f(tx(4))}" cy="${f(dy(3))}" r="6" fill="${hc}" stroke="#1a1208" stroke-width="2"/>`;
  s += text(X0 + 12, Y1 + 8, 'F(T): direct route', 13, fc, 'start', 'bold');
  s += text(X0 + 12, Y1 + 26, 'G(T) + 1: via connector', 13, gc, 'start', 'bold');
  s += text(f(tx(4) + 14), f(dy(3) + 34), 'gap ≈ (336/625)(t − 1)³', 13, hc, 'start', 'bold');
  s += text(f(tx(4) + 14), f(dy(3) + 51), 'third-order contact', 12, muted, 'start');
  return s;
}

function cost() {
  let s = '';
  const X0 = 800, X1 = 1168, Y0 = 330, Y1 = 116, t0 = 0.8, t1 = 1.3;
  const E0v = totalCost(t0), E1v = totalCost(t1);
  const tx = t => X0 + (X1 - X0) * (t - t0) / (t1 - t0), ey = e => Y0 - (Y0 - Y1) * (e - E0v) / (E1v - E0v) * 0.92;
  s += text(770, 52, 'Total travel time stays smooth', 19, ink, 'start', 'bold');
  s += text(770, 76, 'four continuous derivatives where the route opens', 14, dim);
  s += `<path d="M${X0} ${Y1 - 12} V${Y0} H${X1 + 6}" stroke="${muted}" stroke-width="1.3" fill="none"/>`;
  for (const t of [0.8, 1.0, 1.2]) s += `<path d="M${f(tx(t))} ${Y0} v6" stroke="${muted}"/>` + text(f(tx(t)), Y0 + 22, t.toFixed(1), 13, dim, 'middle');
  s += text(X1 + 6, Y0 + 42, 'demand scale t', 13, dim, 'end');
  s += text(X1, Y1 - 6, 'total cost E(t)', 13, dim, 'end');
  s += `<path d="M${f(tx(1))} ${Y1 - 6} V${Y0}" stroke="${hc}" stroke-opacity=".65" stroke-dasharray="5 5"/>`;
  const pe = []; for (let i = 0; i <= 100; i++) { const t = t0 + (t1 - t0) * i / 100; pe.push([tx(t), ey(totalCost(t))]); }
  s += `<path d="${path(pe)}" stroke="${ec}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
  s += `<circle cx="${f(tx(1))}" cy="${f(ey(totalCost(1)))}" r="6" fill="${hc}" stroke="#1a1208" stroke-width="2"/>`;
  s += text(f(tx(1) - 10), f(ey(totalCost(1)) - 14), 'no kink at t = 1', 14, hc, 'end', 'bold');
  // inset: connector flow, magnified
  const IX0 = 824, IX1 = 962, IY0 = 214, IY1 = 150, xm = equilibrium(t1).x;
  const ix = t => IX0 + (IX1 - IX0) * (t - t0) / (t1 - t0), iy = x => IY0 - (IY0 - IY1) * x / xm;
  s += `<rect x="${IX0 - 14}" y="${IY1 - 32}" width="${IX1 - IX0 + 26}" height="${IY0 - IY1 + 62}" rx="8" fill="#2a1d10" fill-opacity=".94" stroke="${hc}" stroke-opacity=".55"/>`;
  s += text(IX0 - 4, IY1 - 14, 'connector flow, magnified', 12, hc, 'start', 'bold');
  s += `<path d="M${IX0} ${IY1} V${IY0} H${IX1}" stroke="${muted}" stroke-width="1" fill="none"/>`;
  const px = []; for (let i = 0; i <= 100; i++) { const t = t0 + (t1 - t0) * i / 100; px.push([ix(t), iy(equilibrium(t).x)]); }
  s += `<path d="${path(px)}" stroke="${hc}" stroke-width="3" fill="none"/>`;
  s += `<path d="M${f(ix(1))} ${IY1} V${IY0}" stroke="${hc}" stroke-opacity=".5" stroke-dasharray="3 3"/>`;
  s += text(IX0 - 4, IY0 + 18, '≈ (84/125)(t − 1)³ after t = 1', 12, ink, 'start');
  return s;
}

const draw = () => network() + delays() + cost();
const description = 'Banner for smoothness within and across Wardrop route regimes. Left: the five-link example network. Commodity A travels from s to v and commodity B from u to v, each with demand 4t. Bank F has two parallel direct links from s to v with quartic BPR-type costs 2 + z^4 and 8/3 + z^4/243; bank G has two parallel shared links from u to v with costs 3/2 + z^4/162 and 7/4 + z^4/4; a connector h from s to u with cost 1 + z^4 gives A a new route. Middle: the delay F(T) of the direct bank and the delay G(T) + 1 of the route through the connector, plotted against bank load T from 2.8 to 5.2. The two curves agree in value, slope and curvature at T = 4, which is demand scale t = 1, so the route gap grows only like (336/625)(t − 1)^3. Right: equilibrium total travel time E(t) for t from 0.8 to 1.3 is a smooth curve with no visible kink at t = 1, where the connector route starts to be used. An inset magnifies the connector flow, which is zero before t = 1 and grows like (84/125)(t − 1)^3, reaching only a fraction of one per cent of A’s demand at t = 1.3. Total cost has four continuous derivatives at t = 1 and its fifth derivative jumps. Curves are computed from the Wardrop conditions; they are a numerical illustration of the paper’s proved statement.';

function frame(inner, background) {
  const [c0, c1] = background.colors, W = 1200, H = 400, accent = hc;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" data-banner-palette="${background.name}" role="img" aria-labelledby="art-description">
<desc id="art-description">${description}</desc><defs>
<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
<stop offset="0" stop-color="${c0}"/><stop offset="1" stop-color="${c1}"/>
</linearGradient>
<radialGradient id="glow" cx="0.78" cy="0.35" r="0.9">
<stop offset="0" stop-color="${accent}" stop-opacity="0.06"/><stop offset="1" stop-color="${accent}" stop-opacity="0"/>
</radialGradient>
</defs>
<rect width="${W}" height="${H}" fill="url(#bg)"/>
<rect width="${W}" height="${H}" fill="url(#glow)"/>
${inner}
</svg>`;
}

const thumbSpec = {
  kicker: ['RESEARCH RELEASE · 22 OCTOBER 2026', 'TRAFFIC EQUILIBRIUM · ROUTE CHANGES'],
  head: ['A new route opens.', '<em>The cost curve hides it.</em>'], headSize: 70,
  sub: 'Five road links with standard BPR costs: total travel time stays smooth as a new cheapest route switches on.',
  tag: 'UNREFEREED CANDIDATE',
  hero: '<div class="eq-label">five links · quartic BPR costs</div><div class="hero-title">no kink at t = 1</div><div class="note">delay curves touch to third order<br>new-route flow ≈ (84/125)(t − 1)³<br>total cost: 4 continuous derivatives</div><div class="eq-foot">written proofs · exact series checks</div>'
};

module.exports = { draw, description, thumbSpec, equilibrium, totalCost, F, G };

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
    : { title: 'Smoothness within and across Wardrop route regimes', status: 'unrefereed-candidate', datePublished: '2026-10-22' };
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
