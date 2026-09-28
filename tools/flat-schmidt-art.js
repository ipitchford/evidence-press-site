'use strict';
// Theorem 5.1 and Proposition 5.3: fixed short spectra, changing long-chain gap.
// Reference: finite-sample-affine-diversification, its bound/endpoint contrast.
const description='Every member has three-site energies 0, 1/2, 1 and 3/2, with multiplicities 21, 1, 4 and 1. Along theta from zero to pi/2 the plotted uniform lower bound is cos squared theta divided by six, positive before the endpoint. At the endpoint the exact finite-chain gap is 1 minus cos(pi/N), tending to zero as N grows. The curve is a bound, not the actual gap.';
const text=(x,y,s,n=26,c='#e9f2ef',anchor='middle')=>`<text class="og-hide" x="${x}" y="${y}" text-anchor="${anchor}" font-family="Arial,sans-serif" font-size="${n}" fill="${c}">${s}</text>`;
function cover(){
 const teal='#61d9c0',gold='#f0c274';let s=text(260,47,'SAME THREE-SITE SPECTRUM',25,teal);
 for(const [e,m]of [[0,21],[.5,1],[1,4],[1.5,1]]){const y=289-e*124;s+=`<path d="M132 ${y} H251 M294 ${y} H413" stroke="${teal}" stroke-width="4"/><path d="M251 ${y} H294" stroke="#d0ddd8" stroke-dasharray="3 5" opacity=".35"/>`+text(105,y+8,e===.5?'½':e===1.5?'³⁄₂':String(e),27,'#e9f2ef','end')+text(445,y+8,'×'+m,25,'#bccdc7');}
 s+=text(271,335,'Energies and multiplicities agree',24)+`<path d="M511 73 V333" stroke="#73918a" opacity=".5"/>`+text(852,47,'DIFFERENT LONG-CHAIN GAPS',25,gold);
 const pts=Array.from({length:101},(_,i)=>{const x=641+i*4.22,y=290-178*Math.cos(i*Math.PI/200)**2;return `${x.toFixed(2)},${y.toFixed(2)}`;});
 s+=`<path d="M641 290 L${pts.join(' L')} L1063 290 Z" fill="${teal}" opacity=".11"/><path d="M641 92 V290 H1087" fill="none" stroke="#b9cdc5" stroke-width="1.8"/><polyline points="${pts.join(' ')}" fill="none" stroke="${teal}" stroke-width="4"/>`;
 s+=text(622,120,'⅙',26,'#cbd9d4','end')+text(641,322,'0',25)+text(1063,322,'π/2',25)+text(1110,296,'θ',27)+text(875,107,'γ ≥ cos²θ / 6',33,teal)+text(860,144,'uniform lower bound',22,teal);
 s+=`<circle cx="1063" cy="290" r="7" fill="${gold}" stroke="#18282d" stroke-width="2"/>`+text(856,365,'Endpoint: γₙ = 1 − cos(π/N)',29,gold);
 return s;
}
module.exports={cover,description};
