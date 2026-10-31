# Appearance: code design

Requirements: [theme.md](../requirement/theme.md). Mode has two explicit values,
Light and Dark. The menu toggles mode directly; only accent selection opens a dialog.

## Files and ownership

| Source | Responsibility |
| --- | --- |
| [appearance.ts](../../src/features/appearance/model/appearance.ts) | Ten accent IDs, types, parser, safe storage read, and legacy migration |
| [appearance-store.ts](../../src/features/appearance/model/appearance-store.ts) | Provider-owned vanilla Zustand store |
| [appearance-provider.tsx](../../src/features/appearance/components/appearance-provider.tsx) | Initial state, document tokens, persistence, and cross-tab synchronization |
| [mode-toggle.tsx](../../src/features/appearance/components/mode-toggle.tsx) | Sun/Moon direct toggle with pressed state and tooltip |
| [appearance-settings.tsx](../../src/features/appearance/components/appearance-settings.tsx) | Accent-only Base UI dialog, radio choices, reset, and focus return |
| [menu-settings.tsx](../../src/app/menu-settings.tsx) | Language, mode, and accent controls in menu order |
| [appearance-head.ts](../../build/appearance-head.ts) | Self-contained startup script embedded by Vite before paint |
| [styles.css](../../src/app/styles.css) | Semantic theme tokens, accent palettes, focus, and settings layout |

## Model and legacy values

`Mode` is `'light' | 'dark'`. `Appearance` has readonly `mode` and `accent` fields.
The default is `{ mode: 'light', accent: 'mint' }`. The storage key remains
`gjp-lab.appearance`; no storage schema rename is required.

`parseAppearance(raw, allowed)` catches malformed JSON, checks the result is an
object, and defaults each invalid field independently. Only `'dark'` selects Dark;
Light, missing/invalid values, and legacy `'system'` select Light. A valid accent
survives that migration. `readAppearance(storage)` catches storage read failures.
There is no `resolveMode` function or device-theme subscription.

## Startup and provider

Vite's HTML transform embeds `appearanceHeadScript()` in the document head. The
script embeds `parseAppearance.toString()` and serialized accent/key constants,
reads storage safely, and sets `data-mode`, `data-accent`, and `style.colorScheme`.
It uses `pref.mode` directly and never calls `matchMedia`. Keep the parser
self-contained so its serialized source has no module dependencies.

AppearanceProvider creates its store once with a lazy state initializer, reads
`appearance` through Zustand `useStore`, and exposes `{ appearance, update }` via
context. Its layout effect applies the same root attributes and native color scheme,
then updates the theme-color meta tag from the resolved background token.

`update(next)` updates the store first and then attempts localStorage persistence.
A write failure keeps the current session usable. A storage listener accepts only
localStorage events for the appearance key or a whole-store clear; it parses the
new value through the same migration. Unrelated/sessionStorage events are ignored.
The listener is removed on unmount. No effect follows operating-system brightness.

## Footer controls

ModeToggle displays Sun in Light and Moon in Dark. Its native Button has the stable
accessible name “Dark mode”, `aria-pressed` equal to the dark state, and a title /
Base UI tooltip naming the next action. Clicking calls `update` with the opposite
mode and the existing accent. It does not mount a dialog or reset language/navigation.

AppearanceSettings keeps a compact Palette trigger colored by the current primary
accent. Its dialog contains only ten named native radio options. Selecting a radio
replaces only `accent`; Reset accent color restores Mint while preserving mode.
`useId` gives each instance a unique radio-group name. Base UI handles containment,
Escape, dismissal, and scroll locking. `finalFocus` returns to its trigger, or to a
visible Accent color trigger in the other responsive layout if the original is hidden.
The dialog can nest inside the mobile navigation drawer and returns to that drawer.

MenuSettings composes LanguageToggle, ModeToggle, and the accent trigger. Expanded
sidebar/mobile footer controls share a horizontal row; the 64px rail stacks 44px
controls. Buttons have accessible labels, keyboard focus, and tooltips.

## CSS and contrast

`data-mode` selects light/dark surfaces. Each `data-accent` defines reference, light,
and dark accent variables; `--primary` selects the shade appropriate to the mode.
Foreground, muted text, border/input, destructive, primary foreground, hover, and
pressed tokens remain semantic. Tailwind's dark variant follows the root attribute,
not a device media query. The Button's `data-variant` state selectors preserve
opaque primary/hover/pressed backgrounds. Legacy native-button rules exclude
`data-slot="button"` controls.

Accent fieldsets use labeled radio inputs and swatches. Checked and focus-visible
states are styled through their labels. Palette tests check all twenty mode/accent
combinations for text, button, muted-text, input-border, and focus contrast.

## Validation and extension

Run `pnpm check`, `pnpm test:coverage`, and `pnpm build`. The appearance model tests
cover malformed storage, independent defaults, legacy System migration, bootstrap
parity, and contrast. Provider tests cover persistence, blocked storage, cross-tab
updates, cleanup, and absence of device-theme subscriptions. Application tests cover
direct toggles, changing icons, no mode popup, independent accent reset, and the
mobile drawer's nested accent dialog.

To add an accent, extend `accents` and its CSS variables together. Keep the parser,
startup script, tests, [requirements](../requirement/theme.md), and setup snapshots
aligned. Browser layout, keyboard, and visual checks remain pending because browser
access was previously restricted; automated DOM tests do not replace those checks.
