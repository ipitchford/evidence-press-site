'use strict';
const { bannerSvg } = require('./svg-xml');
// Essential convex hull criterion for false confidence: banner, OG card and thumbnail.
// "This image helps the reader understand" that with large uncertainty a certain collision still gives a tiny computed collision probability:
// for isotropic Gaussian error and a disc of radius R, Pc(x) <= Q_0(C) = 1 - exp(-R^2 / (2 sigma^2)) for every observation x.
// Source: paper 0.1.0-candidate (4 Nov 2026), Section 6, Theorem 8 and Table 2.
// Usage: node tools/essential-hull-art.js [--render OUTDIR_FOR_INSPECTION] [--no-mirror]
const SLUG = 'essential-hull-false-confidence';
const ink = '#f4f1ea', muted = '#e3d9c9', dim = '#c4b7a2';
const curveC = '#9be3c0', limC = '#ffd77a', ptC = '#ff9a8a';
const SANS = 'Arial,Helvetica,sans-serif', SERIF = 'Georgia,serif';
const text = (x, y, s, size = 18, color = ink, anchor = 'start', weight = 'normal', family = SANS) =>
  `<text class="og-hide" x="${x}" y="${y}" fill="${color}" font-family="${family}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}">${s}</text>`;
const f = v => (+v).toFixed(1);
const maxPc = u => -Math.expm1(-1 / (2 * u * u));
const PX0 = 90, PX1 = 690, PY0 = 112, PY1 = 352, U0 = 0.5, U1 = 20, L0 = 0.001, L1 = 1;
const X = u => PX0 + (PX1 - PX0) * Math.log(u / U0) / Math.log(U1 / U0);
const Y = v => PY1 - (PY1 - PY0) * Math.log(v / L0) / Math.log(L1 / L0);
function plot() {
  let s = text(PX0, PY0 - 12, 'largest computed collision probability over all observations, when a collision is certain', 13, dim);
  const pts = []; for (let k = 0; k <= 160; k++) { const u = U0 * Math.pow(U1 / U0, k / 160); pts.push([u, maxPc(u)]); }
  s += `<path d="M${f(X(U0))} ${f(Y(L0))} ${pts.map(p => 'L' + f(X(p[0])) + ' ' + f(Y(p[1]))).join(' ')} L${f(X(U1))} ${f(Y(L0))} Z" fill="${curveC}" fill-opacity=".16"/>`;
  s += `<path d="${pts.map((p, i) => (i ? 'L' : 'M') + f(X(p[0])) + ' ' + f(Y(p[1]))).join(' ')}" fill="none" stroke="${curveC}" stroke-width="3"/>`;
  s += `<path d="M${PX0} ${f(Y(0.01))} H${PX1}" stroke="${limC}" stroke-dasharray="6 5" stroke-width="1.6"/>` + text(PX0 + 8, Y(0.01) - 7, '1%', 14, limC, 'start', 'bold');
  s += `<path d="M${f(X(10))} ${PY1} V${f(Y(maxPc(10)))}" stroke="${ptC}" stroke-dasharray="4 4" stroke-width="1.5"/><circle cx="${f(X(10))}" cy="${f(Y(maxPc(10)))}" r="6" fill="${ptC}"/>`;
  s += text(X(10) - 12, Y(maxPc(10)) + 24, 'σ/R = 10: at most 0.5%', 14, ptC, 'end', 'bold');
  s += `<path d="M${PX0} ${PY1} H${PX1} M${PX0} ${PY1} V${PY0}" stroke="${dim}" stroke-width="1.2"/>`;
  for (const a of [0.5, 1, 2, 5, 10, 20]) s += text(X(a), PY1 + 20, String(a), 12, dim, 'middle');
  for (const [b, l] of [[1, '100%'], [0.1, '10%'], [0.001, '0.1%']]) s += text(PX0 - 10, Y(b) + 4, l, 12, dim, 'end');
  s += text((PX0 + PX1) / 2, PY1 + 38, 'uncertainty relative to object size, σ/R (log scale)', 13, dim, 'middle');
  return s;
}
function panel() {
  const RX = 735;
  let s = text(RX, 140, 'A certain collision.', 28, ptC, 'start', 'bold', SERIF);
  s += text(RX, 174, 'Computed probability: under 1%.', 22, limC, 'start', 'bold', SERIF);
  s += text(RX, 219, 'Which hypotheses mislead like this?', 16, ink, 'start', 'normal', SERIF);
  s += text(RX, 243, 'Those with the truth strictly inside', 16, ink, 'start', 'normal', SERIF);
  s += text(RX, 265, 'their essential convex hull.', 16, ink, 'start', 'normal', SERIF);
  s += text(RX, 311, 'Only halfspaces are calibrated both ways.', 15, curveC, 'start', 'bold');
  s += text(RX, 349, 'Known shape, exact model, light tails', 13, dim);
  return s;
}
const draw = () =>
  text(40, 52, 'When a probability favours a false hypothesis, and why', 26, ink, 'start', 'normal', SERIF) +
  text(40, 80, 'Isotropic Gaussian error, disc of radius R: Pc ≤ 1 − exp(−R²/2σ²) for every observation', 15, muted) +
  plot() + `<path d="M712 108 L 712 372" stroke="${muted}" stroke-opacity=".22" stroke-width="1.2"/>` + panel();
const description = 'Banner for a paper on false confidence in location models. Left: on logarithmic axes, the largest computed collision probability over all observations, 1 minus exp of minus R squared over 2 sigma squared, falls as uncertainty sigma over R grows from 0.5 to 20, although a collision is certain. A dashed line marks 1 percent, and a red marker at sigma over R equal to 10 shows at most 0.5 percent. Right: a certain collision has a computed probability under 1 percent; hypotheses mislead in this all-threshold sense when the truth lies strictly inside their essential convex hull; only halfspaces are calibrated both ways; the model assumes known shape, an exact model and light tails.';
function frame(inner, background) {
  return bannerSvg({ inner, description, background, glow: { color: curveC, cx: '0.30', cy: '0.55', r: '0.42', opacity: '0.06' } });
}
const thumbSpec = {
  kicker: ['RESEARCH RELEASE · NOVEMBER 2026', 'STATISTICS · CALIBRATION'],
  head: ['A certain collision.', '<em>Computed: under 1%</em>'], headSize: 66,
  sub: 'Which false hypotheses can a probability favour? In location models, exactly those whose essential convex hull has the truth strictly inside.',
  tag: 'UNREFEREED CANDIDATE',
  hero: '<div class="eq-label">Gaussian error, disc radius R, σ/R = 10</div><div class="hero-title">Pc ≤ 0.5%</div><div class="note">for every observation<br>though a collision is certain<br>Pc ≤ 1 − exp(−R²/2σ²)</div><div class="eq-foot">written proofs · finite checks</div>'
};
module.exports = { draw, description, thumbSpec };
if (require.main === module) (async () => {
  const fs = require('fs'), pth = require('path'), os = require('os'), vm = require('vm');
  const ROOT = pth.join(__dirname, '..');
  // Guard: paper Table 2 gives Q_0(C) = 0.00499 at sigma/R = 10.
  if (Math.abs(maxPc(10) - 0.00499) > 5e-6 || maxPc(10) >= 0.01) throw new Error('conjunction bound');
  const bp = require('./banner-palettes').resolve(SLUG); const bname = bp.name;
  const tname = require('./thumbnail-palettes').resolve(SLUG, true);
  const svg = frame(draw(), bp);
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
