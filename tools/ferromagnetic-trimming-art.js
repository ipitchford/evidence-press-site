'use strict';
// Source: manuscript deterministic trimming, residual-clock identity and comparison bound.
// Both drawings have the same illustrative topology; neither is a simulated instance.
const colors=['#f2c579','#acdfd1'];
const description='A schematic graph before and after analytical pinning. Gold vertices form a deterministic set T selected for large degree or bias. After burn-in, each has zero-spin probability at most delta. In the auxiliary comparison they are pinned to one; retained vertices have controlled conditional marginals. The original-chain error is bounded by residual mixing, trajectory exit probability and stationary conditioning cost. The actual sampler is unchanged, with uniformly chosen single-site updates. The candidate near-linear bound holds strictly below the stated field threshold, not at its endpoint.';
function network(cx,cy,pinned,a,b){
 const pts=Array.from({length:6},(_,i)=>{const t=i*Math.PI/3-.5*Math.PI;return[cx+58*Math.cos(t),cy+58*Math.sin(t)];});
 const outer=[[cx,cy-112],[cx-103,cy+67],[cx+103,cy+67]];
 let s='';
 for(let i=0;i<6;i++){const[x,y]=pts[i],[u,v]=pts[(i+1)%6];s+=`<path d="M${x} ${y}L${u} ${v}" stroke="${b}" stroke-width="2.3" fill="none" opacity=".8"/>`;}
 for(const[x,y]of outer)for(const[u,v]of pts)s+=`<path d="M${x} ${y}L${u} ${v}" stroke="${a}" stroke-width="1.25" fill="none" opacity="${pinned?.14:.36}" ${pinned?'stroke-dasharray="3 5"':''}/>`;
 if(pinned)s+=`<circle cx="${cx}" cy="${cy}" r="78" fill="${b}" fill-opacity=".045" stroke="${b}" stroke-width="1.3" stroke-dasharray="4 5" opacity=".8"/>`;
 for(const[x,y]of pts)s+=`<circle cx="${x}" cy="${y}" r="8.5" fill="${b}" stroke="#1e333e" stroke-width="2"/>`;
 for(const[x,y]of outer)s+=`<circle cx="${x}" cy="${y}" r="16" fill="${a}"/><text x="${x}" y="${y+6}" text-anchor="middle" fill="#25323b" font-family="Georgia,serif" font-size="18" font-weight="bold">${pinned?'1':'T'}</text>`;
 return s;
}
function draw(a=colors[0],b=colors[1]){
 const ivory='#fff6e8',muted='#d2e0e3';
 let s=`<g font-family="Arial,Helvetica,sans-serif"><text x="45" y="39" fill="${a}" font-size="17" letter-spacing="1.1">RARE DEVIATIONS · CONTROLLED CORE</text>`;
 s+=network(180,218,false,a,b)+network(560,218,true,a,b);
 s+=`<path d="M327 213H393M382 202L393 213L382 224" stroke="${ivory}" stroke-width="2.3" fill="none" opacity=".75"/>`;
 s+=`<text x="180" y="77" text-anchor="middle" fill="${ivory}" font-family="Georgia,serif" font-size="27">After burn-in</text><text x="560" y="77" text-anchor="middle" fill="${ivory}" font-family="Georgia,serif" font-size="27">Pin T to spin 1</text>`;
 s+=`<text x="180" y="329" text-anchor="middle" fill="${a}" font-size="21">Pr(xᵥ = 0) ≤ δ</text><text x="180" y="355" text-anchor="middle" fill="${muted}" font-size="16">large degree or bias · v in T</text><text x="560" y="329" text-anchor="middle" fill="${b}" font-size="21">Controlled marginals</text><text x="560" y="355" text-anchor="middle" fill="${muted}" font-size="16">residual law · original update clock</text>`;
 s+=`<path d="M723 77V350" stroke="${muted}" opacity=".23"/><text x="776" y="100" fill="${ivory}" font-family="Georgia,serif" font-size="28">Original-chain error</text><text x="776" y="151" fill="${b}" font-size="25">≤ core mixing</text><text x="795" y="193" fill="${a}" font-size="25">+ trajectory exits</text><text x="795" y="235" fill="${muted}" font-size="25">+ conditioning cost</text><path d="M777 257H1150" stroke="${muted}" opacity=".27"/><text x="776" y="290" fill="${ivory}" font-size="19">Pins are for analysis.</text><text x="776" y="319" fill="${muted}" font-size="19">The actual sampler is unchanged.</text>`;
 s+=`<text x="45" y="386" fill="${muted}" font-size="14">schematic graph · proof mechanism, not simulation</text><text x="1150" y="386" text-anchor="end" fill="${a}" font-size="18">O(n log² n) single-site updates · fixed accuracy · λ &lt; λc</text></g>`;
 return s.replace(/<text /g,'<text class="og-hide" ');
}
function thumbnailHero(){return '<div class="eq-label">fixed accuracy · stated parameter envelope</div><div style="font-family:Georgia,serif;font-size:70px;text-align:center;margin-top:30px">O(n log²n)</div><div style="text-align:center;font-size:31px;margin-top:22px">single-site updates</div><div style="text-align:center;font-size:42px;margin-top:32px">λ &lt; λ<sub>c</sub></div><div class="eq-foot">parameter-dependent bound · endpoint open</div>';}
module.exports={colors,description,draw,thumbnailHero};
