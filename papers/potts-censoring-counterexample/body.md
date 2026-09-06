## Summary

Can skipping an update leave a random system closer to equilibrium? For an important class of ordered models, a censoring theorem says no when the system starts at its top state. This unrefereed candidate shows that the analogous rule fails for a three-colour ferromagnetic Potts model started all one colour.

The example is small: five vertices, six edges, and nine scheduled opportunities. Omit one predetermined update and the final distribution is strictly closer to equilibrium. The difference is tiny but exactly positive. This is a counterexample to a universal finite-horizon rule—not evidence of a useful simulation speed-up.

## Summary for specialists

Take the zero-field three-state Potts model on edges $AB,AC,AD,BC,BE,DE$, with Gibbs weights $30^{M(\sigma)}$, where $M$ counts monochromatic edges. Start at $00000$. Compare the word $(C,E,B,C,B,A,E,B,E)$ with its subsequence obtained by deleting the seventh opportunity, at $E$.

Writing $\mu$ and $\nu$ for the full and censored final laws, respectively, the exact gap is

$$
\|\mu-\pi\|_{\mathrm{TV}}-\|\nu-\pi\|_{\mathrm{TV}}
=\frac{7905357280856578194954129502105}{766036711510586802141859485820665762204}>0.
$$

Both laws are compared with the full unconditioned Gibbs distribution at the same nine-opportunity horizon. Censorship is a fixed no-operation, not rejection based on realised colours.

## Technical account

Numerical search found the object; exact arithmetic supplies the evidence. Three producer-side implementations reconstruct the same result: direct conditional transitions, integer masses over Gibbs fibres, and explicit marginal formulas.

The short word leaves $D$ untouched. The final update at $E$ gives both evolving laws the same conditional factor as equilibrium. Summing out that factor reduces the proof from 243 states to 27 marginal entries. The stationary mass on $D=0$ is one third; it is not renormalised. The other two thirds are included in the distance calculation.

Every equilibrium-preserving update contracts each chain's own distance. What can reverse is the ordering between two different chains' distances after a common suffix. The extra update initially helps: the full-minus-censored gaps after opportunities seven, eight and nine are approximately $-1.04\times10^{-8}$, $-2.04\times10^{-6}$ and $+1.03\times10^{-8}$. Exact rational receipts retain all three comparisons.

## Evidence, assurance and limitations

The package supplies the complete finite argument, all final probabilities, marginal sign certificate, source code, negative controls and fresh-extraction replay. A longer activity-100 witness updates every vertex in both words and also has a strictly positive exact gap.

These are producer-coordinated checks. Internal AI editorial review, hosted CI, hashes and a DOI do not establish independent mathematical validation. Unaffiliated reproduction, formal verification, authenticated specialist review and journal peer review remain unestablished. Priority checking is targeted rather than exhaustive.

No smallest graph, shortest word, counterexample for every larger colour count, random-scan failure, high-temperature theorem, mixing-time improvement or practical benefit is claimed. The original AIM endpoint was inaccessible; its dataset transcription is substantively corroborated by Holroyd's primary paper.

## Relationship to earlier work

Peres and Winkler prove the positive censoring theorem for monotone systems. Holroyd gives different failures, including an antiferromagnetic Potts example, and asks about the ferromagnetic constant-start case. The present witness has positive ferromagnetic activity and a monochromatic start.

Fill and Kahn explain comparison orders preserved under suitable monotonicity assumptions. Shared equilibrium and reversible individual updates alone do not imply those orders. Recent mean-field systematic-scan cutoff results address asymptotic convergence on complete graphs, not this finite-word deletion question.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Probability and statistical-mechanics researchers | A compact obstruction to a universal Potts censoring extension. | Preserve the finite-word and initial-state assumptions. |
| Exact-computation researchers | Inspect the full-state to marginal proof interface. | Specialised checkers are not general input validators. |
| Sampling practitioners | Recognise the limit of “more updates must be better” comparisons. | The result supplies no practical scheduling recommendation or speed-up. |

## Why the problem matters

Censoring arguments let researchers simplify an update schedule while controlling convergence. Knowing where their hypotheses are essential prevents an attractive but invalid extension. A single exact positive gap has full logical force against a universal inequality, irrespective of its small decimal size.

## How to inspect or reproduce the recorded checks

Download and extract the versioned evidence ZIP. With Python 3.10 or later, run `python3 verify.py counterexample.json`, `python3 verify_integer.py`, `python3 verify_reduced.py`, and `python3 verify_supplement.py`. Then run `python3 test_verify.py` and `python3 -O test_verify.py`.

Exact replay requires only the standard library. NumPy is needed solely for optional discovery. The README describes each checker's scope; the manifest and receipts identify the retained files. PDF builds need the separately documented TeX toolchain.

## The most valuable next projects

- Obtain an unaffiliated reconstruction of the written reduction and exact arithmetic.
- Investigate smaller graphs or shorter schedules without treating this search as exhaustive.
- Determine explicit activity intervals and what happens for other colour counts.
- Identify structural conditions that prevent or allow the relative-distance reversal.

## What is in the evidence package

The GitHub release and Zenodo archive contain the formatted paper, accessible Markdown, graph, exact laws and certificates, three checkers and supplemental replay, tests, discovery provenance, source comparisons, review response, internal editorial reports and component licences. A separate frozen editorial submission preserves what the reviewers saw. Communication art, audio and the prepared YouTube thumbnail add no mathematical evidence.
