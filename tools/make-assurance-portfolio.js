#!/usr/bin/env node
'use strict';
/* Regenerates assets/art/assurance-portfolio.svg from pages/assurance-projects.json.
 * Run after every panel re-run: node tools/make-assurance-portfolio.js
 * Points are labelled by essay_rank and coloured by the
 * record's tier field. Points that would overlap are moved sideways only, so
 * payoff stays exact and P is approximate to within the stated dodge. */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const rec = JSON.parse(fs.readFileSync(path.join(ROOT, 'pages', 'assurance-projects.json'), 'utf8'));
const SANS = "system-ui, -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif";
const SERIF = "Georgia, 'Times New Roman', serif";
const TIERS = {
  gold: ['#fde68a', '#b45309', '#7c3a00'], silver: ['#f1f5f9', '#6b7280', '#374151'],
  bronze: ['#f3c8a2', '#7c4a21', '#5b3416'], teal: ['#99f6e4', '#0f766e', '#0b3a37'],
  platinum: ['#f8fafc', '#334155', '#0f172a']
};
const [L, R, T, B] = [110, 1090, 110, 510];
const [P0, P1, Y0, Y1] = [0.05, 0.95, 0.15, 0.75];
const px = p => L + (p - P0) / (P1 - P0) * (R - L);
const py = v => B - (v - Y0) / (Y1 - Y0) * (B - T);
const f = n => Math.round(n);
const pts = [
  ...rec.instrumentPortfolio.map(p => ({ label: String(p.essay_rank), tier: p.tier, p: p.p_med, v: p.pay_med })),
  ...rec.theoreticalCore.map(p => ({ label: p.essay_rank, tier: 'platinum', p: p.p_med, v: p.pay_med }))
].map(q => ({ ...q, x: px(q.p), y: py(q.v) }));
const GAP = 31;
for (let pass = 0; pass < 200; pass++) {
  let moved = false;
  for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
    const [a, b] = pts[i].x <= pts[j].x ? [pts[i], pts[j]] : [pts[j], pts[i]];
    const dy = a.y - b.y;
    const need = Math.sqrt(Math.max(0, GAP * GAP - dy * dy)) - (b.x - a.x);
    if (need > 0.5) { a.x -= need / 2 + 0.5; b.x += need / 2 + 0.5; moved = true; }
  }
  if (!moved) break;
}
const maxDodge = Math.max(...pts.map(q => Math.abs(q.x - px(q.p))));
const text = (x, y, s, size, fill, extra = '') =>
  `<text x="${x}" y="${y}" font-family="${SANS}" font-size="${size}" fill="${fill}"${extra}>${s}</text>`;
