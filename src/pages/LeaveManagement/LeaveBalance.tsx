import React, { useEffect, useState } from "react";
import { Card, Button, Select, Progress, Spin, message } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

import {
  getLeaveBalanceApi,
  BackendLeaveBalance,
} from "../../services/leaveBalanceService";

import "./LeaveBalance.css";

interface LeaveItem {
  type_of_leave: string;
  total_leaves: number;
  leaves_taken: number;
  leaves_remaining: number;
}

const LeaveBalance: React.FC = () => {
  const navigate = useNavigate();
const empId = Number(localStorage.getItem("hrms-employee-id"));

  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [month] = useState<number>(new Date().getMonth() + 1);
  const [leaves, setLeaves] = useState<LeaveItem[]>([]);
  const [loading, setLoading] = useState(false);

  const loadLeaveBalance = async () => {
    try {
      setLoading(true);

      const res = await getLeaveBalanceApi(empId, year, month);

      const mappedLeaves: LeaveItem[] =
        res.data?.leaves?.map((l: BackendLeaveBalance) => ({
          type_of_leave: l.leave_type,
          total_leaves: l.granted,
          leaves_taken: l.consumed,
          leaves_remaining: l.balance,
        })) || [];

      setLeaves(mappedLeaves);
    } catch (err) {
      console.error(err);
      message.error("Failed to load leave balance");
      setLeaves([]);
    } finally {
      setLoading(false);
    }
  };
useEffect(() => {
  if (!empId) {
    message.error("Employee not found. Please login again.");
    return;
  }

  loadLeaveBalance();
}, [empId, year]);


  useEffect(() => {
    const refresh = () => loadLeaveBalance();
    window.addEventListener("leave-updated", refresh);
    return () => window.removeEventListener("leave-updated", refresh);
  }, []);

  // ✅ Export CSV
  const exportToCSV = () => {
    if (leaves.length === 0) {
      message.warning("No leave data to export");
      return;
    }

    const headers = ["Leave Type", "Total Leaves", "Leaves Taken", "Leaves Remaining"];

    const rows = leaves.map((l) => [
      l.type_of_leave,
      l.total_leaves,
      l.leaves_taken,
      l.leaves_remaining,
    ]);

    const csvContent = [headers, ...rows].map((e) => e.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `leave_balance_${year}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="leave-balance-wrapper">
      <div className="leave-balance-header">
        <h2>Leave Balance</h2>

        <div className="leave-balance-actions">
          <Select
            value={year}
            onChange={setYear}
            options={[
              { value: 2024, label: 2024 },
              { value: 2025, label: 2025 },
              { value: 2026, label: 2026 },
              { value: 2027, label: 2027 },
              { value: 2028, label: 2028 },
              { value: 2029, label: 2029 },
              { value: 2030, label: 2030 },
              { value: 2031, label: 2031 },
              { value: 2032, label: 2032 },
            ]}
          />

          <Button type="primary" onClick={() => navigate("/leave-management/apply?tab=1")}>
            Apply
          </Button>

          <Button icon={<DownloadOutlined />} onClick={exportToCSV}>
            Export
          </Button>
        </div>
      </div>

      <Spin spinning={loading}>
        <div className="leave-cards-grid">
          {leaves.map((leave) => {
            const percent =
              leave.total_leaves > 0
                ? Math.round((leave.leaves_taken / leave.total_leaves) * 100)
                : 0;

            return (
              <Card key={leave.type_of_leave} className="leave-card">
                <div className="leave-card-header">
                  <span>{leave.type_of_leave}</span>
                  <span>Balance: {leave.leaves_remaining}</span>
                </div>

                <Progress percent={percent} showInfo={false} />

                <div className="leave-card-footer">
                  Consumed: {leave.leaves_taken} / Granted: {leave.total_leaves}
                </div>
              </Card>
            );
          })}
        </div>
      </Spin>
    </div>
  );
};

export default LeaveBalance;
