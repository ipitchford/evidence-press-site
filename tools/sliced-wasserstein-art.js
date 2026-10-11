'use strict';

// A mechanism diagram, not a numerical transport computation.  The projection
// rosette represents the complete family of one-dimensional marginals.  The
// two rails encode the angular--Mellin multiplier distinction used in the
// proof: no multiplier vanishes for fixed noninteger p, whereas at integer p
// the harmonic degree p + 2 already lies in the kernel.

exports.colors = ['#9fdfeb', '#f2c177'];

exports.description = 'A schematic projection rosette for two measures feeds two angular--Mellin multiplier rails. On the upper rail, fixed noninteger p leaves every harmonic and frequency channel open and leads to the uniform bound W_p at most C times sliced W_p to the power 1 over p times p plus d plus 2 on the full p-moment ball. On the lower rail, integer p has a crossed-out multiplier at harmonic degree p plus 2, marking the null mode that obstructs uniform equivalence. This is a proof-mechanism diagram, not simulated data.';

exports.draw = (open, blocked) => {
  const white = '#faf7f2';
  const muted = '#c8d0da';
  const dark = '#151a1e';
  let s = '<g font-family="Georgia,serif">';

  // Projection rosette: a family of directions through two schematic measure
  // contours.  The contours are deliberately smooth glyphs, not point samples.
  s += `<circle cx="225" cy="204" r="118" fill="${dark}" fill-opacity=".28" stroke="${muted}" stroke-width="1.4" opacity=".8"/>`;
  const angles = [-72, -48, -24, 0, 24, 48, 72];
  for (const angle of angles) {
    const rad = angle * Math.PI / 180;
    const dx = 108 * Math.cos(rad);
    const dy = 108 * Math.sin(rad);
    s += `<path d="M ${(225 - dx).toFixed(1)} ${(204 - dy).toFixed(1)} L ${(225 + dx).toFixed(1)} ${(204 + dy).toFixed(1)}" stroke="${muted}" stroke-width="1.2" opacity=".24"/>`;
  }
  s += `<path d="M126 218 C132 149 180 118 235 132 C286 145 321 184 306 236 C291 285 233 303 183 276 C145 255 129 244 126 218 Z" fill="${open}" fill-opacity=".11" stroke="${open}" stroke-width="3"/>`;
  s += `<path d="M151 181 C176 137 236 126 281 157 C323 186 317 249 270 270 C226 290 168 260 148 219 C141 205 143 194 151 181 Z" fill="${blocked}" fill-opacity=".08" stroke="${blocked}" stroke-width="3" stroke-dasharray="8 7"/>`;
  s += `<circle cx="225" cy="204" r="5" fill="${white}"/>`;
  s += `<text class="og-hide" x="225" y="45" text-anchor="middle" fill="${white}" font-family="ui-monospace,monospace" font-size="14" letter-spacing="2">ALL ONE-DIMENSIONAL PROJECTIONS</text>`;
  s += `<text class="og-hide" x="137" y="112" fill="${open}" font-size="21">μ</text><text class="og-hide" x="294" y="285" fill="${blocked}" font-size="21">ν</text>`;
  s += `<text class="og-hide" x="225" y="373" text-anchor="middle" fill="${muted}" font-family="ui-monospace,monospace" font-size="14">schematic measures · every direction θ</text>`;

  // The family of projected discrepancies is gathered into one transform
  // channel before the proof splits according to the arithmetic type of p.
  const feeds = [[334, 120, 472, 128], [342, 158, 472, 164], [346, 204, 472, 204], [342, 250, 472, 244], [334, 288, 472, 280]];
  for (const [x1, y1, x2, y2] of feeds) {
    s += `<path d="M${x1} ${y1} C390 ${y1},420 ${y2},${x2} ${y2}" fill="none" stroke="${muted}" stroke-width="1.5" opacity=".35"/>`;
  }
  s += `<path d="M472 104 V304" stroke="${muted}" stroke-width="2" opacity=".5"/>`;
  s += `<path d="M461 116 L472 104 L483 116 M461 292 L472 304 L483 292" fill="none" stroke="${muted}" stroke-width="2" opacity=".65"/>`;
  s += `<circle cx="514" cy="204" r="38" fill="${dark}" fill-opacity=".72" stroke="${white}" stroke-width="1.5"/>`;
  s += `<circle cx="514" cy="204" r="25" fill="none" stroke="${open}" stroke-width="3" stroke-dasharray="4 5"/>`;
  s += `<text class="og-hide" x="514" y="198" text-anchor="middle" fill="${white}" font-family="ui-monospace,monospace" font-size="12">angular</text>`;
  s += `<text class="og-hide" x="514" y="215" text-anchor="middle" fill="${white}" font-family="ui-monospace,monospace" font-size="12">Mellin</text>`;

  // Upper rail: every multiplier is nonzero for fixed noninteger p.
  s += `<path d="M552 151 H824" fill="none" stroke="${open}" stroke-width="4"/>`;
  s += `<path d="M810 141 L826 151 L810 161" fill="none" stroke="${open}" stroke-width="4"/>`;
  for (let i = 0; i < 7; i++) {
    const x = 586 + i * 34;
    s += `<circle cx="${x}" cy="151" r="8" fill="${open}" stroke="${dark}" stroke-width="2"/>`;
  }
  s += `<text class="og-hide" x="563" y="115" fill="${open}" font-family="ui-monospace,monospace" font-size="20">p ∉ ℤ</text>`;
  s += `<text class="og-hide" x="642" y="115" fill="${muted}" font-family="ui-monospace,monospace" font-size="14">λ<tspan baseline-shift="sub" font-size="11">ℓ</tspan>(p+iξ) ≠ 0 · ∀ ℓ,ξ</text>`;

  // Lower rail: the first invisible harmonic is shown explicitly.  The rail
  // stops at that mode rather than suggesting a weakened quantitative bound.
  s += `<path d="M552 267 H676 M710 267 H794" fill="none" stroke="${blocked}" stroke-width="4" opacity=".82"/>`;
  for (let i = 0; i < 7; i++) {
    const x = 586 + i * 34;
    if (i === 3) {
      s += `<circle cx="${x}" cy="267" r="11" fill="${dark}" stroke="${blocked}" stroke-width="2.5"/>`;
      s += `<path d="M${x - 7} 260 L${x + 7} 274 M${x + 7} 260 L${x - 7} 274" stroke="${blocked}" stroke-width="3"/>`;
    } else {
      s += `<circle cx="${x}" cy="267" r="7" fill="${blocked}" fill-opacity=".65" stroke="${dark}" stroke-width="2"/>`;
    }
  }
  s += `<text class="og-hide" x="563" y="236" fill="${blocked}" font-family="ui-monospace,monospace" font-size="20">p ∈ ℤ</text>`;
  s += `<text class="og-hide" x="642" y="236" fill="${muted}" font-family="ui-monospace,monospace" font-size="14">λ<tspan baseline-shift="sub" font-size="11">p+2</tspan>(p) = 0</text>`;
  s += `<text class="og-hide" x="694" y="303" text-anchor="middle" fill="${muted}" font-family="ui-monospace,monospace" font-size="13">null harmonic</text>`;

  // The upper rail terminates in the theorem's uniform control statement.
  s += `<rect x="840" y="69" width="320" height="178" rx="24" fill="${dark}" fill-opacity=".62" stroke="${open}" stroke-width="2.5"/>`;
  s += `<text class="og-hide" x="1000" y="103" text-anchor="middle" fill="${muted}" font-family="ui-monospace,monospace" font-size="13" letter-spacing="1.3">FULL p-MOMENT BALL</text>`;
  s += `<text class="og-hide" x="1000" y="150" text-anchor="middle" fill="${white}" font-size="29">W<tspan baseline-shift="sub" font-size="18">p</tspan> ≤ C<tspan baseline-shift="sub" font-size="17">d,p</tspan> · SW<tspan baseline-shift="sub" font-size="18">p</tspan><tspan baseline-shift="super" font-size="17">α</tspan></text>`;
  s += `<text class="og-hide" x="1000" y="190" text-anchor="middle" fill="${open}" font-family="ui-monospace,monospace" font-size="17">α = 1 / [p(p+d+2)]</text>`;
  s += `<text class="og-hide" x="1000" y="224" text-anchor="middle" fill="${muted}" font-family="ui-monospace,monospace" font-size="13">fixed noninteger p &gt; 1 · d ≥ 2</text>`;

  // The integer rail ends at a restrained obstruction label, keeping the
  // positive theorem and the classification boundary visually distinct.
  s += `<path d="M794 267 H848" stroke="${blocked}" stroke-width="2" stroke-dasharray="5 6" opacity=".6"/>`;
  s += `<rect x="860" y="267" width="286" height="78" rx="18" fill="${dark}" fill-opacity=".45" stroke="${blocked}" stroke-width="1.7" stroke-dasharray="7 6"/>`;
  s += `<text class="og-hide" x="1003" y="300" text-anchor="middle" fill="${blocked}" font-family="Georgia,serif" font-size="22">uniform equivalence fails</text>`;
  s += `<text class="og-hide" x="1003" y="327" text-anchor="middle" fill="${muted}" font-family="ui-monospace,monospace" font-size="12">integer exponent · d ≥ 2</text>`;

  s += '</g>';
  return s;
};

exports.thumbnailHero = () => `
  <div class="eq-label">fixed noninteger p &gt; 1 · d ≥ 2 · full p-moment ball</div>
  <div class="eq eq-sm">W<sub>p</sub> ≤ C<sub>d,p</sub> · SW<sub>p</sub><sup>1/[p(p+d+2)]</sup></div>
  <div class="note"><b>Every one-dimensional projection contributes.</b><br>At integer p, a harmonic multiplier vanishes.</div>
  <div class="eq-foot">uniform equivalence · exponent not claimed sharp</div>`;

