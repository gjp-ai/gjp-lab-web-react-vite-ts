import { expect, test } from '@jest/globals';
import { version as reactVersion } from 'react';
import { technologyVersions } from '../build/technology-versions';

test('public build metadata contains exact dependency and build tool versions', () => {
  expect(technologyVersions.react).toBe(reactVersion);
  expect(technologyVersions.node).toBe(process.versions.node);
  expect(technologyVersions.pnpm).toMatch(/^\d+\.\d+\.\d+$/);
  for (const version of Object.values(technologyVersions)) {
    expect(version).toMatch(/^\d+\.\d+\.\d+$/);
  }
  expect(technologyVersions).not.toHaveProperty('scripts');
  expect(technologyVersions).not.toHaveProperty('engines');
});
