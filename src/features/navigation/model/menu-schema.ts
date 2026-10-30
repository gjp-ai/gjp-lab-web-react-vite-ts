import { type MenuTarget, routePaths } from '../../../shared/routing/route-paths.ts';

export const iconNames = ['Home', 'Info', 'Atom', 'PanelsTopLeft', 'FileCode', 'Folder'] as const;
export type MenuIcon = (typeof iconNames)[number];
type Common = { readonly id: string; readonly label: string; readonly icon?: MenuIcon };
export type MenuItem = Common &
  (
    | { readonly type: 'link'; readonly to: MenuTarget }
    | { readonly type: 'group'; readonly children: readonly MenuItem[] }
  );

function record(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
function isIcon(value: unknown): value is MenuIcon {
  return iconNames.some((name) => name === value);
}
function isTarget(value: unknown): value is MenuTarget {
  return Object.values(routePaths).some((path) => path === value);
}

export function parseMenu(value: unknown): readonly MenuItem[] {
  const ids = new Set<string>();
  function fail(path: string, message: string): never {
    throw new Error(`menu.json ${path}: ${message}`);
  }
  function items(value: unknown, path: string, top: boolean): MenuItem[] {
    if (!Array.isArray(value) || value.length === 0) return fail(path, 'expected a non-empty list');
    return value.map((entry: unknown, index: number) => {
      const location = `${path}[${index}]`;
      if (!record(entry)) return fail(location, 'expected an object');
      const { id, label, icon, type } = entry;
      if (typeof id !== 'string' || !id.trim()) return fail(location, 'id must be non-empty');
      if (ids.has(id)) return fail(location, `duplicate id "${id}"`);
      ids.add(id);
      const at = `${location} (${id})`;
      if (typeof label !== 'string' || !label.trim()) return fail(at, 'label must be non-empty');
      if ((top || icon !== undefined) && !isIcon(icon))
        return fail(at, 'unsupported or missing icon');
      const common = { id, label, ...(isIcon(icon) ? { icon } : {}) };
      const allowed = ['id', 'label', 'icon', 'type', type === 'link' ? 'to' : 'children'];
      for (const key of Object.keys(entry)) {
        if (!allowed.includes(key)) return fail(at, `unexpected field "${key}"`);
      }
      if (type === 'link') {
        if (!isTarget(entry.to)) return fail(at, `unknown route "${String(entry.to)}"`);
        return { ...common, type, to: entry.to };
      }
      if (type === 'group')
        return { ...common, type, children: items(entry.children, `${at}.children`, false) };
      return fail(at, 'type must be link or group');
    });
  }
  if (!record(value)) return fail('root', 'expected an object with items');
  if (Object.keys(value).some((key) => key !== 'items'))
    return fail('root', 'only items is supported');
  return items(value.items, 'items', true);
}

export function activeGroups(items: readonly MenuItem[], target: string): string[] {
  return items.flatMap((item) => {
    if (item.type === 'link') return [];
    const descendants = activeGroups(item.children, target);
    return descendants.length ||
      item.children.some((child) => child.type === 'link' && child.to === target)
      ? [item.id, ...descendants]
      : [];
  });
}
