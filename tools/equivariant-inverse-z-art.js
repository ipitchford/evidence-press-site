'use strict';
// Brief: symmetry types form separate symmetric strings, not just a unimodal
// total. Exact source: paper Boolean rank-two C2 example, Y=epsilon+(1+epsilon)t+epsilon t².
// Reference: cyclicity-support-fusion-atlas.svg: ordered mathematical objects
// carry the explanation. Lines here encode a chosen abstract string, not geometry.
const colors=['#f2c56f','#8de0ca'];
const description='Boolean rank-two matroid with C2 swapping its elements. The sign representation occurs once in degrees zero, one and two, shown by a gold three-node string. The trivial representation occurs only in degree one, shown by a mint singleton. Total dimensions are one, two, one. This is an abstract representation decomposition, not geometric cohomology.';
function draw(){
 const xs=[350,650,950];
 return `<g font-family="Georgia,serif" fill="#f7f0e4">
 ${xs.map((x,i)=>`<path d="M${x} 87 V292" stroke="#f7f0e4" stroke-opacity=".12" stroke-width="2"/><text class="og-hide" x="${x}" y="57" text-anchor="middle" font-size="31">degree ${i}</text>`).join('')}
 <path d="M350 226 H950" stroke="#f2c56f" stroke-opacity=".14" stroke-width="38" stroke-linecap="round"/>
 <path d="M350 226 H950" stroke="#f2c56f" stroke-width="5"/>
 ${xs.map(x=>`<circle cx="${x}" cy="226" r="26" fill="#f2c56f"/><circle cx="${x}" cy="226" r="9" fill="#302319"/>`).join('')}
 <circle cx="650" cy="128" r="28" fill="#8de0ca"/><circle cx="650" cy="128" r="10" fill="#203e36"/>
 <text class="og-hide" x="63" y="138" font-size="30" fill="#8de0ca">trivial</text>
 <text class="og-hide" x="63" y="237" font-size="30" fill="#f2c56f">sign</text>
 <path d="M62 298 H1090" stroke="#f7f0e4" stroke-opacity=".18"/>
 <text class="og-hide" x="63" y="345" font-size="26">total</text>
 ${xs.map((x,i)=>`<text class="og-hide" x="${x}" y="348" text-anchor="middle" font-size="42">${[1,2,1][i]}</text>`).join('')}
 <text class="og-hide" x="1090" y="385" text-anchor="end" font-family="Arial,sans-serif" font-size="17" fill="#e6ded1">Boolean rank 2 · C₂ symmetry · abstract strings</text>
 </g>`;
}
function thumbnailHero(){return `<svg viewBox="0 0 500 260" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Sign string 1,1,1 and trivial singleton 0,1,0"><path d="M80 160 H420" stroke="#f2c56f" stroke-width="6"/>${[80,250,420].map(x=>`<circle cx="${x}" cy="160" r="20" fill="#f2c56f"/>`).join('')}<circle cx="250" cy="80" r="21" fill="#8de0ca"/>${[80,250,420].map((x,i)=>`<text x="${x}" y="235" text-anchor="middle" font-size="38" fill="#fff4e4">${[1,2,1][i]}</text>`).join('')}</svg><div class="note">Each symmetry type, separately.<br>Boolean rank-two example.</div>`;}
module.exports={draw,colors,description,thumbnailHero};
