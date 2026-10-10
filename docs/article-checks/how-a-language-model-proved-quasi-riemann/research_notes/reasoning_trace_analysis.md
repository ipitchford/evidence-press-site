# Analysis of OpenAI's ten released reasoning summaries

Prepared 10 October 2026 by a research subagent from a sparse clone of `openai/math` (commit fd4aeeb). Text was extracted with `pdftotext`; page numbers are PDF pages. These notes are model-written working notes, checked against the source PDFs only where the main essay relies on them.

## What the documents are

The README calls them "abridged summaries of the model's reasoning". Nine PDFs are headed "Summarized chain of thought", author "OpenAI"; the 221 summary has no such header and ships with a .tex source. Each is an edited third-person narrative ("the assistant …"), interspersed with boxed "VERBATIM EXCERPT" passages, which are the only raw model text and are telegraphic. Prompts appear only as excerpts. The narration hedges and sometimes passes judgement (for example, 362 p.5 says a cited continuation theorem does not by itself establish the needed estimates). They are selective summaries, not raw chains of thought, and they do not certify correctness.

| Trace | Pages | Words (approx.) | Sections | Verbatim boxes |
|---|---|---|---|---|
| 007 Two-point correlations of multiplicative functions | 7 | 2,600 | 5 | 4 |
| 017 Irrationality exponent of π | 42 | 16,000 | 45 | 69 |
| 087 Symmetric and general Mahler conjectures | 45 | 20,900 | 49 | 52 |
| 102 NP-hardness at the BasicSDP threshold | 16 | 7,700 | 12 | 10 |
| 159 Quasipolynomial bounds for arithmetic progressions | 41 | 19,200 | 39 | 54 |
| 197 Kaplansky direct finiteness, characteristic two | 23 | 11,000 | 23 | 25 |
| 221 Mézard–Parisi formula | 5 | 1,700 | 3 | 2 |
| 271 Spontaneous magnetisation, quantum Heisenberg ferromagnet | 6 | 2,500 | 6 | 2 |
| 287 Free group factor isomorphism | 11 | 4,900 | 7 | 8 |
| 362 Relativistic Vlasov–Maxwell | 6 | 2,000 | 5 | 1 |

No trace contains: figures for time, tokens or compute; any mention of running code, numerical experiments, computer algebra or Lean; any human intervention during a run (human or pipeline input appears only as prompts, including follow-up prompts that feed earlier outputs back in); a derivation of several finely tuned constants.

## Per-trace notes (condensed)

- **007.** About eight routes dropped first (entropy decrement, adelic kernels, equilibrium states, Tao–Teräväinen ranges too short, a polynomial substitution with too sparse an image). Key idea: an adaptation of Pilatte's centred divisor-graph method to a single scale, splitting primes into heavy uncentred "core" primes and centred "marks". Part II imports Braverman's theorem that polylogarithmic independence fools AC0 circuits. Several self-corrections; explicit parameter bookkeeping. The parity problem is never named as a barrier.
- **159.** More than 25 routes tried (Kelley–Meka extensions, transference, restriction, entropy, slice rank, hypercontractivity). A recurring named obstruction ("rare holes"). Pivot to density increment with the Leng–Sah–Sawhney inverse theorem; key ideas include "packets" of increments with a large fixed gain and additive rank growth controlled by a potential. Part II is a follow-up prompt asking it to use its previous bounds. Uses an earlier OpenAI paper.
- **017.** Restates Flint–Hills convergence as a continued-fraction criterion; over 30 construction families tried, nearly all failing against one height-versus-nonvanishing obstruction. Key idea: a Roth/Dyson-style argument with several approximants, with nonvanishing from an ampleness argument on a blow-up. Tests arguments against Liouville numbers to catch ones that prove too much. A warning that the parameters seemed to allow every exponent above 2 was noticed, checked against the Dirichlet barrier, and set aside; Part II then claims exponent 2.
- **087.** Pluripotential-theory import (Lundin extremal function, Baran metric) for the symmetric case; long search for the general case; final route via Gaussian projection fields and a Riccati equation, reduced to positivity of degree-30 and degree-32 polynomials, which the summary says remain conditional. Many tests on extremal bodies and checks that reformulations did not silently strengthen the problem.
- **102.** First reframes the target as already implying Unique Games hardness; explicit cheating strategies break several tests; key gadget is a shift-equivariant nonlinear decoder over F_{2^d}, composed with Håstad, Khot–Minzer–Safra, parallel repetition and Raghavendra's transfer; consistency checks against known algorithms.
- **197.** Searches both for a proof and a counterexample; a self-built free-group graph state refutes one of its own premises; pivot inspired by quantum LDPC and high-dimensional-expander codes; checks why the construction cannot lift to characteristic zero; long audit against sofic, surjunctive and Farrell–Jones results; soficity of the glued group left open.
- **221.** Prompt asks for a full resolution even if the problem is open and discourages computer-assisted proofs. Key recursive insight: an overfitted shared variable simulates the original model at a smaller scale; shift every branching depth by one level.
- **271.** Tóth's random-loop representation; key idea a stable generating polynomial giving negative dependence; downward induction over pin sets; narrow scoping of assumptions.
- **287.** About 20 invariants tried to show non-isomorphism, all failing on uncontrolled changes of generators; then switches sides, via an ergodic-theory analogy, to a proposed isomorphism.
- **362.** Residence-time arguments; a signed momentum bootstrap; the editor states the conclusion rests on estimates not yet proved.

## Cross-cutting patterns

1. Counterexample search in both directions early.
2. Reformulation before attack.
3. Literature recombination at the level of individual lemmas, with hypotheses checked.
4. Imports from distant fields (complexity theory, coding theory, pluripotential theory, algebraic geometry, ergodic theory).
5. Very recent sources, including 2025–26 preprints, apparently read during the run.
6. Naming a recurring obstruction and using it as a filter.
7. Explicit bookkeeping of parameters and quantifier order.
8. Amplification devices (packets, multiple approximants, parallel repetition).
9. Induction or recursion on scales or depths.
10. "Does this prove too much?" tests.
11. Classical barriers (parity, natural proofs, relativisation) are not explicitly invoked.
12. Long adversarial audits once a candidate exists, which do not always stop a doubtful claim.
13. Frequent enthusiasm ("Aha!") followed by refutation.

## Relevance to family 003

No trace mentions zeta, Dirichlet L-functions, zero-free regions, Gauss sums, Kubota, sextic symbols or the large sieve (confirmed by text search). The README's "exception to this fixed procedure" is not explained anywhere in the repository.
