'use strict';
// Labelled case-split diagram; schematic geometry, not certificate data.
const circle = (x, y, r, c, opacity = 1) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}" opacity="${opacity}"/>`;
const path = (d, c, width = 2, opacity = 1) => `<path d="${d}" fill="none" stroke="${c}" stroke-width="${width}" opacity="${opacity}" stroke-linecap="round"/>`;
const ink = '#f4efe6';
module.exports = {
    colors: ['#e4b96b', '#87c8dc'],
    description: 'The historical upper bound115 narrows to112. Two seven-layer cycle schematics show the exhaustive cases for two maximum33-point bands: sharing a layer, or disjoint. The exact independence number remains between108 and112. Source: normalization lemma and main theorem of the revised paper.',
    draw(a, b) {
      let s = `<text class="og-hide" x="68" y="91" font-family="system-ui" font-size="20" letter-spacing="2" fill="${ink}">UPPER BOUND</text>`;
      s += `<text class="og-hide" x="65" y="177" font-family="Georgia" font-size="67" fill="${a}">115 → 112</text>`;
      s += `<path d="M70 205 H360" stroke="${ink}" stroke-opacity=".22"/>`;
      s += `<text class="og-hide" x="68" y="249" font-family="system-ui" font-size="23" fill="${ink}">108–112 remains open</text>`;
      s += `<text class="og-hide" x="68" y="293" font-family="system-ui" font-size="18" fill="${ink}" opacity=".65">113 forces two 33-bands</text>`;
      for (const [cx, hi, label] of [[610, [0,1], 'share a layer'], [965, [0,3], 'disjoint']]) {
        const pts=Array.from({length:7},(_,i)=>[cx+94*Math.cos(-Math.PI/2+i*2*Math.PI/7),193+94*Math.sin(-Math.PI/2+i*2*Math.PI/7)]);
        for(let i=0;i<7;i++){
          const p=pts[i],q=pts[(i+1)%7], selected=hi.includes(i);
          s+=path(`M${p[0]} ${p[1]} L${q[0]} ${q[1]}`, selected?a:b, selected?8:2, selected?1:.35);
          if(selected){const mx=(p[0]+q[0])/2,my=(p[1]+q[1])/2;const vx=mx-cx,vy=my-193,vl=Math.hypot(vx,vy);s+=`<text class="og-hide" x="${mx+vx/vl*28}" y="${my+vy/vl*28+7}" text-anchor="middle" font-family="Georgia" font-size="25" fill="${a}">33</text>`;}
        }
        pts.forEach(([x,y],i)=>{s+=circle(x,y,8,ink);});
        s+=`<text class="og-hide" x="${cx}" y="360" text-anchor="middle" font-family="system-ui" font-size="25" fill="${ink}">${label}</text>`;
      }
      s+=`<text class="og-hide" x="790" y="54" text-anchor="middle" font-family="system-ui" font-size="20" letter-spacing="1.5" fill="${ink}" opacity=".7">TWO EXHAUSTIVE CASES</text>`;
      return s;
    }
  };
