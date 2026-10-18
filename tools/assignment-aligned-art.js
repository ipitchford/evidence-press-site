'use strict';
// Labelled scientific diagram; separate from the image-led motif contract.
const circle = (x, y, r, c, opacity = 1) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}" opacity="${opacity}"/>`;
const path = (d, c, width = 2, opacity = 1) => `<path d="${d}" fill="none" stroke="${c}" stroke-width="${width}" opacity="${opacity}" stroke-linecap="round"/>`;
const ink = '#f4efe6';
module.exports = {
    colors: ['#8cddcc', '#f5c47e'],
    description: 'Unit 81 on the fresh same-checkpoint bank: ranking AUROC 0.992, but threshold 0.5 detects 88 of 125 positives. A separate schematic shows that equal current reports can have different Boolean clause-edit outcomes; the three tests are not interchangeable.',
    draw(a,b) {
      const text=(x,y,t,size=23,c=ink)=>`<text class="og-hide" x="${x}" y="${y}" fill="${c}" font-family="Arial,sans-serif" font-size="${size}">${t}</text>`;
      let s=text(55,62,'RANKING',23,a)+text(55,143,'0.992',67,a)+text(55,181,'AUROC · unit 81',21);
      s+=text(420,62,'THRESHOLD',23,b)+text(420,143,'88 / 125',56,b)+text(420,181,'positives detected · cutoff 0.5',20);
      s+=`<rect x="55" y="232" width="643" height="38" rx="4" fill="${b}" opacity=".3"/><rect x="55" y="232" width="${643*88/125}" height="38" rx="4" fill="${a}" opacity=".85"/>`;
      s+=text(55,310,'Strong ranking does not guarantee threshold fidelity.',23)+text(55,354,'Fresh balanced bank · same checkpoint',18,'#c9c4bd');
      s+=path('M755 62 V343',ink,1,.22)+text(805,62,'EDIT SUFFICIENCY',23,b);
      s+=`<rect x="810" y="106" width="288" height="57" rx="12" fill="none" stroke="${a}" stroke-width="2"/>`+text(838,143,'Same current report',22);
      s+=path('M954 164 V198 M954 198 L858 239 M954 198 L1050 239',b,2);
      s+=circle(858,263,22,a,.8)+circle(1050,263,22,b,.8)+text(819,313,'SAT',22,a)+text(1003,313,'UNSAT',22,b)+text(805,354,'Separate Boolean edit witness',18,'#c9c4bd');
      return s;
    }
  };
