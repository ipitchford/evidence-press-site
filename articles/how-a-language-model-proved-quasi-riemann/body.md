*Written 10 October 2026, four days after OpenAI's mathematics release. It describes the public record on that date and the `openai/math` repository at commit `fd4aeeb` (7 October), still the head of its main branch. All of it may be overtaken by events, especially if OpenAI publishes a reasoning record for this result.*

On 6 October OpenAI released a catalogue of mathematical results produced by its models. Result family 003 claims a *quasi-Riemann hypothesis*: the Riemann zeta function has no zeros with real part greater than 7/8. This article asks two questions about it. What has actually been verified? And how did a language model find the proof?

The Lean file that states the result does not contain a proof. It is a nine-line *Comparator challenge*: a statement that the zeta function has no zeros with real part greater than 7/8, closed with `sorry`, Lean's placeholder for "proof supplied elsewhere". The proof lives in a separate solution module whose dependencies run to about 486,000 lines of Lean. Comparator, the Lean community's checking tool, confirms that this module proves exactly the challenge statement using only Lean's three standard axioms. Two outsiders have re-checked it. One re-ran Comparator, once with a second, independent proof kernel, and both runs passed; the other rebuilt the whole library without errors. Our own static scan of the module's dependencies found no escape hatches. On the formal evidence, the theorem should be treated as true.

How the model found the proof is much less well documented. OpenAI has released no reasoning summary for this result. Its repository says only that the zeta work was an exception to the usual three-hours-per-problem procedure. A magazine report adds that it was part of an attack on the Millennium Prize problems. Nevertheless, the proof itself, the dates on the companion papers and the ten reasoning summaries OpenAI did release support a fairly specific reconstruction:

- **No new theory.** The decisive moves were a bridge between two literatures that are rarely read together, a decision to keep terms that standard practice throws away, and the choice of a number field in which the arithmetic of exponents happens to work out. Everything else is long, careful, error-tolerant execution of known tools.
- **Machinery already in hand.** The route almost certainly ran through cubic Gauss sums. The model had produced a paper on them five days before the zeta paper.
- **Long proofs became affordable.** Formal verification at industrial scale is what made a 199-page proof with exponent margins as thin as 1/1200 worth pursuing.

All three ingredients can be reproduced in principle. The third, automatic formalisation at the scale of hundreds of thousands of lines, is the hardest to copy and probably matters most.

The rest of this article sets out what is established, then the anatomy of the proof, then the evidence about process, and finally what another system would need.

## What the Lean file is, and what has been verified

The challenge file contains one theorem, `OAI.riemannZeta_ne_zero_of_seven_eighths_lt_re`. It says that $\zeta(s)\neq 0$ whenever $\operatorname{Re} s > 7/8$, and its body is `sorry`. That is deliberate. A configuration file beside it, `QuasiRiemannHypothesis.json`, names the solution module, `OAI.NumberTheory.DirichletL.Nonvanishing`, and fixes the permitted axioms as `propext`, `Quot.sound` and `Classical.choice`. Comparator checks three things:

- the solution states exactly the same theorem as the challenge;
- it uses no other axioms;
- the Lean kernel accepts it when the whole environment is replayed inside a sandbox.

Sister challenges cover the same bound for every Dirichlet $L$-function and for every finite-order Hecke $L$-function over $\mathbb{Q}(\sqrt{-3})$. A further challenge covers a uniform $c/\log q$ exclusion of Landau–Siegel zeros.

![Three layers of evidence. A nine-line challenge states the theorem and ends in sorry. Comparator links it to a 2,924-module solution and checks three things. One outside checker re-ran Comparator, also with a second kernel; another rebuilt the whole library. Our static scan searched the import closure for escape hatches and found none.](/assets/articles/quasi-riemann-verification.svg "What has and has not been checked, as of 10 October 2026. The kernel-level checks were run by third parties; the Evidence Press scan is a screen, not a substitute for them. The check certifies the Lean theorem, not the prose of the 199-page paper.")

We traced every `import` from the solution module through OpenAI's library and scanned each file for the constructs that could weaken a kernel-checked proof. The scan covered:

- `sorry` and `admit`;
- new `axiom` declarations;
- `native_decide`, which trusts compiled code;
- `implemented_by`, `extern`, `unsafe` and `opaque`;
- custom `syntax`, `macro` and `elab` definitions.

