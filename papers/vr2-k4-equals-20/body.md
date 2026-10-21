## Summary

**The background.** A famous result of Ramsey theory says that if you connect 18 points in every possible way and paint each connection red or blue, you will always find four points whose six mutual connections are all the same colour — a monochromatic foursome. Eighteen is exactly the threshold: with 17 points you can avoid it.

**The question.** This release asks the natural next question. How many points do you need before you are guaranteed *two* monochromatic foursomes that share no points at all? The two foursomes may have different colours.

**What was found.** The claimed answer is exactly 20. With 19 points there is a way out — a colouring built from one highly symmetric 17-vertex network (the Paley graph), with one vertex replaced by three "twin" copies of it, avoids any two disjoint foursomes, and you can check this directly with a small program included in the release. With 20 points, escape is claimed to be impossible.

**How the two halves differ.** The 19-point escape is short enough to check by hand. The impossibility half is where the heavy machinery lives: it reuses the certified SAT computations from this project's companion release on Erdős problem 758, so the two results stand or fall together.

**Status.** An unrefereed candidate computer-assisted result. The lower bound is hand-checkable; the upper bound rests on proof objects replayed locally by separately implemented checkers. There has been no external reproduction, human peer review or end-to-end proof-assistant formalisation.

## Summary for specialists

Define $\mathrm{VR}_2(K_4)$ as the least $n$ such that every 2-colouring of $E(K_n)$ contains two vertex-disjoint monochromatic copies of $K_4$; the copies need not have the same colour. This release claims $\mathrm{VR}_2(K_4) = 20$.

The lower bound is an explicit 19-vertex colouring — a Paley-twin construction — admitting no two vertex-disjoint monochromatic $K_4$s, checked by a dependency-free direct verifier whose output ships with the release. The upper bound reuses the reduction and proof objects of the companion $z(20) = 6$ release (pinned to a specific repository commit): via $R(4,4) = 18$, obstructions concentrate on the two 16-vertex $(4,4)$-Ramsey graphs, and the residual case analysis is discharged by the same two CNF unsatisfiability certificates, LRAT-checked including by the formally verified cake_lpr.

The paper also records the immediate consequence $\mathrm{VR}_t(K_4)\le 4t+12$ for every $t\ge2$ (Corollary), so in particular $\mathrm{VR}_3(K_4)\le 24$.

A note for specialists: $\mathrm{VR}_t(F)$, the vertex-disjoint Ramsey number, is an established quantity (Jent, Osborn and Zhang; Jent and Zhang); this release claims the value of $\mathrm{VR}_2(K_4)$. A wider search for any earlier statement of that value is welcome.

## Technical account

### The 19-vertex lower bound

The lower bound is constructive. Start from the 17-vertex Paley graph $P_{17}$ (vertices $\mathbb Z_{17}$, adjacent when their difference is a nonzero quadratic residue), delete vertex 9 and add three mutually non-adjacent copies of it, each joined to that vertex's former neighbours $N=\{0,1,5,7,8,10,11,13\}$. Red edges are the edges of the graph; blue edges are the non-edges. The resulting 19-vertex colouring — the release calls it a Paley twin — is arranged so that monochromatic $K_4$s exist but any two of them intersect.

The hand proof of the lower bound runs as follows. $P_{17}$ itself has no $K_4$ and no independent four-set; the eight neighbours $N$ induce a triangle-free graph, and the eight remaining vertices have no independent triple. So there is no red $K_4$ at all, and every blue $K_4$ contains at least two of the three twins. Any two such four-sets share a twin, so no two monochromatic $K_4$s are disjoint. As a sanity check the paper counts exactly 44 blue $K_4$s and 84 red edges.

The construction ships as an explicit adjacency list; the dependency-free verifier enumerates all $\binom{19}{4}=3{,}876$ four-sets in both colours and confirms that no two vertex-disjoint monochromatic $K_4$s occur. Its full output is included, so the check is inspectable without running anything.

### The 20-vertex upper bound

