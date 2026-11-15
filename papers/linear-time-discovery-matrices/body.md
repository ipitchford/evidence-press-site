## Summary

**In one sentence.** Vovk and Wang asked whether the rows of an e-value "discovery matrix" built from pairwise products can be computed in linear time; this paper proves that they can, so a complete matrix for 10,000 hypotheses now takes about two minutes in plain Python.

**The everyday problem.** Scientists often test thousands of hypotheses at once: genes, advertising variants, arms of a drug trial. An *e-value* measures the evidence against one "nothing is going on" hypothesis. When nothing is going on, its average is at most one, so a value like 100 is strong evidence. The practical question is: among the hypotheses with the strongest evidence, how many are real discoveries? One wants an answer that is valid for every cut-off at once.

**The discovery matrix.** Vovk and Wang answer that question with a *discovery matrix*. Sort the e-values from largest to smallest. The entry in row $r$ and column $j$ says how strongly the data back the claim "more than $j$ of the top $r$ hypotheses are real discoveries". A large entry, say above 100, means that this claim fails only if something has happened that has probability at most 1/100, and this holds for all rows and columns simultaneously.

**A small example from the paper.** Take three e-values, $20$, $8$ and $\tfrac12$, combined by the average of pairwise products. The discovery matrix is:

| | $j=0$ | $j=1$ | $j=2$ |
|---|---|---|---|
| $r=1$ | 10 | | |
| $r=2$ | 58 | 4 | |
| $r=3$ | 58 | 4 | ½ |

The entry 58 in row 2, column 0 is strong evidence that at least one of the top two hypotheses is real. The entry 4 in row 2, column 1 is only weak evidence that both are.

**The bottleneck.** Each entry is a minimum over exponentially many subsets of hypotheses. Combining e-values by the average of their pairwise products, called $U_2$, gives much sharper matrices than plain averaging when the e-values are independent or arrive sequentially. But the best algorithm needed time growing like $K^2$ for each row when there are $K$ hypotheses, and like $K^3$ for the whole matrix. In their gene-expression study with 6,033 genes, Vovk and Wang computed only a 200-row corner, and they asked in print whether linear time per row is possible.

**What is proved.** Yes. One row takes time proportional to $K$, and the whole matrix takes time proportional to its size. This holds for $U_2$ and for any fixed mix of a constant, the plain average and $U_2$, including the half-and-half mix used by Vovk. As a concrete test, the complete $10{,}000\times10{,}000$ discovery matrix of a simulated study takes about two minutes in plain Python, with about 440 times fewer evaluations than the previous algorithm.

| What | In plain terms | Where |
|---|---|---|
| Linear-time rows | Each row of the $U_2$ discovery matrix in time proportional to the number of hypotheses; the matrix in time proportional to its size | Theorem 2.3 |
| The key inequality | Inserting values into a gap of a sorted sample cannot raise the plain average unless it also raises the pairwise-product average | Lemma 4.1 |
| Why the speed-up works | A hidden table is *totally monotone*, so a classic matrix-search algorithm finds all row minima quickly | Corollary 5.2 |
| What it makes possible | A complete $10{,}000\times10{,}000$ matrix: $3.77\times10^8$ evaluations instead of $1.67\times10^{11}$ | Section 7 |
| Higher degrees | Reduced to one inequality, proved in a special case, supported by exact evidence; not proved | Section 8 |

**The idea of the proof.** Each entry is the smallest merged value over a two-parameter family of candidate lists: some of the smallest e-values inside the top $r$, plus some of the smallest outside it. The paper shows that adding a block of values that sits in a gap of a sorted sample cannot lower the pairwise-product average while raising the plain average. Adding the same large value to two lists preserves which one is smaller. Together these make the table of candidates *totally monotone*: as you go down the rows, the best column never moves left. That is exactly what the SMAWK algorithm of Aggarwal, Klawe, Moran, Shor and Wilber needs to find every row minimum while looking at only a linear number of entries. The table is neither "Monge" nor single-dipped, so simpler tricks fail.

**Limits.** The result covers $U_2$ and fixed mixes of a constant, the plain average and $U_2$ only. For averages of products of three or more e-values ($U_3$, $U_4$, ...) the question stays open: the paper shows that one "chord" inequality would settle each fixed degree for positive e-values, reduces it to a simple two-value case, proves a special case and gives strong exact evidence, but no proof. The algorithm is exact in rational arithmetic; floating-point results are approximations, not certified. The statistical reading needs independent or sequential e-values, with mixture weights fixed in advance. This is an unrefereed candidate; its assurance is internal AI-assisted review and computational checks, not peer review. The question and the discovery-matrix framework are due to Vovk and Wang; SMAWK is due to its authors.

## Summary for specialists

