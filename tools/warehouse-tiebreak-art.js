'use strict';
const { bannerSvg } = require('./svg-xml');
// Stability and tie-breaking in online warehouse reoptimisation: banner, OG card and thumbnail.
// "This image helps the reader understand" that two plans with exactly the same number of trips for five orders and a
// two-bin cart, (1,2,2) "remainder first" and (2,2,1) "full first", lead to completely different backlogs once the plan
// is recomputed whenever new orders arrive: remainder first is stable only below about 76% of capacity with two bins
// (Theorem 9, Table 1), full first up to capacity.
// Source (paper 0.1.0-candidate, 31 Oct 2026): results/b_main/queue_trace.csv from code/certify_thresholds_and_simulate.py
// (one synthetic stream of 30,000 Poisson arrivals at rate 1.8 per tour, capacity 2, tour time 1, i.e. 90% of capacity,
// served by both rules). Backlog sampled at 41 equally spaced times (last trace value at or before each time).
// Thresholds: results/b_main/thresholds.csv (c = 2: 0.7619; c = 8: 0.4920; limit 1/e).
// Usage: node tools/warehouse-tiebreak-art.js [--render OUTDIR_FOR_INSPECTION] [--no-mirror]
const SLUG = 'warehouse-reoptimisation-tie-breaking';
const ink = '#f4f1ea', muted = '#e3d9c9', dim = '#c4b7a2';
const rfC = '#ff9f6e', ffC = '#8fe3c4';
const SANS = 'Arial,Helvetica,sans-serif', SERIF = 'Georgia,serif';
const text = (x, y, s, size = 18, color = ink, anchor = 'start', weight = 'normal', family = SANS) =>
  `<text class="og-hide" x="${x}" y="${y}" fill="${color}" font-family="${family}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}">${s}</text>`;
const f = v => (+v).toFixed(1);
const T_END = 16645.5;
const RF = [0, 40, 147, 289, 388, 521, 658, 786, 907, 1002, 1110, 1249, 1393, 1516, 1636, 1797, 1928, 2034, 2168, 2282, 2389,
  2498, 2620, 2712, 2905, 3032, 3166, 3274, 3398, 3513, 3637, 3738, 3850, 3959, 4116, 4204, 4260, 4361, 4467, 4584, 4765];
const FF = [0, 2, 5, 1, 1, 5, 5, 10, 0, 10, 8, 8, 10, 9, 4, 8, 5, 5, 1, 4, 8, 0, 6, 1, 6, 17, 8, 12, 1, 12, 5, 1, 2, 3, 2,
  4, 3, 1, 2, 11, 1];

