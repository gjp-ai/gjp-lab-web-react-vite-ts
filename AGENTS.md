# Contributor instructions

## Project scope and key files

- This manually created browser app uses React 19, TypeScript 7, Vite 8,
  TanStack Router, shadcn/ui with Base UI, Tailwind CSS 4, Lucide React, and Biome 2.
  Home has a visual technology architecture diagram; About demonstrates local UI components.
  Jest 30 runs unit tests and coverage; React Testing Library 16 checks components.
  React State and Zustand manage client state. TanStack Query 5, Ky 2, MSW 3,
  i18next/react-i18next, and Husky/lint-staged are installed. No backend is configured.
- Require Node.js 24+ and pnpm 12+ without exact runtime or package-manager pins.
  Preserve Vite's integrated Oxc transformation and Rolldown bundling pipeline.
- Keep changes focused on the request, preserve unrelated work, and introduce
  dependencies or architecture only for a concrete need. Keep the manually created
  project; do not replace it with a starter template.

| Location | Responsibility |
| --- | --- |
| `src/main.tsx` | Await preparation; mount StrictMode, AppProviders, RouterProvider, and stylesheet |
| `src/app/router.tsx` | Typed route tree, router registration, base path, and not-found view |
| `src/features/home/`, `src/features/about/` | Home and additional page content |
| `src/app/app-shell.tsx` | Shared navigation, main container, Outlet, and footer |
| `src/shared/ui/`, `components.json` | Owned shadcn/ui source and Base Nova configuration |
| `src/app/styles.css`, `src/shared/lib/utils.ts` | Tailwind theme, custom CSS, and `cn` class merging |
| `public/` | Static assets copied by Vite |
| `docs/project-create.md`, `docs/tech/` | Manual setup and technology guides |

Keep the feature-based SPA boundaries documented in [architecture.md](docs/implement/architecture.md).
Application composition belongs in `src/app`; feature components, models, configuration,
and colocated tests belong in `src/features/<name>`. Shared code must not import
features or application modules. Keep common test helpers in `tests/support`.

Use [stack.md](docs/implement/stack.md) for provider order and tool integration.
Keep API cache in Query, client state in React/Zustand, and translations in i18next.
MSW browser startup must remain development-only and opt-in.

Create additional component, type, or data files when needed; keep one-off types
local and avoid duplicated data sources. Keep Node-only utilities outside `src/`.

## Commands and validation

| Command | Purpose |
| --- | --- |
| `pnpm install --frozen-lockfile` | Install the recorded dependencies after checkout |
| `pnpm dev` | Start development with Fast Refresh and automatic browser opening |
| `pnpm check` | Check lint, formatting, and import organization without editing |
| `pnpm check:fix` | Apply safe fixes and formatting; review the changes |
| `pnpm typecheck` | Check browser source, Vite configuration, and TypeScript test types |
| `pnpm test` | Run Jest unit/component tests |
| `pnpm test:coverage` | Run tests with HTML/LCOV coverage; enforce 90% globally for all four metrics |
| `pnpm build` | Run type checks and generate `dist/` |
| `pnpm preview` | Serve the completed build for local verification |

- Development URL: `http://127.0.0.1:5174/lab/react/v2/`. Port 5174 is strict;
  resolve conflicts or explicitly select another port. Stop temporary servers afterward.
- For source, dependency, or build-configuration changes, run `pnpm check` and
  `pnpm build`. Build includes application, configuration, and test type checks
  but does not run Biome or Jest. Run affected tests for behavior changes and
  `pnpm test:coverage` to enforce the global minimums. Run `pnpm typecheck` separately when requested or useful for earlier feedback.
- Keep Biome's recommended preset and import organization. Use safe fixes without
  `--unsafe`; fix remaining diagnostics rather than disabling rules to pass checks.
  See [Biome](docs/tech/biome.md) for separate lint/format commands and file scope.

## Routing

- Keep code-based routes in `src/app/router.tsx`. Register children with `addChildren`
  and preserve the `Register` declaration; this setup needs no generated route tree
  or router Vite plugin. Keep shared layout and Outlet in AppShell.
