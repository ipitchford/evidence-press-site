'use strict';
// Banner for hidden-architecture-exact-signal (DOI 10.5281/zenodo.23721621).
// Sources (manuscript of 28 Oct 2026): Theorem 1 (V_3 = (19/20) log 20 at q = 1/20; the driven ring;
// Q_* with sigma = 2.773076657835...), Proposition 6 (2.7659977105..., five-state 2.7469854029...),
// Corollary 4 (floor (19/30) log 20 = 1.897297106584...), earlier certified floor 0.017568198744
// (Section 1, Evidence Press doi:10.5281/zenodo.23118474). All bar lengths are drawn from these values.
const ink = '#f4f1ea', muted = '#ddd5c6', dim = '#bfb6a6';
const cA = '#ffcf7a', cB = '#9fd3ff', cBar = '#a9ebd3', cRing = '#f2a3b8';
const SANS = 'Arial,Helvetica,sans-serif';
const text = (x, y, s, size = 18, color = ink, anchor = 'start', weight = 'normal') =>
  `<text class="og-hide" x="${x}" y="${y}" fill="${color}" font-family="${SANS}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}">${s}</text>`;
const V3 = 19 / 20 * Math.log(20), FLOOR = 19 / 30 * Math.log(20), OLD = 0.017568198744;
if (Math.abs(V3 - 2.845945659876) > 1e-9 || Math.abs(FLOOR - 1.897297106584) > 1e-9 || Math.abs(FLOOR / OLD - 108) > 0.5) throw new Error('art data');
const node = (x, y, label, c) => `<circle cx="${x}" cy="${y}" r="19" fill="${c}" fill-opacity=".9"/>` + text(x, y + 6, label, 15, '#1b1b1b', 'middle', 'bold');
const arrow = (x1, y1, x2, y2, c, w = 2) => {
  const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L;
  const sx = x1 + ux * 24, sy = y1 + uy * 24, ex = x2 - ux * 26, ey = y2 - uy * 26;
  return `<path d="M${sx.toFixed(1)} ${sy.toFixed(1)} L${ex.toFixed(1)} ${ey.toFixed(1)}" stroke="${c}" stroke-width="${w}" marker-end="url(#ha-arr)"/>`;
};
function left() {
  let s = `<defs><marker id="ha-arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="${muted}"/></marker></defs>`;
  s += text(34, 46, 'Two hidden mechanisms, one identical signal', 21, ink, 'start', 'bold');
  s += text(34, 70, 'only the label A or B is observed; at q = 1/20 both give exactly the same A/B process', 14, dim);
  // three-state driven ring
  const r = [[170, 140], [95, 280], [245, 280]];
  s += node(...r[0], 'A', cA) + node(...r[1], 'B₁', cB) + node(...r[2], 'B₂', cB);
  s += arrow(...r[0], ...r[2], muted, 2.4) + arrow(...r[2], ...r[1], muted, 2.4) + arrow(...r[1], ...r[0], muted, 2.4);
  s += text(170, 330, 'cheapest 3-state model:', 14, dim, 'middle');
  s += text(170, 350, 'the driven ring', 15, cRing, 'middle', 'bold');
  // four-state model
  const f = [[480, 135], [395, 230], [565, 230], [480, 300]];
  const line = (a, b) => `<path d="M${f[a][0]} ${f[a][1]} L${f[b][0]} ${f[b][1]}" stroke="${muted}" stroke-width="1.6"/>`;
  for (const [i, j] of [[0, 1], [0, 2], [0, 3], [1, 2], [2, 3]]) s += line(i, j);
  s += node(...f[0], 'A', cA) + node(...f[1], 'B₁', cB) + node(...f[2], 'B₂', cB) + node(...f[3], 'B₃', cB);
  s += text(470, 340, 'the 4-state model Q* (links only, rates omitted)', 12.5, dim, 'middle');
  s += text(480, 360, 'one extra hidden state', 15, cBar, 'middle', 'bold');
  s += text(318, 222, '=', 34, ink, 'middle', 'bold');
  s += text(318, 246, 'same', 12.5, muted, 'middle');
  s += text(318, 262, 'signal', 12.5, muted, 'middle');
  return s;
}
function right() {
  let s = '';
  const X0 = 650, X1 = 1110, VMAX = 3.0;
  s += text(X0 - 10, 46, '…but different minimum dissipation', 21, ink, 'start', 'bold');
  s += text(X0 - 10, 70, 'entropy production rate at q = 1/20 (exact certificates; Theorems 1, 5, Prop. 6)', 14, dim);
  const x = v => X0 + v / VMAX * (X1 - X0);
  const rows = [
    ['every 3-state model ≥', V3, '2.846', cRing],
    ['simple 4-state model', 2.773076657835, '2.773', cBar],
    ['improved 4-state', 2.7659977105, '2.766', cBar],
    ['5-state model', 2.7469854029, '2.747', cBar],
    ['floor, any hidden size', FLOOR, '1.897', cA],
    ['earlier certified floor', OLD, '0.018', dim],
  ];
  rows.forEach(([lab, v, num, c], i) => {
    const y = 100 + i * 41;
    s += text(X0, y + 4, lab, 13.5, muted);
    s += `<rect x="${X0}" y="${y + 10}" width="${Math.max(x(v) - X0, 2).toFixed(1)}" height="15" rx="3" fill="${c}" fill-opacity=".85"/>`;
    s += text((x(v) + 8).toFixed(1), y + 23, num, 13.5, c, 'start', 'bold');
  });
  s += text(X0 - 10, 368, 'The smallest model overstates the least possible cost;', 13.5, ink);
  s += text(X0 - 10, 386, 'the new floor is about 108× the earlier one. Exact 4-state minimum still open.', 13.5, ink);
  return s;
}
const draw = () => left() + right() + `<path d="M612 30 V380" stroke="${muted}" stroke-opacity=".25"/>`;
const description = 'Banner for a paper on hidden Markov models and dissipation. Left: two hidden mechanisms that produce exactly the same observed two-level signal, labelled A or B. One is the three-state driven ring A to B2 to B1 to A, the cheapest three-state model; the other is the paper’s four-state model Q*, with one extra hidden B state, whose links A–B1, A–B2, A–B3, B1–B2 and B2–B3 are shown without rates. Right: horizontal bars of entropy production rate at q = 1/20, from exact certificates: every three-state model at least 2.846; a simple four-state model 2.773; an improved four-state model 2.766; a five-state model 2.747; a lower bound valid for any hidden size 1.897; and the earlier certified floor 0.018, about 108 times smaller. The smallest model therefore overstates the least possible cost; the exact four-state minimum is still open.';
const thumbnailHero = () => '<div style="font-size:28px;letter-spacing:.06em;margin-bottom:22px">SAME SIGNAL, LESS HEAT</div><div style="font-size:60px;line-height:1.2">2.846 → 2.747</div><div style="font-size:30px;margin-top:10px">3 states → 5 states</div><div style="font-size:29px;margin-top:28px">new floor ≈ 108× the old one</div><div style="font-size:23px;margin-top:24px;opacity:.8">Exact certificates · AI-assisted<br>Unrefereed candidate</div>';
module.exports = { draw, description, thumbnailHero };
