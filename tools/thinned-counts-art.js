'use strict';
const colors=['#e6c1ec','#efc778'];
const description='A birth–death chain with infinitely many states is observed through retained jumps. The cumulative edge-energy sum E determines the exact boundary: finite E gives finite stationary variance rate and a Brownian functional limit; infinite E gives divergent stationary variance per time. No universal claim about other weak limits is made.';
function draw(a,b){
 let s='<g fill="none" stroke-linecap="round">';
 for(let i=0;i<6;i++){let x=75+75*i;s+=`<circle cx="${x}" cy="125" r="17" stroke="${a}" stroke-width="3" fill="#201922"/>`;if(i<5)s+=`<path d="M${x+23} 115 H${x+51} M${x+51} 135 H${x+23}" stroke="${a}" stroke-width="2"/>`;}
 s+=`<path d="M477 125 H520" stroke="${a}" stroke-dasharray="4 8" stroke-width="3"/>`;
 for(let i=0;i<8;i++){const x=80+i*57;const kept=[0,2,3,6].includes(i);s+=`<path d="M${x} 205 V${kept?254:229}" stroke="${kept?b:'#a08d9e'}" stroke-width="${kept?5:2}" opacity="${kept?1:.4}"/>`;}
 s+=`<path d="M565 190 H640 M625 180 L640 190 L625 200" stroke="#efe6ef" stroke-width="2"/><path d="M692 195 H1110" stroke="#efe6ef" stroke-opacity=".3"/>`;
 s+='</g>';
 s+=`<g font-family="Georgia" fill="#fff3f5"><text x="280" y="60" text-anchor="middle" font-size="29">Infinitely many states</text><text x="280" y="305" text-anchor="middle" font-size="29" fill="${b}">Only retained jumps count</text><text x="900" y="99" text-anchor="middle" font-size="36">E = Σ Hₖ² / cₖ</text></g>`;
 s+=`<g font-family="system-ui" font-size="25"><text x="710" y="161" fill="${a}">E finite</text><text x="885" y="161" fill="#fff3f5">Brownian limit</text><text x="710" y="244" fill="${b}">E infinite</text><text x="885" y="244" fill="#fff3f5">Var(Nₜ) / t → ∞</text><text x="600" y="370" text-anchor="middle" fill="#e5d6e3" font-size="20">FINITE RETAINED RATE · STATIONARY VARIANCE BOUNDARY</text></g>`;
 return s;
}
module.exports={colors,description,draw};
