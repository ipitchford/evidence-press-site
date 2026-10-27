'use strict';
const { bannerSvg } = require('./svg-xml');
// Thermal heat-current cumulant ratios can be arbitrarily negative: banner, OG card and thumbnail.
// Sources (paper "Thermal heat-current cumulant ratios can be arbitrarily negative", 1.0.0-candidate, 27 Oct 2026):
//  - Figure 1 and Section 4: states 0 and 1 form a fast cycle carrying heat from the hot to the cold bath;
//    state 2 is a trap entered and left only through weak edges (rates of order eps).
//  - Section 5, Theorem 5.1: full-support family, E = (0,2,1); trap entered at leading rate 8 eps and left at 20 eps;
//    C1 = 40/63 fixed; S = C3/C1 ~ -16/(21609 eps^2), K = C4/C2 ~ -16/(64827 eps^2).
//  - DATA below: exact values of C3/C1 and C4/C2 for that family, copied from the package file
//    evidence/divergence.csv (Figure 2), eps from 1e-3 to 1e-7.
// The network drawing and heat record are schematics; only the right-hand curves are data.
// Usage: node tools/thermal-cumulant-art.js [--render OUTDIR_FOR_INSPECTION] [--no-mirror]
const SLUG = 'thermal-cumulant-sign-counterexamples';
const ink = '#effaf9', muted = '#cfe4e2', dim = '#a9c6c3';
const hot = '#ffb36b', cold = '#8fd8ff', trapc = '#e7a6ff', sCol = '#ffb36b', kCol = '#8fd8ff';
const SANS = 'Arial,Helvetica,sans-serif', SERIF = 'Georgia,serif';
const text = (x, y, s, size = 18, color = ink, anchor = 'start', weight = 'normal', family = SANS) =>
  `<text class="og-hide" x="${x}" y="${y}" fill="${color}" font-family="${family}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}">${s}</text>`;
