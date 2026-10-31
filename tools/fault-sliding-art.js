'use strict';
const { bannerSvg } = require('./svg-xml');
// Scalar history criteria for the first loss of full sliding under variable fluid injection: banner, OG card and thumbnail.
// "This image helps the reader understand" that the slip rate at the injection point decides when an expanding
// injection-driven slip crack first stops sliding forward: at the moment full sliding is first lost, the centre's slip
// rate is zero while every other point of the crack still slips forward (Theorems 1, A, B, G).
// Source (paper 0.1.0-candidate, 31 Oct 2026): numerics/verification_results.json, linear_taper_cases[5]
// (Theta = 0.1, Gaussian source eps = 0.02, linear taper to 40% over L = T = 1; first zero t* = 1.5193):
// scaled slip rate V(r, t*) at r/R = 0, 0.01, 0.05, 0.1, 0.25, 0.5, 0.75, 0.95, 0.999 (Section 9.2, Figure 1C).
// Lines and arrow lengths interpolate linearly between these computed points; slip is unidirectional (arrows parallel).
// Usage: node tools/fault-sliding-art.js [--render OUTDIR_FOR_INSPECTION] [--no-mirror]
const SLUG = 'fault-sliding-history-criteria';
const ink = '#f4f1ea', muted = '#e3d9c9', dim = '#c4b7a2';
const slipC = '#8fe3c4', centreC = '#ffab70', wellC = '#ffd27a';
const SANS = 'Arial,Helvetica,sans-serif', SERIF = 'Georgia,serif';
const text = (x, y, s, size = 18, color = ink, anchor = 'start', weight = 'normal', family = SANS) =>
  `<text class="og-hide" x="${x}" y="${y}" fill="${color}" font-family="${family}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}">${s}</text>`;
const f = v => (+v).toFixed(1);
const RF = [0, 0.01, 0.05, 0.1, 0.25, 0.5, 0.75, 0.95, 0.999];
const VEL = [1.0658141036401503e-14, 0.006738848745222237, 0.14623431162354183, 0.416990371875799, 0.8656942754099652,
  0.6746351375294569, 0.31798497851339264, 0.10274749363119913, 0.013538830808482387];
const VMAX = Math.max(...VEL);
const vAt = rho => { for (let i = 1; i < RF.length; i++) if (rho <= RF[i]) { const a = (rho - RF[i - 1]) / (RF[i] - RF[i - 1]); return VEL[i - 1] + a * (VEL[i] - VEL[i - 1]); } return 0; };

