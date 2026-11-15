'use strict';
const { bannerSvg } = require('./svg-xml');
// Linear-time rows for quadratic e-value discovery matrices (linear-time-discovery-matrices): banner, OG, thumbnail.
// "This image helps the reader understand" what a discovery matrix is and what the paper changes: Example 2.1 of the
// paper (e-values 20, 8, 1/2 merged by the pairwise-product mean U_2 give the lower-triangular matrix 10 / 58 4 / 58 4 1/2)
// and the cost of the complete K = 10,000 matrix (Section 7): 1.67e11 entry evaluations for the previous algorithm
// (Vovk-Wang Algorithm 2, sum of r(K - r + 1) = K(K+1)(K+2)/6) against 3.77e8 with total monotonicity and SMAWK.
// checkHook recomputes Example 2.1 by brute force over all subsets in exact rational arithmetic and the previous
// algorithm's count from its loop sizes, and compares both with the released outputs
// (verification/output/examples_check.json and full_matrix_demo.json); it refuses to draw on mismatch.
// Reference: txgraffiti-order48-successor (one exact object balanced with immediately readable values).
// Usage: node tools/discovery-matrices-art.js [--render OUTDIR_FOR_INSPECTION] [--no-mirror]
const SLUG = 'linear-time-discovery-matrices';
const ink = '#f6f2ea', muted = '#e2e7ea', dim = '#c3ccd2', hot = '#ffc36b', cool = '#9fd3ff';
const SANS = 'Arial,Helvetica,sans-serif', SERIF = 'Georgia,serif';
const text = (x, y, s, size = 18, color = ink, anchor = 'start', weight = 'normal', family = SANS, style = 'normal') => {
  if (/[<&]/.test(s.replace(/<\/?tspan[^>]*>/g, ''))) throw new Error('unescaped < or & in SVG text: ' + s);
  return `<text class="og-hide" x="${x}" y="${y}" fill="${color}" font-family="${family}" font-size="${size}" font-weight="${weight}" font-style="${style}" text-anchor="${anchor}">${s}</text>`;
};
// exact rationals as [numerator, denominator] BigInt pairs
const g = (a, b) => (b === 0n ? (a < 0n ? -a : a) : g(b, a % b));
const fr = (n, d = 1n) => { const k = g(n, d); return [n / k, d / k]; };
const lt = (x, y) => x[0] * y[1] < y[0] * x[1];
function U2(vals) {   // pairwise-product mean, singleton convention U_2(x) = x
  if (vals.length === 1) return vals[0];
  let num = 0n, den = 1n;
  for (let i = 0; i < vals.length; i++) for (let j = i + 1; j < vals.length; j++) {
    const p = [vals[i][0] * vals[j][0], vals[i][1] * vals[j][1]];
    [num, den] = fr(num * p[1] + p[0] * den, den * p[1]);
  }
  const n = BigInt(vals.length), pairs = n * (n - 1n) / 2n;
  return fr(num, den * pairs);
}
function discovery(e) {
  const K = e.length, rows = [];
  for (let r = 1; r <= K; r++) {
    const row = [];
    for (let j = 0; j < r; j++) {
      let best = null;
      for (let mask = 1; mask < (1 << K); mask++) {
        let omitted = 0; for (let i = 0; i < r; i++) if (!(mask >> i & 1)) omitted++;
        if (omitted > j) continue;
        const v = U2(e.filter((_, i) => mask >> i & 1));
        if (best === null || lt(v, best)) best = v;
      }
      row.push(best[1] === 1n ? String(best[0]) : `${best[0]}/${best[1]}`);
    }
    rows.push(row);
  }
  return rows;
}
const K = 10000, FAST = 376620736;   // released full_matrix_demo.json fast_evaluations
function checkHook() {
  const released = [['10'], ['58', '4'], ['58', '4', '1/2']];   // examples_check.json example_2_1_matrix
  const m = discovery([fr(20n), fr(8n), fr(1n, 2n)]);
  if (JSON.stringify(m) !== JSON.stringify(released)) throw new Error('Example 2.1 mismatch: ' + JSON.stringify(m));
  let slow = 0; for (let r = 1; r <= K; r++) slow += r * (K - r + 1);
  if (slow !== 166716670000 || slow !== K * (K + 1) * (K + 2) / 6) throw new Error('previous-algorithm count ' + slow);
  const ratio = Math.round(10 * slow / FAST) / 10;
  if (ratio !== 442.7) throw new Error('ratio ' + ratio);
  return { matrix: m, fast: FAST, slow, ratio };
}
// ---- left: the worked example as a lower-triangular matrix ----
function matrix() {
  let s = text(40, 116, 'What a discovery matrix says', 15, muted, 'start', 'bold');
  s += text(40, 136, 'e-values 20, 8 and ½, merged by the', 13, dim);
  s += text(40, 152, 'average of pairwise products', 13, dim);
  const x0 = 104, y0 = 182, cw = 64, ch = 40;
  for (let j = 0; j < 3; j++) s += text(x0 + cw * j + cw / 2, y0 - 8, 'j = ' + j, 12, dim, 'middle');
  const vals = [['10'], ['58', '4'], ['58', '4', '½']];
  for (let r = 0; r < 3; r++) {
    s += text(x0 - 10, y0 + ch * r + 26, 'r = ' + (r + 1), 12, dim, 'end');
    for (let j = 0; j <= r; j++) {
      const strong = vals[r][j] === '58';
      s += `<rect x="${x0 + cw * j + 2}" y="${y0 + ch * r + 2}" width="${cw - 4}" height="${ch - 4}" rx="5" fill="${strong ? 'rgba(255,195,107,0.22)' : 'rgba(255,255,255,0.07)'}" stroke="${strong ? hot : 'rgba(255,255,255,0.28)'}" stroke-width="1.2"/>`;
      s += text(x0 + cw * j + cw / 2, y0 + ch * r + 27, vals[r][j], 18, strong ? hot : ink, 'middle', 'bold', SERIF);
    }
  }
  s += text(40, 324, 'Row 2, column 0: 58 is strong evidence that at', 12, ink);
  s += text(40, 340, 'least one of the top two is real; column 1: 4 is', 12, ink);
  s += text(40, 356, 'only weak evidence that both are', 12, ink);
  return s;
}
// ---- centre: evaluations for the complete K = 10,000 matrix, log scale ----
const SUP = { 8: '⁸', 9: '⁹', 10: '¹⁰', 11: '¹¹', 12: '¹²' };
function chart() {
  const X0 = 470, X1 = 860, L0 = 8, L1 = 12; const px = l => X0 + (X1 - X0) * (l - L0) / (L1 - L0);
  let s = text(X0, 116, 'Complete 10,000 × 10,000 matrix', 15, muted, 'start', 'bold');
  s += text(X0, 136, 'entry evaluations, log scale', 13, dim);
  const axis = 'rgba(255,255,255,0.55)';
  s += `<line x1="${X0}" y1="292" x2="${X1}" y2="292" stroke="${axis}" stroke-width="1.3"/>`;
  for (let l = L0; l <= L1; l++) s += `<line x1="${px(l)}" y1="292" x2="${px(l)}" y2="298" stroke="${axis}"/>` + text(px(l), 314, '10' + SUP[l], 13, dim, 'middle');
  const bar = (y, v, label, value, color) => {
    const w = px(Math.log10(v)) - X0;
    return `<rect x="${X0}" y="${y}" width="${w.toFixed(1)}" height="34" rx="3" fill="${color}" fill-opacity="0.85"/>` +
      text(X0, y - 8, label, 13, ink, 'start', 'bold') + text(X0 + w + 8, y + 23, value, 15, color, 'start', 'bold', SERIF);
  };
  s += bar(170, 166716670000, 'Previous algorithm (row cost grows like K²)', '1.67 × 10¹¹', '#9aa7b0');
  s += bar(240, FAST, 'This paper (row cost grows like K)', '3.77 × 10⁸', hot);
  s += text(X0, 344, 'About 440 times fewer; about two minutes in plain Python', 13, ink, 'start', 'bold');
  s += text(X0, 362, 'Simulated study in the design of Vovk and Wang, scaled up', 12, dim);
  return s;
}
function right() {
  const x0 = 952; let s = '';
  s += `<line x1="${x0 - 22}" y1="104" x2="${x0 - 22}" y2="372" stroke="rgba(255,255,255,0.16)" stroke-width="1"/>`;
  s += text(x0, 116, 'Why it works', 15, muted, 'start', 'bold');
  s += text(x0, 140, 'Inserting values into a gap', 13, dim);
  s += text(x0, 157, 'cannot raise the plain average', 13, dim);
  s += text(x0, 174, 'unless it raises the pairwise-', 13, dim);
  s += text(x0, 191, 'product average too', 13, dim);
  s += text(x0, 218, 'So a hidden table is totally', 13, ink);
  s += text(x0, 235, 'monotone, and SMAWK finds', 13, ink);
  s += text(x0, 252, 'every row minimum quickly', 13, ink);
  s += text(x0, 290, 'Proved for U₂ and fixed mixes', 12, dim, 'start', 'normal', SERIF, 'italic');
  s += text(x0, 306, 'with the plain average', 12, dim, 'start', 'normal', SERIF, 'italic');
  s += text(x0, 330, 'Higher-degree products: open', 12, dim, 'start', 'normal', SERIF, 'italic');
  s += text(x0, 346, 'Float mode not certified', 12, dim, 'start', 'normal', SERIF, 'italic');
  return s;
}
const draw = () =>
  text(40, 50, 'E-value discovery matrices in linear time per row', 25, ink, 'start', 'normal', SERIF) +
  text(40, 80, 'Vovk and Wang asked whether pairwise-product rows can be computed in linear time: they can', 15, muted) +
  matrix() + chart() + right();
