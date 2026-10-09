'use strict';
// Source: paper.tex Proposition 4 and Theorem 1. Symbolic schematic, no sampled coefficients.
exports.draw=(a,b)=>{
 const text=(x,y,t,n=27,c='#f6eee8')=>`<text class="og-hide" x="${x}" y="${y}" fill="${c}" text-anchor="middle" font-family="Georgia,serif" font-size="${n}">${t}</text>`;
 let s=`<circle cx="185" cy="198" r="101" fill="none" stroke="${a}" stroke-width="1.5" opacity=".5"/>`;
 for(let i=0;i<24;i++){let t=i*Math.PI/12,x=185+101*Math.cos(t),y=198+101*Math.sin(t);s+=`<line x1="185" y1="198" x2="${x}" y2="${y}" stroke="${a}" opacity=".09"/><circle cx="${x}" cy="${y}" r="${i%3?3:5}" fill="${i%3?a:b}" opacity=".8"/>`;}
 s+=text(185,207,'Φₙ(q)',42,a)+text(185,53,'Cyclotomic structure',27)+text(185,351,'Finite, exact specification',22);
 s+=`<path d="M300 198 H390 M380 191 L390 198 L380 205" stroke="${a}" fill="none" stroke-width="2"/>`;
 s+=`<rect x="412" y="142" width="235" height="112" rx="18" fill="${a}" fill-opacity=".04" stroke="${a}" stroke-opacity=".55"/>`;
 s+=text(529,188,'× (1 + q)ᴷ',38,b)+text(529,224,'add only 2s / 1s',24);
 s+=`<path d="M647 198 C720 198 700 100 774 100 M647 198 C720 198 700 297 774 297" fill="none" stroke="${a}" stroke-width="2.5"/>`;
 s+=text(965,57,'Every coefficient positive',29,a);
 for(let i=0;i<13;i++){let h=18+42*Math.sin((i+1)*Math.PI/14);s+=`<rect x="810" y="0" width="1" height="1" opacity="0"/><rect x="${798+i*25}" y="${153-h}" width="16" height="${h}" rx="3" fill="${a}" opacity="${.4+.5*Math.sin((i+1)*Math.PI/14)}"/>`;}
 s+=`<path d="M790 158 H1130" stroke="${a}" opacity=".3"/>`;
 s+=text(965,191,'positivity proved, not expanded',21);
 s+=text(965,263,'Largest 5,591 entries',29,b)+text(965,311,'Σ A  &lt;  Σ B',44,b)+text(965,351,'upper-tail failure survives',23);
 s+=text(598,389,'One multiplier · two different consequences · schematic',19,'#d2c7cb');
 return s;
};
