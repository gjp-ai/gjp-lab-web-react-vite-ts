# TanStack Router

## Contents

- [Introduction](#introduction)
- [Configuration in this project](#configuration-in-this-project)
- [Basic usage](#basic-usage)
- [Practical examples](#practical-examples)
- [Best practices and troubleshooting](#best-practices-and-troubleshooting)
- [Official references](#official-references)

## Introduction

TanStack Router connects URLs to React components. Selecting a router link changes
which page appears without requesting a new HTML document for every navigation.
The browser's address bar and Back/Forward buttons still work.

**Existing setup:** `@tanstack/react-router` **1.170.46** is an exact dependency in
[package.json](../../package.json). This project uses code-based routing: route
objects are declared in TypeScript. With only Home and About, the complete route
tree is easy to read in one file. No router Vite plugin or generated route file
is required for this approach.

| Term | Meaning here |
| --- | --- |
| Route | A URL path connected to a component, such as `/about` and `AboutPage` |
| Route tree | The root route and its registered children |
| Layout | UI shared across pages: AppShell's navigation, main container, and footer |
| Outlet | The position in the layout where the matched child page renders |
| Link | A typed React component for navigating to a registered route |
| Base path | The hosting prefix `/lab/react/v2/`, added around application route paths |

**Existing features** below describe the running app. **Optional recommendations**
are learning exercises; their files and routes are not installed until you add them.
This guide covers the current setup and a simple additional page. No new dependency
is needed for its examples.

## Configuration in this project

### Files and responsibilities

| File | Responsibility |
| --- | --- |
| [src/app/router.tsx](../../src/app/router.tsx) | Defines routes, creates the router, and registers its types |
| [src/app/app-shell.tsx](../../src/app/app-shell.tsx) | Shared navigation, `Outlet`, and footer |
| [src/main.tsx](../../src/main.tsx) | Mounts `RouterProvider` inside React `StrictMode` |
| [src/features/home/home-page.tsx](../../src/features/home/home-page.tsx) | Home technology stack diagram |
| [src/features/about/about-page.tsx](../../src/features/about/about-page.tsx) | About page |
| [vite.config.ts](../../vite.config.ts) | Sets Vite's public base URL |

### Complete current router configuration

**Existing configuration:** `src/app/router.tsx` contains:

```tsx
import { createRootRoute, createRoute, createRouter, Link } from '@tanstack/react-router';
import { AppShell } from '@/app/app-shell';
import { AboutPage } from '@/features/about/about-page';
import HomePage from '@/features/home/home-page';
import { routePaths } from '@/shared/routing/route-paths';

const rootRoute = createRootRoute({
  component: AppShell,
  notFoundComponent: () => (
    <section lang="en" className="hero">
      <p className="eyebrow">PAGE NOT FOUND</p>
      <h1>Let’s head home.</h1>
      <Link to="/" className="text-primary underline underline-offset-4">
        Return to Home
      </Link>
    </section>
  ),
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: routePaths.home,
  component: HomePage,
});
const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: routePaths.about,
  component: AboutPage,
});
const routeTree = rootRoute.addChildren([homeRoute, aboutRoute]);

export const router = createRouter({
  routeTree,
  basepath: import.meta.env.BASE_URL,
  scrollRestoration: true,
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
```

Read it in this order:

1. `createRootRoute` selects AppShell as the shared layout and supplies the not-found UI.
2. Each `createRoute` declares its parent, path, and page component. A component
   reference such as `component: AboutPage` tells the router what to render.
3. `addChildren` attaches Home and About to the root. Declaring a route variable
   alone does not register it in the tree.
4. `createRouter` combines that tree with the hosting base path and scroll restoration.
5. The `Register` declaration associates the router with TanStack's TypeScript
   APIs, letting links check destinations against this application's route tree.

The registration is a type declaration, not another runtime router. Keep it when
adding routes; do not create a second router to add a page.

### Connect the router to React

**Existing feature:** `src/main.tsx` imports the router and renders this fragment
inside `createRoot(root).render(...)`:

```tsx
<StrictMode>
  <AppearanceProvider>
    <RouterProvider router={router} />
  </AppearanceProvider>
</StrictMode>
```

`RouterProvider` makes the current router available to the rendered application.
AppShell's `Outlet` renders `HomePage` on Home and `AboutPage` on About. The surrounding
navigation and footer remain shared. See [React](react.md) for mounting and components.

### Coordinate Vite base and router basepath

**Existing configuration:** Vite sets `base: '/lab/react/v2/'`. The router reads
that same prefix through `basepath: import.meta.env.BASE_URL`.

| Application route or link target | Browser path |
| --- | --- |
| `/` | `/lab/react/v2/` |
| `/about` | `/lab/react/v2/about` |

Write `to="/about"` in router links, not `to="/lab/react/v2/about"`. The router
adds the hosting prefix. Vite uses its base for asset URLs; the router uses its
base path for matching and navigation. If the hosting prefix changes, update
Vite's base, rebuild, and update deployment configuration and documentation.

`scrollRestoration: true` enables the router's handling of scroll positions during
navigation. Check long-page navigation and Back/Forward when adding pages that scroll.

## Basic usage

### Start and explore the existing app

From the project root after installing dependencies:

```sh
pnpm dev
```

1. Open `http://127.0.0.1:5174/lab/react/v2/`. Home shows six technology layers.
2. Select About. The browser path becomes
   `/lab/react/v2/about`, and About replaces Home inside the shared layout.
3. Select Home to return to the diagram. Optional page-local state unmounts when
   leaving its page; appearance and sidebar preferences are managed separately.
4. Try Back and Forward, then refresh on About to check direct route loading.
5. Open `/lab/react/v2/missing`. Expect the not-found message and a return-home link.
6. Use Tab to reach links and Enter to activate them. Keep keyboard focus visible.

Port 5174 is strict. Use the [pnpm guide](pnpm.md) for installation and script details,
and the [Vite guide](vite.md) if the server cannot start. Stop the server with Ctrl+C.

### Verify edits

Use a second terminal while development runs:

```sh
pnpm check
pnpm typecheck
pnpm build
```

Biome checks lint, formatting, and imports. TypeScript checks the route tree and
link targets. Build includes type checking, but it does not run Biome. Apply
`pnpm check:fix` when needed, review the edits, and rerun checks.
To inspect production output, run `pnpm preview` after building and use its printed
URL, normally `http://localhost:4173/lab/react/v2/`.

## Practical examples

### 1. Navigate with a typed Link

**Existing feature, simplified example:** the shared shell and navigation
renderer use typed `Link` components for Home and About. This complete reusable component follows the same pattern:

```tsx
import { Link } from '@tanstack/react-router';

export function AboutLink() {
  return <Link to="/about">About this project</Link>;
}
```

If trying it as an exercise, create `src/features/home/components/about-link.tsx` with this code,
import `AboutLink` into `HomePage`, and render `<AboutLink />` inside HomePage's returned
fragment. Expect it to open `/lab/react/v2/about`. The extra component is optional;
it is not currently a source file.

Use normal anchors for external sites. Prefer router `Link` for internal pages
so the router handles navigation and can check the destination's type.

### 2. Style the active navigation link

**Existing feature:** AppShell's Home link uses these props; icons are omitted
from this JSX fragment for clarity:

```tsx
<Link
  to="/"
  activeOptions={{ exact: true }}
  activeProps={{ className: 'bg-muted text-primary' }}
  className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-muted"
>
  Home
</Link>
```

The classes in `activeProps` apply when Home matches. `exact: true` prevents Home
from also appearing active on About. Select each page and expect its navigation
item to receive the active styling. Tailwind's theme utilities are explained in
[Tailwind CSS](tailwindcss.md).

### 3. Keep layout and not-found UI shared

**Existing feature:** the important part of AppShell has this structure. This is
a structural illustration, not a replacement for the complete component:

```tsx
<main className="shell">
  <header className="masthead">{/* Shared brand and navigation */}</header>
  <Outlet />
  <footer>{/* Shared footer */}</footer>
</main>
```

Do not add another `main` or duplicate navigation to every page. Return the page's
content, such as a `section`, and let `Outlet` place it inside the existing layout.

The root's `notFoundComponent` in the complete configuration handles unmatched
paths. It keeps the layout and renders `Link to="/"` to recover. Try a missing
path, then select **Return to Home**. A client-side not-found view does not itself
configure a host fallback or an HTTP 404 response on a static server.

### 4. Add an Experiments page

**Optional recommendation:** this complete exercise adds one static route. It
preserves Home and About and requires no new package.

#### Step 1: create the page

Create `src/features/experiments/experiments-page.tsx`:

```tsx
export function ExperimentsPage() {
  return (
    <section className="hero" aria-labelledby="experiments-title">
      <p className="eyebrow">TRY AN IDEA</p>
      <h1 id="experiments-title">Experiments</h1>
      <p className="intro">A place for the next small project.</p>
    </section>
  );
}
```

#### Step 2: import and register the route

Add this import with the other page imports in `src/app/router.tsx`:

```tsx
import { ExperimentsPage } from '@/features/experiments/experiments-page';
```

After `aboutRoute` and before `const routeTree`, add:

```tsx
const experimentsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/experiments',
  component: ExperimentsPage,
});
```

Replace the existing `routeTree` declaration with:

```tsx
const routeTree = rootRoute.addChildren([homeRoute, aboutRoute, experimentsRoute]);
```

Keep the existing `createRouter` call and `Register` declaration below it.
The new route becomes part of the same typed tree.

#### Step 3: add navigation

Add `experiments: '/experiments'` to `routePaths` in
`src/shared/routing/route-paths.ts` and use `routePaths.experiments` for the new
route's path. Add an item to `src/features/navigation/config/menu.json` with a
unique ID, `type: "link"`, `label: "Experiments"`, a supported icon such as
`"Atom"`, and `to: "/experiments"`. The recursive navigation reads that JSON;
AppShell does not need another hard-coded link.

#### Step 4: check the result

Run the verification commands above. Open Experiments and expect
`/lab/react/v2/experiments`, the new heading, and the shared navigation/footer.
Refresh on that URL and try Back/Forward. Check the extra navigation item at a
narrow width; the sidebar/drawer should keep labels readable without horizontal overflow.

When removing the exercise, remove its menu entry, shared route target, and route registration first, then
its route variable, import, and page file. Remove any optional `AboutLink` usage
and import before deleting that exercise's component file too.

## Best practices and troubleshooting

- Keep page content in `src/features/<name>/`; keep shared layout in `src/app/app-shell.tsx`.
- Use application route targets such as `/about` without repeating the hosting prefix.
- Preserve the registered router types and strict TypeScript settings. Fix invalid
  route targets rather than forcing them through a type assertion.
- Test navigation, keyboard access, refresh, and Back/Forward after route changes.
- Keep local state reset behavior in mind. Add persistence only when a feature needs it.
- Keep this code-based setup unless a concrete need justifies changing routing approaches.

### Deploy with a host fallback

**Required for this existing setup:** serve built assets under `/lab/react/v2/`
and configure the static host to serve `/lab/react/v2/index.html` for application
paths such as `/lab/react/v2/about` that do not correspond to a real file. Preserve
normal serving of existing assets. Test a direct URL and refresh on the actual host.

Vite's `base` and the router's `basepath` do not create server rewrite rules.
Preview can help check the build locally, but it does not prove that the deployed
host has the correct fallback. See [build and deployment](../../README.md#build-and-deployment).

| Problem | What to check |
| --- | --- |
| A new page shows the not-found view | Include its route in `addChildren`; creating a page file alone does not register it |
| TypeScript rejects a `Link` target | Check the path spelling, route registration, and `Register` declaration |
| Shared header appears but page content is missing | Keep `Outlet` in AppShell and set the route's component |
| Home looks active on About | Keep `activeOptions={{ exact: true }}` on Home |
| A URL repeats `/lab/react/v2/` | Use `/about` in `Link`, with the prefix only in router/Vite configuration |
| Clicking links works but refresh returns a server 404 | Configure the host fallback to the app's `index.html` |
| A page import fails | Check its named export, filename case, and the matching Vite/TypeScript `@/` alias |
| An optional page exercise loses state after navigation | Page-local state unmounts with its route; persist it only if required |

## Official references

- [Code-based routing](https://tanstack.com/router/latest/docs/routing/code-based-routing)
- [Navigation and active links](https://tanstack.com/router/latest/docs/guide/navigation)
- [Router options](https://tanstack.com/router/latest/docs/api/router/RouterOptionsType)
