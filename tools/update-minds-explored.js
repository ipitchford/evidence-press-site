#!/usr/bin/env node
'use strict';
// Authoring-only import. Never run by the offline host build or deployment.
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const root=path.resolve(__dirname,'..'),app=path.resolve(process.argv[2]||'');
if(!process.argv[2])throw Error('Usage: node tools/update-minds-explored.js /absolute/authoring-copy');
const report=JSON.parse(fs.readFileSync(path.join(app,'evaluation/build.json'),'utf8'));
if(report.baseUrl!=='https://evidencepress.org/minds-explored'||report.apiMetadataRefreshDeadline!==null||report.privateCachesPublished!==false)throw Error('Only the permanent public edition is accepted');
const source=path.join(app,'dist'),dir=path.join(root,'pages/minds-explored'),out=path.join(dir,'site');
const csp=fs.readFileSync(path.join(source,'_headers'),'utf8').split('\n').find(line=>line.includes('Content-Security-Policy: ')).split(': ')[1];
if(!fs.readFileSync(path.join(source,'index.html'),'utf8').includes('Minds Explored'))throw Error('Brand missing');
const files=[];
function walk(folder,prefix=''){
  for(const name of fs.readdirSync(folder).sort()){
    const file=path.join(folder,name),rel=prefix+name,stat=fs.lstatSync(file);
    if(stat.isSymbolicLink())throw Error('Symlink rejected');
    if(stat.isDirectory()){walk(file,rel+'/');continue;}
    if(!stat.isFile()||/(^|\/)(?:\.private|\.cache|functions|_worker\.js)/.test(rel))throw Error('Unexpected public input');
    if(['_headers','robots.txt'].includes(rel))continue;
    let bytes=fs.readFileSync(file);
    if(rel.endsWith('.html'))bytes=Buffer.from(bytes.toString('utf8').replace('</head>',`<meta http-equiv="Content-Security-Policy" content="${csp}"></head>`));
    files.push({rel,bytes});
  }
}
walk(source);
// All inputs above are checked before replacing the prior version-controlled tree.
fs.rmSync(out,{recursive:true,force:true});fs.mkdirSync(out,{recursive:true});
for(const f of files){const dest=path.join(out,f.rel);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,f.bytes);}
const index=JSON.parse(fs.readFileSync(path.join(out,'data/index.json'),'utf8'));
const manifest={schemaVersion:1,brand:'Minds Explored',baseUrl:'https://evidencepress.org/minds-explored/',builtAt:report.builtAt,publicationBoundary:'Institution-sourced public edition; private YouTube API overlays and credentials excluded. API-enriched local preview counts do not describe this edition.',counts:report.counts,cataloguedVideos:index.records.filter(r=>r.kind==='video').length,indexRecords:index.records.length,contentLicence:'CC-BY-4.0',softwareLicence:'MIT',apiMetadataRefreshDeadline:null,files:files.map(f=>({path:f.rel,sha256:crypto.createHash('sha256').update(f.bytes).digest('hex'),bytes:f.bytes.length})).sort((a,b)=>a.path<b.path?-1:a.path>b.path?1:0)};
fs.writeFileSync(path.join(dir,'manifest.json'),JSON.stringify(manifest,null,2)+'\n');
console.log(`Imported ${files.length} reviewed static files. Run the host tests and guarded publication workflow.`);
