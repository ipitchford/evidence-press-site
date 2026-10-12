## Summary

Can every element of a finite field be placed around a circle so that each pair of neighbours adds to a primitive element? Here *primitive* means that repeated multiplication by that element visits every nonzero element of the field.

Sun and Hou conjectured that the answer is yes whenever the field has more than seven elements. This candidate completes the remaining finite cases after earlier work settled the large-field range and most prime fields. The evidence includes actual circles, not just a report that a search succeeded.

## Summary for specialists

Let $H_q$ have vertex set $\mathbb F_q$, with distinct $x,y$ adjacent exactly when $x+y$ has multiplicative order $q-1$. The candidate proves that $H_q$ is Hamiltonian for every prime power $q>7$.

She’s theorem covers $q>18\,888\,871$, and the prime-field construction covers primes above $61$. Among the remaining $728$ field orders, an exact sieved criterion covers $675$; explicit cycles cover the other $53$, with largest order $32\,761$.

## Technical account

A character-sum estimate controls primitive sums across pairs of vertex sets. Applied to an independent set paired with itself, it bounds the independence number. Applied across separated components, it gives a connectivity bound. A standard prime sieve improves these estimates, and the Chvátal–Erdős theorem turns connectivity at least as large as independence into Hamiltonicity.

The finite-field representation is part of each certificate. The verifier checks the field order, the modulus, the permutation and every cyclic adjacent sum. It does not assume that a polynomial called a field modulus is irreducible: an exact multiplicative-order argument establishes that its quotient ring is a field.

For arithmetic modulo eleven, one circle is

$$4,9,10,8,0,2,6,7,1,5,3.$$

Its cyclic neighbouring sums are $2,8,7,8,2,8,2,8,6,8,7$. All belong to the primitive set $\{2,6,7,8\}$. The banner depicts this worked example; it is not a replacement for the other certificates.

The revised paper also derives a sufficient vertex-deletion bound. Over $\mathbb F_{32}$ it guarantees Hamiltonicity after deleting any six vertices. This is not an optimal fault-tolerance claim. In characteristic two, a classical primitive normal basis combined with a binary cyclic Gray ordering gives a direct construction without search.

## Evidence, assurance and limitations

The package contains $675$ exact positive criterion witnesses and $53$ frozen cycles covering $172\,655$ cyclic edges. Internal checks regenerated all cycles byte-identically and rejected five malformed inputs. Frozen verification does not rerun the search or overwrite certificates.

This is an **unrefereed computer-assisted proof candidate**. A separately implemented verifier provides implementation diversity within the producer’s workflow, not independent external reproduction. The universal result also depends on written arguments and cited theorems. There is no proof-assistant formalization or journal peer review. The separate reviewer audit archive was unavailable; its missing supplements were reconstructed internally, and that distinction is documented.

## Relationship to earlier work

The finite closure must not obscure what was already known. Sun’s cited version places the problem at Conjecture 3.5(i), and Remark 3.5(a) already reports prime checks below $545$ and an explicit $\mathbb F_9$ example. The $53$ certificates are not $53$ wholly new cases. She supplies the asymptotic range; the sieve draws on established work by Cohen, Oliveira e Silva and Trudgian. The contribution is a complete, auditable finite remainder with an improved sufficient criterion.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Finite-field and graph researchers | Inspect the closure and compare connectivity bounds | Large-field results are inherited; novelty searches were bounded |
| Computational proof developers | Reuse the explicit-modulus and frozen-certificate checking pattern | A parser or representation error can invalidate the semantic bridge |
| Students of algebraic combinatorics | Work through the eleven-element circle and character-sum mechanism | The illustration alone proves only its small example |

## Why the problem matters

The problem couples additive adjacency with multiplicative generation. It asks for a global arrangement satisfying a local algebraic rule at every step, including the closing edge. Its value here is mathematical: the release does not demonstrate a new cryptographic application or a measured practical benefit.

## How to inspect or reproduce the recorded checks

Download the research archive and install the pinned SymPy dependency in a local Python environment. A C compiler is required. Run `sh code/replay.sh` to check the exact witnesses and frozen cycles. Run `sh code/replay.sh --regenerate` only if you also want to repeat the search and compare its output. The README supplies the separate integer residual route and optimized-Python commands.

Check the manifest first. A matching hash confirms bytes, not mathematical correctness. An independent checker should reconstruct arithmetic from `data/field-manifest.json` and test each vertex and adjacent sum without trusting the original search tables.

## The most valuable next projects

1. Reimplement the certificate checker independently, using the explicit field moduli and comparing every encoded adjacency condition.
2. Inspect the inherited threshold proof and the improved independent-set bound together, so the universal range and finite remainder are audited as one argument.
3. Investigate sharper deletion guarantees. The published corollary is sufficient and makes no claim of optimality.

## What is in the evidence package

The archive contains the revised LaTeX manuscript and PDF, claim map, AI index, exact criterion witnesses, explicit field moduli, all 53 cycles, search and checking code, a non-destructive replay command, source audit, revision response, environment record and component licences. Original internal review files and third-party full-text copies are retained locally, not relicensed as original research.
