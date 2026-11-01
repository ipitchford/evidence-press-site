'use strict';
const { bannerSvg } = require('./svg-xml');
// Affine Karpelevich conjecture fails in four states: banner, OG card and thumbnail.
// Sources (paper: How fast can a driven Markov network oscillate?, 27 Oct 2026):
//  - Theorem 2.2 (Karpelevich, Ito's form), n = 4, upper half-plane arcs:
//      Farey pair 0,1/4 (q=1,s=4): lambda = tau + (1-tau) i, the straight segment from 1 to i;
//      pair 1/4,1/3 (q=3,s=4): upper root of lambda^4 - tau lambda - (1-tau) = 0, from i to e^{2 pi i/3};
//      pair 1/3,1/2 (Lemma 2.6): x = -(1+a^2)/2, y = (1-a) sqrt(3a^2-2a+3)/2, a in (0,1), from e^{2 pi i/3} to -1,
//      equivalently y = sqrt(g(x)), g(x) = 3x^2 - 2x - 1 + 4x sqrt(-2x-1).
//  - Theorem 3.1: Q_w has eigenvalue -4745 + 450 sqrt(3) i, alpha = 2781, beta = 0.886688240869062 (exact
//    triangle ratio 177853829/38529), so zeta = 1 + Re/alpha + i Im/(alpha beta) = -0.706221 + 0.316083 i,
//    which is 0.0087 above the arc (Section 1.4). The lower half is the mirror image.
// Usage: node tools/affinity-karpelevich-art.js [--render OUTDIR_FOR_INSPECTION] [--no-mirror]
const SLUG = 'affinity-karpelevich-threshold';
const ink = '#f3f6fb', muted = '#d5deea', dim = '#b8c6d8';
const region = '#8fd3ff', witness = '#ffcf6b', arcCol = '#ff9f9f';
const SANS = 'Arial,Helvetica,sans-serif', SERIF = 'Georgia,serif';
const text = (x, y, s, size = 18, color = ink, anchor = 'start', weight = 'normal', family = SANS) =>
  `<text class="og-hide" x="${x}" y="${y}" fill="${color}" font-family="${family}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}">${s}</text>`;
const f = v => (+v).toFixed(1);

const g = x => 3 * x * x - 2 * x - 1 + 4 * x * Math.sqrt(-2 * x - 1);
const BETA = 0.886688240869062;
const ZX = 1 - 4745 / 2781, ZY = 450 * Math.sqrt(3) / (2781 * BETA);

