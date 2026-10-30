# Testing code design

## Configuration

| File | Responsibility |
| --- | --- |
| [jest.config.js](../../jest.config.js) | Test discovery, Node default environment, transforms, alias, and coverage |
| [tests/support/](../../tests/support/) | Browser boundary helpers, CSS import stub, and Vite base transform |
| [tsconfig.test.json](../../tsconfig.test.json) | Strict TypeScript checks for `.ts`/`.tsx` tests |
| [package.json](../../package.json) | Exact Jest 30 / React Testing Library 16 versions and commands |
| [pnpm-workspace.yaml](../../pnpm-workspace.yaml) | Explicitly skips native fallback install scripts; optional platform binaries supply the resolver/watcher |
| [biome.json](../../biome.json), [.gitignore](../../.gitignore) | Exclude generated coverage reports |

Jest discovers `src/**/__tests__/**/*.test.{js,ts,tsx}` beside their owning
features, shared modules, and app composition. It also accepts
`tests/**/*.test.{js,ts,tsx}` for optional exercises. Tests import APIs explicitly from
`@jest/globals`, keeping Jest globals out of application types. The module mapper
resolves `@/` to `src/`, matching TypeScript and Vite.

The inline `babel-jest` transform compiles JSX, strips TypeScript annotations, and
converts imports for Jest. It targets the current Node runtime. `babelrc: false`
and `configFile: false` keep this configuration isolated to tests. There is no
application Babel configuration and Vite still uses Oxc and Rolldown.
Babel does not check types: `pnpm typecheck` separately checks application, Vite,
and TypeScript tests. Existing JavaScript unit tests remain JavaScript.

The test-only `vite-base-transform.js` replaces `import.meta.env.BASE_URL` with
the base read from `vite.config.ts`. This lets Jest execute the real router under
its CommonJS transform. Supported test environment values also include DEV and VITE_API_MOCKING.
Dependency `import.meta.url` expressions resolve to source file URLs for MSW WASM. CSS imports map to an empty module because
jsdom does not render styles. Neither helper changes application builds.

## Environments and test boundaries

| Suite | Environment | Behavior covered |
| --- | --- | --- |
| [menu.test.js](../../src/features/navigation/__tests__/menu.test.js) | Node | Recursive schema validation, invalid routes, IDs, icons, and active groups |
| [appearance.test.js](../../src/features/appearance/__tests__/appearance.test.js) | Node | Preference parsing, bootstrap execution, storage fallback, and palette contrast |
| [appearance-provider.test.tsx](../../src/features/appearance/__tests__/appearance-provider.test.tsx) | jsdom | Saved preferences, user updates, unavailable APIs, media-query changes, cleanup, and cross-tab synchronization |
| [application.test.tsx](../../src/app/__tests__/application.test.tsx) | jsdom | Real Home/About routes, history, not-found recovery, sidebar/drawer behavior, appearance dialog controls, and initial-load focus |
| [menu-navigation.test.tsx](../../src/features/navigation/__tests__/menu-navigation.test.tsx) | jsdom | Recursive groups, active links, collapsed access, and modified-click handling |
| [ui.test.tsx](../../src/shared/__tests__/ui.test.tsx) | jsdom | Owned Button behavior, Card composition, and class conflict merging |
| [prepare.test.ts](../../src/app/__tests__/prepare.test.ts) | jsdom | Default no-mock startup, opt-in worker URL, and startup failure |
| [http.test.ts](../../src/shared/api/__tests__/http.test.ts) | Node | Real Ky/MSW requests, Query caching/invalidation, HTTP errors, and abort |
| [main.test.js](../../src/app/__tests__/main.test.js) | jsdom | Missing-root error and mounting the StrictMode/provider tree |

The component suite opts into jsdom through its environment comment. React Testing
Library renders the real provider with a small consumer containing an accessible
output and button. Assertions inspect rendered preferences, document attributes,
and persisted data. `fireEvent` exercises click and storage events. The suite mocks
only the media-query boundary, clears storage before each test, and cleans up the
rendered tree and mocks afterward. It does not verify the appearance dialog or
physical browser layout. The application suite separately exercises the real
appearance dialog and uses a fresh memory-history router for each test while
reusing the production route tree. The startup suite stubs only the React root
mount boundary so it can inspect mounting and the missing-root error.

The former Node-runner suites now use Jest without changing their assertions.
Their fixtures resolve from the project root, where package commands run.

## Coverage

`pnpm test:coverage` runs all suites with Jest's `v8` provider. V8 observes execution
without inserting counters inside functions. This matters because
[appearance-head.ts](../../build/appearance-head.ts) serializes shared functions
with `toString()` and executes them in a separate browser context; injected
coverage-counter references would break that script.

`collectCoverageFrom` includes production `.ts`/`.tsx` files under `src/` and `build/`,
including files no test imports, but excluding colocated `__tests__` directories. Reports therefore show the untested application areas.
Global minimums of **90% for statements, branches, functions, and lines** are
enforced during `pnpm test:coverage`. All source remains included; no production file
exclusions or coverage-ignore comments were added to reach the target. Thresholds
apply to the aggregate unit/component run, not to each individual file. A focused
coverage run may fail those global minimums; use ordinary `pnpm test <file>` for
focused development and the full coverage command for the gate.

Reports are generated as terminal text,
`coverage/index.html`, and `coverage/lcov.info`; they are ignored by source control
and linting. Coverage measures execution, not visual quality or complete behavior.

## Commands and extension

```sh
pnpm test
pnpm test src/features/navigation/__tests__/menu.test.js
pnpm test:watch
pnpm test:coverage
pnpm check
pnpm build
```

`test:watch` uses `--watchAll`, which also works in a folder without Git metadata.
Build checks types but does not run Jest. Add behavior tests when changing state,
validation, or interaction. Use `.test.tsx` and the jsdom environment comment for
React components. Query controls by accessible role/name and assert observable
results. Keep Node-only tests in the default environment. No global DOM setup is
needed for the current suites.

References: [Jest configuration](https://jestjs.io/docs/configuration),
[Jest TypeScript setup](https://jestjs.io/docs/getting-started#using-typescript),
and [React Testing Library setup](https://testing-library.com/docs/react-testing-library/setup/).

Feature ownership and test locations are described in [Architecture](architecture.md).

ESM-only MSW/Ky and their required runtime dependencies are selectively transformed,
including `.mjs`; see [Stack integration](stack.md).
