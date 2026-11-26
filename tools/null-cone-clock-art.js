'use strict';
// Banner for null-cone-clock-uv-obstructions (DOI 10.5281/zenodo.24563185).
// Source (manuscript, 51 pages): the past light cone of Chandrasekaran (2026), generators from a cap at v = ε to the
// corner S at v = 1; clock u = ∫_ε^1 e^{Ξ(v)} dv, Ξ quadratic in the shear. Theorems B, C, D: Weyl ordering gives a
// zero-point value growing like K² (coefficient 14.03 at ε = 0.1); normal ordering a ground value of order −K and no
// operator on finite-particle vectors; Wick ordering a positive form with vacuum reading 1 − ε that is not closable.
// The cone is a schematic; the frayed ripples near the cap only hint at ultraviolet modes and are not data.
const ink = '#f3efe6', muted = '#cfc8ba', dim = '#aaa293';
const colors = ['#f2b46b', '#93b4dd'];
const SANS = 'Arial,Helvetica,sans-serif';
const f = v => (+v).toFixed(1);
const text = (x, y, s, size = 18, color = ink, anchor = 'start', weight = 'normal') =>
  `<text class="og-hide" x="${x}" y="${y}" fill="${color}" font-family="${SANS}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}">${s}</text>`;

// Cone in oblique view: axis horizontal from the cap (x = CX0, radius r0) to the corner (x = CX1, radius r1).
const CX0 = 120, CX1 = 560, CY = 232, R0 = 16, R1 = 132, TILT = 0.34;
const eps = 0.1;
const at = (v, phi) => { // v in [ε, 1] (area radius / corner value), phi angle around the axis
  const t = (v - eps) / (1 - eps), r = R0 + (R1 - R0) * t, x = CX0 + (CX1 - CX0) * t;
  return [x + r * TILT * Math.cos(phi), CY + r * Math.sin(phi)];
};
const ellipse = (v, stroke, sw, op, fill = 'none') => {
  const t = (v - eps) / (1 - eps), r = R0 + (R1 - R0) * t, x = CX0 + (CX1 - CX0) * t;
  return `<ellipse cx="${f(x)}" cy="${CY}" rx="${f(r * TILT)}" ry="${f(r)}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" opacity="${op}"/>`;
};

function cone(a, b) {
  let s = '';
  // generators: fine luminous lines from cap to corner
  for (let i = 0; i < 36; i++) {
    const phi = i / 36 * 2 * Math.PI, back = Math.sin(phi) < -0.15 && Math.cos(phi) < 0;
    const [x0, y0] = at(eps, phi), [x1, y1] = at(1, phi);
    s += `<path d="M${f(x0)} ${f(y0)} L${f(x1)} ${f(y1)}" stroke="${b}" stroke-width="${back ? 0.7 : 1.1}" opacity="${back ? 0.25 : 0.55}"/>`;
  }
  s += ellipse(eps, b, 1.4, 0.8);
  // corner circle: the one warm accent
  s += ellipse(1, a, 3.2, 0.95, 'url(#ncc-corner)');
  // highlighted generator (phi = 0.62 π, upper front), frayed into ultraviolet ripples near the cap
  const phi = -0.62;
  const P = v => at(v, phi);
  let d = '';
  for (let i = 0; i <= 600; i++) {
    const v = eps + (1 - eps) * i / 600, [x, y] = P(v);
    const w = (1 - (v - eps) / (1 - eps)) ** 3; // amplitude grows towards the cap
    const k = 30 + 900 * w;                     // and the ripples get finer
    d += `${i ? 'L' : 'M'}${f(x)} ${f(y + 9 * w * Math.sin(k * (v - eps)))} `;
  }
  s += `<path d="${d}" stroke="${ink}" stroke-width="1.8" fill="none" opacity=".95"/>`;
  // clock dial on the generator with a blurred fan of hand positions: the reading does not settle
  const [cx, cy] = P(0.62);
  const dx = cx, dy = cy - 46, R = 26;
  s += `<path d="M${f(cx)} ${f(cy)} L${f(dx)} ${f(dy + R)}" stroke="${muted}" stroke-width="1" opacity=".6"/>`;
  s += `<circle cx="${f(dx)}" cy="${f(dy)}" r="${R}" fill="#10151a" fill-opacity=".85" stroke="${ink}" stroke-width="1.6"/>`;
  for (let k = 0; k < 12; k++) { const t = k / 12 * 2 * Math.PI; s += `<path d="M${f(dx + 0.82 * R * Math.sin(t))} ${f(dy - 0.82 * R * Math.cos(t))} L${f(dx + R * Math.sin(t))} ${f(dy - R * Math.cos(t))}" stroke="${muted}" stroke-width="1"/>`; }
  for (let k = 0; k < 15; k++) {
    const t = -2.2 + k * 0.31, o = 0.12 + 0.6 * Math.exp(-(((k - 7) / 4) ** 2));
    s += `<path d="M${f(dx)} ${f(dy)} L${f(dx + 0.78 * R * Math.sin(t))} ${f(dy - 0.78 * R * Math.cos(t))}" stroke="${a}" stroke-width="2" stroke-linecap="round" opacity="${o.toFixed(2)}"/>`;
  }
  s += `<circle cx="${f(dx)}" cy="${f(dy)}" r="2.6" fill="${ink}"/>`;
  // labels
  const [kx, ky] = at(eps, Math.PI / 2);
  s += text(f(kx), f(ky + 28), 'cap, v = ε', 14, dim, 'middle');
  s += text(f(CX0 - 6), f(CY - 46), 'ultraviolet ripples', 13, dim, 'start');
  const [sx, sy] = at(1, Math.PI / 2);
  s += text(f(sx), f(sy + 26), 'corner S, v = 1', 14, a, 'middle', 'bold');
  s += text(f(dx + R + 10), f(dy - 6), 'clock reading', 13.5, ink, 'start', 'bold');
  s += text(f(dx + R + 10), f(dy + 11), 'does not settle', 13, dim, 'start');
  return s;
}

