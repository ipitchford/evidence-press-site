'use strict';
// Exact m=2 simplex fibres in the one-layer construction.
// The report values zero attain the worst-case widths for the permitted menu.
const colors = ['#b3dcd7', '#f2c37d'];
const description = 'Three copies of the accounting simplex t0+t1+t2=1, with nonnegative coordinates. The target loss is b+t0 and the allowed reports are t1 and t2. At t1=0 the highlighted edge allows t0 to range from zero to one. At t2=0 another edge allows the same range. With both reports zero only the t0 vertex remains. Thus either report alone has worst-case residual width one, while both identify the loss. Other report values can already narrow the loss range. This is the exact synthetic one-layer construction, not banking data; a direct t0 report would identify the loss alone.';
function triangle(cx, which, a, b) {
  const top=[cx,104],left=[cx-125,290],right=[cx+125,290];
  const line=(p,q,color,width,opacity=1)=>`<path d="M${p.join(' ')}L${q.join(' ')}" fill="none" stroke="${color}" stroke-width="${width}" opacity="${opacity}" stroke-linecap="round"/>`;
  let s=`<path d="M${top.join(' ')}L${left.join(' ')}L${right.join(' ')}Z" fill="${a}" fill-opacity=".07" stroke="${a}" stroke-opacity=".36" stroke-width="1.8"/>`;
  for(let j=1;j<=3;j++){
    const f=j/4;
    s+=line([top[0]-125*f,top[1]+186*f],[top[0]+125*f,top[1]+186*f],a,.8,.14);
  }
  if(which===1)s+=line(top,right,b,6);
  if(which===2)s+=line(top,left,b,6);
  for(const [idx,p] of [top,left,right].entries()) {
    const active=which===3?idx===0:which===1?idx!==1:idx!==2;
    s+=`<circle cx="${p[0]}" cy="${p[1]}" r="${active?6:3.6}" fill="${active?b:a}" fill-opacity="${active?1:.55}"/>`;
  }
  if(which===3)s+=`<circle cx="${top[0]}" cy="${top[1]}" r="15" fill="none" stroke="${b}" stroke-opacity=".6" stroke-width="1.5"/>`;
  s+=`<g class="og-hide" fill="#e2ebe5" font-size="24"><text x="${cx}" y="80" text-anchor="middle">t₀</text><text x="${cx-145}" y="311" text-anchor="middle">t₁</text><text x="${cx+145}" y="311" text-anchor="middle">t₂</text></g>`;
  return s;
}
function draw(a=colors[0],b=colors[1]) {
  return `<g font-family="Arial,Helvetica,sans-serif">
    ${triangle(220,1,a,b)}${triangle(600,2,a,b)}${triangle(980,3,a,b)}
    <g class="og-hide" fill="#fff4e4" text-anchor="middle" font-size="31" font-family="Georgia,serif">
      <text x="220" y="39">t₁ = 0</text><text x="600" y="39">t₂ = 0</text><text x="980" y="39">t₁ = t₂ = 0</text>
    </g>
    <g class="og-hide" fill="${b}" text-anchor="middle" font-size="37" font-family="Georgia,serif">
      <text x="220" y="356">width 1</text><text x="600" y="356">width 1</text><text x="980" y="356">width 0</text>
    </g>
    <text class="og-hide" x="600" y="389" text-anchor="middle" font-size="20" fill="#d2dfd9">t₀ + t₁ + t₂ = 1 · loss = b + t₀ · allowed reports: t₁, t₂</text>
  </g>`;
}
function thumbnailHero(){
  return '<div class="eq-label">worst-case loss width</div><div style="font-family:Georgia,serif;font-size:96px;text-align:center;margin:24px 0">1 <span class="hl">→</span> 0</div><div class="note">Either report: <b>width 1</b><br>Both reports: <b>identified</b></div><div class="eq-foot">synthetic simplex · restricted report menu</div>';
}
module.exports={colors,description,draw,thumbnailHero};