The closure contains 2,924 OpenAI modules and 486,483 lines once comments are removed, and none of these constructs appears. The only outside dependencies are Mathlib and two external libraries, PrimeNumberTheoremAnd and RellichKondrachov. Our counts agree with the two independent re-checks. Dave Goldblatt reports 2,924 modules and 486,490 lines. He ran Comparator with OpenAI's configuration and then again with the second kernel, `nanoda`, switched on. Both runs accepted the proof with only the three standard axioms. A second checker, under the handle tomoto0, rebuilt the full closure: 2,924 modules, about four hours on eight cores, no errors.

Four caveats matter:

- **The second kernel is off in OpenAI's own configuration** for this challenge, as it is in all but two of the 416 configurations at commit `fd4aeeb`. Dual-kernel acceptance therefore rests on Goldblatt's single run.
- **Part of the build runs outside the sandbox.** Setting up the build applies patches to dependencies, so a deliberately adversarial repository could in principle interfere. Nobody has suggested this one does.
- **The statement includes $s=1$.** There Mathlib gives $\zeta$ a conventional, nonzero value, so the new content is the strip $7/8<\operatorname{Re} s<1$.
- **The Hecke statement relies on OpenAI's own definition** of the $L$-function, written out in the challenge file. The zeta and Dirichlet statements use Mathlib's definitions, which leaves no room for a definitional sleight of hand.

The formal check certifies the theorem, not the prose of the 199-page paper. For the theorem itself, the residual risk is a bug in Lean, in Mathlib's kernel-facing infrastructure or in Comparator. That risk is not zero, but it is small.

This puts family 003 on firmer ground than most of the release. About 42% of the top-line results are formalised. On 7 October OpenAI withdrew three Hodge-related papers because of a sign error.

## Two adjustments to the framing

The first concerns uniqueness. The quasi-Riemann hypothesis is not the only claim in the catalogue that specialists thought out of reach. The same release claims a negative solution of Hilbert's tenth problem over $\mathbb{Q}$, Erdős's conjecture that sets with divergent reciprocal sums contain arbitrarily long arithmetic progressions, an isomorphism between free group factors, a counterexample to Sidorenko's conjecture, and a counterexample to the hyperinvariant-subspace problem.

Two features set family 003 apart. It is formally verified from Mathlib's own definition of $\zeta$. And it breaks a barrier that had not moved in shape since de la Vallée Poussin's 1899 zero-free region. Every unconditional region since then, including the Vinogradov–Korobov region, has narrowed towards the line $\operatorname{Re} s = 1$ as the height grows. A strip of fixed width was widely regarded as hopeless. Several reactions say so directly:

- Alex Kontorovich wrote that if a human had done this, "it would be an instant Fields Medal".
- Ben Green called it "absolutely shocking".
- Jakob Glas said he had believed there was a "broad consensus among mathematicians" that the quasi-Riemann hypothesis was "completely out of reach".

The second adjustment concerns the claim that the result is beyond what human mathematicians could produce. The *statement* agrees with conventional wisdom. Will Sawin, on MathOverflow, places it among the results that probabilistic heuristics in number theory had predicted. The surprise lies in feasibility, not in truth. Every tool the proof uses was published by 2024. The human-edited write-up of the weaker 11/12 version runs to 49 pages, so the core argument is far more compact than the 199-page original suggests.

It is more accurate to say that the parts were on the shelf but nobody had connected them. That makes "how" a tractable question: a route was found, not a new foundation laid.

## Anatomy of the argument

The clearest account is the 5 October companion paper, which proves the half-plane $\operatorname{Re} s > 11/12$ and which OpenAI says was edited by a person for readability. We follow it in six steps, because each one shows where the creative work lay.

