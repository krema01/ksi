import { createRoute, Outlet } from "@tanstack/react-router";
import { rootRoute } from "./router";
import { LoginPage } from "../pages/public/login";

const publicRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "public",
  // const PublicLayout = () => <Outlet />;
  component: () => <Outlet />,
});

// const landingRoute = createRoute({
//   getParentRoute: () => publicRoute,
//   path: "/",
//   component: () => (
//     <main>
//       <Box p={"lg"}>
//         <Calender />
//       </Box>
//     </main>
//   ),
// });

const loginRoute = createRoute({
  getParentRoute: () => publicRoute,
  path: "/login",
  // const PublicLayout = () => <Outlet />;
  component: () => <LoginPage />,
});

export const publicRouter = publicRoute.addChildren([
  // landingRoute,
  loginRoute,
]);
