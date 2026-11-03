'use strict';
const { bannerSvg } = require('./svg-xml');
// DDVV sum-of-squares thresholds: banner, OG card and thumbnail.
// "This image helps the reader understand" that the DDVV commutator inequality for real symmetric matrices holds with
// constant 1, but its simplest (quadratic) sum-of-squares proof needs a larger constant sigma(n, m): exactly 1 only when
// n = 2 or m = 2, 9/8 for 3 x 3 matrices, rising with the matrix size n towards limits that approach 3, never reaching it.
// Source (paper 0.1.0-candidate, 3 Nov 2026): Theorem 1.1 (three-branch closed form), Corollary 1.3 (sigma(3, m) = 9/8,
// sup sigma = 3, limits 8/5, 2 and 3n^2/(n^2 + 7n - 6)) and Theorem 1.2 / Corollary 1.3(3) for the Hermitian facts quoted.
// The plotted values are the closed forms evaluated exactly below (same formulas as figures/make_thresholds_figure.py).
// Usage: node tools/ddvv-sos-threshold-art.js [--render OUTDIR_FOR_INSPECTION] [--no-mirror]
const SLUG = 'ddvv-sum-of-squares-thresholds';
const ink = '#f4f1ea', muted = '#e3d9c9', dim = '#c4b7a2';
const c3 = '#9fd2ff', c4 = '#ffcf7a', cInf = '#f2a7c3', okC = '#9be3c0';
const SANS = 'Arial,Helvetica,sans-serif', SERIF = 'Georgia,serif';
const text = (x, y, s, size = 18, color = ink, anchor = 'start', weight = 'normal', family = SANS) =>
  `<text class="og-hide" x="${x}" y="${y}" fill="${color}" font-family="${family}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}">${s}</text>`;
