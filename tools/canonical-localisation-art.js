'use strict';
const { bannerSvg } = require('./svg-xml');
// Canonical covariance localisation: banner, OG card and thumbnail.
// "This image helps the reader understand" that in the reconstructed Snyder-Hakim 200-variable test case, scored by physical
// squared error with a known prior covariance, localising in canonical coordinates leaves the analysis error well above the
// Kalman-filter error (1.137 x at N = 8), while symmetric (ZCA) whitening or the best basis found gets much closer (1.063 x),
// removing about 54% of the excess at N = 8 and 42% at N = 64.
// Source (paper 0.1.0-candidate, 3 Nov 2026): Section 10, Table 6 and Figure 2(a); results/sh_testbed/results.json,
// mc_main.summary[N].ensemble_mean (4000 Monte Carlo replicates per N, seed 20261103). Values below are copied from that file
// to six decimals and guarded against the excess reductions recorded there.
// Usage: node tools/canonical-localisation-art.js [--render OUTDIR_FOR_INSPECTION] [--no-mirror]
const SLUG = 'canonical-covariance-localisation-failure';
const ink = '#f6f0ea', muted = '#e6d8cf', dim = '#c9b6aa';
const canC = '#ffb38a', zcaC = '#9fd8ff', bestC = '#b9f0c8';
const SANS = 'Arial,Helvetica,sans-serif', SERIF = 'Georgia,serif';
const text = (x, y, s, size = 18, color = ink, anchor = 'start', weight = 'normal', family = SANS) =>
  `<text class="og-hide" x="${x}" y="${y}" fill="${color}" font-family="${family}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}">${s}</text>`;
const f = v => (+v).toFixed(1);
// Ensemble-mean update, MSE divided by Kalman-filter MSE (results.json mc_main.summary).
const NS = [4, 8, 16, 32, 64];
const CAN = [1.366258, 1.137303, 1.058306, 1.026786, 1.01292];
const ZCA = [1.13539, 1.063792, 1.031074, 1.015366, 1.00764];
const BEST = [1.133841, 1.063024, 1.030696, 1.015183, 1.00755];
const RED_BEST = [0.6346, 0.541, 0.4735, 0.4332, 0.4156]; // excess_reduction_vs_canonical, F-optimised
// Chart geometry.
const CX0 = 110, CX1 = 640, CY0 = 330, CY1 = 120, YMIN = 1.0, YMAX = 1.40;
const CXp = n => CX0 + Math.log2(n / 4) / 4 * (CX1 - CX0);
const CYp = v => CY0 - (v - YMIN) / (YMAX - YMIN) * (CY0 - CY1);
const line = (vals, color, w, dash = '') => `<path d="M${vals.map((v, i) => `${f(CXp(NS[i]))} ${f(CYp(v))}`).join(' L')}" stroke="${color}" stroke-width="${w}" fill="none" stroke-linejoin="round"${dash ? ` stroke-dasharray="${dash}"` : ''}/>`;
const dots = (vals, color, r) => vals.map((v, i) => `<circle cx="${f(CXp(NS[i]))}" cy="${f(CYp(v))}" r="${r}" fill="${color}"/>`).join('');
function chart() {
  let s = text(40, 106, 'analysis error ÷ Kalman-filter error', 13, dim, 'start', 'bold');
  for (const v of [1.0, 1.1, 1.2, 1.3, 1.4]) {
    s += `<path d="M${CX0} ${f(CYp(v))} H${CX1}" stroke="${dim}" stroke-opacity="${v === 1 ? '.55' : '.16'}" stroke-width="1"/>`;
    s += text(CX0 - 10, CYp(v) + 4, v.toFixed(1), 12, dim, 'end');
  }
  s += text(CX0 + 8, CYp(1.0) - 7, 'Kalman filter (ideal) = 1.0', 11, dim, 'start');
  // Gap between canonical and the whitened bases.
  const top = CAN.map((v, i) => `${f(CXp(NS[i]))} ${f(CYp(v))}`), bot = ZCA.map((v, i) => `${f(CXp(NS[i]))} ${f(CYp(v))}`).reverse();
  s += `<path d="M${top.join(' L')} L${bot.join(' L')} Z" fill="${canC}" fill-opacity=".12"/>`;
  s += line(CAN, canC, 3.2) + dots(CAN, canC, 4.5);
  s += line(ZCA, zcaC, 3.2) + dots(ZCA, zcaC, 4.5);
  s += line(BEST, bestC, 1.6, '5 4');
  for (const n of NS) s += `<path d="M${f(CXp(n))} ${CY0} v5" stroke="${dim}" stroke-width="1.2"/>` + text(CXp(n), CY0 + 21, String(n), 12, dim, 'middle');
  s += text(CX1, CY0 + 40, 'ensemble size N', 12, dim, 'end');
  s += text(CXp(4) + 12, CYp(1.3663) + 4, 'canonical coordinates', 14, canC, 'start', 'bold');
  s += text(CXp(8) + 10, CYp(1.1373) - 8, '1.137', 14, canC, 'start', 'bold');
  s += text(CXp(8) + 10, CYp(1.0630) + 22, '1.063', 14, zcaC, 'start', 'bold');
  s += text(CXp(16) + 18, CYp(1.0311) - 26, 'symmetric (ZCA) whitening', 14, zcaC, 'start', 'bold');
  s += text(CXp(16) + 18, CYp(1.0311) - 10, 'best basis found (dashed) almost identical', 12, bestC);
  return s;
}
function hook() {
  const X = 712;
  let s = text(X, 122, 'At N = 8 ensemble members', 15, muted, 'start', 'bold');
  s += text(X, 172, '1.137 ×', 42, canC, 'start', 'bold', SERIF) + text(X + 168, 166, 'canonical', 16, canC, 'start', 'bold') + text(X + 168, 184, 'coordinates', 14, canC);
  s += text(X, 226, '1.063 ×', 42, zcaC, 'start', 'bold', SERIF) + text(X + 168, 220, 'best basis', 16, zcaC, 'start', 'bold') + text(X + 168, 238, 'found', 14, zcaC);
  s += text(X, 272, 'the Kalman-filter error', 14, dim);
  s += text(X, 308, 'Whitening removes about half the excess error,', 14, ink, 'start', 'bold');
  s += text(X, 326, 'worth roughly doubling the ensemble', 14, ink, 'start', 'bold');
  s += text(X, 362, 'Error in physical units; known prior covariance; one analysis step.', 12, dim);
  s += text(X, 378, 'Scored relative to forecast uncertainty, canonical is best (leading order).', 12, dim);
  return s;
}
const draw = () =>
  text(40, 52, 'Where you localise matters: the canonical basis is not the best', 26, ink, 'start', 'normal', SERIF) +
  text(40, 80, 'Reconstruction of the Snyder–Hakim 200-variable ensemble Kalman filter test case (50 observations)', 15, muted) +
  chart() + `<path d="M680 104 L 680 384" stroke="${muted}" stroke-opacity=".22" stroke-width="1.2"/>` + hook();
