'use strict';
// Exact H_4 = K_{4,4} minus two edges incident to one vertex.
// On the missing-edge star: C has diagonal (8,13,13), edge entries -7,
// and z=(9,5,5), so Cz=(2,2,2). Remaining isolated rows have z=1, Cz=18.
exports.colors = ['#a7d8ee', '#f1bd76'];
exports.description = 'The eight-vertex graph H4 has fourteen cross links: the highlighted vertex retains two of four. Its two missing links form a star. Weights 9 at the centre and 5 at both ends give positive residual 2 at every star vertex; the other weights are 1 with residual 18. A weighted certificate succeeds beyond the strict-majority partition class.';
exports.draw = (a,b) => {
 const text=(x,y,t,size=28,c='#f5f1e9',anchor='middle')=>`<text class="og-hide" x="${x}" y="${y}" text-anchor="${anchor}" fill="${c}" font-family="Georgia,serif" font-size="${size}">${t}</text>`;
 const ys=[88,162,236,310]; let s='';
 s+=text(265,42,'Two links out of four',31);
 for(let i=0;i<4;i++)for(let j=0;j<4;j++){
  const missing=i===0&&j>=2;
  s+=`<path d="M115 ${ys[i]} L415 ${ys[j]}" stroke="${missing?b:a}" stroke-width="${missing?3:2}" opacity="${missing?.8:.34}" ${missing?'stroke-dasharray="8 8"':''} fill="none"/>`;
 }
 for(let i=0;i<4;i++)for(const x of [115,415]){
  const special=x===115&&i===0;
  s+=`<circle cx="${x}" cy="${ys[i]}" r="${special?17:11}" fill="${special?b:a}" stroke="#18303a" stroke-width="3"/>`;
 }
 s+=text(75,97,'u',28,b)+text(265,372,'H₄ · 14 links',30);
 s+=`<path d="M490 202H575 M560 190l15 12-15 12" fill="none" stroke="${a}" stroke-width="2.5" opacity=".65"/>`;
 s+=text(860,44,'Positive weighted certificate',31);
 for(const y of [110,295])s+=`<path d="M710 202L1025 ${y}" stroke="${b}" stroke-width="4" stroke-dasharray="9 7" fill="none"/>`;
 for(const [x,y,w] of [[710,202,9],[1025,110,5],[1025,295,5]]){
  s+=`<circle cx="${x}" cy="${y}" r="31" fill="${b}" stroke="#18303a" stroke-width="3"/>`;
  s+=text(x,y+11,w,33,'#172b34');
 }
 s+=text(864,217,'Cz &gt; 0',43,a);
 s+=text(860,372,'weights 9 : 5 : 5',30);
 return s;
};
