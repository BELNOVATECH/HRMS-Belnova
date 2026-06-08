import { api } from "./api";

// ✅ GET all tasks
export const getTasks = async () => {
  const res = await api.get("/tasks/");
  return res.data;
};

// ✅ UPDATE full task
export const updateTask = async (taskId: number, payload: any) => {
  const res = await api.put(`/tasks/${taskId}`, payload);
  return res.data;
};

// ✅ UPDATE status only
export const updateTaskStatus = async (taskId: number, status_id: number) => {
  const res = await api.put(`/tasks/${taskId}/status`, { status_id });
  return res.data;
};
