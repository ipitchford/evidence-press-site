'use strict';
const { bannerSvg } = require('./svg-xml');
// Nordhaus-Gaddum products of Laplacian eigenvalues: banner, OG card and thumbnail.
// "This image helps the reader understand" that the 14-vertex Fano graph (a 7-clique plus 7 independent vertices, each joined
// to a line of three clique vertices) beats the conjectured bound at k = 6: 63 + 7 sqrt(57) = 115.85 > 112 = 14(14 - 6).
// Source (paper 0.1.0-candidate, 4 Nov 2026): Section 2, equation (1), Figure 1; the edges are computed from the difference set.
// Usage: node tools/nordhaus-laplacian-art.js [--render OUTDIR_FOR_INSPECTION] [--no-mirror]
const SLUG = 'nordhaus-gaddum-laplacian-products';
const ink = '#eef6f6', muted = '#d6e6e6', dim = '#a9c4c6';
const lineC = '#ffd27f', cliqueC = '#9fd8ff', badC = '#ffb38a';
const SANS = 'Arial,Helvetica,sans-serif', SERIF = 'Georgia,serif';
const text = (x, y, s, size = 18, color = ink, anchor = 'start', weight = 'normal', family = SANS) =>
  `<text class="og-hide" x="${x}" y="${y}" fill="${color}" font-family="${family}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}">${s}</text>`;
const f = v => (+v).toFixed(1);
const D = [0, 1, 3]; // l_i is joined to c_i, c_(i+1), c_(i+3)
const CX = 250, CY = 244, RC = 72, RL = 132;
const pt = (a, r) => [CX + r * Math.sin(a), CY - r * Math.cos(a)];
const cA = i => 2 * Math.PI * i / 7, lA = i => 2 * Math.PI * (i + 4 / 3) / 7;
function graph() {
  let s = '';
  for (let i = 0; i < 7; i++) for (let j = i + 1; j < 7; j++) {
    const [a, b] = pt(cA(i), RC), [c, d] = pt(cA(j), RC);
    s += `<path d="M${f(a)} ${f(b)} L${f(c)} ${f(d)}" stroke="${cliqueC}" stroke-opacity=".42" stroke-width="1.2"/>`;
  }
  for (let i = 0; i < 7; i++) for (const d of D) {
    const [a, b] = pt(lA(i), RL), [c, e] = pt(cA((i + d) % 7), RC);
    s += `<path d="M${f(a)} ${f(b)} L${f(c)} ${f(e)}" stroke="${lineC}" stroke-opacity=".9" stroke-width="1.8"/>`;
  }
  for (let i = 0; i < 7; i++) {
    const [a, b] = pt(cA(i), RC), [c, d] = pt(lA(i), RL);
    s += `<circle cx="${f(a)}" cy="${f(b)}" r="7.5" fill="${cliqueC}"/><circle cx="${f(c)}" cy="${f(d)}" r="7.5" fill="#1b2230" stroke="${lineC}" stroke-width="2.4"/>`;
  }
  s += text(470, 170, 'filled: 7 vertices,', 13, cliqueC, 'middle', 'bold') + text(470, 188, 'all joined (clique)', 13, cliqueC, 'middle', 'bold');
  s += text(470, 292, 'open: 7 vertices,', 13, lineC, 'middle', 'bold') + text(470, 310, 'each joined to a', 13, lineC, 'middle', 'bold') + text(470, 328, 'Fano line of 3', 13, lineC, 'middle', 'bold');
  return s;
}
function hook() {
  const X0 = 700;
  let s = text(X0, 124, 'Product of the 6th Laplacian eigenvalues', 15, muted, 'start', 'bold');
  s += text(X0, 146, 'of this graph and of its complement:', 15, muted, 'start', 'bold');
  s += text(X0, 226, '115.85 &gt; 112', 58, lineC, 'start', 'bold', SERIF);
  s += text(X0, 262, 'exactly 63 + 7√57', 18, ink, 'start', 'bold');
  s += text(X0, 288, 'conjectured limit: n(n − k) = 14 × 8 = 112', 15, badC, 'start', 'bold');
  s += text(X0, 334, 'Both eigenvalues stay high at the same rank,', 13, ink, 'start', 'bold');
  s += text(X0, 352, 'so the 2025 conjecture fails.', 13, ink, 'start', 'bold');
  return s;
}
const draw = () =>
  text(32, 52, 'A graph and its complement beat the bound', 26, ink, 'start', 'normal', SERIF) +
  text(32, 80, 'Laplacian eigenvalues: 14 vertices, rank k = 6', 15, muted) +
  graph() + `<path d="M672 104 L 672 384" stroke="${muted}" stroke-opacity=".22" stroke-width="1.2"/>` + hook();
const description = 'Banner for a paper disproving a conjecture on Laplacian eigenvalues of a graph and its complement. Left: the 14-vertex counterexample, with seven filled vertices in the centre all joined to each other and seven open vertices around them, each open vertex joined to three filled vertices forming a line of the Fano plane. Right: the result. The product of the sixth Laplacian eigenvalues of this graph and of its complement is exactly 63 + 7 root 57, about 115.85, which exceeds 112, the conjectured limit n(n minus k) = 14 times 8.';
function frame(inner, background) {
  return bannerSvg({ inner, description, background, glow: { color: lineC, cx: '0.3', cy: '0.55', r: '0.42', opacity: '0.06' } });
}
const thumbSpec = {
  kicker: ['RESEARCH RELEASE · NOVEMBER 2026', 'SPECTRAL GRAPH THEORY · COUNTEREXAMPLE'],
  head: ['115.85', '<em>&gt; 112</em>'], headSize: 92,
  sub: 'A 14-vertex graph built from the Fano plane breaks a 2025 conjecture on a graph and its complement.',
  tag: 'UNREFEREED CANDIDATE',
  hero: '<div class="eq-label">at rank k = 6, n = 14</div><div class="hero-title" style="font-size:52px">63 + 7√57</div><div class="note">product of the two eigenvalues</div><div class="hero-title" style="font-size:52px">14 × 8</div><div class="note">the conjectured limit</div><div class="eq-foot">Half clique, half independent, balanced edges</div>'
};
module.exports = { draw, description, thumbSpec };
if (require.main === module) (async () => {
  const fs = require('fs'), pth = require('path'), os = require('os'), vm = require('vm');
  const ROOT = pth.join(__dirname, '..');
  // Guards: difference set, edge count, exact product and bound.
  const seen = new Set(); for (const a of D) for (const b of D) if (a !== b) seen.add((a - b + 7) % 7);
  if (seen.size !== 6) throw new Error('{0,1,3} is not a perfect difference set');
  if (21 + 7 * D.length !== 42) throw new Error('edge count');
  const r = Math.sqrt(57), prod = (13 + r) / 2 * (15 + r) / 2;
  if (Math.abs(prod - (63 + 7 * r)) > 1e-9 || prod.toFixed(2) !== '115.85' || 14 * (14 - 6) !== 112) throw new Error('product');
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
