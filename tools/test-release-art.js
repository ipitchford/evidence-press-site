'use strict';
const assert = require('node:assert/strict');
const { banner, layout, W, H, PAD } = require('./release-art');
const { wellFormedErrors } = require('./svg-xml');
const bg = { name: 'fixture', colors: ['#101820', '#203040'] };
const base = { description: 'This image helps the reader understand the fixture result.', kicker: 'MATHEMATICS · GRAPHS',
  head: 'A 351-vertex counterexample to an even-order theorem', sub: 'At order six the invariant vanishes for every tree with a multiple of 350 edges.',
  numbers: [{ value: '350', label: 'edges per period' }, { value: '288 + 31 + 31', label: 'cancelling links' }, { value: '351', label: 'least vertices' }], tag: 'UNREFEREED CANDIDATE' };
const svg = banner('fixture', base, bg);
assert.deepEqual(wellFormedErrors(svg), []);
assert.equal(banner('fixture', base, bg), svg, 'deterministic');
assert.match(svg, /data-banner-palette="fixture"/);
for (const n of [1, 2, 3]) for (const b of layout({ ...base, numbers: base.numbers.slice(0, n) }).boxes) {
  assert(b.x0 >= PAD - 0.5 && b.x1 <= W - PAD + 0.5 && b.y0 >= 0 && b.y1 <= H, 'text box inside banner');
  assert(b.x1 - b.x0 <= b.width + 0.5, 'text box inside its column');
}
const hostile = { ...base, head: 'a < b & c > "d"', numbers: [{ value: '<1>', label: 'x & y' }] };
assert.deepEqual(wellFormedErrors(banner('fixture', hostile, bg)), []);
for (const bad of [{ ...base, head: 'word '.repeat(60) }, { ...base, numbers: [] }, { ...base, numbers: Array(4).fill(base.numbers[0]) },
  { ...base, numbers: [{ value: '9'.repeat(80), label: 'x' }] }, { ...base, description: '' }, { ...base, extra: 1 }, { ...base, sub: 'long '.repeat(200) }]) {
  assert.throws(() => banner('fixture', bad, bg));
}
console.log('Release art template: well-formed, deterministic, contained by construction, 7 hostile inputs refused');

// Figure mode: the recommended default.
const fs = require('fs'), os = require('os'), path = require('path');
const { figureLayout, readFigure, FIG } = require('./release-art');
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'release-art-'));
const put = (name, body) => { fs.writeFileSync(path.join(dir, name), body); return name; };
const png = (w, h) => { const b = Buffer.alloc(33); b.writeUInt32BE(0x89504e47, 0); b.write('IHDR', 12, 'ascii'); b.writeUInt32BE(w, 16); b.writeUInt32BE(h, 20); return b; };
put('fig.svg', '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 290"><path d="M0 290 L640 0" stroke="#000"/></svg>');
const fbase = { description: base.description, kicker: base.kicker, head: 'Reliability zeros of complete graphs',
  caption: 'The zeros come closest to the origin at about 137 degrees, not on the negative axis.', figure: 'fig.svg', tag: 'UNREFEREED CANDIDATE' };
const fsvg = banner('fixture', fbase, bg, dir);
assert.deepEqual(wellFormedErrors(fsvg), []);
assert.equal(banner('fixture', fbase, bg, dir), fsvg, 'figure mode deterministic');
assert.match(fsvg, /<image [^>]*href="data:image\/svg\+xml;base64,/);
const placed = figureLayout(fbase, readFigure(path.join(dir, 'fig.svg')));
const p = placed.figureBox;
assert(p.x >= FIG.x && p.y >= FIG.y && p.x + p.w <= FIG.x + FIG.w + 0.01 && p.y + p.h <= FIG.y + FIG.h + 0.01, 'figure inside its panel');
for (const b of placed.boxes) assert(b.x0 >= PAD - 0.5 && b.x1 <= FIG.x - 20 && b.y1 <= H, 'figure-mode text left of the panel');
put('ok.png', png(1400, 620));
assert.deepEqual(wellFormedErrors(banner('fixture', { ...fbase, figure: 'ok.png' }, bg, dir)), []);
put('script.svg', '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 290"><script>alert(1)</script></svg>');
put('remote.svg', '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 290"><image href="https://example.org/x.png"/></svg>');
put('nosize.svg', '<svg xmlns="http://www.w3.org/2000/svg"><path d="M0 0"/></svg>');
put('tall.svg', '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 400"><path d="M0 0"/></svg>');
put('lowres.png', png(600, 270));
put('broken.svg', '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 290"><g></svg>');
const figureBad = [{ ...fbase, figure: 'missing.svg' }, { ...fbase, figure: 'script.svg' }, { ...fbase, figure: 'remote.svg' },
  { ...fbase, figure: 'nosize.svg' }, { ...fbase, figure: 'tall.svg' }, { ...fbase, figure: 'lowres.png' }, { ...fbase, figure: 'broken.svg' },
  { ...fbase, figure: '../fig.svg' }, { ...fbase, caption: undefined }, { ...fbase, caption: 'long '.repeat(120) },
  { ...fbase, numbers: base.numbers }, { ...base, caption: 'caption without a figure' }];
for (const bad of figureBad) assert.throws(() => banner('fixture', bad, bg, dir));
console.log(`Release art figure mode: framed figure fits its panel, ${figureBad.length} unsafe or overflowing inputs refused`);
