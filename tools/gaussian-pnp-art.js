'use strict';
// Banner for gaussian-pnp-stability (Gaussian-kernel plug-and-play stability; DOI 10.5281/zenodo.23690125).
// Sources (manuscript of 27 Oct 2026): Delta(eps,t) = a0 + a1 t + a2 t^2 with a0, a1, a2 from Appendix B;
// Theorem 4: the four-state family is unstable exactly where Delta < 0; eps_crit = 1.6946633e-5; t* = 0.5313;
// growth rho(P) - 1 along eps = t/100000 from the quadratic factor lambda^2 - T_P lambda + D_P (Appendix C.1),
// whose maximum is about 1.72e-5 (Section 12). Everything below is drawn from those formulas.
const ink = '#f4f1ea', muted = '#ddd5c6', dim = '#bfb6a6';
const cUnstable = '#f2a3b8', cFamily = '#ffcf7a', cGrowth = '#9fd3ff';
const SANS = 'Arial,Helvetica,sans-serif';
const text = (x, y, s, size = 18, color = ink, anchor = 'start', weight = 'normal') =>
  `<text class="og-hide" x="${x}" y="${y}" fill="${color}" font-family="${SANS}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}">${s}</text>`;
const f = v => (+v).toFixed(1);

const a0 = e => e * (31 / 120 + 217 / 200 * e);
const a1 = e => -133 / 3750000 + 1782779 / 10000000 * e + 969583 / 50000000 * e * e;
const a2 = e => 751389 / 12500000000 - 15987 / 1000000000 * e - 1582713 / 125000000000 * e * e;
const roots = e => {
  const d = a1(e) ** 2 - 4 * a0(e) * a2(e);
  if (d <= 0) return null;
  return [(-a1(e) - Math.sqrt(d)) / (2 * a2(e)), (-a1(e) + Math.sqrt(d)) / (2 * a2(e))];
};
const TP = (e, t) => (184929 * e * t - 3750000 * e - 2258335 * t + 26750000) / (15000000 * (1 + e));
const DP = (e, t) => (2500 - t) * (47961 * t - 250000) * (99 * e * e + 125 * e - 470) / (375000000000 * (1 + e) ** 2);
const growth = t => { const e = t / 100000, T = TP(e, t), D = DP(e, t); return (T + Math.sqrt(T * T - 4 * D)) / 2 - 1; };
const EPS_CRIT = 1.6946633e-5, TSTAR = 0.53128532534;
{
  const g = growth(0.25), r = roots(1e-6);
  if (Math.abs(g - 1.71e-5) > 2e-7 || roots(2e-5) !== null || !r || Math.abs(roots(TSTAR / 1e5)[1] - TSTAR) > 1e-6) throw new Error('art data');
}

function left() {
  let s = '';
  s += text(34, 46, 'Where the four-point Gaussian denoiser fails', 21, ink, 'start', 'bold');
  s += text(34, 70, 'exact unstable region Δ(ε, t) &lt; 0 (Theorem 4); weak-link affinity ε against step size t', 14, dim);
  const X0 = 80, X1 = 560, Y0 = 330, Y1 = 100, L0 = -8, L1 = -4, T1 = 0.8;
  const x = l => X0 + (l - L0) / (L1 - L0) * (X1 - X0), y = t => Y0 - t / T1 * (Y0 - Y1);
  let top = '', bot = '';
  const lc = Math.log10(EPS_CRIT);
  const n = 200;
  for (let i = 0; i <= n; i++) {
    const l = L0 + (lc - L0) * i / n, r = roots(10 ** l) || [roots(EPS_CRIT * 0.999999)[0], roots(EPS_CRIT * 0.999999)[0]];
    top += `${i ? 'L' : 'M'}${f(x(l))} ${f(y(Math.min(r[1], T1)))} `;
    bot = ` L${f(x(l))} ${f(y(r[0]))}` + bot;
  }
  s += `<path d="${top}${bot} Z" fill="${cUnstable}" fill-opacity=".32" stroke="${cUnstable}" stroke-width="2.2" stroke-linejoin="round"/>`;
  s += `<path d="M${X0} ${Y0} H${X1} M${X0} ${Y0} V${Y1}" stroke="${muted}" stroke-width="1.1" fill="none"/>`;
  for (const l of [-8, -7, -6, -5, -4]) s += `<path d="M${f(x(l))} ${Y0} v5" stroke="${muted}"/>` + text(f(x(l)), Y0 + 21, `10<tspan baseline-shift="super" font-size="70%">${l}</tspan>`, 13, dim, 'middle');
  for (const t of [0, 0.2, 0.4, 0.6, 0.8]) s += `<path d="M${X0 - 5} ${f(y(t))} h5" stroke="${muted}"/>` + text(X0 - 9, f(y(t) + 4), t.toFixed(1), 12.5, dim, 'end');
  let fam = '';
  for (let i = 0; i <= 120; i++) { const t = 0.001 * (T1 / 0.001) ** (i / 120); fam += `${i ? 'L' : 'M'}${f(x(Math.log10(t / 1e5)))} ${f(y(t))} `; }
  s += `<path d="${fam}" stroke="${cFamily}" stroke-width="2.4" stroke-dasharray="7 5" fill="none"/>`;
  s += `<circle cx="${f(x(Math.log10(TSTAR / 1e5)))}" cy="${f(y(TSTAR))}" r="5.5" fill="${cFamily}"/>`;
  s += text(f(x(Math.log10(TSTAR / 1e5)) - 12), f(y(0.66)), 'leaves at t* ≈ 0.531', 14, cFamily, 'end', 'bold');
  s += text(f(x(Math.log10(0.8 / 1e5)) - 8), Y1 + 6, 'family ε = t/10⁵', 13.5, cFamily, 'end');
  s += text(f(x(-7.55)), f(y(0.36)), 'unstable', 18, cUnstable, 'start', 'bold');
  s += text(f(x(-7.55)), f(y(0.36) + 19), 'both PnP-ISTA and PnP-ADMM', 13, cUnstable);
  s += `<path d="M${f(x(lc))} ${Y1 + 6} V${Y0}" stroke="${muted}" stroke-width="1.1" stroke-dasharray="3 4"/>`;
  s += text(f(x(lc) + 8), f(y(0.14)), 'ε_crit ≈ 1.7×10⁻⁵', 12.5, muted);
  s += text(f(x(lc) + 8), f(y(0.14) + 16), 'stable beyond', 12.5, muted);
  s += text(X1, Y0 + 44, 'weak-link affinity ε', 12.5, dim, 'end');
  s += text(X0 - 50, Y1 - 10, 'step t', 12.5, dim);
  return s;
}

