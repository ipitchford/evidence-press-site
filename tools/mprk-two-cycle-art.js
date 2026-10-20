'use strict';
// MPRK22(4/7) counterexample banner. Positions use the certified values of
// Theorems 5-6 (certificates C1, C2): attracting cycle t_L ~ 1.08e-7,
// t_H ~ 0.4935; repelling cycle s_L ~ 1.97e-6, s_H ~ 0.1081; steady state
// p = 1/1000. The arcs are schematic hops of the iteration, not a plot of time.
const ink = '#fff5e9', muted = '#e2d9d0', cyc = '#ffc184', eq = '#a9ebd3', rep = '#d6b5ef';
const text = (x, y, s, size = 22, color = ink, anchor = 'start', weight = 'normal') =>
  `<text class="og-hide" x="${x}" y="${y}" fill="${color}" font-family="Arial,Helvetica,sans-serif" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}">${s}</text>`;
// log10 axis: 1e-8 .. 1 across x = 110 .. 710
const X0 = 110, DEC = 75, AY = 222;
const lx = v => X0 + (Math.log10(v) + 8) * DEC;
const tL = 1.08147603435e-7, tH = 0.493522229287, sL = 1.9651693825e-6, sH = 0.108050969162, p = 1e-3;

function draw() {
  let s = `<defs><marker id="mprk-hop" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 Z" fill="${cyc}"/></marker></defs>`;
  s += text(60, 50, 'Started at (½, ½), the scheme hops between two traps for ever', 27, ink);
  s += text(60, 80, 'MPRK22(4/7): every coefficient positive · rates 9990 and 10 · step size 1', 19, muted);
  // axis and decades
  s += `<path d="M${X0} ${AY} H${lx(1)}" stroke="${muted}" stroke-opacity=".55" stroke-width="2"/>`;
  for (let k = -8; k <= 0; k++) {
    const x = lx(10 ** k);
    s += `<path d="M${x} ${AY - 6} V${AY + 6}" stroke="${muted}" stroke-opacity=".55" stroke-width="2"/>`;
    if (k % 2 === 0) s += text(x, AY + 102, k === 0 ? '1' : `10<tspan dy="-9" font-size="13">${k}</tspan>`, 17, muted, 'middle');
  }
  s += text(X0, AY + 128, 'first component y₁ (log scale)', 17, muted);
  // basin of the steady state, bounded by the repelling two-cycle
  s += `<rect x="${lx(sL)}" y="${AY - 5}" width="${lx(sH) - lx(sL)}" height="10" rx="5" fill="${eq}" fill-opacity=".55"/>`;
  for (const v of [sL, sH]) s += `<circle cx="${lx(v)}" cy="${AY}" r="7" fill="#3a1d26" stroke="${rep}" stroke-width="2.5"/>`;
  s += text((lx(sL) + lx(sH)) / 2, AY + 30, 'basin of the true equilibrium', 16, eq, 'middle');
  // hops of the attracting two-cycle
  const xa = lx(tL), xb = lx(tH), mid = (xa + xb) / 2;
  s += `<path d="M${xb - 4} ${AY - 18} Q${mid} ${AY - 132} ${xa + 4} ${AY - 18}" stroke="${cyc}" stroke-width="3.5" fill="none" marker-end="url(#mprk-hop)"/>`;
  s += `<path d="M${xa + 4} ${AY + 18} Q${mid} ${AY + 132} ${xb - 4} ${AY + 18}" stroke="${cyc}" stroke-width="3.5" fill="none" marker-end="url(#mprk-hop)"/>`;
  s += text(mid, AY - 84, 'one step', 17, cyc, 'middle');
  s += text(mid, AY + 58, 'next step', 17, cyc, 'middle');
  // the two trapping intervals
  for (const [x, label, anchor, dx] of [[xa, 'trap L ≈ 10⁻⁷', 'end', 10], [xb, 'trap H ≈ 0.49', 'start', -10]]) {
    s += `<rect x="${x - 7}" y="${AY - 15}" width="14" height="30" rx="4" fill="${cyc}" fill-opacity=".3" stroke="${cyc}" stroke-width="2.5"/>`;
    s += text(x + dx, AY + 52, label, 19, cyc, anchor, 'bold');
  }
  // the true steady state
  const xp = lx(p);
  s += `<path d="M${xp} ${AY - 12} L${xp + 12} ${AY} L${xp} ${AY + 12} L${xp - 12} ${AY} Z" fill="${eq}" stroke="#3a1d26" stroke-width="2"/>`;
  s += text(xp, AY - 26, 'true equilibrium y₁ = 0.001', 18, eq, 'middle', 'bold');
  // right panel: the same facts on a linear scale
  s += `<path d="M852 104 V352" stroke="${muted}" stroke-opacity=".2"/>`;
  const B0 = 890, BW = 270, BY = 262;
  const bx = v => B0 + v * BW;
  s += text(B0, 128, 'Same line, linear scale', 21, ink, 'start', 'bold');
  s += text(B0, 158, 'The equilibrium is the only fixed', 17, muted);
  s += text(B0, 180, 'point and is locally stable, yet it', 17, muted);
  s += text(B0, 202, 'attracts only a band of width 0.108.', 17, muted);
  s += `<rect x="${B0}" y="${BY - 8}" width="${BW}" height="16" rx="3" fill="${cyc}" fill-opacity=".22"/>`;
  s += `<rect x="${bx(sL)}" y="${BY - 8}" width="${bx(sH) - bx(sL)}" height="16" rx="3" fill="${eq}" fill-opacity=".85"/>`;
  s += `<circle cx="${bx(tH)}" cy="${BY}" r="6" fill="${cyc}"/>`;
  s += text(B0, BY + 30, '0', 16, muted, 'middle') + text(B0 + BW, BY + 30, '1', 16, muted, 'middle');
  s += text(B0, BY - 18, '≈ 11% → equilibrium', 16, eq, 'start');
  s += text(B0, BY + 62, '≈ 89% of starting mass fractions', 17, cyc);
  s += text(B0, BY + 84, 'end on the two-cycle', 17, cyc);
  s += text(60, 386, 'Open circles: repelling two-cycle at the basin edges · arcs are schematic hops, not a time plot · positions from the certified values', 14, muted);
  return s;
}
const description = 'Banner for the MPRK22(4/7) counterexample. On a logarithmic axis of the first component y1, the iteration started at (1/2, 1/2) hops for ever between a trap near 0.49 and a trap near 1e-7, while the true equilibrium y1 = 0.001 lies between them, inside the basin bounded by a repelling two-cycle. A linear-scale bar on the right shows that this basin has width about 0.108, so about 89 per cent of uniformly drawn starting mass fractions end on the two-cycle. Positions use the certified values of Theorems 5 and 6; the arcs are schematic.';
module.exports = { draw, description };
