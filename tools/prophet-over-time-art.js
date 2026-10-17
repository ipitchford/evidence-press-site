'use strict';
// Exact interval endpoints from the candidate certificates; axis is linear.
exports.colors=['#8de1d0','#ffd08a'];
exports.description='Schematic rent-or-commit timeline and a linear ratio axis. The certified limiting interval from 0.60922 to 0.609816 is strictly below the inverse golden ratio, about 0.618034. An explicitly enlarged inset displays the narrow interval. No exact constant or attained schedule is asserted.';
exports.draw=(a,b)=>{
 const x=v=>645+(v-.608)*450/.012,lo=x(.60922),hi=x(.609816),gold=x((Math.sqrt(5)-1)/2);
 let s='<g font-family="Georgia,serif" fill="#f5f1e8">';
 s+='<text x="62" y="67" font-size="30">Rent today. Or commit.</text>';
 s+='<text x="62" y="101" font-family="system-ui,sans-serif" font-size="16" fill="#cad9d8">ONE RESOURCE · UNKNOWN FUTURE OFFERS</text>';
 for(let i=0;i<7;i++){const px=65+i*65;s+=`<rect x="${px}" y="154" width="48" height="53" rx="7" fill="${a}" fill-opacity="${i<2?.22:.06}" stroke="${a}" stroke-opacity=".5"/><circle cx="${px+24}" cy="180" r="${i===2?8:3}" fill="${a}"/>`;}
 s+=`<path d="M89 221 V249 H154 V221 M219 221 V282 H479 V221" stroke="${a}" stroke-width="3" fill="none"/><text x="121" y="278" text-anchor="middle" font-size="19">one day</text><text x="349" y="316" text-anchor="middle" font-size="20">remaining season</text>`;
 s+='<path d="M529 197 H590 M579 187 L591 197 L579 207" fill="none" stroke="#b5c6c3" stroke-width="2"/>';
 s+='<text x="645" y="67" font-size="27">Below the inverse golden ratio</text><text x="645" y="101" font-family="system-ui,sans-serif" font-size="16" fill="#cad9d8">WORST-CASE EXPECTED REWARD RATIO</text>';
 s+=`<path d="M645 190 H1095" stroke="#a9c1be" stroke-width="2"/><rect x="${lo}" y="166" width="${hi-lo}" height="48" fill="${a}"/><path d="M${gold} 148 V221" stroke="${b}" stroke-width="3"/><text x="${gold}" y="139" text-anchor="middle" font-size="23" fill="${b}">1/φ</text><text x="${gold}" y="248" text-anchor="middle" font-family="system-ui,sans-serif" font-size="18">0.618034…</text><text x="645" y="219" font-family="system-ui,sans-serif" font-size="14">0.608</text><text x="1095" y="219" text-anchor="end" font-family="system-ui,sans-serif" font-size="14">0.620</text>`;
 s+=`<path d="M${lo} 214 L660 285 M${hi} 214 L900 285" stroke="${a}" opacity=".35" fill="none"/><rect x="660" y="284" width="240" height="14" rx="4" fill="${a}"/><path d="M660 276 V307 M900 276 V307" stroke="${a}" stroke-width="2"/><text x="660" y="332" text-anchor="middle" font-family="system-ui,sans-serif" font-size="20">0.60922</text><text x="900" y="332" text-anchor="middle" font-family="system-ui,sans-serif" font-size="20">0.609816</text><text x="780" y="368" text-anchor="middle" font-family="system-ui,sans-serif" font-size="15" fill="#cad9d8">CERTIFIED INTERVAL · ENLARGED</text>`;
 // The social card supplies its own headline; suppress tiny backdrop labels there.
 return (s+'</g>').replaceAll('<text ', '<text class="og-hide" ');
};
exports.thumbnailHero=()=>'<div style="font-size:28px;letter-spacing:.06em;margin-bottom:30px">LONG-HORIZON GUARANTEE</div><div style="font-size:70px;line-height:1.25">60.922%<br>to 60.9816%</div><div style="font-size:30px;margin-top:30px">Below 1/φ ≈ 61.8034%</div><div style="font-size:23px;margin-top:26px;opacity:.8">A certified interval.<br>Not an exact constant.</div>';
