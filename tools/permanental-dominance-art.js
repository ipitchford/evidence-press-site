'use strict';
const { bannerSvg } = require('./svg-xml');
// Asymptotic permanental dominance at fixed Gram rank (asymptotic-permanental-dominance-fixed-rank): banner, OG, thumbnail.
// "This image helps the reader understand" that, at fixed Gram rank d, the worst average eigenvalue of a non-trivial
// Schur-power block, relative to the permanent (the normalised first moment m_1 of Lieb's conjecture, conjectured <= 1),
// shrinks to zero like (d-1) log n / n (Theorem 1.1(3), complex rank d), drawn for d = 2, 3, 4 on a log scale in n, beside
// the largest m_1 values in the release's exact small examples (results/check_dominance.txt, Part A1, complex frames,
// n = 2..6), all below the conjectured ceiling 1.
// checkHook compares the plotted small-order values with the released output, checks that each is below 1, recomputes
// the Theorem 1.3 example (for d = 2, 6 sqrt(2 e n)(log n + 5) <= n first holds at n = 48,836) and refuses to draw on
// mismatch. The curves are asymptotic sizes, not bounds at small n; the footer says so.
// Reference: finite-sample-affine-diversification (the contrasting conclusion carries the explanation; restrained labels).
// Usage: node tools/permanental-dominance-art.js [--render OUTDIR_FOR_INSPECTION] [--no-mirror]
const SLUG = 'asymptotic-permanental-dominance-fixed-rank';
const ink = '#f6f2ea', muted = '#e2e7ea', dim = '#c3ccd2', hot = '#ffc36b', cool = '#9fd3ff', rose = '#f2a7b5', mint = '#a8e6c1';
const SANS = 'Arial,Helvetica,sans-serif', SERIF = 'Georgia,serif';
const text = (x, y, s, size = 18, color = ink, anchor = 'start', weight = 'normal', family = SANS, style = 'normal') => {
  if (/<|&(?!(lt|gt|amp|minus|#\d+);)/.test(s.replace(/<\/?tspan[^>]*>/g, ''))) throw new Error('unescaped < or & in SVG text: ' + s);
  return `<text class="og-hide" x="${x}" y="${y}" fill="${color}" font-family="${family}" font-size="${size}" font-weight="${weight}" font-style="${style}" text-anchor="${anchor}">${s}</text>`;
};
// Released output, Part A1, complex frames: "n=k complex largest nontrivial m2 = ..., with m1 = ...".
const RELEASED_A1 = `  n=2 complex largest nontrivial m2 = 0.111111, with m1 = 0.333333
  n=3 complex largest nontrivial m2 = 0.535327, with m1 = 0.705189
  n=4 complex largest nontrivial m2 = 0.415301, with m1 = 0.575721
  n=5 complex largest nontrivial m2 = 0.271797, with m1 = 0.413350
  n=6 complex largest nontrivial m2 = 0.201923, with m1 = 0.271808`;
const SMALL = [[2, 0.333333], [3, 0.705189], [4, 0.575721], [5, 0.41335], [6, 0.271808]];
function checkHook() {
  const lines = RELEASED_A1.split('\n');
  SMALL.forEach(([n, m1], i) => {
    const m = lines[i].match(/n=(\d+) complex largest nontrivial m2 = ([\d.]+), with m1 = ([\d.]+)/);
    if (!m || +m[1] !== n || Math.abs(+m[3] - m1) > 1e-6) throw new Error('Part A1 mismatch at n=' + n);
    if (!(m1 < 1 && +m[2] < 1)) throw new Error('small-order value not below 1');
  });
  const cond = n => 6 * Math.sqrt(2 * Math.E * n) * (Math.log(n) + 5) <= n;
  if (!cond(48836) || cond(48835)) throw new Error('Theorem 1.3 d = 2 threshold mismatch');
  for (let n = 48836; n <= 200000; n += 997) if (!cond(n)) throw new Error('Theorem 1.3 condition not monotone');
  return { small: SMALL, threshold: 48836 };
}
function chart(x0, y0, w, h) {
  const NMAX = 1e4, YMAX = 1.15, N0 = 20;
  const LX = Math.log(NMAX / 2);
  const sx = n => x0 + Math.log(n / 2) / LX * w, sy = v => y0 + h - v / YMAX * h;
  let s = `<line x1="${x0}" y1="${y0 + h}" x2="${x0 + w}" y2="${y0 + h}" stroke="${dim}" stroke-width="1.2" opacity="0.7"/><line x1="${x0}" y1="${y0}" x2="${x0}" y2="${y0 + h}" stroke="${dim}" stroke-width="1.2" opacity="0.7"/>`;
  const c = checkHook();
  s += `<line x1="${x0}" y1="${sy(1)}" x2="${x0 + w}" y2="${sy(1)}" stroke="${mint}" stroke-width="1.6" stroke-dasharray="3 5" opacity="0.9"/>`;
  s += text(x0 + w - 4, sy(1) - 8, 'Lieb’s ceiling: average ≤ permanent', 13, mint, 'end');
  const curve = (d, col, label) => {
    const P = []; for (let i = 0; i <= 160; i++) { const n = Math.exp(Math.log(N0) + i / 160 * (Math.log(NMAX) - Math.log(N0))); const v = (d - 1) * Math.log(n) / n; if (v <= YMAX) P.push([sx(n), sy(v)]); }
    const lx = sx(N0), ly = sy((d - 1) * Math.log(N0) / N0);
    return `<path d="${P.map(([x, y], i) => (i ? 'L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1)).join('')}" fill="none" stroke="${col}" stroke-width="2.4" stroke-dasharray="7 5" opacity="0.9"/>` + text(lx - 8, ly + 5, label, 13, col, 'end', 'bold');
  };
  s += curve(4, rose, 'd = 4') + curve(3, hot, 'd = 3') + curve(2, cool, 'd = 2');
  for (const [n, v] of c.small) s += `<circle cx="${sx(n).toFixed(1)}" cy="${sy(v).toFixed(1)}" r="5.5" fill="${ink}" stroke="#111" stroke-width="1"/>`;
  s += text(x0 + 12, sy(0.705189) - 16, 'exact small cases, n = 2 to 6', 12, ink, 'start');
  for (const [n, lab] of [[2, '2'], [10, '10'], [100, '100'], [1000, '1 000'], [1e4, '10 000']]) s += text(sx(n), y0 + h + 18, lab, 12, dim, 'middle');
  s += text(x0 - 8, sy(1) + 4, '1', 12, dim, 'end') + text(x0 - 8, sy(0.5) + 4, '½', 12, dim, 'end') + text(x0 - 8, sy(0) + 4, '0', 12, dim, 'end');
  s += text(x0 + w / 2, y0 + h + 36, 'number of vectors n (log scale); dashed: (d − 1) log n / n at complex rank d', 13, muted, 'middle');
  return s;
};
const draw = () => {
  let s = text(40, 46, 'Every symmetry block averages below the permanent, eventually', 25, ink, 'start', 'normal', SERIF);
  s += text(40, 74, 'Worst average eigenvalue of a non-trivial block ÷ permanent, n vectors in a fixed dimension d (Theorem 1.1)', 15, muted);
  s += chart(70, 100, 580, 220);
  const R = 720;
  s += text(R, 128, 'At every fixed rank d, the averages and', 16, ink, 'start', 'bold');
  s += text(R, 150, 'mean squares of all blocks tend to zero.', 16, ink, 'start', 'bold');
  s += text(R, 184, 'Worst block: the standard one, about', 14, muted);
  s += text(R, 204, '(d − 1) log n / n and (d − 1)(log n)² / n.', 14, muted);
  s += text(R, 238, 'Still true while d log n stays far below √n.', 14, muted);
  s += text(R, 272, 'How large n must be is not computed,', 14, ink);
  s += text(R, 292, 'so no single new size is settled.', 14, ink);
  s += text(40, 384, 'Dots: largest averages in the release’s exact small examples. Dashed curves are asymptotic sizes, not bounds at small n. Unrefereed candidate.', 12, dim);
  return s;
};
const description = 'Banner for a paper on asymptotic permanental dominance at fixed Gram rank. Title: Every symmetry block averages below the permanent, eventually. Subtitle: worst average eigenvalue of a non-trivial block divided by the permanent, for n vectors in a fixed dimension d (Theorem 1.1). Left: a chart against the number of vectors n on a log scale from 2 to 10 000. A dashed green line at 1 is labelled Lieb’s ceiling: average at most the permanent. Three dashed falling curves, labelled d = 2, d = 3 and d = 4, show (d − 1) log n / n at complex rank d. White dots mark the largest averages in the release’s exact small examples for n = 2 to 6, all below 1. Right: at every fixed rank d, the averages and mean squares of all blocks tend to zero. Worst block: the standard one, about (d − 1) log n / n and (d − 1)(log n) squared / n. Still true while d log n stays far below the square root of n. How large n must be is not computed, so no single new size is settled. Footer: dots are the largest averages in the release’s exact small examples; dashed curves are asymptotic sizes, not bounds at small n; unrefereed candidate.';
function frame(inner, background) {
  return bannerSvg({ inner, description, background, glow: { color: '#9fd3ff', cx: '0.3', cy: '0.55', r: '0.4', opacity: '0.06' } });
}
const thumbSpec = {
  kicker: ['RESEARCH RELEASE · NOVEMBER 2026', 'MATRIX ANALYSIS · PERMANENTS'],
  head: ['Every block averages', '<em>below the permanent</em>'], headSize: 52,
  sub: 'At fixed rank, Lieb’s and Lavi’s permanent inequalities hold once the matrix is large enough.',
  tag: 'UNREFEREED CANDIDATE',
  hero: '<div class="eq-label">worst block average ÷ permanent</div><div class="hero-title">(d − 1) log n / n</div><div class="note">at complex rank d, tending to zero<br>conjectured ceiling: 1</div><div class="eq-foot">eventually, at every fixed rank</div>'
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