const out = [];
out.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 620" width="1200" height="620" role="img" aria-labelledby="t3 d3">`);
out.push(`<title id="t3">The sixteen projects and five core programmes: probability of delivery against payoff, medalled by tier, assessed ${rec.scoring.assessedOn}</title>`);
const span = key => { const a = pts.filter(q => q.tier === key); return [Math.min(...a.map(q => q.p)).toFixed(2), Math.max(...a.map(q => q.p)).toFixed(2)]; };
out.push(`<desc id="d3">A scatter plot. Horizontal axis: probability the project delivers its resolution criterion under agent execution. Vertical axis: supersession-discounted payoff conditional on delivery, from 0.15 to 0.75. Numbered points are medals in tier colours: one gold at probability ${span('gold')[1]}, silver from ${span('silver').join(' to ')}, bronze at ${span('bronze')[0]}, teal from ${span('teal').join(' to ')}, and platinum for the five theoretical-core programmes from ${span('platinum').join(' to ')}. Project 14, blind proficiency testing, has the highest payoff in the portfolio at low probability. A dashed amber line marks the coin-flip probability of one half. Overlapping points are moved sideways by up to ${f(maxDodge)} pixels.</desc>`);
out.push(`<defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#151a1e"/><stop offset="1" stop-color="#1e2a2e"/></linearGradient></defs>`);
out.push(`<rect width="1200" height="620" fill="url(#bg)"/>`);
out.push(`<text x="60" y="58" font-family="${SERIF}" font-size="27" fill="#e7e5e4">The portfolio — deliverability against payoff, a medal for every tier</text>`);
out.push(text(60, 84, `Assessed ${rec.scoring.assessedOn}; review by ${rec.scoring.reviewBy}. Compare payoff order, not level, with the previous run.`, 15, '#8a938f'));
for (const v of [0.2, 0.4, 0.6, 0.8]) {
  out.push(`<line x1="${f(px(v))}" y1="${T}" x2="${f(px(v))}" y2="${B}" stroke="#e7e5e4" stroke-width="1" opacity="0.07"/>`);
  out.push(text(f(px(v)), 538, v.toFixed(1), 15, '#8a938f', ' text-anchor="middle"'));
}
for (const v of [0.2, 0.3, 0.4, 0.5, 0.6, 0.7]) {
  out.push(`<line x1="${L}" y1="${f(py(v))}" x2="${R}" y2="${f(py(v))}" stroke="#e7e5e4" stroke-width="1" opacity="0.07"/>`);
  out.push(text(98, f(py(v)) + 5, v.toFixed(1), 15, '#8a938f', ' text-anchor="end"'));
}
out.push(`<line x1="${L}" y1="${B}" x2="${R}" y2="${B}" stroke="#8a938f" stroke-width="1.2" opacity="0.7"/>`);
out.push(`<line x1="${L}" y1="${T}" x2="${L}" y2="${B}" stroke="#8a938f" stroke-width="1.2" opacity="0.7"/>`);
out.push(`<line x1="${f(px(0.5))}" y1="${T}" x2="${f(px(0.5))}" y2="${B}" stroke="#f59e0b" stroke-width="1.2" stroke-dasharray="4 6" opacity="0.4"/>`);
out.push(text(f(px(0.5)) + 8, 498, 'coin flip', 14, '#f59e0b', ' opacity="0.8"'));
out.push(text(600, 568, 'P(delivers its resolution criterion under agent execution) — median of three adversarial scoring passes', 17, '#8a938f', ' text-anchor="middle"'));
out.push(text(46, 310, 'payoff, conditional on delivery, supersession-discounted', 17, '#8a938f', ' text-anchor="middle" transform="rotate(-90 46 310)"'));
for (const q of pts) {
  const [fill, stroke, ink] = TIERS[q.tier];
  const size = q.label.length > 1 ? 13 : 15;
  out.push(`<circle cx="${f(q.x)}" cy="${f(q.y)}" r="14" fill="${fill}"/>`);
  out.push(`<circle cx="${f(q.x)}" cy="${f(q.y)}" r="14" fill="none" stroke="${stroke}" stroke-width="2.4"/>`);
  out.push(`<text x="${f(q.x)}" y="${f(q.y) + 5}" font-family="${SERIF}" font-size="${size}" font-weight="bold" fill="${ink}" text-anchor="middle">${q.label}</text>`);
}
const notes = [
  [1000, py(0.45) - 26, 'gold: fast, no permissions', '#fde68a', 'middle'],
  [px(0.585), py(0.62) - 26, 'silver: 6, the coverage census', '#cbd5e1', 'start'],
  [px(0.42), py(0.21), 'bronze: 0.40, thinned by toolkits', '#f3c8a2', 'middle'],
  [px(0.11) + 22, py(0.66) + 5, 'teal: 14 needs a government host', '#f59e0b', 'start'],
  [px(0.27), py(0.575), 'platinum: the theoretical core', '#cbd5e1', 'middle']
];
for (const [x, y, s, c, a] of notes) out.push(text(f(x), f(y), s, 15, c, ` text-anchor="${a}"`));
out.push('</svg>');
fs.writeFileSync(path.join(ROOT, 'assets', 'art', 'assurance-portfolio.svg'), out.join('\n') + '\n');
console.log(`wrote portfolio figure; largest sideways dodge ${f(maxDodge)}px`);
