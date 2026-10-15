/* MIT. Shared browser/Node finite research operators. No network or eval. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.AtlasRoutes = api;
})(typeof globalThis === 'object' ? globalThis : this, function () {
  'use strict';
  const VERSION = '1.0.0';
  const fail = message => { throw new Error(message); };
  function graph(input) {
    if (!input || !Number.isInteger(input.order) || input.order < 1 || input.order > 256) fail('order must be an integer from 1 to 256');
    const n = input.order, adj = Array.from({length:n}, () => new Set());
    if (!Array.isArray(input.edges) || input.edges.length > n*(n-1)/2) fail('invalid edges');
    for (const e of input.edges) {
      if (!Array.isArray(e) || e.length !== 2 || e.some(v => !Number.isInteger(v) || v < 0 || v >= n) || e[0] === e[1]) fail('invalid simple edge');
      const [u,v] = e;
      if (adj[u].has(v)) fail('duplicate edge');
      adj[u].add(v); adj[v].add(u);
    }
    return {n, adj};
  }
  function inspect(input) {
    const {n, adj} = graph(input), matching = input.maximal_matching;
    if (!Array.isArray(matching) || matching.length === 0 || matching.length > 20) fail('provide 1–20 matching edges (bounded search)');
    const endpoint = new Map();
    matching.forEach((e,i) => {
      if (!Array.isArray(e) || e.length !== 2 || e.some(v=>!Number.isInteger(v)||v<0||v>=n) || !adj[e[0]]?.has(e[1])) fail('matching contains a non-edge or invalid vertex');
      e.forEach((v,side) => { if(endpoint.has(v)) fail('matching edges overlap'); endpoint.set(v,{i,side}); });
    });
    const unmatched = Array.from({length:n},(_,v)=>v).filter(v=>!endpoint.has(v));
    const maximal = unmatched.every(v => [...adj[v]].every(w=>endpoint.has(w)));
    const degrees = adj.map(a=>a.size), delta = Math.max(...degrees);
    const lower = Math.ceil(input.edges.length / Math.max(1, 2*delta-1));
    const facts = {finiteSimple:true, order:n, degree:degrees.every(d=>d===degrees[0])?degrees[0]:null,
      matchingSize:matching.length, maximalMatching:maximal, matchingLowerBound:lower,
      minimumMatching:maximal && lower===matching.length, unmatched:unmatched.length};
    return {n,adj,matching,endpoint,unmatched,facts};
  }
  function reduce(input) {
    const g = inspect(input);
    if (!g.facts.maximalMatching) fail('transversal reduction requires a maximal matching');
    const clauses = [], safe = [];
    for (const v of g.unmatched) {
      const literals = [...g.adj[v]].map(w => {const e=g.endpoint.get(w); return (e.side ? 1 : -1)*(e.i+1);});
      if (literals.some(l=>literals.includes(-l))) safe.push(v);
      else clauses.push({vertex:v,literals});
    }
    return {variables:g.matching.length, clauses, safeVertices:safe, facts:g.facts};
  }
  // Deliberately graph-only: does not trust SAT clauses, stored degree or invariants.
  function verifyWitness(input, selected, limit) {
    const {n,adj} = graph(input);
    if (!Array.isArray(selected) || !Number.isInteger(limit) || limit < 0 || selected.length > limit || new Set(selected).size!==selected.length || selected.some(v=>!Number.isInteger(v)||v<0||v>=n)) return {valid:false,reason:'invalid vertex set or bound'};
    const covered=new Set(selected);
    for(const v of selected) for(const w of adj[v]) covered.add(w);
    const uncovered=Array.from({length:n},(_,v)=>v).filter(v=>!covered.has(v));
    return {valid:uncovered.length===0, size:selected.length, uncovered,
      independent:selected.every(v=>[...adj[v]].every(w=>!selected.includes(w)))};
  }
  function runTransversal(input, options={}) {
    const reduced=reduce(input), count=2**reduced.variables;
    const budget=options.maxAssignments===undefined ? count : options.maxAssignments;
    if (!Number.isInteger(budget)||budget<1||budget>1048576) fail('maxAssignments must be 1–1048576');
    let first=null, solutions=0, examined=0;
    for(let bits=0;bits<Math.min(count,budget);bits++) {
      examined++;
      if(reduced.clauses.every(c=>c.literals.some(l=> Boolean(bits & (2**(Math.abs(l)-1))) === (l>0)))) {
        solutions++;
        if(first===null) first=input.maximal_matching.map((e,i)=>e[(bits & 2**i)?1:0]);
      }
    }
    const witnessCheck=first===null ? null : verifyWitness(input,first,reduced.variables);
    if(witnessCheck && !witnessCheck.valid) fail('semantic bridge failed: SAT witness does not dominate raw graph');
    const complete=examined===count;
    return {version:VERSION, operator:'matching-transversal', status:first ? 'witness-found' : complete ? 'no-transversal' : 'inconclusive-budget',
      variables:reduced.variables, clauseCount:reduced.clauses.length, safeVertices:reduced.safeVertices,
      examined,totalAssignments:count,complete,solutions, witness:first,witnessCheck,
      scope:'One supplied maximal matching only. No-transversal is NOT a lower bound for ordinary domination. No optimal domination number or novelty is inferred.',
      facts:{...reduced.facts,transversalFound:Boolean(first),witnessVerified:Boolean(first),dominationUpper:first?first.length:null}};
  }
  const OPS = new Set(['eq','lte','gte','lt','gt']);
  function condition(c,facts) {
    if (!c || typeof c.field!=='string' || !OPS.has(c.op)) fail('invalid route condition');
    const a=facts[c.field], b=c.otherField ? facts[c.otherField] : c.value;
    if(a===undefined||a===null||b===undefined||b===null) return false;
    if(c.op==='eq') return a===b;
    if(typeof a!=='number'||typeof b!=='number'||!Number.isFinite(a)||!Number.isFinite(b)) return false;
    return c.op==='lte'?a<=b:c.op==='gte'?a>=b:c.op==='lt'?a<b:a>b;
  }
  function validateLibrary(lib) {
    if(!lib || lib.schemaVersion!=='1.0' || !Array.isArray(lib.rules) || !lib.rules.length) fail('invalid route library');
    const ids=new Set();
    for(const r of lib.rules) {
      if(!r.id||ids.has(r.id)||!r.title||!r.basis||!r.source?.url||!r.source.location||!Array.isArray(r.requires)||!Array.isArray(r.produces)||!Array.isArray(r.methods)||!r.limit) fail('incomplete/duplicate lemma card');
      if(!/^https:\/\//.test(r.source.url)) fail('source must use https');
      for(const c of r.requires) condition(c,{});
      if(r.produces.some(f=>typeof f!=='string')) fail('invalid symbolic output');
      if(r.action && r.action!=='matching-transversal') fail('unknown executable operator');
      ids.add(r.id);
    }
    return true;
  }
  // Conservative Horn-style composition. Derived booleans are route obligations,
  // not newly verified scientific facts; external lemmas retain their provenance.
  function plan(lib, observed, query='') {
    validateLibrary(lib);
    const facts={...observed}, chains=[], used=new Set();
    for(let depth=0;depth<lib.rules.length;depth++) {
      let changed=false;
      for(const r of lib.rules) if(!used.has(r.id)&&r.requires.every(c=>condition(c,facts))) {
        used.add(r.id); changed=true;
        chains.push({id:r.id,requires:r.requires,produces:r.produces,source:r.source,limit:r.limit});
        for(const field of r.produces) if(facts[field]===undefined) facts[field]=true;
      }
      if(!changed) break;
    }
    const tokens=query.toLowerCase().split(/\W+/).filter(Boolean);
    const routes=lib.rules.map(r=>({...r,ready:used.has(r.id),missing:r.requires.filter(c=>!condition(c,facts)),
      score:tokens.reduce((n,t)=>n+(JSON.stringify(r).toLowerCase().includes(t)?1:0),0)}))
      .filter(r=>!tokens.length||r.score>0).sort((a,b)=>b.score-a.score||Number(b.ready)-Number(a.ready)||a.missing.length-b.missing.length||a.id.localeCompare(b.id));
    return {routes,chains,observed,conditionalFacts:facts,ceiling:'Matched conditions generate conditional research routes, not proof or novelty. Only executed witness checks verify finite witnesses.'};
  }
  return {VERSION,graph,inspect,reduce,verifyWitness,runTransversal,condition,validateLibrary,plan};
});