- Use typed TanStack `Link` for internal navigation. Use `/` and `/about` as targets;
  preserve exact matching on Home so it is not active on every page.
- Preserve Vite's `base: '/lab/react/v2/'` and router
  `basepath: import.meta.env.BASE_URL`. Use `BASE_URL` for base-dependent public assets.
- `@/` maps to `src/`; keep Vite's alias and TypeScript's `paths` aligned.
- Deploy `dist/` contents under `/lab/react/v2/`. The host must serve real assets
  normally and fall back to `/lab/react/v2/index.html` for application routes.
  Preview is for local checks. Production source maps are enabled in `dist/assets/`.

## UI, styling, and icons

- Reuse owned components in `src/shared/ui/`. Keep `base-nova` in `components.json`:
  Button wraps Base UI; Card is presentational. Put semantic headings inside CardTitle.
- Use Button for actions with an explicit type. Use TanStack `Link` with
  `buttonVariants` for button-styled navigation. Preserve Base UI behavior and APIs;
  do not copy Radix `asChild` patterns into these components.
- Review incoming component source before replacing local customizations. Preserve
  the upstream notice in [docs/licenses/shadcn-ui.txt](docs/licenses/shadcn-ui.txt).
- Tailwind CSS 4 uses `@tailwindcss/vite` and CSS-first tokens in `src/app/styles.css`.
  Preserve light/dark modes, the ten accents, and useful custom CSS. Keep utility names complete
  in source and use `cn` for conditional classes; inspect CSS layers and specificity
  when global styles override utilities. Keep legacy native-button CSS from overriding
  `data-slot="button"` controls.
- Use named Lucide imports. Hide decorative icons, label icon-only controls on their
  interactive wrapper, and preserve visible keyboard focus and responsive layouts.
- Preserve Biome's Tailwind directive parser and formatting: two spaces, LF,
  width 100, JS/TS single quotes, JSX double quotes, and semicolons.

## Code and dependency rules

- Use function components and top-level hooks; preserve StrictMode and strict
  TypeScript checks. Use `.tsx` for JSX, `.ts` for other code, and `import type`
  for type-only symbols. Type meaningful boundaries and infer obvious local values.
- Handle missing/null values explicitly. Avoid `any`, unjustified assertions,
  and suppression comments that conceal errors. Keep rendering pure and use stable keys.
- Treat props as read-only and update state immutably. Use functional updates when
  deriving the next state, derive ordinary computed values during render, and use
  effects only for external synchronization with dependencies and cleanup.
- Use pnpm and exact dependency versions. Update `package.json` and `pnpm-lock.yaml`
  together; review engine/peer requirements and keep unrelated upgrades separate.
  Preserve `engineStrict: true` and `savePrefix: ''` in `pnpm-workspace.yaml`.
- Do not edit installed packages or generated output. Never commit secrets, local
  `.env` files, `node_modules/`, or `dist/`. A non-secret `.env.example` may be tracked;
  client-side `VITE_` values are public.

## Documentation and completion

- Update [README.md](README.md) for setup, command, URL, or deployment changes;
  update [docs/project-create.md](docs/project-create.md) for foundational changes
  and keep its source snapshots current. Put tutorials in [docs/tech/](docs/tech/README.md),
  with beginner-friendly instructions and existing/optional features clearly marked.
- When the user requests a proposal before editing, present it and wait for confirmation.
  Otherwise proceed within the authorized scope without adding a routine approval step.
- For UI changes, verify behavior, keyboard navigation, and narrow/wide layouts in a
  browser. For routing/base-path changes, also test links, direct URLs, refresh,
  Back/Forward, not-found handling, and generated asset paths as relevant.
- For documentation-only changes, check links, paths, and configuration consistency.
  Markdown is outside Biome's scope: verify complete source examples with Biome and
  TypeScript in a temporary project, building when relevant. Preserve marked deliberate
  error examples. Prose-only edits do not require an application build.
- Add targeted tests when behavior warrants them without adding a runner for trivial
  changes. Report changes, checks actually performed, and material limitations;
  distinguish type/build checks from browser, installation, or deployment verification.
