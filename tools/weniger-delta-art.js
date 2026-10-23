'use strict';
// Nonreal poles of Weniger's delta transformation for Stieltjes series: banner, OG card and thumbnail.
// Sources (paper: Nonreal poles of Weniger's delta transformation for Stieltjes series: a finite-order
// classification, 23 Oct 2026):
//  - Abstract / Table tab:classification (Theorem thm:main): every Stieltjes measure gives a real-rooted
//    denominator Q_k at orders k = 1, 2; at k = 3 exactly when b = n + beta <= (sqrt(33) - 5)/2 ~ 0.3723;
//    for k >= 4 no choice of n, beta protects every measure ("unsafe": some admissible measure gives a genuine
//    nonreal conjugate pair of poles).
//  - Section sec:practice and Figure fig:poles: order 3, n = 0, beta = 1, measure delta_1 + 50 delta_{1/50}
//    + 1e-3 e^{-t} dt. delta_3 has real poles at -0.0650 and 0 (positive residues 17.6, 32.7) and a genuine
//    nonreal pair -0.8832 +/- 0.0824i (residues 0.357 -/+ 1.360i). Pole positions are rounded floating-point
//    values; the paper certifies the nonreal pair in exact rational arithmetic.
//  - Classical contrast (paper, introduction): Pade approximants to a Stieltjes series have every pole on the
//    negative real axis, the branch cut.
//  - The plane below uses EQUAL scales on both axes, so the nearness of the pair to the cut is shown truly.
//
// Usage: node tools/weniger-delta-art.js [--render OUTDIR_FOR_INSPECTION] [--no-mirror]
//   Writes assets/art/<slug>.svg; with --render also assets/og/<slug>.png, thumbs/<slug>.jpg,
//   the byte-identical central mirror ~/thumbs/<slug>.jpg (never overwritten) and inspection PNGs.
// Palette registries are NOT written here: the saved assignments in data/*_PALETTES.json are used.
const SLUG = 'weniger-delta-nonreal-poles';
const ink = '#fff6ea', muted = '#ead8c2', dim = '#d2bb9f';
const cut = '#ffb45c', real = '#ffe2a8', pair = '#8fe3ff', yes = '#b6ec9c', no = '#ff9f8c';
const SANS = 'Arial,Helvetica,sans-serif', SERIF = 'Georgia,serif';
const text = (x, y, s, size = 18, color = ink, anchor = 'start', weight = 'normal', family = SANS) =>
  `<text class="og-hide" x="${x}" y="${y}" fill="${color}" font-family="${family}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}">${s}</text>`;
const f = v => (+v).toFixed(1);
const sub = t => `<tspan baseline-shift="sub" font-size="72%">${t}</tspan>`;
const sup = t => `<tspan baseline-shift="super" font-size="72%">${t}</tspan>`;

// Certified example (rounded for display).
const PAIR = { re: -0.883229, im: 0.082425 }, REAL_POLES = [-0.065034, 0];
const BC = (Math.sqrt(33) - 5) / 2;

// Equal-scale complex plane: S pixels per unit on both axes.
const S = 620, OX = 762, AY = 246;
const X = re => OX + re * S;
const Y = im => AY - im * S;

