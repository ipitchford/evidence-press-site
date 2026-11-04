'use strict';
const { bannerSvg } = require('./svg-xml');
// Symmetric cyclic ptychography: banner, OG card and thumbnail.
// "This image helps the reader understand" that a real-even (Gaussian) probe erases the data exactly on a cross of
// probe multipliers p_r(q), that the only objects it then confuses are twin pairs (a conjugate pair on two antipodal
// pixels), and that one extra coherent intensity |g*x|^2 tells the twins apart.
// Source (paper 0.1.0-candidate): Lemma 2.1, (eq:real-cross), Proposition 9.1 (Gaussian w_j = t^dist(j,0)^2),
// Theorem 9.3 (fibres), Theorem 9.5 and Proposition 9.6 (twisted geometric g, rho = 1 - 1/n). Every number drawn is
// computed below from those formulas at n = 8, t = 1/2 (inside (0, t*(8)) with t*(8) ~ 0.737, Theorem 9.2).
// Usage: node tools/symmetric-ptychography-art.js [--render OUTDIR_FOR_INSPECTION] [--no-mirror]
const SLUG = 'symmetric-ptychography-one-intensity-repair';
const ink = '#f4f1ea', muted = '#e3d9c9', dim = '#c4b7a2';
const zeroC = '#ff8f6b', cellC = '#8fd3ff', twinA = '#ffd77a', twinB = '#c9a6ff', okC = '#9be3c0';
const SANS = 'Arial,Helvetica,sans-serif', SERIF = 'Georgia,serif';
const text = (x, y, s, size = 18, color = ink, anchor = 'start', weight = 'normal', family = SANS) =>
  `<text class="og-hide" x="${x}" y="${y}" fill="${color}" font-family="${family}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}">${s}</text>`;
