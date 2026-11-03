'use strict';
const { bannerSvg } = require('./svg-xml');
// Reversibility and frequency reduction: banner, OG card and thumbnail.
// "This image helps the reader understand" that on a one-way three-patch migration loop (irreversible migration),
// forcing two patches a quarter period apart in the right phase order makes long-run growth peak at an intermediate
// speed of environmental change, whereas the opposite order (and every reversible migration) only loses growth as
// change gets faster.
// Source (paper 0.1.0-candidate, 3 Nov 2026): Section 9.1 and Figure 1(a), directed three-cycle Q = [[-1,1,0],[0,-1,1],
// [1,0,-1]], pi uniform, d_12 = 1/9; exact quadratic response (eq. cyclebeta) beta(w) = (1 + w/2 + w^2/3)/(w^4 + 3w^2 + 9)
// for the forward protocol r = eps(e1 cos wt - e2 sin wt) and beta(-w) for the reversed protocol; growth = eps^2 beta + O(eps^3);
// slow limit 1/9, fast limit 0 (Lemma 3.1); beta(3/4) = 400/2817 (Appendix A). Theorems A and B for the dividing line.
// The curves are the exact leading-order formula, not simulation data.
// Usage: node tools/reversibility-frequency-art.js [--render OUTDIR_FOR_INSPECTION] [--no-mirror]
const SLUG = 'reversibility-frequency-reduction';
const ink = '#f4f1ea', muted = '#e3d9c9', dim = '#c4b7a2';
const fwdC = '#ffcf7a', revC = '#9fd2ff', slowC = '#9be3c0', p1C = '#f2a7c3', p2C = '#b9a7f2';
const SANS = 'Arial,Helvetica,sans-serif', SERIF = 'Georgia,serif';
const text = (x, y, s, size = 18, color = ink, anchor = 'start', weight = 'normal', family = SANS) =>
  `<text class="og-hide" x="${x}" y="${y}" fill="${color}" font-family="${family}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}">${s}</text>`;
