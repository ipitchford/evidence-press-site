'use strict';
const { bannerSvg } = require('./svg-xml');
// Multicategory group homophily: banner, OG card and thumbnail.
// "This image helps the reader understand" that the same 4,600 school contact triples pass a strict-majority homophily
// test for all 10 pupil classrooms but for none of the 5 school years formed by merging them, because merging roughly
// doubles the chance rate of two-of-three groups; and that the sharp ceiling (Theorem 3 / Corollary 1) leaves room with
// 11 or 6 categories (3.92, 2.07) but none with 2 (0.641 < 1, Corollary 2).
// Source (paper 0.1.0-candidate, 3 Nov 2026): Section 7.2 and Appendix B (two-of-three ratios R2 under the observed-node
// hypergeometric baseline, values below copied from empirical_primary_school/k3_classroom_and_year_table.csv, rounded
// to 3 decimals) and Section 7.4 (ceilings 3.920819, 2.065991, 3480040/5429603).
// Data-derived values: SocioPatterns primary-school data (Stehle et al. 2011), CC BY-NC-SA 3.0; the attribution is drawn.
// Usage: node tools/multicategory-homophily-art.js [--render OUTDIR_FOR_INSPECTION] [--no-mirror]
const SLUG = 'multicategory-group-homophily';
const ink = '#f4f1ea', muted = '#e3d9c9', dim = '#c4b7a2';
const roomC = '#9fd2ff', yearC = '#ff9f8a', okC = '#9be3c0', badC = '#f2a7c3';
const SANS = 'Arial,Helvetica,sans-serif', SERIF = 'Georgia,serif';
const text = (x, y, s, size = 18, color = ink, anchor = 'start', weight = 'normal', family = SANS) =>
  `<text class="og-hide" x="${x}" y="${y}" fill="${color}" font-family="${family}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}">${s}</text>`;
const f = v => (+v).toFixed(1);
const ROOMS = [['1A', 1.015], ['1B', 1.267], ['2A', 1.333], ['2B', 1.434], ['3A', 2.145], ['3B', 1.700], ['4A', 2.012], ['4B', 1.265], ['5A', 1.625], ['5B', 1.516]];
const YEARS = [['Y1', 0.613], ['Y2', 0.704], ['Y3', 0.665], ['Y4', 0.808], ['Y5', 0.512]];
const CEIL = [['2 categories (pupils / teachers)', 3480040 / 5429603, badC], ['6 categories (school years)', 2.065991, yearC], ['11 categories (classrooms)', 3.920819, roomC]];
// Left chart geometry.
const X0 = 70, Y0 = 318, Y1 = 128, RMAX = 2.4, BW = 26, GAP = 9;
const Y = r => Y0 - r / RMAX * (Y0 - Y1);
function chart() {
  let s = '';
  for (const r of [0, 1, 2]) s += `<path d="M${X0} ${f(Y(r))} H${X0 + 560}" stroke="${muted}" stroke-opacity="${r ? 0.12 : 0.4}" stroke-width="1"/>` + text(X0 - 8, Y(r) + 4, String(r), 12, dim, 'end');
  let x = X0 + 10;
  for (const [n, r] of ROOMS) { s += `<rect x="${x}" y="${f(Y(r))}" width="${BW}" height="${f(Y0 - Y(r))}" rx="3" fill="${roomC}" fill-opacity="0.92"/>` + text(x + BW / 2, Y0 + 17, n, 11.5, dim, 'middle'); x += BW + GAP; }
  const xr = x; x += 26;
  for (const [n, r] of YEARS) { s += `<rect x="${x}" y="${f(Y(r))}" width="${BW}" height="${f(Y0 - Y(r))}" rx="3" fill="${yearC}" fill-opacity="0.92"/>` + text(x + BW / 2, Y0 + 17, n, 11.5, dim, 'middle'); x += BW + GAP; }
  s += `<path d="M${X0} ${f(Y(1))} H${x}" stroke="${ink}" stroke-width="2" stroke-dasharray="7 5"/>` + text(x + 6, Y(1) + 5, 'chance', 13, ink, 'start', 'bold');
  s += text(X0 + 10, Y(2.4) + 4, '10 classrooms: all above chance → 10/10 pass', 14, roomC, 'start', 'bold');
  s += text(xr + 26, Y(1.62), 'same pupils merged', 13, yearC, 'start', 'bold') + text(xr + 26, Y(1.62) + 17, 'into 5 school years:', 13, yearC, 'start', 'bold') + text(xr + 26, Y(1.62) + 34, 'all below → 0/5 pass', 13, yearC, 'start', 'bold');
  s += text(X0, Y0 + 40, 'two-of-three groups: affinity ratio vs chance (same 4,600 triples)', 12.5, dim, 'start', 'normal', SERIF);
  return s;
}
function panel() {
  const x = 720, L = 250, CMAX = 4.2; let s = text(x, 134, 'Could every category pass at once?', 19, ink, 'start', 'normal', SERIF);
  s += text(x, 158, 'Exact ceiling (Theorem 3); above 1 = room to pass', 13, dim);
  let y = 190; const x1 = x + L / CMAX;
  for (const [lab, v, c] of CEIL) {
    const xe = x + v / CMAX * L;
    s += text(x, y, lab, 13, muted) + `<rect x="${x}" y="${y + 8}" width="${f(v / CMAX * L)}" height="16" rx="3" fill="${c}" fill-opacity="0.92"/>`;
    s += `<path d="M${f(x1)} ${y + 4} V ${y + 28}" stroke="${ink}" stroke-width="1.8" stroke-dasharray="4 3"/>`;
    s += text(Math.max(xe, x1) + 8, y + 22, v.toFixed(2), 15, c, 'start', 'bold');
    y += 52;
  }
  s += text(x1, y - 14, '1', 12, ink, 'middle', 'bold');
  s += text(x, y + 8, 'Two categories, odd group size: never above 1', 12.5, ink) + text(x, y + 24, '(Corollary 2). Years fail only at two-of-three.', 12.5, ink);
  return s;
}
const draw = () =>
  text(40, 52, 'Same 4,600 school groups, two labellings, opposite verdicts', 26, ink, 'start', 'normal', SERIF) +
  text(40, 80, 'With three or more categories every category can look homophilous at once; an exact ceiling says how far, and what blocks it', 15, muted) +
  chart() + `<path d="M690 112 L 690 372" stroke="${muted}" stroke-opacity=".22" stroke-width="1.2"/>` + panel() +
  text(40, 388, 'Exploratory, descriptive: one school, two days. Data: SocioPatterns primary-school contacts (Stehlé et al. 2011), CC BY-NC-SA 3.0, aggregated.', 10.5, dim, 'start', 'normal', SERIF);
