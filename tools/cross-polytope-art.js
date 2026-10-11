'use strict';

// Exact claim diagram, not a hardware schematic or a numerical experiment.
// The left-hand dodecagon is a labelled two-dimensional projection of the
// twelve vertices ±e_i of the six-dimensional cross-polytope.  The circular
// mixing motif denotes shared randomness in an exact three-symbol classical
// simulation; it is deliberately not a fixed vertex-to-symbol encoding.

exports.colors = ['#a9dcf2', '#f4c283'];

exports.description = 'A labelled schematic projection of the six-dimensional cross-polytope shows its twelve vertices as six antipodal pairs, plus and minus e_1 through plus and minus e_6. An arrow for the complete input-output correlation set leads to a three-symbol triangle surrounded by a shared-randomness mixing ring, representing exact classical simulation rather than a fixed encoding of vertices. A family-boundary panel states sign.dim of the six-dimensional cross-polytope equals three, shows the exact value three in dimensions three through six, and marks dimension seven only with the lower bound at least four. This is a mathematical schematic, not a quantum device or a statement about three bits.';

exports.draw = (primary, boundary) => {
  const white = '#faf7f2';
  const muted = '#cbd5df';
  const dark = '#151a1e';
  const cx = 220;
  const cy = 202;
  const radius = 123;
  const points = [];
  const pairs = [];
  const start = -78;

  for (let i = 0; i < 6; i++) {
    const angle = (start + i * 30) * Math.PI / 180;
    const plus = [cx + radius * Math.cos(angle), cy + radius * Math.sin(angle)];
    const minus = [cx - radius * Math.cos(angle), cy - radius * Math.sin(angle)];
    pairs.push([plus, minus]);
    points.push({ angle: start + i * 30, point: plus, sign: 1, index: i + 1 });
    points.push({ angle: start + i * 30 + 180, point: minus, sign: -1, index: i + 1 });
  }
  points.sort((u, v) => u.angle - v.angle);
  const polygon = points.map(({ point }) => point.map(value => value.toFixed(1)).join(',')).join(' ');

  let s = '<g font-family="Georgia,serif">';

  // The recognisable main form: a centrally symmetric twelve-vertex
  // projection, with antipodal basis pairs made explicit by the six axes.
  s += `<polygon points="${polygon}" fill="${primary}" fill-opacity=".08" stroke="${white}" stroke-width="2.2"/>`;
  s += `<polygon points="${polygon}" fill="none" stroke="${primary}" stroke-width="8" stroke-linejoin="round" opacity=".11"/>`;
  pairs.forEach(([plus, minus], i) => {
    s += `<path d="M${minus[0].toFixed(1)} ${minus[1].toFixed(1)} L${plus[0].toFixed(1)} ${plus[1].toFixed(1)}" stroke="${i % 2 ? boundary : primary}" stroke-width="1.6" opacity=".42"/>`;
  });
  for (const { point, sign } of points) {
    const colour = sign > 0 ? primary : boundary;
    s += `<circle cx="${point[0].toFixed(1)}" cy="${point[1].toFixed(1)}" r="8.5" fill="${colour}" stroke="${dark}" stroke-width="2.5"/>`;
    s += `<circle cx="${point[0].toFixed(1)}" cy="${point[1].toFixed(1)}" r="13" fill="none" stroke="${colour}" stroke-width="1" opacity=".26"/>`;
  }
  s += `<circle cx="${cx}" cy="${cy}" r="7" fill="${white}"/>`;
  s += `<text class="og-hide" x="${cx}" y="43" text-anchor="middle" fill="${white}" font-family="ui-monospace,monospace" font-size="15" letter-spacing="1.5">12 VERTICES · ±e₁,…,±e₆</text>`;
  s += `<text class="og-hide" x="${cx}" y="374" text-anchor="middle" fill="${muted}" font-family="ui-monospace,monospace" font-size="13">six antipodal pairs · schematic projection</text>`;

  // The arrow denotes the whole correlation set, not twelve fixed messages.
  s += `<path d="M354 202 C397 160 442 160 486 202" fill="none" stroke="${muted}" stroke-width="2.2" stroke-dasharray="7 7" opacity=".72"/>`;
  s += `<path d="M474 192 L488 202 L474 212" fill="none" stroke="${muted}" stroke-width="2.2"/>`;
  s += `<text class="og-hide" x="420" y="145" text-anchor="middle" fill="${muted}" font-family="ui-monospace,monospace" font-size="12" letter-spacing="1">ALL CORRELATIONS</text>`;

  // Three classical symbols sit inside a shared-randomness mixing ring.  The
  // overlapping triangles suggest convex mixing without assigning a fixed
  // symbol to any particular geometric vertex.
  const mx = 618;
  const my = 203;
  const symbols = [[mx, my - 76], [mx - 72, my + 55], [mx + 72, my + 55]];
  s += `<circle cx="${mx}" cy="${my}" r="112" fill="${dark}" fill-opacity=".25" stroke="${muted}" stroke-width="1.5" stroke-dasharray="8 8" opacity=".8"/>`;
  s += `<path d="M${mx - 95} ${my - 61} A112 112 0 0 1 ${mx + 83} ${my - 75}" fill="none" stroke="${primary}" stroke-width="3" opacity=".86"/>`;
  s += `<path d="M${mx + 97} ${my - 57} l-3 -15 l-14 6" fill="none" stroke="${primary}" stroke-width="3"/>`;
  s += `<path d="M${symbols[0][0]} ${symbols[0][1]} L${symbols[1][0]} ${symbols[1][1]} L${symbols[2][0]} ${symbols[2][1]} Z" fill="${primary}" fill-opacity=".08" stroke="${primary}" stroke-width="2.5"/>`;
  s += `<path d="M${symbols[0][0] - 15} ${symbols[0][1] + 17} L${symbols[1][0] + 22} ${symbols[1][1] - 4} L${symbols[2][0] - 10} ${symbols[2][1] - 23} Z" fill="none" stroke="${boundary}" stroke-width="2" opacity=".68"/>`;
  symbols.forEach(([x, y], i) => {
    const colour = i === 1 ? boundary : primary;
    s += `<circle cx="${x}" cy="${y}" r="27" fill="${dark}" stroke="${colour}" stroke-width="3"/>`;
    s += `<text class="og-hide" x="${x}" y="${y + 9}" text-anchor="middle" fill="${white}" font-size="28">${i + 1}</text>`;
  });
  s += `<text class="og-hide" x="${mx}" y="54" text-anchor="middle" fill="${white}" font-family="ui-monospace,monospace" font-size="15" letter-spacing="1.4">SHARED RANDOMNESS</text>`;
  s += `<text class="og-hide" x="${mx}" y="361" text-anchor="middle" fill="${primary}" font-family="ui-monospace,monospace" font-size="17" letter-spacing="1.4">3 SYMBOLS · EXACT SIMULATION</text>`;

  // Family boundary.  The d=7 marker is explicitly an at-least-four lower
  // bound; no exact value or continuation line is drawn beyond dimension six.
  s += `<rect x="793" y="48" width="370" height="304" rx="24" fill="${dark}" fill-opacity=".45" stroke="${primary}" stroke-width="1.8"/>`;
  s += `<text class="og-hide" x="978" y="91" text-anchor="middle" fill="${white}" font-size="30">sign.dim(◇<tspan baseline-shift="sub" font-size="18">6</tspan>) = <tspan fill="${primary}">3</tspan></text>`;
  s += `<text class="og-hide" x="978" y="119" text-anchor="middle" fill="${muted}" font-family="ui-monospace,monospace" font-size="12" letter-spacing="1.2">COMPLETE THREE-SYMBOL RANGE</text>`;

  const dims = [3, 4, 5, 6];
  const xs = [838, 900, 962, 1024];
  const yThree = 215;
  s += `<rect x="820" y="181" width="223" height="68" rx="18" fill="${primary}" fill-opacity=".08"/>`;
  s += `<path d="M${xs[0]} ${yThree} H${xs[3]}" stroke="${primary}" stroke-width="4"/>`;
  dims.forEach((dimension, i) => {
    s += `<circle cx="${xs[i]}" cy="${yThree}" r="9" fill="${primary}" stroke="${dark}" stroke-width="2"/>`;
    s += `<text class="og-hide" x="${xs[i]}" y="${yThree - 20}" text-anchor="middle" fill="${white}" font-size="18">3</text>`;
    s += `<text class="og-hide" x="${xs[i]}" y="${yThree + 39}" text-anchor="middle" fill="${muted}" font-family="ui-monospace,monospace" font-size="14">d=${dimension}</text>`;
  });
  s += `<path d="M1057 144 V282" stroke="${muted}" stroke-width="1.5" stroke-dasharray="5 7" opacity=".38"/>`;
  s += `<path d="M1107 222 V180" stroke="${boundary}" stroke-width="2" stroke-dasharray="5 5" opacity=".82"/>`;
  s += `<path d="M1099 191 L1107 178 L1115 191" fill="none" stroke="${boundary}" stroke-width="2"/>`;
  s += `<circle cx="1107" cy="157" r="19" fill="${dark}" stroke="${boundary}" stroke-width="2.5"/>`;
  s += `<text class="og-hide" x="1107" y="164" text-anchor="middle" fill="${boundary}" font-size="19">≥4</text>`;
  s += `<text class="og-hide" x="1107" y="254" text-anchor="middle" fill="${muted}" font-family="ui-monospace,monospace" font-size="14">d=7</text>`;
  s += `<text class="og-hide" x="1107" y="281" text-anchor="middle" fill="${boundary}" font-family="ui-monospace,monospace" font-size="11">LOWER BOUND</text>`;
  s += `<text class="og-hide" x="978" y="324" text-anchor="middle" fill="${muted}" font-family="ui-monospace,monospace" font-size="13">value 3 iff 3 ≤ d ≤ 6</text>`;

  s += '</g>';
  return s;
};

exports.thumbnailHero = () => `
  <div class="eq-label">exact classical simulation · shared randomness allowed</div>
  <div class="hero-title">sign.dim(◇<sub>6</sub>) = 3</div>
  <div class="note"><b>Three symbols reproduce every allowed correlation.</b><br>d = 3,…,6: value 3 · d = 7: at least 4</div>
  <div class="eq-foot">exact rational certificates · computer-assisted proof candidate</div>`;

