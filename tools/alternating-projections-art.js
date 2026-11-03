'use strict';
const { bannerSvg } = require('./svg-xml');
// Exact worst-case convergence of alternating projections with a common interior ball: banner, OG card and thumbnail.
// "This image helps the reader understand" that the slowest possible instance is a thin wedge: two half-planes tangent
// to the common ball, with the iterates zig-zagging towards the corner and their distance to it shrinking by the
// cosine c of the wedge angle at every projection; and what the exact count means in practice (93 cycles against
// 212 and 833 guaranteed by earlier-style bounds at R/delta = 10, accuracy 1e-3).
// Source (paper 0.1.0-candidate, 3 Nov 2026): Section 6, equations (26)-(27) (A = {v <= delta}, B = {su - cv <= delta},
// corner zeta = (w(c), delta), x0 = (sqrt(R^2 - delta^2), delta), y_j - zeta = D c^j (c, s) or D c^j (1, 0)); Figure 1;
// Section 9 cycle-count table (results/extension_checks.json cycle_counts, R/delta = 10, eps = 1e-3).
// The wedge is drawn exactly for delta = 1, R = 3.6, c = 0.6 (an illustrative angle; the worst angle depends on N).
// Usage: node tools/alternating-projections-art.js [--render OUTDIR_FOR_INSPECTION] [--no-mirror] [--banner-only]
const SLUG = 'alternating-projections-exact-worst-case';
const ink = '#f4f1ea', muted = '#e3d9c9', dim = '#c4b7a2';
const ballC = '#9be3c0', aC = '#9fd2ff', bC = '#ffd56b', iterC = '#ffb38a', interC = '#d9c7ff';
const SANS = 'Arial,Helvetica,sans-serif', SERIF = 'Georgia,serif';
const text = (x, y, s, size = 18, color = ink, anchor = 'start', weight = 'normal', family = SANS) =>
  `<text class="og-hide" x="${x}" y="${y}" fill="${color}" font-family="${family}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}">${s}</text>`;
const f = v => (+v).toFixed(1);
// Exact construction, equations (26)-(27).
const DELTA = 1, R = 3.6, C = 0.6, S = Math.sqrt(1 - C * C);
const W = DELTA * (1 + C) / S;                      // corner abscissa: s w - c delta = delta
const ZETA = [W, DELTA];
const X0 = [Math.sqrt(R * R - DELTA * DELTA), DELTA];
const D = X0[0] - W;                                 // D(R, c) = sqrt(R^2 - delta^2) - w(c)
const ITER = Array.from({ length: 9 }, (_, j) => j % 2
  ? [ZETA[0] + D * C ** j * C, ZETA[1] + D * C ** j * S]
  : [ZETA[0] + D * C ** j, ZETA[1]]);
