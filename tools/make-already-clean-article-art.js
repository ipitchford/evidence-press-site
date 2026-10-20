#!/usr/bin/env node
'use strict';
// MIT generator; original schematics and charts CC0-1.0.
// Banner: schematic of Goodfire's documented "iy" neuron example and the two rival
// histories the article discusses. Figures: counts from the Already Clean evidence
// bundle (analysis/results/classification_counts.csv and summary.json, 19 Oct 2026).
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const slug = 'neural-networks-already-clean';
const {assign, palettes} = require(path.join(root, 'tools/banner-palettes'));
// Article art is outside the paper-art validator. Preserve the paper registry;
// record the allocation with the article for reconciliation.
const registry = JSON.parse(fs.readFileSync(path.join(root, 'data/BANNER_PALETTES.json')));
const assignmentPath = path.join(root, `articles/${slug}/art-palette.json`);
const name = fs.existsSync(assignmentPath) ? JSON.parse(fs.readFileSync(assignmentPath)).palette : assign(registry, slug);
const [bg1, bg2] = palettes[name];
const ivory = '#fff9ed', gold = '#efbe65', aqua = '#71d5d0', muted = '#d4ccd9', rose = '#e58f8a';
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const text = (x, y, s, o = {}) => `<text x="${x}" y="${y}" fill="${o.fill || ivory}" font-size="${o.size || 30}" text-anchor="${o.anchor || 'middle'}"${o.weight ? ` font-weight="${o.weight}"` : ''}${o.italic ? ' font-style="italic"' : ''}>${esc(s)}</text>`;
const folder = path.join(root, 'assets/articles');
fs.mkdirSync(folder, {recursive: true});

