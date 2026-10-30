/** @jest-environment jsdom */
import { beforeEach, expect, jest, test } from '@jest/globals';
import { prepareApplication } from '@/app/prepare';

const mockStart = jest.fn<(options: unknown) => Promise<void>>();
jest.mock('msw/browser', () => ({ setupWorker: () => ({ start: mockStart }) }));

beforeEach(() => {
  mockStart.mockResolvedValue(undefined);
});

test('normal startup leaves network mocking disabled', async () => {
  await prepareApplication();
  expect(mockStart).not.toHaveBeenCalled();
});

test('opt-in startup awaits the worker under the application base', async () => {
  await prepareApplication(true);
  expect(mockStart).toHaveBeenCalledWith({
    serviceWorker: { url: '/lab/react/v2/mockServiceWorker.js' },
  });
});

test('worker startup failures reach the application startup boundary', async () => {
  mockStart.mockRejectedValue(new Error('Worker unavailable'));
  await expect(prepareApplication(true)).rejects.toThrow('Worker unavailable');
});
