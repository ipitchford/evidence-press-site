'use strict';
const { bannerSvg } = require('./svg-xml');
// Inhibitor segregation: banner, OG card and thumbnail.
// "This image helps the reader understand" that a division which keeps every substrate molecule S together
// while exporting inhibitor I lets S outgrow its inhibitor, and that bulk export at division destabilises over
// a wider range than removing the same mean amount by a well-mixed reaction (Theorem 3.1, Corollary 6.2).
// Sources (paper 1.0.0-candidate, 31 Oct 2026): conversion threshold lambda*log(1/p) = d - b and well-mixed
// threshold lambda*(1-p) = d - b for b = c = 1, d = 2 (Figure 1); example P in [0.79744, 0.79751] (Section 7.1).
// Left: schematic of one division (not data). Right: exact threshold curves plotted from the formulas.
// Usage: node tools/inhibitor-segregation-art.js [--render OUTDIR_FOR_INSPECTION] [--no-mirror]
const SLUG = 'inhibitor-segregation-explosion';
const ink = '#f4f1ea', muted = '#e3d9c9', dim = '#c4b7a2';
const sCol = '#ffb86b', iCol = '#7fd6e0', gold = '#e9c46a', wm = '#f4f1ea';
const SANS = 'Arial,Helvetica,sans-serif', SERIF = 'Georgia,serif';
const text = (x, y, s, size = 18, color = ink, anchor = 'start', weight = 'normal', family = SANS) =>
  `<text class="og-hide" x="${x}" y="${y}" fill="${color}" font-family="${family}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}">${s}</text>`;
const f = v => (+v).toFixed(1);
const dot = (x, y, c, r = 6) => `<circle cx="${f(x)}" cy="${f(y)}" r="${r}" fill="${c}"/>`;
const cell = (cx, cy, r) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#ffffff" fill-opacity=".06" stroke="${muted}" stroke-opacity=".75" stroke-width="2"/>`;
// fixed pseudo-random positions inside a disc (deterministic)
const pts = (cx, cy, r, n, seed) => Array.from({ length: n }, (_, k) => {
  const a = (k * 2.39996 + seed) % (2 * Math.PI), rr = r * Math.sqrt((k + 0.5) / n) * 0.78;
  return [cx + rr * Math.cos(a), cy + rr * Math.sin(a)];
});
function division() {
  let s = cell(150, 235, 78);
  pts(150, 235, 78, 7, 0.3).forEach(([x, y]) => { s += dot(x, y, sCol); });
  pts(150, 235, 78, 6, 1.9).forEach(([x, y]) => { s += dot(x + 4, y - 3, iCol); });
  s += `<path d="M238 235 H300" stroke="${muted}" stroke-width="2.4" marker-end="url(#ah)"/>`;
  s += text(269, 222, 'division', 13, dim, 'middle', 'normal', SERIF);
  s += text(269, 256, 'at rate λs', 13, dim, 'middle', 'normal', SERIF);
  s += cell(385, 180, 62);
  pts(385, 180, 62, 7, 0.3).forEach(([x, y]) => { s += dot(x, y, sCol, 5.5); });
  s += dot(422, 207, iCol, 5.5);
  s += cell(385, 318, 46);
  pts(385, 318, 46, 5, 2.2).forEach(([x, y]) => { s += dot(x, y, iCol, 5.5); });
  s += text(458, 172, 'all substrate S', 14, sCol, 'start', 'bold');
  s += text(458, 191, 'keeps growing', 14, sCol, 'start');
  s += text(442, 316, 'exported inhibitor I', 14, iCol, 'start', 'bold');
  s += text(442, 335, 'inert daughter', 14, iCol, 'start');
  s += dot(70, 375, sCol, 5) + text(82, 380, 'S: makes more S', 13, dim);
  s += dot(210, 375, iCol, 5) + text(222, 380, 'I: removes S', 13, dim);
  return s;
}
const P = { x0: 690, x1: 1130, y0: 330, y1: 135 };
const px = p => P.x0 + p * (P.x1 - P.x0), py = l => P.y0 - l / 7 * (P.y0 - P.y1);
function phase() {
  const n = 160, ps = Array.from({ length: n + 1 }, (_, k) => 0.002 + 0.858 * k / n);
  const g = ps.map(p => [p, Math.min(7, 1 / -Math.log(p))]);
  const w = ps.map(p => [p, Math.min(7, 1 / (1 - p))]);
  const line = arr => 'M' + arr.map(([p, l]) => `${f(px(p))} ${f(py(l))}`).join(' L');
  const pc = Math.exp(-1 / 7);
  let s = `<path d="${line(g)} L${f(px(pc))} ${f(py(7))} L${f(px(0))} ${f(py(7))} Z" fill="#ffffff" fill-opacity=".10"/>`;
  s += `<path d="M${P.x0} ${P.y1 - 8} V${P.y0} H${P.x1 + 8}" stroke="${muted}" stroke-opacity=".7" stroke-width="1.6" fill="none"/>`;
  s += `<path d="${line(g)}" stroke="${gold}" stroke-width="3.4" fill="none"/>`;
  s += `<path d="${line(w)}" stroke="${wm}" stroke-width="2.2" stroke-dasharray="8 6" fill="none"/>`;
  s += dot(px(0), py(3), gold, 6.5);
  s += text(px(0) + 12, py(3) - 10, 'example: P(explosion) ≈ 0.7975', 13.5, gold, 'start', 'bold');
  s += text(px(0.03), py(6.3), 'explosion possible', 15, ink, 'start', 'bold');
  s += text(px(0.98), py(0.55), 'safe', 15, muted, 'end', 'bold');
  s += text(px(0.40), py(0.30), 'division: λ·log(1/p) = d − b', 13.5, gold, 'start', 'bold');
  s += text(px(0.06), py(2.45), 'well-mixed removal', 13, wm, 'start');
  s += text(px(0.06), py(2.45) + 17, 'λ(1 − p) = d − b', 13, wm, 'start');
  for (const [p, lab] of [[0, '0'], [0.25, '0.25'], [0.5, '0.5'], [0.75, '0.75'], [1, '1']]) s += text(f(px(p)), P.y0 + 20, lab, 12.5, dim, 'middle');
  for (const l of [0, 2, 4, 6]) s += text(P.x0 - 8, f(py(l) + 4), String(l), 12.5, dim, 'end');
  s += text(P.x0 - 4, P.y1 - 20, 'division coefficient λ (b = c = 1, d = 2)', 14, dim, 'start', 'normal', SERIF);
  s += text(P.x1, P.y0 + 40, 'probability p that an inhibitor stays', 13, dim, 'end', 'normal', SERIF);
  return s;
}
const defs = `<defs><marker id="ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="${muted}"/></marker></defs>`;
const draw = () => defs + text(40, 52, 'Dividing compartments can throw away the brakes', 27, ink, 'start', 'normal', SERIF) +
  text(40, 82, 'Keep all substrate together, export the inhibitor, and a chemistry that is safe on its own can explode', 16, muted) +
  division() + `<path d="M620 150 L 620 380" stroke="${muted}" stroke-opacity=".25" stroke-width="1.2"/>` + phase();
