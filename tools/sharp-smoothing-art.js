'use strict';
const { bannerSvg } = require('./svg-xml');
// A sharp smoothing inequality in Gauss space and the exact threshold for local entropy concavity:
// banner, OG card and thumbnail.
// "This image helps the reader understand" which signal fractions q (share of output variance that is signal)
// give a concave entropy curve for symmetric inputs very close to the Gaussian: with two copies, exactly
// (0, 4/7], the endpoint 4/7 now included (Theorem C; earlier: Schubr below 1/2, the Evidence Press release
// below 4/7; failure above 4/7 is Luo's theorem, written out as Theorem D); with three or more copies,
// concavity on the whole weight simplex fails at every q in (0, 1] (Theorem E, new for q <= 4/7, failures near
// the faces; Luo's theorem on an edge above 4/7, Corollary E'). The second scale is the total signal-to-noise
// ratio q/(1-q), which is 4/3 at q = 4/7.
// Source (paper 0.1.0-candidate, 11 Nov 2026): "In plain terms", "Results at a glance" table, Section 1.3.
// The bands show proved regimes, not data; the effects themselves are minute (radius 1e-8).
// Usage: node tools/sharp-smoothing-art.js [--render OUTDIR_FOR_INSPECTION] [--no-mirror]
const SLUG = 'sharp-smoothing-entropy-threshold';
const ink = '#f4f1ea', muted = '#e3d9c9', dim = '#cbbfd6';
const oldC = '#8fd3b0', newC = '#c6f28a', pointC = '#ffd76a', failC = '#ffab7a', fail3C = '#ff9a8a';
const SANS = 'Arial,Helvetica,sans-serif', SERIF = 'Georgia,serif';
const text = (x, y, s, size = 18, color = ink, anchor = 'start', weight = 'normal', family = SANS) =>
  `<text class="og-hide" x="${x}" y="${y}" fill="${color}" font-family="${family}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}">${s}</text>`;
const f = v => (+v).toFixed(1);
// Piecewise-linear q axis, stretched between 0.5 and 0.6 so the interval [1/2, 4/7] is visible (marked on the axis).
const SEG = [[0, 230], [0.5, 470], [0.6, 900], [1, 1150]];
function X(q) {
  for (let i = 1; i < SEG.length; i++) {
    const [q0, x0] = SEG[i - 1], [q1, x1] = SEG[i];
    if (q <= q1 + 1e-12) return x0 + (q - q0) / (q1 - q0) * (x1 - x0);
  }
  throw new Error('q out of range');
}
const R1 = 122, R2 = 222, BH = 44, AY = 286;
function band(y, q0, q1, color, opacity, label, size = 16, labelColor = '#141414') {
  const x0 = X(q0), x1 = X(q1);
  let s = `<rect x="${f(x0)}" y="${y}" width="${f(x1 - x0)}" height="${BH}" fill="${color}" fill-opacity="${opacity}"/>`;
  if (label) s += text((x0 + x1) / 2, y + BH / 2 + size * 0.36, label, size, labelColor, 'middle', 'bold');
  return s;
}
function rows() {
  let s = '';
  // Two copies.
  s += text(214, R1 + 20, 'two copies', 17, ink, 'end', 'bold');
  s += text(214, R1 + 39, 'mixed by weight t', 12.5, dim, 'end', 'normal', SERIF);
  s += band(R1, 0, 0.5, oldC, 0.62, '') + band(R1, 0.5, 4 / 7, oldC, 0.86, '') + band(R1, 4 / 7, 1, failC, 0.9, 'not concave');
  s += text((X(0) + X(4 / 7)) / 2, R1 + BH / 2 + 16 * 0.36, 'concave', 16, '#141414', 'middle', 'bold');
  const x47 = X(4 / 7);
  s += `<path d="M${f(x47)} ${R1 - 8} V${AY + 8}" stroke="${pointC}" stroke-width="3"/>`;
  s += `<circle cx="${f(x47)}" cy="${R1 + BH / 2}" r="10" fill="${pointC}" stroke="#141414" stroke-width="2"/>`;
  s += text(x47 - 12, R1 - 14, '4/7 itself: concave (new)', 16, pointC, 'end', 'bold');
  s += text(X(0.25), R1 + BH + 19, 'Schubr 2026', 13, oldC, 'middle');
  s += text((X(0.5) + x47) / 2, R1 + BH + 19, 'earlier release', 13, oldC, 'middle');
  s += text(X(0.8), R1 + BH + 19, 'Luo 2026 (Theorem D)', 13, failC, 'middle');
  // Three or more copies.
  s += text(214, R2 + 20, 'three or more', 17, ink, 'end', 'bold');
  s += text(214, R2 + 39, 'over all weightings', 12.5, dim, 'end', 'normal', SERIF);
  s += band(R2, 0, 4 / 7, fail3C, 0.92, 'not concave: failures near the faces (Theorem E, new)', 15);
  s += band(R2, 4 / 7, 1, failC, 0.9, 'not concave (Luo on an edge)', 15);
  return s;
}
function axis() {
  let s = `<path d="M${X(0)} ${AY} H${X(1)}" stroke="${muted}" stroke-width="1.6"/>`;
  for (const q of [0.5, 0.6]) s += `<path d="M${f(X(q) - 4)} ${AY + 6} l8 -12 M${f(X(q) + 2)} ${AY + 6} l8 -12" stroke="${dim}" stroke-width="1.4"/>`;
  const ticks = [[0, '0', '0'], [0.5, '1/2', '1'], [4 / 7, '4/7', '4/3'], [1, '1', '∞']];
  for (const [q, lab, snr] of ticks) {
    const x = X(q), hot = Math.abs(q - 4 / 7) < 1e-9;
    s += `<path d="M${f(x)} ${AY} v7" stroke="${muted}" stroke-width="1.4"/>`;
    s += text(x, AY + 26, lab, 17, hot ? pointC : ink, 'middle', 'bold');
    s += text(x, AY + 51, snr, 15, hot ? pointC : muted, 'middle', hot ? 'bold' : 'normal');
  }
  s += text(214, AY + 26, 'signal fraction q', 14, dim, 'end', 'normal', SERIF);
  s += text(214, AY + 51, 'signal-to-noise ratio', 14, dim, 'end', 'normal', SERIF);
  s += text(X(0), AY + 76, 'scale stretched between ½ and 0.6', 11.5, dim, 'start', 'italic', SERIF);
  s += text(1150, AY + 76, 'inputs symmetric and within a factor 1 ± 10⁻⁸ of the Gaussian density', 12, dim, 'end', 'italic', SERIF);
  return s;
}
const draw = () =>
  text(40, 50, 'Is entropy concave in the mixing weights? Two copies: up to and including q = 4/7', 25, ink, 'start', 'normal', SERIF) +
  text(40, 78, 'Symmetric near-Gaussian inputs, weights √t and √(1−t) (or a weight simplex), plus Gaussian noise. Three or more copies: not at any q.', 15, muted) +
  rows() + axis();
