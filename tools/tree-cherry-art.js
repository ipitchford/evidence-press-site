'use strict';
const { bannerSvg } = require('./svg-xml');
// Log-concavity transitions in sums of polynomial powers (tree-log-concavity-diameter-four): banner, OG, thumbnail.
// "This image helps the reader understand" the object and the two headline facts: the cherry tree T_m (a hub joined to
// the middles of m three-vertex paths, diameter four; Figure 1, left panel), the exact threshold (log-concave for
// m <= 16,391, first failure at m = 16,392 with 49,177 vertices; Theorem 2.4), and how the single block of failures
// grows very slowly (Table 2: reflected indices 22-25 at m = 10^5, 27-31 at 10^6, 56-66 at 10^12, 209-225 at 10^40).
// checkHook recomputes the threshold and the m = 10^12 run exactly with BigInt from Lemma 6.1:
// reflected polynomial (1+x)^{2m} + x(1+3x+x^2)^m. Reference: ap4-ramsey-diameter-36 (exact object with labels).
// Usage: node tools/tree-cherry-art.js [--render OUTDIR_FOR_INSPECTION] [--no-mirror]
const SLUG = 'tree-log-concavity-diameter-four';
const ink = '#f6f2ea', muted = '#e2e7ea', dim = '#bcc8cf';
const hubC = '#ffb36b', midC = '#9fd4ff', leafC = '#d9f0c8', failC = '#ff8a7a', okC = '#9fe0b0';
const SANS = 'Arial,Helvetica,sans-serif', SERIF = 'Georgia,serif';
const text = (x, y, s, size = 18, color = ink, anchor = 'start', weight = 'normal', family = SANS, style = 'normal') =>
  `<text class="og-hide" x="${x}" y="${y}" fill="${color}" font-family="${family}" font-size="${size}" font-weight="${weight}" font-style="${style}" text-anchor="${anchor}">${s}</text>`;

// ---- exact check (BigInt) of the numbers drawn ----
function binomRow(n, kMax) { // C(n,0..kMax)
  const r = [1n]; for (let k = 1; k <= kMax; k++) r.push(r[k - 1] * (n - BigInt(k) + 1n) / BigInt(k)); return r;
}
function reflected(m, J) { // coefficients f_0..f_J of (1+x)^{2m} + x(1+3x+x^2)^m
  const M = BigInt(m), b2m = binomRow(2n * M, J), bm = binomRow(M, J);
  const p = k => { let s = 0n; for (let i = 0; 2 * i <= k; i++) { const ci = bm[i]; const rest = binomRow(M - BigInt(i), k - 2 * i)[k - 2 * i]; s += ci * rest * 3n ** BigInt(k - 2 * i); } return s; };
  const f = []; for (let j = 0; j <= J; j++) f.push(b2m[j] + (j >= 1 ? p(j - 1) : 0n)); return f;
}
function failures(m, J) { const f = reflected(m, J + 1), out = []; for (let j = 1; j <= J; j++) if (f[j - 1] * f[j + 1] > f[j] * f[j]) out.push(j); return out; }
const RUNS = [['10⁵', 22, 25], ['10⁶', 27, 31], ['10¹²', 56, 66], ['10⁴⁰', 209, 225]]; // Table 2 (verify_tree.py)
function checkHook() {
  const eq = (a, b, what) => { if (JSON.stringify(a) !== JSON.stringify(b)) throw new Error(what + ': ' + JSON.stringify(a) + ' vs ' + JSON.stringify(b)); };
  eq(failures(16391, 60), [], 'T_16391 prefix');
  eq(failures(16392, 60), [20], 'T_16392 prefix');
  eq(failures(10 ** 5, 60), [22, 23, 24, 25], 'm = 1e5');
  eq(failures(10 ** 12, 100), [56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66], 'm = 1e12');
  eq(3 * 16392 + 1, 49177, 'vertices');
  eq(RUNS.map(([, a, b]) => b - a + 1), [4, 5, 11, 17], 'run lengths');
}

