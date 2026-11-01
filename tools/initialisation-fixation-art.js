'use strict';
// Initialisation-dependent fixation banner (noisy weighted voter model, Conjecture 2 of Ganesh-Hauert-Valla).
// Sources (manuscript of 27 Oct 2026):
//  - Equation (31): for resident rates 2 or 6 with probability 1/2, the fresh-start mean resident rate is
//    b_F(t) = 3 + e^{-4t}, against the equilibrium (harmonic-mean) rate lambda = 3. Drawn exactly below.
//  - Table 1 (favourable rates 1/2 or 1, residents 2 or 6, each probability 1/2): single-founder limits under
//    the four starts: fresh/fresh 0.7842272... (Theorem 4; numerical), fresh founders with equilibrium residents
//    (3+sqrt 37)/12 = 0.7568969... (= the conjectured value, Lemma 7.3), equilibrium/equilibrium 7/9 (Theorem 6, exact),
//    equilibrium founders with fresh residents 0.8030497... (Theorem 4; numerical).
const ink = '#f4f1ea', muted = '#ddd5c6', dim = '#bfb6a6';
const cFresh = '#ffcf7a', cEq = '#9fd3ff', cConj = '#f2a3b8';
const SANS = 'Arial,Helvetica,sans-serif', SERIF = 'Georgia,serif';
const text = (x, y, s, size = 18, color = ink, anchor = 'start', weight = 'normal', family = SANS) =>
  `<text class="og-hide" x="${x}" y="${y}" fill="${color}" font-family="${family}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}">${s}</text>`;
const sub = s => `<tspan baseline-shift="sub" font-size="72%">${s}</tspan>`;
const sup = s => `<tspan baseline-shift="super" font-size="70%">${s}</tspan>`;
const f = v => (+v).toFixed(1);

const bF = t => 3 + Math.exp(-4 * t); // equation (31)
const STARTS = [ // Table 1
  { v: 0.8030497, lab: 'equilibrium founders, fresh residents', col: cFresh, exact: false },
  { v: 0.7842272, lab: 'fresh founders, fresh residents', note: 'the start Conjecture 2 states', col: cFresh, exact: false },
  { v: 7 / 9, lab: 'all in equilibrium (source simulations)', note: '7/9, exact', col: cEq, exact: true },
  { v: (3 + Math.sqrt(37)) / 12, lab: 'fresh founders, equilibrium residents', note: '(3+√37)/12 = conjectured value', col: cConj, exact: true }
];
if (Math.abs(STARTS[3].v - 0.7568969) > 1e-6 || Math.abs(bF(0) - 4) > 1e-12) throw new Error('art data');

function left() {
  let s = '';
  s += text(34, 46, 'A fresh population updates faster at first', 21, ink, 'start', 'bold');
  s += text(34, 70, 'mean resident update rate, residents at rate 2 or 6 (each ½)', 14, dim);
  const X0 = 92, X1 = 520, Y0 = 318, Y1 = 112, T = 1.75;
  const x = t => X0 + t / T * (X1 - X0), y = r => Y0 - (r - 2.8) / (4.1 - 2.8) * (Y0 - Y1);
  // shaded early excess
  let area = `M${f(x(0))} ${f(y(3))}`;
  for (let i = 0; i <= 140; i++) { const t = T * i / 140; area += ` L${f(x(t))} ${f(y(bF(t)))}`; }
  area += ` L${f(x(T))} ${f(y(3))} Z`;
  s += `<path d="${area}" fill="${cFresh}" fill-opacity=".16"/>`;
  s += `<path d="M${X0} ${f(y(3))} H${X1}" stroke="${cEq}" stroke-width="2.4" stroke-dasharray="7 5"/>`;
  let d = '';
  for (let i = 0; i <= 140; i++) { const t = T * i / 140; d += `${i ? 'L' : 'M'}${f(x(t))} ${f(y(bF(t)))} `; }
  s += `<path d="${d}" stroke="${cFresh}" stroke-width="3" fill="none" stroke-linejoin="round"/>`;
  s += `<path d="M${X0} ${Y0} H${X1}" stroke="${muted}" stroke-width="1.1"/><path d="M${X0} ${Y0} V${Y1 - 6}" stroke="${muted}" stroke-width="1.1"/>`;
  for (const r of [3, 4]) s += `<path d="M${X0 - 5} ${f(y(r))} h5" stroke="${muted}"/>` + text(X0 - 10, f(y(r) + 5), String(r), 13, dim, 'end');
  for (const t of [0, 0.5, 1, 1.5]) s += `<path d="M${f(x(t))} ${Y0} v5" stroke="${muted}"/>` + text(f(x(t)), Y0 + 20, String(t), 12.5, dim, 'middle');
  s += text(X1, Y0 + 40, 'time t', 12.5, dim, 'end');
  s += text(f(x(0.17)), f(y(3.86)), `fresh start: 3 + e${sup('−4t')}`, 16, cFresh, 'start', 'bold');
  s += text(f(x(0.95)), f(y(3) - 12), 'equilibrium: λ = 3', 16, cEq, 'start', 'bold');
  s += text(f(x(0.75)), f(y(3.62)), 'shaded: early excess, because an', 13.5, muted);
  s += text(f(x(0.75)), f(y(3.62) + 18), 'equilibrium snapshot over-represents', 13.5, muted);
  s += text(f(x(0.75)), f(y(3.62) + 36), 'slow residents (inspection paradox)', 13.5, muted);
  return s;
}

