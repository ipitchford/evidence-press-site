# OEIS dissemination gate

This document records the safe disposition of the 30 July 2026 OEIS proof note. It is a workflow record, not an OEIS submission and not an independent review of the mathematics.

## Current classification

The note concerns eight sequences that already have OEIS entries. It does **not** contain new integer sequences requiring new entries.

| Entry | Proposed action | Claim boundary |
| --- | --- | --- |
| A202048 | Prepare proof/status edit | Existing empirical polynomial and generating-function claims; proof package needs publication and review before submission. |
| A202049 | Prepare proof/status edit | Same Hardin-array family; verify exact width-specific certificate and formula. |
| A202050 | Prepare proof/status edit | Same Hardin-array family; verify exact width-specific certificate and formula. |
| A202051 | Prepare proof/status edit | Same Hardin-array family; verify exact width-specific certificate and formula. |
| A325688 | Prepare proof/status edit | Existing Barker conjecture; verify reduction, formula, generating function, recurrence range, and offset. |
| A325689 | Prepare proof/status edit | Existing Barker conjecture; verify inclusion-exclusion, formula, generating function, recurrence range, and offset. |
| A325696 | Prepare proof/status edit | Existing Barker conjecture; verify distinct-parts reduction, formula, generating function, recurrence range, and offset. |
| A247000 | No proof-status edit | The note audits this as an open sharpening. At most prepare a carefully sourced status comment after publication; do not imply resolution. |

## Blocking gate

The source note and verifier currently lack an Evidence Press release, public repository commit, DOI, and independent review receipt. Before any OEIS edit is submitted:

1. process the note and `verify_all.py` as a candidate evidence package;
2. confirm the exact current OEIS text and revision for every entry;
3. run the verifier from a clean environment and inspect the mathematical bridge, not just its exit status;
4. obtain a second proof audit, especially for the transfer-matrix/Cayley-Hamilton horizon argument;
5. publish a stable citable version;
6. prepare one precise, entry-specific edit at a time for Ian Pitchford's review and manual submission.

The seven proposed updates must remain separate records. Acceptance of one does not imply acceptance of the others.
