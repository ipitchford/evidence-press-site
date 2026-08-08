#!/usr/bin/env node
'use strict';
/*
 * make-media.js — authoring-time generator for the Productivity Protocols
 * section media, in the Evidence Press house idiom (dark ground, teal glow,
 * gold accents, serif display type). Outputs are COMMITTED and are NOT rebuilt
 * by build-protocols.js or CI, so the byte-identical build guarantee is
 * untouched — exactly like the main site's make-art / make-page-og.
 *
 *   ../assets/art/productivity.svg        1200x400 cover (page cover + OG ground)
 *   ../assets/art/protocols-ladders.svg   the two-ladder explanatory figure
 *   ../assets/og/productivity.png         1200x630 OG card — the landing page
 *   ../assets/og/protocols.png            1200x630 OG card — the registry
 *   ../assets/og/protocol-<id>.png        1200x630 OG card — one per protocol
 *
 * Rasterisation uses rsvg-convert (brew install librsvg); no headless browser.
 * Run: node protocols/tools/make-media.js
 */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { load } = require('./lib/yaml');
const U = require('./lib/util');
const { validatePackReceipt } = require('../build-protocols');

const ROOT = U.ROOT;                                  // protocols/
const ART = path.join(ROOT, '..', 'assets', 'art');
const OG = path.join(ROOT, '..', 'assets', 'og');
fs.mkdirSync(ART, { recursive: true });
fs.mkdirSync(OG, { recursive: true });

// House palette (mirrors assets/style.css tokens).
const C = {
  dark: '#151a1e', dark2: '#1e2a2e', paper: '#faf7f2', teal: '#2dd4bf', teal2: '#0f766e',
  tealSoft: '#ccfbf1', amber: '#f59e0b', amberSoft: '#fde68a', muted: '#a8a29e', line: '#334155'
};
const esc = s => String(s).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
const poly = pts => pts.map(p => p.join(',')).join(' ');

/* ---------------------------------------------------- cover art (1200x400) */
// The narrative motif, honest by construction: a protocol-assurance staircase
// that climbs, and a productivity-evidence line that stays low.
const COVER_A = [[150, 318], [300, 318], [300, 288], [430, 288], [430, 244], [560, 244], [560, 196], [690, 196], [690, 150], [820, 150], [820, 110], [950, 110], [950, 82], [1075, 82]];
const COVER_A_DOTS = [[300, 288], [430, 244], [560, 196], [690, 150], [820, 110], [950, 82], [1075, 82]];
const COVER_E = [[150, 326], [300, 322], [430, 320], [560, 322], [690, 316], [820, 320], [950, 314], [1075, 317]];

