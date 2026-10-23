'use strict';
const { bannerSvg } = require('./svg-xml');
// Tetrahedral moment Stokes elements: banner, OG card and thumbnail.
// Source: Theorem 2.1 of the paper. For fourth-order moments (face tests P_n, cell tests P_{n-1}) the kernel of the
// moment map on P_{n+2} is 7-dimensional for every n, so its rank is C(n+5,3) - 7 and the deficit against the
// N_n moments is c_n = (n-1)(n-2)/2; the map is surjective on P_{n+3}. Minimum degree: n+2 for n = 1, 2 and n+3
// for n >= 3. For n = 3: N_3 = 50, dim P_4 = 35 (injective), dim P_5 = 56, rank 49, c_3 = 1; the alternating face
// functional A vanishes on P_5 and A(Delta_4) = 1/34650 for the sextic Vandermonde bubble Delta_4 = prod(l_j - l_i).
// All counts below are the exact values of the theorem; the tetrahedron is a schematic.
//
// Usage: node tools/tetrahedral-stokes-art.js [--render OUTDIR_FOR_INSPECTION] [--no-mirror]
//   Writes assets/art/<slug>.svg; with --render also assets/og/<slug>.png, thumbs/<slug>.jpg,
//   the byte-identical central mirror ~/thumbs/<slug>.jpg and inspection PNGs (needs Playwright).
// Palette registries are NOT written here: record the rotated families in data/*_PALETTES.json.
const SLUG = 'tetrahedral-moment-stokes-elements';
const ink = '#f4f1ec', muted = '#d9cfc2', dim = '#c4b6cf';
const face = '#8fe3d0', cell = '#ffd36e', miss = '#ff8a70';
const SANS = 'Arial,Helvetica,sans-serif', SERIF = 'Georgia,serif';
const text = (x, y, s, size = 18, color = ink, anchor = 'start', weight = 'normal', family = SANS) =>
  `<text class="og-hide" x="${x}" y="${y}" fill="${color}" font-family="${family}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}">${s}</text>`;
const sub = s => `<tspan baseline-shift="sub" font-size="72%">${s}</tspan>`;
const P = s => `P${sub(s)}`;
const f = v => (+v).toFixed(1);

const choose3 = m => m * (m - 1) * (m - 2) / 6;
const deficit = n => (n - 1) * (n - 2) / 2;
// Exact counts for n = 3 (Theorem 2.1): N_3 moments, dimensions and ranks on each rung.
const N3 = 50, KER = 7;
const rungs = [
  { deg: 6, rel: 'n + 3', dim: choose3(9), rank: N3, note: `all ${N3} reached`, col: face },
  { deg: 5, rel: 'n + 2', dim: choose3(8), rank: choose3(8) - KER, note: `${choose3(8)} − ${KER} = ${choose3(8) - KER} of ${N3} · 1 missing`, col: miss },
  { deg: 4, rel: 'n + 1', dim: choose3(7), rank: choose3(7), note: `${choose3(7)} of ${N3} · injective: no hidden functions`, col: muted }
];
if (rungs[1].rank !== N3 - deficit(3) || rungs[2].dim !== 35 || rungs[1].dim !== 56) throw new Error('count mismatch');

function tetra() {
  let s = '';
  s += text(30, 52, 'Moments on a tetrahedron', 19, ink, 'start', 'bold');
  s += text(30, 76, 'degrees of freedom of the element', 14, dim);
  const A = [62, 326], B = [282, 350], C = [326, 222], D = [168, 112];
  const ln = (p, q, extra = '') => `<path d="M${p[0]} ${p[1]} L${q[0]} ${q[1]}" ${extra}/>`;
  // hidden faces / edges first
  s += `<path d="M${A} L${C} L${D} z" fill="${ink}" fill-opacity=".04"/>`;
  s += ln(A, C, `stroke="${muted}" stroke-width="1.6" stroke-dasharray="6 6" stroke-opacity=".7"`);
  // right face (unshaded) and front face (shaded: the face with its tests)
  s += `<path d="M${B} L${C} L${D} z" fill="${ink}" fill-opacity=".07"/>`;
  s += `<path d="M${A} L${B} L${D} z" fill="${face}" fill-opacity=".30" stroke="${face}" stroke-width="2.4" stroke-linejoin="round"/>`;
  // weighted quadrature-like marks on the shaded face (schematic of face tests)
  for (const [u, v] of [[.2, .2], [.55, .2], [.25, .5], [.2, .35], [.42, .38], [.65, .12], [.35, .2], [.12, .62]]) {
    const x = A[0] + u * (B[0] - A[0]) + v * (D[0] - A[0]), y = A[1] + u * (B[1] - A[1]) + v * (D[1] - A[1]);
    s += `<circle cx="${f(x)}" cy="${f(y)}" r="2.2" fill="${face}" fill-opacity=".85"/>`;
  }
  s += ln(B, C, `stroke="${ink}" stroke-width="2.2"`) + ln(C, D, `stroke="${ink}" stroke-width="2.2"`);
  s += ln(A, D, `stroke="${ink}" stroke-width="2.4"`) + ln(A, B, `stroke="${ink}" stroke-width="2.4"`) + ln(B, D, `stroke="${ink}" stroke-width="2.4"`);
  // interior point: cell moments
  const X = [204, 246];
  s += `<circle cx="${X[0]}" cy="${X[1]}" r="13" fill="${cell}" fill-opacity=".18"/>`;
  s += `<circle cx="${X[0]}" cy="${X[1]}" r="6.5" fill="${cell}" stroke="#291b35" stroke-width="1.6"/>`;
  // labels with leaders
  s += `<path d="M96 168 L132 268" stroke="${face}" stroke-width="1.4"/><circle cx="132" cy="268" r="3" fill="${face}"/>`;
  s += text(30, 130, 'face tests', 16, face, 'start', 'bold');
  s += text(30, 150, `⨍${sub('F')} v·q, q ∈ ${P('n')}`, 15, face, 'start', 'normal', SERIF);
  s += `<path d="M262 160 L209 240" stroke="${cell}" stroke-width="1.4"/>`;
  s += text(232, 130, 'cell tests', 16, cell, 'start', 'bold');
  s += text(232, 150, `q ∈ ${P('n−1')} inside`, 15, cell, 'start', 'normal', SERIF);
  s += text(30, 384, 'fourth order: n = 3 gives N = 50 moments', 13, dim);
  return s;
}

