## Summary

**The setting.** Some pairs of quantum measurements are *complementary*: if one has a predictable outcome, the other cannot. Position and momentum are the textbook example. A three-level quantum system (a *qutrit*) has an exact analogue: its standard basis and its Fourier basis. Physicists call such pairs mutually unbiased bases.

**The proposal that failed.** In 2014 Schneeloch, Broadbent and Howell proposed a useful rule. Let two parties share a quantum system, and let each measure it in one of two complementary ways, so that they collect two tables of joint results. The rule says that the correlation visible in the two tables, added together, never exceeds the total quantum correlation of the shared state. If it were true, two tables would give a guaranteed lower bound on correlation without reconstructing the full state. The rule is called the complementary quantum correlation (CQC) inequality.

In 2026 the rule was shown to fail in most dimensions. Exact qutrit counterexamples appeared first in public code repositories by Ethan O'Connor and by AlperTheKing; Wang, Wang and Chen then gave counterexamples in every dimension of at least three and proved that the rule does hold for two qubits; and Qian refuted it for a qubit paired with a system of any dimension from four upwards. Only the qubit–qutrit case remains undecided.

**What this paper does.** It settles two follow-up questions.

- **(A) How well can two complementary measurements tell two qutrit states apart?** Take two perfectly distinguishable qutrit states and score each measurement by how differently the two states make its outcomes fall (the *triangular discrimination*). Each measurement scores at most 2, so the trivial ceiling for the pair is 4. The paper proves that the true best is exactly $8/3$, whatever pair of complementary measurements is used, and it identifies every case that reaches $8/3$; for the standard and Fourier bases these are linked to a famous symmetric arrangement of nine quantum states, the Hesse SIC configuration. One consequence is a cap on efficiency: if you can only measure in one of two complementary bases, chosen at random, you recover at most two thirds of the information (Fisher information) that the best measurement would give when estimating the balance between the two states. The proof is computer-assisted: an exact certificate written in fractions, checked by a short standalone program.
- **(B) Can a careful choice of measurements rescue the rule?** Perhaps the rule fails only for unlucky measurement choices. The paper shows that for a qubit paired with a system of dimension four or more, it cannot be rescued: for *every* choice of complementary measurements there is an unentangled (separable) state that breaks the rule. This was previously known only from dimension 164. The paper certifies an explicit margin of $-9/20{,}000{,}000$ nats (natural-log units of information) that works for all these dimensions at once.

**What it does not do.** The full qubit–qutrit question stays open; result (A) settles only one restricted family there, raising its certified safety margin from 0.0120 to 0.1005 nats. The best score in dimension five is not proved (numerics suggest $(14+2\sqrt5)/5$). The violations in (B) are tiny: they show a structural limit, not an effect an experiment would notice. The qutrit certificate is checked by exact computer arithmetic; it is not a formal proof in a proof assistant.

The sections below move from this overview to a specialist summary, the technical account, evidence and limits, and how to rerun the checks.

## Summary for specialists

Write $\Delta(p,q)=\sum_j (p_j-q_j)^2/(p_j+q_j)$ (no factor $1/2$, so $0\le\Delta\le2$) and, for a mutually unbiased pair $Q,R$ and orthonormal $u,v$, $\mathcal S_{Q,R}(u,v)=\Delta(p^Q,q^Q)+\Delta(p^R,q^R)$.

