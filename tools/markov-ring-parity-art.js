'use strict';
const { bannerSvg } = require('./svg-xml');
// Parity of affine Karpelevich containment on Markov rings: banner, OG card and thumbnail.
// "This image helps the reader understand" that the five-state ring with integer rates 1, 2, 3 and cycle affinity
// log 3 has an eigenvalue whose affine-rescaled image z lies just outside the Karpelevich region Omega_5 near -1,
// and that this is the pattern for every odd ring with five or more states, while rings with three or an even number
// of states stay inside.
// Source (paper 0.1.0-candidate, 3 Nov 2026): Theorem 1; Section 3.2 equations (6)-(8) (Q, q(t), nu, z); Lemma 4 and
// equation (38) with m = 2, z(z^2 - 1 + t)^2 = t^2, the arc of Omega_5 ending at -1 (Figure 1A). ARC below is the
// upper-half-plane root of z^5 - 2(1-t)z^3 + (1-t)^2 z - t^2 = 0 with least real part for 90 values of t in (0, 1],
// computed with numpy.roots exactly as code/make_figure.py does; the guards below re-check each point's residual.
// Usage: node tools/markov-ring-parity-art.js [--render OUTDIR_FOR_INSPECTION] [--no-mirror] [--banner-only]
const SLUG = 'markov-ring-karpelevich-parity';
const ink = '#f4f1ea', muted = '#e3d9c9', dim = '#c4b7a2';
const regionC = '#9fd2ff', holdC = '#9be3c0', failC = '#ffb38a', rawC = '#d9c7ff', cwC = '#ffd56b', acwC = '#9fd2ff';
const SANS = 'Arial,Helvetica,sans-serif', SERIF = 'Georgia,serif';
const text = (x, y, s, size = 18, color = ink, anchor = 'start', weight = 'normal', family = SANS) =>
  `<text class="og-hide" x="${x}" y="${y}" fill="${color}" font-family="${family}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}">${s}</text>`;
