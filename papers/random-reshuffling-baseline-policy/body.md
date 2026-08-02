## Summary

Machine-learning systems often shuffle training examples before processing them. Random reshuffling is a strong and widely studied baseline: choose a fresh random order, visit every example once, and repeat. This candidate asks a more surgical question. If the random draw contains some still-fair binary choices, can an algorithm resolve only those choices using the exact consequence for the objective—and leave the rest of the random baseline intact?

For one exact model, the answer is yes. When every quadratic training component has the same Hessian, a random permutation can be viewed as an **unoriented skeleton** of pairs plus independent fair bits saying which member of each pair goes first. The paper's value-aware rule resolves those exposed bits using exact conditional loss. For each realized skeleton it produces an explicit conditional decrement identity, and after averaging its one-epoch loss is no greater than under the **same random-reshuffling law**.

That comparator matters. The result is not “a hand-designed order beats some unrelated random experiment.” It is a coupled conditional-expectation statement inside the original random draw.

The paper also finds two limits. First, two appealing ideal ordering proxies can select globally optimal proxy orders whose true terminal-loss ratio is unbounded, even in a normalized four-item scalar family. Second, globally optimizing the exact terminal objective is computationally hard in a narrow but revealing regime: when the stable step size is part of the input and can approach the endpoint $2$, the scalar threshold problem is NP-complete via PARTITION. At a fixed distance from that endpoint, the paper instead gives a normalized additive approximation.

The work is a public research candidate, not a finished machine-learning method. A registered 32-instance matrix-free pilot preserved its safety logic but failed its practical feasibility gate. It establishes no neural-network, model-scale, wall-clock, or generalization improvement.

> **Candidate status:** unrefereed · internal model-assisted editorial outcome: **Major Revision** · external specialist review and independent reproduction absent · only the encoded core of Theorem 2 is formalized in Lean.

## The idea in one picture

![A uniform random permutation is decomposed into an unoriented pairing skeleton and fair orientation bits. Exact conditional value resolves only those bits and retains the same random-reshuffling comparator.](/assets/figures/rr-baseline-policy-flow.svg "Random reshuffling supplies both the skeleton and fair orientation bits. The policy resolves exposed bits by conditional value and compares against the same RR completion.")

The key move is to treat random reshuffling as a **baseline policy**, not merely as a probability distribution to average over. The algorithm samples the same skeleton that RR would induce. Before orientation, each pair is still a fair coin. Exact conditional value says which face of that coin has lower continuation value. If an approximation cannot certify the sign, a fresh fair fallback coin restores the baseline comparison.

This is deliberately a restricted action space. The policy does not search all $n!$ orders. It resolves at most ⌊n/2⌋ binary decisions that are already present inside one RR draw.

## Summary for specialists

For common-Hessian convex quadratics, the manuscript derives the affine endpoint of one permutation and writes terminal excess loss as a dense positive-semidefinite quadratic form over time-indexed residual placements. The time kernel has rank at most the parameter dimension. This gives the exact value coefficient needed for pair orientation; it is an order-selection representation, not a claim to the first exact analysis of RR dynamics.

The proxy-separation theorem constructs a rational scalar family with four residuals. Global minimizers of an ideal maximum-prefix discrepancy and of a dynamics-weighted diagonal proxy lie in explicitly characterized argmin sets, yet their exact terminal-loss ratio against a loss-optimal order grows without bound after residual normalization. Pinned Lean 4.32.1/mathlib formalizes the encoded combinatorial and rational-recurrence core, including the argmin sets and quantified unboundedness. The analytic bridge from the quadratic model and every other theorem remain conventionally proved.

For policy improvement, a uniform permutation is factored into an RR-distributed unoriented skeleton and conditionally independent Rademacher orientation variables. Under predictable exposure, sequential conditional minimization of the exact quadratic value makes the realized decrement term $D_t=|a_t|$ and yields the conditional identity

$$
\mathbb E[\Phi(v_m)\mid\mathcal F_0]
=\mathbb E[\Phi(z^{\mathrm{fair}})\mid\mathcal F_0]
-\mathbb E\!\left[\sum_t |a_t|\,\middle|\,\mathcal F_0\right],
$$

