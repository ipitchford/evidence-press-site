'use strict';
// Exact optimal dispatching to two fluid queues: banner, OG card and thumbnail.
// Sources (paper: Exact optimal dispatching to two fluid queues, 23 Oct 2026):
//  - Running example (Section 1 and Section "The running example"): sizes 1/2 and 3/2 with probability 1/2 each,
//    load rho = 3/4, start (u1, u2) = (1/2, 1/2). Each server works at rate 1/2; a job arriving at a queue with
//    work u costs 2u; jobs arrive at rate rho (mean size one). Coordinates: x = longer, y = shorter queue workload,
//    relative imbalance z = (x - y)/(x + y).
//  - B(h) = 5 - (4/3)h and D = 1/2 on [1/2, 3/2]; the size partition changes at z = h/(D B(h)) at h = 1/2, i.e. 3/13.
//  - Optimal path: all work to the longer queue until z = 3/13; then small jobs to the shorter queue until it
//    empties at (9/14, 0); then the empty queue is kept exactly busy (all small jobs and theta = 5/9 of large ones).
//    Phases last 2/7, 8/7, 18/7 and cost 45/196 + 33/49 + 27/98 = 33/28.
//  - Balanced routing stays on the diagonal and costs 3/2; most-work-left (eq. mwl) costs 21/16 (Table tab:gain).
//  Every plotted vertex and cost below is recomputed here in exact rational arithmetic and asserted.
//
// Usage: node tools/fluid-queue-dispatch-art.js [--render OUTDIR_FOR_INSPECTION] [--no-mirror]
//   Writes assets/art/<slug>.svg; with --render also assets/og/<slug>.png, thumbs/<slug>.jpg,
//   the byte-identical central mirror ~/thumbs/<slug>.jpg (never overwritten) and inspection PNGs.
// Palette registries are NOT written here: the saved assignments in data/*_PALETTES.json are used.
const SLUG = 'fluid-queue-optimal-dispatch';

// ---------- exact rational arithmetic ----------
const gcd = (a, b) => { a = a < 0n ? -a : a; b = b < 0n ? -b : b; while (b) [a, b] = [b, a % b]; return a; };
class Q {
  constructor(n, d = 1n) { n = BigInt(n); d = BigInt(d); if (d < 0n) { n = -n; d = -d; } const g = gcd(n, d) || 1n; this.n = n / g; this.d = d / g; }
  add(o) { o = q(o); return new Q(this.n * o.d + o.n * this.d, this.d * o.d); }
  sub(o) { o = q(o); return new Q(this.n * o.d - o.n * this.d, this.d * o.d); }
  mul(o) { o = q(o); return new Q(this.n * o.n, this.d * o.d); }
  div(o) { o = q(o); return new Q(this.n * o.d, this.d * o.n); }
  eq(o) { o = q(o); return this.n === o.n && this.d === o.d; }
  get v() { return Number(this.n) / Number(this.d); }
  toString() { return this.d === 1n ? `${this.n}` : `${this.n}/${this.d}`; }
}
const q = (a, b) => a instanceof Q ? a : new Q(a, b === undefined ? 1 : b);
const must = (c, m) => { if (!c) throw new Error('exact check failed: ' + m); };

