'use strict';
// Sharp Shannon window law banner. Left: the exact m -> infinity law of Theorem 2.1 of the
// paper at twofold oversampling (delta = pi/2, d = pi - delta): the decay rate per sample
// -(log E)/m equals beta/m below the corner beta = dm and beta/m - sqrt((beta/m)^2 - d^2)
// above it (polynomial factors omitted). The dashed line is the root-limsup rate of optimal
// pointwise linear recovery from the same 2m samples, 2 log cot(delta/4) (Theorem 2.9).
// Right: certified finite-m tuning penalties at twofold oversampling, 8 <= m <= 32
// (Table 9 / Section 13 of the paper). The curve is computed from the formula; no data are
// plotted on the left.
const ink = '#f4f1f8', muted = '#d6cbe0', curve = '#ffd36e', over = '#ff9f80', under = '#a9ebd3', rec = '#9fd0ff', dim = '#a597b4';
const text = (x, y, s, size = 18, color = ink, anchor = 'start', weight = 'normal', extra = '') =>
  `<text class="og-hide" x="${x}" y="${y}" fill="${color}" font-family="Arial,Helvetica,sans-serif" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}"${extra}>${s}</text>`;

const d = Math.PI / 2;                       // guard band at twofold oversampling
const rOpt = 2 * Math.log(1 / Math.tan(Math.PI / 8)); // 2 log cot(delta/4) at delta = pi/2
const X0 = 92, X1 = 640, Y0 = 314, Y1 = 92, BMAX = 3.1, RMAX = 2.0;
const px = b => X0 + (X1 - X0) * b / BMAX;
const py = r => Y0 - (Y0 - Y1) * r / RMAX;
const rate = b => (b <= d ? b : b - Math.sqrt(b * b - d * d));

function path(points) {
  return points.map(([b, r], i) => `${i ? 'L' : 'M'}${px(b).toFixed(1)} ${py(r).toFixed(1)}`).join(' ');
}

function draw() {
  let s = '<defs><marker id="sw-ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 Z" fill="' + muted + '"/></marker></defs>';
  s += text(44, 46, 'How fast the error falls depends sharply on the shape parameter β', 23, ink, 'start', 'bold');
  // axes
  s += `<path d="M${X0} ${Y1 - 14} V${Y0} H${X1 + 18}" stroke="${muted}" stroke-width="1.6" fill="none"/>`;
  for (const b of [1, 2, 3]) {
    s += `<path d="M${px(b).toFixed(1)} ${Y0} v6" stroke="${muted}" stroke-width="1.4"/>`;
    s += text(px(b).toFixed(1), Y0 + 22, String(b), 14, muted, 'middle');
  }
  s += text(X0, Y0 + 22, '0', 14, muted, 'middle');
  for (const r of [1, 2]) {
    s += `<path d="M${X0 - 6} ${py(r).toFixed(1)} h6" stroke="${muted}" stroke-width="1.4"/>`;
    s += text(X0 - 10, (py(r) + 5).toFixed(1), String(r), 14, muted, 'end');
  }
  s += text((X0 + X1) / 2, Y0 + 44, 'shape parameter per sample, β/m', 15, muted, 'middle');
  s += text(36, (Y0 + Y1) / 2, 'decay rate −(log E)/m', 15, muted, 'middle', 'normal', ` transform="rotate(-90 36 ${(Y0 + Y1) / 2})"`);
  // optimal linear recovery (dashed, higher)
  s += `<path d="M${X0} ${py(rOpt).toFixed(1)} H${X1}" stroke="${rec}" stroke-width="2.4" stroke-dasharray="9 7" fill="none"/>`;
  s += text(X1 - 4, py(rOpt) - 10, 'best linear recovery from the same samples: 2 log cot(δ/4) ≈ 1.76', 14, rec, 'end', 'bold');
  // the law: under-tuned branch (linear) and over-tuned branch (square-root drop)
  const left = [], right = [];
  for (let i = 0; i <= 60; i++) left.push([d * i / 60, rate(d * i / 60)]);
  for (let i = 0; i <= 400; i++) { const t = i / 400; const b = d + (BMAX - d) * t * t; right.push([b, rate(b)]); }
  s += `<path d="${path(left)}" stroke="${under}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
  s += `<path d="${path(right)}" stroke="${over}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
  // the corner
  s += `<path d="M${px(d).toFixed(1)} ${py(d).toFixed(1)} V${Y0}" stroke="${curve}" stroke-width="1.4" stroke-dasharray="3 5"/>`;
  s += `<circle cx="${px(d).toFixed(1)}" cy="${py(d).toFixed(1)}" r="7" fill="${curve}"/>`;
  s += text(px(d) + 12, py(d) + 26, 'β = dm: rate d = π − δ', 16, curve, 'start', 'bold');
  s += text(px(d).toFixed(1), Y0 + 22, 'd', 15, curve, 'middle', 'bold');
  s += text(px(0.55), py(0.28), 'under-tuned:', 15, under, 'start', 'bold');
  s += text(px(0.55), py(0.28) + 19, 'loses linearly', 15, under);
  s += text(px(2.2), py(1.16), 'over-tuned: loses like', 15, over, 'start', 'bold');
  s += text(px(2.2), py(1.16) + 19, 'a square root, so far', 15, over);
  s += text(px(2.2), py(1.16) + 38, 'faster near the corner', 15, over);
  // right: certified finite-m penalties
  const RX = 724;
  s += `<path d="M${RX - 24} 92 V350" stroke="${muted}" stroke-opacity=".22"/>`;
  s += text(RX, 104, 'Twofold oversampling, 8 ≤ m ≤ 32', 18, ink, 'start', 'bold');
  s += text(RX, 126, 'certified error ratios against β = dm', 15, muted);
  s += text(RX, 170, 'β one unit too high', 17, over, 'start', 'bold');
  s += text(RX, 196, 'sinh window: error × 10 to 670', 16, ink);
  s += text(RX, 220, 'Kaiser–Bessel: error × 3 to 220', 16, ink);
  s += text(RX, 264, 'β one unit too low', 17, under, 'start', 'bold');
  s += text(RX, 290, 'either window: error × 2.1 to 3.1', 16, ink);
  s += text(RX, 334, 'If unsure, err low.', 18, curve, 'start', 'bold');
  s += text(44, 388, 'Left: the m → ∞ law of Theorem 2.1 at δ = π/2 (polynomial factors omitted) and the optimal-recovery rate of Theorem 2.9 · right: certified values from Table 9', 13, dim);
  return s;
}
const description = 'Banner for the sharp shape-parameter law of windowed Shannon sampling. Left: a plot of the error decay rate per sample, minus log E divided by m, against the shape parameter per sample, beta over m, at twofold oversampling (delta = pi/2). The rate rises in a straight line while beta is below dm (under-tuned), reaches its peak d = pi minus delta at the sharp corner beta = dm, and then drops with a vertical tangent, like a square root, when beta is above dm (over-tuned). A dashed horizontal line higher up marks 2 log cot(delta/4), about 1.76, the root-limsup rate of the best pointwise linear recovery from the same samples, which neither window reaches. Right: certified error ratios at twofold oversampling for 8 to 32 samples per side: one unit too high multiplies the error by 10 to 670 for the sinh window and 3 to 220 for the Kaiser–Bessel window; one unit too low multiplies it by only 2.1 to 3.1; so if unsure, err low. Based on Theorems 2.1 and 2.9 and Table 9 of the paper; polynomial factors are omitted from the left plot.';
module.exports = { draw, description };
