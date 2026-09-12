#!/usr/bin/env node
'use strict';
// CC0-1.0 diagrams; MIT generator. Exact real-slice example, not basin data.
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..', 'assets', 'articles');
const C = { bg: '#0a2c28', ink: '#f0fdfa', muted: '#a7d5cc', gold: '#fbbf24', teal: '#2dd4bf' };
const x = z => 720 + 420 * z;
const y = v => 240 - 195 * v;
const curve = f => Array.from({ length: 401 }, (_, i) => {
  const z = -1.15 + i * 2.3 / 400;
  return `${i ? 'L' : 'M'}${x(z).toFixed(2)},${y(f(z)).toFixed(2)}`;
}).join(' ');
const grid = Array.from({ length: 25 }, (_, i) => `<path d="M${i * 60} 0V480"/>`).join('') +
  Array.from({ length: 9 }, (_, i) => `<path d="M0 ${i * 60}H1440"/>`).join('');
const banner = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 480" role="img" aria-labelledby="title desc">
<title id="title">Two curves agree near zero, then separate</title>
<desc id="desc">Ivory shows y=z. Gold shows y=z−2z³+z⁴. This is a real-slice illustration of the exact example, not a complex-dynamics simulation.</desc>
<defs><clipPath id="bounds"><rect width="1440" height="480"/></clipPath></defs>
<rect width="1440" height="480" fill="${C.bg}"/>
<g stroke="${C.teal}" stroke-opacity=".10" stroke-width="1">${grid}</g>
<g clip-path="url(#bounds)" fill="none"><path d="M0 240H1440M720 0V480" stroke="${C.muted}" stroke-opacity=".35"/>
<path d="${curve(z => z)}" stroke="${C.ink}" stroke-width="4"/>
<path d="${curve(z => z - 2*z**3 + z**4)}" stroke="${C.gold}" stroke-width="5"/>
</g><circle cx="720" cy="240" r="7" fill="${C.ink}" stroke="${C.bg}" stroke-width="3"/>
</svg>\n`;
const rows = [
  { y: 204, label: 'z', value: 1, text: '+1', color: C.ink },
  { y: 286, label: 'z²', value: 0, text: '0', color: C.muted },
  { y: 368, label: 'z³', value: -2, text: '−2', color: C.gold },
  { y: 450, label: 'z⁴', value: 1, text: '+1', color: C.teal }
];
const diagram = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 580" role="img" aria-labelledby="title desc">
<title id="title">The cubic term gives the game away</title>
<desc id="desc">For a(z)=z+z² and b(z)=z−z², a(b(z))=z−2z³+z⁴. Coefficients are 1, 0, −2, 1. The square term cancels and the first difference from the identity is cubic.</desc>
<rect width="640" height="580" rx="16" fill="${C.bg}"/>
<g font-family="system-ui, sans-serif" fill="${C.ink}">
<text x="40" y="55" font-size="23" font-weight="650">What survives composition?</text>
<text x="40" y="96" font-size="25">a(b(z)) = z − 2z³ + z⁴</text>
<text x="40" y="151" fill="${C.muted}" font-size="18">POWER</text>
<text x="245" y="151" fill="${C.muted}" font-size="18">COEFFICIENT</text>
<path d="M380 175V478" stroke="${C.muted}" stroke-opacity=".5"/>
${rows.map(r => `<text x="48" y="${r.y+8}" font-size="28" fill="${r.color}">${r.label}</text>
${r.value ? `<rect x="${r.value < 0 ? 380+r.value*70 : 380}" y="${r.y-17}" width="${Math.abs(r.value)*70}" height="34" rx="4" fill="${r.color}"/>` : `<circle cx="380" cy="${r.y}" r="5" fill="${r.color}"/>`}
<text x="505" y="${r.y+8}" font-size="26" fill="${r.color}">${r.text}</text>`).join('\n')}
<text x="40" y="532" fill="${C.gold}" font-size="21">First difference from z: the cubic term.</text>
</g></svg>\n`;
for (const [name, content] of [['rigidity-curves.svg', banner], ['rigidity-cancellation.svg', diagram]]) {
  fs.writeFileSync(path.join(root, name), content);
  console.log(`generated assets/articles/${name}`);
}
