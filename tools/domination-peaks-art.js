'use strict';
const { bannerSvg } = require('./svg-xml');
// Domination polynomials with many peaks (domination-polynomial-unimodality-counterexamples): banner, OG, thumbnail.
// "This image helps the reader understand" that the number of dominating sets of size k in the explicit 317,440-vertex
// graphs dips and rises again (Theorem 1.1): the three exactly certified intervals for 10^6 d_k / H at k = 160,080,
// 160,320 and 160,560 are drawn to scale, and the middle interval lies entirely below both outer ones.
// checkHook compares the plotted values with the released certificate output (results/certificate-output.txt:
// 160080 1556 1615 / 160320 1482 1541 / 160560 1565 1624; H = 2^314880 with P = 6ms^2 = 307200, h = ms = 2560,
// P + 3h = 314880, N = P + 4h = 317440 for m = 128, s = 20), checks the equal index spacing 240,
// the strict valley 1541 < 1556 and 1541 < 1565, and that all three indices lie in the upper half (k > N/2), and refuses
// to draw on mismatch.
// Reference: txgraffiti-order48-successor (one exact object balanced with immediately readable values).
// Usage: node tools/domination-peaks-art.js [--render OUTDIR_FOR_INSPECTION] [--no-mirror]
const SLUG = 'domination-polynomial-unimodality-counterexamples';
const ink = '#f6f2ea', muted = '#e2e7ea', dim = '#c3ccd2', hot = '#ffc36b', cool = '#9fd3ff', rose = '#f2a7b5', mint = '#a8e6c1';
const SANS = 'Arial,Helvetica,sans-serif', SERIF = 'Georgia,serif';
const text = (x, y, s, size = 18, color = ink, anchor = 'start', weight = 'normal', family = SANS, style = 'normal') => {
  if (/<|&(?!(lt|gt|amp|minus|#\d+);)/.test(s.replace(/<\/?tspan[^>]*>/g, ''))) throw new Error('unescaped < or & in SVG text: ' + s);
  return `<text class="og-hide" x="${x}" y="${y}" fill="${color}" font-family="${family}" font-size="${size}" font-weight="${weight}" font-style="${style}" text-anchor="${anchor}">${s}</text>`;
};
// Released certified bounds, units of H/10^6 (results/certificate-output.txt).
const RELEASED = [[160080, 1556, 1615], [160320, 1482, 1541], [160560, 1565, 1624]];
function checkHook() {
  const m = 128, s = 20, h = m * s, P = 6 * m * s * s, N = P + 4 * h;
  if (h !== 2560 || P !== 307200 || N !== 317440 || P + 3 * h !== 314880) throw new Error('parameter mismatch');
  const out = '160080 1556 1615\n160320 1482 1541\n160560 1565 1624';
  if (RELEASED.map(r => r.join(' ')).join('\n') !== out) throw new Error('certificate-output mismatch');
  const [a, b, c] = RELEASED;
  if (b[0] - a[0] !== 240 || c[0] - b[0] !== 240) throw new Error('index spacing mismatch');
  if (!(b[2] < a[1] && b[2] < c[1])) throw new Error('no strict valley');
  if (!RELEASED.every(r => r[0] > N / 2 && r[1] < r[2])) throw new Error('interval or half mismatch');
  return { N, H: '2^' + (P + 3 * h), rows: RELEASED, gapLeft: a[1] - b[2], gapRight: c[1] - b[2] };
}
function chart(x0, y0, w, h) {
  const c = checkHook();
  const YMIN = 1460, YMAX = 1640;
  const sy = v => y0 + h - (v - YMIN) / (YMAX - YMIN) * h;
  let s = `<line x1="${x0}" y1="${y0 + h}" x2="${x0 + w}" y2="${y0 + h}" stroke="${dim}" stroke-width="1.2" opacity="0.7"/><line x1="${x0}" y1="${y0}" x2="${x0}" y2="${y0 + h}" stroke="${dim}" stroke-width="1.2" opacity="0.7"/>`;
  for (const v of [1480, 1520, 1560, 1600, 1640]) s += text(x0 - 8, sy(v) + 4, String(v), 12, dim, 'end');
  // band: top of the middle interval, below both outer lower ends
  s += `<line x1="${x0}" y1="${sy(1541).toFixed(1)}" x2="${x0 + w}" y2="${sy(1541).toFixed(1)}" stroke="${mint}" stroke-width="1.4" stroke-dasharray="3 5" opacity="0.9"/>`;
  s += text(x0 + w - 4, sy(1541) + 17, 'top of the middle interval: 1541', 12, mint, 'end');
  const xs = [x0 + w * 0.2, x0 + w * 0.5, x0 + w * 0.8];
  const cols = [cool, rose, cool];
  RELEASED.forEach(([k, lo, hi], i) => {
    const x = xs[i];
    s += `<rect x="${(x - 16).toFixed(1)}" y="${sy(hi).toFixed(1)}" width="32" height="${(sy(lo) - sy(hi)).toFixed(1)}" rx="4" fill="${cols[i]}" opacity="0.88" stroke="#111" stroke-width="1"/>`;
    s += text(x + 24, sy(hi) + (i === 1 ? -7 : 5), String(hi), 13, cols[i], 'start', 'bold');
    s += text(x + 24, sy(lo) + 5, String(lo), 13, cols[i], 'start', 'bold');
    s += text(x, y0 + h + 20, String(k).replace(/(\d{3})$/, ',$1'), 13, ink, 'middle', 'bold');
  });
  s += text(x0 + w / 2, y0 + h + 40, 'dominating-set size k; bars: certified range of 10⁶ d_k / 2^314880', 13, muted, 'middle');
  return s;
}
const draw = () => {
  let s = text(40, 46, 'The count of dominating sets dips, then rises again', 25, ink, 'start', 'normal', SERIF);
  s += text(40, 74, 'd_160080 &gt; d_160320 &lt; d_160560 in explicit 317,440-vertex graphs, certified in exact integer arithmetic (Theorem 1.1)', 15, muted);
  s += chart(90, 100, 540, 220);
  const R = 700;
  s += text(R, 128, 'The Alikhani–Peng conjecture said these', 16, ink, 'start', 'bold');
  s += text(R, 150, 'counts always rise to one peak, then fall.', 16, ink, 'start', 'bold');
  s += text(R, 184, 'Two families of dominating sets, exactly equal', 14, muted);
  s += text(R, 204, 'in number but different in typical size, give', 14, muted);
  s += text(R, 224, 'two humps with a dip between them.', 14, muted);
  s += text(R, 258, 'Same idea: many peaks, and a most common size', 14, ink);
  s += text(R, 278, 'far from the average. Minimum degree', 14, ink);
  s += text(R, 298, 'log₂ n + log₂ log₂ n + 1 forces one central peak.', 14, ink);
  s += text(40, 384, 'Bars: certified intervals for the split and the bipartite example (both connected). The middle bar lies wholly below both outer bars. Unrefereed candidate.', 12, dim);
  return s;
};
const description = 'Banner for a paper on counterexamples to the unimodality of domination polynomials. Title: The count of dominating sets dips, then rises again. Subtitle: d sub 160080 is greater than d sub 160320, which is less than d sub 160560, in explicit 317,440-vertex graphs, certified in exact integer arithmetic (Theorem 1.1). Left: a chart with three vertical bars at dominating-set sizes 160,080, 160,320 and 160,560, showing the certified range of one million times d sub k divided by 2 to the power 314880. The outer bars, in blue, span 1556 to 1615 and 1565 to 1624; the middle bar, in pink, spans 1482 to 1541. A dashed green line at 1541 marks the top of the middle interval, below both outer bars. Right: the Alikhani–Peng conjecture said these counts always rise to one peak, then fall. Two families of dominating sets, exactly equal in number but different in typical size, give two humps with a dip between them. Same idea: many peaks, and a most common size far from the average. Minimum degree log2 n plus log2 log2 n plus 1 forces one central peak. Footer: bars are certified intervals for the split and the bipartite example, both connected; the middle bar lies wholly below both outer bars; unrefereed candidate.';
function frame(inner, background) {
  return bannerSvg({ inner, description, background, glow: { color: '#9fd3ff', cx: '0.3', cy: '0.55', r: '0.4', opacity: '0.06' } });
}
const thumbSpec = {
  kicker: ['RESEARCH RELEASE · NOVEMBER 2026', 'GRAPH THEORY · COUNTING'],
  head: ['Dominating sets', '<em>need not peak once</em>'], headSize: 52,
  sub: 'Explicit 317,440-vertex graphs disprove the Alikhani–Peng unimodality conjecture, with an exact integer certificate.',
  tag: 'UNREFEREED CANDIDATE',
  hero: '<div class="eq-label">dominating sets of size k</div><div class="hero-title">dip</div><div class="note">more of size 160,080 and 160,560<br>than of size 160,320</div><div class="eq-foot">conjectured: one peak only</div>'
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
