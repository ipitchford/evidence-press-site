'use strict';
const { bannerSvg } = require('./svg-xml');
// Thermal ordering under Markovian relaxation: banner, OG card and thumbnail.
// "This image helps the reader understand" that the shape of the bath's emission weight J(d) decides whether
// a hotter and a cooler preparation stay ordered at all times: concave weights (Ohmic below cutoff, Drude-Lorentz,
// sub-Ohmic) pass the cone test (Theorem 4, Proposition 6), while the convex super-Ohmic cube law fails it and
// produces a certified relative-entropy crossing (Proposition 8, Table 3).
// Sources (paper 1.0.0-candidate, 28 Oct 2026): Proposition 6 thresholds; KL values below copied from
// extensions/e2_superohmic_certificate.json (exact rational enclosures, decimals rounded), Table 3.
// Left panel curves are exact formulas plotted on [0, 3] (shape illustration, arbitrary vertical scale).
// Usage: node tools/thermal-ordering-art.js [--render OUTDIR_FOR_INSPECTION] [--no-mirror]
const SLUG = 'thermal-ordering-concave-baths';
const ink = '#f4f1ea', muted = '#e3d9c9', dim = '#c4b7a2';
const conc = '#8fe3c4', convex = '#ffab70', hotC = '#ff9d6c', coldC = '#8cc8ff';
const SANS = 'Arial,Helvetica,sans-serif', SERIF = 'Georgia,serif';
const text = (x, y, s, size = 18, color = ink, anchor = 'start', weight = 'normal', family = SANS) =>
  `<text class="og-hide" x="${x}" y="${y}" fill="${color}" font-family="${family}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}">${s}</text>`;
const f = v => (+v).toFixed(1);
const sup = t => `<tspan baseline-shift="super" font-size="70%">${t}</tspan>`;
// Table 3: t, KL(hot), KL(cold)
const KL = [[0, 0.0541263798165, 0.0193990518167], [0.1, 4.85247145022e-5, 2.20552318228e-5], [0.2, 2.88684083741e-7, 1.87864568668e-7],
  [0.3, 1.92628539892e-9, 4.57861960493e-9], [0.4, 2.51752982749e-11, 2.33164818172e-10], [0.5, 9.71389471845e-13, 1.36082868132e-11]];

// Left: jump-weight shapes J(d) on [0,3]
const A = { x0: 70, x1: 470, y0: 305, y1: 140 };
function weights() {
  const X = d => A.x0 + d / 3 * (A.x1 - A.x0), Y = v => A.y0 - v * (A.y0 - A.y1);
  const curve = (fn, n = 90) => 'M' + Array.from({ length: n + 1 }, (_, i) => { const d = 3 * i / n; return `${f(X(d))} ${f(Y(fn(d)))}`; }).join(' L');
  let s = `<path d="M${A.x0} ${A.y1 - 10} V${A.y0} H${A.x1 + 8}" stroke="${muted}" stroke-opacity=".7" stroke-width="1.6" fill="none"/>`;
  // Ohmic d e^{-d/wc} with wc = 1.5 (concave on [0, 2 wc] = [0, 3]); scaled to peak ~0.62
  s += `<path d="${curve(d => d * Math.exp(-d / 1.5) / 0.552 * 0.62)}" stroke="${conc}" stroke-width="3.2" fill="none"/>`;
  // sub-Ohmic sqrt(d)
  s += `<path d="${curve(d => Math.sqrt(d / 3) * 0.86)}" stroke="${conc}" stroke-width="2.4" stroke-dasharray="7 5" fill="none"/>`;
  // super-Ohmic d^3
  s += `<path d="${curve(d => (d / 3) ** 3)}" stroke="${convex}" stroke-width="3.2" fill="none"/>`;
  s += text(X(0.35), Y(0.93), 'sub-Ohmic √d', 14, conc, 'start', 'bold');
  s += text(X(3), Y(0.30), 'Ohmic d·e' + sup('−d/ω') + ', d ≤ 2ω', 14, conc, 'end', 'bold');
  s += text(X(2.62), Y(0.80), 'super-Ohmic d³', 14, convex, 'end', 'bold');
  s += text(A.x0 - 4, A.y1 - 18, 'bath emission weight J', 14, dim, 'start', 'normal', SERIF);
  s += text(A.x1, A.y0 + 22, 'energy gap d', 14, dim, 'end', 'normal', SERIF);
  s += text(A.x0 + 6, A.y0 + 46, 'bends down (concave): order kept at every time', 15, conc, 'start', 'bold');
  s += text(A.x0 + 6, A.y0 + 66, 'bends up (convex): the guarantee fails', 15, convex, 'start', 'bold');
  return s;
}
// Right: certified KL curves for J = d^3 (Proposition 8)
const P = { x0: 690, x1: 1130, y0: 310, y1: 150 };
const px = t => P.x0 + t / 0.5 * (P.x1 - P.x0);
const py = v => P.y0 - (Math.log10(v) + 13) / 12 * (P.y0 - P.y1);
function crossing() {
  let s = `<path d="M${P.x0} ${P.y1 - 10} V${P.y0} H${P.x1 + 8}" stroke="${muted}" stroke-opacity=".7" stroke-width="1.6" fill="none"/>`;
  s += `<rect x="${f(px(0.2))}" y="${P.y1 - 6}" width="${f(px(0.3) - px(0.2))}" height="${P.y0 - P.y1 + 6}" fill="${convex}" fill-opacity=".13"/>`;
  s += text(f((px(0.2) + px(0.3)) / 2), P.y1 - 14, 'certified crossing', 13.5, convex, 'middle', 'bold');
  s += text(f((px(0.2) + px(0.3)) / 2), P.y1 + 2, 'in (1/5, 3/10)', 13, convex, 'middle');
  for (const [t, lab] of [[0, '0'], [0.1, '0.1'], [0.2, '0.2'], [0.3, '0.3'], [0.4, '0.4'], [0.5, '0.5']]) s += text(f(px(t)), P.y0 + 20, lab, 12.5, dim, 'middle');
  for (const k of [-1, -5, -9, -13]) s += text(P.x0 - 8, f(py(10 ** k) + 4), '10' + sup('−' + -k), 12.5, dim, 'end');
  const line = i => 'M' + KL.map(r => `${f(px(r[0]))} ${f(py(r[i]))}`).join(' L');
  s += `<path d="${line(1)}" stroke="${hotC}" stroke-width="3" fill="none"/>`;
  s += `<path d="${line(2)}" stroke="${coldC}" stroke-width="3" stroke-dasharray="8 5" fill="none"/>`;
  for (const r of KL) s += `<circle cx="${f(px(r[0]))}" cy="${f(py(r[1]))}" r="3.6" fill="${hotC}"/><circle cx="${f(px(r[0]))}" cy="${f(py(r[2]))}" r="3.6" fill="${coldC}"/>`;
  s += text(px(0.06), py(0.054) - 6, 'hotter start', 14, hotC, 'start', 'bold');
  s += text(px(0.11), py(3e-3), 'cooler start', 14, coldC, 'start', 'bold');
  s += text(P.x1, py(3e-7), 'after: hotter is closer', 14, hotC, 'end', 'bold');
  s += text(P.x0 - 4, P.y1 - 30, 'relative entropy to equilibrium, cube-law bath', 14, dim, 'start', 'normal', SERIF);
  s += text(P.x1, P.y0 + 40, 'time · exact values at six times (Table 3)', 13, dim, 'end', 'normal', SERIF);
  return s;
}
const draw = () => text(40, 52, 'The shape of the bath decides whether hot can overtake cold', 27, ink, 'start', 'normal', SERIF) +
  text(40, 82, 'Concave emission weights keep two cooling copies in order at all times; a super-Ohmic cube law produces a certified crossing', 16, muted) +
  weights() + `<path d="M580 170 L 580 360" stroke="${muted}" stroke-opacity=".25" stroke-width="1.2"/>` + crossing();
