'use strict';
const { bannerSvg } = require('./svg-xml');
// Global Sinkhorn rates from one Poincaré inequality: banner, OG card and thumbnail.
// "This image helps the reader understand" how many Sinkhorn iterations are needed as the regularisation lambda shrinks:
// the Poincaré guarantee of Theorem 2 grows like 1/lambda^2 (slope 2 on log-log axes), a uniform source needs only about
// 1/(2 lambda) (slope 1), and the fixed logarithmic-cusp source of Theorem 6 needs about 1/((8/5) log 2 lambda^2 log^2(1/lambda)),
// so its slope approaches 2: the exponent 2 cannot be lowered for a fixed source.
// Source (paper 0.1.0-candidate, 3 Nov 2026): Theorem 2 (factor C_P/(C_P + lambda^2) with L = 1), Theorem 6, Figure 1 and
// Section 8; the plotted points are the exact local dual-gap factors (1 - D_lambda)^2 recorded in checks/sharpness_checks.json
// (sources.uniform.local_rates and sources.log_cusp.local_rates, field local_dual_gap_factor), two-atom model of Section 7,
// C_P = 3/4 for the cusp. Iterations per e-fold of the gap near the optimum = 1/log(1/factor).
// Usage: node tools/poincare-sinkhorn-art.js [--render OUTDIR_FOR_INSPECTION] [--no-mirror]
const SLUG = 'poincare-sinkhorn-global-rates';
const ink = '#f4f1ea', muted = '#e3d9c9', dim = '#c4b7a2';
const gC = '#ffcf7a', cuspC = '#f2a7c3', uniC = '#9fd2ff';
const SANS = 'Arial,Helvetica,sans-serif', SERIF = 'Georgia,serif';
const text = (x, y, s, size = 18, color = ink, anchor = 'start', weight = 'normal', family = SANS) =>
  `<text class="og-hide" x="${x}" y="${y}" fill="${color}" font-family="${family}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}">${s}</text>`;
const f = v => (+v).toFixed(1);

// checks/sharpness_checks.json, local_dual_gap_factor (exact local factors (1 - D_lambda)^2).
const LAMBDAS = [0.5, 0.2, 0.1, 0.05, 0.02, 0.01, 0.005, 0.002, 0.001];
const UNIFORM = [0.268309713710892, 0.6400290549657242, 0.8100000007420153, 0.9025, 0.9603999999999999, 0.9801, 0.990025, 0.996004, 0.998001];
const CUSP = [0.2764545306692021, 0.6944133855459812, 0.8747794734789502, 0.954010835609498, 0.9889328097893152, 0.9964141353903161, 0.9988727572241712, 0.9997643539882798, 0.9999294002674357];
const CP = 0.75;
const iters = q => 1 / Math.log(1 / q); // iterations per e-fold reduction of the gap
const guarantee = lam => iters(CP / (CP + lam * lam));

