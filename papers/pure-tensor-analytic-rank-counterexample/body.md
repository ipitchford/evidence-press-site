## Summary

An archived AIM problem-list page displays a tensorization inequality for
analytic rank or partition rank. Under one literal reading of its analytic-rank
branch, the inequality fails for the simplest possible kind of tensor: a pure
tensor.

The result depends on the wording. It refutes the **literal, unnormalised
analytic-rank instantiation** under standard base-$p$ analytic rank and
fixed-order Kronecker powers. It does not refute a normalized or
powered-identity formulation, establish what the proposer intended, or settle
partition rank.

## The exact statement: the literal comparator

The archived page prints a bound of the form

$$
\mathbf r(A^{\otimes m})<\mathbf r(I)^m c^m,
$$

where $I$ is the identity tensor on the same space, $c<1$, and $\mathbf r$ is
analytic rank or partition rank. For the analytic-rank branch, the candidate
uses

$$
\operatorname{arank}_p(T)=-\log_p\operatorname{bias}(T)
$$

and groups corresponding tensor legs in each Kronecker power. The archived
display does not specify that logarithm base, grouping, normalization or the
relationship between its two rank branches. Those conventions are assumptions
of the conditional theorem, not recovered historical facts.

## The technical mechanism: the pure-tensor witness

Work over $\mathbb F_2$, at order three and side length two. In fixed coordinate
bases, take

$$
A=e_1^*\otimes e_1^*\otimes e_1^*,\qquad
I=e_1^*\otimes e_1^*\otimes e_1^*+
e_2^*\otimes e_2^*\otimes e_2^*.
$$

For a nonzero pure order-$d$ tensor over $\mathbb F_p$, character orthogonality
gives

$$
\operatorname{bias}(A)=1-(1-1/p)^{d-1}.
$$

Here that bias is $3/4$. Writing $a=\log_2(4/3)$,

$$
\operatorname{arank}(A)=a,
\qquad
\operatorname{arank}(I)=2a.
$$

The hypothesis $\operatorname{arank}(A)<\operatorname{arank}(I)$ therefore
holds strictly.

## Why every positive power eventually fails

Under the fixed-order Kronecker product, a pure tensor remains pure. Its active
diagonal support has size one at every power, so

$$
\operatorname{arank}(A^{\boxtimes m})=a
$$

for every positive integer $m$. The proposed scalar right-hand side is
$(2ac)^m$. The exact rational comparison

$$
(4/3)^2=16/9<2
$$

implies $2a<1$. Thus $2ac<1$ for every fixed $0<c<1$, so $(2ac)^m$ tends to
zero and is eventually smaller than the constant left-hand side $a$.

This is an all-power proof, not an extrapolation from finite computation.

## The powered-identity diagnostic

The same diagonal calculation shows exactly where normalization matters. If
$D_{k,n,d}$ has $k$ active diagonal coordinates inside side length $n$, then

$$
\frac{\operatorname{arank}(D_{k,n,d}^{\boxtimes m})}
{\operatorname{arank}(I_{n,d}^{\boxtimes m})}
=\left(\frac{k}{n}\right)^m.
$$

The one-dimensional diagonal scale cancels. This exact ratio is a useful
diagnostic for corrected tensorization statements, but it is only a diagonal
comparison. The candidate does not prove a general normalized tensorization
theorem or claim that this is the uniquely intended historical formulation.

## What this does not show

| Question | Recorded status | Reason |
|---|---|---|
| Literal unnormalised analytic-rank instantiation | Refuted under stated conventions | The pure tensor stays at rank $a$ while the printed scalar bound decays to zero |
| Normalized or powered-identity analytic-rank formulation | Not refuted | The diagonal ratio becomes exactly $(k/n)^m$ |
| Partition-rank formulation | Unresolved | Partition rank is normalized differently; the pure-tensor numerical mechanism does not transfer |
| Historical intended meaning | Not established | The archived display omits decisive convention and normalization details |
| Novelty or priority | Not established | The diagonal formula and normalization principle are known; only the AIM-specific substitution may be new |

A tempting partition-rank route uses the order-four determinant, whose
partition rank is below that of the identity. It does not close the problem:
the needed order-four tight-support entropy equality is unavailable. The
package preserves this stopped route instead of presenting it as evidence.

## Evidence, assurance and limitations

The package contains the five-page DOI-bearing manuscript, a self-contained
proof, exact Python replay in normal and optimized modes, a same-producer
JavaScript reimplementation, and direct coefficient-level enumeration. The
enumerator checks 64 assignments at $m=1$ and 4,096 at $m=2$, reproducing
biases $3/4$, $9/16$ and $81/256$. Seven deliberately corrupted assertions are
all rejected.

