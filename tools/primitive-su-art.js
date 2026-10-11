'use strict';

// Exact theorem schematic. The rank vector is the resolved N=4 example from
// the paper; the inequalities and electron pair are the two independent
// uniform obstructions for every even N >= 4. This is category-theoretic
// structure, not a microscopic device or an experimental-material claim.

exports.colors = ['#a8ddf0', '#f2c36f'];

exports.description = 'Two horizontal proof lanes converge on primitivity of the even-rank SU(N) at level N series. The first lane shows the resolved N equals 4 sector ranks R_0 through R_3 as 8, 4, 6 and 4, illustrating the uniform strict inequality R_q less than R_0 for nonzero charge; that inequality crosses out a two-object invertible-vortex factor, which would require equal rank. The second lane shows two distinct objects X and fX exchanged by electron fusion in every nonzero sector for every even N at least 4; this crosses out a one-object fixed factor, which would require fX equals X. A boundary caption says that at N equals 2, ranks 2 and 1 alone are insufficient, emphasizing that rank is only one obstruction. The image is a mathematical sector-resolution diagram, not a claim about a material or experiment.';

const arrow = (x1, y1, x2, y2, colour, opacity = .75) => `
  <path d="M${x1} ${y1} H${x2}" fill="none" stroke="${colour}" stroke-width="2.2" opacity="${opacity}"/>
  <path d="M${x2 - 10} ${y2 - 7} L${x2} ${y2} L${x2 - 10} ${y2 + 7}" fill="none" stroke="${colour}" stroke-width="2.2" opacity="${opacity}"/>`;

const cross = (cx, cy, radius, colour) => `
  <circle cx="${cx}" cy="${cy}" r="${radius}" fill="none" stroke="${colour}" stroke-width="1.4" opacity=".45"/>
  <path d="M${cx - radius * .68} ${cy - radius * .68} L${cx + radius * .68} ${cy + radius * .68} M${cx + radius * .68} ${cy - radius * .68} L${cx - radius * .68} ${cy + radius * .68}" stroke="${colour}" stroke-width="3" stroke-linecap="round"/>`;

