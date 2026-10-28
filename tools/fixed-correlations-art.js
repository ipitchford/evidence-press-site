'use strict';
const { bannerSvg } = require('./svg-xml');
// Fixed time-asymmetric correlations with arbitrarily weak dissipation: banner, OG card and thumbnail.
// Sources (paper of 28 Oct 2026, doi:10.5281/zenodo.23721112):
//  - Theorem 1 and Fig. 2: every chain Q_{eps,kappa} has the same antisymmetric covariance
//      C21(t) - C12(t) = e^{-9t/2} sin(w0 t)/w0, w0 = sqrt(3)/2 (peak about 0.081 near t = 0.22);
//  - Eq. (8): sigma(eps, kappa) = eps log((6-kappa)/(3-kappa)); at kappa = 1, sigma = eps log(5/2);
//  - Eq. (17): Gaussian spectral value G[C] = 1/3 for every member;
//  - Eq. (18): at (1/4, 1), sigma = 0.229 < 1/3;
//  - Figure 1: idle state 0 (weight 1-eps) gated to a driven three-cycle (weight eps).
// Usage: node tools/fixed-correlations-art.js [--render OUTDIR_FOR_INSPECTION] [--no-mirror]
const SLUG = 'fixed-correlations-weak-dissipation';
const ink = '#f7f2ea', muted = '#e3d8c8', dim = '#c9b9a3';
const curve = '#9fd8ff', gauss = '#c9a6ff', exact = '#ffb36b', gate = '#d9cfc0';
const SANS = 'Arial,Helvetica,sans-serif', SERIF = 'Georgia,serif';
const text = (x, y, s, size = 18, color = ink, anchor = 'start', weight = 'normal', family = SANS) =>
  `<text class="og-hide" x="${x}" y="${y}" fill="${color}" font-family="${family}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}">${s}</text>`;
const f = v => (+v).toFixed(1);
const W0 = Math.sqrt(3) / 2;
const asym = t => Math.exp(-4.5 * t) * Math.sin(W0 * t) / W0;

// Panel A: the one fixed correlation signal.
function panelA() {
  const X0 = 52, X1 = 352, Y0 = 330, Y1 = 150, T = 1.4, M = 0.09;
  const px = t => X0 + (X1 - X0) * t / T, py = v => Y0 - (Y0 - Y1) * v / M;
  let s = `<path d="M${X0} ${Y1 - 6} V${Y0} H${X1 + 6}" fill="none" stroke="${muted}" stroke-opacity=".55" stroke-width="1.4"/>`;
  const pts = []; for (let i = 0; i <= 140; i++) { const t = T * i / 140; pts.push(`${f(px(t))} ${f(py(asym(t)))}`); }
  s += `<path d="M${pts.join(' L')}" fill="none" stroke="${curve}" stroke-width="4" stroke-linecap="round"/>`;
  s += text(X0, 128, 'One fixed correlation signal', 19, ink, 'start', 'bold');
  s += text(X0 + 120, 196, 'C₂₁(t) − C₁₂(t)', 16, curve);
  s += text(X0 + 120, 218, 'identical for every chain', 14, muted);
  s += text(X1, Y0 + 24, 'lag t →', 13, dim, 'end');
  return s;
}

