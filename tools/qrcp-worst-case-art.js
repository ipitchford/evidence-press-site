'use strict';
const { bannerSvg } = require('./svg-xml');
// How badly can column-pivoted QR choose rows of an orthonormal basis? (column-pivoted-qr-orthonormal-worst-case): banner, OG, thumbnail.
// "This image helps the reader understand" that the greedy point-selection rule column-pivoted QR can lose against the best
// choice only by about e^(C sqrt k), not by the 2^k of the textbook bound: the base-10 logarithm of the two bounds against k
// (the paper's Table 2: Drmac-Gugercin sqrt(4^k + 6k - 1)/3 against sqrt(e) exp(C(H) sqrt k) for H = 1 and H = 2, crossing at
// k = 13 and k = 15), the unit-diagonal triangular core with its two-part pivot profile behind the matching examples
// (Sections 4-5), and the exact constants C(1) = 2 and C(2) = 2.25 (Theorem 2.3).
// checkHook solves rho - log rho = 1 + log H for C(H) = sqrt(rho) + 1/sqrt(rho) and compares it with the released
// results/extensions.json constant table; recomputes the drawn log10 factors and compares them with the released
// drmac_gugercin_comparison table and crossovers (copied below); it refuses to draw on mismatch.
// Reference: txgraffiti-order48-successor (one exact object balanced with immediately readable values).
// Usage: node tools/qrcp-worst-case-art.js [--render OUTDIR_FOR_INSPECTION] [--no-mirror]
const SLUG = 'column-pivoted-qr-orthonormal-worst-case';
const ink = '#f6f2ea', muted = '#e2e7ea', dim = '#c3ccd2', hot = '#ffc36b', cool = '#9fd3ff', rose = '#f2a7b5', mint = '#a8e6c1';
const SANS = 'Arial,Helvetica,sans-serif', SERIF = 'Georgia,serif';
const text = (x, y, s, size = 18, color = ink, anchor = 'start', weight = 'normal', family = SANS, style = 'normal') => {
  if (/<|&(?!(lt|gt|amp|minus|#\d+);)/.test(s.replace(/<\/?tspan[^>]*>/g, ''))) throw new Error('unescaped < or & in SVG text: ' + s);
  return `<text class="og-hide" x="${x}" y="${y}" fill="${color}" font-family="${family}" font-size="${size}" font-weight="${weight}" font-style="${style}" text-anchor="${anchor}">${s}</text>`;
};
// C(H) = sqrt(rho) + 1/sqrt(rho), rho >= 1 solving rho - log rho = 1 + log H (paper, eq. 2.2); bisection
function C(H) {
  const t = 1 + Math.log(H); let lo = 1, hi = 1 + 2 * t + 10;
  if (H === 1) return 2;
  for (let i = 0; i < 200; i++) { const m = (lo + hi) / 2; if (m - Math.log(m) < t) lo = m; else hi = m; }
  const r = (lo + hi) / 2; return Math.sqrt(r) + 1 / Math.sqrt(r);
}
const LOG10E = Math.LOG10E;
// log10 of the factor multiplying sqrt(N-k+1): classical [DG16] and new sqrt(e) exp(C(H) sqrt k)
const dg = k => (k * Math.log(4) + Math.log1p((6 * k - 1) / Math.pow(4, k))) / 2 * LOG10E - Math.log10(3);
const nw = (k, H) => (0.5 + C(H) * Math.sqrt(k)) * LOG10E;
function checkHook() {
  // released results/extensions.json: constant.table (H, C_closed) and drmac_gugercin_comparison (k, DG, H1, H2) + crossovers
  const consts = [[1, 2.0], [2, 2.24760130088019], [1.5, 2.15538822013002], [10, 2.66349973728013]];
  for (const [H, c] of consts) if (Math.abs(C(H) - c) > 1e-9) throw new Error('C(H) mismatch at H = ' + H);
  const table = [[10, '2.533', '2.964', '3.304'], [20, '5.543', '4.102', '4.582'], [50, '14.57', '6.359', '7.119'], [100, '29.63', '8.903', '9.978'], [200, '59.73', '12.5', '14.02']];
  const near = (x, s) => Math.abs(x - parseFloat(s)) <= 0.6 * Math.pow(10, Math.floor(Math.log10(Math.abs(x))) - 3) + 1e-9;
  for (const [k, a, b, c] of table) if (!near(dg(k), a) || !near(nw(k, 1), b) || !near(nw(k, 2), c)) throw new Error('log10 table mismatch at k = ' + k);
  const cross = H => { for (let k = 2; k < 1000; k++) if (nw(k, H) < dg(k)) return k; };
  if (cross(1) !== 13 || cross(2) !== 15 || cross(10) !== 20 || cross(100) !== 25) throw new Error('crossover mismatch');
  return { c1: C(1), c2: C(2), at100: [dg(100), nw(100, 1), nw(100, 2)] };
}
// ---- left: the two bounds against k (Table 2) ----
function left() {
  const x0 = 78, x1 = 400, yTop = 116, yBot = 346, kmax = 120, vmax = 36;
  const X = k => x0 + (x1 - x0) * k / kmax, Y = v => yBot - (yBot - yTop) * v / vmax;
  let s = text(40, 100, 'Worst-case loss, log₁₀ of the factor', 15, muted, 'start', 'bold');
  [0, 10, 20, 30].forEach(v => {
    s += `<line x1="${x0}" y1="${Y(v).toFixed(1)}" x2="${x1}" y2="${Y(v).toFixed(1)}" stroke="rgba(255,255,255,${v ? 0.12 : 0.4})" stroke-width="1"/>`;
    s += text(x0 - 8, Y(v) + 4, v ? '10' + ['', '¹⁰', '²⁰', '³⁰'][v / 10] : '1', 11, dim, 'end');
  });
  const curve = (f, c, w, dash = '') => {
    let d = ''; for (let k = 2; k <= kmax; k++) { const v = f(k); if (v > vmax) break; d += (d ? 'L' : 'M') + X(k).toFixed(1) + ' ' + Y(v).toFixed(1); }
    return `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}"${dash ? ` stroke-dasharray="${dash}"` : ''}/>`;
  };
  s += curve(dg, rose, 2.8);
  s += curve(k => nw(k, 2), hot, 2.4, '6 4');
  s += curve(k => nw(k, 1), cool, 2.8);
  s += text(X(70), Y(dg(70)) - 2, 'old bound ≈ 2ᵏ', 13, rose, 'end', 'bold');
  s += text(x1, Y(nw(120, 2)) - 10, 'new, twice the average: e^(2.25√k)', 12, hot, 'end', 'bold');
  s += text(x1, Y(nw(120, 1)) + 34, 'new, equal energy: e^(2√k)', 12, cool, 'end', 'bold');
  s += `<circle cx="${X(13).toFixed(1)}" cy="${Y(dg(13)).toFixed(1)}" r="4" fill="${ink}"/>`;
  s += text(X(13) - 6, Y(dg(13)) - 16, 'cross at k = 13', 11, ink, 'end');
  s += text(x0, yBot + 18, '0', 11, dim, 'middle'); s += text(X(60), yBot + 18, '60', 11, dim, 'middle'); s += text(x1, yBot + 18, '120', 11, dim, 'middle');
  s += text((x0 + x1) / 2, yBot + 36, 'k, the number of points chosen', 11, dim, 'middle');
  return s;
}
// ---- centre: the triangular core with its two-part pivot profile ----
function centre() {
  const n = 12, cell = 17, gx = 600 - n * cell / 2, gy = 132; let s = '';
  s += text(600, 100, 'Why: a triangular matrix in disguise', 15, muted, 'middle', 'bold');
  // pivot profile: steep first branch, then along the orthonormality floor (two-part profile, schematic)
  const prof = i => i < 5 ? 1 - 0.13 * i : 0.35 - 0.035 * (i - 5);
  for (let i = 0; i < n; i++) for (let j = i; j < n; j++) {
    const a = i === j ? prof(i) : 0.16 + 0.22 * prof(i);
    const c = i === j ? hot : cool;
    s += `<rect x="${gx + j * cell}" y="${gy + i * cell}" width="${cell - 2}" height="${cell - 2}" fill="${c}" opacity="${a.toFixed(2)}"/>`;
  }
  s += text(600, gy + n * cell + 22, 'pivots fall fast, then follow the floor', 12, ink, 'middle');
  s += text(600, gy + n * cell + 40, 'set by orthonormality (Kahan-type core)', 12, dim, 'middle');
  return s;
}
function right(v) {
  const x0 = 800; let s = '';
  s += `<line x1="${x0 - 22}" y1="92" x2="${x0 - 22}" y2="378" stroke="rgba(255,255,255,0.16)" stroke-width="1"/>`;
  s += text(x0, 116, 'Greedy point selection (QRCP)', 15, muted, 'start', 'bold');
  s += text(x0, 146, 'is never worse than the best choice by more than', 13, ink);
  s += text(x0, 174, '√(e(N−k+1)) · e^(C(H)√k)', 20, hot, 'start', 'bold', SERIF);
  s += text(x0, 204, `C = ${v.c1.toFixed(0)} when all points carry equal energy,`, 13, ink);
  s += text(x0, 222, `C ≈ ${v.c2.toFixed(2)} when none carries twice the average`, 13, ink);
  s += text(x0, 252, 'and the constant is exact: examples come', 13, cool, 'start', 'bold');
  s += text(x0, 270, 'arbitrarily close to the bound', 13, cool, 'start', 'bold');
  s += text(x0, 304, 'At k = 100: about 10⁹ instead of about 10³⁰', 13, mint, 'start', 'bold');
  s += text(x0, 334, 'Exact arithmetic, worst cases only;', 12, dim);
  s += text(x0, 352, 'sharp on the logarithmic scale', 12, dim);
  return s;
}
const draw = v =>
  text(40, 46, 'How badly can column-pivoted QR choose rows?', 25, ink, 'start', 'normal', SERIF) +
  text(40, 74, 'Greedy point selection loses at most about e^(C√k) against the best choice, with an exact constant, not 2ᵏ', 15, muted) +
  left() + centre() + right(v);
const description = 'Banner for a paper on the worst case of column-pivoted QR on orthonormal rows. Title: How badly can column-pivoted QR choose rows? Subtitle: Greedy point selection loses at most about e to the C root k against the best choice, with an exact constant, not 2 to the k. Left: the base-10 logarithm of the worst-case loss factor against k, the number of points chosen, from 0 to 120: the old Drmac-Gugercin bound, about 2 to the k, rises steeply; the new bounds e to the 2 root k (all points carry equal energy) and e to the 2.25 root k (no point carries twice the average) rise slowly and cross below the old bound at k = 13 and k = 15. Centre: an upper-triangular matrix whose diagonal (pivots) falls fast and then follows a floor set by orthonormality, the Kahan-type core behind the matching examples. Right: greedy point selection (QRCP) is never worse than the best choice by more than the square root of e times (N minus k plus 1), times e to the C(H) root k; C = 2 when all points carry equal energy, C is about 2.25 when none carries twice the average, and the constant is exact: examples come arbitrarily close to the bound. At k = 100: about 10 to the 9 instead of about 10 to the 30. Exact arithmetic, worst cases only; sharp on the logarithmic scale.';
function frame(inner, background) {
  return bannerSvg({ inner, description, background, glow: { color: '#9fd3ff', cx: '0.5', cy: '0.55', r: '0.4', opacity: '0.06' } });
}
const thumbSpec = {
  kicker: ['RESEARCH RELEASE · NOVEMBER 2026', 'NUMERICAL LINEAR ALGEBRA'],
  head: ['Column-pivoted QR worst case:', '<em>e<sup>C√k</sup>, not 2<sup>k</sup></em>'], headSize: 44,
  sub: 'The greedy rule for picking interpolation points can lose about exp(2√k) against the best choice, with an exact constant, and never more.',
  tag: 'UNREFEREED CANDIDATE',
  hero: '<div class="eq-label">at k = 100 the worst loss is</div><div class="hero-title">about 10⁹, not 10³⁰</div><div class="note">C = 2 at equal energy;<br>examples attain it</div><div class="eq-foot">exact arithmetic, worst cases</div>'
};
module.exports = { draw, description, thumbSpec, checkHook };
if (require.main === module) (async () => {
  const fs = require('fs'), pth = require('path'), os = require('os'), vm = require('vm');
  const ROOT = pth.join(__dirname, '..');
  const v = checkHook();
  console.log('check: C(H), the log10 factors of Table 2 and the crossovers match the released outputs');
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