const f = v => (+v).toFixed(1);
const ARC = [[-1.0, 0.0], [-0.99995, 5e-05], [-0.99435, 0.00572], [-0.98878, 0.01148], [-0.98326, 0.01733], [-0.97778, 0.02329], [-0.97234, 0.02934], [-0.96696, 0.03548], [-0.96163, 0.04172], [-0.95637, 0.04806], [-0.95117, 0.05449], [-0.94604, 0.06101], [-0.94099, 0.06762], [-0.93601, 0.07432], [-0.93112, 0.0811], [-0.92632, 0.08797], [-0.92161, 0.09492], [-0.917, 0.10194], [-0.91249, 0.10903], [-0.90809, 0.1162], [-0.90379, 0.12342], [-0.8996, 0.1307], [-0.89553, 0.13804], [-0.89157, 0.14542], [-0.88772, 0.15285], [-0.884, 0.16031], [-0.8804, 0.16781], [-0.87691, 0.17533], [-0.87355, 0.18287], [-0.8703, 0.19043], [-0.86718, 0.19799], [-0.86417, 0.20556], [-0.86128, 0.21313], [-0.8585, 0.2207], [-0.85584, 0.22826], [-0.85328, 0.2358], [-0.85084, 0.24332], [-0.8485, 0.25083], [-0.84627, 0.2583], [-0.84413, 0.26575], [-0.84209, 0.27317], [-0.84015, 0.28055], [-0.83829, 0.2879], [-0.83653, 0.29521], [-0.83485, 0.30248], [-0.83325, 0.30971], [-0.83173, 0.31689], [-0.83028, 0.32403], [-0.82891, 0.33112], [-0.82761, 0.33817], [-0.82637, 0.34517], [-0.8252, 0.35212], [-0.82409, 0.35902], [-0.82304, 0.36588], [-0.82204, 0.37268], [-0.8211, 0.37944], [-0.82021, 0.38614], [-0.81937, 0.3928], [-0.81857, 0.39941], [-0.81783, 0.40597], [-0.81712, 0.41248], [-0.81646, 0.41895], [-0.81583, 0.42536], [-0.81524, 0.43173], [-0.81469, 0.43805], [-0.81417, 0.44433], [-0.81369, 0.45056], [-0.81324, 0.45674], [-0.81281, 0.46288], [-0.81242, 0.46898], [-0.81205, 0.47503], [-0.81171, 0.48104], [-0.8114, 0.487], [-0.81111, 0.49293], [-0.81084, 0.49881], [-0.81059, 0.50465], [-0.81037, 0.51046], [-0.81017, 0.51622], [-0.80998, 0.52194], [-0.80982, 0.52763], [-0.80967, 0.53327], [-0.80954, 0.53888], [-0.80942, 0.54446], [-0.80932, 0.54999], [-0.80924, 0.55549], [-0.80917, 0.56096], [-0.80911, 0.56639], [-0.80907, 0.57179], [-0.80904, 0.57715], [-0.80902, 0.58249], [-0.80902, 0.58779]];
const NU = [-0.8419587943666197, 0.042551528041586316];          // eigenvalue of P = I + Q/4, equation (7)
const BETA = Math.tanh(Math.log(3) / 10);                          // beta = tanh(F/(2n)), F = log 3, n = 5
const Z = [NU[0], NU[1] / BETA];                                   // equation (8): z = -0.84196 + 0.38888 i
// Chart of the region near -1, equal aspect. Shading: the wedge between the arc and the ray to its endpoint e^{4 pi i/5};
// Omega_5 is star-shaped about 0 and this arc is its boundary for arguments in [4 pi/5, pi], so the wedge lies in Omega_5.
const SC = 420, XMIN = -1.02, XMAX = -0.56, X0 = 92, Y0 = 368;
const X = x => X0 + (x - XMIN) * SC, Y = y => Y0 - y * SC;
function chart() {
  let s = '';
  const pts = ARC.map(([x, y]) => `${f(X(x))} ${f(Y(y))}`);
    s += `<path d="M${f(X(-1))} ${f(Y(0))} L${pts.join(' L')} L${f(X(XMAX))} ${f(Y(-XMAX * Math.tan(Math.PI / 5)))} L${f(X(XMAX))} ${f(Y(0))} Z" fill="${regionC}" fill-opacity=".16"/>`;
  s += `<path d="M${pts.join(' L')}" stroke="${regionC}" stroke-width="2.6" fill="none" stroke-linejoin="round"/>`;
  s += `<path d="M${X0} ${Y0} H${f(X(XMAX))}" stroke="${dim}" stroke-width="1.2"/>`;
  for (const t of [-1, -0.9, -0.8, -0.7, -0.6]) s += `<path d="M${f(X(t))} ${Y0} v5" stroke="${dim}" stroke-width="1.1"/>` + text(X(t), Y0 + 19, t === -1 ? '−1' : '−' + String(-t).replace(/^0/, '0'), 12, dim, 'middle');
  s += text(X(-0.775), Y(0.03), 'part of Ω<tspan dy="4" font-size="10">5</tspan>', 12, regionC, 'start');
  s += text(X(-0.775), Y(0.17), 'Karpelevich', 13, regionC, 'start', 'bold') + text(X(-0.775), Y(0.17) + 16, 'boundary arc', 13, regionC, 'start', 'bold');
  // Raw eigenvalue nu and its affine image z.
  s += `<path d="M${f(X(NU[0]))} ${f(Y(NU[1]) - 8)} V${f(Y(Z[1]) + 11)}" stroke="${rawC}" stroke-width="1.6" stroke-dasharray="4 3"/><path d="M${f(X(NU[0]))} ${f(Y(Z[1]) + 9)} l-5 9 h10 Z" fill="${rawC}"/>`;
  s += `<circle cx="${f(X(NU[0]))}" cy="${f(Y(NU[1]))}" r="5" fill="${rawC}" stroke="#1b1b1b" stroke-width="1"/>`;
  s += text(X(NU[0]) + 10, Y(NU[1]) + 4, 'ν', 15, rawC, 'start', 'bold');
  s += text(X(NU[0]) + 9, Y(0.20), '× 1/β', 13, rawC, 'start', 'bold');
  s += `<circle cx="${f(X(Z[0]))}" cy="${f(Y(Z[1]))}" r="7.5" fill="${failC}" stroke="#1b1b1b" stroke-width="1.3"/>`;
  s += text(X(Z[0]) - 13, Y(Z[1]) + 22, 'z = −0.842 + 0.389 i', 13, failC, 'end', 'bold');
  s += text(X(Z[0]) - 13, Y(Z[1]) + 4, 'z: outside Ω<tspan dy="4" font-size="10">5</tspan>', 14, failC, 'end', 'bold');
  return s;
}
// Five-state ring of equation (6): clockwise rates k+ = (1,3,2,2,3), anticlockwise k- = (3,1,2,2,1).
const KP = [1, 3, 2, 2, 3], KM = [3, 1, 2, 2, 1];
function ring(cx, cy, r) {
  let s = '';
  const ang = i => -Math.PI / 2 + 2 * Math.PI * i / 5;
  const P = i => [cx + r * Math.cos(ang(i)), cy + r * Math.sin(ang(i))];
  for (let i = 0; i < 5; i++) {
    const [x1, y1] = P(i), [x2, y2] = P((i + 1) % 5);
    s += `<path d="M${f(x1)} ${f(y1)} L${f(x2)} ${f(y2)}" stroke="${muted}" stroke-opacity=".55" stroke-width="2"/>`;
    const a = (ang(i) + ang(i + 1)) / 2, ro = r * Math.cos(Math.PI / 5);
    const ox = cx + (ro + 19) * Math.cos(a), oy = cy + (ro + 19) * Math.sin(a), ix = cx + (ro - 19) * Math.cos(a), iy = cy + (ro - 19) * Math.sin(a);
    s += text(f(ox), f(oy + 6), String(KP[i]), 17, cwC, 'middle', 'bold');            // clockwise i -> i+1: k_i^+
    s += text(f(ix), f(iy + 6), String(KM[(i + 1) % 5]), 17, acwC, 'middle', 'bold'); // anticlockwise i+1 -> i: k_{i+1}^-
  }
  for (let i = 0; i < 5; i++) { const [x, y] = P(i); s += `<circle cx="${f(x)}" cy="${f(y)}" r="12" fill="#1b1b1b" fill-opacity=".55" stroke="${ink}" stroke-width="1.6"/>`; }
  // Direction cues.
  s += `<path d="M${f(cx + (r + 44) * Math.cos(-2.2))} ${f(cy + (r + 44) * Math.sin(-2.2))} A${r + 44} ${r + 44} 0 0 1 ${f(cx + (r + 44) * Math.cos(-0.95))} ${f(cy + (r + 44) * Math.sin(-0.95))}" stroke="${cwC}" stroke-width="1.6" fill="none"/>`;
  const ex = cx + (r + 44) * Math.cos(-0.95), ey = cy + (r + 44) * Math.sin(-0.95);
  s += `<path d="M${f(ex)} ${f(ey)} l-9.5 -3.5 l5 8.5 Z" fill="${cwC}"/>`;
  return s;
}
function middle() {
  const cx = 520, cy = 226, r = 78;
  let s = ring(cx, cy, r);
  s += text(cx, cy - 2, 'F = log 3', 13, ink, 'middle', 'bold') + text(cx, cy + 16, 'every state', 11, dim, 'middle') + text(cx, cy + 30, 'leaves at rate 4', 11, dim, 'middle');
  s += text(cx, 360, 'outer numbers: clockwise rates', 12, cwC, 'middle') + text(cx, 377, 'inner numbers: anticlockwise rates', 12, acwC, 'middle');
  return s;
}
function panel() {
  const x = 735; let s = text(x, 138, 'Does every ring stay inside?', 19, ink, 'start', 'normal', SERIF);
  s += text(x, 160, 'For all rates at a fixed driving force F &gt; 0:', 13, dim);
  const ns = [3, 4, 5, 6, 7, 8, 9, 10];
  ns.forEach((n, k) => {
    const ok = n === 3 || n % 2 === 0, bx = x + k * 52, c = ok ? holdC : failC;
    s += `<rect x="${bx}" y="180" width="44" height="58" rx="7" fill="${c}" fill-opacity="${ok ? 0.16 : 0.22}" stroke="${c}" stroke-width="1.6"/>`;
    s += text(bx + 22, 205, 'n=' + n, 13, ink, 'middle', 'bold') + text(bx + 22, 228, ok ? '✓' : '✗', 19, c, 'middle', 'bold');
  });
  s += text(x, 270, '✓ n = 3 or n even: holds', 15, holdC, 'start', 'bold') + text(x + 214, 270, '(from known results)', 12, dim);
  s += text(x, 296, '✗ every odd n ≥ 5: fails at every', 15, failC, 'start', 'bold') + text(x, 314, 'driving strength (new: dimers near −1)', 15, failC, 'start', 'bold');
  s += text(x, 346, 'The proved ellipse and winding bounds stay valid.', 12, dim, 'start', 'normal', SERIF);
  return s;
}
const draw = () =>
  text(40, 52, 'Do a driven ring’s eigenvalues stay inside the Karpelevich region?', 26, ink, 'start', 'normal', SERIF) +
  text(40, 80, 'Rate-matrix eigenvalues rescaled by the fastest escape rate and the cycle affinity, as conjectured by Xu et al. (2025)', 15, muted) +
  chart() + `<path d="M392 112 L 392 372" stroke="${muted}" stroke-opacity=".22" stroke-width="1.2"/>` + middle() +
  `<path d="M705 112 L 705 372" stroke="${muted}" stroke-opacity=".22" stroke-width="1.2"/>` + panel();
