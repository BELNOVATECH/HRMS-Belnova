import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../../components/sidebar/Sidebar";

const AttendanceManagement: React.FC = () => {
  return (
    <div className="attendance-page-container">
      <Sidebar />
      <div className="attendance-content">
        <Outlet /> {/* 👈 Attendance / Mark My Attendance loads here */}
      </div>
    </div>
  );
};

export default AttendanceManagement;
