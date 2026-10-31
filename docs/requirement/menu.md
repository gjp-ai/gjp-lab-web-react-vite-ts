# Menu requirements

**Status:** Implemented; browser verification remains pending.

**Updated:** 2026-10-31

**Code design:** [menu.md](../implement/menu.md)

## Purpose and scope

Provide shared navigation for GJP Lab's React, UI library, and TypeScript examples.
Ship Home and About now; add nested feature groups only when their pages exist.
The [proposed shadcn/ui showcase](shadcn-ui/README.md) defines the next menu group and
its planned pages; these routes are not implemented yet.
Search, permissions, backend navigation, and placeholder pages are outside scope.

## Layout and navigation

| ID | Requirement |
| --- | --- |
| M01 | At viewport widths of 1024px or more, use a 240px sidebar that collapses to a 64px icon rail. Put a 44px icon-only collapse/expand button beside the brand; expose its name, state, and tooltip. Stack the brand and toggle in the collapsed rail. |
| M02 | Reserve space for the sticky sidebar; do not overlay page content. Long navigation scrolls independently. Keep menu settings reachable at the bottom. Toggling preserves page state. |
| M03 | Below 1024px, show the brand and Open navigation button in a compact header. Open a left modal drawer up to 280px wide, reduced to fit small screens. Include full navigation labels, close control, and dimmed backdrop. |
| M04 | Close the drawer on its close button, Escape, outside click, or completed same-tab navigation, including Back/Forward. Selecting the current page also closes it. Preserve modified-click/new-tab behavior. |
| M05 | Resizing to desktop closes the drawer and releases background blocking. Resizing back leaves it closed. Transfer focus when its current control becomes hidden. |
| M06 | Store collapse preference under `gjp-lab.sidebar.collapsed`; default to expanded. Storage failures must not break controls. Drawer visibility starts closed and is not persisted. |
| M07 | Mark only the exact current link, including Home. Open and distinguish its containing groups on route changes. Keep navigation visible on not-found pages, without a selected page link. |
| M08 | Use labeled navigation, native links/buttons, a main landmark, and Skip to content. Hide decorative icons and name every icon-only action. |
| M09 | Trap focus in the open drawer and return it appropriately on close. Focus main content after navigation to a different pathname. Initial loading must leave focus unchanged. |
| M10 | Support Light/Dark, all ten accents, visible focus, tooltips, reduced motion, 200% zoom, and 44px targets. Avoid clipping and horizontal overflow at 320px. |
| M11 | Group buttons expand/collapse children without navigating. Show a chevron and `aria-expanded`. Multiple groups may stay open; route changes open the current page's ancestors. |
| M12 | Clicking a group in the collapsed rail expands the sidebar and opens that group, retaining focus. Do not depend on hover to reach children. |
| M13 | Use one validated JSON menu for desktop and mobile, including order, labels, icons, routes, and nested groups. Configuration changes require rebuilding for deployment. |

The GJP Lab brand links to Home and uses FlaskConical. Current entries are Home
(`/`, Home icon) and About (`/about`, Info icon). Future React, UI library, and
TypeScript categories appear between them when implemented.

## Bottom controls

Show **Language → Mode → Accent color**, without visible text labels, on every
route. Use one horizontal row at the bottom of the expanded sidebar and mobile
drawer. Stack the three 44px controls in the narrow collapsed rail.

| Control | Click behavior | State and accessibility |
| --- | --- | --- |
| Language | Immediately toggle English ↔ Chinese; no selector or popup. | Display a distinct icon for each language. Provide a translated name and next-action tooltip. Keep the choice for the current session. |
| Mode | Immediately toggle Light ↔ Dark; no dialog. | Use Sun/Moon icons, a named toggle, pressed state, and next-action tooltip. Persist the selected mode; default to Light. |
| Accent color | Open an accessible dialog containing the ten existing accent choices. | Tint the palette icon with the active accent. Apply changes immediately. Reset only the accent to Mint. |

Keep these controls out of the Home header and mobile header. Switching language
or mode preserves the route, drawer/collapse state, and other preferences. Home
content is translated; current menu labels, About, and other English chrome keep
their existing translation scope. System mode is removed. Legacy saved System
values become Light while preserving a valid accent.

See [appearance requirements](theme.md) for persistence and cross-tab behavior.

## Menu configuration

Source: [menu.json](../../src/features/navigation/config/menu.json). List order is
display order; adding a link does not create a route.

| Field | Rule |
| --- | --- |
| `items` | Root field containing a non-empty list. No other root fields. |
| `id` | Non-empty string, unique throughout the tree. |
| `label` | Non-empty display text. |
| `type` | `link` or `group`. |
| `icon` | Supported Lucide name; required at the top level, optional for children. |
| `to` | Existing application route for a link; omit the hosting prefix. |
| `children` | Non-empty list for a group. |

Links have `to`, never `children`; groups have `children`, never `to`. Reject unknown
fields, duplicate IDs, unsupported icons, unknown routes, and empty groups with
errors identifying the entry. Preserve `/lab/react/v2/` as the hosting base.

## Acceptance and verification

Automated coverage includes schema validation, groups, exact active links,
collapse persistence, navigation/focus behavior, direct language/mode toggles,
changing icons, legacy System migration, and the mobile drawer's accent dialog.
See the [verification summary](../README.md#verification) for recorded results.

Remaining browser checks:

- [ ] Check 320, 375, 768, 1023, 1024, and 1440px, both sidebar widths, and long menus.
- [ ] Check keyboard focus, tooltips, 200% zoom, reduced motion, and drawer dismissal.
- [ ] Check nesting, Back/Forward, modified clicks, resize transitions, and bottom controls.
- [ ] Check refresh, direct URLs, not-found recovery, and production hosting fallback.

Automated DOM tests do not establish browser layout, assistive-technology, or
production-host verification.
