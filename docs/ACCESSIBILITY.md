# Accessibility

Target: **WCAG 2.2 Level AA**.

This document states what has been tested and what has not. It is not a
conformance claim. Automated tools detect roughly a third of WCAG failures, so
an all-green CI run is a floor, not a result.

## Automated, in CI

`.pa11yci.json` runs pa11y-ci with both the axe and HTML CodeSniffer runners
against nine representative URLs — the catalogue, About, the AI-agents page,
the Observatory programme and essay, and four releases chosen to cover the
combinations that exist: heavy mathematics, audio, video embed, and a
correction notice. This runs on every push and pull request.

### What is excluded from the automated pass, and why

Three exclusions. Each is a case where the tool reports *"I could not determine
this"*, and the automated output would otherwise read as a defect. Each is
justified below rather than simply silenced.

**`.katex-html`** — KaTeX emits both a visual rendering and accessible MathML.
Checking the visual copy produces findings that correspond to nothing a
screen-reader user encounters.

**`frame-tested`** — axe cannot inject itself into a cross-origin third-party
iframe, so it reports that the YouTube player was *not tested*. The player's
internals are not under this site's control; what is under our control is the
`title` attribute on every embed, which is present.

**`.hero-art`** — the homepage hero text sits over an absolutely-positioned SVG,
and axe cannot sample a background painted by artwork, so it flags the heading
and standfirst as indeterminate contrast. Hiding the decorative layer lets axe
evaluate against `.hero`'s real `background-color` instead of skipping the
check. The exclusion is safe because the artwork can only shift the background
within a passing range — computed from source:

| Text | Over | Ratio | AA needs |
|---|---|---|---|
| `h1` `#f0fdfa` (2.9rem, large) | `--accent` `#134e4a` | 9.09:1 | 3.0:1 |
| `h1` `#f0fdfa` | darkest gradient stop `#0d3330` | 13.13:1 | 3.0:1 |
| `h1` `#f0fdfa` | worst case: 21% `#2dd4bf` over `#134e4a` | 6.13:1 | 3.0:1 |
| `.standfirst` `#ccfbf1` (1.2rem, normal) | `--accent` `#134e4a` | 8.41:1 | 4.5:1 |
| `.standfirst` `#ccfbf1` | darkest gradient stop `#0d3330` | 12.15:1 | 4.5:1 |
| `.standfirst` `#ccfbf1` | worst case: 21% `#2dd4bf` over `#134e4a` | 5.67:1 | 4.5:1 |

The worst case is the brightest decorative stroke at its maximum opacity over
the lightest gradient stop. If the hero palette or the artwork's opacities
change, recompute this table — the exclusion is only valid while these hold.

## Implemented deliberately

| Requirement | How it is met |
|---|---|
| 2.4.7 Focus Visible / 2.4.11 Focus Not Obscured | A 3px outline with 2px offset on every interactive element, via `:focus-visible` so it does not appear on mouse clicks. A brighter variant on dark backgrounds. |
| 4.1.3 Status Messages | A single polite live region reports copy results, media failures, and filter result counts without moving focus. |
| 2.3.3 Animation from Interactions | `prefers-reduced-motion: reduce` disables smooth scrolling, card transitions and card movement. |
| 1.4.3 Contrast (Minimum) | Palette ratios recomputed from source: ink on paper 16.37:1, muted text 7.14:1, links 5.12:1, white on teal 5.47:1 and 9.48:1, amber on pale amber 4.51:1. The amber pairing is the one to watch; it clears AA for normal text with little margin. |
| 1.1.1 Non-text Content | Cover art is decorative (`alt=""`, `aria-hidden`, removed from tab order). Every audio briefing has a full transcript. |
| 3.3.1 Error Identification | Copy failures are announced and the text is selected so it can still be copied by hand, rather than the button falsely reporting success. |
| 1.3.1 Info and Relationships | Filtered-out cards are set `hidden`, so they leave the accessibility tree rather than merely disappearing visually. |

## Not yet done

These are required before any conformance claim can be made:

- **Manual keyboard-only pass** over every page type, including the video
  embed and the expandable plain-English companion essay.
- **Screen-reader testing**: VoiceOver on macOS and iOS, NVDA on Windows.
- **200% and 400% zoom / reflow** (1.4.10) at 320 CSS pixels.
- **Windows High Contrast Mode** and forced-colors.
- **Caption verification** for the video briefings, as distinct from the audio
  transcripts, which are verified.
- A published **accessibility conformance report** (an ACR/VPAT-style summary)
  once the above are complete.

## Reporting a barrier

Open an issue at <https://github.com/ipitchford/evidence-press-site/issues>
describing the page, what you were using, and what happened. Accessibility
defects are treated as publication defects: research that cannot be read is
not published.
