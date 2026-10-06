'use strict';
// Exact K=0 ellipse contours; arrows show the downhill torsion gradient.
exports.draw=(a,b)=>{
 let s='<defs><marker id="land-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6" fill="none" stroke="'+b+'" stroke-width="1.4"/></marker></defs>';
 s+='<g transform="translate(285 195)">';
 for(let k=5;k>=1;k--)s+=`<ellipse rx="${k*43}" ry="${k*23}" fill="${a}" fill-opacity=".04" stroke="${a}" stroke-opacity="${.25+k*.1}" stroke-width="${k===5?3:1.7}"/>`;
 for(const [x,y] of [[90,0],[-90,0],[0,48],[0,-48],[75,38],[-75,38],[75,-38],[-75,-38]]){
 const dx=x/5,dy=4*y/5;const length=Math.hypot(dx,dy);s+=`<path d="M${x} ${y} l${dx/length*39} ${dy/length*39}" fill="none" stroke="${b}" stroke-width="2.8" marker-end="url(#land-arrow)"/>`;
 }
 s+='<circle r="5" fill="#faf7f2"/></g>';
 s+=`<g class="og-hide" font-family="Georgia,serif" fill="#faf7f2" text-anchor="middle"><text x="285" y="53" font-size="35">A nonradial starting shape</text><text x="285" y="362" font-size="30">Zero elevation at the boundary</text><text x="765" y="116" font-size="47">Elevation</text><text x="987" y="274" font-size="47">Drainage</text></g>`;
 s+=`<path d="M865 110 C1020 80 1130 148 1090 207 M892 282 C737 308 614 239 685 153" fill="none" stroke="${b}" stroke-width="4" marker-end="url(#land-arrow)"/>`;
 s+=`<text class="og-hide" x="894" y="361" text-anchor="middle" fill="${a}" font-family="Georgia,serif" font-size="35">A locally contracting loop</text>`;
 return s;
};
