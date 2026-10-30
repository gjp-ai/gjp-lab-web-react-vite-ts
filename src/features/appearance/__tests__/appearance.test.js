import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { runInNewContext } from 'node:vm';
import { test } from '@jest/globals';
import { appearanceHeadScript } from '../../../../build/appearance-head.ts';
import {
  accents,
  appearanceKey,
  parseAppearance,
  readAppearance,
  resolveMode,
} from '../model/appearance.ts';

const defaults = { mode: 'system', accent: 'mint' };
test('all modes and ten accents round trip independently', () => {
  assert.equal(accents.length, 10);
  for (const mode of ['light', 'dark', 'system'])
    for (const accent of accents) {
      assert.deepEqual(parseAppearance(JSON.stringify({ mode, accent }), accents), {
        mode,
        accent,
      });
    }
});
test('invalid fields default separately; malformed storage is safe', () => {
  for (const raw of [null, 'broken', 'null', '[]', '42'])
    assert.deepEqual(parseAppearance(raw, accents), defaults);
  assert.deepEqual(parseAppearance('{"mode":"dark","accent":"unknown"}', accents), {
    mode: 'dark',
    accent: 'mint',
  });
  assert.deepEqual(parseAppearance('{"mode":"unknown","accent":"rose"}', accents), {
    mode: 'system',
    accent: 'rose',
  });
  assert.deepEqual(
    readAppearance({
      getItem() {
        throw Error('denied');
      },
    }),
    defaults,
  );
});
test('explicit mode overrides system preference', () => {
  for (const systemDark of [true, false]) {
    assert.equal(resolveMode('light', systemDark), 'light');
    assert.equal(resolveMode('dark', systemDark), 'dark');
    assert.equal(resolveMode('system', systemDark), systemDark ? 'dark' : 'light');
  }
});
test('blocking bootstrap matches shared preferences for every combination', () => {
  for (const mode of ['light', 'dark', 'system'])
    for (const accent of accents)
      for (const systemDark of [true, false]) {
        const root = { dataset: {}, style: {} };
        runInNewContext(appearanceHeadScript(), {
          document: { documentElement: root },
          localStorage: {
            getItem(key) {
              assert.equal(key, appearanceKey);
              return JSON.stringify({ mode, accent });
            },
          },
          matchMedia: () => ({ matches: systemDark }),
        });
        assert.equal(root.dataset.mode, resolveMode(mode, systemDark));
        assert.equal(root.dataset.accent, accent);
        assert.equal(root.style.colorScheme, root.dataset.mode);
      }
});
test('bootstrap survives blocked storage and missing media-query API', () => {
  const root = { dataset: {}, style: {} };
  runInNewContext(appearanceHeadScript(), {
    document: { documentElement: root },
    get localStorage() {
      throw Error('denied');
    },
  });
  assert.deepEqual(root.dataset, { mode: 'light', accent: 'mint' });
});

function luminance(hex) {
  const rgb = hex
    .replace('#', '')
    .match(/../g)
    .map((part) => {
      const value = Number.parseInt(part, 16) / 255;
      return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
    });
  return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
}
function contrast(a, b) {
  const [low, high] = [luminance(a), luminance(b)].sort((x, y) => x - y);
  return (high + 0.05) / (low + 0.05);
}
const css = readFileSync(resolve('src/app/styles.css'), 'utf8');
function tokens(selector) {
  const block = css.slice(css.indexOf(`${selector} {`)).split('}')[0];
  return Object.fromEntries(
    [...block.matchAll(/--([\w-]+):\s*(#[\da-f]{6});/gi)].map((match) => [match[1], match[2]]),
  );
}
test('all twenty palettes meet text, button, muted text and focus contrast targets', () => {
  for (const mode of ['light', 'dark']) {
    const surface = tokens(mode === 'light' ? ':root' : ':root[data-mode="dark"]');
    for (const accent of accents) {
      const primary = tokens(`[data-accent="${accent}"]`)[`accent-${mode}`];
      for (const background of ['background', 'card', 'muted']) {
        for (const [label, color, minimum] of [
          ['primary', primary, 4.5],
          ['foreground', surface.foreground, 4.5],
          ['muted text', surface['muted-foreground'], 4.5],
          ['control border', surface.input, 3],
        ]) {
          assert.ok(
            contrast(color, surface[background]) >= minimum,
            `${mode}/${accent} ${label} on ${background}: ${contrast(color, surface[background]).toFixed(2)}`,
          );
        }
      }
      assert.ok(
        contrast(primary, surface['primary-foreground']) >= 4.5,
        `${mode}/${accent} button text`,
      );
    }
  }
});
