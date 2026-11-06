'use strict';
const text=(x,y,size,fill,s,anchor='start')=>`<text x="${x}" y="${y}" font-size="${size}" fill="${fill}" text-anchor="${anchor}">${s}</text>`;
exports.entropy=(a,b)=>`<g font-family="Georgia,serif">
${text(70,64,27,'#fff5e7','A universal hierarchy has one surviving order')}
<path d="M90 230 H1110" stroke="${a}" stroke-width="8" stroke-linecap="round"/>
<circle cx="90" cy="230" r="9" fill="#20232a" stroke="${a}" stroke-width="3"/>
<path d="M1098 220 L1114 230 L1098 240" fill="none" stroke="${a}" stroke-width="3"/>
<path d="M690 230 V108" stroke="${b}" stroke-width="3"/>
<circle cx="690" cy="230" r="23" fill="${b}" stroke="#fff9ec" stroke-width="3"/>
${text(690,98,30,b,'Every derivative, every input','middle')}
${text(90,276,25,'#fff5e7','0','middle')}${text(390,276,25,'#fff5e7','1','middle')}${text(690,283,42,b,'2','middle')}
<path d="M390 221 V239" stroke="#fff5e7" stroke-width="2"/>
${text(1080,276,26,'#fff5e7','α','middle')}
${text(80,181,28,a,'Counterexamples exist')}${text(825,181,28,a,'Counterexamples exist')}
${text(390,319,21,'#e5dad2','Shannon case: inherited','middle')}
${text(70,370,22,'#e5dad2','Positive entropy orders · densities may differ between counterexamples')}
</g>`;
exports.gradient=(a,b)=>`<g font-family="Georgia,serif">
${text(65,58,28,'#fff5e7','Ordinary objective gap remaining after two steps')}
${text(65,100,22,'#e5dad2','Exact three-mode example: eigenvalues 1, 60, 100')}
<path d="M300 145 V330 M1020 145 V330" stroke="#fff5e7" opacity=".15"/>
${text(65,180,27,b,'Actual')}
<rect x="300" y="146" width="674.0184168" height="50" rx="8" fill="${b}"/>
${text(995,180,28,b,'93.61%')}
${text(65,270,27,a,'Proposed bound')}
<rect x="300" y="236" width="664.6419936" height="50" rx="8" fill="${a}" opacity=".7"/>
${text(995,270,28,a,'92.31%')}
${text(300,325,21,'#e5dad2','0%')}${text(1020,325,21,'#e5dad2','100%','middle')}
${text(65,376,23,'#fff5e7','0.93613669 &gt; 0.92311388 · exact fractions establish the difference')}
</g>`;
exports.colors=['#f3a897','#ffe1a4'];