// Panel B: the four-state network (Figure 1 of the paper).
function panelB() {
  const cx = 600, cy = 250;
  const z = [cx - 120, cy + 10], a = [[cx + 40, cy - 70], [cx + 110, cy + 40], [cx - 10, cy + 70]];
  let s = text(cx - 160, 128, 'Rarely active, fast when active', 19, ink, 'start', 'bold');
  const sh = (p, q, r) => { const dx = q[0] - p[0], dy = q[1] - p[1], L = Math.hypot(dx, dy); return [p[0] + dx * r / L, p[1] + dy * r / L]; };
  for (const p of a) { const u = sh(z, p, 32), v = sh(p, z, 20); s += `<path d="M${f(u[0])} ${f(u[1])} L${f(v[0])} ${f(v[1])}" stroke`;
    s += `="${gate}" stroke-opacity=".7" stroke-width="2" stroke-dasharray="6 6"/>`; }
  if (0) for (const p of a) s += `<path d="M${z[0]} ${z[1]} L${p[0]} ${p[1]}" stroke="${gate}" stroke-opacity=".7" stroke-width="2" stroke-dasharray="6 6"/>`;
  for (let i = 0; i < 3; i++) {
    const p = a[i], q = a[(i + 1) % 3];
    const mx = (p[0] + q[0]) / 2 + (cx + 47 - (p[0] + q[0]) / 2) * -0.25, my = (p[1] + q[1]) / 2 + (cy + 13 - (p[1] + q[1]) / 2) * -0.25;
    const u = sh(p, [mx, my], 21), v = sh(q, [mx, my], 24);
    s += `<path d="M${f(u[0])} ${f(u[1])} Q${f(mx)} ${f(my)} ${f(v[0])} ${f(v[1])}" fill="none" stroke="${exact}" stroke-width="3.5" marker-end="url(#fcw-arrow)"/>`;
  }
  s += `<circle cx="${z[0]}" cy="${z[1]}" r="30" fill="#00000033" stroke="${gate}" stroke-width="2.5"/>` + text(z[0], z[1] + 6, 'idle', 15, ink, 'middle');
  for (const p of a) s += `<circle cx="${p[0]}" cy="${p[1]}" r="17" fill="#00000033" stroke="${exact}" stroke-width="2.5"/>`;
  s += text(z[0], z[1] + 56, 'weight 1 − ε', 14, muted, 'middle');
  s += text(cx + 135, cy - 70, 'driven cycle', 14, exact) + text(cx + 135, cy - 52, 'weight ε', 14, muted);
  s += text(cx + 135, cy - 34, 'large readout', 14, muted);
  s += text(cx - 160, 348, 'gate transitions dissipate nothing', 13, dim);
  return s;
}

// Panel C: entropy rate against the Gaussian value (kappa = 1).
function panelC() {
  const X0 = 850, X1 = 1150, Y0 = 330, Y1 = 150;
  const lx = e => X0 + (X1 - X0) * (Math.log10(e) + 3) / (Math.log10(0.5) + 3);
  const ly = v => Y0 - (Y0 - Y1) * (Math.log10(v) + 3.3) / (Math.log10(0.6) + 3.3);
  let s = `<path d="M${X0} ${Y1 - 6} V${Y0} H${X1 + 6}" fill="none" stroke="${muted}" stroke-opacity=".55" stroke-width="1.4"/>`;
  s += `<path d="M${X0} ${f(ly(1 / 3))} H${X1}" stroke="${gauss}" stroke-width="3.5"/>`;
  const pts = []; for (let i = 0; i <= 60; i++) { const e = Math.pow(10, -3 + i / 60 * (Math.log10(0.5) + 3)); pts.push(`${f(lx(e))} ${f(ly(e * Math.log(2.5)))}`); }
  s += `<path d="M${pts.join(' L')}" fill="none" stroke="${exact}" stroke-width="4" stroke-linecap="round"/>`;
  s += `<circle cx="${f(lx(0.25))}" cy="${f(ly(0.25 * Math.log(2.5)))}" r="6" fill="${exact}"/>`;
  s += text(X0, 128, 'Dissipation is not pinned', 19, ink, 'start', 'bold');
  s += text(X0 + 6, f(ly(1 / 3) - 10), 'Gaussian reading: 1/3', 14, gauss);
  s += text(X0 + 120, 300, 'true rate ε·log(5/2)', 14, exact);
  s += text(f(lx(0.25) + 2), f(ly(0.25 * Math.log(2.5)) + 30), 'ε = 1/4: 0.229', 13, exact, 'middle');
  s += text(X1, Y0 + 24, 'active fraction ε (log scale) →', 13, dim, 'end');
  return s;
}

