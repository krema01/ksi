import { create } from "zustand";
import type { UserEntry } from "../../models/models";

type UserEntryStore = {
  users: UserEntry[];
  addUser: (user: UserEntry) => void;
  removeUser: (id: number) => void;
  clearUsers: () => void;
  updateUser: (user: UserEntry) => void;
  fetchUsers: () => void;
};

export const useUserEntryStore = create<UserEntryStore>((set, get) => ({
  fetchUsers: async () => {
    console.log("fetch users");
    // const users = await fetch("/api/users").then((res) => res.json());

    set({ users: [] });
  },
  users: [],
  addUser: (user) =>
    set((state) => ({
      users: [...state.users, user],
    })),
  removeUser: (id) =>
    set((state) => ({
      users: state.users.filter((u) => u.id !== id),
    })),
  clearUsers: () => set({ users: [] }),
  updateUser: (user) => {
    const users = get().users.filter((u) => u.id !== user.id);

    set(() => ({
      users: [...users, user],
    }));
  },
}));

export const getUserStore = useUserEntryStore.getState;
