'use strict';
exports.description = 'A schematic two-layer graph leads to the claimed parameter window: counterexamples from alpha to 2 and from 2 to 2.764, with the known positive Ising point at 2 excluded. Outside this window no classification is asserted.';
exports.cover = (a, b) => {
  const white='#faf7f2', muted='#d1ccd8';
  let s='<g font-family="Arial, sans-serif">';
  const points=[[75,145],[150,100],[225,140],[300,105],[355,155]];
  for(let i=0;i<points.length;i++) {
    const [x,y]=points[i];
    s+=`<path d="M${x} ${y}v105" stroke="${b}" stroke-width="2" opacity=".55"/>`;
    if(i<points.length-1){const [u,v]=points[i+1];
      s+=`<path d="M${x} ${y}L${u} ${v} M${x} ${y+105}L${u} ${v+105}" stroke="${a}" stroke-width="3" fill="none"/>`;}
  }
  for(const [x,y] of points) for(const d of [0,105]) s+=`<circle cx="${x}" cy="${y+d}" r="7" fill="${d?b:a}" stroke="${white}" stroke-width="1.2"/>`;
  s+=`<text x="215" y="325" text-anchor="middle" fill="${white}" font-size="23">One common edge probability</text><text x="215" y="354" text-anchor="middle" fill="${muted}" font-size="16">two-layer schematic · not a witness graph</text>`;
  s+=`<path d="M405 200H460m-12-8 12 8-12 8" fill="none" stroke="${muted}" stroke-width="2"/>`;
  const x=q=>510+(q-.55)*265;
  const lo=x(.787422865), mid=x(2), hi=x(2.764);
  s+=`<text x="820" y="78" text-anchor="middle" fill="${white}" font-size="27">A positive point, isolated in a window</text>`;
  s+=`<path d="M495 203H${lo} M${hi} 203H1155" stroke="${muted}" stroke-width="3" stroke-dasharray="5 7" opacity=".65"/>`;
  s+=`<path d="M${lo} 203H${mid-14} M${mid+14} 203H${hi}" stroke="${b}" stroke-width="8"/>`;
  for(const p of [lo,hi])s+=`<circle cx="${p}" cy="203" r="6" fill="${b}"/>`;
  s+=`<circle cx="${mid}" cy="203" r="13" fill="#17222c" stroke="${a}" stroke-width="4"/><path d="M${mid} 184V128" stroke="${a}" stroke-width="2"/>`;
  s+=`<text x="${mid}" y="117" text-anchor="middle" fill="${a}" font-size="25">q = 2 · known positive</text>`;
  s+=`<text x="${lo}" y="247" text-anchor="middle" fill="${white}" font-size="22">α ≈ 0.7874</text><text x="${hi}" y="247" text-anchor="middle" fill="${white}" font-size="22">2.764</text>`;
  s+=`<text x="820" y="305" text-anchor="middle" fill="${b}" font-size="25">Counterexamples everywhere else in the window</text><text x="820" y="344" text-anchor="middle" fill="${muted}" font-size="19">every prescribed 0 &lt; p &lt; 1 · graph depends on p and q</text></g>`;
  return s;
};
