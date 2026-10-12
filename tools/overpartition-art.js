'use strict';
// Source: towers paper Proposition 4. Exact class-7 witnesses, not simulation.
exports.draw=function(a,b){
 const gold='#f1c77b',ink='#f8f1e6',muted='#d7c6d3';let s='';
 s+=`<text x="62" y="62" fill="${muted}" font-family="sans-serif" font-size="18" letter-spacing="2">A WHOLE CLASS VANISHES</text>`;
 s+=`<text x="62" y="123" fill="${ink}" font-family="Georgia,serif" font-size="35">p̄(13 · 4ⁱ · (8n + 7)) ≡ 0</text>`;
 s+=`<text x="65" y="162" fill="${muted}" font-family="sans-serif" font-size="21">modulo 13, for every n ≥ 0</text>`;
 s+=`<path d="M66 210 H486" stroke="${muted}" opacity=".28"/><text x="65" y="271" fill="${gold}" font-family="Georgia,serif" font-size="42">exactly when i ≡ 3 (mod 4)</text>`;
 s+=`<text x="65" y="332" fill="${muted}" font-family="sans-serif" font-size="17">A twelve-state certificate; a four-level pattern.</text>`;
 const cx=870,cy=204,rad=123;
 for(let i=0;i<12;i++){
  const t=(i-3)*Math.PI/6,x=cx+rad*Math.cos(t),y=cy+rad*Math.sin(t),zero=i%4===3;
  const u=(i-2)*Math.PI/6,nx=cx+rad*Math.cos(u),ny=cy+rad*Math.sin(u);
  s+=`<path d="M${x} ${y} L${nx} ${ny}" stroke="${muted}" stroke-width="2" opacity=".35"/>`;
  s+=`<circle cx="${x}" cy="${y}" r="${zero?23:16}" fill="${zero?gold:'#473745'}" stroke="${zero?gold:muted}" stroke-width="${zero?3:1}"/>`;
  s+=`<text x="${x}" y="${y+6}" text-anchor="middle" fill="${zero?'#302319':ink}" font-family="sans-serif" font-size="17" font-weight="700">${i}</text>`;
 }
 s+=`<text x="870" y="191" text-anchor="middle" fill="${ink}" font-family="Georgia,serif" font-size="35">3 · 7 · 11</text><text x="870" y="228" text-anchor="middle" fill="${muted}" font-family="sans-serif" font-size="18">vanishing levels</text><text x="870" y="380" text-anchor="middle" fill="${muted}" font-family="sans-serif" font-size="16">Level i runs round the cycle modulo 12</text>`;
 return s.replace(/<text /g,'<text class="og-hide" ');
};
