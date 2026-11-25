## Summary

**In one sentence.** This candidate proves a conjecture of Holleben and Nicklasson over every field: a whiskered graph with three pairwise unlinked nodes never gives an algebra with the weak Lefschetz property. It also says exactly when the weak and strong properties hold, and gives a simple test for every chordal graph.

**The setting.** Many questions about counting and shapes can be turned into algebra. Take a network (a graph), make one variable for each node, and declare two rules: every variable squares to zero, and the product of two linked nodes is zero. The products that survive correspond to the network's **independent sets**, groups of nodes with no links between them. So the algebra records how many independent sets there are of each size.

A classical question, named after the hard Lefschetz theorem of geometry, asks about one simple element: the sum of all the variables. Multiplying by it moves each size up by one. Does it behave as well as the dimensions allow at every step, never wasting information while the spaces grow and never missing anything once they shrink? If so, the algebra has the **weak Lefschetz property**, and its counting sequence is forced to rise and then fall smoothly. The **strong** version asks the same of every power of that element.

**What was known.** *Whiskering* a network gives every node its own private leaf. Cooper, Faridi, Holleben, Nicklasson and Van Tuyl, and then Holleben and Nicklasson (*Journal of Pure and Applied Algebra*, 2026), found that whiskered networks rarely have the weak property. They settled several cases: the property holds for complete networks, and fails for networks with very large independent sets and for all bipartite networks. They conjectured that it always fails once the original network has three nodes with no links between them, that is, independence number at least three. Computer checks covered networks with up to seven nodes, and an eight-node check was posted.

**What is new.**

| Result | In plain terms | Where |
|---|---|---|
| The conjecture | True, over every field | Theorem A (Theorem 4.1) |
| The exact answer | With $n$ nodes and largest independent set of size $\alpha$, the weak property holds only if the network is complete, or $n$ is odd and $\alpha=2$; and then only if the characteristic is zero or larger than about $n/2$. The strong property holds only for complete networks, in characteristic zero or larger than $n$ | Theorem A |
| Every rank | A formula for the rank of every multiplication map, in every characteristic | Section 3 |
| Gorenstein algebras | The same answer, with $n$ replaced by $n+1$ in the characteristic thresholds, for the Gorenstein algebras Holleben and Nicklasson built from these networks | Theorem B |
| Chordal networks | For every network without unbridged cycles of length four or more, a simple test for both properties in every characteristic | Theorem C |
| Paths and lollipops | Two recent classifications reproved with short proofs and extended to every characteristic, with the strong-property lists added | Corollaries 7.5, 7.6 |

**A concrete case.** A path network has the weak property for 1 to 7, 9, 10 and 13 nodes, and never again. It has the strong property for 1 to 7 and 9 nodes.

**The idea.** Rename each leaf variable as "leaf plus its node". After this change, multiplying by the sum of all the variables never alters which original nodes appear in a product. So the algebra breaks into independent pieces, one for each independent set of the network, and each piece is a copy of the simplest algebra of this kind: the Boolean algebra of subsets. Small pieces sit lower and large pieces higher. When one piece is already shrinking while another is still growing at the same step, the property fails, and three unlinked nodes are exactly what makes that happen. A classical description of subset-inclusion matrices, due to Wilson (with a second proof by Ghorbani and coauthors), then gives every rank in every characteristic.

**Limits.** This is pure mathematics: a classification, not an algorithm for applications. The splitting needs a private leaf at every node, or, for the chordal result, removable "simplicial" nodes, so cycles, tadpole networks and general very well-covered networks are not covered. The path and lollipop results use a small exact computer check for short lengths. The case of unequal higher exponents in prime characteristic is not settled. This is an unrefereed candidate; its assurance is internal AI-assisted review and exact computational checks.

## Summary for specialists

Let $G$ have $n$ vertices and independence number $\alpha$, let $w(G)$ be its whiskering, and let $A_G=R(w(G))$, where $R(H)=\Bbbk[z_v]/(z_v^2,\ z_vz_w : vw\in E(H))$. Put $b_n=1$ for even $n$ and $b_n=2$ for odd $n$, and let $p\ge0$ be the characteristic.