function exactExample() {
  const rho = q(3, 4), half = q(1, 2);
  const small = q(1, 2), pSmall = q(1, 2), large = q(3, 2), pLarge = q(1, 2);
  must(small.mul(pSmall).add(large.mul(pLarge)).eq(1), 'mean size one');
  const workSmall = small.mul(pSmall);                  // work fraction carried by small jobs = 1/4
  // Switch point from the paper's formulas: z = h / (D(h) B(h)) at h = 1/2, D = 1/2, B(h) = 5 - 4h/3.
  const zSwitch = small.div(half.mul(q(5).sub(q(4, 3).mul(small))));
  must(zSwitch.eq(q(3, 13)), 'z switch = 3/13');
  const z = (x, y) => x.sub(y).div(x.add(y));
  // Phase 1: everything to the longer queue: dx = rho - 1/2, dy = -1/2. Solve z(t) = zSwitch (linear in t).
  const x0 = half, y0 = half, vx1 = rho.sub(half), vy1 = q(-1, 2);
  // (x0-y0 + (vx1-vy1)t) = zS (x0+y0 + (vx1+vy1)t)
  const t1 = zSwitch.mul(x0.add(y0)).sub(x0.sub(y0)).div(vx1.sub(vy1).sub(zSwitch.mul(vx1.add(vy1))));
  const P1 = [x0.add(vx1.mul(t1)), y0.add(vy1.mul(t1))];
  must(t1.eq(q(2, 7)) && P1[0].eq(q(4, 7)) && P1[1].eq(q(5, 14)) && z(...P1).eq(q(3, 13)), 'phase 1 (2/7 to (4/7, 5/14))');
  // Phase 2: small jobs to the shorter queue, large to the longer.
  const vx2 = rho.mul(q(1).sub(workSmall)).sub(half), vy2 = rho.mul(workSmall).sub(half);
  const t2 = P1[1].div(vy2.mul(-1));
  const P2 = [P1[0].add(vx2.mul(t2)), q(0)];
  must(t2.eq(q(8, 7)) && P2[0].eq(q(9, 14)), 'phase 2 (8/7 to (9/14, 0))');
  // Phase 3: empty queue kept exactly busy: rho (workSmall + theta * large work) = 1/2.
  const theta = half.div(rho).sub(workSmall).div(large.mul(pLarge));
  must(theta.eq(q(5, 9)), 'theta = 5/9');
  const jobsToLong = pLarge.mul(q(1).sub(theta));       // 1 - F_H = 2/9
  const t3 = P2[0].div(q(1).sub(rho));
  must(t3.eq(q(18, 7)), 'phase 3 lasts 18/7');
  // Costs: rate 2 rho * sum over destinations (job fraction * destination workload); integrands linear in t.
  const avg = (a, b) => a.add(b).div(2);
  const c1 = q(2).mul(rho).mul(avg(x0, P1[0])).mul(t1);
  const c2 = q(2).mul(rho).mul(avg(P1[0].add(P1[1]), P2[0]).mul(half)).mul(t2);
  const c3 = q(2).mul(rho).mul(jobsToLong).mul(avg(P2[0], q(0))).mul(t3);
  must(c1.eq(q(45, 196)) && c2.eq(q(33, 49)) && c3.eq(q(27, 98)), 'phase costs');
  const optimal = c1.add(c2).add(c3);
  must(optimal.eq(q(33, 28)), 'optimal cost 33/28');
  // Balanced routing: both queues equal, each drains at (1 - rho)/2.
  const tb = x0.div(q(1).sub(rho).div(2));
  const balanced = q(2).mul(rho).mul(avg(x0, q(0))).mul(tb);
  must(balanced.eq(q(3, 2)), 'balanced cost 3/2');
  // Most work left: all to the longer queue until the shorter empties, then the axis phase as above.
  const tm = y0.div(half), M1 = [x0.add(vx1.mul(tm)), q(0)];
  const tm3 = M1[0].div(q(1).sub(rho));
  const mwl = q(2).mul(rho).mul(avg(x0, M1[0])).mul(tm).add(q(2).mul(rho).mul(jobsToLong).mul(avg(M1[0], q(0))).mul(tm3));
  must(mwl.eq(q(21, 16)) && M1[0].eq(q(3, 4)), 'most-work-left cost 21/16');
  must(q(1).sub(optimal.div(balanced)).eq(q(3, 14)), 'saving 3/14');
  return { zSwitch, P0: [x0, y0], P1, P2, M1, theta, optimal, balanced, mwl };
}
const EX = exactExample();

// ---------- drawing ----------
const ink = '#eef1ff', muted = '#cdd3f0', dim = '#aab3dc';
const opt = '#7cd3ff', longC = '#a9b1e6', mwlC = '#f2a7c8', bal = '#c7cde8';
const SANS = 'Arial,Helvetica,sans-serif', SERIF = 'Georgia,serif';
const text = (x, y, s, size = 18, color = ink, anchor = 'start', weight = 'normal', family = SANS) =>
  `<text class="og-hide" x="${x}" y="${y}" fill="${color}" font-family="${family}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}">${s}</text>`;
