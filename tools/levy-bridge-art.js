'use strict';
const { bannerSvg } = require('./svg-xml');
// Maximal correlation of Lévy bridges (levy-bridge-maximal-correlation): banner, OG, thumbnail.
// "This image helps the reader understand" that pinning the endpoint of a two-dimensional Lévy process can create
// dependence that was not there before: in the Gaussian-Poisson example of Section 6.3 (independent unit-rate Poisson
// jumps of size a = 8 on each side, Brownian parts with correlation rho = 1/5, pinned at (a/2, a/2)), the unpinned
// coefficient is 0.2, while the pinned coefficient is certified in (0.997457967473837283247, 0.997457967473837283251)
// (Appendix A): the two jump counts concentrate on {(0,0),(1,1)}, so they nearly always agree, and the zero-indicator
// correlation is tanh(10/3). The bridge formula of Theorem 2.1 is stated in words underneath.
// checkHook recomputes tanh(10/3) and checks it lies inside the released certified interval
// (results/gaussian_poisson_certificate.json) to double precision, recomputes the four-type switch of Section 6.2
// (q = 4c/(1+4c), c_0 = q, c_1 = sqrt(q/2); equal at c = 1/4, both 1/2) and refuses to draw on mismatch.
// The drawn paths are schematic (fixed pseudo-random wiggles, exact jump size 8 and endpoint 4), labelled as such.
// Reference: txgraffiti-order48-successor (one exact object balanced with immediately readable values).
// Usage: node tools/levy-bridge-art.js [--render OUTDIR_FOR_INSPECTION] [--no-mirror]
const SLUG = 'levy-bridge-maximal-correlation';
const ink = '#f6f2ea', muted = '#e2e7ea', dim = '#c3ccd2', hot = '#ffc36b', cool = '#9fd3ff', rose = '#f2a7b5', mint = '#a8e6c1';
const SANS = 'Arial,Helvetica,sans-serif', SERIF = 'Georgia,serif';
const text = (x, y, s, size = 18, color = ink, anchor = 'start', weight = 'normal', family = SANS, style = 'normal') => {
  if (/<|&(?!(lt|gt|amp|minus|#\d+);)/.test(s.replace(/<\/?tspan[^>]*>/g, ''))) throw new Error('unescaped < or & in SVG text: ' + s);
  return `<text class="og-hide" x="${x}" y="${y}" fill="${color}" font-family="${family}" font-size="${size}" font-weight="${weight}" font-style="${style}" text-anchor="${anchor}">${s}</text>`;
};
// Released values (results/gaussian_poisson_certificate.json; Section 6.3 parameters).
const RELEASED = { lower: '0.997457967473837283247', upper: '0.997457967473837283251', rho: 0.2, a: 8 };
function checkHook() {
  const t = Math.tanh(10 / 3);
  const lo = Number(RELEASED.lower), hi = Number(RELEASED.upper);
  if (!(Math.abs(t - lo) < 1e-15 && Math.abs(t - hi) < 1e-15)) throw new Error('tanh(10/3) outside the released certificate');
  if (!(lo > 0.997 && RELEASED.rho === 0.2)) throw new Error('headline values mismatch');
  const q = c => 4 * c / (1 + 4 * c), c0 = q, c1 = c => Math.sqrt(q(c) / 2);
  if (Math.abs(c0(0.25) - 0.5) > 1e-15 || Math.abs(c1(0.25) - 0.5) > 1e-15) throw new Error('four-type switch mismatch');
  if (!(c1(0.1) > c0(0.1) && c0(1) > c1(1))) throw new Error('dominant term does not switch');
  return { t };
}
// Schematic paths: wiggle from a fixed LCG; jumps of exact size a = 8 at the given times; optional pinning to 4 at t = 1.
function lcg(seed) { let s = seed >>> 0; return () => ((s = (1664525 * s + 1013904223) >>> 0) / 4294967296) - 0.5; }
function path(seed, jumps, pin) {
  const r = lcg(seed), n = 60, pts = []; let w = 0; const ws = [0];
  for (let i = 1; i <= n; i++) { w += r() * 1.15; ws.push(w); }
  for (let i = 0; i <= n; i++) {
    const t = i / n; let v = ws[i] + 8 * jumps.filter(s => s <= t).length;
    if (pin !== undefined) v += t * (pin - ws[n] - 8 * jumps.length);
    pts.push([t, v]);
  }
  return pts;
}
function plot(x0, y0, w, h, series, endpoint) {
  const sx = t => x0 + t * w, sy = v => y0 + h - (v + 4) / 16 * h;
  let s = `<line x1="${x0}" y1="${y0 + h}" x2="${x0 + w}" y2="${y0 + h}" stroke="${dim}" stroke-width="1" opacity="0.6"/>`;
  for (const { pts, col } of series) {
    const d = pts.map(([t, v], i) => (i ? 'L' : 'M') + `${sx(t).toFixed(1)} ${sy(v).toFixed(1)}`).join('');
    s += `<path d="${d}" fill="none" stroke="${col}" stroke-width="2.2" stroke-linejoin="round"/>`;
  }
  if (endpoint) s += `<circle cx="${sx(1)}" cy="${sy(4)}" r="7" fill="none" stroke="${hot}" stroke-width="2.5"/><circle cx="${sx(1)}" cy="${sy(4)}" r="2.5" fill="${hot}"/>`;
  return s;
}
function panel(x0, title, sub, series, endpoint, value, valueCol, note) {
  let s = text(x0, 108, title, 16, valueCol, 'start', 'bold');
  s += text(x0, 130, sub, 13, dim);
  s += plot(x0, 146, 250, 150, series, endpoint);
  s += text(x0 + 290, 214, 'R', 22, muted, 'start', 'normal', SERIF, 'italic');
  s += text(x0 + 312, 214, value, 34, valueCol, 'start', 'bold', SERIF);
  s += text(x0 + 290, 244, note[0], 13, muted);
  s += text(x0 + 290, 262, note[1], 13, muted);
  return s;
}
const draw = () => {
  const X = cool, Y = rose;
  let s = text(40, 46, 'Pinning the endpoint can create dependence', 25, ink, 'start', 'normal', SERIF);
  s += text(40, 74, 'Maximal correlation R of the two coordinate paths of a Lévy process (wiggles plus jumps), before and after pinning', 15, muted);
  s += panel(40, 'Not pinned', 'jumps independent, wiggles correlated 0.2',
    [{ pts: path(11, [0.28], undefined), col: X }, { pts: path(29, [0.71], undefined), col: Y }], false, '= 0.2', mint, ['the jumps of X and Y', 'carry no shared information']);
  s += `<path d="M560 214 L600 214" stroke="${dim}" stroke-width="2"/><path d="M600 214 l-9 -6 v12 z" fill="${dim}"/>`;
  s += panel(620, 'Both ends pinned at the same point', 'the two jump counts now nearly always agree',
    [{ pts: path(11, [0.42], 4), col: X }, { pts: path(29, [0.63], 4), col: Y }], true, '&gt; 0.997', hot, ['certified by interval', 'arithmetic (Appendix A)']);
  s += text(40, 336, 'In general, R for the bridge = the largest of: the wiggle correlation, the dependence of the two lists of jump sizes,', 14, ink);
  s += text(40, 356, 'and a count of jumps the coordinates make at the same moment (Theorem 2.1).', 14, ink);
  s += text(40, 382, 'Schematic paths: X blue, Y pink; jump size 8, endpoint marked. Example of Section 6.3. Unrefereed candidate.', 12, dim);
  return s;
};
const description = 'Banner for a paper on the maximal correlation of Lévy bridges. Title: Pinning the endpoint can create dependence. Subtitle: maximal correlation R of the two coordinate paths of a Lévy process (wiggles plus jumps), before and after pinning. Left panel, not pinned: two schematic paths, X in blue and Y in pink, each with one jump at a different time; jumps independent, wiggles correlated 0.2; R = 0.2, because the jumps of X and Y carry no shared information. An arrow leads to the right panel: both ends pinned at the same point, marked by a ring; the two jump counts now nearly always agree; R greater than 0.997, certified by interval arithmetic (Appendix A). Below: in general, R for the bridge equals the largest of the wiggle correlation, the dependence of the two lists of jump sizes, and a count of jumps the coordinates make at the same moment (Theorem 2.1). Footer: schematic paths, jump size 8, endpoint marked; example of Section 6.3; unrefereed candidate.';
function frame(inner, background) {
  return bannerSvg({ inner, description, background, glow: { color: '#ffc36b', cx: '0.72', cy: '0.5', r: '0.4', opacity: '0.06' } });
}
const thumbSpec = {
  kicker: ['RESEARCH RELEASE · NOVEMBER 2026', 'PROBABILITY'],
  head: ['Pinning a random path’s endpoint', '<em>can create dependence</em>'], headSize: 44,
  sub: 'Maximal correlation of Lévy bridges: an operator-form answer to a question of Chang and Chen.',
  tag: 'UNREFEREED CANDIDATE',
  hero: '<div class="eq-label">maximal correlation, one example</div><div class="hero-title">0.2 → 0.997</div><div class="note">before and after pinning<br>both endpoints</div><div class="eq-foot">Lévy bridge</div>'
};
module.exports = { draw, description, thumbSpec, checkHook };
if (require.main === module) (async () => {
  const fs = require('fs'), pth = require('path'), os = require('os'), vm = require('vm');
  const ROOT = pth.join(__dirname, '..');
  checkHook();
  console.log('check: tanh(10/3) lies in the released certificate; 0.2 and 0.997 headline; four-type switch at c = 1/4 (both terms 1/2)');
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
