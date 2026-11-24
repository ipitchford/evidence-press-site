'use strict';
const { bannerSvg } = require('./svg-xml');
// Sharp logarithmic growth of the Bapat–Sunder eigenvalue ratio (bapat-sunder-eigenvalue-ratio-growth): banner, OG, thumbnail.
// "This image helps the reader understand" that the worst ratio B = lambda_max(F_A)/per A over n x n correlation matrices
// grows like (1/2) log n over the reals and log n over the complex numbers (Theorem 1.1), by plotting the released,
// exactly certified finite examples (dots: order 27, real rank 3, B > 1.0036; orders 378 and 10710, real rank 3 and
// complex rank 2) against the two leading-growth lines and the conjectured value B = 1.
// checkHook compares the plotted values with the released outputs (results/independent_order27.txt "1.0036";
// results/shell_certificate.txt 1.321302, 2.173910, 2.645706, 4.348254), recomputes the orders 6+24+96+252 = 378 and
// 6+24+96+384+10200 = 10710, checks that every point exceeds 1 and lies below the explicit upper bounds
// (1/2) log n + 5/2 and log n + 5 of Theorem 1.1, and refuses to draw on mismatch.
// Reference: txgraffiti-order48-successor (one exact object balanced with immediately readable values).
// Usage: node tools/bapat-sunder-ratio-art.js [--render OUTDIR_FOR_INSPECTION] [--no-mirror]
const SLUG = 'bapat-sunder-eigenvalue-ratio-growth';
const ink = '#f6f2ea', muted = '#e2e7ea', dim = '#c3ccd2', hot = '#ffc36b', cool = '#9fd3ff', rose = '#f2a7b5', mint = '#a8e6c1';
const SANS = 'Arial,Helvetica,sans-serif', SERIF = 'Georgia,serif';
const text = (x, y, s, size = 18, color = ink, anchor = 'start', weight = 'normal', family = SANS, style = 'normal') => {
  if (/<|&(?!(lt|gt|amp|minus|#\d+);)/.test(s.replace(/<\/?tspan[^>]*>/g, ''))) throw new Error('unescaped < or & in SVG text: ' + s);
  return `<text class="og-hide" x="${x}" y="${y}" fill="${color}" font-family="${family}" font-size="${size}" font-weight="${weight}" font-style="${style}" text-anchor="${anchor}">${s}</text>`;
};
// Released certified lower bounds (exact rational enclosures printed to six decimals; order 27 from the stored eigenvector).
const RELEASED = {
  real: [[27, 1.0036], [378, 1.321302], [10710, 2.17391]],
  complex: [[378, 2.645706], [10710, 4.348254]]
};
function checkHook() {
  if (6 + 24 + 96 + 252 !== 378 || 6 + 24 + 96 + 384 + 10200 !== 10710) throw new Error('order mismatch');
  for (const [n, b] of RELEASED.real) if (!(b > 1 && b < 0.5 * Math.log(n) + 2.5)) throw new Error('real point outside Theorem 1.1 bounds: ' + n);
  for (const [n, b] of RELEASED.complex) if (!(b > 1 && b < Math.log(n) + 5)) throw new Error('complex point outside Theorem 1.1 bounds: ' + n);
  const shell = '1.321302 2.173910 2.645706 4.348254'.split(' ').map(Number);
  const plotted = [RELEASED.real[1][1], RELEASED.real[2][1], RELEASED.complex[0][1], RELEASED.complex[1][1]];
  if (plotted.some((v, i) => Math.abs(v - shell[i]) > 1e-6)) throw new Error('shell_certificate mismatch');
  if (RELEASED.real[0][1] !== 1.0036) throw new Error('order-27 mismatch');
  return { real: RELEASED.real, complex: RELEASED.complex, halfLog10710: +(0.5 * Math.log(10710)).toFixed(3) };
}
function chart(x0, y0, w, h) {
  const LX = Math.log(20000), YMAX = 6;
  const sx = n => x0 + Math.log(n) / LX * w, sy = v => y0 + h - v / YMAX * h;
  let s = `<line x1="${x0}" y1="${y0 + h}" x2="${x0 + w}" y2="${y0 + h}" stroke="${dim}" stroke-width="1.2" opacity="0.7"/><line x1="${x0}" y1="${y0}" x2="${x0}" y2="${y0 + h}" stroke="${dim}" stroke-width="1.2" opacity="0.7"/>`;
  const c = checkHook();
  // conjectured value B = 1
  s += `<line x1="${x0}" y1="${sy(1)}" x2="${x0 + w}" y2="${sy(1)}" stroke="${mint}" stroke-width="1.6" stroke-dasharray="3 5" opacity="0.9"/>`;
  s += text(x0 + w - 4, sy(1) + 18, 'Bapat–Sunder conjecture: B = 1', 13, mint, 'end');
  const curve = (f, col) => { const P = []; for (let i = 0; i <= 120; i++) { const n = Math.exp(Math.log(2) + i / 120 * (LX - Math.log(2))); if (f(n) <= YMAX) P.push([sx(n), sy(f(n))]); } return `<path d="${P.map(([x, y], i) => (i ? 'L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1)).join('')}" fill="none" stroke="${col}" stroke-width="2.4" stroke-dasharray="7 5" opacity="0.85"/>`; };
  s += curve(n => Math.log(n), rose) + curve(n => 0.5 * Math.log(n), cool);
  s += text(sx(Math.exp(YMAX)) - 34, y0 + 12, 'log n (complex)', 13, rose, 'end');
  s += text(x0 + w - 10, sy(0.5 * Math.log(20000)) - 10, '½ log n (real)', 13, cool, 'end');
  const dot = (n, b, col, label, dx, dy, anchor) => `<circle cx="${sx(n).toFixed(1)}" cy="${sy(b).toFixed(1)}" r="6" fill="${col}" stroke="#111" stroke-width="1"/>` + text(sx(n) + dx, sy(b) + dy, label, 13, col, anchor, 'bold');
  s += dot(27, c.real[0][1], hot, 'order 27: B &gt; 1.0036', 10, 18, 'start');
  s += dot(378, c.real[1][1], cool, '1.32', 10, 5, 'start') + dot(10710, c.real[2][1], cool, '2.17', 10, 5, 'start');
  s += dot(378, c.complex[0][1], rose, '2.64', 10, 16, 'start') + dot(10710, c.complex[1][1], rose, '4.34', 10, 18, 'start');
  for (const n of [27, 378, 10710]) s += text(sx(n), y0 + h + 20, String(n).replace(/(\d)(\d{3})$/, '$1 $2'), 12, dim, 'middle');
  s += text(x0 - 8, sy(1) + 4, '1', 12, dim, 'end') + text(x0 - 8, sy(3) + 4, '3', 12, dim, 'end') + text(x0 - 8, sy(5) + 4, '5', 12, dim, 'end');
  s += text(x0 + w / 2, y0 + h + 38, 'matrix order n (log scale); dots are exactly certified examples', 13, muted, 'middle');
  return s;
}
const draw = () => {
  let s = text(40, 46, 'The permanent is not on top: by about ½ log n, or log n', 25, ink, 'start', 'normal', SERIF);
  s += text(40, 74, 'Ratio B = largest eigenvalue of F_A ÷ permanent, worst case over n × n correlation matrices (Theorem 1.1)', 15, muted);
  s += chart(70, 100, 580, 220);
  const R = 720;
  s += text(R, 128, 'Worst ratio: ½ log n for real matrices,', 16, ink, 'start', 'bold');
  s += text(R, 150, 'log n for complex ones (error O(log log n)).', 16, ink, 'start', 'bold');
  s += text(R, 184, 'Real rank three and complex rank two suffice, so', 14, muted);
  s += text(R, 204, 'three is the smallest real rank (Corollary 1.2).', 14, muted);
  s += text(R, 238, 'Explicit upper bounds: ½ log n + 5/2 and log n + 5.', 14, muted);
  s += text(R, 272, 'Smallest known real example: order 27 with', 14, ink);
  s += text(R, 292, 'integer vectors (previously 32), B &gt; 1.0036.', 14, ink);
  s += text(40, 384, 'Dots: certified lower bounds at orders 27, 378 and 10 710 (exact arithmetic). Dashed lines: leading growth (log n is cut off at the top). Unrefereed candidate.', 12, dim);
  return s;
};
const description = 'Banner for a paper on the sharp logarithmic growth of the Bapat–Sunder eigenvalue ratio. Title: The permanent is not on top: by about one half log n, or log n. Subtitle: ratio B equals the largest eigenvalue of F_A divided by the permanent, worst case over n by n correlation matrices (Theorem 1.1). Left: a chart against the matrix order n on a log scale, with ticks at 27, 378 and 10 710. A dashed green line at B = 1 is labelled Bapat–Sunder conjecture: B = 1. Two dashed rising lines are labelled one half log n (real), in blue, and log n (complex), in pink. Dots mark exactly certified examples: an amber dot at order 27, labelled B greater than 1.0036; blue dots at 1.32 and 2.17 (real) and pink dots at 2.64 and 4.34 (complex) at orders 378 and 10 710. Right: worst ratio one half log n for real matrices, log n for complex ones, with error of order log log n. Real rank three and complex rank two suffice, so three is the smallest real rank (Corollary 1.2). Explicit upper bounds: one half log n plus 5/2 and log n plus 5. Smallest known real example: order 27 with integer vectors (previously 32), B greater than 1.0036. Footer: dots are certified lower bounds at orders 27, 378 and 10 710 in exact arithmetic; dashed lines show leading growth, with the log n line cut off at the top; unrefereed candidate.';
function frame(inner, background) {
  return bannerSvg({ inner, description, background, glow: { color: '#ffc36b', cx: '0.3', cy: '0.55', r: '0.4', opacity: '0.06' } });
}
const thumbSpec = {
  kicker: ['RESEARCH RELEASE · NOVEMBER 2026', 'MATRIX ANALYSIS · PERMANENTS'],
  head: ['How far the eigenvalue', '<em>beats the permanent</em>'], headSize: 52,
  sub: 'Sharp logarithmic growth of the Bapat–Sunder eigenvalue ratio, with exact examples of rank three and order 27.',
  tag: 'UNREFEREED CANDIDATE',
  hero: '<div class="eq-label">worst ratio, n × n matrices</div><div class="hero-title">½ log n</div><div class="note">over the reals (rank three)<br>log n over the complex numbers</div><div class="eq-foot">was conjectured to be 1</div>'
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
