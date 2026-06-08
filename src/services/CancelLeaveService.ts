import axios from "axios";

const BASE_URL = "https://hrms-be-ppze.onrender.com";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/* ✅ CANCEL LEAVE — MATCHES BACKEND EXACTLY */
export const cancelLeaveApi = (
  leaveId: number,
  empId: number
) =>
  api.put(
    `/leave/cancel?emp_id=${empId}`,
    {
      leave_id: leaveId,
      status_id: 13, // ✅ CANCELLED
      remarks: "Cancelled by employee",
    },
    {
      validateStatus: () => true,
    }
  );
