import { Outlet } from "@tanstack/react-router";
import { type TabProps } from "./header";
import { Shell } from "./shell";

const linksAdmin = [
  { link: "/admin/dashboard", label: "Dashboard" },
  { link: "/admin/users", label: "Users" },
  { link: "/admin/time_entries", label: "Time Entries" },
] as TabProps[];

export function AdminShell() {
  return (
    <Shell links={linksAdmin}>
      <Outlet />
    </Shell>
  );
}
