## Summary

**In one sentence.** Any bounded score that averages zero under every null distribution and at least $\delta$ under every alternative can be turned into a coin that is fair under every null and biased under every alternative; betting on that coin gives evidence that is exactly calibrated and has the same behaviour under every null, with the best growth guarantee that depends on $\delta$ alone. When the evidence may be unbounded, by contrast, insisting on that second property can cost all the power.

**What an e-value is.** An e-value is a number that measures evidence against a hypothesis, like the payoff of a fair bet against it: if the hypothesis is true its average is at most one, so large values are unlikely by chance, and rejecting when it exceeds $1/\alpha$ is a level-$\alpha$ test. Its quality is how fast evidence grows when the hypothesis is false, measured by the expected logarithm under the alternative, called the e-power.

**Two stronger demands.** Often the hypothesis under test (the null) is not one distribution but a whole family, for example because of unknown nuisance parameters. Two stronger properties are then natural. An e-value is *exact* if its average is exactly one under every null distribution. It is *pivotal* if its whole distribution is the same under every null, so its behaviour under the null is known exactly even though the true null is not.

**What was known.** For finitely many distributions, Zhang, Ramdas and Wang (Annals of Statistics, 2024) showed that exact pivotal e-values with positive e-power exist exactly when the alternatives stay away from the linear span of the nulls; their proof used optimal transport. For infinite families they characterised *bounded exact* e-values by a closure condition (Theorem 6.8, print numbering) and conjectured that the same condition decides when *pivotal* ones exist (Conjecture 6.9).

**What is new.**

| What | In plain terms | Where |
|---|---|---|
| A binary pivot | Turn the separating score into a coin that is fair under every null and biased under every alternative, then bet the fraction $\delta$ on heads. The result is exact and pivotal, and its e-power is at least the information in a coin with bias $\delta$ | Theorem 3.1 |
| The best guarantee from $\delta$ alone | Some experiment with margin $\delta$ allows no e-value, of any kind, to do better | Theorem 3.2 |
| The conjecture, sufficient half | This proves the "if" half of Conjecture 6.9, and gives a short, transport-free proof of the step of the finite theorem that produces exact pivotal p- and e-values | Corollary 3.4 |
| What pivotality costs | A pivotal statistic cannot tell apart an alternative that lies in the closed span of the nulls. In one example an exact e-value grows, with e-power at least $\tfrac14\log\tfrac{27}{16}\approx0.13$, but every pivotal e-value is powerless | Proposition 4.3, Theorem 4.5 |
| A correction of one sentence | The sentence of Theorem 6.8 saying that tightness of the alternatives makes a simpler test of the criterion equivalent is false. Weak compactness is the right condition, and under it the conjecture holds in both directions. The main criterion is unaffected | Theorem 5.1, Proposition 5.2, Corollary 5.4 |

The ingredients (similar tests, randomisation, Kelly betting) are classical. The contribution is that this short route works for infinite families, where simultaneous transport had been expected to be needed, and that its guarantee is the best possible given $\delta$ alone.

**A worked example.** Section 7 takes two null and two alternative distributions on four states, with margin $\delta=6/31$ certified by exact fractions. The binary coin guarantees e-power about $0.019$; a better pivotal e-value reaches about $0.039$; the best exact e-value, which is not pivotal, reaches about $0.056$. In this example pivotality costs about thirty per cent of the exact optimum, and the binary construction recovers about half of the pivotal optimum.

**Limits.** The results concern one observation; sequential results follow only by repeating it. There is no general formula for the best pivotal e-value, and no full characterisation for unbounded pivotal e-values. The separating score comes from functional analysis: for finite tables it is computable by linear programming, but for infinite families computing it is a separate task. The binary guarantee is a worst case and can be well below the best achievable in a given problem. This is an unrefereed candidate; its assurance is internal AI-assisted review and computational checks, not peer review.

## Summary for specialists

