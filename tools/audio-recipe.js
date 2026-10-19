'use strict';
const DISCLOSURE='This briefing uses an AI-generated voice and is not additional scientific evidence.';
function plannedText(text) {
  if(typeof text!=='string' || !text.trim()) throw new Error('Narration is empty');
  return /AI.generated voice|synthetic voice/i.test(text) && /not additional (scientific )?evidence/i.test(text) ? text.trim() : text.trim()+' '+DISCLOSURE;
}
function segments(text,max=2500) {
  const result=[];let rest=text.trim();
  while(rest.length>max){let n=rest.lastIndexOf(' ',max);if(n<1)throw new Error('Unbreakable narration token');result.push(rest.slice(0,n));rest=rest.slice(n).trimStart();}
  if(rest)result.push(rest);
  if(result.join(' ')!==text.trim())throw new Error('Narration segmentation lost text');
  return result;
}
function verifySegments(text,records,max=2500) {
  const crypto=require('node:crypto');
  const expected=segments(text,max);
  if(!Array.isArray(records) || records.length!==expected.length) throw new Error('Narration segment count differs');
  for(const [i,part] of records.entries()) {
    if(part.input!==expected[i] || part.inputSha256!==crypto.createHash('sha256').update(expected[i]).digest('hex') ||
       !/^[a-f0-9]{64}$/.test(part.audioSha256 || '') || !String(part.contentType).toLowerCase().includes('audio'))
      throw new Error('Narration segment provenance differs at '+i);
  }
}
module.exports={DISCLOSURE,plannedText,segments,verifySegments};
