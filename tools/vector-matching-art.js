'use strict';
const { bannerSvg } = require('./svg-xml');
// Linear discrepancy for vector-labelled perfect matchings: banner, OG card and thumbnail.
// "This image helps the reader understand" that the leftover fractional paths are laid end to end on one line and cut all at
// once by one set A with few switches, so that the total cut count is q - 1 + 2d instead of about 2qd, which is what turns the
// O(k^2) matching error into 17k. Source (paper 0.1.0-candidate, 3 Nov 2026): Lemma 5 (q - 1 + 2d switches; separate splitting
// about 2qd, Section 1.3), Lemma 6 and Figure 1 (three alternating paths with 3, 4 and 2 edges laid end to end), Theorem 1 (17k).
// Schematic positions, not data. Usage: node tools/vector-matching-art.js [--render OUTDIR_FOR_INSPECTION] [--no-mirror]
const SLUG = 'vector-matching-linear-discrepancy';
const ink = '#f4f1ea', muted = '#e3d9c9', dim = '#c4b7a2';
const oddC = '#8cc8ff', evenC = '#ffb56b', setC = '#9be3c0', cutC = '#ff8a8a', hitC = '#ffd77a';
const SANS = 'Arial,Helvetica,sans-serif', SERIF = 'Georgia,serif';
const text = (x, y, s, size = 18, color = ink, anchor = 'start', weight = 'normal', family = SANS) =>
  `<text class="og-hide" x="${x}" y="${y}" fill="${color}" font-family="${family}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}">${s}</text>`;
const f = v => (+v).toFixed(1);
const joint = (q, d) => q - 1 + 2 * d, separate = (q, d) => 2 * q * d;
// Left: three alternating paths (3, 4 and 2 edges) laid end to end on one line, as in Figure 1 of the paper.
const EDGES = [3, 4, 2];
const LX0 = 70, LX1 = 650, LY = 250;
const U = (LX1 - LX0) / 9; // one edge = one unit
const LX = u => LX0 + u * U;
// Set A (shaded) as unions of intervals in edge units; its switch points (interior boundaries) are the cuts.
const A = [[0.4, 1.6], [2.5, 4.5], [5.3, 6.6], [7.5, 9.0]];
const SWITCHES = A.flatMap(([a, b]) => [a, b]).filter(u => u > 0 && u < 9 && ![3, 7].includes(u));
function paths() {
  let s = text(LX0, 132, 'Leftover fractional paths, laid end to end on one line', 16, ink, 'start', 'bold', SERIF);
  s += text(LX0, 154, 'edge weights alternate α and 1 − α along each path', 13, dim);
  for (const [a, b] of A) s += `<rect x="${f(LX(a))}" y="${LY - 44}" width="${f(LX(b) - LX(a))}" height="58" fill="${setC}" fill-opacity=".16" stroke="${setC}" stroke-opacity=".5" stroke-width="1"/>`;
  s += text(LX(3.45), LY - 52, 'one set A for all paths', 13, setC, 'start', 'bold');
  let u = 0;
  EDGES.forEach((m, j) => {
    for (let e = 0; e < m; e++) {
      const col = e % 2 === 0 ? oddC : evenC;
      s += `<path d="M${f(LX(u + e) + 3)} ${LY} H${f(LX(u + e + 1) - 3)}" stroke="${col}" stroke-width="7" stroke-linecap="round"/>`;
    }
    for (let e = 0; e <= m; e++) s += `<circle cx="${f(LX(u + e))}" cy="${LY}" r="4.2" fill="${ink}"/>`;
    s += text((LX(u) + LX(u + m)) / 2, LY + 40, `path ${j + 1}: ${m} edges, α${['₁', '₂', '₃'][j]}`, 13, dim, 'middle');
    if (j > 0) s += `<path d="M${f(LX(u))} ${LY - 60} V${LY + 24}" stroke="${muted}" stroke-opacity=".35" stroke-width="1.2"/>`;
    u += m;
  });
  for (const x of SWITCHES) {
    s += `<path d="M${f(LX(x))} ${LY - 50} V${LY + 18}" stroke="${cutC}" stroke-width="2" stroke-dasharray="4 3"/>`;
    s += text(LX(x), LY + 10 - 0, '×', 17, cutC, 'middle', 'bold');
  }
  s += text(LX0, LY + 78, `${SWITCHES.length} switches cut the whole line; each cut edge (×) is deleted, the rest rounds to a matching`, 13, dim, 'start', 'normal', SERIF);
  s += `<path d="M${LX0} 345 h22" stroke="${oddC}" stroke-width="6"/>` + text(LX0 + 30, 350, 'odd edges (weight α)', 12, dim);
  s += `<path d="M${LX0 + 190} 345 h22" stroke="${evenC}" stroke-width="6"/>` + text(LX0 + 220, 350, 'even edges (weight 1 − α)', 12, dim);
  s += text(LX0 + 410, 350, 'schematic', 12, dim, 'start', 'normal', SERIF);
  return s;
}
// Right: the count that matters (Lemma 5 vs splitting each path separately) and the resulting bound (Theorem 1).
const RX0 = 745, BW = 380;
function panel() {
  let s = text(RX0, 128, 'q = 3 paths, d = 4 measures', 16, ink, 'start', 'bold', SERIF);
  const bar = (y, n, col, label) => `<rect x="${RX0}" y="${y}" width="${f(BW * n / 24)}" height="20" rx="3" fill="${col}" fill-opacity=".85"/>` +
    text(RX0 + BW * n / 24 + 10, y + 15, String(n), 16, col, 'start', 'bold') + text(RX0, y - 8, label, 13, dim);
  s += bar(166, separate(3, 4), evenC, 'each path cut separately: about 2qd switches');
  s += bar(222, joint(3, 4), setC, 'all paths cut at once: q − 1 + 2d switches');
  s += `<path d="M${RX0} 270 H${RX0 + BW + 30}" stroke="${muted}" stroke-opacity=".22" stroke-width="1"/>`;
  s += text(RX0, 304, 'matching error ≤ 17k', 26, hitC, 'start', 'bold', SERIF);
  s += text(RX0, 330, 'previously O(k²) · k = number of colours', 14, dim);
  s += text(RX0, 352, 'order k is necessary for arbitrary targets', 13, dim, 'start', 'normal', SERIF);
  return s;
}
const draw = () =>
  text(40, 52, 'Fair pairings: cut every leftover path at once, and the error becomes linear', 26, ink, 'start', 'normal', SERIF) +
  text(40, 80, 'Some perfect matching is within 17k of any fractional target, for labels in any k-dimensional norm', 15, muted) +
  paths() + `<path d="M712 108 L 712 372" stroke="${muted}" stroke-opacity=".22" stroke-width="1.2"/>` + panel();
