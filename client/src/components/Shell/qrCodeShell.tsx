import { Outlet } from "@tanstack/react-router";
import { type TabProps } from "./header";
import { Shell } from "./shell";

const linksQrCode = [{ link: "/qr_code/code", label: "QR Code" }] as TabProps[];

export function QrCodeShell() {
  return (
    <Shell links={linksQrCode}>
      <Outlet />
    </Shell>
  );
}
