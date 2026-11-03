'use strict';
const { bannerSvg } = require('./svg-xml');
// Sharp ratios of negative-exponent Riesz capacities: banner, OG card and thumbnail.
// "This image helps the reader understand" that exponent two is an exact threshold: below the diagonal of the
// exponent plane the regular simplex maximises C_s/C_t exactly when s >= 2, and for s < 2 splitting one vertex of
// the simplex beats it; above the diagonal two points maximise C_t/C_s.
// Source (paper 0.1.0-candidate, 3 Nov 2026): Theorem 1 (C_t/C_s <= 2^gamma), Theorem 2 (C_s/C_t <= (n/(n+1))^gamma
// for 2 <= s < t), Theorem 7 and Corollary 8 (vertex split K_h beats the simplex for 0 < s < 2, n >= 2), Figure 1.
// The region map is schematic: it shows which configuration is extremal, not measured values.
// Usage: node tools/riesz-capacity-art.js [--render OUTDIR_FOR_INSPECTION] [--no-mirror]
const SLUG = 'riesz-capacity-ratio-conjectures';
const ink = '#f4f1ea', muted = '#e3d9c9', dim = '#c4b7a2';
const twoC = '#7fd8c4', simC = '#b9a6ff', badC = '#ffb38a', thrC = '#ffd56b';
const SANS = 'Arial,Helvetica,sans-serif', SERIF = 'Georgia,serif';
const text = (x, y, s, size = 18, color = ink, anchor = 'start', weight = 'normal', family = SANS) =>
  `<text class="og-hide" x="${x}" y="${y}" fill="${color}" font-family="${family}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}">${s}</text>`;
