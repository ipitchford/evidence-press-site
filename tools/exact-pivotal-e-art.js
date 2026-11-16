'use strict';
const { bannerSvg } = require('./svg-xml');
// Exact pivotal e-variables for infinite hypotheses (exact-pivotal-e-variables-infinite-hypotheses): banner, OG, thumbnail.
// "This image helps the reader understand" the paper's construction: a separating score h (mean zero under every null,
// mean at least delta under every alternative) becomes a coin with heads probability (1 + h)/2, fair under every null and
// biased under every alternative; betting the fraction delta on heads gives the exact pivotal e-values 1 + delta and
// 1 - delta. It is drawn on the paper's four-state example (Section 7, delta = 6/31), with the price of pivotality there.
// checkHook recomputes, with BigInt fractions, the null and alternative score means, the coin probabilities, the null and
// alternative success probabilities and the binary e-values from P, Q and h, and compares them with the released output
// (verification/outputs/finite_example.json, exact_certificate); it also recomputes I(6/31) against the released
// binary_guaranteed_loggrowth, and refuses to draw on mismatch. Ordering 0.0188 < 0.0392 < 0.0556 is checked against
// pivot_comparison.json values.
// Reference: txgraffiti-order48-successor (one exact object balanced with immediately readable values).
// Usage: node tools/exact-pivotal-e-art.js [--render OUTDIR_FOR_INSPECTION] [--no-mirror]
const SLUG = 'exact-pivotal-e-variables-infinite-hypotheses';
const ink = '#f6f2ea', muted = '#e2e7ea', dim = '#c3ccd2', hot = '#ffc36b', cool = '#9fd3ff', rose = '#f2a7b5';
const SANS = 'Arial,Helvetica,sans-serif', SERIF = 'Georgia,serif';
const text = (x, y, s, size = 18, color = ink, anchor = 'start', weight = 'normal', family = SANS, style = 'normal') => {
  if (/[<&]/.test(s.replace(/<\/?tspan[^>]*>/g, ''))) throw new Error('unescaped < or & in SVG text: ' + s);
  return `<text class="og-hide" x="${x}" y="${y}" fill="${color}" font-family="${family}" font-size="${size}" font-weight="${weight}" font-style="${style}" text-anchor="${anchor}">${s}</text>`;
};
// ---- exact fractions ----
const gcd = (a, b) => { a = a < 0n ? -a : a; b = b < 0n ? -b : b; while (b) [a, b] = [b, a % b]; return a; };
const F = (p, q = 1n) => { p = BigInt(p); q = BigInt(q); if (q < 0n) { p = -p; q = -q; } const g = gcd(p, q) || 1n; return [p / g, q / g]; };
const add = (a, b) => F(a[0] * b[1] + b[0] * a[1], a[1] * b[1]);
const mul = (a, b) => F(a[0] * b[0], a[1] * b[1]);
const str = a => a[1] === 1n ? `${a[0]}` : `${a[0]}/${a[1]}`;
const dot = (u, v) => u.reduce((s, x, i) => add(s, mul(x, v[i])), F(0));
const P = [[F(2, 5), F(3, 10), F(1, 5), F(1, 10)], [F(1, 10), F(1, 5), F(3, 10), F(2, 5)]];
const Q = [[F(2, 5), F(1, 10), F(1, 10), F(2, 5)], [F(7, 20), F(3, 20), F(2, 5), F(1, 10)]];
const H = [F(17, 31), F(-1), F(11, 31), F(3, 31)], DELTA = F(6, 31);
const I = d => ((1 + d) * Math.log1p(d) + (1 - d) * Math.log1p(-d)) / 2;
function checkHook() {
  // released verification/outputs/finite_example.json (exact_certificate) and pivot_comparison.json
  const rel = { delta: '6/31', coin: ['24/31', '0', '21/31', '17/31'], nullS: ['1/2', '1/2'], altS: ['37/62', '37/62'], e: ['37/31', '25/31'], I: 0.018849221152617043,
    pivotal: 0.03919536805532632, exact: 0.05560071012679045 };
  const eq = (a, b, what) => { if (JSON.stringify(a) !== JSON.stringify(b)) throw new Error(what + ' mismatch: ' + JSON.stringify(a)); };
  eq(P.map(p => str(dot(p, H))), ['0', '0'], 'null score means');
  eq(Q.map(q => str(dot(q, H))), [rel.delta, rel.delta], 'alternative score means');
  const coin = H.map(h => mul(add(F(1), h), F(1, 2)));
  eq(coin.map(str), rel.coin, 'coin probabilities');
  eq(P.map(p => str(dot(p, coin))), rel.nullS, 'null success');
  eq(Q.map(q => str(dot(q, coin))), rel.altS, 'alternative success');
  eq([str(add(F(1), DELTA)), str(add(F(1), mul(F(-1), DELTA)))], rel.e, 'binary e-values');
  if (Math.abs(I(6 / 31) - rel.I) > 1e-15) throw new Error('I(6/31) mismatch: ' + I(6 / 31));
  if (!(rel.I < rel.pivotal && rel.pivotal < rel.exact)) throw new Error('ordering');
  return rel;
}
// ---- left: score to coin on the four states ----
function left(rel) {
  let s = text(40, 116, 'Any separating score becomes a coin', 15, muted, 'start', 'bold');
  s += text(40, 136, 'score h: mean 0 under every null, at least δ', 13, dim);
  s += text(40, 152, 'under every alternative; heads chance (1 + h)/2', 13, dim);
  const hv = ['17/31', '−1', '11/31', '3/31'], X = [60, 152, 244, 336];
  rel.coin.forEach((c, i) => {
    const [p, q] = c.split('/').map(Number); const v = q ? p / q : p;
    const x = X[i], top = 186, h = 110;
    s += `<rect x="${x}" y="${top}" width="56" height="${h}" rx="4" fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.25)"/>`;
    if (v > 0) s += `<rect x="${x}" y="${(top + h - h * v).toFixed(1)}" width="56" height="${(h * v).toFixed(1)}" rx="4" fill="${hot}" opacity="0.85"/>`;
    s += text(x + 28, top - 8, 'h = ' + hv[i], 12, ink, 'middle');
    s += text(x + 28, top + h + 18, c, 13, hot, 'middle', 'bold');
    s += text(x + 28, top + h + 34, 'state ' + (i + 1), 11, dim, 'middle');
  });
  s += text(40, 360, 'four-state example of Section 7, margin δ = 6/31', 12, dim, 'start', 'normal', SERIF, 'italic');
  return s;
}
// ---- centre: two coins ----
function centre() {
  const x0 = 470; let s = '';
  s += text(x0, 116, 'Fair under every null, biased under', 15, muted, 'start', 'bold');
  s += text(x0, 134, 'every alternative', 15, muted, 'start', 'bold');
  const coin = (cx, cy, color, label, top, bottom) =>
    `<circle cx="${cx}" cy="${cy}" r="46" fill="rgba(255,255,255,0.06)" stroke="${color}" stroke-width="3"/>` +
    text(cx, cy - 4, top, 17, color, 'middle', 'bold', SERIF) + text(cx, cy + 18, bottom, 12, dim, 'middle') + text(cx, cy + 70, label, 13, ink, 'middle', 'bold');
  s += coin(x0 + 70, 220, cool, 'any null', '1/2', 'heads');
  s += coin(x0 + 250, 220, rose, 'any alternative: at least', '37/62', 'heads');
  s += text(x0, 330, 'Bet the fraction δ on heads: evidence 37/31 or 25/31,', 13, ink);
  s += text(x0, 348, 'the same law under every null (exact and pivotal)', 13, ink);
  return s;
}
function right(rel) {
  const x0 = 900; let s = '';
  s += `<line x1="${x0 - 22}" y1="104" x2="${x0 - 22}" y2="372" stroke="rgba(255,255,255,0.16)" stroke-width="1"/>`;
  s += text(x0, 116, 'Expected log growth here', 15, muted, 'start', 'bold');
  const rows = [['binary coin (guaranteed)', rel.I, hot], ['best pivotal', rel.pivotal, cool], ['best exact, not pivotal', rel.exact, rose]];
  rows.forEach(([lab, v, col], i) => {
    const y = 140 + i * 40, w = 230 * v / 0.06;
    s += `<rect x="${x0}" y="${y}" width="${w.toFixed(1)}" height="14" rx="3" fill="${col}"/>`;
    s += text(x0, y + 30, `${lab}: ${v.toFixed(i === 0 ? 4 : 3)}`, 12, ink);
  });
  s += text(x0, 284, 'Best guarantee from δ alone', 13, hot, 'start', 'bold');
  s += text(x0, 306, 'Unbounded evidence: pivotality', 12, dim, 'start', 'normal', SERIF, 'italic');
  s += text(x0, 322, 'can cost all the growth', 12, dim, 'start', 'normal', SERIF, 'italic');
  return s;
}
const draw = rel =>
  text(40, 50, 'Exact pivotal e-variables for infinite hypotheses', 25, ink, 'start', 'normal', SERIF) +
  text(40, 80, 'A fair coin built from any separating score gives exact, pivotal evidence with the best guarantee from the margin', 15, muted) +
  left(rel) + centre() + right(rel);
