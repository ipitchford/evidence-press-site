'use strict';
// Levy interval-QSD exponential moments and QSD restart banner.
// Centre: the centred (Esscher-tilted) QSD of the source model of Garcia et al. on (0, L), L = 48,
// from the exact four-mode finite-interval solution (fig_boundary_layers.py, centred_density),
// drawn as L x density against u = y/L, sampled at u = i/30. The bulk is the sine law (pi/2) sin(pi u)
// (Corollary 2.5(i)).
// Side panels: the two boundary layers, L^2 x density against distance to the end, from the limit
// of Theorem 2.3: (pi^2/2) m V(z) with V(z) = z + d (1 - e^{-a z}) for the source model
// (left: ascending ladder, d = 1/(4-eta) - 1/a_plus, a = a_plus; right: descending ladder,
// d = 1/(1+eta) - 1/a_minus, a = a_minus; constants from manuscript_constant_check.py), against the
// straight Brownian line (pi^2/2) z. C* = K_r(lambda*-eta)/K_l(eta) = 0.85014864899... (Theorem 2.2,
// Proposition 2.9(iv), certified enclosure).
// Right: idealised QSD restart, success probability p(B) = 1 - exp(-R* B e^{-eta L}) (Theorem 2.6,
// uniformly accurate in relative error), R* = 0.906104..., eta = 0.941150..., lambda* = 2, at L = 10;
// budget on a log scale. The corrected linear regime is B = O(e^{eta L}) (Corollary 2.7); the
// source's stated range B = o(e^{lambda* L}) extends far past saturation.
const ink = '#f2f5f8', muted = '#c9d6e0', dim = '#a9b8c6';
const bulkc = '#9fd0ff', leftc = '#ffc184', rightc = '#a9ebd3', brown = '#c9d6e0', satc = '#ffd36e';
const text = (x, y, s, size = 18, color = ink, anchor = 'start', weight = 'normal', extra = '') =>
  `<text class="og-hide" x="${x}" y="${y}" fill="${color}" font-family="Arial,Helvetica,sans-serif" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}"${extra}>${s}</text>`;
const f = v => (+v).toFixed(1);

// L x centred QSD density at u = i/30, L = 48 (exact finite-interval solution).
const BULK = [0, 0.171, 0.33, 0.487, 0.638, 0.782, 0.918, 1.044, 1.158, 1.261, 1.35, 1.424, 1.483, 1.525, 1.552, 1.561, 1.554, 1.53, 1.489, 1.432, 1.36, 1.272, 1.172, 1.058, 0.932, 0.797, 0.653, 0.501, 0.345, 0.184, 0];
const ETA = 0.9411500742761625, A_P = 4.426815493482411, A_M = 3.191415790587061;
const D_P = 1 / (4 - ETA) - 1 / A_P, D_M = 1 / (1 + ETA) - 1 / A_M;
const RSTAR = 0.9061044256808939, LAMBDA = 2, LL = 10;
const layer = (z, d, a) => Math.PI ** 2 / 2 * (z + d * (1 - Math.exp(-a * z)));

