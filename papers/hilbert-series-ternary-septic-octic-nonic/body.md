## Summary

A plane curve of degree $d$ is the zero set of a homogeneous polynomial in three variables, a *ternary form*. Changing coordinates by any $3\times3$ matrix of determinant 1 moves the curve but not its geometry. The polynomial expressions in the form's coefficients that are unchanged by every such change of coordinates are its *invariants*. For conics these include the discriminant. For cubics there are exactly two basic invariants, of degrees 4 and 6.

The **Hilbert series** $\sum_n a_n t^n$ counts how many independent invariants there are in each degree $n$. It is the basic numerical fingerprint of the invariant ring. As far as we could find, it was known only for curves of degree up to 6, the last two cases computed by Bedratyuk and Xin in 2011. This release determines it for curves of degree **7, 8 and 9**. For $d=7$ it completes the candidate of the earlier Evidence Press release, which was proved only up to degree 760.

The answers are large rational functions. For octics the denominator has degree 2331. They also yield concrete structure:
- for nonics, exactly 45 new basic invariants are needed in degree 8, 118 in degree 9, 606 in degree 10 and 2009 in degree 11;
- every homogeneous system of parameters for septic invariants has a member of degree divisible by 108.

**The decisive qualification:** this is an unrefereed candidate produced by an AI research agent. It relies on published theorems and on exact computer calculation, and no human specialist has checked it. The method itself is not new.

## Summary for specialists

Let $I_{3,d}=\mathbb C[S^d\mathbb C^3]^{\mathrm{SL}_3}$ with Hilbert series $H_d$.

**Theorem.** The series $H_7$, $H_8$ and $H_9$ are the rational functions in the package:

| $d$ | Least denominator (degree) | Numerator (degree, palindromic) | Krull dimension |
|---|---|---|---|
| 7 | 1386 | 1350 | 28 |
| 8 | 2331 | 2286 | 37 |
| 9 | 1393 | 1338 | 47 |

The septic case equals the candidate $R_7$ of the earlier release. The first terms of the new series are
$$\begin{aligned}H_8&=1+t^3+6t^6+81t^9\\&\quad+1990t^{12}+\cdots,\end{aligned}$$
$$\begin{aligned}H_9&=1+t^4+6t^6+3t^7\\&\quad+46t^8+118t^9+\cdots.\end{aligned}$$

**Consequences.**
- Exact numbers of minimal generators in low degree, for example $g_8=45$, $g_9=118$, $g_{10}=606$ and $g_{11}=2009$ for $d=9$, and $g_9=75$ for $d=8$.
- For every homogeneous system of parameters, at least $m_r$ of its degrees are divisible by $r$, where $m_r$ is the multiplicity of $\Phi_r$ in the least denominator. So every homogeneous system of parameters has a member of degree divisible by 108, 147 and 64 for $d=7,8,9$ respectively. A solver gives minimum degree sums of 1428, 2391 and 1457; these are solver-computed, and whether they are attained is open.

## Technical account

