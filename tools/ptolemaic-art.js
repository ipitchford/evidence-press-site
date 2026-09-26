'use strict';

// Source: paper/ptolemaic.tex, Complete split witnesses / Seven-point example.
// Vertex positions are a graph layout, not a Euclidean realisation of d.
const C = { bg: '#14282d', ink: '#f4f5ed', muted: '#b6c8c8', teal: '#69dbc6', gold: '#f2c373', edge: '#b6cbcc' };
const threshold = Math.log2(16 / 9);
const quadratic = p => 2 / 3 + (3 / 4) * 2 ** p - 2;
const description = 'Seven-point complete split graph CS(3,4), shown as a shortest-path distance diagram, not a Euclidean embedding. Every drawn edge has length one; the four gold vertices are pairwise distance two. With coefficients plus one third on the three teal vertices and minus one quarter on the four gold vertices, the quadratic form Q(p) = 2/3 + (3/4) 2^p - 2 crosses zero at p = log base 2 of 16/9, approximately 0.830075. This witness supplies the sharpness obstruction, not the universal proof.';
const text = (x, y, size, content, color = C.ink, extra = '') => `<text class="og-hide" x="${x}" y="${y}" font-size="${size}" fill="${color}" ${extra}>${content}</text>`;
const graphPoints = {
  clique: [[110, 175], [250, 65], [390, 175]],
  independent: [[64, 316], [188, 316], [312, 316], [436, 316]]
};
function graph({ labels = false, radius = 18 } = {}) {
  const { clique, independent } = graphPoints;
  let out = '<g fill="none" stroke-linecap="round">';
  for (let i = 0; i < clique.length; i++) for (let j = i + 1; j < clique.length; j++) {
    out += `<path data-edge="clique-${i}-${j}" d="M${clique[i]} L${clique[j]}" stroke="${C.teal}" stroke-width="3.8"/>`;
  }
  for (let i = 0; i < clique.length; i++) for (let j = 0; j < independent.length; j++) {
    out += `<path data-edge="cross-${i}-${j}" d="M${clique[i]} L${independent[j]}" stroke="${C.edge}" stroke-opacity=".64" stroke-width="2.8"/>`;
  }
  out += '</g>';
  for (const [set, points, color, label] of [['clique', clique, C.teal, '+⅓'], ['independent', independent, C.gold, '−¼']]) {
    for (const [i, [x, y]] of points.entries()) {
      out += `<circle data-vertex="${set}-${i}" cx="${x}" cy="${y}" r="${radius}" fill="${color}" stroke="${C.bg}" stroke-width="4"/>`;
      if (labels) out += text(x, y + 9, 29, label, C.bg, 'text-anchor="middle" font-weight="700"');
    }
  }
  return out;
}
function plot({ x, y, width, height, labels = true, font = 28, labelThreshold = true }) {
  const xmax = 1.2, ymin = -.65, ymax = .45;
  const X = p => x + width * p / xmax;
  const Y = q => y + height * (ymax - q) / (ymax - ymin);
  const curve = (lo, hi) => Array.from({ length: 121 }, (_, i) => {
    const p = lo + (hi - lo) * i / 120;
    return `${i ? 'L' : 'M'}${X(p).toFixed(3)} ${Y(quadratic(p)).toFixed(3)}`;
  }).join(' ');
  let out = `<path d="M${x} ${y} V${y + height} M${x} ${Y(0)} H${x + width}" stroke="${C.muted}" stroke-width="2" fill="none"/>`;
  out += `<path d="${curve(threshold, xmax)} L${X(xmax)} ${Y(0)} L${X(threshold)} ${Y(0)} Z" fill="${C.gold}" fill-opacity=".12"/>`;
  out += `<path d="M${X(threshold)} ${y} V${y + height}" stroke="${C.gold}" stroke-opacity=".8" stroke-width="2.2" stroke-dasharray="6 8"/>`;
  out += `<path data-curve="negative" d="${curve(0, threshold)}" stroke="${C.teal}" stroke-width="6" fill="none"/>`;
  out += `<path data-curve="positive" d="${curve(threshold, xmax)}" stroke="${C.gold}" stroke-width="6" fill="none"/>`;
  out += `<circle cx="${X(threshold)}" cy="${Y(0)}" r="8" fill="${C.ink}" stroke="${C.bg}" stroke-width="3"/>`;
  if (labels) {
    for (const p of [0, .5, 1]) {
      out += `<path d="M${X(p)} ${y + height} v7" stroke="${C.muted}" stroke-width="2"/>`;
      out += text(X(p), y + height + 39, font, String(p), C.muted, 'text-anchor="middle"');
    }
    for (const q of [-.5, 0, .25]) out += text(x - 18, Y(q) + 10, font, q === -.5 ? '−0.5' : String(q), C.muted, 'text-anchor="end"');
    out += text(x + width + 22, y + height + 38, font + 5, 'p', C.ink, 'font-style="italic"');
  }
  if (labelThreshold) out += text(X(threshold), y - 20, font + 2, 'p* ≈ 0.830075', C.gold, 'text-anchor="middle"');
  return out;
}
function cover() {
  let out = `<rect width="1200" height="400" fill="${C.bg}"/><g font-family="Arial, Helvetica, sans-serif">`;
  out += text(50, 51, 35, 'CS(3,4) · unit graph edges');
  out += `<g transform="translate(15 29) scale(.95 .81)">${graph()}</g>`;
  out += text(253, 366, 37, 'Gold pairs: 2', C.gold, 'text-anchor="middle"');
  out += `<path d="M535 43 V365" stroke="${C.muted}" stroke-opacity=".28"/>`;
  out += text(602, 55, 37, 'Q(p)', C.ink, 'font-style="italic"');
  out += plot({ x: 650, y: 78, width: 468, height: 230, labels: false, labelThreshold: false });
  const yzero = 78 + 230 * .45 / 1.1;
  out += text(627, yzero + 12, 33, '0', C.muted, 'text-anchor="end"');
  out += text(1117, 55, 34, 'Q &gt; 0', C.gold, 'text-anchor="end"');
  out += text(1147, yzero + 11, 36, 'p', C.ink, 'font-style="italic"');
  out += text(881, 367, 43, 'p* = log₂(16/9)', C.gold, 'text-anchor="middle"');
  out += '</g>';
  return out;
}
function witness() {
  let out = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 1120" role="img" aria-labelledby="witness-title witness-desc"><title id="witness-title">A seven-point sharpness witness</title><desc id="witness-desc">${description}</desc><rect width="900" height="1120" fill="${C.bg}"/><g font-family="Arial, Helvetica, sans-serif">`;
  out += text(450, 62, 44, 'A seven-point sharpness witness', C.ink, 'text-anchor="middle"');
  out += text(450, 108, 31, 'CS(3,4): every drawn edge has length 1', C.muted, 'text-anchor="middle"');
  out += `<g transform="translate(76 106) scale(1.5 1.04)">${graph({ labels: true, radius: 28 })}</g>`;
  out += text(450, 499, 33, 'The four gold vertices are pairwise distance 2.', C.gold, 'text-anchor="middle"');
  out += `<path d="M76 535 H824" stroke="${C.muted}" stroke-opacity=".35"/>`;
  out += text(450, 589, 39, 'Q(p) = zᵀdᵖz = ⅔ + ¾ · 2ᵖ − 2', C.ink, 'text-anchor="middle" font-family="Georgia, serif"');
  out += text(450, 638, 32, '3(+⅓) + 4(−¼) = 0', C.muted, 'text-anchor="middle"');
  out += plot({ x: 139, y: 742, width: 611, height: 255, font: 29 });
  out += text(90, 719, 34, 'Q(p)', C.ink, 'font-style="italic"');
  out += text(748, 691, 32, 'Q &gt; 0', C.gold, 'text-anchor="end"');
  out += text(450, 1082, 31, 'Above p*: this metric fails p-negative type.', C.ink, 'text-anchor="middle"');
  return out + '</g></svg>\n';
}
function thumbnailHero() {
  return `<div class="eq-label">seven-point sharpness witness</div>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 370" role="img" aria-label="Split graph with three clique vertices and four independent vertices" style="display:block;width:100%;height:224px">${graph({ radius: 20 })}</svg>
    <div class="eq eq-sm">p* = log₂(16/9)</div>
    <div class="note"><b>≈ 0.830075</b><br>shortest-path distances: 1 and 2</div>`;
}
module.exports = { cover, witness, thumbnailHero, description, threshold, quadratic, graph };
