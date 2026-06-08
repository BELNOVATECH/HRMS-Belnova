import React from "react";
import "./Topbar.css";
import { Bell, Menu, User } from "lucide-react"; // for icons

const Topbar: React.FC = () => {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="menu-btn">
          <Menu size={22} />
        </button>
        <h2 className="brand">RM1 HRMS</h2>
      </div>

      <div className="topbar-center">
        <input
          type="text"
          placeholder="Search..."
          className="search-input"
        />
      </div>

      <div className="topbar-right">
        <div className="notification">
          <Bell size={20} />
          <span className="badge">5</span>
        </div>
        <div className="profile-icon">
          <User size={20} />
        </div>
      </div>
    </header>
  );
};

export default Topbar;
