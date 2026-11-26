'use strict';
// Banner for rademacher-stop-loss-concave-comparison (DOI 10.5281/zenodo.24548728).
// Source (manuscript; page summary): for a Rademacher sum S = Σ a_i ε_i with Σ a_i² = 1 and every threshold t in
// [1/√2, 1.005], E(|S| − t)₊ <= (√2 − t)/2, with equality only for two equal weights; at t = 1 the bound is
// (√2 − 1)/2 ≈ 0.207 (Lowther's question). Comparison values at t = 1: three equal coins 0.183, Gaussian 0.167.
// All curves below are exact: two coins (√2 − t)₊/2; three coins (√3 − t)₊/4 + 3(1/√3 − t)₊/4;
// Gaussian 2[φ(t) − t(1 − Φ(t))].
const ink = '#f6f2ea', muted = '#d9d2c4', dim = '#bdb5a6';
const colors = ['#f6c177', '#8fd3c8'];
const SANS = 'Arial,Helvetica,sans-serif';
const f = v => (+v).toFixed(1);
const text = (x, y, s, size = 18, color = ink, anchor = 'start', weight = 'normal') =>
  `<text class="og-hide" x="${x}" y="${y}" fill="${color}" font-family="${SANS}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}">${s}</text>`;

const pos = v => Math.max(0, v);
const erf = x => { let s = 0, term = x, n = 0; while (Math.abs(term) > 1e-17 && n < 200) { s += term / (2 * n + 1); n++; term *= -x * x / n; } return 2 / Math.sqrt(Math.PI) * s; };
const Phi = x => 0.5 * (1 + erf(x / Math.SQRT2)), phi = x => Math.exp(-x * x / 2) / Math.sqrt(2 * Math.PI);
const two = t => pos(Math.SQRT2 - t) / 2;
const three = t => pos(Math.sqrt(3) - t) / 4 + 3 * pos(1 / Math.sqrt(3) - t) / 4;
const gauss = t => 2 * (phi(t) - t * (1 - Phi(t)));
{
  if (Math.abs(two(1) - (Math.SQRT2 - 1) / 2) > 1e-15 || Math.abs(two(1) - 0.2071) > 1e-4) throw new Error('two coins 0.207');
  if (Math.abs(three(1) - 0.1830) > 1e-4) throw new Error('three coins 0.183');
  if (Math.abs(gauss(1) - 0.1667) > 1e-4) throw new Error('Gaussian 0.167');
  for (let t = 1 / Math.SQRT2; t <= 1.005; t += 0.001) if (three(t) > two(t) || gauss(t) > two(t)) throw new Error('bound violated in drawing');
}

function coins(a, b) {
  let s = '';
  const w = 1 / Math.SQRT2;
  for (const [cx, lab] of [[110, 'heads'], [200, 'tails']]) {
    s += `<circle cx="${cx}" cy="150" r="30" fill="${a}"/>` + text(cx, 147, '1/√2', 15, '#14181c', 'middle', 'bold') + text(cx, 165, '± each', 11, '#14181c', 'middle');
  }
  // distribution of |S|: 0 w.p. 1/2, √2 w.p. 1/2, on a line 0 … 1.6
  const X0 = 70, X1 = 280, x = v => X0 + v / 1.6 * (X1 - X0), base = 300;
  s += `<path d="M${X0} ${base}H${X1}" stroke="${muted}" stroke-width="1.4"/>`;
  for (const [v, l] of [[0, '0'], [1, '1'], [Math.SQRT2, '√2']]) s += `<path d="M${f(x(v))} ${base}v7" stroke="${muted}"/>` + text(f(x(v)), base + 24, l, 14, dim, 'middle');
  s += `<rect x="${f(x(0) - 9)}" y="${base - 50}" width="18" height="50" rx="3" fill="${b}" opacity=".8"/>`;
  s += `<rect x="${f(x(w * 2) - 9)}" y="${base - 50}" width="18" height="50" rx="3" fill="${a}"/>`;
  s += `<path d="M${f(x(1))} ${base - 62}H${f(x(Math.SQRT2))}" stroke="${ink}" stroke-width="2.4"/><path d="M${f(x(1))} ${base - 68}v12M${f(x(Math.SQRT2))} ${base - 68}v12" stroke="${ink}" stroke-width="2"/>`;
  s += text(f((x(1) + x(Math.SQRT2)) / 2), base - 74, 'overshoot √2 − 1', 13.5, ink, 'middle', 'bold');
  s += text(f(x(0)), base - 58, '½', 14, b, 'middle', 'bold') + text(f(x(Math.SQRT2) + 18), base - 36, '½', 14, a, 'start', 'bold');
  s += text(175, 204, 'two equal coins: |S| is 0 or √2', 14, dim, 'middle');
  s += text(175, 348, 'average overshoot (√2 − 1)/2', 14.5, a, 'middle', 'bold');
  return s;
}

