# Lucide React

## Contents

- [Introduction](#introduction)
- [Configuration in this project](#configuration-in-this-project)
- [Basic usage](#basic-usage)
- [Practical examples](#practical-examples)
- [Best practices and troubleshooting](#best-practices-and-troubleshooting)
- [Official references](#official-references)

## Introduction

Lucide React supplies icons as React components. An icon such as `Compass` renders
an inline SVG: its shapes become part of the page instead of a separate image
request. You can give it props and CSS classes just like other React components.

**Existing setup:** `lucide-react` **1.61.0** is an exact application dependency in
[package.json](../../package.json). Named imports let the production bundler remove
unused icons. The app uses icons to support navigation labels, actions, and About
cards. No icon font, separate icon stylesheet, or provider is needed here.

**Existing features** below describe the running application. **Optional
recommendations** are learning exercises; their example files are not installed
features. All examples use dependencies already present in the project.

## Configuration in this project

### Files and current icons

| File | Existing use |
| --- | --- |
| [src/app/app-shell.tsx](../../src/app/app-shell.tsx) | `FlaskConical` for the brand and menu/toggle controls |
| [src/features/home/home-page.tsx](../../src/features/home/home-page.tsx) | Named technology icons such as `Atom`, `Wind`, and `FlaskConical` |
| [src/features/about/about-page.tsx](../../src/features/about/about-page.tsx) | `Compass`, `Layers`, and `Code2` above card text |
| [components.json](../../components.json) | `iconLibrary: "lucide"` selects icons for future shadcn additions |
| [src/shared/ui/button.tsx](../../src/shared/ui/button.tsx) | Provides default SVG sizing and spacing for local Buttons |
| [src/app/styles.css](../../src/app/styles.css) | Supplies theme colors used by utilities such as `text-primary` |

Icons are imported directly from `lucide-react`. The navigation feature has a small whitelist mapping configured menu icon names
to named imports; other components import their icons directly. No additional
Vite icon plugin is configured. `components.json` configures the shadcn CLI;
it does not automatically add icons to an existing component.

### Size, color, and stroke

| Prop or class | Meaning and recommended use |
| --- | --- |
| `className="size-4"` | 1rem square on the default Tailwind scale; used beside navigation labels |
| `className="size-5"` | 1.25rem square; used for the brand icon |
| `className="size-6 text-primary"` | 1.5rem square and themed color; used on About cards |
| `size={20}` | Sets SVG width and height to 20; useful when sizing without Tailwind |
| `color` | Defaults to `currentColor`, so icons follow the surrounding CSS text color |
| `strokeWidth={2}` | The default line thickness; keep consistent unless a design needs another value |
| `aria-hidden="true"` | Keeps decorative icons out of the accessibility tree |

Without CSS or a size prop, Lucide defaults to 24 by 24. Prefer the existing
Tailwind size classes for this project's UI and avoid setting a conflicting
`size` prop too. CSS width/height can override SVG dimension attributes.

The local Button normally sizes child SVGs to `size-4` unless the icon has its
own `size-*` class. For an intentional adjustment inside Button, use a class
such as `size-5`. See [Tailwind CSS](tailwindcss.md) for utilities and theme tokens.

## Basic usage

### Import and render an icon

**Optional learning example:** create `src/features/home/components/project-label.tsx`:

```tsx
import { Compass } from 'lucide-react';

export function ProjectLabel() {
  return (
    <p className="inline-flex items-center gap-2 text-muted-foreground">
      <Compass className="size-5 text-primary" aria-hidden="true" />
      Ready to explore
    </p>
  );
}
```

Import `ProjectLabel` in `src/features/home/home-page.tsx` and render `<ProjectLabel />` before its
closing `</section>`. The expected result is a compass in the selected accent color beside visible
text. `items-center` aligns the icon and label; `gap-2` separates them.
The text explains the meaning, so the icon is decorative.

From the project root, run `pnpm dev` and inspect the page at
`http://127.0.0.1:5174/lab/react/v2/`. Stop development with Ctrl+C.
Installation belongs in [Project creation](../project-create.md); no extra package
is needed for this exercise.

### Check an icon change

```sh
pnpm check
pnpm typecheck
pnpm build
```

Biome checks imports, formatting, and lint rules. TypeScript checks icon names and
props. Build includes type checking but does not run Biome. Use `pnpm check:fix`
when needed, review the edits, and recheck. After building, `pnpm preview` lets
you inspect the production output at the URL it prints.

Also check visible labels, icon contrast, keyboard focus, and narrow layouts in
the browser. A successful build does not verify those visual and interaction details.

## Practical examples

### 1. Pair an icon with a visible button label

**Optional counter excerpt:** in a component that defines `setCount`, import
`ArrowUpRight` from `lucide-react` and Button from `@/shared/ui/button` to use:

```tsx
<Button size="lg" type="button" onClick={() => setCount((value) => value + 1)}>
  Try an interaction <ArrowUpRight aria-hidden="true" />
</Button>
```

The visible text names the action. The arrow is hidden from assistive technology
so it does not duplicate that name. The Button supplies interaction and SVG size;
Lucide supplies the drawing. Click, Enter, or Space activates the button, not the SVG.

### 2. Create a named icon-only Reset control

**Optional recommendation:** create `src/features/home/components/reset-icon-button.tsx`:

```tsx
import { RotateCcw } from 'lucide-react';
import { Button } from '@/shared/ui/button';

type ResetIconButtonProps = {
  readonly onReset: () => void;
  readonly disabled?: boolean;
};

export function ResetIconButton({ onReset, disabled = false }: ResetIconButtonProps) {
  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      className="size-11"
      aria-label="Reset counter"
      disabled={disabled}
      onClick={onReset}
    >
      <RotateCcw aria-hidden="true" />
    </Button>
  );
}
```

The accessible name belongs to the Button, where the action lives. The icon stays
decorative. `size="icon"` selects the local square-button variant; `size-11`
increases its target to 2.75rem on the default scale, while the drawing remains
small. A tooltip or an accessible label on the SVG alone is not a replacement
for naming the control. Prefer a visible **Reset** label when space permits.

### 3. Connect the icon button to state

**Optional recommendation:** after creating ResetIconButton, create
`src/features/home/components/icon-counter.tsx`:

```tsx
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { ResetIconButton } from '@/features/home/components/reset-icon-button';
import { Button } from '@/shared/ui/button';

export function IconCounter() {
  const [count, setCount] = useState(0);

  return (
    <section className="my-8" aria-label="Icon counter practice">
      <p className="mb-4" role="status">
        Practice count: {count}
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <Button type="button" onClick={() => setCount((value) => value + 1)}>
          <Plus aria-hidden="true" /> Add one
        </Button>
        <ResetIconButton onReset={() => setCount(0)} disabled={count === 0} />
      </div>
    </section>
  );
}
```

Import `IconCounter` in `src/features/home/home-page.tsx` and render `<IconCounter />` before its
closing `</section>`. Preserve the diagram; this optional exercise owns its own state.

Expect **Practice count: 0** with Reset disabled initially. Add one enables Reset;
Reset returns the count to zero and becomes disabled again. Check Tab, Enter,
and Space. The count's status region announces updates, and the Reset button's
accessible name remains **Reset counter**.

### 4. Keep navigation as a link

**Existing pattern, optional reusable component:** the navigation renderer places `Info`
beside the About label. You can use the same approach in
`src/features/home/components/about-icon-link.tsx`:

```tsx
import { Link } from '@tanstack/react-router';
import { Info } from 'lucide-react';

export function AboutIconLink() {
  return (
    <Link to="/about" className="inline-flex items-center gap-2 text-primary hover:underline">
      <Info className="size-4" aria-hidden="true" /> About this project
    </Link>
  );
}
```

Import and render `AboutIconLink` inside HomePage's returned section if trying it.
Expect navigation to `/lab/react/v2/about`. The route target remains `/about`;
the [router](tanstack-router.md) supplies the hosting prefix. Use a link for
navigation and the local [Button](shadcn-ui.md) for an action.

When removing exercises, remove their rendered JSX and imports first, then delete
their component files. IconCounter depends on ResetIconButton, so remove that
usage before deleting the Reset component.

## Best practices and troubleshooting

- Import icons by name. Avoid a dynamic loader or importing the entire collection
  when the required icons are already known in source.
- Prefer icons beside visible labels. Keep decorative SVGs hidden, and name
  icon-only controls on their interactive wrapper.
- Put click handling on Button or Link rather than a bare SVG. Preserve keyboard
  behavior and visible focus through the project's existing components.
- Keep dimensions and stroke thickness consistent for the same context. Give
  icons adequate contrast and avoid using color alone to explain state.
- Use Tailwind theme colors so icons follow the project palette. The actual
  control's target can be larger than the icon drawing.
- Use `import type` for Lucide types if a future shared component needs them;
  simple icon usage needs no extra type annotation or wrapper abstraction.

| Problem | What to check |
| --- | --- |
| An imported icon name is rejected | Check the spelling and exports available in the installed `lucide-react` version |
| The icon color differs from its surroundings | Check `currentColor`, inherited text color, and any explicit `color` or `text-*` class |
| Changing `size` has no effect inside Button | Its SVG CSS may set dimensions; use an explicit Tailwind `size-*` class |
| An icon-only button has no accessible name | Put `aria-label` or appropriate visually hidden text on the Button |
| An SVG cannot be reached with the keyboard | Put the action on an actual Button or Link; decorative SVGs should not receive focus |
| An icon looks too thin or heavy | Check `strokeWidth`; the default is 2 |
| A removed exercise causes unused-import errors | Remove its import and JSX references together |

## Official references

- [Lucide for React](https://lucide.dev/guide/react/)
- [Getting started and icon props](https://lucide.dev/guide/react/getting-started)
- [Sizing](https://lucide.dev/guide/react/basics/sizing)
- [Stroke width](https://lucide.dev/guide/react/basics/stroke-width)
- [Accessibility](https://lucide.dev/how-to/accessibility)
