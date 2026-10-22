'use strict';
// Lotka–Volterra tree presentations: banner, OG card and thumbnail.
// Source: Example 1.1 of the paper (the path 1–2–3 with a_j = 0, b_{2->1} = 1, b_{1->2} = 2, b_{3->2} = 3,
// b_{2->3} = 4): x1' = x1(2x2 + 4x3), x2' = x2(x1 + 4x3), x3' = x3(x1 + 3x2). Its linear Darboux
// polynomials are x1, x2, x3, Q12 = x1 - 2x2 and Q23 = 3x2 - 4x3 (Theorem 2.3: exactly 2n - 1 = 5).
// Centre: the positive orthant seen projectively (chart x1 + x2 + x3 = 1). The five invariant planes
// appear as the three sides and the two exact lines x1 = 2x2 and 3x2 = 4x3. The grey orbits are
// computed here by RK4 for the projected flow p' = f(p) - p (f1 + f2 + f3) of the stated system
// (an illustration of invariance, not evidence).
// Right: the cone over the tree (vertex 0 joined to 1, 2, 3): spokes 0v = rays x_v, tree edges = rays Q.
// Coordinate presentations are spanning trees of the cone (Theorem 4.2; 8 for P3, q(P3) = 2).
// Presentation {x1, x2, x3}: extra supports {1,2}, {2,3} (a tree). Presentation {x1, Q12, Q23}
// (Example 1.1): extra supports {1,2} (x2) and {1,2,3} (x3), a hypergraph.
//
// Usage: node tools/lv-tree-art.js [--render OUTDIR_FOR_INSPECTION] [--no-mirror]
//   Writes assets/art/<slug>.svg; with --render also assets/og/<slug>.png, thumbs/<slug>.jpg,
//   the byte-identical central mirror ~/thumbs/<slug>.jpg and inspection PNGs (needs Playwright).
// Palette registries are NOT written here: record the rotated families in data/*_PALETTES.json.
const SLUG = 'lotka-volterra-tree-presentations';
const ink = '#f5f0f7', muted = '#dccfe2', dim = '#c0b0c8';
const xc = '#9fd0ff', q1c = '#ffc184', q2c = '#a9ebd3', orbit = '#c9b8d4';
const text = (x, y, s, size = 18, color = ink, anchor = 'start', weight = 'normal', extra = '') =>
  `<text class="og-hide" x="${x}" y="${y}" fill="${color}" font-family="${(extra.match(/font-family="([^"]*)"/) || [, 'Arial,Helvetica,sans-serif'])[1]}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}"${extra.replace(/\s*font-family="[^"]*"/, '')}>${s}</text>`;
const f = v => (+v).toFixed(1);
const path = pts => pts.map((p, i) => `${i ? 'L' : 'M'}${f(p[0])} ${f(p[1])}`).join(' ');
const sub = (base, idx) => `${base}<tspan font-size="0.72em" dy="4">${idx}</tspan><tspan dy="-4"> </tspan>`;

// The vector field of Example 1.1.
const field = ([x1, x2, x3]) => [x1 * (2 * x2 + 4 * x3), x2 * (x1 + 4 * x3), x3 * (x1 + 3 * x2)];
const Q12 = p => p[0] - 2 * p[1], Q23 = p => 3 * p[1] - 4 * p[2];
function projected(p) { const v = field(p), s = v[0] + v[1] + v[2]; return v.map((vi, i) => vi - p[i] * s); }
function orbitFrom(p0, dt, steps) {
  const out = [p0]; let p = p0.slice();
  for (let k = 0; k < steps; k++) {
    const add = (a, b, h) => a.map((ai, i) => ai + h * b[i]);
    const k1 = projected(p), k2 = projected(add(p, k1, dt / 2)), k3 = projected(add(p, k2, dt / 2)), k4 = projected(add(p, k3, dt));
    p = p.map((pi, i) => pi + dt / 6 * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]));
    out.push(p.slice());
  }
  return out;
}