exports.draw = (rankColour, pairColour) => {
  const white = '#faf7f2';
  const muted = '#cbd4df';
  const dark = '#14191f';
  let s = '<g font-family="Georgia,serif">';

  s += `<text class="og-hide" x="56" y="40" fill="${white}" font-family="ui-monospace,monospace" font-size="15" letter-spacing="1.6">TWO INDEPENDENT OBSTRUCTIONS · EVEN N ≥ 4</text>`;
  s += `<path d="M48 205 H804" stroke="${muted}" stroke-width="1.2" opacity=".24"/>`;

  // Obstruction one: exact N=4 rank vector, with the neutral sector distinct.
  s += `<circle cx="69" cy="105" r="18" fill="${dark}" stroke="${rankColour}" stroke-width="2.4"/><text class="og-hide" x="69" y="111" text-anchor="middle" fill="${rankColour}" font-family="ui-monospace,monospace" font-size="17">1</text>`;
  s += `<text class="og-hide" x="101" y="91" fill="${white}" font-family="ui-monospace,monospace" font-size="14" letter-spacing="1.2">RANK OBSTRUCTION</text>`;

  const ranks = [8, 4, 6, 4];
  const barX = [115, 171, 227, 283];
  ranks.forEach((value, q) => {
    // Keep value labels below the lane heading at full and card scale.
    const height = value * 7;
    const colour = q === 0 ? rankColour : pairColour;
    s += `<rect x="${barX[q]}" y="${176 - height}" width="34" height="${height}" rx="7" fill="${colour}" fill-opacity="${q === 0 ? '.92' : '.72'}"/>`;
    s += `<text class="og-hide" x="${barX[q] + 17}" y="${168 - height}" text-anchor="middle" fill="${colour}" font-size="17">${value}</text>`;
    s += `<text class="og-hide" x="${barX[q] + 17}" y="197" text-anchor="middle" fill="${muted}" font-family="ui-monospace,monospace" font-size="12">q=${q}</text>`;
  });
  s += `<path d="M104 177 H329" stroke="${muted}" stroke-width="1.4" opacity=".55"/>`;
  s += `<text class="og-hide" x="217" y="66" text-anchor="middle" fill="${muted}" font-family="ui-monospace,monospace" font-size="12">N=4 RESOLVED SECTORS</text>`;

  s += arrow(352, 132, 421, 132, muted);
  s += `<text class="og-hide" x="482" y="121" text-anchor="middle" fill="${rankColour}" font-size="25">R<tspan baseline-shift="sub" font-size="15">q</tspan> &lt; R<tspan baseline-shift="sub" font-size="15">0</tspan></text>`;
  s += `<text class="og-hide" x="482" y="151" text-anchor="middle" fill="${muted}" font-family="ui-monospace,monospace" font-size="11">EVERY q ≠ 0</text>`;
  s += arrow(542, 132, 598, 132, muted);

  // The two-object vortex factor is shown as an electron-exchanged pair. Its
  // required equality conflicts with the strict sector-rank inequality.
  s += `<rect x="603" y="78" width="176" height="109" rx="20" fill="${dark}" fill-opacity=".38" stroke="${muted}" stroke-width="1.2" opacity=".9"/>`;
  s += `<circle cx="650" cy="126" r="15" fill="${pairColour}"/><circle cx="714" cy="126" r="15" fill="${pairColour}"/>`;
  s += `<path d="M669 126 H694 M688 120 l7 6 l-7 6" fill="none" stroke="${white}" stroke-width="1.8"/>`;
  s += cross(748, 95, 16, pairColour);
  s += `<text class="og-hide" x="691" y="160" text-anchor="middle" fill="${white}" font-family="ui-monospace,monospace" font-size="12">2-OBJECT FACTOR</text>`;
  s += `<text class="og-hide" x="691" y="178" text-anchor="middle" fill="${muted}" font-family="ui-monospace,monospace" font-size="10">would require Rq = R0</text>`;

  // Obstruction two: an explicit full-period label gives a distinct electron
  // pair in every nonzero sector, contradicting a one-object fixed factor.
  s += `<circle cx="69" cy="269" r="18" fill="${dark}" stroke="${pairColour}" stroke-width="2.4"/><text class="og-hide" x="69" y="275" text-anchor="middle" fill="${pairColour}" font-family="ui-monospace,monospace" font-size="17">2</text>`;
  s += `<text class="og-hide" x="101" y="225" fill="${white}" font-family="ui-monospace,monospace" font-size="14" letter-spacing="1.2">ELECTRON PAIR</text>`;
  s += `<circle cx="164" cy="292" r="30" fill="${dark}" stroke="${rankColour}" stroke-width="2.7"/><text class="og-hide" x="164" y="300" text-anchor="middle" fill="${white}" font-size="24">X</text>`;
  s += `<circle cx="301" cy="292" r="30" fill="${dark}" stroke="${pairColour}" stroke-width="2.7"/><text class="og-hide" x="301" y="300" text-anchor="middle" fill="${white}" font-size="23">fX</text>`;
  s += `<path d="M199 284 H266 M258 277 l9 7 l-9 7 M266 301 H199 M207 294 l-9 7 l9 7" fill="none" stroke="${muted}" stroke-width="2"/>`;
  s += `<text class="og-hide" x="232" y="250" text-anchor="middle" fill="${pairColour}" font-size="20">X ≠ fX</text>`;
  s += `<text class="og-hide" x="232" y="338" text-anchor="middle" fill="${muted}" font-family="ui-monospace,monospace" font-size="11">EVERY NONZERO SECTOR</text>`;

  s += arrow(345, 292, 421, 292, muted);
  s += `<text class="og-hide" x="484" y="281" text-anchor="middle" fill="${pairColour}" font-size="21">f exchanges them</text>`;
  s += `<text class="og-hide" x="484" y="310" text-anchor="middle" fill="${muted}" font-family="ui-monospace,monospace" font-size="11">FULL-PERIOD LABEL</text>`;
  s += arrow(546, 292, 600, 292, muted);

  s += `<rect x="605" y="238" width="174" height="108" rx="20" fill="${dark}" fill-opacity=".38" stroke="${muted}" stroke-width="1.2" opacity=".9"/>`;
  s += `<circle cx="690" cy="282" r="22" fill="${pairColour}" fill-opacity=".8" stroke="${white}" stroke-width="1.5"/>`;
  s += `<path d="M713 283 C741 258 739 315 708 303" fill="none" stroke="${rankColour}" stroke-width="2"/><path d="M713 303 l-6 1 l3 -7" fill="none" stroke="${rankColour}" stroke-width="2"/>`;
  s += `<text class="og-hide" x="690" y="289" text-anchor="middle" fill="${dark}" font-size="18">X</text>`;
  s += cross(748, 251, 16, pairColour);
  s += `<text class="og-hide" x="692" y="326" text-anchor="middle" fill="${white}" font-family="ui-monospace,monospace" font-size="12">1 FIXED OBJECT</text>`;
  s += `<text class="og-hide" x="692" y="343" text-anchor="middle" fill="${muted}" font-family="ui-monospace,monospace" font-size="10">would require fX = X</text>`;

  // Both logically separate exclusions are needed for the theorem.
  s += `<path d="M795 132 C855 132 835 192 891 200 M795 292 C855 292 835 208 891 200" fill="none" stroke="${muted}" stroke-width="2.2" opacity=".62"/>`;
  s += `<circle cx="1010" cy="200" r="112" fill="${dark}" fill-opacity=".32" stroke="${rankColour}" stroke-width="2.4"/>`;
  s += `<circle cx="1010" cy="200" r="95" fill="none" stroke="${pairColour}" stroke-width="1.5" stroke-dasharray="7 7" opacity=".72"/>`;
  s += `<text class="og-hide" x="1010" y="142" text-anchor="middle" fill="${muted}" font-family="ui-monospace,monospace" font-size="11" letter-spacing="1">BOTH FACTORS EXCLUDED</text>`;
  s += `<text class="og-hide" x="1010" y="202" text-anchor="middle" fill="${white}" font-size="31">primitive</text>`;
  s += `<text class="og-hide" x="1010" y="235" text-anchor="middle" fill="${rankColour}" font-size="20">SU(N)<tspan baseline-shift="sub" font-size="13">N</tspan></text>`;
  s += `<text class="og-hide" x="1010" y="263" text-anchor="middle" fill="${pairColour}" font-family="ui-monospace,monospace" font-size="12">EVEN N ≥ 4</text>`;

  s += `<text class="og-hide" x="56" y="379" fill="${muted}" font-family="ui-monospace,monospace" font-size="11">BOUNDARY: N=2 HAS RANKS 2,1 — RANK ALONE IS INSUFFICIENT</text>`;
  s += '</g>';
  return s;
};

exports.thumbnailHero = () => `
  <div class="eq-label">resolved N = 4 sector ranks</div>
  <div class="hero-title">8 · 4 · 6 · 4</div>
  <div class="note"><b>R<sub>q</sub> &lt; R<sub>0</sub></b> excludes two objects.<br><b>X ↔ fX</b> excludes one fixed object.</div>
  <div class="eq-foot">every nonzero sector · every even N ≥ 4</div>`;

