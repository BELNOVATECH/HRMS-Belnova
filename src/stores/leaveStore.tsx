// src/stores/leaveStore.ts
import { create } from "zustand";

// ✅ Type for a single leave record
export interface LeaveItem {
  id: number;
  leaveType: string;
  manager: string;
  fromDate: string;
  toDate: string;
  fromSession: string;
  toSession: string;
  contact: string;
  reason: string;
  ccList: string[];
  status: string;
  files: { name: string; size?: number; uid: string }[];
}

// ✅ Type for the Zustand store
export interface LeaveStore {
  leaves: LeaveItem[];
  addLeave: (leave: LeaveItem) => void;
  updateLeaveStatus: (
    id: number,
    status: string
  ) => void;
}

// ✅ Zustand store
export const useLeaveStore = create<LeaveStore>((set) => ({
  leaves: [],

  addLeave: (leave) =>
    set((state) => ({
      leaves: [...state.leaves, leave],
    })),

  updateLeaveStatus: (id, status) =>
    set((state) => ({
      leaves: state.leaves.map((l) =>
        l.id === id ? { ...l, status } : l
      ),
    })),
}));
