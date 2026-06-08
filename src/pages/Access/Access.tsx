import React, { useEffect, useState } from "react";
import {
  Table,
  Select,
  Card,
  Typography,
  Button,
  message,
  Checkbox,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { Module, Screen, Permission } from "../../types/access";
import { getRoles, Role } from "../../services/roleService";
import {
  getModules,
  getScreens,
  getPermissions,
  bulkCreatePermissions,
  bulkUpdatePermissions,
} from "../../services/accessService";

import "./Access.css";

const { Title } = Typography;
const { Option } = Select;

interface AccessRow {
  key: string;
  role_id: number;
  role: string;
  module_ids: number[];
  screen_ids: number[];
  can_access: boolean;
  can_view: boolean;
  can_edit: boolean;
  can_delete: boolean;
  can_update: boolean;
  is_active: boolean;
}

const Access: React.FC = () => {
  const [modules, setModules] = useState<Module[]>([]);
  const [screens, setScreens] = useState<Screen[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [rows, setRows] = useState<AccessRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [modulesRes, screensRes, permissionsRes, rolesRes] =
        await Promise.all([
          getModules(),
          getScreens(),
          getPermissions(),
          getRoles(),
        ]);

      const activeScreens = screensRes.filter((s) => s.is_active);
      const validScreenIds = new Set(activeScreens.map((s) => s.id));

      setModules(modulesRes);
      setScreens(activeScreens);
      setRoles(rolesRes);

      const mapped: AccessRow[] = rolesRes
        .filter((r) => r.is_active)
        .map((role) => {
          const perms = permissionsRes.filter(
            (p) => p.role_id === role.id && p.is_active
          );

          const moduleOnlyIds = perms
            .filter((p) => p.screen_id === null)
            .map((p) => p.module_id);

          const screenModuleIds = perms
            .filter((p) => p.screen_id !== null)
            .map((p) => p.module_id);

          const module_ids = Array.from(
            new Set([...moduleOnlyIds, ...screenModuleIds])
          );

          const screen_ids = perms
            .map((p) => p.screen_id)
            .filter(
              (id): id is number =>
                id !== null && validScreenIds.has(id)
            );

          const first = perms[0];

          return {
            key: String(role.id),
            role_id: role.id,
            role: role.role_name,
            module_ids,
            screen_ids,
            can_access: first?.can_access ?? false,
            can_view: first?.can_view ?? false,
            can_edit: first?.can_edit ?? false,
            can_delete: first?.can_delete ?? false,
            can_update: first?.can_update ?? false,
            is_active: first?.is_active ?? true,
          };
        });

      setRows(mapped);
    } catch (e) {
      console.error(e);
      message.error("Failed to load access data");
    } finally {
      setLoading(false);
    }
  };

  const updateRow = (key: string, patch: Partial<AccessRow>) => {
    setRows((prev) =>
      prev.map((r) => (r.key === key ? { ...r, ...patch } : r))
    );
  };

  const screensByModules = (moduleIds: number[]) =>
    screens.filter(
      (s) => s.is_active && moduleIds.includes(s.module_id)
    );

  const saveRow = async (row: AccessRow) => {
    try {
      const allPermissions = await getPermissions();
      const existing = allPermissions.filter(
        (p) => p.role_id === row.role_id
      );

      const toCreate: Permission[] = [];
      const toUpdate: Permission[] = [];

      const activeKeys = new Set([
        ...row.module_ids.map((m) => `M-${m}`),
        ...row.screen_ids.map((s) => `S-${s}`),
      ]);

      // 🔥 FIXED UPDATE LOGIC
      for (const p of existing) {
        const key =
          p.screen_id === null
            ? `M-${p.module_id}`
            : `S-${p.screen_id}`;

        const isSelected = activeKeys.has(key);

        toUpdate.push({
          ...p,
          is_active: isSelected,
          can_access: isSelected ? row.can_access : false,
          can_view: isSelected ? row.can_view : false,
          can_edit: isSelected ? row.can_edit : false,
          can_delete: isSelected ? row.can_delete : false,
          can_update: isSelected ? row.can_update : false,
        });
      }

      // CREATE NEW MODULE PERMISSIONS
      for (const moduleId of row.module_ids) {
        const exists = existing.some(
          (p) =>
            p.module_id === moduleId &&
            p.screen_id === null
        );

        if (!exists) {
          toCreate.push({
            id: 0,
            role_id: row.role_id,
            module_id: moduleId,
            screen_id: null,
            can_access: row.can_access,
            can_view: row.can_view,
            can_edit: row.can_edit,
            can_delete: row.can_delete,
            can_update: row.can_update,
            is_active: true,
          });
        }
      }

      // CREATE NEW SCREEN PERMISSIONS
      for (const screenId of row.screen_ids) {
        const screen = screens.find(
          (s) => s.id === screenId
        );
        if (!screen) continue;

        const exists = existing.some(
          (p) => p.screen_id === screenId
        );

        if (!exists) {
          toCreate.push({
            id: 0,
            role_id: row.role_id,
            module_id: screen.module_id,
            screen_id: screenId,
            can_access: row.can_access,
            can_view: row.can_view,
            can_edit: row.can_edit,
            can_delete: row.can_delete,
            can_update: row.can_update,
            is_active: true,
          });
        }
      }

      if (toCreate.length) {
        await bulkCreatePermissions(toCreate);
      }

      if (toUpdate.length) {
        await bulkUpdatePermissions(toUpdate);
      }

      message.success(`Access updated for ${row.role}`);
      loadAll();

      // 🔥 Notify sidebar
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: "hrms-permissions",
        })
      );
    } catch (e) {
      console.error(e);
      message.error("Failed to update access");
    }
  };

  const columns: ColumnsType<AccessRow> = [
    { title: "Role", dataIndex: "role", width: 140 },

    {
      title: "Modules",
      width: 220,
      render: (_, row) => (
        <Select
          mode="multiple"
          value={row.module_ids}
          style={{ width: "100%" }}
          onChange={(value) =>
            updateRow(row.key, {
              module_ids: value,
              screen_ids: row.screen_ids.filter((id) =>
                screens
                  .filter((s) =>
                    value.includes(s.module_id)
                  )
                  .map((s) => s.id)
                  .includes(id)
              ),
            })
          }
        >
          {modules.map((m) => (
            <Option key={m.id} value={m.id}>
              {m.module_name}
            </Option>
          ))}
        </Select>
      ),
    },

    {
      title: "Sub Modules",
      width: 240,
      render: (_, row) => {
        const availableScreens = screensByModules(
          row.module_ids
        );

        if (!availableScreens.length) {
          return (
            <span style={{ color: "#999" }}>
              No sub modules
            </span>
          );
        }

        return (
          <Select
            mode="multiple"
            value={row.screen_ids}
            style={{ width: "100%" }}
            onChange={(value) =>
              updateRow(row.key, {
                screen_ids: value,
              })
            }
          >
            {availableScreens.map((s) => (
              <Option key={s.id} value={s.id}>
                {s.screen_name}
              </Option>
            ))}
          </Select>
        );
      },
    },

    {
      title: "Access",
      render: (_, row) => (
        <Checkbox
          checked={row.can_access}
          onChange={(e) =>
            updateRow(row.key, {
              can_access: e.target.checked,
            })
          }
        />
      ),
    },

    {
      title: "View",
      render: (_, row) => (
        <Checkbox
          checked={row.can_view}
          onChange={(e) =>
            updateRow(row.key, {
              can_view: e.target.checked,
            })
          }
        />
      ),
    },

    {
      title: "Edit",
      render: (_, row) => (
        <Checkbox
          checked={row.can_edit}
          onChange={(e) =>
            updateRow(row.key, {
              can_edit: e.target.checked,
            })
          }
        />
      ),
    },

    {
      title: "Delete",
      render: (_, row) => (
        <Checkbox
          checked={row.can_delete}
          onChange={(e) =>
            updateRow(row.key, {
              can_delete: e.target.checked,
            })
          }
        />
      ),
    },

    {
      title: "Update",
      render: (_, row) => (
        <Checkbox
          checked={row.can_update}
          onChange={(e) =>
            updateRow(row.key, {
              can_update: e.target.checked,
            })
          }
        />
      ),
    },

    {
      title: "Active",
      render: (_, row) => (
        <Checkbox
          checked={row.is_active}
          onChange={(e) =>
            updateRow(row.key, {
              is_active: e.target.checked,
            })
          }
        />
      ),
    },

    {
      title: "Action",
      width: 100,
      render: (_, row) => (
        <Button
          size="small"
          type="primary"
          onClick={() => saveRow(row)}
        >
          Update
        </Button>
      ),
    },
  ];

  return (
    <div className="access-page">
      <Title level={3}>Access Management</Title>

      <Card>
        <Table
          bordered
          loading={loading}
          pagination={false}
          scroll={{ x: "max-content" }}
          columns={columns}
          dataSource={rows}
        />
      </Card>
    </div>
  );
};

export default Access;
