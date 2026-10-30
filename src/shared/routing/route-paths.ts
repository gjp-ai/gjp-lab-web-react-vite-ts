// Shared by route registration and menu validation; never include the hosting base.
export const routePaths = { home: '/', about: '/about' } as const;
export type MenuTarget = (typeof routePaths)[keyof typeof routePaths];
