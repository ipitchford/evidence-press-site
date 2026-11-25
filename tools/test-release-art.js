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
