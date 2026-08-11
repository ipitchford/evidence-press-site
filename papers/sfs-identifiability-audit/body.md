## The problem in everyday terms

Modern genomes carry traces of ancient population sizes. The most common way to read them starts from a histogram: across a sample of genomes, how many genetic variants appear once, twice, three times, and so on. Fitting software turns that histogram into a curve of population size over hundreds of thousands of years, and headline claims — such as a crash to about 1,280 breeding individuals 900,000 years ago — are read off the curve.

The difficulty is that the histogram is a small object and the curve is a large one. A sample of n genomes yields exactly n−1 numbers about history. Everything beyond those numbers comes from the fitting method's assumptions, and different methods' assumptions fill the gap differently. That is not a hypothetical worry: the 900,000-year bottleneck claim is contested in print by three separate groups using the same public data.

## The exact boundary

The paper's theorem draws the line precisely. In coalescent time, each of the n−1 numbers is a blurred average of history — a weighted average whose weight is a fixed exponential curve. A historical quantity is pinned down by the data if and only if it is a combination of those n−1 blurs. Averages over sharp time windows, values at particular moments, and detailed curve shapes all fall outside the span, so the data alone cannot decide them.

The theorem is constructive in both directions. For any question outside the span, the paper builds explicit pairs of genuinely different histories — one with a severe crash, one a continuous curve never dipping below half of baseline — whose expected histograms agree to fifty decimal places by construction, and in a realistic example to within one part in twenty million. Positivity of the constructed histories is certified globally, not merely spot-checked.

## Certified bounds instead of curves

The constructive replacement is machinery that reports what the data actually constrain. For any declared historical quantity and any declared complexity budget on the admissible histories, linear programmes compute the full range of values consistent with the data — and every endpoint carries an arithmetic certificate computed to fifty digits, independent of the solver that produced it. A second implementation of the entire data-model bridge, built from a different mathematical route with exact rational arithmetic, agrees with the first at machine precision; eight deliberate-corruption controls confirm the checks are live. An earlier version of this package reported narrower bounds; those numbers were artefacts of imposing numerically meaningless constraints and are explicitly superseded.

## A pre-registered audit of the bottleneck dispute

The machinery was then pointed at the live controversy, under a discipline designed to remove the usual escape routes. Every analysis choice — data files identified by cryptographic hash, model grid, error model, complexity budgets, the mapping of the claimed epoch into coalescent time, the exact questions to be asked, and the interpretation of every possible outcome — was frozen, published, and timestamped before any real data touched the analysis code. The data are the dispute's own: the claimants' published spectra for seven populations, and two rival groups' independent processings of the same Yoruba data.

## What stage one found

Under the frozen first protocol, which treats the millions of genetic variants as independent observations, the answer was unequivocal: no clean single-population history of any shape reproduces any of the nine datasets. The rejection is itself certified, and its size is diagnostic — the error model must concede that each dataset carries the information of only a few thousand independent observations, not a few million, before any history fits. Discriminating a severe crash from a smooth alternative would require roughly ten orders of magnitude more information than the spectra contain. The failure localises where population genetics says it should: misassigned ancestral states in the high-frequency classes for most processings, and an excess of rare variants for the out-of-Africa samples.

## What stage two found

A second frozen protocol conceded these error channels honestly — a declared misassignment rate, a declared option to drop the contaminated classes, and an information budget set by the genome's recombination structure rather than by tuning. The paper is explicit that this model is informed by stage one's published diagnostics; what remained genuinely pre-registered is that no bound on the real data had ever been computed. Under the most information-preserving declared settings, the certified verdict on the claimants' own Yoruba data reads: the ancient window average sits between 16 and 93 per cent of the recent baseline — certifiably reduced, and certifiably far above the claimed crash to five or ten per cent. The rival Cousins–Durvasula processing of the same population certifies the same shape. The European and East Asian samples certify no reduction at all, matching the one point on which the disputing groups agree. Under laxer settings the ranges widen until nothing is excluded: precision here is purchased by error-model assumptions, and the purchase price is now itemised.

## What this does and does not establish

The certified reading — depressed, not severe — is conditional on declared error models applied to the participants' own published histograms, and the wider conclusion stands regardless of setting: the severity of the event is decided by modelling choices, not by the spectra. This page and its audio summary are communication, not evidence; the linked papers, protocols, code, certificates and deviation ledgers are the record. No independent group has reproduced any component, no specialist has reviewed the error models, no proof has been formalised, and bibliographic priority is not claimed.