function right() {
  let s = '';
  const X0 = 640;
  s += text(X0, 46, 'So the starting condition changes who wins', 21, ink, 'start', 'bold');
  s += text(X0, 70, 'chance one better-option agent takes over (N → ∞), favourable rates ½ or 1', 14, dim);
  const A0 = 662, A1 = 1160, V0 = 0.745, V1 = 0.81;
  const ax = v => A0 + (v - V0) / (V1 - V0) * (A1 - A0);
  const AY = 330;
  s += `<path d="M${A0} ${AY} H${A1}" stroke="${muted}" stroke-width="1.1"/>`;
  for (const v of [0.75, 0.77, 0.79, 0.81]) s += `<path d="M${f(ax(v))} ${AY} v5" stroke="${muted}"/>` + text(f(ax(v)), AY + 20, v.toFixed(2), 12.5, dim, 'middle');
  const conj = ax(STARTS[3].v);
  s += `<path d="M${f(conj)} 96 V${AY}" stroke="${cConj}" stroke-width="1.6" stroke-dasharray="4 4"/>`;
  const rows = [118, 170, 222, 274];
  STARTS.forEach((st, i) => {
    const yy = rows[i], xx = ax(st.v);
    s += `<path d="M${f(conj)} ${yy} H${f(xx)}" stroke="${st.col}" stroke-opacity=".5" stroke-width="5" stroke-linecap="round"/>`;
    s += `<circle cx="${f(xx)}" cy="${yy}" r="7.5" fill="${st.col}" stroke="#1b1712" stroke-width="1.4"/>`;
    const right = xx > 980;
    const tx = right ? xx - 16 : xx + 16, anchor = right ? 'end' : 'start';
    s += text(f(tx), right ? yy - 13 : yy - 4, st.lab, 14.5, ink, anchor, 'bold');
    s += text(f(tx), right ? yy + 22 : yy + 14, `${st.v.toFixed(4)}${st.note ? ' · ' + st.note : ''}`, 12.5, muted, anchor);
  });
  s += text(A1, 384, 'Conjecture 2’s formula is exact only for the bottom start; fresh/fresh and mixed values numerical', 12, dim, 'end');
  return s;
}

const draw = () => left() + right() + `<path d="M600 30 V380" stroke="${muted}" stroke-opacity=".25"/>`;
const description = 'Banner for a paper resolving Conjecture 2 of Ganesh, Hauert and Valla on the noisy weighted voter model. Left: the mean update rate of the resident (worse-option) agents over time when resident rates are 2 or 6 with probability one half. From a fresh start the rate is exactly 3 + e^(−4t), starting at 4 and decaying to 3; in equilibrium it is constant at the harmonic mean lambda = 3. The shaded early excess arises because an equilibrium snapshot over-represents slow residents (the inspection paradox). Right: for favourable rates 1/2 or 1 in the same example, the large-population probability that a single better-option agent takes over, under four starting conditions, on an axis from 0.75 to 0.81. Equilibrium founders with fresh residents: 0.8030. Fresh founders with fresh residents, the start Conjecture 2 states: 0.7842. All agents in equilibrium, as in the source simulations: 7/9 = 0.7778, exact. Fresh founders with equilibrium residents: (3 + square root of 37)/12 = 0.7569, which equals the conjectured value. A dashed line marks the conjectured value; the conjecture is exact only for that last start. The fresh/fresh and mixed values are numerical; their ordering is proved.';

const thumbnailHero = () => '<div style="font-size:28px;letter-spacing:.06em;margin-bottom:22px">ONE AGENT · LARGE SWARM</div><div style="font-size:50px;line-height:1.3">0.784 fresh start<br>0.757 conjectured</div><div style="font-size:29px;margin-top:28px">Equilibrium start: 7/9 exactly</div><div style="font-size:23px;margin-top:24px;opacity:.8">Written proofs · exact certificates<br>Unrefereed candidate</div>';

module.exports = { draw, description, thumbnailHero, bF, STARTS };
