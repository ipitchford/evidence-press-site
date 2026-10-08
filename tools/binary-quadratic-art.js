'use strict';
exports.draw=(a,b)=>{
  const text=(x,y,s,size=23,c='#f7f2e9')=>`<text class="og-hide" x="${x}" y="${y}" fill="${c}" font-family="Georgia,serif" font-size="${size}">${s}</text>`;
  let s=text(55,52,'ALL DISCLOSURES → FOUR ENDPOINT TESTS',19,a);
  s+=text(55,99,'Concavity does the work',30);
  s+=`<path d="M70 288 H690 M95 305 V128" fill="none" stroke="#c5c9d2" opacity=".55" stroke-width="2"/>`;
  s+=`<path d="M105 240 Q380 32 660 221 L660 288 H105 Z" fill="${a}" opacity=".10"/><path d="M105 240 Q380 32 660 221" fill="none" stroke="${a}" stroke-width="5"/>`;
  for(const [x,y] of [[105,240],[660,221]])s+=`<circle cx="${x}" cy="${y}" r="9" fill="${b}"/><circle cx="${x}" cy="${y}" r="17" fill="none" stroke="${b}" opacity=".35"/>`;
  s+=text(100,323,'0',19)+text(650,323,'1',19)+text(280,323,'disclosure posterior',18,'#d2d6df');
  s+=text(120,269,'H(0) = M₁',19,b)+text(510,251,'H(1) = M₀',19,b);
  s+=`<rect x="742" y="65" width="407" height="243" rx="18" fill="#10151c" fill-opacity=".35" stroke="${b}" stroke-opacity=".7"/>`;
  s+=text(778,112,'BOTH SIGNAL ORDERS',17,b)+text(778,167,'Mₐ₀ ≥ 0     Mₐ₁ ≥ 0',26)+text(778,214,'Mᵦ₀ ≥ 0     Mᵦ₁ ≥ 0',26)+text(778,271,'necessary and sufficient',22,a);
  s+=text(55,373,'BINARY SIGNALS · QUADRATIC SCORE · SCHEMATIC RESIDUAL',16,'#d2d6df');
  return s;
};
