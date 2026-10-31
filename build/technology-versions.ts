import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import manifest from '../package.json' with { type: 'json' };

const projectRequire = createRequire(import.meta.url);
const viteRequire = createRequire(projectRequire.resolve('vite/package.json'));
const rolldown: { version: string } = viteRequire('rolldown/package.json');

// Only public tool versions enter the browser bundle, never the process environment.
export const technologyVersions = {
  ...manifest.dependencies,
  ...manifest.devDependencies,
  rolldown: rolldown.version,
  node: process.versions.node,
  pnpm: execFileSync('pnpm', ['--version'], { encoding: 'utf8' }).trim(),
};
