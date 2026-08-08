## Summary

Joint replenishment asks when several items should be ordered together so that they can share a common ordering, dispatch, receiving, or changeover cost. Even with only two items, the exact objective is arithmetically delicate: periodic schedules coincide when their period ratio is rational, and the density of shared order epochs depends on the coprime numerator and denominator.

This candidate turns that two-item problem into an auditable certificate system. Each fixed coprime ratio becomes a one-dimensional convex scale problem. A resource-aware Lagrange-dual bound then lower-bounds every ratio not yet enumerated. The paper proves that when the common ordering cost is positive, some rational synchronised policy is strictly better than the best desynchronised policy. The improving tail therefore eventually rises above the best enumerated cost and the algorithm terminates after finitely many ratios.

“Guaranteed termination” has a precise and limited meaning here. It says the mathematical algorithm eventually returns a certificate on every instance in the stated model. It does not give a polynomial running-time bound, solve the multi-item problem, or remove the known number-theoretic difficulty of two-item joint replenishment.

The release also studies the gap of the standard convex relaxation, denoted $(P)$. A cap-reduction theorem shows that, over nonnegative real resource systems, worst-case gap analysis can be restricted to separate item-frequency caps. Inside a canonical triple-tie family, exact interval and elimination certificates locate a unique algebraic family maximum

$$
\gamma \approx 1.11188959394.
$$

This proves a global lower bound for the relaxation gap. It does **not** determine the exact global gap.

> **Status:** unrefereed candidate computer-assisted result. Producer-side fresh-extraction replay and solver-independent certificate checks pass. There is no independent reproduction, formal proof-assistant verification, external specialist review, peer review, field validation, complete novelty audit, or evidence of realised operating savings.

## Summary for specialists

Let item $i$ use period $T_i>0$, with item-specific cost $K_i/T_i+H_iT_i$ and common cost $K_0$ at every distinct order epoch. Resource row $d$ requires

$$
\frac{\alpha_{1d}}{T_1}+\frac{\alpha_{2d}}{T_2}\leq\beta_d,
\qquad \alpha_{id}\geq0,\quad\beta_d>0.
$$

For $T_2/T_1=p/q$ in lowest terms, set $T_1=qt$ and $T_2=pt$. The union density of the two order lattices is $(p+q-1)/(pqt)$, so the exact objective becomes

$$
g_{pq}(t)=\frac{A_{pq}}{t}+B_{pq}t,
$$

where

$$
A_{pq}=K_0\frac{p+q-1}{pq}+\frac{K_1}{q}+\frac{K_2}{p},
\qquad
B_{pq}=H_1q+H_2p,
$$

on an exactly computable rational interval $t\geq t_{pq}^{\min}$. Its optimum is therefore rational or of the form $2\sqrt z$ with rational $z$.

The constrained desynchronised optimum in frequency variables $f_i=1/T_i$ is

$$
M_R=\min_{Af\leq\beta}
\left[(K_0+K_1)f_1+\frac{H_1}{f_1}+(K_0+K_2)f_2+\frac{H_2}{f_2}\right].
$$

For every nonnegative multiplier vector $\lambda$, the package certifies

$$
L(\lambda)=2\sum_{i=1}^{2}
\sqrt{H_i\left(K_0+K_i+\sum_d\lambda_d\alpha_{id}\right)}
-\sum_d\lambda_d\beta_d\leq M_R.
$$

After all coprime pairs with $p+q\leq S$ are enumerated, every omitted rational or irrational ratio costs at least

$$
\sqrt{\frac{S}{S+1}}\,M_R,
$$

and the same statement remains certified with any stored dual lower bound $L(\lambda)$. The verifier checks nonnegative rational multipliers and downward dyadic radical bounds using integer arithmetic.

The strict synchronisation theorem handles an irrational minimiser of $M_R$ with one-sided continued-fraction approximants. The separable perturbation is $O(q^{-2})$, while the newly created intersection saves common cost of order $q^{-1}$. A rational feasible policy is therefore eventually strictly cheaper than $M_R$. This supplies totality without implying efficient worst-case bit complexity.

## The algebraic cap family

The canonical construction normalises $K_0=1$, sets $K_1=K_2=0$, imposes frequency caps $f_1\leq x$ and $f_2\leq1$, and chooses

$$
H_1=\frac23,
\qquad
H_2=\frac{-3x^2+7x-2}{3(1-x)}.
$$

On the certified interval $0.7509\leq x\leq0.751$, the ratios $(1,1)$, $(1,2)$, and $(2,3)$ tie and every other ratio is excluded by exact finite checks plus the resource-aware tail. The gap function is

$$
G(x)=\frac{x(3x^2-5)}{3x^3-4x^2+x-2}.
$$

Its unique family maximum occurs at the positive root of

$$
6x^4-18x^3+19x^2-5=0,
$$

and the corresponding $\gamma$ satisfies

$$
262\gamma^4-916\gamma^3+863\gamma^2+150\gamma-375=0.
$$

The release also includes a nearby fully rational instance with exact gap

$$
\frac{2484309748962090917667}{2234313336955730917667}
=1.111889593939846\ldots,
$$

closing at $S=8$ after 21 coprime ratios. The construction allows zero item-specific setup costs, exactly as the declared model does; it does not claim a perturbation theorem for a convention requiring every $K_i$ to be strictly positive.

## What the result does not establish

