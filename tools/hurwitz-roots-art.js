'use strict';
// Banner for deformed-monotone-hurwitz-root-motion (DOI 10.5281/zenodo.24546686).
// Sources: coefficient lists h(μ; t) from the release's cut-and-join recursion (code/census.py, cut_join; genus 0–6),
// for the 4-cycle μ = (4) and three 2-cycles μ = (2,2,2). Page summary: the 4-cycle's smallest zero is −2.618, −2.215,
// −2.086, −2.036 at genus 0–3, approaching −2 from below. Limits −(d−2), …, −1/(d−2) (Accadia–Lewański–Ruzza);
// results/census.out: for (2,2,2) the zero with limit −3/2 moves away from genus 0 to 1 (Theorem 5.1), and only
// 8 of 132 profiles with 4–10 items ever move the wrong way, never after genus 2 (Theorem 5.2).
const ink = '#f6f2ea', muted = '#d9d2c4', dim = '#bdb5a6';
const colors = ['#f6c177', '#8fd3c8'];
const SANS = 'Arial,Helvetica,sans-serif';
const f = v => (+v).toFixed(1);
const text = (x, y, s, size = 18, color = ink, anchor = 'start', weight = 'normal') =>
  `<text class="og-hide" x="${x}" y="${y}" fill="${color}" font-family="${SANS}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}">${s}</text>`;

// Coefficients of t^1, t^2, … (the t^0 coefficient is 0), genus 0..6.
const C4 = [[1, 3, 1], [15, 40, 15], [161, 413, 161], [1555, 3930, 1555], [14421, 36223, 14421], [131495, 329420, 131495], [1190281, 2978433, 1190281]];
const C222 = [[56, 424, 768, 424, 56], [2688, 19128, 34416, 19128, 2688], [90552, 619728, 1104624, 619728, 90552],
  [2658656, 17760016, 31432800, 17760016, 2658656], [72960888, 480117912, 845729568, 480117912, 72960888],
  [1929467904, 12578774664, 22089979152, 12578774664, 1929467904], [49937404664, 323661362176, 567285862800, 323661362176, 49937404664]];
// Real zeros of sum c_i t^i (all zeros are real here: Theorem 5.2); Durand–Kerner on the monic polynomial.
function roots(c) {
  const n = c.length - 1, a = c.map(v => v / c[n]);
  let z = Array.from({ length: n }, (_, k) => [0.4 * Math.cos(2.4 * k + 0.3) - 1, 0.9 * Math.sin(2.4 * k + 0.3)]);
  const mulc = (p, q) => [p[0] * q[0] - p[1] * q[1], p[0] * q[1] + p[1] * q[0]];
  const divc = (p, q) => { const d = q[0] * q[0] + q[1] * q[1]; return [(p[0] * q[0] + p[1] * q[1]) / d, (p[1] * q[0] - p[0] * q[1]) / d]; };
  for (let it = 0; it < 500; it++) z = z.map((zi, i) => {
    let p = [1, 0]; for (let k = n - 1; k >= 0; k--) p = [mulc(p, zi)[0] + a[k], mulc(p, zi)[1]];
    let den = [1, 0]; z.forEach((zj, j) => { if (j !== i) den = mulc(den, [zi[0] - zj[0], zi[1] - zj[1]]); });
    const q = divc(p, den); return [zi[0] - q[0], zi[1] - q[1]];
  });
  if (z.some(v => Math.abs(v[1]) > 1e-7)) throw new Error('non-real zero');
  return z.map(v => v[0]).sort((x, y) => x - y);
}
const R4 = C4.map(roots), R222 = C222.map(roots);
{
  const want = [-2.618, -2.215, -2.086, -2.036];
  want.forEach((w, g) => { if (Math.abs(R4[g][0] - w) > 5e-4) throw new Error('4-cycle smallest zero at genus ' + g); });
  for (let g = 1; g < 7; g++) if (!(R4[g][0] > R4[g - 1][0] && R4[g][0] < -2)) throw new Error('climbs to −2 from below');
  if (!(R222[1][1] < R222[0][1] && R222[0][1] < -1.5)) throw new Error('(2,2,2) zero near −3/2 first moves away');
  for (let g = 2; g < 7; g++) if (!(R222[g][1] > R222[g - 1][1])) throw new Error('then returns towards −3/2');
}

function tracks(R, limits, X0, X1, lo, hi, top, a, b, hiIndex) {
  const x = t => X0 + (t - lo) / (hi - lo) * (X1 - X0), dy = 30, y = g => top + g * dy;
  let s = '';
  for (const L of limits) s += `<path d="M${f(x(L))} ${top - 14}V${top + 6 * dy + 12}" stroke="${muted}" stroke-dasharray="4 5" opacity=".7"/>`;
  for (let g = 0; g < R.length; g++) s += `<path d="M${X0} ${y(g)}H${X1}" stroke="${muted}" stroke-width=".6" opacity=".22"/>`;
  R[0].forEach((_, i) => {
    const pts = R.map((r, g) => [x(r[i]), y(g)]);
    const col = i === hiIndex ? a : b;
    s += `<path d="${pts.map((p, k) => (k ? 'L' : 'M') + f(p[0]) + ' ' + f(p[1])).join('')}" stroke="${col}" stroke-width="${i === hiIndex ? 2.6 : 1.6}" fill="none" opacity=".9"/>`;
    for (const p of pts) s += `<circle cx="${f(p[0])}" cy="${f(p[1])}" r="${i === hiIndex ? 5 : 3.8}" fill="${col}"/>`;
  });
  return { s, x, y };
}

