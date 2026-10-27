'use strict';
const { bannerSvg, escapeText } = require('./svg-xml');
// Arbitrarily many population maxima under uniform global dispersal: banner, OG card and thumbnail.
// Sources (paper of 27 Oct 2026, DOI 10.5281/zenodo.23687852):
//  - Left panel: Theorem 2, the exact three-level resource m = 1/20, 25/12, 329/10 on fractions
//    2405/3504, 5/16, 1/876. M(d) is the positive root of the closure M = sum p_i Phi(m_i, d, M),
//    Phi(z,d,M) = ((z-d) + sqrt((z-d)^2 + 4dM))/2 (Section 3). The minimum M(3) = 1 is exact;
//    the maxima (d ~ 1.989, M ~ 1.000756 and d ~ 15.08, M ~ 1.0530) are numerical, as in Figure 1.
//  - Right panel: Figure 2, the first-variation kernel sum G_3(d) = sum r^-2 g_r(d) with background
//    a = 1 and levels r = 10^2, 10^5, 10^8, g_r(d) = d (t_r - a)^2 / (a t_r),
//    t_r = (r - d + sqrt((r-d)^2 + 4ad))/2 (eq. 18). Each hump peaks near d ~ r/2 (Lemma 11).
//  The curves are computed here from those formulas; they illustrate, and are not evidence.
// Usage: node tools/dispersal-maxima-art.js [--render OUTDIR_FOR_INSPECTION] [--no-mirror]
const SLUG = 'multiple-dispersal-maxima';

// ---------- the two curves ----------
const P = [2405 / 3504, 5 / 16, 1 / 876], Mv = [1 / 20, 25 / 12, 329 / 10];
const phi = (z, d, M) => { const u = z - d, h = Math.sqrt(u * u + 4 * d * M); return u >= 0 ? (u + h) / 2 : 2 * d * M / (h - u); };
function popM(d) {
  let lo = 1e-9, hi = 40;
  for (let k = 0; k < 200; k++) { const mid = (lo + hi) / 2; const F = P.reduce((s, p, i) => s + p * phi(Mv[i], d, mid), 0) - mid; if (F > 0) lo = mid; else hi = mid; }
  return (lo + hi) / 2;
}
const must = (c, m) => { if (!c) throw new Error('check failed: ' + m); };
must(Math.abs(popM(3) - 1) < 1e-12, 'M(3) = 1');
must(popM(2) > 1 && popM(15) > popM(3) && popM(0.05) < 1 && popM(300) < 1, 'two maxima around d = 3');
const gKernel = (r, d, a = 1) => { const u = r - d, h = Math.sqrt(u * u + 4 * a * d); const t = u >= 0 ? (u + h) / 2 : 2 * a * d / (h - u); return d * (t - a) ** 2 / (a * t); };
const G = d => [1e2, 1e5, 1e8].reduce((s, r) => s + gKernel(r, d) / (r * r), 0);
must(Math.abs(G(50) - 0.25) < 0.02 && Math.abs(G(5e4) - 0.25) < 0.02 && Math.abs(G(5e7) - 0.25) < 0.02, 'humps near r/2 of height ~1/4');

// ---------- drawing ----------
const ink = '#f6ece9', muted = '#e3cfca', dim = '#c8aaa3';
const curveC = '#ffc98a', minC = '#9fe3f0', humpC = ['#ffb3a1', '#ffd38a', '#bde6a4'], sumC = '#fff4e8';
const SANS = 'Arial,Helvetica,sans-serif', SERIF = 'Georgia,serif';
const text = (x, y, s, size = 18, color = ink, anchor = 'start', weight = 'normal', family = SANS) =>
  `<text x="${x}" y="${y}" fill="${color}" font-family="${family}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}">${escapeText(s)}</text>`;
const f = v => (+v).toFixed(1);
const path = pts => 'M' + pts.map(([x, y]) => `${f(x)} ${f(y)}`).join(' L');

