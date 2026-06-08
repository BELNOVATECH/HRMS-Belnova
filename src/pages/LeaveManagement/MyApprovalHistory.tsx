import React, { useEffect, useState } from "react";
import { Table, Spin, Tag, message, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { getLeavesApi } from "../../services/leaveListService";


interface MyApprovalHistoryItem {
  leave_request_id: number;
  emp_id: number;
  employee_name?: string;

  leave_type: string;
  start_date: string;
  end_date: string;
  total_days: number;
  status: string;
  reason?: string;
}

const MyApprovalHistory: React.FC = () => {
const managerId = Number(localStorage.getItem("hrms-employee-id"));


  const [data, setData] = useState<MyApprovalHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);

const loadHistory = async () => {
  try {
    setLoading(true);

    const res = await getLeavesApi({
      manager_id: managerId,
    });

    const list = Array.isArray(res.data)
      ? res.data.filter(
          (r: any) =>
            r.status_name === "Approved" ||
            r.status_name === "Rejected"
        )
      : [];

    const mapped = list.map((r: any) => ({
      leave_request_id: r.leave_request_id,
      emp_id: r.emp_id,
      employee_name: r.emp_name,
      leave_type: r.leave_type,
      start_date: r.start_date,
      end_date: r.end_date,
      total_days: r.total_days,
      status: r.status_name,
      reason: r.reason,
    }));

    setData(mapped);
  } catch (err) {
    message.error("Failed to load approval history");
  } finally {
    setLoading(false);
  }
};
useEffect(() => {
  const handler = () => {
    loadHistory(); // ✅ reload history after approve/reject
  };

  window.addEventListener("leave-updated", handler);

  return () => {
    window.removeEventListener("leave-updated", handler);
  };
}, []);



  useEffect(() => {
    if (managerId) loadHistory();
  }, [managerId]);

  const columns: ColumnsType<MyApprovalHistoryItem> = [
    {
      title: "Employee Name",
      dataIndex: "employee_name",
      align: "center",
      render: (text) => text || "-",
    },
    {
      title: "Leave Type",
      dataIndex: "leave_type",
      align: "center",
    },
    {
      title: "From",
      dataIndex: "start_date",
      align: "center",
      render: (d) => dayjs(d).format("DD MMM YYYY"),
    },
    {
      title: "To",
      dataIndex: "end_date",
      align: "center",
      render: (d) => dayjs(d).format("DD MMM YYYY"),
    },
    {
      title: "Days",
      dataIndex: "total_days",
      align: "center",
    },
    {
      title: "Status",
      dataIndex: "status",
      align: "center",
      render: (status) => (
        <Tag color={status === "Approved" ? "green" : "red"}>
          {status}
        </Tag>
      ),
    },
     {
      title: "Reason",
      dataIndex: "reason",
      align: "center",
      render: (text: string) => {
        if (!text) return "-";

        return (
          <Tooltip title={text}>
            <span
              style={{
                maxWidth: 100,
                display: "inline-block",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                verticalAlign: "middle",
              }}
            >
              {text}
            </span>
          </Tooltip>
        );
      },
    }
  ];

  return (
    <Spin spinning={loading}>
      <Table
        rowKey="leave_request_id"
        columns={columns}
        dataSource={data}
        pagination={false}
      />
    </Spin>
  );
};

export default MyApprovalHistory;
