# Home: Compact layers code design

Requirements: [home.md](../requirement/home.md). The implementation follows the
user-selected Option 3 preview: six compact cards with tinted category panels
and technology tiles.
The Build layer uses the subsequently selected Option B — Build engine design.

## 1. Files and ownership

| Source | Responsibility |
| --- | --- |
| [home-page.tsx](../../src/features/home/home-page.tsx) | Local technology data, `Technology` renderer, and semantic layer markup |
| [technology-versions.ts](../../build/technology-versions.ts) | Build-time dependency metadata and actual Node.js/pnpm versions |
| [technologies.ts](../../src/features/home/technologies.ts) | Official names, external destinations, published logo URLs, and emoji marks |
| [styles.css](../../src/app/styles.css) | The `Home: Option 3, compact layers` block: row grids, build flow, and container queries |
| [app-shell.tsx](../../src/app/app-shell.tsx) | Sidebar, main landmark, Outlet, appearance controls, and footer |
| [router.tsx](../../src/app/router.tsx) | Existing Home route; no routing changes |
| [package.json](../../package.json) | Exact pinned versions displayed in the diagram |

HomePage uses `useTranslation` for its bundled Home namespace. Language selection
belongs to the shared sidebar/mobile drawer, not the Home header. MenuSettings
composes direct LanguageToggle and ModeToggle buttons plus the accent dialog.
Language changes update Home through i18next; appearance updates semantic CSS
tokens. Neither direct toggle opens a popup. See [menu code design](menu.md).
Home owns no server data or appearance state. Client preferences, query cache,
and navigation remain owned by their providers.

## 2. Data and component boundaries

`technologies.ts` is the local catalogue keyed by `TechnologyId`. Each entry owns
its name, HTTPS destination, and either a published official `logo` URL or the
project's `emoji` mark. [Logo provenance](../licenses/technology-logos.md) records
the official sources. No new package or copied image asset is needed.

`applicationStack`, `interfaceStack`, and `workspace` reference catalogue IDs;
versions are not repeated in the lists. `Technology` renders a list item containing
a full-tile
external anchor. It accepts a catalogue ID, optional display-name override (React
State) and translated role. The version comes from the catalogue. Names,
version/source labels, and descriptions remain visible independently
of the logo. Every tile always renders `.stack-version` and
`.stack-technology-description`; an explicit role overrides the default bundled
`technologyDescriptions.<id>` translation. Both languages supply a description
for every catalogue entry.

`BrandIcon` renders a decorative image with empty alt text, fixed dimensions,
`object-fit: contain`, asynchronous decoding, and no-referrer policy. Local React
state changes failed images to name initials. Official emoji entries render without
an image request. A white 48px surface keeps black brand marks visible in dark mode
without recoloring them. Logo loading does not block navigation.

All technology anchors use `target="_blank"` and `rel="noopener noreferrer"`.
Translated screen-reader text announces the new tab. Vite's main link and its Oxc /
Rolldown links are siblings, avoiding nested anchors. Static assets remain a label.

The build sequence uses explicit markup because source, engine, and output have
different roles. Oxc and Rolldown are nested inside the Vite element. Versions
come from exact pins in package.json. The Node-only
`build/technology-versions.ts` exports public dependency versions plus
`process.versions.node`, the output of `pnpm --version`, and the installed
Rolldown version resolved from Vite’s own dependency tree with `createRequire`. Vite replaces
`__TECH_VERSIONS__` with this metadata; Jest supplies the same data through its
`globals` configuration. No Node APIs or environment object enter browser code.

The Node.js and pnpm labels describe the development/build environment, not the
visitor's runtime or project minimums. Restart Vite or rebuild to refresh them.
shadcn/ui displays “Local source”, since the owned components have no installed
package release. React State shares React's version. Oxc is bundled into Rolldown,
so its panel shows “Bundled” and “Source transformation”; the full
“Bundled with Rolldown <version>” detail remains in its native title and accessible text
instead of inventing an independent version. Rolldown shows its exact installed
version and “Asset bundling”. Static assets show web-standard/output labels.
Jest appears once, with the
combined translated role “Unit testing & code coverage”.

## 3. DOM structure

```text
HomePage
└── section.stack-home [aria-labelledby=stack-home-title]
    ├── header.stack-home-heading
    │   ├── eyebrow
    │   ├── h1#stack-home-title
    │   └── short introduction
    └── figure.stack-layers [aria-labelledby=stack-caption]
        ├── figcaption.sr-only
        ├── section.stack-layer: Application
        │   ├── numbered h2
        │   └── ul.stack-application → Technology[]
        ├── section.stack-layer: Interface
        │   ├── numbered h2
        │   └── ul.stack-interface → Technology[]
        ├── section.stack-layer: State & data → ul.stack-data → Technology[]
        ├── section.stack-layer: Build
        │   ├── numbered h2
        │   └── ol.stack-build
        │       ├── TypeScript source
        │       ├── arrow + div.stack-vite → Vite / Oxc → Rolldown
        │       └── arrow + static assets
        ├── section.stack-layer: Workspace
        │   ├── numbered h2
        │   └── ul.stack-workspace → Technology[]
        └── section.stack-layer: Testing → ul.stack-testing
```

