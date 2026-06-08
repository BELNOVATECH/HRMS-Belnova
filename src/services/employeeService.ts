const BASE_URL = "https://hrms-be-ppze.onrender.com";

export interface Employee {
  id: number;
  name: string;
  status: string;
}

export const getEmployees = async (token: string): Promise<Employee[]> => {
  const res = await fetch(`${BASE_URL}/employees/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const json = await res.json();
  return Array.isArray(json) ? json : json?.data || [];
};
