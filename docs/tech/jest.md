# Jest 30: unit testing and code coverage

## Contents

- [Introduction](#introduction)
- [Configuration in this project](#configuration-in-this-project)
- [Basic usage](#basic-usage)
- [Practical examples](#practical-examples)
- [Reading coverage](#reading-coverage)
- [Best practices](#best-practices)
- [Troubleshooting](#troubleshooting)
- [Official references](#official-references)

## Introduction

Jest runs tests, reports failed assertions, and measures which source code executes
during a test run. This project uses **Jest 30.5.2** for unit tests and coverage.
[React Testing Library 16](react-testing-library.md) uses the same runner for
component tests.

| Tool | Responsibility here |
| --- | --- |
| Jest | Discover tests, run assertions, isolate suites, and collect coverage |
| React Testing Library | Render components and interact with their DOM |
| TypeScript | Check types; Jest's Babel transform only removes type annotations |
| Biome | Check lint, formatting, and import organization |

All testing packages are existing development dependencies in
[package.json](../../package.json). Use Node.js 24+ and pnpm 12+; no global Jest
installation or running Vite server is needed.

## Configuration in this project

Read [jest.config.js](../../jest.config.js) before changing test behavior.

| Setting | Current behavior |
| --- | --- |
| `testMatch` | Discover `.test.js`, `.test.ts`, and `.test.tsx` in `src/**/__tests__/` and `tests/` |
| `testEnvironment` | Node by default; component suites explicitly select jsdom |
| `moduleNameMapper` | Resolve `@/` imports to `src/` |
| `transform` | `babel-jest` compiles JS, JSX, and TypeScript for the current Node runtime |
| `clearMocks` | Clear recorded mock calls between tests; implementations still need restoring when changed |
| `coverageProvider` | V8 collects execution data without inserting counters in serialized functions |
| `collectCoverageFrom` | Include production TypeScript/TSX in `src/` and `build/`; exclude colocated tests |
| `coverageThreshold` | Require at least 90% globally for statements, branches, functions, and lines |
| `coverageReporters` | Terminal summary, HTML, and LCOV |

The transform is configured inside Jest with external Babel configuration disabled.
It does not change Vite's Oxc transformation or Rolldown bundling. The V8 provider
also preserves the functions serialized by the appearance startup script.
See [Testing code design](../implement/testing.md) for that implementation detail.

`pnpm typecheck` includes [tsconfig.test.json](../../tsconfig.test.json), so typed
tests are checked alongside application and Vite configuration source. JavaScript
tests remain JavaScript and are not typechecked by that project.

## Basic usage

Run these commands from the project root:

```sh
pnpm install --frozen-lockfile
pnpm test
```

A successful run reports passing suites and tests. A failing run names the test,
shows the assertion difference or error, and exits unsuccessfully.

| Command | Use |
| --- | --- |
| `pnpm test` | Run all tests once, serially |
| `pnpm test src/features/navigation/__tests__/menu.test.js` | Run the existing menu suite |
| `pnpm test --testNamePattern='explicit mode'` | Run tests with matching names |
| `pnpm test:watch` | Watch all tests and rerun after changes; works without Git |
| `pnpm test:coverage` | Run all tests and generate coverage reports |

In watch mode, press `a` to run all tests or `q` to quit. `pnpm build` checks types
and builds the application; it does not run Jest or Biome automatically.

## Practical examples

### Read an existing test

[menu.test.js](../../src/features/navigation/__tests__/menu.test.js) checks valid configuration, nested groups,
active ancestors, and rejection of invalid entries. It imports `test` explicitly
from `@jest/globals` and keeps Node assertions. Migrating to Jest did not require
rewriting those assertions.

[appearance.test.js](../../src/features/appearance/__tests__/appearance.test.js) checks parsing, stored-value
fallbacks, the startup script, and contrast across modes and accents.

### Add a small typed unit test

**Optional exercise:** create `tests/mode-example.test.ts` with this complete file.
It tests an existing function; no application change is needed.

```ts
import { expect, test } from '@jest/globals';
import { resolveMode } from '@/features/appearance/model/appearance';

test('explicit light mode overrides a dark system preference', () => {
  expect(resolveMode('light', true)).toBe('light');
});

test('system mode follows the operating system preference', () => {
  expect(resolveMode('system', true)).toBe('dark');
  expect(resolveMode('system', false)).toBe('light');
});
```

Run it with `pnpm test tests/mode-example.test.ts`. `toBe` compares primitive values;
use `toEqual` for object contents and `toThrow` when checking a rejected operation.
Use a function callback when asserting that an operation throws.
Remove the exercise file when finished; equivalent behavior is already covered by
the existing appearance suite.

## Reading coverage

After `pnpm test:coverage`, use these generated files:

| Output | Purpose |
| --- | --- |
| `coverage/index.html` | Open locally to browse files and highlighted uncovered lines |
| `coverage/lcov.info` | Machine-readable report for tools that accept LCOV |
| Terminal table | Per-file and total execution percentages |

| Metric | What it measures |
| --- | --- |
| Statements | Executed statements |
| Branches | Executed alternatives, such as both outcomes of a conditional |
| Functions | Called functions |
| Lines | Executed source lines |

Read uncovered paths and decide which behavior needs a test. A passing suite can
still leave whole components untested. A high percentage does not prove that
assertions catch meaningful mistakes, that every input is handled, or that browser
layout works. Do not compare percentages from different coverage providers as if
they measured source identically.

The full suite must meet **90% globally in each of the four metrics**.
`pnpm test:coverage` exits unsuccessfully if a threshold is missed, even when all
tests pass. This is an aggregate unit/component target; individual files may have
lower coverage. `coverage/` is excluded from version control and Biome. Run the
full suite for the coverage gate. Limiting coverage execution to one test file
will leave more code uncovered; use `pnpm test <file>` for focused development.

## Best practices

- Name tests after observable behavior and check both accepted and rejected inputs.
- Keep pure unit tests in Node; use jsdom only for code that needs a document.
- Import Jest APIs explicitly from `@jest/globals`.
- Restore spies, changed globals, and other external state after tests that modify them.
- Await asynchronous work so Jest can observe failures before the test finishes.
- Keep assertions focused on outcomes rather than private implementation details.
- Run affected tests, `pnpm check`, and `pnpm build` before completing source changes.

## Troubleshooting

| Symptom | First check |
| --- | --- |
| No tests found | File must be under `src/**/__tests__/` or `tests/` and end in `.test.js`, `.test.ts`, or `.test.tsx` |
| `document is not defined` | A DOM suite needs the jsdom environment comment; see the component guide |
| `@/` import cannot resolve | Check the file and Jest's mapper, then compare TypeScript/Vite aliases |
| Tests pass but TypeScript fails | Babel strips syntax; fix the error reported by `pnpm typecheck` |
| Unexpected coverage bootstrap error | Preserve the V8 provider; the startup script serializes shared functions |
| Changed mock behavior leaks | `clearMocks` clears call history, not implementations; restore spies after use |

## Official references

- [Getting started](https://jestjs.io/docs/30.0/getting-started)
- [Matchers](https://jestjs.io/docs/30.0/using-matchers)
- [Setup and teardown](https://jestjs.io/docs/30.0/setup-teardown)
- [Configuration and coverage options](https://jestjs.io/docs/30.0/configuration)
- [Command-line options](https://jestjs.io/docs/30.0/cli)
