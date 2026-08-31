## Summary

The Bieri–Neumann–Strebel invariant, written $\Sigma^1(G)$, organizes
directions in which a finitely generated group maps to the real numbers. Its
connected components can distinguish different ways in which a group behaves
like a bundle over a circle.

AIM Problem 6.2 asks for free-by-cyclic groups with first Betti number greater
than two and many BNS components even after the action of the outer
automorphism group is taken into account.

This anonymous, unrefereed candidate gives an explicit family $G_m$, one group
for every integer $m\ge 2$. It proves

$$
b_1(G_m)=m+2,
\qquad
\#\pi_0\!\left(\Sigma^1(G_m)\right)=2m+2,
$$

and obtains the orbit lower bound

$$
\#\bigl(\pi_0(\Sigma^1(G_m))/\operatorname{Out}(G_m)\bigr)\ge m+1.
$$

The last inequality grows without bound. It is the point needed for the AIM
existence request.

The words “at least” are load-bearing. The candidate does not compute
$\operatorname{Out}(G_m)$ and does not determine the exact number of component
orbits.

## Summary for specialists

Let $\Gamma_m$ have vertices $v_0,\ldots,v_m$, a loop $a_i$ at every
vertex, path edges $e_i:v_{i-1}\to v_i$, a closing edge
$e_0:v_m\to v_0$, and chords $c_i:v_0\to v_i$ for $2\le i\le m$.

The graph map fixes the vertices and loops and sends

$$
f_m(e_i)=e_i a_i,
\qquad
f_m(e_0)=e_0a_0,
\qquad
f_m(c_i)=c_i a_i^i.
$$

Negating the suffix exponents gives an inverse edge-path map, and iterates
have linear length. Thus $f_m$ induces a linearly growing automorphism

$$
\Phi_m\in\operatorname{Aut}(F_{2m+1}).
$$

For its mapping torus

$$
G_m=F_{2m+1}\rtimes_{\Phi_m}\mathbb Z,
$$

every real character has coordinates
$(x,y,z_0,z_2,\ldots,z_m)$ satisfying

$$
\chi(t_i)=x+iy,
\qquad
\chi(a_i)=y\ \ (1\le i\le m),
\qquad
\chi(a_0)=-my.
$$

The stable-letter coordinates are free, so $b_1(G_m)=m+2$.

Cashen–Levitt Corollary 2.10 gives

$$
\Sigma^1(G_m)=
\left\{
[x,y,z_0,z_2,\ldots,z_m]:
x+iy\ne0\text{ for }0\le i\le m
\right\}.
$$

The $m+1$ central lines $x+iy=0$ divide the $(x,y)$-plane into exactly
$2m+2$ sectors. The extra stable-letter directions do not merge them.

For every primitive integral BNS character,

$$
\operatorname{rank}\ker\chi
=
1+m|x|+\sum_{i=1}^{m}|x+iy|.
$$

Minimizing this rank inside each component produces $m+1$ distinct values.
Since automorphisms preserve kernel rank, components with different minima
cannot lie in the same outer-automorphism orbit.

## Technical account: the weighted-chord graph map

The graph $\Gamma_m$ has $m+1$ vertices and $3m+1$ geometric edges. Therefore

$$
\operatorname{rank}\pi_1(\Gamma_m)
=(3m+1)-(m+1)+1
=2m+1.
$$

The mapping torus becomes a finite graph of groups. Each vertex group is a
torus group

$$
V_i=\langle a_i,t_i\mid[a_i,t_i]=1\rangle\cong\mathbb Z^2,
$$

and each connecting edge contributes a proper cyclic edge group.

If an oriented connecting edge $d:u\to v$ satisfies
$f_m(d)=d a_v^p$, the mapping-torus square gives

$$
d^{-1}t_ud=t_va_v^{-p}.
$$

The path relations, closing relation and weighted chord relations force the
edge-character values to be

$$
x,\ x+y,\ \ldots,\ x+my.
$$

The form $x$ occurs on $m$ edge groups: once on the first path edge and once
on each of the $m-1$ chords. Each form $x+iy$ for $1\le i\le m$ occurs once.

The chord exponent $i$ is not decorative. It produces the arithmetic
progression of edge forms and, later, the separated sequence of chamber
minima. One package control replaces these weights by unit weights and
requires the claimed certificate to fail.

## How the BNS chambers arise

Cashen and Levitt prove that, for the relevant finite reduced graph of groups,
a nonzero character lies in $\Sigma^1$ exactly when it is nonzero on every
edge group. The hypotheses hold here because every vertex group is
$\mathbb Z^2$, the cyclic edge groups are proper, and the splitting is not an
ascending HNN extension.

Consequently the deleted set consists of

$$
x+iy=0
\qquad (0\le i\le m).
$$

In the $(x,y)$-plane these are $m+1$ distinct lines through the origin, so
their complement has $2m+2$ open convex sectors. A character also has $m$
free stable-letter coordinates, but taking the product with
$\mathbb R^m$ does not join different sectors. Positive projectivization
preserves the distinction between antipodal directions.

