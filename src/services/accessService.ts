import axios from "axios";
import { Module, Screen, Permission } from "../types/access";
import {
  mapModule,
  mapScreen,
  mapPermission,
  toBackendPermission,
} from "../utils/accessMapper";

const API = "https://belnova-hrms-be-7.onrender.com/master";

/* ================= GET ================= */

export const getModules = async (): Promise<Module[]> => {
  const res = await axios.get(`${API}/modules/`);
  const list = Array.isArray(res.data) ? res.data : res.data?.data || [];
  return list.map(mapModule);
};

// ✅ screens changed to sub-modules
export const getScreens = async (): Promise<Screen[]> => {
  const res = await axios.get(`${API}/screens/`);
  const list = Array.isArray(res.data) ? res.data : res.data?.data || [];
  return list.map(mapScreen);
};

export const getPermissions = async (): Promise<Permission[]> => {
  const res = await axios.get(`${API}/permissions/`);
  const list = Array.isArray(res.data) ? res.data : res.data?.data || [];
  return list.map(mapPermission);
};

/* ================= BULK ================= */

export const bulkCreatePermissions = async (payload: Permission[]) =>
  axios.post(`${API}/permissions/bulk/`, payload.map(toBackendPermission));

export const bulkUpdatePermissions = async (payload: Permission[]) =>
  axios.put(`${API}/permissions/bulk/`, payload.map(toBackendPermission));
