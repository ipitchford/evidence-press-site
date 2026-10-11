'use strict';

// Explanatory theorem schematic, not simulation output. Horizontal spacing
// represents infection time: many observed infections compressed into one
// interval form the widest rapid-window witness. Amber marks the latent planted
// membership only to explain the mechanism; the scan selects from times.

exports.colors = ['#a8ddf0', '#f4bd73'];

exports.description = 'A schematic infection-time line begins with sparse background infections, passes through a compressed burst containing many members of a latent dense planted set, and returns to sparse background activity. A bracket below the burst identifies the observed widest rapid window selected from infection times. A theorem annotation states that for planted size s equals n to the alpha, every fixed alpha strictly between one third and one half is below square-root size and has relative recovery error tending to zero under the paper\'s known-background assumptions. The image is explicitly labelled as a schematic rather than pilot data; the finite pilot recovered none of its twelve planted instances.';

const tick = (x, height, colour, radius = 4.5, opacity = 1) => `
  <path d="M${x} 184 V${184 - height}" stroke="${colour}" stroke-width="2.2" opacity="${opacity}"/>
  <circle cx="${x}" cy="${184 - height}" r="${radius}" fill="${colour}" opacity="${opacity}"/>`;

exports.draw = (observed, planted) => {
  const white = '#faf7f2';
  const muted = '#c7d2df';
  const ink = '#111820';
  let s = '<g font-family="Georgia,serif">';

  // A soft envelope marks the latent dense subgraph without pretending the
  // observed scan knows its membership. Fine links are explanatory only.
  s += `<path d="M327 174 C352 80 424 55 544 60 C666 64 733 93 759 174 C725 225 646 249 541 247 C433 245 354 224 327 174 Z" fill="${planted}" fill-opacity=".055" stroke="${planted}" stroke-width="1.4" stroke-dasharray="6 8" opacity=".8"/>`;
  const latentNodes = [
    [375,134],[415,103],[462,126],[508,91],[550,121],[596,94],[642,128],[691,105],[730,143],
    [401,207],[452,225],[509,202],[565,229],[621,205],[676,224],[715,192]
  ];
  const latentLinks = [[0,2],[1,3],[2,4],[3,5],[4,6],[5,7],[6,8],[9,11],[10,12],[11,13],[12,14],[13,15],[0,9],[2,10],[4,12],[6,14],[8,15]];
  for (const [a,b] of latentLinks) {
    const [x1,y1] = latentNodes[a];
    const [x2,y2] = latentNodes[b];
    s += `<path d="M${x1} ${y1} L${x2} ${y2}" stroke="${planted}" stroke-width="1.1" opacity=".17"/>`;
  }
  for (const [x,y] of latentNodes) {
    s += `<circle cx="${x}" cy="${y}" r="3.1" fill="${planted}" opacity=".28"/>`;
  }

  // Observed infection-time axis. Sparse background ticks surround a dense
  // rapid interval. A few blue ticks inside it show allowable contamination.
  s += `<path d="M58 184 H1142" stroke="${muted}" stroke-width="2" opacity=".7"/>`;
  s += `<path d="M1142 184 l-13 -7 v14 z" fill="${muted}" opacity=".75"/>`;
  const sparseLeft = [[78,31],[129,48],[197,24],[269,57],[323,35]];
  const sparseRight = [[788,39],[852,58],[925,28],[1007,47],[1097,31]];
  sparseLeft.forEach(([x,h], i) => { s += tick(x,h,observed, i === 3 ? 5.5 : 4.2, .76); });
  sparseRight.forEach(([x,h], i) => { s += tick(x,h,observed, i === 1 ? 5.5 : 4.2, .76); });

  const burst = [350,366,382,397,411,425,439,452,466,479,492,505,518,531,544,558,572,586,601,617,634,652,671,693,718,744];
  const contamination = new Set([3,10,18,23]);
  burst.forEach((x, i) => {
    const height = 28 + ((i * 17) % 67);
    const colour = contamination.has(i) ? observed : planted;
    s += tick(x, height, colour, contamination.has(i) ? 4 : 5.1, contamination.has(i) ? .8 : .96);
  });

  s += `<text class="og-hide" x="58" y="45" fill="${white}" font-family="ui-monospace,monospace" font-size="14" letter-spacing="1.5">ONE OBSERVED SI CASCADE · INFECTION TIME</text>`;
  s += `<text class="og-hide" x="1142" y="45" text-anchor="end" fill="${muted}" font-family="ui-monospace,monospace" font-size="13" letter-spacing="1.1">SCHEMATIC · NOT PILOT DATA</text>`;
  s += `<text class="og-hide" x="544" y="78" text-anchor="middle" fill="${planted}" font-family="ui-monospace,monospace" font-size="13" letter-spacing="1">LATENT DENSE SET · SHOWN FOR EXPLANATION</text>`;
  s += `<text class="og-hide" x="68" y="211" fill="${muted}" font-family="ui-monospace,monospace" font-size="12">sparse background</text>`;
  s += `<text class="og-hide" x="1078" y="211" text-anchor="end" fill="${muted}" font-family="ui-monospace,monospace" font-size="12">background</text>`;

  // The estimator's actual observable operation: among all accepted intervals,
  // retain the one containing the greatest number of infection indices.
  s += `<path d="M345 229 V250 Q345 259 354 259 H739 Q748 259 748 250 V229" fill="none" stroke="${observed}" stroke-width="2.5"/>`;
  s += `<text class="og-hide" x="547" y="286" text-anchor="middle" fill="${observed}" font-family="ui-monospace,monospace" font-size="15" letter-spacing="1.2">OBSERVED WIDEST RAPID WINDOW</text>`;
  s += `<text class="og-hide" x="547" y="307" text-anchor="middle" fill="${muted}" font-family="ui-monospace,monospace" font-size="12">many infections · short elapsed time</text>`;

  // Exact main-theorem scope requested for the cover: the strictly sub-square-
  // root range. The broader theorem also covers alpha above one half.
  s += `<path d="M806 247 H1138" stroke="${muted}" stroke-width="1.3" opacity=".35"/>`;
  s += `<text class="og-hide" x="972" y="277" text-anchor="middle" fill="${white}" font-size="26">s = n<tspan baseline-shift="super" font-size="16">α</tspan> &lt; √n</text>`;
  s += `<text class="og-hide" x="972" y="309" text-anchor="middle" fill="${planted}" font-family="ui-monospace,monospace" font-size="15" letter-spacing=".8">1/3 &lt; α &lt; 1/2</text>`;
  s += `<text class="og-hide" x="972" y="341" text-anchor="middle" fill="${observed}" font-size="21">|Ŝ △ S| / s → 0</text>`;
  s += `<text class="og-hide" x="972" y="367" text-anchor="middle" fill="${muted}" font-family="ui-monospace,monospace" font-size="11">ASYMPTOTIC · KNOWN p=(log n)²/n</text>`;

  s += `<text class="og-hide" x="58" y="367" fill="${muted}" font-family="ui-monospace,monospace" font-size="11">FINITE PILOT: 0 / 12 PLANTED RECOVERIES</text>`;
  s += '</g>';
  return s;
};

exports.thumbnailHero = () => `
  <div class="eq-label">one SI cascade · known background · asymptotic</div>
  <div class="hero-title">1/3 &lt; α &lt; 1/2</div>
  <div class="note"><b>s = n<sup>α</sup> &lt; √n</b><br>relative recovery error → 0</div>
  <div class="eq-foot">widest rapid window · pilot: 0/12 planted recoveries</div>`;

