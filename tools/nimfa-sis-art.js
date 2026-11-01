'use strict';
const { bannerSvg } = require('./svg-xml');
// How fast does an epidemic die out on a network? (nimfa-sis-decay-envelopes): banner, OG card and thumbnail.
// "This image helps the reader understand" that at the tipping point R0 = 1 every network obeys the proved limit
// y(t) <= 1/(1+t) (Theorem 3), but network shape sets how fast the average actually falls: the same R0 = 1 epidemic
// takes about 922 mean recovery times to fall below 0.1% on a small-world (Watts-Strogatz) network and about 39 on a
// random geometric (spatial) one (Table 1, kappa = 0.920 versus 0.035; Theorem 7: t y(t) -> kappa(G)).
// Data: y(t) from full infection, NIMFA at R0 = 1, for the two 1,000-node graphs of illustrations.py (seed 11, largest
// component), integrated with the package's own integrate() (LSODA, rtol 1e-10); first crossings of 0.001 at
// t = 921.9 and 39.4 (illustrations.json reports T(1e-3) = 922.3 and 39.5 on a 0.005 grid).
// Usage: node tools/nimfa-sis-art.js [--render OUTDIR_FOR_INSPECTION] [--no-mirror]
const SLUG = 'nimfa-sis-decay-envelopes';
const DATA = {"ws":[[0.1,0.909033],[0.11228,0.898982],[0.12607,0.887957],[0.14155,0.875893],[0.15893,0.862729],[0.17845,0.848408],[0.20037,0.83288],[0.22497,0.816103],[0.2526,0.798047],[0.28362,0.778695],[0.31845,0.758045],[0.35756,0.736115],[0.40147,0.712943],[0.45078,0.688588],[0.50613,0.663134],[0.56829,0.636686],[0.63808,0.609373],[0.71644,0.581343],[0.80442,0.552764],[0.90321,0.523816],[1.01413,0.494691],[1.13867,0.465586],[1.27851,0.436697],[1.43552,0.408214],[1.61181,0.38032],[1.80975,0.353179],[2.032,0.32694],[2.28154,0.30173],[2.56173,0.277651],[2.87632,0.254784],[3.22955,0.233185],[3.62616,0.212887],[4.07147,0.193904],[4.57147,0.176229],[5.13288,0.159841],[5.76323,0.144705],[6.47099,0.130774],[7.26566,0.117995],[8.15793,0.106308],[9.15977,0.0956488],[10.28465,0.0859524],[11.54766,0.0771521],[12.96578,0.0691822],[14.55806,0.0619784],[16.34588,0.0554786],[18.35325,0.0496235],[20.60714,0.0443568],[23.13782,0.0396258],[25.97928,0.0353809],[29.1697,0.0315764],[32.75191,0.0281697],[36.77404,0.0251218],[41.29012,0.0223971],[46.36079,0.0199629],[52.05418,0.0177893],[58.44674,0.0158496],[65.62436,0.0141192],[73.68342,0.0125762],[82.73219,0.0112007],[92.8922,0.00997479],[104.29992,0.00888248],[117.10858,0.00790939],[131.49022,0.00704262],[147.63801,0.00627066],[165.76885,0.0055832],[186.12626,0.00497104],[208.98369,0.00442597],[234.64814,0.00394066],[263.46435,0.00350857],[295.81936,0.00312387],[332.14776,0.00278137],[372.9375,0.00247645],[418.73647,0.00220498],[470.15983,0.00196329],[527.89829,0.00174811],[592.72738,0.00155654],[665.51787,0.00138598],[747.24748,0.00123412],[839.01397,0.00109892],[942.04993,0.000978543],[1057.73934,0.000871362],[1187.6361,0.000775929],[1333.48496,0.000690956],[1497.24495,0.000615296],[1681.11564,0.000547926],[1887.56676,0.000487937],[2119.37133,0.00043452],[2379.64289,0.000386954],[2671.87737,0.000344598],[3000.0,0.00030688]],"rgg":[[0.1,0.907621],[0.11228,0.897239],[0.12607,0.88581],[0.14155,0.873254],[0.15893,0.859496],[0.17845,0.84446],[0.20037,0.828074],[0.22497,0.810275],[0.2526,0.791006],[0.28362,0.770225],[0.31845,0.747904],[0.35756,0.724033],[0.40147,0.698626],[0.45078,0.671719],[0.50613,0.643377],[0.56829,0.613695],[0.63808,0.582798],[0.71644,0.550841],[0.80442,0.518012],[0.90321,0.484524],[1.01413,0.450616],[1.13867,0.416547],[1.27851,0.382591],[1.43552,0.349029],[1.61181,0.316141],[1.80975,0.284201],[2.032,0.253469],[2.28154,0.224182],[2.56173,0.196547],[2.87632,0.170741],[3.22955,0.1469],[3.62616,0.125119],[4.07147,0.105453],[4.57147,0.0879103],[5.13288,0.072462],[5.76323,0.0590391],[6.47099,0.0475385],[7.26566,0.0378278],[8.15793,0.0297517],[9.15977,0.0231384],[10.28465,0.0178077],[11.54766,0.0135784],[12.96578,0.010275],[14.55806,0.0077346],[16.34588,0.00581024],[18.35325,0.00437384],[20.60714,0.00331654],[23.13782,0.00254789],[25.97928,0.00199426],[29.1697,0.00159697],[32.75191,0.00131043],[36.77404,0.00110033],[41.29012,0.00094184],[46.36079,0.000817826],[52.05418,0.000717027],[58.44674,0.000632381],[65.62436,0.000559599],[73.68342,0.000496088],[82.73219,0.000440215],[92.8922,0.000390857],[104.29992,0.000347169],[117.10858,0.000308456],[131.49022,0.00027413],[147.63801,0.000243679],[165.76885,0.000216653],[186.12626,0.000192658],[208.98369,0.000171348],[234.64814,0.000152417],[263.46435,0.000135594],[295.81936,0.000120642],[332.14776,0.000107349],[372.9375,9.55301e-05],[418.73647,8.50191e-05],[470.15983,7.56703e-05],[527.89829,6.73539e-05],[592.72738,5.99551e-05],[665.51787,5.33719e-05],[747.24748,4.75138e-05],[839.01397,4.23006e-05],[942.04993,3.76608e-05],[1057.73934,3.35311e-05],[1187.6361,2.98552e-05],[1333.48496,2.65831e-05],[1497.24495,2.36701e-05],[1681.11564,2.10769e-05],[1887.56676,1.87681e-05],[2119.37133,1.67126e-05],[2379.64289,1.48824e-05],[2671.87737,1.32529e-05],[3000.0,1.18019e-05]]};
const ink = '#f4f1ea', muted = '#e3d9c9', dim = '#c4b7a2';
const wsC = '#ffc06a', rgC = '#7fd8e8';
const SANS = 'Arial,Helvetica,sans-serif', SERIF = 'Georgia,serif';
const text = (x, y, s, size = 18, color = ink, anchor = 'start', weight = 'normal', family = SANS) =>
  `<text class="og-hide" x="${x}" y="${y}" fill="${color}" font-family="${family}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}">${s}</text>`;