- It does not determine the exact global gap of relaxation $(P)$.
- The cited upper bound is conditional on the external theorem applying to the same relaxation and model.
- It does not give a polynomial-time algorithm in binary input length.
- It does not solve the multi-item joint replenishment problem.
- The finite alignment-configuration hull is a two-item regression prototype, not a multi-item separation oracle or rounding theorem.
- It proves no $k=1$, $k=2$, or fixed-column-sparsity approximation or hardness frontier.
- It supplies no complete three-item exact oracle.
- It does not model uncertain demand, safety stock, lead times, case packs, routing, phases, fixed delivery calendars, pointwise capacity, or multi-echelon interactions.
- Synthetic screening and sensitivity outputs are not operational evidence.
- A local replay receipt, DOI, or agreement among producer-workflow agents is not independent mathematical verification or peer review.

## Why the resource-aware tail matters

An unconstrained tail can be far below the true cost when capacity or minimum-interval rows force the periods away from their unconstrained scales. The new dual bound keeps those rows in the stopping certificate. This sharply reduces the closing cutoff on the bundled instances while also supporting the proof that the unbounded algorithm eventually stops.

The distinction is useful beyond implementation. A finite certificate proves a particular instance after a particular enumeration. The totality theorem explains why the same method will eventually certify every instance in the stated class. Neither fact establishes a polynomial running time.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Inventory and operations-research theorists | Audit a compact exact two-item oracle and a new relaxation-gap construction. | The global gap and wider approximation frontier remain open. |
| Algorithm designers | Use resource-dual tails as stronger finite stopping certificates. | Solver-independent replay is still producer-side and is not a complexity bound. |
| Planning-system developers | Benchmark two-item heuristic outputs against exact rational/radical certificates. | The model uses stationary average-rate constraints and omits many operational details. |
| Approximation researchers | Reuse the cap reduction and canonical algebraic family as regression targets. | The family maximum is not a global upper certificate. |
| Formal-methods researchers | Formalise the fixed-ratio, scale-floor, synchronisation, cap-reduction, and elimination arguments. | No theorem is currently proof-assistant checked. |
| AI research agents | Retrieve exact claims, exclusions, manifests, replay commands, proof objects, and open tasks. | Preserve the candidate status and every non-inference boundary. |
| Independent reviewers | Reconstruct the analytic proof and certificate semantics from the immutable archive. | Producer adversarial review is not an external specialist audit. |

## The extension programme remains open

The supplied extension document is preserved in the release and mapped requirement by requirement. This candidate completes the exact two-item resource-aware tail, totality theorem, real-coefficient cap reduction, stronger algebraic family, and a finite local alignment prototype. It deliberately leaves later stages as separately publishable work:

1. close the exact global and two-item cap gaps;
2. build a multi-item alignment relaxation with separation and rounding;
3. determine the column-sparsity approximation or hardness frontier;
4. construct and independently reproduce a complete three-item oracle;
5. replace one-at-a-time sensitivity with correlated uncertainty regions;
6. add phases, calendars, and pointwise constraints;
7. run a bounded, preregistered field pilot; and
8. develop a more general constrained periodic-synchronisation theory.

## How the package was checked

The immutable release ZIP was rebuilt and replayed from a fresh extraction on macOS arm64 with pinned Python dependencies and a recorded TeX toolchain. The positive controls rebuild four finite witnesses, verify two parametric families, check the alignment regression, regenerate numerical outputs and six figures, run 16 tests, compile the code, and rebuild the 8-page paper and 3-page practitioner brief.

The negative controls re-hash a semantic certificate mutation and require rejection. A deliberately truncated solve must exit with status 2 and omit every optimum-named field. The release gate also runs under `python -O` so a verifier depending only on disabled `assert` statements cannot silently pass.

These checks establish the declared byte, execution, and certificate facts for the archived payload. They do not establish independent reproduction, the truth of every conventional proof step, formal verification, novelty, specialist acceptance, field validity, or operational benefit.

## What is in the evidence package

The [public GitHub repository](https://github.com/ipitchford/certified-two-item-jrp) contains the candidate paper and TeX, practitioner brief, exact solver, standard-library certificate verifiers, four finite witnesses, two family certificates, the alignment prototype, tests, schemas, figures, outputs, claim and AI indexes, provenance, assurance and licence records, the complete extension programme, and its requirement-to-evidence ledger.

The immutable candidate is tag [`v1.1.0-candidate`](https://github.com/ipitchford/certified-two-item-jrp/releases/tag/v1.1.0-candidate), commit `b7df3fb1b8b1f87d335952f22ba1389e98402b6f`. Its validated ZIP has SHA-256 `5d3dd5fa39787c5b1461da12db83810c36eede33a3b595a953422998dfb2ed6a`. The [producer replay receipt](https://github.com/ipitchford/certified-two-item-jrp/releases/download/v1.1.0-candidate/certified-two-item-jrp-v1.1.0-candidate.replay-receipt.json) is external to the ZIP so that it can identify the archive without a circular self-hash.

The preserved version is [Zenodo record 21855567](https://zenodo.org/records/21855567), DOI [10.5281/zenodo.21855567](https://doi.org/10.5281/zenodo.21855567). Software is MIT licensed. Original non-software papers, documentation, data, certificates, metadata, figures, and release material are dedicated under CC0-1.0 to the extent the publisher holds the relevant rights; third-party literature, dependencies, names, and embedded fonts remain outside that dedication.
