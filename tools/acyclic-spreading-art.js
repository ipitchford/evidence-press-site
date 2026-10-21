'use strict';
// Acyclic spreading, algebraic extinction: banner, OG card and thumbnail.
// Model (paper, all exact): S -> W -> X -> R with contact rates 2, 1, 1; S->W and W->X catalysed by X,
// X->R catalysed by R.  s' = -2sx, w' = 2sx - wx, x' = (w - r)x, r' = rx, initial (25/48, 5/24, 1/240, 4/15).
// Explicit critical solution: theta(t) = (16 + 2t/3)^(-1/2), zeta = 1 + theta, x(t) = theta^3 / (3 zeta),
// x(t) ~ sqrt(3/8) t^(-3/2).  R_eff = w/r -> 1 from below, 1 - R_eff ~ 9/(2t).
// Reference exponential: same x(0) = 1/240 and the same initial relative rate x'/x = w0 - r0 = -7/120.
// The plotted curve is computed from the closed form (it matches evidence/figure_critical_data.csv).
//
// Usage: node tools/acyclic-spreading-art.js [--render OUTDIR_FOR_INSPECTION]
//   Writes assets/art/<slug>.svg; with --render also assets/og/<slug>.png, thumbs/<slug>.jpg,
//   the byte-identical central mirror ~/thumbs/<slug>.jpg and inspection PNGs (needs Playwright).
// Palette registries (data/BANNER_PALETTES.json, data/THUMBNAIL_PALETTES.json) are NOT written here:
// the next rotated families are computed on an in-memory copy and must be recorded by the release owner.
const SLUG = 'acyclic-spreading-algebraic-extinction';
const ink = '#f2f5f8', muted = '#c9d6e0', dim = '#a9bcc4';
const xc = '#ffd36e', expc = '#ff9d8c', asyc = '#bfe6ff', sc = '#c9d6e0', wc = '#9fe0c8', rc = '#c7b7ff';
const text = (x, y, s, size = 18, color = ink, anchor = 'start', weight = 'normal') =>
  `<text class="og-hide" x="${x}" y="${y}" fill="${color}" font-family="Arial,Helvetica,sans-serif" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}">${s}</text>`;
const f = v => (+v).toFixed(1);
const theta = t => (16 + 2 * t / 3) ** -0.5;
const xExact = t => theta(t) ** 3 / (3 * (1 + theta(t)));
const xAsym = t => Math.sqrt(3 / 8) * t ** -1.5;
const xExp = t => (1 / 240) * Math.exp(-7 * t / 120);
const sup = s => `<tspan dy="-7" font-size="0.72em">${s}</tspan>`;

function chain() {
  let s = '';
  const nodes = [['S', 'unaware', sc], ['W', 'primed', wc], ['X', 'spreader', xc], ['R', 'stifler', rc]];
  const NX = i => 70 + 92 * i, Y1 = 128, Y2 = 268, r = 21;
  const node = (i, y) => `<circle cx="${NX(i)}" cy="${y}" r="${r}" fill="#0b1a1e" fill-opacity=".6" stroke="${nodes[i][2]}" stroke-width="2.4"/>` +
    `<text class="og-hide" x="${NX(i)}" y="${y + 7}" fill="${nodes[i][2]}" font-family="Georgia,serif" font-size="21" font-weight="bold" text-anchor="middle">${nodes[i][0]}</text>`;
  s += `<defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="${muted}"/></marker>` +
    `<marker id="ahd" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="${xc}"/></marker></defs>`;
  s += `<rect x="28" y="62" width="352" height="306" rx="14" fill="#08181b" fill-opacity=".38" stroke="${muted}" stroke-opacity=".28"/>`;
  s += text(46, 90, 'transition graph: who becomes what', 15, ink, 'start', 'bold');
  for (let i = 0; i < 3; i++) s += `<path d="M${NX(i) + r + 3} ${Y1} H${NX(i + 1) - r - 4}" stroke="${muted}" stroke-width="2.4" marker-end="url(#ah)"/>`;
  for (const [i, lab] of [[0, '2sx'], [1, 'wx'], [2, 'rx']]) s += text(NX(i) + 46, Y1 - 12, lab, 14, muted, 'middle');
  for (let i = 0; i < 4; i++) s += node(i, Y1) + text(NX(i), Y1 + 40, nodes[i][1], 12, dim, 'middle');
  s += text(46, 198, 'dependency graph: whose level drives whom', 15, ink, 'start', 'bold');
  // S -> X and W -> X (s, w enter x' through w x and 2sx), X -> R (r' = r x)
  s += `<path d="M${NX(0) + 14} ${Y2 - 17} C${NX(0) + 50} ${Y2 - 50} ${NX(2) - 50} ${Y2 - 50} ${NX(2) - 12} ${Y2 - 19}" fill="none" stroke="${xc}" stroke-width="2" stroke-dasharray="6 4" marker-end="url(#ahd)"/>`;
  s += `<path d="M${NX(1) + r + 3} ${Y2} H${NX(2) - r - 4}" stroke="${xc}" stroke-width="2" stroke-dasharray="6 4" marker-end="url(#ahd)"/>`;
  s += `<path d="M${NX(2) + r + 3} ${Y2} H${NX(3) - r - 4}" stroke="${xc}" stroke-width="2" stroke-dasharray="6 4" marker-end="url(#ahd)"/>`;
  for (let i = 0; i < 4; i++) s += node(i, Y2);
  s += text(204, 334, 'both acyclic: no loops,', 16, xc, 'middle', 'bold');
  s += text(204, 354, 'yet no exponential extinction', 14, muted, 'middle');
  return s;
}

