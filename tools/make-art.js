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

/* Irreducible pushforwards: elliptic orbit + quartic rank transition */
art['irreducible-pushforwards-quartic-transitions'] = (a, b) => {
  let s = '';
  const cx = 340, cy = 198, rx = 210, ry = 122;
  s += `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="none" stroke="${a}" stroke-width="2.4" opacity="0.88"/>`;
  s += `<path d="M 130 198 C 210 84, 470 84, 550 198 C 470 312, 210 312, 130 198" fill="none" stroke="#e7e5e4" stroke-width="1.2" opacity="0.28"/>`;
  const pts = [[205,137],[286,92],[397,104],[481,163],[455,252],[342,309],[230,267]];
  for (let i = 0; i < pts.length; i++) {
    const [x,y] = pts[i];
    s += `<circle cx="${x}" cy="${y}" r="${i === 0 ? 8 : 6}" fill="${i % 2 ? b : a}" opacity="${i === 0 ? 1 : .82}"/>`;
  }
  s += `<path d="M 225 130 Q 340 28 465 142" fill="none" stroke="${b}" stroke-width="2" stroke-dasharray="7 8" opacity="0.68"/>`;
  s += `<path d="M 590 322 C 655 296, 680 260, 712 218 C 744 176, 768 74, 808 82 C 855 91, 849 262, 889 278 C 927 293, 950 204, 980 150 C 1010 96, 1040 65, 1080 55" fill="none" stroke="${b}" stroke-width="3.2" opacity="0.92"/>`;
  s += `<path d="M 590 322 L 1110 322" stroke="#e7e5e4" stroke-width="1" opacity="0.24"/>`;
  for (const [x,y] of [[712,218],[808,82],[889,278]]) s += `<circle cx="${x}" cy="${y}" r="7" fill="${a}"/>`;
  s += `<path d="M 620 88 L 1045 88" stroke="${a}" stroke-width="2.2" stroke-dasharray="12 10" opacity="0.64"/>`;
  s += `<circle cx="1037" cy="88" r="12" fill="none" stroke="${a}" stroke-width="2.4" opacity="0.9"/>`;
  return s;
};

/* Random reshuffling baseline policy: fair pair bits resolved along one value path */
art['random-reshuffling-baseline-policy'] = (a, b) => {
  let s = '';
  const tokens = [
    [156, 116, '1'], [156, 284, '2'],
    [346, 116, '3'], [346, 284, '4'],
    [536, 116, '5'], [536, 284, '6']
  ];
  for (const [x, y, label] of tokens) {
    s += `<circle cx="${x}" cy="${y}" r="31" fill="#151a1e" stroke="#d6dcdd" stroke-width="2"/>`;
    s += `<text x="${x}" y="${y + 8}" text-anchor="middle" font-family="ui-monospace,monospace" font-size="22" fill="#f5f5f4">${label}</text>`;
  }
  for (const x of [156, 346, 536]) {
    s += `<path d="M ${x - 48} 200 Q ${x} 152 ${x + 48} 200 Q ${x} 248 ${x - 48} 200Z" fill="none" stroke="${b}" stroke-width="2.5" stroke-dasharray="7 7" opacity=".8"/>`;
    s += `<circle cx="${x}" cy="200" r="9" fill="${b}"/>`;
  }
  s += `<path d="M 606 200 C 674 200, 682 102, 752 102 S 824 298, 894 298 S 966 154, 1044 154" fill="none" stroke="${a}" stroke-width="5" opacity=".95"/>`;
  s += `<path d="M 606 200 C 674 200, 682 298, 752 298 S 824 102, 894 102 S 966 246, 1044 246" fill="none" stroke="#d6dcdd" stroke-width="2" stroke-dasharray="9 10" opacity=".3"/>`;
  for (const [x, y] of [[752,102],[894,298],[1044,154]]) {
    s += `<rect x="${x - 12}" y="${y - 12}" width="24" height="24" rx="4" fill="#151a1e" stroke="${a}" stroke-width="3" transform="rotate(45 ${x} ${y})"/>`;
  }
  s += `<path d="M 640 64 H 1120" stroke="#f59e0b" stroke-width="2" opacity=".65"/>`;
  s += `<text x="1112" y="53" text-anchor="end" font-family="ui-monospace,monospace" font-size="16" fill="#f59e0b" opacity=".9">same RR baseline</text>`;
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
  'irreducible-pushforwards-quartic-transitions': ['#2dd4bf', '#f59e0b'],
  'random-reshuffling-baseline-policy': ['#22d3ee', '#c084fc']
};

for (const [slug, fn] of Object.entries(art)) {
  const [a, b] = palette[slug];
  fs.writeFileSync(path.join(OUT, slug + '.svg'), frame(fn(a, b), a, b));
  console.log('art:', slug);
}