with the coefficient and filtration defined in the manuscript. This is an equality of conditional expectations, not a claim that the oriented path beats every independently sampled fair completion. Iterated expectation gives one-epoch noninferiority to the same RR law. The paper treats fixed and history-measurable exposure, odd-cardinality singleton coupling, deterministic ties, and certify-or-randomize fallback. Separate Bellman recursions give finite terminal, finite cumulative, and spectrally conditioned discounted comparisons.

The global decision problem—Scalar Common-Hessian Final-Loss Ordering, or SCFLO—uses $H=1$, zero initial error, zero-sum rational residuals, and an instance-encoded stable step η ∈ (1, 2). A PARTITION reduction establishes NP-completeness as η approaches 2. Because the source is weakly NP-complete and the step varies with the instance, the result does **not** establish strong NP-hardness or fixed-step hardness. Randomized and average-case hardness are also open. With η ≤ 2 − c for fixed c > 0, ordered-suffix enumeration supplies normalized additive endpoint and loss bounds plus an optimum interval, not a multiplicative PTAS or FPTAS.

## Three different claims that should not be conflated

| Surface | Choice being made | What the candidate establishes | What remains outside the claim |
|---|---|---|---|
| Proxy separation | Globally minimize one of two idealized ordering proxies | The resulting true terminal-loss ratio can be unbounded | It does not lower-bound the output of GraB, CD-GraB, PairBR, or Herding at Optimum |
| Baseline policy | Orient fair pairs inside an RR-induced skeleton | Realized decrement terms and conditional expected loss no greater than the same RR law | It does not compute the globally optimal permutation or cover heterogeneous nonlinear training |
| Global ordering | Choose any full permutation | NP-complete threshold decision near an input-dependent stability endpoint; fixed-factor deterministic barrier unless P=NP | No strong, fixed-step, randomized, or average-case hardness |

The visual boundary is the central intellectual result: a low-dimensional action exposed by the baseline can be exactly improved even when the unrestricted permutation problem is hard.

![A tractability map separates locally exposed pair orientations, fixed-margin suffix approximation, and global near-endpoint ordering hardness.](/assets/figures/ordering-tractability-boundary.svg "The tractability boundary depends on both the action space and the stability regime: local fair-bit decisions admit exact certificates, fixed-margin global ordering admits normalized additive control, and near-endpoint global threshold ordering is NP-complete.")

## Why the proxy counterexample matters

Ordering research often uses discrepancy or prefix statistics because they are computationally manageable and can support convergence analysis. That remains legitimate. The candidate's counterexample makes a narrower point: even if one could globally optimize two such idealized criteria, their optima need not approximate the exact one-epoch terminal objective multiplicatively.

The distinction is especially sharp because the example uses only four scalar components, exact rational arithmetic, a stable shared curvature, and bounded normalized residuals. It therefore removes numerical noise and high-dimensional geometry as explanations for the failure. What it does **not** show is that prefix control is useless, that published balancing algorithms fail in practice, or that worst-case ratios predict typical training behaviour.

## A hard global problem and a safe local move

There is no contradiction between the local certificate and global hardness. They optimize different action spaces.

The local policy receives an RR-generated skeleton and chooses only orientation bits. Conditional expectation can resolve a fair binary choice without increasing the baseline expectation. The global problem may place every item in every slot, which exposes the full combinatorial burden. Near the stability endpoint, the dynamics amplify late-placement information enough to encode PARTITION.

The fixed-margin result adds a useful qualification. When the step stays a constant distance from the endpoint, remote positions are geometrically discounted. Enumerating a suffix whose length grows logarithmically with the requested normalized additive accuracy controls what the unseen prefix can change. The paper therefore offers a three-part frontier rather than a blanket “ordering is hard” message:

- exact conditional control for exposed fair bits;
- normalized additive global control at a fixed stability margin; and
- NP-complete global threshold ordering when the input-dependent step approaches the endpoint.

## The practical pilot failed its own gate

Exact conditional value is expensive. It may require dense curvature actions or an additional pass over component gradients. The candidate therefore preregistered a matrix-free pilot using truncated Hessian-polynomial actions and a strict rule: orient a pair only when an error enclosure excludes the wrong sign; otherwise use a fresh fair coin.

