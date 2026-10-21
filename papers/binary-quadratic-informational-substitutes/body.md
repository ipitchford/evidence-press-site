## Summary

**The question.** Imagine two forecasters, each holding a private yes-or-no signal about the same uncertain event. One of them releases a randomised summary of their signal. How much extra value does the other forecaster's complete signal still provide? The *strong informational substitutes* property studied here is a diminishing-returns requirement: the extra value of the second signal after a partial disclosure must be at least as large as it would be after completely revealing the first signal. It applies in both orders and to every admissible randomised disclosure. Questions of this kind arise in forecasting and information economics.

**The difficulty.** Two signals can be useful together without behaving well under every partial disclosure, and there are infinitely many possible partial disclosures to check.

**What was found.** For a binary event and two binary signals under quadratic scoring, this candidate gives an exact way to tell the difference: **four inequalities**, calculated from the joint probability table, settle the property. Zero-probability cells are included. When an exact rational input fails, the package returns a two-report disclosure and its negative expected-score gap, which can be checked directly from the raw probability masses.

**Status.** An unrefereed Evidence Press candidate, developed with AI assistance. The universal claim rests on an informal analytic proof; the exact programs provide algebraic and finite verification evidence. No proof-assistant formalisation or external human peer review is claimed.

## Summary for specialists

“Value” has a precise meaning: the expected square of the posterior probability of the event. It is not money, accuracy on a particular dataset, or every possible decision-maker's utility. The exact target is Chen–Waggoner's March 2017 Definition 2.2.3, not arbitrary-pair submodularity over the full continuous information lattice. One signal is partially disclosed, and the other is observed whole; the comparison is against full revelation of the first signal.

**Exact classification.** Let $r_{ib}=\Pr(B=b\mid A=i)$, let $D_A$ be the difference between the event's conditional means in the two $A$ rows, and let $d_b$ be the corresponding difference after also conditioning on $B=b$. On cells shared by the two rows, define

$$
M_{Ai}=D_A^2-\sum_{b\in\mathrm{overlap}}r_{ib}d_b^2.
$$

For nonconstant $A$, the oriented condition holds exactly when $M_{A0}\ge0$ and $M_{A1}\ge0$. Apply the same calculation with $A$ and $B$ exchanged. A constant source is handled separately, without undefined conditional probabilities. For a binary event and two binary signals, these two endpoint tests in each order are necessary and sufficient.

**Further results.**

- *Projective substitutes.* Proposition 4 proves that these strong conditions imply projective substitutes in this binary quadratic model. The converse fails: its strict rational separator has $M_{A1}=-3/256$ but passes all 32 projective comparisons; the displayed counter-disclosure has score gap $-323/8458240$.
- *One-direction extension.* The main proof extends in one direction to a binary source and a finite second signal, and to square-integrable real or finite-dimensional vector targets under quadratic loss. It does **not** supply a full two-sided classification when both signals have arbitrary finite alphabets.
- *Complements.* An appendix treats the reverse, strong-complements condition with endpoint and, when needed, interior-vertex tests.

The broader programme for arbitrary scoring rules, arbitrarily many signals, or arbitrary pairs of partial disclosures is not claimed solved.

## Technical account

Condition on the posterior probability of the first signal after its disclosure. A conditional-variance identity expresses the score gap as an average of a residual curve, multiplied by a nonnegative factor. The residual is concave, so its endpoint values decide nonnegativity across the entire interval. Exchanging the signals gives the other two tests.

One detail is easy to get wrong: the proof's residual satisfies $H(0)=M_{A1}$ and $H(1)=M_{A0}$, so **the endpoint order is reversed** relative to the row labels.

The banner depicts that endpoint mechanism schematically. It is not experimental data or an additional certificate.

## Evidence, assurance and limitations

The universal claim rests on the written proof. Internal exact checks cover algebraic identities, all 255 nonempty support patterns on a finite count grid, direct disclosure scores and 9,236 recorded failure witnesses. The 6,560 count vectors include repeated normalised distributions; they are not 6,560 distinct models or a prevalence sample.

