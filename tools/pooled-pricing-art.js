'use strict';
const { bannerSvg } = require('./svg-xml');
// Small samples do not make pooled pricing safe: banner, OG card and thumbnail.
// Sources (paper of 31 Oct 2026, doi:10.5281/zenodo.23838042):
//  - Eqs. (6)-(10): low-valuation law L_a with revenue r_a(p) = a p(1-p)/(a+p); high law H with
//    revenue r_H(p) = p - p^2/2 - p^3/2. Panels A and B evaluate these formulas exactly (a = 0.05).
//  - Lemma 3: when one high value V exceeds n times the largest low value, pooled ERM posts V.
//  - Section 4 / exploration/explore_moderate.json: simulated relative gain of two-market over pooled
//    ERM for (a, q) = (0.01, 0.02) and (0.05, 0.02), n = 3..40 (values copied from that record).
// Usage: node tools/pooled-pricing-art.js [--render OUTDIR_FOR_INSPECTION] [--no-mirror]
const SLUG = 'pooled-pricing-small-samples';
const ink = '#f7f2ea', muted = '#e3d8c8', dim = '#c9b9a3';
const LOW = '#9fd8ff', HIGH = '#ffb36b', SIM = '#c9a6ff';
const SANS = 'Arial,Helvetica,sans-serif', SERIF = 'Georgia,serif';
const text = (x, y, s, size = 18, color = ink, anchor = 'start', weight = 'normal', family = SANS) =>
  `<text class="og-hide" x="${x}" y="${y}" fill="${color}" font-family="${family}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}">${s}</text>`;
const f = v => (+v).toFixed(1);
const A = 0.05;
const rLow = p => A * p * (1 - p) / (A + p);
const rHigh = p => p - p * p / 2 - p * p * p / 2;
const argmax = r => { let b = 0, v = -1; for (let i = 1; i < 2000; i++) { const p = i / 2000; if (r(p) > v) { v = r(p); b = p; } } return [b, v]; };
const [pL, vL] = argmax(rLow), [pH, vH] = argmax(rHigh);
const GAIN_001 = [0.01456, 0.02217, 0.02969, 0.03535, 0.04125, 0.04637, 0.05145, 0.05525, 0.05916, 0.06341, 0.06659, 0.07018, 0.07341, 0.07578, 0.07931, 0.08097, 0.08309, 0.08645, 0.08722, 0.08872, 0.09058, 0.09232, 0.0942, 0.09536, 0.09636, 0.09802, 0.09994, 0.09984, 0.10115, 0.10098, 0.1028, 0.10365, 0.10282, 0.10459, 0.10471, 0.10535, 0.10675, 0.10588];
const GAIN_005 = [0.01256, 0.01884, 0.02411, 0.0264, 0.02893, 0.03108, 0.03141, 0.03213, 0.03183, 0.03289, 0.03151, 0.0317, 0.02951, 0.02994, 0.02883, 0.02921, 0.02824, 0.02824, 0.0276, 0.02762, 0.02759, 0.02807, 0.02805, 0.02815, 0.02785, 0.02818, 0.02871, 0.02907, 0.02872, 0.02839, 0.02915, 0.02941, 0.02964, 0.02954, 0.03021, 0.03017, 0.03013, 0.03093];
const axes = (X0, X1, Y0, Y1) => `<path d="M${X0} ${Y1 - 6} V${Y0} H${X1 + 6}" fill="none" stroke="${muted}" stroke-opacity=".55" stroke-width="1.4"/>`;
const curve = (r, peak, X0, X1, Y0, Y1, color) => {
  const pts = []; for (let i = 0; i <= 200; i++) { const p = i / 200; pts.push(`${f(X0 + (X1 - X0) * p)} ${f(Y0 - (Y0 - Y1) * r(p) / peak)}`); }
  return `<path d="M${pts.join(' L')}" fill="none" stroke="${color}" stroke-width="4" stroke-linecap="round"/>`;
};

// Panel A: the two buyer groups want very different prices.
function panelA() {
  const X0 = 52, X1 = 352, Y0 = 330, Y1 = 178;
  let s = axes(X0, X1, Y0, Y1) + text(X0, 128, 'Two buyer groups, two best prices', 19, ink, 'start', 'bold');
  s += curve(rLow, vL, X0, X1, Y0, Y1, LOW) + curve(rHigh, vH, X0, X1, Y0, Y1, HIGH);
  s += `<circle cx="${f(X0 + (X1 - X0) * pL)}" cy="${Y1}" r="6" fill="${LOW}"/><circle cx="${f(X0 + (X1 - X0) * pH)}" cy="${Y1}" r="6" fill="${HIGH}"/>`;
  s += text(X0 + 2, Y1 - 12, 'many low-value buyers', 14, LOW, 'start');
  s += text(X1, Y1 - 30, 'rare high-value buyers', 14, HIGH, 'end');
  s += text(X1, Y0 + 24, 'price →', 13, dim, 'end');
  s += text(X0 + 4, Y0 + 24, 'revenue (scaled)', 13, dim);
  return s;
}

