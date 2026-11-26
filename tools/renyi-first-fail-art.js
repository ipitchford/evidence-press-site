'use strict';
// Banner for renyi-heat-first-failing-derivative (DOI 10.5281/zenodo.24549406).
// Source (manuscript; page summary items 1–4): no Rényi order keeps every sign under heat flow; every order fails by the
// sixth derivative. With Wu–Yu–Guo's positive results the first failing derivative is: 3 for orders up to 0.377;
// 4 from about 0.389 to 0.849 and at order 2; 5 from 0.93 to 1.19 and from 1.75 to 1.76; 3 between 2 and 3; 2 above 3
// (including order ∞). Elsewhere (0.377–0.389, 0.849–0.93, 1.19–1.75, 1.76–2) it is not pinned down here and is drawn
// as open. Collision entropy (order 2) keeps three signs and fails at the fourth.
const ink = '#f6f2ea', muted = '#d9d2c4', dim = '#bdb5a6';
const colors = ['#f6c177', '#8fd3c8'];
const SANS = 'Arial,Helvetica,sans-serif';
const f = v => (+v).toFixed(1);
const text = (x, y, s, size = 18, color = ink, anchor = 'start', weight = 'normal') =>
  `<text class="og-hide" x="${x}" y="${y}" fill="${color}" font-family="${SANS}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}">${s}</text>`;

// [from, to, first failing derivative]; to = Infinity means up to and including order ∞.
const KNOWN = [[0, 0.377, 3], [0.389, 0.849, 4], [0.93, 1.19, 5], [1.75, 1.76, 5], [2, 2, 4], [2, 3, 3], [3, Infinity, 2]];
const OPEN = [[0.377, 0.389], [0.849, 0.93], [1.19, 1.75], [1.76, 2]];
{
  const all = [...KNOWN.map(k => [k[0], k[1]]), ...OPEN].filter(([p, q]) => p < q).sort((u, v) => u[0] - v[0]);
  for (let i = 1; i < all.length; i++) if (Math.abs(all[i][0] - all[i - 1][1]) > 1e-12) throw new Error('order axis must be tiled without gaps');
  if (KNOWN.some(k => k[2] > 6)) throw new Error('every order fails by the sixth derivative');
}

