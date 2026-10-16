#!/usr/bin/env node
'use strict';
const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const G = require('./check-public-text');
const cp = require('child_process');
const root = fs.mkdtempSync(path.join(os.tmpdir(),'ep-public-text-'));
const write = (p,s) => { const f=path.join(root,p); fs.mkdirSync(path.dirname(f),{recursive:true}); fs.writeFileSync(f,s); return f; };
let count=0;
function test(name,fn) { fn(); count++; console.log('PASS '+name); }
try {
  for(const dir of G.SOURCE_ROOTS) fs.mkdirSync(path.join(root,dir),{recursive:true});
  for(const file of G.SERVED_DOCS) write(file,'Public documentation.');
  write('site.config.json','{}');
  write('dist/index.html','<p>A bounded result, not peer reviewed.</p>');
  test('clean explicit source projection',()=>assert.equal(G.scan(root,'source').findings.length,0));
  for(const p of ['papers/test/body.md','papers/test/meta.json','papers/test/narration.txt','articles/test/body.md','data/catalogue.json']) {
    test('reject contaminated '+p,()=>{
      const f=write(p,'The REF assessment is 4-star overall.');
      assert.throws(()=>G.scan(root,'source'),/public-text/); fs.unlinkSync(f);
    });
  }
  test('private tooling fixtures excluded from source only',()=>{
    write('tools/fixtures/rating.txt','The REF assessment is 4-star overall.');
    assert.equal(G.scan(root,'source').findings.length,0);
  });
  test('all built paths scanned including accidental private copies',()=>{
    const f=write('dist/tools/fixtures/rating.txt','The REF assessment is 4-star overall.');
    assert.throws(()=>G.scan(root,'built'),/public-text/); fs.unlinkSync(f);
  });
  test('corrupt public PDF fails closed',()=>{
    const f=write('dist/paper.pdf','%PDF-1.4 corrupt');
    assert.throws(()=>G.scan(root,'built'),/extraction\/input errors/); fs.unlinkSync(f);
  });
  test('unrecognised binary fails closed',()=>{
    const f=write('dist/payload.bin',Buffer.from([0,255,2]));
    assert.throws(()=>G.scan(root,'built'),/extraction\/input errors/); fs.unlinkSync(f);
  });
  test('media is explicitly not text checked',()=>{
    write('dist/audio.mp3',Buffer.from([0,255,2]));
    assert.equal(G.scan(root,'built').coverage.nontext_not_checked.length,1);
  });
  test('missing source root fails closed',()=>{
    fs.rmdirSync(path.join(root,'schemas'));
    assert.throws(()=>G.scan(root,'source'),/extraction\/input errors/);
  });
  test('missing extractor runtime fails closed',()=>assert.throws(()=>G.scan(root,'built',undefined,{env:{PATH:'/nonexistent'}}),/could not run/));
  test('direct text guard fails closed',()=>assert.throws(()=>G.checkText('REF assessment: 4-star overall.','outgoing text'),/public-text/));
  test('public failure logs never echo matched excerpts',()=>{
    const planted='REF assessment: 4-star overall. PRIVATE_CANARY_729';
    write('papers/log-test/body.md',planted);
    const script=`require(${JSON.stringify(path.join(__dirname,'check-public-text.js'))}).check(${JSON.stringify(root)},'source')`;
    const result=cp.spawnSync(process.execPath,['-e',script],{encoding:'utf8'});
    assert.notEqual(result.status,0); assert(!result.stderr.includes('PRIVATE_CANARY_729')); assert(!result.stderr.includes('4-star')); assert(!result.stdout.includes(planted));
  });
  test('contaminated narration and metadata cause zero provider calls',()=>{
    const sender=path.join(root,'sender');
    for(const name of ['make-audio.js','audio-recipe.js','check-public-text.js','ref_leak_scanner.py']) write('sender/tools/'+name,fs.readFileSync(path.join(__dirname,name)));
    write('sender/network-tripwire.js',"global.fetch=async()=>{require('fs').writeFileSync(process.env.PROVIDER_MARKER,'called');throw new Error('network tripwire');};");
    const marker=path.join(sender,'provider-called');
    for(const field of ['narration','abstract']) {
      const meta={slug:'test',shortTitle:'Test',datePublished:'2026-10-16',abstract:'A bounded claim.',narration:'A bounded narration.'};
      meta[field]='REF assessment: 4-star overall.';
      write('sender/papers/test/meta.json',JSON.stringify(meta));
      const result=cp.spawnSync(process.execPath,['--require',path.join(sender,'network-tripwire.js'),path.join(sender,'tools/make-audio.js'),'test'],{encoding:'utf8',env:{...process.env,OPENAI_API_KEY:'fixture-not-a-key',PROVIDER_MARKER:marker}});
      assert.notEqual(result.status,0); assert.match(result.stderr,/public-text/); assert(!fs.existsSync(marker));
      assert(!result.stderr.includes(meta[field])); assert(!result.stdout.includes(meta[field]));
    }
  });
  test('privacy correction only permits exact reviewed string leaves',()=>{
    const {correctedComparison:P}=require('./public-text-corrections');
    const c=require('../data/PUBLIC_TEXT_CORRECTIONS.json').corrections;
    const crypto=require('crypto');
    const hash=s=>crypto.createHash('sha256').update(s).digest('hex');
    const fixture={date:'2026-10-16',sourcePath:'fixture',path:['question'],beforeSha256:hash('old'),afterSha256:hash('new'),reason:'Privacy correction'};
    const old={question:'old',outcome:'bounded theorem',clock:12},next={...old,question:'new'};
    assert.throws(()=>P(old,next,'fixture',[fixture]),/finite reviewed inventory/);
    assert.throws(()=>P(old,next,'fixture',[...c,fixture]),/finite reviewed inventory/);
    assert.throws(()=>P(old,next,'fixture',c.map((r,i)=>i? r:{...r,beforeSha256:'0'.repeat(64)})),/finite reviewed inventory/);
    const malicious={...fixture,path:['outcome'],beforeSha256:hash('bounded theorem'),afterSha256:hash('universal theorem')};
    assert.throws(()=>P(old,{...next,outcome:'universal theorem'},'fixture',[...c,malicious]),/finite reviewed inventory/);
    assert.deepEqual(P(old,next,'fixture',c),old);
    assert.notDeepEqual(P(old,{...next,outcome:'universal theorem'},'fixture',c),{...next,outcome:'universal theorem'});
    assert.notDeepEqual(P(old,{...next,clock:0},'fixture',c),{...next,clock:0});
    for(const entry of c) {let value=JSON.parse(fs.readFileSync(path.join(__dirname,'..',entry.sourcePath)));for(const key of entry.path)value=value[key];assert.equal(hash(value),entry.afterSha256);}
  });
  console.log(`${count} public-text wrapper tests passed`);
} finally { fs.rmSync(root,{recursive:true,force:true}); }
