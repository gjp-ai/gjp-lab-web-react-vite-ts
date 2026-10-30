# Node.js

## Introduction

Node.js is a runtime that executes JavaScript outside a web browser. This React
project needs Node.js to run its development server and build tools.

During development, Node.js runs the tools that serve the application and process
source changes. During a production build, it runs the tooling that generates the
HTML, JavaScript, CSS, and assets in `dist/`. The resulting application runs in the
browser and can be deployed to a static host. This project has no Node.js backend.

## Install Node.js

Install **Node.js 24 or newer**. This project sets a minimum version, with no
exact patch pin or upper version limit. Prefer a supported LTS release meeting
that requirement for everyday development.

Use the [official Node.js download page](https://nodejs.org/en/download) to choose
your release, operating system, and architecture. Follow only the section for
your operating system; no version manager is required.

### macOS

1. On the [official download page](https://nodejs.org/en/download), select Node.js
   24 or newer and download the macOS `.pkg` installer.
   The `.pkg` installer supports Intel and Apple silicon Macs.
2. Open the downloaded `.pkg` file and follow the installation wizard.
3. Keep the default installation location and approve the installation when macOS
   requests your administrator credentials. The installer includes Node.js and npm.
4. Close and reopen Terminal, including any terminal inside your editor.
5. Verify the installation:

```sh
node --version
npm --version
```

The first command should print a version whose major number is 24 or higher.
The second should print an npm version number. npm is included with Node.js; this project uses pnpm for its dependencies.

### Linux

Use the official Linux binary archive for your processor. These steps target
standard glibc-based distributions such as Ubuntu, Debian, and Fedora. Alpine
Linux uses musl and needs a matching distribution instead of these binaries.

First, identify your processor:

```sh
uname -m
```

| Output | Node.js archive architecture |
| --- | --- |
| `x86_64` | `x64` |
| `aarch64` or `arm64` | `arm64` |

The download and extraction steps install Node.js into your user account without
requiring a system-wide installation. Extraction requires `tar` and `xz`; install
them through your distribution's package manager if missing.

On the [official download page](https://nodejs.org/en/download), select Node.js
24 or newer, Linux, and the matching architecture. Download the `.tar.xz` binary
archive and note its full path. The commands below prompt for that path; paste it
without surrounding quotes. Extraction of `.tar.xz` files also requires `xz`.

```sh
printf 'Full path to the downloaded Node.js .tar.xz archive: '
read -r node_archive
mkdir -p "$HOME/.local/lib/nodejs"
tar -xJf "$node_archive" -C "$HOME/.local/lib/nodejs"
```

The archive creates a directory such as `node-vVERSION-linux-x64`. Use the actual
directory name from your downloaded release in the next command, replacing
`NODE_DIRECTORY` before running it:

```sh
export PATH="$HOME/.local/lib/nodejs/NODE_DIRECTORY/bin:$PATH"
```

Verify the current terminal can find Node.js and npm:

```sh
node --version
npm --version
```

Expect a Node.js major version of 24 or higher and an npm version number.

To keep Node.js available in new terminals, add the following line once to your
shell's startup file: `~/.bashrc` for Bash or `~/.zshrc` for Zsh. Replace
`NODE_DIRECTORY` with the actual extracted directory name, just as above.

```sh
export PATH="$HOME/.local/lib/nodejs/NODE_DIRECTORY/bin:$PATH"
```

`PATH` is the list of directories your shell searches for commands. This line adds
Node.js's `bin` directory to that search. Open a new terminal and run
`node --version` again to confirm the change persists. Other shells need their
own equivalent startup configuration.

### Windows

1. Open **Settings → System → About** and check **System type**.
2. On the [official download page](https://nodejs.org/en/download), select Node.js
   24 or newer and Windows. Download the `.msi` installer for your processor:
   **x64** for Intel/AMD 64-bit Windows, or **ARM64** for ARM-based Windows.
3. Open the `.msi` file and follow the installation wizard. Keep npm and the
   **Add to PATH** feature enabled. The default location is normally
   `C:\Program Files\nodejs\`.
4. Extra native-module build tools are not needed for this project's basic setup;
   leave any optional tools installation unchecked unless a later dependency needs it.
5. Close and reopen PowerShell or Command Prompt, including editor terminals.
6. Verify the installation:

```powershell
node --version
npm --version
```

Expect a Node.js major version of 24 or higher and an npm version number.
If PowerShell blocks `npm.ps1`, use
`npm.cmd --version` or Command Prompt to verify npm without changing execution policy.

## Basic usage in this React project

### Verify the project requirements

Open a terminal in `gjp-lab-web-react-vite-ts` and run:

```sh
node --version
```

The project's [package.json](../../package.json) accepts **Node.js 24 or newer**
through `engines.node: ">=24.0.0"`. There are no exact-version runtime pin files.
[pnpm-workspace.yaml](../../pnpm-workspace.yaml) enables strict engine checks
during package installation,
so Node.js versions below 24 do not meet the project's requirement.

### Develop and build the application

Once Node.js is available, follow the [pnpm guide](pnpm.md) to install the package
manager, install dependencies, and run the project's commands.
The installed development tools include [Biome](biome.md) for linting and
formatting, alongside TypeScript and Vite.

| Activity | Node.js's role | What you should see |
| --- | --- | --- |
| Development | Runs Vite's development server | A local URL for opening the app in your browser |
| Production build | Runs the build tooling | Generated application files in `dist/` |
| Local preview | Runs the preview server | A local URL serving the completed build |
| Tests and coverage | Runs Jest, React Testing Library, and coverage collection | Passing suites and generated coverage reports |

Keep the development server's terminal open while working. Save a change to
`src/features/home/home-page.tsx` and check the browser for the update. Stop a running server with
Ctrl+C. Use another terminal when you need to run checks while the server is active.

For production, build the application and deploy `dist/` to a static host. Node.js
is needed in the build environment, but users do not install it to view the site.
See the [Vite guide](vite.md) for the development and build workflow in detail.

## Best practices and troubleshooting

- **Keep environments consistent:** use Node.js 24 or newer locally and in the
  build environment. Using the same supported release across environments makes
  troubleshooting easier; validate the build after upgrading.
- **Use official downloads:** select the correct operating system and architecture.
- **Avoid conflicting installations:** identify any existing Node installation
  before adding another. A different executable earlier in `PATH` may take priority.
- **Restart terminals after installation:** running shells and editors may retain
  their old environment until reopened.
- **Keep browser code browser-compatible:** Node-only APIs such as filesystem access
  are not available to React components running in the browser.

| Problem | What to check |
| --- | --- |
| `node` is not found or recognized | Reopen the terminal; check that installation completed and the Node.js `bin` directory or Windows installation directory is on `PATH` |
| The wrong version is reported | Run `command -v node` on macOS/Linux or `where.exe node` on Windows to locate the executable; correct the conflicting installation or PATH entry |
| Linux loses Node.js after restarting the terminal | Check that the PATH line was saved in the startup file for the shell you actually use |
| Linux reports `Exec format error` | Compare `uname -m` with the archive architecture you downloaded |
| Linux reports missing GLIBC versions | Check the operating-system requirements in the official Node.js build documentation; use a supported OS rather than replacing system libraries manually |
| Installation reports an engine mismatch | Verify Node.js in that same terminal and compare it with the project's Node.js 24-or-newer requirement |

## Official references

- [Introduction to Node.js](https://nodejs.org/learn/getting-started/introduction-to-nodejs)
- [Node.js downloads](https://nodejs.org/en/download)
- [Node.js release archive](https://nodejs.org/download/release/)
- [Node.js API documentation](https://nodejs.org/docs/latest/api/)
- [Supported platforms and build requirements](https://github.com/nodejs/node/blob/HEAD/BUILDING.md)

[Back to technology guide](README.md)
