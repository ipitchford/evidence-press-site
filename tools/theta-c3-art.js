'use strict';
// Exact theta(4,3,3) and the manuscript's weighted collision example.
exports.draw=(blue,gold)=>{
 const text=(x,y,s,size=24,color='#f4eee7')=>`<text class="og-hide" x="${x}" y="${y}" text-anchor="middle" font-family="Georgia,serif" font-size="${size}" fill="${color}">${s}</text>`;
 let out=text(275,45,'Three routes. One positivity theorem.',27);
 const routes=[[[65,208],[155,102],[275,72],[395,102],[485,208]],[[65,208],[205,208],[345,208],[485,208]],[[65,208],[205,315],[345,315],[485,208]]];
 routes.forEach((ps,i)=>{const c=i===2?gold:blue;out+=`<polyline points="${ps.map(p=>p.join(',')).join(' ')}" fill="none" stroke="${c}" stroke-width="4"/>`;ps.slice(1,-1).forEach(([x,y])=>out+=`<circle cx="${x}" cy="${y}" r="7" fill="${c}"/>`);});
 for(const x of [65,485])out+=`<circle cx="${x}" cy="208" r="11" fill="#f4eee7"/>`;
 out+=text(275,179,'b ≥ 3',25,blue)+text(275,117,'a ≥ b',25,blue)+text(275,354,'3 edges',25,gold);
 out+=`<line x1="550" y1="65" x2="550" y2="337" stroke="#ffffff" opacity=".18"/>`;
 out+=text(860,55,'Rearrange terms, preserve the function',25);
 out+=text(740,126,'(2, 2, 5)',25,gold)+text(990,126,'(2, 5, 2)',25,gold);
 out+=`<path d="M740 146 Q740 190 850 202 M990 146 Q990 190 870 202" fill="none" stroke="${gold}" stroke-width="3"/>`;
 out+=text(860,236,'(5, 2, 2)',30,blue)+text(860,302,'60 − 8 − 8 = 44',38,blue)+text(860,352,'The whole weighted group stays positive',21);
 return out;
};
exports.thumbnailHero=()=>'<div class="eq-label">all a ≥ b ≥ 3</div><svg viewBox="0 0 360 190" style="width:100%;height:190px"><path d="M30 95 Q180 -35 330 95 M30 95 L330 95 M30 95 Q180 225 330 95" fill="none" stroke="currentColor" stroke-width="4"/><circle cx="30" cy="95" r="9" fill="currentColor"/><circle cx="330" cy="95" r="9" fill="currentColor"/></svg><div class="note">Three-edge shortest path.<br>Nonnegative elementary coefficients.</div>';
