'use strict';
const { bannerSvg } = require('./svg-xml');
// Sharp qutrit discrimination and complementary correlation bounds: banner, OG card and thumbnail.
// "This image helps the reader understand" that two complementary qutrit measurements can score at most 8/3 out of a trivial
// ceiling of 4 when telling two orthogonal states apart (proved, exact certificate), and that for a qubit with a qudit every
// complementary pair is fooled from dimension n = 4, where previously this was known only from n = 164.
// Source (paper 0.1.0-candidate): Theorem 2.1 (S <= 8/3, equality classified), Corollary 2.2 (2/3 Fisher efficiency),
// Theorem 4.1 and Table 1 (every prescribed pair for n >= 4; previously n >= 164, Qian Theorem 4.1), Table 1 (n = 2 holds, n = 3 open).
// Usage: node tools/qutrit-discrimination-art.js [--render OUTDIR_FOR_INSPECTION] [--no-mirror]
const SLUG = 'qutrit-complementary-discrimination';
const ink = '#f4f1ea', muted = '#e3d9c9', dim = '#c4b7a2';
const lineC = '#8cc8ff', bestC = '#ffd77a', ceilC = '#ff8a8a', okC = '#9be3c0', openC = '#c9b8ff';
const SANS = 'Arial,Helvetica,sans-serif', SERIF = 'Georgia,serif';
const text = (x, y, s, size = 18, color = ink, anchor = 'start', weight = 'normal', family = SANS) =>
  `<text class="og-hide" x="${x}" y="${y}" fill="${color}" font-family="${family}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}">${s}</text>`;
const f = v => (+v).toFixed(1);
// Exact values drawn: best score 8/3, trivial ceiling 4 (each of two triangular discriminations is at most 2), efficiency (8/3)/4 = 2/3.
const BEST = 8 / 3, CEIL = 4, EFF = BEST / CEIL;
const NEW_FROM = 4, OLD_FROM = 164;
// Left: number line of the summed triangular discrimination S.
const LX0 = 70, LX1 = 640, LY = 236;
const X = s => LX0 + (LX1 - LX0) * s / CEIL;
function numberLine() {
  let s = text(LX0, 128, 'Telling two orthogonal qutrit states apart', 16, ink, 'start', 'bold', SERIF);
  s += text(LX0, 150, 'score S = summed triangular discrimination over two complementary bases', 13, dim);
  s += `<rect x="${f(X(0))}" y="${LY - 9}" width="${f(X(BEST) - X(0))}" height="18" rx="4" fill="${lineC}" fill-opacity=".55"/>`;
  s += `<rect x="${f(X(BEST))}" y="${LY - 9}" width="${f(X(CEIL) - X(BEST))}" height="18" rx="4" fill="${ceilC}" fill-opacity=".14" stroke="${ceilC}" stroke-opacity=".5" stroke-dasharray="5 4"/>`;
  for (const v of [0, 1, 2, 3, 4]) {
    s += `<path d="M${f(X(v))} ${LY + 12} V${LY + 20}" stroke="${muted}" stroke-width="1.4"/>` + text(X(v), LY + 38, String(v), 14, dim, 'middle');
  }
  s += `<path d="M${f(X(BEST))} ${LY - 46} V${LY + 14}" stroke="${bestC}" stroke-width="3"/>`;
  s += text(X(BEST), LY - 56, '8/3 · proved best', 18, bestC, 'middle', 'bold', SERIF);
  s += `<path d="M${f(X(CEIL))} ${LY - 30} V${LY + 14}" stroke="${ceilC}" stroke-width="2" stroke-dasharray="4 3"/>`;
  s += text(X(CEIL) - 2, LY - 36, '4 · trivial ceiling', 14, ceilC, 'end');
  s += text(X(1.3), LY - 20, 'reachable', 13, ink, 'middle');
  s += text((X(BEST) + X(CEIL)) / 2, LY + 62, 'never reached', 13, ceilC, 'middle');
  s += text(LX0, LY + 92, 'Equality only on special planes tied to the nine Hesse SIC rays · exact certificate', 13, dim, 'start', 'normal', SERIF);
  s += text(LX0, LY + 114, 'Fisher-information efficiency of two random complementary settings ≤ 2/3', 13, dim, 'start', 'normal', SERIF);
  return s;
}
// Right: qubit with a qudit of dimension n, every prescribed complementary pair fooled by a separable state.
const RX0 = 730, RW = 420;
const NX = n => RX0 + RW * (Math.log(n) - Math.log(1.6)) / (Math.log(2000) - Math.log(1.6));
function panel() {
  let s = text(RX0, 128, 'Qubit with a dimension-n system', 16, ink, 'start', 'bold', SERIF);
  s += text(RX0, 150, 'can any choice of complementary measurements be trusted?', 13, dim);
  const y1 = 200, y2 = 256;
  s += text(RX0, y1 - 10, 'before: every pair fooled only from n = 164', 13, dim);
  s += `<rect x="${f(NX(OLD_FROM))}" y="${y1}" width="${f(RX0 + RW - NX(OLD_FROM))}" height="16" rx="3" fill="${ceilC}" fill-opacity=".7"/>`;
  s += text(RX0, y2 - 10, 'now: every pair fooled from n = 4 (separable state)', 13, okC, 'start', 'bold');
  s += `<rect x="${f(NX(NEW_FROM))}" y="${y2}" width="${f(RX0 + RW - NX(NEW_FROM))}" height="16" rx="3" fill="${okC}" fill-opacity=".8"/>`;
  s += `<rect x="${f(NX(2) - 5)}" y="${y2}" width="10" height="16" rx="2" fill="${muted}" fill-opacity=".7"/>`;
  s += `<rect x="${f(NX(3) - 5)}" y="${y2}" width="10" height="16" rx="2" fill="${openC}" fill-opacity=".8"/>`;
  for (const n of [2, 3, 4, 10, 100, 164]) s += text(NX(n), y2 + 36, n === 100 ? '' : String(n), 13, dim, 'middle');
  s += text(NX(2) - 6, y2 + 56, 'n = 2: holds · n = 3: open', 12, openC, 'start');
  s += text(RX0, 352, 'margin −9/20,000,000 nats: tiny, but certified exactly', 13, dim, 'start', 'normal', SERIF);
  return s;
}
const draw = () =>
  text(40, 52, 'Complementary measurements: a sharp 8/3 for qutrits, and no safe choice from n = 4', 26, ink, 'start', 'normal', SERIF) +
  text(40, 80, 'Two complementary tables cannot certify total correlation for a qubit paired with any system of dimension 4 or more', 15, muted) +
  numberLine() + `<path d="M690 108 L 690 372" stroke="${muted}" stroke-opacity=".22" stroke-width="1.2"/>` + panel();
