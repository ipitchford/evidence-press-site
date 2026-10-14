'use strict';
// Exact atom-set lattices in the manuscript, Section 3; layout is schematic.
// Filled nodes are the 56 Betti elements, with the bottom included.
const colors = ['#b9e6e2', '#f1b66f'];
const mask = s => [...s].reduce((m, c) => m | (1 << (Number(c)-1)), 0);
const size = m => m.toString(2).replace(/0/g, '').length;
const excluded = ['1245','1256','2456','12456'].map(mask);
const left = Array.from({length:64}, (_,i)=>i).filter(i=>!excluded.includes(i));
const removed = mask('23456');
const right = left.filter(i=>i!==removed);
const betti = left.filter(i=>size(i)<=4 || ['12346','13456'].map(mask).includes(i));
if(left.length!==60 || right.length!==59 || betti.length!==56 || betti.includes(removed)) throw new Error('Katthan art: inconsistent finite objects');
const description = 'Exact inclusion diagrams for the 60-element and 59-element lcm-lattices of the six-generator ideals I and J. Filled pale nodes mark their common 56-element Betti poset, counting the bottom. Hollow nodes are not in the Betti poset. Deleting the amber element with atom set 23456 preserves the Betti poset but changes ideal Stanley projective dimension from 3 to 2. The ideals have 5 and 7 ambient variables; their Stanley depths are 2 and 5. The layout is schematic, but every node and cover relation is computed from the stated lattices. This is not a counterexample to Stanley’s inequality or to the quotient assertion.';
function coordinates(cx) {
  const result = new Map(), widths=[0,170,305,356,305,205,0];
  for(let k=0;k<=6;k++) {
    const row=left.filter(m=>size(m)===k);
    row.forEach((m,j)=>result.set(m,[cx+(row.length===1?0:widths[k]*(j/(row.length-1)-.5)),282-k*31]));
  }
  return result;
}
function network(nodes,cx,a,b,deleted) {
  const p=coordinates(cx); let s='';
  for(const u of nodes) for(const v of nodes) {
    if(u===v || (u&v)!==u || nodes.some(z=>z!==u&&z!==v&&(u&z)===u&&(z&v)===z)) continue;
    const [x,y]=p.get(u),[xx,yy]=p.get(v), special=u===removed||v===removed;
    s+=`<path d="M${x} ${y}L${xx} ${yy}" stroke="${special?b:a}" stroke-opacity="${special?.74:.20}" stroke-width="${special?1.9:1.15}" fill="none"/>`;
  }
  for(const m of nodes) {
    const [x,y]=p.get(m),hit=m===removed,isB=betti.includes(m);
    s+=`<circle cx="${x}" cy="${y}" r="${hit?7:4.2}" fill="${hit?b:isB?a:'#263a44'}" stroke="${hit?b:isB?a:'#acb2b8'}" stroke-width="${isB?1:1.7}"/>`;
  }
  if(deleted) {const [x,y]=p.get(removed);s+=`<circle cx="${x}" cy="${y}" r="8.2" fill="none" stroke="${b}" stroke-dasharray="2 4" stroke-opacity=".65"/>`;}
  return s;
}
function draw(a=colors[0], b=colors[1]) {
  const ink='#fff6e9',dim='#d6d4d0';
  return `<g font-family="Arial,Helvetica,sans-serif">
  <text class="og-hide" x="245" y="44" fill="${dim}" text-anchor="middle" font-size="23">60 lcm elements</text>
  <text class="og-hide" x="955" y="44" fill="${dim}" text-anchor="middle" font-size="23">59 lcm elements</text>
  ${network(left,245,a,b,false)}${network(right,955,a,b,true)}
  <path d="M361 125L408 100H450" fill="none" stroke="${b}" stroke-width="1.8"/>
  <text class="og-hide" x="455" y="105" fill="${b}" font-size="19">delete 23456</text>
  <text class="og-hide" x="600" y="175" text-anchor="middle" fill="${ink}" font-family="Georgia,serif" font-size="37">B(I) ≅ B(J)</text>
  <text class="og-hide" x="600" y="212" text-anchor="middle" fill="${a}" font-size="24">same 56 Betti elements</text>
  <path d="M486 239H714M704 231L714 239L704 247" fill="none" stroke="${b}" stroke-width="2.4"/>
  <text class="og-hide" x="245" y="337" text-anchor="middle" fill="${ink}" font-family="Georgia,serif" font-size="43">spdim I = 3</text>
  <text class="og-hide" x="955" y="337" text-anchor="middle" fill="${ink}" font-family="Georgia,serif" font-size="43">spdim J = 2</text>
  <text class="og-hide" x="245" y="365" text-anchor="middle" fill="${dim}" font-size="18">5 variables · sdepth 2</text>
  <text class="og-hide" x="955" y="365" text-anchor="middle" fill="${dim}" font-size="18">7 variables · sdepth 5</text>
  <circle cx="477" cy="283" r="4.8" fill="${a}"/><text class="og-hide" x="490" y="289" fill="${dim}" font-size="17">Betti</text>
  <circle cx="583" cy="283" r="4.8" fill="none" stroke="#acb2b8" stroke-width="1.7"/><text class="og-hide" x="596" y="289" fill="${dim}" font-size="17">not Betti</text>
  <text class="og-hide" x="600" y="382" text-anchor="middle" fill="${dim}" font-size="16">six generators · over every field</text>
  </g>`;
}
function thumbnailHero() {
  return '<div class="eq-label">same Betti poset</div><div style="font-family:Georgia,serif;font-size:80px;text-align:center;margin:32px 0">3 <span class="hl">≠</span> 2</div><div class="note">Stanley projective dimension<br><b>six generators are minimal</b></div><div class="eq-foot">ideal assertion only · quotient question open</div>';
}
module.exports={colors,description,draw,thumbnailHero,left,right,betti};
