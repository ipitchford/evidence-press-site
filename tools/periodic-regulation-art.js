'use strict';
// Periodic regulation budget-monotonicity banner. Main panel: the optimal pulse sizes u_i at the
// five eligible dates of the paper's equal-price example (regulation_paths_data.json, key
// "equal_price", coefficients a = [.6,.4,.7,.5,.8], b = [.3,1.2,.7,.2,1.1], d = [1,3,.4,2,.8];
// SLSQP solutions Newton-polished on the KKT system) for budgets M1 = 2 and M2 = 8. The smaller
// budget's pulses sit inside the larger budget's pulses (Theorem 1.1 / Corollary 1.2: supports
// nested, no pulse shrinks). Dates are drawn evenly spaced: the example fixes the dates' order,
// not calendar positions. Inset: the exact unequal-price branch of Proposition 8.1 (key
// "weighted_price"), prices p1 = 5/2, p2 = 1, from B0 = (7/2) log(3/2) where u1 = u2 = log(3/2).
const ink = '#f2f5f8', muted = '#c9d6e0', dim = '#9fb1c0';
const small = '#ffc184', large = '#a9ebd3', p1c = '#9fd0ff', p2c = '#ff9f80';
const text = (x, y, s, size = 18, color = ink, anchor = 'start', weight = 'normal', extra = '') =>
  `<text class="og-hide" x="${x}" y="${y}" fill="${color}" font-family="Arial,Helvetica,sans-serif" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}"${extra}>${s}</text>`;
const f = v => v.toFixed(1);

// Exact values from equal_price.pulses at budgets[60] = 2 and budgets[240] = 8.
const M1 = 2, M2 = 8;
const U1 = [0.70766, 0.330027, 0, 0.962313, 0];
const U2 = [2.17959, 1.86299, 1.277255, 2.503566, 0.176599];
// Endpoints of weighted_price (pulse_1, pulse_2 against budgets), every 40th of 201 points.
const WB = [1.419127878, 1.461212, 1.503451, 1.545849, 1.588406, 1.631957918];

