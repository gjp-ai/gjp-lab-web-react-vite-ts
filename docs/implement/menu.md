# Menu: code design

Source guide for the current implementation. Product behavior is defined in
[menu requirements](../requirement/menu.md). Appearance integration is described in
[theme implementation](theme.md).

## 1. Modules and dependency flow

```text
route-paths.ts ────────────────→ router.tsx (route registration)
      ↓
menu.json → menu-schema.ts → vite.config.ts (startup/build validation)
                 ↓
             app-shell.tsx (state and router subscriptions)
                 ↓
         menu-navigation.tsx (recursive rendering)
                 ↓
       TanStack Link / owned Button / Base UI Tooltip
```

| Source | Main exports or symbols |
| --- | --- |
| [route-paths.ts](../../src/shared/routing/route-paths.ts) | `routePaths`, `MenuTarget` |
| [menu.json](../../src/features/navigation/config/menu.json) | The raw `items` tree; currently Home and About |
| [menu-schema.ts](../../src/features/navigation/model/menu-schema.ts) | `iconNames`, `MenuIcon`, `MenuItem`, `parseMenu`, `activeGroups` |
| [app-shell.tsx](../../src/app/app-shell.tsx) | `AppShell`; owns menu state, persistence, router events, and focus refs |
| [menu-navigation.tsx](../../src/features/navigation/components/menu-navigation.tsx) | `MenuNavigation`; private `MenuList`, `MenuEntry`, and `icons` registry |
| [router.tsx](../../src/app/router.tsx) | Code-based route tree and typed router registration |
| [styles.css](../../src/app/styles.css) | Layout, visibility, nesting, active states, and tooltip/drawer presentation |

## 2. Data model and route types

`routePaths` is declared with `as const`. `MenuTarget` is the union of its values,
currently `'/' | '/about'`. Both route registration and validation use these constants.
JSON labels and order remain separate from route registration.

The following is an excerpt from `menu-schema.ts`, not a standalone module:

```ts
type Common = { readonly id: string; readonly label: string; readonly icon?: MenuIcon };
export type MenuItem = Common &
  (
    | { readonly type: 'link'; readonly to: MenuTarget }
    | { readonly type: 'group'; readonly children: readonly MenuItem[] }
  );
```

The `type` discriminant lets rendering narrow to `to` or `children` without casts.
The parser enforces stricter runtime rules than this type: top-level icons are
required, groups are non-empty, and link/group-only fields cannot be mixed.
All IDs must be unique across the tree because IDs are React keys and group-state keys.

`MenuIcon` comes from `iconNames`. The renderer's `icons` object uses
`satisfies Record<MenuIcon, typeof Home>`, so adding a supported icon requires
updating its named Lucide import and registry entry. There are no dynamic icon imports.

## 3. Runtime validation: `parseMenu`

Signature: `parseMenu(value: unknown): readonly MenuItem[]`.

Each invocation creates a fresh `Set<string>` for duplicate detection. Its private
`items(value, path, top)` function recursively validates and constructs entries:

1. Require a non-empty array and object entries.
2. Check non-empty IDs/labels and reject duplicate IDs.
3. Check icon names; `top` controls whether an icon is mandatory.
4. Reject fields outside the allowed keys for the selected entry type.
5. For a link, narrow `to` through `isTarget`, which compares against `routePaths`.
6. For a group, recursively parse `children` with `top = false`.

`record`, `isIcon`, and `isTarget` are type guards. Validated objects are constructed
from accepted fields instead of asserting the input type. `fail(path, message)`
throws an error containing the JSON location and, when available, the entry ID.

[vite.config.ts](../../vite.config.ts) calls `parseMenu(menuConfig)` while loading
configuration. AppShell also parses the JSON once at module scope. Invalid JSON
structure therefore stops Vite startup/build and cannot silently render bad links.
The parser checks allowed path constants; TypeScript checks their compatibility
with the registered TanStack routes when compiling the renderer's `Link`.

The explicit `.ts` import in the validator supports execution from Vite and Jest's
test transform. [tsconfig.json](../../tsconfig.json) permits those extensions with
`allowImportingTsExtensions` and `noEmit`.

## 4. Active group calculation

Signature: `activeGroups(items: readonly MenuItem[], target: string): string[]`.

For each group, recursively collect matching descendant groups. Include the current
group when a direct child link matches `target` or any descendant group matched.
Links return no group IDs. The result contains the entire ancestor chain and is
independent of the user's current expansion choices.

AppShell reads the last matched `routeId` using `useRouterState`. A match with
`status === 'notFound'` yields an empty target. With the current root-child route
structure, route IDs match the menu's path strings. If pathless layouts, dynamic
parameters, or a different route structure are added, revisit this target mapping
rather than assuming every route ID is a navigable pathname.

## 5. State ownership in `AppShell`

