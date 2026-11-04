'use strict';
const { bannerSvg } = require('./svg-xml');
// Sharp variance ordering for rotating Gaussian samplers: banner, OG card and thumbnail.
// "This image helps the reader understand" that for a kinetic Langevin sampler of a Gaussian target, the long-run
// variance of a linear observable under a matched rotation of strength mu is the oscillator spectrum evaluated at the
// shifted frequency xi = lambda*mu, S(xi) = 2 gamma / (xi^4 + (gamma^2 - 2) xi^2 + 1); at gamma = 1 the spectrum has a
// resonance hump (S rises from 2 to 8/3 at xi = 1/sqrt2, so small rotations raise the variance), while at gamma = sqrt2
// it is single-peaked at zero (every rotation lowers the variance, and by Theorems 1-2 so for every observable).
// Source (paper 0.1.0-candidate): formula (8) for S_gamma, formula (10) for the linear observable, Theorem 1, Theorem 2.
// Every number drawn is computed below from those formulas.
// Usage: node tools/rotating-gaussian-art.js [--render OUTDIR_FOR_INSPECTION] [--no-mirror]
const SLUG = 'rotating-gaussian-variance-ordering';
const ink = '#f4f1ea', muted = '#e3d9c9', dim = '#c9bcae';
const hotC = '#ffa07a', coolC = '#8fd3ff', okC = '#9be3c0';
const SANS = 'Arial,Helvetica,sans-serif', SERIF = 'Georgia,serif';
const text = (x, y, s, size = 18, color = ink, anchor = 'start', weight = 'normal', family = SANS) =>
  `<text class="og-hide" x="${x}" y="${y}" fill="${color}" font-family="${family}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}">${s}</text>`;
const f = v => (+v).toFixed(1);
// --- exact model ----------------------------------------------------------------------------------------------
const S = (g, xi) => 2 * g / (xi ** 4 + (g * g - 2) * xi * xi + 1);
const G1 = 1, G2 = Math.SQRT2;
const xiPeak1 = Math.sqrt(1 - G1 * G1 / 2), peak1 = S(G1, xiPeak1);            // 1/sqrt2, 8/3
const cross1 = Math.sqrt(2 - G1 * G1);                                          // S(1, xi) = S(1, 0) again at xi = 1
// --- drawing --------------------------------------------------------------------------------------------------
const PX0 = 92, PX1 = 700, PY0 = 112, PY1 = 352, XMAX = 2.6, YMAX = 3.0;
const X = xi => PX0 + (PX1 - PX0) * xi / XMAX, Yp = s => PY1 - (PY1 - PY0) * s / YMAX;
function curve(g, color, width) {
  let d = ''; for (let i = 0; i <= 260; i++) { const xi = XMAX * i / 260; d += (i ? ' L' : 'M') + f(X(xi)) + ' ' + f(Yp(S(g, xi))); }
  return `<path d="${d}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"/>`;
}
function plot() {
  let s = `<path d="M${PX0} ${PY0 - 8} L${PX0} ${PY1} L${PX1 + 10} ${PY1}" fill="none" stroke="${muted}" stroke-opacity=".55" stroke-width="1.4"/>`;
  for (const v of [1, 2, 3]) s += `<path d="M${PX0 - 5} ${f(Yp(v))} L${PX0} ${f(Yp(v))}" stroke="${muted}" stroke-opacity=".55"/>` + text(PX0 - 10, Yp(v) + 4, String(v), 12, dim, 'end');
  for (const v of [0, 1, 2]) s += text(X(v), PY1 + 18, String(v), 12, dim, 'middle');
  s += text((PX0 + PX1) / 2, PY1 + 38, 'rotation strength  λμ  (frequency shift)', 13, dim, 'middle');
  s += `<text class="og-hide" x="${PX0 - 34}" y="${(PY0 + PY1) / 2}" fill="${dim}" font-family="${SANS}" font-size="13" text-anchor="middle" transform="rotate(-90 ${PX0 - 34} ${(PY0 + PY1) / 2})">long-run variance</text>`;
  // gamma = 1: dashed level at the unrotated value, hump above it shaded
  s += `<path d="M${PX0} ${f(Yp(S(G1, 0)))} L${f(X(cross1))} ${f(Yp(S(G1, 0)))}" stroke="${hotC}" stroke-opacity=".7" stroke-dasharray="5 5" stroke-width="1.4"/>`;
  let hump = `M${PX0} ${f(Yp(S(G1, 0)))}`; for (let i = 0; i <= 80; i++) { const xi = cross1 * i / 80; hump += ` L${f(X(xi))} ${f(Yp(S(G1, xi)))}`; }
  s += `<path d="${hump} Z" fill="${hotC}" fill-opacity=".22"/>`;
  s += curve(G2, coolC, 3.2) + curve(G1, hotC, 3.2);
  s += `<circle cx="${f(X(xiPeak1))}" cy="${f(Yp(peak1))}" r="5" fill="${hotC}"/><circle cx="${PX0}" cy="${f(Yp(S(G1, 0)))}" r="4.5" fill="${hotC}"/><circle cx="${PX0}" cy="${f(Yp(S(G2, 0)))}" r="4.5" fill="${coolC}"/>`;
  s += text(X(1.05), Yp(2.62), 'friction γ = 1: resonance hump, 2 rises to 8/3', 14, hotC, 'start', 'bold');
  s += text(X(1.05), Yp(2.62) + 18, 'small rotations raise the variance', 13, hotC);
  s += text(X(1.3), Yp(1.6), 'friction γ = √2: single peak at 0', 14, coolC, 'start', 'bold');
  s += text(X(1.3), Yp(1.6) + 18, 'every rotation lowers the variance', 13, coolC);
  return s;
}
function side() {
  const X0 = 772;
  let s = `<path d="M748 104 L 748 368" stroke="${muted}" stroke-opacity=".22" stroke-width="1.2"/>`;
  s += text(X0, 128, 'S(ξ) = 2γ / (ξ⁴ + (γ² − 2)ξ² + 1)', 19, ink, 'start', 'normal', SERIF);
  s += text(X0, 152, 'oscillator spectrum; a linear observable’s', 13, dim);
  s += text(X0, 169, 'variance is S at the shifted frequency', 13, dim);
  s += text(X0, 214, 'No resonance peak', 24, okC, 'start', 'bold', SERIF);
  s += text(X0, 244, '→ rotation never hurts', 24, okC, 'start', 'bold', SERIF);
  s += text(X0, 278, 'for every square-integrable observable', 14, ink);
  s += text(X0, 296, 'exactly when γ ≥ √2 (convolution keeps', 14, ink);
  s += text(X0, 314, 'single peaks single)', 14, ink);
  s += text(X0, 350, 'Below √2: even observables still improve;', 13, dim);
  s += text(X0, 367, 'a large enough rotation helps them all', 13, dim);
  return s;
}
const draw = () =>
  text(40, 50, 'Rotating a kinetic sampler: the spectrum decides', 26, ink, 'start', 'normal', SERIF) +
  text(40, 78, 'Gaussian target, matched target-preserving rotation; long-run variance of a linear observable, exact formula', 14, muted) +
  plot() + side();
