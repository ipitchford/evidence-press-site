'use strict';
const { bannerSvg } = require('./svg-xml');
// Affine rigidity and Gaussian exactness in squared-distance Gromov–Wasserstein transport: banner, OG card and thumbnail.
// "This image helps the reader understand" that matching a standard Gaussian plane to a standard Gaussian line by
// straight projection (the best Gaussian pairing, GW objective 12) is not optimal: a curved rearrangement that keeps
// the line exactly N(0,1) provably scores below 76/7, and the true optimum is bracketed in [8.68, 10.85].
// Source (paper 0.1.0-candidate, 1 Nov 2026): Section 7, flow (21) U' = U(V^2-1), V' = V(1-U^2) run to t = 1/7, and
// Table 2 (12 exact; 76/7 proved; 10.4697 at t = 1/7 numerical; 10.0321 numerical; 8.6863 and 10.8404 proved).
// The curves drawn in the right-hand disc are exact level sets {U_{1/7}(u,v) = c} computed here by RK4 and bisection:
// all points on one curve are sent to the same point c of the line. Points are a fixed pseudo-random Gaussian sample.
// Usage: node tools/gaussian-gw-art.js [--render OUTDIR_FOR_INSPECTION] [--no-mirror]
const SLUG = 'gaussian-gromov-wasserstein-exactness';
const ink = '#f4f1ea', muted = '#e3d9c9', dim = '#c4b7a2';
const gC = '#9fc9ff', fC = '#ffb27a', bC = '#9be3c0';
const SANS = 'Arial,Helvetica,sans-serif', SERIF = 'Georgia,serif';
const text = (x, y, s, size = 18, color = ink, anchor = 'start', weight = 'normal', family = SANS) =>
  `<text class="og-hide" x="${x}" y="${y}" fill="${color}" font-family="${family}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}">${s}</text>`;
const f = v => (+v).toFixed(1);

// Flow (21) of the paper, integrated with classical RK4.
function flow(u, v, t = 1 / 7, n = 40) {
  const F = (a, b) => [a * (b * b - 1), b * (1 - a * a)];
  const h = t / n;
  for (let k = 0; k < n; k++) {
    const k1 = F(u, v), k2 = F(u + h / 2 * k1[0], v + h / 2 * k1[1]);
    const k3 = F(u + h / 2 * k2[0], v + h / 2 * k2[1]), k4 = F(u + h * k3[0], v + h * k3[1]);
    u += h / 6 * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]); v += h / 6 * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]);
  }
  return [u, v];
}
// u with U_{1/7}(u, v) = c (U is increasing in u on the drawn range).
function preimage(c, v) {
  let lo = -6, hi = 6;
  for (let k = 0; k < 60; k++) { const m = (lo + hi) / 2; if (flow(m, v)[0] < c) lo = m; else hi = m; }
  return (lo + hi) / 2;
}
// Deterministic standard Gaussian sample (LCG + Box-Muller).
function sample(n, seed = 20261101) {
  let s = seed >>> 0; const r = () => ((s = (Math.imul(1664525, s) + 1013904223) >>> 0) + 0.5) / 4294967296;
  const out = [];
  while (out.length < n) { const a = Math.sqrt(-2 * Math.log(r())), b = 2 * Math.PI * r(); out.push([a * Math.cos(b), a * Math.sin(b)]); }
  return out;
}
const PTS = sample(520);
const LEVELS = [-2, -1.5, -1, -0.5, 0, 0.5, 1, 1.5, 2];
const SC = 34, RAD = 2.6; // pixels per unit; drawn disc radius in standard deviations

