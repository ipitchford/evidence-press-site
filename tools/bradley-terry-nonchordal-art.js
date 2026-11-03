'use strict';
const { bannerSvg } = require('./svg-xml');
// Nonchordal and irrational D-optimal designs for the Bradley–Terry model: banner, OG card and thumbnail.
// "This image helps the reader understand" that the unique D-optimal design for 14 alternatives with strengths
// (71 x6, 73, 4260, 4380 x6) compares exactly 54 of the 91 pairs, and that these pairs contain a four-cycle with no
// shortcut (weak group - middle 73 - strong group - middle 4260), which disproves the conjecture that optimal
// comparison graphs are always chordal.
// Source (paper 0.1.0-candidate, 3 Nov 2026): Proposition 3.2 and Figure 1 (figures/support_graph.svg): each outer
// group of six is a clique, every outer vertex is joined to both middle vertices, the middles are not joined to each
// other and the groups are not joined to each other; 15 + 15 + 24 = 54 pairs.
// Usage: node tools/bradley-terry-nonchordal-art.js [--render OUTDIR_FOR_INSPECTION] [--no-mirror] [--banner-only]
const SLUG = 'bradley-terry-nonchordal-designs';
const ink = '#f4f1ea', muted = '#e3d9c9', dim = '#c4b7a2';
const weakC = '#9fd2ff', strongC = '#ffb38a', midC = '#ffd56b', edgeC = '#e3d9c9', cycC = '#ffd56b';
const SANS = 'Arial,Helvetica,sans-serif', SERIF = 'Georgia,serif';
const text = (x, y, s, size = 18, color = ink, anchor = 'start', weight = 'normal', family = SANS) =>
  `<text class="og-hide" x="${x}" y="${y}" fill="${color}" font-family="${family}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}">${s}</text>`;
const f = v => (+v).toFixed(1);
// Vertices: L0..L5 (strength 71), A (73), B (4260), R0..R5 (4380).
const hex = (cx, cy, r, rot) => Array.from({ length: 6 }, (_, k) => [cx + r * Math.cos(rot + k * Math.PI / 3), cy + r * Math.sin(rot + k * Math.PI / 3)]);
const L = hex(150, 248, 66, 0), R = hex(440, 248, 66, Math.PI);
const A = [295, 128], B = [295, 372];
const V = { A, B }; L.forEach((p, k) => { V['L' + k] = p; }); R.forEach((p, k) => { V['R' + k] = p; });
const STRENGTH = n => n[0] === 'L' ? 71 : n[0] === 'R' ? 4380 : n === 'A' ? 73 : 4260;
const EDGES = [];
for (const g of ['L', 'R']) for (let i = 0; i < 6; i++) { for (let j = i + 1; j < 6; j++) EDGES.push([g + i, g + j]); EDGES.push([g + i, 'A'], [g + i, 'B']); }
const CYCLE = ['L0', 'A', 'R0', 'B'];   // L0 is the rightmost weak vertex, R0 the leftmost strong vertex
const has = (a, b) => EDGES.some(([x, y]) => (x === a && y === b) || (x === b && y === a));
function chart() {
  let s = '';
  for (const [a, b] of EDGES) s += `<path d="M${f(V[a][0])} ${f(V[a][1])} L${f(V[b][0])} ${f(V[b][1])}" stroke="${edgeC}" stroke-opacity=".28" stroke-width="1.1"/>`;
  for (let k = 0; k < 4; k++) { const a = V[CYCLE[k]], b = V[CYCLE[(k + 1) % 4]]; s += `<path d="M${f(a[0])} ${f(a[1])} L${f(b[0])} ${f(b[1])}" stroke="${cycC}" stroke-width="4.2" stroke-linecap="round"/>`; }
  // The two missing shortcuts, dashed.
  for (const [a, b] of [['A', 'B'], ['L0', 'R0']]) s += `<path d="M${f(V[a][0])} ${f(V[a][1])} L${f(V[b][0])} ${f(V[b][1])}" stroke="${ink}" stroke-opacity=".55" stroke-width="1.6" stroke-dasharray="5 6"/>`;
  for (const [n, p] of Object.entries(V)) {
    const col = n[0] === 'L' ? weakC : n[0] === 'R' ? strongC : midC, big = CYCLE.includes(n);
    s += `<circle cx="${f(p[0])}" cy="${f(p[1])}" r="${big ? 8 : 6}" fill="${col}" stroke="#1b1b1b" stroke-width="1.2"/>`;
  }
  s += text(150, 162, 'weak group: 6 × strength 71', 13, weakC, 'middle', 'bold');
  s += text(440, 162, 'strong group: 6 × strength 4380', 13, strongC, 'middle', 'bold');
  s += text(310, 122, 'strength 73', 13, midC, 'start', 'bold');
  s += text(310, 386, 'strength 4260', 13, midC, 'start', 'bold');
  s += text(295, 238, 'no shortcut', 12, ink, 'middle') + text(295, 268, 'either way', 12, ink, 'middle');
  return s;
}
function panel() {
  const x = 610; let s = text(x, 140, 'Optimal comparisons with no shortcut:', 22, ink, 'start', 'normal', SERIF);
  s += text(x, 168, '14 alternatives', 22, ink, 'start', 'bold', SERIF);
  s += text(x, 206, 'The unique D-optimal design compares 54 of the 91 pairs.', 15, muted);
  s += `<path d="M${x} 232 h34" stroke="${cycC}" stroke-width="4.2" stroke-linecap="round"/>` + text(x + 44, 237, 'a four-cycle in its comparison graph', 14, cycC, 'start', 'bold');
  s += `<path d="M${x} 260 h34" stroke="${ink}" stroke-opacity=".55" stroke-width="1.6" stroke-dasharray="5 6"/>` + text(x + 44, 265, 'neither diagonal is compared, so the graph is not chordal', 14, dim);
  s += text(x, 312, 'This disproves the conjecture (Röttger, Kahle and Schwabe, 2025)', 14, muted, 'start', 'normal', SERIF);
  s += text(x, 332, 'that optimal Bradley–Terry designs are always chordal.', 14, muted, 'start', 'normal', SERIF);
  s += text(x, 360, 'Its weights are irrational; all 91 optimality conditions checked exactly.', 14, muted, 'start', 'normal', SERIF);
  return s;
}
const draw = () =>
  text(40, 52, 'Which pairs should a paired-comparison experiment compare?', 27, ink, 'start', 'normal', SERIF) +
  text(40, 80, 'Bradley–Terry model: i beats j with probability aᵢ/(aᵢ + aⱼ). Each line is a pair the optimal design uses.', 15, muted) +
  chart() + `<path d="M585 112 L 585 380" stroke="${muted}" stroke-opacity=".22" stroke-width="1.2"/>` + panel();
