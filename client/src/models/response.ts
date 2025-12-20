// models.ts
export interface Shift {
  id: number;
  date: string;
  groups: string[];
  name: string;
}

export interface Assignment {
  shift: Shift;
  workerId: number;
  workerName: string;
  workerGroups: string[];
}

export interface Day {
  day: string;
  assignments: Assignment[];
}

export interface WorkerInfo {
  id: number;
  name: string;
  hours: number;
}

export interface Week {
  days: Day[];
  outWorkerInfo: WorkerInfo[];
}