Null family $\mathcal P$ and alternatives $\mathcal Q$, dominated by $R$; densities are identified with measures. Let $S$ be the $L^1(R)$-closed span of the null densities, $C$ the closed convex hull of the alternative densities, and

$$\delta=\operatorname{dist}_{L^1}\bigl(0,\overline{S+C}\bigr),$$

a variation-norm distance (twice total variation). Uniform e-power is $g_{\mathcal Q}(E)=\inf_{Q}\mathbb E_Q\log E$, and

$$I(d)=D\bigl(\mathrm{Bern}(\tfrac{1+d}2)\,\Vert\,\mathrm{Bern}(\tfrac12)\bigr).$$

"Common randomisation" means an independent uniform variable is available (joint atomlessness).

- **Lemma 2.2** *(proof)*: $\delta$ is the largest $t$ such that some $h$ with $|h|\le1$ has $\mathbb E_Ph=0$ for every null and $\mathbb E_Qh\ge t$ for every alternative; the argument follows Zhang, Ramdas and Wang's proof of their Theorem 6.8.
- **Theorem 3.1** *(proof)*: under domination and common randomisation, $\delta>0$ is equivalent to a bounded exact e-variable with $g>0$, to a bounded exact pivotal one, and to an exact p-variable $T$ with $Q(T\le t)\ge t+\eta\min(t,1-t)$; one may take $\eta=\delta$. With $B=\mathbf 1\{U\le(1+h)/2\}$, the statistic $E_\delta=1+\delta(2B-1)$ is exact and pivotal with $g_{\mathcal Q}(E_\delta)=I(\delta)$.
- **Theorem 3.2** *(proof)*: for each $d$ there is an experiment with margin $d$ in which every e-variable has $\mathbb E_Q\log E\le I(d)$, so $I(\delta)$ is the best guarantee that depends on $\delta$ alone (Remark 3.3).
- **Corollary 3.4** *(proof)*: the "if" direction of Conjecture 6.9 in bounded form; with "bounded" added the conjecture holds in both directions; for finite families, condition (e) of Theorem 6.1 implies (a) and (b) without transport. Without "bounded", the "only if" direction fails (Ram, Larsson, Ruf and Ramdas, Example 5.1; Ramdas and Wang, Example 3.15; Theorem 5.1 here for an infinite null family).
- **Proposition 4.3, Corollary 4.4** *(proof)*: for a pivotal $X$ with null law $\pi$, $d_{\rm TV}(Q\circ X^{-1},\pi)\le\operatorname{dist}_{L^1}(q,S)$; so an exact pivotal e-variable with $g>0$ forces $C\cap S=\varnothing$.
- **Theorem 4.5** *(proof)*: a dominated, jointly atomless experiment with a convex, variation-closed null family and one alternative $Q\in S$, in which an unbounded exact $E\ge1/2$ has $\mathbb E_Q\log E\ge\tfrac14\log\tfrac{27}{16}$ while every pivotal e-variable has $\mathbb E_Q\log Z\le0$. Remark 4.6 gives a continuous version on $[0,1]$ with e-power $1-\log2\approx0.307$.
- **Theorem 4.1, Proposition 4.2, Lemma 4.7, Example 4.8** *(proof)*: a uniform-integrability tail criterion for the unbounded pivotal problem, an unavoidable tail, and a chi-square obstruction showing that the necessary condition of Corollary 4.4 is not sufficient; together a strict two-sided bracket.
- **Theorem 5.1, Propositions 5.2 and 5.3, Corollary 5.4** *(proof)*: disjoint closed $S$ and $C$ with $\delta=0$ and narrowly compact (hence tight) $\mathcal Q$ on a compact space; weak compactness of $C$ in $L^1$ restores the equivalence; under weak compactness of $\operatorname{conv}\mathcal Q$, exact pivotal existence, $\delta>0$ and $S\cap\operatorname{conv}\mathcal Q=\varnothing$ are equivalent.
- **Propositions 6.1–6.3** *(proof)*: in an explicit contamination model, positive e-power coexists with a detection delay $\mathbb E\tau\ge n(1-\alpha)+\alpha$; for the bounded pivot the delay is uniform over alternatives.

