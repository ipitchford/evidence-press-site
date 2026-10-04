'use strict';
exports.description='Three paired three-level systems and a parameter line from minus one to one. The threshold at minus one half separates three-copy distillability from three-copy undistillability, with the endpoint included on the undistillable side. Candidate claim only.';
exports.cover=(a,b)=>{
 let s='<g font-family="Georgia,serif" fill="#f6f0e8">';
 s+='<text x="280" y="62" text-anchor="middle" font-size="29">Three copies · three levels</text>';
 for(let k=0;k<3;k++){let x=145+135*k; s+=`<rect x="${x-45}" y="116" width="90" height="164" rx="15" fill="${a}" fill-opacity=".07" stroke="${a}" stroke-width="2"/>`;for(let j=0;j<3;j++){let y=147+j*50;s+=`<path d="M${x-22} ${y} H${x+22}" stroke="${a}" opacity=".45" stroke-width="2"/><circle cx="${x-25}" cy="${y}" r="9" fill="${a}"/><circle cx="${x+25}" cy="${y}" r="9" fill="${b}"/>`;}}
 s+='<text x="280" y="341" text-anchor="middle" font-size="23">all complex rank-two tests</text>';
 const x0=605,x1=1135,cut=x0+(x1-x0)/4;
 s+=`<path d="M${x0} 201 H${cut}" stroke="${b}" stroke-width="13"/><path d="M${cut} 201 H${x1}" stroke="${a}" stroke-width="13"/><circle cx="${cut}" cy="201" r="13" fill="${a}" stroke="#fff" stroke-width="3"/><path d="M${cut} 170 V128" stroke="#eee" stroke-width="2"/>`;
 s+='<text x="870" y="62" text-anchor="middle" font-size="29">The three-copy threshold</text>';
 s+=`<text x="${cut}" y="113" text-anchor="middle" font-size="34">α = −½</text><text x="650" y="255" text-anchor="middle" font-size="22" fill="${b}">distillable</text><text x="970" y="255" text-anchor="middle" font-size="22" fill="${a}">undistillable</text>`;
 for(const [x,t] of [[x0,'−1'],[x1,'1']])s+=`<text x="${x}" y="177" text-anchor="middle" font-size="21">${t}</text>`;
 s+='<text x="870" y="341" text-anchor="middle" font-size="21">endpoint included · candidate theorem</text></g>';
 return s.replace(/<text /g,'<text class="og-hide" ');
};
exports.thumbnailHero=()=>'<div class="eq-label">THREE COPIES · QUTRITS</div><div class="eq">α = −½</div><div class="note"><b>An exact boundary.</b><br>Below: distillable.<br>At and above: undistillable.</div><div class="eq-foot">716 exact multipliers · candidate theorem</div>';
