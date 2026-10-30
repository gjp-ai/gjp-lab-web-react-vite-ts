# MSW v3: API mocking

**Status:** Installed; real Node interception tests and opt-in browser setup. Package: `msw`
**3.0.3** (2026-10-30). No mock endpoint currently exists in the application.

## Responsibility and compatibility

Mock Service Worker intercepts network requests, allowing the real HTTP client
and query logic to run against controlled responses. Feature-owned handlers can
be shared between development and tests.

MSW v3 is **ESM-only** and provides granular imports such as `msw/http`.
The Jest transform emits CommonJS and explicitly transforms MSW/Ky and the ESM
runtime dependencies they load, including `.mjs` files. The test transform also
resolves dependency `import.meta.url` values so MSW's WASM file can be found.
Actual Node interception is verified in the HTTP suite. Browser worker startup is
covered at its adapter boundary; full browser registration still needs a browser check.

## Files and ownership

| Path | Ownership |
| --- | --- |
| `src/features/projects/api/project-handlers.ts` | Feature-specific API behavior and fixtures |
| `src/app/mocks/browser.ts` | Compose handlers and start browser interception |
| `tests/support/mock-server.ts` | Compose the same handlers for Node test interception |
| `public/mockServiceWorker.js` | Generated worker, managed with MSW's CLI |

Browser and Node setup files and the generated worker exist. The Projects handler
is a future feature example; the application currently composes no default handlers.

## Handler example

MSW is installed as a development dependency. Reproduce the installation with:

```sh
pnpm add -D -E msw@3.0.3
```

**Future example:** `src/features/projects/api/project-handlers.ts`.

```ts
import { HttpResponse, http } from 'msw/http';

export const projectHandlers = [
  http.get('*/api/projects', () => HttpResponse.json([{ id: 'project-1', name: 'GJP Lab' }])),
];
```

`/api/projects` matches the illustrative contract from the [Ky guide](ky.md).
The wildcard origin makes this reusable with a browser origin and an absolute Node
test URL. Scope handlers to an explicit API origin when the application defines one.

## Browser setup

Generate the worker during implementation, then keep it aligned with the installed
MSW version:

```sh
pnpm exec msw init public --save
```

Current [browser.ts](../../src/app/mocks/browser.ts) calls `setupWorker()` without
handlers. When introducing the illustrative Projects feature, composition would be:

```ts
import { setupWorker } from 'msw/browser';
import { projectHandlers } from '@/features/projects/api/project-handlers';

export const worker = setupWorker(...projectHandlers);
```

[prepareApplication](../../src/app/prepare.ts) imports the browser module before
mounting React only when
`import.meta.env.DEV && import.meta.env.VITE_API_MOCKING === 'true'`. Await
`worker.start()` with the worker URL set to
`${import.meta.env.BASE_URL}mockServiceWorker.js`. Keep its default registration
scope under `/lab/react/v2/`; do not broaden it unnecessarily. Interception applies
to requests from controlled pages even if the API path is outside the SPA base.

The environment flag is public configuration. Production startup must never enable
the mock worker. A copied public worker file alone does not activate interception.
For development, decide explicitly which non-API asset requests should pass through.

## Node test setup

Current [mock-server.ts](../../tests/support/mock-server.ts) calls `setupServer()`
without default handlers. Individual HTTP tests add scenario-specific handlers.
A future feature handler list can be composed as follows:

```ts
import { setupServer } from 'msw/node';
import { projectHandlers } from '@/features/projects/api/project-handlers';

export const server = setupServer(...projectHandlers);
```

MSW v3 uses `onUnhandledFrame`, replacing the older `onUnhandledRequest` option.
Register lifecycle hooks in the relevant Jest setup: start with
`server.listen({ onUnhandledFrame: 'error' })`, reset overrides using
`server.resetHandlers()` after each test, and close using `server.close()` after
all tests. Node tests do not start a service worker. Use fresh QueryClients and
reset client state as appropriate.

Verify success, empty results, validation failures, HTTP errors, cancellation,
and pending UI. Override a handler per scenario, and keep fixtures free of real
credentials or personal data.

## Official references

- [MSW v3 announcement](https://mswjs.io/blog/introducing-msw-3.0)
- [v3 imports and migration](https://mswjs.io/docs/migrations/2.x-to-3.x/)
- [Browser integration](https://mswjs.io/docs/integrations/browser)
- [Node integration](https://mswjs.io/docs/integrations/node)