function leftPanel() {
  // log d from 0.05 to 400; M from 0.70 to 1.07
  const X0 = 70, X1 = 560, Y0 = 350, Y1 = 132, l0 = Math.log10(0.05), l1 = Math.log10(400), m0 = 0.70, m1 = 1.07;
  const X = d => X0 + (Math.log10(d) - l0) / (l1 - l0) * (X1 - X0), Y = M => Y0 - (M - m0) / (m1 - m0) * (Y0 - Y1);
  const pts = []; for (let i = 0; i <= 400; i++) { const d = 10 ** (l0 + (l1 - l0) * i / 400); pts.push([X(d), Y(popM(d))]); }
  let s = '';
  s += `<path d="M${X0} ${Y0} H${X1}" stroke="${muted}" stroke-opacity=".45" stroke-width="1.5"/>`;
  s += `<path d="M${X0} ${Y0} V${Y1 - 8}" stroke="${muted}" stroke-opacity=".45" stroke-width="1.5"/>`;
  for (const [d, lab] of [[0.1, '0.1'], [1, '1'], [3, '3'], [10, '10'], [100, '100']]) s += `<path d="M${f(X(d))} ${Y0} V${Y0 + 5}" stroke="${muted}" stroke-opacity=".6"/>` + text(f(X(d)), Y0 + 21, lab, 13, dim, 'middle');
  s += `<path d="M${X0} ${f(Y(1))} H${X1}" stroke="${dim}" stroke-opacity=".5" stroke-dasharray="3 5"/>` + text(X0 - 6, f(Y(1) + 4), '1', 13, dim, 'end');
  s += `<path d="M${X0} ${f(Y(347 / 480))} H${X1}" stroke="${dim}" stroke-opacity=".35" stroke-dasharray="2 6"/>`;
  s += text(X0 + 10, f(Y(347 / 480) - 7), 'mean resource 347/480', 12.5, dim);
  s += `<path d="${path(pts)}" fill="none" stroke="${curveC}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/>`;
  const a = [1.989, popM(1.989)], c = [15.08, popM(15.08)];
  s += `<circle cx="${f(X(3))}" cy="${f(Y(1))}" r="6.5" fill="${minC}" stroke="#301720" stroke-width="2"/>`;
  for (const [d, M] of [a, c]) s += `<circle cx="${f(X(d))}" cy="${f(Y(M))}" r="6" fill="${curveC}" stroke="#301720" stroke-width="2"/>`;
  s += text(f(X(3) + 4), f(Y(1) + 24), 'exact minimum: M(3) = 1', 13.5, minC, 'middle', 'bold');
  s += text(f(X(1.989) - 10), f(Y(a[1]) - 14), 'peak 1', 13.5, curveC, 'end', 'bold');
  s += text(f(X(15.08) + 10), f(Y(c[1]) - 10), 'peak 2', 13.5, curveC, 'start', 'bold');
  s += text(X0, 118, 'Total population M(d), exact three-level habitat (Theorem 2)', 15, ink, 'start', 'bold');
  s += text(f((X0 + X1) / 2), Y0 + 42, 'dispersal rate d (log scale)', 13.5, dim, 'middle');
  s += text(X0, 138, 'levels 1/20, 25/12, 329/10; richest on 1/876 of the area', 12, dim);
  return s;
}

function rightPanel() {
  // log d from 1 to 1e9; G from 0 to 0.3
  const X0 = 650, X1 = 1150, Y0 = 350, Y1 = 150, l0 = 0, l1 = 9;
  const X = d => X0 + (Math.log10(d) - l0) / (l1 - l0) * (X1 - X0), Y = g => Y0 - g / 0.3 * (Y0 - Y1);
  let s = '';
  s += `<path d="M${X0} ${Y0} H${X1}" stroke="${muted}" stroke-opacity=".45" stroke-width="1.5"/>`;
  const rs = [1e2, 1e5, 1e8], labs = ['10²', '10⁵', '10⁸'];
  rs.forEach((r, k) => {
    const pts = []; for (let i = 0; i <= 300; i++) { const d = 10 ** (l0 + (l1 - l0) * i / 300); pts.push([X(d), Y(gKernel(r, d) / (r * r))]); }
    s += `<path d="${path(pts)} L${f(X1)} ${Y0} L${X0} ${Y0} Z" fill="${humpC[k]}" fill-opacity=".22" stroke="none"/>`;
    s += `<path d="${path(pts)}" fill="none" stroke="${humpC[k]}" stroke-width="2.5"/>`;
    s += text(f(X(r / 2)), f(Y(0.25) - 12), `patch r = ${labs[k]}`, 13.5, humpC[k], 'middle', 'bold');
  });
  for (const [d, lab] of [[1e1, '10'], [1e4, '10⁴'], [1e7, '10⁷']]) s += `<path d="M${f(X(d))} ${Y0} V${Y0 + 5}" stroke="${muted}" stroke-opacity=".6"/>` + text(f(X(d)), Y0 + 21, lab, 13, dim, 'middle');
  s += text(X0, 118, 'Rare rich patches add separate bumps (Figure 2)', 15, ink, 'start', 'bold');
  s += text(X0, 138, 'first-order gain from each patch peaks near d ≈ r/2', 13, muted);
  s += text(f((X0 + X1) / 2), Y0 + 42, 'dispersal rate d (log scale): N patches give N peaks', 13.5, dim, 'middle');
  return s;
}

