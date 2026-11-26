## Summary

**In one sentence.** This release determines how close the complex zeros of the reliability polynomial of a complete network come to the origin, finds that a constant Waldvogel studied in 1983 sets that distance, and describes the curve the zeros follow on 29/30 of the circle.

**The everyday object.** Take a network in which every link can fail, independently, with the same probability $q$. The *reliability polynomial* gives the chance that the surviving links still connect every node. For the complete network $K_n$, in which every pair of the $n$ nodes is linked, it is the chance that a random graph is connected.

**The question.** Because the reliability is a polynomial in $q$, one can plug in complex values and ask where it vanishes. These *reliability zeros* have been studied since Brown and Colbourn conjectured in 1992 that they all lie in the closed unit disk. Royle and Sokal showed the conjecture is false in general, but only just: their counterexample has a zero of modulus about 1.0017. For the complete graphs, plots show the zeros forming an oval that creeps out towards the unit circle as $n$ grows. Buys proved that the reliability tends to 1 inside the disk and asked whether, counted together, the zeros of graphs spread evenly round the circle; Brown and McMullin, and Omar, studied the real zeros near $-1$.

**What is new.** How close do the reliability zeros of complete graphs come to zero? A 1983 constant decides.

| Result | In plain terms | Where |
|---|---|---|
| The inner radius | The innermost zeros sit at distance about $(2\log n-1.392)/n$ inside the unit circle. The constant is $-2(1+\log W_0)$, where $W_0=0.7377\ldots$ is the smallest possible modulus of a zero of a family of entire functions (the "deformed exponential"), studied by Waldvogel in 1983 | Theorem 8 |
| The direction | The innermost zeros approach two mirror-image directions, at about $\pm137$ degrees ($\pm2.393$ radians), not the negative real axis | Theorem 9 (computer-assisted) |
| The curve | On the arc from $\pi/30$ to $59\pi/30$, which carries 29/30 of the zeros, the zeros follow an explicit curve, one zero per angular gap of size $2\pi/N$, where $N=n(n-1)/2$ is the degree. Figure 1 shows the zeros of $K_{24}$ and $K_{40}$ on the predicted curve | Theorem 10 (computer-assisted) |
| The negative real axis | For all large $n$ there is exactly one negative real zero when $n\equiv0,3\pmod 4$ and none otherwise. Its distance from the unit circle is about $(2\log n-1.517)/n$, so it lies farther out than the innermost complex zeros; exact computation confirms the count for every $n$ up to 24 | Theorem 7 |
| Matroids | The zeros of the spanning reliability of loopless matroids spread evenly round the unit circle exactly when rank divided by size tends to zero. This answers a question of Buys, and the proof is short given a theorem of Hughes and Nikeghbali | Proposition 1 |

**The idea of the proof.** The generating function for connected graphs is cut at half its length. A graph has at most one component with more than $n/2$ vertices, so the reliability splits exactly into two terms: a "one giant component" term, which is close to 1 (as Gilbert showed in 1959), and an "only small components" term governed by the smallest zero of the deformed exponential function. A zero of the reliability needs the two terms to cancel, and that pins the radius. The closest approach happens where the smallest zero of the deformed exponential is smallest, and that is Waldvogel's constant.

**Limits.** The negative-axis count is proved for all sufficiently large $n$, with no explicit threshold, and checked exactly up to $n=24$. The curve result leaves out an arc of 1/30 of the circle near $q=1$ and says nothing about a vanishing fraction of the zeros, which could lie anywhere; whether every zero lies inside the unit circle is still open. The directions, the precise radius formula and the 29/30 arc rely on interval-arithmetic certificates. The classical inputs are credited: Gilbert's formulas, Sokal's coefficient asymptotics for the deformed exponential, Waldvogel's constant, the theorem of Hughes and Nikeghbali, and an identity and positivity result of Alsmeyer, Bostan, Raschel and Simon. This is an unrefereed candidate; its assurance is internal AI-assisted review and computational checks only.

## Summary for specialists

