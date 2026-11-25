'use strict';
const { bannerSvg } = require('./svg-xml');
// Real entanglement witnesses under local filters (qutrit-real-witness-local-filters): banner, OG, thumbnail.
// "This image helps the reader understand" that the set of all witnesses (trace-one block-positive operators) contains a
// smaller closed set R of filtered real witnesses, that one exposed corner H (the Ha-Kye witness) lies outside R, and that
// nudging the separable state D, which touches the witness set only at H, towards entanglement gives a state rho_eps that H
// detects while every point of R stays positive (Theorem 6 via Lemma 4; Theorem 8 for the explicit instance).
// The layout follows the manuscript's Section 2 TikZ schematic (B, R, H and the exposing hyperplane); it is a schematic of
// convex sets, not a plot of data.
// checkHook recomputes tr(W rho_eps) = -24 eps/(360 - 9 eps) = -8/19199997 at eps = 1/160000 exactly, the noise threshold
// eps/40 = 1/6400000 (about 1.6e-7), checks that the certified ball radius 8e-10 is below the filtered-real margin 8.5e-10,
// that the circulant entry z = 33024 + 17280i has Im(z^3) != 0 (so chi(W) != 0), and that 2 x 4 has total dimension eight;
// it refuses to draw on any mismatch.
// Reference: txgraffiti-order48-successor (an exact counterexample picture with an immediately readable message).
// Usage: node tools/qutrit-real-witness-art.js [--render OUTDIR_FOR_INSPECTION] [--no-mirror]
const SLUG = 'qutrit-real-witness-local-filters';
const ink = '#f6f2ea', muted = '#e6e1ea', dim = '#c9c2cf', cool = '#9fd3ff', hot = '#ffc36b', rose = '#f2a7b5', ok = '#a8e0b0';
const SANS = 'Arial,Helvetica,sans-serif', SERIF = 'Georgia,serif';
const text = (x, y, s, size = 18, color = ink, anchor = 'start', weight = 'normal', family = SANS, style = 'normal') => {
  if (/<|&(?!(lt|gt|amp|minus|#\d+);)/.test(s.replace(/<\/?tspan[^>]*>/g, ''))) throw new Error('unescaped < or & in SVG text: ' + s);
  return `<text class="og-hide" x="${x}" y="${y}" fill="${color}" font-family="${family}" font-size="${size}" font-weight="${weight}" font-style="${style}" text-anchor="${anchor}">${s}</text>`;
};
// Released values (results/verify_witness.txt and Theorems 8 and 10 of the release).
const RELEASED = { epsDen: 160000n, witness: [-8n, 19199997n], margin: 8.5e-10, ball: 8e-10, noiseDen: 6400000n, z: [33024n, 17280n], dims: [2, 4] };
const gcd = (a, b) => b ? gcd(b, a % b) : (a < 0n ? -a : a);
function checkHook() {
  const q = RELEASED.epsDen;                        // eps = 1/q
  let num = -24n, den = 360n * q - 9n;              // -24 eps / (360 - 9 eps) = -24 / (360 q - 9)
  const g = gcd(num, den); num /= g; den /= g;
  if (num !== RELEASED.witness[0] || den !== RELEASED.witness[1]) throw new Error('witness value mismatch: ' + num + '/' + den);
  if (40n * q !== RELEASED.noiseDen) throw new Error('noise threshold mismatch');
  const eta = 1 / Number(RELEASED.noiseDen);
  if (Math.abs(eta - 1.6e-7) > 0.05e-7) throw new Error('noise threshold is not about 1.6e-7');
  if (!(RELEASED.ball < RELEASED.margin)) throw new Error('ball radius must be below the margin');
  const [a, b] = RELEASED.z;                        // Im((a+bi)^3) = 3 a^2 b - b^3
  if (3n * a * a * b - b * b * b === 0n) throw new Error('chi(W) would vanish');
  if (RELEASED.dims[0] * RELEASED.dims[1] !== 8) throw new Error('2 x 4 total dimension mismatch');
  return { witness: `${num}/${den}` };
}
// Schematic: outer witness set B (a rounded convex region with one sharp corner H), inner filtered-real set R,
// the hyperplane through H that D defines, and rho_eps just across it.
function cone() {
  const H = [470, 132];
  let s = '';
  s += `<path d="M ${H[0]} ${H[1]} C 420 128, 300 96, 190 120 C 90 142, 52 230, 98 300 C 140 360, 280 372, 380 330 C 440 300, 462 220, ${H[0]} ${H[1]} Z" fill="${cool}" fill-opacity="0.10" stroke="${cool}" stroke-width="2"/>`;
  s += `<path d="M 380 214 C 360 160, 260 142, 190 168 C 120 196, 108 270, 150 310 C 200 350, 320 344, 362 296 C 386 268, 392 240, 380 214 Z" fill="${ok}" fill-opacity="0.20" stroke="${ok}" stroke-width="1.6"/>`;
  // supporting hyperplane at H: tr(D V) = 0 line, tangent at the corner
  s += `<line x1="437" y1="92" x2="525" y2="211" stroke="${hot}" stroke-width="2" stroke-dasharray="7 5"/>`;
  s += `<circle cx="${H[0]}" cy="${H[1]}" r="7" fill="${hot}"/>`;
  s += `<circle cx="512" cy="112" r="6" fill="${rose}"/>`;
  s += text(152, 108, 'all witnesses', 15, cool, 'middle', 'bold');
  s += text(250, 258, 'filtered real', 15, ok, 'middle', 'bold');
  s += text(250, 278, 'witnesses R', 15, ok, 'middle', 'bold');
  s += text(520, 150, "H", 18, hot, 'start', 'bold');
  s += text(520, 168, 'exposed witness', 12, hot);
  s += text(520, 183, '(Ha and Kye)', 12, hot);
  s += text(540, 226, 'D: separable state', 12, hot);
  s += text(540, 241, 'touching only H', 12, hot);
  s += text(524, 100, "ρ<tspan font-size=\"13\" dy=\"5\">ε</tspan>", 18, rose, "start", "bold", SERIF, "italic");
  s += text(552, 104, 'detected by H,', 12, rose);
  s += text(552, 119, 'missed by all of R', 12, rose);
  return s;
}
const draw = () => {
  const c = checkHook();
  let s = text(40, 46, 'Real witnesses miss it, whatever the local filter', 26, ink, 'start', 'normal', SERIF);
  s += text(40, 72, 'An explicit two-qutrit state disproves both parts of the Shen–Chen–Bian conjecture (Theorem 8)', 15, muted);
  s += cone();
  const X = 740;
  s += text(X, 128, "On the explicit state ρ<tspan font-size=\"11\" dy=\"4\">ε</tspan>", 15, ink, "start", "bold");
  s += text(X, 160, 'complex witness H:', 15, muted);
  s += text(X + 200, 160, c.witness.replace('-', '−'), 17, rose, 'start', 'bold');
  s += text(X, 188, 'every filtered real witness:', 15, muted);
  s += text(X + 200, 188, '&gt; 8.5 × 10⁻¹⁰', 17, ok, 'start', 'bold');
  s += text(X, 216, 'certified ball radius:', 15, muted);
  s += text(X + 200, 216, '8 × 10⁻¹⁰', 17, ink, 'start', 'bold');
  s += `<line x1="${X}" y1="236" x2="${X + 400}" y2="236" stroke="${muted}" stroke-width="1"/>`;
  s += text(X, 262, '3 × 3 (two qutrits): both parts fail', 14, ink);
  s += text(X, 284, '2 × 4: local unitaries fail; filters open', 14, ink);
  s += text(X, 306, 'one extra local qubit restores detection', 14, ok);
  s += text(X, 336, 'Far too fragile for experiment: noise threshold about 1.6 × 10⁻⁷.', 12, dim);
  s += text(1160, 386, 'Schematic of convex sets, not data. Witness and separable state: Ha and Kye. Unrefereed candidate.', 12, dim, 'end');
  return s;
};
const description = 'Banner for a paper on real entanglement witnesses under local filters. Title: Real witnesses miss it, whatever the local filter. Subtitle: an explicit two-qutrit state disproves both parts of the Shen–Chen–Bian conjecture (Theorem 8). Left: a schematic of convex sets. A large blue region labelled all witnesses contains a smaller green region labelled filtered real witnesses R. The large region has one sharp corner H, the exposed witness of Ha and Kye, which lies outside R. A dashed orange line through H is defined by D, a separable state touching the witness set only at H. Just across that line is a pink point, rho epsilon, detected by H and missed by all of R. Right: on the explicit state, the complex witness H gives minus 8 over 19199997, every filtered real witness gives more than 8.5 times 10 to the minus 10, and the certified ball radius is 8 times 10 to the minus 10. For 3 by 3 (two qutrits) both parts fail; for 2 by 4 local unitaries fail and the filter case is open; one extra local qubit restores detection. Far too fragile for experiment: noise threshold about 1.6 times 10 to the minus 7. Footer: schematic of convex sets, not data; witness and separable state from Ha and Kye; unrefereed candidate.';
function frame(inner, background) {
  return bannerSvg({ inner, description, background, glow: { color: '#9fd3ff', cx: '0.25', cy: '0.6', r: '0.35', opacity: '0.07' } });
}
const thumbSpec = {
  kicker: ['RESEARCH RELEASE · NOVEMBER 2026', 'QUANTUM INFORMATION · ENTANGLEMENT'],
  head: ['Real witnesses miss it', '<em>whatever the local filter</em>'], headSize: 50,
  sub: 'An explicit two-qutrit state is caught by a complex entanglement witness and by no real one, after any local filter.',
  tag: 'UNREFEREED CANDIDATE',
  hero: '<div class="eq-label">two qutrits, 3 × 3</div><div class="hero-title">complex: −8/19199997</div><div class="note">every filtered real witness<br>stays above 8.5 × 10⁻¹⁰</div><div class="eq-foot">Shen–Chen–Bian conjecture: both parts fail</div>'
};
module.exports = { draw, description, thumbSpec, checkHook };
if (require.main === module) (async () => {
  const fs = require('fs'), pth = require('path'), os = require('os'), vm = require('vm');
  const ROOT = pth.join(__dirname, '..');
  const ck = checkHook();
  console.log('check: witness value', ck.witness, 'margin, ball, noise threshold, chi(W) and 2 x 4 agree with the release');
  const { resolve: bannerResolve } = require('./banner-palettes');
  const bp = bannerResolve(SLUG); if (!bp) throw new Error('no banner palette');
  const tp = require('./thumbnail-palettes');
  const tname = tp.resolve(SLUG, true);
  const svg = frame(draw(), bp);
  fs.writeFileSync(pth.join(ROOT, 'assets/art', SLUG + '.svg'), svg);
  console.log('art:', SLUG, 'banner palette', bp.name, '| thumbnail palette', tname);
  const i = process.argv.indexOf('--render');
  if (i < 0) return;
  const inspect = process.argv[i + 1];
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
