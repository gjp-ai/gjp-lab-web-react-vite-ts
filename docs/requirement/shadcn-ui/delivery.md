# Delivery and verification

**Status:** Proposed; implementation has not started.

[Showcase index](README.md) · [Shared requirements](shared.md)

## Implementation constraints

- Keep the manually created feature-based SPA. Showcase pages, fixtures, example
  metadata, and tests belong to a dedicated feature; reusable owned components stay
  in `src/shared/ui`. Keep Node-only source tooling outside browser source.
- Reuse Button/Card and review official component source before adding it. Preserve
  Base Nova, existing customizations, and the upstream license notice. Do not replace
  the app shell with the demonstrated Sidebar component.
- Prefer official Base UI-compatible implementations. Review per-component imports,
  peer/runtime requirements, CSS tokens, and React 19/TypeScript 7 compatibility.
  Do not copy Radix `asChild` patterns into Base UI controls.
- Maintain a component-to-page/demo coverage manifest as the single runtime source
  for Overview, search, and coverage reporting. Do not maintain competing component
  lists in several source files. Requirement counts are the reviewed baseline.
- Some catalogue entries are compositions or newer packaged components. Record their
  official implementation and dependency choices before adding them. If an entry
  cannot run with the existing setup, report the exact compatibility gap; do not
  silently omit it, substitute a generic lookalike, or mark it complete. Resolve such
  gaps before declaring the full showcase complete.
- Install only dependencies required by concrete examples, with exact versions and
  matching lockfile changes. No unsolicited upgrades or replacement starter.
  Load feature pages/heavy chart, code, and editor dependencies on demand where useful.
- Keep code-based routing, typed internal links, route validation, Home/About, existing
  menu behavior, and the `/lab/react/v2/` base. Update affected requirement, code-design,
  setup, and technology documents as pages are implemented.

## Delivery sequence

Deliver the full baseline in reviewable batches. Batches are sequencing, not a
reduction of the 66-component scope. Do not publish empty routes or claim a page
complete before its mapped examples work.

1. **Catalogue and foundations:** reconcile official Base Nova availability; define
   the coverage manifest, page shell, Overview, typed routes, menu group, and source
   display. Complete Actions, Forms, and Selection examples.
2. **Interaction and layout:** complete Dates, Navigation, Overlays, and Layout pages;
   verify preview containment, keyboard behavior, and nested overlays.
3. **Data and content:** complete Data, Feedback, and Messaging/content pages with
   required dependencies, deterministic fixtures, and cleanup.
4. **Completion:** reconcile all 66 entries; check translation, themes, narrow/wide
   layouts, routing, test coverage, documentation, and browser limitations.

Review the [page grouping and samples](README.md) before implementation; the app
remains unchanged during requirement review.

## Acceptance criteria

- [ ] All 66 baseline entries map to implemented, identifiable live examples.
- [ ] Overview search/filter and component links reach the correct page and demo.
- [ ] The shadcn/ui group exposes Overview and all ten completed feature pages.
- [ ] Every scenario has useful interactions and applicable states; reset is isolated.
- [ ] Code previews match the running examples, copy works, and official docs links exist.
- [ ] No credential, live backend, real upload, or real destructive action is required.
- [ ] English/Chinese, Light/Dark, ten accents, keyboard use, reduced motion, and 200% zoom work.
- [ ] Check 320, 375, 768, 1024, and 1440px in a browser, including both sidebar widths.
- [ ] Direct visits, refresh, Back/Forward, hash targets, and production base paths work.
- [ ] Test catalogue completeness/uniqueness, routes/menu, and meaningful interactions,
      validation, resets, async cleanup, and overlay focus. Keep 90% global coverage
      for statements, branches, functions, and lines.
- [ ] `pnpm check`, `pnpm test:coverage`, and `pnpm build` pass after implementation.
- [ ] Code design, setup snapshots, dependencies/licenses, and technology guides are current.

None of these showcase checks has been completed yet. Existing app test results
must not be presented as verification of the proposed showcase.

## Sources and catalogue maintenance

- [Official Components catalogue](https://ui.shadcn.com/docs/components) — reviewed baseline.
- [Base UI Button](https://ui.shadcn.com/docs/components/base/button) — current Base UI documentation path.
- [Base UI Sidebar](https://ui.shadcn.com/docs/components/base/sidebar) — sidebar demo reference.
- [Base UI Chart](https://ui.shadcn.com/docs/components/base/chart) — chart composition reference.
- [Base UI Questionnaire](https://ui.shadcn.com/docs/components/base/questionnaire) — newer catalogue entry.

Before implementation, recheck the catalogue and registry against this snapshot.
Record additions/removals and agree scope changes explicitly; do not change the
completion target silently when upstream publishes more components.
