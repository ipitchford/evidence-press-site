#!/usr/bin/env node
'use strict';
// MIT generator; diagrams CC0-1.0. Writes the Productivity Protocols illustrations to assets/productivity/.
// Habit diagrams are schematics. The morning timeline uses the recorded times of 20 October 2026.
// The trend chart applies METR's reported doubling times to its May 2026 estimate: a projection, not data.
const fs = require('fs');
const path = require('path');
const OUT = path.join(__dirname, '..', 'assets', 'productivity');
fs.mkdirSync(OUT, { recursive: true });

const bg1 = '#13232f', bg2 = '#24384a', ivory = '#fff9ed', gold = '#efbe65', aqua = '#71d5d0', rose = '#e58f8a', muted = '#a9b6c4', dim = '#3b5267';
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const T = (x, y, s, o = {}) => `<text x="${x}" y="${y}" fill="${o.fill || ivory}" font-size="${o.size || 22}" text-anchor="${o.anchor || 'middle'}"${o.weight ? ` font-weight="${o.weight}"` : ''}${o.mono ? ' font-family="Menlo,Consolas,monospace"' : ''}>${esc(s)}</text>`;
const marker = (id, c) => `<marker id="${id}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M1 1L9 5L1 9" fill="none" stroke="${c}" stroke-width="1.8"/></marker>`;
const svg = (w, h, title, desc, body) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" role="img" aria-labelledby="t d">
<title id="t">${esc(title)}</title><desc id="d">${esc(desc)}</desc>
<defs><linearGradient id="bg" x2="1" y2="1"><stop stop-color="${bg1}"/><stop offset="1" stop-color="${bg2}"/></linearGradient>${marker('a', aqua)}${marker('ag', gold)}${marker('ar', rose)}</defs>
<rect width="${w}" height="${h}" rx="18" fill="url(#bg)"/>
<g font-family="Arial,Helvetica,sans-serif">${body}</g></svg>
`;
const write = (name, s) => fs.writeFileSync(path.join(OUT, name), s);
const doc = (x, y, w = 70, h = 90, c = ivory) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="none" stroke="${c}" stroke-width="3"/>` +
  [0, 1, 2, 3].map(i => `<path d="M${x + 14} ${y + 20 + i * 16}H${x + w - 14 - (i % 2) * 14}" stroke="${c}" stroke-width="3" opacity=".7"/>`).join('');
const person = (x, y, c = gold) => `<circle cx="${x}" cy="${y - 22}" r="13" fill="${c}"/><path d="M${x - 22} ${y + 18}c0-22 10-30 22-30s22 8 22 30z" fill="${c}"/>`;
const bot = (x, y, c = aqua, r = 18) => `<rect x="${x - r}" y="${y - r}" width="${2 * r}" height="${2 * r}" rx="${(r / 2.4).toFixed(1)}" fill="${c}"/><circle cx="${(x - r / 2.6).toFixed(1)}" cy="${y - 2}" r="${(r / 6).toFixed(1)}" fill="${bg1}"/><circle cx="${(x + r / 2.6).toFixed(1)}" cy="${y - 2}" r="${(r / 6).toFixed(1)}" fill="${bg1}"/>`;
const tick = (x, y, c = aqua) => `<circle cx="${x}" cy="${y}" r="20" fill="${c}"/><path d="M${x - 9} ${y}l6 7 13-15" fill="none" stroke="${bg1}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`;
const W = 720, H = 300;

