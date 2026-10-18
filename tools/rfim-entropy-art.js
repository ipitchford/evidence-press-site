'use strict';
const colors=['#f2c777','#b5cdea'];
const description='Sign-adapted localisation schematic. Strong vertices have marked preferred plus or minus signs; pale small vertices are weak. Compatible interactions fade at the terminal point, but the interaction between two strong vertices of opposite preferred signs remains. The terminal measure is not generally a product. This is a proof schematic, not a spin sample or numerical convergence plot.';
function draw(a,b){
  const pts=[[80,165,'+'],[205,105,'+'],[340,175,'−'],[235,285,''],[105,290,''],[360,300,'−']];
  const edges=[[0,1],[1,2],[0,4],[4,3],[3,1],[3,2],[2,5]];
  const node=([x,y,s],dx)=>`<circle cx="${x+dx}" cy="${y}" r="${s?21:11}" fill="${s==='+'?a:s==='−'?b:'#c8bcae'}" stroke="#fff4e4" stroke-width="1.5"/><text x="${x+dx}" y="${y+8}" text-anchor="middle" font-family="Georgia" font-size="28" fill="#28201a">${s}</text>`;
  let out='';
  for(const dx of [0,690]){
    for(const [i,j] of edges){const keep=i===1&&j===2;out+=`<path d="M${pts[i][0]+dx} ${pts[i][1]} L${pts[j][0]+dx} ${pts[j][1]}" fill="none" stroke="${keep?'#f8eee0':'#c4ae92'}" stroke-width="${keep?5:3}" opacity="${dx&&!keep?.17:.7}" ${dx&&!keep?'stroke-dasharray="5 9"':''}/>`;}
    pts.forEach(p=>{out+=node(p,dx)});
  }
  out+='<path d="M460 205 H640 l-15 -10 M640 205 l-15 10" stroke="#e4c8a2" stroke-width="2" fill="none"/>';
  out+='<g class="og-hide" fill="#fff3e2" text-anchor="middle"><g font-family="Georgia" font-size="29"><text x="220" y="47">Respect the preferred signs</text><text x="910" y="47">Some interactions remain</text></g><g font-family="system-ui" font-size="19"><text x="550" y="177">sign-adapted</text><text x="550" y="238">localisation</text><text x="220" y="360">Strong + / − · pale vertices: weak</text><text x="910" y="360">Opposite strong preferences stay coupled</text><text x="600" y="389" font-size="15">PROOF SCHEMATIC · CONTINUOUS-TIME ENTROPY DECAY, NOT ONE-STEP CONTRACTION</text></g></g>';
  return out;
}
module.exports={colors,description,draw};
