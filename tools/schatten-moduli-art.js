'use strict';
const { bannerSvg } = require('./svg-xml');
// Sharp constants for sums of matrix moduli when 1<p<2: banner, OG, thumbnail.
// "This image helps the reader understand" where the worst-case constant c_p(m) for m matrices now lies at p = 3/2:
// between the rank-one value D_{p,m} (red, Corollary 2.2, a lower bound for c_p(m)) and the new interpolation bound
// ((1+sqrt m)/2)^{1-1/p} (blue, Corollary 2.4), against the previous bound m^{(p-1)/(2p)} (grey, Tang-Zhang). Same three
// curves as the middle panel of the paper's Figure 1 (verification/plot_bounds.py). Left: the two-matrix numbers
// (Lee's problem) from Section 2 and Proposition 2.5. Reference: finite-sample-affine-diversification (shaded region).
// Usage: node tools/schatten-moduli-art.js [--render OUTDIR_FOR_INSPECTION] [--no-mirror]
const SLUG = 'schatten-sum-of-moduli-constants';
const ink = '#f4f1ea', muted = '#dfe6ec', dim = '#b9c8d4';
const red = '#ff8a7a', blue = '#8cc8ff', grey = '#a9b3bc', band = '#8cc8ff';
const SANS = 'Arial,Helvetica,sans-serif', SERIF = 'Georgia,serif';
const text = (x, y, s, size = 18, color = ink, anchor = 'start', weight = 'normal', family = SANS, style = 'normal') =>
  `<text class="og-hide" x="${x}" y="${y}" fill="${color}" font-family="${family}" font-size="${size}" font-weight="${weight}" font-style="${style}" text-anchor="${anchor}">${s}</text>`;
const P = 1.5, Q = P / (2 - P);
// D_{p,d} = max_{x>=1} sqrt(x+a)(x^q+a)^{1/(2q)}/(x^p+a)^{1/p}, a = d-1 (Section 2); unimodal in x (Lemma 3.1).
function D(d, p = P) {
  if (d === 1) return 1;
  const q = p / (2 - p), a = d - 1;
  const lf = t => { const x = Math.exp(t); return 0.5 * Math.log(x + a) + Math.log(Math.pow(x, q) + a) / (2 * q) - Math.log(Math.pow(x, p) + a) / p; };
  let lo = 0, hi = 40;
  for (let i = 0; i < 300; i++) { const m1 = lo + (hi - lo) / 3, m2 = hi - (hi - lo) / 3; if (lf(m1) < lf(m2)) lo = m1; else hi = m2; }
  return Math.exp(lf((lo + hi) / 2));
}
const interp = (m, p = P) => Math.pow((1 + Math.sqrt(m)) / 2, 1 - 1 / p);
const tz = (m, p = P) => Math.pow(m, (p - 1) / (2 * p));
// Plot frame (data coordinates m in [1, 40], c in [1, 1.9]).
const F = { x0: 690, x1: 1150, y0: 330, y1: 140, mMax: 40, cMin: 1, cMax: 1.9 };
const X = m => F.x0 + (m - 1) / (F.mMax - 1) * (F.x1 - F.x0);
const Y = c => F.y0 - (c - F.cMin) / (F.cMax - F.cMin) * (F.y0 - F.y1);
const ms = Array.from({ length: F.mMax }, (_, i) => i + 1);
const path = f => ms.map((m, i) => `${i ? 'L' : 'M'}${X(m).toFixed(1)} ${Y(f(m)).toFixed(1)}`).join(' ');
function plot() {
  let s = '';
  const top = ms.map((m, i) => `${i ? 'L' : 'M'}${X(m).toFixed(1)} ${Y(interp(m)).toFixed(1)}`).join(' ');
  const bot = ms.slice().reverse().map(m => `L${X(m).toFixed(1)} ${Y(D(m)).toFixed(1)}`).join(' ');
  s += `<path d="${top} ${bot} Z" fill="${band}" fill-opacity="0.16"/>`;
  s += `<path d="M${F.x0} ${F.y0} H${F.x1} M${F.x0} ${F.y0} V${F.y1}" stroke="${dim}" stroke-opacity="0.6" stroke-width="1.2" fill="none"/>`;
  for (const c of [1, 1.2, 1.4, 1.6, 1.8]) s += text(F.x0 - 8, Y(c) + 5, c.toFixed(1), 12, dim, 'end');
  for (const m of [1, 10, 20, 30, 40]) s += text(X(m), F.y0 + 18, String(m), 12, dim, 'middle');
  s += text((F.x0 + F.x1) / 2, F.y0 + 38, 'number of matrices m', 13, dim, 'middle');
  s += `<path d="${path(tz)}" fill="none" stroke="${grey}" stroke-width="2.4" stroke-dasharray="7 6"/>`;
  s += `<path d="${path(interp)}" fill="none" stroke="${blue}" stroke-width="3.2"/>`;
  s += `<path d="${path(D)}" fill="none" stroke="${red}" stroke-width="3.2"/>`;
  s += text(F.x1 - 4, Y(tz(40)) - 10, 'previous upper bound m^((p−1)/2p)', 13.5, grey, 'end');
  s += text(F.x1 - 4, Y(interp(40)) - 10, 'new upper bound ((1+√m)/2)^(1−1/p)', 13.5, blue, 'end', 'bold');
  s += text(F.x1 - 4, Y(1.1), 'rank-one value D(p,m): lower bound', 13.5, red, 'end', 'bold');
  s += text(X(29), Y(1.352), 'the true constant lies in this band', 12.5, muted, 'middle', 'normal', SERIF, 'italic');
  s += text((F.x0 + F.x1) / 2 - 20, 118, 'Worst-case constant c for m matrices at p = 3/2 (as in Figure 1)', 15, ink, 'middle', 'bold');
  return s;
}
function left() {
  let s = text(40, 128, 'Can the sum A+B be bigger than |A|+|B|? Yes, by a factor c.', 15, dim, 'start', 'normal', SERIF, 'italic');
  s += text(40, 148, "For two matrices at p = 3/2 (Lee's problem):", 15, dim, 'start', 'normal', SERIF, 'italic');
  const rows = [
    ['previous upper bound', '1.1225', grey, 'normal'],
    ['new upper bound (Cor. 2.4)', '1.0648', blue, 'bold'],
    ['certified 3×3 example (Prop. 2.5)', '≥ 1.036425', ink, 'bold'],
    ['best rank-one value D', '1.036414', red, 'bold']];
  rows.forEach(([label, value, c, w], k) => {
    const y = 192 + k * 40;
    s += text(40, y, label, 17, c === ink ? muted : c, 'start', w);
    s += text(560, y, value, 21, c, 'end', 'bold');
    s += `<path d="M40 ${y + 13} H560" stroke="${dim}" stroke-opacity="0.25" stroke-width="1"/>`;
  });
  s += text(40, 360, 'Exact constant D(p,n) whenever there are at least as many matrices as their size n.', 14, muted);
  return s;
}
function checkHook() {
  // Values bound to verification/output/verification.json (interpolation_comparison, p = 1.5, m = 2) and Section 2.
  const near = (a, b, t, what) => { if (Math.abs(a - b) > t) throw new Error(what + ': ' + a + ' vs ' + b); };
  near(D(2), 1.0364143573334077, 1e-9, 'D_{3/2,2}');
  near(D(2, 1.2), 1.0073249657678762, 1e-9, 'D_{6/5,2}');
  near(D(10), 1.16995225, 1e-7, 'D_{3/2,10}');
  near(interp(2), 1.0647522420095383, 1e-12, 'interpolation bound');
  near(tz(2), 1.122462048309373, 1e-12, 'Tang-Zhang bound');
  for (const m of ms.slice(1)) if (!(D(m) < interp(m) && interp(m) < tz(m))) throw new Error('ordering at m=' + m);
  if (!(1.036425091174 > 1.036414357334)) throw new Error('certificate');
  if (Y(tz(40)) < F.y1 - 2) throw new Error('plot range');
}
const draw = () =>
  text(40, 50, 'How much bigger can a matrix sum be than its absolute values?', 25, ink, 'start', 'normal', SERIF) +
  text(40, 78, 'Schatten norms, 1 &lt; p &lt; 2: exact constant when m ≥ n, a new bound for all m', 15, muted) +
  left() + plot() +
  text(40, 392, 'Curves computed from the formulas in the paper (Corollaries 2.2 and 2.4); not data.', 11.5, dim, 'start', 'normal', SERIF, 'italic');
