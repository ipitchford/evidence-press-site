'use strict';
const { bannerSvg, escapeText } = require('./svg-xml');
// Which burst sizes guarantee a noise trade-off? Banner, OG card and thumbnail.
// Source: paper of 31 Oct 2026 (DOI 10.5281/zenodo.23840454).
//  - Left: the two-species loop of Figure 1 (Y activates X, X represses Y; bursts K1, K2).
//  - Right: the second-order Fano response coefficient Q_p(h) of Lemma 1 / equation (9),
//    F_i - B = eps^2 Q_p(h) + O(eps^3), for the same feedback h = (0, 1/8, 3/16, 3/8, 1/2, 1/2, ...)
//    of Section 6 and two burst laws with the same mean 2 and variance 2:
//    geometric P(K=k) = 2^-k (Q > 0: both species above baseline, Theorem 1 geometric direction)
//    and P(K=1) = 2/3, P(K=4) = 1/3 (Q = -19/11520 exactly: both below baseline).
//    Q is evaluated here from equation (9) in floating point (geometric tail truncated at 400 terms).
// Usage: node tools/burst-classification-art.js [--render OUTDIR_FOR_INSPECTION] [--no-mirror]
const SLUG = 'geometric-burst-classification';

// ---------- the coefficient of equation (9) ----------
const hseq = m => (m <= 0 ? 0 : [0, 1 / 8, 3 / 16, 3 / 8][m] ?? 1 / 2);
function Qp(p, M) { // p(k) for k = 1..M
  let kap = 0; for (let k = 1; k <= M; k++) kap += k * p(k);
  const T = m => { let s = 0; for (let k = m; k <= M; k++) s += p(k); return s; };
  const V = n => { let s = 0; for (let k = n; k <= M; k++) s += p(k) / (k + 1); return s; };
  let A = 0, Th = 0, Vh = 0, H = 0;
  for (let m = 1; m <= M; m++) { H += hseq(m); A += T(m) * hseq(m) * H / (m * (m + 1)); Th += T(m) * hseq(m); Vh += V(m) * hseq(m); }
  return { Q: kap * A - Th * Vh, kap };
}
const geo = Qp(k => 2 ** -k, 400), ng = Qp(k => (k === 1 ? 2 / 3 : k === 4 ? 1 / 3 : 0), 4);
const Qgeo = geo.Q, Qng = ng.Q;
const must = (c, m) => { if (!c) throw new Error('check failed: ' + m); };
must(Math.abs(geo.kap - 2) < 1e-12 && Math.abs(ng.kap - 2) < 1e-12, 'both means 2');
must(Math.abs(Qng + 19 / 11520) < 1e-15, 'Q = -19/11520 for the same-moments law');
must(Qgeo > 7e-4 && Qgeo < 8e-4, 'geometric coefficient positive (about 7.52e-4)');

// ---------- drawing ----------
const ink = '#f3eef6', muted = '#d9cfe0', dim = '#b6a9c2';
const xC = '#ffd27a', yC = '#9fd8ff', aboveC = '#ffb3a1', belowC = '#9fe8b8';
const SANS = 'Arial,Helvetica,sans-serif', SERIF = 'Georgia,serif';
const text = (x, y, s, size = 18, color = ink, anchor = 'start', weight = 'normal', family = SANS) =>
  `<text x="${x}" y="${y}" fill="${color}" font-family="${family}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}">${escapeText(s)}</text>`;
const f = v => (+v).toFixed(1);

function loopPanel() {
  let s = '<defs><marker id="gbc-act" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="' + belowC + '"/></marker></defs>';
  const X = [118, 238], Y = [338, 238], R = 46;
  s += text(40, 116, 'The loop', 15, ink, 'start', 'bold');
  s += text(40, 136, 'two species made in random bursts', 13, muted);
  // activation Y -> X (upper arc), repression X -| Y (lower arc)
  s += `<path d="M${Y[0] - 30} ${Y[1] - 36} C 290 160, 166 160, ${X[0] + 34} ${X[1] - 40}" fill="none" stroke="${belowC}" stroke-width="3" marker-end="url(#gbc-act)"/>`;
  s += text(228, 154, 'Y activates X', 13.5, belowC, 'middle', 'bold');
  s += `<path d="M${X[0] + 32} ${X[1] + 36} C 166 316, 290 316, ${Y[0] - 34} ${Y[1] + 40}" fill="none" stroke="${aboveC}" stroke-width="3"/>`;
  s += `<path d="M${Y[0] - 43} ${Y[1] + 30} L${Y[0] - 27} ${Y[1] + 50}" stroke="${aboveC}" stroke-width="4" stroke-linecap="round"/>`;
  s += text(228, 316, 'X represses Y', 13.5, aboveC, 'middle', 'bold');
  for (const [c, lab, col] of [[X, 'X', xC], [Y, 'Y', yC]]) {
    s += `<circle cx="${c[0]}" cy="${c[1]}" r="${R}" fill="#1b1224" fill-opacity=".55" stroke="${col}" stroke-width="2.6"/>`;
    s += text(c[0], c[1] - 2, lab, 26, col, 'middle', 'bold', SERIF);
    s += text(c[0], c[1] + 20, 'bursts K', 12, muted, 'middle');
  }
  s += text(40, 362, 'noise = Fano factor (variance ÷ mean)', 13, dim);
  s += text(40, 380, 'baseline B = constant-rate production', 13, dim);
  return s;
}

