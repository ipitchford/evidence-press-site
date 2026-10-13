'use strict';
// Exact analytic curve from paper.tex, eq:mean-tail; illustration, not observations.
// alpha=2, means 4 and 20. Decimal labels round UP, preserving the inequality.
exports.bound = (x, mean, alpha=2) => Math.exp(-x*x/(2*alpha*(mean+x)));
exports.description = 'Candidate upper-tail bounds at covariance parameter alpha equals two. The gold curve uses mean four and the coral curve mean twenty. At an excess of twelve their bounds, rounded upwards, are 0.1054 and 0.3247. These are analytic bound evaluations for illustrative parameters, not observed probabilities or claims of sharpness.';
exports.colors = ['#f2cc80', '#e5a2a0'];
exports.draw = (gold, coral) => {
  const ink='#fff5e7', dim='#d6d8cd', X=x=>88+31*x, Y=y=>322-227*y;
  const text=(x,y,s,n=23,c=ink,anchor='start')=>`<text class="og-hide" x="${x}" y="${y}" fill="${c}" font-family="Georgia,serif" font-size="${n}" text-anchor="${anchor}">${s}</text>`;
  let s=text(60,45,'SAME DEPENDENCE CONTROL · DIFFERENT MEANS',21,dim);
  s+=`<path d="M675 80 V340" stroke="${dim}" stroke-opacity=".22"/>`;
  s+=text(88,80,'Upper bound',21,dim);
  for(const y of [0,.5,1]) {
    s+=`<path d="M88 ${Y(y)} H584" stroke="${dim}" stroke-opacity="${y===0?.45:.15}"/>`;
    s+=text(70,Y(y)+7,String(y),19,dim,'end');
  }
  for(const x of [0,4,8,12,16])s+=text(X(x),350,String(x),19,dim,'middle');
  s+=text(335,385,'Excess above the mean, x',22,dim,'middle');
  for(const [m,c] of [[20,coral],[4,gold]]){
    const points=Array.from({length:161},(_,i)=>`${X(i/10).toFixed(2)},${Y(exports.bound(i/10,m)).toFixed(2)}`).join(' ');
    s+=`<polyline points="${points}" fill="none" stroke="${c}" stroke-width="4.2" stroke-linecap="round"/>`;
  }
  s+=text(343,159,'m = 20',25,coral)+text(183,229,'m = 4',25,gold);
  s+=`<path d="M${X(12)} 95 V322" stroke="${ink}" stroke-opacity=".38" stroke-dasharray="4 7"/>`;
  for(const [m,c] of [[20,coral],[4,gold]])s+=`<circle cx="${X(12)}" cy="${Y(exports.bound(12,m))}" r="7" fill="${c}" stroke="#102b30" stroke-width="2"/>`;
  s+=text(720,104,'EXCESS OF 12 · α = 2',22,dim);
  s+=text(720,171,'m = 4',27,gold)+text(900,171,'P ≤ 0.1054',39,gold);
  s+=text(720,253,'m = 20',27,coral)+text(900,253,'P ≤ 0.3247',39,coral);
  s+=text(720,320,'Smaller mean. Tighter bound.',26,ink);
  s+=text(720,363,'candidate inequality · not observed tails',19,dim);
  return s;
};
exports.thumbnailHero = () => '<div style="text-align:center;font-family:Georgia;color:var(--ink)"><div style="font-size:24px;opacity:.85">EXCESS OF 12 · α = 2</div><div style="font-size:23px;margin-top:18px">mean 4<br><span style="font-size:53px;color:var(--accent)">P ≤ 0.1054</span></div><div style="font-size:23px;margin-top:16px">mean 20<br><span style="font-size:53px">P ≤ 0.3247</span></div><div style="font-size:23px;margin-top:19px;opacity:.8">candidate upper-tail bounds<br>not observed probabilities</div></div>';