function leftPanel() {
  let s = '';
  s += text(34, 50, 'One equation on the path 1 – 2 – 3', 19, ink, 'start', 'bold');
  s += text(34, 72, 'a Lotka–Volterra tree system', 14, dim);
  const N = [[70, 122], [160, 122], [250, 122]];
  s += `<path d="M${N[0][0]} ${N[0][1]} H${N[1][0]}" stroke="${q1c}" stroke-width="4"/>`;
  s += `<path d="M${N[1][0]} ${N[1][1]} H${N[2][0]}" stroke="${q2c}" stroke-width="4"/>`;
  N.forEach((P, i) => {
    s += `<circle cx="${P[0]}" cy="${P[1]}" r="17" fill="#1b1022" stroke="${xc}" stroke-width="2.4"/>`;
    s += text(P[0], P[1] + 6, i + 1, 17, ink, 'middle', 'bold');
  });
  const eqs = [['1', '2' + 'x₂ + 4x₃'], ['2', 'x₁ + 4x₃'], ['3', 'x₁ + 3x₂']];
  const sx = ['x₁', 'x₂', 'x₃'];
  eqs.forEach(([i, r], k) => { s += text(44, 184 + 26 * k, `${sx[k]}′ = ${sx[k]}(${r.replace(/^2x₂/, '2x₂')})`, 17, ink, 'start', 'normal', ' font-family="Georgia,serif"'); });
  s += text(34, 278, 'invariant planes:', 14, dim);
  s += text(34, 300, 'x₁, x₂, x₃  (coordinates)', 15, xc, 'start', 'bold');
  s += text(34, 322, 'Q₁₂ = x₁ − 2x₂  (edge 1–2)', 15, q1c, 'start', 'bold');
  s += text(34, 344, 'Q₂₃ = 3x₂ − 4x₃  (edge 2–3)', 15, q2c, 'start', 'bold');
  s += text(34, 372, 'n + (n − 1) = 2n − 1 = 5, exactly', 15, ink, 'start', 'bold');
  return s;
}

function centrePanel() {
  let s = '';
  s += text(486, 50, 'Five invariant planes', 19, ink, 'middle', 'bold');
  s += text(486, 72, 'positive orthant seen projectively', 14, dim, 'middle');
  const V1 = [336, 352], V2 = [636, 352], V3 = [486, 92];
  const P = p => { const t = p[0] + p[1] + p[2]; return [(p[0] * V1[0] + p[1] * V2[0] + p[2] * V3[0]) / t, (p[0] * V1[1] + p[1] * V2[1] + p[2] * V3[1]) / t]; };
  s += `<path d="M${V1[0]} ${V1[1]} L${V2[0]} ${V2[1]} L${V3[0]} ${V3[1]} Z" fill="#1b1022" fill-opacity=".35" stroke="${xc}" stroke-width="3" stroke-linejoin="round"/>`;
  // orbits of the projected flow, forward and backward from seeds in each of the four regions
  const seeds = [[0.6, 0.15, 0.25], [0.3, 0.55, 0.15], [0.15, 0.2, 0.65], [0.7, 0.25, 0.05], [0.35, 0.3, 0.35], [0.12, 0.6, 0.28], [0.5, 0.42, 0.08], [0.45, 0.08, 0.47]];
  for (const q of seeds) {
    const fw = orbitFrom(q, 0.02, 900), bw = orbitFrom(q, -0.02, 900);
    const pts = bw.reverse().concat(fw.slice(1)).filter(p => p.every(c => c > -1e-9));
    s += `<path d="${path(pts.map(P))}" fill="none" stroke="${orbit}" stroke-opacity=".55" stroke-width="1.3"/>`;
  }
  // exact extra invariant lines
  const a1 = P([0, 0, 1]), a2 = P([2, 1, 0]); // Q12 = 0
  const b1 = P([1, 0, 0]), b2 = P([0, 4, 3]); // Q23 = 0
  s += `<path d="M${f(a1[0])} ${f(a1[1])} L${f(a2[0])} ${f(a2[1])}" stroke="${q1c}" stroke-width="3.4"/>`;
  s += `<path d="M${f(b1[0])} ${f(b1[1])} L${f(b2[0])} ${f(b2[1])}" stroke="${q2c}" stroke-width="3.4"/>`;
  const m = P([8, 4, 3]);
  s += `<circle cx="${f(m[0])}" cy="${f(m[1])}" r="4" fill="${ink}"/>`;
  s += text(f(a2[0]), V1[1] + 22, 'Q₁₂ = 0', 14, q1c, 'middle', 'bold');
  s += text(f(b2[0] + 10), f(b2[1] - 2), 'Q₂₃ = 0', 14, q2c, 'start', 'bold');
  s += text(f(V1[0] + 40), V1[1] + 22, 'x₃ = 0', 13, xc, 'middle');
  s += text(f((V1[0] + V3[0]) / 2 - 12), f((V1[1] + V3[1]) / 2), 'x₂ = 0', 13, xc, 'end');
  const r1 = P([0, 1, 3]); s += text(f(r1[0] + 12), f(r1[1]), 'x₁ = 0', 13, xc, 'start');
  s += text(486, 392, 'grey: computed orbits; none crosses a line', 12, dim, 'middle');
  return s;
}

