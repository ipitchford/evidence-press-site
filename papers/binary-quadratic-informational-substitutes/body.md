## Plain-English summary

Two yes-or-no signals can be useful together without behaving well under every partial disclosure. This candidate gives an exact way to tell the difference: **four inequalities**, calculated from the joint probability table, settle a specified diminishing-returns property under quadratic scoring.

## Who should read this?

This page is for readers interested in forecasting, information economics and exact decision criteria. Read the plain-language explanation first; the technical section gives the formulas, and the package map leads to the full proof and executable checks.

## The problem

Imagine that one forecaster releases a randomised summary of a private signal. How much extra value does the second forecaster's complete signal provide? The property studied here requires that this extra value be at least as large as it would be after completely revealing the first signal. The requirement applies in both orders and to every admissible randomised disclosure.

“Value” has a precise meaning: the expected square of the posterior probability of the event. It is not money, accuracy on a particular dataset, or every possible decision-maker's utility. The exact target is Chen–Waggoner's March 2017 Definition 2.2.3, not arbitrary-pair submodularity over the full continuous information lattice.

## What the result says

For a binary event and two binary signals, two endpoint tests in each order are necessary and sufficient. Zero-probability cells are included. When an exact rational input fails, the package returns a two-report disclosure and its negative expected-score gap, which can be checked directly from the raw probability masses.

A one-direction extension permits a finite second signal and square-integrable targets. It does **not** supply a full two-sided classification when both signals have arbitrary finite alphabets. An appendix treats the reverse, strong-complements condition with endpoint and, when needed, interior-vertex tests.

## Why it matters

The result replaces an optimisation over potentially infinitely many disclosures with a finite exact decision for this model. It also exposes a trap: passing the whole-signal comparison, or a weaker projective-substitutes test, is not enough. A partial disclosure can reveal the failure.

This is a reusable mathematical diagnostic for specified probability tables. Applying it to noisy, estimated probabilities would need an additional uncertainty analysis; no improvement to empirical forecasting has been demonstrated here.

## How the argument works

Condition on the posterior probability of the first signal after its disclosure. A conditional-variance identity expresses the score gap as an average of a residual curve, multiplied by a nonnegative factor. The residual is concave, so its endpoint values decide nonnegativity across the entire interval. Exchanging the signals gives the other two tests.

The banner depicts that endpoint mechanism schematically. It is not experimental data or an additional certificate.

## Exact classification

Let $r_{ib}=\Pr(B=b\mid A=i)$, let $D_A$ be the difference between the event's conditional means in the two $A$ rows, and let $d_b$ be the corresponding difference after also conditioning on $B=b$. On cells shared by the two rows, define

$$M_{Ai}=D_A^2-\sum_{b\in\mathrm{overlap}}r_{ib}d_b^2.$$

For nonconstant $A$, the oriented condition holds exactly when $M_{A0}\ge0$ and $M_{A1}\ge0$. Apply the same calculation with $A$ and $B$ exchanged. A constant source is handled separately, without undefined conditional probabilities.

The proof's residual satisfies $H(0)=M_{A1}$ and $H(1)=M_{A0}$: **the endpoint order is reversed**. Proposition 4 proves that these strong conditions imply projective substitutes in this binary quadratic model. Its strict rational separator has $M_{A1}=-3/256$ but passes all 32 projective comparisons; the displayed counter-disclosure has score gap $-323/8458240$.

## Checks and limitations

The universal claim rests on the written proof. Internal exact checks cover algebraic identities, all 255 nonempty support patterns on a finite count grid, direct disclosure scores and 9,236 recorded failure witnesses. The 6,560 count vectors include repeated normalised distributions; they are not 6,560 distinct models or a prevalence sample.

Publication revisions add exact appendix/projective identities on 12,800 nonconstant orientations, all 32 projective comparisons for the separator, and rejection tests for invalid inputs and forged witnesses. Normal and optimized Python runs retain the checks. These are internal checks, not external reproduction or proof-assistant formalisation. The supplied review recommended minor revisions; its author's identity and independence are not established.

## Good next projects

Researchers can test the criterion on their own exact tables, scrutinise the proof's disclosure quantifiers, or independently replay the package. Extending the two-sided result beyond binary signals or treating uncertainty in estimated tables are distinct research projects, not completed parts of this release.

## Where to inspect and replay the evidence package

* **Manuscript:** complete definitions, proofs, worked examples and complements appendix.
* **Exact checker:** rational margins and direct-score counter-disclosures; binary floats are rejected.
* **Replay tools:** finite algebra, support and separately implemented checks, with explicit failure handling under optimized Python.
* **Review response and source comparison:** every adopted revision, including the reviewer-derived projective result, with prior-work boundaries.
* **AI index, manifest and licences:** navigable claims-to-evidence map and exact payload identities.

Start with `AI_INDEX.md` in the linked repository. The executable uses rational inputs; the theorem itself permits real probability tables.
