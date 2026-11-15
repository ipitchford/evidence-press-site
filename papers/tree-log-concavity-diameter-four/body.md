## Summary

**In one sentence.** A tree made of one hub joined to the middles of $m$ three-vertex paths stops having log-concave independent-set counts exactly when $m$ reaches $16{,}392$, so four is the least diameter at which a tree can fail log-concavity, and at that diameter runs of failures can be as long as you like.

**The object.** Take any network (a graph). An *independent set* is a set of nodes no two of which are joined. Count the independent sets of each size: one empty set, one set for each node, and so on up to the largest possible size. This list of counts is the *independent set sequence*. Physicists know the same numbers from the hard-core gas, a model of particles that cannot sit on neighbouring sites.

**What was expected.** For trees (networks without cycles) the counts were long expected to rise and then fall smoothly. The precise smoothness property is *log-concavity*: each count squared is at least the product of its two neighbours, $i_k^2\ge i_{k-1}i_{k+1}$. Log-concavity would imply that the sequence rises and then falls (*unimodality*), a question asked by Alavi, Malde, Schwenk and Erdős in 1987 that is still open.

**What was known.** Since 2023 trees are known to break log-concavity: Kadrawi and Levit gave trees with 26 vertices. Later work produced many breaks, and long runs of consecutive breaks (Galvin; Bautista-Ramos and coauthors; Yu, whose runs grow like $N^{1/3}$ in trees with $N$ vertices, in an unrefereed archive). Every structured example is a "deep" tree, of diameter six or more. On the other side, Galvin and Hilyard (2018) showed that every tree of diameter at most three is log-concave. (The diameter is the largest distance between two nodes.)

**The question.** How shallow can a failing tree be? And can one small building block, repeated, produce long runs of failures?

**What is new here.** Join one hub to the middle node of each of $m$ three-node paths ("cherries"). Call the result $T_m$: it has $3m+1$ nodes and diameter four.

| Result | In plain terms | Where |
|---|---|---|
| Exact threshold | $T_m$ is log-concave exactly when $m\le16{,}391$. $T_{16{,}392}$, with $49{,}177$ nodes, is the first to fail, and it fails at one place only | Theorem 2.4 (computer-assisted) |
| One block, of known length | For every $m$ from $16{,}392$ to $10^6$, and for all sufficiently large $m$, the failures form one unbroken block. Its length grows like $4.93\log\log m$, and both ends are located by explicit equations | Theorems 2.3 and 2.4 |
| Least diameter | Four is the least diameter at which a tree can fail, and also the least at which runs of failures can be arbitrarily long. One fixed three-node module, repeated at one node, suffices | Corollary 2.5 |
| Small trees | No failing tree of diameter four has at most $62$ nodes, so the smallest one has between $63$ and $49{,}177$ nodes; which number is open | Proposition 2.6 (computer-assisted) |
| A general rule | The same picture holds for the coefficients of $(1+x)^{dm}+xP(x)^m$ whenever $P$ has only negative real roots, $P(0)=1$, leading coefficient at least $1$ and $P'(0)>d$ | Theorem 2.1 |

**Why it happens.** Count down from the largest independent sets. The counts split into two pieces: sets that use the hub and sets that do not. Each piece on its own is log-concave, and each looks like the tail of a Poisson distribution, with rates $2m$ and $3m$. Where the two pieces are about equally large, their sum is a mixture of two Poisson shapes, and such a mixture is not log-concave over a window of about $4.93\log\log m$ sizes. The figure in the paper shows this window exactly for $m=10^{12}$: the failures are at sizes $56$ to $66$, counted down from the largest.

**Limits.** The runs are short: $17$ even at $m=10^{40}$, far shorter than Yu's. The failures sit near the top of the sequence, so nothing follows about unimodality. Within this hub construction the cherry is the only module the general theorem covers. The exact threshold and the one-block statement up to $10^6$ are computer-assisted (exact integer arithmetic, scripts included), and the thresholds in the general theorems are not effective. This is an unrefereed candidate, checked only by internal AI-assisted review.

## Summary for specialists

