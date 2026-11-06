## Summary in plain English

How much can a quantum state's entropy change when the state changes only a little? The answer depends on what “a little” means—and on whether the distances are known exactly or merely bounded above.

This paper separates those questions and asks a further one: if two states almost attain the largest possible entropy difference, must they resemble a pair that attains it exactly? At a fixed positive trace distance, the answer is yes. Both states are close to **one common extremal pair**, with an explicit error proportional to the square root of their entropy shortfall.

There is also a useful warning. An error budget is not an exact measurement. Substituting two upper bounds into the formula for two exact distances can underestimate the possible entropy change. The paper gives a finite calculation for the correct upper-bound problem.

This is an AI-assisted, unrefereed mathematical research candidate. Its proofs build on published entropy inequalities; the accompanying computations check examples and implementations, not the universal theorems.

## Summary for specialists

For density matrices on a finite-dimensional space, write $\varepsilon=\tfrac12\|\rho-\sigma\|_1$, $\nu=\|\rho-\sigma\|_\infty$, and use natural-log entropy. The paper derives the prescribed-distance optimum $F_d(\varepsilon,\nu)$ from the fundamental entropic inequality of Audenaert and coauthors and Sason's capped-spectrum optimization. The formula and attaining family occur in earlier work by Jabbour and Datta. The additional analysis identifies all equality cases, evaluates the two-cap modulus $G_d(E,N)$ through finitely many endpoints and quadratic-root candidates, and proves common-pair stability.

If the states are entropy-oriented and $\delta=F_d(\varepsilon,\nu)-[S(\rho)-S(\sigma)]$, there is an extremal pair at the same distances such that each state's **full trace-norm** error is at most $\min\{2,C_\varepsilon\sqrt\delta\}$, where

$$
C_\varepsilon^2=\frac4{-\log(1-\varepsilon)}+\frac4\varepsilon-2
\quad(0<\varepsilon<1),\qquad C_1=\sqrt2.
$$

No minimal-rank or rank-gap assumption is required. The coefficient is independent of dimension and operator distance, but not of trace distance. A three-dimensional example proves that the square-root exponent cannot generally be improved; the coefficient is not claimed optimal.

## Technical account

### Exact information and error budgets are different problems

The exact problem fixes both distances. The cap problem allows every pair whose trace distance is at most $E$ and whose operator distance is at most $N$. It must therefore optimize over the distances as well as over the states.

A four-dimensional example makes the distinction concrete. With caps $E=3/10$ and $N=1/5$, the cap optimum is attained at the smaller trace distance $1/5$:

$$
\sigma=\operatorname{diag}(1,0,0,0),\qquad
\rho=\operatorname{diag}(4/5,1/15,1/15,1/15).
$$

Its entropy gap is $h(1/5)+(1/5)\log3$, strictly larger than the exact-distance optimum at $(3/10,1/5)$. Here $h$ is binary entropy with natural logarithms. Thus using the caps as exact inputs would give the wrong bound.

The mechanism is a change in support dimension. The smallest allowed rank of one Jordan part of $\rho-\sigma$ is $\lceil\varepsilon/\nu\rceil$. When that rank increases, less space remains for the other part to spread uniformly. The exact-distance optimum can consequently jump down, even though entropy itself is continuous. Optimizing over upper bounds instead produces a continuous, nondecreasing modulus.

### A finite calculation, not a search over all matrices

The cap modulus reduces to a one-variable maximization. On each rank interval, the only possible interior maximum is a specified quadratic root. Together with the interval endpoints, these give a candidate list whose size grows linearly with dimension.

This is an exact mathematical reduction. It is not a guarantee about floating-point rounding or computational bit complexity. A certified implementation would need exact handling of rank boundaries and rigorous enclosures for the candidate values; nearly tied candidates must not be discarded on the basis of rounded decimals.

### What near equality reveals

