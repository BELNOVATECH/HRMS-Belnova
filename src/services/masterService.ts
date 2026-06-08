const BASE_URL = "https://hrms-be-ppze.onrender.com";

export interface Status {
  id: number;
  name: string;
}

export interface TaskType {
  id: number;
  task_type: string;
}

export const getStatuses = async (): Promise<Status[]> => {
  const res = await fetch(`${BASE_URL}/master-status/`);
  return res.json();
};

export const getTaskTypes = async (): Promise<TaskType[]> => {
  const res = await fetch(`${BASE_URL}/master-task-type/`);
  return res.json();
};
