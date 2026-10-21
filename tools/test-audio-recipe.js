'use strict';
const assert=require('node:assert/strict');
const crypto=require('node:crypto');
const {plannedText,segments,legacySegments,DISCLOSURE,LEGACY_RECIPE,RECIPE,verifySegments,endingCheck}=require('./audio-recipe');
const hash=input=>crypto.createHash('sha256').update(input).digest('hex');
assert.throws(()=>plannedText(' '));
const text=plannedText('A mathematical result.');
assert(text.endsWith(DISCLOSURE));
assert.equal(plannedText(text),text,'disclosure must not accumulate');
for(const own of ['The audio uses an AI-generated voice and is not additional mathematical evidence.','This synthetic-voice briefing is a communication aid, not mathematical evidence.','This audio briefing is AI-generated. It uses a synthetic voice and is not additional research evidence.'])
  assert.equal(plannedText('A result. '+own),'A result. '+own,'an approved house disclosure is not duplicated');

// Legacy v1 receipts are still verified with the word-boundary splitter that produced them.
const long=plannedText(Array.from({length:900},(_,i)=>'word'+i).join(' '));
const parts=legacySegments(long);
assert(parts.length>1 && parts.every(p=>p.length<=2500));
assert.equal(parts.join(' '),long,'bounded segments must retain every word and disclosure');
assert.throws(()=>legacySegments('x'.repeat(2600)));
const records=parts.map(input=>({input,inputSha256:hash(input),audioSha256:'a'.repeat(64),contentType:'audio/mpeg'}));
verifySegments(long,records);
verifySegments(long,records,2500,LEGACY_RECIPE);
assert.throws(()=>verifySegments(long,records.slice(1)));
assert.throws(()=>verifySegments(long,[...records].reverse()));
assert.throws(()=>verifySegments(long,records.map((r,i)=>i? r : {...r,inputSha256:'0'.repeat(64)})));

// v2 ends every segment at a sentence boundary (the v1 cut fell mid-sentence and the
// provider dropped the words before it).
const sentences=Array.from({length:40},(_,i)=>`Sentence ${i} has e.g. a value of 3.5 and says "quoted words" here (with a bracket).`);
const narration=plannedText(sentences.join(' '));
const v2=segments(narration,800);
assert(v2.length>1 && v2.every(p=>p.length<=800));
assert.equal(v2.join(' '),narration,'sentence segments must retain every word and disclosure');
assert(v2.every(p=>/[.!?]["')\]]*$/.test(p)),'every segment must end at a sentence boundary');
assert(v2.slice(1).every(p=>/^Sentence \d+ /.test(p) || p===DISCLOSURE),'every segment must start a sentence');
assert(legacySegments(narration,800).some(p=>!/[.!?]["')\]]*$/.test(p)),'fixture must exercise the v1 mid-sentence defect');
assert.deepEqual(segments('One. Two? Three! "Four." (Five.)',12),['One. Two?','Three!','"Four."','(Five.)']);
assert(!segments('Values like e.g. this and 3.5 stay. Next one.',40).some(p=>/e\.g\.$|3\.$/.test(p)),'abbreviations and decimals are not sentence ends');
// Only a sentence longer than the limit falls back to clause boundaries.
const longSentence='First clause runs on for a while, second clause adds more words; third clause: finishes here.';
assert.deepEqual(segments(longSentence+' Short.',40),['First clause runs on for a while,','second clause adds more words;','third clause: finishes here. Short.']);
assert.throws(()=>segments('A '+'very '.repeat(200)+'long clause.',800),/clause exceeds/);
assert.deepEqual(segments('Line one.\n\nLine  two.',800),['Line one. Line two.'],'whitespace is normalised for the provider');

// v2 receipts require a passed spoken-ending check for every segment.
const v2records=v2.map(input=>({input,inputSha256:hash(input),audioSha256:'b'.repeat(64),contentType:'audio/mpeg',endingCheck:endingCheck(input,input)}));
verifySegments(narration,v2records,800,RECIPE);
assert.throws(()=>verifySegments(narration,v2records.map((r,i)=>i?r:{...r,endingCheck:undefined}),800,RECIPE),/spoken-ending/);
assert.throws(()=>verifySegments(narration,v2records,800,LEGACY_RECIPE));

// Spoken-ending guard: tolerant of ASR noise and number words, fails when the ending is dropped.
const input='At the critical power, the answer is decided by a sharp comparison between the production coefficient and the logarithmic loss.';
assert.equal(endingCheck(input,'At the critical power the answer is decided by a sharp comparison between the production coefficient and the logarithmic loss.').status,'passed');
assert.equal(endingCheck(input,'...between the production co-efficient and the logarithmic lost.').status,'passed');
assert.equal(endingCheck('It has 3 cycles.','It has three cycles.').status,'passed');
assert.equal(endingCheck('The release of sixth September twenty twenty-six, an unrefereed candidate.','the release of six September 2026, an unrefereed candidate').status,'passed','ASR number spelling is not a dropped ending');
assert.equal(endingCheck(input,'At the critical power, the answer is decided by a sharp comparison between the').status,'failed');
assert.equal(endingCheck('Exact replay checks reject corrupted inputs. Those checks support','Exact replay checks reject corrupted inputs.').status,'failed');
console.log('PASS audio recipe: disclosure planned once, sentence-bounded exact input, spoken-ending guard, no provider calls');
