export type Permission = {
  module_name?: string;
  sub_module_name?: string;
  can_access?: boolean;
  can_view?: boolean;
  can_edit?: boolean;
  can_delete?: boolean;
  can_update?: boolean;
}

/* ================= GET PERMISSIONS ================= */

export const getPermissions = (): Permission[] => {
  try {
    const raw = localStorage.getItem("hrms-permissions");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

/* ================= HELPERS ================= */

const normalize = (str: string) =>
  (str || "")
    .toLowerCase()
    .trim()
    .replace(/[_\-]/g, " ")
    .replace(/\s+/g, " ");

/* ================= MAIN CHECK ================= */
/* 🔥 ONLY can_access CONTROLS VISIBILITY */

export const canAccessScreen = (name: string): boolean => {
  const permissions = getPermissions();
  const target = normalize(name);

  if (!permissions.length) return false;

  return permissions.some((p) => {
    // STRICT CHECK
    if (p.can_access !== true) return false;

    const moduleName = normalize(p.module_name || "");
    const subModuleName = normalize(p.sub_module_name || "");

    // Full admin override
    if (
      moduleName === "all" ||
      moduleName === "admin" ||
      moduleName === "super admin"
    ) {
      return true;
    }

    // Match module
    if (moduleName === target) return true;

    // Match submodule
    if (subModuleName === target) return true;

    return false;
  });
};
