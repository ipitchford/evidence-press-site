'use strict';
// Logarithmic Stenger integration matrices: banner, OG card and thumbnail.
// Sources (paper: Positive stability of logarithmic Stenger integration matrices, 22 Oct 2026):
//  - Theorem 2.2: U_n (integrate from 0) is positive stable at every degree iff -1 < alpha <= 1, for every m > 0;
//    for alpha > 1 the number of unstable eigenvalues tends to infinity.
//  - Theorem 2.4: (i) V_n (integrate to 1) for m > 1 has a diverging unstable count; (ii) stable at every degree
//    for 0 < m <= 1 and alpha >= m/2 - 1; (iii) V_13 at m = 1, alpha = -9/10 has exactly two unstable eigenvalues.
//  - Table 5 (exact Routh counts at m = 1): first unstable n = 13, 15, 17, 22 for alpha = -9/10, -4/5, -7/10, -3/5.
//  - Conjecture 7.1: at m = 1 the exact reverse boundary is alpha = -1/2 (open).
//  - Theorem 2.1 and Lemma 5.1: n^2 lambda_n -> zeros of F_gamma(z) = 1F1(1; gamma+1; -z), gamma = alpha (U_n) or m (V_n);
//    F_1(z) = (1 - e^{-z})/z has zeros 2 pi i k on the imaginary axis; for gamma > 1 all zeros have Re z < 0.
//  - Table 6 (numerical, mpmath): first three upper zeros of F_gamma for gamma = 3/2, 2, 3.
// Regions are drawn from the stated inequalities; the zero positions are the paper's tabulated values.
//
// Usage: node tools/stenger-art.js [--render OUTDIR_FOR_INSPECTION] [--no-mirror]
//   Writes assets/art/<slug>.svg; with --render also assets/og/<slug>.png, thumbs/<slug>.jpg,
//   the byte-identical central mirror ~/thumbs/<slug>.jpg and inspection PNGs (needs Playwright).
// Palette registries are NOT written here: the saved assignments in data/*_PALETTES.json are used.
const SLUG = 'logarithmic-stenger-matrix-stability';
const ink = '#f6efe4', muted = '#e2d5c3', dim = '#cdbfae';
const safe = '#c9b6ff', bad = '#ffb347', star = '#ff7a5c', open = '#a99c8c';
const SANS = 'Arial,Helvetica,sans-serif', SERIF = 'Georgia,serif';
const text = (x, y, s, size = 18, color = ink, anchor = 'start', weight = 'normal', family = SANS) =>
  `<text class="og-hide" x="${x}" y="${y}" fill="${color}" font-family="${family}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}">${s}</text>`;
const sub = s => `<tspan baseline-shift="sub" font-size="72%">${s}</tspan>`;
const sup = s => `<tspan baseline-shift="super" font-size="70%">${s}</tspan>`;
const f = v => (+v).toFixed(1);

// Shared alpha axis for the forward strip and the reverse map.
const A0 = -1, A1 = 2.5, XL = 74, XR = 540;
const ax = a => XL + (a - A0) / (A1 - A0) * (XR - XL);
// reverse map: m from 0 to 2
const MY0 = 362, MY1 = 196, M1 = 2;
const my = m => MY0 - m / M1 * (MY0 - MY1);
// Exact reverse onset degrees at m = 1 (Table 5).
const onsets = [[-0.9, 13], [-0.8, 15], [-0.7, 17], [-0.6, 22]];
// Kummer zeros, upper half-plane (Table 6, numerical; gamma = 1 exact: 2 pi k i).
const zeros = {
  '1': [1, 2, 3].map(k => [0, 2 * Math.PI * k]),
  '3/2': [[-1.1121, 6.92194], [-1.42204, 13.2617], [-1.61247, 19.5687]],
  '2': [[-2.08884, 7.46149], [-2.66407, 13.8791], [-3.0263, 20.2238]],
  '3': [[-3.8386, 8.36682], [-4.85726, 14.9589], [-5.52063, 21.3985]]
};
const zcol = { '1': ink, '3/2': '#ffe08a', '2': bad, '3': star };
if (zeros['3/2'].some(z => z[0] >= 0) || zeros['2'].some(z => z[0] >= 0) || zeros['3'].some(z => z[0] >= 0)) throw new Error('zero data');

