#!/usr/bin/env node
/* Generates the Policy Identification Observatory page artwork
 * → assets/art/observatory.svg              (cover banner, 3:1)
 * → assets/art/observatory-identification.svg (equivalence + the three regimes)
 * → assets/art/observatory-decision-map.svg (robust decision map)
 * Run at authoring time: node tools/make-observatory-art.js   (outputs are committed)
 *
 * The published pipeline is the separately curated
 * assets/art/observatory-pipeline.png. Its generation and review record is in
 * observatory-pipeline.provenance.json. The draft pipeline() function remains
 * below as a reproducible layout reference, but is intentionally not emitted. */
'use strict';
const fs = require('fs');
const path = require('path');
const OUT = path.join(__dirname, '..', 'assets', 'art');
fs.mkdirSync(OUT, { recursive: true });

/* Evidence Press palette (assets/style.css) */
const INK_BG1 = '#151a1e', INK_BG2 = '#1e2a2e';
const TEAL = '#2dd4bf', SKY = '#38bdf8', AMBER = '#f59e0b';
const CREAM = '#e7e5e4', MUTED = '#8a938f';
const SERIF = 'Georgia, \'Times New Roman\', serif';
const SANS = 'system-ui, -apple-system, \'Segoe UI\', Helvetica, Arial, sans-serif';

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function frame(w, h, inner, { title, desc, glow = SKY, decorative = false }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}"${
    decorative ? ' role="img" aria-hidden="true"' : ' role="img" aria-labelledby="t d"'}>
