# Workspace layout

**Status:** Proposed; not implemented.

**Page:** Layout & media

**Route:** `/shadcn-ui/layout#workspace-layout`

**Components:** Resizable, Scroll Area, Separator

[Showcase index](../README.md) · [Shared requirements](../shared.md) · [Delivery checks](../delivery.md)

## Example behavior

- Create a resizable file/preview split with meaningful minimum and maximum sizes.
- Include overflowing fixture content in a Scroll Area and visible separators.

## Acceptance checks

- [ ] Pointer and supported keyboard resizing obey practical bounds.
- [ ] Overflow stays inside the preview; the page and app shell do not overflow.
