'use strict';
// Banner for complete-graph-reliability-zeros (DOI 10.5281/zenodo.24546697).
// Sources (manuscript): Theorem 8, innermost zeros at distance (2 log n − 1.392 + o(1))/n inside the unit circle, the
// constant −2(1 + log W_0) with Waldvogel's W_0 = 0.7377…; Theorem 9, directions ±2.393 rad (≈ ±137°); Theorem 10, the
// arc π/30 … 59π/30 carries 29/30 of the zeros. Data: the 78 nontrivial zeros of the reliability polynomial of K_14,
// the case drawn in the release's Figure 1 (code/plot_roots.py: zeros of the h-polynomial refined by Newton's method
// at 60 digits, each certified in its own disk), rounded to 4 decimals; upper half-plane listed, mirrored below.
const ink = '#f6f2ea', muted = '#d9d2c4', dim = '#bdb5a6';
const colors = ['#f6c177', '#8fd3c8'];
const SANS = 'Arial,Helvetica,sans-serif';
const f = v => (+v).toFixed(1);
const text = (x, y, s, size = 18, color = ink, anchor = 'start', weight = 'normal') =>
  `<text class="og-hide" x="${x}" y="${y}" fill="${color}" font-family="${SANS}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}">${s}</text>`;

const UPPER = [[0.8161, 0.2179], [0.7513, 0.2759], [0.7064, 0.3302], [0.6698, 0.3834], [0.635, 0.4353], [0.5956, 0.4855], [0.5472, 0.5319], [0.4966, 0.5656], [0.4509, 0.6001], [0.4039, 0.6267], [0.3538, 0.6567], [0.3054, 0.6826], [0.2505, 0.7019], [0.1914, 0.7164], [0.1376, 0.7247], [0.0881, 0.7353], [0.0345, 0.7371], [-0.0175, 0.7374], [-0.0758, 0.7329], [-0.1323, 0.7262], [-0.1879, 0.7113], [-0.2375, 0.696], [-0.2827, 0.684], [-0.3316, 0.6611], [-0.3757, 0.6359], [-0.4206, 0.6085], [-0.4625, 0.5706], [-0.503, 0.5314], [-0.5372, 0.4914], [-0.5741, 0.4553], [-0.6077, 0.4126], [-0.6366, 0.3646], [-0.6664, 0.3182], [-0.6912, 0.2647], [-0.7104, 0.2134], [-0.7301, 0.1675], [-0.743, 0.1323], [-0.7542, 0.0758], [-0.7561, 0.0247]];
const ZEROS = [...UPPER, ...UPPER.map(([x, y]) => [x, -y])];
const THETA = 2.393242274134895, W0 = 0.7377;
const mod = ([x, y]) => Math.hypot(x, y);
const INNER = UPPER.reduce((m, z) => (mod(z) < mod(m) ? z : m));
{
  if (ZEROS.length !== 78 || ZEROS.some(z => mod(z) >= 1)) throw new Error('78 zeros inside the unit disk');
  if (Math.abs(Math.atan2(INNER[1], INNER[0]) - THETA) > 0.02) throw new Error('innermost K14 zeros near ±2.393 rad');
  if (Math.abs(-2 * (1 + Math.log(W0)) + 1.392) > 1e-3) throw new Error('constant −2(1 + log W0)');
  if (Math.abs(THETA * 180 / Math.PI - 137.1) > 0.1) throw new Error('±137°');
}

