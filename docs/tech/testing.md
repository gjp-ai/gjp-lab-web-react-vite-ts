# Jest and React Testing Library

## Detailed guides

- [Jest 30: unit testing and code coverage](jest.md) — configuration, unit test examples, reports, and troubleshooting.
- [React Testing Library 16](react-testing-library.md) — component setup, accessible queries, interaction examples, and cleanup.

## Project configuration

Jest 30 is the installed unit test runner and coverage tool. React Testing Library
16 renders React components and queries their output in Jest's jsdom environment.
These are existing development tools; no browser server is required to run tests.
See [Testing code design](../implement/testing.md) for the configuration and files.

## Everyday commands

From the project root:

```sh
pnpm install --frozen-lockfile
pnpm test
pnpm test src/features/navigation/__tests__/menu.test.js
pnpm test:watch
pnpm test:coverage
```

`test` runs once. `test:watch` reruns tests during development; press `a` to run all
or `q` to quit. `test:coverage` also generates `coverage/index.html` and
`coverage/lcov.info`. Open the HTML file locally to inspect covered and uncovered
lines. The full suite must reach 90% for each global metric: statements, branches,
functions, and lines. A missed threshold fails the coverage command. Reports include untested source, so a passing test run does not mean the
whole application is tested. Do not commit generated reports.

## Adding a test

For pure logic, follow [menu.test.js](../../src/features/navigation/__tests__/menu.test.js). Import `test` and
`expect` (or Node assertions) explicitly; use a filename ending in `.test.js` or
`.test.ts` in the owning feature's `__tests__/` directory. Optional learning
exercises may also use `tests/`.

For components, follow
[appearance-provider.test.tsx](../../src/features/appearance/__tests__/appearance-provider.test.tsx): add the
`@jest-environment jsdom` comment, render the component with required providers,
find controls by role/name, trigger an interaction, and check its visible result.
Test storage, media queries, or other external boundaries only when relevant.
Clean up rendered components and restore mocked APIs after each test.

Babel removes TypeScript syntax during tests; it does not typecheck it. Run
`pnpm check` and `pnpm build` as well. Real browser checks are still needed for
layout, CSS themes, focus movement, and responsive behavior.

References: [Jest getting started](https://jestjs.io/docs/getting-started),
[React Testing Library introduction](https://testing-library.com/docs/react-testing-library/intro/).