The upper bound rides on the companion release's machinery. Suppose a red–blue colouring of $K_{20}$ had no two disjoint monochromatic $K_4$s. Because $20\ge R(4,4) = 18$, it contains one monochromatic four-set $A$; complementing if necessary, take it red. The other 16 vertices must then contain no monochromatic four-set of their own, so they form a $(4,4)$-Ramsey graph — and there are exactly two of these on 16 vertices up to isomorphism.

Fixing either one leaves only the $4\cdot16=64$ edges between $A$ and the rest undetermined. Listing the 872 mixed four-sets that could be monochromatic and forbidding every disjoint pair gives a 64-variable CNF with 104,524 clauses for each core. These are exactly the two CNF instances already refuted with DRUP/LRAT certificates in the z(20) work (pinned by commit hash). The logical bridge from those certificates to the $\mathrm{VR}_2$ statement is set out in the candidate paper's short derivation, and it is the part a referee should read first.

## Evidence, assurance and limitations

- **Hand mathematics.** The Paley construction, the lower-bound proof, complement invariance, the completeness argument for the catalogue generation, the classification of mixed four-sets, the encoding equivalence and the final deductions can be checked directly from the paper's text.
- **SAT proof objects.** The two DRUP refutations are accepted by separately implemented local RUP checkers and by `drat-trim`; their LRAT translations are accepted against the exact CNFs by `cake_lpr`, whose checking core is formally verified in CakeML. Cross-pairing the first formula with the second proof was rejected by all three checkers.
- **Semantic bridge.** The encoding is proved correct on paper (Proposition 5.2), and a separate direct graph implementation agrees on deterministic test assignments. The program that generates the formulas is not formally verified and is spot-tested against a separate direct implementation.
- **Catalogue.** The generation of the two 16-vertex cores is exhaustive if its implementation and nauty canonicalisation are correct; its full sequence of counts matches McKay's maintained data, but the C generator and nauty are not proved correct in a proof assistant.
- **Inherited boundary.** The upper bound is reused from the companion release rather than independently reproduced here, and inherits that release's assurance boundary: the SAT refutations are certified, the encoding is proved on paper, and the compiler, operating system and hardware remain in the conventional trusted computing base except where the CakeML checker reduces it.
- **Not claimed.** The complete graph-theoretic result has not been independently reproduced, completely verified by a human mathematician, peer reviewed, or formalised end to end in a proof assistant. Whether the value of $\mathrm{VR}_2(K_4)$ has been stated before is not yet settled.

## Who should care, and why

| Likely audience | What should interest them | What they could do with it |
|---|---|---|
| Ramsey theory researchers | A clean vertex-disjointness variant sitting one step beyond R(4,4) = 18, with a sharp claimed value and an explicit extremal construction at 19 vertices. | Check the derivation that transfers the z(20) certificates; search for any earlier statement of the value; attack VR2(K5) or VRk(Km). |
| Extremal construction specialists | The Paley-twin witness — a structured 19-vertex colouring in which every pair of monochromatic K4s intersects. | Study whether the construction generalises; look for a counting or design-theoretic explanation of why 19 is achievable and 20 is not. |
| SAT and verification researchers | A second named result discharged by the *same* two CNF refutations — an economical reuse of certified computation. | Verify the pinning (commit hash, SHA-256) and the transfer argument; formalise the derivation on top of an already-verified LRAT check. |
| Recreational and expository mathematics writers | The statement needs no background beyond colouring edges and spotting foursomes, and the 19-vertex escape artist is genuinely surprising. | Present the result as a puzzle; the included verifier makes it independently checkable by readers. |

### Specialist audience candidates

The natural readers are Ramsey theorists working on monochromatic disjoint structures and covering problems, the maintainers of Ramsey graph catalogues whose data the reduction uses, and the SAT-certificate community. This identifies intellectual proximity, not a prediction of endorsement.

The strongest pitch to them is:

> One new number in classical Ramsey territory: twenty vertices force two disjoint monochromatic K4s, nineteen do not — with the extremal colouring included and checkable by hand or laptop.

## Why the problem matters

Vertex-disjoint Ramsey numbers ask how large a complete graph must be before every two-colouring contains several *separate* monochromatic copies of a small graph, not just one. Recent work has determined them for triangles, paths, stars, matchings and other graphs of small order or size. $K_4$ is the first case sitting directly on top of a classical Ramsey number, $R(4,4)=18$, so an exact value shows how much extra room the disjointness requirement costs there — two vertices, on this claim — and immediately improves the general greedy bound for more copies.

