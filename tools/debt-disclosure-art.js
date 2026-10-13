'use strict';
exports.description='Two hypothetical £100 billion portfolios have the same four-year average maturity: all debt at year four, or £50 billion now and £50 billion at year eight. Under a one-percentage-point rate rise with like-for-like refinancing, their first-year extra costs are £0 and £0.5 billion. Circle area represents principal; horizontal position represents maturity.';
// Source: manuscript, identification counterexample, £bn and model years.
// Area of the circles encodes principal; horizontal position encodes maturity.
exports.draw = () => {
  const ink='#fff6e7', dim='#d6c8b9', first='#f3c16b', second='#e59b9c';
  const text=(x,y,s,n=22,c=ink,anchor='start')=>`<text class="og-hide" x="${x}" y="${y}" fill="${c}" font-family="Georgia,serif" font-size="${n}" text-anchor="${anchor}">${s}</text>`;
  const dot=(x,y,r,c)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${c}" fill-opacity=".16" stroke="${c}" stroke-width="3"/>`;
  let s=text(56,43,'SAME £100bn TOTAL · SAME 4-YEAR AVERAGE',20,dim);
  s+='<path d="M630 72 V325" stroke="#ead7c3" stroke-opacity=".22"/>';
  s+=text(675,45,'FIRST-YEAR EXTRA COST',20,dim);
  s+=text(60,99,'A',26,first)+text(60,228,'B',26,second);
  for(const [y,c] of [[150,first],[280,second]]){
    s+=`<path d="M110 ${y} H565" stroke="${c}" stroke-opacity=".45" stroke-width="2"/>`;
    for(const [x,n] of [[120,0],[340,4],[560,8]])s+=`<path d="M${x} ${y-5} V${y+6}" stroke="${dim}" stroke-opacity=".65"/>`;
  }
  s+=dot(340,150,38,first)+text(340,157,'100',23,first,'middle');
  s+=dot(120,280,27,second)+text(120,287,'50',21,second,'middle');
  s+=dot(560,280,27,second)+text(560,287,'50',21,second,'middle');
  s+=`<path d="M120 316 V335 M340 316 V335 M560 316 V335" stroke="${dim}" stroke-opacity=".3"/>`;
  s+=text(120,359,'now',19,dim,'middle')+text(340,359,'4 years',19,dim,'middle')+text(560,359,'8 years',19,dim,'middle');
  s+=text(730,162,'£0',67,first)+text(730,288,'£0.5bn',67,second);
  s+=`<path d="M680 146 H706 M698 138 L706 146 L698 154 M680 273 H706 M698 265 L706 273 L698 281" stroke="${dim}" stroke-width="2.5" fill="none"/>`;
  s+=text(679,353,'+1 percentage point · like-for-like refinancing',20,dim);
  return s;
};
exports.thumbnailHero=()=>'<div style="text-align:center;font-family:Georgia;color:var(--ink)"><div style="font-size:28px;opacity:.8">Same total. Same average.</div><div style="font-size:72px;margin:20px 0">£0 <span style="font-size:33px">or</span> £0.5bn</div><div style="font-size:27px;opacity:.85">first-year cost of a 1-point rise<br>in a declared refinancing model</div></div>';
