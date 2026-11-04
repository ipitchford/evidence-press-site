'use strict';
const { bannerSvg } = require('./svg-xml');
// Positivity of oscillatory Gegenbauer Hankel determinants: banner, OG card and thumbnail.
// "This image helps the reader understand" that the even-size determinant D_2 stays above zero at every frequency while the
// odd-size D_3 crosses zero again and again, for two Gegenbauer exponents. Source (paper 0.1.0-candidate, 4 Nov 2026):
// Theorem 1.1 (D_2r > 0 for all alpha > -1 and real x) and Corollary 4.1 (odd sizes have infinitely many real zeros).
// Data: D_N(x)/D_N(0) computed with mpmath 1.3.0 (30 digits, direct quadrature of the moments) for x = 0, 0.25, ..., 20,
// drawn on a signed log scale sign(v)*log10(1+|v|/1e-6) so that the fast decay does not hide the sign.
// Usage: node tools/gegenbauer-hankel-art.js [--render OUTDIR_FOR_INSPECTION] [--no-mirror]
const SLUG = 'oscillatory-gegenbauer-even-hankel-positivity';
const DATA = {"xs":[0.0,0.25,0.5,0.75,1.0,1.25,1.5,1.75,2.0,2.25,2.5,2.75,3.0,3.25,3.5,3.75,4.0,4.25,4.5,4.75,5.0,5.25,5.5,5.75,6.0,6.25,6.5,6.75,7.0,7.25,7.5,7.75,8.0,8.25,8.5,8.75,9.0,9.25,9.5,9.75,10.0,10.25,10.5,10.75,11.0,11.25,11.5,11.75,12.0,12.25,12.5,12.75,13.0,13.25,13.5,13.75,14.0,14.25,14.5,14.75,15.0,15.25,15.5,15.75,16.0,16.25,16.5,16.75,17.0,17.25,17.5,17.75,18.0,18.25,18.5,18.75,19.0,19.25,19.5,19.75,20.0],"y":{"2_0":[6.0,5.996,5.986,5.968,5.942,5.91,5.871,5.826,5.774,5.717,5.656,5.59,5.522,5.453,5.385,5.319,5.257,5.201,5.15,5.104,5.063,5.025,4.989,4.954,4.92,4.885,4.851,4.817,4.783,4.751,4.72,4.691,4.664,4.639,4.614,4.591,4.568,4.545,4.522,4.499,4.476,4.453,4.432,4.411,4.391,4.372,4.353,4.335,4.318,4.301,4.283,4.266,4.249,4.232,4.215,4.199,4.183,4.167,4.153,4.138,4.124,4.11,4.096,4.083,4.069,4.055,4.041,4.028,4.015,4.002,3.99,3.978,3.966,3.954,3.943,3.931,3.92,3.908,3.897,3.885,3.874],"3_0":[6.0,5.997,5.986,5.969,5.944,5.913,5.874,5.829,5.777,5.718,5.651,5.578,5.497,5.409,5.313,5.209,5.095,4.97,4.832,4.678,4.5,4.286,4.006,3.544,-3.046,-3.612,-3.765,-3.82,-3.825,-3.799,-3.747,-3.672,-3.573,-3.445,-3.278,-3.046,-2.649,1.959,2.694,2.888,2.973,3.005,3.001,2.969,2.913,2.83,2.715,2.557,2.322,1.871,-1.632,-2.129,-2.305,-2.389,-2.424,-2.426,-2.399,-2.347,-2.267,-2.152,-1.987,-1.726,-1.104,1.388,1.725,1.871,1.945,1.976,1.976,1.948,1.894,1.811,1.689,1.509,1.199,-0.159,-1.17,-1.409,-1.527,-1.588,-1.612],"2_1.5":[6.0,5.997,5.989,5.975,5.955,5.929,5.898,5.861,5.818,5.769,5.714,5.653,5.587,5.514,5.436,5.351,5.262,5.167,5.068,4.966,4.861,4.756,4.651,4.549,4.451,4.359,4.274,4.195,4.122,4.053,3.987,3.923,3.858,3.794,3.73,3.665,3.602,3.54,3.48,3.423,3.369,3.317,3.267,3.219,3.172,3.126,3.079,3.032,2.986,2.94,2.894,2.85,2.808,2.767,2.727,2.689,2.652,2.615,2.578,2.542,2.505,2.469,2.433,2.397,2.362,2.329,2.296,2.264,2.233,2.203,2.173,2.143,2.113,2.083,2.053,2.023,1.994,1.966,1.938,1.911,1.885],"3_1.5":[6.0,5.997,5.988,5.973,5.951,5.924,5.89,5.85,5.804,5.752,5.693,5.629,5.558,5.48,5.397,5.307,5.21,5.107,4.998,4.882,4.759,4.628,4.49,4.344,4.189,4.023,3.845,3.65,3.432,3.178,2.856,2.341,-1.898,-2.378,-2.489,-2.506,-2.477,-2.417,-2.334,-2.229,-2.103,-1.952,-1.77,-1.537,-1.204,-0.44,0.909,1.129,1.207,1.225,1.205,1.159,1.09,1.001,0.89,0.754,0.586,0.373,0.074,-0.224,-0.353,-0.413,-0.436,-0.433,-0.411,-0.375,-0.328,-0.271,-0.207,-0.138,-0.069,-0.002,0.051,0.084,0.104,0.112,0.112,0.106,0.095,0.08,0.063]}};
const ink = '#f4f1ea', muted = '#e3d9c9', dim = '#c4b7a2';
const evenC = '#9be3c0', oddC = '#ff9a8a', zeroC = '#ffd77a';
const SANS = 'Arial,Helvetica,sans-serif', SERIF = 'Georgia,serif';
const text = (x, y, s, size = 18, color = ink, anchor = 'start', weight = 'normal', family = SANS) =>
  `<text class="og-hide" x="${x}" y="${y}" fill="${color}" font-family="${family}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}">${s}</text>`;
