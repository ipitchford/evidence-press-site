'use strict';
// Source: Proposition 3 and Theorem 6 of the release (adverse family, epsilon = 1/10).
// Left: the exact worst-case map error F(b) over the single uncertain slope b, a bump of
// height 1/400 at b = 19/20, against the possible-winner envelope 4. Right: bisecting the
// coefficient box brings a certified bracket down onto the bump (values from the benchmark).
exports.description = 'Left panel: the exact squared map error as a function of one uncertain slope b in the adverse family, zero for b at most 0.9, rising to its maximum 1/400 at b = 19/20 and falling back to zero at b = 1; a dashed line far above marks the possible-winner envelope 4, which is 1600 times too large. Right panel: three rows show the coefficient box bisected into 8, 64 and 256 sub-boxes, with the certified upper bound falling from 1/16 to within 2.7 per cent and then 0.12 per cent of the true maximum, while the lower bound is attained by an explicit slope.';
exports.draw = (a, b) => {
  const white = '#faf7f2', muted = '#d4d9e2';
  const eps = 0.1;
  const F = x => { const d = 1 - x; if (d <= eps / 2) return d * d; if (d <= eps) return eps * d - d * d; return 0; };
  const X = x => 70 + (x - 0.84) / (1.0 - 0.84) * 450;      // b in [0.84, 1] -> px 70..520
  const Y = v => 338 - v / (eps * eps / 4) * 190;            // F in [0, 1/400] -> px 338..148
  let s = '<g font-family="Georgia,serif">';
  // axes
  s += `<path d="M${X(0.84)} 338H${X(1.0)}" stroke="${muted}" stroke-width="1.2" opacity=".6"/>`;
  s += `<path d="M${X(0.84)} 338V140" stroke="${muted}" stroke-width="1.2" opacity=".6"/>`;
  for (const t of [0.85, 0.9, 0.95, 1.0]) s += `<path d="M${X(t)} 338v6" stroke="${muted}"/><text class="og-hide" x="${X(t)}" y="364" text-anchor="middle" font-size="19" fill="${muted}">${t === 1 ? '1' : t}</text>`;
  s += `<text class="og-hide" x="${X(0.92)}" y="392" text-anchor="middle" font-size="20" fill="${muted}">uncertain slope b (box is [−1, 1])</text>`;
  // curve
  const pts = [];
  for (let i = 0; i <= 160; i++) { const x = 0.84 + i * (1.0 - 0.84) / 160; pts.push(`${X(x).toFixed(1)},${Y(F(x)).toFixed(1)}`); }
  s += `<polygon points="${X(0.84)},338 ${pts.join(' ')} ${X(1.0)},338" fill="${a}" fill-opacity=".14"/>`;
  s += `<polyline points="${pts.join(' ')}" fill="none" stroke="${a}" stroke-width="3.5" stroke-linejoin="round"/>`;
  s += `<circle cx="${X(0.95)}" cy="${Y(eps * eps / 4)}" r="6" fill="${a}" stroke="${white}" stroke-width="1.5"/>`;
  s += `<text class="og-hide" x="${X(0.95)}" y="${Y(eps * eps / 4) - 24}" text-anchor="middle" font-size="21" fill="${white}">exact maximum 1/400 at b = 19/20</text>`;
  s += `<text class="og-hide" x="${X(0.845)}" y="${Y(0) - 10}" font-size="19" fill="${muted}">F = 0 for b ≤ 0.9</text>`;
  // envelope, far above (axis break)
  s += `<path d="M${X(0.84)} 92H${X(1.0)}" stroke="${b}" stroke-width="3" stroke-dasharray="10 7"/>`;
  s += `<path d="M${X(0.84) - 6} 118l12 -8 -12 -8M${X(0.84) - 6} 112l12 -8 -12 -8" fill="none" stroke="${muted}" stroke-width="1.5" opacity=".8"/>`;
  s += `<text class="og-hide" x="${X(0.84) + 6}" y="80" font-size="21" fill="${b}">envelope B = 4: valid, but 1600× the maximum</text>`;
  s += `<text class="og-hide" x="${X(0.84)}" y="48" font-size="27" fill="${white}">How far can the map move?</text>`;
  // right panel: bisection rows
  const L = 640, R = 1130, mid = 0.95;
  const bx = v => L + (v + 1) / 2 * (R - L);
  s += `<text class="og-hide" x="${L}" y="48" font-size="27" fill="${white}">Bisect the box, keep certified brackets</text>`;
  const rows = [[8, 1 / 16, '8 sub-boxes', 'upper bound 1/16'], [64, 1 / 1024, '64 sub-boxes', 'within 2.7 %'], [256, 1 / 8192, '256 sub-boxes', 'within 0.12 %']];
  let y = 112;
  for (const [, half, label, note] of rows) {
    s += `<path d="M${bx(-1)} ${y}H${bx(1)}" stroke="${muted}" stroke-width="2" opacity=".55"/>`;
    for (const t of [-1, 0, 1]) s += `<path d="M${bx(t)} ${y - 7}v14" stroke="${muted}" opacity=".55"/>`;
    const w = Math.max(6, (bx(mid + half) - bx(mid - half)));
    s += `<rect x="${bx(mid) - w / 2}" y="${y - 11}" width="${w}" height="22" fill="${a}" fill-opacity=".9" rx="2"/>`;
    s += `<text class="og-hide" x="${L}" y="${y + 40}" font-size="20" fill="${white}">${label}</text>`;
    s += `<text class="og-hide" x="${R}" y="${y + 40}" text-anchor="end" font-size="20" fill="${b}">${note}</text>`;
    y += 78;
  }
  s += `<text class="og-hide" x="${bx(-1)}" y="${y - 6}" font-size="18" fill="${muted}">b = −1</text><text class="og-hide" x="${bx(1)}" y="${y - 6}" text-anchor="end" font-size="18" fill="${muted}">b = 1</text>`;
  s += `<text class="og-hide" x="${(L + R) / 2}" y="${y + 20}" text-anchor="middle" font-size="19" fill="${white}">lower bound attained by an explicit slope</text>`;
  s += `<text class="og-hide" x="${(L + R) / 2}" y="${y + 44}" text-anchor="middle" font-size="19" fill="${white}">upper bound valid at every budget</text>`;
  s += '</g>';
  return s;
};
