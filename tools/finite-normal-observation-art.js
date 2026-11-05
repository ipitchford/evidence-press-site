'use strict';
const fs = require('node:fs');
const path = require('node:path');
const {resolve} = require('./banner-palettes');
const {escapeText} = require('./svg-xml');
const slug = 'finite-normal-observation-windows';
const description = 'Schematic comparison: nested observation intervals starting at zero retain a positive frame bound under the theorem assumptions. A positively delayed interval has a frame bound if and only if the normal operator is invertible. Shorter does not mean less noise-sensitive.';
// Brief: This image helps the reader understand why shortening an initial
// observation window differs from delaying it. Source: Theorem 2.1 and
// Corollary 6.1. Reference: finite-sample-affine-diversification.svg, contrasting
// conclusions and restrained colour hierarchy. Intervals are schematic.
function draw(){
  return `<g font-family="Arial, sans-serif" fill="#f4efe6">
<text x="62" y="59" font-size="28" font-weight="600">Start at zero</text>
<text x="680" y="59" font-size="28" font-weight="600">Start later</text>
<line x1="604" y1="45" x2="604" y2="326" stroke="#ffffff" stroke-opacity=".16"/>
<line x1="95" y1="110" x2="95" y2="290" stroke="#f4efe6" stroke-width="2" stroke-dasharray="4 6"/>
<text x="87" y="324" font-size="22">0</text>
<path d="M95 135 H535 M95 195 H405 M95 255 H270" stroke="#8fe0ca" stroke-width="18" stroke-linecap="round"/>
<circle cx="95" cy="135" r="12" fill="#f4efe6"/><circle cx="95" cy="195" r="12" fill="#f4efe6"/><circle cx="95" cy="255" r="12" fill="#f4efe6"/>
<text x="300" y="264" font-size="23" fill="#8fe0ca">still a frame</text>
<line x1="710" y1="110" x2="710" y2="290" stroke="#f4efe6" stroke-width="2" stroke-dasharray="4 6"/>
<text x="702" y="324" font-size="22">0</text>
<path d="M710 155 H845" stroke="#e6b875" stroke-width="3" stroke-dasharray="5 7"/>
<path d="M845 155 H1120" stroke="#e6b875" stroke-width="18" stroke-linecap="round"/>
<circle cx="845" cy="155" r="12" fill="#f4efe6"/>
<text x="807" y="119" font-size="22" fill="#e6b875">delay</text>
<text x="775" y="233" font-size="25">Frame exactly when</text>
<text x="775" y="267" font-size="25" fill="#e6b875">A is invertible</text>
<text x="62" y="373" font-size="20" fill="#e2dce0">Schematic · given an initial frame · shorter windows can amplify noise</text>
</g>`.replace(/<text /g, '<text class="og-hide" ');
}
function svg(){const p=resolve(slug);return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 400" role="img" data-banner-palette="${p.name}"><title>Shortening is not delaying</title><desc>${escapeText(description)}</desc><defs><linearGradient id="bg"><stop offset="0" stop-color="${p.colors[0]}"/><stop offset="1" stop-color="${p.colors[1]}"/></linearGradient></defs><rect width="1200" height="400" fill="url(#bg)"/>${draw()}</svg>`;}
module.exports={draw,description,svg,colors:['#8fe0ca','#e6b875']};
if(require.main===module)fs.writeFileSync(path.join(__dirname,'../assets/art',slug+'.svg'),svg());
