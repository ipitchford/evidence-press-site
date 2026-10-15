## Summary

Two reports can overlap without being interchangeable. Suppose a forecaster can reveal all of one report, none of it, or a randomly chosen fragment. Is the second report at least as valuable after every such partial disclosure as it is after the first report is revealed completely?

This research candidate gives a finite mathematical test for that question when both reports have finitely many possible outcomes and prediction quality is measured by squared error for one numerical target. The test allows impossible combinations of report outcomes. It replaces an unlimited collection of disclosure choices with finitely many convex feasibility problems.

The result also explains why checking two outcomes at a time can be misleading. In one disclosure orientation, every two-state posterior restriction of the first report passes, but a three-state mixture fails. A different example shows that this failure can occur even without impossible signal combinations when the target has several components.

This is an analytic result with supplementary exact arithmetic checks, not a study of real forecasting performance. It remains an unrefereed, AI-assisted candidate.

## Summary for specialists

Let $A$ and $B$ be finite signals, with positive source prior and arbitrary joint support. Write $r_{ib}=\Pr(B=b\mid A=i)$, $v_{ib}=\mathbb E[Y\mid A=i,B=b]$ on supported cells, and $x_i=\sum_b r_{ib}v_{ib}$ for a scalar square-integrable target $Y$. A disclosure $T$ is generated from $A$ using fresh randomness.

For quadratic value $V(S)=\mathbb E[\mathbb E(Y\mid S)^2]$, the oriented substitution condition is

$$\begin{aligned}G(T)&=V(T,B)-V(T)\\&\quad-V(A,B)+V(A)\geq0.\end{aligned}$$

for every admissible $T$. The two-sided condition applies the criterion in both orientations. These are the two-base-signal quantifiers in Chen–Waggoner Definition 2.2.3, not submodularity between arbitrary pairs of partially disclosed signals.

Define $L_i(z)=\sum_{b:r_{ib}>0}r_{ib}(v_{ib}-z_b)^2$. Fix a finite $C\geq0$. For each distinct source mean $t$, find one auxiliary vector $z^t$ satisfying

$$L_i(z^t)\leq C(x_i-t)^2$$

for every source state $i$.

The paper proves that these finitely many completion systems are feasible exactly when $N(q)\leq C D(q)$ for every posterior $q$, where $D$ is the variance of the source means and $N$ is the residual conditional variance after observing $B$. Setting $C=1$ characterises substitution. Minimising $C$ gives the sharp coefficient through an attained convex quadratically constrained program whenever its value is finite.

## Technical account

The proof has two different jobs. Compact minimax duality shows that a universal posterior inequality forces a common completion vector at each source mean. Interpolation between consecutive scalar means then turns those finitely many certificates into a bound for every posterior. The auxiliary completion coordinates are proof variables, not assigned conditional expectations on impossible cells.

Under full rectangular support, the completion at $x_j$ is forced to be row $v_j$. The coefficient therefore reduces to

$$R=\max_{i,j:x_i\ne x_j}\frac{\sum_b r_{ib}(v_{ib}-v_{jb})^2}{(x_i-x_j)^2}.$$

Equal-mean rows with incompatible conditional means give an infinite coefficient. If all source means agree and the rows are compatible, the coefficient is zero (the maximum over distinct means is empty). With sparse support, the compatibility requirement concerns only cells shared by the equal-mean rows.

The sharp comparison concerns a **normalised gap**: under the stated nondegeneracy and full-support hypotheses, the infimum of $G(T)/(V(A)-V(T))$ is $1-R$. It is not a minimum absolute loss or a general optimal-disclosure solution. In limiting disclosures, both numerator and denominator can approach zero.

### One sparse family, two different answers

Take channel rows $(1/2,1/2,0)$, $(0,1/2,1/2)$ and $(1/2,0,1/2)$, indexing rows and columns by $0,1,2$. The supported target means are $v_{00}=v_{01}=0$, $v_{11}=v_{20}=a$ and $v_{12}=v_{22}=b$. For $0<a\leq1$ and $0\leq b\leq1$, the row means are $(0,(a+b)/2,(a+b)/2)$ and the exact coefficient is $C_*=4a^2/(a+b)^2$.

| Target means | Sharp coefficient | What it establishes |
|---|---:|---|
| $a=1/2$, $b=1$ | $4/9$ | Every disclosure has $G(T)\geq(5/9)\mathbb E\operatorname{Var}(x_A\mid T)$. |
| $a=1$, $b=1/2$ | $16/9$ | Every two-state posterior restriction of $A$ passes in this orientation, but at the uniform prior revealing nothing gives gap $-1/24$. |

