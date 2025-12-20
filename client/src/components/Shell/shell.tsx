import { AppShell, Card, Container } from "@mantine/core";
import { HeaderSimple, type TabProps } from "./header";
import type { ReactNode } from "react";

export type ShellProps = {
  links: TabProps[];
  children?: ReactNode;
};

export function Shell({ links, children }: ShellProps) {
  return (
    <AppShell header={{ height: 48 }} withBorder={false}>
      <AppShell.Header>
        <HeaderSimple links={links} />
      </AppShell.Header>

      <AppShell.Main h={"100%"} display={"flex"}>
        <Container flex={1} size={"lg"} mt={"md"} mb={"md"}>
          <Card withBorder h={"100%"} shadow="sm" padding="lg" radius={"lg"}>
            {children}
          </Card>
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}
