# Booking planner

**Status:** Proposed; not implemented.

**Page:** Dates & booking

**Route:** `/shadcn-ui/dates#booking-planner`

**Components:** Calendar, Date Picker

[Showcase index](../README.md) · [Shared requirements](../shared.md) · [Delivery checks](../delivery.md)

## Example behavior

- Choose a day or date range and display a local booking summary.
- Disable past/unavailable dates relative to a documented stable fixture date.
- Provide a date-picker field with localized formatting, validation, and clear selection.
- State timezone/date-boundary assumptions so the demo stays reproducible.

## Acceptance checks

- [ ] Unavailable dates cannot be booked; range boundaries are validated.
- [ ] Clearing and resetting restore the expected empty/initial selection.
- [ ] English/Chinese formatting does not change the selected dates.
