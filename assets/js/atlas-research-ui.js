/* MIT. Local-only research workbench: no uploaded graphs, no arbitrary execution. */
(function(){
  'use strict';
  const panel=document.getElementById('atlas-research'); if(!panel)return;
  const el=id=>document.getElementById(id), core=window.AtlasRoutes;
  const status=el('research-status'), routes=el('research-routes'), output=el('research-result');
  let library, graph48, worker=null, inspected=null, history=[], generation=0;
  function busy(value){
    el('research-input').readOnly=value;
    el('research-example').disabled=value;
    el('research-inspect').disabled=value;
    el('research-run').disabled=value;
    el('research-cancel').disabled=!value;
  }
  const node=(tag,text)=>{const n=document.createElement(tag);n.textContent=text;return n;};
  const digest=async text=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(text)))).map(b=>b.toString(16).padStart(2,'0')).join('');
  function read(){const text=el('research-input').value;if(text.length>1000000)throw new Error('Graph input exceeds 1 MB');return JSON.parse(text);}
  function condition(c){return `${c.field} ${ {eq:'=',lte:'≤',gte:'≥',lt:'<',gt:'>'}[c.op]} ${c.otherField||JSON.stringify(c.value)}`;}
  function showRoutes(plan){
    routes.replaceChildren();
    for(const r of plan.routes){
      const item=node('li',''); item.append(node('h4',r.title));
      item.append(node('p',r.ready?'Hypotheses matched — conditional route':'Missing: '+r.missing.map(condition).join('; ')));
      item.append(node('p',r.basis),node('p','Limit: '+r.limit));
      const link=node('a',r.source.location);link.href=r.source.url;link.rel='noopener';item.append(link);routes.append(item);
    }
    if(!plan.routes.length)routes.append(node('li','No matching lemma cards in this bounded library. This is not evidence that no route exists.'));
  }
  function inspect(){
    const input=read(), facts=core.inspect(input).facts;
    inspected={input,facts,plan:core.plan(library,facts,el('research-query').value)};
    showRoutes(inspected.plan);
    const enabled=core.plan(library,facts).routes.some(r=>r.action==='matching-transversal'&&r.ready);
    el('research-run').disabled=!enabled;
    status.textContent=`${facts.order} vertices; ${facts.matchingSize} matching edges; ${2**facts.matchingSize} Boolean assignments. ${facts.minimumMatching?'Matching minimum certified by edge counting.':'Matching minimality not established by the counting bound.'}`;
    return inspected;
  }
  function invalidate(){inspected=null;el('research-run').disabled=true;routes.replaceChildren();output.replaceChildren();status.textContent='Input changed. Inspect the new hypotheses before running.';}
  el('research-input').addEventListener('input',invalidate);
  el('research-inspect').addEventListener('click',()=>{try{inspect();}catch(e){invalidate();status.textContent=e.message;}});
  el('research-query').addEventListener('input',()=>{if(inspected)showRoutes(core.plan(library,inspected.facts,el('research-query').value));});
  el('research-example').addEventListener('click',()=>{el('research-input').value=JSON.stringify(graph48,null,2);invalidate();try{inspect();}catch(e){status.textContent=e.message;}});
  el('research-cancel').addEventListener('click',()=>{
    generation++;
    if(worker){worker.terminate();worker=null;history.push({status:'cancelled',at:new Date().toISOString(),scope:'No negative mathematical conclusion.'});}
    busy(false);status.textContent='Cancelled; no impossibility conclusion.';
  });
  el('research-run').addEventListener('click',async()=>{
    try {
      const {input,plan}=inspect(), budget=Number(el('research-budget').value);
      if(!Number.isInteger(budget)||budget<1||budget>1048576)throw new Error('Budget must be an integer from 1 to 1,048,576.');
      busy(true);
      const runGeneration=++generation;
      status.textContent='Running a bounded search locally; your graph is not uploaded.';output.replaceChildren();
      const startedAt=new Date().toISOString(), begin=performance.now(), inputText=JSON.stringify(input);
      const inputSha256=await digest(inputText);
      if(runGeneration!==generation)return;
      worker=new Worker('/assets/js/atlas-research-worker.js?v='+panel.dataset.coreVersion);
      worker.onerror=e=>{status.textContent='Worker failed: '+e.message;worker?.terminate();worker=null;busy(false);};
      worker.onmessage=event=>{
        worker.terminate();worker=null;busy(false);
        if(event.data.error){status.textContent=event.data.error;return;}
        const {run,after}=event.data;
        const record={schemaVersion:'1.0',startedAt,finishedAt:new Date().toISOString(),elapsedMs:performance.now()-begin,inputSha256,hashEncoding:'JSON.stringify parsed input; not original file bytes',coreVersion:core.VERSION,coreAssetVersion:panel.dataset.coreVersion,input,result:{before:plan,run,after},ceiling:'Internal finite witness / restricted-route test, not novelty or general acceleration.'};
        history.push(record);
        status.textContent=run.status==='witness-found'?'Checked witness found':run.status==='no-transversal'?'No transversal of this matching':'Budget exhausted — inconclusive';
        output.append(node('p',`${run.examined.toLocaleString()} of ${run.totalAssignments.toLocaleString()} assignments checked; ${run.solutions.toLocaleString()} satisfying assignments${run.complete?' (complete enumeration)':' so far'}.`));
        if(run.witness){
          output.append(node('h4',`Ordinary domination ≤ ${run.witness.length}`),node('p','Verified vertices: '+run.witness.join(', ')));
          output.append(node('p',run.witnessCheck.independent?'This witness is also independent.':'This witness is not independent; it must not be used as an independent-domination upper bound.'));
        }
        output.append(node('p',run.scope));
        const completed=after.chains.filter(c=>!plan.chains.some(p=>p.id===c.id));
        if(completed.length)output.append(node('p','Newly enabled steps: '+completed.map(c=>c.id).join(' → ')));
        showRoutes(core.plan(library,run.facts,el('research-query').value));
        el('research-download').disabled=false;
      };
      worker.postMessage({input,budget,library});
    }catch(e){status.textContent=e.message;busy(false);}
  });
  el('research-download').addEventListener('click',()=>{
    const url=URL.createObjectURL(new Blob([JSON.stringify({schemaVersion:'1.0',attempts:history},null,2)],{type:'application/json'}));
    const a=document.createElement('a');a.href=url;a.download='atlas-research-attempts.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  });
  Promise.all(['/api/atlas-research-routes.json','/assets/atlas-research/graph48.json'].map(async url=>{const r=await fetch(url);if(!r.ok)throw new Error('Cannot load '+url);return r.json();})).then(([lib,g])=>{
    library=lib;graph48=g;core.validateLibrary(lib);el('research-example').disabled=false;el('research-inspect').disabled=false;
    el('research-input').value=JSON.stringify(g,null,2);inspect();
  }).catch(e=>{status.textContent='Workbench unavailable: '+e.message;});
})();
