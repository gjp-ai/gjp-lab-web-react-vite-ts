# TypeScript

## Contents

- [Introduction](#introduction)
- [Basic usage in this project](#basic-usage-in-this-project)
- [Basic types and inference](#basic-types-and-inference)
- [Type aliases](#type-aliases)
- [Interfaces](#interfaces)
- [TypeScript with React](#typescript-with-react)
- [Practical example: typed technology selector](#practical-example-typed-technology-selector)
- [Best practices and common problems](#best-practices-and-common-problems)
- [Official references](#official-references)

## Introduction

TypeScript adds static type checking to JavaScript. It describes which values
variables, functions, and component inputs can accept. In this React project,
checking helps catch incorrect props, invalid state updates, and missing values
before building the application.

TypeScript **7.0.2** is already installed as a development dependency. React's type
declarations are provided by `@types/react` and `@types/react-dom`.

**Existing features** below describe code already in this repository. **Optional
recommendations** show useful ways to extend the application; their example files
do not exist until you create them. No extra dependency is required.

Types are checked during development and erased from emitted JavaScript. They do
not validate data arriving at runtime. If an API is added later, check its data
before treating it as a trusted application model.

## Basic usage in this project

### Existing features: files and checking commands

| File | Purpose |
| --- | --- |
| [src/features/home/home-page.tsx](../../src/features/home/home-page.tsx) | Presentational JSX component with typed props and readonly technology data |
| [src/main.tsx](../../src/main.tsx) | Mounts React after checking that the root element exists |
| [tsconfig.json](../../tsconfig.json) | Checks browser source in `src/` |
| [tsconfig.node.json](../../tsconfig.node.json) | Checks `vite.config.ts` with Node.js types |
| [tsconfig.test.json](../../tsconfig.test.json) | Checks colocated and optional TypeScript tests plus common test helpers |

Use `.tsx` for TypeScript containing JSX and `.ts` for utilities or shared types
without JSX. Run commands from the project root:

```sh
pnpm check
pnpm typecheck
pnpm build
```

`typecheck` checks all three configurations. `build` runs those checks before Vite
produces the application output. A successful type check exits without errors.
Use `pnpm dev` to see examples in the browser, but keep running type checks:
Vite can transform code even when that code has type errors. `pnpm check` runs
[Biome](biome.md) separately; `pnpm build` does not run lint or formatting checks.

### Existing features: important compiler settings

| Setting | Practical meaning here |
| --- | --- |
| `strict` | Enables strict checks, including implicit `any` and nullable values |
| `jsx: react-jsx` | Uses the automatic React JSX runtime |
| `moduleResolution: Bundler` | Resolves modules using rules suitable for the build tool |
| `paths` | Maps `@/*` to `./src/*`, matching Vite's source alias |
| `noUncheckedIndexedAccess` | An unchecked array lookup may produce `undefined` |
| `exactOptionalPropertyTypes` | Omitting a property differs from explicitly setting it to `undefined` |
| `verbatimModuleSyntax` | Mark type-only imports with `import type` |
| `noUnusedLocals` / `noUnusedParameters` | Reports unused local declarations and parameters |
| `isolatedModules` | Checks compatibility with per-file source transformation |
| `noEmit` | TypeScript checks code; Vite owns generated application output |

The DOM libraries in the app configuration describe browser APIs. The Node
configuration replaces those libraries and types for the build configuration.
These settings describe available APIs; they do not install runtime features.

## Basic types and inference

### Optional example: inferred counter state

Inside an optional counter component, the initial number tells TypeScript what state to expect:

```tsx
const [count, setCount] = useState(0);
```

`count` is inferred as `number`. A numeric update is accepted; passing a string
such as `setCount('one')` is a type error. There is no need to repeat the type with
`useState<number>(0)` when the initial value already makes it clear.

### Recommended basics: primitives, arrays, and objects

These types are useful for component inputs and local data:

| Type | Example value | Application use |
| --- | --- | --- |
| `string` | `'React'` | Technology name or search text |
| `number` | `0` | Counter value |
| `boolean` | `false` | Selection or disabled flag |
| `string[]` | `['React', 'Vite']` | A list of names |
| `{ name: string; version: string }` | `{ name: 'React', version: '19' }` | A technology object |

Use lowercase `string`, `number`, and `boolean`. TypeScript often infers these
from initial values; explicit declarations are helpful at component and function
boundaries or when the initial value does not describe every later possibility.

For a simple exercise, add this inside `HomePage` before its `return`:

```ts
const technologyNames: string[] = ['React', 'TypeScript', 'Vite'];
const summary = technologyNames.join(', ');
```

Render `<p>{summary}</p>` inside the section returned by `HomePage`. Expect the three names.
Remove both the declarations and JSX when finished to avoid unused-code errors.

### Existing feature: readonly tuples with as const

The Home `applicationStack`, `interfaceStack`, and `workspace` arrays use
`as const`. TypeScript preserves literal names and versions and treats the arrays
and their object fields as readonly. The appearance model similarly derives its
`Accent` union from a readonly tuple of accent IDs.

`as const` is a compile-time declaration, not a runtime freeze. Use it for fixed
reference data, not as a way to make editable state mutable.

## Type aliases

### Optional recommendation: give reusable types a name

A `type` alias names a type expression. It can describe an object, a union, or a
function. These declarations are previews of the final example, not files to add
separately:

```ts
type TechnologyCategory = 'Library' | 'Language' | 'Tool';

type SelectTechnology = (name: string) => void;

type TechnologySummary = {
  name: string;
  version: string;
  description?: string;
};
```

`TechnologyCategory` is a literal union: only those three strings are accepted.
`SelectTechnology` describes a callback receiving a string with no return value
required by its caller. `description?` is optional.

An omitted description is allowed. With this project's settings,
`description: undefined` is not allowed unless the declaration explicitly includes
`undefined`. Give a real string or leave the property out.

Unions also describe missing selections: `string | null` means either a name or
an intentional absence. Check for the missing value before using it.

## Interfaces

### Optional recommendation: describe object shapes

An `interface` describes an object's required and optional members. In the final
example, a technology has a name, version, and category. An interface can extend
another interface to add fields:

```ts
interface Technology {
  name: string;
  version: string;
}

interface SelectableTechnology extends Technology {
  disabled?: boolean;
}
```

A selectable technology still requires `name` and `version`; it can additionally
have a `disabled` flag. This is a preview: the complete shared model below also
includes a category and optional description. Do not paste both versions into the
same file.

### Choosing type or interface

| Need | Simple choice for this project |
| --- | --- |
| A fixed set of values such as categories | `type` with a literal union |
| A standalone callback signature | `type` |
| A model or component props object | Either works; use `interface` in this guide's example |
| An object that extends another object model | `interface ... extends ...` |

The [React guide](react.md) uses `type` for props; that is equally valid. There is
no need to convert existing declarations just to use a different spelling.
Interfaces also support declaration merging, but these examples do not need it;
keep each application model's definition clear and intentional.

## TypeScript with React

### Recommended pattern: typed props and defaults

A component's props can require strings, allow optional flags, and accept typed
callbacks. The final example defines `TechnologyOptionProps` with an object input,
a selected flag, and an `onSelect` callback.

For an optional prop such as `disabled?: boolean`, destructuring with
`disabled = false` supplies a default when the prop is omitted. Props remain
read-only inputs from the component's point of view; request changes through
callbacks instead of mutating them.

### Recommended pattern: explicit types when the initial value is incomplete

These excerpts belong inside a component with `useState` imported:

```tsx
const [query, setQuery] = useState('');
const [selectedName, setSelectedName] = useState<string | null>(null);
```

Search text is inferred as a string. The explicit `string | null` lets selection
start empty and later contain a name. `useState(null)` alone would infer a state
that only accepts `null`. If storing a list that begins empty, use
`useState<Technology[]>([])` with the model imported.

### Recommended pattern: typed input events

An inline `onChange` handler usually gets its event type from the input. For an
extracted handler, use a type-only import and annotate its parameter:

```tsx
import type { ChangeEvent } from 'react';

function handleQueryChange(event: ChangeEvent<HTMLInputElement>) {
  setQuery(event.currentTarget.value);
}
```

This is an excerpt inside the component that declares `setQuery`; the import
belongs at the top of its file. The element type tells TypeScript that
`currentTarget` is an input. The final example includes the complete arrangement.

### Recommended pattern: nullable DOM references

With `useRef` imported, an input reference begins empty:

```tsx
const inputRef = useRef<HTMLInputElement>(null);
```

Attach it to `<input ref={inputRef} />`. In a button handler, call
`inputRef.current?.focus()`. Optional chaining handles the time before mounting
or after removal, when the reference is `null`. This follows the focus pattern
in the [React guide](react.md).

### Existing feature: source alias and DOM guard

`main.tsx` imports `router` through `@/app/router`; `router.tsx` imports the Home
component through `@/features/home/home-page`. Vite resolves these aliases for development and builds;
the `paths` setting checks them in TypeScript. Keep both mappings aligned.

### Guard a missing DOM element

`main.tsx` checks the result of `document.getElementById('root')` before using it.
The lookup can return `null`. After the guard throws for that case, TypeScript
knows the remaining value is an element suitable for `createRoot`.

Use checks like this rather than hiding the possible absence with `!`.

### Recommended pattern: type-only imports

The project's `verbatimModuleSyntax` setting distinguishes runtime imports from
types. For example:

```ts
import type { Technology } from '../types/technology';
```

A type-only import is erased from JavaScript. A normal import is needed for a
runtime value, such as React's `useState` or an array exported from a data file.
The complete example demonstrates both.

## Practical example: typed technology selector

**Optional recommendation.** This independent exercise uses the same stack and
selection patterns as `react.md`, with different component filenames so the two
exercises can coexist. It uses a separate seven-item learning dataset and native
HTML controls to teach TypeScript. Home itself is a static six-layer diagram;
interactive shared controls use the local Base UI-backed Button. See [shadcn/ui](shadcn-ui.md)
when adapting the exercise into shared application UI. Create the directories
below if necessary. No package installation or configuration change is needed.

### 1. Define the shared model

Create `src/features/home/types/technology.ts`:

```ts
export type TechnologyCategory = 'Library' | 'Language' | 'Tool';

export type SelectTechnology = (name: string) => void;

export interface Technology {
  name: string;
  version: string;
  category: TechnologyCategory;
  description?: string;
}

export interface SelectableTechnology extends Technology {
  disabled?: boolean;
}
```

The category union prevents misspellings. The base interface describes shared
technology data; the extended interface adds an optional UI-specific flag.

### 2. Add the typed data

Create `src/features/home/data/technologies.ts`:

```ts
import type { SelectableTechnology } from '../types/technology';

export const technologyOptions: SelectableTechnology[] = [
  { name: 'React', version: '19', category: 'Library', description: 'Build the interface.' },
  { name: 'TypeScript', version: '7', category: 'Language' },
  { name: 'Node.js', version: '24+', category: 'Tool' },
  { name: 'pnpm', version: '12+', category: 'Tool' },
  { name: 'Vite', version: '8', category: 'Tool' },
  { name: 'Oxc', version: 'via Vite', category: 'Tool' },
  { name: 'Rolldown', version: 'via Vite', category: 'Tool' },
];
```

Optional fields are omitted when there is no value. The names are unique in this
small reference list and will serve as selection identifiers and React keys.
Use persistent IDs if editable data later allows duplicate names.

### 3. Define the option component's props

Create `src/features/home/components/TechnologyOption.tsx`:

```tsx
import type { SelectableTechnology, SelectTechnology } from '../types/technology';

interface TechnologyOptionProps {
  technology: SelectableTechnology;
  selected: boolean;
  onSelect: SelectTechnology;
}

export default function TechnologyOption({
  technology,
  selected,
  onSelect,
}: TechnologyOptionProps) {
  const { name, version, category, description, disabled = false } = technology;

  return (
    <li>
      <button
        type="button"
        disabled={disabled}
        aria-pressed={selected}
        onClick={() => onSelect(name)}
      >
        {name} {version}
      </button>
      <p>
        {category}: {description ?? 'Part of the project stack.'}
      </p>
    </li>
  );
}
```

The model types the data, while the props interface describes communication with
the parent. A callback requests selection. `aria-pressed` communicates whether
the option is selected; the parent owns that state.

### 4. Connect state, events, and missing-value checks

Create `src/features/home/components/TechnologySelector.tsx`:

```tsx
import type { ChangeEvent } from 'react';
import { useId, useRef, useState } from 'react';
import { technologyOptions } from '../data/technologies';
import TechnologyOption from './TechnologyOption';

export default function TechnologySelector() {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [selectedName, setSelectedName] = useState<string | null>(null);

  const normalizedQuery = query.trim().toLowerCase();
  const visibleOptions = technologyOptions.filter((technology) =>
    technology.name.toLowerCase().includes(normalizedQuery),
  );
  const selectedTechnology = technologyOptions.find(
    (technology) => technology.name === selectedName,
  );

  function handleQueryChange(event: ChangeEvent<HTMLInputElement>) {
    setQuery(event.currentTarget.value);
  }

  return (
    <section aria-label="Typed technology selector">
      <h2>Choose a technology</h2>
      <label htmlFor={inputId}>Search technology names</label>{' '}
      <input ref={inputRef} id={inputId} type="search" value={query} onChange={handleQueryChange} />
      <div className="demo">
        <button type="button" onClick={() => inputRef.current?.focus()}>
          Focus search
        </button>
        <button
          type="button"
          onClick={() => setSelectedName(null)}
          disabled={selectedName === null}
        >
          Clear selection
        </button>
      </div>
      <p role="status">{visibleOptions.length} matching technologies</p>
      {selectedTechnology ? (
        <p>
          Selected: {selectedTechnology.name} {selectedTechnology.version}
        </p>
      ) : (
        <p>No technology selected.</p>
      )}
      {visibleOptions.length === 0 ? (
        <p>No matches. Try another search.</p>
      ) : (
        <ul>
          {visibleOptions.map((technology) => (
            <TechnologyOption
              key={technology.name}
              technology={technology}
              selected={technology.name === selectedName}
              onSelect={(name) => setSelectedName(name)}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
```

`find` returns an object or `undefined`. The conditional checks for a result before
accessing its properties. Unlike an assertion, this check also handles absence at
runtime. Filtering and selected-object lookup are calculated during rendering,
so there is no extra derived state or effect to keep synchronized.

### 5. Render the example and verify it

Add this import at the top of `src/features/home/home-page.tsx`:

```tsx
import TechnologySelector from './components/TechnologySelector';
```

Render `<TechnologySelector />` before the closing `</section>` in `HomePage`.
Keep the original page and technology list for comparison. The exercise uses its
own data; if adopting it permanently, consolidate the duplicated list into one
shared data source.

Run `pnpm dev` and try:

1. Initially, seven options appear with **No technology selected**.
2. Click React: the selection displays React 19 and its button becomes pressed.
3. Click Clear selection: the missing-selection message returns.
4. Type `vite`: only Vite remains. An unknown search produces the empty message.
5. Select a technology and search for another: selection remains independently of
   the filter until changed or cleared.
6. Click Focus search and verify the input receives focus. Try the buttons with
   the keyboard as well.
7. Optionally add `disabled: true` to one data object; its button becomes unavailable.
8. Refresh the page: local query and selection state reset.

Run `pnpm check`, `pnpm typecheck`, and `pnpm build` after the exercise.
[Biome](biome.md) checks lint, formatting, and import organization; TypeScript
checks types. Browser verification checks interaction and presentation.

### 6. Try and fix a deliberate type error

Temporarily change React's `category: 'Library'` to `category: 'Framework'` in
`src/features/home/data/technologies.ts`. Run `pnpm typecheck`; it should reject that value
because it is not in the category union. Restore `'Library'` and check again.

You can also try `version: 19` instead of `version: '19'` to see a string/number
mismatch. Fix the source value; do not use `any` or an assertion to silence it.
Remove exercise JSX and imports before deleting example files when finished.

## Best practices and common problems

- **Let obvious values infer their types:** annotate meaningful boundaries and
  cases such as nullable state or initially empty arrays.
- **Choose clear models:** use small types and interfaces reflecting actual data,
  rather than advanced type machinery for simple components.
- **Keep local types local:** share a model when multiple files use it; a one-off
  props definition can stay next to its component.
- **Handle missing values:** use a guard, conditional, or nullish fallback instead
  of assuming a lookup succeeded.
- **Keep type-only imports explicit:** use normal imports for runtime values.
- **Avoid hiding errors:** `as Technology` tells the compiler to trust you; it does
  not check an external object's properties. Prefer fixing the model or validating data.
- **Retain strict checks:** do not disable settings just to get past an example error.
- **Check during development:** transformations and visible browser output do not
  establish type correctness.

| Problem | Likely fix |
| --- | --- |
| A string is rejected for state initialized with `null` | Declare the intended union, such as `useState<string | null>(null)` |
| An empty state array rejects new objects | Declare its item type, such as `useState<Technology[]>([])` |
| An object may be `undefined` | Check the lookup result before accessing its properties |
| A DOM ref may be `null` | Use a guard or optional chaining in the handler |
| An optional property rejects `undefined` | Omit it, provide a value, or explicitly model `undefined` if meaningful |
| A type import is rejected | Change it to `import type` when no runtime value is needed |
| A local variable or import is unused | Use it in the example or remove it; do not leave stale exercise imports |
| JSX produces parsing errors in a utility file | Move JSX to a `.tsx` file |
| API data is invalid despite a declared type | Validate the runtime input; a TypeScript annotation is not validation |

## Official references

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro)
- [Everyday types, aliases, and interfaces](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)
- [Object types and interface extension](https://www.typescriptlang.org/docs/handbook/2/objects.html)
- [Narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)
- [TypeScript configuration](https://www.typescriptlang.org/tsconfig/)
- [Using TypeScript with React](https://react.dev/learn/typescript)

[Back to technology guide](README.md)