// Panel B: one high observation drags the pooled price.
function panelB() {
  const X0 = 450, X1 = 750, Y0 = 330, Y1 = 160, V = 0.7;
  const px = p => X0 + (X1 - X0) * p, py = v => Y0 - (Y0 - Y1) * v / vL;
  let s = axes(X0, X1, Y0, Y1) + text(X0, 128, 'One high value drags a pooled price', 19, ink, 'start', 'bold');
  s += curve(rLow, vL, X0, X1, Y0, Y1, LOW);
  s += `<circle cx="${f(px(pL))}" cy="${f(py(vL))}" r="6" fill="${LOW}"/><circle cx="${f(px(V))}" cy="${f(py(rLow(V)))}" r="7" fill="${HIGH}"/>`;
  s += `<path d="M${f(px(pL) + 12)} ${f(py(vL) + 4)} Q${f(px(0.45))} ${f(py(vL) - 10)} ${f(px(V) - 10)} ${f(py(rLow(V)) - 10)}" fill="none" stroke="${HIGH}" stroke-width="2.5" marker-end="url(#ppr-arrow)"/>`;
  s += text(f(px(pL) + 12), Y1 - 8, 'segmented price (peak)', 14, LOW, 'start');
  s += text(f(px(V) - 14), f(py(rLow(V)) + 26), 'pooled price ≈ V', 14, HIGH, 'end');
  s += text(f(px(V) - 14), f(py(rLow(V)) + 46), `low market earns ${Math.round(100 * (1 - rLow(V) / vL))}% less`, 14, HIGH, 'end');
  s += text(X1, Y0 + 24, 'price →', 13, dim, 'end');
  return s;
}

// Panel C: simulated relative gain of segmentation, n = 3..40.
function panelC() {
  const X0 = 850, X1 = 1150, Y0 = 330, Y1 = 160, M = 0.12;
  const px = n => X0 + (X1 - X0) * (n - 3) / 37, py = v => Y0 - (Y0 - Y1) * v / M;
  let s = axes(X0, X1, Y0, Y1) + text(X0, 128, 'Segmentation wins at every n', 19, ink, 'start', 'bold');
  for (const [g, c, lab] of [[GAIN_001, SIM, 'a = 0.01'], [GAIN_005, LOW, 'a = 0.05']]) {
    s += `<path d="M${g.map((v, i) => `${f(px(i + 3))} ${f(py(v))}`).join(' L')}" fill="none" stroke="${c}" stroke-width="3.5" stroke-linecap="round"/>`;
    s += text(X1 - 2, f(py(g[g.length - 1]) - 10), lab, 13, c, 'end');
  }
  s += `<path d="M${X0} ${Y0} H${X1}" stroke="${muted}" stroke-opacity=".8" stroke-width="1.5"/>`;
  s += text(X0 + 4, Y1 - 12, 'revenue gain (simulation, q = 0.02)', 13, dim);
  s += text(X0 + 4, f(py(0.1)), '10%', 12, dim);
  s += text(X1, Y0 + 24, 'sample size n = 3 … 40 →', 13, dim, 'end');
  return s;
}

const defs = `<defs><marker id="ppr-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="${HIGH}"/></marker></defs>`;
const draw = () => defs + text(40, 52, 'Small samples do not make pooled pricing safe', 30, ink, 'start', 'normal', SERIF) +
  text(40, 82, 'A rare high-value buyer in the sample can pull one pooled price far above what ordinary buyers will pay', 17, muted) +
  panelA() + panelB() + panelC();

const description = 'Banner for a paper showing that no window of small sample sizes guarantees that a single pooled empirical price beats separate prices per market. Left: exact revenue curves, scaled to equal height, for the paper’s low-valuation buyers (a truncated Lomax law with a = 0.05, best price about 0.18) and rare high-valuation buyers (best price about 0.55). Centre: the low market’s exact revenue curve; segmentation prices near its peak, while a pooled price pulled to one high observation V = 0.7 earns the low market less than half as much. Right: simulated relative revenue gain of two-market over pooled empirical pricing for sample sizes 3 to 40, for a = 0.01 and a = 0.05 with high-segment probability q = 0.02, from the release’s exploratory Monte Carlo record (unsmoothed model; simulation, not proof). The provable constructions in the paper use far more extreme parameters.';

function frame(inner, background) {
  return bannerSvg({ inner, description, background, glow: { color: HIGH, cx: '0.5', cy: '0.55', r: '0.4', opacity: '0.06' } });
}

const thumbSpec = {
  kicker: ['RESEARCH RELEASE · OCTOBER 2026', 'PRICING FROM DATA · COUNTEREXAMPLE'],
  head: ['Small samples,', '<em>no safe pooled price.</em>'], headSize: 66,
  sub: 'For every number of markets and every range of sample sizes, a regular demand model makes segmented pricing beat one pooled price.',
  tag: 'UNREFEREED CANDIDATE',
  hero: '<div class="eq-label">Theorem 1 · Corollary 4</div><div class="hero-title">Δₙ &gt; 0</div><div class="note">every n from 2 to N<br>every number of markets K<br><b>no dominance window</b></div><div class="eq-foot">written proofs · exact certificates</div>'
};

module.exports = { draw, description, thumbSpec };
if (require.main === module) require('./econ-release-render').render({ SLUG, frame, draw, thumbSpec,
  fallbackMeta: { title: 'Small samples do not make pooled pricing safe', status: 'unrefereed-candidate', datePublished: '2026-10-31' } });
