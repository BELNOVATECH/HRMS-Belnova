import axios from "axios";

export interface Role {
  [x: string]: any;
  id: number;
  role_name: string;
  is_active: boolean;
}

const API = "https://hrms-be-ppze.onrender.com";

/* ================= GET ================= */

export const getRoles = async (): Promise<Role[]> =>
  (await axios.get(`${API}/roles/`)).data;

/* ================= POST ================= */

export const createRole = (payload: { role_name: string }) =>
  axios.post(`${API}/roles/`, payload);

/* ================= PUT ================= */

export const updateRole = (
  id: number,
  payload: { role_name: string; is_active: boolean }
) =>
  axios.put(`${API}/roles/${id}/`, payload);
