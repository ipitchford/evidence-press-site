## Summary in plain English

An optimization method can be good at shrinking the quantity it watches while making slower progress on the quantity we actually care about. This paper demonstrates that distinction for a familiar family of gradient methods applied to positive-definite quadratic problems.

The methods choose their step using a weighted gradient. The paper measures the ordinary objective gap: how far the current function value lies above its minimum. Those are different yardsticks.

A three-variable example makes the difference concrete. After two steps of standard minimal-gradient descent, about **93.61% of the initial objective gap remains**. A proposed two-step application of the steepest-descent rate would allow at most **92.31%**. Exact fractions, rather than rounded decimals, establish the violation.

The main result goes beyond that example. It identifies the sharp leading worst-case objective decrease at a fixed iteration horizon as the condition number grows, and controls longer horizons for power weights.

This is an **AI-assisted, unrefereed mathematical candidate**. It studies established algorithms; it does not introduce a new optimizer or refute the originating paper's proved convergence results.

## Summary for specialists

For $A=A^T\succ0$, let
$$
f(x)=\tfrac12x^TAx-b^Tx,\qquad E_j=f(x_j)-f(x_*).
$$
The update is
$$
x_{j+1}=x_j-\omega\alpha_jg_j,\qquad g_j=Ax_j-b,
$$
with
$$
\alpha_j=\frac{g_j^T\Psi(A)g_j}{g_j^TA\Psi(A)g_j}.
$$

Normalize $\lambda_{\min}(A)=1$ and $\lambda_{\max}(A)=\kappa$. For a general nonhomogeneous weight, this spectral scale is part of the statement. If $\Psi$ is fixed, positive, nondecreasing and unbounded, then for every fixed integer $K\ge1$ and $0<\omega\le1$, the worst-case objective ratio satisfies
$$
\lim_{\kappa\to\infty}\kappa
[1-\mathcal W_{\Psi,\omega,K}(\kappa)]=2\omega K.
$$
Three dimensions suffice; two suffice when $\omega<1$.

For power weights $\Psi(\lambda)=\lambda^{2\ell}$, fixed $\ell>0$ and $\omega=1$, the coefficient remains sharp for every integer-valued $K=o(\log\kappa)$. A separate family gives simultaneous violation of the per-iteration Kantorovich bound for all
$$
1\le K\le\theta\log\kappa,\qquad
0<\theta<\frac{2\ell}{\log9},
$$
once $\kappa$ is sufficiently large. One instance at each condition number works throughout this interval.

## Technical account

### Which two-step claim fails?

Write
$$
C_\kappa=\left(\frac{\kappa-1}{\kappa+1}\right)^2.
$$
Two readings of a recent prose question have different answers. For unrelaxed monotone weights, one factor over two steps is valid:
$$
E_{j+2}\le C_\kappa E_j.
$$
Two factors over the same two steps need not be:
$$
E_{j+2}\le C_\kappa^2E_j.
$$

The explicit minimal-gradient counterexample uses
$$
A=\operatorname{diag}(1,60,100),\qquad
x_0=(1,1/100,1/250),\qquad b=0.
$$
Its exact objective ratio is
$$
\frac{E_2}{E_0}
=\frac{830774224427957654527687}
{887449697831729589460572}
\approx0.93613669.
$$
This exceeds $(99/101)^4\approx0.92311388$. The paper supplies the exact positive difference. A second rational example has condition number ten.

### Why three modes?

A small high-frequency component can dominate the weighted step calculation while contributing little ordinary objective energy. Two high modes keep the step short; a low mode retains most of the objective gap.

With only two active eigenvalues and no relaxation, the weighted spectral ratio is inverted at each step. Two consecutive updates therefore multiply both error components by the same scalar, which enforces the stronger two-step bound. Three active eigenvalues are the smallest support permitting this unrelaxed failure.

The underlying weighted-gradient family and two-mode dynamics are classical. The new contribution claimed here is the objective-specific transient construction and its quantitative control.

### What does “finite horizon” mean?