![The route from a Möbius sum to a zero-free half-plane, in eight stages. Gold marks the three moves this article identifies as new; ivory marks known tools. The decisive turn is the Gauss-sum identity that absorbs the Möbius function into a cubic Gauss sum, the Fourier coefficient of Kubota's cubic theta function.](/assets/articles/quasi-riemann-route.svg "A reading of the 11/12 companion paper, simplified. Labels name the tools each stage uses; the figure shows logical order, not the order in which the model found the steps, which is unrecorded.")

**The choice of field.** Everything happens over the Eisenstein integers $\mathcal{O}=\mathbb{Z}[\omega]$, with $\omega = e^{2\pi i/3}$, the integers of $K=\mathbb{Q}(\sqrt{-3})$. For a Dirichlet character $\chi$, the Hecke $L$-function of $\chi$ composed with the norm factorises, apart from finitely many Euler factors:

$$
L_K(s,\chi\circ N) = L(s,\chi)\,L(s,\chi\chi_{-3}).
$$

So a zero-free half-plane for Hecke $L$-functions over $K$ passes straight to every Dirichlet $L$-function, including $\zeta$.

$K$ is chosen because it contains the cube and sixth roots of unity. Sextic residue symbols are therefore defined there, and so is Kubota's cubic theta function, the automorphic object the proof needs. Jared Duker Lichtman made the same point soon after the release: the cubic family appears essential even for the corollary about $\zeta$.

**Reduction to a Möbius sum.** A smoothed Möbius sum twisted by a Hecke character is defined as

$$
A_1(D) = \sum_{\mathfrak n}\mu(\mathfrak n)\nu(\mathfrak n)W(N\mathfrak n/D).
$$

If $A_1(D) \ll D^{\theta+\varepsilon}$, then $L_K(s,\nu)$ has no zeros with $\operatorname{Re} s>\theta$. This is the Hecke version of Littlewood's classical equivalence between the Riemann hypothesis and square-root cancellation in $\sum_{n\le x}\mu(n)$. Nothing here is new.

**Embedding and amplification.** The model embeds $A_1$ in a family twisted by the sextic residue symbol $\chi_n(u)=(u/n)_6$:

$$
A_u(D)=\sum_{\mathfrak n}\mu(\mathfrak n)\nu(\mathfrak n)\chi_n(u)\,W(N\mathfrak n/D).
$$

The key observation is elementary. If $u=p^6$ is the sixth power of a prime, then $\chi_n(p^6)=1$ unless $p$ divides $n$, so

$$
A_{p^6}(D) = A_1(D) + O(D/Y)\quad\text{for } N(p)\approx Y.
$$

The target sum therefore appears, almost unchanged, in about $Y/\log Y$ rows of the family. Suppose the whole family satisfies the bound for square-root cancellation on average,

$$
\sum_{N(u)\le H}|A_u(D)|^2 \ll D^{1+\varepsilon}H,\qquad H=D^{1+\vartheta},
$$

and take $Y = H^{1/6}$. Then

$$
|A_1(D)|^2\ll D^{1+\varepsilon}H^{5/6}+D^2/Y^2.
$$

We recomputed the exponents in exact arithmetic. At $\vartheta = 1/10$ the two terms are $D^{23/12}$ and $D^{49/30}$, so $A_1 \ll D^{23/24}$, matching the paper's general formula $11/12+5\vartheta/12$. As $\vartheta\to 0$ the bound tends to $D^{11/12}$, which gives the 11/12 half-plane.

This step turns a convention on its head. The large-sieve inequalities in the literature restrict rows to squarefree values, because power rows carry no cancellation for general coefficients. That holds for Heath-Brown's quadratic large sieve and for the sextic large sieve proved in the 7/8 paper itself. The proof keeps exactly those rows and uses them as copies of the target.

There is a consequence. With power rows included, the family bound cannot follow from the size of the coefficients alone. The $H^{1/6}$ sixth-power rows contribute about $H^{1/6}D^2$ when the coefficients do not cancel. That exceeds $DH$ whenever $\vartheta<1/5$, and the paper uses $\vartheta \le 1/10$.

A toy version over the ordinary integers, with quadratic symbols, shows the effect. Take odd squarefree $n\le 4{,}000$ and rows $u\le 8{,}000$:

| Coefficients | Share of mean square in the 89 square rows | Mean square ÷ $DH$ |
|---|---|---|
| Constant | 95.5% | 5.67 |
| Möbius | 4.1% | 0.31 |

The square rows are 1.1% of all rows. With constant coefficients they carry almost all the mean square and push it well above $DH$. With Möbius coefficients they do not.

So the family bound is a statement about the Möbius function specifically. Any proof of it must use some structure that $\mu$ has and generic sequences lack. The next step supplies that structure.

**The bridge.** Poisson summation in the row variable $u$ turns the sextic characters into sextic Gauss sums. A Gauss-sum identity going back to Hasse and used by Heath-Brown then does something unexpected. For squarefree primary $n$ outside a fixed set of excluded primes, with $\gamma_j$ the normalised Gauss sum of the $j$-th power of the sextic character,

$$
\mu(n)\gamma_{-1}(n)=\chi_n(-1)\,G(n)^{-1}\,\overline{\alpha(n)}\,\gamma_2(n).
$$

Here $G(n)$ and $\alpha(n)=n/|n|$ are fixed, well-understood factors. The Möbius function is *absorbed*: the product of $\mu$ with one Gauss sum becomes a cubic Gauss sum.

By Patterson's 1977 formula, cubic Gauss sums are Fourier coefficients of Kubota's cubic theta function, an automorphic form on a metaplectic cover. A question about the random-looking signs of $\mu$ has become a question about the coefficients of an automorphic form, and automorphic forms come with transformation laws.

We regard this as the conceptual heart of the proof. The identity was known. Using it to convert a zero-free-region problem into a metaplectic one apparently was not.

**The numerical coincidence.** Applying the theta function's transformation law changes the twisting character. At a prime dividing the new row variable, the Fourier and theta factors combine as $\chi^{-1}\cdot\chi^{-2}$. The product is $\chi^{-3}=\chi^{3}$, which is *quadratic*, because the sextic character has order six.

A quadratic twist allows the near-optimal quadratic large sieve of Heath-Brown, generalised to number fields by Goldmakher and Louvel. Its loss factor is $M+L$ rather than the extra $(ML)^{2/3}$ in the general $n$-th order large sieve of Blomer, Goldmakher and Louvel. The chain closes only because $1+2=3$ and $6/2=3$. This is presumably the kind of thing meant by the "amazing numerical coincidences" that a friend of Lichtman's saw in the cubic machinery.

**The recursion.** Expanding the theta function introduces extra cube factors. These are removed by Möbius inversion, which leaves a remainder of the same type at smaller scales. Two further Poisson summations, from Gauss sums back to Möbius coefficients and then to Gauss sums again, shrink both scales while keeping their ratio fixed. A finite iteration finishes the argument. This is Heath-Brown's 1995 method of self-improving exponents, applied to a new family.

**From 11/12 to 7/8.** The 30 September paper reaches 7/8 by a different organisation of the same machinery. It works with the supremum $\beta_*$ of the real parts of zeros across the whole Hecke family, assumes $\beta_* > \sigma_0$, and derives a contradiction. The vehicle is a continuation criterion built on affine exponents:

| Boundary $\sigma_0$ | $C(s)$ | $C(\sigma_0)$ |
|---|---|---|
| 11/12 | $s-2/3$ | $1/4$ |
| 7/8 | $s-11/16$ | $3/16$ |

Both values reproduce exactly. The argument runs through a "zero detector", which turns each row carrying a zero into two simultaneously large Dirichlet polynomials. The paper's first stage reaches 11/12 using only one of them in its row count. The second stage starts from that conclusion and adds:

- two further moment estimates;
- compensation by selected prime factors;
- unequal averaging scales.

The paper's own table of exponent margins for the first stage has a smallest entry of $1/1200 \approx 0.00083$.

**How far the method can go.** Acer, a Cambridge student who posted that he had been part of the OpenAI team, wrote that "the method has a barrier at 3/4". The amplification step suggests why, although this is our inference. If the target is reproduced by $k$-th-power rows, the same arithmetic gives an exponent of $1-1/(2k)$: 11/12 for $k=6$ and 3/4 for $k=2$. There is no smaller power to use. The 7/8 boundary happens to equal the $k=4$ value, but the paper reaches it by the refinements just listed, so we would not read the numerology as the mechanism. The tomoto0 audit argues separately that this apparatus cannot reach 1/2. Its model computations, which it describes as optimistic, find that re-running the paper's own exponent formulas improves on 7/8 only marginally, to about 0.8745. That is a statement about the present formulas, not about the wider method that Acer's 3/4 refers to.

**The Siegel-zero paper is a different kind of argument.** The nine-page proof that $(1-\beta)\log q$ is bounded below has nothing to do with theta functions. It imports the *interpolation-determinant* method from transcendence theory. A real zero close to 1 forces most small primes to have $\chi(p)=-1$. Those primes act through Frobenius on the field $\mathbb{Q}(\sqrt d,\sqrt2)$ and make a certain determinant divisible by many primes. Prime divisibility contributes $\log U$ to a lower bound, while the archimedean size bound is only $\log N=\tfrac34\log U$.

The argument also passes the "does it prove too much?" test. Without an exceptional zero, the primes with $\chi(p) = -1$ carry only half the logarithmic mass. Since $1/2<3/4$, there is no contradiction, as there should not be.

So within a week the model produced two unrelated advances in the same corner of analytic number theory, each drawing on a different distant field.

## How the model probably got there

### What is on record

OpenAI has published no reasoning summary for family 003. The ten summaries it did release cover other results, and none of them mentions zeta functions, zero-free regions or Gauss sums.

The repository's README says most results came from a fixed procedure: about three hours of ChatGPT Pro thinking compute per result, across roughly 4,000 posed problems. It names the zeta zero-free work and the Hodge conjecture for abelian varieties with complex multiplication among the exceptions. It does not say how they were exceptional.

Quanta reported that both exceptions were pursued as part of work on Millennium Prize problems and needed more than nominal compute. OpenAI's 8 September Navier–Stokes post describes that context:

- training of a new internal model began on 28 August;
- on 1 September OpenAI began evaluating it on all the open Millennium problems;
- the Navier–Stokes group alone ran on the order of 10,000 coordinating agents, with tools that included running code, and later redirected agents from other Millennium problems.

Acer's post says he watched the model make progress on this problem first-hand as part of the team.

The dates on the manuscripts complete the picture:

| Date | Manuscript |
|---|---|
| 25 Sept | An unconditional proof of Patterson's first-moment conjecture for cubic Gauss sums (Dunn and Radziwiłł's 2024 *Annals* proof had assumed the Generalised Riemann Hypothesis, GRH) |
| 30 Sept | The 7/8 paper |
| 1 Oct | The Siegel-zero paper |
| 4 Oct | A paper on Artin's primitive-root conjecture. According to Sawin it contains a third, weaker zero-free half-plane, valid over number fields containing the twelfth roots of unity |
| 5 Oct | The human-edited 11/12 version |

