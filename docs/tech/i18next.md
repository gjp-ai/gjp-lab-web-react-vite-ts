# Internationalization: i18next + react-i18next

**Status:** Installed and integrated. Versions: `i18next` **26.5.12** and
`react-i18next` **17.1.9**. Home supports English and Chinese; the rest of the
application retains its existing English text. Updated: 2026-10-30.

## Current modules

| Source | Responsibility |
| --- | --- |
| [i18n.ts](../../src/shared/i18n/i18n.ts) | Stable instance, bundled Home resources, English fallback, and initialization promise |
| [prepare.ts](../../src/app/prepare.ts) | Await initialization before React mounts |
| [providers.tsx](../../src/app/providers.tsx) | I18nextProvider and document language/direction synchronization |
| [home-page.tsx](../../src/features/home/home-page.tsx) | Translation hook and English/Chinese selector |

The Home namespace contains headings, role labels, the figure description, and
language-control labels. Product names remain their official names. Language
selection lasts for this session; no browser detector or persistence plugin is
installed. i18next owns the active language, rather than duplicating it in Zustand.

## Configuration

The exact dependencies are recorded in package.json. To reproduce installation:

```sh
pnpm add -E i18next@26.5.12 react-i18next@17.1.9
```

The instance uses `createInstance`, `initReactI18next`, `initAsync: false`, bundled
resources, `lng: 'en'`, and `fallbackLng: 'en'`. `supportedLngs` is `['en', 'zh']`.
The exported `i18nReady` promise is awaited during application preparation.
No network resource loading is needed for these bundled translations.

AppProviders supplies the instance through I18nextProvider, initializes document
`lang`/`dir`, listens for language changes, and removes that listener on unmount.
Home uses `useTranslation('home', { i18n })` and the selector calls
`i18n.changeLanguage()` without reloading or resetting appearance.

## Adding translated content

Add matching keys under the language's Home namespace, then reference the key
through `t` in the component. Keep keys stable and include accessible names,
figure descriptions, error/pending/empty states, and tooltips when extending scope.
Do not send translated strings to `dangerouslySetInnerHTML`. React renders the
current translations as text; interpolation uses `escapeValue: false` with that
React text-rendering boundary.

For content requiring embedded React elements, use Trans. For numbers/dates,
use locale-aware formatting. Adding new languages also requires selector options,
resource coverage, and layout/keyboard checks.

Shared common labels can use a common namespace. Feature resources can be
registered by app composition so shared code does not import features. Translating
menu JSON labels requires an explicit schema/renderer decision; current labels
remain literal English text.

## Verification

The application suite changes Home from English to Chinese and back, checks the
translated heading and document language/direction, and confirms appearance is
preserved. Remaining browser checks include long labels, narrow layout, focus,
zoom, screen-reader output, and mixed-language content outside Home. When adding
isolated component tests, use a fresh initialized instance and I18nextProvider.

## Official references

- [React integration](https://react.i18next.com/latest/using-with-hooks)
- [i18next configuration](https://www.i18next.com/overview/configuration-options)
- [I18nextProvider](https://react.i18next.com/latest/i18nextprovider)
- [TypeScript support](https://www.i18next.com/overview/typescript)
