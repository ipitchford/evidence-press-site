'use strict';
// Source: spectator theorem and exact parallel-SWAP distribution, proof.tex.
// Ribbon thicknesses are exact probabilities at 480 units per probability one:
// 1/4 = 120, 3/16 = 90, and 1/16 = 30. Only Bell outcome 11 is shown.
exports.description = 'A Bell-pair SWAP event of probability one quarter splits when an independent maximally mixed spectator qubit is added. Outcome 110 is counted, with probability three sixteenths; outcome 111 is omitted, with probability one sixteenth. Ribbon thicknesses encode those exact probabilities. Both entanglement roofs remain one quarter.';
exports.draw = (a,b) => {
 const text=(x,y,str,size=28,color='#fff4e9',anchor='start')=>`<text class="og-hide" x="${x}" y="${y}" text-anchor="${anchor}" font-family="Georgia,serif" font-size="${size}" fill="${color}">${str}</text>`;
 let out=`<defs><linearGradient id="counted" x1="0" y1="0" x2="1" y2="0"><stop stop-color="${a}" stop-opacity=".55"/><stop offset="1" stop-color="${a}" stop-opacity=".94"/></linearGradient><linearGradient id="omitted" x1="0" y1="0" x2="1" y2="0"><stop stop-color="${b}" stop-opacity=".6"/><stop offset="1" stop-color="${b}" stop-opacity=".95"/></linearGradient></defs>`;
 out+=text(58,51,'Entanglement stays. The count falls.',34);
 out+=text(115,127,'Bell event 11',30);
 out+=text(195,209,'¼',66,'#fff7eb','middle');
 out+=`<path d="M300 150 H425 C590 150 620 96 790 96 H828 V186 H790 C620 186 590 240 425 240 H300 Z" fill="url(#counted)"/><path d="M300 240 H425 C590 240 620 288 790 288 H828 V318 H790 C620 318 590 270 425 270 H300 Z" fill="url(#omitted)"/>`;
 out+=`<path d="M300 150 V270 M828 96 V186 M828 288 V318" stroke="#fff4e9" stroke-opacity=".8" stroke-width="2"/>`;
 out+=text(863,119,'110 · counted',30,a)+text(863,176,'3/16',51,a);
 out+=text(863,277,'111 · omitted',30,b)+text(863,331,'1/16',51,b);
 out+=text(588,81,'+ mixed qubit',27,'#fff4e9','middle');
 out+=text(58,367,'Exact roof: ¼',28)+text(1142,367,'Proposed bound: 3/16',28,'#fff4e9','end');
 return out;
};
exports.thumbnailHero = () => '<div class="eq-label">BELL PAIR + MIXED QUBIT</div><div style="font-family:Georgia;font-size:93px;line-height:1.2;margin:28px 0">¼ &gt; <span class="hl">3/16</span></div><div class="note">Entanglement stays.<br>The parity count falls.</div><div class="eq-foot">exact counterexample · three qubits</div>';
