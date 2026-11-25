## Summary

**In one sentence.** Which complex numbers can be zeros of a graph's independence polynomial? Exactly the ones that obviously could be: this candidate proves that the two easy restrictions are the only ones, and as a consequence finds purely imaginary zeros larger than one, such as $i$ times the golden ratio on an explicit graph with 4,293 vertices.

**The everyday object.** Take any network (a graph). An *independent set* is a group of nodes with no links between them: think of guests at a party none of whom know each other, or radio stations far enough apart not to interfere. Count these groups by size, $s_j$ of size $j$, and use the counts as coefficients:

$$I_G(x)=\sum_{j\ge 0} s_j\,x^j.$$

This is the *independence polynomial*. Its constant term is 1 (the empty group) and its next coefficient is the number of nodes. Physicists know it as the partition function of the hard-core lattice gas, where the location of its complex zeros controls where phase transitions can occur. Its zeros are called *independence roots*.

**The question.** Which complex numbers $z$ are independence roots of some graph? Two obstructions are immediate. The polynomial has integer coefficients and constant term 1, so $1/z$ must be an *algebraic integer* (a root of a monic integer polynomial). And $I_G(t)\ge 1$ for every real $t\ge0$, so no root, and none of its algebraic "twins" (conjugates, the other roots of its minimal polynomial), can be a positive real number.

**What was known.** Brown, Hickman and Nowakowski proved that independence roots are dense in the complex plane, but density says nothing about which points are hit exactly. Purely imaginary roots drew particular attention. Cameron's thesis conjectured that $\pm i$ are the only ones; Brown and Cameron then found the roots $\pm i/k$ for every positive integer $k$ and asked about irrational multiples of $i$; Cameron's list of open problems asks whether a purely imaginary root can have modulus greater than one. A public record found the root $i/\sqrt2$ on a 128-vertex graph, and concurrent work of Ma and Zhang found every $i/\sqrt k$. All these roots have modulus at most one.

**What is new.**

| Result | In plain terms | Where |
|---|---|---|
| Exact classification | A nonzero number is an independence root exactly when $1/z$ is an algebraic integer and no conjugate of $z$ is positive real. Equivalently, an integer polynomial with constant term 1 divides some independence polynomial exactly when it is positive on $[0,\infty)$. Connected cographs, trees and connected well-covered graphs each realise every such number | Theorem 2.1, Corollary 2.2 |
| Imaginary roots larger than one | They exist: $i\varphi$, with $\varphi=(1+\sqrt5)/2$ the golden ratio, is a root of an explicit graph with 4,293 vertices. This answers Cameron's question | Section 4 |
| The threshold is six | Such roots need a largest independent set of size at least six, and from six on they are dense on the imaginary axis. A number whose conjugates are all purely imaginary needs largest independent set of size exactly its degree plus two | Theorem 4.2, Corollary 4.3 |
| How large they can be | With six as the cap, a graph on $N$ vertices has purely imaginary roots of modulus at most about $0.0875\,N^{2/5}$, and this is attained. In other directions the size can grow like $N^5$ | Theorem 5.1, Appendix A |
| Well-covered graphs and trees | Cutler and Pebody's approximate realisation of well-covered counting vectors becomes exact; a number is a root of a well-covered tree exactly when, in addition, its real conjugates lie in $[-1,0)$ | Theorem 6.1, Corollary 7.1 |

**The witness.** Take five groups of disjoint cliques, with clique sizes $(4111)$, $(3,37)$, $(11,18,43)$, $(2,7,13,23)$ and $(3,3,3,3,3,10)$, and join every group to every other. The resulting graph has 4,293 vertices, its largest independent set has size six, and

$$\begin{aligned}I_G(x)&=(1+3x^2+x^4)\\&\quad\times(1+4293x+2430x^2).\end{aligned}$$

