'use strict';
const colors=['#f0bb72','#b8d5a3'];
const description='A schematic Hopf diagram: the coexistence equilibrium changes from stable to unstable at q_H approximately 0.976916, and a small stable periodic orbit exists immediately to its right. The local branch does not assert global periodic convergence or a certified finite continuation interval.';
function draw(a,b){
 let s='<g fill="none" stroke-linecap="round">';
 s+='<path d="M90 290 H1120 M90 290 V65" stroke="#f5ece0" stroke-opacity=".4" stroke-width="2"/>';
 s+=`<path d="M105 250 H585" stroke="${b}" stroke-width="6"/><path d="M585 250 H1110" stroke="${a}" stroke-width="4" stroke-dasharray="10 9"/>`;
 s+=`<path d="M585 250 C635 169 730 109 860 83" stroke="${b}" stroke-width="6"/><path d="M585 250 C635 272 730 282 860 284" stroke="${b}" stroke-width="6"/>`;
 s+=`<ellipse cx="830" cy="178" rx="64" ry="87" stroke="${b}" stroke-width="3" opacity=".75"/><path d="M875 116 L888 137 L866 133" stroke="${b}" stroke-width="3"/>`;
 s+=`<path d="M585 70 V310" stroke="${a}" stroke-width="2" stroke-dasharray="4 8"/><circle cx="585" cy="250" r="10" fill="${a}" stroke="#fff4e6" stroke-width="2"/>`;
 s+='</g>';
 s+=`<g font-family="Georgia" fill="#fff4e6" font-size="30"><text x="145" y="90">Stable coexistence</text><text x="718" y="50">Stable small cycles</text></g>`;
 s+=`<g font-family="system-ui" fill="#efe4d6" font-size="23"><text x="300" y="337" text-anchor="middle">before the boundary</text><text x="585" y="337" text-anchor="middle" fill="${a}">q_H ≈ 0.976916</text><text x="960" y="337" text-anchor="middle">dormancy probability q →</text><text x="600" y="382" text-anchor="middle" font-size="18">LOCAL HOPF BRANCH · SCHEMATIC, NOT A CONTINUATION PLOT</text></g>`;
 return s;
}
module.exports={colors,description,draw};
