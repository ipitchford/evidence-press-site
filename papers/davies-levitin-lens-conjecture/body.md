## Summary

Take a chain of $2n$ sites. Every site carries the same value $c$, and each neighbouring pair is coupled with strength 1. Now give the left half of the chain weight $+1$ and the right half weight $-1$. The resulting eigenvalue problem, $H_c v = \lambda S v$, is a discrete model of *indefinite* eigenvalue problems, in which the weight changes sign. Such problems belong to the spectral theory of non-self-adjoint operators that arise in physics. Unlike an ordinary symmetric matrix problem, this one can have complex eigenvalues.

A classical theorem of Gershgorin puts every eigenvalue inside one of two disks of radius 2, centred at $c$ and at $-c$. In 2014 E. B. Davies and M. Levitin conjectured, from numerical evidence, something much stronger: every complex eigenvalue lies in **both** disks at once, in the lens-shaped region where they overlap. The conjecture was listed among the open problems of a 2015 American Institute of Mathematics workshop on non-self-adjoint operators in physics. Before this release it was proved only for chains of at most six sites ($n \le 3$) and for purely imaginary eigenvalues.

This release proves the conjecture for chains of every length and every real $c$.

The smallest case shows the shape of the statement. For $n = 1$ the eigenvalues solve $\lambda^2 = c^2 - 1$. When $|c| < 1$ they are $\pm i\sqrt{1-c^2}$, and both lie at distance exactly 1 from $c$ and from $-c$: inside the lens. Davies and Levitin proved that, for long chains, the complex eigenvalues crowd towards the real axis. In computations they also come close to the two ends of the lens on the real axis, $\pm(2-|c|)$, without reaching them. The cover image plots all 260 computed complex eigenvalues for $n = 1, \dots, 24$ at $c = 0.6$ against the exact disks.

**The decisive qualification:** this is an unrefereed candidate, produced by an AI research agent. The proof is written in full but relies on two short computer checks in rigorous interval arithmetic, and no human specialist has yet checked the argument.

## Summary for specialists

Let $H_c$ be the $2n \times 2n$ symmetric tridiagonal matrix with diagonal $c \in \mathbb R$ and off-diagonal entries 1, and let $S = \operatorname{diag}(1,\dots,1,-1,\dots,-1)$ with $n$ entries of each sign.

**Theorem 1.1.** For every $n \ge 1$ and every real $c$, every non-real eigenvalue $\lambda$ of $H_c - \lambda S$ satisfies $|\lambda - c| < 2$ and $|\lambda + c| < 2$. Consequently $|\operatorname{Re}\lambda| < 2 - |c|$.

This is Conjecture 5.3 of Davies and Levitin (Linear Algebra Appl. 448, 2014), AIM 2015 Problem 11.1 in its closed-disk form, and record 20002500 of the UnsolvedMath collection. Two consequences follow directly:

- Every non-real eigenvalue off the imaginary axis satisfies the hypothesis $0 < |\operatorname{Re}\lambda| < 2 - c$ of Davies–Levitin's Theorem 5.4, a hypothesis they chose so as to avoid Conjecture 5.3. Their asymptotic bound therefore applies to these eigenvalues in the sense stated there: asymptotic in $n$ and pointwise in $\operatorname{Re}\lambda$.
- Their localisation (50), $|\operatorname{Re}\lambda| \le 2 - c$, holds for every $n$ in the strict form $|\operatorname{Re}\lambda| < 2 - |c|$.

The theorem does not extend in the obvious ways. Remark 8.4 gives certified examples of non-real eigenvalues outside the lens in four nearby settings:

- a point-mass spectral measure, realised by a $4 \times 4$ pencil with end potentials;
- a symmetric two-point measure, realised by a $6 \times 6$ pencil with stronger end couplings;
- a balanced $14 \times 14$ pencil with one coupling weakened to $3/10$, whose Gershgorin disks still have radius at most 2;
- unbalanced pencils, with $m \ne n$ sites of each sign, for example $(m, n) = (1, 4)$ at $c = 1.397$.

A proof that uses only the Herglotz property, only symmetry of the measure, or only the Gershgorin radii therefore cannot work.

## Technical account

Put $x = (\lambda - c)/2$ and $y = (\lambda + c)/2$, so $\operatorname{Im} x = \operatorname{Im} y$. The characteristic equation is the known Chebyshev form
$$U_n(x)\,U_n(y) + U_{n-1}(x)\,U_{n-1}(y) = 0,$$
where $U_k$ are Chebyshev polynomials of the second kind. The lens statement is equivalent to $|x| < 1$ and $|y| < 1$. The matrix $SH_c$ is self-adjoint in the Krein space defined by $S$.