Since $\varphi^2+\varphi^{-2}=3$, the first factor vanishes at $x=\pm i\varphi$ and $x=\pm i/\varphi$, so $i\varphi$, of modulus $1.618\ldots$, is a root.

**The idea.** Joins of groups of cliques have independent-set counts that can be tuned exactly, size by size from the largest down; this device goes back to Alavi, Malde, Schwenk and Erdős. The proof aims the counts along a family of targets that keeps the desired polynomial $f$ as a factor, using a classical multiplier to make all coefficients positive. The size law comes from clique-counting inequalities of Fisher and Ryan applied to the complement graph.

**Limits.** The witness graphs are large: the smallest graph with root $i\varphi$ is unknown, with between 10 and 59 vertices overall and at least 833 when the largest independent set has size six. The sharp size law covers only that case. The tree construction can add extra roots. The programs check concrete instances; the proofs carry the general claims. This is an unrefereed candidate; its assurance is internal AI-assisted review and exact computational certificates only.

## Summary for specialists

$I_G(x)=\sum_j s_j(G)x^j$; $z\ne0$ is *admissible* when $1/z$ is an algebraic integer and no conjugate of $z$ over $\mathbb Q$ lies in $(0,\infty)$. Let $\kappa=6^{9/4}3^{15/8}\approx442.02$, so $\kappa^{-2/5}=6^{-9/10}3^{-3/4}\approx0.0875$.

- **Theorem 2.1** *(proof)*: for $f\in\mathbb Z[x]$ with $f(0)=1$, $f\mid I_G$ for some graph iff $f>0$ on $[0,\infty)$; such $G$ exists among connected cographs, trees and connected well-covered graphs, and for cographs and well-covered graphs $I_G/f$ shares no zero with $f$, so multiplicities are kept.
- **Corollary 2.2** *(proof)*: $z\ne0$ is an independence root iff it is admissible. For real $b$, $ib$ is admissible iff $b^{-2}$ is an algebraic integer with no negative real conjugate (Remark 2.3); this describes every $b$ in Brown and Cameron's Question 2, which was answered affirmatively earlier by the Trureturing record and, concurrently, by Ma and Zhang for $b^2$ rational.
- **Theorem 4.2, Corollary 4.3** *(proof)*: an admissible $z$ of degree $d$ with all conjugates purely imaginary needs $\alpha(G)=d+2$ exactly; six is the least independence number admitting a purely imaginary root of modulus $>1$, and at $\alpha=6$ these are dense on $i\mathbb R$.
- **Theorem 5.1, Theorem A.2** *(proof)*: the least order $n_6(a)$ of a graph with $\alpha=6$ and $(1+ax^2+x^4)\mid I_G$ is $\kappa a^{5/4}(1+O(a^{-1/12}))$, and the largest $|b|$ with $I_G(ib)=0$ over $N$-vertex graphs with $\alpha\le6$ is $\kappa^{-2/5}N^{2/5}(1+O(N^{-1/15}))$. Brown and Nowakowski's bound gives growth $N^{\alpha-1}=N^5$ in arbitrary directions.
- **Theorem 6.1** *(proof)*: every integral affine ray in the interior of the Cutler–Pebody cone is realised exactly by connected well-covered graphs.
- **Corollary 7.1, Proposition 7.2** *(proof)*: $z$ is a root of a well-covered tree iff $1/z$ is an algebraic integer and every real conjugate lies in $[-1,0)$; a half-line $\{tu:t>0\}$, $|u|=1$, contains independence roots iff $u$ is algebraic and $u\ne1$, and then they are dense on it.

**Known and new.** The clique-join gadgets are those of Alavi, Malde, Schwenk and Erdős, refined by Ball, Galvin, Hyry and Weingartner and by Frohmader; the positivity multiplier is classical (Motzkin and Straus); the transfer to trees is Bencs's theorem, already used for imaginary roots by Brown and Cameron. New here, within a literature search of limited scope: the factor-preserving choice of targets that removes every obstruction except the obvious two, the threshold $d+2$, the sharp size law at independence number six, and the exact well-covered realisation. The criterion also reads as a statement about clique polynomials and trace-monoid Möbius polynomials; no earlier statement was found in those languages either.

