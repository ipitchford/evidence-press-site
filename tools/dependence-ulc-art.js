'use strict';
const { bannerSvg } = require('./svg-xml');
// Ultra log-concavity of dependent-set counts: banner, OG card and thumbnail.
// "This image helps the reader understand" that for a small graph the fraction of k-vertex sets containing an edge,
// d_k / C(n,k), rises smoothly with every log-concavity inequality holding (Xie-Xu Conjecture 4.1, proved here), while
// with a size-three witness the inequality fails: 96 < 120 for counts (0,1,4,10,5,1).
// Source (paper 0.1.0-candidate): Theorem 1.1 inequality (1); Section 5.3 example; graph drawn = two disjoint edges plus a path on 3 vertices (n = 7).
// Usage: node tools/dependence-ulc-art.js [--render OUTDIR_FOR_INSPECTION] [--no-mirror]
const SLUG = 'dependence-ultra-log-concavity';
const ink = '#f4f1ea', muted = '#e3d9c9', dim = '#c4b7a2';
const barC = '#8cc8ff', fracC = '#9be3c0', badC = '#ff9f80', nodeC = '#ffd77a';
const SANS = 'Arial,Helvetica,sans-serif', SERIF = 'Georgia,serif';
const text = (x, y, s, size = 18, color = ink, anchor = 'start', weight = 'normal', family = SANS) =>
  `<text class="og-hide" x="${x}" y="${y}" fill="${color}" font-family="${family}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}">${s}</text>`;
const f = v => (+v).toFixed(1);
const N = 7, EDGES = [[0, 1], [2, 3], [4, 5], [5, 6]];
const binom = (n, k) => { let r = 1; for (let i = 1; i <= k; i++) r = r * (n - k + i) / i; return Math.round(r); };
const D = Array(N + 1).fill(0);
for (let s = 0; s < (1 << N); s++) if (EDGES.some(([a, b]) => (s >> a & 1) && (s >> b & 1))) { let c = 0; for (let t = s; t; t &= t - 1) c++; D[c]++; }
const FRAC = D.map((d, k) => d / binom(N, k));
const ulcHolds = seq => seq.every((_, k) => k === 0 || k === seq.length - 1 || k * (seq.length - 1 - k) * seq[k] ** 2 >= (k + 1) * (seq.length - k) * seq[k - 1] * seq[k + 1]);
const BAD = [0, 1, 4, 10, 5, 1], badL = 2 * 3 * BAD[2] ** 2, badR = 3 * 4 * BAD[1] * BAD[3];
function graphPanel() {
  let s = text(50, 126, 'A graph on 7 vertices', 16, ink, 'start', 'bold', SERIF);
  s += text(50, 148, 'dependent = contains an edge', 13, dim);
  const P = [[70, 200], [70, 270], [140, 200], [140, 270], [215, 190], [215, 245], [215, 300]];
  for (const [a, b] of EDGES) s += `<path d="M${P[a][0]} ${P[a][1]} L${P[b][0]} ${P[b][1]}" stroke="${muted}" stroke-width="2.4"/>`;
  for (const p of P) s += `<circle cx="${p[0]}" cy="${p[1]}" r="8" fill="${nodeC}"/>`;
  return s;
}
const BX0 = 290, BX1 = 690, BY0 = 340, BY1 = 160;
function barsPanel() {
  let s = text(BX0, 126, 'Share of k-sets that are dependent', 16, ink, 'start', 'bold', SERIF);
  s += text(BX0, 148, 'd_k / C(7,k): log-concave at every k', 13, dim);
  s += `<path d="M${BX0} ${BY1 - 6} V${BY0} H${BX1}" stroke="${muted}" stroke-opacity=".6" stroke-width="1.3" fill="none"/>`;
  const w = (BX1 - BX0) / (N + 1);
  FRAC.forEach((v, k) => {
    const x = BX0 + w * k + w * 0.18, h = (BY0 - BY1) * v;
    s += `<rect x="${f(x)}" y="${f(BY0 - h)}" width="${f(w * 0.64)}" height="${f(h)}" fill="${fracC}" fill-opacity=".85"/>`;
    s += text(f(x + w * 0.32), BY0 + 18, String(k), 12, dim, 'middle');
    if (v > 0) s += text(f(x + w * 0.32), f(BY0 - h - 6), `${D[k]}/${binom(N, k)}`, 11, muted, 'middle');
  });
  s += text(BX1, BY0 + 36, 'set size k', 12, dim, 'end');
  return s;
}
function failPanel() {
  const x = 760;
  let s = text(x, 126, 'Triples break it', 16, ink, 'start', 'bold', SERIF);
  s += text(x, 148, 'witnesses of size three, counts (0, 1, 4, 10, 5, 1):', 13, dim);
  s += text(x, 196, 'need 2·3·4² ≥ 3·4·1·10', 15, muted, 'start', 'normal', SERIF);
  s += text(x, 262, `${badL} &lt; ${badR}`, 54, badC, 'start', 'bold', SERIF);
  s += text(x, 300, 'so pairs (graph edges) are exactly the limit', 14, muted);
  s += text(x, 340, 'Xie–Xu Conjecture 4.1: proved', 18, fracC, 'start', 'bold', SERIF);
  return s;
}
const draw = () =>
  text(40, 52, 'Dependent sets of a graph are ultra log-concave', 28, ink, 'start', 'normal', SERIF) +
  text(40, 80, 'For every graph, d_k / C(n,k) is a log-concave sequence, even with vertex weights; witnesses of size three fail', 15, muted) +
  graphPanel() + barsPanel() + `<path d="M730 108 L 730 372" stroke="${muted}" stroke-opacity=".22" stroke-width="1.2"/>` + failPanel();
