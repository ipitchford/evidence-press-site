## Summary

**The practical question.** Suppose two deterministic epidemic models match a recorded outbreak closely. Must their predictions remain close after the observation window ends? This is a *continuation* question. It differs from *reconstruction*: whether an exact, complete trajectory uniquely determines the contact matrix. An epidemic curve records how infection changes over time; a contact matrix records who can infect whom. Different contact matrices can produce the same curve, so the two tasks really are different.

**Where the question comes from.** Keliger and Horváth made this distinction precise for the deterministic susceptible–infected–susceptible (SIS) network model and posed a two-part conjecture (their Conjecture 3.11): the constant comparing an observable fitting residual on two time intervals should stay bounded, first at each fixed network size and then uniformly over all network sizes. The paper proves the first part and disproves the second.

**What was found, in three parts.** At every fixed number of communities, bounded SIS models do admit a finite linear continuation factor. No single linear factor works across all network sizes: the paper constructs exactly reconstructible models whose least factor grows at least exponentially. Uniform control is nevertheless recovered by an explicit dimension-free Hölder estimate. A new corollary also handles finitely sampled, community-resolved trajectories through the sample fill distance and a bounded measurement-error term.

**Observation scope.** The theorem observes the full vector of infected fractions—one trajectory for every community—not total prevalence alone. Its finite-sample extension is deterministic; it is not a stochastic data or calibration model.

**Status.** Anonymous, AI-assisted and unrefereed. The universal results are written analytic proofs. Exact code checks replay selected finite constructions and hostile controls; there has been no external peer review, unaffiliated rerun or proof-assistant formalisation.

## Summary for specialists: central theorem and exact scope

Let $z_i(t)$ be the infected fraction in community $i$. The deterministic SIS model is

$$
\dot z_i=(1-z_i)(W\Pi z)_i-\gamma_i z_i.
$$

The paper compares the size of an observable model-fitting residual on an initial interval $[0,T_0]$ with its size on $[0,T]$.

| Question | Answer | Boundary |
|---|---|---|
| Is the least linear continuation factor uniformly finite when network dimension is fixed? | **Yes.** | Existence is proved; a useful numerical value is not computed. |
| Is there one linear factor independent of the number of communities? | **No.** An exactly reconstructible family has exponential lower growth. | The obstruction is for the stated residual norm; it is not automatically a lower bound for nonlinear trajectory error in another norm. |
| Is any dimension-free stability statement left? | **Yes.** An explicit Hölder estimate. | The exponent is conservative and not claimed optimal or practically sharp. |

The negative examples are especially informative because they are exactly reconstructible. Nothing is perfectly hidden: instead, one explicit direction is extremely hard to see during the observation interval and becomes relatively more visible later. The binomial theorem supplies that direction.

## Technical account

**Fixed dimension.** The positive result applies classical polynomial-ideal closure to obtain a scalar differential equation of uniformly bounded order and coefficients at each fixed dimension.

**Growing dimension.** The negative result uses complete weighted networks with equal population weights, identical initial infection fractions, and distinct bounded recovery rates. Every example is exactly reconstructible, yet its optimal continuation constant grows at least exponentially with the number of communities.

**The replacement.** The failed dimension-free linear estimate is replaced by an explicit dimension-free Hölder estimate. The same argument gives a direct Hölder bound from past trajectory error to future trajectory error, without differentiating the observations.

### From histories to samples

The direct trajectory theorem does not require differentiating the observations. If sample times have fill distance $\eta$, and the largest community-resolved discrepancy at a sample is $\delta$, then the continuous observed-interval discrepancy is controlled by

$$
\min\{1,\delta+4M\eta\}.
$$

If each recorded sample has error at most $\sigma$, replace $\delta$ by the recorded between-model discrepancy plus $2\sigma$. This is the tractable extension added during review. It makes explicit what dense sampling contributes while retaining the theorem's actual scope: deterministic bounded error and complete community-resolved observations.

### Reconstruction is a separate problem

If the trajectory span has dimension $r$, the symmetric contact-matrix ambiguity space has dimension

$$
\frac{(n-r)(n-r+1)}2.
$$

