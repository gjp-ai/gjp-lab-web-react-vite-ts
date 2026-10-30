# Technology guide

## Integrated stack

The selected packages are installed with exact versions. Home displays all of them.

| Responsibility | Integration | Guide |
| --- | --- | --- |
| Client state | React local state plus a scoped Zustand appearance store | [Client state](zustand.md) |
| Server state | Stable QueryClient and application provider | [TanStack Query](tanstack-query.md) |
| HTTP client | Shared Ky v2 instance; no production API endpoint added | [Ky](ky.md) |
| API mocking | MSW v3 Node tests and opt-in development worker | [MSW](msw.md) |
| Internationalization | Initialized i18next/react-i18next, English/Chinese Home, language control | [Internationalization](i18next.md) |
| Git hooks | Husky prepare guard, pre-commit hook, and lint-staged configuration | [Git hooks](husky-lint-staged.md) |

The Git hook files are ready; activation requires a Git checkout. Browser mocking
is disabled by default and gated by development mode. Query/Ky foundations are
available to future API-backed features; the current pages need no backend.
Examples of a Projects API in the guides remain optional future examples.

## Introduction

For requirements, code design, and verification boundaries, start with the
[documentation index](../README.md).

These guides cover features already used in this project and a small set of
recommended practices for extending it. Optional components and routes are labeled
and become application features only when you add their source and integrate them.

| Guide | Scope |
| --- | --- |
| [Testing overview](testing.md) | Shared commands and links to the detailed testing guides |
| [Jest 30](jest.md) | Unit testing, configuration, code coverage, and report interpretation |
| [React Testing Library 16](react-testing-library.md) | Component tests, accessible queries, events, and cleanup |
| [Biome](biome.md) | Lint, format, organize imports, and apply safe fixes |
| [TanStack Router](tanstack-router.md) | Typed routes, navigation, base path, and host fallback |
| [shadcn/ui and Base UI](shadcn-ui.md) | Owned Button/Card source and component conventions |
| [Tailwind CSS 4](tailwindcss.md) | Vite integration, theme tokens, and utility classes |
| [Lucide React](lucide-react.md) | Named icon imports and accessible controls |
| [React](react.md) | Components, props, state, hooks, and optional technology-search examples |
| [TypeScript](typescript.md) | Types, interfaces, strict checking, and a typed React selector |
| [Node.js](nodejs.md) | Direct installation on macOS, Linux, and Windows, and use in this React project |
| [pnpm](pnpm.md) | Installation on macOS, Linux, and Windows, project scripts, and dependency management |
| [Vite 8, Oxc, and Rolldown](vite.md) | Development, source transformation, and production builds |

The guides explain project configuration, usage, examples, best practices, and
official references. Existing features and optional exercises are labeled. Dependency pins
and the minimum Node.js and pnpm requirements are recorded in
[package.json](../../package.json).

## Basic usage

Run commands from the project root, where `package.json` is located:

```sh
node --version
pnpm --version
pnpm install --frozen-lockfile
pnpm dev
```

Use Node 24 or newer and pnpm 12 or newer. Development opens
[the project URL](http://127.0.0.1:5174/lab/react/v2/). Keep that terminal running
while editing; use a second terminal for `pnpm check` and `pnpm typecheck`.
Stop the server with Ctrl+C. Run `pnpm check`, `pnpm build`, and then `pnpm preview`
to inspect production output. The build checks application, Vite configuration, and test types; it does not run
Biome or Jest. Run `pnpm test:coverage` separately for the coverage gate.

For everyday setup and scripts, see the [README quick start](../../README.md#quick-start)
and [common commands](../../README.md#common-commands). For creating the project
manually, see [Project creation](../project-create.md).

## Examples and learning order

1. Follow the React guide's counter example to learn props, state, and events.
2. Follow the TypeScript guide to check component inputs and handle missing values.
3. Read Node.js and pnpm to understand how the development tools run.
4. Read Biome to learn how to check and format source files.
5. Read Vite to see how source code becomes the application served to the browser.
6. Read TanStack Router for the shared layout, typed links, and optional page exercise.
7. Read Tailwind CSS for utilities and the existing theme.
8. Read shadcn/ui and Base UI for local controls, cards, and button-styled links.
9. Read Lucide React for named icons, visible labels, and accessible icon controls.
10. Read Jest for unit tests and coverage, then React Testing Library for component behavior.

Examples are independent unless stated otherwise. Create directories when needed,
add imports at the top of `src/features/home/home-page.tsx`, and render example components inside its
returned section. Preserve the current page. When removing an exercise, remove its
imports and JSX references too. The complete exercises in the existing technology guides use installed
dependencies. The integrated stack is installed; optional feature examples still require
creating their documented files and routes. Optional CLI component additions are separate steps that can add
source and dependencies; they are not required to run the existing app.
Run `pnpm check:fix` after adding an exercise, review edits, then run `pnpm check`.
Intentional error examples must be corrected before final verification.
Markdown and its code fences are
outside Biome's configured file scope; check copied examples separately.

## Best practices

- Keep one change small enough to understand and check its expected result.
- Use project scripts so type checks remain part of the build workflow.
- Keep browser code in `src/` and optional Node-only scripts in `scripts/`.
- Use `pnpm typecheck` while developing. Run `pnpm check` and `pnpm build` before
  finishing source changes; the build includes application, configuration, and test type checks.
  Check affected interactions in a browser, including keyboard use.
- Rebuild before using preview to inspect the latest changes.
- Keep dependency upgrades separate from learning exercises.
- Fix source files rather than editing generated output or installed dependencies.

Follow [AGENTS.md](../../AGENTS.md) for contribution rules and
[change-specific verification](../../AGENTS.md#documentation-and-completion).
For prose-only edits, check relevant links, paths, and configuration consistency;
verify executable examples separately when they change.