const draw = (a = colors[0], b = colors[1]) => {
  let s = text(48, 50, 'No Rényi order survives the heat flow', 26, ink, 'start', 'bold');
  s += text(48, 76, 'the first time-derivative of Rényi entropy that can take the wrong sign, order by order', 15, dim);
  const X0 = 110, X1 = 1000, XI = 1060, Y0 = 330, U = 40;
  const lx = v => X0 + (Math.log10(v) + 1) / 2 * (X1 - X0);
  const x = v => (v === Infinity ? XI : v <= 0.1 ? X0 : lx(v));
  const y = k => Y0 - (k - 1) * U;
  // ceiling: by the sixth derivative
  s += `<path d="M${X0} ${y(6)}H${XI + 30}" stroke="${a}" stroke-width="1.6" stroke-dasharray="6 5"/>`;
  s += text(X0 + 6, y(6) - 8, 'every order has failed by the 6th derivative', 14, a, 'start', 'bold');
  for (let k = 2; k <= 6; k++) s += text(X0 - 12, y(k) + 5, `${k}${k === 2 ? 'nd' : k === 3 ? 'rd' : 'th'}`, 14, dim, 'end') + `<path d="M${X0} ${y(k)}H${XI + 30}" stroke="${muted}" stroke-width=".6" opacity=".2"/>`;
  for (const [p, q] of OPEN) {
    const x0 = x(p), x1 = x(q);
    s += `<rect x="${f(x0)}" y="${y(6)}" width="${f(Math.max(2, x1 - x0))}" height="${Y0 - y(6)}" fill="${muted}" opacity=".1"/>`;
  }
  for (const [p, q, k] of KNOWN) {
    const x0 = x(p), x1 = p === q ? x(p) + 8 : x(q), w = Math.max(5, x1 - x0) - (p === q ? 0 : 1.5);
    const col = k <= 3 ? b : a;
    s += `<rect x="${f(p === q ? x(p) - 4 : x0)}" y="${y(k)}" width="${f(w)}" height="${Y0 - y(k)}" fill="${col}" opacity="${0.35 + 0.1 * k}" rx="2"/>`;
  }
  s += `<path d="M${X0} ${Y0}H${XI + 30}" stroke="${ink}" stroke-width="2"/>`;
  for (const [v, l] of [[0.1, '0.1'], [0.377, '0.377'], [1, '1'], [2, '2'], [3, '3'], [10, '10'], [Infinity, '∞']]) s += `<path d="M${f(x(v))} ${Y0}v7" stroke="${ink}"/>` + text(f(x(v)), Y0 + 24, l, 14, dim, 'middle');
  s += text(f(x(1)), y(5) - 10, 'Shannon', 13.5, ink, 'middle', 'bold');
  s += text(f(x(2) + 6), y(4) - 10, 'collision entropy: 4th', 13.5, ink, 'start', 'bold');
  s += text(f(x(5)), y(2) - 10, 'above order 3: 2nd', 13.5, b, 'middle', 'bold');
  s += text(f(x(0.18)), y(3) - 10, 'up to 0.377: 3rd', 13.5, b, 'middle', 'bold');
  s += text(f(x(0.2)), y(6) + 22, 'light bands: not pinned down', 12.5, dim, 'middle');
  s += text(XI + 30, Y0 + 44, 'Rényi order α →', 13, dim, 'end');
  s += text(48, 388, 'Rényi entropy under Gaussian heat flow · log scale in the order · first wrong-signed derivative', 13.5, muted);
  return s;
};

const description = 'Banner for a paper on which Rényi entropies have alternating time derivatives under heat flow. A step chart plots, against the Rényi order α on a log scale from 0.1 to 10 with order ∞ at the right, the first derivative that can take the wrong sign: the 3rd for orders up to 0.377; the 4th from about 0.389 to 0.849 and at order 2, collision entropy; the 5th near Shannon entropy, from 0.93 to 1.19 and from 1.75 to 1.76; the 3rd between orders 2 and 3; and the 2nd above order 3, including ∞. Light bands mark the intervals where the first failing derivative is not pinned down. A dashed ceiling at the 6th derivative states that every order has failed by then, so no order keeps every sign. Footer: Rényi entropy under Gaussian heat flow.';

const thumbnailHero = () => {
  const X0 = 10, X1 = 380, XI = 412, lx = v => X0 + (Math.log10(v) + 1) / 2 * (X1 - X0);
  const x = v => (v === Infinity ? XI : v <= 0.1 ? X0 : lx(v)), y = k => 196 - (k - 1) * 36;
  const bars = KNOWN.map(([p, q, k]) => `<rect x="${f(p === q ? x(p) - 3 : x(p))}" y="${y(k)}" width="${f(Math.max(5, (p === q ? 6 : x(q) - x(p)) - 1))}" height="${196 - y(k)}" fill="currentColor" opacity="${0.3 + 0.12 * k}"/>`).join('');
  return `<div class="eq-label">FIRST FAILING DERIVATIVE, BY ORDER</div>
  <svg viewBox="0 0 430 200" style="width:100%;height:200px" aria-label="Step chart of the first failing derivative across Rényi orders, all at most six">
    <path d="M0 ${y(6)}H430" stroke="currentColor" stroke-width="2" stroke-dasharray="6 5" opacity=".6"/>${bars}
  </svg>
  <div class="eq">all fail by the <span class="hl">6th</span></div>
  <div class="note">collision entropy (order 2) fails at the 4th</div>
  <div class="eq-foot">2nd above order 3 · 5th near Shannon</div>`;
};

module.exports = { draw, colors, description, thumbnailHero };
