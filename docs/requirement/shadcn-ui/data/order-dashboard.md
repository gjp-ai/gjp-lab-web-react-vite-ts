# Order dashboard

**Status:** Proposed; not implemented.

**Page:** Data & charts

**Route:** `/shadcn-ui/data#order-dashboard`

**Components:** Table, Data Table, Badge, Avatar, Item

[Showcase index](../README.md) · [Shared requirements](../shared.md) · [Delivery checks](../delivery.md)

## Example behavior

- Use fixture orders with customer avatars/fallbacks, status badges, and compact Item summaries.
- Compare a basic Table with a Data Table supporting sort, filter, pagination, and multi-selection.
- Derive totals and a selection summary from the actual fixture data; label it demonstration data.

## Acceptance checks

- [ ] Sort/filter/page/selection interactions agree with the visible rows and summaries.
- [ ] Empty results and avatar fallback are demonstrated; reset restores fixture state.
