'use strict';
const { bannerSvg } = require('./svg-xml');
// Entropy contraction via reverse erasure: banner, OG card and thumbnail.
// "This image helps the reader understand" that the worst-case entropy retention of the reverse-erasure channel depends
// on the prior only through its rarest symbol (two different priors with the same smallest probability 0.1 have the
// same coefficient), and that this gives the exact worst-case retention log n / (2 log 2n) of the half-lazy walk on
// K_{n,n} for every n, where only n = 3 had been checked (by computer, Caputo-Chen-Gu-Polyanskiy 2025).
// Source (paper 0.1.0-candidate, 3 Nov 2026): Theorem 2.3 (only q matters), Theorem 2.5 (closed form
// log(1/q)/log(1/(alpha q)) for alpha <= q^(q/(1-q))), Theorem 6.1 and equation (6.3) (log M / (2 log 2M)), Figure 1.
// Usage: node tools/reverse-erasure-art.js [--render OUTDIR_FOR_INSPECTION] [--no-mirror] [--banner-only]
const SLUG = 'reverse-erasure-entropy-contraction';
const ink = '#f4f1ea', muted = '#e3d9c9', dim = '#c9bdb0';
const rareC = '#ffb38a', otherC = '#9fd2ff', curveC = '#9be3c0', provedC = '#9be3c0', ccgpC = '#ffd56b', localC = '#d9c7ff';
const SANS = 'Arial,Helvetica,sans-serif', SERIF = 'Georgia,serif';
const text = (x, y, s, size = 18, color = ink, anchor = 'start', weight = 'normal', family = SANS) =>
  `<text class="og-hide" x="${x}" y="${y}" fill="${color}" font-family="${family}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}">${s}</text>`;
