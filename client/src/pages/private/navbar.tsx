import {
  IconCalendarEvent,
  IconCategory,
  IconHome2,
  IconLogout,
  IconSwitchHorizontal,
  IconUsers,
  IconWriting,
} from "@tabler/icons-react";
import { Stack, Tooltip, UnstyledButton } from "@mantine/core";
import { useNavigate, useMatchRoute } from "@tanstack/react-router";
import classes from "./navbar.module.css";

interface NavbarLinkProps {
  icon: typeof IconHome2;
  label: string;
  to?: string;
}

function NavbarLink({ icon: Icon, label, to }: NavbarLinkProps) {
  const navigate = useNavigate();
  const matchRoute = useMatchRoute();

  const isActive = to ? !!matchRoute({ to }) : false;

  return (
    <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
      <UnstyledButton
        onClick={() => to && navigate({ to })}
        className={classes.link}
        data-active={isActive || undefined}
      >
        <Icon size={20} stroke={1.5} />
      </UnstyledButton>
    </Tooltip>
  );
}

const linksData = [
  { icon: IconHome2, label: "Home", to: "/home" },
  { icon: IconCalendarEvent, label: "Plan", to: "/team/$id/plan" },
  {
    icon: IconWriting,
    label: "Shift Planner",
    to: "/team/$id//shift_planner",
  },
  { icon: IconCategory, label: "Group", to: "/team/$id/group" },
  { icon: IconUsers, label: "Workers", to: "/team/$id//workers" },
];

export function ShellNavbar() {
  return (
    <>
      <div className={classes.navbarMain}>
        <Stack justify="center" gap={0}>
          {linksData.map((link) => (
            <NavbarLink {...link} key={link.label} />
          ))}
        </Stack>
      </div>

      <Stack justify="center" gap={0}>
        <NavbarLink icon={IconSwitchHorizontal} label="Change account" />
        <NavbarLink icon={IconLogout} label="Logout" />
      </Stack>
    </>
  );
}
