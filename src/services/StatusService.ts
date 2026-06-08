import axios from "axios";

const API_BASE = "https://hrms-be-ppze.onrender.com";

export const getEmployeeStatuses = () => {
  return axios.get(`${API_BASE}/master-emp-status/`);
};