const f = v => (+v).toFixed(1);
const sub = t => `<tspan baseline-shift="sub" font-size="72%">${t}</tspan>`;
const sup = t => `<tspan baseline-shift="super" font-size="70%">${t}</tspan>`;
const DATA = [[0.001,-564.204,-836.911],[0.00088968,-737.694,-990.711],[0.000791766,-959.24,-1172.63],[0.000704722,-1241.96,-1388.61],[0.000627353,-1601.99,-1645.62],[0.000558347,-2061.56,-1953.42],[0.000496771,-2648.31,-2323.6],[0.000442087,-3393.27,-2768.07],[0.000393546,-4337.05,-3302.76],[0.00035014,-5541.16,-3952.89],[0.000311624,-7065.11,-4739.9],[0.000277393,-8994.33,-5696.21],[0.000246853,-11445.2,-6866.16],[0.000219684,-14549.6,-8297.67],[0.000195503,-18481.7,-10054.3],[0.000173974,-23463.2,-12216.4],[0.000154847,-29756.8,-14877],[0.000137798,-37732,-18168.8],[0.000122639,-47811.8,-22239.9],[0.000109135,-60574.1,-27294.1],[9.71251e-05,-76701.8,-33568.5],[8.64379e-05,-97090.2,-41374.2],[7.6929e-05,-122855,-51096.7],[6.84603e-05,-155444,-63235.2],[6.09273e-05,-196611,-78390.1],[5.42211e-05,-248650,-97346.6],[4.82556e-05,-314374,-121063],[4.29443e-05,-397446,-150787],[3.8219e-05,-502361,-188043],[3.40136e-05,-634895,-234787],[3.027e-05,-802355,-293491],[2.69389e-05,-1.01385e+06,-367229],[2.39745e-05,-1.28097e+06,-459911],[2.13361e-05,-1.61837e+06,-576471],[1.89879e-05,-2.04452e+06,-723119],[1.68985e-05,-2.58266e+06,-907664],[1.5039e-05,-3.26224e+06,-1.14e+06],[1.33838e-05,-4.12059e+06,-1.43264e+06],[1.1911e-05,-5.20444e+06,-1.80125e+06],[1.06003e-05,-6.57308e+06,-2.2657e+06],[9.4337e-06,-8.30157e+06,-2.85111e+06],[8.3956e-06,-1.0484e+07,-3.58898e+06],[7.47166e-06,-1.324e+07,-4.51936e+06],[6.64942e-06,-1.67201e+07,-5.69252e+06],[5.91769e-06,-2.11144e+07,-7.17202e+06],[5.26646e-06,-2.66632e+07,-9.03819e+06],[4.68691e-06,-3.36693e+07,-1.13922e+07],[4.17113e-06,-4.2516e+07,-1.4362e+07],[3.7121e-06,-5.36867e+07,-1.81091e+07],[3.3036e-06,-6.77913e+07,-2.28371e+07],[2.94005e-06,-8.56004e+07,-2.88031e+07],[2.61651e-06,-1.08087e+08,-3.63322e+07],[2.32857e-06,-1.36481e+08,-4.58341e+07],[2.07232e-06,-1.72331e+08,-5.78262e+07],[1.84426e-06,-2.17596e+08,-7.29621e+07],[1.64131e-06,-2.7475e+08,-9.20665e+07],[1.46069e-06,-3.46915e+08,-1.16181e+08],[1.29994e-06,-4.38031e+08,-1.4662e+08],[1.15689e-06,-5.53076e+08,-1.85044e+08],[1.02958e-06,-6.98335e+08,-2.33549e+08],[9.16274e-07,-8.81742e+08,-2.9478e+08],[8.15441e-07,-1.11331e+09,-3.72077e+08],[7.25704e-07,-1.4057e+09,-4.69659e+08],[6.45843e-07,-1.77487e+09,-5.92851e+08],[5.74769e-07,-2.24099e+09,-7.48376e+08],[5.11518e-07,-2.82951e+09,-9.44722e+08],[4.55227e-07,-3.57259e+09,-1.19261e+09],[4.05131e-07,-4.5108e+09,-1.50556e+09],[3.60547e-07,-5.69541e+09,-1.90067e+09],[3.2087e-07,-7.19109e+09,-2.3995e+09],[2.85559e-07,-9.07954e+09,-3.02929e+09],[2.54134e-07,-1.14639e+10,-3.82443e+09],[2.26168e-07,-1.44744e+10,-4.82832e+09],[2.01279e-07,-1.82755e+10,-6.09578e+09],[1.79128e-07,-2.30748e+10,-7.69603e+09],[1.59416e-07,-2.91344e+10,-9.71644e+09],[1.41873e-07,-3.67852e+10,-1.22673e+10],[1.2626e-07,-4.64452e+10,-1.5488e+10],[1.12365e-07,-5.86419e+10,-1.95544e+10],[1e-07,-7.40415e+10,-2.46884e+10]];

// Left: the three-state trap network (schematic).
function network() {
  const n0 = [92, 300], n1 = [262, 176], n2 = [338, 318];
  let s = '';
  // fast pair: hot (solid) and cold (dashed) arcs
  s += `<path d="M${n0[0] + 14} ${n0[1] - 24} Q 140 182 ${n1[0] - 28} ${n1[1] - 8}" stroke="${hot}" stroke-width="4" fill="none"/>`;
  s += `<path d="M${n0[0] + 28} ${n0[1] - 6} Q 222 270 ${n1[0] - 6} ${n1[1] + 28}" stroke="${cold}" stroke-width="4" stroke-dasharray="9 6" fill="none"/>`;
  // weak link to trap
  s += `<path d="M${n0[0] + 32} ${n0[1] + 6} L ${n2[0] - 30} ${n2[1]}" stroke="${trapc}" stroke-width="1.6" stroke-dasharray="2 5" fill="none"/>`;
  const node = ([x, y], lab, col) => `<circle cx="${x}" cy="${y}" r="27" fill="#ffffff" fill-opacity=".08" stroke="${col}" stroke-width="2.5"/>` + text(x, y + 8, lab, 23, ink, 'middle', 'bold', SERIF);
  s += node(n0, '0', muted) + node(n1, '1', muted) + node(n2, '2', trapc);
  s += text(112, 168, 'hot bath', 15, hot, 'end', 'bold');
  s += text(228, 262, 'cold bath', 15, cold, 'start', 'bold');
  s += text(176, 128, 'fast cycle carries heat', 15, muted, 'middle');
  s += text(176, 146, 'from hot to cold', 15, muted, 'middle');
  s += text(212, 344, 'weak edge ε', 14, trapc, 'middle');
  s += text(338, 368, 'trap: entered rarely,', 14, trapc, 'middle', 'bold');
  s += text(338, 385, 'left slowly', 14, trapc, 'middle', 'bold');
  return s;
}

