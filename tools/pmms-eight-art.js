'use strict';
// Existence frontier for three-agent PMMS (paper Theorem 1, Corollary 2, Table 1). Positions are layout only.
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

exports.description = 'Number line of goods counts 1 to 9 for three agents with additive valuations. Counts 1 to 5: PMMS allocations always exist (Amanatidis, Markakis and Ntokos 2020). Counts 6 and 7: existence re-proved in the paper. Count 8: existence proved in the paper, through four normal-form size profiles (1,1,5), (1,2,4), (1,3,3) and (2,2,3), the last three split into three sub-cases each, giving ten LRAT certificates. Count 9: counterexamples by Gölz and by Bei, Lin, Liu, Luan and Tao. The least counterexample size is therefore nine.';

exports.draw = (a, b) => {
  const xs = (i) => 78 + i * 104;              // goods 1..9 at i = 0..8
  const y = 132;
  let s = '<g font-family="Georgia,serif" fill="#f4efe6">';
  s += '<text x="52" y="54" font-size="23">Three agents, additive values, m goods: must a PMMS allocation exist?</text></g>';
  s += `<path d="M${xs(0)} ${y} H${xs(8)}" stroke="#f4efe6" stroke-opacity=".25" stroke-width="2"/>`;
  for (let i = 0; i < 9; i++) {
    const x = xs(i), m = i + 1;
    if (m <= 8) {
      const r = m === 8 ? 30 : 23;
      s += `<circle cx="${x}" cy="${y}" r="${r}" fill="${a}" fill-opacity="${m === 8 ? '.28' : '.14'}" stroke="${a}" stroke-width="${m === 8 ? 3 : 2}"/>`;
    } else {
      s += `<circle cx="${x}" cy="${y}" r="23" fill="${b}" fill-opacity=".16" stroke="${b}" stroke-width="2" stroke-dasharray="5 4"/>`;
    }
    s += `<text x="${x}" y="${y + 9}" text-anchor="middle" fill="#f4efe6" font-family="Georgia" font-size="${m === 8 ? 28 : 24}">${m}</text>`;
  }
  // frontier
  const fx = (xs(7) + xs(8)) / 2;
  s += `<path d="M${fx} 104 V200" stroke="${b}" stroke-width="2" stroke-dasharray="3 5"/>`;
  // range brackets and sources
  const bracket = (i0, i1, label, sub, col) => {
    const x0 = xs(i0) - 22, x1 = xs(i1) + 22, yy = 184;
    return `<path d="M${x0} ${yy - 8} V${yy} H${x1} V${yy - 8}" fill="none" stroke="${col}" stroke-opacity=".7" stroke-width="1.5"/>` +
      `<text x="${(x0 + x1) / 2}" y="${yy + 26}" text-anchor="middle" fill="${col}" font-family="sans-serif" font-size="16">${esc(label)}</text>` +
      `<text x="${(x0 + x1) / 2}" y="${yy + 47}" text-anchor="middle" fill="#ddd8d0" font-family="sans-serif" font-size="14">${esc(sub)}</text>`;
  };
  s += bracket(0, 4, 'PMMS always exists', 'Amanatidis, Markakis, Ntokos 2020', a);
  s += bracket(5, 6, 'always exists', 're-proved here', a);
  s += `<text x="${xs(8)}" y="${y - 44}" text-anchor="middle" fill="${b}" font-family="sans-serif" font-size="15">counterexamples</text>`;
  s += `<text x="${xs(8)}" y="${y + 66}" text-anchor="middle" fill="#ddd8d0" font-family="sans-serif" font-size="14">Gölz; Bei et al.</text>`;
  s += `<text x="${xs(7)}" y="${y - 44}" text-anchor="middle" fill="${a}" font-family="sans-serif" font-size="15">new</text>`;
  // eight-good case split
  const profiles = [['(1,1,5)', 1], ['(1,2,4)', 3], ['(1,3,3)', 3], ['(2,2,3)', 3]];
  const px = (k) => 330 + k * 150, py = 318;
  for (let k = 0; k < 4; k++) {
    s += `<path d="M${xs(7)} ${y + 32} V238 C ${xs(7)} 262, ${px(k)} 250, ${px(k)} ${py - 26}" fill="none" stroke="${a}" stroke-opacity=".45" stroke-width="1.5"/>`;
    s += `<text x="${px(k)}" y="${py}" text-anchor="middle" fill="#f4efe6" font-family="Georgia" font-size="22">${profiles[k][0]}</text>`;
    let dots = '';
    for (let j = 0; j < profiles[k][1]; j++) dots += `<rect x="${px(k) - profiles[k][1] * 9 + j * 18 + 2}" y="${py + 14}" width="13" height="13" rx="2" fill="${a}" fill-opacity=".85"/>`;
    s += dots;
  }
  s += `<text x="${px(3) + 112}" y="${py - 2}" fill="#ddd8d0" font-family="sans-serif" font-size="15">bundle sizes of a</text>`;
  s += `<text x="${px(3) + 112}" y="${py + 17}" fill="#ddd8d0" font-family="sans-serif" font-size="15">normal-form allocation</text>`;
  s += `<text x="${px(3) + 112}" y="${py + 40}" fill="${a}" font-family="sans-serif" font-size="15">■ = one LRAT certificate (10)</text>`;
  s += `<text x="${fx + 22}" y="258" fill="${b}" font-family="Georgia" font-size="40">m* = 9</text>`;
  return s;
};
