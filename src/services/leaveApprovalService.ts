import axios from "axios";

const API_URL = "https://hrms-be-ppze.onrender.com";

/**
 * Fetch pending leaves assigned to a manager
 * @param managerId logged-in manager's emp_id
 * @param limit pagination limit
 * @param offset pagination offset
 */
export const getLeavesByManagerIdApi = (
  managerId: number,
  limit = 10,
  offset = 0
) => {
  return axios.get(`${API_URL}/leave/pending/${managerId}`, {
    params: {
      limit,
      offset,
    },
  });
};
