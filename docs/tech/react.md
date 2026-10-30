# React

## Contents

- [Introduction](#introduction)
- [Basic usage in this project](#basic-usage-in-this-project)
- [Components](#components)
- [Props](#props)
- [State and events](#state-and-events)
- [Hooks used or recommended here](#hooks-used-or-recommended-here)
- [Practical example: searchable technology list](#practical-example-searchable-technology-list)
- [Best practices and common problems](#best-practices-and-common-problems)
- [Official references](#official-references)

## Introduction

React is a JavaScript library for building interactive user interfaces. You write
components that describe what the page should display, and React updates the
interface when their data changes. This project uses React **19.3.1**, with
TypeScript for checking component inputs and state.

| Concept | Meaning | Project example |
| --- | --- | --- |
| Component | A function that returns part of the interface | The existing `HomePage` function |
| JSX | Markup-like syntax inside JavaScript or TypeScript | Home headings, diagram lists, and About cards |
| Props | Inputs supplied by a parent component | Recommended reusable card inputs such as `name` and `version` |
| State | Data a component remembers between renders | Appearance preferences and sidebar collapse state |
| Hook | A function that provides a React capability | `useState` in providers and `useEffect` subscriptions |

**Existing features** below describe code already in the repository. **Optional
recommendations** are exercises you can add; their example files are not part of
the application until you create them. They use installed dependencies only.

## Basic usage in this project

### Existing features: application entry and files

| File | Responsibility |
| --- | --- |
| [src/main.tsx](../../src/main.tsx) | Finds the root element and mounts `RouterProvider` using React DOM's `createRoot` |
| [src/features/home/home-page.tsx](../../src/features/home/home-page.tsx) | Renders the six-layer technology diagram |
| [src/app/styles.css](../../src/app/styles.css) | Defines global styles and the existing card/grid classes |
| [index.html](../../index.html) | Provides the root element and loads the application entry |

The entry imports the router through `@/app/router`; the Home route renders `HomePage`.
`src/app/app-shell.tsx` supplies shared navigation, `<main>`, and the footer. Development uses
`http://127.0.0.1:5174/lab/react/v2/`, and the router uses
`import.meta.env.BASE_URL` as its base path. Home navigation uses `Link to="/"`.

`main.tsx` wraps `RouterProvider` in `StrictMode`. Its extra development checks help detect
impure rendering and missing effect cleanup; keep it enabled.

From the project root, run:

```sh
pnpm dev
```

Open the URL printed by Vite. Review the technology diagram, then change the heading in `home-page.tsx`, save, and inspect the browser update.
Keep the terminal open while developing; stop the server with Ctrl+C. For package
installation and command details, see the [pnpm guide](pnpm.md).

### JSX basics

Files containing JSX use `.tsx`. Use braces for JavaScript values, `className` for
CSS classes, and closed tags such as `<br />`. Component names start with an
uppercase letter; native HTML elements use lowercase names.

Optional counter excerpt: add the state shown in the counter exercise before using this JSX:

```tsx
<output aria-live="polite">
  {count} {count === 1 ? 'click' : 'clicks'}
</output>
```

The expression chooses the singular or plural label. `aria-live` lets assistive
technology announce the updated count. Multiple sibling elements returned from a
component need a shared wrapper or fragment (`<>...</>`).

Home currently shows a static six-layer diagram. The counter and searchable
explorer below are optional learning exercises. They use native HTML controls
and their own example data. Use the local [shadcn/ui components](shadcn-ui.md)
when adopting an exercise as a permanent feature.

## Components

### Existing feature: the page component

`HomePage` is exported from `src/features/home/home-page.tsx`. The route tree in
`src/app/router.tsx` renders it through AppShell's `Outlet`. React calls the function to determine what to display.

### Optional recommendation: extract a technology card

The page repeats similar markup for every technology. A reusable component makes
that markup easier to maintain. Create `src/features/home/components/TechnologyCard.tsx`, creating
the directory if needed:

```tsx
type TechnologyCardProps = {
  name: string;
  version: string;
  category?: string;
  onSelect?: (name: string) => void;
};

export default function TechnologyCard({
  name,
  version,
  category = 'Technology',
  onSelect,
}: TechnologyCardProps) {
  return (
    <div className="stack-card">
      <dt>{category}</dt>
      <dd>
        {name}
        <span>{version}</span>
      </dd>
      {onSelect && (
        <dd>
          <button type="button" onClick={() => onSelect(name)}>
            Select {name}
          </button>
        </dd>
      )}
    </div>
  );
}
```

This component contains definition-list elements, so render it inside a `<dl>`.
Add this import at the top of `src/features/home/home-page.tsx`:

```tsx
import TechnologyCard from './components/TechnologyCard';
```

Optional exercise: define this learning dataset inside `HomePage`, before its
`return`. It is separate from the existing diagram data.

```ts
const exampleStack = [
  ['Library', 'React', '19'],
  ['Language', 'TypeScript', '7'],
] as const;
```

Add a new `<dl className="stack-grid">` inside the Home section and place this
markup inside it:

```tsx
{exampleStack.map(([category, name, version]) => (
  <TechnologyCard
    key={name}
    category={category}
    name={name}
    version={version}
  />
))}
```

Keep the surrounding `<dl>` and the rest of the page. Run `pnpm dev`; expect the
two optional technology cards beneath the existing diagram. Each JSX usage creates a separate component instance.

The examples below build on this card. The final search example can also be
followed directly after creating this file.

## Props

### Optional recommendation: typed inputs and defaults

`TechnologyCardProps` defines the component's inputs. `name` and `version` are
required strings. `category?` is optional; leaving it out uses the default
`'Technology'`. Props are read-only inputs: the child should not change them.

For a small standalone usage inside `HomePage`'s returned section:

```tsx
<dl className="stack-grid">
  <TechnologyCard name="React" version="19" />
</dl>
```

Expect a card labeled **Technology**, with React and version 19. A numeric
`version={19}` fails this component's string prop check; use `version="19"`.

### Optional recommendation: callback props

The optional `onSelect` prop lets a child report a user action to its parent.
Inside an existing `<dl>`, you can try:

```tsx
<TechnologyCard
  name="React"
  version="19"
  onSelect={(name) => console.log(`Selected ${name}`)}
/>
```

Now a **Select React** button appears. Clicking it logs the selected name in the
browser console. The card calls the callback; the parent decides what to do with
that event. The complete search example replaces this demonstration log with
state that displays the selection on the page.

React's `key` identifies a list item but is not passed to the child as an ordinary
prop. Pass an explicit ID prop if a component needs that identifier itself.

## State and events

React state remains the first choice for local interaction. The installed
client-state stack adds [Zustand](zustand.md) for shared client state, while
[TanStack Query](tanstack-query.md) provides the server-state foundation. AppProviders installs the Query and
translation providers, and AppearanceProvider uses a scoped Zustand store.

### Optional exercise: the click counter

A counter can use local state:

```tsx
const [count, setCount] = useState(0);
```

`count` is the current render's value, `setCount` requests an update, and `0` is the
initial value. Calling the setter does not change the current render's variable
immediately. React uses the updated state in a subsequent render.

The example click handler calculates the next value from the previous one:

```tsx
onClick={() => setCount((value) => value + 1)}
```

Pass a function to the event prop so it runs when the user acts. Do not call the
setter while constructing JSX.

### Optional recommendation: a counter with Reset

Create `src/features/home/components/Counter.tsx`:

```tsx
import { useState } from 'react';

type CounterProps = {
  label?: string;
};

export default function Counter({ label = 'Add a click' }: CounterProps) {
  const [count, setCount] = useState(0);

  return (
    <div className="demo">
      <button type="button" onClick={() => setCount((value) => value + 1)}>
        {label}
      </button>
      <output aria-live="polite">
        {count} {count === 1 ? 'click' : 'clicks'}
      </output>
      <button type="button" onClick={() => setCount(0)} disabled={count === 0}>
        Reset
      </button>
    </div>
  );
}
```

Import `Counter` from `./components/Counter` in `home-page.tsx` and add
`<Counter label="Try another counter" />` inside the section returned by `HomePage`. Expect
incrementing to work and Reset to become enabled after the first click.

Each instance has independent state. Render a second `<Counter />` to try this.
A full page refresh resets both counters because this example stores no persistent
data. Simple development edits may preserve state through Fast Refresh.

### Recommended pattern: lift shared state to a parent

Keep state close to where it is used. If two children must display or update the
same value, move that state into their nearest shared parent. Pass the current
value down as a prop and pass a callback for requesting changes. Do not create two
independent counters and try to keep their values synchronized with effects.

The final example follows this pattern: `TechnologyExplorer` owns the selected
technology, and each card reports its selection through `onSelect`.

## Hooks used or recommended here

Hooks provide capabilities such as state, IDs, references, or synchronization.
Call hooks at the top level of a component or a custom hook, before any conditional
early return. Do not call them inside event handlers, loops, or conditions.

| Hook | Status | Purpose in these examples |
| --- | --- | --- |
| `useState` | Existing | Counter value; also recommended for search text and selection |
| `useId` | Optional recommendation for labeled inputs | Connect a search input to its label without ID collisions |
| `useRef` | Optional recommendation when explicit focus control is useful | Focus the search field from a button |
| `useEffect` | Optional, only when synchronization is needed | Demonstrate changing and restoring the browser tab title |

### useState: store only the source data

The counter stores the count. A search input stores the query. Compute values
such as a filtered list or result count from that state while rendering:

```ts
const normalizedQuery = query.trim().toLowerCase();
const visibleTechnologies = technologies.filter((technology) =>
  technology.name.toLowerCase().includes(normalizedQuery),
);
```

This is an excerpt from the final example. It needs no separate state, effect,
or memoization for the project's short technology list.

### useId and useRef: label and focus an input

The complete example below uses these hooks together:

```tsx
const searchId = useId();
const searchRef = useRef<HTMLInputElement>(null);
```

`useId` generates an ID for `htmlFor` and the input's `id`. `useRef` holds the input
DOM element after React mounts it. Calling `searchRef.current?.focus()` from a
button handler moves keyboard focus to that input. Updating a ref does not request
a render; use state for values displayed by the interface. Do not use `useId` as
list keys: use stable data identifiers instead.

### Optional useEffect example: synchronize the tab title

Use this only if the page needs a changing title. For this beginner exercise,
create `src/features/home/components/PageTitle.tsx`:

```tsx
import { useEffect } from 'react';

type PageTitleProps = {
  title: string;
};

export default function PageTitle({ title }: PageTitleProps) {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title;

    return () => {
      document.title = previousTitle;
    };
  }, [title]);

  return null;
}
```

Import `PageTitle` from `./components/PageTitle` in `home-page.tsx` and render
`<PageTitle title="Learning React | GJP Lab" />` inside the section returned by `HomePage`. It displays no
page content; inspect the browser tab title instead. Cleanup restores the previous
title before the effect runs again or when the component unmounts. The `[title]`
dependency ensures a changed title prop triggers synchronization.

Keep a single owner for this effect rather than mounting several components that
all change `document.title`. StrictMode exercises setup and cleanup again during
development; the cleanup should make this safe. This is a demonstration of an
external browser side effect, not a requirement for this static landing page.

## Practical example: searchable technology list

**Optional recommendation.** This exercise combines typed props, a controlled
input, state, callback props, filtering, and the hooks described above. It requires
`TechnologyCard.tsx` from the Components section. No additional package is needed.

Create `src/features/home/components/TechnologyExplorer.tsx`:

```tsx
import { useId, useRef, useState } from 'react';
import TechnologyCard from './TechnologyCard';

type Technology = {
  category: string;
  name: string;
  version: string;
};

const technologies: Technology[] = [
  { category: 'JavaScript library', name: 'React', version: '19' },
  { category: 'Programming language', name: 'TypeScript', version: '7' },
  { category: 'Runtime environment', name: 'Node.js', version: '24+' },
  { category: 'Package manager', name: 'pnpm', version: '12+' },
  { category: 'Build tool', name: 'Vite', version: '8' },
  { category: 'Transformer', name: 'Oxc', version: 'via Vite' },
  { category: 'Bundler', name: 'Rolldown', version: 'via Vite' },
];

export default function TechnologyExplorer() {
  const searchId = useId();
  const searchRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [selectedName, setSelectedName] = useState<string | null>(null);

  const normalizedQuery = query.trim().toLowerCase();
  const visibleTechnologies = technologies.filter((technology) =>
    technology.name.toLowerCase().includes(normalizedQuery),
  );

  return (
    <section aria-label="Explore technologies">
      <h2>Explore the project stack</h2>
      <label htmlFor={searchId}>Search technology names</label>{' '}
      <input
        ref={searchRef}
        id={searchId}
        type="search"
        value={query}
        onChange={(event) => setQuery(event.currentTarget.value)}
      />
      <div className="demo">
        <button type="button" onClick={() => searchRef.current?.focus()}>
          Focus search
        </button>
        <button type="button" onClick={() => setQuery('')} disabled={query === ''}>
          Clear search
        </button>
      </div>
      <p role="status">{visibleTechnologies.length} matching technologies</p>
      {selectedName && <p>Selected technology: {selectedName}</p>}
      {visibleTechnologies.length === 0 ? (
        <p>No technologies match your search. Try another name.</p>
      ) : (
        <dl className="stack-grid">
          {visibleTechnologies.map((technology) => (
            <TechnologyCard
              key={technology.name}
              category={technology.category}
              name={technology.name}
              version={technology.version}
              onSelect={(name) => setSelectedName(name)}
            />
          ))}
        </dl>
      )}
    </section>
  );
}
```

Add this import to `src/features/home/home-page.tsx`:

```tsx
import TechnologyExplorer from './components/TechnologyExplorer';
```

Add `<TechnologyExplorer />` before the closing `</section>` in `HomePage`.
This keeps the original page available for comparison. The exercise has its own
technology data so it can run independently of edits to the original list. In a
permanent refactor, keep one shared data source rather than maintaining both copies.

### What to try and expect

1. Open the development page: the explorer initially displays seven cards.
2. Type `react`: one matching card remains. Uppercase `REACT` behaves the same.
3. Type an unknown name: an empty-result message replaces the cards.
4. Clear the query: all seven cards return, and Clear search becomes disabled.
5. Click Select React: the parent displays **Selected technology: React**.
6. Search for another technology: selection remains until you select a different
   card. Selection and filtering are deliberately independent in this example.
7. Click Focus search: the input receives keyboard focus.
8. Test with Tab, Enter, and Space, then refresh to observe that local state resets.

`value` and `onChange` make the input controlled by React state. `filter` creates
a derived array without changing the original data. The stable names identify cards
when the visible list changes. Conditional JSX selects the list or empty message.

Run these checks from another terminal while the dev server is active:

```sh
pnpm check
pnpm typecheck
pnpm build
```

Run `pnpm check:fix` if formatting or import organization needs correction, review
the edits, and rerun `pnpm check`. [Biome](biome.md) checks style and lint rules;
TypeScript checks types, and the browser checks behavior.

The example components use existing styles for buttons and cards. You can add
input styling in `src/app/styles.css` as needed. When removing the exercise, remove
its rendered JSX and imports before deleting its component files.

## Best practices and common problems

- **Keep rendering pure:** calculate markup from props and state. Do not mutate
  inputs, start subscriptions, or call setters unconditionally during rendering.
- **Use immutable updates:** when storing arrays or objects in state, create new
  values instead of mutating the previous ones.
- **Store the minimum state:** derive filtered items and counts from existing data.
- **Keep state near its users:** lift it only when components need a shared value.
- **Use stable list keys:** the current names are unique; use persistent IDs if
  editable data later permits duplicate names. Avoid random keys created on render.
- **Use effects only for external synchronization:** handle clicks in handlers and
  filtering during rendering. Include dependencies and cleanup when an effect needs them.
- **Keep controls accessible:** associate labels with inputs, name buttons clearly,
  preserve visible focus, and verify keyboard operation.
- **Retain StrictMode:** fix impure work or missing cleanup rather than disabling checks.

| Problem | Likely fix |
| --- | --- |
| Too many renders | Pass a handler function instead of calling a setter directly in JSX |
| A state value seems unchanged just after setting it | Read the value on the next render; use an updater when deriving the next state |
| A controlled-input warning | Initialize search text with `''` and provide both `value` and `onChange` |
| A list-key warning | Put a stable unique `key` on the component directly returned from `map` |
| A hook-order error | Move hooks to the component's top level, before conditional returns |
| A type error on a prop | Compare the supplied value with the prop's TypeScript declaration |
| A missing component import | Check its export style, relative path, and filename capitalization |
| An effect runs extra setup in development | Verify that cleanup reverses setup correctly under StrictMode |

## Official references

- [React Quick Start](https://react.dev/learn)
- [Passing props](https://react.dev/learn/passing-props-to-a-component)
- [State: a component's memory](https://react.dev/learn/state-a-components-memory)
- [Rendering lists](https://react.dev/learn/rendering-lists)
- [Rules of Hooks](https://react.dev/reference/rules/rules-of-hooks)
- [useState](https://react.dev/reference/react/useState)
- [useId](https://react.dev/reference/react/useId)
- [useRef](https://react.dev/reference/react/useRef)
- [useEffect](https://react.dev/reference/react/useEffect)
- [You might not need an Effect](https://react.dev/learn/you-might-not-need-an-effect)

[Back to technology guide](README.md)
