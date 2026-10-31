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
  act(() => collapse.focus());
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

test('mode toggles immediately and accent reset preserves the selected mode', async () => {
  await open();
  const sidebar = within(screen.getByRole('complementary', { name: 'Sidebar' }));
  const mode = sidebar.getByRole('button', { name: 'Dark mode' });
  const lightIcon = mode.querySelector('svg')?.getAttribute('class');
  expect(mode.getAttribute('aria-pressed')).toBe('false');
  fireEvent.click(mode);
  expect(screen.queryByRole('dialog')).toBeNull();
  expect(mode.getAttribute('aria-pressed')).toBe('true');
  expect(mode.querySelector('svg')?.getAttribute('class')).not.toBe(lightIcon);
  expect(document.documentElement.dataset.mode).toBe('dark');
  fireEvent.click(sidebar.getByRole('button', { name: 'Accent color' }));
  const dialog = await screen.findByRole('dialog', { name: 'Accent color' });
  expect(within(dialog).queryByRole('radio', { name: 'System' })).toBeNull();
  fireEvent.click(within(dialog).getByRole('radio', { name: 'rose' }));
  expect(document.documentElement.dataset.accent).toBe('rose');
  fireEvent.click(within(dialog).getByRole('button', { name: 'Reset accent color' }));
  expect(JSON.parse(localStorage.getItem(appearanceKey) ?? 'null')).toEqual({
    mode: 'dark',
    accent: 'mint',
  });
  fireEvent.click(within(dialog).getByRole('button', { name: 'Close accent color' }));
  await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  fireEvent.click(mode);
  expect(document.documentElement.dataset.mode).toBe('light');
  expect(JSON.parse(localStorage.getItem(appearanceKey) ?? 'null')).toEqual({
    mode: 'light',
    accent: 'mint',
  });
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
  fireEvent.click(screen.getByRole('button', { name: 'Language' }));
  expect(await screen.findByRole('heading', { name: '技术架构，一目了然。' })).toBeTruthy();
  expect(document.documentElement.lang).toBe('zh');
  expect(document.documentElement.dir).toBe('ltr');
  expect(document.documentElement.dataset.accent).toBe(accent);
  fireEvent.click(screen.getByRole('button', { name: '语言' }));
  expect(await screen.findByRole('heading', { name: 'The stack, at a glance.' })).toBeTruthy();
});