const description = 'Banner for a paper on balanced perfect matchings. Left: a schematic of three paths with 3, 4 and 2 edges laid end to end on one line; odd edges are blue and even edges orange, standing for the fractional weights alpha and 1 minus alpha. One shaded set A, made of a few intervals, covers parts of all three paths at once; its switch points are marked by red dashed cuts with crosses, and the cut edges are deleted while the rest rounds to a matching. Right: for 3 paths and 4 measures, cutting each path separately needs about 2qd = 24 switches, while cutting all paths at once needs at most q minus 1 plus 2d = 10. Below, in gold: matching error at most 17k, previously order k squared, where k is the number of colours; order k is necessary for arbitrary targets.';
function frame(inner, background) {
  return bannerSvg({ inner, description, background, glow: { color: setC, cx: '0.30', cy: '0.55', r: '0.42', opacity: '0.06' } });
}
const thumbSpec = {
  kicker: ['RESEARCH RELEASE · NOVEMBER 2026', 'COMBINATORICS · BALANCED MATCHINGS'],
  head: ['Fairer pairings:', '<em>error 17k, not k²</em>'], headSize: 70,
  sub: 'Colour the possible pairings with k colours: some complete pairing is within 17k of every fair share. The trick is to cut all leftover paths at once.',
  tag: 'UNREFEREED CANDIDATE',
  hero: '<div class="eq-label">3 paths, 4 measures: switches needed</div><div class="hero-title">24 → 10</div><div class="note">cut separately: about 2qd<br>cut together: q − 1 + 2d<br>error 17k instead of O(k²)</div><div class="eq-foot">written proofs · 2,374,625 exact checks</div>'
};
module.exports = { draw, description, thumbSpec, joint, separate };
if (require.main === module) (async () => {
  const fs = require('fs'), pth = require('path'), os = require('os'), vm = require('vm');
  const ROOT = pth.join(__dirname, '..');
  // Guards: the counts drawn match the paper (Lemma 5: q - 1 + 2d switches jointly; about 2qd when split separately; Theorem 1: 17k).
  if (joint(3, 4) !== 10 || separate(3, 4) !== 24) throw new Error('switch counts mismatch with Lemma 5');
  if (SWITCHES.length > joint(3, 4)) throw new Error('drawing uses more switches than Lemma 5 allows');
  if (EDGES.reduce((a, b) => a + b, 0) !== 9) throw new Error('paths must have 3, 4 and 2 edges as in Figure 1');
  const reg = JSON.parse(fs.readFileSync(pth.join(ROOT, 'data/BANNER_PALETTES.json'), 'utf8'));
  const { palettes } = require('./banner-palettes');
  const bsaved = reg.assignments.find(r => r.slug === SLUG); if (!bsaved) throw new Error('no saved banner palette'); const bname = bsaved.palette;
  const tp = require('./thumbnail-palettes');
  const tsaved = tp.load().assignments.find(r => r.slug === SLUG); if (!tsaved) throw new Error('no saved thumbnail palette');
  const tname = tsaved.editorialPalette || tsaved.palette;
  const svg = frame(draw(), { name: bname, colors: palettes[bname] });
  fs.writeFileSync(pth.join(ROOT, 'assets/art', SLUG + '.svg'), svg);
  console.log('art:', SLUG, 'banner palette', bname, '| thumbnail palette', tname, '| joint', joint(3, 4), 'separate', separate(3, 4));
  const i = process.argv.indexOf('--render');
  if (i < 0) return;
  const inspect = process.argv[i + 1];
  fs.mkdirSync(inspect, { recursive: true });
  const { chromium } = require('playwright');
  const b = await chromium.launch(process.env.EVIDENCE_PRESS_CHROME ? { executablePath: process.env.EVIDENCE_PRESS_CHROME } : {});
  const shot = async (w, h, html, file, opts = {}) => {
    const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: opts.dpr || 1 });
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
  if (process.argv.includes('--no-mirror')) { await b.close(); console.log('rendered (central mirror skipped)'); return; }
  const central = pth.join(process.env.EVIDENCE_PRESS_THUMBNAIL_DIR || pth.join(os.homedir(), 'thumbs'), SLUG + '.jpg');
  if (fs.existsSync(central) && !fs.readFileSync(thumbFile).equals(fs.readFileSync(central))) throw new Error('central thumbnail exists; refusing to overwrite: ' + central);
  fs.copyFileSync(thumbFile, central);
  if (!fs.readFileSync(thumbFile).equals(fs.readFileSync(central))) throw new Error('central mirror mismatch');
  await b.close();
  console.log('rendered OG, thumbnail, mirror and inspection PNGs');
})().catch(e => { console.error(e); process.exit(1); });