Section IDs connect each `aria-labelledby` to its heading. The caption explains
relationships without introducing visible prose. Technology lists and the ordered
build list retain a logical reading order without CSS. Decorative icons, arrows,
and section numbers use `aria-hidden`. Technology links participate in the natural
keyboard tab order.

## 4. Layout rules

`.content-column:has(.stack-home)` uses a maximum width of 1600px with 24px
side gutters, reduced to 16px below a 600px viewport. The header starts 24px below
the shell top (20px on phones). The footer gap is 20px.

`.stack-layers` is a grid with a 10px gap and an inline-size query container.
Each `.stack-layer` has a soft border, 12px radius, and a 200px category track.
The label panel mixes 6% primary with card color; its numbers are 30px and its
labels 19px. Technology surfaces mix 3% foreground with card color. Each tile
has 12px padding, a 36px official image inside a 48px surface, a 19px name,
and a 13px version/source label. Each tile also has a separate muted 13px
description line. Tiles are native anchors inside list items; hover uses a soft accent tint and
`:focus-visible` adds an inset theme-colored outline.

| Available diagram width | Result |
| --- | --- |
| Above 1050px | 200px category panel; data grid has three columns and testing has three |
| 1050px or below | Category panel becomes 170px; data/testing use two columns |
| 850px or below | Build stages stack vertically; incoming arrows point down |
| 650px or below | Category panel moves above content; numbers reduce to 24px |
| 400px or below | Technology lists and Vite’s internal tool panels become one column |

Application uses two columns capped at 260px. Interface/workspace use auto-fitting
columns with a 190px minimum capped to the available width. All content tracks
use `minmax(0, 1fr)` where needed, and labels permit wrapping.

`.stack-build` implements Option B as a three-column ordered-list grid using
`1fr 1.8fr 1.2fr`, all with zero minimum tracks. TypeScript and the output card
stretch to match the wider Vite engine card. The latter two list items own their
incoming arrow in an `18px minmax(0, 1fr)` grid. Source content is centered on desktop.

Vite's logo, name, exact version, and translated “Build engine” description form a
header link. `.stack-vite-tools` places two independent `.stack-build-tool` links
around an arrow. Oxc displays a short “Bundled” status; its full version provenance
is available through the native title and screen-reader text. Rolldown displays its
exact installed version. Both panels include their transformation/bundling roles.
Links use soft hover surfaces and visible keyboard focus, with no permanent underlines.
The output card contains an accessible list of HTML, CSS, and JS text badges.

At 850px or below, stages become a single column, source content uses a horizontal
layout, and incoming arrows rotate down. At 400px or below, internal tool panels
also stack and their arrow rotates down. All layouts derive from container width,
without measured connector coordinates.

## 5. Styling and theme integration

Text uses `--foreground` and `--muted-foreground`; section numbers use
`--primary`. Brand icons retain their original colors and diagram arrows use
`--muted-foreground`. The category-panel tint mixes primary with card color. Card outlines use the soft
`--border` token directly; tile surfaces derive from foreground/card tokens. AppearanceProvider's document-root
attributes update these variables without remounting the page.

Home selectors are scoped by `stack-*` classes. About, navigation, and the shared
footer continue using their existing styles. Technology entries use native links rather than JavaScript click handlers. Brand
colors are preserved; diagram arrows continue using Lucide.

## 6. Extension and debugging

| Change or symptom | Code to inspect |
| --- | --- |
| Add a technology | Add official metadata to the catalogue, then reference its ID in a local list |
| Change build stages | Update the ordered-list markup and figure caption together |
| Update versions | Update package.json and lockfile; restart Vite/rebuild; refresh setup snapshots |
| Labels crowd content | Check the 200px/170px label tracks and 650px container query |
| Build overflows | Check the three-column grid and the 850px/400px container rules |
| Incorrect accent | Inspect root theme attributes and semantic variables before adding local colors |
| Sidebar affects wrapping | Inspect `.stack-layers` container width; do not substitute the menu's viewport breakpoint |

## 7. Validation

```sh
pnpm check
pnpm test:coverage
pnpm build
```

The [application suite](../../src/app/__tests__/application.test.tsx) verifies
Home's six section headings, navigation, route history, not-found recovery,
appearance controls, initial-load focus, official link destinations, safe new-tab
attributes, failed-logo fallback, full version labels, the single Jest tile, and nonempty version/source labels
and descriptions in both languages. The full Jest run also covers models,
providers, navigation, startup, and shared UI. See the
[verification summary](../README.md#verification) for current automated results.

Browser verification of this revision remains pending because access was previously
blocked by browser security policy. Remaining checks are narrow/wide layout,
sidebar expansion, light/dark accents, keyboard use, zoom, and screen-reader output.

See [Testing code design](testing.md) for runner configuration and coverage scope.

See [Stack integration](stack.md) for the installed packages and provider composition.