const defs = `<defs><marker id="fcw-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="${exact}"/></marker></defs>`;
const draw = () => defs + text(40, 52, 'Same correlations, any dissipation', 30, ink, 'start', 'normal', SERIF) +
  text(40, 82, 'Rare, large excursions carry the covariance; the Gaussian value 1/3 is not a lower bound', 17, muted) +
  panelA() + panelB() + panelC();

const description = 'Banner for a paper showing that one fixed time-asymmetric correlation function is compatible with arbitrarily weak dissipation. Left: the antisymmetric part of the covariance, C21(t) minus C12(t) = e^(-9t/2) sin(w0 t)/w0, a single curve rising to about 0.08 near lag 0.2 and decaying; it is identical for every member of the paper\'s four-state family. Centre: the four-state network of the paper\'s Figure 1, an idle state with weight 1 minus epsilon connected by dashed gate transitions, which dissipate nothing, to a driven three-state cycle with weight epsilon and large readout values. Right: on logarithmic axes against the active fraction epsilon, the exact entropy-production rate epsilon times log(5/2) (at kappa = 1) falls towards zero as epsilon shrinks, while the Gaussian spectral value of the same covariance stays flat at 1/3; a dot marks epsilon = 1/4, where the true rate is 0.229. The plots are exact formula evaluations from the paper.';

function frame(inner, background) {
  return bannerSvg({ inner, description, background, glow: { color: exact, cx: '0.82', cy: '0.55', r: '0.4', opacity: '0.06' } });
}

const thumbSpec = {
  kicker: ['RESEARCH RELEASE · OCTOBER 2026', 'STOCHASTIC THERMODYNAMICS · COUNTEREXAMPLE'],
  head: ['Same correlations.', '<em>Any dissipation.</em>'], headSize: 70,
  sub: 'One fixed time-asymmetric covariance fits Markov models with every positive entropy rate, so its Gaussian value, 1/3, is not a lower bound.',
  tag: 'UNREFEREED CANDIDATE',
  hero: '<div class="eq-label">four-state family · Theorem 1</div><div class="hero-title">σ → 0</div><div class="note">covariance fixed at every lag<br>Gaussian value 𝒢 = 1/3<br><b>true rate ε·log(5/2)</b></div><div class="eq-foot">written proofs · exact checks</div>'
};

module.exports = { draw, description, thumbSpec, asym };
if (require.main === module) (async () => {
  const fs = require('fs'), pth = require('path'), os = require('os'), vm = require('vm');
  const ROOT = pth.join(__dirname, '..');
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
  await shot(1200, 400, body(1200, 400, svg), pth.join(inspect, 'banner-full-2x.png'), { dpr: 2 });
  await shot(400, 133, body(400, 133, svg), pth.join(inspect, 'banner-card-400.png'), { dpr: 2 });
  await shot(358, 119, body(358, 119, svg), pth.join(inspect, 'banner-card-358-mobile.png'), { dpr: 2 });
  const og = fs.readFileSync(pth.join(__dirname, 'make-og.js'), 'utf8');
  const htmlSrc = og.slice(og.indexOf('const html = '), og.indexOf('\n(async () =>'));
  const ogHtml = vm.runInNewContext(htmlSrc + '; html', {});
  const metaPath = pth.join(ROOT, 'papers', SLUG, 'meta.json');
  const m = fs.existsSync(metaPath) ? JSON.parse(fs.readFileSync(metaPath, 'utf8'))
    : { title: 'Fixed time-asymmetric correlations with arbitrarily weak dissipation', status: 'unrefereed-candidate', datePublished: '2026-10-28' };
  console.log('og meta from', fs.existsSync(metaPath) ? metaPath : 'built-in fallback');
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
