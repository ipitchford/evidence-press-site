'use strict';
// Signed Kuramoto networks inside positive ones: banner.
// Sources (manuscript of 27 Oct 2026, v1.0.0-candidate):
//  - Edge rule (5): (i,a,k) ~ (j, a + d_ij, k) with d = 0 for a positive and d = 3 for a negative base edge;
//    embedding (6): phase of group a is phi_i + a*pi/3, so groups a and a+3 differ by pi and sin(x+pi) = -sin x.
//  - Theorem 2: G_{6,9} (324 vertices, all couplings +1) has a stable equilibrium theta* whose equilibrium germ is
//    R x C(S^1 x S^1): a cone over a torus; theta* has phases 0,0,0,pi,pi,pi on the base K_6.
//  - Corollary 14 contrast: crossing tori (two surfaces) have a singular point too, but no cover obstruction.
const ink = '#f4f1ea', muted = '#ddd5c6', dim = '#bfb6a6';
const cPos = '#9fe0c9', cNeg = '#ffb38a', cCone = '#ffd979';
const SANS = 'Arial,Helvetica,sans-serif', SERIF = 'Georgia,serif';
const text = (x, y, s, size = 18, color = ink, anchor = 'start', weight = 'normal', family = SANS, cls = 'og-hide') =>
  `<text${cls ? ` class="${cls}"` : ''} x="${x}" y="${y}" fill="${color}" font-family="${family}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}">${s}</text>`;
const f = v => (+v).toFixed(1);

// Exactness checks on the depicted rule.
const D_NEG = 3;
if ((D_NEG * Math.PI / 3 - Math.PI) !== 0 || Math.abs(Math.sin(1 + Math.PI) + Math.sin(1)) > 1e-12) throw new Error('art data');

function ring(cx, cy, R, phi, label, labelColour) {
  const pos = [];
  for (let a = 0; a < 6; a++) {
    const ang = -Math.PI / 2 + a * Math.PI / 3; // group a placed clockwise from the top
    pos.push([cx + R * Math.cos(ang), cy + R * Math.sin(ang)]);
  }
  let s = '';
  for (let a = 0; a < 6; a++) {
    const [x0, y0] = pos[a], [x1, y1] = pos[(a + 1) % 6];
    s += `<path d="M${f(x0)} ${f(y0)} L${f(x1)} ${f(y1)}" stroke="${dim}" stroke-opacity=".55" stroke-width="5" stroke-linecap="round"/>`;
  }
  for (let a = 0; a < 6; a++) {
    const [x, y] = pos[a];
    const th = phi + a * Math.PI / 3; // phase of group a: phi + a*pi/3 (embedding (6))
    const dx = 15 * Math.cos(th), dy = -15 * Math.sin(th);
    s += `<circle cx="${f(x)}" cy="${f(y)}" r="20" fill="#1b1f2a" fill-opacity=".55" stroke="${ink}" stroke-width="1.6"/>`;
    s += `<path d="M${f(x - dx)} ${f(y - dy)} L${f(x + dx)} ${f(y + dy)}" stroke="${ink}" stroke-width="2.4" marker-end="url(#skArrow)"/>`;
    const lx = cx + (R + 34) * Math.cos(-Math.PI / 2 + a * Math.PI / 3), ly = cy + (R + 34) * Math.sin(-Math.PI / 2 + a * Math.PI / 3) + 6;
    s += text(f(lx), f(ly), String(a), 16, dim, 'middle');
  }
  s += text(cx, cy + 9, label, 26, labelColour, 'middle', 'normal', SERIF);
  return { s, pos };
}

function left() {
  let s = '';
  s += text(40, 50, 'A repulsive edge, built from attractive ones', 22, ink, 'start', 'bold');
  s += text(40, 76, 'each oscillator becomes a ring of six groups at phase offsets aπ/3', 15, dim);
  const A = ring(150, 222, 82, 0.35, 'i', ink), B = ring(450, 222, 82, 1.2, 'j', ink);
  let m = '';
  for (let a = 0; a < 6; a++) {
    const [x0, y0] = A.pos[a], [x1, y1] = B.pos[(a + D_NEG) % 6];
    m += `<path d="M${f(x0)} ${f(y0)} L${f(x1)} ${f(y1)}" stroke="${cNeg}" stroke-width="2.2" stroke-opacity=".9"/>`;
  }
  s += m + A.s + B.s;
  s += text(300, 352, 'group a of i  ↔  group a + 3 of j', 17, cNeg, 'middle', 'bold');
  s += text(300, 376, 'phases differ by π, and sin(x + π) = −sin x: a pull acts as a push', 15, muted, 'middle');
  return s;
}

