'use strict';
const { bannerSvg } = require('./svg-xml');
// Prefix balancing with signs and coordinate permutations (signed-permutation-prefix-balancing): banner, OG, thumbnail.
// "This image helps the reader understand" the five-vector obstruction in dimension four (Theorem 3.1, eq. (3)): the five
// input lists, and one best-possible sequence of running totals (the play of the proof: v2 upwards, v3 protecting the
// coordinate at 3/2, v4 upwards) whose last step must put some coordinate at 5/2; together with 3 - 2/4 = 5/2 this is
// Corollary 4.3. checkHook recomputes exactly (half units, all signs and all permutations, states up to permutation) that
// every play reaches 5/2, that 5/2 can be achieved (minimax exactly 5/2), that the final sum alone can be kept to 3/2
// (Remark 2.3), and that the drawn play is legal. Reference: ap4-ramsey-diameter-36 (exact object with labels).
// Usage: node tools/vbal-art.js [--render OUTDIR_FOR_INSPECTION] [--no-mirror]
const SLUG = 'signed-permutation-prefix-balancing';
const ink = '#f6f2ea', muted = '#e2e7ea', dim = '#bcc8cf', hot = '#ff8a7a';
const SANS = 'Arial,Helvetica,sans-serif', SERIF = 'Georgia,serif';
const text = (x, y, s, size = 18, color = ink, anchor = 'start', weight = 'normal', family = SANS, style = 'normal') =>
  `<text class="og-hide" x="${x}" y="${y}" fill="${color}" font-family="${family}" font-size="${size}" font-weight="${weight}" font-style="${style}" text-anchor="${anchor}">${s}</text>`;

// ---- exact check, half units ----
const V = [[-2, -2, -2, 2], [1, 1, 1, 1], [-2, -2, 2, 2], [2, 2, 2, 2], [-2, -2, 2, 2]];
function perms(a) { if (a.length <= 1) return [a.slice()]; const out = []; a.forEach((x, i) => perms(a.slice(0, i).concat(a.slice(i + 1))).forEach(p => out.push([x, ...p]))); return out; }
const key = s => s.slice().sort((x, y) => x - y).join(',');
function successors(s, v) { const out = new Map(); for (const e of [1, -1]) for (const p of perms(v)) { const z = s.map((x, i) => x + e * p[i]); out.set(key(z), z.slice().sort((x, y) => x - y)); } return [...out.values()]; }
function minimax() { // least B such that some play keeps every prefix within B (half units)
  for (let B = 0; B <= 10; B++) { let S = [[0, 0, 0, 0]]; for (const v of V) { const m = new Map(); for (const s of S) for (const z of successors(s, v)) if (Math.max(...z.map(Math.abs)) <= B) m.set(key(z), z); S = [...m.values()]; } if (S.length) return B; } return null;
}
function finalMin() { let S = new Map([['0,0,0,0', [0, 0, 0, 0]]]); for (const v of V) { const m = new Map(); for (const s of S.values()) for (const z of successors(s, v)) m.set(key(z), z); S = m; } return Math.min(...[...S.values()].map(z => Math.max(...z.map(Math.abs)))); }
// The drawn play (sorted states, half units) and its last step.
const PLAY = [[-2, -2, -2, 2], [-1, -1, -1, 3], [-3, 1, 1, 1], [-1, 3, 3, 3], [1, 1, 1, 5]];
function checkHook() {
  if (minimax() !== 5) throw new Error('minimax is not 5/2');
  if (finalMin() !== 3) throw new Error('final-sum minimum is not 3/2');
  let s = [0, 0, 0, 0];
  PLAY.forEach((t, i) => { if (!successors(s, V[i]).some(z => key(z) === key(t))) throw new Error('illegal drawn step ' + (i + 1)); s = t; });
  if (Math.max(...PLAY.slice(0, 4).flat().map(Math.abs)) !== 3) throw new Error('first four prefixes must stay at 3/2');
  if (3 * 4 - 2 !== 10 || 10 / 4 !== 2.5) throw new Error('3 - 2/4');
}

