'use strict';
// Banner for higher-permanental-compounds-fixed-rank (DOI 10.5281/zenodo.24551928).
// Sources (manuscript, 23 pages): Theorem 1.1(i) fixed-k orders (log n)^k and (log n)^(k-1);
// Theorem 1.1(iii) and Figure 1, the exponential base against p = k/n: exp(inf_t {F(t) - p log t} - H(p)) with
// F(t) = t log(1/t)/(1 - t) for complex rank >= 2 and real rank >= 4 (e/2 at p = 1/2), and the real rank-three
// base, flat at e^2/6 for 1/3 <= p <= 2/3 (tabulated in results/plot_profile.txt); Corollary 1.2, order 152.
const ink = '#f6f2ea', muted = '#d9d2c4', dim = '#bdb5a6';
const colors = ['#f6c177', '#8fd3c8'];
const SANS = 'Arial,Helvetica,sans-serif';
const f = v => (+v).toFixed(1);
const text = (x, y, s, size = 18, color = ink, anchor = 'start', weight = 'normal') =>
  `<text class="og-hide" x="${x}" y="${y}" fill="${color}" font-family="${SANS}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}">${s}</text>`;

const F = t => t * Math.log(1 / t) / (1 - t);
const H = p => -p * Math.log(p) - (1 - p) * Math.log(1 - p);
function baseC(p) {
  if (p <= 0 || p >= 1) return 1;
  let lo = 1e-9, hi = 1e9; // minimise over log t by golden section
  const g = u => F(Math.exp(u)) - p * u;
  let a = Math.log(lo), b = Math.log(hi);
  for (let i = 0; i < 200; i++) { const m1 = a + (b - a) * 0.382, m2 = a + (b - a) * 0.618; if (g(m1) < g(m2)) b = m2; else a = m1; }
  return Math.exp(g((a + b) / 2) - H(p));
}
// Real rank three, results/plot_profile.txt (p, base), symmetric about p = 1/2, flat on [1/3, 2/3].
const E26 = Math.E * Math.E / 6;
const R3 = [[0, 1], [0.05, 1.073439597], [0.1, 1.126600674], [0.2, 1.198018626], [1 / 3, E26]];
// Monotone cubic (Fritsch–Carlson) through the tabulated points; exact at every tabulated p.
const MS = (() => {
  const n = R3.length, d = [], m = [];
  for (let i = 0; i < n - 1; i++) d.push((R3[i + 1][1] - R3[i][1]) / (R3[i + 1][0] - R3[i][0]));
  m.push(d[0]); for (let i = 1; i < n - 1; i++) m.push(d[i - 1] * d[i] <= 0 ? 0 : 2 / (1 / d[i - 1] + 1 / d[i])); m.push(0);
  return m;
})();
const baseR3 = p => {
  const q = Math.min(p, 1 - p);
  if (q >= 1 / 3) return E26;
  for (let i = 1; i < R3.length; i++) if (q <= R3[i][0]) {
    const [x0, y0] = R3[i - 1], [x1, y1] = R3[i], h = x1 - x0, t = (q - x0) / h;
    return (2 * t ** 3 - 3 * t * t + 1) * y0 + (t ** 3 - 2 * t * t + t) * h * MS[i - 1] + (-2 * t ** 3 + 3 * t * t) * y1 + (t ** 3 - t * t) * h * MS[i];
  }
  return E26;
};
{
  if (Math.abs(baseC(0.5) - Math.E / 2) > 1e-9) throw new Error('base at p = 1/2 is e/2');
  if (Math.abs(baseC(0.2) - 1.236763564) > 1e-6) throw new Error('table p = 0.2');
  if (Math.abs(E26 - 1.231509350) > 1e-9) throw new Error('e^2/6');
}

function profile(a, b) {
  const X0 = 96, X1 = 640, Y0 = 322, Y1 = 118, VMIN = 0.97, VMAX = 1.4;
  const x = p => X0 + p * (X1 - X0), y = v => Y0 - (v - VMIN) / (VMAX - VMIN) * (Y0 - Y1);
  let s = text(48, 44, 'When k is a fixed share of n', 23, ink, 'start', 'bold');
  s += text(48, 69, 'the worst ratio grows like baseⁿ, exact for every rank (Theorem 1.1(iii))', 14.5, dim);
  s += `<rect x="${f(x(1 / 3))}" y="${Y1 - 4}" width="${f(x(2 / 3) - x(1 / 3))}" height="${Y0 - Y1 + 4}" fill="${b}" fill-opacity=".08"/>`;
  s += `<path d="M${X0} ${f(y(1))} H${X1}" stroke="${muted}" stroke-width="1.2" opacity=".5"/>`;
  s += text(f(x(0.5)), f(y(1) - 8), '1 = no violation', 13.5, dim, 'middle');
  s += `<path d="M${X0} ${Y0} H${X1} M${X0} ${Y0} V${Y1 - 6}" stroke="${muted}" stroke-width="1.2" fill="none"/>`;
  for (const [p, l] of [[0, '0'], [1 / 3, '⅓'], [0.5, '½'], [2 / 3, '⅔'], [1, '1']]) s += `<path d="M${f(x(p))} ${Y0} v5" stroke="${muted}"/>` + text(f(x(p)), Y0 + 21, l, 14, dim, 'middle');
  s += text(X1, Y0 + 42, 'share p = k/n of indices in the first group →', 13.5, dim, 'end');
  const curve = (g, c, dash) => {
    let d = '';
    for (let i = 0; i <= 200; i++) { const p = i / 200; d += `${i ? 'L' : 'M'}${f(x(p))} ${f(y(g(p)))} `; }
    return `<path d="${d}" stroke="${c}" stroke-width="3" fill="none"${dash ? ' stroke-dasharray="9 6"' : ''}/>`;
  };
  s += curve(baseR3, b, true) + curve(baseC, a, false);
  s += `<circle cx="${f(x(0.5))}" cy="${f(y(Math.E / 2))}" r="6" fill="${a}" stroke="#14181c" stroke-width="1.5"/>`;
  s += text(f(x(0.5)), f(y(Math.E / 2) - 14), 'e/2 ≈ 1.359', 16, a, 'middle', 'bold');
  s += text(f(x(0.5)), f(y(E26) + 26), 'flat plateau e²/6 ≈ 1.2315', 15.5, b, 'middle', 'bold');
  s += text(f(x(0.02)), f(y(1.36)), 'complex rank ≥ 2, real rank ≥ 4', 14.5, a, 'start', 'bold');
  s += text(f(x(0.02)), f(y(1.36) + 20), 'real rank 3 (dashed)', 14.5, b, 'start', 'bold');
  return s;
}

