'use strict';
// Schematic normal-form reduction; counts from manuscript Theorem 1.1.
exports.draw=(a,b)=>{
 const text=(x,y,t,n=25,c='#f6eee8')=>`<text class="og-hide" x="${x}" y="${y}" fill="${c}" text-anchor="middle" font-family="Georgia,serif" font-size="${n}">${t}</text>`;
 let s=text(220,48,'Many descriptions',29);
 for(let k=0;k<3;k++)for(let j=0;j<6;j++){
  let x=58+j*48,y=108+k*86+14*Math.sin(j*1.2+k),end=128+k*78;
  s+=`<path d="M${x} ${y} C365 ${y} 350 ${end} 470 ${end}" fill="none" stroke="${k===1?b:a}" opacity=".16" stroke-width="1.3"/><circle cx="${x}" cy="${y}" r="${4+j%3}" fill="${k===1?b:a}" opacity=".85"/>`;
 }
 s+=text(220,363,'(κ, A, B)',34,a);
 s+=`<path d="M470 126 C565 126 535 205 585 205 M470 206 H585 M470 284 C565 284 535 205 585 205" fill="none" stroke="${a}" stroke-width="2.3"/>`;
 for(let k=0;k<3;k++)s+=`<circle cx="470" cy="${128+k*78}" r="11" fill="${k===1?b:a}" stroke="#f6eee8" stroke-width="1"/>`;
 s+=text(515,53,'Identify relabellings',26)+text(515,354,'ordinary isomorphism',21);
 s+=`<path d="M603 80 V324" stroke="${a}" opacity=".3"/>`;
 s+=text(898,51,'Distinct structures',30);
 s+=text(727,116,'p = 2',29,a)+text(970,116,'odd primes',29,b);
 s+=text(727,208,'11',72,a)+text(970,208,'p + 10',66,b);
 s+=text(727,265,'6 + 5 groups',25)+text(970,265,'p + 5 + 5 groups',25);
 s+=text(887,331,'Centrally nilpotent right Bol loops',24);
 s+=text(892,370,'order p³ · counts include groups',22);
 return s;
};
