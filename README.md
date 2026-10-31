# GJP Lab · React + TypeScript + Vite

## Overview

A browser application built manually without a starter template. Home presents a
visual technology architecture diagram; About demonstrates reusable cards. Both pages share
a collapsible sidebar and a footer, with responsive styling and Lucide icons.
Below 1024px, navigation opens in a modal drawer. Menu entries and nested groups
are configured in `src/features/navigation/config/menu.json`.

The technology guides contain optional exercises. Their example files and features
are added only when you follow those exercises. There is no backend. React state and Zustand manage client state;
Query/Ky provide the API foundation, and i18next translates Home. Jest runs unit tests and coverage; React Testing Library checks components.

## Stack and requirements

| Purpose | Technology |
| --- | --- |
| Components and types | React 19, React DOM, and TypeScript 7 |
| Development and builds | Vite 8 with `@vitejs/plugin-react`, integrated Oxc transformation, and Rolldown bundling |
| Routing | TanStack Router with code-based routes |
| UI components | Local shadcn/ui Base Nova source; Base UI interaction primitives |
| Styling | Tailwind CSS 4 with its Vite plugin and existing custom CSS |
| Icons | Lucide React |
| Linting and formatting | Biome 2 |
| Client state | React State + Zustand 5 |
| Server state / HTTP | TanStack Query 5 + Ky 2 |
| API mocking | MSW 3 (opt-in development worker and Node tests) |
| Internationalization | i18next 26 + react-i18next 17; English/Chinese Home |
| Git hooks | Husky 9 + lint-staged 17 |
| Unit testing / coverage | Jest 30 |
| Component testing | React Testing Library 16 |

