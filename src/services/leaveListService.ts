import axios from "axios";

const BASE_URL = "https://hrms-be-ppze.onrender.com";

export interface EmployeeLeaveItem {
  status_id: number;
  employee_name?: string;
  leave_request_id: number;
  emp_id: number;
manager_id?: number;
  leave_type: string;
  start_date: string;
  end_date: string;
  total_days: number;
  status_name: string;
  reason?: string;
  upload_file?: string;
}

export const getLeavesApi = (params: {
  emp_id?: number;
manager_id?: number;
  limit?: number;
  offset?: number;
}) => {
  return axios.get<EmployeeLeaveItem[]>(`${BASE_URL}/leave/list`, {
    params,
  });
};