const f = v => (+v).toFixed(1);
// Exact rationals as [numerator, denominator] (all integers stay far below 2^53 here).
function sigma(n, m) {
  if (Math.min(n, m) === 2) return [1, 1];
  if (m * (n + 12) >= 6 * (n + 4)) return [3 * n * n * (m - 1), m * n * n + 7 * m * n - 6 * m - 12 * n + 12];
  if (m === 3 && (n === 5 || n === 6)) return [4 * n * (n + 8), (n + 2) * (3 * n + 14)];
  return [4 * (m - 1) * (n + 2), m * n + 7 * m + 2 * n - 2];
}
const sigmaInf = n => (n === 2 ? [1, 1] : [3 * n * n, n * n + 7 * n - 6]);
const val = ([a, b]) => a / b;
const NMAX = 40, NS = Array.from({ length: NMAX - 1 }, (_, i) => i + 2);
const S3 = NS.map(n => val(sigma(n, 3))), S4 = NS.map(n => val(sigma(n, 4))), SI = NS.map(n => val(sigmaInf(n)));
// Chart geometry.
const X0 = 78, X1 = 640, Y0 = 336, Y1 = 118, YMIN = 0.8, YMAX = 3.15;
const X = n => X0 + (n - 2) / (NMAX - 2) * (X1 - X0);
const Y = v => Y0 - (v - YMIN) / (YMAX - YMIN) * (Y0 - Y1);
function chart() {
  let s = '';
  for (const v of [1, 1.5, 2, 2.5, 3]) s += `<path d="M${X0} ${f(Y(v))} H${X1}" stroke="${muted}" stroke-opacity="${v === 1 ? 0 : 0.12}" stroke-width="1"/>` + text(X0 - 10, Y(v) + 4, String(v), 12, dim, 'end');
  for (const n of [2, 10, 20, 30, 40]) s += text(X(n), Y0 + 20, String(n), 12, dim, 'middle');
  // Supremum 3 (dashed) and true constant 1 (solid, bright).
  s += `<path d="M${X0} ${f(Y(3))} H${X1}" stroke="${dim}" stroke-width="1.6" stroke-dasharray="7 6"/>`;
  s += text(X1, Y(3) - 8, 'supremum 3: approached, never reached', 13, dim, 'end', 'normal', SERIF);
  s += `<path d="M${X0} ${f(Y(1))} H${X1}" stroke="${okC}" stroke-width="3"/>`;
  s += text(X1, Y(1) + 20, 'true DDVV constant 1 (the inequality itself)', 13, okC, 'end', 'bold');
  const line = (vals, col, w) => `<path d="M${vals.map((v, i) => `${f(X(NS[i]))} ${f(Y(v))}`).join(' L')}" stroke="${col}" stroke-width="${w}" fill="none" stroke-linejoin="round"/>`;
  s += line(SI, cInf, 2.6) + line(S4, c4, 2.6) + line(S3, c3, 2.6);
  for (const [vals, col] of [[S3, c3], [S4, c4], [SI, cInf]]) for (let i = 0; i < NS.length; i += 1) if (NS[i] <= 8 || NS[i] % 4 === 0) s += `<circle cx="${f(X(NS[i]))}" cy="${f(Y(vals[i]))}" r="2.6" fill="${col}"/>`;
  // Labels at the right end of each curve.
  s += text(X(NMAX) + 8, Y(SI[SI.length - 1]) + 5, 'many matrices', 13, cInf, 'start', 'bold');
  s += text(X(NMAX) + 8, Y(S4[S4.length - 1]) + 5, 'm = 4', 13, c4, 'start', 'bold');
  s += text(X(NMAX) + 8, Y(S3[S3.length - 1]) + 5, 'm = 3', 13, c3, 'start', 'bold');
  // The 9/8 point at n = 3 (all m >= 3) and n = 2 at 1.
  const x3 = X(3), y3 = Y(9 / 8);
  s += `<circle cx="${f(x3)}" cy="${f(y3)}" r="6.5" fill="none" stroke="${ink}" stroke-width="2"/>`;
  const ly = Y(2.62);
  s += `<path d="M${f(x3)} ${f(y3 - 7)} L${f(x3)} ${f(ly - 14)}" stroke="${ink}" stroke-width="1.4" stroke-dasharray="3 3"/>`;
  s += text(x3 + 8, ly - 2, '9/8 for 3 × 3 matrices', 15, ink, 'start', 'bold');
  s += text(x3 + 8, ly + 15, '(any number m ≥ 3)', 12.5, dim);
  s += text(X0, Y0 + 42, 'matrix size n (n × n real symmetric matrices)', 13, dim, 'start', 'normal', SERIF);
  s += text(X0 - 10, Y1 - 12, 'least constant c with a quadratic sum-of-squares proof, σ(n, m)', 13, dim, 'start', 'normal', SERIF);
  return s;
}
function panel() {
  const x = 772; let s = text(x, 134, 'The price of the simplest proof', 19, ink, 'start', 'normal', SERIF);
  s += text(x, 162, 'The inequality holds with constant', 14, ink) + text(x + 226, 162, '1.', 14, okC, 'start', 'bold');
  s += text(x, 184, 'A sum-of-squares proof needs exactly 1', 14, ink) + text(x, 203, 'only when n = 2 or m = 2.', 14, ink);
  s += text(x, 240, '1 → 9/8 → 3', 30, ink, 'start', 'bold');
  s += text(x, 262, 'n = 2   ·   3 × 3   ·   supremum', 12.5, dim);
  s += text(x, 300, 'Hermitian matrices (Theorem 1.2):', 14, c3, 'start', 'bold');
  s += text(x, 320, 'true constant 4/3; the simplest proof', 13.5, ink) + text(x, 338, 'needs up to 4.', 13.5, ink);
  s += text(x, 368, 'Exact for degree-four certificates; higher degrees not covered.', 11, dim, 'start', 'normal', SERIF);
  return s;
}
const draw = () =>
  text(40, 52, 'How much slack does the simplest sum-of-squares proof of the DDVV inequality need?', 25, ink, 'start', 'normal', SERIF) +
  text(40, 80, 'Exact least constant σ(n, m) for m real symmetric n × n matrices (Theorem 1.1): 1 only at the edges, 9/8 for 3 × 3, up to 3', 15, muted) +
  chart() + `<path d="M752 112 L 752 372" stroke="${muted}" stroke-opacity=".22" stroke-width="1.2"/>` + panel();