| Symbol | Type / initialization | Writes and consumers |
| --- | --- | --- |
| `collapsed` | Boolean; lazy `readCollapsed` initializer | Toggle button and `onGroup`; controls grid width and renderer props |
| `drawerOpen` | Boolean; initially false | Dialog callbacks, router resolution, same-page selection, resize |
| `openGroups` | `ReadonlySet<string>` initialized from active ancestors | `onGroup` and router resolution; shared by both navigation instances |
| `currentPath` | Router-selected target | `activeGroups` calculation and same-page detection |
| `active` | Derived group-ID array | Ancestor styling; not duplicated in React state |
| `closeDestination` | Ref: `'trigger' | 'content' | 'desktop'` | Dialog `finalFocus`; avoids a render just to choose a focus target |

`readCollapsed` accepts only the stored string `'true'`. An effect writes the
boolean as a string under `gjp-lab.sidebar.collapsed`; read/write failures are caught.
Group expansion and drawer visibility stay in memory. Theme preferences are handled
by the separate AppearanceProvider.

`onGroup(id)` copies the previous Set before adding/deleting an ID. If the desktop
sidebar is collapsed, it first expands the sidebar and ensures the selected group
is open. The rendered button stays mounted so it retains keyboard focus.

## 6. Event and focus control flow

| Event | Code path |
| --- | --- |
| Ordinary page-link click | `MenuEntry` filters modified/non-left/prevented clicks, then calls `onNavigate(item.to)` |
| Same-page selection | `onNavigate` sets the destination to content and closes the drawer directly |
| Different-page navigation | `onNavigate` returns; the router's `onResolved` subscription handles completion |
| Initial route resolution | Merge active ancestors and close the drawer; leave focus where it is |
| Navigation / Back / Forward | Merge active ancestors, close drawer, and focus `mainRef` only when there is a previous location and the pathname changes |
| Dialog open/close callback | Set destination to trigger and update `drawerOpen` |
| Resize to desktop | Set destination to desktop, close drawer, and transfer focus if the mobile trigger was focused |
| Resize to mobile | If focus belonged to desktop navigation, focus the mobile trigger |

The initial page load does not focus the main landmark. This avoids stealing focus
and showing the accent-colored `:focus-visible` outline around the whole page.
Actual page changes retain the main focus handoff for keyboard navigation.

The media-query effect uses `(min-width: 1024px)`. It remembers the last focused
element through `focusin`, because hiding an element may clear `document.activeElement`
before the media-query callback runs. Cleanup removes both listeners. The router
effect returns its unsubscribe function.

`mainRef`, `desktopRef`, `toggleRef`, `mobileRef`, and `closeRef` identify focus targets.
Dialog `initialFocus` uses `closeRef`; `finalFocus` selects a ref from
`closeDestination`. Base UI owns modal containment, dismissal, and scroll locking.

## 7. Recursive component rendering

`MenuNavigation` adds the labeled navigation landmark. `MenuList` maps entries to
`MenuEntry` using `item.id` as the key. `MenuEntry` renders either:

- A typed `Link` with exact active matching, `menu-current`, and `aria-current="page"`.
- An owned Button with `aria-expanded`, `aria-controls`, a chevron, and `onGroup`.

Each group gets a unique panel ID from `useId`. Its child `MenuList` is inside a
`div` hidden when the group is closed or the sidebar is collapsed. Keeping that
subtree mounted preserves element identity while removing hidden controls from
keyboard navigation.

Tooltip's `render` prop composes with the existing Link/Button. Tooltips are enabled
only when collapsed and portal outside the scrolling sidebar. Do not replace this
composition with a Radix `asChild` pattern.

Desktop and mobile render separate instances from the same parsed tree and shared
state. CSS hides desktop navigation below 1024px; the drawer uses a Base UI portal.
The `Outlet` remains in one main content container, so changing menu state does not
replace the active page component. Menu styles consume the shared appearance tokens.

## 8. Extension and debugging map

| Change or symptom | Code to inspect/change |
| --- | --- |
| Add a page | Create its component, add `routePaths`, register in `router.tsx`, then add the JSON link |
| Add a nested group | Add a group with unique ID and non-empty `children` in JSON |
| Add an icon | Update `iconNames` and the renderer's `icons` mapping |
| Invalid-menu startup error | Read the reported JSON location/ID; inspect `parseMenu` guards |
| Wrong active parent | Check target-to-route-ID mapping and `activeGroups` |
| Drawer closes at the wrong time | Check click filtering, `onNavigate`, and `onResolved` |
| Focus lost after resize | Check remembered focus, media-query callback, and Dialog focus refs |
| Change breakpoint or widths | Update CSS and the AppShell media query together |

## 9. Tests and verification boundaries

[menu.test.js](../../src/features/navigation/__tests__/menu.test.js) contains eight Jest tests in the Node environment covering the
shipped JSON, recursive active groups, duplicate IDs, bad routes/icons/labels,
empty/mixed groups, child icon rules, and invalid root/item shapes.

```sh
pnpm test src/features/navigation/__tests__/menu.test.js
pnpm check
pnpm build
```

The model suite covers configuration logic. The recursive navigation suite adds
group expansion, active links, collapsed access, and modified-click checks. The
application suite exercises routes/history, drawer actions, resize focus transfer,
and the initial-load focus regression in jsdom.

Real-browser verification is still required for physical layout, complete keyboard
behavior, zoom, responsive visibility, scroll locking, and assistive technology.
See the [menu checklist](../requirement/menu.md) and
[verification summary](../README.md#verification).
