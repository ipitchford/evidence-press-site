'use strict';
const text=(x,y,t,n=24,c='#faf1e7',anchor='middle')=>`<text class="og-hide" x="${x}" y="${y}" text-anchor="${anchor}" font-family="Georgia,serif" font-size="${n}" fill="${c}">${t}</text>`;
exports.draw=(a,b)=>{
 let s=text(255,42,'DIFFERENT MATERIALS',23,a);
 s+=`<path d="M60 92Q255 58 450 92L450 191Q255 166 60 191Z" fill="${a}" fill-opacity=".12" stroke="${a}" stroke-width="2"/><path d="M60 209Q255 184 450 209L450 310Q255 276 60 310Z" fill="${b}" fill-opacity=".13" stroke="${b}" stroke-width="2"/>`;
 for(let i=0;i<8;i++){let x=82+i*49;s+=`<path d="M${x} 104v46M${x} 244v43" stroke="${i%2?a:b}" opacity=".25"/>`;}
 s+=text(255,140,'λ = 2     μ = 1',31,a)+text(255,265,'λ = 1     μ = 2',31,b)+text(255,350,'same λ + μ = 3',30)+text(255,385,'interface schematic',18);
 s+=`<path d="M480 200H544l-13-9m13 9l-13 9" fill="none" stroke="${a}" stroke-width="2.5"/>`;
 s+=text(750,42,'LEADING CROSS RESPONSE',23,a)+text(750,119,'1 / (2 × 3) − 1 / (2 × 3)',32)+text(750,185,'= 0',53,b);
 s+=`<path d="M577 222H1130" stroke="${a}" opacity=".3"/>`;
 s+=text(854,271,'compact ≠ zero',41,a)+text(854,321,'lower-order coupling can remain',25)+text(854,370,'contact existence • no small-friction bound',23,b);
 return s;
};