// 1. Whole jobs
write('habit-1-whole-jobs.svg', svg(W, H, 'Hand over whole jobs',
  'A one-paragraph brief goes to the AI, which works through several steps and returns the finished result with a way to check it.',
  T(360, 48, 'One brief, many steps, a finished result', { size: 26, weight: 700 }) +
  doc(40, 100, 90, 110, gold) + T(85, 245, 'the brief', { size: 20, fill: muted }) +
  `<path d="M140 155H185" stroke="${aqua}" stroke-width="4" marker-end="url(#a)"/>` + bot(215, 155) +
  [0, 1, 2, 3, 4].map(i => `<rect x="${255 + i * 62}" y="137" width="44" height="36" rx="8" fill="none" stroke="${aqua}" stroke-width="3"/>` +
    T(277 + i * 62, 163, String(i + 1), { size: 18, fill: aqua }) +
    (i < 4 ? `<path d="M${301 + i * 62} 155H${315 + i * 62}" stroke="${aqua}" stroke-width="3"/>` : '')).join('') +
  T(401, 215, 'the AI works through the steps', { size: 20, fill: muted }) +
  `<path d="M565 155H595" stroke="${aqua}" stroke-width="4" marker-end="url(#a)"/>` + doc(605, 100, 70, 110) + tick(668, 210) +
  T(640, 260, 'result', { size: 20, fill: muted })));

// 2. Fleets
write('habit-2-fleets.svg', svg(W, H, 'Run several AI workers at once',
  'One job is split into four independent parts, each handled by its own AI worker in parallel, and the results are combined.',
  T(360, 40, 'One job, split and run in parallel', { size: 26, weight: 700 }) + person(70, 165) +
  [75, 130, 185, 240].map(y => `<path d="M110 160C150 160 150 ${y} 195 ${y}" fill="none" stroke="${gold}" stroke-width="3"/>`).join('') +
  [75, 130, 185, 240].map((y, i) => bot(220, y, aqua, 15) + `<rect x="250" y="${y - 8}" width="230" height="16" rx="8" fill="${aqua}" opacity=".3"/><rect x="250" y="${y - 8}" width="${150 + i * 20}" height="16" rx="8" fill="${aqua}"/>`).join('') +
  [75, 130, 185, 240].map(y => `<path d="M490 ${y}C550 ${y} 550 160 590 160" fill="none" stroke="${aqua}" stroke-width="3"/>`).join('') +
  doc(600, 115) + tick(660, 210) + T(360, 290, 'four parts at once, in the time of one', { size: 20, fill: muted })));

// 3. Cross-checking
write('habit-3-cross-check.svg', svg(W, H, 'Make one AI check another',
  'A first AI writes a draft; a second AI, told to find mistakes, marks two errors; the corrected draft goes out.',
  T(360, 48, 'A second model, told to find mistakes', { size: 26, weight: 700 }) +
  bot(70, 155, gold, 22) + T(70, 210, 'writer', { size: 20, fill: muted }) +
  `<path d="M100 155H160" stroke="${gold}" stroke-width="4" marker-end="url(#ag)"/>` +
  doc(170, 100, 90, 110) + `<circle cx="200" cy="136" r="14" fill="none" stroke="${rose}" stroke-width="3"/><circle cx="232" cy="168" r="14" fill="none" stroke="${rose}" stroke-width="3"/>` +
  `<path d="M275 155H330" stroke="${rose}" stroke-width="4" marker-end="url(#ar)"/>` + bot(370, 155, rose, 22) +
  `<circle cx="404" cy="126" r="15" fill="none" stroke="${ivory}" stroke-width="4"/><path d="M415 137l13 13" stroke="${ivory}" stroke-width="5" stroke-linecap="round"/>` +
  T(370, 212, 'checker', { size: 20, fill: muted }) + T(370, 240, '"find the errors"', { size: 18, fill: rose }) +
  `<path d="M450 155H545" stroke="${aqua}" stroke-width="4" marker-end="url(#a)"/>` + T(497, 140, 'errors fixed', { size: 18, fill: aqua }) +
  doc(560, 100, 90, 110) + tick(642, 210)));

