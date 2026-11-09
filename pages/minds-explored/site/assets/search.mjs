const stop = new Set('a an and are as at be by can do does for from how i in into is it of on or that the their to us we what when where which why with would'.split(' '));
const queryNoise=new Set('work works happen happens tell course lecture video during evidence measuring understanding understand difference people make introduction introductory beginner basics'.split(' '));
const canonicalWords={neurons:'neuron',synapses:'synapse',theories:'theory',models:'model',decisions:'decision',biased:'bias',biases:'bias',psychological:'psychology',trials:'trial',children:'child',aging:'ageing',cognitive:'cognition',cultural:'culture',cultures:'culture',gene:'genetic',genes:'genetic',genetics:'genetic',environmental:'environment',behavior:'behaviour',behavioral:'behaviour',behavioural:'behaviour',modeling:'modelling'};
export const synonymGroups = [
  ['brain','neuroscience','neural'], ['fmri','imaging','neuroimaging'], ['ageing','aging'],
  ['behaviour','behavior'], ['modelling','modeling'], ['ai','artificial intelligence'],
  ['memory','remember','remembering'], ['children','child','childhood'], ['beginner','introduction','introductory'],
  ['decision','decisions','judgement','judgment'], ['statistics','statistical'], ['psychopathology','mental health'],
  ['genes','genetic','heredity'], ['consciousness','awareness'], ['vision','visual'], ['causal','causality']
];
export function tokens(text) { return String(text ?? '').normalize('NFKD').toLowerCase().replace(/\p{M}/gu,'').match(/[\p{L}\p{N}]+/gu)?.filter(t => !stop.has(t)).map(t=>canonicalWords[t]??t) ?? []; }
const lexicons=new WeakMap();
function lexicon(records){
  if(lexicons.has(records))return lexicons.get(records);
  const documents=new Map(),df=new Map();
  for(const r of records){const fields={};const all=new Set();for(const name of ['title','description','terms','topicTerms','speaker','provider','searchText']){fields[name]=new Set(tokens(Array.isArray(r[name])?r[name].join(' '):r[name]));if(name!=='topicTerms')for(const word of fields[name])all.add(word);}documents.set(r.id,fields);for(const word of all)df.set(word,(df.get(word)??0)+1);}
  const value={documents,idf:term=>Math.min(4,Math.max(.3,Math.log(1+(records.length-(df.get(term)??0)+.5)/((df.get(term)??0)+.5))))};lexicons.set(records,value);return value;
}
export function queryTerms(query, expand = true) {
  const raw=tokens(query),specific=raw.filter(t=>!queryNoise.has(t));
  const base = new Set(specific.length?specific:raw); const terms = new Set(base);
  if (expand) for (const group of synonymGroups) if (group.some(s => tokens(s).every(t => base.has(t)))) for (const s of group) tokens(s).forEach(t => terms.add(t));
  return { base, expanded: terms };
}
export function matchesFilters(r, f = {}) {
  if (f.topic && !r.topics?.includes(f.topic)) return false;
  for (const [key, field] of [['level','level'],['language','language'],['provider','providerId'],['format','format'],['basis','selectionBasis'],['type','kind']])
    if (f[key] && (r[field] ?? 'unknown') !== f[key]) return false;
  if (f.access === 'checked' && !r.qualified) return false;
  if (f.access === 'unknown' && r.availability !== 'unknown') return false;
  const d = r.durationSeconds;
  if (f.duration === 'unknown' && d !== null && d !== undefined) return false;
  if (f.duration === 'long' && !(d >= 3600)) return false;
  if (f.duration === 'medium' && !(d >= 1200 && d < 3600)) return false;
  if (f.duration === 'short' && !(d > 0 && d < 1200)) return false;
  return true;
}
export function search(records, query = '', options = {}) {
  const {base, expanded} = queryTerms(query, options.synonyms === true);
  const weights = { title: 7, description: 2, terms: 2, topicTerms:.25, speaker: 5, provider: 2, searchText: 1.5, ...options.weights };
  const corpus=lexicon(records),beginner=/\b(beginner|introduction|introductory|basics)\b|how .+ works?\b|what happens/i.test(query),courseIntent=/\bcourse\b/i.test(query);
  const conceptAliases=new Map([...base].map(term=>[term,queryTerms(term,options.synonyms===true).expanded]));
  const queryMass=[...base].reduce((sum,term)=>sum+corpus.idf(term),0);
  const hidden = new Set(options.hidden ?? []); const likes = new Set(options.likes ?? []);
  const scored = [];
  for (const r of records) {
    if (hidden.has(r.id) || !matchesFilters(r, options.filters)) continue;
    let score = 0; const matched = new Set(),direct=new Set(),contentWords=new Set(),primaryWords=new Set();
    for (const [field, weight] of Object.entries(weights)) {
      const words = corpus.documents.get(r.id)?.[field]??new Set();
      if(field!=='topicTerms')for(const word of words)contentWords.add(word);
      if(field!=='topicTerms'&&field!=='searchText')for(const word of words)primaryWords.add(word);
      for (const term of expanded) if (words.has(term)) { score += weight * corpus.idf(term) * (base.has(term) ? 1 : .3); matched.add(term); if(base.has(term))direct.add(term); }
    }
    if (base.size && !matched.size) continue;
    if(base.size){const covered=[...base].filter(term=>[...conceptAliases.get(term)].some(alias=>contentWords.has(alias)));const mass=covered.reduce((sum,term)=>sum+corpus.idf(term)*([...conceptAliases.get(term)].some(alias=>primaryWords.has(alias))?1:.4),0);score*=.03+.97*(mass/queryMass)**2;direct.clear();covered.forEach(term=>direct.add(term));}
    if (query && String(r.title).toLowerCase().includes(query.toLowerCase())) score += 5;
    if(score>0&&r.coreChecked)score+=2;
    if(score>0&&beginner){if(r.level==='foundation'||r.kind==='guide')score+=5;if(r.level==='advanced')score-=4;}
    if(score>0&&courseIntent&&r.kind==='course')score+=8;
    const reason = base.size ? (direct.size?`Matches ${[...direct].slice(0,4).map(t=>'“'+t+'”').join(', ')}`:'Matches broader topic terms') : r.coreChecked ? 'Source-checked selection' : r.selectionBasis === 'institutional-collection' ? 'Part of an institutional collection' : 'Listed with source provenance';
    score += Math.min(1, Math.log2(1 + (r.independentPositiveMentions ?? 0)) * (options.communityWeight ?? 0));
    if (likes.has(r.id)) score += .25;
    scored.push({...r, score, matchReason: reason});
  }
  const sort = options.sort ?? 'relevance';
  scored.sort((a,b) => {
    if (sort === 'added') return String(b.addedAt ?? '').localeCompare(String(a.addedAt ?? '')) || a.title.localeCompare(b.title);
    if (sort === 'recorded') return String(b.recordingDate ?? '').localeCompare(String(a.recordingDate ?? '')) || a.title.localeCompare(b.title);
    if (sort === 'community') return (b.independentPositiveMentions ?? 0) - (a.independentPositiveMentions ?? 0) || b.score - a.score || a.title.localeCompare(b.title);
    return b.score - a.score || a.title.localeCompare(b.title);
  });
  if (options.diversify !== true || sort !== 'relevance') return scored;
  const result = [], pool = [...scored];
  while (pool.length) {
    const recent = result.slice(-4);
    let best = 0, value = -Infinity;
    for (let i = 0; i < Math.min(pool.length, 30); i++) {
      const r = pool[i];
      const providerPenalty = recent.filter(x => r.providerId && x.providerId === r.providerId).length * 2;
      const coursePenalty = recent.filter(x => r.courseId && x.courseId === r.courseId).length * 4;
      const v = r.score - providerPenalty - coursePenalty;
      if (v > value) { best = i; value = v; }
    }
    result.push(pool.splice(best,1)[0]);
  }
  return result;
}