function draw() {
  let s = '';
  // ---- main panel: one year with five eligible dates
  const X0 = 70, X1 = 770, Y0 = 318, SC = 80; // SC px per unit of pulse mass
  const py = u => Y0 - SC * u;
  s += text(44, 46, 'More yearly budget: no pulse shrinks, none is removed', 24, ink, 'start', 'bold');
  // y axis
  s += `<path d="M${X0} ${f(py(2.75))} V${Y0} H${X1}" stroke="${muted}" stroke-width="1.5" fill="none"/>`;
  for (const u of [1, 2]) {
    s += `<path d="M${X0 - 6} ${f(py(u))} h6" stroke="${muted}" stroke-width="1.4"/>`;
    s += `<path d="M${X0} ${f(py(u))} H${X1}" stroke="${muted}" stroke-opacity=".12"/>`;
    s += text(X0 - 11, f(py(u) + 6), String(u), 16, muted, 'end');
  }
  s += text(X0 - 11, Y0 + 6, '0', 16, muted, 'end');
  s += text(X0, f(py(2.75) - 10), 'pulse uᵢ', 16, muted, 'middle');
  // year axis
  s += text((X0 + X1) / 2, Y0 + 52, 'one year · five permitted treatment dates (evenly drawn)', 16, dim, 'middle');
  const BW = 66, IW = 36;
  for (let i = 0; i < 5; i++) {
    const cx = X0 + (X1 - X0) * (0.1 + 0.2 * i);
    s += `<path d="M${f(cx)} ${Y0} v6" stroke="${muted}" stroke-width="1.4"/>`;
    s += text(f(cx), Y0 + 26, `date ${i + 1}`, 16, muted, 'middle');
    // larger budget: outlined, lighter, wider
    const h2 = SC * U2[i];
    s += `<rect x="${f(cx - BW / 2)}" y="${f(Y0 - h2)}" width="${BW}" height="${f(h2)}" rx="3" fill="${large}" fill-opacity=".16" stroke="${large}" stroke-width="2.4"/>`;
    // smaller budget: solid, nested inside
    if (U1[i] > 0) {
      const h1 = SC * U1[i];
      s += `<rect x="${f(cx - IW / 2)}" y="${f(Y0 - h1)}" width="${IW}" height="${f(h1)}" rx="2" fill="${small}"/>`;
    } else {
      s += `<path d="M${f(cx - IW / 2)} ${Y0 - 1.5} h${IW}" stroke="${small}" stroke-width="3"/>`;
    }
  }
  // annotate the dates that switch on only at the larger budget
  const c3 = X0 + (X1 - X0) * 0.5, c5 = X0 + (X1 - X0) * 0.9;
  s += text(f(c3), f(py(U2[2]) - 12), 'off at M₁, on at M₂', 15, large, 'middle', 'bold');
  s += text(f(c5), f(py(U2[4]) - 12), 'new at M₂', 15, large, 'middle', 'bold');
  // legend
  const LX = 104, LY = 80;
  s += `<rect x="${LX}" y="${LY - 14}" width="16" height="18" rx="2" fill="${small}"/>`;
  s += text(LX + 26, LY + 1, `budget M₁ = ${M1}`, 18, small, 'start', 'bold');
  s += `<rect x="${LX}" y="${LY + 16}" width="16" height="18" rx="2" fill="${large}" fill-opacity=".16" stroke="${large}" stroke-width="2"/>`;
  s += text(LX + 26, LY + 31, `budget M₂ = ${M2}: every pulse ≥, none removed`, 18, large, 'start', 'bold');

  // ---- inset: uneven price (Proposition 8.1)
  const IX = 836, IY = 72, IWd = 330, IH = 268;
  s += `<rect x="${IX}" y="${IY}" width="${IWd}" height="${IH}" rx="14" fill="#0b141c" fill-opacity=".42" stroke="${muted}" stroke-opacity=".3"/>`;
  s += text(IX + 18, IY + 32, 'Uneven price breaks it', 20, ink, 'start', 'bold');
  s += text(IX + 18, IY + 56, 'two pulses, prices p₁ = 5/2, p₂ = 1', 15, muted);
  const PX0 = IX + 52, PX1 = IX + IWd - 96, PY0 = IY + 206, PY1 = IY + 80;
  const bx = B => PX0 + (PX1 - PX0) * (B - WB[0]) / (WB[5] - WB[0]);
  const uy = u => PY0 - (PY0 - PY1) * (u - 0.36) / (0.50 - 0.36);
  s += `<path d="M${PX0} ${PY1 - 6} V${PY0} H${PX1 + 14}" stroke="${muted}" stroke-width="1.3" fill="none"/>`;
  const B = [1.419127878, 1.631957918], u1 = [0.4054651081, 0.4928972222], u2 = [0.4054651081, 0.399714863];
  s += `<path d="M${f(bx(B[0]))} ${f(uy(u1[0]))} L${f(bx(B[1]))} ${f(uy(u1[1]))}" stroke="${p1c}" stroke-width="3.4" stroke-linecap="round"/>`;
  s += `<path d="M${f(bx(B[0]))} ${f(uy(u2[0]))} L${f(bx(B[1]))} ${f(uy(u2[1]))}" stroke="${p2c}" stroke-width="3.4" stroke-linecap="round"/>`;
  s += `<circle cx="${f(bx(B[0]))}" cy="${f(uy(u1[0]))}" r="5" fill="${ink}"/>`;
  s += `<circle cx="${f(bx(B[1]))}" cy="${f(uy(u1[1]))}" r="4.5" fill="${p1c}"/>`;
  s += `<circle cx="${f(bx(B[1]))}" cy="${f(uy(u2[1]))}" r="4.5" fill="${p2c}"/>`;
  s += text(f(bx(B[1]) + 9), f(uy(u1[1]) + 6), 'u₁ ↑ 0.493', 16, p1c, 'start', 'bold');
  s += text(f(bx(B[1]) + 9), f(uy(u2[1]) + 6), 'u₂ ↓ 0.400', 16, p2c, 'start', 'bold');
  s += text(f(bx(B[0]) + 8), f(uy(u1[0]) + 24), 'both start at log 3/2 ≈ 0.405', 14, muted, 'start');
  s += text(f(PX0), PY0 + 20, 'B₀', 15, muted, 'middle');
  s += text(f(bx(B[1])), PY0 + 20, 'B₁', 15, muted, 'middle');
  s += text((PX0 + PX1) / 2, PY0 + 40, 'price-weighted budget B →', 14, muted, 'middle');

  s += text(44, 388, 'Left: computed optima of the paper’s five-date equal-price example (Theorem 1.1) · inset: exact branch of Proposition 8.1, B₁ = 1.15 B₀', 13, dim);
  return s;
}
const description = 'Banner for the budget-monotonicity theorem for Gavish and Katriel’s periodic regulation model. Main panel: one year with five permitted treatment dates, drawn evenly spaced. At each date a solid amber bar shows the optimal pulse for a yearly effort budget M1 = 2 and a wider outlined mint bar shows the optimal pulse for the larger budget M2 = 8; every amber bar sits inside its mint bar. Dates 3 and 5 receive no effort at M1 but positive effort at M2, so the set of treated dates grows and no pulse shrinks or is removed (Theorem 1.1 and Corollary 1.2). The pulse sizes are the paper’s computed optima for its five-date equal-price example: at M1 = 2 they are 0.71, 0.33, 0, 0.96 and 0; at M2 = 8 they are 2.18, 1.86, 1.28, 2.50 and 0.18. Inset: with uneven prices p1 = 5/2 and p2 = 1 (Proposition 8.1), starting from the price-weighted budget B0 = (7/2) log(3/2) where both pulses equal log(3/2), raising the budget by 15 percent raises pulse 1 to 0.493 while pulse 2 falls from 0.405 to 0.400, so monotonicity can fail with seasonal prices.';
module.exports = { draw, description };
