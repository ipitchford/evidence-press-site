'use strict';
// Heat-flow schematic, not a numerical velocity field. Theorem 2.1 fixed-domain orders.
exports.draw=(a,b)=>{
 let s=`<defs><linearGradient id="heat" x1="0" y1="0" x2="0" y2="1"><stop stop-color="${a}" stop-opacity=".08"/><stop offset=".52" stop-color="${b}" stop-opacity=".24"/><stop offset="1" stop-color="${a}" stop-opacity=".08"/></linearGradient></defs>`;
 s+=`<rect x="62" y="86" width="465" height="205" rx="12" fill="url(#heat)"/><path d="M62 86 H527 M62 291 H527" stroke="${a}" stroke-width="5"/>`;
 for(let i=0;i<6;i++){let x=102+i*75;s+=`<path d="M${x} 202 C${x-36} 175 ${x+36} 145 ${x} 112 M${x-7} 122 L${x} 112 L${x+7} 122" fill="none" stroke="${b}" stroke-width="2.5" opacity=".8"/><path d="M${x} 220 V270 m-7 -10 l7 10 l7 -10" fill="none" stroke="${a}" stroke-width="2.2"/>`;}
 for(let i=0;i<18;i++){let x=82+i*25;s+=`<circle cx="${x}" cy="207" r="2.4" fill="${b}"/>`;}
 const t=(x,y,text,size=21,color='#fff3df')=>`<text class="og-hide" x="${x}" y="${y}" font-family="Georgia,serif" font-size="${size}" fill="${color}">${text}</text>`;
 s+=t(62,53,'Heat made inside. Heat lost at both plates.',23)+t(185,327,'bottom heat loss F_B',25,a)+t(112,371,'uniform heating · schematic',17,'#ddd3c4');
 s+=`<path d="M584 65 V332" stroke="#eee" opacity=".18"/>`;
 s+=t(636,67,'GUARANTEED LARGE-R ORDERS',18,'#ddd3c4')+t(636,118,'No-slip plates',23,a)+t(636,164,'R⁻²ᐟ³  →  (R log R)⁻¹ᐟ³',33)+t(636,230,'Stress-free plates',23,b)+t(636,276,'R⁻⁴⁰ᐟ²⁹  →  R⁻¹ᐟ²',33)+t(636,354,'infinite Prandtl · fixed horizontal periods',19,'#ddd3c4');
 return s;
};
