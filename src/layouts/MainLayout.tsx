import React from "react";
import Sidebar from "../components/sidebar/Sidebar";
import Navbar from "../components/navbar/Navbar";

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="main-layout">
      <Navbar />
      <div className="content-layout">
        <Sidebar />
        <main className="main-content">{children}</main>
      </div>
    </div>
  );
};

export default MainLayout;
