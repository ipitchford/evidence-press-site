#!/usr/bin/env node
/* Generates deterministic SVG cover art for each release → assets/art/<slug>.svg
 * Run at authoring time: node tools/make-art.js   (outputs are committed) */
'use strict';
const fs = require('fs');
const path = require('path');
const OUT = path.join(__dirname, '..', 'assets', 'art');
fs.mkdirSync(OUT, { recursive: true });

const W = 1200, H = 400;
function rng(seed) { // mulberry32
  let a = seed >>> 0;
  return () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
const hash = s => [...s].reduce((h, c) => Math.imul(h ^ c.charCodeAt(0), 2654435761) >>> 0, 7);

function frame(inner, accent, accent2) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img" aria-hidden="true">
<defs>
<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
<stop offset="0" stop-color="#151a1e"/><stop offset="1" stop-color="#1e2a2e"/>
</linearGradient>
<radialGradient id="glow" cx="0.75" cy="0.3" r="0.9">
<stop offset="0" stop-color="${accent}" stop-opacity="0.25"/><stop offset="1" stop-color="${accent}" stop-opacity="0"/>
</radialGradient>
</defs>
<rect width="${W}" height="${H}" fill="url(#bg)"/>
<rect width="${W}" height="${H}" fill="url(#glow)"/>
${inner}
</svg>`;
}

const art = {};

/* Recht–Ré: matrix heat grid + spectral curve */
art['exact-low-length-recht-re-inequalities'] = (a, b) => {
  const r = rng(hash('recht'));
  let s = '';
  const n = 14, cell = 24, ox = 120, oy = 60;
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
    const v = r();
    if (v < 0.82) s += `<rect x="${ox + j * cell}" y="${oy + i * cell}" width="${cell - 3}" height="${cell - 3}" rx="3" fill="${v < 0.16 ? b : a}" opacity="${(0.06 + v * 0.35).toFixed(2)}"/>`;
  }
  let p = `M 560 ${H - 70}`;
  for (let x = 0; x <= 560; x += 8) {
    const t = x / 560;
    const y = (H - 70) - 240 * Math.exp(-((t - 0.55) ** 2) / 0.035) - 60 * Math.exp(-((t - 0.85) ** 2) / 0.01) - t * 10;
    p += ` L ${560 + x} ${y.toFixed(1)}`;
  }
  s += `<path d="${p}" fill="none" stroke="${a}" stroke-width="3" opacity="0.9"/>`;
  s += `<line x1="560" y1="${H - 70}" x2="1140" y2="${H - 70}" stroke="#8a938f" stroke-width="1" opacity="0.5"/>`;
  s += `<circle cx="868" cy="66" r="7" fill="${b}"/><text x="884" y="72" font-family="Georgia" font-size="22" fill="#e7e5e4" opacity="0.85">−285/2</text>`;
  return s;
};

/* z(20)=6: Paley(17) circulant graph */
art['z20-equals-6'] = (a, b) => {
  const N = 17, cx = 600, cy = 200, R = 150;
  const QR = [1, 2, 4, 8, 9, 13, 15, 16];
  const pt = k => [cx + R * Math.cos(2 * Math.PI * k / N - Math.PI / 2), cy + R * Math.sin(2 * Math.PI * k / N - Math.PI / 2)];
  let s = '';
  for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) {
    if (QR.includes((j - i) % N) || QR.includes((N - (j - i)) % N)) {
      const [x1, y1] = pt(i), [x2, y2] = pt(j);
      s += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${a}" stroke-width="1" opacity="0.34"/>`;
    }
  }
  for (let i = 0; i < N; i++) { const [x, y] = pt(i);
    s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="7" fill="${i % 3 === 0 ? b : '#e7e5e4'}"/>`; }
  s += `<text x="920" y="215" font-family="Georgia" font-size="88" fill="${a}" opacity="0.9">6</text>`;
  return s;
};

/* VR2(K4)=20: ring of 20 with two disjoint K4s */
art['vr2-k4-equals-20'] = (a, b) => {
  const N = 20, cx = 600, cy = 200, R = 155;
  const pt = k => [cx + R * Math.cos(2 * Math.PI * k / N - Math.PI / 2), cy + R * Math.sin(2 * Math.PI * k / N - Math.PI / 2)];
  const r = rng(hash('vr2'));
  let s = '';
  for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) if (r() < 0.35) {
    const [x1, y1] = pt(i), [x2, y2] = pt(j);
    s += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="#8a938f" stroke-width="0.8" opacity="0.28"/>`;
  }
  const K1 = [0, 3, 6, 9], K2 = [10, 13, 16, 18];
  for (const [K, col] of [[K1, a], [K2, b]]) {
    for (let i = 0; i < 4; i++) for (let j = i + 1; j < 4; j++) {
      const [x1, y1] = pt(K[i]), [x2, y2] = pt(K[j]);
      s += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${col}" stroke-width="3" opacity="0.95"/>`;
    }
    for (const k of K) { const [x, y] = pt(k); s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="8" fill="${col}"/>`; }
  }
  for (let i = 0; i < N; i++) if (![...K1, ...K2].includes(i)) { const [x, y] = pt(i);
    s += `<circle cx="${pt(i)[0].toFixed(1)}" cy="${pt(i)[1].toFixed(1)}" r="5" fill="#e7e5e4" opacity="0.8"/>`; }
  return s;
};

/* degree-difference: Sylvester bands + resultant curves */
art['degree-difference-affine-slices'] = (a, b) => {
  let s = '';
  for (let k = 0; k < 9; k++) {
    const off = 90 + k * 34;
    s += `<rect x="${140 + k * 26}" y="${off - 30}" width="220" height="18" rx="4" fill="${k % 2 ? a : '#e7e5e4'}" opacity="${k % 2 ? 0.5 : 0.15}" transform="rotate(-14 ${140 + k * 26} ${off})"/>`;
  }
  const f = (x, c1, c2) => 200 + c1 * Math.sin(x / 95) * 90 + c2 * Math.sin(x / 41 + 1.2) * 40;
  for (const [c1, c2, col, w] of [[1, 0.5, a, 3], [0.7, -0.9, b, 3]]) {
    let p = `M 540 ${f(0, c1, c2).toFixed(1)}`;
    for (let x = 0; x <= 600; x += 10) p += ` L ${540 + x} ${f(x, c1, c2).toFixed(1)}`;
    s += `<path d="${p}" fill="none" stroke="${col}" stroke-width="${w}" opacity="0.9"/>`;
  }
  for (let x = 0; x <= 600; x += 10) {
    const y1 = 200 + Math.sin(x / 95) * 90 + 0.5 * Math.sin(x / 41 + 1.2) * 40;
    const y2 = 200 + 0.7 * Math.sin(x / 95) * 90 - 0.9 * Math.sin(x / 41 + 1.2) * 40;
    if (Math.abs(y1 - y2) < 6) s += `<circle cx="${540 + x}" cy="${((y1 + y2) / 2).toFixed(1)}" r="9" fill="none" stroke="#e7e5e4" stroke-width="2" opacity="0.9"/>`;
  }
  return s;
};

/* exotic spheres: true sphere + impostor */
art['exotic-affine-three-spheres'] = (a, b) => {
  let s = '';
  for (let k = 0; k < 7; k++) {
    const ry = 26 + k * 18;
    s += `<ellipse cx="480" cy="200" rx="150" ry="${ry}" fill="none" stroke="${a}" stroke-width="1.6" opacity="${(0.85 - k * 0.09).toFixed(2)}"/>`;
  }
  s += `<circle cx="480" cy="200" r="150" fill="none" stroke="${a}" stroke-width="2.2" opacity="0.9"/>`;
  for (let k = 0; k < 7; k++) {
    const ry = 26 + k * 18;
    const wob = 14 * Math.sin(k * 1.7);
    s += `<ellipse cx="820" cy="200" rx="${150 + wob}" ry="${ry}" fill="none" stroke="${b}" stroke-width="1.6" opacity="${(0.8 - k * 0.08).toFixed(2)}" transform="rotate(${(k * 5 - 12).toFixed(0)} 820 200)"/>`;
  }
  s += `<circle cx="820" cy="200" r="152" fill="none" stroke="${b}" stroke-width="2.2" opacity="0.85" stroke-dasharray="10 6"/>`;
  s += `<text x="452" y="374" font-family="Georgia" font-size="20" fill="#e7e5e4" opacity="0.6">SL₂</text><text x="782" y="374" font-family="Georgia" font-size="20" fill="#e7e5e4" opacity="0.6">exotic</text>`;
  return s;
};

/* erdos 848: residue grid mod 25 */
art['erdos-848-all-n'] = (a, b) => {
  let s = '';
  const cols = 25, rows = 8, cell = 34, ox = 140, oy = 54;
  for (let i = 0; i < rows; i++) for (let j = 0; j < cols; j++) {
    const nval = i * cols + j + 1, res = nval % 25;
    const hot = res === 7 || res === 18;
    s += `<rect x="${ox + j * cell}" y="${oy + i * cell}" width="${cell - 4}" height="${cell - 4}" rx="4" fill="${hot ? (res === 7 ? a : b) : '#e7e5e4'}" opacity="${hot ? 0.95 : 0.08}"/>`;
  }
  return s;
};

/* reducible incidence: rational normal curve + tangent developable */
art['reducible-incidence-divisors'] = (a, b) => {
  const P = t => [180 + 840 * t, 330 - 620 * t + 640 * t * t - 60 * Math.sin(3 * t)];
  let s = '', p = '';
  for (let i = 0; i <= 60; i++) { const [x, y] = P(i / 60); p += `${i ? 'L' : 'M'} ${x.toFixed(1)} ${y.toFixed(1)} `; }
  for (let i = 2; i <= 58; i += 3) {
    const t = i / 60, [x, y] = P(t), [x2, y2] = P(t + 0.016);
    const dx = x2 - x, dy = y2 - y, m = Math.hypot(dx, dy);
    s += `<line x1="${(x - dx / m * 190).toFixed(1)}" y1="${(y - dy / m * 190).toFixed(1)}" x2="${(x + dx / m * 190).toFixed(1)}" y2="${(y + dy / m * 190).toFixed(1)}" stroke="${b}" stroke-width="1.1" opacity="0.4"/>`;
  }
  s += `<path d="${p}" fill="none" stroke="${a}" stroke-width="3.4" opacity="0.95"/>`;
  return s;
};

/* Stocks are not flows: two observed tenure stocks, many admissible paths */
art['stocks-are-not-flows'] = (a, b) => {
  let s = '';
  const house = (x, y, col, opacity = 1) =>
    `<path d="M ${x} ${y + 18} L ${x + 22} ${y} L ${x + 44} ${y + 18} V ${y + 52} H ${x} Z" fill="${col}" opacity="${opacity}"/>`;
  const left = [
    ['owner', 8, a],
    ['rent', 3, b]
  ];
  const right = [
    ['owner', 6, a],
    ['rent', 5, b]
  ];
  for (const [side, groups] of [['left', left], ['right', right]]) {
    const ox = side === 'left' ? 105 : 835;
    let k = 0;
    for (const [, n, col] of groups) for (let i = 0; i < n; i++, k++) {
      const x = ox + (k % 4) * 64;
      const y = 64 + Math.floor(k / 4) * 78;
      s += house(x, y, col, 0.88);
    }
  }
  s += `<path d="M 390 135 C 500 50, 700 50, 810 135" fill="none" stroke="${a}" stroke-width="3" stroke-dasharray="10 10" opacity="0.65"/>`;
  s += `<path d="M 390 270 C 510 350, 690 350, 810 270" fill="none" stroke="${b}" stroke-width="3" stroke-dasharray="10 10" opacity="0.65"/>`;
  s += `<path d="M 390 205 C 515 125, 685 285, 810 205" fill="none" stroke="#e7e5e4" stroke-width="2" stroke-dasharray="5 10" opacity="0.35"/>`;
  s += `<circle cx="600" cy="200" r="78" fill="#151a1e" stroke="#e7e5e4" stroke-width="2" opacity="0.95"/>`;
  s += `<text x="600" y="226" text-anchor="middle" font-family="Georgia" font-size="82" fill="#e7e5e4" opacity="0.92">≠</text>`;
  return s;
};

/* Affine diversification fibres: many compatible histories with sharp bounds. */
art['affine-diversification-fibres'] = (a, b) => {
  let s = '';
  const x0 = 120, x1 = 1040, y0 = 330;
  const pathFor = (offset, amplitude, colour, width, opacity, dash = '') => {
    let p = `M ${x0} ${y0 - offset}`;
    for (let x = 0; x <= x1 - x0; x += 10) {
      const t = x / (x1 - x0);
      const y = y0 - offset - amplitude * (0.24 * Math.sin(t * Math.PI * 2.4) + 0.76 * t);
      p += ` L ${(x0 + x).toFixed(1)} ${y.toFixed(1)}`;
    }
    return `<path d="${p}" fill="none" stroke="${colour}" stroke-width="${width}" opacity="${opacity}"${dash ? ` stroke-dasharray="${dash}"` : ''}/>`;
  };
  for (const [offset, amplitude, opacity] of [[12, 62, 0.22], [26, 88, 0.28], [42, 116, 0.34], [60, 142, 0.4], [78, 166, 0.46]]) {
    s += pathFor(offset, amplitude, '#e7e5e4', 2, opacity);
  }
  s += pathFor(10, 194, a, 4, 0.96);
  s += pathFor(94, 118, b, 4, 0.96);
  s += `<path d="M ${x0} 80 V 350 M ${x0} 350 H ${x1}" stroke="#8a938f" stroke-width="1" opacity="0.5"/>`;
  s += `<path d="M 120 102 C 280 78, 440 126, 600 102 S 900 126, 1040 102" fill="none" stroke="${a}" stroke-width="2" stroke-dasharray="6 8" opacity="0.7"/>`;
  s += `<circle cx="120" cy="320" r="7" fill="${a}"/><circle cx="1040" cy="184" r="7" fill="${b}"/>`;
  s += `<text x="1055" y="190" font-family="Georgia" font-size="22" fill="#e7e5e4" opacity="0.85">sharp bounds</text>`;
  return s;
};

/* TxGraffiti candidate: cubic graph, explicit witnesses, and certificate tree. */
art['txgraffiti-c3-resolution'] = (a, b) => {
  const N = 50, cx = 390, cy = 200, R = 145;
  const pt = k => [cx + R * Math.cos(2 * Math.PI * k / N - Math.PI / 2), cy + R * Math.sin(2 * Math.PI * k / N - Math.PI / 2)];
  const r = rng(hash('txgraffiti-c3-resolution'));
  let s = '';
  for (let i = 0; i < N; i++) for (const d of [1, 7, 19]) {
    const j = (i + d) % N;
    if (i < j) {
      const [x1, y1] = pt(i), [x2, y2] = pt(j);
      s += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="#8a938f" stroke-width="0.9" opacity="${(0.16 + r() * 0.16).toFixed(2)}"/>`;
    }
  }
  const witness = [0, 7, 19, 26, 38, 45];
  for (const k of witness) { const [x, y] = pt(k); s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="6" fill="${k % 2 ? b : a}"/>`; }
  s += `<path d="M 710 92 H 1080 M 710 200 H 1080 M 710 308 H 1080 M 710 92 L 760 200 L 710 308 M 760 200 H 840" fill="none" stroke="${a}" stroke-width="2" opacity="0.72"/>`;
  for (const [x, y, rr, col] of [[710, 92, 14, a], [710, 200, 14, b], [710, 308, 14, a], [840, 200, 14, b], [1080, 92, 10, '#e7e5e4'], [1080, 200, 10, '#e7e5e4'], [1080, 308, 10, '#e7e5e4']]) s += `<circle cx="${x}" cy="${y}" r="${rr}" fill="${col}" opacity="0.92"/>`;
  s += `<text x="875" y="208" font-family="Georgia" font-size="44" fill="#e7e5e4" opacity="0.9">μ⋆ = 15 &lt; 16 = i</text>`;
  return s;
};

/* Bilateral deficiency: residual literal rails crossing into a cubic graph. */
art['bilateral-deficiency-regular-dim'] = (a, b) => {
  let s = '';

  /* Indexed clauses and paired literal rails.  A few muted marks suggest the
     clauses removed by a partial assignment without asserting a truth table. */
  const clauseYs = [55, 125, 195, 265, 335];
  const marks = [[a, '#e7e5e4', '#e7e5e4'], ['#e7e5e4', b, '#e7e5e4'],
    ['#e7e5e4', '#e7e5e4', b], [a, '#e7e5e4', '#e7e5e4'], ['#e7e5e4', b, a]];
  for (let i = 0; i < clauseYs.length; i++) {
    const y = clauseYs[i];
    s += `<rect x="50" y="${y - 23}" width="178" height="46" rx="23" fill="#151a1e" stroke="#e7e5e4" stroke-width="1.5" opacity="${i === 2 ? '0.34' : '0.78'}"/>`;
    for (let j = 0; j < 3; j++) {
      const x = 83 + j * 55;
      s += `<circle cx="${x}" cy="${y}" r="7" fill="#151a1e" stroke="${marks[i][j]}" stroke-width="2" opacity="${i === 2 ? '0.38' : '0.96'}"/>`;
      const rail = (i + j * 2) % 6;
      const targetX = (i + j) % 2 ? 395 : 325;
      const targetY = 45 + rail * 61;
      s += `<path d="M ${x + 8} ${y} C 245 ${y}, 270 ${targetY}, ${targetX - 10} ${targetY}" fill="none" stroke="#e7e5e4" stroke-width="0.9" opacity="${i === 2 ? '0.08' : '0.24'}"/>`;
    }
  }
  for (let i = 0; i < 6; i++) {
    const y = 45 + i * 61;
    s += `<circle cx="325" cy="${y}" r="11" fill="#151a1e" stroke="${a}" stroke-width="2.2" opacity="0.94"/>`;
    s += `<circle cx="395" cy="${y}" r="11" fill="#151a1e" stroke="${b}" stroke-width="2.2" opacity="0.94"/>`;
    s += `<line x1="337" y1="${y}" x2="383" y2="${y}" stroke="#e7e5e4" stroke-width="1" stroke-dasharray="4 5" opacity="0.38"/>`;
  }

  /* The centre is a size-preserving correspondence: two ordered banks joined
     by balanced curves, intentionally neither a one-way arrow nor a proof tree. */
  const leftY = [66, 112, 158, 242, 288, 334];
  const rightY = [82, 128, 174, 226, 272, 318];
  for (let i = 0; i < leftY.length; i++) {
    s += `<circle cx="505" cy="${leftY[i]}" r="5.5" fill="${i < 3 ? a : '#e7e5e4'}" opacity="${i < 3 ? '0.88' : '0.48'}"/>`;
    s += `<circle cx="670" cy="${rightY[i]}" r="5.5" fill="${i > 2 ? b : '#e7e5e4'}" opacity="${i > 2 ? '0.88' : '0.48'}"/>`;
    for (let j = 0; j < rightY.length; j++) if ((i + j) % 2 === 0) {
      const colour = i < 3 ? a : b;
      s += `<path d="M 511 ${leftY[i]} C 565 ${leftY[i]}, 610 ${rightY[j]}, 664 ${rightY[j]}" fill="none" stroke="${colour}" stroke-width="1.15" opacity="0.30"/>`;
    }
  }
  s += `<path d="M 545 200 C 575 154, 600 154, 630 200 C 600 246, 575 246, 545 200 Z" fill="#151a1e" stroke="#e7e5e4" stroke-width="1.5" opacity="0.82"/>`;
  s += `<circle cx="587.5" cy="200" r="7" fill="${a}" opacity="0.9"/><circle cx="587.5" cy="200" r="15" fill="none" stroke="${b}" stroke-width="1.5" opacity="0.65"/>`;

  /* A generalized Petersen graph gives an exact cubic visual scaffold.  Three separated
     spokes are highlighted as matching edges; the artwork is illustrative,
     not an encoding of the released 50-vertex object. */
  const cx = 925, cy = 200, outerR = 158, innerR = 82, n = 10;
  const outer = k => [cx + outerR * Math.cos(2 * Math.PI * k / n - Math.PI / 2), cy + outerR * Math.sin(2 * Math.PI * k / n - Math.PI / 2)];
  const inner = k => [cx + innerR * Math.cos(2 * Math.PI * k / n - Math.PI / 2), cy + innerR * Math.sin(2 * Math.PI * k / n - Math.PI / 2)];
  const line = (p, q, colour = '#e7e5e4', width = 1.5, opacity = 0.56) =>
    `<line x1="${p[0].toFixed(1)}" y1="${p[1].toFixed(1)}" x2="${q[0].toFixed(1)}" y2="${q[1].toFixed(1)}" stroke="${colour}" stroke-width="${width}" opacity="${opacity}"/>`;
  for (let i = 0; i < n; i++) {
    s += line(outer(i), outer((i + 1) % n));
    s += line(inner(i), inner((i + 2) % n));
    const highlighted = [0, 3, 6].includes(i);
    s += line(outer(i), inner(i), highlighted ? a : '#e7e5e4', highlighted ? 5 : 1.2, highlighted ? 0.98 : 0.42);
  }
  for (let i = 0; i < n; i++) {
    for (const [p, isOuter] of [[outer(i), true], [inner(i), false]]) {
      const matched = [0, 3, 6].includes(i);
      s += `<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="${isOuter ? 7 : 6}" fill="${matched ? b : '#151a1e'}" stroke="${matched ? '#f8d4e8' : '#e7e5e4'}" stroke-width="1.8" opacity="0.96"/>`;
    }
  }
  for (let k = 0; k < 3; k++) {
    const x = 1110 + k * 34, y = 90 + k * 108;
    s += `<path d="M ${x} ${y} l 24 -14 l 22 16 l -5 28 l -28 5 l -19 -18 Z" fill="none" stroke="${k % 2 ? b : a}" stroke-width="1" stroke-dasharray="3 5" opacity="${0.22 - k * 0.04}"/>`;
  }
  return s;
};

/* Fixed-seed cyclicity: Krylov frame meeting quartic and quintic rank loci. */
art['cyclicity-loci-exponential-periods'] = (a, b) => {
  let s = '';
  const ox = 115, oy = 70, cw = 58, ch = 48;
  for (let col = 0; col < 4; col++) {
    for (let row = 0; row < 5; row++) {
      const active = row <= col + 1;
      s += `<rect x="${ox + col * cw}" y="${oy + row * ch}" width="42" height="32" rx="6" fill="${active ? a : '#e7e5e4'}" opacity="${active ? (0.34 + col * 0.12).toFixed(2) : '0.07'}"/>`;
    }
    s += `<text x="${ox + col * cw + 21}" y="340" text-anchor="middle" font-family="Georgia" font-size="20" fill="#e7e5e4" opacity="0.72">∇${col ? `<tspan baseline-shift="super" font-size="13">${col}</tspan>` : ''}</text>`;
  }
  s += `<path d="M 455 340 V 55 M 455 340 H 1125" stroke="#8a938f" stroke-width="1" opacity="0.48"/>`;
  s += `<path d="M 455 235 C 575 235, 610 82, 735 132 S 885 310, 1035 210" fill="none" stroke="${a}" stroke-width="4" opacity="0.9"/>`;
  s += `<path d="M 455 305 C 595 255, 700 350, 810 245 S 1010 90, 1125 145" fill="none" stroke="${b}" stroke-width="4" opacity="0.88"/>`;
  for (const [x, y, col] of [[455, 235, a], [690, 122, a], [810, 245, b], [1035, 210, a]]) {
    s += `<circle cx="${x}" cy="${y}" r="8" fill="${col}" stroke="#151a1e" stroke-width="3"/>`;
  }
  s += `<rect x="570" y="45" width="390" height="58" rx="12" fill="#151a1e" stroke="${b}" stroke-width="1.5" opacity="0.94"/>`;
  s += `<text x="765" y="82" text-anchor="middle" font-family="Georgia" font-size="25" fill="#e7e5e4">det M = 0 · fixed-seed rank drops</text>`;
  s += `<text x="490" y="330" font-family="Georgia" font-size="18" fill="${a}" opacity="0.9">persistent</text>`;
  s += `<text x="1000" y="330" font-family="Georgia" font-size="18" fill="${b}" opacity="0.9">pointwise</text>`;
  return s;
};

/* Root-span cyclicity: inverse branches, trace removal, and block fusion. */
art['cyclicity-root-span-low-rank'] = (a, b) => {
  let s = '';

  /* Inverse branches emanate from one target value. Their pale barycentre is
     removed before the coloured trace-free directions are counted. */
  const source = [155, 200];
  const branchEnds = [[360, 58], [390, 116], [405, 178], [405, 238], [390, 296], [360, 350]];
  for (let i = 0; i < branchEnds.length; i++) {
    const [x, y] = branchEnds[i];
    const col = i % 2 ? b : a;
    s += `<path d="M ${source[0]} ${source[1]} C 245 ${source[1]}, 275 ${y}, ${x} ${y}" fill="none" stroke="${col}" stroke-width="4" opacity="${(0.58 + i * 0.055).toFixed(2)}"/>`;
    s += `<circle cx="${x}" cy="${y}" r="9" fill="${col}" stroke="#151a1e" stroke-width="3"/>`;
  }
  s += `<circle cx="${source[0]}" cy="${source[1]}" r="22" fill="#151a1e" stroke="#e7e5e4" stroke-width="2"/>`;
  s += `<text x="${source[0]}" y="${source[1] + 7}" text-anchor="middle" font-family="Georgia" font-size="23" fill="#e7e5e4">z</text>`;
  s += `<line x1="315" y1="52" x2="315" y2="350" stroke="#e7e5e4" stroke-width="1.5" stroke-dasharray="8 9" opacity="0.24"/>`;
  s += `<text x="245" y="385" text-anchor="middle" font-family="Georgia" font-size="19" fill="#e7e5e4" opacity="0.72">inverse roots − common trace</text>`;

  /* The central equality is the load-bearing statement, explicitly marked as
     conditional rather than presented as an unconditional fact. */
  s += `<rect x="470" y="96" width="300" height="208" rx="24" fill="#151a1e" stroke="${a}" stroke-width="2.5" opacity="0.96"/>`;
  s += `<text x="620" y="158" text-anchor="middle" font-family="Georgia" font-size="25" fill="#e7e5e4">fixed-seed rank</text>`;
  s += `<text x="620" y="222" text-anchor="middle" font-family="Georgia" font-size="47" fill="${a}">q = dim W</text>`;
  s += `<text x="620" y="266" text-anchor="middle" font-family="ui-monospace,monospace" font-size="16" fill="${b}" opacity="0.94">under the imported bridge</text>`;
  s += `<path d="M 426 200 H 458 M 782 200 H 814" stroke="#e7e5e4" stroke-width="2" stroke-dasharray="7 8" opacity="0.52"/>`;

  /* Three outer blocks collapse onto one span. This is the unresolved
     compositional phenomenon rather than a claimed complete atlas. */
  const blockY = [82, 200, 318];
  for (let i = 0; i < blockY.length; i++) {
    const y = blockY[i];
    s += `<rect x="835" y="${y - 35}" width="128" height="70" rx="14" fill="${i === 1 ? b : a}" opacity="${i === 1 ? '0.80' : '0.54'}"/>`;
    s += `<text x="899" y="${y + 8}" text-anchor="middle" font-family="Georgia" font-size="27" fill="#151a1e">block ${i + 1}</text>`;
    s += `<path d="M 963 ${y} C 1005 ${y}, 1014 200, 1052 200" fill="none" stroke="${i === 1 ? b : a}" stroke-width="4" opacity="0.88"/>`;
  }
  s += `<circle cx="1078" cy="200" r="32" fill="#151a1e" stroke="${b}" stroke-width="4"/>`;
  s += `<text x="1078" y="209" text-anchor="middle" font-family="Georgia" font-size="30" fill="#e7e5e4">W</text>`;
  s += `<text x="985" y="382" text-anchor="middle" font-family="Georgia" font-size="19" fill="#e7e5e4" opacity="0.74">composition can fuse spans</text>`;
  return s;
};

/* Certified commitment horizons: a protected prefix and a later departure. */
art['certified-commitment-horizons'] = (a, b) => {
  const xs = [110, 275, 440, 605, 770, 935, 1090];
  const y = 245;
  let s = '';
  s += `<path d="M ${xs[0]} ${y} C 170 105, 215 105, ${xs[1]} ${y} S 380 385, ${xs[2]} ${y} S 545 105, ${xs[3]} ${y} S 710 385, ${xs[4]} ${y}" fill="none" stroke="${a}" stroke-width="7" opacity="0.96"/>`;
  s += `<path d="M ${xs[0]} ${y} C 170 105, 215 105, ${xs[1]} ${y} S 380 385, ${xs[2]} ${y}" fill="none" stroke="#e7e5e4" stroke-width="2" opacity="0.8"/>`;
  s += `<path d="M ${xs[2]} ${y} C 540 35, 670 35, ${xs[4]} ${y} S 975 365, ${xs[6]} ${y}" fill="none" stroke="${b}" stroke-width="5" stroke-dasharray="13 9" opacity="0.94"/>`;
  for (let i = 0; i < xs.length; i++) {
    const colour = i <= 2 ? a : (i === 4 || i === 6 ? b : '#e7e5e4');
    s += `<circle cx="${xs[i]}" cy="${y}" r="${i <= 2 ? 13 : 9}" fill="${colour}" opacity="0.95"/>`;
  }
  s += `<path d="M ${xs[0]} 330 V 360 H ${xs[2]} V 330" fill="none" stroke="${a}" stroke-width="3" opacity="0.9"/>`;
  s += `<text x="${(xs[0] + xs[2]) / 2}" y="388" text-anchor="middle" font-family="Georgia" font-size="21" fill="#e7e5e4" opacity="0.82">protected prefix</text>`;
  s += `<text x="745" y="92" text-anchor="middle" font-family="Georgia" font-size="37" fill="#e7e5e4" opacity="0.92">3/2 ≤ ρ ≤ 2</text>`;
  return s;
};

/* Bordered Jacobian: rectangular multiplication matrix, border and kernel. */
art['bordered-jacobian-foundations'] = (a, b) => {
  let s = '';
  const ox = 135, oy = 70, cols = 10, rows = 6, cw = 52, ch = 42;
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const band = Math.abs(j - i) <= 2 || Math.abs(j - i - 3) <= 1;
      s += `<rect x="${ox + j * cw}" y="${oy + i * ch}" width="38" height="28" rx="5" fill="${band ? a : '#e7e5e4'}" opacity="${band ? (0.26 + 0.07 * ((i + j) % 4)).toFixed(2) : '0.06'}"/>`;
    }
  }
  const by = oy + rows * ch + 20;
  s += `<rect x="${ox - 18}" y="${by - 12}" width="${cols * cw + 22}" height="50" rx="11" fill="none" stroke="${b}" stroke-width="3" opacity="0.95"/>`;
  for (let j = 0; j < cols; j++) {
    s += `<circle cx="${ox + j * cw + 19}" cy="${by + 13}" r="6" fill="${j < 5 ? b : a}" opacity="0.9"/>`;
  }
  s += `<path d="M 760 95 C 850 95, 850 190, 940 190 S 1030 285, 1110 285" fill="none" stroke="${a}" stroke-width="5" opacity="0.9"/>`;
  s += `<path d="M 760 300 C 850 300, 850 205, 940 205 S 1030 110, 1110 110" fill="none" stroke="${b}" stroke-width="5" opacity="0.9"/>`;
  s += `<circle cx="940" cy="198" r="18" fill="#151a1e" stroke="#e7e5e4" stroke-width="2"/>`;
  s += `<text x="940" y="207" text-anchor="middle" font-family="Georgia" font-size="27" fill="#e7e5e4">κ</text>`;
  s += `<text x="805" y="370" font-family="Georgia" font-size="25" fill="#e7e5e4" opacity="0.88">det[M; v] = ± Res · ⟨v, κ⟩</text>`;
  return s;
};

/* Exact Smith invariants: affine minors, complete-edge characters, and SNF. */
art['exact-smith-invariants-affine-determinant-lines'] = (a, b) => {
  let s = '';

  /* A small banded coefficient matrix with a complementary-minor border. */
  const ox = 70, oy = 68, rows = 6, cols = 7, cw = 43, ch = 40;
  for (let i = 0; i < rows; i++) for (let j = 0; j < cols; j++) {
    const live = Math.abs(j - i) <= 1 || Math.abs(j - i - 2) === 0;
    s += `<rect x="${ox + j * cw}" y="${oy + i * ch}" width="31" height="27" rx="5" fill="${live ? a : '#e7e5e4'}" opacity="${live ? (0.34 + 0.08 * ((i + j) % 3)).toFixed(2) : '0.06'}"/>`;
  }
  s += `<path d="M 54 326 H 384" stroke="${b}" stroke-width="4" opacity="0.9"/>`;
  for (let j = 0; j < cols; j++) s += `<circle cx="${ox + j * cw + 15}" cy="326" r="6" fill="${j % 2 ? a : b}"/>`;

  /* Complete graph of pairwise resultant characters. */
  const cx = 620, cy = 200, R = 142, n = 5;
  const pt = k => [cx + R * Math.cos(2 * Math.PI * k / n - Math.PI / 2), cy + R * Math.sin(2 * Math.PI * k / n - Math.PI / 2)];
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
    const [x1, y1] = pt(i), [x2, y2] = pt(j);
    s += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${(i + j) % 2 ? a : b}" stroke-width="2.2" opacity="0.58"/>`;
  }
  for (let i = 0; i < n; i++) {
    const [x, y] = pt(i);
    s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="18" fill="#151a1e" stroke="${i % 2 ? b : a}" stroke-width="3"/>`;
    s += `<text x="${x.toFixed(1)}" y="${(y + 7).toFixed(1)}" text-anchor="middle" font-family="Georgia" font-size="21" fill="#e7e5e4">d${i + 1}</text>`;
  }
  s += `<circle cx="${cx}" cy="${cy}" r="34" fill="#151a1e" stroke="#e7e5e4" stroke-width="2" opacity="0.96"/>`;
  s += `<text x="${cx}" y="${cy + 8}" text-anchor="middle" font-family="Georgia" font-size="28" fill="#e7e5e4">Res</text>`;

  /* Smith factors and their local prime decomposition. */
  const bx = 865, bw = 245;
  for (let i = 0; i < 4; i++) {
    const y = 82 + i * 63;
    const w = i === 3 ? bw : 118;
    s += `<rect x="${bx}" y="${y}" width="${w}" height="35" rx="8" fill="${i === 3 ? b : a}" opacity="${i === 3 ? '0.86' : (0.40 + i * 0.10).toFixed(2)}"/>`;
    s += `<text x="${bx + 16}" y="${y + 25}" font-family="ui-monospace,monospace" font-size="19" fill="#151a1e">${i === 3 ? 'g h(e)' : 'g'}</text>`;
  }
  s += `<text x="${bx}" y="348" font-family="Georgia" font-size="25" fill="#e7e5e4" opacity="0.9">SNF = diag(g, ..., g, gh)</text>`;
  s += `<path d="M 392 200 H 432 M 808 200 H 848" stroke="#e7e5e4" stroke-width="2" stroke-dasharray="7 8" opacity="0.55"/>`;
  return s;
};

/* Hahn--Ewens: two endpoint laws, binomial word layers, and trace transition. */
art['hahn-ewens-mixing-theorem'] = (a, b) => {
  let s = '';

  /* The two endpoint contributions to E|U-V|^ell. */
  s += `<path d="M 72 326 C 92 326, 104 88, 176 78 C 244 68, 272 205, 338 322" fill="none" stroke="${a}" stroke-width="5" opacity="0.94"/>`;
  s += `<path d="M 104 322 C 170 205, 198 70, 266 82 C 342 95, 354 326, 384 326" fill="none" stroke="${b}" stroke-width="4" stroke-dasharray="12 8" opacity="0.9"/>`;
  s += `<line x1="72" y1="326" x2="384" y2="326" stroke="#8a938f" stroke-width="1.5" opacity="0.5"/>`;
  s += `<circle cx="88" cy="310" r="7" fill="${a}"/><circle cx="368" cy="310" r="7" fill="${b}"/>`;
  s += `<text x="92" y="365" font-family="Georgia" font-size="20" fill="${a}" opacity="0.9">+ endpoint</text>`;
  s += `<text x="374" y="365" text-anchor="end" font-family="Georgia" font-size="20" fill="${b}" opacity="0.9">− endpoint</text>`;

  /* Binomially many word modes arranged by square-free degree. */
  const counts = [1, 6, 15, 20, 15, 6, 1];
  const cx = 575, top = 55, gap = 46;
  for (let ell = 0; ell < counts.length; ell++) {
    const shown = Math.min(counts[ell], 9);
    const span = (shown - 1) * 21;
    const y = top + ell * gap;
    s += `<line x1="442" y1="${y}" x2="706" y2="${y}" stroke="#e7e5e4" stroke-width="1" opacity="0.08"/>`;
    for (let j = 0; j < shown; j++) {
      const x = cx - span / 2 + j * 21;
      const opacity = (0.36 + 0.055 * Math.min(counts[ell], 9)).toFixed(2);
      s += `<circle cx="${x}" cy="${y}" r="${ell === 3 ? 7 : 5.5}" fill="${ell % 2 ? b : a}" opacity="${opacity}"/>`;
    }
    if (counts[ell] > shown) s += `<text x="700" y="${y + 6}" font-family="ui-monospace,monospace" font-size="16" fill="#e7e5e4" opacity="0.7">×${counts[ell]}</text>`;
    s += `<text x="426" y="${y + 6}" text-anchor="end" font-family="ui-monospace,monospace" font-size="15" fill="#e7e5e4" opacity="0.56">ℓ=${ell}</text>`;
  }
  s += `<text x="575" y="382" text-anchor="middle" font-family="Georgia" font-size="22" fill="#e7e5e4" opacity="0.86">dim Wℓ = C(N,ℓ)</text>`;

  /* The trace observable drops across its N/log N scale. */
  const left = 790, right = 1132, base = 326, ceiling = 68, threshold = 965;
  s += `<line x1="${left}" y1="${base}" x2="${right}" y2="${base}" stroke="#8a938f" stroke-width="1.5" opacity="0.55"/>`;
  s += `<line x1="${left}" y1="${ceiling}" x2="${left}" y2="${base}" stroke="#8a938f" stroke-width="1.5" opacity="0.55"/>`;
  let trace = `M ${left} 88`;
  for (let k = 0; k <= 68; k++) {
    const x = left + k * 5;
    const z = (x - threshold) / 22;
    const y = 88 + 220 / (1 + Math.exp(-z));
    trace += ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  s += `<path d="${trace}" fill="none" stroke="${a}" stroke-width="6" opacity="0.96"/>`;
  s += `<line x1="${threshold}" y1="${ceiling}" x2="${threshold}" y2="${base}" stroke="${b}" stroke-width="3" stroke-dasharray="10 8" opacity="0.92"/>`;
  s += `<circle cx="${threshold}" cy="198" r="10" fill="${b}" stroke="#151a1e" stroke-width="3"/>`;
  s += `<text x="${threshold}" y="48" text-anchor="middle" font-family="Georgia" font-size="22" fill="${b}">[log 2/(2δ)] N/log N</text>`;
  s += `<text x="${left + 8}" y="355" font-family="Georgia" font-size="18" fill="#e7e5e4" opacity="0.7">stationary-average trace</text>`;

  s += `<path d="M 398 200 H 422 M 724 200 H 768" stroke="#e7e5e4" stroke-width="2" stroke-dasharray="7 8" opacity="0.5"/>`;
  return s;
};

/* Polydegree certificates: transverse coefficient curves and their Jacobian. */
art['smooth-point-certificates-polydegree-containments'] = (a, b) => {
  let s = '';

  /* Two coefficient zero loci cross transversely at one certified point. */
  s += `<path d="M 70 306 C 160 82, 302 70, 450 314" fill="none" stroke="${a}" stroke-width="5" opacity="0.94"/>`;
  s += `<path d="M 84 112 C 210 334, 346 336, 456 96" fill="none" stroke="${b}" stroke-width="5" opacity="0.9"/>`;
  s += `<circle cx="267" cy="205" r="16" fill="#151a1e" stroke="#e7e5e4" stroke-width="4"/>`;
  s += `<circle cx="267" cy="205" r="6" fill="${a}"/>`;
  s += `<line x1="267" y1="205" x2="343" y2="145" stroke="${a}" stroke-width="3" opacity="0.82"/>`;
  s += `<line x1="267" y1="205" x2="339" y2="278" stroke="${b}" stroke-width="3" opacity="0.82"/>`;
  s += `<text x="76" y="365" font-family="Georgia" font-size="21" fill="#e7e5e4" opacity="0.82">smooth intersection</text>`;

  /* The next coefficient hypersurface stays away from the good point. */
  s += `<path d="M 62 58 C 188 138, 346 24, 472 104" fill="none" stroke="#e7e5e4" stroke-width="2.5" stroke-dasharray="11 9" opacity="0.42"/>`;
  s += `<text x="336" y="54" font-family="ui-monospace,monospace" font-size="17" fill="#e7e5e4" opacity="0.7">G₍d+2₎ ≠ 0</text>`;

  /* Local derivative matrix and determinant-to-Jacobian identity. */
  const ox = 560, oy = 84, cell = 58;
  s += `<path d="M ${ox - 22} ${oy - 18} H ${ox - 34} V ${oy + 3 * cell + 12} H ${ox - 22} M ${ox + 3 * cell + 22} ${oy - 18} H ${ox + 3 * cell + 34} V ${oy + 3 * cell + 12} H ${ox + 3 * cell + 22}" fill="none" stroke="#e7e5e4" stroke-width="3" opacity="0.75"/>`;
  for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) {
    const hot = i === j || i + j === 2;
    s += `<rect x="${ox + j * cell}" y="${oy + i * cell}" width="42" height="42" rx="8" fill="${hot ? (i % 2 ? b : a) : '#e7e5e4'}" opacity="${hot ? '0.72' : '0.09'}"/>`;
    s += `<text x="${ox + j * cell + 21}" y="${oy + i * cell + 28}" text-anchor="middle" font-family="Georgia" font-size="18" fill="#151a1e">∂</text>`;
  }
  s += `<text x="647" y="318" text-anchor="middle" font-family="Georgia" font-size="24" fill="#e7e5e4" opacity="0.9">Jacobian</text>`;

  s += `<text x="805" y="155" font-family="Georgia" font-size="38" fill="#e7e5e4" opacity="0.92">a₍d,e₎ = (−1)ᵉ det Dg</text>`;
  s += `<path d="M 785 202 H 1126" stroke="${a}" stroke-width="3" opacity="0.78"/>`;
  s += `<text x="805" y="258" font-family="Georgia" font-size="29" fill="${b}" opacity="0.96">simple zero ⇒ lift</text>`;
  s += `<text x="805" y="302" font-family="ui-monospace,monospace" font-size="18" fill="#e7e5e4" opacity="0.7">finite field → ℤₚ → ℂ</text>`;
  s += `<path d="M 478 205 H 520 M 748 205 H 782" stroke="#e7e5e4" stroke-width="2" stroke-dasharray="7 8" opacity="0.5"/>`;
  return s;
};

/* certified two-item JRP: two order lattices, shared epochs and a closing tail */
art['certified-two-item-jrp'] = (a, b) => {
  let s = '';
  const x0 = 105, step = 78;
  s += `<line x1="${x0}" y1="128" x2="575" y2="128" stroke="#d6dcdd" stroke-width="2" opacity=".55"/>`;
  s += `<line x1="${x0}" y1="268" x2="575" y2="268" stroke="#d6dcdd" stroke-width="2" opacity=".55"/>`;
  for (let k = 0; k <= 6; k++) {
    const x = x0 + k * step;
    s += `<line x1="${x}" y1="108" x2="${x}" y2="148" stroke="${a}" stroke-width="4"/>`;
  }
  for (let k = 0; k <= 4; k++) {
    const x = x0 + k * step * 1.5;
    s += `<line x1="${x}" y1="248" x2="${x}" y2="288" stroke="${b}" stroke-width="4"/>`;
  }
  for (const x of [x0, x0 + 3 * step, x0 + 6 * step]) {
    s += `<line x1="${x}" y1="148" x2="${x}" y2="248" stroke="#e7e5e4" stroke-width="1.5" stroke-dasharray="6 7" opacity=".55"/>`;
    s += `<circle cx="${x}" cy="198" r="8" fill="#e7e5e4" opacity=".9"/>`;
  }
  s += `<text x="${x0}" y="88" font-family="ui-monospace,monospace" font-size="17" fill="${a}">T₁ = qt</text>`;
  s += `<text x="${x0}" y="330" font-family="ui-monospace,monospace" font-size="17" fill="${b}">T₂ = pt</text>`;

  s += `<line x1="650" y1="326" x2="1125" y2="326" stroke="#8a938f" stroke-width="1" opacity=".5"/>`;
  s += `<line x1="650" y1="68" x2="650" y2="326" stroke="#8a938f" stroke-width="1" opacity=".5"/>`;
  let curve = 'M 664 300';
  for (let k = 0; k <= 52; k++) {
    const x = 664 + k * 8.5;
    const y = 300 - 188 * (1 - Math.exp(-k / 13));
    curve += ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  s += `<path d="${curve}" fill="none" stroke="${a}" stroke-width="4" opacity=".95"/>`;
  s += `<line x1="650" y1="103" x2="1125" y2="103" stroke="${b}" stroke-width="2.5" stroke-dasharray="10 8" opacity=".8"/>`;
  s += `<circle cx="1003" cy="112" r="8" fill="${a}"/>`;
  s += `<text x="1118" y="91" text-anchor="end" font-family="ui-monospace,monospace" font-size="16" fill="${b}">Mᵣ</text>`;
  s += `<text x="1118" y="355" text-anchor="end" font-family="ui-monospace,monospace" font-size="15" fill="#d6dcdd" opacity=".75">enumeration cutoff S</text>`;
  return s;
};

/* Two very different histories, one spectrum; and the certified band. */
art['sfs-identifiability-audit'] = (a, b) => {
  let s = '';
  /* Left: severe-crash history and continuous history over time. */
  s += `<line x1="90" y1="300" x2="520" y2="300" stroke="#8a938f" stroke-width="1" opacity=".5"/>`;
  s += `<line x1="90" y1="80" x2="90" y2="300" stroke="#8a938f" stroke-width="1" opacity=".5"/>`;
  s += `<path d="M 100 150 L 250 150 L 250 272 L 310 272 L 310 150 L 510 150" fill="none" stroke="${a}" stroke-width="4"/>`;
  let smooth = 'M 100 150';
  for (let k = 0; k <= 41; k++) {
    const x = 100 + k * 10;
    const y = 150 + 42 * Math.exp(-((x - 280) ** 2) / 6200);
    smooth += ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  s += `<path d="${smooth}" fill="none" stroke="${b}" stroke-width="4" stroke-dasharray="1 0" opacity=".95"/>`;
  s += `<text x="100" y="66" font-family="ui-monospace,monospace" font-size="16" fill="${a}">severe crash</text>`;
  s += `<text x="290" y="66" font-family="ui-monospace,monospace" font-size="16" fill="${b}">continuous</text>`;
  s += `<text x="100" y="340" font-family="ui-monospace,monospace" font-size="15" fill="#d6dcdd" opacity=".75">two histories</text>`;
  /* Middle: both map to one identical spectrum (bars). */
  s += `<text x="560" y="196" font-family="ui-monospace,monospace" font-size="24" fill="#e7e5e4" opacity=".85">→</text>`;
  for (let k = 0; k < 9; k++) {
    const h = 150 * (1 / (k + 1)) ** 0.72;
    s += `<rect x="${610 + k * 24}" y="${300 - h}" width="15" height="${h}" fill="#e7e5e4" opacity=".8"/>`;
  }
  s += `<text x="610" y="340" font-family="ui-monospace,monospace" font-size="15" fill="#d6dcdd" opacity=".75">one spectrum</text>`;
  /* Right: certified interval band between severity floor and baseline. */
  s += `<line x1="880" y1="90" x2="880" y2="320" stroke="#8a938f" stroke-width="1" opacity=".5"/>`;
  s += `<line x1="874" y1="110" x2="1130" y2="110" stroke="#d6dcdd" stroke-width="2" stroke-dasharray="8 7" opacity=".7"/>`;
  s += `<text x="1130" y="102" text-anchor="end" font-family="ui-monospace,monospace" font-size="15" fill="#d6dcdd">baseline 1.0</text>`;
  s += `<line x1="874" y1="296" x2="1130" y2="296" stroke="${a}" stroke-width="2" stroke-dasharray="8 7" opacity=".85"/>`;
  s += `<text x="1130" y="318" text-anchor="end" font-family="ui-monospace,monospace" font-size="15" fill="${a}">claimed severity 0.1</text>`;
  s += `<rect x="925" y="126" width="150" height="152" fill="${b}" opacity=".28"/>`;
  s += `<line x1="925" y1="126" x2="1075" y2="126" stroke="${b}" stroke-width="3.5"/>`;
  s += `<line x1="925" y1="278" x2="1075" y2="278" stroke="${b}" stroke-width="3.5"/>`;
  s += `<text x="1000" y="208" text-anchor="middle" font-family="ui-monospace,monospace" font-size="17" fill="${b}">[0.16, 0.93]</text>`;
  s += `<text x="925" y="340" font-family="ui-monospace,monospace" font-size="15" fill="#d6dcdd" opacity=".75">certified band</text>`;
  return s;
};

/* Identification synthesis: four non-injective maps and a visible selector. */
art['unique-answer-not-identified'] = (a, b) => {
  let s = '';
  const lanes = [
    ['APC', 62],
    ['EPIDEMIC', 154],
    ['SVAR', 246],
    ['AEROSOL', 338]
  ];

  /* Each field has distinct parameter values that reach the same observable. */
  for (const [label, y] of lanes) {
    s += `<text x="58" y="${y + 6}" font-family="ui-monospace,monospace" font-size="16" fill="#e7e5e4" opacity="0.72">${label}</text>`;
    s += `<circle cx="208" cy="${y - 18}" r="9" fill="${a}" opacity="0.92"/>`;
    s += `<circle cx="208" cy="${y + 18}" r="9" fill="${b}" opacity="0.92"/>`;
    s += `<text x="230" y="${y - 12}" font-family="Georgia" font-size="17" fill="${a}">θ</text>`;
    s += `<text x="230" y="${y + 24}" font-family="Georgia" font-size="17" fill="${b}">θ′</text>`;
    s += `<path d="M 248 ${y - 18} C 300 ${y - 18}, 315 ${y}, 354 ${y}" fill="none" stroke="${a}" stroke-width="2.5" opacity="0.78"/>`;
    s += `<path d="M 248 ${y + 18} C 300 ${y + 18}, 315 ${y}, 354 ${y}" fill="none" stroke="${b}" stroke-width="2.5" opacity="0.78"/>`;
    s += `<circle cx="376" cy="${y}" r="22" fill="#151a1e" stroke="#e7e5e4" stroke-width="2" opacity="0.96"/>`;
    s += `<text x="376" y="${y + 6}" text-anchor="middle" font-family="Georgia" font-size="18" fill="#e7e5e4">P</text>`;
    s += `<path d="M 400 ${y} H 474" stroke="#e7e5e4" stroke-width="2" stroke-dasharray="6 7" opacity="0.44"/>`;
  }

  /* The common diagnosis is a fibre, not a point. */
  s += `<path d="M 510 46 V 354" stroke="#e7e5e4" stroke-width="1.5" opacity="0.24"/>`;
  s += `<ellipse cx="642" cy="200" rx="104" ry="146" fill="#151a1e" stroke="${a}" stroke-width="3" opacity="0.88"/>`;
  const fibre = [[600, 95], [667, 116], [585, 172], [696, 201], [610, 249], [674, 295]];
  for (let i = 0; i < fibre.length; i++) {
    const [x, y] = fibre[i];
    s += `<circle cx="${x}" cy="${y}" r="${i === 3 ? 11 : 8}" fill="${i === 3 ? b : a}" opacity="${i === 3 ? '1' : '0.62'}"/>`;
  }
  s += `<text x="642" y="377" text-anchor="middle" font-family="Georgia" font-size="19" fill="#e7e5e4" opacity="0.82">identified set</text>`;

  /* A rule can select one element without shrinking the identified set. */
  s += `<path d="M 748 80 H 778 V 320 H 748" fill="none" stroke="${b}" stroke-width="4" opacity="0.9"/>`;
  s += `<path d="M 708 201 H 862" stroke="${b}" stroke-width="3" stroke-dasharray="10 7" opacity="0.9"/>`;
  s += `<path d="M 848 190 L 870 201 L 848 212" fill="none" stroke="${b}" stroke-width="3"/>`;
  s += `<circle cx="922" cy="201" r="32" fill="#151a1e" stroke="${b}" stroke-width="4"/>`;
  s += `<text x="922" y="211" text-anchor="middle" font-family="Georgia" font-size="29" fill="${b}">θ̂</text>`;
  s += `<text x="922" y="258" text-anchor="middle" font-family="ui-monospace,monospace" font-size="16" fill="#e7e5e4" opacity="0.72">unique output</text>`;
  s += `<text x="1080" y="155" text-anchor="middle" font-family="Georgia" font-size="22" fill="${a}">selector</text>`;
  s += `<text x="1080" y="189" text-anchor="middle" font-family="Georgia" font-size="22" fill="${b}">≠</text>`;
  s += `<text x="1080" y="223" text-anchor="middle" font-family="Georgia" font-size="22" fill="${a}">identification</text>`;
  return s;
};

/* Wales 20 mph: one observed aggregate, a broken treatment bridge, and three compatible signs. */
art['wales-20mph-casualty-attribution'] = (a, b) => {
  let s = '';
  s += `<text x="72" y="86" font-family="ui-monospace,monospace" font-size="16" fill="#e7e5e4" opacity=".72">OBSERVED 20/30 MPH AGGREGATE</text>`;
  s += `<rect x="72" y="126" width="238" height="112" rx="16" fill="#151a1e" stroke="${a}" stroke-width="3"/>`;
  s += `<text x="191" y="178" text-anchor="middle" font-family="Georgia" font-size="39" fill="${a}">2,402</text>`;
  s += `<text x="191" y="211" text-anchor="middle" font-family="ui-monospace,monospace" font-size="15" fill="#e7e5e4" opacity=".72">BEFORE</text>`;
  s += `<path d="M 322 182 H 402" stroke="#e7e5e4" stroke-width="3" opacity=".72"/>`;
  s += `<path d="M 390 171 L 412 182 L 390 193" fill="none" stroke="#e7e5e4" stroke-width="3"/>`;
  s += `<rect x="424" y="126" width="238" height="112" rx="16" fill="#151a1e" stroke="${b}" stroke-width="3"/>`;
  s += `<text x="543" y="178" text-anchor="middle" font-family="Georgia" font-size="39" fill="${b}">1,725</text>`;
  s += `<text x="543" y="211" text-anchor="middle" font-family="ui-monospace,monospace" font-size="15" fill="#e7e5e4" opacity=".72">AFTER</text>`;

  s += `<rect x="720" y="84" width="226" height="214" rx="18" fill="#151a1e" stroke="#e7e5e4" stroke-width="2" stroke-dasharray="9 8" opacity=".92"/>`;
  s += `<text x="833" y="142" text-anchor="middle" font-family="ui-monospace,monospace" font-size="15" fill="#e7e5e4">AFFECTED-ROAD MAP</text>`;
  s += `<text x="833" y="178" text-anchor="middle" font-family="Georgia" font-size="25" fill="${b}">MISSING</text>`;
  s += `<line x1="758" y1="202" x2="908" y2="202" stroke="#e7e5e4" stroke-width="1" opacity=".35"/>`;
  s += `<text x="833" y="239" text-anchor="middle" font-family="ui-monospace,monospace" font-size="15" fill="#e7e5e4">NO-POLICY OUTCOME</text>`;
  s += `<text x="833" y="274" text-anchor="middle" font-family="Georgia" font-size="25" fill="${b}">UNOBSERVED</text>`;

  const worlds = [
    ['−50%', 104, a],
    ['0%', 204, '#e7e5e4'],
    ['+100%', 304, b]
  ];
  s += `<path d="M 958 190 H 1012" stroke="#e7e5e4" stroke-width="2" opacity=".55"/>`;
  for (const [label, y, colour] of worlds) {
    s += `<path d="M 1012 190 C 1040 190, 1037 ${y}, 1064 ${y}" fill="none" stroke="${colour}" stroke-width="3" opacity=".9"/>`;
    s += `<circle cx="1082" cy="${y}" r="15" fill="#151a1e" stroke="${colour}" stroke-width="3"/>`;
    s += `<text x="1110" y="${y + 7}" font-family="Georgia" font-size="25" fill="${colour}">${label}</text>`;
  }
  s += `<text x="1094" y="358" text-anchor="middle" font-family="ui-monospace,monospace" font-size="13" fill="#e7e5e4" opacity=".62">HYPOTHETICAL WORLDS</text>`;
  s += `<text x="590" y="385" text-anchor="middle" font-family="Georgia" font-size="29" fill="${a}">SIGN NOT IDENTIFIED</text>`;
  return s;
};

/* Full e=3 polydegree column: three proof regimes meeting at a transverse smooth point. */
art['full-e3-column-polydegree-conjecture'] = (a, b) => {
  let s = '';
  const cx = 610, cy = 198;
  const curve = (phase, colour, opacity, width) => {
    let p = '';
    for (let x = 110; x <= 1110; x += 10) {
      const t = (x - 110) / 1000;
      const y = cy + 92 * Math.sin(2 * Math.PI * (t + phase)) * (0.35 + 0.65 * Math.abs(t - 0.5));
      p += `${p ? ' L' : 'M'} ${x} ${y.toFixed(1)}`;
    }
    return `<path d="${p}" fill="none" stroke="${colour}" stroke-width="${width}" opacity="${opacity}"/>`;
  };
  s += curve(0, a, 0.9, 3.2);
  s += curve(0.5, b, 0.9, 3.2);
  s += `<circle cx="${cx}" cy="${cy}" r="12" fill="#151a1e" stroke="#e7e5e4" stroke-width="3"/>`;
  s += `<line x1="${cx - 36}" y1="${cy}" x2="${cx + 36}" y2="${cy}" stroke="#e7e5e4" stroke-width="1.5" opacity=".72"/>`;
  s += `<line x1="${cx}" y1="${cy - 36}" x2="${cx}" y2="${cy + 36}" stroke="#e7e5e4" stroke-width="1.5" opacity=".72"/>`;
  const boxes = [
    [80, 46, 'EXACT BASE', '2 ≤ d ≤ 100', a],
    [470, 46, 'ARB BRIDGE', '97,033 CASES', '#e7e5e4'],
    [860, 46, 'EVENTUAL', 'm ≥ 48,550', b]
  ];
  for (const [x, y, label, detail, colour] of boxes) {
    s += `<rect x="${x}" y="${y}" width="260" height="70" rx="14" fill="#151a1e" stroke="${colour}" stroke-width="2" opacity=".96"/>`;
    s += `<text x="${x + 130}" y="${y + 28}" text-anchor="middle" font-family="ui-monospace,monospace" font-size="14" fill="${colour}">${label}</text>`;
    s += `<text x="${x + 130}" y="${y + 54}" text-anchor="middle" font-family="Georgia" font-size="20" fill="#e7e5e4">${detail}</text>`;
  }
  s += `<path d="M 210 116 C 320 150, 420 178, 560 194 M 600 116 V 164 M 990 116 C 885 150, 790 178, 662 194" fill="none" stroke="#8a938f" stroke-width="1.5" stroke-dasharray="7 7" opacity=".62"/>`;
  s += `<text x="610" y="362" text-anchor="middle" font-family="Georgia" font-size="30" fill="#e7e5e4" opacity=".9">one smooth point closes every degree</text>`;
  return s;
};

/* Aggregation licence: two hidden states share one summary but require different targets. */
art['aggregation-without-sufficiency'] = (a, b) => {
  let s = '';
  const rows = [94, 200, 306];
  const labels = ['ECONOMY', 'FISHERY', 'EPIDEMIC'];
  for (let i = 0; i < rows.length; i++) {
    const y = rows[i];
    s += `<text x="52" y="${y + 5}" font-family="ui-monospace,monospace" font-size="14" fill="#e7e5e4" opacity=".66">${labels[i]}</text>`;
    s += `<circle cx="205" cy="${y - 20}" r="10" fill="${a}"/><circle cx="205" cy="${y + 20}" r="10" fill="${b}"/>`;
    s += `<text x="228" y="${y - 14}" font-family="Georgia" font-size="17" fill="${a}">x</text><text x="228" y="${y + 26}" font-family="Georgia" font-size="17" fill="${b}">x′</text>`;
    s += `<path d="M 250 ${y - 20} C 310 ${y - 20}, 320 ${y}, 370 ${y}" fill="none" stroke="${a}" stroke-width="2.5"/>`;
    s += `<path d="M 250 ${y + 20} C 310 ${y + 20}, 320 ${y}, 370 ${y}" fill="none" stroke="${b}" stroke-width="2.5"/>`;
    s += `<circle cx="400" cy="${y}" r="28" fill="#151a1e" stroke="#e7e5e4" stroke-width="2"/>`;
    s += `<text x="400" y="${y + 7}" text-anchor="middle" font-family="Georgia" font-size="22" fill="#e7e5e4">A</text>`;
    s += `<path d="M 430 ${y} H 500" stroke="#e7e5e4" stroke-width="2" stroke-dasharray="7 7" opacity=".55"/>`;
    s += `<path d="M 500 ${y} C 548 ${y}, 548 ${y - 23}, 590 ${y - 23}" fill="none" stroke="${a}" stroke-width="2.5"/>`;
    s += `<path d="M 500 ${y} C 548 ${y}, 548 ${y + 23}, 590 ${y + 23}" fill="none" stroke="${b}" stroke-width="2.5"/>`;
    s += `<circle cx="610" cy="${y - 23}" r="10" fill="${a}"/><circle cx="610" cy="${y + 23}" r="10" fill="${b}"/>`;
  }
  s += `<text x="400" y="376" text-anchor="middle" font-family="Georgia" font-size="22" fill="#e7e5e4" opacity=".86">same aggregate</text>`;
  s += `<text x="610" y="376" text-anchor="middle" font-family="Georgia" font-size="22" fill="${b}">different target</text>`;
  s += `<rect x="730" y="54" width="410" height="292" rx="20" fill="#151a1e" stroke="${a}" stroke-width="2.5" opacity=".96"/>`;
  s += `<text x="935" y="98" text-anchor="middle" font-family="Georgia" font-size="28" fill="${a}">AGGREGATION LICENCE</text>`;
  const fields = [
    ['TARGET', 'declared'], ['INTERVENTION', 'declared'], ['TOLERANCE', 'declared'], ['EXPIRY', 'monitored']
  ];
  for (let i = 0; i < fields.length; i++) {
    const y = 136 + i * 47;
    s += `<line x1="770" y1="${y + 16}" x2="1100" y2="${y + 16}" stroke="#8a938f" stroke-width="1" opacity=".38"/>`;
    s += `<text x="774" y="${y}" font-family="ui-monospace,monospace" font-size="14" fill="#e7e5e4" opacity=".68">${fields[i][0]}</text>`;
    s += `<text x="1096" y="${y}" text-anchor="end" font-family="ui-monospace,monospace" font-size="14" fill="${i === 3 ? b : a}">${fields[i][1]}</text>`;
  }
  return s;
};

/* Frankl entropy programme: a feasible counterdirection and repaired componentwise supports. */
art['frankl-concavity-obstruction'] = (a, b) => {
  let s = '';
  const cx = 356, cy = 200;
  s += `<ellipse cx="${cx}" cy="${cy}" rx="224" ry="144" fill="#151a1e" stroke="#e7e5e4" stroke-width="1.5" opacity=".38"/>`;
  s += `<path d="M 132 200 C 220 112, 286 126, 356 200 C 426 274, 492 288, 580 200" fill="none" stroke="${a}" stroke-width="4" opacity=".96"/>`;
  s += `<path d="M 132 200 C 220 288, 286 274, 356 200 C 426 126, 492 112, 580 200" fill="none" stroke="${b}" stroke-width="4" opacity=".96"/>`;
  s += `<circle cx="${cx}" cy="${cy}" r="13" fill="#151a1e" stroke="#e7e5e4" stroke-width="3"/>`;
  s += `<path d="M 356 200 Q 356 92 444 80" fill="none" stroke="#e7e5e4" stroke-width="3" stroke-dasharray="8 7" opacity=".82"/>`;
  s += `<path d="M 434 71 L 454 78 L 438 91" fill="none" stroke="#e7e5e4" stroke-width="3"/>`;
  s += `<text x="356" y="348" text-anchor="middle" font-family="Georgia" font-size="25" fill="#e7e5e4" opacity=".9">aggregate moments fixed</text>`;
  s += `<text x="458" y="72" font-family="Georgia" font-size="24" fill="${b}">positive curvature</text>`;

  s += `<path d="M 620 200 H 692" stroke="#8a938f" stroke-width="2" stroke-dasharray="7 7" opacity=".7"/>`;
  s += `<path d="M 680 190 L 700 200 L 680 210" fill="none" stroke="#8a938f" stroke-width="2"/>`;
  const atoms = [[770, 122, a], [850, 200, a], [770, 278, a], [1000, 122, b], [1080, 200, b], [1000, 278, b]];
  for (const [x, y, colour] of atoms) s += `<circle cx="${x}" cy="${y}" r="14" fill="${colour}" opacity=".94"/>`;
  s += `<path d="M 770 122 L 850 200 L 770 278 M 1000 122 L 1080 200 L 1000 278" fill="none" stroke="#e7e5e4" stroke-width="1.5" opacity=".38"/>`;
  s += `<text x="810" y="348" text-anchor="middle" font-family="Georgia" font-size="21" fill="${a}">P₀ ≤ 3 atoms</text>`;
  s += `<text x="1040" y="348" text-anchor="middle" font-family="Georgia" font-size="21" fill="${b}">P₁ ≤ 3 atoms</text>`;
  s += `<text x="924" y="55" text-anchor="middle" font-family="ui-monospace,monospace" font-size="16" fill="#e7e5e4" opacity=".72">INDEPENDENT WEIGHTS · GLOBAL INEQUALITY OPEN</text>`;
  return s;
};

const palette = {
  'exact-low-length-recht-re-inequalities': ['#2dd4bf', '#f59e0b'],
  'z20-equals-6': ['#818cf8', '#f472b6'],
  'vr2-k4-equals-20': ['#f87171', '#60a5fa'],
  'degree-difference-affine-slices': ['#34d399', '#fbbf24'],
  'exotic-affine-three-spheres': ['#a78bfa', '#f472b6'],
  'erdos-848-all-n': ['#fbbf24', '#38bdf8'],
  'reducible-incidence-divisors': ['#4ade80', '#c084fc'],
  'stocks-are-not-flows': ['#38bdf8', '#f59e0b'],
  'affine-diversification-fibres': ['#2dd4bf', '#fbbf24'],
  'txgraffiti-c3-resolution': ['#2dd4bf', '#f472b6'],
  'bilateral-deficiency-regular-dim': ['#2dd4bf', '#f472b6'],
  'cyclicity-loci-exponential-periods': ['#38bdf8', '#fbbf24'],
  'cyclicity-root-span-low-rank': ['#a78bfa', '#2dd4bf'],
  'certified-commitment-horizons': ['#2dd4bf', '#fbbf24'],
  'bordered-jacobian-foundations': ['#34d399', '#fbbf24'],
  'exact-smith-invariants-affine-determinant-lines': ['#34d399', '#c084fc'],
  'hahn-ewens-mixing-theorem': ['#38bdf8', '#f59e0b'],
  'smooth-point-certificates-polydegree-containments': ['#2dd4bf', '#f59e0b'],
  'certified-two-item-jrp': ['#2dd4bf', '#f59e0b'],
  'unique-answer-not-identified': ['#38bdf8', '#f59e0b'],
  'sfs-identifiability-audit': ['#f59e0b', '#38bdf8'],
  'wales-20mph-casualty-attribution': ['#2dd4bf', '#f59e0b']
  ,'full-e3-column-polydegree-conjecture': ['#2dd4bf', '#f59e0b']
  ,'aggregation-without-sufficiency': ['#38bdf8', '#f59e0b']
  ,'frankl-concavity-obstruction': ['#2dd4bf', '#f59e0b']
};

for (const [slug, fn] of Object.entries(art)) {
  const [a, b] = palette[slug];
  fs.writeFileSync(path.join(OUT, slug + '.svg'), frame(fn(a, b), a, b));
  console.log('art:', slug);
}
