## Summary

AIM Problem 1.18 asks whether a pointwise abundance of differences forces a simple algebraic shape. For a finite nonempty set $A$ in an abelian group, let

$$
r_A(d)=|\{(a,a')\in A^2:a-a'=d\}|,\qquad D=A-A.
$$

The question is whether $r_A(d)>|A|/3$ for every $d\in D$ forces $D$ to be a subgroup or a union of at most three cosets of a common subgroup.

This anonymous, unrefereed candidate answers that question **no**. In the odd cyclic group $\mathbb Z/21\mathbb Z$, take

$$
A=\{0,1,2,7,9,14,15,16\}.
$$

Every represented difference occurs at least three times, so the strict inequality $3>8/3$ holds throughout $A-A$. But $|A-A|=15$, which is neither a subgroup order in a group of order 21 nor the size of at most three cosets of any common subgroup.

The same mechanism gives an infinite family: every fixed threshold below $2/5$ admits a counterexample in an odd cyclic group. This is a lower obstruction only. The release does **not** claim that $2/5$ is sufficient or sharp.

## Summary for specialists

Under $\mathbb Z/21\mathbb Z\cong C_3\times C_7$, the finite witness becomes

$$
A=(C_3\times\{0\})\cup(\{0,1\}\times\{1\})\cup(C_3\times\{2\}).
$$

Its quotient-layer differences are $0,\pm1,\pm2$. The representation spectrum on $D=A-A$ is

$$
3^{[6]},\quad 4^{[6]},\quad 7^{[2]},\quad 8^{[1]},
$$

and $6\cdot3+6\cdot4+2\cdot7+1\cdot8=64=|A|^2$.

More generally, let $H$ be a finite abelian group of order $h$, let $\varnothing\ne Y\subsetneq H$ have size $m$, and let $q\ge7$. For

$$
A=(H\times\{0\})\cup(Y\times\{1\})\cup(H\times\{2\})\subset H\times C_q,
$$

the candidate proves

$$
A-A=H\times\{0,\pm1,\pm2\},\qquad |A|=2h+m,
$$

and

$$
\min_{d\in A-A}r_A(d)=\min(h,2m).
$$

Thus the strict one-third condition holds exactly when $2h/5<m<h$. Taking $H=C_p$, $q=7$, and $m=(p+1)/2$ for sufficiently large odd primes $p\ne7$ gives minimum popularity ratio

$$
\frac{2p}{5p+1}\longrightarrow\frac25
$$

from below. Since $C_p\times C_7$ is cyclic and $|A-A|=5p$ cannot be the size of at most three cosets of one subgroup, this produces the claimed odd-cyclic obstruction for every $\theta<2/5$.

## Technical account

The proof is elementary and has three moving parts.

1. **Five distinct quotient layers.** The assumption $q\ge7$ keeps $0,\pm1,\pm2$ distinct in $C_q$.
2. **Exact multiplicity counts.** Differences between the two full layers have $h$ representations; differences meeting the partial layer have $2m$; central differences have at least $2h$.
3. **A cardinality obstruction.** In the finite witness, 15 is incompatible with every subgroup order of $C_{21}$ and with $t|K|$ for $t\le3$. In the family, the same argument applies to $5p$ inside $C_{7p}$.

The finite witness can therefore be checked line by line without trusting the software. The programs provide exhaustive arithmetic replay and hostile controls; they are supporting evidence, not a substitute for the written argument.

## Evidence, assurance and limitations

The package contains the manuscript and Markdown source, a machine-readable claim registry, Python and JavaScript verifiers, a 264-case bounded regression of the family formula, four deliberately corrupted mutations, replay receipts, source and citation audits, and the internal five-role review record. A fresh extraction passed all 12 publication-baseline gates. Public GitHub Actions also passed on Node 18, 20, and 22. GitHub and Zenodo copies of the archive, PDF, and checksum sidecar match local bytes.

Those facts establish public availability, byte identity, producer-side replay, and mutation sensitivity. They do not establish any of the following:

- an unaffiliated rerun or independent reimplementation;
- proof-assistant formalization;
- external additive-combinatorics review;
- journal or comparable editorial peer review;
- exhaustive novelty or absolute priority;
- sufficiency or sharpness at $2/5$;
- minimality of the $C_{21}$ witness.

The internal editorial result is `PASS_WITH_NOTES`. The notes are substantive boundaries, not cosmetic disclaimers.

## Relationship to earlier work

The source is the final question in AIM Problem 1.18, attributed there to V. Lev. A source audit corrected an earlier working label: the later Croot–Lev Problem 7.14 records the neighbouring **half-threshold** question, not this strict one-third question.

Hou, Li and Yang's 2026 preprint addresses that half-threshold problem in two-torsion-free groups. The present construction lies below one half and targets the separate AIM one-third implication.

A targeted search across ordinary web search, arXiv, Crossref, OpenAlex, and the closest reference chains found no direct statement of the $C_{21}$ witness, the three-layer family, or the below-$2/5$ odd-cyclic obstruction. That is partial novelty evidence only. Formula indexing, informal circulation, and specialist knowledge can defeat such a search, so the release invites priority corrections and makes no first or priority claim.

## Who should care

| Reader | What is useful now | What remains before promotion |
|---|---|---|
| Additive combinatorialists | A very small explicit witness and a one-line family mechanism for the AIM question | Check the source mapping, proof, prior art, and endpoint behaviour |
| Extremal set theorists | A concrete lower obstruction approaching $2/5$ from below | Determine the sharp threshold and classify near-extremizers |
| Formalizers | A short proof with finite-group counting and divisibility arguments | Formalize the layer calculation and coset-cardinality exclusion |
| Computational reviewers | Two transparent encodings, mutations, receipts, and immutable assets | Reimplement independently rather than importing either verifier |
| Research-methods readers | A claim-level package separating replay, review, novelty, and publication | Do not treat this one release as evidence of workflow acceleration or impact |

## How to inspect and reproduce it

Use candidate tag `v0.1.0-candidate` or the Zenodo version DOI, not the moving `main` branch. The core replay requires Python 3.11 or later and Node.js 18 or later, with standard libraries only:

```sh
python3 verify_counterexample.py --receipt REPLAY_RECEIPT.json
python3 -O verify_counterexample.py
node verify_counterexample.mjs
python3 test_mutations.py
```

Both verifiers should print `PASS`, and every mutation should be rejected. Then inspect `paper.md`, `CLAIMS.json`, `ASSURANCE.md`, `CITATION_AUDIT.md`, and `PRIOR_ART.md`. Successful execution confirms the declared arithmetic predicates in the released code; it does not independently certify the theorem or its novelty.

## Most valuable next projects

1. **Endpoint theorem.** Prove or falsify the subgroup-or-three-coset conclusion at $2/5$, carefully separating strict and non-strict formulations.
2. **Minimal counterexample.** Determine whether a smaller odd cyclic group or smaller set supports the strict one-third failure.
3. **Structural classification.** Describe sets whose minimum represented-difference multiplicity approaches $2|A|/5$.
4. **Independent assurance.** Reconstruct the proof and implement the predicates without importing the released code.
5. **Specialist novelty audit.** Search MathSciNet, zbMATH, older problem correspondence, and differently phrased inverse-difference literature.

## What is in the package

The immutable release includes the manuscript PDF and sources, accessible Markdown, exact verifiers, mutation tests, replay receipts, claim and nonclaim registries, provenance and licensing files, source and novelty audits, and a complete checksum manifest. The version DOI is the citation target; any correction should be a versioned successor rather than a silent change.