const description = 'Banner for a paper on complementary quantum measurements. Left: a number line from 0 to 4 for the score S, the summed triangular discrimination of two orthogonal qutrit states over two complementary bases. The band from 0 to 8/3 is shaded as reachable; a gold marker at 8/3 reads proved best, and the stretch from 8/3 to the trivial ceiling 4 is dashed and labelled never reached. Notes: equality only on special planes tied to the nine Hesse SIC rays, exact certificate; Fisher-information efficiency of two random complementary settings at most 2/3. Right: for a qubit with a system of dimension n on a logarithmic axis, a red bar shows that every complementary pair was previously known to be fooled only from n = 164, and a green bar shows it is now fooled from n = 4 by a separable state; n = 2 holds and n = 3 is open. The certified margin, minus 9 over 20 million nats, is tiny.';
function frame(inner, background) {
  return bannerSvg({ inner, description, background, glow: { color: bestC, cx: '0.30', cy: '0.55', r: '0.42', opacity: '0.06' } });
}
const thumbSpec = {
  kicker: ['RESEARCH RELEASE · NOVEMBER 2026', 'QUANTUM INFORMATION · COMPLEMENTARY MEASUREMENTS'],
  head: ['Two quantum tables:', '<em>best score 8/3, not 4</em>'], headSize: 66,
  sub: 'Complementary measurements on a qutrit can never score above 8/3 when telling two states apart. And for a qubit with a system of dimension 4 or more, every choice of them is fooled.',
  tag: 'UNREFEREED CANDIDATE',
  hero: '<div class="eq-label">every complementary pair fooled from</div><div class="hero-title">n = 4</div><div class="note">previously n = 164<br>qutrit score ≤ 8/3, proved<br>Fisher efficiency ≤ 2/3</div><div class="eq-foot">exact certificate · computer-assisted</div>'
};
module.exports = { draw, description, thumbSpec, BEST, CEIL, EFF };
if (require.main === module) (async () => {
  const fs = require('fs'), pth = require('path'), os = require('os'), vm = require('vm');
  const ROOT = pth.join(__dirname, '..');
  if (Math.abs(EFF - 2 / 3) > 1e-12 || Math.abs(BEST - 8 / 3) > 1e-12 || CEIL !== 2 * 2) throw new Error('values mismatch with Theorem 2.1 / Corollary 2.2');
  if (NEW_FROM !== 4 || OLD_FROM !== 164) throw new Error('dimensions mismatch with Theorem 4.1 / Table 1');
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
