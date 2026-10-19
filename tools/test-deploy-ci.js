'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const {validate,required} = require('./check-deploy-ci');
const commit='a'.repeat(40);
const good=()=>[{check_runs:required.map((name,i)=>({id:i+1,name,head_sha:commit,app:{slug:'github-actions'},status:'completed',conclusion:'success',html_url:'https://github.com/ipitchford/evidence-press-site/actions/runs/1'}))}];
assert.equal(validate(good(),commit).length,4);
for (const mutate of [r=>r[0].check_runs.pop(),r=>r[0].check_runs[0].status='queued',r=>r[0].check_runs[0].conclusion='failure',r=>r[0].check_runs[0].head_sha='b'.repeat(40),r=>r[0].check_runs[0].app.slug='other',r=>r[0].check_runs[0].html_url='https://example.org/',r=>r[0].check_runs.push({...r[0].check_runs[0],id:100,status:'queued'})]) { const r=good();mutate(r);assert.throws(()=>validate(r,commit)); }
assert.throws(()=>validate([],commit));
const paged=good();paged.push({check_runs:paged[0].check_runs.splice(2)});validate(paged,commit);
const script=fs.readFileSync(require('node:path').join(__dirname,'deploy.sh'),'utf8');
assert(script.indexOf('node tools/check-deploy-ci.js') < script.indexOf('node tools/build-artifact.js prepare'));
console.log('Deployment CI gate: 11 positive/hostile and ordering checks passed');
