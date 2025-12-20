import {
  createRootRouteWithContext,
  createRoute,
  createRouter,
  Outlet,
  type LinkOptions,
} from "@tanstack/react-router";

import { publicRouter } from "./publicRouter";
import { privateRouter } from "./privateRouter";

type RouterContext = {
  auth: number | undefined;
};

export const rootRoute = createRootRouteWithContext<RouterContext>()({
  component: () => <Outlet />,
});

const notFoundRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "*",
  component: () => <main>404</main>,
});

export const routeTree = rootRoute.addChildren([
  privateRouter,
  publicRouter,
  notFoundRoute,
]);

export const router = createRouter({
  routeTree,
  context: { auth: 1 },
});

export type RouterPaths = Exclude<LinkOptions<typeof router>["to"], undefined>;
