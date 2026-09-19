## Summary

Imagine watching the chance that a random walker occupies one particular location. It may seem natural that this chance rises once and then falls. Cooper and Spencer conjectured this for a simple symmetric walk on an integer lattice, after accounting for the fact that only every other time can reach a given location.

This candidate gives an exact counterexample. In dimension 26, the probability falls from time 65 to 67 and rises again at time 69. A written argument also gives counterexamples in every dimension at least 64. The release is an unrefereed preprint with arithmetic certificates and an inspectable proof.

## Summary for specialists

For the nonlazy simple symmetric nearest-neighbour walk on $\mathbb Z^{26}$, started at zero and with $v=(17,0,\ldots,0)$, the candidate establishes

$$p_{65}(v)>p_{67}(v)<p_{69}(v).$$

These times belong to the same supported parity class. For every integer $d\ge64$, the endpoint $(\lceil3d/5\rceil,0,\ldots,0)$ has nonunimodal occupation probabilities in both discrete time and continuous time with total jump rate one. Dimension 64 is a sufficient threshold, not a minimum-dimension claim.

## Technical account

The finite witness comes from disjoint multinomial allocations of positive and negative coordinate steps. The exact count $W_n$ is normalized by $(2d)^n$, so successive supported times require comparison with $(2d)^2$, not $2d$.

For the infinite family, the continuous-time occupation probability is

$$q_t=e^{-t}I_m(t/d)I_0(t/d)^{d-1}.$$

Two rational Bessel-ratio inequalities make its logarithmic derivative negative at $2d$ and positive at $4d$. The proof controls the rounding in $m=\lceil3d/5\rceil$ uniformly. A parity-sensitive Poissonisation lemma then transfers nonunimodality back to discrete time. This transfer requires zero initial occupation at the nonzero endpoint.

The counting identities and Bessel representation are classical. So is the variation-diminishing component of the transfer argument; the paper compares it precisely with Karp, Vishnyakova and Zhang's functional-series theorem. The claimed contribution is the counterexample and the uniform family.

## Evidence, assurance and limitations

The package includes the written proof, three exact walk counts, rational probability-ratio enclosures, Bessel tail certificates, two counting implementations and small direct lattice enumerations. Normal and optimised Python checks pass. Deliberately corrupted certificates and a wrong time-step normalization are rejected.

These are producer-side checks. The five-role model-mediated editorial round is internal review, not external journal peer review. The universal theorem is not formally verified by a proof assistant. The supplied anonymous review's reported separate checker is not promoted to authenticated external reproduction.

No minimum counterexample dimension, complete endpoint classification, exact all-time number of modes, or sharp phase boundary is established. A bounded literature search found no earlier equivalent disproof but does not certify historical priority.

## Relationship to earlier work

The target is Conjecture 3 in Cooper and Spencer's *Simulating a Random Walk with Constant Error* (2004 preprint; 2006 publication). It concerns occupation at a fixed endpoint, not first passage or spatial unimodality. Their main deterministic-simulation theorem and two other conjectures are not refuted by this result.

The review suggested extending the original family in dimensions divisible by five to every integer dimension at least 64. The revised proof incorporates and checks that suggestion. No unaffiliated endorsement is inferred.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Random-walk researchers | A precise obstruction to universal temporal unimodality. | Keep parity, endpoint and clock conventions fixed. |
| Analysts studying transforms | A short parity-sensitive application of sign-change control. | The initial condition is essential; the sign-change theory is classical. |
| Scientific-software reviewers | Small exact witnesses and corruption tests. | Replay certifies finite arithmetic, not historical novelty or the universal proof. |

## Why the problem matters

A general shape assumption can make bounds and arguments simpler. An exact counterexample identifies where that assumption cannot be used without further hypotheses. The uniform family explains why this failure is not confined to one computed instance. No algorithmic speedup or practical impact is claimed.

## How to inspect or reproduce the recorded checks

Download the versioned evidence archive or clone the linked repository. From its root, run:

```sh
python3 code/verify.py --compare evidence/certificate.json
python3 -O code/verify.py --compare evidence/certificate.json
python3 code/test_verify.py
python3 code/negative_controls.py
```

The code uses only the Python standard library. Python 3.9 and 3.12 are the declared Linux CI targets. Read the Poissonisation lemma and the rounding inequalities separately: no finite replay replaces those arguments.

## The most valuable next projects

- Determine whether smaller dimensions admit counterexamples, without confusing incomplete searches with minimality.
- Characterise which endpoints fail and how many modes occur over the full time axis.
- Investigate how the parity-sensitive argument extends to other walks or transforms, checking every initial-condition and kernel hypothesis.
- Continue targeted prior-work comparison and reproduce the exact certificates outside the producer workflow.

## What is in the evidence package

The archive contains the PDF, editable LaTeX and Markdown, exact arithmetic code and tests, generated certificates, revision responses, internal editorial records, claim index, provenance, component licences and checksum manifest. The GitHub candidate tag and Zenodo version identify the immutable release. Audio and artwork explain the result; they are not additional mathematical evidence.