// ---- drawing ----
const frac = h => { const sgn = h < 0 ? '−' : ''; const a = Math.abs(h); return a === 0 ? '0' : a % 2 === 0 ? sgn + (a / 2) : sgn + a + '/2'; };
function cell(x, y, h, w = 46, H = 30, label = null) {
  const a = Math.min(Math.abs(h) / 5, 1), col = h >= 5 ? hot : h > 0 ? `rgba(255,190,120,${0.18 + 0.55 * a})` : h < 0 ? `rgba(150,200,255,${0.18 + 0.55 * a})` : 'rgba(255,255,255,0.08)';
  return `<rect x="${x}" y="${y}" width="${w - 4}" height="${H}" rx="4" fill="${col}"/>` + text(x + (w - 4) / 2, y + H / 2 + 6, label || frac(h), 15, h >= 5 ? '#2a0f0b' : ink, 'middle', h >= 5 ? 'bold' : 'normal');
}
function lists() {
  const x0 = 60, y0 = 128; let s = text(40, 116, 'The five lists (n = 4)', 15, muted, 'start', 'bold');
  V.forEach((v, i) => { const y = y0 + i * 44; s += text(40, y + 21, 'v' + (i + 1), 14, dim, 'start', 'normal', SERIF, 'italic'); v.forEach((h, j) => { s += cell(x0 + 10 + j * 46, y, h); }); });
  s += text(40, 372, 'flip each list and shuffle it, but keep the order', 13, dim, 'start', 'normal', SERIF, 'italic');
  return s;
}
function totals() {
  const x0 = 360, y0 = 128; let s = text(330, 116, 'Best possible running totals', 15, muted, 'start', 'bold');
  PLAY.forEach((t, i) => { const y = y0 + i * 44; s += text(330, y + 21, 's' + (i + 1), 14, dim, 'start', 'normal', SERIF, 'italic'); t.forEach((h, j) => { s += cell(x0 + 10 + j * 46, y, h); }); });
  s += `<path d="M ${x0 + 10 + 3 * 46 + 46} ${y0 + 4 * 44 + 15} L 590 ${y0 + 4 * 44 + 15}" stroke="${hot}" stroke-width="2" fill="none"/>`;
  s += text(596, y0 + 4 * 44 + 20, 'some entry hits 5/2', 14, hot, 'start', 'bold');
  s += text(330, 372, 'every choice of flips and shuffles reaches 5/2', 13, dim, 'start', 'normal', SERIF, 'italic');
  return s;
}
function verdict() {
  const x0 = 790; let s = '';
  s += text(x0, 116, 'So in dimension four the answer is exact', 15, muted, 'start', 'bold');
  s += text(x0, 156, '5/2  ≤  best constant  ≤  3 − 2/4  =  5/2', 18, ink, 'start', 'bold');
  s += text(x0, 180, 'upper bound: Niles-Weed, Sadovsky, Shkrob (2026)', 13, dim);
  s += text(x0, 224, 'Choosing on the fly:', 15, muted, 'start', 'bold');
  s += text(x0, 250, 'at least 5/2 in every dimension n ≥ 4', 14, dim);
  s += text(x0, 274, 'above 5/2 for every n ≥ 8', 14, dim);
  s += text(x0, 298, 'at least 161/64 for every n ≥ 52', 14, dim);
  s += text(x0, 340, 'open: beating 5/2 with the whole stream known', 13, dim, 'start', 'normal', SERIF, 'italic');
  return s;
}
const draw = () =>
  text(40, 50, 'Flip and shuffle: five lists force 5/2', 26, ink, 'start', 'normal', SERIF) +
  text(40, 80, 'Running totals of lists in [−1, 1]⁴, each list sign-flipped and shuffled: in four dimensions 5/2 is exactly the answer', 15, muted) +
  lists() + totals() + verdict();
const description = 'Banner for a paper on balancing running totals with sign flips and coordinate shuffles. Title: Flip and shuffle: five lists force 5/2. Left: the five lists in dimension four, (−1,−1,−1,1), (1/2,1/2,1/2,1/2), (−1,−1,1,1), (1,1,1,1), (−1,−1,1,1); caption: flip each list and shuffle it, but keep the order. Middle: a best possible sequence of running totals, s1 = (−1,−1,−1,1), s2 = (−1/2,−1/2,−1/2,3/2), s3 = (−3/2,1/2,1/2,1/2), s4 = (−1/2,3/2,3/2,3/2), s5 = (1/2,1/2,1/2,5/2), with the entry 5/2 highlighted; caption: every choice of flips and shuffles reaches 5/2. Right: 5/2 ≤ best constant ≤ 3 − 2/4 = 5/2, upper bound by Niles-Weed, Sadovsky and Shkrob (2026); choosing on the fly: at least 5/2 in every dimension n ≥ 4, above 5/2 for every n ≥ 8, at least 161/64 for every n ≥ 52; open: beating 5/2 with the whole stream known.';
function frame(inner, background) {
  return bannerSvg({ inner, description, background, glow: { color: '#ffbe78', cx: '0.45', cy: '0.6', r: '0.4', opacity: '0.06' } });
}
const thumbSpec = {
  kicker: ['RESEARCH RELEASE · NOVEMBER 2026', 'DISCREPANCY'],
  head: ['Flip and shuffle.', 'Five lists force <em>5/2</em>.'], headSize: 56,
  sub: 'Lists of numbers in [−1, 1] may be sign-flipped and shuffled before adding: in four dimensions the best balancing constant is exactly 5/2.',
  tag: 'UNREFEREED CANDIDATE',
  hero: '<div class="eq-label">dimension four</div><div class="hero-title">5/2</div><div class="note">five fixed lists force it<br>3 − 2/4 = 5/2 suffices<br>on the fly: above 5/2 from n = 8</div><div class="eq-foot">exact counting proof</div>'
};
module.exports = { draw, description, thumbSpec, minimax };
if (require.main === module) (async () => {
  const fs = require('fs'), pth = require('path'), os = require('os'), vm = require('vm');
  const ROOT = pth.join(__dirname, '..');
  checkHook();
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
