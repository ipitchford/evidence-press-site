'use strict';
const { bannerSvg } = require('./svg-xml');
// One angle, exact likelihood: banner, OG card and thumbnail.
// "This image helps the reader understand" that the angle Gamma between a wide binary's projected separation and
// projected relative velocity has an exact closed-form likelihood for each orbital eccentricity e (Theorem 3.1),
// so that different eccentricities give visibly different angle laws and a thermal population (f(e) = 2e) gives a
// flat law 1/pi (Section 5); by Theorem 4.1 the angle law of a population determines its eccentricity law.
// Sources (paper 1.0.0-candidate, 31 Oct 2026): Theorem 3.1, equation (1)
//   p(gamma|e) = [acosh(1/e) - 1{|cos gamma| > e} acosh(|cos gamma|/e)] / (pi sin^2 gamma);
// Section 5, equation for p_1 = 1/pi; Theorem 4.1. Curves are computed here from the closed form.
// Usage: node tools/wide-binary-angle-art.js [--render OUTDIR_FOR_INSPECTION] [--no-mirror]
const SLUG = 'wide-binary-angle-inversion';
const ink = '#f4f1ea', muted = '#e3d9c9', dim = '#c4b7a2';
const star = '#ffe2a8', sepc = '#ffd27a', velc = '#9cc7ff', angc = '#ffb3c7';
const EC = [{ e: 0.2, col: '#9fe0c8' }, { e: 0.6, col: '#9cc7ff' }, { e: 0.9, col: '#ffb3c7' }];
const thermal = '#ffd27a';
const SANS = 'Arial,Helvetica,sans-serif', SERIF = 'Georgia,serif';
const text = (x, y, s, size = 18, color = ink, anchor = 'start', weight = 'normal', family = SANS) =>
  `<text class="og-hide" x="${x}" y="${y}" fill="${color}" font-family="${family}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}">${s}</text>`;
const f = v => (+v).toFixed(1);
// Closed-form likelihood per radian on [0, pi] (Theorem 3.1), stable log form for c > e.
function K(g, e) {
  const c = Math.abs(Math.cos(g)), s2 = Math.sin(g) ** 2;
  const num = c > e ? Math.log((1 + Math.sqrt(1 - e * e)) / (c + Math.sqrt(c * c - e * e))) : Math.acosh(1 / e);
  return num / (Math.PI * s2);
}
// Left: schematic projected orbit with separation, velocity and the angle Gamma
function orbit() {
  const cx = 250, cy = 238, a = 150, b = 78, rot = -14;
  const fx = cx - Math.sqrt(a * a - b * b) * 0.9;
  let s = `<g transform="rotate(${rot} ${cx} ${cy})">`;
  s += `<ellipse cx="${cx}" cy="${cy}" rx="${a}" ry="${b}" fill="none" stroke="${muted}" stroke-opacity=".55" stroke-width="1.6" stroke-dasharray="5 5"/>`;
  const t = 1.05, px = cx + a * Math.cos(t), py = cy - b * Math.sin(t);
  const tx = -a * Math.sin(t), ty = -b * Math.cos(t), tn = Math.hypot(tx, ty);
  const vx = px + 105 * tx / tn, vy = py + 105 * ty / tn;
  s += `<circle cx="${f(fx)}" cy="${cy}" r="9" fill="${star}"/>`;
  s += `<circle cx="${f(px)}" cy="${f(py)}" r="6.5" fill="${star}"/>`;
  s += `<path d="M${f(fx)} ${cy} L${f(px)} ${f(py)}" stroke="${sepc}" stroke-width="3.2"/>`;
  s += `<path d="M${f(px)} ${f(py)} L${f(vx)} ${f(vy)}" stroke="${velc}" stroke-width="3.2"/>`;
  const ang = (x, y) => Math.atan2(y, x);
  const a1 = ang(px - fx, py - cy), a2 = ang(vx - px, vy - py), R = 30;
  const ex1 = px + R * Math.cos(a1), ey1 = py + R * Math.sin(a1), ex2 = px + R * Math.cos(a2), ey2 = py + R * Math.sin(a2);
  s += `<path d="M${f(px)} ${f(py)} L${f(ex1)} ${f(ey1)}" stroke="${sepc}" stroke-width="3.2" stroke-dasharray="2 4"/>`;
  s += `<path d="M${f(ex1)} ${f(ey1)} A${R} ${R} 0 0 0 ${f(ex2)} ${f(ey2)}" stroke="${angc}" stroke-width="2.6" fill="none"/>`;
  const arrow = (x, y, dx, dy, col) => { const n = Math.hypot(dx, dy), ux = dx / n, uy = dy / n; return `<path d="M${f(x)} ${f(y)} L${f(x - 12 * ux - 6 * uy)} ${f(y - 12 * uy + 6 * ux)} L${f(x - 12 * ux + 6 * uy)} ${f(y - 12 * uy - 6 * ux)} z" fill="${col}"/>`; };
  s += arrow(vx, vy, tx, ty, velc);
  s += `</g>`;
  s += text(118, 320, 'projected separation', 14.5, sepc, 'start', 'bold');
  s += text(48, 132, 'projected relative velocity', 14.5, velc, 'start', 'bold');
  s += text(338, 124, 'angle Γ', 17, angc, 'start', 'bold');
  s += text(60, 352, 'Schematic: one binary seen at one moment. Only Γ is measured.', 13.5, dim, 'start', 'normal', SERIF);
  return s;
}
// Right: exact likelihood curves (computed from the closed form)
const P = { x0: 700, x1: 1140, y0: 318, y1: 140 };
const YMAX = 1.0;
const gx = g => P.x0 + g / Math.PI * (P.x1 - P.x0);
const gy = v => P.y0 - Math.min(v, YMAX) / YMAX * (P.y0 - P.y1);
function curves() {
  let s = `<path d="M${P.x0} ${P.y1 - 8} V${P.y0} H${P.x1 + 8}" stroke="${muted}" stroke-opacity=".7" stroke-width="1.6" fill="none"/>`;
  s += `<path d="M${P.x0} ${f(gy(1 / Math.PI))} H${P.x1}" stroke="${thermal}" stroke-width="2.4" stroke-dasharray="8 6"/>`;
  for (const { e, col } of EC) {
    const pts = [];
    for (let i = 1; i < 360; i++) { const g = i / 360 * Math.PI; if (Math.abs(g - Math.PI / 2) < 1e-9) continue; pts.push(`${f(gx(g))} ${f(gy(K(g, e)))}`); }
    s += `<path d="M${pts.join(' L')}" stroke="${col}" stroke-width="2.8" fill="none"/>`;
  }
  let lx = P.x0 + 14; const ly = P.y1 + 8;
  for (const { e, col } of EC) { s += `<path d="M${lx} ${ly - 5} h22" stroke="${col}" stroke-width="3"/>` + text(lx + 28, ly, `e = ${e}`, 13.5, col, 'start', 'bold'); lx += 92; }
  s += `<path d="M${lx} ${ly - 5} h22" stroke="${thermal}" stroke-width="2.4" stroke-dasharray="6 4"/>` + text(lx + 28, ly, 'thermal population (flat)', 13.5, thermal, 'start', 'bold');
  for (const [g, l] of [[0, '0°'], [Math.PI / 2, '90°'], [Math.PI, '180°']]) s += text(f(gx(g)), P.y0 + 20, l, 12.5, dim, 'middle');
  s += text(P.x0 - 4, P.y1 - 24, 'Exact likelihood of the angle for one orbit of eccentricity e', 14, dim, 'start', 'normal', SERIF);
  s += text(P.x1, P.y0 + 40, 'angle Γ · curves computed from the closed form (Theorem 3.1)', 13, dim, 'end', 'normal', SERIF);
  s += text(P.x0, P.y0 + 62, 'Different eccentricity laws never give the same angle law (Theorem 4.1)', 14, ink, 'start', 'bold');
  return s;
}
const draw = () => text(40, 52, 'One angle, an exact likelihood', 28, ink, 'start', 'normal', SERIF) +
  text(40, 82, 'For wide binary stars, the angle between separation and motion has a closed-form law, and its distribution fixes the eccentricities', 15.5, muted) +
  orbit() + `<path d="M640 130 L 640 370" stroke="${muted}" stroke-opacity=".25" stroke-width="1.2"/>` + curves();
