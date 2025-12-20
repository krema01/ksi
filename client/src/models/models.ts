import type dayjs from "dayjs";

export type TimeEntry = {
  id: number;
  userId?: number;
  from?: dayjs.Dayjs;
  until?: dayjs.Dayjs;
};

export type Role = "admin" | "user" | "qrCode";

export type UserEntry = {
  id: number;
  name: string;
  role: Role;
};