## The pair of releases

This result and $z(20) = 6$ were released together and share one repository and one certificate base. The cochromatic result is the deeper claim; this one is the kind of clean, self-contained statement that invites independent checking — the 19-vertex witness in particular can be re-verified from scratch in an afternoon, which makes it a good entry point for anyone auditing the project's methods. The z(20) residual cocolourability computations are not dependencies of this companion result.

## How to inspect or reproduce the recorded checks

1. **Read the derivation first.** The candidate paper (`applications/vr2-k4/paper.pdf`, with TeX source) separates the hand-checkable lower bound, the Ramsey reduction, the encoding equivalence and the certificate checks.
2. **Check the lower bound yourself.** From the repository root, run the standard-library verifier:

   ```bash
   python3 applications/vr2-k4/verify_lower_bound.py
   ```

   It rebuilds the 19-vertex colouring from the Paley rule rather than trusting a stored string, and should report 84 red edges, 0 red $K_4$s, 44 blue $K_4$s and no disjoint monochromatic pair. It exits nonzero on failure, including when Python optimisation is enabled. The expected output is preserved in `verifier_output.txt`.
3. **Check integrity.** Inside `applications/vr2-k4`, run `shasum -a 256 -c MANIFEST.sha256` (macOS) or `sha256sum -c MANIFEST.sha256` (GNU/Linux).
4. **Audit the upper bound.** `UPSTREAM_Z20.md` gives the exact parent tag, commit and SHA-256 hashes of the reused artifacts: the 16-vertex catalogue generator, the formula generator, the two CNFs with their DRUP and LRAT refutations, the package checkers, and the dated replay receipt of 26 July 2026. When replaying with `cake_lpr`, require the exact verdict `s VERIFIED UNSAT`: the checker can print a failure while returning process status zero.

## The most valuable next projects

### 1. Establish priority or prior art

The vertex-disjoint Ramsey number $\mathrm{VR}_t(F)$ is established (Jent, Osborn and Zhang; Jent and Zhang), and recent work has determined it for triangles, paths, stars, matchings and other small graphs. Whether the value for $K_4$ has been stated before is not yet settled. Either outcome is valuable: an antecedent would test the claimed value against known work; confirmed novelty would establish the release as the reference for this value.

### 2. Independent verification of the 19-vertex witness

This is the lowest-cost, highest-signal check on the whole project: a fresh implementation, in any language, enumerating monochromatic $K_4$s in a 19-vertex colouring. It requires no SAT tooling and directly tests the half of the result that is unique to this release.

### 3. Generalise the pattern

$\mathrm{VR}_2(K_4) = 20$ against $R(4,4) = 18$ invites the general question: how does the threshold for two disjoint monochromatic copies grow relative to the classical Ramsey number? Even the next cases ($\mathrm{VR}_2(K_5)$, $\mathrm{VR}_3(K_4)$) would begin to map a curve, and the reduction-plus-certificate architecture is a plausible route to both.

## What is in the evidence package

The release ships the candidate paper with TeX source, the explicit 19-vertex construction, a dependency-free verifier and its output, the reused DRUP/LRAT certificates with their commit pin, an AI-readable claim/evidence index, and a SHA-256 manifest. The Zenodo deposit archives everything under a DOI.

| File (in `applications/vr2-k4/`) | Role |
|---|---|
| `paper.pdf`, `paper.tex` | Candidate paper and assurance report, with editable source |
| `verify_lower_bound.py`, `verifier_output.txt` | Standard-library verifier for the 19-vertex witness and its deterministic output |
| `UPSTREAM_Z20.md` | Exact parent tag, commit, paths and SHA-256 hashes of the reused upper-bound artifacts |
| `AI_INDEX.md` | Machine-oriented claim, dependency and trust-boundary map |
| `MANIFEST.sha256` | Hashes of every other file in the directory |

The reused catalogue, formulas, proof objects and replay receipt live at the repository root and are pinned rather than duplicated. Nauty, DRAT-trim and `cake_lpr` are not vendored.
