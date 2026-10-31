'use strict';
const { bannerSvg, escapeText } = require('./svg-xml');
// How often can migration switch a population above or below its total carrying capacity?
// Banner, OG card and thumbnail. Sources (paper of 31 Oct 2026, DOI 10.5281/zenodo.23838088):
//  - Main panel: the exact three-patch example (7): r = (7/3, 1, 2), K = (1, 3, 1),
//    Gamma = M/138159. B(beta) = sum of the positive equilibrium of
//    x_i' = x_i (r_i - r_i x_i / K_i) + beta (Gamma x)_i, computed here by Newton continuation
//    (as in the paper's Figure 2, a numerical rendering). The five crossings of S = 5 are the exact
//    thresholds of Table 2; signs as in Corollary 7; B(infinity) = 5 - 1.246e-3 (-249 ppm, Lemma 3).
//  - Side panel: the bounds of Table 1 (N(2) = 1, N(3) = 5, 6 <= N(4) <= 13, n+2 <= N(n) <= 2^n - 3).
//  The curve illustrates; it is not evidence.
// Usage: node tools/biomass-crossings-art.js [--render OUTDIR_FOR_INSPECTION] [--no-mirror]
const SLUG = 'logistic-biomass-crossings';

// ---------- the model ----------
const r = [7 / 3, 1, 2], K = [1, 3, 1], S = 5;
const Mm = [[-142772, 18802, 138159], [82292, -25042, 321], [60480, 6240, -138480]];
const G = Mm.map(row => row.map(v => v / 138159));
const THR = [46053 / 252320, 5117 / 6400, 6579 / 2912, 6579 / 1640, 168861 / 27680];
const THR_LAB = ['46053/252320', '5117/6400', '6579/2912', '6579/1640', '168861/27680'];
function solve3(A, b) {
  const a = A.map((row, i) => [...row, b[i]]);
  for (let i = 0; i < 3; i++) {
    let p = i; for (let k = i + 1; k < 3; k++) if (Math.abs(a[k][i]) > Math.abs(a[p][i])) p = k;
    [a[i], a[p]] = [a[p], a[i]];
    for (let k = i + 1; k < 3; k++) { const f = a[k][i] / a[i][i]; for (let j = i; j < 4; j++) a[k][j] -= f * a[i][j]; }
  }
  const x = [0, 0, 0];
  for (let i = 2; i >= 0; i--) { let s = a[i][3]; for (let j = i + 1; j < 3; j++) s -= a[i][j] * x[j]; x[i] = s / a[i][i]; }
  return x;
}
let warm = K.slice();
function equilibrium(beta, start = warm) {
  let x = start.slice();
  for (let it = 0; it < 60; it++) {
    const Gx = G.map(row => row.reduce((s, g, j) => s + g * x[j], 0));
    const F = x.map((xi, i) => xi * (r[i] - r[i] / K[i] * xi) + beta * Gx[i]);
    const J = G.map((row, i) => row.map((g, j) => beta * g + (i === j ? r[i] - 2 * r[i] / K[i] * x[i] : 0)));
    const dx = solve3(J, F);
    x = x.map((v, i) => v - dx[i]);
    if (Math.max(...dx.map(Math.abs)) < 1e-15) break;
  }
  warm = x; return x;
}
const ppm = beta => 1e6 * (equilibrium(beta).reduce((s, v) => s + v, 0) / S - 1);
const must = (c, m) => { if (!c) throw new Error('check failed: ' + m); };
// continuation along the plotted range, with checks against the exact statements
const L0 = Math.log10(0.01), L1 = Math.log10(7.4), NPTS = 900;
warm = K.slice(); const curve = [];
for (let i = 0; i <= NPTS; i++) { const b = 10 ** (L0 + (L1 - L0) * i / NPTS); curve.push([b, ppm(b)]); }
THR.forEach((t, k) => { warm = equilibrium(t * 0.999); must(Math.abs(ppm(t)) < 1e-4, 'threshold ' + k); });
const signs = [0.1, 0.43, 1.3, 3, 5, 300].map(b => { warm = K.slice(); for (let i = 1; i <= 400; i++) equilibrium(b * i / 400); return Math.sign(ppm(b)); });
must(signs.join() === '1,-1,1,-1,1,-1', 'Corollary 7 sign pattern');
const peak = Math.max(...curve.map(p => Math.abs(p[1])));
must(peak < 4.4 && peak > 2.5, 'excursions of a few ppm');

