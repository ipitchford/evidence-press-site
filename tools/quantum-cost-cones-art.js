'use strict';
const { bannerSvg } = require('./svg-xml');
// Quantum transport cost cones (quantum-transport-cost-cones): banner, OG, thumbnail.
// "This image helps the reader understand" Theorem 8.2 of the paper: the simplest limiting cost E_uv (charge 1 for
// moving between two perpendicular pure states) is at operator-norm distance exactly 1/(1 + 2^max(p,1)) from all cost
// operators with exponent p (dimension at least three): flat at 1/3 for p <= 1, then 1/5, 1/9, 1/17 at p = 2, 3, 4;
// by the retraction (Theorems 2.2, 6.1) no sum of noncommuting observables does better.
// checkHook recomputes the curve at p = 1, 2, 3, 4 and compares it with the released verification.json quoted edge
// errors (0.3333333333333337, 0.2000000000000003, 0.11111111111111113, 0.05882352941176535); it refuses to draw on mismatch.
// Reference: txgraffiti-order48-successor (one exact object balanced with immediately readable values).
// Usage: node tools/quantum-cost-cones-art.js [--render OUTDIR_FOR_INSPECTION] [--no-mirror]
const SLUG = 'quantum-transport-cost-cones';
const ink = '#f6f2ea', muted = '#e2e7ea', dim = '#bcc8cf', hot = '#ffb36b', cool = '#8ecbff';
const SANS = 'Arial,Helvetica,sans-serif', SERIF = 'Georgia,serif';
const text = (x, y, s, size = 18, color = ink, anchor = 'start', weight = 'normal', family = SANS, style = 'normal') => {
  if (/[<&]/.test(s.replace(/<\/?tspan[^>]*>/g, ''))) throw new Error('unescaped < or & in SVG text: ' + s);
  return `<text class="og-hide" x="${x}" y="${y}" fill="${color}" font-family="${family}" font-size="${size}" font-weight="${weight}" font-style="${style}" text-anchor="${anchor}">${s}</text>`;
};
const edge = p => 1 / (1 + 2 ** Math.max(p, 1));   // Theorem 8.2
function checkHook() {
  const released = { 1: 0.3333333333333337, 2: 0.2000000000000003, 3: 0.11111111111111113, 4: 0.05882352941176535 };
  const exact = { 1: 1 / 3, 2: 1 / 5, 3: 1 / 9, 4: 1 / 17 };
  for (const p of [1, 2, 3, 4]) {
    if (Math.abs(edge(p) - exact[p]) > 1e-15) throw new Error('formula at p=' + p);
    if (Math.abs(edge(p) - released[p]) > 1e-9) throw new Error('released value at p=' + p + ': ' + released[p]);
  }
  if (Math.abs(edge(0.3) - 1 / 3) > 1e-15) throw new Error('flat part');
  return { values: [1, 2, 3, 4].map(edge) };
}
// ---- chart: distance against p in [0, 5], value axis 0 .. 0.4 ----
const X0 = 486, X1 = 876, PMAX = 5;
const px = p => X0 + (X1 - X0) * p / PMAX;
const Y0 = 338, Y1 = 118, VMAX = 0.4;
const py = v => Y0 - (Y0 - Y1) * v / VMAX;
function chart() {
  let s = '';
  const axis = 'rgba(255,255,255,0.55)';
  s += `<line x1="${X0}" y1="${Y0}" x2="${X1 + 8}" y2="${Y0}" stroke="${axis}" stroke-width="1.3"/>`;
  s += `<line x1="${X0}" y1="${Y0}" x2="${X0}" y2="${Y1 - 6}" stroke="${axis}" stroke-width="1.3"/>`;
  for (const v of [0, 0.1, 0.2, 0.3]) s += `<line x1="${X0 - 5}" y1="${py(v)}" x2="${X0}" y2="${py(v)}" stroke="${axis}"/>` + text(X0 - 9, py(v) + 4, v.toFixed(1), 12, dim, 'end');
  for (const p of [0, 1, 2, 3, 4, 5]) s += `<line x1="${px(p)}" y1="${Y0}" x2="${px(p)}" y2="${Y0 + 5}" stroke="${axis}"/>` + text(px(p), Y0 + 18, String(p), 12, dim, 'middle');
  s += text((X0 + X1) / 2, Y0 + 36, 'exponent p of the cost |x − y|ᵖ', 13, muted, 'middle');
  s += text(X0 - 44, (Y0 + Y1) / 2, 'best error', 13, muted, 'middle').replace('<text ', `<text transform="rotate(-90 ${X0 - 44} ${(Y0 + Y1) / 2})" `);
  // region above the curve: unreachable by any cost operator with exponent p
  const n = 200, pts = Array.from({ length: n + 1 }, (_, i) => { const p = PMAX * i / n; return `${px(p).toFixed(1)},${py(edge(p)).toFixed(1)}`; });
  s += `<polygon points="${px(0)},${Y0} ${pts.join(' ')} ${px(PMAX)},${Y0}" fill="rgba(142,203,255,0.07)"/>`;
  s += `<polyline points="${pts.join(' ')}" fill="none" stroke="${cool}" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/>`;
  const lab = { 1: '1/3', 2: '1/5', 3: '1/9', 4: '1/17' };
  for (const p of [1, 2, 3, 4]) {
    s += `<circle cx="${px(p)}" cy="${py(edge(p))}" r="5" fill="${hot}" stroke="#1b1b1b" stroke-width="1"/>`;
    s += text(px(p) + (p === 1 ? 0 : 8), py(edge(p)) - 11, lab[p], 15, hot, p === 1 ? 'middle' : 'start', 'bold', SERIF);
  }
  s += text(px(0.1), py(1 / 3) + 40, 'flat at 1/3', 12.5, cool, 'start', 'bold');
  s += text(px(0.1), py(1 / 3) + 56, 'for p ≤ 1', 12.5, cool, 'start', 'bold');
  s += text(px(2.45), py(0.345), 'error = 1 / (1 + 2ᵖ) for p ≥ 1', 13, ink, 'start', 'bold');
  s += text(px(2.45), py(0.345) + 16, 'no sum of noncommuting', 12, dim);
  s += text(px(2.45), py(0.345) + 30, 'observables does better', 12, dim);
  return s;
}
function left() {
  let s = text(40, 118, 'Target: charge 1 for moving', 15, muted, 'start', 'bold');
  s += text(40, 137, 'between two perpendicular states', 15, muted, 'start', 'bold');
  s += text(40, 168, 'Approximate it by transport costs', 13.5, ink);
  s += text(40, 186, 'G<tspan baseline-shift="sub" font-size="10">p</tspan>(A) = |A ⊗ I − I ⊗ Aᵀ|ᵖ', 14, cool, 'start', 'normal', SERIF);
  s += text(40, 204, 'built from observables A', 13.5, ink);
  s += text(40, 240, 'The best operator-norm error is', 13.5, ink);
  s += text(40, 258, 'exact, and the curve is the same', 13.5, ink);
  s += text(40, 276, 'for pure-state transport values', 13.5, ink);
  s += text(40, 312, 'Key tool: a retraction onto costs', 12.5, dim, 'start', 'normal', SERIF, 'italic');
  s += text(40, 328, 'built from the given measurement blocks', 12.5, dim, 'start', 'normal', SERIF, 'italic');
  s += text(40, 360, 'Dimension at least three; bounded observables', 12, dim);
  return s;
}
function right() {
  const x0 = 952; let s = '';
  s += `<line x1="${x0 - 22}" y1="108" x2="${x0 - 22}" y2="372" stroke="rgba(255,255,255,0.16)" stroke-width="1"/>`;
  s += text(x0, 118, 'Also proved', 15, muted, 'start', 'bold');
  s += text(x0, 144, 'The cost cones grow with p:', 13, dim);
  s += text(x0, 162, 'C<tspan baseline-shift="sub" font-size="10">p</tspan> ⊆ C<tspan baseline-shift="sub" font-size="10">q</tspan> when p ≤ q', 14, ink, 'start', 'bold', SERIF);
  s += text(x0, 180, '(conjecture of Bunth, Pitrik,', 12, dim, 'start', 'normal', SERIF, 'italic');
  s += text(x0, 196, 'Titkos and Virosztek)', 12, dim, 'start', 'normal', SERIF, 'italic');
  s += text(x0, 228, 'One observable, three or more', 13, dim);
  s += text(x0, 246, 'outcomes: centred cost is', 13, dim);
  s += text(x0, 264, 'never negative exactly when', 13, dim);
  s += text(x0, 284, 'p ≤ 2', 16, hot, 'start', 'bold', SERIF);
  s += text(x0, 318, 'Four or more levels: a lower', 12, dim, 'start', 'normal', SERIF, 'italic');
  s += text(x0, 334, 'bound, exact for three levels', 12, dim, 'start', 'normal', SERIF, 'italic');
  return s;
}
const draw = () =>
  text(40, 50, 'Quantum transport costs: noncommuting observables never help', 25, ink, 'start', 'normal', SERIF) +
  text(40, 80, 'The best error for the simplest limiting cost is exactly 1/(1 + 2^max(p,1)): one third up to p = 1, then 1/5, 1/9, 1/17', 15, muted) +
  left() + chart() + right();
