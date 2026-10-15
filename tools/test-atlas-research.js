#!/usr/bin/env node
'use strict';
const assert=require('assert/strict'),fs=require('fs'),path=require('path');
const core=require('../assets/js/atlas-route-core'), {evaluate,library}=require('./atlas-research');
const g=require('../data/atlas-research/graph48.json');
const clone=x=>JSON.parse(JSON.stringify(x));
let tests=0; function test(name,fn){fn();tests++;console.log('ok '+name);}
test('canonical input hash binds public tagged bytes',()=>assert.equal(require('crypto').createHash('sha256').update(fs.readFileSync(path.join(__dirname,'../data/atlas-research/graph48.json'))).digest('hex'),'a231f7aaa6c437dc977eaa6603f3dae40a81fad4065cad6cac22a45174ff65ac'));
test('real graph yields checked 15-vertex witness and resolves the finite target',()=>{
  const r=evaluate(g);assert.equal(r.run.status,'witness-found');assert.equal(r.run.witness.length,15);assert.equal(r.run.witnessCheck.valid,true);assert.equal(r.run.witnessCheck.independent,false);
  assert.equal(r.run.solutions,317);assert.equal(r.run.examined,32768);assert.equal(r.after.conditionalFacts.ordinaryCounterexampleRuledOut,true);
});
test('bridge removal ablation disables executable route',()=>{
  const lib=clone(library);lib.rules=lib.rules.filter(r=>r.id!=='graph-to-sat');assert.equal(evaluate(g,{library:lib}).run.status,'route-unavailable');
});
test('no ordinary lower bound is inferred from independent lower bound',()=>{
  const p=core.plan(library,{independentLower:16,independentDomination:16});assert.equal(p.chains.length,0);assert.equal(p.conditionalFacts.ordinaryLower,undefined);
});
test('insufficient budget is not unsatisfiable',()=>{const r=core.runTransversal(g,{maxAssignments:1});assert.equal(r.status,'inconclusive-budget');assert.equal(r.complete,false);});
test('invalid graph, non-edge, overlapping and nonmaximal matching rejected',()=>{
  const duplicate=clone(g);duplicate.edges.push(g.edges[0]);assert.throws(()=>core.inspect(duplicate),/duplicate/);
  const loop=clone(g);loop.edges[0]=[0,0];assert.throws(()=>core.inspect(loop),/edge/);
  const bad=clone(g);bad.maximal_matching[0]=[0,47];assert.throws(()=>core.inspect(bad),/non-edge/);
  const overlap=clone(g);overlap.maximal_matching[1]=[0,31];assert.throws(()=>core.inspect(overlap),/overlap/);
  const nonmax=clone(g);nonmax.maximal_matching.pop();assert.throws(()=>core.runTransversal(nonmax),/maximal/);
});
test('claimed invariants are ignored and changed graph is freshly checked',()=>{
  const falseClaims=clone(g);falseClaims.degree=17;falseClaims.claimed_invariants={domination:1};assert.equal(core.inspect(falseClaims).facts.degree,3);
  assert.equal(core.verifyWitness(g,[0],15).valid,false);assert.equal(core.verifyWitness(g,[0,0],15).valid,false);assert.equal(core.verifyWitness(g,[999],15).valid,false);
  const changed=clone(g);changed.order=49;assert.equal(core.verifyWitness(changed,core.runTransversal(g).witness,15).valid,false);
});
test('safe unmatched vertex adjacent to both endpoints is a tautology',()=>{const tri={order:3,edges:[[0,1],[0,2],[1,2]],maximal_matching:[[0,1]]};assert.equal(core.reduce(tri).clauses.length,0);assert.equal(core.runTransversal(tri).solutions,2);});
// All four clauses on two variables prohibit every transversal. A third
// matching edge touches the old endpoints only. A nontransversal of size 3
// still dominates, so promoting restricted UNSAT to gamma>3 would be false.
const trap={order:10,edges:[[0,1],[2,3],[8,9],[0,4],[2,4],[0,5],[3,5],[1,6],[2,6],[1,7],[3,7],...Array.from({length:4},(_,v)=>[[v,8],[v,9]]).flat()],maximal_matching:[[0,1],[2,3],[8,9]]};
test('no-transversal does not exclude an ordinary dominating set',()=>{const r=evaluate(trap);assert.equal(r.run.status,'no-transversal');assert.equal(core.verifyWitness(trap,[0,2,7],3).valid,true);assert.equal(r.after.conditionalFacts.ordinaryCounterexampleRuledOut,undefined);});
test('exhaustive semantic bridge comparison on all simple graphs through five vertices',()=>{
  let pairs=0;
  for(let n=2;n<=5;n++){
    const potential=[];for(let u=0;u<n;u++)for(let v=u+1;v<n;v++)potential.push([u,v]);
    for(let bits=0;bits<2**potential.length;bits++){
      const edges=potential.filter((_,i)=>bits&2**i);
      function matchings(start,selected,used){
        if(selected.length){
          const input={order:n,edges,maximal_matching:selected};
          if(core.inspect(input).facts.maximalMatching){
            const r=core.runTransversal(input);let direct=0;
            for(let b=0;b<2**selected.length;b++)if(core.verifyWitness(input,selected.map((e,i)=>e[(b&2**i)?1:0]),selected.length).valid)direct++;
            assert.equal(r.solutions,direct);pairs++;
          }
        }
        for(let i=start;i<edges.length;i++){const e=edges[i];if(e.some(v=>used.has(v)))continue;matchings(i+1,[...selected,e],new Set([...used,...e]));}
      }
      matchings(0,[],new Set());
    }
  }
  console.log('  graph/matching pairs checked: '+pairs);assert.ok(pairs>1000);
});
test('typed numeric comparisons do not coerce strings; malformed library fails',()=>{assert.equal(core.condition({field:'n',op:'lte',value:48},{n:'40'}),false);const bad=clone(library);bad.rules[0].requires[0].op='eval';assert.throws(()=>core.validateLibrary(bad));});
console.log(`ALL ${tests} ATLAS RESEARCH TESTS PASSED`);
module.exports={trap};
