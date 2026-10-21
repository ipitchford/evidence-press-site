## Summary

**The setting.** Many systems send a stream of timestamped status updates through a shared server. *Age of information* measures how old the freshest delivered observation is. Under *processor sharing*, every packet in the queue receives an equal share of the server at once, so a new update starts service immediately, but near saturation it shares the capacity with many older packets. Updates can also finish out of order: an old packet may still be in service after a fresher one has completed.

**The question.** When many updates share a busy processor, how old is the freshest information that has actually finished, and how fast does that age grow as the arrival rate approaches the stability limit? Counting jobs does not fully answer that question.

**What was found.** This paper shows that very short jobs determine the leading freshness scale near saturation. Two service laws can give the same stationary queue-population distribution yet different rates of information ageing. If the probability that a job needs less than $x$ units of work behaves like $cx^\beta$ for small $x$, the age grows like $(1-\rho)^{-\beta/(\beta+1)}$, where $\rho$ is the load. The result includes a limiting probability law and every positive moment, with a further extension for slowly varying corrections such as logarithmic factors.

**Status.** An unrefereed AI-assisted mathematical candidate. The limit and moment statements rest on written proofs; bounded computational checks supplement them. External specialist review, independent external reproduction and formal verification have not been established.

## Summary for specialists

Consider a stationary, lossless M/G/1 queue with egalitarian processor sharing. Arrivals are Poisson, service requirements have a fixed finite mean $m$, obsolete jobs remain in service, and the monitor keeps the greatest delivered generation timestamp.

If the service CDF satisfies $G(x)\sim cx^\beta$ at zero, put $\alpha=\beta/(\beta+1)$ and $\kappa=((\beta+1)m/c)^{1/(\beta+1)}$. Then
$$
(1-\rho)^\alpha A_\rho\Rightarrow
\kappa X^\alpha E^{1-\alpha},
$$
where $X,E$ are independent unit-mean exponential variables (Theorem 1). Every positive real moment converges: for every real $p>0$,
$$
\lim_{\rho\uparrow1}\mathbb E[((1-\rho)^\alpha A_\rho)^p]
=\kappa^p\Gamma(1+\alpha p)\Gamma(1+(1-\alpha)p).
$$

A regularly varying lower-end CDF of positive index admits the analogous limit under the manuscript's integral-defined normalization (Theorem 1a). No finite service second moment is required.

## Technical account

The intuition is simple: the completion of one sufficiently short new job refreshes the monitor, so the lower end of the service distribution governs the age scale. The proof turns the age event into a first-completion question. An auxiliary queue retains fresh arrivals indefinitely, giving an exact survival product. A monotone coupling controls departures from the old population, while stationarity makes that population nearly constant on the shorter freshness time scale. A uniform tail bound permits convergence of all positive moments.

For example, lower-end powers one, two and three give age exponents one half, two thirds and three quarters. These are asymptotic exponents, not finite-load error estimates. With exponential service, the leading mean-age coefficient is $\pi/(2\sqrt2)$ in the scale $1/(\mu\sqrt{1-\rho})$.

## Evidence, assurance and limitations

The synthetic audio briefing is explanatory, not additional evidence. Its [complete transcript](/assets/audio/processor-sharing-freshness.txt) is available for reading.

The limit and moment statements are analytic theorems. Fresh bounded checks cover finite rational means, scale algebra, a logarithmic diagnostic and a small stationary simulation. Larger historical simulations are preserved as historical evidence and were not rerun for publication. Their finite-load bias is not hidden by the asymptotic result.

There is no guarantee for any chosen finite load, no finite-buffer theorem, and no result here for cancellation, non-Poisson arrivals, an atom at zero, a positive minimum service requirement or zero-index lower-end regular variation. The global stochastic comparisons in the paper use exponential service. Internal AI checking is not external specialist review, independent external reproduction or formal verification.

## Relationship to earlier work

The stationary M/G/1 processor-sharing population is geometric and insensitive to the service distribution beyond its mean. This classical fact is an input to the proof, not a new claim, and it does not imply insensitivity of freshness. The limiting product distribution is also familiar; the research claim is its occurrence as the stationary age limit, with an exponent determined by the lower end of the service law.

Gandarias, Doncel and Assaad (2023) stated a conjecture for the mean age of the infinite-buffer M/M/1 processor-sharing system. In the inspected arXiv version, its two printed near-saturation bounds are algebraically incompatible. The exponential-service case here ($\beta=1$) supplies the exact constant; together with separate stochastic comparisons it establishes the valid components of that conjecture, and the limit replaces both printed near-saturation bounds.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Queueing researchers | Distinguish population insensitivity from freshness sensitivity | The service law is fixed as load increases |
| Information-age researchers | Use a full distributional limit rather than only a mean | Freshest-delivered timestamps are essential |
| System designers | Identify short-job behaviour as a relevant modelling feature | The theorem is not a finite-load design guarantee |

## Why the problem matters

Queue length and information freshness measure different things. A model can hide service-distribution differences in one statistic while exposing them strongly in another. The distinction matters whenever old updates continue consuming capacity.

## How to inspect or reproduce the recorded checks

Read the model definition before the limit theorem, then follow the three proof tasks identified in the manuscript's guide: express age as a first-completion event, show that the large initial population changes negligibly on the shorter freshness time scale, and control the tail strongly enough to pass to moments. `CLAIMS.md` maps each claim to its evidence and boundary.

The repository README gives the bounded fresh replay commands and separates those receipts from `evidence/historical/` simulations. With Python 3 and NumPy:

```sh
python3 -B code/replay.py
python3 -B -O code/replay.py
python3 -B -O code/replay.py --negative-control
```

The third command must fail with a finite-chain mismatch. The random diagnostic is not a proof or a replay of the large historical simulations. Computational agreement does not substitute for the tail and uniform-integrability arguments.

## The most valuable next projects

Obtain controlled finite-load error bounds, test cancellation policies separately, or examine lower endpoints outside positive-index regular variation. Each changes a genuine boundary of the present model; additional simulations alone do not extend the theorem.

## What is in the evidence package

The self-contained manuscript (Markdown, LaTeX and PDF), fresh bounded checks (`code/replay.py`, including an independent rational finite-chain reconstruction and a small fresh-seed simulation) with replay receipts, the original simulation implementations, historical simulation records in `evidence/historical/`, claim map, source audit, novelty scope, revision response, assurance statement, environment requirements and agent-readable index are linked from the research repository. Text and data are CC0-1.0; code is MIT.