const f = v => (+v).toFixed(1);

// Workload plane, equal scale on both axes.
const OX = 90, OY = 360, S = 440;
const P = ([x, y]) => [OX + x.v * S, OY - y.v * S];
const arrow = (a, b, color, at = 0.55) => {
  const [x0, y0] = a, [x1, y1] = b, L = Math.hypot(x1 - x0, y1 - y0), ux = (x1 - x0) / L, uy = (y1 - y0) / L;
  const cx = x0 + (x1 - x0) * at, cy = y0 + (y1 - y0) * at, s = 9;
  return `<path d="M${f(cx + ux * s)} ${f(cy + uy * s)} L${f(cx - ux * s - uy * s * 0.6)} ${f(cy - uy * s + ux * s * 0.6)} L${f(cx - ux * s + uy * s * 0.6)} ${f(cy - uy * s - ux * s * 0.6)} Z" fill="${color}"/>`;
};

function plane() {
  const s0 = P(EX.P0), s1 = P(EX.P1), s2 = P(EX.P2), m1 = P(EX.M1), o = [OX, OY];
  let s = '';
  // axes
  s += `<path d="M${OX} ${OY} H${OX + 0.8 * S}" stroke="${muted}" stroke-opacity=".4" stroke-width="1.5"/>`;
  s += `<path d="M${OX} ${OY} V${OY - 0.56 * S}" stroke="${muted}" stroke-opacity=".4" stroke-width="1.5"/>`;
  s += `<path d="M${OX + 0.5 * S} ${OY} V${OY + 5}" stroke="${muted}" stroke-opacity=".6" stroke-width="1.5"/>`;
  s += `<path d="M${OX - 5} ${OY - 0.5 * S} H${OX}" stroke="${muted}" stroke-opacity=".6" stroke-width="1.5"/>`;
  s += text(OX, OY + 20, '0', 13, dim, 'middle') + text(OX + 0.5 * S, OY + 20, '½', 14, dim, 'middle') + text(OX - 9, OY - 0.5 * S + 5, '½', 14, dim, 'end');
  s += text(OX + 8, 112, 'shorter queue’s work ↑', 13.5, dim);
  s += text(OX + 0.5 * S + 24, OY + 20, 'longer queue’s work →', 13.5, dim);
  // balanced routing: the diagonal
  s += `<path d="M${OX} ${OY} L${f(OX + 0.55 * S)} ${f(OY - 0.55 * S)}" stroke="${bal}" stroke-opacity=".75" stroke-width="2.5" stroke-dasharray="2 6" stroke-linecap="round"/>`;
  s += arrow(s0, o, bal, 0.5);
  // most work left (shares the first leg with the optimum)
  s += `<path d="M${f(s1[0])} ${f(s1[1])} L${f(m1[0])} ${f(m1[1])} L${f(s2[0] + 4)} ${OY}" stroke="${mwlC}" stroke-width="2.5" stroke-dasharray="8 6" fill="none"/>`;
  // optimal path
  s += `<path d="M${f(s0[0])} ${f(s0[1])} L${f(s1[0])} ${f(s1[1])} L${f(s2[0])} ${f(s2[1])} L${OX} ${OY}" stroke="${opt}" stroke-width="4.5" fill="none" stroke-linejoin="round" stroke-linecap="round"/>`;
  s += arrow(s0, s1, opt) + arrow(s1, s2, opt) + arrow(s2, o, opt, 0.5);
  for (const [p, r] of [[s0, 7], [s1, 6.5], [s2, 6.5]]) s += `<circle cx="${f(p[0])}" cy="${f(p[1])}" r="${r}" fill="${opt}" stroke="#151a36" stroke-width="2"/>`;
  s += text(f(s0[0] - 12), f(s0[1] - 2), 'start', 14, ink, 'end', 'bold');
  // phase labels
  s += text(f(s0[0] + 30), f(s0[1] + 18), '① all arriving work → longer queue', 14, ink);
  s += text(f(s1[0] + 32), f(s1[1] + 22), '② at imbalance z = 3/13:', 14, ink);
  s += text(f(s1[0] + 32), f(s1[1] + 40), 'small jobs → shorter queue', 14, opt);
  s += text(f(m1[0] + 14), OY - 42, '③ shorter queue empty, then', 14, ink);
  s += text(f(m1[0] + 14), OY - 24, 'kept exactly busy: all small,', 14, ink);
  s += text(f(m1[0] + 14), OY - 6, '5/9 of large jobs', 14, ink);
  // legend in the empty upper-left triangle
  const leg = [[opt, '', 4.5, 'optimal'], [mwlC, '8 6', 2.5, 'most work left'], [bal, '2 6', 2.5, 'balanced']];
  leg.forEach(([c, dash, w, label], i) => {
    const y = 138 + i * 20;
    s += `<path d="M104 ${y - 5} H134" stroke="${c}" stroke-width="${w}" ${dash ? `stroke-dasharray="${dash}"` : ''} stroke-linecap="round"/>`;
    s += text(142, y, label, 13.5, muted);
  });
  return s;
}

