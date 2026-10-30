# shadcn/ui and Base UI

## Contents

- [Introduction](#introduction)
- [Configuration in this project](#configuration-in-this-project)
- [Basic usage](#basic-usage)
- [Practical examples](#practical-examples)
- [Best practices and troubleshooting](#best-practices-and-troubleshooting)
- [Official references](#official-references)

## Introduction

shadcn/ui supplies component source that you copy into your project and maintain
locally. You import those local files rather than a single shadcn runtime package.
This makes their styling and behavior available for you to inspect and customize.

**Existing setup:** Button and Card come from the official shadcn/ui `base-nova`
registry. Their imports were adapted to the local class helper, and Biome formats
the source. The project uses Base UI **1.9.0** for interaction primitives.

| Technology | Responsibility in this project |
| --- | --- |
| shadcn/ui | Local Button and Card source, including styling and component composition |
| Base UI | Button interaction and native-button behavior underneath the local Button |
| Tailwind CSS 4 | Utility classes, responsive layouts, and theme colors |
| Lucide React | SVG icons accompanying labels and actions |
| React and TypeScript | Component composition, state, callbacks, and checked props |

Card is a presentational component built from ordinary `div` elements; it does
not use a Base UI primitive. The local Button wraps `@base-ui/react/button`.
No Radix UI dependency is used. An installed primitive package does not mean
that every corresponding shadcn component has been added locally.

**Existing features** below describe the running app. **Optional recommendations**
are exercises or future additions; their files are not installed features.

## Configuration in this project

### Files and responsibilities

| File | Responsibility |
| --- | --- |
| [components.json](../../components.json) | Configuration for future shadcn CLI additions |
| [src/shared/ui/button.tsx](../../src/shared/ui/button.tsx) | Base UI Button wrapper, variants, sizes, and exported `buttonVariants` |
| [src/shared/ui/card.tsx](../../src/shared/ui/card.tsx) | Presentational Card and its exported parts |
| [src/shared/lib/utils.ts](../../src/shared/lib/utils.ts) | `cn` helper for combining and merging classes |
| [src/app/styles.css](../../src/app/styles.css) | Tailwind import, theme tokens, and existing page styles |
| [vite.config.ts](../../vite.config.ts) | Tailwind Vite plugin and the `@/` source alias |
| [tsconfig.json](../../tsconfig.json) | Matching `@/*` TypeScript path mapping |

### Read components.json

**Existing configuration:** the complete file is:

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

| Setting | Meaning here |
| --- | --- |
| `style: "base-nova"` | Selects the Base UI component style for additions |
| `rsc: false` | This is a client-rendered Vite application, not a React Server Components setup |
| `tsx: true` | Component source uses TypeScript and JSX |
| `tailwind.config: ""` | No Tailwind v3 JavaScript configuration file is needed |
| `tailwind.css` | The stylesheet used for theme and Tailwind configuration |
| `baseColor` and `cssVariables` | Generator color configuration; the current palette is defined in CSS variables |
| `iconLibrary: "lucide"` | Selects Lucide for generated icon imports |
| `aliases` | Tells the CLI where local source and helpers belong |

An alias entry such as `@/shared/hooks` does not create that directory or install hooks.
The current project only creates directories when source needs them. Do not rerun
initialization just to use the installed Button or Card.

### Understand the local Button and class helper

The wrapper imports Base UI's Button, computes classes with
`class-variance-authority`, then forwards remaining props to the primitive.
Its `data-slot="button"` marks it as a styled UI control. Existing native-button
CSS excludes that slot so it does not override the shadcn styles.

`cn` combines conditional classes through `clsx`, then uses `tailwind-merge` to
resolve recognized conflicting utilities. For example, `cn('px-2', 'px-4')`
produces `px-4`. This does not bypass ordinary CSS specificity: an unrelated
unlayered global rule can still override a utility.

Theme colors such as `bg-primary`, `bg-card`, and `text-muted-foreground` come
from `@theme inline` and the current light/dark semantic palette in `src/app/styles.css`.
Appearance controls support light/dark/system mode and ten accent colors. See [Tailwind CSS](tailwindcss.md) for theme details.

## Basic usage

### Explore the existing components

After installing project dependencies, run from the project root:

```sh
pnpm dev
```

- **Navigation and appearance:** actions use the local Button with explicit
  types, accessible labels, and Base UI composition. Home itself is a static diagram.
- **About:** three cards use CardHeader, CardTitle, CardDescription, and CardContent.
  Select About in the shared navigation to inspect them.

Import UI from `@/shared/ui/button` or `@/shared/ui/card` in application
code. Keep raw Base UI imports inside the shared wrapper unless a specific new
component needs a primitive. No extra installation is needed for the examples below.

### Choose props for the intended control

| Prop or component | Useful choice here |
| --- | --- |
| `type="button"` | Runs an action such as increment or reset |
| `type="submit"` | Submits a form when submission is intended |
| `variant="default"` | Primary action; also the default variant |
| `variant="outline"` | Secondary action such as Reset |
| `size="lg"` | Larger labeled action when the design calls for it |
| `size="icon"` | Square icon-only action; supply an accessible name |
| `disabled` | Prevents an action when it is unavailable |
| `className` | Adds a focused layout or styling adjustment |

Base UI's Button defaults to a non-submit button; keep types explicit to make
intent clear. The local wrapper also forwards event handlers and accessibility
props. A `variant="link"` only changes appearance; it does not turn a button into
a navigation link.

### Verify changes

```sh
pnpm check
pnpm typecheck
pnpm build
```

Use `pnpm check:fix` for safe fixes and formatting, review edits, and recheck.
Build includes type checking but does not run Biome. In the browser, check
clicks, keyboard activation, focus visibility, disabled states, and narrow layouts.
See [Biome](biome.md) for the command differences.

## Practical examples

### 1. Add a reusable Reset button

**Optional recommendation:** create `src/features/home/components/reset-button.tsx`:

```tsx
import { RefreshCw } from 'lucide-react';
import { Button } from '@/shared/ui/button';

type ResetButtonProps = {
  readonly onReset: () => void;
  readonly disabled?: boolean;
};

export function ResetButton({ onReset, disabled = false }: ResetButtonProps) {
  return (
    <Button type="button" variant="outline" disabled={disabled} onClick={onReset}>
      <RefreshCw aria-hidden="true" /> Reset
    </Button>
  );
}
```

`onReset` is a callback supplied by the parent. The icon is decorative because
**Reset** already names the action. `disabled` is optional and defaults to false.
The component does not own the count; the next example supplies it.

### 2. Combine a Card with Base UI-backed controls

**Optional recommendation:** after creating ResetButton, create
`src/features/home/components/counter-card.tsx`:

```tsx
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { ResetButton } from '@/features/home/components/reset-button';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';

export function CounterCard() {
  const [count, setCount] = useState(0);

  return (
    <Card className="my-8 max-w-md">
      <CardHeader>
        <CardTitle>
          <h2>Counter practice</h2>
        </CardTitle>
        <CardDescription>Try the local UI components together.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="mb-4" role="status">
          Count: {count}
        </p>
        <div className="flex flex-wrap gap-2">
          <Button type="button" onClick={() => setCount((value) => value + 1)}>
            <Plus aria-hidden="true" /> Add one
          </Button>
          <ResetButton onReset={() => setCount(0)} disabled={count === 0} />
        </div>
      </CardContent>
    </Card>
  );
}
```

Add `import { CounterCard } from '@/features/home/components/counter-card';` to `src/features/home/home-page.tsx` and
render `<CounterCard />` before its closing `</section>`. Preserve the diagram;
this optional exercise has independent state.

Expect **Count: 0** and a disabled Reset button initially. Add one enables Reset;
Reset returns the count to zero and becomes disabled again. Check the actions
with Enter and Space. The `role="status"` count announces updates politely.

CardTitle renders a `div`, so the nested `h2` supplies a real heading. Card does
not make its entire surface clickable; use an explicit button or link for an action.
Remove the exercise's rendered JSX and imports before deleting its files.

### 3. Style a router link as a button

**Optional recommendation:** navigation should keep link semantics. Use the
exported styles on TanStack Router's Link instead of nesting an anchor in Button:

```tsx
import { Link } from '@tanstack/react-router';
import { ArrowRight } from 'lucide-react';
import { buttonVariants } from '@/shared/ui/button';

export function AboutButtonLink() {
  return (
    <Link to="/about" className={buttonVariants({ variant: 'outline' })}>
      About this project <ArrowRight aria-hidden="true" />
    </Link>
  );
}
```

If trying it, create `src/features/home/components/about-button-link.tsx`, then import and render
`AboutButtonLink` inside HomePage's returned section. Expect a button-styled link to
`/lab/react/v2/about`, with normal link behavior such as opening in a new tab.
See [TanStack Router](tanstack-router.md) for typed destinations and the base path.

Base UI exposes a `render` prop for composition with another element and uses
`nativeButton={false}` when an action is rendered without a native button.
That still applies button semantics; it is not the recommended way to make a
navigation link. Keep ordinary actions as native buttons in this project.
Radix's `asChild` API does not apply to this Base UI wrapper.

### 4. Add another component only when needed

**Optional recommendation:** if a feature needs a component not already in
`src/shared/ui/`, review its official Base UI example first. For example,
adding a separator to a future layout can use:

```sh
pnpm dlx shadcn@4.22.1 add separator
```

This runs a temporary CLI; it is not an application dependency or a command
needed to run the existing app. It can add source, CSS, and dependencies. It
reads the existing `components.json`; keep `base-nova` selected. Review generated
imports to confirm they use Base UI when an interaction primitive is needed.

Review all edits, preserve exact dependency versions and the lockfile, then run
`pnpm check:fix`, `pnpm check`, and `pnpm build`. Do not overwrite local Button/Card
customizations or reinitialize the project as part of an ordinary addition.
No separator component is installed by this guide.

## Best practices and troubleshooting

- Reuse the local variants before creating another control with duplicate styles.
- Preserve Base UI event handling, refs, keyboard behavior, and accessibility props
  when modifying the wrapper. Use normal buttons for actions and Links for navigation.
- Name icon-only controls with an accessible label; hide decorative icons.
- Use semantic theme tokens and `cn` for conditional classes. Check global selectors
  if a utility appears to have no effect.
- Test real interaction; a passing build does not establish accessible behavior.
- Updating `@base-ui/react` updates the primitive package, not copied shadcn source.
  Review source updates separately and preserve local changes and the included license.

| Problem | What to check |
| --- | --- |
| A UI import cannot be found | Confirm the local file exists; an installed Base UI package does not create shadcn wrappers |
| A control uses Radix-specific props | Use the installed Base UI API; do not copy `asChild` examples into this Button |
| A navigation control behaves like a button | Use `Link` with `buttonVariants` instead of Button's `render` prop |
| Reset submits a surrounding form | Keep `type="button"`; reserve `type="submit"` for submission |
| Card title is absent from heading navigation | Put an appropriate heading inside CardTitle |
| Component colors or spacing look wrong | Check the theme tokens, utility classes, stylesheet import, and legacy CSS specificity |
| An icon-only button has no name | Provide an `aria-label` describing its action |

## Official references

- [Manual installation](https://ui.shadcn.com/docs/installation/manual)
- [shadcn Base UI Button](https://ui.shadcn.com/docs/components/base/button)
- [components.json](https://ui.shadcn.com/docs/components-json)
- [shadcn CLI](https://ui.shadcn.com/docs/cli)
- [Base UI Button API and link guidance](https://base-ui.com/react/components/button)
- [Included source license](../licenses/shadcn-ui.txt)
- [Upstream source license](https://github.com/shadcn-ui/ui/blob/main/LICENSE.md)