function plane() {
  let s = '';
  // imaginary axis (faint) and positive real axis
  s += `<path d="M${OX} 118 V372" stroke="${muted}" stroke-opacity=".35" stroke-width="1.5"/>`;
  s += `<path d="M${OX} ${AY} H${f(X(0.1))}" stroke="${muted}" stroke-opacity=".45" stroke-width="2"/>`;
  s += text(OX + 10, 132, 'Im z', 15, dim, 'start', 'normal', SERIF);
  s += text(f(X(0.1) - 2), AY - 10, 'Re z', 15, dim, 'end', 'normal', SERIF);
  // the branch cut (-inf, 0]
  s += `<path d="M28 ${AY} H${OX}" stroke="${cut}" stroke-opacity=".22" stroke-width="16" stroke-linecap="round"/>`;
  s += `<path d="M28 ${AY} H${OX}" stroke="${cut}" stroke-width="5" stroke-linecap="round"/>`;
  s += text(30, AY + 30, '← −∞', 15, cut);
  for (const re of [-1, -0.5]) {
    s += `<path d="M${f(X(re))} ${AY + 6} V${AY + 13}" stroke="${muted}" stroke-opacity=".7" stroke-width="2"/>`;
    s += text(f(X(re)), AY + 31, re === -1 ? '−1' : '−0.5', 15, dim, 'middle');
  }
  s += text(590, AY + 62, 'branch cut (−∞, 0]', 21, cut, 'middle', 'bold');
  s += text(590, AY + 85, 'Padé approximants keep every pole on it', 16, muted, 'middle');
  // delta_3 real poles on the cut
  for (const re of REAL_POLES)
    s += `<circle cx="${f(X(re))}" cy="${AY}" r="8" fill="${real}" stroke="#2b1a0c" stroke-width="2.5"/>`;
  s += `<path d="M${f(X(-0.0325))} ${AY - 14} V${AY - 40}" stroke="${real}" stroke-opacity=".6" stroke-width="1.5"/>`;
  s += text(f(X(-0.0325) + 6), AY - 48, `δ${sub('3')} real poles: −0.065 and 0`, 16, real, 'end', 'bold');
  // the genuine nonreal pair (true positions, equal scales)
  const px = X(PAIR.re);
  s += `<path d="M${f(px)} ${f(Y(PAIR.im))} V${f(Y(-PAIR.im))}" stroke="${pair}" stroke-opacity=".35" stroke-dasharray="3 5" stroke-width="1.5"/>`;
  for (const sg of [1, -1]) {
    const py = Y(sg * PAIR.im);
    s += `<circle cx="${f(px)}" cy="${f(py)}" r="17" fill="${pair}" fill-opacity=".16"/>`;
    s += `<circle cx="${f(px)}" cy="${f(py)}" r="9" fill="${pair}" stroke="#2b1a0c" stroke-width="2.5"/>`;
  }
  s += text(f(px + 22), f(Y(PAIR.im) - 2), '−0.8832 + 0.0824i', 18, pair, 'start', 'bold');
  s += text(f(px + 22), f(Y(-PAIR.im) + 12), '−0.8832 − 0.0824i', 18, pair, 'start', 'bold');
  s += text(f(px - 20), 140, `δ${sub('3')}: a genuine nonreal pair, just off the cut`, 21, pair, 'start', 'bold');
  s += text(f(px + 22), f(Y(-PAIR.im) + 34), 'residue 0.357 − 1.360i', 15, muted);
  return s;
}

function strip() {
  const x0 = 878, xv = 966;
  let s = `<path d="M850 112 V360" stroke="${muted}" stroke-opacity=".22" stroke-width="1.5"/>`;
  s += text(x0, 134, 'Poles on the cut for every', 17, ink, 'start', 'bold');
  s += text(x0, 155, 'Stieltjes measure?', 17, ink, 'start', 'bold');
  const rows = [
    [196, 'k = 1, 2', 'always', yes, null],
    [240, 'k = 3', 'only if n + β ≤ 0.372', real, '0.372 ≈ (√33 − 5)/2'],
    [302, 'k ≥ 4', 'never guaranteed', no, 'some measure gives a nonreal pair']
  ];
  for (const [y, k, v, c, note] of rows) {
    s += text(x0, y, k, 17, ink, 'start', 'bold', SERIF);
    s += text(xv, y, v, 17, c, 'start', 'bold');
    if (note) s += text(xv, y + 21, note, 13.5, dim);
  }
  s += text(x0, 356, 'example shown: k = 3, n = 0, β = 1', 14, pair);
  return s;
}

const draw = () => text(40, 50, 'Weniger’s delta transformation can put poles off the cut', 27, ink, 'start', 'normal', SERIF) +
  text(40, 80, 'Order-3 delta transformation of one Stieltjes series: two real poles on the cut and a genuine nonreal pair beside it', 16.5, muted) +
  plane() + strip() +
  text(40, 388, 'measure δ₁ + 50 δ<tspan baseline-shift="sub" font-size="75%">1/50</tspan> + 10' + sup('−3') + ' e' + sup('−t') + ' dt · equal scales on both axes · positions rounded; the paper certifies the nonreal pair exactly', 12.5, dim);

const description = 'Banner for a paper classifying when Weniger’s delta transformation of a Stieltjes series has all its poles on the branch cut. Left: the complex z-plane drawn with equal scales on both axes. The branch cut, the negative real axis from minus infinity to 0, is a thick amber line labelled as the place where Padé approximants keep every pole. For the order-3 delta transformation with n = 0, beta = 1 and the positive measure delta_1 + 50 delta_{1/50} + 10^-3 e^-t dt, two real poles sit on the cut at -0.065 and 0, and a genuine nonreal conjugate pair sits just off it at -0.8832 plus or minus 0.0824i, with residue 0.357 minus 1.360i at the lower pole and its conjugate at the upper. Positions are rounded; the paper certifies the nonreal pair in exact rational arithmetic. Right: whether every Stieltjes measure keeps the delta poles on the cut, by order k: always at k = 1 and 2; at k = 3 only when n + beta is at most (sqrt(33) - 5)/2, about 0.372; from k = 4 on never guaranteed, because some measure gives a nonreal pair. The mechanism, in the paper: tuning the moments isolates three consecutive denominator coefficients, whose quadratic has nonreal roots exactly when h_j^2 is less than 4 h_{j-1} h_{j+1}, and the delta weights fail this factor-four test from order four.';

