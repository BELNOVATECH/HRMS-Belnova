// import React from "react";
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
        const month = now.getMonth() + 1; // JS month starts from 0

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

        <div className="analytics-kpi-section">
          <Card className="analytics-kpi-card">
            <h3>Total Employees</h3>
            <p>{totalEmployees}</p>
          </Card>
          <Card className="analytics-kpi-card"><h3>Active Attendance</h3><p>98%</p></Card>
          <Card className="analytics-kpi-card">
            <h3>Payroll Cost</h3>
            <p>₹ {payrollCost.toLocaleString("en-IN")}</p>
          </Card>
          <Card className="analytics-kpi-card">
            <h3>New Joinees</h3>
            <p>{newJoiners}</p>
          </Card>
        </div>

        <Row gutter={20}>
          <Col xs={24} lg={12}>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={attendanceData}>
                <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} />
                <CartesianGrid stroke="#ccc" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
              </LineChart>
            </ResponsiveContainer>

          </Col>

          <Col xs={24} lg={12}>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  data={performanceData}
                  dataKey="value"
                  label
                >
                  {performanceData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>

          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Analytics;
