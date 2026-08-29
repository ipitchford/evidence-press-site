#!/usr/bin/env node
'use strict';

const path = require('path');
const { loadImplementationStatus, validateImplementationStatus } = require('./implementation-status');
const ROOT = path.join(__dirname, '..');
const { status } = loadImplementationStatus(ROOT);
let failures = 0;
const ok = (condition, label) => condition ? console.log(`ok      ${label}`) : (failures++, console.log(`FAIL    ${label}`));

ok(validateImplementationStatus(status, { root: ROOT }).length === 0,
  'canonical implementation-status matrix validates and all source references resolve');
const paid = JSON.parse(JSON.stringify(status));
paid.initiatives[0].cashCost = 'paid';
ok(validateImplementationStatus(paid).some(error => error.includes('zero-required')),
  'negative control rejects a paid component');
const falseOperation = JSON.parse(JSON.stringify(status));
falseOperation.initiatives.find(item => item.state === 'deferred').operation = 'static-build';
ok(validateImplementationStatus(falseOperation).some(error => error.includes('must not be described as operational')),
  'negative control rejects deferred infrastructure presented as operational');
const omitted = JSON.parse(JSON.stringify(status));
omitted.initiatives.pop();
ok(validateImplementationStatus(omitted).some(error => error.includes('exactly the seven')),
  'negative control rejects a missing initiative');

console.log(failures ? `\n${failures} IMPLEMENTATION STATUS TEST(S) FAILED` : '\nALL IMPLEMENTATION STATUS TESTS PASSED');
process.exitCode = failures ? 1 : 0;