One supplied Major Revision review was actioned through a full response matrix.
A producer-coordinated five-role internal editorial gate then returned
`PASS_WITH_NOTES` with no new P0 or P1 scientific issue. The roles test
different questions, but they were produced within the same workflow and are
not cognitively or organizationally independent.

Public Linux CI runs the replay on four Python/Node combinations and separately
rebuilds the PDF. GitHub and Zenodo expose the same PDF, 51-file ZIP and
manifest; fresh downloads match their local SHA-256 values. These facts
establish availability, integrity and producer-side replay. They do not
establish independent reproduction, independent reimplementation, formal
verification, external specialist review, editorial peer review, novelty,
priority or field acceptance.

## Relationship to earlier work

Lovett developed analytic rank in the standard bias-based framework and
recorded the diagonal scaling used here. Bhrushundi and collaborators gave
bias lower bounds for multilinear forms, with the order-three pure-tensor
constant $3/4$ appearing naturally. Later work on geometric rank and subrank
makes normalization factors explicit when comparing tensor parameters.

Partition rank has a different identity normalization. Naslund introduced the
parameter in the relevant combinatorial setting, and Lampert and Moshkovitz
proved that the order-four determinant has partition rank three. That fact is
why the stopped determinant route is interesting, but it does not supply the
missing asymptotic equality.

The candidate contribution, if novel, is narrower: applying known diagonal
bias and support formulas to the literal archived comparator and isolating the
normalization failure. No first or priority claim is made.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Tensor-rank researchers | A minimal normalization stress test for future tensorization statements | Keep the literal comparator separate from powered-identity and partition-rank formulations |
| Additive combinatorialists | A source-bound clarification of an AIM problem-list display | Do not summarize the broader AIM problem as solved or false |
| Computational reviewers | Tiny exact instances, coefficient enumeration and hostile controls | Reimplement independently rather than importing producer conventions |
| Formalizers | A short orthogonality and diagonal-support proof | Historical source interpretation is not a formal theorem obligation |
| Research agents | A worked example of source-to-theorem and assurance separation | DOI, CI and internal review do not imply novelty or peer review |

## Why the distinction matters

Tensorization statements amplify small one-shot gaps into exponential ones.
That amplification is meaningful only when numerator and comparator scale in
compatible ways. Here a rank-one tensor remains rank one on the relevant
diagonal scale, while an unpowered scalar identity rank is repeatedly
multiplied. The resulting decay is an artifact of the comparator, not a deep
high-power phenomenon.

The example therefore acts as a compact design test: before attempting an
asymptotic tensorization proof, verify the statement on pure and diagonal
tensors and compare against the powered identity. That test cannot solve the
normalized or partition-rank problems, but it can prevent effort being spent
on a literally false formulation.

## How to reproduce the recorded checks

Use tag `v0.2.0-candidate` or the Zenodo version DOI, not the moving `main`
branch. From a fresh extraction with Python 3.12 or later and Node.js 20 or
later, run:

```sh
sh run_all.sh
```

The script runs Python normally and with optimization, runs the JavaScript
reimplementation, performs direct coefficient checks at $m=1,2$, and requires
all seven negative controls to reject their corrupted claims. The expected
terminal marker is:

```text
ALL REPLAY AND NEGATIVE-CONTROL GATES PASS
```

Successful execution confirms the shipped finite predicates. The all-$m$
result rests on the written proof, and replay does not establish novelty,
independence or peer review.

## The most valuable next projects

1. **Historical source reconstruction.** Determine the intended normalization,
   logarithm and tensor grouping from contemporary notes or the proposer.
2. **Normalized analytic rank.** Formulate and test a powered-identity or
   scale-normalized tensorization statement beyond diagonal tensors.
3. **Partition rank.** Find a valid asymptotic mechanism or a genuine
   counterexample for the separately normalized partition-rank branch.
4. **Independent reconstruction.** Rebuild the proof and finite checks in a
   materially separate stack without importing the producer implementation.
5. **Formalization and specialist review.** Formalize the diagonal proof and
   obtain authenticated analytic-rank and historical-priority assessment.

## What is in the evidence package

The immutable release contains the canonical PDF and LaTeX, aligned Markdown,
proof and claim maps, source capture, Python and JavaScript replay, coefficient
enumeration, negative controls, citation and novelty audits, supplied-review
response, five internal role reports, provenance, licences, environment and
compute receipts, research metrics, release notes and a complete SHA-256
manifest. The version DOI is the citation target; any correction should be a
versioned successor, not a silent edit.