The stability proof keeps four nonnegative losses in the entropy argument: mass outside the relevant support, mixing within that support, excess entropy in the negative spectrum, and missing entropy in the positive spectrum. A small total deficit controls all four. Spectral rounding then selects a single support shared by both approximating states.

The dependence on $\varepsilon$ matters: $C_\varepsilon$ behaves like $\sqrt{8/\varepsilon}$ near zero. A small raw entropy deficit alone does not identify an extremal pair uniformly as the states approach one another. For a desired full-trace-norm error $\eta$, the stated estimate suffices when $\delta\le\eta^2/C_\varepsilon^2$.

The paper also treats near saturation under upper caps, provided the actual trace distance has a positive lower bound. The nearby pair is an extremizer at the **actual distances**, not necessarily a maximizer for the cap problem.

## Evidence, assurance and limitations

The general statements rest on written proofs, not simulations. The package separates finite arithmetic examples, numerical diagnostics and checker guard tests from those proofs. Producer-side checking and internal AI-assisted review are not unaffiliated reproduction, external peer review or proof-assistant verification.

The results are finite-dimensional. The stability coefficient is not claimed optimal and does not remain bounded as trace distance tends to zero. The conditional-entropy appendix gives attainment with a common maximally mixed conditioning marginal when the first subsystem's dimension is at least the second's; it does not establish sharpness for arbitrary prescribed marginals or unequal marginals.

The novelty assessment is bounded by the sources inspected. It does not establish that no equivalent statement exists elsewhere.

## Relationship to earlier work

The foundational noncommutative inequalities are due to [Audenaert, Bergh, Datta, Jabbour, Capel and Gondolf](https://doi.org/10.1109/TIT.2025.3586478). The exact-distance formula, feasibility conditions and attaining construction are identified in [Jabbour and Datta](https://doi.org/10.1109/JSAIT.2024.3469929), while the capped-spectrum entropy optimization is in [Sason](https://doi.org/10.1109/TIT.2013.2274515). The trace-distance-only case recovers [Audenaert's sharp continuity estimate](https://doi.org/10.1088/1751-8113/40/28/S18).

The proposed contribution is the equality-necessity analysis, explicit cap evaluation and quantitative closeness to a common extremal pair. The fixed-difference and restricted conditional-entropy statements are consequences, not separate foundational inequalities.

## Who should care and why

| Audience | Potential use | Required caution |
| --- | --- | --- |
| Quantum information theorists | Analyze equality and near equality in two-distance entropy bounds | Preserve the trace-distance conditioning and finite-dimensional assumptions |
| Researchers using state-approximation error budgets | Calculate the worst entropy change allowed by two upper bounds | Use the cap modulus, not the exact formula with caps substituted |
| Validated-numerics developers | Implement a finite candidate calculation with explicit rank boundaries | Numerical evaluations are not certified enclosures without additional rounding control |

## Why the problem matters

A continuity bound turns information about state error into information about entropy error. A stability theorem goes in a different direction: it extracts structural information from near equality. Keeping these two uses distinct prevents a sharp mathematical formula from becoming an unreliable error estimate.

## How to inspect the result

Start with the introduction's distinction between exact distances and upper caps, then the four-dimensional example in Section 6. Theorem 4 states the stability guarantee and its conditioning. Sections 2 and 5 contain the equality and stability arguments; Section 4 gives the candidate calculation.

For computational checks, use the package's verification instructions and recorded environment. Compare the scope of each receipt with the claim being inspected: a checked example does not prove the theorem, and a successful script run does not establish priority.

## Most valuable next projects

The most direct implementation project is an interval-certified cap evaluator, including rank-boundary and tied-candidate tests. A sharper stability coefficient would strengthen the theorem without changing its interpretation. Extending sharp conditional-entropy attainment to other prescribed marginals is a separate mathematical problem; the present construction does not settle it.

## What is in the evidence package

The package contains the self-contained manuscript and source, claim and assurance registers, primary-source locators, example and stability checkers, guard tests, and verification instructions. The public argument does not depend on access to private reviews.