## Technical account

**Exact affine fill (Lemma 3.1).** For fixed $a_j>0$ and $b_j$, every polynomial $1+\sum_{j\le h}(Na_j+b_j)x^j$ with $N$ large is the independence polynomial of a connected cograph. Fill the counts from size $h$ down: the block $kK_s$ with $s=\lfloor m^{1/k}\rfloor$, plus $m-s^k$ blocks of $k$ isolated vertices, contributes exactly $m$ independent $k$-sets and only $O(m^{1-1/k})$ smaller ones, and counts of positive size add under join.

**Keeping the factor.** Given $f>0$ on $[0,\infty)$, Lemma 3.2 gives $m$ with $(1+x)^mf$ strictly positive. The targets $f\cdot(1+N\,x(1+x)^m)$ then have the shape of Lemma 3.1 for large $N$, so a connected cograph realises a multiple of $f$; choosing $N$ so the cofactor shares no zero with $f$ keeps multiplicities. Bencs's stable-path tree of a connected graph has independence polynomial divisible by that of the graph, which gives trees.

**The imaginary axis.** If all conjugates of $z$ are purely imaginary, its constant-one minimal polynomial is even, $f(x)=\prod_j(1+c_jx^2)$ with $c_j>0$, and $(1+x)f$ has positive coefficients, so Proposition 4.1 gives a connected cograph with $\alpha=d+2$. A graph with $f\mid I_G$ has $\alpha\ge d$. If $\alpha=d$ then $I_G=f$, whose linear coefficient is zero, which is impossible. If $\alpha=d+1$ then $I_G=(1+nx)f$ with $n$ the number of vertices, so $s_3=ns_2$; but each independent pair lies in at most $n-2$ independent triples, so $3s_3\le(n-2)s_2$, a contradiction. For modulus above one the degree is at least four, which gives six; the family $1+ax^2+x^4$, with roots $\pm ib_a$ and $b_a\to\infty$, rescaled by integers, gives density on the axis.

**The size law.** In the complement graph the independent sets of $G$ become cliques, so the counts fixed by $I_G=(1+ax^2+x^4)(1+nx+qx^2)$ are clique counts. The Fisher–Ryan inequalities, together with a removal-lemma estimate for graphs with few four-cliques (Lemma 5.2), bound these counts against each other, and optimising gives $n\ge(\kappa-o(1))a^{5/4}$ (Lemma 5.3). A matching construction joins near-extremal cograph blocks (Lemma 5.4). Appendix A replaces the removal lemma by a sampling argument and bounds the relative errors explicitly.

## Evidence, assurance and limitations

The synthetic audio briefing is explanatory, not additional evidence. Its [complete transcript](/assets/audio/which-numbers-are-independence-roots.txt) is available for reading.

