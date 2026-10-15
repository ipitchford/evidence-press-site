#!/usr/bin/env node
'use strict';
const fs=require('fs'), path=require('path'), crypto=require('crypto');
const core=require('../assets/js/atlas-route-core');
const root=path.resolve(__dirname,'..');
const library=JSON.parse(fs.readFileSync(path.join(root,'data/ATLAS_RESEARCH_ROUTES.json')));
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
function evaluate(input,options={}) {
  const inspected=core.inspect(input), before=core.plan(options.library||library,inspected.facts);
  const enabled=before.routes.find(r=>r.action==='matching-transversal' && r.ready);
  const run=enabled ? core.runTransversal(input,options) : {status:'route-unavailable',scope:'No executable hypothesis-matched bridge in the supplied library.'};
  return {before,run,after:core.plan(options.library||library,run.facts||inspected.facts)};
}
function main(argv) {
  const [command,file,...rest]=argv;
  if(!['inspect','run'].includes(command)||!file) throw new Error('Usage: node tools/atlas-research.js inspect|run graph.json [--budget N] [--out NEW.json]');
  const args={};
  for(let i=0;i<rest.length;i+=2){if(!['--budget','--out'].includes(rest[i])||!rest[i+1]||args[rest[i]])throw new Error('Unknown/duplicate option');args[rest[i]]=rest[i+1];}
  const bytes=fs.readFileSync(file); if(bytes.length>1000000)throw new Error('Input exceeds 1 MB');
  const input=JSON.parse(bytes), startedAt=new Date().toISOString(), t=process.hrtime.bigint();
  const result=command==='inspect' ? core.plan(library,core.inspect(input).facts) : evaluate(input,{maxAssignments:args['--budget']===undefined?undefined:Number(args['--budget'])});
  const receipt={schemaVersion:'1.0',startedAt,finishedAt:new Date().toISOString(),elapsedMs:Number(process.hrtime.bigint()-t)/1e6,
    inputSha256:hash(bytes),coreSha256:hash(fs.readFileSync(path.join(root,'assets/js/atlas-route-core.js'))),librarySha256:hash(fs.readFileSync(path.join(root,'data/ATLAS_RESEARCH_ROUTES.json'))),
    node:process.version,input,result,ceiling:'Internal finite route execution. No novelty, independent review, global optimality or causal acceleration claim.'};
  if(args['--out'])fs.writeFileSync(args['--out'],JSON.stringify(receipt,null,2)+'\n',{flag:'wx'});
  console.log(JSON.stringify(receipt,null,2));
}
if(require.main===module){try{main(process.argv.slice(2));}catch(e){console.error(e.message);process.exitCode=1;}}
module.exports={evaluate,library};
