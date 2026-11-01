'use strict';
const { bannerSvg } = require('./svg-xml');
// One bright mode is enough: banner, OG card and thumbnail.
// "This image helps the reader understand" that the best Gaussian measurement of m copies first gathers the changing
// mean into one bright output (homodyne at an optimised angle) while the dark outputs are measured along a fixed axis
// (Theorem 1), and that its Fisher information per copy rises above separate measurement towards the quantum limit
// (Corollary 1), with exact values from the paper's coherent-squeezing example (Table 1, alpha = 1/2).
// Sources (paper 1.0.0-candidate, 31 Oct 2026): Theorem 1; Table 1 values F_m = 81/32, 41/8, 249/32, 21/2, 425/32,
// 129/8, 609/32, 22, 25, 28 for m = 1..10; one-copy QFI Q = 3; separate measurement F_1 = 81/32.
// Usage: node tools/finite-copy-gaussian-art.js [--render OUTDIR_FOR_INSPECTION] [--no-mirror]
const SLUG = 'finite-copy-gaussian-metrology';
const ink = '#f4f1ea', muted = '#e3d9c9', dim = '#c4b7a2';
const bright = '#ffd27a', dark = '#9cc7ff', quant = '#c9b6ff', sep = '#ff9f8a';
const SANS = 'Arial,Helvetica,sans-serif', SERIF = 'Georgia,serif';
const text = (x, y, s, size = 18, color = ink, anchor = 'start', weight = 'normal', family = SANS) =>
  `<text class="og-hide" x="${x}" y="${y}" fill="${color}" font-family="${family}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}">${s}</text>`;
const f = v => (+v).toFixed(1);
const FM = [81 / 32, 41 / 8, 249 / 32, 21 / 2, 425 / 32, 129 / 8, 609 / 32, 22, 25, 28];
const Q = 3, F1 = 81 / 32;

// Left: copies -> interferometer -> one bright output + dark outputs
function scheme() {
  let s = '';
  const ys = [160, 205, 250, 295];
  for (const [i, y] of ys.entries()) {
    s += `<ellipse cx="90" cy="${y}" rx="17" ry="9" fill="none" stroke="${dark}" stroke-width="2" transform="rotate(-25 90 ${y})"/>`;
    s += `<circle cx="${96 + 3}" cy="${y - 3}" r="3" fill="${bright}"/>`;
    s += `<path d="M115 ${y} H205" stroke="${muted}" stroke-opacity=".75" stroke-width="2"/>`;
    if (i === 0) s += text(60, y - 26, 'm identical copies', 14, dim, 'start', 'normal', SERIF);
  }
  s += `<rect x="205" y="140" width="120" height="175" rx="10" fill="#ffffff" fill-opacity=".06" stroke="${muted}" stroke-opacity=".6" stroke-width="1.6"/>`;
  s += text(265, 222, 'interferometer', 14, muted, 'middle');
  s += text(265, 241, 'adds the copies', 13, dim, 'middle');
  s += `<path d="M325 160 H430" stroke="${bright}" stroke-width="6"/>`;
  s += `<path d="M430 160 l-12 -7 v14 z" fill="${bright}"/>`;
  s += text(440, 156, 'bright output', 15, bright, 'start', 'bold');
  s += text(440, 175, 'homodyne at the best angle φ', 13.5, bright);
  for (const y of [222, 260, 298]) s += `<path d="M325 ${y} H430" stroke="${dark}" stroke-width="2.4" stroke-dasharray="6 4"/>`;
  s += text(440, 256, 'dark outputs', 15, dark, 'start', 'bold');
  s += text(440, 275, 'homodyne along a fixed axis', 13.5, dark);
  s += text(60, 352, 'No Gaussian measurement of the m copies does better (Theorem 1).', 15, ink, 'start', 'bold');
  return s;
}
// Right: Fisher information per copy, Table 1 (alpha = 1/2)
const P = { x0: 715, x1: 1140, y0: 315, y1: 150 };
const px = m => P.x0 + (m - 1) / 9 * (P.x1 - P.x0);
const py = v => P.y0 - (v - 2.4) / (3.1 - 2.4) * (P.y0 - P.y1);
function perCopy() {
  let s = `<path d="M${P.x0} ${P.y1 - 10} V${P.y0} H${P.x1 + 8}" stroke="${muted}" stroke-opacity=".7" stroke-width="1.6" fill="none"/>`;
  s += `<path d="M${P.x0} ${f(py(Q))} H${P.x1}" stroke="${quant}" stroke-width="2" stroke-dasharray="3 5"/>`;
  s += text(P.x1, py(Q) - 8, 'quantum limit Q = 3', 13.5, quant, 'end', 'bold');
  s += `<path d="M${P.x0} ${f(py(F1))} H${P.x1}" stroke="${sep}" stroke-width="2" stroke-dasharray="8 5"/>`;
  s += text(P.x1, py(F1) + 20, 'measuring copies separately', 13.5, sep, 'end', 'bold');
  s += `<path d="M${FM.map((F, i) => `${f(px(i + 1))} ${f(py(F / (i + 1)))}`).join(' L')}" stroke="${bright}" stroke-width="3" fill="none"/>`;
  for (const [i, F] of FM.entries()) s += `<circle cx="${f(px(i + 1))}" cy="${f(py(F / (i + 1)))}" r="4" fill="${bright}"/>`;
  s += text(px(4.2), py(2.80), 'best joint measurement', 14, bright, 'start', 'bold');
  for (const m of [1, 4, 7, 10]) s += text(f(px(m)), P.y0 + 20, String(m), 12.5, dim, 'middle');
  for (const v of [2.5, 2.75, 3]) s += text(P.x0 - 8, f(py(v) + 4), v.toFixed(2).replace(/0$/, ''), 12.5, dim, 'end');
  s += text(P.x0 - 4, P.y1 - 30, 'Fisher information per copy (coherent squeezing, α = 1/2)', 14, dim, 'start', 'normal', SERIF);
  s += text(P.x1, P.y0 + 40, 'number of copies m · exact values (Table 1)', 13, dim, 'end', 'normal', SERIF);
  s += text(P.x0, P.y0 + 62, 'total shortfall from the quantum limit never exceeds λ²/2', 14, quant, 'start', 'bold');
  return s;
}
const draw = () => text(40, 52, 'One bright mode is enough', 28, ink, 'start', 'normal', SERIF) +
  text(40, 82, 'The best Gaussian measurement of many copies of a light beam gathers the signal into one output and measures every output by homodyne detection', 15.5, muted) +
  scheme() + `<path d="M640 150 L 640 370" stroke="${muted}" stroke-opacity=".25" stroke-width="1.2"/>` + perCopy();
