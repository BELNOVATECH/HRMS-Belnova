import React from "react";
import { Card } from "antd";

const data = [
  { title: "Total Employees", value: 120 },
  { title: "Leaves Pending", value: 5 },
  { title: "Upcoming Holidays", value: 3 },
  { title: "Monthly Salary Expense", value: "$45,000" },
];

const DashboardCards: React.FC = () => {
  return (
    <div className="hrms-dashboard-cards">
      {data.map((item, index) => (
        <Card key={index} title={item.title}>
          {item.value}
        </Card>
      ))}
    </div>
  );
};

export default DashboardCards;
