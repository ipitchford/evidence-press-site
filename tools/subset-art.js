'use strict';
const { bannerSvg } = require('./svg-xml');
// Fixed-size subset sums (subset-sum-support-entropy-tails): banner, OG, thumbnail.
// "This image helps the reader understand" Theorem 1.1 in one concrete case: for n = 11 numbers adding up to zero and
// k = 5 picks, at least 2*C(9,4) = 252 of the C(11,5) = 462 picks have a nonzero sum, and only (1,-1,0,...,0) gets that
// low; bars compare it with other zero-sum lists. The three results of the paper are stated beside it.
// checkHook recomputes exactly: every bar count by enumerating all 462 picks, and, over ALL zero-sum lists of length 11
// with entries in {-2,...,2} (not all zero), that the minimum number of nonzero sums is 252 = 2*C(9,4), attained only by
// (1,-1,0,...,0) up to scaling and reordering. It refuses to draw on mismatch. Other numbers are copied from
// Theorems 1.3 and 1.5 of the paper. Reference: ap4-ramsey-diameter-36 (exact object with labels).
// Usage: node tools/subset-art.js [--render OUTDIR_FOR_INSPECTION] [--no-mirror]
const SLUG = 'subset-sum-support-entropy-tails';
const ink = '#f6f2ea', muted = '#e2e7ea', dim = '#bcc8cf', hot = '#ffb36b';
const SANS = 'Arial,Helvetica,sans-serif', SERIF = 'Georgia,serif';
const text = (x, y, s, size = 18, color = ink, anchor = 'start', weight = 'normal', family = SANS, style = 'normal') => {
  if (/[<&]/.test(s.replace(/<\/?tspan[^>]*>/g, ''))) throw new Error('unescaped < or & in SVG text: ' + s);
  return `<text class="og-hide" x="${x}" y="${y}" fill="${color}" font-family="${family}" font-size="${size}" font-weight="${weight}" font-style="${style}" text-anchor="${anchor}">${s}</text>`;
};

// ---- exact check ----
const N = 11, K = 5;
const binom = (n, k) => { if (k < 0 || k > n) return 0; let r = 1; for (let i = 1; i <= k; i++) r = r * (n - k + i) / i; return Math.round(r); };
const PICKS = (() => { const out = []; const rec = (s, a) => { if (a.length === K) { out.push(a.slice()); return; } for (let i = s; i < N; i++) { a.push(i); rec(i + 1, a); a.pop(); } }; rec(0, []); return out; })();
const nonzero = v => PICKS.reduce((c, p) => c + (p.reduce((t, i) => t + v[i], 0) !== 0 ? 1 : 0), 0);
const rep = (x, m) => Array(m).fill(x);
const BARS = [
  { label: '(1, −1, 0, …, 0)', v: [1, -1, ...rep(0, 9)], hot: true },
  { label: '(1, 1, −1, −1, 0, …, 0)', v: [1, 1, -1, -1, ...rep(0, 7)] },
  { label: '(2, −1, −1, 0, …, 0)', v: [2, -1, -1, ...rep(0, 8)] },
  { label: '(1, 1, 1, −1, −1, −1, 0, …, 0)', v: [1, 1, 1, -1, -1, -1, ...rep(0, 5)] },
  { label: '(10, −1, −1, …, −1)', v: [10, ...rep(-1, 10)] }
];
function normal(v) { // projective normal form: divide by gcd, fix sign, sort
  const g = v.reduce((a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; }, 0);
  let w = v.map(x => x / g); const first = w.find(x => x !== 0); if (first < 0) w = w.map(x => -x);
  return w.slice().sort((a, b) => a - b).join(',');
}
function checkHook() {
  if (PICKS.length !== binom(11, 5) || PICKS.length !== 462) throw new Error('pick count');
  if (2 * binom(9, 4) !== 252) throw new Error('2*C(9,4)');
  for (const b of BARS) { if (b.v.length !== N || b.v.reduce((s, x) => s + x, 0) !== 0) throw new Error('bar list not zero-sum'); b.count = nonzero(b.v); }
  if (BARS[0].count !== 252) throw new Error('D does not give 252');
  if (!BARS.slice(1).every(b => b.count > 252)) throw new Error('a drawn competitor is not worse than D');
  // Exhaustive: all nondecreasing zero-sum vectors of length 11 over {-2..2}, not all zero.
  let min = Infinity, argmins = new Set(), lists = 0;
  const rec = (start, a) => {
    if (a.length === N) { if (a.some(x => x) && a.reduce((s, x) => s + x, 0) === 0) { lists++; const c = nonzero(a); if (c < min) { min = c; argmins = new Set([normal(a)]); } else if (c === min) argmins.add(normal(a)); } return; }
    for (let x = start; x <= 2; x++) { a.push(x); rec(x, a); a.pop(); }
  };
  rec(-2, []);
  if (min !== 252 || argmins.size !== 1 || !argmins.has(normal(BARS[0].v))) throw new Error(`exhaustive minimum ${min}, minimisers ${[...argmins]}`);
  return { lists, min };
}

