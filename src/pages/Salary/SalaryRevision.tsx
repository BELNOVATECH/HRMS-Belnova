import React from "react";
import { Card, Typography, Table } from "antd";
import { ResponsiveContainer } from "recharts";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import "./SalaryRevision.css";

const { Title } = Typography;

/* ================= GRAPH DATA ================= */
/* X-axis: Year of Joining | Y-axis: Salary in Lakhs */

const lineData = [
  { year: 2019, salary: 2.5 },
  { year: 2020, salary: 1.8 },
  { year: 2021, salary: 3.6 },
  { year: 2022, salary: 5.2 },
  { year: 2023, salary: 4.0 },
];

const tableData = [
  {
    key: 1,
    lastRevision: "15-Jan-2024",
    payout: "Jan 24",
    revised: "65,000",
    previous: "58,000",
    duration: "12 M",
    amount: "7,000",
    percentage: "12%",
  },
  {
    key: 2,
    lastRevision: "15-Jan-2023",
    payout: "Jan 23",
    revised: "58,000",
    previous: "52,000",
    duration: "12 M",
    amount: "6,000",
    percentage: "11.5%",
  },
];

const SalaryRevision: React.FC = () => {
  return (
    <div className="salary-revision-page">
      <Title level={3}>Salary Revision Analytics</Title>

      {/* ================= GRAPH ================= */}
      <Card title="Salary Growth by Year of Joining" className="chart-card">
        <div className="chart-center">
  <div className="chart-box">
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={lineData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="year"
          label={{
            value: "Year of Joining",
            position: "insideBottom",
            offset: -5,
          }}
        />
        <YAxis
          label={{
            value: "Salary (Lakhs)",
            angle: -90,
            position: "insideLeft",
          }}
        />
        <Tooltip formatter={(v) => `${v} L`} />
        <Line
          type="monotone"
          dataKey="salary"
          stroke="#2563eb"
          strokeWidth={3}
          dot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
</div>

      </Card>

 <Card title="CTC Revision Details" className="table-card">
  <Table
  size="small"
  pagination={false}
  scroll={{ x: 760 }}   // 🔥 THIS IS THE KEY
  tableLayout="fixed"
  dataSource={[
    {
      key: 1,
      lastRevision: "15-Jan-2024",
      payout: "Jan 24",
      revised: "65,000",
      previous: "58,000",
      duration: "12 M",
      amount: "7,000",
      percentage: "12%",
    },
    {
      key: 2,
      lastRevision: "15-Jan-2023",
      payout: "Jan 23",
      revised: "58,000",
      previous: "52,000",
      duration: "12 M",
      amount: "6,000",
      percentage: "11.5%",
    },
  ]}
  columns={[
    { title: "Last Revision", dataIndex: "lastRevision", width: 120 },
    { title: "Payout", dataIndex: "payout", width: 80 },
    { title: "Revised CTC", dataIndex: "revised", width: 110, align: "right" },
    { title: "Previous CTC", dataIndex: "previous", width: 120, align: "right" },
    { title: "Duration", dataIndex: "duration", width: 90, align: "center" },
    { title: "Amount", dataIndex: "amount", width: 100, align: "right" },
    { title: "%", dataIndex: "percentage", width: 70, align: "center" },
  ]}
/>

</Card>

    </div>
  );
};

export default SalaryRevision;
