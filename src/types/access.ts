export type Module = {
  id: number;
  module_name: string;
  is_active: boolean;
};

export type Screen = {
  id: number; // ✅ sub_module_id
  module_id: number;
  screen_name: string; // ✅ sub_module_name mapped into this
  is_active: boolean;
};

export type Permission = {
  id: number;
  role_id: number;
  module_id: number;
  screen_id: number | null; // ✅ sub_module_id mapped into this
  can_access: boolean;
  can_view: boolean;
  can_edit: boolean;
  can_delete: boolean;
  can_update: boolean;
  is_active: boolean;
};
