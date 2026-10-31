# Edit a task

**Status:** Proposed; not implemented.

**Page:** Overlays

**Route:** `/shadcn-ui/overlays#edit-task`

**Components:** Dialog, Sheet

[Showcase index](../README.md) · [Shared requirements](../shared.md) · [Delivery checks](../delivery.md)

## Example behavior

- Edit a fixture task in a Dialog and a side Sheet.
- Save updates the local task preview; Cancel discards uncommitted edits.

## Acceptance checks

- [ ] Both entry points edit the same fixture task with correct save/cancel behavior.
- [ ] Closing restores focus to the correct trigger without affecting the app drawer.
