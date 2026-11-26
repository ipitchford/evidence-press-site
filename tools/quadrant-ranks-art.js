'use strict';
// Banner for archimedean-quadrant-dependence-exchangeable-ranks (DOI 10.5281/zenodo.24547093).
// Sources (manuscript): Theorem 6.1/Corollary 6.2 — for a pair of ranks from 3 exchangeable uniform ranks, Gini's gamma
// is never below −4/9 and 3γ − 2ρ never below −23/54 (unconstrained, γ reaches −1); Theorem 7.1 — the smallest common
// Gini correlation of three variables is −4/9, against Koike–Hofert's Gaussian example ≈ −0.379 and the general
// correlation-matrix bound −1/2; Theorem 3.1 — all four Fuchs–Tschimpke implications between quadrant dependence and
// PMI fail for Archimedean copulas. Mechanism (page): with an odd number of units the rank signs cannot all cancel.
const ink = '#f6f2ea', muted = '#d9d2c4', dim = '#bdb5a6';
const colors = ['#f6c177', '#8fd3c8'];
const SANS = 'Arial,Helvetica,sans-serif';
const f = v => (+v).toFixed(1);
const text = (x, y, s, size = 18, color = ink, anchor = 'start', weight = 'normal') =>
  `<text class="og-hide" x="${x}" y="${y}" fill="${color}" font-family="${SANS}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}">${s}</text>`;
const G3 = -4 / 9, GAUSS = -0.379, CORR = -1 / 2, D3 = -23 / 54;
{
  if (!(G3 < GAUSS && CORR < G3)) throw new Error('ordering −1/2 < −4/9 < −0.379');
  if (Math.abs(G3 + 0.4444) > 1e-4 || Math.abs(D3 + 0.4259) > 1e-4) throw new Error('fractions');
}

const draw = (a = colors[0], b = colors[1]) => {
  let s = text(48, 50, 'Three interchangeable units cap negative dependence', 26, ink, 'start', 'bold');
  s += text(48, 76, 'two ranks drawn from a cluster of three exchangeable units: how negatively can they be related?', 15, dim);
  // left: three units, one pair highlighted, signs + + −
  const U = [[150, 140], [96, 262], [204, 262]];
  s += `<path d="M${U[0]}L${U[1]}L${U[2]}Z" stroke="${muted}" stroke-width="1.4" fill="none" opacity=".5"/>`;
  s += `<path d="M${U[1]}L${U[2]}" stroke="${a}" stroke-width="4"/>`;
  U.forEach(([x, y], i) => {
    s += `<circle cx="${x}" cy="${y}" r="24" fill="${i ? a : b}" opacity="${i ? 1 : 0.85}"/>`;
    s += text(x, y + 8, i === 0 ? '−' : '+', 24, '#14181c', 'middle', 'bold');
  });
  s += text(150, 304, 'the observed pair', 14, a, 'middle', 'bold');
  s += text(150, 326, 'three signs cannot all cancel:', 13, dim, 'middle');
  s += text(150, 344, 'the odd one costs correlation', 13, dim, 'middle');
  // middle: number line for Gini's gamma
  const X0 = 330, X1 = 900, y0 = 200, x = v => X0 + (v + 1) / 2 * (X1 - X0);
  s += `<rect x="${X0}" y="${y0 - 16}" width="${f(x(G3) - X0)}" height="32" fill="${muted}" opacity=".16"/>`;
  s += text((X0 + x(G3)) / 2, y0 + 34, 'out of reach', 13.5, dim, 'middle');
  s += `<path d="M${X0} ${y0}H${X1}" stroke="${ink}" stroke-width="2"/>`;
  for (const [v, l] of [[-1, '−1'], [0, '0'], [1, '+1']]) s += `<path d="M${f(x(v))} ${y0 - 8}v16" stroke="${ink}" stroke-width="2"/>` + text(f(x(v)), y0 + 34, l, 15, dim, 'middle');
  s += `<path d="M${f(x(G3))} ${y0 - 34}V${y0 + 16}" stroke="${a}" stroke-width="3"/>`;
  s += `<circle cx="${f(x(G3))}" cy="${y0}" r="7" fill="${a}"/>`;
  s += text(f(x(G3)), y0 - 44, 'least Gini’s gamma: −4/9', 18, a, 'middle', 'bold');
  s += `<path d="M${f(x(GAUSS))} ${y0 + 10}v34" stroke="${b}" stroke-width="1.6"/>` + text(f(x(GAUSS) + 6), y0 + 58, 'Gaussian example ≈ −0.379', 13, b);
  s += `<path d="M${f(x(CORR))} ${y0 + 10}v58" stroke="${muted}" stroke-width="1.4" stroke-dasharray="3 3"/>` + text(f(x(CORR) - 6), y0 + 82, 'correlation-matrix bound −1/2', 13, dim, 'end');
  s += text(X0, y0 - 74, 'with no constraint: down to −1', 14, dim);
  s += text(X0, 334, 'also: 3γ − 2ρ is never below −23/54 for three units', 14.5, ink);
  // right: four implications, all fail
  const R = 950;
  s += text(R, 132, 'Archimedean copulas:', 14.5, ink, 'start', 'bold');
  s += text(R, 152, 'all four conjectured links fail', 14, dim);
  const rows = ['quadrant dep. ⇒ PMI', 'PMI ⇒ quadrant dep.', 'neg. quadrant ⇒ NMI', 'NMI ⇒ neg. quadrant'];
  rows.forEach((r, i) => {
    const y = 190 + i * 34;
    s += `<path d="M${R} ${y - 10}l12 12M${R + 12} ${y - 10}l-12 12" stroke="${a}" stroke-width="2.6"/>`;
    s += text(R + 22, y, r, 14, ink);
  });
  s += text(1160, 388, 'Exact population bounds · the four counterexamples are deliberately tiny effects', 13.5, muted, 'end');
  return s;
};

