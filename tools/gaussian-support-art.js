'use strict';
// Source: manuscript section 6.1, exact rank-one formula (6.9)-(6.10).
// Brief: the same entropy can cause different joint-plan error when supports
// are nearly perpendicular; the dimensionless ratio epsilon/c governs it.
// Design reference: finite-sample-affine-diversification, geometry and contrast.
const colors=['#f4cb86','#a9dfd8'];
const error=u=>4-2*Math.sqrt(2+4/(Math.sqrt(4+u*u)+u));
const description='Two unit-variance Gaussian supports are represented by almost perpendicular lines. The exact rank-one squared Wasserstein joint-plan error is plotted against u, entropy divided by positive support cosine c. At u equal to one the squared distance is approximately 0.402. The curve is calculated directly from the manuscript formula, not simulated. Exactly zero cosine has a different selected limit and is excluded from this curve.';
function curve(x,y,w,h,max=4){return Array.from({length:121},(_,i)=>{const u=max*i/120;return `${i?'L':'M'}${(x+w*u/max).toFixed(2)},${(y-h*error(u)).toFixed(2)}`;}).join(' ');}
function draw(){return `<g font-family="Georgia,serif" fill="#fbf3e5">
<text x="235" y="58" text-anchor="middle" font-size="28">nearly perpendicular supports</text>
<path d="M65 225 H430" stroke="#f4cb86" stroke-width="8" stroke-linecap="round"/>
<path d="M215 330 L280 90" stroke="#a9dfd8" stroke-width="8" stroke-linecap="round"/>
<path d="M303 225 A56 56 0 0 0 262 171" fill="none" stroke="#fbf3e5" stroke-width="2" opacity=".7"/>
<circle cx="243.4" cy="225" r="6" fill="#fbf3e5"/>
<text x="325" y="187" font-size="28">c ≪ 1</text>
<text x="240" y="375" text-anchor="middle" font-size="27">small overlap · weak interaction</text>
<path d="M472 210 H535 M526 201 L535 210 L526 219" fill="none" stroke="#fbf3e5" stroke-width="2" opacity=".5"/>
<text x="850" y="58" text-anchor="middle" font-size="28">squared joint-plan error</text>
<path d="M610 310 H1120 M610 310 V95" fill="none" stroke="#fbf3e5" stroke-width="2" opacity=".55"/>
<path d="${curve(610,310,490,235)}" fill="none" stroke="#f4cb86" stroke-width="5" stroke-linecap="round"/>
<path d="M732.5 310 V215.6 H610" fill="none" stroke="#a9dfd8" stroke-width="2" stroke-dasharray="5 7"/>
<circle cx="732.5" cy="${310-235*error(1)}" r="7" fill="#a9dfd8"/>
<text x="750" y="225" font-size="32" fill="#a9dfd8">0.402</text>
<text x="592" y="319" text-anchor="end" font-size="24">0</text>
<text x="732.5" y="342" text-anchor="middle" font-size="25">1</text>
<text x="1100" y="342" text-anchor="middle" font-size="25">4</text>
<text x="855" y="380" text-anchor="middle" font-size="32">u = ε / c</text>
</g>`;}
function thumbnailHero(){return `<svg viewBox="0 0 500 290" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Exact squared error curve against entropy divided by support cosine"><path d="M40 220 H470 M40 220 V35" fill="none" stroke="#fbf3e5" opacity=".55" stroke-width="2"/><path d="${curve(40,220,410,205)}" fill="none" stroke="#f4cb86" stroke-width="6"/><circle cx="142.5" cy="${220-205*error(1)}" r="7" fill="#a9dfd8"/><text x="164" y="154" fill="#a9dfd8" font-size="39">D = 0.402</text><text x="250" y="270" fill="#fbf3e5" text-anchor="middle" font-size="38">ε / c = 1</text></svg><div class="note">Small entropy alone is not enough.<br>Exact rank-one example; positive cosine c.</div>`;}
module.exports={draw,colors,description,thumbnailHero};
