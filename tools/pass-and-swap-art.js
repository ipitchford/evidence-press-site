'use strict';
// Bounded pass-and-swap banner. Left: the worked example of Section 1.4 of the
// paper (C5, cap w = 2, upper queue 0 1 2 4 3): serving job 0 makes two swaps,
// the cap stops the chain, job 2 leaves although it could swap with 3, one edge
// {2,3} reverses and the longest chain stays 3 > w (Figure 1, Theorem 4.1).
// Middle: Theorem 5.2 for w = 2 (rings trap iff n = 1 mod 4). Right: Theorem 7.1
// (bipartite swapping graph, odd cap: improving moves raise the number of
// X -> Y edges until no chain exceeds w). Schematic; no data are plotted.
const ink = '#f2f7f6', muted = '#c9dad8', chain = '#ffd36e', cut = '#ff9f80', good = '#a9ebd3', dim = '#7fa3a4';
const text = (x, y, s, size = 18, color = ink, anchor = 'start', weight = 'normal') =>
  `<text class="og-hide" x="${x}" y="${y}" fill="${color}" font-family="Arial,Helvetica,sans-serif" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}">${s}</text>`;
const marker = (id, color) => `<marker id="${id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5.5" markerHeight="5.5" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 Z" fill="${color}"/></marker>`;