function plot(a, b) {
  const X0 = 420, X1 = 860, Y0 = 336, Yt = 120, t0 = 0.5, t1 = 1.5, vmax = 0.46;
  const x = t => X0 + (t - t0) / (t1 - t0) * (X1 - X0), y = v => Y0 - v / vmax * (Y0 - Yt);
  let s = `<rect x="${f(x(1 / Math.SQRT2))}" y="${Yt - 8}" width="${f(x(1.005) - x(1 / Math.SQRT2))}" height="${Y0 - Yt + 8}" fill="${a}" opacity=".08"/>`;
  s += `<path d="M${X0} ${Yt - 8}V${Y0}H${X1}" stroke="${muted}" stroke-width="1.2" fill="none" opacity=".6"/>`;
  const curve = (g, col, w, dash) => { let d = ''; for (let i = 0; i <= 300; i++) { const t = t0 + (t1 - t0) * i / 300; d += `${i ? 'L' : 'M'}${f(x(t))} ${f(y(g(t)))} `; } return `<path d="${d}" stroke="${col}" stroke-width="${w}" fill="none"${dash ? ` stroke-dasharray="${dash}"` : ''}/>`; };
  s += curve(gauss, muted, 2.2, '7 5') + curve(three, b, 2.4) + curve(two, a, 3.6);
  s += `<path d="M${f(x(1))} ${Yt - 8}V${Y0}" stroke="${ink}" stroke-width="1" stroke-dasharray="3 4" opacity=".7"/>`;
  for (const [g, col] of [[two, a], [three, b], [gauss, muted]]) s += `<circle cx="${f(x(1))}" cy="${f(y(g(1)))}" r="5" fill="${col}" stroke="#14181c" stroke-width="1.2"/>`;
  s += text(f(x(1 / Math.SQRT2) + 4), Yt + 6, 'bound proved here', 12.5, a);
  s += text(f(x(1)), Y0 + 22, 't = 1', 14, ink, 'middle', 'bold');
  s += text(X1, Y0 + 22, 'threshold t →', 13, dim, 'end');
  s += text(X0 - 8, Yt + 4, 'E(|S| − t)₊', 13, dim, 'end');
  return s;
}

const draw = (a = colors[0], b = colors[1]) => {
  let s = text(48, 50, 'Two equal coins overshoot the most', 26, ink, 'start', 'bold');
  s += text(48, 76, 'weighted fair coins with spread one: how much of the sum sticks out beyond the threshold, on average?', 15, dim);
  s += coins(a, b) + plot(a, b);
  const L = 900;
  s += text(L, 150, 'at one standard deviation', 14, dim);
  s += text(L, 186, '0.207', 30, a, 'start', 'bold') + text(L + 92, 186, 'two equal coins', 14.5, a);
  s += text(L, 228, '0.183', 26, b, 'start', 'bold') + text(L + 92, 228, 'three equal coins', 14.5, b);
  s += text(L, 268, '0.167', 26, muted, 'start', 'bold') + text(L + 92, 268, 'Gaussian', 14.5, muted);
  s += text(L, 312, 'sharp: (√2 − 1)/2, so the', 14, ink);
  s += text(L, 332, 'comparison constant is 2', 14, ink, 'start', 'bold');
  s += text(1160, 388, 'Exact curves · the sharp bound is proved for thresholds 1/√2 ≤ t ≤ 1.005 (shaded)', 13.5, muted, 'end');
  return s;
};

const description = 'Banner for a paper on a sharp stop-loss bound for Rademacher sums, random sums of fair coins with weights whose squares add to one. Left: two equal coins of weight 1/√2; the absolute sum is 0 or √2, each with probability one half, and the part beyond 1, of length √2 − 1, is the overshoot, so the average overshoot is (√2 − 1)/2. Middle: exact curves of the average overshoot E(|S| − t)₊ against the threshold t from 0.5 to 1.5 for two equal coins (solid, highest), three equal coins and the Gaussian limit (dashed); the band 1/√2 ≤ t ≤ 1.005 where the sharp bound is proved is shaded, and t = 1 is marked. Right: the values at one standard deviation, 0.207 for two equal coins, 0.183 for three and 0.167 for the Gaussian; the sharp value (√2 − 1)/2 gives the comparison constant 2. Footer: exact curves; the bound is proved for thresholds from 1/√2 to 1.005.';

const thumbnailHero = () => {
  const x = t => 10 + (t - 0.5) * 410, y = v => 190 - v / 0.46 * 180;
  const c = g => { let d = ''; for (let i = 0; i <= 100; i++) { const t = 0.5 + i / 100; d += `${i ? 'L' : 'M'}${f(x(t))} ${f(y(g(t)))}`; } return d; };
  return `<div class="eq-label">AVERAGE OVERSHOOT E(|S| − t)₊</div>
  <svg viewBox="0 0 430 200" style="width:100%;height:200px" aria-label="Two equal coins have the highest overshoot curve, above three coins and the Gaussian">
    <path d="${c(gauss)}" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="6 5" opacity=".5"/>
    <path d="${c(three)}" fill="none" stroke="currentColor" stroke-width="3" opacity=".65"/>
    <path d="${c(two)}" fill="none" stroke="currentColor" stroke-width="5"/>
  </svg>
  <div class="eq"><span class="hl">0.207</span> · 0.183 · 0.167</div>
  <div class="note">two coins · three coins · Gaussian, at t = 1</div>
  <div class="eq-foot">sharp constant (√2 − 1)/2</div>`;
};

module.exports = { draw, colors, description, thumbnailHero };
