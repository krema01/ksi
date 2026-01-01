import { create } from "zustand";
import type { UserEntry } from "../../models/models";
import { fetchJSON } from "../../utils/api";

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
    const response = await fetchJSON<UserEntry[]>("/api/users", {
      method: "GET",
    });

    set({ users: response });
  },
  users: [],
  addUser: async (user) => {
    const response = await fetchJSON<UserEntry>("/api/user", {
      method: "POST",
      body: JSON.stringify(user),
    });

    set((state) => ({
      users: [...state.users, response],
    }));
  },
  removeUser: async (id) => {
    await fetchJSON<UserEntry>("/api/user/" + id, {
      method: "DELETE",
    });

    set((state) => ({
      users: state.users.filter((u) => u.id !== id),
    }));
  },
  clearUsers: () => set({ users: [] }),
  updateUser: async (user) => {
    const response = await fetchJSON<UserEntry>("/api/user/" + user.id, {
      method: "PUT",
      body: JSON.stringify(user),
    });

    const users = get().users.filter((u) => u.id !== user.id);

    set(() => ({
      users: [...users, response],
    }));
  },
}));

export const getUserStore = useUserEntryStore.getState;
