'use strict';
// Exhaustive n=2 example from the manuscript; highlighted cells satisfy w_i=i.
exports.draw=(a,b)=>{
 const t=(x,y,s,size=24,c='#fff3e7')=>`<text class="og-hide" x="${x}" y="${y}" text-anchor="middle" font-family="Georgia,serif" font-size="${size}" fill="${c}">${s}</text>`;
 let out=t(285,48,'A match means value = position',26);
 out+=t(215,91,'1',20,a)+t(345,91,'2',20,a)+t(475,91,'weight',20,b);
 [[1,1],[1,2],[2,1]].forEach((w,r)=>{
   const y=132+r*84;
   w.forEach((v,j)=>{const x=215+j*130,on=v===j+1;
     out+=`<rect x="${x-43}" y="${y-30}" width="86" height="63" rx="13" fill="${on?b:'#ffffff'}" fill-opacity="${on?'.9':'.07'}" stroke="${on?b:a}" stroke-opacity=".6"/>`;
     out+=t(x,y+13,v,38,on?'#342038':'#fff3e7');
   });
   out+=t(475,y+12,[1,3,0][r],34,b);
 });
 out+=t(282,376,'All three Cayley words of length two',23);
 out+=`<path d="M566 77 L566 325" stroke="#ffffff" opacity=".18"/>`;
 out+=t(864,74,'Different counts. The same total.',28);
 out+=t(864,149,'1 + 3 + 0 = 4',49,b);
 out+=t(864,197,'weighted fixed points',24);
 out+=t(864,270,'8 ÷ 2 = 4',43,a);
 out+=t(864,315,'total letter sum ÷ word length',23);
 out+=t(864,371,'The identity holds at every positive length',21);
 return out;
};
exports.thumbnailHero=()=>'<div class="eq-label">MATCH VALUE TO POSITION</div><div class="hero-title">1 + 3 + 0<br>= 4</div><div class="note">Words 11 · 12 · 21<br>One identity at every length.</div><div class="eq-foot">weighted fixed points · exact n = 2 example</div>';