### Inferences, graded

*Strong.* This was a targeted, heavily resourced attempt on the Riemann hypothesis, run by a multi-agent system with people observing. The quasi-Riemann hypothesis is what that attempt could actually prove. The README's exception, Quanta's framing and Acer's post all point the same way.

*Moderate.* The route ran through the cubic Gauss-sum programme. The 25 September paper uses the same objects and normalisations as the zeta paper: primary generators, Patterson's coefficients and Dunn and Radziwiłł's conventions. To remove Dunn and Radziwiłł's GRH assumption, one must control sums over primes, or of $\mu$, twisted by Hecke characters on exactly this family. An agent working on that would be pushed towards the relationship between $\mu$ and Gauss sums that later powers the zeta proof.

The 7/8 paper states that it does not *use* the first-moment theorem. The claim here is about the path of discovery, not about logical dependence. The alternative, that the zeta campaign started from zero-free regions and searched outward for a suitable family, cannot be ruled out without the reasoning record.

*Process.* The ten released summaries are edited, third-person accounts, not raw chains of thought, but they show a consistent pattern:

1. **Reformulation.** Problems are restated before they are attacked.
2. **Long serial search.** Between five and forty routes taken from the literature are tried and dropped, each rejected by a quantitative mismatch or a counterexample model.
3. **Named obstructions.** A recurring obstruction is named and then used to filter later attempts.
4. **"Does this prove too much?"** Candidate arguments are tested against Liouville numbers, extremal convex bodies or known algorithms.
5. **Lemma-level recombination.** Very recent papers, some from 2026, are combined theorem by theorem, with hypotheses checked.
6. **Imports from distant fields.** Complexity theory, coding theory and pluripotential theory each turn up.
7. **Recursion on scales.** Arguments induct over scales or depths.
8. **Explicit bookkeeping.** Parameters and the order of quantifiers are tracked openly.
9. **Chaining.** Earlier outputs are fed back as premises in later prompts.

