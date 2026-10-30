# Git hooks: Husky + lint-staged

**Status:** Installed and configured; activation awaits a Git checkout. Versions:
`husky` **9.1.7** and `lint-staged` **17.6.0** (2026-10-30).
Git hooks require a Git checkout. The current workspace has not been initialized
as a repository; the setup does not initialize one.

## Responsibilities

Husky installs project Git hooks. lint-staged selects staged files and passes them
to commands such as Biome. These are development tools and do not enter the SPA's
browser bundle. The existing lint/build/test scripts remain independently usable.

## Installed setup

Packages and hook configuration are present. The manifest runs
`node scripts/prepare.js` on prepare. The script skips CI, production, `HUSKY=0`,
and folders without Git metadata; otherwise it installs Husky. This preserves
archive installs and development before repository initialization.

After this folder is placed in a Git checkout, run:

```sh
pnpm prepare
```

The existing [.husky/pre-commit](../../.husky/pre-commit) runs:

```sh
pnpm exec lint-staged
```

The dependencies can be reproduced with
`pnpm add -D -E husky@9.1.7 lint-staged@17.6.0`. Do not rerun `husky init` over the
owned prepare guard or replace it with legacy hook initialization.

## Staged-file configuration

**Existing configuration:** [lint-staged.config.js](../../lint-staged.config.js).

```js
export default {
  '*.{js,jsx,ts,tsx,json,jsonc,css}': 'biome check --write --no-errors-on-unmatched',
};
```

lint-staged appends matching staged paths to the command. Use the executable
`biome check`, rather than `pnpm check`, whose fixed `.` argument checks the whole
project. Biome's current exclusions still apply. `--write` applies formatting,
import organization, and safe fixes; keep `--unsafe` out of this workflow.

Markdown/YAML and the pnpm lockfile are outside the project's Biome file scope.
This hook does not validate documentation links. Keep those checks separate unless
a dedicated documentation tool is intentionally introduced.

lint-staged manages its temporary backup, partially staged content, and task
changes. Do not add `git add .` or hand-built filename interpolation to the hook.
Review task output when a commit fails, fix the reported source, and stage the
intended change before retrying.

## Full verification

A pre-commit formatter is not the full quality gate. Before a reviewed change or
in a future CI workflow, run:

```sh
pnpm check
pnpm test:coverage
pnpm build
```

Keep coverage at least 90% globally for statements, branches, functions, and lines.
Do not pass individual staged files to `tsc` as a replacement for the project's
TypeScript configurations.

For environments without Git metadata or development dependencies, plan an
explicit hook-install policy; `prepare` must not make those installs fail.
When intentionally disabling hooks in CI, set `HUSKY=0` in that environment and
still run the full checks. Hooks can be bypassed and are not enforcement on a
remote repository by themselves.

## Verification before enabling

In a temporary Git checkout, exercise formatted and invalid files, paths containing
spaces, a partially staged file, an empty match set, and restoration after a failed
task. Confirm only intended changes are staged. The prepare command verified the no-Git fallback here. A temporary checkout
verified hook activation and staged safe formatting for a filename with spaces.
Partially staged content, failure restoration, and actual commits still require
the broader checks above.

## Official references

- [Husky setup](https://typicode.github.io/husky/get-started.html)
- [Husky environment and CI guidance](https://typicode.github.io/husky/how-to.html)
- [lint-staged configuration and staged changes](https://github.com/lint-staged/lint-staged)
- [Existing Biome guide](biome.md)