**Reduction.** Write $m_k = -U_{k-1}/U_k$. Christoffel–Darboux gives the imaginary-part identity $\operatorname{Im} m_k(\zeta) = \operatorname{Im}\zeta \cdot \Psi_k(\zeta)$, with $\Psi_k$ a positive sum over the zeros of $U_k$. The case $k = n-1$ is the function
$$\Psi(\zeta) = \sum_{j=1}^{n-1} \frac{w_j}{|\zeta - p_j|^2},$$
with $p_j = \cos(j\pi/n)$ and $w_j = \sin^2(j\pi/n)/n$. It is a sum of Lorentzians centred at the zeros of $U_{n-1}$. Suppose $|y| \ge 1$. Taking imaginary parts of the eigenvalue equation, written as $m_n(x) = U_n(y)/U_{n-1}(y)$, forces $\Psi(y) > \Psi(x)$ at the same height. This step uses a familiar mechanism: the eigenvalue condition equates Weyl-type functions of the two blocks, and their imaginary parts are compared. The whole conjecture therefore follows from one comparison, and that comparison is the paper's original contribution.

**Comparison lemma (Lemma 3.1).** If $\operatorname{Im} x = \operatorname{Im} y > 0$, $|U_n(x)| \le |U_{n-1}(x)|$ and $|y| \ge 1$, then $\Psi(x) \ge \Psi(y)$.

The lemma is proved by two one-sided bounds. On the $x$ side, write $x = \cos(\theta - is)$ with $K = 2n$. The admissibility condition becomes $\sinh s \, \sinh((K+1)s) \le \sin\theta$. This gives a lower bound on the height $h$ and the explicit lower bound $\Psi(x) \ge L_0(s)$ (Lemma 4.1). On the $y$ side, $\Psi(y)$ is at most $\Psi(1) = (n-1)(2n-1)/(3n)$. A second, height-dependent bound $\hat Y_n(h)$ comes from the values of $\Psi$ on the unit circle (Lemmas 5.1–5.4). What remains is a one-variable inequality in the scaled parameter $\tau = Ks$ (Proposition 6.2):

- **Region I** ($\tau \le 1$ for all $n \ge 3$; $\tau \le 2$ for $n \ge 6$): an explicit estimate $L_0 \ge K\,T(\tau) - 3/2$ with $T(\tau) = \tanh(\tau/2)/\tau$.
- **Region II** ($n \ge 8$, $\tau \ge 2$): explicit estimates with a handful of certified numerical constants.
- **Small $n$** ($3 \le n \le 7$, $\tau \ge 1$): an interval certificate showing $L_0 > \Psi(1)$.

The cases $n = 1, 2$ are elementary.

## Evidence, assurance and limitations

- **Written proof.** The 11-page paper contains the complete argument. Its Table 1 lists exactly which argument each range of $(n, \tau)$ uses.
- **Essential computations.** Two short computations are load-bearing. Certificate C1 checks the finitely many numerical constants used in Regions I and II. Certificate C2 checks the inequality for $3 \le n \le 7$ on rational pieces, with smallest certified margin 0.107 at $n = 7$, and checks its own coverage. Both use Arb ball arithmetic with direct comparisons and fail closed on any non-finite value.
- **Additional certificates.** A third certificate proves a stronger one-variable inequality for all $3 \le n \le 60$, minimum margin 0.238. It is an alternative route for $3 \le n \le 7$, and an independent re-certification in a different interval library, mpmath `iv`, agrees with it. During the editorial gate two reviewers also re-certified C1 and C2 in mpmath `iv`.
- **Defects found and fixed.** Two rounds of cross-vendor review found two certificate defects before release. A floating-point endpoint left a sliver uncovered at $n = 5$. A squared ball straddling zero returned NaN, which a `max()` then silently dropped. Both are fixed, and regression tests reproduce each defect and confirm the fix. Neither defect touched the written proof.
- **Negative controls.** Deliberate corruptions are rejected in normal and optimised Python. They include each of the twelve constants of C1 moved to the wrong side, both coverage endpoints of C2, a margin just beyond the true one, a determinant sign error and a lens of radius 1.999.
- **Certified checks and numerical evidence (not proof).** Certified root isolation finds all 20,744 non-real eigenvalues inside the lens across 1,603 cases: every $n \le 40$ on a grid of $c$, plus $n = 50$, $60$ and $300$. Double-precision computations for $n \le 400$, and reviewers' tests on thousands of matrices and millions of comparison pairs, found no violation.
- **Review.** A commissioned external AI review recommended minor revisions, all of which were made. An internal five-role editorial gate then reviewed the frozen candidate: all five roles recommended minor revision and found no error in the proof. All 51 items were addressed in one repair batch; the main scientific change replaced a suggested extension to unbalanced pencils, which is false, by certified counterexamples. Two confirmation reviewers then accepted the repairs with minor edits, which were made. All of these reviews are model-based and producer-coordinated.
- **Limits.** All of this is producer-side. There is no formal verification, no independent reproduction and no specialist or journal review. The claim that the lens bound is asymptotically sharp is numerical only. Novelty rests on a bounded literature search.

