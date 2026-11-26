'use strict';
// Banner for normalised-distance-laplacian-upper-edge (DOI 10.5281/zenodo.24540994).
// Source (manuscript, 16 pages): Theorem 1 and Figure 1 — sqrt(n)(2 − M_n) → 4/√3; near-extremal graphs are two
// dense halves joined by a path of (√3 + o(1))√n edges. With a joining path of s√n edges the scaled deficit is
// 2/s (pairs inside the ends) + 2s/3 (pairs between path and ends), minimised at s = √3 with value 4/√3 ≈ 2.309.
// Johnston–Tait's earlier construction gave 2√2 ≈ 2.828. Proposition 6: the trial eigenvector is +1 and −1 on the
// two blocks and 1 − 2z along the path (linear). The drawing is a schematic of that shape, not a computed graph.
const ink = '#f6f2ea', muted = '#d9d2c4', dim = '#bdb5a6';
const colors = ['#f6c177', '#8fd3c8'];
const SANS = 'Arial,Helvetica,sans-serif';
const f = v => (+v).toFixed(1);
const text = (x, y, s, size = 18, color = ink, anchor = 'start', weight = 'normal') =>
  `<text class="og-hide" x="${x}" y="${y}" fill="${color}" font-family="${SANS}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}">${s}</text>`;

const cost = s => 2 / s + 2 * s / 3;
const S = Math.sqrt(3), BEST = 4 / Math.sqrt(3), OLD = 2 * Math.SQRT2;
{
  if (Math.abs(cost(S) - BEST) > 1e-12) throw new Error('minimum of 2/s + 2s/3 is 4/√3 at s = √3');
  if (Math.abs(BEST - 2.3094) > 1e-4 || Math.abs(OLD - 2.8284) > 1e-4) throw new Error('constants');
}
const hex = c => [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16));
const mix = (a, b, t) => '#' + hex(a).map((v, i) => Math.round(v + (hex(b)[i] - v) * t).toString(16).padStart(2, '0')).join('');

function barbell(a, b) {
  const clique = (cx, cy, r, k, col) => {
    const pts = Array.from({ length: k }, (_, i) => [cx + r * Math.cos(2 * Math.PI * i / k + 0.3), cy + r * Math.sin(2 * Math.PI * i / k + 0.3)]);
    let s = '';
    for (let i = 0; i < k; i++) for (let j = i + 1; j < k; j++) s += `<path d="M${f(pts[i][0])} ${f(pts[i][1])}L${f(pts[j][0])} ${f(pts[j][1])}" stroke="${col}" stroke-width="1" opacity=".38"/>`;
    for (const p of pts) s += `<circle cx="${f(p[0])}" cy="${f(p[1])}" r="5.5" fill="${col}"/>`;
    return { s, pts };
  };
  const cy = 236, L = clique(118, cy, 62, 10, a), R = clique(492, cy, 62, 10, b);
  const x0 = 180, x1 = 430, m = 7;
  let s = L.s + R.s;
  const node = i => x0 + (x1 - x0) * i / (m + 1);
  s += `<path d="M${f(L.pts[0][0])} ${f(L.pts[0][1])}L${x0} ${cy}H${x1}L${f(R.pts[5][0])} ${f(R.pts[5][1])}" stroke="${muted}" stroke-width="2.2" fill="none" opacity=".85"/>`;
  for (let i = 1; i <= m; i++) s += `<circle cx="${f(node(i))}" cy="${cy}" r="6.5" fill="${mix(a, b, i / (m + 1))}" stroke="#14181c" stroke-width="1.2"/>`;
  // eigenvector profile above the path: +1 → −1 linearly
  const top = 112, Y = v => top + (1 - v) * 26;
  s += `<path d="M${f(118 - 50)} ${f(Y(1))}H${x0}L${x1} ${f(Y(-1))}H${f(492 + 50)}" stroke="${ink}" stroke-width="2.4" fill="none"/>`;
  s += `<path d="M68 ${f(Y(0))}H542" stroke="${muted}" stroke-width="1" stroke-dasharray="3 5" opacity=".6"/>`;
  s += text(66, Y(1) - 8, 'eigenvector +1', 14, a, 'start', 'bold');
  s += text(544, Y(-1) - 8, '−1', 14, b, 'end', 'bold');
  s += text(186, Y(0) + 22, 'falls linearly along the path', 13.5, dim);
  // path-length brace
  s += `<path d="M${x0} 272v8H${x1}v-8" stroke="${muted}" stroke-width="1.4" fill="none"/>`;
  s += text(305, 300, 'path of ≈ √(3n) links', 16, ink, 'middle', 'bold');
  s += text(118, 330, 'n/2 nodes, nearly complete', 13.5, dim, 'middle');
  s += text(492, 330, 'n/2 nodes, nearly complete', 13.5, dim, 'middle');
  return s;
}

