'use strict';
// Analytic unit-variance densities, not fitted data or numerical proof evidence.
// Laplace: (E-E')/sqrt(2); centred exponential: E-1, E,E' iid Exp(1).
const colors = ['#f4c77d', '#a9dfcc'];
const description = 'Two analytic density shapes, both mean zero and variance one: the symmetric Laplace law (E minus E prime) divided by square root of two, and the centred exponential E minus one. Among centred log-concave laws the smallest Lp to L2 ratio is attained by Laplace for 1<p<p*, and by centred exponential for p*<p<2; both families attain it at p*, approximately 1.682457208455. For p>2 the centred exponential instead maximises the ratio. At p=2 every admissible law has ratio one. Reflections are included. Curves are sampled from exact analytic formulas for illustration, not certificate data; displayed tails are truncated. The regime arrangement is not a linear exponent scale.';
function curve(fn, xmin, xmax, X, Y, scaleX, scaleY) {
  const pts = Array.from({length:401},(_,i)=>{const x=xmin+(xmax-xmin)*i/400;return `${(X+x*scaleX).toFixed(3)} ${(Y-fn(x)*scaleY).toFixed(3)}`;});
  return 'M'+pts.join(' L');
}
function densityShapes(a,b) {
  const X=270,Y=273,sx=65,sy=170;
  const lp=curve(x=>Math.exp(-Math.SQRT2*Math.abs(x))/Math.SQRT2,-3.4,4.4,X,Y,sx,sy);
  const ep=curve(x=>Math.exp(-x-1),-1,4.4,X,Y,sx,sy);
  return `<path d="${lp} L556 273 L49 273 Z" fill="${a}" opacity=".13"/>
  <path d="${ep} L556 273 L205 273 Z" fill="${b}" opacity=".12"/>
  <path d="M49 273 H565 M270 100 V282" fill="none" stroke="#f8eee6" stroke-opacity=".23" stroke-width="1.5"/>
  <path d="M205 273 V103" stroke="${b}" stroke-width="2" stroke-dasharray="4 5" opacity=".65"/>
  <path d="${lp}" fill="none" stroke="${a}" stroke-width="5" stroke-linejoin="round"/>
  <path d="${ep}" fill="none" stroke="${b}" stroke-width="5"/>
  <circle cx="205" cy="103" r="4" fill="${b}"/>
  <g fill="#d9c7c7" font-family="Arial,Helvetica,sans-serif" font-size="19"><text x="205" y="302" text-anchor="middle">−1</text><text x="270" y="302" text-anchor="middle">0</text><text x="548" y="302">x</text></g>`;
}
function draw(a=colors[0],b=colors[1]) {
  return `<g font-family="Arial,Helvetica,sans-serif">
  <text class="og-hide" x="45" y="48" fill="#fff5eb" font-family="Georgia,serif" font-size="35">Same variance. Different extremisers.</text>
  ${densityShapes(a,b)}
  <g class="og-hide"><text x="57" y="134" fill="${a}" font-size="28">Laplace</text>
  <path d="M155 143 L232 169" stroke="${a}" stroke-width="1.5" opacity=".7"/>
  <text x="334" y="112" fill="${b}" font-size="27">Centred</text><text x="334" y="143" fill="${b}" font-size="27">exponential</text>
  <path d="M326 128 L224 127" stroke="${b}" stroke-width="1.5" opacity=".7"/>
  <text x="300" y="349" text-anchor="middle" fill="#fff5eb" font-size="24">mean 0 · variance 1</text>
  <path d="M615 63 V350" stroke="#f8eee6" stroke-opacity=".22"/>
  <text x="670" y="52" fill="#dfcbcb" font-size="21" letter-spacing="1">CENTRED LOG-CONCAVE LAWS</text>
  <text x="670" y="102" fill="#fff5eb" font-family="Georgia,serif" font-size="39">p* ≈ 1.682457…</text>
  <text x="670" y="145" fill="#dfcbcb" font-size="24">Below 2: the minimum switches</text>
  <text x="670" y="190" fill="${a}" font-size="29">Laplace</text><path d="M815 181 H880 m-9 -6 9 6 -9 6" stroke="#fff5eb" stroke-width="2" fill="none"/>
  <text x="903" y="190" fill="${b}" font-size="29">Exponential</text>
  <text x="670" y="224" fill="#dfcbcb" font-size="22">1 &lt; p &lt; p*</text><text x="903" y="224" fill="#dfcbcb" font-size="22">p* &lt; p &lt; 2</text>
  <text x="670" y="264" fill="#fff5eb" font-size="24">At p*: both families</text>
  <path d="M670 283 H1150" stroke="#f8eee6" stroke-opacity=".22"/>
  <text x="670" y="319" fill="${b}" font-size="25">p &gt; 2: exponential maximises</text>
  <text x="670" y="355" fill="#fff5eb" font-size="25">p = 2: every law ties</text>
  </g></g>`;
}
function thumbnailHero(){return `<div class="eq-label">SAME VARIANCE · SHARP BOUNDS</div><svg viewBox="0 75 600 245" style="width:100%;height:220px" role="img" aria-label="Unit-variance Laplace and centred exponential density curves">${densityShapes(...colors)}</svg><div style="font-family:Georgia,serif;font-size:42px;text-align:center;color:#f4c77d">p* ≈ 1.682457…</div><div class="note" style="font-size:24px">The minimiser switches below 2.<br>At p = 2, every law ties.</div>`;}
module.exports={colors,description,draw,thumbnailHero};
