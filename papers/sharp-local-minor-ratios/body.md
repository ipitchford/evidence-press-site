## Summary

Total positivity asks that every square submatrix of a matrix have a positive determinant. Can information from small pieces force that global property? This candidate gives a quantitative answer: certain ratios of small minors must exceed a precise threshold. It also constructs counterexamples showing why that threshold cannot be lowered.

The result is a complete written proof candidate for an explicitly specified condition. It remains unrefereed, and identity with an earlier, undisplayed workshop condition is not claimed.

## Summary for specialists

For a real \(n\times n\) matrix and \(1\le k<n\), assume all minors of orders at most \(k\) are positive. For each pair of increasing \((k+1)\)-element index sets, write \(I=P\cup\{i,i'\}\), \(J=Q\cup\{j,j'\}\), with \(P,Q\) the first \(k-1\) indices. Impose

\[
\frac{\Delta(Pi,Qj)\Delta(Pi',Qj')}{\Delta(Pi,Qj')\Delta(Pi',Qj)}>
4\cos^2\frac{\pi}{n-k+2}.
\]

The candidate proves total positivity and sharpness for this normalized family. Every smaller threshold admits a matrix with every proper minor positive and negative full determinant. For each fixed \(k\), the optimal dimension-independent threshold is 4.

## Technical account

Sufficiency combines the classical Katkova–Vishnyakova determinant theorem with Sylvester’s bordered-minor identity. The new proof task is to transfer sharpness through every local test at once, not merely through one selected Schur complement.

The construction adds a row and column of ones and a scale-separated perturbation of the remaining block. For every selected minor, one cofactor becomes the unique dominant term. Its coefficient is a smaller minor of the starting matrix. The leading row and column factors cancel in each local ratio. Finitely many strict margins then allow one finite scale preserving every required inequality simultaneously.

Small positive perturbations of tridiagonal matrices supply sharp starting examples. Repeated finite lifts reach arbitrary matrix size and minor order. A generalized Vandermonde family establishes nonvacuity analytically. A separate relative-error bound concerns already certified minor data, not numerical conditioning of computing those minors.

## Evidence, assurance and limitations

The package contains a five-page manuscript, source, exact rational diagnostics, symbolic leading-coefficient checks and a correction regression. Ten general examples, 53 symbolic identities and five invalid-certificate controls passed normal and optimized producer replay. The reviewer’s explicit matrix was checked separately: all 69 minors are positive, while a local ratio of \(9/5\) distinguishes the size-adaptive condition from the stronger common threshold of 2.

Five differentiated internal AI reviewers recommended acceptance with no blocking findings. This is not unaffiliated specialist refereeing. Finite checks do not prove the arbitrary-dimensional theorem, and publication does not establish historical priority or practical computational speed.

## Relationship to earlier work

The scalar threshold and Sylvester’s identity are established inputs. Exterior bordering in Fallat–Johnson–Sokal provides relevant context, but retaining a bad matrix as a proper submatrix cannot yield a parent with every proper minor positive. Here the starting matrix appears through a Schur complement, while the full ratio family transfers simultaneously.

Gasca–Mühlbach’s earlier generalized Schur-complement tests remain relevant to priority: only the abstract was inspected in this audit. AIM Problem 1.65 reports an earlier sufficient condition without displaying it, so equivalence with that condition is unresolved.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Matrix theorists | Inspect a sharp lower-order minor criterion and reusable lifting construction. | The proof awaits unaffiliated scrutiny. |
| Exact-computation researchers | Reconstruct and test the simultaneous constraints. | Finite replay is not an all-dimensional certificate. |
| Numerical analysts | Explore certified uncertainty bounds on minor data. | No conditioning or faster algorithm is established. |

## Why the problem matters

The question connects local determinant information with a global sign property. Sharpness identifies precisely how strong this particular local condition must be, rather than only providing a convenient sufficient bound.

## How to inspect or reproduce the recorded checks

Download the versioned ZIP or check out the release tag. Install Python 3 and the pinned `sympy==1.14.0` dependency. Run `python3 verify_manifest.py`, `python3 verify_general.py` and `python3 verify_review.py`; each should report a pass. The README includes the older supporting diagnostics and optimized-mode replay commands.

## The most valuable next projects

- Independently reconstruct the all-minors asymptotic argument and simultaneous ratio transfer.
- Reimplement the finite checks directly from the mathematical definitions.
- Obtain the earlier workshop formula and complete the comparison with Schur-complement literature.
- Study economical sufficient subfamilies or numerically stable certification, without assuming this criterion is algorithmically optimal.

## What is in the evidence package

The release provides PDF and Markdown/TeX source, structured claims, exact code and results, replay and review records, component licences, a SHA-256 manifest, the frozen internal-review target and matching GitHub/Zenodo assets. Historical notes remain explicitly subordinate to the consolidated solution.
