## Summary

This page explains, in order: what the question is, what Cooper and Spencer conjectured, what this release found, how the argument works, and what has and has not been checked.

**The question.** A *simple random walk* on a grid takes one step at a time, each step chosen at random among the directions along the grid axes (forwards or backwards in each of $d$ directions). Fix a target location some distance from the start, and ask: how likely is the walker to be standing exactly there after $n$ steps? Early on the chance is zero, because the target is out of reach. It then grows as the walker has time to get there, and eventually shrinks again as the walker wanders off. A parity rule complicates the picture slightly: on a grid, a given location can only be occupied at every other time (odd times or even times, depending on the target), so the natural sequence to watch is the chance at those admissible times only.

**What was conjectured.** It seems natural that this chance rises once and then falls, with a single peak. Cooper and Spencer conjectured exactly that (Conjecture 3 in *Simulating a Random Walk with Constant Error*, 2004 preprint, 2006 publication). Their discussion proves it in one and two dimensions, and the question also appears on Cooper's problem list.

**What was found.** In high enough dimension the conjecture is false. In 26 dimensions, for a target 17 steps along one axis, the chance falls from time 65 to time 67 and then rises again at time 69: the sequence has a dip, so it cannot have a single peak. The changes are small (the ratios are about 0.99982 and 1.00008), but they are proved in exact integer arithmetic, not estimated. A separate written argument gives counterexamples in every dimension of at least 64, in both the step-by-step walk and its continuous-time version, and an additional continuous-time example is certified in dimension 40.

**What it means.** A shape assumption that would simplify bounds and arguments about random walks cannot be used in general without further hypotheses. The result does not identify the smallest dimension where failure occurs, and no practical or algorithmic impact is claimed.

**Status.** An anonymous, unrefereed candidate preprint with exact arithmetic certificates and an inspectable written proof. Its review was internal and model-mediated; there has been no external peer review or proof-assistant formalisation.

## Summary for specialists

For the nonlazy simple symmetric nearest-neighbour walk on $\mathbb Z^{26}$, started at zero and with $v=(17,0,\ldots,0)$, the candidate establishes

$$
p_{65}(v)>p_{67}(v)<p_{69}(v).
$$

These times belong to the same supported parity class. For every integer $d\ge64$, the endpoint $(\lceil3d/5\rceil,0,\ldots,0)$ has nonunimodal occupation probabilities in both discrete time and continuous time with total jump rate one. Dimension 64 is a sufficient threshold, not a minimum-dimension claim.

| Result | Status |
|---|---|
| $p_{65}(v)>p_{67}(v)<p_{69}(v)$ for $d=26$, $v=(17,0,\ldots,0)$; Conjecture 3 is false (Theorem 1) | exact integer certificate |
| For every $d\ge64$, $m=\lceil3d/5\rceil$: neither $t\mapsto q_t(v)$ nor $n\mapsto p_n(v)$ on its parity class is unimodal (Theorem 2) | written proof; finite rational inputs certified |
| Parity-sensitive Poissonisation: continuous-time failure transfers to discrete time when the initial occupation is zero (Lemma 4) | written proof |
| $q_{80}(v)>q_{120}(v)<q_{160}(v)$ for $d=40$, $v=(25,0,\ldots,0)$ (Proposition 8) | rational series certificate |
| $\Psi(s)=s(1-r(s))$, $r=I_1/I_0$, has a unique maximum in $(1,2)$ (Appendix C) | written proof (supplementary) |

## Technical account

**The finite witness.** It comes from disjoint multinomial allocations of positive and negative coordinate steps (Lemma 3). The exact count $W_n$ is normalized by $(2d)^n$, so successive supported times require comparison with $(2d)^2$, not $2d$. With $(2d)^2=52^2=2704$, the certificate proves rational bounds on $W_{67}/(2704W_{65})$ just below one and on $W_{69}/(2704W_{67})$ just above one; the decimal ratios are approximately $0.9998238864$ and $1.0000772522$, but no floating-point comparison is used in the proof.

**The infinite family.**

For the infinite family, the continuous-time occupation probability is

$$
q_t=e^{-t}I_m(t/d)I_0(t/d)^{d-1}.
$$

Two rational Bessel-ratio inequalities make its logarithmic derivative negative at $2d$ and positive at $4d$. The proof controls the rounding in $m=\lceil3d/5\rceil$ uniformly. A parity-sensitive Poissonisation lemma then transfers nonunimodality back to discrete time. This transfer requires zero initial occupation at the nonzero endpoint, and it uses an exact differential identity rather than a de-Poissonisation approximation.

**Why the parameters work.** Writing $r(s)=I_1(s)/I_0(s)$ and $\Psi(s)=s(1-r(s))$, the rational bounds give $\Psi(2)>151/250=0.604$ and $\Psi(4)<273/500=0.546$. The ratio $3/5=0.6$ lies between these values, so the leading term of the logarithmic derivative is negative at $s=2$ and positive at $s=4$; the proof controls both the correction and the rounding in $m$.

**What is classical.** The counting identities and Bessel representation are classical. So is the variation-diminishing component of the transfer argument; the paper compares it precisely with Karp, Vishnyakova and Zhang's functional-series theorem. The claimed contribution is the counterexample and the uniform family.

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