Publication revisions add exact appendix/projective identities on 12,800 nonconstant orientations, all 32 projective comparisons for the separator, and rejection tests for invalid inputs and forged witnesses. Normal and optimized Python runs retain the checks. A separately written implementation, which does not import the main classifier, repeats direct channel comparisons and posterior identities. No theorem depends on a solver returning UNSAT or on a numerical tolerance.

These are internal checks, not external reproduction or proof-assistant formalisation. The supplied review recommended minor revisions; its author's identity and independence are not established. The audit records an early sign error in an optional polynomial formula and its correction before release; the main weighted-contrast theorem did not depend on that expression.

This is a reusable mathematical diagnostic for specified probability tables. Applying it to noisy, estimated probabilities would need an additional uncertainty analysis; no improvement to empirical forecasting has been demonstrated here.

## Who should care, and why

This page is for readers interested in forecasting, information economics and exact decision criteria.

| Audience | Potential use | Required caution |
|---|---|---|
| Information-elicitation and forecasting theorists | A finite exact test for strong substitutes, and an explicit counter-disclosure whenever it fails | The classification is for a binary event, two binary signals and quadratic scoring only |
| Researchers working with specified probability tables | Run the exact checker on their own rational tables | Estimated or noisy tables need a separate uncertainty analysis |
| Readers of the substitutes literature | A strict separator showing projective substitutes do not imply strong substitutes in this model | The comparison concerns the exact Chen–Waggoner definition, not other variants |

## Why the problem matters

The result replaces an optimisation over potentially infinitely many disclosures with a finite exact decision for this model. It also exposes a trap: passing the whole-signal comparison, or a weaker projective-substitutes test, is not enough. A partial disclosure can reveal the failure.

The formulation follows Chen and Waggoner (2017); the generic disclosure-alphabet reduction follows Kong and Schoenebeck (2018), and posterior optimisation was developed in Anunrojwong et al. (2019/2020). These are credited as prior machinery. The recorded search did not locate the present weighted-contrast endpoint criterion. That is a bounded finding, not proof of historical priority, and no claim of a first-ever result is made.

## How to inspect or reproduce the recorded checks

Start with `AI_INDEX.md` in the linked repository, then the manuscript PDF and `VERIFICATION.md`. The decision tools use exact rational inputs and the Python standard library only. From the package root:

```sh
python3 code/exact_checker.py examples/weak_not_strong.json   # four margins and failure disclosures
python3 code/complements.py examples/weak_not_strong.json     # complements certificates
python3 code/check_integrity.py
python3 code/run_all.py --out replay                          # full replay, under a minute
```

An input file lists the eight probabilities of the $(E,X,Y)$ table in lexicographic order as integers or rational strings; in the code, the paper's $A$ and $B$ are labelled `X` and `Y`. Floating-point inputs are rejected so that a tolerance cannot silently change the answer. The executable uses rational inputs; the theorem itself permits real probability tables. `run_all.py` copies the checks to a temporary directory, compares stable result fields with the frozen records and leaves the recorded evidence unchanged.

## The most valuable next projects

Researchers can test the criterion on their own exact tables, scrutinise the proof's disclosure quantifiers, or independently replay the package. Extending the two-sided result beyond binary signals or treating uncertainty in estimated tables are distinct research projects, not completed parts of this release.

## What is in the evidence package

* **Manuscript:** complete definitions, proofs, worked examples and complements appendix.
* **Exact checker:** rational margins and direct-score counter-disclosures; binary floats are rejected.
* **Replay tools:** finite algebra, support and separately implemented checks, with explicit failure handling under optimized Python.
* **Review response and source comparison:** every adopted revision, including the reviewer-derived projective result, with prior-work boundaries.
* **AI index, manifest and licences:** navigable claims-to-evidence map and exact payload identities.