const description = 'Banner for a paper on exact pivotal e-variables. Title: Exact pivotal e-variables for infinite hypotheses. Subtitle: A fair coin built from any separating score gives exact, pivotal evidence with the best guarantee from the margin. Left: any separating score becomes a coin. The score h has mean 0 under every null and at least delta under every alternative; the coin has heads chance (1 + h)/2. On the four-state example of Section 7, with margin delta = 6/31, the scores 17/31, minus 1, 11/31 and 3/31 give heads chances 24/31, 0, 21/31 and 17/31, drawn as bars. Centre: the coin is fair under every null (heads 1/2) and biased under every alternative (heads at least 37/62). Bet the fraction delta on heads: evidence 37/31 or 25/31, with the same law under every null, so it is exact and pivotal. Right: expected log growth in this example: binary coin (guaranteed) 0.0188, best pivotal 0.039, best exact but not pivotal 0.056, as bars. Best guarantee from delta alone. Unbounded evidence: pivotality can cost all the growth.';
function frame(inner, background) {
  return bannerSvg({ inner, description, background, glow: { color: '#ffd38a', cx: '0.5', cy: '0.55', r: '0.4', opacity: '0.06' } });
}
const thumbSpec = {
  kicker: ['RESEARCH RELEASE · NOVEMBER 2026', 'STATISTICS · E-VALUES'],
  head: ['Any separating score becomes', 'a <em>fair coin</em> under every null'], headSize: 46,
  sub: 'Betting on it gives exact, pivotal evidence with the best guarantee from the margin; for unbounded evidence, pivotality can cost everything.',
  tag: 'UNREFEREED CANDIDATE',
  hero: '<div class="eq-label">the binary pivot</div><div class="hero-title">1 + δ(2B − 1)</div><div class="note">B fair under every null<br>growth at least I(δ)</div><div class="eq-foot">written proofs</div>'
};
module.exports = { draw, description, thumbSpec, checkHook };
if (require.main === module) (async () => {
  const fs = require('fs'), pth = require('path'), os = require('os'), vm = require('vm');
  const ROOT = pth.join(__dirname, '..');
  const rel = checkHook();
  console.log('check: exact certificate (score means, coin, success probabilities, e-values) and I(6/31) match the released outputs');
  const { resolve: bannerResolve } = require('./banner-palettes');
  const bp = bannerResolve(SLUG); if (!bp) throw new Error('no banner palette');
  const tp = require('./thumbnail-palettes');
  const tname = tp.resolve(SLUG, true);
  const svg = frame(draw(rel), bp);
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
