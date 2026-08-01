## Summary

A famous result of Ramsey theory says that if you connect 18 points in every possible way and paint each connection red or blue, you will always find four points whose six mutual connections are all the same colour — a monochromatic foursome. Eighteen is exactly the threshold: with 17 points you can avoid it.

This release asks the natural next question. How many points do you need before you are guaranteed *two* monochromatic foursomes that share no points at all? The claimed answer is exactly 20. With 19 points there is a way out — an elegant colouring built from two copies of a highly symmetric structure (a "Paley twin") avoids any two disjoint foursomes, and you can check this directly with a small program included in the release. With 20 points, escape is claimed to be impossible.

The impossibility half is where the heavy machinery lives: it reuses the certified SAT computations from this project's companion release on Erdős problem 758, so the two results stand or fall together.

## Summary for specialists

Define $\mathrm{VR}_2(K_4)$ as the least $n$ such that every 2-colouring of $E(K_n)$ contains two vertex-disjoint monochromatic copies of $K_4$. This release claims $\mathrm{VR}_2(K_4) = 20$.

The lower bound is an explicit 19-vertex colouring — a Paley-twin construction — admitting no two vertex-disjoint monochromatic $K_4$s, checked by a dependency-free direct verifier whose output ships with the release. The upper bound reuses the reduction and proof objects of the companion $z(20) = 6$ release (pinned to a specific repository commit): via $R(4,4) = 18$, obstructions concentrate on the two 16-vertex $(4,4)$-Ramsey graphs, and the residual case analysis is discharged by the same two CNF unsatisfiability certificates, LRAT-checked including by the formally verified cake_lpr.

A caveat specialists should note: the notation and definition are as given by the project, which did not locate an independent literature source for this exact quantity. Anyone aware of prior work on it under another name would materially help situate the result.

## Technical summary

The lower bound is constructive. Take two 17-vertex Paley-type pieces and overlay them into a 19-vertex colouring — the release calls it a Paley twin — arranged so that monochromatic $K_4$s exist but any two of them intersect. The construction ships as an explicit adjacency list; the dependency-free verifier enumerates all $\binom{19}{4}$ potential monochromatic $K_4$s in both colours and confirms that no two vertex-disjoint ones occur. Its full output is included, so the check is inspectable without running anything.

The upper bound rides on the companion release's machinery. Any red–blue colouring of $K_{20}$ with no two disjoint monochromatic $K_4$s would in particular constrain every 18-vertex subset through $R(4,4) = 18$; the same reduction to the two 16-vertex $(4,4)$-Ramsey cores applies, and the residual case analysis is exactly the two CNF instances already refuted with DRUP/LRAT certificates in the z(20) work (pinned by commit hash). The logical bridge from those certificates to the $\mathrm{VR}_2$ statement is set out in the candidate paper's short derivation, and it is the part a referee should read first.

Two caveats frame the result. The quantity $\mathrm{VR}_2(K_4)$ is defined by the project, which did not locate prior literature on it under this or another name — prior-art search is explicitly requested. And the upper bound inherits the companion release's assurance boundary: certified below the CNFs, spot-tested above them.

## Who should care, and why

| Likely audience | What should interest them | What they could do with it |
|---|---|---|
| Ramsey theory researchers | A clean vertex-disjointness variant sitting one step beyond R(4,4) = 18, with a sharp claimed value and an explicit extremal construction at 19 vertices. | Check the derivation that transfers the z(20) certificates; search for prior appearances of the quantity; attack VR2(K5) or VRk(Km). |
| Extremal construction specialists | The Paley-twin witness — a structured 19-vertex colouring in which every pair of monochromatic K4s intersects. | Study whether the construction generalises; look for a counting or design-theoretic explanation of why 19 is achievable and 20 is not. |
| SAT and verification researchers | A second named result discharged by the *same* two CNF refutations — an economical reuse of certified computation. | Verify the pinning (commit hash, SHA-256) and the transfer argument; formalise the derivation on top of an already-verified LRAT check. |
| Recreational and expository mathematics writers | The statement needs no background beyond colouring edges and spotting foursomes, and the 19-vertex escape artist is genuinely surprising. | Present the result as a puzzle; the included verifier makes it independently checkable by readers. |

## The most valuable next projects

### 1. Establish priority or prior art

The quantity is natural enough that it may exist in the literature on vertex-disjoint monochromatic subgraphs under other notation. Either outcome is valuable: an antecedent would connect the result to known theory (and test the claimed value against it); confirmed novelty would establish the release as the defining reference.

### 2. Independent verification of the 19-vertex witness

This is the lowest-cost, highest-signal check on the whole project: a fresh implementation, in any language, enumerating monochromatic $K_4$s in a 19-vertex colouring. It requires no SAT tooling and directly tests the half of the result that is unique to this release.

### 3. Generalise the pattern

$\mathrm{VR}_2(K_4) = 20$ against $R(4,4) = 18$ invites the general question: how does the threshold for two disjoint monochromatic copies grow relative to the classical Ramsey number? Even the next cases ($\mathrm{VR}_2(K_5)$, $\mathrm{VR}_3(K_4)$) would begin to map a curve, and the reduction-plus-certificate architecture is a plausible route to both.

## Specialist audience candidates

The natural readers are Ramsey theorists working on monochromatic disjoint structures and covering problems, the maintainers of Ramsey graph catalogues whose data the reduction uses, and the SAT-certificate community. This identifies intellectual proximity, not a prediction of endorsement.

The strongest pitch to them is:

> One new number in classical Ramsey territory: twenty vertices force two disjoint monochromatic K4s, nineteen do not — with the extremal colouring included and checkable by hand or laptop.

## The pair of releases

This result and $z(20) = 6$ were released together and share one repository and one certificate base. The cochromatic result is the deeper claim; this one is the kind of clean, self-contained statement that invites independent checking — the 19-vertex witness in particular can be re-verified from scratch in an afternoon, which makes it a good entry point for anyone auditing the project's methods.

## What is in the evidence package

The release ships the candidate paper with TeX source, the explicit 19-vertex construction, a dependency-free verifier and its output, the reused DRUP/LRAT certificates with their commit pin, an AI-readable claim/evidence index, and a SHA-256 manifest. The Zenodo deposit archives everything under a DOI.