function plot() {
  let s = '';
  const PX0 = 492, PX1 = 1150, PY0 = 330, PY1 = 76;
  const lt0 = 0, lt1 = Math.log10(2e5), lx0 = -10, lx1 = -2;
  const tx = t => PX0 + (PX1 - PX0) * (Math.log10(t) - lt0) / (lt1 - lt0);
  const vy = v => PY0 - (PY0 - PY1) * (Math.log10(v) - lx0) / (lx1 - lx0);
  s += text(PX0 - 66, 44, 'Active spreaders fade algebraically, not exponentially', 22, ink, 'start', 'bold');
  // grid + axes
  for (let k = -10; k <= -2; k += 2) {
    s += `<path d="M${PX0} ${f(vy(10 ** k))} H${PX1}" stroke="${muted}" stroke-opacity=".12"/>`;
    s += `<text class="og-hide" x="${PX0 - 8}" y="${f(vy(10 ** k) + 5)}" fill="${dim}" font-family="Arial,Helvetica,sans-serif" font-size="13" text-anchor="end">10${sup('−' + -k)}</text>`;
  }
  for (let k = 0; k <= 5; k++) {
    s += `<path d="M${f(tx(10 ** k))} ${PY0} v6" stroke="${muted}" stroke-width="1.2"/>`;
    s += `<text class="og-hide" x="${f(tx(10 ** k))}" y="${PY0 + 24}" fill="${dim}" font-family="Arial,Helvetica,sans-serif" font-size="13" text-anchor="middle">${k === 0 ? '1' : '10' + sup(k)}</text>`;
  }
  s += `<path d="M${PX0} ${PY1 - 6} V${PY0} H${PX1 + 4}" stroke="${muted}" stroke-width="1.4" fill="none"/>`;
  s += text(PX1, PY0 + 48, 'time t (log scale)', 13, dim, 'end');
  s += text(PX0 - 46, PY1 - 14, 'spreader fraction x(t), log scale', 13, dim, 'start');
  // asymptote sqrt(3/8) t^(-3/2): a straight line on log-log axes
  const ta = 10 ** 1.2;
  s += `<path d="M${f(tx(ta))} ${f(vy(xAsym(ta)))} L${f(tx(2e5))} ${f(vy(xAsym(2e5)))}" stroke="${asyc}" stroke-width="2" stroke-dasharray="7 5" fill="none"/>`;
  // exponential reference, clipped at the lower axis
  const pe = [];
  for (let i = 0; i <= 200; i++) { const lt = (Math.log10(330) * i) / 200, t = 10 ** lt; const v = xExp(t); if (v < 10 ** lx0) break; pe.push([tx(t), vy(v)]); }
  s += `<path d="${pe.map((p, i) => `${i ? 'L' : 'M'}${f(p[0])} ${f(p[1])}`).join(' ')}" stroke="${expc}" stroke-width="2.6" fill="none"/>`;
  // exact critical solution
  const px = Array.from({ length: 241 }, (_, i) => { const t = 10 ** (lt0 + (lt1 - lt0) * i / 240); return [tx(t), vy(xExact(t))]; });
  s += `<path d="${px.map((p, i) => `${i ? 'L' : 'M'}${f(p[0])} ${f(p[1])}`).join(' ')}" stroke="${xc}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
  // labels
  s += text(f(tx(2.3)), f(vy(1.2e-6)), 'exponential fade-out', 15, expc, 'start', 'bold');
  s += text(f(tx(2.3)), f(vy(1.2e-6) + 18), 'same start, initial rate 7/120', 13, expc, 'start');
  s += text(f(tx(1.6)), f(vy(xExact(1.6)) + 28), 'exact x(t)', 16, xc, 'start', 'bold');
  s += `<text class="og-hide" x="${f(tx(3000))}" y="${f(vy(xAsym(3000)) - 22)}" fill="${asyc}" font-family="Arial,Helvetica,sans-serif" font-size="16" font-weight="bold" text-anchor="start">x ~ √(3/8) t${sup('−3/2')}</text>`;
  s += text(f(tx(3000)), f(vy(xAsym(3000)) - 4), 'slope −3/2 on log–log axes', 13, asyc, 'start');
  // R_eff marker on the tail
  const tm = 3e4, mx = tx(tm), my = vy(xExact(tm));
  s += `<circle cx="${f(mx)}" cy="${f(my)}" r="6" fill="${xc}" stroke="#0b1a1e" stroke-width="2"/>`;
  s += `<path d="M${f(mx)} ${f(my + 8)} L${f(mx - 30)} ${f(my + 52)}" stroke="${muted}" stroke-width="1.2"/>`;
  s += `<text class="og-hide" x="${f(mx - 34)}" y="${f(my + 68)}" fill="${ink}" font-family="Arial,Helvetica,sans-serif" font-size="15" font-weight="bold" text-anchor="end">R<tspan dy="4" font-size="11">eff</tspan><tspan dy="-4"> = w/r → 1 from below</tspan></text>`;
  s += text(f(mx - 34), f(my + 86), 'critical endgame: 1 − R_eff ~ 9/(2t)', 13, muted, 'end');
  s = s.replace('1 − R_eff ~', '1 − R<tspan dy="4" font-size="10">eff</tspan><tspan dy="-4"> ~</tspan>');
  return s;
}

const draw = () => chain() + plot();
const description = 'Banner for algebraic extinction in acyclic spreading models. Left: a four-compartment rumour chain, unaware S, primed W, active spreader X and stifler R. Its transition graph is the path S to W to X to R with contact rates 2sx, wx and rx; its dependency graph has edges S to X, W to X and X to R. Both graphs are acyclic. Right: on log–log axes, the exact active fraction x(t) = θ³/(3(1+θ)) with θ = (16 + 2t/3)^(−1/2), for the initial state (25/48, 5/24, 1/240, 4/15). After an initial plateau the curve follows the straight line x ~ √(3/8) t^(−3/2), while an exponential fade-out with the same starting value and the same initial relative decay rate 7/120 plunges off the axes before t = 1000. The slow decay occurs because the endgame is exactly critical: the effective reproduction number w/r tends to 1 from below, with 1 − R_eff ~ 9/(2t).';

function frame(inner, background) {
  const [c0, c1] = background.colors, W = 1200, H = 400, accent = xc;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" data-banner-palette="${background.name}" role="img" aria-labelledby="art-description">
<desc id="art-description">${description}</desc><defs>
<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
<stop offset="0" stop-color="${c0}"/><stop offset="1" stop-color="${c1}"/>
</linearGradient>
<radialGradient id="glow" cx="0.75" cy="0.3" r="0.9">
<stop offset="0" stop-color="${accent}" stop-opacity="0.06"/><stop offset="1" stop-color="${accent}" stop-opacity="0"/>
</radialGradient>
</defs>
<rect width="${W}" height="${H}" fill="url(#bg)"/>
<rect width="${W}" height="${H}" fill="url(#glow)"/>
${inner}
</svg>`;
}

