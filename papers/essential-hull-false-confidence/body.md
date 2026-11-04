## Summary

**In one sentence.** In location models with light-tailed errors, a hypothesis can be favoured beyond calibration at a parameter exactly when that parameter lies strictly inside the smallest convex shape enclosing the hypothesis, and a finite test warns when this happens at high confidence.

**The problem, in plain terms.** A satellite operator computes the probability that two objects will collide, given a noisy estimate of their closest approach. When the uncertainty is large, that probability is small even if a collision is certain. So "no collision" looks well supported when it is false. Balch, Martin and Ferson (2019) named this effect *false confidence* and proved that, for any additive probability produced from data, affected hypotheses exist. Their theorem does not say which ones. Martin (2024) asked that question.

**What is proved.** Take a flat-prior posterior for a location parameter. In these models this is also the usual fiducial distribution and, in one dimension, a confidence distribution.

- **The hull criterion.** Draw the smallest closed convex shape enclosing the hypothesis, ignoring pieces of zero volume. With light-tailed errors, the hypothesis is calibrated at all thresholds at a parameter exactly when that parameter is not strictly inside the shape.
- **The exact tail condition.** "Light-tailed" has a precise meaning, given below. Exponential-power errors qualify exactly when $p>1$. Tails like $\exp(-r\log r)$ qualify in one dimension and fail in every higher one.
- **Only halfspaces are calibrated from both sides.** Martin conjectured that all non-linear hypotheses are affected. Taken literally this is false, because a ball is non-linear and is not affected. The corrected statement is that a hypothesis and its complement can both escape only if the hypothesis is almost everywhere a halfspace.
- **Only one kind of function has exact marginal posteriors.** These are the strictly monotone functions of one linear form.
- **A practical warning at a fixed level.** With log-concave errors, suppose everything outside the hypothesis fits in a convex set with posterior mass at most $s<1/2$ when the data land on the truth. Then the hypothesis gets probability at least $1-s$ at least half the time.

**An example.** With $\sigma/R=10$, where $\sigma$ is the error scale and $R$ the collision radius, a certain collision gives a computed probability $P_c\leq0.01$ with probability one (Table 2 of the paper).

**What this does not say.** The hull test concerns all thresholds, and failure may occur only at low ones. So the hull criterion alone says nothing about 95% confidence. For example, $(-2,-1)\cup(1,2)$ in the standard Gaussian model has false confidence at $0$ in the formal sense, yet its posterior probability never exceeds $0.39$. The finite-level theorem is the tool for high confidence.

## Summary for specialists

