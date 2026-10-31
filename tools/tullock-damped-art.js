'use strict';
const { bannerSvg } = require('./svg-xml');
// Damped best responses in Tullock contests with no minimum effort: banner, OG card and thumbnail.
// Sources (paper of 31 Oct 2026, doi:10.5281/zenodo.23837648):
//  - Section 10 example: linear costs (z, 4z, 10z), equilibrium (4/25, 1/25, 0), s_3* = 1/5;
//    best response to rival total s with linear cost a is max(0, sqrt(s/a) - s);
//  - Theorem 1 / Lemma 4: rival totals s_i stay above a positive floor even when x_3 -> 0;
//  - Proposition 10 Example: costs (z, z, 10z), x0 = (1/4, 1/4, 1/10), harmonic steps:
//    player 3's effort is exactly 1/(10(k+1)) and regret is at least 3/(4(k+1)).
// All curves below are exact iterations of the paper's update rule (step 0.10), not schematics.
// Usage: node tools/tullock-damped-art.js [--render OUTDIR_FOR_INSPECTION] [--no-mirror]
const SLUG = 'tullock-damped-response-no-floor';
const ink = '#f7f2ea', muted = '#e3d8c8', dim = '#c9b9a3';
const P = ['#ffb36b', '#9fd8ff', '#f2a3b8'];
const SANS = 'Arial,Helvetica,sans-serif', SERIF = 'Georgia,serif';
const text = (x, y, s, size = 18, color = ink, anchor = 'start', weight = 'normal', family = SANS) =>
  `<text class="og-hide" x="${x}" y="${y}" fill="${color}" font-family="${family}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}">${s}</text>`;
const f = v => (+v).toFixed(1);
const br = (s, a) => Math.max(0, Math.sqrt(s / a) - s);

function simulate(costs, x0, step, K) {
  let x = x0.slice(); const xs = [x.slice()];
  for (let k = 0; k < K; k++) {
    const S = x.reduce((u, v) => u + v, 0);
    const y = x.map((xi, i) => br(S - xi, costs[i]));
    const a = step(k);
    x = x.map((xi, i) => (1 - a) * xi + a * y[i]);
    xs.push(x.slice());
  }
  return xs;
}
const RUN = simulate([1, 4, 10], [0.5, 0.01, 0.3], () => 0.10, 120);

function axes(X0, X1, Y0, Y1) {
  return `<path d="M${X0} ${Y1 - 6} V${Y0} H${X1 + 6}" fill="none" stroke="${muted}" stroke-opacity=".55" stroke-width="1.4"/>`;
}

// Panel A: individual efforts; player 3 withdraws.
function panelA() {
  const X0 = 52, X1 = 352, Y0 = 330, Y1 = 172, M = 0.5;
  const px = k => X0 + (X1 - X0) * k / 120, py = v => Y0 - (Y0 - Y1) * v / M;
  let s = axes(X0, X1, Y0, Y1) + text(X0, 128, 'Expensive player drops out', 19, ink, 'start', 'bold');
  for (let i = 0; i < 3; i++) {
    const pts = RUN.map((x, k) => `${f(px(k))} ${f(py(x[i]))}`);
    s += `<path d="M${pts.join(' L')}" fill="none" stroke="${P[i]}" stroke-width="3.5" stroke-linecap="round"/>`;
  }
  s += text(X1, Y1 + 6, 'cost 1 → 4/25', 14, P[0], 'end');
  s += text(X1, Y1 + 26, 'cost 4 → 1/25', 14, P[1], 'end');
  s += text(X1, Y1 + 46, 'cost 10 → 0 (withdraws)', 14, P[2], 'end');
  s += text(X1, Y0 + 24, 'iteration →', 13, dim, 'end');
  s += text(X0 + 4, Y1 - 16, 'effort', 13, dim);
  return s;
}

// Panel B: rival totals stay away from zero (log scale).
function panelB() {
  const X0 = 450, X1 = 750, Y0 = 330, Y1 = 172, L0 = -3, L1 = 0;
  const px = k => X0 + (X1 - X0) * k / 120, py = v => Y0 - (Y0 - Y1) * (Math.log10(v) - L0) / (L1 - L0);
  let s = axes(X0, X1, Y0, Y1) + text(X0, 128, 'Rivals never vanish together', 19, ink, 'start', 'bold');
  for (let i = 0; i < 3; i++) {
    const pts = RUN.map((x, k) => { const S = x.reduce((u, v) => u + v, 0); return `${f(px(k))} ${f(py(S - x[i]))}`; });
    s += `<path d="M${pts.join(' L')}" fill="none" stroke="${P[i]}" stroke-width="3.5" stroke-linecap="round"/>`;
  }
  s += text(X0 + 8, Y0 - 12, 'zero is never approached (Lemma 4)', 13, dim);
  s += text(X1 - 4, f(py(1 / 5) - 10), 'player 3 still faces 1/5', 14, P[2], 'end');
  s += text(X0 + 4, Y1 - 16, 'rival total sᵢ (log scale)', 13, dim);
  s += text(X1, Y0 + 24, 'iteration →', 13, dim, 'end');
  return s;
}

