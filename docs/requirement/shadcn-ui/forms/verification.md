# Verification code

**Status:** Proposed; not implemented.

**Page:** Forms & inputs

**Route:** `/shadcn-ui/forms#verification`

**Components:** Input OTP

[Showcase index](../README.md) · [Shared requirements](../shared.md) · [Delivery checks](../delivery.md)

## Example behavior

- Enter a six-digit demo code; disclose the expected code in the example.
- Demonstrate incomplete, invalid, and successful verification, with reset.

## Acceptance checks

- [ ] Incomplete or wrong codes do not report success.
- [ ] Keyboard entry, paste where supported, and retry produce correct state.