// ---------- Banner ----------
// Left: one neuron's observed uses, from the essay's own example (iy -> diy -> do it yourself).
// Right: two different learning histories that could leave that same endpoint.
const node = (x, y, r, label, fill, size) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"/>${text(x, y + size * 0.35, label, {size, fill: bg1, weight: 700})}`;
const banner = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 400" role="img" aria-labelledby="title desc" data-banner-palette="${name}">
<title id="title">One neuron's uses, and two histories that could explain them</title>
<desc id="desc">Schematic. Left: Goodfire's example of a neuron that detected the letters iy, then diy, then the phrase do it yourself, which no longer contains iy. Right: two rival learning histories, related branching growth and packing of unrelated uses into shared capacity, both arrive at the same observed endpoint. The final pattern alone does not say which history occurred. No measured data is shown.</desc>
<defs><linearGradient id="bg" x2="1" y2="1"><stop stop-color="${bg1}"/><stop offset="1" stop-color="${bg2}"/></linearGradient>
<marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1 1L9 5L1 9" fill="none" stroke="${aqua}" stroke-width="1.8"/></marker>
<marker id="arrowr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1 1L9 5L1 9" fill="none" stroke="${rose}" stroke-width="1.8"/></marker></defs>
<rect width="1200" height="400" fill="url(#bg)"/>
<g font-family="Arial,Helvetica,sans-serif">
${text(300, 58, 'What the neuron does now', {size: 34})}
<path d="M120 300C150 230 230 175 300 160" fill="none" stroke="${ivory}" stroke-width="7" stroke-linecap="round" opacity=".85"/>
<path d="M372 172C420 205 440 230 452 248" fill="none" stroke="${ivory}" stroke-width="6" stroke-linecap="round" opacity=".85"/>
${node(120, 300, 44, 'iy', gold, 34)}
${node(330, 150, 46, 'diy', gold, 32)}
<rect x="382" y="248" width="196" height="56" rx="28" fill="${gold}"/>${text(480, 285, 'do it yourself', {size: 25, fill: bg1, weight: 700})}
${text(320, 365, 'Each step is related to the last; the end has no "iy"', {size: 24, fill: muted})}
<line x1="640" y1="70" x2="640" y2="345" stroke="${ivory}" stroke-width="2" opacity=".25"/>
${text(915, 58, 'How did it get that way?', {size: 34})}
<rect x="700" y="96" width="430" height="92" rx="16" fill="none" stroke="${aqua}" stroke-width="3"/>
${text(915, 134, 'Grew by related branching', {size: 27, fill: aqua, weight: 700})}
${text(915, 168, 'recursive generalisation', {size: 25, fill: ivory, italic: true})}
<rect x="700" y="214" width="430" height="92" rx="16" fill="none" stroke="${rose}" stroke-width="3"/>
${text(915, 252, 'Unrelated uses packed together', {size: 27, fill: rose, weight: 700})}
${text(915, 286, 'superposition', {size: 25, fill: ivory, italic: true})}
<path d="M700 142C650 142 625 200 600 255" fill="none" stroke="${aqua}" stroke-width="3" marker-end="url(#arrow)"/>
<path d="M700 260C660 260 630 270 600 274" fill="none" stroke="${rose}" stroke-width="3" marker-end="url(#arrowr)"/>
${text(915, 352, 'The endpoint alone cannot tell them apart', {size: 25, fill: muted})}
</g></svg>
`;
fs.writeFileSync(path.join(folder, 'already-clean-banner.svg'), banner);

// ---------- Figure 1: source review categories, 100 sampled poles per model ----------
const csv = fs.readFileSync(path.join(root, `articles/${slug}/data/classification_counts.csv`), 'utf8').trim().split('\n').slice(1).map(l => l.split(','));
const cats = [
  ['one_idea', 'One idea', '#2f7f7a'],
  ['branching', 'Branching structure', '#5fb3ad'],
  ['unplaced', 'One idea + unplaced cases', '#d9a441'],
  ['two_related', 'Two related ideas', '#b07aa1'],
  ['mixture', 'Mixture', '#c8605a'],
  ['unresolved', 'Unresolved', '#8d8d8d'],
  ['none', 'No strong firings', '#c9c4bb'],
];
const models = [['Qwen3-32B', 'Qwen3-32B (dense)'], ['Qwen3.6-35B-A3B', 'Qwen3.6-35B-A3B (mixture of experts)']];
const count = (m, c) => Number((csv.find(r => r[0] === m && r[1] === 'all_poles' && r[2] === c) || [0, 0, 0, 0])[3]);
for (const [m] of models) {
  const total = cats.reduce((s, [c]) => s + count(m, c), 0);
  if (total !== 100) throw new Error(`${m} poles sum to ${total}, expected 100`);
}
const fx = 270, fw = 640, unit = fw / 100, ink = '#1d2a33', grid = '#c9c4bb';
let f1 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1100 520" role="img" aria-labelledby="f1t f1d">
<title id="f1t">How Goodfire's own reviews classify 100 sampled neuron poles in each model</title>
<desc id="f1d">Stacked bars. Qwen3-32B: one idea 52, branching 34, one idea plus unplaced cases 8, two related ideas 0, mixture 2, unresolved 3, no strong firings 1. Qwen3.6-35B-A3B: 50, 33, 6, 3, 1, 1, 6. One idea plus branching gives 86 and 83; adding unplaced cases gives 94 and 89.</desc>
<rect width="1100" height="520" fill="#fffdf8"/>
<g font-family="Arial,Helvetica,sans-serif" fill="${ink}">
${text(550, 40, 'Source review labels for 100 randomly sampled poles per model', {size: 24, fill: ink, weight: 700})}`;
models.forEach(([m, label], i) => {
  const y = 90 + i * 150;
  f1 += text(fx - 16, y + 34, label.split(' (')[0], {size: 21, fill: ink, anchor: 'end', weight: 700}) + text(fx - 16, y + 58, '(' + label.split(' (')[1], {size: 18, fill: '#55606a', anchor: 'end'});
  let x = fx;
  for (const [c, , col] of cats) {
    const n = count(m, c); if (!n) continue;
    const w = n * unit;
    f1 += `<rect x="${x.toFixed(1)}" y="${y}" width="${w.toFixed(1)}" height="64" fill="${col}"/>`;
    if (w > 26) f1 += text((x + w / 2).toFixed(1), y + 40, n, {size: 19, fill: c === 'none' ? ink : '#ffffff', weight: 700});
    x += w;
  }
  const a = count(m, 'one_idea') + count(m, 'branching'), b = a + count(m, 'unplaced');
  const ya = y + 82;
  f1 += `<path d="M${fx} ${ya}v8H${fx + a * unit}v-8" fill="none" stroke="${ink}" stroke-width="1.6"/>` + text(fx + a * unit / 2, ya + 30, `one idea + branching = ${a}`, {size: 21, fill: ink});
  f1 += `<path d="M${fx + a * unit} ${ya + 40}v8H${fx + b * unit}v-8" fill="none" stroke="${ink}" stroke-width="1.6"/>` + text(fx + b * unit + 10, ya + 54, `+ unplaced cases = ${b}`, {size: 21, fill: ink, anchor: 'start'});
});
let lx = 70;
const ly = 455;
cats.forEach(([, label, col], i) => {
  const xs = [40, 220, 470, 800], row = i < 4 ? 0 : 1, colx = xs[i < 4 ? i : i - 4];
  f1 += `<rect x="${colx}" y="${ly + row * 30 - 14}" width="18" height="18" fill="${col}"/>` + text(colx + 26, ly + row * 30, label, {size: 20, fill: ink, anchor: 'start'});
  lx = colx;
});
f1 += `</g></svg>\n`;
fs.writeFileSync(path.join(folder, 'already-clean-review-labels.svg'), f1);

