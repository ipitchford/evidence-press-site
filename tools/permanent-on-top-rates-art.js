'use strict';
// Banner for permanent-on-top-fixed-rank-rates (DOI 10.5281/zenodo.24550760).
// Sources (manuscript, 14 pages): Theorem 1.1, the sharp exponential base at fixed rank d,
// g_C(d) = e^{H_{d-1}}/d and g_R(d) = (2/d) exp{psi(d/2) - psi(1)}, g_R(1) = 1; g_C(2) = e/2, g_R(3) = e^2/6,
// g_R(2) = 1, both increasing to e^gamma; Theorem 1.2(b) e^gamma <= c* <= e^(1+gamma); Section 7, six standard
// polarisations at twelve photons give 62731/28800. Plotted values are results/verification.json constants.table.
const ink = '#f6f2ea', muted = '#d9d2c4', dim = '#bdb5a6';
const colors = ['#f6c177', '#8fd3c8'];
const SANS = 'Arial,Helvetica,sans-serif';
const f = v => (+v).toFixed(1);
const text = (x, y, s, size = 18, color = ink, anchor = 'start', weight = 'normal') =>
  `<text class="og-hide" x="${x}" y="${y}" fill="${color}" font-family="${SANS}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}">${s}</text>`;

const EG = Math.exp(0.5772156649015329);
const gC = d => { let h = 0; for (let k = 1; k < d; k++) h += 1 / k; return Math.exp(h) / d; };
// Table from results/verification.json (constants.table), d = 1..12.
const TABLE_R = [1.0, 1.0, 1.23150934982178, 1.35914091422952, 1.43919160951499, 1.49389635677935,
  1.53358684836611, 1.56367523798408, 1.58725989719548, 1.60623899921345, 1.62183904971079, 1.63488728658645];
const gR = d => TABLE_R[d - 1];
{
  if (Math.abs(gC(2) - Math.E / 2) > 1e-12) throw new Error('g_C(2) = e/2');
  if (Math.abs(gR(3) - Math.E * Math.E / 6) > 1e-12) throw new Error('g_R(3) = e^2/6');
  for (let t = 1; t <= 6; t++) if (Math.abs(gR(2 * t) - gC(t)) > 1e-12) throw new Error('g_R(2t) = g_C(t)');
  if (Math.abs(gC(6) - 1.63488728658645) > 1e-12) throw new Error('table');
}

function plot(a, b) {
  const X0 = 100, X1 = 590, Y0 = 318, Y1 = 112, DM = 12, VMIN = 0.9, VMAX = 1.85;
  const x = d => X0 + (d - 1) / (DM - 1) * (X1 - X0), y = v => Y0 - (v - VMIN) / (VMAX - VMIN) * (Y0 - Y1);
  let s = text(48, 44, 'How fast permanent-on-top fails at fixed rank', 23, ink, 'start', 'bold');
  s += text(48, 69, 'sharp base g(d): worst ratio ‖Π(A)‖ / per A grows like g(d)ⁿ (Theorem 1.1)', 14.5, dim);
  s += `<path d="M${X0} ${f(y(EG))} H${X1}" stroke="${ink}" stroke-width="1.6" stroke-dasharray="8 6" opacity=".85"/>`;
  s += text(X1, f(y(EG) - 9), 'ceiling e^γ ≈ 1.78', 15, ink, 'end', 'bold');
  s += `<path d="M${X0} ${f(y(1))} H${X1}" stroke="${muted}" stroke-width="1.2" opacity=".5"/>`;
  s += text(X1, f(y(1) + 19), '1 = no failure', 13.5, dim, 'end');
  s += `<path d="M${X0} ${Y0} H${X1} M${X0} ${Y0} V${Y1 - 6}" stroke="${muted}" stroke-width="1.2" fill="none"/>`;
  for (const d of [1, 2, 3, 4, 6, 8, 10, 12]) s += `<path d="M${f(x(d))} ${Y0} v5" stroke="${muted}"/>` + text(f(x(d)), Y0 + 21, String(d), 13, dim, 'middle');
  s += text(X1, Y0 + 42, 'rank d (dimension of the vectors) →', 13.5, dim, 'end');
  const series = (g, c) => {
    let p = '';
    for (let d = 1; d <= DM; d++) p += `${d > 1 ? 'L' : 'M'}${f(x(d))} ${f(y(g(d)))} `;
    let out = `<path d="${p}" stroke="${c}" stroke-width="2.4" fill="none" opacity=".75"/>`;
    for (let d = 1; d <= DM; d++) out += `<circle cx="${f(x(d))}" cy="${f(y(g(d)))}" r="5" fill="${c}" stroke="#14181c" stroke-width="1.5"/>`;
    return out;
  };
  s += series(gR, b) + series(gC, a);
  s += `<circle cx="${f(x(2))}" cy="${f(y(gC(2)))}" r="10" fill="none" stroke="${a}" stroke-width="2"/>`;
  s += `<path d="M${f(x(2) - 4)} ${f(y(gC(2)) - 11)} L${f(x(1.6))} ${f(y(1.68) + 6)}" stroke="${a}" stroke-width="1.2"/>`;
  s += text(X0 + 8, f(y(1.68)), 'complex, d = 2: e/2 ≈ 1.36', 15.5, a, 'start', 'bold');
  s += `<circle cx="${f(x(3))}" cy="${f(y(gR(3)))}" r="10" fill="none" stroke="${b}" stroke-width="2"/>`;
  s += text(f(x(3) + 16), f(y(gR(3)) + 5), 'real, d = 3: e²/6 ≈ 1.23', 15.5, b, 'start', 'bold');
  s += text(f(x(4.2)), f(y(1) - 9), 'real, d = 2: never fails', 13.5, b, 'start');
  s += text(f(x(8.2)), f(y(gR(8)) + 30), 'complex g_C(d)', 14.5, a, 'start', 'bold');
  s += text(f(x(8.2)), f(y(gR(8)) + 50), 'real g_R(d)', 14.5, b, 'start', 'bold');
  return s;
}