function coverInner(idp) {
  const dotsA = COVER_A_DOTS.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="${C.teal}"/>`).join('');
  const dotsE = COVER_E.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3.5" fill="${C.amber}"/>`).join('');
  return `<defs>
<linearGradient id="${idp}bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${C.dark}"/><stop offset="1" stop-color="${C.dark2}"/></linearGradient>
<radialGradient id="${idp}glow" cx="0.78" cy="0.2" r="0.85"><stop offset="0" stop-color="${C.teal}" stop-opacity="0.20"/><stop offset="1" stop-color="${C.teal}" stop-opacity="0"/></radialGradient>
<pattern id="${idp}dots" width="34" height="34" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.3" fill="${C.teal}" opacity="0.10"/></pattern>
</defs>
<rect width="1200" height="400" fill="url(#${idp}bg)"/>
<rect width="1200" height="400" fill="url(#${idp}dots)"/>
<rect width="1200" height="400" fill="url(#${idp}glow)"/>
<line x1="120" y1="330" x2="1080" y2="330" stroke="${C.line}" stroke-width="1.5" opacity="0.45"/>
<polyline fill="none" stroke="${C.amber}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round" opacity="0.85" points="${poly(COVER_E)}"/>
<polyline fill="none" stroke="${C.teal}" stroke-width="4.5" stroke-linejoin="round" stroke-linecap="round" points="${poly(COVER_A)}"/>
${dotsE}${dotsA}`;
}
function coverSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 400" role="img" aria-label="Productivity Protocols — Evidence Press">
${coverInner('c')}
</svg>
`;
}

/* ------------------------------------------ two-ladder figure (explanatory) */
function laddersSvg() {
  const asr = U.readJSON(path.join(ROOT, 'status', 'protocol-assurance.json')).states;
  const evd = U.readJSON(path.join(ROOT, 'status', 'productivity-evidence.json')).states;
  const progA = asr.filter(s => s.polarity === 'progressive').map(s => s.id);
  const termA = asr.filter(s => s.polarity === 'terminal').map(s => s.id);
  const progE = evd.filter(s => s.polarity !== 'negative').map(s => s.id); // neutral + positive
  const negE = evd.filter(s => s.polarity === 'negative').map(s => s.id);

  const W = 1060, H = 706, PITCH = 48, RW = 384, RH = 40;
  const baseTop = 512;                     // top edge of the bottom rung
  const rung = (x, y, label, kind) => {
    const stroke = kind === 'amber' ? C.amber : kind === 'muted' ? C.line : C.teal;
    const fill = kind === 'amber' ? 'rgba(245,158,11,0.12)' : kind === 'muted' ? 'rgba(51,65,85,0.18)' : 'rgba(45,212,191,0.12)';
    const tcol = kind === 'amber' ? C.amberSoft : kind === 'muted' ? C.muted : C.tealSoft;
    return `<g><rect x="${x}" y="${y}" width="${RW}" height="${RH}" rx="8" fill="${fill}" stroke="${stroke}" stroke-width="1.5"/>` +
      `<text x="${x + 16}" y="${y + 26}" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="15" letter-spacing="0.4" fill="${tcol}">${esc(label)}</text></g>`;
  };
  const ladder = (cx, states, kind) => {
    const x = cx - RW / 2;
    let g = '';
    // rail
    g += `<line x1="${cx}" y1="${baseTop + RH}" x2="${cx}" y2="${baseTop - (states.length - 1) * PITCH}" stroke="${kind === 'amber' ? C.amber : C.teal}" stroke-width="1" opacity="0.25"/>`;
    states.forEach((s, i) => { g += rung(x, baseTop - i * PITCH, s, kind); });
    return g;
  };
  const col = (cx, title, sub, states, kind) => {
    const x = cx - RW / 2;
    return `<text x="${x}" y="96" font-family="Georgia, 'Times New Roman', serif" font-size="26" font-weight="700" fill="${kind === 'amber' ? C.amber : C.teal}">${esc(title)}</text>` +
      `<text x="${x}" y="124" font-family="system-ui, sans-serif" font-size="15" fill="${C.muted}">${esc(sub)}</text>` +
      ladder(cx, states, kind);
  };
  const offChips = (cx, states, kind) => {
    const x = cx - RW / 2;
    let g = `<text x="${x}" y="${baseTop + RH + 40}" font-family="system-ui, sans-serif" font-size="12" letter-spacing="0.06em" fill="${C.muted}">OFF-LADDER · RETAINED FINDINGS</text>`;
    let cxp = x;
    states.forEach(s => {
      const w = 12 + s.length * 8.4;
      g += `<g><rect x="${cxp}" y="${baseTop + RH + 52}" width="${w}" height="30" rx="6" fill="rgba(180,83,9,0.12)" stroke="${C.amber}" stroke-width="1.2"/>` +
        `<text x="${cxp + 8}" y="${baseTop + RH + 71}" font-family="ui-monospace, monospace" font-size="12" fill="${C.amberSoft}">${esc(s)}</text></g>`;
      cxp += w + 12;
    });
    return g;
  };
  const leftCx = 285, rightCx = 775;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="The two independent status ladders: protocol assurance and productivity evidence, never merged">
<rect width="${W}" height="${H}" fill="${C.dark}"/>
<rect width="${W}" height="${H}" fill="url(#lg)"/>
<defs><radialGradient id="lg" cx="0.5" cy="0.1" r="0.9"><stop offset="0" stop-color="${C.teal}" stop-opacity="0.08"/><stop offset="1" stop-color="${C.teal}" stop-opacity="0"/></radialGradient></defs>
<text x="${W / 2}" y="46" text-anchor="middle" font-family="system-ui, sans-serif" font-size="15" letter-spacing="0.14em" fill="${C.teal}">TWO INDEPENDENT MEASURES · NEVER MERGED</text>
<line x1="${W / 2}" y1="72" x2="${W / 2}" y2="${baseTop + RH}" stroke="${C.line}" stroke-width="1" opacity="0.4"/>
${col(leftCx, 'Protocol assurance', 'What was checked, and how?', progA, 'teal')}
${col(rightCx, 'Productivity evidence', 'Does it help? — measured, never assumed', progE, 'amber')}
${offChips(leftCx, termA, 'muted')}
${offChips(rightCx, negE, 'amber')}
<text x="${W / 2}" y="${H - 20}" text-anchor="middle" font-family="Georgia, serif" font-size="16" fill="${C.paper}">A protocol can top the left ladder and still sit at NO_CLEAR_GAIN — as the 0.1.0 predecessors did. That is the design.</text>
</svg>
`;
}