Use **Node.js 24+** and **pnpm 12+**, without exact runtime or package-manager pins.
See the [Node.js](docs/tech/nodejs.md#install-nodejs) and
[pnpm](docs/tech/pnpm.md#install-pnpm) installation guides.
Exact dependency versions and scripts are recorded in [package.json](package.json);
[pnpm-lock.yaml](pnpm-lock.yaml) records dependency resolution.

## Quick start

From the project root, where `package.json` is located:

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Open [the development page](http://127.0.0.1:5174/lab/react/v2/) if Vite does not
open it automatically. Explore the stack diagram, select About, or edit `src/features/home/home-page.tsx` to
see Fast Refresh. Keep the terminal running; stop development with **Ctrl+C**.
Port **5174** is strict: Vite reports an error if another process is using it.

## Common commands

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Start the development server |
| `pnpm check` | Check lint, formatting, and import organization without editing |
| `pnpm check:fix` | Apply safe fixes, formatting, and import organization; review the edits |
| `pnpm typecheck` | Check application, Vite configuration, and TypeScript test types |
| `pnpm test` | Run all Jest tests once |
| `pnpm test:watch` | Rerun tests while developing |
| `pnpm test:coverage` | Run tests and write HTML/LCOV coverage to `coverage/` |
| `pnpm build` | Run type checks and write production assets to `dist/` |
| `pnpm preview` | Serve the latest build for local verification |
| `pnpm prepare` | Install hooks in a Git checkout; safely skip elsewhere |

Build checks application, Vite configuration, and TypeScript test types. It does
**not** run Biome or Jest. Run `pnpm check` and `pnpm test:coverage` separately.
See [Biome](docs/tech/biome.md) for separate lint/format commands and file scope.
Markdown links and fenced examples need separate verification.

## Project structure

The app uses a feature-based SPA structure. See the
[architecture design](docs/implement/architecture.md) for ownership, import
boundaries, and how to add a feature.

```text
src/
├── main.tsx                  Browser entry and providers
├── app/                      Router, shared layout, global stylesheet, integration tests
├── features/
│   ├── home/                 Stack diagram page
│   ├── about/                About page
│   ├── navigation/           Menu config, validation, renderer, and tests
│   └── appearance/           Theme model, provider, controls, and tests
└── shared/                   Reusable UI, utilities, route targets, and tests
build/                       Node-only appearance startup script generator
tests/support/               Common browser boundaries, CSS stub, and Jest transform
public/                      Static assets, including favicon.svg
docs/                        Requirements, code design, and technology guides
components.json              shadcn/ui Base Nova shared source aliases
jest.config.js               Test discovery, transforms, environments, and coverage
tsconfig*.json               Browser, Node configuration, and test type checks
vite.config.ts               Development server, plugins, alias, and build settings
```

`node_modules/` and `dist/` are generated and ignored by version control.
Optional exercise components are separate from the existing source listed above.

## Routing and UI conventions

- Define routes in `src/app/router.tsx`. Home (`/`) and About (`/about`) render through
  AppShell's `Outlet`; unmatched paths show a not-found view. Use typed `Link`
  components for internal navigation. Home separates browser libraries, the Vite build pipeline, and workspace tools.
- Preserve Vite's `/lab/react/v2/` base and the router's
  `basepath: import.meta.env.BASE_URL`. Use `/about` in links; the router adds the
  hosting prefix. Use `BASE_URL` for base-dependent public asset URLs too.
- `@/` maps to `src/` in Vite and TypeScript. Keep both alias settings aligned.
- Reuse local UI source: Button wraps Base UI; Card is presentational, with real
  headings nested inside CardTitle. Use `Link` with `buttonVariants` for
  button-styled navigation. Review local customizations before replacing UI source.
- Tailwind CSS 4 uses the Vite plugin and CSS-first tokens in `src/app/styles.css`.
  Reuse theme colors and preserve useful custom CSS; the app supports light/dark modes and ten accent colors.
- Import Lucide icons by name. Hide decorative icons and give icon-only controls
  accessible labels. Verify keyboard focus and narrow layouts after UI changes.

## Home page

Home uses the Compact layers design (Option 3): numbered category panels and
technology tiles for application, interface, state/data, build,
workspace, and testing sections. Technology tiles use official brand marks and open
their official sites in new tabs. See the [Home requirements](docs/requirement/home.md) and
[Home code design](docs/implement/home.md) for content and layout details.

## Menu configuration

See the [menu design](docs/implement/menu.md) for the JSON format, nested groups,
route registration, and focus behavior. Home and About are the initial entries;
feature categories can be added when their pages exist. Menu changes require a
rebuild for deployment. Run `pnpm test src/features/navigation/__tests__/menu.test.js` for validation tests.

## Build and deployment

```sh
pnpm check
pnpm test:coverage
pnpm build
pnpm preview
```

Preview is normally available at [the local preview URL](http://localhost:4173/lab/react/v2/);
use the URL printed in the terminal if its port differs. Rebuild after source edits.
Preview is for local verification, not production hosting.

Deploy the **contents of `dist/`** under `/lab/react/v2/`. Configure the static host
to serve existing assets normally and fall back to `/lab/react/v2/index.html` for
application routes. This lets direct visits and refreshes at `/lab/react/v2/about`
work. Vite and the router do not configure host rewrites.

Build environments need development dependencies, including TypeScript, Vite, and
Tailwind. Production source maps are enabled under `dist/assets/`; review whether
to publish them. Client-side `VITE_` values are public and must not contain secrets.
If the hosting prefix changes, update Vite's base, host configuration, and docs,
then rebuild.

## Documentation and troubleshooting

Start with the [documentation index](docs/README.md) for requirements and design,
or the [technology index](docs/tech/README.md) for the guides and the
learning path. Focused guides cover [routing](docs/tech/tanstack-router.md),
[shadcn/ui and Base UI](docs/tech/shadcn-ui.md), [Tailwind](docs/tech/tailwindcss.md),
and [Lucide](docs/tech/lucide-react.md). For manual setup, see
[Project creation](docs/project-create.md). Follow [AGENTS.md](AGENTS.md) when contributing.

| Problem | First check |
| --- | --- |
| Node.js or pnpm is too old | Check `node --version` and `pnpm --version` against the minimums above |
| Port 5174 is occupied | Stop the conflicting server or use `pnpm dev --port 5175 --strictPort` |
| An `@/` import fails | Check the file path and matching Vite/TypeScript aliases |
| Preview shows old content | Run `pnpm build` again |
| Direct route refresh returns a server 404 | Configure the host fallback to `/lab/react/v2/index.html` |
| Frozen installation rejects the lockfile | Restore unintended manifest edits, or run `pnpm install` for an intentional dependency change and review the lockfile |

## Testing

Run `pnpm test:coverage` and open `coverage/index.html` for the HTML report.
Coverage includes all browser source and the appearance bootstrap; untested files
remain visible. The full coverage run enforces a global minimum of 90% each for
statements, branches, functions, and lines. Build does not run tests automatically. See the
[testing overview](docs/tech/testing.md), [Jest guide](docs/tech/jest.md),
[React Testing Library guide](docs/tech/react-testing-library.md), and [code design](docs/implement/testing.md).

## Stack integration

See [Application stack integration](docs/implement/stack.md) for provider order,
Zustand ownership, HTTP defaults, development mocking, and hook activation.
The sidebar and mobile navigation drawer contain an English/Chinese toggle;
Home is translated while other pages keep their English content.
To opt into development interception, copy `.env.example` to `.env.local`, set
`VITE_API_MOCKING=true`, and restart Vite. No handlers or backend endpoints are
added by default. Hooks activate through `pnpm prepare` when in a Git checkout.
