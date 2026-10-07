# OpenAI mathematics collection: Evidence Press overlap audit

Date: 7 October 2026. Source frozen at
[`adc7f1241b42e322a6451854ab7e4b4c146bf78a`](https://github.com/openai/math/tree/adc7f1241b42e322a6451854ab7e4b4c146bf78a).
This is a bounded source/scope audit, not verification of the collection.
Manuscript dates are not used to establish public priority. No research archive,
DOI, creator attribution or inherited assurance dimension was changed.

## Direct overlaps

### Seymour second neighbourhood

The selected theorem is `OAI.SeymourSecondNeighborhood.exists_goodVertex`.
Its definitions express the ordinary finite nonempty oriented-graph conjecture:
loopless asymmetric relation, distinct second neighbours excluding direct
neighbours, and cardinality comparison at some vertex. There is no minimum-degree
restriction and sinks are admitted. The relation's decidability can be supplied
classically; it is not an additional graph restriction.

A fresh isolated copy of the SecondNeighborhood source subtree compiled with
Lean 4.34.1 and Mathlib commit `d13f23b723b8a846827a245b89c10fc7d3f11612`.
Only the build configuration was reduced to this dependency; upstream proof
sources were unchanged. Mathlib's upstream compiled cache was used and remains
part of the trust boundary. The build completed successfully (1871 jobs).

The accompanying [explicit-statement wrapper](seymour-standard-statement.lean)
also passed `lake env lean Audit.lean` with exit code 0. It unfolds the named
predicates into the conventional finite-set statement. Lean's `#print axioms`
reported precisely `[propext, Classical.choice, Quot.sound]`. Two earlier wrapper
attempts failed because of decidability-instance elaboration; moving classical
decidability into the displayed proposition fixed the wrapper without changing
upstream proof code. A successful wrapper is still inside Lean's trust boundary.

Source parity checked all 43 `.lean` files against the pinned repository copy.
The final statement-check stdout SHA-256 is
`a8d41215e04e763eab4576d7dd37206839e774ed375c7c137e78294fcde87f54`.
The isolated dependency manifest SHA-256 is
`09a1e754b3a0b402c6c9f9ccca9b829735a8060b3949c18e15675cb79928886c`.
The [successful output](seymour-statement-axioms.log) is retained separately.

To reproduce the scoped check, copy the pinned `lean/OAI/Combinatorics/SecondNeighborhood`
directory unchanged; use upstream `lean-toolchain`; declare a Lake `OAI` library
with that subtree and the Mathlib revision above, `autoImplicit=false`; run
`lake update`, `lake build OAI.Combinatorics.SecondNeighborhood.Main`, then
`lake env lean seymour-standard-statement.lean` with the wrapper in the project
root. This reproduces the local check, not the hardened Comparator procedure.

This local compiler check is not a hardened Comparator run or a second-kernel
verification. Comparator's documented sandbox uses Linux Landrun/systemd; this
check ran on macOS arm64. No sandbox was disabled to manufacture a pass.

If accepted, the general theorem supersedes the search objective of the EP
`seymour-second-neighbourhood-2delta3` release. It does not independently verify
EP's graph-to-CNF bridge or imply the weighted strengthening that EP refutes.
The historical SAT certificates and negative examples retain their stated scope.

### Dimension-six mutually unbiased bases

The paper's headline is a three-basis maximum. The collection's
[`lean/docs/266.md`](https://github.com/openai/math/blob/adc7f1241b42e322a6451854ab7e4b4c146bf78a/lean/docs/266.md)
instead maps `MUBSix` to a five-basis bound and a Fourier vanishing statement,
and `HadamardCubeFiber` to a separate cancellation lemma. Neither selected
statement verifies the headline computational exclusion. They were source-
inspected, not locally compiled in this audit.

The manuscript's `build/sections/execution.tex` refers to seven C++ sources,
`verification/code/extraction.json`, `verification/REPRODUCE.md`, and a
`verification/computation/README.md` execution archive. `git ls-tree -r` at the
pin contains none of those paths in this manuscript; a repository-wide filename
search did not locate its named C++ entry sources. The GitHub releases endpoint
returned no releases. This is an availability finding about this snapshot, not
an allegation that the computation was never performed.

The stated arithmetic contract is also material: x86-64 binary64 behaviour,
compiler/FMA restrictions and complete terminal coverage. Rebuilding an altered
ARM implementation or trusting a displayed success table would not reproduce
that contract. Full replay remains blocked pending the referenced inputs.
EP's Szöllősi-family claim and assurance are unchanged.

## Secondary leads: no theorem transfer established

| Collection lead | EP relevance | Decision |
|---|---|---|
| Family 149, weakly reversible mass-action boundedness/persistence | Shared-phosphatase and T-cell models | Require an explicit reaction-network translation and proof of weak reversibility with fixed positive rates. Equilibrium counts and connectedness alone do not supply these. No application asserted. |
| Family 265, square-lattice area law | Kagome AKLT gap | Unique ground state, square-lattice domain and uniform full-system gap hypotheses differ from EP's stated kagome boundary family. No automatic area-law corollary. |
| Family 268, periodic spin-one Heisenberg gap | Flat-Schmidt and field-uniform spin chains | Different local Hamiltonian, spin and boundary hypotheses; methodological comparison only. |
| Family 269, Laughlin gap | Spectral-gap certification methods | Different model. Its selected unperturbed inequalities do not automatically verify the accompanying disorder-stability claims. |
| Family 238, Thorp shuffle | Transposition mixing releases | Different transition kernel and time convention. Coset/Fourier estimates may be reusable only after their hypotheses are proved for the target chain. No cutoff/profile transfer. |
| Family 272, zero secret-key entanglement | Three-copy qutrit Werner candidate | Selected formal statements concern PPT channel composition/squares in dimensions 10 and 21, not the paper's secret-key headline or EP's qutrit Werner tensor-power question. No distillability conclusion imported. |

Sources are the pinned collection's `lean/docs/149.md`, `238.md`, `269.md`,
`272.md`, manuscript abstracts, and the current affected EP release statements.
These leads remain bounded research opportunities, not mandatory extensions or
reasons to add speculative notes to every release.

## Reusable practices adopted

[Formal claim mapping](../FORMAL_CLAIM_MAPPING.md) separates compilation,
semantic statement correspondence, permitted axioms and independent checking.
The publishing skill now invokes this only for load-bearing formal inputs.

The opening sections of the published abridged Heisenberg-ferromagnet and
Kaplansky reasoning summaries were inspected for method lessons: distinguish
conditional moments from full conditional laws; preserve coefficient-field and
quantifier restrictions; retain failed bridges with explicit reopening tests.
These are selected summaries, not full experiment logs. They establish neither
correctness of the proposed arguments nor comparative speed, cost or success.
The catalogue's family/manuscript counts are not a problem-level success rate.

No external outreach, issue submission, paid service, scheduled monitor or new
research programme was started by this audit.