const f = v => (+v).toFixed(1);
const ALPHA = 0.5, Q = 0.1;
const PRIORS = [[0.1, 0.2, 0.7], [0.1, 0.9]];
const etaClosed = (q, a) => Math.log(1 / q) / Math.log(1 / (a * q));       // Theorem 2.5, valid for a <= q^(q/(1-q))
const threshold = q => Math.pow(q, q / (1 - q));
const ETA = etaClosed(Q, ALPHA);                                             // log 10 / log 20 = 0.7686
const knn = n => Math.log(n) / (2 * Math.log(2 * n));                       // Theorem 6.1, equation (6.3)
// Left: two priors drawn as bars; the rarest bar (q = 0.1) highlighted in both.
function priors() {
  let s = text(40, 128, 'Reverse erasure: keep the symbol with probability α,', 14, dim) + text(40, 146, 'otherwise redraw it from the prior. Two different priors:', 14, dim);
  const base = 318, H = 140, bw = 34;
  const groups = [[52, PRIORS[0], 'ρ = (0.1, 0.2, 0.7)'], [228, PRIORS[1], 'ρ = (0.1, 0.9)']];
  for (const [x0, p, label] of groups) {
    p.forEach((v, i) => {
      const x = x0 + i * (bw + 10), h = v * H, c = v === Q ? rareC : otherC;
      s += `<rect x="${x}" y="${f(base - h)}" width="${bw}" height="${f(h)}" rx="3" fill="${c}" fill-opacity="${v === Q ? 0.9 : 0.45}" stroke="${c}" stroke-width="1.4"/>`;
      s += text(x + bw / 2, base - h - 7, String(v), 13, c, 'middle', 'bold');
    });
    s += `<path d="M${x0 - 6} ${base} H${x0 + p.length * (bw + 10) - 4}" stroke="${dim}" stroke-width="1.1"/>`;
    s += text(x0 - 6, base + 22, label, 14, ink, 'start', 'bold');
  }
  s += text(40, 366, 'Same rarest probability q = 0.1, so at α = 1/2 both keep', 14, rareC, 'start', 'bold');
  s += text(40, 384, 'the same worst-case fraction: log 10 / log 20 ≈ ' + ETA.toFixed(3), 14, rareC, 'start', 'bold');
  return s;
}
// Middle: the formula and its threshold.
function formula() {
  const x = 448;
  let s = text(x, 150, 'Only the rarest symbol matters', 19, ink, 'start', 'normal', SERIF);
  s += text(x, 196, 'η = log(1/q) / log(1/(αq))', 21, rareC, 'start', 'bold', SERIF);
  s += text(x, 224, 'for α ≤ q<tspan dy="-7" font-size="12">q/(1−q)</tspan><tspan dy="7">, the sharp threshold;</tspan>', 15, muted);
  s += text(x, 244, 'above it the worst inputs are tilts, with', 15, muted) + text(x, 262, 'no closed form.', 15, muted);
  s += text(x, 304, 'A half-lazy walk on two vertex sets is two', 15, dim) + text(x, 322, 'reverse-erasure steps with α = 1/2 and', 15, dim) + text(x, 340, 'a uniform prior on each side, q = 1/n.', 15, dim);
  return s;
}
// Right: the K_{n,n} coefficient log n / (2 log 2n), n = 2..10, rising towards 1/2; n = 3 marked.
const CX0 = 828, CX1 = 1160, CY0 = 330, CY1 = 150, NMAX = 10;
const cx = n => CX0 + (n - 2) * (CX1 - CX0) / (NMAX - 2), cy = v => CY0 - (v - 0.2) * (CY0 - CY1) / (0.5 - 0.2);
function chart() {
  let s = text(800, 128, 'Half-lazy walk on K<tspan dy="4" font-size="12">n,n</tspan><tspan dy="-4">: worst-case entropy kept</tspan>', 16, ink, 'start', 'bold');
  s += `<path d="M${CX0 - 10} ${f(cy(0.5))} H${CX1 + 8}" stroke="${dim}" stroke-width="1.1" stroke-dasharray="5 4"/>` + text(CX1 + 8, cy(0.5) - 6, '1/2', 12, dim, 'end');
  s += `<path d="M${CX0 - 10} ${f(cy(0.25))} H${CX1 + 8}" stroke="${localC}" stroke-width="1.1" stroke-dasharray="2 4"/>` + text(CX1 + 8, cy(0.25) + 16, 'local value 1/4', 12, localC, 'end');
  s += `<path d="M${CX0 - 10} ${CY0 + 4} H${CX1 + 8}" stroke="${dim}" stroke-width="1.1"/>`;
  const pts = []; for (let n = 2; n <= NMAX; n += 0.25) pts.push(`${f(cx(n))} ${f(cy(knn(n)))}`);
  s += `<path d="M${pts.join(' L')}" stroke="${curveC}" stroke-width="2.4" fill="none"/>`;
  for (let n = 2; n <= NMAX; n++) {
    const c = n === 3 ? ccgpC : provedC;
    s += `<circle cx="${f(cx(n))}" cy="${f(cy(knn(n)))}" r="${n === 3 ? 7 : 5}" fill="${c}" stroke="#1b1b1b" stroke-width="1"/>`;
    s += text(cx(n), CY0 + 22, String(n), 12, dim, 'middle');
  }
  s += text(CX0 - 14, CY0 + 22, 'n =', 12, dim, 'end');
  s += text(cx(3) + 12, cy(knn(3)) + 26, 'n = 3: checked by computer (2025)', 13, ccgpC, 'start', 'bold');
  s += text(cx(5.6), cy(knn(10)) - 22, 'log n / (2 log 2n): proved for all n', 13, provedC, 'middle', 'bold');
  return s;
}
const draw = () =>
  text(40, 56, 'How much relative entropy survives one step of a noisy reset?', 26, ink, 'start', 'normal', SERIF) +
  text(40, 84, 'The worst case depends on the prior only through its rarest symbol, which settles a complete-bipartite conjecture', 15, muted) +
  priors() + `<path d="M424 112 L 424 384" stroke="${muted}" stroke-opacity=".22" stroke-width="1.2"/>` + formula() +
  `<path d="M784 112 L 784 384" stroke="${muted}" stroke-opacity=".22" stroke-width="1.2"/>` + chart();
