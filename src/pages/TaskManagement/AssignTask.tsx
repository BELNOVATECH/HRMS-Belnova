import React, { useEffect, useRef, useState } from "react";
import { EditOutlined } from "@ant-design/icons";
import {
  Table,
  Card,
  Button,
  Tag,
  message,
  Select,
  Input,
  Space,
  Modal,
  Form,
    Spin,   // ✅ ADD THIS

  DatePicker,
  Tooltip,
} from "antd";
import Sidebar from "../../components/sidebar/Sidebar";
import "./Taskmanagement.css";

import dayjs from "dayjs";

const { Option } = Select;
// ✅ TASK STATUS MASTER MAP (BACKEND → UI)
const TASK_STATUS_MAP: Record<number, string> = {
  1: "Pending",
  11: "Pending",

  2: "In Progress",

  3: "Completed",
  12: "Completed",

  7: "Assigned",

  13: "Cancelled",   // ✅ FIX
  14: "QA",          // ✅ FIX
};



const BASE_URL = "https://hrms-be-ppze.onrender.com";

/* ✅ Employees API type */
interface ApiEmployee {
  id: number;
  name: string;
  managerId?: number | null;
  managerName?: string;
}
/* ✅ Projects API type */
interface ApiProject {
  id: number;
  name: string;
}

/* ✅ Tasks EXACT backend type */
interface TaskRowType {
  project_module_id: number;
  id: number;
  title: string;
  description: string;

  task_type_id: number;
  project_id: number;

  emp_id: number;
  reporting_manager_id: number;
  task_manager_id: number;

  status_id: number;
  due_date: string;

  efforts_in_days: number;
  is_active: boolean;
}

