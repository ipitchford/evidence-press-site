'use strict';

// Source: the manuscript's N=7, K=145 reciprocal-quartic example.
// Every curve point evaluates H(t); root markers use the exact radical formula.
// The graph conveys an equilibrium condition, not time evolution or stability.
exports.description = 'Three species and five quadratic mass-action reactions can have four positive nondegenerate equilibria. The actual function H(t) = (t+1)^2 (t+49)^2 / (t (t+7)^2) crosses the horizontal level 145 at four positive values, approximately 1.836, 3.893, 12.586 and 26.685. The horizontal axis is logarithmic. Identical markers indicate equilibria, without asserting that all four are stable. The example uses N=7 and K=145.';

const ink = '#f8f3e8';
const muted = '#c3d9d7';
const esc = value => String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const text = (x, y, value, size=22, fill=ink, anchor='start', family='Georgia,serif', extra='') =>
  `<text class="og-hide" x="${x}" y="${y}" text-anchor="${anchor}" font-family="${family}" font-size="${size}" fill="${fill}" ${extra}>${esc(value)}</text>`;

function H(t) { return ((t + 1) * (t + 49))**2 / (t * (t + 7)**2); }
function roots() {
  return [45 - Math.sqrt(145), 45 + Math.sqrt(145)].flatMap(twiceQ => {
    const q = twiceQ / 2, d = Math.sqrt(q*q - 196);
    return [(q-d)/2, (q+d)/2];
  }).sort((a,b) => a-b);
}

function plot({left, top, width, height, curve, root, compact=false}) {
  const low = 1.5, high = 49 / low, minY = 143.7, maxY = 147.5;
  const X = t => left + width*Math.log(t/low)/Math.log(high/low);
  const Y = y => top + height*(maxY-y)/(maxY-minY);
  const baseline = Y(145);
  let out = '';
  if (!compact) {
    for (const y of [144,145,146,147]) {
      out += `<path d="M${left} ${Y(y)}H${left+width}" stroke="${ink}" stroke-opacity="${y===145 ? '.13' : '.07'}"/>`;
      out += text(left-16,Y(y)+7,y,19,muted,'end','system-ui,sans-serif');
    }
  }
  out += `<path d="M${left} ${baseline}H${left+width}" stroke="${root}" stroke-width="${compact?2:2.5}" stroke-dasharray="8 7" opacity=".8"/>`;
  const points = Array.from({length:801},(_,i) => {
    const t=low*Math.exp(Math.log(high/low)*i/800);
    return `${i?'L':'M'}${X(t).toFixed(3)} ${Y(H(t)).toFixed(3)}`;
  }).join(' ');
  out += `<path d="${points}" fill="none" stroke="${curve}" stroke-width="${compact?3.3:4.5}" stroke-linecap="round" stroke-linejoin="round"/>`;
  roots().forEach((r,i) => {
    out += `<path d="M${X(r)} ${baseline+10}V${top+height}" stroke="${root}" stroke-width="1" stroke-dasharray="3 6" opacity=".35"/>`;
    out += `<circle cx="${X(r)}" cy="${baseline}" r="${compact?5.5:8}" fill="${root}" stroke="#193b3f" stroke-width="${compact?2:3}"/>`;
    if (!compact) out += text(X(r),baseline-20,String(i+1),20,root,'middle','system-ui,sans-serif');
  });
  out += `<path d="M${left} ${top+height}H${left+width}" stroke="${muted}" stroke-width="1" opacity=".5"/>`;
  if (!compact) {
    for (const t of [2,7,25]) {
      out += `<path d="M${X(t)} ${top+height}v6" stroke="${muted}"/>`;
      out += text(X(t),top+height+27,t,19,muted,'middle','system-ui,sans-serif');
    }
  }
  return out;
}

exports.cover = (curve, root) => {
  let out = text(60,68,'3 species',34,muted);
  out += text(60,135,'5 reactions',51,ink);
  out += `<path d="M79 161v39m-13-13 13 13 13-13" fill="none" stroke="${root}" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>`;
  out += text(60,264,'4 equilibria',58,root);
  out += text(63,306,'positive · nondegenerate',23,muted);
  out += text(63,368,'QUADRATIC MASS ACTION',17,muted,'start','system-ui,sans-serif','letter-spacing="1.5"');
  out += text(850,48,'Equilibrium condition: H(t) = 145',26,ink,'middle');
  out += plot({left:600,top:78,width:537,height:223,curve,root});
  out += text(1150,324,'t',23,ink);
  out += text(870,353,'logarithmic t axis',18,muted,'middle','system-ui,sans-serif');
  out += text(870,386,'H(t) = [(t + 1)(t + 49)]² / [t(t + 7)²]',21,ink,'middle');
  // The shared OG renderer places this SVG inline inside .art and crops its
  // 3:1 frame to 1200x630. Give that context a centred, complete graph so the
  // fourth crossing is preserved. Standalone banners retain their native art.
  const social = plot({left:415,top:81,width:540,height:224,curve,root,compact:true});
  // The standard social overlay is nearly opaque through the left third.
  // Its earlier fade keeps every root marker countable below the plain title.
  // This selector applies only when this artwork is inline in the OG template.
  return `<style>.quadratic-og-only{display:none}.art .quadratic-og-only{display:inline}.art:has(.quadratic-og-only)+.grad{background:linear-gradient(100deg,#151a1eee 8%,#151a1e55 28%,transparent 75%)}</style><g class="og-hide">${out}</g><g class="quadratic-og-only">${social}</g>`;
};

exports.thumbnailHero = () => {
  const graphic=plot({left:12,top:8,width:366,height:180,curve:'#a8ece4',root:'#f4c97c',compact:true});
  return `<div class="eq-label">3 SPECIES · 4 POSITIVE EQUILIBRIA</div><svg viewBox="0 0 390 207" style="display:block;width:100%" role="img" aria-label="The equilibrium function crosses one horizontal level four times">${graphic}</svg><div class="note">One exact equation.<br><b>Four distinct positive roots.</b></div><div class="eq-foot">Crossings count equilibria, not stable attractors.</div>`;
};

exports.data = {H, roots};
