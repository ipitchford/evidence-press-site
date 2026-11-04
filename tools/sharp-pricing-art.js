'use strict';
const { bannerSvg } = require('./svg-xml');
// Sharp multiserver pricing guarantees: banner, OG card and thumbnail.
// "This image helps the reader understand" that the two worst cases of the fixed-price rule occur at different loads:
// with C=5 servers and capacity N=7, the exact curves f(x)=m(x)/x and alpha(x)=1-B(x), drawn from the M/M/5/7 stationary law.
// Source: paper 0.1.0-candidate (4 Nov 2026), Section 1 worked example, (2.3), (2.4), (4.5).
// Usage: node tools/sharp-pricing-art.js [--render OUTDIR_FOR_INSPECTION] [--no-mirror]
const SLUG = 'sharp-multiserver-pricing-guarantees';
const ink = '#f4f1ea', muted = '#e3d9c9', dim = '#c4b7a2';
const occC = '#ff9a8a', revC = '#9be3c0', limC = '#ffd77a';
const SANS = 'Arial,Helvetica,sans-serif', SERIF = 'Georgia,serif';
const text = (x, y, s, size = 18, color = ink, anchor = 'start', weight = 'normal', family = SANS) =>
  `<text class="og-hide" x="${x}" y="${y}" fill="${color}" font-family="${family}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}">${s}</text>`;
const f1 = v => (+v).toFixed(1);
const C = 5, N = 7, fact = n => (n < 2 ? 1 : n * fact(n - 1)), w = j => (j <= C ? 1 / fact(j) : 1 / (fact(C) * C ** (j - C)));
const stat = x => { let Z = 0, M = 0; for (let j = 0; j <= N; j++) { const v = w(j) * x ** j; Z += v; M += j * v; } return { m: M / Z, B: w(N) * x ** N / Z }; };
const occ = x => (x <= 0 ? 1 : stat(x).m / x), alpha = x => 1 - stat(x).B;
const peak = (() => { let b = [0, 0]; for (let x = 0.01; x <= 5; x += 0.001) { const v = occ(x); if (v > b[1]) b = [x, v]; } return b; })();
const PX0 = 90, PX1 = 690, X = x => PX0 + (PX1 - PX0) * x / 5;
function panelPlot(y0, y1, lo, hi, fn, color, label) {
  const Y = v => y1 - (y1 - y0) * (v - lo) / (hi - lo);
  const pts = []; for (let k = 1; k <= 200; k++) { const x = 5 * k / 200; pts.push([x, fn(x)]); }
  let s = `<path d="${pts.map((p, i) => (i ? 'L' : 'M') + f1(X(p[0])) + ' ' + f1(Y(Math.max(lo, p[1])))).join(' ')}" fill="none" stroke="${color}" stroke-width="3"/>`;
  s += `<path d="M${PX0} ${y1} H${PX1} M${PX0} ${y1} V${y0}" stroke="${dim}" stroke-width="1.2"/>`;
  s += text(PX0 + 6, y0 - 4, label, 13, color, 'start', 'bold');
  return { s, Y };
}
function plot() {
  const a = panelPlot(118, 214, 0.92, 1.02, occ, occC, 'mean occupancy factor (fixed price ÷ best dynamic)');
  const b = panelPlot(248, 344, 0.8, 1.0, alpha, revC, 'share of optimal revenue kept (lower bound)');
  let s = a.s + b.s;
  const px = X(peak[0]), py = a.Y(peak[1]);
  s += `<path d="M${f1(px)} ${f1(py)} V344" stroke="${limC}" stroke-dasharray="5 5" stroke-width="1.5"/><circle cx="${f1(px)}" cy="${f1(py)}" r="6" fill="${occC}"/>`;
  s += text(px - 10, py + 26, 'worst: 1.01003 at load 2.59', 14, occC, 'end', 'bold');
  const ry = b.Y(alpha(5));
  s += `<circle cx="${X(5)}" cy="${f1(ry)}" r="6" fill="${revC}"/>` + text(X(5) - 24, ry + 1, 'worst: 81.85% at load 5', 14, revC, 'end', 'bold');
  for (const v of [0, 1, 2, 3, 4, 5]) s += text(X(v), 362, String(v), 12, dim, 'middle');
  s += text((PX0 + PX1) / 2, 380, 'offered load (5 servers, room for 7 customers)', 13, dim, 'middle');
  return s;
}
function panel() {
  const RX = 735;
  let s = text(RX, 140, 'One fixed price,', 28, ink, 'start', 'bold', SERIF);
  s += text(RX, 174, 'one customer cap.', 28, ink, 'start', 'bold', SERIF);
  s += text(RX, 219, 'The published guarantees', 17, limC, 'start', 'bold', SERIF);
  s += text(RX, 243, 'cannot be improved,', 17, limC, 'start', 'bold', SERIF);
  s += text(RX, 267, 'and their worst cases sit at different loads.', 15, ink, 'start', 'normal', SERIF);
  s += text(RX, 311, 'A quartic decides when they coincide.', 15, revC, 'start', 'bold');
  s += text(RX, 349, 'This construction only; best fixed price stays open', 13, dim);
  return s;
}
const draw = () =>
  text(40, 52, 'How much can a simple fixed price lose?', 26, ink, 'start', 'normal', SERIF) +
  text(40, 80, 'Exact curves for C = 5, N = 7: congestion peaks long before revenue bottoms out', 15, muted) +
  plot() + `<path d="M712 108 L 712 372" stroke="${muted}" stroke-opacity=".22" stroke-width="1.2"/>` + panel();
const description = 'Banner for a paper on sharp static pricing guarantees. Left: two exact curves against offered load for five servers and capacity seven. Mean occupancy factor peaks at 1.01003 at load 2.59. The share of optimal revenue kept falls to 81.85 percent at load 5. Right: the published guarantees cannot be improved, their worst cases sit at different loads, and a quartic decides when they coincide; this concerns one construction and the best fixed price stays open.';
function frame(inner, background) {
  return bannerSvg({ inner, description, background, glow: { color: revC, cx: '0.30', cy: '0.55', r: '0.42', opacity: '0.06' } });
}
const thumbSpec = {
  kicker: ['RESEARCH RELEASE · NOVEMBER 2026', 'OPERATIONS RESEARCH · PRICING'],
  head: ['81.85% of revenue.', '<em>Cannot be improved</em>'], headSize: 66,
  sub: 'A fixed price with a customer cap has published worst-case guarantees. For this construction, they are now proved exact for every number of servers.',
  tag: 'UNREFEREED CANDIDATE',
  hero: '<div class="eq-label">5 servers, room for 7 customers</div><div class="hero-title">1.01003</div><div class="note">worst occupancy factor<br>at load 2.59, not 5<br>revenue worst at load 5</div><div class="eq-foot">written proofs, best fixed price open</div>'
};
module.exports = { draw, description, thumbSpec };
if (require.main === module) (async () => {
  const fs = require('fs'), pth = require('path'), os = require('os'), vm = require('vm');
  const ROOT = pth.join(__dirname, '..');
  // Guards: paper Section 1, C=5, N=7: 81.85%, 1.01003, load about 2.59.
  if (Math.abs(alpha(5) - 0.8185) > 5e-5 || Math.abs(peak[1] - 1.01003) > 5e-6 || Math.abs(peak[0] - 2.59) > 0.005) throw new Error('worked example');
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