function maps() {
  let s = '';
  s += text(30, 46, 'Where the integration matrices are safe', 19, ink, 'start', 'bold');
  s += text(30, 68, `Gaussian nodes for x${sup('α')}[log(1/x)]${sup('m')} on (0, 1); safe = every eigenvalue has Re λ &gt; 0`, 13.5, dim);
  // forward strip
  const y = 112;
  s += text(30, 96, `forward U${sub('n')}: integrate from 0 · any m &gt; 0`, 14, muted, 'start', 'bold');
  s += `<rect x="${ax(-1)}" y="${y}" width="${f(ax(1) - ax(-1))}" height="14" rx="3" fill="${safe}" fill-opacity=".85"/>`;
  s += `<rect x="${ax(1)}" y="${y}" width="${f(ax(2.5) - ax(1))}" height="14" rx="3" fill="${bad}" fill-opacity=".85"/>`;
  s += `<path d="M${ax(1)} ${y - 6} V${y + 20}" stroke="${ink}" stroke-width="2"/>`;
  s += text(ax(0), y + 36, 'stable at every degree', 12.5, safe, 'middle', 'bold');
  s += text(ax(1.75), y + 36, 'unstable for all large n; count → ∞', 12.5, bad, 'middle', 'bold');
  s += text(ax(1), y - 10, 'α = 1', 12.5, ink, 'middle', 'bold');
  // reverse map
  s += text(30, 180, `reverse V${sub('n')}: integrate to 1`, 14, muted, 'start', 'bold');
  // m > 1: unstable
  s += `<rect x="${ax(-1)}" y="${my(2)}" width="${f(ax(2.5) - ax(-1))}" height="${f(my(1) - my(2))}" fill="${bad}" fill-opacity=".30"/>`;
  s += text(ax(1.55), my(1.5) + 5, 'm &gt; 1: unstable for all large n', 13, bad, 'middle', 'bold');
  // stable region 0<m<=1, alpha >= m/2 - 1
  s += `<path d="M${ax(-1)} ${my(0)} L${ax(-0.5)} ${my(1)} L${ax(2.5)} ${my(1)} L${ax(2.5)} ${my(0)} z" fill="${safe}" fill-opacity=".32"/>`;
  s += text(ax(1.35), my(0.5) + 5, 'stable at every degree', 13, safe, 'middle', 'bold');
  s += text(ax(1.35), my(0.5) + 22, 'α ≥ m/2 − 1, m ≤ 1', 12, safe, 'middle');
  // open triangle
  s += `<defs><pattern id="hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path d="M0 0 V6" stroke="${open}" stroke-width="1.4" stroke-opacity=".7"/></pattern></defs>`;
  s += `<path d="M${ax(-1)} ${my(0)} L${ax(-1)} ${my(1)} L${ax(-0.5)} ${my(1)} z" fill="url(#hatch)"/>`;
  s += `<path d="M${ax(-1)} ${my(0)} L${ax(-0.5)} ${my(1)}" stroke="${safe}" stroke-width="1.6"/>`;
  // m = 1 line and exact instances
  s += `<path d="M${ax(-1)} ${my(1)} H${ax(2.5)}" stroke="${ink}" stroke-width="1.2" stroke-opacity=".6"/>`;
  for (const [a] of onsets.slice(1)) s += `<circle cx="${f(ax(a))}" cy="${my(1)}" r="3.6" fill="${star}"/>`;
  const sx = ax(-0.9), sy = my(1);
  const pts = [...Array(10)].map((_, i) => { const r = i % 2 ? 3.4 : 8; const t = -Math.PI / 2 + i * Math.PI / 5; return `${f(sx + r * Math.cos(t))},${f(sy + r * Math.sin(t))}`; }).join(' ');
  s += `<polygon points="${pts}" fill="${star}" stroke="${ink}" stroke-width="1"/>`;
  s += `<circle cx="${ax(-0.5)}" cy="${my(1)}" r="5" fill="none" stroke="${ink}" stroke-width="1.6" stroke-dasharray="2 2"/>`;
  // callouts
  s += `<path d="M${f(sx + 5)} ${f(sy - 7)} L${f(sx + 20)} ${my(2) + 40}" stroke="${star}" stroke-width="1.2"/>`;
  // axes
  s += `<path d="M${XL} ${my(0)} H${XR}" stroke="${muted}" stroke-width="1.2"/>`;
  for (const a of [-1, 0, 1, 2]) s += `<path d="M${ax(a)} ${my(0)} v5" stroke="${muted}"/>` + text(ax(a), my(0) + 18, String(a).replace('-', '−'), 12, dim, 'middle');
  s += text(ax(-0.5), my(0) + 18, '−½', 12, dim, 'middle');
  s += text(XR, my(0) + 18, 'α', 14, dim, 'end', 'bold', SERIF);
  s += `<path d="M${XL} ${my(0)} V${my(2)}" stroke="${muted}" stroke-width="1.2"/>`;
  for (const m of [0, 1, 2]) s += text(XL - 8, my(m) + 4, String(m), 12, dim, 'end');
  s += text(XL - 8, my(1.5) + 4, 'm', 14, dim, 'end', 'bold', SERIF);
  return s;
}

