import {
  Button,
  Group,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useUserState } from "../../states/user/userState";
import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";

export function AuthenticationForm() {
  const { login, role } = useUserState();
  const navigation = useNavigate();

  useEffect(() => {
    if (role) {
      switch (role) {
        case "admin":
          navigation({ to: "/admin/users" });
          return;
        case "user":
          navigation({ to: "/user/checkin" });
          return;
        case "qrCode":
          navigation({ to: "/qr_code/code" });
          return;
      }
    }
  }, [role, navigation]);

  const form = useForm({
    initialValues: {
      name: "",
      password: "",
      terms: true,
    },
  });

  return (
    <Paper radius="md" p="lg" withBorder>
      <Text size="lg" fw={500} mb={"lg"}>
        Welcome to QR Checkin, login with
      </Text>

      <form
        onSubmit={form.onSubmit(() => {
          login(form.values.name, form.values.password);
        })}
      >
        <Stack>
          <TextInput
            required
            label="Username"
            placeholder="Musername"
            value={form.values.name}
            onChange={(event) =>
              form.setFieldValue("name", event.currentTarget.value)
            }
            radius="md"
          />

          <PasswordInput
            required
            label="Password"
            placeholder="Your password"
            value={form.values.password}
            onChange={(event) =>
              form.setFieldValue("password", event.currentTarget.value)
            }
            error={
              form.errors.password &&
              "Password should include at least 6 characters"
            }
            radius="md"
          />
        </Stack>

        <Group justify="space-between" mt="xl">
          <Button type="submit" radius="xl">
            Login
          </Button>
        </Group>
      </form>
    </Paper>
  );
}
