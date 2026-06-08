import axios from "axios";

const BASE_URL = "https://hrms-be-ppze.onrender.com";

export interface PendingLeaveItem {
  leave_request_id: number;
  emp_id: number;
  leavetype_id: number;
  leave_type: string;
  start_date: string;
  end_date: string;
  total_days: number;
  status_id: number;
  status_name: string;
  reason?: string;
  upload_file?: string;
}

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/* ✅ GET PENDING LEAVES */
export const getPendingLeavesApi = (managerId: number) =>
  api.get<PendingLeaveItem[]>(
    `/leave/pending/${managerId}?limit=10&offset=0`
  );

/* ✅ APPROVE / REJECT */
export interface ApproveRejectPayload {
  leave_id: number;
  action: "approve" | "reject";
  approver_id: number;
  remarks?: string;
}

export const approveRejectLeaveApi = (payload: ApproveRejectPayload) =>
  api.post("/leave/approve-reject", payload, {
    validateStatus: () => true, // ✅ prevents axios throwing error automatically
  });
