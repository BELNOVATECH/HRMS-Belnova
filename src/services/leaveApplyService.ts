import axios from "axios";

const BASE_URL = "https://hrms-be-ppze.onrender.com";

const api = axios.create({
  baseURL: BASE_URL,
});

// 🔐 Attach token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("hrms-token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Apply Leave API
 * IMPORTANT:
 * - Do NOT set multipart headers manually
 * - Axios will handle FormData boundaries automatically
 */
export const applyLeaveApi = (payload: FormData) => {
  return api.post("/leave/apply", payload);
};

/**
 * Fetch Employees API
 */
export const fetchEmployeesApi = () => {
  return api.get("/employees");
};
