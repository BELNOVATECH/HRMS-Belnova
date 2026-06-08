import axios from "axios";

const API_URL = "https://hrms-be-ppze.onrender.com";

export const loginUser = async (data: { email: string; password: string }) => {
  const res = await axios.post(`${API_URL}/auth/login`, data);

  // ✅ assuming backend response contains token + permissions
  const token = res.data?.token;
  const permissions = res.data?.permissions;

  if (token) localStorage.setItem("hrms-token", token);
  if (permissions)
    localStorage.setItem("hrms-permissions", JSON.stringify(permissions));

  return res.data;
};
