'use strict';
// Component support schematic, not sampled observations or a density plot.
exports.draw=(a,b)=>{
 const white='#f4f0e9',muted='#c4c9d8';
 let s=`<g font-family="Georgia,serif" fill="${white}"><text x="65" y="55" font-size="25">Three component directions</text><text x="650" y="60" font-size="26">Every projection passes</text><text x="650" y="98" font-size="19" fill="${muted}">A joint convex cost still separates them</text></g>`;
 s+=`<g transform="translate(295 215)"><path d="M-115 -115L115 115M-115 115L115 -115" stroke="${b}" stroke-width="5" opacity=".85"/><path d="M-185 0H185" stroke="${a}" stroke-width="9"/><ellipse rx="108" ry="62" fill="none" stroke="${white}" stroke-width="2" stroke-dasharray="5 5" opacity=".7"/><circle r="6" fill="${white}"/></g>`;
 s+=`<g font-family="Georgia,serif" font-size="24" fill="${white}"><text x="462" y="198" fill="${a}">¾</text><text x="450" y="96" fill="${b}">⅛</text><text x="450" y="350" fill="${b}">⅛</text></g><path d="M550 215H605m-13-9l13 9-13 9" fill="none" stroke="${muted}" stroke-width="2"/>`;
 s+=`<g font-family="Georgia,serif"><text x="650" y="176" font-size="24" fill="${muted}">At zero shift: equal expectations</text><text x="650" y="230" font-size="32" fill="${b}">After the shift: target &gt; mixture</text><text x="650" y="292" font-size="30" fill="${white}">gap &gt; 37 / 18,432</text><text x="650" y="340" font-size="18" fill="${muted}">Exact bound · not a numerical estimate</text></g><text x="65" y="380" font-family="sans-serif" font-size="16" fill="${muted}">Lines: mixture supports · dashed ellipse: target contour</text>`;
 // The shaded wedges mark |x| > |y|, the zero-threshold active region.
 s=s.replace('<g transform="translate(295 215)">','<g transform="translate(295 215)"><path d="M0 0L-150 -150V150ZM0 0L150 -150V150Z" fill="'+a+'" opacity=".07"/>');
 // Keep the explanatory banner labels, but suppress them behind the OG headline.
 return s.replaceAll('<text ', '<text class="og-hide" ');
};
