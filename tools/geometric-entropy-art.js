'use strict';
const { bannerSvg } = require('./svg-xml');
// Universal vertices and effective dimension in geometric-graph entropy: banner, OG card and thumbnail.
// Sources (paper, version 1.1.0-candidate, 27 Oct 2026; DOI 10.5281/zenodo.23686157):
//  - Section 4, eq. (24): in the unit cube the universal region is U_r = {x : sum_j max(x_j,1-x_j)^2 <= r^2};
//    in the unit square at r = 1 it is the intersection of the four unit discs centred at the corners
//    (vertices (1/2, 1/2 +/- sqrt(3)/2 - 1/2 ...) i.e. (0.5,0.134), (0.866,0.5), (0.5,0.866), (0.134,0.5)).
//  - Theorem 1 of Vippathalla-Coon-Badiu (arXiv:2601.10778v1) uses the central disc of radius r - sqrt(2)/2
//    intersected with the square (beta(r)); at r = 1 its radius is 1 - 1/sqrt(2) ~ 0.2929.
//  - Corollary 4.2: coefficient 2 sqrt3 - 2 pi/3 ~ 1.3697 versus earlier 2[1 - pi(1 - 1/sqrt2)^2] ~ 1.4610.
//  - Figure 1(b) / figures/square_coefficient_curve.csv: coefficient curves 2[1 - u_2(r)] (proved) and
//    2[1 - beta(r)] (earlier upper bound); the gap peaks at about 0.161 near r ~ 1.13.
//  - Figure 1(a): the point (17/20, 1/2) lies in U_1 but outside the central disc.
// Curves are computed here from the same closed forms as checks/verify_results.py; guards below check them.
// Usage: node tools/geometric-entropy-art.js [--render OUTDIR_FOR_INSPECTION] [--no-mirror]
const SLUG = 'geometric-graph-entropy';
const ink = '#fff4ef', muted = '#ecd6cf', dim = '#cfb2a9';
const uni = '#ffc46b', disc = '#8fd8ff', proved = '#ffc46b', earlier = '#8fd8ff', gapc = '#ff9a8a';
const SANS = 'Arial,Helvetica,sans-serif', SERIF = 'Georgia,serif';
const text = (x, y, s, size = 18, color = ink, anchor = 'start', weight = 'normal', family = SANS) =>
  `<text class="og-hide" x="${x}" y="${y}" fill="${color}" font-family="${family}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}">${s}</text>`;
const f = v => (+v).toFixed(1);
const sub = t => `<tspan baseline-shift="sub" font-size="72%">${t}</tspan>`;

// Closed forms (as in checks/verify_results.py).
const primitive = (a, r) => (a * Math.sqrt(Math.max(0, r * r - a * a)) + r * r * Math.asin(Math.max(-1, Math.min(1, a / r)))) / 2;
function u2(r) {
  if (r <= Math.sqrt(0.5)) return 0; if (r >= Math.SQRT2) return 1;
  if (r <= Math.sqrt(1.25)) { const b = Math.sqrt(r * r - 0.25); return 4 * (primitive(b, r) - primitive(0.5, r) - (b - 0.5) / 2); }
  const a = Math.sqrt(r * r - 1); return 4 * (a - 0.75 + primitive(1, r) - primitive(a, r));
}
function beta(r) {
  const t = Math.max(0, r - 1 / Math.SQRT2);
  if (t <= 0.5) return Math.PI * t * t; if (t >= 1 / Math.SQRT2) return 1;
  return Math.PI * t * t - 4 * (t * t * Math.acos(0.5 / t) - 0.5 * Math.sqrt(t * t - 0.25));
}
const proc = r => 2 * (1 - u2(r)), earl = r => 2 * (1 - beta(r));

