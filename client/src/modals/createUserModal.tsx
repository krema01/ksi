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
  User: UserEntry;
  submitUser: (User: UserEntry) => void;
}>) {
  const users = useUserEntryStore((state) => state.users);

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      id: User.id,
      name: User.name || "",
      role: User.role || "user",
    },
    validate: {
      name: (value) => {
        if (value.length === 0) {
          return "Name is required";
        }

        if (
          users.find(
            (u) =>
              u.name.toLowerCase() === value.toLowerCase() && u.id !== User.id
          )
        ) {
          return "Name must be unique";
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

        <Select
          label="Worker"
          placeholder="Pick value"
          data={["admin", "user", "qrCode"]}
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