const description = 'Banner for a paper on entropy contraction. On the left, two prior distributions drawn as bars: (0.1, 0.2, 0.7) and (0.1, 0.9), with the rarest bar of height 0.1 highlighted in orange in both. Caption: same rarest probability q = 0.1, so at retention alpha = 1/2 both keep the same worst-case fraction of relative entropy, log 10 / log 20, about 0.769. In the middle, the formula eta = log(1/q) / log(1/(alpha q)), valid for alpha up to the sharp threshold q to the power q/(1-q); above it the worst inputs are tilts with no closed form; a half-lazy walk on two vertex sets is two reverse-erasure steps with alpha = 1/2 and a uniform prior on each side, q = 1/n. On the right, a chart of the worst-case entropy kept by one step of the half-lazy walk on the complete bipartite graph K_{n,n}, log n / (2 log 2n), for n = 2 to 10, rising from 1/4 towards 1/2; the point n = 3 is marked in yellow as checked by computer in 2025, and the curve is labelled proved for all n. A dotted line marks the local value 1/4 and a dashed line the limit 1/2.';
function frame(inner, background) {
  return bannerSvg({ inner, description, background, glow: { color: rareC, cx: '0.2', cy: '0.7', r: '0.4', opacity: '0.06' } });
}
const thumbSpec = {
  kicker: ['RESEARCH RELEASE · NOVEMBER 2026', 'INFORMATION THEORY · MARKOV CHAINS'],
  head: ['Only the rarest', '<em>symbol matters</em>'], headSize: 70,
  sub: 'How much entropy a noisy reset keeps depends only on the smallest prior probability, which settles a 2025 conjecture on complete bipartite graphs.',
  tag: 'UNREFEREED CANDIDATE',
  hero: '<div class="eq-label">priors (0.1, 0.2, 0.7) and (0.1, 0.9)</div><div class="hero-title">same η</div><div class="note">worst-case retention<br>log(1/q) / log(1/(αq))<br>with q = 0.1</div><div class="eq-foot">K<sub>n,n</sub>: log n / (2 log 2n), all n</div>'
};
module.exports = { draw, description, thumbSpec };
if (require.main === module) (async () => {
  const fs = require('fs'), pth = require('path'), os = require('os'), vm = require('vm');
  const ROOT = pth.join(__dirname, '..');
  // Guards: both priors have minimum 0.1 and sum to 1; alpha = 1/2 lies below the threshold 0.1^(1/9) ~ 0.774, so the
  // closed form applies; K_{n,n} values match equation (6.3) at n = 3 (log 3 / (2 log 6) ~ 0.3066, the CCGP case).
  for (const p of PRIORS) { if (Math.min(...p) !== Q || Math.abs(p.reduce((a, b) => a + b, 0) - 1) > 1e-12) throw new Error('prior mismatch'); }
  if (!(ALPHA <= threshold(Q))) throw new Error('alpha above threshold');
  if (Math.abs(ETA - Math.log(10) / Math.log(20)) > 1e-12 || Math.abs(ETA - 0.7686) > 1e-4) throw new Error('eta mismatch');
  if (Math.abs(knn(3) - 0.3066) > 1e-4 || Math.abs(knn(2) - 0.25) > 1e-12) throw new Error('K_nn mismatch');
  for (let n = 2; n <= 40; n++) if (!(ALPHA <= threshold(1 / n) + 1e-12)) throw new Error('bipartite outside closed-form regime at n=' + n);
  const bp = require('./banner-palettes'); const { palettes } = bp;
  const b0 = bp.resolve(SLUG); if (!b0) throw new Error('no banner palette'); const bname = b0.name;
  const tp = require('./thumbnail-palettes');
  const tname = tp.resolve(SLUG, true);
  const svg = frame(draw(), { name: bname, colors: palettes[bname] });
  fs.writeFileSync(pth.join(ROOT, 'assets/art', SLUG + '.svg'), svg);
  console.log('art:', SLUG, 'banner palette', bname, '| thumbnail palette', tname, '| eta =', ETA.toFixed(4), '| K33 =', knn(3).toFixed(4));
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
