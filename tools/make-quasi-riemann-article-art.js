#!/usr/bin/env node
'use strict';
/* Media for articles/how-a-language-model-proved-quasi-riemann.
 * MIT generator; generated artwork CC0-1.0.
 *
 *   node tools/make-quasi-riemann-article-art.js          # write the three SVGs
 *   node tools/make-quasi-riemann-article-art.js --check  # verify committed bytes
 *
 * Banner: exact coordinates on a schematic view of the critical strip.
 *   - zero ordinates: first 100 nontrivial zeros of zeta, mpmath.zetazero(n),
 *     n = 1..100, 20 significant digits, rounded here to 3 decimals;
 *   - classical region: sigma >= 1 - 1/(5.558691 log t), t >= 2
 *     (Mossinghoff, Trudgian and Yang, arXiv:2212.06867, Theorem 1.3);
 *   - new region: Re s > 7/8 (OpenAI, openai/math family 003, Lean challenge
 *     QuasiRiemannHypothesis at commit fd4aeeb).
 * Figures: verification layers and the route of the 11/12 proof, as stated in
 * the article. Nothing here is a numerical result of Evidence Press.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SLUG = 'how-a-language-model-proved-quasi-riemann';
const OUT = path.join(ROOT, 'assets/articles');
const CHECK = process.argv.includes('--check');
const { assign, palettes } = require('./banner-palettes');

// Article art sits outside the paper-art registry. Resolve the next rotation
// without writing the paper registry, and keep the allocation with the article.
const palettePath = path.join(ROOT, 'articles', SLUG, 'art-palette.json');
const paletteName = fs.existsSync(palettePath)
  ? JSON.parse(fs.readFileSync(palettePath, 'utf8')).palette
  : assign(JSON.parse(fs.readFileSync(path.join(ROOT, 'data/BANNER_PALETTES.json'), 'utf8')), SLUG);
const [bg1, bg2] = palettes[paletteName];

const C = {
  ivory: '#fff9ed', gold: '#efbe65', aqua: '#71d5d0', muted: '#c9d3d6', ink: '#152430',
  fig1: '#101d25', fig2: '#1b3037', card: '#19363b', cardLine: '#4ea99e', rule: '#416368',
  amberCard: '#34342d', amberLine: '#d4b365', amberText: '#ebcc83', teal: '#81ddd0',
  text: '#f4efe5', soft: '#d8e0dc', quiet: '#adbfbe'
};
const SANS = "system-ui, -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif";
const SERIF = "Georgia, 'Times New Roman', serif";
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const f = n => Number(Number(n).toFixed(2)).toString();
function text(x, y, content, size, fill, extra = '') {
  // `content` is escaped unless it is passed as {raw: '...'} (used for tspans).
  const body = typeof content === 'object' ? content.raw : esc(content);
  return `<text x="${f(x)}" y="${f(y)}" font-size="${size}" fill="${fill}"${extra ? ' ' + extra : ''}>${body}</text>`;
}
const sup = s => `<tspan font-size="70%" baseline-shift="super">${esc(s)}</tspan>`;

/* ------------------------------------------------------------------ banner */
const ZEROS = [
  14.135, 21.022, 25.011, 30.425, 32.935, 37.586, 40.919, 43.327, 48.005, 49.774,
  52.970, 56.446, 59.347, 60.832, 65.113, 67.080, 69.546, 72.067, 75.705, 77.145,
  79.337, 82.910, 84.735, 87.425, 88.809, 92.492, 94.651, 95.871, 98.831, 101.318,
  103.726, 105.447, 107.169, 111.030, 111.875, 114.320, 116.227, 118.791, 121.370, 122.947,
  124.257, 127.517, 129.579, 131.088, 133.498, 134.757, 138.116, 139.736, 141.124, 143.112,
  146.001, 147.423, 150.054, 150.925, 153.025, 156.113, 157.598, 158.850, 161.189, 163.031,
  165.537, 167.184, 169.095, 169.912, 173.412, 174.754, 176.441, 178.377, 179.916, 182.207,
  184.874, 185.599, 187.229, 189.416, 192.027, 193.080, 195.265, 196.876, 198.015, 201.265,
  202.494, 204.190, 205.395, 207.906, 209.577, 211.691, 213.348, 214.547, 216.170, 219.068,
  220.715, 221.431, 224.007, 224.983, 227.421, 229.337, 231.250, 231.987, 233.693, 236.524
];
const MTY_R = 5.558691;           // sigma >= 1 - 1/(R log t), t >= 2
const T_MIN = 2, T_MAX = 1e6;
const W = 1200, H = 400;
const xOf = t => (Math.log10(t) - Math.log10(T_MIN)) / (Math.log10(T_MAX) - Math.log10(T_MIN)) * W;
const Y_ONE = 62, Y_HALF = 306;                     // sigma = 1 and sigma = 1/2
const yOf = sigma => Y_ONE + (1 - sigma) * (Y_HALF - Y_ONE) / 0.5;
const classical = t => 1 - 1 / (MTY_R * Math.log(t));

