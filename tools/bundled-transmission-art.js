'use strict';
const { bannerSvg } = require('./svg-xml');
// Equal mean diversity, unequal risk: banner, OG card and thumbnail.
// "This image helps the reader understand" that holding each trait's transmission rate fixed, bundling learning
// (copying probability b per encounter, encounters 1/b times as often) leaves the average repertoire unchanged but makes
// it more variable. Exact two-person example (paper 0.1.0-candidate, 3 Nov 2026, Section 11.1 and Appendix A):
// u = 1, beta = 2, mu = 1/2, so rho = beta/(2u) = 1 and eta = mu/u = 1/2; E C = eta(2 + rho) = 3/2 at every b and
// Var C(b) = eta(2 + rho) + eta^2 (rho^3 + (8 - 2b) rho^2 + 10 rho + 4) / (2 + (3 - 2b) rho) = 3/2 + (23 - 2b)/(4(5 - 2b)),
// i.e. 53/20, 11/4, 23/8 and 13/4 at b = 0 (limit), 1/4, 1/2, 1. Guarded below against the paper's table.
// Thumbnail hook: Section 7, N = 100, beta = 1.3: V(13/14)/V(1) = 0.336 (results/scaling.json; Wakano et al. Figure 16 setting).
// Usage: node tools/bundled-transmission-art.js [--render OUTDIR_FOR_INSPECTION] [--no-mirror]
const SLUG = 'bundled-cultural-transmission-risk';
const ink = '#eef6f6', muted = '#d6e6e6', dim = '#a9c4c6';
const varC = '#ffb38a', meanC = '#9fd8ff', ptC = '#ffd27f';
const SANS = 'Arial,Helvetica,sans-serif', SERIF = 'Georgia,serif';
const text = (x, y, s, size = 18, color = ink, anchor = 'start', weight = 'normal', family = SANS) =>
  `<text class="og-hide" x="${x}" y="${y}" fill="${color}" font-family="${family}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}">${s}</text>`;
const f = v => (+v).toFixed(1);
const rho = 1, eta = 0.5;
const mean = () => eta * (2 + rho);
const variance = b => eta * (2 + rho) + eta * eta * (rho ** 3 + (8 - 2 * b) * rho ** 2 + 10 * rho + 4) / (2 + (3 - 2 * b) * rho);
const TABLE = [[0, 53 / 20, '53/20'], [0.25, 11 / 4, '11/4'], [0.5, 23 / 8, '23/8'], [1, 13 / 4, '13/4']];
const CX0 = 96, CX1 = 600, CY0 = 330, CY1 = 112, YMAX = 3.5;
const X = b => CX0 + b * (CX1 - CX0), Y = v => CY0 - v / YMAX * (CY0 - CY1);
function chart() {
  let s = text(32, 100, 'two learners, exact values', 13, dim, 'start', 'bold');
  for (const v of [0, 1, 2, 3]) s += `<path d="M${CX0} ${f(Y(v))} H${CX1}" stroke="${dim}" stroke-opacity=".13" stroke-width="1"/>` + text(CX0 - 10, Y(v) + 4, String(v), 12, dim, 'end');
  s += `<path d="M${CX0} ${CY0} H${CX1} M${CX0} ${CY0} V${CY1 - 6}" stroke="${dim}" stroke-opacity=".5" stroke-width="1"/>`;
  for (const [b, l] of [[0, '0'], [0.25, '¼'], [0.5, '½'], [0.75, '¾'], [1, '1']]) s += `<path d="M${f(X(b))} ${CY0} v5" stroke="${dim}" stroke-width="1.2"/>` + text(X(b), CY0 + 21, l, 13, dim, 'middle');
  s += text(CX1, CY0 + 42, 'share of a teacher’s traits copied per encounter, b  →  more bundled', 12, dim, 'end');
  let d = '';
  for (let i = 0; i <= 100; i++) { const b = i / 100; d += (i ? ' L' : 'M') + f(X(b)) + ' ' + f(Y(variance(b))); }
  s += `<path d="${d}" stroke="${varC}" stroke-width="3.6" fill="none" stroke-linecap="round"/>`;
  s += `<path d="M${f(X(0))} ${f(Y(mean()))} H${f(X(1))}" stroke="${meanC}" stroke-width="3.6" fill="none" stroke-linecap="round"/>`;
  for (const [b, v, l] of TABLE) s += `<circle cx="${f(X(b))}" cy="${f(Y(v))}" r="5" fill="${ptC}"/>` + (b === 0 || b === 1 ? text(X(b) + (b ? -10 : 10), Y(v) - 13, l, 15, ptC, b ? 'end' : 'start', 'bold', SERIF) : '');
  s += text(X(0.5), Y(variance(0.5)) - 20, 'variance of the repertoire', 14, varC, 'middle', 'bold');
  s += text(X(0.5), Y(mean()) + 26, 'average repertoire: 3/2 at every b', 14, meanC, 'middle', 'bold');
  return s;
}
function hook() {
  const X0 = 660;
  let s = text(X0, 124, 'Hold each trait’s transmission rate fixed.', 16, muted, 'start', 'bold');
  s += text(X0, 150, 'Change only how bundled learning is.', 16, muted, 'start', 'bold');
  s += text(X0, 200, 'Average: unchanged', 28, meanC, 'start', 'bold', SERIF);
  s += text(X0, 244, 'Variability and risk: rise', 28, varC, 'start', 'bold', SERIF);
  s += text(X0, 286, 'Traits learnt together are also lost together, so', 14, ink);
  s += text(X0, 306, 'shortfalls and total loss become more likely.', 14, ink);
  s += text(X0, 350, 'Neutral model (Wakano et al. 2026): u = 1, β = 2, μ = ½.', 12, dim);
  s += text(X0, 368, 'Proved in convex order for every trait count; no data.', 12, dim);
  return s;
}
const draw = () =>
  text(32, 52, 'Equal mean diversity, unequal risk', 28, ink, 'start', 'normal', SERIF) +
  text(32, 78, 'Bundled versus piece-by-piece cultural learning at the same per-trait rate', 15, muted) +
  chart() + `<path d="M632 104 L 632 384" stroke="${muted}" stroke-opacity=".22" stroke-width="1.2"/>` + hook();