The fixed-horizon theorem holds the number of steps fixed while the condition number increases. The growing-horizon theorem allows a prescribed sublogarithmic number of steps, with the constructed instance depending on that horizon. The simultaneous-interval result is stronger in a different direction: one instance works at every time in its stated interval.

None fixes one matrix and then follows it indefinitely. These conclusions therefore coexist with established fixed-matrix asymptotic convergence.

Lemma 6 supplies an explicit finite-parameter error estimate. The paper also rearranges its hypothesis into a usable horizon test and derives a sufficient strict-failure test. Neither condition is claimed necessary or optimal.

## Evidence, assurance and limitations

The universal results rest on written proofs. Producer-side checking reproduces three rational examples, 80 two-mode cases and 324 exact recurrence comparisons. A separate Decimal grid checks 195 admissible parameter combinations; 125 combinations are excluded by the lemma's hypothesis, not counted as passes.

The grid is a numerical diagnostic, not certified interval arithmetic. Sixteen deliberate corruptions test named scientific guards in normal and optimized Python execution. This improves executable assurance without converting finite checks into a proof of the asymptotic theorems.

No external human peer review, independent external reproduction or proof-assistant formalisation is claimed.

The paper does not identify the exact worst-case ratio at every finite condition number, a sharp logarithmic crossover, or a lower bound for arbitrary optimization algorithms. The moving-horizon results are restricted to positive power weights without relaxation. A factor-two difference in a transient coefficient does **not** imply twice as many iterations to attain a fixed accuracy.

## Relationship to earlier work

MacDonald, Murray and Tappenden's published Section 6 asks a two-step question in prose. This paper separates its two precise readings rather than treating either as a previously proved theorem.

Pronzato, Wynn and Zhigljavsky, and Huang and collaborators, establish weighted-gradient and fixed-matrix asymptotic structure. He's GMRES(1) analysis concerns residual and root-convergence factors. The later MacDonald–Murray–Tappenden flexible framework includes multiple search directions and symmetric preconditioning, with guarantees in a selected weighted gradient norm.

Those distinctions matter: ordinary objective error, weighted gradient error, and fixed-matrix long-time rates are not interchangeable. The package's source comparison gives the inspected versions and exact passages. Its bounded search found no matching full transient result, but cannot guarantee historical priority.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Optimization theorists | Test objective-rate claims against a sharp transient obstruction | This is a particular algorithm family, not an arbitrary-method lower bound |
| Numerical linear algebra researchers | Use small rational matrices to distinguish residual and objective performance | Exact arithmetic examples do not assess floating-point stability |
| Researchers comparing gradient variants | Separate finite-horizon behavior from long-time spectral limits | The result does not establish fixed-accuracy iteration counts |

## Why the problem matters

A convergence guarantee is only useful when its error metric and order of limits match the question being asked. Here, three dimensions expose a gap that two-mode tests cannot reveal. The result supplies both a simple exact counterexample and a sharp description of a broader transient regime.

## How to inspect or reproduce the recorded checks

Start with the paper's metric/regime table and Section 6's exact examples. Theorem 3 gives the fixed-horizon result; Lemma 6 and its following finite-parameter test explain the quantitative control; Theorem 7 and Corollary 8 handle growing horizons.

Read the package's verification record before running the standard-library checkers. The exact-example, horizon-grid and intended-failure scripts require a fresh output path. Compare exact fractions separately from Decimal diagnostics. Repeatability of these finite checks does not establish the universal theorem or external independence.

## The most valuable next projects

A sharp transition when the horizon is comparable to $\log\kappa$ would clarify how the transient joins the established long-time picture. Over-relaxation and bounded spectral weights require separate analysis. Merely collecting more examples of the existing failure would chiefly strengthen assurance rather than resolve those questions.

## What is in the evidence package

The package includes the self-contained paper in PDF, LaTeX and accessible Markdown, the exact examples and checkers, a claim-to-proof reading guide, source comparison, limitations, licence map and substantive revision response. Private editorial assessments are not required to understand or reproduce the public argument.
