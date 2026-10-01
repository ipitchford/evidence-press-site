'use strict';
// The nonedge matrix in manuscript (seed): columns are sources, rows targets.
const N = [[0,0,0,0,1,1],[0,0,0,0,0,1],[0,0,0,0,0,1],[1,1,0,0,1,0],[0,0,1,1,0,0],[0,0,0,1,1,0]];
exports.description = "Exact threshold for stable nonclique supports: sizes one to five are excluded, while Geneson's six-neuron graph supplies the sharp witness. The drawn arrows are precisely its missing directed edges, not its synapses. The certified expansion has sizes 6, 11, 16 and onward in steps of five, with size-dependent parameters and shrinking stability margin.";
exports.cover = (a,b) => {
  const points=Array.from({length:6},(_,i)=>[390+111*Math.cos(i*Math.PI/3-Math.PI/2),205+111*Math.sin(i*Math.PI/3-Math.PI/2)]);
  let s=`<defs><marker id="ctln-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L8 4L0 8Z" fill="${a}"/></marker></defs><g font-family="Arial,sans-serif"><g class="og-hide"><text x="46" y="61" fill="#faf7f2" font-size="26">STABLE NONCLIQUE SUPPORT</text><text x="56" y="176" fill="${b}" font-family="Georgia,serif" font-size="78">n ≤ 5</text><text x="58" y="220" fill="#ede6e0" font-size="25">ruled out</text><text x="58" y="268" fill="#c7c6d4" font-size="21">every legal</text><text x="58" y="296" fill="#c7c6d4" font-size="21">parameter pair</text></g>`;
  for(let i=0;i<6;i++)for(let j=0;j<6;j++)if(N[i][j]){
    let [x,y]=points[j],[X,Y]=points[i],dx=X-x,dy=Y-y,l=Math.hypot(dx,dy),off=N[j][i]?6:0;
    s+=`<path d="M${x+20*dx/l-off*dy/l} ${y+20*dy/l+off*dx/l} L${X-23*dx/l-off*dy/l} ${Y-23*dy/l+off*dx/l}" fill="none" stroke="${a}" stroke-width="1.8" opacity=".68" marker-end="url(#ctln-arrow)"/>`;
  }
  points.forEach(([x,y],i)=>{s+=`<circle cx="${x}" cy="${y}" r="18" fill="#192030" stroke="${a}" stroke-width="2.5"/><text x="${x}" y="${y+6}" text-anchor="middle" font-size="18" fill="#faf7f2">${i+1}</text>`;});
  s+=`<g class="og-hide"><text x="390" y="357" text-anchor="middle" fill="${a}" font-size="23">6 neurons suffice</text><text x="390" y="389" text-anchor="middle" fill="#c7c6d4" font-size="19">Geneson seed · missing-edge arrows</text><path d="M593 65V355" stroke="#c7c6d4" opacity=".2"/><text x="672" y="75" fill="#faf7f2" font-size="27">A CERTIFIED INFINITE FAMILY</text><path d="M705 168H1120" stroke="${a}" stroke-width="2"/>`;
  [6,11,16].forEach((n,i)=>{s+=`<circle cx="${720+i*153}" cy="168" r="${19+i*8}" fill="${a}" fill-opacity=".12" stroke="${a}" stroke-width="2"/><text x="${720+i*153}" y="240" text-anchor="middle" fill="#faf7f2" font-family="Georgia,serif" font-size="44">${n}</text>`;});
  s+=`<text x="1130" y="183" fill="${a}" font-size="43">…</text><text x="892" y="306" text-anchor="middle" fill="${b}" font-family="Georgia,serif" font-size="39">n = 5r + 6</text><text x="892" y="351" text-anchor="middle" fill="#ded8e4" font-size="23">size-dependent parameters</text><text x="892" y="383" text-anchor="middle" fill="#ded8e4" font-size="23">no uniform stability margin</text></g></g>`;
  return s;
};
exports.thumbnailHero=()=>`<div class="eq-label">STABLE NONCLIQUE SUPPORTS</div><div class="eq" style="font-size:100px">5 <span class="hl">→ 6</span></div><div class="note">Five or fewer: excluded.<br>Six: an exact witness.</div><div class="eq" style="font-size:45px;margin-top:25px">6 · 11 · 16 · …</div><div class="eq-foot">A family at size-dependent parameters.</div>`;
