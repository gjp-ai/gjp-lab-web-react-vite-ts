# Menu: code design

**Updated:** 2026-10-31

**Requirements:** [menu.md](../requirement/menu.md)

## Files and boundaries

| File | Responsibility |
| --- | --- |
| [app-shell.tsx](../../src/app/app-shell.tsx) | Sidebar/drawer composition, local navigation state, focus, Outlet, and footer |
| [menu.json](../../src/features/navigation/config/menu.json) | Shared navigation configuration |
| [menu-schema.ts](../../src/features/navigation/model/menu-schema.ts) | `MenuItem`, `MenuIcon`, `parseMenu`, and `activeGroups` |
| [menu-navigation.tsx](../../src/features/navigation/components/menu-navigation.tsx) | Recursive list, typed links, group buttons, and collapsed tooltips |
| [route-paths.ts](../../src/shared/routing/route-paths.ts) | Shared `routePaths` and inferred `MenuTarget` union |
| [router.tsx](../../src/app/router.tsx) | Code-based route registration and router hosting base |
| [menu-settings.tsx](../../src/app/menu-settings.tsx) | Ordered composition of language, mode, and accent controls |
| [language-toggle.tsx](../../src/shared/i18n/language-toggle.tsx) | Direct English/Chinese toggle using shared i18next |
| [mode-toggle.tsx](../../src/features/appearance/components/mode-toggle.tsx) | Direct Light/Dark toggle using the appearance provider |
| [appearance-settings.tsx](../../src/features/appearance/components/appearance-settings.tsx) | Accent-only dialog and reset |
| [styles.css](../../src/app/styles.css) | Responsive layout, focus, menu states, tooltips, and settings row |

AppShell composes navigation and appearance features. Navigation state stays local
to AppShell; appearance belongs to its provider-owned Zustand store; language
belongs to i18next. Shared modules do not import application or feature modules.

## Configuration and route validation

`MenuItem` is a readonly discriminated union: common ID/label/optional icon plus
either `type: 'link'` with `to: MenuTarget`, or `type: 'group'` with children.
`MenuTarget` derives from `routePaths`, currently `/` and `/about`. Router registration
and the parser share those paths; no generated route tree or unchecked route cast
is needed.

`parseMenu(unknown)` recursively validates objects and non-empty lists, tracks IDs
in one Set across the tree, checks trimmed non-empty strings, and rejects unknown
fields, unsupported icons, and unregistered targets. Top-level icons are required.
Errors include the JSON path and entry ID when available. Supported icon names are
Home, Info, Atom, PanelsTopLeft, FileCode, and Folder.

Vite configuration calls `parseMenu` before serving/building; AppShell also parses
the imported JSON. `activeGroups(items, target)` returns ancestor group IDs for an
exact matching descendant. Invalid/not-found targets yield no active ancestors.

JSON paths exclude the hosting prefix. Typed TanStack Links use `/` and `/about`;
the router adds `basepath: import.meta.env.BASE_URL` under `/lab/react/v2/`.

## AppShell state and events

| State/ref | Role |
| --- | --- |
| `collapsed` | Lazy storage read; only the string `'true'` means collapsed. An effect persists updates under `gjp-lab.sidebar.collapsed`, catching storage failures. |
| `drawerOpen` | Separate boolean, initially false; never persisted. |
| `openGroups` | Readonly Set initialized from active ancestors. User actions update it immutably; route resolution merges in current ancestors. |
| `currentPath` | Derived from router matches; becomes empty on not-found routes. |
| `mainRef`, `desktopRef`, control refs | Focus destinations and responsive visibility checks. |
| `closeDestination` | Distinguishes return to the mobile trigger, main content, or desktop toggle. |

`onGroup` toggles a group. When the desktop sidebar is collapsed, it first expands
and ensures that group is open. `onNavigate` handles selecting the current page,
which may not emit a route resolution event.

