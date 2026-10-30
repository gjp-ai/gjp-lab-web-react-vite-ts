# GJP Lab appearance requirements

**Status:** Implemented; complete browser/accessibility verification remains pending.
**Updated:** 2026-10-30

## 1. What we are building

Let visitors choose the app's brightness and accent color independently.
For example, someone can use **Dark + Blue** or **Light + Mint**.

“Theme color” means the accent used for primary buttons,
links, highlights, and focus indicators. It does not mean replacing every surface
with that color. The ten accent options below are confirmed. The implemented defaults are System mode and Mint accent.

## 2. Choices visitors will see

| Setting | Options | Default |
| --- | --- | --- |
| Mode | Light, Dark, System | System — follow the device setting |
| Accent color | Ten presets listed below | Mint — the Supabase-inspired preset |

### Accent presets

Use these ten color families as selectable options. Mint now uses the researched
Supabase reference; the original GJP pale mint is not an additional eleventh option.
React's two shades belong to one Cyan preset.

| Option | ID | Reference color | Source |
| --- | --- | --- | --- |
| Indigo | `indigo` | `#5E6AD2` | [Linear](https://linear.app/brand), observed skip-link background |
| Violet | `violet` | `#533AFD` | [Stripe](https://stripe.com/), observed primary button background |
| Mint | `mint` | `#3ECF8E` | [Supabase brand guide](https://supabase.com/brand) |
| Sky | `sky` | `#38BDF8` | [Tailwind CSS](https://tailwindcss.com/brand), official logo SVG |
| Cyan | `cyan` | Light `#087EA4`; dark `#58C4DC` | [React website colors](https://github.com/reactjs/react.dev/blob/main/colors.js) |
| Orange | `orange` | `#FC6D26` | [GitLab branded palette](https://handbook.gitlab.com/handbook/enterprise-data/platform/tableau/tableau-developer-guide/tableau-style-guide/) |
| Blue | `blue` | `#0061FE` | [Dropbox color guide](https://brand.dropbox.com/color) |
| Blurple | `blurple` | `#5865F2` | [Discord brand guide](https://discord.com/branding) |
| Green | `green` | `#1ED760` | [Spotify official color SVG](https://developer-assets.spotifycdn.com/images/guidelines/design/colors.svg) |
| Rose | `rose` | `#E01E5A` | [Slack brand guide (2020)](https://a.slack-edge.com/4d5bb/marketing/img/media-kit/slack_brand_guidelines_september2020.pdf) |

Sources checked on 2026-10-29. These are brand, logo, or observed UI references as
labeled, not a ranking of websites. Live UI colors may change.

Keep these reference values as the identity of each preset. Derive separate
light/dark shades, hover/pressed colors, selected backgrounds, and contrasting
button text as needed to meet T10. A single reference hex must not be forced onto
every surface or state. Display the option names above, with labeled swatches and
a selection marker; let the ten choices wrap into a grid on narrow screens.

No custom color picker, per-page themes, account synchronization, font selection,
or layout customization is included in the first version.

## 3. Where to find the controls

- **T01 — Appearance button:** Put an “Appearance” button near the bottom of the
  desktop sidebar. Keep it reachable when navigation is long. In the collapsed
  sidebar, use an accessible icon button with a hover/focus tooltip.
- **T02 — Settings panel:** Open a small accessible dialog containing separate
  “Mode” and “Accent color” choices, plus “Reset appearance”. On phones/tablets,
  provide the Appearance button in the header beside the navigation button.
  Opening appearance settings must not require opening the navigation drawer.
- **T03 — Immediate feedback:** Apply each selection immediately, with no Save
  button. Closing the panel keeps the selection. Reset restores System + Mint.
  Changing appearance must not reload the page or reset page state, menus, or forms.

## 4. How preferences behave

- **T04 — System mode:** Follow the device's light/dark preference on first visit
  and whenever System is selected. Respond to device preference changes while the
  app is open. Explicit Light or Dark choices override the device setting.
  If the device preference cannot be read, use Light.
- **T05 — Independent choices:** Switching mode keeps the selected accent.
  Switching accent keeps the selected mode. Every combination must work.
- **T06 — Remember choices:** Store mode and accent locally for this browser and
  origin, using an app-specific key such as `gjp-lab.appearance`. Restore them on
  refresh and direct page visits. If one field is invalid, default only that field.
  If storage is blocked or full, controls still work for the current session.
- **T07 — Other tabs:** Synchronize saved changes between open tabs on the same
  origin. Removing the saved preference restores defaults in those tabs.
- **T08 — Initial appearance:** Apply the saved or system appearance before the
  first visible render, avoiding a flash of the wrong mode. Browser-native controls
  and scrollbars should follow the resolved light/dark mode too.

## 5. Consistent and accessible styling

- **T09 — Whole app:** Apply appearance to Home, About, future pages, the not-found
  view, sidebar, drawer, cards, buttons, tooltips, dialogs, borders, and focus rings.
  Overlays rendered outside the main app container must inherit the same theme.
- **T10 — Readability:** Target at least 4.5:1 contrast for normal text, 3:1 for
  large text, and 3:1 for meaningful control boundaries and focus indicators against
  adjacent colors. Check muted text and text on colored buttons in every combination.
  Selection must use a label/checkmark or border as well as color. Error and success
  meanings must remain distinct from the chosen accent.
- **T11 — Keyboard and screen readers:** Label all choices, expose selected states,
  and support keyboard operation. Color swatches need visible names. The dialog
  contains focus while open; Escape or the close button dismisses it and returns
  focus to its trigger. Keep visible focus and usable targets at 320px and 200% zoom.
- **T12 — Motion:** Prefer immediate color changes. Any optional transition must
  respect reduced motion and avoid animating every element on the page.

## 6. Notes for implementation

- Use semantic CSS variables for backgrounds, text, accents, borders, and states.
  Replace fixed UI colors in [styles.css](../../src/app/styles.css), including the
  legacy native-button styles. Define contrasting text for filled buttons explicitly.
- Apply resolved mode and accent at the document root so portaled components inherit
  them. Keep Tailwind's dark variants aligned with the selected mode, not just the OS.
- Keep palette values in CSS. A small typed configuration may list available option
  IDs and labels; a separate JSON theme file is not required for this version.
- Share preference state through a focused React provider/hook. Reuse owned controls
  and Base UI primitives. No backend or additional state-management package is planned.
- Keep startup preference resolution consistent with React state and clean up system
  preference/storage listeners. Preserve the routing base and existing menu behavior.
- Keep [menu requirements](menu.md), README, contributor instructions, and setup
  snapshots aligned. The [code design](../implement/theme.md) describes the implementation.

## 7. Review decisions

The implemented decisions are:

- **System + Mint** on first visit.
- **Ten accents are confirmed:** Indigo, Violet, Mint, Sky, Cyan, Orange, Blue,
  Blurple, Green, and Rose. The default is Mint (`#3ECF8E` reference).
- **A dedicated Appearance dialog**, opened from the sidebar or mobile header.
- **Preset accents only**, with saved preferences synchronized across local tabs.

## 8. Verification checklist

- [ ] Check all 20 rendered combinations: two modes × ten accents.
- [ ] Check System mode with every accent under both device modes and while the device setting changes.
- [ ] Check refresh, direct URLs, reset, cross-tab updates, corrupt values, and
      unavailable storage. Confirm mode and accent remain independent.
- [ ] Check initial loading without a wrong-mode flash, including a slowed reload.
- [ ] Check every shared component, portal, hover/active/disabled state, and contrast target.
- [ ] Check keyboard focus, accessible selection states, narrow/wide layouts,
      200% zoom, and reduced motion. Confirm page and menu state are preserved.
- [ ] Run focused preference tests, `pnpm check`, and `pnpm build`; report actual
      browser/accessibility checks separately from automated checks.
