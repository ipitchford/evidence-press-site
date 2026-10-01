'use strict';

// Source: research_extension_singular_proof.md, Lemma 2 and the theorem in §3.
// Every geometric shape is explicitly schematic: no projected coordinates,
// numerical objective values or global coverage are asserted by the drawing.
exports.description = 'Schematic of two full-dimensional seven-body support boxes: k = 4 with eight parameters and k = 5 with five, each of half-width 2^-34. Throughout each box the unique positive-semidefinite metric minimum has rank one and transverse restricted slack greater than 1/64. That nonzero slack rules out a realizable complete central-configuration kernel in either box. This is a local exclusion, not a classification.';

exports.cover = (a, b) => {
  const ink = '#fbf7ef', dim = '#ddd9e3';
  const text = (x, y, size, value, color = ink, anchor = 'start', extra = '') =>
    `<text class="og-hide" x="${x}" y="${y}" font-size="${size}" fill="${color}" text-anchor="${anchor}" ${extra}>${value}</text>`;
  let s = '<g font-family="Arial, Helvetica, sans-serif">';
  s += text(55, 51, 30, 'Two support boxes');
  for (const [y, k, d] of [[92, 4, 8], [225, 5, 5]]) {
    s += `<rect x="55" y="${y}" width="133" height="83" fill="${a}" fill-opacity=".12" stroke="${a}" stroke-width="2.5"/>`;
    for (let i = 1; i < 4; i++) {
      s += `<path d="M${55 + i * 33.25} ${y}v83 M55 ${y + i * 20.75}h133" stroke="${a}" stroke-width="1" opacity=".22"/>`;
    }
    s += `<circle cx="121.5" cy="${y + 41.5}" r="5.5" fill="${ink}"/>`;
    s += text(210, y + 32, 32, `k = ${k}`, ink);
    s += text(210, y + 69, 25, `${d} parameters`, a);
    s += `<path d="M374 ${y + 42} C411 ${y + 42} 407 202 444 202" fill="none" stroke="${a}" stroke-width="2.5" opacity=".8"/>`;
  }
  s += `<path d="M444 202h27l-9 -7m9 7-9 7" fill="none" stroke="${a}" stroke-width="2.5"/>`;
  s += text(55, 365, 27, 'half-width δ = 2⁻³⁴', dim);

  s += text(636, 51, 29, 'Unique PSD minimum', ink, 'middle');
  // Abstract PSD cone, seen schematically; the highlighted ray carries a
  // rank-one matrix. Its location is not a numerical optimizer plot.
  s += `<path d="M503 117 L636 291 L769 117 Q636 51 503 117Z" fill="${a}" fill-opacity=".06"/>`;
  s += `<ellipse cx="636" cy="117" rx="133" ry="40" fill="none" stroke="${a}" stroke-width="2.3" opacity=".75"/>`;
  for (let i = 0; i <= 8; i++) {
    const theta = i * Math.PI / 8;
    const x = 636 + 133 * Math.cos(theta), y = 117 + 40 * Math.sin(theta);
    s += `<path d="M636 291L${x.toFixed(2)} ${y.toFixed(2)}" stroke="${a}" stroke-width="1.2" opacity=".24"/>`;
  }
  s += `<path d="M503 117L636 291L769 117" fill="none" stroke="${a}" stroke-width="2.4"/>`;
  s += `<path d="M636 291L769 117" stroke="${b}" stroke-width="4.5"/>`;
  s += `<circle cx="702.5" cy="204" r="10" fill="${b}" stroke="${ink}" stroke-width="2"/>`;
  s += text(635, 328, 28, 'rank 1 · noncentral', b, 'middle');
  s += text(635, 364, 23, 'transverse slack &gt; 1/64', ink, 'middle');
  s += `<path d="M722 204H875l-10 -8m10 8-10 8" fill="none" stroke="${b}" stroke-width="2.5"/>`;

  s += `<circle cx="1018" cy="143" r="48" fill="${b}" fill-opacity=".06" stroke="${b}" stroke-width="2.5"/>`;
  s += text(1018, 159, 46, 'K', ink, 'middle', 'font-family="Georgia, serif" font-style="italic"');
  s += `<path d="M983 178L1053 108" stroke="${b}" stroke-width="4.5"/>`;
  s += text(1018, 242, 34, 'No complete', ink, 'middle');
  s += text(1018, 280, 34, 'kernel', ink, 'middle');
  s += text(1018, 318, 26, 'in either box', b, 'middle');
  s += text(1147, 383, 17, '7 bodies · schematic', dim, 'end');
  return s + '</g>';
};

exports.thumbnailHero = () => `
  <div class="eq-label">TWO FULL-DIMENSIONAL SUPPORT BOXES</div>
  <svg viewBox="0 0 420 180" style="width:100%;height:180px" aria-label="Eight-parameter and five-parameter boxes">
    <g fill="none" stroke="currentColor" stroke-width="2.5" opacity=".85">
      <rect x="28" y="20" width="145" height="130" rx="3"/>
      <rect x="247" y="20" width="145" height="130" rx="3"/>
      <path d="M100.5 20V150M28 85H173M319.5 20V150M247 85H392" opacity=".2"/>
    </g>
    <g font-family="Georgia, serif" font-size="52" fill="currentColor" text-anchor="middle">
      <text x="100.5" y="94">8D</text><text x="319.5" y="94">5D</text>
    </g>
    <g font-family="Arial, sans-serif" font-size="22" fill="currentColor" text-anchor="middle">
      <text x="100.5" y="133">k = 4</text><text x="319.5" y="133">k = 5</text>
    </g>
  </svg>
  <div class="eq">rank C = <span class="hl">1</span></div>
  <div class="note">Nonzero transverse slack.<br><b>No realizable complete kernel.</b></div>
  <div class="eq-foot">half-width 2⁻³⁴ · local, not global</div>`;
