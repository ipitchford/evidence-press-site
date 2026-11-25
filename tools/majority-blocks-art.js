'use strict';
const { bannerSvg } = require('./svg-xml');
// When a more cyclic majority tournament is more probable (majority-tournament-cyclic-reversal): banner, OG, thumbnail.
// "This image helps the reader understand" why Harrison-Trainor's linearity conjecture fails: under impartial culture
// with many voters, the probability of an ordered block outcome is set by the pairs inside blocks (each must be almost
// tied, about a factor of two each), while cyclic triples also sit inside blocks but grow like the cube of the block size.
// The banner draws the 14-candidate block patterns (7,7) and (1,1,1,9,1,1) as stacked boxes with their almost-tied pair
// and cyclic-triple counts and the Monte Carlo ratio (about 2.7), and the certified 78-candidate pair (39,39) against
// (7,7,49,5,5,5) with ratio above 100,000.
// checkHook recomputes internal pairs, outdegrees, linearity and cyclic triples (c = C(n,3) - sum C(d_v,2)) from the block
// sizes, checks the identity c = C(n,3) - lin/2 + C(n,2)/2, compares lin, cyclic triples and the ratio with
// results/small_reversals.json and the linearities and the 10^5 bound with results/certificate.txt of the release (when
// EP_MAJ_PACKAGE points at the release package), checks the printed rounded values, and refuses to draw on any mismatch.
// Reference: txgraffiti-order48-successor (one exact object balanced with immediately readable values).
// Usage: node tools/majority-blocks-art.js [--render OUTDIR_FOR_INSPECTION] [--no-mirror]
const SLUG = 'majority-tournament-cyclic-reversal';
const ink = '#f6f2ea', muted = '#e2e7ea', dim = '#c3ccd2', hot = '#ffc36b', rose = '#f2a7b5', mint = '#a8e6c1', sky = '#9fd3f2';
const SANS = 'Arial,Helvetica,sans-serif', SERIF = 'Georgia,serif';
const text = (x, y, s, size = 18, color = ink, anchor = 'start', weight = 'normal', family = SANS, style = 'normal') => {
  if (/<|&(?!(lt|gt|amp|minus|#\d+);)/.test(s.replace(/<\/?tspan[^>]*>/g, ''))) throw new Error('unescaped < or & in SVG text: ' + s);
  return `<text class="og-hide" x="${x}" y="${y}" fill="${color}" font-family="${family}" font-size="${size}" font-weight="${weight}" font-style="${style}" text-anchor="${anchor}">${s}</text>`;
};
const C2 = k => k * (k - 1) / 2, C3 = k => k * (k - 1) * (k - 2) / 6;
// Ordered regular block tournament, blocks listed strongest first: a vertex of block j beats all later blocks and half its own block.
function stats(blocks) {
  const n = blocks.reduce((a, b) => a + b, 0);
  let below = n, lin = 0, sumC2d = 0;
  for (const b of blocks) {
    if (b % 2 !== 1) throw new Error('blocks must be odd');
    below -= b; const d = below + (b - 1) / 2;
    lin += b * d * d; sumC2d += b * C2(d);
  }
  const pairs = blocks.reduce((a, b) => a + C2(b), 0), cyc = C3(n) - sumC2d;
  if (cyc !== C3(n) - lin / 2 + C2(n) / 2) throw new Error('cyclic-triple identity');
  return { n, pairs, lin, cyc };
}
const A14 = [7, 7], B14 = [1, 1, 1, 9, 1, 1], A78 = [39, 39], B78 = [7, 7, 49, 5, 5, 5];
const fmt = x => x.toLocaleString('en-GB');
function checkHook() {
  const fs = require('fs'), pth = require('path');
  const a14 = stats(A14), b14 = stats(B14), a78 = stats(A78), b78 = stats(B78);
  if (a14.n !== 14 || b14.n !== 14 || a78.n !== 78 || b78.n !== 78) throw new Error('sizes');
  if (a14.pairs !== 42 || b14.pairs !== 36 || a14.cyc !== 28 || b14.cyc !== 30) throw new Error('14-candidate counts');
  if (a78.pairs !== 1482 || b78.pairs !== 1248 || a78.cyc !== 4940 || b78.cyc !== 4943 || a78.lin !== 145275 || b78.lin !== 145269) throw new Error('78-candidate counts');
  const pkg = process.env.EP_MAJ_PACKAGE; let ratio14 = null;
  if (pkg) {
    const sr = JSON.parse(fs.readFileSync(pth.join(pkg, 'results/small_reversals.json'), 'utf8'));
    const row = sr.pairs.find(r => JSON.stringify(r.less_cyclic_blocks) === JSON.stringify(A14) && JSON.stringify(r.more_cyclic_blocks) === JSON.stringify(B14));
    if (!row || row.lin[0] !== a14.lin || row.lin[1] !== b14.lin || row.cyclic_triples[0] !== 28 || row.cyclic_triples[1] !== 30) throw new Error('small_reversals mismatch');
    ratio14 = row.ratio; if (Math.abs(Math.exp(row.log_ratio_mean) - ratio14) > 1e-9) throw new Error('ratio field');
    const cert = fs.readFileSync(pth.join(pkg, 'results/certificate.txt'), 'utf8');
    if (!cert.includes('78 candidates: linearities 145275 145269 and P(B)/P(A) > 100000.')) throw new Error('certificate line 1');
    if (!/rational lower bound itself is 1\.104e\+05/.test(cert)) throw new Error('certificate line 2');
    if (!cert.includes('the isomorphism-class probability ratio exceeds 3.3')) throw new Error('certificate line 3');
    if (Math.abs(ratio14 - 2.7) > 0.05) throw new Error('printed 2.7 differs');
  }
  return { checkedAgainstPackage: Boolean(pkg), a14, b14, a78, b78, ratio14 };
}
const U = 15.5, GAP = 3, TOP = 128;
function column(x, blocks, color, w = 96) {
  let s = '', y = TOP;
  blocks.forEach((b, i) => {
    const h = b * U - GAP;
    s += `<rect x="${x}" y="${y.toFixed(1)}" width="${w}" height="${h.toFixed(1)}" rx="4" fill="${color}" fill-opacity="${b > 1 ? 0.30 : 0.14}" stroke="${color}" stroke-width="1.6"/>`;
    if (b > 1) {
      s += text(x + w / 2, y + h / 2 - 2, `${b} candidates`, 13, ink, 'middle', 'bold');
      s += text(x + w / 2, y + h / 2 + 15, `${C2(b)} tied pairs`, 12, ink, 'middle');
    } else s += text(x + w / 2, y + h / 2 + 4, '1', 11, dim, 'middle');
    y += b * U;
  });
  return s;
}
const draw = () => {
  const c = checkHook();
  let s = '';
  s += text(40, 46, 'More voting cycles, yet far more likely', 27, ink, 'start', 'normal', SERIF);
  s += text(40, 72, 'Many random voters: an outcome costs about a factor of 2 for every pair that must be almost tied, not per cyclic triple', 14, muted);
  s += text(40, 112, '14 candidates in ranked groups (strongest on top):', 13.5, dim);
  s += column(60, A14, sky);
  s += column(330, B14, hot);
  s += text(170, 150, '(7, 7)', 16, sky, 'start', 'bold');
  s += text(170, 174, `${c.a14.pairs} almost-tied pairs`, 14, ink);
  s += text(170, 194, `${c.a14.cyc} cyclic triples`, 14, ink);
  s += text(440, 150, '(1, 1, 1, 9, 1, 1)', 16, hot, 'start', 'bold');
  s += text(440, 174, `${c.b14.pairs} almost-tied pairs`, 14, ink);
  s += text(440, 194, `${c.b14.cyc} cyclic triples`, 14, ink);
  s += text(440, 228, 'about 2.7× as likely', 15, hot, 'start', 'bold');
  s += text(440, 247, '(Monte Carlo estimate)', 12, dim);
  s += text(170, 300, 'Pairs grow like size²,', 13, mint);
  s += text(170, 318, 'loops like size³.', 13, mint);
  s += `<line x1="668" y1="100" x2="668" y2="350" stroke="${dim}" stroke-width="1" opacity="0.35"/>`;
  const X = 700;
  s += text(X, 120, '78 candidates, exact certificate:', 15, ink, 'start', 'bold');
  s += text(X, 152, '(39, 39)', 15, sky, 'start', 'bold');
  s += text(X + 150, 152, `${fmt(c.a78.pairs)} tied pairs · ${fmt(c.a78.cyc)} cyclic triples`, 14, ink);
  s += text(X, 178, '(7, 7, 49, 5, 5, 5)', 15, hot, 'start', 'bold');
  s += text(X + 150, 178, `${fmt(c.b78.pairs)} tied pairs · ${fmt(c.b78.cyc)} cyclic triples`, 14, ink);
  s += text(X, 228, '3 more loops, over 100,000× as likely', 22, hot, 'start', 'bold', SERIF);
  s += text(X, 262, 'Harrison-Trainor conjectured fewer cyclic triples always', 13.5, ink);
  s += text(X, 281, 'means more likely. False; but fully ordered outcomes', 13.5, ink);
  s += text(X, 300, 'are still the most likely of all.', 13.5, ink);
  s += text(X, 334, 'Smallest counterexample: between 8 and 13 candidates (estimate).', 12.5, rose);
  s += text(40, 388, 'Impartial culture in the limit of many voters: a null model, not real elections. Unrefereed candidate.', 12, dim);
  return s;
};
const description = 'Banner for a paper showing that a majority tournament with more voting cycles can be more probable. Title: more voting cycles, yet far more likely. Subtitle: with many random voters, an outcome costs about a factor of 2 for every pair that must be almost tied, not per cyclic triple. Left: 14 candidates in ranked groups, strongest on top, drawn as stacked boxes. The pattern (7, 7) has two boxes of 7 candidates with 21 tied pairs each: 42 almost-tied pairs and 28 cyclic triples. The pattern (1, 1, 1, 9, 1, 1) has one box of 9 candidates with 36 tied pairs and five single candidates: 36 almost-tied pairs and 30 cyclic triples, about 2.7 times as likely (Monte Carlo estimate). Pairs grow like size squared, loops like size cubed. Right: 78 candidates, exact certificate: (39, 39) has 1,482 tied pairs and 4,940 cyclic triples; (7, 7, 49, 5, 5, 5) has 1,248 tied pairs and 4,943 cyclic triples: 3 more loops, over 100,000 times as likely. Harrison-Trainor conjectured fewer cyclic triples always means more likely; false, but fully ordered outcomes are still the most likely of all. Smallest counterexample: between 8 and 13 candidates (estimate). Footer: impartial culture in the limit of many voters, a null model, not real elections; unrefereed candidate.';
function frame(inner, background) {
  const c = checkHook();
  if (c.b78.cyc - c.a78.cyc !== 3 || !description.includes('over 100,000 times as likely')) throw new Error('stated values differ from the computation');
  return bannerSvg({ inner, description, background, glow: { color: '#ffc36b', cx: '0.75', cy: '0.5', r: '0.35', opacity: '0.07' } });
}
const thumbSpec = {
  kicker: ['RESEARCH RELEASE · NOVEMBER 2026', 'SOCIAL CHOICE · RANDOM ELECTIONS'],
  head: ['More voting cycles,', '<em>far more likely.</em>'], headSize: 60,
  sub: 'A counterexample to Harrison-Trainor’s linearity conjecture for random elections.',
  tag: 'UNREFEREED CANDIDATE',
  hero: '<div class="eq-label">78 candidates, many voters</div><div class="hero-title">3 more loops</div><div class="note">over 100,000× as likely<br>(exact certificate)</div><div class="eq-foot">fully ordered outcomes stay the most likely</div>'
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