Every element of the zeta proof matches one of these habits. The weaker result is followed by an upgrade (11/12, then 7/8), the scale recursion follows Heath-Brown, the theta functions are imported from metaplectic theory, and the margins are tracked explicitly. The same summaries also show self-audits that fail. In the summary on the irrationality exponent of $\pi$, a warning that the method seemed to prove too much was noticed and then set aside.

*Texture.* The 7/8 paper runs to 199 pages; the human-edited 11/12 paper to 49. The exponent margins go down to 1/1200, and the friend Lichtman quoted saw "amazing numerical coincidences" in the cubic machinery. This is what a search that keeps any route whose bookkeeping closes would produce, with none of the aesthetic pruning a human analytic number theorist would apply.

Humans prune long, fragile routes early, partly because checking them is so costly. A system backed by an automatic formaliser that can produce and check half a million lines does not face that cost. In our view this is the least discussed and most important causal factor. Verification changes which proofs are worth searching for.

### What the creative step consisted of

Four moves stand out:

- connecting the theory of zero-free regions to the theory of metaplectic theta functions;
- keeping the degenerate power rows as copies of the target;
- choosing a field in which the order of the dual twist drops to two;
- carrying a long recursive argument through with thin but positive margins.

The first three are combinatorial creativity of a high order: the right pieces recognised and assembled from different shelves. The fourth is stamina.

