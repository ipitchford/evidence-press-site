'use strict';
const { bannerSvg } = require('./svg-xml');
// Shrinking boundary potentials and resonance (shrinking-boundary-potentials): banner, OG, thumbnail.
// "This image helps the reader understand" that one zero-energy solution across a thin film at a hard wall decides the
// limit: beyond the film it is a straight line; a tilted line (non-resonant) leaves a hard wall, moved outward by eps*c_V
// where the line meets zero (c_V = tan(k l)/k - l for a square well); a flat line (resonant) gives a Robin wall. The limit is
// uniform exactly when the film cannot bind a particle (k l <= pi/2 for the square well), shown by the paper's four
// square-well cases (k l = 1, pi/2, pi, 3 pi/2; Table 1 and Section 2.5).
// checkHook recomputes c_V = tan(1) - 1 and the predicted eigenvalue slope -2 j01^2 c_V and compares them with the released
// logs/eigenvalue_shift.json (copied below); checks the square-well tail slope cos(k l) (resonant iff zero) and the
// binding threshold k l > pi/2 for the four drawn cases; it refuses to draw on mismatch.
// Reference: txgraffiti-order48-successor (one exact object balanced with immediately readable values).
// Usage: node tools/boundary-film-art.js [--render OUTDIR_FOR_INSPECTION] [--no-mirror]
const SLUG = 'shrinking-boundary-potentials';
const ink = '#f6f2ea', muted = '#e2e7ea', dim = '#c3ccd2', hot = '#ffc36b', cool = '#9fd3ff', rose = '#f2a7b5', mint = '#a8e6c1';
const SANS = 'Arial,Helvetica,sans-serif', SERIF = 'Georgia,serif';
const text = (x, y, s, size = 18, color = ink, anchor = 'start', weight = 'normal', family = SANS, style = 'normal') => {
  if (/<|&(?!(lt|gt|amp|minus|#\d+);)/.test(s.replace(/<\/?tspan[^>]*>/g, ''))) throw new Error('unescaped < or & in SVG text: ' + s);
  return `<text class="og-hide" x="${x}" y="${y}" fill="${color}" font-family="${family}" font-size="${size}" font-weight="${weight}" font-style="${style}" text-anchor="${anchor}">${s}</text>`;
};
// Square well V = -k^2 on [0, l]: y = sin(k t)/k on [0, l], then affine with slope cos(k l).
const tailSlope = kl => Math.cos(kl);
const cV = (k, l) => Math.tan(k * l) / k - l;
const binds = kl => kl > Math.PI / 2 + 1e-12; // h_V has a negative eigenvalue iff k l > pi/2 (Section 2.5)
const CASES = [
  { kl: 1, label: 'kℓ = 1', wall: 'hard', uniform: 'yes', rate: 'error of order ε' },
  { kl: Math.PI / 2, label: 'kℓ = π/2', wall: 'Robin', uniform: 'yes', rate: 'error of order √ε' },
  { kl: Math.PI, label: 'kℓ = π', wall: 'hard', uniform: 'no', rate: 'error stays maximal' },
  { kl: 3 * Math.PI / 2, label: 'kℓ = 3π/2', wall: 'Robin', uniform: 'no', rate: 'error stays maximal' }];
function checkHook() {
  // released logs/eigenvalue_shift.json: c_V and predicted_slope; j01^2 from the same file
  const released = { c_V: 0.5574077246549022305069748, j01sq: 5.783185962946784521175996, slope: -6.4471850577246737593 };
  const c = cV(1, 1);
  if (Math.abs(c - released.c_V) > 1e-12) throw new Error('c_V mismatch');
  if (Math.abs(-2 * released.j01sq * c - released.slope) > 1e-9) throw new Error('slope mismatch');
  for (const s of CASES) {
    const resonant = Math.abs(tailSlope(s.kl)) < 1e-12;
    if ((s.wall === 'Robin') !== resonant) throw new Error('resonance mismatch at ' + s.label);
    if ((s.uniform === 'no') !== binds(s.kl)) throw new Error('binding mismatch at ' + s.label);
  }
  return { c };
}
// ---- left: the zero-energy solution across the film ----
function left(v) {
  const x0 = 200, x1 = 480, yB = 330, yT = 120;           // t from -1 to 3 (film units), y from -0.2 to 2.0
  const X = t => x0 + (x1 - x0) * (t + 1) / 4, Y = y => yB - (yB - yT) * (y + 0.2) / 2.2;
  let s = text(40, 100, 'One line across the film decides', 15, muted, 'start', 'bold');
  // wall and film
  s += `<rect x="${X(0)}" y="${yT - 6}" width="${(X(1) - X(0)).toFixed(1)}" height="${yB - yT + 12}" fill="${hot}" opacity="0.13"/>`;
  s += `<line x1="${X(0)}" y1="${yT - 6}" x2="${X(0)}" y2="${yB + 6}" stroke="${ink}" stroke-width="4"/>`;
  for (let i = 0; i < 7; i++) s += `<line x1="${X(0)}" y1="${(yT + i * 26).toFixed(1)}" x2="${(X(0) - 12).toFixed(1)}" y2="${(yT + i * 26 + 12).toFixed(1)}" stroke="${dim}" stroke-width="1.4"/>`;
  s += text(X(0) - 8, yB + 26, 'hard wall', 12, ink, 'end');
  s += text((X(0) + X(1)) / 2, yB + 26, 'film', 12, hot, 'middle', 'bold');
  s += `<line x1="${X(-1)}" y1="${Y(0).toFixed(1)}" x2="${x1}" y2="${Y(0).toFixed(1)}" stroke="rgba(255,255,255,0.3)" stroke-width="1"/>`;
  // non-resonant (k l = 1), normalised psi = sin(t)/(cos 1) on [0,1], then t + c_V; dashed continuation to its zero at -c_V
  const psi1 = t => t <= 1 ? Math.sin(t) / Math.cos(1) : t + v.c;
  let d = ''; for (let t = 0; t <= 1.62; t += 0.02) d += (d ? 'L' : 'M') + X(t).toFixed(1) + ' ' + Y(psi1(t)).toFixed(1);
  s += `<path d="${d}" fill="none" stroke="${cool}" stroke-width="2.8"/>`;
  s += `<path d="M${X(-v.c).toFixed(1)} ${Y(0).toFixed(1)}L${X(1).toFixed(1)} ${Y(psi1(1)).toFixed(1)}" fill="none" stroke="${cool}" stroke-width="1.6" stroke-dasharray="5 4"/>`;
  s += `<circle cx="${X(-v.c).toFixed(1)}" cy="${Y(0).toFixed(1)}" r="4.5" fill="${cool}"/>`;
  s += text(X(-v.c) + 10, Y(0) + 22, 'wall moved out by εc', 12, cool, 'end', 'bold');
  s += text(X(1.62) + 6, Y(psi1(1.62)) + 4, 'tilted: hard wall', 12, cool, 'start', 'bold');
  // resonant (k l = pi/2), bounded solution sin(pi t / 2), flat beyond the film
  const psi2 = t => t <= 1 ? Math.sin(Math.PI * t / 2) : 1;
  d = ''; for (let t = 0; t <= 3; t += 0.02) d += (d ? 'L' : 'M') + X(t).toFixed(1) + ' ' + Y(0.62 * psi2(t)).toFixed(1);
  s += `<path d="${d}" fill="none" stroke="${mint}" stroke-width="2.8"/>`;
  s += text(x1, Y(0.62) - 10, 'flat: Robin wall', 12, mint, 'end', 'bold');
  s += text((x0 + x1) / 2 + 10, yB + 46, 'zero-energy solution across a square-well film', 11, dim, 'middle');
  return s;
}
// ---- right: the four square-well cases ----
function right() {
  const x0 = 560; let s = '';
  s += text(x0, 100, 'Square well of depth k² and width ℓ (film units)', 15, muted, 'start', 'bold');
  const cols = [x0, x0 + 128, x0 + 228, x0 + 340];
  ['well', 'limit wall', 'uniform?', 'how fast'].forEach((h, i) => { s += text(cols[i], 132, h, 12, dim, 'start', 'bold'); });
  s += `<line x1="${x0}" y1="140" x2="${x0 + 560}" y2="140" stroke="rgba(255,255,255,0.3)" stroke-width="1"/>`;
  CASES.forEach((c, i) => {
    const y = 170 + i * 34, col = c.uniform === 'yes' ? mint : rose;
    s += text(cols[0], y, c.label, 15, ink, 'start', 'bold', SERIF);
    s += text(cols[1], y, c.wall, 15, c.wall === 'Robin' ? mint : cool, 'start', 'bold');
    s += text(cols[2], y, c.uniform, 15, col, 'start', 'bold');
    s += text(cols[3], y, c.rate, 14, ink);
  });
  s += text(x0, 318, 'Uniform exactly when the film cannot bind a particle (kℓ ≤ π/2).', 14, hot, 'start', 'bold');
  s += text(x0, 342, 'Robin strength: half the sum of the wall’s principal curvatures.', 12, dim);
  s += text(x0, 360, 'Bounded smooth regions, dimension two or more; unrefereed candidate.', 12, dim);
  return s;
}
const draw = v =>
  text(40, 46, 'A thin film at a hard wall', 25, ink, 'start', 'normal', SERIF) +
  text(40, 74, 'Which wall survives as the film shrinks, and the limit is uniform exactly when the film cannot bind a particle', 15, muted) +
  left(v) + right();
const description = 'Banner for a paper on thin, strong films at a hard wall. Title: A thin film at a hard wall. Subtitle: which wall survives as the film shrinks, and the limit is uniform exactly when the film cannot bind a particle. Left: a hard wall with a shaded film next to it and the zero-energy solution across a square-well film. Beyond the film the solution is a straight line. A tilted line (well with k l = 1) leaves a hard wall; extended backwards it meets zero outside the wall, showing the wall moved out by epsilon times c. A flat line (resonant well, k l = pi/2) gives a Robin wall. Right: a table of four square wells of depth k squared and width l. k l = 1: hard wall, uniform, error of order epsilon. k l = pi/2: Robin wall, uniform, error of order the square root of epsilon. k l = pi: hard wall, not uniform, error stays maximal. k l = 3 pi/2: Robin wall, not uniform, error stays maximal. Uniform exactly when the film cannot bind a particle (k l at most pi/2). Robin strength: half the sum of the principal curvatures of the wall. Bounded smooth regions, dimension two or more; unrefereed candidate.';
function frame(inner, background) {
  return bannerSvg({ inner, description, background, glow: { color: '#9fd3ff', cx: '0.5', cy: '0.55', r: '0.4', opacity: '0.06' } });
}
const thumbSpec = {
  kicker: ['RESEARCH RELEASE · NOVEMBER 2026', 'SPECTRAL THEORY'],
  head: ['A thin film at a hard wall:', '<em>uniform limit iff it cannot bind</em>'], headSize: 44,
  sub: 'Which boundary condition survives as the film shrinks, how fast, and how far the film moves the wall.',
  tag: 'UNREFEREED CANDIDATE',
  hero: '<div class="eq-label">square well, depth k² and width ℓ</div><div class="hero-title">kℓ ≤ π/2: uniform</div><div class="note">kℓ = π/2: Robin wall;<br>kℓ = π, 3π/2: not uniform</div><div class="eq-foot">bounded smooth regions</div>'
};
module.exports = { draw, description, thumbSpec, checkHook };
if (require.main === module) (async () => {
  const fs = require('fs'), pth = require('path'), os = require('os'), vm = require('vm');
  const ROOT = pth.join(__dirname, '..');
  const v = checkHook();
  console.log('check: c_V, the predicted eigenvalue slope and the four square-well cases match the released outputs and Section 2.5');
  const { resolve: bannerResolve } = require('./banner-palettes');
  const bp = bannerResolve(SLUG); if (!bp) throw new Error('no banner palette');
  const tp = require('./thumbnail-palettes');
  const tname = tp.resolve(SLUG, true);
  const svg = frame(draw(v), bp);
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