${decorative ? '' : `<title id="t">${esc(title)}</title>\n<desc id="d">${esc(desc)}</desc>\n`}<defs>
<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
<stop offset="0" stop-color="${INK_BG1}"/><stop offset="1" stop-color="${INK_BG2}"/>
</linearGradient>
<radialGradient id="glow" cx="0.72" cy="0.28" r="0.9">
<stop offset="0" stop-color="${glow}" stop-opacity="0.22"/><stop offset="1" stop-color="${glow}" stop-opacity="0"/>
</radialGradient>
<marker id="arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
<path d="M 0 0 L 10 5 L 0 10 z" fill="${MUTED}"/>
</marker>
<marker id="arwA" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
<path d="M 0 0 L 10 5 L 0 10 z" fill="${AMBER}"/>
</marker>
</defs>
<rect width="${w}" height="${h}" fill="url(#bg)"/>
<rect width="${w}" height="${h}" fill="url(#glow)"/>
${inner}
</svg>
`;
}

const txt = (x, y, s, o = {}) =>
  `<text x="${x}" y="${y}" font-family="${o.mono ? SANS : (o.sans ? SANS : SERIF)}" font-size="${o.size || 22}" fill="${o.fill || CREAM}"${
    o.anchor ? ` text-anchor="${o.anchor}"` : ''}${o.weight ? ` font-weight="${o.weight}"` : ''}${
    o.opacity ? ` opacity="${o.opacity}"` : ''}${o.style ? ` font-style="${o.style}"` : ''}${
    o.spacing ? ` letter-spacing="${o.spacing}"` : ''}>${esc(s)}</text>`;

/* ------------------------------------------------------------------ 1. cover */
function cover() {
  const W = 1200, H = 400, CX = 600, CY = 200, R = 88;
  let s = '';

  /* faint measurement grid */
  for (let x = 0; x <= W; x += 50)
    s += `<line x1="${x}" y1="0" x2="${x}" y2="${H}" stroke="${CREAM}" stroke-width="1" opacity="0.03"/>`;
  for (let y = 0; y <= H; y += 50)
    s += `<line x1="0" y1="${y}" x2="${W}" y2="${y}" stroke="${CREAM}" stroke-width="1" opacity="0.03"/>`;

  /* left: a fan of rival mechanisms, all compatible with the same evidence */
  const src = [70, 200];
  for (let k = -4; k <= 4; k++) {
    const spread = k * 34;
    const col = k === 0 ? AMBER : (k % 2 ? SKY : TEAL);
    const d = `M ${src[0]} ${src[1] + spread * 0.35} C 200 ${src[1] + spread * 1.5}, 330 ${CY + spread * 1.1}, 500 ${CY + spread * 0.18}`;
    s += `<path d="${d}" fill="none" stroke="${col}" stroke-width="${k === 0 ? 3 : 2}" opacity="${k === 0 ? 0.9 : 0.42}"/>`;
  }
  s += `<circle cx="${src[0]}" cy="${src[1]}" r="6" fill="${CREAM}" opacity="0.7"/>`;

  /* the evidence boundary: a frozen column of observations */
  for (let i = 0; i < 7; i++) {
    const y = 92 + i * 34;
    s += `<rect x="504" y="${y}" width="14" height="14" rx="3" fill="${CREAM}" opacity="${(0.18 + (i % 3) * 0.16).toFixed(2)}"/>`;
  }

  /* centre: the identification aperture */
  s += `<circle cx="${CX}" cy="${CY}" r="${R}" fill="${INK_BG1}" stroke="${CREAM}" stroke-width="2" opacity="0.96"/>`;
  s += `<line x1="${CX - 62}" y1="${CY + 22}" x2="${CX + 62}" y2="${CY + 22}" stroke="${MUTED}" stroke-width="2"/>`;
  for (let i = 0; i <= 6; i++)
    s += `<line x1="${CX - 62 + i * 20.7}" y1="${CY + 17}" x2="${CX - 62 + i * 20.7}" y2="${CY + 27}" stroke="${MUTED}" stroke-width="1.5" opacity="0.8"/>`;
  /* the identified set: a bracketed interval, not a point */
  s += `<rect x="${CX - 34}" y="${CY + 12}" width="70" height="20" fill="${AMBER}" opacity="0.30"/>`;
  s += `<path d="M ${CX - 34} ${CY + 6} v 32 M ${CX + 36} ${CY + 6} v 32" stroke="${AMBER}" stroke-width="3"/>`;
  s += txt(CX, CY - 14, 'θ', { size: 62, anchor: 'middle', fill: CREAM, opacity: 0.92, style: 'italic' });

  /* right: what survives — a bounded set, plus rivals the design cannot exclude */
  for (let k = -3; k <= 3; k++) {
    const y2 = CY + k * 40;
    const dash = Math.abs(k) > 1 ? ' stroke-dasharray="6 9"' : '';
    const col = Math.abs(k) > 1 ? MUTED : AMBER;
    s += `<path d="M 700 ${CY + k * 12} C 820 ${CY + k * 26}, 900 ${y2}, 1010 ${y2}" fill="none" stroke="${col}" stroke-width="2"${dash} opacity="${Math.abs(k) > 1 ? 0.32 : 0.7}"/>`;
  }
  s += `<rect x="1010" y="${CY - 48}" width="112" height="96" fill="${AMBER}" opacity="0.16"/>`;
  s += `<path d="M 1010 ${CY - 48} h -12 v 96 h 12 M 1122 ${CY - 48} h 12 v 96 h -12" fill="none" stroke="${AMBER}" stroke-width="3" opacity="0.85"/>`;

  s += txt(70, 352, 'rival mechanisms', { size: 19, sans: true, fill: MUTED, spacing: '0.06em' });
  s += txt(500, 352, 'frozen evidence', { size: 19, sans: true, fill: MUTED, spacing: '0.06em' });
  s += txt(1134, 352, 'what survives', { size: 19, sans: true, fill: MUTED, anchor: 'end', spacing: '0.06em' });

  return frame(W, H, s, { decorative: true, glow: TEAL });
}

/* --------------------------------------------------------------- 2. pipeline */
function pipeline() {
  const W = 1200, H = 700;
  const BW = 306, BH = 118, GAPX = 40, GAPY = 44, OX = 78, OY = 104;
  const stages = [
    ['1', 'Claim registration', 'Exact wording, estimand,\npopulation, period, decision', TEAL],
    ['2', 'Corpus freeze', 'Search date, source ledger,\ninclusion and exclusion rules', TEAL],
    ['3', 'Measurement audit', 'Ontology, stock–flow identities,\nunits, missingness, linkage', TEAL],
    ['4', 'Rival mechanisms', 'Source-backed rival ledger,\nsemantic coverage statement', SKY],
    ['5', 'Identification gate', 'Rank, null space, observability,\ncountermodel search', SKY],
    ['6', 'Bounded inference', 'Point estimate only if identified;\notherwise bounds or ambiguity', SKY],
    ['7', 'Sensitivity and decision', 'Assumption sweeps, robust policy,\nvalue of information', AMBER],
    ['8', 'Adversarial verification', 'Fresh agent, separate code,\nmutation tests, review ledger', AMBER],
    ['9', 'Release and persistence', 'Manifest, claim-to-evidence index,\nassurance statement, receipt', AMBER]
  ];

  let s = '';
  s += txt(78, 54, 'HOW A CASE RUNS', { size: 21, sans: true, fill: MUTED, weight: 600, spacing: '0.16em' });
  s += txt(1122, 54, 'evidence  →  inference  →  decision and release', { size: 21, sans: true, fill: MUTED, anchor: 'end' });

  stages.forEach((st, k) => {
    const col = k % 3, row = (k - col) / 3;
    const x = OX + col * (BW + GAPX), y = OY + row * (BH + GAPY);
    const [n, title, sub, c] = st;
    s += `<rect x="${x}" y="${y}" width="${BW}" height="${BH}" rx="12" fill="${INK_BG1}" fill-opacity="0.72" stroke="${c}" stroke-width="1.6" stroke-opacity="0.72"/>`;
    s += `<rect x="${x}" y="${y}" width="6" height="${BH}" rx="3" fill="${c}" opacity="0.9"/>`;
    s += `<circle cx="${x + 34}" cy="${y + 32}" r="15" fill="${c}" opacity="0.20"/>`;
    s += txt(x + 34, y + 40, n, { size: 20, sans: true, anchor: 'middle', fill: c, weight: 700 });
    s += txt(x + 60, y + 40, title, { size: 24, fill: CREAM });
    sub.split('\n').forEach((ln, i) =>
      s += txt(x + 22, y + 74 + i * 23, ln, { size: 16, sans: true, fill: MUTED }));
    /* within-row arrow */
    if (col < 2)
      s += `<line x1="${x + BW + 6}" y1="${y + BH / 2}" x2="${x + BW + GAPX - 8}" y2="${y + BH / 2}" stroke="${MUTED}" stroke-width="2" marker-end="url(#arw)" opacity="0.8"/>`;
    /* wrap arrow to the next row */
    if (col === 2 && row < 2) {
      const yb = y + BH, yn = y + BH + GAPY;
      s += `<path d="M ${x + BW - 30} ${yb + 6} v 12 q 0 10 -10 10 H ${OX + 10} q -10 0 -10 10 v 6" fill="none" stroke="${MUTED}" stroke-width="2" opacity="0.6" marker-end="url(#arw)"/>`;
      void yn;
    }
  });

  /* terminal statuses */
  const yT = OY + 3 * (BH + GAPY) + 34;
  s += txt(78, yT - 14, 'Every case closes in a registered terminal status', { size: 20, sans: true, fill: MUTED, weight: 600 });
  const pills = [
    ['PUBLICATION_READY', TEAL], ['…_NONIDENTIFICATION', TEAL], ['…_PARTIAL_IDENTIFICATION', TEAL],
    ['BLOCKED_…', AMBER], ['REJECTED_…', AMBER]
  ];
  let px = 78;
  pills.forEach(([label, c]) => {
    const wpx = 14 + label.length * 10.2;
    s += `<rect x="${px}" y="${yT}" width="${wpx}" height="34" rx="17" fill="${c}" fill-opacity="0.14" stroke="${c}" stroke-opacity="0.55"/>`;
    s += txt(px + wpx / 2, yT + 23, label, { size: 16, sans: true, anchor: 'middle', fill: c });
    px += wpx + 12;
  });

  return frame(W, H, s, {
    title: 'The nine stages of an Observatory case',
    desc: 'A flow diagram in three rows of three. Row one, evidence: claim registration (exact wording, estimand, population, period, decision), corpus freeze (search date, source ledger, inclusion and exclusion rules), measurement audit (ontology, stock-flow identities, units, missingness, linkage). Row two, inference: rival mechanisms (source-backed rival ledger, semantic coverage statement), identification gate (rank, null space, observability, countermodel search), bounded inference (point estimate only if identified, otherwise bounds or ambiguity). Row three, decision and release: sensitivity and decision analysis (assumption sweeps, robust-policy set, value of information), adversarial verification (fresh agent, separate code, mutation tests, review ledger), release and persistence (manifest, claim-to-evidence index, assurance statement, receipt). Every case closes with a registered terminal status: publication ready, publication ready non-identification, publication ready partial identification, blocked, or rejected.'
  });
}

/* -------------------------------------------------- 3. identification regimes */
function identification() {
  const W = 1200, H = 520;
  let s = '';

  /* Panel A: observational equivalence */
  const ax = 90, ay = 150, aw = 440, ah = 260;
  s += txt(ax, 76, 'One observed series, four mechanisms', { size: 27, fill: CREAM });
  s += txt(ax, 108, 'Each curve reproduces the same records exactly.', { size: 18, sans: true, fill: MUTED });
  s += `<line x1="${ax}" y1="${ay + ah}" x2="${ax + aw}" y2="${ay + ah}" stroke="${MUTED}" stroke-width="2"/>`;
  s += `<line x1="${ax}" y1="${ay}" x2="${ax}" y2="${ay + ah}" stroke="${MUTED}" stroke-width="2"/>`;

  const pts = [0.06, 0.2, 0.34, 0.48, 0.62, 0.76, 0.9].map((t, i) => {
    const x = ax + t * aw;
    const y = ay + ah - (0.18 + 0.62 * t + 0.1 * Math.sin(i * 1.7)) * ah;
    return [x, y];
  });
  const wig = [
    { amp: 0, col: AMBER, w: 3, op: 0.95 },
    { amp: 26, col: SKY, w: 2, op: 0.7 },
    { amp: -30, col: TEAL, w: 2, op: 0.7 },
    { amp: 48, col: CREAM, w: 2, op: 0.42 }
  ];
  for (const { amp, col, w, op } of wig) {
    let d = `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
    for (let i = 1; i < pts.length; i++) {
      const [x0, y0] = pts[i - 1], [x1, y1] = pts[i];
      const mx = (x0 + x1) / 2, my = (y0 + y1) / 2 + amp;
      d += ` Q ${mx.toFixed(1)} ${my.toFixed(1)} ${x1.toFixed(1)} ${y1.toFixed(1)}`;
    }
    s += `<path d="${d}" fill="none" stroke="${col}" stroke-width="${w}" opacity="${op}"/>`;
  }
  for (const [x, y] of pts)
    s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="6.5" fill="${INK_BG1}" stroke="${CREAM}" stroke-width="2.4"/>`;
  s += txt(ax, ay + ah + 34, 'observed records', { size: 18, sans: true, fill: MUTED });
  s += txt(ax + aw, ay + ah + 34, 'time', { size: 18, sans: true, fill: MUTED, anchor: 'end' });

  /* divider */
  s += `<line x1="600" y1="60" x2="600" y2="${H - 50}" stroke="${CREAM}" stroke-width="1" opacity="0.12"/>`;

  /* Panel B: the three regimes */
  const bx = 690, bw = 450;
  s += txt(bx - 40, 76, 'What the design can then support', { size: 27, fill: CREAM });
  s += txt(bx - 40, 108, 'No conclusion may exceed the identified result.', { size: 18, sans: true, fill: MUTED });

  const rows = [
    ['Point identified', 'point'],
    ['Partially identified', 'set'],
    ['Not identified', 'all']
  ];
  rows.forEach(([label, kind], i) => {
    const y = 190 + i * 104;
    s += txt(bx - 40, y - 20, label, { size: 22, sans: true, fill: CREAM });
    s += `<line x1="${bx - 40}" y1="${y + 18}" x2="${bx - 40 + bw}" y2="${y + 18}" stroke="${MUTED}" stroke-width="2"/>`;
    for (let k = 0; k <= 8; k++)
      s += `<line x1="${bx - 40 + k * bw / 8}" y1="${y + 13}" x2="${bx - 40 + k * bw / 8}" y2="${y + 23}" stroke="${MUTED}" stroke-width="1.4" opacity="0.7"/>`;
    if (kind === 'point') {
      s += `<circle cx="${bx + 170}" cy="${y + 18}" r="9" fill="${AMBER}"/>`;
    } else if (kind === 'set') {
      s += `<rect x="${bx + 78}" y="${y + 6}" width="190" height="24" fill="${AMBER}" opacity="0.32"/>`;
      s += `<path d="M ${bx + 78} ${y - 2} v 40 M ${bx + 268} ${y - 2} v 40" stroke="${AMBER}" stroke-width="3.4"/>`;
    } else {
      s += `<rect x="${bx - 40}" y="${y + 6}" width="${bw}" height="24" fill="${AMBER}" opacity="0.16"/>`;
      s += `<path d="M ${bx - 30} ${y + 18} h -14 M ${bx - 40 + bw - 10} ${y + 18} h 14" stroke="${AMBER}" stroke-width="2.6" marker-end="url(#arwA)" opacity="0.8"/>`;
    }
  });
  s += txt(bx - 40, 190 + 2 * 104 + 66, 'admissible values of the target quantity θ', { size: 17, sans: true, fill: MUTED });

  return frame(W, H, s, {
    title: 'Observational equivalence and the three identification regimes',
    desc: 'Left panel: one series of observed records, drawn as seven circles, with four different mechanism curves — amber, blue, teal and cream — all passing exactly through those records. The evidence alone cannot separate them. Right panel: three axes for the target quantity theta. Point identified shows a single amber dot. Partially identified shows a bracketed amber interval covering part of the axis. Not identified shows the whole axis shaded amber with arrows at both ends.'
  });
}

/* ------------------------------------------------------------ 4. decision map */
function decisionMap() {
  const W = 1200, H = 560;
  const CW = 84, CH = 58, GAP = 10, OX = 282, OY = 186;
  /* rows: policy options; columns: models still compatible with the evidence
     true = meets the declared minimum standard under that model */
  const rows = [
    ['Option A', [0, 0, 0, 0, 0, 0], 'Dominated'],
    ['Option B', [1, 1, 1, 1, 1, 1], 'Robust across all models'],
    ['Option C', [1, 1, 1, 0, 1, 1], 'Fails under one model'],
    ['Option D', [1, 0, 1, 0, 1, 0], 'Turns on one assumption']
  ];

  let s = '';
  s += txt(78, 62, 'A DECISION MAP, NOT A VERDICT', { size: 21, sans: true, fill: MUTED, weight: 600, spacing: '0.16em' });
  s += txt(78, 102, 'Each policy option is scored against every model the evidence still admits.', { size: 21, sans: true, fill: CREAM, opacity: 0.85 });

  for (let c = 0; c < 6; c++)
    s += txt(OX + c * (CW + GAP) + CW / 2, OY - 16, 'M' + (c + 1), { size: 19, sans: true, anchor: 'middle', fill: MUTED });
  s += txt(OX + 3 * (CW + GAP) - GAP / 2, OY - 46, 'ADMISSIBLE MODELS', { size: 18, sans: true, anchor: 'middle', fill: MUTED, spacing: '0.10em' });

  rows.forEach(([label, cells, verdict], r) => {
    const y = OY + r * (CH + GAP);
    s += txt(OX - 24, y + CH / 2 + 8, label, { size: 23, anchor: 'end', fill: CREAM });
    cells.forEach((v, c) => {
      const x = OX + c * (CW + GAP);
      const col = v ? TEAL : AMBER;
      s += `<rect x="${x}" y="${y}" width="${CW}" height="${CH}" rx="8" fill="${col}" fill-opacity="${v ? 0.26 : 0.16}" stroke="${col}" stroke-opacity="0.65"/>`;
      s += v
        ? `<path d="M ${x + CW / 2 - 13} ${y + CH / 2} l 9 10 l 17 -19" fill="none" stroke="${col}" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/>`
        : `<path d="M ${x + CW / 2 - 11} ${y + CH / 2 - 11} l 22 22 M ${x + CW / 2 + 11} ${y + CH / 2 - 11} l -22 22" stroke="${col}" stroke-width="3.4" stroke-linecap="round"/>`;
    });
    const vx = OX + 6 * (CW + GAP) + 12;
    const vcol = r === 1 ? TEAL : (r === 0 ? AMBER : CREAM);
    s += txt(vx, y + CH / 2 + 8, verdict, { size: 21, sans: true, fill: vcol, opacity: r > 1 ? 0.85 : 1 });
  });

  const ly = OY + 4 * (CH + GAP) + 44;
  s += `<rect x="78" y="${ly - 17}" width="22" height="22" rx="5" fill="${TEAL}" fill-opacity="0.26" stroke="${TEAL}" stroke-opacity="0.65"/>`;
  s += txt(110, ly, 'meets the declared minimum standard', { size: 19, sans: true, fill: MUTED });
  s += `<rect x="520" y="${ly - 17}" width="22" height="22" rx="5" fill="${AMBER}" fill-opacity="0.16" stroke="${AMBER}" stroke-opacity="0.65"/>`;
  s += txt(552, ly, 'fails it', { size: 19, sans: true, fill: MUTED });
  s += txt(78, ly + 44, 'Objectives, distributional weights and acceptable risk remain with the institutions authorised to set them.', { size: 19, sans: true, fill: MUTED, opacity: 0.85 });

  return frame(W, H, s, {
    title: 'Robust-decision map across the admissible model set',
    desc: 'A grid of four policy options scored against six models the evidence still admits. Option A fails under every model and is dominated. Option B passes under every model and is robust. Option C passes under five of six models and fails under one. Option D passes under three and fails under three, so its ranking turns on a single visible assumption. A note records that objectives, distributional weights, rights constraints and acceptable risk remain with the people and institutions authorised to set them.',
    glow: AMBER
  });
}

const files = {
  'observatory.svg': cover(),
  'observatory-identification.svg': identification(),
  'observatory-decision-map.svg': decisionMap()
};
for (const [name, svg] of Object.entries(files)) {
  fs.writeFileSync(path.join(OUT, name), svg);
  console.log('art:', name, `(${svg.length} bytes)`);
}
console.log('art: observatory-pipeline.png (curated separately; see provenance JSON)');
