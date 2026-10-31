# Technology logo sources

Reviewed on 2026-10-31. Home loads these published image URLs directly; no logo
files are copied into this repository. Marks belong to their respective projects.
Display them at their original aspect ratio and colors on a small white surface.
The generated Option 3 mockup is a layout reference, not a source of brand artwork.

| Technology | Official source | Image URL |
| --- | --- | --- |
| React / React State | [Project / brand page](https://react.dev) | [Published image](https://react.dev/favicon-32x32.png) |
| TanStack Router / Query | [Project / brand page](https://tanstack.com/brand-guide) | [Published image](https://tanstack.com/favicon-light.svg) |
| shadcn/ui | [Project / brand page](https://ui.shadcn.com) | [Published image](https://ui.shadcn.com/apple-touch-icon.png) |
| Base UI | [Project / brand page](https://base-ui.com) | [Published image](https://base-ui.com/static/favicon.svg) |
| Tailwind CSS | [Project / brand page](https://tailwindcss.com) | [Published image](https://tailwindcss.com/favicons/apple-touch-icon.png?v=4) |
| Lucide | [Project / brand page](https://lucide.dev) | [Published image](https://lucide.dev/logo.light.svg) |
| Zustand | [Project / brand page](https://zustand.docs.pmnd.rs) | [Published image](https://zustand.docs.pmnd.rs/favicon.ico) |
| Ky | [Project / brand page](https://github.com/sindresorhus/ky) | [Published image](https://raw.githubusercontent.com/sindresorhus/ky/main/media/logo.svg) |
| i18next | [Project / brand page](https://www.i18next.com) | [Published image](https://www.i18next.com/~gitbook/image?url=https%3A%2F%2F286188001-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-legacy-files%2Fo%2Fspaces%252F-L9iS6Wm2hynS5H9Gj7j%252Favatar.png%3Fgeneration%3D1523462254548780%26alt%3Dmedia&width=48&height=48&sign=5970d4be349fd728ec6fcf71d5ac4346&sv=3) |
| react-i18next | [Project / brand page](https://react.i18next.com) | [Published image](https://react.i18next.com/~gitbook/image?url=https%3A%2F%2F4236364459-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-legacy-files%2Fo%2Fspaces%252F-L9iS6WpW81N7RGRTQ-K%252Favatar.png%3Fgeneration%3D1523345851027218%26alt%3Dmedia&width=48&height=48&sign=4205b271dd59d20bb876f8d9af62f17c&sv=3) |
| TypeScript | [Project / brand page](https://www.typescriptlang.org/branding/) | [Published image](https://www.typescriptlang.org/icons/icon-96x96.png) |
| Vite | [Project / brand page](https://vite.dev) | [Published image](https://vite.dev/logo-without-border.svg) |
| Node.js | [Project / brand page](https://nodejs.org/en/about/branding) | [Published image](https://nodejs.org/static/logos/nodejsHex.svg) |
| pnpm | [Project / brand page](https://pnpm.io) | [Published image](https://pnpm.io/img/favicon.png) |
| Biome | [Project / brand page](https://biomejs.dev) | [Published image](https://biomejs.dev/img/favicon.svg) |
| Jest / coverage | [Project / brand page](https://jestjs.io) | [Published image](https://jestjs.io/img/jest.svg) |
| React Testing Library | [Project / brand page](https://testing-library.com) | [Published image](https://testing-library.com/img/octopus-64x64.png) |
| MSW | [Project / brand page](https://mswjs.io) | [Published image](https://mswjs.io/logo.svg) |

Husky uses the 🐶 mark published in its [official website favicon](https://typicode.github.io/husky/).
lint-staged uses the 🚫💩 branding from its [official README](https://github.com/lint-staged/lint-staged).
These are rendered as text emoji, whose appearance depends on the operating system.
Oxc and Rolldown are text links inside Vite; static assets are an output label,
not a product logo. React State reuses React's mark; one Jest tile covers unit testing and coverage.

Image URLs are recorded in [technologies.ts](../../src/features/home/technologies.ts).
External hosts can change URLs or block loading. Failed images fall back to name
initials while the technology name and official-site link remain available.
Recheck the source and image response when updating a URL; never substitute a
search-engine favicon service or an unrelated logo.
