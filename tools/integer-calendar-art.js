'use strict';
const { bannerSvg, escapeText } = require('./svg-xml');
// Integer calendars for fixed-turnover replenishment. Banner, OG card and thumbnail.
// Source: paper of 31 Oct 2026 (DOI 10.5281/zenodo.23845965).
//  - Left: the three-day example of Section 4.1 (path with edge lengths 1 and 2, turnovers 2 and 3).
//    Power-of-two calendar (Bosman et al.): both clients every 2 days, cost 3 per day.
//    Integer calendar at phase 3/2: clocks 3/2 and 3 rounded up, days ceil(3k/2) and 3k; cost 8/3 per day.
//    Both costs are recomputed below from the round-trip weights 2 and 4.
//  - Right: worst-case cost factors relative to the best schedule: 2 (Bosman et al. 2022, Theorem 4),
//    between 1.6001 and 1.6014 for constant gaps that divide one another (Theorem 9),
//    1/ln 2 = 1.4427 for integer calendars (Theorem 1; exact for cycles <= longest turnover, Theorem 7).
// Usage: node tools/integer-calendar-art.js [--render OUTDIR_FOR_INSPECTION] [--no-mirror]
const SLUG = 'integer-calendar-replenishment';

const DAYS = 12;
const served = (p, t) => Math.floor(t / p) > Math.floor((t - 1) / p); // day t in {ceil(k p)}
const cost = (pNear, pFar) => { // round-trip weights: first edge 2, second edge 4
  let c = 0;
  for (let t = 1; t <= DAYS; t++) { const n = served(pNear, t), f = served(pFar, t); c += (n || f ? 2 : 0) + (f ? 4 : 0); }
  return c / DAYS;
};
const costPow = cost(2, 2), costInt = cost(1.5, 3);
const must = (c, m) => { if (!c) throw new Error('check failed: ' + m); };
must(costPow === 3, 'power-of-two calendar costs 3 per day');
must(Math.abs(costInt - 8 / 3) < 1e-12, 'integer calendar costs 8/3 per day');
// feasibility: every gap at most the turnover
for (const [p, tau] of [[1.5, 2], [3, 3], [2, 2]]) {
  let last = 0; for (let t = 1; t <= 4 * DAYS; t++) if (served(p, t)) { must(t - last <= tau, 'gap within turnover'); last = t; }
}

const ink = '#f4f0ea', muted = '#ddd3c8', dim = '#bcb0a3';
const nearC = '#ffd27a', farC = '#9fd8ff', goodC = '#9fe8b8', oldC = '#ffb3a1', midC = '#e2c2ff';
const SANS = 'Arial,Helvetica,sans-serif', SERIF = 'Georgia,serif';
const text = (x, y, s, size = 18, color = ink, anchor = 'start', weight = 'normal', family = SANS) =>
  `<text x="${x}" y="${y}" fill="${color}" font-family="${family}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}">${escapeText(s)}</text>`;
const f = v => (+v).toFixed(1);

function calendarPanel() {
  let s = text(40, 118, 'Two clients on one road: deadlines 2 and 3 days', 15, ink, 'start', 'bold');
  const x0 = 150, cw = 25, ch = 17, gap = 3;
  const block = (y, title, pN, pF, c, col) => {
    let b = text(40, y - 8, title, 13, col, 'start', 'bold');
    [['near', pN, nearC], ['far', pF, farC]].forEach(([lab, p, cc], r) => {
      const yy = y + r * (ch + gap);
      b += text(x0 - 10, yy + 13, lab, 12, muted, 'end');
      for (let t = 1; t <= DAYS; t++) {
        const on = served(p, t);
        b += `<rect x="${x0 + (t - 1) * (cw + gap)}" y="${yy}" width="${cw}" height="${ch}" rx="3" fill="${on ? cc : '#ffffff'}" fill-opacity="${on ? '.92' : '.08'}"/>`;
      }
    });
    b += text(x0 + DAYS * (cw + gap) + 8, y + 24, c, 14, col, 'start', 'bold');
    return b;
  };
  s += block(160, 'Power of two: both every 2 days', 2, 2, '3 per day', oldC);
  s += block(250, 'Integer calendar: near gaps 2, 1, 2, 1 …', 1.5, 3, '8/3 per day', goodC);
  for (let t = 1; t <= DAYS; t++) s += text(x0 + (t - 1) * (cw + gap) + cw / 2, 316, String(t), 10.5, dim, 'middle');
  s += text(x0 + (DAYS * (cw + gap)) / 2, 334, 'day', 11.5, dim, 'middle');
  s += text(40, 370, 'Round each clock’s event times up to whole days: no deadline is missed,', 12.5, dim);
  s += text(40, 387, 'and clients sharing a road stay synchronised. Here 8/3 is the optimum.', 12.5, dim);
  return s;
}

