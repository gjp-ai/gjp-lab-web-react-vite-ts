import { Dialog } from '@base-ui/react/dialog';
import { Tooltip } from '@base-ui/react/tooltip';
import { Link, Outlet, useRouter, useRouterState } from '@tanstack/react-router';
import { FlaskConical, Menu, PanelLeftClose, PanelLeftOpen, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import menuConfig from '@/features/navigation/config/menu.json';
import { activeGroups, parseMenu } from '@/features/navigation/model/menu-schema';
import { cn } from '@/shared/lib/utils';
import type { MenuTarget } from '@/shared/routing/route-paths';
import { MenuNavigation } from '../features/navigation/components/menu-navigation';
import { Button } from '../shared/ui/button';
import { MenuSettings } from './menu-settings';

const menu = parseMenu(menuConfig);
const preferenceKey = 'gjp-lab.sidebar.collapsed';

function readCollapsed() {
  try {
    return localStorage.getItem(preferenceKey) === 'true';
  } catch {
    return false;
  }
}

export function AppShell() {
  const router = useRouter();
  const currentPath = useRouterState({
    select: (state) =>
      state.matches.some((match) => match.status === 'notFound')
        ? ''
        : (state.matches.at(-1)?.routeId ?? ''),
  });
  const [collapsed, setCollapsed] = useState(readCollapsed);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openGroups, setOpenGroups] = useState<ReadonlySet<string>>(
    () => new Set(activeGroups(menu, currentPath)),
  );
  const mainRef = useRef<HTMLElement>(null);
  const desktopRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const mobileRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const closeDestination = useRef<'trigger' | 'content' | 'desktop'>('trigger');
  const active = activeGroups(menu, currentPath);

  useEffect(() => {
    try {
      localStorage.setItem(preferenceKey, String(collapsed));
    } catch {
      /* Storage is optional. */
    }
  }, [collapsed]);

  useEffect(
    () =>
      router.subscribe('onResolved', (event) => {
        const path = router.state.matches.some((match) => match.status === 'notFound')
          ? ''
          : (router.state.matches.at(-1)?.routeId ?? '');
        setOpenGroups((previous) => new Set([...previous, ...activeGroups(menu, path)]));
        closeDestination.current = 'content';
        setDrawerOpen(false);
        // Initial loading should not steal focus or draw a page-sized focus ring.
        if (event.fromLocation && event.pathChanged) mainRef.current?.focus();
      }),
    [router],
  );

  useEffect(() => {
    const media = window.matchMedia('(min-width: 1024px)');
    let lastFocused = document.activeElement;
    function rememberFocus(event: FocusEvent) {
      if (event.target instanceof HTMLElement) lastFocused = event.target;
    }
    function onResize() {
      if (media.matches) {
        closeDestination.current = 'desktop';
        setDrawerOpen(false);
        if (lastFocused === mobileRef.current) toggleRef.current?.focus();
      } else if (desktopRef.current?.contains(lastFocused)) {
        mobileRef.current?.focus();
      }
    }
    media.addEventListener('change', onResize);
    document.addEventListener('focusin', rememberFocus);
    return () => {
      media.removeEventListener('change', onResize);
      document.removeEventListener('focusin', rememberFocus);
    };
  }, []);

  function onGroup(id: string) {
    const wasCollapsed = collapsed && window.matchMedia('(min-width: 1024px)').matches;
    if (wasCollapsed) setCollapsed(false);
    setOpenGroups((previous) => {
      const next = new Set(previous);
      if (next.has(id) && !wasCollapsed) next.delete(id);
      else next.add(id);
      return next;
    });
  }
  function onNavigate(target: MenuTarget) {
    if (target !== currentPath) return;
    // A same-page selection may not emit a router resolution event.
    closeDestination.current = 'content';
    setDrawerOpen(false);
  }
  const navigation = { items: menu, openGroups, activeGroups: active, onGroup, onNavigate };
  const brand = (
    <>
      <FlaskConical className="size-5 shrink-0 text-primary" aria-hidden="true" />
      <span className={collapsed ? 'desktop-brand-text' : ''}>
        GJP<span> / </span>LAB
      </span>
    </>
  );

  return (
    <Tooltip.Provider>
      <div className={cn('app-layout', collapsed && 'sidebar-collapsed')}>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <aside lang="en" ref={desktopRef} className="desktop-sidebar" aria-label="Sidebar">
          <div className="sidebar-heading">
            <Link className="brand sidebar-brand" to="/" aria-label="GJP Lab home">
              {brand}
            </Link>
            <Tooltip.Root>
              <Tooltip.Trigger
                render={
                  <Button
                    ref={toggleRef}
                    type="button"
                    variant="ghost"
                    className="sidebar-toggle"
                    aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                    aria-expanded={!collapsed}
                    aria-controls="desktop-menu"
                    onClick={() => setCollapsed((value) => !value)}
                  >
                    {collapsed ? (
                      <PanelLeftOpen aria-hidden="true" />
                    ) : (
                      <PanelLeftClose aria-hidden="true" />
                    )}
                  </Button>
                }
              />
              <Tooltip.Portal>
                <Tooltip.Positioner
                  side="right"
                  sideOffset={12}
                  className="menu-tooltip-positioner"
                >
                  <Tooltip.Popup lang="en" className="menu-tooltip">
                    {collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                  </Tooltip.Popup>
                </Tooltip.Positioner>
              </Tooltip.Portal>
            </Tooltip.Root>
          </div>
          <div id="desktop-menu" className="sidebar-scroll">
            <MenuNavigation {...navigation} collapsed={collapsed} />
          </div>
          <div className="sidebar-settings">
            <MenuSettings />
          </div>
        </aside>
        <Dialog.Root
          open={drawerOpen}
          onOpenChange={(open) => {
            closeDestination.current = 'trigger';
            setDrawerOpen(open);
          }}
        >
          <header lang="en" className="mobile-header">
            <Link className="brand" to="/" aria-label="GJP Lab home">
              {brand}
            </Link>
            <div className="mobile-actions">
              <Dialog.Trigger
                render={
                  <Button
                    ref={mobileRef}
                    type="button"
                    variant="ghost"
                    className="sidebar-toggle"
                    aria-label="Open navigation"
                  >
                    <Menu aria-hidden="true" />
                  </Button>
                }
              />
            </div>
          </header>
          <Dialog.Portal>
            <Dialog.Backdrop className="drawer-backdrop" />
            <Dialog.Popup
              lang="en"
              className="menu-drawer"
              initialFocus={closeRef}
              finalFocus={() =>
                closeDestination.current === 'content'
                  ? mainRef.current
                  : closeDestination.current === 'desktop'
                    ? toggleRef.current
                    : mobileRef.current
              }
            >
              <div className="drawer-heading">
                <Dialog.Title className="brand">GJP / LAB</Dialog.Title>
                <Dialog.Close
                  render={
                    <Button
                      ref={closeRef}
                      type="button"
                      variant="ghost"
                      className="sidebar-toggle"
                      aria-label="Close navigation"
                    >
                      <X aria-hidden="true" />
                    </Button>
                  }
                />
              </div>
              <Dialog.Description className="sr-only">
                Explore GJP Lab pages and features.
              </Dialog.Description>
              <Link
                to="/"
                className="drawer-home"
                onClick={(event) => {
                  if (!event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey)
                    onNavigate('/');
                }}
              >
                GJP Lab home
              </Link>
              <MenuNavigation {...navigation} collapsed={false} />
              <div className="drawer-settings">
                <MenuSettings />
              </div>
            </Dialog.Popup>
          </Dialog.Portal>
        </Dialog.Root>
        <div className="shell content-column">
          <main id="main-content" ref={mainRef} tabIndex={-1}>
            <Outlet />
          </main>
          <footer lang="en">
            GJP Lab <span>Made for what comes next.</span>
          </footer>
        </div>
      </div>
    </Tooltip.Provider>
  );
}