const TaskManagement: React.FC = () => {
  const tableRef = useRef<HTMLDivElement | null>(null);

  const [employeeList, setEmployeeList] = useState<ApiEmployee[]>([]);
  const [projectList, setProjectList] = useState<ApiProject[]>([]);

  const [taskRows, setTaskRows] = useState<TaskRowType[]>([]);
const [loading, setLoading] = useState(true); // ✅ ADD LOADER STATE

  // ✅ Edit Modal state
  const [editOpen, setEditOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<TaskRowType | null>(null);
  const [editForm] = Form.useForm();

  // ✅ Search filter
  const filterDropDown = (input: string, option?: any) =>
    option?.children?.toLowerCase().includes(input.toLowerCase());

  // ✅ GET Employees
  const fetchEmployees = async () => {
    try {
      const res = await fetch(`${BASE_URL}/employees/`);
      if (!res.ok) throw new Error("Failed to fetch employees");

      const json = await res.json();

      const rawEmployees = Array.isArray(json)
        ? json
        : json?.data || json?.employees || [];

      // ✅ Step 1: Basic mapping
      const mapped = rawEmployees.map((emp: any) => ({
        id: emp.id,
        name: `${emp.first_name || ""} ${emp.last_name || ""}`.trim() || "Unknown",
        managerId: emp.manager_id,
      }));

      // ✅ Step 2: Attach managerName from managerId lookup
      const finalEmployees = mapped.map((emp: any) => {
        const managerObj = mapped.find((m: any) => m.id === emp.managerId);

        return {
          id: emp.id,
          name: emp.name,
          managerId: emp.managerId,
          managerName: managerObj ? managerObj.name : "No Manager",
        };
      });

      setEmployeeList(finalEmployees);
    } catch (err) {
      console.error(err);
      message.error("Unable to load employees from server");
    }
  };
const fetchProjects = async () => {
  try {
    const token = localStorage.getItem("hrms-token");

    const res = await fetch(`${BASE_URL}/projects/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("Failed to fetch projects");

    const json = await res.json();

    const rawProjects = Array.isArray(json)
      ? json
      : json?.data || json?.projects || [];

    const mappedProjects = rawProjects.map((p: any) => ({
      id: p.id,
      name: p.name || p.project_name || "Unknown Project",
    }));

    setProjectList(mappedProjects);
  } catch (err) {
    console.error(err);
    message.error("Unable to load projects from server");
  }
};


  // ✅ GET All Tasks
  const fetchTasks = async () => {
    try {
      const res = await fetch(`${BASE_URL}/tasks/`);
      if (!res.ok) throw new Error("Failed to fetch tasks");

      const json = await res.json();

      const tasks: TaskRowType[] = Array.isArray(json)
        ? json
        : json?.data || json?.tasks || [];

setTaskRows(
  tasks.map((t: any) => ({
    ...t,
    status_id: Number(t.status_id),
  }))
);
    } catch (err) {
      console.error(err);
      message.error("Unable to load tasks from server");
    }
  };

  // ✅ PUT Update FULL task
 

  // ✅ PUT Update status only
const updateTask = async (taskId: number, payload: any) => {
const token = localStorage.getItem("hrms-token");


  const res = await fetch(`${BASE_URL}/tasks/${taskId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // ✅ REQUIRED
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.log("UpdateTask Error:", errText);
    throw new Error("Failed to update task");
  }

  return res.json();
};

const updateTaskStatus = async (taskId: number, status_id: number) => {
const token = localStorage.getItem("hrms-token");

  const res = await fetch(`${BASE_URL}/tasks/${taskId}/status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // ✅ REQUIRED
    },
    body: JSON.stringify({ status_id }),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.log("UpdateStatus Error:", errText);
    throw new Error("Failed to update status");
  }
  return res.json();
};



 useEffect(() => {
  const loadData = async () => {
    setLoading(true); // ✅ loader start
await Promise.all([fetchEmployees(), fetchProjects(), fetchTasks()]);
    setLoading(false); // ✅ loader stop
  };

  loadData();
}, []);


  // ✅ OPEN EDIT MODAL
  const openEditModal = (row: TaskRowType) => {
    setEditingRow(row);

editForm.setFieldsValue({
  emp_id: row.emp_id,
  project_id: row.project_id, // ✅ ADD THIS
  reporting_manager_id: row.reporting_manager_id,
  task_manager_id: row.task_manager_id,
  title: row.title,
  description: row.description,
  efforts_in_days: row.efforts_in_days,
  status_id: row.status_id,
  due_date: row.due_date ? dayjs(row.due_date) : null,
  is_active: row.is_active,
});


    setEditOpen(true);
  };

  // ✅ SAVE EDIT MODAL (PUT)
const handleSaveEdit = async () => {
  try {
    const values = await editForm.validateFields();
    if (!editingRow) return;
const payload = {
  title: values.title,
  description: values.description,

  task_type_id: editingRow.task_type_id,
  project_id: values.project_id,
  project_module_id: editingRow.project_module_id ?? 0,

  reporting_manager_id: values.reporting_manager_id,
  task_manager_id: values.task_manager_id,

  status_id: values.status_id,
  due_date: values.due_date
    ? dayjs(values.due_date).format("YYYY-MM-DD")
    : editingRow.due_date,

  efforts_in_days: Number(values.efforts_in_days),
  comment: "", // optional
};





    await updateTask(editingRow.id, payload);

    // ✅ UPDATE UI IMMEDIATELY
    setTaskRows((prev) =>
      prev.map((t) => (t.id === editingRow.id ? { ...t, ...payload } : t))
    );

    message.success("Task updated successfully ✅");
    setEditOpen(false);
    setEditingRow(null);
    editForm.resetFields();

    // ✅ Optional refresh
    // fetchTasks();

  } catch (err) {
    console.error(err);
    message.error("Update failed ❌");
  }
};

  // ✅ Table columns (EXACT backend)
  const columns = [
    {
      title: "Employee Name",
      key: "emp_id",
      width: 80,
      render: (_: any, row: TaskRowType) => (
        <Select
          style={{ width: "100%" }}
          value={row.emp_id}
          placeholder="Select Employee"
          showSearch
          filterOption={filterDropDown}
         onChange={async (empId) => {
  const selectedEmp = employeeList.find((e) => e.id === empId);

  const updatedRow = {
    ...row,
    emp_id: empId,
    reporting_manager_id: selectedEmp?.managerId || 0,
    task_manager_id: selectedEmp?.managerId || 0,
  };

  // ✅ update UI first
  setTaskRows((prev) =>
    prev.map((r) => (r.id === row.id ? updatedRow : r))
  );

  // ✅ update backend also
  try {
    await updateTask(row.id, updatedRow);
    message.success("Employee Updated ✅");
  } catch (err) {
    console.error(err);
    message.error("Failed to update employee ❌");

    // rollback UI if API fails
    setTaskRows((prev) =>
      prev.map((r) => (r.id === row.id ? row : r))
    );
  }
}}

        >
          {employeeList.map((emp) => (
            <Option key={emp.id} value={emp.id}>
              {emp.name}
            </Option>
          ))}
        </Select>
      ),
    },
{
  title: "Project Name",
  key: "project_id",
  width: 80,
  render: (_: any, row: TaskRowType) => {
    const project = projectList.find((p) => p.id === row.project_id);

    return project ? (
<Tag style={{ background: "transparent", border: "none", color: "black", fontWeight: 400 }}>
  {project.name}
</Tag>

    ) : (
      <Tag color="red">Unknown</Tag>
    );
  },
},

    {
      title: "Reporting Manager",
      key: "reporting_manager_id",
      width: 110,
      render: (_: any, row: TaskRowType) => {
        const manager = employeeList.find(
          (e) => e.id === row.reporting_manager_id
        );

        return manager ? (
<Tag style={{ background: "transparent", border: "none", color: "black",fontWeight: 400 }}>
  {manager.name}
</Tag>
        ) : (
          <Tag color="red">No Manager</Tag>
        );
      },
    },

    {
      title: "Task Title",
      dataIndex: "title",
      key: "title",
      width: 130,
      render: (val: string) => <Tag style={{ background: "transparent", border: "none", color: "black",fontWeight: 400 }}>
  {val || "N/A"}
</Tag>

    },
{
  title: "Task Description",
  dataIndex: "description",
  key: "description",
  width: 160,              // keep fixed
  ellipsis: true,          // AntD ellipsis
  render: (text: string) => {
    if (!text) return "-";

    return (
      <Tooltip
        title={text}
        placement="topLeft"
        overlayStyle={{ maxWidth: 400 }} // tooltip only
      >
        <div className="task-desc-cell">
          {text}
        </div>
      </Tooltip>
    );
  },
},

{
  title: "Efforts (Days)",
  key: "efforts_in_days",
  width: 80,
  render: (_: any, row: TaskRowType) => (
    <span
      style={{
        display: "block",
        textAlign: "center",
      }}
    >
      {row.efforts_in_days ?? "-"}
    </span>
  ),
},


{
  title: "Task Status",
  key: "status_id",
  width: 90,   // ✅ reduced
  render: (_: any, row: TaskRowType) => {
    const statusLabel = TASK_STATUS_MAP[row.status_id] || "Unknown";
    return <span>{statusLabel}</span>;
  },
},






    
    {
      title: "Due Date",
      dataIndex: "due_date",
      key: "due_date",
      width: 60,
      // render: (val: string) => <Tag>{val}</Tag>,
    },


{
  title: "Actions",
  key: "actions",
  width: 80, // also reduce column width
  render: (_: any, row: TaskRowType) => (
    <Space size={4}>
      <Button
        size="small"
        icon={<EditOutlined />}
        onClick={() => openEditModal(row)}
      />

      <Button
        size="small"
        type="primary"
        style={
          row.is_active
            ? { backgroundColor: "green", color: "white", border: "none" }
            : {}
        }
        disabled={!row.emp_id || row.is_active}
        onClick={async () => {
          try {
            const payload = { ...row, is_active: true };
            await updateTask(row.id, payload);

            setTaskRows((prev) =>
              prev.map((r) =>
                r.id === row.id ? { ...r, is_active: true } : r
              )
            );

            message.success("✅ Task Assigned Successfully");
          } catch {
            message.error("❌ Failed to assign task");
          }
        }}
      >
        {row.is_active ? "Assigned" : "Assign"}
      </Button>
    </Space>
  ),
}


  ];

  return (
    <div className="attendance-container">
      <Sidebar />

      <div className="attendance-main">
        <div className="attendance-header">
          <h2 className="main-title">Assign Task</h2>
        </div>

   <Card className="table-card">
<div className="table-outer-scroll">
  <div className="table-scroll-wrapper" ref={tableRef}>

    {loading ? (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" />
      </div>
      
    ) : (
<Table
  columns={columns}
  dataSource={taskRows}
  rowKey="id"
  pagination={false}
  tableLayout="fixed"   // ✅ REQUIRED
  scroll={{ x: 1400 }}  // ✅ REQUIRED
/>



    )}

  </div>
  </div>
</Card>

      </div>

      {/* ✅ EDIT MODAL */}
      <Modal
        title="Edit Task"
        open={editOpen}
        onCancel={() => {
          setEditOpen(false);
          setEditingRow(null);
          editForm.resetFields();
        }}
        onOk={handleSaveEdit}
        okText="Update"
      >
        <Form form={editForm} layout="vertical">
        <Form.Item
  label="Employee"
  name="emp_id"
  rules={[{ required: true, message: "Select Employee" }]}
>
  <Select
    showSearch
    filterOption={filterDropDown}
    onChange={(empId) => {
      const selectedEmp = employeeList.find((e) => e.id === empId);

      editForm.setFieldsValue({
        reporting_manager_id: selectedEmp?.managerId || 0,
        task_manager_id: selectedEmp?.managerId || 0,
      });
    }}
  >
    {employeeList.map((emp) => (
      <Option key={emp.id} value={emp.id}>
        {emp.name}
      </Option>
    ))}
  </Select>
</Form.Item>

<Form.Item
  label="Project Name"
  name="project_id"
  rules={[{ required: true, message: "Select Project" }]}
>
  <Select
    showSearch
    placeholder="Select Project"
    optionFilterProp="children"
    filterOption={filterDropDown}
  >
    {projectList.map((proj) => (
      <Option key={proj.id} value={proj.id}>
        {proj.name}
      </Option>
    ))}
  </Select>
</Form.Item>

          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: "Enter Title" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Enter Description" }]}
          >
            <Input />
          </Form.Item>
          

          <Form.Item
            label="Efforts (Days)"
            name="efforts_in_days"
            rules={[{ required: true, message: "Enter Effort Days" }]}
          >
            <Input type="number" min={1} />
          </Form.Item>

       <Form.Item
  label="Task Status"
  name="status_id"
  rules={[{ required: true, message: "Select Status" }]}
>
  <Select>
    {Object.entries(TASK_STATUS_MAP).map(([id, label]) => (
      <Option key={id} value={Number(id)}>
        {label}
      </Option>
    ))}
  </Select>
</Form.Item>


          <Form.Item
            label="Due Date"
            name="due_date"
            rules={[{ required: true, message: "Select Due Date" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          {/* <Form.Item label="Active" name="is_active" valuePropName="checked">
            <Select>
              <Option value={true}>Active</Option>
              <Option value={false}>Inactive</Option>
            </Select>
          </Form.Item> */}
          <Form.Item name="reporting_manager_id" hidden>
  <Input />
</Form.Item>

<Form.Item name="task_manager_id" hidden>
  <Input />
</Form.Item>

        </Form>
      </Modal>
    </div>
  );
};

export default TaskManagement;
