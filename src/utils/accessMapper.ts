import { Module, Screen, Permission } from "../types/access";

/* ================= BACKEND → FRONTEND ================= */

export const mapModule = (m: any): Module => ({
  id: m.id ?? m.module_id ?? m.moduleId,
  module_name: m.module_name ?? m.moduleName ?? m.name,
  is_active: m.is_active ?? m.isActive ?? true,
});

// ✅ Backend Sub Module is treated as Screen in frontend
export const mapScreen = (s: any): Screen => ({
  id: s.id ?? s.sub_module_id ?? s.subModuleId ?? s.screen_id ?? s.screenId,
  module_id: s.module_id ?? s.moduleId,
  screen_name:
    s.sub_module_name ??
    s.subModuleName ??
    s.screen_name ??
    s.screenName ??
    s.name,
  is_active: s.is_active ?? s.isActive ?? true,
});

export const mapPermission = (p: any): Permission => ({
  id: p.id ?? p.permission_id ?? p.permissionId,
  role_id: p.role_id ?? p.roleId,
  module_id: p.module_id ?? p.moduleId,

  // ✅ backend sub_module_id OR screen_id
  screen_id:
    p.sub_module_id ??
    p.subModuleId ??
    p.screen_id ??
    p.screenId ??
    null,

  can_access: p.can_access ?? p.canAccess ?? false,
  can_view: p.can_view ?? p.canView ?? false,
  can_edit: p.can_edit ?? p.canEdit ?? false,
  can_delete: p.can_delete ?? p.canDelete ?? false,
  can_update: p.can_update ?? p.canUpdate ?? false,
  is_active: p.is_active ?? p.isActive ?? true,
});

/* ================= FRONTEND → BACKEND ================= */
/* ✅ bulk save expects sub_module_id */

export const toBackendPermission = (p: Permission) => ({
  id: p.id,
  role_id: p.role_id,
  module_id: p.module_id,

  // ✅ send as sub_module_id
  sub_module_id: p.screen_id,

  can_access: p.can_access,
  can_view: p.can_view,
  can_edit: p.can_edit,
  can_delete: p.can_delete,
  can_update: p.can_update,
  is_active: p.is_active,
});

/* =========================================================
   BACKEND PERMISSIONS → FRONTEND PERMISSIONS (ID → NAME)
   🔥 This fixes module-only display issue
========================================================= */

export const mapBackendPermissions = (
  backendPermissions: any[],
  modules: Module[],
  screens: Screen[]
) => {
  return backendPermissions
    .filter(
      (p) =>
        p.is_active === true &&
        p.can_access === true
    )
    .map((p) => {
      const module = modules.find((m) => m.id === p.module_id);

      let subModuleName = "";

      if (p.sub_module_id) {
        const screen = screens.find(
          (s) => s.id === p.sub_module_id
        );
        subModuleName = screen?.screen_name || "";
      }

      return {
        module_name: module?.module_name || "",
        sub_module_name: subModuleName,
        can_access: true,
        can_view: p.can_view ?? false,
        can_edit: p.can_edit ?? false,
        can_delete: p.can_delete ?? false,
        can_update: p.can_update ?? false,
      };
    });
};