Write $\mathcal B(F)$ for the set of indices $j$ with $f_{j-1}f_{j+1}>f_j^2$ (strict failures) and $L(F)$ for its longest block. Hypothesis (H): $P$ real of degree $d$, $P(0)=1$, all roots real and negative, $P_d\ge1$ and $a=P'(0)>d$. Put $D=dm$, $F_m(x)=(1+x)^{D}+xP(x)^m$, $r=a/d$, $\lambda=\log r$, $\delta=(r-1)^2/r$, and let $\ell_m^2r^{\ell_m}=(a/\delta)m$, $u_m=\log_r(a\delta m)$.

- **Theorem 2.1** *(proof)*: for every $\varepsilon>0$ and all large $m$, $\mathbb Z\cap[\ell_m+\varepsilon,u_m-\varepsilon]\subseteq\mathcal B(F_m)\subseteq\mathbb Z\cap[\ell_m-\varepsilon,u_m+\varepsilon]$; eventually $\mathcal B(F_m)$ is one nonempty block and $L(F_m)=\bigl(2\log\log m+2\log(\delta/\lambda)\bigr)/\lambda+\theta_m$ with $\limsup|\theta_m|\le1$. For $P=(1+x)^d$ there are no failures. The thresholds are not effective, and no uniformity as $r\to1$ is claimed.
- **Theorem 2.3** *(proof)*: $I(T_m;z)=(1+3z+z^2)^m+z(1+z)^{2m}$; after reflection $j=\alpha(T_m)-k$, with $\alpha(T_m)=2m+1$, this is the case $d=2$, $P=1+3x+x^2$, $r=3/2$, with $\ell_m^2(3/2)^{\ell_m}=18m$ and $u_m=\log_{3/2}(m/2)$. For large $m$ the reflected failure set is one block and $L(T_m)=\bigl(2\log\log m-\log(36\lambda^2)\bigr)/\lambda+\theta_m$, where $2/\lambda\approx4.93261$ and $\log(36\lambda^2)/\lambda\approx4.38528$. The failures sit at reflected index about $\log m/\log(3/2)$.
- **Theorem 2.4** *(computer-assisted proof)*: $T_m$ is log-concave iff $m\le16{,}391$; $\mathcal B'(T_{16{,}392})=\{20\}$; one nonempty block for $16{,}392\le m\le10^6$. The first $m$ with run length $1,\dots,6$ are $16{,}392$, $21{,}286$, $29{,}206$, $58{,}521$, $177{,}608$ and $824{,}131$ (run lengths are not monotone: $L(T_{10^6})=5$).
- **Corollary 2.5** *(proof, using Galvin–Hilyard Theorem 1.9(1))*: four is the least diameter of a non-log-concave tree and of a family with unbounded runs.
- **Proposition 2.6** *(computer-assisted proof)*: no tree of diameter at most four with at most $62$ vertices fails.
- **Remark 6.2**: within the hub construction (a vertex joined to the roots of $m$ copies of a rooted tree), the cherry is the only module that fits Theorem 2.1. $T_m$ is the scale graph of $m$ cherries in the sense of Bautista-Ramos, Guillén-Galván and Gómez-Salgado; Yu's Discussion suggests repeating one fixed rooted module as a test of his mechanism, and this family is such a test.

## Technical account

**Comparison sequence.** For the low coefficients of $F_m$ (indices up to about $C\log m$), Lemma 3.1 squeezes $f_{m,j}$ between $(1-\eta_m)c_{m,j}$ and $c_{m,j}$, where $c_{m,j}=\frac{D^j}{j!}+\mathbf 1_{\{j\ge1\}}\frac{(am)^{j-1}}{(j-1)!}$ are the coefficients of $e^{Dx}+xe^{amx}$: two Poisson weights with means $D$ and $am$, the second shifted by one place. Lemma 3.2 gives an exact formula for the relative curvature $\mathcal D_j(c_m)=c_{j-1}c_{j+1}/c_j^2-1$ in terms of the ratio $q=q_{m,j}$ of the two terms,
$$\mathcal D_j(c_m)=\frac{N_j(q)}{(j+1)(1+q)^2},$$
$$N_j(q)=(\delta j+\beta)q-1-\Bigl(1+\tfrac1j\Bigr)q^2,$$
with $\beta=r-2-r^{-1}$.
Since $q$ grows by a factor close to $r$ per index, $N_j(q)>0$ on a window of about $2\log(\delta j)/\lambda\approx(2/\lambda)\log\log m$ indices around $j\approx\log m/\lambda$. Lemma 3.5 transfers the signs from $c$ to $f$; the proof audit corrected one displayed inequality there (to the factor $(1-\eta_m)^{-2}$), with no change to any conclusion.

