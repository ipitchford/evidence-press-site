'use strict';
const { bannerSvg } = require('./svg-xml');
// Separated exponential rates: banner, OG card and thumbnail.
// "This image helps the reader understand" exactly which matrix sizes d admit Sra's q-product law (the region of his
// Conjecture 6.1, proved here as Theorem 4), and why the cutoff is sharp: in a staged lifetime with m slow stages the
// derivative Wronskians W_1..W_{m+1} are positive and W_{m+2} is negative, so the Polya frequency order is exactly m+1.
// Source (paper 0.1.0-candidate): Theorem 4 / (7.3) region t in ([0,q^(d-1)] U {q,...,q^(d-2)}) n [0,1), alpha = log t/log q;
// Section 8 table (slow rates 1, 2; fast mixture E_3/2 + E_4/2; x = log 2): W = 19/48, 235/384, 29/8, -255/128.
// Every W value drawn is recomputed below from the explicit partial-fraction density and checked against those fractions.
// Usage: node tools/separated-rates-art.js [--render OUTDIR_FOR_INSPECTION] [--no-mirror]
const SLUG = 'separated-rates-exact-polya-order';
const ink = '#f4f1ea', muted = '#e3d9c9', dim = '#c4b7a2';
const contC = '#8fd3ff', ptC = '#ffd77a', posC = '#9be3c0', negC = '#ff8f6b';
const SANS = 'Arial,Helvetica,sans-serif', SERIF = 'Georgia,serif';
const text = (x, y, s, size = 18, color = ink, anchor = 'start', weight = 'normal', family = SANS) =>
  `<text class="og-hide" x="${x}" y="${y}" fill="${color}" font-family="${family}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}">${s}</text>`;
