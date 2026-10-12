'use strict';
// Families Theorem1: exact parameter classification and uniform exclusion witnesses.
exports.draw=function(){
 const gold='#f5cd82',ink='#fff4e4',muted='#d3bfa7',bad='#d28d83';
 let s=`<text class="og-hide" x="62" y="50" fill="${muted}" font-family="sans-serif" font-size="17" letter-spacing="2">FOUR PARAMETER CLASSES · ONE EXACT CRITERION</text>`;
 const pts=[[190,142],[390,142],[390,304],[190,304]];
 s+=`<path d="M190 142 H390 V304 H190 Z" fill="none" stroke="${muted}" stroke-width="2" opacity=".45"/>`;
 for(let r=0;r<4;r++){
  const [x,y]=pts[r],c=r<2?gold:bad;
  s+=`<circle cx="${x}" cy="${y}" r="42" fill="${c}" fill-opacity="${r<2?'.18':'.05'}" stroke="${c}" stroke-width="${r<2?3:1.5}"/><text x="${x}" y="${y+14}" text-anchor="middle" fill="${c}" font-family="Georgia,serif" font-size="44">${r}</text>`;
 }
 s+=`<text class="og-hide" x="290" y="217" text-anchor="middle" fill="${ink}" font-family="Georgia,serif" font-size="27">ℓ modulo 4</text><text class="og-hide" x="290" y="250" text-anchor="middle" fill="${muted}" font-family="sans-serif" font-size="18">gold: every n works</text>`;
 s+=`<path d="M506 94 V348" stroke="${muted}" opacity=".25"/>`;
 s+=`<text class="og-hide" x="566" y="132" fill="${ink}" font-family="Georgia,serif" font-size="38">p̄ℓ(4n + 3) ≡ 0 (mod 8)</text><text class="og-hide" x="566" y="181" fill="${muted}" font-family="sans-serif" font-size="23">for every n ≥ 0</text><text class="og-hide" x="566" y="236" fill="${gold}" font-family="Georgia,serif" font-size="36">exactly when ℓ ≡ 0 or 1 (mod 4)</text>`;
 s+=`<text class="og-hide" x="566" y="301" fill="${bad}" font-family="sans-serif" font-size="21">Class 2: remainder 4 at N = ℓ + 1</text><text class="og-hide" x="566" y="340" fill="${bad}" font-family="sans-serif" font-size="21">Class 3: remainder 2 at N = ℓ</text>`;
 return s;
};