function frame(inner, background) {
  const [c0, c1] = background.colors, W = 1200, H = 400;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" data-banner-palette="${background.name}" role="img" aria-labelledby="art-description">
<desc id="art-description">${description}</desc><defs>
<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
<stop offset="0" stop-color="${c0}"/><stop offset="1" stop-color="${c1}"/>
</linearGradient>
<radialGradient id="glow" cx="0.2" cy="0.62" r="0.45">
<stop offset="0" stop-color="${pair}" stop-opacity="0.08"/><stop offset="1" stop-color="${pair}" stop-opacity="0"/>
</radialGradient>
</defs>
<rect width="${W}" height="${H}" fill="url(#bg)"/>
<rect width="${W}" height="${H}" fill="url(#glow)"/>
${inner}
</svg>`;
}

const thumbSpec = {
  kicker: ['RESEARCH RELEASE · OCTOBER 2026', 'CONVERGENCE ACCELERATION · CLASSIFICATION'],
  head: ['Padé: on the cut.', '<em>Delta: not always.</em>'], headSize: 70,
  sub: 'For Stieltjes series, Weniger’s delta transformation keeps every pole on the cut at orders one and two, at order three only for small shifts, and never universally from order four.',
  tag: 'UNREFEREED CANDIDATE',
  hero: '<div class="eq-label">order k · every Stieltjes measure</div><div class="hero-title">k ≤ 2 ✓ · k ≥ 4 ✕</div><div class="note">k = 3: safe exactly when<br>n + β ≤ (√33 − 5)/2 ≈ 0.372<br>example pair <b>−0.883 ± 0.082i</b></div><div class="eq-foot">written proofs · exact rational certificates</div>'
};

module.exports = { draw, description, thumbSpec, PAIR, REAL_POLES, BC };
if (require.main === module) (async () => {
  const fs = require('fs'), pth = require('path'), os = require('os'), vm = require('vm');
  const ROOT = pth.join(__dirname, '..');
  // Guards: displayed threshold and the factor-four mechanism must match the paper's formulas.
  if (Math.abs(BC - 0.3723) > 5e-5) throw new Error('threshold mismatch');
  const h = (k, b, j) => { let c = 1; for (let i = 0; i < j; i++) c = c * (k - i) / (i + 1); let p = 1; for (let i = 0; i < k - 1; i++) p *= b + j + i; return c * p; };
  const topRatio = (k, b) => h(k, b, k - 1) ** 2 / (h(k, b, k - 2) * h(k, b, k));
  if (!(topRatio(3, BC - 1e-6) >= 4 && topRatio(3, BC + 1e-6) < 4)) throw new Error('k = 3 factor-four threshold mismatch');
  for (let k = 4; k <= 30; k++) for (const b of [1e-9, 0.1, 1, 10]) if (!(topRatio(k, b) < 10 / 3 + 1e-9)) throw new Error('k >= 4 ratio not below 10/3');
  const { palettes } = require('./banner-palettes');
  const reg = JSON.parse(fs.readFileSync(pth.join(ROOT, 'data/BANNER_PALETTES.json'), 'utf8'));
  const bsaved = reg.assignments.find(r => r.slug === SLUG); if (!bsaved) throw new Error('no saved banner palette'); const bname = bsaved.palette;
  const tp = require('./thumbnail-palettes');
  const treg = tp.load();
  const tsaved = treg.assignments.find(r => r.slug === SLUG); if (!tsaved) throw new Error('no saved thumbnail palette');
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
  const metaPath = pth.join(ROOT, 'papers', SLUG, 'meta.json');
  const m = fs.existsSync(metaPath) ? JSON.parse(fs.readFileSync(metaPath, 'utf8'))
    : { title: 'Nonreal poles of Weniger’s delta transformation for Stieltjes series: a finite-order classification', status: 'unrefereed-candidate', datePublished: '2026-10-23' };
  console.log('og meta from', fs.existsSync(metaPath) ? metaPath : 'built-in fallback');
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
