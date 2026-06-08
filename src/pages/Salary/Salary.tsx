import { useState, useEffect } from "react";
import { Tabs } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import Payslip from "./Payslip";
import SalaryRevision from "./SalaryRevision";

const Salary = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("1");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");
    if (tab) setActiveTab(tab);
  }, [location.search]);

  const onTabChange = (key: string) => {
    setActiveTab(key);
    navigate(`/salary?tab=${key}`);
  };

  return (
    /* ⭐ THIS WRAPPER IS THE FIX */
    <div
      style={{
        width: "100%",
        maxWidth: "100%",
        minWidth: 0,
        overflowX: "hidden",
      }}
    >
      <Tabs
        activeKey={activeTab}
        onChange={onTabChange}
        items={[
          {
            key: "1",
            label: "Payslips",
            children: (
              <div style={{ minWidth: 0 }}>
                <Payslip />
              </div>
            ),
          },
          {
            key: "2",
            label: "Salary Revision",
            children: (
              <div style={{ minWidth: 0 }}>
                <SalaryRevision />
              </div>
            ),
          },
        ]}
      />
    </div>
  );
};

export default Salary;