// Panel C: harmonic regret of order 1/k from a withdrawing player (Proposition 10 example).
function panelC() {
  const X0 = 850, X1 = 1150, Y0 = 330, Y1 = 172, K = 10000;
  const lx = k => X0 + (X1 - X0) * Math.log10(k) / 4, ly = v => Y0 - (Y0 - Y1) * (Math.log10(v) + 4.5) / 4.5;
  let s = axes(X0, X1, Y0, Y1) + text(X0, 128, 'Regret falls like 1/k', 19, ink, 'start', 'bold');
  const xs = simulate([1, 1, 10], [0.25, 0.25, 0.1], k => 1 / (k + 2), K);
  const pts = [];
  for (let j = 0; j <= 80; j++) {
    const k = Math.max(1, Math.round(Math.pow(10, 4 * j / 80))); const x = xs[k - 1]; const S = x[0] + x[1] + x[2];
    let V = 0; const c = [1, 1, 10];
    for (let i = 0; i < 3; i++) { const si = S - x[i], b = br(si, c[i]); V += (b / (b + si) - c[i] * b) - (x[i] / S - c[i] * x[i]); }
    pts.push(`${f(lx(k))} ${f(ly(Math.max(V, 1e-9)))}`);
  }
  s += `<path d="M${f(lx(1))} ${f(ly(0.75))} L${f(lx(K))} ${f(ly(0.75 / K))}" stroke="${dim}" stroke-width="1.8" stroke-dasharray="7 6"/>`;
  s += `<path d="M${pts.join(' L')}" fill="none" stroke="${P[0]}" stroke-width="4" stroke-linecap="round"/>`;
  s += text(X0 + 4, Y1 - 16, 'total regret (solid) vs proved floor 3/(4k) (dashed)', 13, dim);
  s += text(X1, Y0 + 24, 'iteration k (log) →', 13, dim, 'end');
  return s;
}

const draw = () => text(40, 52, 'Damped best responses converge with no minimum effort', 30, ink, 'start', 'normal', SERIF) +
  text(40, 82, 'Individual efforts may reach zero; every player’s combined rivals stay above a positive floor', 17, muted) +
  panelA() + panelB() + panelC();

const description = 'Banner for a paper proving that damped best responses in Tullock contests converge without a minimum-effort floor. Left: exact iterations of the update with step 0.10 for three players with linear costs 1, 4 and 10; efforts converge to 4/25, 1/25 and 0, so the most expensive player withdraws. Centre: on a logarithmic scale, each player’s rival total (the combined effort of the others) for the same run stays bounded away from zero; the withdrawing player still faces rival effort 1/5. Right: for the paper’s three-player example with harmonic steps, total regret plotted against iteration on log-log axes falls like 1/k and stays above the proved floor 3/(4k), because the withdrawing player’s effort decays exactly like 1/(10(k+1)). The curves are exact evaluations of the paper’s update rule. The proved floor in Lemma 4 is a much smaller explicit constant.';

function frame(inner, background) {
  return bannerSvg({ inner, description, background, glow: { color: P[0], cx: '0.5', cy: '0.55', r: '0.4', opacity: '0.06' } });
}

const thumbSpec = {
  kicker: ['RESEARCH RELEASE · OCTOBER 2026', 'GAME THEORY · LEARNING IN CONTESTS'],
  head: ['No minimum effort,', '<em>still converges.</em>'], headSize: 68,
  sub: 'Damped best responses in Tullock contests reach equilibrium even when expensive players drop out: rivals never vanish together.',
  tag: 'UNREFEREED CANDIDATE',
  hero: '<div class="eq-label">Theorem 1 · Lemma 4</div><div class="hero-title">sᵢ ≥ δ</div><div class="note">effort xᵢ may reach 0<br>rival total sᵢ stays positive<br><b>convergence, no floor</b></div><div class="eq-foot">written proofs · replayed checks</div>'
};

module.exports = { draw, description, thumbSpec };
if (require.main === module) require('./econ-release-render').render({ SLUG, frame, draw, thumbSpec,
  fallbackMeta: { title: 'Convergence of damped best responses in Tullock contests with no minimum effort', status: 'unrefereed-candidate', datePublished: '2026-10-31' } });
