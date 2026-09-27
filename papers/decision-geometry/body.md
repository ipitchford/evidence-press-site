## Summary

Evolutionary data can fit more than one history. Collecting more observations does not always resolve the ambiguity, because different histories can produce the same distribution. A useful alternative is to ask exactly which histories remain compatible—and which conclusions can be certified before the entire answer is known.

This anonymous, unrefereed paper studies a small but nontrivial model: three sampled leaves connected through a triangle network, with one hybridisation event. It gives explicit formulas for the information needed to distinguish the complete compatible set from a different answer. A sequential procedure uses those formulas to decide when enough observations have arrived, while controlling error across repeated inspections.

The result also identifies a sharp limitation. At some boundary distributions, a particular orientation can be certified even though the complete set cannot reliably be certified in finite time. The guarantees assume the stated evolutionary model; they do not test whether that model describes real biological data.

## Summary for specialists

Let $\mathcal P$ be the open union of the three observable Jukes–Cantor triangle-network model images, and let $S(p)\subseteq\{1,2,3\}$ contain every compatible orientation. Let $\mathrm{Alt}(p)$ contain those distributions in $\mathcal P$ with a different complete compatible set. Define

$$I_{\mathcal P}(p)=\inf_{\pi\in\mathrm{Alt}(p)}\operatorname{KL}(p\Vert\pi).$$

Theorem 3.3 and Corollary 3.4 give an explicit formula at every off-boundary $p\in\mathcal P$. In overlap regions, the nearest score-boundary projection remains in the model. For a singleton $S(p)=\{i\}$, a rational root test selects either an ordinary boundary projection or a product-form tree limit on the model closure. Equality in the root test is handled explicitly.

For each fixed off-boundary distribution, Theorem 5.2 claims

$$\lim_{\delta\downarrow0}\frac{\mathbb E_p\tau_\delta}{\log(1/\delta)}=\frac{1}{I_{\mathcal P}(p)}.$$

This is pointwise high-confidence optimality for the **complete compatible set**, not uniform finite-sample optimality and not an optimality claim for every partial question. Theorem 6.2 classifies finite-output questions at model boundaries through constancy on the local label family. Lemma 8.1 shows that the implemented rational precision schedule preserves the leading complete-set stopping constant on compact off-boundary subsets.

## Technical account

The five observations are equality patterns among the three leaves: all equal, each of the three possible equal pairs, and all distinct. An affine Fourier transformation gives coordinates $q=(x,y,z,w)$. Within the specified model union, compatibility is determined by three polynomial signs, including

$$h_1=w+x(w-y-z),$$

with the other scores obtained by permutation. The external premise is Currie and colleagues' version-pinned semialgebraic model characterisation. Outside that model union, polynomial signs need not represent biologically admissible orientations.

The information calculation is more subtle than measuring distance to the nearest sign change. An unconstrained projection can leave the model. The paper reduces the singleton case to a convex problem in conditional coordinates, solves its active constraints and proves that the resulting tree limit can be approached from the required competing model. Both the optimisation and this approachability argument are needed.

A Dirichlet-half mixture provides one simultaneous confidence event, with threshold

$$\begin{gathered}\beta_n(\delta)=\log K_n-\log\delta,\\K_n=\frac{(2n+1)(2n+3)}{3}.\end{gathered}$$

Repeated inspections and adaptively chosen questions use that same event. The production code evaluates outward rational enclosures; an inconclusive enclosure does not accept. Asymptotically dense inspection schedules retain the leading constant, whereas the fixed geometric schedule used in the experiments is not itself a verification of that exact limit.

### A useful answer without a complete answer

![Four nearby compatibility sets, all containing orientation 3: {3}, {1,3}, {2,3}, and {1,2,3}. The exact example and model qualification are shown.](/assets/art/decision-geometry-boundary.svg)

At $q_D=(2/5,2/5,3/10,1/5)$, the scores are $(0,0,1/50)$. The local compatibility sets are