const COUNTS = [['Exact worst case (Theorem 1)', 93, iterC], ['Elementary bound with the sharp factor', 212, bC], ['Classical interior-point bound', 833, aC]];
// Chart frame: u in [-1.25, 4.05], v in [-1.2, 3.0].
const K = 66, UX = 52, VY = 382, UMIN = -1.25, UMAX = 4.05, VMIN = -1.2, VMAX = 3.0;
const X = u => UX + (u - UMIN) * K, Y = v => VY - (v - VMIN) * K;
function chart() {
  let s = '';
  const vBot = [ZETA[0] - C * (ZETA[1] - VMIN) / S, VMIN];       // B's boundary line meets v = VMIN
  const vTop = [ZETA[0] + C * (VMAX - ZETA[1]) / S, VMAX];       // and v = VMAX
  s += `<path d="M${f(X(UMIN))} ${f(Y(1))} L${f(X(ZETA[0]))} ${f(Y(ZETA[1]))} L${f(X(vBot[0]))} ${f(Y(VMIN))} L${f(X(UMIN))} ${f(Y(VMIN))} Z" fill="${interC}" fill-opacity=".13"/>`;
  s += `<circle cx="${f(X(0))}" cy="${f(Y(0))}" r="${f(DELTA * K)}" fill="${ballC}" fill-opacity=".2" stroke="${ballC}" stroke-width="2"/>`;
  s += `<path d="M${f(X(UMIN))} ${f(Y(1))} H${f(X(UMAX))}" stroke="${aC}" stroke-width="2.4"/>`;
  s += `<path d="M${f(X(vBot[0]))} ${f(Y(VMIN))} L${f(X(vTop[0]))} ${f(Y(VMAX))}" stroke="${bC}" stroke-width="2.4"/>`;
  s += `<circle cx="${f(X(0))}" cy="${f(Y(0))}" r="3" fill="${ink}"/>`;
  const uB = v => ZETA[0] + C * (v - ZETA[1]) / S;                 // abscissa of B's edge at height v
  s += text(X(0), Y(-0.42), 'common ball', 13, ballC, 'middle', 'bold') + text(X(0), Y(-0.42) + 16, 'radius δ', 13, ballC, 'middle');
  s += text(X(-1.2), Y(-1.05), 'A ∩ B', 13, interC, 'start', 'bold');
  s += text(X(-1.2), Y(1) - 9, 'A: everything below this line', 13, aC, 'start', 'bold');
  s += text(X(uB(2.78)) - 14, Y(2.78), 'B: everything left of this line', 13, bC, 'end', 'bold');
  s += `<path d="M${ITER.map(p => `${f(X(p[0]))} ${f(Y(p[1]))}`).join(' L')}" stroke="${iterC}" stroke-width="1.8" fill="none" stroke-linejoin="round"/>`;
  ITER.forEach((p, j) => { s += `<circle cx="${f(X(p[0]))}" cy="${f(Y(p[1]))}" r="${j ? 3.6 : 5.5}" fill="${iterC}" stroke="#1b1b1b" stroke-width="1"/>`; });
  s += text(X(X0[0]) - 12, Y(X0[1]) - 30, 'start, at distance', 13, iterC, 'start', 'bold') + text(X(X0[0]) - 12, Y(X0[1]) - 14, 'R from the centre', 13, iterC, 'start', 'bold');
  s += `<circle cx="${f(X(ZETA[0]))}" cy="${f(Y(ZETA[1]))}" r="5" fill="none" stroke="${ink}" stroke-width="1.6"/>`;
  s += text(X(ZETA[0]) + 6, Y(ZETA[1]) + 20, '↖ corner:', 13, ink, 'start', 'bold') + text(X(ZETA[0]) + 6, Y(ZETA[1]) + 36, 'nearest solution', 13, ink, 'start', 'bold');
  s += text(X(uB(2.5)) + 12, Y(2.5), 'each projection', 13, iterC, 'start') + text(X(uB(2.5)) + 12, Y(2.5) + 16, 'shrinks the distance', 13, iterC, 'start') + text(X(uB(2.5)) + 12, Y(2.5) + 32, 'to the corner by c', 13, iterC, 'start');
  return s;
}
function panel() {
  const x = 520; let s = text(x, 136, 'The worst case is exactly this wedge.', 20, ink, 'start', 'normal', SERIF);
  s += text(x, 158, 'Cycles needed to get within 10⁻³ R of a solution when R/δ = 10:', 14, muted);
  const scale = 560 / 833;
  COUNTS.forEach(([label, n, col], k) => {
    const y = 192 + k * 52;
    s += text(x, y, label, 13, dim);
    s += `<rect x="${x}" y="${y + 7}" width="${f(n * scale)}" height="20" rx="4" fill="${col}" fill-opacity="${k ? 0.5 : 0.9}"/>`;
    s += text(x + n * scale + 10, y + 23, String(n), 17, col, 'start', 'bold');
  });
  s += text(x, 352, 'Luner and Grimmer (2024) found this wedge and conjectured nothing is slower.', 13, muted, 'start', 'normal', SERIF);
  s += text(x, 372, 'Now proved in every dimension, with exact answers for unequal balls and residuals.', 13, muted, 'start', 'normal', SERIF);
  return s;
}
const draw = () =>
  text(40, 52, 'How slow can alternating projections be?', 27, ink, 'start', 'normal', SERIF) +
  text(40, 80, 'Two convex sets share a ball of radius δ; jump to the nearest point of one set, then of the other, and repeat.', 15, muted) +
  chart() + `<path d="M495 112 L 495 380" stroke="${muted}" stroke-opacity=".22" stroke-width="1.2"/>` + panel();