Thus the component count is exact:

$$
\#\pi_0(\Sigma^1(G_m))=2m+2.
$$

This exact component count depends on the cited Cashen–Levitt criterion plus
the family-specific edge-form calculation. The release does not claim a new
proof of the imported criterion.

## The orbit obstruction

A large component count alone does not answer the AIM qualifier “up to
$\operatorname{Out}(G)$.” A group automorphism might permute many components
into a small number of orbits.

For a component $C$, define

$$
\mu(C)=
\min\left\{
\operatorname{rank}\ker\chi:
\chi:G_m\twoheadrightarrow\mathbb Z,\
[\chi]\in C
\right\}.
$$

Every chamber is rational and contains primitive integral points, so this
minimum exists. If $\alpha\in\operatorname{Aut}(G_m)$, then

$$
\ker(\chi\circ\alpha)
=
\alpha^{-1}(\ker\chi)
\cong\ker\chi.
$$

Therefore $\mu$ is constant on every $\operatorname{Out}(G_m)$-orbit.

The kernel-rank formula follows directly from the action of $\ker\chi$ on the
Bass–Serre tree:

$$
\operatorname{rank}\ker\chi
=
1+m|x|+\sum_{i=1}^{m}|x+iy|.
$$

For the two outer components, every edge value has the same sign. The minimum
is

$$
\mu(C_{\mathrm{out}}^\pm)=1+2m.
$$

For an interior component indexed by $0\le j<m$, write $x=-p$ and $y=q$ with

$$
jq<p<(j+1)q.
$$

Exact integer minimization gives the primitive point
$(p,q)=(2j+1,2)$ and

$$
\mu(C_j^+)=\mu(C_j^-)
=
1+m(m+1)+2j^2.
$$

These $m$ interior values strictly increase with $j$, and the smallest
interior value exceeds the outer value by $m(m-1)$. There are therefore
$m+1$ distinct values of $\mu$, which proves at least $m+1$ component orbits.

Small instances make the pattern visible:

| $m$ | $b_1(G_m)$ | BNS components | Proven orbit lower bound | Component-pair minima |
|---:|---:|---:|---:|---|
| 2 | 4 | 6 | 3 | $5;\ 7,9$ |
| 3 | 5 | 8 | 4 | $7;\ 13,15,21$ |
| 4 | 6 | 10 | 5 | $9;\ 21,23,29,39$ |

The first number in the last column is the outer-pair minimum; the remaining
numbers are the interior-pair minima.

## What the lower bound does not show

The argument separates component pairs carrying different minimum kernel
ranks. It does not show that two components with the same minimum belong to
the same orbit.

In particular, it does not establish that an antipodal pair is one orbit.
Depending on the actual automorphism group, the $2m+2$ components could split
more finely than the $m+1$ classes detected by $\mu$.

The release therefore does not:

- compute $\operatorname{Out}(G_m)$;
- give an exact component-orbit count;
- classify BNS invariants of all linearly growing free-by-cyclic groups;
- prove a new version of the Cashen–Levitt criterion;
- turn finite replay for $2\le m\le8$ into a proof for all $m$;
- establish historical novelty or priority.

The theorem candidate answers the natural existence request by an unbounded
lower bound. It is not an orbit classification.

## Evidence, assurance and limitations

The immutable package contains the DOI-bearing bilingual paper, aligned
Markdown, a compact proof certificate, exact Python replay, a same-producer
language-separated JavaScript reconstruction, eight certificate and
claim-boundary controls, source and convention correspondence, citation and
bounded novelty audits, the internal editorial record, licences, an
environment declaration, checksums and a complete manifest.

The Python verifier recomputes exact graph counts, the rank of the abelianized
relation matrix, symbolic character coordinates, edge forms and chamber
minima for $2\le m\le8$. It is run normally and with Python optimization. The
JavaScript program separately reconstructs the finite edge-form and minimum
data using `BigInt`.

The eight deliberately damaged cases change the free rank, remove a splitting
edge, collapse a BNS hyperplane, halve the component count, corrupt an interior
minimum, inflate the lower bound into an exact orbit count, replace weighted
chords by unit chords, or remove the closing edge from the growth witness. All
must be rejected.

One supplied full review was actioned, and one bounded focused confirmation
passed on an exact frozen archive. The inherited role-separated reports and
the confirmation probe different questions, but they were produced within
one coordinated workflow. Reviewer identity, specialist credentials and
unaffiliated status were not authenticated.

Public Linux CI reruns the complete read-only package path. GitHub and Zenodo
expose the same PDF, 64-member ZIP and manifest; fresh downloads match local
SHA-256 values. These facts establish availability, integrity and
producer-side replay. They do not establish independent reproduction,
independent reimplementation, formal verification, external specialist
review, editorial peer review, novelty, priority or field acceptance.