const description = 'Banner for a paper that computes exactly how large a constant the simplest sum-of-squares proof of the DDVV commutator inequality needs. The DDVV inequality for m real symmetric n by n matrices holds with constant 1 (green horizontal line). The chart plots, against the matrix size n from 2 to 40, the least constant sigma(n, m) for which the inequality has a sum-of-squares proof using squares of quadratic forms: for m = 3 matrices (blue), m = 4 (gold) and the limit of many matrices (pink). All three curves start at 1 for n = 2, pass through 9/8 at n = 3 (circled), and rise with n; the m = 3 curve levels off towards 8/5, the m = 4 curve towards 2, and the many-matrices curve towards 3. A dashed line at 3 marks the supremum, approached but never reached. Right: the inequality holds with constant 1, but a sum-of-squares proof needs exactly 1 only when n = 2 or m = 2; the values run from 1 through 9/8 up to 3. For Hermitian matrices the true constant is 4/3 and the simplest proof needs up to 4. The classification is exact for degree-four certificates; higher-degree certificates are not covered.';
function frame(inner, background) {
  return bannerSvg({ inner, description, background, glow: { color: c3, cx: '0.3', cy: '0.6', r: '0.42', opacity: '0.06' } });
}
const thumbSpec = {
  kicker: ['RESEARCH RELEASE · NOVEMBER 2026', 'MATRIX INEQUALITIES · SUMS OF SQUARES'],
  head: ['True constant 1.', '<em>Simplest proof needs 9/8</em>'], headSize: 62,
  sub: 'The DDVV commutator inequality holds with constant 1, but a degree-four sum-of-squares proof needs 9/8 for 3 × 3 matrices and up to 3 in general.',
  tag: 'UNREFEREED CANDIDATE',
  hero: '<div class="eq-label">least sum-of-squares constant</div><div class="hero-title">1 → 9/8 → 3</div><div class="note">n = 2 or m = 2: exactly 1<br>3 × 3 matrices: 9/8<br>large n and m: approaches 3</div><div class="eq-foot">written proofs · exact certificates</div>'
};
module.exports = { draw, description, thumbSpec };
if (require.main === module) (async () => {
  const fs = require('fs'), pth = require('path'), os = require('os'), vm = require('vm');
  const ROOT = pth.join(__dirname, '..');
  // Guards against the paper's stated values (Theorem 1.1, Corollary 1.3, Table 1).
  const eq = (r, a, b) => r[0] * b === r[1] * a;
  const checks = [[sigma(2, 7), 1, 1], [sigma(9, 2), 1, 1], [sigma(3, 3), 9, 8], [sigma(3, 4), 9, 8], [sigma(3, 40), 9, 8], [sigma(4, 3), 16, 13], [sigma(5, 3), 260, 203], [sigma(6, 3), 21, 16], [sigma(7, 3), 4, 3], [sigma(4, 4), 9 * 16, 4 * 16 + 64 - 12]];
  for (const [r, a, b] of checks) if (!eq(r, a, b)) throw new Error('threshold mismatch ' + r + ' vs ' + a + '/' + b);
  if (!eq(sigmaInf(3), 9, 8)) throw new Error('limit mismatch');
  for (let i = 1; i < NS.length; i++) if (!(S3[i] >= S3[i - 1] && S4[i] >= S4[i - 1] && SI[i] >= SI[i - 1] && S3[i] <= S4[i] && S4[i] <= SI[i] + 1e-15 && SI[i] < 3)) throw new Error('monotonicity or ordering violated at n=' + NS[i]);
  if (!(S3[S3.length - 1] < 8 / 5 && S4[S4.length - 1] < 2)) throw new Error('limits violated');
  const reg = JSON.parse(fs.readFileSync(pth.join(ROOT, 'data/BANNER_PALETTES.json'), 'utf8'));
  const { palettes } = require('./banner-palettes');
  const bsaved = reg.assignments.find(r => r.slug === SLUG); if (!bsaved) throw new Error('no saved banner palette'); const bname = bsaved.palette;
  const tp = require('./thumbnail-palettes');
  const tsaved = tp.load().assignments.find(r => r.slug === SLUG); if (!tsaved) throw new Error('no saved thumbnail palette');
  const tname = tsaved.editorialPalette || tsaved.palette;
  const svg = frame(draw(), { name: bname, colors: palettes[bname] });
  fs.writeFileSync(pth.join(ROOT, 'assets/art', SLUG + '.svg'), svg);
  console.log('art:', SLUG, 'banner palette', bname, '| thumbnail palette', tname, '| sigma(40,3) =', S3[S3.length - 1].toFixed(4), 'sigma(40,4) =', S4[S4.length - 1].toFixed(4), 'limit(40) =', SI[SI.length - 1].toFixed(4));
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
