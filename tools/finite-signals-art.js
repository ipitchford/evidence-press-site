'use strict';

// Exact sparse family in the manuscript: C*=4a²/(a+b)².
// The coefficient scale is linear; a dash is an unsupported cell, not a value.
const colors = ['#a8e8ce', '#ffb0a1'];
const description = 'The same sparse three-by-three signal support has supported conditional means zero, zero, absent; absent, a, b; a, absent, b. Each supported cell in a row has conditional signal probability one half. Its exact sharp coefficient is four a squared divided by the square of a plus b. For a equals one half and b equals one, the coefficient is four ninths, below the substitution threshold one, so every admissible disclosure of A passes. For a equals one and b equals one half, the coefficient is sixteen ninths and substitution fails. The axis shows exact coefficients, not measured data. This concerns one disclosure orientation and scalar quadratic value.';

function draw(good = colors[0], bad = colors[1]) {
  const ink = '#fff4e7';
  const dim = '#dbcddd';
  const x = c => 440 + 340*c;
  let cells = '';
  const table = [['0','0',null],[null,'a','b'],['a',null,'b']];
  for (let i=0;i<3;i++) for(let j=0;j<3;j++) {
    const cx=97+82*j, cy=139+67*i, value=table[i][j];
    cells += `<rect x="${cx-34}" y="${cy-25}" width="68" height="50" rx="8" fill="${value===null?'#ffffff':ink}" fill-opacity="${value===null?'.025':'.08'}" stroke="${dim}" stroke-opacity="${value===null?'.15':'.4'}"${value===null?' stroke-dasharray="3 5"':''}/><text x="${cx}" y="${cy+12}" text-anchor="middle" fill="${value===null?'#a697ad':ink}" font-family="Georgia,serif" font-size="37">${value===null?'—':value}</text>`;
  }
  return `<g font-family="Arial,Helvetica,sans-serif">
    <text x="183" y="51" text-anchor="middle" fill="${ink}" font-size="29">Same sparse support</text>
    <text x="789" y="51" text-anchor="middle" fill="${ink}" font-size="33">One threshold. Two outcomes.</text>
    <g fill="${dim}" font-size="19" text-anchor="middle">
      <text x="97" y="99">B₀</text><text x="179" y="99">B₁</text><text x="261" y="99">B₂</text>
      <text x="35" y="146">A₀</text><text x="35" y="213">A₁</text><text x="35" y="280">A₂</text>
    </g>
    ${cells}
    <text x="180" y="324" text-anchor="middle" fill="${dim}" font-size="19">— impossible signal pair</text>
    <text x="180" y="347" text-anchor="middle" fill="${dim}" font-size="18">other cells: probability ½</text>
    <text x="180" y="382" text-anchor="middle" fill="${ink}" font-family="Georgia,serif" font-size="27">C* = 4a² / (a + b)²</text>
    <path d="M332 210 H399 M388 201 L400 210 L388 219" fill="none" stroke="${ink}" stroke-width="2.5" opacity=".5"/>
    <path d="M440 210 H1120" stroke="${dim}" stroke-width="3" opacity=".35"/>
    <path d="M440 210 H780" stroke="${good}" stroke-width="8" stroke-linecap="round" opacity=".65"/>
    <path d="M780 210 H1120" stroke="${bad}" stroke-width="8" stroke-linecap="round" opacity=".65"/>
    <path d="M780 144 V284" stroke="${ink}" stroke-width="2" stroke-dasharray="5 6" opacity=".7"/>
    <text x="780" y="126" text-anchor="middle" fill="${ink}" font-size="23">threshold</text>
    <text x="780" y="321" text-anchor="middle" fill="${ink}" font-size="34">1</text>
    <text x="440" y="246" text-anchor="middle" fill="${dim}" font-size="21">0</text>
    <text x="1120" y="246" text-anchor="middle" fill="${dim}" font-size="21">2</text>
    <circle cx="${x(4/9)}" cy="210" r="13" fill="${good}" stroke="#342038" stroke-width="4"/>
    <circle cx="${x(16/9)}" cy="210" r="13" fill="${bad}" stroke="#342038" stroke-width="4"/>
    <text x="${x(4/9)}" y="153" text-anchor="middle" fill="${good}" font-family="Georgia,serif" font-size="65">4/9</text>
    <text x="${x(16/9)}" y="153" text-anchor="middle" fill="${bad}" font-family="Georgia,serif" font-size="65">16/9</text>
    <text x="${x(4/9)}" y="278" text-anchor="middle" fill="${good}" font-size="28">all disclosures pass</text>
    <text x="${x(16/9)}" y="278" text-anchor="middle" fill="${bad}" font-size="28">a disclosure fails</text>
    <text x="${x(4/9)}" y="318" text-anchor="middle" fill="${dim}" font-size="22">a = ½, b = 1</text>
    <text x="${x(16/9)}" y="318" text-anchor="middle" fill="${dim}" font-size="22">a = 1, b = ½</text>
    <text x="790" y="372" text-anchor="middle" fill="${ink}" font-size="24">Exact coefficient · scalar quadratic value</text>
  </g>`.replace(/<text /g, '<text class="og-hide" ');
}

function thumbnailHero() {
  return '<div class="eq-label">same sparse signal support</div><div style="display:flex;justify-content:space-around;align-items:center;margin:20px 0;font-family:Georgia,serif;font-size:83px"><span style="color:#a8e8ce">4/9</span><span style="font-size:34px">vs</span><span style="color:#ffb0a1">16/9</span></div><div style="display:flex;justify-content:space-around;font-size:27px;font-weight:700"><span>PASS</span><span>FAIL</span></div><div class="note" style="margin-top:30px">The threshold is <b>1</b>.<br>Finite convex checks decide<br>every disclosure of one signal.</div><div class="eq-foot">scalar target · quadratic value</div>';
}

module.exports = {colors, description, draw, thumbnailHero};

