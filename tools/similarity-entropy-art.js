'use strict';
const { bannerSvg } = require('./svg-xml');
// When mixing lowers similarity-sensitive entropy (similarity-entropy-concavity): banner, OG, thumbnail.
// "This image helps the reader understand" that four outcomes are always safe but five can fail (Theorem 4): the
// five-outcome similarity on the complete bipartite graph K_{2,3} (similarity a across the two groups, a^2 within a
// group) is drawn on the left, and a to-scale line of the edge similarity a shows where pooling can lower the entropy:
// safe below the root 0.673648 of the released determinant polynomial, failing on (0.673648, 1/sqrt2), and no longer
// positive definite from 1/sqrt2 on; a = 12/17 is marked with its exact gain of about 0.0003 nats.
// checkHook recomputes, before drawing, the released values (results/extensions.json five_state_family and
// results/verify_mixing.txt): the root of 4a^5 + a^4 + 7a^3 - 5a^2 + 5a - 4 on (0.6, 0.7) to 1e-9 against
// 0.6736480786466803; the window width 1/sqrt2 - root against 0.03345870226621628; at a = 12/17 the exact identities
// 1 - 2a^2 = 1/289 and (alpha + a)(beta + a)/(4 alpha beta) = 999949/999364 in BigInt rational arithmetic, with
// alpha = (1 + a^2)/2 and beta = (1 + 2a^2)/3; and that 12/17 lies inside the window. It refuses to draw on mismatch.
// Reference: txgraffiti-order48-successor (one exact object balanced with immediately readable values).
// Usage: node tools/similarity-entropy-art.js [--render OUTDIR_FOR_INSPECTION] [--no-mirror]
const SLUG = 'similarity-entropy-concavity';
const ink = '#f6f2ea', muted = '#e2e7ea', dim = '#c3ccd2', hot = '#ffc36b', cool = '#9fd3ff', rose = '#f2a7b5', mint = '#a8e6c1', grey = '#8f9aa3';
const SANS = 'Arial,Helvetica,sans-serif', SERIF = 'Georgia,serif';
const text = (x, y, s, size = 18, color = ink, anchor = 'start', weight = 'normal', family = SANS, style = 'normal') => {
  if (/<|&(?!(lt|gt|amp|minus|#\d+);)/.test(s.replace(/<\/?tspan[^>]*>/g, ''))) throw new Error('unescaped < or & in SVG text: ' + s);
  return `<text class="og-hide" x="${x}" y="${y}" fill="${color}" font-family="${family}" font-size="${size}" font-weight="${weight}" font-style="${style}" text-anchor="${anchor}">${s}</text>`;
};
// Released values (results/extensions.json, results/verify_mixing.txt).
const RELEASED = { root: 0.6736480786466803, width: 0.03345870226621628, ratio: [999949n, 999364n], a: [12n, 17n] };
function checkHook() {
  const f = a => 4 * a ** 5 + a ** 4 + 7 * a ** 3 - 5 * a ** 2 + 5 * a - 4;
  let lo = 0.6, hi = 0.7;
  if (!(f(lo) < 0 && f(hi) > 0)) throw new Error('no sign change on (0.6, 0.7)');
  for (let i = 0; i < 200; i++) { const mid = (lo + hi) / 2; if (f(mid) < 0) lo = mid; else hi = mid; }
  const root = (lo + hi) / 2, edge = Math.SQRT1_2;
  if (Math.abs(root - RELEASED.root) > 1e-9) throw new Error('root mismatch ' + root);
  if (Math.abs(edge - root - RELEASED.width) > 1e-9) throw new Error('window width mismatch');
  const [p, q] = RELEASED.a; // a = p/q
  // 1 - 2a^2 = (q^2 - 2p^2)/q^2
  if (!(q * q - 2n * p * p === 1n && q * q === 289n)) throw new Error('1 - 2a^2 != 1/289');
  // alpha = (q^2 + p^2)/(2q^2), beta = (q^2 + 2p^2)/(3q^2), a = p/q = pq/q^2
  const A = [q * q + p * p, 2n * q * q], B = [q * q + 2n * p * p, 3n * q * q], a2 = [p * q, q * q];
  const add = (x, y) => [x[0] * y[1] + y[0] * x[1], x[1] * y[1]], mul = (x, y) => [x[0] * y[0], x[1] * y[1]];
  const num = mul(add(A, a2), add(B, a2)), den = mul(mul([4n, 1n], A), B);
  const r = [num[0] * den[1], num[1] * den[0]];
  if (r[0] * RELEASED.ratio[1] !== r[1] * RELEASED.ratio[0]) throw new Error('Jensen ratio mismatch');
  const gain = 0.5 * Math.log(Number(RELEASED.ratio[0]) / Number(RELEASED.ratio[1]));
  if (Math.abs(gain - 0.00029260) > 5e-9) throw new Error('gain mismatch ' + gain);
  const aval = Number(p) / Number(q);
  if (!(aval > root && aval < edge)) throw new Error('12/17 not inside the failure window');
  return { root, edge, width: edge - root, a: aval, gain };
}
function graph(x0, y0) {
  // K_{2,3}: two outcomes on the left, three on the right; every cross pair has similarity a.
  const L = [[x0, y0 + 60], [x0, y0 + 160]], R = [[x0 + 170, y0 + 30], [x0 + 170, y0 + 110], [x0 + 170, y0 + 190]];
  let s = '';
  for (const u of L) for (const v of R) s += `<line x1="${u[0]}" y1="${u[1]}" x2="${v[0]}" y2="${v[1]}" stroke="${cool}" stroke-width="2" opacity="0.75"/>`;
  s += `<rect x="${x0 - 26}" y="${y0 + 30}" width="52" height="160" rx="26" fill="none" stroke="${hot}" stroke-width="1.4" stroke-dasharray="4 5" opacity="0.85"/>`;
  s += `<rect x="${x0 + 144}" y="${y0}" width="52" height="220" rx="26" fill="none" stroke="${hot}" stroke-width="1.4" stroke-dasharray="4 5" opacity="0.85"/>`;
  for (const [x, y] of [...L, ...R]) s += `<circle cx="${x}" cy="${y}" r="12" fill="${ink}" stroke="#111" stroke-width="1.2"/>`;
  s += text(x0 + 85, y0 + 246, 'similarity a across the groups', 14, cool, 'middle', 'bold');
  s += text(x0 + 85, y0 + 265, 'a² within a group', 14, hot, 'middle', 'bold');
  return s;
}
function line(x0, y0, w) {
  const c = checkHook();
  const A0 = 0.60, A1 = 0.74, sx = v => x0 + (v - A0) / (A1 - A0) * w;
  let s = text(x0, y0 - 66, 'Edge similarity a (to scale)', 15, ink, 'start', 'bold');
  s += text(x0, y0 - 46, 'exact test on the five-outcome example', 13, muted);
  const seg = (a, b, col, label, lc) => {
    s += `<rect x="${sx(a).toFixed(1)}" y="${y0 - 14}" width="${(sx(b) - sx(a)).toFixed(1)}" height="28" fill="${col}" opacity="0.85"/>`;
    s += text(((sx(a) + sx(b)) / 2).toFixed(1), y0 + 5, label, 13, lc, 'middle', 'bold');
  };
  seg(A0, c.root, mint, 'passes on grid', '#123');
  seg(c.root, c.edge, rose, 'fails', '#311');
  seg(c.edge, A1, grey, 'not PD', '#111');
  for (const [v, lab] of [[0.60, '0.60'], [0.65, '0.65'], [0.70, '0.70']]) {
    s += `<line x1="${sx(v).toFixed(1)}" y1="${y0 + 14}" x2="${sx(v).toFixed(1)}" y2="${y0 + 22}" stroke="${dim}" stroke-width="1.2"/>`;
    s += text(sx(v).toFixed(1), y0 + 38, lab, 12, dim, 'middle');
  }
  s += text(sx(c.root).toFixed(1), y0 - 22, '0.6736', 12, rose, 'end');
  s += text((sx(c.edge) + 3).toFixed(1), y0 - 22, '1/√2', 12, dim, 'start');
  s += `<line x1="${sx(c.root).toFixed(1)}" y1="${y0 + 46}" x2="${sx(c.edge).toFixed(1)}" y2="${y0 + 46}" stroke="${rose}" stroke-width="1.4"/>`;
  s += text(((sx(c.root) + sx(c.edge)) / 2).toFixed(1), y0 + 62, 'window ≈ 0.033 wide', 12, rose, 'middle');
  const xa = sx(c.a);
  s += `<line x1="${xa.toFixed(1)}" y1="${y0 + 72}" x2="${xa.toFixed(1)}" y2="${y0 + 94}" stroke="${hot}" stroke-width="1.6"/>`;
  s += `<circle cx="${xa.toFixed(1)}" cy="${y0 + 72}" r="3.5" fill="${hot}"/>`;
  s += text((xa + 6).toFixed(1), y0 + 108, 'a = 12/17: revealing the group raises', 12, hot, 'end');
  s += text((xa + 6).toFixed(1), y0 + 124, 'expected entropy by ≈ 0.0003 nats', 12, hot, 'end');
  return s;
}
const draw = () => {
  let s = text(40, 46, 'Similarity-sensitive entropy: four outcomes are safe, five can fail', 25, ink, 'start', 'normal', SERIF);
  s += text(40, 74, 'Pooling can lower H_K(p) = −Σ pᵢ log (Kp)ᵢ only for some similarity matrices K; one exact test per outcome decides which', 15, muted);
  s += graph(95, 92);
  s += line(360, 210, 420);
  const R = 830;
  s += text(R, 128, 'Four outcomes: always safe', 16, mint, 'start', 'bold');
  s += text(R, 150, '(positive definite, triangle inequality;', 13, muted);
  s += text(R, 168, 'exact polynomial certificate)', 13, muted);
  s += text(R, 202, 'Five outcomes: can fail', 16, rose, 'start', 'bold');
  s += text(R, 224, 'the two-group example, in a narrow window', 13, muted);
  s += text(R, 258, 'Either condition, any size: an observation', 14, ink);
  s += text(R, 278, 'raises expected entropy by at most ½ log n', 14, ink);
  s += text(R, 312, 'Dendrogram (ultrametric) similarities', 14, ink);
  s += text(R, 332, 'are always safe', 14, ink);
  s += text(40, 384, 'Left: five outcomes in groups of two and three. Middle: failure proved on the pink window; the exact test passes at a = 0.60, 0.61, …, 0.67. Unrefereed candidate.', 12, dim);
  return s;
};
const description = 'Banner for a paper on when similarity-sensitive entropy fails to be concave. Title: Similarity-sensitive entropy: four outcomes are safe, five can fail. Subtitle: pooling can lower H sub K of p, minus the sum of p sub i times log of (K p) sub i, only for some similarity matrices K; one exact test per outcome decides which. Left: a complete bipartite graph with two outcomes in one dashed group and three in the other; every pair across the groups is joined by a line, labelled similarity a across the groups and a squared within a group. Middle: a to-scale line of the edge similarity a from 0.60 to 0.74 showing the exact test on the five-outcome example, green and labelled passes on grid up to 0.6736, pink and labelled fails from 0.6736 to one over root two, grey and labelled not positive definite beyond; the pink window is about 0.033 wide; a marker at a equals 12 over 17 notes that revealing the group raises expected entropy by about 0.0003 nats. Right: four outcomes are always safe (positive definite, triangle inequality, exact polynomial certificate); five outcomes can fail (the two-group example, in a narrow window); under either condition and at any size an observation raises expected entropy by at most one half log n; dendrogram (ultrametric) similarities are always safe. Footer: left, five outcomes in groups of two and three; middle, failure proved on the pink window, and the exact test passes at a equals 0.60, 0.61, up to 0.67; unrefereed candidate.';
function frame(inner, background) {
  return bannerSvg({ inner, description, background, glow: { color: '#f2a7b5', cx: '0.45', cy: '0.55', r: '0.4', opacity: '0.06' } });
}
const thumbSpec = {
  kicker: ['RESEARCH RELEASE · NOVEMBER 2026', 'INFORMATION THEORY · DIVERSITY'],
  head: ['Pooling can lower', '<em>similarity entropy</em>'], headSize: 52,
  sub: 'An exact test decides when similarity-sensitive entropy is concave: four outcomes are always safe, five can fail.',
  tag: 'UNREFEREED CANDIDATE',
  hero: '<div class="eq-label">fewest outcomes that can fail</div><div class="hero-title">5</div><div class="note">positive definite, triangle inequality:<br>four outcomes are always safe</div><div class="eq-foot">expected entropy gain at most ½ log n</div>'
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