const draw = (a = colors[0], b = colors[1]) => {
  let s = text(48, 50, 'Which way the zeros move as the genus grows', 26, ink, 'start', 'bold');
  s += text(48, 76, 'each row is one genus, 0 at the top to 6; dashed lines are the limits the zeros approach', 15, dim);
  // Left: 4-cycle, both zeros, real line −2.7 … −0.3
  const L = tracks(R4, [-2, -0.5], 90, 520, -2.7, -0.3, 128, a, b, 0);
  s += L.s;
  s += text(L.x(-2), 112, '−2', 14, ink, 'middle', 'bold') + text(L.x(-0.5), 112, '−1/2', 14, ink, 'middle', 'bold');
  s += text(L.x(-2.618) + 10, L.y(0) - 8, '−2.618', 13, a, 'start');
  s += text(L.x(-2.036) - 10, L.y(3) + 5, '−2.036', 13, a, 'end');
  s += text(305, 344, 'the 4-cycle: from below to −2, from above to −1/2', 14.5, ink, 'middle', 'bold');
  s += text(70, L.y(0) + 5, 'g 0', 12, dim, 'end') + text(70, L.y(6) + 5, 'g 6', 12, dim, 'end');
  // Right: zoom on the (2,2,2) zero with limit −3/2
  const Z = R222.map(r => [r[1]]);
  const zx0 = 640, zx1 = 920;
  const Rz = tracks(Z, [-1.5], zx0, zx1, -1.565, -1.49, 128, a, b, 0);
  s += Rz.s;
  s += text(Rz.x(-1.5), 112, '−3/2', 14, ink, 'middle', 'bold');
  s += text(700, Rz.y(0) - 6, 'first steps away from −3/2', 13, ink, 'start', 'bold');
  s += text(Rz.x(-1.55), Rz.y(6) + 24, '−1.55', 12, dim, 'middle') + `<path d="M${f(Rz.x(-1.55))} ${Rz.y(6) + 6}v6" stroke="${muted}"/>`;
  s += text(780, 344, 'three 2-cycles, zoomed: the wrong way first', 14.5, ink, 'middle', 'bold');
  const T = 966;
  s += text(T, 150, '132', 34, ink, 'start', 'bold');
  s += text(T, 172, 'cycle types, 4 to 10 items:', 13.5, dim);
  s += text(T, 190, 'all zeros real, every genus', 13.5, dim);
  s += text(T, 236, '8', 34, a, 'start', 'bold');
  s += text(T, 258, 'ever move the wrong way,', 13.5, dim);
  s += text(T, 276, 'all made of even cycles,', 13.5, dim);
  s += text(T, 294, 'never after genus 2', 13.5, dim);
  s += text(1160, 388, 'Zeros computed from the exact cut-and-join polynomials · eventual direction proved for every cycle type', 13.5, muted, 'end');
  return s;
};

const description = 'Banner for a paper on how the zeros of deformed monotone Hurwitz polynomials approach their limits. Each panel has one row per genus, 0 at the top to 6 at the bottom, with the real zeros plotted as dots joined into tracks and the limiting values as dashed vertical lines. Left: the 4-cycle; its smallest zero goes −2.618, −2.215, −2.086, −2.036 and onwards, climbing towards −2 from below, while the other zero rises towards −1/2 from above. Right: a zoom on the zero of the profile of three 2-cycles whose limit is −3/2; from genus 0 to genus 1 it first steps away from −3/2, then turns back and approaches it. A side note gives the census: all 132 cycle types with 4 to 10 items have only real zeros at every genus, and only 8, all made of even cycles, ever move the wrong way, never after genus 2. Zeros are computed from the exact cut-and-join polynomials.';

const thumbnailHero = () => {
  const x = t => 20 + (t + 2.7) / 2.4 * 390, y = g => 14 + g * 29;
  const path = i => R4.map((r, g) => `${g ? 'L' : 'M'}${f(x(r[i]))} ${y(g)}`).join('');
  return `<div class="eq-label">4-CYCLE · GENUS 0 TO 6</div>
  <svg viewBox="0 0 430 200" style="width:100%;height:200px" aria-label="Zero tracks of the 4-cycle approaching −2 from below and −1/2 from above">
    <path d="M${f(x(-2))} 0V200M${f(x(-0.5))} 0V200" stroke="currentColor" stroke-width="2" stroke-dasharray="6 6" opacity=".5"/>
    <path d="${path(0)}" stroke="currentColor" stroke-width="5" fill="none"/><path d="${path(1)}" stroke="currentColor" stroke-width="3" fill="none" opacity=".6"/>
  </svg>
  <div class="eq"><span class="hl">−2.618 → −2</span></div>
  <div class="note">from below · only 8 of 132 types ever step away</div>
  <div class="eq-foot">exact certificates up to ten items</div>`;
};

module.exports = { draw, colors, description, thumbnailHero };
