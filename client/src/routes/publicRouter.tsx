import { createRoute, Outlet } from "@tanstack/react-router";
import { rootRoute } from "./router";
import { LoginPage } from "../pages/public/login";

const publicRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "public",
  // const PublicLayout = () => <Outlet />;
  component: () => <Outlet />,
});

// Add a landing (index) route so the root path "/" is matched.
// For now it renders the `LoginPage` — change this to your real landing component if you have one.
const landingRoute = createRoute({
  getParentRoute: () => publicRoute,
  path: "/",
  component: () => <LoginPage />,
});

const loginRoute = createRoute({
  getParentRoute: () => publicRoute,
  path: "/login",
  // const PublicLayout = () => <Outlet />;
  component: () => <LoginPage />,
});

export const publicRouter = publicRoute.addChildren([
  landingRoute,
  loginRoute,
]);