const f = v => (+v).toFixed(1);
const PX0 = 90, PX1 = 700, PY0 = 120, PY1 = 340, YMAX = 6.5;
const X = x => PX0 + (PX1 - PX0) * x / 20;
const Y = v => (PY0 + PY1) / 2 - ((PY1 - PY0) / 2) * Math.max(-1, Math.min(1, v / YMAX));
const crossings = k => DATA.y[k].reduce((n, v, i, a) => n + (i && v * a[i - 1] < 0 ? 1 : 0), 0);
function plot() {
  let s = text(PX0, PY0 - 10, 'size of the determinant against frequency x (signed log scale)', 13, dim);
  s += `<rect x="${PX0}" y="${Y(0)}" width="${PX1 - PX0}" height="${PY1 - Y(0)}" fill="${oddC}" fill-opacity=".04"/>`;
  s += `<path d="M${PX0} ${f(Y(0))} H${PX1}" stroke="${zeroC}" stroke-width="1.6" stroke-dasharray="5 4"/>`;
  s += text(PX1 + 8, Y(0) + 5, '0', 15, zeroC, 'start', 'bold');
  s += text(PX0 + 6, PY1 - 8, 'each crossing of 0: no orthogonal polynomial of degree 3 at that x', 12, oddC);
  for (const [k, col, w, dash] of [['2_0', evenC, 3, ''], ['2_1.5', evenC, 2.2, '7 4'], ['3_0', oddC, 3, ''], ['3_1.5', oddC, 2.2, '7 4']]) {
    const d = DATA.xs.map((x, i) => (i ? 'L' : 'M') + f(X(x)) + ' ' + f(Y(DATA.y[k][i]))).join(' ');
    s += `<path d="${d}" fill="none" stroke="${col}" stroke-width="${w}"${dash ? ` stroke-dasharray="${dash}"` : ''} stroke-linejoin="round"/>`;
  }
  for (const x of [0, 5, 10, 15, 20]) s += text(X(x), PY1 + 20, String(x), 12, dim, 'middle');
  s += text((PX0 + PX1) / 2, PY1 + 36, 'frequency x', 13, dim, 'middle');
  return s;
}
function panel() {
  const RX = 745;
  let s = text(RX, 140, 'Even sizes never vanish', 28, zeroC, 'start', 'bold', SERIF);
  s += `<path d="M${RX} 172 h28" stroke="${evenC}" stroke-width="4"/>` + text(RX + 38, 178, 'D₂: stays above zero', 16, evenC, 'start', 'bold');
  s += `<path d="M${RX} 204 h28" stroke="${oddC}" stroke-width="4"/>` + text(RX + 38, 210, `D₃: crosses zero ${crossings('3_0')}× by x = 20`, 16, oddC, 'start', 'bold');
  s += text(RX, 240, 'solid α = 0, dashed α = 1.5', 13, dim);
  s += text(RX, 280, 'Proved for every even size, every α > −1', 15, ink, 'start', 'normal', SERIF);
  s += text(RX, 302, 'and every real frequency x', 15, ink, 'start', 'normal', SERIF);
  s += text(RX, 336, 'so even-degree rules for oscillatory', 13, dim);
  s += text(RX, 354, 'integrals always exist (existence only)', 13, dim);
  return s;
}
const draw = () =>
  text(40, 52, 'Oscillatory Gegenbauer Hankel determinants: even sizes stay positive', 26, ink, 'start', 'normal', SERIF) +
  text(40, 80, 'Weight (1 − t²)ᵅ e^(ixt) on [−1, 1]; computed values, normalised by the value at x = 0', 15, muted) +
  plot() + `<path d="M722 108 L 722 372" stroke="${muted}" stroke-opacity=".22" stroke-width="1.2"/>` + panel();