None of them requires a new kind of cognition. They do require something human specialists rarely have at once: working fluency, at the level of individual lemmas, in about ten separate specialist literatures. These run from Kubota's 1969 lectures through Heath-Brown's large sieves to Dunn and Radziwiłł's cusp expansions of 2024. They also require patience with a 199-page argument, and a cheap way to check it.

On why humans had not found the route, we can offer only hypotheses. The key tools are recent: Goldmakher and Louvel in 2013, Blomer, Goldmakher and Louvel in 2014, Dunn and Radziwiłł's preprint in 2021. Specialists believed the target was out of reach, which discourages long attempts. And the argument's thin margins make it unattractive to begin by hand. None of this can be tested until the reasoning record is published.

## What another system would need

The reconstruction suggests a practical recipe. Each element can be built into an agent pipeline today. For each one we give the instruction for the pipeline, followed by the evidence from this proof.

1. **Look for a family in which the target recurs, and amplify.** Make "in which family does my object occur many times?" a standard prompt for any problem that asks for a pointwise bound. Here the sixth-power rows did the work; elsewhere it might be translates, powers, Hecke operators or Galois conjugates.
2. **Mine for bridge identities.** Keep a catalogue of transfer identities: Gauss–Jacobi and Hasse–Davenport relations, reciprocity laws, Patterson-type coefficient formulas, Voronoi and Poisson summation. Search systematically for compositions that turn the hard coefficient sequence ($\mu$, $\Lambda$, the indicator of the primes) into coefficients of an object with a transformation law. Score each composition by where the dual twist lands. In this proof a quadratic twist meant a near-optimal large sieve, and that decided the outcome.
3. **Enumerate small discrete choices exhaustively.** Number fields with given roots of unity, character orders, row ranges and power types form a small, cheap search space, and exponents can be computed symbolically. A machine should never miss a combination because it looked unpromising.
4. **Audit against obstructions first.** Test every family bound against generic coefficients, as in the toy computation above. Ask whether a candidate argument would also prove the Riemann hypothesis, or exclude Siegel zeros with no exceptional zero present. The Siegel-zero paper's comparison of 3/4 against 1/2 is the model for this.
5. **Bank weaker milestones and chain them.** Prove the weaker exponent, then feed it back as a premise, as with 11/12 followed by 7/8. The released summaries show OpenAI's prompts doing exactly this.
6. **Put formal verification in the loop.** This is the hard part to copy. Without automatic formalisation at the scale of hundreds of thousands of lines, a 199-page analytic argument is effectively unrefereeable, and search will drift back towards short, elegant proofs. Generation is necessary, but selection by a trusted checker is what made this route rational.
7. **Spend compute on a heavy tail.** Most of the release came from a few hours per problem. The hardest results came from campaigns with many agents and cross-pollination between groups.
8. **Account for selection and error.** About 4,000 problems were posed; three papers were withdrawn within a day of release. Only successes are visible. Any attempt to reproduce this should log failures and audit claims externally, not rely on the generating model's self-review.

For systems with weaker base capabilities the binding constraints are probably threefold:

- recall of narrow specialist literatures at the level of individual lemmas;
- coherence over arguments hundreds of pages long;
- the formalisation pipeline.

Retrieval over full texts and disciplined decomposition into lemmas can partly substitute for the first two. The third is an engineering investment in its own right.

## What remains unknown

Several questions remain open as of 10 October 2026:

- what the "exception to the procedure" consisted of, how much compute it used, and whether people suggested the cubic route or any intermediate target;
- whether the 7/8 argument contains slack that specialists will use to push the exponent further;
- the reasoning record itself. The Advisory Group on Mathematics and Artificial Intelligence asked laboratories to publish, with each result, the model's name, the prompts, a summarised chain of thought, the time taken and the estimated compute cost. For this result OpenAI has published none of these.

The formal verification settles the theorem. It does not settle understanding. We found no published assessment, as of 10 October 2026, from the specialists whose work the proof builds on most directly, such as Heath-Brown, Radziwiłł, Dunn, Goldmakher or Blomer. Their reading will be the best test of whether the reconstruction above captures how the proof works.

## How our checks were made