const f = v => (+v).toFixed(1);
const SUB = (v, rest) => `<tspan dy="4" font-size="10">${v}</tspan><tspan dy="-4">${rest}</tspan>`;
const cn = n => n / (n + 1);
// Exponent plane: denominator exponent u (x) and numerator exponent v (y), both 0..6, as in the paper's Figure 1.
const X0 = 100, X1 = 430, Y0 = 356, Y1 = 116, MAX = 6;
const X = u => X0 + u / MAX * (X1 - X0);
const Y = v => Y0 - v / MAX * (Y0 - Y1);
const poly = (pts, fill, op) => `<path d="M${pts.map(([u, v]) => `${f(X(u))} ${f(Y(v))}`).join(' L')} Z" fill="${fill}" fill-opacity="${op}"/>`;
function chart() {
  let s = '';
  s += poly([[0, 0], [MAX, MAX], [0, MAX]], twoC, 0.22);
  s += poly([[2, 2], [MAX, MAX], [MAX, 2]], simC, 0.26);
  s += poly([[0, 0], [2, 2], [MAX, 2], [MAX, 0]], badC, 0.22);
  s += `<path d="M${X0} ${Y0} L${f(X(MAX))} ${f(Y(MAX))}" stroke="${muted}" stroke-opacity=".7" stroke-width="1.4" stroke-dasharray="5 5"/>`;
  s += `<path d="M${f(X(2))} ${f(Y(2))} H${f(X(MAX))}" stroke="${thrC}" stroke-width="4"/>`;
  s += `<path d="M${X0} ${Y0} H${X1} M${X0} ${Y0} V${Y1}" stroke="${dim}" stroke-width="1.3"/>`;
  for (let k = 0; k <= MAX; k += 2) {
    s += `<path d="M${f(X(k))} ${Y0} v6" stroke="${dim}" stroke-width="1.2"/>` + text(X(k), Y0 + 21, String(k), 13, dim, 'middle');
    s += `<path d="M${X0} ${f(Y(k))} h-6" stroke="${dim}" stroke-width="1.2"/>` + text(X0 - 10, Y(k) + 5, String(k), 13, dim, 'end');
  }
  s += text(X1, Y0 + 40, 'exponent in the denominator', 13, dim, 'end', 'normal', SERIF);
  s += text(X0 - 30, Y1 - 12, 'exponent in the numerator', 13, dim, 'start', 'normal', SERIF);
  s += text(X(0.35), Y(5.2), 'two points best', 16, twoC, 'start', 'bold');
  s += text(X(0.35), Y(5.2) + 19, 'for C' + SUB('t', ' / C') + SUB('s', ' (Thm 1)'), 13, twoC);
  s += text(X(5.85), Y(3.05), 'regular simplex', 15, simC, 'end', 'bold');
  s += text(X(5.85), Y(3.05) + 18, 'best (Thm 2)', 15, simC, 'end', 'bold');
  s += text(X(5.85), Y(0.95), 'simplex beaten:', 15, badC, 'end', 'bold');
  s += text(X(5.85), Y(0.95) + 18, 'split a vertex (Thm 7)', 13, badC, 'end');
  s += text(X(MAX) + 8, Y(2) + 5, 's = 2', 15, thrC, 'start', 'bold');
  return s;
}
// Regular triangle (n = 2) and the same triangle with one vertex split into a close pair, Theorem 7's K_h.
function tri(cx, cy, r, split) {
  const v = [0, 1, 2].map(k => [cx + r * Math.sin(2 * Math.PI * k / 3), cy - r * Math.cos(2 * Math.PI * k / 3)]);
  let s = `<path d="M${v.map(p => p.map(f).join(' ')).join(' L')} Z" fill="none" stroke="${muted}" stroke-opacity=".45" stroke-width="1.4"/>`;
  const dot = (x, y, rr, c) => `<circle cx="${f(x)}" cy="${f(y)}" r="${rr}" fill="${c}" stroke="#1b1b1b" stroke-width="1.2"/>`;
  if (!split) { v.forEach(([x, y]) => { s += dot(x, y, 9, simC); }); return s; }
  const h = 13; // split the top vertex along the direction perpendicular to the centroid ray
  s += dot(v[0][0] - h, v[0][1], 7, badC) + dot(v[0][0] + h, v[0][1], 7, badC);
  s += `<path d="M${f(v[0][0] - h)} ${f(v[0][1] - 16)} H${f(v[0][0] + h)}" stroke="${badC}" stroke-width="1.3"/>` + text(v[0][0], v[0][1] - 22, '2h', 12, badC, 'middle', 'bold');
  [v[1], v[2]].forEach(([x, y]) => { s += dot(x, y, 9, badC); });
  return s;
}
function right() {
  let s = '';
  s += tri(615, 222, 74, false) + tri(845, 222, 74, true);
  s += text(615, 330, 'regular simplex', 16, simC, 'middle', 'bold');
  s += text(615, 350, 'optimal when s ≥ 2', 13, dim, 'middle');
  s += text(845, 330, 'one vertex split in two', 16, badC, 'middle', 'bold');
  s += text(845, 350, 'beats it when s &lt; 2', 13, dim, 'middle');
  s += `<path d="M708 226 H742" stroke="${muted}" stroke-width="1.6"/><path d="M742 226 l-9 -5 v10 Z" fill="${muted}"/>`;
  const x = 960;
  s += text(x, 150, 'Exact threshold', 19, thrC, 'start', 'normal', SERIF);
  s += text(x, 180, 'For C' + SUB('s', ' / C') + SUB('t', ' with s &lt; t'), 13, dim);
  s += text(x, 199, 'in every dimension n ≥ 2:', 13, dim);
  s += text(x, 234, 'simplex optimal', 17, ink, 'start', 'bold');
  s += text(x, 258, '⇔  s ≥ 2', 22, thrC, 'start', 'bold');
  s += text(x, 292, 'bound (n/(n+1))<tspan dy="-7" font-size="10">γ</tspan><tspan dy="7">, γ = 1/s − 1/t</tspan>', 13, dim);
  s += text(x, 318, '(Corollary 8)', 12, dim, 'start', 'normal', SERIF);
  return s;
}
const draw = () =>
  text(40, 52, 'When is the regular simplex the best shape?', 26, ink, 'start', 'normal', SERIF) +
  text(40, 80, 'Ratios of negative-exponent Riesz capacities of a compact set: the answer switches exactly at exponent 2', 15, muted) +
  chart() + `<path d="M520 112 L 520 372" stroke="${muted}" stroke-opacity=".22" stroke-width="1.2"/>` + right() +
  `<path d="M940 130 L 940 330" stroke="${muted}" stroke-opacity=".18" stroke-width="1.2"/>`;
