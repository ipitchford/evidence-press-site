'use strict';
// Backtracking-weighted PageRank is not coordinatewise monotone: banner, OG card and thumbnail.
// Sources (paper: Backtracking-weighted PageRank is not coordinatewise monotone, 23 Oct 2026):
//  - House graph, edges E = {01, 03, 04, 12, 14, 23}; vertices 0, 1 degree three; 2, 3 and the roof 4 degree two
//    (eq. houseedges, Figure fig:small labelling).
//  - Three-number certificate (eq. shortcertificate), uniform restart, damping eps = 1/2:
//    pi_0(4) = 638/3615, pi_1(4) = 22/125, pi_inf(4) = 8/45; both endpoints strictly above the middle value.
//  - Theorem thm:response at eps = 1/2: pi_mu(4) = 2(12mu^3+115mu^2+346mu+319) / [15(9mu^3+87mu^2+263mu+241)].
//    The curve below is this exact closed form (no fitted or invented data).
//  - Theorem thm:threshold: for eps > eps_c ~ 0.2407 one strict minimum; it lies above mu = 1 because eps = 1/2 > 4/9.
//  - The "monotone guess" is schematic: it only illustrates that a monotone response through pi_1 rising to
//    pi_inf would force pi_0 below pi_1 (the endpoint shortcut of Proposition prop:shortcut).
//
// Usage: node tools/pagerank-backtracking-art.js [--render OUTDIR_FOR_INSPECTION] [--no-mirror]
//   Writes assets/art/<slug>.svg; with --render also assets/og/<slug>.png, thumbs/<slug>.jpg,
//   the byte-identical central mirror ~/thumbs/<slug>.jpg (never overwritten) and inspection PNGs.
// Palette registries are NOT written here: the saved assignments in data/*_PALETTES.json are used.
const SLUG = 'pagerank-backtracking-nonmonotone';
const ink = '#effaf4', muted = '#d2e7dd', dim = '#b9d3c7';
const roof = '#86f0b6', ref = '#ffd27a', guess = '#ffa3a3';
const SANS = 'Arial,Helvetica,sans-serif', SERIF = 'Georgia,serif';
const text = (x, y, s, size = 18, color = ink, anchor = 'start', weight = 'normal', family = SANS) =>
  `<text class="og-hide" x="${x}" y="${y}" fill="${color}" font-family="${family}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}">${s}</text>`;
const sub = s => `<tspan baseline-shift="sub" font-size="72%">${s}</tspan>`;
const f = v => (+v).toFixed(1);

// Exact roof response at eps = 1/2 (Theorem thm:response).
const roofScore = mu => 2 * (12 * mu ** 3 + 115 * mu ** 2 + 346 * mu + 319) / (15 * (9 * mu ** 3 + 87 * mu ** 2 + 263 * mu + 241));
const PI0 = 638 / 3615, PI1 = 22 / 125, PIINF = 8 / 45;

// Plot frame: horizontal u = mu/(1+mu) in [0, 1]; vertical delta = 1e4 (pi - pi_1) in [-6, 19].
const X0 = 440, X1 = 1100, Y0 = 318, YT = 112, DMIN = -6, DMAX = 19;
const px = u => X0 + u * (X1 - X0);
const py = d => Y0 - (d - DMIN) * (Y0 - YT) / (DMAX - DMIN);
const yOf = p => py(1e4 * (p - PI1));

function house() {
  const V = { 4: [190, 140], 0: [110, 215], 1: [270, 215], 3: [110, 318], 2: [270, 318] };
  const E = [[0, 1], [0, 3], [0, 4], [1, 2], [1, 4], [2, 3]];
  let s = '';
  for (const [a, b] of E) {
    const toRoof = a === 4 || b === 4;
    s += `<path d="M${V[a][0]} ${V[a][1]} L${V[b][0]} ${V[b][1]}" stroke="${toRoof ? roof : muted}" stroke-opacity="${toRoof ? 0.75 : 0.45}" stroke-width="${toRoof ? 4 : 3.5}" stroke-linecap="round"/>`;
  }
  s += `<circle cx="${V[4][0]}" cy="${V[4][1]}" r="34" fill="${roof}" fill-opacity=".14"/>`;
  for (const [v, [x, y]] of Object.entries(V)) {
    const r = v === '4';
    s += `<circle cx="${x}" cy="${y}" r="${r ? 22 : 19}" fill="${r ? roof : '#1d4148'}" stroke="${r ? '#0f2b30' : muted}" stroke-opacity="${r ? 1 : 0.7}" stroke-width="2.5"/>`;
    s += text(x, y + 7, v, r ? 21 : 19, r ? '#0f2b30' : ink, 'middle', 'bold');
  }
  s += text(228, 124, 'roof vertex 4', 17, roof, 'start', 'bold');
  s += text(190, 362, 'house graph · damping ε = ½', 16, muted, 'middle');
  s += text(190, 382, 'uniform restart', 14, dim, 'middle');
  return s;
}

