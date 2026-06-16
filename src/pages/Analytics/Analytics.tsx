import { Card, Row, Col, Typography } from "antd";
import Sidebar from "../../components/sidebar/Sidebar";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import "./Analytics.css";
import React, { useEffect, useState } from "react";
import { getActiveEmployeeCount, getPayrollCost, getNewJoinersCount } from "../../services/CandidateService";
import { ResponsiveContainer } from "recharts";

const { Title } = Typography;

const attendanceData = [
  { month: "Jan", value: 75 },
  { month: "Feb", value: 82 },
  { month: "Mar", value: 78 },
  { month: "Apr", value: 90 },
  { month: "May", value: 85 },
  { month: "Jun", value: 92 },
];

const performanceData = [
  { name: "Excellent", value: 40 },
  { name: "Good", value: 30 },
  { name: "Average", value: 20 },
  { name: "Poor", value: 10 },
];

const COLORS = ["#22c55e", "#3b82f6", "#f59e0b", "#ef4444"];

const Analytics: React.FC = () => {
  const [totalEmployees, setTotalEmployees] = useState<number>(0);
  const [payrollCost, setPayrollCost] = useState<number>(0);
  const [newJoiners, setNewJoiners] = useState<number>(0);

  useEffect(() => {
    const fetchEmployeeCount = async () => {
      try {
        const res = await getActiveEmployeeCount();
        setTotalEmployees(res.data.total_employees);
      } catch (error) {
        console.error("Failed to fetch employee count", error);
      }
    };

    const fetchPayrollCost = async () => {
      try {
        const res = await getPayrollCost();
        setPayrollCost(res.data.payroll_cost);
      } catch (error) {
        console.error("Failed to fetch payroll cost", error);
      }
    };

    const fetchNewJoiners = async () => {
      try {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1;
        const res = await getNewJoinersCount(year, month);
        setNewJoiners(res.data.new_joiners_count);
      } catch (error) {
        console.error("Failed to fetch new joiners", error);
      }
    };

    fetchEmployeeCount();
    fetchPayrollCost();
    fetchNewJoiners();
  }, []);

  return (
    <div className="hrms-analytics-container">
      <Sidebar />
      <div className="hrms-analytics-main">

        <Title level={2}>📈 Analytics Dashboard</Title>
        <p className="subtitle">Monitor real-time HR statistics and trends.</p>

        {/* ── KPI CARDS ── */}
        <div className="analytics-kpi-section">
          <Card className="analytics-kpi-card">
            <div className="card-icon">👥</div>
            <h3>Total Employees</h3>
            <p>{totalEmployees}</p>
          </Card>

          <Card className="analytics-kpi-card">
            <div className="card-icon">📅</div>
            <h3>Active Attendance</h3>
            <p>98%</p>
          </Card>

          <Card className="analytics-kpi-card">
            <div className="card-icon">💰</div>
            <h3>Payroll Cost</h3>
            <p>₹ {payrollCost.toLocaleString("en-IN")}</p>
          </Card>

          <Card className="analytics-kpi-card">
            <div className="card-icon">🆕</div>
            <h3>New Joinees</h3>
            <p>{newJoiners}</p>
          </Card>
        </div>

        {/* ── CHARTS ── */}
        <Row gutter={[20, 20]}>
          <Col xs={24} lg={12}>
            <div style={{
              background: "#ffffff",
              borderRadius: 16,
              padding: "20px 24px",
              boxShadow: "0 2px 16px rgba(6,63,63,0.08)",
              border: "0.5px solid #d0e8e8",
            }}>
              <div className="chart-title">📊 Monthly Attendance Trend</div>
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={attendanceData}>
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#0a5252"
                    strokeWidth={3}
                    dot={{ fill: "#1dd9c0", strokeWidth: 2, r: 5 }}
                    activeDot={{ r: 7, fill: "#063f3f" }}
                  />
                  <CartesianGrid stroke="#e8f0f0" strokeDasharray="4 4" />
                  <XAxis dataKey="month" tick={{ fill: "#4a7a7a", fontSize: 12 }} />
                  <YAxis tick={{ fill: "#4a7a7a", fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 10,
                      border: "1px solid #d0e8e8",
                      boxShadow: "0 4px 12px rgba(6,63,63,0.1)",
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Col>

          <Col xs={24} lg={12}>
            <div style={{
              background: "#ffffff",
              borderRadius: 16,
              padding: "20px 24px",
              boxShadow: "0 2px 16px rgba(6,63,63,0.08)",
              border: "0.5px solid #d0e8e8",
            }}>
              <div className="chart-title">🏆 Performance Distribution</div>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    innerRadius={40}
                    data={performanceData}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    labelLine={false}
                  >
                    {performanceData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 10,
                      border: "1px solid #d0e8e8",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Col>
        </Row>

      </div>
    </div>
  );
};

export default Analytics;