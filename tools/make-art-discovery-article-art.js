#!/usr/bin/env node
'use strict';
// MIT generator; original diagrams CC0-1.0. Schematics, not sequence/assay data.
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..', 'assets', 'articles');
const C = { bg: '#142d30', white: '#fff9ed', muted: '#bbd6cf', teal: '#42d8c1', gold: '#efbe65', line: '#648c84' };
const text = (x, y, value, size = 34, color = C.white, anchor = 'start') => `<text x="${x}" y="${y}" font-size="${size}" fill="${color}" text-anchor="${anchor}">${value}</text>`;
const svg = (height, title, description, content) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 ${height}" role="img" aria-labelledby="title desc"><title id="title">${title}</title><desc id="desc">${description}</desc><rect width="960" height="${height}" rx="18" fill="${C.bg}"/><g font-family="Arial, Helvetica, sans-serif">${content}</g></svg>\n`;
const repeats = [74, 176, 278, 380].map(x => `<rect x="${x}" y="100" width="24" height="64" rx="4" fill="${C.teal}"/>`).join('');
const spacers = [98, 200, 302].map(x => `<rect x="${x}" y="115" width="78" height="34" rx="4" fill="${C.gold}"/>`).join('');
const banner = svg(320, 'The ART genomic neighbourhood', 'Schematic: repeated DNA units separated by spacers lie upstream of a reverse-transcriptase-like gene, with a recurring partner gene downstream. Four repeats illustrate the pattern, not a measured locus.',
  text(48, 48, 'A newly recognised genetic arrangement', 34) +
  `<path d="M55 132H906" stroke="${C.line}" stroke-width="5"/>${spacers}${repeats}` +
  `<path d="M475 90H668L710 132L668 174H475Z" fill="${C.teal}"/><path d="M744 90H862L904 132L862 174H744Z" fill="${C.gold}"/>` +
  text(224, 217, 'RNA array region', 32, C.white, 'middle') + text(591, 217, 'RT-like gene', 32, C.white, 'middle') + text(819, 217, 'Partner', 32, C.white, 'middle') +
  `<rect x="64" y="257" width="24" height="30" rx="3" fill="${C.teal}"/>` + text(105, 282, 'Repeat', 30) +
  `<rect x="284" y="257" width="56" height="30" rx="3" fill="${C.gold}"/>` + text(357, 282, 'Spacer', 30) + text(660, 282, 'DNA · schematic', 28, C.muted));
const figure = svg(900, 'From an RNA array to a functioning system: the missing steps', 'Transcription of the DNA array is supported by RNA evidence. The RNA substrate, reverse-transcriptase activity and biological role of ART remain unproved. Solid teal denotes reported evidence; dashed gold denotes proposed steps requiring experiments.',
  text(48, 65, 'Where the evidence stops', 42) +
  text(48, 111, 'Reported observations versus proposed function', 30, C.muted) +
  `<rect x="48" y="152" width="864" height="135" rx="12" fill="#204640" stroke="${C.teal}" stroke-width="2"/>` +
  text(78, 198, '1  DNA repeat array', 36) + text(78, 247, 'A recurring upstream sequence pattern', 30, C.muted) +
  `<path d="M112 296V337M98 324L112 340L126 324" fill="none" stroke="${C.teal}" stroke-width="5"/>` + text(151, 328, 'Transcription is supported', 30, C.teal) +
  `<rect x="48" y="355" width="864" height="135" rx="12" fill="#204640" stroke="${C.teal}" stroke-width="2"/>` +
  text(78, 401, '2  RNA from the array', 36) + text(78, 450, 'Mature RNA identities remain provisional', 30, C.muted) +
  `<path d="M112 501V549M98 536L112 552L126 536" fill="none" stroke="${C.gold}" stroke-width="5" stroke-dasharray="8 7"/>` + text(151, 538, 'Does ART copy these RNAs?', 30, C.gold) +
  `<rect x="48" y="566" width="864" height="135" rx="12" fill="#343b33" stroke="${C.gold}" stroke-width="2" stroke-dasharray="9 7"/>` +
  text(78, 612, '3  Reverse-transcription activity', 36) + text(78, 661, 'Substrate and DNA product not established', 30, C.muted) +
  text(48, 759, 'Still unknown: the system’s biological role', 34, C.gold) +
  `<path d="M48 795H912" stroke="${C.line}"/>` +
  text(48, 842, 'Solid: evidence reported in the preprint', 28, C.teal) +
  text(48, 880, 'Dashed: a hypothesis to test, not a demonstrated step', 28, C.gold));
fs.mkdirSync(root, { recursive: true });
for (const [name, content] of [['art-discovery-neighbourhood.svg', banner], ['art-discovery-evidence.svg', figure]]) {
  const file = path.join(root, name);
  if (process.argv.includes('--check')) {
    if (!fs.existsSync(file) || fs.readFileSync(file, 'utf8') !== content) {
      throw new Error(`Regenerate assets/articles/${name}`);
    }
    console.log(`verified assets/articles/${name}`);
  } else {
    fs.writeFileSync(file, content);
    console.log(`generated assets/articles/${name}`);
  }
}
