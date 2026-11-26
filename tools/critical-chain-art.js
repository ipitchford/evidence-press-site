'use strict';
// Banner for critical-chain-bound-energy (DOI 10.5281/zenodo.24553557).
// Source (manuscript, 20 pages): Theorem 6 and Corollaries 7–8 — every sign-preserving polynomial f gives a
// free-fermion chain with one-particle Hamiltonian f(T) and the hopping chain's ground state; Q_L ~ D(m, A) S^(m+1)/L^m,
// m the largest order of a zero of the dispersion; the S²/L law (coefficient 3v/(2πc)) holds iff f'(0) ≠ 0 and no
// other zero. Drawing convention from Figure 2 / code/dispersion.py: one-particle energy against wave number k.
// Curves are exact: hopping ε(k) = 2 cos k and cubic ε(k) = (2 cos k)³, clipped to the frame.
const ink = '#f6f2ea', muted = '#d9d2c4', dim = '#bdb5a6';
const colors = ['#f6c177', '#8fd3c8'];
const SANS = 'Arial,Helvetica,sans-serif';
const f = v => (+v).toFixed(1);
const text = (x, y, s, size = 18, color = ink, anchor = 'start', weight = 'normal') =>
  `<text class="og-hide" x="${x}" y="${y}" fill="${color}" font-family="${SANS}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}">${s}</text>`;

const hop = k => 2 * Math.cos(k);
const cub = k => hop(k) ** 3;
{
  if (Math.abs(hop(Math.PI / 2)) > 1e-12 || Math.abs(cub(Math.PI / 2)) > 1e-12) throw new Error('common Fermi point at π/2');
}

function plot(a, b, X0 = 80, X1 = 660, Y0 = 232, U = 56, top = 92, bottom = 372) {
  const x = k => X0 + k / Math.PI * (X1 - X0), y = e => Y0 - e * U;
  const clip = `<clipPath id="ccb-frame"><rect x="${X0}" y="${top}" width="${X1 - X0}" height="${bottom - top}"/></clipPath>`;
  let s = `<defs>${clip}</defs>`;
  s += `<rect x="${f(x(Math.PI / 2))}" y="${top}" width="${f(x(Math.PI) - x(Math.PI / 2))}" height="${bottom - top}" fill="${b}" fill-opacity=".10"/>`;
  s += `<path d="M${X0} ${Y0} H${X1}" stroke="${muted}" stroke-width="1.2" opacity=".55"/>`;
  s += `<path d="M${X0} ${top} V${bottom}" stroke="${muted}" stroke-width="1.2" opacity=".55"/>`;
  for (const [k, l] of [[0, '0'], [Math.PI / 2, 'π/2'], [Math.PI, 'π']]) s += `<path d="M${f(x(k))} ${Y0} v6" stroke="${muted}"/>` + text(f(x(k) + (k ? 0 : 10)), Y0 + 24, l, 15, dim, 'middle');
  s += text(X1, bottom + 22, 'wave number k →', 14, dim, 'end');
  s += text(X0 - 12, top + 14, 'energy', 14, dim, 'end');
  const curve = (g, c, dash) => {
    let d = '';
    for (let i = 0; i <= 400; i++) { const k = i / 400 * Math.PI; d += `${i ? 'L' : 'M'}${f(x(k))} ${f(y(g(k)))} `; }
    return `<path clip-path="url(#ccb-frame)" d="${d}" stroke="${c}" stroke-width="3.4" fill="none"${dash ? ' stroke-dasharray="10 6"' : ''}/>`;
  };
  s += curve(cub, b, true) + curve(hop, a, false);
  const fx = x(Math.PI / 2);
  // tangent of the hopping band at π/2: dε/dk = −2
  const T = 0.42, slope = -2;
  s += `<path d="M${f(x(Math.PI / 2 - T))} ${f(y(-slope * T))} L${f(x(Math.PI / 2 + T))} ${f(y(slope * T))}" stroke="${ink}" stroke-width="1.6" opacity=".8"/>`;
  s += `<path d="M${f(fx - 70)} ${Y0} H${f(fx + 70)}" stroke="${b}" stroke-width="5" opacity=".55"/>`;
  s += `<circle cx="${f(fx)}" cy="${Y0}" r="6.5" fill="${ink}" stroke="#14181c" stroke-width="1.5"/>`;
  s += text(f(fx - 30), Y0 + 52, 'nonzero speed v', 15, a, 'end', 'bold');
  s += text(f(fx + 16), Y0 - 12, 'flat: third-order zero', 15, b, 'start', 'bold');
  s += text(f(x(0.75 * Math.PI)), top + 22, 'same filled Fermi sea', 15.5, ink, 'middle', 'bold');
  s += text(f(x(0.75 * Math.PI)), top + 42, 'same ground state, same entanglement', 13, dim, 'middle');
  // leader anchors
  return { s, hopAt: [x(0.86 * Math.PI), y(hop(0.86 * Math.PI))], cubAt: [x(0.64 * Math.PI), y(cub(0.64 * Math.PI))] };
}

