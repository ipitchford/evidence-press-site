'use strict';
const { bannerSvg } = require('./svg-xml');
// The recomputed split likelihood-ratio interval is not a confidence sequence: banner, OG card and thumbnail.
// "This image helps the reader understand" that the split likelihood-ratio statistic Q_n, recomputed after every new
// pair of observations, keeps climbing back above any fixed threshold log(1/eps) (so the fixed-threshold interval
// excludes the truth again and again), while it stays under a threshold that rises slowly with n (the repair).
// Source (paper 0.1.0-candidate, 1 Nov 2026): Theorem 1(i), Q_n = (S_n T_n - T_n^2/2)/n exactly in the Gaussian
// two-stream scheme; Theorem 5 with Robbins's normal-mixture boundary, b(n) = lambda_1 (1 + rho/n){2 log(1/alpha)
// + log(1 + n/rho)}, rho = 1, alpha = eps = 0.2; at-a-glance table (horizons at which the error first exceeds nominal).
// The path is an exact simulation: S_n, T_n are sums of independent N(0,1) variables (LCG + Box-Muller, seed 3),
// stepped one observation at a time to n = 1000 and then by exact Gaussian increments to 400 log-spaced times per
// decade up to n = 10^8. Seeds 1 and 2 do not cross before 10^8; seed 3 is the first that does. Paths vary widely.
// Usage: node tools/split-persistence-art.js [--render OUTDIR_FOR_INSPECTION] [--no-mirror]
const SLUG = 'split-likelihood-persistence';
const ink = '#f4f1ea', muted = '#e3d9c9', dim = '#c4b7a2';
const pathC = '#9fc9ff', flatC = '#ffb27a', fixC = '#9be3c0', hitC = '#ff8a8a';
const SANS = 'Arial,Helvetica,sans-serif', SERIF = 'Georgia,serif';
const text = (x, y, s, size = 18, color = ink, anchor = 'start', weight = 'normal', family = SANS) =>
  `<text class="og-hide" x="${x}" y="${y}" fill="${color}" font-family="${family}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}">${s}</text>`;
const f = v => (+v).toFixed(1);

