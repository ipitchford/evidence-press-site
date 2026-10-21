'use strict';
const DISCLOSURE='This briefing uses an AI-generated voice and is not additional scientific evidence.';
// v1 cut at the last space before the limit, often mid-sentence; the provider was observed
// (20 Oct 2026) to drop the final words of such segments. New receipts use v2, which ends
// segments only at sentence boundaries. v1 is retained solely to verify existing receipts.
const LEGACY_RECIPE='bounded-disclosed-v1';
const RECIPE='sentence-bounded-disclosed-v2';
function plannedText(text) {
  if(typeof text!=='string' || !text.trim()) throw new Error('Narration is empty');
  // Recognise house disclosures already in approved narration so none is spoken twice.
  return /AI.generated voice|synthetic.voice/i.test(text) && /not (additional )?(scientific |mathematical |research )?evidence/i.test(text) ? text.trim() : text.trim()+' '+DISCLOSURE;
}
function legacySegments(text,max=2500) {
  const result=[];let rest=text.trim();
  while(rest.length>max){let n=rest.lastIndexOf(' ',max);if(n<1)throw new Error('Unbreakable narration token');result.push(rest.slice(0,n));rest=rest.slice(n).trimStart();}
  if(rest)result.push(rest);
  if(result.join(' ')!==text.trim())throw new Error('Narration segmentation lost text');
  return result;
}
// A sentence ends at . ! or ? (optionally closed by a quote or bracket) followed by a word
// that starts with a capital or digit, so "e.g. the" and "3.5" never split.
const SENTENCE=/(?<=[.!?]["'”’)\]]*)\s+(?=["'“‘(\[]?[A-Z0-9])/;
const CLAUSE=/(?<=[,;:—])\s+/;
function pack(pieces,max) {
  const result=[];let current='';
  for(const piece of pieces) {
    if(!current) current=piece;
    else if(current.length+1+piece.length<=max) current+=' '+piece;
    else { result.push(current); current=piece; }
  }
  if(current) result.push(current);
  return result;
}
function segments(text,max=2500) {
  const normalised=text.trim().replace(/\s+/g,' ');
  const pieces=normalised.split(SENTENCE).flatMap(sentence => {
    if(sentence.length<=max) return [sentence];
    // Only a single over-long sentence falls back to clause boundaries.
    const clauses=pack(sentence.split(CLAUSE),max);
    if(clauses.some(c=>c.length>max)) throw new Error(`Narration clause exceeds ${max} characters; shorten the sentence`);
    return clauses;
  });
  const result=pack(pieces,max);
  if(result.join(' ')!==normalised)throw new Error('Narration segmentation lost text');
  return result;
}
function verifySegments(text,records,max=2500,recipe=LEGACY_RECIPE) {
  const crypto=require('node:crypto');
  const expected=(recipe===LEGACY_RECIPE ? legacySegments : segments)(text,max);
  if(!Array.isArray(records) || records.length!==expected.length) throw new Error('Narration segment count differs');
  for(const [i,part] of records.entries()) {
    if(part.input!==expected[i] || part.inputSha256!==crypto.createHash('sha256').update(expected[i]).digest('hex') ||
       !/^[a-f0-9]{64}$/.test(part.audioSha256 || '') || !String(part.contentType).toLowerCase().includes('audio'))
      throw new Error('Narration segment provenance differs at '+i);
    if(recipe!==LEGACY_RECIPE && !(part.endingCheck && part.endingCheck.status==='passed'))
      throw new Error('Narration segment '+i+' lacks a passed spoken-ending check');
  }
}
// Spoken-ending guard: the last words of the input must be heard, in order, at the end of an
// ASR transcript of that audio. Numbers are dropped from both sides because ASR writes them as
// digits or words unpredictably ("twenty twenty six" / "2026"); one or two misheard words are
// tolerated, a dropped ending is not.
const NUMBERISH=/^(\d+(st|nd|rd|th)?|zero|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety|hundred|thousand|million|first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth|eleventh|twelfth|twentieth|thirtieth)$/;
const spokenWords=text=>(String(text).toLowerCase().match(/[a-z0-9]+/g) || []).filter(w => !NUMBERISH.test(w));
function endingCheck(input,heard,{words=8,required=6,window=16}={}) {
  const expected=spokenWords(input).slice(-words);
  const tail=spokenWords(heard).slice(-window);
  let found=0,h=tail.length-1;
  for(let e=expected.length-1;e>=0 && h>=0;e--) {
    let k=h;while(k>=0 && tail[k]!==expected[e]) k--;
    if(k>=0){found++;h=k-1;}
  }
  const requiredWords=Math.min(required,expected.length);
  return {status:found>=requiredWords?'passed':'failed',expectedEnding:expected.join(' '),heardEnding:tail.join(' '),matchedWords:found,requiredWords};
}
module.exports={DISCLOSURE,LEGACY_RECIPE,RECIPE,plannedText,legacySegments,segments,verifySegments,endingCheck,spokenWords};