The router `onResolved` subscription opens current ancestors and closes the drawer.
It focuses main only when a previous location exists and the pathname changes,
preventing a page-sized focus ring on initial load. Modified/new-tab clicks bypass
same-tab navigation handling in the recursive renderer.

The 1024px media-query listener closes the drawer on desktop entry. A `focusin`
listener remembers focus and transfers it when a desktop/mobile control disappears.
Both listeners and the router subscription clean up on unmount.

## Rendering and focus

`MenuNavigation` renders labeled navigation through recursive `MenuList`/`MenuEntry`.
Links use exact active matching, `aria-current="page"`, and `menu-current`. Groups
use the owned Button, ancestor styling, a chevron, and `aria-expanded`/`aria-controls`.
`useId` connects each group to its child container, which stays mounted but hidden
when closed or collapsed.

Collapsed entries retain screen-reader labels and Base UI tooltips portaled outside
the scroll container. The header's collapse/expand control is always icon-only,
with its own label, tooltip, and expanded/control attributes. Expanded headers place
it beside the brand; collapsed headers stack it below the brand icon.

Base UI Dialog owns the mobile backdrop, focus containment, dismissal, and scroll
locking. Initial focus goes to Close navigation. Final focus uses `closeDestination`
to return to the opener, main content after navigation, or the desktop toggle after
resizing. The separate accent dialog may nest inside the drawer without closing it.

## Bottom control composition

`MenuSettings` renders three native Buttons in this order:

| Component | Implementation |
| --- | --- |
| LanguageToggle | Reads `i18n.resolvedLanguage`, displays CaseUpper for English or Languages for Chinese, and calls `changeLanguage` with the opposite locale. Uses translated button names, next-action titles/tooltips, and its own `lang` attribute. No select, popup, or duplicate language state. |
| ModeToggle | Reads `appearance.mode`; displays Sun or Moon and calls `update` with the opposite explicit mode while preserving accent. The stable accessible name is “Dark mode”; `aria-pressed` reflects Dark. No mode dialog or System option. |
| AppearanceSettings | Opens the accent-only dialog through Base UI render composition. Selecting/resetting an accent preserves mode; reset restores Mint. The Palette icon uses the current primary color. |

Language is session-only. Mode/accent persist through the appearance provider;
legacy saved System values parse as Light while preserving a valid accent. See
[appearance code design](theme.md) for startup, migration, storage, and focus return.
Home subscribes to the language; the control is not rendered inside Home.

## CSS and extension points

At viewport widths of 1024px or more, `.app-layout` reserves 240px for the sticky
sidebar, or 64px under `.sidebar-collapsed`. `.sidebar-scroll` handles long menus;
`.sidebar-settings` uses `margin-top: auto`. Below the breakpoint, the desktop
sidebar is hidden and the mobile header/drawer are used.

`.menu-settings` is a horizontal flex row with 44px controls in the expanded sidebar
and drawer; the collapsed rail switches to a column. The drawer is a flex column
and pushes `.drawer-settings` to its bottom. Semantic theme tokens provide surfaces,
active states, hover, and focus. Reduced-motion rules disable menu transitions.

To add a page, implement/register its route and shared path, then add a JSON link.
To add a group, wrap real links in a non-empty group with a globally unique ID.
To add an icon, update both the schema's `iconNames` and the renderer's named Lucide
mapping. Menu changes require a deployment rebuild. Footer controls are application
composition and do not belong in navigation JSON.

## Verification

[Schema tests](../../src/features/navigation/__tests__/menu.test.js),
[renderer tests](../../src/features/navigation/__tests__/menu-navigation.test.tsx), and
[application tests](../../src/app/__tests__/application.test.tsx) cover validation,
groups, active links, collapse persistence, route focus, responsive transitions,
footer order, direct toggles, changing icons, and nested accent settings.

Run `pnpm check`, `pnpm test:coverage`, and `pnpm build` for code changes. This
documentation update changes no runtime behavior. Local links and source names
were checked against the implementation. Browser layout, real keyboard behavior,
and production-host checks remain pending; see the [requirements checklist](../requirement/menu.md).
