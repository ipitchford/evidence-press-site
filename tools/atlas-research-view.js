'use strict';
module.exports=function researchView(version){return `
<section id="atlas-research" class="atlas-research" data-core-version="${version}" aria-labelledby="research-title">
  <p class="atlas-kicker">From a question to a checked object</p>
  <h2 id="research-title">Research route workbench</h2>
  <p>Find applicable lemmas, expose missing hypotheses, and execute a bounded route. The first operator translates a graph-matching problem into SAT and checks its answer directly against the graph. This is a working pilot, not a general theorem prover.</p>
  <div class="research-columns">
    <div>
      <h3>1. Set the target</h3>
      <p>Can one endpoint from each supplied matching edge form a dominating set? A successful answer gives an ordinary-domination upper bound. Failure does not rule out other dominating sets.</p>
      <button id="research-example" type="button" disabled>Load the 48-vertex research target</button>
      <details><summary>Use your own graph (local JSON)</summary>
        <label for="research-input">Graph: order, edges, maximal_matching (zero-based vertices)</label>
        <textarea id="research-input" rows="10" spellcheck="false"></textarea>
        <p>Finite simple undirected graphs, 1–256 vertices, 1–20 matching edges. Stored claims such as degree or optimum are ignored: properties are recomputed. Nothing is uploaded or saved automatically.</p>
      </details>
      <button id="research-inspect" type="button" disabled>Inspect hypotheses and compose routes</button>
      <h3>2. Run the cheapest decisive test</h3>
      <label for="research-budget">Maximum assignments (at most 1,048,576)</label>
      <input id="research-budget" type="number" min="1" max="1048576" value="1048576">
      <div class="research-actions"><button id="research-run" type="button" disabled>Find and verify witness</button><button id="research-cancel" type="button" disabled>Cancel</button></div>
      <p id="research-status" role="status" aria-live="polite">Loading the bounded route library…</p>
      <div id="research-result" aria-live="polite"></div>
      <button id="research-download" type="button" disabled>Download this session’s attempts</button>
      <p>Keep the input-bound record to continue elsewhere. Cancelled, budget-limited and negative runs are not proofs of the full target’s impossibility.</p>
    </div>
    <div>
      <h3>3. Inspect the route and its limits</h3>
      <label for="research-query">Find a lemma or obstruction in the curated library</label>
      <input id="research-query" type="search" placeholder="Try SAT, upper bound, minimum, independence">
      <ul id="research-routes" class="research-routes"></ul>
    </div>
  </div>
  <details><summary>Why this is a research test, and what it does not establish</summary>
    <p>The pilot asks whether the published independent-domination counterexample also violates the ordinary-domination inequality. Prior-art checking found an existing general theorem; the useful residual task is to construct a concrete witness and avoid an invalid transfer. The operator performs real computation, not similarity scoring.</p>
    <p>A source-backed route may still have unverified external premises. Matched hypotheses do not promote a theorem or a relationship into the accepted Atlas graph. The curated library is not an exhaustive literature search. Only one operator is implemented: scale recursion, arbitrary-paper lemma extraction and autonomous cross-field research are not claimed.</p>
    <p><a href="/assets/atlas-research/intake.json">Prospective pilot and success criteria</a> · <a href="/assets/atlas-research/pilot-result.json">Actual pilot result and witness</a> · <a href="/api/atlas-research-routes.json">Lemma library and capability limits</a> · <a href="https://github.com/ipitchford/evidence-press-site/blob/main/docs/ATLAS_RESEARCH_WORKBENCH.md">Reproduce and extend the tool</a></p>
  </details>
  <noscript><p>JavaScript is needed to run the local solver. The <a href="/api/atlas-research-routes.json">source-linked lemma library</a> and <a href="/assets/atlas-research/intake.json">pilot intake</a> remain readable. The command-line replay is documented in the repository.</p></noscript>
</section>`;};