- **Theorem A** *(proof)*: $A_G$ has the WLP iff $\alpha\le b_n$ and ($p=0$ or $p>\lceil n/2\rceil$); it has the SLP iff $\alpha\le1$ and ($p=0$ or $p>n$). For $p=0$ or $p>n$, the map $L^{j-i}:A_i\to A_j$ fails maximal rank exactly when $n<i+j<n+\alpha$. The statement holds for every simplicial complex in place of the independence complex, with $\alpha$ replaced by the largest face size.
- **The splitting** *(proof)*: after $y_i\mapsto x_i+y_i$, multiplication by $L$ is, over $\mathbb Z$, a direct sum of shifted Boolean operators $\mathcal B_{n-|S|}\langle |S|\rangle$, one for each independent set $S$; Wilson's diagonal form gives every rank in every characteristic.
- **Example** *(exact check)*: for $K_8$ minus a triangle, the map $A_4\to A_5$ has rank $386$ between spaces of dimensions $400$ and $406$; the kernel ($14$) comes from the empty-face block and the cokernel ($20$) from the blocks of faces of sizes two and three.
- **Theorem B** *(proof)*: the Nagata idealisation $T$ of $A_G$ has the WLP iff $\alpha\le b_n$ and ($p=0$ or $p>\lceil (n+1)/2\rceil$), and the SLP iff $\alpha\le1$ and ($p=0$ or $p>n+1$); one explicit linear form attains every generic rank. For non-complete $G$, $T$ is Holleben and Nicklasson's G-quadratic Perazzo algebra in characteristic zero.
- **Theorem C** *(proof)*: for chordal $H$, eliminating simplicial vertices splits $R(H)$ into Boolean blocks, one per maximal independent set, with a block profile that does not depend on the elimination order. In characteristic zero the WLP and SLP depend only on the set of block types; in characteristic $p>0$ they hold iff they hold in characteristic zero and $p>\lceil\alpha(H)/2\rceil$ (WLP) or $p>\alpha(H)$ (SLP).
- **Paths and lollipops** *(proof with a finite exact check)*: $R(P_n)$ has the WLP iff $n\in\{1,\dots,7,9,10,13\}$ and $p=0$ or $p>\lceil\lceil n/2\rceil/2\rceil$, and the SLP iff $n\in\{1,\dots,7,9\}$ and $p=0$ or $p>\lceil n/2\rceil$. For lollipops $L_{m,n}$ with $m\ge2$ the WLP lists are $\{1,\dots,5,7,8,11\}$ ($m=2$) and $\{1,3,4,7\}$ ($m\ge3$), and the SLP lists $\{1,\dots,5,7\}$ and $\{1,3\}$.

**Known and new.** Holleben and Nicklasson proved the SLP for complete graphs, the WLP for $\alpha\le2$ with odd socle degree in characteristic zero, and failure for $\alpha\ge n/3+2$; their Lemma 3.1 already contains the complete-graph case of the splitting in triangular form, and the argument for $T$ follows the projection argument of their Theorem 4.6. Cooper et al. record the reduction to the sum of the variables over any field. The characteristic-zero WLP lists for paths are due to Nguyen and Tran, and for lollipops to Tran Quang Hoa, Nguyen Duy Phuoc and Tran Nguyen Thanh Son. New here, within a literature search of limited scope: the proof of the conjecture, the full classification in every characteristic, the Gorenstein classification, the chordal criterion, and the positive-characteristic and strong-property results for paths and lollipops.

## Technical account

**Generic forms (Section 2).** For an Artinian algebra defined by monomials, no linear form has larger rank than the sum of the variables $L$, for every power and over every field, finite fields included. So it is enough to study $L$.

**The splitting (Section 3).** In the variables $x_i$ and $u_i=x_i+y_i$ the defining ideal is still monomial, with basis $x_Su_R$ for $S$ independent and $R$ disjoint from $S$. Since $L=\sum_i u_i$, multiplication by $L$ keeps $S$ fixed and acts on the span of the $x_Su_R$ as the sum of the variables of a Boolean algebra on the $n-|S|$ remaining indices, shifted up by $|S|$.

**Why three unlinked nodes break the property (Section 4).** The block for a face of size $s$ is symmetric about $(n+s)/2$. In adjacent degrees $i\to i+1$ the empty-face block is losing dimension as soon as $2i+1>n$, while a block of a face of size $s$ is still gaining dimension while $2i+1<n+s$. An odd number strictly between $n$ and $n+\alpha$ exists exactly when $\alpha\ge3$, or $\alpha=2$ and $n$ is even. Then the map has a kernel from one block and a cokernel from another, so it is neither injective nor surjective. In small characteristic the entries of Wilson's diagonal form, which reach about $n/2$ for adjacent degrees, decide which ranks drop.

**Gorenstein algebras (Section 5).** The idealisation pairs $A_G$ with its dual. One linear form, $L$ plus the coordinate dual to the top monomial, joins the empty-face block to its dual into a single Boolean block one size larger and acts on every other block and its dual separately, which gives every rank and the classification.

**Higher exponents (Section 6).** With $x_i^{d_i}$ and $y_i^{d_i}$ the same change of variables splits the algebra into monomial complete intersections, one per face; this gives the characteristic-zero ranks, and the strip criterion when all exponents are equal.