- **Theorem 2.1.** For every MUB pair in $\mathbb C^3$ and orthonormal $u,v$, $\mathcal S_{Q,R}(u,v)\le 8/3$. Equality holds iff $\operatorname{span}\{u,v\}=\operatorname{span}\{q_j,r_k\}$ for some $q_j\in Q$, $r_k\in R$ and $|u\rangle\langle u|-|v\rangle\langle v|=\pm\sqrt{3/2}\,(|q_j\rangle\langle q_j|-|r_k\rangle\langle r_k|)$. Qian showed $8/3$ is attained and asked whether it is the maximum (arXiv:2608.14806v2, §11(4)).
- **Corollary 2.2.** With the setting chosen at random and recorded, the classical Fisher information for the weight $\theta$ of $\tfrac{1+\theta}{2}|u\rangle\langle u|+\tfrac{1-\theta}{2}|v\rangle\langle v|$ at $\theta=0$ is $\mathcal S/4\le 2/3$, against quantum Fisher information $1$.
- **Corollary 3.3.** Qian's two-ray qubit–qutrit family obeys CQC with gap at least $0.1005$ nats (previously $0.0120$).
- **Theorem 4.1.** For $n\ge4$ and every prescribed MUB pair on each side of $\mathbb C^2\otimes\mathbb C^n$ there is a separable state with CQC gap below $-9/20{,}000{,}000$; per-$n$ margins are tabulated ($-1.058\times10^{-4}$ at $n=4$). Every-pair failure was previously known for $n\ge164$ (Qian, Theorem 4.1); some-pair failure for $n\ge4$ was already known.
- **Theorem 4.7.** For local dimensions $m,n\ge3$ every prescribed pair admits a separable violation with a dimension-free margin, by phase-averaging the shared-label mechanism of Wang–Wang–Chen and Qian. O'Connor earlier stated an every-pair version for equal dimensions with an entangled state, flagged as not independently checked; the paper credits it.

## Technical account

**Qutrit bound.** Every MUB pair in $\mathbb C^3$ is equivalent to the computational/Fourier pair (complex Hadamard classification, Tadej–Życzkowski). Following Qian's compressed-frame reduction, for the plane $W=\operatorname{span}\{u,v\}$ one forms a three-by-three frame operator $A_W$ with $\operatorname{Tr}A_W=2$ and $\max_{u,v}\mathcal S=2\lambda_{\max}(A_W)$ (Lemma 3.1). So $\mathcal S\le 8/3$ iff $\det(\tfrac43 I-A_W)\ge0$ on the relevant branch. Writing the normal vector of $W$ in five real coordinates and clearing positive denominators gives a homogeneous degree-12 polynomial $\mathcal P$ with 671 nonzero coefficients. Lemma 3.2 gives an exact identity $\mathcal P=\sum_{j=1}^4 b_j^{\mathsf T}G_jb_j$ with rational Gram blocks of sizes 43, 41, 40 and 41, split by a Klein four-group symmetry, and $G_j\succeq\tfrac{207}{1000}I$. Positivity is proved without eigenvalues: exact rational $LDL^{\mathsf T}$ elimination shows $H_j-I/4\succ0$ for rational auxiliary matrices $H_j$, and the entrywise bound $|G_j-H_j|\le1/1000$ with at most 43 rows gives $\|G_j-H_j\|_2\le 43/1000$. Step 4 classifies equality: the zero set consists of the six basis rays (removable) and the nine Hesse SIC rays, which give exactly the planes in Theorem 2.1.