The decisive structural dependency is Cashen–Levitt Corollary 2.10.
Correctness still depends on the written verification that its hypotheses
apply to this graph of groups.

The Traditional Chinese abstract's formulas were checked for source parity;
its linguistic quality has not been independently assessed by a fluent
reviewer.

## Relationship to earlier work

The general hyperplane-arrangement architecture is not new. Cashen and Levitt
prove the graph-of-groups BNS criterion used here. Their Example 5.13 already
gives a linearly growing circle-of-tori family requiring many excluded
subspheres, and their Theorem 6.1 supplies a general fiber-rank formula.

The narrower candidate contribution is the weighted-chord family, the
family-specific direct Bass–Serre rank derivation, and the use of the
componentwise minimum

$$
\mu(C)=\min\operatorname{rank}\ker\chi
$$

to obstruct the full outer-automorphism action. The candidate rederives the
rank formula for this family rather than claiming the general formula as new.

Work by Funke and Kielak, and by Kielak, places BNS invariants and fiber norms
in a broader polytope framework. Andrew and Martino study automorphism groups
of linearly growing free-by-cyclic groups. Jaikin-Zapirain, Kudlinska and
Sánchez-Peralta provide adjacent fixed-rank epimorphism-orbit questions;
Mutanguha provides recent polynomial-growth context.

The bounded search found no exact collision for the weighted-chord family or
the displayed chamber-minimum sequence. This is not a systematic literature
review and does not establish priority.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Geometric group theorists | An explicit test family linking a BNS arrangement to the full outer action | The orbit result is a lower bound, not a classification |
| Researchers studying free-by-cyclic groups | A concrete linearly growing mapping-torus construction with increasing $b_1$ | Cashen–Levitt supplies the decisive BNS criterion |
| Bass–Serre theorists | A direct kernel-rank calculation in which vertex counts cancel and edge multiplicities control rank | The calculation must be checked with the stated orientation conventions |
| Computational reviewers | A compact parametric certificate with exact finite fixtures and hostile mutations | Reimplement independently instead of importing producer predicates |
| Formalizers | A universal graph construction, one external theorem interface and an elementary integer minimization | The imported BNS theorem and its hypotheses need an explicit formal boundary |
| Interested readers | A case where counting regions is not enough because symmetries may identify them | Candidate publication is not field consensus |

## Why the problem matters

BNS invariants connect group characters, finiteness properties, splittings and
fibrations. Their connected components encode genuinely different regions of
character space, but the outer automorphism group can make a large raw count
misleading.

The componentwise kernel-rank minimum is useful because it converts the
symmetry question into an intrinsic arithmetic obstruction. It does not
require a complete description of $\operatorname{Out}(G_m)$ to prove that
many components remain inequivalent.

That strategy may be reusable beyond this family: construct a tractable
chamber arrangement, attach an automorphism-invariant complexity to each
chamber, and force that complexity to take many different values.

## How to inspect or reproduce the checks

Use immutable tag `v0.2.0-candidate` or version DOI
`10.5281/zenodo.22201487`, not moving `main`.

For the exact mathematical checks:

```sh
python3 -B verify_theorem.py
python3 -B -O verify_theorem.py
python3 -B tests/test_mutations.py
node verify_theorem.mjs
```

For the complete package, document and manifest gates:

```sh
bash run_all.sh
```

Expected terminal markers include:

```text
PASS_BNS_FAMILY_CERTIFICATE
PASS_CERTIFICATE_AND_CLAIM_BOUNDARY_NEGATIVE_CONTROLS
PASS_BNS_FAMILY_JAVASCRIPT_RECONSTRUCTION
PASS_READ_ONLY_FROZEN_REPLAY
```

A successful run confirms the encoded finite consequences and package
integrity. It does not prove the universal theorem, validate the
Cashen–Levitt source independently, establish novelty or confer peer review.

## The most valuable next projects

1. Compute $\operatorname{Out}(G_m)$ or otherwise determine the exact component-orbit count.
2. Decide whether the two members of each antipodal component pair lie in one orbit or two.
3. Reconstruct Cashen–Levitt applicability and the Bass–Serre rank argument in a materially separate stack.
4. Formalize the graph map, character calculation, imported-theorem interface and chamber minimization.
5. Search for broader families in which intrinsic fiber-complexity minima separate still more chamber orbits.
6. Obtain authenticated specialist review and a wider historical-priority assessment.

## What is in the evidence package

The all-files ZIP contains the DOI-bearing PDF and source, aligned Markdown,
the compact proof and machine-readable theorem certificate, exact Python and
JavaScript verifiers, eight hostile controls, source/citation/novelty records,
review materials and response, licences, environment declaration, release
notes, checksums and complete manifest.

The local ZIP is 361,405 bytes with SHA-256
`fd1d5d2fb4b0cb25671aa19ea35ec3cf9d38ff879fe0412f67d6d87ce4197640`.
The version DOI is the citation target. Any mathematical correction should be
released as a versioned successor rather than silently replacing the frozen
candidate.