// Plot frame (log-log): x = 1/lambda from 1 to 1000, y = iterations from 1 to 1e6.
const PX0 = 560, PX1 = 1080, PY0 = 330, PY1 = 92;
const PX = inv => PX0 + Math.log10(inv) / 3 * (PX1 - PX0);
const PY = n => PY0 - Math.log10(n) / 6 * (PY0 - PY1);
function plot() {
  let s = '';
  for (let e = 0; e <= 6; e += 1) {
    s += `<path d="M${PX0} ${f(PY(10 ** e))} H${PX1}" stroke="${dim}" stroke-opacity=".14" stroke-width="1"/>`;
    s += text(PX0 - 8, PY(10 ** e) + 4, e === 0 ? '1' : `10${['', '', '²', '³', '⁴', '⁵', '⁶'][e]}`, 12, dim, 'end');
  }
  for (let e = 0; e <= 3; e += 1) {
    s += `<path d="M${f(PX(10 ** e))} ${PY0} v5" stroke="${dim}" stroke-width="1.2"/>`;
    s += text(PX(10 ** e), PY0 + 20, ['1', '10', '100', '1000'][e], 12, dim, 'middle');
  }
  s += `<path d="M${PX0} ${PY0} H${PX1} M${PX0} ${PY0} V${PY1}" stroke="${dim}" stroke-opacity=".55" stroke-width="1"/>`;
  s += text(PX1, PY0 + 40, '1/λ  (weaker regularisation →)', 13, dim, 'end');
  s += text(PX0 - 46, PY1 - 14, 'iterations per e-fold of the gap', 13, dim);
  // Guarantee (dashed curve).
  const g = []; for (let k = 0; k <= 120; k++) { const inv = 2 * 500 ** (k / 120); g.push(`${f(PX(inv))} ${f(PY(guarantee(1 / inv)))}`); }
  s += `<path d="M${g.join(' L')}" stroke="${gC}" stroke-width="3" stroke-dasharray="9 6" fill="none"/>`;
  const series = (vals, color) => {
    const pts = LAMBDAS.map((l, i) => [PX(1 / l), PY(iters(vals[i]))]);
    let o = `<path d="M${pts.map(p => `${f(p[0])} ${f(p[1])}`).join(' L')}" stroke="${color}" stroke-width="3" fill="none" stroke-linejoin="round"/>`;
    for (const [x, y] of pts) o += `<circle cx="${f(x)}" cy="${f(y)}" r="4.5" fill="${color}"/>`;
    return o;
  };
  s += series(CUSP, cuspC) + series(UNIFORM, uniC);
  const yG = PY(guarantee(0.001)), yC = PY(iters(CUSP[8])), yU = PY(iters(UNIFORM[8]));
  s += text(PX1 + 12, yG + 5, 'guarantee', 15, gC, 'start', 'bold') + text(PX1 + 12, yG + 22, 'slope 2', 13, gC);
  s += text(PX1 + 12, yC + 5, 'cusp source', 15, cuspC, 'start', 'bold') + text(PX1 + 12, yC + 22, 'slope → 2', 13, cuspC);
  s += text(PX1 + 12, yU + 5, 'uniform', 15, uniC, 'start', 'bold') + text(PX1 + 12, yU + 22, 'slope 1', 13, uniC);
  return s;
}
function left() {
  let s = text(40, 58, 'How many Sinkhorn iterations', 28, ink, 'start', 'normal', SERIF);
  s += text(40, 92, 'as the regularisation λ shrinks?', 28, ink, 'start', 'normal', SERIF);
  s += text(40, 146, 'One Poincaré inequality on the source:', 15, muted);
  s += text(40, 180, 'gap shrinks by  C<tspan baseline-shift="sub" font-size="70%">P</tspan> L² / (C<tspan baseline-shift="sub" font-size="70%">P</tspan> L² + λ²)', 21, gC, 'start', 'bold', SERIF);
  s += text(40, 206, 'every iteration, from the first, for any target', 15, muted);
  s += text(40, 252, 'so about (C<tspan baseline-shift="sub" font-size="70%">P</tspan> L²/λ²) log(1/ε) iterations;', 15, ink, 'start', 'bold');
  s += text(40, 274, 'a fixed cusp source shows 1/λ² cannot be beaten', 15, cuspC, 'start', 'bold');
  s += text(40, 336, 'Points: exact local rates in the two-atom model', 12, dim);
  s += text(40, 352, '(paper, Section 7 and Figure 1); cusp C<tspan baseline-shift="sub" font-size="70%">P</tspan> = 3/4', 12, dim);
  return s;
}
const draw = () => left() + `<path d="M500 60 L 500 360" stroke="${muted}" stroke-opacity=".22" stroke-width="1.2"/>` + plot();
const description = 'Banner for a paper on global convergence rates for Sinkhorn’s algorithm. Left: the question “How many Sinkhorn iterations as the regularisation lambda shrinks?” and the answer: under one Poincaré inequality on the source, the dual gap shrinks by the factor C_P L squared over (C_P L squared plus lambda squared) in every iteration, from the first and for any target, so about C_P L squared over lambda squared times log of one over epsilon iterations are needed; a fixed cusp source shows that one over lambda squared cannot be beaten. Right: a log-log plot of iterations needed per e-fold reduction of the gap against one over lambda, from 1 to 1000. A dashed gold curve, the guarantee of Theorem 2 with Poincaré constant three quarters, rises with slope 2, to about 750,000 at lambda 0.001. Pink points, the fixed logarithmic-cusp source of Theorem 6, rise with a slope approaching 2, to about 14,000. Blue points, the uniform source, rise with slope 1, to about 500. All points lie below the guarantee. Points are the exact local rates computed in the paper’s two-atom model.';
function frame(inner, background) {
  return bannerSvg({ inner, description, background, glow: { color: gC, cx: '0.7', cy: '0.5', r: '0.42', opacity: '0.06' } });
}
const thumbSpec = {
  kicker: ['RESEARCH RELEASE · NOVEMBER 2026', 'OPTIMAL TRANSPORT · ALGORITHMS'],
  head: ['Sinkhorn:', '<em>1/λ² is the limit</em>'], headSize: 76,
  sub: 'One Poincaré inequality on the source gives a fixed contraction every iteration, and the 1/λ² count cannot be beaten in general.',
  tag: 'UNREFEREED CANDIDATE',
  hero: '<div class="eq-label">gap factor per iteration</div><div class="hero-title" style="font-size:46px">C<sub>P</sub>L² / (C<sub>P</sub>L² + λ²)</div><div class="note">from the first step, any target</div><div class="hero-title" style="font-size:46px">≈ 1/λ² iterations</div><div class="eq-foot">sharp exponent · population measures only</div>'
};
module.exports = { draw, description, thumbSpec, iters, guarantee };
if (require.main === module) (async () => {
  const fs = require('fs'), pth = require('path'), os = require('os'), vm = require('vm');
  const ROOT = pth.join(__dirname, '..');
  // Guards: recorded points lie below the guarantee; slopes over the last decade.
  LAMBDAS.forEach((l, i) => { if (!(iters(CUSP[i]) <= guarantee(l) && iters(UNIFORM[i]) <= guarantee(l))) throw new Error('point above guarantee at ' + l); });
  const slope = v => Math.log10(iters(v[8]) / iters(v[5])) / Math.log10(10);
  const sU = slope(UNIFORM), sC = slope(CUSP), sG = Math.log10(guarantee(0.001) / guarantee(0.01));
  if (Math.abs(sU - 1) > 0.02 || !(sC > 1.2 && sC < 2) || Math.abs(sG - 2) > 0.01) throw new Error('slope check failed ' + [sU, sC, sG]);
  // Theorem 6 leading asymptotic: deficit ~ (8/5) log 2 lambda^2 log^2(1/lambda) at lambda = 0.001 (within the recorded ratio).
  const lead = 1.6 * Math.log(2) * 1e-6 * Math.log(1000) ** 2, def = 1 - CUSP[8];
  if (!(def / lead > 0.5 && def / lead < 3)) throw new Error('cusp asymptotic mismatch ' + def / lead);
  const reg = JSON.parse(fs.readFileSync(pth.join(ROOT, 'data/BANNER_PALETTES.json'), 'utf8'));
  const { palettes } = require('./banner-palettes');
  const bsaved = reg.assignments.find(r => r.slug === SLUG); if (!bsaved) throw new Error('no saved banner palette'); const bname = bsaved.palette;
  const tp = require('./thumbnail-palettes');
  const tsaved = tp.load().assignments.find(r => r.slug === SLUG); if (!tsaved) throw new Error('no saved thumbnail palette');
  const tname = tsaved.editorialPalette || tsaved.palette;
  const svg = frame(draw(), { name: bname, colors: palettes[bname] });
  fs.writeFileSync(pth.join(ROOT, 'assets/art', SLUG + '.svg'), svg);
  console.log('art:', SLUG, 'banner palette', bname, '| thumbnail palette', tname, '| slopes', sU.toFixed(3), sC.toFixed(3), sG.toFixed(3), '| cusp/lead', (def / lead).toFixed(3));
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
