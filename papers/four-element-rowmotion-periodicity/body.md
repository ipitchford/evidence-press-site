## Summary

Rowmotion repeatedly updates labels on a partially ordered set. Many important
families are periodic: after finitely many updates, every generic labelling
returns to where it began. This anonymous, unrefereed candidate gives a
smallest possible obstruction for two standard lifted forms of rowmotion.

The poset has four elements:

```text
        r
       / \
      a   b
          |
          c
```

Both birational rowmotion and order-polytope piecewise-linear rowmotion have
infinite order on this poset. Exact exhaustive enumeration proves that no
finite poset with three or fewer elements can have either behaviour.

## Summary for specialists

Let $P=\{r,a,b,c\}$ have covers $a<r$, $b<r$ and $c<b$. With birational
boundary labels fixed to one and toggles applied from top to bottom,

$$
R(r,a,b,c)=\left(\frac{a+b}{r},\frac{a+b}{ra},
\frac{c(a+b)}{rb},\frac{a+b}{rb}\right).
$$

If $t>1$ is the positive root of $t^9-t-1$, then

$$
x_t=(t^6,t^3,t^4,t^2)
$$

is fixed. Writing $p=1/(1+t)$, the logarithmic derivative has characteristic
polynomial

$$
\lambda^4+2\lambda^3+(2+p)\lambda^2+2\lambda+1.
$$

Finite order would put $p$ in a totally real cyclotomic subfield. But
$\mathbb Q(p)=\mathbb Q(t)$, while $t^9-t-1$ is irreducible and has one real
root and eight nonreal roots. This contradiction proves infinite birational
order.

For piecewise-linear rowmotion, the rational interior fixed point

$$
y_*=\left(\frac34,\frac38,\frac12,\frac14\right)
$$

lies in a strict linearity chamber. The local derivative there has a
nontrivial Jordan block at eigenvalue $-1$. A finite-order map cannot have
such a derivative at a fixed point.

## Technical account: two local obstructions

The birational proof does not try to follow a generic orbit. It uses a fixed
point to turn a global periodicity claim into a local linear-algebra test. If
$R^N$ were the identity rational map, differentiating at the positive fixed
point would give $J^N=I$. Every eigenvalue would be an $N$th root of unity,
so every real coefficient of the characteristic polynomial would lie in a
totally real cyclotomic field. The exact field signature rules this out.

The piecewise-linear argument follows the same compression principle in a
different category. At an interior point where the relevant maxima and
minima are strict, the map is genuinely linear nearby. A nontrivial Jordan
block survives every even power, so no iterate can be the identity on that
neighbourhood.

These are separate proofs. The piecewise-linear claim is not inferred from
the birational obstruction.

## Why four elements are necessary

Minimality is global over finite posets, not merely over rooted trees or
fences. The verifier enumerates every labelled strict partial order through
size three and then quotients by relabelling:

| Size | Labelled strict orders | Isomorphism classes | Exact birational periods |
|---:|---:|---:|---|
| 0 | 1 | 1 | $1$ |
| 1 | 1 | 1 | $2$ |
| 2 | 3 | 2 | $2,3$ |
| 3 | 19 | 5 | $2,4,6,6,6$ |

All nine isomorphism classes therefore have finite birational order.
Because these identities are subtraction-free, the standard tropicalisation
principle transfers them to the corresponding piecewise-linear maps. Hence
no poset on at most three elements is an obstruction for either lift.

## Evidence, assurance and limitations

The immutable package contains the five-page DOI-bearing paper, aligned
Markdown and proof certificate, exact Python replay, language-separated
JavaScript corroboration, the exhaustive small-poset classification, five
semantic mutations, source and convention correspondence, citation and
bounded novelty audits, the supplied review and response, licences,
environment declaration, checksum ledger and complete manifest.

Public Linux CI verifies the shipped bytes, reruns Python normally and under
optimization, rejects all five corrupted certificates, runs the JavaScript
checks, rebuilds the PDF and inspects its structure. GitHub and Zenodo expose
the same five release assets, and unauthenticated downloads matched the local
files byte for byte.

These checks establish availability, integrity and producer replay. They do
not establish unaffiliated rerun or reimplementation, proof-assistant
formalization, authenticated external specialist review, editorial peer
review, historical priority or research impact.

## Relationship to earlier work

The four-element Hasse shape is not claimed as new. Grinberg and Roby draw the
same non-skeletal rooted tree, up to order duality, in their Example 70. Their
nearby theorem proves finite order for skeletal posets and does not determine
the order of this non-skeletal example.

The 2015 AIM problem list asks broadly for the study of birational rowmotion
on Proctor's d-complete posets. Dangwal and coauthors later reported
experimental evidence for nonperiodicity on non-graded rooted trees without a
proof. Up to reversal or duality, the present poset is the asymmetric
two-segment fence $\breve F(2,3)$; Mertin and Poznanović provide the closest
family-level context but not the two fixed-point obstructions or global
four-element minimality proved here.

The bounded search found no exact theorem collision. That is not proof of
historical novelty, so the release makes no first or priority claim.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Algebraic combinatorialists | A sharp local obstruction on the smallest possible poset | Do not read it as a classification of d-complete posets |
| Dynamical-systems researchers | A fixed-point derivative route from periodicity to field signature or Jordan form | The arguments depend on the stated toggle and boundary conventions |
| Computational reviewers | A nine-class exact minimality fixture with hostile mutations | Reimplement independently rather than importing producer code |
| Formalizers | Two compact local arguments plus a finite exhaustive base case | The rational-map domain and tropical transfer still need formalization |
| Interested readers | A concrete example where a four-point order already supports nonperiodic lifted dynamics | Candidate publication is not field consensus |

## Why the problem matters

Rowmotion links posets, dynamical algebraic combinatorics and representation-
theoretic structure. Periodicity theorems are often signatures of hidden
regularity. A size-minimal obstruction identifies exactly how little
non-graded structure is needed for that regularity to fail, while the two
different derivative arguments give reusable tests for other families.

## How to inspect or reproduce the checks

Use tag `v0.1.0-candidate` or the version DOI, not moving `main`:

```sh
python3 verify_theorem.py
python3 -O verify_theorem.py
node verify_theorem.mjs
python3 test_mutations.py
```

For the complete manifest and document gates:

```sh
bash run_all.sh
```

Expected markers include `PASS_EXHAUSTIVE_SMALL_POSET_MINIMALITY`,
`LANGUAGE_SEPARATED_ALL_CHECKS_PASS`, `MUTATIONS_PASS 5/5` and
`PACKAGE_PASS`. Successful execution confirms the encoded identities and
finite enumeration. It does not establish novelty, independence or peer
review.

## The most valuable next projects

1. Classify finite- and infinite-order birational rowmotion on non-graded
   rooted trees or more general d-complete posets.
2. Determine the periodicity boundary for asymmetric two-segment fences.
3. Reconstruct both local obstructions in a materially separate stack.
4. Formalize the field, Jordan and minimality arguments in a proof assistant.
5. Obtain an authenticated specialist review and wider priority audit.

## What is in the evidence package

The all-files ZIP includes the DOI-bearing PDF and source, aligned Markdown,
proof and theorem certificates, exact verifiers, exhaustive minimality output,
tests and mutations, source/citation/novelty records, the supplied review and
response, licences, runtime declaration, release notes, receipts, checksums
and complete manifest. The version DOI is the citation target; any correction
should be a versioned successor rather than a silent edit.
