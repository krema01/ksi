import { ActionIcon, Group, Tooltip } from "@mantine/core";
import { IconPencil, IconTrash } from "@tabler/icons-react";

interface EditDeleteButtonProps {
  onEdit?: () => void;
  onDelete?: () => void;
}

export function EditDeleteButton({ onEdit, onDelete }: EditDeleteButtonProps) {
  return (
    <Group gap={4}>
      <Tooltip label="Add Time Entry">
        <ActionIcon size={"sm"} variant="subtle" color="green" onClick={onEdit}>
          <IconPencil size={"sm"} />
        </ActionIcon>
      </Tooltip>
      <Tooltip label="Add Time Entry">
        <ActionIcon size={"sm"} variant="subtle" color="red" onClick={onDelete}>
          <IconTrash size={"sm"} />
        </ActionIcon>
      </Tooltip>
    </Group>
  );
}
