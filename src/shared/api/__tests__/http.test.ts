import { afterAll, afterEach, beforeAll, expect, test } from '@jest/globals';
import { QueryClient } from '@tanstack/react-query';
import { HttpResponse, http } from 'msw/http';
import { api } from '@/shared/api/http';
import { server } from '../../../../tests/support/mock-server';

beforeAll(() => server.listen({ onUnhandledFrame: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const client = api.extend({ baseUrl: 'https://gjp-lab.test/api/' });

test('Query executes real Ky requests intercepted by MSW and caches fresh data', async () => {
  let requests = 0;
  server.use(
    http.get('https://gjp-lab.test/api/example', () => {
      requests++;
      return HttpResponse.json({ name: 'GJP Lab' });
    }),
  );
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, staleTime: 30_000 } },
  });
  const options = {
    queryKey: ['example'],
    queryFn: ({ signal }: { signal: AbortSignal }) => client.get('example', { signal }).json(),
  };
  try {
    expect(await queryClient.fetchQuery(options)).toEqual({ name: 'GJP Lab' });
    expect(await queryClient.fetchQuery(options)).toEqual({ name: 'GJP Lab' });
    expect(requests).toBe(1);
    await queryClient.invalidateQueries({ queryKey: ['example'] });
    await queryClient.fetchQuery(options);
    expect(requests).toBe(2);
  } finally {
    queryClient.clear();
  }
});

test('HTTP failures reject rather than returning successful empty data', async () => {
  server.use(
    http.get('https://gjp-lab.test/api/example', () => new HttpResponse(null, { status: 503 })),
  );
  await expect(client.get('example')).rejects.toThrow('503');
});

test('canceled requests reject with the abort reason', async () => {
  const controller = new AbortController();
  controller.abort();
  await expect(client.get('example', { signal: controller.signal })).rejects.toMatchObject({
    name: 'AbortError',
  });
});
