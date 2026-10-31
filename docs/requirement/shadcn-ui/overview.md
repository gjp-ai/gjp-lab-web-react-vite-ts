# Showcase overview

**Status:** Proposed; not implemented.

**Route:** `/shadcn-ui`

[Showcase index](README.md) · [Shared requirements](shared.md)

## Behavior

- **S01 — Overview:** Show a short introduction, category links, and a searchable
  component catalogue. Search matches component names and example descriptions;
  category filtering combines with search. Show clear results and a useful empty
  state. Selecting a component opens its feature page at a named demo anchor.
- Show category links for all ten feature pages.
- Read names, descriptions, page routes, and sample anchors from the runtime coverage
  manifest; do not introduce another competing catalogue.
- Preserve the existing sidebar, footer controls, and hosting base.

## Acceptance checks

- [ ] All 66 baseline component entries are discoverable, with no missing/duplicate assignments.
- [ ] Name/description search and category filters combine correctly and can be cleared.
- [ ] Empty results explain how to recover.
- [ ] Every component link opens its actual feature page at the assigned demo anchor.
- [ ] Keyboard navigation and English/Chinese labels work without resetting app preferences.
