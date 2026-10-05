'use strict';
exports.description='Two rooted binary trees each have four leaves. A balanced tree has Horton-Strahler order three, whereas a comb has order two. Leaves have order one; equal child orders increment, unequal orders retain the maximum. This illustrates why conditioning on leaf count does not fix branching order. A separate Kingman formula records a positive geometric prefactor for limiting branch densities, not a finite-tree simulation.';
exports.cover=(a,b)=>{
 const ink='#f9f3e7',muted='#d6d3df';
 const text=(x,y,s,size=24,color=ink)=>`<text class="og-hide" x="${x}" y="${y}" text-anchor="middle" font-family="Georgia,serif" font-size="${size}" fill="${color}">${s}</text>`;
 const node=(x,y,n,color)=>`<circle cx="${x}" cy="${y}" r="16" fill="#202235" stroke="${color}" stroke-width="2.5"/>${text(x,y+7,n,21,color)}`;
 let s=text(345,48,'Same four leaves. Different branching order.',27);
 const edge=(x,y,u,v,color)=>`<path d="M${x} ${y} C${x} ${(y+v)/2} ${u} ${(y+v)/2} ${u} ${v}" fill="none" stroke="${color}" stroke-width="4" stroke-linecap="round"/>`;
 [[95,112,155,200],[215,112,155,200],[275,112,335,200],[395,112,335,200],[155,200,245,292],[335,200,245,292]].forEach(p=>s+=edge(...p,a));
 [[465,112,495,177],[525,112,495,177],[495,177,550,234],[585,112,550,234],[550,234,605,292],[655,112,605,292]].forEach(p=>s+=edge(...p,b));
 [[95,112,1],[215,112,1],[275,112,1],[395,112,1],[155,200,2],[335,200,2],[245,292,3]].forEach(p=>s+=node(...p,a));
 [[465,112,1],[525,112,1],[585,112,1],[655,112,1],[495,177,2],[550,234,2],[605,292,2]].forEach(p=>s+=node(...p,b));
 s+=text(245,347,'balanced: order 3',24,a)+text(575,347,'comb: order 2',24,b);
 s+='<path d="M730 66V338" stroke="#ffffff" stroke-opacity=".18"/>';
 s+=text(958,85,'KINGMAN',18,muted)+text(958,151,'Nⱼ ρʲ → H',48,a)+text(958,205,'0 &lt; H &lt; ∞',32,b)+text(958,270,'a positive prefactor',25)+text(958,307,'not just an exponent',23,muted);
 return s;
};
