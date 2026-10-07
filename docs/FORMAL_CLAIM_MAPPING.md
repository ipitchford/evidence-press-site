# Adopting external formal results

Apply only when a formal result supports a research claim, not to presentation
updates. Keep a compact record of the exact mathematical claim; pinned theorem,
definitions and dependencies; hypothesis/quantifier correspondence; toolchain;
allowed axioms; computation boundary; commands, logs and hashes; and exclusions.

Report source inspection, compilation, statement comparison, axiom inspection
and any second-kernel check separately. Comparator (or an equivalent check) can
compare a solution with a trusted statement and constrain its axioms. A green
build, a paper title or absence of the word `sorry` cannot do this. Challenge
files may deliberately contain placeholders; definition holes still require
semantic review. Preserve the current checker sandbox rather than bypass it.

Fetch and build only the required closure in an isolated, credential-free
checking directory. Keep downloaded caches and modified build configuration in
the trust record. Do not modify the proof to make an audit pass without recording
the change as a new object. Missing sources, unavailable platform requirements
and not-run checks are explicit unresolved obligations, not negative theorems.

A dated external-development note may explain what would follow if a claim is
verified. It must not upgrade the original release's assurance or alter its
archived package. Manuscript dates alone do not establish public priority.

For research-method reuse, record the failed obligation and reopening condition
for abandoned approaches. Test the weakest semantic bridge before scaling an
expensive computation. Abridged, selected reasoning summaries are examples of
practice, not evidence of comparative productivity.

Reference: [Lean Comparator](https://github.com/leanprover/comparator).
