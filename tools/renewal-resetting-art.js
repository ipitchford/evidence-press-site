'use strict';
const { bannerSvg } = require('./svg-xml');
// Renewal resetting of quantum dynamics: banner, OG card and thumbnail.
// Sources (paper: Renewal resetting of quantum dynamics, 23 Oct 2026):
//  - Corollary "Power hazard" (cor:power): r_n = gamma/(n+1)^alpha, 0 < gamma < 1, finite dimension:
//    alpha < 1 finite mean, rho_t -> survival-weighted mixture; alpha = 1 proper, infinite mean,
//    rho_t -> dephased state D_U(rho); alpha > 1 defective (q > 0), rotating orbit, converges iff [U, rho] = 0.
//  - Figure fig:regimes setup: U = diag(1, -1), rho = |+><+|, plotted 2 Re rho_01 = f_t(-1) through t = 500 for
//    r_n = 1/4 (limit 1/7), r_n = 1/[4(n+1)] (limit 0) and r_n = 1/[4(n+1)^2] (defective, q = 2/pi, keeps oscillating).
//    The traces below are computed exactly here from the model's age recursion (reset with probability r_n, else age + 1).
//  - Theorem thm:endpoint: at alpha = 1, |f_t(z)| decays as t^-min{gamma, 1-gamma}, maximal exponent at gamma = 1/2.
//  - Table tab:timescales (z = -1, two-term asymptotic estimates): steps until the coherence multiplier stays below 0.01:
//    gamma = 0.5: 6.4e3 (also exact recurrence); 0.3/0.7: 9.8e5 (also exact); 0.2/0.8: 2.3e9; 0.1/0.9: 2.6e19.
//
// Usage: node tools/renewal-resetting-art.js [--render OUTDIR_FOR_INSPECTION] [--no-mirror]
//   Writes assets/art/<slug>.svg; with --render also assets/og/<slug>.png, thumbs/<slug>.jpg,
//   the byte-identical central mirror ~/thumbs/<slug>.jpg and inspection PNGs (needs Playwright).
// Palette registries are NOT written here: the saved assignments in data/*_PALETTES.json are used.
const SLUG = 'renewal-quantum-resetting-equilibration';
const ink = '#f7f0fb', muted = '#e3d6ea', dim = '#cbbad6';
const cFin = '#9fd3ff', cCrit = '#ffd27a', cDef = '#ff9db0';
const SANS = 'Arial,Helvetica,sans-serif', SERIF = 'Georgia,serif';
const text = (x, y, s, size = 18, color = ink, anchor = 'start', weight = 'normal', family = SANS) =>
  `<text class="og-hide" x="${x}" y="${y}" fill="${color}" font-family="${family}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}">${s}</text>`;
const sub = s => `<tspan baseline-shift="sub" font-size="72%">${s}</tspan>`;
const sup = s => `<tspan baseline-shift="super" font-size="70%">${s}</tspan>`;
const f = v => (+v).toFixed(1);

// Exact coherence f_t(-1) = E(-1)^{A_t} for a hazard r(n), t = 0..T, from the age distribution.
function coherence(r, T = 500) {
  let P = [1]; const out = [1];
  for (let t = 1; t <= T; t++) {
    const Q = new Array(t + 1).fill(0);
    for (let n = 0; n < P.length; n++) { const h = r(n); Q[0] += P[n] * h; Q[n + 1] += P[n] * (1 - h); }
    P = Q; out.push(P.reduce((a, p, n) => a + (n % 2 ? -p : p), 0));
  }
  return out;
}
const clocks = [
  { key: 'fin', r: () => 0.25, col: cFin, a: 'α &lt; 1', alab: 'here α = 0', kind: 'finite mean',
    out: 'converges', out2: 'to a survival-weighted mixture', limit: 1 / 7, limLab: '1/7' },
  { key: 'crit', r: n => 0.25 / (n + 1), col: cCrit, a: 'α = 1', alab: 'critical', kind: 'proper, infinite mean',
    out: 'dephases', out2: `to D${sub('U')}(ρ), slowly`, limit: 0, limLab: '0' },
  { key: 'def', r: n => 0.25 / (n + 1) ** 2, col: cDef, a: 'α &gt; 1', alab: 'here α = 2', kind: 'defective, q &gt; 0',
    out: 'rotating orbit', out2: 'converges iff [U, ρ] = 0', limit: null }
].map(c => ({ ...c, v: coherence(c.r) }));
{ // sanity checks against the paper's stated limits
  const [a, b, c] = clocks.map(k => k.v.at(-1));
  if (Math.abs(a - 1 / 7) > 1e-6 || Math.abs(b) > 0.2 || Math.abs(c) < 0.5) throw new Error('coherence data');
}
// Table tab:timescales, z = -1 (two-term estimates; * also confirmed by exact recurrence).
const timescales = [[0.5, '6.4 × 10³'], [0.2, '2.3 × 10⁹']];