const f = v => (+v).toFixed(1);
const T_WS = 921.876, T_RG = 39.437, K_WS = 0.920, K_RG = 0.035;
// Plot frame: log t in [0.1, 3000], log y in [1e-5, 1].
const X0 = 92, X1 = 690, YT = 112, YB = 340;
const X = t => X0 + (Math.log10(t) + 1) / (Math.log10(3000) + 1) * (X1 - X0);
const Y = y => YT + (-Math.log10(y)) / 5 * (YB - YT);
const path = pts => 'M' + pts.map(([t, y]) => `${f(X(t))} ${f(Y(Math.max(y, 1e-5)))}`).join(' L');
function plot() {
  let s = `<rect x="${X0}" y="${YT}" width="${X1 - X0}" height="${YB - YT}" fill="#000" fill-opacity=".10" stroke="${muted}" stroke-opacity=".25"/>`;
  for (const t of [0.1, 1, 10, 100, 1000]) s += `<path d="M${f(X(t))} ${YT} V${YB}" stroke="${muted}" stroke-opacity=".10"/>` + text(f(X(t)), YB + 18, String(t), 12, dim, 'middle');
  const yl = [[1, '100%'], [0.1, '10%'], [0.01, '1%'], [0.001, '0.1%'], [1e-4, '0.01%'], [1e-5, '0.001%']];
  for (const [y, l] of yl) s += `<path d="M${X0} ${f(Y(y))} H${X1}" stroke="${muted}" stroke-opacity=".10"/>` + text(X0 - 8, f(Y(y) + 4), l, 12, dim, 'end');
  s += text((X0 + X1) / 2, YB + 38, 'time, in mean recovery times (log scale)', 13, dim, 'middle', 'normal', SERIF);
  s += text(X0, YT - 10, 'average infection level, starting fully infected, R₀ = 1', 13, dim, 'start', 'normal', SERIF);
  // 0.1% threshold line
  s += `<path d="M${X0} ${f(Y(1e-3))} H${X1}" stroke="${ink}" stroke-opacity=".55" stroke-width="1.3" stroke-dasharray="2 4"/>`;
  // Proved envelope 1/(1+t)
  const env = []; for (let e = -1; e <= Math.log10(3000) + 1e-9; e += 0.05) { const t = 10 ** e; env.push([t, 1 / (1 + t)]); }
  s += text(f(X(2.2)), f(Y(1 / 3.2) - 10), 'proved limit 1/(1+t), any network', 13, ink, 'start', 'bold');
  s += `<path d="${path(DATA.ws)}" stroke="${wsC}" stroke-width="3" fill="none"/>`;
  s += `<path d="${path(DATA.rgg)}" stroke="${rgC}" stroke-width="3" fill="none"/>`;
  s += `<path d="${path(env)}" stroke="${ink}" stroke-width="2.2" stroke-dasharray="7 5" fill="none"/>`;
  for (const [T, c] of [[T_WS, wsC], [T_RG, rgC]]) {
    s += `<path d="M${f(X(T))} ${f(Y(1e-3))} V${YB}" stroke="${c}" stroke-width="1.6" stroke-dasharray="3 3"/>`;
    s += `<circle cx="${f(X(T))}" cy="${f(Y(1e-3))}" r="5.5" fill="${c}" stroke="#111" stroke-opacity=".4"/>`;
  }
  s += text(f(X(T_RG) - 8), f(Y(2.2e-5)), '≈ 40', 15, rgC, 'end', 'bold');
  s += text(f(X(T_WS) - 8), f(Y(2.2e-5)), '≈ 920', 15, wsC, 'end', 'bold');
  s += text(f(X(0.12)), f(Y(1e-3) - 7), '0.1%', 12, ink, 'start');
  return s;
}
function side() {
  const x = 740;
  let s = text(x, 128, 'Same R₀ = 1, same proved limit,', 17, ink, 'start', 'normal', SERIF) + text(x, 150, 'very different die-out:', 17, ink, 'start', 'normal', SERIF);
  s += `<rect x="${x}" y="172" width="6" height="64" fill="${wsC}"/>` + text(x + 18, 206, '≈ 920', 34, wsC, 'start', 'bold') +
    text(x + 128, 196, 'recovery times to fall below 0.1%', 14, muted) + text(x + 128, 216, `small-world network, κ ≈ ${K_WS.toFixed(2)}`, 14, wsC, 'start', 'bold');
  s += `<rect x="${x}" y="252" width="6" height="64" fill="${rgC}"/>` + text(x + 18, 286, '≈ 40', 34, rgC, 'start', 'bold') +
    text(x + 128, 276, 'recovery times to fall below 0.1%', 14, muted) + text(x + 128, 296, `spatial network, κ ≈ ${K_RG.toFixed(3)}`, 14, rgC, 'start', 'bold');
  s += text(x, 346, 'At the threshold the average decays like κ(G)/t.', 13.5, dim, 'start', 'normal', SERIF);
  s += text(x, 366, 'Small κ: the average falls fast, but hubs and cores stay infected.', 13.5, dim, 'start', 'normal', SERIF);
  return s;
}
const draw = () =>
  text(40, 52, 'How fast an epidemic dies out at the tipping point depends on the network', 26, ink, 'start', 'normal', SERIF) +
  text(40, 80, 'Mean-field SIS model on two 1,000-node synthetic networks; both stay below the proved 1/(1+t) limit', 15, muted) +
  plot() + side();
