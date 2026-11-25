'use strict';
const { bannerSvg } = require('./svg-xml');
// How a reversible transition amplifies apparent entropy production (reversible-transition-apparent-entropy-production):
// banner, OG, thumbnail.
// "This image helps the reader understand" that in the three-state example (Theorem 1, Proposition 2) the true entropy
// production stays fixed at 4 pi/5 while the phase-blind waiting-time estimate of Harunari, Fiore and Barato grows in
// proportion to the speed R of one reversible transition. The banner plots, on logarithmic axes, the proved lower bound
// R[17/600 - 2C/R]^2 of Eq. (4) (C = 18 pi/5 + 32 pi/17), the certified values of Proposition 2 at R = 750, 1000, 1e4
// and 1e5, and the flat line sigma = 4 pi/5.
// checkHook recomputes sigma, C and the analytic bound, checks the bound against the exact-rational value printed by
// verify_certificate.py, and checks the plotted certified values, the ratio 145 and the factor 31 against
// results/results.txt of the release (when EP_RTAEP_PACKAGE points at the release package); it refuses to draw on any
// mismatch.
// Reference: txgraffiti-order48-successor (one exact object balanced with immediately readable values).
// Usage: node tools/reversible-reporter-art.js [--render OUTDIR_FOR_INSPECTION] [--no-mirror]
const SLUG = 'reversible-transition-apparent-entropy-production';
const ink = '#f6f2ea', muted = '#e2e7ea', dim = '#c3ccd2', hot = '#ffc36b', rose = '#f2a7b5', mint = '#a8e6c1', sky = '#9fd3f2';
const SANS = 'Arial,Helvetica,sans-serif', SERIF = 'Georgia,serif';
const text = (x, y, s, size = 18, color = ink, anchor = 'start', weight = 'normal', family = SANS, style = 'normal') => {
  if (/<|&(?!(lt|gt|amp|minus|#\d+);)/.test(s.replace(/<\/?tspan[^>]*>/g, ''))) throw new Error('unescaped < or & in SVG text: ' + s);
  return `<text class="og-hide" x="${x}" y="${y}" fill="${color}" font-family="${family}" font-size="${size}" font-weight="${weight}" font-style="${style}" text-anchor="${anchor}">${s}</text>`;
};
const SIGMA = 4 * Math.PI / 5, C = 18 * Math.PI / 5 + 32 * Math.PI / 17;
const bound = R => R * Math.max(0, 17 / 600 - 2 * C / R) ** 2;
// Certified lower bounds of Proposition 2 (one visible edge), as printed by the release scripts.
const CERT = [[750, 2.746942], [1000, 3.654098], [1e4, 21.62345], [1e5, 366.44498]];
function checkHook() {
  const fs = require('fs'), pth = require('path');
  if (Math.abs(SIGMA - 2.51327412287) > 1e-10) throw new Error('sigma');
  const b5 = bound(1e5);
  if (!(b5 > 78.3368911365 && b5 < 78.5)) throw new Error('analytic bound at R = 1e5 differs from the certificate: ' + b5);
  if (!(bound(5400) > 2.60 && bound(1216) < 1e-3)) throw new Error('threshold values');
  if (!(CERT[3][1] / (88 / 35) > 145 && b5 / (88 / 35) > 31)) throw new Error('ratios');
  const pkg = process.env.EP_RTAEP_PACKAGE;
  if (pkg) {
    const r = fs.readFileSync(pth.join(pkg, 'results/results.txt'), 'utf8');
    const need = ['one observed edge, estimator lower bound: 1559993506009/19913906250 = 78.3368911365',
      'one observed edge, ratio lower bound: 1559993506009/50069250000 = 31.1567180657',
      'common lower bound on estimator, evaluated within [2162345/100000, 2162346/100000]',
      'common lower bound on estimator, evaluated within [36644498/100000, 36644499/100000]',
      'common lower bound on ratio, evaluated within [14574516/100000, 14574517/100000]',
      'R = 750 complete observation = False certified lower bound interval [2746942/1000000, 2746943/1000000]',
      'R = 1000 complete observation = False certified lower bound interval [3654098/1000000, 3654099/1000000]',
      'Entropy production (integrated flux): 2.51327412287'];
    for (const s of need) if (!r.includes(s)) throw new Error('results.txt lacks: ' + s);
  }
  return { checkedAgainstPackage: Boolean(pkg), sigma: SIGMA, boundAt1e5: b5, cert: CERT };
}
// Chart geometry: log10 R in [2.7, 5.3] -> x; log10 y in [0, 3] -> y.
const X0 = 600, X1 = 1140, Y0 = 330, Y1 = 110;
const px = R => X0 + (Math.log10(R) - 2.7) / (5.3 - 2.7) * (X1 - X0);
const py = v => Y0 - Math.log10(v) / 3 * (Y0 - Y1);
const draw = () => {
  const c = checkHook();
  let s = '';
  s += text(40, 50, 'Zero net current, fixed dissipation,', 27, ink, 'start', 'normal', SERIF);
  s += text(40, 82, 'yet the estimate grows without limit', 27, hot, 'start', 'normal', SERIF);
  s += text(40, 126, 'Three states; every current averages to zero.', 15, muted);
  s += text(40, 150, 'One fast transition runs equally both ways, so it', 15, muted);
  s += text(40, 170, 'makes no entropy, but its speed tracks the drive.', 15, muted);
  s += text(40, 202, 'Waiting times, drive forwards versus reversed,', 15, muted);
  s += text(40, 222, 'phase not recorded: the estimate counts that', 15, muted);
  s += text(40, 242, 'phase signal as dissipation.', 15, muted);
  s += text(40, 284, 'Above 145× the true value', 22, hot, 'start', 'bold', SERIF);
  s += text(40, 308, '(certified bound at R = 100,000)', 13, dim);
  s += text(40, 340, 'The corrected estimate (minus X) stays valid.', 14, mint);
  // axes
  s += `<line x1="${X0}" y1="${Y0}" x2="${X1}" y2="${Y0}" stroke="${dim}" stroke-width="1.2"/><line x1="${X0}" y1="${Y0}" x2="${X0}" y2="${Y1}" stroke="${dim}" stroke-width="1.2"/>`;
  for (const [R, lab] of [[1e3, '1,000'], [1e4, '10,000'], [1e5, '100,000']]) {
    s += `<line x1="${px(R).toFixed(1)}" y1="${Y0}" x2="${px(R).toFixed(1)}" y2="${Y0 + 5}" stroke="${dim}" stroke-width="1.2"/>`;
    s += text(px(R).toFixed(1), Y0 + 21, lab, 12.5, dim, 'middle');
  }
  for (const [v, lab] of [[1, '1'], [10, '10'], [100, '100'], [1000, '1,000']]) {
    s += `<line x1="${X0 - 5}" y1="${py(v).toFixed(1)}" x2="${X0}" y2="${py(v).toFixed(1)}" stroke="${dim}" stroke-width="1.2"/>`;
    s += text(X0 - 9, (py(v) + 4).toFixed(1), lab, 12.5, dim, 'end');
  }
  s += text((X0 + X1) / 2, Y0 + 42, 'speed R of the reversible transition (per drive period, log scale)', 12.5, dim, 'middle');
  s += text(X0 - 8, Y1 - 14, 'estimate (nats per period, log scale)', 12.5, dim, 'start');
  // sigma line
  s += `<line x1="${X0}" y1="${py(c.sigma).toFixed(1)}" x2="${X1}" y2="${py(c.sigma).toFixed(1)}" stroke="${mint}" stroke-width="2.4"/>`;
  s += text(X1, (py(c.sigma) + 20).toFixed(1), 'true entropy production 4π/5 ≈ 2.5', 13.5, mint, 'end', 'bold');
  // analytic bound curve where it is at least 1
  const pts = [];
  for (let k = 0; k <= 160; k++) { const R = 10 ** (3.5 + k / 160 * 1.5); const v = bound(R); if (v >= 1) pts.push(`${px(R).toFixed(1)},${py(v).toFixed(1)}`); }
  s += `<polyline points="${pts.join(' ')}" fill="none" stroke="${sky}" stroke-width="2.6"/>`;
  // certified points
  for (const [R, v] of c.cert) s += `<circle cx="${px(R).toFixed(1)}" cy="${py(v).toFixed(1)}" r="5.5" fill="${hot}" stroke="#1b1b1b" stroke-width="1"/>`;
  s += text((px(1e5) - 12).toFixed(1), (py(366.44498) - 2).toFixed(1), '366', 13, hot, 'end', 'bold');
  // legend (upper left of the chart)
  s += `<line x1="${X0 + 22}" y1="136" x2="${X0 + 50}" y2="136" stroke="${sky}" stroke-width="2.6"/>`;
  s += text(X0 + 58, 140.5, 'proved lower bound, Theorem 1 (> 31× at R = 100,000)', 12.5, sky);
  s += `<circle cx="${X0 + 36}" cy="158" r="5" fill="${hot}" stroke="#1b1b1b" stroke-width="1"/>`;
  s += text(X0 + 58, 162.5, 'certified lower bounds, Proposition 2', 12.5, hot);
  s += text(40, 388, 'Model calculation: under 0.008 nats of overshoot per event, and a reporter hundreds of times faster than the drive. Unrefereed candidate.', 12, dim);
  return s;
};
const description = 'Banner for a paper showing that a phase-blind waiting-time estimate of entropy production can exceed the true value without bound. Title: zero net current, fixed dissipation, yet the estimate grows without limit. Left text: three states; every current averages to zero. One fast transition runs equally both ways, so it makes no entropy, but its speed tracks the drive. Waiting times are compared with the drive run forwards and reversed, with the phase not recorded, and the estimate counts that phase signal as dissipation. Above 145 times the true value (certified bound at R = 100,000). The corrected estimate (minus X) stays valid. Right: a chart on logarithmic axes of the estimate in nats per period against the speed R of the reversible transition, from about 500 to 200,000. A flat line marks the true entropy production 4π/5, about 2.5. A rising curve shows the proved bound of Theorem 1, more than 31 times the true value at R = 100,000, and four dots show certified values of Proposition 2 at R = 750, 1,000, 10,000 and 100,000, the last at 366. Footer: model calculation; under 0.008 nats of overshoot per event, and a reporter hundreds of times faster than the drive; unrefereed candidate.';
function frame(inner, background) {
  const c = checkHook();
  if (!(c.cert[3][1] / c.sigma > 145) || !description.includes('Above 145 times')) throw new Error('stated values differ from the computation');
  return bannerSvg({ inner, description, background, glow: { color: '#ffc36b', cx: '0.8', cy: '0.45', r: '0.35', opacity: '0.07' } });
}
const thumbSpec = {
  kicker: ['RESEARCH RELEASE · NOVEMBER 2026', 'STOCHASTIC THERMODYNAMICS'],
  head: ['Waiting-time estimates', '<em>overshoot without bound.</em>'], headSize: 60,
  sub: 'A reversible transition fools the uncorrected entropy estimate of Harunari, Fiore and Barato.',
  tag: 'UNREFEREED CANDIDATE',
  hero: '<div class="eq-label">zero net current, fixed dissipation</div><div class="hero-title">&gt; 145×</div><div class="note">the true entropy production<br>(certified bound)</div><div class="eq-foot">the corrected estimate stays valid</div>'
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