// ---------- drawing ----------
const ink = '#eef1fb', muted = '#cdd3ea', dim = '#a9b1d3';
const curveC = '#ffd27a', aboveC = '#8fe0b0', belowC = '#ff9f8f', dotC = '#ffffff';
const SANS = 'Arial,Helvetica,sans-serif', SERIF = 'Georgia,serif';
const text = (x, y, s, size = 18, color = ink, anchor = 'start', weight = 'normal', family = SANS) =>
  `<text x="${x}" y="${y}" fill="${color}" font-family="${family}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}">${escapeText(s)}</text>`;
const f = v => (+v).toFixed(1);

function mainPanel() {
  const X0 = 78, X1 = 790, Ymid = 236, Yh = 108; // +/-4.4 ppm maps to +/-Yh
  const X = b => X0 + (Math.log10(b) - L0) / (L1 - L0) * (X1 - X0), Y = p => Ymid - p / 4.4 * Yh;
  let s = '';
  s += `<rect x="${X0}" y="${Ymid - Yh}" width="${X1 - X0}" height="${Yh}" fill="${aboveC}" fill-opacity=".07"/>`;
  s += `<rect x="${X0}" y="${Ymid}" width="${X1 - X0}" height="${Yh}" fill="${belowC}" fill-opacity=".07"/>`;
  s += text(X0 + 10, Ymid - Yh + 20, 'above S: migration raises total biomass', 13, aboveC, 'start', 'bold');
  s += text(X0 + 10, Ymid + Yh - 10, 'below S: migration lowers total biomass', 13, belowC, 'start', 'bold');
  s += `<path d="M${X0} ${Ymid} H${X1}" stroke="${muted}" stroke-opacity=".75" stroke-width="1.6"/>`;
  s += text(X1 + 8, Ymid + 5, 'S = 5', 14, muted, 'start', 'bold');
  for (const [b, lab] of [[0.01, '0.01'], [0.1, '0.1'], [1, '1'], [5, '5']]) s += `<path d="M${f(X(b))} ${Ymid + Yh} V${Ymid + Yh + 5}" stroke="${muted}" stroke-opacity=".6"/>` + text(f(X(b)), Ymid + Yh + 20, lab, 12.5, dim, 'middle');
  s += `<path d="M${X0} ${Ymid + Yh} H${X1}" stroke="${muted}" stroke-opacity=".35"/>`;
  const d = 'M' + curve.map(([b, p]) => `${f(X(b))} ${f(Y(p))}`).join(' L');
  s += `<path d="${d}" fill="none" stroke="${curveC}" stroke-width="3.6" stroke-linejoin="round" stroke-linecap="round"/>`;
  THR.forEach((t, k) => {
    s += `<circle cx="${f(X(t))}" cy="${Ymid}" r="6.5" fill="${dotC}" stroke="#151a36" stroke-width="2"/>`;
    s += text(f(X(t)), Ymid + (k % 2 === 0 ? -14 : 24), String(k + 1), 14, dotC, 'middle', 'bold');
  });
  s += text(X0, 104, 'Total biomass B(β) minus S, in parts per million, for one exact three-patch network', 14.5, ink, 'start', 'bold');
  s += text(f((X0 + X1) / 2), Ymid + Yh + 40, 'overall migration intensity β (log scale); five exact crossings, e.g. β₁ = 46053/252320', 13, dim, 'middle');
  s += text(X1 - 4, Ymid + Yh - 26, '→ as β → ∞, falls to −249 ppm', 12.5, belowC, 'end');
  return s;
}

