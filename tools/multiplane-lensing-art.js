'use strict';

// Source: Sparse image bound, Theorem 1 and the (2,2,2) comparison row.
// The planes show equation coupling, not computed rays or a lens configuration.
exports.description = 'Three schematic lens planes, each containing two point masses, are joined only to their neighbors. Retaining this nearest-neighbor structure lowers the regular-image upper bound from Perry’s 365 to the candidate sparse bound 213. Prior constructions attain 125 images; the sharp maximum remains open. The diagram is a coupling schematic, not a ray simulation.';

function plane(x, y, scale, color, mass, index) {
  return `<g transform="translate(${x} ${y}) scale(${scale})">
    <path d="M-34-117 Q-65-19-30 113 L34 130 Q5 16 37-98 Z" fill="${color}" fill-opacity=".09" stroke="${color}" stroke-width="2"/>
    <path d="M-34-117 37-98 M-30 113 34 130 M-17-112 Q-46-10 1 121 M19-103 Q-11 17 19 126" fill="none" stroke="${color}" stroke-opacity=".19" stroke-width="1"/>
    <path d="M-44-61 24-43 M-45 58 18 75" stroke="${color}" stroke-opacity=".2"/>
    <circle cx="-13" cy="-62" r="11" fill="${mass}"/>
    <circle cx="2" cy="66" r="11" fill="${mass}"/>
    <circle cx="0" cy="0" r="7" fill="#faf7f2"/>
    <text x="18" y="13" fill="#faf7f2" font-family="Georgia,serif" font-size="27">z<tspan dy="5" font-size="17">${index}</tspan></text>
  </g>`;
}

exports.cover = (a, b) => {
  const ink = '#faf7f2', dim = '#ced7e9';
  let svg = '<g font-family="Arial,sans-serif">';
  svg += `<text class="og-hide" x="44" y="49" fill="${ink}" font-size="28">3 planes · 2 point masses each</text>`;
  // The only links are 1–2 and 2–3; their topology is the point of this drawing.
  svg += `<path d="M134 200H514" stroke="${a}" stroke-width="15" opacity=".08"/>
    <path d="M134 200H514" stroke="${a}" stroke-width="2.6" opacity=".75"/>`;
  for (const [index, x] of [[1, 134], [2, 324], [3, 514]]) {
    svg += plane(x, 200, 1, a, b, index);
    svg += `<text class="og-hide" x="${x}" y="352" text-anchor="middle" fill="${dim}" font-size="23">plane ${index}</text>`;
  }
  svg += `<text class="og-hide" x="324" y="387" text-anchor="middle" fill="${dim}" font-size="22">adjacent-plane coupling · schematic</text>`;
  svg += `<path d="M623 75V336" stroke="${dim}" opacity=".18"/>
    <g class="og-hide">
      <text x="902" y="65" text-anchor="middle" fill="${dim}" font-size="24" letter-spacing="1.4">REGULAR-IMAGE CEILING</text>
      <text x="698" y="183" fill="${dim}" font-family="Georgia,serif" font-size="94">365</text>
      <path d="M884 155H965m-17-14 17 14-17 14" fill="none" stroke="${b}" stroke-width="3.5"/>
      <text x="989" y="183" fill="${b}" font-family="Georgia,serif" font-size="94">213</text>
      <text x="779" y="226" text-anchor="middle" fill="${dim}" font-size="25">Perry</text>
      <text x="1068" y="226" text-anchor="middle" fill="${b}" font-size="25">sparse bound</text>
      <path d="M696 264H1152" stroke="${dim}" opacity=".28"/>
      <text x="698" y="323" fill="${a}" font-family="Georgia,serif" font-size="51">125</text>
      <text x="800" y="320" fill="${ink}" font-size="26">known attainable</text>
      <text x="699" y="367" fill="${dim}" font-size="25">The sharp maximum remains open.</text>
    </g></g>`;
  return svg;
};

exports.thumbnailHero = () => `<div class="eq-label">THREE PLANES · TWO MASSES EACH</div>
  <svg viewBox="0 0 400 114" style="display:block;width:100%;height:114px" aria-hidden="true">
    <path d="M67 53H333" stroke="currentColor" stroke-width="2" opacity=".5"/>
    ${[67, 200, 333].map((x, i) => plane(x, 53, .35, 'currentColor', '#facc15', i + 1)).join('')}
  </svg>
  <div class="eq" style="font-size:65px;line-height:1.15;white-space:nowrap">365 <span class="hl">→ 213</span></div>
  <div class="note" style="margin-top:9px;font-size:21px">A lower <b>upper bound</b>.<br>125 images already attainable.</div>
  <div class="eq-foot">The sharp maximum remains open.</div>`;
