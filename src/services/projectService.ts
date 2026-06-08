import axios from "axios";

export interface Project {
  id: number;
  project_name: string;
  is_active: boolean;
}

export const getProjects = async (token: string): Promise<Project[]> => {
  const res = await axios.get(
    "https://hrms-be-ppze.onrender.com/projects/",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};