const description = 'Banner for a paper on the exact threshold for local entropy concavity. A horizontal axis shows the signal fraction q, the share of the output variance that comes from the signal rather than the noise, from 0 to 1, stretched between one half and 0.6 so that the interval from one half to four sevenths is visible; a second row of labels gives the total signal-to-noise ratio, 1 at one half, 4/3 at four sevenths. The upper row is for two copies mixed with weights root t and root of 1 minus t: it is green (entropy concave near the Gaussian) from 0 up to and including 4/7, credited to Schubr 2026 below one half and to the earlier Evidence Press release from one half to just below 4/7, with a yellow filled dot at 4/7 labelled as new in this paper; above 4/7 it is orange (not concave, Luo 2026, written out as Theorem D). The lower row is for three or more copies with concavity required over all weightings: it is not concave at every q, new in Theorem E up to 4/7 where the failures sit near the faces of the weight simplex, and by Luo\'s theorem on an edge above 4/7. A footnote says the inputs are symmetric and within a factor 1 plus or minus 10 to the minus 8 of the Gaussian density; the bands show proved regimes, not data.';
function frame(inner, background) {
  return bannerSvg({ inner, description, background, glow: { color: newC, cx: '0.42', cy: '0.45', r: '0.45', opacity: '0.06' } });
}
const thumbSpec = {
  kicker: ['RESEARCH RELEASE · NOVEMBER 2026', 'INFORMATION THEORY'],
  head: ['Four sevenths,', '<em>exactly</em>'], headSize: 66,
  sub: 'Two noisy copies of a symmetric, near-Gaussian signal: entropy is concave in the mixing weight exactly up to signal fraction 4/7, now including 4/7 itself. With three or more copies it fails at every signal fraction.',
  tag: 'UNREFEREED CANDIDATE',
  hero: '<div class="eq-label">two copies: concave for</div><div class="hero-title">q ∈ (0, 4/7]</div><div class="note">endpoint 4/7 now included<br>signal-to-noise ratio 4/3<br>three or more copies: no q</div><div class="eq-foot">local result · effects minute</div>'
};
module.exports = { draw, description, thumbSpec, X };
if (require.main === module) (async () => {
  const fs = require('fs'), pth = require('path'), os = require('os'), vm = require('vm');
  const ROOT = pth.join(__dirname, '..');
  // Guards: drawn values match the paper (q = 4/7 is total SNR q/(1-q) = 4/3; q = 1/2 is SNR 1; 4/7 is the
  // root of q = b(q/2) with b(r) = sqrt(2r(1+r)) - r).
  if (Math.abs((4 / 7) / (3 / 7) - 4 / 3) > 1e-12 || Math.abs(0.5 / 0.5 - 1) > 1e-12) throw new Error('SNR mismatch');
  const b = r => Math.sqrt(2 * r * (1 + r)) - r;
  if (Math.abs(b(2 / 7) - 4 / 7) > 1e-12) throw new Error('4/7 is not b(2/7)');
  if (!(X(0) < X(0.5) && X(0.5) < X(4 / 7) && X(4 / 7) < X(1))) throw new Error('axis order');
  const reg = JSON.parse(fs.readFileSync(pth.join(ROOT, 'data/BANNER_PALETTES.json'), 'utf8'));
  const { palettes } = require('./banner-palettes');
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
