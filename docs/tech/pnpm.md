# pnpm

## Contents

- [Introduction](#introduction)
- [pnpm vs npm](#pnpm-vs-npm)
- [Install pnpm](#install-pnpm)
- [Understand package.json](#understand-packagejson)
- [Basic usage in this React project](#basic-usage-in-this-react-project)
- [Add, update, and uninstall dependencies](#add-update-and-uninstall-dependencies)
- [pnpm command reference](#pnpm-command-reference)
- [Best practices and troubleshooting](#best-practices-and-troubleshooting)
- [Official references](#official-references)

## Introduction

pnpm is the package manager used to install this React project's dependencies and
run its development commands. It reuses downloaded package files through a shared
store and records dependency resolution in a lockfile.

| File or directory | Purpose |
| --- | --- |
| `package.json` | Declares packages, version requirements, and project scripts |
| `pnpm-workspace.yaml` | Configures pnpm behavior, including engine checks and exact package saving |
| `pnpm-lock.yaml` | Records resolved package versions for repeatable installation |
| `node_modules/` | Contains the installed dependencies used by the project |

This project accepts **pnpm 12 or newer** and **Node.js 24 or newer**. Neither tool
is pinned to an exact version. Application and build dependencies remain pinned
in the manifest and lockfile.

To create a React + TypeScript + Vite application from scratch, follow the
[project creation guide](../project-create.md). This guide covers pnpm installation
and ongoing package management.

## pnpm vs npm

### What they have in common

Both are package managers that install JavaScript packages and run scripts from
`package.json`. Both can install React, TypeScript, and Vite from the npm registry.
The registry and the npm CLI are different things: using the registry does not
require choosing npm as the project's package manager.

The React source and `scripts` entries are largely the same whichever manager a
project chooses. Installation layout, lockfiles, and some configuration and
commands differ. This repository uses pnpm consistently for dependency management.

### Main differences

The table describes default behavior; installation layouts are configurable.

| Area | pnpm | npm | Meaning for this project |
| --- | --- | --- | --- |
| Installation | Installed separately using the methods below | Normally included by the Node.js installers used in this guide | Having npm available does not mean pnpm is installed |
| Package storage | Reuses package files through a content-addressable store and links/clones them into projects | Uses a download cache and normally installs package files into each project's dependency tree | pnpm can reduce duplicated package storage across projects |
| Dependency layout | Uses a linked layout, normally exposing declared direct dependencies at the project root | Defaults to a hoisted layout, which can also make indirect packages reachable | Explicitly declare every package your source imports |
| Lockfile | `pnpm-lock.yaml` | `package-lock.json` for typical application projects | Keep this repository's pnpm lockfile |
| Reproducible install | `pnpm install --frozen-lockfile` uses the pnpm lockfile without rewriting it | `npm ci` requires an npm lockfile and installs without rewriting it | Use the pnpm command after checkout and in CI |
| Project scripts | `pnpm run dev`, with `pnpm dev` as a shortcut | `npm run dev` | Both run the manifest's `dev` script |
| Configuration | This project uses `pnpm-workspace.yaml` | npm uses its own configuration, including `.npmrc` | npm does not apply this project's pnpm YAML settings |

For the dependency layouts, see [pnpm's store explanation](https://pnpm.io/motivation)
and [npm's install strategy](https://docs.npmjs.com/cli/v11/using-npm/config/#install-strategy).
Package reuse can improve installation performance, but actual speed depends on
network access, existing caches, filesystem behavior, and the dependency graph.
A different package manager alone does not make the React application run faster
in the browser.

### Command equivalents

These are comparisons, not instructions to run both columns in this repository.
Use the pnpm column here. `PACKAGE` and `VERSION` are placeholders for a reviewed
package name and version.

| Task | pnpm | npm |
| --- | --- | --- |
| Install declared dependencies | `pnpm install` | `npm install` |
| Install the recorded dependency graph | `pnpm install --frozen-lockfile` | `npm ci` |
| Add an exact application dependency | `pnpm add -E PACKAGE@VERSION` | `npm install --save-exact PACKAGE@VERSION` |
| Add an exact development dependency | `pnpm add -D -E PACKAGE@VERSION` | `npm install -D --save-exact PACKAGE@VERSION` |
| Update within declared versions | `pnpm update` | `npm update` |
| Intentionally install a newer reviewed version | `pnpm add -E PACKAGE@VERSION` | `npm install --save-exact PACKAGE@VERSION` |
| Remove a dependency | `pnpm remove PACKAGE` | `npm uninstall PACKAGE` |
| Start development | `pnpm dev` | `npm run dev` |
| Check lint rules | `pnpm lint` | `npm run lint` |
| Apply safe lint fixes | `pnpm lint:fix` | `npm run lint:fix` |
| Format configured files | `pnpm format` | `npm run format` |
| Check formatting | `pnpm format:check` | `npm run format:check` |
| Check lint, formatting, and imports | `pnpm check` | `npm run check` |
| Apply safe fixes, formatting, and import organization | `pnpm check:fix` | `npm run check:fix` |
| Check types | `pnpm typecheck` | `npm run typecheck` |
| Build the app | `pnpm build` | `npm run build` |
| Preview the build | `pnpm preview` | `npm run preview` |
| Inspect direct installed packages | `pnpm list --depth 0` | `npm ls --depth=0` |
| Check for outdated packages | `pnpm outdated` | `npm outdated` |
| Read registry metadata | `pnpm view PACKAGE` | `npm view PACKAGE` |
| Run the installed TypeScript compiler | `pnpm exec tsc --version` | `npm exec -- tsc --version` |
| Run a package temporarily | `pnpm dlx PACKAGE` | `npx PACKAGE` |

These operations have similar purposes, but are not identical in every detail.
For example, `npm ci` removes an existing `node_modules` before installation,
whereas `pnpm install --frozen-lockfile` does not inherently mean a clean reinstall.
`npm ci` also cannot use `pnpm-lock.yaml` in place of an npm lockfile.
See [npm ci](https://docs.npmjs.com/cli/v11/commands/npm-ci/) and
[pnpm install](https://pnpm.io/cli/install).

`pnpm exec` runs a command in the project's environment, including installed
executables. `pnpm dlx` fetches and executes a temporary package. npm's `exec` and
`npx` can offer to download missing packages, so their behavior is not identical
to simply invoking an already installed executable. Prefer this project's scripts
for normal development. See [pnpm exec](https://pnpm.io/cli/exec) and
[temporary execution](https://pnpm.io/cli/pnx).

### Why this React project uses pnpm

pnpm's package reuse is useful across development projects, and its linked layout
helps expose accidental reliance on undeclared packages. The existing pnpm
lockfile and configuration also give contributors one agreed installation workflow.

In particular, `pnpm-workspace.yaml` enables engine checks and exact package saving.
Those settings support the project's Node.js 24+ and pnpm 12+ requirements and
explicit dependency versions. npm is a valid choice for other projects; this
repository's configuration and contributor instructions select pnpm.

### What if a tutorial shows npm commands?

Translate the task using the command table. For example, this project's development
command is `pnpm dev` when a tutorial says `npm run dev`. An npm command that adds a
package becomes `pnpm add`, with `-D` for a development tool and an explicit reviewed
version for this repository. A plain update respects exact dependency pins in both
workflows; choose a new version deliberately when upgrading.

The `npx get-pnpm` command in the Windows installation section bootstraps pnpm.
That does not change the package manager used for this project's dependencies.
After pnpm is installed, use its commands for project package operations. Avoid
alternating installers in the same `node_modules` directory or maintaining both
npm and pnpm lockfiles for this application.

## Install pnpm

First install Node.js 24 or newer using the [Node.js guide](nodejs.md). Then verify:

```sh
node --version
npm --version
```

Expect a Node.js major version of at least 24 and an npm version number. Follow
one installation method below for your operating system. These instructions use
pnpm's [official installation methods](https://pnpm.io/installation).

### macOS

1. Open Terminal.
2. Run the official standalone installer:

```sh
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

3. Follow the installer's shell setup instructions, then close and reopen Terminal.
4. Verify the installation:

```sh
pnpm --version
```

Expect a major version of **12 or higher**. The installer downloads pnpm for your
platform and configures its executable location. Use the shell configuration path
printed by the installer if it asks you to reload your environment.

### Linux

1. Open a terminal using your normal user account.
2. Ensure `curl` is installed using your distribution's package manager if necessary.
3. Run the official standalone installer:

```sh
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

4. Follow the shell setup instructions printed by the installer. Reopen the terminal.
5. Verify:

```sh
pnpm --version
```

Expect a major version of **12 or higher**. Run this user-level installer without
`sudo`. If the installer cannot identify your shell, check that `SHELL` points to
the shell you use and follow the official installation troubleshooting guidance.

### Windows

1. Open PowerShell or Command Prompt after installing Node.js.
2. Run the installer through npm, as recommended by pnpm for Windows:

```powershell
npx get-pnpm
```

3. If prompted, confirm that npm may download and run `get-pnpm`.
4. Follow any setup instructions, then reopen the terminal.
5. Verify:

```powershell
pnpm --version
```

Expect a major version of **12 or higher**. If PowerShell blocks the `npx.ps1`
wrapper, run `npx.cmd get-pnpm` or use Command Prompt instead. You do not need to
relax PowerShell's execution policy just to run the installer.

## Understand package.json

See [package.json](../../package.json) for this repository's complete manifest.
For a new React application, follow the step-by-step
[project creation guide](../project-create.md), including the complete manifest,
configuration, and source files.
`package.json` declares intent; `pnpm-lock.yaml` records the resolved dependency
graph, and `node_modules/` contains the installed files.

| Field | How it is used here |
| --- | --- |
| `name` | Project identifier, normally lowercase with hyphens |
| `version` | Application's own version, independent of React or pnpm versions |
| `private` | Prevents accidental package publication when true |
| `type` | `module` selects ES module interpretation for applicable JavaScript files |
| `engines.node` | Minimum runtime version: `>=24.0.0` |
| `engines.pnpm` | Minimum package-manager version: `>=12.0.0` |
| `scripts` | Named commands run with `pnpm run NAME` |
| `dependencies` | Packages imported by application code, such as React |
| `devDependencies` | Build and development tools and type declarations |

There is no exact `packageManager` or `devEngines.packageManager` pin in this project.
The minimum-version requirements do not constrain application dependencies to
ranges: those are saved as exact versions separately.

### Read and edit manifest fields

Use an editor for larger changes. For small changes, pnpm also provides:

```sh
pnpm pkg get name
pnpm pkg get scripts
pnpm pkg get dependencies
pnpm pkg get devDependencies
```

These commands only inspect fields. The following examples change the manifest;
run them only when you want the described change:

```sh
pnpm pkg set description="A React learning project"
pnpm pkg set private=true --json
pnpm pkg delete description
```

`--json` makes `true` a JSON boolean rather than a string. Use `pnpm add`,
`pnpm update`, and `pnpm remove` for dependencies so the installed graph and
lockfile stay consistent with the manifest.

### Understand version declarations

| Declaration | Meaning |
| --- | --- |
| `19.3.1` | Exactly this package version; used for dependencies here |
| `^19.3.1` | Compatible releases below the next major for this nonzero major example |
| `~19.3.1` | Releases from 19.3.1 up to, but excluding, 19.4.0 |
| `>=12.0.0` | Version 12.0.0 or newer; used for the pnpm engine requirement |

The lockfile records exact resolved versions even when a manifest permits a range.
Keep exact package declarations for this project's dependency changes.

## Basic usage in this React project

### Check the project requirements

Open a terminal in `gjp-lab-web-react-vite-ts`, the directory containing
`package.json`. Its engine requirements are:

```json
{
  "engines": {
    "node": ">=24.0.0",
    "pnpm": ">=12.0.0"
  }
}
```

This is an excerpt, not a replacement for the whole manifest. There is no exact
`packageManager` version pin. Use an installed pnpm version meeting the minimum.

[pnpm-workspace.yaml](../../pnpm-workspace.yaml) includes these engine/version settings:

```yaml
engineStrict: true
savePrefix: ''
```

`engineStrict` checks engine requirements. An empty `savePrefix` saves exact
versions when adding dependencies. pnpm 12 uses this configuration file for these
settings, even for a single-package project like this one. The complete YAML also
explicitly denies fallback install scripts for `@parcel/watcher` and `unrs-resolver`;
platform binaries come from their optional dependencies. Keep these reviewed
decisions instead of disabling dependency-script checks globally.

### Install project dependencies

```sh
pnpm install --frozen-lockfile
```

This installs the recorded dependency graph without updating the lockfile. Expect
packages to be downloaded or reused from the local store and made available in
`node_modules/`. A frozen install still needs network access for missing packages.
It fails if the manifest and lockfile disagree.

### Start development

```sh
pnpm dev
```

Open the URL printed by Vite, `http://127.0.0.1:5174/lab/react/v2/` with the current
configuration. Save an edit to
`src/features/home/home-page.tsx` and check the browser for the update. Keep the terminal open while
working; stop the server with Ctrl+C.

### Check code, check types, build, and preview

```sh
pnpm check
pnpm typecheck
pnpm test:coverage
pnpm build
pnpm preview
```

| Command | Expected result |
| --- | --- |
| `pnpm lint` | Check lint rules without changing files |
| `pnpm lint:fix` | Apply safe lint fixes |
| `pnpm format` | Format the configured source and configuration files |
| `pnpm format:check` | Check formatting without changing files |
| `pnpm check` | Check lint, formatting, and import organization |
| `pnpm check:fix` | Apply safe fixes, formatting, and import organization |
| `pnpm typecheck` | Checks application, Vite configuration, and TypeScript test types; exits successfully when no errors are found |
| `pnpm test` | Runs all Jest unit/component tests once |
| `pnpm test:watch` | Watches all tests during development |
| `pnpm test:coverage` | Writes coverage reports and enforces the global 90% thresholds |
| `pnpm build` | Checks types, then writes production assets into `dist/` |
| `pnpm preview` | Prints a local URL, normally `http://localhost:4173/lab/react/v2/`, for the completed build |

Use another terminal for checks while the development server is active. Preview
serves the last build, so rebuild after editing source. Stop preview with Ctrl+C.
It is a local verification server, not production hosting.

These commands run scripts declared in `package.json`. For example,
`pnpm typecheck` is shorthand for `pnpm run typecheck`.

## Add, update, and uninstall dependencies

Run these commands in the project that should receive the change. Dependency
commands usually update `package.json`, `pnpm-lock.yaml`, and the installed packages.
The examples explain workflows; they do not mean the repository needs new packages.

### Add application dependencies

```sh
pnpm add -E react@19.3.1 react-dom@19.3.1
```

This concrete example uses packages already installed here. It illustrates saving
multiple application dependencies with exact versions. Keep React and React DOM
compatible when changing their versions.

For another package, replace `PACKAGE` and `VERSION` in this command pattern:

```text
pnpm view PACKAGE@VERSION engines peerDependencies
pnpm add -E PACKAGE@VERSION
```

`view` checks registry metadata before installation. Application code should only
import third-party packages declared directly in its own manifest.

### Add development dependencies

```sh
pnpm add -D -E typescript@7.0.2
```

TypeScript is already installed here. The example shows how to save a build tool
under `devDependencies`. Use the same pattern for a new development tool:

```text
pnpm add -D -E PACKAGE@VERSION
```

A browser-only deployment still needs development dependencies in its build
stage, since Vite, TypeScript, and Tailwind generate the deployable output.

### Move a package between dependency groups

Re-add an existing package with the intended group and version. For example,
if TypeScript were incorrectly under `dependencies`, use:

```sh
pnpm add -D -E typescript@7.0.2
```

For the reverse move, use `pnpm add -P -E PACKAGE@VERSION`. Check the resulting
manifest to confirm the package is in the intended group.

### Inspect available updates

```sh
pnpm outdated
pnpm list --depth 0
pnpm why react
pnpm why rolldown
```

`outdated` compares installed and registry versions. `list` shows direct packages,
and `why` explains why a package is installed. Rolldown is supplied through Vite
and does not need to become a direct application dependency.

### Update within declared versions

```sh
pnpm update
pnpm update --prod
pnpm update --dev
```

These are alternatives: all dependencies, application/optional dependencies, or
development dependencies. They respect the declared versions. Because this
project pins exact package versions, a plain update normally leaves direct
versions unchanged; it is not a command to jump to a newer major.

### Update to a reviewed version or release line

Command patterns for a deliberate version change:

```text
pnpm update PACKAGE@VERSION
pnpm update --prod PACKAGE@VERSION
pnpm update --dev PACKAGE@VERSION
```

Use one form matching the intended package group. To select the newest available
release within an existing project major and retain exact declarations:

```sh
pnpm add -E react@19 react-dom@19
pnpm add -D -E typescript@7
pnpm add -D -E vite@8 @vitejs/plugin-react@6
```

These commands mutate dependencies and require registry access; they are optional
upgrade examples, not steps to run after every checkout. Check peer requirements
and migration notes first. Update React type declarations as needed alongside
React. For a specific package, choosing an explicit reviewed version is more
predictable than a broad update.

### Update to the latest stable release

```text
pnpm update PACKAGE --latest --save-exact
pnpm update --dev PACKAGE --latest --save-exact
pnpm update --latest --save-exact
```

These commands can cross major versions. The last affects all direct dependencies.
Use them only for planned migrations; a latest release may exceed this project's
React 19, TypeScript 7, or Vite 8 stack. `--save-exact` keeps rewritten declarations
exact. Prefer targeted updates and review the resulting manifest and lockfile.

See the [update reference](https://pnpm.io/cli/update) for selection and range rules.

### Uninstall application or development dependencies

```text
pnpm remove PACKAGE
pnpm remove -P PACKAGE
pnpm remove -D PACKAGE
pnpm remove PACKAGE_A PACKAGE_B
```

Use plain `remove` for a named dependency, `-P` to restrict removal to application
dependencies, or `-D` to restrict it to development dependencies. `pnpm uninstall`
and `pnpm rm` are aliases for `pnpm remove`. Remove source imports, scripts, and
configuration that depend on the deleted package. Do not remove React, Vite, or
TypeScript from this application unless replacing the related setup intentionally.

See the [remove reference](https://pnpm.io/cli/remove).

### Verify each intentional change

```sh
pnpm check
pnpm typecheck
pnpm build
pnpm install --frozen-lockfile
```

Inspect changed files and check the affected feature in a browser. Keep manifest
and lockfile changes together in version control. If you edited dependency fields
manually, run a normal `pnpm install` before the frozen check.

## pnpm command reference

Start with the commands below for this application. The CLI includes additional
registry, publishing, workspace, and maintenance features that this project does
not currently require; a full top-level inventory follows for reference.

### Common commands and options

| Command | Purpose |
| --- | --- |
| `pnpm --version` | Print the installed pnpm version |
| `pnpm help` | List commands available in your installed version |
| `pnpm help add` | Explain a command and its supported options |
| `pnpm init --no-init-package-manager` | Create a manifest without an exact pnpm pin |
| `pnpm install` / `pnpm i` | Install dependencies; may update the lockfile |
| `pnpm install --frozen-lockfile` | Install the recorded graph without rewriting the lockfile |
| `pnpm install --offline` | Install using locally cached packages only |
| `pnpm add -E PACKAGE@VERSION` | Add an exact application dependency |
| `pnpm add -D -E PACKAGE@VERSION` | Add an exact development dependency |
| `pnpm update` / `pnpm up` | Update within declared versions |
| `pnpm update PACKAGE --latest --save-exact` | Intentionally update a package beyond its existing range |
| `pnpm remove PACKAGE` / `pnpm uninstall PACKAGE` | Remove a dependency |
| `pnpm outdated` | Check for available dependency updates |
| `pnpm list --depth 0` / `pnpm ls --depth 0` | Show direct installed packages |
| `pnpm why PACKAGE` | Trace a package's dependency relationships |
| `pnpm view PACKAGE` | Read registry metadata |
| `pnpm run` | List scripts declared in the manifest |
| `pnpm run NAME` | Run a named project script |
| `pnpm run dev --port 5174` | Pass a port option to this project's Vite dev script |
| `pnpm exec tsc --version` | Run the local TypeScript executable |
| `pnpm dlx PACKAGE` | Download and execute a temporary package without adding it as a project dependency |
| `pnpm pkg get scripts` | Inspect manifest scripts |
| `pnpm config get engineStrict` | Inspect effective configuration |
| `pnpm store path` | Show the package-store location |
| `pnpm audit` | Check installed dependencies for known published advisories |
| `pnpm -C PATH run build` | Run the build in another project directory |

Uppercase names in command patterns are placeholders. `exec` uses tools available
in the project; `dlx` can download and run a tool temporarily. Prefer project
scripts for established workflows: `pnpm exec vite build` skips the TypeScript
step included in this project's `pnpm build` script.

`pnpm test`, `pnpm start`, and other script shortcuts work only when the
corresponding script exists. This project defines `test`, `test:watch`, and `test:coverage`; it has no `start` script.
Its lint, format, and check scripts run Biome; see the [Biome guide](biome.md)
for safe fixes and the difference between these commands.

### Full command inventory

This inventory is taken from the installed pnpm 12 CLI. Some commands and options
were added during pnpm 12, and later versions can change the list. Use `pnpm help`
for the complete list supported by your installation, and `pnpm help COMMAND` or
`pnpm COMMAND --help` for all subcommands and flags. This is a reference inventory,
not a recommendation to enable every feature in this React project.

<details>
<summary>All top-level commands reported by the pnpm 12 CLI</summary>

| Command | Purpose |
| --- | --- |
| `pnpm access` | Manage package access and visibility on the registry |
| `pnpm init` | Initialize a package.json |
| `pnpm recursive` | Concurrently runs a command in all subdirectory projects [aliases: multi, m] |
| `pnpm add` | Add a package |
| `pnpm install` | Install packages [alias: i] |
| `pnpm install-test` | Runs a pnpm install followed immediately by a pnpm test. Accepts the same arguments as pnpm install, plus --no-bail to continue running workspace tests after a failure [alias: it] |
| `pnpm update` | Update packages to their newest version based on the specified range [aliases: up, upgrade] |
| `pnpm outdated` | Check for outdated package and GitHub Actions dependencies |
| `pnpm audit` | Checks for known security issues with the installed packages |
| `pnpm change` | Record a change intent: which packages a change affects, the bump type for each, and a summary that becomes the changelog entry |
| `pnpm version` | Apply the pending change intents (pnpm version -r) |
| `pnpm lane` | Manage per-package release lanes |
| `pnpm bugs` | Opens the bug tracker URL of a package in the default browser [alias: issues] |
| `pnpm list` | List installed packages [alias: ls] |
| `pnpm ll` | List installed packages in long format [alias: la] |
| `pnpm licenses` | Check the licenses of the installed packages [alias: licences] |
| `pnpm why` | Shows the packages that depend on pkg |
| `pnpm view` | View registry information about a package [aliases: info, show, v] |
| `pnpm sbom` | Generate a Software Bill of Materials (SBOM) |
| `pnpm whoami` | Displays your pnpm username |
| `pnpm deprecate` | Deprecates a version of a package in the registry |
| `pnpm undeprecate` | Removes deprecation from a version of a package in the registry. Only works on already deprecated versions |
| `pnpm unpublish` | Removes a package from the registry |
| `pnpm star` | Marks a package as a favorite |
| `pnpm unstar` | Unmarks a package as a favorite |
| `pnpm stars` | Lists all packages starred by a specific user |
| `pnpm dist-tag` | Manage a package's distribution tags [alias: dist-tags] |
| `pnpm ping` | Test connectivity to the configured registry |
| `pnpm doctor` | Run diagnostics on the pnpm installation and environment |
| `pnpm search` | Search for packages in the registry [aliases: s, se, find] |
| `pnpm rebuild` | Rebuild a package |
| `pnpm rb` | Rebuild a package |
| `pnpm pack` | Create a tarball from a package |
| `pnpm publish` | Publish a package to the registry |
| `pnpm stage` | Stage packages for publishing, deferring proof-of-presence (2FA) to a later point in time |
| `pnpm remove` | Removes packages from node_modules and from the project's package.json [aliases: uninstall, rm, un, uni] |
| `pnpm patch` | Prepare a package for patching |
| `pnpm patch-commit` | Generate a patch out of a directory |
| `pnpm patch-remove` | Remove existing patch files |
| `pnpm peers` | Checks for unmet or missing peer dependency issues |
| `pnpm set-script` | Set a script in package.json [alias: ss] |
| `pnpm test` | Runs a package's "test" script, if one was provided [aliases: t, tst] |
| `pnpm run` | Runs a defined package script [alias: run-script] |
| `pnpm tasks` | Inspect tasks in concurrency groups. A same-named script takes precedence. Use pnpm pm tasks to force the built-in |
| `pnpm pipeline` | Runs a named pipeline of workspace tasks the way a CI run would: a frozen install, affected-since-base selection, the task graph in dependency order without bailing, and cached task results restored instead of re-run |
| `pnpm exec` | Run a shell command in the context of a project |
| `pnpm dlx` | Run a package in a temporary environment |
| `pnpm create` | Creates a project from a create-* starter kit |
| `pnpm completion` | Print shell completion code to stdout |
| `pnpm start` | Runs an arbitrary command specified in the package's start property of its scripts object |
| `pnpm stop` | Runs a package's "stop" script, if one was provided |
| `pnpm restart` | Restarts a package. Runs "stop", "restart" (if present), and "start" scripts, and associated pre- and post- scripts |
| `pnpm find-hash` | Lists the packages that include the file with the specified hash |
| `pnpm runtime` | Manage runtimes [alias: rt] |
| `pnpm env` | Manage Node.js versions. Deprecated in favour of pnpm runtime |
| `pnpm shim` | Manage context-aware shims for packages that are not installed globally, so a project decides which version runs |
| `pnpm bin` | Print the directory where pnpm will install executables |
| `pnpm clean` | Safely remove node_modules directories from the current project (or every workspace project) without following NTFS junctions into their targets. A clean script in package.json overrides the built-in command |
| `pnpm purge` | Alias of clean: same behavior, except a purge script (not a clean script) overrides it when present |
| `pnpm ci` | Runs clean then install with a frozen lockfile [aliases: clean-install, ic, install-clean] |
| `pnpm root` | Print the effective node_modules directory |
| `pnpm prefix` | Print the current package prefix |
| `pnpm config` | Manage the pnpm configuration files [alias: c] |
| `pnpm get` | Print the config value for the provided key. Shorthand for pnpm config get |
| `pnpm set` | Set the config key to the value provided. Shorthand for pnpm config set |
| `pnpm pkg` | Manages your package.json |
| `pnpm pack-app` | Pack a CommonJS entry file into a standalone executable for one or more target platforms |
| `pnpm store` | Managing the package store |
| `pnpm cache` | Inspect and manage the metadata cache |
| `pnpm cat-file` | Prints the contents of a file based on the hash value stored in the index file |
| `pnpm cat-index` | Prints the index file of a specific package from the store |
| `pnpm ignored-builds` | Print the list of packages with blocked build scripts |
| `pnpm approve-builds` | Approve dependencies for running scripts during installation |
| `pnpm permissions` | Review what dependencies may do: run build scripts and provide agent skills |
| `pnpm approve` | Approve or deny what dependencies may do. Same as pnpm permissions approve |
| `pnpm link` | Links a local package as a dependency [alias: ln] |
| `pnpm import` | Generates a pnpm-lock.yaml from an external lockfile |
| `pnpm dedupe` | Deduplicate packages in the lockfile |
| `pnpm deploy` | Deploy a package from a workspace |
| `pnpm prune` | Remove extraneous packages |
| `pnpm fetch` | Fetch packages from the lockfile into the virtual store |
| `pnpm unlink` | Removes links to a local package and reinstalls it [alias: dislink] |
| `pnpm docs` | Opens the documentation of a package in the browser [alias: home] |
| `pnpm repo` | Opens the URL of the package's repository in a browser |
| `pnpm self-update` | Updates pnpm to the latest version (or the one specified) |
| `pnpm setup` | Sets up pnpm |
| `pnpm login` | Log in to an npm registry [alias: adduser] |
| `pnpm team` | Manage organization teams and team memberships |
| `pnpm owner` | Manage package owners on the registry [alias: owners] |
| `pnpm logout` | Log out of an npm registry |
| `pnpm with` | Runs pnpm at a specific version (or the currently running one) for a single invocation, ignoring the "packageManager" and "devEngines.packageManager" fields of the project's manifest |
| `pnpm edit` | Not implemented in pnpm. Use the npm CLI directly |
| `pnpm profile` | Not implemented in pnpm. Use the npm CLI directly |
| `pnpm token` | Not implemented in pnpm. Use the npm CLI directly |
| `pnpm xmas` | Not implemented in pnpm. Use the npm CLI directly |
| `pnpm help` | Print this message or the help of the given subcommand(s) |

</details>

The CLI lists `edit`, `profile`, `token`, and `xmas` as unimplemented compatibility
entries; they are not usable pnpm features. Commands for registry publication and
workspace orchestration are included for completeness. This application is private
and currently contains one package.

See the [official CLI reference](https://pnpm.io/pnpm-cli) for the current command
documentation. To explore grouped commands, use help, for example
`pnpm help pkg`, `pnpm help store`, or `pnpm help config`.

## Best practices and troubleshooting

- **Use pnpm consistently:** avoid creating npm or Yarn lockfiles in this project.
- **Keep the lockfile:** use frozen installs after checkout. If you intentionally
  edit the manifest, run `pnpm install` to update the lockfile, then review the changes.
- **Keep build dependencies available:** Vite, TypeScript, and Tailwind are required to produce
  `dist/`, even though they are development dependencies.
- **Upgrade deliberately:** pnpm 12 or newer is accepted, but check the build and
  review any lockfile format changes when moving to a new major version.
- **Declare imported packages:** do not rely on an indirect dependency being present.
- **Fix source and configuration:** do not edit `node_modules` or hand-edit resolved
  dependency records in the lockfile.

| Problem | What to check |
| --- | --- |
| `pnpm` is not found | Reopen the terminal and follow the installer's PATH instructions |
| The wrong version runs | Use `command -v pnpm` on macOS/Linux or `where.exe pnpm` on Windows to find conflicting installations |
| Permission denied during installation | Use the user-level installer on macOS/Linux; check the target directory and avoid running project installs with `sudo` |
| PowerShell blocks a script wrapper | Use the corresponding `.cmd` wrapper if available, or run the command in Command Prompt |
| Engine mismatch | Verify Node.js is 24 or newer and pnpm is 12 or newer in the same terminal |
| Frozen lockfile mismatch | Update the lockfile for an intentional manifest change, or restore the accidental change; do not delete the lockfile as a first fix |
| Registry or download failure | Check connectivity and registry settings before changing package versions |

## Official references

- [pnpm installation](https://pnpm.io/installation)
- [Install command](https://pnpm.io/cli/install)
- [Initialize a project](https://pnpm.io/cli/init)
- [Add command](https://pnpm.io/cli/add)
- [Update command](https://pnpm.io/cli/update)
- [Run scripts](https://pnpm.io/cli/run)
- [CLI reference](https://pnpm.io/pnpm-cli)
- [Remove command](https://pnpm.io/cli/remove)
- [Project settings](https://pnpm.io/settings)
- [pnpm package storage](https://pnpm.io/motivation)
- [npm install](https://docs.npmjs.com/cli/v11/commands/npm-install/)
- [npm ci](https://docs.npmjs.com/cli/v11/commands/npm-ci/)

[Back to technology guide](README.md)
