'use strict';
const assert=require('node:assert/strict');
const l=require('./license-scope');
const escape=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const p={licenseScope:'Original prose CC0; code MIT; upstream retains terms. <script> & "quote"\nExternal dependency.'};
assert.deepEqual(l.fields({}),{license:'CC0-1.0'});
assert.equal(l.jsonld({}),'https://creativecommons.org/publicdomain/zero/1.0/');
assert.equal(l.yaml({}),'license: CC0-1.0');
assert.equal(l.html({},escape),'<a href="https://creativecommons.org/publicdomain/zero/1.0/" rel="noopener">CC0 1.0</a>');
assert.equal(l.fields(p).license,'LicenseRef-Component-Specific');
assert.equal(l.fields(p).licenseScope,p.licenseScope);
assert.equal(l.jsonld(p).description,p.licenseScope);
assert.ok(!l.html(p,escape).includes('<script>'));
assert.ok(l.html(p,escape).includes('&lt;script&gt; &amp; &quot;quote&quot;'));
assert.equal(JSON.parse(l.yaml(p).split('\nlicenseScope: ')[1]),p.licenseScope);
for(const v of ['',null,{},'x'.repeat(2001)])assert.throws(()=>l.scope({licenseScope:v}));
assert.equal(l.scope({licenseScope:'😀'.repeat(2000)}),'😀'.repeat(2000));
assert.throws(()=>l.scope({licenseScope:'😀'.repeat(2001)}));
if(process.argv.includes('--built')){
 const fs=require('fs'),path=require('path'),root=path.join(__dirname,'../dist/releases/assignment-aligned-effective-states');
 const m=JSON.parse(fs.readFileSync(path.join(root,'paper.json'),'utf8'));
 assert.equal(m.license,'LicenseRef-Component-Specific');assert.ok(m.licenseScope.includes('Original code: MIT'));
 const h=fs.readFileSync(path.join(root,'index.html'),'utf8');assert.ok(h.includes('class="license-scope"'));
 const graph=JSON.parse(h.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])['@graph'];
 for(const t of ['ScholarlyArticle','SoftwareSourceCode','Dataset'])assert.equal(graph.find(n=>n['@type']===t).license.description,m.licenseScope);
 assert.ok(fs.readFileSync(path.join(root,'index.md'),'utf8').includes('licenseScope: '));
}
console.log('License-scope tests passed: legacy defaults, scoped outputs, escaped text and validation.');
