import { useEffect, useState } from "react";
import {
  Card,
  Button,
  Input,
  message,
  Form,
} from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import "./Config.css";
import { Row, Col } from "antd";

import { updateInterviewStageStatus } from "../../services/CandidateService";

import {
  createDepartment,
  getDepartments,
  updateDepartmentStatus,
  createInterviewStage,
  getInterviewStages,

  getDesignations,
  createDesignation,
  updateDesignationStatus,
  getRoles,
  createRole,
  updateRoleStatus,

  getProjects,
  createProject,
  updateProjectStatus,

  getProjectModules,
  createProjectModule,
  updateProjectModuleStatus
} from "../../services/CandidateService";
import { Tabs } from "antd";


export default function ConfigPage() {
  const [designationForm] = Form.useForm();
  const [stageForm] = Form.useForm();
  const [deptForm] = Form.useForm();

  /* ================= DESIGNATIONS ================= */
  const [designations, setDesignations] = useState<
    {
      dept_id: number; id: number; designation_name: string; is_active: boolean
    }[]
  >([]);

  const [designationFilter, setDesignationFilter] =
    useState<"active" | "inactive">("active");

  /* ================= INTERVIEW STAGES ================= */
  const [stages, setStages] = useState<
    { id: number; stage_name: string; is_active: boolean }[]
  >([]);
  const [stageFilter, setStageFilter] =
  useState<"active" | "inactive">("active");


  /* ================= DEPARTMENTS ================= */

  const [departments, setDepartments] = useState<
    { id: number; department: string; is_active: boolean }[]
  >([]);

  const [deptFilter, setDeptFilter] =
    useState<"active" | "inactive">("active");
  /* ================= ROLES ================= */
  const [roles, setRoles] = useState<
    { id: number; role_name: string; is_active: boolean }[]
  >([]);

  const [roleFilter, setRoleFilter] =
    useState<"active" | "inactive">("active");

  const [roleForm] = Form.useForm();


  /* ================= PROJECTS ================= */
  const [projects, setProjects] = useState<
    { id: number; project_name: string; is_active: boolean }[]
  >([]);

  const [projectFilter, setProjectFilter] =
    useState<"active" | "inactive">("active");

  const [projectForm] = Form.useForm();

  /* ================= PROJECT MODULES ================= */
  const [projectModules, setProjectModules] = useState<
    {
      id: number;
      project_module: string;
      project_id: number;
      is_active: boolean;
    }[]
  >([]);

  const [moduleFilter, setModuleFilter] =
    useState<"active" | "inactive">("active");

  const [moduleForm] = Form.useForm();


  useEffect(() => {
    fetchAll();
  }, []);

  /* ================= FETCH ================= */
  const fetchAll = async () => {
    try {
      const desRes = await getDesignations();
      setDesignations(Array.isArray(desRes.data) ? desRes.data : []);
    } catch (e) {
      console.error("Designations failed", e);
      message.error("Failed to load designations");
    }

    try {
      const stageRes = await getInterviewStages();
      setStages(Array.isArray(stageRes.data) ? stageRes.data : []);
    } catch (e) {
      console.error("Stages failed", e);
      message.error("Failed to load interview stages");
    }

    try {
      const deptRes = await getDepartments();
      setDepartments(Array.isArray(deptRes.data) ? deptRes.data : []);
    } catch (e) {
      console.error("Departments failed", e);
      message.error("Failed to load departments");
    }

    try {
      const roleRes = await getRoles();
      setRoles(Array.isArray(roleRes.data) ? roleRes.data : []);
    } catch (e) {
      console.error("Roles failed", e);
      message.error("Failed to load roles");
    }



    try {
      const projRes = await getProjects();
      setProjects(Array.isArray(projRes.data) ? projRes.data : []);
    } catch (e) {
      console.error("Projects failed", e);
      message.error("Failed to load projects");
    }

    try {
      const modRes = await getProjectModules();
      setProjectModules(Array.isArray(modRes.data) ? modRes.data : []);
    } catch (e) {
      console.error("Project modules failed", e);
      message.error("Failed to load project modules");
    }

  };


  /* ================= DESIGNATIONS ================= */
  const addDesignation = async (values: {
    designation_name: string;
    dept_id: number;
  }) => {
    try {
      await createDesignation({
        designation_name: values.designation_name.trim(),
        dept_id: values.dept_id, // ✅ selected department
      });

      designationForm.resetFields();
      fetchAll();
      message.success("Designation added");
    } catch (e: any) {
      console.error(e?.response?.data || e);
      message.error("Failed to add designation");
    }
  };



  const toggleDesignationStatus = async (id: number, status: boolean) => {
    try {
      await updateDesignationStatus(id, status);
      setDesignations((prev) =>
        prev.map((d) =>
          d.id === id ? { ...d, is_active: status } : d
        )
      );
    } catch {
      message.error("Failed to update designation");
    }
  };

  /* ================= INTERVIEW STAGES ================= */
const toggleStageStatus = async (id: number, status: boolean) => {
  try {
    await updateInterviewStageStatus(id, status);
    setStages((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, is_active: status } : s
      )
    );
    message.success("Interview stage updated");
  } catch {
    message.error("Failed to update interview stage");
  }
};

