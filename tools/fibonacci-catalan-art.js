'use strict';
// Banner for rational-fibonacci-catalan-positivity (DOI 10.5281/zenodo.24541015).
// Source (manuscript; page summary): C_{m,n} = P_{m,n}/[F_{m+n}]_q with P_{m,n} = prod_{j<=n} [F_{m+j}]_q/[F_j]_q.
// Worked example C_{4,3} = [5]_q[8]_q/[2]_q = 1+q+2q²+2q³+3q⁴+2q⁵+3q⁶+2q⁷+2q⁸+q⁹+q¹⁰ (page body), and
// Theorem 3.1: C_{m,n} has nonnegative coefficients iff gcd(m,n) <= 2. Every coefficient drawn below is computed
// here by exact integer convolution and division by 1+q, and checked against the published list.
const ink = '#f6f2ea', muted = '#d9d2c4', dim = '#bdb5a6';
const colors = ['#f6c177', '#8fd3c8'];
const SANS = 'Arial,Helvetica,sans-serif', SERIF = 'Georgia,serif';
const f = v => (+v).toFixed(1);
const text = (x, y, s, size = 18, color = ink, anchor = 'start', weight = 'normal', family = SANS) =>
  `<text class="og-hide" x="${x}" y="${y}" fill="${color}" font-family="${family}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}">${s}</text>`;

const ones = u => Array(u).fill(1);
const mul = (p, q) => { const r = Array(p.length + q.length - 1).fill(0); p.forEach((a, i) => q.forEach((b, j) => { r[i + j] += a * b; })); return r; };
const divOnePlusQ = p => { const r = []; let carry = 0; for (let i = 0; i < p.length - 1; i++) { const c = p[i] - carry; r.push(c); carry = c; } if (p[p.length - 1] !== carry) throw new Error('not divisible by 1+q'); return r; };
const PROD = mul(ones(5), ones(8));
const C43 = divOnePlusQ(PROD);
{
  if (C43.join() !== '1,1,2,2,3,2,3,2,2,1,1') throw new Error('C_{4,3} coefficients differ from the release');
  if (PROD.join() !== '1,2,3,4,5,5,5,5,4,3,2,1') throw new Error('[5][8]');
}