The paper also gives nonstationary failures of reconstruction without a nontrivial block-regular partition and classifies positive invariant rays. One complete-network reduction is explicitly credited to an earlier 2021 theorem; applying it to the later reconstruction conjecture is the new use, not the underlying reduction.

## Evidence, assurance and limitations

The synthetic audio briefing is explanatory, not additional evidence. Its [complete transcript](/assets/audio/sis-reconstruction-continuation.txt) is available for reading.

- **Analytic proof:** fixed-dimensional continuation, the growing-dimensional obstruction, the Hölder estimates, reconstruction-fibre dimension and invariant-ray classification.
- **Exact supplementary replay:** rational finite constructions, Taylor determinants and cancellation coefficients; ordinary and optimized Python agree.
- **Hostile controls:** a source mutation is rejected in both ordinary and optimized execution, so acceptance does not disappear under `python -O`.
- **Novelty boundary:** polynomial-ideal closure, complete-network reduction and bounded analytic continuation have prior literature. The claimed contribution is the model-specific resolution, admissible obstruction, explicit SIS modulus and sampled-observation extension.
- **Not established:** optimal constants, practical forecasting sharpness, aggregate-prevalence inference, a stochastic observation theorem, empirical epidemic calibration, independent reproduction, external specialist review or formal verification.

## Who should care, and why

The result is aimed at researchers working on epidemic inverse problems, analytic continuation, network dynamics and identifiability. Applied readers should begin with the three-way split above and the observation scope; specialists can then follow the proof architecture and exact finite checks in the paper and archive.

| Audience | Potential use | Required caution |
|---|---|---|
| Modellers fitting network epidemic models | A precise warning that a close fit on an observation window does not, uniformly in network size, control linear continuation error | The theorem observes the full community-resolved trajectory, not total prevalence, and its finite-sample extension is deterministic |
| Researchers on inverse problems and identifiability | A resolution of both parts of Conjecture 3.11, with exactly reconstructible counterexamples that separate continuation from reconstruction | The obstruction is for the stated residual norm |
| Analysts of analytic continuation and network dynamics | An explicit dimension-free Hölder modulus for SIS | The exponent is conservative and not claimed optimal or practically sharp |

## Why the problem matters

Fitting a model to an outbreak and then using it to look ahead is the basic workflow of epidemic modelling. The counterexamples show that, in this deterministic model, the danger is not hidden parameters: every example is exactly reconstructible. Instead, one explicit direction is extremely hard to see during the observation interval and becomes relatively more visible later. Knowing that the linear guarantee fails as networks grow, and what weaker guarantee survives, tells modellers which kind of stability statement they can rely on.

## How to inspect or reproduce the recorded checks

Start with the paper, then use `CLAIM_MAP.md` to match every theorem to its proof route and limits. The archive also contains `CITATION_AUDIT.md`, `ASSURANCE.md`, `AI_INDEX.md` and replay receipts.

From the extracted archive:

```sh
python3 code/verify_sis.py
python3 -O code/verify_sis.py
python3 code/test_negative_control.py
shasum -a 256 -c MANIFEST.sha256
```

The exact checks cover finite ray constructions, homogeneous-network examples, Taylor determinants and cancellation coefficients. They supplement, but do not machine-verify, the universal analytic proofs in the paper.

## The most valuable next projects

1. Audit the analytic-continuation constants independently and seek a sharper exponent.
2. Reimplement the exponential family and Gram-ratio calculation in separate software.
3. Determine whether comparable dimension-free bounds can be proved for partial or aggregate observation schemes.
4. Test whether the deterministic finite-sample guarantee can be embedded in a justified stochastic observation model.

## What is in the evidence package

The paper (`paper.pdf`, with its TeX and Markdown sources); `CLAIM_MAP.md` for theorem-by-theorem scope and proof dependencies; `ASSURANCE.md` for assurance classes and the review boundary; `REPLAY_RECEIPT.md` for exact replay and negative-control results; `CITATION_AUDIT.md` for the bounded novelty and prior-art audit; `AI_INDEX.md` as an agent-readable index; the verification code and figures; and SHA-256 manifests. Version 1.0.1 adds the local evidence links required for `AI_INDEX.md` to function; the mathematics is unchanged from 1.0.0. The paper, figures, data and documentation are CC0 1.0; code is MIT.