// 4. Recipes (schematic durations)
const bars = [['first time', 470, gold], ['with the recipe', 280, aqua], ['next time', 200, aqua], ['and the next', 150, aqua]];
write('habit-4-recipes.svg', svg(W, H, 'Turn every repeated job into a recipe',
  'Schematic: the first attempt at a job takes longest; once its method is written down as a recipe, each repetition takes less time.',
  T(360, 44, 'Write the method down once; repeat it faster', { size: 26, weight: 700 }) +
  bars.map(([l, w, c], i) => T(185, 103 + i * 48, l, { size: 20, fill: muted, anchor: 'end' }) + `<rect x="200" y="${84 + i * 48}" width="${w}" height="26" rx="13" fill="${c}"/>`).join('') +
  `<rect x="590" y="120" width="96" height="70" rx="8" fill="none" stroke="${gold}" stroke-width="3"/>` +
  [0, 1, 2].map(i => `<path d="M604 ${140 + i * 16}H${670 - i * 12}" stroke="${gold}" stroke-width="3" opacity=".7"/>`).join('') +
  T(638, 214, 'recipe', { size: 18, fill: gold }) +
  `<path d="M590 160C560 175 520 160 490 150" fill="none" stroke="${gold}" stroke-width="3" stroke-dasharray="6 6" marker-end="url(#ag)"/>` +
  T(360, 285, 'schematic: each repetition starts from the written method', { size: 18, fill: muted })));

// 5. Notebook
write('habit-5-notebook.svg', svg(W, H, 'Keep a notebook the AI reads',
  'A notebook of instructions and lessons is read at the start of each session, and each session adds new lessons back to it.',
  T(360, 44, 'Explain once; every session starts informed', { size: 26, weight: 700 }) +
  `<rect x="55" y="80" width="130" height="165" rx="10" fill="none" stroke="${gold}" stroke-width="3"/><path d="M75 80V245" stroke="${gold}" stroke-width="3"/>` +
  [0, 1, 2, 3, 4].map(i => `<path d="M92 ${112 + i * 25}H${168 - (i % 2) * 18}" stroke="${gold}" stroke-width="3" opacity=".7"/>`).join('') +
  T(120, 275, 'the notebook', { size: 20, fill: muted }) +
  ['Monday', 'Tuesday', 'Wednesday'].map((d, i) => `<path d="M195 ${120 + i * 35}C290 ${120 + i * 35} 320 ${95 + i * 70} 405 ${95 + i * 70}" fill="none" stroke="${aqua}" stroke-width="3" marker-end="url(#a)"/>` +
    bot(435, 95 + i * 70, aqua, 16) + T(465, 102 + i * 70, `${d}: reads it first`, { size: 19, anchor: 'start' })).join('') +
  `<path d="M425 260C330 280 250 270 195 235" fill="none" stroke="${gold}" stroke-width="2.5" stroke-dasharray="6 6" marker-end="url(#ag)"/>` +
  T(330, 290, 'new lessons written back', { size: 18, fill: gold })));

// 6. Human decisions
write('habit-6-human-decisions.svg', svg(W, H, 'Keep the decisions human',
  'AI steps flow freely until an action that sends, publishes, spends or deletes, which waits for a person to approve.',
  T(360, 48, 'The AI does the work; a person makes the calls', { size: 26, weight: 700 }) +
  [0, 1, 2, 3].map(i => bot(70 + i * 80, 155, aqua, 16) + (i < 3 ? `<path d="M${90 + i * 80} 155H${128 + i * 80}" stroke="${aqua}" stroke-width="3" marker-end="url(#a)"/>` : '')).join('') +
  T(190, 212, 'drafting, checking, building', { size: 20, fill: muted }) +
  `<path d="M335 155H385" stroke="${aqua}" stroke-width="3" marker-end="url(#a)"/><rect x="395" y="90" width="16" height="130" rx="6" fill="${gold}"/>` +
  person(462, 165) + T(462, 240, 'a person approves', { size: 18, fill: gold }) +
  `<path d="M505 155H545" stroke="${gold}" stroke-width="3" marker-end="url(#ag)"/>` +
  ['send', 'publish', 'spend', 'delete'].map((w, i) => T(612, 112 + i * 32, w, { size: 21 })).join('')));

