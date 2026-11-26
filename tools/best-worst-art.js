'use strict';
// Banner for best-worst-voting-approval-winners (DOI 10.5281/zenodo.24547593).
// Source (manuscript; page "A small example you can check"): best–worst voting scores +1 for first place and −1 for last.
// One voter approves x and y. One ranking x y z gives (1, 0, −1): only x wins. Two sincere copies, x y z and y x z,
// give (1, 1, −2): both approval winners win and z loses. Theorem 5: for m candidates at most m − 1 copies of each
// ballot always suffice, and one voter can force that many; with four candidates the rule is (2, 1, 1, 0).
// Totals below are computed from the drawn ballots and checked.
const ink = '#f6f2ea', muted = '#d9d2c4', dim = '#bdb5a6';
const colors = ['#f6c177', '#8fd3c8'];
const SANS = 'Arial,Helvetica,sans-serif';
const text = (x, y, s, size = 18, color = ink, anchor = 'start', weight = 'normal') =>
  `<text class="og-hide" x="${x}" y="${y}" fill="${color}" font-family="${SANS}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}">${s}</text>`;

const SCORE = [1, 0, -1];
const tally = ballots => { const t = { x: 0, y: 0, z: 0 }; for (const r of ballots) r.forEach((c, i) => { t[c] += SCORE[i]; }); return t; };
const ONE = tally([['x', 'y', 'z']]), TWO = tally([['x', 'y', 'z'], ['y', 'x', 'z']]);
{
  if ([ONE.x, ONE.y, ONE.z].join() !== '1,0,-1') throw new Error('one copy');
  if ([TWO.x, TWO.y, TWO.z].join() !== '1,1,-2') throw new Error('two copies');
  // (2,1,1,0) is an affine image of best–worst (+1, 0, 0, −1): s ↦ s + 1
  if ([1, 0, 0, -1].map(v => v + 1).join() !== '2,1,1,0') throw new Error('(2,1,1,0)');
}
const sign = v => (v > 0 ? `+${v}` : v < 0 ? `−${-v}` : '0');

function ballot(x0, y0, order, a, b, label) {
  let s = `<rect x="${x0}" y="${y0}" width="150" height="200" rx="10" fill="#0e1216" fill-opacity=".35" stroke="${muted}" stroke-opacity=".45"/>`;
  s += text(x0 + 75, y0 - 12, label, 14, dim, 'middle');
  order.forEach((c, i) => {
    const y = y0 + 44 + i * 58, approved = c !== 'z';
    s += `<circle cx="${x0 + 40}" cy="${y - 7}" r="20" fill="${approved ? a : b}" opacity="${approved ? 1 : 0.65}"/>`;
    s += text(x0 + 40, y, c, 22, '#14181c', 'middle', 'bold');
    s += text(x0 + 118, y, sign(SCORE[i]), 22, i === 1 ? dim : ink, 'middle', 'bold');
  });
  return s;
}

const draw = (a = colors[0], b = colors[1]) => {
  let s = text(48, 50, 'Best–worst voting gives back the approval winners', 26, ink, 'start', 'bold');
  s += text(48, 76, '+1 for first place, −1 for last: one voter approves x and y, then ranks sincerely, twice', 15, dim);
  s += `<path d="M66 128v200" stroke="${a}" stroke-width="3"/>` + text(58, 228, 'approved: x, y', 13.5, a, 'middle', 'bold').replace('<text ', '<text transform="rotate(-90 58 228)" ');
  s += ballot(96, 126, ['x', 'y', 'z'], a, b, 'copy 1');
  s += ballot(276, 126, ['y', 'x', 'z'], a, b, 'copy 2');
  // totals
  const T = 500;
  s += `<path d="M${T - 46} 226h28" stroke="${muted}" stroke-width="2"/><path d="M${T - 18} 220l10 6-10 6z" fill="${muted}"/>`;
  [['x', TWO.x], ['y', TWO.y], ['z', TWO.z]].forEach(([c, v], i) => {
    const y = 170 + i * 58, win = v === Math.max(TWO.x, TWO.y, TWO.z);
    s += `<circle cx="${T + 22}" cy="${y - 7}" r="20" fill="${c === 'z' ? b : a}" opacity="${c === 'z' ? 0.65 : 1}"/>` + text(T + 22, y, c, 22, '#14181c', 'middle', 'bold');
    s += text(T + 66, y, sign(v), 26, ink, 'start', 'bold');
    if (win) s += text(T + 112, y, 'wins', 15, a, 'start', 'bold');
  });
  s += text(T + 22, 340, 'totals', 14, dim, 'middle');
  // comparison with a single copy
  const R = 790;
  s += `<path d="M${R - 30} 118V334" stroke="${muted}" opacity=".35"/>`;
  s += text(R, 136, 'with a single copy, x y z:', 15, ink, 'start', 'bold');
  s += text(R, 162, `x ${sign(ONE.x)}, y ${sign(ONE.y)}, z ${sign(ONE.z)}: only x wins`, 15, dim);
  s += text(R, 214, 'two sincere copies:', 15, ink, 'start', 'bold');
  s += text(R, 240, `x ${sign(TWO.x)}, y ${sign(TWO.y)}, z ${sign(TWO.z)}: exactly the approval winners`, 15, a);
  s += text(R, 292, 'theorem: with m candidates, at most', 15, ink, 'start', 'bold');
  s += text(R, 314, 'm − 1 copies of each ballot always suffice', 15, ink, 'start', 'bold');
  s += text(R, 336, 'with four candidates: the rule (2, 1, 1, 0)', 14, dim);
  s += text(1160, 388, 'Sincere rankings: approved candidates above the rest · worst case over every electorate', 13.5, muted, 'end');
  return s;
};

const description = 'Banner for a paper on recovering approval winners from ranked ballots. One voter approves candidates x and y, marked by a bracket. The ballot is counted twice, as two sincere rankings drawn as cards: copy 1 ranks x, y, z and copy 2 ranks y, x, z, with best–worst scores +1 for first, 0 for middle and −1 for last beside each place. An arrow leads to the totals: x +1, y +1 and z −2, so x and y both win, exactly the approval winners. A side note compares a single copy, x y z, which gives x +1, y 0, z −1 so that only x wins, and states the theorem: with m candidates at most m − 1 copies of each ballot always suffice; with four candidates this is the rule (2, 1, 1, 0). Footer: sincere rankings put approved candidates above the rest; the result holds in the worst case over every electorate.';

const thumbnailHero = () => `<div class="eq-label">+1 FIRST · −1 LAST · TWO COPIES</div>
  <div class="eq">x y z &nbsp;+&nbsp; y x z</div>
  <div class="hero-title">x <span class="hl">+1</span> · y <span class="hl">+1</span> · z −2</div>
  <div class="note">both approved candidates win; z loses</div>
  <div class="eq-foot">at most m − 1 copies always suffice</div>`;

module.exports = { draw, colors, description, thumbnailHero };
