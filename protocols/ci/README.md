# CI verification (template)

This directory holds a CI workflow that is **not installed**. It sits here on
purpose: dropping it into `.github/workflows/` at the repo root is a maintainer
decision, and until then nothing runs.

## Why it matters

The receipts and the live-eval assurance are currently **reproducible but not
trusted**: they are produced by author-controlled tools on an author-controlled
machine. Anyone can re-run `node tools/verify-all.js` on a clean checkout and get
the same result, so a status the gates do not support is *detectable* — but that
is not the same as a signed, independently-issued attestation.

CI closes that gap. When [`verify-protocols.yml`](verify-protocols.yml) runs on a
hosted runner:

1. it verifies from a clean checkout (a verifier identity distinct from any
   author);
2. it confirms the build is byte-identical (replay);
3. `tools/attest.js` emits `ATTESTATION.json` — one canonical digest over the
   repository receipt, every pack receipt, and the registry;
4. the maintainer signs that digest (sigstore/cosign via the workflow's OIDC
   identity) and/or publishes it to a transparency log.

Step 4 is the one that turns *reproducible* into *trusted*. It is left as an
explicit maintainer action rather than faked here.

## To activate

```bash
mkdir -p .github/workflows
cp protocols/ci/verify-protocols.yml .github/workflows/verify-protocols.yml
# then add a signing step (cosign sign-blob protocols/ATTESTATION.json) and commit
```

## What CI does NOT establish

Even CI-issued receipts do not re-run the *live model evaluation*: the live rung
is recomputed from committed raw outputs (deterministic acceptance), but the model
and blind-judge identities in a live result remain self-reported. Authenticated
provider transcripts are a further step. See
[`../KNOWN-LIMITATIONS.md`](../KNOWN-LIMITATIONS.md).