const description = 'Banner for a paper on sums of matrix moduli in Schatten p-norms. Title: How much bigger can a matrix sum be than its absolute values? On the left, for two matrices at p = 3/2 (Lee\'s problem): previous upper bound 1.1225; new upper bound (Corollary 2.4) 1.0648; certified 3 by 3 example (Proposition 2.5) at least 1.036425; best rank-one value D 1.036414. Note: the constant is exact, D(p,n), whenever there are at least as many matrices as their size n. On the right, a plot of the worst-case constant against the number of matrices m from 1 to 40 at p = 3/2: a dashed grey curve for the previous upper bound m to the power (p−1)/2p rises highest; a blue curve for the new upper bound ((1+√m)/2) to the power 1−1/p lies below it; a red curve for the rank-one value D(p,m), a lower bound, lies lowest; the band between red and blue is shaded and labelled: the true constant lies in this band.';
function frame(inner, background) {
  return bannerSvg({ inner, description, background, glow: { color: blue, cx: '0.7', cy: '0.5', r: '0.45', opacity: '0.06' } });
}
const thumbSpec = {
  kicker: ['RESEARCH RELEASE · NOVEMBER 2026', 'MATRIX ANALYSIS'],
  head: ['|A+B| vs |A|+|B|:', 'at most <em>6.5%</em> more'], headSize: 58,
  sub: 'For two matrices in the Schatten 3/2-norm, a matrix sum can exceed the sum of absolute values by at most 6.48% (was 12.25%); at least 3.64% is forced.',
  tag: 'UNREFEREED CANDIDATE',
  hero: '<div class="eq-label">two matrices, p = 3/2</div><div class="hero-title">≤ 1.0648</div><div class="note">previous bound 1.1225<br>certified 3×3: ≥ 1.036425<br>rank-one value 1.036414</div><div class="eq-foot">exact constant when m ≥ n</div>'
};
module.exports = { draw, description, thumbSpec };
if (require.main === module) (async () => {
  const fs = require('fs'), pth = require('path'), os = require('os'), vm = require('vm');
  const ROOT = pth.join(__dirname, '..');
  checkHook();
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
