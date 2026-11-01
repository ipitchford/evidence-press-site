'use strict';
// Banner for spectrally-negative-resetting-extremes (Lévy processes with Poisson resetting, fixed-horizon extremes).
// Sources (manuscript of 27 Oct 2026, DOI 10.5281/zenodo.23689354), driftless Brownian motion, lambda = sigma = T = 1, r = 0:
//  - no-reset profile q_T(y-u)/D_T, equation (6.3); reset profile K_T(dy)/(D_T dy), equations (2.5), (6.2), (6.4);
//    both drawn exactly below (numerical quadrature) at u = 3, as in Figure 1(b).
//  - A(1)/D_1 = 0.5307921914..., D_1 = 1.735802469... (Section 8).
//  - C_1 = 1.3285764327711... (Corollary 6.1, (6.7)); the Debicki-Hashorva-Michna bounds are A(1) = Phi(sqrt 2) = 0.92135
//    and A(1) + int_0^1 A = D_1 = 1.73580 (their Remark 3, sigma = 1, x_R = 0).
const ink = '#f4f1ea', muted = '#ddd5c6', dim = '#bfb6a6';
const cNo = '#ffcf7a', cReset = '#9fd3ff', cConst = '#f2a3b8';
const SANS = 'Arial,Helvetica,sans-serif';
const text = (x, y, s, size = 18, color = ink, anchor = 'start', weight = 'normal') =>
  `<text class="og-hide" x="${x}" y="${y}" fill="${color}" font-family="${SANS}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}">${s}</text>`;
const sub = s => `<tspan baseline-shift="sub" font-size="72%">${s}</tspan>`;
const f = v => (+v).toFixed(1);

function erf(x) { // via the Numerical Recipes erfc approximation (fractional error < 1.2e-7)
  const t = 1 / (1 + 0.5 * Math.abs(x));
  const y = 1 - t * Math.exp(-x * x - 1.26551223 + t * (1.00002368 + t * (0.37409196 + t * (0.09678418 + t * (-0.18628806 + t * (0.27886807 + t * (-1.13520398 + t * (1.48851587 + t * (-0.82215223 + t * 0.17087277)))))))));
  return x >= 0 ? y : -y;
}
const Phi = x => 0.5 * (1 + erf(x / Math.SQRT2));
const Psi = x => 1 - Phi(x);
const gauss = (y, s) => Math.exp(-y * y / (2 * s)) / Math.sqrt(2 * Math.PI * s);
const lam = 1, T = 1, beta = Math.SQRT2, kappa = Math.SQRT2, ab = 1 / Math.SQRT2;
const A = s => Phi(Math.sqrt(2 * lam * s));
function integ(g, a, b, n = 400) { // midpoint, integrable endpoint singularities are mild here
  let s = 0; const h = (b - a) / n;
  for (let i = 0; i < n; i++) s += g(a + (i + 0.5) * h);
  return s * h;
}
const D = A(T) + lam * integ(A, 0, T, 2000);
const q = w => w > 0 ? ab * Math.exp(-beta * w)
  : ab * Math.exp(-beta * w) * (Psi(-w + kappa * T) + Math.exp(2 * kappa * w) * Psi(-w - kappa * T));
const pdens = (y, t) => (t > 0 ? Math.exp(-lam * t) * gauss(y, t) : 0) + lam * integ(s => Math.exp(-lam * s) * gauss(y, s), 0, t, 120);
const kdens = y => lam * integ(s => A(s) * pdens(y, T - s), 0, T, 120);
const C1 = (0.75 + 0.5) * Phi(Math.SQRT2) + Math.sqrt(1 / 8) * Math.exp(-1) / Math.sqrt(2 * Math.PI) + 0.125;
if (Math.abs(D - 1.7358024690) > 2e-4 || Math.abs(A(T) / D - 0.5307921914) > 2e-4 || Math.abs(C1 - 1.3285764328) > 1e-6) throw new Error('art data');

function left() {
  let s = '';
  s += text(34, 46, 'Given a peak above u = 3, where does the path end?', 21, ink, 'start', 'bold');
  s += text(34, 70, 'conditional density of the endpoint Y' + sub('T') + ' (Brownian, reset to 0, λ = T = 1), exact profiles', 14, dim);
  const X0 = 70, X1 = 560, Y0 = 322, Y1 = 104, ymin = -3.2, ymax = 6.4, dmax = 0.5;
  const x = v => X0 + (v - ymin) / (ymax - ymin) * (X1 - X0), y = d => Y0 - d / dmax * (Y0 - Y1);
  const curve = (g, col) => {
    let d = '', area = `M${f(x(ymin))} ${Y0}`;
    for (let i = 0; i <= 160; i++) { const v = ymin + (ymax - ymin) * i / 160, yy = y(Math.min(g(v), dmax)); d += `${i ? 'L' : 'M'}${f(x(v))} ${f(yy)} `; area += ` L${f(x(v))} ${f(yy)}`; }
    area += ` L${f(x(ymax))} ${Y0} Z`;
    return `<path d="${area}" fill="${col}" fill-opacity=".15"/><path d="${d}" stroke="${col}" stroke-width="3" fill="none" stroke-linejoin="round"/>`;
  };
  s += curve(v => kdens(v) / D, cReset);
  s += curve(v => q(v - 3) / D, cNo);
  s += `<path d="M${X0} ${Y0} H${X1}" stroke="${muted}" stroke-width="1.1"/>`;
  for (const v of [-2, 0, 2, 3, 4, 6]) s += `<path d="M${f(x(v))} ${Y0} v5" stroke="${muted}"/>` + text(f(x(v)), Y0 + 20, String(v), 12.5, dim, 'middle');
  s += `<path d="M${f(x(3))} ${Y1 - 8} V${Y0}" stroke="${cNo}" stroke-width="1.3" stroke-dasharray="4 4"/>`;
  s += text(f(x(3) + 8), Y1 + 4, 'threshold u', 13, cNo);
  s += text(f(x(-0.45)), f(y(0.43)), 'reset after the peak:', 15, cReset, 'end', 'bold');
  s += text(f(x(-0.45)), f(y(0.43) + 19), 'ends at an ordinary level', 14, cReset, 'end');
  s += text(f(x(-0.45)), f(y(0.43) + 38), `probability → ${(1 - A(T) / D).toFixed(3)}`, 14, cReset, 'end');
  s += text(f(x(3.9)), f(y(0.43)), 'no reset yet:', 15, cNo, 'start', 'bold');
  s += text(f(x(3.9)), f(y(0.43) + 19), 'ends just below its peak', 14, cNo);
  s += text(f(x(3.9)), f(y(0.43) + 38), `probability → ${(A(T) / D).toFixed(3)}`, 14, cNo);
  s += text(X1, Y0 + 40, 'endpoint y', 12.5, dim, 'end');
  return s;
}