Model: $X=\theta+AZ$, $Q_x=\mathcal L(x+AZ')$, with $A$ invertible and $Z$ of density $g(\lVert z\rVert)$, $g$ positive, bounded and nonincreasing. Write $q_H(x)=Q_x(H)$ and $F(t)=P_\theta\{q_H(X)\leq t\}$. Validity (V) means $F(t)\geq t$ for all $t\in(0,1)$. $C_H$ is the closed convex hull of the essential support of $H$, and $S(R)=P(\lVert Z\rVert\geq R)$. Condition (T) is $\liminf_{R\to\infty}S(R)/g(R-b)=0$ for every $b>0$.

| Result | Statement | Relation to prior work |
|---|---|---|
| Lemma 0 | $f_{p,d}\propto\exp(-\lVert z\rVert^p/p)$ satisfies (T) exactly for $p>1$; $\exp(-(1+r)\log(1+r))$ satisfies it only for $d=1$ | Proposed as new |
| Theorem 1 | Outside $\mathrm{int}\,C_H$: valid. Under (T), inside: (V) fails. (T) is necessary for the equivalence | Sufficiency elementary; halfspace case in Martin (2023); converse uses classical Laplace-transform growth plus a tail comparison |
| Corollaries 2, 3 | Valid at every false parameter iff $\mathrm{int}\,C_H\subseteq H$; for open or regular closed $H$, iff convex | Consequences |
| Theorem 4 | Four calibration regimes; Exact iff almost a halfspace through $\theta$ | Proposed as new as a classification |
| Corollary 5 | $H$ and $H^c$ both valid where false only for almost-halfspaces | Corrects Martin (2024, §3) in these models |
| Theorem 6 | Exact marginals at every $\theta$ iff $\phi=\psi(a^Tu)$ a.e., $\psi$ strictly increasing | Proposed as new |
| Theorem 7 | $\log\{F(t)/t\}/(p\log(1/t))^{(p-1)/p}\to-\rho$, signed distance to the hull boundary | Proposed as new |
| Theorem 8 | $f$ log-concave, $H^c\subseteq C$ closed convex, $Q_\theta(C)\leq s<1/2$ $\Rightarrow$ $P_\theta\{q_H(X)\geq1-s\}\geq1/2$ | Proposed as new |
| Proposition 9 | For $p\leq1$ hull position stops deciding; explicit constant at $p=1$, $d=1$ | Proposed as new |

## Technical account

**Validity outside the hull.** If $\theta\notin\mathrm{int}\,C_H$, a separating hyperplane puts $H$ almost everywhere inside a halfspace through $\theta$. That halfspace has an exactly uniform posterior probability, which dominates $q_H$.

**Failure inside the hull.** Normalise to $\theta=0$, $A=I$. If a ball $B(0,4c)$ lies in $C_H$, finitely many positive-measure pieces of $H$ cover every direction, in the sense that one lies ahead of each large observation by at least $2c$. So $q_H(x)\geq K\,g(\lVert x\rVert-b)$ with $b=c/2$. Small values of $q_H$ then force a large $\lVert X\rVert$, and $F(t)/t$ is bounded by a constant times $S(R)/g(R-b)$, which is where (T) enters. If (T) fails, a small two-ball hypothesis is dominated by the uniform variable $S(\lVert X-\theta\rVert)$, so the equivalence breaks.

**Two sides.** Since $q_{H^c}=1-q_H$, applying Theorem 1 to the complement controls high values of $q_H$. This produces the four regimes. Two disjoint nonempty open convex sets $\mathrm{int}\,C_H$ and $\mathrm{int}\,C_{H^c}$ can be separated, which gives Corollary 5.

**The finite-level theorem.** Let $w(x)=Q_x(C)$. Prékopa's theorem makes $w$ log-concave, so $\{w>s\}$ is convex. By (10) of the paper it excludes $\theta$, so a hyperplane through $\theta$ has it on one side, and central symmetry gives sampling probability at most one half. Off that set, $q_H\geq1-s$.

**Worked example.** For a disc $C$ of radius $R$ and isotropic Gaussian error, $Q_\theta(C)\leq Q_0(C)=1-e^{-R^2/(2\sigma^2)}$. At $\sigma/R=10$ this is $0.00499$, so every observation gives $P_c\leq0.01$.

## Evidence, assurance and limitations

The synthetic audio briefing is explanatory, not additional evidence. Its [complete transcript](/assets/audio/essential-hull-false-confidence.txt) is available for reading.

- **Proofs.** All results have written proofs in the 13-page paper. No proof assistant was used.
- **Checks.** Three deterministic scripts check worked numbers in floating point: 25 Gaussian cases, 24 exponential-power cases, the crossover $0.2865$, the constant $K$ of §7, the direction of the tail ratios, and Table 2 with a test of Theorem 8. They are sanity checks of formulas, not proofs.
- **Controls and replay.** From fresh copies, with and without Python's `-O` flag, the scripts reproduced their retained JSON exactly. Corrupting the constant $K$ or the maximum mass makes the checks exit non-zero, and changing the hypothesis makes the comparison with the retained record fail. GitHub CI reruns them on Linux.
- **Review.** Internal AI-assisted review only: reviewer roles, a separate-model adversarial review, a re-review and a proof audit, with no open correctness issue remaining. None of this is peer review or independent reproduction.
- **Limitations.** The model assumes known shape, an unrestricted Euclidean parameter and exact matching of sampling and posterior error laws. Unknown scale, informative priors and approximate posteriors are not covered. The hull can change with a tiny far-away speck of $H$, which changes $q_H$ very little, so the all-threshold verdict is fragile and Theorem 8 is a necessary companion.

## Relationship to earlier work

The sufficient direction is elementary. Halfspace validity is a special case of Martin (2023, Theorem 5), and Martin (2024, Proposition 1) gives the Gaussian dominance mechanism behind one row of the classification. In the Gaussian case the converse combines the classical growth of a Laplace transform along rays with a comparison to the sampling tail. At $p=2$, $q_H$ is the first-order confidence value of Efron and Tibshirani (1998), whose curvature analysis and the later work of Shimodaira and Fraser concern local expansions or particular functionals. The results here are exact for arbitrary measurable hypotheses in the stated models, at the cost of saying less about moderate thresholds. Searches on 1 and 4 November 2026 found no earlier statement of the claimed items. That is a record of what was found, not proof of priority.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Conjunction and risk analysts | See when a small computed probability cannot support "safe", with a finite warning level | Known covariance, exact model; real conjunctions have covariance error and non-Gaussian tails |
| Statisticians using fiducial or confidence distributions | A geometric test of which hypotheses can be favoured when false | All-threshold results may concern only low thresholds |
| Researchers on inferential models | An exact classification and a corrected conjecture | Location models only |
| Research agents | Agent index, machine-readable claims and replayable checks | Finite checks are not proofs |

## Why the problem matters

Additive probabilities are widely reported as if a high value supports a hypothesis. Knowing which hypotheses can be favoured when false, and at what level, tells an analyst when to replace a posterior probability with another assessment. The conjunction example shows the stakes: the reported number can be reassuring precisely because the data are poor.

## How to inspect or reproduce the recorded checks

From the GitHub release or the Zenodo archive, in a copy of the package root:

```sh
shasum -a 256 -c MANIFEST.sha256
python -m pip install -r requirements.txt    # numpy 2.3.5, scipy 1.17.0, matplotlib 3.10.8
cd code
python3 -I -B verify_examples.py
python3 -I -B verify_exponential_power.py
python3 -I -B verify_extensions.py
python3 -I -B make_figure.py
```

Repeat with `-I -B -O`, and compare the JSON with the shipped files. `AI_INDEX.md` maps each result to its section, and `CLAIMS.json` lists its hypotheses.

## The most valuable next projects

1. Extend the classification to the unknown-scale Gaussian case.
2. Find the analogue for group-invariant models with right-Haar posteriors.
3. Derive an exact crossover formula for convex sets.

## What is in the evidence package

The paper (PDF and Markdown source with its build script and `header.tex`); three check scripts with retained JSON; the figure code and figure; pinned `requirements.txt`; `refs.bib`; the dated record `audit/prior_art_record.md`; `CLAIMS.json`, `AI_INDEX.md`, `RESEARCH_GATES.json`, citation metadata, the CI workflow and `MANIFEST.sha256`. Text is CC0-1.0; code is MIT. This remains an unrefereed candidate.
