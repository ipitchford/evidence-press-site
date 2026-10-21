'use strict';
// Waiting-time entropy-bound counterexamples banner.
// Left: the three-state network of Theorem 3.1 (rates k12 = k21 = 1, k23 = k32 = 1 + eps cos wt,
// k13 = k31 = 1 + eps sin wt); only the jumps 1->2 and 2->1 are observed. Every rate equals its
// reverse at every instant, so the entropy production sigma is exactly 0.
// Middle: the phase-averaged repeat densities F = Psi_{++} and G = Psi_{--} for eps = 1/2, omega = 1,
// sampled every 0.1 time units from results/densities_refined.npz (keys plus, minus), and their
// difference magnified 20 times. F - G = (eps^2 omega / 6) tau^3 + O(tau^4) (Theorem 3.1);
// the forward-only statistic is S = 1.13e-5 > 0 = sigma (numerical_refined.json).
// Right: fixed-prefactor class (kappa = 1, energies driven on a circle of radius A at frequency omega):
// true entropy production sigma against the statistic S for the 30-point circular scan in
// results/e1_fixed_prefactor.json (numerical), and the certified switching protocol of Theorem 4.2
// (e1_certificate.json: sigma = 0.0027973, S >= 0.0036867, Arb ball arithmetic).
const ink = '#f2f5f8', muted = '#c9d6e0', dim = '#a9b8c6';
const fc = '#9fd0ff', gc = '#ffc184', dc = '#ff9fb4', above = '#ffd36e', below = '#8fb3c9';
const text = (x, y, s, size = 18, color = ink, anchor = 'start', weight = 'normal', extra = '') =>
  `<text class="og-hide" x="${x}" y="${y}" fill="${color}" font-family="Arial,Helvetica,sans-serif" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}"${extra}>${s}</text>`;
const f = v => (+v).toFixed(1);
const F = [0.00000,0.00405,0.01319,0.02428,0.03545,0.04570,0.05454,0.06179,0.06746,0.07165,0.07454,0.07629,0.07708,0.07707,0.07642,0.07524,0.07365,0.07175,0.06961,0.06730,0.06488,0.06238,0.05984,0.05730,0.05477,0.05228,0.04983,0.04745,0.04513,0.04289,0.04072,0.03864,0.03664,0.03473,0.03289,0.03115,0.02948,0.02789,0.02638,0.02494,0.02358,0.02228,0.02105,0.01989,0.01879,0.01775,0.01676,0.01582,0.01494,0.01411,0.01332,0.01257,0.01187,0.01121,0.01058,0.00998,0.00943,0.00890,0.00840,0.00793,0.00748,0.00706,0.00667,0.00629,0.00594,0.00561,0.00529,0.00500,0.00472,0.00445,0.00420,0.00397,0.00375,0.00354,0.00334,0.00315,0.00298,0.00281,0.00265,0.00250,0.00236];
const G = [0.00000,0.00402,0.01303,0.02389,0.03480,0.04482,0.05348,0.06062,0.06626,0.07048,0.07345,0.07531,0.07623,0.07637,0.07585,0.07481,0.07335,0.07155,0.06951,0.06728,0.06492,0.06247,0.05998,0.05748,0.05498,0.05251,0.05008,0.04772,0.04542,0.04319,0.04104,0.03896,0.03697,0.03507,0.03324,0.03150,0.02984,0.02825,0.02674,0.02531,0.02394,0.02264,0.02141,0.02024,0.01913,0.01808,0.01709,0.01614,0.01525,0.01440,0.01360,0.01284,0.01212,0.01144,0.01080,0.01019,0.00961,0.00907,0.00856,0.00807,0.00761,0.00718,0.00677,0.00638,0.00602,0.00568,0.00535,0.00505,0.00476,0.00449,0.00423,0.00399,0.00376,0.00355,0.00335,0.00316,0.00298,0.00281,0.00265,0.00250,0.00236];
// [A, omega, sigma, S]
const SCAN = [[1,0.025,4.456e-05,8.346e-06],[1,0.05,0.0001782,3.331e-05],[1,0.1,0.000712,0.0001316],[1,0.2,0.002836,0.0004913],[1,0.4,0.01116,0.001553],[2,0.025,0.0001586,7.954e-05],[2,0.05,0.0006343,0.0003202],[2,0.1,0.002533,0.001298],[2,0.2,0.01007,0.005068],[2,0.4,0.03938,0.01645],[2.5,0.025,0.0002291,0.0001666],[2.5,0.05,0.0009159,0.0006738],[2.5,0.1,0.003656,0.002753],[2.5,0.2,0.01452,0.01061],[2.5,0.4,0.05653,0.03326],[3,0.025,0.0003031,0.0003128],[3,0.05,0.001212,0.001271],[3,0.1,0.004834,0.005192],[3,0.2,0.01916,0.01929],[3,0.4,0.07425,0.05739],[3.5,0.025,0.0003784,0.0005468],[3.5,0.05,0.001513,0.002227],[3.5,0.1,0.006032,0.008983],[3.5,0.2,0.02385,0.03148],[3.5,0.4,0.09191,0.0885],[4,0.025,0.0004539,0.0009071],[4,0.05,0.001814,0.003691],[4,0.1,0.007228,0.01444],[4,0.2,0.02851,0.0471],[4,0.4,0.1092,0.1255]];
const CERT = [0.0027973, 0.0036867];

