# Ky v2: HTTP client

**Status:** Installed with a shared HTTP client. Package: `ky`
**2.2.0** (2026-10-30). The project currently has no API-backed feature or backend.

## Responsibility

Ky handles HTTP transport. Features own endpoint functions and response validation;
[TanStack Query](tanstack-query.md) handles request state and caching.
[MSW](msw.md) intercepts requests for development/testing.

```text
Feature component → Query hook → feature API function → shared Ky client → HTTP
```

## Installed configuration

```sh
pnpm add -E ky@2.2.0
```

**Existing source:** [http.ts](../../src/shared/api/http.ts).

```ts
import ky from 'ky';

// API paths are independent of the SPA hosting prefix. No backend is supplied by this app.
export const api = ky.create({ baseUrl: '/api/', timeout: 10_000, retry: 0 });
```

`/api/` is an illustrative same-origin API contract, independent of the SPA's
`/lab/react/v2/` asset/router base. It does not create a backend or host rewrite.
Set the real endpoint explicitly when implementing an API feature. Node-side
requests need an absolute API base; browser-relative resolution is not available there.

Ky v2 uses **`baseUrl`**, not older `prefixUrl` examples. With this base,
`api.get('projects')` addresses `/api/projects`; `api.get('/projects')` instead
addresses the origin's `/projects`. Keep the trailing slash on the base.
The example disables Ky retries so Query can own retry policy for queries.

## Feature API and validation

**Future example:** `src/features/projects/api/projects.ts`.

```ts
import { api } from '@/shared/api/http';

export type Project = { readonly id: string; readonly name: string };

function isProject(value: unknown): value is Project {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    typeof value.id === 'string' &&
    'name' in value &&
    typeof value.name === 'string'
  );
}

export async function getProjects(signal: AbortSignal): Promise<Project[]> {
  const data: unknown = await api.get('projects', { signal }).json();
  if (!Array.isArray(data) || !data.every(isProject)) {
    throw new Error('Invalid projects response');
  }
  return data;
}
```

Pass Query's signal to preserve cancellation. A `.json<Project[]>()` annotation
would describe a type without validating the response. Let transport and validation
errors reach Query; do not turn a failed request into a successful empty list.

## Verification and practices

The [HTTP suite](../../src/shared/api/__tests__/http.test.ts) uses actual Ky and
MSW requests to verify Query caching/invalidation, HTTP failures, and cancellation.
Future feature API validators should also test malformed data.
Use an absolute test URL when testing under Node. Keep credentials and headers
explicit; browser-visible environment values are public. Do not add token storage
or refresh flows until the application has an authentication requirement.

## Official references

- [Ky v2.2.0 documentation](https://github.com/sindresorhus/ky/blob/v2.2.0/readme.md)
- [Ky releases and v2 changes](https://github.com/sindresorhus/ky/releases)
