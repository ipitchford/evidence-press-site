'use strict';
// Exact worked allocation from manuscript §6. Circle positions are layout only.
exports.draw = (a,b) => {
  const colors=[a,b,'#c6b4ed'], bundles=[[1,2,3,8,9],[4,5],[6,7]], residual=[6,3,1], others=[[10,6],[6,10],[11,8]];
  let s='<g font-family="Georgia,serif" fill="#f4efe6"><text x="55" y="57" font-size="25">Nine chores. Three different views of cost.</text></g>';
  for(let i=0;i<3;i++){
    const y=120+i*94,c=colors[i];
    s+=`<text x="55" y="${y+9}" fill="${c}" font-family="monospace" font-size="21">${i+1}</text>`;
    s+=`<path d="M98 ${y+34} H520" stroke="${c}" stroke-opacity=".35"/>`;
    for(let j=0;j<bundles[i].length;j++){
      const x=133+j*82;
      s+=`<circle cx="${x}" cy="${y}" r="27" fill="${c}" fill-opacity=".12" stroke="${c}" stroke-width="2"/><text x="${x}" y="${y+8}" text-anchor="middle" fill="#f4efe6" font-family="Georgia" font-size="25">${bundles[i][j]}</text>`;
    }
    s+=`<path d="M554 ${y} H606" stroke="${c}" stroke-width="2"/><path d="M597 ${y-5} L607 ${y} L597 ${y+5}" fill="none" stroke="${c}" stroke-width="2"/>`;
    s+=`<text x="660" y="${y+11}" fill="${c}" font-family="Georgia" font-size="39">${residual[i]}</text><text x="742" y="${y+8}" fill="#f4efe6" font-family="Georgia" font-size="29">≤ min(${others[i][0]}, ${others[i][1]})</text>`;
  }
  s+='<g fill="#ddd8d0" font-family="sans-serif" font-size="16"><text x="101" y="382">Chore labels · one exact allocation</text><text x="655" y="61">WORST COST AFTER ONE DELETION</text><text x="654" y="382" font-size="14">Compared with both other bundles, in that agent’s costs</text></g>';
  return s;
};
