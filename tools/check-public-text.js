#!/usr/bin/env node
'use strict';
// Public text only. No waiver/baseline, network, model calls, OCR or listening.
const path = require('path');
const { spawnSync } = require('child_process');
const SOURCE_ROOTS = ['papers', 'articles', 'pages', 'data', 'assets', 'schemas'];
const SERVED_DOCS = ['docs/OPERATING_MODEL.md', 'docs/RESEARCH_METRICS.md',
  'docs/ATLAS_AGENTS.md', 'docs/ATLAS_EVALUATION.md', 'docs/ATLAS_MEMORY_CASES.md'];
// Fixed, reviewed bounds cover the current ~431MB composite, including nested
// downloadable archives. Exceeding them is an error, never an automatic waiver.
const LIMIT_ARGS = ['--max-input-bytes','134217728','--max-member-bytes','67108864',
  '--max-total-bytes','2147483648','--max-files','50000'];
const publicDiagnostics = report => ({
  findings: report.findings.map(f => ({source:f.source,rule:f.rule,normalized_offset:f.normalized_offset})),
  errors: report.errors.map(e => ({source:e.source,category:'extraction-or-input-failure'}))
});
function scan(root, stage, builtRoot = path.join(root, 'dist'), options = {}) {
  root = path.resolve(root);
  if (!['source','built'].includes(stage)) throw new Error('stage must be source or built');
  const inputs = stage === 'source'
    ? [...SOURCE_ROOTS, ...SERVED_DOCS, 'site.config.json'].map(p => path.join(root,p))
    : [path.resolve(builtRoot)];
  // No source tools/tests/.git/private audits enter this projection. Built
  // payloads have NO exclusions: an accidentally shipped private file is public.
  const result = spawnSync('python3', ['-B', path.join(__dirname,'ref_leak_scanner.py'), ...LIMIT_ARGS, ...inputs],
    { cwd: root, env: options.env || process.env, encoding:'utf8', maxBuffer:32*1024*1024, timeout:180000 });
  if (result.error) throw new Error(`public-text scanner could not run: ${result.error.message}`);
  let report;
  try { report = JSON.parse(result.stdout); } catch (_) { throw new Error(`invalid scanner output (exit ${result.status}): ${result.stderr.slice(0,1000)}`); }
  if (!Array.isArray(report.findings) || !Array.isArray(report.errors) || !report.coverage || !Array.isArray(report.files)) throw new Error('incomplete scanner report');
  report.siteScope = { stage, inputs, exclusionBoundary: stage === 'source' ? 'Only explicit public source roots; tools, tests, .git and private audits excluded.' : 'Entire built payload; no path exclusions.' };
  if (result.status !== 0 || report.findings.length || report.errors.length) {
    const error = new Error(`public-text ${stage} gate refused: ${report.findings.length} findings, ${report.errors.length} extraction/input errors`);
    error.report = report; throw error;
  }
  return report;
}
function check(root, stage, builtRoot, options) {
  try {
    const report = scan(root,stage,builtRoot,options);
    console.error(`Public-text ${stage}: ${report.coverage.text_checked.length} text inputs checked; ${report.coverage.nontext_not_checked.length} opaque media/font inputs NOT text-checked. No findings in checked text.`);
    return report;
  } catch (error) {
    if (error.report) console.error(JSON.stringify(publicDiagnostics(error.report),null,2));
    delete error.report; // Node's uncaught-error inspection must not print private excerpts.
    throw error;
  }
}
function checkText(text, source, options = {}) {
  if (typeof text !== 'string' || typeof source !== 'string' || !source) throw new Error('public-text requires exact text and source label');
  const program = 'import json,sys; sys.path.insert(0,sys.argv[1]); from ref_leak_scanner import scan_text; f=scan_text(sys.stdin.read(),sys.argv[2]); print(json.dumps(f)); sys.exit(bool(f))';
  const result = spawnSync('python3', ['-B','-c',program,__dirname,source],
    {input:text,encoding:'utf8',env:options.env || process.env,maxBuffer:8*1024*1024,timeout:30000});
  if(result.error) throw new Error('public-text runtime failed: '+result.error.message);
  let findings;
  try { findings=JSON.parse(result.stdout); } catch (_) { throw new Error('invalid public-text runtime output'); }
  if(result.status!==0 || !Array.isArray(findings) || findings.length) throw new Error('public-text refused '+source+' (matched content withheld from logs)');
  return findings;
}
if (require.main === module) {
  try {
    const args = process.argv.slice(2);
    let root=path.resolve(__dirname,'..'), builtRoot, stage;
    for(let i=0;i<args.length;i++) {
      if(args[i]==='--source' || args[i]==='--built') { if(stage) throw new Error('choose exactly one stage'); stage=args[i].slice(2); }
      else if(args[i]==='--root' && args[i+1]) root=path.resolve(args[++i]);
      else if(args[i]==='--built-root' && args[i+1]) builtRoot=path.resolve(args[++i]);
      else throw new Error('unknown or incomplete option: '+args[i]);
    }
    if(!stage || (builtRoot && stage!=='built')) throw new Error('usage: check-public-text.js --source|--built [--root checkout] [--built-root artifact]');
    const report=scan(root,stage,builtRoot);
    console.log(JSON.stringify(report,null,2));
  } catch(error) { if(error.report) console.log(JSON.stringify(publicDiagnostics(error.report),null,2)); console.error(error.message); process.exitCode=1; }
}
module.exports={scan,check,checkText,SOURCE_ROOTS,SERVED_DOCS,LIMIT_ARGS};
