import { create } from "zustand";
import type { TimeEntry } from "../../models/models";

type TimeEntryState = {
  timeEntrys: TimeEntry[];
  addTimeEntry: (TimeEntry: TimeEntry) => void;
  removeTimeEntry: (id: number) => void;
  clearTimeEntrys: () => void;
  updateTimeEntry: (timeEntry: TimeEntry) => void;
  fetchTimeEntrys: () => void;
};

export const useTimeEntryState = create<TimeEntryState>((set, get) => ({
  fetchTimeEntrys: async () => {
    console.log("fetch timeEntrys");
    // const timeEntrys = await fetch("/api/timeEntrys").then((res) => res.json());
    set({ timeEntrys: [] });
  },
  timeEntrys: [],
  addTimeEntry: (timeEntrys) =>
    set((state) => ({
      timeEntrys: [...state.timeEntrys, timeEntrys],
    })),
  removeTimeEntry: (id) =>
    set((state) => ({
      timeEntrys: state.timeEntrys.filter((u) => u.id !== id),
    })),
  clearTimeEntrys: () => set({ timeEntrys: [] }),
  updateTimeEntry: (timeEntry) => {
    const timeEntrys = get().timeEntrys.filter((u) => u.id !== timeEntry.id);

    set(() => ({
      timeEntrys: [...timeEntrys, timeEntry],
    }));
  },
}));