const description = 'Banner for a paper on the eigenvalues of Markov rate matrices on rings. On the left, a plot of the region near minus one: the shaded area is part of the Karpelevich region Omega_5 (all eigenvalues of five-by-five stochastic matrices) and the blue curve is its boundary arc ending at minus one. A violet point nu = -0.842 + 0.043 i is an eigenvalue of the uniformised five-state ring matrix; a dashed arrow labelled times 1 over beta lifts it to the orange point z = -0.842 + 0.389 i, the affine-rescaled eigenvalue, which lies just above the arc, outside Omega_5. In the middle, the five-state ring: five states joined in a cycle, with clockwise rates 1, 3, 2, 2, 3 written outside and anticlockwise rates 1, 2, 2, 1, 3 inside; every state leaves at total rate 4 and the cycle affinity is F = log 3. On the right, tiles for ring sizes n = 3 to 10: green ticks for n = 3, 4, 6, 8 and 10, where the conjectured containment holds for all rates, and orange crosses for n = 5, 7 and 9, where it fails. Text: n = 3 or n even holds (from known results); every odd n of at least 5 fails at every driving strength (new: dimers near minus one). The proved ellipse and winding bounds stay valid.';
function frame(inner, background) {
  return bannerSvg({ inner, description, background, glow: { color: regionC, cx: '0.2', cy: '0.6', r: '0.4', opacity: '0.07' } });
}
const thumbSpec = {
  kicker: ['RESEARCH RELEASE · NOVEMBER 2026', 'MARKOV CHAINS · STOCHASTIC THERMODYNAMICS'],
  head: ['Odd rings fail,', '<em>even rings hold</em>'], headSize: 70,
  sub: 'A conjectured limit on how a driven Markov ring can oscillate holds with three or an even number of states and fails for every odd ring with five or more.',
  tag: 'UNREFEREED CANDIDATE',
  hero: '<div class="eq-label">5 states · rates 1, 2, 3 · F = log 3</div><div class="hero-title">z ∉ Ω<sub>5</sub></div><div class="note">rescaled eigenvalue<br>z = −0.842 + 0.389 i<br>lies outside the Karpelevich region</div><div class="eq-foot">written proofs · exact certificates</div>'
};
module.exports = { draw, description, thumbSpec, ARC, Z };
if (require.main === module) (async () => {
  const fs = require('fs'), pth = require('path'), os = require('os'), vm = require('vm');
  const ROOT = pth.join(__dirname, '..');
  // Guards: arc points satisfy z(z^2-1+t)^2 = t^2 for some t, i.e. |q(z,t)| small for the t they were computed at;
  // here we check the eliminated form: endpoints and that every point is in the closed unit disc and ordered.
  const cm = (a, b) => [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
  if (ARC[0][0] !== -1 || Math.abs(ARC.at(-1)[0] - Math.cos(4 * Math.PI / 5)) > 1e-4 || Math.abs(ARC.at(-1)[1] - Math.sin(4 * Math.PI / 5)) > 1e-4) throw new Error('arc endpoints mismatch');
  for (let k = 1; k < ARC.length; k++) {
    if (!(ARC[k][1] > ARC[k - 1][1] && ARC[k][0] >= ARC[k - 1][0])) throw new Error('arc not monotone');
    const t = k === 1 ? 1e-4 : 1e-4 + (k - 1) * (1 - 1e-4) / 89, z = ARC[k];
    const z2 = cm(z, z), w = [z2[0] - 1 + t, z2[1]], v = cm(z, cm(w, w));
    if (Math.hypot(v[0] - t * t, v[1]) > 2e-4) throw new Error('arc residual at k=' + k);
  }
  // nu is a root of q(t) = t^4 + t^3 - 3/8 t^2 - 3/8 t + 3/64 (equation 7); z matches equation (8); z is outside the arc.
  const n2 = cm(NU, NU), n3 = cm(n2, NU), n4 = cm(n3, NU);
  const q = [n4[0] + n3[0] - 3 / 8 * n2[0] - 3 / 8 * NU[0] + 3 / 64, n4[1] + n3[1] - 3 / 8 * n2[1] - 3 / 8 * NU[1]];
  if (Math.hypot(q[0], q[1]) > 1e-12) throw new Error('nu mismatch');
  if (Math.abs(Z[0] + 0.84195879437) > 1e-10 || Math.abs(Z[1] - 0.388877702) > 1e-8) throw new Error('z mismatch');
  const i = ARC.findIndex(p => p[0] > Z[0]), [a, b] = [ARC[i - 1], ARC[i]];
  const yArc = a[1] + (b[1] - a[1]) * (Z[0] - a[0]) / (b[0] - a[0]);
  if (!(Z[1] > yArc + 0.01)) throw new Error('z not visibly outside the arc');
  if (KP.reduce((p, k) => p * k, 1) / KM.reduce((p, k) => p * k, 1) !== 3) throw new Error('affinity mismatch');
  for (let j = 0; j < 5; j++) if (KP[j] + KM[j] !== 4) throw new Error('escape rate mismatch');
  const bp = require('./banner-palettes'); const { palettes } = bp;
  const b0 = bp.resolve(SLUG); if (!b0) throw new Error('no banner palette'); const bname = b0.name;
  const tp = require('./thumbnail-palettes');
  const tname = tp.resolve(SLUG, true);
  const svg = frame(draw(), { name: bname, colors: palettes[bname] });
  fs.writeFileSync(pth.join(ROOT, 'assets/art', SLUG + '.svg'), svg);
  console.log('art:', SLUG, 'banner palette', bname, '| thumbnail palette', tname, '| arc y at Re z =', yArc.toFixed(4), 'Im z =', Z[1].toFixed(4));
  const ri = process.argv.indexOf('--render');
  if (ri < 0) return;
  const inspect = process.argv[ri + 1];
  fs.mkdirSync(inspect, { recursive: true });
  const { chromium } = require('playwright');
  const br = await chromium.launch(process.env.EVIDENCE_PRESS_CHROME ? { executablePath: process.env.EVIDENCE_PRESS_CHROME } : {});
  const shot = async (w, h, html, file, opts = {}) => {
    const p = await br.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: opts.dpr || 1 });
    await p.setContent(html, { waitUntil: 'networkidle' });
    await p.screenshot({ path: file, ...(opts.jpeg ? { type: 'jpeg', quality: 94 } : {}) });
    await p.close();
  };
  const body = (w, h, inner) => `<!DOCTYPE html><html><head><meta charset="utf-8"><style>*{margin:0}body{width:${w}px;height:${h}px;background:#222}svg{width:${w}px;height:${h}px;display:block}</style></head><body>${inner}</body></html>`;
  await shot(1200, 400, body(1200, 400, svg), pth.join(inspect, 'banner-full-2x.png'), { dpr: 2 });
  await shot(400, 133, body(400, 133, svg), pth.join(inspect, 'banner-card-400.png'), { dpr: 2 });
  await shot(358, 119, body(358, 119, svg), pth.join(inspect, 'banner-card-358-mobile.png'), { dpr: 2 });
  if (process.argv.includes('--banner-only')) { await br.close(); return; }
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
  if (process.argv.includes('--no-mirror')) { await br.close(); console.log('rendered (central mirror skipped)'); return; }
  const central = pth.join(process.env.EVIDENCE_PRESS_THUMBNAIL_DIR || pth.join(os.homedir(), 'thumbs'), SLUG + '.jpg');
  if (fs.existsSync(central) && !fs.readFileSync(thumbFile).equals(fs.readFileSync(central))) throw new Error('central thumbnail exists; refusing to overwrite: ' + central);
  fs.copyFileSync(thumbFile, central);
  if (!fs.readFileSync(thumbFile).equals(fs.readFileSync(central))) throw new Error('central mirror mismatch');
  await br.close();
  console.log('rendered OG, thumbnail, mirror and inspection PNGs');
})().catch(e => { console.error(e); process.exit(1); });
