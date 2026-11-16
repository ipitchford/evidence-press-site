'use strict';
const { bannerSvg } = require('./svg-xml');
// Negative mutual information in time in the smallest dimensions (negative-mutual-information-in-time): banner, OG, thumbnail.
// "This image helps the reader understand" where the proposed mutual information in time turns negative: the exact curve
// I(t) of the coherent erasure family (Theorem 4.3: strictly convex, negative exactly for 0 < t < (sqrt33 - 1)/16) against
// the incoherent completion t log 2 (Proposition 7.1), the integer certificate at t = 5/21 (Theorem 4.1), and the
// thresholds input 3, output 2, rank 2 attained by the certified qutrit-to-qubit witness (Theorem 5.1, Corollary 5.2).
// checkHook recomputes the integer certificate with BigInt (5^5 7^7 and 2^14 3^12), evaluates the closed form of I(t) at
// 5/21 and the minimiser t*, recomputes tau, and compares them with the released verification/verification.json values
// (copied below); it refuses to draw on mismatch.
// Reference: txgraffiti-order48-successor (one exact object balanced with immediately readable values).
// Usage: node tools/negative-mutual-information-art.js [--render OUTDIR_FOR_INSPECTION] [--no-mirror]
const SLUG = 'negative-mutual-information-in-time';
const ink = '#f6f2ea', muted = '#e2e7ea', dim = '#c3ccd2', hot = '#ffc36b', cool = '#9fd3ff', rose = '#f2a7b5';
const SANS = 'Arial,Helvetica,sans-serif', SERIF = 'Georgia,serif';
const text = (x, y, s, size = 18, color = ink, anchor = 'start', weight = 'normal', family = SANS, style = 'normal') => {
  if (/<|&(?!(lt|gt|amp|minus|#\d+);)/.test(s.replace(/<\/?tspan[^>]*>/g, ''))) throw new Error('unescaped < or & in SVG text: ' + s);
  return `<text class="og-hide" x="${x}" y="${y}" fill="${color}" font-family="${family}" font-size="${size}" font-weight="${weight}" font-style="${style}" text-anchor="${anchor}">${s}</text>`;
};
// I(t) = t/2 log(2t) + (r - t)/4 log((r - t)/4) - (r + t)/4 log((r + t)/4), r = sqrt(t^2 - t + 1) (paper, eq. 12)
const Ifam = t => { if (t <= 0) return 0; const r = Math.sqrt(t * t - t + 1), a = (r - t) / 4, b = (r + t) / 4; return t / 2 * Math.log(2 * t) + (a > 0 ? a * Math.log(a) : 0) - b * Math.log(b); };
function checkHook() {
  // released verification/verification.json values
  const rel = { inequality: '2573571875 < 8707129344', I521: -0.02902017586425846713911730, tStar: 0.112197392433428, ItStar: -0.0590859989390897,
    tau: 0.296535165408627, tauExact: '(sqrt(33)-1)/16', witness: ['-0.00139052762357143640184790433312927313640000000', '-0.00139052762357143640184790433312927313630000000'] };
  const num = 5n ** 5n * 7n ** 7n, den = 2n ** 14n * 3n ** 12n;
  if (`${num} < ${den}` !== rel.inequality || !(num < den)) throw new Error('integer certificate mismatch');
  if (Math.abs(Math.log(Number(num) / Number(den)) / 42 - rel.I521) > 1e-14) throw new Error('42 I(5/21) = log(num/den) mismatch');
  if (Math.abs(Ifam(5 / 21) - rel.I521) > 1e-14) throw new Error('I(5/21) mismatch: ' + Ifam(5 / 21));
  const tau = (Math.sqrt(33) - 1) / 16;
  if (Math.abs(tau - rel.tau) > 1e-14 || Math.abs(Ifam(tau)) > 1e-14) throw new Error('tau mismatch');
  let best = [0, 0]; for (let k = 1; k < 200000; k++) { const t = k / 200000 * 0.3, v = Ifam(t); if (v < best[1]) best = [t, v]; }
  if (Math.abs(best[0] - rel.tStar) > 1e-5 || Math.abs(best[1] - rel.ItStar) > 1e-9) throw new Error('t* mismatch: ' + best);
  if (Math.abs(Ifam(1) - Math.log(2)) > 1e-12) throw new Error('I(1) = log 2 mismatch');
  return rel;
}
// ---- left: the curve ----
function left(rel) {
  const x0 = 60, x1 = 440, yTop = 120, yBot = 360, lo = -0.16, hi = 0.72;
  const X = t => x0 + (x1 - x0) * t, Y = v => yTop + (yBot - yTop) * (hi - v) / (hi - lo);
  let s = text(40, 108, 'The coherent erasure family dips below zero', 15, muted, 'start', 'bold');
  const tau = (Math.sqrt(33) - 1) / 16;
  s += `<rect x="${X(0)}" y="${yTop}" width="${(X(tau) - X(0)).toFixed(1)}" height="${yBot - yTop}" fill="${cool}" opacity="0.12"/>`;
  s += `<line x1="${x0}" y1="${Y(0).toFixed(1)}" x2="${x1}" y2="${Y(0).toFixed(1)}" stroke="rgba(255,255,255,0.45)" stroke-width="1"/>`;
  let d = '', e = '';
  for (let k = 0; k <= 300; k++) { const t = k / 300; d += (k ? 'L' : 'M') + X(t).toFixed(1) + ' ' + Y(Ifam(t)).toFixed(1); e += (k ? 'L' : 'M') + X(t).toFixed(1) + ' ' + Y(t * Math.LN2).toFixed(1); }
  s += `<path d="${e}" fill="none" stroke="${hot}" stroke-width="2" stroke-dasharray="7 5"/>`;
  s += `<path d="${d}" fill="none" stroke="${cool}" stroke-width="3.2"/>`;
  s += `<circle cx="${X(5 / 21).toFixed(1)}" cy="${Y(rel.I521).toFixed(1)}" r="5" fill="${rose}"/>`;
  s += text(X(5 / 21) + 10, Y(rel.I521) + 26, 't = 5/21', 13, rose, 'start', 'bold');
  s += text(X(tau) + 6, Y(0) - 8, 'τ', 15, ink, 'start', 'bold', SERIF, 'italic');
  s += text(X(0.36), Y(0.36 * Math.LN2) - 10, 'incoherent: t log 2', 12, hot, 'end');
  s += text(X(0.80) + 10, Y(Ifam(0.80)) + 24, 'coherent', 12, cool, 'start', 'bold');
  s += text(x0, yBot + 22, '0', 11, dim, 'middle'); s += text(x1, yBot + 22, '1', 11, dim, 'middle');
  s += text((x0 + x1) / 2, yBot + 22, 'channel parameter t', 11, dim, 'middle');
  s += text(x0 - 8, Y(0) + 4, '0', 11, dim, 'end');
  return s;
}
// ---- centre: integer certificate ----
function centre() {
  const x0 = 500; let s = '';
  s += text(x0, 130, 'At t = 5/21 the sign is a comparison', 15, muted, 'start', 'bold');
  s += text(x0, 150, 'of two whole numbers', 15, muted, 'start', 'bold');
  s += text(x0, 204, '5⁵ · 7⁷ = 2573571875', 22, ink, 'start', 'normal', SERIF);
  s += text(x0 + 150, 238, '&lt;', 26, rose, 'middle', 'bold', SERIF);
  s += text(x0, 274, '2¹⁴ · 3¹² = 8707129344', 22, ink, 'start', 'normal', SERIF);
  s += text(x0, 318, 'so I(5/21) = (1/42) log(ratio) ≈ −0.029 nats', 13, ink);
  s += text(x0, 338, 'negative exactly for 0 &lt; t &lt; τ = (√33 − 1)/16', 13, dim);
  return s;
}
function right() {
  const x0 = 900; let s = '';
  s += `<line x1="${x0 - 22}" y1="104" x2="${x0 - 22}" y2="372" stroke="rgba(255,255,255,0.16)" stroke-width="1"/>`;
  s += text(x0, 130, 'Smallest place it can fail', 15, muted, 'start', 'bold');
  [['input levels', '≥ 3'], ['output levels', '≥ 2'], ['rank of start', '≥ 2']].forEach(([a, b], i) => {
    const y = 172 + i * 38;
    s += text(x0, y, a, 15, ink); s += text(x0 + 240, y, b, 20, hot, 'end', 'bold', SERIF);
  });
  s += text(x0, 290, 'All three at once: a certified', 13, ink);
  s += text(x0, 308, 'qutrit-to-qubit example, about', 13, ink);
  s += text(x0, 326, '−0.00139 nats', 13, cool, 'start', 'bold');
  s += text(x0, 352, 'Not the first counterexample', 12, dim, 'start', 'normal', SERIF, 'italic');
  return s;
}
const draw = rel =>
  text(40, 50, 'Negative mutual information in time in the smallest dimensions', 25, ink, 'start', 'normal', SERIF) +
  text(40, 80, 'Three levels in, two out, a rank-two start: where a proposed quantum mutual information in time turns negative', 15, muted) +
  left(rel) + centre() + right();
const description = 'Banner for a paper on negative mutual information in time. Title: Negative mutual information in time in the smallest dimensions. Subtitle: Three levels in, two out, a rank-two start: where a proposed quantum mutual information in time turns negative. Left: the coherent erasure family dips below zero. A solid curve shows the mutual information in time of the coherent completion as the channel parameter t runs from 0 to 1; it is negative on a shaded interval from 0 to tau and rises to log 2. A dashed line shows the incoherent completion, t log 2, which is never negative. A dot marks t = 5/21. Centre: at t = 5/21 the sign is a comparison of two whole numbers: 5 to the fifth times 7 to the seventh, 2573571875, is less than 2 to the fourteenth times 3 to the twelfth, 8707129344; so I(5/21) is one forty-second of the log of their ratio, about minus 0.029 nats; negative exactly for 0 < t < tau = (square root of 33 minus 1)/16. Right: smallest place it can fail: input levels at least 3, output levels at least 2, rank of the starting state at least 2. All three at once: a certified qutrit-to-qubit example, about minus 0.00139 nats. Not the first counterexample.';
function frame(inner, background) {
  return bannerSvg({ inner, description, background, glow: { color: '#9fd3ff', cx: '0.5', cy: '0.55', r: '0.4', opacity: '0.06' } });
}
const thumbSpec = {
  kicker: ['RESEARCH RELEASE · NOVEMBER 2026', 'QUANTUM INFORMATION'],
  head: ['Mutual information in time', 'can go <em>negative</em>'], headSize: 46,
  sub: 'Three levels in, two out, a rank-two start: the smallest place a proposed quantum measure of correlation across time drops below zero.',
  tag: 'UNREFEREED CANDIDATE',
  hero: '<div class="eq-label">the sign at t = 5/21</div><div class="hero-title">2573571875 &lt; 8707129344</div><div class="note">input 3, output 2, rank 2<br>all minimal, attained at once</div><div class="eq-foot">exact certificate</div>'
};
module.exports = { draw, description, thumbSpec, checkHook };
if (require.main === module) (async () => {
  const fs = require('fs'), pth = require('path'), os = require('os'), vm = require('vm');
  const ROOT = pth.join(__dirname, '..');
  const rel = checkHook();
  console.log('check: integer certificate, I(5/21), tau and t* match the released verification output');
  const { resolve: bannerResolve } = require('./banner-palettes');
  const bp = bannerResolve(SLUG); if (!bp) throw new Error('no banner palette');
  const tp = require('./thumbnail-palettes');
  const tname = tp.resolve(SLUG, true);
  const svg = frame(draw(rel), bp);
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
