'use strict';
// Source: main threshold theorem and section 7 nearest-neighbour addition.
// The arcs are an exploration schematic, never a sampled percolation cluster.
exports.draw=(a,b)=>{
 const w='#fbf5e9',muted='#d6ccd2';
 const tx=(x,y,t,size=22,c=w)=>`<text class="og-hide" x="${x}" y="${y}" fill="${c}" font-family="Georgia,serif" font-size="${size}">${t.replaceAll('&','&amp;').replaceAll('<','&lt;')}</text>`;
 let s='<defs><marker id="pa" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0L6 3L0 6" fill="none" stroke="'+a+'" stroke-width="1.5"/></marker><marker id="pb" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0L6 3L0 6" fill="none" stroke="'+b+'" stroke-width="1.5"/></marker></defs>';
 s+=tx(48,54,'A RETURN IS NOT A NEW VERTEX',20,muted);
 s+='<path d="M48 234H552" stroke="'+muted+'" opacity=".25"/>';
 for(const [x,y,h] of [[72,232,115],[136,392,145],[264,520,75],[72,456,195]])s+=`<path d="M${x} 234Q${(x+y)/2} ${234-h} ${y} 234" fill="none" stroke="${muted}" stroke-width="1.5" opacity=".22"/>`;
 s+=`<path d="M204 222Q260 128 316 222" fill="none" stroke="${a}" stroke-width="4" marker-end="url(#pa)"/><path d="M316 248Q260 320 204 248" fill="none" stroke="${b}" stroke-width="4" marker-end="url(#pb)"/>`;
 for(let i=0;i<8;i++){const x=72+i*64;s+=`<circle cx="${x}" cy="234" r="${i===2||i===4?7:5}" fill="${i===2?b:i===4?a:muted}" opacity="${i===2||i===4?1:.65}"/>`;}
 s+=tx(235,156,'out',22,a)+tx(231,304,'back',22,b)+tx(62,356,'Two-step return weight  Σ D(x)²',25,w);
 s+='<path d="M589 64V355" stroke="'+muted+'" opacity=".22"/>';
 s+=tx(635,62,'CRITICAL MEAN DEGREE',20,muted)+tx(635,130,'p꜀ = 1 + Σ D(x)² + O(s³)',32,w);
 s+=tx(635,187,'Pure power law',23,a)+tx(635,228,'coefficient of s²:  π² / 12',27,a);
 s+=tx(635,285,'Add nearest-neighbour weight λ',22,b)+tx(635,329,'π² / 12  +  λ  +  λ² / 2',29,b);
 s+=tx(48,388,'Schematic exploration · fixed dimension one · s → 0 · linear, undirected bonds',17,muted);
 return s;
};