const draw = (a = colors[0], b = colors[1]) => {
  let s = `<defs><radialGradient id="ncc-corner" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="${a}" stop-opacity=".22"/><stop offset="1" stop-color="${a}" stop-opacity="0"/></radialGradient></defs>`;
  s += text(48, 50, 'Three ways to define the gravitational clock; none gives an operator', 25, ink, 'start', 'bold');
  s += text(48, 76, 'u = ∫ e<tspan baseline-shift="super" font-size="11">Ξ</tspan> dv along a light-cone generator, quantised in the linearised sector', 15, dim);
  s += cone(a, b);
  const L = 712;
  const row = (y, name, line, note) => text(L, y, name, 16, b, 'start', 'bold') + text(L, y + 26, line, 20, ink, 'start', 'bold') + text(L, y + 47, note, 13.5, dim);
  s += row(124, 'Weyl ordering', 'zero-point value ∝ K²', 'grows with the number K of modes kept');
  s += row(206, 'Normal ordering', 'ground value of order −K', 'not an operator on finite-particle states');
  s += row(288, 'Wick ordering', 'right vacuum reading, 1 − ε', 'but the positive form is not closable: no operator');
  s += text(1160, 388, 'Linearised sector, natural Fock realisation · not a claim that no clock exists', 13.5, muted, 'end');
  return s;
};

const description = 'Banner for a paper on ultraviolet obstructions to the gravitational clock of a null-cone quantisation of gravity. On the left, a past light cone is drawn in oblique view as fine luminous generators running from a small cap circle (labelled cap, v = ε) to a large corner circle in a warm accent (labelled corner S, v = 1). One generator is highlighted; near the cap it frays into ripples that grow finer, hinting at ultraviolet modes (schematic, not data). A clock dial sits on this generator with its hand blurred into a fan of positions, labelled: clock reading does not settle. On the right, three rows list the three standard definitions of the clock and how each fails: Weyl ordering, zero-point value proportional to K squared, growing with the number K of modes kept; normal ordering, ground value of order minus K, not an operator on finite-particle states; Wick ordering, vacuum reading 1 minus epsilon, yet a positive form that is not closable, so no operator. Headline: three ways to define the gravitational clock; none gives an operator. Footer: linearised sector, natural Fock realisation; not a claim that no clock exists.';

const thumbnailHero = () => {
  let gens = '';
  for (let i = 0; i < 18; i++) { const y1 = 20 + i * 9.4, y0 = 92 + (y1 - 100) * 0.12; gens += `<path d="M30 ${f(y0)} L380 ${f(y1)}" stroke="currentColor" stroke-width="1.2" opacity=".45"/>`; }
  return `<div class="eq-label">THE NULL-CONE CLOCK</div>
  <svg viewBox="0 0 430 200" style="width:100%;height:200px" aria-label="Light-cone generators converging on a small cap, with a bright corner circle and a clock whose hand is blurred">
    ${gens}
    <ellipse cx="380" cy="100" rx="28" ry="84" fill="none" stroke="currentColor" stroke-width="4"/>
    <circle cx="210" cy="60" r="24" fill="none" stroke="currentColor" stroke-width="2.5"/>
    <path d="M210 60 L198 42 M210 60 L210 39 M210 60 L222 42" stroke="currentColor" stroke-width="2.5" opacity=".7"/>
  </svg>
  <div class="eq">Weyl · normal · <span class="hl">Wick</span></div>
  <div class="note">each fails to give the clock an operator</div>
  <div class="eq-foot">linearised sector · natural Fock realisation</div>`;
};

module.exports = { draw, colors, description, thumbnailHero };
