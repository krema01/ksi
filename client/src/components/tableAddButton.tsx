import { Stack, ActionIcon } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";

interface TableAddButtonProps {
  addItem: () => void;
}

export function TableAddButton({ addItem }: TableAddButtonProps) {
  return (
    <Stack>
      <ActionIcon onClick={addItem} size={"sm"}>
        <IconPlus />
      </ActionIcon>
    </Stack>
  );
}