function rightPanel() {
  let s = '';
  s += text(946, 50, 'Choose any 3 planes as coordinates', 19, ink, 'middle', 'bold');
  s += text(946, 72, '8 choices = spanning trees of the cone over the tree', 14, dim, 'middle');
  const cone = (cx, chosen, title1, title2) => {
    let c = '';
    const O = [cx, 108], A = [[cx - 66, 186], [cx, 186], [cx + 66, 186]];
    const edges = [['x1', O, A[0], xc], ['x2', O, A[1], xc], ['x3', O, A[2], xc], ['Q12', A[0], A[1], q1c], ['Q23', A[1], A[2], q2c]];
    for (const [id, p, q, col] of edges) {
      const on = chosen.includes(id);
      c += `<path d="M${p[0]} ${p[1]} L${q[0]} ${q[1]}" stroke="${col}" stroke-width="${on ? 4.2 : 1.8}" ${on ? '' : 'stroke-dasharray="5 4" stroke-opacity=".75"'}/>`;
    }
    c += `<circle cx="${O[0]}" cy="${O[1]}" r="11" fill="#1b1022" stroke="${muted}" stroke-width="1.8"/>` + text(O[0], O[1] + 5, '0', 13, muted, 'middle', 'bold');
    A.forEach((P, i) => { c += `<circle cx="${P[0]}" cy="${P[1]}" r="11" fill="#1b1022" stroke="${muted}" stroke-width="1.8"/>` + text(P[0], P[1] + 5, i + 1, 13, ink, 'middle', 'bold'); });
    c += text(cx, 220, title1, 14, ink, 'middle', 'bold');
    c += text(cx, 238, title2, 12, dim, 'middle');
    return c;
  };
  s += cone(832, ['x1', 'x2', 'x3'], 'coordinates x₁, x₂, x₃', 'solid = chosen');
  s += cone(1060, ['x1', 'Q12', 'Q23'], 'coordinates x₁, Q₁₂, Q₂₃', 'dashed = remaining planes');
  // resulting support pictures
  const Y = 300;
  // tree picture
  const L = [[772, Y], [832, Y], [892, Y]];
  s += `<path d="M${L[0][0]} ${Y} H${L[1][0]}" stroke="${q1c}" stroke-width="4"/><path d="M${L[1][0]} ${Y} H${L[2][0]}" stroke="${q2c}" stroke-width="4"/>`;
  L.forEach((P, i) => { s += `<circle cx="${P[0]}" cy="${Y}" r="12" fill="#1b1022" stroke="${xc}" stroke-width="2.2"/>` + text(P[0], Y + 5, i + 1, 13, ink, 'middle', 'bold'); });
  s += text(832, Y + 46, 'supports {1,2}, {2,3}: a tree', 13, ink, 'middle');
  // hypergraph picture
  const H = [[1000, Y], [1060, Y], [1120, Y]];
  s += `<rect x="${H[0][0] - 28}" y="${Y - 26}" width="${H[2][0] - H[0][0] + 56}" height="52" rx="26" fill="${xc}" fill-opacity=".10" stroke="${xc}" stroke-width="2"/>`;
  s += `<rect x="${H[0][0] - 20}" y="${Y - 18}" width="${H[1][0] - H[0][0] + 40}" height="36" rx="18" fill="${xc}" fill-opacity=".14" stroke="${xc}" stroke-width="2" stroke-dasharray="5 3"/>`;
  H.forEach((P, i) => { s += `<circle cx="${P[0]}" cy="${Y}" r="12" fill="#1b1022" stroke="${i ? (i === 1 ? q1c : q2c) : xc}" stroke-width="2.2"/>` + text(P[0], Y + 5, i + 1, 13, ink, 'middle', 'bold'); });
  s += text(1060, Y + 46, 'supports {1,2}, {1,2,3}: a hypergraph', 13, ink, 'middle');
  s += `<path d="M832 252 V268" stroke="${muted}" stroke-width="1.4"/><path d="M1060 252 V268" stroke="${muted}" stroke-width="1.4"/>`;
  s += text(946, 370, 'same equation, two presentations', 16, ink, 'middle', 'bold');
  s += text(946, 391, 'for generic parameters the five planes determine the tree', 13, dim, 'middle');
  return s;
}

