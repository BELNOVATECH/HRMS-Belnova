import axios from "axios";
import React, { useState, useEffect } from "react";
import {
  Card,
  Button,
  Avatar,
  Select,
  Table,
  Tag,
  message,
  Spin,
} from "antd";
import { UserOutlined, PlusOutlined } from "@ant-design/icons";

import Sidebar from "../../components/sidebar/Sidebar";
import { useNavigate } from "react-router-dom";
import EmployeeFormModalHorizontal from "./EmployeeFormModalHorizontal";
import "./Employees.css";
const statusMap: Record<number, string> = {
  1: "Active",
  2: "Inactive",
  3: "On Leave",   // ✅ FIXED
  4: "Resigned",   // ✅ FIXED
};


const { Option } = Select;

/* ============================================
   EMPLOYEE INTERFACE
=============================================== */
export interface Employee {
  id?: number;
  employeeId: string;
  name: string;
  department_id?: number;
department_name?: string;

  role: string;
  phone: string;
  email: string;
  joinDate: string;
  status: string;
  salary: number;
}
/* ============================================
   EMPLOYEE DETAILS INTERFACE (FOR DETAILS PAGE)
=============================================== */
export interface EmployeeDetails {
  id: number;

  employeeId?: string;
  name?: string;
  email?: string;
  phone?: string;
  emergency_mobile?: string;

  date_of_birth?: string;
  gender?: string;
  marital_status?: string;
  blood_group?: string;

  present_address?: string;
  permanent_address?: string;

  joinDate?: string;
  probationEndDate?: string;
  status?: string;

  department?: string;
  designation?: string;
  employeeType?: string;
  workLocation?: string;
  shift?: string;
  manager?: string;
  role?: string;

  salary?: number;

  pan?: string;
  uan?: string;
  aadhaar?: string;
  bank_ac_no?: string;
  ifsc_code?: string;

  family_members: any[];

}


const API_URL = "https://belnova-hrms-be-tckt.onrender.com/employees";

const Employees: React.FC = () => {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);


  const [selectedDept, setSelectedDept] = useState("All");
  const [selectedITStatus, setSelectedITStatus] = useState("All");
  const [searchText, setSearchText] = useState("");


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] =
  useState<any>(undefined);   // ✅ FIX

  const [isTableView, setIsTableView] = useState(false);

  const [loading, setLoading] = useState(true); // 🔥 LOADER STATE

  /* ============================================
      GET EMPLOYEES
  ============================================ */
  const loadEmployees = async () => {
    try {
      setLoading(true);

      const response = await axios.get(API_URL);

     const formatted = response.data.map((e: any) => ({
  id: e.id,
  employeeId: e.emp_code || String(e.id),
  name: `${e.first_name} ${e.last_name}`,
  phone: e.mobile,
  email: e.email,
  joinDate: e.join_date,
  salary: e.salary || 0,
department_id: e.department_id,
department_name: e.department_name, // backend nunchi vasthe

  role: e.role_id === 2 ? "Employee" : "Other",

  status: e.status_name ?? statusMap[e.status_id] ?? "-",




}));
// ✅ ADD THIS SORT (NEW EMPLOYEE FIRST)
const sortedEmployees = [...formatted].sort(
  (a: any, b: any) => (b.id ?? 0) - (a.id ?? 0)
);

      setEmployees(sortedEmployees);
setFilteredEmployees(sortedEmployees);

    } catch (err) {
      console.error("GET API Error:", err);
      message.error("Failed to load employees");
    } finally {
      setLoading(false); // 🔥 STOP LOADER
    }
  };

 useEffect(() => {
  loadEmployees();

  // 🔥 KEEP RENDER AWAKE
  const interval = setInterval(() => {
    axios.get("https://belnova-hrms-be-tckt.onrender.com/employees")
      .catch(() => {});
  }, 4 * 60 * 1000); // every 4 minutes

  return () => clearInterval(interval);
}, []);

  useEffect(() => {
  const loadDepartments = async () => {
    try {
      const res = await axios.get(
        "https://belnova-hrms-be-tckt.onrender.com/departments/"
      );
      setDepartments(res.data.filter((d: any) => d.is_active));
    } catch (err) {
      message.error("Failed to load departments");
    }
  };

  loadDepartments();
}, []);


  /* ============================================
      FILTER
  ============================================ */
 useEffect(() => {
  let filtered = employees;

 if (selectedDept !== "All") {
  filtered = filtered.filter(
    (e) => Number(e.department_id) === Number(selectedDept)


  );
}


 if (selectedITStatus !== "All") {
  filtered = filtered.filter((e) => e.status === selectedITStatus);
}


  // 🔍 SEARCH (ONLY ADDITION)
  if (searchText) {
    filtered = filtered.filter((e) =>
      e.name.toLowerCase().includes(searchText.toLowerCase()) ||
      e.employeeId.toLowerCase().includes(searchText.toLowerCase()) ||
      e.phone.includes(searchText)
    );
  }

  setFilteredEmployees(filtered);
}, [employees, selectedDept, selectedITStatus, searchText]);


  const openAddModal = () => {
    setEditingEmployee(undefined);
    setIsModalOpen(true);
  };