const description = 'Banner for a paper on group homophily with three or more categories. Left: in the same 4,600 distinct three-person proximity groups from a primary school, the affinity ratio of groups in which exactly two of three members share a category, against the chance baseline (dashed line at 1). Labelled by the 10 pupil classrooms (blue bars, 1.015 to 2.145) every classroom is above chance, so 10 of 10 pass the strict-majority homophily test; labelled by the 5 school years formed by merging classrooms (red bars, 0.512 to 0.808) every year is below chance, so 0 of 5 pass, although the years are not less segregated: merging roughly doubles the chance rate of two-of-three groups. Right: the paper’s exact ceiling on how far all categories could exceed chance at once: 0.64 with two categories (pupils versus teachers, below 1 as the two-category impossibility requires), 2.07 with six categories (school years) and 3.92 with eleven (classrooms). Exploratory and descriptive; one school over two days. Data: SocioPatterns primary-school contacts (Stehlé et al. 2011), CC BY-NC-SA 3.0, aggregated.';
function frame(inner, background) {
  return bannerSvg({ inner, description, background, glow: { color: roomC, cx: '0.3', cy: '0.6', r: '0.42', opacity: '0.06' } });
}
const thumbSpec = {
  kicker: ['RESEARCH RELEASE · NOVEMBER 2026', 'SOCIAL NETWORKS · GROUP HOMOPHILY'],
  head: ['Same groups,', '<em>opposite verdict</em>'], headSize: 62,
  sub: 'Labelled by classroom, 10 of 10 pass a group homophily test; merged into school years, 0 of 5 do. Three or more categories change what is possible.',
  tag: 'UNREFEREED CANDIDATE',
  hero: '<div class="eq-label">same 4,600 school groups</div><div class="hero-title">10/10 → 0/5</div><div class="note">classrooms pass, school years fail<br>exact ceilings: 3.92 · 2.07 · 0.64<br>two categories, odd size: never above 1</div><div class="eq-foot">data: SocioPatterns, CC BY-NC-SA 3.0</div>'
};
module.exports = { draw, description, thumbSpec };
if (require.main === module) (async () => {
  const fs = require('fs'), pth = require('path'), os = require('os'), vm = require('vm');
  const ROOT = pth.join(__dirname, '..');
  // Guards: counts and ranges quoted in Section 7.2 and the ceilings of Section 7.4.
  if (ROOMS.length !== 10 || !ROOMS.every(([, r]) => r > 1) || YEARS.length !== 5 || !YEARS.every(([, r]) => r < 1)) throw new Error('verdict mismatch');
  if (Math.min(...ROOMS.map(a => a[1])) !== 1.015 || Math.max(...ROOMS.map(a => a[1])) !== 2.145 || Math.min(...YEARS.map(a => a[1])) !== 0.512 || Math.max(...YEARS.map(a => a[1])) !== 0.808) throw new Error('range mismatch');
  if (Math.abs(CEIL[0][1] - 0.641) > 5e-4 || !(CEIL[0][1] < 1)) throw new Error('binary ceiling mismatch');
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