// ---- drawing ----
function tree() {
  // T_8 drawn radially: hub, 8 cherry centres, 16 leaves (the paper's figure shows T_5).
  const cx = 205, cy = 250, r1 = 62, r2 = 112, k = 8; let s = '', nodes = '';
  for (let i = 0; i < k; i++) {
    const t = -Math.PI / 2 + (2 * Math.PI * i) / k, x = cx + r1 * Math.cos(t), y = cy + r1 * Math.sin(t);
    s += `<line x1="${cx}" y1="${cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" stroke="${dim}" stroke-width="2"/>`;
    for (const d of [-0.2, 0.2]) {
      const u = t + d, lx = cx + r2 * Math.cos(u), ly = cy + r2 * Math.sin(u);
      s += `<line x1="${x.toFixed(1)}" y1="${y.toFixed(1)}" x2="${lx.toFixed(1)}" y2="${ly.toFixed(1)}" stroke="${dim}" stroke-width="2"/>`;
      nodes += `<circle cx="${lx.toFixed(1)}" cy="${ly.toFixed(1)}" r="6" fill="${leafC}"/>`;
    }
    nodes += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="8" fill="${midC}"/>`;
  }
  nodes += `<circle cx="${cx}" cy="${cy}" r="12" fill="${hubC}"/>`;
  s += nodes;
  s += text(cx, 116, 'hub + m cherries (here m = 8)', 15, muted, 'middle', 'bold');
  s += `<path d="M${cx + 16} ${cy + 4} L 352 300" stroke="${hubC}" stroke-width="1.2" fill="none"/>` + text(356, 304, 'hub', 14, hubC);
  s += text(cx, 388, 'one cherry = a three-vertex path joined at its middle', 13, dim, 'middle', 'normal', SERIF, 'italic');
  return s;
}
function threshold() {
  const x0 = 430, x1 = 760, y = 186; let s = '';
  s += text(x0, 122, 'Is the count sequence log-concave?', 15, muted, 'start', 'bold');
  s += `<rect x="${x0}" y="${y - 14}" width="${(x1 - x0) * 0.62}" height="28" rx="4" fill="${okC}" fill-opacity="0.85"/>`;
  s += `<rect x="${x0 + (x1 - x0) * 0.62 + 4}" y="${y - 14}" width="${(x1 - x0) * 0.38 - 4}" height="28" rx="4" fill="${failC}" fill-opacity="0.9"/>`;
  s += text(x0 + 10, y + 6, 'yes: m ≤ 16,391', 16, '#10251a', 'start', 'bold');
  s += text(x1 - 10, y + 6, 'no: m ≥ 16,392', 16, '#2a0f0b', 'end', 'bold');
  s += text(x0, y + 44, 'first failure: 49,177 vertices, at one place only', 14, muted);
  s += text(x0, y + 66, 'every tree of diameter ≤ 3 is log-concave,', 14, dim);
  s += text(x0, y + 86, 'so four is the least failing diameter', 14, dim);
  s += text(x0, y + 120, 'no failing diameter-4 tree up to 62 vertices', 14, dim);
  return s;
}
function runs() {
  const x0 = 800, x1 = 1170, y0 = 160; let s = '';
  s += text(x0, 122, 'The failures form one block that grows slowly', 15, muted, 'start', 'bold');
  s += text(x0, 142, 'failing sizes, counted down from the largest', 12.5, dim, 'start', 'normal', SERIF, 'italic');
  const unit = (x1 - x0 - 110) / 17;
  RUNS.forEach(([m, a, b], i) => {
    const y = y0 + 22 + i * 46, L = b - a + 1;
    s += text(x0, y + 6, 'm = ' + m, 15, ink, 'start', 'bold');
    for (let k = 0; k < L; k++) s += `<rect x="${(x0 + 100 + k * unit).toFixed(1)}" y="${y - 9}" width="${(unit - 2).toFixed(1)}" height="18" rx="2" fill="${failC}"/>`;
    s += text(x0 + 100 + L * unit + 6 > x1 - 60 ? x1 : x0 + 100 + L * unit + 8, y + 26, `${a}–${b}`, 12.5, dim, x0 + 100 + L * unit + 6 > x1 - 60 ? 'end' : 'start');
  });
  s += text(x0, 388, 'length ≈ 4.93 log log m (Table 2, Theorem 2.3)', 13, dim, 'start', 'normal', SERIF, 'italic');
  return s;
}
const draw = () =>
  text(40, 50, 'When does a tree stop being log-concave?', 26, ink, 'start', 'normal', SERIF) +
  text(40, 80, 'Independent-set counts of a hub with m cherries (diameter four): exact threshold and the shape of the failures', 15, muted) +
  tree() + threshold() + runs();
const description = 'Banner for a paper on log-concavity of independent-set counts in trees. Title: When does a tree stop being log-concave? Left: the tree studied, a hub (orange) joined to the middle vertices (blue) of eight three-vertex paths called cherries, each with two leaves (green); caption: one cherry is a three-vertex path joined at its middle. Middle: a bar split into a green part, yes, log-concave for m up to 16,391, and a red part, no, for m from 16,392; notes: first failure at 49,177 vertices, at one place only; every tree of diameter at most 3 is log-concave, so four is the least failing diameter; no failing diameter-4 tree up to 62 vertices. Right: rows of red blocks showing the failing sizes, counted down from the largest, for m = 10^5 (sizes 22 to 25), 10^6 (27 to 31), 10^12 (56 to 66) and 10^40 (209 to 225); caption: length about 4.93 log log m.';
function frame(inner, background) {
  return bannerSvg({ inner, description, background, glow: { color: midC, cx: '0.25', cy: '0.6', r: '0.4', opacity: '0.06' } });
}
const thumbSpec = {
  kicker: ['RESEARCH RELEASE · NOVEMBER 2026', 'COMBINATORICS'],
  head: ['Smooth up to 16,391 cherries.', 'Breaks at <em>16,392</em>.'], headSize: 56,
  sub: 'A hub joined to m three-vertex paths: its independent-set counts are log-concave exactly when m ≤ 16,391, so trees of diameter four can fail.',
  tag: 'UNREFEREED CANDIDATE',
  hero: '<div class="eq-label">hub + m cherries</div><div class="hero-title">m = 16,392</div><div class="note">first failure: 49,177 vertices<br>least failing diameter: 4<br>none up to 62 vertices</div><div class="eq-foot">computer-assisted exact proof</div>'
};
module.exports = { draw, description, thumbSpec, failures };
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