function caption() {
  let s = '';
  const x = ax(-0.9) + 30, y0 = my(2) + 8;
  s += `<rect x="${x - 10}" y="${y0 - 2}" width="214" height="62" rx="7" fill="#1e150e" fill-opacity=".72" stroke="${star}" stroke-opacity=".6"/>`;
  s += text(x, y0 + 15, `★ V${sub('13')}, α = −9/10, m = 1:`, 12.5, star, 'start', 'bold');
  s += text(x, y0 + 31, '2 unstable eigenvalues (exact)', 12, ink);
  s += text(x, y0 + 47, 'onset n = 13, 15, 17, 22 · ◌ −½ conj.', 11.5, dim);
  return s;
}

function plane() {
  let s = '';
  const X0 = 612;
  s += text(X0, 46, 'Why the exponent one is a knife edge', 19, ink, 'start', 'bold');
  s += text(X0, 68, `n${sup('2')}λ approaches the zeros ζ of F${sub('γ')}(z) = ${sub('1')}F${sub('1')}(1; γ+1; −z)`, 13.5, dim);
  s += text(X0, 86, `γ = α for U${sub('n')} (left end), γ = m for V${sub('n')} (right end)`, 13.5, dim);
  const R0 = -6.2, R1 = 1.6, PX0 = 640, PX1 = 1000, PY0 = 372, PY1 = 112;
  const px = r => PX0 + (r - R0) / (R1 - R0) * (PX1 - PX0);
  const py = i => PY0 - i / 22.5 * (PY0 - PY1);
  s += `<rect x="${PX0}" y="${PY1}" width="${f(px(0) - PX0)}" height="${PY0 - PY1}" fill="${bad}" fill-opacity=".13"/>`;
  s += `<rect x="${f(px(0))}" y="${PY1}" width="${f(PX1 - px(0))}" height="${PY0 - PY1}" fill="${safe}" fill-opacity=".12"/>`;
  s += text(PX0 + 8, PY0 - 10, 'Re ζ &lt; 0: unstable', 12.5, bad, 'start', 'bold');
  s += text(PX1 - 6, PY0 - 10, 'Re ζ &gt; 0', 12.5, safe, 'end', 'bold');
  s += `<path d="M${PX0} ${PY0} H${PX1}" stroke="${muted}" stroke-width="1.2"/>`;
  s += `<path d="M${f(px(0))} ${PY0} V${PY1}" stroke="${ink}" stroke-width="1.6"/>`;
  s += text(f(px(0)) - 4, PY1 + 12, 'Im', 12, dim, 'end', 'bold', SERIF);
  s += text(PX1, PY0 + 18, 'Re', 12, dim, 'end', 'bold', SERIF);
  for (const r of [-6, -4, -2, 0]) s += `<path d="M${f(px(r))} ${PY0} v5" stroke="${muted}"/>` + text(f(px(r)), PY0 + 18, String(r).replace('-', '−'), 11.5, dim, 'middle');
  // connect zeros of each gamma
  for (const [g, zs] of Object.entries(zeros)) {
    const d = zs.map((z, i) => `${i ? 'L' : 'M'}${f(px(z[0]))} ${f(py(z[1]))}`).join(' ');
    if (g !== '1') s += `<path d="${d}" stroke="${zcol[g]}" stroke-width="1.2" stroke-opacity=".55" fill="none"/>`;
    for (const z of zs) s += g === '1'
      ? `<circle cx="${f(px(z[0]))}" cy="${f(py(z[1]))}" r="5" fill="none" stroke="${ink}" stroke-width="2"/>`
      : `<circle cx="${f(px(z[0]))}" cy="${f(py(z[1]))}" r="4.4" fill="${zcol[g]}"/>`;
  }
  s += text(f(px(0)) + 14, f(py(2 * Math.PI)) + 4, '2πi', 12, ink, 'start', 'normal', SERIF);
  s += text(f(px(0)) + 14, f(py(4 * Math.PI)) + 4, '4πi', 12, ink, 'start', 'normal', SERIF);
  // legend
  const LX = 1016; let ly = 132;
  s += text(LX, ly, 'zeros ζ', 13, ink, 'start', 'bold'); ly += 22;
  s += `<circle cx="${LX + 6}" cy="${ly - 4}" r="5" fill="none" stroke="${ink}" stroke-width="2"/>` + text(LX + 18, ly, 'γ = 1: on the axis', 12, ink); ly += 14;
  s += text(LX + 18, ly, `F${sub('1')} = (1 − e${sup('−z')})/z`, 11.5, dim, 'start', 'normal', SERIF); ly += 24;
  for (const g of ['3/2', '2', '3']) { s += `<circle cx="${LX + 6}" cy="${ly - 4}" r="4.4" fill="${zcol[g]}"/>` + text(LX + 18, ly, `γ = ${g}`, 12, zcol[g], 'start', 'bold'); ly += 20; }
  ly += 6;
  s += text(LX, ly, 'γ &gt; 1: every zero', 12, bad, 'start', 'bold'); ly += 15;
  s += text(LX, ly, 'has Re ζ &lt; 0', 12, bad, 'start', 'bold'); ly += 15;
  s += text(LX, ly, 'γ ≤ 1: energy identity', 12, safe, 'start', 'bold'); ly += 15;
  s += text(LX, ly, 'keeps U-type spectra', 12, safe, 'start', 'bold'); ly += 15;
  s += text(LX, ly, 'stable', 12, safe, 'start', 'bold'); ly += 22;
  s += text(LX, ly, 'zeros for γ = 3/2, 2, 3:', 11, dim); ly += 13;
  s += text(LX, ly, 'numerical (paper Table 6)', 11, dim);
  return s;
}

