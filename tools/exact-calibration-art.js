'use strict';
const { bannerSvg } = require('./svg-xml');
// Exact calibration for growing Gaussian null families (exact-calibration-gaussian-null-families): banner, OG, thumbnail.
// "This image helps the reader understand" Corollary 4 for b = 1 and spacing 1/n: as the null interval [1 - w, 1 + w]
// widens, the growth rate of ordinary (valid) e-values, (1 - w)^2/2, falls gently, while the rate of exact e-values,
// F(w, 1), falls to zero at w* = 2 log cosh(1/2) = 0.2402, where the valid rate is still about 0.289. The worked
// example of Section 12 (n = 6400, 1281 null means from 0.9 to 1.1: 2592 nats against 1121-1128) is marked at w = 0.1.
// The exact curve is computed here from the paper's formulas (6)-(8) (Stieltjes-Wigert exterior action, kappa = 1) by
// quadrature. checkHook compares it with the released spacing_phase_results.json values (F(0.1, 1) = 0.174612,
// c*(1) = 0.240229, F(0, 1) = 1/2) and with the n = 6400 example, and refuses to draw on mismatch.
// Reference: finite-sample-affine-diversification (contrasting conclusions carried by two curves and a region).
// Usage: node tools/exact-calibration-art.js [--render OUTDIR_FOR_INSPECTION] [--no-mirror]
const SLUG = 'exact-calibration-gaussian-null-families';
const ink = '#f6f2ea', muted = '#e2e7ea', dim = '#bcc8cf', hot = '#ffb36b', cool = '#8ecbff';
const SANS = 'Arial,Helvetica,sans-serif', SERIF = 'Georgia,serif';
const text = (x, y, s, size = 18, color = ink, anchor = 'start', weight = 'normal', family = SANS, style = 'normal') => {
  if (/[<&]/.test(s.replace(/<\/?tspan[^>]*>/g, ''))) throw new Error('unescaped < or & in SVG text: ' + s);
  return `<text class="og-hide" x="${x}" y="${y}" fill="${color}" font-family="${family}" font-size="${size}" font-weight="${weight}" font-style="${style}" text-anchor="${anchor}">${s}</text>`;
};

// ---- the exact rate F(c, kappa) from eqs. (6)-(8) ----
const acosh = x => Math.log(x + Math.sqrt(x * x - 1));
function gammaL(lam, u) {
  const a = 1 + Math.exp(-u), d = a * a - 4 * Math.exp(lam - u);
  return u - lam + 2 * Math.log((a + Math.sqrt(Math.max(d, 0))) / 2);
}
function F(c, kappa) {
  const lam = c * kappa * kappa, ks = 2 * acosh(Math.exp(lam / 2));
  if (kappa <= ks) return 0;
  // substitute u = ks + s^2 to remove the square-root endpoint; composite Simpson in s
  const S = Math.sqrt(kappa - ks), N = 4000, h = S / N;
  let acc = 0;
  for (let i = 0; i <= N; i++) {
    const s = i * h, w = (i === 0 || i === N) ? 1 : (i % 2 ? 4 : 2);
    acc += w * gammaL(lam, ks + s * s) * 2 * s;
  }
  return acc * h / 3 / (kappa * kappa);
}
const valid = w => (1 - w) * (1 - w) / 2;
const wStar = 2 * Math.log(Math.cosh(0.5));
function checkHook() {
  const f01 = F(0.1, 1), f0 = F(0, 1), fs = F(wStar * (1 - 1e-9), 1), fb = F(wStar * 1.001, 1);
  if (Math.abs(f01 - 0.174612) > 5e-6) throw new Error('F(0.1,1) = ' + f01);
  if (Math.abs(f0 - 0.5) > 1e-9) throw new Error('F(0,1) = ' + f0);
  if (Math.abs(wStar - 0.240229) > 5e-7) throw new Error('w* = ' + wStar);
  if (Math.abs(fs) > 1e-6 || fb !== 0) throw new Error('threshold: ' + fs + ' ' + fb);
  if (Math.abs(valid(wStar) - 0.2886) > 5e-5) throw new Error('valid at threshold ' + valid(wStar));
  // n = 6400, t = 80, m = 640: valid optimum (80 - 8)^2/2 = 2592; certificate 1121.406..1127.984 = 6400 x [0.17522, 0.17625]
  if ((80 - 8) ** 2 / 2 !== 2592 || 2 * 640 + 1 !== 1281 || Math.abs(1121.406 / 6400 - 0.17522) > 1e-5 || Math.abs(1127.984 / 6400 - 0.17625) > 1e-5) throw new Error('example');
  if (!(1121.406 / 6400 > f01) || !(1127.984 / 6400 > f01)) throw new Error('finite bracket should lie above the limit');
  return { f01, f0, wStar, validAtStar: valid(wStar) };
}

