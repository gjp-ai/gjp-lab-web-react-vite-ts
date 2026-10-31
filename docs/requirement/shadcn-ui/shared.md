# Shared sample requirements

**Status:** Proposed; applies to every linked sample.

[Showcase index](README.md) · [Delivery and verification](delivery.md)

## Preview and interaction rules

- **S02 — Focused pages:** Use one page heading, a one-sentence introduction,
  compact jump links, and clearly titled example panels. Every mapped component
  must have an identifiable live use, not just a mention in prose or source code.
- **S03 — Example panels:** Show the task, an interactive preview, a short usage
  note, and an official documentation link. Keep explanations brief. A collapsed
  Code section shows the relevant actual example source, with copy feedback.
  Do not show static screenshots or hard-coded source that disagrees with the demo.
- **S04 — Real interactions:** Make actions visibly affect local demo state.
  Demonstrate useful default, selected, disabled, loading, validation, or error
  states where supported and relevant. Avoid controls that appear functional but
  do nothing. Provide Reset demo for stateful scenarios.
- **S05 — Coherent design:** Use the existing typography, soft borders, semantic
  colors, and compact spacing. Prefer a responsive example grid with generous
  control targets over one long wall of controls. Isolate each scenario's state.

## Data, language, and accessibility

- **S06 — Local data:** Use deterministic fixtures and local interactions. No
  external credentials or live APIs. Show local file names/previews without uploading
  them; release object URLs if generated. Simulated operations must be clearly labeled.
  Reset restores only that scenario's initial state.
- **S07 — Themes and language:** Support Light/Dark and every existing accent.
  New showcase headings, notes, control labels, validation, and status messages
  follow English/Chinese selection from the menu. Preserve product names and code.
  Use locale-aware dates/numbers. Do not add language or mode controls to page headers.
- **S08 — Accessibility:** Use correct labels, list/table semantics, visible focus,
  keyboard operation, validation relationships, and appropriate live announcements.
  Do not rely on color alone. Interactive previews must work without hover-only
  access. Respect reduced motion and do not steal focus on initial page loading.
- **S09 — Responsive containment:** Fit 320px and 200% zoom without page-wide
  horizontal overflow. Wide tables/code may scroll inside their own labeled regions.
  Overlay, Sidebar, Direction, and Resizable demos must remain scoped to the preview
  and must not disturb the actual app shell or menu footer.

## Component coverage

Every assigned component needs an identifiable working use in its sample. Reuse in
another preview does not replace that coverage. For example, the gallery must show
Card header/content/footer composition even though Cards frame other examples.
Chart, Data Table, and Date Picker are compositions, not backend features.

Keep the runtime component-to-page/demo manifest as the single source for Overview,
search, and coverage reporting. Requirement assignments in the sample files are
the reviewed baseline, not separate application configuration.