function panels() {
  let s = '';
  // where each job goes, by imbalance z (before either queue empties)
  const ZX0 = 712, ZX1 = 1150, zx = v => ZX0 + v * (ZX1 - ZX0), zs = zx(EX.zSwitch.v);
  s += text(620, 126, 'Where each job goes, by imbalance z (before a queue empties)', 15, ink, 'start', 'bold');
  s += text(700, 161, 'size 3/2', 14, muted, 'end') + text(700, 196, 'size ½', 14, muted, 'end');
  s += `<rect x="${ZX0}" y="144" width="${ZX1 - ZX0}" height="24" rx="3" fill="${longC}" fill-opacity=".85"/>`;
  s += `<rect x="${ZX0}" y="179" width="${f(zs - ZX0)}" height="24" rx="3" fill="${longC}" fill-opacity=".85"/>`;
  s += `<rect x="${f(zs)}" y="179" width="${f(ZX1 - zs)}" height="24" rx="3" fill="${opt}"/>`;
  s += text(f((zs + ZX1) / 2), 161, 'to the longer queue', 13.5, '#151a36', 'middle', 'bold');
  s += text(f((zs + ZX1) / 2), 196, 'to the shorter queue', 13.5, '#151a36', 'middle', 'bold');
  s += `<path d="M${f(zs)} 138 V212" stroke="${ink}" stroke-width="2" stroke-dasharray="4 4"/>`;
  s += text(ZX0, 228, '0', 13, dim, 'middle') + text(ZX1, 228, '1', 13, dim, 'middle');
  s += text(f(zs), 228, 'z = 3/13', 13.5, ink, 'middle', 'bold');
  s += text(f(zs + 46), 228, 'z = (longer − shorter) / total work', 12.5, dim);
  // cost from the start
  const CX = 772, k = 240;
  s += text(620, 266, 'Waiting cost from the start', 15, ink, 'start', 'bold');
  [['balanced', EX.balanced, bal, '3/2'], ['most work left', EX.mwl, mwlC, '21/16'], ['optimal', EX.optimal, opt, '33/28']].forEach(([lab, v, c, s2], i) => {
    const y = 280 + i * 28;
    s += text(762, y + 14, lab, 14, muted, 'end');
    s += `<rect x="${CX}" y="${y}" width="${f(v.v * k)}" height="18" rx="3" fill="${c}" fill-opacity="${lab === 'optimal' ? 1 : 0.8}"/>`;
    s += text(f(CX + v.v * k + 8), y + 14, s2, 15, lab === 'optimal' ? opt : ink, 'start', 'bold');
  });
  s += text(CX, 384, 'optimal saves 3/14 ≈ 21% against balanced routing', 14, opt);
  return s;
}

const draw = () => text(40, 50, 'The best dispatcher pulls two queues apart', 27, ink, 'start', 'normal', SERIF) +
  text(40, 80, 'Exact optimal fluid path: job sizes ½ and 3/2 equally likely, load ρ = ¾, each queue starting with ½ unit of work', 16.5, muted) +
  plane() + panels();