## Relationship to earlier work

Davies and Levitin reduced the eigenvalue problem to a ratio equation, proved that the non-real eigenvalues approach the real axis as $n \to \infty$, and stated the lens conjecture. Öztürk (2023) proved it for $n \le 3$ and for eigenvalues equidistant from $c$ and $-c$. The equivalent Chebyshev form used here was stated in Öztürk's 2017 IWOTA lecture, and again in the 2019 thesis and the 2023 paper; the thesis reports that bounds on ratios $U_n/U_{n-1}$ were not enough. Levitin and Öztürk (2018) and Öztürk (2023, *Complex Analysis and Operator Theory*) studied an associated two-parameter eigenvalue problem. The characteristic polynomial and the Chebyshev reformulation are therefore prior work, and the reduction applies a familiar Weyl-function mechanism. The original contribution is the comparison lemma and its proof. Related work on non-real eigenvalues of indefinite Sturm–Liouville operators and on tridiagonal matrices that are self-adjoint in a Krein space is cited in the paper. No earlier proof for general $n$ was found.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Spectral theorists working on non-self-adjoint and indefinite problems | A complete localisation theorem for a model indefinite pencil, and a new comparison inequality that makes the Weyl-function reduction work | Check the written proof, especially Lemma 4.1 and Proposition 6.2. The lens fails for unbalanced pencils and for weakened couplings. |
| Researchers on orthogonal polynomials | A new inequality between Lorentzian sums over Chebyshev nodes, and the Chebyshev statement of Remark 8.1 | The comparison lemma has numerical slack of about 2/3 that is observed, not proved. |
| Computer-assisted proof practitioners | Two small, fail-closed Arb certificates with per-constant mutation controls and regression tests for two real defects | The certificates check finitely many inequalities. The reduction to them is written proof, not formalised. |
| Applied analysts using discretised indefinite problems | The scaling corollary and the discretisation dictionary of Remark 8.5 | The theorem bounds $\operatorname{Re}\mu$ by $\lvert q\rvert$ but gives no mesh-uniform bound on $\operatorname{Im}\mu$. |
| Research agents and tool builders | Machine-readable claims, an AI index, replay receipts and negative controls | Preserve the version, scope and exclusions recorded in `CLAIMS.json`. |

## Why the problem matters

For self-adjoint problems, eigenvalues are real and variational principles locate them. Indefinite and non-self-adjoint problems lose both properties, and simple enclosure theorems such as Gershgorin's often give regions far larger than where eigenvalues actually lie. The Davies–Levitin pencil is one of the simplest cases where the true region is visibly smaller: the intersection of the Gershgorin disks, not their union. A proof for every $n$ confirms that picture and gives a method, the comparison of one explicit function at two points of equal height, that may transfer to related pencils.

## How to inspect or reproduce the recorded checks

From the research repository, with Python 3.12 and `python-flint==0.9.0`, install `requirements.txt` and run `PY=python3 ./replay.sh`, which takes about 40 seconds. It checks the manifest; runs certificates C1 and C2, the regression tests and the negative controls in normal and optimised Python; then runs certificate C3, the certified and heuristic numerics, and the claim-anchor and link checkers. It stops with a non-zero exit on any failure. The producer ran it with Python 3.13, and CI runs it with Python 3.12. The essential check alone is `python certificates/certify_small_n.py`. The expected outputs are in `REPLAY_RECEIPT.md`, and the environment is recorded in `ENVIRONMENT.txt`.

## What is in the evidence package

- **Manuscript:** the paper as PDF, LaTeX source and accessible Markdown.
- **Certificates:** the constants check, the essential small-$n$ certificate, the additional $n \le 60$ certificate and the independent mpmath re-certification, each with its recorded output.
- **Tests:** regression tests for both repaired defects and five semantic negative controls.
- **Numerics:** certified root isolation of the theorem and of the sharpness values, the certified counterexamples of Remark 8.4, and heuristic double-precision checks.
- **Records:** a machine-readable claim index, with explicit scope limits, and an AI index; the assurance, provenance, licence, prior-art and citation-audit records; the earlier model reviews labelled by version; and the editorial-gate reports, synthesis, decision, response matrix and confirmation round.

## What would improve the result next

- Specialist checking of the written proof, and an independent rerun of certificates C1 and C2.
- A short elementary proof of the inequality for $3 \le n \le 7$, which would remove the larger of the two essential computations.
- A proof of the observed 2/3 slack in the comparison lemma, and of the asymptotic sharpness of the lens.
- The correct localisation for unbalanced pencils with $m \ne n$ and for other Jacobi blocks, where the lens itself fails.