## Technical account

**The margin as a linear programme.** Because $S$ is a linear space and $C$ is convex, Hahn–Banach separation in $L^1$ with dual $L^\infty$ turns the distance $\delta$ into the value of a problem over bounded scores: maximise $\inf_Q\mathbb E_Qh$ subject to $|h|\le1$ and $\mathbb E_Ph=0$ for every null. For finite tables this is a linear programme with an explicit primal certificate (a mixture of alternatives minus a combination of nulls whose variation norm equals $\delta$).

**From score to coin.** The function $\phi=(1+h)/2$ takes values in $[0,1]$ and has mean exactly one half under every null: it is a randomised similar test of size one half. Realising it with an independent uniform $U$ gives $B=\mathbf 1\{U\le\phi\}$, a fair coin under every null and a coin with success probability $(1+\mathbb E_Qh)/2\ge(1+\delta)/2$ under every alternative. Because the null law of $B$ is the same for every null, any function of $B$ is pivotal. The Kelly bet on a coin of bias $\delta$ is $E_\delta=1+\delta(2B-1)$, whose expected logarithm is affine and increasing in $\mathbb E_Qh$, so the worst alternative gives exactly $I(\delta)$.

**Why no better guarantee exists.** On two points take a fair null and an alternative with success probability $(1+d)/2$. Every e-variable has expected logarithm at most the Kullback–Leibler divergence, which equals $I(d)$, and the margin is $d$.

**Why pivotality can cost everything.** A pivotal statistic integrates every bounded function of its value to the same constant under every null, hence under everything in the closed span. An alternative that lies in that span, though not in the span itself, therefore induces the null law on every pivotal statistic. Theorem 4.5 builds such an alternative as a limit of null mixtures while an unbounded, non-pivotal exact e-variable still gains.

**The tightness sentence.** Tightness controls where mass sits, not how concentrated densities can be. Theorem 5.1 builds alternatives whose densities concentrate on shrinking sets, so the closed span and the closed hull are disjoint but at distance zero. Weak compactness in $L^1$ (uniform integrability) rules this out, which is why it repairs the criterion.

## Evidence, assurance and limitations

The synthetic audio briefing is explanatory, not additional evidence. Its [complete transcript](/assets/audio/exact-pivotal-e-variables-infinite-hypotheses.txt) is available for reading.

- **Proofs.** Every theorem, proposition and corollary has a written proof in the 16-page paper. The paper opens with a plain introduction (definitions, what was known, what is new, the idea in one paragraph and a roadmap) and ends with the scope, open questions and an AI-use statement. No proof assistant was used.
- **Exact checks.** Exact fractions verify the four-state certificate: null score means zero, alternative means $6/31$, the primal residual of norm $6/31$, the coin probabilities and the binary e-values $37/31$ and $25/31$. The ternary pivotal kernel's laws are verified exactly. High-precision arithmetic checks the constants of Sections 4 to 6, including $\tfrac14\log\tfrac{27}{16}$, $1-\log2$, the chi-square identity and the detection-delay bound. The pivotal optimum $0.0391954$ rests on a one-dimensional numerical grid after an exact reduction, and the exact optimum on a concave numerical optimisation. None of the general theorems depends on these computations.
- **Tests that can fail.** No script uses `assert`, so the checks behave identically under Python's optimised mode. Changing the margin $6/31$ to $7/31$, or the lower bound $\tfrac14\log\tfrac{27}{16}$ to $\tfrac13\log\tfrac{27}{16}$, makes the script exit with failure.
- **Replay.** All three scripts were rerun from fresh copies before release under Python 3.12 with pinned libraries, in normal and optimised mode; every output matched the recorded file apart from interpreter version fields. GitHub CI reruns them under `-O` against the recorded outputs, with both negative controls, as a blocking job.
- **Review.** Five internal AI-assisted reviewer roles, an adversarial review by a second AI model and a clean replay found no mathematical error and led to one revision round. It stated precisely what the paper settles in the conjecture, credited the sign-test example, test randomisation and Kelly betting, added related work, adopted the print numbering of Zhang, Ramdas and Wang, toned the tightness correction to a correction of one sentence, tightened several proofs, rewrote the introduction for non-specialists, and added the extension on what pivotality costs. A re-review, a proof audit and a second-model audit of the new proofs followed. A rating-free summary is in the package. None of this is peer review, independent reproduction or formal verification.
- **Limitations.** One observation; no formula for the optimal pivotal e-value; no geometric characterisation of unbounded exact pivotal existence; pointwise positivity of e-power and $n$-observation rates for infinite families are not treated; the separating score for infinite families is not computed. Attributions rest on a bounded literature search. This remains an unrefereed candidate.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Statisticians designing e-values for composite nulls | An exactly calibrated, pivotal e-value with a guaranteed growth rate whenever the alternatives are separated from the span of the nulls | The guarantee is a worst case; richer pivotal kernels can do much better in a given problem |
| Researchers on anytime-valid inference | Settles the sufficiency half of Conjecture 6.9 and the compact case; shows where pivotality has a real cost | The unbounded pivotal problem is not fully characterised |
| Readers of Zhang, Ramdas and Wang | A transport-free route to their finite theorem and a correction of one sentence of Theorem 6.8 | Their main criterion is unaffected |
| Research agents | Machine-readable claims, an agent index and replayable exact checks | The checks test the example and constants; they are not part of the proofs |

