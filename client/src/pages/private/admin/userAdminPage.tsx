import { DataTable, type DataTableColumn } from "mantine-datatable";
import type { UserEntry } from "../../../models/models";
import { TableAddButton } from "../../../components/tableAddButton";
import { modals } from "@mantine/modals";
import { useUserEntryStore } from "../../../states/admin/userEntryState";
import { EditDeleteButton } from "../../../components/Buttons/EditDeleteButton";

export function UserAdminPage() {
  const { addUser, users, updateUser, removeUser } = useUserEntryStore();

  const openCreateModal = () => {
    modals.openContextModal({
      modal: "CreateUserModal",
      title: "Create User",
      innerProps: {
        submitUser: addUser,
      },
      centered: true,
    });
  };

  const openEditModal = (user: UserEntry) => {
    modals.openContextModal({
      modal: "CreateUserModal",
      title: "Update User",
      innerProps: {
        User: user,
        submitUser: updateUser,
      },
      centered: true,
    });
  };

  const columns: DataTableColumn<UserEntry>[] = [
    {
      accessor: "actions",
      width: 70,
      title: <TableAddButton addItem={openCreateModal} />,
      render: (user) => (
        <EditDeleteButton
          onEdit={() => {
            openEditModal(user);
          }}
          onDelete={() => {
            removeUser(user.id);
          }}
        />
      ),
    },
    { accessor: "name", title: "Name" },
    { accessor: "role", title: "Role" },
  ];

  return (
    <DataTable
      highlightOnHover
      withTableBorder
      withColumnBorders
      columns={columns}
      records={users.sort((a, b) => a.id - b.id)}
    />
  );
}
