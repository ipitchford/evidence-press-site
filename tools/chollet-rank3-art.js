'use strict';

const colors = ['#f4b77a', '#80d6c6'];

const description = 'A five-by-five extremal correlation matrix is shown as a two-plus-three block structure. Its entrywise square feeds an exact permanent ratio of thirteen forty-eighths; the displayed values come from the equality witness in the paper, not sampled data.';

function text(x, y, value, size, fill, anchor = 'middle', family = 'Georgia') {
  return `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="${family}" font-size="${size}" fill="${fill}">${value}</text>`;
}

function draw(a, b) {
  const ink = '#f4efe6';
  const dim = '#c8d4d1';
  const cells = [];
  const x0 = 100;
  const y0 = 65;
  const step = 49;
  for (let row = 0; row < 5; row += 1) {
    for (let col = 0; col < 5; col += 1) {
      const sameTwo = row < 2 && col < 2;
      const sameThree = row >= 2 && col >= 2;
      const diagonal = row === col;
      const fill = sameTwo ? a : sameThree ? b : '#d6dedb';
      const opacity = diagonal ? 0.88 : sameTwo ? 0.56 : sameThree ? 0.34 : 0.045;
      cells.push(`<rect x="${x0 + col * step}" y="${y0 + row * step}" width="39" height="39" rx="7" fill="${fill}" opacity="${opacity}"/>`);
      if (sameThree && !diagonal) {
        cells.push(text(x0 + col * step + 19.5, y0 + row * step + 26, '−½', 15, ink, 'middle', 'ui-monospace,monospace'));
      }
    }
  }
  let s = cells.join('');
  s += `<rect x="${x0 - 10}" y="${y0 - 10}" width="${2 * step}" height="${2 * step}" rx="16" fill="none" stroke="${a}" stroke-width="2" opacity=".75"/>`;
  s += `<rect x="${x0 + 2 * step - 10}" y="${y0 + 2 * step - 10}" width="${3 * step}" height="${3 * step}" rx="16" fill="none" stroke="${b}" stroke-width="2" opacity=".75"/>`;
  s += text(217, 345, 'C★ = J₂ ⊕ E₃', 25, ink);

  s += `<path d="M405 195 H535" stroke="${dim}" stroke-width="2" opacity=".65"/>`;
  s += `<path d="M515 181 L535 195 L515 209" fill="none" stroke="${dim}" stroke-width="2"/>`;
  s += text(470, 164, 'entrywise square', 16, dim, 'middle', 'ui-monospace,monospace');

  s += `<circle cx="675" cy="195" r="112" fill="none" stroke="${b}" stroke-width="3" opacity=".48"/>`;
  s += `<circle cx="675" cy="195" r="86" fill="${b}" opacity=".07"/>`;
  s += text(675, 157, 'per(C★ ∘ C★)', 22, dim);
  s += text(675, 218, '39 / 16', 48, b);
  s += text(675, 255, 'per(C★) = 3', 20, ink);

  s += `<path d="M805 195 H890" stroke="${dim}" stroke-width="2" opacity=".65"/>`;
  s += `<path d="M870 181 L890 195 L870 209" fill="none" stroke="${dim}" stroke-width="2"/>`;
  s += text(847, 164, 'divide by 3²', 16, dim, 'middle', 'ui-monospace,monospace');

  s += `<rect x="925" y="92" width="205" height="206" rx="26" fill="${a}" opacity=".08" stroke="${a}" stroke-width="2"/>`;
  s += text(1028, 155, 'sharp ratio', 22, dim);
  s += text(1028, 230, '13 / 48', 57, a);
  s += text(1028, 269, 'rank ≤ 3 · order 5', 16, ink, 'middle', 'ui-monospace,monospace');
  return s;
}

function thumbnailHero() {
  return '<div class="eq-label">exact equality witness · order five</div><div class="hero-title">13 / 48</div><div class="note"><b>C★ = J₂ ⊕ E₃</b><br>per(C★) = 3<br>per(C★ ∘ C★) = 39/16</div><div class="eq-foot">real PSD · rank at most three</div>';
}

module.exports = { colors, description, draw, thumbnailHero };
