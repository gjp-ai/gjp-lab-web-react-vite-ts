# GJP Lab menu requirements

**Status:** Implemented. See [design and verification notes](../implement/menu.md).
**Updated:** 2026-10-30

## 1. What we are building

A left sidebar that helps visitors explore GJP Lab's React, UI library, and
TypeScript examples. Visitors can collapse it to save space. On smaller screens,
the menu opens as a drawer over the page.

The sidebar, nested menus, JSON configuration, 1024px breakpoint, and drawer closing
rules are confirmed. The other defaults below were used for implementation.
Requirement IDs (M01–M13) make feedback and implementation checks easy to reference.

## 2. Menu structure

Currently, only Home and About have routes and are included in the shipped menu.
The planned order as additional feature pages are implemented is:

- **Home** — link to `/`.
- **React features** — group of feature pages.
- **UI library features** — group of feature pages.
- **TypeScript features** — group of feature pages.
- **About** — link to `/about`.

The **GJP Lab** brand sits above the menu and links to Home. Keep the existing
FlaskConical brand icon, Home icon, and Info icon for About.

Groups may contain pages or smaller groups. Specific feature pages and their URLs
will be defined separately. Only show groups that have real pages; do not add
empty categories, broken links, or placeholder pages just to fill the menu.
Search, permissions, and backend features are outside this work.

## 3. How the menu behaves

### Desktop

- **M01 — Expand and collapse:** At **1024px or wider**, start with a **240px**
  sidebar. Collapse it to a **64px** strip of icons. Keep the toggle visible and
  label it “Collapse sidebar” or “Expand sidebar”. Show only the brand icon when
  collapsed.
- **M02 — Page layout:** The sidebar takes its own space and never covers content.
  Keep it available while the page scrolls; let long menus scroll independently.
  Keep the footer below the page. Toggling must not reload the page or reset its state.

### Phones and tablets

- **M03 — Open the drawer:** Below **1024px**, show a compact header with the brand
  and an “Open navigation” button. The drawer slides in from the left with full
  labels, a close button, and a dimmed background. Use **280px** width, reduced if
  needed to fit a 320px screen. Do not show the desktop icon strip.
- **M04 — Close the drawer:** Close with the close button, a click outside, Escape,
  or completed navigation in the current tab, including Back/Forward. Selecting
  the current page also closes it. Opening a link in another tab leaves this drawer
  unchanged. Keep normal browser link behavior.
- **M05 — Resize safely:** Moving to desktop closes the drawer and removes all
  background blocking. Moving back to a smaller screen leaves it closed. If the
  focused control disappears, move keyboard focus to a suitable visible control.

### Remembering choices and finding pages

- **M06 — Saved preference:** Remember desktop collapse state across navigation
  and refresh using local storage key `gjp-lab.sidebar.collapsed`. Default to
  expanded when the value is missing or invalid. If storage is unavailable, the
  toggle must still work. Drawer visibility is separate and always starts closed.
- **M07 — Current page:** Highlight the exact matching page link and identify it
  to screen readers. Distinguish its containing groups and open them when the
  route changes, including direct visits and Back/Forward. Keep the menu on the
  not-found page, with no page link selected.
- **M11 — Nested groups:** A group button opens or closes its children without
  navigating or closing the drawer. Show a chevron and expose its open state with
  `aria-expanded`. Multiple groups may stay open. Keep group choices while the app
  remains open; route changes still open groups containing the current page.
- **M12 — Groups when collapsed:** Selecting a group icon expands the sidebar and
  opens that group. Keep focus on its button. Visitors then select a child page;
  submenus must not depend on hovering.

## 4. Accessible and comfortable to use

- **M08 — Clear controls:** Use ordinary links inside labeled navigation, one main
  content area, and a “Skip to content” link. Give buttons and icon-only controls
  accessible names and relevant open/closed states. Hide decorative icons from
  screen readers.
- **M09 — Keyboard focus:** Opening the drawer moves focus inside. Tab and
  Shift+Tab stay inside while it is open; background clicks and scrolling are
  blocked. Closing without navigation returns focus to the opener. After
  navigation to a different pathname, focus the destination main content. Initial
  page loading must leave focus unchanged.