function arrow(x1, y1, x2, y2, color, width, id, r = 15) {
  const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy);
  const ux = dx / L, uy = dy / L;
  return `<path d="M${(x1 + ux * r).toFixed(1)} ${(y1 + uy * r).toFixed(1)} L${(x2 - ux * (r + 2)).toFixed(1)} ${(y2 - uy * (r + 2)).toFixed(1)}" stroke="${color}" stroke-width="${width}" fill="none" marker-end="url(#${id})"/>`;
}
function pentagon(cx, cy, R, edges, labels) {
  const P = i => [cx + R * Math.cos((90 - 72 * i) * Math.PI / 180), cy - R * Math.sin((90 - 72 * i) * Math.PI / 180)];
  let s = '';
  for (const [u, v, kind] of edges) {
    const [a, b] = [P(u), P(v)];
    const color = kind === 'chain' ? chain : kind === 'cut' ? cut : dim;
    s += arrow(a[0], a[1], b[0], b[1], color, kind === 'plain' ? 2.2 : 3.6, `ps-${kind}`, 13);
  }
  for (let i = 0; i < 5; i++) {
    const [x, y] = P(i);
    s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="12" fill="#12343a" stroke="${muted}" stroke-width="1.8"/>`;
    s += text(x.toFixed(1), (y + 5).toFixed(1), String(i), 14, ink, 'middle', 'bold');
  }
  return s + text(cx, cy + R + 34, labels, 15, muted, 'middle');
}
function ring(cx, cy, n, R, trap) {
  let s = '';
  const pts = [...Array(n).keys()].map(i => [cx + R * Math.cos(2 * Math.PI * i / n - Math.PI / 2), cy + R * Math.sin(2 * Math.PI * i / n - Math.PI / 2)]);
  s += `<polygon points="${pts.map(p => p.map(v => v.toFixed(1)).join(',')).join(' ')}" fill="none" stroke="${trap ? chain : dim}" stroke-width="${trap ? 2.6 : 1.8}"/>`;
  for (const [x, y] of pts) s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="4.2" fill="${trap ? chain : dim}"/>`;
  s += text(cx, cy + R + 26, `n = ${n}`, 15, ink, 'middle', 'bold');
  s += text(cx, cy + R + 46, trap ? 'trap' : 'no trap', 15, trap ? chain : muted, 'middle');
  return s;
}

function draw() {
  let s = `<defs>${marker('ps-chain', chain)}${marker('ps-cut', cut)}${marker('ps-plain', dim)}${marker('ps-good', good)}${marker('ps-ink', muted)}</defs>`;
  // ---- left: one capped service on the five-job ring
  s += text(44, 46, 'Five jobs on a ring, at most w = 2 swaps per service', 23, ink, 'start', 'bold');
  s += text(44, 72, 'Job 0 finishes and hands its place down the queue; the cap cuts the chain', 16, muted);
  const QY = 158, xs = [100, 174, 248, 322, 396], jobs = [0, 1, 2, 4, 3];
  s += text(xs[0] - 34, QY + 5, 'head', 13, muted, 'end');
  xs.forEach((x, k) => {
    s += `<rect x="${x - 22}" y="${QY - 22}" width="44" height="44" rx="10" fill="#12343a" stroke="${k === 2 ? cut : muted}" stroke-width="${k === 2 ? 2.6 : 1.6}"/>`;
    s += text(x, QY + 7, String(jobs[k]), 20, ink, 'middle', 'bold');
  });
  const hop = (a, b, color, label, id, dash = '') =>
    `<path d="M${xs[a] + 6} ${QY - 26} Q${(xs[a] + xs[b]) / 2} ${QY - 64} ${xs[b] - 6} ${QY - 26}" stroke="${color}" stroke-width="3" fill="none"${dash} marker-end="url(#${id})"/>` +
    text((xs[a] + xs[b]) / 2, QY - 52, label, 14, color, 'middle');
  s += hop(0, 1, chain, 'swap 1', 'ps-chain') + hop(1, 2, chain, 'swap 2', 'ps-chain');
  s += hop(2, 4, cut, '', 'ps-cut', ' stroke-dasharray="6 6"');
  s += text((xs[2] + xs[4]) / 2, QY - 56, '✕ swap 3 blocked', 14, cut, 'middle', 'bold');
  s += `<path d="M${xs[2]} ${QY + 24} V${QY + 50}" stroke="${cut}" stroke-width="3" marker-end="url(#ps-cut)"/>`;
  s += text(xs[2] + 14, QY + 50, 'job 2 must leave', 15, cut, 'start', 'bold');
  // swapping graph before and after: one edge reverses, longest chain stays 3
  const before = [[0, 1, 'chain'], [1, 2, 'chain'], [2, 3, 'cut'], [0, 4, 'plain'], [4, 3, 'plain']];
  const after = [[0, 1, 'plain'], [1, 2, 'plain'], [3, 2, 'cut'], [0, 4, 'chain'], [4, 3, 'chain']];
  s += pentagon(110, 278, 46, before, 'chain of 3 before');
  s += `<path d="M184 280 H232" stroke="${muted}" stroke-width="2.2" marker-end="url(#ps-ink)"/>`;
  s += text(208, 268, 'edge 2–3', 13, cut, 'middle');
  s += text(208, 302, 'flips', 13, cut, 'middle');
  s += pentagon(306, 278, 46, after, 'chain of 3 after');
  s += text(392, 252, 'The longest chain', 16, chain, 'start', 'bold');
  s += text(392, 274, 'is still 3 > w.', 16, chain, 'start', 'bold');
  s += text(392, 300, '180 arrangements', 15, ink);
  s += text(392, 320, 'recur for ever: the', 15, ink);
  s += text(392, 340, 'conjecture fails.', 15, ink);
  s += `<path d="M574 96 V360" stroke="${muted}" stroke-opacity=".22"/>`;
  // ---- middle: the exact rule on rings
  s += text(604, 120, 'Rings, w = 2', 19, ink, 'start', 'bold');
  s += text(604, 144, 'trap exactly when', 15, muted);
  s += text(604, 166, 'n ≡ 1 (mod 2w)', 17, chain, 'start', 'bold');
  s += ring(632, 236, 5, 26, true) + ring(704, 236, 7, 26, false) + ring(776, 236, 9, 26, true);
  s += `<path d="M836 96 V360" stroke="${muted}" stroke-opacity=".22"/>`;
  // ---- right: bipartite swapping graph, odd cap
  s += text(866, 120, 'Bipartite swaps, odd w', 19, ink, 'start', 'bold');
  s += text(866, 144, 'no trap (Theorem 7.1)', 15, good);
  const HX = 930, HY = 252, HR = 52;
  const H = [...Array(6).keys()].map(i => [HX + HR * Math.cos(Math.PI / 3 * i - Math.PI / 2), HY + HR * Math.sin(Math.PI / 3 * i - Math.PI / 2)]);
  for (let i = 0; i < 6; i++) {
    const j = (i + 1) % 6, [from, to] = i % 2 === 0 ? [i, j] : [j, i];
    s += arrow(H[from][0], H[from][1], H[to][0], H[to][1], good, 2.8, 'ps-good', 12);
  }
  H.forEach(([x, y], i) => {
    s += i % 2 === 0 ? `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="10" fill="${good}"/>`
      : `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="10" fill="#12343a" stroke="${good}" stroke-width="2.4"/>`;
  });
  s += text(1000, 196, '● group X', 14, good) + text(1000, 216, '○ group Y', 14, good);
  s += text(1000, 252, 'Each move adds', 15, ink);
  s += text(1000, 272, 'an X → Y edge,', 15, ink);
  s += text(1000, 292, 'until no chain', 15, ink);
  s += text(1000, 312, 'is longer than w.', 15, ink);
  s += text(44, 386, 'Schematic of the paper’s worked example (Section 1.4) and Theorems 4.1, 5.2 and 7.1 · rings and bipartite result assume every queue position is served', 13, muted);
  return s;
}
const description = 'Banner for bounded swaps in pass-and-swap queues. Left: five jobs whose swapping graph is a ring, in queue order 0, 1, 2, 4, 3, with a cap of two swaps. When job 0 is served it swaps into the place of job 1, job 1 swaps into the place of job 2, and the cap blocks a third swap, so job 2 must leave although it could have swapped with job 3. Two pentagon diagrams show the orientation before and after: only the edge between jobs 2 and 3 flips, and the longest directed chain has three edges both times, more than the cap. These 180 arrangements recur for ever, refuting the conjecture. Middle: for cap 2, rings of 5 and 9 jobs have such a trap and a ring of 7 does not, following the rule n = 1 mod 2w. Right: a bipartite hexagon with groups X and Y and every edge pointing from X to Y, illustrating that for bipartite swapping graphs and odd caps each move adds an X to Y edge until no chain is longer than the cap. Schematic; based on Section 1.4 and Theorems 4.1, 5.2 and 7.1 of the paper.';
module.exports = { draw, description };
