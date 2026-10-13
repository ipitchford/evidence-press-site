'use strict';
// Source: revised paper.md, Theorem 1 and Section 1. Interval positions below
// illustrate strict inequalities only; they do not estimate eta_a(beta).
const colors=['#f2cb78','#ef9a87'];
const description='Two strict regimes for candidate O(n log n) mixing of the original global nonlazy Kawasaki chain: below beta_u all magnetisations; above beta_u only eta below minus eta_a or above eta_a. Threshold positions are schematic. The central low-temperature interval and beta equal to beta_u are not claimed. Endpoint magnetisations are singleton chains.';
function draw(a=colors[0],b=colors[1]) {
 const ivory='#fff5df',muted='#d6c7b3';
 return `<g font-family="Arial, Helvetica, sans-serif">
 <text x="48" y="43" fill="${a}" font-size="15" letter-spacing="1.8">GLOBAL KAWASAKI · FIXED PARTICLE COUNT</text>
 <text x="48" y="89" fill="${ivory}" font-family="Georgia,serif" font-size="31">Two strict routes to fast mixing</text>
 <path d="M792 113V330" stroke="${muted}" opacity=".25"/>
 <text x="48" y="157" fill="${a}" font-size="26">β &lt; β<tspan baseline-shift="sub" font-size="16">u</tspan></text>
 <text x="48" y="182" fill="${muted}" font-size="14">below the threshold</text>
 <path d="M254 154H738" stroke="${a}" stroke-width="10" stroke-linecap="round"/>
 <text x="496" y="130" text-anchor="middle" fill="${ivory}" font-size="18">all magnetisations</text>
 <text x="48" y="250" fill="${b}" font-size="26">β &gt; β<tspan baseline-shift="sub" font-size="16">u</tspan></text>
 <text x="48" y="275" fill="${muted}" font-size="14">above the threshold</text>
 <path d="M254 247H738" stroke="${muted}" stroke-width="2" opacity=".35"/>
 <path d="M254 247H375 M617 247H738" stroke="${b}" stroke-width="10" stroke-linecap="round"/>
 <circle cx="375" cy="247" r="8" fill="#3e2f20" stroke="${b}" stroke-width="3"/>
 <circle cx="617" cy="247" r="8" fill="#3e2f20" stroke="${b}" stroke-width="3"/>
 <text x="496" y="232" text-anchor="middle" fill="${muted}" font-size="16">not claimed here</text>
 <g fill="${ivory}" font-size="19" text-anchor="middle">
 <text x="254" y="292">−1</text><text x="375" y="292">−η<tspan baseline-shift="sub" font-size="13">a</tspan></text>
 <text x="496" y="292">0</text><text x="617" y="292">η<tspan baseline-shift="sub" font-size="13">a</tspan></text><text x="738" y="292">1</text>
 </g><text x="496" y="323" fill="${muted}" text-anchor="middle" font-size="15">magnetisation η · threshold positions schematic</text>
 <text x="987" y="155" text-anchor="middle" fill="${ivory}" font-family="Georgia,serif" font-size="47">O(n log n)</text>
 <text x="987" y="191" text-anchor="middle" fill="${a}" font-size="20">worst-start mixing</text>
 <text x="987" y="230" text-anchor="middle" fill="${ivory}" font-size="18">global · nonlazy</text>
 <text x="987" y="265" text-anchor="middle" fill="${muted}" font-size="17">fixed parameters · large n</text>
 <text x="987" y="299" text-anchor="middle" fill="${b}" font-size="17">β = β<tspan baseline-shift="sub" font-size="12">u</tspan> excluded</text>
 <path d="M48 348H1152" stroke="${muted}" opacity=".2"/>
 <text x="48" y="377" fill="${muted}" font-size="14">β<tspan baseline-shift="sub" font-size="11">u</tspan> = log[Δ/(Δ−2)] · η<tspan baseline-shift="sub" font-size="11">a</tspan> is the source-defined analytic threshold</text>
 <text x="1152" y="377" text-anchor="end" fill="${a}" font-size="12" letter-spacing="1">UNREFEREED CANDIDATE</text>
 </g>`.replace(/<text /g,'<text class="og-hide" ');
}
function thumbnailHero(){return '<div style="font-family:Georgia,serif;font-size:91px;text-align:center;white-space:nowrap">O(n log n)</div><div style="font-size:31px;text-align:center;margin-top:24px">two strict regimes</div><div style="font-size:28px;text-align:center;margin-top:35px;line-height:1.6">fixed particle count<br>original nonlazy clock</div>';}
module.exports={colors,description,draw,thumbnailHero};