**Localisation.** Newton's inequalities for the real-rooted power $P(x)^m$ (Lemma 4.1), a growth bound for its normalised coefficients (Lemma 4.2) and a perturbation estimate for the binomial term (Lemma 4.3) show that no index beyond $C\log m$ can fail (Proposition 4.4). Steps 3 to 5 of the proof of Theorem 2.1 then locate both ends of the window to within $o(1)$ and give the run length.

**The exact threshold.** Lemma 7.1 is an exact test: if $(A_K+B_K)^2D<(D+1)B_K^2$ for the coefficients of the two summands, then no index from $K+1$ to $D-K+1$ fails. For every $m\le10^6$ the certificate finds such a $K$ (always $K\le65$) and checks the remaining indices directly, giving the exact failure set. Lemma 7.2 gives explicit windows $[m_1,m_2]$ in which a fixed index $j$ is a failure, checked in exact fractions: $73$ windows with $28\le j\le100$ cover all $m$ from $10^6$ to about $1.63\times10^{18}$, and Lemma 7.3 covers every larger $m$. So $T_m$ fails for every $m\ge16{,}392$.

**The search.** A tree of diameter at most four has a centre $c$ with every vertex within distance two. If the neighbours of $c$ carry $s_1,\dots,s_k$ leaves, then $I(T;z)=\prod_i\bigl((1+z)^{s_i}+z\bigr)+z(1+z)^{s_1+\cdots+s_k}$. The search enumerates all $7{,}760{,}853$ multisets $\{s_i\}$ with $1+k+\sum s_i\le62$ and checks each sequence exactly.

## Evidence, assurance and limitations

The synthetic audio briefing is explanatory, not additional evidence. Its [complete transcript](/assets/audio/tree-log-concavity-diameter-four.txt) is available for reading.

- **Proofs.** Theorems 2.1 and 2.3, Lemma 2.2 and Corollary 2.5 have written proofs in the 16-page paper, which opens with a plain introduction, a comparison table of earlier constructions, all results stated in Section 2 and a roadmap. No proof assistant was used.
- **Computer-assisted proofs.** `threshold_certificate.py` proves Theorem 2.4 together with Lemmas 7.1 to 7.3, and `diameter4_search.py` proves Proposition 2.6. Both use only Python integers and exact fractions. They trust the interpreter's exact arithmetic and the correctness of the scripts, which the internal proof audit and a second AI model checked line by line against the lemmas.
- **Exact checks.** `verify_tree.py` runs $2{,}456$ checks: the tree polynomial against a generic tree algorithm for $m=1,\dots,10$, two independent exact coefficient formulas, and the failure sets of Table 2. `verify_general.py` runs $2{,}268$ checks of the curvature identity and of six further polynomials, including odd-degree, non-palindromic and non-monic examples. These supplement the proofs and do not replace them.
- **Tests that can fail.** Each script contains negative controls (a wrong formula, a corrupted coefficient, an impossible window). In addition, changing one expected failure set in `verify_tree.py` makes it exit with an error under Python's optimised mode, as it must.
- **Replay.** The quick scripts and the figure script were rerun from fresh copies before release, normally and under `python -O`, and the threshold certificate and the search were rerun under `python -O` with identical script bytes; every output matched the shipped files byte for byte. GitHub CI reruns the quick checks and the negative control on every push, and the slow certificate and search as a separate non-blocking job.
- **Review.** Five internal AI-assisted reviewer roles, an adversarial review by a second AI model and a clean replay led to one revision round. It rewrote the introduction for non-specialists, positioned the work against the 2023–2026 literature, credited the scale-graph framework and the mixed-Poisson antecedents, rewrote the scripts, and added the exact threshold, a weaker hypothesis for the general theorem and the search. A re-review, a proof audit and a second-model audit of the new proofs then found no failing result, apart from the one repaired inequality. A rating-free summary is in the package. None of this is peer review, independent reproduction or formal verification.
- **Limitations.** Runs are of order $\log\log N$ and sit at distance about $2.47\log N$ from the top of the sequence, so unimodality is untouched. Between $10^6$ and the non-effective threshold of Theorem 2.3 the failures are known to exist but the one-block structure is not proved. Several sources are recent preprints or an unrefereed archive. This remains an unrefereed candidate, and attributions rest on a bounded literature search.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Combinatorialists working on unimodality and log-concavity of trees | The shallowest possible non-log-concave trees, an exact size threshold for one family, and a general rule for where sums of two polynomial powers lose log-concavity | The runs are short and near the top of the sequence; nothing about unimodality |
| Probabilists and statistical physicists | A clean mechanism (crossing Poisson-like tails) for loss of log-concavity in a hard-core model on a tree | Asymptotic thresholds are not effective in general |
| People building computer-assisted proofs | A compact exact-integer certificate that combines per-case checks, explicit windows and an analytic tail | About 12 minutes on one core; trusts the scripts |
| Research agents | Machine-readable claims, an agent index, and quick checks that rerun in seconds | The checks supplement the written proofs |

