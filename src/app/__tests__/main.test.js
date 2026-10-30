/** @jest-environment jsdom */
import { afterEach, beforeEach, expect, jest, test } from '@jest/globals';
import { waitFor } from '@testing-library/react';
import { StrictMode } from 'react';

const mockPrepare = jest.fn();
jest.mock('@/app/prepare', () => ({ prepareApplication: () => mockPrepare() }));
beforeEach(() => {
  mockPrepare.mockResolvedValue(undefined);
});

const render = jest.fn();
const mockCreateRoot = jest.fn(() => ({ render }));
jest.mock('react-dom/client', () => ({ createRoot: (...args) => mockCreateRoot(...args) }));

afterEach(() => {
  document.body.replaceChildren();
  jest.clearAllMocks();
});

test('startup fails explicitly when the application root is missing', () => {
  expect(() => jest.isolateModules(() => require('../../main.tsx'))).toThrow(
    'The application root element was not found.',
  );
  expect(mockCreateRoot).not.toHaveBeenCalled();
});

test('startup mounts the provider tree under StrictMode into the application root', async () => {
  const root = document.createElement('div');
  root.id = 'root';
  document.body.append(root);
  jest.isolateModules(() => require('../../main.tsx'));
  await waitFor(() => expect(render).toHaveBeenCalledTimes(1));
  expect(mockCreateRoot).toHaveBeenCalledWith(root);
  expect(render.mock.calls[0][0].type).toBe(StrictMode);
});

test('startup failure provides a readable recovery message', async () => {
  const error = new Error('Initialization failed');
  mockPrepare.mockRejectedValue(error);
  const report = jest.spyOn(console, 'error').mockImplementation(() => {});
  const root = document.createElement('div');
  root.id = 'root';
  document.body.append(root);
  try {
    jest.isolateModules(() => require('../../main.tsx'));
    await waitFor(() => expect(root.textContent).toContain('Please reload the page.'));
    expect(report).toHaveBeenCalledWith('Application initialization failed.', error);
    expect(mockCreateRoot).not.toHaveBeenCalled();
  } finally {
    report.mockRestore();
  }
});