function right() {
  let s = '';
  const X0 = 640;
  s += text(X0, 46, 'The constant left open in a 2026 remark', 21, ink, 'start', 'bold');
  s += text(X0, 70, 'P(max > u, end > 0) ~ C' + sub('T') + ' e' + '<tspan baseline-shift="super" font-size="70%">−√2 u</tspan>' + ' (Dębicki–Hashorva–Michna, Remark 3)', 14, dim);
  const A0 = 680, A1 = 1150, V0 = 0.8, V1 = 1.85, AY = 220;
  const ax = v => A0 + (v - V0) / (V1 - V0) * (A1 - A0);
  const lo = A(T), hi = D;
  s += `<path d="M${f(ax(lo))} ${AY} H${f(ax(hi))}" stroke="${muted}" stroke-opacity=".55" stroke-width="10" stroke-linecap="round"/>`;
  s += `<path d="M${A0} ${AY + 40} H${A1}" stroke="${muted}" stroke-width="1.1"/>`;
  for (const v of [0.8, 1.0, 1.2, 1.4, 1.6, 1.8]) s += `<path d="M${f(ax(v))} ${AY + 40} v5" stroke="${muted}"/>` + text(f(ax(v)), AY + 60, v.toFixed(1), 12.5, dim, 'middle');
  for (const [v, lab] of [[lo, 'lower bound 0.921'], [hi, 'upper bound 1.736']]) {
    s += `<path d="M${f(ax(v))} ${AY - 16} V${AY + 16}" stroke="${muted}" stroke-width="2"/>`;
    s += text(f(ax(v)), AY - 26, lab, 13.5, muted, 'middle');
  }
  s += `<circle cx="${f(ax(C1))}" cy="${AY}" r="9" fill="${cConst}" stroke="#1b1712" stroke-width="1.4"/>`;
  s += text(f(ax(C1)), AY + 88, `C${sub('1')} = 1.32858…`, 22, cConst, 'middle', 'bold');
  s += text(f(ax(C1)), AY + 112, 'strictly inside both bounds', 14, cConst, 'middle');
  s += text(A1, 132, 'λ = T = 1, reset to 0', 13, dim, 'end');
  s += text(A1, 384, 'Overshoot of the peak above u: exponential, mean 1/√2 ≈ 0.707, independent of the rest', 12.5, dim, 'end');
  return s;
}

const draw = () => left() + right() + `<path d="M606 30 V380" stroke="${muted}" stroke-opacity=".25"/>`;
const description = 'Banner for a paper on fixed-horizon extremes of spectrally negative Lévy processes with Poisson resetting. Left: for Brownian motion reset to 0 at rate 1, started in its long-run state, the conditional density of the endpoint at time 1 given that the maximum exceeded 3, drawn from the paper\'s exact formulas. Two humps appear. One, centred near 0, is for paths that were reset after their peak and end at an ordinary level; its probability tends to 0.469. The other sits just below the threshold 3 and decays exponentially above it; it is for paths that have not been reset and end near their peak; its probability tends to 0.531. Right: the constant C_1 in the asymptotic P(maximum > u, endpoint > 0) ~ C_1 e^(−√2 u), left unspecified in Remark 3 of Dębicki, Hashorva and Michna (2026), is 1.32858, strictly between their lower bound 0.921 and upper bound 1.736. A footnote states that the overshoot of the peak above u is exponential with mean 1/√2 and independent of everything else.';

const thumbnailHero = () => '<div style="font-size:28px;letter-spacing:.06em;margin-bottom:22px">AFTER A HIGH PEAK · TWO ENDINGS</div><div style="font-size:50px;line-height:1.3">53% near the peak<br>47% reset, back home</div><div style="font-size:29px;margin-top:28px">Remark 3 constant: C₁ = 1.3286…</div><div style="font-size:23px;margin-top:24px;opacity:.8">Written proofs · exact-sampling checks<br>Unrefereed candidate</div>';

module.exports = { draw, description, thumbnailHero };
