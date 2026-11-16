'use strict';
const { bannerSvg } = require('./svg-xml');
// The fractional Hardy constant on convex domains (convex-fractional-hardy-constants): banner, OG, thumbnail.
// "This image helps the reader understand" the paper's main p = 1 statement: every convex domain's Hardy constant, as a
// fraction of the half-space constant, lies between the sharp floor 2^-s (attained in the limit by thin slabs) and 1,
// where the earlier guarantee was 1/2; and that a disc sits strictly below 1, so its constant is attained (Theorem C).
// checkHook recomputes 2^-s, the gain 2^(1-s) and the disc indicator ratio F_2(s) (BSZ Prop. 4.8, with a Lanczos
// log-gamma) and compares them with the released output (verification/output/hardy_verification.json: table_ratios and
// ball_ratios for N = 2); it refuses to draw on mismatch.
// Reference: txgraffiti-order48-successor (one exact object balanced with immediately readable values).
// Usage: node tools/convex-hardy-art.js [--render OUTDIR_FOR_INSPECTION] [--no-mirror]
const SLUG = 'convex-fractional-hardy-constants';
const ink = '#f6f2ea', muted = '#e2e7ea', dim = '#c3ccd2', hot = '#ffc36b', cool = '#9fd3ff';
const SANS = 'Arial,Helvetica,sans-serif', SERIF = 'Georgia,serif';
const text = (x, y, s, size = 18, color = ink, anchor = 'start', weight = 'normal', family = SANS, style = 'normal') => {
  if (/[<&]/.test(s.replace(/<\/?tspan[^>]*>/g, ''))) throw new Error('unescaped < or & in SVG text: ' + s);
  return `<text class="og-hide" x="${x}" y="${y}" fill="${color}" font-family="${family}" font-size="${size}" font-weight="${weight}" font-style="${style}" text-anchor="${anchor}">${s}</text>`;
};
// Lanczos log-gamma (g = 7, n = 9), relative accuracy about 1e-15 for x > 0
const LC = [0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059,
  12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
function lgamma(x) {
  if (x < 0.5) return Math.log(Math.PI / Math.abs(Math.sin(Math.PI * x))) - lgamma(1 - x);
  x -= 1; let a = LC[0]; const t = x + 7.5;
  for (let i = 1; i < 9; i++) a += LC[i] / (x + i);
  return 0.5 * Math.log(2 * Math.PI) + (x + 0.5) * Math.log(t) - t + Math.log(a);
}
// F_N(s): ball indicator quotient divided by the half-space constant (verify_hardy.F_N)
const FN = (N, s) => Math.exp(0.5 * Math.log(Math.PI) - lgamma(1 - s / 2) - lgamma((1 + s) / 2)
  + lgamma((N + s) / 2) - lgamma((N - s) / 2) + lgamma(N - s) - lgamma(N));
const floor = s => Math.pow(2, -s);
function checkHook() {
  // released table_ratios (s, universal_floor, gain_over_half, disc_F2) and ball_ratios N = 2 (s, F_N, 12 digits)
  const table = [['0.01', '0.9931', '1.986', '0.9969'], ['0.1', '0.933', '1.866', '0.9652'], ['0.25', '0.8409', '1.682', '0.9007'],
    ['0.5', '0.7071', '1.414', '0.7737'], ['0.75', '0.5946', '1.189', '0.6369'], ['0.9', '0.5359', '1.072', '0.5544'], ['0.99', '0.5035', '1.007', '0.5054']];
  const disc = [['0.001', 0.999692694676], ['0.01', 0.996886593752], ['0.1', 0.965179820913], ['0.25', 0.900679075209], ['0.5', 0.773730246072],
    ['0.75', 0.636876281753], ['0.9', 0.55435023628], ['0.99', 0.505401306005], ['0.999', 0.500539762038]];
  const sig = (v, ref) => { const d = ref.replace(/^0\.0*|\./g, '').length; return Number(v.toPrecision(d)) === Number(ref); };
  for (const [s, f, g, d] of table) {
    const x = Number(s);
    if (!sig(floor(x), f) || !sig(floor(x) + floor(x), g) || !sig(FN(2, x), d)) throw new Error('table_ratios mismatch at s = ' + s);
  }
  for (const [s, v] of disc) if (Math.abs(FN(2, Number(s)) / v - 1) > 1e-10) throw new Error('disc ratio mismatch at s = ' + s + ': ' + FN(2, Number(s)));
  for (let k = 1; k < 100; k++) { const s = k / 100; if (!(floor(s) < FN(2, s) && FN(2, s) < 1)) throw new Error('ordering fails at s = ' + s); }
  return { rows: table.length, discRows: disc.length };
}
// ---- left: three shapes, constants as a fraction of the half-space constant ----
function shapes() {
  let s = text(40, 116, 'Edge strength, as a share of a flat edge', 15, muted, 'start', 'bold');
  s += text(40, 136, 'p = 1; the fractional Hardy constant of each shape', 13, dim);
  s += text(40, 152, 'divided by that of a half-space', 13, dim);
  const fill = 'rgba(159,211,255,0.20)', edge = cool;
  // half-space
  s += `<rect x="44" y="190" width="104" height="96" fill="${fill}"/><line x1="44" y1="190" x2="148" y2="190" stroke="${edge}" stroke-width="2.5"/>`;
  s += text(96, 306, 'half-space', 13, ink, 'middle', 'bold') + text(96, 324, 'exactly 1', 13, dim, 'middle');
  // disc
  s += `<circle cx="226" cy="238" r="46" fill="${fill}" stroke="${edge}" stroke-width="2.5"/>`;
  s += text(226, 306, 'disc', 13, ink, 'middle', 'bold') + text(226, 324, 'strictly below 1:', 13, dim, 'middle') + text(226, 340, 'attained', 13, hot, 'middle', 'bold');
  // slab
  s += `<rect x="300" y="226" width="112" height="24" fill="${fill}" stroke="${edge}" stroke-width="2.5"/>`;
  s += `<line x1="292" y1="238" x2="300" y2="238" stroke="${edge}" stroke-dasharray="3 3"/><line x1="412" y1="238" x2="420" y2="238" stroke="${edge}" stroke-dasharray="3 3"/>`;
  s += text(356, 306, 'thin slab', 13, ink, 'middle', 'bold') + text(356, 324, 'the minimum:', 13, dim, 'middle') + text(356, 340, '2⁻ˢ', 15, hot, 'middle', 'bold', SERIF);
  return s;
}
// ---- centre: ratio against s ----
function chart() {
  const X0 = 500, X1 = 850, Y0 = 300, Y1 = 150; // y: ratio 0.4 .. 1.0
  const px = s => X0 + (X1 - X0) * s, py = r => Y0 - (Y0 - Y1) * (r - 0.4) / 0.6;
  let s = text(X0 - 30, 116, 'Every convex domain lies in the band', 15, muted, 'start', 'bold');
  s += text(X0 - 30, 136, 'share of the half-space constant, p = 1', 13, dim);
  const axis = 'rgba(255,255,255,0.55)';
  let band = `M${px(0)},${py(1)} L${px(1)},${py(1)}`;
  const pts = []; for (let k = 100; k >= 0; k--) pts.push(`${px(k / 100).toFixed(1)},${py(floor(k / 100)).toFixed(1)}`);
  band += ' L' + pts.join(' L') + ' Z';
  s += `<path d="${band}" fill="rgba(255,195,107,0.16)"/>`;
  const line = (f, color, w, dash = '') => { const p = []; for (let k = 0; k <= 100; k++) p.push(`${px(k / 100).toFixed(1)},${py(f(k / 100)).toFixed(1)}`); return `<polyline points="${p.join(' ')}" fill="none" stroke="${color}" stroke-width="${w}"${dash ? ` stroke-dasharray="${dash}"` : ''}/>`; };
  s += line(() => 1, ink, 1.6) + line(x => FN(2, Math.max(x, 1e-6)), cool, 2) + line(floor, hot, 2.6) + line(() => 0.5, '#9aa7b0', 1.6, '6 4');
  s += `<line x1="${X0}" y1="${Y0}" x2="${X1}" y2="${Y0}" stroke="${axis}"/><line x1="${X0}" y1="${Y0}" x2="${X0}" y2="${Y1 - 4}" stroke="${axis}"/>`;
  for (const r of [0.5, 1]) s += text(X0 - 6, py(r) + 4, r === 1 ? '1' : '½', 12, dim, 'end');
  for (const v of [0, 0.5, 1]) s += text(px(v), Y0 + 16, v === 0.5 ? '½' : String(v), 12, dim, 'middle');
  s += text(X1, Y0 + 32, 'order s', 12, dim, 'end');
  s += text(px(1) + 8, py(1) + 4, 'half-space', 12, ink);
  s += text(px(0.62), py(FN(2, 0.62)) - 8, 'disc (upper bound)', 12, cool, 'start', 'bold');
  s += text(px(1) + 8, py(floor(1)) - 6, 'new floor 2⁻ˢ', 12, hot, 'start', 'bold');
  s += text(px(1) + 8, py(0.5) + 12, 'old floor ½', 12, '#c3ccd2');
  s += text(X0 - 30, 356, 'Thin slabs reach the floor; the gain is up to twice the old guarantee', 12, ink);
  return s;
}
function right() {
  const x0 = 990; let s = '';
  s += `<line x1="${x0 - 22}" y1="104" x2="${x0 - 22}" y2="372" stroke="rgba(255,255,255,0.16)" stroke-width="1"/>`;
  s += text(x0, 116, 'Also proved', 15, muted, 'start', 'bold');
  s += text(x0, 140, 'Small order: all convex', 13, dim);
  s += text(x0, 157, 'shapes share one limit', 13, dim);
  s += text(x0, 184, 'Below the half-space value,', 13, ink);
  s += text(x0, 201, 'the constant is attained:', 13, ink);
  s += text(x0, 218, 'balls, planar convex shapes', 13, ink);
  s += text(x0, 254, 'Open: 3D convex bodies,', 12, dim, 'start', 'normal', SERIF, 'italic');
  s += text(x0, 270, 'corners, exact p-ranges', 12, dim, 'start', 'normal', SERIF, 'italic');
  s += text(x0, 294, 'No particular constant', 12, dim, 'start', 'normal', SERIF, 'italic');
  s += text(x0, 310, 'is computed', 12, dim, 'start', 'normal', SERIF, 'italic');
  return s;
}
const draw = () =>
  text(40, 50, 'The fractional Hardy constant on convex domains', 25, ink, 'start', 'normal', SERIF) +
  text(40, 80, 'Worst convex shape: a slab. Every convex region keeps at least 2⁻ˢ of the half-space constant', 15, muted) +
  shapes() + chart() + right();
const description = 'Banner for a paper on fractional Hardy constants of convex domains. Title: The fractional Hardy constant on convex domains. Subtitle: Worst convex shape: a slab. Every convex region keeps at least 2 to the minus s of the half-space constant. Left: edge strength as a share of a flat edge, at p = 1: the fractional Hardy constant of each shape divided by that of a half-space; a half-space, exactly 1; a disc, strictly below 1, attained; a thin slab, the minimum, 2 to the minus s. Centre: every convex domain lies in the band between 1 and the new floor 2 to the minus s, plotted against the order s from 0 to 1, with an upper bound for the disc inside the band and the old floor one half as a dashed line below; thin slabs reach the floor; the gain is up to twice the old guarantee. Right: also proved: at small order all convex shapes share one limit; below the half-space value the constant is attained, for balls and planar convex shapes. Open: three-dimensional convex bodies, corners, exact p-ranges; no particular constant is computed.';
function frame(inner, background) {
  return bannerSvg({ inner, description, background, glow: { color: '#ffd38a', cx: '0.5', cy: '0.55', r: '0.4', opacity: '0.06' } });
}
const thumbSpec = {
  kicker: ['RESEARCH RELEASE · NOVEMBER 2026', 'ANALYSIS · FRACTIONAL SOBOLEV SPACES'],
  head: ['Fractional Hardy constants:', 'the <em>slab</em> is the worst convex shape'], headSize: 46,
  sub: 'Every convex region keeps at least 2⁻ˢ of the half-space constant at p = 1, and balls attain their constants.',
  tag: 'UNREFEREED CANDIDATE',
  hero: '<div class="eq-label">guaranteed share, p = 1</div><div class="hero-title">2⁻ˢ</div><div class="note">before: ½<br>sharp: thin slabs</div><div class="eq-foot">written proofs</div>'
};
module.exports = { draw, description, thumbSpec, checkHook };
if (require.main === module) (async () => {
  const fs = require('fs'), pth = require('path'), os = require('os'), vm = require('vm');
  const ROOT = pth.join(__dirname, '..');
  const chk = checkHook();
  console.log('check: table_ratios rows', chk.rows, '| disc ratio rows', chk.discRows, '| floor < disc < 1 on s = 0.01..0.99');
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
