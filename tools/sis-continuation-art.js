'use strict';

// Conceptual banner sourced from Theorem 6, Theorem 8 and Corollary 13.
// Curves are schematic: the paper proves the continuation inequalities but
// does not claim these shapes are measured epidemic trajectories.
const ink = '#fff8ee';
const muted = '#ead9c8';
const observed = '#76dec7';
const futureA = '#ffbf69';
const futureB = '#d6a7ef';

const txt = (x, y, value, size = 20, colour = ink, anchor = 'start', weight = 'normal') =>
  `<text class="og-hide" x="${x}" y="${y}" fill="${colour}" font-family="Arial,Helvetica,sans-serif" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}">${value}</text>`;

function draw() {
  let s = '<defs><filter id="soft"><feGaussianBlur stdDeviation="9"/></filter></defs>';
  s += txt(58, 47, 'The same observed history can be increasingly hard to continue linearly', 26, ink, 'start', 'bold');
  s += txt(58, 76, 'full community-resolved SIS trajectories · schematic curves · theorem-backed relationships', 17, muted);

  // Left: observed samples constrain a trajectory on [0,T0].
  s += `<path d="M70 305 H1130" stroke="${muted}" stroke-opacity=".35" stroke-width="2"/>`;
  s += `<path d="M620 96 V330" stroke="${muted}" stroke-opacity=".45" stroke-width="2" stroke-dasharray="7 8"/>`;
  s += txt(345, 116, 'observed interval', 18, observed, 'middle', 'bold');
  s += txt(875, 116, 'continuation interval', 18, futureA, 'middle', 'bold');
  s += `<path d="M78 268 C175 250 248 190 340 213 S510 172 620 205" fill="none" stroke="${observed}" stroke-width="7" stroke-linecap="round"/>`;
  const samples = [[115,260],[205,228],[295,204],[390,207],[480,188],[570,194]];
  for (const [x,y] of samples) s += `<circle cx="${x}" cy="${y}" r="7" fill="${ink}" stroke="${observed}" stroke-width="3"/>`;
  s += txt(94, 340, 'samples + fill distance η + error σ', 17, muted);

  // Right: two admissible continuations separate after T0.
  s += `<path d="M620 205 C715 190 790 139 885 153 S1030 222 1132 140" fill="none" stroke="${futureA}" stroke-width="7" stroke-linecap="round"/>`;
  s += `<path d="M620 205 C715 221 790 280 885 267 S1030 196 1132 278" fill="none" stroke="${futureB}" stroke-width="7" stroke-linecap="round"/>`;
  s += `<circle cx="620" cy="205" r="10" fill="${ink}" stroke="#4b2c22" stroke-width="3"/>`;
  s += txt(620, 365, 'T₀', 19, ink, 'middle', 'bold');

  return s;
}

const description = 'A schematic full community-resolved SIS trajectory is tightly sampled on an observed interval up to T0, then branches into two admissible continuations. Labels state the proved split: a finite linear continuation factor at fixed network size, no dimension-free linear factor as size grows, and an explicit dimension-free Holder replacement. Sample points identify the deterministic fill-distance and bounded-error corollary. The curves illustrate the relationships and are not empirical epidemic data.';

module.exports = { draw, description };
