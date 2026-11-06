'use strict';
// Actual iterates of J_(B/2) from Proposition 2; floating drawing, not a certificate.
const description='Eighty updates of the exact planar witness spiral towards zero. Its squared residual at index 20 is approximately 0.00305135, exceeding the proposed 0.0025 bound. Convergence survives; the proposed guarantee does not.';
function draw(){
 const pts=[];let x=1,y=0;
 for(let k=0;k<=80;k++){pts.push([240+158*x,200-158*y]);const nx=(10100*x+700*y)/10250;y=(-700*x+10100*y)/10250;x=nx;}
 const p=pts.map((v,i)=>(i?'L':'M')+v.map(n=>n.toFixed(3)).join(' ')).join(' ');
 return `<g font-family="Arial,sans-serif" fill="#fff3e4">
 <g stroke="#e8bca2" fill="none" stroke-opacity=".17"><circle cx="240" cy="200" r="158"/><circle cx="240" cy="200" r="105"/><circle cx="240" cy="200" r="52"/><path d="M60 200H420M240 20V380"/></g>
 <path d="${p}" fill="none" stroke="#efc47b" stroke-width="3.5" stroke-linejoin="round"/>
 ${pts.filter((v,i)=>i%4===0).map((v,i)=>`<circle cx="${v[0]}" cy="${v[1]}" r="${i===0?5:2.6}" fill="#fff0cc"/>`).join('')}
 <circle cx="240" cy="200" r="4" fill="#f2a9b9"/>
 <g class="og-hide"><text x="68" y="35" font-size="16" letter-spacing="2" fill="#e1b8ae">THE EXACT PLANAR WITNESS</text>
 <text x="70" y="382" font-size="17" fill="#dabfb8">80 updates · still converging</text>
 <path d="M470 58V342" stroke="#e4ada5" stroke-opacity=".25"/>
 <text x="520" y="78" font-size="17" letter-spacing="2" fill="#dfb6aa">AT THE TWENTIETH ITERATE</text>
 <text x="518" y="154" font-size="62" font-family="Georgia,serif" fill="#efc47b">0.00305135</text>
 <text x="520" y="187" font-size="22" fill="#f2d9cd">squared residual</text>
 <path d="M520 213H1100" stroke="#e4ada5" stroke-opacity=".25"/>
 <text x="520" y="264" font-size="39" font-family="Georgia,serif" fill="#e8b2bd">0.0025</text>
 <text x="700" y="260" font-size="22" fill="#e8b2bd">proposed upper bound</text>
 <text x="520" y="324" font-size="27">Convergence survives.</text>
 <text x="520" y="361" font-size="27" fill="#efc47b">The guarantee does not.</text></g></g>`;
}
function thumbnailHero(){return '<div style="text-align:center;font-size:26px;line-height:1.4">THE PLANAR COUNTEREXAMPLE<div style="font:64px Georgia;color:var(--accent);margin:24px 0">0.00305135</div><div style="font-size:31px">above the 0.0025 bound</div><div style="font-size:22px;margin-top:28px">Convergence survives.<br>The guarantee does not.</div></div>';}
module.exports={draw,description,thumbnailHero,colors:['#efc47b','#e8b2bd']};
