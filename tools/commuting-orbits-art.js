'use strict';
// Banner for commuting-permutations-few-orbits (DOI 10.5281/zenodo.24541319).
// Sources (manuscript; page summary "Why two groups are special"): the one-orbit count carries the factor σ(n)/n,
// which is large when n has many small prime factors (factorials); the two-orbit log-concavity ratio has the
// one-orbit count in its denominator, so R_{ℓ,2}(m!) → 0 (Theorem 2.3) while R_{ℓ,k} > 1 for large n at fixed
// k >= 3 (Theorem 2.4). Proposition 2.9: certified failures at a 54-digit n (ℓ = 3, ≈ 1.45e53) and an 845-digit n
// (ℓ = 4). Theorem 2.5/Table 2: lim inf R_{3,3} ≈ 2.52 against the elementary bound 1.10. The spikes below are
// σ(n)/n computed exactly here for n <= 720; they illustrate the arithmetic factor, not log-concavity ratios.
const ink = '#f6f2ea', muted = '#d9d2c4', dim = '#bdb5a6';
const colors = ['#f6c177', '#8fd3c8'];
const SANS = 'Arial,Helvetica,sans-serif';
const f = v => (+v).toFixed(1);
const text = (x, y, s, size = 18, color = ink, anchor = 'start', weight = 'normal') =>
  `<text class="og-hide" x="${x}" y="${y}" fill="${color}" font-family="${SANS}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}">${s}</text>`;

const N = 720;
const sigma = (() => { const s = Array(N + 1).fill(0); for (let d = 1; d <= N; d++) for (let m = d; m <= N; m += d) s[m] += d; return s; })();
const ratio = n => sigma[n] / n;
{
  if (sigma[720] !== 2418 || sigma[120] !== 360 || sigma[24] !== 60) throw new Error('divisor sums');
  let best = 0; for (let n = 1; n <= N; n++) best = Math.max(best, ratio(n));
  if (best !== ratio(720)) throw new Error('720 = 6! has the largest σ(n)/n up to 720');
}

function spikes(a, b) {
  const X0 = 70, X1 = 690, Y0 = 336, top = 120, vmax = 3.5;
  const x = n => X0 + (n - 1) / (N - 1) * (X1 - X0), y = v => Y0 - (v - 1) / (vmax - 1) * (Y0 - top);
  let s = `<path d="M${X0} ${top - 6}V${Y0}H${X1 + 6}" stroke="${muted}" stroke-width="1.2" fill="none" opacity=".6"/>`;
  s += `<path d="M${X0} ${f(y(2))}H${X1}" stroke="${muted}" stroke-dasharray="3 5" opacity=".5"/>` + text(X0 + 4, y(2) - 6, 'σ(n)/n = 2 (abundant)', 12, dim);
  for (let n = 1; n <= N; n++) {
    const v = ratio(n), hot = v >= 2.6;
    s += `<path d="M${f(x(n))} ${Y0}V${f(y(v))}" stroke="${hot ? a : b}" stroke-width="${hot ? 1.6 : 0.8}" opacity="${hot ? 1 : 0.55}"/>`;
  }
  for (const [n, l] of [[24, '4! = 24'], [120, '5! = 120'], [720, '6! = 720']]) {
    s += `<circle cx="${f(x(n))}" cy="${f(y(ratio(n)))}" r="4.5" fill="${ink}"/>`;
    s += text(f(x(n) + (n === 720 ? -8 : 6)), f(y(ratio(n)) - 10), l, 13.5, ink, n === 720 ? 'end' : 'start', 'bold');
  }
  s += text(X0 - 8, top + 4, 'σ(n)/n', 13, dim, 'end');
  s += text(X0 - 8, Y0 + 4, '1', 13, dim, 'end');
  s += text(X1, Y0 + 22, 'n = 1 … 720 →', 13, dim, 'end');
  s += text(X0, Y0 + 22, 'sum of divisors ÷ n: the factor in the one-group count', 13, dim);
  return s;
}

const draw = (a = colors[0], b = colors[1]) => {
  let s = text(48, 50, 'Where log-concavity breaks: only at two groups', 26, ink, 'start', 'bold');
  s += text(48, 76, 'commuting shuffles counted by joint orbits; the two-group ratio divides by a count that spikes with σ(n)/n', 15, dim);
  s += spikes(a, b);
  const L = 760;
  s += `<path d="M${L - 22} 118V334" stroke="${muted}" opacity=".35"/>`;
  s += text(L, 132, 'k = 2 groups', 17, a, 'start', 'bold');
  s += text(L, 156, 'ratio → 0 along n = m!: fails in every rank', 14.5, ink);
  s += text(L, 178, 'first certified failure, 3 shuffles: a 54-digit n', 14, dim);
  s += text(L, 198, '4 shuffles: an 845-digit n', 14, dim);
  s += text(L, 246, 'k ≥ 3 groups', 17, b, 'start', 'bold');
  s += text(L, 270, 'holds once n is large', 14.5, ink);
  s += text(L, 300, 'lim inf ≈ 2.52', 24, ink, 'start', 'bold');
  s += text(L, 322, 'at 3 shuffles, 3 groups (bound was 1.10)', 14, dim);
  s += text(1160, 388, 'Spikes are exact divisor sums for small n; actual failures occur only at astronomically large n', 13.5, muted, 'end');
  return s;
};

const description = 'Banner for a paper on log-concavity of counts of commuting permutations sorted by their number of joint orbits. Left: a spike plot of σ(n)/n, the sum of the divisors of n divided by n, for every n from 1 to 720, computed exactly; the tallest spikes, highlighted, fall on numbers with many small prime factors, and the factorials 4! = 24, 5! = 120 and 6! = 720 are marked, 720 being the highest. A dotted line marks σ(n)/n = 2, the abundant numbers. This factor sits in the one-group count, which is the denominator of the two-group log-concavity ratio. Right: at two groups the ratio tends to zero along factorials, so log-concavity fails in every rank, with certified failures at a 54-digit n for three shuffles and an 845-digit n for four; at three or more groups it holds once n is large, with exact lim inf about 2.52 for three shuffles and three groups, where the elementary bound gave 1.10. Footer: the spikes are exact divisor sums for small n; actual failures occur only at astronomically large n.';

const thumbnailHero = () => {
  let d = '';
  for (let n = 1; n <= N; n += 1) { const xx = 6 + (n - 1) / (N - 1) * 418, yy = 196 - (ratio(n) - 1) / 2.5 * 186; d += `M${f(xx)} 196V${f(yy)}`; }
  return `<div class="eq-label">σ(n)/n FOR n ≤ 720</div>
  <svg viewBox="0 0 430 200" style="width:100%;height:200px" aria-label="Spikes of the divisor-sum ratio, tallest at factorials">
    <path d="${d}" stroke="currentColor" stroke-width="1" opacity=".8"/>
  </svg>
  <div class="eq">fails at <span class="hl">k = 2</span> only</div>
  <div class="note">54-digit failure with 3 shuffles · 845 digits with 4</div>
  <div class="eq-foot">holds at k ≥ 3 once n is large</div>`;
};

module.exports = { draw, colors, description, thumbnailHero };