Let $R_n(q)$ be the all-terminal reliability polynomial of $K_n$, of degree $N=n(n-1)/2$, and $h_n$ the smallest modulus of a zero. Let $F_w(z)=\sum_k w^{k(k-1)/2}z^k/k!$ with $|w|=1$, let $\rho(w)$ be its zero of smallest modulus, and $W_0=\min_{|w|=1}|\rho(w)|=0.7377507574\ldots$ (Waldvogel's rotation-restricted Whittaker constant). Write $a=\pi/4=|\rho(-1)|$ and $H_n(q)=-n\log|q|-2\log n$.

- **Proposition 1** *(proof)*: for loopless matroids $M_j$ of rank $r_j$ on $m_j$ elements, the zero-counting measures of the spanning reliability converge weakly to the uniform measure on the unit circle iff $r_j/m_j\to0$; a consequence of the deterministic theorem of Hughes and Nikeghbali.
- **Theorem 7** *(proof)*: for all sufficiently large $n$, $R_n$ has exactly one zero on the negative real axis when $n\equiv0,3\pmod4$ and none otherwise; it is located with error $O(n^{-4})$ in $q$, with $nb_n=2\log n-2(1+\log a)+o(1)$; $R_n$ has no zeros on $q\le-1$ and none on $q>0$ other than $q=1$. Exact computation confirms the count for $2\le n\le24$.
- **Theorem 8** *(proof)*: $-n\log h_n-2\log n\to-2(1+\log W_0)=-1.39170\ldots$
- **Theorem 9** *(computer-assisted)*: the minimum defining $W_0$ is attained at exactly one conjugate pair of phases; innermost zeros approach the directions $\pm\theta_*$, $\theta_*=2.39324\ldots$ (about $137.12^\circ$), and $h_n$ is given by an explicit formula with error $o(n^{-2})$.
- **Theorem 10** *(computer-assisted)*: on every closed interval $I\subset(\pi/30,59\pi/30)$, and on $I=[\pi/30,59\pi/30]$ itself (mass 29/30), the measures $\frac1N\sum_{\arg q_j\in I}\delta_{(\arg q_j,H_n(q_j))}$ converge weakly to $\frac1{2\pi}\int_I\delta_{(\theta,H(\theta))}\,d\theta$ with an explicit profile $H$; at $\theta=\pi$, $H=-2(1+\log a)=-1.5169\ldots$, and its maximum $-1.3917\ldots$ is at $\theta_*$.

**Known and new.** Buys proved $R_n\to1$ locally uniformly in the open disk and, for $n\equiv0,3\pmod4$, the existence of a real zero tending to $-1$. The exponential generating function is Gilbert's (and a specialisation of the Tutte and Mallows–Riordan polynomials); Sokal expressed the coefficients of the deformed exponential series at a fixed parameter through its smallest zero; Waldvogel computed $W_0$ numerically and conjectured that it equals the Whittaker constant. Chang and Shrock observed the oval numerically. Scott and Sokal announced a study of the Tutte polynomials of complete graphs at complex parameters. The new parts are the inner radius, the certified extremal directions, the joint limit law on 29/30 of the circle, the exact negative-axis count for large $n$, and the matroid criterion.

## Technical account

**The half-degree split.** By the exponential formula, $R_n(q)$ is the $n$th coefficient of $\log\sum_k q^{-k(k-1)/2}z^k/k!$. For $|q|<1$ this series diverges, but only the first $n$ terms matter, and the series is cut at half its length. Since a graph on $n$ vertices has at most one component with more than $n/2$ vertices, $R_n$ splits exactly into a giant-component term, close to $1$ with Gilbert's correction $1-nq^{n-1}$, and a small-components term. Writing $q=we^{-s}$ with $|w|=1$, a phase-uniform approximation (Lemma 4) shows the small-components term is governed by $\rho(w)$; an isolated-zero lemma (Lemma 5) and a Jensen bound (Lemma 6: at most one zero of $F_w$ in $|z|\le\pi/4$) make this uniform in the phase.

**Cancellation pins the radius.** A zero needs the two terms to cancel, which forces $-n\log|q|\approx2\log n-2(1+\log|\rho(w)|)$. Minimising $|\rho(w)|$ over the phase gives $W_0$ and the inner radius; at $w=-1$, $\rho=-\pi/4$ gives the negative-axis constant $-1.517$, about $0.125/n$ farther out in modulus.

**Certificates.** Theorem 9 rests on an interval certificate that encloses $W_0$ between $0.73775075747822433247$ and $0.73775075747822433248$, proves that the minimiser is a single conjugate pair and bounds the curvature there; it runs on outward-rounded integer intervals, on `mpmath.iv`, and in an independent re-implementation with Arb balls. Theorem 10 needs the smallest zero of $F_w$ to stay simple and separated along the arc: one certificate covers $[\pi/7,\pi]$, and a second, in Arb ball arithmetic, covers twelve sub-arcs from $\pi/7$ down to $\pi/30$ with junction annuli. Section 8 of the paper labels every computation as exact, interval-certified or floating.

## Evidence, assurance and limitations

- **Proofs.** Every result has a written proof in the 15-page paper, which opens with a plain introduction (the problem, what was known, what is new, the idea in one paragraph, a table of classical inputs and new statements, and a roadmap) and ends with the scope, open problems and an AI-use statement. Theorems 9 and 10 are labelled computer-assisted. No proof assistant was used.
- **Computations.** `verify.py` enumerates the connected spanning subgraphs of $K_n$ through $K_6$ and counts the real zeros exactly for $2\le n\le24$. `whittaker_certificate.py` (two interval backends) and `check_intervals_independent.py` (Arb) certify the enclosure of $W_0$ and the directions; `check_arc.py` and `check_arc_extension.py` certify the arc. `finite_size.py` compares zeros computed at 120 digits with the asymptotic location (Table 2), and `constants.py` evaluates the derived constants. Two further programs draw the figures.
- **Tests that can fail.** No certificate program relies on `assert`; each raises an error on any failed inequality, also in Python's optimised mode. The arc program rejects two deliberately wrong inputs, and moving the claimed enclosure of $W_0$ to 0.738 makes the main certificate fail.
- **Replay.** Every program was rerun from a fresh copy before release, the certificates in optimised mode; every printed output matched the recorded files. GitHub CI reruns them all on Linux, compares the outputs under a declared policy and repeats the failure test.
- **Review.** A combined five-perspective Claude review panel (editor, methodology, domain, perspective and devil's advocate) found the analytic proofs correct and reproduced the key constants; its requests concerned merging two drafts, a buried headline, an overclaiming abstract and a hidden term in the finite-size formula. One revision round merged the drafts, rewrote the introduction, added the next term of the finite-size formula and extended the curve result from 6/7 to 29/30 of the circle with a new certificate. A re-review and a proof audit of the new and rewritten proofs followed; the two local defects they found were fixed and no correctness issue remained open. No second-model review took place for this release. A public review summary is in the package. None of this is peer review, independent reproduction or formal verification.
- **Limitations.** No explicit threshold for the negative-axis count; the arc of 1/30 near $q=1$ is not covered; a vanishing fraction of the zeros could lie anywhere, and whether every zero lies inside the unit circle is open; the figures and the finite-size table are illustrations and floating evaluations, not certificates; attributions rest on a literature search of limited scope. This remains an unrefereed candidate.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Researchers on graph polynomials and network reliability | Exact asymptotics for where the reliability zeros of complete graphs lie, with the classical constant that sets the inner radius | Asymptotic statements; the count on the negative axis has no explicit threshold |
| Researchers on partition-function zeros | A worked example where a half-degree split and a single extremal constant control the zero set of a dense family | Complete graphs only; general graphs behave differently |
| Analysts working on entire functions and the Whittaker constant | Certified enclosure of Waldvogel's $W_0$, a certified unique minimising direction, and reusable certified programs for the deformed exponential | The certificate concerns the rotation-restricted constant $W_0$, not Waldvogel's conjecture $W=W_0$ |
| Research agents | Machine-readable claims, an agent index and replayable certificate programs with failure tests | The programs accompany written proofs; they do not replace them |

## Why the problem matters

Where the zeros of a graph polynomial lie is a standard question about such polynomials, with a long line of conjectures and counterexamples for reliability. The complete graphs are the natural dense test case and the one in Buys's question. Knowing exactly how close their zeros come to the origin, in which direction, and along what curve turns a familiar picture into a theorem, and ties it to a classical constant from the theory of entire functions.

## How to inspect or reproduce the recorded checks

From the GitHub release or the Zenodo archive, with CPython 3.12 and the pinned packages in `requirements.txt`, from the `code/` folder (the programs import one another):

```sh
python3 -E -s -B -O verify.py
python3 -E -s -B -O whittaker_certificate.py
python3 -E -s -B -O check_intervals_independent.py
python3 -E -s -B -O check_arc_extension.py ../results/arc_extension.json
python3 -E -s -B -O finite_size.py ../results/finite_size.json
```

`README.md` lists all twelve runs; the whole replay takes about a minute. `ENVIRONMENT.txt` records the software used and the comparison policy (printed outputs identical; run times ignored; plotting values to relative $10^{-9}$). `AI_INDEX.md` maps each claim to its proof and checks, `RESEARCH_GATES.json` records the prior-work boundary and the sources read, and `REVIEW_SUMMARY.md` lists the review objections and how each was handled.

## Related releases

No earlier release treats reliability zeros. See also `uniform-split-reliability`, a different reliability question (uniformly optimal graphs for split reliability).

## The most valuable next projects

1. Make every estimate explicit and combine it with a finite computation, so that the negative-axis count holds for every $n$.
2. Extend the curve result to every closed arc avoiding $q=1$ by an analytic argument as the angle tends to zero.
3. Decide Buys's question whether every nontrivial zero of $R_n$ lies inside the unit circle, equivalently Sokal's conjecture on the generating polynomials of connected graphs.

## What is in the evidence package

The paper (LaTeX source `manuscript.tex` and the PDF); its two figures with data; ten Python programs in `code/` with their recorded outputs in `results/` and pinned packages in `requirements.txt`; `refs.bib` from Crossref and arXiv records; `AI_INDEX.md`; `REVIEW_SUMMARY.md`; `RESEARCH_GATES.json`; `REPLAY_RECEIPT.md` and `ENVIRONMENT.txt`; citation metadata, licences (CC0-1.0 for text, MIT for code), the CI workflow with its comparison script, and SHA-256 sums.