function fixedK(a, b) {
  const L = 700;
  let s = text(L, 44, 'Fixed k: answering the open problem', 23, ink, 'start', 'bold');
  s += text(L, 69, 'worst ratio to the permanent, up to constants (Theorem 1.1(i))', 14.5, dim);
  const rows = [[2, 'k = 2'], [3, 'k = 3'], [4, 'k = 4']];
  const BX = 790, U = 34;
  s += text(BX, 104, 'largest eigenvalue', 14, a, 'start', 'bold') + text(BX + 190, 104, '0/1 tests', 14, b, 'start', 'bold');
  rows.forEach(([k, lab], i) => {
    const yy = 140 + i * 58;
    s += text(L, yy + 6, lab, 16, ink, 'start', 'bold');
    for (let j = 0; j < k; j++) s += `<rect x="${BX + j * U}" y="${yy - 12}" width="${U - 6}" height="20" rx="3" fill="${a}" fill-opacity=".85"/>`;
    for (let j = 0; j < k - 1; j++) s += `<rect x="${BX + 190 + j * U}" y="${yy - 12}" width="${U - 6}" height="20" rx="3" fill="${b}" fill-opacity=".85"/>`;
    s += text(BX, yy + 30, `(log n)${['', '', '²', '³', '⁴'][k]}`, 14, a) + text(BX + 190, yy + 30, `(log n)${['', '', '', '²', '³'][k]}`, 14, b);
  });
  s += text(L, 352, 'each block = one factor of log n', 13.5, dim);
  return s;
}

const draw = (a = colors[0], b = colors[1]) => profile(a, b) + fixedK(a, b) +
  `<path d="M668 30 V352" stroke="${muted}" stroke-opacity=".25"/>` +
  text(600, 388, 'Smallest violating dimensions: real 3, complex 2 · exact 0/1 witness with 152 vectors · rates are asymptotic in n', 13.5, muted, 'middle');

const description = 'Banner for a paper on how far permanental compounds can exceed the permanent at fixed rank. Left: the exact exponential base of the worst ratio plotted against the share p = k/n of indices in the first group, from Theorem 1.1(iii) and Figure 1 of the paper. A solid curve for complex vectors of rank at least two and real vectors of rank at least four rises from 1 to a peak e/2 ≈ 1.359 at p = ½; a dashed curve for real rank three stays lower and is flat at e²/6 ≈ 1.2315 across the shaded interval from ⅓ to ⅔. A faint line at 1 means no violation. Right: at each fixed k the largest eigenvalue can exceed the permanent by order (log n)^k and the best 0/1 test by order (log n)^(k−1), drawn as rows of blocks for k = 2, 3 and 4, each block one factor of log n. Footer: the smallest violating dimensions are real 3 and complex 2, an exact 0/1 witness has 152 vectors, and the rates are asymptotic in n.';

const thumbnailHero = () => {
  const X0 = 30, X1 = 400, Y0 = 170, Y1 = 14, y = v => Y0 - (v - 0.97) / 0.43 * (Y0 - Y1), x = p => X0 + p * (X1 - X0);
  let d = '', e = '';
  for (let i = 0; i <= 100; i++) { const p = i / 100; d += `${i ? 'L' : 'M'}${f(x(p))} ${f(y(baseC(p)))} `; e += `${i ? 'L' : 'M'}${f(x(p))} ${f(y(baseR3(p)))} `; }
  return `<div class="eq-label">EXPONENTIAL BASE AGAINST k/n</div>
  <svg viewBox="0 0 430 190" style="width:100%;height:190px" aria-label="Exponential base against k over n, peaking at e/2, with a flat real rank-three plateau">
    <path d="${e}" fill="none" stroke="currentColor" stroke-width="3" stroke-dasharray="9 6" opacity=".7"/>
    <path d="${d}" fill="none" stroke="currentColor" stroke-width="5"/>
    <path d="M${X0} ${Y0}H${X1}M${X0} ${Y0}V${Y1}" stroke="currentColor" stroke-width="2" opacity=".6"/>
  </svg>
  <div class="eq">up to <span class="hl" style="white-space:nowrap">(log&nbsp;n)ᵏ</span></div>
  <div class="note">k-th compound over the permanent, at fixed rank</div>
  <div class="eq-foot">real rank three: flat plateau e²/6</div>`;
};

module.exports = { draw, colors, description, thumbnailHero };