function draw() {
  let s = '';
  s += text(40, 44, 'No dissipation, yet the forward-only waiting-time statistic reports some', 24, ink, 'start', 'bold');

  // ---- left: the triangle
  const P1 = [72, 300], P2 = [292, 300], P3 = [182, 128];
  const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  s += `<path d="M${P2[0]} ${P2[1]} L${P3[0]} ${P3[1]}" stroke="${dim}" stroke-width="3" stroke-dasharray="7 6"/>`;
  s += `<path d="M${P1[0]} ${P1[1]} L${P3[0]} ${P3[1]}" stroke="${dim}" stroke-width="3" stroke-dasharray="7 6"/>`;
  s += `<path d="M${P1[0]} ${P1[1]} L${P2[0]} ${P2[1]}" stroke="${ink}" stroke-width="5" stroke-linecap="round"/>`;
  for (const [p, n] of [[P1, '1'], [P2, '2'], [P3, '3']]) {
    s += `<circle cx="${p[0]}" cy="${p[1]}" r="21" fill="#0b141c" stroke="${ink}" stroke-width="2.4"/>`;
    s += text(p[0], p[1] + 7, n, 20, ink, 'middle', 'bold');
  }
  const m23 = mid(P2, P3), m13 = mid(P1, P3);
  s += text(f(m13[0] - 16), f(m13[1] - 4), 'hidden', 15, dim, 'end');
  s += text(f(m13[0] - 16), f(m13[1] + 15), '1 + ε sin ωt', 15, dim, 'end');
  s += text(f(m23[0] + 16), f(m23[1] - 4), 'hidden', 15, dim, 'start');
  s += text(f(m23[0] + 16), f(m23[1] + 15), '1 + ε cos ωt', 15, dim, 'start');
  s += text(182, 288, 'observed: 1 ⇄ 2', 15, ink, 'middle', 'bold');
  s += text(182, 348, 'every rate = its reverse', 15, muted, 'middle');
  s += text(182, 370, 'true dissipation σ = 0', 17, ink, 'middle', 'bold');

  // ---- middle: repeat densities F and G
  const X0 = 400, X1 = 770, Y0 = 300, YT = 92;
  const tx = i => X0 + (X1 - X0) * i / (F.length - 1);
  const yv = v => Y0 - (Y0 - YT) * v / 0.08;
  s += `<path d="M${X0} ${YT - 6} V${Y0} H${X1 + 8}" stroke="${muted}" stroke-width="1.4" fill="none"/>`;
  const line = (arr, scale = 1, base = 0) => arr.map((v, i) => `${i ? 'L' : 'M'}${f(tx(i))} ${f(yv(base + scale * v))}`).join(' ');
  const D = F.map((v, i) => v - G[i]);
  const zeroY = yv(0.012);
  s += `<path d="M${X0} ${f(zeroY)} H${X1}" stroke="${dc}" stroke-opacity=".35" stroke-dasharray="3 4"/>`;
  s += `<path d="${line(D, 20, 0.012)}" stroke="${dc}" stroke-width="2.4" fill="none"/>`;
  s += `<path d="${line(G)}" stroke="${gc}" stroke-width="3" fill="none"/>`;
  s += `<path d="${line(F)}" stroke="${fc}" stroke-width="3" fill="none" stroke-dasharray="1 0"/>`;
  for (const t of [0, 2, 4, 6, 8]) {
    const x = tx(t * 10);
    s += `<path d="M${f(x)} ${Y0} v6" stroke="${muted}" stroke-width="1.3"/>`;
    s += text(f(x), Y0 + 24, String(t), 15, muted, 'middle');
  }
  s += text((X0 + X1) / 2, Y0 + 48, 'waiting time τ between visible jumps', 15, dim, 'middle');
  s += text(X0 + 132, 112, 'F: next jump repeats 1→2', 16, fc, 'start', 'bold');
  s += text(X0 + 132, 134, 'G: next jump repeats 2→1', 16, gc, 'start', 'bold');
  s += text(f(tx(17)), f(yv(0.031)), 'F − G, ×20', 15, dc, 'start', 'bold');
  s += text(X1, 172, 'statistic S ≈ 1.1×10⁻⁵ > 0', 16, ink, 'end', 'bold');
  s += text(X1, 192, 'F ≠ G reads as an arrow of time', 15, muted, 'end');

  // ---- right: fixed-prefactor class, sigma vs S, log-log
  const IX = 820, IY = 70, IW = 352, IH = 300;
  s += `<rect x="${IX}" y="${IY}" width="${IW}" height="${IH}" rx="14" fill="#0b141c" fill-opacity=".42" stroke="${muted}" stroke-opacity=".3"/>`;
  s += text(IX + 16, IY + 28, 'Class tested by Maier et al.', 18, ink, 'start', 'bold');
  s += text(IX + 16, IY + 49, 'fixed prefactors, driven energies', 14, muted);
  const LX0 = IX + 46, LX1 = IX + IW - 18, LY0 = IY + IH - 46, LY1 = IY + 66;
  const lo = -5.2, hi = -0.7;
  const lx = v => LX0 + (LX1 - LX0) * (Math.log10(v) - lo) / (hi - lo);
  const ly = v => LY0 - (LY0 - LY1) * (Math.log10(v) - lo) / (hi - lo);
  s += `<path d="M${LX0} ${LY1} V${LY0} H${LX1}" stroke="${muted}" stroke-width="1.3" fill="none"/>`;
  s += `<path d="M${f(lx(1e-5))} ${f(ly(1e-5))} L${f(lx(10 ** hi))} ${f(ly(10 ** hi))}" stroke="${ink}" stroke-width="1.6" stroke-dasharray="6 5"/>`;
  s += text(f(lx(1.6e-5)), f(ly(1.6e-5) - 8), 'S = σ', 13, ink, 'start', 'bold', ` transform="rotate(-${f(Math.atan2(LY0 - LY1, LX1 - LX0) * 180 / Math.PI)} ${f(lx(1.6e-5))} ${f(ly(1.6e-5) - 8)})"`);
  for (const [A, w, sg, S] of SCAN) {
    const up = S > sg;
    s += `<circle cx="${f(lx(sg))}" cy="${f(ly(S))}" r="${up ? 4.6 : 3.8}" fill="${up ? above : below}" fill-opacity="${up ? 1 : 0.8}"/>`;
  }
  const cx = lx(CERT[0]), cy = ly(CERT[1]);
  s += `<path d="M${f(cx)} ${f(cy - 9)} L${f(cx + 3)} ${f(cy - 3)} L${f(cx + 9)} ${f(cy - 3)} L${f(cx + 4)} ${f(cy + 2)} L${f(cx + 6)} ${f(cy + 9)} L${f(cx)} ${f(cy + 5)} L${f(cx - 6)} ${f(cy + 9)} L${f(cx - 4)} ${f(cy + 2)} L${f(cx - 9)} ${f(cy - 3)} L${f(cx - 3)} ${f(cy - 3)} Z" fill="${ink}" stroke="#0b141c" stroke-width="1"/>`;
  s += text(f(LX0 + 8), f(LY1 + 14), '★ switching protocol, certified:', 13, ink, 'start', 'bold');
  s += text(f(LX0 + 8), f(LY1 + 31), 'S ≥ 1.3179 σ', 13, ink, 'start', 'bold');
  s += text(f(LX0 + 8), f(LY1 + 52), '● strong, slow driving: S > σ', 13, above, 'start');
  s += text(f(LX1), f(LY0 - 10), 'weak driving: S &lt; σ ●', 13, below, 'end');
  s += text((LX0 + LX1) / 2, LY0 + 20, 'true dissipation σ (log scale)', 13, muted, 'middle');
  s += text(LX0 - 12, (LY0 + LY1) / 2, 'statistic S', 13, muted, 'middle', 'normal', ` transform="rotate(-90 ${LX0 - 12} ${f((LY0 + LY1) / 2)})"`);
  s += text(IX + 16, IY + IH - 6, 'dashed S = σ: conjectured ceiling · dots numerical', 12, dim);
  return s;
}
const description = 'Banner for the counterexamples to the conjectured waiting-time bound on entropy production. Left: a triangle of three states. Only jumps between states 1 and 2 are observed; the two hidden edges to state 3 have barrier rates 1 + ε sin ωt and 1 + ε cos ωt, driven out of phase. Every rate equals its reverse at every instant, so the true entropy production σ is zero. Middle: for ε = 1/2 and ω = 1, the phase-averaged waiting-time densities F (the next visible jump repeats 1→2) and G (it repeats 2→1) against the waiting time from 0 to 8, computed from the release data. The curves nearly overlap; their difference, drawn twenty times enlarged, is positive at short waiting times and negative later. The forward-only statistic of Maier et al. reads this asymmetry as dissipation, about 1.1×10⁻⁵ per unit time, although none occurs (Theorem 3.1). Right: in the fixed-prefactor class tested by Maier et al., a log–log plot of the statistic S against the true entropy production σ for 30 numerically computed circular driving protocols, with the line S = σ marking the conjectured ceiling. Weak driving lies below the line; slow, strong driving lies above it. A star marks the switching protocol of Theorem 4.2, certified by interval arithmetic to give S ≥ 1.3179 σ.';
module.exports = { draw, description };