// ---- drawing ----
function bars() {
  const x0 = 40, y0 = 132, W = 470, H = 30, gap = 14; let s = text(x0, 116, '11 numbers adding to zero, 5 picked at random: how many of the 462 picks give a nonzero sum?', 14, muted, 'start', 'bold');
  BARS.forEach((b, i) => {
    const y = y0 + i * (H + gap), w = Math.round(W * b.count / 462);
    s += `<rect x="${x0 + 250}" y="${y}" width="${W}" height="${H}" rx="4" fill="rgba(255,255,255,0.06)"/>`;
    s += `<rect x="${x0 + 250}" y="${y}" width="${w}" height="${H}" rx="4" fill="${b.hot ? hot : 'rgba(150,200,255,0.45)'}"/>`;
    s += text(x0 + 240, y + 21, b.label, 15, b.hot ? hot : ink, 'end', b.hot ? 'bold' : 'normal');
    s += text(x0 + 250 + w - 8, y + 21, String(b.count), 15, b.hot ? '#2a160a' : ink, 'end', 'bold');
  });
  s += text(x0 + 250, y0 + 5 * (H + gap) + 8, 'fewest possible: 252 = 2 · C(9, 4), and only (1, −1, 0, …, 0) gets there', 14, hot, 'start', 'bold', SERIF, 'italic');
  return s;
}
function verdict() {
  const x0 = 800; let s = '';
  s += text(x0, 116, 'Three ways a random sum can be concentrated', 15, muted, 'start', 'bold');
  s += text(x0, 150, 'Zero: at least 2 · C(n − 2, k − 1) nonzero sums', 15, ink, 'start', 'bold');
  s += text(x0, 172, 'for k ≥ 5, n ≥ 2k + 1 (conjectured 2018, now proved)', 13, dim);
  s += text(x0, 210, 'Entropy: one outlier is most predictable,', 15, ink, 'start', 'bold');
  s += text(x0, 232, 'except at n = 2k, where two outliers win', 13, dim);
  s += text(x0, 252, 'above an explicit Rényi order αₖ (α₂ = 2)', 13, dim);
  s += text(x0, 290, 'Tails: P(sum ≥ mean) ≥ k/n for two-valued', 15, ink, 'start', 'bold');
  s += text(x0, 312, 'lists from n = 4k (previously from 8k)', 13, dim);
  s += text(x0, 352, 'does not prove the Manickam–Miklós–Singhi conjecture', 13, dim, 'start', 'normal', SERIF, 'italic');
  return s;
}
const draw = () =>
  text(40, 50, 'Pick 5 of 11 numbers that add to zero: at least 252 of 462 sums are nonzero', 25, ink, 'start', 'normal', SERIF) +
  text(40, 80, 'Fixed-size subset sums: the sharp minimum, proved for every n and k, with entropy and tail bounds for sampling without replacement', 15, muted) +
  bars() + verdict();
const description = 'Banner for a paper on fixed-size subset sums. Title: Pick 5 of 11 numbers that add to zero: at least 252 of 462 sums are nonzero. Left: horizontal bars for five zero-sum lists of eleven numbers, showing how many of the 462 five-element picks have a nonzero sum: (1, −1, 0, …, 0) gives 252, highlighted; (1, 1, −1, −1, 0, …, 0), (2, −1, −1, 0, …, 0), (1, 1, 1, −1, −1, −1, 0, …, 0) and (10, −1, …, −1) give more; caption: fewest possible: 252 = 2 · C(9, 4), and only (1, −1, 0, …, 0) gets there. Right: three results. Zero: at least 2 · C(n − 2, k − 1) nonzero sums for k ≥ 5 and n ≥ 2k + 1, conjectured in 2018 and now proved. Entropy: one outlier is most predictable, except at n = 2k, where two outliers win above Rényi order α_k, with α_2 = 2. Tails: P(sum ≥ mean) ≥ k/n for two-valued lists from n = 4k, previously from 8k. Note: this does not prove the Manickam–Miklós–Singhi conjecture.';
function frame(inner, background) {
  return bannerSvg({ inner, description, background, glow: { color: '#ffb36b', cx: '0.3', cy: '0.6', r: '0.4', opacity: '0.06' } });
}
const thumbSpec = {
  kicker: ['RESEARCH RELEASE · NOVEMBER 2026', 'COMBINATORICS'],
  head: ['11 numbers add to zero.', 'Pick 5: at least <em>252</em> of the 462 sums are nonzero.'], headSize: 50,
  sub: 'Only (1, −1, 0, …, 0) gets that low: a 2018 conjecture on Johnson graphs, now proved for every n and k.',
  tag: 'UNREFEREED CANDIDATE',
  hero: '<div class="eq-label">fewest nonzero sums</div><div class="hero-title">2·C(n−2, k−1)</div><div class="note">for k ≥ 5 and n ≥ 2k + 1<br>exact entropy minimum too<br>tail bound from n = 4k</div><div class="eq-foot">written proofs</div>'
};
module.exports = { draw, description, thumbSpec, checkHook };
if (require.main === module) (async () => {
  const fs = require('fs'), pth = require('path'), os = require('os'), vm = require('vm');
  const ROOT = pth.join(__dirname, '..');
  const chk = checkHook();
  console.log(`check: ${chk.lists} zero-sum lists of length 11 over {-2..2}; minimum ${chk.min}, only (1,-1,0,...,0); bars ${BARS.map(b => b.count).join(', ')}`);
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
