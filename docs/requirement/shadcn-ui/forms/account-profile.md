# Account profile

**Status:** Proposed; not implemented.

**Page:** Forms & inputs

**Route:** `/shadcn-ui/forms#account-profile`

**Components:** Field, Label, Input, Input Group, Textarea, Native Select

[Showcase index](../README.md) · [Shared requirements](../shared.md) · [Delivery checks](../delivery.md)

## Example behavior

- Edit labeled name/email fields, a currency or URL field with adornments, a bio with character count, and a locale choice.
- Validate required/invalid values inline and submit a local profile summary.

## Acceptance checks

- [ ] Invalid submission associates error messages with the relevant fields.
- [ ] A valid submission shows the entered values; reset clears only this form.
