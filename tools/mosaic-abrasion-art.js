'use strict';
const text=(x,y,t,n=22,c='#f9f3e9',anchor='middle')=>`<text class="og-hide" x="${x}" y="${y}" text-anchor="${anchor}" font-family="Georgia,serif" font-size="${n}" fill="${c}">${t}</text>`;
exports.descriptions={mosaics:'A schematic tetrahedral insertion keeps its four boundary vertices and adds 62 interior vertices. Six copies per unit cube give 373 vertices, 432 cells and 3276 incidences, hence harmonic degree 468/115 greater than four. The drawing is a construction schematic, not the exact 66-vertex embedding.',abrasion:'A local fold schematic shows the birth of a saddle and a minimum. Antipodal symmetry creates two such pairs. The exact global counts change from 6 minima, 6 maxima and 10 saddles to 8 minima, 6 maxima and 12 saddles: 22 to 26. This is not a numerical flow simulation.'};
exports.mosaics=(a,b)=>{
 let s=text(210,42,'AN UNCHANGED BOUNDARY',21,a);
 const P=[[210,85],[62,278],[353,278],[241,205]],C=[209,211];
 for(let i=0;i<4;i++)for(let j=i+1;j<4;j++)s+=`<path d="M${P[i]}L${P[j]}" fill="none" stroke="${a}" stroke-width="2.6" opacity="${i===3||j===3?'.5':'.9'}"/>`;
 for(const [x,y]of P)s+=`<path d="M${x} ${y}L${C}" stroke="${b}" stroke-width="1.7" opacity=".65"/>`;
 s+=`<path d="M210 128L101 260L316 260Z" fill="${a}" fill-opacity=".07" stroke="${a}" stroke-opacity=".45"/><path d="M210 155L129 246L288 246Z" fill="${b}" fill-opacity=".04" stroke="${b}" stroke-opacity=".55"/>`;
 for(const [x,y]of P)s+=`<circle cx="${x}" cy="${y}" r="6" fill="${a}"/>`;
 s+=text(210,320,'4 boundary + 62 interior',24)+text(210,355,'72 convex cells',23,b)+text(210,385,'tetrahedral insertion • schematic',17);
 s+=`<path d="M406 85V325M815 85V325" stroke="${a}" stroke-opacity=".24"/><path d="M372 205H440l-10-7m10 7l-10 7" stroke="${b}" fill="none" stroke-width="2"/>`;
 s+=text(620,42,'SIX COPIES PER UNIT CUBE',21,a)+text(620,123,'V = 1 + 6 × 62 = 373',28)+text(620,178,'C = 6 × 72 = 432',28)+text(620,233,'I = 6 × 546 = 3276',28)+text(620,305,'h = I / (V + C)',29,b)+text(620,355,'exact periodic incidence counts',19);
 s+=text(1007,42,'BEYOND THE BAND',21,a)+text(1007,157,'468 / 115',49,b)+text(1007,211,'= 4 + 8 / 115',29)+text(1007,277,'&gt; 4',49,a)+text(1007,349,'weighted / Laguerre',22)+text(1007,383,'not ordinary Voronoi',18);
 return s;
};
exports.abrasion=(a,b)=>{
 let s=text(222,42,'A PAIR IS BORN',23,a)+text(222,77,'local gradient • fold schematic',18);
 s+=`<path d="M45 232H395M220 101V301" stroke="#ffffff" stroke-opacity=".3" stroke-width="1.5"/>`;
 for(const [tau,col]of [[-.38,a],[.45,b]]){let d='';for(let i=0;i<=100;i++){const u=-1.3+2.6*i/100,x=220+112*u,y=232-78*(u*u-tau);d+=(i?'L':'M')+x.toFixed(2)+' '+y.toFixed(2);}s+=`<path d="${d}" stroke="${col}" stroke-width="3.5" fill="none"/>`;}
 for(const sign of [-1,1]){const x=220+112*sign*Math.sqrt(.45);s+=`<circle cx="${x}" cy="232" r="7" fill="${b}" stroke="#352331" stroke-width="2"/>`+text(x,278,sign<0?'saddle':'minimum',20,b);}
 s+=`<path d="M291 296H316" stroke="${a}" stroke-width="3"/><path d="M291 323H316" stroke="${b}" stroke-width="3"/>`+text(355,302,'before',18,a)+text(355,329,'after',18,b)+text(200,352,'u² − τ = 0',31)+text(220,384,'a local model, not a flow simulation',17);
 s+=`<path d="M427 80V327M785 80V327" stroke="${a}" stroke-opacity=".24"/>`;
 s+=text(606,42,'TWO ANTIPODAL BIRTHS',21,a);
 s+=`<ellipse cx="606" cy="197" rx="117" ry="96" fill="${a}" fill-opacity=".05" stroke="${a}" stroke-width="2.5"/><ellipse cx="606" cy="197" rx="117" ry="29" fill="none" stroke="${a}" stroke-opacity=".4"/><path d="M606 101C565 144 565 250 606 293C647 250 647 144 606 101" fill="none" stroke="${a}" stroke-opacity=".4"/>`;
 for(const [x,y]of [[532,124],[680,270]])s+=`<circle cx="${x}" cy="${y}" r="20" fill="${b}" fill-opacity=".12" stroke="${b}"/><circle cx="${x-5}" cy="${y}" r="4" fill="${b}"/><path d="M${x+4} ${y-5}l8 10m-8 0l8-10" stroke="${b}" stroke-width="2"/>`;
 s+=text(606,343,'strictly convex',24)+text(606,378,'centroid fixed by symmetry',18);
 s+=text(991,42,'GLOBAL EQUILIBRIA',22,a)+text(991,124,'22 → 26',53,b);
 for(const [y,label,counts]of [[196,'minima','6 → 8'],[245,'maxima','6 → 6'],[294,'saddles','10 → 12']])s+=text(840,y,label,23,'#f9f3e9','start')+text(1118,y,counts,27,a,'end');
 return s+text(991,352,'genuine forward curvature flow',19)+text(991,383,'for sufficiently small positive μ',18);
};