function ladder() {
  let s = '';
  const X0 = 400;
  s += text(X0, 52, 'Degree ladder for n = 3', 19, ink, 'start', 'bold');
  s += text(X0, 76, 'which polynomial space reaches all 50 moments?', 14, dim);
  const RX = 410, BX = 530, PITCH = 10, CELLW = 8, top = [106, 186, 266];
  s += `<defs><marker id="up" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="10" markerHeight="10" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="${muted}"/></marker></defs>`;
  s += `<path d="M${RX} 326 V${top[0] - 6}" stroke="${muted}" stroke-width="1.6" marker-end="url(#up)"/>`;
  s += text(RX + 8, 344, 'degree ↑', 12, dim, 'middle');
  rungs.forEach((r, k) => {
    const y = top[k];
    s += `<path d="M${RX} ${y + 9} H${RX + 16}" stroke="${muted}" stroke-width="1.6"/>`;
    s += text(RX + 22, y + 18, P(r.deg), 26, ink, 'start', 'bold', SERIF);
    s += text(RX + 64, y + 16, '= ' + P(r.rel.replace(/ /g, '')), 14, dim, 'start', 'normal', SERIF);
    for (let i = 0; i < N3; i++) {
      const cx = BX + (i % 25) * PITCH, cy = y + Math.floor(i / 25) * PITCH;
      const reached = i < r.rank, missing = !reached && r.col === miss;
      const fill = reached ? (r.col === miss ? ink : r.col) : (missing ? miss : 'none');
      const op = reached ? (k === 0 ? '.95' : k === 1 ? '.85' : '.7') : '1';
      s += `<rect x="${cx}" y="${cy}" width="${CELLW}" height="${CELLW}" rx="1.5" fill="${fill}" fill-opacity="${op}"${reached || missing ? '' : ` stroke="${dim}" stroke-opacity=".55"`}/>`;
      if (missing) s += `<circle cx="${cx + CELLW / 2}" cy="${cy + CELLW / 2}" r="9.5" fill="none" stroke="${miss}" stroke-width="2"/>`;
    }
    s += text(BX, y + 40, r.note, 13, r.col === muted ? muted : r.col, 'start', 'bold');
  });
  s += text(BX, 344, `kernel on ${P('n+2')} is 7-dimensional for every n`, 13, dim);
  s += text(BX, 364, `rank on ${P('n+2')} = C(n + 5, 3) − 7`, 13, dim);
  return s;
}