- **Proofs.** The 15-page paper opens with a plain introduction (the problem, its physics motivation, what was known, what is new, what is not new, other languages and a plan) and gives written proofs of every theorem. No proof assistant was used.
- **Exact checks.** Standard-library Python programs with exact integer and rational arithmetic: a constructor that follows the proof of Lemma 3.1; an alternative constructor; a witness verifier that multiplies the clique factors and also runs vertex deletion on explicitly built labelled graphs for the 4,293-, 7,440- and 59-vertex witnesses; a certificate generator and checker for the construction of Theorem 5.1, including a stored certificate for $a=10^{36}$ (73 block types, within a factor $1.000005$ of the sharp constant); and an exact check that every witness for $i\varphi$ with largest independent set six has at least 833 vertices.
- **Tests that can fail.** No certificate check uses `assert`, so the programs behave identically in Python's optimised mode. Unit tests include negative controls (a wrong quotient, a wrong order, a corrupted certificate, and a run in optimised mode in a separate process), and at release a stored certificate with one block count changed was rejected.
- **Replay.** All documented commands were rerun from a fresh copy before release in optimised mode; every result line matched the recorded output exactly. GitHub CI reruns them on Linux under the same exact comparison, with the failure test.
- **Review.** Five internal Claude reviewer roles (editor, methodology, domain, perspective and devil's advocate) were run as one combined pass, and a separate agent searched the prior literature. The revision rebuilt the introduction for non-specialists, sharpened attributions (including the earlier answers to Brown and Cameron's second question by the Trureturing record and by Ma and Zhang), stated the search boundary, replaced bare assertions in the certificate code, closed a boundary gap in the well-covered argument, made the error terms effective, and added the 833-vertex lower bound. A re-review and proof audit of every rewritten proof found no open correctness issue. Fisher and Ryan, whose inequality carries the size law, and Dubickas were read in full. No second-model review took place for this release. A rating-free summary is in the package. None of this is peer review, independent reproduction or formal verification.
- **Limitations.** The witnesses are very large and the minimal one is unknown; the sharp size law covers only independence number six; trees may carry extra roots; attributions rest on a literature search of limited scope. This remains an unrefereed candidate.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Researchers in graph polynomials | Decide at once whether a given algebraic number can be an independence root, and build explicit witness graphs | The witnesses are very large |
| Researchers on zeros of hard-core partition functions | Know exactly which activities can be zeros for some finite graph, and how large imaginary zeros can be at independence number six | The sharp size law is proved only at independence number six |
| Research agents | Machine-readable claims, an agent index and exact replayable certificates | Programs check instances; the proofs carry the general claims |

## Why the problem matters

Zeros of the independence polynomial govern the analytic behaviour of the hard-core model and the performance of approximate counting algorithms, and much work maps where they can and cannot lie. Knowing that every number passing the two obvious tests is hit exactly, by graphs from several natural classes, settles the inverse question completely and turns several open questions about imaginary roots into explicit constructions with measured sizes.

## How to inspect or reproduce the recorded checks

From the GitHub release or the Zenodo archive, with Python 3.10 or later and no extra packages, from the `code/` directory:

```sh
python3 -O -m unittest test_constructor test_greedy test_certificates
python3 -O verify_witness.py
python3 -O extremal_order.py --check ../checks/certificate-10pow36.json
python3 -O order_lower_bound.py 3
```

Expect 14 passing tests, `ALL WITNESS CHECKS PASSED`, a verified certificate with 73 block types and a lower bound of 833 vertices, in a few seconds. `README.md` lists every command and the expected output, `checks/replay-output.txt` records it, and `ENVIRONMENT.txt` states the exact comparison policy. `AI_INDEX.md` maps each claim to its proof and checks, `RESEARCH_GATES.json` records the prior-work boundary and the sources read, and `REVIEW_SUMMARY.md` lists the review objections and how each was handled.

## The most valuable next projects

1. Find the smallest graph with root $i\varphi$: overall it has between 10 and 59 vertices, and between 833 and 4,293 when the largest independent set has size six.
2. Determine the growth of the largest purely imaginary root at independence number seven and beyond.
3. Settle Cameron's question on the largest modulus of a root of a well-covered tree.

## What is in the evidence package

The paper (LaTeX source `manuscript.tex` and the PDF); the programs in `code/` with their unit tests; stored certificates and replay output in `checks/`; `requirements.txt` (no third-party dependencies); `refs.bib`; `AI_INDEX.md`; `REVIEW_SUMMARY.md`; `RESEARCH_GATES.json`; `REPLAY_RECEIPT.md` and `ENVIRONMENT.txt`; citation metadata, licences (CC0-1.0 for text, MIT for code), the CI workflow and SHA-256 sums.
