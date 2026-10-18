'use strict';
const colors = ['#73ddd0', '#f0b76c'];
const description = 'A reversible three-species reaction loop crosses a Hopf boundary, while deleting the highlighted reverse arrow leaves a convergent flow. The trajectories are schematic, not simulated data.';
function draw(a, b) {
  const nodes = [[170,200,'X'],[355,95,'Y'],[355,305,'Z']];
  let s = '<g fill="none" stroke-linecap="round">';
  s += `<path d="M205 180 L315 116" stroke="${a}" stroke-width="5"/>`;
  s += `<path d="M320 137 L213 198" stroke="${b}" stroke-width="5" stroke-dasharray="10 8"/>`;
  s += `<path d="M355 133 L355 267" stroke="${a}" stroke-width="5"/>`;
  s += `<path d="M323 286 L207 219" stroke="${a}" stroke-width="5"/>`;
  for (const [x,y,label] of nodes) s += `<circle cx="${x}" cy="${y}" r="31" fill="#111b22" stroke="${a}" stroke-width="3"/><text x="${x}" y="${y+8}" text-anchor="middle" fill="#f4efe6" font-family="Georgia" font-size="25">${label}</text>`;
  s += `<path d="M470 200 H565" stroke="#f4efe6" stroke-width="2" opacity=".45"/><path d="M548 188 L565 200 L548 212" stroke="#f4efe6" stroke-width="2"/>`;
  s += `<path d="M650 205 C690 90 770 90 810 205 C850 320 930 320 970 205 C1010 90 1070 105 1115 180" stroke="${b}" stroke-width="6"/>`;
  s += `<path d="M650 205 C735 205 790 205 850 205 C940 205 1010 205 1115 205" stroke="${a}" stroke-width="2" stroke-dasharray="8 8" opacity=".8"/>`;
  s += '</g>';
  s += `<text x="275" y="370" text-anchor="middle" fill="#d8e1df" font-family="monospace" font-size="17">remove one reverse reaction</text>`;
  s += `<text x="880" y="58" text-anchor="middle" fill="#f4efe6" font-family="Georgia" font-size="31">attracting oscillation</text>`;
  s += `<text x="880" y="350" text-anchor="middle" fill="${a}" font-family="monospace" font-size="17">deleted network: global convergence</text>`;
  return s;
}
module.exports = { colors, description, draw };