**Every-pair violations, qubit–qudit.** Any MUB pair on $\mathbb C^n$ compresses to two binary projective measurements on a two-dimensional subspace with overlap $c=1-2/n$ (Lemma 4.2; compression also in Qian and O'Connor). On an explicit separable family $\rho_{r,t}$ with a partially polarised qubit factor of Bloch length $r$, the second derivative of the gap in $t$ at $0$ is $\frac{1-c}{1-r^2}+(1+c)\frac{\operatorname{artanh}r}{r}-\frac{2}{1-r^2/2}$ (Proposition 4.3), negative for small $r$ exactly when $c>1/2$. A quartic remainder bound (Lemma 4.4) turns this into a certified finite witness: at $(r,t)=(61/200,\,421/20000)$ the gap is below $-9/20{,}000{,}000$ for all $c\in[3/5,1]$ (Lemma 4.5), covering $n\ge5$; $n=4$ uses a separate exact argument with $c=1$ in a different plane. The rational bounds are checked by `scout_cqc/certified_margin.py` in exact `Fraction` arithmetic.

**Both dimensions at least three.** Theorem 4.7 keeps the shared-label mechanism of the earlier counterexamples (Wang–Wang–Chen; Qian) and adds a phase-averaging step on a local three-dimensional subspace, chosen from the prescribed bases on each side, so that the construction works for every prescribed pair. It gives a rank-two separable state, diagonal in a local product basis, whose violation margin does not depend on the dimensions; full-rank separable examples follow by mixing in a little white noise.

## Evidence, assurance and limitations

- **Exact certificate.** `scout_qutrit/exact_sos_certificate.json` (660,609 bytes, SHA-256 `825bb810…5c2f`) is part of the proof and is archived with this release, whose DOI the paper cites as its locator. The verifier rebuilds $\mathcal P$ independently from the six measurement vectors, checks all 1,820 degree-12 monomial coefficients, Gram positivity and every equality identity. It uses no `assert`, so Python `-O` does not weaken it.
- **Negative controls.** Five kinds of corrupted certificate (a target coefficient, a Gram entry, an auxiliary diagonal entry, an equality-witness coefficient, a basis monomial) are rejected under both `python -B` and `python -B -O`; the genuine certificate is accepted in both.
- **Replay.** Before freezing, all scripts were rerun from a fresh copy with and without `-O`: the verifier took about 22 seconds per mode, the negative controls about a minute, the margin checks and numerical cross-checks under a second. GitHub CI reruns the exact checks.
- **Limits.** Computer-assisted exact arithmetic, not a proof-assistant formalisation; the certificate was found numerically and then made exact, and only the exact checks are proof premises. The margins in Theorems 4.1 and 4.7 are tiny and of structural, not experimental, interest. The full $2\times3$ CQC question and the sharp $d=5$ constant are open. The literature search was bounded (arXiv, GitHub, Zenodo and web searches to 3 November 2026). Review was internal and AI-assisted only.

## Who should care, and why

- **People certifying correlation or entanglement from a few measurement tables**: for a qubit paired with a system of dimension four or more, complementary-basis tables cannot be trusted as lower bounds on total correlation, however the bases are chosen.
- **Quantum metrologists**: an exact $2/3$ cap on what two random complementary qutrit settings can deliver for a two-state estimation task, with the optimal orientations identified.
- **Researchers working on sums of squares and computer-assisted proof**: a compact, fully exact certificate pattern (rational Gram blocks plus an exact $LDL^{\mathsf T}$ margin) that can be rerun in under a minute.

## Why the problem matters

Measurement-based correlation witnesses are attractive because they avoid full state tomography. A witness that silently overcounts gives false confidence. This paper turns "the CQC inequality fails" into two sharper statements: the exact limit of complementary discrimination in the smallest open case, and the fact that no choice of complementary measurements restores the guarantee for qubit–qudit systems from dimension four.

## How to inspect or reproduce the recorded checks

From the unpacked archive (Python 3.11 or 3.12):

```sh
uv run --with sympy==1.14.0 --with python-flint==0.9.0 python3 -I -B scout_qutrit/verify_qutrit_sos.py scout_qutrit/exact_sos_certificate.json
uv run --with sympy==1.14.0 --with python-flint==0.9.0 python3 -I -B scout_qutrit/negative_controls.py scout_qutrit/exact_sos_certificate.json
python3 -I -B scout_cqc/certified_margin.py
uv run --with numpy==2.5.4 python3 -I -B scout_cqc/check_final_family.py
```

A valid verifier run ends with `VERIFIED: exact SOS, strict Gram positivity, gate normalization, and equality witnesses.` Add `-O` to any command to confirm the result is unchanged.

## The most valuable next projects

1. Decide CQC for a qubit paired with a qutrit, the last open pair of dimensions.
2. Find a short analytic proof of the qutrit bound, perhaps by reducing the certificate under the qutrit Clifford symmetries of the equality cases.
3. Prove the sharp constant in dimension five, where numerics suggest $(14+2\sqrt5)/5$.
4. An independent rerun of the verifier and a specialist check of the second-variation argument behind Theorem 4.1.

## What is in the evidence package

The archive contains the manuscript (PDF and LaTeX), the exact certificate and verifier, the negative controls, the exact margin checker, the numerical cross-checks with their logs, working proof notes and a proof outline, the bounded novelty audits, the bibliography with the Crossref, arXiv, GitHub and Zenodo records it was copied from, an AI index, research-gate records, CI configuration and SHA-256 sums. Text and data are CC0-1.0 and code is MIT. This is an unrefereed candidate.
