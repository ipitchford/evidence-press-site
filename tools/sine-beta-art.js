'use strict';
const { bannerSvg } = require('./svg-xml');
// Log-concavity and positive dependence in Sine-β and Hua–Pickrell processes: banner, OG card and thumbnail.
// "This image helps the reader understand" why the paper can prove log-concavity for points labelled from a fixed
// origin: n particles of the circular β-ensemble are cut at the origin and unrolled, so the first point to the right
// of 0 is always the first coordinate y1 (Z_0 = y1, Z_1 = y2, ...) and the first point to the left is always the last
// coordinate shifted by one turn (Z_-1 = y_n − n, ...). Labels are fixed coordinates, with no random rank, so
// log-concavity and MTP2 of the cut density pass to every labelled marginal and to Sine-β (Theorem 2.1; Sections 1.4,
// 3.2 of the paper, display (14): Z_j = y_{j+1}, Z_{-r} = y_{n-r+1} − n). The hook is Theorem 2.4 with Table 1:
// Var(G) ≤ 1/(β+1); at β = 2 the bound is 1/3 against the exact 0.180 (sine2_calibration.json variance_exact 0.17999).
// The particle positions are a schematic for n = 10, not data.
// Usage: node tools/sine-beta-art.js [--render OUTDIR_FOR_INSPECTION] [--no-mirror]
const SLUG = 'sine-beta-log-concavity';
const ink = '#f4f1ea', muted = '#dfe6ec', dim = '#b9c8d4';
const rightC = '#7fe0c8', leftC = '#ffc27a', otherC = '#a9b9c6', cutC = '#ffd76a';
const SANS = 'Arial,Helvetica,sans-serif', SERIF = 'Georgia,serif';
const text = (x, y, s, size = 18, color = ink, anchor = 'start', weight = 'normal', family = SANS, style = 'normal') =>
  `<text class="og-hide" x="${x}" y="${y}" fill="${color}" font-family="${family}" font-size="${size}" font-weight="${weight}" font-style="${style}" text-anchor="${anchor}">${s}</text>`;