// Left: the unit square at r = 1.
const SQ = { x: 64, y: 104, s: 238 };
const sx = x => SQ.x + x * SQ.s, sy = y => SQ.y + (1 - y) * SQ.s;
function square() {
  const R = SQ.s, k = Math.sqrt(3) / 2;
  let s = `<rect x="${SQ.x}" y="${SQ.y}" width="${SQ.s}" height="${SQ.s}" fill="#ffffff" fill-opacity=".05" stroke="${muted}" stroke-opacity=".75" stroke-width="2"/>`;
  // U_1: arcs of radius 1 centred at the opposite corners.
  const P = [[0.5, 1 - k], [k, 0.5], [0.5, k], [1 - k, 0.5]];
  let d = `M${f(sx(P[0][0]))} ${f(sy(P[0][1]))}`;
  for (let i = 1; i <= 4; i++) { const q = P[i % 4]; d += ` A${R} ${R} 0 0 0 ${f(sx(q[0]))} ${f(sy(q[1]))}`; }
  s += `<path d="${d} Z" fill="${uni}" fill-opacity=".30" stroke="${uni}" stroke-width="2.5"/>`;
  const rho = 1 - 1 / Math.SQRT2;
  s += `<circle cx="${f(sx(.5))}" cy="${f(sy(.5))}" r="${f(rho * SQ.s)}" fill="${disc}" fill-opacity=".22" stroke="${disc}" stroke-width="2.5" stroke-dasharray="7 5"/>`;
  // example point (17/20, 1/2): universal, outside the central disc
  s += `<circle cx="${f(sx(.85))}" cy="${f(sy(.5))}" r="6" fill="${ink}" stroke="#2a1014" stroke-width="2"/>`;
  s += `<path d="M${f(sx(.85))} ${f(sy(.5))} L${f(sx(0))} ${f(sy(0))}" stroke="${ink}" stroke-opacity=".55" stroke-width="1.5" stroke-dasharray="3 4"/>`;
  s += text(f(sx(.97)), f(sy(.05)), 'to farthest corner: &lt; 1', 12.5, dim, 'end');
  for (const [x, y, a] of [[0, 0, 'end'], [1, 0, 'start'], [0, 1, 'end'], [1, 1, 'start']])
    s += `<circle cx="${f(sx(x))}" cy="${f(sy(y))}" r="3.5" fill="${muted}"/>`;
  s += text(SQ.x + SQ.s / 2, SQ.y + SQ.s + 20, 'unit square, radius r = 1', 15, dim, 'middle');
  // legend
  const lx = 336;
  s += `<rect x="${lx}" y="146" width="18" height="18" rx="3" fill="${uni}" fill-opacity=".45" stroke="${uni}" stroke-width="2"/>`;
  s += text(lx + 28, 161, 'universal region U' + sub('1'), 17, uni, 'start', 'bold');
  s += text(lx + 28, 182, 'within distance 1 of every point:', 14, muted);
  s += text(lx + 28, 199, 'joined to everyone, costs no bits', 14, muted);
  s += text(lx + 28, 220, 'area 1 + π/3 − √3 ≈ 0.315', 14, uni);
  s += `<circle cx="${lx + 9}" cy="${266}" r="9" fill="${disc}" fill-opacity=".3" stroke="${disc}" stroke-width="2" stroke-dasharray="4 3"/>`;
  s += text(lx + 28, 272, 'earlier central disc', 17, disc, 'start', 'bold');
  s += text(lx + 28, 293, 'used in the conjectured coefficient', 14, muted);
  s += text(lx + 28, 310, 'area ≈ 0.270', 14, disc);
  s += `<circle cx="${lx + 9}" cy="${343}" r="5" fill="${ink}"/>`;
  s += text(lx + 28, 348, '(0.85, 0.5): universal, outside the disc', 13.5, muted);
  return s;
}

