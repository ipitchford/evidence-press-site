## Summary

Many molecules in cells are made in **bursts**: one production event, such as the translation of a single messenger RNA, releases a random number of copies at once. The probability law of that number is the **burst-size law**. Because production is random, molecule numbers fluctuate. A standard measure of this noise is the **Fano factor**, the variance divided by the mean. Each species has a natural reference value: the Fano factor it would have if it were produced at a constant rate with the same average.

Feedback, in which one species speeds up or slows down the production of another, is the obvious way to control noise. A long-standing conjecture says it has a limit: no network of regulated species can push **every** species below its reference value at once. This was proved for molecules made one at a time. In 2026 David Anderson proved it when burst sizes follow a **geometric law**, the standard model of translational bursting. He also showed that it fails for some other laws, such as bursts of one or two molecules, and asked which other burst laws still enforce a trade-off.

This release answers that question:

- **One shared burst law.** The trade-off holds in every network **only if** the burst law is geometric. Every other law with a finite variance, even one with exactly the same mean and variance as a geometric law, lets a two-species loop make **both** species quieter than their reference values. In the loop, one species activates the other and is repressed by it in return.
- **Two different burst laws.** In the same loop, both species can be made quieter **exactly when at least one** of the two laws is not geometric.
- **Nearly geometric laws.** The overall trade-off can fail by at most an amount proportional to how far each burst law is from being geometric, measured by a classical distance.

**The effects are tiny.** The suppression is about one part in a million and happens when each species has well under one molecule on average, below 0.1 in the worked examples. These are mathematical statements about a standard stochastic model, not predictions for particular genes.

## Summary for specialists

Species $i$ is produced in bursts $K_i\ge1$ with law $p_i$ at rate $f_i(x_{-i})$, where $0<l_i\le f_i\le u_i$ depends only on the other species, and each molecule dies independently with mean lifetime $\tau_i$. Assume $\mathbb E K_i^2<\infty$, and put $\kappa_i=\mathbb E K_i$ and $B_i=(\mathbb EK_i^2+\mathbb EK_i)/(2\mathbb EK_i)$. The stationary Fano factor $F_i$ satisfies $F_i-B_i=\operatorname{Cov}(X_i,f_i)/\mathbb E f_i$, and simultaneous suppression means $F_i<B_i$ for all $i$. The loop is $f_1(y)=\varepsilon[1+h_1(y)]$, $f_2(x)=\varepsilon[1-h_2(x)]$ with $h_i(0)=0$.

- **Theorem 1 (common law).** For a common law $p$ the following are equivalent: $p$ is positive geometric; simultaneous suppression is impossible in every network; it is impossible in the loop with $h_1=h_2=h$, $\|h\|_\infty\le\tfrac12$. For every nongeometric $p$ there are $h$ and $\varepsilon_0>0$ with both $F_i<B$ for $0<\varepsilon<\varepsilon_0$.
- **Theorem 2 (pairs).** For laws $p_1,p_2$, simultaneous suppression in the loop, with nondecreasing, eventually constant and arbitrarily small $h_1,h_2$, is possible if and only if at least one law is nongeometric.
- **Theorem 3 (stability).** $\sum_i (F_i-B_i)/(\tau_i\kappa_i)\ge-\sum_i\operatorname{osc}(m_i)\,\Delta_i\ge-\sum_i(u_i-l_i)\Delta_i$, where $\Delta_i$ is the total-variation distance between $p_i$ and its discrete equilibrium transform $q_{i,k}=\Pr(K_i\ge k)/\kappa_i$. $\Delta_i=0$ exactly for geometric laws, which recovers Anderson's theorem (Corollary 1).
- **Examples.** The law $\Pr(K=1)=\tfrac23$, $\Pr(K=4)=\tfrac13$ has the mean, variance and baseline of the geometric law with mean 2, yet $F_1,F_2=2-\tfrac{19}{11520}\varepsilon^2+O(\varepsilon^3)$. Suppression is certified for $0<\varepsilon<19/25297920$. Pairing it with the geometric law $2^{-k}$ gives exact coefficients $Q_1=-233/2949120$ and $Q_2\le-3.8057\times10^{-4}$.

## Technical account

**Weak feedback, exactly.** At low intensity $\varepsilon$ both species are almost always near zero. Lemma 1 expands the stationary law around the pure-death chain on the infinite state space, using the pure-death resolvent and the stationary generator identity, with explicit remainder constants. This gives $F_i-B_i=\varepsilon^2Q_i(h_1,h_2)+O(\varepsilon^3)$, where $Q_1,Q_2$ are explicit quadratic forms in the feedback sequences. They are built from the burst tails $T_m=\Pr(K\ge m)$ and $V_n=\sum_{k\ge n}p_k/(k+1)$. No third moment is needed.

**Why geometric is special.** The linear feedback $h_m=m$ is a null direction: $Q_p(v)=0$. The derivative of $Q_p$ at $v$ in direction $e_j$ is $D_j=\kappa\sum_{m\ge j}(T_m-Bp_m)/(m+1)$. The tilt lemma shows that all $D_j$ vanish, or are proportional to $T_j$, only when $T_j=Bp_j$ for every $j$, which is the memoryless property of the geometric law. For a nongeometric law some $D_j\ne0$. Tilting $v$ slightly in that coordinate makes $Q_p$ negative. Truncating, so the feedback is bounded and eventually constant, and rescaling then give a valid loop with both Fano factors below baseline.

