import axios from "axios";

const API_BASE = "https://belnova-hrms-be-7.onrender.com";

export const getEmployeeStatuses = () => {
  return axios.get(`${API_BASE}/master-emp-status/`);
};