// Right: coefficient of n log2 n against r.
const PL = { x0: 718, x1: 1150, y0: 334, y1: 118 };
const px = r => PL.x0 + (r / Math.SQRT2) * (PL.x1 - PL.x0), py = c => PL.y0 - (c / 2) * (PL.y0 - PL.y1);
function plot() {
  let s = `<path d="M${PL.x0} ${PL.y1 - 6} V${PL.y0} H${PL.x1 + 6}" stroke="${muted}" stroke-opacity=".7" stroke-width="1.6" fill="none"/>`;
  for (const c of [0, 1, 2]) { s += text(PL.x0 - 9, f(py(c) + 5), String(c), 13, dim, 'end'); }
  for (const [r, lab] of [[1 / Math.SQRT2, '√2/2'], [1, '1'], [Math.SQRT2, '√2']]) {
    s += `<path d="M${f(px(r))} ${PL.y0} V${PL.y0 + 6}" stroke="${muted}" stroke-width="1.5"/>`;
    s += text(f(px(r)), PL.y0 + 22, lab, 13, dim, 'middle');
  }
  s += text((PL.x0 + PL.x1) / 2 + 40, PL.y0 + 44, 'radius r', 14, dim, 'middle', 'normal', SERIF);
  s += text(PL.x0 - 4, PL.y1 - 16, 'coefficient of n log' + sub('2') + ' n', 14, dim, 'start', 'normal', SERIF);
  const N = 240, pts = fn => Array.from({ length: N + 1 }, (_, i) => { const r = Math.SQRT2 * i / N; return `${f(px(r))} ${f(py(fn(r)))}`; });
  const a = pts(earl), b = pts(proc);
  s += `<path d="M${a.join(' L')} L${b.slice().reverse().join(' L')} Z" fill="${gapc}" fill-opacity=".28"/>`;
  s += `<path d="M${a.join(' L')}" stroke="${earlier}" stroke-width="2.5" stroke-dasharray="7 5" fill="none"/>`;
  s += `<path d="M${b.join(' L')}" stroke="${proved}" stroke-width="3" fill="none"/>`;
  // r = 1 values
  s += `<path d="M${f(px(1))} ${PL.y0} V${f(py(earl(1)) - 4)}" stroke="${muted}" stroke-opacity=".35" stroke-width="1.2" stroke-dasharray="2 4"/>`;
  s += `<circle cx="${f(px(1))}" cy="${f(py(earl(1)))}" r="5" fill="${earlier}"/>`;
  s += `<circle cx="${f(px(1))}" cy="${f(py(proc(1)))}" r="5" fill="${proved}"/>`;
  s += text(f(px(1) - 24), f(py(earl(1)) - 4), 'earlier 1.461', 15, earlier, 'end', 'bold');
  s += text(f(px(1) - 10), f(py(proc(1)) + 22), 'proved 2√3 − 2π/3 ≈ 1.370', 15, proved, 'end', 'bold');
  // peak gap annotation
  const rp = 1.133;
  s += `<path d="M${f(px(rp))} ${f(py(earl(rp)))} V${f(py(proc(rp)))}" stroke="${gapc}" stroke-width="2"/>`;
  s += text(f(px(rp) - 16), f(py(0.62)), 'gap up to 0.161', 14, gapc, 'end', 'bold');
  s += text(f(px(rp) - 16), f(py(0.62) + 18), '(18.7%) near r ≈ 1.13', 13, gapc, 'end');
  s += text(PL.x0 + 14, f(py(2) + 22), 'both equal 2 for r ≤ √2/2', 13, dim);
  return s;
}

const draw = () => text(40, 50, 'Universal points carry no information, so they cost no bits', 27, ink, 'start', 'normal', SERIF) +
  text(40, 80, 'Storing a random geometric graph takes d(1 − μ(U' + sub('r') + ')) n log' + sub('2') + ' n bits: the true coefficient is smaller than the conjectured one', 16.5, muted) +
  square() + plot() +
  text(40, 393, 'uniform points · fixed radius · curves from the paper’s closed forms (Figure 1) · the conjecture is refuted for √2/2 &lt; r &lt; √2 and confirmed below', 12.5, dim);

