'use strict';
// The domain follows D(alpha)<=0 and D(-alpha)<=0 (paper Section 3).
// Hulls and graph are explicitly schematic, not individual certificates.
exports.description = 'A closed sixfold parameter region with its fundamental sector highlighted, followed by schematic enclosing hulls and the forbidden configuration of two six-cliques. Boundary points are included; hull counts are not root counts.';
exports.cover = (a,b) => {
  const text=(x,y,s,size=20,color='#f4eee8')=>`<text x="${x}" y="${y}" text-anchor="middle" font-family="Georgia,serif" font-size="${size}" fill="${color}">${s}</text>`;
  const radius=t=>{let lo=0,hi=3;for(let j=0;j<55;j++){let r=(lo+hi)/2;if(r**4+18*r*r+8*r**3*Math.abs(Math.cos(3*t))-27>0)hi=r;else lo=r;}return(lo+hi)/2;};
  const point=t=>[210+104*radius(t)*Math.cos(t),202-104*radius(t)*Math.sin(t)];
  const path=(start,end,n)=>Array.from({length:n+1},(_,i)=>{const p=point(start+(end-start)*i/n);return(i?'L':'M')+p.map(v=>v.toFixed(2)).join(' ');}).join(' ');
  let s=`<path d="${path(0,2*Math.PI,240)} Z" fill="${a}" fill-opacity=".07" stroke="${a}" stroke-opacity=".7" stroke-width="2"/>`;
  for(let k=0;k<6;k++){const p=point(k*Math.PI/3);s+=`<path d="M210 202 L${p[0]} ${p[1]}" stroke="${a}" opacity=".17"/>`;}
  s+=`<path d="M210 202 L314 202 ${path(0,Math.PI/6,30).replace(/^M/,'L')} Z" fill="${b}" fill-opacity=".22" stroke="${b}" stroke-width="2.5"/>`;
  const p=point(Math.PI/6);s+=`<circle cx="210" cy="202" r="5" fill="${b}"/><circle cx="${p[0]}" cy="${p[1]}" r="5" fill="${b}"/>`;
  s+=text(210,47,'THE CLOSED FAMILY',19,a)+text(210,348,'Boundary included',25)+text(210,377,'A continuous parameter region',15,'#c8c7d2');
  for(const x of [382,785])s+=`<path d="M${x-22} 201 H${x+13} M${x+4} 192 L${x+14} 201 L${x+4} 210" stroke="#ced5dc" stroke-width="2" fill="none" opacity=".65"/>`;
  const hulls=[[465,142,70,63],[522,177,78,77],[598,121,67,73],[632,200,70,67],[480,241,80,57]];
  hulls.forEach(([x,y,w,h],i)=>{s+=`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="7" fill="${a}" fill-opacity=".08" stroke="${a}" stroke-width="2"/>`;for(let k=0;k<3;k++)s+=`<circle cx="${x+w*(.3+.17*k)}" cy="${y+h*(.4+.12*Math.sin(i+k))}" r="3.5" fill="${b}"/>`;});
  s+=text(580,47,'COVER EVERY VECTOR',19,a)+text(580,348,'Hulls, not root counts',25)+text(580,377,'Phase-space schematic',15,'#c8c7d2');
  const rings=[920,1090].map(cx=>Array.from({length:6},(_,i)=>[cx+52*Math.cos(i*Math.PI/3-Math.PI/2),195+52*Math.sin(i*Math.PI/3-Math.PI/2)]));
  for(let k=0;k<6;k++)s+=`<path d="M${rings[0][k].join(' ')} L${rings[1][k].join(' ')}" stroke="${b}" stroke-width="1" stroke-dasharray="4 7" opacity=".3"/>`;
  for(const pts of rings){for(let i=0;i<6;i++)for(let j=i+1;j<6;j++)s+=`<path d="M${pts[i].join(' ')} L${pts[j].join(' ')}" stroke="${a}" opacity=".5"/>`;for(const [x,y]of pts)s+=`<circle cx="${x}" cy="${y}" r="6" fill="${a}" stroke="#222334" stroke-width="2"/>`;}
  s+=`<circle cx="1005" cy="195" r="20" fill="#252134" stroke="${b}" stroke-width="2"/><path d="M993 207 L1017 183" stroke="${b}" stroke-width="3"/>`;
  s+=text(1000,47,'THE GRAPH OBSTRUCTION',19,a)+text(1000,348,'No compatible pair',25)+text(1000,377,'Two six-cliques would be required',15,'#c8c7d2');
  return s;
};