Let $e_1\ge\dots\ge e_K\ge0$, $R_r=\{1,\dots,r\}$, and let $U_k$ be the $k$th elementary symmetric mean (with Vovk and Wang's singleton convention $U_2(x)=x$). For $F=c+aU_1+bU_2$ with $a,b,c\ge0$, the discovery matrix is

$$D_{r,j}=\min_{I\in\mathcal I_{r,j}}F\bigl((e_i)_{i\in I}\bigr)$$

for $0\le j<r\le K$, where $\mathcal I_{r,j}$ is the set of nonempty $I\subseteq\{1,\dots,K\}$ with $|R_r\setminus I|\le j$.

- **Proposition 3.1** *(proof)*: with $H_m$ the $m$ smallest e-values of $R_r$, $T_t$ the $t$ smallest outside it and $Q(m,t)=F(H_m\cup T_t)$, the entry $D_{r,j}$ is a prefix minimum over $q\le j$ of $\min_tQ(r-q,t)$.
- **Lemma 4.1** *(proof)*: for a gap configuration $(A,Z)$ (every inserted value lies between the two parts of $A$), $U_1(A\cup Z)>U_1(A)$ implies $U_2(A\cup Z)>U_2(A)$. The ingredients are the Maclaurin inequality, the Bhatia–Davis variance bound and convex order; the statement and its use are new in a bounded search.
- **Lemma 5.1 and Corollary 5.2** *(proof)*: adding a common maximum preserves the comparison, so $Q$ is totally monotone (for minima, rightmost ties) on rows $m\ge2$; Remark 5.3 adds row 1 under any singleton rule. The array is neither row-unimodal, Monge nor inverse Monge (explicit examples in Section 5).
- **Theorem 2.3** *(proof)*: SMAWK on $Q$ with constant-time entries, a scan of row 1 and prefix minima give every row, with a two-integer witness per entry, in $O(K)$ arithmetic operations and $O(K)$ memory, and the matrix in $O(K^2)$. For pure $U_2$, and for mixtures with $c=0$, $a+b=1$ under the source's singleton rule, the output is exactly Vovk and Wang's matrix.
- **Theorem 8.3 and Proposition 8.4**: for $U_d$, $d\ge3$, the chord inequality $G_d(A;Z)\ge0$ (Conjecture 8.1) would give $O(d^2K)$ rows on positive inputs; it holds for a single insertion and reduces to insertions of copies of the two values next to the gap. A natural log-convexity route fails (explicit example). The conjecture is supported by exact evidence only.

The closest antecedent is Lemma G.1 of Hartog and Lei, a monotone tail index for the arithmetic mean with one required element.

## Technical account

**Constant-time entries.** Precompute the sums $s_m$ and pairwise-product sums $p_m$ of the required blocks $H_m$, and $\sigma_t$, $\pi_t$ for the tails $T_t$. For $n=m+t\ge2$,

$$Q(m,t)=c+a\,\frac{s_m+\sigma_t}{n}+b\,\frac{P_{m,t}}{\binom n2},$$

with $P_{m,t}=p_m+s_m\sigma_t+\pi_t$. This uses only additions, products and divisions of nonnegative numbers.

**The central-insertion inequality.** Write $U_2(A)=\mu_A^2-v_A/(n-1)$ in terms of the mean and the population variance. Suppose the inserted block $Z$ has a larger mean than $A$, so the plain average rises. If every inserted value is above the mean of $A$, appending them in increasing order raises $U_2$ at every step. Otherwise, first shrink $Z$ towards its smallest value until its mean equals that of $A$. Because the values of $A$ lie outside the gap and the shrunken values inside it, the shrunken block has no larger variance, so the pooled list has $U_2$ at least $U_2(A)$. Raising the values back to $Z$ then strictly increases $U_2$.

**SMAWK with rightmost ties.** SMAWK alternates a *reduce* step, which discards columns that total monotonicity rules out, with a recursion on half the rows; each level costs time linear in its current numbers of rows and columns. The implementation resolves ties towards later columns, as the minima version requires, and a deliberately wrong variant that keeps leftmost ties is caught by the checks.

**Arithmetic.** With rational inputs the implementation is exact, and the bounds count arithmetic operations, not bit operations. In floating point each entry has a small relative error, but comparisons between nearly equal entries inside SMAWK are not certified.

## Evidence, assurance and limitations

The synthetic audio briefing is explanatory, not additional evidence. Its [complete transcript](/assets/audio/linear-time-discovery-matrices.txt) is available for reading.

- **Proofs.** Every theorem, lemma, proposition and corollary has a written proof in the 12-page paper. The paper opens with a plain introduction and a roadmap, explains e-values, discovery matrices and SMAWK before using them, and ends with the scope and open questions. No proof assistant was used.
- **Exact checks against the definition.** `verify_quadratic.py` compares the implementation with a brute-force evaluation of the original subset definition over every sorted list of length 1 to 8 from $\{0,\tfrac12,1,3\}$ with five weight choices, plus 120 random rational lists: 65,080 matrix entries, each with its witness, and 9,760 tie decisions. It also checks the source's singleton rule (9,324 entries), compares SMAWK with a direct scan on 33,337 tie-heavy rows, and checks the total-monotonicity condition on 146,452 combinations.
- **Tests that can fail.** A deliberately wrong SMAWK that keeps leftmost ties produced 2,149 mismatches and was caught. The scripts use no `assert`, so their checks stay active under Python's optimised mode.
- **Worked examples and higher degrees.** `examples_check.py` checks every number in the worked examples, including the matrix above. `higher_degree_checks.py` checks the Section 8 identities exactly (11,273 checks) and finds no violation of the chord inequality in 37,905 random checks; this is evidence, not proof.
- **Scale.** `benchmark_quadratic.py` gives the operation counts of Table 1, and `full_matrix_demo.py` computes the complete $10{,}000\times10{,}000$ matrix in the simulation design of Vovk and Wang, scaled up: 376,620,736 entry evaluations against 166,716,670,000 for the previous algorithm, with three rows recomputed exactly and in agreement. Among the 5,000 largest e-values, the data support at least 2,303 true discoveries at evidence level 100.
- **Replay.** All five scripts were rerun from fresh copies before release under Python 3.12, three of them also under `python -O`, and every exact result and count matched the recorded outputs; timings vary by machine. GitHub CI reruns the exact checks under `-O` as a blocking job, and the full matrix as a non-blocking job.
- **Review.** Five internal AI-assisted reviewer roles, an adversarial review by a second AI model and a clean replay found no error in the main theorem and led to one revision round. It added the plain introduction, a rewritten related-work section, a proof that the singleton row needs no special treatment, stronger tests, the full-matrix demonstration and the higher-degree section. A re-review, a proof audit and a second-model audit of the new proofs followed. A rating-free summary is in the package. None of this is peer review, independent reproduction or formal verification.
- **Limitations.** Proved for $U_2$ and fixed mixes of a constant, the plain average and $U_2$ only; higher degrees are open. Floating-point mode is not certified. The statistical reading needs independent or sequential e-values and weights fixed in advance with $a+b+c\le1$. Attributions rest on a bounded literature search. This remains an unrefereed candidate.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Statisticians using e-values for many hypotheses | Complete pairwise-product discovery matrices for tens of thousands of hypotheses, not just a corner | Independent or sequential e-values; weights fixed in advance |
| Developers of multiple-testing software | A short exact algorithm with witnesses, a reference implementation and exhaustive tests | Floating-point comparisons are not certified |
| Researchers in closed testing | A structural route (total monotonicity) to fast shortcuts for product-type mergers | Higher-degree products remain open |
| Algorithm designers | A natural statistical source of totally monotone arrays that are not Monge | Bounds count arithmetic operations, not bit operations |
| Research agents | Machine-readable claims, an agent index, a prior-art record and replayable scripts | The scripts check the code; they are not part of the proofs |

## Why the problem matters

Discovery matrices give a simultaneous, post-hoc answer to "how many of my top findings are real?", and the pairwise-product merger makes that answer much sharper when experiments are independent or sequential. Until now the cost confined it to small corners of the matrix for large studies. A linear-time row removes that limit for pairwise products and the mixtures used in practice, and the higher-degree reduction shows exactly what remains to prove for products of more e-values.

Related area on Evidence Press: e-values ([exact calibration of e-variables against Gaussian null families](/releases/exact-calibration-gaussian-null-families/)).

## How to inspect or reproduce the recorded checks

From the GitHub release or the Zenodo archive, from a directory outside the package (Python 3.10 or later, standard library only):

```sh
V=/absolute/path/to/package/verification
shasum -a 256 -c MANIFEST.sha256                       # at the package root
python3 -O -I -B "$V/verify_quadratic.py" --out /tmp/ltdm      # about 17 s
python3 -O -I -B "$V/examples_check.py" --out /tmp/ltdm
python3 -O -I -B "$V/higher_degree_checks.py" --out /tmp/ltdm  # about 8 s
python3 -I -B "$V/benchmark_quadratic.py" --out /tmp/ltdm
python3 -I -B "$V/full_matrix_demo.py" 10000 --out /tmp/ltdm   # about 2 minutes
```

`ENVIRONMENT.txt` lists the software used. `AI_INDEX.md` maps each claim to its proof and checks, `PRIOR_ART.md` records the sources and how the result relates to them, `RESEARCH_GATES.json` gives the prior-work boundary, and `REVIEW_SUMMARY.md` lists the review objections and how each was handled.

## The most valuable next projects

1. Prove or refute the chord inequality (Conjecture 8.1) for $d=3$, which would give linear-time rows for averages of triple products.
2. Handle inputs with zeros for degrees three and above, where the positivity argument breaks down.
3. Build a certified floating-point mode, for example by falling back to exact arithmetic when SMAWK compares nearly equal entries.
4. Update rows incrementally when e-values arrive one at a time.

## What is in the evidence package

The paper (LaTeX source and PDF); `verification/quadratic_discovery.py` (the implementation) and five verification scripts with their recorded outputs; `requirements.txt`; `PRIOR_ART.md`; `refs.bib` from Crossref and arXiv records; `AI_INDEX.md`; `REVIEW_SUMMARY.md`; `RESEARCH_GATES.json`; `REPLAY_RECEIPT.md` and `ENVIRONMENT.txt`; citation metadata, licences (CC0-1.0 for text and data, MIT for code), the CI workflows and SHA-256 sums.
