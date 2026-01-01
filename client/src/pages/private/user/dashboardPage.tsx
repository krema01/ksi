import { DataTable, type DataTableColumn } from "mantine-datatable";
import { useTimeEntryState } from "../../../states/admin/timeEntryState";
import type { TimeEntry } from "../../../models/models";
import { useUserEntryStore } from "../../../states/admin/userEntryState";
import dayjs from "dayjs";
import { dateTimeFormat } from "../../../utils/constants";

export function DashboardPage() {
  const { timeEntrys } = useTimeEntryState();
  const { users } = useUserEntryStore();

  const columns: DataTableColumn<TimeEntry>[] = [
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
