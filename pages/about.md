## What this site is

Evidence Press is a small, independent press office for a specific and unusual kind of research output: new results released **with the complete evidence attached** — code, data, exact certificates, verification records — before any journal has seen them.

Each release corresponds to one archived deposit: a manuscript, its evidence package, and its verification records, frozen on [Zenodo](https://zenodo.org) with a DOI and mirrored in a public GitHub repository. The releases explain each paper twice — once in plain language, once for specialists — and state, without varnish, what has and has not been verified. The current releases are mathematical; the format is built for research generally, and future releases need not be.

## The verification ladder

Every result here occupies a precise rung on a ladder of assurance:

1. **Claimed** — someone asserts a result.
2. **Internally replayed** — the claim ships with complete evidence and scripts, and the authors' own replay of that evidence passes, including mutation and negative controls. *Every release on this site is at least here.*
3. **Independently reproduced** — a separate team, with separate code, reaches the same result. *No release on this site is here yet.*
4. **Formally verified** — the full argument, including the bridge from claim to computation, is checked by a proof assistant or equivalent machinery.
5. **Peer reviewed and accepted** — the research community has examined and absorbed the result.

The distance between rungs 2 and 3 is the whole point of this site. Internal replay is real evidence — it rules out large classes of error, and anyone can rerun it — but it is not independent verification, and mistakes of encoding (where the thing checked is subtly not the thing claimed) remain logically possible. Each release page carries a verification-status box saying exactly this, and lists the open problems whose solution would move it up the ladder.

## Why publish before review?

Because the evidence is executable. A traditional preprint asks readers to trust prose; these releases ask readers to run code. Publishing the full evidence architecture early — with SHA-256 manifests, pinned environments, claim-to-evidence indexes, and deliberately mutated negative controls — lets anyone, human or machine, begin verification or refutation immediately. Refutation is a welcome outcome: a broken claim withdrawn quickly is a success of the format.

## How the research is produced

The research in the current releases was generated largely by AI systems (the specific models are credited on each release and in each Zenodo record), with human problem selection, mediation, and publication management. The project treats this as a fact to disclose prominently, not a claim of authority: AI authorship makes independent verification *more* important, not less, and the evidence packages are designed accordingly. Where releases depend on prior human results, those results are cited and, where necessary, pinned as explicit external dependencies with recorded hashes.

## Reading, listening, reusing

Each release offers several forms: the press page, the paper PDF, a narrated audio briefing of the plain-language summary, a Markdown version of the page, and structured metadata (JSON, BibTeX). Everything original on this site and in the releases is dedicated to the public domain under [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/) — reuse, republish, or build on any of it without permission. Preserving the unrefereed framing when quoting results is a scholarly request, not a legal condition.

## Contact and corrections

Each release links to its GitHub repository; issues and pull requests there are the fastest route for corrections, refutations, or independent reproduction reports. Substantiated refutations will be reflected on the affected release page.
