'use strict';
const { bannerSvg } = require('./svg-xml');
// Which central elements are transitive? (transitive-jucys-murphy-images): banner, OG, thumbnail.
// "This image helps the reader understand" that keeping only connected (transitive) products of swaps still reaches
// every central element exactly when (n−1)! is invertible (Theorem 3.2): on the left, a transitive and an intransitive
// word on four letters; in the middle, the n = 3 matrix of Section 3 whose rows are the transitive images μ_α G_α in
// the class-sum basis, with the corner 2 = (3−1)! marking the obstruction where 2 is not invertible.
// checkHook recomputes the matrix before drawing from the five set partitions of three letters (Möbius weight
// (−1)^(k−1)(k−1)! times the number of partitions of type α whose Young subgroup contains the class representative)
// and compares it with the released rows [[2,0,0],[−3,−1,0],[1,1,1]] (results/verification.json checks.E_n3_matrix);
// it also checks that the corner equals (3−1)! and that the determinant is −2. It refuses to draw on mismatch.
// Reference: txgraffiti-order48-successor (one exact object balanced with immediately readable values).
// Usage: node tools/transitive-jm-art.js [--render OUTDIR_FOR_INSPECTION] [--no-mirror]
const SLUG = 'transitive-jucys-murphy-images';
const ink = '#f6f2ea', muted = '#e2e7ea', dim = '#c3ccd2', hot = '#ffc36b', cool = '#9fd3ff', rose = '#f2a7b5', mint = '#a8e6c1', grey = '#8f9aa3';
const SANS = 'Arial,Helvetica,sans-serif', SERIF = 'Georgia,serif';
const text = (x, y, s, size = 18, color = ink, anchor = 'start', weight = 'normal', family = SANS, style = 'normal') => {
  if (/<|&(?!(lt|gt|amp|minus|#\d+);)/.test(s.replace(/<\/?tspan[^>]*>/g, ''))) throw new Error('unescaped < or & in SVG text: ' + s);
  return `<text class="og-hide" x="${x}" y="${y}" fill="${color}" font-family="${family}" font-size="${size}" font-weight="${weight}" font-style="${style}" text-anchor="${anchor}">${s}</text>`;
};
const RELEASED = [[2, 0, 0], [-3, -1, 0], [1, 1, 1]];
function setPartitions(xs) {
  if (!xs.length) return [[]];
  const [h, ...t] = xs, out = [];
  for (const p of setPartitions(t)) {
    out.push([[h], ...p]);
    p.forEach((_, i) => out.push(p.map((b, j) => (j === i ? [h, ...b] : b))));
  }
  return out;
}
function checkHook() {
  const parts = setPartitions([0, 1, 2]);
  if (parts.length !== 5) throw new Error('expected 5 set partitions of three letters');
  const fact = k => (k <= 1 ? 1 : k * fact(k - 1));
  const types = ['1,1,1', '2,1', '3'];
  // class representatives as cycle lists: identity, (0 1), (0 1 2)
  const reps = [[[0], [1], [2]], [[0, 1], [2]], [[0, 1, 2]]];
  const inYoung = (cycles, p) => cycles.every(c => p.some(b => c.every(x => b.includes(x))));
  const M = types.map(t => reps.map(cyc => parts.filter(p => p.map(b => b.length).sort((a, b) => b - a).join(',') === t)
    .reduce((s, p) => s + (inYoung(cyc, p) ? (p.length % 2 ? 1 : -1) * fact(p.length - 1) : 0), 0)));
  if (JSON.stringify(M) !== JSON.stringify(RELEASED)) throw new Error('n = 3 matrix mismatch ' + JSON.stringify(M));
  if (M[0][0] !== fact(3 - 1)) throw new Error('corner is not (3-1)!');
  const det = M[0][0] * (M[1][1] * M[2][2] - M[1][2] * M[2][1]) - M[0][1] * (M[1][0] * M[2][2] - M[1][2] * M[2][0]) + M[0][2] * (M[1][0] * M[2][1] - M[1][1] * M[2][0]);
  if (det !== -2) throw new Error('determinant mismatch ' + det);
  return { matrix: M, corner: M[0][0], det };
}
function words(x0, y0) {
  // Four letters on a square; a transitive word (swaps (1 2), (2 3), (3 4), (1 3)) and an intransitive one ((1 2), (3 4)).
  const pts = (cx, cy) => [[cx - 42, cy - 42], [cx + 42, cy - 42], [cx + 42, cy + 42], [cx - 42, cy + 42]];
  const draw = (cx, cy, edges, col) => {
    const P = pts(cx, cy); let s = '';
    for (const [a, b] of edges) s += `<line x1="${P[a][0]}" y1="${P[a][1]}" x2="${P[b][0]}" y2="${P[b][1]}" stroke="${col}" stroke-width="3" opacity="0.9"/>`;
    P.forEach(([x, y], i) => { s += `<circle cx="${x}" cy="${y}" r="12" fill="${ink}" stroke="#111" stroke-width="1.2"/>` + text(x, y + 5, String(i + 1), 13, '#111', 'middle', 'bold'); });
    return s;
  };
  let s = draw(x0, y0, [[0, 1], [1, 2], [2, 3], [0, 2]], mint);
  s += text(x0, y0 + 74, 'transitive: kept', 14, mint, 'middle', 'bold');
  s += text(x0, y0 + 92, 'swaps link all letters', 12, muted, 'middle');
  s += draw(x0 + 150, y0, [[0, 1], [2, 3]], rose);
  s += text(x0 + 150, y0 + 74, 'not transitive: dropped', 14, rose, 'middle', 'bold');
  s += text(x0 + 150, y0 + 92, 'two separate groups', 12, muted, 'middle');
  return s;
}
function matrix(x0, y0) {
  const c = checkHook();
  const cw = 62, rh = 46;
  let s = text(x0 + 70 + 1.5 * cw, y0 - 50, 'n = 3: transitive images in the class basis', 15, ink, 'middle', 'bold');
  ['K₁₁₁', 'K₂₁', 'K₃'].forEach((h, j) => { s += text(x0 + 70 + cw * j + cw / 2, y0 - 18, h, 15, cool, 'middle', 'bold'); });
  ['α = (1,1,1)', 'α = (2,1)', 'α = (3)'].forEach((h, i) => { s += text(x0 + 58, y0 + rh * i + 30, h, 13, muted, 'end'); });
  s += `<path d="M${x0 + 74} ${y0 - 4} h-8 v${3 * rh + 8} h8 M${x0 + 66 + 3 * cw} ${y0 - 4} h8 v${3 * rh + 8} h-8" fill="none" stroke="${ink}" stroke-width="2"/>`;
  c.matrix.forEach((row, i) => row.forEach((v, j) => {
    const x = x0 + 70 + cw * j + cw / 2, y = y0 + rh * i + 31;
    if (i === 0 && j === 0) s += `<circle cx="${x}" cy="${y - 8}" r="20" fill="none" stroke="${hot}" stroke-width="2.4"/>`;
    s += text(x, y, v < 0 ? '−' + (-v) : String(v), 22, i === 0 && j === 0 ? hot : ink, 'middle', 'bold', SERIF);
  }));
  s += text(x0 + 70 + 1.5 * cw, y0 + 3 * rh + 32, '2 = (3−1)!: over a ring where 2 cannot', 13, hot, 'middle');
  s += text(x0 + 70 + 1.5 * cw, y0 + 3 * rh + 50, 'be divided by, the identity is out of reach', 13, hot, 'middle');
  return s;
}
const draw = () => {
  let s = text(40, 46, 'Every central element is transitive, exactly when (n−1)! is invertible', 25, ink, 'start', 'normal', SERIF);
  s += text(40, 74, 'Keeping only the connected products of swaps in Jucys–Murphy evaluations still reaches the whole centre of the symmetric group algebra', 15, muted);
  s += words(120, 190);
  s += matrix(420, 168);
  const R = 845;
  s += text(R, 140, 'Over ℂ: every central element is', 15, mint, 'start', 'bold');
  s += text(R, 160, 'one transitive image', 15, mint, 'start', 'bold');
  s += text(R, 196, 'Degree 2n−2 suffices,', 15, ink);
  s += text(R, 216, 'and no smaller degree reaches the identity', 15, ink);
  s += text(R, 252, 'Over ℤ: the orbit bound is exact', 15, ink);
  s += text(R, 272, 'for n ≤ 5 and n = 7;', 15, ink);
  s += text(R, 292, 'index 2 at n = 6 (exact computation)', 15, rose);
  s += text(40, 384, 'Left: one transitive and one intransitive word on four letters. Middle: the three transitive images built in Section 3 for n = 3. Unrefereed candidate.', 12, dim);
  return s;
};
const description = 'Banner for a paper on transitive Jucys–Murphy images. Title: Every central element is transitive, exactly when (n minus 1) factorial is invertible. Subtitle: keeping only the connected products of swaps in Jucys–Murphy evaluations still reaches the whole centre of the symmetric group algebra. Left: two drawings of four numbered letters; in the first, green swaps link all four letters, labelled transitive, kept, swaps link all letters; in the second, two pink swaps leave two separate groups, labelled not transitive, dropped. Middle: the n equals 3 matrix of transitive images in the class basis, columns K one one one, K two one and K three, rows for alpha equal to (1,1,1), (2,1) and (3): first row 2, 0, 0; second row minus 3, minus 1, 0; third row 1, 1, 1. The corner 2 is circled, with the note: 2 equals (3 minus 1) factorial; over a ring where 2 cannot be divided by, the identity is out of reach. Right: over the complex numbers every central element is one transitive image; degree 2n minus 2 suffices, and no smaller degree reaches the identity; over the integers the orbit bound is exact for n at most 5 and n equal to 7, with index 2 at n equal to 6, by exact computation. Footer: left, one transitive and one intransitive word on four letters; middle, the three transitive images built in Section 3 for n equals 3; unrefereed candidate.';
function frame(inner, background) {
  return bannerSvg({ inner, description, background, glow: { color: '#ffc36b', cx: '0.42', cy: '0.55', r: '0.4', opacity: '0.06' } });
}
const thumbSpec = {
  kicker: ['RESEARCH RELEASE · NOVEMBER 2026', 'ALGEBRAIC COMBINATORICS'],
  head: ['Every central element', 'is <em>transitive</em>'], headSize: 52,
  sub: 'Connected Jucys–Murphy evaluations fill the symmetric-group centre exactly when (n−1)! is invertible.',
  tag: 'UNREFEREED CANDIDATE',
  hero: '<div class="eq-label">optimal degree</div><div class="hero-title">2n−2</div><div class="note">over ℂ, every central element is<br>one transitive image</div><div class="eq-foot">obstruction: (n−1)! not invertible</div>'
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