function barPanel() {
  const x0 = 470, x1 = 1160, Y0 = 240, scale = 70 / 1.7e-3; // px per unit of Q
  let s = '';
  s += `<path d="M450 112 V372" stroke="${muted}" stroke-opacity=".18"/>`;
  s += text(x0, 116, 'Feedback’s effect on each species’ noise, F − B ≈ ε²·Q', 15, ink, 'start', 'bold');
  s += text(x0, 136, 'same weak feedback, same burst mean (2) and variance (2), two burst-size laws', 13, muted);
  s += `<path d="M${x0} ${Y0} H${x1}" stroke="${muted}" stroke-opacity=".8" stroke-width="1.6"/>`;
  s += text(x1, Y0 - 6, 'baseline B', 12.5, muted, 'end', 'bold');
  const groups = [
    { cx: 640, Q: Qgeo, title: 'Geometric bursts', sub: 'P(K = k) = 2⁻ᵏ', verdict: 'both noisier: trade-off holds', vc: aboveC, lab: '+7.5 × 10⁻⁴' },
    { cx: 960, Q: Qng, title: 'Bursts of 1 or 4', sub: 'probabilities 2/3 and 1/3', verdict: 'both quieter than baseline', vc: belowC, lab: '−19/11520' }
  ];
  for (const g of groups) {
    const hgt = -g.Q * scale; // negative Q -> bar goes down (positive height in SVG)
    for (const [dx, col, nm] of [[-40, xC, 'X'], [40, yC, 'Y']]) {
      const top = Math.min(Y0, Y0 + hgt), h = Math.abs(hgt);
      s += `<rect x="${f(g.cx + dx - 26)}" y="${f(top)}" width="52" height="${f(h)}" rx="3" fill="${col}" fill-opacity=".85"/>`;
      s += text(f(g.cx + dx), f(g.Q > 0 ? top - 8 : top + h + 18), nm, 14, col, 'middle', 'bold');
    }
    const ylab = g.Q > 0 ? Y0 + 26 : Y0 - 14;
    s += text(g.cx, ylab, 'Q = ' + g.lab, 13, ink, 'middle', 'bold');
    s += text(g.cx, g.Q > 0 ? 312 : 168, g.title, 15, ink, 'middle', 'bold');
    s += text(g.cx, g.Q > 0 ? 330 : 186, g.sub, 12.5, dim, 'middle');
    s += text(g.cx, g.Q > 0 ? 352 : 204, g.verdict, 13.5, g.vc, 'middle', 'bold');
  }
  s += text(x1, 384, 'Theorem: every non-geometric law with finite variance can do this; effects ~10⁻⁶, below 0.1 molecules', 12, dim, 'end');
  return s;
}

const draw = () => text(40, 52, 'Only geometric burst sizes force a noise trade-off', 26, ink, 'start', 'normal', SERIF) +
  text(40, 80, 'With any other burst-size law, one activation and one repression can make both species quieter than baseline', 14.5, muted) +
  loopPanel() + barPanel();

const description = 'Banner for a paper on noise in gene expression with bursty production. Left: the two-species loop used in the paper; species Y activates the production of species X, and X represses the production of Y; each production event releases a random burst of K molecules. Noise is the Fano factor, variance divided by mean, compared with a baseline B for constant-rate production at the same mean. Right: for the same weak feedback and two burst-size laws with the same mean 2 and variance 2, bars show the second-order coefficient Q in F minus B approximately equal to epsilon squared times Q, for species X and Y. With geometric bursts, P(K = k) = 2 to the minus k, both bars point up (Q about +7.5 times 10 to the minus 4): both species are noisier than baseline, so the trade-off holds. With bursts of 1 or 4 molecules with probabilities 2/3 and 1/3, both bars point down (Q = −19/11520 exactly): both species are quieter than baseline. The paper proves that every non-geometric burst law with finite variance allows this, and that only geometric laws force the trade-off; the effects are of order one part in a million and occur below 0.1 molecules on average. Bar heights are computed from the paper\'s exact formula.';

function frame(inner, background) {
  return bannerSvg({ inner, description, background, glow: { color: belowC, cx: '0.7', cy: '0.6', r: '0.5', opacity: '0.05' } });
}

const thumbSpec = {
  kicker: ['RESEARCH RELEASE · 31 OCTOBER 2026', 'STOCHASTIC GENE EXPRESSION · OPEN QUESTION ANSWERED'],
  head: ['Only geometric bursts', '<em>force a trade-off.</em>'], headSize: 66,
  sub: 'With any other burst-size law, two cross-regulating species can both be made quieter than baseline, by about one part in a million.',
  tag: 'UNREFEREED CANDIDATE',
  hero: '<div class="eq-label">both species below baseline noise?</div><div class="hero-title">geometric: never</div><div class="note">any other burst law: yes,<br>in a two-species loop<br>pairs: yes if either law is not geometric</div><div class="eq-foot">written proofs · exact rational checks</div>'
};

module.exports = { draw, description, thumbSpec };
if (require.main === module) (async () => {
  const fs = require('fs'), pth = require('path'), os = require('os'), vm = require('vm');
  const ROOT = pth.join(__dirname, '..');
  console.log('check: Q geometric =', Qgeo.toExponential(4), '| Q same-moments =', Qng.toExponential(4), '(exact -19/11520)');
  const { resolve } = require('./banner-palettes');
  const bg = resolve(SLUG); if (!bg) throw new Error('no banner palette');
  const tname = require('./thumbnail-palettes').resolve(SLUG, true);
  const svg = frame(draw(), bg);
  fs.writeFileSync(pth.join(ROOT, 'assets/art', SLUG + '.svg'), svg);
  console.log('art:', SLUG, 'banner palette', bg.name, '| thumbnail palette', tname);
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
