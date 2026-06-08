// LeaveManagement.tsx
import { useState, useEffect } from "react";
import { Tabs } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import LeaveApply from "./LeaveApply";
import LeavePending from "./LeavePending";
import LeaveHistory from "./LeaveHistory";
import "./LeaveManagement.css";

const LeaveManagement = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("1");

  // 🔁 URL → Tabs sync
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");
    if (tab) setActiveTab(tab);
  }, [location.search]);

  const onTabChange = (key: string) => {
    setActiveTab(key);
    navigate(`/leave-management/apply?tab=${key}`);
  };

  const tabItems = [
    {
      key: "1",
      label: "Apply",
      children: <LeaveApply />,
    },
    {
      key: "2",
      label: "Pending",
      children: <LeavePending />,
    },
    {
      key: "3",
      label: "History",
      children: <LeaveHistory />,
    },
  ];

  return (
    <div className="leave-page-container">
      <Tabs
        key={location.search} // 🔥 forces remount on tab change
        activeKey={activeTab}
        onChange={onTabChange}
        centered
        items={tabItems}
      />
    </div>
  );
};

export default LeaveManagement;