// Middle: schematic heat record with pauses.
function record() {
  const x0 = 430, x1 = 700, y0 = 318, y1 = 170;
  let s = `<path d="M${x0} ${y1 - 8} V${y0} H${x1 + 6}" stroke="${muted}" stroke-opacity=".7" stroke-width="1.6" fill="none"/>`;
  s += text(x0 - 6, y1 - 16, 'heat to cold bath', 14, dim, 'start', 'normal', SERIF);
  s += text(x1, y0 + 22, 'time', 14, dim, 'end', 'normal', SERIF);
  const seg = [[0, 70, 1], [70, 135, 0], [135, 175, 1], [175, 250, 0], [250, 270, 1]];
  let y = y0, d = `M${x0} ${y0}`;
  for (const [a, b, on] of seg) {
    if (on) { for (let t = a; t < b; t += 8) { d += ` H${x0 + t} V${f(y - 7)}`; y -= 7; } d += ` H${x0 + b}`; } else d += ` H${x0 + b}`;
  }
  s += `<path d="${d}" stroke="${ink}" stroke-width="2.4" fill="none"/>`;
  s += `<rect x="${x0 + 70}" y="${y1}" width="65" height="${y0 - y1}" fill="${trapc}" fill-opacity=".10"/>`;
  s += `<rect x="${x0 + 175}" y="${y1}" width="75" height="${y0 - y1}" fill="${trapc}" fill-opacity=".10"/>`;
  s += text(x0 + 212, y1 + 18, 'in trap:', 13.5, trapc, 'middle', 'bold');
  s += text(x0 + 212, y1 + 34, 'no heat', 13.5, trapc, 'middle', 'bold');
  s += text((x0 + x1) / 2, y0 + 50, 'rare long pauses skew the record', 14, muted, 'middle');
  s += text((x0 + x1) / 2, y0 + 68, 'towards shortfalls (schematic)', 14, muted, 'middle');
  return s;
}

// Right: exact |C3/C1| and |C4/C2| against 1/eps, log-log (data).
const PL = { x0: 800, x1: 1150, y0: 318, y1: 140 };
const lx = e => PL.x0 + (Math.log10(1 / e) - 3) / 4 * (PL.x1 - PL.x0);
const ly = v => PL.y0 - (Math.log10(Math.abs(v)) - 2) / 10 * (PL.y0 - PL.y1);
function plot() {
  let s = `<path d="M${PL.x0} ${PL.y1 - 8} V${PL.y0} H${PL.x1 + 6}" stroke="${muted}" stroke-opacity=".7" stroke-width="1.6" fill="none"/>`;
  for (const k of [3, 5, 7]) {
    s += `<path d="M${f(lx(10 ** -k))} ${PL.y0} V${PL.y0 + 6}" stroke="${muted}" stroke-width="1.5"/>`;
    s += text(f(lx(10 ** -k)), PL.y0 + 24, '10' + sup('−' + k), 13, dim, 'middle');
  }
  for (const k of [3, 6, 9, 12]) s += text(PL.x0 - 8, f(ly(10 ** k) + 5), '10' + sup(String(k)), 13, dim, 'end');
  s += text((PL.x0 + PL.x1) / 2, PL.y0 + 48, 'weak coupling ε (smaller to the right)', 14, dim, 'middle', 'normal', SERIF);
  s += text(PL.x0 - 30, PL.y1 - 18, 'size of the negative ratio', 14, dim, 'start', 'normal', SERIF);
  const path = i => 'M' + DATA.map(r => `${f(lx(r[0]))} ${f(ly(r[i]))}`).join(' L');
  s += `<path d="${path(1)}" stroke="${sCol}" stroke-width="3" fill="none"/>`;
  s += `<path d="${path(2)}" stroke="${kCol}" stroke-width="3" stroke-dasharray="8 5" fill="none"/>`;
  s += text(PL.x0 + 18, PL.y1 + 18, '−C' + sub('3') + '/C' + sub('1'), 16, sCol, 'start', 'bold');
  s += text(PL.x0 + 18, PL.y1 + 38, '−C' + sub('4') + '/C' + sub('2'), 16, kCol, 'start', 'bold');
  s += text(PL.x1, PL.y0 - 60, 'both grow like ε' + sup('−2'), 15, ink, 'end', 'bold');
  s += text(PL.x1, PL.y0 - 40, 'mean current fixed: C' + sub('1') + ' = 40/63', 13.5, muted, 'end');
  s += text(PL.x1, PL.y0 - 22, 'exact values (paper, Figure 2)', 12.5, dim, 'end');
  return s;
}

