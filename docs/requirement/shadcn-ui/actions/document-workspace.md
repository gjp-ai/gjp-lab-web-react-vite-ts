# Document workspace

**Status:** Proposed; not implemented.

**Page:** Actions & commands

**Route:** `/shadcn-ui/actions#document-workspace`

**Components:** Button, Button Group

[Showcase index](../README.md) · [Shared requirements](../shared.md) · [Delivery checks](../delivery.md)

## Example behavior

- Provide New, Save, and Export actions with visible local results.
- Show button variants and sizes, a disabled action, and a finite simulated-saving state.
- Group related editor actions and make their effects visible in a document preview.

## Acceptance checks

- [ ] Save shows loading then completion and can be reset.
- [ ] Disabled actions cannot execute; grouped actions remain keyboard accessible.