// Morning timeline (recorded times, 20 October 2026)
const tx = t => { const [h, m] = t.split(':').map(Number); return 110 + ((h * 60 + m) - 230) / 150 * 940; };
const events = [
  ['03:58', 'Research report handed over', gold, -1],
  ['04:25', 'Fact-checkers find four errors', aqua, 1],
  ['05:00', 'Article and full narration done', aqua, -1],
  ['06:15', '14-minute film rendered', gold, 1]
];
write('one-morning-timeline.svg', svg(1160, 380, 'One morning, 20 October 2026',
  'Timeline from 3:58 to 6:15 a.m.: report handed over at 3:58; fact-checks found four errors by 4:25; article and full narration done by 5:00; a 14-minute film rendered by 6:15.',
  T(580, 50, 'One morning: from research report to article and film', { size: 28, weight: 700 }) +
  `<path d="M110 200H1050" stroke="${dim}" stroke-width="6" stroke-linecap="round"/>` +
  ['04:00', '04:30', '05:00', '05:30', '06:00'].map(t => `<path d="M${tx(t)} 192V208" stroke="${muted}" stroke-width="2"/>` + T(tx(t), 232, t, { size: 16, fill: muted, mono: true })).join('') +
  events.map(([t, label, c, side]) => { const x = tx(t);
    return `<path d="M${x} 200V${side < 0 ? 145 : 258}" stroke="${c}" stroke-width="2"/><circle cx="${x}" cy="200" r="11" fill="${c}"/>` +
      T(x, side < 0 ? 104 : 290, t, { size: 22, fill: c, weight: 700, mono: true }) + T(x, side < 0 ? 132 : 318, label, { size: 18 }); }).join('') +
  T(580, 362, 'The person’s part: a few minutes of direction, and approval before publication', { size: 18, fill: muted })));

// Trend projection from METR's May 2026 estimate
const months = 24, y0 = 12;
const gx = m => 170 + m / months * 760;
const ly = h => 330 - (Math.log10(h) - Math.log10(8)) / (Math.log10(4000) - Math.log10(8)) * 250;
const curve = (dbl, c) => { const p = []; for (let m = 0; m <= months; m++) p.push(`${gx(m).toFixed(1)},${ly(y0 * 2 ** (m / dbl)).toFixed(1)}`); return `<polyline points="${p.join(' ')}" fill="none" stroke="${c}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>`; };
const refs = [[8, 'a working day'], [40, 'a working week'], [170, 'a working month'], [1900, 'a working year']];
const end7 = y0 * 2 ** (months / 7), end3 = y0 * 2 ** (months / 3);
write('agent-horizon-projection.svg', svg(1160, 430, 'Where the trend leads, if it holds',
  `Projection on a logarithmic scale from METR's May 2026 estimate of about 12 hours of skilled human work. Doubling every 7 months reaches about ${Math.round(end7)} hours by May 2028; doubling every 3 months reaches about ${Math.round(end3)} hours. A projection, not a forecast.`,
  T(580, 46, 'How long a task can an AI agent take on? Where the trend leads, if it holds', { size: 26, weight: 700 }) +
  refs.map(([h, l]) => `<path d="M170 ${ly(h).toFixed(1)}H930" stroke="${dim}" stroke-width="2" stroke-dasharray="4 8"/>` + T(160, ly(h) + 6, l, { size: 16, fill: muted, anchor: 'end' })).join('') +
  ['May 2026', 'May 2027', 'May 2028'].map((l, i) => T(gx(i * 12), 362, l, { size: 16, fill: muted })).join('') +
  curve(7, aqua) + curve(3, gold) + `<circle cx="${gx(0)}" cy="${ly(y0).toFixed(1)}" r="9" fill="${ivory}"/>` +
  T(gx(0) + 62, ly(y0) + 28, 'about 12 hours (METR, May 2026)', { size: 17, anchor: 'start' }) +
  T(gx(months) + 12, ly(end3) + 6, 'doubling every 3 months', { size: 17, fill: gold, anchor: 'start' }) +
  T(gx(months) + 12, ly(end7) + 6, 'every 7 months', { size: 17, fill: aqua, anchor: 'start' }) +
  T(580, 405, 'Projection, not a forecast: METR’s measured doubling times applied to its May 2026 estimate, which it calls highly uncertain.', { size: 16, fill: muted })));

console.log(`wrote 9 illustrations; 24-month projection ${Math.round(end7)} h (7-month doubling), ${Math.round(end3)} h (3-month doubling)`);
