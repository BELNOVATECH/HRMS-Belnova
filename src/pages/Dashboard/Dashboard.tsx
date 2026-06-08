import React, { useEffect, useState } from "react";
import {
  TeamOutlined,
  CheckCircleOutlined,
  StopOutlined,
  WarningOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { Spin } from "antd";
import { useNavigate } from "react-router-dom";
import { getDashboardSummary, getRecentActivities } from "../../services/CandidateService";
import "./Dashboard.css";

interface EmployeeData {
  count: number;
  employees: { id: number; name: string }[];
}
interface Activity {
  id: number;
  employee_first_name: string;
  employee_last_name: string;
  activity_description: string;
  created_date: string;
}



interface DashboardData {
  total_employees: EmployeeData;
  active_employees: EmployeeData;
  inactive_employees: EmployeeData;
  uninformed_leaves: EmployeeData;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState<Activity[]>([]);




useEffect(() => {




  getDashboardSummary()
    .then((res) => setData(res.data))
    .finally(() => setLoading(false));

  getRecentActivities()
    .then((data) => {
      setActivities(data.activities || []);
    })
    .catch(console.error);
}, []);




  const formatDateTime = (ts: string) => {
    const d = new Date(ts);

    const date = d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    const time = d.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });

    return `${date}, ${time}`;
  };

  // ✅ Loader (only for cards)
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <Spin
          indicator={<LoadingOutlined style={{ fontSize: 50 }} spin />}
          tip="Loading dashboard..."
        />
      </div>
    );
  }

  if (!data) return <p>No dashboard data available</p>;

  return (
    <div className="hrms-dashboard-container">
      <div className="hrms-dashboard-main">
        <h1 className="dashboard-heading">Dashboard</h1>

        {/* ================= CARDS SECTION (API DATA) ================= */}
        <div className="hrms-dashboard-cards">
          {/* TOTAL EMPLOYEES */}
          <div
            className="dashboard-card card-total"
            onClick={() => navigate("/employees")}
          >
            <div className="card-icon">
              <TeamOutlined />
            </div>
            <div>
              <h3>Total Employees</h3>
              <p className="card-number">
                {data.total_employees.count}
              </p>
            </div>
          </div>

          {/* ACTIVE EMPLOYEES */}
          <div
            className="dashboard-card card-active"
            onClick={() => navigate("/employees?status=active")}
          >
            <div className="card-icon">
              <CheckCircleOutlined />
            </div>
            <div>
              <h3>Active Employees</h3>
              <p className="card-number">
                {data.active_employees.count}
              </p>
            </div>
          </div>

          {/* INACTIVE EMPLOYEES */}
          <div
            className="dashboard-card card-inactive"
            onClick={() => navigate("/employees?status=inactive")}
          >
            <div className="card-icon">
              <StopOutlined />
            </div>
            <div>
              <h3>Inactive Employees</h3>
              <p className="card-number">
                {data.inactive_employees.count}
              </p>
            </div>
          </div>

          {/* UNINFORMED LEAVES */}
          <div
            className="dashboard-card card-uninformed"
            onClick={() => navigate("/employees?status=uninformed")}
          >
            <div className="card-icon">
              <WarningOutlined />
            </div>
            <div>
              <h3>Uninformed Leaves</h3>
              <p className="card-number">
                {data.uninformed_leaves.count}
              </p>
            </div>
          </div>
        </div>

        {/* ================= RECENT ACTIVITIES (STATIC) ================= */}
        <div className="recent-table">
          <h2 className="table-heading">Recent Activities</h2>

          <table className="activities-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Activity</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {activities.length === 0 ? (
                <tr>
                  <td colSpan={3} style={{ textAlign: "center" }}>
                    No recent activity found
                  </td>
                </tr>
              ) : (
                activities.map((item) => (
                  <tr key={item.id}>
                    <td>
                      {item.employee_first_name} {item.employee_last_name}
                    </td>
                    <td>{item.activity_description}</td>
                    <td>{formatDateTime(item.created_date)}</td>
                  </tr>
                ))

              )}
            </tbody>

          </table>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
