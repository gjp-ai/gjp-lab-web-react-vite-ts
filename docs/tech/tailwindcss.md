# Tailwind CSS 4

## Contents

- [Introduction](#introduction)
- [Configuration in this project](#configuration-in-this-project)
- [Basic usage](#basic-usage)
- [Practical examples](#practical-examples)
- [Best practices and troubleshooting](#best-practices-and-troubleshooting)
- [Official references](#official-references)

## Introduction

Tailwind CSS generates styles from utility classes written in your components.
Each utility has a focused purpose: `flex` selects a layout, `gap-2` adds spacing
between its children, and `text-primary` applies a theme color. In React, write
these classes in `className`.

**Existing setup:** `tailwindcss` and `@tailwindcss/vite` **4.3.3** are exact
development dependencies in [package.json](../../package.json). Tailwind styles
the shared navigation, Lucide icons, About's responsive grid, and local shadcn/ui
components. The landing page also keeps custom CSS for its headings and layout.

**Existing features** below describe the running app. **Optional recommendations**
are exercises you can add; their source files are not installed features.
All component examples use the project's installed dependencies.

## Configuration in this project

### Files and responsibilities

| File | Role |
| --- | --- |
| [vite.config.ts](../../vite.config.ts) | Loads the Tailwind Vite plugin alongside React |
| [src/app/styles.css](../../src/app/styles.css) | Imports Tailwind, declares theme tokens, and keeps custom page CSS |
| [src/main.tsx](../../src/main.tsx) | Imports the global stylesheet once |
| [biome.json](../../biome.json) | Enables parsing of Tailwind CSS directives |
| [components.json](../../components.json) | Points shadcn/ui at `src/app/styles.css` with CSS variables enabled |
| [src/shared/lib/utils.ts](../../src/shared/lib/utils.ts) | Merges conditional utilities through `cn` |

### Vite and the stylesheet

**Existing configuration:** the relevant Vite imports and plugin list are shown
below. This is an excerpt; keep the rest of the existing configuration, including
its base path, alias, server settings, and build options.

```ts
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';

// Inside the existing defineConfig object:
// plugins: [react(), tailwindcss()],
```

`src/app/styles.css` starts with:

```css
@import "tailwindcss";
```

The Vite plugin compiles the CSS during development and builds. The import includes
Tailwind's theme, base styles (Preflight), and generated utilities. The project's
own CSS follows it. `src/main.tsx` imports this stylesheet with `import './app/styles.css'`.

There is no Tailwind v3 `tailwind.config.js`, `content` array, or separate PostCSS
configuration. Class detection is automatic for eligible source files; keep class
names complete and visible in source, as shown below. Initial installation belongs
in [Project creation](../project-create.md).

### Theme tokens and appearance modes

**Existing configuration, shortened excerpt:** these declarations are part of the
larger `@theme inline` and `:root` blocks in `src/app/styles.css`:

```css
@theme inline {
  --color-primary: var(--primary);
  --color-card: var(--card);
  --color-muted-foreground: var(--muted-foreground);
  --color-border: var(--border);
}

:root {
  --primary: var(--accent-light, #087a57);
  --card: #ffffff;
  --muted-foreground: #475569;
  --border: #e2e8f0;
}

:root[data-mode="dark"] {
  --primary: var(--accent-dark, #3ecf8e);
  --card: #151e2b;
  --muted-foreground: #aebac8;
  --border: #2b3645;
}
```

The `--color-*` theme namespace makes utilities such as `text-primary`, `bg-card`,
and `border-border` available. `inline` lets their generated values reference the
underlying CSS variables. Those ordinary variables hold the current palette.

Prefer these semantic names when extending shared UI. They describe a color's
role rather than repeating a particular hex value in each component. AppearanceProvider writes root `data-mode`, `data-accent`, and `color-scheme`.
The app supports Light, Dark, and System modes with ten accents. The custom
Tailwind `dark` variant follows `data-mode="dark"`, including portaled components.

Biome's `css.parser.tailwindDirectives: true` lets it parse directives such as
`@theme`. Biome formats and lints CSS; the Tailwind Vite plugin generates utilities.

## Basic usage

### Read and edit utility classes

After installing dependencies, run from the project root:

```sh
pnpm dev
```

Open `http://127.0.0.1:5174/lab/react/v2/` and select About. Its grid contains:

```tsx
<div className="mt-10 grid gap-4 md:grid-cols-3">{/* Existing About cards */}</div>
```

This is a JSX fragment illustrating the existing container; keep the actual Card
children when editing it.

| Class | Effect in this project |
| --- | --- |
| `mt-10` | Space above the grid; 2.5rem with the default spacing scale |
| `grid` | CSS grid layout |
| `gap-4` | Space between grid items; 1rem with the default spacing scale |
| `md:grid-cols-3` | Three equal columns from the default `md` breakpoint upward |
| `size-6` | Width and height together; 1.5rem on the default scale |
| `text-primary` | The theme's primary text or icon color |
| `hover:bg-muted` | Muted background while the element is hovered |

Unprefixed classes apply at all widths. Responsive prefixes add rules at their
minimum width; `md` is 48rem by default (768px at a 16px initial font size).
About's cards stack below that breakpoint and use three columns above it. The
project also has a separate custom CSS media query at 480px for the landing layout.

Try changing `gap-4` to `gap-6` in About, save, and expect more space between cards.
Restore it after the exercise if you want to keep the current design.

### Verify changes

```sh
pnpm check
pnpm typecheck
pnpm build
```

Expect no Biome or type errors and generated CSS under `dist/assets/`.
Build includes type checking but does not run Biome. Use `pnpm check:fix` when
needed, review the edits, and recheck. Use `pnpm preview` after building to inspect
production output. Verify layout and keyboard focus in the browser too.

## Practical examples

### 1. Add a themed message

**Optional recommendation:** create `src/features/home/components/theme-note.tsx`:

```tsx
import { cn } from '@/shared/lib/utils';

type ThemeNoteProps = {
  readonly active: boolean;
};

export function ThemeNote({ active }: ThemeNoteProps) {
  return (
    <p
      role="status"
      className={cn(
        'rounded-lg border bg-card p-4',
        active ? 'border-primary text-primary' : 'border-border text-muted-foreground',
      )}
    >
      {active ? 'Selected for the next experiment.' : 'Ready for the next experiment.'}
    </p>
  );
}
```

The shared classes set shape, border width, background, and padding. The condition
selects complete border/text utilities. `cn` combines them through `clsx` and
`tailwind-merge`, resolving recognized conflicting Tailwind classes.

For example, `cn('px-2', 'px-4')` returns `px-4`. Reordering conflicting class names
in an ordinary `className` string is not a reliable replacement for that helper.

### 2. Try conditional styles with React state

**Optional recommendation:** after adding ThemeNote, create
`src/features/home/components/style-practice.tsx`:

```tsx
import { useState } from 'react';
import { ThemeNote } from '@/features/home/components/theme-note';
import { Button } from '@/shared/ui/button';

export function StylePractice() {
  const [active, setActive] = useState(false);

  return (
    <section className="my-8 max-w-md" aria-label="Tailwind style practice">
      <ThemeNote active={active} />
      <Button
        type="button"
        variant="outline"
        className="mt-4"
        aria-pressed={active}
        onClick={() => setActive((value) => !value)}
      >
        {active ? 'Clear selection' : 'Select experiment'}
      </Button>
    </section>
  );
}
```

Import `StylePractice` in `src/features/home/home-page.tsx` and render `<StylePractice />` before the
closing `</section>` of its returned section. Preserve the rest of Home.
Expect a muted message initially. Activating the button updates the message and
uses the primary color for its text and border; activating it again restores the
initial state. Try Tab, Enter,
and Space, and check that focus stays visible. React manages state, Base UI
handles the local Button's interaction, and Tailwind supplies the styling.

Remove the JSX usage and import before deleting the exercise files.

### 3. Keep class names detectable

**Recommended pattern, used in ThemeNote:** select between complete strings:
`active ? 'text-primary' : 'text-muted-foreground'`.

Avoid constructing fragments such as `text-${color}`. Tailwind scans source text;
it does not execute React to discover every possible class. A complete-name map
or conditional is suitable for a small known set of styles.

The same rule applies when a class comes from props: make the allowed complete
names visible somewhere in the scanned source. `cn` merges classes but does not
make dynamically assembled names detectable.

### 4. Reuse theme colors and existing components

**Existing feature:** About's Lucide icons use `mb-3 size-6 text-primary`.
The icon dimensions come from `size-6`, spacing from `mb-3`, and color from
`text-primary`. Keep decorative icons hidden with `aria-hidden="true"`.

**Optional recommendation:** to adjust the shared accent, edit the existing
`--primary` value inside `:root`, then inspect token-based text, borders, buttons,
and focus styles. Keep text contrast readable and restore the value if this is
only a learning exercise. Existing landing-page CSS also contains hardcoded
colors; review those declarations when making a complete palette change.

Use the local [shadcn/ui Button and Card](shadcn-ui.md) for reusable controls and
cards. Add utilities such as `mt-4` or `max-w-md` for page-specific placement;
avoid duplicating their internal styles in every page.

## Best practices and troubleshooting

- Use semantic theme colors and complete utility names that the scanner can detect.
- Start with the small-screen layout; add responsive rules for wider layouts as needed.
- Keep meaningful custom CSS where it explains the existing page. Utility classes
  and custom CSS can coexist without rewriting the whole landing page.
- Preserve visible focus and accessible labels. A hover style alone does not help
  keyboard users; the current app already has a global `:focus-visible` outline.
- Check CSS layers and specificity when styles conflict. The current unlayered
  custom rules can override Tailwind's layered utilities, including global heading
  rules. `cn` resolves class conflicts, not every CSS cascade conflict.
- Keep generated CSS in `dist/` and installed packages unchanged. Edit source and rebuild.

| Problem | What to check |
| --- | --- |
| Utilities have no visible effect | Confirm the Tailwind plugin, stylesheet import, and complete class spelling |
| A conditional color is missing | Use literal complete class names instead of assembling fragments |
| Three columns do not appear on a phone | `md:grid-cols-3` starts at the `md` minimum width; stacking below it is expected |
| `text-primary` is missing or incorrect | Check both `--color-primary` in `@theme inline` and `--primary` in `:root` |
| A utility does not override a heading or button style | Inspect the custom global rule and CSS layer/specificity; use the local UI component for controls |
| Biome reports a Tailwind directive parsing error | Keep `css.parser.tailwindDirectives` enabled in `biome.json` |
| Preview still shows the previous layout | Run `pnpm build` again before previewing |

## Official references

- [Vite installation](https://tailwindcss.com/docs/installation/using-vite)
- [Theme variables](https://tailwindcss.com/docs/theme)
- [Detecting classes](https://tailwindcss.com/docs/detecting-classes-in-source-files)
- [Responsive design](https://tailwindcss.com/docs/responsive-design)
