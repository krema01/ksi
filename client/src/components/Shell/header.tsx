import { useState } from "react";
import {
  Button,
  Center,
  Container,
  FloatingIndicator,
  Grid,
  Group,
  Tabs,
} from "@mantine/core";
import classes from "./header.module.css";
import { useMatchRoute, useNavigate } from "@tanstack/react-router";
import type { RouterPaths } from "../../routes/router";
import { IconLogout } from "@tabler/icons-react";
import { useUserState } from "../../states/user/userState";

export type TabProps = {
  label: string;
  link: RouterPaths;
};

interface HeaderSimpleProps {
  links: TabProps[];
}

export function HeaderSimple({ links }: HeaderSimpleProps) {
  const navigate = useNavigate();

  const matchRoute = useMatchRoute();

  const { logout } = useUserState();

  const currentPath = links.find((link) => matchRoute({ to: link.link }))?.link;

  const [rootRef, setRootRef] = useState<HTMLDivElement | null>(null);
  const [value, setValue] = useState<string | null>(
    currentPath ? currentPath : links[0].link
  );
  const [controlsRefs, setControlsRefs] = useState<
    Record<string, HTMLButtonElement | null>
  >({});

  const setControlRef = (val: string) => (node: HTMLButtonElement) => {
    controlsRefs[val] = node;
    setControlsRefs(controlsRefs);
  };

  const onLogout = () => {
    logout();
    navigate({ to: "/login" });
  };

  return (
    <Container mt={"sm"} size={"lg"}>
      <Grid align="center" h={48} px="md">
        <Grid.Col span={3}></Grid.Col>
        <Grid.Col span={6}>
          <Center>
            <Tabs
              variant="none"
              value={value}
              onChange={(val) => {
                if (val !== null && val !== value) {
                  setValue(val);
                  navigate({ to: val });
                }
              }}
            >
              <Tabs.List ref={setRootRef} className={classes.list}>
                {links.map((link) => (
                  <Tabs.Tab
                    value={link.link!}
                    ref={setControlRef(link.link!)}
                    className={classes.tab}
                  >
                    {link.label}
                  </Tabs.Tab>
                ))}

                <FloatingIndicator
                  target={value ? controlsRefs[value] : null}
                  parent={rootRef}
                  className={classes.indicator}
                />
              </Tabs.List>
            </Tabs>
          </Center>
        </Grid.Col>

        <Grid.Col span={3}>
          <Group justify="flex-end">
            <Button
              leftSection={<IconLogout size={16} />}
              variant="default"
              onClick={onLogout}
            >
              Logout
            </Button>
          </Group>
        </Grid.Col>
      </Grid>
    </Container>
  );
}
