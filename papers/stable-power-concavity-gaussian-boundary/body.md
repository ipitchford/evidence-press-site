## Summary

A probability curve can look almost Gaussian across every fixed window and still behave differently far out in its tails. This candidate quantifies that difference for symmetric stable distributions: the best global power-concavity constraint gets arbitrarily weaker as the Gaussian is approached, although the Gaussian itself is log-concave.

The result also excludes a proposed density exponent throughout the non-Gaussian family except at the Cauchy distribution. This is an unrefereed mathematical candidate, with written proofs and a separate finite interval certificate.

## Summary for specialists

For the density $f_\alpha$ with characteristic function $e^{-|t|^\alpha}$, define $R_\alpha=f_\alpha f_\alpha''/(f_\alpha')^2$ on the positive half-line. The sharp nonpositive density exponent is $s_\alpha^\star=1-\sup R_\alpha$. The manuscript proves

$$s_{2-\epsilon}^\star\sim-\frac16\log(1/\epsilon),\qquad \epsilon\downarrow0,$$

whereas $s_2^\star=0$. It also proves $s_\alpha^\star<-1/(1+\alpha)$ for $0<\alpha<2$, $\alpha\ne1$, with $s_1^\star=-1/2$. At the rational point $\alpha=1999/1000$, $x=15/2$, an Arb calculation certifies $12/5<R_\alpha(x)<5/2$, excluding every density exponent in $[-1,0]$.

## Technical account

The qualitative existence argument, already present in the retained catalogue research, reduces the question to boundedness of a curvature ratio. It is included with attribution, together with negative curvature at the unique mode.

The quantitative argument rotates the Fourier integral and obtains a Gaussian-plus-algebraic-tail estimate with a remainder uniform in both position and stability index. The moving lower-bound point balances the two first-derivative contributions, not the two densities. Compact, transition and remote-tail estimates then bound the entire curvature supremum and identify the constant $1/6$.

Separately, the next term of the differentiated tail expansion has the sign needed to make the limiting tail exponent strictly unattainable, except at Cauchy. The finite certificate uses a Taylor polynomial with an explicit absolute integral remainder; exploratory quadrature is not proof evidence.

## Evidence, assurance and limitations

Theorems 1–3 rest on the written analytic argument. The interval certificate establishes only the stated pointwise inequality. Producer checks cover fresh extraction, two precision/truncation choices, optimized Python, deliberately insufficient truncation and false-claim controls. Five producer-coordinated AI roles reviewed the frozen package; supporting-record corrections were checked afterwards.

External specialist review, unaffiliated reproduction, formal verification and historical priority are not established. There is no closed-form optimal exponent at every fixed index, no skew-stable classification, and no new statistical procedure. The supplied review reported symbolic and noninterval numerical checks; its linked implementation was unavailable and is not counted as established independent reimplementation.

## Relationship to earlier work

The strict tail theorem contradicts the density-concavity conjecture in Laha–Miao–Wellner, arXiv v2, §5, p.21. Their bi-concavity parameter constrains the distribution and survival functions; failure of the stronger density condition does not establish failure of those weaker constraints. The comparison is version-qualified, not a priority claim.

The finite witness also answers negatively the universal $(-1,0]$ density-membership question discussed by Doss–Wellner and contradicts the finite-dimensional threshold clause in the inspected Bobkov–Madiman preprint. Classical stable tail expansions remain prior ingredients.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Probability analysts | A uniform matching argument for a global shape functional near a singular endpoint. | The written argument awaits external scrutiny. |
| Shape-constrained statisticians | An obstruction to imposing a fixed density-concavity class across stable indices. | This does not invalidate weaker CDF constraints or supply a new estimator. |
| Reproduction researchers | A short interval certificate and deliberate false-claim controls. | Replaying one backend is not independent reconstruction. |

## Why the problem matters

Local convergence and global shape membership answer different questions. An increasingly distant tail region can determine the admissible global class even when every fixed window approaches a familiar limiting density. The sharp rate explains the size of that separation.

## How to inspect or reproduce the recorded checks

Read `SOLUTION.pdf`, then the source and assurance records. In a fresh extraction, install the pinned `python-flint==0.9.0` dependency and run `python verify.py`, `python semantic_controls.py` and `python -O semantic_controls.py`. The expected result is PASS, including required rejection of deliberately insufficient truncation and false claims.

Download `BUNDLE_REPLAY.json` alongside the final ZIP. It is a companion receipt that binds the complete archive hash; it is deliberately outside the archive to avoid self-reference. The archive's `SHA256SUMS` covers its payload files.

## The most valuable next projects

Unaffiliated proof scrutiny and independent interval reconstruction would strengthen assurance. Fixed-index sharp exponents, explicit onset bounds and weaker distribution-function constraints are distinct mathematical follow-ups. A broader later-literature audit is needed before any historical-priority assertion.

## What is in the evidence package

The release contains the nine-page PDF, Markdown and LaTeX sources, bibliography, exact cached AIM statement, source and novelty audits, code, interval outputs, fail-closed controls, review responses, five internal role reports, manifests and component licences. GitHub and Zenodo carry matching release assets, including the separate replay receipt and the frozen editorial submission.
