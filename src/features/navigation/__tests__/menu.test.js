import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { test } from '@jest/globals';
import { activeGroups, parseMenu } from '../model/menu-schema.ts';

const link = { id: 'home', type: 'link', label: 'Home', icon: 'Home', to: '/' };
const group = { id: 'react', type: 'group', label: 'React', icon: 'Atom', children: [link] };

test('shipped configuration validates', () => {
  const config = JSON.parse(
    readFileSync(resolve('src/features/navigation/config/menu.json'), 'utf8'),
  );
  assert.ok(parseMenu(config).length > 0);
});
test('recursive groups preserve order and reveal active ancestors', () => {
  const items = parseMenu({ items: [{ ...group, children: [{ ...group, id: 'nested' }] }] });
  assert.deepEqual(activeGroups(items, '/'), ['react', 'nested']);
  assert.deepEqual(activeGroups(items, '/missing'), []);
});
test('duplicate IDs across nesting identify the offending entry', () => {
  assert.throws(() => parseMenu({ items: [link, group] }), /children\[0\].*duplicate id "home"/);
});
test('unknown routes and hosting prefixes are rejected', () => {
  for (const to of ['/missing', '/lab/react/v2/', 'https://example.com']) {
    assert.throws(() => parseMenu({ items: [{ ...link, to }] }), /unknown route/);
  }
});
test('icons and blank labels are validated', () => {
  assert.throws(() => parseMenu({ items: [{ ...link, icon: 'Missing' }] }), /icon/);
  assert.throws(() => parseMenu({ items: [{ ...link, label: ' ' }] }), /label/);
});
test('empty groups and mixed link/group fields are rejected', () => {
  assert.throws(() => parseMenu({ items: [{ ...group, children: [] }] }), /non-empty list/);
  assert.throws(() => parseMenu({ items: [{ ...group, to: '/' }] }), /unexpected field/);
  assert.throws(() => parseMenu({ items: [{ ...link, children: [link] }] }), /unexpected field/);
});
test('children may omit icons; top-level entries may not', () => {
  const { icon: _icon, ...child } = link;
  assert.doesNotThrow(() => parseMenu({ items: [{ ...group, children: [child] }] }));
  assert.throws(() => parseMenu({ items: [child] }), /missing icon/);
});
test('invalid root, item type and unknown fields are rejected', () => {
  for (const config of [
    null,
    { items: [] },
    { items: [false] },
    { items: [{ ...link, type: 'other' }] },
    { items: [link], typo: true },
  ]) {
    assert.throws(() => parseMenu(config), /menu.json/);
  }
});
