/** @jest-environment jsdom */
import { afterEach, beforeEach, expect, jest, test } from '@jest/globals';
import { createMemoryHistory, createRouter, RouterProvider } from '@tanstack/react-router';
import { act, cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { AppProviders } from '@/app/providers';
import { router as applicationRouter } from '@/app/router';
import { appearanceKey } from '@/features/appearance/model/appearance';
import { i18n } from '@/shared/i18n/i18n';
import { browserEnvironment } from '../../../tests/support/browser';

let browser: ReturnType<typeof browserEnvironment>;
beforeEach(async () => {
  await i18n.changeLanguage('en');
  localStorage.clear();
  browser = browserEnvironment();
});
afterEach(() => {
  cleanup();
  browser.restore();
  jest.restoreAllMocks();
});
async function open(path = '/') {
  const history = createMemoryHistory({ initialEntries: [`/lab/react/v2${path}`] });
  const router = createRouter({
    routeTree: applicationRouter.routeTree,
    basepath: applicationRouter.options.basepath ?? '/',
    scrollRestoration: true,
    history,
  });
  await router.load();
  render(
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>,
  );
  return history;
}

test('initial route loading leaves focus outside the main content', async () => {
  const router = createRouter({
    routeTree: applicationRouter.routeTree,
    basepath: applicationRouter.options.basepath ?? '/',
    history: createMemoryHistory({ initialEntries: ['/lab/react/v2/'] }),
  });
  const resolved = jest.fn();
  const unsubscribe = router.subscribe('onResolved', resolved);
  render(
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>,
  );
  await waitFor(() => expect(resolved).toHaveBeenCalled());
  expect(screen.getByRole('heading', { name: 'The stack, at a glance.' })).toBeTruthy();
  expect(document.activeElement).not.toBe(screen.getByRole('main'));
  unsubscribe();
});

test('Home exposes six architecture layers and navigation preserves the hosting base', async () => {
  const history = await open();
  expect(await screen.findByRole('heading', { name: 'The stack, at a glance.' })).toBeTruthy();
  for (const name of [
    'Application',
    'Interface',
    'State & data',
    'Build',
    'Workspace',
    'Testing',
  ]) {
    expect(screen.getByRole('heading', { name })).toBeTruthy();
  }
  const navigation = screen.getByRole('navigation', { name: 'Main navigation' });
  const home = within(navigation).getByRole('link', { name: 'Home' });
  expect(home.getAttribute('aria-current')).toBe('page');
  const about = within(navigation).getByRole('link', { name: 'About' });
  expect(about.getAttribute('href')).toBe('/lab/react/v2/about');
  fireEvent.click(about);
  expect(await screen.findByRole('heading', { name: /A little structure/ })).toBeTruthy();
  expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(3);
  expect(about.getAttribute('aria-current')).toBe('page');
  expect(home.getAttribute('aria-current')).toBeNull();
  expect(document.activeElement).toBe(screen.getByRole('main'));
  await act(async () => {
    history.back();
  });
  expect(await screen.findByRole('heading', { name: 'The stack, at a glance.' })).toBeTruthy();
  await act(async () => {
    history.forward();
  });
  expect(await screen.findByRole('heading', { name: /A little structure/ })).toBeTruthy();
});

test('unknown routes offer recovery to Home', async () => {
  await open('/missing');
  expect(await screen.findByRole('heading', { name: 'Let’s head home.' })).toBeTruthy();
  fireEvent.click(screen.getByRole('link', { name: 'Return to Home' }));
  expect(await screen.findByRole('heading', { name: 'The stack, at a glance.' })).toBeTruthy();
});

test('sidebar collapse persists and resizing transfers focus between navigation controls', async () => {
  await open();
  const collapse = screen.getByRole('button', { name: 'Collapse sidebar' });
  fireEvent.click(collapse);
  expect(localStorage.getItem('gjp-lab.sidebar.collapsed')).toBe('true');
  const expand = screen.getByRole('button', { name: 'Expand sidebar' });
  expect(expand.getAttribute('aria-expanded')).toBe('false');
  fireEvent.click(expand);
  expect(localStorage.getItem('gjp-lab.sidebar.collapsed')).toBe('false');
  collapse.focus();
  act(() => browser.change('(min-width: 1024px)', false));
  const mobile = screen.getByRole('button', { name: 'Open navigation' });
  expect(document.activeElement).toBe(mobile);
  act(() => browser.change('(min-width: 1024px)', true));
  expect(document.activeElement).toBe(collapse);
});

test('drawer opens, closes, and supports same-page navigation', async () => {
  browser.change('(min-width: 1024px)', false);
  await open();
  fireEvent.click(screen.getByRole('button', { name: 'Open navigation' }));
  let dialog = await screen.findByRole('dialog', { name: 'GJP / LAB' });
  fireEvent.click(within(dialog).getByRole('button', { name: 'Close navigation' }));
  await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  fireEvent.click(screen.getByRole('button', { name: 'Open navigation' }));
  dialog = await screen.findByRole('dialog');
  fireEvent.click(within(dialog).getByRole('link', { name: 'GJP Lab home' }));
  await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  fireEvent.click(screen.getByRole('button', { name: 'Open navigation' }));
  dialog = await screen.findByRole('dialog');
  fireEvent.click(within(dialog).getByRole('link', { name: 'About' }));
  expect(await screen.findByRole('heading', { name: /A little structure/ })).toBeTruthy();
  await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
});

test('appearance controls change mode/accent and reset stored preferences', async () => {
  await open();
  fireEvent.click(
    within(screen.getByRole('complementary', { name: 'Sidebar' })).getByRole('button', {
      name: 'Appearance',
    }),
  );
  const dialog = await screen.findByRole('dialog', { name: 'Appearance' });
  fireEvent.click(within(dialog).getByRole('radio', { name: 'Dark' }));
  fireEvent.click(within(dialog).getByRole('radio', { name: 'rose' }));
  expect(document.documentElement.dataset.mode).toBe('dark');
  expect(document.documentElement.dataset.accent).toBe('rose');
  fireEvent.click(within(dialog).getByRole('button', { name: 'Reset appearance' }));
  expect(JSON.parse(localStorage.getItem(appearanceKey) ?? 'null')).toEqual({
    mode: 'system',
    accent: 'mint',
  });
  fireEvent.click(within(dialog).getByRole('button', { name: 'Close appearance' }));
  await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
});

test('Home lists the installed stack and switches language without resetting appearance', async () => {
  await open();
  for (const name of [
    'Zustand',
    'TanStack Query',
    'Ky',
    'MSW',
    'i18next',
    'react-i18next',
    'Husky',
    'lint-staged',
  ]) {
    expect(screen.getByText(name)).toBeTruthy();
  }
  const accent = document.documentElement.dataset.accent;
  fireEvent.change(screen.getByRole('combobox', { name: 'Language' }), { target: { value: 'zh' } });
  expect(await screen.findByRole('heading', { name: '技术架构，一目了然。' })).toBeTruthy();
  expect(document.documentElement.lang).toBe('zh');
  expect(document.documentElement.dir).toBe('ltr');
  expect(document.documentElement.dataset.accent).toBe(accent);
  fireEvent.change(screen.getByRole('combobox', { name: '语言' }), { target: { value: 'en' } });
  expect(await screen.findByRole('heading', { name: 'The stack, at a glance.' })).toBeTruthy();
});
