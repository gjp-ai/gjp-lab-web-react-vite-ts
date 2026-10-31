# Support conversation

**Status:** Proposed; not implemented.

**Page:** Messaging & content

**Route:** `/shadcn-ui/content#support-conversation`

**Components:** Attachment, Bubble, Message, Message Scroller

[Showcase index](../README.md) · [Shared requirements](../shared.md) · [Delivery checks](../delivery.md)

## Example behavior

- Send local messages in a seeded conversation with grouped bubbles.
- Attach/remove mock files without uploading them.
- Preserve scroll position while reviewing older messages; expose new-message behavior clearly.

## Acceptance checks

- [ ] Sending and removing attachments update only the local conversation.
- [ ] Reviewing history does not jump unexpectedly; reset and object-URL cleanup work.
