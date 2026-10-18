'use strict';
const colors=['#efbd70','#b8d8b0'];
const description='A seven-vertex retained graph has exactly two connected components, one containing s and one containing t. It illustrates split success, not an optimal graph. The classification strip distinguishes trees, an intermediate nonexistence range, two conditional edge counts, and dense existence. The two boundary counts are certified for 7 through 51 vertices; all orders remain conditional.';
function draw(a,b){
 const pts=[[105,170],[190,90],[265,180],[170,270],[390,95],[460,210],[350,275]];
 const edges=[[0,1],[1,2],[2,3],[3,0],[0,2],[4,5],[5,6],[4,6]];
 let out='<g fill="none" stroke-linecap="round">';
 for(const [i,j] of edges)out+=`<path d="M${pts[i]} L${pts[j]}" stroke="${i<4?a:b}" stroke-width="4" opacity=".8"/>`;
 out+=`<path d="M265 180 L390 95 M170 270 L350 275" stroke="#e7ddd4" stroke-width="2" stroke-dasharray="6 10" opacity=".23"/></g>`;
 pts.forEach(([x,y],i)=>{out+=`<circle cx="${x}" cy="${y}" r="${i===0||i===5?19:9}" fill="${i<4?a:b}" stroke="#fff8e9" stroke-width="${i===0||i===5?2:1}"/>`;});
 out+='<g font-family="Georgia" fill="#29231f" font-size="25" text-anchor="middle"><text x="105" y="178">s</text><text x="460" y="218">t</text></g>';
 out+='<g class="og-hide" font-family="Georgia" fill="#fff4e6" font-size="29"><text x="65" y="42">Success means exactly two components</text><text x="615" y="77">Can one design win for every p?</text></g>';
 const blocks=[[610,70,b],[690,195,'#c78b8b'],[895,40,a],[945,40,a],[995,160,b]];
 blocks.forEach(([x,w,c])=>{out+=`<rect x="${x}" y="145" width="${w}" height="56" rx="7" fill="${c}" opacity=".88"/>`;});
 out+='<g class="og-hide" font-family="system-ui" font-size="21" fill="#f7eade" text-anchor="middle"><text x="645" y="235">trees</text><text x="787" y="235">no uniform best</text><text x="940" y="121">two counts</text><text x="1075" y="235">dense: yes</text><text x="880" y="292">Boundary counts certified for 7 ≤ n ≤ 51</text><text x="880" y="327" font-size="20">All-order boundary question remains open</text><text x="278" y="337">One terminal in each component</text><text x="278" y="367" font-size="17">RETAINED-EDGE SCHEMATIC · NOT AN OPTIMISER</text></g>';
 return out;
}
module.exports={colors,description,draw};
