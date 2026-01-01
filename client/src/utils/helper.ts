import dayjs from "dayjs";
import type { TimeEntry } from "../models/models";
import type { RawTimeEntry } from "../models/response";

export function parseRawTimeEntries(raw: RawTimeEntry[]): TimeEntry[] {
  return raw.map((entry) => parseRawTimeEntry(entry));
}

export function parseRawTimeEntry(raw: RawTimeEntry): TimeEntry {
  return {
    id: raw.id,
    userId: raw.userId,
    from: raw.from ? dayjs(raw.from) : undefined,
    until: raw.until ? dayjs(raw.until) : undefined,
  };
}