const description = 'Banner for a paper on ratios of negative-exponent Riesz capacities. On the left, a map of the plane of the two exponents (numerator against denominator, 0 to 6), following the paper\'s Figure 1. Above the dashed diagonal, shaded green, two points maximise C_t/C_s (Theorem 1). Below the diagonal the ratio is C_s/C_t: where the numerator exponent s is at least 2, shaded violet, the regular simplex is best (Theorem 2); where s is below 2, shaded orange, the simplex is beaten by splitting a vertex (Theorem 7). A gold line marks the threshold s = 2. On the right, an equilateral triangle with three equal violet points (the regular simplex, optimal when s is at least 2) and an arrow to the same triangle with its top vertex split into two nearby orange points a distance 2h apart, which beats it when s is below 2. A side panel states the exact threshold: for C_s/C_t with s < t in every dimension n of at least 2, the simplex is optimal if and only if s is at least 2, with the bound (n/(n+1)) to the power gamma, gamma = 1/s - 1/t (Corollary 8). The map is schematic, not numerical data.';
function frame(inner, background) {
  return bannerSvg({ inner, description, background, glow: { color: simC, cx: '0.55', cy: '0.55', r: '0.42', opacity: '0.06' } });
}
const thumbSpec = {
  kicker: ['RESEARCH RELEASE · NOVEMBER 2026', 'GEOMETRY · RIESZ CAPACITY'],
  head: ['When is the simplex', '<em>the best shape?</em>'], headSize: 66,
  sub: 'Two conjectures on ratios of Riesz capacities, settled, and an exact threshold: the regular simplex wins exactly when the exponent is at least 2.',
  tag: 'UNREFEREED CANDIDATE',
  hero: '<div class="eq-label">for C<sub>s</sub> / C<sub>t</sub> with s &lt; t, n ≥ 2</div><div class="hero-title">optimal ⇔ s ≥ 2</div><div class="note">below 2, splitting one vertex<br>of the simplex beats it;<br>two points maximise C<sub>t</sub> / C<sub>s</sub></div><div class="eq-foot">written proofs · exact checks</div>'
};
module.exports = { draw, description, thumbSpec, cn };
if (require.main === module) (async () => {
  const fs = require('fs'), pth = require('path'), os = require('os'), vm = require('vm');
  const ROOT = pth.join(__dirname, '..');
  // Guards: the bound and threshold match the paper (c_n = n/(n+1); triangle value (2/3)^gamma; threshold at 2).
  if (Math.abs(cn(2) - 2 / 3) > 1e-15 || Math.abs(cn(3) - 0.75) > 1e-15) throw new Error('c_n mismatch');
  if (Math.abs(Math.pow(cn(3), 1 / 2 - 1 / 4) - Math.pow(0.75, 0.25)) > 1e-15) throw new Error('gamma mismatch');
  const bp = require('./banner-palettes'); const { palettes } = bp;
  const b0 = bp.resolve(SLUG); if (!b0) throw new Error('no banner palette'); const bname = b0.name;
  const tp = require('./thumbnail-palettes');
  const tname = tp.resolve(SLUG, true);
  const svg = frame(draw(), { name: bname, colors: palettes[bname] });
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
  if (process.argv.includes('--banner-only')) { await b.close(); return; }
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