const description = 'Banner for a paper on quantum optimal transport cost operators. Title: Quantum transport costs: noncommuting observables never help. Subtitle: The best error for the simplest limiting cost is exactly 1/(1 + 2^max(p,1)): one third up to p = 1, then 1/5, 1/9, 1/17. Centre: a curve of the best operator-norm error against the exponent p from 0 to 5; it is flat at 1/3 for p ≤ 1 and then falls as 1/(1 + 2^p), with marked points 1/3 at p = 1, 1/5 at p = 2, 1/9 at p = 3 and 1/17 at p = 4; no sum of noncommuting observables does better. Left: the target charges 1 for moving between two perpendicular states; it is approximated by transport costs G_p(A) = |A ⊗ I − I ⊗ Aᵀ|ᵖ built from observables A; the best operator-norm error is exact, and the same curve holds for pure-state transport values; the key tool is a retraction onto costs built from the given measurement blocks; dimension at least three, bounded observables. Right: also proved, the cost cones grow with p, C_p ⊆ C_q when p ≤ q (a conjecture of Bunth, Pitrik, Titkos and Virosztek); for one observable with three or more outcomes the centred cost is never negative exactly when p ≤ 2; for four or more levels there is a lower bound, exact for three levels.';
function frame(inner, background) {
  return bannerSvg({ inner, description, background, glow: { color: '#8ecbff', cx: '0.55', cy: '0.6', r: '0.4', opacity: '0.06' } });
}
const thumbSpec = {
  kicker: ['RESEARCH RELEASE · NOVEMBER 2026', 'MATHEMATICAL PHYSICS · QUANTUM TRANSPORT'],
  head: ['Quantum transport costs:', '<em>noncommuting</em> observables never help'], headSize: 46,
  sub: 'A conjecture on quantum cost cones is proved, and the best approximation errors are exact.',
  tag: 'UNREFEREED CANDIDATE',
  hero: '<div class="eq-label">best error, exponent p</div><div class="hero-title">1/(1+2ᵖ)</div><div class="note">1/3 for p ≤ 1<br>1/5 at p = 2<br>1/17 at p = 4</div><div class="eq-foot">written proofs</div>'
};
module.exports = { draw, description, thumbSpec, checkHook };
if (require.main === module) (async () => {
  const fs = require('fs'), pth = require('path'), os = require('os'), vm = require('vm');
  const ROOT = pth.join(__dirname, '..');
  const chk = checkHook();
  console.log('check: edge distances at p = 1..4', chk.values.join(', '));
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
