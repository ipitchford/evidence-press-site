## Summary

How long must you watch an evolving system before its starting state can be reconstructed? This paper studies an idealised mathematical version of that question: a normal operator describes the evolution, and a fixed collection of sensors supplies continuous observations.

The candidate theorem says that **if stable reconstruction is possible over one finite interval starting at time zero, it is possible over every shorter positive interval starting there too**. Longer finite intervals work as well. The result removes invertibility and reductivity assumptions from an earlier observation-window problem.

“Possible” does not mean equally reliable. The reconstruction can become extremely sensitive to noise as the interval shrinks. Nor can one simply wait before beginning: under the theorem's assumptions, a positively delayed interval works exactly when the operator has a bounded inverse. Early measurements can matter because some modes fade arbitrarily quickly.

This is an unrefereed, AI-assisted mathematical candidate, not a tested sensing system.

## Summary for specialists

Let $A$ be a bounded normal operator on a separable complex Hilbert space, with continuous powers defined by a fixed bounded Borel argument. For a finite or countable family $G=(g_j)$, set

$$Q_T(x)=\sum_j\int_0^T|\langle x,A^tg_j\rangle|^2\,dt.$$

If $m_{T_0}\|x\|^2\leq Q_{T_0}(x)\leq M_{T_0}\|x\|^2$ for some finite $T_0>0$, with $0<m_{T_0}\leq M_{T_0}<\infty$, then corresponding bounds exist for every finite $T>0$. Neither reductivity, a bounded inverse, nor the Bessel property of the unevolved observation family is assumed.

For $a,T>0$, the delayed form satisfies $Q_{[a,a+T]}(x)=Q_T((A^a)^*x)$. It is a frame precisely when $A$ is invertible. This corollary is an elementary consequence of the main theorem and spectral calculus, not a separate priority claim.

## Technical account

A lower frame bound prevents distinct initial states from producing almost indistinguishable observations relative to their distance. An upper bound controls the total observation energy. The proof must preserve a lower bound uniformly over all unit initial states; uniqueness for each state separately would not suffice.

The argument first uses the original lower bound to rule out a kernel. It then turns the integrated upper bound into uniform holomorphic observation bounds away from time zero. This is the main technical step: the logarithm of the operator may be unbounded, and instantaneous sensor energies need not satisfy a Bessel bound. An averaging multiplier supplies the necessary control.

A reflected holomorphic energy and Montel's theorem propagate small observations from a shorter interval to the original one. If shorter-window lower bounds failed, unit states would become invisible on the original interval too, contradicting its known lower bound.

The distinction between existence and conditioning is concrete. For $A=\operatorname{diag}(1,e^{-1})$ and one sensor $g=(1,1)$, the smallest Gramian eigenvalue behaves as $T^3/24$ near zero. The best left-inverse norm therefore grows like $\sqrt{24}\,T^{-3/2}$. A shorter observation is still theoretically sufficient, but noise is amplified more strongly.

## Evidence, assurance and limitations

The principal evidence is the manuscript's analytic proof. The accompanying Python checker verifies selected series coefficients by exact rational arithmetic and checks explicit examples; its floating-point integrations are illustrations, not a verification of the infinite-dimensional theorem. Internal checking and AI-assisted review are not external peer review, independent reproduction, or formal verification.

The result concerns the specified spectral interpolation of a normal operator. It is not a theorem about every strongly continuous evolution. It assumes complete time-dependent observations in the stated $L^2$ norm, not a finite sampling schedule. A finite sensor family cannot satisfy the premise on an infinite-dimensional space in this model. No universal numerical noise tolerance, discretisation guarantee, or uniform lower bound as $T$ approaches zero is supplied.

Finite windows, delayed windows, and the infinite horizon are different problems. The manuscript gives explicit examples separating them. The bounded literature search supports a precise comparison with the cited conjecture; it does not establish unrestricted historical priority.

## Relationship to earlier work

Aldroubi, Huang and Petrosyan proved a finite-window invariance theorem for invertible self-adjoint operators and proposed a normal-reductive extension. The present candidate establishes a stronger normal-operator statement without invertibility. The earlier proof already used analytic continuation and Montel's theorem: the claimed advance is the holomorphic observation estimate that handles an unbounded logarithm and a non-Bessel observation family.

The control-theory account by Díaz Martín, Medri and Molter provides a useful dictionary between dynamical frames and observability. Approximate observability means uniqueness, whereas the present claim requires a uniform initial-state norm bound. Results controlling the evolved final state also answer a different question.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Dynamical-sampling researchers | A candidate resolution extending the normal-reductive observation-window question. | Proof validity and historical priority need separate scrutiny. |
| Control and inverse-problems researchers | A sharp distinction between shortening an initial window and delaying it. | No practical conditioning or discrete-sensor guarantee follows automatically. |
| Mathematical reviewers and research agents | An explicit analytic mechanism and diagnostic examples to check or reuse. | Passing example checks does not certify the general theorem. |

## Why the problem matters

Some reconstruction problems have a minimum waiting time before enough information has arrived. This candidate identifies a setting where no positive minimum duration exists, provided observations begin immediately and the frame premise holds. At the same time, it explains why losing the earliest data can be fundamentally different from collecting less data overall.

That is a structural answer about recoverability. Designing a useful measurement system still requires quantitative bounds, a noise model, and a realistic account of which measurements can actually be taken.

## How to inspect or reproduce the recorded checks

Start with Theorem 2.1 and the proof roadmap in the manuscript. Check the positive-time holomorphic estimate before the propagation lemma; these are the load-bearing steps. Section 6 gives explicit noninvertible, nonreductive, ill-conditioned and delayed-window examples.

The package includes `verify_normal_frames.py` and `test_verification.py`. Follow its README to run the checks from a clean extraction and compare the recorded outputs. Distinguish the exact series checks from the floating-point illustrations, and inspect the proof separately: the code does not quantify over arbitrary Hilbert spaces or operators.

## The most valuable next projects

The most useful next step is independent specialist scrutiny of the holomorphic estimate and its relationship to earlier exact-observability results with unbounded observations. Quantitative lower bounds under explicit spectral and sensor assumptions would make the existence theorem more informative for reconstruction. A finite-sampling theorem would require additional hypotheses and should be treated as a separate problem, not an implicit consequence.

## What is in the evidence package

The package contains the standalone manuscript and source, explicit worked examples, verification scripts and recorded outputs, with a research index and provenance information. The canonical resource links identify the exact archived version. Explanatory artwork and the synthetic audio briefing communicate the result; neither adds mathematical evidence.
