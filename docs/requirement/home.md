# Home page requirements

**Status:** Implemented; browser verification of this revision is pending.
**Design:** Layered stack, selected by the user.
**Updated:** 2026-10-30

## 1. Purpose

Present GJP Lab's architecture as six compact horizontal layers. Make the technology
names and relationships easy to scan, with minimal text and no oversized logo panels.

## 2. Content and order

| Layer | Required content |
| --- | --- |
| 01 Application | React 19 and TanStack Router 1 |
| 02 Interface | shadcn/ui, Base UI 1, Tailwind CSS 4, and Lucide React 1 |
| 03 State & data | React State + Zustand 5; TanStack Query 5; Ky 2; i18next 26 + react-i18next 17 |
| 04 Build | TypeScript 7 → Vite 8 (Oxc → Rolldown) → static HTML/CSS/JS assets |
| 05 Workspace | Node.js 24+, pnpm 12+, Biome 2, Husky 9, and lint-staged 17 |
| 06 Testing | Unit testing: Jest 30; component testing: React Testing Library 16; code coverage: Jest; API mocking: MSW 3 |

Node.js is a development runtime, not a backend. Oxc and Rolldown are integrated
Vite tooling. Do not add fake status indicators, statistics, or a counter.

## 3. Layout and appearance

- **H01 — Header:** Use “The stack, at a glance.” with the small GJP Lab eyebrow
  and “One architecture. Six clear layers.” as the only introductory sentence.
- **H02 — Layer structure:** Align numbered section labels on the left and
  technology content on the right. Separate layers with subtle horizontal rules.
- **H03 — Application:** Show React and Router side by side when space permits,
  inside a single softly tinted band. Use modest icons and small version labels.
- **H04 — Interface/workspace:** Show interface technologies in two columns and
  workspace tools in a wrapping row. Show testing tools in a wrapping row with short role labels. Keep entries free of individual card framing.
- **H05 — Build:** Show source → Vite → assets in order. Give only the Vite group
  a compact outline; show Oxc → Rolldown inside it. Arrows indicate build order.
- **H06 — Themes:** Use semantic theme tokens and support light/dark modes and
  all ten accents. Provide a labeled English/Chinese Home selector; switching
  language must not reset appearance or navigate. Avoid decorative gradients, large halos, and extra badges.

## 4. Responsive layout and accessibility

- **H07 — Available width:** Adapt to the content width left by the sidebar.
  Move labels above their content when the diagram becomes narrow. At the smallest
  widths, use single-column interface entries and a vertical build sequence.
- **H08 — Readability:** Fit 320px without horizontal scrolling. Keep visible
  labels readable and let technology rows wrap instead of clipping text. Use 18px
  technology names, 16px layer labels, and 13px versions. Reduce excess row/header
  padding and use the available content width with modest side gutters.
- **H09 — Semantics:** Provide one page heading, six labeled sections, technology
  lists, an ordered build sequence, and a screen-reader diagram description.
  Hide decorative icons, arrows, and section numbers from assistive technology.
- **H10 — Existing behavior:** Preserve navigation, appearance controls, visible
  keyboard focus, and the hosting base. Static technology entries are not controls.

## 5. Implementation boundaries

Use React and CSS with named Lucide icons. The diagram needs no diagram renderer,
page state, storage, or network request. Test tooling is a development dependency;
see [Testing code design](../implement/testing.md). See [Home code design](../implement/home.md).

## 6. Acceptance checks

- [x] Content matches the application, interface, state/data, build, workspace, and testing layers.
- [x] `pnpm check` and `pnpm build` pass.
- [ ] Check 320, 375, 768, 1024, and 1440px, including both sidebar widths.
- [ ] Check light/dark modes, accent changes, wrapping, and 200% zoom.
- [ ] Check list semantics, figure description, and keyboard navigation in a browser.

Browser checks from previous Home revisions do not verify the selected Layered stack revision.