// complex helpers
const cm = (a, b) => [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
const cd = (a, b) => { const d = b[0] * b[0] + b[1] * b[1]; return [(a[0] * b[0] + a[1] * b[1]) / d, (a[1] * b[0] - a[0] * b[1]) / d]; };
function upperBoundary() {
  const pts = [];
  for (let i = 0; i <= 60; i++) { const t = 1 - i / 60; pts.push([t, 1 - t]); }          // 1 -> i
  let z = [0, 1];
  for (let i = 1; i <= 200; i++) {                                                          // i -> e^{2 pi i/3}
    const t = i / 200;
    for (let k = 0; k < 40; k++) {
      const z2 = cm(z, z), z3 = cm(z2, z), z4 = cm(z3, z);
      const p = [z4[0] - t * z[0] - (1 - t), z4[1] - t * z[1]];
      const dp = [4 * z3[0] - t, 4 * z3[1]];
      const s = cd(p, dp); z = [z[0] - s[0], z[1] - s[1]];
    }
    pts.push(z.slice());
  }
  for (let i = 1; i <= 200; i++) {                                                          // e^{2 pi i/3} -> -1
    const a = i / 200;
    pts.push([-(1 + a * a) / 2, (1 - a) * Math.sqrt(3 * a * a - 2 * a + 3) / 2]);
  }
  return pts;
}

// Left panel: the whole region Omega_4 in the unit disc.
const CX = 200, CY = 222, R = 122;
const qx = x => CX + R * x, qy = y => CY - R * y;
function wholeRegion() {
  const up = upperBoundary();
  const all = up.concat(up.slice().reverse().map(([x, y]) => [x, -y]));
  let s = `<circle cx="${CX}" cy="${CY}" r="${R}" fill="none" stroke="${muted}" stroke-opacity=".45" stroke-width="1.5" stroke-dasharray="4 5"/>`;
  s += `<path d="M${all.map(([x, y]) => `${f(qx(x))} ${f(qy(y))}`).join(' L')} Z" fill="${region}" fill-opacity=".22" stroke="${region}" stroke-width="2.5"/>`;
  s += `<path d="M${CX - R - 8} ${CY} H${CX + R + 8} M${CX} ${CY - R - 8} V${CY + R + 8}" stroke="${muted}" stroke-opacity=".25" stroke-width="1"/>`;
  // highlight the left arc (Lemma 2.6) and the zoom window
  const arc = [];
  for (let i = 0; i <= 100; i++) { const a = i / 100; arc.push([-(1 + a * a) / 2, (1 - a) * Math.sqrt(3 * a * a - 2 * a + 3) / 2]); }
  s += `<path d="M${arc.map(([x, y]) => `${f(qx(x))} ${f(qy(y))}`).join(' L')}" stroke="${arcCol}" stroke-width="4" fill="none"/>`;
  s += `<circle cx="${f(qx(ZX))}" cy="${f(qy(ZY))}" r="5.5" fill="${witness}" stroke="#0e1e33" stroke-width="1.5"/>`;
  s += `<rect x="${f(qx(-0.75))}" y="${f(qy(0.345))}" width="${f(R * 0.09)}" height="${f(R * 0.075)}" fill="none" stroke="${witness}" stroke-opacity=".8" stroke-width="1.5"/>`;
  s += text(qx(1) + 6, CY + 20, '1', 15, dim);
  s += text(qx(-1) - 8, CY + 20, '−1', 15, dim, 'end');
  s += text(CX + 6, qy(1) - 8, 'i', 15, dim);
  s += text(CX, 386, 'Ω₄: all eigenvalues of 4×4 stochastic matrices', 14, muted, 'middle');
  s += text(CX + 30, CY + 38, 'Karpelevich', 15, region, 'start', 'bold');
  s += text(CX + 30, CY + 56, 'region Ω₄', 15, region, 'start', 'bold');
  return s;
}

// Right panel: magnified window near the witness.
const X0 = 470, X1 = 1150, YB = 340, YT = 108, XL = -0.75, XR = -0.66, YLO = 0.27, YHI = 0.345;
const px = x => X0 + (x - XL) * (X1 - X0) / (XR - XL), py = y => YB - (y - YLO) * (YB - YT) / (YHI - YLO);
function zoom() {
  let s = `<path d="M${X0} ${YT - 4} V${YB} H${X1}" stroke="${muted}" stroke-opacity=".35" stroke-width="1.5" fill="none"/>`;
  // region below the arc (inside Omega_4) shaded
  const pts = [];
  for (let i = 0; i <= 400; i++) { const x = XL + (XR - XL) * i / 400; const y = Math.sqrt(g(x)); if (y >= YLO && y <= YHI) pts.push([x, y]); }
  const last = pts[pts.length - 1];
  const inPath = `M${f(px(pts[0][0]))} ${f(py(YLO))} L${pts.map(([x, y]) => `${f(px(x))} ${f(py(y))}`).join(' L')} L${f(px(XR))} ${f(py(last[1]))} L${f(px(XR))} ${f(py(YLO))} Z`;
  s += `<path d="${inPath}" fill="${region}" fill-opacity=".18"/>`;
  s += `<path d="M${pts.map(([x, y]) => `${f(px(x))} ${f(py(y))}`).join(' L')}" stroke="${arcCol}" stroke-width="4" fill="none"/>`;
  const by = Math.sqrt(g(ZX));
  s += `<path d="M${f(px(ZX))} ${f(py(by))} V${f(py(ZY) + 9)}" stroke="${witness}" stroke-width="2.5"/>`;
  s += `<circle cx="${f(px(ZX))}" cy="${f(py(by))}" r="4" fill="${arcCol}"/>`;
  s += `<circle cx="${f(px(ZX))}" cy="${f(py(ZY))}" r="9" fill="${witness}" stroke="#0e1e33" stroke-width="2"/>`;
  s += text(f(px(ZX) - 20), f(py(ZY) - 52), 'rescaled eigenvalue ζ of the four-state witness', 17, witness, 'end', 'bold');
  s += text(f(px(ZX) - 20), f(py(ZY) - 31), 'ζ ≈ −0.7062 + 0.3161 i; conjecture (S3) needs ζ in Ω₄', 14.5, muted, 'end');
  s += `<path d="M${f(px(ZX) - 16)} ${f(py(ZY) - 26)} L${f(px(ZX) - 8)} ${f(py(ZY) - 9)}" stroke="${witness}" stroke-width="1.5"/>`;
  s += text(f(px(ZX) + 16), f((py(ZY) + py(by)) / 2 + 6), 'gap 0.0087: ζ lies outside', 16, witness, 'start', 'bold');
  s += text(f(px(-0.668)), f(py(0.29)), 'inside Ω₄', 18, region, 'end', 'bold');
  s += text(f(px(-0.701)), f(py(0.300)), 'boundary arc of Ω₄ (from −1 to e^(2πi/3))', 14.5, arcCol, 'start');
  for (const x of [-0.74, -0.72, -0.70, -0.68, -0.66]) {
    s += `<path d="M${f(px(x))} ${YB} V${YB + 5}" stroke="${muted}" stroke-opacity=".6"/>`;
    s += text(f(px(x)), YB + 21, x.toFixed(2).replace('-', '−'), 13, dim, 'middle');
  }
  s += text(X1, YB + 44, 'exact boundary curve y = √g(x) (Lemma 2.6) · real part horizontal, imaginary part vertical · magnified window', 12.5, dim, 'end');
  return s;
}

const draw = () => text(40, 46, 'One eigenvalue escapes the squashed Karpelevich region', 27, ink, 'start', 'normal', SERIF) +
  text(40, 74, 'A driven four-state network whose rescaled eigenvalue lies just outside Ω₄, refuting the affine Karpelevich conjecture', 16, muted) +
  wholeRegion() + zoom();

const description = 'Banner for a paper refuting the affine Karpelevich conjecture for Markov rate matrices. Left: the Karpelevich region Omega_4, the set of all eigenvalues of four-by-four stochastic matrices, drawn exactly inside the dashed unit circle. Its boundary runs straight from 1 to i, along a curved arc from i to e^{2 pi i/3}, and along a curved arc from e^{2 pi i/3} to -1 (highlighted), with the mirror image below. A small box marks the window magnified on the right. Right: the magnified window near the left arc, using the exact boundary formula from the paper. The region inside Omega_4 is shaded below the arc. The rescaled eigenvalue zeta of the paper’s integer four-state rate matrix, approximately -0.7062 + 0.3161 i, sits 0.0087 above the arc, outside the region, whereas the conjecture requires it to lie inside.';

function frame(inner, background) {
  return bannerSvg({ inner, description, background, glow: { color: witness, cx: '0.62', cy: '0.45', r: '0.45', opacity: '0.06' } });
}

const thumbSpec = {
  kicker: ['RESEARCH RELEASE · OCTOBER 2026', 'MARKOV SPECTRA · COUNTEREXAMPLE'],
  head: ['Four states.', '<em>One eigenvalue out.</em>'], headSize: 72,
  sub: 'A driven four-state network has an eigenvalue outside the conjectured “squashed Karpelevich” region; on fully connected networks it fails in every size from four up.',
  tag: 'UNREFEREED CANDIDATE',
  hero: '<div class="eq-label">four-state witness · Theorem 3.1</div><div class="hero-title">ζ ∉ Ω₄</div><div class="note">λ = −4745 + 450√3 i<br>ζ ≈ −0.7062 + 0.3161 i<br><b>0.0087 above the arc</b></div><div class="eq-foot">exact integer certificate · written proofs</div>'
};

module.exports = { draw, description, thumbSpec, g, ZX, ZY };
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
    : { title: 'How fast can a driven Markov network oscillate? A four-state counterexample to the affine Karpelevich conjecture, and the exact dimension at which it fails', status: 'unrefereed-candidate', datePublished: '2026-10-27' };
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
