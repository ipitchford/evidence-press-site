'use strict';
const { bannerSvg } = require('./svg-xml');
// Even-order Steiner distance hyperdeterminants (steiner-hyperdeterminant-even-order-vanishing): banner, OG, thumbnail.
// "This image helps the reader understand" that at order six the hyperdeterminant of a tree vanishes once the tree has
// 350 links, because one real number per link, taken from the list 31/32, (-9 + 5 sqrt 5)/2, (-9 - 5 sqrt 5)/2, can add
// up to exactly zero: 288 links on the first value and 31 on each of the others (Theorem 3.1; results/verify-output.txt
// "Sixth-order primitive multiplicities: 288,31,31. Period: 350."). The star K_{1,350} (351 vertices) is drawn with its
// leaves in those three groups, beside the cancelling sum and the even orders where the published theorem holds or fails
// (Theorem 1.1(1); least failing vertex counts 351, 6805, 684 at k = 6, 10, 16).
// checkHook recomputes the three branch values c_5(z) = 1 - (1 + z)^(-5) from fifth roots of unity, checks them against the
// closed forms, checks that 288, 31, 31 is the least positive solution, re-derives the holds/fails list from the rule
// "d = k - 1 is 1 or a prime congruent to 3 mod 4", and refuses to draw on any mismatch.
// Reference: txgraffiti-order48-successor (an exact counterexample graph with an immediately readable number).
// Usage: node tools/steiner-hyperdeterminant-art.js [--render OUTDIR_FOR_INSPECTION] [--no-mirror]
const SLUG = 'steiner-hyperdeterminant-even-order-vanishing';
const ink = '#f6f2ea', muted = '#e6e1ea', dim = '#c9c2cf', cool = '#9fd3ff', hot = '#ffc36b', rose = '#f2a7b5', ok = '#a8e0b0';
const SANS = 'Arial,Helvetica,sans-serif', SERIF = 'Georgia,serif';
const text = (x, y, s, size = 18, color = ink, anchor = 'start', weight = 'normal', family = SANS, style = 'normal') => {
  if (/<|&(?!(lt|gt|amp|minus|#\d+);)/.test(s.replace(/<\/?tspan[^>]*>/g, ''))) throw new Error('unescaped < or & in SVG text: ' + s);
  return `<text class="og-hide" x="${x}" y="${y}" fill="${color}" font-family="${family}" font-size="${size}" font-weight="${weight}" font-style="${style}" text-anchor="${anchor}">${s}</text>`;
};
// Released values (results/verify-output.txt of the release; Theorems 1.1 and 3.1).
const RELEASED = { multiplicities: '288,31,31', period: 350, holds: [2, 4, 8, 12, 20, 24], fails: [6, 10, 14, 16, 18, 22], least: { 6: 351, 10: 6805, 16: 684 } };
const cpow = ([a, b], n) => { let r = [1, 0]; for (let i = 0; i < n; i++) r = [r[0] * a - r[1] * b, r[0] * b + r[1] * a]; return r; };
const cinv = ([a, b]) => { const q = a * a + b * b; return [a / q, -b / q]; };
const c5 = j => { const z = [Math.cos(2 * Math.PI * j / 5), Math.sin(2 * Math.PI * j / 5)]; const w = cinv(cpow([1 + z[0], z[1]], 5)); return [1 - w[0], -w[1]]; };
const isPrime = n => { if (n < 2) return false; for (let p = 2; p * p <= n; p++) if (n % p === 0) return false; return true; };
const gcd = (a, b) => b ? gcd(b, a % b) : a;
function checkHook() {
  const s5 = Math.sqrt(5), vals = [31 / 32, (-9 + 5 * s5) / 2, (-9 - 5 * s5) / 2];
  const got = [c5(0), c5(1), c5(2)];
  got.forEach(([re, im], i) => { if (Math.abs(re - vals[i]) > 1e-12 || Math.abs(im) > 1e-12) throw new Error('branch value mismatch ' + i); });
  if (Math.abs(c5(4)[0] - vals[1]) > 1e-12 || Math.abs(c5(3)[0] - vals[2]) > 1e-12) throw new Error('conjugate classes differ');
  const [a, b, c] = RELEASED.multiplicities.split(',').map(Number);
  if (a + b + c !== RELEASED.period || b !== c) throw new Error('multiplicities do not give the period');
  if (a * 31 !== 32 * 9 * b) throw new Error('rational parts do not cancel');                         // 31a/32 = 9b
  if (Math.abs(a * vals[0] + b * vals[1] + c * vals[2]) > 1e-9) throw new Error('sum is not zero');
  for (let t = 1; t < b; t++) if ((32 * 9 * t) % 31 === 0) throw new Error('smaller solution exists');
  if (gcd(31, 288) !== 1 || RELEASED.period + 1 !== RELEASED.least[6]) throw new Error('least counterexample mismatch');
  for (let k = 2; k <= 24; k += 2) {
    const d = k - 1, holds = d === 1 || (isPrime(d) && d % 4 === 3);
    if (holds !== RELEASED.holds.includes(k) || holds === RELEASED.fails.includes(k)) throw new Error('order classification mismatch at k = ' + k);
  }
  return { vals, mult: [a, b, c] };
}
function star(cx, cy, R, mult) {
  const n = mult[0] + mult[1] + mult[2], cols = [cool, hot, rose];
  let s = '', i = 0;
  const start = -Math.PI / 2 + 2 * Math.PI * (mult[1] + mult[2]) / n / 2 + Math.PI / n;
  for (let g = 0; g < 3; g++) for (let j = 0; j < mult[g]; j++, i++) {
    const t = start + 2 * Math.PI * i / n, x = cx + R * Math.cos(t), y = cy + R * Math.sin(t);
    s += `<line x1="${cx}" y1="${cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" stroke="${cols[g]}" stroke-width="${g ? 1.1 : 0.7}" opacity="${g ? 0.9 : 0.55}"/>`;
    s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${g ? 2.1 : 1.5}" fill="${cols[g]}"/>`;
  }
  s += `<circle cx="${cx}" cy="${cy}" r="7" fill="${ink}" stroke="#111" stroke-width="1"/>`;
  const at = (k, r) => { const t = start + 2 * Math.PI * k / n; return [cx + r * Math.cos(t), cy + r * Math.sin(t)]; };
  const [x2, y2] = at(mult[0] + mult[1] / 2, R + 18), [x3, y3] = at(mult[0] + mult[1] + mult[2] / 2, R + 18);
  s += text(cx - R - 10, cy + 5, '288', 14, cool, 'end', 'bold');
  s += text((x2 + 4).toFixed(0), (y2 + 2).toFixed(0), '31', 14, hot, 'start', 'bold');
  s += text((x3 - 4).toFixed(0), (y3 + 2).toFixed(0), '31', 14, rose, 'end', 'bold');
  return s;
}
const draw = () => {
  const c = checkHook();
  let s = text(40, 46, 'Order six: zero for every tree with 350 edges', 26, ink, 'start', 'normal', SERIF);
  s += text(40, 74, 'The published even-order theorem fails; the first counterexample is any tree on 351 vertices (Theorem 3.1)', 15, muted);
  s += star(215, 232, 118, c.mult);
  s += text(215, 386, 'the star with 350 leaves', 13, dim, 'middle', 'normal', SANS, 'italic');
  const X = 420;
  s += text(X, 128, 'One number per link, from a list of three:', 15, ink, 'start', 'bold');
  s += text(X, 162, '288 × 31/32', 19, cool, 'start', 'bold');
  s += text(X + 210, 162, '=  279', 19, cool);
  s += text(X, 194, '31 × (−9 + 5√5)/2', 19, hot, 'start', 'bold');
  s += text(X, 222, '31 × (−9 − 5√5)/2', 19, rose, 'start', 'bold');
  s += `<path d="M${X + 192} 180 q8 0 8 12 v8 q0 8 8 8 q-8 0 -8 8 v8 q0 12 -8 12" fill="none" stroke="${muted}" stroke-width="1.4"/>`;
  s += text(X + 210, 214, '= −279', 19, ink);
  s += `<line x1="${X}" y1="238" x2="${X + 300}" y2="238" stroke="${muted}" stroke-width="1"/>`;
  s += text(X, 266, 'sum', 17, muted);
  s += text(X + 210, 266, '=  0', 21, ok, 'start', 'bold');
  s += text(X, 298, '√5 cancels only if the two 31s match;', 13, dim);
  s += text(X, 316, '31 and 288 share no factor, so 350 is the least.', 13, dim);
  const Y = 820;
  s += text(Y, 128, 'Every tree nonzero? By even order k:', 15, ink, 'start', 'bold');
  const ks = [2, 4, 6, 8, 10, 12, 14, 16, 18], step = 38;
  ks.forEach((k, i) => {
    const holds = RELEASED.holds.includes(k), x = Y + 12 + i * step;
    s += `<circle cx="${x}" cy="170" r="14" fill="${holds ? ok : 'none'}" fill-opacity="${holds ? 0.22 : 0}" stroke="${holds ? ok : hot}" stroke-width="1.8"/>`;
    s += text(x, 175, String(k), 13, holds ? ok : hot, 'middle', 'bold');
    if (RELEASED.least[k]) s += text(x, 204, RELEASED.least[k].toLocaleString('en-GB'), 11, hot, 'middle');
  });
  s += text(Y, 230, 'green: theorem holds', 12, ok);
  s += text(Y + 130, 230, 'orange: fails', 12, hot);
  s += text(Y, 248, 'numbers: fewest vertices of a failing tree', 12, dim);
  s += text(Y, 284, 'Holds exactly when k − 1 is 1 or a prime', 13, muted);
  s += text(Y, 302, 'leaving remainder 3 on division by 4.', 13, muted);
  s += text(1160, 386, 'Exact contraction over all 351⁵ terms per vertex type. Symmetric hyperdeterminant. Unrefereed candidate.', 12, dim, 'end');
  return s;
};
const description = 'Banner for a paper on when even-order Steiner distance hyperdeterminants of trees vanish. Title: Order six: zero for every tree with 350 edges. Subtitle: the published even-order theorem fails; the first counterexample is any tree on 351 vertices (Theorem 3.1). Left: the star with 350 leaves, a central hub joined to 350 leaves in three coloured groups: 288 leaves in blue, 31 in orange and 31 in pink. Middle: one number per link, from a list of three. 288 times 31 over 32 equals 279. 31 times (minus 9 plus 5 root 5) over 2 and 31 times (minus 9 minus 5 root 5) over 2 together equal minus 279. The sum is 0. Root 5 cancels only if the two 31s match; 31 and 288 share no factor, so 350 is the least. Right: whether every tree is nonzero, by even order k from 2 to 18. The theorem holds (green) at k = 2, 4, 8 and 12 and fails (orange) at k = 6, 10, 14, 16 and 18; the fewest vertices of a failing tree are 351 at k = 6, 6,805 at k = 10 and 684 at k = 16. It holds exactly when k minus 1 is 1 or a prime leaving remainder 3 on division by 4. Footer: exact contraction over all 351 to the fifth terms per vertex type; symmetric hyperdeterminant; unrefereed candidate.';
function frame(inner, background) {
  return bannerSvg({ inner, description, background, glow: { color: '#9fd3ff', cx: '0.18', cy: '0.6', r: '0.35', opacity: '0.07' } });
}
const thumbSpec = {
  kicker: ['RESEARCH RELEASE · NOVEMBER 2026', 'MATHEMATICS · GRAPHS AND TENSORS'],
  head: ['A 351-vertex counterexample', '<em>to an even-order Graham–Pollak theorem</em>'], headSize: 50,
  sub: 'At order six the Steiner hyperdeterminant of a tree is zero whenever it has a multiple of 350 edges.',
  tag: 'UNREFEREED CANDIDATE',
  hero: '<div class="eq-label">order six, every tree</div><div class="hero-title">350 edges → 0</div><div class="note">288 × 31/32 + 31 × (−9 ± 5√5)/2<br>adds up to zero</div><div class="eq-foot">symmetric hyperdeterminant</div>'
};
module.exports = { draw, description, thumbSpec, checkHook };
if (require.main === module) (async () => {
  const fs = require('fs'), pth = require('path'), os = require('os'), vm = require('vm');
  const ROOT = pth.join(__dirname, '..');
  const ck = checkHook();
  console.log('check: branch values, least multiplicities', ck.mult.join(','), 'and the even-order classification agree with the release');
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
