# Client state: React State + Zustand

**Status:** Installed and integrated. Zustand **5.0.16** backs appearance state;
React state still owns local UI state. Updated: 2026-10-30.

## Introduction

Keep state with the component that owns it. Use React `useState` or `useReducer`
for local interaction; introduce Zustand for client state shared across distant
components. [TanStack Query](tanstack-query.md) owns fetched server data.

| State | Owner |
| --- | --- |
| A dialog's open flag or a draft field | Local React state |
| Appearance preferences | A scoped Zustand store composed by AppearanceProvider/context |
| Feature-wide filters or selection used by several consumers | A feature-owned Zustand store when local state is insufficient |
| Cross-feature workflow state | An app-owned store composed through props/context |
| API results, loading, errors, and cached records | TanStack Query, not a second copy in Zustand |

Selecting Zustand does not require rewriting the existing provider or putting
every state value in a store. Keep the feature dependency boundaries in
[Architecture](../implement/architecture.md).

## Installed configuration

Reviewed package: `zustand` **5.0.16**. React 19 is compatible with its React peer.
The exact application dependency is recorded in package.json. To reproduce it:

```sh
pnpm add -E zustand@5.0.16
```

Place feature stores in `src/features/<name>/model/`. A store shared by multiple
features belongs to application composition; features should receive its state or
actions through explicit inputs rather than importing `src/app`.

The [appearance store](../../src/features/appearance/model/appearance-store.ts)
uses `createStore` from `zustand/vanilla`. AppearanceProvider creates it once per
provider and subscribes with `useStore`. Persistence, cross-tab changes, and root
theme synchronization remain in the provider. Tests get isolated store instances.

## Example store

**Future example:** `src/features/projects/model/project-filters.ts`.
The Projects feature is illustrative and does not currently exist.

```ts
import { create } from 'zustand';

type ProjectFilters = {
  readonly query: string;
  readonly setQuery: (query: string) => void;
  readonly reset: () => void;
};

export const useProjectFilters = create<ProjectFilters>()((set) => ({
  query: '',
  setQuery: (query) => set({ query }),
  reset: () => set({ query: '' }),
}));
```

Inside a future feature component, select only the values it needs:

```tsx
const query = useProjectFilters((state) => state.query);
const setQuery = useProjectFilters((state) => state.setQuery);
```

These two lines are a component excerpt, not a complete module. Import the store
from the feature's model. Prefer narrow selectors; avoid returning a new object
from a selector without handling its equality behavior.

## Testing and practices

- Test actions through `useProjectFilters.getState()` and reset state between cases.
- Use React Testing Library for components consuming the store.
- Update objects/arrays immutably. Derive filtered lists instead of storing them twice.
- Add persistence only for an explicit requirement; validate restored values.
- Keep server responses in Query and URL-worthy filters in the router when appropriate.
- After integration, run tests, coverage, lint, and build; maintain the global 90% gate.

## Official references

- [Zustand introduction](https://zustand.docs.pmnd.rs/learn/getting-started/introduction.html)
- [Zustand testing](https://zustand.docs.pmnd.rs/learn/guides/testing.html)
- [React state](https://react.dev/learn/managing-state)