function right() {
  let s = '';
  const X0 = 650;
  s += text(X0, 50, 'Result: stable equilibria shaped like a cone', 22, ink, 'start', 'bold');
  s += text(X0, 76, '324 oscillators, every coupling +1 (Theorem 2)', 15, dim);
  // Cone over a torus: torus drawn at the base, generators to the apex (the state with phases 0,0,0,π,π,π).
  const apex = [835, 136], cx = 835, cy = 318, rx = 128, ry = 36, rIn = 0.42;
  let g = '';
  for (let k = 0; k < 28; k++) {
    const t = 2 * Math.PI * k / 28;
    const outer = [cx + rx * Math.cos(t), cy + ry * Math.sin(t)];
    const inner = [cx + rx * rIn * Math.cos(t), cy + ry * rIn * Math.sin(t)];
    const back = Math.sin(t) < 0;
    g += `<path d="M${f(apex[0])} ${f(apex[1])} L${f(outer[0])} ${f(outer[1])}" stroke="${cCone}" stroke-opacity="${back ? '.22' : '.5'}" stroke-width="1.3"/>`;
    g += `<path d="M${f(apex[0])} ${f(apex[1])} L${f(inner[0])} ${f(inner[1])}" stroke="${cCone}" stroke-opacity="${back ? '.14' : '.3'}" stroke-width="1"/>`;
  }
  s += g;
  s += `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${cCone}" fill-opacity=".1" stroke="${cCone}" stroke-width="2.6"/>`;
  s += `<ellipse cx="${cx}" cy="${cy}" rx="${f(rx * rIn)}" ry="${f(ry * rIn)}" fill="#1b1f2a" fill-opacity=".55" stroke="${cCone}" stroke-width="2"/>`;
  s += `<circle cx="${apex[0]}" cy="${apex[1]}" r="7" fill="${cCone}"/>`;
  // apex inset: three arrows east, three west
  for (let k = 0; k < 3; k++) {
    s += `<path d="M${apex[0] + 18} ${apex[1] - 20 + 7 * k} h26" stroke="${ink}" stroke-width="2" marker-end="url(#skArrow)"/>`;
    s += `<path d="M${apex[0] - 18} ${apex[1] - 20 + 7 * k} h-26" stroke="${ink}" stroke-width="2" marker-end="url(#skArrow)"/>`;
  }
  s += text(1000, 132, 'tip: 3 phases at 0,', 15, muted, 'start');
  s += text(1000, 151, '3 at π (K₆ base)', 15, muted, 'start');
  s += text(cx, 384, 'near the tip: ℝ × cone over a torus S¹ × S¹', 17, cCone, 'middle', 'bold', SERIF);
  s += text(1000, 240, 'one connected', 15, muted, 'start');
  s += text(1000, 259, 'regular part: no', 15, muted, 'start');
  s += text(1000, 278, 'cover by closed', 15, muted, 'start');
  s += text(1000, 297, 'manifolds', 15, muted, 'start');
  s += `<path d="M995 268 Q968 290 ${cx + rx - 6} ${cy - 10}" fill="none" stroke="${muted}" stroke-width="1.2" stroke-dasharray="4 4"/>`;
  return s;
}

exports.draw = (slug, background) => {
  const defs = `<defs><marker id="skArrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="${ink}"/></marker></defs>`;
  return defs + left() + `<path d="M612 40 V372" stroke="${dim}" stroke-opacity=".35" stroke-width="1"/>` + right();
};
exports.colors = [cCone, cNeg];
exports.description = 'Left: two oscillators i and j, each replaced by a hexagonal ring of six groups whose phases are offset by multiples of 60 degrees; a repulsive base edge is realised by attractive edges matching group a of i with group a + 3 of j, half a turn apart, where a pull acts as a push. Right: the resulting positive network of 324 oscillators has a continuum of stable equilibria that near one state (three phases at 0, three at pi) is a cone over a torus, whose single connected regular part rules out any cover by closed manifolds.';
