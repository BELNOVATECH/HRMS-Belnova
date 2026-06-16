import React, { useState, useEffect } from "react";
import { AutoComplete, Input, Badge, Avatar, Dropdown } from "antd";
import {
  BellOutlined,
  UserOutlined,
  SearchOutlined,
  DashboardOutlined,
  TeamOutlined,
  CalendarOutlined,
  FileTextOutlined,
  DollarOutlined,
  TrophyOutlined,
  SolutionOutlined,
  BarChartOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/sidebar/Sidebar";
// @ts-ignore
import "./Navbar.css";
// @ts-ignore
import logo from "../../assets/Logo/logo.jpg";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [options, setOptions] = useState<{ value: string; path?: string }[]>([]);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const menuItems = [
    { key: "/dashboard", label: "Dashboard", icon: <DashboardOutlined /> },
    { key: "/employees", label: "Employees", icon: <TeamOutlined /> },
    { key: "/attendance", label: "Attendance", icon: <CalendarOutlined /> },
    { key: "/leave-management", label: "Leave Management", icon: <FileTextOutlined /> },
    { key: "/payroll", label: "Payroll", icon: <DollarOutlined /> },
    { key: "/performance", label: "Performance", icon: <TrophyOutlined /> },
    { key: "/recruitment", label: "Recruitment", icon: <SolutionOutlined /> },
    { key: "/reports", label: "Reports", icon: <BarChartOutlined /> },
    { key: "/settings", label: "Settings", icon: <SettingOutlined /> },
  ];

  const notifications = [
    { id: 1, text: "Mahesh applied for leave", path: "/leave-management" },
    { id: 2, text: "Shiva updated profile", path: "/profile" },
    { id: 3, text: "Rajesh marked attendance", path: "/attendance" },
    { id: 4, text: "Payroll generated for November", path: "/payroll" },
  ];

  const employees = [
    { id: 1, name: "Mahesh Kesani", path: "/employees/1" },
    { id: 2, name: "Shiva Kumar", path: "/employees/2" },
    { id: 3, name: "Rajesh Singh", path: "/employees/3" },
  ];

  const handleSearchChange = (value: string) => {
    const menuResults = menuItems
      .filter((item) => item.label.toLowerCase().includes(value.toLowerCase()))
      .map((item) => ({ value: item.label, path: item.key }));

    const notificationResults = notifications
      .filter((n) => n.text.toLowerCase().includes(value.toLowerCase()))
      .map((n) => ({ value: n.text, path: n.path }));

    const employeeResults = employees
      .filter((e) => e.name.toLowerCase().includes(value.toLowerCase()))
      .map((e) => ({ value: e.name, path: e.path }));

    setOptions([...menuResults, ...notificationResults, ...employeeResults]);
  };

  const handleSelect = (value: string) => {
    const item =
      menuItems.find((i) => i.label === value) ||
      notifications.find((n) => n.text === value) ||
      employees.find((e) => e.name === value);

    if (item && "path" in item) navigate(item.path);
  };

  return (
    <>
      <div className="hrms-dashboard-navbar">
        <div className="hrms-dashboard-navbar-left">
          {isMobile && (
            <span
              className="navbar-menu-icon"
              onClick={() => setSidebarVisible(true)}
            >
              ☰
            </span>
          )}
        <img src={logo} alt="App Logo" className="navbar-logo" />
<div className="navbar-brand-text">
  <span className="navbar-brand-name">BELNOVA TECH</span>
  <span className="navbar-brand-sub">HRMS PORTAL</span>
</div>
        </div>

        <div className="hrms-dashboard-navbar-right">
          <AutoComplete
            className="navbar-search"
            options={options.map((o) => ({ value: o.value }))}
            onSelect={handleSelect}
            onSearch={handleSearchChange}
            placeholder="Search HRMS..."
          >
            <Input suffix={<SearchOutlined />} style={{ width: "100%" }} />
          </AutoComplete>

   
          <Dropdown
            menu={{
              items: notifications.map((n) => ({
                key: n.id,
                label: <div onClick={() => navigate(n.path)}>{n.text}</div>,
              })),
            }}
            trigger={['click']}
          >
            <Badge count={notifications.length} className="navbar-bell">
              <BellOutlined style={{ fontSize: 20, cursor: 'pointer' }} />
            </Badge>
          </Dropdown>

          {/* User Dropdown */}
          <Dropdown
            menu={{
              items: [
                {
                  key: 'profile',
                  label: <div onClick={() => navigate('/profile')}>Profile</div>,
                },
                {
                  key: 'logout',
                  label: (
                    <div
                      onClick={() => {
                        localStorage.removeItem('hrms-token');
                        navigate('/login');
                      }}
                    >
                      Logout
                    </div>
                  ),
                },
              ],
            }}
            trigger={['click']}
          >
            <Avatar icon={<UserOutlined />} className="navbar-avatar" />
          </Dropdown>
        </div>
      </div>

      {isMobile && (
        <Sidebar
          isMobile={isMobile}
          visible={sidebarVisible}
          onClose={() => setSidebarVisible(false)}
        />
      )}
    </>
  );
};

export default Navbar;
