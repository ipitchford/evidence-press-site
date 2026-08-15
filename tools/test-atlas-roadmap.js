#!/usr/bin/env node
'use strict';

const path = require('path');
const { loadAtlasRoadmap, validateAtlasRoadmap } = require('./atlas-roadmap');

const ROOT = path.join(__dirname, '..');
const { roadmap } = loadAtlasRoadmap(ROOT);
let failures = 0;
function ok(condition, label) {
  if (condition) console.log(`ok      ${label}`);
  else { failures++; console.log(`FAIL    ${label}`); }
}

ok(validateAtlasRoadmap(roadmap).length === 0, 'canonical Atlas roadmap passes semantic validation');

const dangling = JSON.parse(JSON.stringify(roadmap));
dangling.nextSteps[1].dependencies = ['atlas-step-does-not-exist'];
ok(validateAtlasRoadmap(dangling).some(error => error.includes('unresolved dependency')),
  'negative control rejects a dangling roadmap dependency');

const cyclic = JSON.parse(JSON.stringify(roadmap));
cyclic.nextSteps[0].dependencies = ['atlas-step-discovery-pilot'];
ok(validateAtlasRoadmap(cyclic).some(error => error.includes('dependency cycle')),
  'negative control rejects a roadmap dependency cycle');

const duplicate = JSON.parse(JSON.stringify(roadmap));
duplicate.nextSteps[1].id = duplicate.nextSteps[0].id;
ok(validateAtlasRoadmap(duplicate).some(error => error.includes('duplicates id')),
  'negative control rejects duplicate roadmap step identities');

const reordered = JSON.parse(JSON.stringify(roadmap));
reordered.nextSteps[1].priority = 0;
ok(validateAtlasRoadmap(reordered).some(error => error.includes('strictly increasing priority')),
  'negative control rejects priority-order drift');

console.log(failures ? `\n${failures} ATLAS ROADMAP TEST(S) FAILED` : '\nALL ATLAS ROADMAP TESTS PASSED');
process.exitCode = failures ? 1 : 0;