function right() {
  let s = '';
  const X0 = 650, X1 = 1150, Y0 = 330, Y1 = 120, G = 2e-5, TM = 0.6;
  s += text(X0 - 10, 46, '…and how slowly it fails', 21, ink, 'start', 'bold');
  s += text(X0 - 10, 70, 'growth per iteration, ρ(P) − 1, along the dashed family (Section 12)', 14, dim);
  const x = t => X0 + t / TM * (X1 - X0), y = g => Y0 - g / G * (Y0 - Y1);
  let d = '', area = `M${X0} ${Y0}`;
  for (let i = 1; i <= 160; i++) {
    const t = TSTAR * i / 160 * 0.9999, g = Math.max(growth(t), 0);
    d += `${i > 1 ? 'L' : 'M'}${f(x(t))} ${f(y(g))} `; area += ` L${f(x(t))} ${f(y(g))}`;
  }
  area += ` L${f(x(TSTAR))} ${Y0} Z`;
  s += `<path d="${area}" fill="${cGrowth}" fill-opacity=".16"/><path d="${d}" stroke="${cGrowth}" stroke-width="3" fill="none"/>`;
  s += `<path d="M${X0} ${Y0} H${X1} M${X0} ${Y0} V${Y1}" stroke="${muted}" stroke-width="1.1" fill="none"/>`;
  for (const t of [0, 0.2, 0.4, 0.6]) s += `<path d="M${f(x(t))} ${Y0} v5" stroke="${muted}"/>` + text(f(x(t)), Y0 + 21, t.toFixed(1), 12.5, dim, 'middle');
  for (const g of [0, 1e-5, 2e-5]) s += `<path d="M${X0 - 5} ${f(y(g))} h5" stroke="${muted}"/>` + text(X0 - 9, f(y(g) + 4), g ? `${g * 1e5}×10⁻⁵` : '0', 12.5, dim, 'end');
  const tp = 0.25;
  s += `<circle cx="${f(x(tp))}" cy="${f(y(growth(tp)))}" r="5.5" fill="${cGrowth}"/>`;
  s += text(f(x(tp) + 12), f(y(growth(tp)) - 12), 'peak ≈ 1.7×10⁻⁵ per step', 15, cGrowth, 'start', 'bold');
  s += text(X0 - 10, 92, 'tenfold growth needs 10⁵–10⁶ iterations; typical runs use 20–500', 14, muted);
  s += text(X1, Y0 + 44, 'step t', 12.5, dim, 'end');
  s += text(X0 - 10, 384, 'Remedies proved: scale t with the mixing gap, or symmetrise the denoiser', 13.5, ink);
  return s;
}

const draw = () => left() + right() + `<path d="M612 30 V380" stroke="${muted}" stroke-opacity=".25"/>`;
const description = 'Banner for a paper on the stability of plug-and-play iterations with Gaussian kernel denoisers. Left: the exact region of instability of the paper\'s four-point Gaussian family, plotted from the paper\'s formula for Δ(ε, t), with the weak-link affinity ε on a logarithmic axis from 10^-8 to 10^-4 and the step size t from 0 to 0.8. Both PnP-ISTA and PnP-ADMM are unstable inside a thin pink region that exists only for ε below about 1.7×10^-5. A dashed curve, the one-parameter family ε = t/100000 used in the main theorem, runs through the region and leaves it at t* ≈ 0.531. Right: along that dashed family, the growth per iteration, ρ(P) − 1, rises from zero to a peak of about 1.7×10^-5 near t = 0.25 and returns to zero at t*. Tenfold growth therefore needs 10^5 to 10^6 iterations, while typical runs use 20 to 500. A footnote names the two proved remedies: scale the step with the mixing gap, or symmetrise the denoiser.';

const thumbnailHero = () => '<div style="font-size:28px;letter-spacing:.06em;margin-bottom:22px">HOW BIG IS THE FAILURE?</div><div style="font-size:64px;line-height:1.2">1.7×10⁻⁵</div><div style="font-size:32px;margin-top:10px">growth per step, at most</div><div style="font-size:29px;margin-top:28px">10⁵–10⁶ steps to grow tenfold</div><div style="font-size:23px;margin-top:24px;opacity:.8">Exact certificates · AI-assisted<br>Unrefereed candidate</div>';

module.exports = { draw, description, thumbnailHero };
