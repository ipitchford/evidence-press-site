# Graphics repair — 19 September 2026

Scope: presentation only. Five latest release covers, corresponding social
cards, mobile article-banner fit, and forward-looking art-direction guidance.
No manuscript, DOI, audio, thumbnail, research metadata or assurance changes.

## Visual acceptance

All five slugs in `tools/art-direction.js` were inspected in the local release
page at 1280px desktop and 390px mobile width. All five 1200x630 social cards
were opened and inspected separately. No text collisions or clipped labels
exist in the replacement covers (they intentionally contain no rendered text).
The full-width composition remains visible on mobile; thin secondary links are
decorative and the major nodes/structures remain distinguishable.

The polynomial article was inspected at 390px to confirm that both sides of the
banner survive. The changed article-corpus test compares rendered mobile ratio
with intrinsic image ratio, rather than rewarding the previous centre crop.

The shuffle-class highlight was corrected during inspection to match its colour
class. Schematic descriptions explicitly avoid treating illustrative positions
and connecting paths as numerical measurements or complete permutation data.

## Prevention

Repository AGENTS.md now routes graphics work to docs/ART_DIRECTION.md. The
installed Evidence Press publication skill and authoring reference were updated
with the same division between banners, figures and thumbnails and the explicit
desktop/mobile visual acceptance requirement. CI checks deterministic generation
of the five repaired covers. It does not certify aesthetic merit.

## Limit

This is an initial targeted repair, not a claim that all 77 historical release
graphics have received a full design review. Existing positive examples and
unrelated assets are unchanged. No paid image or design service was used.