The frozen study covered 32 synthetic instances and 176 instance-degree cells. Every declared safety control passed, ordinary and optimized Python agreed exactly, and there were zero false certified signs on the tested grid. But the practical gate was not met. Degrees one and two certified nothing; degree four succeeded in the two $n=6$ strata but failed coverage, retained-gain, and no-certificate requirements in both $n=8$ strata. No approximation degree was selected.

That negative/mixed outcome is informative. The immediate bottleneck is certified error control and coverage, not evidence that an approximate sampler improves training. A method that rarely certifies a decision simply falls back to RR and cannot justify its extra cost.

## What is original—and what is inherited

The candidate does not claim to invent random reshuffling analysis, quadratic epoch maps, prefix balancing, conditional expectation, Bellman recursion, Hessian-vector products, or composition-ordering complexity. Those are established lines of work.

Its claimed contribution is the conjunction of several narrower pieces:

- an order-resolved low-rank value representation for the declared common-Hessian objective;
- the exact four-item separation between two ideal proxy argmin sets and terminal loss;
- a same-RR skeleton coupling in which dynamics-filtered conditional value gives a realized decrement certificate;
- a same-model boundary between near-endpoint global hardness and fixed-margin normalized additive control; and
- a preregistered negative result showing that one conservative matrix-free compression route does not yet clear its feasibility gate.

Originality and priority have not been externally certified. The manuscript contains a detailed equation-and-action-law comparison to prior work, but public release and internal source triage are not substitutes for specialist literature review.

## What is not established

The following statements would overread the candidate:

- **No neural-network improvement.** The theorems use item-independent linear dynamics with positive-semidefinite quadratic value. Heterogeneous Hessians, nonlinear networks, data augmentation, momentum with item-dependent transitions, and adaptive optimizers fall outside the exact guarantee.
- **No practical speedup.** The oracle may cost an additional gradient pass and dense curvature work. No wall-clock, energy, accelerator, or communication saving has been measured.
- **No universal ordering superiority.** The policy compares a restricted orientation action to its coupled RR baseline. It neither finds nor approximates every globally optimal order.
- **No broad hardness theorem.** The reduction uses an instance-dependent step approaching $2$ and a weakly NP-complete source.
- **No whole-paper formal proof.** Lean covers only the declared encoded core of Theorem 2.
- **No independent verification.** The replay, mutation tests, hashes, release certificate, and model-assisted audits were produced within the same research workflow.
- **No peer or venue acceptance.** The internal Stage 3-prime assessment remains Major Revision.

## Why this could matter for machine learning

The credible opportunity is not “a theorem immediately makes neural networks train faster.” It is a research design principle: use a strong random baseline to expose small fair actions, replace a fair choice only when its value consequence is certified, and otherwise retain the original randomness.

That pattern could be attractive in training systems because it is fail-safe at the decision level. A sufficiently sharp approximation can act; an uncertain approximation can fall back. But transfer requires evidence that three quantities coexist: high certificate coverage, useful objective gain, and overhead low enough to improve net time or energy to a fixed target. The registered pilot has not yet produced that combination.

The most promising bridge is a staged programme rather than a direct model-scale claim.

## The most valuable next projects

### 1. A heterogeneous-Hessian validity margin

Derive an explicit perturbation bound for component Hessians that differ from a shared reference or drift during an epoch. The goal is a computable margin: if the exact common-Hessian orientation score exceeds the perturbation radius, the chosen sign remains valid. This would turn the current model assumption into a certificate that can succeed or fail on real batches.

### 2. Coverage-first compression

Design diagonal, low-rank, Krylov, sketching, or probabilistic enclosures for the value action. Optimize the fraction of signs certified—not merely mean-squared curvature accuracy—and charge every Hessian-vector product, extra gradient evaluation, memory transfer, and synchronization. The negative pilot suggests that a sharper error model may matter more than a higher polynomial degree.

### 3. A preregistered transfer ladder

First expand the exact synthetic generator across condition number, factor rank, spectral decay, residual alignment, step size, horizon, and pairing strategy. Next test frozen-backbone or LoRA workloads where curvature drift and per-example gradients can be measured at moderate cost. Only after passing predefined coverage and overhead gates should the method move to small nonlinear networks. Comparators should include RR, maximum-prefix and diagonal proxies, published balancing methods, exact LAPO where feasible, and full conditional expectation on tiny problems.