const draw = () => leftPanel() + centrePanel() + rightPanel();
const description = 'Banner for linear coordinate presentations of Lotka–Volterra tree systems. Left: the tree system on the path 1–2–3 from Example 1.1 of the paper, x1′ = x1(2x2 + 4x3), x2′ = x2(x1 + 4x3), x3′ = x3(x1 + 3x2). Besides the three coordinate planes it has exactly two further invariant planes, one per edge of the tree: Q12 = x1 − 2x2 for edge 1–2 and Q23 = 3x2 − 4x3 for edge 2–3, giving 2n − 1 = 5 in all. Centre: the positive orthant seen projectively as a triangle (the chart x1 + x2 + x3 = 1). The three coordinate planes are its sides, and the two edge planes are the exact lines x1 = 2x2 and 3x2 = 4x3, which meet inside the triangle. Grey curves are orbits of the equation computed numerically for illustration; none crosses any of the five lines. Right: the cone over the tree, a vertex 0 joined to vertices 1, 2 and 3; its three spokes correspond to the coordinate planes and its two tree edges to Q12 and Q23. Any three planes forming a spanning tree of the cone can serve as new coordinates, and there are 8 such choices. Choosing x1, x2, x3 gives extra supports {1,2} and {2,3}, a tree. Choosing x1, Q12, Q23, as in the paper’s example, gives supports {1,2} and {1,2,3}, a hypergraph. It is the same equation in two presentations. For generic parameters the five planes determine the tree, which is why two different trees never give the same generic equation; an extension to special parameter values fails.';

function frame(inner, background) {
  const [c0, c1] = background.colors, W = 1200, H = 400, accent = q1c;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" data-banner-palette="${background.name}" role="img" aria-labelledby="art-description">
<desc id="art-description">${description}</desc><defs>
<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
<stop offset="0" stop-color="${c0}"/><stop offset="1" stop-color="${c1}"/>
</linearGradient>
<radialGradient id="glow" cx="0.42" cy="0.5" r="0.8">
<stop offset="0" stop-color="${accent}" stop-opacity="0.06"/><stop offset="1" stop-color="${accent}" stop-opacity="0"/>
</radialGradient>
</defs>
<rect width="${W}" height="${H}" fill="url(#bg)"/>
<rect width="${W}" height="${H}" fill="url(#glow)"/>
${inner}
</svg>`;
}

const thumbSpec = {
  kicker: ['RESEARCH RELEASE · 22 OCTOBER 2026', 'LOTKA–VOLTERRA · DARBOUX POLYNOMIALS'],
  head: ['Two different trees.', '<em>Never the same equation.</em>'], headSize: 68,
  sub: 'Van der Kamp’s tree conjecture proved for generic parameters (genericity on one side suffices); an all-parameter extension fails.',
  tag: 'UNREFEREED CANDIDATE',
  hero: '<div class="eq-label">tree system on n variables</div><div class="hero-title">exactly 2n − 1 invariant planes</div><div class="note">one per coordinate, one per tree edge<br>coordinate choices = spanning trees of the cone<br>the planes determine the tree</div><div class="eq-foot">written proofs · exact checks for small trees</div>'
};

module.exports = { draw, description, thumbSpec, field, Q12, Q23, orbitFrom };

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
    : { title: 'Linear coordinate presentations of Lotka–Volterra tree systems and a proof of van der Kamp’s tree conjecture', status: 'unrefereed-candidate', datePublished: '2026-10-22' };
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