const description = 'Banner for a paper on the best Gaussian measurement of m identical copies of a pure single-mode Gaussian state of light. Left: four identical copies enter an interferometer that adds them coherently; one bright output (gold, thick arrow) carries all of the changing mean and is measured by homodyne detection at an optimised angle, while three dark outputs (blue, dashed) are measured along a fixed axis. By the paper\'s Theorem 1 no Gaussian measurement of the copies, even with auxiliary light, does better. Right: for the paper\'s coherent-squeezing example with alpha = 1/2, the Fisher information per copy of the best joint measurement (gold points, exact values from Table 1 for m = 1 to 10) rises above the value for measuring copies separately (81/32, salmon dashed line) towards the quantum limit 3 (violet dotted line); by Corollary 1 the total shortfall from the quantum limit never exceeds lambda squared over 2. Lines merely join the exact points.';
function frame(inner, background) {
  return bannerSvg({ inner, description, background, glow: { color: bright, cx: '0.3', cy: '0.45', r: '0.4', opacity: '0.06' } });
}
const thumbSpec = {
  kicker: ['RESEARCH RELEASE · OCTOBER 2026', 'GAUSSIAN QUANTUM METROLOGY'],
  head: ['One bright mode', '<em>is enough.</em>'], headSize: 66,
  sub: 'For m copies of a pure single-mode Gaussian state, no Gaussian measurement beats gathering the signal into one output and homodyning every output.',
  tag: 'UNREFEREED CANDIDATE',
  hero: '<div class="eq-label">best Fisher information of m copies</div><div class="hero-title">exact, one angle</div><div class="note">attained by concentration + homodyne<br>shortfall from quantum limit ≤ λ²/2<br>joint helps iff λab ≠ 0</div><div class="eq-foot">pure single-mode models · written proofs</div>'
};
module.exports = { draw, description, thumbSpec, FM };
if (require.main === module) (async () => {
  const fs = require('fs'), pth = require('path'), os = require('os'), vm = require('vm');
  const ROOT = pth.join(__dirname, '..');
  // Guards against the paper's Table 1: per-copy value increases, stays between F_1 and Q.
  const per = FM.map((F, i) => F / (i + 1));
  if (!per.every((v, i) => i === 0 || v > per[i - 1]) || Math.abs(per[0] - F1) > 1e-12 || !per.every(v => v >= F1 && v < Q)) throw new Error('Table 1 pattern mismatch');
  const reg = JSON.parse(fs.readFileSync(pth.join(ROOT, 'data/BANNER_PALETTES.json'), 'utf8'));
  const { palettes } = require('./banner-palettes');
  const bsaved = reg.assignments.find(r => r.slug === SLUG); if (!bsaved) throw new Error('no saved banner palette'); const bname = bsaved.palette;
  const tp = require('./thumbnail-palettes');
  const tsaved = tp.load().assignments.find(r => r.slug === SLUG); if (!tsaved) throw new Error('no saved thumbnail palette');
  const tname = tsaved.editorialPalette || tsaved.palette;
  const svg = frame(draw(), { name: bname, colors: palettes[bname] });
  fs.writeFileSync(pth.join(ROOT, 'assets/art', SLUG + '.svg'), svg);
  console.log('art:', SLUG, 'banner palette', bname, '| thumbnail palette', tname);
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