const description = 'Banner for a combinatorics paper. Left: a graph on seven vertices made of two separate edges and a path of two edges. Centre: a bar chart of the share of k-vertex sets that contain an edge, for k from 0 to 7, rising from zero to one, with fractions such as 4/21 and 19/35 marked; the sequence is log-concave at every k. Right: with witnesses of size three the needed inequality fails, 96 is less than 120, for counts 0, 1, 4, 10, 5, 1. Caption: Xie–Xu Conjecture 4.1 proved.';
function frame(inner, background) {
  return bannerSvg({ inner, description, background, glow: { color: fracC, cx: '0.45', cy: '0.55', r: '0.42', opacity: '0.06' } });
}
const thumbSpec = {
  kicker: ['RESEARCH RELEASE · NOVEMBER 2026', 'COMBINATORICS · LOG-CONCAVITY'],
  head: ['Edge-containing sets', '<em>are ultra log-concave</em>'], headSize: 62,
  sub: 'For every graph, the share of k-vertex sets containing an edge is log-concave in k. Xie–Xu Conjecture 4.1, proved; triples break it.',
  tag: 'UNREFEREED CANDIDATE',
  hero: '<div class="eq-label">witness size three fails</div><div class="hero-title">96 &lt; 120</div><div class="note">counts (0, 1, 4, 10, 5, 1)<br>pairs: always holds<br>weighted form proved</div><div class="eq-foot">written proof · exact small-case checks</div>'
};
module.exports = { draw, description, thumbSpec, D, FRAC };
if (require.main === module) (async () => {
  const fs = require('fs'), pth = require('path'), os = require('os'), vm = require('vm');
  const ROOT = pth.join(__dirname, '..');
  // Guards: exhaustive count for the drawn graph; Theorem 1.1 inequality (1) at every k; Section 5.3 example 96 < 120.
  if (JSON.stringify(D) !== JSON.stringify([0, 0, 4, 19, 31, 21, 7, 1])) throw new Error('dependent counts changed: ' + D);
  if (!ulcHolds(D)) throw new Error('ULC fails for the drawn graph');
  if (badL !== 96 || badR !== 120 || ulcHolds(BAD)) throw new Error('Section 5.3 example mismatch');
  const reg = JSON.parse(fs.readFileSync(pth.join(ROOT, 'data/BANNER_PALETTES.json'), 'utf8'));
  const { palettes } = require('./banner-palettes');
  const bsaved = reg.assignments.find(r => r.slug === SLUG); if (!bsaved) throw new Error('no saved banner palette'); const bname = bsaved.palette;
  const tp = require('./thumbnail-palettes');
  const tsaved = tp.load().assignments.find(r => r.slug === SLUG); if (!tsaved) throw new Error('no saved thumbnail palette');
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
  if (process.argv.includes('--no-mirror')) { await b.close(); console.log('rendered (central mirror skipped)'); return; }
  const central = pth.join(process.env.EVIDENCE_PRESS_THUMBNAIL_DIR || pth.join(os.homedir(), 'thumbs'), SLUG + '.jpg');
  if (fs.existsSync(central) && !fs.readFileSync(thumbFile).equals(fs.readFileSync(central))) throw new Error('central thumbnail exists; refusing to overwrite: ' + central);
  fs.copyFileSync(thumbFile, central);
  if (!fs.readFileSync(thumbFile).equals(fs.readFileSync(central))) throw new Error('central mirror mismatch');
  await b.close();
  console.log('rendered OG, thumbnail, mirror and inspection PNGs');
})().catch(e => { console.error(e); process.exit(1); });