const description = 'Banner for a paper proving universal decay limits for network SIS epidemics. On the left, a log-log plot shows the average infection level against time in mean recovery times, for an epidemic exactly at the tipping point R0 = 1 that starts with everyone infected. A dashed white curve is the proved limit 1/(1+t), which holds on every network. An orange curve for a small-world network of 1,000 nodes runs just below the limit and crosses the dotted 0.1% line at about 920 recovery times. A blue curve for a spatial random geometric network of 1,000 nodes drops away from the limit and crosses 0.1% at about 40 recovery times. On the right, the two numbers are repeated: about 920 recovery times for the small-world network, with kappa about 0.92, and about 40 for the spatial network, with kappa about 0.035. A note says that at the threshold the average decays like kappa(G)/t, and that a small kappa means the average falls fast while hubs and cores stay infected.';
function frame(inner, background) {
  return bannerSvg({ inner, description, background, glow: { color: rgC, cx: '0.3', cy: '0.6', r: '0.4', opacity: '0.05' } });
}
const thumbSpec = {
  kicker: ['RESEARCH RELEASE · NOVEMBER 2026', 'NETWORK EPIDEMICS'],
  head: ['How fast does', '<em>an epidemic die out?</em>'], headSize: 62,
  sub: 'Never slower than 1/(1+t) at or below R0 = 1, on any network: two 2024 conjectures proved. At the tipping point, network shape sets the pace.',
  tag: 'UNREFEREED CANDIDATE',
  hero: '<div class="eq-label">same R0 = 1, time to fall below 0.1%</div><div class="hero-title">920 vs 40</div><div class="note">small-world vs spatial network<br>(in mean recovery times)<br>proved limit: 1/(1+t)</div><div class="eq-foot">written proofs · symbolic and numerical checks</div>'
};
module.exports = { draw, description, thumbSpec };
if (require.main === module) (async () => {
  const fs = require('fs'), pth = require('path'), os = require('os'), vm = require('vm');
  const ROOT = pth.join(__dirname, '..');
  // Guards: curves sit below the proved envelope and cross 0.001 where the paper's Table 1 says.
  for (const k of ['ws', 'rgg']) for (const [t, y] of DATA[k]) if (y > 1 / (1 + t) + 1e-9) throw new Error('curve above envelope ' + k + ' ' + t);
  const cross = k => { const d = DATA[k]; for (let i = 1; i < d.length; i++) if (d[i][1] <= 1e-3) return [d[i - 1][0], d[i][0]]; return null; };
  const [a, b] = cross('ws'), [c, d] = cross('rgg');
  if (!(a <= T_WS && T_WS <= b && c <= T_RG && T_RG <= d)) throw new Error('crossing mismatch');
  if (Math.abs(T_WS - 922.35) > 2 || Math.abs(T_RG - 39.45) > 0.5) throw new Error('Table 1 mismatch');
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
