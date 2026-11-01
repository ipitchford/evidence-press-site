#!/usr/bin/env node
'use strict';
// Original diagram CC0-1.0; generator MIT. Source: article's two-model example.
// Banner: this image helps the reader understand that a much longer program can compute exactly the same function (parity), so length is not difficulty.
// Inline figure: this image helps the reader understand why matching observations do not fix intervention outcomes.
// Design reference: finite-sample-affine-diversification, contrasting supported conclusions.
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..'), slug = 'auditing-understanding';
const {assign, palettes} = require('./banner-palettes');
const registry = JSON.parse(fs.readFileSync(path.join(root, 'data/BANNER_PALETTES.json')));
const allocation = path.join(root, `articles/${slug}/art-palette.json`);
const name = fs.existsSync(allocation) ? JSON.parse(fs.readFileSync(allocation)).palette : assign(registry, slug);
const [a,b] = palettes[name], ink = '#fff6e8', gold = '#f4cd78', mint = '#a3e4d1';
const text = (x,y,s,size=28,fill=ink) => `<text x="${x}" y="${y}" font-size="${size}" fill="${fill}" text-anchor="middle">${s}</text>`;
const light = (x,y,label,color) => `<circle cx="${x}" cy="${y}" r="34" fill="${color}"/>${text(x,y+11,label,32,a)}`;
const arrow = (x1,y1,x2,y2) => `<path d="M${x1} ${y1}L${x2} ${y2}" stroke="${ink}" stroke-width="4" marker-end="url(#arrow)"/>`;
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 400" role="img" aria-labelledby="t d" data-banner-palette="${name}">
<title id="t">Same observations, different interventions</title><desc id="d">Two constructed causal mechanisms give identical observations. Under a forced-on X, Y is always on in the first and on half the time in the second.</desc>
<defs><linearGradient id="bg" x2="1" y2="1"><stop stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient><marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M1 1L9 5L1 9" fill="none" stroke="${ink}" stroke-width="1.6"/></marker></defs>
<rect width="1200" height="400" fill="url(#bg)"/>
<g font-family="Arial,Helvetica,sans-serif">
${text(600,53,'Same observations. Different consequences.',38)}
<path d="M600 91V357" stroke="${ink}" opacity=".2"/>
${text(300,110,'X controls Y',29,gold)}${text(900,110,'Y controls X',29,mint)}
${text(115,182,'signal',26)}${arrow(163,173,244,173)}${light(290,173,'X',gold)}${arrow(332,173,432,173)}${light(480,173,'Y',gold)}
${text(715,182,'signal',26)}${arrow(763,173,844,173)}${light(890,173,'Y',mint)}${arrow(932,173,1032,173)}${light(1080,173,'X',mint)}
${text(300,252,'Force X on',27)}${text(900,252,'Force X on',27)}
${text(300,310,'Y is always on',38,gold)}${text(900,310,'Y is on half the time',38,mint)}
${text(600,374,'Observations alone cannot choose between these two models',25)}
</g></svg>`;
fs.writeFileSync(path.join(root,`assets/articles/${slug}-causal.svg`),svg+'\n');
// Banner: compact vs padded parity program, same truth table (3 inputs: 2 vs 46 literal XOR evaluations; all 8 inputs agree).
const left = (x,y,s,size=24,fill=ink) => `<text x="${x}" y="${y}" font-size="${size}" fill="${fill}">${s}</text>`;
const rows = [...Array(8).keys()].map(i => [i>>2&1, i>>1&1, i&1]);
let table = '';
rows.forEach((r,i) => { const y = 132 + i*30, out = r[0]^r[1]^r[2];
  table += left(498,y,r.join(' '),22) + `<text x="612" y="${y}" font-size="22" fill="${gold}" text-anchor="middle">${out}</text><text x="676" y="${y}" font-size="22" fill="${mint}" text-anchor="middle">${out}</text>`; });
const pad = [];
for (let i=0;i<10;i++) pad.push('⊕(x1⊕x3)⊕(x1⊕x3)⊕(x2)⊕(x2)'.slice(0, 34));
const banner = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 400" role="img" aria-labelledby="bt bd" data-banner-palette="${name}">
<title id="bt">A longer program, the same answers</title><desc id="bd">For three switches, a compact parity program takes 2 exclusive-or steps and a padded version takes 46. A table of all 8 switch settings shows both give identical outputs.</desc>
<defs><linearGradient id="bbg" x2="1" y2="1"><stop stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs>
<rect width="1200" height="400" fill="url(#bbg)"/>
<g font-family="Arial,Helvetica,sans-serif">
${text(600,50,'More steps, same answers: 2 versus 46',34)}
${text(220,100,'Compact program',27,gold)}
<rect x="70" y="150" width="300" height="70" rx="12" fill="none" stroke="${gold}" stroke-width="3"/>
${text(220,196,'x1 ⊕ x2 ⊕ x3',32,gold)}
${text(220,270,'2 steps',40,gold)}
<path d="M470 100V362" stroke="${ink}" opacity=".25"/><path d="M730 100V362" stroke="${ink}" opacity=".25"/>
${text(600,100,'All 8 settings',25)}
<text x="526" y="132" font-size="0"> </text>
${table}
${text(980,100,'Padded program',27,mint)}
<g font-family="Courier New,monospace" font-size="15" fill="${mint}" opacity=".8">${pad.map((s,i)=>`<text x="790" y="${140+i*17}">${i? s : 'x1⊕x2⊕x3' + s.slice(0,25)}</text>`).join('')}</g>
${text(980,345,'46 steps',40,mint)}${text(980,375,'illustrative excerpt',18)}
${text(220,330,'Each pair of identical terms cancels,',20)}${text(220,356,'so padding changes nothing.',20)}
</g></svg>`;
fs.writeFileSync(path.join(root,`assets/articles/${slug}.svg`),banner+'\n');
fs.writeFileSync(allocation,JSON.stringify({palette:name,basis:'Shared palette resolver; article allocation kept separate from paper-only registry.'},null,2)+'\n');
