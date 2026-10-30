# Documentation

## Start here

| Need | Read |
| --- | --- |
| Install and run the existing app | [Project README](../README.md) |
| Understand feature ownership and imports | [SPA architecture](implement/architecture.md) |
| Understand provider/tool integration | [Application stack](implement/stack.md) |
| Recreate the project manually | [Project creation](project-create.md) |
| Learn an installed technology | [Technology guides](tech/README.md) |
| Follow contribution and validation rules | [AGENTS.md](../AGENTS.md) |

## Requirements and implementation

Requirements describe user-visible behavior and acceptance checks. Implementation
notes explain the code, state, events, configuration, and extension points.

| Feature | Requirements | Code design |
| --- | --- | --- |
| Home diagram | [Home](requirement/home.md) | [Home](implement/home.md) |
| Sidebar and nested menus | [Menu](requirement/menu.md) | [Menu](implement/menu.md) |
| Light/dark mode and accents | [Appearance](requirement/theme.md) | [Appearance](implement/theme.md) |
| Unit/component tests and coverage | Global 90% minimum for all four metrics | [Testing](implement/testing.md) |

The current application is a feature-based browser SPA. It has Home and About
routes, JSON-driven navigation, three appearance modes, and ten accent presets.
Home shows six architecture layers and offers English/Chinese text. Counters, technology search, and extra routes
in the guides are optional exercises and are not installed application features.

## Keeping documents current

- Treat source and configuration as the authority for implementation details.
- Keep complete setup snapshots identical to their named files. Label shorter
  excerpts and optional exercises explicitly.
- Place feature examples inside the owning feature. Shared code must not depend
  on application composition or another feature.
- Update requirements and code design together when behavior changes.
- Validate local links and anchors separately from Biome. Check copied source
  examples with formatting, type checks, and builds/tests where applicable.
- Keep upstream license notices intact; see [shadcn/ui license](licenses/shadcn-ui.txt).

## Verification

Documentation review date: **2026-10-30**.

Latest automated result for this review: **43 tests across nine suites pass**;
lint, all three TypeScript projects, and the production build pass. Coverage is
98.82% for lines/statements, 92.99% for branches, and 98.33% for functions.

Documentation checks also passed: 22 complete setup snapshots match their files,
22 complete tutorial modules/test examples pass formatting and type checks in a
temporary project, all three tutorial test cases pass, and that project's build
succeeds. JSON blocks parse; Bash and Zsh accept all 70 shell blocks syntactically.
Local file links and section anchors were checked separately. These syntax checks
do not execute installation or publishing commands.

The automated application checks are `pnpm check`, `pnpm test:coverage`, and
`pnpm build`. Build checks application, Vite configuration, and TypeScript test
types; it does not execute lint or tests. The full coverage command enforces
90% globally for statements, branches, functions, and lines.

The Jest suites cover models, preferences, component interactions, route/history
behavior, startup, and the initial-load focus regression. jsdom does not verify
physical layout, complete browser keyboard behavior, screen-reader output, or
first-paint timing. Complete browser/accessibility checks remain on the feature
requirement checklists. Operating-system installation instructions and production
host rewrites also require verification in their actual environments.

Brand color references record observations from 2026-10-29. They are design inputs,
not claims that those external websites still use the same colors today. Live
official documentation links may describe newer releases than this project's pins.
