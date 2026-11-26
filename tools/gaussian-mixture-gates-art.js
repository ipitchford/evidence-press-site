'use strict';
// Banner for gaussian-rkhs-arbitrary-noise-mixtures (DOI 10.5281/zenodo.24550034).
// Sources (manuscript, 21 pages): Corollary 6.1, the exact scalar threshold alpha <= 8q/(1+4q) for the
// Gaussian-bump gate e^(-alpha x^2) with branch variance q (Figure 1; q = 1/12, 1/4, 3/4 at alpha = 1/2, 1, 3/2;
// asymptote alpha -> 2); Corollary 6.2, probit gate Phi(beta x) admissible exactly when beta^2 <= 16q/(1+4q),
// logistic gate never (its continuation has poles at i*pi*(2k+1)); Theorem 2.1, no additive noise rescues a
// nonlinear drift. The curve is computed from the formula; the complex-plane panels are schematic.
const ink = '#f6f2ea', muted = '#d9d2c4', dim = '#bdb5a6';
const colors = ['#f6c177', '#8fd3c8'];
const cNever = '#f4a6a6';
const SANS = 'Arial,Helvetica,sans-serif';
const f = v => (+v).toFixed(1);
const text = (x, y, s, size = 18, color = ink, anchor = 'start', weight = 'normal', extra = '') =>
  `<text class="og-hide" x="${x}" y="${y}" fill="${color}" font-family="${SANS}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}"${extra}>${s}</text>`;

const bound = q => 8 * q / (1 + 4 * q);
{
  // Claim binding: the three marked points and the asymptote.
  if (Math.abs(bound(1 / 12) - 0.5) > 1e-12 || Math.abs(bound(0.25) - 1) > 1e-12 || Math.abs(bound(0.75) - 1.5) > 1e-12) throw new Error('art data');
  if (Math.abs(16 * 0.25 / 2 - 2 * bound(0.25)) > 1e-12) throw new Error('probit bound is twice the bump bound');
}

function plot(a) {
  const X0 = 112, X1 = 600, Y0 = 316, Y1 = 118, QM = 3, AM = 2.2;
  const x = q => X0 + q / QM * (X1 - X0), y = al => Y0 - al / AM * (Y0 - Y1);
  let s = text(48, 44, 'Which gates keep the kernel space?', 23, ink, 'start', 'bold');
  s += text(48, 69, 'bump gate e^(−αx²) on two Gaussian branches of variance q (Corollary 6.1)', 14.5, dim);
  let curve = '', area = `M${X0} ${Y0}`;
  const n = 240;
  for (let i = 0; i <= n; i++) {
    const q = QM * i / n;
    curve += `${i ? 'L' : 'M'}${f(x(q))} ${f(y(bound(q)))} `;
    area += ` L${f(x(q))} ${f(y(bound(q)))}`;
  }
  area += ` L${X1} ${Y0} Z`;
  s += `<path d="${area}" fill="${a}" fill-opacity=".22"/>`;
  s += `<path d="M${X0} ${f(y(2))} H${X1}" stroke="${muted}" stroke-width="1.2" stroke-dasharray="6 6" opacity=".7"/>`;
  s += `<path d="${curve}" stroke="${a}" stroke-width="3.4" fill="none" stroke-linejoin="round"/>`;
  s += `<path d="M${X0} ${Y0} H${X1} M${X0} ${Y0} V${Y1 - 6}" stroke="${muted}" stroke-width="1.2" fill="none"/>`;
  for (const q of [0, 1, 2, 3]) s += `<path d="M${f(x(q))} ${Y0} v5" stroke="${muted}"/>` + text(f(x(q)), Y0 + 21, String(q), 13, dim, 'middle');
  for (const al of [0, 1, 2]) s += `<path d="M${X0 - 5} ${f(y(al))} h5" stroke="${muted}"/>` + text(X0 - 10, f(y(al) + 4.5), String(al), 13, dim, 'end');
  s += text(X1, Y0 + 42, 'branch variance q →', 13.5, dim, 'end');
  s += text(X0 - 10, Y1 - 10, 'gate steepness α ↑', 13.5, dim, 'start');
  for (const [q, al, lab] of [[1 / 12, 0.5, '1/12'], [0.25, 1, '1/4'], [0.75, 1.5, '3/4']]) {
    s += `<path d="M${f(x(q))} ${f(y(al))} V${Y0}" stroke="${a}" stroke-width="1" stroke-dasharray="2 4" opacity=".8"/>`;
    s += `<circle cx="${f(x(q))}" cy="${f(y(al))}" r="5.5" fill="${a}" stroke="#14181c" stroke-width="1.5"/>`;
    s += text(f(x(q) + 12), f(y(al) + 22), `q = ${lab}`, 13.5, a, 'start', 'bold');
  }
  s += text(f(x(1.9)), f(y(0.95)), 'admissible', 21, ink, 'middle', 'bold');
  s += text(f(x(1.9)), f(y(0.95) + 21), 'boundary included', 13.5, muted, 'middle');
  s += text(f(x(1.15)), f(y(2) - 8), 'too steep: unbounded', 15, cNever, 'middle') + text(X1, f(y(2) - 8), 'asymptote α = 2', 13.5, dim, 'end');
  s += text(f(x(2.15)), f(y(1.52)), 'α = 8q/(1+4q)', 18, a, 'middle', 'bold');
  return s;
}

