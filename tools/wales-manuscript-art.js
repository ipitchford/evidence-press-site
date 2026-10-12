'use strict';
/* Wales 20 mph companion manuscript banner.
   This image helps the reader understand that the published first-year fall depends on the
   data vintage (derived/vintage_reconciliation.csv: -28.18%, -26.10%, -24.18%) while the
   affected-road effect is not identified: with the same observed totals and the same affected-road
   policy count P1 = 1,000, the unobserved no-policy count P0 = 2,000, 1,000 or 500 gives
   -50%, 0% or +100% (derived/analysis.json, constructive_nonidentification_witness).
   Bar lengths are drawn to scale within each panel; the worlds are hypothetical. */
exports.description = 'Left: the same first-year comparison in three frozen official vintages, falls of 28.18, 26.10 and 24.18 per cent. Right: three hypothetical worlds share the observed totals 2,402 and 1,725 and an affected-road policy count of 1,000, but their unobserved no-policy counts of 2,000, 1,000 and 500 imply effects of minus 50, 0 and plus 100 per cent.';
exports.draw = function (a, b) {
  const ink = '#f4efe6', muted = '#cfc6b8';
  const t = (x, y, s, size = 18, c = ink, anchor = 'start', fam = 'Georgia,serif') =>
    `<text class="og-hide" x="${x}" y="${y}" text-anchor="${anchor}" font-family="${fam}" font-size="${size}" fill="${c}">${s}</text>`;
  const mono = 'ui-monospace,Menlo,monospace';
  let s = '';
  // Left panel: vintage ladder (scale: 10 px per percentage point)
  s += t(64, 64, 'ONE COMPARISON · THREE FROZEN VINTAGES', 15, muted, 'start', mono);
  const vint = [['Provisional figure', 28.18, '−28.18%'], ['StatsWales, current', 26.10, '−26.10%'], ['DfT rows, current', 24.18, '−24.18%']];
  vint.forEach(([label, v, txt], i) => {
    const y = 112 + i * 74, w = Math.round(v * 10);
    s += t(64, y, label, 19, ink);
    s += `<rect x="64" y="${y + 12}" width="${w}" height="22" rx="4" fill="${a}" fill-opacity="${i === 0 ? '.95' : '.6'}"/>`;
    s += t(64 + w + 12, y + 30, txt, 21, i === 0 ? a : ink);
  });
  s += t(64, 342, 'descriptive fall, first post-policy year', 14, muted, 'start', mono);
  s += t(64, 362, 'vs the preceding four quarters', 14, muted, 'start', mono);
  s += `<path d="M 470 72 V 360" stroke="${muted}" stroke-opacity=".25"/>`;
  // Right panel: witness, scale 0.13 px per casualty
  s += t(510, 64, 'SAME OBSERVED TOTALS 2,402 → 1,725 · AFFECTED ROADS', 15, muted, 'start', mono);
  const worlds = [['B', 2000, '−50%', b], ['A', 1000, '0%', ink], ['C', 500, '+100%', a]];
  const k = 0.13, x0 = 640;
  worlds.forEach(([id, p0, eff, c], i) => {
    const y = 104 + i * 80;
    s += t(510, y + 24, 'World ' + id, 19, ink);
    s += `<rect x="${x0}" y="${y}" width="${Math.round(1000 * k)}" height="18" rx="3" fill="${ink}" fill-opacity=".85"/>`;
    s += `<rect x="${x0}" y="${y + 24}" width="${Math.round(p0 * k)}" height="18" rx="3" fill="none" stroke="${c}" stroke-width="2.5" stroke-dasharray="6 4"/>`;
    s += t(x0 + Math.round(2000 * k) + 26, y + 32, eff, 30, c);
  });
  s += `<rect x="640" y="340" width="14" height="10" fill="${ink}" fill-opacity=".85"/>` + t(662, 350, 'with policy P1 = 1,000', 14, muted, 'start', mono);
  s += `<rect x="880" y="340" width="14" height="10" fill="none" stroke="${muted}" stroke-dasharray="4 3"/>` + t(902, 350, 'no-policy P0 (unobserved)', 14, muted, 'start', mono);
  s += t(1140, 378, 'hypothetical worlds · not estimates', 14, muted, 'end', mono);
  return s;
};
