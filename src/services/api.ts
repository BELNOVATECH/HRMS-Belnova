import axios from "axios";

const API_URL = "https://hrms-be-ppze.onrender.com";

export const api = axios.create({
  baseURL: API_URL,
});
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("hrms-token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Automatically attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("hrms-token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// const api = axios.create({
//   baseURL: "https://hrms-be-ppze.onrender.com", // ✅ CORRECT
// });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("hrms-token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