const description = 'Banner for a paper on the Shannon entropy of random geometric graphs. Left: the unit square with connection radius r = 1. The shaded amber region, bounded by four circular arcs of radius 1 centred at the corners, is the universal region U_1: points within distance 1 of every point of the square, which are joined to every other vertex and so carry no positional information. Its area is 1 + pi/3 - sqrt(3), about 0.315. A dashed blue disc of radius 1 - 1/sqrt(2) at the centre is the smaller region used in the earlier conjectured coefficient (area about 0.270). The marked point (0.85, 0.5) is universal but lies outside that disc; a dotted line shows its distance to the farthest corner is below 1. Right: the coefficient of n log2 n against the radius r from 0 to sqrt(2), computed from the paper’s closed forms. The solid amber curve is the proved coefficient 2(1 - u_2(r)); the dashed blue curve is the earlier upper coefficient 2(1 - beta(r)). Both equal 2 for r up to sqrt(2)/2; above that the shaded gap shows the earlier value is too large. At r = 1 the values are 1.461 (earlier) and 2 sqrt(3) - 2 pi/3, about 1.370 (proved). The gap peaks at about 0.161, 18.7 percent of the earlier coefficient, near r = 1.13. The conjecture is refuted between sqrt(2)/2 and sqrt(2) and confirmed below.';

function frame(inner, background) {
  return bannerSvg({ inner, description, background, glow: { color: uni, cx: '0.18', cy: '0.6', r: '0.42', opacity: '0.07' } });
}

const thumbSpec = {
  kicker: ['RESEARCH RELEASE · OCTOBER 2026', 'INFORMATION THEORY · RANDOM GEOMETRIC GRAPHS'],
  head: ['Some points cost', '<em>no bits at all.</em>'], headSize: 72,
  sub: 'The exact entropy of a random geometric graph: universal vertices and blind directions lower the coefficient. A 2026 conjecture is refuted for the cube and confirmed on the torus.',
  tag: 'UNREFEREED CANDIDATE',
  hero: '<div class="eq-label">unit square · r = 1</div><div class="hero-title">1.370</div><div class="note">proved: 2√3 − 2π/3<br>conjectured: <b>1.461</b></div><div class="eq-foot">coefficient of n log₂ n · written proofs</div>'
};

module.exports = { draw, description, thumbSpec, u2, beta };
if (require.main === module) (async () => {
  const fs = require('fs'), pth = require('path'), os = require('os'), vm = require('vm');
  const ROOT = pth.join(__dirname, '..');
  // Guards against the paper's values (Corollary 4.2, Figure 1, FINAL_FIXES item 2).
  const close = (a, b, e) => Math.abs(a - b) < e;
  if (!close(u2(1), 1 + Math.PI / 3 - Math.sqrt(3), 1e-12)) throw new Error('u2(1) mismatch');
  if (!close(proc(1), 1.3697065127, 1e-9) || !close(earl(1), 1.4609879155, 1e-9)) throw new Error('r=1 coefficients mismatch');
  let best = [0, 0]; for (let i = 0; i <= 14142; i++) { const r = i / 1e4; const g = earl(r) - proc(r); if (g > best[0]) best = [g, r]; }
  if (!close(best[0], 0.161, 5e-4) || !close(best[1], 1.133, 3e-3) || !close(best[0] / earl(best[1]), 0.187, 1e-3)) throw new Error('gap peak mismatch ' + best);
  if (proc(0.5) !== 2 || earl(0.5) !== 2) throw new Error('small-radius coefficient mismatch');
  const { palettes } = require('./banner-palettes');
  const reg = JSON.parse(fs.readFileSync(pth.join(ROOT, 'data/BANNER_PALETTES.json'), 'utf8'));
  const bsaved = reg.assignments.find(r => r.slug === SLUG); if (!bsaved) throw new Error('no saved banner palette'); const bname = bsaved.palette;
  const tp = require('./thumbnail-palettes');
  const tsaved = tp.load().assignments.find(r => r.slug === SLUG); if (!tsaved) throw new Error('no saved thumbnail palette');
  const tname = tsaved.editorialPalette || tsaved.palette;
  const svg = frame(draw(), { name: bname, colors: palettes[bname] });
  fs.writeFileSync(pth.join(ROOT, 'assets/art', SLUG + '.svg'), svg);
  console.log('art:', SLUG, 'banner palette', bname, '| thumbnail palette', tname, '| gap peak', best);
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