const SEED = 3, PER = 400, DEC = 8, EPS = 0.2;
const C = Math.log(1 / EPS), L1 = (Math.sqrt(5) - 1) / 4;
const repaired = n => L1 * (1 + 1 / n) * (2 * Math.log(1 / EPS) + Math.log(1 + n));
function samplePath(seed = SEED) {
  let s = seed >>> 0, spare = null;
  const r = () => ((s = (Math.imul(1664525, s) + 1013904223) >>> 0) + 0.5) / 4294967296;
  const g = () => { if (spare !== null) { const v = spare; spare = null; return v; }
    const a = Math.sqrt(-2 * Math.log(r())), b = 2 * Math.PI * r(); spare = a * Math.sin(b); return a * Math.cos(b); };
  let S = 0, T = 0; const out = [];
  for (let n = 1; n <= 1000; n++) { S += g(); T += g(); out.push([n, (S * T - T * T / 2) / n]); }
  const fac = Math.pow(10, 1 / PER); let m = 1000;
  while (m < Math.pow(10, DEC)) {
    const m2 = Math.max(m + 1, Math.round(m * fac)), d = m2 - m;
    S += Math.sqrt(d) * g(); T += Math.sqrt(d) * g(); m = m2; out.push([m, (S * T - T * T / 2) / m]);
  }
  return out;
}
const PATH = samplePath();
// Chart geometry.
const X0 = 70, X1 = 790, Y0 = 350, Y1 = 112, QLO = -2.5, QHI = 7;
const X = n => X0 + Math.log10(n) / DEC * (X1 - X0);
const Y = q => Y0 - (Math.max(QLO, Math.min(QHI, q)) - QLO) / (QHI - QLO) * (Y0 - Y1);
function crossings() {
  const eps = []; let inside = false;
  for (const [n, q] of PATH) { if (q >= C && !inside) eps.push([n, q]); inside = q >= C; }
  return eps;
}
function chart() {
  let s = '';
  for (let k = 0; k <= DEC; k += 2) s += `<path d="M${f(X(10 ** k))} ${Y0} v6" stroke="${dim}" stroke-width="1.2"/>` + text(X(10 ** k), Y0 + 22, k === 0 ? '1' : `10<tspan dy="-7" font-size="10">${k}</tspan>`, 13, dim, 'middle');
  s += text(X1, Y0 + 36, 'pairs of observations n (log scale)', 13, dim, 'end', 'normal', SERIF);
  s += `<path d="M${X0} ${f(Y(0))} H${X1}" stroke="${muted}" stroke-opacity=".25" stroke-width="1"/>`;
  // Repaired threshold (Theorem 5, normal mixture, alpha = 0.2).
  const rp = []; for (let k = 0; k <= DEC * 50; k++) { const n = 10 ** (k / 50); rp.push(`${f(X(n))} ${f(Y(repaired(n)))}`); }
  s += `<path d="M${rp.join(' L')}" stroke="${fixC}" stroke-width="3" fill="none"/>`;
  s += text(X(10 ** 5.6), Y(repaired(10 ** 5.6)) - 14, 'repaired threshold, rising slowly: never crossed here', 14, fixC, 'end', 'bold');
  // Fixed threshold log(1/eps).
  s += `<path d="M${X0} ${f(Y(C))} H${X1}" stroke="${flatC}" stroke-width="2.6" stroke-dasharray="9 6"/>`;
  s += text(X1, Y(C) - 10, 'fixed threshold log 5 (80% level): crossed again and again', 14, flatC, 'end', 'bold');
  // The sample path, clipped below at QLO.
  const pp = PATH.map(([n, q]) => `${f(X(n))} ${f(Y(q))}`);
  s += `<path d="M${pp.join(' L')}" stroke="${pathC}" stroke-width="1.5" stroke-linejoin="round" fill="none" stroke-opacity=".95"/>`;
  for (const [n, q] of crossings()) s += `<circle cx="${f(X(n))}" cy="${f(Y(q))}" r="5.5" fill="${hitC}" stroke="#1b1b1b" stroke-width="1"/>`;
  s += text(X0 - 4, Y0 + 36, 'Q<tspan dy="5" font-size="11">n</tspan><tspan dy="-5"> = log split likelihood ratio at the truth (one exact simulated path)</tspan>', 13, pathC, 'start');
  return s;
}
function severity() {
  const x = 845; let s = text(x, 128, 'How slow is the damage?', 19, ink, 'start', 'normal', SERIF);
  s += text(x, 152, 'Error first exceeds the stated level', 13, dim) + text(x, 169, 'when the last look is this much later than the first:', 13, dim);
  const rows = [['80%', 'about 100×'], ['95%', 'about 10<tspan dy="-7" font-size="11">4</tspan><tspan dy="7">×</tspan>'], ['99%', 'about 10<tspan dy="-7" font-size="11">9</tspan><tspan dy="7">×</tspan>']];
  rows.forEach(([lvl, h], i) => { const y = 212 + i * 44; s += text(x, y, lvl, 22, flatC, 'start', 'bold') + text(x + 74, y, h, 22, ink, 'start', 'bold'); });
  s += text(x, 352, 'Long-run guarantee: zero in any model.', 14, hitC, 'start', 'bold');
  s += text(x, 374, 'Gaussian continuum limit; 99% extrapolated.', 12, dim, 'start', 'normal', SERIF);
  return s;
}
const draw = () =>
  text(40, 52, 'Keep checking a split likelihood-ratio interval, and it will exclude the truth', 26, ink, 'start', 'normal', SERIF) +
  text(40, 80, 'Red dots: times this path rises above the fixed threshold, so the interval there misses the true value', 15, muted) +
  chart() + `<path d="M818 112 L 818 380" stroke="${muted}" stroke-opacity=".22" stroke-width="1.2"/>` + severity();