test('Home technology tiles link to official sites and keep their names if logos fail', async () => {
  await open();
  const diagram = within(screen.getByRole('figure'));
  const react = diagram.getByRole('link', { name: /^React 19/ });
  expect(react.getAttribute('href')).toBe('https://react.dev');
  expect(diagram.getByRole('link', { name: /^TanStack Router/ }).getAttribute('href')).toBe(
    'https://tanstack.com/router',
  );
  expect(diagram.getByRole('link', { name: /^Vite/ }).getAttribute('href')).toBe(
    'https://vite.dev',
  );
  expect(diagram.getByRole('link', { name: /^Oxc/ }).getAttribute('href')).toBe('https://oxc.rs');
  expect(diagram.getByRole('link', { name: /^Rolldown/ }).getAttribute('href')).toBe(
    'https://rolldown.rs',
  );
  for (const link of diagram.getAllByRole('link')) {
    expect(link.getAttribute('href')).toMatch(/^https:\/\//);
    expect(link.getAttribute('target')).toBe('_blank');
    expect(link.getAttribute('rel')).toBe('noopener noreferrer');
    expect(link.textContent).toContain('opens in a new tab');
  }
  const logo = react.querySelector('img');
  expect(logo?.getAttribute('src')).toBe('https://react.dev/favicon-32x32.png');
  if (!logo) throw new Error('React logo is missing');
  fireEvent.error(logo);
  expect(react.querySelector('img')).toBeNull();
  expect(diagram.getByRole('link', { name: /^React 19/ })).toBe(react);
  expect(react.textContent).toContain('React');
});

test('Home shows exact package versions and a single Jest tile for testing and coverage', async () => {
  await open();
  const diagram = within(screen.getByRole('figure'));
  const jestLinks = diagram.getAllByRole('link', { name: /^Jest/ });
  expect(jestLinks).toHaveLength(1);
  expect(jestLinks[0]?.textContent).toContain('30.5.2');
  expect(jestLinks[0]?.textContent).toContain('Unit testing & code coverage');
  expect(diagram.getByRole('link', { name: /^React 19/ }).textContent).toContain('19.3.1');
  expect(diagram.getByRole('link', { name: /^TanStack Router/ }).textContent).toContain('1.170.46');
  expect(diagram.getByRole('link', { name: /^Vite/ }).textContent).toContain('8.3.5');
  expect(diagram.getByRole('link', { name: /^shadcn\/ui/ }).textContent).toContain('Local source');
});

test('every Home technology tile has version/source metadata and a translated description', async () => {
  await open();
  const figure = screen.getByRole('figure');
  const checkTiles = () => {
    const tiles = figure.querySelectorAll('.stack-technology, .stack-vite-link');
    expect(tiles.length).toBeGreaterThan(20);
    for (const tile of tiles) {
      expect(tile.querySelector('.stack-version')?.textContent?.trim()).toBeTruthy();
      const description = tile.querySelector('.stack-technology-description')?.textContent?.trim();
      expect(description).toBeTruthy();
      expect(description).not.toContain('technologyDescriptions.');
    }
  };
  checkTiles();
  expect(within(figure).getByText('Component-based UI')).toBeTruthy();
  expect(within(figure).getByText('Package management')).toBeTruthy();
  expect(within(figure).getByRole('link', { name: /^React State/ }).textContent).toContain(
    '19.3.1',
  );
  expect(within(figure).getByRole('link', { name: /^Oxc/ }).textContent).toMatch(
    /Bundled with Rolldown \d+\.\d+\.\d+/,
  );
  expect(within(figure).getByRole('link', { name: /^Rolldown/ }).textContent).toMatch(
    /Rolldown\d+\.\d+\.\d+/,
  );
  fireEvent.click(screen.getByRole('button', { name: 'Language' }));
  expect(await within(figure).findByText('组件化界面')).toBeTruthy();
  expect(within(figure).getByText('依赖包管理')).toBeTruthy();
  expect(within(figure).getByText('本地源码')).toBeTruthy();
  checkTiles();
});

test('language selection belongs to the sidebar and remains usable when collapsed and on About', async () => {
  await open();
  const home = screen
    .getByRole('heading', { name: 'The stack, at a glance.' })
    .closest('.stack-home');
  expect(home?.querySelector('select')).toBeNull();
  const sidebar = within(screen.getByRole('complementary', { name: 'Sidebar' }));
  const collapse = sidebar.getByRole('button', { name: 'Collapse sidebar' });
  expect(collapse.textContent).toBe('');
  fireEvent.click(collapse);
  const language = sidebar.getByRole('button', { name: 'Language' });
  const englishIcon = language.querySelector('svg')?.getAttribute('class');
  fireEvent.click(language);
  expect(language.querySelector('svg')?.getAttribute('class')).not.toBe(englishIcon);
  expect(screen.queryByRole('combobox')).toBeNull();
  expect(await screen.findByRole('heading', { name: '技术架构，一目了然。' })).toBeTruthy();
  expect(sidebar.getByRole('button', { name: '语言' })).toBe(language);
  fireEvent.click(sidebar.getByRole('link', { name: 'About' }));
  await waitFor(() =>
    expect(screen.queryByRole('heading', { name: '技术架构，一目了然。' })).toBeNull(),
  );
  fireEvent.click(sidebar.getByRole('button', { name: '语言' }));
  expect(i18n.resolvedLanguage).toBe('en');
  expect(
    sidebar.getByRole('button', { name: 'Expand sidebar' }).getAttribute('aria-expanded'),
  ).toBe('false');
});

test('mobile navigation drawer exposes the shared language selector', async () => {
  browser.change('(min-width: 1024px)', false);
  await open();
  fireEvent.click(screen.getByRole('button', { name: 'Open navigation' }));
  const dialog = await screen.findByRole('dialog', { name: 'GJP / LAB' });
  fireEvent.click(within(dialog).getByRole('button', { name: 'Language' }));
  expect(i18n.resolvedLanguage).toBe('zh');
  expect(document.documentElement.lang).toBe('zh');
  fireEvent.click(within(dialog).getByRole('button', { name: 'Close navigation' }));
  expect(await screen.findByRole('heading', { name: '技术架构，一目了然。' })).toBeTruthy();
});

test('menu footer contains icon-only language, mode, and accent controls in order', async () => {
  await open();
  const sidebar = screen.getByRole('complementary', { name: 'Sidebar' });
  const row = sidebar.querySelector('.menu-settings');
  expect(row?.children).toHaveLength(3);
  const controls = Array.from(row?.querySelectorAll('select, button') ?? []);
  expect(controls.map((control) => control.getAttribute('aria-label'))).toEqual([
    'Language',
    'Dark mode',
    'Accent color',
  ]);
  for (const button of row?.querySelectorAll('button') ?? []) expect(button.textContent).toBe('');
});

test('drawer footer toggles mode without a popup and returns from accent settings to navigation', async () => {
  browser.change('(min-width: 1024px)', false);
  await open();
  fireEvent.click(screen.getByRole('button', { name: 'Open navigation' }));
  let drawer = await screen.findByRole('dialog', { name: 'GJP / LAB' });
  fireEvent.click(within(drawer).getByRole('button', { name: 'Dark mode' }));
  expect(document.documentElement.dataset.mode).toBe('dark');
  expect(screen.queryByRole('dialog', { name: 'Mode' })).toBeNull();
  fireEvent.click(within(drawer).getByRole('button', { name: 'Accent color' }));
  const accent = await screen.findByRole('dialog', { name: 'Accent color' });
  fireEvent.click(within(accent).getByRole('radio', { name: 'orange' }));
  fireEvent.click(within(accent).getByRole('button', { name: 'Close accent color' }));
  await waitFor(() => expect(screen.queryByRole('dialog', { name: 'Accent color' })).toBeNull());
  drawer = screen.getByRole('dialog', { name: 'GJP / LAB' });
  expect(document.documentElement.dataset.mode).toBe('dark');
  expect(document.documentElement.dataset.accent).toBe('orange');
  fireEvent.click(within(drawer).getByRole('button', { name: 'Close navigation' }));
  await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
});
