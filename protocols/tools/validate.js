#!/usr/bin/env node
'use strict';
/*
 * validate.js — the STRUCTURE gate.
 * For each pack: validates protocol.yaml against schema/protocol.schema.json,
 * enforces the kernel invariants JSON Schema cannot express, cross-checks the
 * two status ladders, checks the SKILL.md frontmatter, and verifies MANIFEST.json
 * against the files on disk. Exit non-zero on any error.
 *
 * Usage: node tools/validate.js            (all packs + shared JSON artifacts)
 *        node tools/validate.js <pack-id>  (one pack)
 * Apache-2.0.
 */
const fs = require('fs');
const path = require('path');
const { load } = require('./lib/yaml');
const { validate } = require('./lib/jsonschema');
const U = require('./lib/util');

const SCHEMA = U.readJSON(path.join(U.ROOT, 'schema', 'protocol.schema.json'));
const KERNEL = load(fs.readFileSync(path.join(U.ROOT, 'kernel', 'kernel.yaml'), 'utf8'));
const ASSURANCE = U.readJSON(path.join(U.ROOT, 'status', 'protocol-assurance.json'));
const EVIDENCE = U.readJSON(path.join(U.ROOT, 'status', 'productivity-evidence.json'));
const ASSURANCE_IDS = new Set(ASSURANCE.states.map(s => s.id));
const EVIDENCE_IDS = new Set(EVIDENCE.states.map(s => s.id));

