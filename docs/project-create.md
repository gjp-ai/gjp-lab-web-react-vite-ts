# Project creation guide

Follow these steps to create the current application manually, without a starter
template or project generator. File contents match the current repository; package
versions are deliberate snapshots, not instructions to install every future `latest`.

**Already working in this repository?** Use the [README quick start](../README.md#quick-start)
instead of reinitializing or replacing existing files. Follow [AGENTS.md](../AGENTS.md)
for contributor rules.

## Contents

- [1. Purpose and expected result](#1-purpose-and-expected-result)
- [2. Check prerequisites](#2-check-prerequisites)
- [3. Create the directory and initialize pnpm](#3-create-the-directory-and-initialize-pnpm)
- [4. Configure the manifest and pnpm](#4-configure-the-manifest-and-pnpm)
- [5. Install dependencies](#5-install-dependencies)
- [6. Add editor and ignore settings](#6-add-editor-and-ignore-settings)
- [7. Configure TypeScript and Vite](#7-configure-typescript-and-vite)
- [8. Configure Biome](#8-configure-biome)
- [9. Configure styling and local UI](#9-configure-styling-and-local-ui)
- [10. Create pages, routing, and the entry point](#10-create-pages-routing-and-the-entry-point)
- [11. Add project documentation](#11-add-project-documentation)
- [Testing configuration](#testing-configuration)
- [12. Run and verify the application](#12-run-and-verify-the-application)
- [13. Verify reproducibility and prepare deployment](#13-verify-reproducibility-and-prepare-deployment)
- [14. Final structure, troubleshooting, and references](#14-final-structure-troubleshooting-and-references)

## 1. Purpose and expected result

The result is a browser application with:

- Home: a responsive technology architecture diagram with application, interface, build, workspace, and testing layers.
- About: three reusable cards, reached through shared navigation.
- Typed code-based routing, a shared layout, and a not-found view.
- Local shadcn/ui Button and Card source, Base UI interaction, Tailwind CSS 4,
  and Lucide React icons.
- Biome lint/format checks, strict TypeScript, and Vite's Oxc/Rolldown pipeline.

Development uses `http://127.0.0.1:5174/lab/react/v2/`. Production output goes to
`dist/` and is intended to be hosted under `/lab/react/v2/`. There is no backend. React local state and a scoped Zustand
store manage client state; Query/Ky provide the server-state/transport foundation. Jest 30 runs unit tests and coverage, and React Testing
Library 16 supports component tests. Optional exercises in the
[technology guides](tech/README.md) are separate from this walkthrough.

## 2. Check prerequisites

Install **Node.js 24 or newer** and **pnpm 12 or newer** using the
[Node.js](tech/nodejs.md#install-nodejs) and [pnpm](tech/pnpm.md#install-pnpm) guides.
No exact runtime or package-manager pin is required. Verify both in your terminal:

```sh
node --version
pnpm --version
```

Expect major versions of at least 24 and 12 respectively. You also need an editor
and registry access to download uncached packages. The commands below run from
the project root. Use your editor to create folders/files where instructed;
the package commands work from a terminal on macOS, Linux, or Windows.

## 3. Create the directory and initialize pnpm

From the parent directory where you want the new project:

```sh
mkdir gjp-lab-web-react-vite-ts
cd gjp-lab-web-react-vite-ts
```

If it already exists, inspect it and any contributor instructions before continuing.
Use a new or empty project directory; do not nest another application inside the
existing repository or overwrite its source as a setup exercise.

Create the initial folders:

```sh
mkdir src
mkdir public
mkdir docs
```

Initialize only the package manifest:

```sh
pnpm init --bare --init-type module --no-init-package-manager
```

Expect `package.json`, not generated React source. `--init-type module` selects
ES modules; `--no-init-package-manager` avoids adding an exact pnpm version pin.
All remaining paths are relative to this project root.

## 4. Configure the manifest and pnpm

### Declare requirements and scripts

Replace the initial `package.json` with this starting manifest:

```json
{
  "name": "gjp-lab-web-react-vite-ts",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "engines": {
    "node": ">=24.0.0",
    "pnpm": ">=12.0.0"
  },
  "scripts": {
    "dev": "vite",
    "typecheck": "tsc --project tsconfig.json && tsc --project tsconfig.node.json",
    "build": "pnpm run typecheck && vite build",
    "preview": "vite preview",
    "lint": "biome lint .",
    "lint:fix": "biome lint --write .",
    "format": "biome format --write .",
    "format:check": "biome format .",
    "check": "biome check .",
    "check:fix": "biome check --write ."
  }
}
```

`private: true` prevents accidental package publication. `engines` declares the
minimum versions; the application's own `version` is unrelated to Node or pnpm.
Dependencies are intentionally absent until step 5. Do not run the application
scripts yet: the tools and source files are not present.

### Set pnpm behavior

Create `pnpm-workspace.yaml`:

```yaml
engineStrict: true
savePrefix: ''

# Platform binaries are supplied by optional dependencies; skip fallback build scripts.
allowBuilds:
  '@parcel/watcher': false
  unrs-resolver: false
minimumReleaseAgeExclude:
  - i18next@26.5.12
```

`engineStrict` enforces engine requirements during installation. The empty
`savePrefix` saves dependency versions exactly. This file holds pnpm settings even
though the project contains only one package. See [pnpm](tech/pnpm.md) for details.

## 5. Install dependencies

### Install application packages

These packages are used by browser components, routing, or local UI helpers:

```sh
pnpm add -E zustand@5.0.16 @tanstack/react-query@5.105.0 ky@2.2.0 i18next@26.5.12 react-i18next@17.1.9 @base-ui/react@1.9.0 @tanstack/react-router@1.170.46 class-variance-authority@0.7.1 clsx@2.1.1 lucide-react@1.61.0 react@19.3.1 react-dom@19.3.1 tailwind-merge@3.7.0
```

### Install development tools

These tools check types, compile CSS, run development/builds, or check code quality:

```sh
pnpm add -D -E @biomejs/biome@2.6.3 @tailwindcss/vite@4.3.3 @types/node@24.19.2 @types/react@19.3.0 @types/react-dom@19.3.0 @vitejs/plugin-react@6.1.2 tailwindcss@4.3.3 typescript@7.0.2 vite@8.3.5
```

`-E` saves exact versions; `-D` puts tools in `devDependencies`. These commands
update `package.json`, install `node_modules/`, and generate `pnpm-lock.yaml`.
Do not write the lockfile's resolved records by hand.

| Packages | Purpose |
| --- | --- |
| `react`, `react-dom` | Render the UI |
| `@tanstack/react-router` | Typed navigation and routing |
| `@base-ui/react` | Interaction primitives for local UI components |
| `lucide-react` | Inline SVG icons |
| `class-variance-authority`, `clsx`, `tailwind-merge` | Button variants and class merging |
| `typescript`, `@types/node`, `@types/react`, `@types/react-dom` | Type checking and API declarations |
| `vite`, `@vitejs/plugin-react` | Development server, React integration, and builds |
| `tailwindcss`, `@tailwindcss/vite` | Tailwind CSS 4 compilation |
| `@biomejs/biome` | Linting, formatting, and import organization |

Oxc and Rolldown are supplied through Vite. There is no separate shadcn runtime
package: step 9 adds owned component source. The Node type declarations follow
the Node 24 API baseline without pinning the installed Node runtime.

### Install testing tools

```sh
pnpm add -D -E msw@3.0.3 husky@9.1.7 lint-staged@17.6.0 jest@30.5.2 @jest/globals@30.5.2 jest-environment-jsdom@30.5.2 babel-jest@30.5.2 @babel/core@7.29.7 @babel/preset-env@7.29.7 @babel/preset-react@7.29.7 @babel/preset-typescript@7.29.7 @testing-library/react@16.3.3 @testing-library/dom@10.4.2
```

Jest transforms tests separately from Vite. Configuration and test suites are
added in the testing section below. The workspace settings explicitly skip
optional native fallback build scripts; prebuilt platform packages are used.

### Check the completed manifest

After installation, replace the manifest with the completed version below so
its scripts also include Jest and the test TypeScript project. The install
commands add packages; they do not create these scripts automatically:

```json
{
  "name": "gjp-lab-web-react-vite-ts",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "engines": {
    "node": ">=24.0.0",
    "pnpm": ">=12.0.0"
  },
  "scripts": {
    "dev": "vite",
    "typecheck": "tsc --project tsconfig.json && tsc --project tsconfig.node.json && tsc --project tsconfig.test.json",
    "build": "pnpm run typecheck && vite build",
    "preview": "vite preview",
    "lint": "biome lint .",
    "lint:fix": "biome lint --write .",
    "format": "biome format --write .",
    "format:check": "biome format .",
    "check": "biome check .",
    "check:fix": "biome check --write .",
    "test": "jest --runInBand",
    "test:watch": "jest --watchAll",
    "test:coverage": "jest --runInBand --coverage",
    "prepare": "node scripts/prepare.js"
  },
  "dependencies": {
    "@base-ui/react": "1.9.0",
    "@tanstack/react-query": "5.105.0",
    "@tanstack/react-router": "1.170.46",
    "class-variance-authority": "0.7.1",
    "clsx": "2.1.1",
    "i18next": "26.5.12",
    "ky": "2.2.0",
    "lucide-react": "1.61.0",
    "react": "19.3.1",
    "react-dom": "19.3.1",
    "react-i18next": "17.1.9",
    "tailwind-merge": "3.7.0",
    "zustand": "5.0.16"
  },
  "devDependencies": {
    "@babel/core": "7.29.7",
    "@babel/preset-env": "7.29.7",
    "@babel/preset-react": "7.29.7",
    "@babel/preset-typescript": "7.29.7",
    "@biomejs/biome": "2.6.3",
    "@jest/globals": "30.5.2",
    "@tailwindcss/vite": "4.3.3",
    "@testing-library/dom": "10.4.2",
    "@testing-library/react": "16.3.3",
    "@types/node": "24.19.2",
    "@types/react": "19.3.0",
    "@types/react-dom": "19.3.0",
    "@vitejs/plugin-react": "6.1.2",
    "babel-jest": "30.5.2",
    "husky": "9.1.7",
    "jest": "30.5.2",
    "jest-environment-jsdom": "30.5.2",
    "lint-staged": "17.6.0",
    "msw": "3.0.3",
    "tailwindcss": "4.3.3",
    "typescript": "7.0.2",
    "vite": "8.3.5"
  },
  "msw": {
    "workerDirectory": [
      "public"
    ]
  }
}
```

Inspect the direct packages:

```sh
pnpm list --depth 0
```

Expect the declared versions. For intentional future upgrades, review engine and
peer requirements first; keep the manifest and lockfile together.

## 6. Add editor and ignore settings

Create `.gitignore`:

```gitignore
node_modules/
dist/
.pnpm-store/
*.tsbuildinfo
*.log
.DS_Store
.env
.env.*
!.env.example
.vscode/*
!.vscode/extensions.json
!.vscode/settings.json

coverage/
```

Create `.editorconfig`:

```ini
root = true

[*]
charset = utf-8
indent_style = space
indent_size = 2
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true

[*.md]
trim_trailing_whitespace = false
```

Expect generated output, installed dependencies, and local environment files to
stay out of version control. The editor settings use UTF-8, two spaces, LF, and
final newlines; Markdown preserves intentional trailing spaces. A non-secret
`.env.example` may be tracked. Git initialization and remote setup are separate
repository-owner choices, not prerequisites for running the app.

## 7. Configure TypeScript and Vite

### Check browser and build-tool types

Create `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "jsx": "react-jsx",
    "types": ["vite/client"],
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "verbatimModuleSyntax": true,
    "isolatedModules": true,
    "noEmit": true,
    "allowImportingTsExtensions": true,
    "skipLibCheck": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "exclude": ["src/**/__tests__/**"]
}
```

Create `tsconfig.node.json`:

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "lib": ["ES2022"],
    "types": ["node"]
  },
  "include": ["vite.config.ts"]
}
```

The browser configuration checks `src/` using DOM types, JSX, and strict rules.
`noEmit` leaves generated output to Vite. `paths` lets TypeScript understand `@/`.
The second file checks `vite.config.ts` using Node types instead of DOM/Vite client
types. The `typecheck` script also runs `tsconfig.test.json`, created in the testing
section, for three projects in total. See [TypeScript](tech/typescript.md).

### Configure Vite and Tailwind integration

Create `vite.config.ts`:

```ts
import { fileURLToPath } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { appearanceHeadScript } from './build/appearance-head.ts';
import menuConfig from './src/features/navigation/config/menu.json' with { type: 'json' };
import { parseMenu } from './src/features/navigation/model/menu-schema.ts';

parseMenu(menuConfig);

export default defineConfig({
  base: '/lab/react/v2/',
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'appearance-before-paint',
      transformIndexHtml() {
        return [{ tag: 'script', children: appearanceHeadScript(), injectTo: 'head-prepend' }];
      },
    },
  ],
  server: {
    host: '127.0.0.1',
    port: 5174,
    strictPort: true,
    open: true,
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom/client'],
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [{ name: 'react-vendor', test: /\/node_modules\/(react|react-dom|scheduler)\// }],
        },
      },
    },
  },
});
```

| Setting | Expected behavior |
| --- | --- |
| `plugins` | React integration and Tailwind CSS 4 compilation |
| `base` | Public URLs begin with `/lab/react/v2/` |
| `server` | `127.0.0.1:5174`, strict port, automatic browser opening where supported |
| `resolve.alias` | Maps `@/` to `src/`, matching TypeScript |
| `optimizeDeps` | Explicitly prepares `react` and `react-dom/client` for development |
| `build` | Writes `dist/`, assets under `dist/assets/`, and production source maps |

Keep the base's trailing slash. The router will read this prefix in step 10.
TanStack uses code-based routes here, so no router Vite plugin is needed.
Vite retains Oxc transformation and Rolldown bundling; Tailwind handles CSS through
its own Vite integration. See [Vite](tech/vite.md) for focused configuration examples.

## 8. Configure Biome

Create `biome.json`:

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

This enables the recommended lint preset, import organization, and formatting:
two spaces, LF, width 100, JS/TS single quotes, JSX double quotes, and semicolons.
Tailwind directive parsing is enabled for the CSS in step 9.

The file pattern selects JS/TS/JSX/TSX, JSON/JSONC, and CSS. `!!` patterns exclude
dependency/build/cache directories; `!` patterns exclude named JSON lockfiles.
Markdown, YAML, HTML, SVG, and the pnpm lockfile are outside this configured scope.
Check documentation links and examples separately. See [Biome](tech/biome.md) for
lint-only, format-only, and combined commands. No second linter or formatter is needed.

## 9. Configure styling and local UI

Create these subdirectories using your editor before adding files:

```text
src/app/
src/features/home/
src/features/about/
src/features/navigation/components/
src/features/navigation/config/
src/features/navigation/model/
src/features/appearance/components/
src/features/appearance/model/
src/shared/lib/
src/shared/ui/
src/shared/routing/
docs/licenses/
```

### Add the stylesheet and theme

The complete stylesheet keeps the landing-page design and adds Tailwind theme tokens:

Create `src/app/styles.css`:

```css
@import "tailwindcss";
@custom-variant dark (&:where([data-mode="dark"], [data-mode="dark"] *));

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--muted);
  --color-secondary-foreground: var(--foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--primary);
  --color-destructive: var(--destructive);
  --radius-md: 0.5rem;
  --radius-lg: 0.625rem;
  --radius-xl: 0.75rem;
}

:root {
  --background: #f8fafc;
  --foreground: #17212f;
  --card: #ffffff;
  --muted: #e8edf3;
  --muted-foreground: #475569;
  --border: #e2e8f0;
  --input: #7c8798;
  --destructive: #b91c1c;
  --primary: var(--accent-light, #087a57);
  --primary-foreground: #ffffff;
  --primary-hover: color-mix(in srgb, var(--primary), #000000 12%);
  --primary-pressed: color-mix(in srgb, var(--primary), #000000 22%);
  font-family:
    Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  color: var(--foreground);
  background: var(--background);
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color-scheme: light;
}

* {
  box-sizing: border-box;
}
body {
  margin: 0;
  min-width: 320px;
}
button,
a {
  -webkit-tap-highlight-color: transparent;
}
button {
  font: inherit;
}
a {
  color: inherit;
}
:where(button:not([data-slot="button"])) span {
  margin-left: 16px;
}
:focus-visible {
  outline: 3px solid var(--primary);
  outline-offset: 5px;
}
.shell {
  width: min(1120px, 100% - 48px);
  margin-inline: auto;
}
.masthead {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding-block: 30px;
  border-bottom: 1px solid var(--border);
}
.brand {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 18px;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-decoration: none;
}
.badge {
  color: var(--muted-foreground);
  font-size: 13px;
}
.hero {
  padding-block: clamp(64px, 10vw, 120px);
}
.eyebrow {
  color: var(--primary);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.16em;
}
h1 {
  margin: 24px 0;
  font-size: clamp(40px, 6.5vw, 76px);
  line-height: 1.07;
  letter-spacing: -0.055em;
  font-weight: 600;
}
h1 span {
  color: var(--primary);
}
.intro {
  max-width: 580px;
  color: var(--muted-foreground);
  font-size: 18px;
  line-height: 1.7;
}
.demo {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 24px;
  margin-top: 32px;
}
button:not([data-slot="button"]) {
  border: 0;
  border-radius: 8px;
  padding: 15px 20px;
  background: var(--primary);
  color: var(--primary-foreground);
  font-weight: 650;
  cursor: pointer;
}
button:not([data-slot="button"]):hover {
  background: var(--primary-hover);
}
button:not([data-slot="button"]):active {
  background: var(--primary-pressed);
}
output {
  color: var(--muted-foreground);
  font-size: 14px;
  font-variant-numeric: tabular-nums;
}
.section-heading {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 22px;
}
h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 550;
  letter-spacing: -0.02em;
}
.stack-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 12px;
  margin: 0;
}
.stack-card {
  padding: 24px;
  border: 1px solid var(--border);
  border-radius: 10px;
  background: var(--card);
}
dt {
  color: var(--muted-foreground);
  font-size: 12px;
}
dd {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin: 18px 0 0;
  font-size: 23px;
  font-weight: 550;
}
dd span {
  color: var(--primary);
  font-size: 13px;
  font-weight: 400;
}
footer {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 12px;
  margin-top: 64px;
  padding-block: 24px;
  border-top: 1px solid var(--border);
  color: var(--muted-foreground);
  font-size: 12px;
}
.brand span {
  color: var(--primary);
}

.section-heading > span {
  color: var(--muted-foreground);
  font-size: 11px;
  letter-spacing: 0.12em;
}

@media (max-width: 480px) {
  .shell {
    width: calc(100% - 32px);
  }
  .masthead {
    align-items: flex-start;
    flex-direction: column;
    gap: 10px;
  }
  .intro {
    font-size: 16px;
  }
}

/* Shared navigation layout */
.app-layout {
  min-height: 100dvh;
}
.content-column {
  min-width: 0;
}
.desktop-sidebar {
  display: none;
}
.mobile-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  border-bottom: 1px solid var(--border);
}
.sidebar-toggle[data-slot="button"] {
  min-width: 44px;
  height: 44px;
  gap: 10px;
}
.menu-navigation {
  padding: 8px;
}
.menu-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 4px;
}
.menu-control,
.menu-control[data-slot="button"] {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  min-height: 44px;
  height: auto;
  padding: 10px;
  border-radius: 8px;
  text-decoration: none;
  text-align: left;
  justify-content: flex-start;
  white-space: normal;
  font-size: 14px;
}
.menu-control:hover {
  background: var(--muted);
}
.menu-current {
  background: var(--muted);
  color: var(--primary);
  font-weight: 700;
  box-shadow: inset 3px 0 var(--primary);
}
.menu-ancestor {
  color: var(--primary);
}
.menu-label {
  min-width: 0;
  overflow-wrap: anywhere;
  flex: 1;
}
.menu-chevron {
  flex-shrink: 0;
  transition: transform 150ms;
}
.menu-children {
  margin-left: 8px;
  border-left: 1px solid var(--border);
  padding-left: 4px;
}
.menu-children .menu-children .menu-children {
  margin-left: 0;
  padding-left: 0;
  border: 0;
}
.menu-tooltip-positioner {
  z-index: 70;
}
.menu-tooltip {
  max-width: 240px;
  overflow-wrap: anywhere;
  background: var(--foreground);
  color: var(--background);
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 13px;
}
.drawer-backdrop {
  position: fixed;
  inset: 0;
  z-index: 50;
  background: #0009;
}
.menu-drawer {
  position: fixed;
  inset: 0 auto 0 0;
  z-index: 60;
  width: min(280px, calc(100vw - 24px));
  background: var(--background);
  border-right: 1px solid var(--border);
  overflow-y: auto;
  padding: 16px 8px;
  transition: transform 160ms ease;
}
.menu-drawer[data-starting-style],
.menu-drawer[data-ending-style] {
  transform: translateX(-100%);
}
.drawer-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 0 8px;
}
.drawer-home {
  display: block;
  padding: 12px 16px;
  color: var(--muted-foreground);
  font-size: 13px;
}
.skip-link {
  position: fixed;
  top: 8px;
  left: 8px;
  z-index: 80;
  transform: translateY(-150%);
  padding: 12px;
  background: var(--primary);
  color: var(--primary-foreground);
  border-radius: 8px;
}
.skip-link:focus {
  transform: translateY(0);
}
#main-content:focus {
  outline-offset: 0;
}

@media (min-width: 1024px) {
  .app-layout {
    display: grid;
    grid-template-columns: 240px minmax(0, 1fr);
  }
  .sidebar-collapsed {
    grid-template-columns: 64px minmax(0, 1fr);
  }
  .desktop-sidebar {
    display: flex;
    flex-direction: column;
    position: sticky;
    top: 0;
    height: 100dvh;
    min-width: 0;
    border-right: 1px solid var(--border);
    padding-top: 24px;
  }
  .sidebar-brand {
    min-height: 44px;
    padding: 8px 18px;
  }
  .desktop-sidebar > .sidebar-toggle {
    margin: 12px 8px;
  }
  .sidebar-scroll {
    min-height: 0;
    overflow-y: auto;
    padding-block: 6px;
  }
  .sidebar-collapsed .desktop-brand-text {
    display: none;
  }
  .sidebar-collapsed .menu-control {
    justify-content: center;
  }
  .mobile-header {
    display: none;
  }
}
@media (prefers-reduced-motion: reduce) {
  .menu-drawer,
  .menu-chevron,
  .sidebar-toggle,
  .menu-control {
    transition: none;
  }
}

/* Accent reference swatches and mode-specific accessible shades. */
[data-accent="indigo"] {
  --accent-reference: #5e6ad2;
  --accent-light: #4e59b8;
  --accent-dark: #a5adff;
}
[data-accent="violet"] {
  --accent-reference: #533afd;
  --accent-light: #533afd;
  --accent-dark: #a99aff;
}
[data-accent="mint"] {
  --accent-reference: #3ecf8e;
  --accent-light: #087a57;
  --accent-dark: #3ecf8e;
}
[data-accent="sky"] {
  --accent-reference: #38bdf8;
  --accent-light: #036a96;
  --accent-dark: #38bdf8;
}
[data-accent="cyan"] {
  --accent-reference: #58c4dc;
  --accent-light: #087497;
  --accent-dark: #58c4dc;
}
[data-accent="orange"] {
  --accent-reference: #fc6d26;
  --accent-light: #b9430b;
  --accent-dark: #fc8d55;
}
[data-accent="blue"] {
  --accent-reference: #0061fe;
  --accent-light: #0052d9;
  --accent-dark: #78aaff;
}
[data-accent="blurple"] {
  --accent-reference: #5865f2;
  --accent-light: #4b55cf;
  --accent-dark: #a2aaff;
}
[data-accent="green"] {
  --accent-reference: #1ed760;
  --accent-light: #107c36;
  --accent-dark: #1ed760;
}
[data-accent="rose"] {
  --accent-reference: #e01e5a;
  --accent-light: #c0144b;
  --accent-dark: #ff80a6;
}

:root[data-mode="dark"] {
  color-scheme: dark;
  --background: #101722;
  --foreground: #eaf0f5;
  --card: #151e2b;
  --muted: #202d3c;
  --muted-foreground: #aebac8;
  --border: #2b3645;
  --input: #718096;
  --destructive: #ff8094;
  --primary: var(--accent-dark, #3ecf8e);
  --primary-foreground: #101722;
  --primary-hover: color-mix(in srgb, var(--primary), #ffffff 12%);
  --primary-pressed: color-mix(in srgb, var(--primary), #ffffff 22%);
}
.sidebar-appearance {
  margin-top: auto;
  padding: 12px 8px;
  border-top: 1px solid var(--border);
}
.appearance-trigger[data-slot="button"] {
  min-height: 44px;
  min-width: 44px;
  width: 100%;
  justify-content: flex-start;
  gap: 10px;
}
.sidebar-collapsed .appearance-trigger[data-slot="button"] {
  justify-content: center;
}
.mobile-actions {
  display: flex;
  gap: 4px;
  align-items: center;
}
.appearance-dialog {
  position: fixed;
  z-index: 60;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: min(480px, calc(100vw - 24px));
  max-height: calc(100dvh - 32px);
  overflow-y: auto;
  background: var(--card);
  color: var(--foreground);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 16px 64px #0004;
}
.appearance-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}
.appearance-description {
  color: var(--muted-foreground);
  font-size: 14px;
  margin: 8px 0 24px;
}
.appearance-fieldset {
  padding: 0;
  margin: 0 0 24px;
  border: 0;
  min-width: 0;
}
.appearance-fieldset legend {
  font-size: 14px;
  font-weight: 650;
  margin-bottom: 10px;
}
.mode-options,
.accent-options {
  display: grid;
  gap: 8px;
}
.mode-options {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}
.accent-options {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}
.appearance-option {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 48px;
  padding: 10px;
  border: 1px solid var(--border);
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  min-width: 0;
}
.appearance-option:has(input:checked) {
  background: var(--muted);
  border-color: var(--primary);
  box-shadow: inset 0 0 0 1px var(--primary);
  font-weight: 650;
}
.appearance-option:has(input:focus-visible) {
  outline: 3px solid var(--primary);
  outline-offset: 3px;
}
.appearance-option input {
  margin: 0;
  accent-color: var(--primary);
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}
.appearance-option input:focus-visible {
  outline: none;
}
.accent-swatch {
  background: var(--accent-reference);
  width: 16px;
  height: 16px;
  border-radius: 50%;
  flex-shrink: 0;
  border: 1px solid var(--border);
}
.appearance-footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  font-size: 12px;
  color: var(--muted-foreground);
}
.appearance-reset[data-slot="button"] {
  height: 44px;
}
@media (max-width: 400px) {
  .appearance-dialog {
    padding: 16px;
  }
  .mode-options {
    grid-template-columns: 1fr;
  }
  .mobile-header {
    padding-inline: 16px;
    gap: 8px;
  }
  .appearance-option {
    gap: 6px;
    padding: 8px;
  }
}

[data-slot="button"][data-variant="default"] {
  background: var(--primary);
  color: var(--primary-foreground);
}
[data-slot="button"][data-variant="default"]:hover {
  background: var(--primary-hover);
}
[data-slot="button"][data-variant="default"]:active {
  background: var(--primary-pressed);
}

.mobile-actions .appearance-trigger[data-slot="button"] {
  width: 44px;
  justify-content: center;
}

/* Home: the Layered stack design. */
.content-column:has(.stack-home) {
  width: min(1440px, calc(100% - 64px));
}
.content-column:has(.stack-home) > footer {
  margin-top: 24px;
  padding-block: 18px;
  font-size: 13px;
}
.stack-home {
  padding-block: 32px 4px;
}
.stack-home-heading {
  margin-bottom: 24px;
}
.stack-home-heading .eyebrow {
  margin: 0 0 10px;
  color: var(--muted-foreground);
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.12em;
}
.stack-home-heading h1 {
  margin: 0;
  font-size: clamp(30px, 3.3vw, 44px);
  line-height: 1.18;
  letter-spacing: -0.045em;
  font-weight: 550;
}
.stack-home-intro {
  margin: 12px 0 0;
  color: var(--muted-foreground);
  font-size: 18px;
  line-height: 1.6;
}
.stack-layers {
  margin: 0;
  container-type: inline-size;
}
.stack-layer {
  display: grid;
  grid-template-columns: 160px minmax(0, 1fr);
  align-items: start;
  gap: 28px;
  padding-block: 20px;
  border-top: 1px solid var(--border);
}
.stack-layer-label {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0;
  padding-top: 7px;
  font-size: 16px;
  line-height: 1.5;
  font-weight: 500;
  color: var(--muted-foreground);
  letter-spacing: 0;
}
.stack-layer-label > span {
  font-size: 13px;
  font-family: ui-monospace, monospace;
  color: var(--primary);
}
.stack-application,
.stack-interface,
.stack-workspace {
  list-style: none;
  padding: 0;
  margin: 0;
  min-width: 0;
}
.stack-technology {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  min-width: 0;
  min-height: 36px;
  font-size: 18px;
  line-height: 1.5;
}
.stack-language > svg {
  width: 20px;
  height: 20px;
  color: var(--primary);
}
.stack-technology > svg,
.stack-build-source > svg {
  width: 22px;
  height: 22px;
  flex-shrink: 0;
  color: var(--primary);
  stroke-width: 1.7;
}
.stack-technology > span {
  overflow-wrap: anywhere;
}
.stack-version {
  font-size: 13px;
  font-family: ui-monospace, monospace;
  font-weight: 400;
  color: var(--muted-foreground);
}
.stack-application {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px 32px;
  padding: 12px 18px;
  background: color-mix(in srgb, var(--primary) 5%, var(--card));
  border-radius: 10px;
}
.stack-application .stack-technology {
  font-size: 22px;
  font-weight: 500;
}
.stack-interface {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 260px));
  gap: 8px 32px;
}
.stack-workspace {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px 32px;
}
.stack-build {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 18px;
  min-width: 0;
}
.stack-build > li {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 36px;
  font-size: 18px;
}
.stack-build-engine,
.stack-build-output {
  column-gap: 18px;
}
.stack-flow-arrow {
  width: 15px;
  height: 15px;
  flex-shrink: 0;
  color: var(--muted-foreground);
}
.stack-vite {
  min-width: 184px;
  padding: 12px 16px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--card);
}
.stack-vite > div {
  display: flex;
  align-items: center;
  gap: 8px;
}
.stack-vite > div > svg {
  width: 20px;
  height: 20px;
  color: var(--primary);
}
.stack-vite strong {
  font-size: 18px;
  font-weight: 550;
}
.stack-vite p {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 8px 0 0;
  font-size: 15px;
  color: var(--muted-foreground);
}
.stack-vite p > svg {
  width: 12px;
  height: 12px;
}
.stack-build-output small {
  display: block;
  margin-top: 5px;
  font-size: 13px;
  color: var(--muted-foreground);
}
.stack-application .stack-technology > svg {
  width: 24px;
  height: 24px;
}
@container (max-width: 650px) {
  .stack-layer {
    grid-template-columns: 1fr;
    gap: 12px;
    padding-block: 18px;
  }
  .stack-layer-label {
    padding-top: 0;
  }
  .stack-application {
    padding: 12px 14px;
  }
}
@container (max-width: 400px) {
  .stack-interface {
    grid-template-columns: 1fr;
    gap: 8px;
  }
  .stack-application {
    gap: 12px;
  }
  .stack-application .stack-technology {
    font-size: 20px;
  }
  .stack-workspace {
    gap: 8px 20px;
  }
  .stack-build {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }
  .stack-build > li {
    min-height: 0;
  }
  .stack-build-engine,
  .stack-build-output {
    flex-direction: column;
    align-items: stretch;
  }
  .stack-build > .stack-build-engine,
  .stack-build > .stack-build-output {
    align-items: stretch;
    gap: 10px;
  }
  .stack-flow-arrow {
    transform: rotate(90deg);
    align-self: center;
  }
  .stack-build-output > span {
    padding-block: 5px;
  }
}

@media (max-width: 600px) {
  .content-column:has(.stack-home) {
    width: calc(100% - 32px);
  }
  .stack-home {
    padding-top: 24px;
  }
  .stack-home-intro {
    font-size: 16px;
  }
}

.stack-testing {
  display: flex;
  flex-wrap: wrap;
  gap: 16px 32px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.stack-testing > li {
  display: grid;
  gap: 6px;
}
.stack-test-role {
  color: var(--muted-foreground);
  font-size: 14px;
}

.stack-heading-top {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.stack-language {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--muted-foreground);
  font-size: 15px;
}
.stack-language select {
  max-width: 100%;
  border: 1px solid var(--input);
  border-radius: 6px;
  padding: 6px 10px;
  color: var(--foreground);
  background: var(--background);
}
```

The opening import loads Tailwind CSS 4. `@theme inline` maps semantic utilities
such as `text-primary` to variables in `:root`. The root variables provide light defaults; dark-mode
overrides and ten accent presets follow. Appearance controls select the resolved
mode and accent at the document root. Custom CSS supplies landing-page layout and
responsive adjustments. Legacy native-button styles exclude `data-slot="button"`
so they do not override the shared UI Button. See [Tailwind CSS](tech/tailwindcss.md).

### Configure shadcn/ui source locations

Create `components.json`:

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "base-nova",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/app/styles.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "iconLibrary": "lucide",
  "aliases": {
    "components": "@/shared/components",
    "utils": "@/shared/lib/utils",
    "ui": "@/shared/ui",
    "lib": "@/shared/lib",
    "hooks": "@/shared/hooks"
  }
}
```

`base-nova` selects the Base UI style; Lucide supplies its icons. `rsc: false`
reflects this browser-rendered application. The blank Tailwind config path is
intentional for v4. Aliases identify source locations; an entry such as `@/shared/hooks`
does not create a folder or install a hook.

### Add the class helper

Create `src/shared/lib/utils.ts`:

```ts
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

`clsx` combines class inputs and `tailwind-merge` resolves recognized conflicting
utilities. This helper is imported by the local UI source below.

### Add Button and Card

These complete components come from the official shadcn/ui
[Base Nova Button](https://ui.shadcn.com/r/styles/base-nova/button.json) and
[Base Nova Card](https://ui.shadcn.com/r/styles/base-nova/card.json) registry source.
Their `cn` imports are mapped to this project's helper, with type-only imports
and Biome formatting applied. Copy the following files; no CLI initialization or
application template is required.

Create `src/shared/ui/button.tsx`:

```tsx
import { Button as ButtonPrimitive } from '@base-ui/react/button';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/lib/utils';

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/80',
        outline:
          'border-input bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] aria-expanded:bg-secondary aria-expanded:text-secondary-foreground',
        ghost:
          'hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50',
        destructive:
          'bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default:
          'h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2',
        xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: 'h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2',
        icon: 'size-8',
        'icon-xs':
          "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        'icon-sm':
          'size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg',
        'icon-lg': 'size-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

function Button({
  className,
  variant = 'default',
  size = 'default',
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      data-variant={variant}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
```

Create `src/shared/ui/card.tsx`:

```tsx
import type * as React from 'react';
import { cn } from '@/shared/lib/utils';

function Card({
  className,
  size = 'default',
  ...props
}: React.ComponentProps<'div'> & { size?: 'default' | 'sm' }) {
  return (
    <div
      data-slot="card"
      data-size={size}
      className={cn(
        'group/card flex flex-col gap-(--card-spacing) overflow-hidden rounded-xl bg-card py-(--card-spacing) text-sm text-card-foreground ring-1 ring-foreground/10 [--card-spacing:--spacing(4)] has-data-[slot=card-footer]:pb-0 has-[>img:first-child]:pt-0 data-[size=sm]:[--card-spacing:--spacing(3)] data-[size=sm]:has-data-[slot=card-footer]:pb-0 *:[img:first-child]:rounded-t-xl *:[img:last-child]:rounded-b-xl',
        className,
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        'group/card-header @container/card-header grid auto-rows-min items-start gap-1 rounded-t-xl px-(--card-spacing) has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto] [.border-b]:pb-(--card-spacing)',
        className,
      )}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        'cn-font-heading text-base leading-snug font-medium group-data-[size=sm]/card:text-sm',
        className,
      )}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-description"
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  );
}

function CardAction({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-action"
      className={cn('col-start-2 row-span-2 row-start-1 self-start justify-self-end', className)}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div data-slot="card-content" className={cn('px-(--card-spacing)', className)} {...props} />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        'flex items-center rounded-b-xl border-t bg-muted/50 p-(--card-spacing)',
        className,
      )}
      {...props}
    />
  );
}

export { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle };
```

Button wraps Base UI. Card is presentational; put a real heading inside CardTitle.
Use Button for actions and typed router Links for navigation; `buttonVariants`
can style a Link when needed. Keep Base UI APIs instead of copying Radix-specific
`asChild` examples. Further component additions are optional, covered in
[shadcn/ui and Base UI](tech/shadcn-ui.md).

### Preserve the upstream license

Keep the complete upstream MIT notice with the copied source:

Create `docs/licenses/shadcn-ui.txt`:

```text
MIT License

Copyright (c) 2023 shadcn

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

The [upstream license](https://github.com/shadcn-ui/ui/blob/main/LICENSE.md)
is also available for reference. Review local customizations before replacing
copied components during a future update.

## 10. Create pages, routing, and the entry point

The next files connect the UI. Complete this step before starting development;
some imports refer to files created later in the step.

### Create Home and About

Create `src/features/home/home-page.tsx`:

```tsx
import {
  ArrowRight,
  Atom,
  ChartNoAxesColumn,
  CheckCheck,
  Component,
  Database,
  Feather,
  FileCode2,
  FlaskConical,
  GitBranch,
  Globe,
  Languages,
  Layers3,
  type LucideIcon,
  Navigation,
  Network,
  Package,
  Store,
  Terminal,
  TestTubeDiagonal,
  Wind,
  Zap,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { i18n } from '@/shared/i18n/i18n';

const applicationStack = [
  { name: 'React', version: '19', icon: Atom },
  { name: 'TanStack Router', version: '1', icon: Navigation },
] as const;

const interfaceStack = [
  { name: 'shadcn/ui', icon: Component },
  { name: 'Base UI', version: '1', icon: Layers3 },
  { name: 'Tailwind CSS', version: '4', icon: Wind },
  { name: 'Lucide React', version: '1', icon: Feather },
] as const;

const workspace = [
  { name: 'Node.js', version: '24+', icon: Terminal },
  { name: 'pnpm', version: '12+', icon: Package },
  { name: 'Biome', version: '2', icon: CheckCheck },
  { name: 'Husky', version: '9', icon: GitBranch },
  { name: 'lint-staged', version: '17', icon: CheckCheck },
] as const;

function Technology({
  name,
  version,
  icon: Icon,
}: {
  readonly name: string;
  readonly version?: string;
  readonly icon: LucideIcon;
}) {
  return (
    <li className="stack-technology">
      <Icon aria-hidden="true" />
      <span>{name}</span>
      {version && <small className="stack-version">{version}</small>}
    </li>
  );
}

export default function HomePage() {
  const { t } = useTranslation('home', { i18n });
  return (
    <section className="stack-home" aria-labelledby="stack-home-title">
      <header className="stack-home-heading">
        <div className="stack-heading-top">
          <p className="eyebrow" lang="en">
            GJP LAB / FOUNDATION
          </p>
          <label className="stack-language">
            <Languages aria-hidden="true" />
            <select
              aria-label={t('language')}
              value={i18n.resolvedLanguage ?? 'en'}
              onChange={(event) => {
                void i18n.changeLanguage(event.currentTarget.value);
              }}
            >
              <option value="en" lang="en">
                English
              </option>
              <option value="zh" lang="zh">
                中文
              </option>
            </select>
          </label>
        </div>
        <h1 id="stack-home-title">{t('title')}</h1>
        <p className="stack-home-intro">{t('intro')}</p>
      </header>

      <figure className="stack-layers" aria-labelledby="stack-caption">
        <figcaption id="stack-caption" className="sr-only">
          {t('description')}
        </figcaption>

        <section className="stack-layer" aria-labelledby="application-title">
          <h2 id="application-title" className="stack-layer-label">
            <span aria-hidden="true">01</span> {t('application')}
          </h2>
          <ul className="stack-application">
            {applicationStack.map((technology) => (
              <Technology key={technology.name} {...technology} />
            ))}
          </ul>
        </section>

        <section className="stack-layer" aria-labelledby="interface-title">
          <h2 id="interface-title" className="stack-layer-label">
            <span aria-hidden="true">02</span> {t('interface')}
          </h2>
          <ul className="stack-interface">
            {interfaceStack.map((technology) => (
              <Technology key={technology.name} {...technology} />
            ))}
          </ul>
        </section>

        <section className="stack-layer" aria-labelledby="data-title">
          <h2 id="data-title" className="stack-layer-label">
            <span aria-hidden="true">03</span> {t('data')}
          </h2>
          <ul className="stack-testing">
            <li>
              <span className="stack-test-role">{t('clientState')}</span>
              <ul className="stack-workspace">
                <Technology name="React State" icon={Atom} />
                <Technology name="Zustand" version="5" icon={Store} />
              </ul>
            </li>
            <li>
              <span className="stack-test-role">{t('serverState')}</span>
              <ul className="stack-workspace">
                <Technology name="TanStack Query" version="5" icon={Database} />
              </ul>
            </li>
            <li>
              <span className="stack-test-role">{t('http')}</span>
              <ul className="stack-workspace">
                <Technology name="Ky" version="2" icon={Network} />
              </ul>
            </li>
            <li>
              <span className="stack-test-role">{t('internationalization')}</span>
              <ul className="stack-workspace">
                <Technology name="i18next" version="26" icon={Globe} />
                <Technology name="react-i18next" version="17" icon={Languages} />
              </ul>
            </li>
          </ul>
        </section>

        <section className="stack-layer" aria-labelledby="build-title">
          <h2 id="build-title" className="stack-layer-label">
            <span aria-hidden="true">04</span> {t('build')}
          </h2>
          <ol className="stack-build" aria-label={t('pipeline')}>
            <li className="stack-build-source">
              <FileCode2 aria-hidden="true" />
              <span>TypeScript</span>
              <small className="stack-version">7</small>
            </li>
            <li className="stack-build-engine">
              <ArrowRight className="stack-flow-arrow" aria-hidden="true" />
              <div className="stack-vite">
                <div>
                  <Zap aria-hidden="true" />
                  <strong>Vite</strong>
                  <small className="stack-version">8</small>
                </div>
                <p>
                  <span>Oxc</span>
                  <ArrowRight aria-hidden="true" />
                  <span>Rolldown</span>
                </p>
                <span className="sr-only">Oxc transforms source; Rolldown bundles it.</span>
              </div>
            </li>
            <li className="stack-build-output">
              <ArrowRight className="stack-flow-arrow" aria-hidden="true" />
              <span>
                {t('assets')}
                <small>HTML · CSS · JS</small>
              </span>
            </li>
          </ol>
        </section>

        <section className="stack-layer" aria-labelledby="workspace-title">
          <h2 id="workspace-title" className="stack-layer-label">
            <span aria-hidden="true">05</span> {t('workspace')}
          </h2>
          <ul className="stack-workspace">
            {workspace.map((technology) => (
              <Technology key={technology.name} {...technology} />
            ))}
          </ul>
        </section>

        <section className="stack-layer" aria-labelledby="testing-title">
          <h2 id="testing-title" className="stack-layer-label">
            <span aria-hidden="true">06</span> {t('testing')}
          </h2>
          <ul className="stack-testing">
            <li>
              <span className="stack-test-role">{t('unitTesting')}</span>
              <span className="stack-technology">
                <FlaskConical aria-hidden="true" />
                Jest<small className="stack-version">30</small>
              </span>
            </li>
            <li>
              <span className="stack-test-role">{t('componentTesting')}</span>
              <span className="stack-technology">
                <TestTubeDiagonal aria-hidden="true" />
                React Testing Library<small className="stack-version">16</small>
              </span>
            </li>
            <li>
              <span className="stack-test-role">{t('coverage')}</span>
              <span className="stack-technology">
                <ChartNoAxesColumn aria-hidden="true" />
                Jest
              </span>
            </li>
            <li>
              <span className="stack-test-role">{t('mocking')}</span>
              <span className="stack-technology">
                <Network aria-hidden="true" />
                MSW<small className="stack-version">3</small>
              </span>
            </li>
          </ul>
        </section>
      </figure>
    </section>
  );
}
```

Create `src/features/about/about-page.tsx`:

```tsx
import { Code2, Compass, Layers } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';

export function AboutPage() {
  return (
    <section lang="en" className="hero" aria-labelledby="about-title">
      <p className="eyebrow">BUILT TO EXPLORE</p>
      <h1 id="about-title">
        A little structure.
        <br />
        <span>More possibilities.</span>
      </h1>
      <p className="intro">
        A place to try ideas with typed navigation, reusable components, and a consistent visual
        language.
      </p>
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <Compass className="mb-3 size-6 text-primary" aria-hidden="true" />
            <CardTitle>
              <h2>Find your way</h2>
            </CardTitle>
            <CardDescription>TanStack Router</CardDescription>
          </CardHeader>
          <CardContent>
            Home and About share one layout. Links keep you inside the app’s hosting path.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Layers className="mb-3 size-6 text-primary" aria-hidden="true" />
            <CardTitle>
              <h2>Build with care</h2>
            </CardTitle>
            <CardDescription>shadcn/ui and Base UI</CardDescription>
          </CardHeader>
          <CardContent>
            Local components pair accessible interaction primitives with Tailwind CSS 4 styling.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Code2 className="mb-3 size-6 text-primary" aria-hidden="true" />
            <CardTitle>
              <h2>Make it yours</h2>
            </CardTitle>
            <CardDescription>Lucide React</CardDescription>
          </CardHeader>
          <CardContent>
            Small, consistent icons support clear labels and keyboard-friendly controls.
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
```

Home renders a semantic architecture figure with application, interface, build,
workspace, and testing sections. It
uses numbered layers and content-width container queries rather than a diagram dependency.
See the [Home code design](implement/home.md) for the layered layout and extension points. About demonstrates
Card composition and Lucide icons. Decorative icons are hidden because nearby
text supplies their meaning. See [React](tech/react.md) and [Lucide React](tech/lucide-react.md).

### Create the shared layout

The current layout uses a JSON-driven collapsible sidebar. Supporting modules
listed below are required by AppShell, the entry, and Vite configuration; create
them before running development or builds.

Before composing the layout, create the remaining feature modules and the Node-only
build helper from their current source. Each link gives the complete file; keep
the same feature-based path and imports:

- [src/features/navigation/config/menu.json](../src/features/navigation/config/menu.json)
- [src/features/navigation/model/menu-schema.ts](../src/features/navigation/model/menu-schema.ts)
- [src/shared/routing/route-paths.ts](../src/shared/routing/route-paths.ts)
- [src/features/navigation/components/menu-navigation.tsx](../src/features/navigation/components/menu-navigation.tsx)
- [src/features/appearance/model/appearance.ts](../src/features/appearance/model/appearance.ts)
- [src/features/appearance/components/appearance-provider.tsx](../src/features/appearance/components/appearance-provider.tsx)
- [src/features/appearance/components/appearance-settings.tsx](../src/features/appearance/components/appearance-settings.tsx)
- [build/appearance-head.ts](../build/appearance-head.ts)

See [Architecture](implement/architecture.md) for ownership and dependency rules.

Create `src/app/app-shell.tsx`:

```tsx
import { Dialog } from '@base-ui/react/dialog';
import { Tooltip } from '@base-ui/react/tooltip';
import { Link, Outlet, useRouter, useRouterState } from '@tanstack/react-router';
import { FlaskConical, Menu, PanelLeftClose, PanelLeftOpen, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import menuConfig from '@/features/navigation/config/menu.json';
import { activeGroups, parseMenu } from '@/features/navigation/model/menu-schema';
import { cn } from '@/shared/lib/utils';
import type { MenuTarget } from '@/shared/routing/route-paths';
import { AppearanceSettings } from '../features/appearance/components/appearance-settings';
import { MenuNavigation } from '../features/navigation/components/menu-navigation';
import { Button } from '../shared/ui/button';

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
          <Link className="brand sidebar-brand" to="/" aria-label="GJP Lab home">
            {brand}
          </Link>
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
            {!collapsed && <span>Collapse menu</span>}
          </Button>
          <div id="desktop-menu" className="sidebar-scroll">
            <MenuNavigation {...navigation} collapsed={collapsed} />
          </div>
          <div className="sidebar-appearance">
            <AppearanceSettings compact={collapsed} />
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
              <AppearanceSettings compact />
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
```

AppShell keeps one main content landmark, desktop navigation, a mobile drawer,
Outlet, and footer. The shared menu supports nested groups and saved collapse state. Home uses exact
active matching. The Outlet is where the matched page appears; do not duplicate
this layout inside each page.

### Register routes and router types

Create `src/app/router.tsx`:

```tsx
import { createRootRoute, createRoute, createRouter, Link } from '@tanstack/react-router';
import { AppShell } from '@/app/app-shell';
import { AboutPage } from '@/features/about/about-page';
import HomePage from '@/features/home/home-page';
import { routePaths } from '@/shared/routing/route-paths';

const rootRoute = createRootRoute({
  component: AppShell,
  notFoundComponent: () => (
    <section lang="en" className="hero">
      <p className="eyebrow">PAGE NOT FOUND</p>
      <h1>Let’s head home.</h1>
      <Link to="/" className="text-primary underline underline-offset-4">
        Return to Home
      </Link>
    </section>
  ),
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: routePaths.home,
  component: HomePage,
});
const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: routePaths.about,
  component: AboutPage,
});
const routeTree = rootRoute.addChildren([homeRoute, aboutRoute]);

export const router = createRouter({
  routeTree,
  basepath: import.meta.env.BASE_URL,
  scrollRestoration: true,
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
```

The route tree attaches Home and About to the root. The root also handles missing
paths. `Register` connects router types to navigation APIs; keep it when adding
routes. `basepath` reads Vite's `BASE_URL`, so `Link to="/about"` navigates to
`/lab/react/v2/about`. Do not repeat the hosting prefix in link targets.
Scroll restoration is enabled. See [TanStack Router](tech/tanstack-router.md).

### Mount React and add HTML/assets

Before creating the entry, add the installed stack modules at their linked paths:

- [src/app/providers.tsx](../src/app/providers.tsx)
- [src/app/query-client.ts](../src/app/query-client.ts)
- [src/app/prepare.ts](../src/app/prepare.ts)
- [src/app/mocks/browser.ts](../src/app/mocks/browser.ts)
- [src/shared/api/http.ts](../src/shared/api/http.ts)
- [src/shared/i18n/i18n.ts](../src/shared/i18n/i18n.ts)
- [src/features/appearance/model/appearance-store.ts](../src/features/appearance/model/appearance-store.ts)
- [scripts/prepare.js](../scripts/prepare.js)
- [lint-staged.config.js](../lint-staged.config.js)
- [.husky/pre-commit](../.husky/pre-commit)
- [.env.example](../.env.example)

Generate the MSW worker after installing its development dependency:

```sh
pnpm exec msw init public --save
```

It is opt-in for development and not started in production. The Husky prepare
script safely skips a folder without Git metadata. See
[Stack integration](implement/stack.md) for responsibilities and activation.

Create `src/main.tsx`:

```tsx
import { RouterProvider } from '@tanstack/react-router';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { prepareApplication } from '@/app/prepare';
import { AppProviders } from '@/app/providers';
import { router } from '@/app/router';
import './app/styles.css';

const root = document.getElementById('root');

if (!root) {
  throw new Error('The application root element was not found.');
}

void prepareApplication()
  .then(() => {
    createRoot(root).render(
      <StrictMode>
        <AppProviders>
          <RouterProvider router={router} />
        </AppProviders>
      </StrictMode>,
    );
  })
  .catch((error: unknown) => {
    root.textContent = 'The application could not start. Please reload the page.';
    console.error('Application initialization failed.', error);
  });
```

Create `index.html`:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#101722" />
    <meta name="description" content="GJP Lab — a playground for ideas, built with React and TypeScript." />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <title>GJP Lab</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

Create `public/favicon.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="16" fill="#101722" />
  <path d="M43 22a16 16 0 1 0 2 18V32H32" fill="none" stroke="#a8efcb" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" />
</svg>
```

The HTML root is found and checked before mounting. StrictMode wraps
AppearanceProvider and RouterProvider, and the entry imports the global stylesheet once. Vite processes
`index.html`, including its module script and favicon reference, and prefixes
build asset URLs with the configured base. Files in `public/` are copied to output.
All application source and configuration are now present.

## 11. Add project documentation

For a new project, add a concise README and contributor rules. The examples below
are **starting versions**, not copies of this repository's fuller documentation.
When working here, maintain the existing [README](../README.md) and [AGENTS](../AGENTS.md).

Create `README.md` with a starting overview:

```markdown
# GJP Lab

Manually created React 19 + TypeScript 7 + Vite 8 app.
Home and About use TanStack Router, shadcn/ui with Base UI, Tailwind CSS 4, and Lucide.
Requires Node.js 24+ and pnpm 12+.

Run `pnpm install --frozen-lockfile` after checkout, then `pnpm dev`.
Open http://127.0.0.1:5174/lab/react/v2/ and stop development with Ctrl+C.
Run `pnpm check` and `pnpm build` before completing source changes.
Build includes application, configuration, and test type checks. Run
`pnpm test:coverage` separately for the 90% global coverage gate.
Use `pnpm check:fix` for safe fixes and formatting, then review and recheck.
Use `pnpm preview` after building for local verification.
Deploy dist/ contents under /lab/react/v2/ with an app fallback to /lab/react/v2/index.html.
```

Create `AGENTS.md` with a starting rule set:

```markdown
# Contributor instructions

- Keep React 19, TypeScript 7, Vite 8, and the integrated Oxc/Rolldown pipeline.
- Require Node.js 24+ and pnpm 12+ without exact runtime/package-manager pins.
- Use pnpm, exact dependency versions, and an accompanying updated lockfile.
- Keep code-based routes in src/app/router.tsx and shared layout in AppShell.
- Preserve /lab/react/v2/ and use typed links without repeating the hosting prefix.
- Reuse local Base UI-backed controls, Tailwind tokens, and named Lucide icons.
- Use buttons for actions, links for navigation, and accessible labels for controls.
- Preserve strict TypeScript, StrictMode, semantic headings, and the upstream UI license.
- For source, dependency, or build-configuration changes, run pnpm check and pnpm build.
- Verify affected UI/routing in a browser. For prose-only edits, check links and consistency;
  verify executable documentation examples separately when they change.
- Never commit secrets, local .env files, node_modules/, or dist/.
```

Save this guide as `docs/project-create.md` if keeping the setup walkthrough with
the new project. This repository's `docs/tech/` already contains learning guides;
they are documentation, not files generated by the dependency commands. Keep
existing features and optional exercises clearly labeled.

## Testing configuration

Create `jest.config.js`:

```js
/** @type {import('jest').Config} */
export default {
  testEnvironment: 'node',
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.test.{js,ts,tsx}',
    '<rootDir>/tests/**/*.test.{js,ts,tsx}',
  ],
  clearMocks: true,
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.css$': '<rootDir>/tests/support/style.js',
  },
  transformIgnorePatterns: [
    'node_modules/(?!\\.pnpm/|msw/|ky/|cookie/|tough-cookie/|headers-polyfill/|set-cookie-parser/|@msw/|@mswjs/|is-node-process/|rettime/|until-async/|@open-draft/)',
  ],
  transform: {
    '^.+\\.[cm]?[jt]sx?$': [
      'babel-jest',
      {
        babelrc: false,
        configFile: false,
        plugins: ['./tests/support/vite-base-transform.js'],
        presets: [
          ['@babel/preset-env', { targets: { node: 'current' } }],
          ['@babel/preset-react', { runtime: 'automatic' }],
          '@babel/preset-typescript',
        ],
      },
    ],
  },
  collectCoverageFrom: ['src/**/*.{ts,tsx}', 'build/**/*.ts', '!src/**/__tests__/**'],
  coverageProvider: 'v8',
  coverageThreshold: {
    global: { statements: 90, branches: 90, functions: 90, lines: 90 },
  },
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'html', 'lcov'],
};
```

Create `tsconfig.test.json`:

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "types": ["node", "vite/client"]
  },
  "include": [
    "src/**/__tests__/**/*.ts",
    "src/**/__tests__/**/*.tsx",
    "tests/**/*.ts",
    "tests/**/*.tsx"
  ],
  "exclude": []
}
```

The completed manifest includes test scripts and adds the test TypeScript project
to `typecheck`. Babel handles test syntax only; Vite still uses Oxc/Rolldown.
Create the owning areas' `__tests__/` directories and copy each suite into its
linked location (see [Architecture](implement/architecture.md)):
[menu](../src/features/navigation/__tests__/menu.test.js), [appearance logic](../src/features/appearance/__tests__/appearance.test.js),
[appearance provider](../src/features/appearance/__tests__/appearance-provider.test.tsx),
[application](../src/app/__tests__/application.test.tsx),
[recursive navigation](../src/features/navigation/__tests__/menu-navigation.test.tsx),
[UI components](../src/shared/__tests__/ui.test.tsx), and [startup](../src/app/__tests__/main.test.js).

Also copy the [worker startup tests](../src/app/__tests__/prepare.test.ts) and
[HTTP integration tests](../src/shared/api/__tests__/http.test.ts) to their owning areas.

Create `tests/support/` with the existing
[Node interceptor](../tests/support/mock-server.ts),
[browser helper](../tests/support/browser.ts),
[Vite base transform](../tests/support/vite-base-transform.js), and
[CSS stub](../tests/support/style.js). The transform reads the base from the saved
Vite configuration; keep that configuration present when running Jest.
See [Testing code design](implement/testing.md) for environment, alias, cleanup,
and coverage decisions.

```sh
pnpm test
pnpm test:coverage
```

Open `coverage/index.html` for the report. Coverage output is generated and ignored;
the build does not run tests automatically. The report includes untested source.
The full suite enforces 90% global coverage for statements, branches, functions,
and lines; a missed metric makes `pnpm test:coverage` fail.

## 12. Run and verify the application

### Check files before starting the server

```sh
pnpm check
pnpm typecheck
```

Expect no lint, formatting, import, or type errors. If Biome finds formatting or
safe fixes, run `pnpm check:fix`, review changes, and rerun `pnpm check`. Correct
remaining errors in source; do not disable rules or strict checks to hide them.

### Run development

```sh
pnpm dev
```

Vite opens `http://127.0.0.1:5174/lab/react/v2/` where supported. If port 5174 is
occupied, stop the conflicting process or explicitly choose a different port.
Keep the terminal open while working; stop development with Ctrl+C.

Verify these expected results:

1. Home displays its heading and six compact technology layers.
2. The Testing layer identifies Jest 30, React Testing Library 16, and Jest coverage.
3. About opens `/lab/react/v2/about`, showing three cards inside the shared layout.
4. Use Back/Forward, refresh About, and open that URL directly.
5. An unknown app path shows the not-found view; **Return to Home** recovers.
6. Return to Home and verify the application, interface, build pipeline, workspace, and testing diagram layers.
7. Links and controls have visible keyboard focus. Content fits narrow and wide screens.
8. Save a heading edit to observe Fast Refresh; restore any temporary exercise edits.

These are checks to perform, not a claim that a build alone tests browser behavior.

### Build and preview

Stop development, then run:

```sh
pnpm check
pnpm build
pnpm preview
```

Build checks application, Vite configuration, and TypeScript tests before writing `dist/index.html`, JS/CSS assets,
and JavaScript source maps under `dist/assets/`. It does **not** run Biome or Jest;
run `pnpm check` and `pnpm test:coverage` separately.

Preview is normally at `http://localhost:4173/lab/react/v2/`; use its printed URL
if the port differs. Repeat page, keyboard, routing, refresh, and responsive checks
against the built app. Rebuild after source edits. Stop preview with Ctrl+C.

## 13. Verify reproducibility and prepare deployment

### Check a recorded installation

After step 5 has created the lockfile, run:

```sh
pnpm install --frozen-lockfile
```

Expect success without changing the lockfile. This checks that the manifest and
lockfile agree; it does not inherently mean a clean reinstall. Later checkouts
and build jobs should use this command, with registry access for uncached packages.
Keep source, configuration, documentation, manifest, and lockfile together when
placing the project under version control. Installed/generated directories stay ignored.

### Prepare static hosting

- Build with development dependencies available: TypeScript, Vite, and Tailwind
  are needed to produce output. Visitors need only a browser.
- Deploy the **contents of `dist/`** under `/lab/react/v2/`.
- Serve actual assets normally. For application paths such as `/lab/react/v2/about`,
  configure a fallback to `/lab/react/v2/index.html` when there is no real file.
- Test a direct About URL and refresh on the actual host. Vite's base, router
  basepath, and a successful local preview do not configure or prove host rewrites.
- Review whether to publish the enabled production source maps. Client-side
  `VITE_` values are public and must not contain secrets.

If the hosting prefix changes, update Vite's base, host configuration, and related
docs, then rebuild. Preview is a local verification server, not production hosting.
No external host or deployment account is created by this walkthrough.

## 14. Final structure, troubleshooting, and references

### Project structure

This is the source layout of the current repository. The application files and
license are created above; the existing technology guides are maintained separately.

```text
src/
├── main.tsx                         Browser entry: StrictMode and providers
├── app/
│   ├── router.tsx                   Route tree and hosting base
│   ├── app-shell.tsx                Shared layout, sidebar/drawer orchestration
│   ├── styles.css                   Tailwind, semantic tokens, global styles
│   └── __tests__/                   Application integration and startup tests
├── features/
│   ├── home/home-page.tsx           Technology stack landing page
│   ├── about/about-page.tsx         About page
│   ├── navigation/
│   │   ├── components/              Recursive menu rendering
│   │   ├── config/menu.json         Menu entries and nested groups
│   │   ├── model/menu-schema.ts     Validation and active-group calculation
│   │   └── __tests__/               Menu model and component tests
│   └── appearance/
│       ├── components/              Appearance provider and settings dialog
│       ├── model/appearance.ts      Modes, accents, parsing, and resolution
│       └── __tests__/               Model and provider tests
└── shared/
    ├── ui/                          Owned Button and Card components
    ├── lib/utils.ts                 Class-name merging
    ├── routing/route-paths.ts       Route targets shared with menu validation
    └── __tests__/                   Shared UI and utility tests
build/                               Node-only appearance bootstrap generation
tests/support/                       Common test browser/transform helpers
public/                              Static assets
docs/                                Setup, requirements, design, and guides
components.json                      shadcn/ui aliases
jest.config.js                       Test and coverage configuration
tsconfig*.json                       App, Vite, and test type checks
vite.config.ts                       Vite configuration
```

### Troubleshooting

| Problem | First check |
| --- | --- |
| Missing tool or engine mismatch | Check Node.js 24+ and pnpm 12+ in the terminal running the command |
| Package download fails | Check registry/network access; do not change package versions just to bypass connectivity |
| A script or import is missing | Confirm the current directory and that steps 4–10 are complete, including parent directories and filename case |
| Types or dev tools cannot be found | Confirm development dependencies were installed, not only production packages |
| `@/` imports fail | Keep the Vite alias and TypeScript `paths` aligned |
| Tailwind directives fail to parse | Keep Biome's Tailwind parser enabled and the stylesheet/plugin configuration intact |
| UI styles look wrong | Check the stylesheet import, theme variables, local `cn` import, and legacy CSS specificity |
| Development port is occupied | Stop the conflicting server or use `pnpm dev --port 5175 --strictPort` |
| Preview shows old content | Run `pnpm build` again |
| Direct route refresh returns a server 404 | Configure the host fallback for `/lab/react/v2/` while serving real assets normally |
| Frozen install rejects intentional dependency changes | Run `pnpm install`, review the manifest/lockfile, then retry the frozen check |

### Verification note

Reviewed against the current feature-based SPA on **2026-10-30**. The complete
source snapshots are checked against their named files. Optional examples are
separate from installed features; the starting README/AGENTS examples are
intentionally shorter than this repository's maintained documents.

Verification covers local documentation paths/anchors, copied source formatting,
TypeScript checks, Jest examples, and a build of the documented setup in a
temporary project. See the [documentation index](README.md#verification) for
verification boundaries. A successful local check does not verify a fresh
network installation, Windows/Linux installer execution, browser accessibility,
or production deployment.

### Official references

- [pnpm initialization](https://pnpm.io/cli/init)
- [pnpm dependency installation](https://pnpm.io/cli/add)
- [pnpm frozen installation](https://pnpm.io/cli/install)
- [TypeScript configuration](https://www.typescriptlang.org/tsconfig/)
- [Vite configuration](https://vite.dev/config/)
- [Biome configuration](https://biomejs.dev/reference/configuration/)
- [Tailwind CSS with Vite](https://tailwindcss.com/docs/installation/using-vite)
- [shadcn/ui manual installation](https://ui.shadcn.com/docs/installation/manual)
- [Base UI Button](https://base-ui.com/react/components/button)
- [TanStack code-based routing](https://tanstack.com/router/latest/docs/routing/code-based-routing)
- [Lucide React](https://lucide.dev/guide/react/)
- [React Quick Start](https://react.dev/learn)
