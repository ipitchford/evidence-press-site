## Summary

In geometry, some shapes are impostors. They look identical to a familiar shape by every measurement that smooth topology can make — yet as *algebraic* objects, defined by polynomial equations, they are provably different. The most celebrated examples in three dimensions are the exotic affine spheres discovered by Dubouloz and Finston: algebraic varieties diffeomorphic to the standard complex three-sphere that no polynomial change of coordinates can turn into it.

This paper argues that one of these impostors arises, unforced, inside a very natural construction: slicing the space of polynomial factorisations studied in this project's foundational release. The transverse linear–quadratic slice, it argues, is not the standard three-sphere (the SL2 quadric) it appears to be — it is precisely a Dubouloz–Finston exotic sphere.

Two further claims round out the picture. Every normalised quadratic–cubic slice fails to be ordinary five-dimensional affine space, blocked by an exact obstruction computed in the Grothendieck ring of varieties. And in characteristic 3 — arithmetic where $3 = 0$ — the tangent slice stays perfectly ordinary, while the polynomial map it carries develops a genuinely characteristic-p phenomenon, an Artin–Schreier collision.

## Summary for specialists

Three principal claims. First, the transverse linear–quadratic slice of the binary-form factorisation space is the Dubouloz–Finston torsor — an exotic affine three-sphere — rather than $\mathrm{SL}_2$. Second, every normalised quadratic–cubic slice fails to be $\mathbb{A}^5$, proved by an exact Grothendieck-class formula together with a rank-by-rank Hodge–Deligne obstruction. Third, in characteristic 3 the tangent slice remains $\mathbb{A}^3$, with an Artin–Schreier collision in the induced Keller map.

The computational support is deterministic and exact: symbolic checks of selected formulae, plus finite-field censuses over $\mathbb{F}_2$ through $\mathbb{F}_{11}$ covering 23,941 projective functionals, validated byte-for-byte against checked-in tables, with a deliberate semantic control confirming the assertions are live. The assurance boundary matters here more than usual: the censuses corroborate *consequences* of the claims; the torsor identification and the motivic obstruction arguments themselves have had no external review, and their verification is the release's own headline request.

## Technical summary

The stage is the binary-form factorisation space of the foundational release, and the object is its transverse linear–quadratic slice — a smooth affine threefold that, on topological inspection, has the homotopy type of the complex quadric $\mathrm{SL}_2 = \{xy - zw = 1\}$. The manuscript's central argument identifies it instead with the Dubouloz–Finston torsor: an $\mathbb{A}^1$-bundle over the punctured affine plane that is diffeomorphic to $\mathrm{SL}_2$ but not algebraically isomorphic to it, the distinction detected by the Makar-Limanov-style invariants of the Dubouloz–Finston theory rather than by any topological quantity.

The quadratic–cubic obstruction is motivic. For each normalised quadratic–cubic slice the manuscript computes an exact class in the Grothendieck ring of varieties and expands its Hodge–Deligne (E-)polynomial rank by rank; a nonvanishing coefficient where $\mathbb{A}^5$ requires zero blocks any isomorphism with affine five-space, uniformly across the family. The characteristic-3 analysis runs the tangent-slice theory over $\mathbb{F}_3$: the slice itself remains $\mathbb{A}^3$, but the induced Keller map acquires an Artin–Schreier collision — a fibre coincidence of the form $t \mapsto t^3 - t$ that has no characteristic-zero counterpart.

The computational layer is corroborative, not probative: exact symbolic checks of selected formulae, plus finite-field censuses over $\mathbb{F}_2$ through $\mathbb{F}_{11}$ covering 23,941 projective functionals, validated byte-for-byte against committed tables, with a deliberate semantic control (an omitted term must break the check). The torsor identification and the motivic computations themselves are prose mathematics awaiting expert eyes.

## Who should care, and why

| Likely audience | What should interest them | What they could do with it |
|---|---|---|
| Affine algebraic geometers | If a Dubouloz–Finston exotic sphere arises unforced in a natural factorisation construction, exoticity looks like default behaviour rather than engineered pathology. | Verify or refute the torsor identification — the release's most consequential claim and squarely their machinery (Makar-Limanov invariants, A¹-bundle classification). |
| Motivic and Hodge-theory specialists | A rank-by-rank E-polynomial obstruction deployed against a whole family of would-be affine spaces at once. | Check the Grothendieck-class formula independently; ask whether the obstruction pattern generalises to other slice families. |
| Arithmetic geometers (characteristic p) | A clean, small example of characteristic-3 divergence: the space stays standard while its Keller map degenerates via Artin–Schreier behaviour. | Map the phenomenon across small primes; determine whether it constrains or enables lifting arguments. |
| Jacobian conjecture researchers | The obstruction results feed the project's screening programme, which the sequel release turns into an isolation theorem. | Audit the cubic classification here, on which the sequel's conditional theorem explicitly depends. |
| Computational algebraic geometers | A finite-field census as a cheap, replayable corroboration layer for motivic claims. | Rerun the censuses independently; extend them to larger fields as a sharper consistency test. |

## The most valuable next projects

### 1. Adjudicate the torsor identification

Everything interesting about this release concentrates in one claim: the transverse slice is the Dubouloz–Finston torsor, not $\mathrm{SL}_2$. The tools for deciding it are established, and the specialists who built them are identifiable. A confirmation would put a naturally occurring exotic sphere on record; a refutation would collapse the headline while leaving the obstruction results to stand or fall separately.

### 2. Re-derive the motivic obstruction

The Grothendieck-class formula and its Hodge–Deligne expansion are exact, finite computations. Reproducing them by independent means — different software, or by hand for low ranks — would either certify the quadratic–cubic obstruction or locate an error precisely. The finite-field censuses provide the consistency data to check against.

### 3. Chart the characteristic-p landscape

The characteristic-3 Artin–Schreier collision invites a systematic question: for which primes and which slices does reduction preserve the affine-space structure while degenerating the map? Even a small census across $p \in \{2, 3, 5, 7\}$ would show whether characteristic 3 is special or the first case of a pattern.

## Specialist audience candidates

The most natural specialist readers are the researchers whose constructions the manuscript claims to have found in the wild — the authors of the exotic affine 3-sphere literature — together with motivic-obstruction specialists and the affine-geometry community around the recognition problem for affine spaces. This identifies intellectual proximity, not a prediction of endorsement.

The strongest pitch to them is:

> A slice nobody tuned to be exotic is claimed to be exactly your exotic sphere — and the claim comes with exact finite-field censuses, a motivic obstruction for the neighbouring family, and an honest list of what has not been checked.

## Why an impostor here would be interesting

Exotic affine spheres are usually exhibited by deliberate construction. Finding one as the *inevitable* form of a natural slice — a subvariety nobody tuned to be exotic — would suggest that exoticity is not a curiosity of engineered examples but a default behaviour of factorisation geometry. It would also sharpen the project's Jacobian-conjecture programme: knowing exactly which slices are, and are not, affine space is the screening question the companion releases pursue.

## What is in the evidence package

The deposit contains the manuscript (PDF and TeX), `verify_paper.py` with its finite-field censuses and semantic control, the recorded verification output, a claim-to-evidence map (`AI_INDEX.md`), integrity documentation (`ASSURANCE.md`), and SHA-256 manifests. A follow-up revision (v0.1.1, archived separately) repaired citation routing after a cache incident, with manuscript content unchanged.