$$\begin{gathered}\{3\},\quad\{1,3\},\\\{2,3\},\quad\{1,2,3\}.\end{gathered}$$

All contain orientation 3, so that membership question is locally constant and admits reliable finite-time certification. The complete set varies, as does the answer to “are at least two orientations compatible?”. For a uniformly $\delta$-valid procedure answering a nonconstant question, the theorem bounds the probability of ever terminating at this boundary by $2\delta$. This is a limitation of the statistical task, not a failure of an optimiser.

### An exact cost of ignoring the model

The paper's singleton example has

$$\begin{gathered}(p_0,p_1,p_2)=\left(\frac{281}{800},\frac{63}{800},\frac{21}{800}\right),\\(p_3,p_4)=\left(\frac{81}{160},\frac{3}{80}\right),\\S(p_C)=\{2\}.\end{gathered}$$

Its model-restricted information is approximately $0.005897963866665$, compared with $0.005001085242437$ for the simpler sign-only rule. The information rises by about 17.93%; the reciprocal leading expected-sample constant falls by about **15.21%**. These are different percentages. Neither is a universal finite-sample saving, and neither comes from biological field data.

## Evidence, assurance and limitations

The package contains written analytic proofs, exact and symbolic checks, rational acceptance receipts, numerical projection diagnostics, synthetic experiments and the received review history. The original 11-job producer replay passed its completion checks, but this did not establish exact regeneration of the archived experiment: its simulation job permitted changed output, and the subsequent receipt check validated the newly generated receipts. A separate check on 27 September replayed all 174 archived acceptance receipts successfully.

**Seed-reproducibility note — 27 September 2026.** A fresh macOS/Python 3.13 audit using the package's pinned NumPy 2.3.5 regenerated the published simulation. At the double-boundary point shown above, only 9 of 20 runs matched the archived counts at their saved acceptance checkpoints; 17 of 20 matched the recorded stopping outcomes. The membership stopping median changed from 28,380 to 29,194 observations. All 20 regenerated runs still certified membership of orientation 3, and neither complete-set rule stopped before the 250,000-observation cap. In the overlap case, 8 of 20 runs matched all saved checkpoint counts and 19 matched the stopping outcomes; the other four cases matched on both checks.

These are exact-count and trajectory-provenance discrepancies, not failed rational acceptance certificates. Repeating the pinned-version audit reproduced the new output exactly. Pinning NumPy alone has not reproduced the archived trajectories in this environment; the cause remains unresolved, and the original generating environment has not been reconstructed. The earlier discrepancy must not be attributed solely to using a different NumPy version. This finding concerns the recorded synthetic experiment, not a refutation or re-verification of the analytic theorems. The immutable research archive is unchanged. [Audit results](/assets/data/decision-geometry-seed-audit-2026-09-27.json) and the [audit script](/assets/data/decision-geometry-seed-audit-2026-09-27.py) expose the per-run comparisons and source hashes.

Four semantic corruption controls check rejection of an incorrect complete set, altered acceptance flag, changed censoring count and missing observation stream. Separate controls reject disabled assertions, altered bytes, an extra unlisted file and duplicate manifest entries. The supported wrapper deliberately refuses optimized Python; this is not reported as a successful optimized scientific replay.

The universal claims rest on the written arguments. Finite experiments, CI, hashes and a DOI do not establish formal proof, independent reproduction or external peer review. The supplied review is not an authenticated journal decision, and its missing computation archive was not replayed.

The guarantees require iid sites, positive finite branches, interior mixing, Jukes–Cantor substitution, no coalescence and membership in the specified open model union. They do not identify a unique generating history in overlapping regions, validate the model, handle arbitrary misspecification or establish optimal constants for every partial question. The executable truth-table interface supports Boolean outputs; the analytic theorem is stated for general finite-output questions.

## Relationship to earlier work

