// src/stores/leaveStore.tsx
import { createContext, useContext, useState, type ReactNode } from "react";

/** Shared leave entry used by both screens */
export interface LeaveEntry {
  id: number;
  employeeName: string;
  leaveType: string;
  fromDate: string;
  toDate: string; 
  fromSession: string; // e.g. "Session 1"
  toSession: string; // e.g. "Session 2"
  days: number; // number of days (can be integer or 0.5)
  reason?: string;
  createdAt: string; 
}

/** Context shape */
interface LeaveContextShape {
  entries: LeaveEntry[];
  addEntry: (entry: Omit<LeaveEntry, "id" | "createdAt">) => LeaveEntry;
  // helper to seed or replace entries (useful in testing/backend integration)
  setEntries: (entries: LeaveEntry[]) => void;
}

/** Create context */
const LeaveContext = createContext<LeaveContextShape | undefined>(undefined);

/** Simple initial data (keeps your earlier sample history visible in calendar) */
const initialEntries: LeaveEntry[] = [
  {
    id: 1,
    employeeName: "John Doe",
    leaveType: "Sick Leave",
    fromDate: "2025-01-10",
    toDate: "2025-01-11",
    fromSession: "Session 1",
    toSession: "Session 2",
    days: 2,
    reason: "Fever",
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    employeeName: "John Doe",
    leaveType: "Earned Leave",
    fromDate: "2025-02-05",
    toDate: "2025-02-07",
    fromSession: "Session 1",
    toSession: "Session 2",
    days: 3,
    reason: "Vacation",
    createdAt: new Date().toISOString(),
  },
];

export const LeaveProvider = ({ children }: { children: ReactNode }) => {
  const [entries, setEntries] = useState<LeaveEntry[]>(initialEntries);

  const addEntry = (entry: Omit<LeaveEntry, "id" | "createdAt">) => {
    const nextId = entries.length ? Math.max(...entries.map((e) => e.id)) + 1 : 1;
    const newEntry: LeaveEntry = {
      id: nextId,
      createdAt: new Date().toISOString(),
      ...entry,
    };
    setEntries((prev) => [...prev, newEntry]);
    return newEntry;
  };

  return (
    <LeaveContext.Provider value={{ entries, addEntry, setEntries }}>
      {children}
    </LeaveContext.Provider>
  );
};

export const useLeaveStore = (): LeaveContextShape => {
  const ctx = useContext(LeaveContext);
  if (!ctx) throw new Error("useLeaveStore must be used within LeaveProvider");
  return ctx;
};