- **Poles.** Following Derksen's theory of universal denominators, the pole order of $H_d$ at a primitive $r$-th root of unity is bounded by the dimension of a fixed locus, which reduces to torus data: a maximum of $|S_0|-\operatorname{rank}S_0$ over level sets $S$ of the torus weights. The paper proves this bound directly (Lemmas 5–7) and computes it by an exhaustive enumeration (Lemma 8). A second program, written blind by a separate agent from Derksen's lattice condition, gives identical values for $d=5$–$9$.
- **Numerator degree.** The rings are Gorenstein with $\deg H_d=-\dim V$ (Knop's criterion). So $H_d\cdot B$ is a reciprocal polynomial, and half its coefficients determine it. For $d=7,8,9$ that means exact $a_n$ up to degrees 708, 1194 and 686.
- **Coefficients.** Two algorithms that share no code compute them exactly, modulo many primes, lifted to integers by the Chinese remainder theorem with a proven bound:
  - a Molien–Weyl average over a grid of roots of unity in $\mathbb F_p$ (Proposition 3, with a line-by-line code map);
  - weight counting with the Weyl character formula (Proposition 4).

  For octics and nonics both give the same integers over the whole range needed. Both rest on Weyl's formulas, so they are independent in code rather than in mathematics.

**What is new and what is not.** The ingredients are Derksen's universal denominators, Knop's criterion, Stanley's reciprocity and Makam's finite-determination strategy for matrix invariants. All are published and cited. The new parts are the cases themselves, the computations, the correctness statements and certificates, and the consequences.

## Evidence, assurance and limitations

- **Certificates.**
  - Septic: exact $a_n$ to degree 708 from 15 weight-counting primes; the 52 further exact coefficients to degree 760 are reproduced out of sample.
  - Octic and nonic: exact $a_n$ from six 62-bit grid primes, with the raw per-prime residues archived and re-lifted on every replay. The certificate also requires the determined series to predict coefficients modulo a fresh prime far beyond the data used (to degrees 1600 and 1000), because its internal checks alone could not detect a denominator bound that is too small.
- **Independent checks.**
  - Weight counting at 17 and 18 further primes gives exactly the same integers as the grid engine over the whole range needed (to degrees 1194 and 690).
  - Negative controls (corrupted data, a tampered reference, and denominators made deliberately too small) are all rejected.
  - The same pipeline re-derives the known degree-5 and degree-6 series exactly.
- **Replay.** Three labelled modes, each writing a receipt; the producer's receipts cover the first two:
  - *archived*: all certificates on the stored data;
  - *fresh*: adds bounded recomputation;
  - *full*: regenerates every coefficient file and byte-compares it with the archive, in about 3.5 hours (documented, not receipted in this version).
- **Review.** All review is model-based:
  - two cross-vendor adversarial rounds on the septic argument;
  - a publisher-supplied external model review (major revisions, all actioned);
  - the internal five-role editorial gate (major revisions, all actioned).
- **Limits.** There is no formal verification and no specialist or journal review. The two coefficient algorithms rest on the same representation theory. Knop's criterion is used through a published restatement. The minimum degree sums for systems of parameters are solver-computed.

## Relationship to earlier work

- **Degrees 5 and 6.** Bedratyuk and Xin computed these by MacMahon partition analysis. Broer's 1991 chapter surveys earlier methods.
- **Degree 7, first coefficients.** Bedratyuk gave the septic coefficients through degree 21, and they agree with ours.
- **Degree 7, candidate.** The earlier Evidence Press release proposed $R_7$ and proved it through degree 760.
- **Attribution.** That release omitted to credit Derksen (a priori denominators) and Makam (the strategy). This release corrects both.
- **Methods for systems of parameters.** Deriving degree constraints from the denominator is Dixmier's method for binary forms, also used by Brouwer, Draisma and Popoviciu.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Invariant theorists and computational algebraists | Exact targets for constructing generators, systems of parameters and presentations for invariants of plane curves of degrees 7–9; benchmarks for coefficient algorithms | The results are computer-assisted and not specialist-checked. Section 6 separates what the series determine from what they do not |
| Algebraic geometers working on moduli of plane curves | Numerical invariants of the GIT quotients of plane septics, octics and nonics | The series do not by themselves give generators or relations |
| Research agents and tool builders | A worked example of known theory turned into auditable, replayable certificates, with labelled replay modes and a research-gates record | Preserve the method attribution and the candidate status |

## Why the problem matters

Hilbert series of invariant rings have been computed case by case since the nineteenth century. For plane curves, as far as we could find, the frontier stood at degree 6 for fifteen years. Beyond that the rational functions become too large for symbolic methods, while the invariants themselves are the natural coordinates on the moduli of curves. Exact series constrain what any presentation of these rings can look like, and they give reference values against which future computations can be checked.

## How to inspect or reproduce the recorded checks

From the research repository, install `requirements.txt`, which needs python-flint, sympy, numpy and scipy plus a C compiler with OpenMP, then run one of:
- `PY=python3 ./replay.sh archived`: every certificate and negative control on the stored data, about two minutes;
- `PY=python3 ./replay.sh fresh`: adds bounded recomputation, about 15 minutes;
- `PY=python3 ./replay.sh full`: regenerates every coefficient file, about 3.5 hours.

Each run writes a JSON receipt recording its commands, input and output hashes, ranges and code hashes. The producer's receipts for the archived and fresh modes are included.

## What would improve the result next

- Specialist checking of Propositions 3–4 and Lemmas 5–8, and an unaffiliated run of the full replay mode.
- An explanation of the recurring excess of 2 in the pole bounds. Larger centralisers explain it only at $r=2$ (Remark 9); a full explanation would sharpen the bounds and lower the cost of degree 10.
- Explicit systems of parameters and generators that meet the constraints of Section 6.

## What is in the evidence package

- **Manuscript:** the paper as PDF, LaTeX source and accessible Markdown.
- **Code:**
  - enumeration, certificates and checks;
  - both coefficient algorithms, including the packed-storage weight counter;
  - the second-algorithm exact check and the centraliser-bound test;
  - the replay driver with labelled modes;
  - the research-gates checker.
- **Data:**
  - the rational functions, with a data-format note and loader;
  - raw per-prime residues and lifted coefficients from both algorithms;
  - out-of-sample and weight-counting residues;
  - the consequences file;
  - validation data for $d=5,6$.
- **Independent program:** the blind torus-bound program and its results.
- **Records:**
  - claims, AI index, prior art and research gates;
  - pre-registered forecasts with outcomes;
  - the response to the external review;
  - the editorial-gate reports and decision;
  - the producer's replay receipts.