const description = 'Banner for a paper on e-value discovery matrices. Title: E-value discovery matrices in linear time per row. Subtitle: Vovk and Wang asked whether pairwise-product rows can be computed in linear time: they can. Left: what a discovery matrix says, for e-values 20, 8 and one half merged by the average of pairwise products: a lower-triangular matrix with row 1: 10; row 2: 58, 4; row 3: 58, 4, one half. Row 2, column 0: 58 is strong evidence that at least one of the top two is real; column 1: 4 is only weak evidence that both are. Centre: entry evaluations for a complete 10,000 by 10,000 matrix on a log scale: previous algorithm (row cost grows like K squared) 1.67 times 10 to the 11; this paper (row cost grows like K) 3.77 times 10 to the 8; about 440 times fewer, about two minutes in plain Python, in a simulated study in the design of Vovk and Wang, scaled up. Right: why it works: inserting values into a gap cannot raise the plain average unless it raises the pairwise-product average too, so a hidden table is totally monotone and SMAWK finds every row minimum quickly. Proved for U2 and fixed mixes with the plain average; higher-degree products open; float mode not certified.';
function frame(inner, background) {
  return bannerSvg({ inner, description, background, glow: { color: '#ffd38a', cx: '0.5', cy: '0.55', r: '0.4', opacity: '0.06' } });
}
const thumbSpec = {
  kicker: ['RESEARCH RELEASE · NOVEMBER 2026', 'STATISTICS · MULTIPLE TESTING'],
  head: ['E-value discovery matrices', 'in <em>linear time</em> per row'], headSize: 48,
  sub: 'A question of Vovk and Wang answered for pairwise products: a full 10,000 × 10,000 matrix in about two minutes.',
  tag: 'UNREFEREED CANDIDATE',
  hero: '<div class="eq-label">entry evaluations, K = 10,000</div><div class="hero-title">440× fewer</div><div class="note">before: 1.67 × 10¹¹<br>now: 3.77 × 10⁸</div><div class="eq-foot">written proofs</div>'
};
module.exports = { draw, description, thumbSpec, checkHook };
if (require.main === module) (async () => {
  const fs = require('fs'), pth = require('path'), os = require('os'), vm = require('vm');
  const ROOT = pth.join(__dirname, '..');
  const chk = checkHook();
  console.log('check: Example 2.1 matrix', JSON.stringify(chk.matrix), '| evaluations', chk.fast, 'vs', chk.slow, 'ratio', chk.ratio);
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
