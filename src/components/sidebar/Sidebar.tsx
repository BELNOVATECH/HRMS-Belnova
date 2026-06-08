import React, { useState, useEffect, useMemo } from "react";
import { Menu, Modal } from "antd";
import type { MenuProps } from "antd";
import { useNavigate, useLocation } from "react-router-dom";

import {
  DashboardOutlined,
  TeamOutlined,
  CalendarOutlined,
  FileTextOutlined,
  DollarOutlined,
  TrophyOutlined,
  SolutionOutlined,
  SettingOutlined,
  LogoutOutlined,
  PieChartOutlined,
  ProjectOutlined,
  SafetyOutlined,
} from "@ant-design/icons";

import "./Sidebar.css";
import { canAccessScreen } from "../../utils/permission";
import { logout } from "../../utils/auth";

interface SidebarProps {
  isMobile?: boolean;
  visible?: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isMobile = false,
  visible = false,
  onClose,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [logoutVisible, setLogoutVisible] = useState(false);
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const [permVersion, setPermVersion] = useState(0);
  const rootSubmenuKeys = ["task-root", "leave-root", "salary-root","attendance-root"];


  /* ================= SYNC SUBMENU WITH ROUTE ================= */
useEffect(() => {
  const keys: string[] = [];

  if (location.pathname.startsWith("/leave-management")) {
    keys.push("leave-root");
  }
  if (location.pathname.startsWith("/task-management")) {
    keys.push("task-root");
  }
  if (location.pathname.startsWith("/salary")) {
    keys.push("salary-root");
  }
  if (location.pathname.startsWith("/attendance-management")) {
    keys.push("attendance-root"); // ✅ ADD THIS
  }
  setOpenKeys((prev) => Array.from(new Set([...prev, ...keys])));
}, [location.pathname]);


