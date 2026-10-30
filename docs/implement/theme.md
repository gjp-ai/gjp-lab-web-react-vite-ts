# Appearance: code design

Source guide for the current implementation. Product choices and reference colors
are in [theme requirements](../requirement/theme.md). Menu integration is described
in [menu implementation](menu.md).

## 1. Modules and execution order

```text
features/appearance/model/appearance.ts (types + parser + mode resolver)
       ├──→ build/appearance-head.ts → Vite HTML transform → document root before paint
       └──→ AppearanceProvider → document root during React updates
                      ↓
               AppearanceSettings → update(next) → localStorage
                      ↑                            ↓
                  React context ← storage / device-preference events

app/styles.css reads root data-mode/data-accent → all pages and portaled components
```

| Source | Main exports or integration |
| --- | --- |
| [appearance.ts](../../src/features/appearance/model/appearance.ts) | `accents`, `Accent`, `Mode`, `Appearance`, `appearanceKey`, `parseAppearance`, `resolveMode`, `readAppearance` |
| [appearance-head.ts](../../build/appearance-head.ts) | `appearanceHeadScript(): string`; Node-side HTML script generator |
| [vite.config.ts](../../vite.config.ts) | `appearance-before-paint` plugin with `transformIndexHtml` |
| [appearance-provider.tsx](../../src/features/appearance/components/appearance-provider.tsx) | `AppearanceProvider`, `useAppearance`; React state and external synchronization |
| [appearance-settings.tsx](../../src/features/appearance/components/appearance-settings.tsx) | `AppearanceSettings({ compact })`; dialog, radio groups, reset, focus return |
| [main.tsx](../../src/main.tsx) | `StrictMode → AppProviders → RouterProvider` |
| [app-shell.tsx](../../src/app/app-shell.tsx) | Desktop/mobile placement of settings triggers |
| [styles.css](../../src/app/styles.css) | Attribute selectors, semantic tokens, palettes, and settings layout |
| [button.tsx](../../src/shared/ui/button.tsx) | Adds `data-variant` for primary-button state selectors |

## 2. Preference types and parsing

`accents` is a readonly tuple of ten stable string IDs. `Accent` is inferred from
its elements. `Mode` is `'light' | 'dark' | 'system'`. `Appearance` contains readonly
`mode` and `accent` fields; it stores the user's selection, not the resolved device mode.

| Function | Contract |
| --- | --- |
| `parseAppearance(raw, allowed)` | Parse a JSON string/null; return a valid `Appearance`, defaulting each invalid field independently |
| `readAppearance(storage)` | Read `appearanceKey` through a structural `getItem` interface; catch access errors |
| `resolveMode(mode, systemDark)` | Return the actual `'light' | 'dark'` mode without mutating the saved preference |

`parseAppearance` treats malformed JSON and non-object values as missing fields.
Mode defaults to System and accent to Mint. The `allowed` argument supplies the
accent list explicitly so the parser can also execute in the startup script.

The resolver below is a source excerpt from `appearance.ts`, not a standalone module:

```ts
export function resolveMode(mode: Mode, systemDark: boolean): 'light' | 'dark' {
  return mode === 'system' ? (systemDark ? 'dark' : 'light') : mode;
}
```

Storage key: `gjp-lab.appearance`. The serialized object contains only `mode` and
`accent`. Reset writes System + Mint; it does not need to remove the storage key.

## 3. Before-paint HTML initialization

`appearanceHeadScript()` builds a self-executing JavaScript string. It embeds
`parseAppearance.toString()`, `resolveMode.toString()`, and JSON-serialized accents/key.
Vite injects it as a classic inline script using `injectTo: 'head-prepend'`.

Execution order inside the generated script:

1. Read local storage inside `try/catch`.
2. Parse and validate using the embedded parser.
3. Read `matchMedia('(prefers-color-scheme: dark)').matches`, falling back to false.
4. Resolve the actual mode.
5. Set root `data-mode`, `data-accent`, and `style.colorScheme` before styles/app render.

**Maintenance constraint:** the two serialized functions must remain self-contained
and cannot gain references to imported helpers, closures, or module-level constants.
Passing dependencies as arguments prevents those references from being undefined
in the generated script. Do not move this work to a normal React effect, which
would run after the initial render.

A restrictive host CSP must authorize the generated inline script with a hash or
nonce. Host policy is outside this Vite project; changing the generated script also
changes any required hash.

## 4. React provider lifecycle

`AppearanceProvider` creates a vanilla Zustand store once using React state.
`useStore` subscribes to its appearance value; store actions update it immutably.
`AppearanceContext` exposes `{ appearance, update }`. `useAppearance()` throws when
called outside its provider, making missing setup explicit.

| Provider value | Initialization / derivation |
| --- | --- |
| `appearance` state | A scoped Zustand store initialized lazily from storage; blocked access uses defaults |
| `systemDark` state | Lazy `systemIsDark()` reads the media query; failure returns false |
| `resolved` value | Derived during render using `resolveMode(appearance.mode, systemDark)` |

A `useLayoutEffect` depending on `resolved` and `appearance.accent` writes document
attributes before the browser paints the React update. It also reads the computed
`--background` and updates the existing `meta[name="theme-color"]` element.
The document root, rather than an app wrapper, is the target so Base UI portals
inherit the same CSS variables and dark variant.

`update(next)` sets React state first, then attempts `localStorage.setItem`.
A write error does not undo the current session's selection. Persistence is tied
to explicit updates rather than an effect that writes on every received state
change; this prevents tabs from echoing storage events back to each other.