[Currie et al., version 1](https://arxiv.org/abs/2606.26673v1), provide the model characterisation in Theorems 3.1–3.2. The present paper uses that result; it does not claim to rediscover the network geometry.

[Garivier and Kaufmann](https://arxiv.org/abs/1905.03495v2) study testing overlapping hypotheses where returning one correct region can suffice. [Kaufmann and Koolen](https://www.jmlr.org/papers/v22/18-798.html) develop mixture-martingale and partition-testing methods. The present complete-set task has different alternatives from the one-correct-region task; its claimed contribution is the explicit constrained information calculation and boundary classification for this model, not the general invention of likelihood-ratio stopping.

[Genin and Kelly](https://arxiv.org/abs/1707.09378) give topological foundations for statistical verifiability, while [Bhadane et al.](https://arxiv.org/abs/2602.23020) address partially identified questions. Classical risk-ratio inference and universal coding are also credited in the manuscript. The current literature check is bounded and does not establish exhaustive priority.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Mathematical phylogeneticists | Explicit information geometry for overlapping triangle-network models | The model assumptions are essential; this is not biological validation |
| Sequential-inference researchers | A worked constrained projection with an attainable information lower bound | Complete-set and partial-query objectives differ |
| Researchers studying partial identification | An exact example separating useful conclusions from complete resolution | Boundary impossibility is question-specific |
| Verification contributors | Rational acceptance receipts and a focused analytic-to-code bridge | Checking receipts does not prove the universal stopping theorem |

## Why the problem matters

An information lower bound is operationally useful only if the relevant alternative distributions can actually be characterised. A distance to an inadmissible rival may lead to unnecessary sampling. This model is small enough to solve that constrained geometry explicitly, while retaining genuine overlap and boundary ambiguity.

The broader lesson is a research direction, not a universal theorem: specify the decision before asking whether more data will resolve it. A complete answer may be unobtainable even when a practically useful statement is stable. No measured impact, adoption or productivity gain is claimed here.

## How to inspect or reproduce the recorded checks

Start with the public manuscript's Theorem 3.3, Theorem 5.2, Theorem 6.2 and Lemma 8.1. Then follow `AI_INDEX.md`, `CLAIMS.json` and `research/CLAIM_CHECK_MAP.json` to their evidence and limits.

```sh
python -m pip install -r research/requirements.txt
python -B replay_publication.py --full --out /tmp/decision-geometry-replay
python -B publication/check_package.py --source . --output /tmp/decision-geometry-controls
```

Use new output directories outside the extracted package. Installation may require network access; replay does not. Do not add `-O`. The root manifest covers the public edition; the research subtree retains its original manifest. Compare exact checks and numerical tolerance checks separately.

## The most valuable next projects

1. Independently reconstruct the constrained projection and approachability proof, especially the equality case on the model closure.
2. Check or formalise the boundary local-label argument and the quantitative precision bridge to the stopping theorem.
3. Determine query-specific optimal information constants for useful partial questions; complete-set optimality does not settle them.
4. Investigate robustness to model misspecification as a separate research task before drawing biological conclusions.

## What is in the evidence package

| Location | Contents and role |
|---|---|
| `paper/` | Public scientific manuscript in PDF, TeX and accessible Markdown |
| `research/` | Received research tree preserved byte-for-byte, including code, results, source ledger and review history |
| `publication/intake-replay/` | Fresh producer-side full replay report and logs |
| Publication controls | `publication/` contains the final integrity and semantic-rejection checker |
| `AI_INDEX.md`, `CLAIMS.json`, `RESEARCH_GATES.json` | Agent entry point, claim map and bounded source/limitation assessment |
| `replay_publication.py`, `SHA256SUMS` | Supported fail-closed replay and exact payload inventory |

The separate release receipt binds the frozen archive without a circular self-hash. Original prose and data use CC0-1.0, original code uses MIT, and received third-party material retains its terms. Audio and diagrams explain the mathematics; they add no scientific evidence.