The second case is not a numerical solver failure. Equal-mean rows jointly constrain completion coordinates that neither row alone fixes. The finite completion theorem detects that joint obstruction.

## Evidence, assurance and limitations

The universal statements rest on written analytic proofs. Rational programs check constructed examples, disclosure identities, negative witnesses and the vector obstruction. Normal and optimised executions are internal replay of supplied code, not independent external reproduction. Simulated academic review is internal AI-assisted scrutiny, not journal acceptance or external specialist peer review.

The theorem provides an exact mathematical equivalence, not an implemented general exact solver or a polynomial bit-complexity guarantee. A floating-point feasibility status near a boundary is not an exact certificate. Rational failures admit rational violating posteriors, but rational primal completions and rational optimal coefficients are not guaranteed.

The scalar target restriction matters. A full-support vector example has all six directed pairwise margins positive yet a negative three-state residual. An affine embedding realises it with strictly positive four-category target probabilities under quadratic probability scoring. That result concerns one orientation; it is not a classification of vector targets or a minimal-category theorem.

Historical priority remains unresolved after bounded source comparisons. No empirical forecasting benefit, strategic-market outcome or research-productivity gain is established.

## Relationship to earlier work

The earlier [binary informational-substitutes candidate](https://evidencepress.org/releases/binary-quadratic-informational-substitutes/) already covers a binary source with a finite second signal, including zero cells and vector targets. The present scalar theorem allows arbitrary finite source cardinality and arbitrary support. Neither result contains the other's entire target domain, and their shared development is not independent confirmation.

The framework, posterior splitting, minimax theorem and conic optimisation machinery are established ingredients. The claimed contribution is the finite scalar-knot completion equivalence, its sharp full-support specialisation and the demonstrated boundaries of pairwise testing. The paper distinguishes the target-dependent coefficient from ordinary channel-only strong data-processing constants.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Information economists | Screen a specified many-state information structure against every admissible disclosure. | Fixed scalar quadratic value; no equilibrium claim without further assumptions. |
| Optimisation researchers | Study the finite completion systems and exact certification of boundary cases. | Numerical feasibility alone is insufficient at exact boundaries. |
| Researchers studying forecasts | Understand when pairwise comparisons can miss joint information effects. | Constructed probability tables are not evidence about estimated real-world forecasts. |

## Why the problem matters

An information structure may face infinitely many reporting policies even when its signals are finite. A finite characterisation changes what must be checked: it replaces enumerating possible disclosures with simultaneous constraints tied to the observed source means. The sparse examples show why those simultaneous constraints cannot always be replaced by isolated pair checks.

## How to inspect or reproduce the recorded checks

Start with the manuscript's completion theorem and its hypotheses. Then compare the sparse-family arithmetic with the displayed positive and negative cases. Inspect the vector table separately: its role is to disprove an unrestricted vector extension, not to validate the scalar theorem.

The candidate package includes `verify_release.py`, `test_sharp_coefficient.py`, `completion_exact.py` and `vector_exact.py`. Start with the version-pinned [release README](https://github.com/ipitchford/finite-signal-quadratic-substitutes/blob/v0.1.0-candidate/README.md) and [machine-readable evidence guide](https://github.com/ipitchford/finite-signal-quadratic-substitutes/blob/v0.1.0-candidate/AI_INDEX.md). Running a checker establishes its stated finite scope. It does not replace the proof, establish originality or constitute independent reproduction.

## The most valuable next projects

The highest-value assurance task is development-independent specialist scrutiny of the completion equivalence and its relationship to prior minimax-risk and extension results. Technical follow-ups include exact certificates for degenerate convex feasibility and a useful geometric characterisation for vector targets. Empirical estimation and other scoring rules require separate research rather than extrapolation from this theorem.

## What is in the evidence package

The frozen research candidate contains a complete manuscript, exact examples and checking code, source-comparison notes, and a manifest binding the assessed files. Version `0.1.0-candidate` is archived under DOI [10.5281/zenodo.23401650](https://doi.org/10.5281/zenodo.23401650), with a direct [manuscript](https://github.com/ipitchford/finite-signal-quadratic-substitutes/releases/download/v0.1.0-candidate/paper.pdf) and [release package](https://github.com/ipitchford/finite-signal-quadratic-substitutes/releases/tag/v0.1.0-candidate). Full downloads from GitHub and Zenodo matched the frozen local manifest, archive and PDF on 15 October 2026. This establishes public asset identity, not scientific correctness or independent reproduction.