// Left: the two tied plans, drawn as three cart trips of two bins each.
function plan(y, sizes, color, label, verdict) {
  let s = text(40, y - 26, label, 17, color, 'start', 'bold');
  sizes.forEach((n, k) => {
    const x = 40 + k * 112;
    s += `<rect x="${x}" y="${y - 6}" width="92" height="46" rx="9" fill="${color}" fill-opacity=".07" stroke="${color}" stroke-opacity=".8" stroke-width="1.8"/>`;
    for (let b = 0; b < 2; b++) {
      const bx = x + 12 + b * 38;
      s += `<rect x="${bx}" y="${y + 3}" width="30" height="28" rx="5" fill="none" stroke="${muted}" stroke-opacity=".55" stroke-width="1.3"/>`;
      if (b < n) s += `<circle cx="${bx + 15}" cy="${y + 17}" r="8.5" fill="${color}"/>`;
    }
    s += text(x + 46, y + 60, `trip ${k + 1}`, 12, dim, 'middle');
    if (k < 2) s += `<path d="M${x + 96} ${y + 17} h12" stroke="${muted}" stroke-opacity=".6" stroke-width="1.5"/>`;
  });
  s += text(372, y + 12, verdict[0], 15, color, 'start', 'bold');
  s += text(372, y + 31, verdict[1], 15, color, 'start', 'bold');
  return s;
}
// Right: backlog on one shared arrival stream at 90% of capacity.
const P = { x0: 660, x1: 1140, y0: 330, y1: 150 };
const YMAX = 5000;
const px = i => P.x0 + i / (RF.length - 1) * (P.x1 - P.x0), py = q => P.y0 - q / YMAX * (P.y0 - P.y1);
function chart() {
  let s = `<path d="M${P.x0} ${P.y1 - 8} V${P.y0} H${P.x1 + 8}" stroke="${muted}" stroke-opacity=".7" stroke-width="1.6" fill="none"/>`;
  const line = (arr, c, w) => `<path d="M` + arr.map((q, i) => `${f(px(i))} ${f(py(q))}`).join(' L') + `" stroke="${c}" stroke-width="${w}" fill="none" stroke-linejoin="round"/>`;
  s += line(RF, rfC, 3.2) + line(FF, ffC, 3.2);
  for (const q of [0, 2500, 5000]) s += text(P.x0 - 8, py(q) + 4, q.toLocaleString('en-GB'), 12, dim, 'end');
  s += text(px(40) - 4, py(RF[40]) - 12, `remainder first: ${RF[40].toLocaleString('en-GB')} waiting`, 15, rfC, 'end', 'bold');
  s += text(px(40) - 4, py(0) - 12, 'full first: a handful waiting', 15, ffC, 'end', 'bold');
  s += text(P.x0 - 4, P.y1 - 22, 'orders waiting, same arrivals, two bins, 90% of capacity', 14, dim, 'start', 'normal', SERIF);
  s += text(P.x1, P.y0 + 22, 'time (30,000 orders arrive)', 13, dim, 'end', 'normal', SERIF);
  return s;
}
const draw = () => text(40, 52, 'Five orders, two bins: a tie that decides stability', 27, ink, 'start', 'normal', SERIF) +
  text(40, 82, 'Both plans need three trips; reoptimising each time orders arrive turns the choice into a different queue', 16, muted) +
  plan(162, [1, 2, 2], rfC, 'remainder first (1, 2, 2)', ['backlog explodes above', '76% of capacity']) +
  plan(278, [2, 2, 1], ffC, 'full first (2, 2, 1)', ['stable up to', 'full capacity']) +
  text(40, 382, 'remainder first breaks down at 76% (2 bins), 49% (8 bins), tending to 1/e ≈ 37% for huge carts', 13, dim, 'start', 'normal', SERIF) +
  `<path d="M612 150 L 612 350" stroke="${muted}" stroke-opacity=".25" stroke-width="1.2"/>` + chart() +
  text(1160, 388, 'one synthetic Poisson stream from the paper, served by both rules', 12, dim, 'end', 'normal', SERIF);
const description = 'Banner for a paper on how breaking ties between equally fast plans changes stability in warehouse order picking. Left: five orders and a cart with two bins; the plan remainder first takes one order on the first trip and two on each of the next two, the plan full first takes two, two and then one; both need three trips. Remainder first is labelled as letting the backlog explode above 76 per cent of capacity, full first as stable up to full capacity; a note gives the remainder-first breakdown points as 76 per cent with two bins, 49 per cent with eight and tending to 1 over e, about 37 per cent, for very large carts. Right: the number of orders waiting over time when one synthetic stream of 30,000 Poisson arrivals at 90 per cent of capacity is served by both rules; the remainder-first backlog climbs steadily to 4,765 while full first keeps only a handful waiting. Values are from the paper\'s computed thresholds and its synthetic queue trace.';
function frame(inner, background) {
  return bannerSvg({ inner, description, background, glow: { color: ffC, cx: '0.78', cy: '0.6', r: '0.4', opacity: '0.06' } });
}
const thumbSpec = {
  kicker: ['RESEARCH RELEASE · OCTOBER 2026', 'WAREHOUSE ORDER PICKING'],
  head: ['Same three trips,', '<em>different fate.</em>'], headSize: 66,
  sub: 'Five orders, two bins: plans (1,2,2) and (2,2,1) tie. If the picker reoptimises as orders arrive, taking the remainder first makes the backlog explode at 76% of capacity; filling the cart first stays stable.',
  tag: 'UNREFEREED CANDIDATE',
  hero: '<div class="eq-label">remainder first breaks down at</div><div class="hero-title">76% → 1/e</div><div class="note">2 bins: 76% · 8 bins: 49%<br>full first: stable to capacity<br>low-rate conjecture proved</div><div class="eq-foot">one-shelf model · proofs · synthetic simulation</div>'
};
module.exports = { draw, description, thumbSpec, RF, FF };
if (require.main === module) (async () => {
  const fs = require('fs'), pth = require('path'), os = require('os'), vm = require('vm');
  const ROOT = pth.join(__dirname, '..');
  // Guard against the source data: shared endpoints and the reported divergence.
  if (RF.length !== 41 || FF.length !== 41 || RF[40] !== 4765 || Math.max(...FF) > 30 || RF.some((q, i) => i && q < RF[i - 1] - 200)) throw new Error('queue trace mismatch');
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
