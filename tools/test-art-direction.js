'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { motifs } = require('./art-direction');
const root = path.join(__dirname, '..');
require('./test-banner-contract');
for (const [slug, spec] of Object.entries(motifs)) {
  assert.equal(spec.colors.length, 2);
  assert.ok(spec.description.length > 40, `${slug}: describe the semantic boundary`);
  const first = spec.draw(...spec.colors);
  assert.equal(first, spec.draw(...spec.colors), `${slug}: must be deterministic`);
  assert.ok(!/<text\b/.test(first), `${slug}: repaired banner must remain image-led`);
  assert.ok(!/NaN|undefined/.test(first), `${slug}: invalid coordinates`);
  const svg = fs.readFileSync(path.join(root, 'assets/art', `${slug}.svg`), 'utf8');
  assert.ok(svg.includes(first), `${slug}: regenerate the committed cover`);
  assert.ok(svg.includes(spec.description), `${slug}: missing accessible description`);
}
console.log(`Art direction: ${Object.keys(motifs).length} deterministic image-led covers checked; visual acceptance is separate.`);

// Labelled scientific covers use their own semantic and regeneration contract.
const sevenCycle = require('./seven-cycle-art');
const diagram = sevenCycle.draw(...sevenCycle.colors);
assert.equal(diagram, sevenCycle.draw(...sevenCycle.colors));
assert.equal((diagram.match(/<circle\b/g) || []).length, 14, 'two seven-layer cycles');
assert.equal((diagram.match(/>33<\/text>/g) || []).length, 4, 'two maximum bands per case');
for (const label of ['115 → 112', '108–112 remains open', 'share a layer', 'disjoint']) {
  assert.ok(diagram.includes(label), `C7 diagram omits semantic label: ${label}`);
}
assert.ok(!/NaN|undefined/.test(diagram));
const sevenCycleSvg = fs.readFileSync(path.join(root, 'assets/art/seven-cycle-fourth-power-upper112.svg'), 'utf8');
assert.ok(sevenCycleSvg.includes(diagram), 'regenerate committed C7 diagram');
assert.ok(sevenCycleSvg.includes(sevenCycle.description), 'C7 accessible description');
console.log('C7 labelled case-split diagram: semantic labels and exact regeneration passed.');

// Exact finite objects and explanatory labels; this is media QA, not proof replay.
const katthan = require('./katthan-art');
assert.equal(katthan.left.length, 60);
assert.equal(katthan.right.length, 59);
assert.equal(katthan.betti.length, 56);
assert.ok(katthan.betti.every(m => katthan.left.includes(m) && katthan.right.includes(m)));
assert.deepEqual(katthan.left.filter(m => !katthan.right.includes(m)), [62]);
assert.ok(!katthan.betti.includes(62));
const katthanDiagram = katthan.draw(...katthan.colors);
assert.equal(katthanDiagram, katthan.draw(...katthan.colors));
for (const label of ['60 lcm elements', '59 lcm elements', 'B(I) ≅ B(J)', 'same 56 Betti elements', 'spdim I = 3', 'spdim J = 2', 'delete 23456'])
  assert.ok(katthanDiagram.includes(label), `Katthan diagram omits semantic label: ${label}`);
assert.ok(!/NaN|undefined/.test(katthanDiagram));
const katthanSvg = fs.readFileSync(path.join(root, 'assets/art/katthan-betti-poset-counterexample.svg'), 'utf8');
assert.ok(katthanSvg.includes(katthanDiagram), 'regenerate committed Katthan diagram');
assert.ok(katthanSvg.includes(katthan.description), 'Katthan accessible description');
console.log('Katthan labelled lattice diagrams: 60/59 nodes, common 56 Betti elements, deletion and exact regeneration passed.');