const f = v => (+v).toFixed(1);
const N = 10;
// Schematic positions (fraction of the circumference, clockwise from the cut at 0); y_k = n * U[k-1].
const U = [0.06, 0.155, 0.26, 0.355, 0.45, 0.55, 0.645, 0.75, 0.845, 0.94];
const colourOf = k => (k <= 3 ? rightC : k >= N - 1 ? leftC : otherC); // k = 1..n
const CX = 165, CY = 212, RAD = 86;
function circle() {
  const pt = u => { const a = -Math.PI / 2 + 2 * Math.PI * u; return [CX + RAD * Math.cos(a), CY + RAD * Math.sin(a)]; };
  const gap = 0.012;
  const [x0, y0] = pt(gap), [x1, y1] = pt(1 - gap);
  let s = `<path d="M${f(x0)} ${f(y0)} A${RAD} ${RAD} 0 1 1 ${f(x1)} ${f(y1)}" fill="none" stroke="${muted}" stroke-width="2"/>`;
  s += `<path d="M${CX} ${CY - RAD - 15} V${CY - RAD + 15}" stroke="${cutC}" stroke-width="3.5"/>`;
  s += text(CX, CY - RAD - 22, '0 (cut)', 15, cutC, 'middle', 'bold');
  U.forEach((u, i) => {
    const [x, y] = pt(u);
    s += `<circle cx="${f(x)}" cy="${f(y)}" r="7" fill="${colourOf(i + 1)}" stroke="#10202b" stroke-width="1.5"/>`;
  });
  const [a1, b1] = pt(U[0]), [an, bn] = pt(U[N - 1]);
  s += text(a1 + 14, b1 - 2, 'y₁', 16, rightC, 'start', 'bold');
  s += text(an - 14, bn - 2, 'yₙ', 16, leftC, 'end', 'bold');
  s += text(CX, CY + 7, 'n particles', 14, dim, 'middle', 'normal', SERIF, 'italic');
  s += text(CX, CY + RAD + 30, 'circular β-ensemble', 15, muted, 'middle');
  return s;
}
const LY = 205, LX0 = 410, LX1 = 1160, ORIGIN = 785, UNIT = 68;
const LX = v => ORIGIN + v * UNIT;
function unrolled() {
  let s = `<path d="M318 ${CY} H372" stroke="${muted}" stroke-width="2.2"/><path d="M372 ${CY - 7} L386 ${CY} L372 ${CY + 7} Z" fill="${muted}"/>`;
  s += text(352, CY - 14, 'cut and unroll', 13, dim, 'middle', 'normal', SERIF, 'italic');
  s += `<path d="M${LX0} ${LY} H${LX1}" stroke="${muted}" stroke-width="2"/>`;
  s += `<path d="M${ORIGIN} ${LY - 34} V${LY + 16}" stroke="${cutC}" stroke-width="3.5"/>`;
  s += text(ORIGIN, LY + 36, '0', 18, cutC, 'middle', 'bold');
  // Right of 0: Z_j = y_{j+1}; left of 0: Z_{-r} = y_{n-r+1} - n.
  const sub = ['₀', '₁', '₂', '₃', '₄', '₅'];
  for (let j = 0; j < 5; j++) {
    const v = N * U[j], x = LX(v);
    s += `<circle cx="${f(x)}" cy="${LY}" r="8" fill="${colourOf(j + 1)}" stroke="#10202b" stroke-width="1.5"/>`;
    s += text(x, LY - 20, 'Z' + sub[j], 18, j < 3 ? rightC : otherC, 'middle', 'bold');
  }
  for (let r = 1; r <= 5; r++) {
    const k = N - r + 1, v = N * U[k - 1] - N, x = LX(v);
    s += `<circle cx="${f(x)}" cy="${LY}" r="8" fill="${colourOf(k)}" stroke="#10202b" stroke-width="1.5"/>`;
    s += text(x, LY - 20, 'Z₋' + sub[r], 18, r <= 2 ? leftC : otherC, 'middle', 'bold');
  }
  s += text(LX(N * U[0]), LY + 36, '= y₁', 15, rightC, 'middle');
  s += text(LX(N * U[1]), LY + 36, '= y₂', 15, rightC, 'middle');
  s += text(LX(N * U[N - 1] - N), LY + 58, '= yₙ − n', 15, leftC, 'middle');
  s += text(LX(N * U[N - 2] - N), LY + 36, '= yₙ₋₁ − n', 15, leftC, 'middle');
  s += text(LX(2.6), LY + 70, 'labels are fixed coordinates: no random rank', 15, ink, 'middle', 'bold');
  return s;
}
function hook() {
  const x0 = 640, y0 = 300, w = 520, h = 74;
  let s = `<rect x="${x0}" y="${y0}" width="${w}" height="${h}" rx="10" fill="#0c1820" fill-opacity="0.55" stroke="${rightC}" stroke-opacity="0.7"/>`;
  s += text(x0 + 20, y0 + 30, 'Typical spacing G (mean 1):  Var(G) ≤ 1/(β+1)', 19, ink, 'start', 'bold');
  s += text(x0 + 20, y0 + 57, 'At β = 2 the bound is 1/3; the exact value is 0.180', 16, muted);
  return s;
}
const draw = () =>
  text(40, 48, 'Cut the circle at the origin, and every labelled point becomes a fixed coordinate', 25, ink, 'start', 'normal', SERIF) +
  text(40, 76, 'Why points counted from a fixed origin in Sine-β have log-concave, positively dependent (MTP₂) joint laws, for every β', 15, muted) +
  circle() + unrolled() + hook() +
  text(40, 352, 'Proved for every β > 0 (Theorem 2.1);', 15, ink) +
  text(40, 372, 'conjectured by Johnston and Prochno in 2024.', 15, ink) +
  text(40, 392, 'Schematic: n = 10 points drawn for illustration, not data.', 11.5, dim, 'start', 'normal', SERIF, 'italic');
