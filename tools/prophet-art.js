'use strict';
// Illustrative arrivals, deliberately not a certificate sample or policy simulation.
const colors=['#f4c97f','#a8ded0'];
const description='Schematic comparison for two selections: an online decision maker commits as values arrive, while the prophet sees the entire sequence and takes the two largest. The displayed bars and online choices are illustrative, not simulated or certified outcomes, and their sums do not define the theorem ratio. Separately, the worst-case optimal expected online-to-prophet ratio has a limit for every fixed number k of selections. For k equals two the certified limiting interval is 0.83695 to 0.8372914. No exact constant or finite-horizon guarantee is implied.';
function draw(online=colors[0],prophet=colors[1]){
 const ink='#fff6e9',dim='#c9d4dc',heights=[34,64,43,84,52,28,104];
 function bars(y,chosen,color){return heights.map((h,i)=>`<rect x="${280+i*46}" y="${y-h}" width="29" height="${h}" rx="4" fill="${chosen.includes(i)?color:'#ffffff'}" fill-opacity="${chosen.includes(i)?'1':'.16'}"/>${chosen.includes(i)?`<path d="M${286+i*46} ${y-h-13} l5 5 l10 -12" fill="none" stroke="${color}" stroke-width="3"/>`:''}`).join('');}
 return `<g font-family="Arial,Helvetica,sans-serif">
 <text x="42" y="48" fill="${ink}" font-size="29">Two choices. Different information.</text>
 <text x="42" y="128" fill="${online}" font-size="31">Online</text>
 <text x="42" y="158" fill="${dim}" font-size="19">commit as values arrive</text>
 ${bars(181,[1,3],online)}
 <path d="M270 193 H612 M602 186 l10 7 -10 7" stroke="${dim}" stroke-width="2" fill="none" opacity=".7"/>
 <text x="42" y="260" fill="${prophet}" font-size="31">Prophet</text>
 <text x="42" y="290" fill="${dim}" font-size="19">see all, take the top two</text>
 ${bars(313,[3,6],prophet)}
 <path d="M270 325 H612" stroke="${dim}" stroke-width="2" opacity=".4"/>
 <text x="42" y="372" fill="${dim}" font-size="19">Schematic arrivals and choices — not a policy simulation</text>
 <path d="M668 54 V340" stroke="${dim}" stroke-width="1" opacity=".25"/>
 <text x="928" y="59" text-anchor="middle" fill="${ink}" font-size="30">Two-choice limit</text>
 <text x="928" y="102" text-anchor="middle" fill="${dim}" font-size="20">worst-case expected reward ratio</text>
 <path d="M748 177 H1110" stroke="${dim}" stroke-width="2" opacity=".35"/>
 <path d="M780 165 V190 M780 177 H1078 M1078 165 V190" stroke="${online}" stroke-width="5" fill="none"/>
 <text x="780" y="228" text-anchor="middle" fill="${online}" font-size="27">0.83695</text>
 <text x="1078" y="228" text-anchor="middle" fill="${online}" font-size="27">0.8372914</text>
 <text x="928" y="160" text-anchor="middle" fill="${ink}" font-family="Georgia,serif" font-size="40">γ₂*</text>
 <text x="928" y="277" text-anchor="middle" fill="${dim}" font-size="20">certified enclosure · not an exact value</text>
 <text x="928" y="340" text-anchor="middle" fill="${ink}" font-size="25">A limit for every fixed k</text>
 <text x="928" y="372" text-anchor="middle" fill="${dim}" font-size="19">i.i.d. nonnegative values · at most k picks</text>
 </g>`.replace(/<text /g,'<text class="og-hide" ');
}
function thumbnailHero(){return '<div class="eq-label">TWO-CHOICE LIMIT</div><div style="font-family:Georgia,serif;font-size:66px;text-align:center;margin-top:20px;color:#f4c97f">0.83695<br><span style="font-size:40px;color:inherit">≤ γ₂* ≤</span><br>0.83730</div><div class="note" style="font-size:25px;margin-top:24px">Optimal online reward<br>vs top two in hindsight</div><div class="eq-foot">worst-case expected ratio · n → ∞</div>';}
module.exports={colors,description,draw,thumbnailHero};