const description = `Banner for a paper on rotating kinetic Langevin samplers. A plot of the long-run variance of a linear observable against rotation strength, which equals the oscillator spectrum S(xi) = 2 gamma / (xi^4 + (gamma^2 - 2) xi^2 + 1) at the shifted frequency. Orange curve, friction gamma = 1: starts at 2 and rises to a resonance hump of ${peak1.toFixed(2)} at shift ${xiPeak1.toFixed(2)} before falling, so small rotations raise the variance; the region above the unrotated level is shaded. Blue curve, friction gamma = square root of 2: starts at ${S(G2, 0).toFixed(2)} and falls steadily, so every rotation lowers the variance. Side text: no resonance peak means rotation never hurts, for every square-integrable observable exactly when gamma is at least square root of 2, because convolution keeps single peaks single; below the threshold even observables still improve and a large enough rotation helps them all.`;
function frame(inner, background) {
  return bannerSvg({ inner, description, background, glow: { color: coolC, cx: '0.3', cy: '0.6', r: '0.45', opacity: '0.06' } });
}
const thumbSpec = {
  kicker: ['RESEARCH RELEASE · NOVEMBER 2026', 'SAMPLING · KINETIC LANGEVIN'],
  head: ['Rotation never hurts', '<em>once friction ≥ √2</em>'], headSize: 64,
  sub: 'For Gaussian kinetic Langevin samplers, a target-preserving rotation lowers the long-run variance of every observable exactly when there is no resonance peak.',
  tag: 'UNREFEREED CANDIDATE',
  hero: `<div class="eq-label">linear observable, friction γ = 1</div><div class="hero-title">2 → ${peak1.toFixed(2)}</div><div class="note">resonance hump: small rotations<br>raise the variance<br>at γ = √2 every rotation helps</div><div class="eq-foot">exact theorems · Gaussian targets</div>`
};
function guards() {
  if (Math.abs(peak1 - 8 / 3) > 1e-12) throw new Error('gamma = 1 peak is not 8/3');
  if (Math.abs(S(G1, 0) - 2) > 1e-12 || Math.abs(S(G1, cross1) - 2) > 1e-12) throw new Error('gamma = 1 crossing wrong');
  for (let i = 1; i <= 2600; i++) { const a = S(G2, (i - 1) / 1000), b = S(G2, i / 1000); if (!(b < a)) throw new Error('gamma = sqrt2 spectrum not decreasing'); }
}
module.exports = { draw, description, thumbSpec };
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
  console.log('art:', SLUG, 'banner palette', bname, '| thumbnail palette', tname, '| peak gamma=1:', peak1.toFixed(4), 'at', xiPeak1.toFixed(4));
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