const description = 'Banner for a paper on quadrant dependence and rank correlations of exchangeable ranks. Left: three interchangeable units drawn as a triangle of discs marked +, + and −, with the observed pair of ranks highlighted; three signs cannot all cancel, and the leftover one costs correlation. Middle: a number line for Gini’s gamma from −1 to +1. The stretch from −1 to −4/9 is shaded as out of reach: for a pair from three exchangeable units Gini’s gamma is never below −4/9, while with no constraint it can reach −1. For comparison, a Gaussian example reaches about −0.379 and the general correlation-matrix bound is −1/2. A note adds that 3γ − 2ρ is never below −23/54 for three units. Right: for Archimedean copulas all four conjectured implications between quadrant dependence and the positive or negative measure inducing property are crossed out as failing. Footer: exact population bounds; the four counterexamples are deliberately tiny effects.';

const thumbnailHero = () => {
  const x = v => 15 + (v + 1) / 2 * 400;
  return `<div class="eq-label">GINI’S GAMMA, THREE EXCHANGEABLE UNITS</div>
  <svg viewBox="0 0 430 200" style="width:100%;height:200px" aria-label="Number line from −1 to 1 with the region below −4/9 shaded out of reach">
    <rect x="15" y="80" width="${f(x(G3) - 15)}" height="40" fill="currentColor" opacity=".18"/>
    <path d="M15 100H415" stroke="currentColor" stroke-width="3"/>
    <path d="M${f(x(G3))} 60V140" stroke="currentColor" stroke-width="6"/>
    <path d="M15 88v24M215 88v24M415 88v24" stroke="currentColor" stroke-width="3"/>
  </svg>
  <div class="eq">never below <span class="hl">−4/9</span></div>
  <div class="note">without the cluster it can reach −1</div>
  <div class="eq-foot">and all four Archimedean implications fail</div>`;
};

module.exports = { draw, colors, description, thumbnailHero };
