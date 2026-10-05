'use strict';
exports.description='A two-reticulation K2,3 network has exactly the same 64 nucleotide-pattern probabilities as a three-leaf star tree. Amber nodes mark reticulations. The equality uses edge-specific continuous-time transition-biased K2P rates, not one shared prescribed rate ratio.';
exports.cover=(a,b)=>{
 const text=(x,y,t,n=24,c='#fff5e7')=>`<text class="og-hide" x="${x}" y="${y}" text-anchor="middle" font-family="Georgia,serif" font-size="${n}" fill="${c}">${t}</text>`;
 let s='<defs><marker id="k2p-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="4" markerHeight="4" orient="auto"><path d="M0 0L10 5L0 10Z" fill="'+b+'"/></marker></defs>';
 const pts={t0:[115,105],t1:[375,105],h0:[100,235],h1:[390,235],t2:[245,220],l1:[70,315],l2:[430,315],l3:[245,315]};
 for(const [u,v,ret]of [['t0','h0',1],['t1','h0',1],['t0','h1',1],['t1','h1',1],['t0','t2',0],['t1','t2',0],['h0','l1',0],['h1','l2',0],['t2','l3',0]]){const [x,y]=pts[u],[X,Y]=pts[v];s+=`<path d="M${x} ${y}L${X} ${Y}" stroke="${ret?b:a}" stroke-width="3.5" opacity=".85" ${ret?'marker-end="url(#k2p-arrow)"':''}/>`;}
 for(const [id,[x,y]]of Object.entries(pts)){s+=`<circle cx="${x}" cy="${y}" r="${id.startsWith('h')?9:6}" fill="${id.startsWith('h')?b:a}" stroke="#1e2330" stroke-width="2"/>`;if(id.startsWith('l'))s+=text(x,y+30,id.slice(1),22);}
 s+=text(245,47,'TWO RETICULATIONS',23)+text(245,385,'a network',25,a);
 s+=text(615,130,'64 = 64',51,a)+text(615,178,'exact pattern',25)+text(615,210,'probabilities',25)+text(615,292,'same observable law',22);
 for(const [x,y]of [[865,290],[1020,290],[1135,290]])s+=`<path d="M1000 132L${x} ${y}" stroke="${a}" stroke-width="4"/><circle cx="${x}" cy="${y}" r="7" fill="${a}"/>`;
 s+='<circle cx="1000" cy="132" r="9" fill="'+a+'"/>';
 return s+text(1000,47,'ONE TREE',23)+text(865,323,'1',22)+text(1020,323,'3',22)+text(1135,323,'2',22)+text(1000,385,'edge-specific K2P',25,b);
};