const draw = (a = colors[0], b = colors[1]) => {
  let s = text(48, 50, 'Built from Fibonacci numbers, never negative', 26, ink, 'start', 'bold');
  s += text(48, 76, 'a rational Fibonacci–Catalan polynomial, coefficient by coefficient: the case m = 4, n = 3', 15, dim);
  // Stage 1: the 5 × 8 grid of monomials q^(i+j) in [5]_q[8]_q
  const gx = 70, gy = 128, d = 26;
  for (let i = 0; i < 5; i++) for (let j = 0; j < 8; j++) {
    const k = i + j;
    s += `<circle cx="${gx + j * d}" cy="${gy + i * d}" r="7.2" fill="${k % 2 ? b : a}" opacity="${k % 2 ? 0.8 : 0.95}"/>`;
  }
  s += text(gx + 3.5 * d, gy + 5 * d + 14, '[5]<tspan font-size="12" dy="4">q</tspan><tspan dy="-4"> × [8]</tspan><tspan font-size="12" dy="4">q</tspan>', 18, ink, 'middle', 'bold', SERIF);
  s += text(gx + 3.5 * d, gy + 5 * d + 36, '5 and 8 are Fibonacci numbers', 13, dim, 'middle');
  s += text(gx - 18, gy + 2 * d + 5, '5', 15, dim, 'end');
  s += text(gx + 3.5 * d, gy - 18, '8', 15, dim, 'middle');
  s += text(gx + 3.5 * d, 330, 'each diagonal: one power of q', 13, dim, 'middle');
  // Stage 2: arrow and division
  const ax = 300;
  s += `<path d="M${ax} 196H${ax + 92}" stroke="${muted}" stroke-width="2"/><path d="M${ax + 92} 190l10 6-10 6z" fill="${muted}"/>`;
  s += text(ax + 50, 184, '÷ [2]<tspan font-size="12" dy="4">q</tspan>', 20, ink, 'middle', 'bold', SERIF);
  s += text(ax + 50, 222, '= ÷ (1 + q)', 13, dim, 'middle');
  // Stage 3: coefficient blocks
  const bx = 440, base = 300, w = 34, u = 34;
  s += `<path d="M${bx - 10} ${base}H${bx + C43.length * (w + 8) + 2}" stroke="${ink}" stroke-width="2"/>`;
  s += text(bx - 16, base + 5, '0', 14, dim, 'end');
  C43.forEach((c, k) => {
    const x = bx + k * (w + 8);
    for (let t = 0; t < c; t++) s += `<rect x="${x}" y="${base - (t + 1) * u + 3}" width="${w}" height="${u - 6}" rx="4" fill="${k % 2 ? b : a}" opacity="${0.92 - t * 0.12}"/>`;
    s += text(x + w / 2, base - c * u - 6, String(c), 17, ink, 'middle', 'bold');
    s += text(x + w / 2, base + 22, k === 0 ? '1' : k === 1 ? 'q' : `q<tspan font-size="10" dy="-6">${k}</tspan>`, 14, dim, 'middle', 'normal', SERIF);
  });
  const rx = bx + C43.length * (w + 8) + 24;
  s += text(rx, 170, 'C<tspan font-size="13" dy="5">4,3</tspan><tspan dy="-5">(q)</tspan>', 22, ink, 'start', 'bold', SERIF);
  s += text(rx, 198, 'every coefficient', 14, dim);
  s += text(rx, 216, 'is ≥ 0', 14, dim);
  s += text(rx, 262, 'theorem: true for', 14, ink, 'start', 'bold');
  s += text(rx, 282, 'every m, n with', 14, ink, 'start', 'bold');
  s += text(rx, 302, 'gcd(m, n) ≤ 2', 16, a, 'start', 'bold');
  s += text(1160, 388, 'Coefficients computed exactly · they count dimensions of a graded algebra, not yet a combinatorial model', 13.5, muted, 'end');
  return s;
};

const description = 'Banner for a paper proving that rational Fibonacci–Catalan polynomials have nonnegative coefficients. Left: a 5 by 8 grid of dots, the monomials of the product of the q-integers [5]_q and [8]_q, where 5 and 8 are Fibonacci numbers; dots on the same diagonal share a power of q, shaded alternately. An arrow labelled divide by [2]_q, that is by 1 + q, leads to the right: the eleven coefficients of C_{4,3}(q), drawn as stacks of blocks above a zero line with heights 1, 1, 2, 2, 3, 2, 3, 2, 2, 1, 1 for the powers 1 to q^10, all nonnegative, computed exactly. A note states the theorem: the same holds for every m and n with gcd(m, n) at most 2. Footer: the coefficients count dimensions of a graded algebra, not yet a combinatorial model.';

const thumbnailHero = () => {
  const w = 30, gap = 8, base = 190, u = 50;
  const bars = C43.map((c, k) => `<rect x="${10 + k * (w + gap)}" y="${base - c * u}" width="${w}" height="${c * u - 4}" rx="4" fill="currentColor" opacity="${k % 2 ? 0.6 : 0.95}"/>`).join('');
  return `<div class="eq-label">C<sub>4,3</sub>(q) = [5]<sub>q</sub>[8]<sub>q</sub> / [2]<sub>q</sub></div>
  <svg viewBox="0 0 430 200" style="width:100%;height:200px" aria-label="Eleven coefficient bars of heights 1,1,2,2,3,2,3,2,2,1,1, none negative">
    <path d="M4 192H426" stroke="currentColor" stroke-width="2" opacity=".6"/>${bars}
  </svg>
  <div class="eq"><span class="hl">1 1 2 2 3 2 3 2 2 1 1</span></div>
  <div class="note">no coefficient below zero, whenever gcd(m, n) ≤ 2</div>
  <div class="eq-foot">Fibonacci numbers 5, 8 and 2 · exact</div>`;
};

module.exports = { draw, colors, description, thumbnailHero };