// left panel geometry: log-time axis t = 1..500
const PX0 = 196, PX1 = 486, TMAX = 500;
const tx = t => PX0 + Math.log(t) / Math.log(TMAX) * (PX1 - PX0);
const ROWS = [128, 206, 284], AMP = 30; // value 1 -> 30 px

function regimes() {
  let s = '';
  s += text(34, 44, 'The exponent α in the reset hazard decides the long-time state', 19, ink, 'start', 'bold');
  s += text(34, 66, `r${sub('n')} = γ/(n+1)${sup('α')} · qubit U = diag(1, −1), reset to |+⟩, γ = ¼ · coherence 2 Re ρ${sub('01')} for t = 1…500`, 13.5, dim);
  clocks.forEach((c, i) => {
    const y = ROWS[i];
    s += text(34, y - 8, c.a, 18, c.col, 'start', 'bold', SERIF);
    s += text(34, y + 10, c.alab, 12, dim);
    s += text(34, y + 26, c.kind, 12, dim);
    s += `<path d="M${PX0} ${y} H${PX1}" stroke="${muted}" stroke-opacity=".35" stroke-dasharray="3 3"/>`;
    if (c.limit) s += `<path d="M${PX0} ${f(y - c.limit * AMP)} H${PX1}" stroke="${c.col}" stroke-opacity=".7" stroke-dasharray="5 3"/>`;
    const d = c.v.slice(1).map((v, k) => `${k ? 'L' : 'M'}${f(tx(k + 1))} ${f(y - v * AMP)}`).join(' ');
    s += `<path d="${d}" stroke="${c.col}" stroke-width="1.3" fill="none" stroke-linejoin="round"/>`;
    s += text(PX1 + 18, y - 4, c.out, 16, c.col, 'start', 'bold');
    s += text(PX1 + 18, y + 14, c.out2, 12.5, muted);
    if (c.limLab) s += text(PX1 + 18, y + 30, `here the limit is ${c.limLab}`, 12, dim);
    else s += text(PX1 + 18, y + 30, 'here q = 2/π: never settles', 12, dim);
  });
  // time axis
  const ay = 330;
  s += `<path d="M${PX0} ${ay} H${PX1}" stroke="${muted}" stroke-width="1.1"/>`;
  for (const t of [1, 10, 100, 500]) s += `<path d="M${f(tx(t))} ${ay} v5" stroke="${muted}"/>` + text(f(tx(t)), ay + 18, String(t), 11.5, dim, 'middle');
  s += text(PX1 + 18, ay + 18, 'step t (log scale)', 11.5, dim);
  s += text(34, 384, 'Finite dimension: every gate and reset state converge iff the clock is proper and aperiodic', 12, muted);
  return s;
}

function tent() {
  let s = '';
  const X0 = 770;
  s += text(X0 - 24, 44, 'At α = 1: how fast?', 19, cCrit, 'start', 'bold');
  s += text(X0 - 24, 66, `coherence decays as t${sup('−min{γ, 1−γ}')}`, 14, ink);
  const GX0 = 800, GX1 = 1150, GY0 = 330, GY1 = 140;
  const gx = g => GX0 + g * (GX1 - GX0);
  const gy = e => GY0 - e / 0.5 * (GY0 - GY1);
  s += `<path d="M${gx(0)} ${gy(0)} L${gx(0.5)} ${gy(0.5)} L${gx(1)} ${gy(0)} z" fill="${cCrit}" fill-opacity=".14"/>`;
  s += `<path d="M${gx(0)} ${gy(0)} L${gx(0.5)} ${gy(0.5)} L${gx(1)} ${gy(0)}" stroke="${cCrit}" stroke-width="2.4" fill="none" stroke-linejoin="round"/>`;
  // axes
  s += `<path d="M${GX0} ${GY0} H${GX1}" stroke="${muted}" stroke-width="1.2"/>`;
  s += `<path d="M${GX0} ${GY0} V${GY1 - 8}" stroke="${muted}" stroke-width="1.2"/>`;
  for (const [g, l] of [[0, '0'], [0.2, '0.2'], [0.5, '½'], [0.8, '0.8'], [1, '1']]) s += `<path d="M${f(gx(g))} ${GY0} v5" stroke="${muted}"/>` + text(f(gx(g)), GY0 + 18, l, 12, dim, 'middle');
  s += text(GX1 + 10, GY0 + 5, 'γ', 15, dim, 'start', 'bold', SERIF);
  for (const [e, l] of [[0, '0'], [0.2, '0.2'], [0.5, '½']]) s += text(GX0 - 8, f(gy(e) + 4), l, 12, dim, 'end');
  s += text(GX0 - 8, GY1 - 14, 'decay exponent', 11.5, dim, 'start');
  // time-scale annotations from tab:timescales (z = -1)
  for (const [g, lab] of timescales) {
    const e = Math.min(g, 1 - g);
    for (const gg of g === 0.5 ? [0.5] : [g, 1 - g]) s += `<circle cx="${f(gx(gg))}" cy="${f(gy(e))}" r="4.6" fill="${cCrit}" stroke="#2a1b36" stroke-width="1.2"/>`;
    if (g !== 0.5) s += `<path d="M${f(gx(g) + 7)} ${f(gy(e))} H${f(gx(1 - g) - 7)}" stroke="${cCrit}" stroke-opacity=".55" stroke-dasharray="3 3"/>`;
    if (g === 0.5) s += text(gx(0.5), f(gy(e) - 12), `γ = ½: ${lab} steps`, 13, muted, 'middle');
    else { s += text(gx(0.5), f(gy(e) + 26), 'γ = 0.2 or 0.8:', 13.5, ink, 'middle', 'bold'); s += text(gx(0.5), f(gy(e) + 46), `${lab} steps`, 16, ink, 'middle', 'bold'); }
  }
  s += text(GX1, 372, 'steps until a π-phase qubit coherence stays below 1%', 11.5, dim, 'end');
  s += text(GX1, 387, '(paper’s two-term estimates; γ = ½ also checked exactly)', 11.5, dim, 'end');
  return s;
}