The static scan, the exact recomputation of exponents and the toy computation were run on 10 October 2026 against `openai/math` at commit `fd4aeeb`. The scan reads source files; it does not run Lean, Comparator or a proof kernel, so it is a screen and not a substitute for the third-party kernel checks cited above. A mechanical cross-check confirmed that the twenty numerical claims drawn from the scan, the computations, the papers' texts and page counts, and the repository's history file match their sources. The scripts, their outputs and our working notes on the reasoning summaries and on reception are [in the Evidence Press repository](https://github.com/ipitchford/evidence-press-site/tree/8f8ba1f3d8072208e19fa70b5523ccf30d72defc/docs/article-checks/how-a-language-model-proved-quasi-riemann), with commands for rerunning them.

## Sources

### OpenAI release and manuscripts

OpenAI. (2026, October 6). *Sharing AI progress in mathematics*. [https://openai.com/index/sharing-ai-progress-in-mathematics/](https://openai.com/index/sharing-ai-progress-in-mathematics/)

OpenAI. (2026, September 8). *An OpenAI model proposes a solution to the Navier–Stokes problem*. [https://openai.com/index/navier-stokes-solution/](https://openai.com/index/navier-stokes-solution/)

OpenAI. (2026). *openai/math* [Repository; README, history.md, overview.tex and CONTENTS.md at commit fd4aeeb, 7 October 2026]. GitHub. [https://github.com/openai/math](https://github.com/openai/math)

OpenAI. (2026, September 30). *The quasi-Riemann hypothesis: A zero-free half-plane Re(s) > 7/8* [Preprint]. [https://github.com/openai/math/blob/main/preprints/The-Quasi-Riemann-Hypothesis-September-30-2026/paper.pdf](https://github.com/openai/math/blob/main/preprints/The-Quasi-Riemann-Hypothesis-September-30-2026/paper.pdf)

OpenAI. (2026, October 5). *The quasi-Riemann hypothesis* [Preprint, alternate 11/12 proof, written with human assistance]. [https://github.com/openai/math/blob/main/preprints/The-Quasi-Riemann-Hypothesis-October-5-2026/paper2.pdf](https://github.com/openai/math/blob/main/preprints/The-Quasi-Riemann-Hypothesis-October-5-2026/paper2.pdf)

OpenAI. (2026, October 1). *Uniform exclusion of Landau–Siegel zeros* [Preprint]. [https://github.com/openai/math/blob/main/preprints/Uniform-exclusion-of-Landau-Siegel-zeros-October-1-2026/paper.pdf](https://github.com/openai/math/blob/main/preprints/Uniform-exclusion-of-Landau-Siegel-zeros-October-1-2026/paper.pdf)

OpenAI. (2026, September 25). *An unconditional first moment for cubic Gauss sums* [Preprint]. [https://github.com/openai/math/blob/main/preprints/An-unconditional-first-moment-for-cubic-Gauss-sums-September-25-2026/paper.pdf](https://github.com/openai/math/blob/main/preprints/An-unconditional-first-moment-for-cubic-Gauss-sums-September-25-2026/paper.pdf)

OpenAI. (2026). *Summarized chain of thought* [Ten reasoning summaries]. [https://github.com/openai/math/tree/main/reasoning_traces](https://github.com/openai/math/tree/main/reasoning_traces)

### Formal verification

OpenAI. (2026). *QuasiRiemannHypothesis.lean* and *QuasiRiemannHypothesis.json* [Comparator challenge and configuration]. [https://github.com/openai/math/tree/main/lean/ComparatorChallenges](https://github.com/openai/math/tree/main/lean/ComparatorChallenges)

OpenAI. (2026). *The quasi-Riemann hypothesis: Scope of the Lean formalization* (lean/docs/003.md). [https://github.com/openai/math/blob/main/lean/docs/003.md](https://github.com/openai/math/blob/main/lean/docs/003.md)

leanprover. (n.d.). *comparator* [Software]. GitHub. [https://github.com/leanprover/comparator](https://github.com/leanprover/comparator)

Goldblatt, D. (2026, October 6–7). *openai-zeta-proof-check* [Repository]. GitHub. [https://github.com/davegoldblatt/openai-zeta-proof-check](https://github.com/davegoldblatt/openai-zeta-proof-check)

tomoto0. (2026, October 7). *quasi-riemann-hypothesis-7-8-verification* [Repository]. GitHub. [https://github.com/tomoto0/quasi-riemann-hypothesis-7-8-verification](https://github.com/tomoto0/quasi-riemann-hypothesis-7-8-verification)

### Reception and reporting

Kontorovich, A. [@AlexKontorovich]. (2026, October 6). *Quasi-RH?!?!???! Are you kidding me?* [Post]. X. [https://x.com/AlexKontorovich/status/2107609087902941646](https://x.com/AlexKontorovich/status/2107609087902941646)

Acer [@AcerFur]. (2026, October 6). *It will always be the highlight of my career…* [Post]. X. [https://x.com/AcerFur/status/2107598008036806912](https://x.com/AcerFur/status/2107598008036806912)

Acer [@AcerFur]. (2026, October 6). *I hope this is a gift of knowledge to humanity…* [Post]. X. [https://x.com/AcerFur/status/2107605089225691372](https://x.com/AcerFur/status/2107605089225691372)

Lichtman, J. D. [@jdlichtman]. (2026, October 6). *While reading their proof, important note* [Post]. X. [https://x.com/jdlichtman/status/2107616346850927090](https://x.com/jdlichtman/status/2107616346850927090)

Lichtman, J. D. [@jdlichtman]. (2026, October 8). *In the case of quasi RH, the outline in Section 2…* [Post]. X. [https://x.com/jdlichtman/status/2108149282213933089](https://x.com/jdlichtman/status/2108149282213933089)

MathOverflow. (2026, October 8–9). *How many of the results released by OpenAI went against the conventional mathematical wisdom?* [Question 515849, answers by W. Sawin, P. Nielsen and others]. [https://mathoverflow.net/questions/515849](https://mathoverflow.net/questions/515849)

Proofs and Prompts. (2026, October 8; updated October 9). *100 reactions to 100 solutions*. [https://proofsandprompts.com/2026/10/08/100-reactions-to-100-solutions/](https://proofsandprompts.com/2026/10/08/100-reactions-to-100-solutions/)

Quanta Magazine. (2026, October 6). *Transformation* [Live updates page]. [https://www.quantamagazine.org/updates/transformation/](https://www.quantamagazine.org/updates/transformation/)

Wired. (2026, October 6). *OpenAI is pissing off a bunch of mathematicians again*. [https://www.wired.com/story/openai-is-pissing-off-a-bunch-of-mathematicians-again/](https://www.wired.com/story/openai-is-pissing-off-a-bunch-of-mathematicians-again/)

Advisory Group on Mathematics and Artificial Intelligence. (2026, September 29). *Responsible release of AI-generated mathematics*. [https://agmai.org/general-sep29/](https://agmai.org/general-sep29/)

### Prior literature used by the proof

Blomer, V., Goldmakher, L., & Louvel, B. (2014). L-functions with n-th-order twists. *International Mathematics Research Notices, 2014*(7), 1925–1955. [https://doi.org/10.1093/imrn/rns257](https://doi.org/10.1093/imrn/rns257)

Dunn, A., & Radziwiłł, M. (2024). Bias in cubic Gauss sums: Patterson's conjecture. *Annals of Mathematics, 200*(3), 967–1057. [https://doi.org/10.4007/annals.2024.200.3.3](https://doi.org/10.4007/annals.2024.200.3.3)

Goldmakher, L., & Louvel, B. (2013). A quadratic large sieve inequality over number fields. *Mathematical Proceedings of the Cambridge Philosophical Society, 154*(2), 193–212. [https://doi.org/10.1017/S0305004112000370](https://doi.org/10.1017/S0305004112000370)

Heath-Brown, D. R. (1995). A mean value estimate for real character sums. *Acta Arithmetica, 72*(3), 235–275. [https://doi.org/10.4064/aa-72-3-235-275](https://doi.org/10.4064/aa-72-3-235-275)

Heath-Brown, D. R. (2000). Kummer's conjecture for cubic Gauss sums. *Israel Journal of Mathematics, 120*, 97–124. [https://doi.org/10.1007/s11856-000-1273-y](https://doi.org/10.1007/s11856-000-1273-y)

Heath-Brown, D. R., & Patterson, S. J. (1979). The distribution of Kummer sums at prime arguments. *Journal für die reine und angewandte Mathematik, 310*, 111–130. [https://doi.org/10.1515/crll.1979.310.111](https://doi.org/10.1515/crll.1979.310.111)

Kubota, T. (1969). *On automorphic functions and the reciprocity law in a number field*. Kinokuniya. [http://hdl.handle.net/2433/84907](http://hdl.handle.net/2433/84907)

Patterson, S. J. (1977). A cubic analogue of the theta series. *Journal für die reine und angewandte Mathematik, 296*, 125–161. [https://doi.org/10.1515/crll.1977.296.125](https://doi.org/10.1515/crll.1977.296.125)

### Background for the banner

Mossinghoff, M. J., Trudgian, T. S., & Yang, A. (2022). *Explicit zero-free regions for the Riemann zeta-function* [Preprint]. arXiv:2212.06867. [https://arxiv.org/abs/2212.06867](https://arxiv.org/abs/2212.06867)

*Original article and illustrations: CC0 1.0. Quotations and third-party materials retain their respective rights.*
