import React, { useEffect, useState } from "react";
import { Table, Button, Input, Modal, Select, Space } from "antd";
import Sidebar from "../../components/sidebar/Sidebar";
import "./Attendance.css";
import {
  getAttendance
} from "../../services/CandidateService";

const { Option } = Select;
interface EmployeeType {
  id: number;
  name: string;
  department: string;
  date: string;

  loginTime?: string;
  loginLocation?: string;

  logoutTime?: string;
  logoutLocation?: string;
}



const AttendanceManagement: React.FC = () => {
  const today = new Date().toISOString().slice(0, 10);

const [employees, setEmployees] = useState<EmployeeType[]>([]);

  const [filteredEmployees, setFilteredEmployees] = useState<EmployeeType[]>(employees);

  const [fromDate, setFromDate] = useState(today);
  const [toDate, setToDate] = useState(today);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmpId, setSelectedEmpId] = useState<number | null>(null);

  const [, setEmpSearch] = useState("");
  const [, setDeptSearch] = useState("");

  const [, setDepartments] = useState<string[]>([]);
  const [filteredDepartments, setFilteredDepartments] = useState<string[]>([]);

  const [liveTime, setLiveTime] = useState("00:00:00");
  const [liveLocation, setLiveLocation] = useState("Fetching location...");
  useEffect(() => {
  loadAttendance();
  
}, []);
useEffect(() => {
  console.log("Employees State:", employees);
}, [employees]);
const loadAttendance = async () => {
  try {
    const res = await getAttendance();

    console.log("Attendance API:", res.data);

    setEmployees(
      res.data.map((item: any) => ({
        id: item.emp_id,

        name: `Employee ${item.emp_id}`,
        department: "-",

        date: item.attendance_date,

        loginTime: item.check_in_time,
        loginLocation: "-",

        logoutTime: item.check_out_time,
        logoutLocation: "-",
      }))
    );
  } catch (error) {
    console.error("Attendance load failed", error);
  }
};


  // LIVE CLOCK
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, "0");
      const mm = String(now.getMinutes()).padStart(2, "0");
      const ss = String(now.getSeconds()).padStart(2, "0");
      setLiveTime(`${hh}:${mm}:${ss}`);
    }, 1000);

    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
  if (!navigator.geolocation) {
    setLiveLocation("Location not supported");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude } = position.coords;

      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
        );
        const data = await res.json();

        const place =
          data.address?.city ||
          data.address?.town ||
          data.address?.village ||
          data.address?.suburb ||
          "Unknown location";

        setLiveLocation(place);
      } catch (err) {
        setLiveLocation("Unable to fetch location");
      }
    },
    () => setLiveLocation("Permission denied")
  );
}, []);


  // INIT DEPARTMENTS
  useEffect(() => {
    const unique = Array.from(new Set(employees.map((e) => e.department)));
    setDepartments(unique);
    setFilteredDepartments(unique);
  }, [employees]);

  // AUTO FILTER TABLE WHEN DATE CHANGES
  // useEffect(() => {
  //   const filtered = employees.filter((e) => e.date >= fromDate && e.date <= toDate);
  //   setFilteredEmployees(filtered);
  // }, [fromDate, toDate, employees]);

  // OPEN MODAL
  const openAddAttendanceModal = () => {
    setSelectedEmpId(null);
    setEmpSearch("");
    setDeptSearch("");
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  // LOGIN
const handleModalLogin = () => {
  if (!selectedEmpId) return;

  setEmployees((prev) =>
    prev.map((e) =>
      e.id === selectedEmpId
        ? {
            ...e,
            loginTime: liveTime,
            loginLocation: liveLocation,
          }
        : e
    )
  );

  // ✅ close modal after login
  setTimeout(() => setIsModalOpen(false), 200);
};



  // LOGOUT 
const handleModalLogout = () => {
  if (!selectedEmpId) return;

  setEmployees((prev) =>
    prev.map((e) =>
      e.id === selectedEmpId
        ? {
            ...e,
            logoutTime: liveTime,
            logoutLocation: liveLocation,
          }
        : e
    )
  );

  setTimeout(() => setIsModalOpen(false), 250);
};


  // CHANGE DEPARTMENT
  const handleDeptChange = (dept: string) => {
    if (!selectedEmpId) return;

    setEmployees((prev) =>
      prev.map((e) =>
        e.id === selectedEmpId ? { ...e, department: dept } : e
      )
    );
  };

  // EXPORT
  const exportData = () => {
    console.log("Exporting attendance data...");
  };

  // TABLE COLUMNS
  const columns = [
    { title: "Emp ID", dataIndex: "id", key: "id", width: 80 },
    { title: "Emp Name", dataIndex: "name", key: "name" },
    { title: "Department", dataIndex: "department", key: "department" },
    { title: "Date", dataIndex: "date", key: "date" },
  
{
  title: "Login Time",
  dataIndex: "loginTime",
  key: "loginTime",
  render: (t: string | undefined) => t || "-",
},
{
  title: "Login Location",
  dataIndex: "loginLocation",
  key: "loginLocation",
  render: (t: string | undefined) => t || "-",
},
{
  title: "Logout Time",
  dataIndex: "logoutTime",
  key: "logoutTime",
  render: (t: string | undefined) => t || "-",
},
{
  title: "Logout Location",
  dataIndex: "logoutLocation",
  key: "logoutLocation",
  render: (t: string | undefined) => t || "-",
},


  ];

  return (
    <div className="attendance-page-container">
      <Sidebar />

      <div className="attendance-content">

        {/* HEADER ROW */}
        <div className="attendance-header-row">

          <h2 className="att-title">Attendance Management</h2>

          {/* DATE PICKERS */}
          <div className="date-range-box">
            <Input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="date-input" />
            <Input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="date-input" />
          </div>

          {/* BUTTONS */}
          <div className="header-buttons">

            {/* Export button FIRST */}
            <Button className="export-btn" onClick={exportData}>
              Export
            </Button>

            {/* Add Attendance SECOND */}
            <Button type="primary" onClick={openAddAttendanceModal}>
              + Add Attendance
            </Button>
          </div>
        </div>

      <Table
  columns={columns}
  dataSource={employees}
  rowKey="id"
  pagination={false}
/>
      </div>

      {/* MODAL */}
      <Modal title="Add Attendance" open={isModalOpen} onCancel={closeModal} footer={null} width={560}>
        <div className="modal-grid">

          {/* EMPLOYEE SELECT */}
          <div className="modal-row">
            <label className="modal-label">Employee</label>
            <Select
              showSearch
              placeholder="Select employee"
              value={selectedEmpId ?? undefined}
              onSearch={(val) => setEmpSearch(val)}
              onChange={(val) => setSelectedEmpId(Number(val))}
              filterOption={false}
              style={{ width: "100%" }}
              allowClear
            >
              {employees.map((e) => (
                <Option key={e.id} value={e.id}>
                  {e.name}
                </Option>
              ))}
            </Select>
          </div>

          {/* DEPARTMENT SELECT */}
          <div className="modal-row">
            <label className="modal-label">Department</label>
            <Select
              showSearch
              placeholder="Select department"
              value={
                selectedEmpId
                  ? employees.find((x) => x.id === selectedEmpId)?.department
                  : undefined
              }
              onSearch={(val) => setDeptSearch(val)}
              onChange={(val) => handleDeptChange(val)}
              filterOption={false}
              style={{ width: "100%" }}
              allowClear
            >
              {filteredDepartments.map((d) => (
                <Option key={d} value={d}>
                  {d}
                </Option>
              ))}
            </Select>
          </div>

          {/* TIME STAMP */}
          <div className="modal-row">
            <label className="modal-label">Time Stamp</label>
            <Input value={liveTime} disabled />
          </div>
{/* LOCATION */}
<div className="modal-row">
  <label className="modal-label">Location</label>
  <Input value={liveLocation} disabled />
</div>

          {/* BUTTONS */}
          <div className="modal-actions">
            <Space>
<Button
  onClick={handleModalLogin}
  style={{ background: "#1a73ff", color: "#fff" }}
  disabled={
    !selectedEmpId ||
    !!employees.find((e) => e.id === selectedEmpId)?.loginTime
  }
>
  Login
</Button>



            <Button
  onClick={handleModalLogout}
  style={{ background: "#ff4d4f", color: "#fff" }}
  disabled={
    !selectedEmpId ||
    !employees.find((e) => e.id === selectedEmpId)?.loginTime
  }
>
  Logout
</Button>

            </Space>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AttendanceManagement;