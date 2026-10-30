/** @jest-environment jsdom */

import { Tooltip } from '@base-ui/react/tooltip';
import { afterEach, expect, jest, test } from '@jest/globals';
import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
} from '@tanstack/react-router';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { MenuNavigation } from '@/features/navigation/components/menu-navigation';
import type { MenuItem } from '@/features/navigation/model/menu-schema';

const items: readonly MenuItem[] = [
  {
    id: 'features',
    type: 'group',
    label: 'Features',
    icon: 'Folder',
    children: [
      { id: 'home', type: 'link', label: 'Nested Home', to: '/' },
      {
        id: 'nested',
        type: 'group',
        label: 'More',
        icon: 'Atom',
        children: [
          { id: 'about', type: 'link', label: 'Nested About', to: '/about', icon: 'Info' },
        ],
      },
    ],
  },
];
afterEach(cleanup);

function Example({
  collapsed,
  onNavigate,
}: {
  readonly collapsed: boolean;
  readonly onNavigate: (target: '/' | '/about') => void;
}) {
  const [openGroups, setOpenGroups] = useState<ReadonlySet<string>>(new Set());
  return (
    <Tooltip.Provider>
      <MenuNavigation
        items={items}
        collapsed={collapsed}
        openGroups={openGroups}
        activeGroups={['features']}
        onNavigate={onNavigate}
        onGroup={(id) =>
          setOpenGroups((previous) => {
            const next = new Set(previous);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
          })
        }
      />
    </Tooltip.Provider>
  );
}

async function menu(collapsed = false) {
  const onNavigate = jest.fn();
  const root = createRootRoute({
    component: () => <Example collapsed={collapsed} onNavigate={onNavigate} />,
  });
  const home = createRoute({ getParentRoute: () => root, path: '/' });
  const about = createRoute({ getParentRoute: () => root, path: '/about' });
  const router = createRouter({
    routeTree: root.addChildren([home, about]),
    history: createMemoryHistory({ initialEntries: ['/'] }),
  });
  await router.load();
  render(<RouterProvider router={router} />);
  return onNavigate;
}

test('recursive groups reveal children, preserve active state, and collapse again', async () => {
  await menu();
  const group = screen.getByRole('button', { name: 'Features' });
  expect(group.getAttribute('aria-expanded')).toBe('false');
  expect(screen.queryByRole('link', { name: 'Nested Home' })).toBeNull();
  fireEvent.click(group);
  expect(group.getAttribute('aria-expanded')).toBe('true');
  expect(screen.getByRole('link', { name: 'Nested Home' }).getAttribute('aria-current')).toBe(
    'page',
  );
  fireEvent.click(screen.getByRole('button', { name: 'More' }));
  expect(screen.getByRole('link', { name: 'Nested About' })).toBeTruthy();
  fireEvent.click(group);
  expect(screen.queryByRole('link', { name: 'Nested About' })).toBeNull();
});

test('only unmodified primary clicks notify the shell to close navigation', async () => {
  const navigate = await menu();
  fireEvent.click(screen.getByRole('button', { name: 'Features' }));
  const home = screen.getByRole('link', { name: 'Nested Home' });
  for (const modifier of [
    { ctrlKey: true },
    { metaKey: true },
    { shiftKey: true },
    { altKey: true },
    { button: 1 },
  ]) {
    fireEvent.click(home, modifier);
  }
  expect(navigate).not.toHaveBeenCalled();
  fireEvent.click(home);
  expect(navigate).toHaveBeenCalledWith('/');
});

test('collapsed groups retain accessible names and keep child links hidden', async () => {
  await menu(true);
  const group = screen.getByRole('button', { name: 'Features' });
  fireEvent.click(group);
  expect(group.getAttribute('aria-expanded')).toBe('false');
  expect(screen.queryByRole('link', { name: 'Nested Home' })).toBeNull();
});