const description = 'Banner for a paper showing that a nonexplosive reaction network can explode inside dividing compartments without any inflow reactions. Left: a schematic division (not data): a compartment holding substrate S (orange) and inhibitor I (blue) divides at rate lambda times its substrate count; one daughter keeps every S molecule and little inhibitor and keeps growing, the other receives the exported inhibitor and is inert. Right: the exact explosion threshold for conversion inhibition with b = c = 1 and d = 2, plotted from the paper\'s formulas, with inhibitor retention probability p on the horizontal axis and the division coefficient lambda on the vertical axis. Above the gold curve, lambda times log(1/p) equals d minus b, explosion is possible; on and below it the model is safe. The dashed curve is the threshold when the same mean amount of inhibitor is removed by an ordinary well-mixed reaction instead, lambda times (1 minus p) equals d minus b; the band between the curves is the purely compartmental effect. The dot marks the worked example, lambda = 3 with all inhibitor exported, whose explosion probability is about 0.7975.';
function frame(inner, background) {
  return bannerSvg({ inner, description, background, glow: { color: sCol, cx: '0.25', cy: '0.6', r: '0.4', opacity: '0.06' } });
}
const thumbSpec = {
  kicker: ['RESEARCH RELEASE · OCTOBER 2026', 'STOCHASTIC REACTION NETWORKS · COMPARTMENTS'],
  head: ['Throw away the brakes,', '<em>and it explodes.</em>'], headSize: 64,
  sub: 'A chemistry that is safe on its own explodes once dividing compartments keep the substrate together and export the inhibitor. No inflow reactions needed.',
  tag: 'UNREFEREED CANDIDATE',
  hero: '<div class="eq-label">explosion possible iff</div><div class="hero-title">d + λ E log Q &lt; b</div><div class="note">bulk export beats well-mixed removal<br>example: P(explosion) ≈ 0.7975</div><div class="eq-foot">two species · exact thresholds</div>'
};
module.exports = { draw, description, thumbSpec };
if (require.main === module) (async () => {
  const fs = require('fs'), pth = require('path'), os = require('os'), vm = require('vm');
  const ROOT = pth.join(__dirname, '..');
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
