'use strict';
// Exact set-incidence diagram of manuscript Section 6.1, q_D.
// Positions express inclusion; they are not parameter-space distances.
const bg='#172933', ink='#f1f5ee', teal='#6ddbc4', gold='#f3c779', muted='#b8c8d0';
const sets=[[3],[1,3],[2,3],[1,2,3]];
const desc='At the manuscript’s exact double-boundary example q=(2/5,2/5,3/10,1/5), the nearby compatibility sets are {3}, {1,3}, {2,3}, and {1,2,3}. Every set contains orientation 3, but the complete set varies. Lines indicate set inclusion, not parameter-space distances. Conditional on the stated evolutionary model.';
function node(x,y,set,small=false){const r=small?32:40,gap=small?68:90;let s=`<g transform="translate(${x} ${y})">`;
 for(let k=1;k<=3;k++){const xx=(k-2)*gap,active=set.includes(k);s+=`<circle cx="${xx}" cy="0" r="${r}" fill="${active?(k===3?teal:gold):bg}" stroke="${active?(k===3?teal:gold):muted}" stroke-width="3" ${active?'':'stroke-dasharray="5 6" opacity=".45"'}/><text x="${xx}" y="${small?10:13}" text-anchor="middle" font-family="Arial,sans-serif" font-size="${small?28:35}" font-weight="700" fill="${active?bg:muted}" ${active?'':'opacity=".55"'}>${k}</text>`;}
 return s+'</g>';}
function cover(){let s=`<rect width="1200" height="400" fill="${bg}"/><g fill="none" stroke="${muted}" stroke-width="3" opacity=".45"><path d="M215 200 L520 95 L975 200 L520 305 Z"/></g>`;
 for(const [i,[x,y]] of [[190,200],[580,92],[580,308],[1010,200]].entries())s+=node(x,y,sets[i],true);
 return s;}
function boundary(){let s=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 1000" role="img" aria-labelledby="dg-title dg-desc"><title id="dg-title">One conclusion shared by four nearby answers</title><desc id="dg-desc">${desc}</desc><rect width="900" height="1000" fill="${bg}"/><g font-family="Arial, sans-serif" fill="${ink}"><text x="450" y="65" text-anchor="middle" font-size="35">Four nearby compatibility sets</text><text x="450" y="112" text-anchor="middle" font-size="25" fill="${muted}">Exact boundary example · manuscript §6.1</text>`;
 const labels=['{3}','{1, 3}','{2, 3}','{1, 2, 3}'];
 sets.forEach((set,i)=>{const y=212+i*150;s+=`<text x="180" y="${y+10}" text-anchor="end" font-size="32">${labels[i]}</text>`+node(470,y,set)+`<path d="M625 ${y} H700" stroke="${teal}" stroke-width="3"/>`;});
 s+=`<path d="M700 212 V662" stroke="${teal}" stroke-width="3"/><path d="M700 438 H758" stroke="${teal}" stroke-width="3"/><text x="778" y="448" font-size="38" fill="${teal}">3</text><path d="M70 757 H830" stroke="${muted}" opacity=".4"/><text x="450" y="814" text-anchor="middle" font-size="32" fill="${teal}">Orientation 3 is common to every set.</text><text x="450" y="869" text-anchor="middle" font-size="28">The complete answer is not locally constant.</text><text x="450" y="927" text-anchor="middle" font-size="23" fill="${muted}">q = (2/5, 2/5, 3/10, 1/5) · h = (0, 0, 1/50)</text><text x="450" y="970" text-anchor="middle" font-size="22" fill="${muted}">Model-conditional statement, not biological validation</text></g></svg>`;return s;}
function thumbnailHero(){return `<div class="eq-label">four nearby answers</div><div class="eq eq-sm">{3} · {1,3}</div><div class="eq eq-sm">{2,3} · {1,2,3}</div><div class="note"><b>One shared conclusion:</b><br>orientation 3 is compatible.</div><div class="eq-foot">conditional on the stated model</div>`;}
module.exports={cover,boundary,description:desc,thumbnailHero};
