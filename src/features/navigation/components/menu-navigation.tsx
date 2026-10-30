import { Tooltip } from '@base-ui/react/tooltip';
import { Link } from '@tanstack/react-router';
import { Atom, ChevronDown, FileCode, Folder, Home, Info, PanelsTopLeft } from 'lucide-react';
import { useId } from 'react';
import type { MenuIcon, MenuItem } from '@/features/navigation/model/menu-schema';
import { cn } from '@/shared/lib/utils';
import type { MenuTarget } from '@/shared/routing/route-paths';
import { Button } from '../../../shared/ui/button';

const icons = { Home, Info, Atom, PanelsTopLeft, FileCode, Folder } satisfies Record<
  MenuIcon,
  typeof Home
>;

type Props = {
  readonly items: readonly MenuItem[];
  readonly collapsed: boolean;
  readonly openGroups: ReadonlySet<string>;
  readonly activeGroups: readonly string[];
  readonly onGroup: (id: string) => void;
  readonly onNavigate: (target: MenuTarget) => void;
};

export function MenuNavigation(props: Props) {
  return (
    <nav aria-label="Main navigation" className="menu-navigation">
      <MenuList {...props} />
    </nav>
  );
}

function MenuList(props: Props) {
  return (
    <ul className="menu-list">
      {props.items.map((item) => (
        <MenuEntry key={item.id} {...props} item={item} />
      ))}
    </ul>
  );
}

function MenuEntry({ item, ...props }: Props & { readonly item: MenuItem }) {
  const panelId = useId();
  const Icon = item.icon ? icons[item.icon] : undefined;
  const open = props.openGroups.has(item.id);
  const content = (
    <>
      {Icon && <Icon aria-hidden="true" className="size-5 shrink-0" />}
      <span className={props.collapsed ? 'sr-only' : 'menu-label'}>{item.label}</span>
    </>
  );
  const control =
    item.type === 'link' ? (
      <Link
        to={item.to}
        activeOptions={{ exact: true }}
        activeProps={{ className: 'menu-current', 'aria-current': 'page' }}
        className="menu-control"
        onClick={(event) => {
          if (
            event.button === 0 &&
            !event.metaKey &&
            !event.ctrlKey &&
            !event.shiftKey &&
            !event.altKey &&
            !event.defaultPrevented
          )
            props.onNavigate(item.to);
        }}
      >
        {content}
      </Link>
    ) : (
      <Button
        type="button"
        variant="ghost"
        className={cn('menu-control', props.activeGroups.includes(item.id) && 'menu-ancestor')}
        aria-expanded={!props.collapsed && open}
        aria-controls={panelId}
        onClick={() => props.onGroup(item.id)}
      >
        {content}
        {!props.collapsed && (
          <ChevronDown
            aria-hidden="true"
            className={cn('menu-chevron size-4', open && 'rotate-180')}
          />
        )}
      </Button>
    );
  return (
    <li>
      <Tooltip.Root>
        <Tooltip.Trigger render={control} disabled={!props.collapsed} />
        <Tooltip.Portal>
          <Tooltip.Positioner side="right" sideOffset={12} className="menu-tooltip-positioner">
            <Tooltip.Popup lang="en" className="menu-tooltip">
              {item.label}
            </Tooltip.Popup>
          </Tooltip.Positioner>
        </Tooltip.Portal>
      </Tooltip.Root>
      {item.type === 'group' && (
        <div id={panelId} hidden={props.collapsed || !open} className="menu-children">
          <MenuList {...props} items={item.children} />
        </div>
      )}
    </li>
  );
}