const description = 'Banner for a paper on when canonical covariance localisation fails. Left: a line chart from the paper’s reconstruction of Snyder and Hakim’s 200-variable test case, scored by mean squared analysis error in physical units divided by the Kalman-filter error, for ensemble sizes 4, 8, 16, 32 and 64. The canonical-coordinates curve starts at 1.37 for 4 members and falls to 1.01 for 64; the symmetric (ZCA) whitening curve lies well below it, starting at 1.14 and falling to 1.008, and a dashed curve for the best basis found is almost identical to ZCA. The shaded gap between the curves is the avoidable error. Right: the headline numbers at 8 ensemble members: canonical coordinates give 1.137 times the Kalman-filter error, the best basis found 1.063 times; whitening removes about half the excess error, worth roughly doubling the ensemble. A note gives the scope: error measured in physical units, a known prior covariance and one analysis step; when error is scored relative to the forecast uncertainty, canonical coordinates are best at leading order. Values are from the paper’s Section 10 Monte Carlo (4000 replicates per ensemble size).';
function frame(inner, background) {
  return bannerSvg({ inner, description, background, glow: { color: zcaC, cx: '0.3', cy: '0.55', r: '0.42', opacity: '0.06' } });
}
const thumbSpec = {
  kicker: ['RESEARCH RELEASE · NOVEMBER 2026', 'DATA ASSIMILATION · ENSEMBLE KALMAN FILTERS'],
  head: ['Canonical is', '<em>not the best</em> basis'], headSize: 74,
  sub: 'Snyder and Hakim conjectured the best coordinates for covariance localisation. Scored in physical units, a whitened basis does better.',
  tag: 'UNREFEREED CANDIDATE',
  hero: '<div class="eq-label">analysis error ÷ Kalman error, N = 8</div><div class="hero-title" style="font-size:60px">1.137</div><div class="note">canonical coordinates</div><div class="hero-title" style="font-size:60px">1.063</div><div class="note">best basis found</div><div class="eq-foot">reconstructed Snyder–Hakim test case</div>'
};
module.exports = { draw, description, thumbSpec, NS, CAN, ZCA, BEST };
if (require.main === module) (async () => {
  const fs = require('fs'), pth = require('path'), os = require('os'), vm = require('vm');
  const ROOT = pth.join(__dirname, '..');
  // Guards: the plotted values reproduce the recorded excess reductions and stay ordered.
  for (let i = 0; i < NS.length; i++) {
    const red = (CAN[i] - BEST[i]) / (CAN[i] - 1);
    if (Math.abs(red - RED_BEST[i]) > 1e-3) throw new Error('excess reduction mismatch at N=' + NS[i] + ': ' + red);
    if (!(CAN[i] > ZCA[i] && ZCA[i] >= BEST[i] && BEST[i] > 1)) throw new Error('ordering broken at N=' + NS[i]);
  }
  const mass = 1, mean = (CAN[1] - BEST[1]) / (CAN[1] - 1);
  const reg = JSON.parse(fs.readFileSync(pth.join(ROOT, 'data/BANNER_PALETTES.json'), 'utf8'));
  const { palettes } = require('./banner-palettes');
  const bsaved = reg.assignments.find(r => r.slug === SLUG); if (!bsaved) throw new Error('no saved banner palette'); const bname = bsaved.palette;
  const tp = require('./thumbnail-palettes');
  const tsaved = tp.load().assignments.find(r => r.slug === SLUG); if (!tsaved) throw new Error('no saved thumbnail palette');
  const tname = tsaved.editorialPalette || tsaved.palette;
  const svg = frame(draw(), { name: bname, colors: palettes[bname] });
  fs.writeFileSync(pth.join(ROOT, 'assets/art', SLUG + '.svg'), svg);
  console.log('art:', SLUG, 'banner palette', bname, '| thumbnail palette', tname, '| excess removed at N=8', mean.toFixed(3));
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
