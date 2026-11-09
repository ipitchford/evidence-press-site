/* Minds Explored is a separately licensed static learning application.
 * Reviewed authoring output is a pinned input to the dependency-free host build.
 * The manifest binds every file. No private API cache or credentials are used. */
'use strict';
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const sha=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
function read(root){
  const dir=path.join(root,'pages/minds-explored'),m=JSON.parse(fs.readFileSync(path.join(dir,'manifest.json'),'utf8'));
  if(m.brand!=='Minds Explored'||m.baseUrl!=='https://evidencepress.org/minds-explored/'||m.apiMetadataRefreshDeadline!==null)throw Error('Minds Explored publication boundary changed');
  const actual=[];
  function walk(dir,prefix=''){for(const name of fs.readdirSync(dir).sort()){const rel=prefix+name,file=path.join(dir,name),s=fs.lstatSync(file);if(s.isSymbolicLink())throw Error('Minds Explored symlink');if(s.isDirectory())walk(file,rel+'/');else if(s.isFile())actual.push(rel);else throw Error('Minds Explored non-file');}}
  walk(path.join(dir,'site'));
  if(new Set(m.files.map(f=>f.path)).size!==m.files.length||actual.sort().join('\n')!==m.files.map(f=>f.path).sort().join('\n'))throw Error('Minds Explored file inventory differs');
  for(const f of m.files){if(f.path.startsWith('/')||f.path.split('/').includes('..'))throw Error('Minds Explored unsafe path');const bytes=fs.readFileSync(path.join(dir,'site',f.path));if(bytes.length!==f.bytes||sha(bytes)!==f.sha256)throw Error('Minds Explored hash differs: '+f.path);}
  return {dir,m};
}
function build(root,dist){const {dir}=read(root);fs.cpSync(path.join(dir,'site'),path.join(dist,'minds-explored'),{recursive:true});}
function routes(root){const {dir}=read(root);return [...fs.readFileSync(path.join(dir,'site/sitemap.xml'),'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>({loc:m[1]}));}
module.exports={read,build,routes};
