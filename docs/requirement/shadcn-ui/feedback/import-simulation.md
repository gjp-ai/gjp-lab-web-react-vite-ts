# Import simulation

**Status:** Proposed; not implemented.

**Page:** Feedback & status

**Route:** `/shadcn-ui/feedback#import-simulation`

**Components:** Alert, Skeleton, Spinner, Progress, Toast

[Showcase index](../README.md) · [Shared requirements](../shared.md) · [Delivery checks](../delivery.md)

## Example behavior

- Start, pause, and reset a clearly labeled finite local import simulation.
- Show loading, progress, success, and recoverable error states with appropriate feedback.
- Stop timers on reset and unmount; use the current official Toast implementation.

## Acceptance checks

- [ ] Progress and visible states agree; retry recovers from a simulated failure.
- [ ] Reset/unmount leave no running timers or stale notifications.
