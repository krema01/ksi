import { create } from "zustand";
import type { TimeEntry } from "../../models/models";
import { fetchJSON } from "../../utils/api";
import type { RawTimeEntry } from "../../models/response";
import { parseRawTimeEntries, parseRawTimeEntry } from "../../utils/helper";

type TimeEntryState = {
  timeEntrys: TimeEntry[];
  addTimeEntry: (timeEntry: TimeEntry) => void;
  removeTimeEntry: (id: number) => void;
  clearTimeEntrys: () => void;
  updateTimeEntry: (timeEntry: TimeEntry) => void;
  fetchTimeEntrys: () => void;
};

export const useTimeEntryState = create<TimeEntryState>((set, get) => ({
  fetchTimeEntrys: async () => {
    const response = await fetchJSON<RawTimeEntry[]>("/api/timeEntries", {
      method: "GET",
    });

    set({ timeEntrys: parseRawTimeEntries(response) });
  },
  timeEntrys: [],
  addTimeEntry: async (timeEntry) => {
    const response = await fetchJSON<RawTimeEntry>("/api/timeEntry", {
      method: "POST",
      body: JSON.stringify(timeEntry),
    });

    set((state) => ({
      timeEntrys: [...state.timeEntrys, parseRawTimeEntry(response)],
    }));
  },
  removeTimeEntry: async (id) => {
    await fetchJSON<RawTimeEntry>("/api/timeEntry/" + id, {
      method: "DELETE",
    });

    set((state) => ({
      timeEntrys: state.timeEntrys.filter((u) => u.id !== id),
    }));
  },
  clearTimeEntrys: () => set({ timeEntrys: [] }),
  updateTimeEntry: async (timeEntry) => {
    const response = await fetchJSON<RawTimeEntry>(
      "/api/timeEntry/" + timeEntry.id,
      {
        method: "PUT",
        body: JSON.stringify(timeEntry),
      }
    );

    const timeEntrys = get().timeEntrys.filter((u) => u.id !== timeEntry.id);

    set(() => ({
      timeEntrys: [...timeEntrys, parseRawTimeEntry(response)],
    }));
  },
}));

export const getTimeEntryStore = useTimeEntryState.getState;