**Pairs.** For two laws the direction $w=(B_1v,B_2v)$ is a common zero of $Q_1$ and $Q_2$. The gradients at $w$ are explicit, and the tilt lemma shows they admit no nonnegative linear dependency unless both laws are geometric. By compactness and Gordan's theorem of the alternative, a single direction on finitely many levels then decreases both forms at once.

**Stability.** Theorem 3 follows Anderson's stationary information-flow argument. In it, geometricity enters only through the identity $p_k=\Pr(K\ge k)/\kappa$. Splitting $p=q+(p-q)$ leaves a remainder bounded by the oscillation of the conditional production rate times $\Delta_i$. The equilibrium transform and its geometric fixed point are classical (Peköz, Röllin and Ross). The convergence and cancellation facts come from lemmas of Anderson's preprint, which the paper states with their hypotheses checked for this model.

**What is known and what is new.** Geometric sufficiency, the counterexamples on $\{1,2\}$ and the opposing-feedback loop are Anderson's. The paper's formula reduces exactly to his expression $r(2c-d)(2c+dr-d)/6$ for those laws. The new content is the converse for every nongeometric law with finite second moment, the classification for pairs and the stability bound.

## Evidence, assurance and limitations

- **Proofs:** every result has a written proof. The response expansion is carried out on the infinite state space, not a truncation.
- **Exact checks:** two standard-library scripts expand the stationary generator equations exactly through two births and match the closed-form coefficients in five common-law and four pair cases. They also check the null direction and gradient formulas, and certify both worked examples in rational arithmetic, with a rigorous tail enclosure for the geometric law. These checks confirm finite identities and examples; the universal statements rest on the written proofs.
- **Replay:** all scripts were rerun from a clean extraction of the frozen archive in normal and optimised Python, with identical outputs and byte-identical result files. GitHub CI repeats this on Linux. Nine semantic negative controls corrupt a coefficient, swap repression for activation, remove the descent direction or change the geometric parameter; each must be rejected, and all are.
- **Dependence on a preprint:** Theorem 3, and through it the geometric direction, uses lemmas from Anderson's unrefereed preprint. The new converse directions use only the response lemma and elementary algebra.
- **Review:** internal AI-assisted review only. It comprised a five-role first round, an outside-model adversarial review and a re-review with proof audit of the revision. No reviewer found a counterexample; one load-bearing gap in the stability proof was repaired by stating the preprint results used. There has been no external peer review, no independent reproduction and no formal verification.
- **Scope:** effects of order $10^{-6}$ at very low abundances; numerical stationary solutions are illustrations; priority holds only within a bounded search.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Theorists of stochastic gene expression and noise control | A complete answer to which burst laws enforce the kinetic uncertainty trade-off, for one law and for pairs | Effects are tiny and at very low copy numbers; large-copy behaviour is open |
| Probabilists and queueing theorists | A network characterisation of the geometric law through the equilibrium transform | The stability bound is aggregate and not known to be sharp |
| Experimental and systems biologists | A reason why the full burst-size law, not just its mean and variance, decides whether feedback can beat the baseline | No experimental data; the model omits explicit mRNA lifetimes and burst-size regulation |
| Research agents | Machine-readable claims, exact witnesses and replayable checkers | The checks confirm finite identities and examples, not the universal theorems |

## Why the problem matters

Kinetic uncertainty relations are proposed as universal limits on how well cells can control noise by feedback. Whether such a limit holds depends on modelling choices, and burst size is one of the most important. Anderson's results left a gap between the geometric case, where the limit holds, and a few special laws, where it fails. This paper closes the gap: the limit is a property of the geometric law itself. Any departure from geometric bursts, however small, removes the guarantee in principle, although the possible gain is minute. The stability bound measures how gracefully the limit degrades.

## How to inspect or reproduce the recorded checks

From the GitHub release or the Zenodo archive, with Python 3:

```sh
shasum -a 256 -c SHA256SUMS
python3 -B -I -O burst_independent_exact.py           # common-law expansions, -19/11520 and its ε range
python3 -B -I -O pair_exact.py OUT.json               # pairs, null direction, gradients, pair example
cmp OUT.json pair_exact_results.json
python3 -B -I -O negative_controls.py                 # 9 tampered checkers must fail
```

To see the key example by hand, take $\Pr(K=1)=\tfrac23$, $\Pr(K=4)=\tfrac13$. Then $\mathbb EK=2$ and $\mathbb EK^2=6$, so $B=2$, as for the geometric law with mean 2. The tails $T=(1,\tfrac13,\tfrac13,\tfrac13)$ differ from $Bp=(\tfrac43,0,0,\tfrac23)$, so the law is not geometric and some $D_j\ne0$; indeed $D_2=\tfrac{23}{90}$. `AI_INDEX.md` maps every result to its evidence.

## The most valuable next projects

1. Classify tuples of three or more different burst laws.
2. Find the largest achievable suppression at a prescribed mean abundance, for example for the burst laws produced by non-exponential mRNA lifetimes.
3. Decide whether the trade-off is restored asymptotically at large copy numbers for every burst law.
4. Sharpen Theorem 3, and obtain specialist review of the preprint lemmas it uses.

## What is in the evidence package

The package contains:
- the 12-page manuscript (PDF and LaTeX) and its figure;
- two exact standard-library checkers and their result files;
- the numerical illustration scripts with pinned dependencies and their pair outputs;
- the semantic negative controls and the CI workflow;
- the revision response (rating-free), the dated novelty audit, intake target and fingerprints;
- the claim, status, assurance, provenance and research-gate records, and the citation audit;
- an agent index, licences (CC0-1.0 for text and data, MIT for code) and SHA-256 manifests.
