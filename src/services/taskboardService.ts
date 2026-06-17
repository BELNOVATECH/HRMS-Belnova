const BASE_URL = "https://belnova-hrms-be-7.onrender.com";

export interface BackendTask {
  id: number;
  title: string;
  status_id: number;
  emp_id: number;
}

/* ================= GET TASKS ================= */

export const getTasks = async (token: string): Promise<BackendTask[]> => {
  const res = await fetch(`${BASE_URL}/tasks/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const json = await res.json();
  return Array.isArray(json) ? json : json?.data || [];
};

/* ================= CREATE TASK ================= */

export interface CreateTaskPayload {
  title: string;
  description: string;
  task_type_id: number;
  status_id: number;
  project_id: number;
  project_module_id: number;
  emp_id: number;
  task_manager_id: number;
  reporting_manager_id: number;
  due_date: string;
  efforts_in_days: number;
  is_active: boolean;
}

export const createTask = async (
  token: string,
  payload: CreateTaskPayload
) => {
  const res = await fetch(`${BASE_URL}/tasks/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || "Create task failed");
  }

  return res.json();
};
