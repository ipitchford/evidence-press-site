'use strict';
const { bannerSvg } = require('./svg-xml');
// Which numbers are independence roots? (which-numbers-are-independence-roots): banner, OG, thumbnail.
// "This image helps the reader understand" that a purely imaginary number larger than one, i times the golden ratio,
// is a zero of an explicit graph's independence polynomial (Section 4): the join of five blocks of disjoint cliques
// (4111), (3,37), (11,18,43), (2,7,13,23), (3,3,3,3,3,10) has I_G = (1+3x^2+x^4)(1+4293x+2430x^2), and 1+3x^2+x^4
// vanishes at +-i*phi and +-i/phi, shown on the complex plane against the unit circle.
// checkHook recomputes I_G before drawing: sum over blocks of prod(1+t x), minus four (join of five blocks), compares
// it with the released coefficients [1,4293,2433,12879,7291,4293,2430] (code/verify_witness.py output) and with the
// product (1+3x^2+x^4)(1+4293x+2430x^2), checks the order 4,293 and that phi^2 + phi^-2 = 3 (so 1+3x^2+x^4 = 0 at x = i*phi).
// It refuses to draw on mismatch.
// Reference: txgraffiti-order48-successor (one exact object balanced with immediately readable values).
// Usage: node tools/independence-roots-art.js [--render OUTDIR_FOR_INSPECTION] [--no-mirror]
const SLUG = 'which-numbers-are-independence-roots';
const ink = '#f6f2ea', muted = '#e2e7ea', dim = '#c3ccd2', hot = '#ffc36b', cool = '#9fd3ff', rose = '#f2a7b5', mint = '#a8e6c1', grey = '#8f9aa3';
const SANS = 'Arial,Helvetica,sans-serif', SERIF = 'Georgia,serif';
const text = (x, y, s, size = 18, color = ink, anchor = 'start', weight = 'normal', family = SANS, style = 'normal') => {
  if (/<|&(?!(lt|gt|amp|minus|#\d+);)/.test(s.replace(/<\/?tspan[^>]*>/g, ''))) throw new Error('unescaped < or & in SVG text: ' + s);
  return `<text class="og-hide" x="${x}" y="${y}" fill="${color}" font-family="${family}" font-size="${size}" font-weight="${weight}" font-style="${style}" text-anchor="${anchor}">${s}</text>`;
};
const BLOCKS = [[4111], [3, 37], [11, 18, 43], [2, 7, 13, 23], [3, 3, 3, 3, 3, 10]];
const RELEASED = [1, 4293, 2433, 12879, 7291, 4293, 2430];
const mul = (a, b) => { const r = Array(a.length + b.length - 1).fill(0); a.forEach((x, i) => b.forEach((y, j) => { r[i + j] += x * y; })); return r; };
function checkHook() {
  const I = Array(7).fill(0);
  for (const blk of BLOCKS) blk.reduce((p, t) => mul(p, [1, t]), [1]).forEach((c, k) => { I[k] += c; });
  I[0] -= BLOCKS.length - 1;
  if (JSON.stringify(I) !== JSON.stringify(RELEASED)) throw new Error('independence polynomial mismatch ' + JSON.stringify(I));
  const prod = mul([1, 0, 3, 0, 1], [1, 4293, 2430]);
  if (JSON.stringify(prod) !== JSON.stringify(RELEASED)) throw new Error('factorisation mismatch ' + JSON.stringify(prod));
  const order = BLOCKS.flat().reduce((a, b) => a + b, 0);
  if (order !== 4293 || I[1] !== order) throw new Error('order mismatch ' + order);
  const phi = (1 + Math.sqrt(5)) / 2;
  if (Math.abs(phi ** 2 + phi ** -2 - 3) > 1e-12) throw new Error('phi identity');
  return { coefficients: I, order, alpha: I.length - 1, phi };
}
function plane(cx, cy) {
  const c = checkHook(), u = 56; // unit length in px
  let s = `<line x1="${cx - 150}" y1="${cy}" x2="${cx + 150}" y2="${cy}" stroke="${grey}" stroke-width="1.4"/>`;
  s += `<line x1="${cx}" y1="${cy - 120}" x2="${cx}" y2="${cy + 120}" stroke="${grey}" stroke-width="1.4"/>`;
  s += `<circle cx="${cx}" cy="${cy}" r="${u}" fill="none" stroke="${dim}" stroke-width="1.4" stroke-dasharray="5 5"/>`;
  s += `<line x1="${cx + 2}" y1="${cy}" x2="${cx + 150}" y2="${cy}" stroke="${rose}" stroke-width="4" opacity="0.85"/>`;
  s += text(cx + u + 10, cy + 18, 'no roots on the', 12, rose, 'start');
  s += text(cx + u + 10, cy + 32, 'positive axis', 12, rose, 'start');
  s += text(cx + u * 0.72, cy - u * 0.72 - 6, '|z| = 1', 12, dim, 'start');
  const pts = [[c.phi, hot, 'iφ', 'start'], [-c.phi, hot, '−iφ', 'start'], [1 / c.phi, cool, 'i/φ', 'start'], [-1 / c.phi, cool, '−i/φ', 'start']];
  for (const [b, col, lab] of pts) {
    const y = cy - b * u;
    s += `<circle cx="${cx}" cy="${y.toFixed(1)}" r="${col === hot ? 8 : 6}" fill="${col}" stroke="#111" stroke-width="1.2"/>`;
    s += text(cx + 14, (y + 5).toFixed(1), lab, 16, col, 'start', 'bold', SERIF);
  }
  s += text(cx - 14, cy - c.phi * u + 5, 'modulus 1.618', 12, hot, 'end');
  s += text(cx - 18, cy + 112, 'zeros of', 13, muted, 'end');
  s += text(cx - 18, cy + 128, '1 + 3x² + x⁴', 13, muted, 'end');
  return s;
}
const draw = () => {
  const c = checkHook();
  let s = text(40, 46, 'i × golden ratio is an independence root', 27, ink, 'start', 'normal', SERIF);
  s += text(40, 74, 'A number is a zero of some graph’s independence polynomial exactly when the two obvious tests allow it', 15, muted);
  s += plane(190, 222);
  const X = 420;
  s += text(X, 132, 'Join five blocks of disjoint cliques:', 15, ink, 'start', 'bold');
  s += text(X, 156, '(4111) + (3, 37) + (11, 18, 43) + (2, 7, 13, 23) + (3, 3, 3, 3, 3, 10)', 14, muted, 'start', 'normal', SERIF);
  s += text(X, 186, `${c.order.toLocaleString('en-GB')} vertices, largest independent set of size ${c.alpha}`, 15, cool);
  s += text(X, 228, 'I(x) = (1 + 3x² + x⁴)(1 + 4293x + 2430x²)', 21, hot, 'start', 'bold', SERIF);
  s += text(X, 258, 'so ±iφ and ±i/φ are roots, and |iφ| = 1.618… is larger than one', 14, ink);
  s += text(X, 300, 'Every root needs: 1/z an algebraic integer, no conjugate positive real.', 14, mint, 'start', 'bold');
  s += text(X, 320, 'Nothing else is needed: cographs, trees and well-covered graphs realise them all.', 14, mint);
  s += text(40, 384, 'Left: the complex plane with the unit circle; gold points lie outside it. Right: the explicit witness graph of Section 4. Unrefereed candidate.', 12, dim);
  return s;
};
const description = 'Banner for a paper on which numbers are independence roots. Title: i times the golden ratio is an independence root. Subtitle: a number is a zero of some graph’s independence polynomial exactly when the two obvious tests allow it. Left: the complex plane with a dashed unit circle; the positive real axis is marked in pink with the note no roots on the positive axis; on the imaginary axis two gold points at plus and minus i phi, outside the circle, labelled modulus 1.618, and two blue points at plus and minus i over phi, inside it; caption zeros of 1 plus 3 x squared plus x to the fourth. Right: join five blocks of disjoint cliques, (4111), (3, 37), (11, 18, 43), (2, 7, 13, 23) and (3, 3, 3, 3, 3, 10); 4,293 vertices, largest independent set of size 6; I of x equals (1 plus 3 x squared plus x to the fourth) times (1 plus 4293 x plus 2430 x squared); so plus or minus i phi and plus or minus i over phi are roots, and the modulus of i phi, 1.618, is larger than one. Every root needs: 1 over z an algebraic integer, no conjugate positive real. Nothing else is needed: cographs, trees and well-covered graphs realise them all. Footer: left, the complex plane with the unit circle, gold points outside it; right, the explicit witness graph of Section 4; unrefereed candidate.';
function frame(inner, background) {
  return bannerSvg({ inner, description, background, glow: { color: '#ffc36b', cx: '0.42', cy: '0.55', r: '0.4', opacity: '0.06' } });
}
const thumbSpec = {
  kicker: ['RESEARCH RELEASE · NOVEMBER 2026', 'GRAPH POLYNOMIALS'],
  head: ['Which numbers are', '<em>independence roots</em>?'], headSize: 50,
  sub: 'Exactly the ones that obviously could be. And i × golden ratio is one, on a 4,293-vertex graph.',
  tag: 'UNREFEREED CANDIDATE',
  hero: '<div class="eq-label">an imaginary root larger than one</div><div class="hero-title">iφ</div><div class="note">(1 + 3x² + x⁴)(1 + 4293x + 2430x²)</div><div class="eq-foot">largest independent set: six</div>'
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