function plot(a, b) {
  const X0 = 680, X1 = 1140, Y0 = 336, Yt = 128, s0 = 0.6, s1 = 4, v1 = 4;
  const x = s => X0 + (s - s0) / (s1 - s0) * (X1 - X0), y = v => Y0 - v / v1 * (Y0 - Yt);
  const curve = (g, col, w, dash) => {
    let d = '';
    for (let i = 0; i <= 300; i++) { const s = s0 + (s1 - s0) * i / 300, v = Math.min(g(s), v1 + 0.3); d += `${i ? 'L' : 'M'}${f(x(s))} ${f(Math.max(Yt - 8, y(v)))} `; }
    return `<path d="${d}" stroke="${col}" stroke-width="${w}" fill="none"${dash ? ` stroke-dasharray="${dash}"` : ''}/>`;
  };
  let s = `<path d="M${X0} ${Yt - 8}V${Y0}H${X1}" stroke="${muted}" stroke-width="1.2" fill="none" opacity=".6"/>`;
  s += `<path d="M${X0} ${f(y(OLD))}H${X1}" stroke="${muted}" stroke-width="1.2" stroke-dasharray="4 5" opacity=".75"/>`;
  s += text(x(2.4), y(OLD) - 8, 'earlier two-clique path: 2√2 ≈ 2.83', 13, dim, 'middle');
  s += curve(s => 2 / s, a, 2, '7 5') + curve(s => 2 * s / 3, b, 2, '7 5') + curve(cost, ink, 3.6);
  s += `<path d="M700 96h26" stroke="${a}" stroke-width="2" stroke-dasharray="7 5"/>` + text(732, 101, '2/s  pairs inside the ends', 13.5, a, 'start', 'bold');
  s += `<path d="M922 96h26" stroke="${b}" stroke-width="2" stroke-dasharray="7 5"/>` + text(954, 101, '2s/3  path to the ends', 13.5, b, 'start', 'bold');
  s += `<path d="M${f(x(S))} ${f(y(BEST))}V${Y0}" stroke="${ink}" stroke-width="1.2" stroke-dasharray="3 4" opacity=".7"/>`;
  s += `<circle cx="${f(x(S))}" cy="${f(y(BEST))}" r="7" fill="${ink}" stroke="#14181c" stroke-width="1.5"/>`;
  s += text(f(x(S) - 12), f(y(BEST) + 30), 'minimum 4/√3 ≈ 2.31', 18, ink, 'end', 'bold').replace('<text ', '<text stroke="#14181c" stroke-opacity=".7" stroke-width="6" paint-order="stroke" stroke-linejoin="round" ');
  s += text(f(x(S)), Y0 + 22, 's = √3', 15, ink, 'middle', 'bold');
  s += text(X1, Y0 + 22, 'path length s = links ÷ √n →', 13, dim, 'end');
  s += text(X0 - 10, Yt + 4, '√n × gap', 13, dim, 'end');
  return s;
}

const draw = (a = colors[0], b = colors[1]) => {
  let s = text(48, 50, 'How close to 2? A balance between two costs', 26, ink, 'start', 'bold');
  s += text(48, 76, 'best networks: two dense ends joined by one path; the gap below 2 is 4/√(3n) to first order', 15, dim);
  s += barbell(a, b) + plot(a, b);
  s += text(1160, 388, 'Largest eigenvalue of the normalised distance Laplacian · first order as n grows', 13.5, muted, 'end');
  return s;
};

const description = 'Banner for a paper on the largest eigenvalue of the normalised distance Laplacian. Left: a schematic of the best networks, two nearly complete clusters of n/2 nodes each joined by a path of about √(3n) links, with the extremal eigenvector drawn above it: +1 on one cluster, −1 on the other and falling linearly along the path. Right: the trade-off behind the constant. With a path of s√n links the scaled gap below 2 is 2/s from pairs inside the two ends (dashed, falling) plus 2s/3 from pairs between the path and the ends (dashed, rising); their sum is smallest at s = √3, where it equals 4/√3 ≈ 2.31, below the earlier construction’s 2√2 ≈ 2.83, drawn as a dotted line. Footer: first order as n grows.';

const thumbnailHero = () => {
  let d = '';
  for (let i = 0; i <= 120; i++) { const s = 0.5 + 3.5 * i / 120; d += `${i ? 'L' : 'M'}${f(10 + (s - 0.5) / 3.5 * 410)} ${f(Math.max(2, 190 - cost(s) / 4.2 * 180))} `; }
  const mx = 10 + (S - 0.5) / 3.5 * 410, my = 190 - BEST / 4.2 * 180, oy = 190 - OLD / 4.2 * 180;
  return `<div class="eq-label">TWO COSTS, ONE BALANCE</div>
  <svg viewBox="0 0 430 200" style="width:100%;height:200px" aria-label="The curve 2/s + 2s/3 with its minimum 4/√3 at s = √3, below the earlier 2√2 line">
    <path d="M10 ${f(oy)}H420" stroke="currentColor" stroke-width="2" stroke-dasharray="6 6" opacity=".5"/>
    <path d="${d}" fill="none" stroke="currentColor" stroke-width="5"/>
    <circle cx="${f(mx)}" cy="${f(my)}" r="9" fill="currentColor"/>
  </svg>
  <div class="eq">gap <span class="hl">4/√(3n)</span></div>
  <div class="note">was 2√2/√n · path of √(3n) links</div>
  <div class="eq-foot">first order · normalised distance Laplacian</div>`;
};

module.exports = { draw, colors, description, thumbnailHero };
