'use strict';
// Image-led release covers. Coordinates are illustrative, not sampled data.
// Keep the mathematical statement and assurance labels in HTML, not the banner.
const circle = (x, y, r, c, opacity = 1) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}" opacity="${opacity}"/>`;
const path = (d, c, width = 2, opacity = 1) => `<path d="${d}" fill="none" stroke="${c}" stroke-width="${width}" opacity="${opacity}" stroke-linecap="round"/>`;
const ink = '#f4efe6';
const motifs = {
  'cooper-spencer-temporal-unimodality': {
    colors: ['#67c8bc', '#edbd70'],
    description: 'Three highlighted observations form a fall followed by a rise. The surrounding lattice evokes the random walk; this is an enlarged schematic, not a probability plot.',
    draw(a, b) {
      let s = '';
      for (let row = 0; row < 9; row++) for (let col = 0; col < 27; col++) {
        const x = 80 + col * 40, y = 40 + row * 40;
        s += circle(x, y, 1.5, a, .15);
      }
      // The three witness times are equally spaced; no intermediate data implied.
      const d = 'M240 115 L600 280 L960 175';
      s += path(d, a, 24, .045) + path(d, a, 10, .10) + path(d, a, 3.5);
      for (const [x, y] of [[240, 115], [600, 280], [960, 175]]) {
        s += `<circle cx="${x}" cy="${y}" r="31" fill="#172b2c" stroke="${b}" stroke-opacity=".35"/>`;
        s += circle(x, y, 9, b) + circle(x - 2, y - 2, 2, ink, .9);
      }
      return s;
    }
  },
  'quartic-inverse-coefficients': {
    colors: ['#9eafff', '#e8b46f'],
    description: 'Two colours of roots alternate along a shared line. Nested arcs distinguish the two ordered families. Root positions are schematic, not computed locations.',
    draw(a, b) {
      let s = path('M100 200 H1100', ink, 1, .2);
      const xs = [180, 300, 420, 540, 660, 780, 900, 1020];
      for (let i = 0; i < 6; i++) {
        const up = i % 2 === 0, h = up ? 45 : 355;
        s += path(`M${xs[i]} 200 C${xs[i]} ${h},${xs[i+2]} ${h},${xs[i+2]} 200`, up ? a : b, 2, .55);
      }
      xs.forEach((x, i) => {
        const c = i % 2 ? b : a;
        s += `<circle cx="${x}" cy="200" r="25" fill="${c}" opacity=".07"/>`;
        s += circle(x, 200, 7, c) + path(`M${x} 181 V219`, c, 1.5, .8);
      });
      return s;
    }
  },
  'sharp-bilagrangian-smoothness': {
    colors: ['#76cabc', '#c0a0ed'],
    description: 'Paired operator chains of increasing length evoke Jordan pencil blocks. This is a schematic of chain structure, not a rendering of a singular variety.',
    draw(a, b) {
      let s = '';
      for (const [cx, n] of [[240, 1], [580, 3], [960, 5]]) {
        for (let row = 0; row < 2; row++) {
          const y = row ? 255 : 145, c = row ? b : a;
          for (let i = 0; i < n; i++) {
            const x = cx + (i - (n-1)/2) * 48;
            if (i) s += path(`M${x-37} ${y} H${x-12}`, c, 2, .7);
            s += circle(x, y, 21, c, .065) + circle(x, y, 6, c);
            if (!row) s += path(`M${x} 159 V241`, ink, 1, .13);
          }
        }
        s += path(`M${cx-35} 200 H${cx+35}`, ink, 1, .15);
      }
      return s;
    }
  },
  'two-class-transposition-profiles': {
    colors: ['#70bce6', '#ebb676'],
    description: 'Two interleaved families of shuffle trajectories retain highlighted fixed positions. This is a two-class illustration, not a measured mixing trajectory or a complete permutation.',
    draw(a, b) {
      let s = '';
      for (let i = 0; i < 12; i++) {
        const x = 180 + i * 76, c = i % 2 ? b : a;
        const target = 180 + ((i * 5) % 12) * 76;
        s += path(`M${x} 90 C${x} 175,${target} 225,${target} 310`, c, 1.6, .36);
        s += circle(x, 90, 5, c) + circle(target, 310, 5, c);
      }
      for (const [x,c] of [[180,a],[408,b]]) {
        s += path(`M${x} 90 V310`, c, 3, .8);
        s += `<circle cx="${x}" cy="90" r="15" fill="none" stroke="${c}" stroke-width="1.5"/>`;
      }
      return s;
    }
  },
  'biased-transposition-profile-counterexample': {
    colors: ['#bfabef', '#edb970'],
    description: 'Two stationary positions stand out against a field of shuffled connections. The image evokes the two-label witness; it does not depict a numerical total-variation bound.',
    draw(a, b) {
      let s = '';
      for(let i=0;i<18;i++) {
        const x=130+i*55, tx=130+((i*7)%18)*55;
        s+=path(`M${x} 95 C${x} 180,${tx} 220,${tx} 305`,a,1,.18);
        s+=circle(x,95,3,a,.65)+circle(tx,305,3,a,.65);
      }
      for(const x of [460,735]) {
        s+=path(`M${x} 95 V305`,b,14,.05)+path(`M${x} 95 V305`,b,3,.9);
        for(const y of [95,305]) s+=`<circle cx="${x}" cy="${y}" r="23" fill="#242529" stroke="${b}" stroke-opacity=".5"/>`+circle(x,y,7,b);
      }
      return s;
    }
  }
};
module.exports = { motifs };
