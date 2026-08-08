#!/usr/bin/env node
'use strict';
/*
 * hostile-tests.js — the static security lint. Treats every pack as untrusted
 * supply chain. Scans for: network/exec/shell patterns in code, secret-shaped
 * strings, benefit claims not licensed by the evidence status, a missing
 * injection stance on packs that read external content, and network-requirement
 * inconsistency.
 *
 * This is ALLOW-BY-DEFAULT static analysis: it fails closed only on patterns it
 * recognises. It is a lint, not a sandbox — it does not mediate capabilities,
 * sandbox the filesystem/network, verify dependencies, or run the code. Real
 * safety is the runtime's responsibility. See KNOWN-LIMITATIONS.md.
 *
 * It self-tests its own detectors on known-good and known-bad strings, so a
 * silently broken detector cannot pass a pack by accident.
 *
 * Usage: node tools/hostile-tests.js [pack-id]. Apache-2.0.
 */
const fs = require('fs');
const path = require('path');
const { load } = require('./lib/yaml');
const U = require('./lib/util');

// ---- detectors ----
const SCRIPT_PATTERNS = [
  [/require\(\s*['"](node:)?(https?|net|dns|tls|dgram|child_process|cluster|vm|inspector|repl)['"]\s*\)/, 'requires a network/exec module (incl. node: prefix)'],
  [/\bimport\b[^;\n]*\bfrom\b\s*['"](node:)?(child_process|https?|net|dns|tls|dgram|vm|cluster)['"]/, 'ES import of a network/exec module'],
  [/\brequire\s*\(\s*[^)'"]*[+`]/, 'dynamic/concatenated require'],
  [/\bimport\s*\(\s*['"](node:)?(child_process|https?|net|dns|tls|dgram|vm)['"]\s*\)/, 'dynamic import() of a network/exec module'],
  [/\bimport\s+['"](node:)?(child_process|https?|net|dns|tls|dgram|vm)['"]/, 'side-effect import of a network/exec module'],
  [/\bcreateRequire\s*\(/, 'module.createRequire()'],
  [/globalThis\s*[.[]\s*['"]?(fetch|require)/, 'globalThis fetch/require access'],
  [/\bprocess\.mainModule\b/, 'process.mainModule access'],
  [/\bvm\.(runInNewContext|runInThisContext|compileFunction)\b/, 'vm dynamic-code execution'],
  [/\bfetch\s*\(/, 'uses fetch()'],
  [/\bXMLHttpRequest\b/, 'uses XMLHttpRequest'],
  [/\bWebSocket\b/, 'uses WebSocket'],
  [/\beval\s*\(/, 'uses eval()'],
  [/new\s+Function\s*\(/, 'uses new Function()'],
];
// Shell-command signatures, scanned only in executable files (not prose).
const SHELL_PATTERNS = [
  [/\b(curl|wget|ncat|nc|powershell|Invoke-WebRequest)\b/, 'shell network command'],
];
const SECRET_PATTERNS = [
  [/-----BEGIN [A-Z ]*PRIVATE KEY-----/, 'private key'],
  [/\bsk-[A-Za-z0-9]{20,}/, 'OpenAI-style secret key'],
  [/\bAKIA[0-9A-Z]{16}\b/, 'AWS access key id'],
  [/\bghp_[A-Za-z0-9]{20,}/, 'GitHub token'],
  [/\b(api[_-]?key|secret|token|password)\s*[:=]\s*['"][^'"]{12,}['"]/i, 'hardcoded credential'],
];
// Strong / quantified benefit-claim patterns. These are the shapes that only a
// causal study could license; they are unlikely to appear in honest hedged prose.
// The detector is a heuristic backstop, not a proof of no overclaim — the
// structural control is that a positive productivity_evidence state requires a
// backing eval result (enforced in validate.js). Coverage is limited to
// library-authored descriptive prose (README/SKILL/protocol.yaml/adapters), NOT
// example content or eval reports, which carry DOMAIN claims that are not claims
// about the protocol. See KNOWN-LIMITATIONS.md.
const CLAIM_PATTERNS = [
  /\b\d+\s?(%|percent)\s?(faster|slower|fewer|more|less|higher|lower|improvement|reduction|productive|accurate)/i,
  /\b(by\s+)?\d+\s?(%|percent)\b(?=[^.]*\b(faster|fewer|more|less|reduction|improvement|productive|errors?|time)\b)/i,
  /\b\d+x\s+(faster|more|fewer)\b/i,
  /\btwice\s+as\s+(fast|quick|productive|accurate)\b/i,
  /\bsaves?\s+(you\s+)?\w+\s+(hours?|minutes?|time)\b/i,
  /\b\d+\s+(working\s+)?(days?|hours?|minutes?)\b[^.]*\b(saved|save)\b/i,
  /\b(saved|save)\b[^.]*\b(each|per|a)\s+(day|week|month)\b/i,
  /\bmakes?\s+(you|users|teams?)\s+(more\s+productive|faster|more\s+efficient)\b/i,
  /\b(much|substantially|significantly|dramatically)\s+(faster|better|more\s+productive|more\s+efficient)\b/i,
  /\bmore\s+efficient\b/i,
  /\bproven\s+to\b/i,
  /\bguaranteed\s+to\b/i,
  /\bincreases?\s+(your\s+)?productivity\b/i,
  /\bimproves?\s+(output\s+)?(quality|accuracy|productivity)\b/i,
  /\breduces?\s+(errors?|rework|mistakes|hallucinations?)\b/i,
  /\bprevents?\s+hallucinat/i,
  /\b(finish|complete)(es|s)?\s+(sooner|faster)\b/i,
  /\bbetter\s+outcomes\b/i,
  /\bdoubles?\s+(throughput|output|productivity)\b/i,
  /\bcuts?\s+(completion\s+)?time\b/i,
];
// Hedge / meta-context markers. A clause containing one of these is not a live
// benefit assertion — it is a negation, a question, a target, a threshold, or a
// discussion of a claim rather than a claim. Deliberately excludes "without"/"no"
// (benign comparisons). Includes meta-context words (whether/threshold/criterion/
// hypothesis/prohibited/comparison arm) so honest descriptions of benchmarks and
// acceptance criteria are not flagged. The self-test locks this behaviour in.
const HEDGE = /(\bnot\b|\bnever\b|would\s+require|not\s+measured|unmeasured|cannot\s+claim|does\s+not|has\s+not|hypothes|would\s+need|not\s+yet|no\s+evidence|\bwhether\b|\bthreshold\b|\bcriterion\b|comparison\s+arm|\bprohibited\b)/i;

function findClaims(text) {
  const sentences = text.split(/(?<=[.!?])\s+|\n+/);
  const hits = [];
  for (const s of sentences) {
    // Evaluate each CLAUSE independently so a hedge in one clause cannot excuse a
    // claim in another ("Not measured, but it makes you faster"; "no evidence
    // needed because it reduces errors"; "the criterion is simple: it improves
    // quality"). Split on conjunctions, colons, causal connectives, and dashes.
    for (const clause of s.split(/\bbut\b|;|—| - |:|\bbecause\b|\bsince\b|\band\b/i)) {
      if (HEDGE.test(clause)) continue;
      for (const re of CLAIM_PATTERNS) if (re.test(clause)) { hits.push(clause.trim().slice(0, 80)); break; }
    }
  }
  return hits;
}

// ---- self-test: prove the detectors discriminate ----
function selfTest() {
  const failures = [];
  // overclaim detector
  const badClaims = [
    'This protocol is 30% faster than working without it.',
    'It saves you three hours a week.',
    'Proven to increase your productivity.',
    'Makes you more productive on every task.',
    'Benefit has not been measured, but this protocol makes you more productive.', // clause evasion
    'It reduces errors and rework.',
    'Teams finish sooner.',
    'It cuts completion time by 30 percent.',
    'The protocol reliably prevents hallucinations.',
    'It delivers better outcomes with less effort.',
    'There is no evidence required because this protocol reduces errors.',      // causal-clause evasion
    'The criterion is simple: the protocol improves quality.',                  // colon-clause evasion
    'It does not merely document the work and reduces rework.'                  // conjunction-clause evasion
  ];
  const goodClaims = [
    'Any claim that it improves your work would require an evaluation this pack has not yet run.',
    'This is a description of the mechanism, not a measured saving.',
    'It is not a guarantee of benefit.',
    'Benefit not yet measured.',
    'The benchmark tests whether users are 30% faster.',        // meta: a question, not a claim
    'The acceptance threshold is 20% fewer errors.',            // meta: a criterion
    'We reject the hypothesis that it significantly improves accuracy.' // meta: a hypothesis
  ];
  for (const b of badClaims) if (findClaims(b).length === 0) failures.push(`overclaim detector missed: "${b}"`);
  for (const g of goodClaims) if (findClaims(g).length !== 0) failures.push(`overclaim detector false-positived: "${g}"`);
  // secret detector
  if (!SECRET_PATTERNS.some(([re]) => re.test('api_key = "abcdef0123456789"'))) failures.push('secret detector missed a hardcoded credential');
  if (SECRET_PATTERNS.some(([re]) => re.test('the api key is provided by your password manager'))) failures.push('secret detector false-positived on prose');
  // script detector
  if (!SCRIPT_PATTERNS.some(([re]) => re.test("require('child_process')"))) failures.push('script detector missed child_process');
  if (!SCRIPT_PATTERNS.some(([re]) => re.test("import('node:child_process')"))) failures.push('script detector missed dynamic import()');
  if (!SCRIPT_PATTERNS.some(([re]) => re.test("const r = module.createRequire(x)"))) failures.push('script detector missed createRequire');
  return failures;
}

function scanPack(id) {
  const dir = U.packDir(id);
  const p = load(fs.readFileSync(path.join(dir, 'protocol.yaml'), 'utf8'));
  const findings = [];
  const files = U.walk(dir).filter(f => f !== 'MANIFEST.json' && f !== 'RECEIPT.json');

  // scripts / code (any executable-ish file, plus anything under scripts/)
  const codeFiles = files.filter(f => /\.(js|mjs|cjs|sh|py|rb|ts)$/.test(f) || f.startsWith('scripts/'));
  for (const rel of codeFiles) {
    const src = fs.readFileSync(path.join(dir, rel), 'utf8');
    const declared = (p.permissions || []).some(x => x.action === 'network' || x.action === 'execute');
    for (const [re, why] of [...SCRIPT_PATTERNS, ...SHELL_PATTERNS]) if (re.test(src)) {
      findings.push(`${rel}: ${why}${declared ? ' (declared)' : ' — NOT declared in permissions'}`);
    }
  }
  // secrets (skip binary-ish; scan text)
  for (const rel of files) {
    let src; try { src = fs.readFileSync(path.join(dir, rel), 'utf8'); } catch { continue; }
    for (const [re, what] of SECRET_PATTERNS) if (re.test(src)) findings.push(`${rel}: possible ${what}`);
  }
  // overclaim — only a causal study licenses a strong/quantified benefit claim.
  // Scope is library-authored descriptive prose, NOT example content or eval
  // reports (those carry domain claims, not claims about the protocol).
  const proseFiles = files.filter(f => /(^README\.md$|^SKILL\.md$|^protocol\.yaml$|^adapters\/.*\.md$)/.test(f));
  const licensed = p.productivity_evidence === 'CAUSAL_EFFECT_SUPPORTED';
  for (const rel of proseFiles) {
    const hits = findClaims(fs.readFileSync(path.join(dir, rel), 'utf8'));
    if (hits.length && !licensed) hits.forEach(h => findings.push(`${rel}: benefit claim not licensed by productivity_evidence '${p.productivity_evidence}': "${h}"`));
  }
  // injection stance: a pack that reads external material must (a) declare, in
  // prohibited_actions, that it will not act on instructions inside that material,
  // (b) ship at least one boundary acceptance test, and (c) name an injection stop
  // condition or failure mode. Vocabulary alone is not enough — all three must hold.
  const readsExternal = (p.required_inputs || []).some(i => i.evidence_role === 'citable_evidence' || i.evidence_role === 'work_material');
  if (readsExternal) {
    const prohibitsActing = (p.prohibited_actions || []).some(a => /instruction/i.test(a));
    const hasBoundaryTest = (p.acceptance_tests || []).some(t => t.kind === 'boundary');
    const stop = (p.stop_conditions || []).join(' ') + (p.failure_modes || []).map(f => f.mode + ' ' + f.detection).join(' ');
    const namesInjection = /inject|embedded|instruction/i.test(stop);
    if (!prohibitsActing) findings.push('reads external material but prohibited_actions does not forbid acting on embedded instructions');
    if (!hasBoundaryTest) findings.push('reads external material but ships no boundary acceptance test (injection resistance)');
    if (!namesInjection) findings.push('reads external material but declares no injection stop condition / failure mode');
  }
  // network-requirement consistency
  const manifestPath = path.join(dir, 'MANIFEST.json');
  if (fs.existsSync(manifestPath)) {
    const m = U.readJSON(manifestPath);
    const declaresNetwork = (p.permissions || []).some(x => x.action === 'network');
    if (m.network_required !== declaresNetwork) findings.push(`manifest network_required=${m.network_required} but permissions ${declaresNetwork ? 'declare' : 'do not declare'} network`);
  }
  return findings;
}

function main() {
  const selfFailures = selfTest();
  if (selfFailures.length) {
    console.log('✗ detector self-test FAILED:');
    selfFailures.forEach(f => console.log('    - ' + f));
    process.exit(2);
  }
  console.log('✓ detector self-test passed');

  const only = process.argv[2];
  const packs = only ? [only] : U.listPacks();
  let failed = 0;
  for (const id of packs) {
    const findings = scanPack(id);
    if (findings.length === 0) console.log(`✓ ${id}`);
    else { failed++; console.log(`✗ ${id}`); findings.forEach(f => console.log('    - ' + f)); }
  }
  console.log(`\nhostile: ${packs.length - failed}/${packs.length} packs clean`);
  process.exit(failed ? 1 : 0);
}

if (require.main === module) main();
module.exports = { scanPack, findClaims, selfTest };