// Left: the slipping disk seen from above; arrows show the forward slip rate (one direction) at grid points.
const D = { cx: 250, cy: 245, R: 118 };
function disk() {
  let s = `<circle cx="${D.cx}" cy="${D.cy}" r="${D.R}" fill="${slipC}" fill-opacity=".07" stroke="${slipC}" stroke-opacity=".75" stroke-width="2"/>`;
  s += `<defs><marker id="fsh" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="${slipC}"/></marker></defs>`;
  const step = 30, Lmax = 22;
  for (let gy = -3; gy <= 3; gy++) for (let gx = -3; gx <= 3; gx++) {
    const x = gx * step, y = gy * step, rho = Math.hypot(x, y) / D.R;
    if (rho > 0.92 || (gx === 0 && gy === 0)) continue;
    const len = Lmax * vAt(rho) / VMAX; if (len < 5) continue;
    const x0 = D.cx + x - len / 2, y0 = D.cy + y;
    s += `<path d="M${f(x0)} ${f(y0)} h${f(len)}" stroke="${slipC}" stroke-width="2.2" marker-end="url(#fsh)" opacity=".9"/>`;
  }
  s += `<circle cx="${D.cx}" cy="${D.cy}" r="9" fill="none" stroke="${centreC}" stroke-width="3"/><circle cx="${D.cx}" cy="${D.cy}" r="3" fill="${centreC}"/>`;
  s += text(D.cx + D.R + 16, D.cy - 100, 'slipping patch, seen from above', 14, dim, 'start', 'normal', SERIF);
  s += text(D.cx + D.R + 16, D.cy - 64, 'every other point', 15, slipC, 'start', 'bold');
  s += text(D.cx + D.R + 16, D.cy - 45, 'still slips forward', 15, slipC, 'start', 'bold');
  s += `<path d="M${D.cx + 12} ${D.cy + 6} L${D.cx + D.R + 12} ${D.cy + 58}" stroke="${centreC}" stroke-width="1.4" stroke-dasharray="4 3"/>`;
  s += text(D.cx + D.R + 16, D.cy + 64, 'injection point:', 15, centreC, 'start', 'bold');
  s += text(D.cx + D.R + 16, D.cy + 83, 'stops first', 15, centreC, 'start', 'bold');
  return s;
}
// Right: the computed slip-rate profile across the crack at that moment.
const P = { x0: 690, x1: 1130, y0: 320, y1: 160 };
const px = rho => P.x0 + rho * (P.x1 - P.x0), py = v => P.y0 - v / VMAX * (P.y0 - P.y1);
function profile() {
  let s = `<path d="M${P.x0} ${P.y1 - 12} V${P.y0} H${P.x1 + 8}" stroke="${muted}" stroke-opacity=".7" stroke-width="1.6" fill="none"/>`;
  const pts = RF.map((r, i) => [px(r), py(VEL[i])]);
  s += `<path d="M${f(P.x0)} ${P.y0} L` + pts.map(([x, y]) => `${f(x)} ${f(y)}`).join(' L') + ` L${f(px(1))} ${P.y0} Z" fill="${slipC}" fill-opacity=".12"/>`;
  s += `<path d="M` + pts.map(([x, y]) => `${f(x)} ${f(y)}`).join(' L') + `" stroke="${slipC}" stroke-width="3" fill="none"/>`;
  for (const [x, y] of pts.slice(1)) s += `<circle cx="${f(x)}" cy="${f(y)}" r="3.4" fill="${slipC}"/>`;
  s += `<circle cx="${f(px(0))}" cy="${f(py(VEL[0]))}" r="6.5" fill="${centreC}"/>`;
  s += text(px(0) - 14, P.y0 - 8, 'centre: 0', 15, centreC, 'end', 'bold');
  s += text(px(0.5) + 8, py(VEL[5]) - 18, 'positive everywhere else', 15, slipC, 'start', 'bold');
  for (const [r, lab] of [[0, '0'], [0.25, '¼'], [0.5, '½'], [0.75, '¾'], [1, 'edge']]) s += text(f(px(r)), P.y0 + 20, lab, 13, dim, 'middle');
  s += text(P.x0 - 4, P.y1 - 24, 'forward slip rate across the crack at the first loss of full sliding', 14, dim, 'start', 'normal', SERIF);
  s += text(P.x1, P.y0 + 42, 'distance from the injection point (fraction of crack radius)', 13, dim, 'end', 'normal', SERIF);
  return s;
}
const draw = () => text(40, 52, 'The injection point decides when a fault stops sliding forward', 27, ink, 'start', 'normal', SERIF) +
  text(40, 82, 'While the centre keeps slipping forward, so does the whole expanding crack; when sliding is first lost, it is lost at the centre', 16, muted) +
  disk() + `<path d="M600 160 L 600 360" stroke="${muted}" stroke-opacity=".25" stroke-width="1.2"/>` + profile() +
  text(1160, 388, 'computed example: Gaussian source, Θ = 0.1, rate tapered to 40%', 12, dim, 'end', 'normal', SERIF);
const description = 'Banner for a paper on when an injection-driven slow-slip crack on a fault first stops sliding forward everywhere. Left: the circular slipping patch seen from above, with the injection well at its centre; parallel green arrows show the forward slip rate at grid points, longest at about a quarter of the radius and shrinking towards the edge, and absent at the centre, which is marked in orange as the point that stops first. Right: the computed slip rate across the crack against distance from the injection point as a fraction of the crack radius, at the first moment full sliding is lost, for a Gaussian source with stress-injection parameter 0.1 after the rate is tapered linearly to 40 per cent: the curve is zero at the centre and positive everywhere else. Values are the paper\'s computed points (Section 9.2); lines and arrow lengths interpolate between them. The paper proves that in this model the centre always stops first under the stated conditions.';
function frame(inner, background) {
  return bannerSvg({ inner, description, background, glow: { color: slipC, cx: '0.78', cy: '0.6', r: '0.4', opacity: '0.06' } });
}
const thumbSpec = {
  kicker: ['RESEARCH RELEASE · OCTOBER 2026', 'FLUID INJECTION · FAULT SLIP'],
  head: ['The centre decides', '<em>when sliding stops.</em>'], headSize: 66,
  sub: 'In the circular model of injection-driven slow slip, the slip rate at the injection point decides when the whole fault first stops sliding forward. Under stated conditions the centre stops first.',
  tag: 'UNREFEREED CANDIDATE',
  hero: '<div class="eq-label">whole crack slides forward iff</div><div class="hero-title">centre does</div><div class="note">abrupt cut above ~0.1%: sliding ends<br>after shut-in: explicit deadline<br>point source: no linear taper halves the rate</div><div class="eq-foot">constant friction · zero Poisson ratio · proofs</div>'
};
module.exports = { draw, description, thumbSpec, VEL };
if (require.main === module) (async () => {
  const fs = require('fs'), pth = require('path'), os = require('os'), vm = require('vm');
  const ROOT = pth.join(__dirname, '..');
  // Guard against the source data: centre zero to rounding, every other computed point positive.
  if (!(Math.abs(VEL[0]) < 1e-9) || !VEL.slice(1).every(v => v > 0)) throw new Error('profile sign pattern mismatch');
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
