'use strict';
// Theorem 1 and Lemma 2: a source-backed schematic, not simulation data.
exports.draw=(a,b)=>{
 const t=(x,y,s,size=25,c='#f5f1e9')=>`<text class="og-hide" x="${x}" y="${y}" text-anchor="middle" fill="${c}" font-family="Georgia,serif" font-size="${size}">${s}</text>`;
 let s=t(200,49,'Scalar stability',31)+t(594,49,'Positive weights',31)+t(996,49,'Operator bound',31);
 s+='<circle cx="200" cy="192" r="100" fill="none" stroke="'+a+'" stroke-width="2.5"/><path d="M80 192H320 M200 72V312" stroke="'+a+'" opacity=".2"/>';
 for(let j=0;j<24;j++){const q=j*Math.PI/12;s+=`<circle cx="${200+100*Math.cos(q)}" cy="${192+100*Math.sin(q)}" r="2" fill="${a}" opacity=".5"/>`;}
 s+=t(200,190,'p(z) ≠ 0',35,a)+t(200,225,'inside the polydisk',20)+t(200,348,'symmetric · multiaffine',24);
 s+=`<path d="M335 193H408 M396 184l12 9-12 9 M780 193H846 M834 184l12 9-12 9" fill="none" stroke="${b}" stroke-width="2"/>`;
 s+=t(594,102,'λℓ = 1 / [ n C(n, ℓ) ]',29,a);
 const rows=[{y:150,c:a,w:230,label:'symmetric part retained'},{y:204,c:b,w:138,label:'unwanted parts cancel'},{y:258,c:a,w:75,label:'positive matrix B ⪰ 0'}];
 rows.forEach((r,i)=>{s+=`<rect x="468" y="${r.y-17}" width="${r.w}" height="8" rx="4" fill="${r.c}" opacity="${1-i*.2}"/>`;s+=t(594,r.y+24,r.label,20);});
 s+=t(594,348,'all coefficient equations',24);
 s+=`<rect x="880" y="107" width="232" height="160" rx="14" fill="none" stroke="${a}" stroke-width="1.6"/>`;
 s+=t(996,172,'‖φ(T)‖ ≤ 1',38,a)+t(996,216,'φ = p̃ / p',29)+t(996,305,'every finite n',30,b)+t(996,348,'no extra monomial',24);
 return s;
};
