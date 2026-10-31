declare const __TECH_VERSIONS__: Readonly<Record<string, string>>;

// Official project websites/repositories and their published brand images.
// Source review: 2026-10-31. See docs/implement/home.md for provenance.
const versions = __TECH_VERSIONS__;

export const buildToolVersions = { rolldown: versions.rolldown } as const;

export const technologies = {
  react: {
    version: versions.react,
    name: 'React',
    href: 'https://react.dev',
    logo: 'https://react.dev/favicon-32x32.png',
  },
  router: {
    version: versions['@tanstack/react-router'],
    name: 'TanStack Router',
    href: 'https://tanstack.com/router',
    logo: 'https://tanstack.com/favicon-light.svg',
  },
  shadcn: {
    name: 'shadcn/ui',
    href: 'https://ui.shadcn.com',
    logo: 'https://ui.shadcn.com/apple-touch-icon.png',
  },
  base: {
    version: versions['@base-ui/react'],
    name: 'Base UI',
    href: 'https://base-ui.com',
    logo: 'https://base-ui.com/static/favicon.svg',
  },
  tailwind: {
    version: versions.tailwindcss,
    name: 'Tailwind CSS',
    href: 'https://tailwindcss.com',
    logo: 'https://tailwindcss.com/favicons/apple-touch-icon.png?v=4',
  },
  lucide: {
    version: versions['lucide-react'],
    name: 'Lucide React',
    href: 'https://lucide.dev',
    logo: 'https://lucide.dev/logo.light.svg',
  },
  zustand: {
    version: versions.zustand,
    name: 'Zustand',
    href: 'https://zustand.docs.pmnd.rs',
    logo: 'https://zustand.docs.pmnd.rs/favicon.ico',
  },
  query: {
    version: versions['@tanstack/react-query'],
    name: 'TanStack Query',
    href: 'https://tanstack.com/query',
    logo: 'https://tanstack.com/favicon-light.svg',
  },
  ky: {
    version: versions.ky,
    name: 'Ky',
    href: 'https://github.com/sindresorhus/ky',
    logo: 'https://raw.githubusercontent.com/sindresorhus/ky/main/media/logo.svg',
  },
  i18next: {
    version: versions.i18next,
    name: 'i18next',
    href: 'https://www.i18next.com',
    logo: 'https://www.i18next.com/~gitbook/image?url=https%3A%2F%2F286188001-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-legacy-files%2Fo%2Fspaces%252F-L9iS6Wm2hynS5H9Gj7j%252Favatar.png%3Fgeneration%3D1523462254548780%26alt%3Dmedia&width=48&height=48&sign=5970d4be349fd728ec6fcf71d5ac4346&sv=3',
  },
  reactI18next: {
    version: versions['react-i18next'],
    name: 'react-i18next',
    href: 'https://react.i18next.com',
    logo: 'https://react.i18next.com/~gitbook/image?url=https%3A%2F%2F4236364459-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-legacy-files%2Fo%2Fspaces%252F-L9iS6WpW81N7RGRTQ-K%252Favatar.png%3Fgeneration%3D1523345851027218%26alt%3Dmedia&width=48&height=48&sign=4205b271dd59d20bb876f8d9af62f17c&sv=3',
  },
  typescript: {
    version: versions.typescript,
    name: 'TypeScript',
    href: 'https://www.typescriptlang.org',
    logo: 'https://www.typescriptlang.org/icons/icon-96x96.png',
  },
  vite: {
    version: versions.vite,
    name: 'Vite',
    href: 'https://vite.dev',
    logo: 'https://vite.dev/logo-without-border.svg',
  },
  node: {
    version: versions.node,
    name: 'Node.js',
    href: 'https://nodejs.org',
    logo: 'https://nodejs.org/static/logos/nodejsHex.svg',
  },
  pnpm: {
    version: versions.pnpm,
    name: 'pnpm',
    href: 'https://pnpm.io',
    logo: 'https://pnpm.io/img/favicon.png',
  },
  biome: {
    version: versions['@biomejs/biome'],
    name: 'Biome',
    href: 'https://biomejs.dev',
    logo: 'https://biomejs.dev/img/favicon.svg',
  },
  husky: {
    version: versions.husky,
    name: 'Husky',
    href: 'https://typicode.github.io/husky/',
    emoji: '🐶',
  },
  lintStaged: {
    version: versions['lint-staged'],
    name: 'lint-staged',
    href: 'https://github.com/lint-staged/lint-staged',
    emoji: '🚫💩',
  },
  jest: {
    version: versions.jest,
    name: 'Jest',
    href: 'https://jestjs.io',
    logo: 'https://jestjs.io/img/jest.svg',
  },
  testingLibrary: {
    version: versions['@testing-library/react'],
    name: 'React Testing Library',
    href: 'https://testing-library.com/docs/react-testing-library/intro/',
    logo: 'https://testing-library.com/img/octopus-64x64.png',
  },
  msw: {
    version: versions.msw,
    name: 'MSW',
    href: 'https://mswjs.io',
    logo: 'https://mswjs.io/logo.svg',
  },
} as const;

export type TechnologyId = keyof typeof technologies;
