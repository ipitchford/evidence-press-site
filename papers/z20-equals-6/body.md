## Summary

Take any network of 20 points, where each pair is either connected or not. Now sort the points into groups so that within each group, either everyone is connected to everyone else (a clique) or nobody is connected to anybody (an independent set). How many groups might you need, in the worst case?

Mathematicians call the answer for $n$-vertex graphs $z(n)$, and Paul Erdős and John Gimbel asked for its values decades ago. The answer was known for every size up to 19 vertices. At 20 vertices, it was known only that the answer is 6 or 7. This computer-assisted proof settles the first open case: $z(20) = 6$.

The proof has two halves with very different characters. The half showing that 6 groups are sometimes necessary is short enough to check by hand: it uses a famously symmetric network on 17 points, the Paley graph, in which no four points are mutually connected or mutually unconnected. The half showing that 6 groups always suffice is where computers earn their keep: every conceivable counterexample is funnelled, through a classical result of Ramsey theory, into two giant logical formulas, and each formula is proved impossible to satisfy — with certificates that four separate programs, one of them formally verified, have each confirmed.

## Summary for specialists

The cochromatic number $z(G)$ is the least number of colour classes partitioning $V(G)$ so that each class induces a clique or an independent set, and $z(n) = \max_{|V(G)|=n} z(G)$. Values are known for $n \leq 19$; erdosproblems.com lists $z(20) \in \{6, 7\}$ as the first open case. This release establishes $z(20) = 6$.

The lower bound is hand-verifiable: the Paley graph on 17 vertices has no homogeneous 4-set, so $z(\mathrm{Paley}(17)) \geq \lceil 17/3 \rceil = 6$. For the upper bound, since $R(4,4) = 18$, any hypothetical 20-vertex graph needing 7 classes is reduced to configurations built around the two non-isomorphic 16-vertex $(4,4)$-Ramsey graphs. The remaining cross-edge case analysis is encoded as two CNF formulas of 64 variables and 104,524 clauses each, and their unsatisfiability is certified with DRUP and LRAT proof objects, checked by a custom Python RUP checker, a C RUP checker, drat-trim, and the formally verified cake_lpr.

The release also recomputes $R(4,4) = 18$, regenerates the $(4,4)$-Ramsey catalogue, and reconfirms $z(8) \leq 3$ and $z(12) \leq 4$ as calibration. A companion release derives $\mathrm{VR}_2(K_4) = 20$ by reusing the same proof objects.

## Technical summary

The upper bound proceeds in three certified stages. First, since $R(4,4) = 18$, any 20-vertex graph $G$ with $z(G) \geq 7$ must, on every 18-vertex subset, contain a homogeneous 4-set; a counting argument concentrates the obstruction on induced subgraphs built around the two non-isomorphic $(4,4)$-Ramsey graphs on 16 vertices, whose catalogue the release regenerates from scratch. Second, the surviving configurations — cross-edges between the 16-vertex core and the remaining four vertices, together with the demand that no 6-class cocolouring exists — are encoded as two propositional formulas of 64 variables and 104,524 clauses. Third, both formulas are refuted: the DRUP certificates are produced by the solver, translated to LRAT, and accepted by four independent checkers with different trust bases (two hand-written RUP checkers in Python and C, the standard tool drat-trim, and cake_lpr, whose correctness is itself machine-checked down to machine code through the CakeML pipeline).

The lower bound is independent of all of this: Paley(17) is self-complementary and has clique number and independence number 3, so any cocolouring needs at least $\lceil 17/3 \rceil = 6$ classes. The two halves meet at exactly 6.

The assurance boundary sits in one identified place: the *encoding step* — the claim that the two CNFs faithfully express the reduced combinatorial statement — is validated by semantic spot-tests and calibration recomputations ($R(4,4) = 18$, $z(8) \leq 3$, $z(12) \leq 4$), not by machine-checked proof. Everything downstream of the CNFs is certified; everything upstream is conventional, human-readable mathematics in the 13-page paper.

## Who should care, and why