const addStage = async (values: { stage: string }) => {
  try {
    await createInterviewStage({
      stage_name: values.stage.trim(),
      description: "",
      is_active: true, 
    });
    stageForm.resetFields();
    fetchAll();
    message.success("Stage added");
  } catch {
    message.error("Failed to add stage");
  }
};





  /* ================= DEPARTMENTS ================= */
  const addDepartment = async (values: { department: string }) => {
    try {
      await createDepartment({
        department: values.department.trim(),
        is_active: false,
      });

      deptForm.resetFields();
      fetchAll();
    } catch {
      message.error("Failed to add department");
    }
  };

  const toggleDepartmentStatus = async (id: number, status: boolean) => {
    try {
      await updateDepartmentStatus(id, status);
      setDepartments((prev) =>
        prev.map((d) =>
          d.id === id ? { ...d, is_active: status } : d
        )
      );
    } catch {
      message.error("Failed to update department");
    }
  };


  /* ================= ROLES ================= */
  const addRole = async (values: { role_name: string }) => {
    try {
      await createRole({
        role_name: values.role_name.trim(),
        is_active: false,   // same logic as departments
      });

      roleForm.resetFields();
      fetchAll();
      message.success("Role added");
    } catch {
      message.error("Failed to add role");
    }
  };

  const toggleRoleStatus = async (id: number, status: boolean) => {
    try {
      await updateRoleStatus(id, status);
      setRoles((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, is_active: status } : r
        )
      );
    } catch {
      message.error("Failed to update role");
    }
  };



  /* ================= PROJECTS ================= */
  const addProject = async (values: { project_name: string }) => {
    try {
      await createProject({
        project_name: values.project_name.trim(),
        is_active: false, // same logic as roles/departments
      });

      projectForm.resetFields();
      fetchAll();
      message.success("Project added");
    } catch {
      message.error("Failed to add project");
    }
  };

  const toggleProjectStatus = async (id: number, status: boolean) => {
    try {
      await updateProjectStatus(id, status);
      setProjects((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, is_active: status } : p
        )
      );
    } catch {
      message.error("Failed to update project");
    }
  };

  /* ================= PROJECT MODULES ================= */
  const addProjectModule = async (values: {
    project_module: string;
    project_id: number;
  }) => {
    try {
      await createProjectModule({
        project_module: values.project_module.trim(),
        project_id: values.project_id,
        is_active: false, // same logic as others
      });

      moduleForm.resetFields();
      fetchAll();
      message.success("Module added");
    } catch {
      message.error("Failed to add module");
    }
  };
  const toggleModuleStatus = async (id: number, status: boolean) => {
    try {
      await updateProjectModuleStatus(id, status);
      fetchAll();
      message.success("Module status updated");
    } catch {
      message.error("Failed to update module");
    }
  };





  return (
    <div className="config-wrapper">
      <div className="config-row">

        <Card title="Designations" className="config-card">
          <Form
            layout="vertical"
            form={designationForm}
            onFinish={addDesignation}
          >
            <Row gutter={12}>
              {/* Department */}
              <Col span={12}>
                <Form.Item
                  name="dept_id"
                  label="Department"
                  rules={[{ required: true, message: "Please select department" }]}
                >
                  <select className="ant-input">
                    <option value="">Select Department</option>
                    {departments
                      .filter((d) => d.is_active)
                      .map((dept) => (
                        <option key={dept.id} value={dept.id}>
                          {dept.department}
                        </option>
                      ))}
                  </select>
                </Form.Item>
              </Col>

              {/* Designation */}
              <Col span={12}>
                <Form.Item
                  name="designation_name"
                  label="Designation"
                  rules={[
                    { required: true, message: "Enter designation" },
                    {
                      pattern: /^[A-Za-z ]+$/,
                      message: "Designation should contain only letters",
                    },
                  ]}
                >
                  <Input placeholder="Add Designation" />
                </Form.Item>

              </Col>
            </Row>

            <Button type="primary" htmlType="submit" icon={<PlusOutlined />}>
              Save
            </Button>
          </Form>


          <Tabs
            activeKey={designationFilter}
            onChange={(key) =>
              setDesignationFilter(key as "active" | "inactive")
            }
            items={[
              { key: "active", label: "Active" },
              { key: "inactive", label: "Inactive" },
            ]}
          />

          <div className="list-content">
            {designations
              .filter((d) =>
                designationFilter === "active" ? d.is_active : !d.is_active
              )
              .map((d) => {
                const dept = departments.find(
                  (dep) => dep.id === d.dept_id
                );

                return (
                  <div key={d.id} className="list-row">
                    <div>
                      <strong>{d.designation_name}</strong>
                      <div style={{ fontSize: 12, color: "#777" }}>
                        {dept?.department || "—"}
                      </div>
                    </div>

                    {d.is_active ? (
                      <CloseCircleOutlined
                        onClick={() =>
                          toggleDesignationStatus(d.id, false)
                        }
                        style={{ color: "red", cursor: "pointer" }}
                      />
                    ) : (
                      <CheckCircleOutlined
                        onClick={() =>
                          toggleDesignationStatus(d.id, true)
                        }
                        style={{ color: "green", cursor: "pointer" }}
                      />
                    )}
                  </div>
                );
              })}
          </div>
        </Card>


        {/* ================= INTERVIEW STAGES ================= */}
 
<Card title="Interview Stages" className="config-card">
  <Form layout="inline" form={stageForm} onFinish={addStage}>
    <Form.Item
      name="stage"
      rules={[
        { required: true, message: "Enter stage name" },
        {
          pattern: /^[A-Za-z ]+$/,
          message: "Stage should contain only letters",
        },
      ]}
    >
      <Input placeholder="Add Stage" />
    </Form.Item>
    <Button type="primary" htmlType="submit">Save</Button>
  </Form>

  <Tabs
    activeKey={stageFilter}
    onChange={(key) =>
      setStageFilter(key as "active" | "inactive")
    }
    items={[
      { key: "active", label: "Active" },
      { key: "inactive", label: "Inactive" },
    ]}
  />

  <div className="list-content">
    {stages
      .filter((s) =>
        stageFilter === "active" ? s.is_active : !s.is_active
      )
      .map((s) => (
        <div key={s.id} className="list-row">
          <span>{s.stage_name}</span>

          {s.is_active ? (
            <CloseCircleOutlined
              onClick={() => toggleStageStatus(s.id, false)}
              style={{ color: "red", cursor: "pointer" }}
            />
          ) : (
            <CheckCircleOutlined
              onClick={() => toggleStageStatus(s.id, true)}
              style={{ color: "green", cursor: "pointer" }}
            />
          )}
        </div>
      ))}
  </div>
</Card>


       
       
      </div>


      <div className="config-row">
        {/* ================= DEPARTMENTS ================= */}
        <Card title="Departments" className="config-card-roles">
          <Form layout="inline" form={deptForm} onFinish={addDepartment}>
            <Form.Item
              name="department"
              rules={[
                { required: true, message: "Enter department" },
                {
                  pattern: /^[A-Za-z ]+$/,
                  message: "Department should contain only letters",
                },
              ]}
            >
              <Input placeholder="Add Department" />
            </Form.Item>

            <Button type="primary" htmlType="submit">Save</Button>
          </Form>

          <Tabs
            activeKey={deptFilter}
            onChange={(key) =>
              setDeptFilter(key as "active" | "inactive")
            }
            items={[
              { key: "active", label: "Active" },
              { key: "inactive", label: "Inactive" },
            ]}
          />

          <div className="list-content">
            {departments
              .filter((d) =>
                deptFilter === "active" ? d.is_active : !d.is_active
              )
              .map((d) => (
                <div key={d.id} className="list-row">
                  <span>{d.department}</span>
                  {d.is_active ? (
                    <CloseCircleOutlined
                      onClick={() => toggleDepartmentStatus(d.id, false)}
                      style={{ color: "red", cursor: "pointer" }}
                    />
                  ) : (
                    <CheckCircleOutlined
                      onClick={() => toggleDepartmentStatus(d.id, true)}
                      style={{ color: "green", cursor: "pointer" }}
                    />
                  )}
                </div>
              ))}
          </div>
        </Card>

        {/* ================= ROLES ================= */}
        <Card title="Roles" className="config-card-roles">
          <Form layout="inline" form={roleForm} onFinish={addRole}>
            <Form.Item
              name="role_name"
              rules={[
                { required: true, message: "Enter role" },
                {
                  pattern: /^[A-Za-z ]+$/,
                  message: "Role should contain only letters",
                },
              ]}
            >
              <Input placeholder="Add Role" />
            </Form.Item>

            <Button type="primary" htmlType="submit">Save</Button>
          </Form>

          <Tabs
            activeKey={roleFilter}
            onChange={(key) =>
              setRoleFilter(key as "active" | "inactive")
            }
            items={[
              { key: "active", label: "Active" },
              { key: "inactive", label: "Inactive" },
            ]}
          />

          <div className="list-content">
            {roles
              .filter((r) =>
                roleFilter === "active" ? r.is_active : !r.is_active
              )
              .map((r) => (
                <div key={r.id} className="list-row">
                  <span>{r.role_name}</span>
                  {r.is_active ? (
                    <CloseCircleOutlined
                      onClick={() => toggleRoleStatus(r.id, false)}
                      style={{ color: "red", cursor: "pointer" }}
                    />
                  ) : (
                    <CheckCircleOutlined
                      onClick={() => toggleRoleStatus(r.id, true)}
                      style={{ color: "green", cursor: "pointer" }}
                    />
                  )}
                </div>
              ))}
          </div>
        </Card>
      </div>




      <div className="config-row">
        <Card title="Projects" className="config-card-roles">
          <Form layout="inline" form={projectForm} onFinish={addProject}>
            <Form.Item
              name="project_name"
              rules={[
                { required: true, message: "Enter project name" },
                {
                  pattern: /^[A-Za-z ]+$/,
                  message: "Project name should contain only letters",
                },
              ]}
            >
              <Input placeholder="Add Project" />
            </Form.Item>

            <Button type="primary" htmlType="submit">
              Save
            </Button>
          </Form>

          <Tabs
            activeKey={projectFilter}
            onChange={(key) =>
              setProjectFilter(key as "active" | "inactive")
            }
            items={[
              { key: "active", label: "Active" },
              { key: "inactive", label: "Inactive" },
            ]}
          />

          <div className="list-content">
            {projects
              .filter((p) =>
                projectFilter === "active" ? p.is_active : !p.is_active
              )
              .map((p) => (
                <div key={p.id} className="list-row">
                  <span>{p.project_name}</span>
                  {p.is_active ? (
                    <CloseCircleOutlined
                      onClick={() => toggleProjectStatus(p.id, false)}
                      style={{ color: "red", cursor: "pointer" }}
                    />
                  ) : (
                    <CheckCircleOutlined
                      onClick={() => toggleProjectStatus(p.id, true)}
                      style={{ color: "green", cursor: "pointer" }}
                    />
                  )}
                </div>
              ))}
          </div>
        </Card>


        <Card title="Project Modules" className="config-card-roles">
          <Form layout="inline" form={moduleForm} onFinish={addProjectModule}>
            {/* Project Select */}
            <Form.Item
              name="project_id"
              rules={[{ required: true, message: "Select project" }]}
            >
              <select className="ant-input">
                <option value="">Select Project</option>
                {projects
                  .filter((p) => p.is_active)
                  .map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.project_name}
                    </option>
                  ))}
              </select>
            </Form.Item>

            {/* Module Name */}
            <Form.Item
              name="project_module"
              rules={[
                { required: true, message: "Enter module name" },
                {
                  pattern: /^[A-Za-z ]+$/,
                  message: "Module name should contain only letters",
                },
              ]}
            >
              <Input placeholder="Add Module" />
            </Form.Item>

            <Button type="primary" htmlType="submit">
              Save
            </Button>
          </Form>

          <Tabs
            activeKey={moduleFilter}
            onChange={(key) =>
              setModuleFilter(key as "active" | "inactive")
            }
            items={[
              { key: "active", label: "Active" },
              { key: "inactive", label: "Inactive" },
            ]}
          />

          <div className="list-content">
            {projectModules
              .filter((m) =>
                moduleFilter === "active" ? m.is_active : !m.is_active
              )
              .map((m) => {
                const project = projects.find(
                  (p) => p.id === m.project_id
                );

                return (
                  <div key={m.id} className="list-row">
                    <div>
                      <strong>{m.project_module}</strong>
                      <div style={{ fontSize: 12, color: "#777" }}>
                        {project?.project_name || "—"}
                      </div>
                    </div>

                    {m.is_active ? (
                      <CloseCircleOutlined
                        onClick={() =>
                          toggleModuleStatus(m.id, false)
                        }
                        style={{ color: "red", cursor: "pointer" }}
                      />
                    ) : (
                      <CheckCircleOutlined
                        onClick={() =>
                          toggleModuleStatus(m.id, true)
                        }
                        style={{ color: "green", cursor: "pointer" }}
                      />
                    )}
                  </div>
                );
              })}
          </div>
        </Card>

      </div>
    </div>
  );
}
