'use strict';
const { bannerSvg } = require('./svg-xml');
// Sharp finite-market prophet inequalities for a single threshold (finite-market-single-threshold-prophet): banner, OG, thumbnail.
// "This image helps the reader understand" that with three buyers and two items (n = 3, k = l = 2) the guarantee of a
// price tuned to a stockout target q is the lower of two exact curves (Theorem 2.1(1)): the utilisation branch
// U_3(p_3(q)), rising, and the acceptance branch (l/k) A_2(p_2(q)) = 1 - q/3, falling; the best target is their crossing
// (78.7%), just below the best fixed price that may use every distribution (79.1% = (sqrt 21 - 3)/2) and below the
// identical-law value (85.2% = 23/27). Same picture as the left panel of the paper's figure.
// checkHook recomputes the crossing by bisection, compares it with the released values (results/verify.txt row 3 2 2:
// 0.78666152 and 0.79128785 and 0.85185185; results/additions.json q* = 0.6400154) and refuses to draw on mismatch.
// Reference: txgraffiti-order48-successor (one exact object balanced with immediately readable values).
// Usage: node tools/finite-market-prophet-art.js [--render OUTDIR_FOR_INSPECTION] [--no-mirror]
const SLUG = 'finite-market-single-threshold-prophet';
const ink = '#f6f2ea', muted = '#e2e7ea', dim = '#c3ccd2', hot = '#ffc36b', cool = '#9fd3ff', rose = '#f2a7b5', mint = '#a8e6c1';
const SANS = 'Arial,Helvetica,sans-serif', SERIF = 'Georgia,serif';
const text = (x, y, s, size = 18, color = ink, anchor = 'start', weight = 'normal', family = SANS, style = 'normal') => {
  if (/<|&(?!(lt|gt|amp|minus|#\d+);)/.test(s.replace(/<\/?tspan[^>]*>/g, ''))) throw new Error('unescaped < or & in SVG text: ' + s);
  return `<text class="og-hide" x="${x}" y="${y}" fill="${color}" font-family="${family}" font-size="${size}" font-weight="${weight}" font-style="${style}" text-anchor="${anchor}">${s}</text>`;
};
const RELEASED = { stockout: 0.78666152, allStatic: 0.79128785, iid: 0.85185185, qStar: 0.6400154 };
// n = 3, k = l = 2. Stockout P(Bin(3,p) >= 2) = 3p^2 - 2p^3; utilisation U_3(p) = (3p(1-p)^2 + 2(3p^2 - 2p^3))/2.
// Rival count Bin(2,p): stockout p^2, acceptance A_2(p) = 1 - p^2/3, so the second branch is 1 - q/3.
const bis = (f, y) => { let a = 0, b = 1; for (let i = 0; i < 200; i++) { const c = (a + b) / 2; (f(c) < y ? a = c : b = c); } return (a + b) / 2; };
const branch1 = q => { const p = bis(p => 3 * p * p - 2 * p ** 3, q); return (3 * p * (1 - p) ** 2 + 2 * q) / 2; };
const branch2 = q => 1 - q / 3;
function checkHook() {
  const qs = bis(q => branch1(q) - branch2(q), 0), v = branch2(qs);
  if (Math.abs(v - RELEASED.stockout) > 1e-7 || Math.abs(qs - RELEASED.qStar) > 1e-6) throw new Error('crossing mismatch ' + qs + ' ' + v);
  const ps = (Math.sqrt(21) - 3) / 2; // all-static: p = 1 - p^2/3
  if (Math.abs(ps - RELEASED.allStatic) > 1e-7 || Math.abs(ps - (1 - ps * ps / 3)) > 1e-12) throw new Error('all-static mismatch');
  if (Math.abs(23 / 27 - RELEASED.iid) > 1e-7) throw new Error('iid mismatch');
  if (!(v < ps && ps < 23 / 27)) throw new Error('order mismatch');
  return { qStar: +qs.toFixed(5), stockout: +v.toFixed(5), allStatic: +ps.toFixed(5), iid: +(23 / 27).toFixed(5) };
}
function chart(x0, y0, w, h) {
  const sx = q => x0 + q * w, lo = 0.35, hi = 1.0, sy = v => y0 + h - (v - lo) / (hi - lo) * h;
  let s = `<line x1="${x0}" y1="${y0 + h}" x2="${x0 + w}" y2="${y0 + h}" stroke="${dim}" stroke-width="1.2" opacity="0.7"/><line x1="${x0}" y1="${y0}" x2="${x0}" y2="${y0 + h}" stroke="${dim}" stroke-width="1.2" opacity="0.7"/>`;
  const pts = f => { const r = []; for (let i = 20; i < 100; i++) { const q = i / 100; r.push([q, f(q)]); } return r; };
  const line = (P, col, dash) => `<path d="${P.map(([q, v], i) => (i ? 'L' : 'M') + sx(q).toFixed(1) + ' ' + sy(v).toFixed(1)).join('')}" fill="none" stroke="${col}" stroke-width="3" ${dash ? 'stroke-dasharray="6 5"' : ''} stroke-linecap="round"/>`;
  const c = checkHook();
  for (const [v, col, lab] of [[c.iid, mint, 'buyers alike: 85.2%'], [c.allStatic, cool, 'best fixed price, any information: 79.1%']]) {
    s += `<line x1="${x0}" y1="${sy(v).toFixed(1)}" x2="${x0 + w}" y2="${sy(v).toFixed(1)}" stroke="${col}" stroke-width="1.6" stroke-dasharray="3 5" opacity="0.9"/>`;
    s += text(x0 + 8, sy(v) - 7, lab, 13, col);
  }
  s += line(pts(branch1), cool) + line(pts(branch2), rose);
  s += text(sx(0.3), sy(branch1(0.3)) + 22, 'share of stock sold', 13, cool, 'start');
  s += text(sx(0.99), sy(branch2(0.99)) + 24, 'chance a buyer is served', 13, rose, 'end');
  const cx = sx(c.qStar), cy = sy(c.stockout);
  s += `<line x1="${cx}" y1="${cy}" x2="${cx}" y2="${y0 + h}" stroke="${hot}" stroke-width="1.4" stroke-dasharray="4 4"/>`;
  s += `<circle cx="${cx}" cy="${cy}" r="8" fill="none" stroke="${hot}" stroke-width="2.6"/><circle cx="${cx}" cy="${cy}" r="3" fill="${hot}"/>`;
  s += text(cx + 16, cy + 104, 'best sell-out target: 78.7%', 14, hot, 'start', 'bold');
  s += text(x0, y0 + h + 20, '0', 12, dim, 'middle') + text(x0 + w, y0 + h + 20, '1', 12, dim, 'middle') + text(cx, y0 + h + 20, 'q* = 0.64', 12, hot, 'middle');
  s += text(x0 + w / 2, y0 + h + 38, 'stockout target q: how often all the stock sells', 13, muted, 'middle');
  return s;
}
const draw = () => {
  let s = text(40, 46, 'One fixed price, three buyers, two items: 79% guaranteed', 25, ink, 'start', 'normal', SERIF);
  s += text(40, 74, 'Worst-case share of a prophet’s value, buyers in random order with different value distributions (exact, Theorem 2.1)', 15, muted);
  s += chart(60, 100, 600, 220);
  const R = 720;
  s += text(R, 128, 'Tune the price to a sell-out target q:', 16, ink, 'start', 'bold');
  s += text(R, 152, 'the guarantee is the lower of two exact curves,', 14, muted);
  s += text(R, 172, 'and the best target sits where they cross.', 14, muted);
  s += text(R, 208, 'Over all market sizes that target attains', 14, muted);
  s += text(R, 228, '1 − e<tspan baseline-shift="super" font-size="10">−k</tspan> k<tspan baseline-shift="super" font-size="10">k</tspan>/k!  (63% for one item, 73% for two):', 14, ink);
  s += text(R, 248, 'the Arnosti–Ma conjecture, proved (Corollary 3.1).', 14, ink);
  s += text(R, 284, 'Sell-out tuning costs only about 0.03/n²;', 14, muted);
  s += text(R, 304, 'buyers who differ cost about 0.18/n (two items).', 14, muted);
  s += text(40, 384, 'Exact curves for n = 3, k = l = 2 (left panel of the paper’s figure). Worst cases over all value distributions. Unrefereed candidate.', 12, dim);
  return s;
};
const description = 'Banner for a paper on sharp finite-market prophet inequalities for a single threshold. Title: One fixed price, three buyers, two items: 79% guaranteed. Subtitle: worst-case share of a prophet’s value, buyers in random order with different value distributions, exact (Theorem 2.1). Left: a chart against the stockout target q, how often all the stock sells, from 0 to 1. A rising blue curve, share of stock sold, and a falling pink curve, chance a buyer is served, cross at q* = 0.64, marked by a ring and labelled best sell-out target: 78.7%. Dashed horizontal lines mark the best fixed price with any information, 79.1%, and buyers alike, 85.2%. Right: tune the price to a sell-out target q; the guarantee is the lower of two exact curves, and the best target sits where they cross. Over all market sizes that target attains 1 minus e to the minus k times k to the k over k factorial (63% for one item, 73% for two): the Arnosti-Ma conjecture, proved (Corollary 3.1). Sell-out tuning costs only about 0.03 over n squared; buyers who differ cost about 0.18 over n (two items). Footer: exact curves for n = 3, k = l = 2, the left panel of the paper’s figure; worst cases over all value distributions; unrefereed candidate.';
function frame(inner, background) {
  return bannerSvg({ inner, description, background, glow: { color: '#ffc36b', cx: '0.3', cy: '0.55', r: '0.4', opacity: '0.06' } });
}
const thumbSpec = {
  kicker: ['RESEARCH RELEASE · NOVEMBER 2026', 'ONLINE SELECTION · POSTED PRICES'],
  head: ['One price, n buyers:', '<em>exact guarantees</em>'], headSize: 52,
  sub: 'Sharp finite-market prophet inequalities for a single threshold, and a proof of the Arnosti–Ma stockout conjecture.',
  tag: 'UNREFEREED CANDIDATE',
  hero: '<div class="eq-label">three buyers, two items</div><div class="hero-title">79.1%</div><div class="note">guaranteed by one fixed price<br>78.7% at the best sell-out target</div><div class="eq-foot">worst case, random arrival order</div>'
};
module.exports = { draw, description, thumbSpec, checkHook };
if (require.main === module) (async () => {
  const fs = require('fs'), pth = require('path'), os = require('os'), vm = require('vm');
  const ROOT = pth.join(__dirname, '..');
  checkHook();
  console.log('check: n=3, k=l=2 crossing', JSON.stringify(checkHook()));
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
