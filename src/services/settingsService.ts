import api from "./api";

export const getEmployeesList = async () => {
  const res = await api.get("/employees/");
  return res.data;
};
