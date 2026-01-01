import { create } from "zustand";
import type { Role } from "../../models/models";
import { fetchJSON } from "../../utils/api";
import type { LoginResponse } from "../../models/response";

type UserState = {
  userId?: number;
  userName: string;
  role?: Role;
  login: (username: string, password: string) => void;
  logout: () => void;
  token?: string;
};

export const useUserState = create<UserState>((set) => ({
  userId: undefined,
  userName: "",
  role: undefined,
  login: async (username, password) => {
    // fetch
    const response = await fetchJSON<LoginResponse>("/api/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });

    set({
      token: response.token,
      userName: response.username,
      userId: response.id,
      role: response.role,
    });
  },
  logout: () => {
    // todo Perform logout actions here
    set({ userId: undefined, userName: "", role: undefined });
  },
}));