const draw = () => text(40, 50, 'A rarely visited trap makes heat flow in bursts and pauses', 27, ink, 'start', 'normal', SERIF) +
  text(40, 80, 'Three states, two baths, local detailed balance: the third and fourth cumulant ratios become arbitrarily negative', 16.5, muted) +
  network() + record() + plot();

const description = 'Banner for a paper showing that heat-current cumulant ratios can be arbitrarily negative in thermal Markov networks. Left, schematic: a three-state network. States 0 and 1 form a fast cycle joined by a solid orange hot-bath edge and a dashed blue cold-bath edge, which carries heat from the hot to the cold bath. State 2 is a trap, joined to state 0 by a weak edge of strength epsilon, so it is entered rarely and left slowly. Middle, schematic: the heat delivered to the cold bath over time rises in steps while the fast cycle runs and stays flat during shaded pauses when the system sits in the trap; rare long pauses skew the record towards shortfalls. Right, data: on logarithmic axes, the exact sizes of the negative ratios minus C3/C1 (solid orange) and minus C4/C2 (dashed blue) for the paper\'s full-support family, as epsilon falls from 10^-3 to 10^-7. Both grow like epsilon to the minus 2, from about 10^3 to about 10^10, while the mean heat current stays fixed at C1 = 40/63. Values are from the paper\'s Figure 2.';

function frame(inner, background) {
  return bannerSvg({ inner, description, background, glow: { color: hot, cx: '0.2', cy: '0.62', r: '0.4', opacity: '0.07' } });
}

const thumbSpec = {
  kicker: ['RESEARCH RELEASE · OCTOBER 2026', 'STOCHASTIC THERMODYNAMICS · HEAT CURRENTS'],
  head: ['Negative heat cumulants', '<em>need no quantum.</em>'], headSize: 66,
  sub: 'Three-state thermal networks disprove two sign conjectures: a rarely visited trap drives C₃/C₁ and C₄/C₂ to −∞, while variance-based bounds stay intact.',
  tag: 'UNREFEREED CANDIDATE',
  hero: '<div class="eq-label">fixed mean current C₁ = 40/63</div><div class="hero-title">ε⁻²</div><div class="note">C₃/C₁ ≈ −16/(21609 ε²)<br>C₄/C₂ ≈ −16/(64827 ε²)</div><div class="eq-foot">three states · two baths · exact proofs</div>'
};

module.exports = { draw, description, thumbSpec, DATA };
if (require.main === module) (async () => {
  const fs = require('fs'), pth = require('path'), os = require('os'), vm = require('vm');
  const ROOT = pth.join(__dirname, '..');
  // Guards against the paper's values (Theorem 5.1, eq. (25), Figure 2).
  if (DATA.length !== 80 || DATA[0][0] !== 0.001 || DATA.at(-1)[0] !== 1e-7) throw new Error('data range mismatch');
  if (!DATA.every(r => r[1] < 0 && r[2] < 0)) throw new Error('ratios not negative');
  const last = DATA.at(-1), e = last[0];
  if (Math.abs(last[1] * e * e + 16 / 21609) > 2e-7 || Math.abs(last[2] * e * e + 16 / 64827) > 2e-7) throw new Error('eps^-2 coefficients mismatch');
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
