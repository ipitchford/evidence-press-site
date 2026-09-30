'use strict';
exports.description='Three nine-site blocks meet around one triangle, forming a 21-site local union. The candidate combines two blocks before comparing with the third, and 54 validated local positivity tests feed a size-independent gap above 0.0051 for the stated volumes. Abstract local graph, not a full lattice or a measured spectrum.';
exports.cover=(a,b)=>{
 const colors=[a,b,'#c6b3ed'],white='#faf7f2',muted='#d8d5df';let s='<g font-family="Arial,sans-serif">';
 const X=255,Y=205,scale=48;
 const pt=(x,y,t=0)=>[X+scale*(x*Math.cos(t)-y*Math.sin(t)),Y-scale*(x*Math.sin(t)+y*Math.cos(t))];
 const path=ps=>ps.map((p,i)=>(i?'L':'M')+p.join(' ')).join(' ')+'Z';
 s+=`<path d="${path([[0,1],[-Math.sqrt(3)/2,-.5],[Math.sqrt(3)/2,-.5]].map(p=>pt(...p)))}" fill="${white}" fill-opacity=".13" stroke="${white}" stroke-width="3"/>`;
 for(let k=0;k<3;k++){
 const t=k*2*Math.PI/3,col=colors[k],p=(x,y)=>pt(x,y,t),triangles=[[[0,1],[-.5,1.8],[.5,1.8]],[[-.5,1.8],[-1.1,2.5],[-.15,2.7]],[[.5,1.8],[.15,2.7],[1.1,2.5]]];
 for(const tri of triangles)s+=`<path d="${path(tri.map(v=>p(...v)))}" fill="${col}" fill-opacity=".10" stroke="${col}" stroke-width="2.2"/>`;
 for(const q of [[0,1],[-.5,1.8],[.5,1.8],[-1.1,2.5],[-.15,2.7],[.15,2.7],[1.1,2.5]]){const[x,y]=p(...q);s+=`<circle cx="${x}" cy="${y}" r="4.2" fill="${col}" stroke="${white}" stroke-width=".5"/>`;}
 }
 s+=`<text x="255" y="58" text-anchor="middle" fill="${white}" font-size="24">THREE OVERLAPPING BLOCKS</text><text x="255" y="212" text-anchor="middle" fill="${white}" font-family="Georgia" font-size="24">U</text><text x="255" y="373" text-anchor="middle" fill="${muted}" font-size="20">21 sites · abstract local graph</text>`;
 s+=`<path d="M470 204H528m-12-9 12 9-12 9" stroke="${muted}" stroke-width="2" fill="none" opacity=".7"/>`;
 s+=`<text x="720" y="83" text-anchor="middle" fill="${white}" font-size="24">GROUP TWO, THEN COMPARE</text>`;
 for(const [x,c,n]of [[613,a,'1'],[694,b,'2'],[812,colors[2],'3']])s+=`<circle cx="${x}" cy="165" r="25" fill="${c}" fill-opacity=".12" stroke="${c}" stroke-width="2.5"/><text x="${x}" y="173" text-anchor="middle" fill="${white}" font-size="24">${n}</text>`;
 s+=`<path d="M578 204v12h151v-12 M740 165h33" stroke="${muted}" stroke-width="2" fill="none"/><text x="717" y="269" text-anchor="middle" fill="${a}" font-family="Georgia" font-size="36">54 validated tests</text><text x="717" y="308" text-anchor="middle" fill="${muted}" font-size="20">15 pair + 35 triple + 4 block</text>`;
 s+=`<path d="M899 81v242" stroke="${muted}" opacity=".25"/><text x="1040" y="122" text-anchor="middle" fill="${white}" font-size="22">UNIFORM GAP</text><text x="1040" y="203" text-anchor="middle" fill="${b}" font-family="Georgia" font-size="42">Δ &gt; 0.0051</text><text x="1040" y="263" text-anchor="middle" fill="${muted}" font-size="19">does not shrink</text><text x="1040" y="291" text-anchor="middle" fill="${muted}" font-size="19">with system size</text><text x="920" y="369" text-anchor="middle" fill="${muted}" font-size="18">specified tori and edge-union patches</text></g>`;
 return s.replace(/<text /g,'<text class="og-hide" ');
};