The subscription effect installs two listeners:

- A media-query `change` listener updates `systemDark`. Explicit Light/Dark remains
  unchanged because `resolveMode` ignores that boolean for those selections.
- A window `storage` listener checks `event.storageArea`, then accepts the appearance
  key or `key === null` (storage clear). It parses `event.newValue` and sets state
  without writing storage. Deletion/clear passes null and restores defaults.

Cleanup removes both listeners, including during StrictMode's effect setup/cleanup
cycle. Provider state changes do not change router/page keys or remount the Outlet.

## 5. CSS token resolution

| Selector / token | Role |
| --- | --- |
| `:root` | Light surface/text defaults and light primary-token resolution |
| `[data-accent="…"]` | Define `--accent-reference`, `--accent-light`, and `--accent-dark` for one preset |
| `:root[data-mode="dark"]` | Override neutral surfaces/text and resolve the dark primary token |
| `--primary` | Selected light/dark action color |
| `--primary-foreground` | Text on filled actions; white in light mode, dark ink in dark mode |
| `--primary-hover`, `--primary-pressed` | `color-mix` states: darker light-mode actions, lighter dark-mode actions |
| `@theme inline` | Map semantic variables into Tailwind utilities such as `bg-primary` |
| `@custom-variant dark` | Match root `data-mode="dark"` and descendants instead of the OS preference |

Decorative separators and panel outlines use the softer `--border` token.
Meaningful control boundaries use `--input` (mapped to `border-input`), retaining
stronger contrast without making the sidebar, footer, and Home rules look heavy.
The contrast test checks `--input` for control boundaries; focus uses `--primary`.

The accent swatch has its own `data-accent`, so it displays `--accent-reference`
without changing the app's selected mode/accent. Action shades can differ from
reference swatches to meet contrast targets. The exact palette is maintained in
CSS rather than duplicated in TypeScript.

`Button` emits `data-slot="button"` and `data-variant`. CSS uses the default variant
selector for primary/hover/pressed backgrounds, avoiding translucent primary
backgrounds that could reduce text contrast. Existing native-button styles also
use these tokens and continue excluding `data-slot="button"` elements.

## 6. Settings component composition

`AppearanceSettings` reads the provider through `useAppearance`. Its `compact` prop
controls trigger text and tooltip enablement; each desktop/mobile instance has its
own Base UI Dialog.Root but shares the same preference state.

The trigger combines Tooltip.Trigger, Dialog.Trigger, and the owned Button through
Base UI `render` composition. There is no Radix `asChild` wrapper.

`useId()` supplies distinct native radio-group names for each settings instance.
Mode options come from the local typed `modes` array; accent options map `accents`.
Each `onChange` spreads the existing preference and replaces just its own field.
Reset calls `update({ mode: 'system', accent: 'mint' })`.

Native fieldsets, legends, and labeled radio inputs provide selection semantics
and arrow-key behavior. CSS styles `:has(input:checked)` and
`:has(input:focus-visible)` on the surrounding label; swatches remain decorative.

Base UI handles focus containment, Escape/outside dismissal, and scroll locking.
`finalFocus` first checks whether `triggerRef` still has a rendered rectangle. If
resizing hid it, the callback finds the visible Appearance trigger in the other
layout. The dialog's overflow is vertical; its width is capped at viewport minus
24px. Mobile header controls have explicit 44px widths.

## 7. Extension and debugging map

| Change or symptom | Code to inspect/change |
| --- | --- |
| Add an accent | Extend `accents` and add all three CSS accent variables; the settings list derives automatically |
| Change default | Update parser fallback, reset action, CSS fallback colors, and tests together |
| Rename an accent ID | Plan storage migration or accept fallback to Mint for old values |
| Wrong theme on initial load | Inspect generated HTML, script ordering, CSP, and serialized-function dependencies |
| OS overrides explicit Dark/Light | Check `resolveMode` and the custom Tailwind dark variant |
| Dialog/tooltip has stale colors | Check root attributes and inherited semantic tokens |
| Tabs overwrite each other repeatedly | Ensure storage events update state without calling `update` |
| Theme change resets a page | Inspect provider placement and page/router keys; avoid conditional router trees |

## 8. Tests and verification boundaries

[appearance.test.js](../../src/features/appearance/__tests__/appearance.test.js) contains six tests: preference
round trips, independent invalid-field fallback/storage failure, system resolution,
startup parity across all inputs, startup API failures, and palette contrast.

Startup tests execute the generated script with Node `vm` and mocked browser
objects. Contrast tests read CSS token blocks and compute luminance ratios for
all 20 palettes across page/card/muted surfaces and filled-button text. These test
base token pairs; they do not render every hover, disabled, or focus composition.
Keep the token-block format compatible with the test's parser when editing CSS.

```sh
pnpm test src/features/appearance/__tests__/appearance.test.js
pnpm check
pnpm build
```

The model tests execute the startup script in a Node VM and check palette token
contrast. Provider tests cover saved preferences, media changes, storage failures,
cross-tab events, and cleanup. The application suite exercises the real appearance
dialog's mode, accent, reset, and close actions in jsdom.

These automated tests do not establish visual contrast for every composed state,
full keyboard/screen-reader behavior, or first-paint behavior in a real browser.
Those checks remain part of the [appearance checklist](../requirement/theme.md).
See the [verification summary](../README.md#verification) for current results.