// ---- drawing: chart of growth rate per observation against interval half-width w ----
const X0 = 470, X1 = 900, Y0 = 352, Y1 = 112, WMAX = 0.5, RMAX = 0.5;
const px = w => X0 + (X1 - X0) * w / WMAX, py = r => Y0 - (Y0 - Y1) * r / RMAX;
function chart() {
  let s = '';
  // zero-rate region for exact e-values
  s += `<rect x="${px(wStar).toFixed(1)}" y="${Y1}" width="${(px(WMAX) - px(wStar)).toFixed(1)}" height="${Y0 - Y1}" fill="rgba(255,179,107,0.09)"/>`;
  s += `<line x1="${px(wStar).toFixed(1)}" y1="${Y1 - 4}" x2="${px(wStar).toFixed(1)}" y2="${Y0}" stroke="${hot}" stroke-width="1.2" stroke-dasharray="4 4" opacity="0.8"/>`;
  // axes and ticks
  s += `<line x1="${X0}" y1="${Y0}" x2="${X1 + 10}" y2="${Y0}" stroke="rgba(255,255,255,0.55)" stroke-width="1.3"/>`;
  s += `<line x1="${X0}" y1="${Y0}" x2="${X0}" y2="${Y1 - 10}" stroke="rgba(255,255,255,0.55)" stroke-width="1.3"/>`;
  for (const w of [0, 0.1, 0.2, 0.3, 0.4, 0.5]) s += `<line x1="${px(w)}" y1="${Y0}" x2="${px(w)}" y2="${Y0 + 5}" stroke="rgba(255,255,255,0.55)"/>` + text(px(w), Y0 + 20, w.toFixed(1), 12, dim, 'middle');
  for (const r of [0, 0.25, 0.5]) s += `<line x1="${X0 - 5}" y1="${py(r)}" x2="${X0}" y2="${py(r)}" stroke="rgba(255,255,255,0.55)"/>` + text(X0 - 9, py(r) + 4, r === 0.25 ? '0.25' : r.toFixed(1), 12, dim, 'end');
  s += text((X0 + X1) / 2, Y0 + 40, 'half-width w of the null interval [1 − w, 1 + w], means spaced 1/n', 13, muted, 'middle');
  s += text(X0 - 44, (Y0 + Y1) / 2, 'growth per observation', 13, muted, 'middle').replace('<text ', `<text transform="rotate(-90 ${X0 - 44} ${(Y0 + Y1) / 2})" `);
  // curves
  const pts = (f, a, b, n) => Array.from({ length: n + 1 }, (_, i) => { const w = a + (b - a) * i / n; return `${px(w).toFixed(1)},${py(f(w)).toFixed(1)}`; }).join(' ');
  s += `<polyline points="${pts(valid, 0, WMAX, 100)}" fill="none" stroke="${cool}" stroke-width="3.2" stroke-linecap="round"/>`;
  s += `<polyline points="${pts(w => F(w, 1), 0, wStar, 120)} ${px(WMAX).toFixed(1)},${py(0).toFixed(1)}" fill="none" stroke="${hot}" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>`;
  s += text(px(0.33), py(valid(0.33)) - 34, 'ordinary e-values', 15, cool, 'start', 'bold');
  s += text(px(0.33), py(valid(0.33)) - 17, '(average at most one)', 12, cool);
  s += text(px(0.02), py(0.06), 'exact e-values', 15, hot, 'start', 'bold');
  s += text(px(0.02), py(0.06) + 17, '(average exactly one)', 12, hot);
  // threshold annotation
  s += `<circle cx="${px(wStar).toFixed(1)}" cy="${py(valid(wStar)).toFixed(1)}" r="4.5" fill="${cool}"/><circle cx="${px(wStar).toFixed(1)}" cy="${py(0).toFixed(1)}" r="4.5" fill="${hot}"/>`;
  s += text(px(wStar) + 8, Y1 + 2, 'w* = 2 log cosh ½ ≈ 0.240', 13, hot, 'start', 'bold');
  s += text(px(wStar) + 8, Y1 + 19, 'beyond it exact e-values gain nothing', 12, ink);
  s += text(px(wStar) + 8, Y1 + 36, 'while ordinary ones still grow ≈ 0.289', 12, cool);
  // worked example at w = 0.1
  const e = 0.1;
  s += `<line x1="${px(e)}" y1="${py(valid(e)).toFixed(1)}" x2="${px(e)}" y2="${py(1121.406 / 6400).toFixed(1)}" stroke="rgba(255,255,255,0.5)" stroke-width="1.2" stroke-dasharray="2 3"/>`;
  s += `<circle cx="${px(e)}" cy="${py(valid(e)).toFixed(1)}" r="4.5" fill="${cool}"/><circle cx="${px(e)}" cy="${py(1124.7 / 6400).toFixed(1)}" r="4.5" fill="${hot}"/>`;
  return s;
}
function left() {
  let s = text(40, 116, 'Worked example (w = 0.1)', 15, muted, 'start', 'bold');
  s += text(40, 140, 'n = 6400 observations, 1281 null means', 14, ink);
  s += text(40, 158, 'from 0.9 to 1.1; alternative mean 0', 14, ink);
  s += text(40, 192, 'best ordinary e-value', 14, cool);
  s += text(40, 218, '2592 nats', 24, cool, 'start', 'bold', SERIF);
  s += text(40, 252, 'best exact e-value', 14, hot);
  s += text(40, 278, '1121 to 1128 nats', 24, hot, 'start', 'bold', SERIF);
  s += text(40, 318, 'Why: ordinary e-values face mixtures of the nulls;', 13, dim);
  s += text(40, 336, 'exact ones face every signed combination, and', 13, dim);
  s += text(40, 354, 'differences of nearby bell curves build polynomials.', 13, dim);
  return s;
}
function right() {
  const x0 = 960; let s = '';
  s += `<line x1="${x0 - 22}" y1="108" x2="${x0 - 22}" y2="372" stroke="rgba(255,255,255,0.16)" stroke-width="1"/>`;
  s += text(x0, 116, 'Exactly one is costly', 15, muted, 'start', 'bold');
  s += text(x0, 142, 'Fixed finite null list:', 13, dim);
  s += text(x0, 160, 'no long-run cost', 13, ink);
  s += text(x0, 186, 'Whole continuum of means:', 13, dim);
  s += text(x0, 204, 'no power at all', 13, ink);
  s += text(x0, 230, 'Grid growing with the data:', 13, dim);
  s += text(x0, 248, 'this explicit phase diagram', 13, ink, 'start', 'bold');
  s += text(x0, 284, 'A small shortfall from', 13, dim);
  s += text(x0, 302, 'exactness restores the', 13, dim);
  s += text(x0, 320, 'ordinary rate', 13, dim);
  s += text(x0, 354, 'Gaussian means, known variance', 12, dim, 'start', 'normal', SERIF, 'italic');
  return s;
}
const draw = () =>
  text(40, 50, 'Demanding exact calibration on a fine null grid can wipe out the growth of evidence', 25, ink, 'start', 'normal', SERIF) +
  text(40, 80, 'Gaussian nulls with means across [1 − w, 1 + w] at spacing 1/n; growth rate of the best e-value per observation', 15, muted) +
  left() + chart() + right();
