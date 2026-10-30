# Feature-based SPA architecture

## Folder ownership

```text
src/
├── main.tsx                         Browser entry: StrictMode and providers
├── app/
│   ├── providers.tsx                Query, i18next, and appearance providers
│   ├── prepare.ts                   Translation readiness and opt-in worker startup
│   ├── query-client.ts              Stable query cache configuration
│   ├── mocks/browser.ts             Development worker adapter
│   ├── router.tsx                   Route tree and hosting base
│   ├── app-shell.tsx                Shared layout, sidebar/drawer orchestration
│   ├── styles.css                   Tailwind, semantic tokens, global styles
│   └── __tests__/                   Application integration and startup tests
├── features/
│   ├── home/home-page.tsx           Technology stack landing page
│   ├── about/about-page.tsx         About page
│   ├── navigation/
│   │   ├── components/              Recursive menu rendering
│   │   ├── config/menu.json         Menu entries and nested groups
│   │   ├── model/menu-schema.ts     Validation and active-group calculation
│   │   └── __tests__/               Menu model and component tests
│   └── appearance/
│       ├── components/              Appearance provider and settings dialog
│       ├── model/appearance.ts      Modes, accents, parsing, and resolution
│       └── __tests__/               Model and provider tests
└── shared/
    ├── api/http.ts                  Shared Ky transport
    ├── i18n/i18n.ts                 Bundled translation resources and instance
    ├── ui/                          Owned Button and Card components
    ├── lib/utils.ts                 Class-name merging
    ├── routing/route-paths.ts       Route targets shared with menu validation
    └── __tests__/                   Shared UI and utility tests
build/                               Node-only appearance bootstrap generation
tests/support/                       Common test browser/transform helpers
```

This is a browser SPA with code-based TanStack routes. Feature folders own their
page, component, model, configuration, and tests as applicable. Home and About
remain small, so each owns a single page file without empty model/component
subfolders. Introduce another folder only when there is code that belongs there.

## Import boundaries

| Area | Allowed dependencies and responsibility |
| --- | --- |
| `main.tsx` / `app` | Compose features and shared modules, register routes, mount the application |
| `features/<name>` | Use its own modules and `shared`; do not import application composition or another feature |
| `shared` | Reusable UI, utility functions, and route target constants; no feature or app imports |
| `build` | Node-only tooling; may import pure appearance model functions for the startup script |
| `__tests__` | Test the owning area; application integration tests can compose multiple features |

`@/` continues to map to `src/` in Vite, TypeScript, and Jest. Import concrete
modules directly; no barrel exports or additional aliases are needed. Node-loaded
modules use relative `.ts` imports where required by the Vite configuration.
The dependency direction is maintained by folder ownership and import review;
no new dependency-boundary linter is installed.

Route targets live in `shared/routing` because both the route registry and menu
validator need them. Keeping the constants there avoids a feature-to-app import.
Route registration itself stays in `app/router.tsx`.

AppShell composes navigation and appearance. It retains the existing sidebar,
drawer, router-event, and focus state. AppearanceProvider owns preference state;
the navigation renderer receives menu state and callbacks through props. The
refactor changes file ownership and imports without changing those behaviors.

## Styling and generated components

`app/styles.css` remains the single global stylesheet, imported by `main.tsx`.
Its rule order, Tailwind integration, tokens, and feature selectors are preserved.
This keeps the existing light/dark themes, ten accents, and responsive layout.

[components.json](../../components.json) now points to that stylesheet and
`@/shared/ui` for owned shadcn/ui components. Its utility alias points to
`@/shared/lib/utils`. Generic future generated components/hooks have shared
aliases; feature-specific code should be moved into its owning feature.

## Tests and coverage

Tests sit in the owning area's `__tests__` folder. Common browser boundaries and
Jest transforms stay under `tests/support`. Jest discovers colocated tests and
also accepts optional exercises under `tests/`.

The browser TypeScript project excludes `__tests__`. `tsconfig.test.json` includes
those suites and common support files, resets the inherited exclusion, and adds
Node types. Build still checks application, Vite configuration, and typed tests.

Coverage still includes all production `.ts`/`.tsx` files under `src/` and `build/`.
Only colocated test directories are excluded from that production measurement.
The global 90% minimum for statements, branches, functions, and lines remains.
Initial route loading leaves focus unchanged; navigation to a different pathname
moves focus to main content. See [Menu focus flow](menu.md#6-event-and-focus-control-flow).
See [Testing code design](testing.md) for detailed runner behavior.

## Adding a feature

1. Create `src/features/<name>/` and add its page or components.
2. Reuse `shared/ui` and keep feature-only models/configuration beside their consumers.
3. If it needs a route, add a target in `shared/routing/route-paths.ts`, register
   the page in `app/router.tsx`, and add its menu entry in the navigation JSON.
4. Put behavior tests in the feature's `__tests__`; use application integration
   tests for interactions spanning routes or features.
5. Run `pnpm test:coverage`, `pnpm check`, and `pnpm build`.

The `/lab/react/v2/` hosting base and Home/About URL targets are unchanged.

[Application stack integration](stack.md) describes Zustand, Query, Ky, MSW,
i18next, Git hooks, and runtime preparation.