const description = 'Banner for a paper on inferring the orbital eccentricities of wide binary stars from one measured angle. Left, schematic: an elliptical orbit seen on the sky, with the brighter star at a focus and its companion on the orbit; a gold line is the projected separation, a blue arrow is the projected relative velocity, and a pink arc marks the angle Gamma between them, which is the only quantity measured. Right: the exact likelihood of Gamma between 0 and 180 degrees for three eccentricities, e = 0.2 (green), 0.6 (blue) and 0.9 (pink), computed from the paper\'s closed-form formula (Theorem 3.1); each curve is symmetric about 90 degrees and peaks where the absolute cosine of the angle equals e. A dashed gold line at 1 over pi shows the flat angle law of a thermal population with eccentricity density 2e. By Theorem 4.1, different eccentricity distributions never give the same angle distribution. The model assumes random orbital phase and random orientation; no observational data are shown.';
function frame(inner, background) {
  return bannerSvg({ inner, description, background, glow: { color: sepc, cx: '0.3', cy: '0.5', r: '0.4', opacity: '0.06' } });
}
const thumbSpec = {
  kicker: ['RESEARCH RELEASE · OCTOBER 2026', 'WIDE BINARY STARS'],
  head: ['One angle,', '<em>exact likelihood.</em>'], headSize: 66,
  sub: 'The angle between a wide binary\'s separation and its motion has a closed-form law, and the angle distribution pins down the eccentricity distribution.',
  tag: 'UNREFEREED CANDIDATE',
  hero: '<div class="eq-label">likelihood of the angle Γ, eccentricity e</div><div class="hero-title">closed form</div><div class="note">angle law fixes eccentricity law<br>E e² = ½ + E cos 2Γ − ½ E cos 4Γ<br>thermal ⇔ flat angles</div><div class="eq-foot">ideal model · synthetic checks only</div>'
};
module.exports = { draw, description, thumbSpec, K };
if (require.main === module) (async () => {
  const fs = require('fs'), pth = require('path'), os = require('os'), vm = require('vm');
  const ROOT = pth.join(__dirname, '..');
  // Guards against the paper: each curve integrates to 1 on [0, pi]; peak density at |cos gamma| = e (on the c<=e side).
  for (const { e } of EC) {
    let sum = 0; const N = 200000;
    for (let i = 0; i < N; i++) { const g = (i + 0.5) / N * Math.PI; sum += K(g, e) * Math.PI / N; }
    if (Math.abs(sum - 1) > 2e-3) throw new Error('normalisation mismatch at e=' + e + ': ' + sum);
  }
  if (Math.abs(K(Math.PI / 4, 0.5) - (Math.acosh(2) - Math.acosh(Math.SQRT1_2 / 0.5)) / (Math.PI * 0.5)) > 1e-12 || Math.abs(K(Math.PI / 2.5, 0.5) - Math.acosh(2) / (Math.PI * Math.sin(Math.PI / 2.5) ** 2)) > 1e-12) throw new Error('closed form mismatch');
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
