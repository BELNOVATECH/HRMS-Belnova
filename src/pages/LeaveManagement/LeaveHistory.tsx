import React, { useEffect, useState } from "react";
import { Table, Tag, Spin, message, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  getLeavesByEmployeeIdApi,
  EmployeeLeaveItem,
} from "../../services/leaveHistoryService";
import "./LeaveHistory.css";

const LeaveHistory: React.FC = () => {
  // const empId = Number(localStorage.getItem("hrms-employee-id"));
const empId=203;
  const [data, setData] = useState<EmployeeLeaveItem[]>([]);
  const [loading, setLoading] = useState(false);
  const LEAVE_STATUS_MAP: Record<number, { label: string; color: string }> = {
  10: { label: "Approved", color: "green" },
  3: { label: "Rejected", color: "red" },
  13: { label: "Cancelled", color: "orange" },
};


  /* ================= LOAD HISTORY ================= */
  const loadHistory = async () => {
    try {
      setLoading(true);

      const res = await getLeavesByEmployeeIdApi(empId);

      let rows: EmployeeLeaveItem[] = Array.isArray(res.data)
        ? res.data
        : [];

      // ✅ SAFETY FILTER (extra protection)
      rows = rows.filter((r) => r.emp_id === empId);

    // status_id mapping:
// Approved = 2
// Rejected = 3
// Cancelled = 13

rows = rows.filter((r) => LEAVE_STATUS_MAP[r.status_id]);


      // ✅ LATEST FIRST
      rows.sort((a, b) => {
        const endA = new Date(a.end_date).getTime();
        const endB = new Date(b.end_date).getTime();
        return endB - endA;
      });

      setData(rows);
    } catch (error) {
      console.error(error);
      message.error("Failed to load leave history");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!empId) {
      message.error("Employee not found. Please login again.");
      return;
    }
    loadHistory();
  }, [empId]);

  /* ================= TABLE COLUMNS ================= */
  const columns: ColumnsType<EmployeeLeaveItem> = [
    {
      title: "Leave Type",
      dataIndex: "leave_type",
      align: "center",
    },
    {
      title: "From",
      dataIndex: "start_date",
      align: "center",
    },
    {
      title: "To",
      dataIndex: "end_date",
      align: "center",
    },
    {
      title: "Days",
      dataIndex: "total_days",
      align: "center",
    },
{
  title: "Status",
  dataIndex: "status_id",
  align: "center",
  render: (statusId: number) => {
    const status = LEAVE_STATUS_MAP[statusId];

    if (!status) return "-";

    return (
      <Tag color={status.color}>
        {status.label}
      </Tag>
    );
  },
},

    {
      title: "Reason",
      dataIndex: "reason",
        align: "center",

      render: (text: string) =>
        text ? (
          <Tooltip title={text}>
            <span
              style={{
                maxWidth: 120,
                display: "inline-block",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {text}
            </span>
          </Tooltip>
        ) : (
          "-"
        ),
    },
  ];

  return (
    <div className="history-container">
      <Spin spinning={loading}>
        <Table
          rowKey="leave_request_id"
          columns={columns}
          dataSource={data}
          pagination={false}
          locale={{ emptyText: "No leave history found" }}
        />
      </Spin>
    </div>
  );
};

export default LeaveHistory;