function validatePack(id) {
  const dir = U.packDir(id);
  const errs = [];
  const note = m => errs.push(m);

  // 1. Schema
  let p;
  try { p = load(fs.readFileSync(path.join(dir, 'protocol.yaml'), 'utf8')); }
  catch (e) { return [`protocol.yaml failed to parse: ${e.message}`]; }
  for (const e of validate(SCHEMA, p)) note(`schema ${e.path}: ${e.msg}`);
  if (p.id !== id) note(`protocol id '${p.id}' does not match directory '${id}'`);

  // 2. Kernel invariants
  const level = (KERNEL.assurance_levels || []).find(l => l.id === p.assurance_level);
  if (!level) note(`unknown assurance_level '${p.assurance_level}'`);
  const covered = new Set((p.procedure || []).map(s => s.kernel_step));
  if (level) {
    for (const step of level.required_steps) {
      if (!covered.has(step)) note(`kernel step ${step} required at '${level.id}' level but not covered by any procedure step`);
    }
  }
  for (const s of p.procedure || []) {
    if (s.kernel_step < 1 || s.kernel_step > 8) note(`procedure step ${s.step} maps to invalid kernel_step ${s.kernel_step}`);
  }
  const kinds = new Set((p.acceptance_tests || []).map(t => t.kind));
  if (!kinds.has('positive')) note('acceptance_tests: no positive test');
  if (!kinds.has('negative') && !kinds.has('boundary')) note('acceptance_tests: no failure/boundary test (kernel requires at least one)');
  if ((p.prohibited_actions || []).length === 0) note('prohibited_actions is empty');
  if ((p.risk_class === 'high' || p.risk_class === 'critical') && (p.human_checkpoints || []).length === 0)
    note(`risk_class '${p.risk_class}' requires at least one human_checkpoint`);

  // 3. Ladder cross-check (catches drift between schema enums and the ladder files)
  if (!ASSURANCE_IDS.has(p.assurance_status)) note(`assurance_status '${p.assurance_status}' not in protocol-assurance ladder`);
  if (!EVIDENCE_IDS.has(p.productivity_evidence)) note(`productivity_evidence '${p.productivity_evidence}' not in productivity-evidence ladder`);

  // 3b. Evidence-backing: a positive (benefit) productivity state must be backed by
  // a real, measured eval result whose design ceiling supports it. Negative results
  // take precedence. This closes the "declare BENEFIT for free" escalation path.
  const POS = new Set(EVIDENCE.states.filter(s => s.polarity === 'positive').map(s => s.id));
  const EORDER = new Map(EVIDENCE.states.map(s => [s.id, s.order]));
  const CEIL = EVIDENCE.design_ceiling || {};
  const evalsDir = path.join(dir, 'evals');
  const results = [];
  if (fs.existsSync(evalsDir)) {
    for (const f of fs.readdirSync(evalsDir).filter(f => f.endsWith('.json'))) {
      const d = U.readJSON(path.join(evalsDir, f));
      if (Array.isArray(d.arms) && d.arms.length && typeof d.arms[0] === 'object' && 'implied_evidence_status' in d) results.push(d);
    }
  }
  const measured = d => (d.arms || []).some(a => Object.values(a.metrics || {}).some(v => v !== null));
  if (POS.has(p.productivity_evidence)) {
    const backing = results.find(d => d.implied_evidence_status === p.productivity_evidence && measured(d)
      && EORDER.get(CEIL[d.design]) >= EORDER.get(p.productivity_evidence));
    if (!backing) note(`productivity_evidence '${p.productivity_evidence}' is a positive benefit state but no measured eval result backs it — declare NO_IMPACT_EVIDENCE until an evaluation supports the claim`);
  }
  const hasHarm = results.some(d => d.implied_evidence_status === 'HARM_OR_REGRESSION_FOUND');
  const hasNoGain = results.some(d => d.implied_evidence_status === 'NO_CLEAR_GAIN');
  if ((hasHarm || hasNoGain) && POS.has(p.productivity_evidence)) note(`an eval result reports a negative finding (${hasHarm ? 'HARM_OR_REGRESSION_FOUND' : 'NO_CLEAR_GAIN'}) but productivity_evidence is positive — negative results take precedence`);
  if (hasHarm && p.assurance_status === 'FIELD_READY') note('HARM_OR_REGRESSION_FOUND is present but assurance_status is FIELD_READY — harm blocks field readiness');

  // 3c. Kernel version compatibility + maps_to population (structural conformance).
  if (p.kernel && p.kernel.version !== KERNEL.version) note(`kernel version '${p.kernel && p.kernel.version}' does not match the installed kernel '${KERNEL.version}'`);
  if (level) {
    for (const step of KERNEL.steps || []) {
      if (!level.required_steps.includes(step.n)) continue;
      const mapped = step.maps_to || [];
      const anyPopulated = mapped.some(field => {
        const v = p[field];
        return Array.isArray(v) ? v.length > 0 : (v !== undefined && v !== null && v !== '');
      });
      if (mapped.length && !anyPopulated) note(`kernel step ${step.n} (${step.id}) maps to [${mapped.join(', ')}] but none of those fields are populated`);
    }
  }

  // 3e. Test registration: cases must cover the automated acceptance tests.
  const casesPath = path.join(dir, 'tests', 'cases.json');
  if (!fs.existsSync(casesPath)) note('tests/cases.json missing');
  else {
    const spec = U.readJSON(casesPath);
    if (spec.protocol !== id) note(`tests/cases.json protocol '${spec.protocol}' does not match pack`);
    const caseIds = (spec.cases || []).map(c => c.id);
    const dups = [...new Set(caseIds.filter((x, i) => caseIds.indexOf(x) !== i))];
    if (dups.length) note(`duplicate test case ids: ${dups.join(', ')}`);
    const atIds = new Set((p.acceptance_tests || []).map(t => t.id));
    const mappedAts = new Set((spec.cases || []).map(c => c.maps_to));
    for (const c of spec.cases || []) {
      if (!atIds.has(c.maps_to)) note(`test case ${c.id} maps_to unknown acceptance test '${c.maps_to}'`);
      if (!Array.isArray(c.checks) || c.checks.length === 0) note(`test case ${c.id} has no checks`);
      if (!spec.fixtures || !(c.fixture in spec.fixtures)) note(`test case ${c.id} references unknown fixture '${c.fixture}'`);
    }
    for (const t of p.acceptance_tests || []) {
      if (t.automated && !mappedAts.has(t.id)) note(`automated acceptance test '${t.id}' has no test case`);
    }
  }

  // 4. SKILL.md frontmatter
  const skillPath = path.join(dir, 'SKILL.md');
  if (!fs.existsSync(skillPath)) note('SKILL.md missing');
  else {
    const fm = U.frontmatter(fs.readFileSync(skillPath, 'utf8'));
    if (!fm) note('SKILL.md has no YAML frontmatter');
    else {
      const meta = load(fm);
      if (meta.name !== id) note(`SKILL.md frontmatter name '${meta.name}' does not match pack id`);
      if (!meta.description) note('SKILL.md frontmatter missing description');
    }
  }

  // 5. MANIFEST verification
  const manifestPath = path.join(dir, 'MANIFEST.json');
  if (!fs.existsSync(manifestPath)) {
    note('MANIFEST.json missing (run tools/make-manifest.js)');
  } else {
    const manifest = U.readJSON(manifestPath);
    const onDisk = U.walk(dir).filter(f => f !== 'MANIFEST.json' && f !== 'RECEIPT.json');
    const listed = new Map(manifest.files.map(f => [f.path, f.sha256]));
    for (const rel of onDisk) {
      if (!listed.has(rel)) note(`file not in manifest: ${rel}`);
      else if (listed.get(rel) !== U.sha256File(path.join(dir, rel))) note(`hash mismatch in manifest: ${rel}`);
    }
    for (const f of manifest.files) {
      if (!onDisk.includes(f.path)) note(`manifest lists missing file: ${f.path}`);
    }
    if (manifest.pack_id !== id) note(`manifest pack_id '${manifest.pack_id}' != '${id}'`);
  }

  return errs;
}

function validateSharedSchemas() {
  // Every *.schema.json must itself be valid JSON (parse) — a cheap guard.
  const errs = [];
  const dir = path.join(U.ROOT, 'schema');
  for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.json'))) {
    try { U.readJSON(path.join(dir, f)); } catch (e) { errs.push(`schema/${f}: ${e.message}`); }
  }
  return errs;
}

function main() {
  const only = process.argv[2];
  const packs = only ? [only] : U.listPacks();
  let failed = 0;
  const sharedErrs = validateSharedSchemas();
  if (sharedErrs.length) { console.log('schemas:'); sharedErrs.forEach(e => console.log('  ✗ ' + e)); failed++; }

  for (const id of packs) {
    const errs = validatePack(id);
    if (errs.length === 0) {
      console.log(`✓ ${id}`);
    } else {
      failed++;
      console.log(`✗ ${id}`);
      errs.forEach(e => console.log('    - ' + e));
    }
  }
  console.log(`\nvalidate: ${packs.length - (failed - (sharedErrs.length ? 1 : 0))}/${packs.length} packs ok`);
  process.exit(failed ? 1 : 0);
}

if (require.main === module) main();
module.exports = { validatePack };
