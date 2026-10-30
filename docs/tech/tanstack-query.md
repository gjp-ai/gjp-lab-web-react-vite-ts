# TanStack Query v5: server state

**Status:** Installed; QueryClientProvider is wired into AppProviders. Package:
`@tanstack/react-query` **5.105.0** (2026-10-30).

## Introduction

Use Query for data fetched from an API: caching, request lifecycle, stale data,
refetching, and mutations. It complements React State/Zustand; server results should
not be copied into a client store just to share them between components.
TanStack Router remains responsible for navigation. Query does not create routes
or provide a backend.

## Installed configuration

```sh
pnpm add -E @tanstack/react-query@5.105.0
```

**Existing source:** [query-client.ts](../../src/app/query-client.ts).

```ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30_000, retry: 1 } },
});
```

This is the configured application policy, not Query's defaults. Freshness duration
and retries should match each endpoint's behavior. The [Ky example](ky.md) disables
its own retries so two layers do not multiply attempts.

Create one stable client for the browser app. [AppProviders](../../src/app/providers.tsx) wraps the existing router with
QueryClientProvider, AppearanceProvider, and I18nextProvider under StrictMode:

```tsx
<QueryClientProvider client={queryClient}>
  <AppearanceProvider>
    <RouterProvider router={router} />
  </AppearanceProvider>
</QueryClientProvider>
```

This is a composition excerpt; import QueryClientProvider from
`@tanstack/react-query` and the existing providers/router from their current modules.
Do not construct a new QueryClient inside an ordinary component render.

## Feature query

After creating the API module in the [Ky guide](ky.md), add the future file
`src/features/projects/api/project-queries.ts`:

```ts
import { queryOptions, useQuery } from '@tanstack/react-query';
import { getProjects } from './projects';

export const projectQueries = {
  all: () =>
    queryOptions({
      queryKey: ['projects'],
      queryFn: ({ signal }) => getProjects(signal),
    }),
};

export function useProjects() {
  return useQuery(projectQueries.all());
}
```

Include every request-changing filter/ID in its key when extending this example.
Render pending, error, empty, and successful states. A background refresh can occur
while existing data remains visible; avoid replacing that data with a loading screen.

For writes, use a mutation and invalidate the affected keys after success. The
invalidation call below is an excerpt using a QueryClient obtained through
`useQueryClient()` in a component or hook:

```ts
await queryClient.invalidateQueries({ queryKey: ['projects'] });
```

Decide mutation retries separately; a failed write may already have changed the server.

## Testing and practices

- Give each test a fresh QueryClient and disable retries for deterministic failure checks.
- Use MSW to test transport behavior instead of replacing the Query hook with fake data.
- Clear clients between tests; preserve cancellation by forwarding the supplied signal.
- Treat `staleTime` as freshness and `gcTime` as inactive cache retention; they differ.
- Keep query definitions/API functions inside their feature and the provider in `app`.
- Preserve the existing coverage threshold when integrating a real server-backed feature.

## Official references

- [v5 overview](https://tanstack.com/query/v5/docs/framework/react/overview)
- [Query defaults](https://tanstack.com/query/latest/docs/framework/react/guides/important-defaults)
- [Query keys](https://tanstack.com/query/latest/docs/framework/react/guides/query-keys)
- [Testing](https://tanstack.com/query/latest/docs/framework/react/guides/testing)