const draw = (a = colors[0], b = colors[1]) => {
  let s = text(48, 50, 'Where the reliability zeros come closest to zero', 26, ink, 'start', 'bold');
  s += text(48, 76, 'zeros of the chance that a randomly thinned complete network stays connected, in the complex q-plane', 15, dim);
  const cx = 300, cy = 226, R = 128;
  const P = ([x, y]) => [cx + x * R, cy - y * R];
  s += `<path d="M${cx - R - 24} ${cy}H${cx + R + 24}M${cx} ${cy - R - 18}V${cy + R + 14}" stroke="${muted}" stroke-width="1" opacity=".45"/>`;
  s += `<circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="${muted}" stroke-width="1.6" opacity=".8"/>`;
  // excluded arc near q = 1: |arg q| < π/30
  const e = Math.PI / 30, ex = t => cx + (R + 9) * Math.cos(t), ey = t => cy - (R + 9) * Math.sin(t);
  s += `<path d="M${f(ex(-e))} ${f(ey(-e))}A${R + 9} ${R + 9} 0 0 0 ${f(ex(e))} ${f(ey(e))}" stroke="${dim}" stroke-width="5" fill="none" opacity=".5"/>`;
  for (const sg of [1, -1]) {
    const [x2, y2] = P([1.08 * Math.cos(THETA), sg * 1.08 * Math.sin(THETA)]);
    s += `<path d="M${cx} ${cy}L${f(x2)} ${f(y2)}" stroke="${a}" stroke-width="1.4" stroke-dasharray="5 4"/>`;
  }
  for (const z of ZEROS) { const [x, y] = P(z); s += `<circle cx="${f(x)}" cy="${f(y)}" r="3.4" fill="${b}"/>`; }
  for (const z of [INNER, [INNER[0], -INNER[1]]]) { const [x, y] = P(z); s += `<circle cx="${f(x)}" cy="${f(y)}" r="6" fill="${a}" stroke="#14181c" stroke-width="1.3"/>`; }
  s += `<circle cx="${cx + R}" cy="${cy}" r="5" fill="${ink}"/>`;
  s += text(cx + R + 16, cy + 22, 'q = 1', 13, dim);
  s += text(cx - R - 26, cy + 18, '−1', 13, dim, 'end');
  s += text(P([1.08 * Math.cos(THETA), 1.08 * Math.sin(THETA)])[0] - 6, P([0, 1.08 * Math.sin(THETA)])[1] - 8, '+137°', 14, a, 'end', 'bold');
  s += text(P([1.08 * Math.cos(THETA), 0])[0] - 6, cy + 1.08 * Math.sin(THETA) * R + 20, '−137°', 14, a, 'end', 'bold');
  s += text(cx, cy + R + 30, 'all 78 zeros of K₁₄ · unit circle', 13.5, dim, 'middle');
  const L = 560;
  s += text(L, 130, 'innermost zeros: two mirror directions', 17, a, 'start', 'bold');
  s += text(L, 154, 'near ±137° (±2.393 rad), not on the negative real axis', 14.5, ink);
  s += text(L, 206, 'distance inside the circle ≈ (2 log n − 1.392) / n', 22, ink, 'start', 'bold');
  s += text(L, 232, '−1.392 = −2(1 + log W₀), with Waldvogel’s W₀ = 0.7377…', 14.5, dim);
  s += text(L, 252, 'the smallest zero of the deformed exponential (1983)', 14.5, dim);
  s += text(L, 304, '29/30 of the zeros on an explicit curve', 17, b, 'start', 'bold');
  s += text(L, 328, 'the arc π/30 to 59π/30; the shaded sliver by q = 1 is left out', 14.5, dim);
  s += text(1160, 388, 'K₁₄ zeros computed with the release code · radius and directions are large-n limits', 13.5, muted, 'end');
  return s;
};

const description = 'Banner for a paper on the complex zeros of the reliability polynomial of the complete graph, the chance that a complete network stays connected when each link fails independently with probability q. Left: the complex q-plane with the unit circle and all 78 nontrivial zeros of K_14, computed with the release code, forming an oval inside the circle; the innermost pair is highlighted and dashed rays mark the limiting directions ±137 degrees (±2.393 radians), away from the negative real axis. A small shaded arc by q = 1 marks the sliver |arg q| < π/30 that the curve theorem leaves out. Right: three results. The innermost zeros approach two mirror directions near ±137 degrees; their distance inside the unit circle is about (2 log n − 1.392)/n, where −1.392 = −2(1 + log W_0) and W_0 = 0.7377… is Waldvogel’s 1983 constant, the smallest zero of the deformed exponential; and 29/30 of the zeros lie on an explicit curve over the arc from π/30 to 59π/30. Footer: the radius and directions are large-n limits.';

const thumbnailHero = () => {
  const cx = 215, cy = 100, R = 92;
  const dots = ZEROS.map(([x, y]) => `<circle cx="${f(cx + x * R)}" cy="${f(cy - y * R)}" r="2.6" fill="currentColor"/>`).join('');
  const ix = cx + INNER[0] * R, iy = cy - INNER[1] * R;
  return `<div class="eq-label">78 ZEROS OF K<sub>14</sub></div>
  <svg viewBox="0 0 430 200" style="width:100%;height:200px" aria-label="Reliability zeros of K14 inside the unit circle with the innermost pair near ±137 degrees">
    <circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="currentColor" stroke-width="2" opacity=".5"/>${dots}
    <circle cx="${f(ix)}" cy="${f(iy)}" r="7" fill="currentColor"/><circle cx="${f(ix)}" cy="${f(2 * cy - iy)}" r="7" fill="currentColor"/>
  </svg>
  <div class="eq">innermost at <span class="hl">±137°</span></div>
  <div class="note">(2 log n − 1.392)/n inside the circle</div>
  <div class="eq-foot">Waldvogel’s W₀ = 0.7377… sets the constant</div>`;
};

module.exports = { draw, colors, description, thumbnailHero };
