import axios from "axios";

const BASE_URL = "https://hrms-be-ppze.onrender.com";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
    Expires: "0",
  },
});

/* ================= TYPES ================= */

export interface BackendLeaveBalance {
  leave_type_id: number;
  leave_type: string;
  granted: number;
  consumed: number;
  balance: number;
}

export interface LeaveBalanceResponse {
  emp_id: number;
  year: number;
  month: number;
  leaves: BackendLeaveBalance[];
}

/* ================= API ================= */

export const getLeaveBalanceApi = (
  empId: number,
  year: number,
  month?: number
) =>
  api.get<LeaveBalanceResponse>("/leave/balance", {
    params: {
      emp_id: empId,
      year,
      ...(month ? { month } : {}),
      _ts: Date.now(),
    },
  });
