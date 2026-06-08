import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";

/* Leave Management */
import LeaveManagement from "./pages/LeaveManagement/LeaveManagement";
import LeaveBalance from "./pages/LeaveManagement/LeaveBalance";
import LeaveCalendar from "./pages/LeaveManagement/LeaveCalendar";
import HolidayCalendar from "./pages/LeaveManagement/HolidayCalendar";

/* Core Pages */
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";

/* Employees */
import Employees from "./pages/Employees/Employees";
import EmployeeDetails from "./pages/Employees/EmployeeDetails";

/* Attendance Management */
import AttendanceManagement from "./pages/AttendanceManagement/AttendanceManagement";
import Attendance from "./pages/AttendanceManagement/Attendance";
import MarkAttendance from "./pages/AttendanceManagement/MarkMyAttendance";



/* Task Management */
import TaskManagement from "./pages/TaskManagement/Taskmanagement";
import CreateTask from "./pages/TaskManagement/CreateTask";
import AssignTask from "./pages/TaskManagement/AssignTask";
import TaskBoard from "./pages/TaskManagement/TaskBoard";
import TaskHistory from "./pages/TaskManagement/TaskHistory";



import Payroll from "./pages/Payroll/Payroll";
import Performance from "./pages/Performance/Performance";
import Recruitment from "./pages/Recruitment/Recruitment";
import Config from "./pages/Config/ConfigPage";
import Reports from "./pages/Reports/Reports";
import Analytics from "./pages/Analytics/Analytics";
import Settings from "./pages/Settings/Settings";

import Salary from "./pages/Salary/Salary";
import Payslip from "./pages/Salary/Payslip";

import Access from "./pages/Access/Access";

import ProtectedRoute from "./Routes/ProtectedRoute";
import Unauthorized from "./pages/Unauthorized/Unauthorized";
import LeavePending from "./pages/LeaveManagement/LeavePending";
import MyApprovals from "./pages/LeaveManagement/MyApprovals";
import ITDeclaration from "./pages/Salary/ITDeclaration";
import ProofOfInvestment from "./pages/Salary/Proofofinvestment";



const isAuthenticated = () => !!localStorage.getItem("hrms-token");

/** ✅ For Dashboard (only login check) */
const AuthOnly = ({ children }: { children: React.ReactNode }) => {
  return isAuthenticated() ? (
    <MainLayout>{children}</MainLayout>
  ) : (
    <Navigate to="/login" replace />
  );
};

/** ✅ For all modules (login + permission check) */
const WithPermission = ({
  children,
  screen,
}: {
  children: React.ReactNode;
  screen: string;
}) => {
  return (
    <AuthOnly>
      <ProtectedRoute screen={screen}>{children}</ProtectedRoute>
    </AuthOnly>
  );
};

