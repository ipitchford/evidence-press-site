'use strict';
// Source: Theorem 1; illustrative graph structure, exact displayed upper-bound formula.
const colors=['#edbc76','#c3b2f2'];
const description='Alternating exact heat-bath updates redraw layer L and then layer R in one complete sweep. For nonnegative interactions and biases, the candidate worst-start total-variation upper bound min(1,(n/2)(2/e)^(2k-2)) is plotted at n=one million on a logarithmic vertical axis, joining the integer-sweep bounds. At 30 sweeps it is 0.00932459, below 0.01. This is a theorem bound, not simulation or elementary-operation runtime; the small layer diagram is schematic.';
const bound=k=>Math.min(1,500000*(2/Math.E)**(2*k-2));
function draw(a=colors[0],b=colors[1]){
 const ivory='#faf1e8',muted='#d4c6d8',X=k=>520+(k-1)*610/33,Y=v=>117-Math.log10(v)*58;
 let s=`<g font-family="Arial,Helvetica,sans-serif"><text x="48" y="40" fill="${a}" font-size="16" letter-spacing="1.2">NONNEGATIVE INTERACTIONS + BIASES</text><text x="48" y="82" fill="${ivory}" font-family="Georgia,serif" font-size="30">Redraw a layer. Reduce the discrepancy.</text>`;
 for(const[i,y]of [128,196,264].entries())for(const[j,z]of [128,196,264].entries())s+=`<path d="M115 ${y}L315 ${z}" fill="none" stroke="${i===j?a:b}" stroke-width="${i===j?2.4:1.1}" opacity="${i===j?.65:.18}"/>`;
 for(const x of[115,315])for(const y of[128,196,264])s+=`<circle cx="${x}" cy="${y}" r="13" fill="${x===115?a:b}"/><circle cx="${x}" cy="${y}" r="21" fill="none" stroke="${x===115?a:b}" opacity=".2"/>`;
 s+=`<text x="115" y="309" text-anchor="middle" fill="${a}" font-size="23">① update L</text><text x="315" y="309" text-anchor="middle" fill="${b}" font-size="23">② update R</text><path d="M80 322V334H350V322" stroke="${muted}" stroke-width="1.5" fill="none"/><text x="215" y="362" text-anchor="middle" fill="${ivory}" font-size="19">one complete sweep</text><text x="215" y="386" text-anchor="middle" fill="${muted}" font-size="12">schematic layer structure</text><path d="M429 112V361" stroke="${muted}" opacity=".25"/>`;
 for(const[v,label]of[[1,'1'],[.1,'0.1'],[.01,'0.01'],[.001,'0.001']]){let y=Y(v);s+=`<path d="M520 ${y}H1130" stroke="${v===.01?a:muted}" opacity="${v===.01?.5:.15}" stroke-dasharray="${v===.01?'5 5':'0'}"/><text x="507" y="${y+5}" text-anchor="end" fill="${v===.01?a:muted}" font-size="14">${label}</text>`;}
 for(const k of[1,10,20,30,34])s+=`<text x="${X(k)}" y="320" text-anchor="middle" fill="${muted}" font-size="15">${k}</text>`;
 const pts=[];for(let k=1;k<=34;k++)pts.push(`${pts.length?'L':'M'}${X(k).toFixed(2)} ${Y(bound(k)).toFixed(2)}`);
 s+=`<path d="${pts.join(' ')}" stroke="${a}" stroke-width="4" fill="none"/><circle cx="${X(30)}" cy="${Y(bound(30))}" r="6" fill="${ivory}" stroke="${a}" stroke-width="2"/>
 <text x="520" y="102" fill="${muted}" font-size="16">TV upper bound · log scale · n = 1,000,000</text>
 <text x="720" y="160" fill="${ivory}" font-family="Georgia,serif" font-size="36">30 sweeps</text><text x="720" y="190" fill="${a}" font-size="21">distance ≤ 0.01</text>
 <text x="825" y="347" text-anchor="middle" fill="${ivory}" font-size="17">complete sweeps k</text>
 <text x="825" y="378" text-anchor="middle" fill="${muted}" font-size="15">min{1, (n/2)(2/e)²ᵏ⁻²} · theorem bound, not measured runtime</text></g>`;
 return s.replace(/<text /g,'<text class="og-hide" ');
}
function thumbnailHero(){return '<div class="eq-label">one million binary variables</div><div style="font-family:Georgia,serif;font-size:103px;text-align:center">30 sweeps</div><div style="text-align:center;font-size:34px;margin-top:27px">TV distance ≤ 0.01</div><div class="eq-foot">a sufficient bound, not a runtime measurement</div>';}
module.exports={colors,description,bound,draw,thumbnailHero};
