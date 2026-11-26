'use strict';
// Banner for median-skewness-additive-noise (DOI 10.5281/zenodo.24547383).
// Source (manuscript): Propositions 2.1–2.2 — X ~ Beta(1,2) (triangular density 2(1−x) on [0,1]) plus independent
// U uniform on [−1,1]: the sum has median 1/3, tail imbalance D(t) = F(m−t) + F(m+t) − 1 with D(2/3) = +1/162 (left
// tail heavier) and D(3/2) = −1/1296 (right tail heavier); X + U_r stays right van Zwet exactly for r <= (3−√3)/4.
// Everything drawn is computed here from the exact model by numerical integration and checked against those values.
const ink = '#f6f2ea', muted = '#d9d2c4', dim = '#bdb5a6';
const colors = ['#f6c177', '#8fd3c8'];
const SANS = 'Arial,Helvetica,sans-serif';
const f = v => (+v).toFixed(1);
const text = (x, y, s, size = 18, color = ink, anchor = 'start', weight = 'normal') =>
  `<text class="og-hide" x="${x}" y="${y}" fill="${color}" font-family="${SANS}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}">${s}</text>`;

const FU = u => Math.min(1, Math.max(0, (u + 1) / 2));
const simpson = (g, n = 4000) => { let a = 0; for (let i = 0; i <= n; i++) { const x = i / n; a += (i === 0 || i === n ? 1 : i % 2 ? 4 : 2) * g(x); } return a / (3 * n); };
const F = s => simpson(x => 2 * (1 - x) * FU(s - x));
const dens = s => simpson(x => 2 * (1 - x) * (Math.abs(s - x) <= 1 ? 0.5 : 0));
const M = 1 / 3, D = t => F(M - t) + F(M + t) - 1;
{
  if (Math.abs(F(M) - 0.5) > 1e-9) throw new Error('median 1/3');
  if (Math.abs(D(2 / 3) - 1 / 162) > 1e-8 || Math.abs(D(1.5) + 1 / 1296) > 1e-8) throw new Error('D(2/3), D(3/2)');
  if (Math.abs((3 - Math.sqrt(3)) / 4 - 0.317) > 5e-4) throw new Error('safe half-width');
}

function density(a, b) {
  const X0 = 60, X1 = 520, Y0 = 318, H = 380, lo = -1, hi = 2;
  const x = s => X0 + (s - lo) / (hi - lo) * (X1 - X0), y = v => Y0 - v * H;
  const t = 2 / 3;
  const pts = []; for (let i = 0; i <= 240; i++) { const s = lo + (hi - lo) * i / 240; pts.push([s, dens(s)]); }
  const area = (s0, s1) => { const p = pts.filter(([s]) => s >= s0 && s <= s1); return `M${f(x(s0))} ${Y0}` + p.map(([s, v]) => `L${f(x(s))} ${f(y(v))}`).join('') + `L${f(x(s1))} ${f(y(dens(s1)))}L${f(x(s1))} ${Y0}Z`; };
  let s = `<path d="${area(lo, M - t)}" fill="${a}" opacity=".75"/><path d="${area(M + t, hi)}" fill="${b}" opacity=".75"/>`;
  s += `<path d="${pts.map(([sv, v], i) => (i ? 'L' : 'M') + f(x(sv)) + ' ' + f(y(v))).join('')}" stroke="${ink}" stroke-width="3" fill="none"/>`;
  s += `<path d="M${X0 - 6} ${Y0}H${X1 + 6}" stroke="${muted}" stroke-width="1.2"/>`;
  s += `<path d="M${f(x(M))} ${Y0}V${f(y(dens(M)) - 18)}" stroke="${ink}" stroke-width="1.6" stroke-dasharray="4 4"/>`;
  s += text(f(x(M)), f(y(dens(M)) - 26), 'median 1/3', 14, ink, 'middle', 'bold');
  for (const [v, l] of [[M - t, '1/3 − t'], [M + t, '1/3 + t']]) s += `<path d="M${f(x(v))} ${Y0}v8" stroke="${muted}"/>` + text(f(x(v)), Y0 + 24, l, 13.5, dim, 'middle');
  s += text(f(x(-0.62)), 136, 'left tail', 14, a, 'middle', 'bold') + text(f(x(-0.62)), 154, 'heavier', 14, a, 'middle', 'bold');
  s += text(f(x(1.55)), 196, 'right tail', 14, b, 'middle', 'bold') + text(f(x(1.55)), 214, 'lighter', 14, b, 'middle', 'bold');
  s += text(X0, 370, 'triangle on [0, 1] + uniform noise on [−1, 1], at t = 2/3', 13.5, dim);
  return s;
}

