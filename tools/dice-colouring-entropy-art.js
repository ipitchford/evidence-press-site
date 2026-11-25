'use strict';
const { bannerSvg } = require('./svg-xml');
// Which dice colourings make the number of colours seen most uncertain? (dice-colouring-entropy-hub-designs): banner, OG, thumbnail.
// "This image helps the reader understand" that, to make the number of colours seen as uncertain as possible, one colour
// should be shared by every coin (Theorem A): the star with one repeated coin against the evenly spread cycle, on the same
// 12 colours and 12 coins, with their exactly computed entropies; plus the dice statement of Theorem B.
// checkHook enumerates all 2^12 orientations of both designs with exact integer counts, computes the law of the number of
// colours hit, checks the star variance against (n-1)/4 - f(t) of Theorem 9.1 (t = 1, f(1) = 1/16; the hub term is
// exponentially small), checks the cycle variance n/16 exactly, and refuses to draw if the star does not have the larger
// entropy. The printed entropies come from this enumeration.
// Reference: txgraffiti-order48-successor (one exact object balanced with immediately readable values).
// Usage: node tools/dice-colouring-entropy-art.js [--render OUTDIR_FOR_INSPECTION] [--no-mirror]
const SLUG = 'dice-colouring-entropy-hub-designs';
const ink = '#f6f2ea', muted = '#e2e7ea', dim = '#c3ccd2', hot = '#ffc36b', cool = '#9fd3ff', rose = '#f2a7b5', mint = '#a8e6c1', grey = '#8f9aa3';
const SANS = 'Arial,Helvetica,sans-serif', SERIF = 'Georgia,serif';
const text = (x, y, s, size = 18, color = ink, anchor = 'start', weight = 'normal', family = SANS, style = 'normal') => {
  if (/<|&(?!(lt|gt|amp|minus|#\d+);)/.test(s.replace(/<\/?tspan[^>]*>/g, ''))) throw new Error('unescaped < or & in SVG text: ' + s);
  return `<text class="og-hide" x="${x}" y="${y}" fill="${color}" font-family="${family}" font-size="${size}" font-weight="${weight}" font-style="${style}" text-anchor="${anchor}">${s}</text>`;
};
const N = 12;
const STAR = [...Array(N - 1)].map((_, i) => [0, i + 1]).concat([[0, 1]]); // hub 0, spokes to 1..11, spoke 0-1 doubled: 12 coins
const CYCLE = [...Array(N)].map((_, i) => [i, (i + 1) % N]); // 12 coins
function law(edges) {
  const m = edges.length, counts = Array(N + 1).fill(0);
  for (let mask = 0; mask < 1 << m; mask++) {
    let hit = 0;
    edges.forEach(([a, b], j) => { hit |= 1 << ((mask >> j) & 1 ? b : a); });
    let k = 0; for (let v = 0; v < N; v++) if (hit >> v & 1) k++;
    counts[k]++;
  }
  const tot = 2 ** m;
  if (counts.reduce((a, b) => a + b, 0) !== tot) throw new Error('count total');
  const mean = counts.reduce((s, c, k) => s + c * k, 0) / tot;
  const vr = counts.reduce((s, c, k) => s + c * (k - mean) ** 2, 0) / tot;
  const H = -counts.reduce((s, c) => s + (c ? (c / tot) * Math.log(c / tot) : 0), 0);
  return { counts, mean, variance: vr, H };
}
function checkHook() {
  if (STAR.length !== N || CYCLE.length !== N) throw new Error('coin count');
  const s = law(STAR), c = law(CYCLE);
  const f1 = Math.min(1 / 16, 0.25 * (1 - 0.5) ** 2);
  if (Math.abs(s.variance - ((N - 1) / 4 - f1)) > 1e-2) throw new Error('star variance ' + s.variance);
  if (Math.abs(c.variance - N / 16) > 1e-12) throw new Error('cycle variance ' + c.variance);
  if (!(s.H > c.H)) throw new Error('star does not beat cycle');
  return { n: N, coins: N, starH: +s.H.toFixed(3), cycleH: +c.H.toFixed(3), starVar: +s.variance.toFixed(4), cycleVar: c.variance };
}
function star(cx, cy) {
  const R = 104; let s = '';
  for (let i = 1; i < N; i++) {
    const a = -Math.PI / 2 + (i - 1) * 2 * Math.PI / (N - 1);
    const x = (cx + R * Math.cos(a)).toFixed(1), y = (cy + R * Math.sin(a)).toFixed(1);
    s += `<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="${i === 1 ? hot : muted}" stroke-width="${i === 1 ? 7 : 2.2}" stroke-linecap="round" opacity="${i === 1 ? 1 : 0.85}"/>`;
    s += `<circle cx="${x}" cy="${y}" r="9" fill="${cool}" stroke="#111" stroke-width="1.2"/>`;
  }
  s += `<circle cx="${cx}" cy="${cy}" r="17" fill="${hot}" stroke="#111" stroke-width="1.4"/>`;
  s += text(cx + 12, cy - R - 2, 'repeated coin', 13, hot, 'start', 'bold');
  s += text(cx, cy + R + 30, 'shared colour on every coin', 13, hot, 'middle', 'bold');
  return s;
}
function cycle(cx, cy) {
  const R = 52; let s = '', pts = [];
  for (let i = 0; i < N; i++) { const a = -Math.PI / 2 + i * 2 * Math.PI / N; pts.push([(cx + R * Math.cos(a)).toFixed(1), (cy + R * Math.sin(a)).toFixed(1)]); }
  s += `<polygon points="${pts.map(p => p.join(',')).join(' ')}" fill="none" stroke="${dim}" stroke-width="2"/>`;
  for (const [x, y] of pts) s += `<circle cx="${x}" cy="${y}" r="5.5" fill="${grey}" stroke="#111" stroke-width="1"/>`;
  s += text(cx, cy + R + 26, 'evenly spread: a cycle', 13, dim, 'middle');
  return s;
}
const draw = () => {
  const c = checkHook();
  let s = text(40, 46, 'Most uncertain colour count: share one colour on every coin', 27, ink, 'start', 'normal', SERIF);
  s += text(40, 74, 'Paint coins with colours, toss them all, count the colours that show. Which painting makes that count hardest to predict?', 15, muted);
  s += star(200, 218);
  s += cycle(445, 232);
  const X = 580;
  s += text(X, 136, `Same ${c.n} colours, ${c.coins} coins. Uncertainty of the count (exact):`, 15, ink, 'start', 'bold');
  s += text(X, 170, `star  ${c.starH.toFixed(3)} nats`, 22, hot, 'start', 'bold', SERIF);
  s += text(X + 230, 170, `cycle  ${c.cycleH.toFixed(3)} nats`, 22, dim, 'start', 'bold', SERIF);
  s += text(X, 212, 'Coins: for every large enough palette the star is the unique best design;', 14, mint, 'start', 'bold');
  s += text(X, 231, 'extra coins repeat up to three pairs, or one pair four or more times.', 14, mint);
  s += text(X, 266, 'Dice with any number of faces: hub designs beat every evenly', 14, cool, 'start', 'bold');
  s += text(X, 285, 'spread design by at least ½ log 1.5 nats once there are many colours.', 14, cool);
  s += text(X, 320, 'The threshold palette is not explicit (at least ten).', 13, rose);
  s += text(40, 384, 'Left: the star design, one shared colour (gold) paired with every other colour, one coin repeated; middle: the cycle Pelekis conjectured optimal. Unrefereed candidate.', 12, dim);
  return s;
};
const description = 'Banner for a paper on which dice colourings make the number of colours seen most uncertain. Title: most uncertain colour count: share one colour on every coin. Subtitle: paint coins with colours, toss them all, count the colours that show; which painting makes that count hardest to predict? Left: a star diagram, a gold hub colour joined to eleven blue colours by coins, with one spoke drawn thick and labelled repeated coin, captioned shared colour on every coin. Middle: twelve grey colours joined in a cycle, captioned evenly spread: a cycle. Right: same 12 colours, 12 coins; uncertainty of the count, computed exactly: star 1.912 nats, cycle 1.274 nats. Coins: for every large enough palette the star is the unique best design; extra coins repeat up to three pairs, or one pair four or more times. Dice with any number of faces: hub designs beat every evenly spread design by at least one half log 1.5 nats once there are many colours. The threshold palette is not explicit (at least ten). Footer: left, the star design, one shared colour paired with every other colour, one coin repeated; middle, the cycle Pelekis conjectured optimal; unrefereed candidate.';
function frame(inner, background) {
  const c = checkHook();
  for (const t of [description, thumbSpec.hero]) if (!t.includes(c.starH.toFixed(3)) || !t.includes(c.cycleH.toFixed(3))) throw new Error('stated entropies differ from the enumeration');
  return bannerSvg({ inner, description, background, glow: { color: '#ffc36b', cx: '0.2', cy: '0.55', r: '0.35', opacity: '0.07' } });
}
const thumbSpec = {
  kicker: ['RESEARCH RELEASE · NOVEMBER 2026', 'PROBABILITY · INFORMATION'],
  head: ['Most uncertain', '<em>colour count</em>?'], headSize: 56,
  sub: 'Share one colour on every coin. For dice, unbalanced hub designs beat every evenly spread one.',
  tag: 'UNREFEREED CANDIDATE',
  hero: '<div class="eq-label">12 colours, 12 coins: entropy of the count</div><div class="hero-title">star &gt; cycle</div><div class="note">1.912 nats against 1.274 nats</div><div class="eq-foot">gap for dice: at least ½ log 1.5</div>'
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