const description = 'Banner for a paper comparing bundled and piece-by-piece cultural learning in a neutral model of trait accumulation. Left: an exact chart for two learners (death rate 1, learning rate 2, innovation rate 1/2). The horizontal axis is the share b of a teacher’s traits copied per encounter, from 0 to 1, with encounters 1/b times as frequent so each trait’s transmission rate is fixed. A flat blue line shows the average repertoire, 3/2 at every b. An orange curve shows the variance of the repertoire rising from 53/20 at b near 0 to 13/4 at b = 1, with marked exact points 11/4 at b = 1/4 and 23/8 at b = 1/2. Right: text says that holding each trait’s rate fixed and changing only how bundled learning is leaves the average unchanged while variability and risk rise, because traits learnt together are also lost together, so shortfalls and total loss become more likely. The ordering is proved in convex order for every trait count; the model uses no data.';
const thumbSpec = {
  kicker: ['RESEARCH RELEASE · NOVEMBER 2026', 'CULTURAL EVOLUTION · PROBABILITY'],
  head: ['Same average,', '<em>more risk</em>'], headSize: 78,
  sub: 'Learning many things at once, or piece by piece, at the same rate per trait: averages match, but bundled learning makes losses more likely.',
  tag: 'UNREFEREED CANDIDATE',
  hero: '<div class="eq-label">100 people, source-model setting</div><div class="hero-title" style="font-size:60px">93%</div><div class="note">of traits copied per encounter</div><div class="hero-title" style="font-size:60px">⅓</div><div class="note">of the all-at-once variance</div><div class="eq-foot">same average repertoire</div>'
};
module.exports = { draw, description, thumbSpec, variance };
function frame(inner, background) {
  return bannerSvg({ inner, description, background, glow: { color: varC, cx: '0.3', cy: '0.55', r: '0.42', opacity: '0.06' } });
}
if (require.main === module) (async () => {
  const fs = require('fs'), pth = require('path'), os = require('os'), vm = require('vm');
  const ROOT = pth.join(__dirname, '..');
  // Guards: closed form reproduces the paper's exact table; variance increasing; mean fixed.
  for (const [b, v] of TABLE) if (Math.abs(variance(b) - v) > 1e-12) throw new Error('variance mismatch at b=' + b);
  for (let i = 1; i <= 100; i++) if (!(variance(i / 100) > variance((i - 1) / 100))) throw new Error('variance not increasing');
  if (Math.abs(mean() - 1.5) > 1e-12) throw new Error('mean wrong');
  const reg = JSON.parse(fs.readFileSync(pth.join(ROOT, 'data/BANNER_PALETTES.json'), 'utf8'));
  const { palettes } = require('./banner-palettes');
  const bsaved = reg.assignments.find(r => r.slug === SLUG); if (!bsaved) throw new Error('no saved banner palette'); const bname = bsaved.palette;
  const tp = require('./thumbnail-palettes');
  const tsaved = tp.load().assignments.find(r => r.slug === SLUG); if (!tsaved) throw new Error('no saved thumbnail palette');
  const tname = tsaved.editorialPalette || tsaved.palette;
  const svg = frame(draw(), { name: bname, colors: palettes[bname] });
  fs.writeFileSync(pth.join(ROOT, 'assets/art', SLUG + '.svg'), svg);
  console.log('art:', SLUG, 'banner palette', bname, '| thumbnail palette', tname, '| table verified', TABLE.length);
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
  const m = JSON.parse(fs.readFileSync(pth.join(ROOT, 'papers', SLUG, 'meta.json'), 'utf8'));
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