function response() {
  let s = '';
  // axes and the ordinary-PageRank level
  s += `<path d="M${X0} ${YT - 6} V${Y0}" stroke="${muted}" stroke-opacity=".35" stroke-width="1.5"/>`;
  s += `<path d="M${X0} ${Y0} H${X1}" stroke="${muted}" stroke-opacity=".35" stroke-width="1.5"/>`;
  s += `<path d="M${px(0.5)} ${YT - 6} V${Y0}" stroke="${ref}" stroke-opacity=".3" stroke-dasharray="2 5" stroke-width="1.5"/>`;
  s += `<path d="M${X0} ${f(py(0))} H${X1}" stroke="${ref}" stroke-opacity=".75" stroke-dasharray="7 6" stroke-width="2"/>`;
  s += `<text class="og-hide" x="${X0 + 8}" y="${YT + 6}" fill="${dim}" font-family="${SANS}" font-size="14" text-anchor="start">roof score π${sub('μ')}(4) ↑</text>`;
  // the band where a monotone response would have to put pi_0, and the schematic monotone guess
  s += `<rect x="${X0}" y="${f(py(0))}" width="${px(0.5) - X0}" height="${f(Y0 - py(0))}" fill="${guess}" fill-opacity=".09"/>`;
  const g0 = py(-4.87);
  s += `<path d="M${X0} ${f(g0)} C${X0 + 200} ${f(g0)} ${px(0.5) - 50} ${f(py(-1.6))} ${px(0.5)} ${f(py(0))}" stroke="${guess}" stroke-width="2.5" stroke-dasharray="8 6" fill="none"/>`;
  s += `<circle cx="${X0}" cy="${f(g0)}" r="6.5" fill="#173a40" stroke="${guess}" stroke-width="2.5"/>`;
  s += text(X0 + 14, f(py(-1.85)), 'monotone guess (schematic)', 14, guess);
  // exact curve
  const pts = [];
  for (let i = 0; i <= 400; i++) {
    const u = i / 400 * 0.999;
    const mu = u / (1 - u);
    pts.push(`${f(px(u))} ${f(yOf(roofScore(mu)))}`);
  }
  pts.push(`${f(px(1))} ${f(yOf(PIINF))}`);
  s += `<path d="M${pts.join(' L')}" stroke="${roof}" stroke-width="4.5" fill="none" stroke-linejoin="round" stroke-linecap="round"/>`;
  // minimum (Theorem thm:threshold: unique, above mu = 1 since 1/2 > 4/9)
  let best = [1, roofScore(1)];
  for (let mu = 1; mu <= 3; mu += 0.001) { const v = roofScore(mu); if (v < best[1]) best = [mu, v]; }
  const um = best[0] / (1 + best[0]);
  s += `<circle cx="${f(px(um))}" cy="${f(yOf(best[1]))}" r="4.5" fill="${roof}"/>`;
  s += text(f(px(um) + 12), f(py(-2.4)), 'lowest point: just past μ = 1', 13.5, dim);
  // the three exact values
  s += `<circle cx="${px(0)}" cy="${f(yOf(PI0))}" r="8" fill="${roof}" stroke="#0f2b30" stroke-width="2"/>`;
  s += text(X0 + 16, f(yOf(PI0) - 10), 'π₀(4) = 638/3615', 19, roof, 'start', 'bold');
  s += `<circle cx="${px(0.5)}" cy="${f(yOf(PI1))}" r="8" fill="${ref}" stroke="#0f2b30" stroke-width="2"/>`;
  s += text(px(0.5), f(yOf(PI1) - 18), 'π₁(4) = 22/125', 19, ref, 'middle', 'bold');
  s += `<circle cx="${px(1)}" cy="${f(yOf(PIINF))}" r="8" fill="${roof}" stroke="#0f2b30" stroke-width="2"/>`;
  s += text(px(1) - 16, f(yOf(PIINF) - 4), 'π∞(4) = 8/45', 19, roof, 'end', 'bold');
  // axis landmarks
  for (const [u, a, b, anchor] of [[0, 'μ = 0', 'non-backtracking', 'start'], [0.5, 'μ = 1', 'ordinary PageRank', 'middle'], [1, 'μ → ∞', 'always backtrack', 'end']]) {
    s += `<path d="M${px(u)} ${Y0} V${Y0 + 6}" stroke="${muted}" stroke-opacity=".6" stroke-width="2"/>`;
    s += text(px(u), Y0 + 24, a, 16, ink, anchor, 'bold');
    s += text(px(u), Y0 + 43, b, 15, muted, anchor);
  }
  s += text(X1, 392, 'exact curve from the paper’s formula · horizontal axis μ/(1+μ) · vertical scale magnified: the three values differ by less than 0.002', 12.5, dim, 'end');
  return s;
}

