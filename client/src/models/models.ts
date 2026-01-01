import type dayjs from "dayjs";

export type TimeEntry = {
  id: number;
  userId?: number;
  from?: dayjs.Dayjs;
  until?: dayjs.Dayjs;
};

export type Role = "ADMIN" | "USER" | "QRCODE";

export type UserEntry = {
  id: number;
  name: string;
  role: Role;
  username: string;
};