const description = 'Banner for a paper showing that a universal-inference split likelihood-ratio interval, recomputed after every new pair of observations, is not a confidence sequence. A chart plots one exact simulated path of the log split likelihood ratio at the true parameter, Q_n = (S_n T_n − T_n²/2)/n, against the number of observation pairs n on a logarithmic axis from 1 to 100 million. A dashed orange horizontal line marks the fixed threshold log 5 used at the 80% level; red dots mark the five separate times the blue path rises above it, near n = 25 to 40 and again near one million, so the recomputed interval excludes the true value again and again. A green curve, the repaired threshold of Theorem 5 with a normal-mixture boundary, rises slowly with n and the path stays under it throughout. A side panel says how slow the damage is: the error first exceeds the stated level when the last look is about 100 times later than the first at 80%, about 10 to the 4 times at 95% and about 10 to the 9 times at 99% (Gaussian continuum limit, the last extrapolated), and that the long-run guarantee is zero in any model. The path uses a fixed seed; seeds 1 and 2 do not cross before 100 million and paths vary widely.';
function frame(inner, background) {
  return bannerSvg({ inner, description, background, glow: { color: flatC, cx: '0.35', cy: '0.55', r: '0.4', opacity: '0.05' } });
}
const thumbSpec = {
  kicker: ['RESEARCH RELEASE · NOVEMBER 2026', 'STATISTICS'],
  head: ['Valid once,', '<em>wrong if you keep looking</em>'], headSize: 62,
  sub: 'Recomputed after every new observation, the universal-inference split likelihood-ratio interval has a long-run guarantee of zero, not 95%. The damage is slow, and a rising threshold repairs it.',
  tag: 'UNREFEREED CANDIDATE',
  hero: '<div class="eq-label">long-run guarantee</div><div class="hero-title">0, not 1 − ε</div><div class="note">95% error first exceeds 5%<br>after about 10⁴× the first look<br>rate constant (√5 − 1)/2</div><div class="eq-foot">written proofs · seeded checks</div>'
};
module.exports = { draw, description, thumbSpec, samplePath, repaired };
if (require.main === module) (async () => {
  const fs = require('fs'), pth = require('path'), os = require('os'), vm = require('vm');
  const ROOT = pth.join(__dirname, '..');
  // Guards: Theorem 1 constants and the drawn path's stated properties.
  if (Math.abs(2 * L1 - 0.6180339887) > 1e-9 || Math.abs(C - 1.6094379124) > 1e-9) throw new Error('constant mismatch');
  const hits = crossings();
  if (hits.length !== 5 || PATH.some(([n, q]) => q >= repaired(n))) throw new Error('path no longer matches the description');
  if (samplePath(1).some(([, q]) => q >= C) || samplePath(2).some(([, q]) => q >= C)) throw new Error('seed disclosure no longer true');
  const reg = JSON.parse(fs.readFileSync(pth.join(ROOT, 'data/BANNER_PALETTES.json'), 'utf8'));
  const { palettes } = require('./banner-palettes');
  const bsaved = reg.assignments.find(r => r.slug === SLUG); if (!bsaved) throw new Error('no saved banner palette'); const bname = bsaved.palette;
  const tp = require('./thumbnail-palettes');
  const tsaved = tp.load().assignments.find(r => r.slug === SLUG); if (!tsaved) throw new Error('no saved thumbnail palette');
  const tname = tsaved.editorialPalette || tsaved.palette;
  const svg = frame(draw(), { name: bname, colors: palettes[bname] });
  fs.writeFileSync(pth.join(ROOT, 'assets/art', SLUG + '.svg'), svg);
  console.log('art:', SLUG, 'banner palette', bname, '| thumbnail palette', tname, '| crossings at n =', hits.map(h => h[0]).join(', '));
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