const draw = () => regimes() + tent() + `<path d="M728 30 V380" stroke="${muted}" stroke-opacity=".25"/>`;
const description = 'Banner for a paper on renewal resetting of quantum dynamics. A qubit evolves under a gate and is reset at random renewal times. Left: the exponent alpha in the reset hazard r_n = gamma/(n+1)^alpha decides the long-time state. Three traces show the coherence 2 Re rho_01 for the gate U = diag(1, −1), reset state |+⟩ and gamma = 1/4, for steps t = 1 to 500 on a logarithmic time axis, computed exactly from the model. For alpha below 1 (here alpha = 0, a constant hazard; finite mean waiting time) the coherence converges to a survival-weighted mixture, here the value 1/7. For alpha = 1 (proper clock with infinite mean waiting time) the oscillation shrinks slowly towards zero: the state dephases to D_U(rho). For alpha above 1 (here alpha = 2; a defective clock, with probability q = 2/pi of never resetting) the oscillation persists: the state approaches a rotating orbit and converges only if the reset state commutes with the gate. A footnote states that in finite dimension every gate and reset state converge exactly when the clock is proper and aperiodic. Right: at alpha = 1, the coherence decays as t to the power −min{gamma, 1 − gamma}, drawn as a tent over gamma from 0 to 1 with peak exponent 1/2 at gamma = 1/2. Dots mark the paper’s estimates of the number of steps until a pi-phase qubit coherence stays below 1%: 6.4 thousand at gamma = 1/2 and 2.3 × 10^9 at gamma = 0.2 or 0.8. These are two-term asymptotic estimates from the paper’s time-scale table; the value at 1/2 was also checked by the exact recurrence.';

function frame(inner, background) {
  return bannerSvg({ inner, description, background, glow: { color: cCrit, cx: '0.8', cy: '0.55', r: '0.6', opacity: '0.07' } });
}

const thumbSpec = {
  kicker: ['RESEARCH RELEASE · OCTOBER 2026', 'QUANTUM DYNAMICS · RENEWAL RESETTING'],
  head: ['Reset at random.', '<em>When does it settle?</em>'], headSize: 70,
  sub: 'An exact classification of when a reset quantum system converges, even when the mean time between resets is infinite.',
  tag: 'UNREFEREED CANDIDATE',
  hero: '<div class="eq-label">reset hazard r<sub>n</sub> = γ/(n+1)<sup>α</sup></div><div class="hero-title">α &lt; 1 · α = 1 · α &gt; 1</div><div class="note">converges · <b>dephases</b> · rotating orbit<br>at α = 1 coherence decays as t<sup>−min{γ, 1−γ}</sup><br>γ = 0.2: about 2.3 × 10<sup>9</sup> steps to 1%</div><div class="eq-foot">written proofs · exact recurrences · estimates labelled</div>'
};