const thumbSpec = {
  kicker: ['RESEARCH RELEASE · 21 OCTOBER 2026', 'SPREADING MODELS · EXPLICIT COUNTEREXAMPLE'],
  head: ['No loops.', '<em>Still no quick fade.</em>'], headSize: 74,
  sub: 'A four-compartment rumour chain with acyclic graphs dies out like a power law, not exponentially.',
  tag: 'UNREFEREED CANDIDATE',
  hero: '<div class="eq-label">S → W → X → R · both graphs acyclic</div><div class="hero-title">x(t) ~ √(3/8) t<sup>−3/2</sup></div><div class="note">exact explicit solution<br>endgame lands on R<sub>eff</sub> = 1<br>1 − R<sub>eff</sub> ~ 9/(2t)</div><div class="eq-foot">written proofs · exact closed form</div>'
};

module.exports = { draw, description, thumbSpec, xExact };

if (require.main === module) (async () => {
  const fs = require('fs'), path = require('path'), os = require('os'), vm = require('vm');
  const ROOT = path.join(__dirname, '..');
  const { palettes, assign } = require('./banner-palettes');
  const reg = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/BANNER_PALETTES.json'), 'utf8'));
  const bname = assign(reg, SLUG); // in-memory only
  const tp = require('./thumbnail-palettes');
  const treg = tp.load();
  const tsaved = treg.assignments.find(r => r.slug === SLUG);
  const tname = tsaved ? (tsaved.editorialPalette || tsaved.palette) : tp.rotation[(tp.rotation.indexOf(treg.assignments.at(-1).palette) + 1) % tp.rotation.length];
  const svg = frame(draw(), { name: bname, colors: palettes[bname] });
  const svgFile = path.join(ROOT, 'assets/art', SLUG + '.svg');
  fs.writeFileSync(svgFile, svg);
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
  await shot(1200, 400, body(1200, 400, svg), path.join(inspect, 'banner-full-2x.png'), { dpr: 2 });
  await shot(400, 133, body(400, 133, svg), path.join(inspect, 'banner-card-400.png'), { dpr: 2 });
  await shot(358, 119, body(358, 119, svg), path.join(inspect, 'banner-card-358-mobile.png'), { dpr: 2 });
  // OG card: same template as tools/make-og.js
  const og = fs.readFileSync(path.join(__dirname, 'make-og.js'), 'utf8');
  const htmlSrc = og.slice(og.indexOf('const html = '), og.indexOf('\n(async () =>'));
  const ogHtml = vm.runInNewContext(htmlSrc + '; html', {});
  const metaPath = path.join(ROOT, 'papers', SLUG, 'meta.json');
  const m = fs.existsSync(metaPath) ? JSON.parse(fs.readFileSync(metaPath, 'utf8'))
    : { title: 'Algebraic extinction in acyclic spreading models: explicit counterexamples, genericity and support-checkable repairs', status: 'unrefereed-candidate', datePublished: '2026-10-21' };
  const ogFile = path.join(ROOT, 'assets/og', SLUG + '.png');
  await shot(1200, 630, ogHtml(m, svg.replace(/<svg /, '<svg preserveAspectRatio="xMidYMid slice" ')), ogFile);
  fs.copyFileSync(ogFile, path.join(inspect, 'og-card.png'));
  // Thumbnail: same template as tools/make-thumb.js
  const th = fs.readFileSync(path.join(__dirname, 'make-thumb.js'), 'utf8');
  const palSrc = th.slice(th.indexOf('const PALETTES = '), th.indexOf('const savedPalettes'));
  const pageSrc = th.slice(th.indexOf('const page = (spec) =>'), th.indexOf('\n(async () =>'));
  const thumbPage = vm.runInNewContext(`const W = 1280, H = 720; ${palSrc}; ${pageSrc}; page`, {});
  const thumbFile = path.join(ROOT, 'thumbs', SLUG + '.jpg');
  await shot(1280, 720, thumbPage({ ...thumbSpec, palette: tname }), thumbFile, { dpr: 2, jpeg: true });
  const central = path.join(process.env.EVIDENCE_PRESS_THUMBNAIL_DIR || path.join(os.homedir(), 'thumbs'), SLUG + '.jpg');
  if (process.argv.includes('--no-mirror')) { await b.close(); console.log('rendered (central mirror skipped)'); return; }
  if (fs.existsSync(central) && !fs.readFileSync(thumbFile).equals(fs.readFileSync(central))) throw new Error('central thumbnail exists; refusing to overwrite: ' + central);
  fs.copyFileSync(thumbFile, central);
  if (!fs.readFileSync(thumbFile).equals(fs.readFileSync(central))) throw new Error('central mirror mismatch');
  fs.copyFileSync(thumbFile, path.join(inspect, 'thumbnail.jpg'));
  await b.close();
  console.log('rendered OG, thumbnail, mirror and inspection PNGs');
})().catch(e => { console.error(e); process.exit(1); });