const description = 'Banner for a paper on the cost of exact calibration for growing Gaussian null families. Title: Demanding exact calibration on a fine null grid can wipe out the growth of evidence. Subtitle: Gaussian nulls with means across [1 − w, 1 + w] at spacing 1/n; growth rate of the best e-value per observation. Centre, a chart against the half-width w from 0 to 0.5: a blue curve for ordinary e-values (average at most one), (1 − w)²/2, falls gently from 0.5; an orange curve for exact e-values (average exactly one) falls faster and reaches zero at w* = 2 log cosh ½ ≈ 0.240, beyond which a shaded region is labelled: beyond it exact e-values gain nothing; while ordinary e-values still grow at about 0.289 there. Left, the worked example at w = 0.1: n = 6400 observations and 1281 null means from 0.9 to 1.1, alternative mean 0; best ordinary e-value 2592 nats, best exact e-value 1121 to 1128 nats. Why: ordinary e-values face mixtures of the nulls; exact ones face every signed combination, and differences of nearby bell curves build polynomials. Right: exactly one is costly. A fixed finite null list: no long-run cost; the whole continuum of means: no power at all; a grid growing with the data: this explicit phase diagram. A small shortfall from exactness restores the ordinary rate. Gaussian means, known variance.';
function frame(inner, background) {
  return bannerSvg({ inner, description, background, glow: { color: '#ffb36b', cx: '0.55', cy: '0.6', r: '0.4', opacity: '0.06' } });
}
const thumbSpec = {
  kicker: ['RESEARCH RELEASE · NOVEMBER 2026', 'STATISTICS · E-VALUES'],
  head: ['Insist that evidence averages <em>exactly</em> one?', 'On a fine null grid it can stop growing.'], headSize: 48,
  sub: 'Null means spread at least 2 log cosh ½ ≈ 0.240 either side of 1, spaced 1/n: exact e-values have zero growth rate; ordinary ones still grow, about 0.29 per observation at that width.',
  tag: 'UNREFEREED CANDIDATE',
  hero: '<div class="eq-label">threshold half-width</div><div class="hero-title">2 log cosh ½</div><div class="note">≈ 0.240 around a mean of 1<br>n = 6400, 1281 null means:<br>2592 vs 1121–1128 nats</div><div class="eq-foot">written proofs</div>'
};
module.exports = { draw, description, thumbSpec, checkHook, F };
if (require.main === module) (async () => {
  const fs = require('fs'), pth = require('path'), os = require('os'), vm = require('vm');
  const ROOT = pth.join(__dirname, '..');
  const chk = checkHook();
  console.log(`check: F(0.1,1) ${chk.f01.toFixed(6)}; F(0,1) ${chk.f0}; w* ${chk.wStar.toFixed(6)}; valid at w* ${chk.validAtStar.toFixed(4)}`);
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