  /* ================= LISTEN PERMISSION CHANGES ================= */
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "hrms-permissions") {
        setPermVersion((prev) => prev + 1);
      }
    };

    window.addEventListener("storage", handleStorage);
    setPermVersion((prev) => prev + 1);

    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  /* ================= MENU ITEMS ================= */
  const items: MenuProps["items"] = useMemo(() => {
    const menu: MenuProps["items"] = [];

    if (canAccessScreen("Dashboard"))
      menu.push({
        key: "/dashboard",
        icon: <DashboardOutlined />,
        label: "Dashboard",
      });

    if (canAccessScreen("Employees"))
      menu.push({
        key: "/employees",
        icon: <TeamOutlined />,
        label: "Employees",
      });

const attendanceChildren = [
  canAccessScreen("Attendance") && {
    key: "/attendance-management/attendance",
    label: "Attendance",
  },
  canAccessScreen("Mark Attendance") && {
    key: "/attendance-management/mark",
    label: "Mark My Attendance",
  },
].filter(Boolean) as any[];

if (
  canAccessScreen("Attendance Management") ||
  attendanceChildren.length > 0
) {

  if (attendanceChildren.length > 0) {
    menu.push({
      key: "attendance-root",
      icon: <CalendarOutlined />,
      label: "Attendance Management",
      children: attendanceChildren,
    });
  } else {
    menu.push({
      key: "/attendance-management",
      icon: <CalendarOutlined />,
      label: "Attendance Management",
    });
  }
}





    /* ===== Task Management ===== */
    const taskChildren = [
  canAccessScreen("Create Task") && {
    key: "/task-management/create",
    label: "Create Task",
  },
  canAccessScreen("Assign Task") && {
    key: "/task-management/assign",
    label: "Assign Task",
  },
  canAccessScreen("Task Board") && {
    key: "/task-management/board",
    label: "Task Board",
  },
  canAccessScreen("Task History") && {
    key: "/task-management/history",
    label: "Task History",
  },
].filter(Boolean) as any[];

if (
  canAccessScreen("Task Management") ||
  taskChildren.length > 0
) {
  if (taskChildren.length > 0) {
    menu.push({
      key: "task-root",
      icon: <ProjectOutlined />,
      label: "Task Management",
      children: taskChildren,
    });
  } else {
    menu.push({
      key: "/task-management",
      icon: <ProjectOutlined />,
      label: "Task Management",
    });
  }
}


    /* ===== Leave Management ===== */
   const leaveChildren = [
  canAccessScreen("Leave Apply") && {
    key: "/leave-management/apply",
    label: "Leave Apply",
  },
  canAccessScreen("Leave Balance") && {
    key: "/leave-management/balance",
    label: "Leave Balance",
  },
  canAccessScreen("Leave Calendar") && {
    key: "/leave-management/calendar",
    label: "Leave Calendar",
  },
  canAccessScreen("My Approvals") && {
    key: "/leave-management/approvals",
    label: "My Approvals",
  },
  canAccessScreen("Holiday Calendar") && {
    key: "/leave-management/holidays",
    label: "Holiday Calendar",
  },
].filter(Boolean) as any[];


if (
  canAccessScreen("Leave Management") ||
  leaveChildren.length > 0
) {

  if (leaveChildren.length > 0) {
    menu.push({
      key: "leave-root",
      icon: <FileTextOutlined />,
      label: "Leave Management",
      children: leaveChildren,
    });
  } else {
    menu.push({
      key: "/leave-management",
      icon: <FileTextOutlined />,
      label: "Leave Management",
    });
  }
}


    if (canAccessScreen("Payroll Management"))
      menu.push({
        key: "/payroll",
        icon: <DollarOutlined />,
        label: "Payroll Management",
      });

    /* ===== Salary (FINAL – SINGLE SOURCE) ===== */
    const salaryChildren = [
      canAccessScreen("Payslips") && {
        key: "/salary?tab=1",
        label: "Payslips",
      },
      canAccessScreen("Salary Revision") && {
        key: "/salary?tab=2",
        label: "Salary Revision",
      },
        canAccessScreen("IT Declaration") && {
    key: "/salary/it-declaration",
    label: "IT Declaration",
  },

  canAccessScreen("Proof of Investment") && {
  key: "/salary/proof-of-investment",
  label: "Proof of Investment",
},

    ].filter(Boolean) as any[];

if (
  canAccessScreen("Salary") ||
  salaryChildren.length > 0
) {
  if (salaryChildren.length > 0) {
    menu.push({
      key: "salary-root",
      icon: <DollarOutlined />,
      label: "Salary",
      children: salaryChildren,
    });
  } else {
    menu.push({
      key: "/salary",
      icon: <DollarOutlined />,
      label: "Salary",
    });
  }
}


    if (canAccessScreen("Performance"))
      menu.push({
        key: "/performance",
        icon: <TrophyOutlined />,
        label: "Performance",
      });

    if (canAccessScreen("Recruitment"))
      menu.push({
        key: "/recruitment",
        icon: <SolutionOutlined />,
        label: "Recruitment",
      });

    if (canAccessScreen("Config"))
      menu.push({
        key: "/config",
        icon: <SettingOutlined />,
        label: "Config",
      });

    if (canAccessScreen("Reports"))
      menu.push({
        key: "/reports",
        icon: <FileTextOutlined />,
        label: "Reports",
      });

    if (canAccessScreen("Analytics"))
      menu.push({
        key: "/analytics",
        icon: <PieChartOutlined />,
        label: "Analytics",
      });

    if (canAccessScreen("Access Management"))
      menu.push({
        key: "/access",
        icon: <SafetyOutlined />,
        label: "Access Management",
      });

    if (canAccessScreen("Settings"))
      menu.push({
        key: "/settings",
        icon: <SettingOutlined />,
        label: "Settings",
      });

    menu.push({
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
    });

    return menu;
  }, [permVersion]);

  /* ================= SELECTED MENU ================= */
  const selectedKey = useMemo(() => {
    if (location.pathname === "/salary") {
      const tab = new URLSearchParams(location.search).get("tab");
      return tab === "2" ? "/salary?tab=2" : "/salary?tab=1";
    }
    return location.pathname;
  }, [location.pathname, location.search]);
  

  /* ================= HANDLERS ================= */
const handleOpenChange: MenuProps["onOpenChange"] = (keys) => {
  const latestOpenKey = keys.find(
    (key) => !openKeys.includes(key)
  );

  if (latestOpenKey && rootSubmenuKeys.includes(latestOpenKey)) {

    setOpenKeys([latestOpenKey]);
  } else {
    setOpenKeys(keys);
  }
};



  const handleMenuClick: MenuProps["onClick"] = ({ key }) => {
    if (key === "logout") {
      setLogoutVisible(true);
      return;
    }

    navigate(key as string);
    if (isMobile && onClose) onClose();
  };

  return (
    <div className={`hrms-dashboard-sidebar ${isMobile && visible ? "active" : ""}`}>
      <Menu
        theme="dark"
        mode="inline"
        items={items}
        selectedKeys={[selectedKey]}
        openKeys={openKeys}
        onOpenChange={handleOpenChange}
        onClick={handleMenuClick}
      />

      <Modal
        open={logoutVisible}
        title="Logout Confirmation"
        okText="Yes"
        cancelText="No"
        onOk={() => {
          logout();
          navigate("/login");
        }}
        onCancel={() => setLogoutVisible(false)}
        destroyOnClose
      >
        Are you sure you want to logout?
      </Modal>
    </div>
  );
};

export default Sidebar;