const description = 'Banner for a paper on when Mpemba-type crossings in Markovian relaxation can be ruled out at all times. Left: three bath emission weights J as functions of the energy gap d: a sub-Ohmic square-root law (dashed green) and an Ohmic weight d times e to the minus d over omega, on a range up to twice the cutoff (solid green), both bend downwards (concave), which by the paper\'s Theorem 4 and Proposition 6 keeps two cooling copies in order at every time; a super-Ohmic cube law (orange) bends upwards (convex), and the guarantee fails. Right: for the cube-law bath on four equally spaced levels, the exact relative entropy to equilibrium of a hotter (solid orange) and a cooler (dashed blue) preparation at six certified times on a logarithmic scale. The hotter one starts about three times farther away, the curves cross in the shaded interval between t = 1/5 and t = 3/10, and afterwards the hotter preparation is closer to equilibrium. Values are from the paper\'s Table 3; lines merely join the certified points.';
function frame(inner, background) {
  return bannerSvg({ inner, description, background, glow: { color: hotC, cx: '0.78', cy: '0.6', r: '0.4', opacity: '0.06' } });
}
const thumbSpec = {
  kicker: ['RESEARCH RELEASE · OCTOBER 2026', 'MARKOVIAN MPEMBA EFFECT · THERMAL RELAXATION'],
  head: ['When hot can never', '<em>overtake cold.</em>'], headSize: 66,
  sub: 'A cone test keeps hotter and cooler copies ordered at all times; for bosonic baths it holds exactly when the emission weight is concave. Super-Ohmic baths can cross.',
  tag: 'UNREFEREED CANDIDATE',
  hero: '<div class="eq-label">order kept at every time iff</div><div class="hero-title">J concave</div><div class="note">Ohmic: width ≤ 2ω<sub>c</sub><br>Drude–Lorentz: width ≤ √3 ω<sub>c</sub><br>J = d³: certified crossing</div><div class="eq-foot">complete graph · common coupling · exact proofs</div>'
};
module.exports = { draw, description, thumbSpec, KL };
if (require.main === module) (async () => {
  const fs = require('fs'), pth = require('path'), os = require('os'), vm = require('vm');
  const ROOT = pth.join(__dirname, '..');
  // Guards against the paper's Table 3: hot above cold until t = 1/5, below from t = 3/10.
  if (!KL.slice(0, 3).every(r => r[1] > r[2]) || !KL.slice(3).every(r => r[1] < r[2])) throw new Error('Table 3 sign pattern mismatch');
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
