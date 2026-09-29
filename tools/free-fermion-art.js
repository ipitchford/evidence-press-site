'use strict';
// Mathematical diagrams from the manuscript: induced obstructions and the 1,2,4 parity witness.
const ink='#eff4ed', muted='#b9ced0', bg='#17282e', teal='#6ddbc4', gold='#f0c274';
const description='Two induced obstructions to all-coupling whole-spectrum freeness: a claw K1,3 and an even hole illustrated by C6. Their exclusion is necessary and sufficient under faithful Pauli realisation. Sector-wise freeness is a different property.';
const text=(x,y,s,size=23,col=ink)=>`<text class="og-hide" x="${x}" y="${y}" text-anchor="middle" font-family="Arial,sans-serif" font-size="${size}" fill="${col}">${s}</text>`;
function graph(p,e,c){return e.map(([i,j])=>`<path d="M${p[i]} L${p[j]}" stroke="${c}" stroke-width="4"/>`).join('')+p.map(([x,y])=>`<circle cx="${x}" cy="${y}" r="11" fill="${c}" stroke="${bg}" stroke-width="3"/>`).join('');}
function cover(){let s='';
 s+=text(600,44,'WHOLE-SPECTRUM FREENESS AT EVERY COUPLING',23,muted);
 s+=graph([[210,208],[125,122],[120,285],[315,208]],[[0,1],[0,2],[0,3]],gold);
 const hex=Array.from({length:6},(_,i)=>[565+91*Math.cos(i*Math.PI/3),207+91*Math.sin(i*Math.PI/3)]);
 s+=graph(hex,hex.map((_,i)=>[i,(i+1)%6]),gold);
 s+=text(210,335,'No induced claw',25)+text(565,335,'No induced even hole',25);
 s+=`<path d="M748 95 V320" stroke="${muted}" stroke-opacity=".3"/>`;
 s+=text(975,147,'Exactly the criterion',30,teal)+text(975,197,'for faithful Pauli terms',24)+text(975,244,'and independent couplings',22,muted);
 s+=text(600,378,'An even hole has no chords · C₆ illustrated · unrefereed candidate',19,muted);return s;}
function parity(){let s=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 740" role="img" aria-labelledby="title desc"><title id="title">Every allowed pattern occurs</title><desc id="desc">Exact witness with mode energies 1, 2 and 4. Positive parity gives energies minus five, minus three, one and seven. Negative parity gives minus seven, minus one, three and five. With irreducible dimension eight each allowed value occurs twice.</desc><rect width="900" height="740" rx="12" fill="${bg}"/>`;
 s+=text(450,65,'Support is not enough. Occupation matters.',33)+text(450,111,'Exact independent-set witness: modes 1, 2, 4',25,muted);
 for(const [k,vals,c,label] of [[0,[-5,-3,1,7],teal,'Positive parity: product of signs = +1'],[1,[-7,-1,3,5],gold,'Negative parity: product of signs = −1']]){
  const y=255+k*210; s+=text(450,y-70,label,26,c)+`<path d="M90 ${y} H810" stroke="${muted}" stroke-width="2"/>`;
  for(let v=-7;v<=7;v+=2){let x=100+(v+7)*50;s+=`<path d="M${x} ${y-5} V${y+5}" stroke="${muted}"/>`;s+=text(x,y+38,String(v).replace('-','−'),23,muted);}
  for(const v of vals){const x=100+(v+7)*50;s+=`<circle cx="${x}" cy="${y-12}" r="9" fill="${c}"/><circle cx="${x}" cy="${y+12}" r="9" fill="${c}"/>`;}
 }
 s+=text(450,585,'Trace projectors prove all four patterns occur.',27,teal)+text(450,637,'Two copies each when d = 8; in general, d/4.',25)+text(450,691,'The proposition states the graph and centrality assumptions.',21,muted);return s+'</svg>';}
function thumbnailHero(){return '<div class="eq-label">THE GRAPH CRITERION</div><div class="eq eq-sm">No claw.<br>No even hole.</div><div class="note"><b>A free whole spectrum</b><br>at every coupling.</div><div class="eq-foot">faithful Pauli realisation required</div>';}
module.exports={cover,parity,description,thumbnailHero};
