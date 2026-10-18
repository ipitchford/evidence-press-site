'use strict';
const colors = ['#a8c7ff', '#f1b66b'];
const description = 'Unequal spectral bands receive unequal regularisation, producing anisotropic jitter and a smaller certified population risk than any isotropic choice in the two-band witness. Bar heights are schematic.';
function draw(a, b) {
  const heights = [65,95,135,210,250,290];
  let s = '<g>';
  s += '<path d="M70 325 H485 M70 325 V55" fill="none" stroke="#d8e1df" stroke-width="2" opacity=".4"/>';
  heights.forEach((h,i) => {
    const x=105+i*58, c=i<3?a:b;
    s += `<rect x="${x}" y="${325-h}" width="34" height="${h}" rx="6" fill="${c}" opacity="${i<3?'.72':'.92'}"/>`;
  });
  s += `<path d="M535 200 H620" stroke="#f4efe6" stroke-width="2" opacity=".45"/><path d="M603 188 L620 200 L603 212" stroke="#f4efe6" stroke-width="2"/>`;
  const filters = [[700,115,105,a],[700,285,45,a],[930,115,70,b],[930,285,70,b]];
  for (const [x,y,r,c] of filters) s += `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="28" fill="${c}" opacity=".16" stroke="${c}" stroke-width="3"/>`;
  s += `<path d="M805 72 V330" stroke="#d8e1df" stroke-width="1" opacity=".25"/>`;
  s += `<text x="700" y="58" text-anchor="middle" fill="#f4efe6" font-family="Georgia" font-size="27">anisotropic</text>`;
  s += `<text x="930" y="58" text-anchor="middle" fill="#f4efe6" font-family="Georgia" font-size="27">isotropic</text>`;
  s += `<text x="700" y="375" text-anchor="middle" fill="${a}" font-family="monospace" font-size="17">spectrum-matched jitter</text>`;
  s += `<text x="930" y="375" text-anchor="middle" fill="${b}" font-family="monospace" font-size="17">one common scale</text>`;
  s += '</g>';
  return s;
}
module.exports = { colors, description, draw };