function disc(cx, cy, curved, color) {
  let s = `<circle cx="${cx}" cy="${cy}" r="${f(RAD * SC + 6)}" fill="${color}" fill-opacity=".04" stroke="${muted}" stroke-opacity=".25" stroke-width="1.2"/>`;
  for (const [u, v] of PTS) if (u * u + v * v < RAD * RAD) s += `<circle cx="${f(cx + u * SC)}" cy="${f(cy - v * SC)}" r="1.9" fill="${muted}" fill-opacity=".55"/>`;
  for (const c of LEVELS) {
    const pts = [];
    for (let v = -RAD; v <= RAD + 1e-9; v += 0.1) {
      const u = curved ? preimage(c, v) : c;
      if (u * u + v * v <= RAD * RAD) pts.push(`${f(cx + u * SC)} ${f(cy - v * SC)}`);
    }
    if (pts.length > 1) s += `<path d="M${pts.join(' L')}" stroke="${color}" stroke-opacity="${c === 0 ? 1 : 0.85}" stroke-width="${c === 0 ? 2.4 : 1.7}" fill="none"/>`;
  }
  // The target line, with the destination of each drawn curve.
  const ly = cy + RAD * SC + 30;
  s += `<path d="M${f(cx - RAD * SC)} ${f(ly)} H${f(cx + RAD * SC)}" stroke="${muted}" stroke-opacity=".7" stroke-width="1.6"/>`;
  for (const c of LEVELS) s += `<circle cx="${f(cx + c * SC)}" cy="${f(ly)}" r="3.4" fill="${color}"/>`;
  return s;
}
const AX = 205, BX = 520, CY = 205;
function scale() {
  const x0 = 760, x1 = 1150, lo = 8, hi = 12.4, y = 248;
  const X = q => x0 + (q - lo) / (hi - lo) * (x1 - x0);
  let s = text(x0, 128, 'GW objective for plane → line (lower is better)', 15, dim, 'start', 'normal', SERIF);
  s += `<rect x="${f(X(8.6863))}" y="${y - 15}" width="${f(X(10.8404) - X(8.6863))}" height="30" rx="6" fill="${bC}" fill-opacity=".22" stroke="${bC}" stroke-width="1.6"/>`;
  s += text((X(8.6863) + X(10.8404)) / 2, y + 72, 'true optimum lies in [8.68, 10.85] (proved)', 15, bC, 'middle', 'bold');
  s += `<path d="M${x0} ${y} H${x1}" stroke="${muted}" stroke-opacity=".6" stroke-width="1.4"/>`;
  for (const q of [8, 9, 10, 11, 12]) s += `<path d="M${f(X(q))} ${y + 15} v7" stroke="${dim}" stroke-width="1.2"/>` + text(X(q), y + 40, String(q), 12, dim, 'middle');
  const mark = (q, color, label, dy, anchor = 'middle', w = 3.2) =>
    `<path d="M${f(X(q))} ${y - 22} V${y + 22}" stroke="${color}" stroke-width="${w}"/>` + text(X(q), y + dy, label, 14, color, anchor, 'bold');
  s += mark(12, gC, 'projection: 12', -34, 'middle');
  s += mark(76 / 7, fC, 'curved: below 76/7 ≈ 10.86', -58, 'middle');
  s += `<path d="M${f(X(10.4697))} ${y - 9} V${y + 9}" stroke="${fC}" stroke-width="2" stroke-dasharray="3 2"/>`;
  s += text(X(10.4697) - 6, y - 22, '≈ 10.47 numerically', 12, fC, 'end');
  return s;
}
const draw = () =>
  text(40, 50, 'Plane to line: the closed-form Gaussian answer is not the optimum', 26, ink, 'start', 'normal', SERIF) +
  text(40, 78, 'Points on one coloured curve are sent to the same point of the line; both pairings keep the line exactly N(0, 1)', 15, muted) +
  disc(AX, CY + 10, false, gC) + text(AX, 114, 'straight projection (best Gaussian pairing)', 14, gC, 'middle', 'bold') +
  disc(BX, CY + 10, true, fC) + text(BX, 114, 'curved rearrangement (flow at t = 1/7)', 14, fC, 'middle', 'bold') +
  text(AX, 382, 'N(0, I₂)  →  N(0, 1)', 13, dim, 'middle', 'normal', SERIF) + text(BX, 382, 'N(0, I₂)  →  N(0, 1)', 13, dim, 'middle', 'normal', SERIF) +
  `<path d="M712 120 L 712 370" stroke="${muted}" stroke-opacity=".22" stroke-width="1.2"/>` + scale() +
  text(1160, 384, 'Gaussian shortcut exact iff spectra proportional; never off by more than a factor of two', 12.5, dim, 'end', 'normal', SERIF);
const description = 'Banner for a paper on when the closed-form Gaussian answer for Gromov–Wasserstein transport is exact. Two discs show the same cloud of points from a standard Gaussian distribution in the plane, each with a line below it standing for a standard Gaussian on a line. In the left disc, straight vertical blue lines mark the points that a straight projection sends to the same place on the line; this is the best Gaussian pairing and has objective 12. In the right disc, orange curves bend inwards away from the middle: they are exact level sets of the paper\'s Gaussian-preserving flow at time one seventh, which keeps the line exactly standard Gaussian and provably scores below 76/7, about 10.86 (about 10.47 numerically). On the right, a number line from 8 to 12 marks 12 for projection, 76/7 for the curved pairing, and a green band from 8.68 to 10.85 where the true optimum is proved to lie. A footnote says the Gaussian shortcut is exact if and only if the two spectra are proportional, and is never off by more than a factor of two.';
function frame(inner, background) {
  return bannerSvg({ inner, description, background, glow: { color: fC, cx: '0.45', cy: '0.55', r: '0.4', opacity: '0.05' } });
}
const thumbSpec = {
  kicker: ['RESEARCH RELEASE · NOVEMBER 2026', 'OPTIMAL TRANSPORT'],
  head: ['Twelve, or', '<em>under 76/7?</em>'], headSize: 66,
  sub: 'Matching a Gaussian plane to a Gaussian line, the closed-form Gaussian Gromov–Wasserstein answer is 12; a curved pairing scores below 76/7. The shortcut is exact only for proportional spectra.',
  tag: 'UNREFEREED CANDIDATE',
  hero: '<div class="eq-label">plane → line, true optimum in</div><div class="hero-title">[8.68, 10.85]</div><div class="note">Gaussian answer: 12<br>exact iff spectra proportional<br>never off by more than 2×</div><div class="eq-foot">written proofs · exact and numerical checks</div>'
};
module.exports = { draw, description, thumbSpec, flow, preimage };
if (require.main === module) (async () => {
  const fs = require('fs'), pth = require('path'), os = require('os'), vm = require('vm');
  const ROOT = pth.join(__dirname, '..');
  // Guards: the flow preserves the line's variance to first order and bends level sets inward at large |v|.
  const chk = flow(1, 2)[0], chk0 = flow(1, 0)[0];
  if (!(chk > 1.3 && chk < 1.6 && chk0 > 0.8 && chk0 < 0.9)) throw new Error('flow check failed');
  if (Math.abs(76 / 7 - 10.857142857) > 1e-8 || Math.abs(12 - 8 * (Math.SQRT2 - 1) - 8.6863) > 1e-4 || Math.abs(12 - 4 / (1 + Math.sqrt(6)) - 10.8404) > 1e-4) throw new Error('constant mismatch');
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
