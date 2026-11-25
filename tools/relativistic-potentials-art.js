'use strict';
const { bannerSvg } = require('./svg-xml');
// Relativity leaves only the symmetric potentials integrable (relativistic-homogeneous-potentials-classification): banner, OG, thumbnail.
// "This image helps the reader understand" which planar homogeneous polynomial potentials keep a second conserved
// quantity when the kinetic energy is relativistic (Theorem A): contour maps, for degree k = 4, of the two survivors
// c x^k (level lines are straight, so sliding along y changes nothing and p2 is conserved) and c (x^2 + y^2)^{k/2}
// (level lines are circles, so rotating changes nothing and the angular momentum is conserved), beside the classically
// integrable x^4 + y^4, which loses integrability: at its extremal direction the sideways eigenvalue is 0 but the
// sideways term y^4 is present, which Theorem 4.1 excludes.
// checkHook verifies in exact rational arithmetic on a grid: dV/dy = 0 for x^4; x V_y - y V_x = 0 for (x^2+y^2)^2;
// both fail somewhere for x^4 + y^4; for x^4 + y^4 the direction (1, 0) maximises |V| on the unit circle, satisfies the
// Darboux condition V_y(1,0) = 0, and has transverse eigenvalue V_yy(1,0)/(k V(1,0)) = 0; and the drawn straight and
// circular contours lie on the stated level sets. It refuses to draw on any mismatch.
// Reference: txgraffiti-order48-successor (one exact object balanced with immediately readable values).
// Usage: node tools/relativistic-potentials-art.js [--render OUTDIR_FOR_INSPECTION] [--no-mirror]
const SLUG = 'relativistic-homogeneous-potentials-classification';
const ink = '#f6f2ea', muted = '#e2e7ea', dim = '#c3ccd2', hot = '#ffc36b', rose = '#f2a7b5', mint = '#a8e6c1';
const SANS = 'Arial,Helvetica,sans-serif', SERIF = 'Georgia,serif';
const text = (x, y, s, size = 18, color = ink, anchor = 'start', weight = 'normal', family = SANS, style = 'normal') => {
  if (/<|&(?!(lt|gt|amp|minus|#\d+);)/.test(s.replace(/<\/?tspan[^>]*>/g, ''))) throw new Error('unescaped < or & in SVG text: ' + s);
  return `<text class="og-hide" x="${x}" y="${y}" fill="${color}" font-family="${family}" font-size="${size}" font-weight="${weight}" font-style="${style}" text-anchor="${anchor}">${s}</text>`;
};
const sup = s => `<tspan baseline-shift="super" font-size="0.62em">${s}</tspan>`;
// Exact rationals with BigInt.
const gcd = (a, b) => { a = a < 0n ? -a : a; b = b < 0n ? -b : b; while (b) [a, b] = [b, a % b]; return a; };
const Q = (n, d = 1n) => { n = BigInt(n); d = BigInt(d); if (d < 0n) { n = -n; d = -d; } const g = gcd(n, d) || 1n; return [n / g, d / g]; };
const add = (a, b) => Q(a[0] * b[1] + b[0] * a[1], a[1] * b[1]);
const sub = (a, b) => Q(a[0] * b[1] - b[0] * a[1], a[1] * b[1]);
const mul = (a, b) => Q(a[0] * b[0], a[1] * b[1]);
const pw = (a, n) => { let r = Q(1); for (let i = 0; i < n; i++) r = mul(r, a); return r; };
const isZero = a => a[0] === 0n;
// Potentials of degree k = 4 with exact partial derivatives.
const K = 4;
const r2 = (x, y) => add(mul(x, x), mul(y, y));
const POT = {
  line: { V: x => pw(x, 4), Vx: x => mul(Q(4), pw(x, 3)), Vy: () => Q(0) },
  round: { V: (x, y) => pw(r2(x, y), 2), Vx: (x, y) => mul(Q(4), mul(x, r2(x, y))), Vy: (x, y) => mul(Q(4), mul(y, r2(x, y))) },
  sep: { V: (x, y) => add(pw(x, 4), pw(y, 4)), Vx: x => mul(Q(4), pw(x, 3)), Vy: (x, y) => mul(Q(4), pw(y, 3)), Vyy: (x, y) => mul(Q(12), mul(y, y)) }
};
const ang = (P, x, y) => sub(mul(x, P.Vy(x, y)), mul(y, P.Vx(x, y)));
// Contours drawn: V = r^4 for r in LEVELS (each curve passes through (r, 0)).
const LEVELS = [Q(1, 3), Q(2, 3), Q(1)];
function checkHook() {
  let n = 0, sepSlide = false, sepRot = false;
  for (let a = -4; a <= 4; a++) for (let b = -4; b <= 4; b++) {
    const x = Q(a, 3), y = Q(b, 5);
    if (!isZero(POT.line.Vy(x, y))) throw new Error('x^4 not translation invariant');
    if (!isZero(ang(POT.round, x, y))) throw new Error('radial potential not rotation invariant');
    if (!isZero(POT.sep.Vy(x, y))) sepSlide = true;
    if (!isZero(ang(POT.sep, x, y))) sepRot = true;
    n++;
  }
  if (!sepSlide || !sepRot) throw new Error('x^4 + y^4 unexpectedly symmetric');
  const one = Q(1), zero = Q(0);
  if (!isZero(POT.sep.Vy(one, zero))) throw new Error('(1,0) is not a Darboux direction of x^4 + y^4');
  if (isZero(mul(Q(K), POT.sep.V(one, zero)))) throw new Error('(1,0) is not proper');
  if (!isZero(POT.sep.Vyy(one, zero))) throw new Error('transverse eigenvalue of x^4 + y^4 at (1,0) is not 0');
  // On the unit circle cos^4 + sin^4 = 1 - 2 c^2 s^2 < 1 away from the axes, so (1,0) maximises |V|.
  for (let a = 1; a < 12; a++) { const c = Q(a, 12); if (!(mul(Q(2), mul(mul(c, c), sub(one, mul(c, c))))[0] > 0n)) throw new Error('extremum'); }
  for (const r of LEVELS) {
    if (!isZero(sub(POT.line.V(r), pw(r, 4)))) throw new Error('line contour');
    if (!isZero(sub(POT.round.V(mul(r, Q(3, 5)), mul(r, Q(4, 5))), pw(r, 4)))) throw new Error('circle contour');
  }
  return { gridPoints: n, sepLambda: 0, k: K };
}
const fx = v => Number(v[0]) / Number(v[1]);
function panel(kind, cx, cy, R, col) {
  let s = `<rect x="${cx - R - 8}" y="${cy - R - 8}" width="${2 * R + 16}" height="${2 * R + 16}" rx="10" fill="#ffffff" fill-opacity="0.04" stroke="${dim}" stroke-opacity="0.35"/>`;
  s += `<line x1="${cx - R}" y1="${cy}" x2="${cx + R}" y2="${cy}" stroke="${dim}" stroke-width="0.8" opacity="0.5"/>`;
  s += `<line x1="${cx}" y1="${cy - R}" x2="${cx}" y2="${cy + R}" stroke="${dim}" stroke-width="0.8" opacity="0.5"/>`;
  LEVELS.forEach((lv, i) => {
    const r = fx(lv) * R * 0.95, w = (1.4 + i * 0.6).toFixed(1), op = (0.55 + 0.2 * i).toFixed(2);
    if (kind === 'line') for (const sg of [-1, 1]) s += `<line x1="${(cx + sg * r).toFixed(1)}" y1="${cy - R}" x2="${(cx + sg * r).toFixed(1)}" y2="${cy + R}" stroke="${col}" stroke-width="${w}" opacity="${op}"/>`;
    else if (kind === 'round') s += `<circle cx="${cx}" cy="${cy}" r="${r.toFixed(1)}" fill="none" stroke="${col}" stroke-width="${w}" opacity="${op}"/>`;
    else {
      const pts = [];
      for (let j = 0; j <= 360; j += 3) { const t = j * Math.PI / 180, c = Math.cos(t), sn = Math.sin(t), q = Math.pow(c ** 4 + sn ** 4, -0.25); pts.push(`${(cx + r * q * c).toFixed(1)},${(cy - r * q * sn).toFixed(1)}`); }
      s += `<polyline points="${pts.join(' ')}" fill="none" stroke="${col}" stroke-width="${w}" opacity="${op}"/>`;
    }
  });
  if (kind === 'line') s += `<line x1="${cx + R * 0.5}" y1="${cy + 34}" x2="${cx + R * 0.5}" y2="${cy - 34}" stroke="${ink}" stroke-width="2" marker-end="url(#rarrow)"/>`;
  if (kind === 'round') s += `<path d="M ${(cx + R * 0.82).toFixed(1)} ${cy + 20} A ${(R * 0.84).toFixed(1)} ${(R * 0.84).toFixed(1)} 0 0 0 ${(cx + R * 0.6).toFixed(1)} ${cy - 56}" fill="none" stroke="${ink}" stroke-width="2" marker-end="url(#rarrow)"/>`;
  return s;
}
const draw = () => {
  checkHook();
  let s = '<defs><marker id="rarrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#f6f2ea"/></marker></defs>';
  s += text(40, 46, 'Which force fields stay integrable under relativity?', 27, ink, 'start', 'normal', SERIF);
  s += text(40, 74, `For H = √(1 + p${sup('2')}) + V with V a homogeneous polynomial of degree k ≥ 3. Contour maps of V for k = 4:`, 14, muted);
  const cy = 186, R = 72, xs = [130, 360, 590];
  s += panel('line', xs[0], cy, R, mint) + panel('round', xs[1], cy, R, mint) + panel('sep', xs[2], cy, R, rose);
  const ly = cy + R + 34;
  s += text(xs[0], ly, `c·x${sup('k')}`, 19, mint, 'middle', 'bold', SERIF) + text(xs[0], ly + 20, 'slide along y: unchanged', 12.5, dim, 'middle') + text(xs[0], ly + 38, 'survives', 13, mint, 'middle', 'bold');
  s += text(xs[1], ly, `c·(x${sup('2')} + y${sup('2')})${sup('k/2')}`, 19, mint, 'middle', 'bold', SERIF) + text(xs[1], ly + 20, 'rotate: unchanged', 12.5, dim, 'middle') + text(xs[1], ly + 38, 'survives', 13, mint, 'middle', 'bold');
  s += text(xs[2], ly, `x${sup('4')} + y${sup('4')}`, 19, rose, 'middle', 'bold', SERIF) + text(xs[2], ly + 20, 'integrable classically', 12.5, dim, 'middle') + text(xs[2], ly + 38, 'fails relativistically', 13, rose, 'middle', 'bold');
  const X = 740;
  s += text(X, 128, 'Relativity keeps only two kinds of', 15, ink, 'start', 'bold');
  s += text(X, 148, 'polynomial potential integrable:', 15, ink, 'start', 'bold');
  s += text(X, 190, `c·x${sup('k')}  and  c·(x${sup('2')} + y${sup('2')})${sup('k/2')}`, 27, hot, 'start', 'bold', SERIF);
  s += text(X, 218, 'up to rotation, for every degree k ≥ 3 (new for k ≥ 6)', 14, hot);
  s += text(X, 250, 'Their extra conserved quantity is the matching momentum.', 14, mint);
  s += text(X, 280, 'Along the direction where |V| is largest, the sideways', 13.5, dim);
  s += text(X, 298, 'eigenvalue λ must be 0 or 1, and any sideways term fails.', 13.5, dim);
  s += text(X, 330, 'Integrals meromorphic on the complex phase space.', 13, rose);
  s += text(40, 386, 'Contour lines are level sets of V; arrows show the symmetry that leaves V unchanged. Unrefereed candidate.', 12, dim);
  return s;
};
const description = 'Banner for a paper classifying integrable homogeneous polynomial potentials for the relativistic Hamiltonian. Title: which force fields stay integrable under relativity? Subtitle: for H equals the square root of 1 plus p squared, plus V, with V a homogeneous polynomial of degree k at least 3; contour maps of V for k equals 4. Three square panels of contour lines. First panel, green: straight vertical lines with an arrow along them, labelled c times x to the k; slide along y: unchanged; survives. Second panel, green: concentric circles with a curved arrow, labelled c times (x squared plus y squared) to the power k over 2; rotate: unchanged; survives. Third panel, pink: rounded-square contours, labelled x to the 4 plus y to the 4; integrable classically; fails relativistically. Right: relativity keeps only two kinds of polynomial potential integrable: c times x to the k and c times (x squared plus y squared) to the power k over 2, up to rotation, for every degree k at least 3 (new for k at least 6). Their extra conserved quantity is the matching momentum. Along the direction where the absolute value of V is largest, the sideways eigenvalue lambda must be 0 or 1, and any sideways term fails. Integrals meromorphic on the complex phase space. Footer: contour lines are level sets of V; arrows show the symmetry that leaves V unchanged; unrefereed candidate.';
function frame(inner, background) {
  const c = checkHook();
  if (c.sepLambda !== 0 || c.k !== 4 || !description.includes('k equals 4')) throw new Error('stated values differ from the computation');
  return bannerSvg({ inner, description, background, glow: { color: '#a8e6c1', cx: '0.25', cy: '0.5', r: '0.35', opacity: '0.07' } });
}
const thumbSpec = {
  kicker: ['RESEARCH RELEASE · NOVEMBER 2026', 'MATHEMATICAL PHYSICS'],
  head: ['Relativity keeps', 'only <em>symmetric</em> fields'], headSize: 54,
  sub: 'Which polynomial force fields keep a second conserved quantity when motion is relativistic.',
  tag: 'UNREFEREED CANDIDATE',
  hero: '<div class="eq-label">the only integrable potentials</div><div class="hero-title">c·x<sup>k</sup>, c·r<sup>k</sup></div><div class="note">degree k ≥ 3; radial only for even k</div><div class="eq-foot">slide or rotate: momentum conserved</div>'
};
module.exports = { draw, description, thumbSpec, checkHook };
if (require.main === module) (async () => {
  const fs = require('fs'), pth = require('path'), os = require('os'), vm = require('vm');
  const ROOT = pth.join(__dirname, '..');
  console.log('check:', JSON.stringify(checkHook()));
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