function imbalance(a, b) {
  const X0 = 620, X1 = 1150, Y0 = 230, K = 9000, t0 = 0, t1 = 2;
  const x = t => X0 + (t - t0) / (t1 - t0) * (X1 - X0), y = v => Y0 - v * K;
  let s = `<path d="M${X0} ${Y0}H${X1}" stroke="${muted}" stroke-width="1.2"/><path d="M${X0} 126V334" stroke="${muted}" stroke-width="1.2" opacity=".6"/>`;
  const pts = []; for (let i = 0; i <= 200; i++) { const t = t0 + (t1 - t0) * i / 200; pts.push([t, D(t)]); }
  const fillPart = (sign, col) => `<path d="M${X0} ${Y0}` + pts.map(([t, v]) => `L${f(x(t))} ${f(y(sign * v > 0 ? v : 0))}`).join('') + `L${X1} ${Y0}Z" fill="${col}" opacity=".35"/>`;
  s += fillPart(1, a) + fillPart(-1, b);
  s += `<path d="${pts.map(([t, v], i) => (i ? 'L' : 'M') + f(x(t)) + ' ' + f(y(v))).join('')}" stroke="${ink}" stroke-width="3" fill="none"/>`;
  for (const [t, l, dx, dy, an, col] of [[2 / 3, 'D(2/3) = +1/162', -12, -4, 'end', a], [1.5, 'D(3/2) = −1/1296', 12, 22, 'start', b]]) {
    s += `<circle cx="${f(x(t))}" cy="${f(y(D(t)))}" r="6" fill="${col}" stroke="#14181c" stroke-width="1.3"/>`;
    s += text(f(x(t) + dx), f(y(D(t)) + dy), l, 15, col, an, 'bold');
  }
  s += text(x(0.67), Y0 - 12, 'left tail heavier', 13, ink, 'middle', 'bold');
  s += text(x(1.25), Y0 + 66, 'right tail heavier', 13, ink, 'middle', 'bold');
  s += text(X1, Y0 - 8, 'distance t from the median →', 13, dim, 'end');
  s += text(X0 - 8, 136, 'D(t)', 13, dim, 'end');
  return s;
}

const draw = (a = colors[0], b = colors[1]) => {
  let s = text(48, 50, 'The heavier tail switches sides', 26, ink, 'start', 'bold');
  s += text(48, 76, 'a right-skewed triangle plus symmetric uniform noise is skewed neither way, tail by tail', 15, dim);
  s += density(a, b) + imbalance(a, b);
  s += text(1160, 388, 'Exact model · skewness survives uniform noise only up to half-width (3 − √3)/4 ≈ 0.317', 13.5, muted, 'end');
  return s;
};

const description = 'Banner for a paper on whether additive noise preserves median-based (van Zwet) skewness. Left: the density of a right-skewed triangular variable on [0, 1] plus independent uniform noise on [−1, 1], with its median 1/3 marked; the two tails beyond distance t = 2/3 from the median are shaded, and the left tail carries more probability. Right: the tail imbalance D(t), the probability more than t below the median minus the probability more than t above it, plotted for t from 0 to 2 and computed from the exact model. It is zero up to t = 1/3, positive (left tail heavier) up to t = 1, with D(2/3) = +1/162 marked, then negative (right tail heavier) up to t = 5/3, with D(3/2) = −1/1296 marked. Footer: skewness survives uniform noise of half-width at most (3 − √3)/4 ≈ 0.317.';

const thumbnailHero = () => {
  let d = '';
  for (let i = 0; i <= 120; i++) { const t = 2 * i / 120; d += `${i ? 'L' : 'M'}${f(10 + t / 2 * 410)} ${f(100 - D(t) * 10000)} `; }
  return `<div class="eq-label">TAIL IMBALANCE D(t)</div>
  <svg viewBox="0 0 430 200" style="width:100%;height:200px" aria-label="The tail imbalance rises above zero, then falls below zero">
    <path d="M10 100H420" stroke="currentColor" stroke-width="2" opacity=".5"/>
    <path d="${d}" fill="none" stroke="currentColor" stroke-width="5"/>
  </svg>
  <div class="eq"><span class="hl">+1/162</span> then −1/1296</div>
  <div class="note">left tail heavier at 2/3, right tail at 3/2</div>
  <div class="eq-foot">triangle + uniform noise · exact</div>`;
};

module.exports = { draw, colors, description, thumbnailHero };
