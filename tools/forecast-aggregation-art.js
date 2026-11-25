'use strict';
const { bannerSvg } = require('./svg-xml');
// Learning to aggregate Bayesian forecasts (forecast-aggregation-sample-complexity): banner, OG, thumbnail.
// "This image helps the reader understand" why learning to combine forecasts can need as many resolved cases as there
// are report patterns: in the paper's smallest hard example (Section 4.2, m = n = 2, a = 1/16) every report pattern has
// the same probability and each expert's record is the same across the alternatives, yet the right combined probability
// when both experts say 31/64 is 833/2050, 961/2050 or 1089/2050. Right: the shape of the bound of Theorem 1,
// log(1/delta)/T + min(eta, K/T), on log-log axes for eta = 0, an intermediate eta and eta = infinity (constants omitted;
// K = 64 and log(1/delta) = log 32 chosen for the drawing only).
// checkHook checks the example against results/verification.json of the release (when EP_FASC_PACKAGE points at the
// release package) and the plotted curves against the formula, and refuses to draw on any mismatch.
// Reference: txgraffiti-order48-successor (one exact object balanced with immediately readable values).
// Usage: node tools/forecast-aggregation-art.js [--render OUTDIR_FOR_INSPECTION] [--no-mirror]
const SLUG = 'forecast-aggregation-sample-complexity';
const ink = '#f6f2ea', muted = '#e2e7ea', dim = '#c3ccd2', hot = '#ffc36b', rose = '#f2a7b5', mint = '#a8e6c1', sky = '#9fd3f2';
const SANS = 'Arial,Helvetica,sans-serif', SERIF = 'Georgia,serif';
const text = (x, y, s, size = 18, color = ink, anchor = 'start', weight = 'normal', family = SANS, style = 'normal') => {
  if (/<|&(?!(lt|gt|amp|minus|#\d+);)/.test(s.replace(/<\/?tspan[^>]*>/g, ''))) throw new Error('unescaped < or & in SVG text: ' + s);
  return `<text class="og-hide" x="${x}" y="${y}" fill="${color}" font-family="${family}" font-size="${size}" font-weight="${weight}" font-style="${style}" text-anchor="${anchor}">${s}</text>`;
};
// Worked example (Section 4.2; results/verification.json grids[0].worked_example).
const EX = { reports: ['31/64', '33/64'], agree: '1025/4096', disagree: '1023/4096', base: '961/2050', alts: ['833/2050', '1089/2050'] };
// Bound shape: L/T + min(eta, K/T).
const K = 64, L = Math.log(32);
const CURVES = [['η = 0 (independent)', 0, mint], ['η = 0.02', 0.02, hot], ['η = ∞ (anything goes)', Infinity, rose]];
const rate = (T, eta) => L / T + Math.min(eta, K / T);
function checkHook() {
  const fs = require('fs'), pth = require('path');
  const fr = s => { const [a, b] = s.split('/').map(Number); return a / b; };
  if (Math.abs(fr(EX.alts[0]) - (961 - 128) / 2050) > 1e-15 || Math.abs(fr(EX.alts[1]) - (961 + 128) / 2050) > 1e-15) throw new Error('alternatives');
  if (Math.abs(2 * fr(EX.agree) + 2 * fr(EX.disagree) - 1) > 1e-15) throw new Error('profile probabilities do not sum to one');
  for (const [, eta] of CURVES) for (let T = 10; T < 1e5; T *= 1.5) if (!(rate(T * 1.5, eta) <= rate(T, eta))) throw new Error('rate not decreasing');
  const pkg = process.env.EP_FASC_PACKAGE;
  if (pkg) {
    const v = JSON.parse(fs.readFileSync(pth.join(pkg, 'results/verification.json'), 'utf8'));
    if (v.status !== 'PASS' || v.checks_run !== 9075) throw new Error('verification status');
    const g = v.grids.find(x => x.m === 2 && x.n === 2), w = g && g.worked_example;
    if (!w || w.reports.join() !== EX.reports.join() || w.diagonal_profile !== EX.agree || w.off_diagonal_profile !== EX.disagree ||
        w.low_low_baseline !== EX.base || w.low_low_alternatives.join() !== EX.alts.join()) throw new Error('worked example differs from verification.json');
  }
  return { checkedAgainstPackage: Boolean(pkg), example: EX };
}
// Chart geometry: log10 T in [1, 5] -> x; log10 rate in [-4.6, 0] -> y.
const X0 = 880, X1 = 1160, Y0 = 318, Y1 = 92;
const px = lt => X0 + (lt - 1) / 4 * (X1 - X0);
const py = lr => Y0 - (lr + 4.6) / 4.6 * (Y0 - Y1);
const curve = eta => {
  const pts = [];
  for (let k = 0; k <= 200; k++) { const lt = 1 + 4 * k / 200; const r = Math.min(1, rate(10 ** lt, eta)); pts.push(`${px(lt).toFixed(1)},${py(Math.max(-4.6, Math.log10(r))).toFixed(1)}`); }
  return pts.join(' ');
};
const draw = () => {
  checkHook();
  let s = '';
  s += text(40, 52, 'How long must the track record be?', 25, hot, 'start', 'normal', SERIF);
  s += text(40, 94, 'Several forecasters report honest probabilities.', 15, muted);
  s += text(40, 114, 'Combining them well means learning how their', 15, muted);
  s += text(40, 134, 'evidence overlaps, from past cases with outcomes.', 15, muted);
  s += text(40, 174, 'Proved, up to constants:', 15, ink, 'start', 'bold');
  s += text(40, 198, 'independent: about log(1/δ)/ε cases', 15, mint, 'start', 'bold');
  s += text(40, 220, 'anything goes: about (m<tspan baseline-shift="super" font-size="10">n</tspan> + log(1/δ))/ε cases', 15, rose, 'start', 'bold');
  s += text(40, 242, 'and everything in between.', 15, ink, 'start', 'bold');
  s += text(40, 282, 'Why so many? In the hard cases every pattern of', 14, dim);
  s += text(40, 301, 'reports and every forecaster’s own record look', 14, dim);
  s += text(40, 320, 'the same, yet the right combination differs.', 14, dim);
  // centre: the m = n = 2 example as a 2 x 2 table of report patterns
  const CX = 510, CY = 108, C = 80;
  s += text(CX + C, CY - 34, 'Smallest hard example (two forecasters)', 13.5, ink, 'middle', 'bold');
  s += text(CX - 10, CY + C / 2 + 5, EX.reports[0], 13, sky, 'end', 'bold');
  s += text(CX - 10, CY + 1.5 * C + 5, EX.reports[1], 13, sky, 'end', 'bold');
  s += text(CX + C / 2, CY - 8, EX.reports[0], 13, sky, 'middle', 'bold');
  s += text(CX + 1.5 * C, CY - 8, EX.reports[1], 13, sky, 'middle', 'bold');
  for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) {
    const x = CX + j * C, y = CY + i * C, same = i === j;
    s += `<rect x="${x}" y="${y}" width="${C}" height="${C}" fill="${i === 0 && j === 0 ? 'rgba(255,195,107,0.16)' : 'rgba(255,255,255,0.05)'}" stroke="${dim}" stroke-width="1"/>`;
    s += text(x + C / 2, y + C / 2 + 5, same ? EX.agree : EX.disagree, 13, muted, 'middle');
  }
  s += text(CX + C, CY + 2 * C + 20, 'chance of each pattern: the same', 12.5, dim, 'middle');
  s += text(CX + C, CY + 2 * C + 37, 'in every alternative', 12.5, dim, 'middle');
  s += text(CX + C, CY + 2 * C + 62, 'If both say 31/64, the right answer is', 13, hot, 'middle', 'bold');
  s += text(CX + C, CY + 2 * C + 80, `${EX.alts[0]}, ${EX.base} or ${EX.alts[1]}`, 13, hot, 'middle', 'bold');
  // right: chart of the bound shape
  s += text(X0 - 30, 52, 'Excess error after T cases', 14, ink, 'start', 'bold');
  s += text(X0 - 30, 72, '(shape of the bound, log scales)', 12.5, dim);
  s += `<line x1="${X0}" y1="${Y0}" x2="${X1}" y2="${Y0}" stroke="${dim}" stroke-width="1.2"/><line x1="${X0}" y1="${Y0}" x2="${X0}" y2="${Y1}" stroke="${dim}" stroke-width="1.2"/>`;
  for (const [, eta, col] of CURVES) s += `<polyline points="${curve(eta)}" fill="none" stroke="${col}" stroke-width="2.4"/>`;
  s += text((X0 + X1) / 2, Y0 + 22, 'resolved cases T', 12.5, dim, 'middle');
  s += text(px(2.75) + 8, py(Math.log10(rate(10 ** 2.75, Infinity))) - 6, 'anything goes', 12, rose, 'start', 'bold');
  s += text(px(3.2), py(Math.log10(rate(10 ** 3.2, 0.02))) + 22, 'pooling bias η', 12, hot, 'middle', 'bold');
  s += text(px(3.0) - 8, py(Math.log10(rate(1e3, 0))) + 16, 'independent', 12, mint, 'end', 'bold');
  s += text(40, 388, 'Binary outcomes; exact calibrated reports; worst case over all laws; constants not optimised. Chart shows the form of the bound only. Unrefereed candidate.', 12, dim);
  return s;
};
const description = 'Banner for a paper on how many resolved past cases are needed to learn to combine probability forecasts. Title: how long must the track record be? Left text: several forecasters report honest probabilities; combining them well means learning how their evidence overlaps, from past cases with outcomes. Proved, up to constants: independent forecasters need about log(1/delta)/epsilon cases; when anything goes, about (m to the n plus log(1/delta))/epsilon cases; and everything in between. In the hard cases every pattern of reports and every forecaster’s own record look the same, yet the right combination differs. Centre: the smallest hard example with two forecasters who each report 31/64 or 33/64, drawn as a two-by-two table; each pattern where they agree has chance 1025/4096 and each where they disagree 1023/4096, identical in every alternative; if both say 31/64 the right answer is 833/2050, 961/2050 or 1089/2050. Right: the shape of the bound on log scales, excess error against the number of resolved cases, for independent forecasters, an intermediate dependence where the pooling bias levels off, and arbitrary dependence. Footer: binary outcomes; exact calibrated reports; worst case; constants not optimised; the chart shows the form of the bound only; unrefereed candidate.';
function frame(inner, background) {
  checkHook();
  if (!description.includes('1089/2050')) throw new Error('stated values differ from the computation');
  return bannerSvg({ inner, description, background, glow: { color: '#ffc36b', cx: '0.5', cy: '0.45', r: '0.3', opacity: '0.07' } });
}
const thumbSpec = {
  kicker: ['RESEARCH RELEASE · NOVEMBER 2026', 'LEARNING THEORY · FORECASTING'],
  head: ['How many resolved cases', '<em>does combining forecasts need?</em>'], headSize: 58,
  sub: 'The exact rate, up to constants, at every level of dependence between forecasters.',
  tag: 'UNREFEREED CANDIDATE',
  hero: '<div class="eq-label">resolved cases needed</div><div class="hero-title">log(1/δ)/ε</div><div class="note">independent forecasters<br>(mⁿ + log(1/δ))/ε if anything goes</div><div class="eq-foot">proved up to constants</div>'
};
module.exports = { draw, description, thumbSpec, checkHook };
if (require.main === module) (async () => {
  const fs = require('fs'), pth = require('path'), os = require('os'), vm = require('vm');
  const ROOT = pth.join(__dirname, '..');
  console.log('check:', JSON.stringify(checkHook()));
  const { resolve: bannerResolve } = require('./banner-palettes');
  const bp = bannerResolve(SLUG); if (!bp) throw new Error('no banner palette');
  const tp = require('./thumbnail-palettes');
  const tname = tp.resolve(SLUG, true);
  const svg = frame(draw(), bp);
  fs.writeFileSync(pth.join(ROOT, 'assets/art', SLUG + '.svg'), svg);
  console.log('art:', SLUG, 'banner palette', bp.name, '| thumbnail palette', tname);
  const i = process.argv.indexOf('--render');
  if (i < 0) return;
  const inspect = process.argv[i + 1];
  fs.mkdirSync(inspect, { recursive: true });
  const { chromium } = require('playwright');
  const br = await chromium.launch(process.env.EVIDENCE_PRESS_CHROME ? { executablePath: process.env.EVIDENCE_PRESS_CHROME } : {});
  const shot = async (w, h, html, file, opts = {}) => {
    const p = await br.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: opts.dpr || 1 });
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
  if (process.argv.includes('--no-mirror')) { await br.close(); console.log('rendered (central mirror skipped)'); return; }
  const central = pth.join(process.env.EVIDENCE_PRESS_THUMBNAIL_DIR || pth.join(os.homedir(), 'thumbs'), SLUG + '.jpg');
  if (fs.existsSync(central) && !fs.readFileSync(thumbFile).equals(fs.readFileSync(central))) throw new Error('central thumbnail exists; refusing to overwrite: ' + central);
  fs.copyFileSync(thumbFile, central);
  if (!fs.readFileSync(thumbFile).equals(fs.readFileSync(central))) throw new Error('central mirror mismatch');
  await br.close();
  console.log('rendered OG, thumbnail, mirror and inspection PNGs');
})().catch(e => { console.error(e); process.exit(1); });
