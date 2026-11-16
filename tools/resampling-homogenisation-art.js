'use strict';
const { bannerSvg } = require('./svg-xml');
// Resampling heterogeneous experiments (resampling-homogenisation-constants): banner, OG, thumbnail.
// "This image helps the reader understand" the paper's headline numbers: for uniform resampling of n erasure experiments
// the sharp amplification factor C_n = E max(K, L) peaks at n = 3 with value 14/9 and decreases to about 1.524, and the
// concrete three-source example behind it (two weak opposing "rules out" signals and one blank source), together with
// the general bound c* <= 9/14 that it implies.
// checkHook recomputes C_n exactly from the multinomial law of (K, L) with BigInt rationals and compares the results with
// the released log (logs/extensions.json, C_infinity.C_n_exact_selected for n = 2, 3, 4, 5, 10, 20, 40), recomputes
// C_infinity = 1 + e^-2 (I_0(2) + I_1(2)) by series against the released value, and checks that C_3 = 14/9 is the
// maximum and that C_n decreases for n >= 3; it refuses to draw on mismatch.
// Reference: txgraffiti-order48-successor (one exact object balanced with immediately readable values).
// Usage: node tools/resampling-homogenisation-art.js [--render OUTDIR_FOR_INSPECTION] [--no-mirror]
const SLUG = 'resampling-homogenisation-constants';
const ink = '#f6f2ea', muted = '#e2e7ea', dim = '#c3ccd2', hot = '#ffc36b', cool = '#9fd3ff', rose = '#f2a7b5';
const SANS = 'Arial,Helvetica,sans-serif', SERIF = 'Georgia,serif';
const text = (x, y, s, size = 18, color = ink, anchor = 'start', weight = 'normal', family = SANS, style = 'normal') => {
  if (/[<&]/.test(s.replace(/<\/?tspan[^>]*>/g, ''))) throw new Error('unescaped < or & in SVG text: ' + s);
  return `<text class="og-hide" x="${x}" y="${y}" fill="${color}" font-family="${family}" font-size="${size}" font-weight="${weight}" font-style="${style}" text-anchor="${anchor}">${s}</text>`;
};
// ---- exact C_n = E max(K, L), (K, L, rest) ~ Mult(n; 1/n, 1/n, 1 - 2/n) ----
const gcd = (a, b) => { while (b) [a, b] = [b, a % b]; return a < 0n ? -a : a; };
function Cn(n) {
  const N = BigInt(n); const fact = [1n]; for (let i = 1n; i <= N; i++) fact.push(fact[fact.length - 1] * i);
  let num = 0n; // sum over k, l of n!/(k! l! r!) (n-2)^r max(k,l), all over n^n
  for (let k = 0; k <= n; k++) for (let l = 0; k + l <= n; l++) {
    const r = n - k - l;
    num += fact[n] / (fact[k] * fact[l] * fact[r]) * (N - 2n) ** BigInt(r) * BigInt(Math.max(k, l));
  }
  const den = N ** N; const g = gcd(num, den);
  return [num / g, den / g];
}
const val = ([p, q]) => Number(p * 10n ** 15n / q) / 1e15;
function Cinf() {
  let i0 = 0, i1 = 0, f = 1;
  for (let k = 0; k < 40; k++) { if (k > 0) f *= k; i0 += 1 / (f * f); i1 += 1 / (f * f * (k + 1)); }
  return 1 + Math.exp(-2) * (i0 + i1);
}
function checkHook() {
  // released logs/extensions.json: C_infinity.C_n_exact_selected and bessel_formula
  const released = { 2: '3/2', 3: '14/9', 4: '99/64', 5: '964/625', 10: '766573719/500000000',
    20: '801351289900139751844681/524288000000000000000000',
    40: '46123945630618243750157481138892411903365212783803391103293721/30223145490365729367654400000000000000000000000000000000000000' };
  for (const [n, s] of Object.entries(released)) { const [p, q] = Cn(Number(n)); if (`${p}/${q}` !== s) throw new Error(`C_${n} mismatch: ${p}/${q}`); }
  if (Math.abs(Cinf() - 1.5237776118026086987) > 1e-14) throw new Error('C_infinity mismatch: ' + Cinf());
  const vals = []; for (let n = 2; n <= 30; n++) vals.push(val(Cn(n)));
  if (Math.max(...vals) !== vals[1]) throw new Error('C_3 is not the maximum');
  for (let i = 2; i < vals.length; i++) if (!(vals[i] < vals[i - 1] && vals[i] > Cinf())) throw new Error('C_n not decreasing to C_inf at n = ' + (i + 2));
  return { exact: Object.keys(released).length, cinf: Cinf(), vals };
}
// ---- left: the C_n curve ----
function chart(vals) {
  const X0 = 70, X1 = 420, Y0 = 318, Y1 = 168; // n = 2..30; y 1.46 .. 1.58
  const px = n => X0 + (X1 - X0) * (n - 2) / 28, py = v => Y0 - (Y0 - Y1) * (v - 1.46) / 0.12;
  let s = text(40, 116, 'How much can resampling help?', 15, muted, 'start', 'bold');
  s += text(40, 136, 'worst-case gain in a test’s advantage, erasure', 13, dim);
  s += text(40, 152, 'experiments, n random draws from n sources', 13, dim);
  const axis = 'rgba(255,255,255,0.55)';
  s += `<line x1="${X0}" y1="${Y0}" x2="${X1}" y2="${Y0}" stroke="${axis}"/><line x1="${X0}" y1="${Y0}" x2="${X0}" y2="${Y1 - 8}" stroke="${axis}"/>`;
  s += `<line x1="${X0}" y1="${py(Cinf()).toFixed(1)}" x2="${X1}" y2="${py(Cinf()).toFixed(1)}" stroke="${cool}" stroke-dasharray="5 4" stroke-width="1.4"/>`;
  const pts = vals.map((v, i) => [px(i + 2), py(Math.max(v, 1.46))]);
  s += `<polyline points="${pts.map(p => p.map(x => x.toFixed(1)).join(',')).join(' ')}" fill="none" stroke="${hot}" stroke-width="2.2"/>`;
  pts.forEach(([x, y], i) => { s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${i === 1 ? 6 : 2.6}" fill="${hot}"/>`; });
  s += text(X0 - 6, py(1.5) + 4, '1.50', 11, dim, 'end') + text(X0 - 6, py(14 / 9) + 4, '1.56', 11, dim, 'end');
  for (const n of [2, 10, 20, 30]) s += text(px(n), Y0 + 16, String(n), 12, dim, 'middle');
  s += text(X1, Y0 + 32, 'number of sources n', 12, dim, 'end');
  s += text(px(3) + 12, py(14 / 9) - 8, 'peak 14/9 at three sources', 13, hot, 'start', 'bold');
  s += text(X1, py(Cinf()) + 16, 'limit ≈ 1.524', 12, cool, 'end', 'bold');
  s += text(px(2) + 10, py(1.5) + 16, 'two sources: 3/2', 12, hot);
  return s;
}
// ---- centre: the three-source example ----
function example() {
  const x0 = 480; let s = '';
  s += text(x0, 116, 'The example behind 14/9', 15, muted, 'start', 'bold');
  s += text(x0, 136, 'decide between explanations A and B', 13, dim);
  const box = (x, label, sub, color) => `<rect x="${x}" y="160" width="104" height="58" rx="8" fill="rgba(255,255,255,0.06)" stroke="${color}" stroke-width="2"/>` +
    text(x + 52, 184, label, 13, color, 'middle', 'bold') + text(x + 52, 204, sub, 12, dim, 'middle');
  s += box(x0, 'source 1', 'can rule out A', rose) + box(x0 + 118, 'source 2', 'can rule out B', cool) + box(x0 + 236, 'source 3', 'says nothing', '#9aa7b0');
  s += text(x0, 252, 'Look once at each:', 14, ink, 'start', 'bold') + text(x0 + 150, 252, 'advantage D', 14, ink);
  s += text(x0, 280, 'Three random draws:', 14, hot, 'start', 'bold') + text(x0 + 150, 280, '14D/9 − 2D²/3 + 2D³/27', 14, hot, 'start', 'normal', SERIF);
  s += text(x0, 304, 'about 14/9 × D when the signals are weak', 13, dim);
  s += text(x0, 336, 'This multiplies the advantage over guessing,', 12, dim, 'start', 'normal', SERIF, 'italic');
  s += text(x0, 352, 'not the accuracy itself', 12, dim, 'start', 'normal', SERIF, 'italic');
  return s;
}
function right() {
  const x0 = 900; let s = '';
  s += `<line x1="${x0 - 22}" y1="104" x2="${x0 - 22}" y2="372" stroke="rgba(255,255,255,0.16)" stroke-width="1"/>`;
  s += text(x0, 116, 'Also proved', 15, muted, 'start', 'bold');
  s += text(x0, 140, 'All data: the constant c is at most', 13, ink);
  s += text(x0, 157, '9/14, below the old bound 8/9', 13, hot, 'start', 'bold');
  s += text(x0, 184, 'Two sources: solved exactly', 13, ink);
  s += text(x0, 211, 'Strong evidence: at least n!/nⁿ', 13, ink);
  s += text(x0, 228, 'of the error survives resampling', 13, ink);
  s += text(x0, 262, 'Open: is 9/14 exact? (conjectured;', 12, dim, 'start', 'normal', SERIF, 'italic');
  s += text(x0, 278, 'a search found nothing larger)', 12, dim, 'start', 'normal', SERIF, 'italic');
  s += text(x0, 302, 'Yes/no data (8/9) not addressed', 12, dim, 'start', 'normal', SERIF, 'italic');
  return s;
}
const draw = vals =>
  text(40, 50, 'Resampling heterogeneous experiments', 25, ink, 'start', 'normal', SERIF) +
  text(40, 80, 'Resample three weak sources: up to 14/9 times the advantage. In general the constant is at most 9/14', 15, muted) +
  chart(vals) + example() + right();
const description = 'Banner for a paper on resampling heterogeneous experiments. Title: Resampling heterogeneous experiments. Subtitle: Resample three weak sources: up to 14/9 times the advantage. In general the constant is at most 9/14. Left: how much can resampling help? The worst-case gain in a test’s advantage for erasure experiments with n random draws from n sources, plotted against the number of sources from 2 to 30: two sources give 3/2, the curve peaks at 14/9 at three sources and decreases towards a dashed limit of about 1.524. Centre: the example behind 14/9: deciding between explanations A and B, source 1 can rule out A, source 2 can rule out B, source 3 says nothing. Looking once at each gives advantage D; three random draws give 14D/9 minus 2D squared over 3 plus 2D cubed over 27, about 14/9 times D when the signals are weak. This multiplies the advantage over guessing, not the accuracy itself. Right: also proved: for all data the constant c is at most 9/14, below the old bound 8/9; two sources are solved exactly; with strong evidence at least n factorial over n to the n of the error survives resampling. Open: whether 9/14 is exact (conjectured; a search found nothing larger). Yes/no data (8/9) not addressed.';
function frame(inner, background) {
  return bannerSvg({ inner, description, background, glow: { color: '#ffd38a', cx: '0.5', cy: '0.55', r: '0.4', opacity: '0.06' } });
}
const thumbSpec = {
  kicker: ['RESEARCH RELEASE · NOVEMBER 2026', 'PROBABILITY · COMPARISON OF EXPERIMENTS'],
  head: ['Resampling three weak sources:', 'up to <em>14/9</em> times the advantage'], headSize: 46,
  sub: 'Exact worst cases for random draws with replacement; in general the homogenisation constant is at most 9/14.',
  tag: 'UNREFEREED CANDIDATE',
  hero: '<div class="eq-label">peak gain, three sources</div><div class="hero-title">14/9</div><div class="note">many sources: ≈ 1.524<br>general bound: 9/14</div><div class="eq-foot">written proofs</div>'
};
module.exports = { draw, description, thumbSpec, checkHook };
if (require.main === module) (async () => {
  const fs = require('fs'), pth = require('path'), os = require('os'), vm = require('vm');
  const ROOT = pth.join(__dirname, '..');
  const chk = checkHook();
  console.log('check: exact C_n rows', chk.exact, '| C_inf', chk.cinf, '| C_3 = 14/9 maximum; C_n decreasing to C_inf for n = 3..30');
  const { resolve: bannerResolve } = require('./banner-palettes');
  const bp = bannerResolve(SLUG); if (!bp) throw new Error('no banner palette');
  const tp = require('./thumbnail-palettes');
  const tname = tp.resolve(SLUG, true);
  const svg = frame(draw(chk.vals), bp);
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