const description = 'Banner for a paper proving that points of the Sine-beta process, counted outward from a fixed origin, have log-concave and positively dependent (MTP2) joint laws for every beta. On the left, ten particles of the circular beta-ensemble sit on a circle; a yellow mark at the top labelled 0 shows where the circle is cut. The first particle clockwise from the cut, y1, is teal and the last, y n, is amber. An arrow labelled cut and unroll leads to a horizontal line with 0 marked in yellow. To the right of 0 the points are labelled Z0, Z1, Z2 and so on, with Z0 equal to y1 and Z1 equal to y2; to the left they are labelled Z minus 1, Z minus 2 and so on, with Z minus 1 equal to y n minus n and Z minus 2 equal to y n minus 1 minus n. A caption reads: labels are fixed coordinates, no random rank. A box on the right states the consequence for the typical spacing G of mean one: the variance of G is at most 1 over beta plus 1, and at beta equal to 2 the bound is one third while the exact value is 0.180. Text at the bottom left says the result is proved for every beta (Theorem 2.1) and was conjectured by Johnston and Prochno in 2024, and that the ten points are a schematic, not data.';
function frame(inner, background) {
  return bannerSvg({ inner, description, background, glow: { color: rightC, cx: '0.62', cy: '0.5', r: '0.5', opacity: '0.06' } });
}
const thumbSpec = {
  kicker: ['RESEARCH RELEASE · NOVEMBER 2026', 'RANDOM MATRIX THEORY'],
  head: ['Cut the circle', 'at the <em>origin</em>'], headSize: 64,
  sub: 'Eigenvalue patterns of large random matrices: for every β, points counted from a fixed origin have log-concave, positively dependent laws. This proves a 2024 conjecture, with optimal Gamma bounds for spacings.',
  tag: 'UNREFEREED CANDIDATE',
  hero: '<div class="eq-label">typical spacing, mean 1</div><div class="hero-title">Var ≤ 1/(β+1)</div><div class="note">β = 2: bound 1/3<br>exact value 0.180<br>shape β+1 cannot be improved</div><div class="eq-foot">large gaps: bound loose</div>'
};
module.exports = { draw, description, thumbSpec };
if (require.main === module) (async () => {
  const fs = require('fs'), pth = require('path'), os = require('os'), vm = require('vm');
  const ROOT = pth.join(__dirname, '..');
  // Guards: the drawn hook and labelling match the paper and its recorded output.
  // variance_exact and variance_bound as recorded in verification/output/sine2_calibration.json of the release.
  const cal = { variance_exact: 0.17999387769183994, variance_bound: 0.3333333333333333 };
  if (Math.abs(cal.variance_exact - 0.180) > 5e-4 || Math.abs(cal.variance_bound - 1 / (2 + 1)) > 1e-12) throw new Error('hook values do not match the recorded calibration');
  if (U.length !== N || U.some((u, i) => u <= 0 || u >= 1 || (i && u <= U[i - 1]))) throw new Error('positions not ordered in (0,1)');
  if (!(N * U[N - 1] - N < 0 && N * U[0] > 0)) throw new Error('seam mapping');
  const { resolve: bannerResolve } = require('./banner-palettes');
  const bp = bannerResolve(SLUG); if (!bp) throw new Error('no banner palette');
  const tp = require('./thumbnail-palettes');
  const tname = tp.resolve(SLUG, true);
  const svg = frame(draw(), bp);
  fs.writeFileSync(pth.join(ROOT, 'assets/art', SLUG + '.svg'), svg);
  console.log('art:', SLUG, 'banner palette', bp.name, '| thumbnail palette', tname);
  const i = process.argv.indexOf('--render');
  if (i < 0) return;
  const inspect = process.argv[i + 1];
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
