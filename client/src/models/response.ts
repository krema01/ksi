import type { Role } from "./models";

export interface LoginResponse {
  username: string;
  id: number;
  role: Role;
  token: string;
}

export interface RawTimeEntry {
  id: number;
  userId?: number;
  from?: string;
  until?: string;
}

export interface ScanResponse {
  misuse: boolean;
  reson: string;
}

export interface QRResponse {
  payload: string;
  signature: string;
}