## Why the problem matters

Composite nulls with nuisance parameters are the normal case in practice. An e-value that is merely valid may have an unknown, nuisance-dependent null behaviour, which complicates calibration and combination. Exact pivotal e-values remove that uncertainty: their null law is a single known distribution. Knowing when they exist, how much growth they can guarantee, and what the pivotal requirement costs tells a designer whether to insist on pivotality or settle for exactness.

## Related Evidence Press release

The companion release [The cost of exact calibration for growing Gaussian null families](/releases/exact-calibration-gaussian-null-families/) quantifies the cost of exactness, rather than pivotality, for growing families of Gaussian nulls; both papers come from the same research bundle.

## How to inspect or reproduce the recorded checks

From the GitHub release or the Zenodo archive, with [uv](https://docs.astral.sh/uv/):

```sh
shasum -a 256 -c MANIFEST.sha256
UV="uv run --no-project --python 3.12 \
  --with numpy==2.3.5 --with scipy==1.17.0 \
  --with mpmath==1.3.0"
$UV python -I -B -O verification/checks/finite_example.py
$UV python -I -B -O verification/checks/pivot_comparison.py
$UV python -I -B -O verification/checks/extension_checks.py
```

Each script prints JSON in about a second. `ENVIRONMENT.txt` lists the software used. `AI_INDEX.md` maps each claim to its proof and checks, `PRIOR_ART.md` and `RESEARCH_GATES.json` record the prior-work boundary and the sources read, and `REVIEW_SUMMARY.md` lists the review objections and how each was handled.

## The most valuable next projects

1. Characterise when an unbounded exact pivotal e-value with positive uniform e-power exists, closing the bracket of Section 4.
2. Find the optimal exact pivotal e-value in a given experiment, beyond the finite-table convex programme.
3. Determine large-sample rates of exact pivotal e-power for infinite null families.
4. Compute, or approximate with guarantees, the separating score for natural infinite families.

## What is in the evidence package

The paper (LaTeX source and PDF); three scripts in `verification/checks/` with their recorded outputs in `verification/outputs/`; `verification/requirements.txt`; `PRIOR_ART.md`; `refs.bib` from Crossref, arXiv and DataCite records; `AI_INDEX.md`; `REVIEW_SUMMARY.md`; `RESEARCH_GATES.json`; `REPLAY_RECEIPT.md` and `ENVIRONMENT.txt`; citation metadata, licences (CC0-1.0 for text and data, MIT for code), the CI workflow and SHA-256 sums.
