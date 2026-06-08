import axios from "axios";

const BASE_URL = "https://hrms-be-ppze.onrender.com";

/* ✅ EXPORT THIS INTERFACE */
export interface EmployeeLeaveItem {
  leave_request_id: number;
  emp_id: number;
  leave_type: string;
  start_date: string;
  end_date: string;
  total_days: number;
  status_id: number;      // ✅ ADD THIS
  status_name: string;
  reason?: string;
  upload_file?: string;
}


/* ✅ EXPORT THIS FUNCTION */
export const getLeavesByEmployeeIdApi = (
  empId: number,
  limit = 50,
  offset = 0
) => {
  return axios.get<EmployeeLeaveItem[]>(`${BASE_URL}/leave/list`, {
    params: {
      emp_id: empId,
      limit,
      offset,
    },
  });
};