const description = 'Banner for a paper that solves optimal size-aware dispatching to two fluid queues exactly, shown on the paper’s running example: job sizes 1/2 and 3/2 equally likely, load rho = 3/4, both queues starting with 1/2 unit of work. Left: the workload plane, with the longer queue’s work across and the shorter queue’s work up. Balanced routing stays on the dotted diagonal. The optimal path leaves the diagonal: first all arriving work goes to one queue; when the relative imbalance z reaches 3/13 (at workloads 4/7 and 5/14), small jobs go to the shorter queue; that queue empties at longer-queue work 9/14 and is then kept exactly busy, taking all small jobs and 5/9 of the large ones, while the longer queue drains to zero. The dashed most-work-left path shares the first leg but keeps all work on the longer queue until the other empties. Top right: before either queue empties, large jobs always go to the longer queue; small jobs switch from the longer to the shorter queue at z = 3/13. Bottom right: waiting cost from the start, balanced 3/2, most work left 21/16 and optimal 33/28, a saving of 3/14, about 21 percent, against balanced routing. All values are exact and are for the fluid model, not the random queue.';

function frame(inner, background) {
  const [c0, c1] = background.colors, W = 1200, H = 400, accent = opt;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" data-banner-palette="${background.name}" role="img" aria-labelledby="art-description">
<desc id="art-description">${description}</desc><defs>
<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
<stop offset="0" stop-color="${c0}"/><stop offset="1" stop-color="${c1}"/>
</linearGradient>
<radialGradient id="glow" cx="0.25" cy="0.6" r="0.5">
<stop offset="0" stop-color="${accent}" stop-opacity="0.07"/><stop offset="1" stop-color="${accent}" stop-opacity="0"/>
</radialGradient>
</defs>
<rect width="${W}" height="${H}" fill="url(#bg)"/>
<rect width="${W}" height="${H}" fill="url(#glow)"/>
${inner}
</svg>`;
}

const thumbSpec = {
  kicker: ['RESEARCH RELEASE · 23 OCTOBER 2026', 'QUEUEING THEORY · EXACT OPTIMAL CONTROL'],
  head: ['Small jobs to','<em>the short queue.</em>'], headSize: 72,
  sub: 'Optimal size-aware dispatching to two fluid queues, solved exactly: the queues are pulled apart until one empties.',
  tag: 'UNREFEREED CANDIDATE',
  hero: '<div class="eq-label">sizes ½, 3/2 · load ¾ · start (½, ½)</div><div class="hero-title">33/28 vs 3/2</div><div class="note">optimal vs balanced routing<br>switch to size split at z = 3/13<br>about 21% less waiting (fluid model)</div><div class="eq-foot">written proofs · exact rational checks</div>'
};

module.exports = { draw, description, thumbSpec, EX };
if (require.main === module) (async () => {
  const fs = require('fs'), pth = require('path'), os = require('os'), vm = require('vm');
  const ROOT = pth.join(__dirname, '..');
  console.log('exact:', 'z* =', String(EX.zSwitch), '| P1 =', EX.P1.join(', '), '| P2 =', EX.P2.join(', '), '| theta =', String(EX.theta),
    '| costs opt/mwl/bal =', [EX.optimal, EX.mwl, EX.balanced].join(' / '));
  const { palettes } = require('./banner-palettes');
  const reg = JSON.parse(fs.readFileSync(pth.join(ROOT, 'data/BANNER_PALETTES.json'), 'utf8'));
  const bsaved = reg.assignments.find(r => r.slug === SLUG); if (!bsaved) throw new Error('no saved banner palette'); const bname = bsaved.palette;
  const tp = require('./thumbnail-palettes');
  const treg = tp.load();
  const tsaved = treg.assignments.find(r => r.slug === SLUG); if (!tsaved) throw new Error('no saved thumbnail palette');
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
  // Text-box containment check (the CI contract checks that text stays inside the viewBox).
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
  const metaPath = pth.join(ROOT, 'papers', SLUG, 'meta.json');
  const m = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
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
