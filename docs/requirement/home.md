# Home page requirements

**Status:** Implemented; browser verification of this revision is pending.
**Design:** Option 3 — Compact layers, selected by the user.
**Updated:** 2026-10-31

## 1. Purpose

Present GJP Lab's architecture as six compact horizontal layers. Make the technology
names and relationships easy to scan, with minimal text and no oversized logo panels.

## 2. Content and order

| Layer | Required content |
| --- | --- |
| 01 Application | React and TanStack Router |
| 02 Interface | shadcn/ui, Base UI, Tailwind CSS, and Lucide React |
| 03 State & data | React State + Zustand; TanStack Query; Ky; i18next + react-i18next |
| 04 Build | TypeScript → Vite (Oxc → Rolldown) → static HTML/CSS/JS assets |
| 05 Workspace | Node.js, pnpm, Biome, Husky, and lint-staged |
| 06 Testing | Jest (unit testing & code coverage) in one tile; React Testing Library; MSW |

Display full pinned dependency versions from package.json. Node.js and pnpm show
the actual development/build tool versions; project minimums remain Node 24+ and
pnpm 12+. Label shadcn/ui “Local source”; React State shares React’s version. Show the
installed Rolldown version and identify Oxc as bundled with that version, since
it has no independently installed package. Describe static assets as web standards,
rather than assigning a package version to HTML/CSS/JS output.

Node.js is a development runtime, not a backend. Oxc and Rolldown are integrated
Vite tooling. Do not add fake status indicators, statistics, or a counter.

## 3. Layout and appearance

- **H01 — Header:** Use “The stack, at a glance.” with the small GJP Lab eyebrow
  and “One architecture. Six clear layers.” as the only introductory sentence.
- **H02 — Layer structure:** Use six closely spaced, softly outlined cards. Each
  card has a tinted left panel with a prominent number and bold category label.
- **H03 — Technology tiles:** Use subtle surface tiles with official brand icons,
  readable names, a version/source label below the name, and a short description
  on a separate line. No tile may have an empty metadata or description line.
  Application tools sit side by side.
- **H04 — Interface/data/workspace/testing:** Use compact grids that wrap to the
  available width. Keep short role labels inside data/testing tiles; combine
  Jest unit testing and coverage in one tile, keeping the other testing tools separate.
- **H05 — Build:** Use selected Option B — Build engine. Align TypeScript, a wider
  Vite card, and static assets at equal heights. Vite contains a linked header and
  two compact linked panels for Oxc → Rolldown. Keep descriptions and versions;
  abbreviate Oxc’s status to “Bundled” with full provenance in its title/accessibility
  text. Show HTML/CSS/JS output badges and avoid permanent link underlines.
  Stack stages below 850px diagram width and internal panels below 400px.
- **H06 — Themes:** Use semantic theme tokens and support light/dark modes and
  all ten accents. Language and Light/Dark toggles belong to the sidebar/mobile
  menu footer, not Home. Both act immediately without a popup and preserve route
  and other preferences. Only the accent control opens a dialog. System mode is
  removed; Light is the default. See [menu requirements](menu.md). Avoid decorative
  gradients and large halos.

## 4. Responsive layout and accessibility

- **H07 — Available width:** Adapt to the content width left by the sidebar.
  Move labels above their content when the diagram becomes narrow. At the smallest
  widths, use single-column technology tiles and a vertical build sequence.
- **H08 — Readability:** Fit 320px without horizontal scrolling. Keep visible
  labels readable and let technology rows wrap instead of clipping text. Use 19px
  technology names, 18–19px layer labels, 24–30px section numbers, and 13px versions.
  Reduce excess row/header padding and use the available content width with modest side gutters.
- **H09 — Semantics:** Provide one page heading, six labeled sections, technology
  lists, an ordered build sequence, and a screen-reader diagram description.
  Hide decorative icons, arrows, and section numbers from assistive technology.
- **H10 — Existing behavior:** Preserve navigation, appearance controls, visible
  keyboard focus, and the hosting base. Each technology tile links to its official
  website in a new tab, with visible
  keyboard focus and an accessible new-tab announcement. Keep the build output
  label noninteractive; provide separate Oxc/Rolldown links within Vite.

## 5. Implementation boundaries

Use React and CSS with official image URLs or the project’s published emoji mark.
Preserve brand colors, proportions, and readability in both themes; retain a visible
name and working link if an image cannot load. Use Lucide for interface controls
and diagram arrows. See [logo sources](../licenses/technology-logos.md). The diagram needs no diagram renderer,
storage, or API request. Logo images load from external hosts; local image-error
state is allowed. Test tooling is a development dependency;
see [Testing code design](../implement/testing.md). See [Home code design](../implement/home.md).

## 6. Acceptance checks

- [x] Content matches the application, interface, state/data, build, workspace, and testing layers.
- [x] `pnpm check` and `pnpm build` pass.
- [ ] Check 320, 375, 768, 1024, and 1440px, including both sidebar widths.
- [ ] Check light/dark modes, accent changes, wrapping, and 200% zoom.
- [ ] Check list semantics, figure description, and keyboard navigation in a browser.

Browser checks from previous Home revisions do not verify the selected Compact layers revision.
