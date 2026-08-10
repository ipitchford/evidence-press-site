# Contributing

This is a small, single-maintainer project. Contributions are welcome; the
constraints below exist because the output is a publication record, not an app.

## The two rules that matter most

1. **Never lose a published URL.** `PUBLISHED.json` is a ledger of everything
   the site has ever published, and `tools/check-published.js` refuses any
   build that would drop one. If your change makes the gate fail, the change is
   wrong — not the gate.
2. **Never let the site claim more assurance than the evidence supports.** A
   release says what has and has not been checked. Adding a verification claim
   requires an attached record showing who checked it, when, and against what.

## Local development

```bash
REQUIRE_COMMITTED_MANIFESTS=1 ./protocols/deploy/integrate.sh
                               # writes the complete site to ./dist
node tools/test-operating-model.js # operating contract + hostile controls
node tools/test-render.js      # renderer regression and property tests
node tools/test-metadata.js    # schema conformance + cross-surface consistency
node tools/check-links.js      # every internal link and asset resolves
node tools/check-published.js  # publication-preservation gate
python3 -m http.server -d dist 8000
```

Node 18 or later. There are no runtime package dependencies; the composite
builder invokes the dependency-free host and protocol builders. A parser or framework added here becomes
part of the trusted computing base of a scholarly record.

## Before opening a pull request

- Run all checks above. CI runs the same ones on Node 18, 20 and 22.
- Rebuild twice and confirm `dist/` is byte-identical. The build must not
  depend on the wall clock or any other varying state; the build timestamp
  comes from the commit for exactly this reason.
- If you changed the renderer, add a test to `tools/test-render.js` that fails
  without your change. Every test in that file exists because something went
  wrong once.
- If you changed generated markup, confirm no page gained an inline `<script>`
  or an inline event handler. The pages ship a Content-Security-Policy with
  `script-src 'self'` and either would be blocked.
- Diff `dist/` against a build from `main` and be able to explain every changed
  file. "Only the files I meant to change, changed" is the strongest evidence
  a change is safe, and it is cheap to obtain:

  ```bash
  find dist -type f -exec shasum -a 256 {} \; | sort -k2 > /tmp/after.sha
  diff /tmp/before.sha /tmp/after.sha
  ```

## Changing published metadata

Release metadata is validated against a strict authoring schema before
anything is written. If the build rejects your record, read the error: it
lists every problem at once. Do not relax the schema to make a record pass
unless the schema is genuinely wrong about the world.

Every release outside the frozen adoption baseline must also carry a complete
`operatingModel` record and reciprocally resolve to one or more attempts in
`data/WORK_LEDGER.json`, registered methods, exactly one broad method cluster,
an explicit decision object, semantic bridge, human judgement gates, assurance
target, structured parent handoffs and one scoped impact claim for every
declared aim. A research lineage may be declared only when dependency evidence
exists. Do not add a new slug to the legacy list to bypass that requirement,
and do not reconstruct missing process clocks for historical releases. The
registry classifies reusable methods; it does not validate the release or
establish acceleration.

Adding a field to the public API is a compatibility decision. Fields may be
added within a major version but never removed or retyped; see
`/api/stability.json` for the policy and the deprecation procedure.

## Corrections

If a published page is found to be wrong, the fix is additive: the release
gains a dated entry in its `corrections` array recording what it said, what it
now says, and why. The error stays on the record. Silently repairing a
published claim would leave readers unable to tell whether they saw the wrong
version.

## Reviews

`REVIEW_POLICY.md` governs how external assessments are attached to a release.
The short version: a review is evidence about the reviewer's assessment, not
evidence that the claims are true.
