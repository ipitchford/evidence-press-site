'use strict';
// Logical global-to-local proof schematic, not computed shapes or a time evolution.
exports.draw=(a,b)=>{
 const text=(x,y,s,n=24,c='#f3eee7')=>`<text class="og-hide" x="${x}" y="${y}" text-anchor="middle" fill="${c}" font-family="Georgia,serif" font-size="${n}">${s}</text>`;
 let s='';
 for(let j=0;j<3;j++){
  const cx=180+j*410,cy=190,r=92;
  if(j===0){for(let k=0;k<3;k++){let d='';for(let i=0;i<=160;i++){let t=i/160*2*Math.PI,rr=r*(1+.13*Math.cos(3*t+k*1.1)+.09*Math.sin(5*t));d+=(i?'L':'M')+(cx+rr*Math.cos(t)).toFixed(2)+' '+(cy+rr*.84*Math.sin(t)).toFixed(2);}s+=`<path d="${d}Z" fill="${a}" fill-opacity=".025" stroke="${a}" stroke-width="${k===1?2.5:1}" opacity="${k===1?.9:.35}"/>`;}}
  else {s+=`<circle cx="${cx}" cy="${cy}" r="${r}" fill="${a}" fill-opacity=".06" stroke="${j===2?b:a}" stroke-width="3"/>`;for(let k of [-.65,-.32,0,.32,.65])s+=`<ellipse cx="${cx}" cy="${cy+k*r}" rx="${r*Math.sqrt(1-k*k)}" ry="${15*(1-Math.abs(k))}" fill="none" stroke="${a}" stroke-width="1" opacity=".35"/>`;s+=`<ellipse cx="${cx}" cy="${cy}" rx="35" ry="92" fill="none" stroke="${a}" opacity=".35"/>`;if(j===1)s+=`<circle cx="${cx}" cy="${cy}" r="108" fill="none" stroke="${a}" stroke-dasharray="5 7" opacity=".5"/>`;}
 }
 for(let x of [320,730])s+=`<path d="M${x} 190 h110 l-12 -7 m12 7 l-12 7" fill="none" stroke="${b}" stroke-width="2.5"/>`;
 s+=text(180,55,'All admissible shapes',25)+text(590,55,'Every minimiser is near a ball',25)+text(1000,55,'Only the ball remains',25,b);
 s+=text(180,330,'Fixed volume',24)+text(590,330,'Global localisation',24)+text(1000,330,'Local rigidity',24,b);
 s+=text(600,385,'Weak repulsion: 0 &lt; q &lt; q₀   ·   schematic proof implications',20,'#d5cdd2');
 return s;
};
