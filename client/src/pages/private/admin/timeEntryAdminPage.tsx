import { DataTable, type DataTableColumn } from "mantine-datatable";
import { useTimeEntryState } from "../../../states/admin/timeEntryState";
import type { TimeEntry } from "../../../models/models";
import { TableAddButton } from "../../../components/tableAddButton";
import { modals } from "@mantine/modals";
import { useUserEntryStore } from "../../../states/admin/userEntryState";
import { EditDeleteButton } from "../../../components/Buttons/EditDeleteButton";
import dayjs from "dayjs";
import { dateTimeFormat } from "../../../utils/constants";

export function TimeEntryAdminPage() {
  const { timeEntrys, addTimeEntry, removeTimeEntry, updateTimeEntry } =
    useTimeEntryState();
  const { users } = useUserEntryStore();

  const openCreateModal = (timeEntry: TimeEntry) => {
    modals.openContextModal({
      modal: "CreateTimeEntryModal",
      title: "Create Time Entry",
      innerProps: {
        timeEntry: timeEntry,
        submitTimeEntry: addTimeEntry,
      },
      centered: true,
    });
  };

  const openEditModal = (timeEntry: TimeEntry) => {
    modals.openContextModal({
      modal: "CreateTimeEntryModal",
      title: "Update Time Entry",
      innerProps: {
        timeEntry: timeEntry,
        submitTimeEntry: updateTimeEntry,
      },
      centered: true,
    });
  };

  const columns: DataTableColumn<TimeEntry>[] = [
    {
      accessor: "actions",
      width: 70,
      title: (
        <TableAddButton
          addItem={() => {
            const maxId =
              timeEntrys.length > 0
                ? Math.max(...timeEntrys.map((u) => u.id)) + 1
                : 0;

            openCreateModal({
              id: maxId,
              from: dayjs(),
              until: dayjs(),
            });
          }}
        />
      ),
      render: (timeEntry) => (
        <EditDeleteButton
          onEdit={() => {
            openEditModal(timeEntry);
          }}
          onDelete={() => {
            removeTimeEntry(timeEntry.id);
          }}
        />
      ),
    },
    {
      accessor: "userId",
      title: "workerName",
      render: (entry) =>
        users.find((w) => w.id === entry.userId)?.username || "",
    },
    {
      accessor: "from",
      title: "from",
      render: (entry) => entry.from?.format(dateTimeFormat),
    },
    {
      accessor: "until",
      title: "until",
      render: (entry) => entry.until?.format(dateTimeFormat),
    },
    {
      accessor: "duration",
      title: "duration (hh:mm)",
      render: (entry) => {
        if (!entry.from || !entry.until) return "";
        const duration = dayjs(entry.until).diff(dayjs(entry.from), "minute");
        const hours = Math.floor(duration / 60);
        const minutes = duration % 60;
        return `${hours}:${minutes.toString().padStart(2, "0")}`;
      },
    },
  ];

  return (
    <DataTable
      highlightOnHover
      withTableBorder
      withColumnBorders
      columns={columns}
      records={timeEntrys.sort((a, b) => a.id - b.id)}
    />
  );
}