const f = v => (+v).toFixed(1);
// --- exact model: f = E_1 * E_2 * (E_3/2 + E_4/2), W_r = det[D^i (-D)^j f](x), x = log 2 ---------------------------
// Convolution of distinct exponentials E_a: (prod a) sum_k e^{-a_k x} / prod_{j != k} (a_j - a_k).
const terms = rates => { const P = rates.reduce((p, a) => p * a, 1); return rates.map((a, k) => ({ lam: a, c: P / rates.reduce((p, b, j) => j === k ? p : p * (b - a), 1) })); };
const mix = [...terms([1, 2, 3]).map(t => ({ ...t, c: t.c / 2 })), ...terms([1, 2, 4]).map(t => ({ ...t, c: t.c / 2 }))];
const deriv = (n, x) => mix.reduce((s, t) => s + t.c * Math.pow(-t.lam, n) * Math.exp(-t.lam * x), 0);
const det = M => { const A = M.map(r => r.slice()), n = A.length; let d = 1; for (let i = 0; i < n; i++) { let p = i; for (let r = i + 1; r < n; r++) if (Math.abs(A[r][i]) > Math.abs(A[p][i])) p = r; if (p !== i) { [A[p], A[i]] = [A[i], A[p]]; d = -d; } d *= A[i][i]; for (let r = i + 1; r < n; r++) { const q = A[r][i] / A[i][i]; for (let c = i; c < n; c++) A[r][c] -= q * A[i][c]; } } return d; };
const X = Math.log(2);
const W = r => det(Array.from({ length: r }, (_, i) => Array.from({ length: r }, (_, j) => (j % 2 ? -1 : 1) * deriv(i + j, X))));
const Wv = [1, 2, 3, 4].map(W);
const Wfrac = ['19/48', '235/384', '29/8', '−255/128'], Wexact = [19 / 48, 235 / 384, 29 / 8, -255 / 128];
// --- region of Theorem 4 -----------------------------------------------------------------------------------------
const DMAX = 7, AMAX = 7.6;
const GX = 92, GW = 560, GY = 128, RH = 30;
const ax = a => GX + a / AMAX * GW, ry = d => GY + (DMAX - d) * RH;
function regionPanel() {
  let s = text(40, 108, 'Which matrix sizes d carry the law?', 15, ink, 'start', 'bold', SERIF);
  s += text(GX + GW, 108, 't = q^α,  0 &lt; q &lt; 1', 13, dim, 'end');
  for (let a = 0; a <= 7; a++) s += `<path d="M${f(ax(a))} ${GY - 12} V ${GY + (DMAX - 1) * RH + 12}" stroke="${muted}" stroke-opacity=".14"/>` + text(ax(a), GY + (DMAX - 1) * RH + 30, String(a), 12, dim, 'middle');
  s += text(GX + GW / 2, GY + (DMAX - 1) * RH + 50, 'α = log t / log q   (larger α = smaller t)', 12, dim, 'middle');
  for (let d = 1; d <= DMAX; d++) {
    const y = ry(d);
    s += text(GX - 14, y + 5, `d = ${d}`, 13, ink, 'end');
    const a0 = d - 1;
    s += `<path d="M${f(ax(a0))} ${y} H ${f(ax(AMAX) - 6)}" stroke="${contC}" stroke-width="7" stroke-linecap="round"/>`;
    if (d === 1) s += `<circle cx="${f(ax(0))}" cy="${y}" r="5" fill="#1d2633" stroke="${contC}" stroke-width="2.5"/>`;
    for (let k = 1; k <= d - 2; k++) s += `<circle cx="${f(ax(k))}" cy="${y}" r="5.5" fill="${ptC}"/>`;
  }
  const ly = GY + (DMAX - 1) * RH + 72;
  s += `<path d="M${GX} ${ly} h 26" stroke="${contC}" stroke-width="7" stroke-linecap="round"/>` + text(GX + 36, ly + 5, 'continuous range α ≥ d − 1', 12, contC, 'start', 'bold');
  s += `<circle cx="${GX + 262}" cy="${ly}" r="5.5" fill="${ptC}"/>` + text(GX + 274, ly + 5, 'isolated points α = 1, …, d − 2', 12, ptC, 'start', 'bold');
  return s;
}
function signPanel() {
  const X0 = 760;
  let s = text(X0, 108, 'Why it stops: exactly m + 1', 15, ink, 'start', 'bold', SERIF);
  s += text(X0, 128, 'm = 2 slow stages (rates 1, 2), then rate 3 or 4 at random', 12, dim);
  const y0 = 152, h = 36;
  Wv.forEach((v, i) => {
    const y = y0 + i * (h + 8), pos = v > 0, c = pos ? posC : negC;
    s += `<rect x="${X0}" y="${y}" width="46" height="${h}" rx="6" fill="${c}" fill-opacity=".9"/>`;
    s += text(X0 + 23, y + 25, pos ? '+' : '−', 24, '#13202b', 'middle', 'bold');
    s += text(X0 + 62, y + 24, `W<tspan baseline-shift="sub" font-size="12">${i + 1}</tspan>(log 2) = ${Wfrac[i]}`, 17, c, 'start', 'bold', SERIF);
  });
  const yb = y0 + 4 * (h + 8) + 10;
  s += text(X0, yb + 6, 'order 3 = m + 1, never 4; W₄ &lt; 0 at every x &gt; 0', 13, ink, 'start', 'bold');
  s += text(X0, yb + 26, 'so matrix lifts exist only for d ≤ 3', 13, dim);
  return s;
}
const draw = () =>
  text(40, 50, 'Sra’s Conjecture 6.1: proved, with an exact cutoff', 26, ink, 'start', 'normal', SERIF) +
  text(40, 78, 'Slow exponential stages, then one fast stage of random speed: Pólya frequency order and matrix-lift dimension are both exactly m + 1', 14, muted) +
  regionPanel() + `<path d="M730 100 L 730 372" stroke="${muted}" stroke-opacity=".22" stroke-width="1.2"/>` + signPanel();
