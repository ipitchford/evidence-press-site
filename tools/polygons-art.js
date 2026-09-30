'use strict';
exports.description='The regular heptagon and octagon have ten and twelve genuine shape directions after four similarities are removed. The candidate certifies positive Hessian bounds 3/5 and 7/20 at unit circumradius; the conclusion is local, not global.';
exports.cover=(a,b)=>{
 const white='#faf7f2',muted='#d4d9e2';
 let s='<g font-family="Arial,sans-serif">';
 for(const [n,cx,col,bound,dim] of [[7,235,a,'3/5',10],[8,655,b,'7/20',12]]){
 const p=Array.from({length:n},(_,i)=>{const t=-Math.PI/2+2*Math.PI*i/n;return[cx+104*Math.cos(t),183+104*Math.sin(t)];});
 s+=`<circle cx="${cx}" cy="183" r="117" fill="none" stroke="${col}" stroke-width="1" opacity=".25"/>`;
 for(const[x,y]of p)s+=`<path d="M${cx} 183L${x} ${y}" stroke="${col}" stroke-width="1" opacity=".24"/>`;
 s+=`<polygon points="${p.map(v=>v.join(',')).join(' ')}" fill="${col}" fill-opacity=".08" stroke="${col}" stroke-width="3.5"/>`;
 for(const[x,y]of p)s+=`<circle cx="${x}" cy="${y}" r="5" fill="${col}" stroke="${white}" stroke-width="1"/>`;
 s+=`<text x="${cx}" y="57" text-anchor="middle" font-size="23" fill="${white}">${n===7?'HEPTAGON':'OCTAGON'}</text><text x="${cx}" y="192" text-anchor="middle" font-size="30" fill="${white}">n = ${n}</text><text x="${cx}" y="331" text-anchor="middle" font-size="25" fill="${col}">${dim} shape directions</text><text x="${cx}" y="364" text-anchor="middle" font-size="19" fill="${muted}">curvature ≥ ${bound}</text>`;
 }
 s+=`<path d="M865 76V325" stroke="${muted}" opacity=".2"/><text x="1010" y="110" text-anchor="middle" fill="${white}" font-size="23">EVERY DIRECTION</text><text x="1010" y="143" text-anchor="middle" fill="${white}" font-size="23">CHECKED</text>`;
 s+=`<path d="M917 215l20 20 42-49" stroke="${a}" stroke-width="5" fill="none"/><text x="995" y="214" fill="${a}" font-size="21">local minimum</text><text x="1015" y="273" text-anchor="middle" fill="${muted}" font-size="18">4 similarities removed</text><text x="1015" y="303" text-anchor="middle" fill="${muted}" font-size="18">unit circumradius</text><text x="1015" y="353" text-anchor="middle" fill="${b}" font-size="18">global optimum not proved</text></g>`;
 return s.replace(/<text /g, '<text class="og-hide" ');
};
