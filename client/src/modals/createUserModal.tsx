import { Button, Group, Select, Stack, TextInput } from "@mantine/core";
import type { ContextModalProps } from "@mantine/modals";
import type { UserEntry } from "../models/models";
import { useForm } from "@mantine/form";
import { useUserEntryStore } from "../states/admin/userEntryState";

export function CreateUserModal({
  context,
  id,
  innerProps: { User, submitUser },
}: ContextModalProps<{
  User?: UserEntry;
  submitUser: (User: UserEntry) => void;
}>) {
  const users = useUserEntryStore((state) => state.users);

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      id: User?.id || 0,
      name: User?.name || "",
      role: User?.role || "USER",
      username: User?.username || "",
      password: "",
    },
    validate: {
      name: (value) => {
        if (value.length === 0) {
          return "Name is required";
        }
      },
      username: (value) => {
        if (value.length === 0) {
          return "Username is required";
        }

        if (
          users.find(
            (u) =>
              u.username.toLowerCase() === value.toLowerCase() &&
              u.id !== User?.id
          )
        ) {
          return "Username must be unique";
        }
      },
      password: (value) => {
        if (User === undefined && value.length === 0) {
          return "Password is required";
        }
      },
      role: (value) => {
        if (value.length === 0) {
          return "Role is required";
        }
      },
    },
  });

  return (
    <Stack>
      <form
        onSubmit={form.onSubmit((values) => {
          submitUser(values);
          context.closeModal(id);
        })}
      >
        <TextInput
          label="Name"
          key={form.key("name")}
          {...form.getInputProps("name")}
        />

        <TextInput
          label="Username"
          key={form.key("username")}
          {...form.getInputProps("username")}
        />

        {User === undefined ? (
          <TextInput
            label="Password"
            key={form.key("password")}
            {...form.getInputProps("password")}
          />
        ) : null}

        <Select
          label="Worker"
          placeholder="Pick value"
          data={[
            { label: "admin", value: "ADMIN" },
            { label: "user", value: "USER" },
            { label: "qrCode", value: "QRCODE" },
          ]}
          {...form.getInputProps("role")}
        />

        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={() => context.closeModal(id)}>
            Cancel
          </Button>
          <Button type="submit">Submit</Button>
        </Group>
      </form>
    </Stack>
  );
}
