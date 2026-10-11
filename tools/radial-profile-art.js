'use strict';
// Exact mean profiles only: no invented random realization or variance curve.
exports.draw=(a,b)=>{
 const w='#f6f0e7',m='#d2ccd9';
 const text=(x,y,s,size=22,c=w)=>`<text class="og-hide" x="${x}" y="${y}" fill="${c}" font-family="Georgia,serif" font-size="${size}">${s.replaceAll('&','&amp;').replaceAll('<','&lt;')}</text>`;
 const phi=(alpha,x)=>Math.abs(x)<1e-6?.5:1/(-Math.expm1(-alpha*x))-1/(alpha*x);
 const curve=(left,alpha)=>Array.from({length:161},(_,i)=>{const x=-6+12*i/160;return `${i?'L':'M'}${left+i*1.65},${275-135*phi(alpha,x)}`}).join(' ');
 let s=`<g fill="none" stroke="${m}" opacity=".18"><path d="M405 70V320M800 70V320"/></g>`;
 s+=text(65,60,'α → 0',30,b)+text(450,60,'0 < α < 2',30,a)+text(850,60,'α → 2',30,b);
 s+=text(65,103,'One random fraction',24)+text(450,103,'Smooth, still random',24)+text(850,103,'A deterministic profile',24);
 s+=`<path d="M80 275H350M92 275V165H338V275" fill="none" stroke="${b}" stroke-width="3"/><path d="M92 275V165H338V275Z" fill="${b}" opacity=".12"/>`;
 s+=text(83,303,'0',19,m)+text(326,303,'1',19,m)+text(117,206,'U ∼ Uniform[0,1]',24,b);
 for(const [left,alpha,col] of [[460,1,a],[855,2,b]]){
  s+=`<path d="M${left} 135V275H${left+264}" fill="none" stroke="${m}" opacity=".45"/><path d="${curve(left,alpha)}" stroke="${col}" stroke-width="4" fill="none"/>`;
  s+=text(left+104,300,alpha===1?'mean Φ₁':'limit Φ₂',20,m);
 }
 s+=text(65,350,'variance → 1/12',25,b)+text(450,350,'variance > 0',25,a)+text(850,350,'variance → 0',25,b);
 s+=text(65,385,'Tail-index limits after the degree limit · curves show exact means, not sampled profiles',16,m);
 return s;
};