function draw() {
  let s = '';
  s += text(40, 44, 'Restarting from the quasi-stationary law: two thin edge layers set the constant', 24, ink, 'start', 'bold');

  // ---- centre: sine bulk on (0, L)
  const X0 = 262, X1 = 548, Y0 = 290, YT = 112;
  const ux = u => X0 + (X1 - X0) * u, vy = v => Y0 - (Y0 - YT) * v / 1.6;
  s += `<path d="M${X0 - 6} ${Y0} H${X1 + 6}" stroke="${muted}" stroke-width="1.6"/>`;
  s += `<path d="${BULK.map((v, i) => `${i ? 'L' : 'M'}${f(ux(i / 30))} ${f(vy(v))}`).join(' ')} Z" fill="${bulkc}" fill-opacity=".14" stroke="${bulkc}" stroke-width="3.2" stroke-linejoin="round"/>`;
  s += text(ux(0), Y0 + 22, '0', 15, muted, 'middle');
  s += text(ux(1), Y0 + 22, 'L', 15, muted, 'middle', 'bold');
  s += text(ux(0), Y0 + 40, 'floor', 13, dim, 'middle');
  s += text(ux(1), Y0 + 40, 'target', 13, dim, 'middle');
  s += text(ux(0.5), vy(0.78), 'bulk: sine law', 16, bulkc, 'middle', 'bold');
  s += text(ux(0.5), vy(0.62), '(π/2) sin(πy/L)', 15, bulkc, 'middle');
  s += text(ux(0.5), vy(1.6) - 22, 'tilted QSD on (0, L)', 15, muted, 'middle');
  // magnifier rings at the two ends
  for (const [u, c] of [[0.035, leftc], [0.965, rightc]]) s += `<circle cx="${f(ux(u))}" cy="${f(Y0 - 9)}" r="17" fill="none" stroke="${c}" stroke-width="2.2"/>`;

  // ---- side panels: the boundary layers
  const panel = (PX, side) => {
    const PW = 176, PY = 92, PH = 208, c = side === 'L' ? leftc : rightc;
    const d = side === 'L' ? D_P : D_M, a = side === 'L' ? A_P : A_M;
    let p = `<rect x="${PX}" y="${PY}" width="${PW}" height="${PH}" rx="12" fill="#0b141c" fill-opacity=".42" stroke="${c}" stroke-opacity=".55"/>`;
    const gx0 = PX + 22, gx1 = PX + PW - 14, gy0 = PY + PH - 46, gy1 = PY + 66, zmax = 1, vmax = 5.5;
    const zx = z => side === 'L' ? gx0 + (gx1 - gx0) * z / zmax : gx1 - (gx1 - gx0) * z / zmax;
    const yy = v => gy0 - (gy0 - gy1) * v / vmax;
    p += `<path d="M${gx0} ${gy0} H${gx1}" stroke="${muted}" stroke-width="1.2"/>`;
    const zs = Array.from({ length: 41 }, (_, i) => i * zmax / 40);
    p += `<path d="${zs.map((z, i) => `${i ? 'L' : 'M'}${f(zx(z))} ${f(yy(Math.PI ** 2 / 2 * z))}`).join(' ')}" stroke="${brown}" stroke-width="1.6" stroke-dasharray="5 4" fill="none"/>`;
    p += `<path d="${zs.map((z, i) => `${i ? 'L' : 'M'}${f(zx(z))} ${f(yy(layer(z, d, a)))}`).join(' ')}" stroke="${c}" stroke-width="3" fill="none"/>`;
    p += text(PX + PW / 2, PY + 22, side === 'L' ? 'left edge layer' : 'right edge layer', 15, c, 'middle', 'bold');
    p += text(PX + PW / 2, PY + 40, side === 'L' ? 'ascending ladder V₊' : 'descending ladder V₋', 13, muted, 'middle');
    p += text(side === "L" ? gx0 : gx1, PY + 62, "dashed: Brownian", 12, brown, side === "L" ? "start" : "end");
    p += text(PX + PW / 2, gy0 + 18, side === 'L' ? 'distance from 0 →' : '← distance from L', 12, dim, 'middle');
    p += text(PX + PW / 2, gy0 + 34, 'L² × density, zoomed', 12, dim, 'middle');
    return p;
  };
  s += panel(40, 'L');
  s += panel(586, 'R');
  // connectors from ring to panel
  s += `<path d="M${f(ux(0.035) - 17)} ${f(Y0 - 9)} L216 ${Y0 - 40}" stroke="${leftc}" stroke-opacity=".6" stroke-width="1.4"/>`;
  s += `<path d="M${f(ux(0.965) + 17)} ${f(Y0 - 9)} L586 ${Y0 - 40}" stroke="${rightc}" stroke-opacity=".6" stroke-width="1.4"/>`;
  // the constant
  s += text(405, 352, 'C* = (right layer) / (left layer) = 0.8501…', 18, ink, 'middle', 'bold');
  s += text(405, 375, 'not 1 as conjectured · Brownian motion has no layers: C* = 1', 14, muted, 'middle');

  // ---- right: restart success probability against budget
  const IX = 800, IY = 70, IW = 372, IH = 306;
  s += `<rect x="${IX}" y="${IY}" width="${IW}" height="${IH}" rx="14" fill="#0b141c" fill-opacity=".42" stroke="${muted}" stroke-opacity=".3"/>`;
  s += text(IX + 16, IY + 28, 'Idealised QSD restart', 18, ink, 'start', 'bold');
  s += text(IX + 16, IY + 48, 'chance of reaching L within budget B', 14, muted);
  const BX0 = IX + 44, BX1 = IX + IW - 18, BY0 = IY + IH - 62, BY1 = IY + 76;
  const lo = 1, hi = 9.4; // log10 B
  const bx = lb => BX0 + (BX1 - BX0) * (lb - lo) / (hi - lo);
  const py = p => BY0 - (BY0 - BY1) * p;
  const scale = Math.exp(ETA * LL) / RSTAR; // budget for one expected success
  const lbS = Math.log10(Math.exp(ETA * LL)), lbL = Math.log10(Math.exp(LAMBDA * LL));
  // corrected regime shading
  s += `<rect x="${f(BX0)}" y="${f(BY1 - 6)}" width="${f(bx(lbS + 0.5) - BX0)}" height="${f(BY0 - BY1 + 6)}" fill="${satc}" fill-opacity=".08"/>`;
  s += `<path d="M${BX0} ${BY1 - 8} V${BY0} H${BX1}" stroke="${muted}" stroke-width="1.3" fill="none"/>`;
  for (const p of [0, 0.5, 1]) s += text(BX0 - 7, f(py(p) + 5), String(p), 12, muted, 'end');
  const pts = Array.from({ length: 121 }, (_, i) => lo + (hi - lo) * i / 120);
  s += `<path d="${pts.map((lb, i) => `${i ? 'L' : 'M'}${f(bx(lb))} ${f(py(1 - Math.exp(-(10 ** lb) / scale)))}`).join(' ')}" stroke="${satc}" stroke-width="3.2" fill="none"/>`;
  for (const [lb, lab, c] of [[lbS, 'e^{ηL}', satc], [lbL, 'e^{λ*L}', dim]]) {
    s += `<path d="M${f(bx(lb))} ${BY0} v7" stroke="${c}" stroke-width="1.6"/>`;
    s += text(f(bx(lb)), BY0 + 22, lab.replace('e^{', 'e').replace('}', ''), 14, c, 'middle', 'bold');
  }
  // superscripts drawn as real text: replace with tspans
  s = s.replace(/>eηL</, '>e<tspan dy="-6" font-size="11">ηL</tspan><').replace(/>eλ\*L</, '>e<tspan dy="-6" font-size="11">λ*L</tspan><');
  s += text(f(bx(lbS) + 34), f(py(0.74)), 'saturates', 14, satc, 'start', 'bold');
  s += text(f(bx(lbS) + 34), f(py(0.74) + 17), 'at B ≈ e^ηL', 13, satc, 'start');
  s = s.replace('at B ≈ e^ηL', 'at B ~ e<tspan dy="-5" font-size="10">ηL</tspan>');
  // source's claimed range bracket
  const yb = BY0 + 40;
  s += `<path d="M${f(BX0)} ${yb} H${f(bx(lbL))}" stroke="${dim}" stroke-width="1.4" stroke-dasharray="4 4"/><path d="M${f(bx(lbL))} ${yb - 5} v10" stroke="${dim}" stroke-width="1.4"/>`;
  s += text(f(bx((lo + lbL) / 2)), yb - 6, 'source’s linear range: B up to o(e^λ*L)', 12, dim, 'middle');
  s = s.replace('o(e^λ*L)', 'o(e<tspan dy="-5" font-size="9">λ*L</tspan><tspan dy="5">)</tspan>');
  s += text(f(BX0 + 8), f(py(0.9)), 'corrected: B = O(e^ηL)', 12, ink, 'start');
  s = s.replace('B = O(e^ηL)', 'B = O(e<tspan dy="-5" font-size="9">ηL</tspan><tspan dy="5">)</tspan>');
  s += text(BX1, f(py(0.12)), 'budget B, log scale (L = 10)', 12, dim, 'end');
  return s;
}
const description = 'Banner for exact exponential moments of interval quasi-stationary laws and idealised restart. Centre: the Esscher-tilted quasi-stationary distribution of the source model of Garcia, Bermolen, Jonckheere and Shneer on the interval from the floor 0 to the target L, computed exactly for L = 48. Its bulk is the sine law (π/2) sin(πy/L). Two side panels zoom into the edges, plotting L² times the density against distance from each end: near 0 the curve follows the renewal function of the ascending ladder height, near L that of the descending ladder height, and both bend away from the straight line that Brownian motion would give. The constant in the conjectured moment growth is the ratio of a right-layer quantity to a left-layer quantity, C* = 0.8501…, not 1 as the ratio-one reading of the conjecture suggests; Brownian motion has no layers and gives exactly 1. Right: for idealised restart from the quasi-stationary law, the chance of reaching L within a simulated-time budget B, 1 − exp(−R* B e^(−ηL)) with R* = 0.906…, plotted for L = 10 on a logarithmic budget axis. The chance rises linearly and then saturates near B ~ e^(ηL); the corrected linear regime is B = O(e^(ηL)), while the source restart theorem stated a range up to o(e^(λ*L)), far beyond saturation.';
module.exports = { draw, description };