**Chordal networks (Section 7).** At a simplicial node $w$ (one whose neighbours are all linked to each other), replacing $z_w$ by the sum of the variables of its closed neighbourhood splits $R(H)$ into smaller pieces of the same kind. For chordal networks this can be repeated to the end, leaving Boolean blocks. A block blocks injectivity or surjectivity at a pair of degrees according to its position, and in characteristic zero maximal rank fails exactly when both kinds occur. For paths the block types are the pairs $(m,s)$ with $2m+3s\in\{n,n+1\}$, which turns the classification into an inequality between $\lceil n/4\rceil+1$ and $\lfloor (n+1)/3\rfloor$ for long paths, with a short exact check for paths of up to 24 nodes.

## Evidence, assurance and limitations


- **Proofs.** The 13-page paper opens with a plain introduction (the problem, what was known, Theorems A to C, the key idea and a roadmap) and gives written proofs of every theorem. No proof assistant was used.
- **Checks in the original variables.** `verify.py` builds the multiplication matrices without the change of variables and computes ranks by exact elimination over prime fields: 75 whiskered graphs with 8,440 rank comparisons, a non-flag complex, 894 chordal graphs with 18,680 comparisons, higher exponents, and the eight-vertex example (rank 386 between dimensions 400 and 406). All agree with the theorems.
- **Checks for chordal networks.** `chordal_lefschetz.py` uses exact integer arithmetic: 1,128 direct eliminations against the block profiles, invariance and multiplicativity tests, the criterion for paths and lollipops (reproducing the published lists), the prime thresholds, and the witness inequalities.
- **Tests that can fail.** Neither script uses `assert`; every check prints `FAIL` and exits with an error, also in Python's optimised mode. Adding 8 to the published path list, or changing the weak-property threshold, makes the scripts fail.
- **Replay.** Both scripts were rerun from a fresh copy before release in optimised mode, and both outputs matched the recorded files byte for byte. GitHub CI reruns them on Linux, compares the outputs exactly and runs both failure tests.
- **Review.** A combined five-role internal Claude review panel (editor, methodology, domain, perspective and devil's advocate) checked every proof and recomputed the classification with its own script; one revision round added the chordal results and credited prior work more precisely; a re-review and proof audit then checked every new and rewritten proof. No error was found. No Astra/Codex review took place. Wilson's paper was read from a supplied copy. A rating-free summary is in the package. None of this is peer review, independent reproduction or formal verification.
- **Limitations.** The method needs a private leaf at every node or removable simplicial nodes; cycles, tadpole networks with longer cycles and very well-covered networks in general are outside it; prime thresholds for unequal higher exponents are open; attributions rest on a literature search of limited scope. This remains an unrefereed candidate.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Researchers on Lefschetz properties | A complete answer for whiskered and chordal graph algebras in every characteristic, and every multiplication rank from a short recursion | The method does not reach graphs with long induced cycles |
| Combinatorial commutative algebraists | Test cases and counterexamples for wider conjectures, including G-quadratic Gorenstein algebras failing the weak property | Prime thresholds for unequal higher exponents are open |
| Combinatorialists | A direct bridge from Lefschetz questions to Boolean lattices and Wilson's inclusion matrices | The criterion is stated for chordal graphs only |
| Research agents | Machine-readable claims, an agent index and fast exact checks | The scripts check finite ranges; the proofs carry the general claims |

## Why the problem matters

Lefschetz properties connect algebra, geometry and combinatorics: when they hold, counting sequences are forced to be unimodal, and for algebras built from combinatorial data they encode Sperner-type statements. Algebras from graphs are a natural testing ground, and whiskered graphs were an open family with a precise conjecture. This candidate settles that family completely, explains the answer by one change of variables, and carries the same idea to all chordal graphs.

## How to inspect or reproduce the recorded checks

From the GitHub release or the Zenodo archive, with Python 3.12 and the pin in `requirements.txt`, from the package root:

```sh
python3 -O code/verify.py --output /tmp/verification.json
python3 -O code/chordal_lefschetz.py --output /tmp/chordal.json
```

Each takes a few seconds and ends with a line beginning `PASS:`; the JSON written must equal the file in `results/` byte for byte. `README.md` lists the commands, `AI_INDEX.md` maps each claim to its proof and checks, `RESEARCH_GATES.json` records the prior-work boundary and the sources read, and `REVIEW_SUMMARY.md` lists the review objections and how each was handled.

## The most valuable next projects

1. Extend the splitting beyond private leaves and simplicial nodes, to cycles, tadpole networks and very well-covered networks.
2. Determine the prime-characteristic thresholds for unequal higher exponents.
3. Classify the Perazzo algebras with the weak Lefschetz property, using the block structure.

## What is in the evidence package

The paper (LaTeX source `manuscript.tex` and the PDF); two scripts in `code/` with their recorded outputs in `results/`; `requirements.txt` (numpy pinned); `refs.bib`; `AI_INDEX.md`; `REVIEW_SUMMARY.md`; `RESEARCH_GATES.json`; `REPLAY_RECEIPT.md` and `ENVIRONMENT.txt`; citation metadata, licences (CC0-1.0 for text, MIT for code), the CI workflow and SHA-256 sums.