const description = `Banner for a paper on exact total positivity. Left: the parameter region of Sra's Conjecture 6.1, proved in the paper. For matrix sizes d = 1 to 7 (rows) and alpha = log t / log q on the horizontal axis, a matrix law exists on a continuous blue range alpha at least d - 1, plus isolated yellow points at alpha = 1, ..., d - 2; for d = 1 every alpha > 0 works. Right: for a waiting time with two slow exponential stages (rates 1 and 2) followed by a fast stage of rate 3 or 4 chosen at random, the derivative Wronskians at x = log 2 are W1 = 19/48, W2 = 235/384 and W3 = 29/8, all positive, and W4 = -255/128, negative; so the Polya frequency order is exactly 3 = m + 1, and matrix lifts exist only for d at most 3.`;
function frame(inner, background) {
  return bannerSvg({ inner, description, background, glow: { color: contC, cx: '0.3', cy: '0.6', r: '0.45', opacity: '0.06' } });
}
const thumbSpec = {
  kicker: ['RESEARCH RELEASE · NOVEMBER 2026', 'TOTAL POSITIVITY · RANDOM MATRICES'],
  head: ['m slow stages:', '<em>order exactly m + 1</em>'], headSize: 64,
  sub: 'A waiting time of m slow stages and one randomly fast stage is Pólya frequency of order exactly m + 1, and m + 1 is its largest matrix dimension.',
  tag: 'UNREFEREED CANDIDATE',
  hero: `<div class="eq-label">m = 2 slow stages, x = log 2</div><div class="hero-title">W₃ = 29/8 &gt; 0<br>W₄ = −255/128</div><div class="note">positive up to m + 1<br>negative at m + 2<br>Sra's Conjecture 6.1: proved</div><div class="eq-foot">written proofs · exact rational checks</div>`
};
module.exports = { draw, description, thumbSpec, Wv };
function guards() {
  Wv.forEach((v, i) => { if (Math.abs(v - Wexact[i]) > 1e-9 * Math.max(1, Math.abs(Wexact[i]))) throw new Error(`W${i + 1} = ${v} does not match ${Wfrac[i]}`); });
  // Theorem 4 at q = 1/2, t = 3/16 (2 < alpha < 3): Sra's moment d! prod_{j<d} (q^j - t)/(1 - q^{j+1}) is 65/224 at d = 3, -13/168 at d = 4.
  const mom = d => { let p = 1; for (let j = 0; j < d; j++) p *= (j + 1) * (Math.pow(0.5, j) - 3 / 16) / (1 - Math.pow(0.5, j + 1)); return p; };
  if (Math.abs(mom(3) - 65 / 224) > 1e-12 || Math.abs(mom(4) + 13 / 168) > 1e-12) throw new Error('moment check failed');
  const alpha = Math.log(3 / 16) / Math.log(0.5); if (!(alpha > 2 && alpha < 3)) throw new Error('alpha out of range');
}
if (require.main === module) (async () => {
  guards();
  const fs = require('fs'), pth = require('path'), os = require('os'), vm = require('vm');
  const ROOT = pth.join(__dirname, '..');
  const reg = JSON.parse(fs.readFileSync(pth.join(ROOT, 'data/BANNER_PALETTES.json'), 'utf8'));
  const { palettes } = require('./banner-palettes');
  const bsaved = reg.assignments.find(r => r.slug === SLUG); if (!bsaved) throw new Error('no saved banner palette'); const bname = bsaved.palette;
  const tp = require('./thumbnail-palettes');
  const tsaved = tp.load().assignments.find(r => r.slug === SLUG); if (!tsaved) throw new Error('no saved thumbnail palette');
  const tname = tsaved.editorialPalette || tsaved.palette;
  const svg = frame(draw(), { name: bname, colors: palettes[bname] });
  fs.writeFileSync(pth.join(ROOT, 'assets/art', SLUG + '.svg'), svg);
  console.log('art:', SLUG, 'banner palette', bname, '| thumbnail palette', tname, '| W =', Wv.map(v => v.toFixed(6)).join(', '));
  const i = process.argv.indexOf('--render');
  if (i < 0) return;
  const inspect = process.argv[i + 1];
  fs.mkdirSync(inspect, { recursive: true });
  const { chromium } = require('playwright');
  const b = await chromium.launch(process.env.EVIDENCE_PRESS_CHROME ? { executablePath: process.env.EVIDENCE_PRESS_CHROME } : {});
  const shot = async (wd, h, html, file, opts = {}) => {
    const pg = await b.newPage({ viewport: { width: wd, height: h }, deviceScaleFactor: opts.dpr || 1 });
    await pg.setContent(html, { waitUntil: 'networkidle' });
    await pg.screenshot({ path: file, ...(opts.jpeg ? { type: 'jpeg', quality: 94 } : {}) });
    await pg.close();
  };
  const body = (wd, h, inner) => `<!DOCTYPE html><html><head><meta charset="utf-8"><style>*{margin:0}body{width:${wd}px;height:${h}px;background:#222}svg{width:${wd}px;height:${h}px;display:block}</style></head><body>${inner}</body></html>`;
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