const AppRoutes = () => (
  <Routes>
    {/* ✅ Default */}
    <Route path="/" element={<Login />} />

    {/* ✅ Login */}
    <Route path="/login" element={<Login />} />
    <Route path="/unauthorized" element={<Unauthorized />} />


    {/* ✅ Dashboard for all logged-in users */}
   <Route
  path="/dashboard"
  element={
    <WithPermission screen="Dashboard">
      <Dashboard />
    </WithPermission>
  }
/>


    {/* ✅ Employees */}
    <Route
      path="/employees"
      element={
        <WithPermission screen="Employees">
          <Employees />
        </WithPermission>
      }
    />
    <Route
      path="/employees/:id"
      element={
        <WithPermission screen="Employees">
          <EmployeeDetails />
        </WithPermission>
      }
    />

    {/* ✅ Attendance */}
<Route
  path="/attendance-management"
  element={
    <WithPermission screen="Attendance Management">
      <AttendanceManagement />
    </WithPermission>
  }
>
  <Route index element={<Navigate to="attendance" replace />} />

  <Route
    path="attendance"
    element={
      <WithPermission screen="Attendance">
        <Attendance />
      </WithPermission>
    }
  />

  <Route
    path="mark"
    element={
      <WithPermission screen="Mark Attendance">
        <MarkAttendance />
      </WithPermission>
    }
  />
</Route>




{/* ✅ Task Management */}
<Route
  path="/task-management/create"
  element={
    <WithPermission screen="Create Task">
      <CreateTask />
    </WithPermission>
  }
/>

<Route
  path="/task-management/assign"
  element={
    <WithPermission screen="Assign Task">
      <AssignTask />
    </WithPermission>
  }
/>
<Route
  path="/task-management/board"
  element={
    <WithPermission screen="Task Board">
      <TaskBoard />
    </WithPermission>
  }
/>


<Route
  path="/task-management/history"
  element={
    <WithPermission screen="Task History">
      <TaskHistory />
    </WithPermission>
  }
/>


    {/* ✅ Leave Management */}
{/* ✅ Leave Management */}
<Route
  path="/leave-management/apply"
  element={
    <WithPermission screen="Leave Apply">
      <LeaveManagement />
    </WithPermission>
  }
/>

<Route
  path="/leave-management/balance"
  element={
    <WithPermission screen="Leave Balance">
      <LeaveBalance />
    </WithPermission>
  }
/>

<Route
  path="/leave-management/calendar"
  element={
    <WithPermission screen="Leave Calendar">
      <LeaveCalendar />
    </WithPermission>
  }
/>

<Route
  path="/leave-management/approvals"
  element={
    <WithPermission screen="My Approvals">
      <MyApprovals />
    </WithPermission>
  }
/>

<Route
  path="/leave-management/holidays"
  element={
    <WithPermission screen="Holiday Calendar">
      <HolidayCalendar />
    </WithPermission>
  }
/>


    {/* ✅ Payroll */}
    <Route
      path="/payroll"
      element={
        <WithPermission screen="Payroll Management">
          <Payroll />
        </WithPermission>
      }
    />

    {/* ✅ Salary */}
    <Route
      path="/salary"
      element={
        <WithPermission screen="Salary">
          <Salary />
        </WithPermission>
      }
    />

    {/* ✅ Payslip ✅ FIXED */}
    <Route
      path="/payslip"
      element={
        <WithPermission screen="Payslips">
          <Payslip />
        </WithPermission>
      }
    />

    <Route
  path="/salary/it-declaration"
  element={
    <WithPermission screen="IT Declaration">
      <ITDeclaration />
    </WithPermission>
  }
/>
<Route
  path="/salary/proof-of-investment"
  element={
    <WithPermission screen="Proof of Investment">
      <ProofOfInvestment />
    </WithPermission>
  }
/>



    {/* ✅ Performance */}
    <Route
      path="/performance"
      element={
        <WithPermission screen="Performance">
          <Performance />
        </WithPermission>
      }
    />

    {/* ✅ Recruitment */}
    <Route
      path="/recruitment"
      element={
        <WithPermission screen="Recruitment">
          <Recruitment />
        </WithPermission>
      }
    />

    {/* ✅ Config */}
    <Route
      path="/config"
      element={
        <WithPermission screen="Config">
          <Config />
        </WithPermission>
      }
    />

    {/* ✅ Access */}
    <Route
      path="/access"
      element={
        <WithPermission screen="Access Management">
          <Access />
        </WithPermission>
      }
    />

    {/* ✅ Reports */}
    <Route
      path="/reports"
      element={
        <WithPermission screen="Reports">
          <Reports />
        </WithPermission>
      }
    />

    {/* ✅ Analytics */}
    <Route
      path="/analytics"
      element={
        <WithPermission screen="Analytics">
          <Analytics />
        </WithPermission>
      }
    />

    {/* ✅ Settings */}
    <Route
      path="/settings"
      element={
        <WithPermission screen="Settings">
          <Settings />
        </WithPermission>
      }
    />

    {/* ✅ Unknown */}
    <Route path="*" element={<Navigate to="/login" replace />} />
  </Routes>
);

export default AppRoutes;
