# shadcn/ui showcase requirements

**Status:** Proposed for review; pages are not implemented.

**Updated:** 2026-10-31

Build a **shadcn/ui** menu group after Home and before About. The reviewed baseline
is all **66 entries** in the official Components catalogue, assigned exactly once
below. Add an overview plus ten feature pages, with independently reviewable sample
requirements. Reuse Base Nova and the existing shell, themes, and footer controls.

| Read | Purpose |
| --- | --- |
| [Overview](overview.md) | Search, filters, catalogue, and demo navigation |
| [Shared requirements](shared.md) | Common preview, data, language, accessibility, and layout rules |
| [Delivery and verification](delivery.md) | Compatibility, implementation constraints, sequencing, and completion checks |

## Pages and samples

Each page route omits the deployment prefix `/lab/react/v2/`. Sample files specify
stable fragment targets for catalogue/jump links. These are planned routes, not
links to implemented pages.

| Page / route | Components | Sample requirements |
| --- | --- | --- |
| Overview · `/shadcn-ui` | Catalogue | [Overview](overview.md) |
| Actions & commands · `/shadcn-ui/actions` | 6 | [Document workspace](actions/document-workspace.md) · [File actions](actions/file-actions.md) · [Command palette](actions/command-palette.md) |
| Forms & inputs · `/shadcn-ui/forms` | 8 | [Account profile](forms/account-profile.md) · [Verification code](forms/verification.md) · [Guided onboarding](forms/guided-onboarding.md) |
| Selection & preferences · `/shadcn-ui/selection` | 8 | [Notification preferences](selection/notification-preferences.md) · [Team assignment](selection/team-assignment.md) · [Editor preferences](selection/editor-preferences.md) |
| Dates & booking · `/shadcn-ui/dates` | 2 | [Booking planner](dates/booking-planner.md) |
| Navigation · `/shadcn-ui/navigation` | 5 | [Project workspace](navigation/project-workspace.md) · [Results navigation](navigation/results-navigation.md) · [Sidebar sandbox](navigation/sidebar-sandbox.md) |
| Overlays · `/shadcn-ui/overlays` | 7 | [Edit a task](overlays/edit-task.md) · [Confirm removal](overlays/confirm-removal.md) · [Quick actions](overlays/quick-actions.md) · [Contextual information](overlays/contextual-information.md) |
| Layout & media · `/shadcn-ui/layout` | 8 | [Help centre](layout/help-centre.md) · [Workspace layout](layout/workspace-layout.md) · [Project gallery](layout/project-gallery.md) |
| Data & charts · `/shadcn-ui/data` | 6 | [Order dashboard](data/order-dashboard.md) · [Revenue view](data/revenue-view.md) |
| Feedback & status · `/shadcn-ui/feedback` | 6 | [Import simulation](feedback/import-simulation.md) · [Empty workspace](feedback/empty-workspace.md) |
| Messaging & content · `/shadcn-ui/content` | 10 | [Support conversation](content/support-conversation.md) · [Developer walkthrough](content/developer-walkthrough.md) · [Reading sample](content/reading-sample.md) · [Direction sandbox](content/direction-sandbox.md) |

**Total:** 66 components, ten feature pages, and 28 scenario files.

## Scope and current state

“All” means the reviewed [official Components catalogue](https://ui.shadcn.com/docs/components)
as of 2026-10-31, not every prop combination or future upstream release. The
baseline includes newer messaging/content entries. AI Elements, application Blocks,
community registries, and alternative form-library tutorials are separate scope.

Button and Card already exist as owned components. Existing menu/appearance uses
of Base UI do not count as showcase demos. No live backend, credentials, AI service,
real uploads, or real account changes are required. Review grouping and samples
before implementation; no showcase acceptance checks are complete yet.

[Menu requirements](../menu.md) · [Home requirements](../home.md) ·
[Appearance requirements](../theme.md) · [Existing setup](../../tech/shadcn-ui.md)
