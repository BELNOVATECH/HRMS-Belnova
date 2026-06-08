// src/services/leaveCalendarService.ts
import axios from "axios";

const BASE_URL = "https://hrms-be-ppze.onrender.com";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/* ================= TYPES ================= */

/**
 * Unified type that supports:
 * - /leave/history
 * - /leave/monthly-summary
 */
export interface LeaveHistoryItem {
  // history fields
  leave_request_id?: number;
  leave_type?: string;
  status_name?: string;
  approval_status?: string;

  // common date fields
  start_date: string;
  end_date: string;

  // numeric
  total_days?: number;

  // monthly-summary fields
  leave_id?: number;
  days_counted_in_month?: number;
}

/* ================= APIs ================= */

export const getLeaveHistoryApi = (
  empId: number,
  limit = 100,
  offset = 0
) =>
  api.get<LeaveHistoryItem[]>(`/leave/history/${empId}`, {
    params: { limit, offset },
  });

export const getLeaveMonthlySummaryApi = (
  empId: number,
  year: number,
  month: number
) =>
  api.get(`/leave/monthly-summary`, {
    params: { emp_id: empId, year, month },
  });