const draw = () => maps() + caption() + plane() + `<path d="M590 30 V380" stroke="${muted}" stroke-opacity=".25"/>`;
const description = 'Banner for a paper on the positive stability of logarithmic-weight Stenger integration matrices. Left: where the matrices are safe, meaning every eigenvalue has positive real part, for Gaussian nodes of the weight x to the alpha times log(1/x) to the m on (0, 1). A horizontal strip for the forward matrix U_n, which integrates from 0, is coloured stable for alpha from −1 to 1 and unstable beyond alpha = 1, where for every m the matrix is unstable at all large degrees and the number of unstable eigenvalues tends to infinity. Below it a map in the (alpha, m) plane for the reverse matrix V_n, which integrates to 1: the band m > 1 is unstable at all large degrees; the region m ≤ 1 with alpha ≥ m/2 − 1 is stable at every degree; the remaining small triangle with alpha below m/2 − 1 is hatched as not settled. On the line m = 1 a star marks the exact counterexample V_13 at alpha = −9/10, which has two eigenvalues with negative real part, and dots mark further exact unstable instances at alpha = −4/5, −7/10 and −3/5, with first unstable degrees 13, 15, 17 and 22. A dashed circle at alpha = −1/2 marks the conjectured exact reverse boundary, which is open. Right: why the exponent one is a knife edge. After scaling by n squared, small eigenvalues approach the zeros of the Kummer function F_gamma(z) = 1F1(1; gamma + 1; −z), with gamma = alpha for U_n and gamma = m for V_n. In the complex plane, the zeros for gamma = 1 lie on the imaginary axis at 2 pi i, 4 pi i and 6 pi i, since F_1(z) = (1 − e^(−z))/z; the first three zeros for gamma = 3/2, 2 and 3 lie in the left half-plane, further left as gamma grows. For gamma > 1 every zero has negative real part, which produces the instabilities; for gamma ≤ 1 an energy identity keeps the forward spectra stable. Regions follow the paper’s theorems; the zero positions for gamma = 3/2, 2 and 3 are the paper’s numerical table values.';

