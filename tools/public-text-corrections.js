'use strict';
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const hash=s=>crypto.createHash('sha256').update(s,'utf8').digest('hex');
// Finite, explicitly reviewed 2026-10-16 inventory. Adding a new hash pair is
// not an authorization: it fails unless this code boundary is reviewed anew.
const REVIEWED_INVENTORY_SHA256='e02debe9820bab7c48618a1c1eae083e88fd1ec495dd9d2c47d4b527a19e42b6';
function correctedComparison(live,candidate,sourcePath,records) {
  if(!live || !candidate) return live;
  if(!records) records=JSON.parse(fs.readFileSync(path.join(__dirname,'../data/PUBLIC_TEXT_CORRECTIONS.json'),'utf8')).corrections;
  if(!Array.isArray(records)) throw new Error('invalid public-text correction inventory');
  if(hash(JSON.stringify(records))!==REVIEWED_INVENTORY_SHA256) throw new Error('public-text correction inventory is not the finite reviewed inventory');
  const copy=JSON.parse(JSON.stringify(live));
  for(const record of records.filter(r=>r.sourcePath===sourcePath)) {
    if(!Array.isArray(record.path) || !record.path.length || record.path.some(k=>typeof k!=='string' || ['__proto__','prototype','constructor'].includes(k)) ||
      !/^[a-f0-9]{64}$/.test(record.beforeSha256 || '') || !/^[a-f0-9]{64}$/.test(record.afterSha256 || '') ||
      !/^\d{4}-\d{2}-\d{2}$/.test(record.date || '') || typeof record.reason!=='string' || !record.reason.trim()) throw new Error('invalid public-text correction record');
    let a=copy,b=candidate;
    for(const key of record.path.slice(0,-1)){a=a && Object.hasOwn(a,key)?a[key]:undefined;b=b && Object.hasOwn(b,key)?b[key]:undefined;}
    const key=record.path[record.path.length-1];
    // Only this exact reviewed string leaf can differ. No subtree replacement,
    // wildcard, numerical correction, missing-field waiver or scanner exemption.
    if(a && b && Object.hasOwn(a,key) && Object.hasOwn(b,key) && typeof a[key]==='string' && typeof b[key]==='string' &&
      hash(a[key])===record.beforeSha256 && hash(b[key])===record.afterSha256) a[key]=b[key];
  }
  return copy;
}
module.exports={correctedComparison};
