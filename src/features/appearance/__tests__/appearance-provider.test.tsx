/** @jest-environment jsdom */
import { afterEach, beforeEach, expect, jest, test } from '@jest/globals';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import {
  AppearanceProvider,
  useAppearance,
} from '@/features/appearance/components/appearance-provider';
import { appearanceKey } from '@/features/appearance/model/appearance';

function Preferences() {
  const { appearance, update } = useAppearance();
  return (
    <>
      <output aria-label="Current preferences">
        {appearance.mode}/{appearance.accent}
      </output>
      <button type="button" onClick={() => update({ mode: 'dark', accent: 'rose' })}>
        Use dark rose
      </button>
    </>
  );
}

beforeEach(() => {
  localStorage.clear();
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    value: () => ({ matches: false, addEventListener() {}, removeEventListener() {} }),
  });
});
afterEach(() => {
  cleanup();
  jest.restoreAllMocks();
  document.documentElement.removeAttribute('data-mode');
  document.documentElement.removeAttribute('data-accent');
  document.documentElement.style.colorScheme = '';
});

test('loads saved preferences and applies the theme to the document', () => {
  localStorage.setItem(appearanceKey, JSON.stringify({ mode: 'dark', accent: 'blue' }));
  render(
    <AppearanceProvider>
      <Preferences />
    </AppearanceProvider>,
  );
  expect(screen.getByLabelText('Current preferences').textContent).toBe('dark/blue');
  expect(document.documentElement.dataset.mode).toBe('dark');
  expect(document.documentElement.dataset.accent).toBe('blue');
});

test('a user action updates the visible preference, document, and persisted value', () => {
  render(
    <AppearanceProvider>
      <Preferences />
    </AppearanceProvider>,
  );
  expect(screen.getByLabelText('Current preferences').textContent).toBe('light/mint');
  fireEvent.click(screen.getByRole('button', { name: 'Use dark rose' }));
  expect(screen.getByLabelText('Current preferences').textContent).toBe('dark/rose');
  expect(document.documentElement.style.colorScheme).toBe('dark');
  expect(document.documentElement.dataset.accent).toBe('rose');
  expect(JSON.parse(localStorage.getItem(appearanceKey) ?? 'null')).toEqual({
    mode: 'dark',
    accent: 'rose',
  });
});

test('still applies changes when persistence is blocked', () => {
  jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
    throw new Error('denied');
  });
  render(
    <AppearanceProvider>
      <Preferences />
    </AppearanceProvider>,
  );
  fireEvent.click(screen.getByRole('button', { name: 'Use dark rose' }));
  expect(screen.getByLabelText('Current preferences').textContent).toBe('dark/rose');
  expect(document.documentElement.dataset.mode).toBe('dark');
});

test('syncs preferences from another tab and resets after storage is cleared', () => {
  render(
    <AppearanceProvider>
      <Preferences />
    </AppearanceProvider>,
  );
  fireEvent(
    window,
    new StorageEvent('storage', {
      key: appearanceKey,
      newValue: JSON.stringify({ mode: 'light', accent: 'violet' }),
      storageArea: localStorage,
    }),
  );
  expect(screen.getByLabelText('Current preferences').textContent).toBe('light/violet');
  fireEvent(window, new StorageEvent('storage', { key: null, storageArea: localStorage }));
  expect(screen.getByLabelText('Current preferences').textContent).toBe('light/mint');
});

test('legacy system preferences use light without subscribing to device appearance', () => {
  localStorage.setItem(appearanceKey, JSON.stringify({ mode: 'system', accent: 'rose' }));
  const media = jest.fn(() => ({ matches: true }));
  Object.defineProperty(window, 'matchMedia', { configurable: true, value: media });
  render(
    <AppearanceProvider>
      <Preferences />
    </AppearanceProvider>,
  );
  expect(screen.getByLabelText('Current preferences').textContent).toBe('light/rose');
  expect(document.documentElement.dataset.mode).toBe('light');
  expect(media).not.toHaveBeenCalled();
});

test('unavailable storage and media APIs fall back to a usable local light theme', () => {
  jest.spyOn(window, 'localStorage', 'get').mockImplementation(() => {
    throw Error('denied');
  });
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    value: () => {
      throw Error('unsupported');
    },
  });
  render(
    <AppearanceProvider>
      <Preferences />
    </AppearanceProvider>,
  );
  expect(screen.getByLabelText('Current preferences').textContent).toBe('light/mint');
  expect(document.documentElement.dataset.mode).toBe('light');
  fireEvent(window, new StorageEvent('storage', { key: appearanceKey, newValue: '{}' }));
  fireEvent.click(screen.getByRole('button', { name: 'Use dark rose' }));
  expect(document.documentElement.dataset.mode).toBe('dark');
});

test('unrelated storage events do not override the current appearance', () => {
  render(
    <AppearanceProvider>
      <Preferences />
    </AppearanceProvider>,
  );
  fireEvent(
    window,
    new StorageEvent('storage', {
      key: appearanceKey,
      newValue: '{"mode":"dark"}',
      storageArea: sessionStorage,
    }),
  );
  fireEvent(
    window,
    new StorageEvent('storage', {
      key: 'another-setting',
      newValue: '{"mode":"dark"}',
      storageArea: localStorage,
    }),
  );
  expect(screen.getByLabelText('Current preferences').textContent).toBe('light/mint');
});
