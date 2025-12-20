import { createRoute, Outlet } from "@tanstack/react-router";
import { rootRoute } from "./router";
import { TimeEntryAdminPage } from "../pages/private/admin/timeEntryAdminPage";
import { QrCodePage } from "../pages/private/qrCode/qrCodePage";
import { UserCheckinPage } from "../pages/private/user/userCheckinPage";
import { UserAdminPage } from "../pages/private/admin/userAdminPage";
import { QrCodeShell } from "../components/Shell/qrCodeShell";
import { AdminShell } from "../components/Shell/adminShell";
import { UserShell } from "../components/Shell/userShell";
import { UserCheckoutPage } from "../pages/private/user/userCheckoutPage";
import { DashboardPage } from "../pages/private/user/dashboardPage";

// Layout-Route mit AppShell
const appRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "app",
  component: () => <Outlet />,
});

// QR-Code Routes
const qrCodeRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/qr_code",
  component: () => <QrCodeShell />,
});

const qrCodeCodeRoute = createRoute({
  getParentRoute: () => qrCodeRoute,
  path: "/code",
  component: () => <QrCodePage />,
});

// User Routes
const userRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/user",
  component: () => <UserShell />,
});

const userDashboardRoute = createRoute({
  getParentRoute: () => userRoute,
  path: "/dashboard",
  component: () => <DashboardPage />,
});

const userCheckinRoute = createRoute({
  getParentRoute: () => userRoute,
  path: "/checkin",
  component: () => <UserCheckinPage />,
});

const userCheckoutRoute = createRoute({
  getParentRoute: () => userRoute,
  path: "/checkout",
  component: () => <UserCheckoutPage />,
});

// Admin Routes
const adminRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/admin",
  component: () => <AdminShell />,
});

const adminTimeEntryRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: "/time_entries",
  component: () => <TimeEntryAdminPage />,
});

const adminUserRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: "/users",
  component: () => <UserAdminPage />,
});

// Router export
export const privateRouter = appRoute.addChildren([
  adminRoute.addChildren([adminTimeEntryRoute, adminUserRoute]),
  qrCodeRoute.addChildren([qrCodeCodeRoute]),
  userRoute.addChildren([
    userDashboardRoute,
    userCheckinRoute,
    userCheckoutRoute,
  ]),
]);