const draw = (a = colors[0], b = colors[1]) => {
  const p = plot(a, b);
  let s = text(48, 50, 'Same quantum state, different locked energy', 26, ink, 'start', 'bold');
  s += text(48, 76, 'the isolated half’s own energy band decides how much energy entanglement locks away', 15, dim);
  s += p.s;
  const L = 760;
  s += text(L, 150, 'cubic band (2 cos k)³', 16, b, 'start', 'bold');
  s += text(L, 182, 'locked energy ∝ S⁴/L³', 26, ink, 'start', 'bold');
  s += text(L, 206, 'smaller, a different power of L', 15, dim);
  s += text(L, 262, 'hopping band 2 cos k', 16, a, 'start', 'bold');
  s += text(L, 294, 'locked energy ∝ S²/L', 26, ink, 'start', 'bold');
  s += text(L, 318, 'coefficient 3v/(2πc)', 15, dim);
  s += `<path d="M${f(p.cubAt[0])} ${f(p.cubAt[1])} C${f(p.cubAt[0] + 120)} ${f(p.cubAt[1])} ${L - 80} 176 ${L - 10} 176" stroke="${b}" stroke-width="1.4" fill="none" opacity=".7"/>`;
  s += `<path d="M${f(p.hopAt[0])} ${f(p.hopAt[1])} C${f(p.hopAt[0] + 60)} ${f(p.hopAt[1])} ${L - 60} 288 ${L - 10} 288" stroke="${a}" stroke-width="1.4" fill="none" opacity=".7"/>`;
  s += text(1160, 388, 'Isolated half of a critical free-fermion chain · limits as L grows', 13.5, muted, 'end');
  return s;
};

const description = 'Banner for a paper on the bound energy of half a critical chain: the energy that entanglement locks into an isolated half and no operation on that half can extract. A single plot shows one-particle energy against wave number k from 0 to π for two exact bands: the hopping band 2 cos k (solid), which crosses zero at k = π/2 with nonzero slope, marked by a tangent line labelled nonzero speed v, and the cubic band (2 cos k)³ (dashed), which meets zero at the same point but flat, a third-order zero. The half from π/2 to π, where both bands are negative, is shaded once as the same filled Fermi sea: both chains have the same ground state and the same entanglement. Linked labels give the two conclusions: for the cubic band the locked energy is proportional to S⁴/L³, a smaller amount with a different power of L; for the hopping band it is proportional to S²/L with coefficient 3v/(2πc). Headline: same quantum state, different locked energy. Footer: isolated half of a critical free-fermion chain; limits as L grows.';

const thumbnailHero = () => {
  const X0 = 20, X1 = 410, Y0 = 100, U = 36, x = k => X0 + k / Math.PI * (X1 - X0), y = e => Y0 - e * U;
  let d = '', e = '';
  for (let i = 0; i <= 120; i++) { const k = i / 120 * Math.PI; d += `${i ? 'L' : 'M'}${f(x(k))} ${f(Math.max(4, Math.min(196, y(hop(k)))))} `; e += `${i ? 'L' : 'M'}${f(x(k))} ${f(Math.max(4, Math.min(196, y(cub(k)))))} `; }
  return `<div class="eq-label">TWO BANDS, ONE FERMI SEA</div>
  <svg viewBox="0 0 430 200" style="width:100%;height:200px" aria-label="Hopping band crossing zero with a slope and cubic band flat at the same Fermi point, sharing one shaded Fermi sea">
    <rect x="${f(x(Math.PI / 2))}" y="0" width="${f(x(Math.PI) - x(Math.PI / 2))}" height="200" fill="currentColor" opacity=".12"/>
    <path d="M${X0} ${Y0}H${X1}" stroke="currentColor" stroke-width="2" opacity=".6"/>
    <path d="${e}" fill="none" stroke="currentColor" stroke-width="3" stroke-dasharray="9 6" opacity=".75"/>
    <path d="${d}" fill="none" stroke="currentColor" stroke-width="5"/>
  </svg>
  <div class="eq"><span class="hl">S²/L</span> vs S⁴/L³</div>
  <div class="note">locked energy: hopping band vs flat cubic band</div>
  <div class="eq-foot">same ground state, same entanglement</div>`;
};

module.exports = { draw, colors, description, thumbnailHero };