function banner() {
  const n = 240;
  const curve = Array.from({ length: n + 1 }, (_, i) => {
    const t = T_MIN * Math.pow(T_MAX / T_MIN, i / n);
    return `${f(xOf(t))} ${f(yOf(classical(t)))}`;
  });
  const sliver = `M0 ${f(Y_ONE)}H${W}L${curve.slice().reverse().join('L')}Z`;
  const dots = ZEROS.map(t => `<circle cx="${f(xOf(t))}" cy="${Y_HALF}" r="3.4"/>`).join('');
  const ticks = [10, 100, 1e3, 1e4].map((t, i) => {
    const x = xOf(t);
    const label = ['10', '100', '1,000', '10⁴'][i];
    return `<path d="M${f(x)} 366V374" stroke="${C.muted}" stroke-opacity=".7"/>` +
      text(x, 395, label, 22, C.muted, 'text-anchor="middle"');
  }).join('');
  const yBand = yOf(7 / 8);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="title desc" data-banner-palette="${paletteName}">
<title id="title">A zero-free band of fixed width</title>
<desc id="desc">The critical strip of the Riemann zeta function drawn sideways: height t runs left to right on a logarithmic scale from 2 to one million; the real part runs upwards from one half to one. Dots on the line Re s = 1/2 are the first 100 nontrivial zeros. An aqua region along Re s = 1 is the explicit classical zero-free region, sigma at least 1 minus 1 over 5.558691 log t, which thins as t grows and dips below 7/8 only for t below about 4.2. A gold band of constant width covers Re s from 7/8 to 1, the half-plane that OpenAI's Lean-verified theorem shows is free of zeros at every height.</desc>
<defs><linearGradient id="qr-bg" x2="1" y2="1"><stop stop-color="${bg1}"/><stop offset="1" stop-color="${bg2}"/></linearGradient></defs>
<rect width="${W}" height="${H}" fill="url(#qr-bg)"/>
<g font-family="${SANS}">
<rect x="0" y="${Y_ONE}" width="${W}" height="${f(yBand - Y_ONE)}" fill="${C.gold}"/>
<path d="${sliver}" fill="${C.aqua}"/>
<path d="M0 ${Y_ONE}H${W}" stroke="${C.ivory}" stroke-width="2"/>
${text(1176, 46, 'Re s = 1', 26, C.muted, 'text-anchor="end"')}
${text(1176, f(yBand + 32), 'Re s = 7/8', 26, C.muted, 'text-anchor="end"')}
${text(1168, f(yBand - 10), 'No zeros where Re s > 7/8, at every height', 40, C.ink, 'text-anchor="end" font-weight="700"')}
<path d="M74 ${f(yOf(classical(4)) + 8)}C 96 172 112 180 136 184" fill="none" stroke="${C.aqua}" stroke-width="2"/>
${text(146, 194, 'Classical zero-free region: thins as t grows', 33, C.aqua)}
${text(1176, 246, 'Between ½ and 7/8: no result valid at every height', 27, C.muted, 'text-anchor="end"')}
<path d="M0 ${Y_HALF}H${W}" stroke="${C.ivory}" stroke-width="2" stroke-opacity=".55" stroke-dasharray="2 7"/>
<path d="M0 ${Y_HALF}H${f(xOf(ZEROS[ZEROS.length - 1]) + 6)}" stroke="${C.ivory}" stroke-width="2"/>
<g fill="${C.ivory}">${dots}</g>
${text(1176, Y_HALF - 16, 'Re s = ½', 36, C.ivory, 'text-anchor="end"')}
${text(f(xOf(ZEROS[0])), Y_HALF + 42, 'First 100 zeros of ζ, all on the critical line', 27, C.ivory)}
${ticks}
${text(1176, 395, 'height t, log scale', 22, C.muted, 'text-anchor="end"')}
</g></svg>
`;
}

/* -------------------------------------------------- shared figure chrome */
function frame(width, height, title, subtitle, id, desc, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="${id}-title ${id}-desc">
<title id="${id}-title">${esc(title)}</title>
<desc id="${id}-desc">${esc(desc)}</desc>
<defs><linearGradient id="${id}-bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${C.fig1}"/><stop offset="1" stop-color="${C.fig2}"/></linearGradient>
<marker id="${id}-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M1 1L9 5L1 9" fill="none" stroke="${C.teal}" stroke-width="1.8"/></marker></defs>
<rect width="${width}" height="${height}" rx="20" fill="url(#${id}-bg)"/>
<path d="M40 50H84" stroke="${C.teal}" stroke-width="4"/>
${text(98, 56, 'EVIDENCE PRESS · EXPLAINER', 15, C.quiet, `font-family="${SANS}" letter-spacing="2"`)}
${text(40, 110, title, 36, C.text, `font-family="${SERIF}"`)}
${text(40, 146, subtitle, 20, C.quiet, `font-family="${SANS}"`)}
<g font-family="${SANS}">
${body}
</g></svg>
`;
}
function card(x, y, w, h, kind = 'teal', dashed = false) {
  const [fill, line] = kind === 'amber' ? [C.amberCard, C.amberLine] : [C.card, C.cardLine];
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="${fill}" stroke="${line}" stroke-width="1.5"${dashed ? ' stroke-dasharray="7 6"' : ''}/>`;
}
const kicker = (x, y, s, fill = C.teal) => text(x, y, s, 16, fill, 'font-weight="600" letter-spacing="1.2"');
const tick = (x, y) => `<path d="M${x} ${y - 9}l7 7l13 -15" fill="none" stroke="${C.teal}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`;

/* ------------------------------------------------- verification figure */
function verification() {
  const Wd = 800, Hd = 1150;
  const b = [];
  // Row 1: challenge and solution.
  b.push(card(40, 180, 350, 186), kicker(64, 216, 'CHALLENGE · 9 LINES'),
    text(64, 260, 'ζ(s) ≠ 0 if Re s > 7/8', 26, C.text, 'font-weight="650"'),
    `<path d="M64 282H366" stroke="${C.rule}"/>`,
    text(64, 316, 'Uses Mathlib’s own ζ', 20, C.soft),
    text(64, 346, 'Proof body: sorry', 20, C.quiet));
  b.push(card(410, 180, 350, 186), kicker(434, 216, 'SOLUTION · IMPORT CLOSURE'),
    text(434, 260, '2,924 modules', 26, C.text, 'font-weight="650"'),
    `<path d="M434 282H736" stroke="${C.rule}"/>`,
    text(434, 316, '486,483 lines, comments removed', 19, C.soft),
    text(434, 346, 'Imports Mathlib + two libraries', 20, C.quiet));
  // Arrows into Comparator.
  b.push(`<path d="M215 370V420" stroke="${C.teal}" stroke-width="2.5" marker-end="url(#ver-arrow)"/>`,
    `<path d="M585 370V420" stroke="${C.teal}" stroke-width="2.5" marker-end="url(#ver-arrow)"/>`);
  // Comparator.
  b.push(card(40, 430, 720, 214), kicker(64, 466, 'COMPARATOR CHECKS THREE THINGS'),
    tick(68, 512), text(104, 512, 'The solution proves exactly the challenge theorem', 22, C.text),
    tick(68, 560), text(104, 560, 'Only propext, Quot.sound and Classical.choice', 22, C.text),
    tick(68, 608), text(104, 608, 'The Lean kernel accepts the sandboxed replay', 22, C.text));
  // Re-runs.
  b.push(text(40, 694, 'Re-run outside OpenAI', 24, C.text, 'font-weight="650"'));
  b.push(card(40, 712, 350, 150), kicker(64, 748, 'GOLDBLATT'),
    text(64, 790, 'Comparator: accepted', 21, C.soft),
    text(64, 826, 'With second kernel: accepted', 21, C.soft));
  b.push(card(410, 712, 350, 150), kicker(434, 748, 'TOMOTO0'),
    text(434, 790, 'Full rebuild: 0 errors', 21, C.soft),
    text(434, 826, 'About 4 hours on 8 cores', 21, C.soft));
  // Evidence Press screen.
  b.push(card(40, 884, 720, 112, 'teal', true), kicker(64, 920, 'EVIDENCE PRESS STATIC SCAN · A SCREEN ONLY'),
    text(64, 956, 'No sorry, admit, axiom, native_decide, extern, unsafe,', 20, C.soft),
    text(64, 982, 'opaque or custom syntax in the 2,924-module closure', 20, C.soft));
  // Outside the certificate.
  b.push(card(40, 1018, 720, 104, 'amber'), kicker(64, 1054, 'NOT CERTIFIED BY THE CHECK', C.amberText),
    text(64, 1092, 'The 199-page paper’s prose · how the proof was found', 21, C.text));
  return frame(Wd, Hd, 'What the Lean check certifies', 'Result family 003 · openai/math at fd4aeeb · 10 October 2026', 'ver',
    'A nine-line challenge states that zeta has no zeros with real part above 7/8, using Mathlib’s definition, and ends in sorry. A solution module, whose import closure has 2,924 modules and 486,483 lines once comments are removed, supplies the proof. Comparator checks that the solution proves exactly the challenge theorem, uses only the three standard axioms, and passes the Lean kernel in a sandboxed replay. Dave Goldblatt re-ran Comparator, once with the second kernel nanoda; tomoto0 rebuilt the closure with no errors. The Evidence Press static scan found no escape hatches but is only a screen. The check does not certify the paper’s prose or how the proof was found.',
    b.join('\n'));
}

/* --------------------------------------------------------- route figure */
function route() {
  const Wd = 800;
  const stages = [
    { title: 'Target: a Möbius sum A₁(D) over ℤ[ω]', lines: [{ raw: `If A₁(D) ≪ D${sup('θ + ε')}, no zeros with Re s &gt; θ` }] },
    { title: 'Amplify: keep the sixth-power rows', lines: [{ raw: `In the sextic family A${'<tspan font-size="70%" baseline-shift="sub">u</tspan>'}(D), rows u = p⁶` }, 'reproduce A₁(D) almost unchanged'], gold: true },
    { title: 'Poisson summation in u', lines: ['Sextic characters become sextic Gauss sums'] },
    { title: 'Bridge: a Gauss-sum identity absorbs μ', lines: ['μ(n)·γ₋₁(n) = fixed factors × cubic Gauss sum γ₂(n)', '(an identity going back to Hasse)'], gold: true },
    { title: 'Patterson (1977)', lines: ['Cubic Gauss sums are Fourier coefficients', 'of Kubota’s cubic theta function'] },
    { title: 'Twist drops to order two', lines: ['χ⁻¹ · χ⁻² = χ⁻³ is quadratic because χ has', 'order six, available over ℚ(√−3)'], gold: true },
    { title: 'Quadratic large sieve', lines: ['Near-optimal loss M + L', '(Heath-Brown; Goldmakher and Louvel)'] },
    { title: 'Recursion on scales', lines: ['Heath-Brown’s 1995 self-improving exponents'] }
  ];
  const b = [];
  // Legend.
  b.push(`<circle cx="52" cy="190" r="9" fill="${C.gold}"/>`, text(70, 197, 'New move in this proof', 20, C.soft),
    `<circle cx="330" cy="190" r="9" fill="none" stroke="${C.ivory}" stroke-width="2.5"/>`, text(348, 197, 'Known tool', 20, C.soft));
  let y = 236;
  const tops = [];
  for (const [i, s] of stages.entries()) {
    const h = 58 + s.lines.length * 30;
    tops.push([y, h]);
    y += h + 14;
  }
  const lastCenter = tops[tops.length - 1][0] + 30;
  b.push(`<path d="M64 ${tops[0][0] + 30}V${lastCenter + 70}" stroke="${C.rule}" stroke-width="3"/>`);
  for (const [i, s] of stages.entries()) {
    const [top] = tops[i];
    const cy = top + 30;
    b.push(s.gold
      ? `<circle cx="64" cy="${cy}" r="22" fill="${C.gold}"/>` + text(64, cy + 8, String(i + 1), 22, C.ink, 'text-anchor="middle" font-weight="700"')
      : `<circle cx="64" cy="${cy}" r="22" fill="${C.fig1}" stroke="${C.ivory}" stroke-width="2.5"/>` + text(64, cy + 8, String(i + 1), 22, C.ivory, 'text-anchor="middle" font-weight="700"'));
    b.push(text(104, cy + 9, s.title, 25, s.gold ? C.gold : C.text, 'font-weight="650"'));
    s.lines.forEach((line, j) => b.push(text(104, cy + 45 + j * 30, line, 21, C.soft)));
  }
  const oy = lastCenter + 70;
  b.push(`<path d="M64 ${oy - 30}V${oy - 4}" stroke="${C.teal}" stroke-width="2.5" marker-end="url(#route-arrow)"/>`);
  b.push(card(40, oy + 4, 720, 132), kicker(64, oy + 40, 'OUTCOME'),
    text(64, oy + 82, { raw: `A₁(D) ≪ D${sup('11/12 + ε')}, so no zeros with Re s &gt; 11/12` }, 24, C.text, 'font-weight="650"'),
    text(64, oy + 116, 'The 30 September paper refines the machinery to reach 7/8', 20, C.soft));
  const Hd = oy + 160;
  return frame(Wd, Hd, 'From a Möbius sum to a zero-free half-plane', 'The 11/12 proof, simplified · logical order, not discovery order', 'route',
    'Eight stages. 1, target: a Möbius sum A1(D) over the Eisenstein integers; a power-saving bound for it excludes zeros. 2, new: embed it in a sextic family and keep the sixth-power rows, which reproduce the target. 3, Poisson summation turns sextic characters into sextic Gauss sums. 4, new: a Gauss-sum identity going back to Hasse absorbs the Möbius function into a cubic Gauss sum. 5, Patterson’s formula identifies cubic Gauss sums with coefficients of Kubota’s cubic theta function. 6, new: the transformation law produces the twist chi to the minus three, which is quadratic because chi has order six. 7, the near-optimal quadratic large sieve applies. 8, Heath-Brown’s recursion on scales closes the argument. Outcome: A1(D) is at most D to the 11/12 plus epsilon, so there are no zeros with real part above 11/12; the 30 September paper refines the machinery to reach 7/8.',
    b.join('\n'));
}

/* ----------------------------------------------------------------- write */
const outputs = [
  ['quasi-riemann-zero-free-strip.svg', banner()],
  ['quasi-riemann-verification.svg', verification()],
  ['quasi-riemann-route.svg', route()]
];
const allocation = JSON.stringify({
  slug: SLUG, palette: paletteName, colors: [bg1, bg2],
  allocation: 'Saved article allocation from the site palette resolver at publication.',
  reference: 'finite-sample-affine-diversification'
}, null, 2) + '\n';
for (const [name, content] of outputs) {
  const file = path.join(OUT, name);
  if (CHECK) {
    if (!fs.existsSync(file) || fs.readFileSync(file, 'utf8') !== content) throw new Error(`Regenerate assets/articles/${name}`);
    console.log(`verified assets/articles/${name}`);
  } else {
    fs.writeFileSync(file, content);
    console.log(`generated assets/articles/${name}`);
  }
}
if (CHECK) {
  if (!fs.existsSync(palettePath) || fs.readFileSync(palettePath, 'utf8') !== allocation) throw new Error('Regenerate the article palette allocation');
} else fs.writeFileSync(palettePath, allocation);