function photons(a) {
  const L = 676, cx = 800, cy = 210, r = 92;
  let s = text(L, 44, 'Bunching beyond identical photons', 23, ink, 'start', 'bold');
  s += text(L, 69, 'six standard polarisations (Section 7)', 14.5, dim);
  s += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#ffffff" fill-opacity=".04" stroke="${muted}" stroke-opacity=".55"/>`;
  s += `<ellipse cx="${cx}" cy="${cy}" rx="${r}" ry="${r * 0.32}" fill="none" stroke="${muted}" stroke-opacity=".35" stroke-dasharray="4 5"/>`;
  // Bloch sphere: H/V poles, D/A and R/L on the equator (schematic projection).
  const pts = [['H', cx, cy - r], ['V', cx, cy + r], ['D', cx - r, cy], ['A', cx + r, cy], ['R', cx - r * 0.42, cy + r * 0.3], ['L', cx + r * 0.42, cy - r * 0.3]];
  s += `<path d="M${cx} ${cy - r} V${cy + r} M${cx - r} ${cy} H${cx + r} M${f(cx - r * 0.42)} ${f(cy + r * 0.3)} L${f(cx + r * 0.42)} ${f(cy - r * 0.3)}" stroke="${muted}" stroke-opacity=".3"/>`;
  for (const [lab, px, py] of pts) {
    s += `<circle cx="${f(px)}" cy="${f(py)}" r="8" fill="${a}" stroke="#14181c" stroke-width="1.5"/>`;
    const dx = px < cx - 1 ? -14 : px > cx + 1 ? 14 : 0, dy = py < cy - 1 ? -12 : py > cy + 1 ? 24 : 5;
    s += text(f(px + dx), f(py + dy), lab, 15, ink, dx < 0 ? 'end' : dx > 0 ? 'start' : 'middle', 'bold');
  }
  s += text(cx, 352, 'twelve photons: 62731/28800 ≈ 2.18', 16, a, 'middle', 'bold');
  return s;
}

const draw = (a = colors[0], b = colors[1]) => plot(a, b) + photons(a) +
  `<path d="M640 30 V352" stroke="${muted}" stroke-opacity=".25"/>` +
  text(600, 388, 'General constant: e^γ ≤ c* ≤ e^(1+γ); whether c* equals e^γ is open · rates are asymptotic in n', 13.5, muted, 'middle');

const description = 'Banner for a paper on how far the permanent-on-top conjecture fails. Left: the sharp exponential base g(d) of the worst ratio between the largest eigenvalue of the Schur power and the permanent, plotted for rank d from 1 to 12 from the exact formulas of Theorem 1.1. Two increasing sequences of points: complex vectors g_C(d) and real vectors g_R(d), both approaching a dashed ceiling at e^γ ≈ 1.78; a faint line at 1 means no failure. Highlighted: complex rank two gives e/2 ≈ 1.36, real rank three gives e²/6 ≈ 1.23, and real rank two never fails. Right: the six standard photon polarisations H, V, D, A, R and L on a schematic Bloch sphere; with twelve photons the model bunching enhancement over identical photons is 62731/28800 ≈ 2.18. Footer: the general constant c* satisfies e^γ ≤ c* ≤ e^(1+γ), and whether it equals e^γ is open.';

const thumbnailHero = () => {
  const X0 = 30, X1 = 400, Y0 = 170, Y1 = 14, y = v => Y0 - (v - 0.9) / 0.95 * (Y0 - Y1);
  let d = '';
  for (let k = 1; k <= 12; k++) d += `${k > 1 ? 'L' : 'M'}${f(X0 + (k - 1) / 11 * (X1 - X0))} ${f(y(gC(k)))} `;
  return `<div class="eq-label">SHARP BASE AT FIXED RANK</div>
  <svg viewBox="0 0 430 190" style="width:100%;height:190px" aria-label="Sharp base rising with rank towards e^gamma">
    <path d="M${X0} ${f(y(EG))}H${X1}" stroke="currentColor" stroke-width="2" stroke-dasharray="8 6" opacity=".7"/>
    <path d="${d}" fill="none" stroke="currentColor" stroke-width="5"/>
    <path d="M${X0} ${Y0}H${X1}M${X0} ${Y0}V${Y1}" stroke="currentColor" stroke-width="2" opacity=".6"/>
  </svg>
  <div class="eq">base <span class="hl">e/2</span> at rank two</div>
  <div class="note">Rising to <b>e^γ ≈ 1.78</b></div>
  <div class="eq-foot">six polarisations, twelve photons: ≈ 2.18× bunching</div>`;
};

module.exports = { draw, colors, description, thumbnailHero };