const draw = () => text(40, 50, 'More backtracking can lower a score, then raise it again', 27, ink, 'start', 'normal', SERIF) +
  text(40, 80, 'Backtracking-weighted PageRank of the house roof against the return weight μ: both extremes beat ordinary PageRank', 16.5, muted) +
  house() + response();

const description = 'Banner for a paper showing that backtracking-weighted PageRank is not coordinatewise monotone in the return weight mu. Left: the five-vertex house graph, a square on vertices 0, 1, 2, 3 with a triangular roof; the roof vertex 4, joined to vertices 0 and 1, is highlighted. Right: the exact roof score pi_mu(4) at damping 1/2 with uniform restart, from the paper’s closed-form cubic response, plotted against mu on a compressed axis mu/(1+mu) so that mu = 0 (non-backtracking), mu = 1 (ordinary PageRank) and mu tending to infinity (always backtrack) all fit. The score starts at pi_0(4) = 638/3615, falls to the ordinary PageRank value pi_1(4) = 22/125, reaches its single lowest point just past mu = 1, and rises towards pi_infinity(4) = 8/45. Both endpoints lie above the middle value, so the score is not monotone. A dashed schematic curve, labelled as such, shows that a monotone response through pi_1 rising to pi_infinity would have put pi_0 below pi_1, in a shaded band; the true value lies above. The vertical scale is magnified: the three values differ by less than 0.002.';

function frame(inner, background) {
  const [c0, c1] = background.colors, W = 1200, H = 400, accent = roof;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" data-banner-palette="${background.name}" role="img" aria-labelledby="art-description">
<desc id="art-description">${description}</desc><defs>
<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
<stop offset="0" stop-color="${c0}"/><stop offset="1" stop-color="${c1}"/>
</linearGradient>
<radialGradient id="glow" cx="0.2" cy="0.55" r="0.5">
<stop offset="0" stop-color="${accent}" stop-opacity="0.07"/><stop offset="1" stop-color="${accent}" stop-opacity="0"/>
</radialGradient>
</defs>
<rect width="${W}" height="${H}" fill="url(#bg)"/>
<rect width="${W}" height="${H}" fill="url(#glow)"/>
${inner}
</svg>`;
}

const thumbSpec = {
  kicker: ['RESEARCH RELEASE · OCTOBER 2026', 'NETWORK CENTRALITY · COUNTEREXAMPLE'],
  head: ['More backtracking.', '<em>Down, then up.</em>'], headSize: 72,
  sub: 'On a five-vertex house graph, the roof’s backtracking-weighted PageRank is not monotone in the return weight: both extremes beat ordinary PageRank.',
  tag: 'UNREFEREED CANDIDATE',
  hero: '<div class="eq-label">house graph · roof 4 · ε = ½</div><div class="hero-title">π₀ &gt; π₁ &lt; π∞</div><div class="note">π₀ = 638/3615 · never backtrack<br>π₁ = 22/125 · <b>ordinary PageRank</b><br>π∞ = 8/45 · always backtrack</div><div class="eq-foot">exact rational certificate · written proofs</div>'
};

module.exports = { draw, description, thumbSpec, roofScore, PI0, PI1, PIINF };
if (require.main === module) (async () => {
  const fs = require('fs'), pth = require('path'), os = require('os'), vm = require('vm');
  const ROOT = pth.join(__dirname, '..');
  // Guard: the plotted closed form must reproduce the certificate exactly at the three anchor values.
  for (const [got, want] of [[roofScore(0), PI0], [roofScore(1), PI1], [roofScore(1e9), PIINF]])
    if (Math.abs(got - want) > 1e-8) throw new Error('roof response does not match certificate');
  const { palettes } = require('./banner-palettes');
  const reg = JSON.parse(fs.readFileSync(pth.join(ROOT, 'data/BANNER_PALETTES.json'), 'utf8'));
  const bsaved = reg.assignments.find(r => r.slug === SLUG); if (!bsaved) throw new Error('no saved banner palette'); const bname = bsaved.palette;
  const tp = require('./thumbnail-palettes');
  const treg = tp.load();
  const tsaved = treg.assignments.find(r => r.slug === SLUG); if (!tsaved) throw new Error('no saved thumbnail palette');
  const tname = tsaved.editorialPalette || tsaved.palette;
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
    : { title: 'Backtracking-weighted PageRank is not coordinatewise monotone: minimal counterexamples, a certified census and endpoint tests', status: 'unrefereed-candidate', datePublished: '2026-10-22' };
  console.log('og meta from', fs.existsSync(metaPath) ? metaPath : 'built-in fallback');
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
