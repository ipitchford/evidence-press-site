'use strict';
const assert = require('assert/strict');
const {load, resolve, rotation} = require('./thumbnail-palettes');
const rows = load().assignments;
const before = new Map(rows.map(row => [row.slug, resolve(row.slug)]));
for (const row of rows) assert.equal(resolve(row.slug), row.editorialPalette || row.palette);
for (const row of [...rows].reverse()) assert.equal(resolve(row.slug), before.get(row.slug));
assert.throws(() => resolve('__missing_test_slug__'), /Generate thumbnail/);
const recent = rows.filter(row => !row.legacy);
for (let i = 0; i + rotation.length <= recent.length; i++)
  assert.equal(new Set(recent.slice(i, i + rotation.length).map(row => row.palette)).size, rotation.length);
console.log('Thumbnail palettes: stable across reorder; missing assignments rejected; six-colour diversity passed.');