const draw = () => text(40, 52, 'Total population can peak again and again as dispersal changes', 27, ink, 'start', 'normal', SERIF) +
  text(40, 82, 'The peaks are real but tiny: the first peak above rises only about 0.08% over the dip at d = 3', 16, muted) +
  leftPanel() + rightPanel();

const description = 'Banner for a paper answering Bai and Li\'s question about the uniform global dispersal model. Left: the total equilibrium population M(d) of the paper\'s exact three-level habitat (resource 1/20, 25/12 and 329/10 on areas 2405/3504, 5/16 and 1/876), plotted against the dispersal rate d on a logarithmic axis. The curve starts and ends at the mean resource 347/480, rises to a first peak near d = 1.99 (M about 1.00076), dips to the exactly certified minimum M(3) = 1, rises to a second peak near d = 15.1 (M about 1.053) and falls again. Right: the mechanism behind the general theorem. With background resource 1 and rare patches of richness 100, 100000 and 100000000, each patch adds a separate first-order population bump that peaks near half its richness, so N patches give N peaks. The curves are computed from the paper\'s formulas; maxima are numerical and the effects are tiny, so the result is qualitative.';

function frame(inner, background) {
  return bannerSvg({ inner, description, background, glow: { color: curveC, cx: '0.3', cy: '0.6', r: '0.5', opacity: '0.06' } });
}

const thumbSpec = {
  kicker: ['RESEARCH RELEASE · 27 OCTOBER 2026', 'MATHEMATICAL ECOLOGY · OPEN QUESTION ANSWERED'],
  head: ['Many peaks,', '<em>all of them tiny.</em>'], headSize: 72,
  sub: 'Under uniform global dispersal, total population can have any number of peaks as the dispersal rate varies.',
  tag: 'UNREFEREED CANDIDATE',
  hero: '<div class="eq-label">exact three-level habitat</div><div class="hero-title">M(3) = 1</div><div class="note">a certified dip between two peaks<br>rare rich patches add one peak each<br>two habitat levels: always one peak</div><div class="eq-foot">written proofs · exact rational checks</div>'
};

module.exports = { draw, description, thumbSpec };
if (require.main === module) (async () => {
  const fs = require('fs'), pth = require('path'), os = require('os'), vm = require('vm');
  const ROOT = pth.join(__dirname, '..');
  console.log('check: M(3) =', popM(3).toFixed(12), '| M(1.989) =', popM(1.989).toFixed(6), '| M(15.08) =', popM(15.08).toFixed(5));
  const { palettes } = require('./banner-palettes');
  const reg = JSON.parse(fs.readFileSync(pth.join(ROOT, 'data/BANNER_PALETTES.json'), 'utf8'));
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
  {
    const p = await b.newPage({ viewport: { width: 1200, height: 400 } });
    await p.setContent(body(1200, 400, svg));
    const out = await p.evaluate(() => [...document.querySelectorAll('text')].map(t => { const r = t.getBBox(); return [t.textContent, r.x, r.y, r.x + r.width, r.y + r.height]; })
      .filter(([, x0, y0, x1, y1]) => x0 < 0 || y0 < 0 || x1 > 1200 || y1 > 400));
    await p.close();
    if (out.length) throw new Error('text outside viewBox: ' + JSON.stringify(out));
    console.log('all text boxes inside the 1200x400 viewBox');
  }
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