function deficitStrip() {
  let s = '';
  const X0 = 830;
  s += text(X0, 52, 'Degree n + 2 falls short', 19, ink, 'start', 'bold');
  s += text(X0, 76, `missing directions on ${P('n+2')}: (n − 1)(n − 2)/2`, 14, dim, 'start', 'normal');
  const col = n => 912 + (n - 1) * 50, base = 160, DP = 10;
  s += text(X0, 186, 'n', 14, dim, 'start', 'bold') + text(X0, 208, 'missing', 13, dim);
  for (let n = 1; n <= 6; n++) {
    const c = deficit(n), cx = col(n), rows = n - 2;
    if (c === 0) s += text(cx, base + 2, '✓', 22, face, 'middle', 'bold');
    for (let r = 0; r < rows; r++) {
      const m = rows - r; // dots in this row, from the base upward
      for (let j = 0; j < m; j++) s += `<circle cx="${f(cx + (j - (m - 1) / 2) * DP)}" cy="${base - r * DP}" r="3.8" fill="${miss}"${n === 3 ? ` stroke="${ink}" stroke-width="1.4"` : ''}/>`;
    }
    s += text(cx, 186, n, 15, ink, 'middle');
    s += text(cx, 208, c, 16, c ? miss : face, 'middle', 'bold');
  }
  s += `<path d="M${col(1) - 16} 222 V228 H${col(2) + 16} V222" stroke="${face}" stroke-width="1.6" fill="none"/>`;
  s += text((col(1) + col(2)) / 2, 245, 'n + 2 suffices', 12, face, 'middle', 'bold');
  s += `<path d="M${col(3) - 16} 222 V228 H${col(6) + 16} V222" stroke="${miss}" stroke-width="1.6" fill="none"/>`;
  s += text((col(3) + col(6)) / 2, 245, `needs n + 3 (${P('n+3')} works)`, 12, miss, 'middle', 'bold');
  // callout: the repair for n = 3
  s += `<rect x="${X0}" y="262" width="340" height="122" rx="10" fill="#1c1226" fill-opacity=".72" stroke="${miss}" stroke-opacity=".7"/>`;
  s += text(X0 + 16, 287, 'the fix for n = 3: one sextic bubble', 14, miss, 'start', 'bold');
  s += text(X0 + 16, 322, `Δ${sub('4')} = ∏ (λ${sub('j')} − λ${sub('i')})`, 24, ink, 'start', 'normal', SERIF);
  s += text(X0 + 16, 350, `A(Δ${sub('4')}) = 1/34650 ≠ 0`, 15, ink, 'start', 'bold');
  s += text(X0 + 16, 371, 'A = 0 on all quintics · in 2D: never missing', 12.5, muted);
  return s;
}

const draw = () => tetra() + ladder() + deficitStrip();
const description = 'Banner for a moment obstruction and minimal-degree polynomial nonconforming Stokes elements on tetrahedra. Left: a tetrahedron drawn in perspective with one face shaded; its degrees of freedom are face moments, averages over each face F of v times q for every test polynomial q of degree n, and cell moments against polynomials of degree n − 1 at an interior point. For fourth order, n = 3, there are N = 50 moments. Middle: a degree ladder for n = 3. Each rung shows 50 squares, one per moment. On P4 = P(n+1), of dimension 35, the moments are injective, so 35 of the 50 directions are reached and no nonzero polynomial is hidden. On P5 = P(n+2), of dimension 56, the moments have a 7-dimensional kernel, so their rank is 56 − 7 = 49 and exactly one of the 50 directions is missing, marked in a warm colour. On P6 = P(n+3) all 50 directions are reached. Below: the kernel on P(n+2) is 7-dimensional for every n, so the rank is C(n + 5, 3) − 7. Right: the number of directions missed by degree n + 2 for n = 1 to 6 is (n − 1)(n − 2)/2, namely 0, 0, 1, 3, 6 and 10, drawn as triangular arrays of dots, so degree n + 2 suffices only for n = 1 and 2 while degree n + 3 always succeeds. A callout shows the repair for n = 3: one sextic bubble, the Vandermonde product Delta4 = product of (lambda j − lambda i) over the barycentric coordinates, whose alternating face functional A(Delta4) = 1/34650 is nonzero, while A vanishes on all quintics. In two dimensions the corresponding count is never deficient. The counts are the exact values of the paper’s Theorem 2.1 and proposition; the tetrahedron is a schematic.';

function frame(inner, background) {
  return bannerSvg({ inner, description, background, glow: { color: face, cx: '0.2', cy: '0.6', r: '0.8', opacity: '0.07' } });
}

const thumbSpec = {
  kicker: ['RESEARCH RELEASE · 22 OCTOBER 2026', 'FINITE ELEMENTS · STOKES FLOW'],
  head: ['No quintic element works.', '<em>One sextic fixes it.</em>'], headSize: 70,
  sub: 'Fourth-order moment elements on tetrahedra need degree n&nbsp;+&nbsp;3: degree n&nbsp;+&nbsp;2 misses exactly (n − 1)(n − 2)/2 directions.',
  tag: 'UNREFEREED CANDIDATE',
  hero: '<div class="eq-label">n = 3 · 50 moments</div><div class="hero-title">49 of 50 on P₅</div><div class="note">kernel: 7 ridges for every n<br>repair: Δ₄ = ∏(λ<sub>j</sub> − λ<sub>i</sub>)<br>A(Δ₄) = 1/34650</div><div class="eq-foot">written proofs · exact rational checks</div>'
};

module.exports = { draw, description, thumbSpec, deficit, rungs };

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
    : { title: 'A moment obstruction and minimal-degree polynomial nonconforming Stokes elements on tetrahedra', status: 'unrefereed-candidate', datePublished: '2026-10-22' };
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