function gates(b) {
  let s = '';
  const L = 672;
  s += text(L, 44, 'Probit can pass. Logistic never can.', 23, ink, 'start', 'bold');
  s += text(L, 69, 'what matters is the gate continued into the complex plane (Cor. 6.2)', 14.5, dim);
  // Two schematic complex planes: same frame, different singularity structure.
  const box = (y0, label) => {
    let g = `<rect x="${L}" y="${y0}" width="150" height="112" rx="6" fill="#ffffff" fill-opacity=".04" stroke="${muted}" stroke-opacity=".45"/>`;
    g += `<path d="M${L + 8} ${y0 + 56} H${L + 142} M${L + 75} ${y0 + 8} V${y0 + 104}" stroke="${muted}" stroke-width="1" opacity=".55"/>`;
    g += text(L + 142, y0 + 50, 'Re', 11.5, dim, 'end') + text(L + 81, y0 + 20, 'Im', 11.5, dim);
    g += text(L, y0 - 8, label, 15.5, ink, 'start', 'bold');
    return g;
  };
  // Probit: entire; growth along the imaginary direction shown as nested level bands.
  const yP = 108;
  s += box(yP, 'probit Φ(βx)');
  for (const [h, o] of [[46, .10], [34, .14], [22, .2], [10, .3]]) {
    s += `<rect x="${L + 10}" y="${yP + 56 - h}" width="130" height="${2 * h}" fill="${b}" fill-opacity="${o}"/>`;
  }
  s += text(L + 168, yP + 30, 'entire, no poles', 16, b, 'start', 'bold');
  s += text(L + 168, yP + 55, 'grows like e^(β²y²/2)', 15, ink);
  s += text(L + 168, yP + 82, 'passes exactly when', 15, muted);
  s += text(L + 168, yP + 104, 'β² ≤ 16q/(1+4q)', 17, b, 'start', 'bold');
  // Logistic: poles of 1/(1+e^(-x)) at i*pi*(2k+1).
  const yL = 258;
  s += box(yL, 'logistic 1/(1+e^(−x))');
  for (const k of [-1, 0]) {
    for (const yy of [yL + 56 - 22 * (2 * k + 1), yL + 56 + 22 * (2 * k + 1)]) {
      if (yy < yL + 10 || yy > yL + 102) continue;
      s += `<path d="M${L + 69} ${yy - 6} l12 12 m0 -12 l-12 12" stroke="${cNever}" stroke-width="2.6"/>`;
    }
  }
  s += text(L + 168, yL + 30, 'poles at ±iπ, ±3iπ, …', 16, cNever, 'start', 'bold');
  s += text(L + 168, yL + 55, 'no growth budget fits', 15, ink);
  s += text(L + 168, yL + 82, 'never admissible,', 15, muted);
  s += text(L + 168, yL + 104, 'at any kernel width', 17, cNever, 'start', 'bold');
  return s;
}

const draw = (a = colors[0], b = colors[1]) => plot(a) + gates(b) +
  `<path d="M640 30 V352" stroke="${muted}" stroke-opacity=".25"/>` +
  text(600, 388, 'Additive noise of any law never rescues a nonlinear drift (Theorem 2.1) · complex planes schematic', 13.5, muted, 'middle');

const description = 'Banner for a paper on which random transitions keep a Gaussian kernel space invariant. Left: the exact admissible region from Corollary 6.1 for a two-branch Gaussian mixture with a bump-shaped gate e^(−αx²), plotted from the formula α ≤ 8q/(1+4q) with the branch variance q from 0 to 3 on the horizontal axis and the gate steepness α on the vertical axis. The shaded region below the curve, boundary included, is admissible; above it the operator is unbounded. Marked points: q = 1/12 at α = 1/2, q = 1/4 at α = 1 and q = 3/4 at α = 3/2; the curve approaches α = 2 as q grows. Right: two schematic complex planes. A probit gate Φ(βx) is entire with Gaussian growth and passes exactly when β² ≤ 16q/(1+4q); a logistic gate has poles at ±iπ, ±3iπ and so on, and is never admissible. Footer: additive noise of any law never rescues a nonlinear drift (Theorem 2.1).';

const thumbnailHero = () => {
  const X0 = 30, X1 = 400, Y0 = 170, Y1 = 14;
  let d = '', area = `M${X0} ${Y0}`;
  for (let i = 0; i <= 120; i++) {
    const q = 3 * i / 120, px = X0 + q / 3 * (X1 - X0), py = Y0 - bound(q) / 2.2 * (Y0 - Y1);
    d += `${i ? 'L' : 'M'}${f(px)} ${f(py)} `; area += ` L${f(px)} ${f(py)}`;
  }
  area += ` L${X1} ${Y0} Z`;
  return `<div class="eq-label">EXACT GATE BOUNDARY</div>
  <svg viewBox="0 0 430 190" style="width:100%;height:190px" aria-label="Admissible region below alpha = 8q/(1+4q)">
    <path d="${area}" fill="currentColor" fill-opacity=".18"/>
    <path d="${d}" fill="none" stroke="currentColor" stroke-width="5"/>
    <path d="M${X0} ${Y0}H${X1}M${X0} ${Y0}V${Y1}" stroke="currentColor" stroke-width="2" opacity=".6"/>
    <text x="215" y="140" font-family="Arial,sans-serif" font-size="26" fill="currentColor" text-anchor="middle">admissible</text>
  </svg>
  <div class="eq">α ≤ <span class="hl">8q/(1+4q)</span></div>
  <div class="note">Probit gates can pass.<br><b>Logistic gates never can.</b></div>
  <div class="eq-foot">no additive noise rescues nonlinear drift</div>`;
};

module.exports = { draw, colors, description, thumbnailHero };