const f = v => (+v).toFixed(1);
// --- exact model at n = 8 -------------------------------------------------------------------------------------
const n = 8, N = n / 2, T = 0.5;
const C = (re, im = 0) => ({ re, im });
const add = (a, b) => C(a.re + b.re, a.im + b.im), mul = (a, b) => C(a.re * b.re - a.im * b.im, a.re * b.im + a.im * b.re);
const conj = a => C(a.re, -a.im), abs2 = a => a.re * a.re + a.im * a.im, ei = th => C(Math.cos(th), Math.sin(th));
const mod = (j) => ((j % n) + n) % n, dist = j => Math.min(mod(j), n - mod(j));
const w = Array.from({ length: n }, (_, j) => C(Math.pow(T, dist(j) ** 2)));
// p_r(q) = (F a_r)_{-q}, a_r(j) = conj(w_j) w_{j+r}, unitary DFT (Fv)_q = n^{-1/2} sum_j v_j omega^{-qj}.
const p = (r, q) => { let s = C(0); for (let j = 0; j < n; j++) s = add(s, mul(mul(conj(w[j]), w[mod(j + r)]), ei(2 * Math.PI * q * j / n))); return C(s.re / Math.sqrt(n), s.im / Math.sqrt(n)); };
const forced = (r, q) => (q === N && r % 2 === 1) || (r === N && q % 2 === 1);
const P = []; for (let r = 0; r < n; r++) { P.push([]); for (let q = 0; q < n; q++) P[r].push(Math.sqrt(abs2(p(r, q)))); }
// Full data Y_w(x)_{s,k} = |n^{-1/2} sum_j x_j conj(w_{j-s}) omega^{-kj}|^2.
const Y = x => { const out = []; for (let s = 0; s < n; s++) for (let k = 0; k < n; k++) { let z = C(0); for (let j = 0; j < n; j++) z = add(z, mul(mul(x[j], conj(w[mod(j - s)])), ei(-2 * Math.PI * k * j / n))); out.push(abs2(z) / n); } return out; };
// Twin pair (Theorem 9.3, time-antipodal case): x = a e_t + b e_{t+N}, partner conjugates both coefficients.
const tt = 1, A = C(1), Bc = mul(C(0.8), ei(Math.PI / 3));
const vec = (a, b) => Array.from({ length: n }, (_, j) => j === tt ? a : j === tt + N ? b : C(0));
const x = vec(A, Bc), xt = vec(conj(A), conj(Bc));
// Twisted geometric added vector (Proposition 9.6), rho = 1 - 1/n, unit energy.
const rho = 1 - 1 / n; let S = 0; for (let j = 0; j < n; j++) S += rho ** (2 * j);
const g = Array.from({ length: n }, (_, j) => mul(C(rho ** j / Math.sqrt(S)), ei(Math.PI * j / n)));
const J = v => { let z = C(0); for (let j = 0; j < n; j++) z = add(z, mul(conj(g[j]), v[j])); return abs2(z); };
const Jx = J(x), Jt = J(xt);
// --- drawing ---------------------------------------------------------------------------------------------------
const GX = 70, GY = 132, CS = 27;
function gridPanel() {
  let s = text(GX - 10, 118 - 6, 'Probe multipliers p_r(q), Gaussian probe, n = 8', 15, ink, 'start', 'bold', SERIF);
  const lmin = Math.log10(Math.min(...P.flat().filter((v, i) => !forced(Math.floor(i / n), i % n)))), lmax = Math.log10(Math.max(...P.flat()));
  for (let r = 0; r < n; r++) for (let q = 0; q < n; q++) {
    const xx = GX + q * CS, yy = GY + r * CS;
    if (forced(r, q)) s += `<rect x="${xx + 1.5}" y="${yy + 1.5}" width="${CS - 3}" height="${CS - 3}" rx="3" fill="${zeroC}"/>`;
    else { const o = 0.18 + 0.72 * (Math.log10(P[r][q]) - lmin) / (lmax - lmin); s += `<rect x="${xx + 1.5}" y="${yy + 1.5}" width="${CS - 3}" height="${CS - 3}" rx="3" fill="${cellC}" fill-opacity="${o.toFixed(3)}"/>`; }
  }
  s += text(GX + n * CS / 2, GY + n * CS + 20, 'frequency q →', 12, dim, 'middle');
  s += `<text class="og-hide" x="${GX - 12}" y="${GY + n * CS / 2}" fill="${dim}" font-family="${SANS}" font-size="12" text-anchor="middle" transform="rotate(-90 ${GX - 12} ${GY + n * CS / 2})">lag r →</text>`;
  const lx = GX + n * CS + 16;
  s += `<rect x="${lx}" y="${GY + 8}" width="14" height="14" rx="3" fill="${zeroC}"/>` + text(lx + 20, GY + 20, 'forced zero', 13, zeroC, 'start', 'bold');
  s += text(lx, GY + 40, 'a cross: row r = 4,', 12, dim) + text(lx, GY + 56, 'column q = 4,', 12, dim) + text(lx, GY + 72, 'odd entries', 12, dim);
  s += `<rect x="${lx}" y="${GY + 96}" width="14" height="14" rx="3" fill="${cellC}" fill-opacity=".8"/>` + text(lx + 20, GY + 108, 'nonzero', 13, cellC);
  s += text(lx, GY + 128, '(shade: log size)', 12, dim);
  return s;
}
function phasor(cx, cy, z, color, label) {
  const L = 34 * Math.sqrt(abs2(z)), th = Math.atan2(z.im, z.re), ex = cx + L * Math.cos(th), ey = cy - L * Math.sin(th);
  return `<circle cx="${cx}" cy="${cy}" r="36" fill="none" stroke="${muted}" stroke-opacity=".25"/><path d="M${cx} ${cy} L${f(ex)} ${f(ey)}" stroke="${color}" stroke-width="3" stroke-linecap="round"/><circle cx="${f(ex)}" cy="${f(ey)}" r="4" fill="${color}"/>` + text(cx, cy + 54, label, 12, dim, 'middle');
}
function twinPanel() {
  const X0 = 470;
  let s = text(X0, 112, 'Only twins are confused', 15, ink, 'start', 'bold', SERIF);
  s += text(X0, 132, 'two antipodal pixels, phases conjugated', 12, dim);
  const row = (y, v, color, name) => {
    let r = text(X0, y + 4, name, 14, color, 'start', 'bold', SERIF);
    for (let j = 0; j < n; j++) { const on = abs2(v[j]) > 0; r += `<rect x="${X0 + 52 + j * 26}" y="${y - 10}" width="20" height="20" rx="4" fill="${on ? color : muted}" fill-opacity="${on ? 0.95 : 0.12}"/>`; }
    return r;
  };
  s += row(166, x, twinA, 'x') + row(196, xt, twinB, 'twin');
  s += text(X0 + 52 + tt * 26 + 10, 226, `pixel ${tt}`, 11, dim, 'middle') + text(X0 + 52 + (tt + N) * 26 + 10, 226, `pixel ${tt + N}`, 11, dim, 'middle');
  s += phasor(X0 + 70, 290, Bc, twinA, 'x at pixel 5') + phasor(X0 + 190, 290, conj(Bc), twinB, 'twin at pixel 5');
  s += text(X0, 372, 'all 64 recorded intensities: identical', 13, zeroC, 'start', 'bold');
  return s;
}
function repairPanel() {
  const X0 = 830;
  let s = text(X0, 112, 'One extra exposure', 15, ink, 'start', 'bold', SERIF);
  s += text(X0, 132, 'structured beam g, read at one pixel', 12, dim);
  s += text(X0, 182, '|g*x|²', 30, ink, 'start', 'normal', SERIF);
  s += text(X0, 232, `x: ${Jx.toFixed(3)}`, 22, twinA, 'start', 'bold', SERIF);
  s += text(X0 + 160, 232, `twin: ${Jt.toFixed(3)}`, 22, twinB, 'start', 'bold', SERIF);
  s += text(X0, 274, 'differs for every twin pair', 14, okC, 'start', 'bold');
  s += text(X0, 294, '→ unique, even among mixed states', 14, okC, 'start', 'bold');
  s += text(X0, 334, 'g: twisted geometric beam (works for all even n);', 12, dim);
  s += text(X0, 350, 'a defocus chirp fails when 4 divides n', 12, dim);
  return s;
}
const draw = () =>
  text(40, 50, 'Symmetric probes: two lines of zeros, only twin images', 26, ink, 'start', 'normal', SERIF) +
  text(40, 78, 'Real-even probe in finite cyclic ptychography, known probe, all positions and frequencies; one extra intensity makes recovery unique', 14, muted) +
  gridPanel() + `<path d="M445 100 L 445 372" stroke="${muted}" stroke-opacity=".22" stroke-width="1.2"/>` + twinPanel() +
  `<path d="M805 100 L 805 372" stroke="${muted}" stroke-opacity=".22" stroke-width="1.2"/>` + repairPanel();
