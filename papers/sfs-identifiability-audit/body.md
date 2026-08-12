## What this release establishes

A site-frequency spectrum (SFS) is a histogram of how often genetic variants appear in a sample. The candidate theorem characterises which linear questions about population-size history are point-identified by an exact finite-sample expected SFS. The linked empirical audit is a separate application: it reports identified sets for published spectra under declared error-model settings. Its findings are conditional on those settings and spectra.

## Why finite spectra leave historical questions open

Modern genomes carry traces of ancient population sizes, but the SFS is a small summary of a much larger history. A sample of *n* genomes yields *n*−1 frequency classes. In coalescent time, those classes correspond to finitely many blurred averages of history. A fitted curve can contain much more detail, but that extra detail is supplied by a model or selector rather than identified by the finite spectrum alone.

This matters for claims such as a crash to about 1,280 breeding individuals roughly 900,000 years ago. Published groups have reached different conclusions from related public data and different processing or modelling choices. The release does not resolve that dispute without assumptions; it makes the relevant identification boundary and assumption dependence explicit.

## The exact theorem

Over the positive history class and scale normalisation stated in the paper, a bounded linear historical functional is point-identified by the exact finite-sample expected SFS if and only if its weight lies in the span of the sample's exponential kernels. Values at particular times, sharp-window averages and detailed curve shapes generally lie outside that span.

The theorem is constructive. For questions outside the span, the package builds distinct positive histories with the same exact finite expected spectrum. It also gives a severe-bottleneck history and a continuous alternative whose normalised expected spectra are extremely close. These are theorem- and model-specific constructions, not estimates of the true human history.

## What the certificates add

For a declared historical quantity and a declared admissible class, rank-reduced linear programmes compute the full compatible range. Each endpoint carries a high-precision dual certificate. A Tavare-formula implementation of the coalescence-to-SFS bridge agrees with the primary generator route at machine precision, and mutation controls show that the comparison is live.

Both implementations were produced within the same workflow. Their agreement is a same-producer implementation-diversity check; it is not an independent reimplementation or an unaffiliated reproduction. Earlier v0.1.0 interval endpoints, which depended on numerically meaningless equality directions, remain explicitly superseded.

## How the linked audit was staged

Stage one's protocol was frozen and externally timestamped before real-data contact. It fixed the data hashes, grid, multinomial error model, target questions and outcome interpretation. Stage two was different: its error-model form and parameter ladder were informed by stage-one diagnostics on the same nine spectra. The stage-two protocol was frozen before any stage-two real-data interval endpoints were computed, but it was not independent of prior real-data contact.

The inputs are deposited spectra from the dispute's participants: seven population spectra associated with the original claim and two alternative processings of Yoruba data. The audit treats those spectra and their upstream processing as given.

## What stage one found

Under the frozen multinomial model, which treats the very large reported site counts as independent observations, no single-population Kingman history in the declared class fits any of the nine spectra. The result rejects that model-and-error combination; it does not show that no population history could have generated the genomes.

Feasibility returns only after reducing the effective independent information to roughly hundreds or tens of thousands of sites, depending on the spectrum and concession. This diagnostic motivated the stage-two error-model ladder.

## What stage two found

At the most information-preserving declared stage-two setting, two Yoruba processings give family-union depression-ratio intervals of [0.162, 0.934] and [0.132, 0.961]. Under that setting, both intervals support depression relative to the declared baseline and exclude the claimed severity range. The European and East Asian spectra exclude the claimed severity there but do not establish depression.

Those statements do not survive every declared concession. As the effective information and error allowances are relaxed across the full ladder, the identified sets widen until they are uninformative. The intervals therefore support a setting-conditional reading; they are not a model-free verdict on whether, when or how severely the ancestral population changed.

## What this does not establish

This is an unrefereed candidate produced and checked within the originating workflows. No unaffiliated group has rerun the package, no independent implementation has been assessed, no population-genetics specialist review is recorded, no proof has been formalised, and bibliographic priority is not claimed. Two unarchived model critiques informed earlier repairs but are not public external reviews.

The page, audio and video are communication assets, not additional evidence. The versioned paper, code, protocol records, executed-audit deposits, certificates and deviation ledgers are the evidence record. The preserved v0.2.0 release and briefing document the earlier wording; v0.2.1 supplies the additive correction.
