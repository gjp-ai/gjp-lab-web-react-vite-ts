# Biome

## Contents

- [Introduction](#introduction)
- [Configuration in this project](#configuration-in-this-project)
- [Basic usage](#basic-usage)
- [Practical examples](#practical-examples)
- [Best practices](#best-practices)
- [Official references](#official-references)

## Introduction

Biome is a development tool that helps keep this project's code consistent and
reports common mistakes before you run the application.

| Responsibility | Example in this React project |
| --- | --- |
| Linting | Reports a button without an explicit `type` |
| Formatting | Applies consistent indentation, quotes, semicolons, and line breaks |
| Import organization | Orders imports through Biome's assist actions |

**Existing setup:** Biome **2.6.3** is saved as an exact development dependency in
[package.json](../../package.json). The project scripts use that local version;
you do not need a global installation.

Biome works alongside the other tools. TypeScript checks types, Vite runs the
development server and builds production assets, and Biome checks code style
and lint rules. Passing Biome does not guarantee correct types or working UI.
For those responsibilities, see [TypeScript](typescript.md) and [Vite](vite.md).

## Configuration in this project

### Read the existing biome.json

**Existing configuration:** [biome.json](../../biome.json) is at the project root,
next to `package.json`. Its complete contents are:

```json
{
  "$schema": "https://biomejs.dev/schemas/2.6.3/schema.json",
  "files": {
    "includes": [
      "**/*.{js,jsx,ts,tsx,json,jsonc,css}",
      "!!**/node_modules",
      "!!**/dist",
      "!!**/.pnpm-store",
      "!!**/.git",
      "!!**/.vite",
      "!!**/.cache",
      "!**/package-lock.json",
      "!**/npm-shrinkwrap.json",
      "!!**/coverage",
      "!**/mockServiceWorker.js"
    ]
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineEnding": "lf",
    "lineWidth": 100
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "single",
      "jsxQuoteStyle": "double",
      "semicolons": "always"
    }
  },
  "linter": {
    "enabled": true,
    "rules": {
      "preset": "recommended"
    }
  },
  "assist": {
    "actions": {
      "source": {
        "organizeImports": "on"
      }
    }
  },
  "css": {
    "parser": {
      "tailwindDirectives": true
    }
  }
}
```

You do not need to recreate this file when working in the existing project.
For installation and setup from scratch, follow [Project creation](../project-create.md).

### Understand each section

| Section | What it controls here |
| --- | --- |
| `$schema` | Helps compatible editors validate configuration and suggest settings; its version matches the installed Biome package |
| `files.includes` | Selects which files Biome processes and excludes generated or dependency directories |
| `formatter` | Enables formatting with two spaces, LF line endings, and a 100-column target |
| `javascript.formatter` | Uses single quotes in JS/TS, double quotes in JSX attributes, and semicolons |
| `linter.rules.preset` | Enables the recommended lint preset, including applicable React and accessibility rules |
| `assist.actions.source.organizeImports` | Enables automatic import organization |

The 100-column setting guides wrapping; it is not a promise that every string or
line can be shortened to that width. JSON and CSS use their own syntax and formatter
conventions; the JavaScript quote settings do not make JSON strings single-quoted.

`css.parser.tailwindDirectives: true` enables parsing Tailwind CSS 4 directives
such as `@theme` in `src/app/styles.css`; formatting and recommended CSS rules stay enabled.

### Understand file selection

The first pattern includes files ending in `.js`, `.jsx`, `.ts`, `.tsx`, `.json`,
`.jsonc`, and `.css` throughout the project. This covers application source and
configuration such as `vite.config.ts`, `tsconfig.json`, and `biome.json` itself.

Patterns beginning with `!!` exclude entire directory trees from processing,
including `node_modules/`, `dist/`, and the listed caches. The single-`!` patterns
exclude the named npm JSON lockfiles. The project's `pnpm-lock.yaml` is already
outside the selected extensions.

Markdown, YAML, HTML, and SVG are outside this project's Biome scope. This is a
project choice, not a complete list of formats Biome supports. In particular,
`pnpm check` does not validate this guide's links or its fenced code examples.
File selection is explicit; this configuration does not enable Git ignore-file
integration.

## Basic usage

### Install and check

Run commands from the project root, where `package.json` and `biome.json` are:

```sh
pnpm install --frozen-lockfile
pnpm check
```

Use the project's Node.js 24+ and pnpm 12+ requirements. Installation brings in
Biome with the other development tools. A clean check exits successfully and
reports the number of checked files without changing them.

### Choose the right command

These are existing scripts in `package.json`:

| Command | What it checks or applies | Changes files? |
| --- | --- | --- |
| `pnpm lint` | Lint rules only | No |
| `pnpm lint:fix` | Available safe lint fixes | Yes |
| `pnpm format:check` | Formatting only | No |
| `pnpm format` | Formatting only | Yes |
| `pnpm check` | Lint, formatting, and import organization | No |
| `pnpm check:fix` | Safe lint fixes, formatting, and import organization | Yes |

Use `pnpm check` for the usual project-wide review. Use `lint` or `format:check`
when you want to isolate one kind of problem. Formatting alone does not fix lint
issues or organize imports.

### Resolve a failed check

1. Read the diagnostic's file, line, rule or category, and explanation.
2. Run `pnpm check:fix` to apply formatting and available safe fixes.
3. Review the edits. Correct remaining diagnostics manually based on the intended behavior.
4. Run `pnpm check` again.

None of the fix scripts uses `--unsafe`. A fix command can change some files and
still fail because other diagnostics remain. The `check:fix` script's `--write`
option applies formatting as well as safe fixes; it does not mean every reported
problem can be corrected automatically.

### Verify a completed change

```sh
pnpm check
pnpm typecheck
pnpm build
```

Expect no Biome diagnostics, no TypeScript errors, and production output in `dist/`.
`pnpm build` already runs type checking, so a separate `pnpm typecheck` is useful
for earlier feedback but is not required to repeat that check. Build does **not**
run Biome automatically. Verify affected interactions in a browser as well.

## Practical examples

### 1. Check or format one existing file

**Existing workflow:** target `src/features/home/home-page.tsx` through the local executable:

```sh
pnpm exec biome check src/features/home/home-page.tsx
pnpm exec biome format --write src/features/home/home-page.tsx
pnpm exec biome check src/features/home/home-page.tsx
```

The first command reports problems without editing. The second formats that file;
the final command checks whether lint or import issues still remain. To include
safe lint fixes and import organization for just that file, use:

```sh
pnpm exec biome check --write src/features/home/home-page.tsx
```

`pnpm exec` runs the installed tool directly. The existing `pnpm check` script
already contains `biome check .`, so use `pnpm exec` when choosing an explicit file
instead of adding another path to the project-wide script.

### 2. See what formatting changes

**Optional learning example:** this small exported function is valid TypeScript
but does not follow the configured formatting:

```ts
export function welcome(name:string){return "Hello, "+name}
```

Biome formats it as:

```ts
export function welcome(name: string) {
  return 'Hello, ' + name;
}
```

Notice the spacing, two-space indentation, single quotes, and semicolons. Formatting
preserves the function's behavior. This function is an illustration, not an existing
application feature; you do not need to add it to `src/`.

### 3. Fix a button diagnostic manually

**Optional native-button excerpt:** in a counter exercise that defines
`setCount`, the following JSX illustrates the
`useButtonType` rule:

```tsx
<button type="button" onClick={() => setCount((value) => value + 1)}>
  Try an interaction <span aria-hidden="true">↗</span>
</button>
```

This is a JSX fragment to use inside an optional counter component where `setCount` is defined. If you omit the
`type` prop, Biome reports `lint/a11y/useButtonType`. Choose `type="button"` for
this counter action. A submit button in a form should use `type="submit"` instead.
The correct choice depends on your intent, so inspect the component rather than
assuming a fix script can decide it.

After correcting the prop, run `pnpm check`. In the browser, click the button and
activate it with Enter or Space to verify that the counter still works.

### 4. Organize imports after a React exercise

**Existing configuration, recommended workflow:** when adding a component from
the [React guide](react.md), run:

```sh
pnpm exec biome check --write src/features/home/home-page.tsx
pnpm check
```

The targeted command organizes imports, formats the file, and applies available
safe lint fixes. The project-wide command also checks your new component file.
The current `src/main.tsx` imports React APIs, `RouterProvider`, the router through
`@/app/router`, and global CSS.
Keep the stylesheet import and preserve the matching Vite/TypeScript alias.
Use `import type` for symbols used only as types, as required by the project's
TypeScript configuration.

### 5. Format while editing

**Optional recommendation:** install the official Biome integration for your editor.
For VS Code:

1. Install the official Biome extension from the Visual Studio Marketplace.
2. Open this project's root and open a configured file such as `src/features/home/home-page.tsx`.
3. Run **Format Document With…**, then **Configure Default Formatter**, and select **Biome**.
4. Enable format on save in your editor settings if desired.

Use the project's local Biome version and `biome.json`. Format on save is an editor
convenience; continue to run `pnpm check` to check lint and import organization.
See the [official editor guide](https://biomejs.dev/configuration/editors/)
for other editors and optional fix-on-save settings. No editor settings are added
to this project by this example.

## Best practices

- Run `pnpm check` regularly; apply safe fixes and review the changes before finishing.
- Fix the cause of a diagnostic. Do not turn off recommended rules or add suppression
  comments just to make checks pass. Explain any justified, narrowly scoped exception.
- Keep lint, formatting, and type checking distinct. Each catches different problems;
  verify the UI when behavior or styles change.
- Use Biome as the formatter for the configured file types. Avoid competing formatters
  rewriting those same files on save.
- Edit source and configuration files; leave generated output, installed packages,
  and resolved lockfile records to their tools.
- When deliberately upgrading Biome within v2, update its exact dependency, lockfile,
  schema URL, and setup documentation together. Review changed rules and formatting.
- Keep documentation examples aligned with the current project. Check Markdown links
  and examples separately because they are outside the configured scope.

## Official references

- [Quick start](https://biomejs.dev/installation/quick-start/)
- [Configuration reference](https://biomejs.dev/reference/configuration/)
- [CLI reference](https://biomejs.dev/reference/cli/)
- [Button type rule](https://biomejs.dev/linter/rules/use-button-type/javascript/)
- [Editor setup](https://biomejs.dev/configuration/editors/)
