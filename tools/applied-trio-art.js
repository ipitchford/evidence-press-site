'use strict';
// Source-backed diagrams; no simulated data or inferred empirical performance.
const ink='#fff5e9', muted='#e2d9d0', a='#a9ebd3', b='#ffc184';
const text=(x,y,s,size=24,color=ink,anchor='start')=>`<text class="og-hide" x="${x}" y="${y}" fill="${color}" font-family="Arial,Helvetica,sans-serif" font-size="${size}" text-anchor="${anchor}">${s}</text>`;
function williamson(){
 let s=text(60,55,'Same coefficients. Preserved order.',31);
 // Two distinct update geometries joined to an exact order ladder.
 s+=`<path d="M85 258 L165 215 L245 170 L325 125" stroke="${b}" stroke-width="4" fill="none"/>`;
 for(let i=0;i<4;i++)s+=`<circle cx="${85+80*i}" cy="${258-44*i}" r="8" fill="${b}"/>`;
 s+=`<path d="M405 258 Q425 200 465 171 Q505 139 565 125" stroke="${a}" stroke-width="5" fill="none"/><path d="M405 258 Q414 210 465 171 Q500 145 565 125" stroke="${a}" stroke-width="35" fill="none" opacity=".08"/>`;
 for(const [x,y]of [[405,258],[428,207],[465,171],[565,125]])s+=`<circle cx="${x}" cy="${y}" r="8" fill="${a}"/>`;
 s+=text(205,315,'additive updates',24,b,'middle')+text(485,315,'exponential lift',24,a,'middle');
 s+=`<path d="M633 100 V310" stroke="${muted}" opacity=".2"/>`;
 s+=text(900,110,'classical order → lifted order',27,ink,'middle');
 for(let i=1;i<=6;i++){let x=700+(i-1)*76;s+=`<circle cx="${x}" cy="185" r="29" fill="${a}" fill-opacity=".12" stroke="${a}" stroke-width="2"/>`+text(x,195,i,30,a,'middle');}
 s+=text(900,267,'1 through 6: automatic',29,a,'middle')+text(900,319,'7: three additional tests',24,b,'middle');
 return s+text(60,375,'Update paths are schematic · theorem applies to the stated Williamson lift',20,muted);
}
function freshness(){
 let s=text(60,52,'Short service times set the scale',31);
 s+=`<path d="M90 310 H485 M90 310 V95" stroke="${muted}" opacity=".5" fill="none" stroke-width="2"/>`;
 const colors=[a,b,'#d6b5ef'];
 for(let k=1;k<=3;k++){
  let points=[];for(let i=0;i<=60;i++){let x=i/60;points.push(`${90+360*x},${310-195*x**k}`);}
  s+=`<polyline points="${points.join(' ')}" stroke="${colors[k-1]}" stroke-width="4" fill="none"/>`;
 }
 s+=text(90,350,'service requirement',22,muted)+text(120,94,'G(x) ∼ c xᵝ',29);
 s+=`<path d="M530 205 H625 M610 193 L627 205 L610 217" stroke="${ink}" stroke-width="3" fill="none" opacity=".6"/>`;
 s+=text(900,100,'age exponent',27,ink,'middle')+text(900,166,'β / (β + 1)',48,ink,'middle');
 for(let k=1;k<=3;k++){let x=730+(k-1)*165;s+=text(x,244,`β = ${k}`,24,colors[k-1],'middle')+text(x,300,['½','⅔','¾'][k-1],48,colors[k-1],'middle');}
 return s+text(60,382,'Power-law profiles illustrated · stationary queue · limit as load approaches one',20,muted);
}
function extinction(){
 let s=text(60,54,'Finite activity. A slower disappearance.',31);
 // Exact transition graph, without the distinct dependency edges.
 for(const [x,y,label]of [[95,160,'X'],[95,290,'Y'],[285,160,'I'],[465,290,'R']]){
 s+=`<circle cx="${x}" cy="${y}" r="31" fill="${a}" fill-opacity=".10" stroke="${label==='I'?b:a}" stroke-width="2"/>`+text(x,y+10,label,32,label==='I'?b:a,'middle');}
 s+=`<path d="M128 160 H250 M237 151 L252 160 L237 169 M120 290 H430 M417 281 L432 290 L417 299 M312 182 L436 267 M420 265 L438 269 L431 252" stroke="${muted}" fill="none" stroke-width="2.5"/>`;
 s+=text(280,368,'acyclic transitions · four states',23,muted,'middle');
 s+=`<path d="M555 93 V340" stroke="${muted}" opacity=".2"/>`;
 s+=text(875,130,'I(t) ∼ 18 / t²',48,b,'middle')+text(875,197,'total activity = log 2',29,a,'middle');
 s+=text(875,272,'not exponential extinction',28,ink,'middle')+text(875,326,'four states are minimal',25,muted,'middle');
 return s;
}
module.exports={williamson,freshness,extinction};