function sidePanel() {
  const x0 = 880; let s = '';
  s += text(x0, 104, 'Most crossings possible', 15, ink, 'start', 'bold');
  s += text(x0, 124, 'with n patches, N(n)', 13, muted);
  const rows = [['2 patches', '1'], ['3 patches', '5'], ['4 patches', '6 to 13'], ['n patches', 'n + 2 to 2ⁿ − 3']];
  rows.forEach(([a, b], i) => {
    const y = 166 + i * 40;
    s += `<path d="M${x0} ${y + 13} H1150" stroke="${muted}" stroke-opacity=".18"/>`;
    s += text(x0, y, a, 15, muted);
    s += text(1150, y, b, i === 1 ? 19 : 16, i === 1 ? curveC : ink, 'end', 'bold');
  });
  s += text(x0, 340, 'Earlier question: is 3 the most', 12.5, dim);
  s += text(x0, 358, 'for three patches? No: exactly 5.', 12.5, dim);
  return s;
}

const draw = () => text(40, 52, 'Migration can switch a population above and below its carrying capacity five times', 25, ink, 'start', 'normal', SERIF) +
  text(40, 80, 'Three logistic patches allow exactly five crossings; the effects are a few parts per million and need finely tuned migration rates', 14.5, muted) +
  mainPanel() + sidePanel();

const description = 'Banner for a paper on the logistic patch model with migration. Main panel: for the paper\'s exact three-patch network (growth rates 7/3, 1 and 2, carrying capacities 1, 3 and 1, so total carrying capacity S = 5), the curve shows total equilibrium biomass minus 5, in parts per million, against the overall migration intensity on a logarithmic axis from 0.01 to 7.4. The curve starts above zero (migration raises total biomass), then crosses zero five times at exactly certified intensities, the first being 46053/252320, so that it is alternately above and below S, with excursions of at most a few parts per million; at very high migration it falls to 249 parts per million below S. Side panel: the most crossings possible with n patches: 1 for two patches, exactly 5 for three, between 6 and 13 for four, and between n + 2 and 2 to the n minus 3 in general. An earlier question asked whether three was the maximum for three patches; the answer is five. The curve is computed numerically from the model and illustrates an exactly certified example.';

function frame(inner, background) {
  return bannerSvg({ inner, description, background, glow: { color: curveC, cx: '0.35', cy: '0.6', r: '0.5', opacity: '0.06' } });
}

const thumbSpec = {
  kicker: ['RESEARCH RELEASE · 31 OCTOBER 2026', 'MATHEMATICAL ECOLOGY · OPEN QUESTION ANSWERED'],
  head: ['Five crossings,', '<em>not three.</em>'], headSize: 72,
  sub: 'As migration grows, three linked logistic patches can switch above and below their total carrying capacity five times.',
  tag: 'UNREFEREED CANDIDATE',
  hero: '<div class="eq-label">most crossings with n patches</div><div class="hero-title">N(3) = 5</div><div class="note">two patches: 1<br>four patches: 6 to 13<br>any n: n + 2 to 2ⁿ − 3</div><div class="eq-foot">written proofs · exact rational checks</div>'
};

module.exports = { draw, description, thumbSpec };
if (require.main === module) (async () => {
  const fs = require('fs'), pth = require('path'), os = require('os'), vm = require('vm');
  const ROOT = pth.join(__dirname, '..');
  console.log('check: signs', signs.join(' '), '| max |ppm| on [0.01, 8] =', peak.toFixed(3));
  const { resolve } = require('./banner-palettes');
  const bg = resolve(SLUG); if (!bg) throw new Error('no banner palette');
  const tname = require('./thumbnail-palettes').resolve(SLUG, true);
  const svg = frame(draw(), bg);
  fs.writeFileSync(pth.join(ROOT, 'assets/art', SLUG + '.svg'), svg);
  console.log('art:', SLUG, 'banner palette', bg.name, '| thumbnail palette', tname);
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
  {
    const p = await b.newPage({ viewport: { width: 1200, height: 400 } });
    await p.setContent(body(1200, 400, svg));
    const out = await p.evaluate(() => [...document.querySelectorAll('text')].map(t => { const r = t.getBBox(); return [t.textContent, r.x, r.y, r.x + r.width, r.y + r.height]; })
      .filter(([, x0, y0, x1, y1]) => x0 < 0 || y0 < 0 || x1 > 1200 || y1 > 400));
    await p.close();
    if (out.length) throw new Error('text outside viewBox: ' + JSON.stringify(out));
    console.log('all text boxes inside the 1200x400 viewBox');
  }
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
