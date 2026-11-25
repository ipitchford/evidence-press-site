'use strict';
const { bannerSvg } = require('./svg-xml');
// Which L_p-spherical copulas maximise a generalised Gini mean difference? (lp-spherical-copula-gini-conjecture):
// banner, OG, thumbnail.
// "This image helps the reader understand" that the conjectured optimal copulas (the centred L_p-spherical laws with
// p = 3 - beta) are close to optimal but never exactly optimal away from beta = 1. Centre: the support outlines
// |x|^p + |y|^p = 1 for p = 1.5, 2 and 2.5 on the centred square (as in Figure 1 of the paper), with the axis point
// (0, 1/2) where the density has the kink that the regularity test detects (Proposition 5). Right: the shortfall of the
// conjectured member against an explicit checkerboard copula, in parts per million of the optimal value, at the six
// computed powers beta != 1 (Section 7, results/profile_summary.json, n = 256; floating point, not certified).
// checkHook checks the plotted values against results/profile_summary.json of the release (when EP_LPSC_PACKAGE
// points at the release package) and refuses to draw on any mismatch.
// Reference: txgraffiti-order48-successor (one exact object balanced with immediately readable values).
// Usage: node tools/lp-spherical-copula-art.js [--render OUTDIR_FOR_INSPECTION] [--no-mirror]
const SLUG = 'lp-spherical-copula-gini-conjecture';
const ink = '#f6f2ea', muted = '#e2e7ea', dim = '#c3ccd2', hot = '#ffc36b', rose = '#f2a7b5', mint = '#a8e6c1', sky = '#9fd3f2';
const SANS = 'Arial,Helvetica,sans-serif', SERIF = 'Georgia,serif';
const text = (x, y, s, size = 18, color = ink, anchor = 'start', weight = 'normal', family = SANS, style = 'normal') => {
  if (/<|&(?!(lt|gt|amp|minus|#\d+);)/.test(s.replace(/<\/?tspan[^>]*>/g, ''))) throw new Error('unescaped < or & in SVG text: ' + s);
  return `<text class="og-hide" x="${x}" y="${y}" fill="${color}" font-family="${family}" font-size="${size}" font-weight="${weight}" font-style="${style}" text-anchor="${anchor}">${s}</text>`;
};
// Relative margin of an explicit checkerboard copula over the conjectured member p = 3 - beta, n = 256
// (results/profile_summary.json, rel_gain_over_conj), in parts per million.
const PPM = [[0.25, 25.54], [0.5, 12.78], [0.75, 2.033], [1.25, 0.2106], [1.5, 1.824], [1.75, 12.36]];
function checkHook() {
  const fs = require('fs'), pth = require('path');
  if (PPM.some(([, v]) => !(v > 0.1 && v < 30))) throw new Error('plotted range');
  const pkg = process.env.EP_LPSC_PACKAGE;
  if (pkg) {
    const rows = JSON.parse(fs.readFileSync(pth.join(pkg, 'results/profile_summary.json'), 'utf8'));
    for (const [b, v] of PPM) {
      const r = rows.find(x => x.beta === b);
      if (!r || r.n !== 256) throw new Error('missing row ' + b);
      const ppm = r.rel_gain_over_conj * 1e6;
      if (Math.abs(ppm - v) / ppm > 0.005) throw new Error(`beta ${b}: plotted ${v} ppm, file ${ppm}`);
    }
    const r1 = rows.find(x => x.beta === 0.25);
    if (r1.p_best.toFixed(2) !== '3.03') throw new Error('best p at beta 0.25');
  }
  return { checkedAgainstPackage: Boolean(pkg), ppm: PPM };
}
// Support outlines, centred square [-1,1]^2 drawn at scale S around (CX, CY).
const CX = 640, CY = 205, S = 125;
const outline = p => {
  const pts = [];
  for (let k = 0; k <= 720; k++) {
    const t = 2 * Math.PI * k / 720, u = Math.cos(t), v = Math.sin(t);
    const R = p === Infinity ? 1 / Math.max(Math.abs(u), Math.abs(v)) : (Math.abs(u) ** p + Math.abs(v) ** p) ** (-1 / p);
    pts.push(`${(CX + S * R * u).toFixed(1)},${(CY - S * R * v).toFixed(1)}`);
  }
  return pts.join(' ');
};
// Chart: beta in [0, 2] -> x; log10 ppm in [-1, 1.6] -> y.
const X0 = 860, X1 = 1150, Y0 = 318, Y1 = 92;
const px = b => X0 + b / 2 * (X1 - X0);
const py = v => Y0 - (Math.log10(v) + 1) / 2.6 * (Y0 - Y1);
const draw = () => {
  const c = checkHook();
  let s = '';
  s += text(40, 52, 'Close, but never exact', 30, hot, 'start', 'normal', SERIF);
  s += text(40, 96, 'With both marginals fixed, which dependence', 15, muted);
  s += text(40, 116, 'makes two random points lie farthest apart?', 15, muted);
  s += text(40, 150, 'At power 1 the answer is the disc copula, the', 15, muted);
  s += text(40, 170, 'shadow of a uniform sphere. For other powers, the', 15, muted);
  s += text(40, 190, 'conjectured answer was the L<tspan baseline-shift="sub" font-size="11">p</tspan>-spherical law, p = 3 − β.', 15, muted);
  s += text(40, 232, 'Proved: it fails at every β ≠ 1, and no member', 15, ink, 'start', 'bold');
  s += text(40, 252, 'of the family is ever optimal off β = 1.', 15, ink, 'start', 'bold');
  s += text(40, 290, 'Numerically the loss is tiny: parts per million.', 15, mint);
  s += text(40, 312, 'The family stays an excellent approximation.', 15, mint);
  // centre: outlines
  s += `<rect x="${CX - S}" y="${CY - S}" width="${2 * S}" height="${2 * S}" fill="none" stroke="${dim}" stroke-width="1" stroke-dasharray="3 4"/>`;
  s += `<line x1="${CX - S}" y1="${CY}" x2="${CX + S}" y2="${CY}" stroke="${dim}" stroke-width="0.8" opacity="0.6"/><line x1="${CX}" y1="${CY - S}" x2="${CX}" y2="${CY + S}" stroke="${dim}" stroke-width="0.8" opacity="0.6"/>`;
  s += `<polyline points="${outline(1.5)}" fill="none" stroke="${sky}" stroke-width="2.4"/>`;
  s += `<polyline points="${outline(2)}" fill="none" stroke="${dim}" stroke-width="2" stroke-dasharray="4 4"/>`;
  s += `<polyline points="${outline(2.5)}" fill="none" stroke="${rose}" stroke-width="2.4"/>`;
  s += `<circle cx="${CX}" cy="${CY - S / 2}" r="6" fill="${hot}" stroke="#1b1b1b" stroke-width="1"/>`;
  s += text(CX + 12, CY - S / 2 - 2, 'kink', 12.5, hot, 'start', 'bold');
  s += text(CX + 12, CY - S / 2 + 13, 'on the axis', 12.5, hot, 'start', 'bold');
  s += text(CX - S, CY + S + 22, 'p = 1.5', 13, sky, 'start', 'bold');
  s += text(CX, CY + S + 22, 'p = 2 (disc)', 13, dim, 'middle');
  s += text(CX + S, CY + S + 22, 'p = 2.5', 13, rose, 'end', 'bold');
  // right: chart
  s += text(X0 - 30, 52, 'How far the conjectured law falls short', 14, ink, 'start', 'bold');
  s += text(X0 - 30, 72, '(parts per million of the optimum, log scale)', 12.5, dim);
  s += `<line x1="${X0}" y1="${Y0}" x2="${X1}" y2="${Y0}" stroke="${dim}" stroke-width="1.2"/><line x1="${X0}" y1="${Y0}" x2="${X0}" y2="${Y1}" stroke="${dim}" stroke-width="1.2"/>`;
  for (const [v, lab] of [[0.1, '0.1'], [1, '1'], [10, '10']]) {
    s += `<line x1="${X0 - 5}" y1="${py(v).toFixed(1)}" x2="${X0}" y2="${py(v).toFixed(1)}" stroke="${dim}" stroke-width="1.2"/>`;
    s += text(X0 - 9, (py(v) + 4).toFixed(1), lab, 12.5, dim, 'end');
  }
  for (const b of [0, 0.5, 1, 1.5, 2]) {
    s += `<line x1="${px(b).toFixed(1)}" y1="${Y0}" x2="${px(b).toFixed(1)}" y2="${Y0 + 5}" stroke="${dim}" stroke-width="1.2"/>`;
    s += text(px(b).toFixed(1), Y0 + 21, String(b), 12.5, dim, 'middle');
  }
  s += text((X0 + X1) / 2, Y0 + 40, 'power β', 12.5, dim, 'middle');
  s += `<line x1="${px(1).toFixed(1)}" y1="${Y0}" x2="${px(1).toFixed(1)}" y2="${Y1}" stroke="${mint}" stroke-width="1.6" stroke-dasharray="3 4"/>`;
  s += text((px(1) + 6).toFixed(1), (Y1 + 8).toFixed(1), 'exact at β = 1', 12, mint, 'start');
  for (const [b, v] of c.ppm) {
    s += `<line x1="${px(b).toFixed(1)}" y1="${Y0}" x2="${px(b).toFixed(1)}" y2="${py(v).toFixed(1)}" stroke="${hot}" stroke-width="2" opacity="0.55"/>`;
    s += `<circle cx="${px(b).toFixed(1)}" cy="${py(v).toFixed(1)}" r="5.5" fill="${hot}" stroke="#1b1b1b" stroke-width="1"/>`;
  }
  s += text(40, 388, 'Proofs for every β ≠ 1; the sizes are floating-point estimates on discretised copulas, not certified bounds. Unrefereed candidate.', 12, dim);
  return s;
};
const description = 'Banner for a paper on the L_p-spherical copula conjecture. Title: close, but never exact. Left text: with both marginals fixed, which dependence makes two random points lie farthest apart? At power 1 the answer is the disc copula, the shadow of a uniform sphere. For other powers, the conjectured answer was the L_p-spherical law with p = 3 minus beta. Proved: it fails at every beta other than 1, and no member of the family is ever optimal off beta = 1. Numerically the loss is tiny, parts per million; the family stays an excellent approximation. Centre: the outlines of the supports for p = 1.5, 2 (the disc) and 2.5 inside the square, with a dot on the vertical axis marking the kink in the density that the proof detects. Right: a chart of how far the conjectured law falls short of an explicit better copula, in parts per million of the optimum on a log scale, at six powers between 0.25 and 1.75: about 25.5, 12.8, 2.0, 0.2, 1.8 and 12.4, with a dashed line at power 1 where the disc copula is exact. Footer: proofs for every beta other than 1; the sizes are floating-point estimates on discretised copulas, not certified bounds; unrefereed candidate.';
function frame(inner, background) {
  checkHook();
  if (!description.includes('parts per million')) throw new Error('stated values differ from the computation');
  return bannerSvg({ inner, description, background, glow: { color: '#ffc36b', cx: '0.55', cy: '0.5', r: '0.3', opacity: '0.07' } });
}
const thumbSpec = {
  kicker: ['RESEARCH RELEASE · NOVEMBER 2026', 'PROBABILITY · COPULAS'],
  head: ['The conjectured copula', '<em>is close, but never exact.</em>'], headSize: 60,
  sub: 'The Bernard–Müller–Oesting conjecture fails at every power except one.',
  tag: 'UNREFEREED CANDIDATE',
  hero: '<div class="eq-label">shortfall of the conjectured law</div><div class="hero-title">0.2–26 ppm</div><div class="note">of the optimal value<br>(numerical, six powers)</div><div class="eq-foot">proved suboptimal for every β ≠ 1</div>'
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
