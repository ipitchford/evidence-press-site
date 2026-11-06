'use strict';
// Exact source: paper Section 6, examples 4 and 6. Approved reference:
// finite-sample-affine-diversification: contrasting conclusions, shared scale.
const colors=['#efc77e','#88dbc5'];
const description='Two diagonal four-dimensional state pairs obey the same trace-distance cap 3/10 and operator-distance cap 1/5. At exact distances 3/10 and 1/5 the spectra are (2/3,1/3,0,0) and (7/15,7/30,3/20,3/20). The cap maximizer instead has trace distance 1/5, spectra (1,0,0,0) and (4/5,1/15,1/15,1/15), and a larger entropy gap. Bars are exact constructed probabilities, not measured data.';
const pairs=[[[2/3,1/3,0,0],[7/15,7/30,3/20,3/20]],[[1,0,0,0],[4/5,1/15,1/15,1/15]]];
function bars(cx,pair){return pair.map((p,row)=>p.map((v,i)=>{const x=cx+i*91+row*29;return `<rect x="${x}" y="${276-132*v}" width="25" height="${Math.max(1,132*v)}" rx="2" fill="${colors[row]}"/><path d="M${x} 280 h25" stroke="${colors[row]}" stroke-opacity=".45"/>`;}).join('')).join('');}
function draw(){return `<g font-family="Georgia,serif" fill="#faf3e5">
<text class="og-hide" x="600" y="43" text-anchor="middle" font-size="27">Same caps: trace distance ≤ 3/10 · operator distance ≤ 1/5</text>
<text class="og-hide" x="305" y="101" text-anchor="middle" font-size="35">Exact: 3/10</text><text class="og-hide" x="880" y="101" text-anchor="middle" font-size="35" fill="#88dbc5">Actual: 1/5</text>
<path d="M100 144 H475 M675 144 H1050" stroke="#fff" stroke-opacity=".12" stroke-dasharray="4 7"/>
<path d="M100 276 H475 M675 276 H1050" stroke="#faf3e5" stroke-opacity=".3"/>
${bars(125,pairs[0])}${bars(700,pairs[1])}
<text class="og-hide" x="89" y="150" text-anchor="end" font-size="18">1</text><text class="og-hide" x="89" y="281" text-anchor="end" font-size="18">0</text>
<text class="og-hide" x="305" y="331" text-anchor="middle" font-size="31">smaller entropy gap</text><text class="og-hide" x="880" y="331" text-anchor="middle" font-size="31" fill="#88dbc5">larger entropy gap</text>
<path d="M550 219 H620 m-12 -10 12 10 -12 10" fill="none" stroke="#faf3e5" stroke-width="3"/>
<g class="og-hide" font-family="Arial,sans-serif" font-size="18"><rect x="380" y="366" width="14" height="14" fill="#efc77e"/><text x="402" y="379">state 1</text><rect x="505" y="366" width="14" height="14" fill="#88dbc5"/><text x="527" y="379">state 2</text><text x="660" y="379">four eigenvalues per state</text></g></g>`;}
function thumbnailHero(){return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 270"><g fill="#fff5e7" text-anchor="middle" font-family="Georgia,serif"><text x="125" y="40" font-size="34">3/10</text><text x="375" y="40" font-size="34">1/5</text><path d="M225 120 H275 m-12 -10 12 10 -12 10" stroke="#fff5e7" stroke-width="3" fill="none"/>${[0,1].map(k=>pairs[k][1].map((v,i)=>`<rect x="${37+k*250+i*42}" y="${190-140*v}" width="28" height="${140*v}" fill="${colors[k]}"/>`).join('')).join('')}<text x="125" y="235" font-size="23">smaller gap</text><text x="375" y="235" font-size="23">larger gap</text></g></svg><div class="note">Same distance caps · a four-state example.<br>Smaller actual distance, larger entropy gap.</div>`;}
module.exports={draw,colors,description,thumbnailHero,pairs};