module.exports = { draw, description, thumbSpec, clocks, timescales };
if (require.main === module) (async () => {
  const fs = require('fs'), pth = require('path'), os = require('os'), vm = require('vm');
  const ROOT = pth.join(__dirname, '..');
  const { palettes } = require('./banner-palettes');
  const reg = JSON.parse(fs.readFileSync(pth.join(ROOT, 'data/BANNER_PALETTES.json'), 'utf8'));
  const bsaved = reg.assignments.find(r => r.slug === SLUG); if (!bsaved) throw new Error('no saved banner palette'); const bname = bsaved.palette;
  const tp = require('./thumbnail-palettes');
  const treg = tp.load();
  const tsaved = treg.assignments.find(r => r.slug === SLUG); if (!tsaved) throw new Error('no saved thumbnail palette');
  const tname = tsaved.editorialPalette || tsaved.palette;
  const svg = frame(draw(), { name: bname, colors: palettes[bname] });
  fs.writeFileSync(pth.join(ROOT, 'assets/art', SLUG + '.svg'), svg);
  console.log('art:', SLUG, 'banner palette', bname, '| thumbnail palette', tname);
  const i = process.argv.indexOf('--render');
  if (i < 0) return;
  const inspect = process.argv[i + 1];
  fs.mkdirSync(inspect, { recursive: true });
  const { chromium } = require('playwright');
  const b = await chromium.launch(process.env.EVIDENCE_PRESS_CHROME ? { executablePath: process.env.EVIDENCE_PRESS_CHROME } : {});
  const shot = async (w, h, html, file, opts = {}) => {
    const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: opts.dpr || 1 });
    await p.setContent(html, { waitUntil: 'networkidle' });
    await p.screenshot({ path: file, ...(opts.jpeg ? { type: 'jpeg', quality: 94 } : {}) });
    await p.close();
  };
  const body = (w, h, inner) => `<!DOCTYPE html><html><head><meta charset="utf-8"><style>*{margin:0}body{width:${w}px;height:${h}px;background:#222}svg{width:${w}px;height:${h}px;display:block}</style></head><body>${inner}</body></html>`;
  await shot(1200, 400, body(1200, 400, svg), pth.join(inspect, 'banner-full-2x.png'), { dpr: 2 });
  await shot(400, 133, body(400, 133, svg), pth.join(inspect, 'banner-card-400.png'), { dpr: 2 });
  await shot(358, 119, body(358, 119, svg), pth.join(inspect, 'banner-card-358-mobile.png'), { dpr: 2 });
  const og = fs.readFileSync(pth.join(__dirname, 'make-og.js'), 'utf8');
  const htmlSrc = og.slice(og.indexOf('const html = '), og.indexOf('\n(async () =>'));
  const ogHtml = vm.runInNewContext(htmlSrc + '; html', {});
  const metaPath = pth.join(ROOT, 'papers', SLUG, 'meta.json');
  const m = fs.existsSync(metaPath) ? JSON.parse(fs.readFileSync(metaPath, 'utf8'))
    : { title: 'Renewal resetting of quantum dynamics: a classification for complete resets, a reduction for jump channels, and critical time scales', status: 'unrefereed-candidate', datePublished: '2026-10-22' };
  console.log('og meta from', fs.existsSync(metaPath) ? metaPath : 'built-in fallback');
  const ogFile = pth.join(ROOT, 'assets/og', SLUG + '.png');
  await shot(1200, 630, ogHtml(m, svg.replace(/<svg /, '<svg preserveAspectRatio="xMidYMid slice" ')), ogFile);
  fs.copyFileSync(ogFile, pth.join(inspect, 'og-card.png'));
  const th = fs.readFileSync(pth.join(__dirname, 'make-thumb.js'), 'utf8');
  const palSrc = th.slice(th.indexOf('const PALETTES = '), th.indexOf('const savedPalettes'));
  const pageSrc = th.slice(th.indexOf('const page = (spec) =>'), th.indexOf('\n(async () =>'));
  const thumbPage = vm.runInNewContext(`const W = 1280, H = 720; ${palSrc}; ${pageSrc}; page`, {});
  const thumbFile = pth.join(ROOT, 'thumbs', SLUG + '.jpg');
  await shot(1280, 720, thumbPage({ ...thumbSpec, palette: tname }), thumbFile, { dpr: 2, jpeg: true });
  fs.copyFileSync(thumbFile, pth.join(inspect, 'thumbnail.jpg'));
  if (process.argv.includes('--no-mirror')) { await b.close(); console.log('rendered (central mirror skipped)'); return; }
  const central = pth.join(process.env.EVIDENCE_PRESS_THUMBNAIL_DIR || pth.join(os.homedir(), 'thumbs'), SLUG + '.jpg');
  if (fs.existsSync(central) && !fs.readFileSync(thumbFile).equals(fs.readFileSync(central))) throw new Error('central thumbnail exists; refusing to overwrite: ' + central);
  fs.copyFileSync(thumbFile, central);
  if (!fs.readFileSync(thumbFile).equals(fs.readFileSync(central))) throw new Error('central mirror mismatch');
  await b.close();
  console.log('rendered OG, thumbnail, mirror and inspection PNGs');
})().catch(e => { console.error(e); process.exit(1); });
