# Security and integrity policy

Evidence Press is a static site. There is no server-side application, no
database, no user accounts and no user-submitted content. The realistic threat
model is therefore not remote compromise of a running service; it is
**corruption of the published record**.

## What counts as a security issue here

Anything that could cause the site to publish something other than what the
source says, or to lose something it has already published:

- a defect in the build that alters prose, mathematics, identifiers, metadata
  or assurance state;
- a way to make the build write outside `dist/`, or to emit a link or script
  that the source did not authorise;
- a way to remove or overwrite an already-published URL;
- a mismatch between the human-readable page and the machine-readable
  representations of the same release;
- a claim of verification, peer review or reproduction that the evidence does
  not support.

The last one matters as much as the others. The purpose of this site is to
state exactly what has and has not been checked, so an assurance overclaim is
an integrity failure, not a presentation bug.

## Reporting

Open an issue at
<https://github.com/ipitchford/evidence-press-site/issues>, or use GitHub's
private vulnerability reporting for anything you would rather not disclose
publicly first.

Please include the affected release or page URL, what the source says, and
what was published instead. A minimal reproduction against `build.js` is
ideal but not required.

There is no bug bounty. Reports are handled by a single maintainer on a
best-effort basis.

## What happens to a confirmed integrity defect

1. The defect is fixed and a regression test is added that fails without the
   fix. Every renderer test in `tools/test-render.js` exists because something
   went wrong once.
2. The site is rebuilt and the output diffed file-by-file against the previous
   build, so the blast radius is established rather than assumed.
3. If any published page changed, the affected release carries a dated
   correction notice recording what was wrong, what it now says, and when it
   was fixed. Corrections are additive: the record of the error stays.
4. `tools/check-published.js` gates the deploy, so a fix can never silently
   drop a published URL.

## Defences currently in place

- Output paths are asserted to stay inside `dist/`.
- Release slugs must match a narrow pattern, and slugs, DOIs and canonical
  URLs must be unique.
- Only `http:`, `https:` and `mailto:` may reach an `href` or `src`; anything
  else fails the build rather than being silently dropped or emitted.
- Release metadata is checked against a strict authoring schema before any
  file is written; a build with an invalid record does not produce a site.
- The published catalogue is validated against its own published JSON Schema,
  and the catalogue, feeds, sitemap, ledger and files on disk are checked
  against each other (`tools/test-metadata.js`).
- The deployed site sends a Content-Security-Policy with `script-src 'self'`;
  no page carries an inline script or an inline event handler.
- All assets are same-origin. The only third-party resource is the
  privacy-enhanced YouTube embed, which is the sole entry in `frame-src`.

## Known limitations

- The build trusts the contents of `papers/` and `pages/`. It validates their
  shape, but a maintainer with commit access can still publish a wrong claim.
  That risk is editorial, and is managed by `REVIEW_POLICY.md`, not by code.
- There is no reproducible-build attestation beyond the commit-derived build
  identity in `/api/build.json`.