const description = `Banner for a paper on phase retrieval in ptychography with symmetric probes. Left: an 8 by 8 grid of the probe multipliers p_r(q) for a real Gaussian probe; the entries forced to zero, shown in orange, form a cross along row r = 4 and column q = 4 at odd positions, all other entries are nonzero and shaded by size. Middle: an object x supported on two opposite pixels, 1 and 5, and its twin with the phases conjugated; drawn as two short phase arrows mirrored about the horizontal axis; all 64 recorded intensities are identical for the two. Right: one extra coherent intensity |g*x|^2 with a twisted geometric beam gives ${Jx.toFixed(3)} for x and ${Jt.toFixed(3)} for the twin, so it tells every twin pair apart, making recovery unique even among mixed states; a defocus chirp fails when 4 divides n.`;
function frame(inner, background) {
  return bannerSvg({ inner, description, background, glow: { color: cellC, cx: '0.22', cy: '0.6', r: '0.4', opacity: '0.06' } });
}
const thumbSpec = {
  kicker: ['RESEARCH RELEASE · NOVEMBER 2026', 'PHASE RETRIEVAL · PTYCHOGRAPHY'],
  head: ['Two lines of zeros,', '<em>one extra exposure</em>'], headSize: 64,
  sub: 'A symmetric (e.g. Gaussian) probe can only confuse an object with its twin, and one extra coherent intensity tells every twin pair apart.',
  tag: 'UNREFEREED CANDIDATE',
  hero: `<div class="eq-label">extra intensity |g*x|², n = 8</div><div class="hero-title">${Jx.toFixed(3)} vs ${Jt.toFixed(3)}</div><div class="note">object vs its twin<br>same 64 recorded intensities<br>one extra reading separates them</div><div class="eq-foot">exact theorems · idealised cyclic model</div>`
};
module.exports = { draw, description, thumbSpec, Jx, Jt };
function guards() {
  // Cross mask exactly (Proposition 9.1 at t = 1/2 < t*(8)).
  for (let r = 0; r < n; r++) for (let q = 0; q < n; q++) {
    if (forced(r, q) && P[r][q] > 1e-12) throw new Error(`forced multiplier nonzero at (${r},${q})`);
    if (!forced(r, q) && P[r][q] < 1e-6) throw new Error(`nonforced multiplier vanishes at (${r},${q})`);
  }
  // Twins: identical full data (Theorem 9.3), nonreal relative phase.
  const y1 = Y(x), y2 = Y(xt); if (y1.some((v, i) => Math.abs(v - y2[i]) > 1e-12)) throw new Error('twin data differ');
  if (Math.abs(mul(A, conj(Bc)).im) < 1e-6) throw new Error('relative phase real: not a twin');
  // Repair (Theorem 9.5 / Proposition 9.6): the extra intensity separates them.
  if (Math.abs(Jx - Jt) < 0.05) throw new Error('extra intensity does not separate the twin');
}
if (require.main === module) (async () => {
  guards();
  const fs = require('fs'), pth = require('path'), os = require('os'), vm = require('vm');
  const ROOT = pth.join(__dirname, '..');
  const reg = JSON.parse(fs.readFileSync(pth.join(ROOT, 'data/BANNER_PALETTES.json'), 'utf8'));
  const { palettes } = require('./banner-palettes');
  const bsaved = reg.assignments.find(r => r.slug === SLUG); if (!bsaved) throw new Error('no saved banner palette'); const bname = bsaved.palette;
  const tp = require('./thumbnail-palettes');
  const tsaved = tp.load().assignments.find(r => r.slug === SLUG); if (!tsaved) throw new Error('no saved thumbnail palette');
  const tname = tsaved.editorialPalette || tsaved.palette;
  const svg = frame(draw(), { name: bname, colors: palettes[bname] });
  fs.writeFileSync(pth.join(ROOT, 'assets/art', SLUG + '.svg'), svg);
  console.log('art:', SLUG, 'banner palette', bname, '| thumbnail palette', tname, '| J(x) =', Jx.toFixed(4), 'J(twin) =', Jt.toFixed(4));
  const i = process.argv.indexOf('--render');
  if (i < 0) return;
  const inspect = process.argv[i + 1];
  fs.mkdirSync(inspect, { recursive: true });
  const { chromium } = require('playwright');
  const b = await chromium.launch(process.env.EVIDENCE_PRESS_CHROME ? { executablePath: process.env.EVIDENCE_PRESS_CHROME } : {});
  const shot = async (wd, h, html, file, opts = {}) => {
    const pg = await b.newPage({ viewport: { width: wd, height: h }, deviceScaleFactor: opts.dpr || 1 });
    await pg.setContent(html, { waitUntil: 'networkidle' });
    await pg.screenshot({ path: file, ...(opts.jpeg ? { type: 'jpeg', quality: 94 } : {}) });
    await pg.close();
  };
  const body = (wd, h, inner) => `<!DOCTYPE html><html><head><meta charset="utf-8"><style>*{margin:0}body{width:${wd}px;height:${h}px;background:#222}svg{width:${wd}px;height:${h}px;display:block}</style></head><body>${inner}</body></html>`;
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