const f = v => (+v).toFixed(1);
const beta = w => (1 + w / 2 + w * w / 3) / (w ** 4 + 3 * w * w + 9);
let WSTAR = 0, BSTAR = 0;
for (let k = 0; k <= 40000; k++) { const w = 4 * k / 40000; if (beta(w) > BSTAR) { BSTAR = beta(w); WSTAR = w; } }
// Loop diagram.
function loop() {
  const P = [[150, 170], [262, 300], [72, 300]]; // patches 1, 2, 3
  let s = '<defs><marker id="rfr-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="' + muted + '"/></marker></defs>';
  const R = 27;
  for (let i = 0; i < 3; i++) {
    const [ax, ay] = P[i], [bx, by] = P[(i + 1) % 3]; const dx = bx - ax, dy = by - ay, L = Math.hypot(dx, dy);
    s += `<path d="M${f(ax + dx / L * (R + 4))} ${f(ay + dy / L * (R + 4))} L${f(bx - dx / L * (R + 6))} ${f(by - dy / L * (R + 6))}" stroke="${muted}" stroke-width="2.4" marker-end="url(#rfr-arr)"/>`;
  }
  const fill = [p1C, p2C, null];
  P.forEach(([x, y], i) => {
    s += `<circle cx="${x}" cy="${y}" r="${R}" fill="${fill[i] || 'none'}" fill-opacity="${fill[i] ? 0.22 : 0}" stroke="${fill[i] || dim}" stroke-width="2.4"/>`;
    s += text(x, y + 7, String(i + 1), 21, ink, 'middle', 'bold');
  });
  s += text(162, 256, 'one-way', 12, dim, 'middle') + text(162, 271, 'migration', 12, dim, 'middle');
  // Forcing waves: patch 1 cos, patch 2 -sin (peaks a quarter period earlier).
  const wave = (x0, y0, phase, col) => { const pts = []; for (let k = 0; k <= 60; k++) { const t = k / 60 * 2 * Math.PI; pts.push(`${f(x0 + k * 1.3)} ${f(y0 - 11 * Math.cos(t + phase))}`); } return `<path d="M${pts.join(' L')}" stroke="${col}" stroke-width="2.4" fill="none"/>`; };
  s += wave(198, 146, 0, p1C) + text(282, 151, 'patch 1', 12, p1C, 'start', 'bold');
  s += wave(198, 360, Math.PI / 2, p2C) + text(282, 365, 'patch 2', 12, p2C, 'start', 'bold');
  s += text(40, 382, 'patch 2 peaks a quarter period before patch 1', 12, dim, 'start', 'normal', SERIF);
  return s;
}
// Response chart.
const X0 = 400, X1 = 820, Y0 = 330, Y1 = 132, WMAX = 4, BMAX = 0.16;
const X = w => X0 + w / WMAX * (X1 - X0);
const Y = b => Y0 - b / BMAX * (Y0 - Y1);
function chart() {
  let s = '';
  for (let k = 0; k <= 4; k++) { const b = k * 0.04; s += `<path d="M${X0} ${f(Y(b))} H${X1}" stroke="${muted}" stroke-opacity="${k ? 0.12 : 0.4}" stroke-width="1"/>`; }
  for (let w = 0; w <= 4; w++) s += `<path d="M${f(X(w))} ${Y0} v6" stroke="${dim}" stroke-width="1.2"/>` + text(X(w), Y0 + 21, String(w), 13, dim, 'middle');
  s += text(X1, Y0 + 40, 'speed of environmental change ω (period 2π/ω)', 13, dim, 'end', 'normal', SERIF);
  s += text(X0 - 8, Y1 - 14, 'long-run growth rate (per ε² of forcing)', 13, dim, 'start', 'normal', SERIF);
  s += `<path d="M${X0} ${f(Y(1 / 9))} H${X1}" stroke="${slowC}" stroke-width="1.6" stroke-dasharray="7 6"/>`;
  s += text(X1, Y(1 / 9) + 18, 'slow limit 1/9', 12, slowC, 'end', 'bold');
  const curve = (sgn, col, wd) => { const pts = []; for (let k = 0; k <= 400; k++) { const w = WMAX * k / 400; pts.push(`${f(X(w))} ${f(Y(beta(sgn * w)))}`); } return `<path d="M${pts.join(' L')}" stroke="${col}" stroke-width="${wd}" fill="none" stroke-linejoin="round"/>`; };
  s += curve(1, fwdC, 3.4) + curve(-1, revC, 2.8);
  s += `<circle cx="${f(X(WSTAR))}" cy="${f(Y(BSTAR))}" r="6.5" fill="${fwdC}" stroke="#1b1b1b" stroke-width="1.2"/>`;
  s += text(X(WSTAR) + 14, Y(BSTAR) - 8, 'best at an intermediate speed', 14, fwdC, 'start', 'bold');
  s += text(X(2.15), Y(beta(2.15)) - 14, 'this phase order', 13, fwdC, 'start', 'bold');
  s += text(X(0.8), 220, 'opposite order:', 13, revC, 'start', 'bold') + text(X(0.8), 236, 'only falls', 13, revC, 'start', 'bold');
  s += text(X1, Y(0) - 8, '→ fast limit 0 as ω → ∞', 12, dim, 'end');
  return s;
}
function panel() {
  const x = 870; let s = text(x, 140, 'The dividing line', 19, ink, 'start', 'normal', SERIF);
  s += text(x, 172, 'Detailed balance (no net flow', 14, slowC, 'start', 'bold') + text(x, 190, 'around any loop of patches):', 14, slowC, 'start', 'bold');
  s += text(x, 210, 'faster change never raises growth.', 14, ink) ;
  s += text(x, 246, 'Any circulation, as on this loop:', 14, fwdC, 'start', 'bold');
  s += text(x, 266, 'some weak two-patch forcing', 14, ink) + text(x, 284, 'peaks at an intermediate speed.', 14, ink);
  s += text(x, 316, 'Certificate from migration alone:', 13, dim) + text(x, 335, 'd₁₂ = 1/9 ≠ 0 here.', 13, dim, 'start', 'bold');
  s += text(x, 362, 'Exact leading-order response; gains are O(ε²).', 12, dim, 'start', 'normal', SERIF);
  return s;
}
const draw = () =>
  text(40, 52, 'Can faster environmental change ever help a spread-out population grow?', 26, ink, 'start', 'normal', SERIF) +
  text(40, 80, 'Only if migration circulates: growth always falls with speed exactly when migration satisfies detailed balance', 15, muted) +
  loop() + `<path d="M350 112 L 350 372" stroke="${muted}" stroke-opacity=".22" stroke-width="1.2"/>` + chart() +
  `<path d="M850 112 L 850 372" stroke="${muted}" stroke-opacity=".22" stroke-width="1.2"/>` + panel();