| Likely audience | What should interest them | What they could do with it |
|---|---|---|
| Ramsey theory and extremal graph theory researchers | The first movement on the Erdős–Gimbel small-values table since z(19), and a reduction pattern (Ramsey core + certified residual search) that may extend upwards. | Check the reduction argument in the 13-page paper; attempt z(21); look for a certificate-free proof of the upper bound. |
| SAT and automated-reasoning researchers | Two moderately sized CNFs whose unsatisfiability settles a named open problem — a clean benchmark with an unusually complete certificate chain (DRUP → LRAT → four checkers including cake_lpr). | Rerun and time the refutations with other solvers; test proof-minimisation tools on the certificates; use the instances in checker and solver test suites. |
| Formal-verification researchers | The one uncertified link is precisely identified: the encoding from the combinatorial statement to CNF. | Formalise the reduction and encoding soundness in Lean or Isabelle, turning a candidate into a machine-checked theorem end to end. |
| Combinatorics educators and expositors | The lower bound is a two-line argument about Paley(17) that any undergraduate can verify by hand — attached to a genuinely new result. | Use the pair (hand-checkable half, certified half) as a teaching example of what computer-assisted proof does and does not guarantee. |
| AI-assisted mathematics researchers | The mathematics was generated by multiple AI systems under a cross-checking policy: no step rests on a model assertion not recomputed by a different system. | Study the claim–evidence index and replay logs as a case study in auditable AI-generated mathematics; attempt independent agent reproduction. |

## Why this problem is hard

Cochromatic numbers mix the two classic extremes of graph colouring. A single colour class may be *either* kind of homogeneous set, so lower bounds cannot lean on standard chromatic machinery, and upper bounds must survive every graph on 20 vertices — roughly $10^{57}$ of them, far beyond enumeration. The Ramsey-theoretic reduction is what collapses this astronomical search space into two finite, certifiable questions. That collapse — not raw computing power — is the heart of the argument.

## The most valuable next projects

### 1. Formalise the encoding

Everything downstream of the two CNFs is already checked by a formally verified tool; everything upstream is ordinary prose. The single most valuable follow-up is to machine-check the bridge — the reduction from "every 20-vertex graph is 6-cocolourable" to "these two formulas are unsatisfiable". That one theorem, formalised in Lean or Isabelle, would close the only identified gap and make this, to our knowledge, the first fully verified value in the Erdős–Gimbel table beyond hand range.

### 2. Push to z(21)

The reduction pattern — concentrate obstructions on a Ramsey core, certify the residual search — did not obviously exhaust itself at 20. The size of the residual search grows, but SAT solvers and proof checkers have headroom. A z(21) attempt would also reveal whether the two-core structure at 20 was a lucky accident or the start of a usable general method.

### 3. Reproduce independently

The release's own caveats identify what is missing: a second team, with fresh code, regenerating the Ramsey catalogue, re-deriving the reduction, re-encoding the CNFs, and re-checking unsatisfiability. Every needed artefact — instances, certificates, checkers, manifests — is public, so this is an afternoon-to-a-week project for a SAT-literate group, and it is the fastest route to moving the claim up the verification ladder.

## Specialist audience candidates

The most natural specialist readers include researchers who maintain and extend the Erdős problems catalogue, those who have computed values in the Erdős–Gimbel table (the z(12) computation in particular), the SAT-certificate community around DRUP/LRAT proof checking and verified checkers such as cake_lpr, and Ramsey-catalogue maintainers. This identifies intellectual proximity, not a prediction that any individual will endorse the manuscript.

The strongest pitch to them is:

> The first open entry in the Erdős–Gimbel cochromatic table falls to a hand-checkable Paley bound plus two certified unsatisfiability results — and the only uncertified step is precisely identified and small.

## How the mathematics was produced

The mathematics in this release was generated by AI systems (Nous Hermes, GPT 5.6 Sol, and Claude models), with human problem selection and mediation. The repository states that no step of the final argument rests on a language-model assertion that was not recomputed by a different system. That policy, together with the certificate architecture, is what makes the claim auditable at all — but it is not a substitute for independent human or formal verification, which the release explicitly lacks.

## What is in the evidence package

The repository ships the two CNF instances (`z20_core0.cnf`, `z20_core1.cnf`) with DRUP and LRAT refutations; a portable replay checker (`verification/verify_certificate.py`); the regenerated Ramsey catalogues and calibration recomputations; a 13-page human-readable proof PDF; a machine-readable claim index (`AI_INDEX.md`); and SHA-256 manifests. The Zenodo deposit archives the release with a DOI.
