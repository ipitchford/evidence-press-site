'use strict';
// Exact F11 example and forced obstruction; not a simulated generic network.
exports.draw=(blue,gold)=>{
 const text=(x,y,s,size=22,color='#f1eee8')=>`<text class="og-hide" x="${x}" y="${y}" text-anchor="middle" font-family="Georgia,serif" font-size="${size}" fill="${color}">${s}</text>`;
 const node=(x,y,n,c)=>`<circle cx="${x}" cy="${y}" r="18" fill="#17202c" stroke="${c}" stroke-width="2.5"/>`+text(x,y+7,n,21);
 const line=(a,b,c,w=3,opacity=1)=>`<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="${c}" stroke-width="${w}" opacity="${opacity}"/>`;
 const cycle=[9,2,6,3,4,10,5,1,7,8],pos=cycle.map((_,i)=>[245+125*Math.cos(-Math.PI/2+i*Math.PI/5),204+125*Math.sin(-Math.PI/2+i*Math.PI/5)]);
 const prim=new Set([2,6,7,8]);for(let i=0;i<10;i++)if(!prim.has((1+cycle[i]*cycle[(i+1)%10])%11))throw Error('Invalid banner cycle');
 let s=text(245,36,'a = 1 · a circle exists',26,blue);
 for(let i=0;i<10;i++)s+=line(pos[i],pos[(i+1)%10],blue,4);
 s+=text(245,197,'1 + xy',30)+text(245,225,'primitive mod 11',19,blue);
 pos.forEach((p,i)=>s+=node(...p,cycle[i],blue));
 s+=text(245,378,'All ten nonzero elements, once each',19);
 s+=`<line x1="477" y1="64" x2="477" y2="337" stroke="#ffffff" opacity=".18"/>`;
 s+=text(630,147,'Same field.',27)+text(630,184,'One exception.',27)+text(630,244,'2 → 3 → 9 → 8 → 2',21,gold)+text(630,278,'Four forced links',19,gold);
 const p={2:[935,99],3:[1052,196],9:[935,293],8:[818,196]};
 [[2,3],[3,9],[9,8],[8,2]].forEach(([a,b])=>s+=line(p[a],p[b],gold,5));
 s+=text(935,36,'a = 2 · forced closure',26,gold);
 Object.entries(p).forEach(([n,v])=>s+=node(...v,n,gold));
 s+=text(935,187,'No room for',23)+text(935,216,'the other six',23);
 s+=text(935,378,'The unique obstruction (q, a) = (11, 2)',19);
 return s;
};
exports.thumbnailHero=()=>`<div class="eq-label">the exceptional pair: q = 11, a = 2</div><svg viewBox="0 0 360 230" style="width:100%;height:230px"><path d="M180 25 L280 110 L180 195 L80 110 Z" fill="none" stroke="currentColor" stroke-width="4"/>${[[180,25,2],[280,110,3],[180,195,9],[80,110,8]].map(([x,y,n])=>`<circle cx="${x}" cy="${y}" r="22" fill="#21102f" stroke="currentColor" stroke-width="2"/><text x="${x}" y="${y+8}" text-anchor="middle" fill="#fff" font-size="24">${n}</text>`).join('')}</svg><div class="note">Four forced edges close a circle.<br>The other six vertices cannot join.</div>`;
