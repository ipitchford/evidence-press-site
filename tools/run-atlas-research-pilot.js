#!/usr/bin/env node
'use strict';
const fs=require('fs'),path=require('path'),crypto=require('crypto'),assert=require('assert/strict');
const core=require('../assets/js/atlas-route-core'), {evaluate,library}=require('./atlas-research');
const root=path.resolve(__dirname,'..'), read=f=>fs.readFileSync(path.join(root,f)), hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const startedAt=new Date().toISOString();
const intake=JSON.parse(read('data/atlas-research/intake.json'));
const target=JSON.parse(read('data/atlas-research/graph48.json')), control=JSON.parse(read('data/atlas-research/graph50-control.json'));
const t=process.hrtime.bigint(), result=evaluate(target), controlResult=evaluate(control);
const ablation=JSON.parse(JSON.stringify(library));ablation.rules=ablation.rules.filter(r=>r.id!=='graph-to-sat');
const ablationResult=evaluate(target,{library:ablation});
assert.equal(result.run.witnessCheck.valid,true);assert.equal(controlResult.run.status,'no-transversal');assert.equal(ablationResult.run.status,'route-unavailable');
function binomial(n,k){let a=1n;for(let i=1;i<=k;i++)a=a*BigInt(n-i+1)/BigInt(i);return a.toString();}
const out={schemaVersion:'1.0',kind:'selected-constructive-pilot',startedAt,finishedAt:new Date().toISOString(),elapsedMs:Number(process.hrtime.bigint()-t)/1e6,
  intakeId:intake.id,inputSha256:hash(read('data/atlas-research/graph48.json')),coreSha256:hash(read('assets/js/atlas-route-core.js')),librarySha256:hash(read('data/ATLAS_RESEARCH_ROUTES.json')),intakeSha256:hash(read('data/atlas-research/intake.json')),node:process.version,
  input:target,result,negativeControl:{input:control,inputSha256:hash(read('data/atlas-research/graph50-control.json')),result:controlResult},ablation:{removed:'graph-to-sat',result:ablationResult.run},
  searchSpace:{unrestricted15Subsets:binomial(48,15),restrictedAssignments:result.run.totalAssignments,meaning:'A mathematical candidate-count comparison only, not a runtime benchmark against an optimized solver or a human.'},
  outcome:'Concrete ordinary dominating witness found for the exact 48-vertex graph; finite counterexample route stopped. External order-48 theorem was already known. No new general theorem.',
  limits:['One selected internal pilot, not a blinded comparison or causal acceleration result.','50-vertex no-transversal control does not replay its published ordinary-domination lower bound.','Independent domination 16 is inherited from the release, not reverified here.','No graph relationship or scholarly assurance automatically promoted.']};
const dest=process.argv[2];if(!dest)throw new Error('Give a NEW output receipt path');
fs.writeFileSync(dest,JSON.stringify(out,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({receipt:dest,status:out.outcome,solutions:result.run.solutions,control:controlResult.run.status,searchSpace:out.searchSpace,elapsedMs:out.elapsedMs},null,2));