### 4. Close the complexity frontier

Determine the exact complexity at a fixed step, the nonoscillatory range η ≤ 1, strong hardness, and structured cases such as bounded residual alphabets or few distinct values. The current near-endpoint reduction and fixed-margin additive theorem leave a concrete mathematical gap.

### 5. Independent reconstruction

The highest-value assurance step is not another producer-side replay. Independent specialists should reconstruct the RR/value identity, the policy and Bellman arguments, and the complexity reduction without reusing the production verifiers. A separate implementation of the 32-instance pilot would test whether the negative coverage result survives different software and numerical choices.

## Who should care, and why

| Likely audience | Why the candidate matters | Useful next action |
|---|---|---|
| Optimization and learning theorists | It separates exact order value, proxy objectives, restricted fair-bit control, and global complexity inside one model. | Audit the assumptions and close the fixed-step complexity gap. |
| SGD and data-ordering researchers | The same-RR comparator gives a precise target for certified local interventions. | Compare the value coefficient with existing balancing and permutation methods on exact shared-curvature instances. |
| ML systems researchers | A certify-or-randomize policy offers a possible fail-safe interface, but its oracle cost is unresolved. | Build a coverage-first low-rank or Krylov implementation and report net time or energy to target. |
| Formal-methods researchers | The headline proxy family has a pinned Lean crosswalk, while most of the paper remains conventional. | Extend formalization to the analytic bridge, conditional-expectation theorem, and complexity reduction. |
| Complexity theorists | Near-endpoint hardness and fixed-margin additive control leave a sharply bounded frontier. | Determine fixed-step, strong, randomized, and structured-instance complexity. |
| AI research agents | Claim IDs, non-inference rules, exact replay, and open packages make the candidate unusually machine-routable. | Preserve qualifiers, reproduce from fresh sources, and attach critiques to the exact claim surface. |
| Training safety and governance researchers | Data order is a control surface that can improve or manipulate learning. | Require order, seed, objective, input-hash, subgroup, and corrupted-label logging in any experimental implementation. |

## How it was checked

The candidate's producer-side package reports exact rational verifiers, cause-specific mutation controls, and 91 tests under both ordinary and optimized Python. The tagged release workflow rebuilds the 55-page PDF, checks manifests and privacy boundaries, and replays from a fresh archive extraction. The matrix-free pilot's ordinary and optimized receipts agree byte for byte.

The Lean project pins Lean 4.32.1 and a specific mathlib revision, treats warnings as errors, rejects project-local proof placeholders, audits 15 manuscript crosswalk anchors with negative controls, and reports only Lean's standard logical dependencies for the formalized declaration.

These checks establish the declared byte, execution, and formal-artifact facts. They do not establish the truth of conventionally proved theorems, novelty, independent reproduction, expert acceptance, neural-network performance, or peer review.

## What is in the evidence package

The [public GitHub repository](https://github.com/ipitchford/random-reshuffling-baseline-policy) contains the sole 55-page anonymous paper, canonical Markdown and TeX source, bibliography, exact Python verifiers, tests, frozen receipts, the registered pilot protocol and readout, the pinned Lean project, a manuscript-to-Lean theorem crosswalk, claim and evidence registries, public-domain dedication, and deterministic release tooling.

The immutable candidate release is identified by tag [`v1.0.0-candidate`](https://github.com/ipitchford/random-reshuffling-baseline-policy/releases/tag/v1.0.0-candidate) and version DOI [`10.5281/zenodo.21757895`](https://doi.org/10.5281/zenodo.21757895). Its six release assets are the PDF, deterministic tagged-tree ZIP, complete replay transcript, detached publication certificate, certificate-hash sidecar, and `SHA256SUMS.txt`.

The repository's [`AI_INDEX.md`](https://github.com/ipitchford/random-reshuffling-baseline-policy/blob/main/AI_INDEX.md) and machine-readable [`AI_INDEX.json`](https://github.com/ipitchford/random-reshuffling-baseline-policy/blob/main/AI_INDEX.json) route agents to canonical claim IDs, evidence, non-inference rules, and open extensions. Reuse is dedicated to the public domain under CC0 to the extent the repository maintainer holds the relevant rights; cited third-party material and external software remain outside that dedication.
