import { createRootRoute, createRoute, createRouter, Link } from '@tanstack/react-router';
import { AppShell } from '@/app/app-shell';
import { AboutPage } from '@/features/about/about-page';
import HomePage from '@/features/home/home-page';
import { routePaths } from '@/shared/routing/route-paths';

const rootRoute = createRootRoute({
  component: AppShell,
  notFoundComponent: () => (
    <section lang="en" className="hero">
      <p className="eyebrow">PAGE NOT FOUND</p>
      <h1>Let’s head home.</h1>
      <Link to="/" className="text-primary underline underline-offset-4">
        Return to Home
      </Link>
    </section>
  ),
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: routePaths.home,
  component: HomePage,
});
const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: routePaths.about,
  component: AboutPage,
});
const routeTree = rootRoute.addChildren([homeRoute, aboutRoute]);

export const router = createRouter({
  routeTree,
  basepath: import.meta.env.BASE_URL,
  scrollRestoration: true,
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
