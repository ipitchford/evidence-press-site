'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { motifs } = require('./art-direction');
const root = path.join(__dirname, '..');
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
