'use strict';

// Source: the sharp four-cycle flattening theorem and its fixed-topology
// two-class mixture corollary. These are diagrams, not sampled data.
exports.description = 'A four-leaf four-state network with one reticulation, shown as a diamond with two incoming gold edges, is compared with a mixture of two trees sharing the same topology. Every two-versus-two network flattening has rank at least ten. The tree mixture has rank at most eight on its shared split, so their exact genetic-pattern distributions cannot be equal. Positive invertible channels and interior inheritance are assumed.';

const text = (x,y,value,size=24,fill='#fff4e9',anchor='middle') =>
  `<text class="og-hide" x="${x}" y="${y}" text-anchor="${anchor}" font-family="Georgia,serif" font-size="${size}" fill="${fill}">${value}</text>`;

function tree(cx, color) {
  const y=186, left=cx-24, right=cx+24, tipLeft=cx-69, tipRight=cx+69;
  let s=`<g fill="none" stroke="${color}" stroke-width="4.5" stroke-linecap="round"><path d="M${tipLeft} 121 L${left} ${y} L${tipLeft} 251 M${left} ${y} H${right} M${tipRight} 121 L${right} ${y} L${tipRight} 251"/></g>`;
  for (const [x,ty,label] of [[tipLeft,121,'A'],[tipLeft,251,'B'],[tipRight,121,'C'],[tipRight,251,'D']]) {
    s+=`<circle cx="${x}" cy="${ty}" r="6" fill="${color}"/>`;
    s+=text(x,ty+(ty<y?-14:28),label,21);
  }
  for (const x of [left,right]) s+=`<circle cx="${x}" cy="${y}" r="6" fill="#fff4e9"/>`;
  return s;
}

exports.cover = (network, treeColor) => {
  let s=text(245,37,'ONE FOUR-STATE NETWORK',24,network);
  s+=text(950,37,'TWO TREE CLASSES',24,treeColor);
  s+=text(950,69,'same topology',23);
  s+=`<g fill="none" stroke="${network}" stroke-width="4.5" stroke-linecap="round"><path d="M245 112 L340 190 M245 112 L150 190 M245 112 V84 M340 190 H389 M150 190 H101 M245 267 V305"/></g>`;
  s+=`<g fill="none" stroke="${treeColor}" stroke-width="6" stroke-linecap="round"><path d="M340 190 L245 267 L150 190"/></g>`;
  for (const [x,y] of [[245,112],[340,190],[150,190]]) s+=`<circle cx="${x}" cy="${y}" r="7" fill="${network}" stroke="#fff4e9" stroke-width="1.5"/>`;
  s+=`<path d="M245 255 L257 267 L245 279 L233 267 Z" fill="${treeColor}" stroke="#fff4e9" stroke-width="2"/>`;
  for (const [x,y] of [[245,84],[389,190],[101,190],[245,305]]) s+=`<circle cx="${x}" cy="${y}" r="6" fill="#fff4e9"/>`;
  s+=text(245,73,'A',22)+text(413,198,'B',22)+text(77,198,'C',22)+text(267,312,'D',22);
  // Direction markers on the two incoming reticulation edges.
  s+=`<path d="M297 223 l-13 3 l5 -12 M193 223 l13 3 l-5 -12" fill="none" stroke="${treeColor}" stroke-width="3" stroke-linecap="round"/>`;
  s+=text(590,195,'≠',83)+text(590,235,'exact genetic law',22);
  s+=tree(826,treeColor)+tree(1074,treeColor)+text(950,199,'+',38,treeColor);
  s+=text(245,355,'rank ≥ 10',44,network)+text(245,389,'every two-versus-two split',21);
  s+=text(950,355,'rank ≤ 8',44,treeColor)+text(950,389,'the shared internal split',21);
  return s;
};

exports.thumbnailHero = () => '<div class="eq-label">FOUR STATES · EXACT DISTRIBUTIONS</div><div class="eq" style="font-size:86px">10 &gt; 8</div><div class="note"><b>Network rank: at least 10.</b><br>Two tree classes: at most 8<br>on their shared topology.</div><div class="eq-foot">positive invertible channels · candidate theorem</div>';