/* ------------------------------------------------------ OG cards (1200x630) */
function ogSvg({ kicker, title, sub, foot }) {
  const titleSize = title.length > 34 ? 60 : 68;
  const chips = (foot || []).map((f, i) => {
    const x = 70 + i * 300;
    return `<g><line x1="${x}" y1="548" x2="${x}" y2="578" stroke="${f.accent || C.amber}" stroke-width="3"/>` +
      `<text x="${x + 14}" y="562" font-family="system-ui, sans-serif" font-size="17" fill="${C.muted}">${esc(f.label)}</text>` +
      `<text x="${x + 14}" y="584" font-family="ui-monospace, monospace" font-size="16" fill="${f.accent || C.tealSoft}">${esc(f.value)}</text></g>`;
  }).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630">
<svg x="0" y="0" width="1200" height="630" viewBox="0 0 1200 400" preserveAspectRatio="xMidYMid slice">${coverInner('o')}</svg>
<rect width="1200" height="630" fill="url(#shade)"/>
<defs><linearGradient id="shade" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${C.dark}" stop-opacity="0.96"/><stop offset="0.62" stop-color="${C.dark}" stop-opacity="0.72"/><stop offset="1" stop-color="${C.dark}" stop-opacity="0.2"/></linearGradient></defs>
<text x="70" y="150" font-family="system-ui, sans-serif" font-size="22" font-weight="600" letter-spacing="0.14em" fill="${C.teal}">${esc(kicker)}</text>
<text x="70" y="${titleSize > 62 ? 260 : 255}" font-family="Georgia, 'Times New Roman', serif" font-size="${titleSize}" font-weight="700" fill="${C.paper}">${esc(title)}</text>
<text x="70" y="${titleSize > 62 ? 322 : 320}" font-family="system-ui, sans-serif" font-size="26" fill="${C.tealSoft}">${esc(sub)}</text>
${chips}
</svg>
`;
}
function rasterOG(name, svg) {
  const out = path.join(OG, name + '.png');
  execFileSync('rsvg-convert', ['-w', '1200', '-h', '630', '-o', out], { input: svg });
  console.log('og:', name);
}

/* ---------------------------------------------------------------- protocols */
function loadPacks() {
  return U.listPacks().map(id => {
    const dir = U.packDir(id);
    const p = load(fs.readFileSync(path.join(dir, 'protocol.yaml'), 'utf8'));
    const manifest = U.readJSON(path.join(dir, 'MANIFEST.json'));
    const receiptPath = path.join(dir, 'RECEIPT.json');
    const receipt = fs.existsSync(receiptPath) ? U.readJSON(receiptPath) : null;
    const assurance = receipt ? validatePackReceipt(id, p, manifest, receipt) : p.assurance_status;
    return { id, p, assurance };
  });
}
const clip = (s, n) => (s.length > n ? s.slice(0, n - 1).trimEnd() + '…' : s);

function main() {
  fs.writeFileSync(path.join(ART, 'productivity.svg'), coverSvg());
  fs.writeFileSync(path.join(ART, 'protocols-ladders.svg'), laddersSvg());
  console.log('art: productivity.svg, protocols-ladders.svg');

  rasterOG('productivity', ogSvg({
    kicker: 'EVIDENCE PRESS · PRODUCTIVITY PROTOCOLS',
    title: 'Methods, not papers',
    sub: 'Open, inspectable workflow candidates — evidence attached',
    foot: [
      { label: 'Every protocol', value: 'what was checked?', accent: C.teal },
      { label: 'And separately', value: 'does it help?', accent: C.amber }
    ]
  }));
  rasterOG('protocols', ogSvg({
    kicker: 'EVIDENCE PRESS · PRODUCTIVITY PROTOCOLS',
    title: 'The protocol library',
    sub: 'Downloadable agent workflows, each with two honest status ladders',
    foot: [
      { label: 'Protocol assurance', value: 'what was checked?', accent: C.teal },
      { label: 'Productivity evidence', value: 'does it help?', accent: C.amber }
    ]
  }));

  for (const { id, p, assurance } of loadPacks()) {
    const ev = p.productivity_evidence || 'NO_IMPACT_EVIDENCE';
    const evNeg = /NO_CLEAR_GAIN|HARM|NO_IMPACT/.test(ev);
    rasterOG('protocol-' + id, ogSvg({
      kicker: 'EVIDENCE PRESS · PRODUCTIVITY PROTOCOL',
      title: clip(p.title, 46),
      sub: clip(p.purpose, 82),
      foot: [
        { label: 'Assurance', value: assurance, accent: C.teal },
        { label: 'Evidence', value: ev, accent: evNeg ? C.amber : C.tealSoft }
      ]
    }));
  }
}

if (require.main === module) main();
module.exports = { coverSvg, laddersSvg, ogSvg };