const description = 'Banner for a paper on optimal paired-comparison designs. On the left, the exact comparison graph of the unique D-optimal Bradley-Terry design for 14 alternatives: a blue group of six weak alternatives (strength 71) and an orange group of six strong alternatives (strength 4380), each joined within itself by all 15 pairs, and two yellow middle alternatives (strength 73 at the top, 4260 at the bottom) joined to every outer alternative: 54 pairs in all. A thick yellow four-cycle runs from a weak alternative to the 73 vertex, to a strong alternative, to the 4260 vertex and back; dashed lines mark its two diagonals, which the design never compares ("no shortcut either way"). On the right, headed "Optimal comparisons with no shortcut: 14 alternatives": the unique D-optimal design compares 54 of the 91 pairs; the four-cycle has neither diagonal, so the graph is not chordal; this disproves the conjecture of Röttger, Kahle and Schwabe (2025) that optimal Bradley-Terry designs are always chordal; its weights are irrational and all 91 optimality conditions were checked exactly.';
function frame(inner, background) {
  return bannerSvg({ inner, description, background, glow: { color: midC, cx: '0.25', cy: '0.6', r: '0.4', opacity: '0.07' } });
}
const thumbSpec = {
  kicker: ['RESEARCH RELEASE · NOVEMBER 2026', 'STATISTICS · OPTIMAL DESIGN'],
  head: ['Optimal comparisons', '<em>with no shortcut</em>'], headSize: 66,
  sub: 'A 14-alternative counterexample: the best Bradley–Terry paired-comparison design need not be chordal, and its weights need not be rational.',
  tag: 'UNREFEREED CANDIDATE',
  hero: '<div class="eq-label">14 alternatives · 91 possible pairs</div><div class="hero-title">54 pairs</div><div class="note">used by the unique optimal design,<br>including a four-cycle with no chord</div><div class="eq-foot">written proofs · exact certificates</div>'
};
module.exports = { draw, description, thumbSpec, EDGES, CYCLE };
if (require.main === module) (async () => {
  const fs = require('fs'), pth = require('path'), os = require('os'), vm = require('vm');
  const ROOT = pth.join(__dirname, '..');
  // Guards: 54 pairs; cliques within groups; every outer vertex joined to both middles; induced four-cycle;
  // strengths as in Proposition 3.2 (71 x6, 73, 4260, 4380 x6).
  if (EDGES.length !== 54 || new Set(EDGES.map(e => e.join('-'))).size !== 54) throw new Error('edge count');
  if (Object.keys(V).length !== 14) throw new Error('vertex count');
  for (let k = 0; k < 4; k++) if (!has(CYCLE[k], CYCLE[(k + 1) % 4])) throw new Error('cycle edge missing');
  if (has('A', 'B') || has('L0', 'R0')) throw new Error('cycle has a chord');
  for (let i = 0; i < 6; i++) for (let j = 0; j < 6; j++) if (has('L' + i, 'R' + j)) throw new Error('cross edge');
  const st = Object.keys(V).map(STRENGTH).sort((a, b) => a - b).join(',');
  if (st !== '71,71,71,71,71,71,73,4260,4380,4380,4380,4380,4380,4380') throw new Error('strengths');
  const bp = require('./banner-palettes'); const { palettes } = bp;
  const b0 = bp.resolve(SLUG); if (!b0) throw new Error('no banner palette'); const bname = b0.name;
  const tp = require('./thumbnail-palettes');
  const tname = tp.resolve(SLUG, true);
  const svg = frame(draw(), { name: bname, colors: palettes[bname] });
  fs.writeFileSync(pth.join(ROOT, 'assets/art', SLUG + '.svg'), svg);
  console.log('art:', SLUG, 'banner palette', bname, '| thumbnail palette', tname, '| guards passed');
  const ri = process.argv.indexOf('--render');
  if (ri < 0) return;
  const inspect = process.argv[ri + 1];
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
  if (process.argv.includes('--banner-only')) { await br.close(); return; }
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
