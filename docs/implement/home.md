# Home: Layered stack code design

Requirements: [home.md](../requirement/home.md). The implementation follows the
user-selected Layered stack preview: one column of six numbered sections.

## 1. Files and ownership

| Source | Responsibility |
| --- | --- |
| [home-page.tsx](../../src/features/home/home-page.tsx) | Local technology data, `Technology` renderer, and semantic layer markup |
| [styles.css](../../src/app/styles.css) | The `Home: the Layered stack design` block: row grids, build flow, and container queries |
| [app-shell.tsx](../../src/app/app-shell.tsx) | Sidebar, main landmark, Outlet, appearance controls, and footer |
| [router.tsx](../../src/app/router.tsx) | Existing Home route; no routing changes |
| [package.json](../../package.json) | Dependency versions used to review the diagram's major-version labels |

HomePage uses `useTranslation` for its bundled Home namespace and a native
language selector. It owns no server data or appearance state. Theme, client
preferences, query cache, and navigation remain owned by their providers.

## 2. Data and component boundaries

`applicationStack`, `interfaceStack`, and `workspace` are local readonly tuples.
Each entry contains a `name`, a named Lucide `icon` component, and optionally a
`version`. Names provide stable list keys. The arrays are rendered only on Home,
so there is no additional data module or duplicated configuration.

`Technology` receives readonly `name: string`, `version?: string`, and
`icon: LucideIcon` props. It renders one `li.stack-technology`, hides the decorative
icon from screen readers, and emits a version label only when supplied. The helper
is shared by the application, interface, and workspace lists.

The build sequence uses explicit markup because source, engine, and output have
different roles. Oxc and Rolldown are nested inside the Vite element. Versions are
curated major-version labels; review them against package.json when upgrading.

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
        ├── section.stack-layer: State & data → role/tool lists
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
and section numbers use `aria-hidden`. No diagram node enters the tab order.

## 4. Layout rules

`.content-column:has(.stack-home)` expands only Home to a maximum of 1440px,
with 32px side gutters (16px below a 600px viewport). `.stack-home` fills that
column instead of adding another centered width cap. `.stack-layers` declares `container-type: inline-size`, so responsive
rules use the actual diagram width after sidebar space has been reserved.

| Available diagram width | Result |
| --- | --- |
| Above 650px | `.stack-layer` uses `160px minmax(0, 1fr)` for label/content columns with a 28px gap |
| 650px or below | Each layer becomes one column, placing its label above its content |
| 400px or below | Interface becomes one column; build entries stack vertically and flow arrows rotate downward |

Layers use 20px vertical padding (18px below the 650px container breakpoint).
Technology names are 18px, application names 22px (20px on narrow screens), layer
labels 16px, and version labels 13px. Home starts 32px below the shell top (24px
on phones), and its footer gap is 24px. The interface grid caps each column at
260px so the two columns stay grouped rather than spreading across a wide page.
All layers share soft top separators. There is no outer card and
no individual technology card. `.stack-application` is a wrapping flex list with a
soft accent tint; `.stack-interface` uses a two-column grid; `.stack-workspace` wraps
its entries in a flex row. `.stack-testing` wraps three role/tool pairs with
14px muted role labels and the shared 18px technology styling. Its entries are
explicit markup because Jest serves two distinct roles: unit tests and coverage.

`.stack-build` is a wrapping flex sequence of three ordered-list entries. An entry
owns its incoming arrow so a wrapped engine/output stays with its connector.
`.stack-vite` alone has a compact border and background. At narrow widths, the
engine/output entries stretch and their arrows center above the following content.
No absolute-positioned connector coordinates or viewport measurement are needed.

## 5. Styling and theme integration

Text uses `--foreground` and `--muted-foreground`; icons and section numbers use
`--primary`. The application tint mixes primary with card color. Separators and the
Vite outline use the soft `--border` token directly. AppearanceProvider's document-root
attributes update these variables without remounting the page.

Home selectors are scoped by `stack-*` classes. About, navigation, and the shared
footer continue using their existing styles. Technology entries have no hover
animation, pointer cursor, action role, or click handler.

## 6. Extension and debugging

| Change or symptom | Code to inspect |
| --- | --- |
| Add a technology | Add an entry to the relevant local tuple; import its Lucide icon by name |
| Change build stages | Update the ordered-list markup and figure caption together |
| Update versions | Update home-page.tsx labels and review package.json; refresh setup snapshots |
| Labels crowd content | Check the 160px label track and 650px container query |
| Build overflows | Check wrapping, nested entry alignment, and the 400px vertical-flow rules |
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
appearance controls, and initial-load focus. The full Jest run also covers models,
providers, navigation, startup, and shared UI. See the
[verification summary](../README.md#verification) for current automated results.

Browser verification of this revision remains pending because access was previously
blocked by browser security policy. Remaining checks are narrow/wide layout,
sidebar expansion, light/dark accents, keyboard use, zoom, and screen-reader output.

See [Testing code design](testing.md) for runner configuration and coverage scope.

See [Stack integration](stack.md) for the installed packages and provider composition.
