'use strict';
const description='At matrix order eight the graph code has sixteen coordinates. Under the binary coefficient-span bound e at most three, the theorem gives a subcode of dimension at least two supported on at most eight coordinates, forcing minimum distance at most seven. The support diagram is schematic. Over the sixteen-element field a classical Cauchy construction instead attains distance nine; it has coefficient-span dimension four and lies outside that hypothesis.';
const text=(x,y,s,n=25,c='#dcebe5',anchor='middle')=>`<text class="og-hide" x="${x}" y="${y}" text-anchor="${anchor}" font-family="Arial,sans-serif" font-size="${n}" fill="${c}">${s}</text>`;
function cover(){
 const teal='#61d9c0',gold='#f0c274';let s=text(250,49,'A SUBCODE ON HALF THE COORDINATES',22,teal);
 const pts=Array.from({length:16},(_,i)=>{const a=-Math.PI/2+i*Math.PI/8;return [250+125*Math.cos(a),204+112*Math.sin(a)];});
 for(let i=0;i<8;i++){const [x,y]=pts[i], [xx,yy]=pts[i+8];s+=`<path d="M${x} ${y} Q250 204 ${xx} ${yy}" fill="none" stroke="#79938c" opacity=".18"/>`;}
 s+=`<ellipse cx="250" cy="204" rx="125" ry="112" fill="none" stroke="#73918a" stroke-width="1.5"/>`;
 pts.forEach(([x,y],i)=>{const on=i%2===0;s+=`<circle cx="${x}" cy="${y}" r="${on?9:5}" fill="${on?teal:'#526b68'}"/>`;});
 s+=text(250,189,'16 → 8',42,teal)+text(250,231,'coordinates',23)+text(250,355,'dimension ≥ 2 · support schematic',21);
 s+=`<path d="M423 203 H511 m-13 -10 13 10 -13 10" fill="none" stroke="#a9bdb5" stroke-width="2"/>`;
 s+=text(669,91,'FIELD OF 8 SYMBOLS',23,teal)+text(669,186,'d ≤ 7',60,teal)+text(669,240,'Li–Wang attains 7',23)+text(669,292,'coefficient span e ≤ 3',21)+`<path d="M852 70 V320" stroke="#79938c" opacity=".45"/>`;
 s+=text(1013,91,'FIELD OF 16',23,gold)+text(1013,186,'d = 9',54,gold)+text(1013,240,'Cauchy construction',22)+text(1013,292,'e = 4: outside the bound',20);
 s+=text(845,363,'Same matrix order n = 8 · different coefficient rank',22);
 return s;
}
module.exports={cover,description};
