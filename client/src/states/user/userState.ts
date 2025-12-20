import { create } from "zustand";
import type { Role } from "../../models/models";

type UserState = {
  userId?: number;
  userName: string;
  role?: Role;
  login: (userName: string, password: string) => void;
  logout: () => void;
};

export const useUserState = create<UserState>((set) => ({
  userId: undefined,
  userName: "",
  role: undefined,
  login: (userName, password) => {
    console.log("login");
    console.log(userName, password);

    switch (userName) {
      case "admin":
        set({ userName: userName, userId: 1, role: "admin" });
        return;
      case "user":
        set({ userName: userName, userId: 2, role: "user" });
        return;
      case "qrCode":
        set({ userName: userName, userId: 3, role: "qrCode" });
        return;
    }
  },
  logout: () => {
    // todo Perform logout actions here
    set({ userId: undefined, userName: "", role: undefined });
  },
}));
