'use strict';
// Brief: explain the three exceptional BLBQ parameter lines and field-uniform
// exclusion off them (paper Theorem thm:blbq); reference: txgraffiti-order48-successor.
const txt=(x,y,s,n=25,c='#edf5ef',anchor='middle')=>`<text class="og-hide" x="${x}" y="${y}" text-anchor="${anchor}" font-family="Arial,sans-serif" font-size="${n}" fill="${c}">${s}</text>`;
function cover(){
 const teal='#55d4c0',gold='#f5bd60',cx=265,cy=188,r=136;
 let s=`<circle cx="${cx}" cy="${cy}" r="${r}" fill="${teal}" fill-opacity=".10" stroke="${teal}" stroke-width="1.5"/>
 <path d="M105 188 H425 M265 33 V343" stroke="#668383" stroke-width="1.5"/>
 <path d="M265 52 V324 M169 92 L361 284 M169 284 L361 92" stroke="${gold}" stroke-width="4"/>
 <circle cx="265" cy="188" r="7" fill="#17282c" stroke="#edf5ef" stroke-width="2"/>
 ${txt(444,199,'u',26)}${txt(288,40,'v',26)}${txt(371,76,'u = v',22,gold)}${txt(162,76,'u = −v',22,gold)}${txt(267,361,'Three lines · zero-field current',25,gold)}
 <path d="M484 72 V329" stroke="#577170" stroke-width="1"/>
 ${txt(838,63,'OFF THE LINES',23,teal)}
 ${txt(838,120,'u(u − v)(u + v) ≠ 0',38)}
 <path d="M594 232 H1084" stroke="#c7d6d2" stroke-width="5"/>`;
 for(let i=0;i<7;i++){const x=594+i*81.5,angle=[-.7,.35,-.2,.8,-.5,.15,-.8][i],dx=28*Math.sin(angle),dy=-37*Math.cos(angle);s+=`<circle cx="${x}" cy="232" r="12" fill="#17282c" stroke="${teal}" stroke-width="3"/><path d="M${x} 211 l${dx} ${dy} m-6 10 l6 -10 l6 10" fill="none" stroke="${gold}" stroke-width="2.5"/>`;}
 s+=txt(838,281,'Fields vary. The obstruction remains.',26)+txt(838,331,'No charges of range 3 ≤ k ≤ ⌊N/2⌋',26,teal)+txt(838,373,'Periodic N ≥ 6 · not a claim of thermalisation',20,'#c5d3cf');return s;
}
module.exports={cover};