const handleSaveEmployee = async (payload: any) => {
  try {
    if (payload.id) {

  

     await axios.put(`${API_URL}/${payload.id}`, payload);


  

      message.success("Employee updated successfully ✅");

    } else {

      await axios.post(`${API_URL}/employee`, payload);
      message.success("Employee added successfully ✅");

    }

    setIsModalOpen(false);
    setEditingEmployee(undefined);
    await loadEmployees();

  } catch (error) {
    message.error("Failed to save employee ❌");
  }
};



  /* ============================================
      TABLE COLUMNS
  ============================================ */
 const columns = [
  { title: "EMP ID", dataIndex: "employeeId", key: "employeeId" },
  { title: "Name", dataIndex: "name", key: "name" },
  {
  title: "Department",
  key: "department",
  render: (_: any, emp: any) =>
    emp.department_name ||
    departments.find((d) => d.id === emp.department_id)?.department ||
    "-"
},

  { title: "Role", dataIndex: "role", key: "role" },
  { title: "Phone", dataIndex: "phone", key: "phone" },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (status: string) => (
  <Tag
    color={
      status === "Active"
        ? "green"
        : status === "Resigned"
        ? "red"
        : "orange"
    }
  >
    {status}
  </Tag>
),

  },
  { title: "Join Date", dataIndex: "joinDate", key: "joinDate" },

  {
    title: "Action",
    key: "action",
    render: (_: any, emp: Employee) => (
      <>
        <Button
          type="link"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/employees/${emp.id}`, { state: emp });
          }}
        >
          View
        </Button>

     <Button
  type="link"
  onClick={async (e) => {
    e.stopPropagation();

   const res = await axios.get(`${API_URL}/${emp.id}`);
setEditingEmployee({
  ...res.data,
  id: emp.id,   // 🔥 ID MUST
});
setIsModalOpen(true);   

  }}
>
  Edit
</Button>


      </>
    ),
  },
];


  return (
    <div className="hrms-dashboard-container">
      <Sidebar />

      <div className="hrms-dashboard-main">
        <div className="employees-header">
          <h1>Employee Directory</h1>

          <div style={{ display: "flex", gap: 10 }}>

  {/* 🔍 SEARCH BAR */}
  <input
    type="text"
    placeholder="Search employee"
    value={searchText}
    onChange={(e) => setSearchText(e.target.value)}
    style={{
      width: 220,
      padding: "8px 12px",
      borderRadius: 6,
      border: "1px solid #ccc",
    }}
  />

  <Select
  value={selectedDept}
  onChange={(v) => setSelectedDept(v)}
  style={{ width: 220 }}
>
  <Option value="All">All Departments</Option>

  {departments.map((dept) => (
    <Option key={dept.id} value={dept.id}>
      {dept.department}
    </Option>
  ))}
</Select>


            {selectedDept !== "All" && (
              <Select
                value={selectedITStatus}
                onChange={(v) => setSelectedITStatus(v)}
                style={{ width: 150 }}
              >
                <Option value="All">All</Option>
                <Option value="Active">Active</Option>
                <Option value="Resigned">Resigned</Option>
                <Option value="On Leave">On Leave</Option>
              </Select>
            )}

            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={openAddModal}
            >
              Add Employee
            </Button>

            <Button onClick={() => setIsTableView(!isTableView)}>
              {isTableView ? "Card View" : "Grid View"}
            </Button>
          </div>
        </div>

        {/* 🔥 LOADER */}
        {loading ? (
          <div style={{ textAlign: "center", marginTop: 80 }}>
            <Spin size="large" />
          </div>
        ) : isTableView ? (
          <Table
            columns={columns}
            dataSource={filteredEmployees}
            rowKey="id"
            style={{ marginTop: 20 }}
          />
        ) : (
          <div className="employee-card-grid">
            {filteredEmployees.map((emp) => (
              <Card
                key={emp.id}
                hoverable
                className="employee-card"
                onClick={() =>
                  navigate(`/employees/${emp.id}`, { state: emp })
                }
              >
                <Avatar
                  size={80}
                  icon={<UserOutlined />}
                  className="employee-avatar"
                />
                <h3 className="employee-name">Name: {emp.name}</h3>
                <p className="employee-id">
                  <strong>EMP ID:</strong> {emp.employeeId}
                </p>
                <p className="employee-status">
                  <strong>Status:</strong> {emp.status}
                </p>
              </Card>
            ))}
          </div>
        )}
      </div>

     <EmployeeFormModalHorizontal
  isOpen={isModalOpen}
  onClose={() => {
    setIsModalOpen(false);
    setEditingEmployee(undefined); // 👈 IDHI ADD CHEYYALI
  }}
  employee={editingEmployee}
  onSave={handleSaveEmployee}
/>

    </div>
  );
};

export default Employees;
