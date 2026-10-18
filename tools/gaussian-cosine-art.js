'use strict';
const colors=['#f4d58b','#b8d9e5'];
const description='Schematic of six equally spaced unoriented lines in a plane, with a small angular perturbation and an out-of-plane tilt. To the right, a schematic quadratic transverse cost rises away from the cosine configuration. Common rotations have zero cost. The theorem applies for each n at least three and moment p greater than one, locally including rank increases; global optimality is not established. The curve is a proof schematic, not sampled numerical data.';
function draw(a,b){
 let s='<g fill="none"><ellipse cx="255" cy="205" rx="150" ry="125" stroke="#f1d9f2" opacity=".2" stroke-width="2"/>';
 for(let i=0;i<6;i++){let t=i*Math.PI/6,x=145*Math.cos(t),y=120*Math.sin(t);s+=`<path d="M${255-x} ${205-y} L${255+x} ${205+y}" stroke="${a}" stroke-width="${i===1?3.5:2}" opacity="${i===1?1:.7}"/>`;}
 s+=`<path d="M255 205 L349 87" stroke="${b}" stroke-width="3" stroke-dasharray="6 5"/><path d="M349 87 l-2 17 m2-17 l-16 6" stroke="${b}" stroke-width="2"/>`;
 s+=`<path d="M310 205 A55 46 0 0 0 303 182" stroke="${a}" stroke-width="3"/><circle cx="255" cy="205" r="5" fill="#fff7eb"/>`;
 s+='<path d="M475 210 H580 l-13 -8 m13 8 l-13 8" stroke="#e4c5e4" stroke-width="2"/>';
 s+='<path d="M665 302 H1125 M895 320 V85" stroke="#e5cce6" opacity=".25" stroke-width="1.5"/>';
 s+=`<path d="M735 117 Q895 477 1055 117 L1055 302 H735 Z" fill="${b}" opacity=".08"/>`;
 s+=`<path d="M735 117 Q895 477 1055 117" stroke="${b}" stroke-width="4"/><circle cx="895" cy="297" r="7" fill="${a}" stroke="#fff4dc" stroke-width="2"/>`;
 s+='</g><g class="og-hide" fill="#fcf1fb" text-anchor="middle"><g font-family="Georgia" font-size="28"><text x="255" y="46">Equal gaps in a plane</text><text x="895" y="46">Positive transverse cost</text></g><g font-family="system-ui" font-size="19"><text x="390" y="108">tilt</text><text x="315" y="234">π / n</text><text x="528" y="178">small</text><text x="528" y="244">changes</text><text x="255" y="356">n ≥ 3 · p &gt; 1</text><text x="895" y="354">Local minimum · rotations removed</text><text x="895" y="385" font-size="15">RANK INCREASES INCLUDED · GLOBAL QUESTION OPEN</text><text x="255" y="385" font-size="15">GEOMETRIC AND QUADRATIC PROOF SCHEMATICS</text></g></g>';
 return s;
}
module.exports={colors,description,draw};
