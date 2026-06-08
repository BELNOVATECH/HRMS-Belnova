import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";

// HRMS Pages
import Dashboard from "../../pages/Dashboard/Dashboard";
import Employees from "../../pages/Employees/Employees";
import EmployeeDetails from "../../pages/Employees/EmployeeDetails";
import Attendance from "../../pages/AttendanceManagement/AttendanceManagement";
import LeaveManagement from "../../pages/LeaveManagement/LeaveManagement";
import Payroll from "../../pages/Payroll/Payroll";
import Performance from "../../pages/Performance/Performance";
import Recruitment from "../../pages/Recruitment/Recruitment";
import Reports from "../../pages/Reports/Reports";
import Settings from "../../pages/Settings/Settings";


const isAuthenticated = () => !!localStorage.getItem("hrms-token");

export const SecureRoutes = () => {
  if (!isAuthenticated()) return <Navigate to="/login" replace />;

  return (
    <MainLayout>
      <Routes>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="employees" element={<Employees />} />
        <Route path="employees/:id" element={<EmployeeDetails />} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="leave-management" element={<LeaveManagement />} />
        <Route path="payroll" element={<Payroll />} />
        <Route path="performance" element={<Performance />} />
        <Route path="recruitment" element={<Recruitment />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<Settings />} />

      </Routes>
    </MainLayout>
  );
};