- **M10 — Appearance:** Follow the selected light/dark/system mode and accent,
  using the shared typography and [appearance requirements](theme.md). Clearly
  distinguish the current page, hover, and keyboard focus. Show text tooltips on
  hover and focus for collapsed icons. Aim for **44 × 44px** click/tap targets.
  Long labels and deep nesting must not clip or cause horizontal scrolling at
  320px. Support 200% zoom and reduced-motion preferences.

## 5. Configure the menu in JSON

**M13 — One menu file:** Use `src/features/navigation/config/menu.json` for labels, icons, order,
links, and nesting on every screen size. This file is included in the implementation. JSON changes appear in the deployed app after rebuilding.
**Adding a menu link does not create its page**; the page and route must exist first.

Use an object with an `items` list. List order is display order, including inside groups.

| Field | Meaning and rule |
| --- | --- |
| `id` | Unique, non-empty identifier across the whole menu. |
| `label` | Non-empty text shown to visitors. |
| `type` | `link` for a page, or `group` for an expandable list. |
| `icon` | Supported Lucide icon name; required for top-level entries, optional for children. |
| `to` | Page URL for a link, such as `/about`. Must match an existing route. |
| `children` | Non-empty list of links or groups, used only for a group. |

Links have `to` and no `children`; groups have `children` and no `to`.
Validate the structure, IDs, icons, and routes before producing a production build.
Errors must identify the entry and what needs fixing.

## 6. Notes for implementation

- Keep shared layout and `Outlet` in [AppShell](../../src/app/app-shell.tsx).
  Share the JSON menu across desktop and mobile; keep navigation state local to
  AppShell. Appearance uses its separate feature-owned Zustand store.
- Keep route registration in [router.tsx](../../src/app/router.tsx) and use typed
  TanStack links. Validate JSON route strings with a typed mapping or guard, rather
  than casting them to route types. Derive allowed targets from routes where practical.
- Preserve [Vite's](../../vite.config.ts) `/lab/react/v2/` base and router
  `basepath: import.meta.env.BASE_URL`. JSON targets omit this hosting prefix.
- Reuse owned UI components, Base UI, named Lucide imports, and existing
  [theme tokens](../../src/app/styles.css). Preserve Base Nova, StrictMode, strict
  types, and local customizations. No additional dependency is planned.
- Keep existing page behavior, including the Home technology diagram and About demos.
  Follow [AGENTS.md](../../AGENTS.md) and update affected docs and source snapshots.

## 7. Ready-to-ship checklist

Jest covers schema and component behavior. The checklist below is the remaining
browser/accessibility and deployment signoff; unchecked items are not verified.

- [ ] **Layout (M01–M03, M10):** Check 320, 375, 768, 1023, 1024, and 1440px in a
      browser. No overlap or horizontal overflow; page demos still work.
- [ ] **Drawer (M04–M05):** Check every close action, current-page selection,
      Back/Forward, new-tab links, and resizing. No leftover overlay or scroll lock.
- [ ] **State (M06):** Preference survives refresh/navigation; unavailable or invalid
      storage is safe; mobile use does not change desktop preference.
- [ ] **Accessibility (M07–M10):** Check keyboard use, focus, tooltips, screen-reader
      names/states, skip link, zoom, and reduced motion.
- [ ] **Groups (M11–M12):** Check nesting, multiple open groups, opening the current
      page's groups, and selecting a group from the collapsed sidebar.
- [ ] **Configuration (M13):** Check order, labels, and nesting in both layouts.
      Invalid fields, duplicate IDs, unknown icons/routes, and empty groups fail validation.
- [ ] **Routing:** Check direct URLs, refresh, not-found recovery, and generated
      asset paths under `/lab/react/v2/`.
- [ ] **Quality:** Run `pnpm test:coverage`, `pnpm check`, and `pnpm build`. Report actual browser checks
      and limitations separately; local checks do not verify production host rewrites.
