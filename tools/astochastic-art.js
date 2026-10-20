'use strict';

// Claim-backed release art. Curves and nodes are explanatory schematics,
// not simulated data and not part of the scientific evidence.
const ink = '#fff8ef';
const muted = '#d7dde3';

const text = (x, y, value, size = 24, color = ink, anchor = 'start') =>
  `<text class="og-hide" x="${x}" y="${y}" fill="${color}" font-family="Arial,Helvetica,sans-serif" font-size="${size}" text-anchor="${anchor}">${value}</text>`;

function compartment(a, b) {
  let s = text(55, 48, 'production versus fragmentation', 29);

  // A phase diagram: the theorem's boundary is gamma = m - 1 and the
  // coefficient comparison decides the critical line.
  s += `<path d="M85 325 H545 M85 325 V75" stroke="${muted}" stroke-width="2" opacity=".55"/>`;
  s += `<path d="M115 285 L500 95" stroke="${b}" stroke-width="5"/>`;
  s += `<path d="M115 285 L115 95 L500 95 Z" fill="${a}" opacity=".08"/>`;
  s += `<path d="M115 285 L500 95 L500 285 Z" fill="${b}" opacity=".07"/>`;
  s += text(250, 135, 'conservative', 28, a, 'middle');
  s += text(385, 275, 'explosive', 28, b, 'middle');
  s += text(300, 350, 'growth exponent m − 1', 21, muted, 'middle');
  s += text(62, 68, 'fragmentation exponent γ', 20, muted);
  s += text(320, 205, 'γ = m − 1', 22, b, 'middle');

  s += `<path d="M610 76 V334" stroke="${muted}" opacity=".18"/>`;
  s += text(900, 88, 'critical coefficient', 27, ink, 'middle');
  s += text(900, 158, 'α  ≤  κ E[−log Q]', 43, a, 'middle');
  s += `<path d="M720 192 H1080" stroke="${a}" stroke-width="2" opacity=".6"/>`;
  s += text(900, 242, 'conservative at equality', 27, a, 'middle');
  s += text(900, 294, 'equal means can give different phases', 23, b, 'middle');
  s += text(900, 348, 'full descendant population controlled', 21, muted, 'middle');
  return s;
}

function davisYin(a, b) {
  let s = text(55, 48, 'finite-horizon comparison gap', 29);

  // The descending envelopes represent certified bounds. The open endpoint
  // marks non-attainment rather than missing numerical data.
  const upper = [];
  const lower = [];
  for (let i = 0; i <= 70; i += 1) {
    const x = i / 70;
    upper.push(`${75 + 500 * x},${95 + 215 * (1 - 1 / (1 + 3.1 * x))}`);
    lower.push(`${75 + 500 * x},${122 + 185 * (1 - 1 / (1 + 3.1 * x))}`);
  }
  s += `<polyline points="${upper.join(' ')}" fill="none" stroke="${a}" stroke-width="5"/>`;
  s += `<polyline points="${lower.join(' ')}" fill="none" stroke="${b}" stroke-width="3" opacity=".8"/>`;
  s += `<circle cx="575" cy="${upper[upper.length - 1].split(',')[1]}" r="9" fill="#172029" stroke="${a}" stroke-width="4"/>`;
  s += text(115, 105, 'sharp envelope', 23, a);
  s += text(330, 344, 'K iterations', 21, muted, 'middle');
  s += text(520, 275, 'approached', 21, a, 'middle');
  s += text(520, 304, 'not attained for K ≥ 2', 20, muted, 'middle');

  s += `<path d="M625 72 V338" stroke="${muted}" opacity=".18"/>`;
  s += text(900, 91, 'exact denominator', 27, ink, 'middle');
  s += text(900, 158, 'K + 1 − αL', 50, a, 'middle');
  s += text(900, 209, '0 &lt; αL &lt; 2', 22, muted, 'middle');
  s += `<path d="M735 240 H1065" stroke="${b}" stroke-width="2" opacity=".6"/>`;
  s += text(900, 291, 'endpoint αL = 2', 25, b, 'middle');
  s += text(900, 341, 'K − 1', 43, b, 'middle');
  return s;
}

module.exports = {
  compartment,
  davisYin,
  colors: {
    compartment: ['#78e0b5', '#ffb566'],
    davisYin: ['#9bbcff', '#ef9bd0']
  },
  descriptions: {
    compartment: 'A phase diagram separates conservative and explosive compartment regimes, with the critical random-retention coefficient alpha at most kappa times the expected negative logarithm of Q.',
    davisYin: 'Two sharp finite-horizon gap envelopes approach an open endpoint beside the exact denominators K plus one minus alpha L and, at the critical endpoint, K minus one.'
  }
};