function scalePanel() {
  const xa = 600, xb = 1150, v0 = 1, v1 = 2.1, X = v => xa + (v - v0) / (v1 - v0) * (xb - xa), Y = 250;
  let s = `<path d="M572 104 V384" stroke="${muted}" stroke-opacity=".18"/>`;
  s += text(600, 118, 'Worst-case cost relative to the best schedule, on trees', 15, ink, 'start', 'bold');
  s += `<path d="M${xa} ${Y} H${xb}" stroke="${muted}" stroke-opacity=".75" stroke-width="1.6"/>`;
  for (const v of [1, 1.2, 1.4, 1.8, 2]) {
    s += `<path d="M${f(X(v))} ${Y - 5} V${Y + 5}" stroke="${muted}" stroke-opacity=".8"/>`;
    s += text(f(X(v)), Y + 22, v.toFixed(1), 12, dim, 'middle');
  }
  s += text(f(X(1)), Y + 40, 'optimum', 11.5, dim, 'middle');
  const marks = [
    { v: 2, col: oldC, up: true, l1: 'factor 2', l2: 'power of two', l3: 'Bosman et al. 2022' },
    { v: 1.6007, col: midC, up: false, l1: '≈ 1.60', l2: 'constant gaps', l3: 'that divide (best possible)' },
    { v: 1 / Math.LN2, col: goodC, up: true, l1: '1/ln 2 ≈ 1.443', l2: 'integer calendar', l3: 'exact for short cycles' }
  ];
  for (const m of marks) {
    const x = X(m.v);
    s += `<circle cx="${f(x)}" cy="${Y}" r="8" fill="${m.col}"/>`;
    const y = m.up ? Y - 26 : Y + 64;
    s += `<path d="M${f(x)} ${m.up ? Y - 12 : Y + 12} V${m.up ? Y - 20 : Y + 44}" stroke="${m.col}" stroke-width="1.6"/>`;
    s += text(f(x), m.up ? y - 34 : y, m.l1, 15, m.col, 'middle', 'bold');
    s += text(f(x), m.up ? y - 17 : y + 17, m.l2, 12.5, muted, 'middle');
    s += text(f(x), m.up ? y : y + 33, m.l3, 12, dim, 'middle');
  }
  s += `<path d="M${f(X(2) - 14)} ${Y - 92} C ${f(X(1.75))} ${Y - 118}, ${f(X(1.6))} ${Y - 118}, ${f(X(1 / Math.LN2) + 16)} ${Y - 94}" fill="none" stroke="${goodC}" stroke-width="2" stroke-dasharray="5 4"/>`;
  s += text(f(X(1.72)), Y - 118, 'improved', 12.5, goodC, 'middle', 'bold');
  return s;
}

const draw = () => text(40, 52, 'Rounding event times, not periods, beats the factor two', 26, ink, 'start', 'normal', SERIF) +
  text(40, 80, 'Fixed-turnover replenishment: visit every client before its stock runs out, at the lowest average routing cost', 14.5, muted) +
  calendarPanel() + scalePanel();

const description = 'Banner for a paper on recurring delivery schedules in which every client must be visited before its stock runs out. Left: the paper\'s three-day example, two clients on one road from the depot with deadlines of 2 and 3 days, shown as rows of twelve days with filled squares on visit days. The power-of-two calendar visits both clients every 2 days and costs 3 per day. The integer calendar, obtained by rounding the event times of clocks with periods 3/2 and 3 up to whole days, visits the near client with gaps 2, 1, 2, 1 and the far client every 3 days, costs 8/3 per day, which is optimal, and never misses a deadline. Right: a number line of worst-case cost relative to the best possible schedule on tree networks. Factor 2 for the power-of-two calendars of Bosman et al. 2022; about 1.60, the best possible when every client keeps a constant gap and the gaps divide one another; and 1/ln 2, about 1.443, for the integer calendar, which is exact for calendars that repeat within the longest deadline. The example costs are recomputed from the paper\'s numbers.';

function frame(inner, background) {
  return bannerSvg({ inner, description, background, glow: { color: goodC, cx: '0.72', cy: '0.55', r: '0.5', opacity: '0.05' } });
}

const thumbSpec = {
  kicker: ['RESEARCH RELEASE · 31 OCTOBER 2026', 'LOGISTICS · APPROXIMATION ALGORITHMS'],
  head: ['From factor 2', '<em>to 1/ln 2 ≈ 1.44.</em>'], headSize: 66,
  sub: 'Round each client’s clock to whole days, not its period: every deadline is met and recurring delivery routes cost at most 44% above the best possible.',
  tag: 'UNREFEREED CANDIDATE',
  hero: '<div class="eq-label">worst-case routing cost on trees</div><div class="hero-title">2 → 1.4427</div><div class="note">exact for calendars that repeat<br>within the longest deadline<br>constant gaps: about 1.60</div><div class="eq-foot">written proofs · exact certificates</div>'
};

module.exports = { draw, description, thumbSpec };
if (require.main === module) (async () => {
  const fs = require('fs'), pth = require('path'), os = require('os'), vm = require('vm');
  const ROOT = pth.join(__dirname, '..');
  console.log('check: calendar costs', costPow, costInt, '| 1/ln2 =', (1 / Math.LN2).toFixed(6));
  const { resolve } = require('./banner-palettes');
  const bg = resolve(SLUG); if (!bg) throw new Error('no banner palette');
  const tname = require('./thumbnail-palettes').resolve(SLUG, true);
  const svg = frame(draw(), bg);
  fs.writeFileSync(pth.join(ROOT, 'assets/art', SLUG + '.svg'), svg);
  console.log('art:', SLUG, 'banner palette', bg.name, '| thumbnail palette', tname);
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
  {
    const p = await b.newPage({ viewport: { width: 1200, height: 400 } });
    await p.setContent(body(1200, 400, svg));
    const out = await p.evaluate(() => [...document.querySelectorAll('text')].map(t => { const r = t.getBBox(); return [t.textContent, r.x, r.y, r.x + r.width, r.y + r.height]; })
      .filter(([, x0, y0, x1, y1]) => x0 < 0 || y0 < 0 || x1 > 1200 || y1 > 400));
    await p.close();
    if (out.length) throw new Error('text outside viewBox: ' + JSON.stringify(out));
    console.log('all text boxes inside the 1200x400 viewBox');
  }
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
