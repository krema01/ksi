import { createRoute, Outlet } from "@tanstack/react-router";
import { rootRoute } from "./router";
import { TimeEntryAdminPage } from "../pages/private/admin/timeEntryAdminPage";
import { UserAdminPage } from "../pages/private/admin/userAdminPage";
import { QrCodeShell } from "../components/Shell/qrCodeShell";
import { AdminShell } from "../components/Shell/adminShell";
import { UserShell } from "../components/Shell/userShell";
import { DashboardPage } from "../pages/private/user/dashboardPage";
import { getUserStore } from "../states/admin/userEntryState";
import { getTimeEntryStore } from "../states/admin/timeEntryState";
import { UserQrPage } from "../pages/private/user/UserQrPage";
import { QrScanPage } from "../pages/private/qrCode/qrScanPage";

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

const scanRoute = createRoute({
  getParentRoute: () => qrCodeRoute,
  path: "/scan",
  component: () => <QrScanPage />,
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
  beforeLoad: async () => {
    // Fetch users before loading the route
    const { fetchUsers } = getUserStore();
    await fetchUsers();
  },
});

const userCheckinRoute = createRoute({
  getParentRoute: () => userRoute,
  path: "/checkin",
  component: () => <UserQrPage action="checkin" />,
});

const userCheckoutRoute = createRoute({
  getParentRoute: () => userRoute,
  path: "/checkout",
  component: () => <UserQrPage action="checkout" />,
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
  beforeLoad: async () => {
    // Fetch time entries before loading the route
    const { fetchTimeEntrys } = getTimeEntryStore();
    await fetchTimeEntrys();
    const { fetchUsers } = getUserStore();
    await fetchUsers();
  },
});

const adminUserRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: "/users",
  component: () => <UserAdminPage />,
  beforeLoad: async () => {
    // Fetch users before loading the route
    const { fetchUsers } = getUserStore();
    await fetchUsers();
  },
});

// Router export
export const privateRouter = appRoute.addChildren([
  adminRoute.addChildren([adminTimeEntryRoute, adminUserRoute]),
  qrCodeRoute.addChildren([scanRoute]),
  userRoute.addChildren([
    userDashboardRoute,
    userCheckinRoute,
    userCheckoutRoute,
  ]),
]);