const description = 'Banner for a paper on the worst-case speed of alternating projections. On the left, an exact drawing of the slowest configuration: a green disc (the common ball of radius delta) centred at a point, a horizontal blue line (the edge of set A, which lies below it) and a tilted yellow line (the edge of set B, which lies to its left), both touching the disc; their overlap, shaded violet, is the set of solutions, and the two lines meet at a corner, the nearest solution. The starting point lies on the blue line at distance R from the centre. Orange dots zig-zag between the two lines towards the corner; each projection shrinks the distance to the corner by the factor c, the cosine of the wedge angle. On the right, headed "The worst case is exactly this wedge", bars compare the cycles needed to get within one thousandth of R of a solution when R over delta is 10: 93 for the exact worst case (Theorem 1), 212 for an elementary bound with the sharp factor, and 833 for the classical interior-point bound. Text: Luner and Grimmer (2024) found this wedge and conjectured nothing is slower; now proved in every dimension, with exact answers for unequal balls and residuals.';
function frame(inner, background) {
  return bannerSvg({ inner, description, background, glow: { color: ballC, cx: '0.18', cy: '0.65', r: '0.4', opacity: '0.07' } });
}
const thumbSpec = {
  kicker: ['RESEARCH RELEASE · NOVEMBER 2026', 'CONVEX OPTIMISATION · ALTERNATING PROJECTIONS'],
  head: ['The worst case', '<em>is a wedge</em>'], headSize: 70,
  sub: 'A proof of the Luner–Grimmer conjecture: the exact worst-case error of alternating projections when two convex sets share a ball, in every dimension.',
  tag: 'UNREFEREED CANDIDATE',
  hero: '<div class="eq-label">R/δ = 10 · accuracy 10⁻³</div><div class="hero-title">93 vs 833</div><div class="note">cycles needed: exact worst case<br>vs the classical guarantee</div><div class="eq-foot">written proofs · 88,902 explicit checks</div>'
};
module.exports = { draw, description, thumbSpec, ITER, ZETA };
if (require.main === module) (async () => {
  const fs = require('fs'), pth = require('path'), os = require('os'), vm = require('vm');
  const ROOT = pth.join(__dirname, '..');
  // Guards: both lines tangent to the ball; corner on both lines; x0 at distance R in A; odd iterates on B's edge,
  // even iterates on A's edge; distance to the corner shrinks by c per projection; c below kappa; counts as in the paper.
  const near = (a, b, e = 1e-12) => Math.abs(a - b) < e;
  if (!near(DELTA / Math.hypot(S, C), DELTA)) throw new Error('B line not tangent');
  if (!near(S * ZETA[0] - C * ZETA[1], DELTA)) throw new Error('corner not on B');
  if (!near(Math.hypot(...X0), R) || X0[1] > DELTA + 1e-12) throw new Error('x0 mismatch');
  ITER.forEach((p, j) => {
    if (j % 2 ? !near(S * p[0] - C * p[1], DELTA) || p[1] < DELTA : !near(p[1], DELTA) || S * p[0] - C * p[1] < DELTA) throw new Error('iterate off its edge: ' + j);
    if (!near(Math.hypot(p[0] - ZETA[0], p[1] - ZETA[1]), D * C ** j)) throw new Error('contraction mismatch: ' + j);
    if (j) { // projection check: y_j is the nearest point of the set edge to y_{j-1}
      const q = ITER[j - 1], dir = j % 2 ? [C, S] : [1, 0], v = [p[0] - q[0], p[1] - q[1]];
      if (!near(v[0] * dir[0] + v[1] * dir[1], 0, 1e-12)) throw new Error('not an orthogonal projection: ' + j);
    }
  });
  if (!(C < 1 - 2 * DELTA * DELTA / (R * R))) throw new Error('c above kappa');
  const ext = JSON.parse(fs.readFileSync(process.env.ALTPROJ_EXTENSION_JSON || '/dev/null', 'utf8') || 'null');
  if (ext) { const row = ext.cycle_counts.find(r => r.R_over_delta === 10 && r.eps === '1e-3');
    if (row.exact_N !== 93 || row.corollary_A3_N !== 212 || row.classical_N !== 833) throw new Error('cycle counts mismatch'); }
  const bp = require('./banner-palettes'); const { palettes } = bp;
  const b0 = bp.resolve(SLUG); if (!b0) throw new Error('no banner palette'); const bname = b0.name;
  const tp = require('./thumbnail-palettes');
  const tname = tp.resolve(SLUG, true);
  const svg = frame(draw(), { name: bname, colors: palettes[bname] });
  fs.writeFileSync(pth.join(ROOT, 'assets/art', SLUG + '.svg'), svg);
  console.log('art:', SLUG, 'banner palette', bname, '| thumbnail palette', tname, '| cycle counts checked against results:', !!ext);
  const ri = process.argv.indexOf('--render');
  if (ri < 0) return;
  const inspect = process.argv[ri + 1];
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
  if (process.argv.includes('--banner-only')) { await br.close(); return; }
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
