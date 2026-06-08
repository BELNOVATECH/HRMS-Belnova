import axios from "axios";

export interface ProjectModule {
  id: number;
  project_module: string;
  project_id: number;
  is_active: boolean;
}

export const getProjectModules = async (
  token: string
): Promise<ProjectModule[]> => {
  const res = await axios.get(
    "https://hrms-be-ppze.onrender.com/master-project-module/",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};
