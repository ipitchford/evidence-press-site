'use strict';
importScripts('atlas-route-core.js' + self.location.search);
self.onmessage = event => {
  try {
    const {input,budget,library}=event.data;
    const before=AtlasRoutes.plan(library,AtlasRoutes.inspect(input).facts);
    if(!before.routes.some(r=>r.action==='matching-transversal'&&r.ready)) throw new Error('No applicable executable route in this library.');
    const run=AtlasRoutes.runTransversal(input,{maxAssignments:budget});
    self.postMessage({run,after:AtlasRoutes.plan(library,run.facts)});
  } catch(error) { self.postMessage({error:error.message}); }
};
