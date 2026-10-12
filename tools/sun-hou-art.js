'use strict';
exports.thumbnailHero=()=>'<div class="eq-label">One exact circle</div><svg viewBox="0 0 500 400" style="width:100%;height:285px">'+exports.draw('#87d9ef','#fde047').split('<path d="M480')[0]+'</g></svg><div class="note">Every element used once.<br>Every neighbouring sum primitive.</div>';
// Exact F11 worked example from the manuscript; faint chords are actual edges.
exports.draw=(a,b)=>{
 const cycle=[4,9,10,8,0,2,6,7,1,5,3],prim=new Set([2,6,7,8]);
 const pts=cycle.map((v,i)=>{const t=-Math.PI/2+i*2*Math.PI/11;return [250+140*Math.cos(t),205+140*Math.sin(t),v];});
 let s='<g font-family="Georgia,serif"><text x="250" y="35" fill="#faf7f2" text-anchor="middle" font-size="25">Arithmetic modulo 11</text>';
 for(let i=0;i<11;i++)for(let j=i+1;j<11;j++)if(prim.has((pts[i][2]+pts[j][2])%11))s+=`<path d="M${pts[i][0]},${pts[i][1]} L${pts[j][0]},${pts[j][1]}" stroke="${a}" stroke-width="1.2" opacity=".17"/>`;
 for(let i=0;i<11;i++){const p=pts[i],q=pts[(i+1)%11];s+=`<path d="M${p[0]},${p[1]} L${q[0]},${q[1]}" stroke="${b}" stroke-width="4"/>`;}
 for(const [x,y,v] of pts)s+=`<circle cx="${x}" cy="${y}" r="18" fill="#17212a" stroke="${a}" stroke-width="2.5"/><text x="${x}" y="${y+8}" text-anchor="middle" fill="#faf7f2" font-size="24">${v}</text>`;
 s+=`<text x="250" y="193" text-anchor="middle" fill="#faf7f2" font-size="27">Neighbouring sums</text><text x="250" y="229" text-anchor="middle" fill="${b}" font-size="31">2 · 6 · 7 · 8</text><text x="250" y="381" text-anchor="middle" fill="#e1ddd7" font-size="22">Each generates every nonzero element</text>`;
 s+=`<path d="M480 65 V345" stroke="#eee" opacity=".2"/><text x="820" y="87" text-anchor="middle" fill="#faf7f2" font-size="37">Closing the finite remainder</text><text x="680" y="190" text-anchor="middle" fill="${a}" font-size="70">675</text><text x="820" y="183" text-anchor="middle" fill="#eee" font-size="44">+</text><text x="960" y="190" text-anchor="middle" fill="${b}" font-size="70">53</text><text x="680" y="237" text-anchor="middle" fill="#eee" font-size="25">exact criterion</text><text x="960" y="237" text-anchor="middle" fill="#eee" font-size="25">explicit cycles</text><path d="M600 275 H1040" stroke="#eee" opacity=".3"/><text x="820" y="328" text-anchor="middle" fill="#faf7f2" font-size="34">728 remaining field orders</text><text x="820" y="370" text-anchor="middle" fill="#dad6d2" font-size="22">The large-field range is inherited</text></g>`;
 return s;
};
