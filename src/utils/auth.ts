export const getToken = () => localStorage.getItem("hrms-token");

export const getUser = () => {
  try {
    const raw = localStorage.getItem("hrms-user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const logout = () => {
  localStorage.removeItem("hrms-token");
  localStorage.removeItem("hrms-user");
  localStorage.removeItem("hrms-permissions");
};
