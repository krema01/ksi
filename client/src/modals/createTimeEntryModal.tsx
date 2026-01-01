import { Button, Group, Select, Stack } from "@mantine/core";
import type { ContextModalProps } from "@mantine/modals";
import type { TimeEntry } from "../models/models";
import { useForm } from "@mantine/form";
import { useUserEntryStore } from "../states/admin/userEntryState";
import dayjs from "dayjs";
import { DateTimePicker } from "@mantine/dates";
import { dateTimeFormat } from "../utils/constants";

export function CreateTimeEntryModal({
  context,
  id,
  innerProps: { timeEntry, submitTimeEntry },
}: ContextModalProps<{
  timeEntry: TimeEntry;
  submitTimeEntry: (timeEntry: TimeEntry) => void;
}>) {
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      id: timeEntry.id,
      from: timeEntry.from?.format(dateTimeFormat),
      until: timeEntry.until?.format(dateTimeFormat),
      userId: timeEntry.userId?.toString(),
    },
    validate: {
      userId: (value) => {
        if (value === undefined) {
          return "User is required";
        }
      },
      until: (value, values) => {
        const until = dayjs(value, dateTimeFormat);
        const from = dayjs(values.from, dateTimeFormat);

        if (until && from && until.isBefore(from)) {
          return "'Until' must be after 'From'";
        }
      },
      from: (value, values) => {
        const until = dayjs(values.until, dateTimeFormat);
        const from = dayjs(value, dateTimeFormat);

        if (from && until && from.isAfter(until)) {
          return "'From' must be before 'Until'";
        }
      },
    },
  });

  const { users } = useUserEntryStore();

  return (
    <Stack>
      <form
        onSubmit={form.onSubmit((values) => {
          submitTimeEntry({
            userId: Number(values.userId),
            from: dayjs(values.from, dateTimeFormat),
            until: dayjs(values.until, dateTimeFormat),
            id: values.id,
          });
          context.closeModal(id);
        })}
      >
        <Select
          label="Worker"
          placeholder="Pick value"
          data={users.map((u) => {
            return { label: u.username, value: u.id.toString() };
          })}
          {...form.getInputProps("userId")}
        />
        <DateTimePicker
          label="From"
          placeholder="Pick date and time"
          {...form.getInputProps("from")}
          presets={[
            {
              value: dayjs().subtract(1, "day").format(dateTimeFormat),
              label: "Yesterday",
            },
            { value: dayjs().format(dateTimeFormat), label: "Today" },
          ]}
        />

        <DateTimePicker
          label="Until"
          placeholder="Pick date and time"
          {...form.getInputProps("until")}
          presets={[
            {
              value: dayjs().subtract(1, "day").format(dateTimeFormat),
              label: "Yesterday",
            },
            { value: dayjs().format(dateTimeFormat), label: "Today" },
          ]}
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