// ---------- Figure 2: where the dense gallery's 500 neurons sit across 64 layers ----------
const summary = JSON.parse(fs.readFileSync(path.join(root, `articles/${slug}/data/gallery_layers.json`), 'utf8'));
const layers = summary.gallery['Qwen3-32B'].layer_counts;
const quarters = [0, 0, 0, 0];
for (const [l, n] of Object.entries(layers)) quarters[Math.floor(Number(l) / 16)] += n;
const qsum = quarters.reduce((s, n) => s + n, 0);
if (qsum !== 500) throw new Error(`dense gallery layers sum to ${qsum}`);
const expected = qsum / 4, bx = 170, bw = 160, gap = 60, base = 400, scale = 1.25;
let f2 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1100 500" role="img" aria-labelledby="f2t f2d">
<title id="f2t">Layer position of the 500 dense-model neurons in Goodfire's gallery</title>
<desc id="f2d">Bars for successive quarters of Qwen3-32B's 64 layers: ${quarters.join(', ')} neurons. A uniform sample of coordinates would put about ${expected} in each quarter. ${quarters[2] + quarters[3]} of 500 come from the latter half.</desc>
<rect width="1100" height="500" fill="#fffdf8"/>
<g font-family="Arial,Helvetica,sans-serif">
${text(550, 40, 'Qwen3-32B gallery neurons by layer quarter (500 neurons, 64 layers)', {size: 24, fill: ink, weight: 700})}
<line x1="${bx - 30}" y1="${base}" x2="${bx + 4 * (bw + gap)}" y2="${base}" stroke="${ink}" stroke-width="2"/>`;
quarters.forEach((n, i) => {
  const x = bx + i * (bw + gap), h = n * scale;
  f2 += `<rect x="${x}" y="${base - h}" width="${bw}" height="${h}" fill="${i >= 2 ? '#2f7f7a' : '#8fc7c2'}"/>` + text(x + bw / 2, base - h - 12, n, {size: 24, fill: ink, weight: 700}) + text(x + bw / 2, base + 32, `layers ${i * 16}–${i * 16 + 15}`, {size: 18, fill: ink});
});
const ey = base - expected * scale;
f2 += `<line x1="${bx - 30}" y1="${ey}" x2="${bx + 4 * (bw + gap) - gap}" y2="${ey}" stroke="${rose}" stroke-width="3" stroke-dasharray="10 8"/>` +
  text(bx - 24, ey - 10, `${expected} per quarter if layers were sampled uniformly`, {size: 18, fill: '#a3443e', anchor: 'start'}) +
  text(550, 470, `${quarters[2] + quarters[3]} of 500 (${Math.round((quarters[2] + quarters[3]) / 5)}%) come from the latter half of the network`, {size: 20, fill: ink}) +
  `</g></svg>\n`;
fs.writeFileSync(path.join(folder, 'already-clean-gallery-layers.svg'), f2);

fs.writeFileSync(assignmentPath, JSON.stringify({slug, palette: name, colors: [bg1, bg2], allocation: 'Saved article allocation from the site palette resolver at publication.', reference: 'finite-sample-affine-diversification'}, null, 2) + '\n');
console.log(`Generated banner and two figures using ${name} palette; dense quarters ${quarters.join('/')}.`);