## Why the problem matters

Whether the independent set counts of every tree rise and then fall is a well-known open problem, and log-concavity was the standard way to try to prove it. Knowing exactly how and where log-concavity breaks tells researchers which proof strategies cannot work. This release shows that depth is not needed for failure: a very simple tree of diameter four already fails, at an exactly known size, and the failure has a transparent cause that applies well beyond trees.

## How to inspect or reproduce the recorded checks

From the GitHub release or the Zenodo archive, at the package root (standard-library Python 3.11 or later; use absolute paths to the scripts and run from a directory outside the package):

```sh
shasum -a 256 -c MANIFEST.sha256
python3 -O -I -B verification/verify_tree.py --out /tmp/tree              # about 11 s
python3 -O -I -B verification/verify_general.py --out /tmp/general        # about 2 s
python3 -O -I -B verification/threshold_certificate.py --out /tmp/cert    # about 12 min
python3 -O -I -B verification/diameter4_search.py --out /tmp/search       # about 2 min
```

Compare each output with the file of the same name in `verification/output/` (the certificate's `part_a.seconds` field records run time and will differ). `AI_INDEX.md` maps each claim to its proof and checks, and `REVIEW_SUMMARY.md` lists the review objections and how each was handled.

## The most valuable next projects

1. What is the least number of vertices of a non-log-concave tree of diameter four? It lies between $63$ and $49{,}177$.
2. Is the longest run of failures in a tree of diameter four always $O(\log\log N)$? How does the largest possible run grow with the diameter?
3. Can the real-rootedness assumption in Theorem 2.1 be removed, so that hub constructions with other modules are covered?
4. What happens when the two powers cross in the bulk of the sequence, for example when the leading coefficient of $P$ is below $1$?

## What is in the evidence package

The paper (LaTeX source and PDF) with its figure; `verification/verify_tree.py`, `verification/verify_general.py`, `verification/threshold_certificate.py`, `verification/diameter4_search.py` and the figure script; the recorded outputs in `verification/output/`; the prior-work record (`novelty_report.md`), the exact target statement (`target.yaml`) and sequence fingerprints; `refs.bib` from Crossref, arXiv and DataCite records; `AI_INDEX.md`; `REVIEW_SUMMARY.md`; `RESEARCH_GATES.json`; `REPLAY_RECEIPT.md` and `ENVIRONMENT.txt`; citation metadata, licences (CC0-1.0 for text, figures and data, MIT for code), the CI workflows and a SHA-256 manifest.
