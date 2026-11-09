#!/usr/bin/env node
'use strict';
const assert=require('assert/strict'),fs=require('fs'),path=require('path'),os=require('os'),crypto=require('crypto');
const {read}=require('./minds-explored');
const root=path.resolve(__dirname,'..'),{dir,m}=read(root),base='/minds-explored/';
const input=path.join(dir,'site'),index=JSON.parse(fs.readFileSync(path.join(input,'data/index.json'),'utf8'));
assert.equal(index.records.length,4398);assert.equal(index.records.filter(r=>r.kind==='video').length,4209);
assert.equal(index.records.filter(r=>r.kind==='video'&&r.qualified).length,1608);
assert.equal(index.records.filter(r=>r.kind==='guide').length,51);assert.equal(index.records.filter(r=>r.kind==='path').length,20);
for(const r of index.records)assert.ok(r.url.startsWith(base),r.url);
for(const f of m.files.filter(f=>f.path.endsWith('.html'))){
  const html=fs.readFileSync(path.join(input,f.path),'utf8');
  assert.ok(html.includes('| Minds Explored</title>'),f.path);
  assert.ok(html.includes('http-equiv="Content-Security-Policy"'),f.path);
  for(const match of html.matchAll(/\b(?:href|src|action)="(\/(?!\/)[^"]*)"/g))assert.ok(match[1].startsWith(base),f.path+': '+match[1]);
  assert.ok(!html.includes('http://localhost:'),f.path);
  assert.ok(!/"(?:access_token|refresh_token|client_secret|apiMetadata)"\s*:/.test(html),f.path);
  if(f.path.startsWith('resources/')){const player=JSON.parse(html.match(/id="player-data">([^<]+)/)[1]);assert.equal(player.apiExpiresAt,null);if(player.delivery==='youtube'&&player.embedUrl)assert.match(player.embedUrl,/^https:\/\/www\.youtube-nocookie\.com\/embed\/[A-Za-z0-9_-]{11}(?:\?|$)/);}
}
assert.ok(m.files.filter(f=>f.path.startsWith('resources/')&&f.path.endsWith('.html')).some(f=>fs.readFileSync(path.join(input,f.path),'utf8').includes('data-load-player')),'Public players must remain available');
const css=fs.readFileSync(path.join(input,'assets/style.css'),'utf8');assert.ok(!css.includes("url('/fonts/"));
const app=fs.readFileSync(path.join(input,'assets/app.mjs'),'utf8');assert.ok(app.includes("fetch(local('/data/index.json'))"));
assert.ok(!/href="\/(?:paths|topics)\//.test(app));
const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'minds-mount-'));
try{
  const d=path.join(tmp,'pages/minds-explored');fs.mkdirSync(path.join(d,'site'),{recursive:true});
  const bytes=Buffer.from('fixture');fs.writeFileSync(path.join(d,'site/index.html'),bytes);
  const fixture={...m,files:[{path:'index.html',bytes:bytes.length,sha256:crypto.createHash('sha256').update(bytes).digest('hex')}]};
  fs.writeFileSync(path.join(d,'manifest.json'),JSON.stringify(fixture));read(tmp);
  fs.writeFileSync(path.join(d,'site/index.html'),'changed');assert.throws(()=>read(tmp),/hash differs/);
  fs.writeFileSync(path.join(d,'site/index.html'),bytes);fs.writeFileSync(path.join(d,'site/unlisted.txt'),'extra');assert.throws(()=>read(tmp),/inventory differs/);
}finally{fs.rmSync(tmp,{recursive:true,force:true});}
console.log('Minds Explored: branded routes, honest public counts, privacy boundary and manifest tampering checks passed.');
