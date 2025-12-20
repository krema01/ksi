import { Outlet } from "@tanstack/react-router";
import { type TabProps } from "./header";
import { Shell } from "./shell";

const linksQrScanner = [
  { link: "/user/dashboard", label: "Dashboard" },
  { link: "/user/checkin", label: "Checkin" },
  { link: "/user/checkout", label: "Checkout" },
] as TabProps[];

export function UserShell() {
  return (
    <Shell links={linksQrScanner}>
      <Outlet />
    </Shell>
  );
}