const description = 'Banner for a paper on when faster environmental change can only lower the long-run growth rate of a population spread over patches with fixed migration. Left: three patches in a one-way migration loop, 1 to 2 to 3 and back to 1; patches 1 and 2 are forced by waves a quarter period apart, with patch 2 peaking a quarter period before patch 1. Middle: the exact leading-order long-run growth rate, per epsilon squared of forcing, against the speed of environmental change omega from 0 to 4. For this phase order (gold) the curve rises from the slow limit 1/9 to a maximum of about 0.143 at an intermediate speed near omega 0.84, then falls to the fast limit 0. For the opposite order (blue) the curve only falls. Right: the dividing line. With detailed balance, meaning no net flow around any loop of patches, faster change never raises growth; with any circulation, as on this loop, some weak two-patch forcing peaks at an intermediate speed. The certificate computed from migration alone is d12 = 1/9, not zero, here. Gains are of order epsilon squared.';
function frame(inner, background) {
  return bannerSvg({ inner, description, background, glow: { color: fwdC, cx: '0.5', cy: '0.55', r: '0.42', opacity: '0.06' } });
}
const thumbSpec = {
  kicker: ['RESEARCH RELEASE · NOVEMBER 2026', 'MATHEMATICAL BIOLOGY · DYNAMICAL SYSTEMS'],
  head: ['Can faster change', '<em>help a population?</em>'], headSize: 70,
  sub: 'For populations spread over patches, faster environmental change never raises growth exactly when migration has no net circulation.',
  tag: 'UNREFEREED CANDIDATE',
  hero: '<div class="eq-label">the dividing line</div><div class="hero-title">detailed balance</div><div class="note">no loop flow: growth only falls with speed<br>loop flow: an intermediate speed can win<br>proves a 2025 random-switching conjecture</div><div class="eq-foot">written proofs · exact checks</div>'
};
module.exports = { draw, description, thumbSpec, beta };
if (require.main === module) (async () => {
  const fs = require('fs'), pth = require('path'), os = require('os'), vm = require('vm');
  const ROOT = pth.join(__dirname, '..');
  // Guards: plotted constants match the paper's exact values.
  if (Math.abs(beta(0) - 1 / 9) > 1e-15 || Math.abs(beta(0.75) - 400 / 2817) > 1e-15 || Math.abs(beta(0.25) - 880 / 7059) > 1e-15) throw new Error('beta mismatch');
  if (!(BSTAR > beta(0) && WSTAR > 0.5 && WSTAR < 1.2 && beta(-0.5) < beta(0) && beta(-1) < beta(-0.5))) throw new Error('shape mismatch');
  const reg = JSON.parse(fs.readFileSync(pth.join(ROOT, 'data/BANNER_PALETTES.json'), 'utf8'));
  const { palettes } = require('./banner-palettes');
  const bsaved = reg.assignments.find(r => r.slug === SLUG); if (!bsaved) throw new Error('no saved banner palette'); const bname = bsaved.palette;
  const tp = require('./thumbnail-palettes');
  const tsaved = tp.load().assignments.find(r => r.slug === SLUG); if (!tsaved) throw new Error('no saved thumbnail palette');
  const tname = tsaved.editorialPalette || tsaved.palette;
  const svg = frame(draw(), { name: bname, colors: palettes[bname] });
  fs.writeFileSync(pth.join(ROOT, 'assets/art', SLUG + '.svg'), svg);
  console.log('art:', SLUG, 'banner palette', bname, '| thumbnail palette', tname, '| w* =', WSTAR.toFixed(4), 'beta* =', BSTAR.toFixed(5));
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