const description = 'Banner for a paper on Hankel determinants of an oscillatory complex weight. Left: computed curves of the 2-by-2 determinant (green) and the 3-by-3 determinant (red) against frequency x from 0 to 20, for exponent alpha 0 (solid) and 1.5 (dashed), normalised by their values at x = 0 and drawn on a signed logarithmic scale. A dashed gold line marks zero. The green curves stay above zero throughout; the red curves cross zero repeatedly, each crossing marked as a frequency where no orthogonal polynomial of degree 3 exists. Right, in gold: Even sizes never vanish. Proved for every even size, every alpha greater than minus one and every real frequency, so even-degree rules for oscillatory integrals always exist (existence only).';
function frame(inner, background) {
  return bannerSvg({ inner, description, background, glow: { color: evenC, cx: '0.30', cy: '0.45', r: '0.42', opacity: '0.06' } });
}
const thumbSpec = {
  kicker: ['RESEARCH RELEASE · NOVEMBER 2026', 'ANALYSIS · OSCILLATORY QUADRATURE'],
  head: ['Even sizes', '<em>never vanish</em>'], headSize: 76,
  sub: 'For the oscillatory Gegenbauer weight, every even-size Hankel determinant is positive at every frequency, so even-degree quadrature polynomials always exist.',
  tag: 'UNREFEREED CANDIDATE',
  hero: '<div class="eq-label">computed, x from 0 to 20</div><div class="hero-title">D₂ &gt; 0</div><div class="note">D₂: never crosses zero<br>D₃: crosses zero ' + crossings('3_0') + ' times<br>all α &gt; −1, all real x</div><div class="eq-foot">written proofs · mpmath and SymPy checks</div>'
};
module.exports = { draw, description, thumbSpec, crossings };
if (require.main === module) (async () => {
  const fs = require('fs'), pth = require('path'), os = require('os'), vm = require('vm');
  const ROOT = pth.join(__dirname, '..');
  // Guards: the drawn data agree with Theorem 1.1 (even size positive) and Corollary 4.1 (odd sizes change sign).
  for (const k of ['2_0', '2_1.5']) if (Math.min(...DATA.y[k]) <= 0) throw new Error('even-size curve not positive: ' + k);
  for (const k of ['3_0', '3_1.5']) if (crossings(k) < 2) throw new Error('odd-size curve lacks sign changes: ' + k);
  const reg = JSON.parse(fs.readFileSync(pth.join(ROOT, 'data/BANNER_PALETTES.json'), 'utf8'));
  const { palettes } = require('./banner-palettes');
  const bsaved = reg.assignments.find(r => r.slug === SLUG); if (!bsaved) throw new Error('no saved banner palette'); const bname = bsaved.palette;
  const tp = require('./thumbnail-palettes');
  const tsaved = tp.load().assignments.find(r => r.slug === SLUG); if (!tsaved) throw new Error('no saved thumbnail palette');
  const tname = tsaved.editorialPalette || tsaved.palette;
  const svg = frame(draw(), { name: bname, colors: palettes[bname] });
  fs.writeFileSync(pth.join(ROOT, 'assets/art', SLUG + '.svg'), svg);
  console.log('art:', SLUG, 'banner palette', bname, '| thumbnail palette', tname, '| D3 crossings', crossings('3_0'), crossings('3_1.5'));
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
