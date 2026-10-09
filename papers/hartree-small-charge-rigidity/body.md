## Summary

Which container shape best balances a quantum state's tendency to stay smooth against its density's tendency to repel itself? In the model studied here, the container has a fixed volume. This candidate says that **a ball remains the unique optimum when the repulsion is sufficiently weak**.

Earlier work already put every minimiser close to a ball. The remaining question was whether a small deformation could still improve the energy. The manuscript's global-to-local argument rules that out, subject to its stated analytic assumptions and imported theorem. This is an unrefereed written proof candidate, not a numerical discovery claim.

## Summary for specialists

In dimension three, prescribe $|\Omega|=4\pi/3$. Minimise over $u\in H^1_0(\Omega)$ with $\|u\|_2=1$:

$$E_q(\Omega)=\inf_u\left[T(u)+\frac q2D(u^2,u^2)\right],$$

where $T(u)=\int |\nabla u|^2$ and the Coulomb term is

$$D(u^2,u^2)=\iint\frac{u(x)^2u(y)^2}{|x-y|}\,dx\,dy.$$

Theorem 1.1 asserts that there exists a single $q_0>0$ such that, for every $0<q<q_0$, the unit ball minimises this energy among all admissible prescribed-volume competitors. Equality means a translated ball up to zero $H^1$ capacity for quasi-open domains. In the measurable support relaxation, equality is up to null measure. No boundedness, connectedness, smoothness or near-ball assumption is imposed on all competitors.

The theorem concerns the **quartic** Coulomb interaction $D(u^2,u^2)$, not a quadratic interaction in $u$. Its small-charge threshold is not numerically specified.

## Technical account

Mazzoleni–Muratov–Ruffini's global theorem supplies existence and nearsphericity of all minimisers. Tail compactness and strict dilation handle the global admissible class. A fixed-exponent Hölder entrance argument then places the minimisers in the topology required by the local analysis.

Locally, the manuscript selects the actual minimising state branch rather than merely a nearby critical state. Shape differentiation yields the constant boundary-flux condition. The projected linearised flux map removes translation modes and incorporates the volume constraint. All-mode nondegeneracy and a full Hölder-space inverse permit an implicit-function argument: the ball branch is the only nearby optimal branch.

The banner is a schematic of these logical steps, not a trajectory of a physical shape or computed sample data. The capacity-level equality proof treats both inclusions separately; equality of volume alone would not justify it.

## Evidence, assurance and limitations

The universal claim rests on the written proof and its cited global and elliptic dependencies. The supplied review recommended minor revisions. Publication revisions clarified the exact elliptic estimates, established the equivalence of the relevant zero-capacity conventions, tightened branch-selection cross-references and distinguished established implicit-function machinery from this application.

Automated checks verify the frozen package's hashes and sizes, elementary expansion/scaling identities, normalisation and a mode-sign sanity check. They run normally and under optimized Python, including a deliberately wrong-sign rejection. **They do not verify the analytic proof.** The supplied reviewer identity and external independence are not established. No specialist peer review, independent reproduction or proof-assistant verification is claimed.

There is no explicit maximal charge, quantitative energy deficit, strong-charge shape classification or theorem for the different quadratic interaction. A conservative prospective rating in the supplied review is not an official assessment or an assurance badge.

## Relationship to earlier work

The central dependency is Mazzoleni–Muratov–Ruffini (2025), Theorem 1.2; its Remark 1.3 motivates exact small-charge rigidity. Cavallina's work supplies relevant general critical-domain machinery, but applying it requires the explicit state, topology and inverse checks made here. The 2026 large-charge nonexistence result concerns a different parameter regime.

Ruffini's 8 September 2026 conference abstract mentions rigidity. It does not provide a precise theorem or proof for this comparison. The release therefore makes **no settled historical-priority claim**. The source audit records the overlap rather than treating a bounded literature search as proof of novelty.

## Who should care, and why

| Audience | Potential use | Required caution |
| --- | --- | --- |
| Shape-optimisation researchers | Inspect a route from global nearsphericity to exact uniqueness. | The imported global theorem and fixed local topology are load-bearing. |
| Nonlinear spectral analysts | Reuse the state-branch and boundary-flux analysis. | The result is specific to this quartic Hartree functional. |
| Mathematical physicists | Understand a weak-repulsion symmetry regime. | No numerical threshold or empirical device prediction is supplied. |

## Why the problem matters

Being nearly spherical does not imply being spherical. Small perturbations can preserve an energy advantage that disappears only in a limit. An exact uniqueness theorem must eliminate those perturbations uniformly, not merely show that a sequence approaches a ball. This candidate provides that stronger conclusion for the stated weak-interaction model.

## How to inspect or reproduce the recorded checks

Start with `AI_INDEX.md`, then Theorem 1.1 and Sections 2–4 of the manuscript. Follow the global dependency, state-branch selection, Hölder inverse and both capacity inclusions. `REVIEW_RESPONSE.md` maps the supplied review to the final changes; `CITATION_AUDIT.md` records source relationships and uncertainty.

From a fresh package extraction, run `python3 code/check_package.py` and `python3 -O code/check_package.py`. Rebuild `paper.tex` with two pdfLaTeX passes. These reproduce the package and finite sanity checks, not an automated universal theorem certificate.

## The most valuable next projects

First, obtain a precise comparison with the conference work and specialist scrutiny of the global-to-local proof. Quantitative thresholds or stability deficits would require additional analysis. They are useful future questions, not missing conclusions silently covered by this release.

## What is in the evidence package

The archive contains the standalone manuscript source and PDF, claim map, source audit, review response, assurance boundaries, elementary checker, environment record, component licences, manifest and substantive AI index. The older analytic audit is explicitly retained as an input-version record; it is not relabelled as an independent final review.
