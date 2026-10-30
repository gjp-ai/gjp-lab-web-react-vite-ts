# React Testing Library 16

## Contents

- [Introduction](#introduction)
- [Configuration in this project](#configuration-in-this-project)
- [Basic usage](#basic-usage)
- [Practical examples](#practical-examples)
- [Best practices](#best-practices)
- [Troubleshooting](#troubleshooting)
- [Official references](#official-references)

## Introduction

React Testing Library renders React components into a test document. Tests find
controls by their roles or labels, trigger events, and check the resulting output.
This helps test the component through the interface its users encounter.

**Existing setup:** `@testing-library/react` **16.3.3** and its DOM peer
`@testing-library/dom` **10.4.2** are installed development dependencies.
[Jest 30](jest.md) runs the tests; React Testing Library is not a separate runner.

## Configuration in this project

| File or dependency | Responsibility |
| --- | --- |
| [jest.config.js](../../jest.config.js) | Discover tests, transform JSX/TypeScript, and resolve `@/` imports |
| `jest-environment-jsdom` | Supply a simulated document/window for component suites |
| [tsconfig.test.json](../../tsconfig.test.json) | Check TypeScript test files with strict options |
| [appearance-provider.test.tsx](../../src/features/appearance/__tests__/appearance-provider.test.tsx) | Existing component behavior examples |

Existing component tests live beside their owner in `src/**/__tests__/` and use
`.test.tsx`. Optional tutorial exercises may also live under `tests/`. Put
`/** @jest-environment jsdom */` at the top of each DOM suite because the default
environment is Node. Import Jest functions explicitly from `@jest/globals`.

The project currently uses `fireEvent` and standard Jest matchers. `user-event` and
`jest-dom` are not installed. Examples here therefore do not use helpers such as
`userEvent.click` or matchers such as `toBeInTheDocument`.

## Basic usage

Run from the project root:

```sh
pnpm test src/features/appearance/__tests__/appearance-provider.test.tsx
pnpm test:watch
pnpm test:coverage
```

The existing suite renders the real AppearanceProvider with a small consumer. It
checks saved preferences, user-triggered changes, unavailable storage, and
cross-tab synchronization. Storage and document state are reset between tests.
The [application suite](../../src/app/__tests__/application.test.tsx) also exercises real
routes, sidebar/drawer controls, and appearance dialog changes. These jsdom tests
do not verify physical layout or complete browser keyboard interaction.

| API | Use |
| --- | --- |
| `render` | Mount the component, including any required providers |
| `screen.getByRole` | Find a currently available control by role and accessible name |
| `screen.getByLabelText` | Find an element through its associated label |
| `screen.queryByRole` | Check absence; returns `null` when there is no match |
| `screen.findByRole` | Await an element that appears asynchronously |
| `fireEvent` | Dispatch a specific DOM event for the component to handle |
| `cleanup` | Unmount rendered trees; the project also calls it explicitly after each test |

Prefer roles and accessible names before implementation selectors or test IDs.
Use `getBy*` when the element should already exist, `queryBy*` for absence, and
`await findBy*` for an element expected to appear later. Single-element queries
report multiple matches; scope a query when several controls share a name.

## Practical examples

### Add a small interaction test

**Optional exercise:** create `tests/counter-example.test.tsx` with this complete
file. The counter is local to the test and does not add a Home feature.

```tsx
/** @jest-environment jsdom */
import { afterEach, expect, test } from '@jest/globals';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';

function CounterExample() {
  const [count, setCount] = useState(0);
  return (
    <button type="button" onClick={() => setCount((value) => value + 1)}>
      Count: {count}
    </button>
  );
}

afterEach(cleanup);

test('clicking the counter updates its visible label', () => {
  render(<CounterExample />);
  fireEvent.click(screen.getByRole('button', { name: 'Count: 0' }));
  expect(screen.getByRole('button', { name: 'Count: 1' }).textContent).toBe('Count: 1');
});
```

Run `pnpm test tests/counter-example.test.tsx`. The test renders a component,
locates its button as a user-facing control, dispatches a click, and checks the
updated label. Remove the exercise file when finished.

### Test a component that uses a provider

Use [appearance-provider.test.tsx](../../src/features/appearance/__tests__/appearance-provider.test.tsx) as the
existing example. Wrap a consumer in `AppearanceProvider`; rendering a consumer
alone intentionally fails because the context is missing. Select preferences
through an accessible output and trigger the consumer's button. Assert the new
visible value, the root theme attributes, and the stored preference.

The suite supplies a minimal `matchMedia` boundary and tests storage failure with
a restored spy. Keep these changes local to suites that need them rather than
adding a global mock for every browser API.

## Best practices

- Test outcomes users can observe; avoid assertions about hook internals or component state.
- Render the providers a component actually needs. Keep simple test consumers local.
- Await asynchronous queries and updates; avoid arbitrary delays.
- Unmount components and reset storage, spies, and changed globals between tests.
- Use `fireEvent` for focused event checks. A dispatched click does not reproduce
  a complete pointer or keyboard interaction sequence.
- Use a real browser for CSS layout, responsive wrapping, actual focus movement,
  and keyboard navigation. jsdom does not perform visual layout.
- Run `pnpm typecheck` as well: successful Jest transformation does not verify types.

## Troubleshooting

| Symptom | First check |
| --- | --- |
| Missing `document` or `window` | Check the jsdom comment at the start of the test file |
| Provider-required error | Wrap the consumer in the corresponding real provider |
| Button cannot be found | Inspect its role and accessible name; use `screen.debug()` while investigating |
| Matcher is unavailable | Use standard Jest assertions; `jest-dom` is not installed |
| Missing media-query API | Mock the boundary locally when the behavior requires it |
| Expected element appears later | Await `findByRole` instead of making an immediate `getByRole` assertion |
| Test result depends on execution order | Clean up DOM and external state; restore changed mocks |

## Official references

- [Introduction](https://testing-library.com/docs/react-testing-library/intro/)
- [Setup](https://testing-library.com/docs/react-testing-library/setup/)
- [React API](https://testing-library.com/docs/react-testing-library/api/)
- [Queries and query priority](https://testing-library.com/docs/queries/about/)
- [Firing events](https://testing-library.com/docs/dom-testing-library/api-events/)