function frame(inner, background) {
  const [c0, c1] = background.colors, W = 1200, H = 400, accent = bad;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" data-banner-palette="${background.name}" role="img" aria-labelledby="art-description">
<desc id="art-description">${description}</desc><defs>
<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
<stop offset="0" stop-color="${c0}"/><stop offset="1" stop-color="${c1}"/>
</linearGradient>
<radialGradient id="glow" cx="0.75" cy="0.55" r="0.7">
<stop offset="0" stop-color="${accent}" stop-opacity="0.08"/><stop offset="1" stop-color="${accent}" stop-opacity="0"/>
</radialGradient>
</defs>
<rect width="${W}" height="${H}" fill="url(#bg)"/>
<rect width="${W}" height="${H}" fill="url(#glow)"/>
${inner}
</svg>`;
}

const thumbSpec = {
  kicker: ['RESEARCH RELEASE · 22 OCTOBER 2026', 'NUMERICAL ANALYSIS · STENGER MATRICES'],
  head: ['Integrate backwards.', '<em>Lose stability.</em>'], headSize: 74,
  sub: 'A sharp safe range for logarithmic-weight integration matrices, and an exact counterexample to a 2019 conjecture.',
  tag: 'UNREFEREED CANDIDATE',
  hero: '<div class="eq-label">weight x<sup>α</sup> log(1/x) · α = −9/10 · n = 13</div><div class="hero-title">2 unstable</div><div class="note">eigenvalues of V₁₃, proved exactly<br>forward: safe at every n iff α ≤ 1<br>knife edge at exponent 1</div><div class="eq-foot">written proofs · exact rational certificate</div>'
};

module.exports = { draw, description, thumbSpec, onsets, zeros };
if (require.main === module) (async () => {
  const fs = require('fs'), pth = require('path'), os = require('os'), vm = require('vm');
  const ROOT = pth.join(__dirname, '..');
  const { palettes, assign } = require('./banner-palettes');
  const reg = JSON.parse(fs.readFileSync(pth.join(ROOT, 'data/BANNER_PALETTES.json'), 'utf8'));
  const bsaved = reg.assignments.find(r => r.slug === SLUG); if (!bsaved) throw new Error('run integrate.js first: no saved banner palette'); const bname = bsaved.palette;
  const tp = require('./thumbnail-palettes');
  const treg = tp.load();
  const tsaved = treg.assignments.find(r => r.slug === SLUG); if (!tsaved) throw new Error('run integrate.js first: no saved thumbnail palette');
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
    : { title: 'Positive stability of logarithmic Stenger integration matrices', status: 'unrefereed-candidate', datePublished: '2026-10-22' };
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
